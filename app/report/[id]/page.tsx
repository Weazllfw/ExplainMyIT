/**
 * Report Page
 * 
 * Display snapshot report with magic link authentication
 */

import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { verifyMagicLinkToken } from '@/lib/auth/magic-link';
import { getSnapshotById } from '@/lib/db/snapshots';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportTracker } from '@/components/report/ReportTracker';
import { SnapshotAgeBanner } from '@/components/report/SnapshotAgeBanner';
import { OwnerSummary } from '@/components/report/OwnerSummary';
import { TemporalDisclaimer } from '@/components/report/TemporalDisclaimer';
import { SnapshotTimeline } from '@/components/report/SnapshotTimeline';
import { EmailAuthMatrix } from '@/components/report/EmailAuthMatrix';
import { CertificateExpiryTimeline } from '@/components/report/CertificateExpiryTimeline';
import { DomainAgeTimeline } from '@/components/report/DomainAgeTimeline';
import { ShareReportButton } from '@/components/report/ShareReportButton';
import { PrintButton } from '@/components/report/PrintButton';
import { TopFindings } from '@/components/report/TopFindings';
import { BlockNarratives } from '@/components/report/BlockNarratives';
import { SinglePointDependency } from '@/components/report/SinglePointDependency';
import { Assumptions } from '@/components/report/Assumptions';
import { Questions } from '@/components/report/Questions';
import { OwnershipSignals } from '@/components/report/OwnershipSignals';
import { BrandSurfaceSignals } from '@/components/report/BrandSurfaceSignals';
import { BlindSpots } from '@/components/report/BlindSpots';
import { ConfidenceLegend } from '@/components/report/ConfidenceLegend';
import { RunAnotherDomainCTA } from '@/components/report/RunAnotherDomainCTA';
import { TechnicalDataViewer } from '@/components/report/TechnicalDataViewer';
import { SocialProof } from '@/components/report/SocialProof';
import { SavedIndicator } from '@/components/report/SavedIndicator';
import { ProductPositioning } from '@/components/report/ProductPositioning';
import { ReportFooterActions } from '@/components/report/ReportFooterActions';
import type { LLMReport } from '@/lib/llm/types';
import type { SnapshotSignals } from '@/types/database';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    token?: string;
  };
}

// Dynamic metadata for better SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Fetch snapshot to get domain name
    const { snapshot } = await getSnapshotById(params.id);

    if (!snapshot) {
      return {
        title: 'Report Not Found | Explain My IT',
      };
    }

    const domain = snapshot.domain;
    const title = `IT Snapshot for ${domain} | Explain My IT`;
    const description = `Free IT snapshot report for ${domain}. Covers DNS, email security, SSL certificates, tech stack, and public exposure analysis.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://explainmyit.com/report/${params.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: false, // Don't index individual reports for privacy
        follow: false,
      },
    };
  } catch (error) {
    console.error('[Report] Metadata generation error:', error);
    return {
      title: 'IT Snapshot | Explain My IT',
      description: 'Your IT reality snapshot report',
    };
  }
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
      
      {/* Action buttons bar */}
      <div className="max-w-4xl mx-auto px-4 pt-4 print:hidden">
        <div className="flex items-center justify-end gap-3">
          <PrintButton domain={snapshot.domain} />
          <ShareReportButton 
            reportUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://explainmyit.com'}/report/${snapshot.id}`}
            domain={snapshot.domain}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Snapshot Age Banner - Shows temporal decay */}
        <div className="page-break-avoid">
          <SnapshotAgeBanner createdAt={snapshot.created_at} />
        </div>

        {/* Owner Summary */}
        <div className="page-break-avoid">
          <OwnerSummary summary={report.owner_summary} />
        </div>

        {/* Temporal Disclaimer - Static conversion framing */}
        <div className="page-break-avoid">
          <TemporalDisclaimer />
        </div>

        {/* Visual Components Grid - Phase 1 Conversion Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break-avoid">
          {/* Snapshot Timeline - Primary conversion visual */}
          <div className="lg:col-span-2 page-break-avoid">
            <SnapshotTimeline createdAt={snapshot.created_at} />
          </div>

          {/* Email Authentication Matrix */}
          {snapshot.signals_json && (snapshot.signals_json as SnapshotSignals).email && (
            <div className="page-break-avoid">
              <EmailAuthMatrix 
                signals={(snapshot.signals_json as SnapshotSignals).email} 
              />
            </div>
          )}

          {/* Certificate Expiry Timeline */}
          {snapshot.signals_json && (snapshot.signals_json as SnapshotSignals).tls && (
            <div className="page-break-avoid">
              <CertificateExpiryTimeline 
                signals={(snapshot.signals_json as SnapshotSignals).tls} 
              />
            </div>
          )}

          {/* Domain Age Timeline */}
          {snapshot.signals_json && (snapshot.signals_json as SnapshotSignals).dns && (
            <div className="page-break-avoid">
              <DomainAgeTimeline 
                signals={(snapshot.signals_json as SnapshotSignals).dns} 
              />
            </div>
          )}
        </div>

        {/* Top Findings */}
        {report.top_findings && report.top_findings.length > 0 && (
          <div className="page-break-avoid">
            <TopFindings findings={report.top_findings} />
          </div>
        )}

        {/* Block Narratives */}
        {report.block_narratives && (
          <div className="page-break-avoid">
            <BlockNarratives narratives={report.block_narratives} />
          </div>
        )}

        {/* Single Point Dependency - Provider consolidation */}
        {snapshot.signals_json && (
          <div className="page-break-avoid">
            <SinglePointDependency signals={snapshot.signals_json as SnapshotSignals} />
          </div>
        )}

        {/* Assumptions */}
        {report.assumptions && report.assumptions.length > 0 && (
          <div className="page-break-avoid">
            <Assumptions assumptions={report.assumptions} />
          </div>
        )}

        {/* Questions */}
        {report.questions && report.questions.length > 0 && (
          <div className="page-break-avoid">
            <Questions questions={report.questions} />
          </div>
        )}

        {/* Ownership Signals - Governance awareness */}
        {snapshot.signals_json && (
          <div className="page-break-avoid">
            <OwnershipSignals 
              signals={snapshot.signals_json as SnapshotSignals}
              domain={snapshot.domain}
            />
          </div>
        )}

        {/* Brand Surface Signals - Safe OSINT */}
        <div className="page-break-avoid">
          <BrandSurfaceSignals domain={snapshot.domain} />
        </div>

        {/* Blind Spots - Static conversion framing */}
        <div className="page-break-avoid">
          <BlindSpots />
        </div>

        {/* Confidence Legend - Transparency */}
        <div className="page-break-avoid">
          <ConfidenceLegend />
        </div>

        {/* Run Another Domain CTA */}
        <div className="page-break-avoid">
          <RunAnotherDomainCTA />
        </div>

        {/* Technical Data Viewer */}
        {snapshot.signals_json && (
          <div className="page-break-avoid">
            <TechnicalDataViewer
              signals={snapshot.signals_json as any}
              domain={snapshot.domain}
            />
          </div>
        )}

        {/* Social Proof - Anonymous usage proof */}
        <div className="page-break-avoid">
          <SocialProof />
        </div>

        {/* Footer Actions - Smart CTA based on auth state */}
        <div className="page-break-avoid">
          <ReportFooterActions 
            snapshotId={snapshot.id}
            domain={snapshot.domain}
            isOwnedByUser={!!snapshot.user_id}
          />
        </div>
      </main>

      {/* Saved Indicator - Behavioral nudge */}
      <SavedIndicator isOwnedByUser={!!snapshot.user_id} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        {/* Product Positioning */}
        <ProductPositioning />
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
