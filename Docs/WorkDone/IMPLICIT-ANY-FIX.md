# Implicit Any Type Fix - Orchestrator HIBP Mapping

**Date**: January 29, 2026  
**Issue**: Arrow function parameter has implicit `any` type

---

## Error

```
Type error: Parameter 'b' implicitly has an 'any' type.
```

**Location**: `lib/signals/orchestrator.ts:155`

---

## Root Cause

TypeScript strict mode requires all function parameters to have explicit types. The arrow function in the HIBP breach mapping didn't specify a type for its parameter:

```typescript
breach_names: hibpResult.raw_signals.breaches?.map(b => b.name) || [],
//                                                  ^ implicit any
```

Without an explicit type annotation, TypeScript defaults to `any`, which violates strict type checking rules.

---

## Solution

Added explicit type annotation for the arrow function parameter:

**File**: `lib/signals/orchestrator.ts`

### Before (Line 155)

```typescript
breach_names: hibpResult.raw_signals.breaches?.map(b => b.Name) || [],
```

### After (Line 155)

```typescript
breach_names: hibpResult.raw_signals.breaches?.map((b: { name: string }) => b.name) || [],
```

---

## Additional Fix

Also corrected the property name from `b.Name` (capital N) to `b.name` (lowercase n) to match the `HibpRawSignals` interface:

```typescript
export interface HibpRawSignals {
  breaches: Array<{
    name: string;  // ← lowercase 'name'
    title: string;
    breach_date: string;
    added_date: string;
    data_classes: string[];
  }>;
  total_breach_count: number;
  most_recent_breach_date: string | null;
}
```

---

## Why This Works

1. **Explicit Type**: The inline type annotation `(b: { name: string })` tells TypeScript exactly what shape `b` has
2. **Minimal Type**: We only specify the `name` property since that's all we use
3. **Type Safety**: TypeScript can now verify the property access is valid
4. **Strict Mode Compliance**: Satisfies strict type checking requirements

---

## Impact

**Files Modified**: 1
- `lib/signals/orchestrator.ts` (parameter type annotation added, property name corrected)

**Individual Fixes**: 2
1. Added type annotation for arrow function parameter
2. Corrected property name from `Name` to `name`

---

**Status**: All function parameters now have explicit types. Build should succeed.
