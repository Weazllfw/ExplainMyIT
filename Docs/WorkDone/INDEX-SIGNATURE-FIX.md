# Index Signature Fix - DerivedFlags Interfaces

**Date**: January 29, 2026  
**Issue**: Type mismatch between specific DerivedFlags interfaces and `Record<string, boolean>`

---

## Error

```
Type error: Type 'DnsDerivedFlags' is not assignable to type 'Record<string, boolean>'.
  Index signature for type 'string' is missing in type 'DnsDerivedFlags'.
```

**Location**: `lib/signals/dns.ts:75`

---

## Root Cause

The `BlockResult<T>` interface defines `derived_flags` as:
```typescript
derived_flags: Record<string, boolean>;
```

This type requires an **index signature** `[key: string]: boolean` that allows any string property.

However, all 6 DerivedFlags interfaces were defined with specific properties only:
```typescript
export interface DnsDerivedFlags {
  domain_age_low: boolean;
  dns_provider_third_party: boolean;
  single_point_dns_dependency: boolean;
}
```

Without the index signature, TypeScript cannot assign `DnsDerivedFlags` to `Record<string, boolean>`.

---

## Solution

Added index signatures to all 6 DerivedFlags interfaces:

**File**: `lib/signals/types.ts`

### 1. DnsDerivedFlags
```typescript
export interface DnsDerivedFlags {
  [key: string]: boolean;  // ← Added
  domain_age_low: boolean;
  dns_provider_third_party: boolean;
  single_point_dns_dependency: boolean;
}
```

### 2. EmailDerivedFlags
```typescript
export interface EmailDerivedFlags {
  [key: string]: boolean;  // ← Added
  email_spoofing_possible: boolean;
  email_protection_partial: boolean;
  email_protection_strong: boolean;
}
```

### 3. TlsDerivedFlags
```typescript
export interface TlsDerivedFlags {
  [key: string]: boolean;  // ← Added
  ssl_expiring_soon: boolean;
  legacy_tls_supported: boolean;
  no_https_redirect: boolean;
}
```

### 4. TechStackDerivedFlags
```typescript
export interface TechStackDerivedFlags {
  [key: string]: boolean;  // ← Added
  cms_common_target: boolean;
  cdn_present: boolean;
  hosting_identified: boolean;
}
```

### 5. ExposureDerivedFlags
```typescript
export interface ExposureDerivedFlags {
  [key: string]: boolean;  // ← Added
  cloud_hosted: boolean;
  infrastructure_identifiable: boolean;
}
```

### 6. HibpDerivedFlags
```typescript
export interface HibpDerivedFlags {
  [key: string]: boolean;  // ← Added
  recent_breach: boolean;
  multiple_breaches: boolean;
  credential_breach: boolean;
}
```

---

## Why This Works

1. **Index Signature Compatibility**: Adding `[key: string]: boolean;` makes these interfaces compatible with `Record<string, boolean>`
2. **Type Safety Preserved**: All specific properties retain full type checking and autocompletion
3. **Runtime Safety**: The code already only assigns boolean values to these flags, so no runtime changes needed
4. **Consistency**: All 6 signal blocks now have consistent type patterns

---

## Impact

**Files Modified**: 1
- `lib/signals/types.ts` (6 interfaces updated)

**Individual Fixes**: 6 (one index signature per interface)

---

## Alternative Considered

**Option 1**: Change `BlockResult` to use specific types instead of `Record<string, boolean>`  
**Downside**: Would require complex generic type parameters and break existing code

**Option 2**: Cast to `any` when assigning  
**Downside**: Loses all type safety

**Option 3**: Add index signatures ✅ (chosen)  
**Benefits**: Maintains type safety, solves the problem at the type definition level

---

**Status**: All 6 DerivedFlags interfaces now include index signatures. Build should succeed.
