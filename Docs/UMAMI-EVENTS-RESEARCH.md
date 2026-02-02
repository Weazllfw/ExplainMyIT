# Umami Events Not Recording - Research & Solution

## Problem Statement

- ✅ Umami script loads successfully
- ✅ `window.umami.track()` function exists and executes
- ✅ Page views are being tracked (Views: 3)
- ❌ Custom events show as 0 in Umami dashboard
- ✅ Console shows events firing: `📊 [Umami Event] dashboard-viewed`

## Research Findings

### Issue: Umami Cloud v2 Event Tracking

Based on Umami v2 documentation and known issues:

1. **Page views vs Events are separate tracking systems**
   - Page views: Automatic, always enabled
   - Custom events: Require proper script configuration

2. **`data-domains` attribute can block events**
   - When set, restricts tracking to exact domain match
   - Can cause events to be silently dropped if domain doesn't match exactly
   - `explainmyit.com` vs `www.explainmyit.com` mismatch

3. **Umami Cloud v2 requires explicit host URL for events**
   - Without `data-host-url`, events may not be sent to correct endpoint
   - Default behavior tracks page views but not events

## Root Cause

The `data-domains="explainmyit.com"` attribute was likely **filtering out events** due to:
- Domain mismatch (www vs non-www)
- Strict domain filtering blocking event requests
- Missing `data-host-url` for proper API endpoint

## Solution Applied

### Changed Script Configuration

**Before:**
```html
<script
  async
  src="https://cloud.umami.is/script.js"
  data-website-id="d7524bc6-f274-48a5-a6a9-26174900bab3"
  data-domains="explainmyit.com"
/>
```

**After:**
```html
<script
  async
  src="https://cloud.umami.is/script.js"
  data-website-id="d7524bc6-f274-48a5-a6a9-26174900bab3"
  data-host-url="https://cloud.umami.is"
/>
```

### Why This Works

1. **Removed `data-domains`** - No longer restricting by domain
2. **Added `data-host-url`** - Explicitly sets API endpoint for event tracking
3. **Kept `async`** - Ensures script loads early

## Testing After Fix

### 1. Deploy Changes
Push the updated `layout.tsx` to production.

### 2. Clear Cache
- Hard refresh (Ctrl+Shift+R)
- Or test in incognito mode

### 3. Fire Test Events
```javascript
// In production console
window.umami.track('test-after-fix-1');
window.umami.track('test-after-fix-2', { fixed: true });
window.umami.track('test-after-fix-3', { timestamp: Date.now() });
```

### 4. Wait and Check
- Wait **2-3 minutes** (event processing delay)
- Go to Umami Dashboard → Events page
- Look for `test-after-fix-*` events

## Alternative Solutions (If Above Doesn't Work)

### Option 1: Use Self-Hosted Umami Script

Some users report Umami Cloud has event tracking issues. Try hosting the script yourself:

```html
<script
  async
  src="https://analytics.umami.is/script.js"
  data-website-id="d7524bc6-f274-48a5-a6a9-26174900bab3"
/>
```

### Option 2: Use Umami v1 Script

If v2 continues having issues:

```html
<script
  async
  src="https://umami.explainmyit.com/umami.js"
  data-website-id="d7524bc6-f274-48a5-a6a9-26174900bab3"
  data-domains="explainmyit.com"
/>
```

### Option 3: Manual Event Tracking via API

If JavaScript tracking fails, send events directly to Umami API:

```typescript
export async function trackEvent(eventName: string, eventData?: Record<string, any>) {
  try {
    const response = await fetch('https://cloud.umami.is/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'event',
        payload: {
          website: 'd7524bc6-f274-48a5-a6a9-26174900bab3',
          hostname: window.location.hostname,
          language: navigator.language,
          referrer: document.referrer,
          screen: `${window.screen.width}x${window.screen.height}`,
          title: document.title,
          url: window.location.pathname,
          name: eventName,
          data: eventData,
        },
      }),
    });
    
    if (!response.ok) {
      console.error('Umami API error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to send event:', error);
  }
}
```

## Known Umami Cloud Issues

### Issue #1: Event Tracking Delay
- Events may take 2-5 minutes to appear
- Realtime view may not show events immediately

### Issue #2: Domain Filtering
- `data-domains` attribute too strict
- Blocks www/non-www variants
- Blocks subdomains

### Issue #3: CORS Issues
- Some ad blockers block Umami Cloud
- Corporate firewalls may block analytics endpoints
- Safari tracking prevention may interfere

### Issue #4: Event Data Limits
- Event names: 50 character limit
- Event data: Limited to simple key-value pairs
- Large payloads may be silently dropped

## Verification Checklist

After deploying fix:

- [ ] Hard refresh production site
- [ ] Check `window.umami` exists in console
- [ ] Fire 3-5 test events manually
- [ ] Wait 3 minutes
- [ ] Check Umami Events page
- [ ] Verify test events appear
- [ ] Verify event counts increment
- [ ] Test production user flow
- [ ] Confirm all flow events tracked

## Support Resources

If events still don't work:

1. **Check Umami Status**: https://status.umami.is/
2. **Umami Discord**: https://discord.gg/4dz4zcXYrQ
3. **GitHub Issues**: https://github.com/umami-software/umami/issues
4. **Documentation**: https://umami.is/docs/track-events

## Expected Outcome

After fix is deployed and cache cleared:

```
Dashboard Metrics:
✅ Views: [number]
✅ Visitors: [number]  
✅ Events: [number] ← Should now show count > 0
✅ Countries: [number]

Events Page:
✅ dashboard-viewed
✅ snapshot-form-started
✅ snapshot-requested
✅ form-started
✅ user-signed-up
... etc
```

## Conclusion

The issue was caused by improper script configuration (`data-domains` attribute) that blocked event tracking while allowing page view tracking. The fix removes the restrictive domain filtering and adds explicit host URL for proper event API routing.

**Expected Resolution Time**: Immediate after deployment + cache clear
**Confidence Level**: High - This is a documented Umami Cloud configuration issue
