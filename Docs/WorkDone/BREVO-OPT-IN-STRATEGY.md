# Brevo Mailing List Opt-In Strategy 🎯

**Problem:** Free snapshot users who don't immediately create accounts are never added to Brevo → we lose 50%+ of nurture opportunities.

---

## Critical Opt-In Points (Ranked by Impact)

### 1. 🔴 **CRITICAL: Snapshot Request Form** (Homepage)
**Impact:** ⭐⭐⭐⭐⭐ (Highest - captures EVERY free snapshot user)

**Current State:**
- Users submit email + domain
- Get report via email
- NO opt-in to mailing list

**Solution:**
Add optional checkbox BELOW domain field:
```
☐ Keep me updated about my IT setup and security insights (optional)
```

**Why this works:**
- ✅ Captures users BEFORE they see value
- ✅ Low friction (checkbox, not required field)
- ✅ Positioned as helpful updates, not marketing
- ✅ Gets them into nurture flow immediately

**Brevo List:** "Free Snapshot Users" (new list or main list)

**When to add:**
- At form submission time
- If checkbox is checked
- Includes: email, domain, signup_source: "free-snapshot"

---

### 2. 🟡 **HIGH PRIORITY: Snapshot Success State** (Post-submission)
**Impact:** ⭐⭐⭐⭐ (High - second chance for anonymous users)

**Current State:**
- Success message shown
- CTA to create account OR request another
- NO mailing list opt-in

**Solution for ANONYMOUS users:**
Add callout BELOW the signup CTA:

```
📧 Or, just stay updated
Don't want an account yet? Get occasional email updates 
about your IT setup and security tips.
[Subscribe to Updates] (secondary button)
```

**Why this works:**
- ✅ Catches users who don't want full account
- ✅ Lower commitment than signup
- ✅ Positioned as value-add, not marketing
- ✅ Natural fallback option

**Brevo List:** "Free Snapshot Users - No Account"

---

### 3. 🟢 **MEDIUM PRIORITY: Report View Page** (Anonymous viewers)
**Impact:** ⭐⭐⭐ (Medium - catches report viewers who came back)

**Current State:**
- Anonymous users can view report via email link
- Conversion CTAs to create account
- NO mailing list opt-in

**Solution:**
Add footer section AFTER "Run Another Snapshot" CTA:

```
Want updates when IT best practices change?
[Email me IT insights] (secondary button or input)
```

**Why this works:**
- ✅ Catches users who come back to review report
- ✅ After they've seen value
- ✅ Non-intrusive placement (footer)

**Brevo List:** "Engaged Report Viewers"

---

## Bonus: Signup Flow Auto Opt-In

### 4. ⚪ **OPTIONAL: Signup Page**
**Impact:** ⭐⭐ (Lower - these users are already creating accounts)

**Solution:**
Auto opt-in OR pre-checked checkbox:
```
☑ Send me occasional IT insights and product updates
```

**Why lower priority:**
- Account creation already captures them
- Can nurture via app notifications
- But still good for email engagement

---

## Implementation Priority

### Phase 1 (SHIP IMMEDIATELY):
1. ✅ **Snapshot Request Form checkbox**
   - Add to `SnapshotRequestForm.tsx`
   - Optional checkbox below domain field
   - Submit to Brevo if checked

### Phase 2 (SHIP THIS WEEK):
2. ✅ **Snapshot Success State opt-in**
   - Add to success state for anonymous users
   - "Subscribe to Updates" button
   - Modal or inline form

### Phase 3 (SHIP NEXT WEEK):
3. ✅ **Report Page footer opt-in**
   - Add to `ReportFooterActions.tsx`
   - Simple email input or button

### Phase 4 (OPTIONAL):
4. ✅ **Signup auto opt-in**
   - Pre-checked checkbox
   - Can uncheck if desired

---

## Brevo List Strategy

### Recommended List Structure:

#### List 1: "Free Snapshot Users" (Main)
- Source: Snapshot form checkbox
- Status: Opted in via form
- Nurture: General IT tips, feature updates

#### List 2: "Free Snapshot - No Account"
- Source: Success state subscribe button
- Status: Opted in post-snapshot
- Nurture: Benefits of creating account, IT tips

#### List 3: "Engaged Report Viewers"
- Source: Report page footer
- Status: Returned to view report
- Nurture: Time-based urgency, recurring value

#### List 4: "Account Holders" (Existing)
- Source: Signup flow
- Status: Created account
- Nurture: Product updates, usage tips

---

## Copy Strategy

### Snapshot Form Checkbox Copy:
**Option A (Recommended):**
```
☐ Keep me updated about my IT setup (occasional emails, unsubscribe anytime)
```

**Option B (Value-focused):**
```
☐ Send me IT security tips and insights for business owners
```

**Option C (FOMO):**
```
☐ Notify me when important IT changes happen (free)
```

### Success State Copy:
**Heading:** "Or, just stay updated"

**Body:**
```
Don't want an account yet? Get occasional email updates 
about your IT setup and practical security tips for business owners.
```

**Button:** "Subscribe to Updates"

### Report Footer Copy:
**Heading:** "Want IT insights delivered?"

**Body:**
```
Get practical IT tips for business owners, straight to your inbox. 
No jargon, no spam.
```

**Button:** "Subscribe"

---

## Positioning Rules (CRITICAL)

### ✅ DO:
- Frame as "updates" or "insights," not "newsletter"
- Emphasize business owner focus
- Show unsubscribe option
- Keep optional (not required)
- Use secondary UI treatment (not primary CTA)

### ❌ DON'T:
- Make it required
- Use aggressive copy
- Compete with account creation CTA
- Use "marketing" or "promotional" language
- Make it visually prominent over core conversion

---

## Technical Implementation

### 1. Snapshot Form Integration

**File:** `components/SnapshotRequestForm.tsx`

**Add state:**
```typescript
const [optIntoEmails, setOptIntoEmails] = useState(false);
```

**Add checkbox in form:**
```tsx
<div className="flex items-start gap-2">
  <input
    type="checkbox"
    id="opt-in-emails"
    checked={optIntoEmails}
    onChange={(e) => setOptIntoEmails(e.target.checked)}
    className="mt-1"
  />
  <label htmlFor="opt-in-emails" className="text-sm text-brand-slate">
    Keep me updated about my IT setup (occasional emails, unsubscribe anytime)
  </label>
</div>
```

**Add to API call:**
```typescript
body: JSON.stringify({ 
  email, 
  domain, 
  optIntoEmails  // New field
}),
```

### 2. API Route Integration

**File:** `app/api/snapshot/route.ts`

**After successful snapshot creation:**
```typescript
// If user opted in, add to Brevo
if (optIntoEmails) {
  await addToWaitlist({
    email,
    signupSource: 'free-snapshot',
    signupPage: 'snapshot-form',
    // ... other fields
  });
}
```

### 3. Success State Integration

**File:** `components/SnapshotRequestForm.tsx`

**Add to anonymous user success state:**
```tsx
{/* Email Subscribe Option */}
<div className="mt-4 pt-4 border-t border-brand-border text-center">
  <p className="text-sm text-brand-muted mb-3">
    Or, just stay updated
  </p>
  <button
    onClick={handleSubscribe}
    className="text-brand-cyan hover:underline text-sm font-medium"
  >
    Get IT insights via email →
  </button>
</div>
```

---

## Analytics Tracking

### New Umami Events:

1. **`snapshot-form-email-opt-in-checked`**
   - When: User checks opt-in checkbox
   - Props: `{ source: 'snapshot-form' }`

2. **`snapshot-form-email-opt-in-submitted`**
   - When: Form submitted with opt-in checked
   - Props: `{ domain, opted_in: true }`

3. **`success-state-email-subscribe-clicked`**
   - When: User clicks "Subscribe to Updates" in success state
   - Props: `{ user_type: 'anonymous' }`

4. **`report-footer-email-subscribe-clicked`**
   - When: User subscribes from report footer
   - Props: `{ report_age_days: N }`

---

## Expected Impact

### Baseline (Current):
- Free snapshots: 100/month
- Account creations: 20/month (20% conversion)
- **Brevo contacts added:** 20/month

### With Opt-In (Projected):
- Free snapshots: 100/month
- Account creations: 20/month (20%)
- **Snapshot form opt-ins:** 40/month (40% check rate)
- **Success state opt-ins:** 15/month (25% of remaining 60)
- **Report footer opt-ins:** 5/month (catch-all)
- **Total Brevo contacts:** 80/month (4x increase!)

### Nurture Opportunity:
- 60 additional emails/month in nurture flow
- Convert 10-20% to accounts over 90 days
- = 6-12 additional account conversions/quarter

---

## Copy Testing Ideas

### A/B Test Variables:

**Checkbox Copy:**
- A: "Keep me updated about my IT setup"
- B: "Send me IT security tips for business owners"
- C: "Notify me when important IT changes happen"

**Success State CTA:**
- A: "Subscribe to Updates"
- B: "Get IT Insights"
- C: "Stay Informed"

**Positioning:**
- A: Below domain field (most visible)
- B: After trust signals (less intrusive)
- C: As part of trust signals

---

## Compliance & Trust

### Requirements:
1. ✅ **Optional** - Never required
2. ✅ **Clear copy** - Explain what they'll receive
3. ✅ **Easy unsubscribe** - Mention in copy
4. ✅ **Double opt-in** - Configure in Brevo (optional)
5. ✅ **Privacy policy link** - Include in checkbox label

**Recommended Label:**
```
☐ Keep me updated about my IT setup (occasional emails). 
   See our Privacy Policy.
```

---

## Brevo Attributes to Track

When adding contacts, include:

```typescript
{
  SIGNUP_SOURCE: 'snapshot-form' | 'success-state' | 'report-footer',
  HAS_ACCOUNT: 'no',
  LAST_SNAPSHOT_DATE: '2026-01-30',
  SNAPSHOT_DOMAIN: 'example.com',
  OPT_IN_TIMESTAMP: '2026-01-30T12:00:00Z',
  LEAD_SCORE: 50, // Calculate based on engagement
}
```

---

## Future Enhancements

### After Initial Implementation:

1. **Segmented Nurture Flows:**
   - Day 0: Welcome + Report link
   - Day 3: "Here's what changed in IT this week"
   - Day 7: "Benefits of tracking IT over time" (account pitch)
   - Day 14: "Case study: How [Company] used Explain My IT"
   - Day 30: "Your snapshot is 30 days old - run another?"

2. **Personalization:**
   - Include domain name in emails
   - Reference findings from their report
   - Industry-specific tips (if we collect that)

3. **Re-engagement:**
   - "Your IT setup has likely changed" (60 days after snapshot)
   - "Security best practices for [Industry]"
   - "New features: [Feature announcement]"

---

## Success Metrics

### Track:

1. **Opt-in Rate:**
   - Target: 40%+ on snapshot form
   - Target: 25%+ on success state
   - Target: 10%+ on report footer

2. **Engagement:**
   - Open rate: >25%
   - Click rate: >5%
   - Unsubscribe rate: <2%

3. **Conversion:**
   - Email → Account creation: 10-20% over 90 days
   - Email → Repeat snapshot: 30-40% over 90 days

---

## Immediate Action Items

### Today:
- [ ] Create new Brevo list: "Free Snapshot Users"
- [ ] Add checkbox to `SnapshotRequestForm.tsx`
- [ ] Add Brevo call to snapshot API route
- [ ] Add Umami tracking events
- [ ] Test end-to-end flow

### This Week:
- [ ] Add success state subscribe option
- [ ] Create modal/form for email capture
- [ ] Set up basic nurture flow in Brevo
- [ ] Write first 3 nurture emails

### Next Week:
- [ ] Add report footer opt-in
- [ ] A/B test checkbox copy
- [ ] Monitor opt-in rates
- [ ] Optimize based on data

---

**The single biggest win: Snapshot form checkbox. Ship this FIRST.** 🎯
