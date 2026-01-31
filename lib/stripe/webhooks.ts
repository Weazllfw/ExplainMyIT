/**
 * Stripe Webhook Verification and Helpers
 * 
 * Handles webhook signature verification and idempotency
 */

import Stripe from 'stripe';
import { stripe, STRIPE_WEBHOOK_SECRET } from './client';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';

/**
 * Verify webhook signature from Stripe
 * 
 * @throws Error if signature is invalid
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Check if webhook event has already been processed (idempotency)
 * 
 * @returns true if event is new (should be processed)
 * @returns false if event was already processed (skip)
 */
export async function isNewWebhookEvent(eventId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient();

  const { data } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('stripe_event_id', eventId)
    .single();

  return !data; // New if not found
}

/**
 * Record webhook event as processed
 */
export async function recordWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from('stripe_events').insert({
    stripe_event_id: event.id,
    type: event.type,
    data: event.data as any,
  });

  if (error) {
    // Unique constraint violation is OK (means duplicate, which we want to prevent)
    if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
      console.error('[Webhook] Failed to record event:', error);
    }
  }
}

/**
 * Extract subscription details from Stripe event
 */
export function extractSubscriptionDetails(subscription: Stripe.Subscription) {
  return {
    subscriptionId: subscription.id,
    customerId: subscription.customer as string,
    status: subscription.status as any,
    periodEnd: new Date(((subscription as any).current_period_end as number) * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}
