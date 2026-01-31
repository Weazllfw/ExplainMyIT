/**
 * Get User Subscription Status
 * 
 * Returns subscription status and next snapshot date for authenticated users
 */

import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription status
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_period_end, subscription_cancel_at_period_end, id')
      .eq('auth_user_id', user.id)
      .single();

    if (error) {
      console.error('[Subscription Status] Error fetching user:', error);
      return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
    }

    // Get next snapshot dates per domain
    const { data: snapshots } = await supabase
      .from('snapshots')
      .select('domain, created_at')
      .eq('user_id', dbUser.id)
      .order('created_at', { ascending: false });

    // Calculate next snapshot date per domain (30 days from last snapshot)
    const nextSnapshotDates: Record<string, string> = {};
    if (snapshots) {
      const domainMap = new Map<string, Date>();
      
      // Get most recent snapshot per domain
      for (const snapshot of snapshots) {
        if (!domainMap.has(snapshot.domain)) {
          domainMap.set(snapshot.domain, new Date(snapshot.created_at));
        }
      }

      // Calculate next snapshot date (last + 30 days)
      for (const [domain, lastDate] of Array.from(domainMap.entries())) {
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 30);
        nextSnapshotDates[domain] = nextDate.toISOString();
      }
    }

    return NextResponse.json({
      subscriptionStatus: dbUser.subscription_status || 'free',
      periodEnd: dbUser.subscription_period_end,
      cancelAtPeriodEnd: dbUser.subscription_cancel_at_period_end || false,
      nextSnapshotDates,
    });
  } catch (error) {
    console.error('[Subscription Status] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
