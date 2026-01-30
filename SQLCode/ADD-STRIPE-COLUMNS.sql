-- ============================================================================
-- Add Stripe Integration Columns to Users Table
-- ============================================================================
-- INSTRUCTIONS: Run this in Supabase SQL Editor AFTER applying the main schema
-- This adds columns needed for Stripe subscription management
-- ============================================================================

-- Add Stripe-related columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT false;

-- Create index for faster Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription ON users(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Optional: Create table to track webhook events (prevents duplicate processing)
CREATE TABLE IF NOT EXISTS stripe_events (
  id SERIAL PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_id ON stripe_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type, processed_at DESC);

-- ============================================================================
-- Verification Query (optional - run after migration)
-- ============================================================================
-- Check that columns were added successfully:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- AND column_name LIKE '%stripe%';
