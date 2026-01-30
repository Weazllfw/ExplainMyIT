/**
 * Create User Record API Route
 * 
 * POST /api/auth/create-user-record
 * Creates a user record in the database after Supabase Auth signup
 */

import { NextResponse } from 'next/server';
import { upsertUserFromAuth } from '@/lib/db/users';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authUserId, email, fullName } = body;

    if (!authUserId || !email) {
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
      console.error('Failed to create user record:', error);
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Create user record error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
