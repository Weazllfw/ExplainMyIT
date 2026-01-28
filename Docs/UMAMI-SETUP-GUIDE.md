# Umami Analytics Setup Guide

**Status**: Code Ready - Needs Configuration  
**Privacy**: Fully GDPR-compliant, no cookies, no PII

---

## Overview

Umami is a privacy-friendly, open-source analytics platform that gives you insights without compromising user privacy.

**Why Umami over Google Analytics?**
- ✅ No cookies required (GDPR-friendly)
- ✅ No personal data collected
- ✅ Lightweight (~2KB script)
- ✅ Fast performance
- ✅ Own your data
- ✅ No user tracking across sites
- ✅ Simple, clean interface

---

## Part 1: Choose Your Setup

### Option A: Umami Cloud (Easiest - Recommended)

**Best for**: Quick launch, no DevOps overhead  
**Cost**: Free for 100K events/month, then $20/month  
**Time**: 5 minutes

1. Go to https://cloud.umami.is/
2. Sign up for account
3. Create new website: "Explain My IT"
4. Get Website ID and Script URL
5. Add to `.env.local`

### Option B: Self-Hosted (Free Forever)

**Best for**: Full control, unlimited events  
**Cost**: Free (+ hosting cost ~$0-5/month)  
**Time**: 15-30 minutes

**Quick deploy options**:
- Vercel: https://vercel.com/new/clone?repository-url=https://github.com/umami-software/umami
- Railway: https://railway.app/new/template/umami
- Docker: `docker run -d -p 3000:3000 ghcr.io/umami-software/umami:postgresql-latest`

---

## Part 2: Configuration

### Step 1: Get Your Credentials

#### Umami Cloud:
1. Go to https://cloud.umami.is/
2. Settings > Websites
3. Click on "Explain My IT"
4. Copy:
   - **Website ID** (UUID format)
   - **Script URL** (e.g., `https://cloud.umami.is/script.js`)

#### Self-Hosted:
1. Go to your Umami URL (e.g., https://your-umami.vercel.app)
2. Settings > Websites > Add website
3. Name: "Explain My IT"
4. Domain: "explainmyit.com"
5. Copy:
   - **Website ID** from Settings
   - **Script URL** is `https://your-umami.vercel.app/script.js`

### Step 2: Add to Environment Variables

Update `.env.local`:

```bash
# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_SRC=https://your-umami-instance/script.js
```

**Examples**:

```bash
# Umami Cloud
NEXT_PUBLIC_UMAMI_WEBSITE_ID=a1b2c3d4-5678-90ab-cdef-1234567890ab
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js

# Self-hosted on Vercel
NEXT_PUBLIC_UMAMI_WEBSITE_ID=a1b2c3d4-5678-90ab-cdef-1234567890ab
NEXT_PUBLIC_UMAMI_SRC=https://analytics-explainmyit.vercel.app/script.js
```

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C if running)
# Start server
npm run dev
```

---

## Part 3: Verify It's Working

### Test 1: Script Loading

1. Open http://localhost:3000
2. Open DevTools (F12) > Network tab
3. Look for `script.js` request
4. Status should be `200 OK`

### Test 2: Page Views

1. Visit http://localhost:3000
2. Go to Umami dashboard
3. Check "Realtime" (wait 30 seconds)
4. You should see 1 active visitor

### Test 3: Events

1. Click "Get Early Access" button on homepage
2. Go to Umami dashboard > Events
3. You should see `cta-click-hero` event

### Test 4: Blog Tracking

1. Go to http://localhost:3000/blog
2. Click on a blog post
3. Read for a few seconds
4. Scroll down (triggers completion event)
5. Check Umami Events:
   - `blog-post-read`
   - `blog-post-completed`

---

## Part 4: Understanding Your Analytics

### What's Being Tracked (Automatic)

**Page Views** (automatic):
- Homepage: `/`
- Blog index: `/blog`
- Blog posts: `/blog/[slug]`
- Privacy: `/privacy`

**Visitor Data** (anonymous):
- Browser
- OS
- Device type (desktop/mobile)
- Country (from IP, no storing)
- Screen resolution
- Referrer

**What's NOT tracked**:
- No IP addresses stored
- No user IDs
- No personal information
- No cross-site tracking
- No cookies

### Custom Events We Track

#### Conversion Funnel

1. **Visitor lands** → Page view (automatic)
2. **Clicks CTA** → `cta-click-hero` or `cta-click-header`
3. **Starts form** → `waitlist-form-started`
4. **Completes form** → `waitlist-signup` (with metadata)

#### Content Engagement

- `blog-post-read` - User opened blog post
- `blog-post-completed` - User scrolled 90% (engaged reader)

#### Navigation

- `nav-how-it-works` - Clicked How It Works
- `nav-blog` - Clicked Blog in nav

#### Errors (for debugging)

- `form-error` - Form submission failed

---

## Part 5: Key Metrics to Monitor

### Week 1 Focus

**Basic Health**:
- Total page views per day
- Unique visitors per day
- Bounce rate
- Avg time on page

**Conversion Funnel**:
- Homepage visits → Waitlist form started (%)
- Form started → Form completed (%)
- Overall conversion rate

**Top Pages**:
- Which pages get most traffic?
- Which blog posts are popular?

### Month 1 Focus

**Traffic Sources**:
- Direct vs referral vs search
- Which referrers send best traffic?
- UTM campaign performance

**Content Performance**:
- Which blog posts drive signups?
- Reading completion rate by post
- Average time on blog posts

**Device Split**:
- Mobile vs desktop traffic
- Mobile conversion rate vs desktop

### Ongoing Metrics

**Growth**:
- Week-over-week visitor growth
- Month-over-month signup growth

**Engagement**:
- Pages per session
- Return visitor rate
- Blog engagement rate

**Quality**:
- Bounce rate by source
- Conversion rate by source
- Time on site by source

---

## Part 6: Umami Dashboard Guide

### Main Dashboard

**Realtime** tab:
- See active visitors right now
- Live page views
- Live events

**Stats** tab:
- Page views over time
- Unique visitors
- Bounce rate
- Avg visit duration

### Key Reports

**Pages**:
- Most viewed pages
- Entry pages (where visitors land)
- Exit pages (where they leave)

**Referrers**:
- Traffic sources
- Top referring domains
- Direct vs referral split

**Events**:
- Custom event counts
- Event properties
- Conversion funnel

**Devices**:
- Browser distribution
- OS distribution
- Device types (mobile/desktop/tablet)

**Countries**:
- Geographic distribution
- No personal data, just country-level

---

## Part 7: Advanced Configuration (Optional)

### Custom Event Properties

Our events already include useful properties:

**waitlist-signup**:
```javascript
{
  companySize: '11-50',
  hasIT: 'MSP',
  source: 'linkedin'
}
```

**blog-post-read**:
```javascript
{
  slug: 'what-does-cloud-mean',
  readingTime: 5
}
```

### Filter & Segment Data

In Umami, you can filter by:
- Date range
- Page URL
- Referrer
- Browser/OS/Device
- Country
- Event properties

**Example queries**:
- "Show me blog post signups from LinkedIn"
- "What's the conversion rate for mobile visitors?"
- "Which blog post has highest completion rate?"

---

## Part 8: Performance Impact

### Script Size

- Umami script: ~2KB gzipped
- Loads async with `defer`
- Zero blocking of page rendering

### Request Volume

- 1 request on page load (script)
- 1 request per page view
- 1 request per custom event
- All async, non-blocking

**Typical session**: 3-5 requests total (minimal impact)

---

## Part 9: Privacy & Compliance

### GDPR Compliant

✅ No cookies used  
✅ No personal data collected  
✅ No user profiles created  
✅ No tracking across sites  
✅ Data anonymized  
✅ No third-party data sharing  

### Privacy Policy Integration

Already included in your privacy page:
> "We use privacy-friendly analytics (Umami) to understand how people use our website. This data is anonymized and does not personally identify you."

**No consent banner required** (Umami is privacy-first)

---

## Part 10: Troubleshooting

### Issue: Script not loading

**Check**:
1. Environment variables are set correctly
2. `.env.local` file exists
3. Dev server was restarted after adding vars
4. No typos in variable names

**Solution**: Restart dev server after setting env vars

### Issue: No data in Umami dashboard

**Check**:
1. Website ID matches in both places
2. Domain is correct in Umami settings
3. Umami instance is running (if self-hosted)
4. Browser console for errors

**Solution**: Wait 1-2 minutes, refresh Umami dashboard

### Issue: Events not showing

**Check**:
1. Browser DevTools > Console for errors
2. Network tab shows requests to Umami
3. Events tab in Umami (not Stats tab)

**Solution**: Events appear in "Events" tab, not "Stats"

### Issue: Localhost not tracking

**Fix**: Umami tracks localhost by default. If not:
- Check "Track localhost" in Umami website settings

---

## Part 11: Going to Production

### Pre-Launch Checklist

- [ ] Umami instance set up (Cloud or self-hosted)
- [ ] Website created in Umami
- [ ] Environment variables added
- [ ] Script loading verified
- [ ] Test events working
- [ ] Production env vars set in Vercel

### Add to Vercel (Production)

1. Go to Vercel project settings
2. Environment Variables
3. Add same two variables:
   ```
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx
   NEXT_PUBLIC_UMAMI_SRC=xxx
   ```
4. Redeploy

### Post-Launch

**Day 1**:
- Verify script loading on production
- Check first visitors appearing
- Test one event (click a CTA)

**Week 1**:
- Monitor daily traffic
- Check conversion funnel
- Identify top pages

**Month 1**:
- Analyze traffic sources
- Optimize low-performing pages
- Track blog engagement

---

## Part 12: Cost Expectations

### Umami Cloud Pricing (2026)

**Free Tier**:
- 100,000 events/month
- 3 websites
- 1 year data retention

**Hobby Tier** ($20/month):
- 1 million events/month
- 10 websites
- 2 years data retention

**Expected usage (first 6 months)**:
- ~5,000 page views/month = ~10,000 events
- **Easily within free tier**

### Self-Hosted Cost

**Free** (code) + hosting:
- Vercel: Free
- Railway: ~$5/month
- DigitalOcean: ~$5/month
- Docker on existing server: $0

**Recommendation**: Start with Umami Cloud free tier

---

## Part 13: Umami vs Google Analytics

| Feature | Umami | Google Analytics 4 |
|---------|-------|-------------------|
| Privacy | ✅ Full (no PII) | ❌ Tracking-based |
| Cookies | ✅ None | ❌ Yes |
| GDPR | ✅ Compliant by default | ⚠️ Requires consent |
| Performance | ✅ 2KB | ❌ ~45KB |
| Data ownership | ✅ You own it | ❌ Google owns it |
| Setup complexity | ✅ Simple | ❌ Complex |
| Learning curve | ✅ Easy | ❌ Steep |
| Cost | ✅ Free/cheap | ✅ Free |

**For your use case**: Umami is better
- Privacy-focused audience
- Owner/decision-maker ICP (appreciate privacy)
- No need for ads tracking
- Simple, actionable metrics

---

## Part 14: Success Indicators

**You'll know it's working when**:

✅ Daily page views show up in dashboard  
✅ Conversion funnel is trackable  
✅ You can see which blog posts work  
✅ You understand traffic sources  
✅ You can identify best-performing pages  
✅ Zero complaints about privacy/cookies  

---

## Quick Start Checklist

### 5-Minute Setup (Umami Cloud)

1. [ ] Sign up at https://cloud.umami.is/
2. [ ] Create website "Explain My IT"
3. [ ] Copy Website ID
4. [ ] Copy Script URL
5. [ ] Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-id
   NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js
   ```
6. [ ] Restart dev server: `npm run dev`
7. [ ] Visit http://localhost:3000
8. [ ] Check Umami dashboard - see your visit
9. [ ] Click CTA button
10. [ ] Check Events tab - see your event

**Done!** ✅

---

## Resources

- **Umami Docs**: https://umami.is/docs
- **Umami Cloud**: https://cloud.umami.is/
- **GitHub**: https://github.com/umami-software/umami
- **Demo**: https://app.umami.is/share/LGazGOecbDtaIwDr/umami.is

---

**You're now set up for privacy-friendly, actionable analytics!** 📊
