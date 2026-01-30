/**
 * Login Form Component
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/auth/supabase-auth';
import { Analytics } from '@/lib/analytics';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Get redirect URL from query params (e.g., /login?redirect=/dashboard)
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Track login attempt
      Analytics.formStarted('login');

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.error || 'Login failed');
        Analytics.formError('login', result.error || 'unknown');
        return;
      }

      // Track successful login
      Analytics.formSubmitted('login');
      Analytics.userLoggedIn();

      // Show redirecting state
      setIsRedirecting(true);
      console.log('[Login UI] Redirecting to:', redirectTo);

      // Small delay to ensure session is saved, then redirect
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Force hard navigation to ensure session is picked up
      window.location.href = redirectTo;
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Analytics.formError('login', 'exception');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  // Show success/redirecting state
  if (isRedirecting) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-brand-positive/15 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-[20px] font-bold text-brand-navy mb-1">
            Login Successful!
          </h3>
          <p className="text-brand-slate text-[15px]">
            Redirecting to your dashboard...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="you@company.com"
          disabled={isLoading}
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-semibold text-brand-navy">
            Password
          </label>
          <Link 
            href="/forgot-password" 
            className="text-sm text-brand-cyan hover:text-brand-navy transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="Enter your password"
          disabled={isLoading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-[12px] p-4 flex items-start gap-3" role="alert">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-navy text-white font-semibold py-3 px-6 rounded-[12px] hover:bg-brand-navy/90 focus:ring-4 focus:ring-brand-cyan/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-brand"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>

      {/* Signup Link */}
      <div className="text-center">
        <p className="text-sm text-brand-muted">
          Don't have an account?{' '}
          <Link href="/signup" className="text-brand-cyan hover:text-brand-navy font-semibold transition-colors">
            Create free account
          </Link>
        </p>
      </div>
    </form>
  );
}
