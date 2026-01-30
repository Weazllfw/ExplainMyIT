# Brevo Setup Guide - Complete Configuration

**Updated**: January 28, 2026  
**Status**: Ready for implementation

---

## Overview

Your enhanced Brevo integration now captures:
- ✅ Email & profile data (company size, IT setup)
- ✅ **NEW**: Lead scoring (0-100)
- ✅ **NEW**: Marketing attribution (UTM params, referrer)
- ✅ **NEW**: Journey tracking (signup date, source, page)
- ✅ **NEW**: Umami analytics integration

---

## Part 1: Brevo Account Setup

### Step 1: Create Brevo Account

1. Go to https://app.brevo.com
2. Sign up for free account
3. Verify your email address
4. Complete basic profile

---

### Step 2: Verify Sender Domain/Email

**Critical for deliverability**

1. Go to **Senders & IP** in left menu
2. Click **Add a sender**
3. Options:
   - **Easy**: Use `noreply@explainmyit.com` (verify email)
   - **Better**: Add custom domain and authenticate (SPF, DKIM)

**Recommendation**: Start with email verification, add domain authentication later

---

### Step 3: Create Contact List

1. Go to **Contacts** > **Lists**
2. Click **Create a list**
3. Name: `Early Access Waitlist`
4. **Note the List ID** (you'll see it in the URL: `/contacts/lists/X`)
5. Update in your code: `lib/brevo.ts` line 57 → `listIds: [YOUR_LIST_ID]`

---

### Step 4: Create Contact Attributes

**Go to**: Contacts > Settings > Contact attributes

Create these custom attributes (Type in parentheses):

#### Core Profile
- `COMPANY_SIZE` (Text) - Company employee count
- `HAS_IT` (Text) - IT setup type

#### Journey Tracking
- `SIGNUP_DATE` (Date) - When they joined waitlist
- `SIGNUP_SOURCE` (Text) - Traffic source (direct, google, referral, etc.)
- `SIGNUP_PAGE` (Text) - Which page they signed up from

#### Lead Qualification
- `LEAD_SCORE` (Number) - Calculated quality score 0-100
- `LEAD_STATUS` (Text) - Current stage (new, qualified, contacted)

#### Marketing Attribution
- `UTM_SOURCE` (Text) - UTM source parameter
- `UTM_MEDIUM` (Text) - UTM medium parameter
- `UTM_CAMPAIGN` (Text) - UTM campaign parameter
- `REFERRER` (Text) - Referring website URL

**Time required**: 10 minutes

---

### Step 5: Get API Key

1. Go to **Settings** (top right)
2. Click **API Keys**
3. Click **Generate a new API key**
4. Name it: `Explain My IT Website`
5. **Copy the key** (you won't see it again!)
6. Add to your `.env.local`:
   ```bash
   BREVO_API_KEY=your_actual_api_key_here
   ```

**Security**: Never commit this to Git

---

## Part 2: Email Templates (Optional but Recommended)

### Template 1: Welcome to Waitlist

**Purpose**: Immediate welcome after signup

1. Go to **Campaigns** > **Templates**
2. Click **Create a new template**
3. Choose **Drag & drop editor**
4. Name: `Welcome to Waitlist`

**Subject**: `You're on the list - Here's what's next`

**Content**:
```
Hi there,

Thanks for joining the early access list for Explain My IT.

Here's what happens next:

✓ We'll email you when the free snapshot launches
✓ Expect occasional IT clarity tips (never spam)  
✓ Unsubscribe anytime with one click

While you wait, check out these articles:
[Link to your best 2-3 blog posts]

Questions? Just reply to this email.

— The Explain My IT Team

P.S. We're not affiliated with any MSP or vendor. 
This is purely about clarity.
```

**Save template** and note the Template ID

---

### Template 2: Launch Notification (Create Later)

**Purpose**: Notify when product goes live

**Don't create yet** - wait until you're close to launch

---

## Part 3: Automation Workflows (Recommended)

### Automation 1: Welcome Sequence

**Purpose**: Automatic welcome email when someone joins

1. Go to **Automation** > **Create an automation**
2. Choose **Entry point**: Contact added to list
3. Configure:
   - **Trigger**: Contact added to "Early Access Waitlist"
   - **Wait**: 1 minute (immediate but not instant)
   - **Action**: Send email "Welcome to Waitlist"
4. Activate automation

**Result**: Every new signup gets automatic welcome

---

### Automation 2: Engagement Sequence (Optional)

**Purpose**: Keep waitlist warm

1. **Trigger**: Contact added to list
2. **Wait**: 3 days
3. **Action**: Send "While You Wait" email (blog content)
4. **Wait**: 7 days
5. **Action**: Send "IT Clarity Tip" email
6. **End** (don't overdo it)

**Create this**: Week 1 after launch (after you have content)

---

## Part 4: Smart Segmentation

### Create Smart Segments

**Go to**: Contacts > Segments

#### Segment 1: High Value Leads
- **Name**: High Value Leads
- **Condition**: `LEAD_SCORE` > 70
- **Use**: Priority outreach when product launches

#### Segment 2: MSP Users
- **Name**: MSP Users
- **Condition**: `HAS_IT` = "MSP"
- **Use**: Targeted messaging (they understand IT spend)

#### Segment 3: Large Companies
- **Name**: Large Companies
- **Condition**: `COMPANY_SIZE` = "51-150" OR "151+"
- **Use**: Enterprise-ready messaging

#### Segment 4: Needs Education
- **Name**: Needs Education
- **Condition**: `HAS_IT` = "Not sure"
- **Use**: Educational content focus

**Create these**: Week 1, after you have some contacts

---

## Part 5: Verification & Testing

### Pre-Launch Checklist

- [ ] Brevo account created
- [ ] Sender email/domain verified
- [ ] "Early Access Waitlist" list created
- [ ] List ID updated in code (`lib/brevo.ts`)
- [ ] All 11 contact attributes created
- [ ] API key generated
- [ ] API key added to `.env.local`
- [ ] Welcome email template created
- [ ] Welcome automation configured and activated

### Test the Integration

1. **Clear your browser cache**
2. **Go to your site**: http://localhost:3000
3. **Fill out waitlist form** with test email
4. **Submit form**
5. **Check**:
   - Success message appears ✓
   - Contact appears in Brevo within 30 seconds ✓
   - All attributes populated correctly ✓
   - Welcome email received (if automation set up) ✓

### Check Contact in Brevo

1. Go to **Contacts** > **Lists** > "Early Access Waitlist"
2. Find your test contact
3. Click to view details
4. **Verify all attributes are populated**:
   - COMPANY_SIZE: ✓
   - HAS_IT: ✓
   - SIGNUP_DATE: ✓
   - SIGNUP_SOURCE: ✓
   - LEAD_SCORE: ✓
   - etc.

---

## Part 6: Understanding the Data

### Lead Score Interpretation

| Score | Meaning | Action |
|-------|---------|--------|
| 80-100 | Hot lead | Priority for early beta access |
| 60-79 | Warm lead | Include in launch group |
| 40-59 | Standard lead | Standard waitlist |
| 0-39 | Cold lead | Educational content focus |

**Scoring factors**:
- Company size (larger = higher score)
- Has MSP (budget exists = +15)
- Complete profile (engagement = +10)
- Quality referral source (+5-10)

### Source Attribution

**SIGNUP_SOURCE values**:
- `direct` - Typed URL or bookmark
- `google` - Organic search (if utm_source=google)
- `referral` - From another site
- `linkedin` - Social media
- `email` - Email campaign

**Use this to**: Understand which channels work

### Journey Tracking

**SIGNUP_PAGE values**:
- `/` - Homepage (most common)
- `/blog` - Blog index
- `/blog/[slug]` - Specific blog post

**Use this to**: Optimize high-converting pages

---

## Part 7: Ongoing Management

### Weekly Tasks (First Month)

1. **Monday**: Check new signups, review lead scores
2. **Wednesday**: Check email open rates, adjust copy if needed
3. **Friday**: Review source attribution, adjust marketing

### Monthly Tasks

1. **List health**: Check bounce rate, remove hard bounces
2. **Segmentation**: Update segments based on patterns
3. **Content**: Plan next email based on engagement

### What to Monitor

**Key Metrics (Brevo Dashboard)**:
- Total contacts (growth rate)
- Email open rate (target: 25%+)
- Click-through rate (target: 3%+)
- Unsubscribe rate (keep below 0.5%)

**Quality Metrics (Contact Data)**:
- Average lead score (higher = better quality)
- % high-value leads (score >70)
- % complete profiles (both optional fields filled)

---

## Part 8: Common Issues & Solutions

### Issue: Contacts not appearing in Brevo

**Solutions**:
1. Check API key is correct in `.env.local`
2. Check list ID is correct in `lib/brevo.ts`
3. Check browser console for errors
4. Verify Brevo API status (status.brevo.com)

### Issue: Attributes not populating

**Solutions**:
1. Verify attribute names match exactly (case-sensitive)
2. Check attribute types (Text vs Number vs Date)
3. Re-save attribute configuration in Brevo

### Issue: Welcome email not sending

**Solutions**:
1. Check automation is activated
2. Verify sender email is verified
3. Check spam folder
4. Test with different email address

### Issue: Low email open rates

**Solutions**:
1. Improve subject lines
2. Verify sender reputation
3. Check email isn't landing in spam
4. Segment and personalize

---

## Part 9: Advanced Features (Future)

### When You Have 100+ Contacts

Consider:
- A/B testing email subject lines
- More granular segmentation
- Re-engagement campaigns
- Referral program

### When You Launch Product

Add:
- Onboarding email sequence
- Product update emails
- Usage tip emails
- Renewal reminders

### When You Have Revenue

Consider:
- Marketing automation platform (if needed)
- CRM integration (if needed)
- Customer success platform

**For now**: Keep it simple, Brevo is enough

---

## Part 10: Cost Expectations

### Brevo Free Plan
- Up to 300 emails/day
- Unlimited contacts
- Basic automation
- Transactional emails

**Good for**: First 1,000-2,000 contacts

### When to Upgrade
- If you hit 300 emails/day limit
- If you need advanced automation
- If you want SMS (not needed yet)

**Current cost (as of 2026)**: 
- Free: $0
- Starter: ~$25/month

**You'll be on Free for months**

---

## Checklist Summary

### Must Do Before Launch
- [x] Code enhancements deployed
- [ ] Brevo account created
- [ ] Sender verified
- [ ] List created & ID updated
- [ ] Attributes created (all 11)
- [ ] API key added to `.env.local`
- [ ] Test signup works

### Should Do Week 1
- [ ] Welcome email template
- [ ] Welcome automation
- [ ] Test email sequence

### Can Do Later
- [ ] Additional segments
- [ ] Engagement sequences
- [ ] Advanced analytics

---

## Support Resources

- **Brevo Help**: https://help.brevo.com
- **API Docs**: https://developers.brevo.com
- **Status Page**: https://status.brevo.com

---

**You're now set up for strategic lead management from day 1!** 🚀
