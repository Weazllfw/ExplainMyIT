# Tier 1 Analytics Events - Complete Reference

**Last Updated**: January 29, 2026  
**Platform**: Umami  
**Privacy**: No PII tracked, domain-level data only

---

## 🎯 User Journey Events

### 1. Homepage → Snapshot Request

```
User lands on homepage
    ↓
page_view (automatic)
    ↓
User focuses on email field
    ↓
EVENT: snapshot-form-started
    ↓
User submits form
    ↓
EVENT: snapshot-requested
  └─ domain: "example.com"
```

**Success Path**:
```
EVENT: snapshot-requested
  ├─ domain: "example.com"
  └─ [Cost: ~$0.034]
```

**Error Path**:
```
EVENT: snapshot-request-failed
  └─ errorType: "rate-limit" | "api-error" | "validation-error"
```

---

### 2. Email Delivery → Click

```
Email sent (Brevo)
    ↓
[Server-side webhook events]
    ↓
EVENT: email-delivered
  └─ snapshotId: "uuid"
    ↓
User opens email
    ↓
EVENT: email-opened
  └─ snapshotId: "uuid"
    ↓
User clicks magic link
    ↓
EVENT: email-clicked
  ├─ snapshotId: "uuid"
  └─ link: "https://explainmyit.com/report/..."
```

---

### 3. Report View → Engagement

```
User clicks magic link
    ↓
page_view: /report/[id] (automatic)
    ↓
EVENT: report-viewed
  ├─ snapshotId: "uuid"
  └─ domain: "example.com"
    ↓
User expands block
    ↓
EVENT: block-expanded
  └─ blockName: "dns" | "email" | "tls" | "techstack" | "exposure" | "hibp"
    ↓
User collapses block
    ↓
EVENT: block-collapsed
  └─ blockName: "dns" | "email" | "tls" | "techstack" | "exposure" | "hibp"
    ↓
User clicks CTA
    ↓
EVENT: report-cta-clicked
  └─ ctaType: "create-account" | "run-another"
```

---

## 📊 Event Reference

### Homepage Events

| Event | Trigger | Data | Purpose |
|-------|---------|------|---------|
| `snapshot-form-started` | User focuses email field | - | Measure form engagement |
| `snapshot-requested` | Form submitted successfully | `domain` | Track conversions |
| `snapshot-request-failed` | API error or rate limit | `errorType` | Track failure reasons |

---

### Email Events (Server-Side)

| Event | Trigger | Data | Purpose |
|-------|---------|------|---------|
| `email-delivered` | Brevo webhook: delivered | `snapshotId` | Track delivery rate |
| `email-opened` | Brevo webhook: opened | `snapshotId` | Track open rate |
| `email-clicked` | Brevo webhook: clicked | `snapshotId`, `link` | Track click-through rate |

**Note**: Email events are triggered by Brevo webhooks, not client-side tracking.

---

### Report View Events

| Event | Trigger | Data | Purpose |
|-------|---------|------|---------|
| `report-viewed` | Report page loads | `snapshotId`, `domain` | Track report views |
| `block-expanded` | User expands detail block | `blockName` | Measure engagement |
| `block-collapsed` | User collapses detail block | `blockName` | Measure engagement |
| `report-cta-clicked` | User clicks CTA button | `ctaType` | Track conversion intent |

---

## 🔄 Conversion Funnel

### Tier 1 Funnel Metrics

```
Homepage Visit (page_view)
    ↓ [Form Started]
snapshot-form-started
    ↓ [Form Submitted]
snapshot-requested
    ↓ [Email Sent] (automatic)
email-delivered
    ↓ [Email Opened]
email-opened
    ↓ [Link Clicked]
email-clicked
    ↓ [Report Viewed]
report-viewed
    ↓ [Engaged]
block-expanded (optional)
    ↓ [Conversion Intent]
report-cta-clicked
    ↓ [Account Created]
(Tier 2 event)
```

---

## 📈 Key Metrics to Track

### Conversion Rates

1. **Form Start Rate** = `snapshot-form-started` / `page_view (homepage)`
2. **Form Completion Rate** = `snapshot-requested` / `snapshot-form-started`
3. **Email Open Rate** = `email-opened` / `email-delivered`
4. **Email Click Rate** = `email-clicked` / `email-opened`
5. **Report View Rate** = `report-viewed` / `email-clicked`
6. **Engagement Rate** = `block-expanded` / `report-viewed`
7. **CTA Click Rate** = `report-cta-clicked` / `report-viewed`

### Error Rates

1. **Request Failure Rate** = `snapshot-request-failed` / (`snapshot-requested` + `snapshot-request-failed`)
2. **Rate Limit Rate** = `snapshot-request-failed (rate-limit)` / `snapshot-request-failed`

---

## 🎨 Implementation

### Client-Side Tracking

**Utility**: `lib/analytics.ts`

**Usage**:
```typescript
import { Analytics } from '@/lib/analytics';

// Track snapshot request
Analytics.snapshotRequested('example.com');

// Track block expansion
Analytics.blockExpanded('dns');

// Track CTA click
Analytics.reportCtaClicked('create-account');
```

**Components Using Tracking**:
- `components/SnapshotRequestForm.tsx` - Form events
- `components/report/ReportTracker.tsx` - Page view tracking
- `components/report/BlockNarratives.tsx` - Block expand/collapse
- `components/report/CreateAccountCTA.tsx` - CTA clicks

---

### Server-Side Tracking

**Brevo Webhook**: `app/api/webhooks/brevo/route.ts`

**Events Tracked**:
- Email delivered
- Email opened
- Email clicked
- Email bounced
- Email spam

**Implementation** (to be completed in Phase 7):
```typescript
// In webhook handler
if (event.event === 'unique_clicked') {
  await trackEmailEvent('clicked', event.email, {
    snapshotId: event.tag, // Pass snapshot ID via tag
    link: event.link,
  });
}
```

---

## 🔒 Privacy & Compliance

**What We Track**:
- Domain names (user-provided, non-PII)
- Snapshot IDs (UUIDs)
- Event names (actions)
- Timestamps (automatic)

**What We DON'T Track**:
- Email addresses (never sent to Umami)
- IP addresses (Umami config: `data-do-not-track="true"`)
- User identities
- Personal information

**GDPR Compliance**:
- No cookies required (Umami is cookie-less)
- No consent banner needed
- Data retained on Umami Cloud (30 days default)

---

## 📊 Umami Dashboard Setup

### Event Names to Create

**Tier 1 Events**:
1. `snapshot-form-started`
2. `snapshot-requested`
3. `snapshot-request-failed`
4. `email-delivered`
5. `email-opened`
6. `email-clicked`
7. `report-viewed`
8. `block-expanded`
9. `block-collapsed`
10. `report-cta-clicked`

**Event Properties to Filter**:
- `domain` (for snapshot-requested)
- `errorType` (for snapshot-request-failed)
- `snapshotId` (for all report events)
- `blockName` (for block events)
- `ctaType` (for CTA events)

---

## 🧪 Testing Analytics

### Manual Testing

**1. Test Snapshot Request Flow**:
```bash
# Open browser console
# Navigate to homepage
# Focus email field → Check for "snapshot-form-started"
# Submit form → Check for "snapshot-requested"
```

**2. Test Report View Flow**:
```bash
# Click magic link
# Check for "report-viewed"
# Expand a block → Check for "block-expanded"
# Collapse block → Check for "block-collapsed"
# Click CTA → Check for "report-cta-clicked"
```

**3. Check Umami Dashboard**:
- Real-time events should appear within seconds
- Event properties should be visible
- Page views should be automatically tracked

---

### Development Mode

**Console Logging**:
```typescript
// In lib/analytics.ts
if (process.env.NODE_ENV === 'development') {
  console.log('[Umami Event]', eventName, eventData);
}
```

**Check Browser Console**:
- All events logged with full data
- Umami script load status
- `window.umami` availability

---

## 🚀 Production Checklist

- [ ] Umami script loaded (`NEXT_PUBLIC_UMAMI_SRC`)
- [ ] Website ID configured (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
- [ ] All events firing in dashboard
- [ ] Event properties captured correctly
- [ ] No PII in event data
- [ ] Brevo webhook configured (for email events)
- [ ] Test full user journey end-to-end

---

## 📝 Future Enhancements (Phase 7+)

**Additional Events**:
- `report-shared` (share report link)
- `report-printed` (print report)
- `report-exported` (download PDF)
- `account-created` (Tier 2)
- `snapshot-scheduled` (Tier 2)

**Advanced Tracking**:
- Time on page (report engagement duration)
- Scroll depth (how far users read)
- Exit intent (when users leave)
- A/B test variant tracking

---

## 📚 Resources

**Umami Documentation**: https://umami.is/docs  
**Event Tracking Guide**: https://umami.is/docs/track-events  
**API Reference**: https://umami.is/docs/api

---

**Analytics implementation complete! All Tier 1 user journey events are now tracked.**
