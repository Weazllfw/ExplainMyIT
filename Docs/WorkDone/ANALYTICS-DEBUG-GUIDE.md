# Analytics Debug Guide

## Quick Test for Umami Events

### 1. Check if Umami is Loaded

Open browser console on your site and run:

```javascript
// Should return an object with a 'track' function
console.log(window.umami);

// If loaded, you'll see: { track: function() {...} }
// If not loaded, you'll see: undefined
```

### 2. Manually Fire Test Events

```javascript
// Test if events are being sent
window.umami.track('test-event', { source: 'manual-test' });

// Test your actual events
window.umami.track('snapshot-form-started');
window.umami.track('snapshot-requested', { domain: 'test.com' });
window.umami.track('user-signed-up');
```

### 3. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "umami"
3. Perform an action (e.g., focus email field on homepage form)
4. Look for POST requests to Umami

Expected request:
- **URL**: `https://cloud.umami.is/api/send`
- **Method**: POST
- **Payload**: Contains event name and data

### 4. Verify Events in Umami Dashboard

1. Go to https://cloud.umami.is/
2. Login and select your website
3. Click **"Realtime"** tab (shows live events)
4. Perform actions on your site
5. Events should appear within 1-5 seconds

## Common Issues & Fixes

### Issue: `window.umami is undefined`

**Causes:**
- Umami script not loaded
- Script blocked by ad blocker
- Environment variables not set in production

**Fix:**
1. Check browser console for script errors
2. Disable ad blocker temporarily
3. Verify environment variables in Vercel:
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
   - `NEXT_PUBLIC_UMAMI_SRC`

### Issue: Events Not Appearing in Dashboard

**Causes:**
- Wrong website ID
- Events sent but not showing due to Umami delay
- Local storage/cookies blocked

**Fix:**
1. Verify website ID matches: `d7524bc6-f274-48a5-a6a9-26174900bab3`
2. Wait 30-60 seconds and refresh dashboard
3. Check browser allows cookies/storage
4. Try incognito mode to rule out browser extensions

### Issue: Events Work in Dev But Not Production

**Causes:**
- Environment variables not set in production
- Different Umami script source
- CSP (Content Security Policy) blocking script

**Fix:**
1. Check Vercel environment variables
2. Verify production build includes script
3. Check browser console for CSP errors

## Debug Mode

Add this to browser console to log all analytics calls:

```javascript
// Wrap the track function to log all events
if (window.umami) {
  const originalTrack = window.umami.track;
  window.umami.track = function(name, data) {
    console.log('📊 Analytics Event:', name, data);
    return originalTrack.call(this, name, data);
  };
  console.log('✅ Analytics debug mode enabled');
} else {
  console.error('❌ Umami not loaded');
}
```

Then perform actions and watch console for event logs.

## Test the Free User Flow

### Expected Events

1. **Homepage** - User focuses email input
   ```javascript
   snapshotFormStarted() → 'snapshot-form-started'
   ```

2. **Submit Form** - User requests snapshot
   ```javascript
   snapshotRequested(domain) → 'snapshot-requested' with { domain: 'test.com' }
   ```

3. **Success State** - User clicks "Create Free Account"
   ```javascript
   snapshotSuccessCtaClicked('create-account') → 'snapshot-success-cta-clicked' with { ctaType: 'create-account' }
   ```

4. **Signup Page** - User starts filling form
   ```javascript
   formStarted('signup') → 'form-started' with { formName: 'signup' }
   ```

5. **Signup Submit** - User completes signup
   ```javascript
   formSubmitted('signup') → 'form-submitted' with { formName: 'signup' }
   userSignedUp() → 'user-signed-up'
   ```

### Manual Test Script

```javascript
// Copy-paste this into console to test all events
const testFlow = () => {
  console.log('🧪 Testing free user flow...');
  
  // 1. Form started
  window.umami.track('snapshot-form-started');
  console.log('✓ Snapshot form started');
  
  // 2. Snapshot requested
  setTimeout(() => {
    window.umami.track('snapshot-requested', { domain: 'test.com' });
    console.log('✓ Snapshot requested');
  }, 1000);
  
  // 3. CTA clicked
  setTimeout(() => {
    window.umami.track('snapshot-success-cta-clicked', { ctaType: 'create-account' });
    console.log('✓ Create account CTA clicked');
  }, 2000);
  
  // 4. Signup started
  setTimeout(() => {
    window.umami.track('form-started', { formName: 'signup' });
    console.log('✓ Signup form started');
  }, 3000);
  
  // 5. Signup completed
  setTimeout(() => {
    window.umami.track('form-submitted', { formName: 'signup' });
    window.umami.track('user-signed-up');
    console.log('✓ Signup completed');
    console.log('🎉 All test events fired! Check Umami dashboard.');
  }, 4000);
};

testFlow();
```

## Verification Checklist

- [ ] Umami script loads (check `window.umami`)
- [ ] No console errors related to analytics
- [ ] Network requests show POST to Umami
- [ ] Events appear in Realtime dashboard
- [ ] Event names match expected format (kebab-case)
- [ ] Event properties are captured correctly
- [ ] Events work in both dev and production

## Environment Variables

### Development (.env.local)
```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=d7524bc6-f274-48a5-a6a9-26174900bab3
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
```

### Production (Vercel)
Set the same variables in Vercel dashboard under:
Project Settings → Environment Variables

## Support

If events still don't work after following this guide:
1. Check Umami service status: https://status.umami.is/
2. Review Umami docs: https://umami.is/docs/
3. Check browser console for any errors
4. Try different browser/incognito mode
5. Verify website ID is correct in Umami dashboard
