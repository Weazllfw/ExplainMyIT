# Brevo Mailing List Integration - Source of Truth

## Overview

Explain My IT uses **Brevo** (formerly Sendinblue) for:
1. Transactional emails (snapshot reports, subscription emails)
2. Mailing list management (opted-in users for updates)

**Brevo Dashboard**: https://app.brevo.com/

## Mailing List Configuration

### List 18: General Mailing List

**Purpose**: Users who opt-in to receive updates about their IT setup

**Sources**:
1. **Snapshot Form** - Users requesting free snapshots who check opt-in box
2. **Signup Form** - Users creating accounts who check opt-in box
3. **Waitlist Form** - Users joining waitlist (different component)

**List ID**: `18` (hardcoded in implementation)

**Important**: If your Brevo List 18 doesn't exist or has a different ID:
1. Go to Brevo → Contacts → Lists
2. Find or create your general mailing list
3. Note the ID from the URL
4. Update in code:
   - `lib/brevo.ts` line 55
   - `app/api/brevo/add-to-waitlist/route.ts` line 34

## Implementation

### File Structure

```
lib/
├── brevo.ts                              # Main Brevo client
│   ├── addToWaitlist()                   # Add contact to List 18
│   └── calculateLeadScore()              # Score contacts
├── email/
│   └── brevo-client.ts                   # Email sending functions
│       ├── sendEmail()                   # Send transactional email
│       ├── sendTemplateEmail()           # Send template-based email
│       └── createOrUpdateContact()       # Contact management

app/api/
├── snapshot/route.ts                     # Calls addToWaitlist() directly
└── brevo/add-to-waitlist/route.ts        # API endpoint for frontend calls

components/
├── SnapshotRequestForm.tsx               # Homepage form with opt-in
└── auth/SignupForm.tsx                   # Signup form with opt-in
```

### Environment Variables

```bash
BREVO_API_KEY=xkeysib-xxxxx...
```

Required in:
- `.env.local` (development)
- Vercel Environment Variables (production)

## Opt-in Flows

### Flow 1: Snapshot Form Opt-in

**Component**: `components/SnapshotRequestForm.tsx`

**User Journey**:
1. User visits homepage
2. Fills email + domain
3. ✅ Checks "Keep me updated about my IT setup"
4. Submits form
5. API receives `optIntoEmails: true`
6. **Server-side** calls `addToWaitlist()` from `lib/brevo.ts`
7. Contact added to List 18 with attributes:
   - `SIGNUP_SOURCE`: free-snapshot
   - `SIGNUP_PAGE`: snapshot-form
   - `LEAD_STATUS`: new

**Code**:
```typescript
// In SnapshotRequestForm.tsx
const [optIntoEmails, setOptIntoEmails] = useState(false);

// Submit to API
const response = await fetch('/api/snapshot', {
  method: 'POST',
  body: JSON.stringify({ email, domain, optIntoEmails }),
});

// In app/api/snapshot/route.ts (SERVER-SIDE)
if (optIntoEmails && !userId) {
  const brevoResult = await addToWaitlist({
    email,
    companySize: 'Not provided',
    hasIT: 'Not provided',
    signupSource: 'free-snapshot',
    signupPage: 'snapshot-form',
    utmSource: 'snapshot-opt-in',
  });
}
```

**Analytics Events**:
- `email-opt-in-checked` - User checks box (source: 'snapshot-form')
- `snapshot-requested` - Form submitted with domain

**Notes**:
- Only non-authenticated users are added (check: `!userId`)
- Authenticated users already in system
- Failures don't block snapshot creation

---

### Flow 2: Signup Form Opt-in (NEW)

**Component**: `components/auth/SignupForm.tsx`

**User Journey**:
1. User visits /signup
2. Fills signup form (email, password, name)
3. ✅ Checks "Keep me updated about my IT setup and new features"
4. Submits form
5. Account created successfully
6. **Client-side** calls `/api/brevo/add-to-waitlist`
7. Contact added to List 18 with attributes:
   - `SIGNUP_SOURCE`: account-signup
   - `SIGNUP_PAGE`: signup-form
   - `LEAD_STATUS`: new

**Code**:
```typescript
// In SignupForm.tsx
const [optIntoEmails, setOptIntoEmails] = useState(false);

// After successful signup (CLIENT-SIDE)
if (optIntoEmails) {
  const brevoResponse = await fetch('/api/brevo/add-to-waitlist', {
    method: 'POST',
    body: JSON.stringify({
      email: formData.email,
      listId: 18,
      attributes: {
        SIGNUP_SOURCE: 'account-signup',
        SIGNUP_PAGE: 'signup-form',
        LEAD_STATUS: 'new',
      },
    }),
  });
}
```

**Analytics Events**:
- `email-opt-in-checked` - User checks box (source: 'signup-form')
- `email-opt-in-submitted` - Successfully added to Brevo (source: 'signup-form')
- `form-submitted` - Signup completed (formName: 'signup')
- `user-signed-up` - Account created

**Notes**:
- Runs client-side after account creation
- Doesn't block signup if Brevo fails
- Logs to browser console for debugging

---

## API Endpoints

### `/api/brevo/add-to-waitlist`

**Purpose**: Add contact to Brevo mailing list

**Method**: POST

**Request Body**:
```typescript
{
  email: string;          // Required
  listId?: number;        // Optional, defaults to 18
  attributes?: {          // Optional
    SIGNUP_SOURCE?: string;
    SIGNUP_PAGE?: string;
    LEAD_STATUS?: string;
    // ... any other attributes
  }
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Error Handling**:
- 400 with `duplicate_parameter` → Updates existing contact → Returns success
- Other errors → Returns error message
- Network errors → Logs and returns error

---

## Contact Attributes

All contacts in List 18 get these attributes:

| Attribute | Type | Example | Source |
|-----------|------|---------|--------|
| `SIGNUP_DATE` | String | "2026-02-02" | Auto-generated (YYYY-MM-DD) |
| `SIGNUP_SOURCE` | String | "free-snapshot" | Where they opted in |
| `SIGNUP_PAGE` | String | "snapshot-form" | Page name |
| `LEAD_STATUS` | String | "new" | Always "new" initially |
| `LEAD_SCORE` | Number | 50 | Calculated score |
| `COMPANY_SIZE` | String | "Not provided" | From form (if available) |
| `HAS_IT` | String | "Not provided" | From form (if available) |
| `UTM_SOURCE` | String | "snapshot-opt-in" | Marketing attribution |
| `UTM_MEDIUM` | String | "" | Marketing attribution |
| `UTM_CAMPAIGN` | String | "" | Marketing attribution |
| `REFERRER` | String | "" | HTTP referrer |

---

## Debugging

### Enable Comprehensive Logging

All Brevo calls now log with `[BREVO]` prefix:

**Snapshot Form**:
```
📧 [BREVO] Adding test@example.com to mailing list (List 18)...
📧 [BREVO] Opt-in data: { email, signupSource: 'free-snapshot', ... }
[BREVO addToWaitlist] Called with: { email: 'test@example.com', signupSource: 'free-snapshot' }
[BREVO addToWaitlist] Sending to List 18: { email, listIds: [18], ... }
[BREVO addToWaitlist] Response status: 201
[BREVO addToWaitlist] ✅ Contact added/updated successfully to List 18
✅ [BREVO] Successfully added test@example.com to List 18
```

**Signup Form**:
```
✅ Added to Brevo mailing list (List 18)
📊 [Umami Event] email-opt-in-submitted { source: 'signup-form' }
```

### Check Vercel Logs

1. Go to: https://vercel.com/[project]/logs
2. Filter by: "BREVO"
3. Look for:
   - `[BREVO addToWaitlist] Called with:`
   - `Response status: 201` or `204`
   - `✅ Contact added/updated successfully`

### Check Browser Console

**Snapshot Form**:
- Events fire client-side
- Brevo call happens server-side (no browser logs for API call)
- Check Vercel logs instead

**Signup Form**:
- Full flow in browser console
- Look for: `✅ Added to Brevo mailing list (List 18)`

### Verify in Brevo Dashboard

1. Go to: https://app.brevo.com/
2. Click: Contacts → Lists
3. Open: List 18
4. Search for test email
5. Click contact to see attributes

**Expected Attributes**:
- Email address
- `SIGNUP_DATE`: Today's date
- `SIGNUP_SOURCE`: "free-snapshot" or "account-signup"
- `SIGNUP_PAGE`: "snapshot-form" or "signup-form"
- `LEAD_STATUS`: "new"

---

## Testing Guide

### Test Snapshot Form

1. **Go to**: https://explainmyit.com
2. **Fill form**:
   - Email: `test+snapshot@yourdomain.com`
   - Domain: `test.com`
3. **✅ Check** opt-in box
4. **Submit**
5. **Check** Vercel logs for `[BREVO]` messages
6. **Verify** in Brevo List 18

### Test Signup Form

1. **Go to**: https://explainmyit.com/signup
2. **Fill form**:
   - Email: `test+signup@yourdomain.com`
   - Password: `testpass123`
3. **✅ Check** opt-in box
4. **Submit**
5. **Check** browser console for success message
6. **Verify** in Brevo List 18

### Test Without Opt-in

Same as above but **DON'T check** the box.

**Expected**: Contact NOT added to List 18.

---

## Troubleshooting

### Issue: "Email service is not configured"

**Cause**: `BREVO_API_KEY` not set

**Fix**:
1. Go to Brevo → Settings → API Keys
2. Copy your API key (starts with `xkeysib-`)
3. Add to Vercel environment variables
4. Redeploy

### Issue: Logs show "Called with:" but no "Response status:"

**Cause**: Brevo API request failing (network, timeout, invalid key)

**Fix**:
1. Check API key is valid
2. Test API key with curl:
```bash
curl -X GET https://api.brevo.com/v3/account \
  -H "api-key: YOUR_KEY"
```
3. Check Brevo account status

### Issue: Status 400 but NOT duplicate_parameter

**Cause**: Invalid request format or missing required Brevo contact attributes

**Fix**:
1. Check error message in logs
2. Verify all required attributes exist in Brevo
3. Create missing attributes in Brevo dashboard

### Issue: Contacts in Brevo but not List 18

**Cause**: Contacts created but not assigned to list

**Fix**:
1. Check `listIds: [18]` in code
2. Verify List 18 exists in Brevo
3. Manually add contact to list to test
4. Check Brevo contact permissions

---

## Environment Setup

### Required Brevo Configuration

1. **API Key**: Settings → API Keys → Create/Copy
2. **List 18**: Contacts → Lists → Create or find existing
3. **Contact Attributes**: Ensure these exist:
   - `SIGNUP_DATE` (Date)
   - `SIGNUP_SOURCE` (Text)
   - `SIGNUP_PAGE` (Text)
   - `LEAD_STATUS` (Text)
   - `LEAD_SCORE` (Number)
   - `COMPANY_SIZE` (Text)
   - `HAS_IT` (Text)
   - `UTM_SOURCE` (Text)
   - `UTM_MEDIUM` (Text)
   - `UTM_CAMPAIGN` (Text)
   - `REFERRER` (Text)

**Note**: Brevo auto-creates attributes if they don't exist, but it's better to define them upfront.

### Create Attributes in Brevo

1. Go to: Contacts → Settings → Contact attributes
2. Click: "Create a new attribute"
3. For each attribute above:
   - Name: (exact match, e.g., `SIGNUP_SOURCE`)
   - Type: Text or Number
   - Category: Normal
   - Save

---

## Integration Points

### Where Opt-in Checkboxes Appear

1. **Homepage** (`/`)
   - Component: `SnapshotRequestForm`
   - Label: "Keep me updated about my IT setup (occasional emails, unsubscribe anytime)"
   - Default: Unchecked
   - Triggers: Server-side Brevo call

2. **Signup Page** (`/signup`)
   - Component: `SignupForm`
   - Label: "Keep me updated about my IT setup and new features (occasional emails, unsubscribe anytime)"
   - Default: Unchecked
   - Triggers: Client-side Brevo API call

### Where Brevo Calls Happen

**Server-side** (Snapshot Form):
- File: `app/api/snapshot/route.ts`
- Function: `addToWaitlist()` from `lib/brevo.ts`
- Context: Node.js runtime (access to env vars)
- Timing: During snapshot generation

**Client-side** (Signup Form):
- File: `components/auth/SignupForm.tsx`
- Endpoint: `/api/brevo/add-to-waitlist`
- Context: Browser (fetch to API endpoint)
- Timing: After successful account creation

---

## API Reference

### `addToWaitlist(data: WaitlistFormData)`

**Location**: `lib/brevo.ts`

**Purpose**: Add contact to List 18 with full lead scoring

**Parameters**:
```typescript
interface WaitlistFormData {
  email: string;              // Required
  companySize?: string;       // Optional
  hasIT?: string;             // Optional
  utmSource?: string;         // Optional
  utmMedium?: string;         // Optional
  utmCampaign?: string;       // Optional
  referrer?: string;          // Optional
  signupPage?: string;        // Optional
  signupSource?: string;      // Optional
}
```

**Returns**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Used By**:
- `app/api/snapshot/route.ts` (snapshot form opt-in)
- `app/api/waitlist/route.ts` (waitlist form)

---

### POST `/api/brevo/add-to-waitlist`

**Purpose**: Simple endpoint for adding contacts to List 18

**Request**:
```typescript
{
  email: string;          // Required
  listId?: number;        // Optional, defaults to 18
  attributes?: {          // Optional
    SIGNUP_SOURCE?: string;
    SIGNUP_PAGE?: string;
    [key: string]: any;
  }
}
```

**Response**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Used By**:
- `components/auth/SignupForm.tsx` (signup form opt-in)

**Error Handling**:
- Duplicate contacts: Updates existing, returns success
- Missing API key: Returns 500 error
- Brevo API errors: Returns specific error message

---

## Lead Scoring

**Purpose**: Qualify leads based on provided information

**Base Score**: 50

**Scoring Rules**:
- Company size 151+: +30
- Company size 51-150: +20
- Company size 11-50: +10
- Has MSP: +15
- Has IT: +10
- Provided both company size & IT: +10
- Referral source: +10
- LinkedIn referrer: +5

**Range**: 0-100 (capped)

**Usage**: Stored as `LEAD_SCORE` attribute in Brevo

---

## Analytics Tracking

### Opt-in Events

**User Checks Box**:
```typescript
Analytics.emailOptInChecked(source: 'snapshot-form' | 'signup-form')
```

Event: `email-opt-in-checked`
Data: `{ source }`

**User Successfully Added**:
```typescript
Analytics.emailOptInSubmitted(source: 'snapshot-form' | 'signup-form', domain?)
```

Event: `email-opt-in-submitted`  
Data: `{ source, domain? }`

### Metrics to Track

- **Opt-in Rate**: `email-opt-in-checked` / total form submissions
- **Conversion Rate**: `email-opt-in-submitted` / `email-opt-in-checked`
- **List Growth**: Total contacts in List 18 over time

---

## Error Handling

### Philosophy

**Never block user flow for Brevo failures**

- Snapshot form: Brevo failure doesn't prevent snapshot creation
- Signup form: Brevo failure doesn't prevent account creation
- All errors logged for monitoring
- Users never see Brevo errors

### Error Logging

All functions log with prefix for easy filtering:

```
[BREVO addToWaitlist] - Main function logs
[BREVO] - General Brevo-related logs
```

**Success Logs**:
```
✅ [BREVO] Successfully added {email} to List 18
[BREVO addToWaitlist] ✅ Contact added/updated successfully to List 18
```

**Error Logs**:
```
❌ [BREVO] Failed to add to List 18: {error}
[BREVO addToWaitlist] ❌ API error: {errorData}
[BREVO addToWaitlist] ❌ Exception: {error}
```

---

## Maintenance

### Regular Checks

- Monitor List 18 growth in Brevo dashboard
- Review Vercel logs for Brevo errors
- Check contact attributes are setting correctly
- Verify opt-in rates in Umami analytics

### When to Update

- Creating new opt-in points → Add similar implementation
- Changing list segmentation → Update list IDs
- Adding new attributes → Update contact data in code
- Migrating to different email service → Replace Brevo client

---

## Related Documentation

- `Docs/BREVO-TESTING-GUIDE.md` - Step-by-step testing
- `Docs/BREVO-MAILING-LIST-FIX.md` - Recent fixes applied
- `Docs/Source of Truth/Email-System-Architecture.md` - Email system overview
- `Docs/WorkDone/BREVO-OPT-IN-IMPLEMENTATION-COMPLETE.md` - Original implementation

---

**Last Updated**: February 2, 2026  
**Status**: ✅ Both opt-in flows implemented  
**List ID**: 18 (General Mailing List)  
**API**: Brevo v3  
**Testing**: Required - deploy and verify
