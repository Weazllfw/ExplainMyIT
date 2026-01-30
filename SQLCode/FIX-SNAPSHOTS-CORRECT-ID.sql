-- 🔥 CORRECT FIX: Link snapshots using the RIGHT user ID
-- The issue: dashboard queries by database user ID, not auth user ID!

-- ============================================================================
-- STEP 1: Get your DATABASE user ID (NOT the same as auth_user_id!)
-- ============================================================================

SELECT 
  id as database_user_id,           -- ⚠️ THIS is what you need!
  auth_user_id,                     -- This is what you were using (wrong!)
  email
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Expected: 1 row showing TWO different IDs:
--   - auth_user_id: 93f19f81-8dba-4af8-a20c-9a67c64a8c7f (Supabase Auth ID)
--   - database_user_id: abc-123-xyz (Different! This is the users table primary key)
-- 
-- ⚠️ COPY THE "database_user_id" VALUE!


-- ============================================================================
-- STEP 2: Link your snapshots using the CORRECT user ID
-- ============================================================================

-- Replace 'YOUR_DATABASE_USER_ID_HERE' with the "database_user_id" from Step 1
-- (NOT the auth_user_id!)

UPDATE snapshots
SET 
  user_id = 'YOUR_DATABASE_USER_ID_HERE',  -- ⚠️ Use database_user_id, NOT auth_user_id!
  email_hash = NULL,
  access_token_hash = NULL,
  access_expires_at = NULL
WHERE email_hash = '69d67071662ca30b76071591afa24157cc0955f3fdb660e7ca133e086d5514f2'
  AND user_id IS NULL
  AND deleted_at IS NULL;

-- Expected: "UPDATE 7" (your 7 snapshots)


-- ============================================================================
-- STEP 3: Verify it worked
-- ============================================================================

-- Check snapshots are now linked to your database user ID
SELECT 
  domain,
  user_id,
  created_at
FROM snapshots
WHERE user_id = 'YOUR_DATABASE_USER_ID_HERE'  -- Same ID as Step 2
ORDER BY created_at DESC;

-- Expected: Should see all 7 of your snapshots!


-- ============================================================================
-- WHY THIS IS DIFFERENT:
-- ============================================================================

-- Supabase Auth creates users with an auth_user_id (UUID)
-- Your app's users table ALSO has an id column (primary key, also UUID)
-- These are TWO DIFFERENT IDs!

-- auth_user_id: 93f19f81-8dba-4af8-a20c-9a67c64a8c7f (Supabase Auth system)
-- id (database):  abc-123-def-456 (Your users table primary key)

-- The snapshots.user_id column references users.id (database), NOT auth_user_id
-- That's why the dashboard couldn't find your snapshots!


-- ============================================================================
-- EXAMPLE (with fake IDs):
-- ============================================================================

-- Imagine Step 1 returned:
--   database_user_id: 550e8400-e29b-41d4-a716-446655440000
--   auth_user_id: 93f19f81-8dba-4af8-a20c-9a67c64a8c7f

-- Then Step 2 would be:
-- UPDATE snapshots
-- SET user_id = '550e8400-e29b-41d4-a716-446655440000'  -- database_user_id
-- WHERE email_hash = '69d67071662ca30b76071591afa24157cc0955f3fdb660e7ca133e086d5514f2'
--   AND user_id IS NULL;
