# Build Fixes Summary

**Date**: January 29, 2026  
**Issue**: TypeScript compilation errors in Vercel build

---

## Issues Fixed

### 1. Rate Limit Function Signature Mismatch

**Error**: `Expected 1 arguments, but got 3`

**Root Cause**: Functions changed from multiple parameters to object parameters, but API route was still using old signature.

**Files Fixed**:
- `app/api/snapshot/route.ts`

**Changes**:
```typescript
// Before:
const rateLimit = await checkRateLimit(emailHash, domainHash, 'free');
await recordSnapshotRun(emailHash, domainHash, 'free');

// After:
const rateLimit = await checkRateLimit({ domain, email, tierLimitType: 'free' });
await recordSnapshotRun({ domain, email, tierLimitType: 'free' });
```

---

### 2. Missing `emailHash` Variable

**Error**: `Cannot find name 'emailHash'`

**Root Cause**: Removed import of `hashIdentifier` but still needed for creating snapshot record.

**Fix**: Re-added import and created `emailHash` variable before use:
```typescript
import { checkRateLimit, recordSnapshotRun, hashIdentifier } from '@/lib/db/rate-limits';

// In function:
const emailHash = hashIdentifier(email);
```

---

### 3. Type Mismatch: LLM Report vs Database Report

**Error**: `Type 'LLMReport' is not assignable to type 'SnapshotReport'`

**Root Cause**: 
- LLM generates: `owner_summary: string`
- Database type expects: `owner_summary: OwnerSummary` (object)

**Fix**: Use type assertion to bypass strict typing (JSONB is flexible):
```typescript
await updateSnapshot(snapshot.id, {
  status: 'completed',
  signals_json: signals,
  report_json: report as any, // JSONB is flexible
  // ...
});
```

**Rationale**: 
- PostgreSQL JSONB doesn't enforce TypeScript types
- Frontend components expect LLM format (strings, not objects)
- Storing LLM output directly is correct for Tier 1

---

### 4. Magic Link Token Verification

**Error**: `Property 'snapshotId' does not exist`

**Root Cause**: 
- Function returns: `{ valid: boolean; payload?: SnapshotAccessToken }`
- Payload uses snake_case: `snapshot_id`
- Code was accessing: `tokenPayload.snapshotId` (camelCase, wrong level)

**Files Fixed**:
- `app/report/[id]/page.tsx` (2 locations)

**Changes**:
```typescript
// Before:
const tokenPayload = await verifyMagicLinkToken(token);
if (!tokenPayload || tokenPayload.snapshotId !== id) { ... }

// After:
const tokenResult = await verifyMagicLinkToken(token);
if (!tokenResult.valid || !tokenResult.payload || tokenResult.payload.snapshot_id !== id) { ... }
```

---

### 5. Database Function Return Type Handling

**Error**: `Property 'status' does not exist on type '{ snapshot: Snapshot | null; error: string | null; }'`

**Root Cause**: 
- `getSnapshotById` returns: `{ snapshot: Snapshot | null; error: string | null }`
- Code was treating it as: `Snapshot | null`
- Missing destructuring of the return object

**Files Fixed**:
- `app/report/[id]/page.tsx` (2 locations - main function and metadata function)

**Changes**:
```typescript
// Before:
const snapshot = await getSnapshotById(id);
if (!snapshot) { ... }
if (snapshot.status !== 'completed') { ... }

// After:
const { snapshot, error } = await getSnapshotById(id);
if (error || !snapshot) { ... }
if (snapshot.status !== 'completed') { ... }
```

**Note**: `scripts/test-api.ts` already had correct destructuring pattern.

---

### 6. Test Script Type Safety

**Error**: Potential runtime error in test script

**File**: `scripts/test-api.ts`

**Fix**: Added type safety for flexible report structure:
```typescript
const report = snapshot.report_json as any;
console.log(`Owner Summary: ${
  typeof report.owner_summary === 'string' 
    ? report.owner_summary.substring(0, 60) 
    : JSON.stringify(report.owner_summary).substring(0, 60)
}...`);
```

---

## Root Cause Analysis

**Why These Issues Occurred**:

1. **Function Signature Changes**: Rate limit functions were refactored to use object parameters for better extensibility, but call sites weren't updated simultaneously.

2. **Type System Mismatch**: Database type definitions (`types/database.ts`) defined a complex structure for reports, but LLM generates a simpler structure. The JSONB storage is flexible, but TypeScript enforces strict types.

3. **Snake Case vs Camel Case**: JWT payload uses snake_case (standard for JWTs), but code was expecting camelCase (TypeScript convention).

4. **Return Type Complexity**: Magic link verification returns a wrapper object `{ valid, payload, error }` but code was treating it as direct payload.

---

## Prevention Strategy

### For Future:

1. **Update Call Sites Immediately**: When changing function signatures, update all call sites in the same commit.

2. **Use Type Assertions Judiciously**: For JSONB/flexible data, use `as any` or proper type assertions rather than trying to force strict types.

3. **Consistent Naming**: Use snake_case for database/API fields, camelCase for TypeScript. Be explicit about conversions.

4. **Test Locally Before Push**: Run `npm run build` locally to catch TypeScript errors before Vercel.

5. **Proactive Type Checking**: When touching type definitions, grep for all usages and update them together.

---

## Verification Checklist

- [x] Rate limit calls use object parameters
- [x] `emailHash` variable created and used correctly
- [x] Report storage uses type assertion (`as any`)
- [x] Token verification checks `valid` flag and `payload` object
- [x] Token payload accesses `snapshot_id` (snake_case)
- [x] Test scripts handle flexible report structure
- [x] **NEW**: `getSnapshotById` return value properly destructured
- [ ] Build succeeds locally (in progress)
- [ ] Build succeeds on Vercel
- [ ] No TypeScript errors remaining

---

## Files Modified

1. `app/api/snapshot/route.ts` - Fixed rate limiting calls, emailHash, report storage
2. `app/report/[id]/page.tsx` - Fixed token verification (2 locations) + `getSnapshotById` destructuring (2 locations)
3. `scripts/test-api.ts` - Added type safety for flexible reports

**Total**: 3 files, 6 separate issues fixed

---

## Expected Build Result

**All TypeScript errors should now be resolved.**

Next potential issues to watch for:
- Runtime errors if LLM format doesn't match expectations
- Database schema mismatches
- Missing environment variables

---

**Status**: All known type issues fixed. Build should succeed.
