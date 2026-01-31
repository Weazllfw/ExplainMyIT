/**
 * Automatic Monthly Snapshots Cron Job
 * 
 * Runs daily at 1am UTC to generate snapshots for Basic subscribers
 * 
 * Logic:
 * 1. Get all active Basic subscribers
 * 2. For each subscriber, get their domains (from past snapshots)
 * 3. For each domain, check if last snapshot was ≥30 days ago
 * 4. If yes, trigger new snapshot and send email notification
 * 
 * Security:
 * - Requires CRON_SECRET header to prevent unauthorized access
 * - Only processes users with active subscriptions
 * 
 * Scheduling:
 * - Configured in vercel.json to run daily at 1am UTC
 * - Can also be triggered manually via API call (with secret)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveBasicSubscribers } from '@/lib/stripe/subscriptions';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';
import { collectAllSignals } from '@/lib/signals/orchestrator';
import { generateReport } from '@/lib/llm/generator';
import { sendMonthlySnapshotEmail } from '@/lib/email';

const CRON_SECRET = process.env.CRON_SECRET || '';
const SNAPSHOT_INTERVAL_DAYS = 30;

export async function GET(req: NextRequest) {
  console.log('[Cron] Monthly snapshots job started');

  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    console.error('[Cron] Unauthorized - invalid secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all active Basic subscribers
    const subscribers = await getActiveBasicSubscribers();
    console.log(`[Cron] Found ${subscribers.length} active subscriber(s)`);

    const results = {
      totalSubscribers: subscribers.length,
      snapshotsGenerated: 0,
      errors: [] as any[],
    };

    // Process each subscriber
    for (const subscriber of subscribers) {
      try {
        await processSubscriberSnapshots(subscriber);
        results.snapshotsGenerated++;
      } catch (error) {
        console.error(`[Cron] Error processing subscriber ${subscriber.email}:`, error);
        results.errors.push({
          userId: subscriber.id,
          email: subscriber.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(
      `[Cron] Monthly snapshots complete - ${results.snapshotsGenerated}/${results.totalSubscribers} successful`
    );

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('[Cron] Fatal error in monthly snapshots:', error);
    return NextResponse.json(
      {
        error: 'Cron job failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Process snapshots for a single subscriber
 */
async function processSubscriberSnapshots(subscriber: {
  id: string;
  auth_user_id: string;
  email: string;
}) {
  const supabase = await getSupabaseServerClient();

  // Get all domains this subscriber has snapshots for
  const { data: snapshots, error } = await supabase
    .from('snapshots')
    .select('domain, created_at')
    .eq('user_id', subscriber.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get snapshots: ${error.message}`);
  }

  if (!snapshots || snapshots.length === 0) {
    console.log(`[Cron] Subscriber ${subscriber.email} has no snapshots - skipping`);
    return;
  }

  // Group by domain and get the most recent snapshot per domain
  const domainMap = new Map<string, Date>();
  for (const snapshot of snapshots) {
    if (!domainMap.has(snapshot.domain)) {
      domainMap.set(snapshot.domain, new Date(snapshot.created_at));
    }
  }

  console.log(
    `[Cron] Subscriber ${subscriber.email} has ${domainMap.size} unique domain(s)`
  );

  // Check each domain to see if it needs a new snapshot
  for (const [domain, lastSnapshotDate] of Array.from(domainMap.entries())) {
    const daysSinceLastSnapshot = Math.floor(
      (Date.now() - lastSnapshotDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastSnapshot >= SNAPSHOT_INTERVAL_DAYS) {
      console.log(
        `[Cron] Domain ${domain} needs snapshot (last: ${daysSinceLastSnapshot} days ago)`
      );

      try {
        await generateSnapshotForDomain({
          domain,
          userId: subscriber.id,
          authUserId: subscriber.auth_user_id,
          userEmail: subscriber.email,
        });

        console.log(`[Cron] Generated snapshot for ${domain}`);
      } catch (error) {
        console.error(`[Cron] Failed to generate snapshot for ${domain}:`, error);
        // Continue with other domains even if one fails
      }
    } else {
      console.log(
        `[Cron] Domain ${domain} doesn't need snapshot yet (${daysSinceLastSnapshot}/${SNAPSHOT_INTERVAL_DAYS} days)`
      );
    }
  }
}

/**
 * Generate a snapshot for a specific domain
 */
async function generateSnapshotForDomain(params: {
  domain: string;
  userId: string;
  authUserId: string;
  userEmail: string;
}) {
  const supabase = await getSupabaseServerClient();

  console.log(`[Cron] Generating snapshot for ${params.domain}...`);

  // Generate signals
  const signals = await collectAllSignals(params.domain, params.userEmail);

  // Generate LLM report (we'll update URL after saving)
  const reportResult = await generateReport(params.domain, signals, '');
  
  if (!reportResult.success || !reportResult.report) {
    throw new Error(`Report generation failed: ${reportResult.error}`);
  }

  // Save to database
  const { data: snapshot, error } = await supabase
    .from('snapshots')
    .insert({
      domain: params.domain,
      user_id: params.userId,
      email_hash: null, // Authenticated user, no email hash needed
      signals,
      report: reportResult.report,
      status: 'completed',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save snapshot: ${error.message}`);
  }

  console.log(`[Cron] Snapshot saved with ID: ${snapshot.id}`);

  // Send email notification
  try {
    await sendMonthlySnapshotEmail({
      email: params.userEmail,
      domain: params.domain,
      snapshotId: snapshot.id,
    });

    console.log(`[Cron] Email sent to ${params.userEmail}`);
  } catch (emailError) {
    console.error(`[Cron] Failed to send email to ${params.userEmail}:`, emailError);
    // Don't throw - snapshot was created successfully
  }

  return snapshot;
}
