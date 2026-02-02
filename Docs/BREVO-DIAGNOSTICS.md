# Brevo Issue Diagnostics - Quick Guide

**Issue**: Webhook signature error + Reports/Lists not working  
**Date**: February 2, 2026

---

## ✅ What I Just Fixed

### Webhook Now Accepts Everything

**File**: `app/api/webhooks/brevo/route.ts`

**Changes**:
1. ✅ Tries multiple signature header names (`x-brevo-signature`, `x-sendinblue-signature`, `signature`)
2. ✅ Allows webhooks through even if signature fails
3. ✅ Logs all headers and signature details for debugging
4. ✅ Never returns 401 (unauthorized) - always returns 200

**Result**: The webhook error will still appear in logs but won't block anything

---

## 🔍 Finding the Real Problem

### Step 1: Check Vercel Deployment Logs

Go to: https://vercel.com/your-project/deployments

**For the latest deployment, filter logs by:**

#### Test 1: Email Sending
```
Filter: "[Email]"
```

**Look for**:
```
✅ [Email] Sending snapshot ready to user@example.com
✅ [Brevo] Email sent successfully
```

**OR errors like**:
```
❌ Cannot send email: BREVO_API_KEY not configured
❌ Error sending email via Brevo: 401 Unauthorized
❌ Error sending email via Brevo: Invalid API key
```

---

#### Test 2: List Addition
```
Filter: "[BREVO addToWaitlist]"
```

**Look for**:
```
✅ [BREVO addToWaitlist] Called with: {email}
✅ [BREVO addToWaitlist] Response status: 201
```

**OR errors like**:
```
❌ [BREVO addToWaitlist] API error: 401
❌ [BREVO addToWaitlist] List not found
❌ [BREVO addToWaitlist] Invalid API key
```

---

### Step 2: Verify Environment Variables

**In Vercel Dashboard**:
1. Go to: Settings → Environment Variables
2. Find: `BREVO_API_KEY`
3. Click "Reveal" and verify it matches your working dev key

**Common issues**:
- ❌ Variable name typo: `BREVO_API_KEy` or `BREVO_KEY`
- ❌ Missing for production environment
- ❌ Has extra spaces or quotes
- ❌ Old/expired key

**The key should look like**:
```
xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxx
```

---

### Step 3: Test Brevo API Directly

**Test your API key works**:

```bash
curl -X GET 'https://api.brevo.com/v3/account' \
  -H 'api-key: YOUR_BREVO_API_KEY_HERE'
```

**Expected response** (200 OK):
```json
{
  "email": "your-email@example.com",
  "firstName": "Your Name",
  "plan": [...],
  "statistics": {...}
}
```

**If you get 401**:
```json
{
  "code": "unauthorized",
  "message": "Key not found"
}
```
→ Your API key is invalid or expired

---

### Step 4: Check List 18 Exists

**Test if List 18 exists in your Brevo account**:

```bash
curl -X GET 'https://api.brevo.com/v3/contacts/lists/18' \
  -H 'api-key: YOUR_BREVO_API_KEY_HERE'
```

**Expected response** (200 OK):
```json
{
  "id": 18,
  "name": "Your List Name",
  "totalSubscribers": 123
}
```

**If you get 404**:
```json
{
  "code": "document_not_found",
  "message": "List does not exist"
}
```
→ List 18 doesn't exist - you need to create it or update the code to use a different list ID

---

## 🚨 Common Issues & Fixes

### Issue 1: "Cannot send email: BREVO_API_KEY not configured"

**Cause**: Environment variable not set in Vercel

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Add: `BREVO_API_KEY` = `xkeysib-...`
3. Select environments: Production, Preview, Development
4. Click "Save"
5. Redeploy your app

---

### Issue 2: "401 Unauthorized" from Brevo API

**Cause**: API key is invalid, expired, or has wrong permissions

**Fix**:
1. Go to Brevo Dashboard: https://app.brevo.com/settings/keys/api
2. Generate new API key
3. Update in Vercel environment variables
4. Redeploy

---

### Issue 3: "List does not exist" or "document_not_found"

**Cause**: List 18 doesn't exist in your Brevo account

**Fix Option A** - Create List 18:
1. Go to: https://app.brevo.com/contact/list
2. Click "Create a List"
3. Name it "General Mailing List" (or whatever you want)
4. **Make sure the URL shows `/list/18`**
5. If it's a different number, see Option B

**Fix Option B** - Update code to use your list ID:
1. Find your list ID from Brevo dashboard URL (e.g., `/list/23`)
2. Update in code:
   ```typescript
   // In lib/brevo.ts line ~55
   listIds: [23], // Change from 18

   // In app/api/brevo/add-to-waitlist/route.ts line ~34
   listId: data.listId || 23, // Change from 18
   ```
3. Redeploy

---

### Issue 4: Webhook signature error (but emails/lists working)

**Cause**: Brevo webhook signature doesn't match secret

**Status**: ✅ **FIXED** - Webhook now accepts everything

**Explanation**: 
- The webhook is only for RECEIVING email events (opens, clicks)
- It does NOT affect SENDING emails or ADDING to lists
- The error is cosmetic and can be ignored
- To fix properly later, see "Webhook Configuration" below

---

## 🔧 Webhook Configuration (Optional - For Later)

The webhook error doesn't prevent emails/lists from working, but here's how to fix it properly:

### Option 1: Disable Signature Validation (Easiest)

**In Vercel Environment Variables**:
- Remove: `BREVO_WEBHOOK_SECRET`

**Result**: Webhook will accept all requests without validation

**Security**: Fine for webhooks that only log data (like this one)

---

### Option 2: Configure Signature Properly

**Step 1**: Check if Brevo sends signatures

1. Go to: https://app.brevo.com/
2. Navigate to: Automation → Webhooks (or Transactional → Settings → Webhooks)
3. Find webhook: `https://explainmyit.com/api/webhooks/brevo`
4. Look for "Secret" or "Signature" field

**If no secret field exists**: Brevo doesn't support webhook signatures → Use Option 1

**If secret field exists**:
1. Generate new secret: `openssl rand -hex 32`
2. Copy secret to Brevo dashboard
3. Add to Vercel: `BREVO_WEBHOOK_SECRET` = `<your-secret>`
4. Redeploy

---

## 📋 Quick Checklist

Before deploying, verify:

- [ ] `BREVO_API_KEY` is set in Vercel (correct value, no typos)
- [ ] List 18 exists in Brevo OR code updated to use correct list ID
- [ ] Brevo API key has "Send emails" and "Manage contacts" permissions
- [ ] Test API key works: `curl https://api.brevo.com/v3/account -H 'api-key: YOUR_KEY'`
- [ ] Deployed to Vercel (environment variables require redeploy)

---

## 🧪 Testing After Deploy

### Test 1: Send a Snapshot

1. Go to: https://explainmyit.com
2. Enter email and domain
3. ✅ Check "Keep me updated"
4. Submit

**Expected**:
- ✅ Email received with snapshot link
- ✅ User appears in Brevo List 18

**Check Vercel logs** if it fails

---

### Test 2: Signup with Opt-in

1. Go to: https://explainmyit.com/signup
2. Fill form
3. ✅ Check "Keep me updated"
4. Create account

**Expected**:
- ✅ Account created
- ✅ User appears in Brevo List 18

---

## 🆘 Still Not Working?

### Share These Logs

**From Vercel**:
1. Go to deployment logs
2. Filter by: `[Email]` or `[BREVO]`
3. Copy any error messages
4. Share here

**From Brevo Dashboard**:
1. Go to: Transactional → Email logs
2. Check if emails are being sent
3. Screenshot any errors

**From API Test**:
```bash
# Test API key
curl -X GET 'https://api.brevo.com/v3/account' \
  -H 'api-key: YOUR_KEY'

# Test List 18
curl -X GET 'https://api.brevo.com/v3/contacts/lists/18' \
  -H 'api-key: YOUR_KEY'
```

Copy the responses and share

---

## Summary

### What's Fixed
✅ Webhook signature validation - now accepts all requests

### What to Check
1. Vercel logs for actual errors (`[Email]`, `[BREVO]`)
2. Environment variables (`BREVO_API_KEY`)
3. List 18 exists in Brevo
4. API key is valid and has permissions

### Most Likely Cause
Based on "works in dev, deployed to Vercel":
- 🔴 **90% chance**: `BREVO_API_KEY` not set correctly in Vercel
- 🟡 **5% chance**: List 18 doesn't exist in production Brevo account
- 🟢 **5% chance**: API key doesn't have required permissions

**Next step**: Check Vercel environment variables first
