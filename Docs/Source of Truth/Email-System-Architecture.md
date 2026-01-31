# Email System Architecture

**Last Updated**: 2026-01-31  
**Status**: Production Ready

---

## Overview

The email system handles all transactional communications: snapshot reports, subscription lifecycle events, and account management.

**Key Decision**: HTML templates stored in code (NOT Brevo dashboard) for version control and TypeScript safety.

---

## Architecture

### **Centralized Service**

**File**: `lib/email/index.ts`

**Philosophy**: Single source of truth for all email operations

**Benefits:**
- ✅ Version control (Git)
- ✅ TypeScript safety
- ✅ Local preview
- ✅ No Brevo dashboard dependency
- ✅ Consistent branding

---

## Email Templates (4 Total)

### **1. Subscription Welcome**
**File**: `lib/email/templates/subscription-welcome.ts`

**Trigger**: User subscribes to Basic plan

**Function**:
```typescript
buildSubscriptionWelcomeEmail({
  name: string;
  dashboardUrl: string;
})
```

**Subject**: "Welcome to Explain My IT Basic 🎉"

**Content:**
- Welcome message
- What happens next (4 bullet points)
- Usage expectation (background tool)
- CTA: "View Your Dashboard"

**Design:**
- Gradient header (navy)
- Cyan accents
- Professional footer

---

### **2. Monthly Snapshot Ready**
**File**: `lib/email/templates/monthly-snapshot.ts`

**Trigger**: Cron job generates automatic snapshot

**Function**:
```typescript
buildMonthlySnapshotEmail({
  name: string;
  domain: string;
  reportUrl: string;
  dashboardUrl: string;
})
```

**Subject**: "Your {domain} snapshot is ready"

**Content:**
- Domain name in hero
- Explanation of snapshot
- Tip box (look for changes)
- CTA: "View Your Report"
- Secondary link: Dashboard

**Design:**
- Gradient header (navy)
- Cyan tip box
- Direct report link

---

### **3. Payment Failed**
**File**: `lib/email/templates/payment-failed.ts`

**Trigger**: Stripe payment fails

**Function**:
```typescript
buildPaymentFailedEmail({
  name: string;
  portalUrl: string;
})
```

**Subject**: "Payment failed - please update your payment method"

**Content:**
- Clear problem statement
- What this means (3 bullet points)
- Common reasons (4 bullet points)
- CTA: "Update Payment Method"

**Design:**
- Orange gradient header (warning)
- Amber warning box
- Urgent (but calm) tone

---

### **4. Subscription Canceled**
**File**: `lib/email/templates/subscription-canceled.ts`

**Trigger**: User cancels subscription

**Function**:
```typescript
buildSubscriptionCanceledEmail({
  name: string;
  accessEndDate: string;  // "January 15, 2026"
  pricingUrl: string;
  dashboardUrl: string;
})
```

**Subject**: "Your subscription has been canceled"

**Content:**
- Confirmation message
- What happens now (4 bullet points, includes end date)
- Sorry to see you go
- CTAs: "Resubscribe" + "View Dashboard"

**Design:**
- Gray gradient header (neutral)
- Calm, respectful tone
- Resubscribe option

---

## Email Configuration

**Sender** (`lib/email/index.ts`):
```typescript
const EMAIL_CONFIG = {
  sender: {
    name: 'Explain My IT',
    email: 'noreply@explainmyit.com',  // Standardized
  },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://explainmyit.com',
  brandColor: '#1f3a5f',
  accentColor: '#06b6d4',
};
```

**Environment Variables**:
```bash
BREVO_API_KEY=xkeysib-xxx  # Required
NEXT_PUBLIC_BASE_URL=https://explainmyit.com  # For links
```

---

## Brevo Integration

### **API Client**
**File**: `lib/email/brevo-client.ts`

**Purpose**: Low-level API wrapper for Brevo

**Functions:**
```typescript
// Send custom HTML email
sendEmail({
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
})

// Legacy: Send template email (not used)
sendTemplateEmail(templateId, to, params, tags)
```

**Why Custom HTML?**
- No template IDs to manage
- Templates live in Git
- Faster iteration
- Better type safety

---

### **Email Flow**

```
Template Function (in code)
  ↓
buildXxxEmail(params)
  - Returns: { subject, html, text }
  ↓
sendEmail() wrapper
  - Calls Brevo API
  - Adds tags for tracking
  - Returns: { success, messageId, error }
  ↓
Brevo delivers email
  - Tracks opens/clicks automatically
  - Fires webhooks for events
```

**Example**:
```typescript
// 1. Build email from template
const { subject, html, text } = buildSubscriptionWelcomeEmail({
  name: 'John Doe',
  dashboardUrl: 'https://explainmyit.com/dashboard',
});

// 2. Send via Brevo
await sendEmail({
  to: [{ email: 'john@example.com', name: 'John Doe' }],
  subject,
  htmlContent: html,
  textContent: text,
  tags: ['subscription', 'welcome'],
});
```

---

## Email Sending Functions

**File**: `lib/email/index.ts`

### **Subscription Welcome**
```typescript
sendSubscriptionWelcomeEmail({
  email: string;
  name?: string;
})
```

**Called by**: `app/api/stripe/webhook/route.ts` (on `customer.subscription.created`)

---

### **Monthly Snapshot**
```typescript
sendMonthlySnapshotEmail({
  email: string;
  domain: string;
  snapshotId: string;
  name?: string;
})
```

**Called by**: `app/api/cron/monthly-snapshots/route.ts` (after snapshot generation)

---

### **Payment Failed**
```typescript
sendPaymentFailedEmail({
  email: string;
  name?: string;
})
```

**Called by**: `app/api/stripe/webhook/route.ts` (on `invoice.payment_failed`)

---

### **Subscription Canceled**
```typescript
sendSubscriptionCanceledEmail({
  email: string;
  periodEnd: Date;
  name?: string;
})
```

**Called by**: `app/api/stripe/webhook/route.ts` (on `customer.subscription.deleted`)

---

### **Snapshot Ready (Free Tier)**
```typescript
sendSnapshotReadyEmail({
  email: string;
  domain: string;
  snapshotId: string;
  reportSummary: string;  // LLM-generated
  name?: string;
})
```

**Called by**: `app/api/snapshot/route.ts` (after snapshot completion)

**Special**: Uses LLM-generated content in email body

---

## Template Design System

### **Shared Components**

**Header** (all emails):
```html
<table>
  <tr>
    <td style="background: linear-gradient(135deg, #1f3a5f 0%, #2c5282 100%); 
               padding: 40px 30px; 
               text-align: center;">
      <h1 style="color: white; font-size: 28px;">
        [Title with emoji]
      </h1>
      <p style="color: #7dd3fc; font-size: 16px;">
        [Subtitle]
      </p>
    </td>
  </tr>
</table>
```

**Footer** (all emails):
```html
<tr>
  <td style="padding: 24px 30px; 
             background: #f8fafc; 
             border-top: 1px solid #e2e8f0;">
    <p style="font-size: 14px; color: #64748b; text-align: center;">
      [Contextual message]
    </p>
    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
      <strong>Explain My IT</strong><br>
      <a href="https://explainmyit.com">explainmyit.com</a>
    </p>
  </td>
</tr>
```

**CTA Button**:
```html
<table role="presentation" style="margin: 0 auto;">
  <tr>
    <td style="background: #1f3a5f; 
               border-radius: 12px; 
               padding: 16px 32px;">
      <a href="[URL]" 
         style="color: white; 
                text-decoration: none; 
                font-weight: 600; 
                font-size: 16px;">
        [Button Text] →
      </a>
    </td>
  </tr>
</table>
```

---

### **Color System**

**Brand Colors** (matches web):
- Navy: `#1f3a5f` (primary)
- Cyan: `#06b6d4` (accent)
- Slate: `#64748b` (body text)
- Muted: `#94a3b8` (secondary text)

**Contextual Colors**:
- Warning: `#f97316` (orange, payment failed)
- Neutral: `#64748b` (gray, cancelation)

---

### **Typography**

**Font Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

**Sizes**:
- H1: 28px (hero title)
- H2: 18px (section title)
- H3: 16px (card title)
- Body: 15px (content)
- Small: 14px (footer), 12px (fine print)

---

## Email Rendering

### **Tested Clients**

**Desktop:**
- ✅ Gmail (web)
- ✅ Outlook (web + desktop)
- ✅ Apple Mail (macOS)
- ✅ Proton Mail

**Mobile:**
- ✅ Gmail (iOS + Android)
- ✅ Apple Mail (iOS)
- ✅ Outlook (iOS + Android)

**Fallbacks:**
- Plain text version (all emails)
- Inline CSS (no external stylesheets)
- Graceful degradation (gradients → solid colors)

---

### **Email Best Practices**

**Structure:**
- Table-based layout (email clients don't support modern CSS)
- Inline styles (external CSS blocked)
- Max width: 600px (optimal for mobile)

**Accessibility:**
- Semantic HTML (`<h1>`, `<p>`, `<a>`)
- Alt text for images (if added)
- High contrast (navy on white)
- Readable font sizes (≥14px)

**Deliverability:**
- SPF/DKIM records (via Brevo)
- Unsubscribe link (transactional exempt, but good practice)
- Plain text alternative
- No spam trigger words

---

## Brevo Configuration

### **Sender Verification**

**Steps:**
1. Go to Brevo Dashboard → Settings → Senders
2. Add sender: `noreply@explainmyit.com`
3. Verify via DNS:
   - Add SPF record
   - Add DKIM record
   - Wait for verification (5-10 minutes)

**DNS Records** (provided by Brevo):
```
TXT @ "v=spf1 include:spf.sendinblue.com ~all"
TXT mail._domainkey.[value from Brevo]
```

---

### **Email Tags** (for tracking)

**Used in code:**
- `subscription` - All subscription-related emails
- `welcome` - Welcome email
- `monthly-snapshot` - Automated snapshot emails
- `payment-failed` - Payment issues
- `canceled` - Cancellation confirmations
- `snapshot` - Free tier snapshot emails

**Benefits:**
- Filter in Brevo dashboard
- Track open/click rates by type
- Segment for debugging

---

## Testing

### **Test Script**
**File**: `scripts/test-email.ts`

**Usage**:
```bash
npx tsx scripts/test-email.ts
```

**Tests:**
1. Basic email (plain text)
2. Snapshot ready email (with LLM content)
3. Subscription welcome email (new template)

**Output:**
```
📧 Testing Brevo Email Integration
══════════════════════════════════════════════════════════

📧 Test 1: Basic Email
✅ Basic email sent successfully!
Message ID: <abc@smtp-relay.brevo.com>

📧 Test 2: Snapshot Ready Email
✅ Snapshot email sent successfully!

📧 Test 3: Subscription Welcome Email
✅ Welcome email sent successfully!

══════════════════════════════════════════════════════════
📊 Test Summary
✅ 3/3 tests passed
```

---

## Monitoring

### **Email Metrics** (Brevo Dashboard)

**Track:**
- Sent: Total emails sent
- Delivered: Successfully delivered
- Opens: Unique opens
- Clicks: Link clicks
- Bounces: Failed deliveries
- Spam: Spam complaints

**Target Rates:**
- Delivery: >98%
- Open: >40% (transactional)
- Bounce: <2%
- Spam: <0.1%

---

### **Error Handling**

**Code Pattern**:
```typescript
const result = await sendSubscriptionWelcomeEmail({ email, name });

if (result.success) {
  console.log(`[Email] Welcome sent to ${email}`);
} else {
  console.error(`[Email] Failed to send welcome: ${result.error}`);
  // Don't block user flow, just log
}
```

**Philosophy**: Email failures shouldn't block critical flows (subscription, snapshot generation)

---

## Future Enhancements

**Short Term:**
- [ ] Add company logo to email headers
- [ ] A/B test subject lines
- [ ] Add social links to footers

**Medium Term:**
- [ ] Email preferences page (frequency, types)
- [ ] Weekly digest (for active users)
- [ ] Re-engagement campaigns

**Long Term:**
- [ ] Dynamic content personalization
- [ ] Email template builder (UI)
- [ ] Multi-language support

---

## Migration Notes

### **Before (Brevo Templates)**
- Templates created in Brevo dashboard
- Referenced by template ID
- Hard to version control
- Required dashboard access
- Fragile ID management

### **After (HTML in Code)**
- Templates as TypeScript functions
- Version controlled in Git
- Local preview possible
- TypeScript type safety
- No dashboard dependency

**Migration Cost**: ~0 (templates never used in production)

---

**Status**: Production ready, 4 templates complete, sender verification required
