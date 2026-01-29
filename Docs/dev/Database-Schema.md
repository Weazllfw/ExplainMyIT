# Database Schema - Tier 1 with Tier 2 Extensibility

**Product**: Explain My IT  
**Version**: Tier 1 (Tier 2-Ready)  
**Database**: Supabase PostgreSQL  
**Created**: January 28, 2026

---

## Design Principles

### Extensibility First

This schema is designed to:
1. ✅ Support Tier 1 features fully
2. ✅ Extend easily to Tier 2 without breaking changes
3. ✅ Allow new features without schema migrations
4. ✅ Support multi-tenancy from day one
5. ✅ Enable complex queries for future features

### Key Design Decisions

**Why these choices matter for Tier 2**:
- **Separate organizations table**: Tier 2 will support teams
- **Nullable user_id in snapshots**: Tier 1 anonymous → Tier 2 authenticated
- **JSONB for signals/reports**: New signal types without schema changes
- **Versioning columns**: Track changes over time for alerts
- **Soft deletes**: Data retention for compliance
- **Audit timestamps**: Everything has `created_at`, `updated_at`

---

## Schema Overview

```
Core Auth & Users
├── organizations          # Multi-tenant foundation (Tier 2)
├── users                  # User accounts
└── user_roles            # Role-based access (Tier 2)

Snapshots & Reports
├── snapshots             # All snapshot data
├── snapshot_schedules    # Recurring snapshots (Tier 2)
└── snapshot_history      # Historical tracking (Tier 2)

Integrations & Credentials
├── integrations          # Internal IT integrations (Tier 2)
└── integration_credentials # Secure credential storage (Tier 2)

Alerts & Notifications
├── alert_rules           # User-defined alerts (Tier 2)
├── alert_events          # Alert triggers (Tier 2)
└── notification_preferences # Per-user settings (Tier 2)

Rate Limiting & Cache
├── rate_limits           # Usage controls
└── hibp_cache           # External API cache

Billing & Usage (Tier 2)
├── subscriptions         # Subscription management
└── usage_logs           # Metering for billing
```

---

## Core Schema (Tier 1)

### Table: users

**Purpose**: User accounts (created via Supabase Auth)

```sql
CREATE TABLE users (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Supabase Auth Integration
  auth_user_id UUID UNIQUE,  -- Links to auth.users in Supabase Auth
  
  -- Core User Info
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  full_name VARCHAR(255),
  
  -- Tier Management
  subscription_tier VARCHAR(20) DEFAULT 'free',
  -- Values: 'free', 'tier2', 'tier3'
  -- Tier 2 will add: 'pro', 'team', 'enterprise'
  
  -- Organization (Tier 2-ready)
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  -- NULL for Tier 1, set for Tier 2 team accounts
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP,  -- Soft delete
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_users_email (email),
  INDEX idx_users_auth_user (auth_user_id),
  INDEX idx_users_org (organization_id, is_active)
);
```

**Tier 1 Usage**:
- Basic user accounts
- Email-based identification
- Free tier tracking

**Tier 2 Extensions** (no schema change needed):
- `organization_id` links to team
- `subscription_tier` tracks paid plans
- Add new tiers via enum values

---

### Table: snapshots

**Purpose**: Store all snapshot data (signals + LLM reports)

```sql
CREATE TABLE snapshots (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Domain & Ownership
  domain VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  -- NULL for Tier 1 anonymous snapshots
  -- Set when user claims report or runs authenticated snapshot
  
  -- Anonymous Access (Tier 1)
  email_hash VARCHAR(64),  -- SHA-256 of email for anonymous requests
  access_token_hash VARCHAR(64),  -- SHA-256 of JWT magic link token
  access_expires_at TIMESTAMP,  -- Magic link expiry (48 hours)
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- Values: 'pending', 'processing', 'completed', 'failed'
  
  -- Signal Data (JSONB for flexibility)
  signals_json JSONB,
  -- Contains all 6 blocks: dns, email, tls, techstack, exposure, hibp
  -- Tier 2 can add new blocks without schema change
  
  -- LLM Report Data (JSONB)
  report_json JSONB,
  -- Contains: owner_summary, top_findings, assumptions, questions, email_summary
  -- Tier 2 can add new sections without schema change
  
  -- Metadata
  generation_duration_seconds INTEGER,  -- Performance tracking
  error_message TEXT,  -- If status = 'failed'
  
  -- Versioning (Tier 2-ready)
  snapshot_version INTEGER DEFAULT 1,
  -- Tier 2: Track version for historical comparison
  parent_snapshot_id UUID REFERENCES snapshots(id),
  -- Tier 2: Link to previous snapshot for diff/comparison
  
  -- Scheduling (Tier 2-ready)
  schedule_id UUID REFERENCES snapshot_schedules(id) ON DELETE SET NULL,
  -- NULL for Tier 1 (manual), set for Tier 2 recurring snapshots
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  deleted_at TIMESTAMP,  -- Soft delete
  
  -- Indexes
  INDEX idx_snapshots_user (user_id, created_at DESC),
  INDEX idx_snapshots_domain (domain, created_at DESC),
  INDEX idx_snapshots_email_hash (email_hash, domain),
  INDEX idx_snapshots_access_token (access_token_hash, access_expires_at),
  INDEX idx_snapshots_status (status, created_at),
  INDEX idx_snapshots_schedule (schedule_id, created_at DESC)  -- Tier 2
);
```

**Tier 1 Usage**:
- Store all snapshot data
- Anonymous access via magic links
- User-claimed reports

**Tier 2 Extensions** (no schema change needed):
- `parent_snapshot_id` links snapshots for history/comparison
- `schedule_id` connects to recurring schedules
- `snapshot_version` tracks iterations
- JSONB can store new signal blocks
- JSONB can store new report sections

---

### Table: rate_limits

**Purpose**: Enforce usage limits (1 per domain per email per 30 days)

```sql
CREATE TABLE rate_limits (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Identification (supports both anonymous + authenticated)
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_hash VARCHAR(64),  -- For anonymous users
  domain_hash VARCHAR(64) NOT NULL,  -- SHA-256 of domain
  
  -- Rate Limit Tracking
  last_run_at TIMESTAMP NOT NULL,
  run_count INTEGER DEFAULT 1,  -- Tier 2: support multiple runs
  
  -- Tier (Tier 2-ready)
  tier_limit_type VARCHAR(20) DEFAULT 'free',
  -- Tier 2: 'free' = 1/30d, 'pro' = unlimited, etc.
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(email_hash, domain_hash),
  UNIQUE(user_id, domain_hash),
  
  -- Indexes
  INDEX idx_rate_limit_check (email_hash, domain_hash, last_run_at),
  INDEX idx_user_rate_limit (user_id, domain_hash, last_run_at)
);
```

**Tier 1 Usage**:
- 1 snapshot per domain per email per 30 days
- Works for anonymous and authenticated users

**Tier 2 Extensions** (no schema change needed):
- `run_count` allows multiple runs per period
- `tier_limit_type` differentiates free vs paid limits
- Can add new tier types without migration

---

### Table: hibp_cache

**Purpose**: Cache HIBP API results (30 days)

```sql
CREATE TABLE hibp_cache (
  -- Primary Key
  domain_hash VARCHAR(64) PRIMARY KEY,  -- SHA-256 of domain
  
  -- Cached Data
  results_json JSONB NOT NULL,
  -- HIBP breach data
  
  -- Cache Management
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Indexes
  INDEX idx_hibp_expires (expires_at)
);
```

**Tier 1 Usage**:
- Cache HIBP results for 30 days
- Reduce API costs

**Tier 2 Extensions** (no schema change needed):
- Same structure works for Tier 2
- Could extend with additional breach sources in JSONB

---

## Tier 2-Ready Tables (Not Implemented in Tier 1)

These tables are **not created** in Tier 1, but the schema is designed to add them easily without breaking Tier 1.

### Table: organizations

**Purpose**: Multi-tenant teams (Tier 2 only)

```sql
CREATE TABLE organizations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Organization Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Subscription
  subscription_tier VARCHAR(20) DEFAULT 'team',
  subscription_status VARCHAR(20) DEFAULT 'active',
  -- Values: 'active', 'cancelled', 'suspended'
  
  -- Billing
  stripe_customer_id VARCHAR(100) UNIQUE,
  billing_email VARCHAR(255),
  
  -- Limits (configured per plan)
  max_users INTEGER DEFAULT 5,
  max_domains INTEGER DEFAULT 10,
  max_snapshots_per_month INTEGER DEFAULT 100,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_org_slug (slug),
  INDEX idx_org_stripe (stripe_customer_id)
);
```

**Why Not Tier 1**:
- Tier 1 is single-user only
- No team collaboration needed yet
- Keeps complexity low

**Tier 2 Benefit**:
- Users link to organizations via `users.organization_id`
- Team snapshots shared across org
- Centralized billing

---

### Table: snapshot_schedules

**Purpose**: Recurring snapshots (Tier 2 only)

```sql
CREATE TABLE snapshot_schedules (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  
  -- Schedule Configuration
  frequency VARCHAR(20) NOT NULL,
  -- Values: 'daily', 'weekly', 'monthly'
  cron_expression VARCHAR(100),  -- For custom schedules
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP,
  next_run_at TIMESTAMP,
  
  -- Alert Integration
  alert_on_changes BOOLEAN DEFAULT false,
  alert_threshold VARCHAR(20) DEFAULT 'medium',
  -- Values: 'any', 'medium', 'high'
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_schedule_next_run (is_active, next_run_at),
  INDEX idx_schedule_user (user_id, is_active),
  INDEX idx_schedule_org (organization_id, is_active)
);
```

**Why Not Tier 1**:
- Tier 1 is manual snapshots only
- No recurring checks needed

**Tier 2 Benefit**:
- Automatic snapshot generation
- Links via `snapshots.schedule_id`
- Change detection via `alert_on_changes`

---

### Table: snapshot_history

**Purpose**: Track changes over time (Tier 2 only)

```sql
CREATE TABLE snapshot_history (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  current_snapshot_id UUID REFERENCES snapshots(id) ON DELETE CASCADE,
  previous_snapshot_id UUID REFERENCES snapshots(id) ON DELETE SET NULL,
  domain VARCHAR(255) NOT NULL,
  
  -- Change Detection
  changes_detected BOOLEAN NOT NULL,
  changes_json JSONB,
  -- Contains: { block: 'dns', field: 'nameservers', old: [...], new: [...] }
  
  -- Severity
  change_severity VARCHAR(20),
  -- Values: 'low', 'medium', 'high', 'critical'
  
  -- Alert Triggered
  alert_triggered BOOLEAN DEFAULT false,
  alert_event_id UUID REFERENCES alert_events(id),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_history_domain (domain, created_at DESC),
  INDEX idx_history_changes (changes_detected, change_severity)
);
```

**Why Not Tier 1**:
- No historical comparison in Tier 1
- Tier 1 is point-in-time only

**Tier 2 Benefit**:
- Automatic change detection
- Alert triggers
- Historical trending

---

### Table: integrations

**Purpose**: Internal IT integrations (Tier 2 only)

```sql
CREATE TABLE integrations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Integration Type
  integration_type VARCHAR(50) NOT NULL,
  -- Values: 'm365', 'google_workspace', 'azure_ad', 'aws', 'okta', etc.
  
  -- Configuration
  config_json JSONB,
  -- Type-specific configuration (API endpoints, scopes, etc.)
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  last_sync_status VARCHAR(20),
  -- Values: 'success', 'failed', 'partial'
  
  -- Health
  health_status VARCHAR(20) DEFAULT 'unknown',
  -- Values: 'healthy', 'degraded', 'failed'
  last_error TEXT,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_integration_user (user_id, is_active),
  INDEX idx_integration_org (organization_id, is_active),
  INDEX idx_integration_type (integration_type)
);
```

**Why Not Tier 1**:
- Tier 1 is external-only (public data)
- No internal IT access needed

**Tier 2 Benefit**:
- Connect to M365, Google Workspace, etc.
- Enable internal IT checks
- Secure credential management via `integration_credentials`

---

### Table: integration_credentials

**Purpose**: Securely store integration credentials (Tier 2 only)

```sql
CREATE TABLE integration_credentials (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  
  -- Credentials (encrypted at rest by Supabase)
  credential_type VARCHAR(50) NOT NULL,
  -- Values: 'api_key', 'oauth_token', 'service_account'
  
  encrypted_value TEXT NOT NULL,
  -- Encrypted via Supabase Vault or pg_crypto
  
  -- OAuth-specific
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP,
  
  -- Status
  is_valid BOOLEAN DEFAULT true,
  last_validated_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_cred_integration (integration_id),
  INDEX idx_cred_expires (token_expires_at)
);
```

**Security**:
- Uses Supabase Vault for encryption
- Never logged or exposed in APIs
- Automatic rotation support

---

### Table: alert_rules

**Purpose**: User-defined alert configurations (Tier 2 only)

```sql
CREATE TABLE alert_rules (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Scope
  domain VARCHAR(255),  -- NULL = all domains
  schedule_id UUID REFERENCES snapshot_schedules(id) ON DELETE CASCADE,
  
  -- Rule Configuration
  rule_name VARCHAR(255) NOT NULL,
  rule_type VARCHAR(50) NOT NULL,
  -- Values: 'any_change', 'specific_change', 'threshold', 'anomaly'
  
  rule_config_json JSONB NOT NULL,
  -- Example: { "block": "dns", "field": "nameservers", "threshold": "any_change" }
  
  -- Alert Settings
  severity_filter VARCHAR(20) DEFAULT 'medium',
  -- Values: 'any', 'medium', 'high', 'critical'
  
  notification_channels TEXT[],
  -- Values: ['email', 'slack', 'webhook']
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- Indexes
  INDEX idx_alert_user (user_id, is_active),
  INDEX idx_alert_org (organization_id, is_active),
  INDEX idx_alert_domain (domain, is_active)
);
```

**Why Not Tier 1**:
- No alerting in Tier 1
- Tier 1 is on-demand only

**Tier 2 Benefit**:
- Proactive change detection
- Custom alert rules
- Multi-channel notifications

---

### Table: alert_events

**Purpose**: Log when alerts are triggered (Tier 2 only)

```sql
CREATE TABLE alert_events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links
  alert_rule_id UUID REFERENCES alert_rules(id) ON DELETE CASCADE,
  snapshot_history_id UUID REFERENCES snapshot_history(id),
  snapshot_id UUID REFERENCES snapshots(id),
  
  -- Event Details
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Change Details
  changes_json JSONB,
  
  -- Notification Status
  notifications_sent BOOLEAN DEFAULT false,
  notification_attempts INTEGER DEFAULT 0,
  notification_errors TEXT[],
  
  -- User Action
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_event_rule (alert_rule_id, created_at DESC),
  INDEX idx_event_snapshot (snapshot_id),
  INDEX idx_event_severity (severity, created_at DESC),
  INDEX idx_event_unacknowledged (acknowledged, created_at DESC)
);
```

---

### Table: notification_preferences

**Purpose**: Per-user notification settings (Tier 2 only)

```sql
CREATE TABLE notification_preferences (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email Preferences
  email_enabled BOOLEAN DEFAULT true,
  email_frequency VARCHAR(20) DEFAULT 'immediate',
  -- Values: 'immediate', 'hourly', 'daily', 'weekly'
  
  -- Channel Preferences
  slack_enabled BOOLEAN DEFAULT false,
  slack_webhook_url TEXT,
  
  webhook_enabled BOOLEAN DEFAULT false,
  webhook_url TEXT,
  
  -- Quiet Hours
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  quiet_hours_timezone VARCHAR(50),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_notif_user (user_id)
);
```

---

### Table: subscriptions (Tier 2 - Billing)

**Purpose**: Manage subscriptions and billing

```sql
CREATE TABLE subscriptions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Stripe Integration
  stripe_subscription_id VARCHAR(100) UNIQUE,
  stripe_customer_id VARCHAR(100),
  stripe_price_id VARCHAR(100),
  
  -- Plan Details
  plan_name VARCHAR(50) NOT NULL,
  -- Values: 'pro', 'team', 'enterprise'
  billing_interval VARCHAR(20),
  -- Values: 'monthly', 'yearly'
  
  -- Status
  status VARCHAR(20) NOT NULL,
  -- Values: 'active', 'past_due', 'cancelled', 'expired'
  
  -- Pricing
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Dates
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_sub_user (user_id, status),
  INDEX idx_sub_org (organization_id, status),
  INDEX idx_sub_stripe (stripe_subscription_id),
  INDEX idx_sub_period (current_period_end)
);
```

---

### Table: usage_logs (Tier 2 - Metering)

**Purpose**: Track usage for billing and limits

```sql
CREATE TABLE usage_logs (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Ownership
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Usage Type
  usage_type VARCHAR(50) NOT NULL,
  -- Values: 'snapshot_generated', 'internal_scan', 'alert_sent', 'api_call'
  
  -- Metering
  quantity INTEGER DEFAULT 1,
  
  -- Context
  snapshot_id UUID REFERENCES snapshots(id),
  domain VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_usage_user (user_id, created_at DESC),
  INDEX idx_usage_org (organization_id, created_at DESC),
  INDEX idx_usage_type (usage_type, created_at DESC)
);
```

---

## Migration Strategy

### Tier 1 Initial Setup

**Create only these tables**:
```sql
1. users
2. snapshots
3. rate_limits
4. hibp_cache
```

**4 tables. Simple. Fast.**

### Tier 2 Migration (Zero Downtime)

**Step 1**: Add new tables
```sql
-- Add all Tier 2 tables
CREATE TABLE organizations (...);
CREATE TABLE snapshot_schedules (...);
CREATE TABLE snapshot_history (...);
-- etc.
```

**Step 2**: No existing data migration needed
- `users.organization_id` is already NULL (default for Tier 1)
- `snapshots.schedule_id` is already NULL (Tier 1 manual)
- `snapshots.parent_snapshot_id` is already NULL (Tier 1 no history)

**Step 3**: New features work immediately
- Tier 2 users set `organization_id`
- Recurring snapshots populate `schedule_id`
- Historical comparison uses `parent_snapshot_id`

**Zero breaking changes for Tier 1 users.**

---

## Indexing Strategy

### Tier 1 Query Patterns

**Most common queries**:
1. Get user's snapshots: `user_id + created_at DESC`
2. Check rate limit: `email_hash + domain_hash + last_run_at`
3. Validate magic link: `access_token_hash + access_expires_at`
4. Get snapshot by ID: `id` (primary key)

**All indexed.**

### Tier 2 Additional Indexes

```sql
-- Organization queries (when adding orgs table)
CREATE INDEX idx_snapshots_org ON snapshots(organization_id, created_at DESC);

-- Schedule queries
CREATE INDEX idx_snapshots_schedule_domain ON snapshots(schedule_id, domain, created_at DESC);

-- Historical comparison
CREATE INDEX idx_snapshots_parent ON snapshots(parent_snapshot_id, created_at DESC);

-- Change detection
CREATE INDEX idx_snapshots_version ON snapshots(domain, snapshot_version DESC);
```

---

## Row Level Security (RLS)

### Tier 1 RLS Policies

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own snapshots"
  ON snapshots FOR SELECT
  USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
    OR access_token_hash IS NOT NULL  -- Allow magic link access
  );

-- Users can only update their own data
CREATE POLICY "Users can update own snapshots"
  ON snapshots FOR UPDATE
  USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );
```

### Tier 2 RLS Extensions

```sql
-- Organization members can view org snapshots
CREATE POLICY "Org members can view org snapshots"
  ON snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_user_id = auth.uid()
      AND users.organization_id = snapshots.organization_id
    )
  );
```

---

## Backup & Retention

### Tier 1 Retention Policy

**Magic link snapshots (unclaimed)**:
- Keep for 48 hours after `access_expires_at`
- Soft delete: set `deleted_at`
- Hard delete: cron job after 7 days

**User snapshots (claimed)**:
- Keep indefinitely (free tier)
- Soft delete on user request
- Hard delete on account deletion + 30 days

### Tier 2 Retention

**Historical snapshots**:
- Keep all versions for comparison
- Retention based on plan (30 days, 90 days, 1 year)
- Compress older snapshots to save space

---

## Performance Considerations

### Tier 1 Optimizations

**JSONB Queries**:
```sql
-- Fast lookup for specific signal blocks
CREATE INDEX idx_snapshots_signals_dns 
  ON snapshots USING gin ((signals_json -> 'dns'));

-- Fast lookup for report findings
CREATE INDEX idx_snapshots_report_findings 
  ON snapshots USING gin ((report_json -> 'top_findings'));
```

**Partitioning** (when volume grows):
```sql
-- Partition snapshots by month
CREATE TABLE snapshots_2026_01 PARTITION OF snapshots
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### Tier 2 Optimizations

**Materialized Views** (for dashboards):
```sql
-- Pre-compute org usage stats
CREATE MATERIALIZED VIEW org_usage_summary AS
SELECT 
  organization_id,
  COUNT(*) as total_snapshots,
  COUNT(DISTINCT domain) as unique_domains,
  MAX(created_at) as last_snapshot_at
FROM snapshots
WHERE deleted_at IS NULL
GROUP BY organization_id;

-- Refresh hourly
REFRESH MATERIALIZED VIEW CONCURRENTLY org_usage_summary;
```

---

## Cost Estimates

### Tier 1 Storage (1,000 snapshots/month)

**Assumptions**:
- Avg snapshot size: 100 KB (signals + report)
- Retention: 30 days for anonymous, indefinite for claimed

**Monthly storage**:
- 1,000 snapshots × 100 KB = 100 MB
- Supabase free tier: 500 MB database
- **Cost: $0** (within free tier)

### Tier 2 Storage (10,000 snapshots/month with history)

**Assumptions**:
- 10,000 snapshots/month
- 5 versions per domain (historical)
- Retention: 90 days

**Monthly storage**:
- 10,000 × 5 versions × 100 KB = 5 GB
- Supabase Pro: $25/month (8 GB included)
- **Cost: $25/month**

---

## Summary

### Tier 1 Schema (Implement Now)

✅ **4 tables**:
1. `users` - User accounts
2. `snapshots` - All snapshot data
3. `rate_limits` - Usage controls
4. `hibp_cache` - API cache

✅ **Simple, fast, cheap**

### Tier 2 Extensions (Add Later)

🔮 **10 additional tables**:
5. `organizations` - Multi-tenancy
6. `snapshot_schedules` - Recurring snapshots
7. `snapshot_history` - Change tracking
8. `integrations` - Internal IT access
9. `integration_credentials` - Secure credentials
10. `alert_rules` - Alert configuration
11. `alert_events` - Alert logs
12. `notification_preferences` - User settings
13. `subscriptions` - Billing management
14. `usage_logs` - Metering

🔮 **Zero breaking changes for Tier 1**

---

## Next Steps

1. **Today**: Create Tier 1 schema (4 tables)
2. **Week 1**: Test with real data
3. **Tier 2**: Add new tables when needed (no migration pain)

---

**This schema is production-ready for Tier 1 and future-proof for Tier 2.**
