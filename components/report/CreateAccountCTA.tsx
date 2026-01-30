/**
 * Create Account CTA Component
 * 
 * Call-to-action to encourage account creation
 */

'use client';

import Link from 'next/link';
import { Analytics } from '@/lib/analytics';

export function CreateAccountCTA() {
  return (
    <section className="bg-brand-navy rounded-[16px] p-8 text-center text-white shadow-brand" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="text-[28px] font-bold mb-4">Save This Report & Run More</h2>
      <p className="text-[16px] text-brand-cyan/80 mb-6 max-w-2xl mx-auto">
        Create a free account to save this report, run more snapshots (1 per domain every 30 days), and track changes over time. No credit card required.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/signup"
          onClick={() => Analytics.reportCtaClicked('create-account')}
          className="inline-flex items-center justify-center px-8 py-3 text-[16px] font-semibold bg-white text-brand-navy rounded-[12px] hover:bg-brand-bg focus:ring-4 focus:ring-brand-cyan/35 transition-all"
          aria-label="Create a free account to save this report"
        >
          Create Free Account
        </Link>
        <Link
          href="/"
          onClick={() => Analytics.reportCtaClicked('run-another')}
          className="inline-flex items-center justify-center px-8 py-3 text-[16px] font-semibold bg-brand-cyan text-white rounded-[12px] hover:bg-brand-cyan/90 focus:ring-4 focus:ring-brand-cyan/35 transition-all"
          aria-label="Request another IT snapshot for a different domain"
        >
          Run Another Snapshot
        </Link>
      </div>
      <p className="text-sm text-brand-cyan/70 mt-6">
        Free tier includes 1 snapshot per domain every 30 days
      </p>
    </section>
  );
}
