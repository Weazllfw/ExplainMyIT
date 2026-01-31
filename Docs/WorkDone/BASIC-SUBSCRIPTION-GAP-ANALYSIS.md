# Basic Subscription - Gap Analysis ⚠️

**Date:** 2026-01-30  
**Status:** CRITICAL GAPS IDENTIFIED  
**Issue:** We can sell Basic subscriptions but cannot deliver on the core promise yet

---

## What Basic Promises (From Pricing Page)

### Core Value Proposition:
> "Ongoing visibility into how your IT setup appears over time."

### Explicit Features:
1. ✅ **Automatic monthly snapshots with full history**
2. ✅ **Owner-readable summaries, assumptions, and blind spots**
3. ✅ **Process-focused questions to ask your IT/MSP**
4. ✅ **Access to all past reports**
5. ⚠️ **Cancel anytime**

---

## What We Currently Have ✅

### 1. ✅ Database Schema (Ready)
**File:** `SQLCode/ADD-STRIPE-COLUMNS.sql`

```sql
ALTER TABLE users 
  ADD COLUMN stripe_customer_id TEXT UNIQUE,
  ADD COLUMN stripe_subscription_id TEXT UNIQUE,
  ADD COLUMN subscription_status TEXT,
  ADD COLUMN subscription_period_end TIMESTAMPTZ,
  ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT false;

CREATE TABLE stripe_events (
  stripe_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status:** Schema ready, needs to be applied to database

---

### 2. ✅ Stripe Checkout (Working)
**File:** `app/api/stripe/create-checkout/route.ts`

**What it does:**
- Creates Stripe checkout sessions for monthly/annual subscriptions
- Creates/retrieves Stripe customer
- Redirects to Stripe hosted checkout

**Status:** IMPLEMENTED ✅

---

### 3. ✅ Dashboard Shows Past Snapshots (Working)
**File:** `app/dashboard/page.tsx`, `components/dashboard/DashboardContent.tsx`

**What it does:**
- Shows all snapshots for logged-in user
- Displays snapshot history
- Allows viewing past reports

**Status:** IMPLEMENTED ✅

---

### 4. ✅ Report Generation (Working)
**Files:** 
- `app/report/[id]/page.tsx`
- `lib/signals/*`
- `lib/llm/*`

**What it does:**
- Generates owner-readable summaries
- Shows assumptions and blind spots
- Provides process-focused questions
- Full LLM-powered analysis

**Status:** IMPLEMENTED ✅

---

## What We're MISSING ❌

### 1. ❌ CRITICAL: Stripe Webhook Handler
**Missing File:** `app/api/stripe/webhook/route.ts`

**What it needs to do:**
- Listen for Stripe webhook events
- Handle `customer.subscription.created`
- Handle `customer.subscription.updated`
- Handle `customer.subscription.deleted`
- Handle `invoice.payment_succeeded`
- Handle `invoice.payment_failed`
- Update user's subscription status in database
- Prevent duplicate processing (use `stripe_events` table)

**Why critical:**
- Without this, user pays but their account doesn't activate
- Without this, cancellations don't update database
- Without this, failed payments don't suspend access

**Impact:** 🔴 **BLOCKER - Cannot go live without this**

---

### 2. ❌ CRITICAL: Automatic Monthly Snapshot Scheduling
**Missing Files:**
- Cron job or scheduled function
- Snapshot automation logic

**What it needs to do:**
- Run daily (check which subscriptions need snapshots)
- For each active Basic subscriber:
  - Check last snapshot date
  - If ≥30 days, trigger new snapshot
  - Associate snapshot with user
  - Send email notification
- Handle failures gracefully
- Log results for monitoring

**Current problem:**
- Users can manually run snapshots from dashboard
- But "automatic monthly snapshots" requires background automation
- No scheduled task exists yet

**Options for implementation:**
1. **Vercel Cron Jobs** (simplest, built-in)
2. **GitHub Actions** (free, reliable)
3. **Supabase Edge Functions with pg_cron** (database-native)
4. **External cron service** (e.g., cron-job.org, EasyCron)

**Impact:** 🔴 **BLOCKER - This is the core promise of Basic**

---

### 3. ⚠️ IMPORTANT: Subscription Status Checks
**Missing:** Access control based on subscription status

**What needs to happen:**
- Check if user has active subscription before allowing:
  - Re-running snapshots (beyond free tier)
  - Viewing recurring features
  - Accessing automatic snapshot features
- Show upgrade prompts for non-subscribers
- Handle grace periods for failed payments

**Current state:**
- Anyone can run snapshots (rate-limited)
- No subscription-based gating

**Impact:** 🟡 **HIGH PRIORITY - Needed before launch, not blocking MVP test**

---

### 4. ⚠️ IMPORTANT: Stripe Customer Portal Integration
**Missing:** Link to Stripe's hosted customer portal

**What it needs:**
- Generate Stripe Billing Portal session
- Allow users to:
  - Cancel subscription
  - Update payment method
  - View invoices
  - Download receipts

**Why needed:**
- Promised "Cancel anytime"
- Users need self-service billing
- Reduces support load

**Impact:** 🟡 **HIGH PRIORITY - Needed for "Cancel anytime" promise**

---

### 5. ⚠️ NICE-TO-HAVE: Email Notifications for Subscriptions
**Missing:** Transactional emails for subscription events

**What needs to happen:**
- Send email when:
  - Subscription activated (welcome + first snapshot)
  - Monthly snapshot completed (with link to report)
  - Payment failed (with retry instructions)
  - Subscription cancelled (confirmation + data retention info)

**Current state:**
- Only snapshot request confirmation emails exist
- No subscription lifecycle emails

**Impact:** 🟢 **MEDIUM PRIORITY - UX improvement, not blocker**

---

## Immediate Priorities (Before Launch)

### Phase 1: Critical Infrastructure (MUST HAVE)
**Timeline:** 1-2 days
1. ✅ Apply database schema (Stripe columns + `stripe_events` table)
2. ❌ Implement Stripe webhook handler (`/api/stripe/webhook`)
3. ❌ Test webhook with Stripe CLI
4. ❌ Deploy webhook to Vercel
5. ❌ Configure webhook endpoint in Stripe Dashboard

**Why first:** Users can't actually subscribe without this working.

---

### Phase 2: Automatic Snapshots (MUST HAVE)
**Timeline:** 1-2 days
1. ❌ Choose scheduling solution (recommend: Vercel Cron)
2. ❌ Implement cron endpoint (`/api/cron/monthly-snapshots`)
3. ❌ Implement snapshot automation logic
4. ❌ Test with test subscription
5. ❌ Configure vercel.json for cron schedule
6. ❌ Monitor first automatic run

**Why second:** This is the core promise of Basic.

---

### Phase 3: Access Control (HIGH PRIORITY)
**Timeline:** 1 day
1. ❌ Create subscription check utility
2. ❌ Gate dashboard "Run Another Snapshot" for non-subscribers
3. ❌ Add upgrade prompts
4. ❌ Handle grace periods

**Why third:** Prevents abuse, enforces business model.

---

### Phase 4: Customer Portal (HIGH PRIORITY)
**Timeline:** 0.5 days
1. ❌ Implement Stripe Billing Portal session creation
2. ❌ Add "Manage Subscription" link to dashboard
3. ❌ Test cancellation flow
4. ❌ Verify subscription updates in database

**Why fourth:** Needed for "Cancel anytime" promise.

---

### Phase 5: Email Notifications (NICE-TO-HAVE)
**Timeline:** 1 day
1. ❌ Create Brevo templates for subscription emails
2. ❌ Integrate with webhook handler
3. ❌ Integrate with cron job
4. ❌ Test full lifecycle

**Why last:** Improves UX but not blocking.

---

## Risk Assessment

### If We Launch NOW (Without Fixes):

**What works:**
- Users can click "Subscribe"
- Stripe checkout works
- Payment succeeds

**What breaks:**
- ❌ User's account doesn't activate (no webhook)
- ❌ User can't access subscription features
- ❌ No automatic monthly snapshots (broken promise)
- ❌ User can't cancel (no portal)
- ❌ Failed payments don't suspend access
- ❌ Massive support burden

**Outcome:** 🔴 **CATASTROPHIC - Do not launch**

---

## Recommendation

**DO NOT ACTIVATE BASIC SUBSCRIPTIONS UNTIL:**
1. ✅ Stripe webhook handler is live and tested
2. ✅ Automatic monthly snapshots are working
3. ✅ Customer portal is accessible

**SAFE TO LAUNCH WITH:**
- Free snapshots (already working)
- Basic as "Coming Soon" (PRO stays coming soon)
- Collect emails for Basic waitlist

**ALTERNATIVE SOFT LAUNCH:**
- Keep Basic visible with active buttons
- Manually activate 5-10 test customers
- Manually run their monthly snapshots (temporary)
- Use this to validate demand
- Then build automation before scaling

---

## Next Steps

**User decision required:**
1. **Option A: Build Critical Infrastructure First (Recommended)**
   - Timeline: 3-4 days
   - Then launch Basic properly
   - No manual intervention needed

2. **Option B: Soft Launch with Manual Processing**
   - Launch Basic now
   - Manually process first 10 customers
   - Build automation in parallel
   - Scale when automation ready

3. **Option C: Keep Basic as "Coming Soon"**
   - Launch Free tier only
   - Build Basic infrastructure
   - Announce when ready

**What do you want to do?**

---

## File Structure Needed

### New Files to Create:
```
app/
  api/
    stripe/
      webhook/
        route.ts          ❌ CRITICAL
      portal/
        route.ts          ⚠️ HIGH PRIORITY
    cron/
      monthly-snapshots/
        route.ts          ❌ CRITICAL

lib/
  stripe/
    webhooks.ts           ❌ Helper functions
    subscriptions.ts      ⚠️ Subscription utils

vercel.json               ⚠️ Cron configuration
```

---

**Status:** Awaiting user decision on launch strategy.
