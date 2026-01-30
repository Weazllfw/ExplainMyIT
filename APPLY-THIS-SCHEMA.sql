-- ============================================================================
-- Explain My IT - Tier 1 Database Schema
-- ============================================================================
-- INSTRUCTIONS: Copy this entire file and paste into Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard > Your Project > SQL Editor > New Query
-- Then click "Run" to apply the schema
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for hashing (if needed)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Table: users
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  full_name VARCHAR(255),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  organization_id UUID DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_user ON users(auth_user_id);
CREATE INDEX idx_users_org ON users(organization_id, is_active) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_users_active ON users(is_active, created_at DESC) WHERE is_active = true;

-- ============================================================================
-- Table: snapshots
-- ============================================================================

CREATE TABLE snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_hash VARCHAR(64),
  access_token_hash VARCHAR(64),
  access_expires_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  signals_json JSONB,
  report_json JSONB,
  generation_duration_seconds INTEGER,
  error_message TEXT,
  snapshot_version INTEGER DEFAULT 1,
  parent_snapshot_id UUID REFERENCES snapshots(id) ON DELETE SET NULL,
  schedule_id UUID DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP DEFAULT NULL,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_snapshots_user ON snapshots(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_snapshots_domain ON snapshots(domain, created_at DESC);
CREATE INDEX idx_snapshots_email_hash ON snapshots(email_hash, domain) WHERE email_hash IS NOT NULL;
CREATE INDEX idx_snapshots_access_token ON snapshots(access_token_hash, access_expires_at) WHERE access_token_hash IS NOT NULL;
CREATE INDEX idx_snapshots_status ON snapshots(status, created_at);
CREATE INDEX idx_snapshots_schedule ON snapshots(schedule_id, created_at DESC) WHERE schedule_id IS NOT NULL;

-- ============================================================================
-- Table: rate_limits
-- ============================================================================

CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_hash VARCHAR(64),
  domain_hash VARCHAR(64) NOT NULL,
  last_run_at TIMESTAMP NOT NULL,
  run_count INTEGER DEFAULT 1,
  tier_limit_type VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT rate_limits_identification_check CHECK (
    (user_id IS NOT NULL AND email_hash IS NULL) OR
    (user_id IS NULL AND email_hash IS NOT NULL)
  )
);

CREATE UNIQUE INDEX idx_rate_limit_email_domain ON rate_limits(email_hash, domain_hash) WHERE email_hash IS NOT NULL;
CREATE UNIQUE INDEX idx_rate_limit_user_domain ON rate_limits(user_id, domain_hash) WHERE user_id IS NOT NULL;
CREATE INDEX idx_rate_limit_check ON rate_limits(email_hash, domain_hash, last_run_at) WHERE email_hash IS NOT NULL;
CREATE INDEX idx_user_rate_limit ON rate_limits(user_id, domain_hash, last_run_at) WHERE user_id IS NOT NULL;

-- ============================================================================
-- Table: hibp_cache
-- ============================================================================

CREATE TABLE hibp_cache (
  domain_hash VARCHAR(64) PRIMARY KEY,
  results_json JSONB NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX idx_hibp_expires ON hibp_cache(expires_at);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE hibp_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can view own snapshots"
  ON snapshots FOR SELECT
  USING (
    (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id))
    OR
    (user_id IS NULL AND access_token_hash IS NOT NULL)
  );

CREATE POLICY "Users can update own snapshots"
  ON snapshots FOR UPDATE
  USING (auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id));

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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snapshots_updated_at
  BEFORE UPDATE ON snapshots
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Cleanup Functions
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_expired_snapshots()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE snapshots
  SET deleted_at = NOW()
  WHERE user_id IS NULL
    AND access_expires_at < NOW() - INTERVAL '7 days'
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM snapshots
  WHERE deleted_at < NOW() - INTERVAL '30 days';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

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
-- Utility Views
-- ============================================================================

CREATE VIEW active_snapshots AS
SELECT *
FROM snapshots
WHERE deleted_at IS NULL
  AND status = 'completed';

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
-- DONE! ✅
-- ============================================================================
-- You should see:
--   ✓ 4 tables created (users, snapshots, rate_limits, hibp_cache)
--   ✓ All indexes created
--   ✓ RLS policies enabled
--   ✓ Triggers and functions created
--
-- Next: Run "npm run setup-db" to verify everything works
-- ============================================================================
