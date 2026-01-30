/**
 * Reset Password Form Component
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth/supabase-auth';
import { Analytics } from '@/lib/analytics';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Track password reset attempt
      Analytics.formStarted('reset-password');

      const result = await resetPassword(formData.password);

      if (!result.success) {
        setError(result.error || 'Failed to reset password');
        Analytics.formError('reset-password', result.error || 'unknown');
        return;
      }

      // Track successful reset
      Analytics.formSubmitted('reset-password');
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Analytics.formError('reset-password', 'exception');
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
          <div className="w-16 h-16 bg-brand-positive/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-[24px] font-bold text-brand-navy mb-2">
            Password Reset! 🎉
          </h3>
          <p className="text-brand-slate text-[15px] leading-relaxed">
            Your password has been successfully updated.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-brand-bg border border-brand-border rounded-[12px] p-6 space-y-3">
          <h4 className="text-[16px] font-bold text-brand-navy">
            What's next:
          </h4>
          <div className="space-y-2 text-sm text-brand-slate">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy mt-0.5">
                1
              </span>
              <p>Use your new password to log in</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy mt-0.5">
                2
              </span>
              <p>Access your dashboard and snapshots</p>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4">
          <p className="text-sm text-blue-900">
            <strong>Security tip:</strong> Keep your password safe and don't share it with anyone.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-brand-navy text-white font-semibold py-3 px-6 rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand"
        >
          Continue to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* New Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-brand-navy mb-2">
          New Password
        </label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="At least 8 characters"
          minLength={8}
          disabled={isLoading}
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-brand-navy mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="Re-enter your password"
          minLength={8}
          disabled={isLoading}
        />
      </div>

      {/* Password Requirements */}
      <div className="bg-brand-bg border border-brand-border rounded-[12px] p-4">
        <p className="text-xs text-brand-muted">
          <strong className="text-brand-navy">Password requirements:</strong>
          <br />
          • At least 8 characters long
          <br />
          • Mix of letters, numbers, and symbols recommended
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
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
