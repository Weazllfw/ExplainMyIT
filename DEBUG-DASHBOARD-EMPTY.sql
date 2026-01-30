-- DEBUG: Why is dashboard empty?
-- Run these queries in Supabase SQL Editor

-- 1. Find YOUR user record in the users table
-- This should return 1 row with your email
SELECT 
  id as user_db_id,
  auth_user_id,
  email,
  created_at
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Expected: 1 row with your email (masterjedi.r13@gmail.com)
-- If NO ROWS: User record wasn't created properly during signup
-- If 1 ROW: Note the "user_db_id" value for next queries


-- 2. Check ALL snapshots (owned + anonymous)
-- Replace [user_db_id] with the id from query #1
SELECT 
  id as snapshot_id,
  domain,
  user_id,
  email_hash,
  status,
  created_at,
  CASE 
    WHEN user_id IS NOT NULL THEN 'OWNED'
    WHEN email_hash IS NOT NULL THEN 'ANONYMOUS'
    ELSE 'ORPHANED'
  END as ownership_type
FROM snapshots
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- Expected: Should see your recent snapshot requests
-- Check the "ownership_type" column:
--   - OWNED = user_id is set (✅ will show in dashboard)
--   - ANONYMOUS = user_id is NULL (❌ won't show until auto-linked)
--   - ORPHANED = no user_id or email_hash (⚠️ broken)


-- 3. Find snapshots that SHOULD belong to you (by email hash)
-- First, get the email hash for your email:
SELECT encode(digest('masterjedi.r13@gmail.com', 'sha256'), 'hex') as your_email_hash;

-- Then find anonymous snapshots with matching email hash:
SELECT 
  id as snapshot_id,
  domain,
  user_id,
  email_hash,
  status,
  created_at
FROM snapshots
WHERE email_hash = encode(digest('masterjedi.r13@gmail.com', 'sha256'), 'hex')
  AND user_id IS NULL
  AND deleted_at IS NULL
ORDER BY created_at DESC;

-- Expected: Snapshots you requested before/during signup that haven't been linked yet
-- These SHOULD have been auto-linked during signup but weren't (bug!)


-- 4. Check if ANY snapshots exist for your user_id
-- Replace [user_db_id] with the id from query #1
-- Example: WHERE user_id = 'abc-123-def'
SELECT 
  id as snapshot_id,
  domain,
  status,
  created_at
FROM snapshots
WHERE user_id = 'REPLACE_WITH_YOUR_USER_DB_ID'  -- ⚠️ REPLACE THIS
  AND deleted_at IS NULL
ORDER BY created_at DESC;

-- Expected: Should see snapshots if any were created after API fix deployed
-- If EMPTY: API hasn't been fixed yet OR no snapshots created since fix


-- 5. DIAGNOSTIC: Count snapshots by ownership type
SELECT 
  CASE 
    WHEN user_id IS NOT NULL THEN 'OWNED'
    WHEN email_hash IS NOT NULL THEN 'ANONYMOUS'
    ELSE 'ORPHANED'
  END as type,
  COUNT(*) as count,
  MAX(created_at) as most_recent
FROM snapshots
WHERE deleted_at IS NULL
GROUP BY 
  CASE 
    WHEN user_id IS NOT NULL THEN 'OWNED'
    WHEN email_hash IS NOT NULL THEN 'ANONYMOUS'
    ELSE 'ORPHANED'
  END
ORDER BY count DESC;

-- Expected: Should see breakdown of owned vs anonymous
-- If ALL anonymous: API fix not deployed yet


-- 6. VERIFY: Check if your most recent snapshot has user_id
SELECT 
  id as snapshot_id,
  domain,
  user_id,
  email_hash,
  status,
  created_at,
  CASE 
    WHEN user_id IS NOT NULL THEN '✅ OWNED (will show in dashboard)'
    WHEN email_hash IS NOT NULL THEN '❌ ANONYMOUS (needs linking)'
    ELSE '⚠️ ORPHANED (broken)'
  END as dashboard_status
FROM snapshots
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 5;

-- This shows your 5 most recent snapshots and whether they'll appear in dashboard


-- =============================================================================
-- INTERPRETATION GUIDE
-- =============================================================================

-- SCENARIO 1: user_id is NULL for all snapshots
-- ❌ API fix not deployed yet - all snapshots created as anonymous
-- ➡️ SOLUTION: Deploy the API fix, then test a new snapshot

-- SCENARIO 2: email_hash matches but user_id is NULL
-- ❌ Auto-link on signup didn't work
-- ➡️ SOLUTION: Run manual link (see below)

-- SCENARIO 3: No snapshots at all in database
-- ❌ Snapshots not being created/saved
-- ➡️ SOLUTION: Check snapshot creation API logs

-- SCENARIO 4: Snapshots exist with user_id set
-- ✅ API is working! Dashboard query issue
-- ➡️ SOLUTION: Check RLS policies or dashboard query logic


-- =============================================================================
-- MANUAL FIX: Link anonymous snapshots to your account
-- =============================================================================

-- ⚠️ ONLY RUN THIS IF:
-- 1. You found anonymous snapshots with matching email_hash (query #3)
-- 2. Auto-link didn't work during signup

-- Step 1: Get your user_db_id from query #1
-- Step 2: Get your email_hash from query #3
-- Step 3: Run this update (REPLACE VALUES):

-- UPDATE snapshots
-- SET 
--   user_id = 'YOUR_USER_DB_ID_HERE',  -- from query #1
--   email_hash = NULL,
--   access_token_hash = NULL,
--   access_expires_at = NULL
-- WHERE email_hash = 'YOUR_EMAIL_HASH_HERE'  -- from query #3
--   AND user_id IS NULL
--   AND deleted_at IS NULL;

-- After running, refresh dashboard - snapshots should appear!


-- =============================================================================
-- QUICK TEST: Did the API fix deploy?
-- =============================================================================

-- Check the MOST RECENT snapshot
-- If it has user_id → ✅ API fix is deployed
-- If it has only email_hash → ❌ API fix NOT deployed

SELECT 
  created_at,
  domain,
  user_id,
  email_hash,
  CASE 
    WHEN user_id IS NOT NULL THEN '✅ API FIX DEPLOYED'
    ELSE '❌ API FIX NOT DEPLOYED'
  END as api_status
FROM snapshots
WHERE deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;
