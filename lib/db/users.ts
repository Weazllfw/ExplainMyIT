/**
 * User Database Operations
 * 
 * CRUD operations and queries for the users table.
 */

import { getSupabaseAdmin } from './client';
import type { User } from '@/types/database';

/**
 * Create or get user by Supabase Auth ID
 * Used when a user signs up via Supabase Auth
 */
export async function upsertUserFromAuth(data: {
  authUserId: string;
  email: string;
  fullName?: string;
}): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', data.authUserId)
    .single();
  
  if (existingUser) {
    // Update last_login_at
    const updateData = {
      last_login_at: new Date().toISOString(),
    };
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData as any)
      .eq('id', existingUser.id)
      .select()
      .single();
    
    if (error) {
      return { user: null, error: error.message };
    }
    
    return { user: updatedUser, error: null };
  }
  
  // Create new user
  const insertData = {
    auth_user_id: data.authUserId,
    email: data.email,
    email_verified: false, // Will be updated by Supabase Auth callback
    full_name: data.fullName || null,
    subscription_tier: 'free',
    is_active: true,
    last_login_at: new Date().toISOString(),
  };
  
  const { data: newUser, error } = await supabase
    .from('users')
    .insert(insertData as any)
    .select()
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user: newUser, error: null };
}

/**
 * Get user by auth_user_id
 */
export async function getUserByAuthId(
  authUserId: string
): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user, error: null };
}

/**
 * Get user by ID
 */
export async function getUserById(
  userId: string
): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .is('deleted_at', null)
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user, error: null };
}

/**
 * Get user by Auth ID
 */
export async function getUserByAuthId(
  authUserId: string
): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authUserId)
    .is('deleted_at', null)
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user, error: null };
}

/**
 * Get user by email
 */
export async function getUserByEmail(
  email: string
): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .is('deleted_at', null)
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user, error: null };
}

/**
 * Update user email verification status
 */
export async function updateEmailVerified(
  userId: string,
  verified: boolean
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const updateData = {
    email_verified: verified,
  };
  
  const { error } = await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', userId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string;
    email?: string;
  }
): Promise<{ user: User | null; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const updateData: any = {};
  if (data.fullName !== undefined) updateData.full_name = data.fullName;
  if (data.email !== undefined) updateData.email = data.email.toLowerCase();
  
  const { data: user, error } = await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    return { user: null, error: error.message };
  }
  
  return { user, error: null };
}

/**
 * Update user subscription tier
 * Will be used in Tier 2 for plan upgrades
 */
export async function updateSubscriptionTier(
  userId: string,
  tier: User['subscription_tier']
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const updateData = {
    subscription_tier: tier,
  };
  
  const { error } = await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', userId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Soft delete user account
 */
export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseAdmin();
  
  const updateData = {
    deleted_at: new Date().toISOString(),
    is_active: false,
  };
  
  const { error } = await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', userId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, error: null };
}

/**
 * Get user snapshot summary
 * Uses the database view
 */
export async function getUserSnapshotSummary(userId: string): Promise<{
  totalSnapshots: number;
  uniqueDomains: number;
  lastSnapshotAt: string | null;
  error: string | null;
}> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase
    .from('user_snapshot_summary')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    return {
      totalSnapshots: 0,
      uniqueDomains: 0,
      lastSnapshotAt: null,
      error: error.message,
    };
  }
  
  return {
    totalSnapshots: data?.total_snapshots || 0,
    uniqueDomains: data?.unique_domains || 0,
    lastSnapshotAt: data?.last_snapshot_at || null,
    error: null,
  };
}
