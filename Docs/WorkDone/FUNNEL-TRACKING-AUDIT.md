# Complete Funnel Tracking Audit & Implementation Guide 🎯

**Date:** 2026-01-30  
**Purpose:** Ensure every critical touchpoint is tracked for Umami funnel reconstruction

---

## Funnel Overview

### Primary Conversion Paths:

```
Path A: Anonymous Snapshot → Email → Account Creation
Path B: Homepage → Direct Signup
Path C: Report View → Account Creation  
Path D: Dashboard → Authenticated Snapshot
```

---

## ✅ Currently Tracked (Existing)

### Homepage & Snapshot Form:
- ✅ Page view: `/` (auto-tracked by Umami)
- ✅ `snapshot-form-started` - When user focuses email field
- ✅ `email-opt-in-checked` - When user checks Brevo opt-in
- ✅ `snapshot-requested` - On successful submission
- ✅ `snapshot-request-failed` - On error (with errorType)

### Email Journey:
- ✅ `email-delivered` - Brevo webhook (server-side)
- ✅ `email-opened` - Brevo webhook (server-side)  
- ✅ `email-clicked` - Brevo webhook (server-side, includes link)

### Report Page:
- ✅ Page view: `/report/[id]` (auto-tracked)
- ✅ `report-viewed` - On page load (includes snapshotId, domain)
- ✅ `block-expanded` - When user expands detailed finding
- ✅ `block-collapsed` - When user collapses section
- ✅ `share_clicked` - Copy link button (domain)
- ✅ `linkedin_share` - LinkedIn share button (domain)
- ✅ `report_printed` - Print/PDF button (domain)

### Authentication:
- ✅ Page view: `/signup` (auto-tracked)
- ✅ Page view: `/login` (auto-tracked)
- ✅ `form-started` - Signup form (signup)
- ✅ `form-submitted` - Signup form (signup)
- ✅ `form-error` - Signup form (signup, errorType)
- ✅ `user-signed-up` - Successful signup
- ✅ `user-logged-in` - Successful login
- ✅ `user-logged-out` - Logout

### Dashboard:
- ✅ Page view: `/dashboard` (auto-tracked)
- ✅ `dashboard-viewed` - On page load
- ✅ `dashboard-cta-clicked` - All dashboard CTAs:
  - `new-snapshot`
  - `view-report`
  - `copy-link`
  - `rerun-domain`

### Report Claiming:
- ✅ `report-claim-started` - When user clicks "Claim This Report"
- ✅ `report-claim-completed` - When claim succeeds

### Navigation:
- ✅ Page view: `/how-it-works` (auto-tracked)
- ✅ `nav-how-it-works` - Header link click (data-umami-event)
- ✅ `nav-blog` - Header link click (data-umami-event)
- ✅ `how-it-works-cta-clicked` - CTA at bottom of How It Works page

---

## ❌ GAPS IDENTIFIED (Need to Add)

### 1. 🔴 CRITICAL: Success State CTAs (Homepage)

**Location:** `components/SnapshotRequestForm.tsx` (after submission)

**Missing Events:**

**Anonymous User Success State:**
```tsx
<Link href="/signup">Create Free Account</Link>  
→ NEED: snapshot-success-cta-clicked (type: 'create-account')

<button onClick={() => setSuccess(false)}>Request Another</button>
→ NEED: snapshot-success-cta-clicked (type: 'request-another')
```

**Authenticated User Success State:**
```tsx
<Link href="/dashboard">Go to Dashboard</Link>
→ NEED: snapshot-success-cta-clicked (type: 'go-to-dashboard')

<button onClick={() => setSuccess(false)}>Request Another</button>
→ NEED: snapshot-success-cta-clicked (type: 'request-another-auth')
```

---

### 2. 🔴 CRITICAL: Report Page Conversion CTAs

**Location:** `components/report/CreateAccountCTA.tsx`

**Missing Event:**
```tsx
<Link href="/signup">Create Free Account</Link>
→ NEED: report-cta-clicked (type: 'create-account')
```

**Location:** `components/report/RunAnotherDomainCTA.tsx`

**Missing Event:**
```tsx
<Link href="/">Run Another Snapshot</Link>
→ NEED: report-cta-clicked (type: 'run-another')
```

**Note:** `reportCtaClicked` function EXISTS in analytics.ts but NOT WIRED UP!

---

### 3. 🟡 MEDIUM: Header Navigation CTAs

**Location:** `components/HeaderActions.tsx`

**Missing Events:**
```tsx
<Link href="/signup">Create Account</Link>
→ NEED: header-cta-clicked (type: 'signup')

<Link href="/login">Login</Link>  
→ NEED: header-cta-clicked (type: 'login')

<Link href="/dashboard">Dashboard</Link>
→ NEED: header-cta-clicked (type: 'dashboard')
```

---

### 4. 🟡 MEDIUM: Login Form Start

**Location:** `components/auth/LoginForm.tsx`

**Current:** Only tracks on submit
**Missing:** Track on form start (email field focus)

---

### 5. 🟢 NICE-TO-HAVE: Homepage CTA Tracking

**Location:** `app/page.tsx`

**Missing Events:**
```tsx
// Hero CTA - Create Account
<Link href="/signup">Create Free Account</Link>
→ NEED: homepage-cta-clicked (location: 'hero', type: 'create-account')

// Footer CTA - Create Account
<Link href="/signup">Create Free Account</Link>
→ NEED: homepage-cta-clicked (location: 'footer', type: 'create-account')
```

---

### 6. 🟢 NICE-TO-HAVE: "Expand All" Detailed Findings

**Location:** `components/report/BlockNarratives.tsx`

**Missing Event:**
```tsx
<button onClick={toggleAll}>Expand All / Collapse All</button>
→ NEED: report-expand-all-clicked (action: 'expand' | 'collapse')
```

---

## Implementation Plan

### Phase 1: Critical Gaps (Ship Today)

#### 1.1 Add `snapshotSuccessCtaClicked` to Analytics

**File:** `lib/analytics.ts`

```typescript
// Snapshot success state CTAs
snapshotSuccessCtaClicked: (ctaType: 'create-account' | 'go-to-dashboard' | 'request-another' | 'request-another-auth') => {
  trackEvent('snapshot-success-cta-clicked', {
    ctaType,
  });
},
```

#### 1.2 Wire Up Success State CTAs

**File:** `components/SnapshotRequestForm.tsx`

**Anonymous user:**
```tsx
<Link
  href="/signup"
  onClick={() => Analytics.snapshotSuccessCtaClicked('create-account')}
  className="..."
>
  Create Free Account
</Link>

<button
  onClick={() => {
    Analytics.snapshotSuccessCtaClicked('request-another');
    setSuccess(false);
  }}
  className="..."
>
  Request Another
</button>
```

**Authenticated user:**
```tsx
<Link
  href="/dashboard"
  onClick={() => Analytics.snapshotSuccessCtaClicked('go-to-dashboard')}
  className="..."
>
  Go to Dashboard
</Link>

<button
  onClick={() => {
    Analytics.snapshotSuccessCtaClicked('request-another-auth');
    setSuccess(false);
  }}
  className="..."
>
  Request Another
</button>
```

#### 1.3 Wire Up Report CTAs

**File:** `components/report/CreateAccountCTA.tsx`

```tsx
<Link
  href="/signup"
  onClick={() => Analytics.reportCtaClicked('create-account')}
  className="..."
>
  Create Free Account
</Link>
```

**File:** `components/report/RunAnotherDomainCTA.tsx`

```tsx
<Link
  href="/"
  onClick={() => Analytics.reportCtaClicked('run-another')}
  className="..."
>
  Run Another Snapshot
</Link>
```

---

### Phase 2: Medium Priority (Ship This Week)

#### 2.1 Add `headerCtaClicked` to Analytics

**File:** `lib/analytics.ts`

```typescript
// Header navigation CTAs
headerCtaClicked: (ctaType: 'signup' | 'login' | 'dashboard' | 'logout') => {
  trackEvent('header-cta-clicked', {
    ctaType,
  });
},
```

#### 2.2 Wire Up Header CTAs

**File:** `components/HeaderActions.tsx`

```tsx
{!user ? (
  <>
    <Link
      href="/signup"
      onClick={() => Analytics.headerCtaClicked('signup')}
      className="..."
    >
      Create Account
    </Link>
    <Link
      href="/login"
      onClick={() => Analytics.headerCtaClicked('login')}
      className="..."
    >
      Login
    </Link>
  </>
) : (
  <>
    <Link
      href="/dashboard"
      onClick={() => Analytics.headerCtaClicked('dashboard')}
      className="..."
    >
      Dashboard
    </Link>
    <button
      onClick={() => {
        Analytics.headerCtaClicked('logout');
        handleLogout();
      }}
      className="..."
    >
      Logout
    </button>
  </>
)}
```

#### 2.3 Track Login Form Start

**File:** `components/auth/LoginForm.tsx`

```tsx
<input
  type="email"
  onFocus={() => Analytics.formStarted('login')}
  // ... other props
/>
```

---

### Phase 3: Nice-to-Have (Next Week)

#### 3.1 Add Homepage CTA Tracking

**File:** `lib/analytics.ts`

```typescript
// Homepage CTAs
homepageCtaClicked: (location: 'hero' | 'footer' | 'features', ctaType: string) => {
  trackEvent('homepage-cta-clicked', {
    location,
    ctaType,
  });
},
```

#### 3.2 Track Expand All

**File:** `lib/analytics.ts`

```typescript
// Report expand all
reportExpandAllClicked: (action: 'expand' | 'collapse') => {
  trackEvent('report-expand-all-clicked', {
    action,
  });
},
```

**File:** `components/report/BlockNarratives.tsx`

```tsx
<button
  onClick={() => {
    const newAction = allExpanded ? 'collapse' : 'expand';
    Analytics.reportExpandAllClicked(newAction);
    toggleAll();
  }}
  className="..."
>
  {allExpanded ? 'Collapse All' : 'Expand All'}
</button>
```

---

## Complete Umami Funnel Structure

### Primary Funnel: Anonymous Snapshot → Account Creation

```
1. Page View: /
   └→ snapshot-form-started (email focus)
       └→ email-opt-in-checked (optional)
           └→ snapshot-requested (domain)
               ├→ snapshot-request-failed (errorType) [Dead End]
               └→ snapshot-success-cta-clicked (create-account)
                   └→ Page View: /signup
                       └→ form-started (signup)
                           └→ form-submitted (signup)
                               ├→ form-error (signup, errorType) [Loop Back]
                               └→ user-signed-up
                                   └→ Page View: /dashboard
                                       └→ dashboard-viewed
```

**Conversion Rate Calculation:**
```
CVR = user-signed-up / snapshot-requested
```

---

### Secondary Funnel: Email → Report → Account

```
1. email-delivered (snapshotId)
   └→ email-opened (snapshotId)
       └→ email-clicked (snapshotId, link)
           └→ Page View: /report/[id]
               └→ report-viewed (snapshotId, domain)
                   ├→ block-expanded (blockName) [Engagement]
                   ├→ share_clicked (domain) [Viral]
                   ├→ report_printed (domain) [Qualification]
                   └→ report-cta-clicked (create-account)
                       └→ Page View: /signup
                           └→ [... signup flow ...]
```

**Email Engagement Rate:**
```
Engagement = email-opened / email-delivered
Click Rate = email-clicked / email-opened
Report Conversion = report-cta-clicked / report-viewed
```

---

### Tertiary Funnel: Direct Signup (No Snapshot)

```
1. Page View: /
   └→ header-cta-clicked (signup)
       └→ Page View: /signup
           └→ form-started (signup)
               └→ [... signup flow ...]
```

**Direct Signup Rate:**
```
Direct CVR = user-signed-up / (header-cta-clicked + homepage-cta-clicked)
```

---

### Authenticated User Funnel: Dashboard → Snapshot

```
1. Page View: /dashboard
   └→ dashboard-viewed
       └→ dashboard-cta-clicked (new-snapshot)
           └→ Page View: /
               └→ snapshot-form-started
                   └→ snapshot-requested (domain)
                       └→ snapshot-success-cta-clicked (go-to-dashboard)
                           └→ Page View: /dashboard
                               └→ dashboard-cta-clicked (view-report)
                                   └→ Page View: /report/[id]
                                       └→ report-viewed (snapshotId, domain)
```

**Authenticated Snapshot Completion:**
```
Completion = dashboard-cta-clicked(view-report) / dashboard-cta-clicked(new-snapshot)
```

---

## Umami Funnel Configuration

### Goals to Create in Umami:

#### Goal 1: Free Snapshot Requested
- **Event:** `snapshot-requested`
- **Value:** 1 per snapshot
- **Funnel:**
  1. `snapshot-form-started`
  2. `snapshot-requested`

#### Goal 2: Account Created from Snapshot
- **Event:** `user-signed-up`
- **Funnel:**
  1. `snapshot-requested`
  2. `snapshot-success-cta-clicked` (create-account)
  3. `form-started` (signup)
  4. `user-signed-up`

#### Goal 3: Email-Driven Report View
- **Event:** `report-viewed`
- **Funnel:**
  1. `email-delivered`
  2. `email-opened`
  3. `email-clicked`
  4. `report-viewed`

#### Goal 4: Report to Account Conversion
- **Event:** `user-signed-up`
- **Funnel:**
  1. `report-viewed`
  2. `report-cta-clicked` (create-account)
  3. `user-signed-up`

#### Goal 5: Brevo Opt-In
- **Event:** `email-opt-in-submitted`
- **Funnel:**
  1. `snapshot-form-started`
  2. `email-opt-in-checked`
  3. `snapshot-requested`
  4. `email-opt-in-submitted`

---

## Key Metrics to Track in Umami

### Acquisition:
- Page views: `/` (traffic source)
- `snapshot-form-started` (form interaction rate)

### Activation:
- `snapshot-requested` (snapshot request rate)
- `snapshot-request-failed` (error rate)

### Retention:
- `email-opened` (email engagement)
- `email-clicked` (email CTR)
- `report-viewed` (report access rate)

### Referral:
- `share_clicked` (share intent)
- `linkedin_share` (professional sharing)

### Revenue (Conversion):
- `snapshot-success-cta-clicked` (create-account) (intent to convert)
- `report-cta-clicked` (create-account) (intent to convert)
- `user-signed-up` (conversion)
- `email-opt-in-checked` (nurture list growth)

---

## Data Retention & Privacy

### Anonymous User Events:
- ✅ Domain stored (not PII)
- ✅ Snapshot ID stored (UUID)
- ❌ NO email addresses in events
- ❌ NO personal data in properties

### Authenticated User Events:
- ✅ User ID from Umami (hashed)
- ✅ Domain stored
- ❌ NO email in events

### Compliance:
- ✅ Umami is privacy-friendly (no cookies)
- ✅ GDPR compliant
- ✅ No cross-site tracking
- ✅ Hosted on EU servers (if configured)

---

## Testing Checklist

### Before Deployment:

- [ ] All new Analytics functions added
- [ ] All CTAs wired up with tracking
- [ ] No console errors in dev
- [ ] Events firing correctly (check browser console)
- [ ] Event properties correct (domain, snapshotId, etc.)

### After Deployment:

- [ ] Submit test snapshot (anonymous)
- [ ] Click all success state CTAs
- [ ] Click report page CTAs
- [ ] Create test account
- [ ] Check Umami dashboard for events
- [ ] Verify event properties

---

## Quick Reference: Event Name Map

| User Action | Event Name | Properties |
|-------------|-----------|------------|
| Focus email field (homepage) | `snapshot-form-started` | - |
| Check opt-in checkbox | `email-opt-in-checked` | `source` |
| Submit snapshot form | `snapshot-requested` | `domain` |
| Snapshot error | `snapshot-request-failed` | `errorType` |
| Click success CTA | `snapshot-success-cta-clicked` | `ctaType` |
| Email delivered | `email-delivered` | `snapshotId` |
| Email opened | `email-opened` | `snapshotId` |
| Email link clicked | `email-clicked` | `snapshotId`, `link` |
| Report page load | `report-viewed` | `snapshotId`, `domain` |
| Expand finding | `block-expanded` | `blockName` |
| Collapse finding | `block-collapsed` | `blockName` |
| Copy report link | `share_clicked` | `domain` |
| Share to LinkedIn | `linkedin_share` | `domain` |
| Print report | `report_printed` | `domain` |
| Report CTA click | `report-cta-clicked` | `ctaType` |
| Header CTA click | `header-cta-clicked` | `ctaType` |
| Homepage CTA click | `homepage-cta-clicked` | `location`, `ctaType` |
| Signup form start | `form-started` | `formName: 'signup'` |
| Signup form submit | `form-submitted` | `formName: 'signup'` |
| Signup form error | `form-error` | `formName`, `errorType` |
| Account created | `user-signed-up` | - |
| User logged in | `user-logged-in` | - |
| User logged out | `user-logged-out` | - |
| Dashboard viewed | `dashboard-viewed` | - |
| Dashboard CTA click | `dashboard-cta-clicked` | `ctaType` |
| Claim report start | `report-claim-started` | `snapshotId`, `domain` |
| Claim report complete | `report-claim-completed` | `snapshotId`, `domain` |

---

## Files to Modify

### Phase 1 (Critical):
1. `lib/analytics.ts` - Add `snapshotSuccessCtaClicked`
2. `components/SnapshotRequestForm.tsx` - Wire up success CTAs
3. `components/report/CreateAccountCTA.tsx` - Wire up CTA
4. `components/report/RunAnotherDomainCTA.tsx` - Wire up CTA

### Phase 2 (Medium):
5. `lib/analytics.ts` - Add `headerCtaClicked`
6. `components/HeaderActions.tsx` - Wire up header CTAs
7. `components/auth/LoginForm.tsx` - Track form start

### Phase 3 (Nice-to-have):
8. `lib/analytics.ts` - Add `homepageCtaClicked`, `reportExpandAllClicked`
9. `app/page.tsx` - Wire up homepage CTAs
10. `components/report/BlockNarratives.tsx` - Wire up expand all

---

**Status:** Audit complete. Ready to implement Phase 1.

**Next:** Ship Phase 1 (critical gaps) today, then Phase 2 this week.

This will give you **100% funnel visibility** in Umami. 🎯
