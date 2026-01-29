/**
 * Email Authentication Signal Collection Module
 * 
 * Collects email authentication posture signals for Block B.
 * Checks SPF, DKIM, DMARC records and identifies email provider.
 */

import dns from 'dns';
import { promisify } from 'util';
import type {
  EmailBlockResult,
  EmailRawSignals,
  EmailDerivedFlags,
  Confidence
} from './types';

// Promisify DNS functions
const resolveTxt = promisify(dns.resolveTxt);
const resolveMx = promisify(dns.resolveMx);

/**
 * Main email auth signal collection function
 */
export async function collectEmailSignals(domain: string): Promise<EmailBlockResult> {
  const startTime = new Date().toISOString();
  
  try {
    // Normalize domain
    const normalizedDomain = normalizeDomain(domain);
    
    // Collect raw signals in parallel
    const [
      mxProvider,
      spfRecord,
      dkimPresent,
      dmarcPolicy,
    ] = await Promise.all([
      getMxProvider(normalizedDomain),
      getSpfRecord(normalizedDomain),
      checkDkimPresence(normalizedDomain),
      getDmarcPolicy(normalizedDomain),
    ]);
    
    // Assess SPF strictness
    const spfStrictness = assessSpfStrictness(spfRecord);
    
    const rawSignals: EmailRawSignals = {
      mx_provider: mxProvider,
      spf_record: spfRecord,
      spf_strictness: spfStrictness,
      dkim_present: dkimPresent,
      dmarc_policy: dmarcPolicy,
    };
    
    // Compute derived flags
    const derivedFlags = computeEmailFlags(rawSignals);
    
    // Email auth records are deterministic - always high confidence
    const confidence: Confidence = 'high';
    
    return {
      block_name: 'email',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: startTime,
    };
    
  } catch (error) {
    console.error('Email auth collection error:', error);
    
    return {
      block_name: 'email',
      success: false,
      confidence: 'low',
      raw_signals: getEmptyEmailSignals(),
      derived_flags: getEmptyEmailFlags(),
      error_message: error instanceof Error ? error.message : 'Unknown email auth error',
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
 * Identify email provider from MX records
 */
async function getMxProvider(domain: string): Promise<string | null> {
  try {
    const mxRecords = await resolveMx(domain);
    
    if (mxRecords.length === 0) {
      return null;
    }
    
    // Sort by priority and check first MX
    const sortedMx = mxRecords.sort((a, b) => a.priority - b.priority);
    const primaryMx = sortedMx[0].exchange.toLowerCase();
    
    // Identify common providers
    if (primaryMx.includes('google.com') || primaryMx.includes('googlemail.com')) {
      return 'Google Workspace';
    }
    if (primaryMx.includes('outlook.com') || primaryMx.includes('microsoft.com')) {
      return 'Microsoft 365';
    }
    if (primaryMx.includes('mail.protection.outlook.com')) {
      return 'Microsoft 365';
    }
    if (primaryMx.includes('zoho.com')) {
      return 'Zoho Mail';
    }
    if (primaryMx.includes('mailgun.org')) {
      return 'Mailgun';
    }
    if (primaryMx.includes('sendgrid.net')) {
      return 'SendGrid';
    }
    if (primaryMx.includes('amazonses.com')) {
      return 'Amazon SES';
    }
    if (primaryMx.includes('protonmail.ch')) {
      return 'ProtonMail';
    }
    if (primaryMx.includes('mimecast.com')) {
      return 'Mimecast';
    }
    
    // Extract domain from MX for generic identification
    const mxParts = primaryMx.split('.');
    if (mxParts.length >= 2) {
      const provider = mxParts[mxParts.length - 2];
      return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
    
    return 'Unknown';
  } catch (error) {
    console.warn(`MX lookup failed for ${domain}:`, error);
    return null;
  }
}

/**
 * Get SPF record
 */
async function getSpfRecord(domain: string): Promise<string | null> {
  try {
    const txtRecords = await resolveTxt(domain);
    
    // Find SPF record (starts with v=spf1)
    for (const record of txtRecords) {
      const recordString = Array.isArray(record) ? record.join('') : record;
      if (recordString.trim().startsWith('v=spf1')) {
        return recordString.trim();
      }
    }
    
    return null;
  } catch (error) {
    console.warn(`SPF lookup failed for ${domain}:`, error);
    return null;
  }
}

/**
 * Assess SPF strictness
 */
function assessSpfStrictness(spfRecord: string | null): 'strict' | 'permissive' | 'missing' {
  if (!spfRecord) {
    return 'missing';
  }
  
  // Strict: ends with -all (hard fail)
  if (spfRecord.includes('-all')) {
    return 'strict';
  }
  
  // Permissive: ends with ~all (soft fail) or ?all (neutral)
  if (spfRecord.includes('~all') || spfRecord.includes('?all')) {
    return 'permissive';
  }
  
  // Default to permissive if +all or no qualifier
  return 'permissive';
}

/**
 * Check for DKIM presence
 * Note: DKIM uses selectors which vary by provider, so we check common patterns
 */
async function checkDkimPresence(domain: string): Promise<boolean> {
  // Common DKIM selectors to check
  const commonSelectors = [
    'default',
    'google',
    'k1',
    's1',
    's2',
    'selector1',
    'selector2',
    'dkim',
    'mail',
  ];
  
  for (const selector of commonSelectors) {
    const dkimDomain = `${selector}._domainkey.${domain}`;
    
    try {
      const txtRecords = await resolveTxt(dkimDomain);
      
      // Check if any record contains DKIM signature
      for (const record of txtRecords) {
        const recordString = Array.isArray(record) ? record.join('') : record;
        if (recordString.includes('v=DKIM1') || recordString.includes('k=rsa')) {
          return true;
        }
      }
    } catch (error) {
      // Record not found - continue to next selector
      continue;
    }
  }
  
  // No DKIM records found with common selectors
  // Note: DKIM may still be configured with custom selectors
  return false;
}

/**
 * Get DMARC policy
 */
async function getDmarcPolicy(domain: string): Promise<'reject' | 'quarantine' | 'none' | 'missing'> {
  const dmarcDomain = `_dmarc.${domain}`;
  
  try {
    const txtRecords = await resolveTxt(dmarcDomain);
    
    // Find DMARC record (starts with v=DMARC1)
    for (const record of txtRecords) {
      const recordString = Array.isArray(record) ? record.join('') : record;
      
      if (recordString.trim().startsWith('v=DMARC1')) {
        // Extract policy
        const policyMatch = recordString.match(/p=(reject|quarantine|none)/i);
        if (policyMatch) {
          return policyMatch[1].toLowerCase() as 'reject' | 'quarantine' | 'none';
        }
        
        // DMARC record exists but no explicit policy
        return 'none';
      }
    }
    
    return 'missing';
  } catch (error) {
    console.warn(`DMARC lookup failed for ${domain}:`, error);
    return 'missing';
  }
}

/**
 * Compute derived flags from raw signals
 */
function computeEmailFlags(signals: EmailRawSignals): EmailDerivedFlags {
  // Email spoofing is possible if:
  // - No SPF or permissive SPF, AND
  // - No DMARC enforcement (reject/quarantine)
  const email_spoofing_possible = 
    (signals.spf_strictness === 'missing' || signals.spf_strictness === 'permissive') &&
    (signals.dmarc_policy === 'missing' || signals.dmarc_policy === 'none');
  
  // Partial protection: Has some email auth but not complete
  // - Has SPF but not strict, OR
  // - Has DMARC but only monitoring (none)
  const email_protection_partial = 
    !email_spoofing_possible &&
    (
      (signals.spf_strictness === 'permissive') ||
      (signals.dmarc_policy === 'none')
    );
  
  // Strong protection: All checks configured properly
  // - SPF strict (-all), AND
  // - DMARC enforce (reject or quarantine)
  const email_protection_strong = 
    signals.spf_strictness === 'strict' &&
    (signals.dmarc_policy === 'reject' || signals.dmarc_policy === 'quarantine');
  
  return {
    email_spoofing_possible,
    email_protection_partial,
    email_protection_strong,
  };
}

/**
 * Empty signals fallback
 */
function getEmptyEmailSignals(): EmailRawSignals {
  return {
    mx_provider: null,
    spf_record: null,
    spf_strictness: 'missing',
    dkim_present: false,
    dmarc_policy: 'missing',
  };
}

/**
 * Empty flags fallback
 */
function getEmptyEmailFlags(): EmailDerivedFlags {
  return {
    email_spoofing_possible: false,
    email_protection_partial: false,
    email_protection_strong: false,
  };
}
