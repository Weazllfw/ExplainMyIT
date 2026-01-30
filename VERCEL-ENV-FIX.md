# Vercel Environment Variable Fix ✅

**Issue**: "Supabase service key not configured" error even though `SUPABASE_SERVICE_KEY` is set in Vercel

---

## Root Cause

**Environment variables added or modified in Vercel DO NOT automatically apply to existing deployments.**

You must **redeploy** after changing environment variables for them to take effect.

---

## The Fix

### ✅ **Step 1: Verify Variables Are Set**

Go to Vercel Dashboard:
- Project Settings → Environment Variables
- Confirm `SUPABASE_SERVICE_KEY` is set for:
  - ✅ Production
  - ✅ Preview (dev branch)
  - ✅ Development

### ✅ **Step 2: Redeploy**

**Option A: Trigger New Deployment (Recommended)**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy for env vars"
git push origin dev
```

**Option B: Manual Redeploy in Vercel Dashboard**
1. Go to Deployments tab
2. Find latest deployment
3. Click "..." menu
4. Click "Redeploy"
5. ✅ Check "Use existing Build Cache" (faster)

**Option C: Redeploy via Vercel CLI**
```bash
vercel --prod  # or vercel for preview
```

---

## How to Verify

### **1. Check Health Endpoint**

Visit: `https://your-vercel-url/api/health`

Should show:
```json
{
  "timestamp": "2026-01-29T...",
  "environment": "production",
  "envVars": {
    "SUPABASE_SERVICE_KEY": {
      "exists": true,
      "length": 217,
      "startsWithEye": true,
      "preview": "eyJhbGciOiJIUzI1NiIsI..."
    }
  }
}
```

**Red Flags**:
- ❌ `exists: false` → Variable not set
- ❌ `length: 0` → Variable is empty string
- ❌ `startsWithEye: false` → Wrong format (should be JWT starting with `eyJ`)

### **2. Test Signup Flow**

Try creating an account:
- If it works → ✅ Environment variables loaded
- If error persists → Check error message for diagnostics

---

## Why This Happens

### **Vercel's Build Process**
1. Environment variables are "baked in" during build
2. Variables are read from Vercel's environment at build time
3. Changing variables after build doesn't affect deployed code
4. **Solution**: Redeploy to trigger new build with new variables

### **Common Mistake**
```
❌ Add SUPABASE_SERVICE_KEY to Vercel
❌ Push new code
❌ Expect variable to work
→ DOESN'T WORK! Deployment used old env vars.

✅ Add SUPABASE_SERVICE_KEY to Vercel
✅ Trigger redeploy (empty commit or manual)
→ WORKS! New build picks up new env vars.
```

---

## Debugging Improvements Made

### **1. Better Error Messages** (Updated `lib/db/client.ts`)

**Before**:
```
Error: Supabase service key not configured
```

**After**:
```
Error: Supabase service key not configured. 
Env check: exists=true, length=217, preview=eyJhbGciOiJIUzI1NiIsI... 
Set SUPABASE_SERVICE_KEY in Vercel environment variables.
```

Now you can see:
- If variable exists at all
- How long it is (should be ~217 chars)
- First 20 chars to verify format

### **2. Health Check Endpoint** (New `/api/health`)

Diagnose environment issues without triggering errors:
```bash
curl https://your-app.vercel.app/api/health
```

Returns all env var status without exposing actual keys.

---

## Checklist

- [ ] Verify `SUPABASE_SERVICE_KEY` is set in Vercel for all environments
- [ ] Trigger redeploy (empty commit or manual)
- [ ] Wait for deployment to complete (~2-3 minutes)
- [ ] Visit `/api/health` to verify env vars loaded
- [ ] Test signup flow
- [ ] If still failing, check error message for diagnostics

---

## Additional Environment Variables to Verify

While you're at it, make sure ALL required variables are set in Vercel:

### **Required for Auth & Database**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_KEY` ← **This one!**
- ✅ `JWT_SECRET`

### **Required for Tier 1 Features**
- ✅ `ANTHROPIC_API_KEY` (LLM reports)
- ✅ `BREVO_API_KEY` (email sending)
- ✅ `HIBP_API_KEY` (breach checks)
- ✅ `NEXT_PUBLIC_BASE_URL` (magic links)

### **Optional (Analytics & Blog)**
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- `NEXT_PUBLIC_UMAMI_SRC`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_API_TOKEN`

---

## Files Modified

1. ✅ `lib/db/client.ts` - Added diagnostic error messages
2. ✅ `app/api/health/route.ts` - NEW: Health check endpoint

---

**TL;DR**: After adding environment variables in Vercel, you **MUST redeploy**. The easiest way is to push an empty commit to trigger a new build.

```bash
git commit --allow-empty -m "Redeploy for env vars"
git push origin dev
```

Then visit `/api/health` to verify! ✅
