# Bug Fixes - February 2, 2026

## 1. Dashboard Date Bug: "-1 days ago" ✅

### Problem
Snapshots created "today" were showing as "-1 days ago" due to timezone/clock precision issues.

### Root Cause
The date calculation in `DashboardContent.tsx` could produce negative values when:
- Snapshot timestamp was slightly in the future (server clock drift)
- Timezone conversions caused precision issues
- Timestamps differed by milliseconds

### Fix
Added `Math.max(0, ...)` to ensure days are never negative:

```typescript
// Before (could be negative)
const daysAgo = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

// After (always >= 0)
const diffMs = now.getTime() - createdDate.getTime();
const daysAgo = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
```

### Result
- Snapshots created today now always show "Today"
- No more negative days
- Handles clock drift gracefully

---

## 2. Analytics Events Not Appearing 🔍

### Problem
Events from the free user flow (view page → get free report → create account) were not appearing in Umami dashboard.

### Investigation
The analytics tracking code is correct and events should be firing:
- ✅ Umami script loads in layout.tsx
- ✅ Environment variables configured
- ✅ Event tracking calls in place

### Potential Causes

1. **Ad Blocker** - Most common issue
   - Many ad blockers block analytics scripts
   - Test in incognito mode

2. **Script Loading Timing**
   - Script loads with `defer` attribute
   - Events fired before script ready

3. **Network Issues**
   - POST requests to Umami blocked
   - CORS or firewall issues

4. **Umami Dashboard Delay**
   - Events take 30-60 seconds to appear
   - Realtime view is faster than main dashboard

### Fix Applied

**Enhanced Logging**
Updated `lib/analytics.ts` to log when Umami is not loaded:

```typescript
if (window.umami) {
  window.umami.track(eventName, eventData);
  // Log in dev for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Umami Event Sent]', eventName, eventData);
  }
} else {
  // Warn in all environments if Umami not loaded
  console.warn('[Umami Not Loaded] Event not sent:', eventName, eventData);
}
```

### How to Debug

#### 1. Quick Console Check
```javascript
// Should return an object
console.log(window.umami);
```

#### 2. Manual Event Test
```javascript
// Fire a test event
window.umami.track('test-event', { test: true });
```

#### 3. Enable Debug Mode
```javascript
// Wrap track function to log all events
const original = window.umami.track;
window.umami.track = function(name, data) {
  console.log('📊', name, data);
  original.call(this, name, data);
};
```

#### 4. Check Umami Realtime Dashboard
1. Go to https://cloud.umami.is/
2. Navigate to your website
3. Click **"Realtime"** tab
4. Perform actions on your site
5. Events appear within 1-5 seconds

### Expected Events in Free User Flow

| Step | Event Name | Event Data |
|------|------------|------------|
| 1. Focus email field | `snapshot-form-started` | none |
| 2. Submit form | `snapshot-requested` | `{ domain }` |
| 3. Click "Create Account" | `snapshot-success-cta-clicked` | `{ ctaType: 'create-account' }` |
| 4. Start signup form | `form-started` | `{ formName: 'signup' }` |
| 5. Complete signup | `form-submitted` | `{ formName: 'signup' }` |
| 5b. User created | `user-signed-up` | none |

### Testing Checklist

- [ ] Disable ad blocker
- [ ] Open browser console
- [ ] Check `window.umami` is defined
- [ ] Watch for console warnings
- [ ] Check Network tab for POST to Umami
- [ ] View Umami Realtime dashboard
- [ ] Test in incognito mode
- [ ] Verify environment variables in Vercel

### Additional Resources
See `Docs/ANALYTICS-DEBUG-GUIDE.md` for comprehensive debugging steps.

---

## Files Modified

1. `components/dashboard/DashboardContent.tsx` - Fixed date calculation
2. `lib/analytics.ts` - Enhanced logging for debugging
3. `Docs/ANALYTICS-DEBUG-GUIDE.md` - Created comprehensive debug guide
4. `Docs/BUGS-FIXED-2026-02-02.md` - This document

## Testing Required

### Date Fix
- [x] Create a new snapshot
- [ ] Verify it shows "Today" (not "-1 days ago")
- [ ] Wait 24 hours, verify it shows "Yesterday"
- [ ] Check snapshots from previous days show correct count

### Analytics Fix
- [ ] Open production site with console open
- [ ] Check for `[Umami Not Loaded]` warnings
- [ ] If warnings appear, troubleshoot (ad blocker, env vars, etc.)
- [ ] Perform free user flow
- [ ] Verify events appear in Umami Realtime dashboard
- [ ] Check event data is captured correctly

## Deployment Notes

These fixes are ready to deploy:
- Date fix: Immediate improvement, no side effects
- Analytics logging: Helps identify issues in production

No environment variable changes required.
No database migrations required.

## Next Steps

1. Deploy fixes to production
2. Test dashboard shows "Today" for new snapshots
3. Monitor browser console for Umami warnings
4. Verify analytics events in Umami dashboard
5. If events still don't appear, follow ANALYTICS-DEBUG-GUIDE.md
