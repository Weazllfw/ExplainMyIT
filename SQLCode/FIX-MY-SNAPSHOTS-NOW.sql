-- 🔥 MANUAL FIX: Link your 6 snapshots to your account
-- Run this in Supabase SQL Editor RIGHT NOW

-- Step 1: Get your user_id
-- (Run this first to confirm it returns 1 row)
SELECT 
  id as your_user_id,
  email,
  auth_user_id
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Expected: 1 row with your email (masterjedi.r13@gmail.com)
-- Note the "your_user_id" value!


-- Step 2: Link ALL your anonymous snapshots
-- (Replace 'YOUR_USER_ID_HERE' with the id from Step 1)
UPDATE snapshots
SET 
  user_id = 'YOUR_USER_ID_HERE',  -- ⚠️ PASTE YOUR USER ID HERE
  email_hash = NULL,
  access_token_hash = NULL,
  access_expires_at = NULL
WHERE email_hash = '69d67071662ca30b76071591afa24157cc0955f3fdb660e7ca133e086d5514f2'
  AND user_id IS NULL
  AND deleted_at IS NULL;

-- Expected result: "UPDATE 6" (linking your 6 snapshots)


-- Step 3: Verify it worked
SELECT 
  domain,
  user_id,
  created_at,
  CASE 
    WHEN user_id IS NOT NULL THEN '✅ NOW VISIBLE IN DASHBOARD'
    ELSE '❌ STILL ANONYMOUS'
  END as status
FROM snapshots
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Expected: All your snapshots now show "✅ NOW VISIBLE IN DASHBOARD"


-- ============================================================================
-- QUICK COPY-PASTE VERSION (after getting your user_id)
-- ============================================================================

-- Example if your user_id is 'abc-123-def-456':
-- 
-- UPDATE snapshots
-- SET 
--   user_id = 'abc-123-def-456',
--   email_hash = NULL,
--   access_token_hash = NULL,
--   access_expires_at = NULL
-- WHERE email_hash = '69d67071662ca30b76071591afa24157cc0955f3fdb660e7ca133e086d5514f2'
--   AND user_id IS NULL;
