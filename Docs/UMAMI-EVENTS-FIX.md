# Umami Custom Events Not Working - Fix

## Problem

Only "Viewed page" events appear in Umami dashboard. Custom events like:
- `snapshot-form-started`
- `snapshot-requested`
- `user-signed-up`

...are not appearing.

## Root Cause

Umami Cloud's default script tracks page views automatically, but **custom events require explicit configuration**.

The issue is that `window.umami.track()` exists but events aren't being sent to the server properly.

## Solutions

### Fix #1: Change Script Loading (Applied)

Changed from `defer` to `async` to ensure script loads earlier:

```typescript
// Before
<script
  defer
  src={umamiSrc}
  data-website-id={umamiWebsiteId}
/>

// After
<script
  async
  src={umamiSrc}
  data-website-id={umamiWebsiteId}
  data-domains="explainmyit.com"
/>
```

### Fix #2: Verify Umami Configuration

1. Go to https://cloud.umami.is/
2. Login and select your website
3. Go to **Settings** → **Website Settings**
4. Ensure **"Enable events"** is turned ON

### Fix #3: Test Events Manually

Open browser console on production and test:

```javascript
// Check if Umami loaded
console.log(window.umami);
// Should show: { track: function() {...} }

// Fire a test event
window.umami.track('test-event', { source: 'manual' });

// Wait 5 seconds, then check Umami Realtime dashboard
```

### Fix #4: Alternative - Use Umami v1 Script

If custom events still don't work, you can use the v1 script which has different event tracking:

```typescript
// In layout.tsx, change script to:
<script
  async
  src="https://analytics.umami.is/script.js"
  data-website-id={umamiWebsiteId}
/>
```

Then update your tracking code to use:

```typescript
// Old way (v2)
window.umami.track(eventName, eventData);

// New way (v1 compatibility)
if (window.umami) {
  window.umami(eventName);
}
```

## Testing After Fix

1. **Deploy the changes**
2. **Clear browser cache** or test in incognito
3. **Open browser console** on production
4. **Paste this test**:

```javascript
// Test all event types
const events = [
  'snapshot-form-started',
  'snapshot-requested',
  'form-started',
  'user-signed-up'
];

events.forEach((event, i) => {
  setTimeout(() => {
    window.umami.track(event, { test: true });
    console.log(`✓ Fired: ${event}`);
  }, i * 1000);
});

console.log('Check Umami Realtime dashboard in 5 seconds...');
```

5. **Check Umami Realtime dashboard**
   - Go to https://cloud.umami.is/
   - Click **"Realtime"** tab
   - Events should appear within 5 seconds

## Expected Results

After fix, you should see custom events in the **Events** filter:

```
✓ Viewed page (automatic)
✓ snapshot-form-started (custom)
✓ snapshot-requested (custom)
✓ snapshot-success-cta-clicked (custom)
✓ form-started (custom)
✓ user-signed-up (custom)
```

## If Events Still Don't Work

### Check Umami Settings

1. Login to https://cloud.umami.is/
2. Go to Settings → Websites
3. Click on your website
4. Verify:
   - Domain is correct: `explainmyit.com`
   - "Enable events" is ON
   - No filters blocking custom events

### Check Browser Console

Look for errors like:
- `umami is not defined`
- CORS errors to `cloud.umami.is`
- 403 or 404 errors in Network tab

### Alternative: Use Umami v2 Event Tracking

If the issue persists, you may need to update your event tracking code to use Umami v2's newer API:

```typescript
// Current implementation
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  if (window.umami && window.umami.track) {
    window.umami.track(eventName, eventData);
  }
}

// Alternative v2 implementation
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  // Try v2 method first
  if (window.umami?.track) {
    window.umami.track(eventName, eventData);
  }
  // Fallback to v1 method
  else if (window.umami) {
    window.umami(eventName);
  }
}
```

## Contact Umami Support

If nothing works:
1. Check Umami status: https://status.umami.is/
2. Umami Discord: https://discord.gg/4dz4zcXYrQ
3. Umami GitHub: https://github.com/umami-software/umami

Provide them with:
- Website ID: `d7524bc6-f274-48a5-a6a9-26174900bab3`
- Issue: Custom events not appearing
- Script URL: `https://cloud.umami.is/script.js`
- Browser console screenshot showing `window.umami`
