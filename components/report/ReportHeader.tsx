/**
 * Report Header Component
 */

import Link from 'next/link';

interface ReportHeaderProps {
  domain: string;
  createdAt: string;
}

export function ReportHeader({ domain, createdAt }: ReportHeaderProps) {
  const reportDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-brand-border shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/" 
            className="text-[24px] font-bold text-brand-navy hover:text-brand-cyan transition-colors"
            aria-label="Return to Explain My IT homepage"
          >
            Explain My IT
          </Link>
        </div>
        <div>
          <h1 className="text-[32px] font-bold text-brand-navy mb-2">
            IT Snapshot: {domain}
          </h1>
          <p className="text-sm text-brand-muted">
            Generated on {reportDate} • Valid for 30 days
          </p>
        </div>
      </div>
    </header>
  );
}
