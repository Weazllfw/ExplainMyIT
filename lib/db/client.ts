/**
 * Supabase Database Client
 * 
 * Provides both client-side and server-side Supabase connections
 * for database operations in Tier 1.
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (lazy initialization)
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return key;
}

function getSupabaseServiceKey(): string | undefined {
  const key = process.env.SUPABASE_SERVICE_KEY;
  // Trim whitespace and check if actually has content
  return key?.trim() || undefined;
}

// Lazy initialization
let _supabase: any = null;
let _supabaseAdmin: any = null;

/**
 * Client-side Supabase client
 * Uses anon key, respects RLS policies
 * Use in client components and API routes where user context matters
 */
export const supabase = new Proxy({} as any, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: {
          persistSession: false,
        },
      });
    }
    return (_supabase as any)[prop];
  },
});

/**
 * Server-side Supabase client (Service Role)
 * Bypasses RLS, use for background jobs and admin operations
 * CAUTION: Only use in API routes, never expose to client
 */
function initSupabaseAdmin() {
  const serviceKey = getSupabaseServiceKey();
  if (!serviceKey) {
    return null;
  }
  
  return createClient(getSupabaseUrl(), serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Get Supabase admin client
 * Throws if service key not configured
 */
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = initSupabaseAdmin();
  }
  
  if (!_supabaseAdmin) {
    // More detailed error message for debugging
    const hasKey = !!process.env.SUPABASE_SERVICE_KEY;
    const keyLength = process.env.SUPABASE_SERVICE_KEY?.length || 0;
    const keyPreview = process.env.SUPABASE_SERVICE_KEY?.substring(0, 20) || 'undefined';
    
    throw new Error(
      `Supabase service key not configured. ` +
      `Env check: exists=${hasKey}, length=${keyLength}, preview=${keyPreview}... ` +
      `Set SUPABASE_SERVICE_KEY in Vercel environment variables.`
    );
  }
  
  return _supabaseAdmin;
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
