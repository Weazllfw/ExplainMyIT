/**
 * Email Template: Magic Link (for Supabase)
 * 
 * Sent when user requests a passwordless login link
 * Note: This is used by Supabase auth, not directly by our app
 */

export function buildMagicLinkEmail(params: {
  confirmationUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = 'Your secure login link';

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
                🔐 Your Login Link
              </h1>
              <p style="margin: 12px 0 0 0; color: #7dd3fc; font-size: 16px;">
                Secure, passwordless access
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 24px 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hi there,
              </p>
              
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.7;">
                Click the button below to securely log in to your Explain My IT account. This link will log you in instantly — no password required.
              </p>
              
              <div style="background: #ecfeff; border-left: 4px solid #06b6d4; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; color: #0e7490; font-size: 14px; line-height: 1.6;">
                  <strong>🔒 Security note:</strong> This link is unique to you and expires in 1 hour. Never share this link with anyone.
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
                    <a href="${params.confirmationUrl}" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; display: block;">
                      Log In to Your Account →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${params.confirmationUrl}" style="color: #06b6d4; text-decoration: none; word-break: break-all;">${params.confirmationUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Security Warning -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Didn't request this login link?</strong><br>
                  If you didn't try to log in, you can safely ignore this email. Someone may have accidentally entered your email address.
                </p>
              </div>
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
Your secure login link

Hi there,

Click the link below to securely log in to your Explain My IT account. This link will log you in instantly — no password required.

${params.confirmationUrl}

🔒 Security note: This link is unique to you and expires in 1 hour. Never share this link with anyone.

⚠️ Didn't request this login link?
If you didn't try to log in, you can safely ignore this email. Someone may have accidentally entered your email address.

Questions? Just reply to this email — we're here to help.

—
Explain My IT
https://explainmyit.com
`;

  return { subject, html, text };
}
