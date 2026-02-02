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
import { UmamiEvents } from '@/lib/analytics/umami-events';

interface DashboardContentProps {
  user: AuthUser;
  snapshots: Snapshot[];
  error: string | null;
}

export default function DashboardContent({ user, snapshots, error }: DashboardContentProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'domain'>('date');
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [nextSnapshotDates, setNextSnapshotDates] = useState<Record<string, string>>({});
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);

  // Track dashboard view on mount
  useEffect(() => {
    Analytics.dashboardViewed();
  }, []);

  // Fetch subscription status
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const res = await fetch('/api/subscription-status');
        if (res.ok) {
          const data = await res.json();
          setSubscriptionStatus(data.subscriptionStatus);
          setNextSnapshotDates(data.nextSnapshotDates || {});
          setPeriodEnd(data.periodEnd);
        }
      } catch (error) {
        console.error('Failed to fetch subscription status:', error);
      }
    }
    fetchSubscriptionStatus();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    Analytics.userLoggedOut();
    await logout();
    router.push('/');
  };

  const handleManageSubscription = async () => {
    // Track event
    UmamiEvents.manageSubscriptionClicked();
    
    setIsLoadingPortal(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ return_url: window.location.href }),
      });

      if (!res.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open subscription management. Please try again.');
      setIsLoadingPortal(false);
    }
  };

  // Calculate stats
  const stats = {
    total: snapshots.length,
    completed: snapshots.filter(s => s.status === 'completed').length,
    thisMonth: snapshots.filter(s => {
      const created = new Date(s.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
  };

  // Sort snapshots
  const sortedSnapshots = [...snapshots].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return a.domain.localeCompare(b.domain);
    }
  });

  // Helper to format subscription status
  const getStatusBadge = (status: string | null) => {
    if (!status || status === 'free') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-muted/10 text-brand-muted">
          Free Tier
        </span>
      );
    }
    
    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Basic - Active', color: 'text-green-700', bg: 'bg-green-100' },
      trialing: { label: 'Trial Active', color: 'text-blue-700', bg: 'bg-blue-100' },
      past_due: { label: 'Payment Failed', color: 'text-orange-700', bg: 'bg-orange-100' },
      canceled: { label: 'Canceled', color: 'text-red-700', bg: 'bg-red-100' },
      incomplete: { label: 'Setup Incomplete', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    };

    const config = statusConfig[status] || { label: status, color: 'text-brand-muted', bg: 'bg-brand-muted/10' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Helper to calculate next snapshot date
  const getNextSnapshotInfo = () => {
    if (!subscriptionStatus || subscriptionStatus === 'free') {
      return null;
    }

    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
      return null;
    }

    // Get unique domains from snapshots
    const domains = Array.from(new Set(snapshots.map(s => s.domain)));
    
    if (domains.length === 0) {
      return (
        <div className="text-sm text-brand-muted">
          Run your first snapshot to start automatic monthly updates
        </div>
      );
    }

    // Find earliest next snapshot
    let earliestDate: Date | null = null;
    let earliestDomain: string | null = null;

    for (const domain of domains) {
      if (nextSnapshotDates[domain]) {
        const date = new Date(nextSnapshotDates[domain]);
        if (!earliestDate || date < earliestDate) {
          earliestDate = date;
          earliestDomain = domain;
        }
      }
    }

    if (!earliestDate || !earliestDomain) {
      return null;
    }

    const now = new Date();
    const daysUntil = Math.ceil((earliestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="text-sm">
        <span className="text-brand-slate">Next automatic snapshot: </span>
        <span className="font-medium text-brand-navy">
          {earliestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-brand-muted ml-1">
          ({daysUntil} {daysUntil === 1 ? 'day' : 'days'})
        </span>
        <br />
        <span className="text-brand-muted">for {earliestDomain}</span>
      </div>
    );
  };

  return (
    <>
      {/* Account Info */}
      <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-brand-navy mb-1">
              {user.fullName || 'Your Account'}
            </h2>
            <p className="text-brand-muted text-sm">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleManageSubscription}
              disabled={isLoadingPortal}
              className="px-4 py-2 text-sm font-medium text-brand-cyan hover:text-brand-navy border border-brand-cyan rounded-[10px] hover:bg-brand-cyan/5 transition-colors disabled:opacity-50"
            >
              {isLoadingPortal ? 'Loading...' : 'Manage Subscription'}
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-brand-bg transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>

        {/* Subscription Status & Next Snapshot */}
        <div className="flex items-start justify-between pt-4 border-t border-brand-border">
          <div>
            <p className="text-sm text-brand-muted mb-2">Subscription Status</p>
            {getStatusBadge(subscriptionStatus)}
          </div>
          {getNextSnapshotInfo() && (
            <div className="text-right">
              {getNextSnapshotInfo()}
            </div>
          )}
        </div>

        {/* Payment Warning (if past_due) */}
        {subscriptionStatus === 'past_due' && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-[10px]">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">Payment failed</p>
                <p className="text-sm text-orange-700 mt-1">
                  Please update your payment method to continue receiving automatic snapshots.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Notice (if canceled) */}
        {subscriptionStatus === 'canceled' && periodEnd && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-[10px]">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Subscription canceled</p>
                <p className="text-sm text-red-700 mt-1">
                  Access ends on {new Date(periodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                  Resubscribe to continue automatic snapshots.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {snapshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-cyan/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-brand-muted">Total Snapshots</p>
                <p className="text-[28px] font-bold text-brand-navy">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-positive/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-brand-muted">Completed</p>
                <p className="text-[28px] font-bold text-brand-navy">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-brand-muted">This Month</p>
                <p className="text-[28px] font-bold text-brand-navy">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Snapshot CTA */}
      <div className="bg-gradient-to-br from-brand-navy to-blue-700 rounded-[16px] p-6 mb-8 shadow-brand">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold text-white mb-1">
              Run a New Snapshot
            </h3>
            <p className="text-blue-100 text-sm">
              Get fresh insights on any domain • Free for every domain every 30 days
            </p>
          </div>
          <Link
            href="/"
            onClick={() => Analytics.dashboardCtaClicked('new-snapshot')}
            className="px-6 py-3 bg-white text-brand-navy font-semibold rounded-[12px] hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Snapshot
          </Link>
        </div>
      </div>

      {/* Snapshots List */}
      <div className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-bold text-brand-navy">
            Your Snapshots
          </h2>
          {snapshots.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-brand-muted">Sort by:</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-3 py-1 text-sm font-medium rounded-[8px] transition-colors ${
                  sortBy === 'date'
                    ? 'bg-brand-cyan/10 text-brand-cyan'
                    : 'text-brand-muted hover:bg-brand-bg'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('domain')}
                className={`px-3 py-1 text-sm font-medium rounded-[8px] transition-colors ${
                  sortBy === 'domain'
                    ? 'bg-brand-cyan/10 text-brand-cyan'
                    : 'text-brand-muted hover:bg-brand-bg'
                }`}
              >
                Domain
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-[12px] p-4 mb-6">
            <p className="text-red-700 text-sm">Failed to load snapshots: {error}</p>
          </div>
        )}

        {!error && snapshots.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-cyan/20 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-[24px] font-bold text-brand-navy mb-2">
              Ready to get started?
            </h3>
            <p className="text-brand-muted mb-6 max-w-md mx-auto">
              Run your first IT snapshot to understand your domain's public configuration, security posture, and technical setup
            </p>
            <Link
              href="/"
              onClick={() => Analytics.dashboardCtaClicked('new-snapshot')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-navy text-white font-semibold rounded-[12px] hover:bg-brand-navy/90 transition-all shadow-brand"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Run Your First Snapshot
            </Link>
          </div>
        )}

        {!error && snapshots.length > 0 && (
          <div className="space-y-3">
            {sortedSnapshots.map((snapshot) => (
              <SnapshotCard key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SnapshotCard({ snapshot }: { snapshot: Snapshot }) {
  const [showActions, setShowActions] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const statusColors = {
    completed: 'bg-brand-positive/10 text-brand-positive border-brand-positive/30',
    processing: 'bg-brand-caution/10 text-brand-caution border-brand-caution/30',
    pending: 'bg-brand-info/10 text-brand-info border-brand-info/30',
    failed: 'bg-red-50 text-red-700 border-red-300',
  };

  const statusColor = statusColors[snapshot.status as keyof typeof statusColors] || statusColors.pending;

  // Calculate age (handle timezone and ensure non-negative)
  const createdDate = new Date(snapshot.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const daysAgo = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  
  const timeAgoText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
  const ageColor = daysAgo > 14 ? 'text-brand-caution' : 'text-brand-muted';

  const handleCopyLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    navigator.clipboard.writeText(`${baseUrl}/report/${snapshot.id}`);
    setCopyStatus('copied');
    Analytics.dashboardCtaClicked('copy-link');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="border border-brand-border rounded-[14px] p-5 hover:shadow-brand-hover hover:border-brand-cyan/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-[18px] font-bold text-brand-navy truncate">
              {snapshot.domain}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor} flex-shrink-0`}>
              {snapshot.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="text-brand-muted">
              {createdDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className={`font-medium ${ageColor}`}>
              {timeAgoText}
            </span>
            {snapshot.status === 'completed' && snapshot.generation_duration_seconds && (
              <span className="text-brand-muted">
                {snapshot.generation_duration_seconds}s generation
              </span>
            )}
          </div>
        </div>
        
        {snapshot.status === 'completed' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/report/${snapshot.id}`}
              onClick={() => Analytics.dashboardCtaClicked('view-report')}
              className="px-5 py-2 bg-brand-navy text-white text-sm font-semibold rounded-[10px] hover:bg-brand-navy/90 transition-all shadow-sm"
            >
              View Report
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-brand-muted hover:text-brand-navy hover:bg-brand-bg rounded-[8px] transition-colors"
                aria-label="More actions"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-[12px] shadow-brand z-10">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left text-sm text-brand-slate hover:bg-brand-bg rounded-t-[12px] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copyStatus === 'copied' ? 'Copied!' : 'Copy Link'}
                  </button>
                  <Link
                    href="/"
                    onClick={() => Analytics.dashboardCtaClicked('rerun-domain')}
                    className="block w-full px-4 py-2 text-left text-sm text-brand-slate hover:bg-brand-bg rounded-b-[12px] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Re-run Snapshot
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {snapshot.status === 'processing' && (
          <div className="flex items-center gap-2 text-brand-caution text-sm flex-shrink-0">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Processing...</span>
          </div>
        )}

        {snapshot.status === 'failed' && (
          <div className="flex items-center gap-2 text-red-600 text-sm flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Generation failed</span>
          </div>
        )}
      </div>
    </div>
  );
}
