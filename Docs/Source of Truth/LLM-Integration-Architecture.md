# LLM Integration Architecture

**Status**: ✅ Production-Ready  
**Model**: Claude 4.5 Haiku (`claude-haiku-4-5-20251001`)  
**Last Updated**: January 29, 2026

---

## Overview

The LLM integration generates all narrative content for Tier 1 IT reality snapshots using a 3-call architecture optimized for cost and consistency.

**Location**: `lib/llm/`

**Key Files**:
- `client.ts` - Anthropic API client with lazy initialization
- `types.ts` - TypeScript definitions for all LLM outputs
- `prompts.ts` - Production-ready prompt templates
- `generator.ts` - Report generation orchestrator

---

## Architecture: 3-Call Design

### Why 3 Calls Instead of 5-6?

**Original Design**: 6+ separate calls
1. DNS narrative
2. Email narrative
3. TLS narrative
4. Tech Stack narrative
5. Exposure narrative
6. HIBP narrative
7. Synthesis
8. Assumptions
9. Questions
10. Email summary

**Optimized Design**: 3 calls (batched for efficiency)

**Call 1: Block Narratives** (all 6 blocks in one request)
- Input: All 6 signal blocks with raw signals, flags, and confidence
- Output: JSON object with all 6 block narratives
- Benefit: Single context, consistent tone across blocks

**Call 2: Synthesis + Assumptions + Questions** (combined)
- Input: All signals + cross-block flags
- Output: Owner summary + top 3 findings + assumptions + questions
- Benefit: Holistic view for better synthesis, assumptions informed by findings

**Call 3: Email Summary**
- Input: Owner summary + top findings + report URL
- Output: Email subject + body
- Benefit: Optimized for conversion, includes all context from synthesis

**Cost Savings**: ~40% reduction (from ~$0.05 to ~$0.03 per snapshot)  
**Consistency**: Better narrative coherence within each call  
**Speed**: Parallel data preparation, fewer API round trips

---

## Model: Claude 4.5 Haiku

**Why Claude 4.5 Haiku?**
1. **Instruction Following**: Excellent JSON adherence with strict schemas
2. **Tone Control**: Reliably follows confidence guardrails (high/medium/low)
3. **Cost**: $1/M input, $5/M output (10x cheaper than GPT-4)
4. **Speed**: Fast enough for real-time generation (~7-8s per call)
5. **Context**: 200K tokens (more than enough for all 6 blocks)

**Model ID**: `claude-haiku-4-5-20251001`  
**Pricing**: ~$0.025-0.035 per complete snapshot report  
**Temperature**: 0.3 (low for consistency, non-zero for natural variation)

---

## Client Architecture (`lib/llm/client.ts`)

### Lazy Initialization

```typescript
// Anthropic client is not initialized on module load
// This prevents env var errors in test scripts before dotenv loads

let _anthropic: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: getAnthropicKey(),
    });
  }
  return _anthropic;
}
```

### JSON Parsing with Markdown Fence Stripping

Claude 4.5 often wraps JSON responses in markdown code fences:

```
```json
{
  "finding_code": "DNS_001"
}
```
```

The client automatically strips these:

```typescript
let cleanedJson = raw.trim();
if (cleanedJson.startsWith('```json')) {
  cleanedJson = cleanedJson.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
}
const parsed = JSON.parse(cleanedJson);
```

### Retry Logic

- **Default**: 1 retry per call
- **Backoff**: 1s, 2s (exponential)
- **Error Types**:
  - `{"error": "invalid_output"}` from LLM → Retry
  - JSON parse failure → Retry
  - API errors → Propagate after retries

---

## Prompt Templates (`lib/llm/prompts.ts`)

All prompts are based on `Docs/dev/LLM-Prompts-Tier1.md` (production-locked).

### Call 1: Block Narratives

**Input Variables**:
- All 6 signal blocks (DNS, Email, TLS, Tech Stack, Exposure, HIBP)
- Raw signals, derived flags, confidence for each

**Output Structure**:
```typescript
{
  dns: BlockNarrative,
  email: BlockNarrative,
  tls: BlockNarrative,
  techstack: BlockNarrative,
  exposure: BlockNarrative,
  hibp: BlockNarrative
}
```

**Key Rules**:
- 2-4 sentences per block
- Business language, not technical
- Confidence enforcement (medium/low must use qualifiers)
- No remediation steps, no vendor names
- Finding codes for tracking

### Call 2: Synthesis + Assumptions + Questions

**Input Variables**:
- All signal blocks (condensed)
- Cross-block flags

**Output Structure**:
```typescript
{
  owner_summary: string,          // 4-6 sentences, max 150 words
  top_findings: TopFinding[],     // Max 3, business-ranked
  assumptions: string[],           // 3-5, MUST include 1 organizational
  questions: string[]              // 3-5, no yes/no phrasing
}
```

**Key Rules**:
- Owner summary MUST include: "This snapshot is based on public signals only and cannot see inside your network."
- Assumptions use "You're assuming..." format
- Questions use "Who.../How.../What.../Where..." format (no yes/no)

### Call 3: Email Summary

**Input Variables**:
- Owner summary (from Call 2)
- Top findings (from Call 2)
- Report URL

**Output Structure**:
```typescript
{
  subject: string,
  body: string  // Plain text, no HTML
}
```

**Key Rules**:
- Product positioning: "one-time snapshot", "recurring snapshots" (not "monitoring")
- Subtle upgrade CTA
- Conversational but professional

---

## Generator (`lib/llm/generator.ts`)

### `generateReport()` Function

**Flow**:
1. **Prepare signal data** for all 3 calls
2. **Call 1**: Block narratives (3000 max_tokens)
3. **Call 2**: Synthesis (2000 max_tokens)
4. **Call 3**: Email (1000 max_tokens)
5. **Combine results** into `LLMReport` object
6. **Return** success/error

**Error Handling**:
- Each call has independent try/catch
- If Call 1 fails → entire generation fails (narratives are critical)
- If Call 2 fails → entire generation fails (synthesis is critical)
- If Call 3 fails → entire generation fails (email is critical)

**Performance**:
- Typical: 20-25 seconds for all 3 calls
- Signal collection: ~0.5s
- **Total snapshot time**: ~25 seconds

### `validateReport()` Function

**Checks**:
1. All 6 block narratives present with required fields
2. Valid confidence levels (high/medium/low)
3. Owner summary length (>50 chars)
4. Top findings count (>0)
5. Assumptions count (3-5)
6. Questions count (3-5)
7. Email subject and body present

**Returns**: `{valid: boolean, errors: string[]}`

---

## Testing

**Test Script**: `npm run test-llm`

**What It Tests**:
1. Signal collection for test domain (github.com)
2. LLM report generation (all 3 calls)
3. Report validation
4. Output preview

**Test Results (Jan 29, 2026)**:
```
✅ Signal collection complete in 0.58s
✅ LLM report generation complete in 21.96s
✅ Report validation passed!

📧 EMAIL SUBJECT:
   Your IT Reality Check for Your Domain

📝 OWNER SUMMARY:
   Your domain, email, and website security are functioning well with 
   established protections in place...

🎯 TOP FINDINGS:
   1. Email Security Has Room to Strengthen (high)
   2. Long-Established Domain Reduces Registration Risk (high)
   3. Website Traffic Is Encrypted and Current (high)

💭 ASSUMPTIONS:
   1. You're assuming someone has documented who is responsible for 
      renewing your SSL certificate...
   [4 total assumptions, including organizational]

❓ QUESTIONS:
   1. Who is responsible for monitoring and renewing your SSL certificate?
   [4 total questions, all open-ended]

📦 BLOCK NARRATIVES:
   DNS: Domain established with distributed DNS (high)
   EMAIL: Email security configured with partial coverage (high)
   TLS: Website encryption current and modern (high)
   TECHSTACK: Website built with React on AWS (medium)
   EXPOSURE: Infrastructure details partially identifiable (low)
   HIBP: No known credential breaches detected (low)
```

---

## Error Scenarios

### API Errors

**429 Rate Limit**:
- Claude API: 50 requests/minute (plenty for our volume)
- Retry with exponential backoff (handled by client)

**400 Bad Request**:
- Usually from prompt exceeding max_tokens
- Our prompts are well under limits

**404 Model Not Found**:
- Model ID typo or deprecated model
- Use specific snapshot ID (`claude-haiku-4-5-20251001`) not alias

### JSON Errors

**Markdown Code Fences**:
- Claude wraps JSON in ```json ... ```
- Client auto-strips these

**Malformed JSON**:
- Missing quotes, trailing commas, etc.
- Retry logic attempts up to 2 times
- After retries, fail gracefully with error message

**Schema Violations**:
- LLM returns `{"error": "invalid_output"}`
- Retry logic attempts up to 2 times
- Validation catches incomplete outputs

### Validation Errors

**Missing Blocks**:
- One or more block narratives missing
- Fail generation, log error, retry entire Call 1

**Confidence Errors**:
- Invalid confidence value (not high/medium/low)
- Fail validation, log for prompt refinement

**Length Violations**:
- Owner summary too short (<50 chars)
- Assumptions/questions count outside range
- Fail validation, flag for manual review

---

## Cost Structure

**Per Snapshot**:
- Call 1 (Block Narratives): ~2,000 tokens → $0.015
- Call 2 (Synthesis): ~1,500 tokens → $0.010
- Call 3 (Email): ~800 tokens → $0.006
- **Total**: ~$0.031 per snapshot

**Volume Projections**:
- 100 snapshots/month: $3.10
- 1,000 snapshots/month: $31.00
- 10,000 snapshots/month: $310.00

**Optimization Opportunities**:
- Prompt caching (future): ~50% savings on repeated signals
- Batch API (future): ~50% savings for non-real-time generation

---

## Quality Monitoring

**Weekly Review**:
- Sample 10 random reports
- Check for:
  - Fear language ("critical", "severe", "urgent")
  - Over-confidence (medium/low missing qualifiers)
  - Missing assumptions (no organizational)
  - Yes/no questions
- Refine prompts based on drift

**Finding Code Tracking**:
- Track which finding_codes drive conversions
- Most common codes become template fallbacks

---

## Future Enhancements

### Phase 4 (Potential)

1. **Prompt Caching**: Cache common signal patterns for repeat snapshots
2. **Template Fallbacks**: Pre-generated narratives for common scenarios
3. **A/B Testing**: Test prompt variations for conversion optimization
4. **Multi-Language**: Generate reports in user's preferred language
5. **Custom Tone**: Allow users to adjust formality level

### Tier 2 (Internal Insights)

- More detailed technical narratives
- Remediation recommendations
- Vendor-specific guidance
- Compliance mapping (SOC 2, ISO 27001, etc.)

---

**Last Updated**: January 29, 2026  
**Test Status**: ✅ All tests passing  
**Production Ready**: Yes
