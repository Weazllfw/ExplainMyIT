/**
 * Centralized Email Service for Explain My IT
 * 
 * All email sending goes through this service for:
 * - Consistent branding and formatting
 * - Local HTML template management
 * - Error handling and retry logic
 * - Analytics and tracking
 */

import { sendEmail } from './brevo-client';
import type { EmailRecipient } from './brevo-client';
import { buildSubscriptionWelcomeEmail } from './templates/subscription-welcome';
import { buildMonthlySnapshotEmail } from './templates/monthly-snapshot';
import { buildPaymentFailedEmail } from './templates/payment-failed';
import { buildSubscriptionCanceledEmail } from './templates/subscription-canceled';

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

const EMAIL_CONFIG = {
  sender: {
    name: 'Explain My IT',
    email: 'noreply@explainmyit.com',
  },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://explainmyit.com',
  brandColor: '#1f3a5f',
  accentColor: '#06b6d4',
} as const;

// ============================================================================
// SNAPSHOT EMAILS
// ============================================================================

/**
 * Send snapshot completion email with magic link
 * Uses LLM-generated content with branded HTML wrapper
 */
export async function sendSnapshotReadyEmail(params: {
  email: string;
  domain: string;
  subject: string;
  body: string;
  magicLink: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Email] Sending snapshot ready to ${params.email}`);

  const recipient: EmailRecipient = {
    email: params.email,
    name: params.email.split('@')[0],
  };

  // Parse LLM-generated body
  const sections = params.body.split('\n\n');
  const intro = sections[0] || '';
  const content = sections.slice(1).join('\n\n');

  const htmlContent = buildSnapshotEmailHTML({
    domain: params.domain,
    intro,
    content,
    magicLink: params.magicLink,
    recipientEmail: params.email,
  });

  const textContent = buildSnapshotEmailText({
    domain: params.domain,
    body: params.body,
    magicLink: params.magicLink,
    recipientEmail: params.email,
  });

  return sendEmail({
    to: [recipient],
    subject: params.subject,
    htmlContent,
    textContent,
    tags: ['snapshot', 'free-tier'],
  });
}

/**
 * Send monthly snapshot email (Basic subscribers)
 */
export async function sendMonthlySnapshotEmail(params: {
  email: string;
  domain: string;
  snapshotId: string;
  name?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Email] Sending monthly snapshot to ${params.email} for ${params.domain}`);

  const reportUrl = `${EMAIL_CONFIG.baseUrl}/report/${params.snapshotId}`;
  const dashboardUrl = `${EMAIL_CONFIG.baseUrl}/dashboard`;

  const { subject, html, text } = buildMonthlySnapshotEmail({
    name: params.name || params.email,
    domain: params.domain,
    reportUrl,
    dashboardUrl,
  });

  return sendEmail({
    to: [{ email: params.email, name: params.name }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ['subscription', 'monthly-snapshot'],
  });
}

// ============================================================================
// SUBSCRIPTION LIFECYCLE EMAILS
// ============================================================================

/**
 * Send welcome email to new Basic subscriber
 */
export async function sendSubscriptionWelcomeEmail(params: {
  email: string;
  name?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Email] Sending subscription welcome to ${params.email}`);

  const dashboardUrl = `${EMAIL_CONFIG.baseUrl}/dashboard`;

  const { subject, html, text } = buildSubscriptionWelcomeEmail({
    name: params.name || params.email,
    dashboardUrl,
  });

  return sendEmail({
    to: [{ email: params.email, name: params.name }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ['subscription', 'welcome'],
  });
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(params: {
  email: string;
  name?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Email] Sending payment failed to ${params.email}`);

  const portalUrl = `${EMAIL_CONFIG.baseUrl}/dashboard`;

  const { subject, html, text } = buildPaymentFailedEmail({
    name: params.name || params.email,
    portalUrl,
  });

  return sendEmail({
    to: [{ email: params.email, name: params.name }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ['subscription', 'payment-failed'],
  });
}

/**
 * Send subscription canceled confirmation
 */
export async function sendSubscriptionCanceledEmail(params: {
  email: string;
  periodEnd: Date;
  name?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  console.log(`[Email] Sending cancellation to ${params.email}`);

  const accessEndDate = params.periodEnd.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const pricingUrl = `${EMAIL_CONFIG.baseUrl}/pricing`;
  const dashboardUrl = `${EMAIL_CONFIG.baseUrl}/dashboard`;

  const { subject, html, text } = buildSubscriptionCanceledEmail({
    name: params.name || params.email,
    accessEndDate,
    pricingUrl,
    dashboardUrl,
  });

  return sendEmail({
    to: [{ email: params.email, name: params.name }],
    subject,
    htmlContent: html,
    textContent: text,
    tags: ['subscription', 'canceled'],
  });
}

// ============================================================================
// HTML EMAIL BUILDERS
// ============================================================================

function buildSnapshotEmailHTML(params: {
  domain: string;
  intro: string;
  content: string;
  magicLink: string;
  recipientEmail: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your IT Snapshot is Ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${EMAIL_CONFIG.brandColor} 0%, #2c5282 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: bold;">
                📊 Your IT Snapshot is Ready
              </h1>
              <p style="margin: 8px 0 0 0; color: #7dd3fc; font-size: 14px;">
                ${params.domain}
              </p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="padding: 30px; background: #f8fafc;">
              <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                ${params.intro.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <div style="color: #475569; font-size: 15px; line-height: 1.7;">
                ${params.content
                  .split('\n\n')
                  .map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
                  .join('')}
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: ${EMAIL_CONFIG.brandColor}; border-radius: 12px; padding: 16px 32px;">
                    <a href="${params.magicLink}" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                      View Your Full Report →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 12px 0 0 0; font-size: 13px; color: #64748b;">
                Or copy this link: <a href="${params.magicLink}" style="color: ${EMAIL_CONFIG.accentColor}; word-break: break-all;">${params.magicLink}</a>
              </p>
            </td>
          </tr>
          
          <!-- Upgrade Prompt -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: #ecfeff; border-left: 4px solid ${EMAIL_CONFIG.accentColor}; border-radius: 8px; padding: 16px;">
                <p style="margin: 0; color: #0e7490; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Want automatic monthly snapshots?</strong><br>
                  Upgrade to Basic for just $20/month and track changes over time without lifting a finger.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                This email was sent to <strong>${params.recipientEmail}</strong> because you requested a snapshot for <strong>${params.domain}</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                If you didn't request this, you can safely ignore this email. The report link expires in 30 days.
              </p>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #94a3b8;">
                <strong>Explain My IT</strong> - Understanding your IT, one snapshot at a time<br>
                <a href="${EMAIL_CONFIG.baseUrl}" style="color: ${EMAIL_CONFIG.accentColor}; text-decoration: none;">${EMAIL_CONFIG.baseUrl.replace('https://', '')}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildSnapshotEmailText(params: {
  domain: string;
  body: string;
  magicLink: string;
  recipientEmail: string;
}): string {
  return `Your IT Snapshot is Ready - ${params.domain}

${params.body}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View your full report:
${params.magicLink}

💡 Want automatic monthly snapshots?
Upgrade to Basic for just $20/month and track changes over time.
${EMAIL_CONFIG.baseUrl}/pricing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email was sent to ${params.recipientEmail} because you requested a snapshot for ${params.domain}.

If you didn't request this, you can safely ignore this email.
The report link expires in 30 days.

Explain My IT - Understanding your IT, one snapshot at a time
${EMAIL_CONFIG.baseUrl}`;
}
