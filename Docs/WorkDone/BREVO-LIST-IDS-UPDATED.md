# Brevo List IDs Updated ✅

**Date:** 2026-01-30  
**Status:** Complete (NOT committed to git per user request)

---

## Summary

Updated all Brevo mailing list IDs throughout the codebase to use the correct list IDs:
- **List 18:** General mailing list
- **List 19:** Pro waitlist

---

## Changes Made

### 1. Pro Waitlist Form
**File:** `components/pricing/ProWaitlistForm.tsx`

**Changed:**
```typescript
// Before
listId: 2, // Pro waitlist

// After
listId: 19, // Pro waitlist
```

---

### 2. General Mailing List (Already Correct)
**File:** `lib/brevo.ts`

**Verified:**
```typescript
listIds: [18], // Early Access Waitlist
```

✅ No changes needed - already correct!

---

### 3. New API Endpoint Created
**File:** `app/api/brevo/add-to-waitlist/route.ts` (NEW)

**Purpose:** Handle custom list ID signups (like Pro waitlist)

**Features:**
- Accepts `email`, `listId`, and `attributes` parameters
- Defaults to list 18 if no listId specified
- Handles existing contacts (updates instead of errors)
- Proper error handling and logging

**Usage:**
```typescript
fetch('/api/brevo/add-to-waitlist', {
  method: 'POST',
  body: JSON.stringify({
    email: 'user@example.com',
    listId: 19, // Pro waitlist
    attributes: {
      PRODUCT_INTEREST: 'Pro',
      SIGNUP_SOURCE: 'pricing-page',
    },
  }),
});
```

---

### 4. Documentation Updated
**File:** `Docs/WorkDone/PRO-TIER-ADDED.md`

**Updated sections:**
- Brevo Integration code example (2 → 19)
- Brevo List ID section (clarified IDs)

---

## List ID Reference

### List 18: General Mailing List
**Used by:**
- `lib/brevo.ts` → `addToWaitlist()` function
- Snapshot form opt-in (via `addToWaitlist`)
- Homepage waitlist form (via `addToWaitlist`)
- Any general interest signups

**Attributes set:**
- `COMPANY_SIZE`
- `HAS_IT`
- `SIGNUP_DATE`
- `SIGNUP_SOURCE`
- `SIGNUP_PAGE`
- `LEAD_SCORE`
- `LEAD_STATUS`
- Plus UTM tracking

---

### List 19: Pro Waitlist
**Used by:**
- `components/pricing/ProWaitlistForm.tsx`
- Pro product interest signups on pricing page

**Attributes set:**
- `PRODUCT_INTEREST`: 'Pro'
- `SIGNUP_SOURCE`: 'pricing-page'
- `SIGNUP_DATE`

---

## File Changes Summary

### New Files:
1. ✅ `app/api/brevo/add-to-waitlist/route.ts` (new endpoint)

### Modified Files:
1. ✅ `components/pricing/ProWaitlistForm.tsx` (list ID 2 → 19)
2. ✅ `Docs/WorkDone/PRO-TIER-ADDED.md` (documentation)
3. ✅ `Docs/WorkDone/BREVO-LIST-IDS-UPDATED.md` (this file)

### Verified (No Changes Needed):
1. ✅ `lib/brevo.ts` (already using list 18)
2. ✅ `app/api/snapshot/route.ts` (uses `addToWaitlist` from lib/brevo.ts)
3. ✅ `app/api/waitlist/route.ts` (uses `addToWaitlist` from lib/brevo.ts)

---

## Testing Checklist

### List 18 (General):
- [ ] Homepage waitlist form → adds to list 18
- [ ] Snapshot opt-in checkbox → adds to list 18
- [ ] Verify attributes are set correctly
- [ ] Check for duplicates (should update existing)

### List 19 (Pro):
- [ ] Pricing page Pro waitlist → adds to list 19
- [ ] Logged-in users auto-fill email
- [ ] Logged-out users can enter email
- [ ] Success message displays
- [ ] Verify attributes are set correctly

---

## Brevo Dashboard Verification

**After deploying, verify in Brevo:**

1. **List 18 (General Mailing List):**
   - Go to Brevo → Contacts → Lists → List 18
   - Verify new signups appear here
   - Check attributes are populated

2. **List 19 (Pro Waitlist):**
   - Go to Brevo → Contacts → Lists → List 19
   - Verify Pro signups appear here
   - Check `PRODUCT_INTEREST` = 'Pro'

---

## API Endpoint Details

### `/api/brevo/add-to-waitlist`

**Method:** POST

**Request Body:**
```typescript
{
  email: string;          // Required
  listId?: number;        // Optional, defaults to 18
  attributes?: {          // Optional
    [key: string]: string | number;
  };
}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid email
- `500`: Server/Brevo error

---

## Environment Variables

**Required:**
```env
BREVO_API_KEY=xkeysib-xxxxx
```

**Already configured in `.env.local`** ✅

---

## Future List IDs (Planning)

When adding more lists in the future:

**Suggested structure:**
- **18:** General mailing list (current ✅)
- **19:** Pro waitlist (current ✅)
- **20:** (Reserved for future use)
- **21:** Enterprise contacts
- **22:** Partner inquiries
- **23:** Newsletter subscribers

**To add a new list:**
1. Create list in Brevo Dashboard
2. Note the List ID
3. Update relevant forms/components
4. Update this documentation

---

## TypeScript Status

✅ **All types pass** - no errors

---

## Summary

**What changed:**
- Pro waitlist now correctly uses list ID 19
- General mailing list verified as using list ID 18
- New API endpoint created for flexible list ID handling

**What stayed the same:**
- General mailing list logic (`lib/brevo.ts`)
- Snapshot opt-in flow
- Homepage waitlist form

**Status:** Ready to test (NOT committed to git)

---

**All Brevo list IDs are now correctly configured!** ✅
