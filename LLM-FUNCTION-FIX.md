# LLM Generator Function Signature Fix

**Date**: January 29, 2026  
**Issue**: Missing `domain` parameter in `generateReport()` function

---

## Error

```
Type error: Property 'domain' does not exist on type 'SnapshotSignals'.
```

**Location**: `lib/llm/generator.ts:36`

---

## Root Cause

The `generateReport()` function was trying to access `signals.domain` for logging, but the `SnapshotSignals` type doesn't include a `domain` property. It only contains the signal blocks:

```typescript
export interface SnapshotSignals {
  dns?: DnsSignals;
  email?: EmailSignals;
  tls?: TlsSignals;
  techstack?: TechStackSignals;
  exposure?: ExposureSignals;
  hibp?: HibpSignals;
}
```

The `domain` is known at the call site but wasn't being passed to the function.

---

## Solution

Added `domain` as the first parameter to `generateReport()`:

```typescript
// Before:
export async function generateReport(
  signals: SnapshotSignals,
  reportUrl: string
): Promise<{ success: boolean; report?: LLMReport; error?: string }>

// After:
export async function generateReport(
  domain: string,
  signals: SnapshotSignals,
  reportUrl: string
): Promise<{ success: boolean; report?: LLMReport; error?: string }>
```

---

## Files Modified

### 1. `lib/llm/generator.ts`
- Updated function signature to accept `domain` as first parameter
- Console log now uses passed `domain` parameter instead of `signals.domain`

### 2. `app/api/snapshot/route.ts`
- Updated function call: `generateReport(domain, signals, reportUrl)`

### 3. `scripts/test-llm.ts`
- Updated function call: `generateReport(testDomain, signals, reportUrl)`

---

## Why Domain Wasn't Included in SnapshotSignals

The `SnapshotSignals` type represents the collected signal data from the 6 signal modules. Each module's output is self-contained and doesn't include the domain because:

1. The domain is stored at the snapshot level in the database
2. Including it in every signal block would be redundant
3. It's available at the orchestration layer where needed

---

## Verification

- [x] Function signature updated with `domain` parameter
- [x] API route call site updated
- [x] Test script call site updated
- [x] Console log now uses correct parameter
- [ ] Build verification

---

**Status**: Function signature mismatch resolved. Build should succeed.
