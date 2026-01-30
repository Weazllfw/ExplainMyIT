# Email Test Script Fix

**Date**: January 29, 2026  
**Issue**: Test script accessing non-existent `messageId` property

---

## Error

```
Type error: Property 'messageId' does not exist on type '{ success: boolean; error?: string | undefined; }'.
```

**Location**: `scripts/test-email.ts:76` (and 2 other similar locations)

---

## Root Cause

The email functions (`sendSnapshotEmail`, `sendWelcomeEmail`, etc.) return a simple result type:

```typescript
Promise<{ success: boolean; error?: string }>
```

However, the test script was trying to access a `messageId` property that doesn't exist:

```typescript
console.log(`   Message ID: ${snapshotResult.messageId}`);  // ❌ Property doesn't exist
```

The underlying Brevo API may return a message ID, but our wrapper functions don't expose it in their return types.

---

## Solution

Removed all `messageId` access from the test script (3 locations):

**File**: `scripts/test-email.ts`

### Fix 1: Basic Email Test (Lines 37-39)

**Before**:
```typescript
if (basicResult.success) {
  console.log(`✅ Basic email sent successfully!`);
  console.log(`   Message ID: ${basicResult.messageId}`);  // ❌
} else {
  console.error(`❌ Basic email failed: ${basicResult.error}`);
}
```

**After**:
```typescript
if (basicResult.success) {
  console.log(`✅ Basic email sent successfully!`);
} else {
  console.error(`❌ Basic email failed: ${basicResult.error}`);
}
```

### Fix 2: Snapshot Email Test (Lines 74-76)

**Before**:
```typescript
if (snapshotResult.success) {
  console.log(`✅ Snapshot email sent successfully!`);
  console.log(`   Message ID: ${snapshotResult.messageId}`);  // ❌
} else {
  console.error(`❌ Snapshot email failed: ${snapshotResult.error}`);
}
```

**After**:
```typescript
if (snapshotResult.success) {
  console.log(`✅ Snapshot email sent successfully!`);
} else {
  console.error(`❌ Snapshot email failed: ${snapshotResult.error}`);
}
```

### Fix 3: Welcome Email Test (Lines 86-88)

**Before**:
```typescript
if (welcomeResult.success) {
  console.log(`✅ Welcome email sent successfully!`);
  console.log(`   Message ID: ${welcomeResult.messageId}`);  // ❌
} else {
  console.error(`❌ Welcome email failed: ${welcomeResult.error}`);
}
```

**After**:
```typescript
if (welcomeResult.success) {
  console.log(`✅ Welcome email sent successfully!`);
} else {
  console.error(`❌ Welcome email failed: ${welcomeResult.error}`);
}
```

---

## Alternative Considered

We could have exposed `messageId` in the return types:

```typescript
export async function sendSnapshotEmail(
  // ...params
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // ...
  const result = await sendEmail({...});
  return { success: true, messageId: result.messageId };
}
```

However, this wasn't necessary for the test script's purpose (just verify success/failure), and the message ID is available in Brevo's dashboard if needed for debugging.

---

## Impact

**Files Modified**: 1
- `scripts/test-email.ts` (3 console.log statements removed)

**Individual Fixes**: 3

---

**Status**: Test script now matches email function return types. Build should succeed.
