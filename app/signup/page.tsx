/**
 * Signup Page
 * 
 * Allow users to create a free account
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SignupForm from '@/components/auth/SignupForm';
import SignupPageTracker from '@/components/auth/SignupPageTracker';

export const metadata: Metadata = {
  title: 'Create Free Account',
  description: 'Create a free account to save snapshots and track your IT over time',
};

export default function SignupPage() {
  return (
    <>
      <SignupPageTracker />
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="container-section py-20">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[36px] font-bold text-brand-navy mb-3">
                Create Your Free Account
              </h1>
              <p className="text-brand-slate text-[16px]">
                Save your reports and track your IT over time
              </p>
            </div>

            {/* Signup Form Card */}
            <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
              <Suspense fallback={<div className="text-center text-brand-muted">Loading...</div>}>
                <SignupForm />
              </Suspense>
            </div>

            {/* Benefits */}
            <div className="mt-8 bg-white rounded-[14px] border border-brand-border p-6">
              <h3 className="text-[16px] font-bold text-brand-navy mb-4">
                What you get with a free account:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-slate text-[15px]">
                    <strong>Save reports permanently</strong> - Access your snapshots anytime
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-slate text-[15px]">
                    <strong>1 snapshot per domain every 30 days</strong> - Track changes over time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-slate text-[15px]">
                    <strong>Dashboard view</strong> - See all your domains in one place
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-slate text-[15px]">
                    <strong>100% free</strong> - No credit card required
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
