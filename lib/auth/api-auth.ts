/**
 * API Route Authentication Utilities
 * For use in API Routes (not browser, not SSR pages)
 */

import { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Get current user from API route
 * Reads session from cookies
 */
export async function getApiUser(request: NextRequest) {
  try {
    console.log('[API Auth] Creating server client for API route');
    
    // Create server client that reads from request cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // API routes can't set cookies in response
            // This is OK - middleware handles cookie updates
          },
          remove(name: string, options: CookieOptions) {
            // API routes can't remove cookies
            // This is OK - middleware handles cookie updates
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[API Auth] Get user error:', error);
      return null;
    }

    if (!user) {
      console.log('[API Auth] No user found in session');
      return null;
    }

    console.log('[API Auth] User found:', user.id);
    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
    };
  } catch (error) {
    console.error('[API Auth] Exception:', error);
    return null;
  }
}
