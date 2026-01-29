/**
 * Supabase Database Client
 * 
 * Provides both client-side and server-side Supabase connections
 * for database operations in Tier 1.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Client-side Supabase client
 * Uses anon key, respects RLS policies
 * Use in client components and API routes where user context matters
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We handle sessions differently for anonymous users
  },
});

/**
 * Server-side Supabase client (Service Role)
 * Bypasses RLS, use for background jobs and admin operations
 * CAUTION: Only use in API routes, never expose to client
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Get Supabase admin client
 * Throws if service key not configured
 */
export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error('Supabase service key not configured. Set SUPABASE_SERVICE_KEY in .env.local');
  }
  return supabaseAdmin;
}

/**
 * Database connection test
 * Returns true if connection successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    return !error;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
}

/**
 * Health check for database
 * Returns detailed connection status
 */
export async function healthCheck(): Promise<{
  connected: boolean;
  error?: string;
  latency?: number;
}> {
  const start = Date.now();
  
  try {
    const { error } = await supabase.from('schema_version').select('version').limit(1);
    const latency = Date.now() - start;
    
    if (error) {
      return {
        connected: false,
        error: error.message,
      };
    }
    
    return {
      connected: true,
      latency,
    };
  } catch (err) {
    return {
      connected: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
