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
    
    const rawSignals: TlsRawSignals = {
      https_enforced: httpRedirects,
      certificate_issuer: httpsResult.issuer,
      certificate_expiry_days: httpsResult.expiryDays,
      tls_versions_supported: httpsResult.tlsVersions,
      certificate_valid: httpsResult.valid,
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
}> {
  return new Promise((resolve) => {
    const options = {
      host: domain,
      port: 443,
      method: 'HEAD',
      path: '/',
      timeout: 10000,
      rejectUnauthorized: false, // We want to detect invalid certs, not fail on them
    };
    
    const req = https.request(options, (res) => {
      const socket = res.socket as tls.TLSSocket;
      const cert = socket.getPeerCertificate();
      
      if (!cert || Object.keys(cert).length === 0) {
        resolve({
          valid: false,
          issuer: null,
          expiryDays: null,
          tlsVersions: [],
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
      
      resolve({
        valid,
        issuer,
        expiryDays,
        tlsVersions: [tlsVersion],
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
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        valid: false,
        issuer: null,
        expiryDays: null,
        tlsVersions: [],
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
  
  return {
    ssl_expiring_soon,
    legacy_tls_supported,
    no_https_redirect,
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
  };
}
