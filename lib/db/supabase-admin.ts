/**
 * Supabase Service Role Client (Admin)
 * 
 * Bypasses Row Level Security (RLS) for server-side operations
 * Use ONLY in secure contexts (API routes, webhooks, cron jobs)
 * 
 * NEVER use in client-side code or expose to users
 */

import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set - required for admin operations');
}

/**
 * Service role client with RLS bypassed
 * Use for:
 * - Webhooks (Stripe, etc.)
 * - Cron jobs
 * - Admin operations
 */
export const getSupabaseAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
