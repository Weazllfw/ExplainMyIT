'use client';

/**
 * Snapshot Quick Actions Component
 * 
 * Action buttons for each snapshot: View, Re-run, Copy Link
 * Drives engagement and usage loop.
 */

import { useState } from 'react';
import Link from 'next/link';

interface SnapshotActionsProps {
  snapshotId: string;
  domain: string;
  reportUrl: string;
}

export function SnapshotActions({ snapshotId, domain, reportUrl }: SnapshotActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      
      // Track event
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track('dashboard_copy_link', { domain });
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRerun = () => {
    // Track event
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami.track('dashboard_rerun_clicked', { domain });
    }
    
    // Navigate to homepage with pre-filled domain
    window.location.href = `/?domain=${encodeURIComponent(domain)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Report */}
      <Link
        href={`/report/${snapshotId}`}
        className="px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy hover:text-white border border-brand-navy rounded-[8px] transition-colors"
      >
        View
      </Link>
      
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-brand-navy border border-gray-300 rounded-[8px] transition-colors"
        title="Copy report link"
      >
        {copied ? '✓' : 'Copy'}
      </button>
      
      {/* Re-run */}
      <button
        onClick={handleRerun}
        className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-brand-cyan border border-gray-300 rounded-[8px] transition-colors"
        title="Run new snapshot for this domain"
      >
        Re-run
      </button>
    </div>
  );
}
