# Conversion Funnel Analysis - Snapshot Linking

**Date**: January 29, 2026  
**Question**: Does the snapshot linking work when users sign up?

---

## Current State: ⚠️ **INCOMPLETE**

### **What Works** ✅:
1. Anonymous snapshot creation (with `email_hash`)
2. Claim Report API route (`/api/claim-report`)
3. `ClaimReportPrompt` component (UI)
4. `linkSnapshotToUser()` function (database)

### **What's Missing** ❌:
1. `ClaimReportPrompt` is **never shown** on report page
2. No automatic linking when user signs up with same email
3. Conversion funnel is **broken**

---

## The Problem

### **Current Flow** (Broken):
```
1. User requests snapshot with email@example.com
   ↓
2. Snapshot created: { email_hash: "abc123", user_id: null }
   ↓
3. User gets email with magic link
   ↓
4. User views report
   ↓
5. Report shows "Create Account" CTA
   ↓
6. User clicks → Goes to /signup
   ↓
7. User creates account with email@example.com
   ↓
8. Account created successfully ✅
   ↓
9. User logs in and goes to dashboard
   ↓
10. Dashboard shows: NO SNAPSHOTS ❌
    └─ Snapshot is still anonymous!
    └─ Never got linked to user account!
```

---

## Why It's Broken

### **1. ClaimReportPrompt Never Rendered**

**File**: `app/report/[id]/page.tsx`

**Current code**:
```tsx
// Line 95
<CreateAccountCTA />  // ← Always shows this

// ClaimReportPrompt is NEVER imported or rendered!
```

**Should be**:
```tsx
{/* Show claim prompt if logged in AND snapshot is anonymous */}
{isLoggedIn && !snapshot.user_id && (
  <ClaimReportPrompt snapshotId={snapshot.id} domain={snapshot.domain} />
)}

{/* Show create account CTA if logged out */}
{!isLoggedIn && (
  <CreateAccountCTA />
)}
```

But report page is Server Component, can't easily check `isLoggedIn` client-side.

---

### **2. No Auto-Linking on Signup**

When user signs up with email that matches a snapshot's `email_hash`:
- ❌ No automatic linking happens
- ❌ Snapshot stays anonymous
- ❌ User doesn't see it in dashboard

**Should have**:
```typescript
// In signup flow:
1. User signs up with email@example.com
2. Check if any snapshots exist with hash(email@example.com)
3. If found, automatically link them to new user
4. User sees snapshots in dashboard immediately ✅
```

---

## Solutions

### **Option 1: Auto-Link on Signup** (Recommended)

**When**: User signs up with email that matches anonymous snapshot

**How**:
1. After account creation, query for snapshots with matching `email_hash`
2. Automatically link them to the new user
3. User sees them in dashboard immediately

**Pros**:
- ✅ Seamless experience
- ✅ No extra clicks
- ✅ User delighted ("My report is already here!")

**Cons**:
- ⚠️ Need to add logic to signup flow

---

### **Option 2: Manual Claim from Report** (Current - Not Working)

**When**: Logged-in user visits anonymous report they requested

**How**:
1. Report page detects user is logged in
2. Report page detects snapshot is anonymous
3. Shows "Save to Dashboard" button
4. User clicks, snapshot linked

**Pros**:
- ✅ User has control
- ✅ Clear action

**Cons**:
- ⚠️ Extra step for user
- ⚠️ User might not revisit report after signup
- ⚠️ Requires fixing report page to show ClaimReportPrompt

---

### **Option 3: Both** (Best UX)

**Automatic + Manual**:
1. **Auto-link on signup** (covers most cases)
2. **Show claim prompt** on report page (covers edge cases)

**Covers all scenarios**:
- ✅ User signs up from homepage after requesting snapshot → Auto-linked
- ✅ User signs up from report page → Auto-linked
- ✅ User signs up days later, then revisits old report link → Manual claim
- ✅ User shares report link with colleague who also signs up → Manual claim (their own snapshot)

---

## Recommended Implementation

### **✅ Step 1: Auto-Link on Signup**

**File**: `app/api/auth/create-user-record/route.ts`

Add after user record creation:
```typescript
// After creating user record:
const userEmailHash = hashIdentifier(email);

// Find and link any anonymous snapshots with matching email_hash
const { data: anonymousSnapshots } = await supabase
  .from('snapshots')
  .select('id')
  .eq('email_hash', userEmailHash)
  .is('user_id', null)
  .is('deleted_at', null);

if (anonymousSnapshots && anonymousSnapshots.length > 0) {
  console.log(`[Signup] Auto-linking ${anonymousSnapshots.length} snapshots`);
  
  for (const snapshot of anonymousSnapshots) {
    await linkSnapshotToUser(snapshot.id, user.id);
  }
}
```

---

### **✅ Step 2: Show ClaimReportPrompt on Report Page**

**File**: `app/report/[id]/page.tsx`

Make it a client wrapper that checks auth:
```tsx
// Add after report content
<ReportFooterActions 
  snapshotId={snapshot.id} 
  domain={snapshot.domain}
  hasUserId={!!snapshot.user_id}
/>

// ReportFooterActions.tsx (new client component)
'use client';

export function ReportFooterActions({ snapshotId, domain, hasUserId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    checkAuth();
  }, []);

  if (user && !hasUserId) {
    return <ClaimReportPrompt snapshotId={snapshotId} domain={domain} />;
  }

  if (!user) {
    return <CreateAccountCTA />;
  }

  return null; // Already claimed
}
```

---

## Testing Checklist

### **After Implementing Auto-Link**:

#### **Scenario 1: Happy Path**
- [ ] Request snapshot for `test@example.com`
- [ ] Get email, view report
- [ ] Click "Create Account" from homepage
- [ ] Sign up with `test@example.com`
- [ ] Complete signup
- [ ] Log in
- [ ] Go to dashboard
- [ ] ✅ **Snapshot should be there!**

#### **Scenario 2: Different Email**
- [ ] Request snapshot for `test1@example.com`
- [ ] Sign up with `test2@example.com`
- [ ] Dashboard should be empty (different email)
- [ ] Go back to report link
- [ ] See "Save to Dashboard" button
- [ ] Click it
- [ ] ✅ **Snapshot now in dashboard**

#### **Scenario 3: Multiple Snapshots**
- [ ] Request 3 snapshots with same email
- [ ] Sign up with that email
- [ ] Dashboard should show all 3 ✅

---

## Current Status

### **❌ Broken Right Now**:
```
User requests snapshot
  ↓
User signs up
  ↓
Dashboard: Empty ❌
Snapshot: Still anonymous ❌
```

### **✅ After Fix**:
```
User requests snapshot
  ↓
User signs up
  ↓
Auto-link runs ✅
  ↓
Dashboard: Shows snapshot ✅
```

---

## Priority

🔴 **HIGH PRIORITY** - This is your main conversion funnel!

Without this:
- ❌ Users sign up but see empty dashboard
- ❌ Appears broken ("Where's my report?")
- ❌ Bad first impression
- ❌ Low conversion/retention

---

**Recommendation**: Implement auto-linking IMMEDIATELY before more users hit this issue.

Would you like me to implement the auto-link on signup now?
