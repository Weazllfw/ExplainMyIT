# Optional Properties Fix - Test Scripts

**Date**: January 29, 2026  
**Issue**: Test scripts accessing optional properties without safe guards

---

## Error

```
Type error: 'signals.collection_duration_ms' is possibly 'undefined'.
```

**Location**: `scripts/test-signals.ts:343`

---

## Root Cause

The `SnapshotSignals` interface defines several top-level properties as optional:

```typescript
export interface SnapshotSignals {
  domain?: string;
  collected_at?: string;
  collection_duration_ms?: number;
  dns?: DnsSignals;
  // ...
}
```

Test scripts were accessing these properties without checking for `undefined`:

```typescript
console.log(`  Duration: ${(signals.collection_duration_ms / 1000).toFixed(2)}s`);
//                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ can be undefined
```

---

## Solution

Added safe guards for all optional property accesses:

### Fix 1: `scripts/test-signals.ts` (Lines 341-344)

**Before**:
```typescript
console.log('\n📊 Collection Summary:');
console.log(`  Domain: ${signals.domain}`);
console.log(`  Duration: ${(signals.collection_duration_ms / 1000).toFixed(2)}s`);
console.log(`  Collected: ${signals.collected_at}`);
```

**After**:
```typescript
console.log('\n📊 Collection Summary:');
console.log(`  Domain: ${signals.domain || 'N/A'}`);
console.log(`  Duration: ${signals.collection_duration_ms ? (signals.collection_duration_ms / 1000).toFixed(2) : 'N/A'}s`);
console.log(`  Collected: ${signals.collected_at || 'N/A'}`);
```

### Fix 2: `scripts/test-llm.ts` (Line 26)

**Before**:
```typescript
console.log(`✅ Signal collection complete (${signals.collection_duration_ms}ms)`);
```

**After**:
```typescript
console.log(`✅ Signal collection complete (${signals.collection_duration_ms || 0}ms)`);
```

---

## Changes Applied

1. **`domain`**: Added fallback `|| 'N/A'`
2. **`collection_duration_ms`**: 
   - test-signals.ts: Conditional check before division + 'N/A' fallback
   - test-llm.ts: Fallback to `0`
3. **`collected_at`**: Added fallback `|| 'N/A'`

---

## Why These Properties Are Optional

These properties are defined as optional in the database schema because:
- They're computed/added by the orchestrator
- Individual signal modules don't know about them
- The schema is designed to be flexible for future extensions

In normal operation, these properties will always be present when coming from the orchestrator, but TypeScript strict mode requires handling the undefined case.

---

## Impact

**Files Modified**: 2
- `scripts/test-signals.ts` (3 property accesses)
- `scripts/test-llm.ts` (1 property access)

**Individual Fixes**: 4

---

**Status**: All optional property accesses now have safe guards. Build should succeed.
