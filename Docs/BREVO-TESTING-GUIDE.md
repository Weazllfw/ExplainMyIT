# Brevo Mailing List - Testing Guide

## Quick Test: Snapshot Form Opt-in

### Test Steps

1. **Go to homepage**: https://explainmyit.com
2. **Fill in the form**:
   - Email: `test+snapshot1@yourdomain.com`
   - Domain: `test.com`
3. **✅ Check** "Keep me updated about my IT setup"
4. **Click** "Get My Free IT Snapshot"
5. **Wait** for success message

### Expected Results

**Browser Console**:
```
📊 [Umami Event] snapshot-form-started
📊 [Umami Event] email-opt-in-checked { source: 'snapshot-form' }
📊 [Umami Event] snapshot-requested { domain: 'test.com' }
```

**Vercel Logs** (check https://vercel.com/your-project/logs):
```
📨 Snapshot request received: test.com (test+snapshot1@yourdomain.com) [opted into emails]
📧 Adding test+snapshot1@yourdomain.com to Brevo mailing list...
✅ Successfully added to Brevo mailing list
```

**Brevo Dashboard**:
1. Go to: https://app.brevo.com/
2. Click: Contacts → Lists
3. Open: List 18
4. Search for: `test+snapshot1@yourdomain.com`
5. **Should see**: Contact with attributes:
   - `SIGNUP_SOURCE`: free-snapshot
   - `SIGNUP_PAGE`: snapshot-form
   - `LEAD_STATUS`: new

---

## Quick Test: Signup Form Opt-in (NEW)

### Test Steps

1. **Go to signup**: https://explainmyit.com/signup
2. **Fill in the form**:
   - Full Name: `Test User`
   - Email: `test+signup1@yourdomain.com`
   - Password: `testpass123`
   - Confirm Password: `testpass123`
3. **✅ Check** "Keep me updated about my IT setup"
4. **Click** "Create Free Account"
5. **Wait** for success message

### Expected Results

**Browser Console**:
```
📊 [Umami Event] form-started { formName: 'signup' }
📊 [Umami Event] email-opt-in-checked { source: 'signup-form' }
📊 [Umami Event] form-submitted { formName: 'signup' }
📊 [Umami Event] user-signed-up
✅ Added to Brevo mailing list (List 18)
📊 [Umami Event] email-opt-in-submitted { source: 'signup-form' }
```

**Brevo Dashboard**:
1. Go to: https://app.brevo.com/
2. Click: Contacts → Lists  
3. Open: List 18
4. Search for: `test+signup1@yourdomain.com`
5. **Should see**: Contact with attributes:
   - `SIGNUP_SOURCE`: account-signup
   - `SIGNUP_PAGE`: signup-form
   - `LEAD_STATUS`: new

---

## Test Without Opt-in

### Snapshot Form (No Opt-in)

1. Go to homepage
2. Fill form but **DON'T check** opt-in box
3. Submit

**Expected**: 
- ✅ Snapshot created
- ✅ Email sent
- ❌ NOT added to Brevo List 18

### Signup Form (No Opt-in)

1. Go to /signup
2. Fill form but **DON'T check** opt-in box
3. Submit

**Expected**:
- ✅ Account created
- ❌ NOT added to Brevo List 18

---

## Debug: Check API Endpoint

### Test Endpoint Directly

```bash
curl -X POST https://explainmyit.com/api/brevo/add-to-waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "listId": 18,
    "attributes": {
      "SIGNUP_SOURCE": "manual-test",
      "SIGNUP_PAGE": "test",
      "LEAD_STATUS": "new"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true
}
```

**If Error**:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Debug: Check Vercel Logs

1. Go to: https://vercel.com/[your-project]/logs
2. Filter by: `/api/snapshot` or `/api/brevo/add-to-waitlist`
3. Look for:
   - ✅ Success: `✅ Successfully added to Brevo mailing list`
   - ❌ Error: `⚠️ Failed to add to Brevo:`

---

## Debug: Check Brevo API Key

### Verify in Vercel

1. Go to: https://vercel.com/[your-project]/settings/environment-variables
2. Check: `BREVO_API_KEY` exists
3. Value format: `xkeysib-...` (starts with xkeysib)

### Test API Key

```bash
curl -X GET https://api.brevo.com/v3/account \
  -H "api-key: YOUR_BREVO_API_KEY"
```

**Expected**: Account details (success)
**If Error**: `Unauthorized` (invalid key)

---

## Debug: Check List 18 Exists

1. Go to: https://app.brevo.com/
2. Click: Contacts → Lists
3. Find list named: (your general mailing list)
4. Click on it
5. Check URL: `https://app.brevo.com/contact/list/18` ← Should say `18`

**If List 18 doesn't exist**:
1. Create new list in Brevo
2. Note the ID from URL
3. Update code in:
   - `app/api/brevo/add-to-waitlist/route.ts` line 34: `listIds: [YOUR_ID]`
   - `lib/brevo.ts` line 55: `listIds: [YOUR_ID]`

---

## Common Issues

### Issue: "Failed to add to Brevo list"

**Check**:
1. Brevo API key in Vercel environment variables
2. List 18 exists and is not archived
3. Email format is valid
4. Check Vercel logs for specific error

**Solutions**:
- Regenerate Brevo API key if expired
- Create List 18 if it doesn't exist
- Check Brevo account limits/quotas

### Issue: Contact added but not in List 18

**Check**:
1. Go to Brevo → Contacts → All Contacts
2. Search for email
3. Click on contact
4. Check "Lists" section

**If contact exists but not in List 18**:
- API call succeeded but used wrong list ID
- Update `listIds` in code to match your actual list

### Issue: Duplicate contacts

**Expected Behavior**: 
- First submission → Creates contact
- Second submission → Updates contact
- Both return success

**Brevo Behavior**:
- POST returns 400 with `duplicate_parameter` error
- API catches this and calls PUT to update
- PUT adds contact to list if not already there

---

## Success Criteria

✅ **Snapshot Form**:
- Opt-in checkbox works
- Checked → adds to List 18
- Unchecked → doesn't add to List 18
- Analytics events fire

✅ **Signup Form**:
- Opt-in checkbox works
- Checked → adds to List 18
- Unchecked → doesn't add to List 18
- Analytics events fire

✅ **Brevo List 18**:
- Contains opted-in users
- Has correct attributes
- No duplicates (or handled gracefully)

✅ **Analytics**:
- `email-opt-in-checked` fires when box checked
- `email-opt-in-submitted` fires when successfully added
- Can see events in Umami dashboard

---

## Test Checklist

- [ ] Test snapshot form WITH opt-in
- [ ] Test snapshot form WITHOUT opt-in
- [ ] Test signup form WITH opt-in (NEW)
- [ ] Test signup form WITHOUT opt-in (NEW)
- [ ] Check Brevo List 18 for test emails
- [ ] Verify Vercel logs show success
- [ ] Confirm analytics events in Umami
- [ ] Test duplicate email handling
- [ ] Verify attributes are set correctly
- [ ] Test on mobile device
- [ ] Test with ad blocker enabled/disabled

---

## Contact Support

If issues persist after following this guide:

**Brevo Support**:
- Dashboard: https://app.brevo.com/
- Help Center: https://help.brevo.com/
- Email: support@brevo.com

**Check**:
- Brevo account status
- API key validity
- Account limits/quotas
- List configuration

---

**Last Updated**: February 2, 2026  
**Status**: ✅ Both opt-in flows implemented  
**Next**: Test in production
