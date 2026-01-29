/**
 * Report Page
 * 
 * Display snapshot report with magic link authentication
 */

import { notFound, redirect } from 'next/navigation';
import { verifyMagicLinkToken } from '@/lib/auth/magic-link';
import { getSnapshotById } from '@/lib/db/snapshots';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportTracker } from '@/components/report/ReportTracker';
import { OwnerSummary } from '@/components/report/OwnerSummary';
import { TopFindings } from '@/components/report/TopFindings';
import { BlockNarratives } from '@/components/report/BlockNarratives';
import { Assumptions } from '@/components/report/Assumptions';
import { Questions } from '@/components/report/Questions';
import { CreateAccountCTA } from '@/components/report/CreateAccountCTA';
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

  // Require token for access
  if (!token) {
    redirect(`/error?message=${encodeURIComponent('Access token required')}`);
  }

  // Verify token
  const tokenPayload = await verifyMagicLinkToken(token);
  if (!tokenPayload || tokenPayload.snapshotId !== id) {
    redirect(`/error?message=${encodeURIComponent('Invalid or expired link')}`);
  }

  // Get snapshot from database
  const snapshot = await getSnapshotById(id);
  if (!snapshot) {
    notFound();
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
    <div className="min-h-screen bg-gray-50">
      {/* Analytics Tracker (invisible) */}
      <ReportTracker snapshotId={snapshot.id} domain={snapshot.domain} />

      {/* Header */}
      <ReportHeader domain={snapshot.domain} createdAt={snapshot.created_at} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Owner Summary */}
        <OwnerSummary summary={report.owner_summary} />

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

        {/* CTA */}
        <CreateAccountCTA />
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

  if (!token) {
    return {
      title: 'Access Required - Explain My IT',
      description: 'Access token required to view this report',
    };
  }

  const tokenPayload = await verifyMagicLinkToken(token);
  if (!tokenPayload || tokenPayload.snapshotId !== id) {
    return {
      title: 'Invalid Link - Explain My IT',
      description: 'This link is invalid or has expired',
    };
  }

  const snapshot = await getSnapshotById(id);
  if (!snapshot) {
    return {
      title: 'Report Not Found - Explain My IT',
      description: 'The requested report could not be found',
    };
  }

  return {
    title: `IT Snapshot: ${snapshot.domain} - Explain My IT`,
    description: `View your IT reality check report for ${snapshot.domain}`,
    robots: 'noindex, nofollow', // Don't index magic link pages
  };
}
