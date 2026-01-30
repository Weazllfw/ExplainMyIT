/**
 * Subdomain Enumeration Module (crt.sh - Certificate Transparency)
 * 
 * Collects subdomain data using Certificate Transparency logs via crt.sh.
 * 
 * Source: crt.sh (free, public CT logs)
 * Coverage: HTTPS-enabled subdomains with issued certificates
 * Cost: $0
 * 
 * TIER 1 FRAMING RULES:
 * ✅ State subdomains exist
 * ✅ Show examples
 * ✅ Note patterns (dev, test, staging)
 * ✅ Say it's common
 * ✅ Say external observation can't determine management status
 * 
 * ❌ DO NOT call them "abandoned"
 * ❌ DO NOT call them "exposed"
 * ❌ DO NOT assign risk
 * ❌ DO NOT count as findings
 * ❌ DO NOT label as "issues"
 */

import type {
  SubdomainBlockResult,
  SubdomainRawSignals,
  SubdomainDerivedFlags,
  Confidence
} from './types';

interface CrtShEntry {
  name_value: string;
  min_cert_id: number;
  min_entry_timestamp: string;
}

/**
 * Main subdomain enumeration function via crt.sh
 */
export async function collectSubdomainSignals(domain: string): Promise<SubdomainBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Fetch subdomains AND certificate data from crt.sh
    const { subdomains, certIssuanceData } = await fetchDataFromCrtSh(normalizedDomain);
    
    // Identify naming patterns (dev, test, staging) - NOT "abandoned"
    const patternsDetected = identifyNamingPatterns(subdomains);
    
    const rawSignals: SubdomainRawSignals = {
      subdomains: subdomains.map(s => ({
        subdomain: s,
        first_seen: null, // crt.sh doesn't provide reliable first_seen
        last_seen: null,  // crt.sh doesn't provide last_seen
      })),
      total_subdomain_count: subdomains.length,
      active_subdomain_count: null, // Cannot determine from external signals
      potentially_abandoned: [], // NEVER populate this - violates Tier 1 rules
      // Certificate issuance data (Tier 1 safe - observational only)
      certificate_issuance_count_12mo: certIssuanceData.count12mo,
      most_recent_certificate_date: certIssuanceData.mostRecent,
    };
    
    // Compute derived flags (framed for awareness, not risk)
    const derivedFlags = computeSubdomainFlags(rawSignals, patternsDetected);
    
    // Medium confidence (good cert data, but can't verify active status)
    const confidence: Confidence = 'medium';
    
    return {
      block_name: 'subdomains',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('Subdomain collection error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown subdomain error';
    
    return {
      block_name: 'subdomains',
      success: false,
      confidence: 'low',
      raw_signals: getEmptySubdomainSignals(),
      derived_flags: getEmptySubdomainFlags(),
      error_message: errorMessage,
      collected_at: startTime,
    };
  }
}

/**
 * Normalize domain name
 */
function normalizeDomain(input: string): string {
  let domain = input.toLowerCase().trim();
  domain = domain.replace(/^https?:\/\//, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.split('/')[0];
  domain = domain.split('?')[0];
  domain = domain.split('#')[0];
  domain = domain.split(':')[0];
  return domain;
}

/**
 * Certificate issuance data
 */
interface CertIssuanceData {
  count12mo: number;
  mostRecent: string | null;
}

/**
 * Fetch subdomains AND certificate issuance data from crt.sh
 * 
 * crt.sh API: https://crt.sh/?q=%.example.com&output=json
 * 
 * TIER 1 SAFE: We extract observational data only (certificate count, dates).
 * No risk framing, no "reissue = problem" language.
 */
async function fetchDataFromCrtSh(domain: string): Promise<{
  subdomains: string[];
  certIssuanceData: CertIssuanceData;
}> {
  const url = `https://crt.sh/?q=%.${encodeURIComponent(domain)}&output=json`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ExplainMyIT/1.0',
    },
    signal: AbortSignal.timeout(20000), // 20 second timeout (crt.sh can be slow)
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      // No certificates found
      return {
        subdomains: [],
        certIssuanceData: { count12mo: 0, mostRecent: null },
      };
    }
    
    throw new Error(`crt.sh API error: ${response.status} ${response.statusText}`);
  }
  
  const data: CrtShEntry[] = await response.json();
  
  // Extract unique subdomains from name_value
  const subdomainSet = new Set<string>();
  
  // Track certificate issuances
  const now = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(now.getMonth() - 12);
  
  let certCount12mo = 0;
  let mostRecentDate: Date | null = null;
  
  for (const entry of data) {
    // Extract subdomains
    const names = entry.name_value.split('\n');
    
    for (const name of names) {
      const cleanName = name.trim().toLowerCase();
      
      // Filter out wildcards and ensure it ends with our domain
      if (!cleanName.startsWith('*') && cleanName.endsWith(`.${domain}`)) {
        subdomainSet.add(cleanName);
      }
      
      // Also add apex domain if found
      if (cleanName === domain) {
        subdomainSet.add(cleanName);
      }
    }
    
    // Extract certificate issuance date
    try {
      const certDate = new Date(entry.min_entry_timestamp);
      
      // Count certificates issued in last 12 months
      if (certDate >= twelveMonthsAgo && certDate <= now) {
        certCount12mo++;
      }
      
      // Track most recent
      if (!mostRecentDate || certDate > mostRecentDate) {
        mostRecentDate = certDate;
      }
    } catch (e) {
      // Ignore date parsing errors
    }
  }
  
  return {
    subdomains: Array.from(subdomainSet).sort(),
    certIssuanceData: {
      count12mo: certCount12mo,
      mostRecent: mostRecentDate ? mostRecentDate.toISOString() : null,
    },
  };
}

/**
 * Identify naming patterns (dev, test, staging, etc.)
 * 
 * CRITICAL: This is NOT for labeling "abandoned" - it's for noting patterns.
 * Tier 1 framing: "We observed patterns like dev, test, staging - common in 
 * organizations that have evolved over time."
 */
function identifyNamingPatterns(subdomains: string[]): string[] {
  const patterns = [
    'dev',
    'test',
    'staging',
    'beta',
    'demo',
    'old',
    'backup',
    'temp',
  ];
  
  const detectedPatterns: Set<string> = new Set();
  
  for (const subdomain of subdomains) {
    for (const pattern of patterns) {
      if (
        subdomain.includes(`${pattern}.`) ||
        subdomain.includes(`-${pattern}.`) ||
        subdomain.includes(`${pattern}-`)
      ) {
        detectedPatterns.add(pattern);
      }
    }
  }
  
  return Array.from(detectedPatterns);
}

/**
 * Compute derived flags from raw signals
 * 
 * TIER 1 FRAMING: These flags are for awareness, NOT risk assessment.
 */
function computeSubdomainFlags(
  signals: SubdomainRawSignals,
  patternsDetected: string[]
): SubdomainDerivedFlags {
  // Multiple certificate-observed subdomains (awareness, not risk)
  const large_surface_area = signals.total_subdomain_count > 10;
  
  // NEVER set this flag - violates Tier 1 rules
  const abandoned_subdomains_likely = false;
  
  // Many certificate-observed subdomains (complexity awareness)
  const subdomain_sprawl = signals.total_subdomain_count > 50;
  
  return {
    large_surface_area,
    abandoned_subdomains_likely, // Always false for Tier 1
    subdomain_sprawl,
  };
}

/**
 * Empty signals fallback
 */
function getEmptySubdomainSignals(): SubdomainRawSignals {
  return {
    subdomains: [],
    total_subdomain_count: 0,
    active_subdomain_count: null,
    potentially_abandoned: [], // Always empty for Tier 1
    certificate_issuance_count_12mo: 0,
    most_recent_certificate_date: null,
  };
}

/**
 * Empty flags fallback
 */
function getEmptySubdomainFlags(): SubdomainDerivedFlags {
  return {
    large_surface_area: false,
    abandoned_subdomains_likely: false, // Always false
    subdomain_sprawl: false,
  };
}
