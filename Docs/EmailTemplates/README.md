# Email Templates for Supabase Auth

This folder contains HTML email templates to be used with Supabase authentication.

## Setup Instructions

### 1. Access Supabase Email Templates

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

### 2. Configure Email Templates

#### Confirm Signup
Copy the contents of `supabase-confirm-signup.html` and paste it into the **Confirm signup** email template in Supabase.

**Important Notes:**
- Supabase uses Go template syntax: `{{ .ConfirmationURL }}`
- The template variable will be automatically replaced by Supabase
- Link expires in 24 hours by default (configurable in Supabase settings)

#### Magic Link
Copy the contents of `supabase-magic-link.html` and paste it into the **Magic Link** email template in Supabase.

**Important Notes:**
- Used for passwordless login
- Link expires in 1 hour by default
- More secure than traditional passwords

#### Reset Password
Copy the contents of `supabase-reset-password.html` and paste it into the **Reset Password** email template in Supabase.

**Important Notes:**
- Sent when user requests password reset
- Link expires in 1 hour by default
- Includes security warning for unauthorized attempts

### 3. Other Templates You May Want to Create

You can apply the same styling to other Supabase auth email templates:

#### Magic Link
```
{{ .ConfirmationURL }} - The magic link URL
```

#### Reset Password
```
{{ .ConfirmationURL }} - The password reset link
```

#### Invite User
```
{{ .ConfirmationURL }} - The invite acceptance link
```

#### Email Change
```
{{ .ConfirmationURL }} - The email change confirmation link
```

## Template Variables Available

Supabase provides these variables in email templates:

| Variable | Description | Available In |
|----------|-------------|--------------|
| `{{ .ConfirmationURL }}` | Confirmation/action URL | All templates |
| `{{ .Token }}` | Raw token (6-digit for OTP) | All templates |
| `{{ .TokenHash }}` | Hashed token | All templates |
| `{{ .SiteURL }}` | Your site URL | All templates |
| `{{ .Email }}` | User's email address | Magic link, Password recovery |
| `{{ .NewEmail }}` | New email address | Email change |
| `{{ .Data }}` | Custom user metadata | All templates |

## Email Styling Guidelines

All our email templates follow these design principles:

### Colors
- **Primary Blue**: `#1f3a5f` to `#2c5282` (gradient header)
- **Accent Blue**: `#06b6d4` (links, highlights)
- **Text Colors**: 
  - Primary: `#1e293b`
  - Secondary: `#475569`
  - Muted: `#64748b`
- **Background**: `#f5f7fa`
- **Card Background**: `white`

### Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Heading**: 28px, bold, white on gradient
- **Body**: 15-16px, line-height 1.6-1.7
- **Small**: 12-14px for footer and meta info

### Layout
- **Max Width**: 600px
- **Border Radius**: 16px on main container, 12px on buttons
- **Padding**: Generous (40px top/bottom, 30px sides)
- **Shadow**: `0 4px 12px rgba(0,0,0,0.08)`

### Components
- **Call-to-Action Button**: Blue background (`#1f3a5f`), white text, rounded (12px)
- **Info Boxes**: Light background with colored left border (4px)
- **Footer**: Light gray background (`#f8fafc`) with border top

## Testing

Before deploying to production:

1. **Test the Confirmation Flow**
   - Create a test account
   - Check email delivery
   - Verify link works
   - Test on mobile and desktop email clients

2. **Test Edge Cases**
   - Long email addresses
   - Expired links
   - Already confirmed accounts

3. **Email Client Compatibility**
   - Gmail (web and mobile)
   - Outlook
   - Apple Mail
   - Mobile devices

## Templates Available

### For Supabase (HTML files)
- `supabase-confirm-signup.html` - Email confirmation for new signups
- `supabase-magic-link.html` - Passwordless login link
- `supabase-reset-password.html` - Password reset request

### For Our App (TypeScript files)
- `/lib/email/templates/confirm-signup.ts` - Signup confirmation
- `/lib/email/templates/magic-link.ts` - Magic link login
- `/lib/email/templates/reset-password.ts` - Password reset
- `/lib/email/templates/subscription-welcome.ts` - Welcome to paid plan
- `/lib/email/templates/monthly-snapshot.ts` - Monthly report ready
- `/lib/email/templates/payment-failed.ts` - Payment issue alert
- `/lib/email/templates/subscription-canceled.ts` - Subscription ended

## Support

For questions about email templates:
- Supabase docs: https://supabase.com/docs/guides/auth/auth-email-templates
- Our email system: See `/lib/email/` in the codebase
