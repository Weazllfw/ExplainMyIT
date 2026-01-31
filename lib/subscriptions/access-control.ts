/**
 * Subscription Access Control
 * 
 * Utilities for checking subscription status and gating features
 */

import { getSupabaseServerClient } from '@/lib/db/supabase-server';
import { hasActiveSubscription, type SubscriptionStatus } from '@/lib/stripe/subscriptions';

export interface SubscriptionAccess {
  hasAccess: boolean;
  status: SubscriptionStatus;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  isFreeTier: boolean;
  isBasicTier: boolean;
  canRunSnapshots: boolean;
  message?: string;
}

/**
 * Check if user has access to Basic features
 * 
 * @param authUserId - User's Supabase auth ID
 * @returns Access details including status and permissions
 */
export async function checkSubscriptionAccess(
  authUserId: string
): Promise<SubscriptionAccess> {
  const supabase = await getSupabaseServerClient();

  const { data: user, error } = await supabase
    .from('users')
    .select(
      'subscription_status, subscription_period_end, subscription_cancel_at_period_end'
    )
    .eq('auth_user_id', authUserId)
    .single();

  if (error || !user) {
    // No subscription = free tier
    return {
      hasAccess: false,
      status: null,
      periodEnd: null,
      cancelAtPeriodEnd: false,
      isFreeTier: true,
      isBasicTier: false,
      canRunSnapshots: false,
      message: 'No active subscription',
    };
  }

  const status = user.subscription_status as SubscriptionStatus;
  const hasAccess = hasActiveSubscription(status);
  const periodEnd = user.subscription_period_end
    ? new Date(user.subscription_period_end)
    : null;

  return {
    hasAccess,
    status,
    periodEnd,
    cancelAtPeriodEnd: user.subscription_cancel_at_period_end || false,
    isFreeTier: !status,
    isBasicTier: hasAccess,
    canRunSnapshots: hasAccess,
    message: hasAccess ? 'Active subscription' : getStatusMessage(status),
  };
}

/**
 * Get user-friendly message for subscription status
 */
function getStatusMessage(status: SubscriptionStatus): string {
  switch (status) {
    case 'active':
      return 'Your subscription is active';
    case 'trialing':
      return 'Your trial is active';
    case 'past_due':
      return 'Payment failed - please update your payment method';
    case 'canceled':
      return 'Your subscription has been canceled';
    case 'incomplete':
      return 'Subscription setup incomplete';
    case 'incomplete_expired':
      return 'Subscription setup expired';
    case 'unpaid':
      return 'Subscription unpaid';
    default:
      return 'No active subscription';
  }
}

/**
 * Count how many snapshots a user has run (for free tier limits)
 */
export async function getUserSnapshotCount(authUserId: string): Promise<number> {
  const supabase = await getSupabaseServerClient();

  // Get database user ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single();

  if (!user) {
    return 0;
  }

  // Count snapshots
  const supabase2 = await getSupabaseServerClient();
  const { count, error } = await supabase2
    .from('snapshots')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('[Access Control] Error counting snapshots:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Check if user can run another snapshot (considering free tier limits)
 */
export async function canRunSnapshot(authUserId: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  // Check subscription access
  const access = await checkSubscriptionAccess(authUserId);

  // Basic subscribers can run unlimited snapshots
  if (access.isBasicTier) {
    return { allowed: true };
  }

  // Free tier users are limited (enforced by rate limiting already)
  // This is an additional check for explicit limits if needed
  const snapshotCount = await getUserSnapshotCount(authUserId);

  // For now, we rely on rate limiting
  // But you could add explicit limits here, e.g.:
  // if (snapshotCount >= 3) {
  //   return {
  //     allowed: false,
  //     reason: 'Free tier limit reached. Upgrade to Basic for unlimited snapshots.',
  //   };
  // }

  return { allowed: true };
}
