/**
 * Public Exposure & Infrastructure Module
 * 
 * Collects public exposure signals for Block E.
 * Performs reverse DNS lookups and basic infrastructure inference.
 * 
 * CRITICAL: This module is intentionally limited to avoid any appearance
 * of "security scanning". We ONLY do:
 * - Reverse DNS lookups (standard, passive)
 * - Basic IP-to-region inference (from hostname patterns)
 * No port scanning, no vulnerability checks, no aggressive probing.
 */

import dns from 'dns';
import { promisify } from 'util';
import type {
  ExposureBlockResult,
  ExposureRawSignals,
  ExposureDerivedFlags,
  Confidence
} from './types';

// Promisify DNS functions
const resolve4 = promisify(dns.resolve4);
const reverse = promisify(dns.reverse);

/**
 * Main public exposure signal collection function
 */
export async function collectExposureSignals(domain: string): Promise<ExposureBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Get primary IP address
    const ipAddresses = await resolve4(normalizedDomain).catch(() => []);
    
    if (ipAddresses.length === 0) {
      return {
        block_name: 'exposure',
        success: false,
        confidence: 'low',
        raw_signals: getEmptyExposureSignals(),
        derived_flags: getEmptyExposureFlags(),
        error_message: 'No IP addresses found for domain',
        collected_at: startTime,
      };
    }
    
    // Use first IP for analysis
    const primaryIp = ipAddresses[0];
    
    // Perform reverse DNS lookup
    const reverseDns = await getReverseDns(primaryIp);
    
    // Infer infrastructure and region from reverse DNS
    const infrastructureType = inferInfrastructureType(reverseDns);
    const hostingRegion = inferHostingRegion(reverseDns, primaryIp);
    const geolocation = inferGeolocation(primaryIp);
    
    const rawSignals: ExposureRawSignals = {
      reverse_dns: reverseDns,
      ip_geolocation: geolocation,
      infrastructure_type: infrastructureType,
      hosting_region: hostingRegion,
    };
    
    // Compute derived flags
    const derivedFlags = computeExposureFlags(rawSignals);
    
    // Determine confidence (always low - this is inference-based)
    const confidence: Confidence = 'low';
    
    return {
      block_name: 'exposure',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('Exposure collection error:', error);
    
    return {
      block_name: 'exposure',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyExposureSignals(),
      derived_flags: getEmptyExposureFlags(),
      error_message: error instanceof Error ? error.message : 'Unknown exposure error',
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
 * Get reverse DNS (PTR record) for IP with timeout
 */
async function getReverseDns(ip: string): Promise<string | null> {
  try {
    // Add 5 second timeout for reverse DNS lookup
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 5000);
    });
    
    const reverseLookupPromise = reverse(ip).then(hostnames => 
      hostnames.length > 0 ? hostnames[0] : null
    );
    
    const result = await Promise.race([reverseLookupPromise, timeoutPromise]);
    return result;
  } catch (error) {
    // Reverse DNS not configured (common)
    return null;
  }
}

/**
 * Infer infrastructure type from reverse DNS patterns
 */
function inferInfrastructureType(reverseDns: string | null): 'cloud' | 'datacenter' | 'unknown' {
  if (!reverseDns) {
    return 'unknown';
  }
  
  const dns = reverseDns.toLowerCase();
  
  // Cloud provider patterns
  const cloudPatterns = [
    'amazonaws.com',      // AWS
    'compute.amazonaws',  // AWS EC2
    'cloudfront.net',     // AWS CloudFront
    'googleusercontent.com', // Google Cloud
    'bc.googleusercontent', // Google Cloud
    'cloudapp.azure.com', // Azure
    'azurewebsites.net',  // Azure
    'digitalocean.com',   // DigitalOcean
    'droplet',            // DigitalOcean
    'linode.com',         // Linode
    'vultr.com',          // Vultr
    'heroku.com',         // Heroku
    'herokuapp.com',      // Heroku
  ];
  
  for (const pattern of cloudPatterns) {
    if (dns.includes(pattern)) {
      return 'cloud';
    }
  }
  
  // Datacenter patterns (traditional hosting)
  const datacenterPatterns = [
    'ovh.net',
    'ovh.com',
    'rackspace.com',
    'softlayer.com',
    'godaddy.com',
    'bluehost.com',
    'hostgator.com',
    'dreamhost.com',
    'siteground.com',
  ];
  
  for (const pattern of datacenterPatterns) {
    if (dns.includes(pattern)) {
      return 'datacenter';
    }
  }
  
  return 'unknown';
}

/**
 * Infer hosting region from reverse DNS and IP
 */
function inferHostingRegion(reverseDns: string | null, ip: string): string | null {
  if (!reverseDns) {
    return inferRegionFromIp(ip);
  }
  
  const dns = reverseDns.toLowerCase();
  
  // AWS regions
  if (dns.includes('us-east')) return 'US East';
  if (dns.includes('us-west')) return 'US West';
  if (dns.includes('eu-west')) return 'Europe West';
  if (dns.includes('eu-central')) return 'Europe Central';
  if (dns.includes('ap-southeast')) return 'Asia Pacific Southeast';
  if (dns.includes('ap-northeast')) return 'Asia Pacific Northeast';
  
  // Azure regions
  if (dns.includes('eastus')) return 'US East';
  if (dns.includes('westus')) return 'US West';
  if (dns.includes('westeurope')) return 'Europe West';
  if (dns.includes('northeurope')) return 'Europe North';
  
  // Country codes in reverse DNS
  if (dns.includes('.us.')) return 'United States';
  if (dns.includes('.uk.')) return 'United Kingdom';
  if (dns.includes('.de.')) return 'Germany';
  if (dns.includes('.fr.')) return 'France';
  if (dns.includes('.nl.')) return 'Netherlands';
  if (dns.includes('.sg.')) return 'Singapore';
  if (dns.includes('.au.')) return 'Australia';
  if (dns.includes('.jp.')) return 'Japan';
  
  // Fall back to IP-based inference
  return inferRegionFromIp(ip);
}

/**
 * Basic IP-based region inference (very rough)
 */
function inferRegionFromIp(ip: string): string | null {
  // This is intentionally basic - we're not using a GeoIP database
  // Just rough inference based on IP ranges
  
  const firstOctet = parseInt(ip.split('.')[0]);
  
  // IANA reserved ranges
  if (firstOctet === 10 || firstOctet === 172 || firstOctet === 192) {
    return 'Private Network';
  }
  
  // North America (very rough)
  if (firstOctet >= 4 && firstOctet <= 75) {
    return 'North America (inferred)';
  }
  
  // Europe (very rough)
  if (firstOctet >= 76 && firstOctet <= 95) {
    return 'Europe (inferred)';
  }
  
  // Asia Pacific (very rough)
  if (firstOctet >= 96 && firstOctet <= 125) {
    return 'Asia Pacific (inferred)';
  }
  
  return 'Unknown region';
}

/**
 * Infer geolocation description
 */
function inferGeolocation(ip: string): string | null {
  const firstOctet = parseInt(ip.split('.')[0]);
  
  // Private/local
  if (firstOctet === 10 || firstOctet === 172 || firstOctet === 192 || firstOctet === 127) {
    return 'Private/Local Network';
  }
  
  // Public internet
  return 'Public Internet';
}

/**
 * Compute derived flags from raw signals
 */
function computeExposureFlags(signals: ExposureRawSignals): ExposureDerivedFlags {
  // Cloud hosted
  const cloud_hosted = signals.infrastructure_type === 'cloud';
  
  // Infrastructure identifiable (we got some useful info)
  const infrastructure_identifiable = 
    signals.reverse_dns !== null ||
    signals.infrastructure_type !== 'unknown' ||
    signals.hosting_region !== null;
  
  return {
    cloud_hosted,
    infrastructure_identifiable,
  };
}

/**
 * Empty signals fallback
 */
function getEmptyExposureSignals(): ExposureRawSignals {
  return {
    reverse_dns: null,
    ip_geolocation: null,
    infrastructure_type: 'unknown',
    hosting_region: null,
  };
}

/**
 * Empty flags fallback
 */
function getEmptyExposureFlags(): ExposureDerivedFlags {
  return {
    cloud_hosted: false,
    infrastructure_identifiable: false,
  };
}
