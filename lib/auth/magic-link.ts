/**
 * Magic Link Authentication
 * 
 * JWT-based temporary access tokens for Tier 1 snapshots.
 * No full account creation required - just email verification.
 */

import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = 'explainmyit.com';
const JWT_AUDIENCE = 'snapshot-access';

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Token payload for snapshot access
 */
export interface SnapshotAccessToken {
  snapshot_id: string;
  email: string;
  domain: string;
  iat: number;  // Issued at
  exp: number;  // Expiry
}

/**
 * Generate magic link token for snapshot access
 * 
 * @param snapshotId - Snapshot ID
 * @param email - User's email
 * @param domain - Domain that was scanned
 * @param expiryHours - Token expiry in hours (default: 720 = 30 days)
 * @returns JWT token string
 */
export async function generateMagicLinkToken(
  snapshotId: string,
  email: string,
  domain: string,
  expiryHours: number = 720 // 30 days for Tier 1
): Promise<string> {
  const token = await new SignJWT({
    snapshot_id: snapshotId,
    email: email.toLowerCase(),
    domain,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(`${expiryHours}h`)
    .sign(secret);

  return token;
}

/**
 * Verify and decode magic link token
 * 
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export async function verifyMagicLinkToken(
  token: string
): Promise<{ valid: boolean; payload?: SnapshotAccessToken; error?: string }> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return {
      valid: true,
      payload: payload as unknown as SnapshotAccessToken,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Token expired
      if (error.message.includes('exp')) {
        return {
          valid: false,
          error: 'Token expired',
        };
      }

      // Invalid signature or format
      return {
        valid: false,
        error: 'Invalid token',
      };
    }

    return {
      valid: false,
      error: 'Unknown error',
    };
  }
}

/**
 * Generate complete magic link URL
 * 
 * @param snapshotId - Snapshot ID
 * @param email - User's email
 * @param domain - Domain that was scanned
 * @param baseUrl - Base URL for the site (e.g., 'https://explainmyit.com')
 * @returns Complete magic link URL
 */
export async function generateMagicLink(
  snapshotId: string,
  email: string,
  domain: string,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): Promise<string> {
  const token = await generateMagicLinkToken(snapshotId, email, domain);
  return `${baseUrl}/report/${snapshotId}?token=${token}`;
}

/**
 * Extract token from URL query params or headers
 * 
 * @param request - Next.js Request object
 * @returns Token string or null
 */
export function extractToken(request: Request): string | null {
  // Try URL query param first
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  if (queryToken) {
    return queryToken;
  }

  // Try Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Validate snapshot access
 * 
 * Checks if the provided token grants access to the requested snapshot
 */
export async function validateSnapshotAccess(
  token: string,
  snapshotId: string
): Promise<{ authorized: boolean; email?: string; error?: string }> {
  const verification = await verifyMagicLinkToken(token);

  if (!verification.valid || !verification.payload) {
    return {
      authorized: false,
      error: verification.error || 'Invalid token',
    };
  }

  // Check if token is for the requested snapshot
  if (verification.payload.snapshot_id !== snapshotId) {
    return {
      authorized: false,
      error: 'Token does not grant access to this snapshot',
    };
  }

  return {
    authorized: true,
    email: verification.payload.email,
  };
}
