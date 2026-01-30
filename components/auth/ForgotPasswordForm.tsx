/**
 * Forgot Password Form Component
 */

'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { sendPasswordReset } from '@/lib/auth/supabase-auth';
import { Analytics } from '@/lib/analytics';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Track password reset request
      Analytics.formStarted('forgot-password');

      const result = await sendPasswordReset(email);

      if (!result.success) {
        setError(result.error || 'Failed to send reset email');
        Analytics.formError('forgot-password', result.error || 'unknown');
        return;
      }

      // Track successful request
      Analytics.formSubmitted('forgot-password');
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Analytics.formError('forgot-password', 'exception');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - show confirmation
  if (success) {
    return (
      <div className="space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-cyan/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-[24px] font-bold text-brand-navy mb-2">
            Check Your Email 📧
          </h3>
          <p className="text-brand-slate text-[15px] leading-relaxed">
            We've sent password reset instructions to:
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-brand-bg border border-brand-border rounded-[12px] p-4">
          <p className="text-sm font-semibold text-brand-navy text-center">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white border border-brand-border rounded-[12px] p-6 space-y-3">
          <h4 className="text-[16px] font-bold text-brand-navy">
            What to do next:
          </h4>
          <div className="space-y-2 text-sm text-brand-slate">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy mt-0.5">
                1
              </span>
              <p>Check your email inbox (and spam folder)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy mt-0.5">
                2
              </span>
              <p>Click the password reset link</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy mt-0.5">
                3
              </span>
              <p>Create your new password</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4">
          <p className="text-sm text-amber-900">
            <strong>Didn't receive it?</strong> Check your spam folder or try again in a few minutes.
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-brand-cyan hover:text-brand-navy font-semibold transition-colors"
          >
            ← Back to login
          </Link>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="you@company.com"
          disabled={isLoading}
        />
        <p className="text-xs text-brand-muted mt-2">
          Enter the email address associated with your account
        </p>
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
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </button>

      {/* Back to Login */}
      <div className="text-center">
        <Link 
          href="/login" 
          className="text-sm text-brand-cyan hover:text-brand-navy font-semibold transition-colors"
        >
          ← Back to login
        </Link>
      </div>
    </form>
  );
}
