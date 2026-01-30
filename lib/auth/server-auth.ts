/**
 * Server-Side Authentication Utilities
 * 
 * For use in Server Components and Server Actions
 * Reads session from cookies
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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

/**
 * Create a Supabase client for server-side operations
 * Reads session from cookies
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  
  // Get the auth token from cookies
  const authToken = cookieStore.get('supabase-auth-token');
  
  const client = createClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: authToken?.value 
          ? { Authorization: `Bearer ${authToken.value}` }
          : {},
      },
    }
  );

  return client;
}

/**
 * Get current user from server-side
 * Use this in Server Components
 */
export async function getServerUser() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('[Server Auth] Get user error:', error);
      return null;
    }

    if (!user) {
      console.log('[Server Auth] No user found');
      return null;
    }

    console.log('[Server Auth] User found:', user.id);
    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
    };
  } catch (error) {
    console.error('[Server Auth] Exception:', error);
    return null;
  }
}

/**
 * Get current session from server-side
 */
export async function getServerSession() {
  try {
    const supabase = await createServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[Server Auth] Get session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('[Server Auth] Exception:', error);
    return null;
  }
}
