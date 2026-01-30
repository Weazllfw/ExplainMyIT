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

import { NextResponse, NextRequest } from 'next/server';
import { validateSnapshotRequest } from '@/lib/utils/validation';
import { checkRateLimit, recordSnapshotRun, hashIdentifier } from '@/lib/db/rate-limits';
import { createSnapshot, updateSnapshot } from '@/lib/db/snapshots';
import { collectAllSignals } from '@/lib/signals/orchestrator';
import { generateReport } from '@/lib/llm/generator';
import { generateMagicLink } from '@/lib/auth/magic-link';
import { sendSnapshotEmail } from '@/lib/email/snapshot-email';
import { getApiUser } from '@/lib/auth/api-auth';
import { getUserByAuthId } from '@/lib/db/users';
import type { SnapshotSignals } from '@/types/database';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check if user is authenticated
    const authUser = await getApiUser(request);
    let userId: string | undefined = undefined;

    if (authUser) {
      console.log(`🔐 Authenticated user detected: ${authUser.id}`);
      // Get the database user record
      const { user } = await getUserByAuthId(authUser.id);
      if (user) {
        userId = user.id;
        console.log(`✅ User ID for snapshot: ${userId}`);
      }
    } else {
      console.log(`👤 Anonymous snapshot request`);
    }

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

    console.log(`📨 Snapshot request received: ${domain} (${email}) [user_id: ${userId || 'anonymous'}]`);

    // Hash email for storage (privacy) - only for anonymous users
    const emailHash = userId ? undefined : hashIdentifier(email);

    // Check rate limits
    const rateLimit = await checkRateLimit({
      domain,
      email,
      tierLimitType: 'free',
    });

    if (!rateLimit.allowed) {
      console.log(`❌ Rate limit exceeded for ${email}`);
      return NextResponse.json(
        {
          success: false,
          error: rateLimit.error || 'Rate limit exceeded. Try again in 30 days.',
        },
        { status: 429 }
      );
    }

    // Create snapshot record (pending status)
    // If user is authenticated, link directly to user_id
    // If anonymous, store email_hash for later linking
    const snapshot = await createSnapshot({
      domain,
      user_id: userId,
      email_hash: emailHash,
      status: 'pending',
    });

    console.log(`📝 Created snapshot: ${snapshot.id} [${userId ? 'owned by user' : 'anonymous'}]`);

    // Update to processing
    await updateSnapshot(snapshot.id, { status: 'processing' });

    // Step 1: Collect signals
    console.log(`📡 Collecting signals for ${domain}...`);
    const signals: SnapshotSignals = await collectAllSignals(domain);

    // Step 2: Generate LLM report
    console.log(`🤖 Generating LLM report...`);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const reportUrl = `${baseUrl}/report/${snapshot.id}`;

    const reportResult = await generateReport(domain, signals, reportUrl);

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

    // Store the LLM report directly (JSONB allows flexible structure)
    const report = reportResult.report;

    // Generate magic link token (only for anonymous users)
    let magicLink: string;
    let accessTokenHash: string | undefined;
    let accessExpiresAt: Date | undefined;

    if (!userId) {
      // Anonymous user - generate magic link for email access
      magicLink = await generateMagicLink(snapshot.id, email, domain, baseUrl);
      accessTokenHash = hashIdentifier(magicLink);
      accessExpiresAt = new Date();
      accessExpiresAt.setDate(accessExpiresAt.getDate() + 30); // 30 days
    } else {
      // Authenticated user - use dashboard link
      magicLink = `${baseUrl}/dashboard`;
    }

    // Update snapshot with signals, report, and access info
    const duration = (Date.now() - startTime) / 1000;

    await updateSnapshot(snapshot.id, {
      status: 'completed',
      signals_json: signals,
      report_json: report as any, // Store LLM report directly (JSONB is flexible)
      generation_duration_seconds: Math.round(duration),
      access_token_hash: accessTokenHash,
      access_expires_at: accessExpiresAt?.toISOString(),
      completed_at: new Date().toISOString(),
    });

    // Record snapshot run for rate limiting
    await recordSnapshotRun({
      domain,
      email,
      tierLimitType: 'free',
    });

    console.log(`✅ Snapshot completed: ${snapshot.id} (${duration.toFixed(2)}s)`);

    // Send email via Brevo (with appropriate link based on auth status)
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
    } else {
      console.log(`📧 Email sent to ${email} [${userId ? 'dashboard link' : 'magic link'}]`);
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
