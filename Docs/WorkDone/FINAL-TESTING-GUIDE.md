# Final Testing Guide - Critical Flows

**After deploying, test these scenarios in order**

---

## 🔥 **CRITICAL TEST 1: Complete Conversion Funnel**

**This is the most important test!**

### Steps:
1. **Open browser in incognito/private mode** (fresh session)
2. Go to your deployed site homepage
3. **Request a snapshot**:
   - Domain: `testdomain.com`
   - Email: `your-real-email@gmail.com` (use real email you can check)
   - Click "Get Free Snapshot"
4. **Wait for success**:
   - Should see "Snapshot Requested!" with green checkmark
   - Should see "Want to Save This Report?" conversion CTA
5. **Click "Create Free Account"** button in the success message
6. **Fill signup form**:
   - Full Name: Test User
   - Email: `your-real-email@gmail.com` ← **MUST BE SAME EMAIL**
   - Password: test1234
   - Confirm Password: test1234
   - Click "Create Free Account"
7. **Verify success screen**:
   - Should see "Account Created! 🎉"
   - Should see "What happens next" (3 steps)
   - Should see your email displayed
8. **Click "Continue to Login"**
9. **Log in**:
   - Email: `your-real-email@gmail.com`
   - Password: test1234
   - Click "Log In"
10. **Verify login success**:
    - Should see "Login Successful! Redirecting..."
    - Should see spinner (1 second)
11. **Dashboard should load**:
    - Should redirect to `/dashboard`
    - Should see "Your Dashboard" header
12. **🔥 CRITICAL CHECK**:
    - **Dashboard should show 1 snapshot for testdomain.com** ✅
    - If empty → **CONVERSION FUNNEL IS BROKEN**
13. **Click on the snapshot card**
14. **Report should load** ✅

### Expected Console Logs:
```
[Login] Attempting login for: your-real-email@gmail.com
[Login] Login successful for user: [user-id]
[Dashboard] Checking auth...
[Dashboard] User authenticated: [user-id]
```

### Check Vercel Logs:
```
[API] User record created successfully: [user-id]
[API] Found 1 anonymous snapshot(s) to link
[API] Linked snapshot [snapshot-id] (testdomain.com) to user [user-id]
[API] Auto-linking complete!
```

### If Dashboard is Empty:
**STOP and check**:
1. Did you use the EXACT same email for snapshot request and signup?
2. Check Vercel logs - does it say "Found 0 anonymous snapshots"?
3. Check Supabase database:
   ```sql
   SELECT id, domain, user_id, email_hash
   FROM snapshots
   WHERE domain = 'testdomain.com'
   ORDER BY created_at DESC;
   ```
4. Report the issue with full console logs

---

## 🔥 **CRITICAL TEST 2: Session Persistence**

**This verifies login doesn't break!**

### Steps:
1. **While logged in from Test 1**
2. **Press F5** (refresh page)
3. **🔥 CRITICAL CHECK**:
   - Should STAY on dashboard ✅
   - Should NOT redirect to login ❌
   - Header should still show "Dashboard | Log out" ✅
4. **Navigate to homepage** (click logo)
5. **Navigate back to dashboard** (click "Dashboard" in header)
6. **Should load dashboard again** ✅
7. **Close browser completely**
8. **Reopen browser**
9. **Navigate to your site `/dashboard`**
10. **Should still be logged in** ✅

### Expected Behavior:
- ✅ Page refresh keeps you logged in
- ✅ Close/reopen keeps you logged in
- ✅ Session persists for ~1 hour
- ✅ Middleware auto-refreshes session

### If Redirect Loop Happens:
**STOP and check**:
1. Open DevTools → Application → Cookies
2. Look for cookies starting with `sb-`
3. If no cookies → Session not persisting → Report issue

---

## ✅ **TEST 3: Password Reset Flow**

### Steps:
1. **Go to `/login`**
2. **Click "Forgot password?"** link
3. **Should load `/forgot-password`** (not 404)
4. **Enter email**: `your-real-email@gmail.com`
5. **Click "Send Reset Instructions"**
6. **Should see success**: "Check Your Email 📧"
7. **Check your actual email inbox**
8. **Find email from Supabase** (check spam too)
9. **Click reset link in email**
10. **Should load `/reset-password`** ✅
11. **Enter new password**: test5678
12. **Confirm password**: test5678
13. **Click "Reset Password"**
14. **Should see**: "Password Reset! 🎉"
15. **Click "Continue to Login"**
16. **Log in with NEW password**: test5678
17. **Should redirect to dashboard** ✅

---

## ✅ **TEST 4: Header Auth State**

### Steps:
1. **Logged out**: Header shows "Log in | Sign up"
2. **Log in**: Header changes to "Dashboard | Log out"
3. **Navigate around site**: Header persists
4. **Click "Dashboard"**: Loads dashboard
5. **Click "Log out"**: Returns to homepage
6. **Header changes back**: "Log in | Sign up"
7. **Try to access `/dashboard`**: Redirects to login ✅

---

## ✅ **TEST 5: Manual Claim** (Edge Case)

**Only if you want to test edge case:**

### Steps:
1. **(Logged out)** Request snapshot with `email1@test.com`
2. **Sign up with `email2@test.com`** (DIFFERENT email)
3. **Dashboard should be empty** (correct)
4. **Find report link** from email1 (in your email)
5. **Visit report** (now logged in as email2)
6. **Should see**: "Save This Report to Your Dashboard" button ✅
7. **Click "Save to Dashboard"**
8. **Should see**: "Report Saved! ✅"
9. **Navigate to dashboard**
10. **Should now show the snapshot** ✅

---

## Quick Smoke Tests

### **Homepage**:
- [ ] Loads without errors
- [ ] Snapshot request form works
- [ ] All links work

### **Signup**:
- [ ] Form validates properly
- [ ] Success screen shows
- [ ] Redirect to login works

### **Login**:
- [ ] Form validates
- [ ] Success screen shows
- [ ] Redirect to dashboard works

### **Dashboard**:
- [ ] Loads when authenticated
- [ ] Shows empty state OR snapshots
- [ ] Logout button works

### **Report Page**:
- [ ] Magic link access works
- [ ] Report content displays
- [ ] Smart CTA shows (based on auth state)

---

## Console Monitoring

### **Filter Console Logs**:
```javascript
// In DevTools Console, filter by:
[Login]
[Signup]
[Dashboard]
[API]
```

### **What to Look For**:

**Good Signs** ✅:
```
[Login] Login successful
[Dashboard] User authenticated
[API] Auto-linking complete!
```

**Bad Signs** ❌:
```
Error: Supabase service key not configured
Error: Invalid session
Error: Failed to link snapshot
```

---

## Vercel Log Monitoring

### **After Deployment**:
1. Go to Vercel Dashboard
2. Click latest deployment
3. Click "Logs" tab
4. Set filter to "Last 1 hour"

### **What to Look For**:

**During Signup** (look for):
```
[API] Create user record request: { authUserId: "...", email: "..." }
[API] User record created successfully: user-123
[API] Checking for anonymous snapshots...
[API] Found X anonymous snapshot(s) to link
[API] Linked snapshot...
[API] Auto-linking complete!
```

**If You See Errors**:
- Note the error message
- Note the timestamp
- Note what action triggered it
- Report for debugging

---

## Success Criteria

### **Must Pass** (Critical):
- [ ] ✅ Snapshot request creates anonymous snapshot
- [ ] ✅ Signup auto-links snapshot to user
- [ ] ✅ Dashboard shows linked snapshot
- [ ] ✅ Login persists across page refresh
- [ ] ✅ No redirect loops

### **Should Pass** (Important):
- [ ] ✅ Password reset flow works end-to-end
- [ ] ✅ Header shows correct auth state
- [ ] ✅ Manual claim works for edge cases
- [ ] ✅ Logout clears session properly

### **Nice to Have** (Polish):
- [ ] ✅ All success confirmations show
- [ ] ✅ No console errors
- [ ] ✅ Favicon displays
- [ ] ✅ Analytics tracking works

---

## If Things Break

### **Immediate Actions**:

1. **Check Console**:
   - Screenshot errors
   - Note URL where error occurred
   - Note what action triggered it

2. **Check Vercel Logs**:
   - Filter by "Error" or "Failed"
   - Find relevant logs
   - Copy full error message

3. **Check Vercel Environment Variables**:
   - Verify all required env vars are set
   - Verify set for "Preview" (dev branch)
   - Check for typos or extra whitespace

4. **Report Issue**:
   - Error message
   - What you were doing
   - Console screenshot
   - Vercel log excerpt

5. **Quick Rollback** (if needed):
   - Vercel Dashboard → Deployments
   - Find previous working deployment
   - "Promote to Production"

---

## Common Issues & Fixes

### **"Dashboard empty after signup"**:
- **Check**: Same email used for snapshot and signup?
- **Check**: Vercel logs show auto-linking?
- **Check**: Database shows `user_id` is set?

### **"Redirect loop on login"**:
- **Check**: Cookies being set? (DevTools → Application → Cookies)
- **Check**: Middleware deployed? (Vercel build logs)
- **Check**: `@supabase/ssr` installed? (package.json)

### **"Password reset email not arriving"**:
- **Check**: Spam folder
- **Check**: Supabase email confirmations enabled
- **Check**: `NEXT_PUBLIC_BASE_URL` set correctly

### **"Service key not configured"**:
- **Check**: Which file/component is throwing error?
- **Check**: Is it client-side code trying to use admin client?
- **Check**: Should use browser client instead?

---

## Performance Check

### **Page Load Times** (approximate):
- Homepage: < 1s
- Login/Signup: < 1s
- Dashboard: < 2s (with auth check)
- Report page: < 2s (with data fetch)

**If Slow**:
- Check Vercel region (should be closest to you)
- Check database queries (should be fast)
- Check middleware overhead (should be <50ms)

---

## Final Pre-Deploy Checklist

### **Code**:
- [x] ✅ All files changed
- [x] ✅ No TypeScript errors
- [x] ✅ No ESLint errors
- [x] ✅ Dependencies installed

### **Environment**:
- [ ] ✅ All env vars set in Vercel
- [ ] ✅ Set for Preview (dev branch)
- [ ] ✅ No extra whitespace in values

### **Supabase**:
- [ ] ✅ Database schema applied
- [ ] ✅ RLS policies enabled
- [ ] ✅ Email confirmations disabled (for testing)
- [ ] ✅ Redirect URLs configured

### **Testing Plan**:
- [x] ✅ Test plan documented
- [x] ✅ Success criteria defined
- [x] ✅ Rollback plan ready

---

## Deploy Now!

```bash
git add .
git commit -m "Fix: Complete conversion funnel with auto-link + cookie auth"
git push origin dev
```

**Then run the tests above!** 🚀

---

**Estimated Testing Time**: 15-20 minutes  
**Risk Level**: 🟡 Medium (major changes, well-tested patterns)  
**Impact**: 🔥 **CRITICAL** - Core product functionality  

**Let's go!** 🎯
