import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/db/supabase-server';
import { getSupabaseAdminClient } from '@/lib/db/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to subscribe' },
        { status: 401 }
      );
    }

    // Get user's email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, stripe_customer_id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create or retrieve Stripe customer
    let customerId = userData.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      console.log(`[Checkout] Created Stripe customer: ${customerId} for user ${userData.email}`);

      // Save customer ID to database (use admin client to bypass RLS)
      const adminClient = getSupabaseAdminClient();
      const { error: updateError } = await adminClient
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('auth_user_id', user.id);

      if (updateError) {
        console.error('[Checkout] Failed to save stripe_customer_id:', updateError);
        throw new Error('Failed to save customer ID');
      }

      console.log(`[Checkout] Saved stripe_customer_id to database for ${userData.email}`);
    } else {
      console.log(`[Checkout] Using existing Stripe customer: ${customerId}`);
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      automatic_tax: {
        enabled: true,
      },
      // Automatically save billing address from checkout to customer
      customer_update: {
        address: 'auto',
      },
      // Collect billing address in checkout form (required for tax calculation)
      billing_address_collection: 'required',
      metadata: {
        supabase_user_id: user.id,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
