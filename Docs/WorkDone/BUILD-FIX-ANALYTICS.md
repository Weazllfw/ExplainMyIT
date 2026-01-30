# Build Fix - Analytics Track Method

**Date**: January 29, 2026  
**Build Error**: `Property 'track' does not exist on type 'Analytics'`

---

## The Problem

**Vercel Build Failed**:
```
./components/auth/ForgotPasswordPageTracker.tsx:12:15
Type error: Property 'track' does not exist on type 'Analytics'

Analytics.track('page-view', { page: '/forgot-password' });
          ^^^^^
```

**Root Cause**:
- Created new page trackers for forgot-password and reset-password pages
- These trackers call `Analytics.track('page-view', {...})`
- But the `Analytics` object didn't have a `track` method
- Only had specific methods like `userSignedUp()`, `dashboardViewed()`, etc.

---

## The Fix

### ✅ **Added Generic `track` Method to Analytics Object**

**File**: `lib/analytics.ts`

**Change**:
```typescript
export const Analytics = {
  // Generic track method (exposes trackEvent for custom events)
  track: trackEvent,  // ← ADDED THIS

  // Waitlist events
  waitlistSignup: (data: { ... }) => { ... },
  // ... rest of methods
};
```

**What This Does**:
- Exposes the underlying `trackEvent()` function as `Analytics.track()`
- Allows custom event tracking: `Analytics.track('event-name', { data })`
- Maintains consistency with existing specific methods
- Makes Analytics object more flexible

---

## Why This Pattern

### **Specific Methods (Preferred)**
```typescript
Analytics.userSignedUp();
Analytics.dashboardViewed();
Analytics.reportClaimCompleted(snapshotId, domain);
```

**Benefits**:
- ✅ Type-safe
- ✅ Self-documenting
- ✅ Consistent naming
- ✅ Hard to misuse

### **Generic Method (When Needed)**
```typescript
Analytics.track('page-view', { page: '/forgot-password' });
Analytics.track('custom-event', { customData: 'value' });
```

**Use Cases**:
- Page view tracking (generic across many pages)
- One-off events that don't need a dedicated method
- Rapid prototyping
- Third-party integrations

---

## Usage Examples

### **Page View Tracking** (What We Fixed)
```typescript
// In page tracker components
export default function ForgotPasswordPageTracker() {
  useEffect(() => {
    Analytics.track('page-view', { page: '/forgot-password' });
  }, []);
  return null;
}
```

### **Custom Event Tracking**
```typescript
// Any custom event
Analytics.track('feature-flag-toggled', {
  flag: 'new-ui',
  enabled: true
});

Analytics.track('onboarding-step-completed', {
  step: 3,
  timeSpent: 45
});
```

### **Specific Events** (Existing Pattern)
```typescript
// Use specific methods when available
Analytics.userSignedUp();
Analytics.snapshotRequested('example.com');
Analytics.formError('signup', 'password-mismatch');
```

---

## Files Changed

1. ✅ `lib/analytics.ts` (MODIFIED) - Added `track: trackEvent` to Analytics object

---

## Testing

### **Build Test**
```bash
npm run build
```
Should now compile successfully without TypeScript errors.

### **Runtime Test**
1. Navigate to `/forgot-password`
2. Open DevTools Console
3. Should see: `[Umami Event] page-view { page: '/forgot-password' }`
4. Check Umami dashboard for event

---

## Future Additions

If you need more page trackers, use the same pattern:

```typescript
// components/some-page/PageTracker.tsx
'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

export default function SomePageTracker() {
  useEffect(() => {
    Analytics.track('page-view', { page: '/some-page' });
  }, []);

  return null;
}
```

**Or add a specific method to Analytics**:
```typescript
// In lib/analytics.ts
export const Analytics = {
  // ... existing methods
  
  pageViewed: (pagePath: string) => {
    trackEvent('page-view', { page: pagePath });
  },
};

// Then use it:
Analytics.pageViewed('/forgot-password');
```

---

**Status**: ✅ **FIXED** - Build should now succeed!

**Next**: Push changes and verify Vercel build passes.
