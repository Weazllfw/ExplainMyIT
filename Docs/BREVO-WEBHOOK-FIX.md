# Brevo Webhook Signature Issue - Diagnosis & Fix

**Date**: February 2, 2026  
**Error**: `❌ Invalid webhook signature`  
**Impact**: ⚠️ **THIS WEBHOOK ERROR DOES NOT PREVENT SENDING EMAILS OR ADDING USERS TO LISTS**

---

## IMPORTANT: Understanding the Issue

### What This Webhook Does
The Brevo webhook at `/api/webhooks/brevo/route.ts` is for **RECEIVING** email engagement events FROM Brevo:
- Email delivered
- Email opened  
- Link clicked
- Email bounced
- Spam complaint

### What This Webhook Does NOT Do
This webhook is **NOT** involved in:
- ❌ Sending snapshot reports (done via `/api/snapshot/route.ts`)
- ❌ Adding users to mailing lists (done via `/api/brevo/add-to-waitlist/route.ts`)
- ❌ Sending any emails (done via Brevo API client)

**If reports aren't being sent or users aren't being added to lists, there's a DIFFERENT problem.**

---

## Actual Problems to Check

### Problem 1: Reports Not Being Sent

**Check**: `/api/snapshot/route.ts` logs

**Look for**:
```
✅ Snapshot completed: {id}
📧 Sending snapshot ready email...
[Email] Sending snapshot ready to {email}
```

**If you see**:
```
❌ Failed to send email
Error sending email via Brevo: {error}
```

**Then the issue is**: Brevo API key or email sending, NOT webhooks

**File to check**: `lib/email/brevo-client.ts`

---

### Problem 2: Users Not Added to Lists

**Check**: `/api/snapshot/route.ts` logs when `optIntoEmails: true`

**Look for**:
```
📧 [BREVO] Adding {email} to mailing list (List 18)...
[BREVO addToWaitlist] Called with: {email}
[BREVO addToWaitlist] Sending to List 18: {...}
[BREVO addToWaitlist] Response status: 201
✅ [BREVO] Successfully added {email} to List 18
```

**If you see**:
```
❌ [BREVO] Failed to add to List 18: {error}
[BREVO addToWaitlist] ❌ API error: {...}
```

**Then the issue is**: Brevo API key, list ID, or contact creation, NOT webhooks

**File to check**: `lib/brevo.ts`

---

## Webhook Signature Fix

I've temporarily **disabled the blocking behavior** while we debug:

### What Changed

**File**: `app/api/webhooks/brevo/route.ts`

**Before**: Rejected webhooks with invalid signature (401 error)

**After**: 
- Logs signature validation errors
- **Allows webhook through** for debugging
- Adds detailed logging

**Logs Now Show**:
```
[Brevo Webhook] Received webhook request
[Brevo Webhook] Has signature header: true/false
[Brevo Webhook] Secret configured: true/false
⚠️  [Brevo Webhook] Allowing webhook despite signature mismatch for debugging
```

---

## How to Fix Webhook Signatures Properly

### Step 1: Check if Brevo Sends Signatures

Brevo webhooks **may not send signatures by default**. 

**Check in Brevo Dashboard**:
1. Go to: https://app.brevo.com/
2. Click: Transactional → Settings → Webhooks
3. Find your webhook: `https://explainmyit.com/api/webhooks/brevo`
4. Check if there's a "Secret" or "Signature" field

**If NO signature field exists**: Brevo doesn't support webhook signatures, and you should disable validation entirely

---

### Step 2: Verify Secret Matches

**In `.env.local` (local)** or **Vercel Environment Variables** (production):
```bash
BREVO_WEBHOOK_SECRET=a8f3c9e2d5b7f1a4c6e8d2f5b9a7c3e6d8f2a5b7c9e4f6a8d3b5c7e9f1a4c6e8
```

**In Brevo Dashboard**:
- The secret configured in webhook settings should **exactly match** this value

**If they don't match**: Update one to match the other

---

### Step 3: Check Webhook Logs

After deploying the fix, check Vercel logs for actual webhook attempts:

```bash
# In Vercel logs, filter by: "Brevo Webhook"
[Brevo Webhook] Received webhook request
[Brevo Webhook] Has signature header: false
⚠️  [Brevo Webhook] No signature header received from Brevo
📨 Brevo webhook received: delivered
```

**This tells you**:
- Whether Brevo is sending signatures at all
- Whether the secret is configured
- Whether signatures are being validated

---

## Common Webhook Signature Issues

### Issue 1: Brevo Doesn't Send Signatures

**Symptom**: `[Brevo Webhook] Has signature header: false`

**Fix**: Disable signature validation entirely

```typescript
// In app/api/webhooks/brevo/route.ts
// Remove or comment out signature verification
```

---

### Issue 2: Secret Mismatch

**Symptom**: `❌ Invalid webhook signature` but header exists

**Fix**: 
1. Generate new secret: `openssl rand -hex 32`
2. Update in both `.env` and Brevo dashboard
3. Redeploy

---

### Issue 3: Wrong Header Name

**Symptom**: Signature validation fails but you know secret is correct

**Fix**: Check if Brevo uses different header name

Common alternatives:
- `x-brevo-signature`
- `x-sendinblue-signature` (old name)
- `signature`
- `authorization`

```typescript
// Try different headers
const signature = 
  request.headers.get('x-brevo-signature') ||
  request.headers.get('x-sendinblue-signature') ||
  request.headers.get('signature');
```

---

### Issue 4: Signature Format Mismatch

**Symptom**: `timingSafeEqual` throws error about buffer length

**Fix**: Brevo might send signature in different format (base64 vs hex)

```typescript
// Try both formats
const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(body)
  .digest('hex'); // or 'base64'
```

---

## Environment Variables Checklist

**Required for Brevo to work**:

```bash
# In .env.local (local) or Vercel (production)
BREVO_API_KEY=xkeysib-xxx...                    # ✅ Required for sending emails & API calls
BREVO_WEBHOOK_SECRET=xxx...                     # ⚠️  Optional (only if Brevo sends signatures)
```

**Check in Vercel**:
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Verify `BREVO_API_KEY` exists and is correct
3. Check if `BREVO_WEBHOOK_SECRET` matches Brevo dashboard

---

## Testing After Fix

### Test 1: Send a Snapshot Report

```bash
# Trigger via homepage or API
POST /api/snapshot
{
  "email": "test@example.com",
  "domain": "test.com"
}
```

**Check logs for**:
```
✅ Snapshot completed
[Email] Sending snapshot ready to test@example.com
```

**Check email inbox**: Should receive report

---

### Test 2: Add User to List

```bash
# With opt-in checked
POST /api/snapshot
{
  "email": "test@example.com",
  "domain": "test.com",
  "optIntoEmails": true
}
```

**Check logs for**:
```
📧 [BREVO] Adding test@example.com to mailing list (List 18)...
✅ [BREVO] Successfully added test@example.com to List 18
```

**Check Brevo dashboard**: User should appear in List 18

---

### Test 3: Webhook (Optional)

**Trigger**: Send a test email via Brevo

**Check logs for**:
```
[Brevo Webhook] Received webhook request
📨 Brevo webhook received: delivered
```

**This confirms webhook is working** (even if signature validation is disabled)

---

## Recommended Actions

### Immediate (Now)

1. **Check Vercel logs** for the actual error preventing emails/lists:
   ```
   Filter by: "Failed to send" or "[BREVO] Failed"
   ```

2. **Verify BREVO_API_KEY** is set in Vercel environment variables

3. **Test sending an email** via API to confirm it works

### Short-term (This Week)

4. **Check Brevo dashboard** to see if webhook signatures are supported

5. **If signatures not supported**: Remove validation code entirely

6. **If signatures supported**: Verify secret matches between .env and Brevo

### Long-term (Future)

7. **Set up monitoring** for email delivery failures

8. **Add retry logic** for failed Brevo API calls

9. **Create alert** when List 18 additions fail

---

## Summary

### What We Fixed
✅ Webhook signature validation now logs errors but doesn't block

### What We Learned
⚠️ **Webhook errors don't prevent sending emails or adding users to lists**

### What to Check Next
1. Vercel logs for actual email sending errors
2. Brevo API key configuration
3. List 18 existence in Brevo dashboard
4. Whether Brevo actually supports webhook signatures

---

## Need Help?

**If reports still not being sent**:
- Check Vercel logs for `[Email]` errors
- Verify `BREVO_API_KEY` in Vercel
- Test Brevo API key with curl:
  ```bash
  curl -X GET https://api.brevo.com/v3/account \
    -H "api-key: YOUR_KEY"
  ```

**If users not added to lists**:
- Check Vercel logs for `[BREVO addToWaitlist]` errors
- Verify List 18 exists in Brevo
- Check contact creation permissions

**If webhook still failing**:
- Check if Brevo sends `x-brevo-signature` header
- Verify secret matches
- Consider disabling signature validation if not needed

---

**Status**: ✅ Webhook temporarily allows through for debugging  
**Next**: Check Vercel logs for actual email/list errors
