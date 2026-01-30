'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/db/supabase-browser';

export default function ProWaitlistForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const supabase = getSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const emailToUse = user?.email || email;

      if (!emailToUse) {
        setError('Please enter your email');
        setIsLoading(false);
        return;
      }

      // Add to Brevo mailing list with Pro waitlist tag
      const response = await fetch('/api/brevo/add-to-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailToUse,
          listId: 19, // Pro waitlist
          attributes: {
            PRODUCT_INTEREST: 'Pro',
            SIGNUP_SOURCE: 'pricing-page',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }

      // Track with Umami
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.track('pro-waitlist-joined', {
          source: 'pricing-page',
          authenticated: !!user,
        });
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Error joining waitlist:', err);
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-brand-green/10 border border-brand-green/30 rounded-[12px] p-6 text-center">
        <svg
          className="w-12 h-12 text-brand-green mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-[15px] text-brand-navy font-semibold mb-1">
          You're on the list!
        </p>
        <p className="text-[14px] text-brand-slate">
          We'll notify you when Pro is available.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-[10px] border border-brand-border text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-cyan/35 disabled:opacity-50"
        />
      </div>
      {error && (
        <p className="text-[13px] text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-navy text-white px-6 py-3 rounded-[10px] text-[15px] font-semibold hover:bg-brand-navy/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Joining...' : 'Notify Me When Available'}
      </button>
      <p className="text-[12px] text-brand-muted text-center">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
