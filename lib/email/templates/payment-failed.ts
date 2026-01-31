/**
 * Email Template: Payment Failed
 * 
 * Sent when payment fails and needs to be updated
 */

export function buildPaymentFailedEmail(params: {
  name: string;
  portalUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Payment failed - please update your payment method';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                ⚠️ Payment Failed
              </h1>
              <p style="margin: 12px 0 0 0; color: #fed7aa; font-size: 16px;">
                Action required to keep your subscription active
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 24px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hi ${params.name},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                We weren't able to process your payment for Explain My IT Basic.
              </p>
              
              <div style="background: #fff7ed; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: bold;">
                  What this means
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #78350f; font-size: 14px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Your subscription is still active for now</li>
                  <li style="margin-bottom: 8px;">We'll retry the payment automatically</li>
                  <li style="margin-bottom: 8px;">Please update your payment method to avoid service interruption</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                Common reasons for payment failure:
              </p>
              <ul style="margin: 0 0 24px 0; padding: 0 0 0 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
                <li style="margin-bottom: 6px;">Expired credit card</li>
                <li style="margin-bottom: 6px;">Insufficient funds</li>
                <li style="margin-bottom: 6px;">Card limit reached</li>
                <li style="margin-bottom: 6px;">Bank declined the charge</li>
              </ul>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: #f97316; border-radius: 12px; padding: 16px 32px;">
                    <a href="${params.portalUrl}" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                      Update Payment Method →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 13px; color: #64748b;">
                This will open your subscription management portal
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
                Questions? Just reply to this email — we're here to help.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                <strong>Explain My IT</strong><br>
                <a href="https://explainmyit.com" style="color: #06b6d4; text-decoration: none;">explainmyit.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `
Payment failed - please update your payment method

Hi ${params.name},

We weren't able to process your payment for Explain My IT Basic.

What this means:
• Your subscription is still active for now
• We'll retry the payment automatically
• Please update your payment method to avoid service interruption

Common reasons for payment failure:
• Expired credit card
• Insufficient funds
• Card limit reached
• Bank declined the charge

Update your payment method:
${params.portalUrl}

Questions? Just reply to this email — we're here to help.

—
Explain My IT
https://explainmyit.com
`;

  return { subject, html, text };
}
