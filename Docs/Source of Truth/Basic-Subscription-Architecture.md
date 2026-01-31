# Basic Subscription Architecture

**Last Updated**: 2026-01-31  
**Status**: Production Ready

---

## Overview

Basic subscription ($20/month or $199/year) gives users unlimited IT snapshots with automatic monthly generation.

**Tech Stack**: Stripe (payments) + Supabase (database) + Vercel Cron (automation)

---

## Subscription Flow

### **1. Pricing Page → Checkout**

**Flow:**
```
User on /pricing
  ↓
Clicks "Subscribe" button
  ↓
POST /api/stripe/create-checkout
  - Creates/retrieves Stripe customer
  - Creates checkout session
  - Returns session URL
  ↓
Redirects to Stripe Checkout
  - User enters payment details
  - Stripe processes payment
  ↓
Redirects back to /dashboard
```

**Code:**
- `components/pricing/SubscribeButton.tsx` - Subscribe button with loading states
- `app/api/stripe/create-checkout/route.ts` - Creates Stripe checkout session
- `app/pricing/page.tsx` - Pricing page with tier comparison

**Stripe Configuration:**
- **Products**: "Explain My IT - Basic"
- **Prices**: 
  - Monthly: `price_xxx` ($20/month)
  - Annual: `price_yyy` ($199/year, 17% savings)
- **Mode**: subscription (recurring)

---

### **2. Webhook Processing**

**Events Handled:**
1. `customer.subscription.created` - New subscription
2. `customer.subscription.updated` - Plan change, payment method update
3. `customer.subscription.deleted` - Cancellation
4. `invoice.payment_succeeded` - Successful payment
5. `invoice.payment_failed` - Failed payment

**Flow:**
```
Stripe webhook fires
  ↓
POST /api/stripe/webhook
  - Verify signature (STRIPE_WEBHOOK_SECRET)
  - Parse event type
  ↓
Update database (admin client, bypasses RLS)
  - subscription_status
  - subscription_tier
  - subscription_period_end
  - stripe_customer_id
  - stripe_subscription_id
  ↓
Send email notification (if applicable)
  - Welcome (subscription.created)
  - Payment failed (invoice.payment_failed)
  - Canceled (subscription.deleted)
```

**Code:**
- `app/api/stripe/webhook/route.ts` - Webhook handler
- `lib/subscriptions/subscription-access.ts` - Subscription validation logic

**Security:**
- Webhook signature verification (prevents spoofing)
- Admin client for database writes (bypasses RLS)
- Idempotent processing (deduplication via event ID)

---

### **3. Database Schema**

**Users Table - Subscription Columns:**
```sql
-- Stripe Integration
stripe_customer_id         VARCHAR(255)  -- cus_xxx
stripe_subscription_id     VARCHAR(255)  -- sub_xxx

-- Subscription Status
subscription_status        VARCHAR(50)   -- active|past_due|canceled|null
subscription_tier          VARCHAR(50)   -- free|basic (default: free)

-- Billing Period
subscription_period_end    TIMESTAMPTZ   -- When current period ends
subscription_cancel_at_period_end  BOOLEAN  -- Scheduled cancellation
```

**Status Values:**
- `null` - No subscription (free tier)
- `active` - Subscription active, payment current
- `past_due` - Payment failed, retrying
- `canceled` - Subscription ended

**Migration:**
```sql
-- See: SQLCode/ADD-STRIPE-COLUMNS.sql
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
-- ... (5 more columns)
```

---

### **4. Subscription Access Control**

**Logic** (`lib/subscriptions/subscription-access.ts`):

```typescript
// Check if user can run snapshot
async function checkSubscriptionAccess(userId: string) {
  const user = await getUser(userId);
  
  if (!user) return { canRun: false, reason: 'User not found' };
  
  // Basic subscribers: unlimited
  if (user.subscription_status === 'active' && 
      user.subscription_tier === 'basic') {
    return { canRun: true, tier: 'basic' };
  }
  
  // Free tier: check limits
  return checkFreeTierLimits(userId);
}
```

**Free Tier Limits** (`lib/subscriptions/free-tier-limits.ts`):
- 1 snapshot per domain per 30 days
- Maximum 3 domains
- 30-day cooldown period

**Bypass:**
- Basic subscribers skip free tier checks
- Unlimited snapshots, unlimited domains

---

### **5. Customer Portal**

**Purpose**: Let users manage their subscription (update payment, cancel, view invoices)

**Flow:**
```
User clicks "Manage Subscription" in dashboard
  ↓
POST /api/stripe/portal
  - Creates portal session
  - Returns portal URL
  ↓
Redirects to Stripe Customer Portal
  - User updates billing info
  - User cancels subscription
  ↓
Webhook fires → Database updates
  ↓
User returns to /dashboard
```

**Code:**
- `app/api/stripe/portal/route.ts` - Creates portal session
- `components/dashboard/DashboardContent.tsx` - Portal button

**Portal Configuration** (Stripe Dashboard):
- Allow cancellation: ✅ Yes
- Allow plan changes: ❌ No (only Basic tier)
- Invoice history: ✅ Yes
- Payment method update: ✅ Yes

---

### **6. Automatic Monthly Snapshots**

**Purpose**: Generate snapshots automatically for Basic subscribers every 30 days

**Flow:**
```
Vercel Cron (daily 1 AM UTC)
  ↓
POST /api/cron/monthly-snapshots
  - Fetch active Basic subscribers
  - For each user's domain:
    - Check last snapshot date
    - If ≥30 days: generate new snapshot
  ↓
Generate snapshot (same as manual)
  ↓
Save to database
  ↓
Send email: "Your monthly snapshot is ready"
```

**Code:**
- `app/api/cron/monthly-snapshots/route.ts` - Cron job handler
- `vercel.json` - Cron schedule configuration

**Cron Schedule:**
```json
{
  "crons": [{
    "path": "/api/cron/monthly-snapshots",
    "schedule": "0 1 * * *"  // Daily at 1 AM UTC
  }]
}
```

**Optimization:**
- Runs daily (not hourly) to minimize execution time
- Checks 30-day intervals per domain
- Batches processing to avoid timeouts

---

### **7. Email Notifications**

**Emails Sent:**

1. **Subscription Welcome** (`lib/email/templates/subscription-welcome.ts`)
   - Trigger: `customer.subscription.created`
   - Content: Welcome, what happens next, dashboard CTA

2. **Monthly Snapshot Ready** (`lib/email/templates/monthly-snapshot.ts`)
   - Trigger: Cron job generates snapshot
   - Content: Domain, report link, dashboard link

3. **Payment Failed** (`lib/email/templates/payment-failed.ts`)
   - Trigger: `invoice.payment_failed`
   - Content: Update payment method, customer portal link

4. **Subscription Canceled** (`lib/email/templates/subscription-canceled.ts`)
   - Trigger: `customer.subscription.deleted`
   - Content: Access end date, resubscribe CTA

**Architecture:**
- HTML templates in code (NOT Brevo dashboard)
- Sent via Brevo API (`sendEmail`)
- Sender: `noreply@explainmyit.com`

---

## Dashboard Display

### **Subscription Status Badge**

**States:**
```typescript
// Active
<Badge className="bg-emerald-100 text-emerald-700">
  Basic (Active)
</Badge>

// Past Due
<Badge className="bg-amber-100 text-amber-700">
  Payment Issue
</Badge>

// Canceled
<Badge className="bg-slate-100 text-slate-700">
  Canceled
</Badge>

// Free
<Badge className="bg-slate-100 text-slate-600">
  Free Tier
</Badge>
```

**Code:** `components/dashboard/DashboardContent.tsx`

---

### **Next Snapshot Date**

**Logic:**
- If Basic: Show "Next auto-snapshot: [date]" (30 days from last)
- If Free: Show "Next snapshot available: [date]" (based on cooldown)

**Code:**
```typescript
const nextSnapshotDate = addDays(lastSnapshot.created_at, 30);
```

---

### **Manage Subscription Button**

**Visibility:**
- Show if: `subscription_status === 'active'`
- Hide if: Free tier or canceled

**Action:**
- Opens Stripe Customer Portal
- User can update billing, cancel, view invoices

---

## Error Handling

### **Webhook Failures**

**Retry Logic:**
- Stripe retries failed webhooks automatically (72 hours)
- Each retry includes exponential backoff
- After 72 hours: Manual investigation required

**Monitoring:**
```typescript
console.log('[Webhook] Received Stripe webhook');
console.log('[Webhook] Event type:', event.type);
console.error('[Webhook] Error processing webhook:', error);
```

**Idempotency:**
- Store processed event IDs (in-memory or database)
- Skip duplicate events
- Prevent double-processing

---

### **Payment Failures**

**Flow:**
1. Payment fails → `invoice.payment_failed` webhook
2. Update `subscription_status` to `past_due`
3. Send "Payment Failed" email
4. Stripe retries automatically (3-4 times over 2 weeks)
5. If all retries fail → `subscription.deleted` webhook

**User Experience:**
- Dashboard shows "Payment Issue" badge
- Alert: "Update your payment method"
- CTA: "Manage Subscription" (opens portal)

---

### **Cancellation Flow**

**Immediate:**
```typescript
// User cancels via portal
subscription_status = 'canceled'
subscription_cancel_at_period_end = false
```

**End of Period:**
```typescript
// User schedules cancellation
subscription_cancel_at_period_end = true
// Access continues until period_end
```

**Post-Cancellation:**
- User reverts to free tier
- Past snapshots remain accessible
- No more automatic snapshots
- Can resubscribe anytime

---

## Testing

### **Test Mode (Current)**

**Stripe Dashboard:**
- Toggle: "Test mode" ON
- Use test cards: `4242 4242 4242 4242`
- Webhook: Points to preview deployment

**Limitations:**
- Webhooks may fail on preview (Vercel auth)
- Use deployment protection bypass
- Test locally with Stripe CLI

---

### **Production Mode (Launch)**

**Checklist:**
1. Switch Stripe to "Live mode"
2. Update webhook URL to production domain
3. Set production API keys in Vercel env vars
4. Verify sender domain in Brevo
5. Test with real payment (then refund)

---

## Monitoring

### **Key Metrics:**

1. **Subscription Events:**
   - New subscriptions (daily)
   - Cancellations (weekly)
   - Payment failures (immediate alert)

2. **Webhook Health:**
   - Success rate: >99%
   - Processing time: <2 seconds
   - Failed webhooks: 0

3. **Cron Job:**
   - Execution time: <30 seconds
   - Snapshots generated: Track count
   - Errors: 0

**Tools:**
- Stripe Dashboard (subscription metrics)
- Vercel Logs (webhook/cron errors)
- Supabase (database queries)
- Umami (conversion tracking)

---

## Cost Structure

**Per Subscriber (Monthly):**
- Stripe fees: $0.59 + 2.9% = ~$1.17
- Monthly snapshot: $0.03 (LLM)
- **Total cost**: ~$1.20/month
- **Net profit**: ~$18.80/month

**At Scale (100 subscribers):**
- Revenue: $2,000/month
- Costs: $120/month
- **Profit margin**: 94%

---

## Future Enhancements

**Short Term:**
- [ ] Success page (`/subscription/success`)
- [ ] Annual plan promotion (17% savings)
- [ ] Subscription analytics dashboard

**Medium Term:**
- [ ] Pro tier (unlimited domains, weekly snapshots)
- [ ] Team accounts (organization support)
- [ ] Custom snapshot schedules

**Long Term:**
- [ ] Usage-based pricing
- [ ] Enterprise plans
- [ ] White-label offering

---

**Status**: Production ready, tested in Stripe test mode, ready for launch
