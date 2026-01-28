# Brevo Integration Enhancement Plan

**Current Status**: Basic Implementation  
**Proposed Status**: Strategic Lead Management System

---

## Current Implementation (Good)

✅ **What we have**:
- Email capture
- Company size (optional)
- IT setup type (optional)
- Single list assignment
- Duplicate handling
- Basic error handling

**Status**: Functional but underutilized

---

## Strategic Enhancements (High Value)

### 1. Double Opt-In (RECOMMENDED - GDPR Best Practice)

**Why**: 
- Email deliverability protection
- List quality improvement
- GDPR/Privacy compliance
- Reduces spam complaints

**Implementation**:
```typescript
// Use Brevo's double opt-in feature
contactData.emailBlacklisted = false;
contactData.smsBlacklisted = false;
// Send confirmation email via template
```

**Impact**: Higher quality leads, better sender reputation

---

### 2. Enhanced Contact Attributes (HIGH VALUE)

**Current**: COMPANY_SIZE, HAS_IT  
**Proposed additions**:

```typescript
attributes: {
  // Current
  COMPANY_SIZE: string,
  HAS_IT: string,
  
  // New - Journey tracking
  SIGNUP_DATE: Date,
  SIGNUP_SOURCE: 'homepage' | 'blog' | 'referral',
  SIGNUP_PAGE: string (URL),
  
  // New - Qualification
  LEAD_SCORE: number (0-100),
  LEAD_STATUS: 'new' | 'qualified' | 'contacted',
  
  // New - Behavior  
  BLOG_READER: boolean,
  LAST_VISIT: Date,
  
  // New - Demographics (if you add fields)
  COMPANY_NAME: string (optional),
  ROLE: 'owner' | 'cfo' | 'ops' | 'other',
  
  // New - Intent signals
  INTENT_LEVEL: 'high' | 'medium' | 'low',
  TRIGGER_EVENT: 'insurance' | 'growth' | 'audit' | 'general'
}
```

**Impact**: Better segmentation, personalized follow-up

---

### 3. Welcome Email Automation (HIGH VALUE)

**Setup in Brevo**:
1. Create "Welcome to Waitlist" email template
2. Set up automation when contact is added to list
3. Personalize with contact attributes

**Template structure**:
```
Subject: You're on the list - What to expect

Hi there,

You're now on the early access list for Explain My IT.

Here's what happens next:
• We'll email you when the free snapshot launches
• Expect occasional IT clarity tips (no spam)
• Unsubscribe anytime with one click

While you wait: [Link to best blog posts]

— Explain My IT Team
```

**Impact**: Immediate value delivery, expectation setting

---

### 4. Lead Scoring System (MEDIUM VALUE)

**Automatic scoring based on**:
- Company size (larger = higher score)
- IT setup (MSP = higher score, indicates budget)
- Engagement (blog reads, return visits)
- Form completion rate

**Score calculation**:
```typescript
function calculateLeadScore(data: WaitlistFormData): number {
  let score = 50; // Base score
  
  // Company size scoring
  if (data.companySize === '51-150') score += 20;
  if (data.companySize === '151+') score += 30;
  if (data.companySize === '11-50') score += 10;
  
  // IT setup scoring
  if (data.hasIT === 'MSP') score += 15; // Budget exists
  if (data.hasIT === 'Yes') score += 10;
  
  // Completeness bonus
  if (data.companySize && data.hasIT) score += 10;
  
  return Math.min(score, 100);
}
```

**Impact**: Prioritize high-value leads for early outreach

---

### 5. UTM Tracking & Source Attribution (HIGH VALUE)

**Capture marketing source**:
```typescript
interface EnhancedFormData extends WaitlistFormData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}
```

**Implementation**:
- Parse URL params on form load
- Send to Brevo as attributes
- Track which channels work

**Impact**: Understand which marketing works

---

### 6. Confirmation Email (Transactional) (RECOMMENDED)

**Different from welcome automation**:
- Instant (not delayed)
- Confirms action
- Provides immediate next step

**Use Brevo Transactional Email API**:
```typescript
// After successful signup
await sendTransactionalEmail({
  to: data.email,
  templateId: YOUR_TEMPLATE_ID,
  params: {
    FIRSTNAME: 'there', // or extracted from email
    COMPANY_SIZE: data.companySize,
  }
});
```

**Impact**: Professional feel, reduces anxiety

---

### 7. Segmentation & Tagging (MEDIUM VALUE)

**Smart list organization**:
- List: "Early Access Waitlist" (primary)
- Tag: Based on company size
- Tag: Based on IT setup
- Tag: Based on signup source

**Example tagging logic**:
```typescript
const tags = [];
if (companySize === '51-150' || companySize === '151+') {
  tags.push('high-value');
}
if (hasIT === 'MSP') {
  tags.push('msp-user');
}
if (hasIT === 'Not sure') {
  tags.push('needs-education');
}
```

**Impact**: Targeted email campaigns later

---

### 8. Progressive Profiling (FUTURE - Not v1)

**Concept**: Collect more data over time
- First visit: Email only
- Return visit: Company size
- Blog engagement: Role/trigger event

**Not for v1**: Too complex, may reduce conversions

---

### 9. Integration with Umami Analytics (STRATEGIC)

**Track conversion funnel**:
```typescript
// After successful signup
if (window.umami) {
  window.umami.track('waitlist-signup', {
    companySize: data.companySize,
    hasIT: data.hasIT,
  });
}
```

**Impact**: Understand conversion patterns

---

## Recommended Implementation Priority

### Phase 1 (Do Now - High Impact, Low Effort)

1. ✅ **Enhanced attributes** (SIGNUP_DATE, SIGNUP_SOURCE, LEAD_SCORE)
2. ✅ **Lead scoring calculation**
3. ✅ **UTM tracking** (capture from URL)
4. ✅ **Umami event tracking**

**Effort**: 2-3 hours  
**Impact**: High - Better data from day 1

### Phase 2 (Do Week 1 - Setup in Brevo Dashboard)

5. 🔧 **Double opt-in configuration** (Brevo settings)
6. 🔧 **Welcome email template** (write in Brevo)
7. 🔧 **Automation workflow** (configure in Brevo)

**Effort**: 1-2 hours (in Brevo UI)  
**Impact**: High - Better deliverability & engagement

### Phase 3 (Do After Launch - When You Have Users)

8. 📊 **Segmentation & tagging** (based on real data patterns)
9. 📊 **List cleaning automation** (unengaged removal)
10. 📊 **Re-engagement campaigns** (for dormant contacts)

**Effort**: Ongoing  
**Impact**: Long-term list health

---

## What NOT to Do (Avoid Over-Engineering)

❌ **Complex CRM integration** - Too much for v1  
❌ **Zapier workflows** - Add complexity without value yet  
❌ **Multi-step forms** - Kills conversion  
❌ **Required phone numbers** - Reduces signups  
❌ **CAPTCHA** - Adds friction (add only if spam is a problem)  

---

## Brevo Features to Leverage

### Available in Free/Starter Tier
✅ Up to 300 emails/day (plenty for waitlist)  
✅ Contact management & attributes  
✅ Email templates  
✅ Basic automation  
✅ Transactional emails  
✅ List management  

### Worth Using
1. **Email templates** - Design in Brevo, trigger from code
2. **Automation workflows** - Welcome sequence
3. **Segmentation** - Smart lists based on attributes
4. **Transactional API** - Confirmation emails

### Not Needed Yet
- SMS (not relevant for this product)
- CRM features (too early)
- Landing pages (you have your own)
- Facebook Ads integration (not running ads)

---

## Practical Enhancement: The Implementation

### Enhanced Brevo Client

```typescript
// lib/brevo-enhanced.ts

interface EnhancedWaitlistData extends WaitlistFormData {
  // Marketing attribution
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  
  // Page context
  signupPage?: string;
}

export async function addToWaitlistEnhanced(
  data: EnhancedWaitlistData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('BREVO_API_KEY is not configured');
    return {
      success: false,
      error: 'Email service is not configured',
    };
  }

  // Calculate lead score
  const leadScore = calculateLeadScore(data);
  
  // Prepare enhanced contact data
  const contactData = {
    email: data.email,
    listIds: [2], // Early Access Waitlist
    updateEnabled: true,
    attributes: {
      // Original fields
      COMPANY_SIZE: data.companySize || 'Not provided',
      HAS_IT: data.hasIT || 'Not provided',
      
      // Enhanced fields
      SIGNUP_DATE: new Date().toISOString(),
      SIGNUP_SOURCE: data.utmSource || 'direct',
      SIGNUP_PAGE: data.signupPage || 'homepage',
      LEAD_SCORE: leadScore,
      LEAD_STATUS: 'new',
      
      // Marketing attribution
      UTM_SOURCE: data.utmSource || '',
      UTM_MEDIUM: data.utmMedium || '',
      UTM_CAMPAIGN: data.utmCampaign || '',
      REFERRER: data.referrer || '',
    },
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (response.status === 201 || response.status === 204) {
      // Success - optionally send confirmation email
      // await sendConfirmationEmail(data.email);
      
      return { success: true };
    }

    // Handle errors...
    const errorData = await response.json();
    console.error('Brevo API error:', errorData);
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    };
  } catch (error) {
    console.error('Error connecting to Brevo:', error);
    return {
      success: false,
      error: 'Failed to subscribe. Please try again.',
    };
  }
}

function calculateLeadScore(data: EnhancedWaitlistData): number {
  let score = 50;
  
  // Company size scoring
  if (data.companySize === '51-150') score += 20;
  if (data.companySize === '151+') score += 30;
  if (data.companySize === '11-50') score += 10;
  
  // IT setup scoring
  if (data.hasIT === 'MSP') score += 15;
  if (data.hasIT === 'Yes') score += 10;
  
  // Completeness bonus
  if (data.companySize && data.hasIT) score += 10;
  
  // Source quality
  if (data.utmSource === 'referral') score += 10;
  if (data.referrer?.includes('linkedin')) score += 5;
  
  return Math.min(score, 100);
}
```

---

## Brevo Dashboard Setup Checklist

### Contact Attributes to Create (in Brevo UI)

Go to Contacts > Settings > Contact attributes, create:

**Text attributes**:
- `COMPANY_SIZE` (text)
- `HAS_IT` (text)
- `SIGNUP_SOURCE` (text)
- `SIGNUP_PAGE` (text)
- `LEAD_STATUS` (text)
- `UTM_SOURCE` (text)
- `UTM_MEDIUM` (text)
- `UTM_CAMPAIGN` (text)
- `REFERRER` (text)

**Number attributes**:
- `LEAD_SCORE` (number, 0-100)

**Date attributes**:
- `SIGNUP_DATE` (date)

### Lists to Create

1. **Early Access Waitlist** (ID: 2) - Primary list
2. **High Value Leads** (smart segment: LEAD_SCORE > 70)
3. **MSP Users** (smart segment: HAS_IT = 'MSP')

### Email Templates to Create

1. **Welcome to Waitlist**
   - Subject: "You're on the list - What's next"
   - Content: Expectation setting, blog links
   - CTA: Read blog / Follow us

2. **Launch Notification** (for later)
   - Subject: "Explain My IT is live"
   - Content: Product launch, get started
   - CTA: Try free snapshot

### Automation Workflows

**Workflow 1: Welcome Sequence**
- Trigger: Contact added to "Early Access Waitlist"
- Wait: 1 minute
- Action: Send "Welcome to Waitlist" email
- Wait: 3 days
- Action: Send "While you wait" email with best blog posts

---

## Success Metrics to Track

### In Brevo Dashboard
- Total contacts
- Email open rates (industry avg: 20-25%)
- Click-through rates (industry avg: 2-5%)
- Unsubscribe rate (keep below 0.5%)

### In Your Analytics (Umami)
- Conversion rate (visitors → signups)
- Which pages drive most signups
- UTM source performance

### Lead Quality Indicators
- Average lead score
- % high-value leads (score >70)
- % with complete profiles

---

## Expected Outcomes

### With Basic Implementation (Current)
- ✅ Collect emails
- ❓ Unknown lead quality
- ❓ No engagement data
- ❓ No source attribution

### With Enhanced Implementation
- ✅ Collect emails
- ✅ Know lead quality (scoring)
- ✅ Track engagement
- ✅ Understand what works (UTM)
- ✅ Segment for targeted outreach
- ✅ Professional welcome experience

**ROI**: Higher quality leads, better launch communication, data-driven decisions

---

## Recommendation: Phase 1 Implementation

**Do these enhancements NOW** (before launch):

1. ✅ Add enhanced attributes (30 min)
2. ✅ Implement lead scoring (20 min)
3. ✅ Add UTM tracking to form (30 min)
4. ✅ Track Umami events (10 min)
5. 🔧 Create Brevo contact attributes (15 min in Brevo)

**Total time**: ~2 hours  
**Impact**: 10x better data from day 1

**Do in Brevo UI** (Week 1 after launch):
6. Welcome email template
7. Automation workflow

**Total time**: 1-2 hours  
**Impact**: Professional experience, better engagement

---

**Bottom line**: Your basic implementation works, but you're leaving valuable data and engagement opportunities on the table. The enhancements above give you strategic advantages for minimal extra effort.
