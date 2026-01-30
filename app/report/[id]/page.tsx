/**
 * Report Page
 * 
 * Display snapshot report with magic link authentication
 */

import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { verifyMagicLinkToken } from '@/lib/auth/magic-link';
import { getSnapshotById } from '@/lib/db/snapshots';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportTracker } from '@/components/report/ReportTracker';
import { OwnerSummary } from '@/components/report/OwnerSummary';
import { TemporalDisclaimer } from '@/components/report/TemporalDisclaimer';
import { TopFindings } from '@/components/report/TopFindings';
import { BlockNarratives } from '@/components/report/BlockNarratives';
import { Assumptions } from '@/components/report/Assumptions';
import { Questions } from '@/components/report/Questions';
import { BlindSpots } from '@/components/report/BlindSpots';
import { TechnicalDataViewer } from '@/components/report/TechnicalDataViewer';
import { ReportFooterActions } from '@/components/report/ReportFooterActions';
import type { LLMReport } from '@/lib/llm/types';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    token?: string;
  };
}

export default async function ReportPage({ params, searchParams }: PageProps) {
  const { id } = params;
  const { token } = searchParams;

  // Get snapshot first (we need it to check ownership)
  const { snapshot, error } = await getSnapshotById(id);
  if (error || !snapshot) {
    notFound();
  }

  // Check access: Two ways to view a report
  // 1. User is logged in and owns the snapshot (user_id matches)
  // 2. Valid magic link token provided

  let hasAccess = false;
  let accessMethod = 'none';

  // Check if user is logged in and owns this snapshot
  if (snapshot.user_id) {
    try {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set() {},
            remove() {},
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get database user ID from auth user ID
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (dbUser && dbUser.id === snapshot.user_id) {
          hasAccess = true;
          accessMethod = 'owner';
          console.log('[Report] Access granted: User owns snapshot');
        }
      }
    } catch (err) {
      console.error('[Report] Error checking user ownership:', err);
    }
  }

  // If not owner, check for magic link token
  if (!hasAccess && token) {
    const tokenResult = await verifyMagicLinkToken(token);
    if (tokenResult.valid && tokenResult.payload && tokenResult.payload.snapshot_id === id) {
      hasAccess = true;
      accessMethod = 'magic_link';
      console.log('[Report] Access granted: Valid magic link');
    }
  }

  // Deny access if neither method works
  if (!hasAccess) {
    console.log('[Report] Access denied: No valid access method');
    redirect(`/error?message=${encodeURIComponent('Access denied. Please use the link from your email or log in to view this report.')}`);
  }

  // Check if snapshot is completed
  if (snapshot.status !== 'completed') {
    redirect(`/error?message=${encodeURIComponent('Report not ready yet. Please check your email.')}`);
  }

  // Get report data
  const report = snapshot.report_json as unknown as LLMReport;
  if (!report) {
    redirect(`/error?message=${encodeURIComponent('Report data not found')}`);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Analytics Tracker (invisible) */}
      <ReportTracker snapshotId={snapshot.id} domain={snapshot.domain} />

      {/* Header */}
      <ReportHeader domain={snapshot.domain} createdAt={snapshot.created_at} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Owner Summary */}
        <OwnerSummary summary={report.owner_summary} />

        {/* Temporal Disclaimer - Static conversion framing */}
        <TemporalDisclaimer />

        {/* Top Findings */}
        {report.top_findings && report.top_findings.length > 0 && (
          <TopFindings findings={report.top_findings} />
        )}

        {/* Block Narratives */}
        {report.block_narratives && (
          <BlockNarratives narratives={report.block_narratives} />
        )}

        {/* Assumptions */}
        {report.assumptions && report.assumptions.length > 0 && (
          <Assumptions assumptions={report.assumptions} />
        )}

        {/* Questions */}
        {report.questions && report.questions.length > 0 && (
          <Questions questions={report.questions} />
        )}

        {/* Blind Spots - Static conversion framing */}
        <BlindSpots />

        {/* Technical Data Viewer */}
        {snapshot.signals_json && (
          <TechnicalDataViewer
            signals={snapshot.signals_json as any}
            domain={snapshot.domain}
          />
        )}

        {/* Footer Actions - Smart CTA based on auth state */}
        <ReportFooterActions 
          snapshotId={snapshot.id}
          domain={snapshot.domain}
          isOwnedByUser={!!snapshot.user_id}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p className="mb-2">
            This report is valid for 30 days from the generation date.
          </p>
          <p>
            <a href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
              Request another snapshot
            </a>
            {' • '}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 hover:underline">
              Create a free account
            </a>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Explain My IT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = params;
  const { token } = searchParams;

  const { snapshot, error } = await getSnapshotById(id);
  if (error || !snapshot) {
    return {
      title: 'Report Not Found - Explain My IT',
      description: 'The requested report could not be found',
    };
  }

  // Check if user owns this report or has valid token
  let hasAccess = false;

  // Check ownership
  if (snapshot.user_id) {
    try {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set() {},
            remove() {},
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (dbUser && dbUser.id === snapshot.user_id) {
          hasAccess = true;
        }
      }
    } catch (err) {
      // Ignore
    }
  }

  // Check magic link
  if (!hasAccess && token) {
    const tokenResult = await verifyMagicLinkToken(token);
    if (tokenResult.valid && tokenResult.payload && tokenResult.payload.snapshot_id === id) {
      hasAccess = true;
    }
  }

  if (!hasAccess) {
    return {
      title: 'Access Required - Explain My IT',
      description: 'Log in or use the link from your email to view this report',
    };
  }

  return {
    title: `IT Snapshot: ${snapshot.domain} - Explain My IT`,
    description: `View your IT reality check report for ${snapshot.domain}`,
    robots: 'noindex, nofollow', // Don't index report pages
  };
}
