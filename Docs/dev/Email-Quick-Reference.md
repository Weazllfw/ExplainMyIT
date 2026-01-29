# Email System - Quick Reference

**For detailed specs, see**: `System-Emails-Spec.md`

---

## 🚨 Critical Emails (Must Build)

### 1. Snapshot Complete + Magic Link
- **Trigger**: Snapshot generation complete
- **Brevo Template ID**: 1
- **Subject**: `Your IT Snapshot for {domain} is ready`
- **Contains**: LLM summary + magic link
- **UTM**: `?utm_source=email&utm_medium=snapshot-complete&utm_campaign=tier1-conversion`

### 2. Welcome + Account Created
- **Trigger**: User completes signup
- **Brevo Template ID**: 2
- **Subject**: `Welcome to Explain My IT`
- **Contains**: Dashboard link + report count
- **UTM**: `?utm_source=email&utm_medium=welcome&utm_campaign=engagement`

---

## 📋 Optional Email (v1.0)

### 3. Report Expiring Soon
- **Trigger**: T+46 hours (2h before expiry)
- **Brevo Template ID**: 3
- **Subject**: `Your IT snapshot for {domain} expires in 2 hours`
- **Contains**: Magic link + upgrade CTA
- **UTM**: `?utm_source=email&utm_medium=expiry-reminder&utm_campaign=retention`
- **Only send if**: User has NOT created account

---

## 📧 Brevo Contact Attributes

### Add These (New for Tier 1)

```javascript
ACCOUNT_CREATED: boolean (default: false)
ACCOUNT_CREATED_DATE: date
USER_TIER: text (default: "free")
TOTAL_SNAPSHOTS: number (default: 0)
LAST_SNAPSHOT_DATE: date
LAST_SNAPSHOT_DOMAIN: text
SNAPSHOT_STATUS: text (values: "requested", "completed", "failed")
```

---

## 📊 Umami Events to Track

### Server-Side (via `lib/analytics.ts`)

```typescript
trackEvent('email-snapshot-complete-sent', {
  domain: string,
  email_hash: string,
  generation_time_seconds: number
});

trackEvent('email-welcome-sent', {
  email_hash: string,
  reports_count: number
});

trackEvent('email-expiring-sent', {
  domain: string,
  hours_before_expiry: number
});
```

### Client-Side (via UTM → Umami auto-tracking)

```typescript
// Snapshot page
trackEvent('email-magic-link-clicked', {
  utm_medium: string,
  has_account: boolean
});

// Upgrade banner
trackEvent('upgrade-banner-clicked', {
  source: 'email',
  medium: string
});
```

### Brevo Webhook → Umami (via webhook handler)

```typescript
// app/api/webhooks/brevo/route.ts
trackEvent(`email-${template}-opened`, { email_hash: string });
trackEvent(`email-${template}-clicked`, { email_hash: string, link: string });
```

---

## 🔗 UTM Parameter Standards

### Magic Link (Snapshot Complete Email)
```
?utm_source=email
&utm_medium=snapshot-complete
&utm_campaign=tier1-conversion
&utm_content=magic-link
```

### Dashboard Link (Welcome Email)
```
?utm_source=email
&utm_medium=welcome
&utm_campaign=engagement
&utm_content=dashboard-link
```

### Magic Link (Expiry Reminder)
```
?utm_source=email
&utm_medium=expiry-reminder
&utm_campaign=retention
&utm_content=last-chance
```

---

## 🛠️ Implementation Checklist

### Phase 5.1: Templates (Day 22-23)
- [ ] `lib/email/templates.ts` (all 3 templates)
- [ ] `lib/email/utils.ts` (UTM builder)
- [ ] Set up Brevo templates in dashboard

### Phase 5.2: Sender (Day 23-24)
- [ ] `lib/email/sender.ts`
- [ ] sendSnapshotComplete()
- [ ] sendAccountWelcome()
- [ ] sendReportExpiring() (optional)

### Phase 5.3: Triggers (Day 24-25)
- [ ] Add to `app/api/cron/generate-snapshot/route.ts`
- [ ] Add to `app/api/auth/callback/route.ts`
- [ ] Create `app/api/cron/expiry-reminders/route.ts` (optional)

### Phase 5.4: Webhook (Day 25)
- [ ] Create `app/api/webhooks/brevo/route.ts`
- [ ] Configure webhook in Brevo dashboard

### Phase 5.5: Analytics (Day 25-26)
- [ ] Add UTM to all links
- [ ] Track server-side events
- [ ] Track client-side events
- [ ] Create Umami dashboard

### Phase 5.6: Testing (Day 26-27)
- [ ] End-to-end email flow
- [ ] Deliverability test
- [ ] Analytics validation
- [ ] Error scenarios

---

## 🎯 Success Metrics

| Metric | Target |
|--------|--------|
| Delivery rate | >98% |
| Open rate (Snapshot) | >50% |
| Click rate (Magic Link) | >60% |
| Email → Account conversion | >3% |

---

## 💰 Cost Estimate

**Brevo Free Tier**: 9,000 emails/month

**Tier 1 Volume** (1,000 snapshots/month):
- Snapshot Complete: 1,000
- Account Welcome: 50 (5% conversion)
- Report Expiring: 950 (95% no account)
- **Total**: 2,000/month ($0)

**Sufficient for**: Up to 4,500 snapshots/month on free tier

---

## 🔐 Environment Variables

Add to `.env.local`:

```bash
# Brevo
BREVO_API_KEY=your_key_here
BREVO_TEMPLATE_SNAPSHOT_COMPLETE=1
BREVO_TEMPLATE_ACCOUNT_WELCOME=2
BREVO_TEMPLATE_REPORT_EXPIRING=3

# Email Config
SYSTEM_EMAIL_FROM=reports@explainmyit.com
SYSTEM_EMAIL_FROM_NAME=Explain My IT
SYSTEM_EMAIL_REPLY_TO=hello@explainmyit.com

# Webhook
BREVO_WEBHOOK_SECRET=generate_random_string
```

---

## 📁 Files to Create

```
lib/email/
  ├── templates.ts      # Email content templates
  ├── sender.ts         # Brevo API integration
  └── utils.ts          # UTM builder, helpers

app/api/
  ├── webhooks/brevo/route.ts           # Webhook handler
  └── cron/expiry-reminders/route.ts    # Optional cron
```

---

## 🚀 Quick Start

1. Set up Brevo templates in dashboard
2. Add env vars to `.env.local`
3. Create `lib/email/templates.ts`
4. Create `lib/email/sender.ts`
5. Add email triggers to snapshot completion
6. Add email triggers to auth callback
7. Set up webhook handler
8. Test end-to-end

---

**Total Implementation Time**: 5-6 days
