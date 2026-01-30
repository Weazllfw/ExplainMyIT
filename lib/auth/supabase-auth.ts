/**
 * Supabase Authentication Utilities
 * 
 * Handles user signup, login, logout, and session management
 */

import { getSupabaseBrowserClient } from '@/lib/db/supabase-browser';

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignupData): Promise<{ 
  success: boolean; 
  error?: string;
  user?: AuthUser;
}> {
  try {
    const supabase = getSupabaseBrowserClient();
    
    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName || null,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' };
    }

    // Create user record in our database via API route
    // This avoids client-side access to getSupabaseAdmin()
    try {
      const response = await fetch('/api/auth/create-user-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authUserId: authData.user.id,
          email: data.email,
          fullName: data.fullName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.warn('[Signup] User record creation failed (non-critical):', errorData);
      } else {
        console.log('[Signup] User record created successfully');
      }
      // If this fails, it's OK - user can still log in and we'll create record on next login
    } catch (error) {
      console.warn('[Signup] Failed to create user record (non-critical):', error);
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        fullName: data.fullName,
      },
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Signup failed' 
    };
  }
}

/**
 * Log in an existing user
 */
export async function login(data: LoginData): Promise<{ 
  success: boolean; 
  error?: string;
  user?: AuthUser;
}> {
  try {
    const supabase = getSupabaseBrowserClient();
    console.log('[Login] Attempting login for:', data.email);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      console.error('[Login] Supabase auth error:', authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      console.error('[Login] No user returned from Supabase');
      return { success: false, error: 'Login failed' };
    }

    console.log('[Login] Login successful for user:', authData.user.id);

    // Update last login timestamp
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('auth_user_id', authData.user.id);

    if (updateError) {
      console.error('[Login] Failed to update last login (non-critical):', updateError);
      // Non-critical error, continue
    } else {
      console.log('[Login] Updated last login timestamp');
    }

    console.log('[Login] Returning success');
    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        fullName: authData.user.user_metadata?.full_name,
      },
    };
  } catch (error) {
    console.error('[Login] Exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    };
  }
}

/**
 * Log out current user
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Logout failed' 
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send reset email' 
    };
  }
}

/**
 * Reset password with new password
 */
export async function resetPassword(newPassword: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to reset password' 
    };
  }
}
