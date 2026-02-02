# Free vs Paid Controls Audit - CORRECTED 🔍

**Date**: February 2, 2026  
**Status**: Analysis Complete Based on Actual Pricing

## Actual Pricing Tiers

Based on https://www.explainmyit.com/pricing:

### Free Snapshot - $0 (one-time)
- **Limits**: "One snapshot per domain"
- **Limits**: "No re-runs unless you upgrade"
- **Limits**: "No history or timeline"
- No account required

### Basic - $19.99/month or $199/year
- **Automatic monthly snapshots** with full history
- Access to all past reports
- Cancel anytime
- Owner-readable summaries

### Pro - Contact Us (COMING SOON)
- On-premise deployment
- Internal network scanning
- Asset discovery & inventory
- Configuration change detection

---

## Critical Disconnect: Pricing Page vs Code Implementation

### ❌ MAJOR ISSUE: Code Does NOT Match Pricing Page

**Pricing Page Says**: "One snapshot per domain" + "No re-runs unless you upgrade"

**Code Actually Does** (`lib/subscriptions/free-tier-limits.ts`):
```typescript
export const FREE_TIER_LIMITS = {
  MAX_SNAPSHOTS_PER_DOMAIN: 1,
  MAX_DOMAINS: 3,              // ⚠️ Not mentioned on pricing page!
  COOLDOWN_DAYS: 30,            // ⚠️ Allows re-runs after 30 days!
};
```

**What This Means**:
1. Free account users CAN run snapshots for **up to 3 domains** (not mentioned on pricing page)
2. Free account users CAN **re-run after 30 days** (pricing says "no re-runs unless you upgrade")
3. Anonymous users have NO enforcement at all (can get unlimited by changing email)

---

## Current Implementation Analysis

### 1. Anonymous Users (No Account) - 🚨 CRITICAL GAP

**Advertised**: "One snapshot per domain"

**Reality**: **NO ENFORCEMENT**

**Current Behavior**:
```
User enters: test1@example.com + mysite.com → ✅ Free snapshot
User enters: test2@example.com + mysite.com → ✅ Another free snapshot
User enters: test3@example.com + mysite.com → ✅ Another free snapshot
... repeat infinitely
```

**Why**: Rate limiting is based on `domain_hash + email_hash` combo. Different email = new free report.

**Code**: `lib/db/rate-limits.ts` lines 34-61
```typescript
// Only blocks if SAME email + SAME domain within 30 days
const domainHash = hashIdentifier(domain);
const emailHash = email ? hashIdentifier(email) : null;
```

**Impact**:
- ❌ Anonymous users can abuse system with unlimited reports
- ❌ Zero incentive to create account
- ❌ Direct revenue loss

---

### 2. Authenticated Free Users - 🟡 DIFFERENT THAN ADVERTISED

**Advertised**: "One snapshot per domain" + "No re-runs unless you upgrade"

**Reality**: "One snapshot per domain **every 30 days**" + "Max 3 domains"

**Current Limits**:
- ✅ 1 snapshot per domain per 30 days (NOT permanent block)
- ✅ Maximum 3 unique domains (NOT mentioned on pricing page)
- ✅ Enforced via `checkFreeTierLimits()`

**Pricing Page Discrepancy**:
- Says: "No re-runs" (absolute)
- Code: Allows re-runs every 30 days
- Says: Nothing about multiple domains
- Code: Allows up to 3 domains

**Error Message** (when hitting 30-day limit):
```
"Free tier allows 1 snapshot per domain every 30 days. 
Next snapshot available in X days."
upgradeRequired: true
```

**Question for You**: Is this intentional?
- Option A: Keep 30-day cooldown (more generous than advertised)
- Option B: Match pricing page exactly (no re-runs ever for free)

---

### 3. Basic Subscribers ($19.99/month) - ✅ CORRECT

**Advertised**: "Automatic monthly snapshots with full history"

**Reality**: **Unlimited manual snapshots** + future automated monthly snapshots

**Current Implementation**:
```typescript
if (subscriptionAccess.isBasicTier) {
  console.log(`✅ Basic subscriber - unlimited snapshots`);
  canRunSnapshot = true;
}
```

**What Works**:
- ✅ Can run snapshots anytime (unlimited)
- ✅ Unlimited domains
- ✅ All reports saved
- ✅ Dashboard access

**What's Missing**:
- ❌ **No automatic monthly snapshot generation** (not implemented yet)
- ❌ Users must manually trigger snapshots
- ❌ "Automatic monthly" is advertised but doesn't exist

**This is CRITICAL**: Pricing says "Automatic monthly snapshots" but you don't have a cron job or automation to generate them!

---

### 4. Pro Tier - ✅ CORRECTLY MARKED "COMING SOON"

**Status**: Not implemented, correctly labeled as "COMING SOON"

**Good**: You're transparent about it being future

---

## Problems Summary

### 🔴 CRITICAL #1: Anonymous Users Get Unlimited Free Reports

**Problem**: Can change email infinitely to get more reports

**Fix Required**:
```typescript
// Change to domain-only limit for anonymous users
// One free report PER DOMAIN, period
if (!userId) {
  // Check if THIS DOMAIN has ever been scanned anonymously
  const domainLimit = await checkAnonymousDomainLimit(domain);
  if (domainLimit.used) {
    return {
      allowed: false,
      error: 'You\'ve already received a free snapshot for this domain. Create a free account to track changes over time.',
      accountRequired: true
    };
  }
}
```

---

### 🔴 CRITICAL #2: "Automatic Monthly Snapshots" Don't Exist

**Advertised**: "Automatic monthly snapshots with full history"

**Reality**: Users must manually run snapshots

**Missing**:
- Cron job to auto-generate monthly snapshots for Basic subscribers
- Scheduling system
- Email notifications when monthly snapshot completes

**Impact**:
- False advertising
- User confusion ("Where's my automatic snapshot?")
- Value proposition not delivered

**Fix Required**:
1. Build Vercel cron job (runs 1st of each month)
2. Query all Basic subscribers
3. Auto-generate snapshot for each domain in their history
4. Send email notification

**Estimated Work**: 4-6 hours

---

### 🟡 MEDIUM #3: Free Account Limits Don't Match Pricing Page

**Pricing Says**:
- "One snapshot per domain"
- "No re-runs unless you upgrade"

**Code Does**:
- One snapshot per domain **every 30 days** (allows re-runs)
- Up to **3 domains** (not mentioned)

**Questions**:
1. Is 30-day cooldown intentional? Or should free users NEVER re-run?
2. Are 3 domains intentional? Or should it be unlimited domains (but 1 snapshot each)?

**Options**:

**Option A**: Update pricing page to match code
```
Free Snapshot: $0
- 1 snapshot per domain every 30 days
- Up to 3 domains
- Create account required
```

**Option B**: Update code to match pricing page
```typescript
// Permanent block after first snapshot
if (snapshotsForThisDomain >= 1) {
  return {
    allowed: false,
    reason: "Free accounts get one snapshot per domain. Upgrade to Basic for monthly tracking.",
    upgradeRequired: true
  };
}
```

---

### 🟢 LOW #4: Weak Upsell When Limits Hit

**Current**: Just shows error text

**Missing**:
- Modal with upgrade CTA
- Pricing comparison
- "Upgrade to Basic" button
- Benefits callout

**Frontend** (`components/SnapshotRequestForm.tsx`):
```typescript
// Currently just shows error in text
if (data.upgradeRequired) {
  setError(data.error); // ❌ No upgrade button or modal
}
```

**Should Show**:
- Modal popup
- "Upgrade to Basic - $19.99/mo"
- "Get automatic monthly snapshots"
- Link to /pricing

---

## Recommended Strategy (YOUR INPUT NEEDED)

### Decision #1: Anonymous Users

**Option A - Strict** (Recommended):
- 1 free snapshot per domain EVER (no email switching)
- Force account creation for anything more
- Matches pricing page promise

**Option B - Lenient**:
- Allow email switching (current behavior)
- Hope users create accounts voluntarily
- Lower conversion but less restrictive

**Which do you prefer?**

---

### Decision #2: Free Account Re-runs

**Option A - Match Pricing Page** (Recommended):
- No re-runs ever for free accounts
- "One snapshot per domain" (permanent)
- Forces upgrade to Basic for ongoing tracking

**Option B - Keep 30-Day Cooldown**:
- Allow re-runs every 30 days
- Update pricing page to reflect this
- More generous, but lower urgency to upgrade

**Which do you prefer?**

---

### Decision #3: Multiple Domains for Free

**Option A - Keep 3 Domain Limit**:
- Update pricing page to mention it
- Add upsell when hitting domain 3

**Option B - Unlimited Domains, 1 Snapshot Each**:
- Remove domain limit
- Focus upsell on "re-runs" and "automatic monthly"
- Simpler to explain

**Which do you prefer?**

---

### Decision #4: Automatic Monthly Snapshots

**Option A - Build It Now** (Recommended):
- 4-6 hours work
- Vercel cron job
- Deliver on promise
- Key value prop

**Option B - Remove from Pricing**:
- Update pricing: "Unlimited manual snapshots"
- Remove "automatic monthly" claim
- Build automation later

**Which do you prefer?**

---

## Recommended Fixes (My Proposal)

### Phase 1: Critical Fixes (Today)

1. **Fix Anonymous Exploit** (30 min)
   - Domain-only rate limiting
   - One free snapshot per domain EVER
   - Match pricing page promise

2. **Update Pricing Page or Code** (15 min)
   - Decide on 30-day cooldown (keep or remove)
   - Decide on 3 domain limit (keep or remove)
   - Make them match

3. **Add Upgrade Modal** (1 hour)
   - Show when limits hit
   - "Upgrade to Basic" CTA
   - Pricing comparison

### Phase 2: Feature Completion (This Week)

4. **Build Automatic Monthly Snapshots** (4-6 hours)
   - Vercel cron job
   - Auto-generate for Basic subscribers
   - Email notifications
   - Deliver on key promise

### Phase 3: Optimization (Next Week)

5. **Dashboard Upsell Banners** (30 min)
   - "2 of 3 domains used" warning
   - "X days until next snapshot" countdown
   - Upgrade prompts

6. **Better Post-Report CTAs** (1 hour)
   - Modal after viewing report
   - "Track changes over time" messaging
   - Clear upgrade path

---

## Questions for You

Before I implement anything:

### 1. Anonymous Users Strategy
What should happen when an anonymous user tries to run a 2nd snapshot for the same domain?
- **A**: Block completely, show "Create account" prompt ✅ (My rec)
- **B**: Allow if they use different email (current)
- **C**: Something else?

### 2. Free Account Re-runs
Should free accounts be able to re-run snapshots after 30 days?
- **A**: No, one snapshot per domain FOREVER (matches pricing) ✅ (My rec)
- **B**: Yes, allow re-runs every 30 days (current code)
- **C**: Something else?

### 3. Free Account Domain Limit
How many domains should free accounts get?
- **A**: Unlimited domains, 1 snapshot each ✅ (My rec - simpler)
- **B**: 3 domains max (current code)
- **C**: Something else?

### 4. Automatic Monthly Snapshots
This is advertised but doesn't exist. What should we do?
- **A**: Build it NOW (4-6 hours) ✅ (My rec - it's promised!)
- **B**: Remove from pricing, build later
- **C**: Something else?

### 5. Basic Tier Positioning
What's the main value prop for Basic?
- **A**: Automatic monthly snapshots (requires building automation)
- **B**: Unlimited manual snapshots anytime
- **C**: Both (one is manual, one is automated background)

---

## Current State Summary

**What Works** ✅:
- Basic subscriptions grant unlimited access
- Free account users have some limits
- Stripe billing integration works

**What's Broken** ❌:
- Anonymous users can get unlimited free reports by changing email
- "Automatic monthly snapshots" don't exist (false advertising)
- Pricing page doesn't match code implementation
- Weak upsell messaging when limits hit

**Urgency**:
- 🔴 Anonymous exploit: HIGH (revenue leak)
- 🔴 Automatic monthly: HIGH (false advertising)
- 🟡 Pricing/code mismatch: MEDIUM (confusion)
- 🟢 Upsell improvements: LOW (optimization)

---

## Let's Discuss!

Tell me your preferences for the 5 questions above, and I'll implement the fixes to match your vision. The most important decisions are:

1. Should anonymous users be able to switch emails for unlimited reports?
2. Should we build automatic monthly snapshots now (it's advertised)?
3. Should free accounts get re-runs after 30 days, or never?

**Once you decide, I can implement in ~6-8 hours total.**
