/**
 * Report Footer Actions
 * Shows appropriate CTA based on auth state and snapshot ownership
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth/supabase-auth';
import { ClaimReportPrompt } from './ClaimReportPrompt';
import { CreateAccountCTA } from './CreateAccountCTA';

interface ReportFooterActionsProps {
  snapshotId: string;
  domain: string;
  isOwnedByUser: boolean; // true if snapshot.user_id is not null
}

export function ReportFooterActions({ snapshotId, domain, isOwnedByUser }: ReportFooterActionsProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-32 bg-gray-100 rounded-[16px] animate-pulse"></div>
    );
  }

  // User is logged in AND snapshot is anonymous → Show claim button
  if (user && !isOwnedByUser) {
    return <ClaimReportPrompt snapshotId={snapshotId} domain={domain} />;
  }

  // User is logged in AND snapshot is already owned → Show success message
  if (user && isOwnedByUser) {
    return (
      <div className="bg-brand-positive/10 border border-brand-positive/30 rounded-[16px] p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-brand-positive/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-brand-navy mb-1">
              This Report is Saved
            </h3>
            <p className="text-brand-slate text-sm">
              You can view this report anytime in your{' '}
              <a href="/dashboard" className="text-brand-cyan hover:underline font-semibold">
                dashboard
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User not logged in → Show create account CTA
  return <CreateAccountCTA />;
}
