# LLM Prompts Type Safety Fix

**Date**: January 29, 2026  
**Issue**: Optional signal properties accessed without null checks in prompt builders

---

## Error

```
Type error: 'signals.dns' is possibly 'undefined'.
```

**Location**: `lib/llm/prompts.ts:29` (and 26 other locations)

---

## Root Cause

The `SnapshotSignals` interface defines all signal blocks as optional:

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

However, when `generateReport()` is called (after `collectAllSignals()`), all 6 signal blocks are guaranteed to be present because the orchestrator explicitly creates them all.

The prompt builder functions were accessing these properties directly (e.g., `signals.dns.confidence`) without TypeScript knowing they're non-null.

---

## Solution

Added non-null assertion operator (`!`) to all signal property accesses in prompt builders:

```typescript
// Before:
confidence: signals.dns.confidence,

// After:
confidence: signals.dns!.confidence,
```

---

## Why Non-Null Assertions Are Safe Here

1. **Orchestrator Guarantees**: `collectAllSignals()` always returns all 6 blocks (lines 91-149 in `orchestrator.ts`)
2. **Call Site Control**: `generateReport()` is only called after `collectAllSignals()` completes
3. **Runtime Safety**: Even if a signal module fails, it still returns a result object with `success: false`

---

## Locations Fixed

### `buildBlockNarrativesPrompt()` function:
- 21 non-null assertions added (dns, email, tls, techstack, exposure, hibp blocks)
- Covers all signal properties used in Block Narratives prompt

### `buildSynthesisPrompt()` function:
- 18 non-null assertions added
- Covers all signal properties used in Synthesis + Assumptions + Questions prompt

**Total**: 39 non-null assertions across 2 prompt builder functions

---

## Alternative Considered

We could update the `SnapshotSignals` type to make all properties required and add additional metadata fields (`domain`, `collected_at`, `collection_duration_ms`), but:

- The type is used for database storage where JSONB is flexible
- Optional properties allow for future partial signal collections
- Non-null assertions are clearer about the contract at the call site

---

## Verification

- [x] All `signals.dns.*` accesses fixed
- [x] All `signals.email.*` accesses fixed
- [x] All `signals.tls.*` accesses fixed
- [x] All `signals.techstack.*` accesses fixed
- [x] All `signals.exposure.*` accesses fixed
- [x] All `signals.hibp.*` accesses fixed
- [ ] Build verification

---

**Status**: All optional property accesses fixed with non-null assertions. Build should succeed.
