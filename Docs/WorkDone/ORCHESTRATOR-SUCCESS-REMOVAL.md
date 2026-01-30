# Orchestrator Success Property Removal

**Date**: January 29, 2026  
**Issue**: Database schema doesn't include `success` property in signal interfaces

---

## Error

```
Type error: Object literal may only specify known properties, and 'success' does not exist in type 'DnsSignals'.
```

**Location**: `lib/signals/orchestrator.ts:92`

---

## Root Cause

The orchestrator was mapping `success` from internal `BlockResult` types to database signal interfaces:

```typescript
dns: {
  success: dnsResult.success,  // ❌ Not in database schema
  confidence: dnsResult.confidence,
  // ...
}
```

However, the database schema for signal types (`DnsSignals`, `EmailSignals`, etc.) doesn't include a `success` property. The schema only includes:
- Signal data properties
- `confidence: 'high' | 'medium' | 'low'`
- `checked_at: string`
- `error?: string` (optional)

The `success` boolean is part of the internal `BlockResult<T>` type used during signal collection, but it's **not stored in the database**. The presence or absence of an `error` field is sufficient to determine if collection succeeded.

---

## Solution

Removed the `success` property from the DNS block mapping in the orchestrator:

**File**: `lib/signals/orchestrator.ts`

### Before (Line 91-103)

```typescript
dns: {
  success: dnsResult.success,  // ❌ Invalid property
  confidence: dnsResult.confidence,
  domain_age_days: dnsResult.raw_signals.domain_age_years ? dnsResult.raw_signals.domain_age_years * 365 : null,
  registrar: dnsResult.raw_signals.registrar,
  nameservers: dnsResult.raw_signals.nameservers,
  a_records: dnsResult.raw_signals.a_records,
  aaaa_records: dnsResult.raw_signals.aaaa_records,
  mx_records: dnsResult.raw_signals.mx_records,
  has_dnssec: false,
  checked_at: startTime.toISOString(),
  error: dnsResult.error_message,
},
```

### After (Line 91-102)

```typescript
dns: {
  confidence: dnsResult.confidence,  // ✅ Matches schema
  domain_age_days: dnsResult.raw_signals.domain_age_years ? dnsResult.raw_signals.domain_age_years * 365 : null,
  registrar: dnsResult.raw_signals.registrar,
  nameservers: dnsResult.raw_signals.nameservers,
  a_records: dnsResult.raw_signals.a_records,
  aaaa_records: dnsResult.raw_signals.aaaa_records,
  mx_records: dnsResult.raw_signals.mx_records,
  has_dnssec: false,
  checked_at: startTime.toISOString(),
  error: dnsResult.error_message,
},
```

---

## Verification

Checked all other signal block mappings in the orchestrator:
- ✅ **Email** (lines 104-115): No `success` property
- ✅ **TLS** (lines 116-128): No `success` property
- ✅ **TechStack** (lines 129-141): No `success` property
- ✅ **Exposure** (lines 142-152): No `success` property
- ✅ **HIBP** (lines 153-162): No `success` property

All signal mappings now correctly match the database schema.

---

## Note on `createFailedResult`

The `createFailedResult()` function (line 219) still uses `success: false` because it creates internal `BlockResult` objects for error handling during collection. These are not stored in the database - they're used internally by the orchestrator.

---

## Impact

**Files Modified**: 1
- `lib/signals/orchestrator.ts` (1 property removed)

**Individual Fixes**: 1

---

**Status**: Orchestrator signal mappings now match database schema exactly. Build should succeed.
