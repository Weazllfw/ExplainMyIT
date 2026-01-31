/**
 * Stripe Subscription Helper Functions
 * 
 * Utilities for managing subscription status and metadata
 */

import { stripe } from './client';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid'
  | null;

/**
 * Check if a subscription status allows access to Basic features
 */
export function hasActiveSubscription(status: SubscriptionStatus): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}

/**
 * Update user's subscription status in database
 * Uses admin client to bypass RLS (called from webhooks)
 */
export async function updateUserSubscription(params: {
  stripeCustomerId: string;
  subscriptionId: string | null;
  status: SubscriptionStatus;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from('users')
    .update({
      stripe_subscription_id: params.subscriptionId,
      subscription_status: params.status,
      subscription_period_end: params.periodEnd?.toISOString() || null,
      subscription_cancel_at_period_end: params.cancelAtPeriodEnd,
    })
    .eq('stripe_customer_id', params.stripeCustomerId);

  if (error) {
    console.error('[Subscription] Failed to update user:', error);
    throw error;
  }

  console.log(`[Subscription] Updated user ${params.stripeCustomerId} → ${params.status}`);
}

/**
 * Get user's current subscription status from database
 */
export async function getUserSubscriptionStatus(
  authUserId: string
): Promise<SubscriptionStatus> {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('auth_user_id', authUserId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.subscription_status as SubscriptionStatus;
}

/**
 * Get user by Stripe customer ID
 * Uses admin client to bypass RLS (called from webhooks)
 */
export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', stripeCustomerId)
    .single();

  if (error) {
    console.error('[Subscription] Failed to get user by Stripe ID:', error);
    return null;
  }

  return data;
}

/**
 * Get all users with active Basic subscriptions
 * Used by cron job to determine who needs monthly snapshots
 * Uses admin client to bypass RLS
 */
export async function getActiveBasicSubscribers() {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, auth_user_id, email, stripe_customer_id, subscription_period_end')
    .in('subscription_status', ['active', 'trialing', 'past_due']);

  if (error) {
    console.error('[Subscription] Failed to get active subscribers:', error);
    return [];
  }

  return data || [];
}

/**
 * Create or retrieve Stripe customer for a user
 * (Already exists in create-checkout/route.ts - extracted for reuse)
 */
export async function getOrCreateStripeCustomer(params: {
  email: string;
  authUserId: string;
  databaseUserId: string;
}): Promise<string> {
  const supabase = await getSupabaseServerClient();

  // Check if customer already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', params.databaseUserId)
    .single();

  if (existingUser?.stripe_customer_id) {
    return existingUser.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: params.email,
    metadata: {
      auth_user_id: params.authUserId,
      database_user_id: params.databaseUserId,
    },
  });

  // Save to database
  await supabase
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', params.databaseUserId);

  console.log(`[Subscription] Created Stripe customer: ${customer.id}`);

  return customer.id;
}
