/**
 * Signup Form Component
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth/supabase-auth';
import { Analytics } from '@/lib/analytics';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdEmail, setCreatedEmail] = useState('');

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
      // Track signup attempt
      Analytics.formStarted('signup');

      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });

      if (!result.success) {
        setError(result.error || 'Signup failed');
        Analytics.formError('signup', result.error || 'unknown');
        return;
      }

      // Track successful signup
      Analytics.formSubmitted('signup');
      Analytics.userSignedUp();

      // Show success confirmation
      setCreatedEmail(formData.email);
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Analytics.formError('signup', 'exception');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - show confirmation before login
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
            Account Created! 🎉
          </h3>
          <p className="text-brand-slate text-[15px] leading-relaxed">
            Your account has been successfully created.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-brand-bg border border-brand-border rounded-[12px] p-6 space-y-4">
          <h4 className="text-[16px] font-bold text-brand-navy">
            What happens next:
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy">
                1
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-navy">Log in to your account</p>
                <p className="text-xs text-brand-muted">Use the email and password you just created</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy">
                2
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-navy">Access your dashboard</p>
                <p className="text-xs text-brand-muted">View and manage your IT snapshots in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brand-cyan/15 rounded-full flex items-center justify-center text-xs font-bold text-brand-navy">
                3
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-navy">Run your first snapshot</p>
                <p className="text-xs text-brand-muted">Track your IT setup and save it permanently</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white border border-brand-border rounded-[12px] p-4">
          <p className="text-sm text-brand-slate">
            <span className="font-semibold text-brand-navy">Your email:</span> {createdEmail}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-brand-navy text-white font-semibold py-3 px-6 rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand"
        >
          Continue to Login
        </button>

        {/* Secondary Link */}
        <p className="text-center text-sm text-brand-muted">
          Want to explore first?{' '}
          <Link href="/" className="text-brand-cyan hover:underline font-medium">
            Back to homepage
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name (Optional) */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-brand-navy mb-2">
          Full Name <span className="text-brand-muted font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan text-[15px]"
          placeholder="John Smith"
          disabled={isLoading}
        />
      </div>

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
        <label htmlFor="password" className="block text-sm font-semibold text-brand-navy mb-2">
          Password
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
          Confirm Password
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
        {isLoading ? 'Creating Account...' : 'Create Free Account'}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-brand-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-cyan hover:text-brand-navy font-semibold transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
