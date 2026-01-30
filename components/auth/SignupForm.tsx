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

      // Redirect to dashboard
      router.push('/dashboard?welcome=true');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Analytics.formError('signup', 'exception');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
