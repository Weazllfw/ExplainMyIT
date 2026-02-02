/**
 * Rate Limiting Database Operations
 * 
 * Enforce usage limits for Tier 1: 1 snapshot per domain per email per 30 days
 */

import { getSupabaseAdmin } from './client';
import type { RateLimit } from '@/types/database';
import { createHash } from 'crypto';

/**
 * Hash email or domain for privacy
 */
export function hashIdentifier(identifier: string): string {
  return createHash('sha256').update(identifier.toLowerCase()).digest('hex');
}

/**
 * Check if user can run snapshot (rate limit check)
 * Returns true if allowed, false if rate limited
 */
export async function checkRateLimit(params: {
  domain: string;
  userId?: string;
  email?: string;
  tierLimitType?: 'free' | 'pro' | 'team' | 'enterprise';
}): Promise<{
  allowed: boolean;
  error: string | null;
  remainingTime?: number; // seconds until next allowed
  existingLimit?: RateLimit;
}> {
  const supabase = getSupabaseAdmin();
  const { domain, userId, email, tierLimitType = 'free' } = params;
  
  // TESTING BYPASS: Whitelist specific emails (no rate limiting)
  const whitelistEmails = ['masterjedi.r13@gmail.com'];
  if (email && whitelistEmails.includes(email.toLowerCase())) {
    console.log(`✅ Rate limit bypass for whitelisted email: ${email}`);
    return { allowed: true, error: null };
  }
  
  const domainHash = hashIdentifier(domain);
  const emailHash = email ? hashIdentifier(email) : null;
  
  // For anonymous users (no userId), check if domain has EVER been scanned anonymously
  // This prevents email switching exploit
  if (!userId) {
    const { data: anonymousSnapshot, error: anonymousError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('domain_hash', domainHash)
      .is('user_id', null)  // Only anonymous snapshots
      .maybeSingle();
    
    if (anonymousError) {
      return { allowed: false, error: anonymousError.message };
    }
    
    if (anonymousSnapshot) {
      // Domain already scanned anonymously - block it
      return {
        allowed: false,
        error: 'You\'ve already received a free snapshot for this domain. Create a free account to track changes over time and run snapshots for up to 3 domains.',
      };
    }
    
    // First anonymous snapshot for this domain - allow it
    return { allowed: true, error: null };
  }
  
  // For authenticated users, check user-specific rate limit
  let query = supabase
    .from('rate_limits')
    .select('*')
    .eq('domain_hash', domainHash)
    .eq('user_id', userId);
  
  if (!userId && !emailHash) {
    return {
      allowed: false,
      error: 'Must provide userId or email',
    };
  }
  
  const { data, error } = await query.maybeSingle();
  
  if (error) {
    return { allowed: false, error: error.message };
  }
  
  // No existing limit - user can proceed
  if (!data) {
    return { allowed: true, error: null };
  }
  
  // TypeScript type narrowing: data is RateLimit at this point
  const existingLimit: RateLimit = data;
  
  // Check rate limit based on tier
  const limitPeriodDays = getRateLimitPeriod(tierLimitType);
  const lastRunAt = new Date(existingLimit.last_run_at);
  const nextAllowedAt = new Date(lastRunAt.getTime() + limitPeriodDays * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  if (now < nextAllowedAt) {
    // Rate limited
    const remainingTime = Math.ceil((nextAllowedAt.getTime() - now.getTime()) / 1000);
    return {
      allowed: false,
      error: `Rate limit exceeded. Next snapshot allowed in ${Math.ceil(remainingTime / 86400)} days.`,
      remainingTime,
      existingLimit,
    };
  }
  
  // Rate limit period has passed - user can proceed
  return { allowed: true, error: null, existingLimit };
}

/**
 * Record snapshot run (create or update rate limit)
 */
export async function recordSnapshotRun(params: {
  domain: string;
  userId?: string;
  email?: string;
  tierLimitType?: 'free' | 'pro' | 'team' | 'enterprise';
}): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const { domain, userId, email, tierLimitType = 'free' } = params;
  
  const domainHash = hashIdentifier(domain);
  const emailHash = email ? hashIdentifier(email) : null;
  
  // For anonymous users, record domain-only (no email hash)
  // For authenticated users, record user_id + domain
  let query = supabase
    .from('rate_limits')
    .select('*')
    .eq('domain_hash', domainHash);
  
  if (userId) {
    query = query.eq('user_id', userId);
  } else {
    // Anonymous: check for any anonymous record for this domain
    query = query.is('user_id', null);
  }
  
  if (!userId && !email) {
    return {
      success: false,
      error: 'Must provide userId or email',
    };
  }
  
  const { data } = await query.maybeSingle();
  
  if (data) {
    // TypeScript type narrowing: data is RateLimit at this point
    const existingLimit: RateLimit = data;
    
    // Update existing record
    const updateData = {
      last_run_at: new Date().toISOString(),
      run_count: existingLimit.run_count + 1,
      tier_limit_type: tierLimitType,
    };
    
    const { error } = await supabase
      .from('rate_limits')
      .update(updateData as any)
      .eq('id', existingLimit.id);
    
    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Create new record
    // For anonymous users: domain-only (no email_hash to prevent email switching)
    // For authenticated users: user_id + domain
    const insertData = {
      user_id: userId || null,
      email_hash: userId ? null : null,  // Never store email_hash (domain-only for anonymous)
      domain_hash: domainHash,
      last_run_at: new Date().toISOString(),
      run_count: 1,
      tier_limit_type: tierLimitType,
    };
    
    const { error } = await supabase
      .from('rate_limits')
      .insert(insertData as any);
    
    if (error) {
      return { success: false, error: error.message };
    }
  }
  
  return { success: true, error: null };
}

/**
 * Get rate limit period in days based on tier
 */
function getRateLimitPeriod(tier: string): number {
  switch (tier) {
    case 'free':
      return 30; // 1 per 30 days
    case 'pro':
      return 0; // Unlimited (Tier 2)
    case 'team':
      return 1; // Daily (Tier 2)
    case 'enterprise':
      return 0; // Unlimited (Tier 2)
    default:
      return 30;
  }
}

/**
 * Get all rate limits for a user
 * Useful for dashboard display
 */
export async function getUserRateLimits(
  userId: string
): Promise<{ rateLimits: RateLimit[]; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: rateLimits, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .order('last_run_at', { ascending: false });
  
  if (error) {
    return { rateLimits: [], error: error.message };
  }
  
  return { rateLimits: rateLimits || [], error: null };
}

/**
 * Get next allowed run time for a domain
 */
export async function getNextAllowedRunTime(params: {
  domain: string;
  userId?: string;
  email?: string;
}): Promise<{
  nextAllowedAt: Date | null;
  isAllowedNow: boolean;
  error: string | null;
}> {
  const { allowed, existingLimit } = await checkRateLimit({
    ...params,
    tierLimitType: 'free',
  });
  
  if (allowed || !existingLimit) {
    return {
      nextAllowedAt: null,
      isAllowedNow: true,
      error: null,
    };
  }
  
  const lastRunAt = new Date(existingLimit.last_run_at);
  const limitPeriodDays = getRateLimitPeriod(existingLimit.tier_limit_type);
  const nextAllowedAt = new Date(lastRunAt.getTime() + limitPeriodDays * 24 * 60 * 60 * 1000);
  
  return {
    nextAllowedAt,
    isAllowedNow: false,
    error: null,
  };
}

/**
 * Delete rate limit (admin function, Tier 2)
 */
export async function deleteRateLimit(
  rateLimitId: number
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('rate_limits')
    .delete()
    .eq('id', rateLimitId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Reset rate limit for a user/domain combination (admin function)
 */
export async function resetRateLimit(params: {
  domain: string;
  userId?: string;
  email?: string;
}): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const { domain, userId, email } = params;
  
  const domainHash = hashIdentifier(domain);
  const emailHash = email ? hashIdentifier(email) : null;
  
  let query = supabase
    .from('rate_limits')
    .delete()
    .eq('domain_hash', domainHash);
  
  if (userId) {
    query = query.eq('user_id', userId);
  } else if (emailHash) {
    query = query.eq('email_hash', emailHash);
  } else {
    return {
      success: false,
      error: 'Must provide userId or email',
    };
  }
  
  const { error } = await query;
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}
