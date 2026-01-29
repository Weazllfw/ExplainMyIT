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
  const crossBlockFlags = computeCrossBlockFlags({
    dns: dnsResult,
    email: emailResult,
    tls: tlsResult,
    techstack: techstackResult,
    exposure: exposureResult,
    hibp: hibpResult,
  });
  
  // Convert to SnapshotSignals format for database
  const signals: SnapshotSignals = {
    domain,
    collected_at: startTime.toISOString(),
    collection_duration_ms: durationMs,
    dns: {
      success: dnsResult.success,
      confidence: dnsResult.confidence,
      domain_age_years: dnsResult.raw_signals.domain_age_years,
      registrar: dnsResult.raw_signals.registrar,
      nameservers: dnsResult.raw_signals.nameservers,
      a_records: dnsResult.raw_signals.a_records,
      aaaa_records: dnsResult.raw_signals.aaaa_records,
      mx_records: dnsResult.raw_signals.mx_records,
      dns_hosting_provider: dnsResult.raw_signals.dns_hosting_provider,
      flags: dnsResult.derived_flags,
      error_message: dnsResult.error_message,
    },
    email: {
      success: emailResult.success,
      confidence: emailResult.confidence,
      mx_provider: emailResult.raw_signals.mx_provider,
      spf_record: emailResult.raw_signals.spf_record,
      spf_strictness: emailResult.raw_signals.spf_strictness,
      dkim_present: emailResult.raw_signals.dkim_present,
      dmarc_policy: emailResult.raw_signals.dmarc_policy,
      flags: emailResult.derived_flags,
      error_message: emailResult.error_message,
    },
    tls: {
      success: tlsResult.success,
      confidence: tlsResult.confidence,
      https_enforced: tlsResult.raw_signals.https_enforced,
      certificate_issuer: tlsResult.raw_signals.certificate_issuer,
      certificate_expiry_days: tlsResult.raw_signals.certificate_expiry_days,
      tls_versions_supported: tlsResult.raw_signals.tls_versions_supported,
      certificate_valid: tlsResult.raw_signals.certificate_valid,
      flags: tlsResult.derived_flags,
      error_message: tlsResult.error_message,
    },
    techstack: {
      success: techstackResult.success,
      confidence: techstackResult.confidence,
      cms_detected: techstackResult.raw_signals.cms_detected,
      cdn_provider: techstackResult.raw_signals.cdn_provider,
      hosting_provider: techstackResult.raw_signals.hosting_provider,
      server_headers: techstackResult.raw_signals.server_headers,
      technologies: techstackResult.raw_signals.technologies,
      flags: techstackResult.derived_flags,
      error_message: techstackResult.error_message,
    },
    exposure: {
      success: exposureResult.success,
      confidence: exposureResult.confidence,
      reverse_dns: exposureResult.raw_signals.reverse_dns,
      ip_geolocation: exposureResult.raw_signals.ip_geolocation,
      infrastructure_type: exposureResult.raw_signals.infrastructure_type,
      hosting_region: exposureResult.raw_signals.hosting_region,
      flags: exposureResult.derived_flags,
      error_message: exposureResult.error_message,
    },
    hibp: {
      success: hibpResult.success,
      confidence: hibpResult.confidence,
      breaches: hibpResult.raw_signals.breaches,
      total_breach_count: hibpResult.raw_signals.total_breach_count,
      most_recent_breach_date: hibpResult.raw_signals.most_recent_breach_date,
      flags: hibpResult.derived_flags,
      error_message: hibpResult.error_message,
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
