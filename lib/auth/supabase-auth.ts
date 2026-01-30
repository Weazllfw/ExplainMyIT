/**
 * Supabase Authentication Utilities
 * 
 * Handles user signup, login, logout, and session management
 */

import { supabase } from '@/lib/db/client';

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
      await fetch('/api/auth/create-user-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authUserId: authData.user.id,
          email: data.email,
          fullName: data.fullName,
        }),
      });
      // If this fails, it's OK - user can still log in and we'll create record on next login
    } catch (error) {
      console.warn('Failed to create user record (non-critical):', error);
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'Login failed' };
    }

    // Update last login timestamp
    const { error: updateError } = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('auth_user_id', authData.user.id);

    if (updateError) {
      console.error('Failed to update last login:', updateError);
      // Non-critical error, continue
    }

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        fullName: authData.user.user_metadata?.full_name,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
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
