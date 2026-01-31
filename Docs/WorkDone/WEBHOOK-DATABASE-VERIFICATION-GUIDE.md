# Webhook → Database → Dashboard Verification Guide

## ✅ Pre-Flight Checklist

### 1. Database Schema Applied?

Run this in **Supabase SQL Editor**:

```sql
-- Check if Stripe columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND (column_name LIKE '%stripe%' OR column_name LIKE '%subscription%')
ORDER BY column_name;
```

**Expected output (5 columns):**
- `stripe_customer_id` (text, YES)
- `stripe_subscription_id` (text, YES)
- `subscription_cancel_at_period_end` (boolean, YES)
- `subscription_period_end` (timestamptz, YES)
- `subscription_status` (text, YES)

**If missing:** Run `SQLCode/ADD-STRIPE-COLUMNS.sql` now

---

### 2. Check stripe_events table exists:

```sql
-- Verify stripe_events table
SELECT * FROM stripe_events LIMIT 1;
```

**Expected:** Table exists (may be empty)

---

## 🧪 Testing the Flow

### Test 1: Create Test Subscription

1. Go to pricing page: https://explain-my-it-git-dev-mdsltd.vercel.app/pricing
2. Click "Subscribe Monthly — $19.99"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. **Wait 5-10 seconds** for webhook to process

### Test 2: Verify Webhook Received

Check **Vercel Logs**:
1. Go to Vercel Dashboard → Deployments → Click latest deployment
2. Click "Functions" tab
3. Filter by `/api/stripe/webhook`
4. Look for logs like:
   ```
   [Webhook] Received Stripe webhook
   [Webhook] Event type: customer.subscription.created
   [Webhook] Subscription change: cus_xxx → active
   [Webhook] Updated user user@example.com subscription: active
   ```

**If no logs:** Webhook not reaching your app (check Stripe Dashboard → Webhooks → Recent events)

### Test 3: Verify Database Updated

Run in **Supabase SQL Editor**:

```sql
-- Check subscription was saved
SELECT 
  email,
  stripe_customer_id,
  stripe_subscription_id,
  subscription_status,
  subscription_period_end,
  subscription_cancel_at_period_end,
  created_at
FROM users
WHERE stripe_customer_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:**
- Your test user appears
- `subscription_status` = `'active'`
- `stripe_customer_id` starts with `cus_`
- `stripe_subscription_id` starts with `sub_`
- `subscription_period_end` is ~30 days in future

**If status is NULL:** Webhook didn't update database - check webhook logs for errors

### Test 4: Verify Dashboard Shows Status

1. Log in to dashboard: https://explain-my-it-git-dev-mdsltd.vercel.app/dashboard
2. Look for "Subscription Status" section
3. Should show: **[Basic - Active]** badge (green)

**If still shows "Free Tier":** 
- Check browser console for errors
- Verify `/api/subscription-status` returns correct data

### Test 5: Verify stripe_events Table (Idempotency)

```sql
-- Check webhook events were logged
SELECT 
  stripe_event_id,
  type,
  processed_at
FROM stripe_events
ORDER BY processed_at DESC
LIMIT 10;
```

**Expected:**
- Event `evt_xxx` with type `customer.subscription.created`
- Event `evt_yyy` with type `invoice.payment_succeeded`

---

## 🔧 Troubleshooting

### Issue: Webhook reaches app but database not updated

**Check 1: Webhook logs for errors**
```
Vercel → Functions → /api/stripe/webhook → Look for errors
```

**Check 2: User exists in database**
```sql
-- Find user by email
SELECT id, auth_user_id, email, stripe_customer_id 
FROM users 
WHERE email = 'your-test-email@example.com';
```

**If user not found:** User must exist in `users` table before subscription

**Fix:** Sign up first, then subscribe

---

### Issue: "User not found for customer cus_xxx"

**Problem:** Webhook tries to update user by `stripe_customer_id`, but user doesn't have that ID yet

**Check:**
```sql
-- See which users have Stripe customer IDs
SELECT email, stripe_customer_id 
FROM users 
WHERE stripe_customer_id IS NOT NULL;
```

**Fix:** The checkout flow should create the Stripe customer and save `stripe_customer_id` BEFORE redirecting to Stripe

**Verify checkout creates customer:**
- Check `app/api/stripe/create-checkout/route.ts` logs
- Should see: "Created Stripe customer: cus_xxx"

---

### Issue: Dashboard shows "Free Tier" for active subscriber

**Check 1: API returns correct status**
```bash
# Test API directly (replace with your user's auth token)
curl https://explain-my-it-git-dev-mdsltd.vercel.app/api/subscription-status \
  -H "Cookie: your-supabase-auth-cookie"
```

**Expected response:**
```json
{
  "subscriptionStatus": "active",
  "periodEnd": "2026-02-28T...",
  "cancelAtPeriodEnd": false,
  "nextSnapshotDates": {}
}
```

**Check 2: Browser console**
- Open dashboard
- F12 → Console
- Look for errors fetching subscription status

---

## ✅ Success Criteria

All of these should be TRUE:

- [ ] Database has Stripe columns
- [ ] Test subscription created in Stripe
- [ ] Webhook received in Vercel logs
- [ ] Database shows `subscription_status = 'active'`
- [ ] Dashboard shows "[Basic - Active]" badge
- [ ] `stripe_events` table has logged events
- [ ] No errors in Vercel logs
- [ ] No errors in browser console

---

## 🎯 Next: Test Cancellation Flow

1. Click "Manage Subscription" on dashboard
2. Cancel subscription in Stripe Portal
3. Verify webhook fires: `customer.subscription.deleted`
4. Verify database updates: `subscription_status = 'canceled'`
5. Verify dashboard shows: "[Canceled]" badge (red)

---

## 📊 Quick Diagnostic SQL

Run this to see full picture:

```sql
-- Complete subscription status for all users
SELECT 
  u.email,
  u.stripe_customer_id,
  u.subscription_status,
  u.subscription_period_end,
  COUNT(s.id) as total_snapshots,
  MAX(s.created_at) as last_snapshot
FROM users u
LEFT JOIN snapshots s ON s.user_id = u.id
GROUP BY u.id, u.email, u.stripe_customer_id, u.subscription_status, u.subscription_period_end
ORDER BY u.created_at DESC;
```

This shows every user's subscription status and snapshot count in one query.

---

**Run through these steps and let me know what you find!** 🔍
