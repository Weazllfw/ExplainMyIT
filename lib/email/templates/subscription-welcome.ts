/**
 * Email Template: Subscription Welcome
 * 
 * Sent when user subscribes to Basic plan
 */

export function buildSubscriptionWelcomeEmail(params: {
  name: string;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Welcome to Explain My IT Basic 🎉';

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
            <td style="background: linear-gradient(135deg, #1f3a5f 0%, #2c5282 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                🎉 Welcome to Basic!
              </h1>
              <p style="margin: 12px 0 0 0; color: #7dd3fc; font-size: 16px;">
                Your subscription is now active
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
                Welcome to Explain My IT Basic! Your subscription is now active and your IT snapshots will be generated automatically.
              </p>
              
              <div style="background: #f8fafc; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 18px; font-weight: bold;">
                  What happens next
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 15px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">We'll generate a new snapshot for each of your domains automatically every 30 days</li>
                  <li style="margin-bottom: 8px;">You'll receive an email notification when each snapshot is ready</li>
                  <li style="margin-bottom: 8px;">You can view all past snapshots anytime in your dashboard</li>
                  <li style="margin-bottom: 8px;">Compare snapshots over time to see what changed</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                Most customers use Explain My IT as a background tool — checking in monthly or quarterly, not daily. You'll get reminders when new snapshots are ready.
              </p>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: #1f3a5f; border-radius: 12px; padding: 16px 32px;">
                    <a href="${params.dashboardUrl}" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                      View Your Dashboard →
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
                Questions? Just reply to this email — we're here to help.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                <strong>Explain My IT</strong> - Understanding your IT, one snapshot at a time<br>
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
Welcome to Explain My IT Basic!

Hi ${params.name},

Welcome to Explain My IT Basic! Your subscription is now active and your IT snapshots will be generated automatically.

What happens next:
• We'll generate a new snapshot for each of your domains automatically every 30 days
• You'll receive an email notification when each snapshot is ready
• You can view all past snapshots anytime in your dashboard
• Compare snapshots over time to see what changed

Most customers use Explain My IT as a background tool — checking in monthly or quarterly, not daily. You'll get reminders when new snapshots are ready.

View your dashboard:
${params.dashboardUrl}

Questions? Just reply to this email — we're here to help.

—
Explain My IT
https://explainmyit.com
`;

  return { subject, html, text };
}
