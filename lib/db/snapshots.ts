/**
 * Snapshot Database Operations
 * 
 * CRUD operations and queries for the snapshots table.
 */

import { getSupabaseAdmin } from './client';
import type { Snapshot, SnapshotSignals, SnapshotReport } from '@/types/database';

/**
 * Create a new snapshot record (initial pending state)
 * Throws on error for simpler API route handling
 */
export async function createSnapshot(data: {
  domain: string;
  user_id?: string;
  email_hash?: string;
  status?: Snapshot['status'];
}): Promise<Snapshot> {
  const supabase = getSupabaseAdmin();
  
  const { data: snapshot, error } = await supabase
    .from('snapshots')
    .insert({
      domain: data.domain,
      user_id: data.user_id || null,
      email_hash: data.email_hash || null,
      status: data.status || 'pending',
      signals_json: null,
      report_json: null,
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create snapshot: ${error.message}`);
  }
  
  if (!snapshot) {
    throw new Error('Failed to create snapshot: No data returned');
  }
  
  return snapshot;
}

/**
 * Update snapshot with partial data
 * Throws on error for simpler API route handling
 */
export async function updateSnapshot(
  snapshotId: string,
  data: Partial<Snapshot>
): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('snapshots')
    .update(data)
    .eq('id', snapshotId);
  
  if (error) {
    throw new Error(`Failed to update snapshot: ${error.message}`);
  }
}

/**
 * Get snapshot by ID
 */
export async function getSnapshotById(
  snapshotId: string
): Promise<{ snapshot: Snapshot | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: snapshot, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('id', snapshotId)
    .is('deleted_at', null)
    .single();
  
  if (error) {
    return { snapshot: null, error: error.message };
  }
  
  return { snapshot, error: null };
}

/**
 * Get snapshot by access token hash (for magic link access)
 */
export async function getSnapshotByToken(
  tokenHash: string
): Promise<{ snapshot: Snapshot | null; error: string | null; expired: boolean }> {
  const supabase = getSupabaseAdmin();
  
  const { data: snapshot, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('access_token_hash', tokenHash)
    .is('deleted_at', null)
    .single();
  
  if (error) {
    return { snapshot: null, error: error.message, expired: false };
  }
  
  // Check if token is expired
  const expired = snapshot.access_expires_at
    ? new Date(snapshot.access_expires_at) < new Date()
    : false;
  
  return { snapshot, error: null, expired };
}

/**
 * Get all snapshots for a user
 */
export async function getUserSnapshots(
  userId: string,
  limit = 50
): Promise<{ snapshots: Snapshot[]; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: snapshots, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    return { snapshots: [], error: error.message };
  }
  
  return { snapshots: snapshots || [], error: null };
}

/**
 * Update snapshot status
 */
export async function updateSnapshotStatus(
  snapshotId: string,
  status: Snapshot['status'],
  errorMessage?: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const updateData: Partial<Snapshot> = {
    status,
    error_message: errorMessage || null,
  };
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('snapshots')
    .update(updateData)
    .eq('id', snapshotId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Save signal collection results
 */
export async function saveSnapshotSignals(
  snapshotId: string,
  signals: SnapshotSignals
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('snapshots')
    .update({
      signals_json: signals,
      status: 'processing',
    })
    .eq('id', snapshotId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Save LLM report results
 */
export async function saveSnapshotReport(
  snapshotId: string,
  report: SnapshotReport,
  durationSeconds: number
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('snapshots')
    .update({
      report_json: report,
      status: 'completed',
      completed_at: new Date().toISOString(),
      generation_duration_seconds: durationSeconds,
    })
    .eq('id', snapshotId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Link anonymous snapshot to user account (when user creates account)
 */
export async function linkSnapshotToUser(
  snapshotId: string,
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('snapshots')
    .update({
      user_id: userId,
      // Clear anonymous access fields
      email_hash: null,
      access_token_hash: null,
      access_expires_at: null,
    })
    .eq('id', snapshotId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Soft delete snapshot
 */
export async function deleteSnapshot(
  snapshotId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase
    .from('snapshots')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', snapshotId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Get snapshots by domain (for rate limiting checks)
 */
export async function getSnapshotsByDomain(
  domain: string,
  limit = 10
): Promise<{ snapshots: Snapshot[]; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: snapshots, error } = await supabase
    .from('snapshots')
    .select('*')
    .eq('domain', domain)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    return { snapshots: [], error: error.message };
  }
  
  return { snapshots: snapshots || [], error: null };
}

/**
 * Count total snapshots for a user
 */
export async function countUserSnapshots(
  userId: string
): Promise<{ count: number; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { count, error } = await supabase
    .from('snapshots')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('deleted_at', null);
  
  if (error) {
    return { count: 0, error: error.message };
  }
  
  return { count: count || 0, error: null };
}

/**
 * Cleanup expired anonymous snapshots
 * Called by cron job
 */
export async function cleanupExpiredSnapshots(): Promise<{
  deletedCount: number;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.rpc('cleanup_expired_snapshots');
  
  if (error) {
    return { deletedCount: 0, error: error.message };
  }
  
  return { deletedCount: data || 0, error: null };
}
