/**
 * Stripe Webhook Handler
 * 
 * Processes subscription lifecycle events from Stripe
 * 
 * Events handled:
 * - customer.subscription.created - New subscription activated
 * - customer.subscription.updated - Subscription changed (renewal, upgrade, etc.)
 * - customer.subscription.deleted - Subscription canceled
 * - invoice.payment_succeeded - Payment successful
 * - invoice.payment_failed - Payment failed
 * 
 * Security:
 * - Webhook signature verification (prevents spoofing)
 * - Idempotency (prevents duplicate processing)
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  verifyWebhookSignature,
  isNewWebhookEvent,
  recordWebhookEvent,
  extractSubscriptionDetails,
} from '@/lib/stripe/webhooks';
import { updateUserSubscription, getUserByStripeCustomerId } from '@/lib/stripe/subscriptions';

/**
 * Disable Next.js body parsing - we need the raw body for signature verification
 */
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('[Webhook] Received Stripe webhook');

  try {
    // Get raw body and signature
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('[Webhook] Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(payload, signature);
    } catch (err) {
      console.error('[Webhook] Signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Event type: ${event.type}, ID: ${event.id}`);

    // Check idempotency - skip if already processed
    const isNew = await isNewWebhookEvent(event.id);
    if (!isNew) {
      console.log(`[Webhook] Event ${event.id} already processed - skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }

    // Process event based on type
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Record event as processed
    await recordWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle subscription.created and subscription.updated
 */
async function handleSubscriptionChange(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const details = extractSubscriptionDetails(subscription);

  console.log(
    `[Webhook] Subscription change: ${details.customerId} → ${details.status}`
  );

  // Verify user exists
  const user = await getUserByStripeCustomerId(details.customerId);
  if (!user) {
    console.error(`[Webhook] User not found for customer ${details.customerId}`);
    return;
  }

  // Update user's subscription status
  await updateUserSubscription({
    stripeCustomerId: details.customerId,
    subscriptionId: details.subscriptionId,
    status: details.status,
    periodEnd: details.periodEnd,
    cancelAtPeriodEnd: details.cancelAtPeriodEnd,
  });

  console.log(
    `[Webhook] Updated user ${user.email} subscription: ${details.status}`
  );

  // TODO: Send welcome email for new subscriptions
  if (event.type === 'customer.subscription.created' && details.status === 'active') {
    console.log(`[Webhook] New active subscription - send welcome email to ${user.email}`);
    // await sendWelcomeEmail(user.email);
  }
}

/**
 * Handle subscription.deleted (cancellation)
 */
async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  console.log(`[Webhook] Subscription deleted: ${customerId}`);

  const user = await getUserByStripeCustomerId(customerId);
  if (!user) {
    console.error(`[Webhook] User not found for customer ${customerId}`);
    return;
  }

  // Update user to canceled status
  await updateUserSubscription({
    stripeCustomerId: customerId,
    subscriptionId: null,
    status: 'canceled',
    periodEnd: null,
    cancelAtPeriodEnd: false,
  });

  console.log(`[Webhook] User ${user.email} subscription canceled`);

  // TODO: Send cancellation confirmation email
  // await sendCancellationEmail(user.email);
}

/**
 * Handle invoice.payment_succeeded
 */
async function handlePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as any; // Use any to handle Stripe type variations
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription?.id;

  if (!subscriptionId) {
    // Not a subscription invoice, skip
    return;
  }

  console.log(`[Webhook] Payment succeeded for subscription: ${subscriptionId}`);

  // Payment success usually triggers subscription.updated, so we don't need to do much here
  // Just log for monitoring

  // TODO: Send payment receipt email if desired
}

/**
 * Handle invoice.payment_failed
 */
async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as any; // Use any to handle Stripe type variations
  const customerId = invoice.customer as string;
  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription?.id;

  if (!subscriptionId) {
    return;
  }

  console.log(`[Webhook] Payment failed for subscription: ${subscriptionId}`);

  const user = await getUserByStripeCustomerId(customerId);
  if (!user) {
    console.error(`[Webhook] User not found for customer ${customerId}`);
    return;
  }

  // Stripe automatically sets subscription to 'past_due'
  // This will be reflected in the next subscription.updated event
  // We just need to notify the user

  console.log(`[Webhook] Payment failed for ${user.email} - send retry email`);

  // TODO: Send payment failed email with retry instructions
  // await sendPaymentFailedEmail(user.email);
}
