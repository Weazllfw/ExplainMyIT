-- 🚨 EMERGENCY: No user record exists in database!
-- Run these queries in Supabase SQL Editor

-- ============================================================================
-- STEP 1: Verify the problem
-- ============================================================================

-- Check if user record exists with your auth_user_id
SELECT 
  id,
  auth_user_id,
  email,
  created_at
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Expected: 0 rows (confirms the problem)

-- Check if user record exists with your email
SELECT 
  id,
  auth_user_id,
  email,
  created_at
FROM users
WHERE email = 'masterjedi.r13@gmail.com';

-- If this returns 1 row:
--   - User record exists but auth_user_id is NULL or different
--   - Signup process partially failed
-- If this returns 0 rows:
--   - No user record at all
--   - Signup process completely failed


-- ============================================================================
-- STEP 2A: If user record exists with email but wrong/NULL auth_user_id
-- ============================================================================

-- Update the existing record with correct auth_user_id
UPDATE users
SET auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f'
WHERE email = 'masterjedi.r13@gmail.com'
  AND (auth_user_id IS NULL OR auth_user_id != '93f19f81-8dba-4af8-a20c-9a67c64a8c7f');

-- Expected: "UPDATE 1"


-- ============================================================================
-- STEP 2B: If NO user record exists at all
-- ============================================================================

-- Create the user record manually
INSERT INTO users (
  auth_user_id,
  email,
  email_verified,
  full_name,
  subscription_tier,
  is_active
) VALUES (
  '93f19f81-8dba-4af8-a20c-9a67c64a8c7f',
  'masterjedi.r13@gmail.com',
  true,  -- Assume verified since you can log in
  'Your Name Here',  -- ⚠️ Replace with your name or NULL
  'free',
  true
);

-- Expected: "INSERT 0 1"


-- ============================================================================
-- STEP 3: Verify the fix
-- ============================================================================

-- Confirm user record now exists with correct auth_user_id
SELECT 
  id as database_user_id,
  auth_user_id,
  email,
  created_at
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Expected: 1 row with your email ✅
-- ⚠️ COPY THE "database_user_id" VALUE!


-- ============================================================================
-- STEP 4: Link your 7 snapshots to the user record
-- ============================================================================

-- Replace 'YOUR_DATABASE_USER_ID' with the id from Step 3
UPDATE snapshots
SET 
  user_id = 'YOUR_DATABASE_USER_ID',  -- ⚠️ PASTE YOUR DATABASE USER ID HERE
  email_hash = NULL,
  access_token_hash = NULL,
  access_expires_at = NULL
WHERE email_hash = '69d67071662ca30b76071591afa24157cc0955f3fdb660e7ca133e086d5514f2'
  AND user_id IS NULL
  AND deleted_at IS NULL;

-- Expected: "UPDATE 7"


-- ============================================================================
-- STEP 5: Verify everything
-- ============================================================================

-- Check user record
SELECT 
  id,
  auth_user_id,
  email
FROM users
WHERE auth_user_id = '93f19f81-8dba-4af8-a20c-9a67c64a8c7f';

-- Check snapshots are linked
SELECT 
  id,
  domain,
  user_id,
  created_at
FROM snapshots
WHERE user_id = 'YOUR_DATABASE_USER_ID'  -- Same ID from Step 3
ORDER BY created_at DESC;

-- Expected: 7 snapshots with your user_id ✅


-- ============================================================================
-- WHY THIS HAPPENED:
-- ============================================================================

-- During signup, the signup API should have:
-- 1. Created auth user in Supabase Auth ✅ (you can log in)
-- 2. Called /api/auth/create-user-record ❌ (this failed or never happened)
-- 3. Created row in users table ❌ (missing!)

-- Result: You have an auth account but no database user record
-- This is why dashboard can't find your user ID
