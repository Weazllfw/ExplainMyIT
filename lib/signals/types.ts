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
  // WHOIS governance signals (NEVER store raw names/emails/addresses)
  domain_expiry_days: number | null;
  domain_expiry_window: 'more_than_1_year' | '6_to_12_months' | 'under_6_months' | 'unknown';
  registrant_type: 'business' | 'individual' | 'proxy' | 'unknown';
  transfer_lock_enabled: boolean | null;
}

export interface DnsDerivedFlags {
  [key: string]: boolean;
  domain_age_low: boolean;          // < 1 year
  dns_provider_third_party: boolean; // Using external DNS (Cloudflare, etc.)
  single_point_dns_dependency: boolean; // All NS from same provider
  // Governance signals
  registrar_dns_separated: boolean;  // Registrar and DNS provider are different
  domain_expiry_soon: boolean;       // Expiring within 6 months
  registrant_individual: boolean;    // Registered to individual, not business
  registrant_privacy_enabled: boolean; // Privacy protection enabled
  transfer_lock_confirmed: boolean;  // Transfer lock is present
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
  // Enhanced deliverability signals
  blacklist_status: 'clean' | 'listed' | 'unknown';
  blacklists_checked: string[];     // Which blacklists were queried
  deliverability_score: number;     // 0-100 composite score
}

export interface EmailDerivedFlags {
  [key: string]: boolean;
  email_spoofing_possible: boolean;
  email_protection_partial: boolean;
  email_protection_strong: boolean;
  // Enhanced flags
  blacklisted: boolean;             // Listed on any blacklist
  deliverability_excellent: boolean; // 90-100
  deliverability_good: boolean;     // 70-89
  deliverability_poor: boolean;     // < 70
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
  // Enhanced certificate details
  certificate_organization: string | null;
  certificate_san_count: number;
  certificate_wildcard: boolean;
  certificate_type: 'DV' | 'OV' | 'EV' | 'unknown';
  // Security headers
  security_headers: {
    strict_transport_security: boolean;
    content_security_policy: boolean;
    x_frame_options: boolean;
    x_content_type_options: boolean;
    referrer_policy: boolean;
    permissions_policy: boolean;
  };
}

export interface TlsDerivedFlags {
  [key: string]: boolean;
  ssl_expiring_soon: boolean;       // < 30 days
  legacy_tls_supported: boolean;    // TLS 1.0 or 1.1
  no_https_redirect: boolean;
  // Enhanced flags
  certificate_shared: boolean;      // Wildcard or multi-domain
  certificate_premium: boolean;     // EV cert
  security_headers_strong: boolean; // All headers present
  security_headers_partial: boolean; // Some headers present
  security_headers_missing: boolean; // Few or no headers
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
  [key: string]: boolean;
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
  [key: string]: boolean;
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
  emails_checked?: string[];  // Which emails were checked (e.g., info@, user's email)
}

export interface HibpDerivedFlags {
  [key: string]: boolean;
  recent_breach: boolean;            // Within last 12 months
  multiple_breaches: boolean;        // 2 or more
  credential_breach: boolean;        // Password or email exposed
}

export type HibpBlockResult = BlockResult<HibpRawSignals>;

// ============================================================================
// Block G: Subdomains & Surface Area
// ============================================================================

export interface SubdomainRawSignals {
  subdomains: Array<{
    subdomain: string;
    first_seen: string | null;
    last_seen: string | null;
  }>;
  total_subdomain_count: number;
  active_subdomain_count: number | null;
  potentially_abandoned: string[];  // Always empty for Tier 1 (violates rules)
  // Certificate issuance data (Tier 1 safe - observational only)
  certificate_issuance_count_12mo: number;  // Certs issued in last 12 months
  most_recent_certificate_date: string | null; // ISO date of most recent cert
}

export interface SubdomainDerivedFlags {
  [key: string]: boolean;
  large_surface_area: boolean;      // > 10 subdomains
  abandoned_subdomains_likely: boolean; // Has dev/test/old patterns
  subdomain_sprawl: boolean;        // > 50 subdomains
}

export type SubdomainBlockResult = BlockResult<SubdomainRawSignals>;

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
    subdomains?: SubdomainBlockResult; // Optional (requires paid API)
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

export type BlockName = 'dns' | 'email' | 'tls' | 'techstack' | 'exposure' | 'hibp' | 'subdomains';

export interface CollectionError {
  block_name: BlockName;
  error: string;
  timestamp: string;
}
