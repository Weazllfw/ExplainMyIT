# Tier 1 System Architecture

**Purpose**: High-level technical reference for how Tier 1 works end-to-end.

---

## System Overview

Tier 1 generates plain-English IT security snapshots for business owners using publicly available data.

**Flow**: Request → Signal Collection → LLM Narrative Generation → Email Report → Magic Link Access

---

## Core Components

### 1. Database (`lib/db/`)

**Tables** (4 core):
- `users` - User accounts (auth-ready, org-ready for Tier 2)
- `snapshots` - All snapshot data (signals JSON + report JSON)
- `rate_limits` - Usage controls (per domain, per user/email)
- `hibp_cache` - HIBP API result caching (30-day TTL)

**Operations**:
- `snapshots.ts` - CRUD for snapshots
- `users.ts` - User management
- `rate-limits.ts` - Rate limiting logic
- `cache.ts` - HIBP cache operations

**Client**: `lib/db/client.ts`
- `supabase` - Client-side (anon key, RLS-aware)
- `supabaseAdmin` - Server-side (service role, bypasses RLS)

**Status**: ✅ Complete

---

### 2. Signal Collection (`lib/signals/`)

**Purpose**: Gather raw data from external sources.

**Modules** (6 total):
1. ✅ **DNS** (`dns.ts`) - Domain age, registrar, nameservers, A/MX records
2. ✅ **Email Auth** (`email.ts`) - SPF, DKIM, DMARC, MX provider
3. ⏳ **TLS** (`tls.ts`) - HTTPS, certificate, TLS versions
4. ⏳ **Tech Stack** (`techstack.ts`) - CMS, CDN, hosting
5. ⏳ **Exposure** (`exposure.ts`) - Reverse DNS, geolocation
6. ⏳ **HIBP** (`hibp.ts`) - Known breaches

**Pattern**: Each module exports `collect{X}Signals(domain)` returning `BlockResult<T>`

**Orchestrator**: `lib/signals/orchestrator.ts` (future) - Runs all 6 in parallel, computes cross-block flags

**Status**: 2/6 complete (DNS, Email Auth)

---

### 3. LLM Integration (`lib/llm/`)

**Purpose**: Generate plain-English narratives from raw signals.

**Components**:
- `client.ts` - Anthropic API wrapper (Claude 3.5 Haiku)
- `prompts.ts` - 3 production prompts (Block Narratives, Synthesis, Email Summary)
- `generator.ts` - Orchestrates 3 LLM calls
- `validator.ts` - JSON schema validation
- `fallbacks.ts` - Static templates if LLM fails

**Architecture** (3 calls per snapshot):
1. **Block Narratives** - 6 block narratives in one call (consistent tone)
2. **Synthesis** - Owner summary + top findings + assumptions + questions
3. **Email Summary** - Plain-text email body

**Cost**: ~$0.025-0.035 per snapshot

**Status**: ⏳ Not started

---

### 4. API Routes (`app/api/`)

**Request Flow**:
- `POST /api/snapshot/request` - Create snapshot request
  - Validates domain
  - Checks rate limits
  - Creates snapshot record (status=pending)
  - Triggers background job
  - Returns snapshot ID
  
**Background Processing**:
- `POST /api/snapshot/process` (internal) - Process snapshot
  - Collects signals (6 modules)
  - Saves signals to DB
  - Calls LLM (3 calls)
  - Saves report to DB
  - Sends email (Snapshot Complete)
  - Updates status=completed

**Access**:
- `GET /api/snapshot/[id]` - Get snapshot by ID + token
  - Validates magic link JWT
  - Returns snapshot data

**Auth**:
- `POST /api/auth/magic-link` - Generate magic link
  - Creates JWT with snapshot access
  - Returns time-limited URL

**Status**: ⏳ Not started

---

### 5. Email System (`lib/email/`)

**Purpose**: Send system emails via Brevo.

**Components**:
- `brevo.ts` - Brevo API client (extends existing waitlist code)
- `templates.ts` - Email templates (3 types)
- `sender.ts` - Email sending logic + Brevo contact updates
- `utils.ts` - UTM builder, email validation

**System Emails** (3 types):
1. **Snapshot Complete** - "Your report is ready" + magic link
2. **Welcome** (future) - "Account created, run more snapshots"
3. **Report Expiring** (future) - "Report expires in 7 days"

**Brevo Integration**:
- Update contact attributes (lead scoring, attribution)
- Track email events via webhook (`/api/webhooks/brevo`)

**Umami Integration**:
- UTM parameters on all links
- Server-side event tracking (email_sent, email_opened, etc.)

**Status**: ⏳ Not started

---

### 6. Frontend (`components/`, `app/`)

**Pages**:
- `/` - Homepage (existing)
- `/snapshot/[id]` - Snapshot report view (new)
- `/dashboard` (future) - User dashboard after account creation

**Components**:
- `snapshot/OwnerSummary.tsx` - Main summary section
- `snapshot/TopFindings.tsx` - Top 3 findings
- `snapshot/Assumptions.tsx` - What we assumed
- `snapshot/Questions.tsx` - Owner-level questions
- `snapshot/DetailCard.tsx` - 6 block detail cards
- `snapshot/UpgradeBanner.tsx` - "Create account" CTA

**Status**: ⏳ Not started

---

## Data Flow (End-to-End)

```
1. User submits domain on homepage
   ↓
2. POST /api/snapshot/request
   - Rate limit check
   - Create snapshot (status=pending)
   ↓
3. Background job triggered
   - Collect signals (6 modules, parallel)
   - Save signals to DB (status=processing)
   ↓
4. LLM generation (3 calls)
   - Block narratives
   - Synthesis (summary + findings + assumptions + questions)
   - Email summary
   ↓
5. Save report to DB (status=completed)
   ↓
6. Send email (Brevo)
   - Template: Snapshot Complete
   - Magic link: /snapshot/[id]?token=JWT
   - UTM tracking
   ↓
7. User clicks link → Views report
   - JWT validates access
   - Report rendered from DB
   - Umami tracks page view
   ↓
8. User creates account (CTA)
   - Supabase Auth magic link
   - Link snapshot to user_id
   - Welcome email sent
```

---

## Rate Limiting

**Free Tier** (Tier 1):
- 1 snapshot per domain per 30 days
- Anonymous (email-based) or authenticated (user-based)

**Implementation**:
- Hash email/domain for privacy (SHA-256)
- Check `rate_limits` table before creating snapshot
- Block if within rate limit period
- Return "next allowed" timestamp

**Future Tiers**:
- Pro: 5/week per domain
- Team: Unlimited (org-wide)

---

## Authentication

**Tier 1** (Magic Links):
- JWT-based temporary access (48-hour expiry)
- No account required for first snapshot
- Magic link in email grants report access

**Tier 2+** (Full Auth):
- Supabase Auth (email/password, OAuth)
- User accounts with dashboards
- Organizations & team access
- The database is already designed for this (nullable `user_id`, `organization_id`)

---

## Monitoring & Analytics

**Umami** (Privacy-focused):
- Page views, button clicks
- Email tracking (UTM parameters)
- Conversion funnels (request → email → view → signup)

**Brevo Webhook**:
- Email opens, clicks, bounces
- Update Umami server-side on email events

**Database Metrics**:
- `snapshots.generation_duration_seconds` - LLM performance
- `rate_limits.run_count` - Usage patterns

---

## Error Handling Philosophy

**Graceful Degradation**:
- Signal collection: If one module fails, others continue
- LLM: If generation fails, use static fallback templates
- Email: If delivery fails, log error but don't block report access

**Never Block Users**:
- Always return a result (even if partial)
- Clear error messages for users
- Detailed logs for debugging

---

## Cost Structure (Estimated)

**Per Snapshot**:
- LLM (Claude 3.5 Haiku): $0.025-0.035
- HIBP API (amortized): ~$0.001
- Supabase (free tier): $0
- Brevo (free tier): $0
- Umami (self-hosted): $0

**Total**: ~$0.03 per snapshot

**Target Scale** (Free Tier 1):
- 100-500 snapshots/month
- Monthly cost: $3-15

---

**Last Updated**: January 28, 2026
