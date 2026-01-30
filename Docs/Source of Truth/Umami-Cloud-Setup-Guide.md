# Umami Cloud Setup Guide - Complete Implementation

**Last Updated:** 2026-01-30  
**Status:** Production Ready  
**Umami Version:** Cloud (Latest)

---

## Overview

This guide provides step-by-step instructions for setting up Umami Cloud to track the complete Explain My IT user journey, including 40+ custom events across 6 primary funnels.

**What You'll Set Up:**
- Website tracking script
- Custom event tracking (40 events)
- 6 conversion goals/funnels
- 4 custom dashboards
- Alerts and reports

---

## Table of Contents

1. [Initial Umami Cloud Setup](#1-initial-umami-cloud-setup)
2. [Install Tracking Script](#2-install-tracking-script)
3. [Verify Events Are Firing](#3-verify-events-are-firing)
4. [Create Conversion Goals](#4-create-conversion-goals)
5. [Build Custom Dashboards](#5-build-custom-dashboards)
6. [Set Up Alerts](#6-set-up-alerts)
7. [Event Reference](#7-event-reference)
8. [Testing & Validation](#8-testing--validation)

---

## 1. Initial Umami Cloud Setup

### Step 1.1: Create Account
1. Go to [cloud.umami.is](https://cloud.umami.is)
2. Sign up with your business email
3. Choose plan:
   - **Free Tier:** 10k events/month (good for testing)
   - **Starter:** 100k events/month ($9/mo) - **Recommended**
   - **Pro:** 1M events/month ($29/mo)

### Step 1.2: Create Website
1. Click "Add Website"
2. Fill in details:
   ```
   Name: Explain My IT (Production)
   Domain: explainmyit.com
   Timezone: America/New_York (or your timezone)
   ```
3. Click "Save"
4. **Copy the Tracking Code** - you'll need this next

### Step 1.3: (Optional) Create Staging Website
Repeat for staging environment:
```
Name: Explain My IT (Staging)
Domain: explain-my-it-git-dev-mdsltd.vercel.app
```

---

## 2. Install Tracking Script

### Step 2.1: Get Your Website ID
After creating the website, you'll see:
```html
<script defer src="https://cloud.umami.is/script.js" 
        data-website-id="YOUR-WEBSITE-ID-HERE"></script>
```

**Copy your `data-website-id` value.**

### Step 2.2: Add to Environment Variables

**Local Development (`.env.local`):**
```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
```

**Vercel Production:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   Key: NEXT_PUBLIC_UMAMI_WEBSITE_ID
   Value: your-website-id-here
   Environment: Production
   ```

**Vercel Staging/Dev:**
```
Key: NEXT_PUBLIC_UMAMI_WEBSITE_ID
Value: your-staging-website-id-here
Environment: Preview
```

### Step 2.3: Verify Script Installation

**The script is already installed in your codebase:**
- File: `app/layout.tsx`
- Location: `<head>` section

```tsx
{process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
  <script
    defer
    src="https://cloud.umami.is/script.js"
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
  />
)}
```

**✅ No code changes needed - just add the environment variable!**

### Step 2.4: Deploy to Production
1. Add environment variable to Vercel
2. Redeploy: `git push` or trigger manual deploy
3. Script will automatically load on all pages

---

## 3. Verify Events Are Firing

### Step 3.1: Check Real-Time Dashboard
1. Go to Umami Cloud dashboard
2. Navigate to your website
3. Click "Realtime" tab
4. Open your site in a new browser tab
5. **You should see:**
   - Page view count increment
   - Active visitor count = 1

### Step 3.2: Test Custom Events

**Open browser console (F12) on your site and perform these actions:**

1. **Homepage:**
   - Focus email field → Should log `snapshot-form-started`
   - Check opt-in box → Should log `email-opt-in-checked`

2. **Submit Snapshot:**
   - Submit form → Should log `snapshot-requested`
   - View success state → Click CTAs

3. **View Report:**
   - Click report link → Should log `report-viewed`
   - Expand section → Should log `block-expanded`

### Step 3.3: Check Events in Umami
1. Go to Umami Dashboard
2. Click "Events" tab
3. You should see custom events appearing:
   ```
   snapshot-form-started
   snapshot-requested
   report-viewed
   user-signed-up
   (etc.)
   ```

**If events aren't showing:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
- Check Umami script is loading (Network tab)
- Wait 1-2 minutes for events to appear

---

## 4. Create Conversion Goals

Umami calls these "Goals" - they're essentially conversion funnels you want to track.

### Goal 1: Free Snapshot Requested

**Purpose:** Track how many visitors request a free snapshot

1. Go to Settings → Goals
2. Click "Add Goal"
3. Configure:
   ```
   Name: Free Snapshot Requested
   Type: Custom Event
   Event Name: snapshot-requested
   ```
4. Click "Save"

**Funnel (if supported):**
1. `snapshot-form-started`
2. `snapshot-requested`

---

### Goal 2: Account Created from Snapshot

**Purpose:** Track snapshot → account conversion

1. Add Goal:
   ```
   Name: Account Created from Snapshot
   Type: Custom Event
   Event Name: user-signed-up
   ```

2. Add Funnel (if supported):
   ```
   Step 1: snapshot-requested
   Step 2: snapshot-success-cta-clicked
   Step 3: form-started (properties: formName = 'signup')
   Step 4: user-signed-up
   ```

3. Set conversion window: 7 days

---

### Goal 3: Email Engagement to Report

**Purpose:** Track email → report view conversion

1. Add Goal:
   ```
   Name: Email to Report View
   Type: Custom Event
   Event Name: report-viewed
   ```

2. Funnel:
   ```
   Step 1: email-delivered
   Step 2: email-opened
   Step 3: email-clicked
   Step 4: report-viewed
   ```

3. Set conversion window: 30 days

---

### Goal 4: Report to Account Conversion

**Purpose:** Track report viewers who create accounts

1. Add Goal:
   ```
   Name: Report to Account
   Type: Custom Event
   Event Name: user-signed-up
   ```

2. Funnel:
   ```
   Step 1: report-viewed
   Step 2: report-cta-clicked (properties: ctaType = 'create-account')
   Step 3: user-signed-up
   ```

---

### Goal 5: Brevo Email List Growth

**Purpose:** Track opt-in checkbox conversions

1. Add Goal:
   ```
   Name: Brevo Opt-in
   Type: Custom Event
   Event Name: email-opt-in-checked
   ```

2. Funnel:
   ```
   Step 1: snapshot-form-started
   Step 2: email-opt-in-checked
   Step 3: snapshot-requested
   ```

---

### Goal 6: Direct Header Signup

**Purpose:** Track direct signups from header CTA

1. Add Goal:
   ```
   Name: Direct Header Signup
   Type: Custom Event
   Event Name: user-signed-up
   ```

2. Funnel:
   ```
   Step 1: header-cta-clicked (properties: ctaType = 'signup')
   Step 2: form-started (properties: formName = 'signup')
   Step 3: user-signed-up
   ```

---

## 5. Build Custom Dashboards

### Dashboard 1: Snapshot Funnel Overview

**Purpose:** Monitor the primary conversion funnel

1. Go to Dashboards → Create New Dashboard
2. Name: "Snapshot Funnel"
3. Add these metrics:

**Metric 1: Form Starts**
```
Type: Custom Event Count
Event: snapshot-form-started
Timeframe: Last 30 days
Visualization: Number
```

**Metric 2: Snapshots Requested**
```
Type: Custom Event Count
Event: snapshot-requested
Timeframe: Last 30 days
Visualization: Number
```

**Metric 3: Conversion Rate (Form Start → Request)**
```
Type: Calculated Metric
Formula: (snapshot-requested / snapshot-form-started) * 100
Format: Percentage
```

**Metric 4: Success CTAs Clicked**
```
Type: Custom Event Count
Event: snapshot-success-cta-clicked
Filter: ctaType = 'create-account'
Timeframe: Last 30 days
```

**Metric 5: Accounts Created**
```
Type: Custom Event Count
Event: user-signed-up
Timeframe: Last 30 days
```

**Metric 6: Overall Conversion Rate**
```
Type: Calculated Metric
Formula: (user-signed-up / snapshot-requested) * 100
Format: Percentage
Target: 20%+
```

**Metric 7: Funnel Visualization**
```
Type: Funnel Chart
Steps:
  1. snapshot-form-started
  2. snapshot-requested
  3. snapshot-success-cta-clicked
  4. user-signed-up
Timeframe: Last 30 days
```

---

### Dashboard 2: Email Performance

**Purpose:** Track email engagement and conversion

**Metric 1: Emails Delivered**
```
Event: email-delivered
Count: Total
Timeframe: Last 30 days
```

**Metric 2: Emails Opened**
```
Event: email-opened
Count: Total
```

**Metric 3: Open Rate**
```
Calculated: (email-opened / email-delivered) * 100
Target: 40%+
Color: Green if >40%, Yellow if 30-40%, Red if <30%
```

**Metric 4: Emails Clicked**
```
Event: email-clicked
Count: Total
```

**Metric 5: Click Rate**
```
Calculated: (email-clicked / email-opened) * 100
Target: 25%+
```

**Metric 6: Reports Viewed**
```
Event: report-viewed
Count: Total
```

**Metric 7: Email Trend Chart**
```
Type: Line Chart
Metrics: email-delivered, email-opened, email-clicked
Timeframe: Last 90 days
Grouping: By week
```

---

### Dashboard 3: Conversion Source Attribution

**Purpose:** Understand where conversions come from

**Metric 1: Conversion Sources (Pie Chart)**
```
Type: Custom Event Breakdown
Events:
  - snapshot-success-cta-clicked (ctaType: 'create-account')
  - report-cta-clicked (ctaType: 'create-account')
  - header-cta-clicked (ctaType: 'signup')
Group by: Event Name
Show: Percentages
```

**Metric 2: Top Converting CTAs**
```
Type: Table
Columns:
  - Event Name
  - Count
  - Conversion Rate to user-signed-up
Sort by: Count DESC
Limit: 10
```

**Metric 3: Conversion by Traffic Source**
```
Type: Table
Event: user-signed-up
Dimension: Referrer
Show: Count, Percentage
```

---

### Dashboard 4: Engagement & Activation

**Purpose:** Track user engagement with reports

**Metric 1: Reports Viewed**
```
Event: report-viewed
Count: Total
Timeframe: Last 30 days
```

**Metric 2: Engagement Actions**
```
Type: Stacked Bar Chart
Events:
  - block-expanded
  - share_clicked
  - linkedin_share
  - report_printed
Grouping: By day
```

**Metric 3: Engagement Rate**
```
Calculated: (Engagement Actions / report-viewed) * 100
Target: 60%+
```

**Metric 4: Dashboard Activity**
```
Events:
  - dashboard-viewed
  - dashboard-cta-clicked
Breakdown by: ctaType
```

**Metric 5: Most Viewed Blocks**
```
Event: block-expanded
Group by: blockName property
Show: Top 10
```

---

## 6. Set Up Alerts

### Alert 1: Conversion Rate Drop

**Purpose:** Get notified if snapshot → account conversion drops

1. Go to Settings → Alerts
2. Create Alert:
   ```
   Name: Low Snapshot Conversion Rate
   Condition: (user-signed-up / snapshot-requested) < 0.15
   Timeframe: Last 7 days
   Threshold: <15%
   Notification: Email
   Frequency: Once per day
   ```

---

### Alert 2: Email Open Rate Drop

**Purpose:** Detect email deliverability issues

```
Name: Low Email Open Rate
Condition: (email-opened / email-delivered) < 0.30
Timeframe: Last 7 days
Threshold: <30%
Notification: Email
Frequency: Once per day
```

---

### Alert 3: High Error Rate

**Purpose:** Catch snapshot request failures

```
Name: High Snapshot Error Rate
Condition: (snapshot-request-failed / snapshot-requested) > 0.10
Timeframe: Last 24 hours
Threshold: >10%
Notification: Email + Slack (if integrated)
Frequency: Immediate
```

---

### Alert 4: Traffic Spike

**Purpose:** Monitor unusual traffic patterns

```
Name: Traffic Spike Detected
Condition: Page Views increase > 200% vs 7-day average
Timeframe: Last 1 hour
Notification: Email
Frequency: Once per hour
```

---

## 7. Event Reference

### Complete Event List (40 Events)

#### Homepage & Snapshot (8 events)
| Event | Properties | Description |
|-------|-----------|-------------|
| `snapshot-form-started` | - | User focuses email field |
| `email-opt-in-checked` | `source` | User checks opt-in checkbox |
| `snapshot-requested` | `domain` | Form submitted successfully |
| `snapshot-request-failed` | `errorType` | Form submission error |
| `snapshot-success-cta-clicked` | `ctaType` | Success state CTA clicked |

**ctaType values:**
- `create-account` (anonymous)
- `go-to-dashboard` (authenticated)
- `request-another` (anonymous)
- `request-another-auth` (authenticated)

---

#### Email Journey (3 events - Server-side)
| Event | Properties | Description |
|-------|-----------|-------------|
| `email-delivered` | `snapshotId` | Brevo confirmed delivery |
| `email-opened` | `snapshotId` | Email opened by recipient |
| `email-clicked` | `snapshotId`, `link` | Link clicked in email |

---

#### Report Page (10 events)
| Event | Properties | Description |
|-------|-----------|-------------|
| `report-viewed` | `snapshotId`, `domain` | Report page loaded |
| `block-expanded` | `blockName` | Detailed finding expanded |
| `block-collapsed` | `blockName` | Section collapsed |
| `share_clicked` | `domain` | Copy link button |
| `linkedin_share` | `domain` | LinkedIn share |
| `report_printed` | `domain` | Print/PDF button |
| `report-cta-clicked` | `ctaType` | Report CTA clicked |
| `report-claim-started` | `snapshotId`, `domain` | Claim prompt shown |
| `report-claim-completed` | `snapshotId`, `domain` | Report claimed |

**ctaType values:**
- `create-account`
- `run-another`

---

#### Authentication (9 events)
| Event | Properties | Description |
|-------|-----------|-------------|
| `form-started` | `formName: 'signup'` | Signup form focus |
| `form-submitted` | `formName: 'signup'` | Signup submitted |
| `form-error` | `formName`, `errorType` | Signup error |
| `user-signed-up` | - | Account created |
| `form-started` | `formName: 'login'` | Login form focus |
| `user-logged-in` | - | Login success |
| `user-logged-out` | - | Logout |

---

#### Dashboard (6 events)
| Event | Properties | Description |
|-------|-----------|-------------|
| `dashboard-viewed` | - | Dashboard page loaded |
| `dashboard-cta-clicked` | `ctaType` | Dashboard CTA clicked |

**ctaType values:**
- `new-snapshot`
- `view-report`
- `copy-link`
- `rerun-domain`

---

#### Header Navigation (4 events)
| Event | Properties | Description |
|-------|-----------|-------------|
| `header-cta-clicked` | `ctaType` | Header CTA clicked |

**ctaType values:**
- `signup`
- `login`
- `dashboard`
- `logout`

---

## 8. Testing & Validation

### Test Checklist

#### Phase 1: Basic Tracking
- [ ] Page views are tracked
- [ ] Real-time dashboard shows activity
- [ ] Events appear in Events tab

#### Phase 2: Snapshot Flow
- [ ] `snapshot-form-started` fires on email focus
- [ ] `email-opt-in-checked` fires on checkbox
- [ ] `snapshot-requested` fires on success
- [ ] `snapshot-success-cta-clicked` fires on CTA click

#### Phase 3: Report Flow
- [ ] `report-viewed` fires on page load
- [ ] `block-expanded` fires on expansion
- [ ] `share_clicked` fires on copy
- [ ] `report-cta-clicked` fires on CTA

#### Phase 4: Account Creation
- [ ] `form-started` fires on signup focus
- [ ] `user-signed-up` fires on success
- [ ] `dashboard-viewed` fires on first dashboard view

#### Phase 5: Email Events
- [ ] `email-delivered` appears (may take time)
- [ ] `email-opened` tracks opens
- [ ] `email-clicked` tracks clicks

#### Phase 6: Header CTAs
- [ ] `header-cta-clicked` fires for each button
- [ ] Properties include correct ctaType

---

### Testing Commands (Browser Console)

**Manual Event Trigger (for testing):**
```javascript
// Check if Umami is loaded
window.umami

// Manually trigger test event
window.umami.track('test-event', { test: 'value' })

// Check if event properties work
window.umami.track('snapshot-requested', { domain: 'test.com' })
```

---

### Validation SQL Queries (if using self-hosted)

**Top Events:**
```sql
SELECT event_name, COUNT(*) as count
FROM events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event_name
ORDER BY count DESC
LIMIT 20;
```

**Conversion Funnel:**
```sql
SELECT 
  COUNT(CASE WHEN event_name = 'snapshot-requested' THEN 1 END) as snapshots,
  COUNT(CASE WHEN event_name = 'user-signed-up' THEN 1 END) as signups,
  ROUND(
    COUNT(CASE WHEN event_name = 'user-signed-up' THEN 1 END)::numeric / 
    COUNT(CASE WHEN event_name = 'snapshot-requested' THEN 1 END) * 100, 2
  ) as conversion_rate
FROM events
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## 9. Advanced Configuration

### Custom Dimensions (if supported)

**User Properties:**
```javascript
// Track user type
window.umami.identify({
  userType: 'anonymous' | 'authenticated',
  accountAge: '<30days' | '30-90days' | '>90days'
});
```

**Session Properties:**
```javascript
// Track session context
window.umami.track('snapshot-requested', {
  domain: 'example.com',
  hasAccount: false,
  optedIntoEmails: true
});
```

---

### Traffic Source Tracking

**UTM Parameters (auto-tracked):**
- `utm_source` - Traffic source (google, twitter, etc.)
- `utm_medium` - Medium (cpc, email, social)
- `utm_campaign` - Campaign name
- `utm_content` - Content variant
- `utm_term` - Paid search term

**These appear in:**
- Realtime → Traffic Sources
- Reports → Acquisition → Sources

---

### API Access (for custom reports)

**Get API Key:**
1. Settings → API Keys
2. Click "Generate API Key"
3. **Copy and save securely**

**Example API Call:**
```bash
curl -X GET "https://cloud.umami.is/api/websites/YOUR-WEBSITE-ID/stats" \
  -H "Authorization: Bearer YOUR-API-KEY" \
  -H "Content-Type: application/json"
```

---

## 10. Weekly Monitoring Routine

### Monday: Conversion Review
1. Open "Snapshot Funnel" dashboard
2. Check overall conversion rate (target: >20%)
3. Identify drop-off points
4. Export data for weekly report

### Wednesday: Email Performance
1. Open "Email Performance" dashboard
2. Check open rate (target: >40%)
3. Check click rate (target: >25%)
4. Review worst-performing emails

### Friday: Traffic Sources
1. Open "Conversion Source Attribution"
2. Identify top converting sources
3. Identify underperforming sources
4. Plan optimization for next week

---

## 11. Troubleshooting

### Events Not Appearing

**Check 1: Script Loaded?**
```javascript
// In browser console
window.umami
// Should return: {track: ƒ}
```

**Check 2: Website ID Correct?**
```html
<!-- In page source -->
<script data-website-id="..."></script>
```

**Check 3: Ad Blocker?**
- Disable ad blocker
- Try in Incognito mode
- Umami should bypass most blockers

**Check 4: CORS Issues?**
- Umami Cloud handles CORS automatically
- If self-hosted, check CORS headers

---

### Events Delayed

**Normal Delays:**
- Real-time: <5 seconds
- Events tab: <30 seconds
- Aggregated stats: <5 minutes

**If longer delays:**
- Check Umami status page
- Verify internet connection
- Check Vercel function logs

---

### Duplicate Events

**Common Causes:**
- React StrictMode (dev only)
- Multiple script tags
- Event fired in useEffect without deps

**Fix:**
```typescript
// Add dependency array
useEffect(() => {
  Analytics.reportViewed(snapshotId, domain);
}, [snapshotId, domain]); // Only fire once per snapshot
```

---

## 12. Data Privacy & Compliance

### GDPR Compliance
✅ Umami is GDPR compliant by design:
- No cookies used
- No personal data collected
- Anonymous tracking only
- IP addresses hashed
- EU data residency (optional)

### Privacy Policy Language

**Recommended text:**
```
We use Umami Analytics, a privacy-friendly analytics tool, to understand 
how visitors use our website. Umami does not use cookies and does not 
collect any personally identifiable information. All data is anonymized 
and stored securely. For more information, see Umami's privacy policy.
```

### Data Retention

**Default:** 365 days  
**Configurable:** Settings → Data Retention

**Recommended:**
- Anonymous users: 90 days
- Authenticated users: 365 days
- Aggregate stats: Unlimited

---

## 13. Export & Backup

### Export Data
1. Go to Settings → Data Export
2. Select date range
3. Choose format: CSV or JSON
4. Download

**Automated Exports (if using API):**
```bash
#!/bin/bash
# Weekly export script
curl -X GET "https://cloud.umami.is/api/websites/$WEBSITE_ID/stats" \
  -H "Authorization: Bearer $API_KEY" \
  > "umami-export-$(date +%Y-%m-%d).json"
```

---

## 14. Cost Optimization

### Stay Within Free Tier (10k events/month)

**Event Count Projection:**
- Page views: ~2,000/month
- Snapshot events: ~1,500/month
- Report events: ~1,000/month
- Auth events: ~500/month
- Total: ~5,000/month

**✅ Free tier is sufficient for early stage!**

### Upgrade When:
- Traffic exceeds 10k events/month
- Need longer data retention
- Want team collaboration features
- Need API access

---

## 15. Quick Reference Card

### Most Important Metrics to Watch

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Snapshot → Account CVR | >20% | <15% | <10% |
| Email Open Rate | >40% | <30% | <20% |
| Email Click Rate | >25% | <15% | <10% |
| Form Start → Submit | >60% | <50% | <40% |
| Report Engagement | >60% | <40% | <20% |
| Brevo Opt-in Rate | >40% | <30% | <20% |

### Emergency Checks (if metrics drop suddenly)

1. **Check Umami:** Is service operational?
2. **Check Vercel:** Are deployments successful?
3. **Check Brevo:** Are emails delivering?
4. **Check Console:** Any JS errors?
5. **Check Rate Limits:** Any blocked requests?

---

## Support & Resources

### Umami Documentation
- Main docs: https://umami.is/docs
- Cloud docs: https://umami.is/docs/cloud
- API reference: https://umami.is/docs/api

### Community Support
- Discord: https://discord.gg/umami
- GitHub: https://github.com/umami-software/umami
- Forum: https://github.com/umami-software/umami/discussions

### Internal Docs
- Event reference: `/COMPLETE-FUNNEL-TRACKING.md`
- Analytics code: `/lib/analytics.ts`
- Tracking audit: `/FUNNEL-TRACKING-AUDIT.md`

---

**Status:** ✅ Ready for Production Setup

**Estimated Setup Time:** 45-60 minutes

**Next Steps:**
1. Add `NEXT_PUBLIC_UMAMI_WEBSITE_ID` to Vercel
2. Deploy to production
3. Verify events in Umami dashboard
4. Create 6 conversion goals
5. Build 4 custom dashboards
6. Set up 4 alerts
7. Start monitoring weekly metrics

**You're done! Your complete funnel is now tracked in Umami.** 📊
