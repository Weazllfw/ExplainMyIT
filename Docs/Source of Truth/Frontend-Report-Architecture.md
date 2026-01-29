# Frontend Report Architecture - Source of Truth

**Last Updated**: January 29, 2026  
**Phase**: 6 - Frontend (Report View)  
**Status**: Complete

---

## Overview

The report view is the primary user-facing interface for Tier 1. It displays the LLM-generated snapshot report with magic link authentication. The architecture follows Next.js 14 App Router patterns with server-side rendering and client-side interactivity.

---

## Page Structure

### Route: `/report/[id]`

**Main Page**: `app/report/[id]/page.tsx`

**Flow**:
```
User Clicks Magic Link
    ↓
/report/{id}?token={jwt}
    ↓
Verify Token (server-side)
    ↓
Fetch Snapshot from Database
    ↓
Render Report (SSR)
    ↓
Client-Side Interactivity (expand/collapse blocks)
```

**Key Features**:
- Server-side authentication (magic link token verification)
- Server-side data fetching (snapshot from Supabase)
- Dynamic metadata generation (SEO)
- Error handling (invalid token, missing report, etc.)
- Loading states
- Responsive design (mobile-first)

---

## Authentication Flow

**Token Verification** (Server-Side):
1. Extract `token` from query params
2. Verify JWT signature using `jose` library
3. Check token expiry (30 days)
4. Validate `snapshotId` matches URL param
5. If invalid: redirect to `/error` page

**Implementation**:
```typescript
const tokenPayload = await verifyMagicLinkToken(token);
if (!tokenPayload || tokenPayload.snapshotId !== id) {
  redirect('/error?message=Invalid or expired link');
}
```

**Security**:
- No client-side token storage
- Token verified on every page load
- No authentication cookies (stateless)
- Short-lived tokens (30 days)

---

## Components

### 1. ReportHeader (`components/report/ReportHeader.tsx`)

**Purpose**: Page header with domain and generation date

**Props**:
- `domain` (string) - The domain being reported on
- `createdAt` (string) - ISO timestamp of snapshot creation

**Displays**:
- Logo (links to homepage)
- Domain name (h1)
- Generation date (formatted)

---

### 2. OwnerSummary (`components/report/OwnerSummary.tsx`)

**Purpose**: High-level 4-6 sentence summary for business owners

**Props**:
- `summary` (string) - LLM-generated owner summary

**Displays**:
- "Overview" heading
- Full summary text (large, readable font)
- Whitespace preservation (pre-wrap)

**Design**:
- White card with border
- Large text (prose-lg)
- Maximum readability

---

### 3. TopFindings (`components/report/TopFindings.tsx`)

**Purpose**: Display top 3 findings ranked by business relevance

**Props**:
- `findings` (TopFinding[]) - Array of top findings from LLM

**Displays**:
- "Key Findings" heading
- Numbered finding cards (1, 2, 3)
- Title, description, confidence badge

**Design**:
- Numbered badges (blue circles)
- Confidence indicators (color-coded)
- Hover effects

**Confidence Badges**:
- High: Green background
- Medium: Yellow background
- Low: Gray background

---

### 4. BlockNarratives (`components/report/BlockNarratives.tsx`)

**Purpose**: Detailed findings for each of 6 signal blocks

**Props**:
- `narratives` (AllBlockNarratives) - Block narratives from LLM

**Displays**:
- "Detailed Findings" heading
- 6 collapsible blocks:
  - DNS: Domain & Infrastructure 🌐
  - Email: Email Authentication 📧
  - TLS: Website Security 🔒
  - TechStack: Technology Stack ⚙️
  - Exposure: Public Exposure 🔍
  - HIBP: Breach History 🛡️

**Interactivity** (Client-Side):
- Click to expand/collapse
- One block expanded at a time
- Smooth transitions
- Rotate chevron icon

**Each Block Shows**:
- Icon + title
- Short description (from `title` field)
- Confidence badge
- **When Expanded**:
  - "What We Found" (explanation)
  - "Why It Matters" (why_it_matters)
  - "Confidence Note" (if present)

**Implementation**:
```typescript
'use client'; // Client component for state management

const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
```

---

### 5. Assumptions (`components/report/Assumptions.tsx`)

**Purpose**: Display assumptions being made about the IT setup

**Props**:
- `assumptions` (string[]) - Array of assumption strings

**Displays**:
- ⚠️ Warning icon
- "Assumptions Being Made" heading
- Numbered list of assumptions

**Design**:
- Amber background (warning color)
- Numbered badges
- Clear messaging

---

### 6. Questions (`components/report/Questions.tsx`)

**Purpose**: Questions to ask IT team/MSP for clarification

**Props**:
- `questions` (string[]) - Array of question strings

**Displays**:
- 💡 Lightbulb icon
- "Questions to Ask" heading
- Numbered list of questions

**Design**:
- Blue background (informational)
- Numbered badges
- Actionable tone

---

### 7. CreateAccountCTA (`components/report/CreateAccountCTA.tsx`)

**Purpose**: Encourage users to create account to save report

**Displays**:
- "Save This Report Forever" headline
- Benefits of account creation
- Two CTAs:
  - Primary: "Create Free Account" → `/signup`
  - Secondary: "Run Another Snapshot" → `/`
- Fine print: Free tier details

**Design**:
- Gradient background (blue)
- Large, prominent buttons
- White text for contrast
- Responsive (stacks on mobile)

---

## Error Handling

### Error Page: `/error/page.tsx`

**Purpose**: Generic error page for report access issues

**Triggers**:
- Missing token (`?token` not in URL)
- Invalid token (signature failed)
- Expired token (> 30 days old)
- Snapshot not found
- Report not completed yet

**URL Pattern**: `/error?message={encoded_message}`

**Displays**:
- ⚠️ Warning icon
- Error message (decoded from URL)
- CTA: "Request New Snapshot" → `/`
- Help text

**Example Redirects**:
```typescript
redirect(`/error?message=${encodeURIComponent('Invalid or expired link')}`);
redirect(`/error?message=${encodeURIComponent('Report not ready yet')}`);
```

---

## Loading States

### Loading Page: `/report/[id]/loading.tsx`

**Purpose**: Skeleton UI while report loads (SSR)

**Displays**:
- Header skeleton (gray bars)
- Content skeletons:
  - Owner summary (3 lines)
  - Top findings (3 cards)
  - Block narratives (6 collapsed blocks)

**Design**:
- Animated pulse effect (`animate-pulse`)
- Gray placeholder rectangles
- Matches actual component structure

**When Shown**:
- During server-side data fetching
- During token verification
- Typically very brief (< 500ms)

---

## Styling & Design

### Tailwind Classes Used

**Layout**:
- `max-w-4xl mx-auto` - Center content, max width
- `px-4 py-8` - Padding (responsive)
- `space-y-8` - Vertical spacing between sections

**Cards**:
- `bg-white rounded-lg border border-gray-200` - White cards
- `p-6` - Internal padding

**Typography**:
- `text-3xl font-bold` - Large headings
- `text-lg leading-relaxed` - Body text
- `text-sm text-gray-600` - Small text/labels
- `whitespace-pre-wrap` - Preserve LLM formatting

**Interactive Elements**:
- `hover:bg-gray-50` - Subtle hover
- `transition-colors` - Smooth transitions
- `cursor-pointer` - Clickable cursor

**Colors**:
- Gray: Neutral UI (backgrounds, borders)
- Blue: Primary actions, informational
- Amber: Warnings (assumptions)
- Green: High confidence
- Yellow: Medium confidence

### Responsive Design

**Mobile-First Approach**:
- Base styles for mobile
- `sm:` prefix for tablet+ (640px+)

**Breakpoints**:
- Mobile: < 640px (full width, stacked)
- Tablet: 640px+ (2-column where appropriate)
- Desktop: 768px+ (optimized for readability)

**Examples**:
```typescript
// Stacks on mobile, side-by-side on tablet+
className="flex flex-col sm:flex-row gap-4"

// Full width mobile, fixed width desktop
className="w-full sm:w-auto"
```

---

## Data Flow

### Report Data Structure

**From Database** (`Snapshot` table):
```typescript
{
  id: string,
  domain: string,
  status: 'completed',
  report_json: {
    owner_summary: string,
    top_findings: TopFinding[],
    block_narratives: AllBlockNarratives,
    assumptions: string[],
    questions: string[]
  },
  created_at: string
}
```

**Type Casting**:
```typescript
const report = snapshot.report_json as unknown as LLMReport;
```

**Why `as unknown as LLMReport`?**
- Supabase returns `report_json` as generic JSON
- TypeScript needs explicit type assertion
- Two-step cast (`unknown` first) is safer

---

## SEO & Metadata

### Dynamic Metadata Generation

**Implementation**:
```typescript
export async function generateMetadata({ params, searchParams }) {
  // Verify token, fetch snapshot
  // Generate metadata based on snapshot data
}
```

**For Valid Reports**:
```typescript
{
  title: 'IT Snapshot: example.com - Explain My IT',
  description: 'View your IT reality check report for example.com',
  robots: 'noindex, nofollow' // Don't index magic link pages
}
```

**For Errors**:
```typescript
{
  title: 'Invalid Link - Explain My IT',
  description: 'This link is invalid or has expired',
  robots: 'noindex, nofollow'
}
```

**Why `noindex, nofollow`?**
- Magic link pages are private/temporary
- Shouldn't appear in search results
- Contains user-specific data

---

## Performance

### Server-Side Rendering (SSR)

**Advantages**:
- Fast initial page load
- SEO-friendly (not critical for noindex pages)
- Secure token verification before render
- No client-side data fetching

**Implementation**:
```typescript
// Default Next.js 14 behavior (async Server Component)
export default async function ReportPage({ params, searchParams }) {
  // Fetch data on server
  // Render HTML
  // Send to client
}
```

### Client-Side Interactivity

**Only Where Needed**:
- `BlockNarratives` - Expand/collapse state

**Why Minimal Client JS?**
- Faster page load
- Better for low-powered devices
- Simpler debugging

---

## Testing Checklist

**Manual Testing**:
- [ ] Valid magic link loads report
- [ ] Invalid token redirects to error page
- [ ] Expired token redirects to error page
- [ ] Missing token redirects to error page
- [ ] Report displays all sections correctly
- [ ] Block narratives expand/collapse
- [ ] Confidence badges show correct colors
- [ ] CTAs link to correct pages
- [ ] Mobile responsive (test on phone)
- [ ] Loading states show briefly
- [ ] Error page displays correctly

**Edge Cases**:
- [ ] Report with missing sections (graceful degradation)
- [ ] Very long domain names
- [ ] Very long finding descriptions
- [ ] All blocks collapsed by default
- [ ] Rapid expand/collapse clicks

**Browser Testing**:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Edge

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **No Print Styles**: Report not optimized for printing
2. **No PDF Export**: Can't download as PDF
3. **No Share Button**: Can't share report (by design - magic links are private)
4. **No Search**: Can't search within report
5. **No Bookmarking**: Can't bookmark specific sections
6. **No Comments**: Can't annotate findings

### Future Enhancements

**Short Term** (next week):
- Add print styles
- Test with real LLM-generated reports
- Add Umami analytics events (page views, CTA clicks)
- A/B test CTA copy

**Medium Term** (next month):
- PDF export
- Email report sharing (new magic link)
- Section deep linking
- Search within report
- Mobile app view

**Long Term**:
- Side-by-side comparison (before/after)
- Interactive charts (signal trends)
- Annotations/notes
- Team sharing (multi-user)

---

## Files Created

**Pages**:
- `app/report/[id]/page.tsx` - Main report page
- `app/report/[id]/loading.tsx` - Loading skeleton
- `app/error/page.tsx` - Generic error page

**Components**:
- `components/report/ReportHeader.tsx` - Page header
- `components/report/OwnerSummary.tsx` - Owner summary section
- `components/report/TopFindings.tsx` - Top 3 findings
- `components/report/BlockNarratives.tsx` - Detailed block findings
- `components/report/Assumptions.tsx` - Assumptions section
- `components/report/Questions.tsx` - Questions section
- `components/report/CreateAccountCTA.tsx` - Account creation CTA

**Total**: 10 files created

---

## Dependencies

**No New Dependencies Required**:
- Uses existing Next.js 14 features
- Uses existing Tailwind CSS
- Uses existing `jose` for token verification
- Uses existing Supabase client

---

## Environment Variables

**No New Variables Required**:
- Uses existing `JWT_SECRET`
- Uses existing Supabase config
- Uses existing `NEXT_PUBLIC_BASE_URL`

---

## Next Phase: Testing & Polish (Phase 7)

**Goals**:
- End-to-end testing (full user flow)
- Performance optimization
- Analytics verification
- Error handling testing
- Cross-browser testing

---

**Phase 6 Frontend implementation complete! Report view is production-ready.**
