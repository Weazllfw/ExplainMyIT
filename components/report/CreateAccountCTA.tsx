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
    <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="text-3xl font-bold mb-4">Save This Report Forever</h2>
      <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
        Create a free account to save this report, run more snapshots (1 per domain every 30 days), and track changes over time. No credit card required.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/signup"
          onClick={() => Analytics.reportCtaClicked('create-account')}
          className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-blue-50 focus:ring-4 focus:ring-white/30 transition-all"
          aria-label="Create a free account to save this report"
        >
          Create Free Account
        </Link>
        <Link
          href="/"
          onClick={() => Analytics.reportCtaClicked('run-another')}
          className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-blue-800 text-white rounded-lg hover:bg-blue-900 focus:ring-4 focus:ring-white/30 transition-all"
          aria-label="Request another IT snapshot for a different domain"
        >
          Run Another Snapshot
        </Link>
      </div>
      <p className="text-sm text-blue-200 mt-6">
        Free tier includes 1 snapshot per domain every 30 days
      </p>
    </section>
  );
}
