/**
 * Snapshot Request Form
 * 
 * Allow users to request a free IT snapshot by providing their email and domain
 */

'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics';

const LOADING_STEPS = [
  { text: 'Analyzing DNS records...', duration: 2000 },
  { text: 'Checking email security (SPF, DMARC)...', duration: 3000 },
  { text: 'Scanning SSL/TLS certificates...', duration: 2500 },
  { text: 'Identifying technology stack...', duration: 2000 },
  { text: 'Checking breach databases...', duration: 3000 },
  { text: 'Generating your report...', duration: 2500 },
];

export default function SnapshotRequestForm() {
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Animated loading steps
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500); // Average step duration

    return () => clearInterval(stepInterval);
  }, [isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);
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
      setLoadingStep(0);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="bg-brand-positive/10 border border-brand-positive/30 rounded-[12px] p-6 text-center" role="alert" aria-live="polite">
          <div className="text-4xl mb-3" aria-hidden="true">✅</div>
          <h3 className="text-[20px] font-bold text-brand-navy mb-2">
            Snapshot Requested!
          </h3>
          <p className="text-brand-slate text-[15px] mb-4">
            We're generating your IT snapshot now. You'll receive an email with your report in 30-60 seconds.
          </p>
          <p className="text-sm text-brand-muted">
            Check your spam folder if you don't see it in a few minutes.
          </p>
        </div>

        {/* Conversion CTA - Create Account */}
        <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-[12px] p-6">
          <h4 className="text-[16px] font-bold text-brand-navy mb-2">
            Want to Save This Report?
          </h4>
          <p className="text-sm text-brand-slate mb-4">
            Create a free account to save your snapshots, track changes over time, and view all your domains in one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="flex-1 text-center px-4 py-2 bg-brand-navy text-white font-semibold rounded-[10px] hover:bg-brand-navy/90 transition-all text-sm shadow-brand"
            >
              Create Free Account
            </Link>
            <button
              onClick={() => setSuccess(false)}
              className="flex-1 px-4 py-2 text-brand-cyan hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-brand-bg transition-all text-sm font-medium"
            >
              Request Another
            </button>
          </div>
        </div>
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
        className="w-full bg-brand-navy text-white font-semibold py-3 px-6 rounded-[12px] hover:bg-brand-navy/90 focus:ring-4 focus:ring-brand-cyan/35 transition-all disabled:bg-brand-muted disabled:cursor-not-allowed shadow-brand"
        aria-label={isLoading ? 'Generating your snapshot, please wait' : 'Get my free IT snapshot'}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Your Snapshot...</span>
            </div>
            <span className="text-xs text-white/80 animate-pulse">
              {LOADING_STEPS[loadingStep]?.text || 'Processing...'}
            </span>
          </div>
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
