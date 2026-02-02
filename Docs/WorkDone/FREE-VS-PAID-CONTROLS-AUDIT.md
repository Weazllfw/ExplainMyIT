# Free vs Paid Controls Audit 🔍

**Date**: February 2, 2026  
**Status**: Analysis Complete - Issues Found ⚠️

## Executive Summary

After auditing the codebase, I found **critical gaps** in free tier controls and upsells. Here's the current state:

### ✅ What's Working

1. **Authenticated Free Users** - Well controlled (1 snapshot per domain every 30 days, max 3 domains)
2. **Basic Subscribers** - Unlimited snapshots
3. **Rate limiting** - Anonymous users blocked from spamming same domain

### ❌ Critical Issues Found

1. **Anonymous users can get UNLIMITED free reports** by changing their email address
2. **No prominent upsells** for multiple domains
3. **No automated monthly reports implemented** (Pro tier feature not built)
4. **Weak upsell messaging** on report pages

---

## Current Implementation Breakdown

### 1. Anonymous Users (No Account) 🚨 MAJOR GAP

**Current Behavior**:
- User visits homepage
- Enters email + domain
- Gets free snapshot
- **CAN REQUEST ANOTHER IMMEDIATELY** by using different email
- Only blocked by: domain hash + email hash combination

**Code Location**: `lib/db/rate-limits.ts` lines 36-61

```typescript
// Rate limit is based on domain_hash + email_hash
// Problem: User can simply change email and get unlimited reports!
const domainHash = hashIdentifier(domain);
const emailHash = email ? hashIdentifier(email) : null;
```

**Real-World Exploit**:
```
test@example.com + mysite.com → ✅ Free snapshot
test2@example.com + mysite.com → ✅ Free snapshot (different email!)
test3@example.com + mysite.com → ✅ Free snapshot (different email!)
```

**Impact**: 
- ❌ No real incentive to create account
- ❌ Users can abuse free tier
- ❌ Lost conversion opportunities

**Recommended Fix**:
1. Limit anonymous users to **1 snapshot per domain PERIOD** (use domain hash only)
2. Show "Create account to run more" message immediately
3. Store anonymous snapshot with persistent cookie/fingerprint

---

### 2. Authenticated Free Users ✅ GOOD

**Current Limits** (`lib/subscriptions/free-tier-limits.ts`):
- ✅ 1 snapshot per domain every 30 days
- ✅ Maximum 3 unique domains
- ✅ Clear error messages with `upgradeRequired: true`

**Code**:
```typescript
export const FREE_TIER_LIMITS = {
  MAX_SNAPSHOTS_PER_DOMAIN: 1,
  MAX_DOMAINS: 3,
  COOLDOWN_DAYS: 30,
};
```

**What Happens When Limit Hit**:
```json
{
  "success": false,
  "error": "Free tier allows 1 snapshot per domain every 30 days...",
  "upgradeRequired": true
}
```

**Upsell Shown**: ❌ **NO PROMINENT UPGRADE PROMPT IN UI**

---

### 3. Basic Subscribers ($9/month) ✅ IMPLEMENTED

**Benefits**:
- ✅ Unlimited snapshots
- ✅ Unlimited domains
- ✅ Save all reports
- ✅ Dashboard access

**Code**: `lib/subscriptions/access-control.ts`
```typescript
if (subscriptionAccess.isBasicTier) {
  console.log(`✅ Basic subscriber - unlimited snapshots`);
  canRunSnapshot = true;
}
```

**Works**: Yes, properly gates unlimited access

---

### 4. Pro Tier (Monthly Automated Reports) ❌ NOT IMPLEMENTED

**Status**: **FEATURE DOES NOT EXIST**

**Mentioned In**:
- Pricing page
- Documentation
- Future plans

**Reality**:
- ❌ No automated report generation
- ❌ No scheduling system
- ❌ No Pro tier subscription option
- ❌ No cron jobs for monthly runs

**Conclusion**: Pro tier is **vaporware** - mentioned but not built

---

### 5. Multiple Domains Upsell 🟡 WEAK

**Current Behavior**:
- Free users hit 3 domain limit
- Get error: "Free tier allows snapshots for up to 3 domains. Upgrade to Basic for unlimited domains."
- **BUT**: No prominent upgrade button or pricing link in error state

**What's Missing**:
1. Modal popup with upgrade CTA when limit hit
2. Clear pricing comparison
3. "Unlock unlimited domains" button
4. Success stories / testimonials

**Current Error Response** (app/api/snapshot/route.ts line 114):
```typescript
return NextResponse.json({
  success: false,
  error: "Free tier allows snapshots for up to 3 domains...",
  upgradeRequired: true,
}, { status: 429 });
```

**Frontend Handling**: `components/SnapshotRequestForm.tsx`
```typescript
// Just shows error text - NO upgrade button!
if (data.upgradeRequired) {
  setError(data.error); // ❌ Weak upsell
}
```

---

### 6. Create Account Upsells 🟡 MODERATE

**Where Shown**:
1. ✅ Report footer (for anonymous users)
2. ❌ NOT shown prominently in dashboard when limits hit
3. ❌ NOT shown as modal/popup

**Current CTA** (`components/report/CreateAccountCTA.tsx`):
```
"Create a free account to save this report, run more snapshots 
(1 per domain every 30 days), and track changes over time."
```

**Problems**:
- Hidden at bottom of report
- Easy to miss
- Not shown when user tries to run 2nd snapshot
- No urgency

---

## Recommended Fixes (Priority Order)

### 🔴 CRITICAL - Fix Anonymous User Exploit

**Problem**: Unlimited free reports by changing email

**Solution**:
1. Change rate limiting to domain-only for anonymous users
2. One free report per domain EVER for anonymous users
3. Force account creation for any additional reports
4. Add browser fingerprinting as backup

**Code Changes**:
```typescript
// In lib/db/rate-limits.ts
export async function checkRateLimit(params) {
  // For anonymous users: domain-only rate limit
  if (!params.userId) {
    const domainLimit = await checkDomainOnlyLimit(params.domain);
    if (!domainLimit.allowed) {
      return {
        allowed: false,
        error: 'You\'ve already received a free snapshot for this domain. Create a free account to run more snapshots (1 per domain every 30 days).',
        upgradeRequired: false, // Not upgrade, account creation
        accountRequired: true,
      };
    }
  }
  // ... rest of code
}
```

**Impact**: 
- Forces account creation after first snapshot
- Increases user base
- Prevents abuse

---

### 🟡 HIGH - Improve Upsell Messaging

**1. Add Upgrade Modal Component**

Create: `components/upsells/UpgradeModal.tsx`

```typescript
interface UpgradeModalProps {
  reason: 'domain-limit' | 'cooldown' | 'unlimited-needed';
  currentDomains?: number;
  daysRemaining?: number;
}

export function UpgradeModal({ reason }) {
  return (
    <Modal>
      <h2>Unlock Unlimited Snapshots</h2>
      <PricingComparison />
      <Button href="/pricing">Upgrade to Basic - $9/mo</Button>
    </Modal>
  );
}
```

**2. Show Modal When Limits Hit**

Update: `components/SnapshotRequestForm.tsx`

```typescript
if (data.upgradeRequired) {
  setShowUpgradeModal(true); // ✅ Show modal, not just error text
  setUpgradeReason('domain-limit');
}
```

**3. Dashboard Upgrade Banner**

Add to: `components/dashboard/DashboardContent.tsx`

```typescript
{subscriptionStatus === 'free' && uniqueDomains >= 2 && (
  <UpgradeBanner 
    message="You've used 2 of 3 free domains. Upgrade for unlimited!"
    ctaText="Unlock Unlimited"
    href="/pricing"
  />
)}
```

---

### 🟢 MEDIUM - Clarify Pro Tier (or Remove It)

**Option A: Remove Pro Tier**
- Delete from pricing page
- Focus on Basic tier only
- Simplify offering

**Option B: Build Pro Tier**
- Implement monthly automated reports
- Add scheduling system
- Create Vercel cron job
- Add Pro subscription tier in Stripe

**Recommendation**: **Remove Pro Tier** until you're ready to build it. False advertising hurts conversion.

---

### 🟢 LOW - Improve First-Report UX

**Add Post-Report Upsell Sequence**:

1. **Immediately after viewing report** (modal):
   ```
   "🎉 Your IT Snapshot is Ready!
   
   Want to track changes over time?
   Create a free account to save this report and run 1 snapshot 
   per domain every 30 days.
   
   [Create Free Account] [Maybe Later]"
   ```

2. **When trying to run 2nd snapshot as anonymous**:
   ```
   "🔒 Create Account to Continue
   
   You've already received a free snapshot for this domain.
   Create a free account (no credit card needed) to:
   - Save your reports
   - Run 1 snapshot per domain every 30 days
   - Track up to 3 domains
   
   [Create Free Account] [Upgrade to Basic for Unlimited]"
   ```

3. **In dashboard when approaching limits**:
   ```
   "⚠️ 2 of 3 Domains Used
   
   You're almost at your free tier limit.
   Upgrade to Basic ($9/mo) for:
   - Unlimited domains
   - Unlimited snapshots
   - Run snapshots anytime
   
   [See Pricing] [Dismiss]"
   ```

---

## Current User Flows (As-Is)

### Flow 1: Anonymous User (First Time)

```
1. Visit homepage
2. Enter email + domain
3. ✅ Get free snapshot
4. View report
5. See "Create Account" CTA at bottom (easy to miss)
6. Leave site
```

**Conversion Rate**: Low (no urgency, easy to ignore)

---

### Flow 2: Anonymous User (Second Time, EXPLOIT)

```
1. Visit homepage again
2. Enter DIFFERENT EMAIL + same domain
3. ✅ Get ANOTHER free snapshot (PROBLEM!)
4. Repeat infinitely
```

**Revenue Impact**: $0 (should be upselling)

---

### Flow 3: Free Account User (First Domain)

```
1. Create account
2. Run snapshot for domain1.com
3. ✅ Success
4. Wait 30 days or add new domain
```

**Works**: Yes ✅

---

### Flow 4: Free Account User (Hitting Limits)

```
1. Run snapshot for domain1.com → ✅ Success
2. Run snapshot for domain2.com → ✅ Success  
3. Run snapshot for domain3.com → ✅ Success
4. Try domain4.com → ❌ "Free tier allows up to 3 domains"
5. See error message (no prominent upgrade button)
6. Get frustrated, maybe leave
```

**Conversion Rate**: Low (weak upsell)

---

### Flow 5: Free Account User (Cooldown)

```
1. Run snapshot for domain1.com
2. Try again same day → ❌ "1 snapshot per domain every 30 days"
3. See error (no upgrade button)
4. Wait or add different domain
```

**Conversion Rate**: Low (missed upsell opportunity)

---

## Pricing Page Clarity

**Current Tiers** (as advertised):

| Feature | Free | Basic ($9/mo) | Pro ($29/mo) |
|---------|------|---------------|--------------|
| Snapshots | 1 per domain / 30 days | Unlimited | Unlimited |
| Domains | Up to 3 | Unlimited | Unlimited |
| Monthly Reports | ❌ | ❌ | ✅ |

**Problems**:
1. ❌ Pro tier doesn't exist (monthly reports not implemented)
2. ⚠️ Free tier unlimited for anonymous users (email exploit)
3. ✅ Basic tier accurate

---

## Recommended Changes Summary

### Immediate (This Week)

1. **Fix anonymous user exploit**
   - Domain-only rate limiting for non-authenticated users
   - Force account creation after first snapshot
   
2. **Add upgrade modals**
   - Show when limits hit
   - Clear pricing comparison
   - "Upgrade Now" CTA

3. **Remove or hide Pro tier**
   - Don't advertise features that don't exist
   - Add "Coming Soon" badge if keeping it

### Short Term (Next 2 Weeks)

4. **Improve dashboard upsells**
   - Banner showing domain usage (2/3)
   - "X days until next snapshot" countdown
   - Upgrade prompts when limits approached

5. **Better post-report CTAs**
   - Modal after viewing report
   - Persistent upgrade button in report
   - "Save this report" CTA for anonymous users

### Long Term (Future)

6. **Build Pro tier features**
   - Monthly automated reports
   - Email scheduling
   - Cron jobs on Vercel
   - Pro subscription tier

7. **Advanced conversion optimization**
   - A/B test upgrade messaging
   - Exit-intent popups
   - Abandoned cart emails

---

## Metrics to Track

After implementing fixes, monitor:

1. **Anonymous → Account conversion rate**
   - Target: >30% (currently likely <10%)

2. **Free → Basic upgrade rate**
   - Target: >5% monthly

3. **Anonymous user repeat attempts**
   - Should drop to ~0 after fix

4. **Upgrade modal view → upgrade rate**
   - Target: >10%

5. **Dashboard banner click-through rate**
   - Target: >15%

---

## Conclusion

**Current State**: 🟡 **Functional but leaky**

- Basic subscription works
- Free tier controls exist for authenticated users
- **BUT**: Major exploit for anonymous users
- **AND**: Weak upsell messaging throughout

**Priority**:
1. 🔴 Fix anonymous user exploit (revenue leak)
2. 🟡 Add upgrade modals (conversion boost)
3. 🟢 Clarify/remove Pro tier (trust/clarity)

**Estimated Impact**:
- Fix anonymous exploit: +50% account creation
- Add upgrade modals: +20% conversion to Basic
- Better dashboard upsells: +10% upgrade rate

---

## Next Steps - Talk to Me First! 💬

Before I implement anything, let's discuss:

1. **Anonymous user strategy**:
   - Option A: 1 free report per domain EVER (strict)
   - Option B: 1 free report per domain per 30 days (lenient)
   - Option C: 1 free report total, then account required (strictest)

2. **Pro tier decision**:
   - Remove it entirely?
   - Mark as "Coming Soon"?
   - Build it now?

3. **Upsell aggressiveness**:
   - Gentle nudges (dismissible banners)
   - Moderate (modals that can be closed)
   - Aggressive (must see pricing before continuing)

4. **Multiple domains upsell**:
   - When show upgrade prompt (at 2/3 or only at 3/3)?
   - How persistent should prompts be?

**Let me know your preferences and I'll implement accordingly!**
