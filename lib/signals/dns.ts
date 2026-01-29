/**
 * DNS Signal Collection Module
 * 
 * Collects domain and DNS posture signals for Block A.
 * Handles DNS queries, WHOIS lookups, and domain age calculation.
 */

import dns from 'dns';
import { promisify } from 'util';
import whois from 'whois-json';
import type { 
  DnsBlockResult, 
  DnsRawSignals, 
  DnsDerivedFlags,
  Confidence
} from './types';

// Promisify DNS functions
const resolveMx = promisify(dns.resolveMx);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveNs = promisify(dns.resolveNs);

/**
 * Main DNS signal collection function
 */
export async function collectDnsSignals(domain: string): Promise<DnsBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain (remove www., protocols, paths)
    const normalizedDomain = normalizeDomain(domain);
    
    // Collect raw signals in parallel
    const [
      domainAge,
      registrar,
      nameservers,
      aRecords,
      aaaaRecords,
      mxRecords,
    ] = await Promise.all([
      getDomainAge(normalizedDomain),
      getRegistrar(normalizedDomain),
      getNameservers(normalizedDomain),
      getARecords(normalizedDomain),
      getAAAARecords(normalizedDomain),
      getMxRecords(normalizedDomain),
    ]);
    
    // Infer DNS hosting provider from nameservers
    const dnsProvider = inferDnsProvider(nameservers);
    
    const rawSignals: DnsRawSignals = {
      domain_age_years: domainAge,
      registrar,
      nameservers,
      a_records: aRecords,
      aaaa_records: aaaaRecords,
      mx_records: mxRecords,
      dns_hosting_provider: dnsProvider,
    };
    
    // Compute derived flags
    const derivedFlags = computeDnsFlags(rawSignals);
    
    // Determine confidence
    const confidence = determineConfidence(rawSignals);
    
    return {
      block_name: 'dns',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('DNS collection error:', error);
    
    return {
      block_name: 'dns',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyDnsSignals(),
      derived_flags: getEmptyDnsFlags(),
      error_message: error instanceof Error ? error.message : 'Unknown DNS error',
      collected_at: startTime,
    };
  }
}

/**
 * Normalize domain name
 */
function normalizeDomain(input: string): string {
  let domain = input.toLowerCase().trim();
  
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove www.
  domain = domain.replace(/^www\./, '');
  
  // Remove paths, query strings, fragments
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];
  
  // Remove port if present
  domain = domain.split(':')[0];
  
  return domain;
}

/**
 * Get domain age from WHOIS
 */
async function getDomainAge(domain: string): Promise<number | null> {
  try {
    const whoisData = await whois(domain, { timeout: 10000 });
    
    if (whoisData.creationDate) {
      const createdDate = new Date(whoisData.creationDate);
      const now = new Date();
      const ageMs = now.getTime() - createdDate.getTime();
      const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
      
      return Math.max(0, Math.round(ageYears * 10) / 10); // Round to 1 decimal
    }
    
    return null;
  } catch (error) {
    console.warn(`WHOIS lookup failed for ${domain}:`, error);
    return null;
  }
}

/**
 * Get registrar from WHOIS
 */
async function getRegistrar(domain: string): Promise<string | null> {
  try {
    const whoisData = await whois(domain, { timeout: 10000 });
    
    if (whoisData.registrar) {
      return String(whoisData.registrar).trim();
    }
    
    return null;
  } catch (error) {
    console.warn(`Registrar lookup failed for ${domain}:`, error);
    return null;
  }
}

/**
 * Get nameservers
 */
async function getNameservers(domain: string): Promise<string[]> {
  try {
    const nameservers = await resolveNs(domain);
    return nameservers.map(ns => ns.toLowerCase()).sort();
  } catch (error) {
    console.warn(`NS lookup failed for ${domain}:`, error);
    return [];
  }
}

/**
 * Get A records (IPv4)
 */
async function getARecords(domain: string): Promise<string[]> {
  try {
    const addresses = await resolve4(domain);
    return addresses.sort();
  } catch (error) {
    console.warn(`A record lookup failed for ${domain}:`, error);
    return [];
  }
}

/**
 * Get AAAA records (IPv6)
 */
async function getAAAARecords(domain: string): Promise<string[]> {
  try {
    const addresses = await resolve6(domain);
    return addresses.sort();
  } catch (error) {
    // IPv6 not present is common, don't log warning
    return [];
  }
}

/**
 * Get MX records
 */
async function getMxRecords(domain: string): Promise<string[]> {
  try {
    const mxRecords = await resolveMx(domain);
    return mxRecords
      .sort((a, b) => a.priority - b.priority)
      .map(mx => `${mx.priority} ${mx.exchange}`);
  } catch (error) {
    console.warn(`MX lookup failed for ${domain}:`, error);
    return [];
  }
}

/**
 * Infer DNS hosting provider from nameservers
 */
function inferDnsProvider(nameservers: string[]): string | null {
  if (nameservers.length === 0) return null;
  
  const nsString = nameservers.join(' ').toLowerCase();
  
  // Common providers
  if (nsString.includes('cloudflare')) return 'Cloudflare';
  if (nsString.includes('ns-cloud')) return 'Google Cloud DNS';
  if (nsString.includes('awsdns')) return 'AWS Route 53';
  if (nsString.includes('azure')) return 'Azure DNS';
  if (nsString.includes('godaddy')) return 'GoDaddy';
  if (nsString.includes('namecheap')) return 'Namecheap';
  if (nsString.includes('hover')) return 'Hover';
  if (nsString.includes('dreamhost')) return 'DreamHost';
  if (nsString.includes('bluehost')) return 'Bluehost';
  if (nsString.includes('hostgator')) return 'HostGator';
  if (nsString.includes('hostinger')) return 'Hostinger';
  if (nsString.includes('register.com')) return 'Register.com';
  
  // Registrar DNS
  const firstNs = nameservers[0];
  const parts = firstNs.split('.');
  if (parts.length >= 2) {
    const provider = parts[parts.length - 2];
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
  
  return 'Unknown';
}

/**
 * Compute derived flags from raw signals
 */
function computeDnsFlags(signals: DnsRawSignals): DnsDerivedFlags {
  // Domain age < 1 year
  const domain_age_low = signals.domain_age_years !== null && signals.domain_age_years < 1;
  
  // Using third-party DNS (not registrar's default)
  const dns_provider_third_party = signals.dns_hosting_provider !== null && 
    signals.dns_hosting_provider !== signals.registrar &&
    !signals.dns_hosting_provider.includes('Unknown');
  
  // All nameservers from same provider (single point of dependency)
  const single_point_dns_dependency = signals.nameservers.length > 0 && 
    hasSingleProvider(signals.nameservers);
  
  return {
    domain_age_low,
    dns_provider_third_party,
    single_point_dns_dependency,
  };
}

/**
 * Check if all nameservers are from the same provider
 */
function hasSingleProvider(nameservers: string[]): boolean {
  if (nameservers.length === 0) return false;
  
  // Extract base domain from each nameserver
  const baseDomains = nameservers.map(ns => {
    const parts = ns.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return ns;
  });
  
  // All should have the same base domain
  const uniqueProviders = new Set(baseDomains);
  return uniqueProviders.size === 1;
}

/**
 * Determine confidence level based on data quality
 */
function determineConfidence(signals: DnsRawSignals): Confidence {
  let score = 0;
  let maxScore = 0;
  
  // Domain age (20 points)
  maxScore += 20;
  if (signals.domain_age_years !== null) score += 20;
  
  // Registrar (15 points)
  maxScore += 15;
  if (signals.registrar !== null) score += 15;
  
  // Nameservers (25 points)
  maxScore += 25;
  if (signals.nameservers.length > 0) score += 25;
  
  // A records (20 points)
  maxScore += 20;
  if (signals.a_records.length > 0) score += 20;
  
  // MX records (20 points)
  maxScore += 20;
  if (signals.mx_records.length > 0) score += 20;
  
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 80) return 'high';
  if (percentage >= 50) return 'medium';
  return 'low';
}

/**
 * Empty signals fallback
 */
function getEmptyDnsSignals(): DnsRawSignals {
  return {
    domain_age_years: null,
    registrar: null,
    nameservers: [],
    a_records: [],
    aaaa_records: [],
    mx_records: [],
    dns_hosting_provider: null,
  };
}

/**
 * Empty flags fallback
 */
function getEmptyDnsFlags(): DnsDerivedFlags {
  return {
    domain_age_low: false,
    dns_provider_third_party: false,
    single_point_dns_dependency: false,
  };
}
