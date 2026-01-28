# Brevo Integration - What Changed

**Status**: ✅ Enhanced and Production-Ready

---

## 🎯 What Was Enhanced

### Before (Basic)
```
✓ Capture email
✓ Capture company size (optional)
✓ Capture IT setup (optional)
✓ Add to single list
✓ Basic error handling
```

### After (Strategic)
```
✓ Everything from before, PLUS:
✓ Lead scoring (0-100 quality score)
✓ Marketing attribution (UTM tracking)
✓ Source tracking (where they came from)
✓ Page tracking (which page they signed up from)
✓ Referrer tracking (referring website)
✓ Signup date tracking
✓ Journey stage tracking
✓ Umami analytics integration
✓ Ready for segmentation
✓ Ready for automation
```

---

## 📊 New Data Captured

### Automatic (No User Input Required )

| Attribute | What It Tracks | Example Value |
|-----------|----------------|---------------|
| `SIGNUP_DATE` | When they joined | `2026-01-28` |
| `SIGNUP_SOURCE` | Traffic source | `google`, `referral`, `direct` |
| `SIGNUP_PAGE` | Which page | `/`, `/blog`, `/blog/post-slug` |
| `UTM_SOURCE` | Campaign source | `linkedin`, `newsletter` |
| `UTM_MEDIUM` | Campaign medium | `social`, `email`, `cpc` |
| `UTM_CAMPAIGN` | Campaign name | `launch-week`, `q1-2026` |
| `REFERRER` | Referring URL | `https://linkedin.com` |
| `LEAD_SCORE` | Quality score | `75` (0-100) |
| `LEAD_STATUS` | Current stage | `new`, `qualified`, `contacted` |

### From User Input (Optional)

| Field | Values |
|-------|--------|
| `COMPANY_SIZE` | `1-10`, `11-50`, `51-150`, `151+` |
| `HAS_IT` | `Yes`, `MSP`, `Not sure` |

---

## 🎓 Lead Scoring Logic

**Base Score**: 50

**Company Size**:
- 151+ employees: +30 points
- 51-150 employees: +20 points
- 11-50 employees: +10 points
- 1-10 employees: +0 points

**IT Setup**:
- Has MSP: +15 points (budget exists)
- Has internal IT: +10 points
- Not sure: +0 points

**Engagement**:
- Both optional fields filled: +10 points

**Source Quality**:
- Referral traffic: +10 points
- LinkedIn referrer: +5 points

**Score Ranges**:
- 80-100: Hot lead (priority for early access)
- 60-79: Warm lead (launch group)
- 40-59: Standard lead
- 0-39: Cold lead (educational focus)

---

## 📈 Umami Integration

**Event Tracked**: `waitlist-signup`

**Data Sent**:
```javascript
{
  companySize: 'not-provided' | '1-10' | '11-50' | '51-150' | '151+',
  hasIT: 'not-provided' | 'Yes' | 'MSP' | 'Not sure',
  source: 'direct' | 'google' | 'referral' | [utm_source]
}
```

**View in Umami**: Events tab → `waitlist-signup`

---

## 🔧 Technical Changes

### Files Modified

1. **`types/waitlist.ts`** - Added attribution fields
2. **`lib/brevo.ts`** - Enhanced with scoring & attributes
3. **`components/WaitlistForm.tsx`** - Auto-capture UTM + Umami tracking

### No Breaking Changes

All existing functionality preserved. Enhancements are additive only.

---

## 🚀 Usage Examples

### Example 1: Direct Traffic
**User**: Types explainmyit.com directly  
**Captured**:
```json
{
  "email": "owner@company.com",
  "companySize": "11-50",
  "hasIT": "MSP",
  "utmSource": null,
  "referrer": "",
  "signupPage": "/",
  "leadScore": 85
}
```

### Example 2: LinkedIn Campaign
**User**: Clicks link from LinkedIn post with UTM  
**URL**: `explainmyit.com/?utm_source=linkedin&utm_medium=social&utm_campaign=launch`  
**Captured**:
```json
{
  "email": "cfo@bigcorp.com",
  "companySize": "151+",
  "hasIT": "Yes",
  "utmSource": "linkedin",
  "utmMedium": "social",
  "utmCampaign": "launch",
  "referrer": "https://linkedin.com",
  "signupPage": "/",
  "leadScore": 95
}
```

### Example 3: Blog Reader
**User**: Signs up from blog post  
**Captured**:
```json
{
  "email": "reader@startup.com",
  "companySize": "",
  "hasIT": "",
  "utmSource": null,
  "referrer": "https://google.com",
  "signupPage": "/blog/what-does-cloud-mean",
  "leadScore": 50
}
```

---

## 💡 What You Can Do With This Data

### Immediate Actions (Week 1)

1. **Identify hot leads** (score >80)
   - Give them priority beta access
   - Personal outreach

2. **Understand traffic sources**
   - Which channels drive signups?
   - Double down on what works

3. **Optimize high-performing pages**
   - Which blog posts drive conversions?
   - Write more like those

### Strategic Actions (Month 1)

4. **Segment your list**
   - MSP users → Different messaging
   - Large companies → Enterprise features
   - Not sure → Educational content

5. **Personalize communications**
   - Reference their company size
   - Speak to their IT situation

6. **Track marketing ROI**
   - UTM campaigns → Signup rate
   - Cost per acquisition

### Long-term (Quarter 1)

7. **Build lookalike audiences**
   - High-score leads → Target similar
   - Successful customers → Find more

8. **Refine product positioning**
   - Which segments convert best?
   - Adjust messaging

9. **Optimize funnel**
   - Which pages have best conversion?
   - Which sources have best LTV?

---

## 🎯 Next Steps

### Before Launch
1. ✅ **Code is ready** (already deployed)
2. **Configure Brevo** (30 min - see BREVO-SETUP-GUIDE.md)
   - Create account
   - Set up list
   - Create attributes
   - Get API key

### Week 1 After Launch
3. **Set up welcome email** (15 min in Brevo)
4. **Create automation** (10 min in Brevo)
5. **Create segments** (10 min in Brevo)

### Ongoing
6. **Monitor metrics weekly**
7. **Refine segmentation**
8. **Test and optimize**

---

## 📋 Quick Reference

### Environment Variable Needed
```bash
# .env.local
BREVO_API_KEY=your_api_key_here
```

### Brevo List ID
Update in `lib/brevo.ts` line 57:
```typescript
listIds: [YOUR_LIST_ID], // Change from [2] to your actual ID
```

### Brevo Attributes to Create (11 total)
- COMPANY_SIZE (Text)
- HAS_IT (Text)
- SIGNUP_DATE (Date)
- SIGNUP_SOURCE (Text)
- SIGNUP_PAGE (Text)
- LEAD_SCORE (Number)
- LEAD_STATUS (Text)
- UTM_SOURCE (Text)
- UTM_MEDIUM (Text)
- UTM_CAMPAIGN (Text)
- REFERRER (Text)

---

## 🎓 Pro Tips

1. **Test with different URLs**:
   - `/?utm_source=test&utm_medium=email`
   - Verify UTM params are captured

2. **Check Umami events**:
   - Events should appear in real-time
   - Filter by event type: `waitlist-signup`

3. **Monitor lead score distribution**:
   - Avg score too low? Adjust marketing
   - Avg score high? You're attracting quality

4. **Use segments for campaigns**:
   - Launch announcement: High-score leads first
   - Educational content: "Not sure" segment
   - Feature updates: MSP users segment

---

## 📊 Expected Metrics (First Month)

### Healthy Benchmarks
- Conversion rate: 2-5% (visitors → signups)
- Email open rate: 25-35%
- Click-through rate: 3-7%
- Average lead score: 55-65
- Unsubscribe rate: <0.5%

### Red Flags
- Lead score avg <40: Wrong audience
- Open rate <20%: Email deliverability issue
- Unsubscribe >2%: Poor content fit

---

## ✅ Success Indicators

**You know the enhancements are working when**:

1. ✅ Every contact in Brevo has all attributes populated
2. ✅ You can see which marketing channels work (UTM tracking)
3. ✅ You can identify your best leads (lead scoring)
4. ✅ Umami shows `waitlist-signup` events
5. ✅ You can segment meaningfully (MSP vs internal IT)
6. ✅ You understand where signups come from (source attribution)

---

## 🆘 Troubleshooting

**Issue**: Attributes not showing in Brevo  
**Fix**: Create them manually in Brevo dashboard (see setup guide)

**Issue**: UTM params not captured  
**Fix**: Test with URL like `/?utm_source=test` and check

**Issue**: Lead score is always 50  
**Fix**: Users must fill optional fields for higher scores

**Issue**: Umami event not tracking  
**Fix**: Check Umami is configured and script is loading

---

## 📚 Full Documentation

- **Enhancement Plan**: `Docs/BREVO-ENHANCEMENT-PLAN.md` (strategy)
- **Setup Guide**: `Docs/BREVO-SETUP-GUIDE.md` (step-by-step)
- **This File**: Quick reference & summary

---

**Your Brevo integration is now 10x more valuable.** 🎉

**From**: Basic email capture  
**To**: Strategic lead management system

**Time to set up**: ~30 minutes in Brevo dashboard  
**Value**: Priceless data from day 1
