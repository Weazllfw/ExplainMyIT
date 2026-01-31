/**
 * Supabase Service Role Client (Admin)
 * 
 * Bypasses Row Level Security (RLS) for server-side operations
 * Use ONLY in secure contexts (API routes, webhooks, cron jobs)
 * 
 * NEVER use in client-side code or expose to users
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Service role client with RLS bypassed
 * Use for:
 * - Webhooks (Stripe, etc.)
 * - Cron jobs
 * - Admin operations
 * 
 * Note: Lazy initialization - only validates env vars when actually called
 */
export const getSupabaseAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  }

  // Support both naming conventions
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY is not set - required for admin operations');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
