/**
 * Email Template: Monthly Snapshot Ready
 * 
 * Sent when automatic monthly snapshot is generated
 */

export function buildMonthlySnapshotEmail(params: {
  name: string;
  domain: string;
  reportUrl: string;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Your ${params.domain} snapshot is ready`;

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
                📊 Your Monthly Snapshot is Ready
              </h1>
              <p style="margin: 12px 0 0 0; color: #7dd3fc; font-size: 18px; font-weight: 500;">
                ${params.domain}
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
                Your monthly IT snapshot for <strong style="color: #1e293b;">${params.domain}</strong> is ready to view.
              </p>
              
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                This snapshot reflects how your IT setup appears as of today. Compare it with past snapshots to see what's changed over time.
              </p>
              
              <div style="background: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; color: #0e7490; font-size: 14px; line-height: 1.6;">
                  <strong>💡 Tip:</strong> Look for differences from your last snapshot. Changes in DNS, certificates, or email security often happen quietly without notification.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px 30px; text-align: center;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: #1f3a5f; border-radius: 12px; padding: 16px 32px;">
                    <a href="${params.reportUrl}" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                      View Your Report →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; font-size: 13px; color: #64748b;">
                <a href="${params.dashboardUrl}" style="color: #06b6d4; text-decoration: none;">View all snapshots in your dashboard</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.6; text-align: center;">
                Your next snapshot will be generated in approximately 30 days.
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
Your ${params.domain} snapshot is ready

Hi ${params.name},

Your monthly IT snapshot for ${params.domain} is ready to view.

This snapshot reflects how your IT setup appears as of today. Compare it with past snapshots to see what's changed over time.

💡 Tip: Look for differences from your last snapshot. Changes in DNS, certificates, or email security often happen quietly without notification.

View your report:
${params.reportUrl}

View all snapshots:
${params.dashboardUrl}

Your next snapshot will be generated in approximately 30 days.

—
Explain My IT
https://explainmyit.com
`;

  return { subject, html, text };
}
