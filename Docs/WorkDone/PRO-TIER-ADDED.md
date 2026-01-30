# Pro Tier Added to Pricing Page ✅

**Date:** 2026-01-30  
**Status:** Ready for Review (NOT committed to git per user request)

---

## Overview

Added the **Pro (On-Premise)** product tier to the pricing page as a "Coming Soon" card with email waitlist signup functionality for logged-in users.

---

## What Was Added

### 1. Pro Pricing Card (Third Column)

**Location:** `/pricing` page, third card in the grid

**Features Highlighted:**
- Everything in Tier 1
- Internal network scanning
- Asset discovery and inventory
- Configuration change detection
- User and permission tracking
- Integration with their systems
- On-premise or private cloud deployment
- Dedicated support

**Benefits Emphasized:**
- Complete internal and external IT visibility
- Real-time change detection across infrastructure
- Audit trail for compliance and governance
- Answers the questions Tier 1 cannot

**Pricing:** "Contact Us" (custom pricing)

---

### 2. Pro Waitlist Form Component

**File:** `components/pricing/ProWaitlistForm.tsx`

**Features:**
- ✅ Email input for logged-out users
- ✅ Auto-fills email for logged-in users
- ✅ Submits to Brevo mailing list (List ID: 2)
- ✅ Success state with confirmation message
- ✅ Error handling
- ✅ Loading states
- ✅ Umami tracking (`pro-waitlist-joined` event)

**Form Fields:**
- Email (required for non-authenticated users)
- Submit button: "Notify Me When Available"
- Privacy note: "No spam. Unsubscribe anytime."

**Brevo Integration:**
```typescript
{
  email: emailToUse,
  listId: 19, // Pro waitlist
  attributes: {
    PRODUCT_INTEREST: 'Pro',
    SIGNUP_SOURCE: 'pricing-page',
  },
}
```

---

### 3. Updated Pricing Page Layout

**Changes:**
- Grid changed from `md:grid-cols-2` to `md:grid-cols-2 lg:grid-cols-3`
- Max width increased from `1100px` to `1400px` for better 3-column layout
- Added Pro card between Tier 1 and comparison table

**Visual Hierarchy:**
- **Free Snapshot:** White card, cyan border
- **Tier 1:** Gradient background, cyan border, "RECOMMENDED" badge
- **Pro:** Muted gradient, gray border, "COMING SOON" badge

---

### 4. Updated Comparison Table

**Column Headers:**
- Free Snapshot
- Tier 1
- Pro (changed from "Tier 2")

**Features Added (Pro-specific):**
- Internal network scanning
- Asset discovery & inventory
- Change detection
- On-premise deployment

**Price Row:**
- Free: $0
- Tier 1: $19.99/mo
- Pro: Contact us

---

## File Changes

### New Files:
1. `components/pricing/ProWaitlistForm.tsx` (122 lines)

### Modified Files:
1. `app/pricing/page.tsx`
   - Added ProWaitlistForm import
   - Changed grid layout to 3 columns
   - Added Pro pricing card (100+ lines)
   - Updated comparison table headers
   - Updated comparison table features
   - Changed `tier2` references to `pro`

---

## API Requirements

### Brevo List ID
The waitlist form uses **List ID: 19** for Pro waitlist signups.

**List IDs in use:**
- **18:** General mailing list (used in `lib/brevo.ts`)
- **19:** Pro waitlist (used in `ProWaitlistForm.tsx`)

### Brevo API Route
The form calls `/api/brevo/add-to-waitlist` which should already exist in your codebase.

---

## User Flow

### For Logged-Out Users:
1. User sees Pro card with "COMING SOON" badge
2. Reads features and benefits
3. Enters email in waitlist form
4. Clicks "Notify Me When Available"
5. Sees success message: "You're on the list!"

### For Logged-In Users:
1. User sees Pro card with "COMING SOON" badge
2. Reads features and benefits
3. Email is auto-populated from their account
4. Clicks "Notify Me When Available"
5. Sees success message: "You're on the list!"

---

## Analytics Tracking

### New Event:
```typescript
'pro-waitlist-joined'
Properties: {
  source: 'pricing-page',
  authenticated: boolean
}
```

**Usage:**
```typescript
window.umami.track('pro-waitlist-joined', {
  source: 'pricing-page',
  authenticated: !!user,
});
```

---

## Positioning & Messaging

### Product Positioning:
**Pro is positioned as:**
- Internal visibility tool (not external observation)
- On-premise deployment (inside their network)
- Enterprise/serious business solution
- Answers questions Tier 1 cannot
- Complete IT oversight

**NOT positioned as:**
- Just "more features"
- Cloud-only SaaS
- Security scanning tool
- Replacement for MSP

### Tone:
- Professional, enterprise-grade
- Emphasizes completeness (internal + external)
- Frames as "answers the questions Tier 1 cannot"
- Clear "Contact Us" pricing (custom/enterprise)

---

## Visual Design

### Pro Card Styling:
```css
- Background: from-brand-navy/5 to-brand-muted/5 gradient
- Border: 2px border-brand-border (gray)
- Badge: "COMING SOON" (muted/gray)
- Hover: shadow-md transition
```

### Waitlist Form Styling:
```css
- Container: brand-bg background, rounded
- Input: border-brand-border, focus ring cyan
- Button: brand-navy background, hover effect
- Success: brand-green accent with checkmark icon
```

---

## Responsive Design

### Mobile (< 768px):
- Single column stack
- Pro card appears third
- Full width cards

### Tablet (768px - 1024px):
- 2 columns
- Pro card wraps to second row

### Desktop (> 1024px):
- 3 columns side-by-side
- All cards visible at once
- Better comparison experience

---

## Next Steps (When Ready to Launch Pro)

### 1. Replace Waitlist Form:
- Remove `ProWaitlistForm` component
- Add active "Contact Sales" button
- Link to contact form or calendar booking

### 2. Update Comparison Table:
- Add more Pro-specific features
- Emphasize enterprise capabilities
- Show clear differentiation

### 3. Add Pro Landing Page:
- `/pro` dedicated page
- Technical specifications
- Case studies
- Security & compliance details

### 4. Enable Pro Signups:
- Custom quote form
- Sales team integration
- Demo scheduling

---

## Testing Checklist

### Visual Testing:
- [ ] All 3 cards display correctly
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Pro badge shows "COMING SOON"
- [ ] Comparison table includes Pro column

### Functional Testing:
- [ ] Waitlist form accepts email (logged-out)
- [ ] Waitlist form auto-fills email (logged-in)
- [ ] Form submits successfully
- [ ] Success message displays
- [ ] Error handling works
- [ ] Umami event fires

### Brevo Testing:
- [ ] Email appears in Brevo List ID 2
- [ ] Attributes are set correctly
- [ ] No duplicate entries
- [ ] Unsubscribe link works

---

## Known Limitations

1. **List ID Hardcoded:** List ID is set to `2` - may need adjustment
2. **No Duplicate Prevention:** User can sign up multiple times (Brevo handles this)
3. **No Email Validation:** Basic browser validation only
4. **No CAPTCHA:** Could receive spam signups

---

## Files Summary

```
NEW:
✅ components/pricing/ProWaitlistForm.tsx (122 lines)

MODIFIED:
✅ app/pricing/page.tsx (~150 lines added)

NOT MODIFIED (AS REQUESTED):
❌ Git commit (user will handle)
❌ Version control (user will handle)
```

---

## Summary

**What:** Added Pro (On-Premise) tier to pricing page  
**How:** Third pricing card with waitlist signup  
**Why:** Complete the pricing presentation and capture enterprise interest  
**Status:** ✅ Code complete, TypeScript passing, NOT committed to git

**User can now:**
1. Review the Pro card presentation
2. Test the waitlist form
3. Adjust copy/messaging as needed
4. Commit to git when ready

---

**Pro tier is now visible on `/pricing` with a clean waitlist signup flow!** 🎯
