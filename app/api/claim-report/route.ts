/**
 * Claim Report API Route
 * 
 * Allows a newly authenticated user to claim an anonymous report they viewed via magic link
 */

import { NextRequest, NextResponse } from 'next/server';
import { getApiUser } from '@/lib/auth/api-auth';
import { linkSnapshotToUser, getSnapshotById } from '@/lib/db/snapshots';
import { getUserByAuthId } from '@/lib/db/users';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from API route context
    const authUser = await getApiUser(request);
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get snapshot ID from request
    const { snapshotId } = await request.json();

    if (!snapshotId) {
      return NextResponse.json(
        { success: false, error: 'Snapshot ID required' },
        { status: 400 }
      );
    }

    // Get user's database record
    const { user, error: userError } = await getUserByAuthId(authUser.id);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify snapshot exists and is anonymous
    const { snapshot, error: snapshotError } = await getSnapshotById(snapshotId);

    if (snapshotError || !snapshot) {
      return NextResponse.json(
        { success: false, error: 'Snapshot not found' },
        { status: 404 }
      );
    }

    // Check if snapshot is already claimed
    if (snapshot.user_id) {
      return NextResponse.json(
        { success: false, error: 'Snapshot already claimed' },
        { status: 400 }
      );
    }

    // Link snapshot to user
    const { success, error } = await linkSnapshotToUser(snapshotId, user.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: error || 'Failed to claim report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report claimed successfully',
    });
  } catch (error) {
    console.error('Claim report error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
