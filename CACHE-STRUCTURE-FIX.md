# Cache Structure Fix - HIBP Module

**Date**: January 29, 2026  
**Issue**: Type mismatch between cache storage format and function return type

---

## Error

```
Type error: Argument of type 'HibpBlockResult' is not assignable to parameter of type 'HibpResults'.
  Type 'BlockResult<HibpRawSignals>' is missing the following properties from type 'HibpResults': breaches, fetched_at
```

**Location**: `lib/signals/hibp.ts:113`

---

## Root Cause

The HIBP module had a structural mismatch between:

1. **What gets cached** (`HibpResults`):
   ```typescript
   interface HibpResults {
     breaches: HibpBreach[];  // Full HIBP API breach objects
     fetched_at: string;
   }
   ```

2. **What the function returns** (`HibpBlockResult`):
   ```typescript
   type HibpBlockResult = BlockResult<HibpRawSignals>;
   // Contains: block_name, success, confidence, raw_signals, derived_flags, collected_at
   ```

The original code tried to:
- **Save**: Pass full `HibpBlockResult` to `saveHibpCache()` (expects `HibpResults`) ❌
- **Retrieve**: Cast cached `HibpResults` directly to `HibpBlockResult` ❌

---

## Solution

Properly handle the bidirectional conversion between cache format and block result format:

### 1. Saving to Cache (Line 112-116)

**Before**:
```typescript
await saveHibpCache(normalizedDomain, result);  // ❌ Type error
```

**After**:
```typescript
// Convert to HibpResults format for storage
const cacheData: HibpResults = {
  breaches: breaches,  // Store raw API breaches
  fetched_at: startTime,
};
await saveHibpCache(normalizedDomain, cacheData);  // ✅ Correct type
```

### 2. Retrieving from Cache (Line 64-70)

**Before**:
```typescript
if (cached.results) {
  console.log(`HIBP cache hit for ${normalizedDomain}`);
  return cached.results as unknown as HibpBlockResult;  // ❌ Invalid cast
}
```

**After**:
```typescript
if (cached.results) {
  console.log(`HIBP cache hit for ${normalizedDomain}`);
  
  // Reconstruct block result from cached data
  const cachedBreaches = cached.results.breaches;
  
  // Extract relevant breach data (same logic as API fetch)
  const breachData = cachedBreaches.map(b => ({
    name: b.Name,
    title: b.Title,
    breach_date: b.BreachDate,
    added_date: b.AddedDate,
    data_classes: b.DataClasses,
  }));
  
  // Find most recent breach
  const mostRecentBreachDate = cachedBreaches.length > 0
    ? cachedBreaches.reduce((latest, b) => {
        const date = new Date(b.BreachDate);
        return date > latest ? date : latest;
      }, new Date(cachedBreaches[0].BreachDate)).toISOString().split('T')[0]
    : null;
  
  const rawSignals: HibpRawSignals = {
    breaches: breachData,
    total_breach_count: cachedBreaches.length,
    most_recent_breach_date: mostRecentBreachDate,
  };
  
  const derivedFlags = computeHibpFlags(rawSignals);
  const confidence: Confidence = 'high';
  
  return {
    block_name: 'hibp',
    success: true,
    confidence,
    raw_signals: rawSignals,
    derived_flags: derivedFlags,
    collected_at: cached.results.fetched_at,
  };  // ✅ Properly constructed HibpBlockResult
}
```

### 3. Added Import (Line 11-18)

```typescript
import type { HibpResults } from '@/types/database';
```

---

## Why This Works

1. **Proper Type Conversion**: We now explicitly convert between the two formats instead of casting
2. **Cache Efficiency**: We cache the raw HIBP API response, which is the authoritative data
3. **Consistency**: The reconstruction logic from cache matches the logic used when fetching from API
4. **Type Safety**: No type casts needed - proper types at every step

---

## Benefits

- ✅ Type-safe cache storage and retrieval
- ✅ Cache stores minimal data (raw breaches + timestamp)
- ✅ Consistent signal processing whether from cache or API
- ✅ No runtime errors from invalid casts

---

## Impact

**Files Modified**: 1
- `lib/signals/hibp.ts` (3 sections updated: import, cache retrieval, cache save)

**Individual Fixes**: 3
1. Added `HibpResults` import
2. Reconstructed block result from cached data (cache hit path)
3. Converted block result to cache format before saving (cache miss path)

---

**Status**: Cache structure properly aligned with both storage and return types. Build should succeed.
