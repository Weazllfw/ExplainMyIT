# Source of Truth Documentation

**Purpose**: Cast-iron technical reference for Explain My IT Tier 1 implementation.

This directory contains minimal, focused documentation explaining exactly how each part works. These are living documents that get updated as we build.

---

## Documents

### System Architecture
- **[Tier1-System-Architecture.md](./Tier1-System-Architecture.md)** - Complete system overview: data flow, components, rate limiting, auth, costs

### Signal Collection
- **[Signal-Collection-Architecture.md](./Signal-Collection-Architecture.md)** - How signal modules work, module-by-module reference with test results

### LLM Integration
- **[LLM-Integration-Architecture.md](./LLM-Integration-Architecture.md)** - Report generation with Claude 4.5 Haiku, 3-call architecture, prompt design, cost structure

### Frontend
- **[Frontend-Report-Architecture.md](./Frontend-Report-Architecture.md)** - Report view page, display components, authentication flow, responsive design
- **[Homepage-Architecture.md](./Homepage-Architecture.md)** - Homepage snapshot request form, user flow, CTAs, conversion funnel

---

## Current Implementation Status

**Phase 1: Foundation** - ✅ COMPLETE (Week 1)
- ✅ Database (4 tables: users, snapshots, rate_limits, hibp_cache)
- ✅ DNS Signal Module (domain age, registrar, nameservers)
- ✅ Email Auth Signal Module (SPF, DKIM, DMARC)
- ✅ TLS/SSL Signal Module (HTTPS, certificate, TLS versions)

**Phase 2: Remaining Signals** - ✅ COMPLETE
- ✅ Tech Stack Module (CMS, CDN, hosting detection)
- ✅ Public Exposure Module (reverse DNS, infrastructure inference)
- ✅ HIBP Integration (breach checking via API)
- ✅ Signal Orchestrator (parallel execution in 0.25s!)

**Phase 3: LLM Integration** - ✅ COMPLETE
- ✅ Anthropic Claude 4.5 Haiku client
- ✅ Prompt implementation (3-call architecture for cost optimization)
- ✅ JSON validation & markdown fence stripping
- ✅ End-to-end generation (22s for complete report)

**Phase 4: API & Auth** - ✅ COMPLETE
- ✅ Snapshot request API (POST /api/snapshot)
- ✅ Magic link system (JWT with 30-day expiry)
- ✅ Rate limiting enforcement (1 per 30 days free tier)
- ✅ Access validation & token verification

**Phase 5: Email Integration** - ✅ COMPLETE
- ✅ Brevo API client (transactional emails)
- ✅ Snapshot report email (with magic link)
- ✅ Welcome email (account creation)
- ✅ Webhook handler (email engagement tracking)

**Phase 6: Frontend** - ✅ COMPLETE
- ✅ Report page (`/report/[id]`)
- ✅ 7 display components (owner summary, findings, blocks, etc.)
- ✅ Magic link authentication
- ✅ Error handling & loading states
- ✅ Mobile-responsive design

**Phase 7-8: Testing & Deployment** - Not Started

---

## Documentation Philosophy

1. **Minimal**: Only what's needed to understand how it works
2. **Technical**: Implementation details, not marketing
3. **Current**: Updated as we build, not after
4. **Reference**: Quick lookup, not tutorials

---

## How to Use These Docs

**When building**: Update relevant doc as you implement each module

**When debugging**: Reference to understand current implementation

**When planning**: See what's done and what's next

**When onboarding**: Read system architecture, then dive into specific components

---

**Last Updated**: January 29, 2026
