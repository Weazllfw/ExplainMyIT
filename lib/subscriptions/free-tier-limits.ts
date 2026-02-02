/**
 * Free Tier Limits Configuration
 * 
 * Defines explicit limits for free tier users
 */

export const FREE_TIER_LIMITS = {
  // Maximum snapshots per domain for free tier
  MAX_SNAPSHOTS_PER_DOMAIN: 1,
  
  // Maximum unique domains for free tier
  MAX_DOMAINS: 3,
  
  // Cooldown period between snapshots (days)
  // Set to 0 = no re-runs allowed (must upgrade to Basic for ongoing tracking)
  COOLDOWN_DAYS: 0,
};

/**
 * Check if user has exceeded free tier limits
 * 
 * @returns { allowed: boolean, reason?: string, upgradeRequired: boolean }
 */
export async function checkFreeTierLimits(params: {
  userId: string;
  domain: string;
}): Promise<{
  allowed: boolean;
  reason?: string;
  upgradeRequired: boolean;
  limitsUsed?: {
    snapshotsForDomain: number;
    totalDomains: number;
    lastSnapshotDate?: Date;
  };
}> {
  const { getSupabaseAdminClient } = await import('@/lib/db/supabase-admin');
  const supabase = getSupabaseAdminClient();

  // Get all snapshots for this user
  const { data: snapshots, error } = await supabase
    .from('snapshots')
    .select('domain, created_at')
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Free Tier] Error checking limits:', error);
    // Allow on error to avoid blocking legitimate users
    return { allowed: true, upgradeRequired: false };
  }

  if (!snapshots || snapshots.length === 0) {
    // First snapshot - always allowed
    return { allowed: true, upgradeRequired: false };
  }

  // Count snapshots per domain
  const domainCounts = new Map<string, number>();
  const domainLastSnapshot = new Map<string, Date>();

  for (const snapshot of snapshots) {
    const count = domainCounts.get(snapshot.domain) || 0;
    domainCounts.set(snapshot.domain, count + 1);

    const lastDate = domainLastSnapshot.get(snapshot.domain);
    const snapshotDate = new Date(snapshot.created_at);
    if (!lastDate || snapshotDate > lastDate) {
      domainLastSnapshot.set(snapshot.domain, snapshotDate);
    }
  }

  const uniqueDomains = domainCounts.size;
  const snapshotsForThisDomain = domainCounts.get(params.domain) || 0;
  const lastSnapshotForDomain = domainLastSnapshot.get(params.domain);

  // Check: Exceeded max snapshots per domain?
  if (snapshotsForThisDomain >= FREE_TIER_LIMITS.MAX_SNAPSHOTS_PER_DOMAIN) {
    // No cooldown - permanent limit for free tier
    // Must upgrade to Basic for re-runs and automatic monthly snapshots
    return {
      allowed: false,
      reason: `Free accounts get 1 snapshot per domain. Upgrade to Basic ($19.99/mo) for automatic monthly snapshots and unlimited re-runs.`,
      upgradeRequired: true,
      limitsUsed: {
        snapshotsForDomain: snapshotsForThisDomain,
        totalDomains: uniqueDomains,
        lastSnapshotDate: lastSnapshotForDomain,
      },
    };
  }

  // Check: Exceeded max unique domains?
  if (!domainCounts.has(params.domain) && uniqueDomains >= FREE_TIER_LIMITS.MAX_DOMAINS) {
    return {
      allowed: false,
      reason: `Free tier allows snapshots for up to ${FREE_TIER_LIMITS.MAX_DOMAINS} domains. Upgrade to Basic for unlimited domains.`,
      upgradeRequired: true,
      limitsUsed: {
        snapshotsForDomain: snapshotsForThisDomain,
        totalDomains: uniqueDomains,
        lastSnapshotDate: lastSnapshotForDomain,
      },
    };
  }

  // All checks passed
  return {
    allowed: true,
    upgradeRequired: false,
    limitsUsed: {
      snapshotsForDomain: snapshotsForThisDomain,
      totalDomains: uniqueDomains,
      lastSnapshotDate: lastSnapshotForDomain,
    },
  };
}
