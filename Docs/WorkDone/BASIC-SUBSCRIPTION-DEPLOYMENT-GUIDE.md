# Basic Subscription - Deployment Guide 🚀

**Date:** 2026-01-30  
**Status:** READY TO DEPLOY  
**Estimated Time:** 30-45 minutes

---

## ✅ What's Been Built

### Core Infrastructure (Complete):
- ✅ Stripe webhook handler (`/api/stripe/webhook`)
- ✅ Stripe Customer Portal (`/api/stripe/portal`)
- ✅ Automatic monthly snapshots cron job (`/api/cron/monthly-snapshots`)
- ✅ Subscription access control utilities
- ✅ Dashboard "Manage Subscription" button
- ✅ Database schema (ready to apply)

### Files Created (12 new files):
1. `lib/stripe/client.ts` - Stripe SDK initialization
2. `lib/stripe/subscriptions.ts` - Subscription helpers
3. `lib/stripe/webhooks.ts` - Webhook verification
4. `app/api/stripe/webhook/route.ts` - Webhook endpoint ⭐
5. `app/api/stripe/portal/route.ts` - Customer portal ⭐
6. `app/api/cron/monthly-snapshots/route.ts` - Cron job ⭐
7. `lib/subscriptions/access-control.ts` - Access control
8. `vercel.json` - Cron configuration ⭐
9. `SQLCode/ADD-STRIPE-COLUMNS.sql` - Database schema (already existed)
10-12. Documentation files

---

## 📋 Pre-Deployment Checklist

### 1. Database Setup (5 minutes)

**Apply Stripe Schema to Supabase:**

1. Open Supabase Dashboard → SQL Editor
2. Paste contents of `SQLCode/ADD-STRIPE-COLUMNS.sql`
3. Click "Run"
4. Verify columns were added:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name LIKE '%stripe%' OR column_name LIKE '%subscription%';
```

**Expected output:**
- `stripe_customer_id` (text, nullable)
- `stripe_subscription_id` (text, nullable)
- `subscription_status` (text, nullable)
- `subscription_period_end` (timestamptz, nullable)
- `subscription_cancel_at_period_end` (boolean, nullable)

**Also verify `stripe_events` table exists:**
```sql
SELECT * FROM stripe_events LIMIT 1;
```

---

### 2. Environment Variables (10 minutes)

**Add to Vercel:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add CRON_SECRET:**
   ```bash
   # Generate a secure random string
   openssl rand -base64 32
   ```
   - Name: `CRON_SECRET`
   - Value: (paste generated string)
   - Environments: Production, Preview, Development

3. **Add STRIPE_WEBHOOK_SECRET (temporary):**
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: `temporary_placeholder` (we'll update after webhook endpoint is deployed)
   - Environments: Production, Preview, Development

**Existing variables (verify they're set):**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY`
- ✅ `NEXT_PUBLIC_STRIPE_PRICE_ANNUAL`

---

### 3. Deploy to Vercel (5 minutes)

**Deploy the code:**

```bash
# Stage all changes
git add .

# Commit
git commit -m "Add Basic subscription infrastructure

- Stripe webhook handler for subscription events
- Customer Portal for self-service subscription management
- Automatic monthly snapshots cron job
- Subscription access control
- Database schema for Stripe integration
- vercel.json cron configuration"

# Push to deploy
git push origin dev
```

**Vercel will automatically:**
- Deploy to preview environment (dev branch)
- Set up the cron job (runs daily at 1am UTC)
- Make webhook endpoint available at `/api/stripe/webhook`

---

### 4. Configure Stripe Webhook (10 minutes)

**After deployment completes:**

1. **Get your webhook endpoint URL:**
   - Production: `https://explainmyit.com/api/stripe/webhook`
   - Preview (for testing): `https://explain-my-it-git-dev-mdsltd.vercel.app/api/stripe/webhook`

2. **Add webhook in Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: (your URL from step 1)
   - Listen to: "Events on your account"
   - Select events:
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`
   - Click "Add endpoint"

3. **Get webhook signing secret:**
   - Click on your newly created webhook
   - Click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_...`)

4. **Update Vercel environment variable:**
   - Go to Vercel → Settings → Environment Variables
   - Find `STRIPE_WEBHOOK_SECRET`
   - Click "Edit"
   - Replace `temporary_placeholder` with your actual secret
   - Save

5. **Redeploy to apply new env var:**
   - Go to Vercel → Deployments
   - Click "..." on latest deployment → "Redeploy"

---

### 5. Cron Job Verification (2 minutes)

**The cron job is automatically configured via `vercel.json`:**

```json
{
  "crons": [
    {
      "path": "/api/cron/monthly-snapshots",
      "schedule": "0 1 * * *"
    }
  ]
}
```

**Schedule:** Daily at 1:00 AM UTC

**Verify it's set up:**
1. Go to Vercel Dashboard → Your Project → Cron Jobs tab
2. You should see: `/api/cron/monthly-snapshots` scheduled for `0 1 * * *`

**To test manually (optional):**
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://explainmyit.com/api/cron/monthly-snapshots
```

---

### 6. Test the Complete Flow (10 minutes)

#### Test 1: Webhook Handler

**Option A: Use Stripe CLI (Recommended)**

```bash
# Install Stripe CLI (if not already)
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

**Option B: Create Test Subscription**

1. Go to pricing page in **test mode**
2. Click "Subscribe Monthly"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check Vercel logs for webhook processing
6. Verify database user has `subscription_status = 'active'`

#### Test 2: Customer Portal

1. Subscribe to Basic (test mode)
2. Go to Dashboard
3. Click "Manage Subscription"
4. Verify you're redirected to Stripe Billing Portal
5. Try canceling subscription
6. Verify database updates to `subscription_status = 'canceled'`

#### Test 3: Cron Job (Manual Trigger)

```bash
# Get your CRON_SECRET from Vercel env vars
# Then trigger manually:
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://explain-my-it-git-dev-mdsltd.vercel.app/api/cron/monthly-snapshots
```

**Check logs:**
- Vercel → Deployments → Click deployment → Functions tab
- Find `/api/cron/monthly-snapshots`
- Verify it runs without errors

---

## 🎯 Go-Live Checklist

Before announcing Basic subscriptions:

### Critical:
- [ ] Database schema applied
- [ ] CRON_SECRET set in Vercel
- [ ] STRIPE_WEBHOOK_SECRET set in Vercel
- [ ] Code deployed to production
- [ ] Webhook configured in Stripe Dashboard (production mode)
- [ ] Webhook endpoint tested with test subscription
- [ ] Customer Portal tested (can cancel, update payment)
- [ ] Cron job scheduled in Vercel

### Recommended:
- [ ] Test subscription created and canceled successfully
- [ ] Webhook logs show successful processing
- [ ] Database updates confirmed for subscription events
- [ ] "Manage Subscription" button works on dashboard
- [ ] Manual cron trigger returns successful response

### Nice-to-Have:
- [ ] Monitor first automatic cron run (next 1am UTC)
- [ ] Set up Vercel alerts for webhook/cron failures
- [ ] Document support process for subscription issues

---

## 🚨 Troubleshooting

### Webhook Not Working

**Symptoms:** User subscribes but `subscription_status` stays `null`

**Fixes:**
1. Check Vercel logs for webhook endpoint
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Check Stripe Dashboard → Webhooks → Your endpoint → "Recent events"
4. Look for 4xx or 5xx errors
5. Verify webhook signature in Stripe Dashboard matches Vercel env var

**Manual fix:** Update user's subscription status directly:
```sql
UPDATE users 
SET subscription_status = 'active',
    stripe_subscription_id = 'sub_xxxxx',
    subscription_period_end = NOW() + INTERVAL '30 days'
WHERE email = 'user@example.com';
```

### Cron Job Not Running

**Symptoms:** No automatic snapshots generated after 30 days

**Fixes:**
1. Check Vercel → Cron Jobs tab - verify it's scheduled
2. Check Vercel logs → Functions → `/api/cron/monthly-snapshots`
3. Verify `CRON_SECRET` is set
4. Manually trigger to test: `curl -H "Authorization: Bearer SECRET" URL`

**Debugging:**
```bash
# Check cron logs
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://explainmyit.com/api/cron/monthly-snapshots
```

### Customer Portal Not Loading

**Symptoms:** "Manage Subscription" button errors or redirects fail

**Fixes:**
1. Verify user has `stripe_customer_id` in database
2. Check Vercel logs for `/api/stripe/portal` errors
3. Verify Stripe API key is valid
4. Check user is authenticated

---

## 📊 Monitoring

### What to Watch (First 48 Hours):

1. **Webhook Success Rate:**
   - Stripe Dashboard → Webhooks → Your endpoint
   - Should see successful 200 responses
   - Failed events will auto-retry

2. **Cron Job Execution:**
   - Vercel → Cron Jobs → View logs
   - Should run daily at 1am UTC
   - Check for errors in function logs

3. **Database Subscription Status:**
   ```sql
   SELECT 
     email, 
     subscription_status, 
     subscription_period_end,
     stripe_customer_id
   FROM users
   WHERE subscription_status IS NOT NULL
   ORDER BY created_at DESC;
   ```

4. **Snapshot Generation:**
   ```sql
   SELECT COUNT(*) as total_snapshots,
          COUNT(DISTINCT user_id) as unique_subscribers
   FROM snapshots
   WHERE created_at > NOW() - INTERVAL '7 days'
     AND user_id IS NOT NULL;
   ```

---

## 🎉 Success Criteria

### You'll know it's working when:

✅ **Subscriptions:**
- User subscribes → `subscription_status` = 'active' in database
- User cancels → `subscription_status` = 'canceled' in database
- Payment fails → `subscription_status` = 'past_due'

✅ **Cron Job:**
- Runs daily at 1am UTC without errors
- Generates snapshots for domains ≥30 days old
- Sends email notifications

✅ **Customer Portal:**
- "Manage Subscription" button redirects to Stripe Portal
- Users can cancel, update payment, view invoices
- Changes reflect in database via webhook

✅ **Access Control:**
- Basic subscribers can run unlimited snapshots
- Canceled users see upgrade prompts (when implemented)

---

## 🔄 Next Steps After Deployment

### Phase 1: Monitor (Week 1)
- [ ] Watch first cron run (1am UTC)
- [ ] Monitor webhook success rate
- [ ] Check for any error logs
- [ ] Verify first monthly snapshots generate correctly

### Phase 2: Enhance (Week 2)
- [ ] Create Brevo email templates for:
  - Welcome email (subscription activated)
  - Monthly snapshot ready notification
  - Payment failed (with retry link)
  - Subscription canceled confirmation
- [ ] Integrate emails with webhook handler
- [ ] Add subscription status badge to dashboard

### Phase 3: Optimize (Week 3+)
- [ ] Add grace period handling (7 days after failed payment)
- [ ] Implement explicit snapshot limits for free tier
- [ ] Add upgrade prompts for free users
- [ ] Create admin dashboard for monitoring subscriptions

---

## 📞 Support

If you encounter issues:

1. **Check Vercel logs first:**
   - Functions tab → Filter by `/api/stripe/` or `/api/cron/`

2. **Check Stripe Dashboard:**
   - Webhooks → Recent events → Click event → View request/response

3. **Check database:**
   ```sql
   -- See all subscription statuses
   SELECT * FROM users WHERE subscription_status IS NOT NULL;
   
   -- See recent webhook events
   SELECT * FROM stripe_events ORDER BY processed_at DESC LIMIT 10;
   ```

4. **Manual intervention (if needed):**
   - Stripe Dashboard → Customers → Find customer → View subscription
   - Update database manually if webhook failed
   - Manually trigger cron job to generate missed snapshots

---

## ✅ Deployment Complete!

Once all steps are completed:
1. Test with a real subscription in **test mode**
2. Verify all systems working
3. Switch Stripe to **production mode**
4. Update pricing page buttons to use production price IDs
5. Announce Basic subscriptions are live!

**Estimated go-live:** After successful testing (same day or next day)

---

**Status:** Ready for deployment 🚀
