/**
 * Run Another Domain CTA Component
 * 
 * Encourages users to check additional domains after viewing a report.
 * Drives multi-domain usage and expansion behavior.
 * 
 * Purpose: Natural usage expansion, sets up multi-domain management.
 */

'use client';

import Link from 'next/link';

export function RunAnotherDomainCTA() {
  return (
    <div className="bg-gradient-to-br from-brand-navy to-blue-700 rounded-[16px] p-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-[24px] font-bold text-white mb-3">
          Run Another Snapshot
        </h3>
        <p className="text-blue-100 mb-6 leading-relaxed">
          Want to see how your other domains, clients, or competitors look? 
          Get instant visibility into any public IT setup.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-navy font-semibold rounded-[10px] hover:bg-blue-50 transition-colors shadow-lg"
          onClick={() => {
            // Track conversion event
            if (typeof window !== 'undefined' && (window as any).umami) {
              (window as any).umami.track('run_another_domain_clicked');
            }
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Run Another Snapshot
        </Link>
        
        <p className="text-xs text-blue-200 mt-4">
          Free • No credit card required • Results in 60 seconds
        </p>
      </div>
    </div>
  );
}
