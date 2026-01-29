# Final Cleanup - Missed Flags Property

**Date**: January 29, 2026  
**Issue**: One remaining `flags` property reference in DNS block prompts

---

## Error

```
Type error: Property 'flags' does not exist on type 'DnsSignals'.
```

**Location**: `lib/llm/prompts.ts:36`

---

## Root Cause

During the massive schema mismatch fix (Category #12), I removed `flags` from most signal blocks in the prompts but missed one instance in the DNS block of `buildBlockNarrativesPrompt()`.

---

## Fix Applied

**File**: `lib/llm/prompts.ts`

**Change 1**: Removed the orphaned `flags` line from DNS block
```typescript
// Before:
signals: {
  domain_age_days: signals.dns!.domain_age_days,
  ...
},
flags: signals.dns!.flags,  // ❌ This line

// After:
signals: {
  domain_age_days: signals.dns!.domain_age_days,
  ...
},
```

**Change 2**: Added safety for `cross_block_flags`
```typescript
// Before:
cross_block_flags: signals.cross_block_flags,

// After:
cross_block_flags: signals.cross_block_flags || [],
```

---

## Impact

**Total**: 2 final cleanup fixes in `lib/llm/prompts.ts`

This completes the schema mismatch corrections from Category #12.

---

**Status**: All schema-related errors resolved. Build should succeed.
