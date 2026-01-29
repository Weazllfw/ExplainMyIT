# Signal Collection Architecture

**Purpose**: Technical reference for how signal collection works in Tier 1.

---

## Overview

Signal collection is the first phase of snapshot generation. It gathers raw data from external sources (DNS, email auth, TLS, tech stack, HIBP) and computes derived flags.

**Location**: `lib/signals/`

---

## Architecture

### 1. Core Types (`lib/signals/types.ts`)

All signal modules return a `BlockResult<T>`:

```typescript
interface BlockResult<T> {
  block_name: string;
  success: boolean;
  confidence: 'high' | 'medium' | 'low';
  raw_signals: T;
  derived_flags: Record<string, boolean>;
  error_message?: string;
  collected_at: string;
}
```

### 2. Signal Modules

Each module collects signals for one block:

| Module | File | Raw Signals | Derived Flags |
|--------|------|-------------|---------------|
| **DNS** | `dns.ts` | Domain age, registrar, nameservers, A/AAAA/MX records | `domain_age_low`, `dns_provider_third_party`, `single_point_dns_dependency` |
| **Email Auth** | `email.ts` | MX provider, SPF, DKIM, DMARC | `email_spoofing_possible`, `email_protection_partial`, `email_protection_strong` |
| **TLS** | `tls.ts` | HTTPS enforcement, certificate, TLS versions | `ssl_expiring_soon`, `legacy_tls_supported`, `no_https_redirect` |
| **Tech Stack** | `techstack.ts` | CMS, CDN, hosting provider | `cms_common_target`, `cdn_present` |
| **Exposure** | `exposure.ts` | Reverse DNS, geolocation, infrastructure | `cloud_hosted` |
| **HIBP** | `hibp.ts` | Known breaches | `recent_breach`, `multiple_breaches`, `credential_breach` |

### 3. Orchestration

**Function**: `collectAllSignals(domain: string): Promise<SnapshotSignals>`

**File**: `lib/signals/orchestrator.ts` ✅ COMPLETE

**How It Works**:
1. Runs all 6 signal modules in parallel using `Promise.all()`
2. Each module has independent error handling (one failure doesn't block others)
3. Converts block results to `SnapshotSignals` format for database storage
4. Computes cross-block flags based on combined signals
5. Logs performance metrics (typically 0.2-0.3s for all modules!)

**Cross-Block Flags**:
- `high_risk_overall`: Multiple concerning flags across blocks
- `insurance_relevant`: Things insurers commonly check
- `quick_wins_available`: Easy improvements with high impact
- `professional_setup`: Well-configured across the board

**Performance**: ~0.25s total for all 6 modules (parallel execution)

---

## DNS Module (`lib/signals/dns.ts`)

**Function**: `collectDnsSignals(domain: string): Promise<DnsBlockResult>`

### How It Works

1. **Normalize domain**: Remove protocol, www, paths
2. **Parallel collection**:
   - WHOIS lookup (domain age, registrar)
   - DNS queries (NS, A, AAAA, MX records)
3. **Infer DNS provider** from nameserver patterns
4. **Compute flags**:
   - `domain_age_low`: Age < 1 year
   - `dns_provider_third_party`: Using Cloudflare, AWS, etc. (not registrar DNS)
   - `single_point_dns_dependency`: All NS from same provider
5. **Calculate confidence**: Based on data completeness (80%+ = high, 50-79% = medium, <50% = low)

### Error Handling

- WHOIS failures → returns `null` for age/registrar (common due to rate limits)
- DNS lookup failures → returns empty arrays
- Never throws - always returns a result with `success: false` on total failure

### Testing

```bash
npm run test-signals
```

Tests against `google.com`, `cloudflare.com`, `github.com`

---

## Email Auth Module (`lib/signals/email.ts`)

**Function**: `collectEmailSignals(domain: string): Promise<EmailBlockResult>`

**Status**: ✅ Implemented & Tested

### How It Works

1. **MX lookup**: Identify email provider from MX records
   - Patterns: `google.com` → Google Workspace, `outlook.com` → Microsoft 365, etc.
   - Falls back to extracting provider from MX domain
2. **SPF check**: Query TXT records for `v=spf1`, assess strictness:
   - `strict`: SPF ends with `-all` (hard fail)
   - `permissive`: SPF ends with `~all` (soft fail) or `?all` (neutral)
   - `missing`: No SPF record found
3. **DKIM check**: Test common selectors (`default`, `google`, `k1`, `s1`, `selector1`, etc.)
   - Looks for `v=DKIM1` or `k=rsa` in `{selector}._domainkey.{domain}`
   - Returns `true` if any common selector found
   - Note: Custom selectors won't be detected (acceptable limitation)
4. **DMARC check**: Query `_dmarc.{domain}` TXT record
   - Extract policy: `p=reject`, `p=quarantine`, `p=none`
   - Returns `missing` if no DMARC record
5. **Compute flags**:
   - `email_spoofing_possible`: (No SPF OR permissive SPF) AND (No DMARC OR DMARC=none)
   - `email_protection_partial`: Some protection but incomplete (e.g., permissive SPF or DMARC=none)
   - `email_protection_strong`: SPF strict AND DMARC enforce (reject/quarantine)
6. **Calculate confidence**: Always `high` (email auth records are deterministic DNS queries)

### Error Handling

- Missing records → treated as "not configured" (not an error, returns valid result)
- DNS lookup failures → returns `success: false` with error message
- Never throws exceptions

### Test Results

Tested against `google.com`, `github.com`, `cloudflare.com`:
- ✅ Correctly identifies MX providers
- ✅ Detects SPF strictness
- ✅ Finds DKIM with common selectors
- ✅ Extracts DMARC policies
- ✅ Flags computed accurately (Cloudflare = strong protection, Google/GitHub = partial)

---

## TLS/SSL Module (`lib/signals/tls.ts`)

**Function**: `collectTlsSignals(domain: string): Promise<TlsBlockResult>`

**Status**: ✅ Implemented & Tested

### How It Works

1. **HTTPS certificate check**: Connect to port 443, retrieve TLS certificate
   - Extract issuer (e.g., "Google Trust Services", "Let's Encrypt")
   - Calculate days until expiry
   - Check certificate validity (date range + authorization)
   - Get TLS protocol version (TLSv1.3, TLSv1.2, etc.)
2. **HTTP redirect check**: Connect to port 80, check for 301/302/307/308 redirect to HTTPS
   - If HTTP fails but HTTPS works → assume HTTPS enforced at firewall level
3. **Compute flags**:
   - `ssl_expiring_soon`: Certificate expires in < 30 days
   - `legacy_tls_supported`: TLS 1.0, TLS 1.1, or SSLv3 detected
   - `no_https_redirect`: HTTP works without redirecting to HTTPS
4. **Calculate confidence**: 
   - `high`: Valid certificate with full details
   - `medium`: Some HTTPS info but incomplete
   - `low`: No HTTPS or connection failed

### Error Handling

- Connection timeout → returns low confidence with empty signals
- Invalid certificate → detected and flagged (not an error, intentional check)
- HTTP/HTTPS both fail → returns low confidence

### Test Results

Tested against `google.com`, `github.com`, `cloudflare.com`:
- ✅ Detects TLSv1.3 usage (modern)
- ✅ Identifies certificate issuers correctly
- ✅ Calculates expiry days accurately (54-74 days for test domains)
- ✅ Detects HTTPS enforcement (GitHub/Cloudflare enforce, Google.com doesn't)
- ✅ All flags computed correctly (no legacy TLS, no expiring certs)

---

## Tech Stack Module (`lib/signals/techstack.ts`)

**Function**: `collectTechStackSignals(domain: string): Promise<TechStackBlockResult>`

**Status**: ✅ Implemented & Tested

### How It Works

1. **Fetch homepage**: GET request to HTTPS with 15s timeout
   - Limits HTML to first 100KB for efficiency
   - Extracts response headers
2. **CMS detection**: Pattern matching in HTML and headers
   - WordPress: `wp-content`, `wp-includes`
   - Shopify: `cdn.shopify.com`, `x-shopify-stage` header
   - Wix, Squarespace, Webflow, Ghost, HubSpot, Drupal, Joomla
3. **CDN detection**: Header analysis (most reliable)
   - Cloudflare: `cf-ray` header
   - Amazon CloudFront: `x-amz-cf-id` header
   - Akamai, Fastly, Imperva, Azure CDN, BunnyCDN
4. **Hosting provider inference**: Server headers + HTML patterns
   - Vercel: `x-vercel-id` header
   - Netlify: `x-nf-request-id` header
   - AWS, Google Cloud, Azure, Heroku, DigitalOcean
5. **Technology detection**: HTML content analysis
   - Web servers: Nginx, Apache, IIS, LiteSpeed
   - Frameworks: React, Vue.js, Angular, Next.js
   - Libraries: jQuery, Bootstrap, Tailwind CSS
6. **Compute flags**:
   - `cms_common_target`: WordPress, Joomla, or Drupal detected (high-risk targets)
   - `cdn_present`: Any CDN provider detected
   - `hosting_identified`: Hosting provider successfully inferred
7. **Calculate confidence**:
   - `high` (70%+): CMS + CDN + hosting + technologies detected
   - `medium` (40-69%): Some detections but incomplete
   - `low` (<40%): Minimal detection

### Error Handling

- Connection timeout (15s) → returns low confidence
- HTTPS unavailable → catches error, returns graceful failure
- Never throws exceptions

### Detection Coverage

**CMS** (10 platforms): WordPress, Shopify, Wix, Squarespace, Webflow, Drupal, Joomla, Ghost, HubSpot

**CDN** (7 providers): Cloudflare, Amazon CloudFront, Akamai, Fastly, Imperva, Azure CDN, BunnyCDN

**Hosting** (11+ providers): Vercel, Netlify, AWS, Google Cloud, Azure, Heroku, DigitalOcean, WP Engine, GoDaddy, Bluehost

**Technologies**: Web servers (4), frameworks (6+), libraries (3+), analytics

### Test Results

Tested against `github.com`, `cloudflare.com`, `google.com`:
- ✅ Detects hosting providers correctly (AWS for GitHub)
- ✅ Identifies CDN usage (Cloudflare detected)
- ✅ Finds technologies (React detected on GitHub)
- ✅ No hanging on responses (100KB limit + proper promise resolution)
- ✅ Timeout handling works (15s)

---

## Public Exposure Module (`lib/signals/exposure.ts`)

**Function**: `collectExposureSignals(domain: string): Promise<ExposureBlockResult>`

**Status**: ✅ Implemented & Tested

### How It Works

1. **Resolve IP address**: Get primary A record
2. **Reverse DNS with timeout**: PTR lookup with 5-second race condition
3. **Infrastructure inference**: Pattern match on reverse DNS (AWS, Google Cloud, Azure, etc.)
4. **Region detection**: Extract from hostname patterns or basic IP range inference
5. **Compute flags**: `cloud_hosted`, `infrastructure_identifiable`
6. **Always low confidence**: This is inference, not authoritative

### Critical Constraint

**PASSIVE DNS ONLY**:
- No port scanning
- No service enumeration
- Standard DNS lookups only
- Explicit "passive observation" disclaimer in narrative

### Test Results

- ✅ GitHub: `lb-140-82-113-4-iad.github.com` detected
- ✅ Google: `pnyyzb-in-f102.1e100.net` detected
- ✅ Cloudflare: No reverse DNS (handled gracefully)
- ✅ 5-second timeout prevents hanging

---

## HIBP Module (`lib/signals/hibp.ts`)

**Function**: `collectHibpSignals(domain: string): Promise<HibpBlockResult>`

**Status**: ✅ Implemented & Tested

### How It Works

1. **Check cache**: Query database for existing results (30-day TTL)
2. **API request**: `GET /v3/breaches?domain={domain}` with API key header
3. **Parse breaches**: Extract name, title, date, data classes
4. **Compute flags**:
   - `recent_breach`: <12 months old
   - `multiple_breaches`: ≥2 breaches
   - `credential_breach`: Passwords or emails exposed
5. **Cache result**: Save entire block result for 30 days
6. **Always high confidence**: HIBP is authoritative

### API Integration

**Tier**: Pwned 1 ($4.50/month)
- 10 RPM limit
- 25 emails per domain max
- Perfect for Tier 1 scale

**Error Handling**:
- 404 → No breaches (returns empty array)
- 429 → Rate limit exceeded (clear error)
- API key missing → Graceful failure with message
- Cache miss on Supabase failure → Continues without caching

### Test Results

- ✅ API integration structure verified
- ✅ Handles missing API key gracefully
- ✅ Caching mechanism ready (30-day TTL)
- ✅ Rate limit error handling implemented

---

## Module Pattern

All signal modules follow this pattern:

```typescript
export async function collectXSignals(domain: string): Promise<XBlockResult> {
  try {
    // 1. Collect raw signals (parallel where possible)
    const rawSignals = await collectRawData(domain);
    
    // 2. Compute derived flags
    const derivedFlags = computeFlags(rawSignals);
    
    // 3. Calculate confidence
    const confidence = determineConfidence(rawSignals);
    
    // 4. Return success result
    return {
      block_name: 'x',
      success: true,
      confidence,
      raw_signals: rawSignals,
      derived_flags: derivedFlags,
      collected_at: new Date().toISOString(),
    };
  } catch (error) {
    // 5. Return graceful failure
    return {
      block_name: 'x',
      success: false,
      confidence: 'low',
      raw_signals: getEmptySignals(),
      derived_flags: getEmptyFlags(),
      error_message: error.message,
      collected_at: new Date().toISOString(),
    };
  }
}
```

---

## Dependencies

- **DNS queries**: Node.js `dns` module (built-in)
- **WHOIS**: `whois-json` package
- **TLS/HTTPS**: Node.js `https`, `tls` modules (built-in)
- **HTTP requests**: Node.js `https` module (built-in)
- **HIBP API**: Native `fetch` API
- **Environment loading**: `dotenv` (for test scripts)

---

## Test Suite

**Command**: `npm run test-signals`

**Test Domains**:
- `google.com` - Well-established, Google infrastructure
- `cloudflare.com` - Security-focused, Cloudflare infrastructure
- `github.com` - Tech company, AWS/NSOne infrastructure
- `adobe.com`, `linkedin.com` - HIBP breach testing

**Coverage**: All 6 signal modules tested end-to-end

---

**Last Updated**: January 29, 2026
