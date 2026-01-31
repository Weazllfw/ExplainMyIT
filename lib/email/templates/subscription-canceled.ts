/**
 * Email Template: Subscription Canceled
 * 
 * Sent when user cancels their subscription
 */

export function buildSubscriptionCanceledEmail(params: {
  name: string;
  accessEndDate: string;
  pricingUrl: string;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Your subscription has been canceled';

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
            <td style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                Subscription Canceled
              </h1>
              <p style="margin: 12px 0 0 0; color: #cbd5e1; font-size: 16px;">
                We've confirmed your cancellation
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
                Your Explain My IT Basic subscription has been canceled as requested.
              </p>
              
              <div style="background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px; font-weight: bold;">
                  What happens now
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Your access continues until <strong style="color: #1e293b;">${params.accessEndDate}</strong></li>
                  <li style="margin-bottom: 8px;">You won't receive automatic monthly snapshots after this date</li>
                  <li style="margin-bottom: 8px;">Past snapshots remain accessible in your dashboard</li>
                  <li style="margin-bottom: 8px;">You can resubscribe anytime</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                We're sorry to see you go. If there's anything we could have done better, we'd love to hear from you — just reply to this email.
              </p>
            </td>
          </tr>
          
          <!-- CTAs -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <table role="presentation" style="margin: 0 auto;">
                      <tr>
                        <td style="background: #1f3a5f; border-radius: 12px; padding: 14px 28px;">
                          <a href="${params.pricingUrl}" style="color: white; text-decoration: none; font-weight: 600; font-size: 15px; display: block;">
                            Resubscribe
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <a href="${params.dashboardUrl}" style="color: #06b6d4; text-decoration: none; font-size: 14px; font-weight: 500;">
                      View Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
                Thank you for using Explain My IT. We hope to see you again soon.
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
Your subscription has been canceled

Hi ${params.name},

Your Explain My IT Basic subscription has been canceled as requested.

What happens now:
• Your access continues until ${params.accessEndDate}
• You won't receive automatic monthly snapshots after this date
• Past snapshots remain accessible in your dashboard
• You can resubscribe anytime

We're sorry to see you go. If there's anything we could have done better, we'd love to hear from you — just reply to this email.

Resubscribe:
${params.pricingUrl}

View Dashboard:
${params.dashboardUrl}

Thank you for using Explain My IT. We hope to see you again soon.

—
Explain My IT
https://explainmyit.com
`;

  return { subject, html, text };
}
