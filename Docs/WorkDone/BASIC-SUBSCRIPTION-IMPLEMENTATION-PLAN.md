# Basic Subscription - Complete Implementation Plan 🚀

**Date:** 2026-01-30  
**Status:** IN PROGRESS  
**Timeline:** 3-4 days  
**Goal:** Deliver all promised Basic subscription features

---

## Implementation Order (Critical Path)

### Phase 1: Database Setup ⚡ **30 minutes**
**Why first:** Everything depends on this schema.

- [ ] Apply Stripe schema to Supabase
- [ ] Verify columns exist
- [ ] Test webhook events table

**Files:**
- `SQLCode/ADD-STRIPE-COLUMNS.sql` (already exists)

---

### Phase 2: Webhook Infrastructure ⚡ **2-3 hours**
**Why second:** Users can't activate without this.

#### 2.1 Stripe Helper Utilities
- [ ] Create `lib/stripe/client.ts` - Stripe SDK initialization
- [ ] Create `lib/stripe/subscriptions.ts` - Subscription status helpers
- [ ] Create `lib/stripe/webhooks.ts` - Webhook signature verification

#### 2.2 Webhook Endpoint
- [ ] Create `app/api/stripe/webhook/route.ts`
- [ ] Handle `customer.subscription.created`
- [ ] Handle `customer.subscription.updated`
- [ ] Handle `customer.subscription.deleted`
- [ ] Handle `invoice.payment_succeeded`
- [ ] Handle `invoice.payment_failed`
- [ ] Implement idempotency (stripe_events table)
- [ ] Add error handling and logging

#### 2.3 Testing
- [ ] Install Stripe CLI
- [ ] Test webhook locally
- [ ] Verify database updates
- [ ] Deploy to Vercel
- [ ] Configure webhook in Stripe Dashboard

---

### Phase 3: Customer Portal ⚡ **1 hour**
**Why third:** Needed for "Cancel anytime" promise.

- [ ] Create `app/api/stripe/portal/route.ts`
- [ ] Add "Manage Subscription" button to dashboard
- [ ] Test cancellation flow
- [ ] Verify status updates via webhook

**Files to create:**
- `app/api/stripe/portal/route.ts`
- Update `components/dashboard/DashboardContent.tsx`

---

### Phase 4: Subscription Access Control ⚡ **2 hours**
**Why fourth:** Enforce business model before automation.

- [ ] Create `lib/subscriptions/access-control.ts`
- [ ] Add subscription status check utility
- [ ] Gate "Run Another Snapshot" for non-Basic users
- [ ] Add upgrade prompts
- [ ] Show subscription status on dashboard
- [ ] Handle grace periods (7 days after failed payment)

**Files to update:**
- `components/dashboard/DashboardContent.tsx`
- `app/api/snapshot/route.ts`

---

### Phase 5: Automatic Monthly Snapshots ⚡ **3-4 hours**
**Why fifth:** Core promise, but needs webhook/access control first.

#### 5.1 Cron Logic
- [ ] Create `app/api/cron/monthly-snapshots/route.ts`
- [ ] Query all active Basic subscribers
- [ ] Check last snapshot date per domain
- [ ] Trigger snapshot if ≥30 days
- [ ] Send email notification via Brevo
- [ ] Log results for monitoring
- [ ] Handle failures gracefully

#### 5.2 Cron Configuration
- [ ] Create/update `vercel.json`
- [ ] Configure daily cron schedule (1am UTC)
- [ ] Add CRON_SECRET env var for security

#### 5.3 Testing
- [ ] Test cron endpoint manually
- [ ] Verify snapshot creation
- [ ] Verify email sending
- [ ] Deploy to Vercel
- [ ] Monitor first automatic run

**Files to create:**
- `app/api/cron/monthly-snapshots/route.ts`
- `vercel.json` (cron config)
- `lib/cron/snapshot-automation.ts` (helpers)

---

### Phase 6: Email Notifications (Optional Enhancement) ⚡ **1-2 hours**
**Why last:** Nice-to-have, not blocking.

- [ ] Create Brevo templates for:
  - Subscription activated (welcome)
  - Monthly snapshot completed
  - Payment failed (retry instructions)
  - Subscription cancelled (confirmation)
- [ ] Integrate with webhook handler
- [ ] Integrate with cron job
- [ ] Test full lifecycle

---

## Technical Architecture

### Webhook Flow
```
Stripe Event → 
  Verify signature → 
    Check idempotency (stripe_events table) → 
      Process event → 
        Update users table → 
          Send notification email (optional) → 
            Log result → 
              Return 200
```

### Cron Flow
```
Daily Trigger (1am UTC) →
  Query active Basic subscribers →
    For each subscription:
      Get all user domains →
        For each domain:
          Check last snapshot date →
            If ≥30 days:
              Trigger snapshot →
                Send email notification →
                Log success
```

### Access Control Flow
```
User Action (e.g., "Run Snapshot") →
  Check user's subscription_status →
    If 'active': Allow →
    If 'past_due': Allow (grace period) →
    If 'canceled' or null: Block → Show upgrade prompt
```

---

## Environment Variables Needed

### Existing (Already Set):
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
- `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL`

### New (Need to Add):
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe Dashboard
- `CRON_SECRET` - Random string to secure cron endpoint (e.g., `openssl rand -base64 32`)

---

## Database Schema Changes

### Users Table (Add Columns):
```sql
ALTER TABLE users 
  ADD COLUMN stripe_customer_id TEXT UNIQUE,
  ADD COLUMN stripe_subscription_id TEXT UNIQUE,
  ADD COLUMN subscription_status TEXT,
  ADD COLUMN subscription_period_end TIMESTAMPTZ,
  ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT false;
```

### New Table (stripe_events):
```sql
CREATE TABLE stripe_events (
  id SERIAL PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status:** Schema already written, needs to be applied.

---

## Files to Create (12 new files)

### Core Infrastructure:
1. `lib/stripe/client.ts` - Stripe SDK init
2. `lib/stripe/subscriptions.ts` - Subscription helpers
3. `lib/stripe/webhooks.ts` - Webhook verification
4. `app/api/stripe/webhook/route.ts` - Webhook endpoint ⭐ CRITICAL
5. `app/api/stripe/portal/route.ts` - Customer portal ⭐ CRITICAL

### Cron System:
6. `app/api/cron/monthly-snapshots/route.ts` - Cron endpoint ⭐ CRITICAL
7. `lib/cron/snapshot-automation.ts` - Cron helpers
8. `vercel.json` - Cron configuration ⭐ CRITICAL

### Access Control:
9. `lib/subscriptions/access-control.ts` - Subscription checks
10. `lib/subscriptions/types.ts` - TypeScript types

### Testing:
11. `scripts/test-webhook.sh` - Local webhook testing script
12. `Docs/WorkDone/STRIPE-WEBHOOK-SETUP.md` - Setup guide

---

## Testing Strategy

### Phase 1: Local Development
- Use Stripe CLI to forward webhooks
- Test subscription creation
- Test cancellation
- Test failed payment
- Verify database updates

### Phase 2: Staging (Vercel Preview)
- Deploy to preview environment
- Create test subscription with Stripe test mode
- Wait for cron job to run
- Verify automatic snapshot creation

### Phase 3: Production Validation
- Start with 1-2 test customers
- Monitor webhook logs
- Monitor cron logs
- Monitor email delivery
- Verify billing cycle works

---

## Stripe Dashboard Configuration

### Webhooks (After Deployment):
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://explainmyit.com/api/stripe/webhook`
4. Events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy webhook signing secret → Add to Vercel env vars

---

## Risk Mitigation

### Webhook Failures:
- Stripe retries failed webhooks automatically (up to 3 days)
- We log all webhook attempts to `stripe_events` table
- We can manually replay missed events from Stripe Dashboard

### Cron Failures:
- Log all cron runs to database
- Send alert email if cron fails
- Can manually trigger snapshots via API

### Payment Failures:
- 7-day grace period (Stripe default)
- User keeps access during grace period
- Email notification sent immediately
- Subscription auto-cancels after 4 failed attempts

---

## Success Criteria

### Webhook Handler:
- ✅ User subscribes → subscription_status = 'active'
- ✅ User cancels → subscription_status = 'canceled'
- ✅ Payment fails → subscription_status = 'past_due'
- ✅ Payment succeeds → subscription_status = 'active'
- ✅ No duplicate processing (idempotency)

### Automatic Snapshots:
- ✅ Cron runs daily at 1am UTC
- ✅ Active Basic subscribers get monthly snapshots
- ✅ Snapshots only trigger if ≥30 days since last
- ✅ Email notification sent per snapshot
- ✅ Failures logged but don't crash cron

### Customer Portal:
- ✅ User can access Stripe Billing Portal
- ✅ User can cancel subscription
- ✅ User can update payment method
- ✅ User can view invoices
- ✅ Changes reflected in our database via webhook

### Access Control:
- ✅ Free users see upgrade prompt after 1 snapshot
- ✅ Basic users can run unlimited snapshots
- ✅ Canceled users lose access immediately
- ✅ Past-due users keep access (grace period)

---

## Timeline Breakdown

### Day 1 (Today):
- [x] Gap analysis complete
- [x] Implementation plan written
- [ ] Database schema applied
- [ ] Webhook infrastructure built
- [ ] Customer portal built

### Day 2:
- [ ] Access control implemented
- [ ] Cron job built
- [ ] Local testing complete
- [ ] Deploy to staging

### Day 3:
- [ ] Staging testing
- [ ] Bug fixes
- [ ] Documentation
- [ ] Production deployment

### Day 4:
- [ ] Monitor first cron run
- [ ] Monitor first real subscription
- [ ] Fine-tuning
- [ ] Launch announcement

---

## Communication Plan

### To User (During Build):
- Update after each major milestone
- Report any blockers immediately
- Request Stripe Dashboard access if needed

### To First Customers:
- Email: "Basic is now live"
- Set expectations about monthly snapshots
- Link to Customer Portal
- Support contact info

---

## Rollback Plan

If something breaks in production:

1. **Emergency Off-Switch:**
   - Change pricing page back to "Coming Soon"
   - Disable cron job (remove from vercel.json)
   - Refund any affected customers

2. **Partial Rollback:**
   - Disable cron, keep manual snapshots
   - Fix issue
   - Re-enable cron

3. **Full Rollback:**
   - Revert to previous deployment
   - Fix in staging
   - Re-deploy when ready

---

## Next Actions (Starting Now)

1. ✅ Plan complete
2. ⏳ Apply database schema
3. ⏳ Build webhook handler
4. ⏳ Build customer portal
5. ⏳ Build access control
6. ⏳ Build cron system
7. ⏳ Test everything
8. ⏳ Deploy
9. ⏳ Monitor
10. ⏳ Launch

**Let's build! 🚀**
