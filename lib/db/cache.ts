/**
 * HIBP Cache Database Operations
 * 
 * Cache Have I Been Pwned API results for 30 days to reduce API costs
 */

import { getSupabaseAdmin } from './client';
import type { HibpCache, HibpResults } from '@/types/database';
import { hashIdentifier } from './rate-limits';

/**
 * Get cached HIBP results for a domain
 * Returns null if not cached or expired
 */
export async function getHibpCache(
  domain: string
): Promise<{ results: HibpResults | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const domainHash = hashIdentifier(domain);
  
  const { data, error } = await supabase
    .from('hibp_cache')
    .select('*')
    .eq('domain_hash', domainHash)
    .maybeSingle();
  
  if (error) {
    return { results: null, error: error.message };
  }
  
  // Not found is OK, means not cached
  if (!data) {
    return { results: null, error: null };
  }
  
  // TypeScript type narrowing: data is HibpCache at this point
  const cacheEntry: HibpCache = data;
  
  // Check if expired
  const expiresAt = new Date(cacheEntry.expires_at);
  const now = new Date();
  
  if (now > expiresAt) {
    // Cache expired, delete it and return null
    await deleteHibpCache(domain);
    return { results: null, error: null };
  }
  
  return { results: cacheEntry.results_json, error: null };
}

/**
 * Save HIBP results to cache
 */
export async function saveHibpCache(
  domain: string,
  results: HibpResults
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const domainHash = hashIdentifier(domain);
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  // Upsert (insert or update if exists)
  const { error } = await supabase
    .from('hibp_cache')
    .upsert({
      domain_hash: domainHash,
      results_json: results as any,
      cached_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Delete cached HIBP results for a domain
 */
export async function deleteHibpCache(
  domain: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const domainHash = hashIdentifier(domain);
  
  const { error } = await supabase
    .from('hibp_cache')
    .delete()
    .eq('domain_hash', domainHash);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Check if domain has cached results
 */
export async function hasHibpCache(
  domain: string
): Promise<{ cached: boolean; expiresAt: Date | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  const domainHash = hashIdentifier(domain);
  
  const { data, error } = await supabase
    .from('hibp_cache')
    .select('expires_at')
    .eq('domain_hash', domainHash)
    .maybeSingle();
  
  if (error) {
    return { cached: false, expiresAt: null, error: error.message };
  }
  
  if (!data) {
    return { cached: false, expiresAt: null, error: null };
  }
  
  // TypeScript type narrowing: data has expires_at at this point
  const cacheData: { expires_at: string } = data;
  
  const expiresAt = new Date(cacheData.expires_at);
  const now = new Date();
  
  // Check if expired
  if (now > expiresAt) {
    return { cached: false, expiresAt: null, error: null };
  }
  
  return { cached: true, expiresAt, error: null };
}

/**
 * Get cache statistics
 * Useful for monitoring
 */
export async function getHibpCacheStats(): Promise<{
  totalCached: number;
  expiredCount: number;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  
  // Total cached
  const { count: totalCached, error: totalError } = await supabase
    .from('hibp_cache')
    .select('*', { count: 'exact', head: true });
  
  if (totalError) {
    return {
      totalCached: 0,
      expiredCount: 0,
      error: totalError.message,
    };
  }
  
  // Expired count
  const { count: expiredCount, error: expiredError } = await supabase
    .from('hibp_cache')
    .select('*', { count: 'exact', head: true })
    .lt('expires_at', new Date().toISOString());
  
  if (expiredError) {
    return {
      totalCached: totalCached || 0,
      expiredCount: 0,
      error: expiredError.message,
    };
  }
  
  return {
    totalCached: totalCached || 0,
    expiredCount: expiredCount || 0,
    error: null,
  };
}

/**
 * Cleanup expired HIBP cache entries
 * Called by cron job
 */
export async function cleanupExpiredHibpCache(): Promise<{
  deletedCount: number;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.rpc('cleanup_expired_hibp_cache');
  
  if (error) {
    return { deletedCount: 0, error: error.message };
  }
  
  return { deletedCount: data || 0, error: null };
}

/**
 * Bulk delete all HIBP cache (admin function)
 * Use with caution - will force re-fetching for all domains
 */
export async function clearAllHibpCache(): Promise<{
  deletedCount: number;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  
  const { count, error } = await supabase
    .from('hibp_cache')
    .delete()
    .neq('domain_hash', ''); // Delete all
  
  if (error) {
    return { deletedCount: 0, error: error.message };
  }
  
  return { deletedCount: count || 0, error: null };
}
