/**
 * Signal Collection Types
 * 
 * These types define the structure of signal data collected from
 * external sources (DNS, email auth, TLS, tech stack, HIBP, etc.)
 */

// ============================================================================
// Base Types
// ============================================================================

export type Confidence = 'high' | 'medium' | 'low';

export interface BlockResult<T = any> {
  block_name: string;
  success: boolean;
  confidence: Confidence;
  raw_signals: T;
  derived_flags: Record<string, boolean>;
  error_message?: string;
  collected_at: string;
}

// ============================================================================
// Block A: Domain & DNS Posture
// ============================================================================

export interface DnsRawSignals {
  domain_age_years: number | null;
  registrar: string | null;
  nameservers: string[];
  a_records: string[];
  aaaa_records: string[];
  mx_records: string[];
  dns_hosting_provider: string | null;
}

export interface DnsDerivedFlags {
  domain_age_low: boolean;          // < 1 year
  dns_provider_third_party: boolean; // Using external DNS (Cloudflare, etc.)
  single_point_dns_dependency: boolean; // All NS from same provider
}

export type DnsBlockResult = BlockResult<DnsRawSignals>;

// ============================================================================
// Block B: Email & Identity Posture
// ============================================================================

export interface EmailRawSignals {
  mx_provider: string | null;       // Google, Microsoft, other
  spf_record: string | null;
  spf_strictness: 'strict' | 'permissive' | 'missing';
  dkim_present: boolean;
  dmarc_policy: 'reject' | 'quarantine' | 'none' | 'missing';
}

export interface EmailDerivedFlags {
  email_spoofing_possible: boolean;
  email_protection_partial: boolean;
  email_protection_strong: boolean;
}

export type EmailBlockResult = BlockResult<EmailRawSignals>;

// ============================================================================
// Block C: Website & TLS/SSL
// ============================================================================

export interface TlsRawSignals {
  https_enforced: boolean;
  certificate_issuer: string | null;
  certificate_expiry_days: number | null;
  tls_versions_supported: string[];
  certificate_valid: boolean;
}

export interface TlsDerivedFlags {
  ssl_expiring_soon: boolean;       // < 30 days
  legacy_tls_supported: boolean;    // TLS 1.0 or 1.1
  no_https_redirect: boolean;
}

export type TlsBlockResult = BlockResult<TlsRawSignals>;

// ============================================================================
// Block D: Tech Stack & CMS
// ============================================================================

export interface TechStackRawSignals {
  cms_detected: string | null;      // WordPress, etc.
  cdn_provider: string | null;       // Cloudflare, etc.
  hosting_provider: string | null;   // Inferred
  server_headers: Record<string, string>;
  technologies: string[];
}

export interface TechStackDerivedFlags {
  cms_common_target: boolean;        // WordPress, Joomla
  cdn_present: boolean;
  hosting_identified: boolean;
}

export type TechStackBlockResult = BlockResult<TechStackRawSignals>;

// ============================================================================
// Block E: Public Exposure & Infrastructure
// ============================================================================

export interface ExposureRawSignals {
  reverse_dns: string | null;
  ip_geolocation: string | null;
  infrastructure_type: 'cloud' | 'datacenter' | 'unknown';
  hosting_region: string | null;
}

export interface ExposureDerivedFlags {
  cloud_hosted: boolean;
  infrastructure_identifiable: boolean;
}

export type ExposureBlockResult = BlockResult<ExposureRawSignals>;

// ============================================================================
// Block F: Known Breaches (HIBP)
// ============================================================================

export interface HibpRawSignals {
  breaches: Array<{
    name: string;
    title: string;
    breach_date: string;
    added_date: string;
    data_classes: string[];
  }>;
  total_breach_count: number;
  most_recent_breach_date: string | null;
}

export interface HibpDerivedFlags {
  recent_breach: boolean;            // Within last 12 months
  multiple_breaches: boolean;        // 2 or more
  credential_breach: boolean;        // Password or email exposed
}

export type HibpBlockResult = BlockResult<HibpRawSignals>;

// ============================================================================
// Combined Signals (All Blocks)
// ============================================================================

export interface AllSignals {
  domain: string;
  collected_at: string;
  blocks: {
    dns: DnsBlockResult;
    email: EmailBlockResult;
    tls: TlsBlockResult;
    techstack: TechStackBlockResult;
    exposure: ExposureBlockResult;
    hibp: HibpBlockResult;
  };
}

// ============================================================================
// Cross-Block Flags (Computed from all blocks)
// ============================================================================

export interface CrossBlockFlags {
  high_risk_overall: boolean;
  insurance_relevant: boolean;
  quick_wins_available: boolean;
  professional_setup: boolean;
}

// ============================================================================
// Helper Types
// ============================================================================

export type BlockName = 'dns' | 'email' | 'tls' | 'techstack' | 'exposure' | 'hibp';

export interface CollectionError {
  block_name: BlockName;
  error: string;
  timestamp: string;
}
