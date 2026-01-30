/**
 * Database TypeScript Types
 * 
 * Auto-generated types for Supabase database tables.
 * These types match the schema defined in lib/db/schema.sql
 */

// ============================================================================
// Core Table Types
// ============================================================================

export interface User {
  id: string;
  auth_user_id: string | null;
  email: string;
  email_verified: boolean;
  full_name: string | null;
  subscription_tier: 'free' | 'pro' | 'team' | 'enterprise';
  organization_id: string | null;
  is_active: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface Snapshot {
  id: string;
  domain: string;
  user_id: string | null;
  email_hash: string | null;
  access_token_hash: string | null;
  access_expires_at: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  signals_json: SnapshotSignals | null;
  report_json: SnapshotReport | null;
  generation_duration_seconds: number | null;
  error_message: string | null;
  snapshot_version: number;
  parent_snapshot_id: string | null;
  schedule_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  deleted_at: string | null;
}

export interface RateLimit {
  id: number;
  user_id: string | null;
  email_hash: string | null;
  domain_hash: string;
  last_run_at: string;
  run_count: number;
  tier_limit_type: 'free' | 'pro' | 'team' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface HibpCache {
  domain_hash: string;
  results_json: HibpResults;
  cached_at: string;
  expires_at: string;
}

export interface SchemaVersion {
  version: number;
  description: string;
  applied_at: string;
}

// ============================================================================
// Signal Types (JSONB structures)
// ============================================================================

export interface SnapshotSignals {
  domain?: string;
  collected_at?: string;
  collection_duration_ms?: number;
  dns?: DnsSignals;
  email?: EmailSignals;
  tls?: TlsSignals;
  techstack?: TechStackSignals;
  exposure?: ExposureSignals;
  hibp?: HibpSignals;
  subdomains?: SubdomainSignals;
  cross_block_flags?: string[];
  // Tier 2 can add: m365, google, azure, aws, etc.
}

export interface DnsSignals {
  domain_age_days: number | null;
  registrar: string | null;
  nameservers: string[];
  a_records: string[];
  aaaa_records: string[];
  mx_records: string[];
  has_dnssec: boolean;
  confidence: 'high' | 'medium' | 'low';
  checked_at: string;
  error?: string;
}

export interface EmailSignals {
  has_spf: boolean;
  spf_record: string | null;
  has_dkim: boolean;
  dkim_selectors: string[];
  has_dmarc: boolean;
  dmarc_record: string | null;
  dmarc_policy: 'none' | 'quarantine' | 'reject' | null;
  email_spoofing_possible: boolean;
  confidence: 'high' | 'medium' | 'low';
  checked_at: string;
  error?: string;
}

export interface TlsSignals {
  has_https: boolean;
  https_enforced: boolean;
  certificate_valid: boolean;
  certificate_issuer: string | null;
  certificate_expires_at: string | null;
  days_until_expiry: number | null;
  tls_versions: string[];
  ssl_expiring_soon: boolean;
  confidence: 'high' | 'medium' | 'low';
  checked_at: string;
  error?: string;
}

export interface TechStackSignals {
  cms: string | null;
  cms_version: string | null;
  hosting_provider: string | null;
  cdn_detected: boolean;
  cdn_provider: string | null;
  server_software: string | null;
  frameworks: string[];
  cms_common_target: boolean;
  confidence: 'high' | 'medium' | 'low';
  checked_at: string;
  error?: string;
}

export interface ExposureSignals {
  ip_addresses: string[];
  ip_geolocation: string | null;
  reverse_dns: string | null;
  infrastructure_type: 'cloud' | 'dedicated' | 'shared' | 'unknown';
  cloud_provider: string | null;
  confidence: 'high' | 'medium' | 'low';
  disclaimer: string;
  checked_at: string;
  error?: string;
}

export interface HibpSignals {
  breaches_found: number;
  breach_names: string[];
  most_recent_breach_date: string | null;
  total_accounts_breached: number | null;
  data_classes_compromised: string[];
  confidence: 'high' | 'medium' | 'low';
  checked_at: string;
  error?: string;
}

export interface SubdomainSignals {
  success: boolean;
  confidence: 'high' | 'medium' | 'low';
  raw_signals: {
    subdomains: Array<{
      subdomain: string;
      first_seen: string | null;
      last_seen: string | null;
    }>;
    total_subdomain_count: number;
    active_subdomain_count: number | null;
    potentially_abandoned: string[];
  };
  derived_flags: {
    large_surface_area: boolean;
    abandoned_subdomains_likely: boolean;
    subdomain_sprawl: boolean;
  };
  collected_at: string;
  error_message?: string;
}

// ============================================================================
// Report Types (JSONB structures)
// ============================================================================

export interface SnapshotReport {
  owner_summary?: OwnerSummary;
  top_findings?: TopFinding[];
  block_narratives?: BlockNarratives;
  assumptions?: Assumption[];
  questions?: Question[];
  email_summary?: EmailSummary;
}

export interface OwnerSummary {
  overall_assessment: string;
  key_points: string[];
  confidence_level: 'high' | 'medium' | 'low';
  generated_at: string;
}

export interface TopFinding {
  finding_code: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_blocks: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface BlockNarratives {
  dns?: BlockNarrative;
  email?: BlockNarrative;
  tls?: BlockNarrative;
  techstack?: BlockNarrative;
  exposure?: BlockNarrative;
  hibp?: BlockNarrative;
}

export interface BlockNarrative {
  block_name: string;
  narrative: string;
  findings: Finding[];
  confidence: 'high' | 'medium' | 'low';
}

export interface Finding {
  finding_code: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: 'high' | 'medium' | 'low';
}

export interface Assumption {
  assumption_text: string;
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface Question {
  question_text: string;
  context: string;
  audience: 'internal_it' | 'msp' | 'vendor';
}

export interface EmailSummary {
  key_findings: string[];
  recommended_action: string | null;
  tone: 'calm' | 'neutral' | 'urgent';
}

// ============================================================================
// HIBP Cache Types
// ============================================================================

export interface HibpResults {
  breaches: HibpBreach[];
  fetched_at: string;
  emails_checked?: string[];  // Which emails were checked (e.g., info@, user's email)
}

export interface HibpBreach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  LogoPath: string;
}

// ============================================================================
// Database Type (for Supabase client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      snapshots: {
        Row: Snapshot;
        Insert: Omit<Snapshot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Snapshot, 'id' | 'created_at'>>;
      };
      rate_limits: {
        Row: RateLimit;
        Insert: Omit<RateLimit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<RateLimit, 'id' | 'created_at'>>;
      };
      hibp_cache: {
        Row: HibpCache;
        Insert: Omit<HibpCache, 'cached_at'>;
        Update: Partial<HibpCache>;
      };
      schema_version: {
        Row: SchemaVersion;
        Insert: Omit<SchemaVersion, 'applied_at'>;
        Update: never;
      };
    };
    Views: {
      active_snapshots: {
        Row: Snapshot;
      };
      user_snapshot_summary: {
        Row: {
          user_id: string;
          email: string;
          total_snapshots: number;
          unique_domains: number;
          last_snapshot_at: string | null;
        };
      };
    };
    Functions: {
      cleanup_expired_snapshots: {
        Args: Record<string, never>;
        Returns: number;
      };
      cleanup_expired_hibp_cache: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
}

// ============================================================================
// Helper Types
// ============================================================================

export type SnapshotStatus = Snapshot['status'];
export type SubscriptionTier = User['subscription_tier'];
export type Confidence = 'high' | 'medium' | 'low';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
