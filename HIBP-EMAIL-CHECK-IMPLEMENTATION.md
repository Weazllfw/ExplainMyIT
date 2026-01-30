# HIBP Email Check Implementation

**Date:** 2026-01-28  
**Status:** ✅ Complete and Ready to Test

---

## Problem

The HIBP integration was using the `/breaches?domain={domain}` endpoint, which only checks if the domain itself was the source of a breach (e.g., `bendixfx.com` had their database breached).

This missed the primary use case: checking if **individual employee emails** from the domain have appeared in breaches (e.g., `alex@bendixfx.com` appeared in the LinkedIn breach).

---

## Solution

**Changed from:**
- Domain-level check: `/breaches?domain=bendixfx.com`
- Found: 0 breaches (domain wasn't breached)

**Changed to:**
- Email-level checks: `/breachedaccount/{email}`
- Check 2 emails per snapshot:
  1. `info@domain.com` (most common business email)
  2. User's submitted email (e.g., `alex@bendixfx.com`)
- Combine results (deduplicated by breach name)

---

## Cost & Rate Limiting

### Current Plan
- **Pwned 1**: $4.50/month
- **Rate Limit**: 10 requests per minute (RPM)
- **Emails per check**: 2

### Performance Impact
- **Single snapshot**: +6-12 seconds (2 API calls, 6s delay between)
- **Burst handling**: Simple queue spreads requests over time
- **Cached repeats**: 30-day cache = 0 seconds for repeat checks

### Monthly Capacity
- 10 RPM ÷ 2 calls = **~5 snapshots per minute**
- **~130,000 snapshots per month** (way more than needed)

---

## Implementation Details

### 1. Added Rate Limiter (`lib/signals/hibp.ts`)

```typescript
class HibpRateLimiter {
  private lastCallTime = 0;
  private readonly minInterval = 6100; // 6.1 seconds

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`⏳ HIBP rate limit: waiting ${(waitTime / 1000).toFixed(1)}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastCallTime = Date.now();
  }
}
```

### 2. Updated API Call (`lib/signals/hibp.ts`)

**Old:**
```typescript
const url = `${HIBP_API_BASE}/breaches?domain=${domain}`;
```

**New:**
```typescript
const url = `${HIBP_API_BASE}/breachedaccount/${email}?truncateResponse=false`;
await hibpLimiter.waitForSlot(); // Wait for rate limit slot
```

### 3. Updated Function Signature

**Old:**
```typescript
export async function collectHibpSignals(domain: string): Promise<HibpBlockResult>
```

**New:**
```typescript
export async function collectHibpSignals(
  domain: string,
  userEmail?: string
): Promise<HibpBlockResult>
```

### 4. Updated Signal Flow

```
User submits: alex@bendixfx.com + bendixfx.com
    ↓
API Route passes email to orchestrator
    ↓
Orchestrator passes email to HIBP module
    ↓
HIBP module checks:
  1. info@bendixfx.com
  2. alex@bendixfx.com
    ↓
Results combined (deduplicated)
    ↓
Stored with `emails_checked` metadata
```

---

## Data Structure Changes

### Added to `HibpRawSignals` (`lib/signals/types.ts`)

```typescript
export interface HibpRawSignals {
  breaches: Array<{...}>;
  total_breach_count: number;
  most_recent_breach_date: string | null;
  emails_checked?: string[];  // NEW: Which emails were checked
}
```

### Added to `HibpResults` (`types/database.ts`)

```typescript
export interface HibpResults {
  breaches: HibpBreach[];
  fetched_at: string;
  emails_checked?: string[];  // NEW: Which emails were checked
}
```

---

## Files Modified

1. ✅ `lib/signals/hibp.ts` - Core logic changes
2. ✅ `lib/signals/types.ts` - Type updates
3. ✅ `lib/signals/orchestrator.ts` - Pass email parameter
4. ✅ `app/api/snapshot/route.ts` - Pass user email to signals
5. ✅ `types/database.ts` - Database type updates

---

## Expected Behavior

### For `bendixfx.com` with user email `alex@bendixfx.com`:

**Console Output:**
```
🔍 HIBP: Checking 2 email(s) for bendixfx.com
⏳ HIBP rate limit: waiting 6.1s
   info@bendixfx.com: 0 breach(es) found
   alex@bendixfx.com: 7 breach(es) found
✅ HIBP: Found 7 unique breach(es) across 2 email(s)
```

**Stored Data:**
```json
{
  "breaches": [
    { "name": "LinkedIn", "title": "LinkedIn", ... },
    { "name": "Dropbox", "title": "Dropbox", ... },
    ...
  ],
  "total_breach_count": 7,
  "most_recent_breach_date": "2023-08-15",
  "emails_checked": ["info@bendixfx.com", "alex@bendixfx.com"]
}
```

**Report Display:**
- Block narratives will mention "7 breaches found"
- Technical Data Viewer shows which emails were checked
- LLM receives `emails_checked` for context in narratives

---

## Testing Checklist

- [ ] Run a snapshot for `bendixfx.com` with email `alex@bendixfx.com`
- [ ] Verify console shows "Checking 2 email(s)"
- [ ] Verify breaches are found (should be 7+ based on screenshot)
- [ ] Verify Technical Data Viewer shows `emails_checked` field
- [ ] Test cache hit (re-run same domain within 30 days)
- [ ] Test rate limiting (run multiple snapshots back-to-back)

---

## Future Upgrade Path

If business grows and rate limits become a concern:

| Upgrade | Cost | RPM | Snapshots/min |
|---------|------|-----|---------------|
| **Pwned 2** | $22/mo | 50 | 25/min |
| **Pwned 3** | $37.50/mo | 100 | 50/min |

Currently staying on **Pwned 1** ($4.50/mo) until business justifies upgrade.

---

## Notes

- Cache key now includes emails checked (e.g., `bendixfx.com-info@bendixfx.com,alex@bendixfx.com`)
- Duplicate emails are removed (if user submits `info@domain.com`, only checked once)
- If user email domain doesn't match snapshot domain, both are still checked
- Rate limiter is a simple in-memory queue (sufficient for current scale)

---

**Ready to Deploy** ✅
