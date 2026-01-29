-- ============================================================================
-- Explain My IT - Tier 1 Database Schema
-- ============================================================================
-- Description: Core database schema for Tier 1 (Free Public Snapshot)
-- Tables: 4 (users, snapshots, rate_limits, hibp_cache)
-- Design: Extensible for Tier 2 without breaking changes
-- Version: 1.0
-- Created: January 28, 2026
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for hashing (if needed)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Table: users
-- Purpose: User accounts (created via Supabase Auth)
-- ============================================================================

CREATE TABLE users (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Supabase Auth Integration
  auth_user_id UUID UNIQUE,
  -- Links to auth.users in Supabase Auth
  
  -- Core User Info
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  full_name VARCHAR(255),
  
  -- Tier Management
  subscription_tier VARCHAR(20) DEFAULT 'free',
  -- Values: 'free' (Tier 1 only)
  -- Tier 2 will add: 'pro', 'team', 'enterprise'
  
  -- Organization (Tier 2-ready, NULL in Tier 1)
  organization_id UUID DEFAULT NULL,
  -- Will reference organizations(id) in Tier 2
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP DEFAULT NULL,
  -- Soft delete for data retention
  
  -- Audit Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP DEFAULT NULL
);

-- Indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_user ON users(auth_user_id);
CREATE INDEX idx_users_org ON users(organization_id, is_active) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_users_active ON users(is_active, created_at DESC) WHERE is_active = true;

-- ============================================================================
-- Table: snapshots
-- Purpose: Store all snapshot data (signals + LLM reports)
-- ============================================================================

CREATE TABLE snapshots (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Domain & Ownership
  domain VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- NULL for Tier 1 anonymous snapshots
  -- Set when user claims report or runs authenticated snapshot
  
  -- Anonymous Access (Tier 1 magic links)
  email_hash VARCHAR(64),
  -- SHA-256 of email for anonymous requests
  access_token_hash VARCHAR(64),
  -- SHA-256 of JWT magic link token
  access_expires_at TIMESTAMP,
  -- Magic link expiry (48 hours)
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- Values: 'pending', 'processing', 'completed', 'failed'
  
  -- Signal Data (JSONB for flexibility)
  signals_json JSONB,
  -- Contains all 6 blocks: dns, email, tls, techstack, exposure, hibp
  -- Tier 2 can add new blocks without schema change
  -- Example: {"dns": {...}, "email": {...}, "tls": {...}, ...}
  
  -- LLM Report Data (JSONB)
  report_json JSONB,
  -- Contains: owner_summary, top_findings, assumptions, questions, email_summary
  -- Tier 2 can add new sections without schema change
  -- Example: {"owner_summary": {...}, "top_findings": [...], ...}
  
  -- Metadata
  generation_duration_seconds INTEGER,
  -- Performance tracking (time to complete snapshot)
  error_message TEXT,
  -- Error details if status = 'failed'
  
  -- Versioning (Tier 2-ready, NULL in Tier 1)
  snapshot_version INTEGER DEFAULT 1,
  -- Tier 2: Track version for historical comparison
  parent_snapshot_id UUID REFERENCES snapshots(id) ON DELETE SET NULL,
  -- Tier 2: Link to previous snapshot for diff/comparison
  
  -- Scheduling (Tier 2-ready, NULL in Tier 1)
  schedule_id UUID DEFAULT NULL,
  -- Will reference snapshot_schedules(id) in Tier 2
  
  -- Audit Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP DEFAULT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
  -- Soft delete for data retention
);

-- Indexes for snapshots
CREATE INDEX idx_snapshots_user ON snapshots(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_snapshots_domain ON snapshots(domain, created_at DESC);
CREATE INDEX idx_snapshots_email_hash ON snapshots(email_hash, domain) WHERE email_hash IS NOT NULL;
CREATE INDEX idx_snapshots_access_token ON snapshots(access_token_hash, access_expires_at) WHERE access_token_hash IS NOT NULL;
CREATE INDEX idx_snapshots_status ON snapshots(status, created_at);
CREATE INDEX idx_snapshots_schedule ON snapshots(schedule_id, created_at DESC) WHERE schedule_id IS NOT NULL;

-- GIN indexes for JSONB queries (optional, add if needed)
-- CREATE INDEX idx_snapshots_signals_gin ON snapshots USING gin(signals_json);
-- CREATE INDEX idx_snapshots_report_gin ON snapshots USING gin(report_json);

-- ============================================================================
-- Table: rate_limits
-- Purpose: Enforce usage limits (1 per domain per email per 30 days)
-- ============================================================================

CREATE TABLE rate_limits (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Identification (supports both anonymous + authenticated)
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- For authenticated users
  email_hash VARCHAR(64),
  -- For anonymous users (SHA-256 of email)
  domain_hash VARCHAR(64) NOT NULL,
  -- SHA-256 of domain
  
  -- Rate Limit Tracking
  last_run_at TIMESTAMP NOT NULL,
  run_count INTEGER DEFAULT 1,
  -- Tier 2: support multiple runs per period
  
  -- Tier (Tier 2-ready)
  tier_limit_type VARCHAR(20) DEFAULT 'free',
  -- Tier 2: 'free' = 1/30d, 'pro' = unlimited, etc.
  
  -- Audit Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints (one or the other must be set)
  CONSTRAINT rate_limits_identification_check CHECK (
    (user_id IS NOT NULL AND email_hash IS NULL) OR
    (user_id IS NULL AND email_hash IS NOT NULL)
  )
);

-- Unique constraints
CREATE UNIQUE INDEX idx_rate_limit_email_domain ON rate_limits(email_hash, domain_hash) WHERE email_hash IS NOT NULL;
CREATE UNIQUE INDEX idx_rate_limit_user_domain ON rate_limits(user_id, domain_hash) WHERE user_id IS NOT NULL;

-- Indexes for lookups
CREATE INDEX idx_rate_limit_check ON rate_limits(email_hash, domain_hash, last_run_at) WHERE email_hash IS NOT NULL;
CREATE INDEX idx_user_rate_limit ON rate_limits(user_id, domain_hash, last_run_at) WHERE user_id IS NOT NULL;

-- ============================================================================
-- Table: hibp_cache
-- Purpose: Cache HIBP API results (30 days)
-- ============================================================================

CREATE TABLE hibp_cache (
  -- Primary Key
  domain_hash VARCHAR(64) PRIMARY KEY,
  -- SHA-256 of domain
  
  -- Cached Data
  results_json JSONB NOT NULL,
  -- HIBP breach data
  
  -- Cache Management
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

-- Index for cache expiry cleanup
CREATE INDEX idx_hibp_expires ON hibp_cache(expires_at);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE hibp_cache ENABLE ROW LEVEL SECURITY;

-- Users: Can only view/update their own record
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Snapshots: Can view their own or anonymous via magic link
CREATE POLICY "Users can view own snapshots"
  ON snapshots FOR SELECT
  USING (
    -- Authenticated users can see their own snapshots
    (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id))
    OR
    -- Anonymous users can access via magic link (validated in app code)
    (user_id IS NULL AND access_token_hash IS NOT NULL)
  );

CREATE POLICY "Users can update own snapshots"
  ON snapshots FOR UPDATE
  USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

-- Service role can do everything (for background jobs)
CREATE POLICY "Service role full access on users"
  ON users FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on snapshots"
  ON snapshots FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on rate_limits"
  ON rate_limits FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access on hibp_cache"
  ON hibp_cache FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- Triggers for updated_at timestamps
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for snapshots
CREATE TRIGGER update_snapshots_updated_at
  BEFORE UPDATE ON snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for rate_limits
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Cleanup Functions
-- ============================================================================

-- Function to clean up expired anonymous snapshots
CREATE OR REPLACE FUNCTION cleanup_expired_snapshots()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Soft delete anonymous snapshots that expired 7 days ago
  UPDATE snapshots
  SET deleted_at = NOW()
  WHERE user_id IS NULL
    AND access_expires_at < NOW() - INTERVAL '7 days'
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Hard delete soft-deleted snapshots after 30 days
  DELETE FROM snapshots
  WHERE deleted_at < NOW() - INTERVAL '30 days';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired HIBP cache
CREATE OR REPLACE FUNCTION cleanup_expired_hibp_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM hibp_cache
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Utility Views (Optional)
-- ============================================================================

-- View: Active snapshots (not deleted, completed)
CREATE VIEW active_snapshots AS
SELECT *
FROM snapshots
WHERE deleted_at IS NULL
  AND status = 'completed';

-- View: User snapshot summary
CREATE VIEW user_snapshot_summary AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(s.id) as total_snapshots,
  COUNT(DISTINCT s.domain) as unique_domains,
  MAX(s.created_at) as last_snapshot_at
FROM users u
LEFT JOIN snapshots s ON u.id = s.user_id AND s.deleted_at IS NULL
GROUP BY u.id, u.email;

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts linked to Supabase Auth';
COMMENT ON TABLE snapshots IS 'All snapshot data including signals and LLM reports';
COMMENT ON TABLE rate_limits IS 'Usage controls to enforce 1 snapshot per domain per email per 30 days';
COMMENT ON TABLE hibp_cache IS 'Cache for Have I Been Pwned API results (30 day TTL)';

COMMENT ON COLUMN snapshots.signals_json IS 'JSONB containing all 6 signal blocks (dns, email, tls, techstack, exposure, hibp)';
COMMENT ON COLUMN snapshots.report_json IS 'JSONB containing LLM-generated report sections (owner_summary, top_findings, assumptions, questions, email_summary)';
COMMENT ON COLUMN snapshots.user_id IS 'NULL for anonymous snapshots, set when user claims report or runs authenticated snapshot';
COMMENT ON COLUMN snapshots.access_token_hash IS 'SHA-256 hash of magic link JWT token for anonymous access';

-- ============================================================================
-- Schema Version Tracking
-- ============================================================================

CREATE TABLE schema_version (
  version INTEGER PRIMARY KEY,
  description TEXT,
  applied_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO schema_version (version, description) VALUES
(1, 'Initial Tier 1 schema: users, snapshots, rate_limits, hibp_cache');

-- ============================================================================
-- End of Tier 1 Schema
-- ============================================================================
-- Total Tables: 4 core + 1 version tracking
-- Ready for Tier 2 extensions without breaking changes
-- See: Docs/dev/Database-Schema.md for Tier 2 extension plans
-- ============================================================================
