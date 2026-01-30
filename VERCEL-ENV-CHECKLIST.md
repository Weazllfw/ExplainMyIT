# Vercel Environment Variable Emergency Checklist

## Issue: `exists=false, length=0, preview=undefined`

This means the variable is **NOT loaded** in the runtime environment.

---

## Step-by-Step Fix

### ✅ **Step 1: Verify Variable Name (EXACT match required)**

In Vercel Dashboard → Settings → Environment Variables:

**Check for typos**:
- ❌ `SUPABASE_SERVICE _KEY` (extra space)
- ❌ `SUPABASE_SERVICE_KEY ` (trailing space)
- ❌ `SUPABASE_SERVICEKEY` (missing underscore)
- ✅ `SUPABASE_SERVICE_KEY` (correct)

**Variable names are case-sensitive and must match exactly!**

---

### ✅ **Step 2: Verify Variable is Set for PREVIEW/DEV**

Your branch is `dev`, which Vercel treats as a **Preview** environment.

In Vercel environment variable settings, make sure the checkbox is checked for:
- [ ] Production
- [x] **Preview** ← **MUST be checked for `dev` branch**
- [ ] Development

**If "Preview" is not checked, the variable won't be available on `dev` branch deployments!**

---

### ✅ **Step 3: Verify Variable Value**

Click the eye icon to reveal the value. It should:
- Start with `eyJ` (JWT format)
- Be ~200-220 characters long
- NOT have any extra quotes, spaces, or line breaks

**Common mistakes**:
- ❌ `"eyJhbGc..."` (has quotes - remove them)
- ❌ `eyJhbGc...` + newline (has trailing newline - remove it)
- ✅ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (clean, no quotes)

---

### ✅ **Step 4: Re-save the Variable**

Even if it looks correct:
1. Click "Edit" on `SUPABASE_SERVICE_KEY`
2. **Re-paste the value** (copy fresh from Supabase dashboard)
3. Ensure **Preview** is checked
4. Click "Save"

---

### ✅ **Step 5: FORCE Redeploy**

After saving, you **MUST trigger a new deployment**:

**Option A: Push empty commit** (fastest):
```bash
git commit --allow-empty -m "Force redeploy for env vars"
git push origin dev
```

**Option B: Vercel dashboard**:
1. Go to Deployments tab
2. Find latest deployment
3. Click "..." → "Redeploy"
4. ✅ **UNCHECK "Use existing Build Cache"** (important!)

---

### ✅ **Step 6: Wait and Verify**

1. Wait 2-3 minutes for deployment to complete
2. Visit: `https://explain-my-it-git-dev-mdsltd.vercel.app/api/health`
3. Check the response:
   ```json
   {
     "envVars": {
       "SUPABASE_SERVICE_KEY": {
         "exists": true,  // ← Should be true now
         "length": 217,   // ← Should be ~200+
         "startsWithEye": true  // ← Should be true
       }
     }
   }
   ```

If still showing `exists: false`, the variable is not set correctly in Vercel.

---

## Issue 2: Supabase Auth Rate Limit (429 Error)

You're also seeing:
```
POST /auth/v1/signup 429 (Too Many Requests)
```

### **This is a separate issue** - Supabase's rate limit on signups

**Supabase Auth Rate Limits**:
- **60 signups per hour** per project (free tier)
- Resets every hour

**Solutions**:
1. **Wait 1 hour** before trying again
2. **Use different email** for each test
3. **Don't spam signup** during testing
4. **Use login instead** if account already exists

**To check rate limit status**:
- Go to Supabase Dashboard → Settings → API
- Look for "Auth" section to see rate limit info

---

## Quick Diagnostic

### Run this in your browser console on the signup page:

```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(data => console.log('SUPABASE_SERVICE_KEY:', data.envVars.SUPABASE_SERVICE_KEY));
```

Should show:
```
SUPABASE_SERVICE_KEY: {exists: true, length: 217, startsWithEye: true}
```

If shows `exists: false`, the variable is not loaded.

---

## Common Pitfall

**You set the variable, but forgot to check "Preview"** ← Most common issue!

Vercel environment variables are **per-environment**. If you only checked "Production", the variable won't be available on preview deployments (like your `dev` branch).

---

## Emergency Bypass (Testing Only)

If you need to test RIGHT NOW while fixing Vercel:

1. Add to `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your_key_here
   ```
2. Run locally: `npm run dev`
3. Test locally at `localhost:3000`

**But this won't help Vercel** - you still need to fix the Vercel env vars.

---

**TL;DR**:
1. Verify `SUPABASE_SERVICE_KEY` has **Preview** checked in Vercel
2. Re-save the variable
3. Redeploy WITHOUT cache: `git commit --allow-empty -m "redeploy" && git push`
4. Wait 1 hour for Supabase rate limit to reset
