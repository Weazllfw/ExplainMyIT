'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { WaitlistFormData, WaitlistResponse } from '@/types/waitlist';
import { Analytics } from '@/lib/analytics';

export default function WaitlistForm() {
  const [formData, setFormData] = useState<WaitlistFormData>({
    email: '',
    companySize: '',
    hasIT: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Capture UTM parameters and marketing attribution on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const attribution = {
      utmSource: searchParams.get('utm_source') || undefined,
      utmMedium: searchParams.get('utm_medium') || undefined,
      utmCampaign: searchParams.get('utm_campaign') || undefined,
      referrer: document.referrer || undefined,
      signupPage: window.location.pathname,
    };

    // Merge attribution data into form data
    setFormData((prev) => ({ ...prev, ...attribution }));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Track form submission attempt
    Analytics.waitlistFormStarted();

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: WaitlistResponse = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        
        // Track successful signup
        Analytics.waitlistSignup({
          companySize: formData.companySize,
          hasIT: formData.hasIT,
          source: formData.utmSource || 'direct',
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        
        // Track form error
        Analytics.formError('waitlist', data.error || 'unknown-error');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      
      // Track network error
      Analytics.formError('waitlist', 'network-error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          You&apos;re on the list!
        </h3>
        <p className="text-gray-600">
          Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <div>
      {submitStatus === 'error' && (
        <div 
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
          role="alert"
        >
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="you@company.com"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-900 mb-2">
              Company Size
            </label>
            <select
              id="companySize"
              name="companySize"
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-150">51-150 employees</option>
              <option value="151+">151+ employees</option>
            </select>
          </div>

          <div>
            <label htmlFor="hasIT" className="block text-sm font-medium text-gray-900 mb-2">
              Do you have internal IT?
            </label>
            <select
              id="hasIT"
              name="hasIT"
              value={formData.hasIT}
              onChange={(e) => setFormData({ ...formData, hasIT: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Select option</option>
              <option value="Yes">Yes</option>
              <option value="MSP">MSP</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Joining the Waitlist...' : 'Join the Waitlist'}
        </button>
      </form>
    </div>
  );
}
