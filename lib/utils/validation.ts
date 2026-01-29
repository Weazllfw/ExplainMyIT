/**
 * Input Validation Utilities
 * 
 * Validation functions for API requests
 */

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate domain format
 * 
 * Accepts:
 * - example.com
 * - subdomain.example.com
 * - example.co.uk
 * 
 * Rejects:
 * - http://example.com (no protocol)
 * - example (no TLD)
 * - example.com/path (no paths)
 */
export function isValidDomain(domain: string): boolean {
  // Remove common prefixes users might add
  let cleaned = domain.toLowerCase().trim();
  cleaned = cleaned.replace(/^https?:\/\//, '');
  cleaned = cleaned.replace(/^www\./, '');
  cleaned = cleaned.split('/')[0]; // Remove paths
  cleaned = cleaned.split('?')[0]; // Remove query params
  cleaned = cleaned.split('#')[0]; // Remove fragments
  cleaned = cleaned.split(':')[0]; // Remove ports

  // Basic domain regex
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  
  // Check length (max 253 chars for full domain)
  if (cleaned.length > 253) {
    return false;
  }

  return domainRegex.test(cleaned);
}

/**
 * Normalize domain to consistent format
 * 
 * Input: "https://www.Example.COM/path?query=1"
 * Output: "example.com"
 */
export function normalizeDomain(input: string): string {
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
 * Validate UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize string for safe database/display use
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  return input.trim().substring(0, maxLength);
}

/**
 * Validate snapshot request payload
 */
export interface SnapshotRequestPayload {
  domain: string;
  email: string;
}

export function validateSnapshotRequest(
  payload: any
): { valid: boolean; errors: string[]; data?: SnapshotRequestPayload } {
  const errors: string[] = [];

  // Check required fields
  if (!payload.domain) {
    errors.push('Domain is required');
  }

  if (!payload.email) {
    errors.push('Email is required');
  }

  // Validate domain format
  if (payload.domain && !isValidDomain(payload.domain)) {
    errors.push('Invalid domain format');
  }

  // Validate email format
  if (payload.email && !isValidEmail(payload.email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      domain: normalizeDomain(payload.domain),
      email: payload.email.toLowerCase().trim(),
    },
  };
}
