/**
 * Create User Record API Route
 * 
 * POST /api/auth/create-user-record
 * Creates a user record in the database after Supabase Auth signup
 * Also auto-links any anonymous snapshots with matching email
 */

import { NextResponse } from 'next/server';
import { upsertUserFromAuth } from '@/lib/db/users';
import { linkSnapshotToUser } from '@/lib/db/snapshots';
import { hashIdentifier } from '@/lib/db/rate-limits';
import { getSupabaseAdmin } from '@/lib/db/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authUserId, email, fullName } = body;

    console.log('[API] Create user record request:', { authUserId, email, hasFullName: !!fullName });

    if (!authUserId || !email) {
      console.error('[API] Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user record in database
    const { user, error } = await upsertUserFromAuth({
      authUserId,
      email,
      fullName,
    });

    if (error) {
      console.error('[API] Failed to create user record:', error);
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    console.log('[API] User record created successfully:', user?.id);

    // AUTO-LINK: Find and link any anonymous snapshots with matching email
    try {
      const emailHash = hashIdentifier(email);
      console.log('[API] Checking for anonymous snapshots with email hash:', emailHash.substring(0, 10) + '...');

      const supabase = getSupabaseAdmin();
      const { data: anonymousSnapshots, error: queryError } = await supabase
        .from('snapshots')
        .select('id, domain')
        .eq('email_hash', emailHash)
        .is('user_id', null)
        .is('deleted_at', null);

      if (queryError) {
        console.error('[API] Error querying anonymous snapshots:', queryError);
      } else if (anonymousSnapshots && anonymousSnapshots.length > 0) {
        console.log(`[API] Found ${anonymousSnapshots.length} anonymous snapshot(s) to link`);

        // Link each snapshot to the new user
        for (const snapshot of anonymousSnapshots) {
          const linkResult = await linkSnapshotToUser(snapshot.id, user.id);
          if (linkResult.success) {
            console.log(`[API] Linked snapshot ${snapshot.id} (${snapshot.domain}) to user ${user.id}`);
          } else {
            console.error(`[API] Failed to link snapshot ${snapshot.id}:`, linkResult.error);
          }
        }

        console.log('[API] Auto-linking complete!');
      } else {
        console.log('[API] No anonymous snapshots found for this email');
      }
    } catch (linkError) {
      // Non-critical error - user record is created, just snapshots not linked
      console.error('[API] Auto-link error (non-critical):', linkError);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[API] Create user record exception:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
