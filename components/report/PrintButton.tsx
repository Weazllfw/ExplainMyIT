'use client';

/**
 * Print Report Button Component
 * 
 * Allows users to print or save report as PDF.
 * Uses browser print with optimized CSS for print media.
 * 
 * Purpose: Professional sharing (board meetings, audits).
 */

export function PrintButton({ domain }: { domain: string }) {
  const handlePrint = () => {
    // Track print event
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('report_printed', { domain });
    }
    
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-slate border-2 border-gray-300 rounded-[10px] hover:border-brand-navy hover:text-brand-navy transition-colors print:hidden"
      title="Print or save as PDF"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Report
    </button>
  );
}
