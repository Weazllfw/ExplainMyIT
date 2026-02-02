# Umami Analytics - Source of Truth

## Overview

Explain My IT uses **Umami Cloud** for privacy-friendly analytics. Umami tracks:
- Page views (automatic)
- Custom events (manual tracking)
- User sessions
- Geographic data

**Umami Cloud Dashboard**: https://cloud.umami.is/

## Configuration

### Environment Variables

Required in both development (`.env.local`) and production (Vercel):

```bash
NEXT_PUBLIC_UMAMI_WEBSITE_ID=d7524bc6-f274-48a5-a6a9-26174900bab3
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
```

### Script Integration

Located in: `app/layout.tsx`

```typescript
{umamiSrc && umamiWebsiteId && (
  <script
    async
    src={umamiSrc}
    data-website-id={umamiWebsiteId}
    data-host-url="https://cloud.umami.is"
  />
)}
```

#### Critical Configuration Notes

✅ **DO USE**:
- `async` attribute (loads script early)
- `data-host-url="https://cloud.umami.is"` (required for events to work)

❌ **DO NOT USE**:
- `defer` attribute (causes timing issues with events)
- `data-domains` attribute (blocks custom events from being recorded)

**Why**: Umami Cloud v2 has a known issue where `data-domains` restricts event tracking while still allowing page views. This causes events to be silently dropped.

## Event Tracking

### Implementation

All event tracking is centralized in: `lib/analytics.ts`

```typescript
import { Analytics } from '@/lib/analytics';

// Basic event
Analytics.snapshotFormStarted();

// Event with data
Analytics.snapshotRequested('example.com');
Analytics.checkoutInitiated('Basic', 'monthly');
```

### Event Naming Convention

- **Format**: `kebab-case` (lowercase with hyphens)
- **Structure**: `{action}-{object}` or `{object}-{action}`
- **Examples**:
  - `snapshot-form-started`
  - `user-signed-up`
  - `checkout-initiated`
  - `dashboard-viewed`

### Event Data Limits

- **Event names**: 50 character maximum
- **Event data**: Simple key-value pairs only
- **No event data**: If you only need to track that something happened

## Available Events

### Snapshot Flow
```typescript
Analytics.snapshotFormStarted()                // User focuses email field
Analytics.snapshotRequested(domain)            // Form submitted
Analytics.snapshotRequestFailed(errorType)     // Submission failed
Analytics.snapshotSuccessCtaClicked(ctaType)   // User clicks CTA in success state
```

### Authentication
```typescript
Analytics.userSignedUp()      // New account created
Analytics.userLoggedIn()      // User logged in
Analytics.userLoggedOut()     // User logged out
Analytics.formStarted(name)   // Auth form interaction started
Analytics.formSubmitted(name) // Auth form submitted
Analytics.formError(name, errorType) // Form error occurred
```

### Dashboard
```typescript
Analytics.dashboardViewed()                    // Dashboard page loaded
Analytics.dashboardCtaClicked(ctaType)         // Dashboard action clicked
Analytics.reportViewed(snapshotId, domain)     // Report viewed
Analytics.reportCtaClicked(ctaType)            // Report action clicked
```

### Conversion & Engagement
```typescript
Analytics.conversionCtaClicked(location)       // CTA clicked
Analytics.emailOptInChecked(source)            // Email opt-in checked
Analytics.emailOptInSubmitted(source, domain)  // Email opt-in submitted
Analytics.headerCtaClicked(ctaType)            // Header navigation clicked
Analytics.pricingCtaClicked(ctaType)           // Pricing page action
```

### Checkout (Future - Stripe Integration)
```typescript
Analytics.checkoutInitiated(plan, interval)    // Checkout started
Analytics.checkoutRedirecting(plan, interval)  // Redirecting to Stripe
Analytics.checkoutFailed(plan, reason)         // Checkout error
```

## Viewing Analytics

### Dashboard Access

1. **Login**: https://cloud.umami.is/
2. **Select Website**: "explainmyit"
3. **Main Views**:
   - **Dashboard**: Overview metrics (Views, Visitors, Events count, Countries)
   - **Realtime**: Live activity (events appear within 1-5 seconds)
   - **Events**: List of all custom events with counts
   - **Sessions**: Individual user sessions
   - **Properties**: Event data breakdown

### Finding Custom Events

**IMPORTANT**: Custom events do NOT appear in the Activity section's "Events" filter.

To view custom events:
1. Click **"Events"** in the main navigation (not the Activity filter)
2. You'll see a list of all your custom event names
3. Click any event name to see its properties and data

### Event Processing Delay

- **Realtime tab**: 1-5 seconds
- **Events tab**: 1-3 minutes
- **Dashboard metrics**: 2-5 minutes

## Testing

### Quick Console Test

On any page with Umami loaded:

```javascript
// 1. Verify Umami is loaded
console.log('Umami loaded:', !!window.umami);
console.log('Has track method:', !!window.umami?.track);

// 2. Fire test event
window.umami.track('test-event', { source: 'console', timestamp: Date.now() });

// 3. Check Umami Realtime dashboard within 5 seconds
```

### Test Page

A dedicated test page is available at: `/test-analytics.html`

Access at: https://explainmyit.com/test-analytics.html

Features:
- Check Umami status
- Fire single or multiple test events
- Simulate complete user flows
- Debug event tracking issues

## Troubleshooting

### Events Not Appearing

**Symptoms**: Console shows events firing, but Umami dashboard shows 0 events.

**Common Causes**:
1. ❌ Using `data-domains` attribute (blocks events)
2. ❌ Missing `data-host-url` attribute
3. ❌ Ad blocker blocking Umami script
4. ❌ Looking in wrong place (Activity filter instead of Events page)
5. ❌ Waiting < 2 minutes for processing

**Solution**:
1. Verify script config matches documentation above
2. Check browser console for warnings
3. Disable ad blocker and test in incognito
4. Navigate to Events page (not Activity filter)
5. Wait 2-3 minutes after firing events

### Script Not Loading

**Check**:
```javascript
console.log('Script present:', !!document.querySelector('script[data-website-id]'));
console.log('Umami object:', window.umami);
```

**Solutions**:
- Verify environment variables are set in Vercel
- Check Network tab for blocked requests
- Disable ad blockers
- Clear browser cache

### Events Firing But Data Missing

**Cause**: Event data must be simple key-value pairs.

**Invalid**:
```javascript
Analytics.track('event', {
  user: { name: 'John', email: '[email protected]' } // ❌ Nested objects
});
```

**Valid**:
```javascript
Analytics.track('event', {
  userName: 'John',
  userEmail: '[email protected]' // ✅ Flat structure
});
```

## Development vs Production

### Development
- Events logged to console: `📊 [Umami Event] event-name`
- Helps debug event firing
- All events tracked normally

### Production
- Events logged to console (for debugging)
- Full analytics tracking enabled
- Same configuration as development

## Security & Privacy

### What Umami Tracks
✅ Page views
✅ Custom events
✅ Geographic location (country level)
✅ Browser/device type
✅ Session duration

### What Umami Does NOT Track
❌ Personal information
❌ IP addresses (anonymized)
❌ Cookies (cookieless tracking)
❌ Cross-site tracking

### GDPR Compliance
- No cookies required
- No personal data collected
- User-friendly privacy policy
- Can be used without consent banners

## Maintenance

### Regular Checks
- Monitor event counts weekly
- Check for errors in browser console
- Verify critical events are firing
- Review event data quality

### When to Update
- New features requiring tracking
- Event naming convention changes
- Migration to self-hosted Umami
- Umami API version updates

### Event Naming Standards
When adding new events:
1. Follow kebab-case convention
2. Keep names under 50 characters
3. Use descriptive, action-based names
4. Document in `lib/analytics.ts`
5. Add to this document's event list

## Migration Notes

### From Google Analytics
Umami is simpler and more privacy-focused:
- No cookies
- No PII tracking
- Faster page loads
- Better privacy compliance

### To Self-Hosted Umami
If moving from Umami Cloud to self-hosted:
1. Update `NEXT_PUBLIC_UMAMI_SRC` to your domain
2. Update `data-host-url` to your API endpoint
3. Keep same website ID
4. Test thoroughly before switching

## Support Resources

- **Umami Documentation**: https://umami.is/docs
- **Track Events Guide**: https://umami.is/docs/track-events
- **Umami Discord**: https://discord.gg/4dz4zcXYrQ
- **GitHub Issues**: https://github.com/umami-software/umami/issues
- **Status Page**: https://status.umami.is/

## Quick Reference

### File Locations
```
app/layout.tsx                  - Script integration
lib/analytics.ts               - Event tracking functions
lib/analytics/umami-events.ts  - (deprecated, use lib/analytics.ts)
public/test-analytics.html     - Testing page
Docs/UMAMI-EVENTS-RESEARCH.md  - Troubleshooting guide
```

### Key URLs
- Dashboard: https://cloud.umami.is/
- Website ID: `d7524bc6-f274-48a5-a6a9-26174900bab3`
- Test Page: https://explainmyit.com/test-analytics.html

### Quick Commands
```javascript
// Check status
window.umami

// Fire event
window.umami.track('event-name', { key: 'value' })

// Check script
document.querySelector('script[data-website-id]')
```

---

**Last Updated**: February 2, 2026
**Status**: ✅ Working - Events tracking successfully
**Owner**: Robert Marshall
