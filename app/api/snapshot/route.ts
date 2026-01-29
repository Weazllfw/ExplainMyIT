/**
 * Snapshot API Route
 * 
 * POST /api/snapshot
 * Generates a new IT reality snapshot for a domain
 * 
 * Flow:
 * 1. Validate request (domain + email)
 * 2. Check rate limits (1 per 30 days for free tier)
 * 3. Collect signals (6 modules in parallel)
 * 4. Generate LLM report (3 calls)
 * 5. Save to database
 * 6. Generate magic link
 * 7. Send email via Brevo
 * 8. Return snapshot ID + access info
 */

import { NextResponse } from 'next/server';
import { validateSnapshotRequest } from '@/lib/utils/validation';
import { checkRateLimit, recordSnapshotRun } from '@/lib/db/rate-limits';
import { createSnapshot, updateSnapshot } from '@/lib/db/snapshots';
import { collectAllSignals } from '@/lib/signals/orchestrator';
import { generateReport } from '@/lib/llm/generator';
import { generateMagicLink } from '@/lib/auth/magic-link';
import { hashIdentifier } from '@/lib/db/rate-limits';
import { sendSnapshotEmail } from '@/lib/email/snapshot-email';
import type { SnapshotSignals, SnapshotReport } from '@/types/database';

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Parse and validate request
    const body = await request.json();
    const validation = validateSnapshotRequest(body);

    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { domain, email } = validation.data;

    console.log(`📨 Snapshot request received: ${domain} (${email})`);

    // Check rate limits
    const emailHash = hashIdentifier(email);
    const domainHash = hashIdentifier(domain);

    const rateLimit = await checkRateLimit(emailHash, domainHash, 'free');

    if (!rateLimit.allowed) {
      console.log(`❌ Rate limit exceeded for ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: rateLimit.message,
          retry_after: rateLimit.retry_after,
        },
        { status: 429 }
      );
    }

    // Create snapshot record (pending status)
    const snapshot = await createSnapshot({
      domain,
      email_hash: emailHash,
      status: 'pending',
    });

    console.log(`📝 Created snapshot: ${snapshot.id}`);

    // Update to processing
    await updateSnapshot(snapshot.id, { status: 'processing' });

    // Step 1: Collect signals
    console.log(`📡 Collecting signals for ${domain}...`);
    const signals: SnapshotSignals = await collectAllSignals(domain);

    // Step 2: Generate LLM report
    console.log(`🤖 Generating LLM report...`);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const reportUrl = `${baseUrl}/report/${snapshot.id}`;

    const reportResult = await generateReport(signals, reportUrl);

    if (!reportResult.success || !reportResult.report) {
      console.error(`❌ LLM generation failed: ${reportResult.error}`);

      await updateSnapshot(snapshot.id, {
        status: 'failed',
        error_message: `LLM generation failed: ${reportResult.error}`,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Report generation failed',
          message: 'We encountered an issue generating your report. Please try again.',
        },
        { status: 500 }
      );
    }

    const report: SnapshotReport = {
      owner_summary: reportResult.report.owner_summary,
      top_findings: reportResult.report.top_findings,
      block_narratives: reportResult.report.block_narratives,
      assumptions: reportResult.report.assumptions,
      questions: reportResult.report.questions,
      email_subject: reportResult.report.email_subject,
      email_body: reportResult.report.email_body,
      generated_at: new Date().toISOString(),
    };

    // Generate magic link token
    const magicLink = await generateMagicLink(snapshot.id, email, domain, baseUrl);
    const accessTokenHash = hashIdentifier(magicLink);
    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + 30); // 30 days

    // Update snapshot with signals, report, and access info
    const duration = (Date.now() - startTime) / 1000;

    await updateSnapshot(snapshot.id, {
      status: 'completed',
      signals_json: signals,
      report_json: report,
      generation_duration_seconds: Math.round(duration),
      access_token_hash: accessTokenHash,
      access_expires_at: accessExpiresAt.toISOString(),
      completed_at: new Date().toISOString(),
    });

    // Record snapshot run for rate limiting
    await recordSnapshotRun(emailHash, domainHash, 'free');

    console.log(`✅ Snapshot completed: ${snapshot.id} (${duration.toFixed(2)}s)`);

    // Send email via Brevo
    const emailResult = await sendSnapshotEmail(
      email,
      domain,
      report.email_subject,
      report.email_body,
      magicLink
    );

    if (!emailResult.success) {
      console.warn(`⚠️  Email sending failed: ${emailResult.error}`);
      // Don't fail the request if email fails - snapshot is still created
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        snapshot_id: snapshot.id,
        domain,
        report_url: `${baseUrl}/report/${snapshot.id}`,
        magic_link: magicLink,
        generation_time_seconds: Math.round(duration),
        message: 'Snapshot generated successfully. Check your email for the report.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Snapshot API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/snapshot?snapshot_id=xxx
 * Retrieve snapshot by ID (requires valid token)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const snapshotId = url.searchParams.get('snapshot_id');

    if (!snapshotId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing snapshot_id parameter',
        },
        { status: 400 }
      );
    }

    // TODO: Implement snapshot retrieval with token validation
    // This will be used by the frontend report page

    return NextResponse.json(
      {
        success: false,
        error: 'Not implemented yet',
        message: 'Snapshot retrieval will be implemented in Phase 6',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('❌ Snapshot GET error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
