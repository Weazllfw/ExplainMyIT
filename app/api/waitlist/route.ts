import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist } from '@/lib/brevo';
import type { WaitlistFormData } from '@/types/waitlist';

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistFormData = await request.json();

    // Validate email
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Add to waitlist via Brevo
    const result = await addToWaitlist(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "You're on the list! Check your email for confirmation.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
