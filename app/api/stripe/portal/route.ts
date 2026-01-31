/**
 * Stripe Customer Portal Session Creator
 * 
 * Creates a Stripe Billing Portal session for authenticated users
 * Allows users to:
 * - Cancel subscription
 * - Update payment method
 * - View invoices & receipts
 * - Download receipts
 * 
 * Security: Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('auth_user_id', user.id)
      .single();

    if (error || !dbUser?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Get return URL from request or use default
    const { return_url } = await req.json().catch(() => ({}));
    const returnUrl =
      return_url || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;

    // Create Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripe_customer_id,
      return_url: returnUrl,
    });

    console.log(
      `[Portal] Created session for customer ${dbUser.stripe_customer_id}`
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('[Portal] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
