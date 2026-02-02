# Free Tier Controls - Action Plan

**Date**: February 2, 2026  
**Status**: Ready to Implement

## What Actually Exists (I Was Wrong!)

### ✅ Automatic Monthly Snapshots DOES EXIST

**File**: `app/api/cron/monthly-snapshots/route.ts`  
**Schedule**: Daily at 1am UTC (`vercel.json` cron: `"0 1 * * *"`)  
**Status**: **FULLY IMPLEMENTED**

**How It Works**:
1. Gets all active Basic subscribers
2. For each subscriber, finds their domains
3. Checks if last snapshot was ≥30 days ago
4. If yes, auto-generates snapshot
5. Sends email notification

**My Apologies**: This was already built. The pricing page is CORRECT.

---

## Current Free Tier Limits

From `lib/subscriptions/free-tier-limits.ts`:

```typescript
export const FREE_TIER_LIMITS = {
  MAX_SNAPSHOTS_PER_DOMAIN: 1,    // 1 snapshot per domain
  MAX_DOMAINS: 3,                  // Up to 3 unique domains
  COOLDOWN_DAYS: 30,               // ⚠️ Allows re-runs after 30 days
};
```

---

## Issues to Fix (Based on Your Decisions)

### 🔴 Issue #1: Anonymous Users Get Unlimited Reports

**Problem**: Can switch emails infinitely to get more free reports

**Current**: Rate limiting uses `domain_hash + email_hash`  
**Fix**: Use `domain_hash` only for anonymous users

**Your Decision**: Option A - Block after 1st snapshot per domain

---

### 🔴 Issue #2: Free Users Can Re-run After 30 Days

**Problem**: Free accounts get re-runs every 30 days

**Current**: `COOLDOWN_DAYS: 30` allows re-runs  
**Fix**: Remove cooldown - make it permanent

**Your Decision**: "No re-runs full stop. We make them pay."

---

### ✅ Issue #3: Domain Limit

**Current**: 3 domains max for free users  
**Status**: **CORRECT** - Keep as-is

**Your Decision**: "There needs to be a limit" - Keep 3 domains

---

## Implementation Plan

### Fix #1: Block Anonymous Users (Domain-Only Limit)

**File**: `lib/db/rate-limits.ts`

**Change**:
```typescript
// For anonymous users (no userId), check domain-only limit
// This prevents email switching exploit
export async function checkRateLimit(params: {
  domain: string;
  userId?: string;
  email?: string;
  tierLimitType?: string;
}) {
  const supabase = getSupabaseAdmin();
  const { domain, userId, email, tierLimitType = 'free' } = params;
  
  const domainHash = hashIdentifier(domain);
  const emailHash = email ? hashIdentifier(email) : null;
  
  // TESTING BYPASS: Whitelist specific emails
  const whitelistEmails = ['masterjedi.r13@gmail.com'];
  if (email && whitelistEmails.includes(email.toLowerCase())) {
    console.log(`✅ Rate limit bypass for whitelisted email: ${email}`);
    return { allowed: true, error: null };
  }
  
  // NEW: For anonymous users, check if domain has EVER been scanned
  if (!userId) {
    const { data: existingDomainSnapshot, error: domainError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('domain_hash', domainHash)
      .is('user_id', null)  // Only anonymous snapshots
      .maybeSingle();
    
    if (existingDomainSnapshot) {
      return {
        allowed: false,
        error: 'You\'ve already received a free snapshot for this domain. Create a free account to track changes over time and run snapshots for up to 3 domains.',
      };
    }
    
    // First anonymous snapshot for this domain - allow it
    return { allowed: true, error: null };
  }
  
  // For authenticated users, continue with existing logic...
  // (rest of function unchanged)
}
```

**Impact**:
- Anonymous users: 1 snapshot per domain EVER (no email switching)
- Forces account creation for more snapshots
- Matches pricing: "One snapshot per domain"

---

### Fix #2: Remove 30-Day Cooldown for Free Users

**File**: `lib/subscriptions/free-tier-limits.ts`

**Change**:
```typescript
export const FREE_TIER_LIMITS = {
  MAX_SNAPSHOTS_PER_DOMAIN: 1,    // 1 snapshot per domain
  MAX_DOMAINS: 3,                  // Up to 3 unique domains
  COOLDOWN_DAYS: 0,                // ✅ CHANGED: No re-runs (was 30)
};
```

**And update the check logic**:
```typescript
// Check: Exceeded max snapshots per domain?
if (snapshotsForThisDomain >= FREE_TIER_LIMITS.MAX_SNAPSHOTS_PER_DOMAIN) {
  // No cooldown check - permanent limit
  return {
    allowed: false,
    reason: `Free accounts get 1 snapshot per domain. Upgrade to Basic ($19.99/mo) for automatic monthly snapshots and unlimited re-runs.`,
    upgradeRequired: true,
    limitsUsed: {
      snapshotsForDomain: snapshotsForThisDomain,
      totalDomains: uniqueDomains,
      lastSnapshotDate: lastSnapshotForDomain,
    },
  };
}
```

**Impact**:
- Free users: 1 snapshot per domain FOREVER
- Must upgrade to Basic for any re-runs
- Matches your decision: "No re-runs full stop. We make them pay."

---

### Fix #3: Update Error Messages

**File**: `components/SnapshotRequestForm.tsx`

**Add better error handling**:
```typescript
if (!response.ok) {
  const data = await response.json();
  
  if (data.upgradeRequired) {
    // Show upgrade modal instead of just error text
    setError(data.error);
    setShowUpgradeModal(true); // NEW: Modal component
    setUpgradeReason(data.reason);
  } else if (data.accountRequired) {
    // Show create account modal
    setError(data.error);
    setShowCreateAccountModal(true); // NEW: Modal component
  } else {
    setError(data.error);
  }
  setIsLoading(false);
  return;
}
```

**Create Modal Component**: `components/upsells/UpgradeModal.tsx`

Show when users hit limits with:
- Clear pricing: "$19.99/mo for unlimited"
- Benefits: "Automatic monthly snapshots"
- CTA: "Upgrade to Basic" button

---

### Fix #4: Update Pricing Page Copy

**File**: `app/pricing/page.tsx`

**Current** (Free Snapshot limits):
```
- One snapshot per domain
- No history or timeline
- No re-runs unless you upgrade
```

**Update to be clearer**:
```
- One free snapshot per domain
- No re-runs or updates
- Must upgrade for ongoing tracking
```

**And add note**:
```
Free tier: Up to 3 domains, 1 snapshot each (no updates)
```

---

## Summary of Changes

### What Gets Fixed:
1. ✅ Anonymous users blocked after 1 snapshot per domain (no email switching)
2. ✅ Free users NEVER get re-runs (must upgrade)
3. ✅ 3 domain limit stays
4. ✅ Better upsell modals when limits hit
5. ✅ Clearer pricing page messaging

### What Stays The Same:
1. ✅ Automatic monthly snapshots (already working!)
2. ✅ Basic tier: unlimited manual + automatic monthly
3. ✅ 3 domain limit for free tier

---

## Files to Modify

1. **`lib/db/rate-limits.ts`** - Add domain-only check for anonymous users
2. **`lib/subscriptions/free-tier-limits.ts`** - Change `COOLDOWN_DAYS: 0`
3. **`components/SnapshotRequestForm.tsx`** - Add upgrade modal handling
4. **`components/upsells/UpgradeModal.tsx`** - NEW: Create modal component
5. **`app/pricing/page.tsx`** - Clarify free tier limits copy

---

## Testing Plan

### Test #1: Anonymous User Exploit
```
1. Visit homepage (no account)
2. Enter test1@example.com + mysite.com → ✅ Get snapshot
3. Try test2@example.com + mysite.com → ❌ "Already received free snapshot"
4. Must create account to continue
```

### Test #2: Free Account No Re-runs
```
1. Create free account
2. Run snapshot for domain1.com → ✅ Success
3. Try to re-run domain1.com → ❌ "Upgrade to Basic for re-runs"
4. Run snapshot for domain2.com → ✅ Success (2/3 domains)
5. Run snapshot for domain3.com → ✅ Success (3/3 domains)
6. Try domain4.com → ❌ "Upgrade to Basic for unlimited domains"
```

### Test #3: Basic Subscriber Auto-Snapshots
```
1. Subscribe to Basic ($19.99/mo)
2. Run manual snapshot for mysite.com
3. Wait 30+ days (or manually trigger cron)
4. Check: New snapshot auto-generated ✅
5. Check: Email notification received ✅
```

---

## Estimated Time

- Fix #1 (Anonymous block): 30 minutes
- Fix #2 (Remove cooldown): 15 minutes
- Fix #3 (Error modals): 1 hour
- Fix #4 (Pricing copy): 15 minutes

**Total**: ~2 hours

---

## Ready to Implement?

All the automated monthly snapshot infrastructure is already there. I just need to fix the free tier controls to match your requirements:

1. ✅ Block anonymous email switching
2. ✅ No re-runs for free (permanent limit)
3. ✅ Keep 3 domain limit
4. ✅ Better upsell UI

**Should I proceed with these fixes?**
