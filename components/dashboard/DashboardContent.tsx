/**
 * Dashboard Content Component
 * 
 * Displays user's snapshots
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { AuthUser } from '@/lib/auth/supabase-auth';
import type { Snapshot } from '@/types/database';
import { logout } from '@/lib/auth/supabase-auth';
import { useRouter } from 'next/navigation';
import { Analytics } from '@/lib/analytics';

interface DashboardContentProps {
  user: AuthUser;
  snapshots: Snapshot[];
  error: string | null;
}

export default function DashboardContent({ user, snapshots, error }: DashboardContentProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Track dashboard view on mount
  useEffect(() => {
    Analytics.dashboardViewed();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    Analytics.userLoggedOut();
    await logout();
    router.push('/');
  };

  return (
    <>
      {/* Account Info */}
      <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-brand-navy mb-1">
              {user.fullName || 'Your Account'}
            </h2>
            <p className="text-brand-muted text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-brand-bg transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </div>
      </div>

      {/* New Snapshot CTA */}
      <div className="bg-brand-cyan/10 border border-brand-cyan/30 rounded-[16px] p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-brand-navy mb-1">
              Run a New Snapshot
            </h3>
            <p className="text-brand-slate text-sm">
              Get fresh insights on any domain (1 per domain every 30 days)
            </p>
          </div>
          <Link
            href="/"
            onClick={() => Analytics.dashboardCtaClicked('new-snapshot')}
            className="px-6 py-2 bg-brand-navy text-white font-semibold rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand"
          >
            New Snapshot
          </Link>
        </div>
      </div>

      {/* Snapshots List */}
      <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
        <h2 className="text-[24px] font-bold text-brand-navy mb-6">
          Your Snapshots
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-[12px] p-4 mb-6">
            <p className="text-red-700 text-sm">Failed to load snapshots: {error}</p>
          </div>
        )}

        {!error && snapshots.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-[20px] font-bold text-brand-navy mb-2">
              No snapshots yet
            </h3>
            <p className="text-brand-muted mb-6">
              Run your first snapshot to get started
            </p>
            <Link
              href="/"
              onClick={() => Analytics.dashboardCtaClicked('new-snapshot')}
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-navy text-white font-semibold rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand"
            >
              Run First Snapshot
            </Link>
          </div>
        )}

        {!error && snapshots.length > 0 && (
          <div className="space-y-4">
            {snapshots.map((snapshot) => (
              <SnapshotCard key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SnapshotCard({ snapshot }: { snapshot: Snapshot }) {
  const statusColors = {
    completed: 'bg-brand-positive/10 text-brand-positive border-brand-positive/30',
    processing: 'bg-brand-caution/10 text-brand-caution border-brand-caution/30',
    pending: 'bg-brand-info/10 text-brand-info border-brand-info/30',
    failed: 'bg-red-50 text-red-700 border-red-300',
  };

  const statusColor = statusColors[snapshot.status as keyof typeof statusColors] || statusColors.pending;

  return (
    <div className="border border-brand-border rounded-[14px] p-5 hover:shadow-brand-hover hover:border-brand-cyan/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[18px] font-bold text-brand-navy">
              {snapshot.domain}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
              {snapshot.status}
            </span>
          </div>
          <p className="text-sm text-brand-muted">
            Created {new Date(snapshot.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {snapshot.status === 'completed' && (
          <Link
            href={`/report/${snapshot.id}`}
            onClick={() => Analytics.dashboardCtaClicked('view-report')}
            className="px-4 py-2 text-sm font-semibold text-brand-cyan hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-brand-bg transition-colors"
          >
            View Report
          </Link>
        )}
      </div>
    </div>
  );
}
