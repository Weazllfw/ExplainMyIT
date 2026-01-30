# Supabase Email Configuration for Password Reset

**Important**: For password reset emails to work in production, you need to configure Supabase email settings.

---

## Current Setup Status

### ✅ **Code is Ready**
- Password reset flow implemented
- Forms and pages created
- Analytics tracking added

### ⚠️ **Supabase Email Needs Configuration**

By default, Supabase uses their email service which has limitations:
- Rate limited (low volume)
- Generic "from" address
- Basic email templates

---

## Quick Test (Development)

### **Using Supabase's Default Email**

For testing on dev branch, Supabase's default email will work:

1. **Go to Supabase Dashboard**:
   - Project: `xtnbglbmrzckranjevth`
   - Authentication → Email Templates

2. **Enable "Confirm signup" if needed**:
   - Check "Enable email confirmations"
   - This is required for password resets to work

3. **Test the Flow**:
   - Go to `/forgot-password`
   - Enter a valid email (that you have access to)
   - Check your email for reset link
   - Click link → should go to `/reset-password`

---

## Production Setup (Recommended)

### **Option 1: Use Brevo for Auth Emails (Recommended)**

You're already using Brevo for snapshot emails. You can use it for auth emails too.

#### **Steps**:

1. **Configure Brevo SMTP in Supabase**:
   - Go to: Project Settings → Auth → SMTP Settings
   - Enable Custom SMTP
   - **SMTP Details**:
     ```
     Host: smtp-relay.brevo.com
     Port: 587
     Username: [Your Brevo SMTP username]
     Password: [Your Brevo SMTP password]
     From: noreply@explainmy.it (or your verified domain)
     ```

2. **Get Brevo SMTP Credentials**:
   - Brevo Dashboard → SMTP & API
   - Generate SMTP credentials
   - Copy username and password

3. **Benefits**:
   - ✅ Higher email limits
   - ✅ Better deliverability
   - ✅ Your brand domain
   - ✅ Consistent with snapshot emails

---

### **Option 2: Keep Supabase Default (Easier for MVP)**

For now, you can keep using Supabase's default email service:

#### **Pros**:
- ✅ Zero setup required
- ✅ Works immediately
- ✅ Good enough for testing/MVP

#### **Cons**:
- ⚠️ Rate limited (fewer emails per hour)
- ⚠️ Generic "from" address
- ⚠️ May land in spam more often

#### **When to Upgrade**:
- When you get more users
- When you want branded emails
- When deliverability matters more

---

## Customizing Email Templates

### **Make Password Reset Email Match Your Brand**

1. **Go to Supabase Dashboard**:
   - Authentication → Email Templates
   - Select "Reset Password" template

2. **Customize Template**:
   ```html
   <h2>Reset Your Password</h2>
   <p>Hi there,</p>
   <p>You requested to reset your password for Explain My IT.</p>
   <p>Click the link below to create a new password:</p>
   <a href="{{ .ConfirmationURL }}">Reset Password</a>
   <p>If you didn't request this, you can safely ignore this email.</p>
   <p>— The Explain My IT Team</p>
   ```

3. **Available Variables**:
   - `{{ .ConfirmationURL }}` - Reset link with token
   - `{{ .Email }}` - User's email
   - `{{ .Token }}` - Reset token

4. **Styling**:
   - Add your logo
   - Use brand colors (#0F172A for navy, #06B6D4 for cyan)
   - Match your snapshot email design

---

## Testing Checklist

### **1. Basic Test**
- [ ] Go to `/login` → Click "Forgot password?"
- [ ] Enter email → Submit
- [ ] Check email (including spam)
- [ ] Click reset link
- [ ] Create new password
- [ ] Log in with new password

### **2. Email Deliverability**
- [ ] Test with Gmail
- [ ] Test with Outlook
- [ ] Test with company email domain
- [ ] Check spam folder
- [ ] Verify link works

### **3. Error Scenarios**
- [ ] Try invalid email → See error
- [ ] Try very short password → See validation error
- [ ] Try mismatched passwords → See error
- [ ] Try expired reset link → See Supabase error

---

## Current Environment Variable

Your `.env.local` already has:
```env
NEXT_PUBLIC_BASE_URL=https://explain-my-it-git-dev-mdsltd.vercel.app
```

**Make sure this is also set in Vercel**:
1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add `NEXT_PUBLIC_BASE_URL`:
   - **Preview**: `https://explain-my-it-git-dev-mdsltd.vercel.app`
   - **Production**: `https://explainmy.it` (when you go live)

---

## Next Steps

### **For Immediate Testing** (Dev Branch)
1. Deploy the changes to Vercel
2. Test password reset flow with your email
3. Verify emails arrive (check spam)
4. Verify reset link works

### **Before Production Launch**
1. Decide: Brevo SMTP or Supabase default
2. If Brevo: Configure SMTP in Supabase
3. Customize email templates with branding
4. Test with multiple email providers
5. Update `NEXT_PUBLIC_BASE_URL` to production domain

---

## Troubleshooting

### **"Email not arriving"**
- Check spam folder
- Verify email confirmation enabled in Supabase
- Check Supabase logs (Authentication → Logs)
- Try different email provider (Gmail, Outlook)

### **"Reset link doesn't work"**
- Verify `NEXT_PUBLIC_BASE_URL` is correct
- Check link in email - should point to your domain
- Verify token hasn't expired (24 hours default)
- Check browser console for errors

### **"Invalid or expired token"**
- Reset links expire after 24 hours
- Links are single-use only
- Request a new reset email

---

**Status**: Code is ready ✅  
**Action Needed**: Test the flow after deployment and configure Brevo SMTP before production.
