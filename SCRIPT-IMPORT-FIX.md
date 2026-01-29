# Script Import Fix - setup-db.ts

**Date**: January 29, 2026  
**Issue**: Incorrect import of non-existent `supabaseAdmin` export

---

## Error

```
Type error: '"../lib/db/client"' has no exported member named 'supabaseAdmin'. Did you mean 'getSupabaseAdmin'?
```

**Location**: `scripts/setup-db.ts:16`

---

## Root Cause

The script was trying to import `supabaseAdmin` as a variable:

```typescript
import { supabase, supabaseAdmin, healthCheck, testConnection } from '../lib/db/client';
```

However, `lib/db/client.ts` exports `getSupabaseAdmin` as a **function**, not `supabaseAdmin` as a variable:

```typescript
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = initSupabaseAdmin();
  }
  
  if (!_supabaseAdmin) {
    throw new Error('Supabase service key not configured...');
  }
  
  return _supabaseAdmin;
}
```

This is consistent with the lazy initialization pattern used throughout the database client module.

---

## Solution

Updated the import and all usages to call the function:

**File**: `scripts/setup-db.ts`

### Fix 1: Import Statement (Line 16)

**Before**:
```typescript
import { supabase, supabaseAdmin, healthCheck, testConnection } from '../lib/db/client';
```

**After**:
```typescript
import { supabase, getSupabaseAdmin, healthCheck, testConnection } from '../lib/db/client';
```

### Fix 2: Usage 1 (Line 64-69)

**Before**:
```typescript
const { data: schemaVersion, error: versionError } = await supabaseAdmin!
  .from('schema_version')
  .select('*')
  .order('version', { ascending: false })
  .limit(1)
  .single();
```

**After**:
```typescript
const { data: schemaVersion, error: versionError } = await getSupabaseAdmin()
  .from('schema_version')
  .select('*')
  .order('version', { ascending: false })
  .limit(1)
  .single();
```

### Fix 3: Usage 2 (Line 81-84)

**Before**:
```typescript
for (const table of tables) {
  const { error } = await supabaseAdmin!
    .from(table as any)
    .select('count')
    .limit(1);
```

**After**:
```typescript
for (const table of tables) {
  const { error } = await getSupabaseAdmin()
    .from(table as any)
    .select('count')
    .limit(1);
```

---

## Why This Works

1. **Correct Import**: Uses the actual exported function name
2. **Function Call**: `getSupabaseAdmin()` returns the admin client instance
3. **Lazy Init**: The function handles initialization on first use
4. **Error Handling**: The function throws if service key not configured
5. **Type Safety**: TypeScript can now properly type-check the import

---

## Benefits

- ✅ Matches the actual export from `lib/db/client.ts`
- ✅ Consistent with usage pattern in other files (e.g., `lib/db/cache.ts`)
- ✅ Maintains lazy initialization for better performance
- ✅ Proper error handling for missing service key

---

## Impact

**Files Modified**: 1
- `scripts/setup-db.ts` (import + 2 usages)

**Individual Fixes**: 3
1. Import statement corrected
2. Usage 1 updated (schema version check)
3. Usage 2 updated (table verification loop)

---

**Status**: Script imports now match database client exports. Build should succeed.
