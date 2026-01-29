/**
 * Brevo Webhook Handler
 * 
 * Receives email engagement events from Brevo:
 * - Email delivered
 * - Email opened
 * - Link clicked
 * - Email bounced
 * - Spam complaint
 * 
 * Events are logged and can be sent to Umami for analytics
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.BREVO_WEBHOOK_SECRET;

/**
 * Verify Brevo webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn('BREVO_WEBHOOK_SECRET not configured - skipping signature verification');
    return true; // Allow in development
  }

  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Track email event in Umami
 * TODO: Implement when Umami server-side tracking is ready
 */
async function trackEmailEvent(
  eventType: string,
  email: string,
  metadata?: Record<string, any>
) {
  // For now, just log it
  console.log(`📊 Email event: ${eventType}`, {
    email,
    ...metadata,
  });

  // TODO: Send to Umami
  // await fetch('https://cloud.umami.is/api/send', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-umami-api-key': process.env.UMAMI_API_KEY,
  //   },
  //   body: JSON.stringify({
  //     type: 'event',
  //     payload: {
  //       website: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  //       name: `email_${eventType}`,
  //       data: { email, ...metadata }
  //     }
  //   })
  // });
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-brevo-signature');

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse event
    const event = JSON.parse(rawBody);

    console.log(`📨 Brevo webhook received: ${event.event}`, {
      email: event.email,
      messageId: event['message-id'],
      date: event.date,
    });

    // Handle different event types
    switch (event.event) {
      case 'delivered':
        await trackEmailEvent('delivered', event.email, {
          messageId: event['message-id'],
          tag: event.tag,
        });
        break;

      case 'opened':
      case 'unique_opened':
        await trackEmailEvent('opened', event.email, {
          messageId: event['message-id'],
          tag: event.tag,
          unique: event.event === 'unique_opened',
        });
        break;

      case 'click':
      case 'unique_clicked':
        await trackEmailEvent('clicked', event.email, {
          messageId: event['message-id'],
          link: event.link,
          tag: event.tag,
          unique: event.event === 'unique_clicked',
        });
        break;

      case 'soft_bounce':
      case 'hard_bounce':
        console.warn(`⚠️  Email bounced (${event.event}):`, event.email, event.reason);
        await trackEmailEvent('bounced', event.email, {
          messageId: event['message-id'],
          bounceType: event.event,
          reason: event.reason,
        });
        break;

      case 'spam':
      case 'blocked':
        console.warn(`⚠️  Email ${event.event}:`, event.email);
        await trackEmailEvent(event.event, event.email, {
          messageId: event['message-id'],
          reason: event.reason,
        });
        break;

      case 'unsubscribed':
        console.log(`📋 User unsubscribed:`, event.email);
        await trackEmailEvent('unsubscribed', event.email, {
          messageId: event['message-id'],
        });
        break;

      default:
        console.log(`ℹ️  Unknown Brevo event type: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Brevo webhook error:', error);

    // Return 200 anyway to prevent Brevo from retrying
    // (we don't want to miss events due to temporary errors)
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

/**
 * GET handler for webhook verification (Brevo sometimes sends test GET requests)
 */
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    service: 'brevo-webhook',
  });
}
