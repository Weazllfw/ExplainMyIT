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
  COOLDOWN_DAYS: 30,
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
    // Check if cooldown period has passed
    if (lastSnapshotForDomain) {
      const daysSinceLastSnapshot = Math.floor(
        (Date.now() - lastSnapshotForDomain.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastSnapshot < FREE_TIER_LIMITS.COOLDOWN_DAYS) {
        return {
          allowed: false,
          reason: `Free tier allows 1 snapshot per domain every ${FREE_TIER_LIMITS.COOLDOWN_DAYS} days. Next snapshot available in ${FREE_TIER_LIMITS.COOLDOWN_DAYS - daysSinceLastSnapshot} days.`,
          upgradeRequired: true,
          limitsUsed: {
            snapshotsForDomain: snapshotsForThisDomain,
            totalDomains: uniqueDomains,
            lastSnapshotDate: lastSnapshotForDomain,
          },
        };
      }
    } else {
      // Shouldn't happen, but block if we can't determine last snapshot
      return {
        allowed: false,
        reason: `Free tier allows 1 snapshot per domain every ${FREE_TIER_LIMITS.COOLDOWN_DAYS} days.`,
        upgradeRequired: true,
        limitsUsed: {
          snapshotsForDomain: snapshotsForThisDomain,
          totalDomains: uniqueDomains,
        },
      };
    }
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
