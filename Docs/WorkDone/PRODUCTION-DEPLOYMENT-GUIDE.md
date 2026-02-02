# 🚀 Production Deployment Guide - Supabase & Vercel

**Status**: Ready for Production  
**Last Updated**: 2026-01-31

---

## 📋 Pre-Deployment Checklist

### 1. Create Production Supabase Project ✅
- [ ] Go to https://supabase.com/dashboard
- [ ] Create new project: **"explainmyit-prod"**
- [ ] Select region: **closest to your users** (e.g., US East, EU West)
- [ ] Choose plan: **Pro** ($25/mo for production features)
- [ ] Wait for project initialization (~2 min)

---

## 🗄️ Database Setup

### Step 1: Run Main Schema

**File**: `lib/db/schema.sql`

1. Open Supabase Dashboard → SQL Editor
2. Click **"New Query"**
3. Copy entire contents of `lib/db/schema.sql`
4. Click **"Run"**
5. Verify: ✅ "Success. No rows returned"

**What this creates**:
- ✅ Tables: `users`, `snapshots`, `rate_limits`, `hibp_cache`, `schema_version`
- ✅ Extensions: `uuid-ossp`, `pgcrypto`
- ✅ RLS policies
- ✅ Indexes
- ✅ Triggers
- ✅ Views

---

### Step 2: Add Stripe Columns

**File**: `SQLCode/ADD-STRIPE-COLUMNS.sql`

1. SQL Editor → **"New Query"**
2. Copy contents of `ADD-STRIPE-COLUMNS.sql`
3. Click **"Run"**
4. Verify: ✅ "Success. No rows returned"

**What this adds**:
- ✅ Columns: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `subscription_period_end`, `subscription_cancel_at_period_end`
- ✅ Table: `stripe_events` (webhook deduplication)
- ✅ Indexes for Stripe lookups

---

### Step 3: Verify Schema

Run this verification query:

```sql
-- Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected results:
-- hibp_cache
-- rate_limits
-- schema_version
-- snapshots
-- stripe_events
-- users

-- Verify Stripe columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name LIKE '%stripe%';

-- Expected: 5 rows (stripe_customer_id, stripe_subscription_id, etc.)
```

✅ **Success**: All 6 tables + Stripe columns present

---

## 🔐 Get Production Credentials

### From Supabase Dashboard

**Project Settings** → **API**:

1. **Project URL**
   ```
   https://[your-project-ref].supabase.co
   ```
   
2. **anon / public key** (starts with `eyJ...`)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **service_role key** (starts with `eyJ...`, **keep secret!**)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

**Project Settings** → **Database**:

4. **Direct connection string**
   ```
   postgresql://postgres:[password]@[host]:5432/postgres
   ```

---

## ⚙️ Environment Variables

### Production `.env.local` (Vercel)

Add these to **Vercel Dashboard** → Project → **Settings** → **Environment Variables**:

```bash
# === Supabase (PRODUCTION) ===
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (public key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role - secret!)
SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:5432/postgres

# === Stripe (PRODUCTION) ===
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (get from Stripe)
STRIPE_SECRET_KEY=sk_live_... (get from Stripe)
STRIPE_WEBHOOK_SECRET=whsec_... (create webhook in Stripe)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_... (Basic monthly price ID)
NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=price_... (Basic annual price ID)

# === App Configuration ===
NEXT_PUBLIC_BASE_URL=https://explainmyit.com
NODE_ENV=production

# === LLM (Anthropic) ===
ANTHROPIC_API_KEY=sk-ant-... (your key)

# === Email (Brevo) ===
BREVO_API_KEY=xkeysib-... (your key)
BREVO_SENDER_EMAIL=noreply@explainmyit.com
BREVO_SENDER_NAME=Explain My IT

# === Analytics (Umami) ===
NEXT_PUBLIC_UMAMI_WEBSITE_ID=... (your Umami site ID)
NEXT_PUBLIC_UMAMI_SRC=https://cloud.umami.is/script.js

# === Security ===
ALLOWED_ORIGINS=https://explainmyit.com,https://www.explainmyit.com
```

**IMPORTANT**: 
- Use `pk_live_` and `sk_live_` keys (NOT test keys)
- Use **production** Stripe price IDs
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` secret!

---

## 🔒 Supabase Auth Configuration

### Email Settings

**Authentication** → **Email Auth**:

1. ✅ **Enable Email provider**
2. **Confirm email**: ✅ Enabled
3. **Secure email change**: ✅ Enabled
4. **Email template** (magic link):

```html
<h2>Your Magic Link</h2>
<p>Click the link below to sign in to Explain My IT:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, ignore this email.</p>
```

---

### URL Configuration

**Authentication** → **URL Configuration**:

- **Site URL**: `https://explainmyit.com`
- **Redirect URLs** (add these):
  ```
  https://explainmyit.com/auth/callback
  https://explainmyit.com/dashboard
  https://www.explainmyit.com/auth/callback
  https://www.explainmyit.com/dashboard
  ```

---

### Email Rate Limiting

**Authentication** → **Rate Limits**:

- **Sign up**: 10 per hour
- **Sign in**: 30 per hour
- **Password reset**: 10 per hour

---

## 🎯 Stripe Production Setup

### 1. Activate Live Mode

**Stripe Dashboard** → Toggle to **Live mode** (top right)

### 2. Create Production Products

**Products** → **Add Product**:

**Basic - Monthly**:
- Name: `Basic Subscription - Monthly`
- Description: `Monthly IT snapshots with full history`
- Price: `$19.99 USD` / month
- Billing: Recurring
- **Save product** → Copy `price_...` ID

**Basic - Annual**:
- Name: `Basic Subscription - Annual`
- Description: `Annual IT snapshots with full history`
- Price: `$199 USD` / year
- Billing: Recurring
- **Save product** → Copy `price_...` ID

**Add these price IDs to Vercel env vars!**

---

### 3. Configure Stripe Webhook

**Developers** → **Webhooks** → **Add endpoint**:

- **Endpoint URL**: `https://explainmyit.com/api/stripe/webhook`
- **Events to listen for**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

**Save** → Copy **Signing secret** (`whsec_...`)  
Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

### 4. Enable Stripe Tax

**Products** → **Tax** → **Enable Stripe Tax**

- ✅ Enable automatic tax calculation
- Add your GST/HST registration number (Canada)
- Configure tax behavior: **Exclusive** (tax added to price)

**Code already configured** (`automatic_tax: { enabled: true }` in checkout)

---

## 🌐 Vercel Deployment

### 1. Connect Repository

1. Go to https://vercel.com/new
2. Import your Git repository
3. **Project Name**: `explainmyit-prod`
4. **Framework Preset**: Next.js
5. **Root Directory**: `./`
6. **Node Version**: 18.x or higher

---

### 2. Environment Variables

**Settings** → **Environment Variables**:

- **Add all** env vars from above section
- Set to: ✅ **Production** (and Preview/Development if needed)
- Click **"Save"**

---

### 3. Domain Configuration

**Settings** → **Domains**:

1. Add **explainmyit.com**
   - Vercel provides DNS instructions
   - Add A/CNAME records to your domain registrar

2. Add **www.explainmyit.com** (optional)
   - Redirect to main domain

3. Vercel auto-provisions **SSL certificate** (1-2 min)

---

### 4. Deploy

Click **"Deploy"** → Wait ~2 minutes

✅ **Success**: `https://explainmyit.com` is live!

---

## ✅ Post-Deployment Verification

### 1. Test Free Snapshot

1. Go to https://explainmyit.com
2. Enter domain + email
3. Submit form
4. Check email for magic link
5. Verify report renders

✅ **Test passes**: Free tier works

---

### 2. Test Stripe Checkout

1. Go to https://explainmyit.com/pricing
2. Click **"Subscribe Monthly"**
3. Use Stripe test card: `4242 4242 4242 4242` (exp: any future, CVC: any 3 digits)
4. Complete checkout
5. Verify redirect to dashboard
6. Check Stripe Dashboard → **Payments** for successful payment

✅ **Test passes**: Subscriptions work

---

### 3. Test Dashboard

1. Sign in with test account
2. Verify dashboard loads
3. Run a snapshot
4. Check report appears in history

✅ **Test passes**: Dashboard works

---

### 4. Verify Database

Supabase Dashboard → **Table Editor**:

```sql
-- Check user was created
SELECT email, subscription_tier, stripe_customer_id 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check snapshots exist
SELECT domain, status, user_id 
FROM snapshots 
ORDER BY created_at DESC 
LIMIT 5;

-- Check Stripe sync
SELECT email, subscription_status, subscription_period_end 
FROM users 
WHERE stripe_customer_id IS NOT NULL;
```

✅ **Success**: Data syncing correctly

---

### 5. Test Webhook

Stripe Dashboard → **Webhooks** → Your endpoint:

- Check **"Events"** tab
- Verify events are being received
- Status should show: ✅ **Succeeded**

✅ **Test passes**: Webhooks working

---

## 🔍 Monitoring & Maintenance

### Daily Checks

**Vercel**:
- Check **Analytics** for errors
- Monitor **Logs** for issues

**Supabase**:
- Check **Database** → **Health** (CPU, memory)
- Monitor **Auth** → **Users** (growth)

**Stripe**:
- Check **Payments** (successful/failed)
- Monitor **Disputes** (if any)

---

### Weekly Tasks

1. **Backup Database** (Supabase auto-backups, but verify)
2. **Review Error Logs** (Vercel + Supabase)
3. **Check Stripe Payouts** (verify deposits)
4. **Review Analytics** (Umami traffic)

---

### Monthly Tasks

1. **Review Costs**:
   - Vercel usage
   - Supabase database size
   - Anthropic API usage
   - Stripe fees

2. **Update Dependencies**:
   ```bash
   npm outdated
   npm update
   ```

3. **Security Review**:
   - Check for leaked API keys (GitHub, logs)
   - Rotate secrets if needed

---

## 🚨 Emergency Procedures

### Site Down

1. Check Vercel deployment status
2. Check Vercel logs for errors
3. Rollback to previous deployment if needed:
   - Vercel Dashboard → **Deployments**
   - Click previous working deployment
   - Click **"Promote to Production"**

---

### Database Issues

1. Check Supabase Dashboard → **Database** → **Health**
2. If queries slow: Add indexes
3. If storage full: Clean up old data:
   ```sql
   SELECT cleanup_expired_snapshots();
   SELECT cleanup_expired_hibp_cache();
   ```

---

### Stripe Webhook Failing

1. Stripe Dashboard → **Webhooks** → Click endpoint
2. Check **"Events"** tab for errors
3. Re-send failed events:
   - Click failed event
   - Click **"Send test webhook"**

---

## 📚 Additional Resources

**Documentation**:
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Stripe: https://stripe.com/docs

**Support**:
- Supabase: support@supabase.io
- Vercel: support@vercel.com
- Stripe: https://support.stripe.com

---

## ✅ Deployment Complete!

Your production environment is now live with:

- ✅ Supabase production database
- ✅ Stripe live mode payments
- ✅ Vercel production deployment
- ✅ Custom domain with SSL
- ✅ Email auth configured
- ✅ Webhooks configured
- ✅ Tax collection enabled
- ✅ Monitoring setup

**Next**: Import blog content to Sanity and go live! 🎉

---

**Created**: 2026-01-31  
**Purpose**: Complete production deployment guide  
**Status**: READY FOR PRODUCTION 🚀
