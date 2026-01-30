/**
 * Claim Report Prompt Component
 * 
 * Shown on report pages when user is logged in but report is anonymous
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

interface ClaimReportPromptProps {
  snapshotId: string;
  domain: string;
}

export function ClaimReportPrompt({ snapshotId, domain }: ClaimReportPromptProps) {
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState('');
  const [claimed, setClaimed] = useState(false);

  // Track when claim prompt is shown
  useEffect(() => {
    Analytics.reportClaimStarted(snapshotId, domain);
  }, [snapshotId, domain]);

  const handleClaim = async () => {
    setIsClaiming(true);
    setError('');

    try {
      const response = await fetch('/api/claim-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ snapshotId }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to claim report');
        Analytics.formError('claim-report', data.error || 'unknown');
        return;
      }

      // Track successful claim
      Analytics.reportClaimCompleted(snapshotId, domain);
      setClaimed(true);
      
      // Refresh after a moment to show success message
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Claim error:', err);
    } finally {
      setIsClaiming(false);
    }
  };

  if (claimed) {
    return (
      <div className="bg-brand-positive/10 border border-brand-positive/30 rounded-[16px] p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-brand-positive/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-brand-navy mb-1">
              Report Saved! ✅
            </h3>
            <p className="text-brand-slate text-sm">
              This report is now saved to your dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-[16px] p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-[18px] font-bold text-brand-navy mb-2">
            Save This Report to Your Dashboard
          </h3>
          <p className="text-brand-slate text-sm mb-4">
            You're viewing a report for <strong>{domain}</strong>. Would you like to save it to your account?
          </p>
          {error && (
            <p className="text-red-700 text-sm mb-3">
              {error}
            </p>
          )}
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="px-6 py-2 bg-brand-navy text-white font-semibold rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand disabled:opacity-50"
          >
            {isClaiming ? 'Saving...' : 'Save to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
