# Analytics Events Map - Quick Reference

**Visual guide to what's being tracked and where**

---

## 🗺️ Event Tracking Map

### Homepage (`/`)

```
┌─────────────────────────────────────────┐
│  HERO SECTION                           │
│  ┌─────────────────────────────────┐   │
│  │ [Get Early Access to Dashboard] │   │ → data-umami-event="cta-click-heroa"
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  WAITLIST FORM                          │
│  ┌─────────────────────────────────┐   │
│  │ Email: ___________________      │   │
│  │ Company Size: ____________      │   │
│  │ IT Setup: _________________     │   │
│  │                                 │   │
│  │ [Join the Waitlist] ←────────────── Click: waitlist-form-started
│  └─────────────────────────────────┘   │
│                                         │
│  Success → waitlist-signup              │ → With: companySize, hasIT, source
│  Error → form-error                     │ → With: errorType
└─────────────────────────────────────────┘
```

---

### Header (All Pages)

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] How It Works | Blog | [Get Early Access]         │
│          ↓              ↓              ↓                  │
│    nav-how-it-works  nav-blog  cta-click-header         │
└──────────────────────────────────────────────────────────┘
```

---

### Blog Index (`/blog`)

```
┌─────────────────────────────────────────┐
│  BLOG POST CARD                         │
│  ┌─────────────────────────────────┐   │
│  │ [Post Title] ──────────────────────► Click → Page view /blog/[slug]
│  │                                 │   │
│  │ Excerpt text...                 │   │
│  │                                 │   │
│  │ Read article →                  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### Blog Post Page (`/blog/[slug]`)

```
┌─────────────────────────────────────────┐
│  BlogPostTracker (invisible)            │
│                                         │
│  On Mount:                              │
│    → blog-post-read                     │ → With: slug, readingTime
│                                         │
│  On Scroll (90%):                       │
│    → blog-post-completed                │ → With: slug, timeSpent
│                                         │
│  On Exit (if >10s):                     │
│    → blog-post-completed                │ → With: slug, timeSpent
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [← Back to all articles]               │ → Click tracked via page view
└─────────────────────────────────────────┘
```

---

## 📊 Event Properties (Metadata)

### waitlist-signup

```json
{
  "companySize": "11-50" | "51-150" | "151+" | "1-10" | "not-provided",
  "hasIT": "Yes" | "MSP" | "Not sure" | "not-provided",
  "source": "direct" | "google" | "linkedin" | [utm_source]
}
```

### blog-post-read

```json
{
  "slug": "what-does-cloud-mean",
  "readingTime": 5
}
```

### blog-post-completed

```json
{
  "slug": "what-does-cloud-mean",
  "timeSpent": 187
}
```

### form-error

```json
{
  "formName": "waitlist",
  "errorType": "network-error" | "validation-error" | "unknown-error"
}
```

---

## 🎯 Conversion Funnel Flow

```
STAGE 1: Awareness
├─ Page view: /
└─ Referrer captured

STAGE 2: Interest
├─ Scroll engagement
├─ Time on page
└─ CTA click → cta-click-hero or cta-click-header

STAGE 3: Consideration
├─ Form appears in view
└─ Form start → waitlist-form-started

STAGE 4: Conversion
├─ Success → waitlist-signup (+ metadata)
└─ Error → form-error (+ error type)

STAGE 5: Engagement (Blog)
├─ Blog post read → blog-post-read
└─ Post completed → blog-post-completed
```

---

## 📈 Dashboard Views You'll Use

### Daily Monitor (Every Morning)

**Umami Dashboard > Realtime**:
- Active visitors right now
- Recent page views
- Recent events

**Quick checks**:
1. Any visitors?
2. Any signups? (filter events: `waitlist-signup`)
3. Any errors? (filter events: `form-error`)

### Weekly Review (Every Monday)

**Umami Dashboard > Stats** (7 days):
1. Total visitors this week
2. Conversion rate: signups / visitors
3. Top pages
4. Top referrers

**Umami Dashboard > Events**:
1. Total `waitlist-signup` count
2. `blog-post-read` distribution
3. `blog-post-completed` rate

### Monthly Analysis (First of Month)

**Compare periods**:
- This month vs last month
- Growth rate
- Trend direction

**Deep dive**:
1. Which content drove signups?
2. Which sources convert best?
3. Where are drop-offs in funnel?

---

## 🔍 Advanced Queries (In Umami)

### Find Blog Posts That Convert

1. Events > `waitlist-signup`
2. Filter by property: `source` contains "blog"
3. See which posts drive signups

### Calculate Engagement Rate

1. Events > `blog-post-read` (total reads)
2. Events > `blog-post-completed` (total completions)
3. Completion rate = completions / reads * 100

### Compare Mobile vs Desktop Conversion

1. Filter by device type: Mobile
2. Count `waitlist-signup` events
3. Compare to Desktop
4. Optimize for best-performing device

---

## ⚡ Performance Notes

### Script Impact

**Size**: 2KB gzipped  
**Loading**: Deferred (non-blocking)  
**Requests**: 1 on load + 1 per event  
**Impact**: **Zero** on Core Web Vitals

### Comparison

| Analytics | Script Size | Impact |
|-----------|-------------|--------|
| Umami | 2KB | None |
| Google Analytics 4 | 45KB | Medium |
| Plausible | 1KB | None |
| Mixpanel | 100KB+ | High |

**Winner**: Umami (perfect balance of features vs performance)

---

## 🎯 ROI of This Setup

### Without Analytics

❓ Guess what works  
❓ Assume conversion rate  
❓ Hope content resonates  
❓ No funnel visibility  
❓ Can't optimize  

### With This Setup

✅ **Know** what works  
✅ **Measure** conversion rate  
✅ **Prove** content value  
✅ **See** complete funnel  
✅ **Optimize** based on data  

**Time to set up**: 10 minutes  
**Value**: Priceless

---

## 📋 Final Checklist

### Before Launch

- [ ] Umami instance set up
- [ ] Website ID obtained
- [ ] Environment variables configured
- [ ] Dev server restarted
- [ ] Tracking verified locally
- [ ] Events tested and working

### At Launch (Vercel)

- [ ] Same env vars added to Vercel
- [ ] Production deployment tested
- [ ] Live tracking verified
- [ ] Umami dashboard bookmarked

### Week 1 After Launch

- [ ] Daily monitoring routine established
- [ ] Baseline metrics documented
- [ ] First optimizations identified
- [ ] Team has dashboard access (if applicable)

---

## 🎉 Status

**Code Integration**: ✅ Complete  
**Testing**: ✅ Verified compiling  
**Documentation**: ✅ Comprehensive  
**Configuration**: ⏳ 10 minutes (you)  
**Privacy**: ✅ GDPR-compliant  
**Performance**: ✅ Optimized  

---

**You have professional-grade, privacy-friendly analytics ready to go!**

**Next**: Configure Umami credentials (10 min), then launch with confidence 🚀
