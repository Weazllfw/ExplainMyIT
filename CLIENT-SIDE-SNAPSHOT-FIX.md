# Client-Side Snapshot Loading Fix

**Date**: January 29, 2026  
**Issue**: Dashboard throwing "Supabase service key not configured" error when loading snapshots

---

## The Problem

```
[Dashboard] User authenticated: 93f19f81-... ✅
[Dashboard] Error loading snapshots: Error: Supabase service key not configured ❌
```

**Root Cause**:
- `getUserSnapshots()` was hardcoded to use `getSupabaseAdmin()` (service key)
- `DashboardClientWrapper` calls it client-side
- Service key (`SUPABASE_SERVICE_KEY`) is server-only
- Trying to access it from browser throws error

---

## The Solution

### ✅ **Made getUserSnapshots() Accept Client Parameter**

**File**: `lib/db/snapshots.ts`

**Changed from**:
```typescript
export async function getUserSnapshots(userId: string) {
  const supabase = getSupabaseAdmin(); // ❌ Always uses service key
  // ...
}
```

**Changed to**:
```typescript
export async function getUserSnapshots(
  userId: string,
  limit = 50,
  supabaseClient?: any // ✅ Optional client parameter
) {
  // Use provided client (browser) or default to admin (server)
  const supabase = supabaseClient || getSupabaseAdmin();
  // ...
}
```

**Why this works**:
- ✅ Client-side: Pass browser client (uses user session + RLS)
- ✅ Server-side: Omit parameter (uses admin client + service key)
- ✅ Same function works in both contexts

---

### ✅ **Updated Dashboard to Pass Browser Client**

**File**: `components/dashboard/DashboardClientWrapper.tsx`

**Changed**:
```typescript
// Import browser client
import { getSupabaseBrowserClient } from '@/lib/db/supabase-browser';

// Load snapshots
const supabase = getSupabaseBrowserClient();
const { snapshots } = await getUserSnapshots(
  currentUser.id,
  50,
  supabase // ✅ Pass browser client
);
```

**What happens now**:
```
1. User logs in → Session stored in cookies ✅
2. Dashboard loads → Browser client reads cookies ✅
3. getUserSnapshots() uses browser client ✅
4. Query runs with user's session ✅
5. RLS policies enforce access ✅
6. User sees only their snapshots ✅
```

---

## Security

### **Row Level Security (RLS) Protects Data**

Even though we're using the browser client (not admin), data is secure because:

1. **RLS Policies** (in Supabase database):
   ```sql
   -- Users can only read their own snapshots
   CREATE POLICY "Users can view own snapshots"
   ON snapshots FOR SELECT
   USING (auth.uid() = user_id);
   ```

2. **Browser client uses user session**:
   - User must be authenticated
   - Can only access rows where `user_id` matches their ID
   - Cannot see other users' data

3. **No elevation of privileges**:
   - Browser client respects RLS
   - Only admin client bypasses RLS
   - We only use admin client server-side now

---

## Pattern for Future

### **When to Use Admin Client**:
```typescript
// Server-side operations that need to bypass RLS
const supabase = getSupabaseAdmin();
```

**Use cases**:
- Server-side mutations (API routes, webhooks)
- Cross-user queries (admin dashboards)
- System operations (cleanup, migrations)

### **When to Use Browser Client**:
```typescript
// Client-side operations for current user
const supabase = getSupabaseBrowserClient();
```

**Use cases**:
- Dashboard data loading
- User profile updates
- User-scoped queries
- **Any client component that needs data**

### **Flexible Functions** (Like We Just Fixed):
```typescript
export async function getStuff(
  userId: string,
  supabaseClient?: any // Optional client
) {
  // Use provided client or default to admin
  const supabase = supabaseClient || getSupabaseAdmin();
  // ...
}
```

**Benefits**:
- ✅ Works client-side AND server-side
- ✅ Caller controls which client to use
- ✅ No code duplication

---

## Files Changed

1. ✅ `lib/db/snapshots.ts` (MODIFIED)
   - Added `supabaseClient` optional parameter
   - Uses provided client or defaults to admin

2. ✅ `components/dashboard/DashboardClientWrapper.tsx` (MODIFIED)
   - Import browser client
   - Pass browser client to `getUserSnapshots()`

---

## Testing

### **Expected Behavior**:
- [ ] ✅ Dashboard loads without errors
- [ ] ✅ User sees their snapshots (if any)
- [ ] ✅ No "service key not configured" error
- [ ] ✅ Console logs show successful snapshot loading

### **Console Logs** (Expected):
```
[Dashboard] Checking auth...
[Dashboard] User authenticated: abc-123-def
```

**No errors!** ✅

---

## Related Files That Use getUserSnapshots

I checked - `getUserSnapshots()` is only called from:
1. ✅ `DashboardClientWrapper.tsx` - Now passes browser client
2. No other callers found

So this fix is complete and won't break anything else.

---

**Status**: ✅ **FIXED**

**Result**: Dashboard can now load user snapshots client-side without service key errors!
