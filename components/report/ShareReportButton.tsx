'use client';

/**
 * Share Report Button Component
 * 
 * Allows users to copy report link to clipboard for sharing.
 * Includes optional social sharing for professional networks.
 * 
 * Purpose: Viral growth driver - owners share with colleagues.
 */

import { useState } from 'react';

interface ShareReportButtonProps {
  reportUrl: string;
  domain: string;
}

export function ShareReportButton({ reportUrl, domain }: ShareReportButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      
      // Track share event
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('share_clicked', { domain });
      }
      
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-navy border-2 border-brand-navy rounded-[10px] hover:bg-brand-navy hover:text-white transition-colors"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Report
          </>
        )}
      </button>
      
      {/* Optional: Social sharing for professional networks */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(reportUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-brand-slate hover:text-brand-navy transition-colors"
        title="Share on LinkedIn"
        onClick={() => {
          if (typeof window !== 'undefined' && (window as any).umami) {
            (window as any).umami.track('linkedin_share', { domain });
          }
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>
    </div>
  );
}
