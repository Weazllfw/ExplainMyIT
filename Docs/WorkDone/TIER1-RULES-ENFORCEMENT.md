# Tier 1 Rules Enforcement (LOCKED)

**Date**: 2026-01-30  
**Status**: IMPLEMENTED  
**Cost Impact**: $0 (SecurityTrails removed, crt.sh is free)

---

## Summary of Changes

Following detailed product philosophy guidance, I've enforced strict "Tier 1 Rules" across all code, prompts, and components. This ensures the product stays focused on **awareness without judgment**, creating **productive discomfort without fear**.

---

## Key Philosophy (LOCKED)

### ✅ Tier 1 IS ALLOWED TO:
- Expose ambiguity
- Surface assumptions
- Show breadth
- Create mild discomfort
- Raise questions
- State facts

### ❌ Tier 1 IS FORBIDDEN TO:
- Judge
- Score (no ratings, no health metrics, no 0-100 scales)
- Label risk ("critical", "severe", "high risk")
- Imply negligence ("abandoned", "exposed", "vulnerable")
- Recommend fixes or remediation
- Name technical controls unless owner understands the category

---

## Changes Made

### 1. **DELETED: ExecutiveSummary Component** ❌

**File**: `components/report/ExecutiveSummary.tsx`

**Violations**:
- ❌ Health Score ring (lines 17, 50-79) = scoring
- ❌ "Critical Items" judgment language (line 85-86)
- ❌ "Needs Attention" judgment language (line 89-90)
- ❌ "Top Recommendations" = remediation (line 99-114)

**Action**: Deleted entirely. Violated core Tier 1 rules.

---

### 2. **REWRITTEN: Subdomain Enumeration Module**

**File**: `lib/signals/subdomains.ts`

**Old approach** (WRONG):
- Used SecurityTrails API ($500/month - non-starter)
- Function `identifyAbandonedSubdomains()` - forbidden language
- Flag `abandoned_subdomains_likely` - forbidden

**New approach** (CORRECT):
- Uses crt.sh (Certificate Transparency logs) - FREE
- Function `identifyNamingPatterns()` - neutral, observational
- Flag `abandoned_subdomains_likely` - ALWAYS false for Tier 1
- Extensive comments explaining Tier 1 framing rules

**Correct Tier 1 Tone**:
> "We observed multiple public subdomains associated with your domain through Certificate Transparency logs. This is common in organizations that have evolved over time and often reflects development, testing, or service usage. From an external perspective, it isn't possible to determine which of these are actively maintained versus historical."

**Implementation**:
```typescript
// TIER 1 FRAMING RULES:
// ✅ State subdomains exist
// ✅ Show examples
// ✅ Note patterns (dev, test, staging)
// ✅ Say it's common
// ✅ Say external observation can't determine management status
// 
// ❌ DO NOT call them "abandoned"
// ❌ DO NOT call them "exposed"
// ❌ DO NOT assign risk
// ❌ DO NOT count as findings
// ❌ DO NOT label as "issues"
```

**Data source**: crt.sh API  
**Cost**: $0  
**Coverage**: 70-80% of subdomains (all with SSL certs)

---

### 3. **UPDATED: LLM Prompts with Locked Rules**

**File**: `lib/llm/prompts.ts`

**Changes**:

#### **A. Added Tier 1 Rules Section**:
```plaintext
TIER 1 RULES (LOCKED - apply to all blocks):

✅ ALLOWED:
- Expose ambiguity
- Surface assumptions
- Show breadth
- Create mild discomfort
- Raise questions
- State facts

❌ FORBIDDEN:
- Judge
- Score (no ratings, no health metrics)
- Label risk ("critical", "severe", "high risk")
- Imply negligence ("abandoned", "exposed", "vulnerable")
- Recommend fixes or remediation
- Name technical controls unless owner understands the category
- Use fear language
```

#### **B. Added Security Headers/Blacklists Framing**:
```plaintext
SPECIAL FRAMING FOR SECURITY HEADERS/BLACKLISTS:
- NEVER name technical controls (CSP, HSTS, X-Frame-Options, DNSBL names)
- Frame in business terms: "relies on hosting provider for protection against common web threats"
- Do NOT make absence sound like a finding
```

#### **C. Added Subdomain Framing Rules**:
```plaintext
SPECIAL FRAMING FOR SUBDOMAINS (IF DATA EXISTS):
✅ ALLOWED:
- State multiple subdomains exist
- Show 3-5 examples
- Note patterns ("dev", "test", "staging")
- Say "This is common in organizations that have evolved over time"
- Say "External observation cannot determine which are actively maintained"

❌ FORBIDDEN:
- Call them "abandoned"
- Call them "exposed"
- Assign risk
- Count as a finding
- Label as "issues"
- Suggest they need cleanup

CORRECT TIER 1 TONE FOR SUBDOMAINS:
"We observed multiple public subdomains associated with your domain through Certificate Transparency logs. This is common in organizations that have evolved over time and often reflects development, testing, or service usage. From an external perspective, it isn't possible to determine which of these are actively maintained versus historical."
```

#### **D. Dynamic Block Count**:
- Updated prompt to support 6-7 blocks (subdomains is optional)
- Subdomains block only included if data exists
- Output format updated to conditionally expect `subdomains` key

---

### 4. **UPDATED: Signal Orchestrator**

**File**: `lib/signals/orchestrator.ts`

**Changes**:
- Removed `SECURITYTRAILS_API_KEY` check (no longer needed)
- Subdomain collection now runs by default (free via crt.sh)
- Updated logging to always show subdomain status
- Added subdomains block to `SnapshotSignals` output

**Before**:
```typescript
const enableSubdomains = !!process.env.SECURITYTRAILS_API_KEY;
if (enableSubdomains) {
  promises.push(collectSubdomainSignals(domain));
}
```

**After**:
```typescript
// Always collect subdomains (free via crt.sh)
promises.push(collectSubdomainSignals(domain));
```

---

### 5. **REMOVED: ExecutiveSummary Integration**

**File**: `app/report/[id]/page.tsx`

**Changes**:
- Removed `import { ExecutiveSummary }` (line 14)
- Removed `<ExecutiveSummary report={report} domain={snapshot.domain} />` (line 126)

**Result**: Report page now starts directly with `OwnerSummary` (judgment-free)

---

## Cost Impact

| Item | Old Cost | New Cost | Savings |
|------|----------|----------|---------|
| SecurityTrails API | $500/month | $0 | $500/month |
| crt.sh (CT logs) | N/A | $0 | Free |
| **Total Tier 1 cost** | **$500/month** | **$0** | **$500/month saved** |

---

## What Tier 2 Will Offer (Future)

When revenue justifies it, Tier 2 can introduce:

✅ **Change detection** ("this subdomain appeared since last month")  
✅ **Historical timelines** (DNS/WHOIS history)  
✅ **Ownership attribution**  
✅ **Alerts** (proactive monitoring)  
✅ **Completeness guarantees** (exhaustive scanning)  
✅ **SecurityTrails integration** ($500/month makes sense when charging)

**Key insight**: Tier 1 creates the question, Tier 2 resolves it.

---

## Monetization Preserved

Tier 1 does NOT need to scare users to drive upgrades.

**Tier 1 hook**:
> "This snapshot can't tell if this is being managed."

**Tier 2 promise**:
- Change tracking
- Ownership clarity
- Documentation
- Continuity

**Owner realization**:
> "I don't actually know who owns this."

**Result**: Upgrade driven by **awareness**, not fear.

---

## Testing Checklist

Before deployment, verify:

- [ ] Subdomain enumeration runs successfully (check logs)
- [ ] LLM receives subdomain data (if available)
- [ ] LLM output uses correct Tier 1 tone (no "abandoned", "exposed")
- [ ] No health scores or judgment language anywhere
- [ ] Security headers framed in business terms (not "lacks CSP")
- [ ] Report page loads without ExecutiveSummary component
- [ ] Technical Data Viewer still works (shows subdomain raw data)

---

## Files Modified

1. ✅ `components/report/ExecutiveSummary.tsx` - DELETED
2. ✅ `lib/signals/subdomains.ts` - REWRITTEN (crt.sh)
3. ✅ `lib/llm/prompts.ts` - UPDATED (Tier 1 rules)
4. ✅ `lib/signals/orchestrator.ts` - UPDATED (always run subdomains)
5. ✅ `app/report/[id]/page.tsx` - UPDATED (removed ExecutiveSummary)

---

## Deployment Notes

1. **No environment variable changes needed** (crt.sh doesn't require API key)
2. **No database schema changes needed**
3. **Existing reports unaffected** (subdomains block is optional in schema)
4. **LLM will adapt** (prompts are conditional based on data presence)

---

## Final Verification

Run a snapshot for `example.com` and confirm:

1. Subdomain collection succeeds (check logs)
2. Report narrative includes subdomain section with correct tone
3. No "abandoned" or "exposed" language anywhere
4. No health scores or judgment metrics
5. Technical Data Viewer shows subdomain raw data

---

**Bottom line**: Tier 1 now has teeth without fangs. ✅
