# Umami Cloud - Quick Start Checklist ⚡

**Estimated Time:** 15 minutes  
**Last Updated:** 2026-01-30

---

## Prerequisites

- [ ] Umami Cloud account created ([cloud.umami.is](https://cloud.umami.is))
- [ ] Access to Vercel dashboard
- [ ] Production deploy ready

---

## Step 1: Create Website in Umami (5 min)

1. [ ] Log into [cloud.umami.is](https://cloud.umami.is)
2. [ ] Click **"Add Website"**
3. [ ] Fill in:
   ```
   Name: Explain My IT (Production)
   Domain: explainmyit.com
   Timezone: Your timezone
   ```
4. [ ] Click **"Save"**
5. [ ] **Copy your Website ID** from the tracking code:
   ```
   data-website-id="COPY-THIS-VALUE"
   ```

---

## Step 2: Add to Vercel Environment Variables (3 min)

1. [ ] Go to [Vercel Dashboard](https://vercel.com)
2. [ ] Navigate to: **Project → Settings → Environment Variables**
3. [ ] Click **"Add New"**
4. [ ] Add:
   ```
   Key: NEXT_PUBLIC_UMAMI_WEBSITE_ID
   Value: [paste your Website ID]
   Environment: Production
   ```
5. [ ] Click **"Save"**

---

## Step 3: Deploy to Production (2 min)

**Option A: Automatic (if connected to GitHub)**
1. [ ] Just `git push` to main branch
2. [ ] Vercel will auto-deploy

**Option B: Manual**
1. [ ] Go to Vercel → Deployments
2. [ ] Click **"Redeploy"** on latest deployment
3. [ ] Select **"Use existing Build Cache"** (faster)
4. [ ] Click **"Redeploy"**

---

## Step 4: Verify It's Working (5 min)

### Test 1: Check Script Loads
1. [ ] Open your production site: `https://explainmyit.com`
2. [ ] Open **DevTools** (F12) → **Network** tab
3. [ ] Reload page
4. [ ] Look for: `script.js` from `cloud.umami.is` (status 200)
   - ✅ If present → Script is loading!
   - ❌ If missing → Check environment variable

### Test 2: Check Events Fire
1. [ ] Open **DevTools Console** (F12)
2. [ ] Type: `window.umami` and press Enter
3. [ ] Should see: `{track: ƒ}` (not undefined)
   - ✅ If present → Umami is ready!
4. [ ] Perform actions on site:
   - Focus email field (should fire `snapshot-form-started`)
   - Check opt-in box (should fire `email-opt-in-checked`)
   - Submit snapshot (should fire `snapshot-requested`)

### Test 3: Check Umami Dashboard
1. [ ] Go to Umami Cloud dashboard
2. [ ] Click on your website
3. [ ] Click **"Realtime"** tab
4. [ ] You should see:
   - [ ] Active visitor = 1 (you!)
   - [ ] Page views incrementing
5. [ ] Click **"Events"** tab
6. [ ] Within 1-2 minutes, you should see custom events:
   ```
   snapshot-form-started
   snapshot-requested
   (etc.)
   ```

---

## Step 5: Create 6 Goals (15 min) **OPTIONAL - Do Later**

### Goal 1: Free Snapshot Requested
1. [ ] Settings → Goals → Add Goal
2. [ ] Name: `Free Snapshot Requested`
3. [ ] Type: `Custom Event`
4. [ ] Event: `snapshot-requested`

### Goal 2: Account Created from Snapshot
1. [ ] Name: `Account Created from Snapshot`
2. [ ] Event: `user-signed-up`

### Goal 3: Email to Report
1. [ ] Name: `Email to Report View`
2. [ ] Event: `report-viewed`

### Goal 4: Report to Account
1. [ ] Name: `Report to Account`
2. [ ] Event: `user-signed-up`
3. [ ] Add funnel: `report-viewed` → `report-cta-clicked` → `user-signed-up`

### Goal 5: Brevo Opt-in
1. [ ] Name: `Brevo Opt-in`
2. [ ] Event: `email-opt-in-checked`

### Goal 6: Direct Header Signup
1. [ ] Name: `Direct Header Signup`
2. [ ] Event: `user-signed-up`
3. [ ] Add funnel: `header-cta-clicked` → `user-signed-up`

---

## Step 6: Build Dashboards (30 min) **OPTIONAL - Do Later**

See full guide: `Umami-Cloud-Setup-Guide.md` → Section 5

---

## Troubleshooting

### ❌ Script not loading
**Check:**
- [ ] Environment variable set in Vercel?
- [ ] Website ID is correct?
- [ ] Redeployed after adding variable?

**Fix:** Go to Vercel → Redeploy

---

### ❌ Events not appearing
**Check:**
- [ ] Browser console shows `window.umami` object?
- [ ] Ad blocker disabled?
- [ ] Wait 1-2 minutes (events can be delayed)

**Test manually:**
```javascript
window.umami.track('test-event', { test: true })
```

---

### ❌ Can't find Website ID
1. Go to Umami Cloud → Websites
2. Click your website name
3. Click **Settings**
4. Look for **"Tracking Code"** section
5. Copy the `data-website-id` value

---

## Quick Reference

### Your Website ID
```
NEXT_PUBLIC_UMAMI_WEBSITE_ID=[paste here for reference]
```

### Umami Dashboard
```
https://cloud.umami.is
```

### Key Events to Watch
- `snapshot-requested` - Snapshots run
- `user-signed-up` - Accounts created
- `report-viewed` - Reports opened
- `email-opened` - Emails engaged

---

## What to Monitor (Daily)

### Day 1-7: Validation
- [ ] Are events firing?
- [ ] Are counts accurate?
- [ ] Any console errors?

### Week 2+: Optimization
- [ ] Conversion rate: `user-signed-up / snapshot-requested`
  - Target: >20%
- [ ] Email open rate: `email-opened / email-delivered`
  - Target: >40%
- [ ] Form completion: `snapshot-requested / snapshot-form-started`
  - Target: >60%

---

## Done! ✅

**You now have:**
- ✅ Umami tracking script live
- ✅ 40 custom events firing
- ✅ Real-time dashboard active
- ✅ Ready to create goals & funnels

**Next Steps:**
1. Monitor for 7 days to collect baseline data
2. Create 6 conversion goals
3. Build 4 custom dashboards
4. Set up alerts for key metrics

**Full guide:** See `Umami-Cloud-Setup-Guide.md` for complete setup

---

**Support:**
- Full guide: `./Umami-Cloud-Setup-Guide.md`
- Event reference: `/COMPLETE-FUNNEL-TRACKING.md`
- Umami docs: https://umami.is/docs
