/**
 * TLS/SSL Signal Collection Module
 * 
 * Collects website and TLS/SSL posture signals for Block C.
 * Checks HTTPS enforcement, certificate validity, and TLS versions.
 */

import https from 'https';
import tls from 'tls';
import type {
  TlsBlockResult,
  TlsRawSignals,
  TlsDerivedFlags,
  Confidence
} from './types';

/**
 * Main TLS/SSL signal collection function
 */
export async function collectTlsSignals(domain: string): Promise<TlsBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Check HTTPS support and certificate
    const [httpsResult, httpRedirects] = await Promise.all([
      checkHttpsCertificate(normalizedDomain),
      checkHttpRedirect(normalizedDomain),
    ]);
    
    // Parse security headers
    const securityHeaders = parseSecurityHeaders(httpsResult.headers);
    
    const rawSignals: TlsRawSignals = {
      https_enforced: httpRedirects,
      certificate_issuer: httpsResult.issuer,
      certificate_expiry_days: httpsResult.expiryDays,
      tls_versions_supported: httpsResult.tlsVersions,
      certificate_valid: httpsResult.valid,
      // Enhanced certificate details
      certificate_organization: httpsResult.organization,
      certificate_san_count: httpsResult.sanCount,
      certificate_wildcard: httpsResult.wildcard,
      certificate_type: httpsResult.certType,
      // Security headers
      security_headers: securityHeaders,
    };
    
    // Compute derived flags
    const derivedFlags = computeTlsFlags(rawSignals);
    
    // Determine confidence based on data quality
    const confidence = determineConfidence(rawSignals);
    
    return {
      block_name: 'tls',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('TLS collection error:', error);
    
    return {
      block_name: 'tls',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyTlsSignals(),
      derived_flags: getEmptyTlsFlags(),
      error_message: error instanceof Error ? error.message : 'Unknown TLS error',
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
 * Check HTTPS certificate and TLS details
 */
async function checkHttpsCertificate(domain: string): Promise<{
  valid: boolean;
  issuer: string | null;
  expiryDays: number | null;
  tlsVersions: string[];
  organization: string | null;
  sanCount: number;
  wildcard: boolean;
  certType: 'DV' | 'OV' | 'EV' | 'unknown';
  headers: Record<string, string>;
}> {
  return new Promise((resolve) => {
    const options = {
      host: domain,
      port: 443,
      method: 'GET',  // Changed to GET to capture headers
      path: '/',
      timeout: 10000,
      rejectUnauthorized: false, // We want to detect invalid certs, not fail on them
    };
    
    const req = https.request(options, (res) => {
      const socket = res.socket as tls.TLSSocket;
      const cert = socket.getPeerCertificate();
      
      // Capture response headers
      const headers: Record<string, string> = {};
      Object.keys(res.headers).forEach(key => {
        const value = res.headers[key];
        headers[key] = Array.isArray(value) ? value.join(', ') : (value || '');
      });
      
      if (!cert || Object.keys(cert).length === 0) {
        resolve({
          valid: false,
          issuer: null,
          expiryDays: null,
          tlsVersions: [],
          organization: null,
          sanCount: 0,
          wildcard: false,
          certType: 'unknown',
          headers,
        });
        req.destroy();
        return;
      }
      
      // Extract certificate details
      const issuer = cert.issuer?.O || cert.issuer?.CN || 'Unknown';
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      const expiryDays = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if certificate is valid
      const valid = now >= new Date(cert.valid_from) && now <= validTo && !socket.authorizationError;
      
      // Get TLS version
      const tlsVersion = socket.getProtocol() || 'Unknown';
      
      // Enhanced certificate details
      const organization = cert.subject?.O || null;
      const subjectAltName = (cert as any).subjectaltname || '';
      const sanList = subjectAltName.split(', ').filter((s: string) => s.startsWith('DNS:'));
      const sanCount = sanList.length;
      const wildcard = sanList.some((s: string) => s.includes('*'));
      
      // Detect certificate type (EV, OV, DV)
      let certType: 'DV' | 'OV' | 'EV' | 'unknown' = 'unknown';
      if (organization) {
        // If org + jurisdiction, likely EV
        const hasJurisdiction = !!(cert.subject as any)?.jurisdictionCountryName || 
                               !!(cert.subject as any)?.jurisdictionStateOrProvinceName;
        certType = hasJurisdiction ? 'EV' : 'OV';
      } else {
        certType = 'DV';
      }
      
      resolve({
        valid,
        issuer,
        expiryDays,
        tlsVersions: [tlsVersion],
        organization,
        sanCount,
        wildcard,
        certType,
        headers,
      });
      
      req.destroy();
    });
    
    req.on('error', (error) => {
      // HTTPS not available or connection failed
      console.warn(`HTTPS check failed for ${domain}:`, error.message);
      resolve({
        valid: false,
        issuer: null,
        expiryDays: null,
        tlsVersions: [],
        organization: null,
        sanCount: 0,
        wildcard: false,
        certType: 'unknown',
        headers: {},
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        valid: false,
        issuer: null,
        expiryDays: null,
        tlsVersions: [],
        organization: null,
        sanCount: 0,
        wildcard: false,
        certType: 'unknown',
        headers: {},
      });
    });
    
    req.end();
  });
}

/**
 * Check if HTTP redirects to HTTPS
 */
async function checkHttpRedirect(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    const http = require('http');
    
    const options = {
      host: domain,
      port: 80,
      method: 'HEAD',
      path: '/',
      timeout: 10000,
    };
    
    const req = http.request(options, (res: any) => {
      // Check if redirect to HTTPS
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location || '';
        resolve(location.toLowerCase().startsWith('https://'));
      } else {
        // HTTP works without redirect - not enforced
        resolve(false);
      }
      req.destroy();
    });
    
    req.on('error', () => {
      // HTTP not accessible - could mean HTTPS is enforced at firewall level
      // We'll assume HTTPS is enforced if HTTP fails but HTTPS works
      resolve(true);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

/**
 * Parse security headers from HTTP response
 */
function parseSecurityHeaders(headers: Record<string, string>): {
  strict_transport_security: boolean;
  content_security_policy: boolean;
  x_frame_options: boolean;
  x_content_type_options: boolean;
  referrer_policy: boolean;
  permissions_policy: boolean;
} {
  // Normalize header keys to lowercase for comparison
  const normalizedHeaders: Record<string, string> = {};
  Object.keys(headers).forEach(key => {
    normalizedHeaders[key.toLowerCase()] = headers[key];
  });
  
  return {
    strict_transport_security: !!normalizedHeaders['strict-transport-security'],
    content_security_policy: !!normalizedHeaders['content-security-policy'],
    x_frame_options: !!normalizedHeaders['x-frame-options'],
    x_content_type_options: !!normalizedHeaders['x-content-type-options'],
    referrer_policy: !!normalizedHeaders['referrer-policy'],
    permissions_policy: !!normalizedHeaders['permissions-policy'] || !!normalizedHeaders['feature-policy'],
  };
}

/**
 * Compute derived flags from raw signals
 */
function computeTlsFlags(signals: TlsRawSignals): TlsDerivedFlags {
  // SSL expiring soon (< 30 days)
  const ssl_expiring_soon = signals.certificate_expiry_days !== null && 
                            signals.certificate_expiry_days < 30 &&
                            signals.certificate_expiry_days > 0;
  
  // Legacy TLS supported (TLS 1.0 or 1.1)
  const legacy_tls_supported = signals.tls_versions_supported.some(version => 
    version.includes('TLSv1.0') || version.includes('TLSv1.1') || version.includes('SSLv')
  );
  
  // No HTTPS redirect
  const no_https_redirect = !signals.https_enforced;
  
  // Enhanced certificate flags
  const certificate_shared = signals.certificate_wildcard || signals.certificate_san_count > 1;
  const certificate_premium = signals.certificate_type === 'EV';
  
  // Security headers assessment
  const headers = signals.security_headers;
  const headerCount = Object.values(headers).filter(v => v === true).length;
  const security_headers_strong = headerCount >= 5; // All or nearly all
  const security_headers_partial = headerCount >= 3 && headerCount < 5;
  const security_headers_missing = headerCount < 3;
  
  return {
    ssl_expiring_soon,
    legacy_tls_supported,
    no_https_redirect,
    certificate_shared,
    certificate_premium,
    security_headers_strong,
    security_headers_partial,
    security_headers_missing,
  };
}

/**
 * Determine confidence level based on data quality
 */
function determineConfidence(signals: TlsRawSignals): Confidence {
  // If we got certificate details, we have high confidence
  if (signals.certificate_valid && signals.certificate_issuer && signals.certificate_expiry_days !== null) {
    return 'high';
  }
  
  // If we got some HTTPS info but not complete
  if (signals.certificate_issuer || signals.tls_versions_supported.length > 0) {
    return 'medium';
  }
  
  // No HTTPS or couldn't connect
  return 'low';
}

/**
 * Empty signals fallback
 */
function getEmptyTlsSignals(): TlsRawSignals {
  return {
    https_enforced: false,
    certificate_issuer: null,
    certificate_expiry_days: null,
    tls_versions_supported: [],
    certificate_valid: false,
    certificate_organization: null,
    certificate_san_count: 0,
    certificate_wildcard: false,
    certificate_type: 'unknown',
    security_headers: {
      strict_transport_security: false,
      content_security_policy: false,
      x_frame_options: false,
      x_content_type_options: false,
      referrer_policy: false,
      permissions_policy: false,
    },
  };
}

/**
 * Empty flags fallback
 */
function getEmptyTlsFlags(): TlsDerivedFlags {
  return {
    ssl_expiring_soon: false,
    legacy_tls_supported: false,
    no_https_redirect: false,
    certificate_shared: false,
    certificate_premium: false,
    security_headers_strong: false,
    security_headers_partial: false,
    security_headers_missing: true,
  };
}
