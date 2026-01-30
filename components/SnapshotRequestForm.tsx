/**
 * Snapshot Request Form
 * 
 * Allow users to request a free IT snapshot by providing their email and domain
 */

'use client';

import { useState, FormEvent } from 'react';
import { Analytics } from '@/lib/analytics';

export default function SnapshotRequestForm() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/snapshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to request snapshot';
        // Track error
        Analytics.snapshotRequestFailed(
          errorMessage.includes('Rate limit') ? 'rate-limit' : 'api-error'
        );
        throw new Error(errorMessage);
      }

      // Success!
      setSuccess(true);
      setEmail('');
      setDomain('');

      // Track success
      Analytics.snapshotRequested(domain);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      console.error('Snapshot request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-brand-positive/10 border border-brand-positive/30 rounded-[12px] p-6 text-center" role="alert" aria-live="polite">
        <div className="text-4xl mb-3" aria-hidden="true">✅</div>
        <h3 className="text-[20px] font-bold text-brand-navy mb-2">
          Snapshot Requested!
        </h3>
        <p className="text-brand-slate text-[15px] mb-4">
          We're generating your IT snapshot now. You'll receive an email with your report in 30-60 seconds.
        </p>
        <p className="text-sm text-brand-muted mb-4">
          Check your spam folder if you don't see it in a few minutes.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-brand-cyan hover:text-brand-navy hover:underline font-semibold text-sm transition-all"
          aria-label="Reset form to request another snapshot"
        >
          Request another snapshot
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
          Your Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => Analytics.snapshotFormStarted()}
          placeholder="you@company.com"
          required
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan transition-all text-[15px]"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="domain" className="block text-sm font-semibold text-brand-navy mb-2">
          Your Company Domain
        </label>
        <input
          type="text"
          id="domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          required
          className="w-full px-4 py-3 border border-brand-border rounded-[12px] focus:ring-2 focus:ring-brand-cyan/35 focus:border-brand-cyan transition-all text-[15px]"
          disabled={isLoading}
        />
        <p className="text-xs text-brand-muted mt-1">
          Just the domain (e.g., company.com, not www.company.com)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 rounded-[12px] p-4" role="alert" aria-live="assertive">
          <div className="flex items-start gap-3">
            <span className="text-red-600 text-lg flex-shrink-0" aria-hidden="true">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-900 mb-1">Unable to request snapshot</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand-navy text-white font-semibold py-3 px-6 rounded-[12px] hover:bg-brand-navy/90 focus:ring-4 focus:ring-brand-cyan/35 transition-all disabled:bg-brand-muted disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-brand"
        aria-label={isLoading ? 'Generating your snapshot, please wait' : 'Get my free IT snapshot'}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating Your Snapshot...</span>
          </>
        ) : (
          'Get My Free IT Snapshot'
        )}
      </button>

      <p className="text-xs text-brand-muted text-center">
        100% free. No credit card required. Results in 30-60 seconds.
      </p>
    </form>
  );
}
