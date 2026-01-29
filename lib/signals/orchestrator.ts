/**
 * Signal Collection Orchestrator
 * 
 * Runs all 6 signal modules in parallel and combines results.
 * Computes cross-block flags based on combined signals.
 */

import { collectDnsSignals } from './dns';
import { collectEmailSignals } from './email';
import { collectTlsSignals } from './tls';
import { collectTechStackSignals } from './techstack';
import { collectExposureSignals } from './exposure';
import { collectHibpSignals } from './hibp';
import type { AllSignals, CrossBlockFlags } from './types';
import type { SnapshotSignals } from '@/types/database';

/**
 * Collect all signals for a domain in parallel
 */
export async function collectAllSignals(domain: string): Promise<SnapshotSignals> {
  const startTime = new Date();
  
  console.log(`📡 Starting signal collection for: ${domain}`);
  
  // Run all 6 modules in parallel for speed
  const [
    dnsResult,
    emailResult,
    tlsResult,
    techstackResult,
    exposureResult,
    hibpResult,
  ] = await Promise.all([
    collectDnsSignals(domain).catch(err => {
      console.error('DNS collection failed:', err);
      return createFailedResult('dns');
    }),
    collectEmailSignals(domain).catch(err => {
      console.error('Email collection failed:', err);
      return createFailedResult('email');
    }),
    collectTlsSignals(domain).catch(err => {
      console.error('TLS collection failed:', err);
      return createFailedResult('tls');
    }),
    collectTechStackSignals(domain).catch(err => {
      console.error('Tech stack collection failed:', err);
      return createFailedResult('techstack');
    }),
    collectExposureSignals(domain).catch(err => {
      console.error('Exposure collection failed:', err);
      return createFailedResult('exposure');
    }),
    collectHibpSignals(domain).catch(err => {
      console.error('HIBP collection failed:', err);
      return createFailedResult('hibp');
    }),
  ]);
  
  const endTime = new Date();
  const durationMs = endTime.getTime() - startTime.getTime();
  
  console.log(`✅ Signal collection complete in ${(durationMs / 1000).toFixed(2)}s`);
  
  // Log success/failure summary
  const summary = [
    `DNS: ${dnsResult.success ? '✅' : '❌'}`,
    `Email: ${emailResult.success ? '✅' : '❌'}`,
    `TLS: ${tlsResult.success ? '✅' : '❌'}`,
    `Tech: ${techstackResult.success ? '✅' : '❌'}`,
    `Exposure: ${exposureResult.success ? '✅' : '❌'}`,
    `HIBP: ${hibpResult.success ? '✅' : '❌'}`,
  ];
  console.log(`   ${summary.join(' | ')}`);
  
  // Compute cross-block flags
  const crossBlockFlagsObj = computeCrossBlockFlags({
    dns: dnsResult,
    email: emailResult,
    tls: tlsResult,
    techstack: techstackResult,
    exposure: exposureResult,
    hibp: hibpResult,
  });
  
  // Convert CrossBlockFlags object to string array
  const crossBlockFlags: string[] = Object.entries(crossBlockFlagsObj)
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
  
  // Convert to SnapshotSignals format for database
  const signals: SnapshotSignals = {
    domain,
    collected_at: startTime.toISOString(),
    collection_duration_ms: durationMs,
    dns: {
      confidence: dnsResult.confidence,
      domain_age_days: dnsResult.raw_signals.domain_age_years ? dnsResult.raw_signals.domain_age_years * 365 : null,
      registrar: dnsResult.raw_signals.registrar,
      nameservers: dnsResult.raw_signals.nameservers,
      a_records: dnsResult.raw_signals.a_records,
      aaaa_records: dnsResult.raw_signals.aaaa_records,
      mx_records: dnsResult.raw_signals.mx_records,
      has_dnssec: false, // TODO: Add DNSSEC detection
      checked_at: startTime.toISOString(),
      error: dnsResult.error_message,
    },
    email: {
      has_spf: emailResult.raw_signals.spf_record !== null,
      spf_record: emailResult.raw_signals.spf_record,
      has_dkim: emailResult.raw_signals.dkim_present || false,
      dkim_selectors: [],
      has_dmarc: emailResult.raw_signals.dmarc_policy !== null,
      dmarc_record: null,
      dmarc_policy: emailResult.raw_signals.dmarc_policy,
      email_spoofing_possible: false,
      confidence: emailResult.confidence,
      checked_at: startTime.toISOString(),
      error: emailResult.error_message,
    },
    tls: {
      has_https: tlsResult.raw_signals.certificate_valid || false,
      https_enforced: tlsResult.raw_signals.https_enforced,
      certificate_valid: tlsResult.raw_signals.certificate_valid,
      certificate_issuer: tlsResult.raw_signals.certificate_issuer,
      certificate_expires_at: null,
      days_until_expiry: tlsResult.raw_signals.certificate_expiry_days,
      tls_versions: tlsResult.raw_signals.tls_versions_supported || [],
      ssl_expiring_soon: (tlsResult.raw_signals.certificate_expiry_days !== null && tlsResult.raw_signals.certificate_expiry_days < 30),
      confidence: tlsResult.confidence,
      checked_at: startTime.toISOString(),
      error: tlsResult.error_message,
    },
    techstack: {
      cms: techstackResult.raw_signals.cms_detected,
      cms_version: null,
      hosting_provider: techstackResult.raw_signals.hosting_provider,
      cdn_detected: techstackResult.raw_signals.cdn_provider !== null,
      cdn_provider: techstackResult.raw_signals.cdn_provider,
      server_software: null,
      frameworks: techstackResult.raw_signals.technologies || [],
      cms_common_target: false,
      confidence: techstackResult.confidence,
      checked_at: startTime.toISOString(),
      error: techstackResult.error_message,
    },
    exposure: {
      ip_addresses: [],
      ip_geolocation: exposureResult.raw_signals.ip_geolocation,
      reverse_dns: exposureResult.raw_signals.reverse_dns,
      infrastructure_type: exposureResult.raw_signals.infrastructure_type,
      cloud_provider: null,
      confidence: exposureResult.confidence,
      disclaimer: 'Public exposure data is inferred from DNS and HTTP headers',
      checked_at: startTime.toISOString(),
      error: exposureResult.error_message,
    },
    hibp: {
      breaches_found: hibpResult.raw_signals.total_breach_count || 0,
      breach_names: hibpResult.raw_signals.breaches?.map((b: { name: string }) => b.name) || [],
      most_recent_breach_date: hibpResult.raw_signals.most_recent_breach_date,
      total_accounts_breached: null,
      data_classes_compromised: [],
      confidence: hibpResult.confidence,
      checked_at: startTime.toISOString(),
      error: hibpResult.error_message,
    },
    cross_block_flags: crossBlockFlags,
  };
  
  return signals;
}

/**
 * Compute cross-block flags based on all collected signals
 */
function computeCrossBlockFlags(blocks: {
  dns: any;
  email: any;
  tls: any;
  techstack: any;
  exposure: any;
  hibp: any;
}): CrossBlockFlags {
  // High risk overall: Multiple concerning flags across blocks
  const high_risk_overall = 
    blocks.email.derived_flags.email_spoofing_possible ||
    blocks.tls.derived_flags.ssl_expiring_soon ||
    blocks.hibp.derived_flags.recent_breach ||
    (blocks.techstack.derived_flags.cms_common_target && !blocks.tls.raw_signals.https_enforced);
  
  // Insurance relevant: Things insurers commonly check
  const insurance_relevant =
    blocks.email.derived_flags.email_spoofing_possible ||
    blocks.dns.derived_flags.domain_age_low ||
    blocks.hibp.derived_flags.multiple_breaches ||
    !blocks.tls.raw_signals.certificate_valid;
  
  // Quick wins available: Easy improvements with high impact
  const quick_wins_available =
    blocks.email.derived_flags.email_protection_partial ||
    blocks.tls.derived_flags.no_https_redirect ||
    (blocks.email.raw_signals.spf_strictness === 'permissive');
  
  // Professional setup: Well-configured across the board
  const professional_setup =
    blocks.email.derived_flags.email_protection_strong &&
    blocks.tls.raw_signals.https_enforced &&
    blocks.tls.raw_signals.certificate_valid &&
    blocks.dns.derived_flags.dns_provider_third_party &&
    !blocks.dns.derived_flags.domain_age_low;
  
  return {
    high_risk_overall,
    insurance_relevant,
    quick_wins_available,
    professional_setup,
  };
}

/**
 * Create a failed result for a block (fallback)
 */
function createFailedResult(blockName: string): any {
  return {
    block_name: blockName,
    success: false,
    confidence: 'low',
    raw_signals: {},
    derived_flags: {},
    error_message: 'Module failed to collect signals',
    collected_at: new Date().toISOString(),
  };
}
