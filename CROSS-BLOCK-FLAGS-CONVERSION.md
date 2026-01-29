# Cross-Block Flags Conversion Fix

**Date**: January 29, 2026  
**Issue**: Type mismatch between `CrossBlockFlags` object and database schema `string[]`

---

## Error

```
Type error: Type 'CrossBlockFlags' is missing the following properties from type 'string[]': length, pop, push, concat, and 35 more.
```

**Location**: `lib/signals/orchestrator.ts:163`

---

## Root Cause

The database schema defines `cross_block_flags` as an array of strings:

```typescript
export interface SnapshotSignals {
  // ...
  cross_block_flags?: string[];
}
```

However, the `computeCrossBlockFlags()` function returns a `CrossBlockFlags` object with boolean properties:

```typescript
export interface CrossBlockFlags {
  high_risk_overall: boolean;
  insurance_relevant: boolean;
  quick_wins_available: boolean;
  professional_setup: boolean;
}
```

The orchestrator was trying to assign the object directly to the array field, causing a type error.

---

## Solution

Convert the `CrossBlockFlags` object to a string array by extracting only the flag names where the value is `true`:

**File**: `lib/signals/orchestrator.ts`

### Before (Lines 76-84)

```typescript
// Compute cross-block flags
const crossBlockFlags = computeCrossBlockFlags({
  dns: dnsResult,
  email: emailResult,
  tls: tlsResult,
  techstack: techstackResult,
  exposure: exposureResult,
  hibp: hibpResult,
});

// ... later at line 163
cross_block_flags: crossBlockFlags,  // ❌ Type error
```

### After (Lines 76-88)

```typescript
// Compute cross-block flags
const crossBlockFlagsObj = computeCrossBlockFlags({
  dns: dnsResult,
  email: emailResult,
  tls: tlsResult,
  techstack: techstackResult,
  exposure: exposureResult,
  hibp: hibpResult,
});

// Convert CrossBlockFlags object to string array
const crossBlockFlags: string[] = Object.entries(crossBlockFlagsObj)
  .filter(([_, value]) => value === true)
  .map(([key, _]) => key);

// ... later at line 163
cross_block_flags: crossBlockFlags,  // ✅ Correct type: string[]
```

---

## Example Output

Given these flags:
```typescript
{
  high_risk_overall: true,
  insurance_relevant: false,
  quick_wins_available: true,
  professional_setup: false,
}
```

The conversion produces:
```typescript
["high_risk_overall", "quick_wins_available"]
```

---

## Why This Works

1. **`Object.entries()`**: Converts the object to `[key, value]` pairs
2. **`filter()`**: Keeps only entries where value is `true`
3. **`map()`**: Extracts just the keys (flag names)
4. **Type annotation**: `string[]` explicitly declares the result type
5. **Database format**: Matches the schema requirement for `string[]`

---

## Benefits

- ✅ Type-safe conversion from object to array
- ✅ Only includes active flags (true values)
- ✅ Maintains semantic meaning (flag names are preserved)
- ✅ Efficient storage (only stores active flags)
- ✅ Easy to query (can check if array includes a specific flag)

---

## Impact

**Files Modified**: 1
- `lib/signals/orchestrator.ts` (conversion logic added)

**Individual Fixes**: 1

---

**Status**: Cross-block flags properly converted to string array format. Build should succeed.
