# Homepage Architecture - Source of Truth

**Last Updated**: January 29, 2026  
**Phase**: 6 - Frontend (Homepage Integration)  
**Status**: Complete

---

## Overview

The homepage (`app/page.tsx`) is the primary entry point for Tier 1. It features a prominent snapshot request form that allows users to immediately request a free IT snapshot without creating an account.

---

## Page Structure

### Hero Section (Primary CTA)

**Layout**: 2-column grid (stacked on mobile)

**Left Column**:
- Product name: "Explain My IT"
- Tagline: "Plain-English IT reports for business owners"
- Value proposition
- Simplified messaging (no "coming soon")

**Right Column**:
- **Snapshot Request Form** (white card, prominent)
- Email input
- Domain input
- Submit button: "Get My Free IT Snapshot"
- Success/error states

**Goal**: Capture email + domain, initiate snapshot generation

---

## Snapshot Request Form Component

**File**: `components/SnapshotRequestForm.tsx`

**Type**: Client Component (`'use client'`)

**State Management**:
```typescript
const [email, setEmail] = useState('');
const [domain, setDomain] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState('');
```

---

### Form Flow

**1. Initial State**:
- Empty email + domain inputs
- "Get My Free IT Snapshot" button (enabled)
- Help text: "Just the domain (e.g., company.com)"

**2. User Input**:
- Type email (validated as email format)
- Type domain (no www, just domain)
- Click submit

**3. Loading State** (30-60 seconds):
- Button disabled
- Spinner icon appears
- Button text: "Generating Your Snapshot..."
- Inputs disabled

**4. Success State**:
- Green card with checkmark
- Heading: "Snapshot Requested!"
- Message: "You'll receive an email with your report in the next few minutes"
- Link to request another snapshot
- Umami event fired: `snapshot-requested`

**5. Error State**:
- Red banner with error message
- Form remains visible
- User can retry

---

### API Integration

**Endpoint**: `POST /api/snapshot`

**Request Body**:
```json
{
  "email": "user@company.com",
  "domain": "company.com"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "snapshotId": "uuid",
  "message": "Snapshot requested successfully"
}
```

**Error Response** (4xx/5xx):
```json
{
  "error": "Rate limit exceeded. Try again in 30 days."
}
```

**Common Errors**:
- `400`: Invalid email or domain format
- `429`: Rate limit exceeded (1 per domain per 30 days)
- `500`: Server error (LLM failure, database error, etc.)

---

### Input Validation

**Email**:
- HTML5 `type="email"` (basic validation)
- Required field
- Placeholder: `you@company.com`

**Domain**:
- Text input (no strict validation client-side)
- Required field
- Placeholder: `example.com`
- Help text: "Just the domain (e.g., company.com, not www.company.com)"
- Server validates format

**Why Minimal Client Validation?**
- Server does authoritative validation
- Better UX (no confusing client-side errors)
- Server knows actual domain format requirements

---

### Umami Analytics

**Event**: `snapshot-requested`

**Triggered**: On successful form submission

**Data**:
```javascript
umami.track('snapshot-requested', {
  domain: domain
});
```

**Purpose**: Track conversion (homepage → snapshot request)

---

## Benefits Bar

**Location**: Immediately below hero section

**Layout**: 3-column grid (stacks on mobile)

**Content**:
1. ⚡ **60 seconds** - Results delivered to your email
2. 🔒 **100% Free** - No credit card. No strings.
3. 📧 **Plain English** - Written for business owners, not IT pros

**Purpose**: Address objections, reinforce value proposition

---

## What's In Your Free Snapshot Section

**Location**: After benefits bar

**Layout**: 2x2 grid (4 cards)

**Cards**:
1. 📊 **Owner Summary** - 4-6 sentence overview
2. 🎯 **Top Findings** - Top 3 findings by business impact
3. ⚠️ **Assumptions Being Made** - What setup assumes works
4. 💡 **Questions to Ask** - Questions for IT team/MSP

**Plus**: 6 detailed areas listed as pills:
- 🌐 Domain & Infrastructure
- 📧 Email Security
- 🔒 Website Security
- ⚙️ Technology Stack
- 🔍 Public Exposure
- 🛡️ Breach History

**Purpose**: Set expectations, demonstrate value

---

## Other Sections (Unchanged)

**Who It's For**:
- Business owners
- Companies with IT/MSP
- Preparing for transitions

**What It's Not**:
- No monitoring alerts
- No security scanning
- No tech jargon
- No remediation services

**What You Get**:
- Simple owner dashboard
- Recurring reports
- Business-level explanations
- Calm, factual presentation

---

## Waitlist CTA (Secondary)

**Location**: Bottom of page (after all content)

**Layout**: Centered, white card on gradient background

**Positioning**: Secondary CTA (dashboard early access)

**Heading**: "Want Recurring Reports & a Dashboard?"

**Copy**: "The free snapshot is just the beginning. Get early access to our full dashboard with recurring reports, change tracking, and more."

**Form**: Original waitlist form (email + company size + IT setup)

**Goal**: Capture leads for future dashboard product (Tier 2)

---

## Page Hierarchy (CTAs)

**Primary CTA**: Free snapshot request (hero, top of page)
- Immediate action
- No commitment
- Instant value

**Secondary CTA**: Dashboard waitlist (bottom of page)
- Future product
- For engaged users
- After they understand value

**Rationale**: Lead with free value, upsell to paid later

---

## Mobile Responsive Design

**Hero Section**:
- Stacks vertically on mobile
- Form appears below copy
- Full width on small screens

**Benefits Bar**:
- 3 columns → stacks to 1 column
- Icons + text remain readable

**What's In Snapshot**:
- 2x2 grid → stacks to 1 column
- Cards remain full width

**All Sections**:
- `container-section` class (responsive padding)
- `space-y-*` for vertical spacing
- Mobile-first approach (base styles for mobile)

---

## SEO & Metadata

**Title**: "Explain My IT - Plain-English IT Reports for Business Owners"

**Description**: "Get a free IT snapshot of your company in plain English. No jargon. No tech talk. Just clarity. Results in 60 seconds."

**Keywords** (implicit):
- Plain English IT reports
- IT snapshot
- Business owner IT clarity
- MSP oversight
- IT dashboard

**Open Graph**:
- Image: (to be added)
- Title/description match page metadata

---

## Performance Considerations

**Form Performance**:
- Client-side form (no server-side validation on input)
- Optimistic UI (immediate feedback)
- Loading spinner (clear progress indicator)

**Page Load**:
- Server-side rendering (SSR)
- No heavy images (icons are SVG)
- Tailwind CSS (minimal, purged)

**Expected Metrics** (Lighthouse):
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## User Flow

```
User Lands on Homepage
    ↓
Sees Snapshot Request Form (hero, right column)
    ↓
Enters Email + Domain
    ↓
Clicks "Get My Free IT Snapshot"
    ↓
Form submits (POST /api/snapshot)
    ↓
Loading state (spinner, "Generating...")
    ↓
[Backend processing: 30-60s]
    ↓
Success message appears
    ↓
User checks email
    ↓
Clicks magic link
    ↓
Views report (/report/[id])
```

---

## Conversion Funnel

**Stage 1**: Homepage visit
- Goal: Capture attention
- Metric: Umami page view

**Stage 2**: Form interaction
- Goal: Capture email + domain
- Metric: Form focus event (to be added)

**Stage 3**: Form submission
- Goal: Request snapshot
- Metric: `snapshot-requested` event

**Stage 4**: Email received
- Goal: User gets email
- Metric: Brevo delivery event

**Stage 5**: Email opened
- Goal: User sees report link
- Metric: Brevo open event

**Stage 6**: Magic link clicked
- Goal: User visits report
- Metric: Brevo click event

**Stage 7**: Report viewed
- Goal: User reads report
- Metric: `report_viewed` event (to be added)

**Stage 8**: Account created
- Goal: Convert to registered user
- Metric: `account_created` event (Tier 2)

---

## Files

**Pages Modified**:
- `app/page.tsx` - Homepage with snapshot form

**Components Created**:
- `components/SnapshotRequestForm.tsx` - Form component

**Components Used** (existing):
- `components/Header.tsx` - Page header
- `components/Footer.tsx` - Page footer
- `components/WaitlistForm.tsx` - Secondary CTA (waitlist)

---

## Testing Checklist

**Manual Testing**:
- [ ] Form displays correctly (desktop)
- [ ] Form displays correctly (mobile)
- [ ] Email validation works
- [ ] Domain input accepts valid domains
- [ ] Submit triggers loading state
- [ ] Loading state shows spinner + disabled inputs
- [ ] Success state displays after submission
- [ ] Error state displays on failure
- [ ] "Request another snapshot" resets form
- [ ] Umami event fires on success

**Edge Cases**:
- [ ] Invalid email format (e.g., "notanemail")
- [ ] Invalid domain format (e.g., "not a domain")
- [ ] Rate limit exceeded (2nd request < 30 days)
- [ ] Network error (API down)
- [ ] Very long email/domain (overflow handling)

**Cross-Browser**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Chrome Android

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **No Client-Side Domain Validation**: Relies on server validation
2. **No Rate Limit Warning**: Doesn't warn before hitting rate limit
3. **No Email Preview**: Can't preview what email looks like
4. **No Domain Autocomplete**: Manual typing required
5. **No Progress Bar**: Just spinner (no percentage)

### Future Enhancements

**Short Term** (next week):
- Add domain format hint (tooltip)
- Add rate limit check before submit (query API first)
- Add form analytics (focus, abandon, error clicks)
- A/B test button copy

**Medium Term** (next month):
- Domain autocomplete (common TLDs)
- Email verification (double opt-in)
- Company name field (optional)
- Progress bar (signal collection → LLM → email)
- "Share results" option (generate new magic link)

**Long Term**:
- Multi-domain batch requests
- Schedule recurring snapshots (Tier 2)
- Comparison view (before/after)
- Team invites (Tier 2)

---

## Analytics Events (To Be Added)

**Homepage Events**:
- `page_view` - Homepage loaded
- `form_focused` - User clicked into form
- `form_abandoned` - User left form without submitting
- `snapshot_requested` - ✅ Already implemented
- `error_shown` - Error message displayed
- `success_shown` - Success message displayed

**Report Events** (Phase 7):
- `report_viewed` - Report page loaded
- `block_expanded` - User expanded a block
- `cta_clicked` - User clicked CTA (which button)

---

## Environment Variables

**No New Variables Required**:
- Uses existing API endpoint (`/api/snapshot`)
- Uses existing Umami configuration
- Uses existing Brevo for emails

---

**Homepage integration complete! Free snapshot request is now the primary CTA, ready for production testing.**
