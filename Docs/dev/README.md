# Tier 1 Development Documentation

**Explain My IT - Tier 1 (Free Public Snapshot)**  
**Status**: Planning Complete - Ready to Build  
**Last Updated**: January 28, 2026

---

## 📚 Documentation Index

### Core Documents

| Document | Purpose | Status |
|----------|---------|--------|
| **[Tier1.txt](./Tier1.txt)** | Product specification (locked) | ✅ Complete |
| **[Tier1-Implementation-Plan.md](./Tier1-Implementation-Plan.md)** | 8-week implementation plan (90+ tasks) | ✅ Complete |
| **[Implementation-Status.md](./Implementation-Status.md)** | Progress tracker | ✅ Complete |

### Subsystem Specifications

| Document | Purpose | Status |
|----------|---------|--------|
| **[Database-Schema.md](./Database-Schema.md)** | Extensible database schema (Tier 1 + Tier 2-ready) | ✅ Complete |
| **[Database-Evolution-Visual.md](./Database-Evolution-Visual.md)** | Visual guide to database extensibility | ✅ Complete |
| **[LLM-Prompts-Tier1.md](./LLM-Prompts-Tier1.md)** | Production LLM prompts (5 templates) | ✅ Locked |
| **[System-Emails-Spec.md](./System-Emails-Spec.md)** | Complete email system specification | ✅ Complete |
| **[Email-Quick-Reference.md](./Email-Quick-Reference.md)** | Email implementation quick reference | ✅ Complete |
| **[Email-Workflow-Diagram.md](./Email-Workflow-Diagram.md)** | Visual email workflow diagrams | ✅ Complete |

---

## 🚀 Quick Start

### New to This Project?

1. **Read**: `Tier1.txt` (product spec)
2. **Review**: `Tier1-Implementation-Plan.md` (implementation strategy)
3. **Start Building**: Phase 1, Task 1.1 (Database Setup)

### Need Specific Info?

**Database Schema**:
- See: `Database-Schema.md`
- Tier 1: 4 tables (simple, fast)
- Tier 2-ready: 10 additional tables (add later, zero breaking changes)

**LLM Integration**:
- See: `LLM-Prompts-Tier1.md`
- 5 production-ready prompts with strict JSON output

**Email System**:
- See: `System-Emails-Spec.md` (detailed)
- See: `Email-Quick-Reference.md` (quick lookup)
- See: `Email-Workflow-Diagram.md` (visual flow)

**Progress Tracking**:
- See: `Implementation-Status.md`

---

## 📋 What We're Building

### Product Summary

**Tier 1** is a free IT snapshot tool that:
- Lets users check any domain without signup
- Generates a plain-English IT report in 30-60s
- Emails results with a magic link
- Converts users to free accounts to save reports

### Technical Architecture

```
User Input (domain + email)
    ↓
6 Signal Blocks (DNS, Email, TLS, Tech, Exposure, HIBP)
    ↓
LLM Narratives (5 sections via Claude Haiku)
    ↓
Email Report (Brevo) + Magic Link Dashboard
    ↓
Account Creation (Supabase Auth)
    ↓
User Dashboard (saved reports)
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (magic links)
- **Email**: Brevo
- **LLM**: Claude 3.5 Haiku (Anthropic)
- **Analytics**: Umami
- **Hosting**: Vercel

### Database Design Philosophy

**Tier 1**: 4 simple tables
- `users`, `snapshots`, `rate_limits`, `hibp_cache`
- Fast setup, low complexity

**Tier 2-Ready**:
- JSONB for signals/reports (add new blocks without migration)
- Nullable foreign keys (support anonymous → authenticated)
- Extensible schema (10 more tables when needed)
- **Zero breaking changes for Tier 1 users**

See: `Database-Schema.md` for complete details

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Week 1)
- Database setup
- First 3 signal modules (DNS, Email Auth, TLS)

### Phase 2: Remaining Signals (Week 2)
- Tech stack detection
- Public exposure checks
- HIBP integration
- Signal orchestrator

### Phase 3: LLM Integration (Week 3)
- Anthropic API setup
- 5 prompt implementations
- Narrative generation
- Fallback handling

### Phase 4: API & Auth (Week 4)
- Rate limiting
- Magic link system
- Snapshot request API
- Background processing
- Supabase Auth setup

### Phase 5: Email Integration (Week 5)
- Email templates (3 types)
- Brevo integration
- Email triggers
- Webhook handler
- Umami tracking

### Phase 6: Dashboard UI (Week 5-6)
- Report display components
- Upgrade banner
- Account creation flow
- User dashboard

### Phase 7: Analytics & Polish (Week 6)
- Complete analytics integration
- Error handling
- Performance optimization
- Testing & QA

### Phase 8: Production Launch (Week 7-8)
- Production setup
- Security audit
- Soft launch
- Monitoring
- Public launch

**Total Timeline**: 8 weeks

---

## 📧 Email System Overview

### 3 System Emails

1. **Snapshot Complete** (P0 - Critical)
   - Trigger: Snapshot generation complete
   - Contains: LLM summary + magic link
   - Goal: Drive dashboard views

2. **Welcome** (P0 - Critical)
   - Trigger: User creates account
   - Contains: Dashboard link + saved reports
   - Goal: Activate new users

3. **Report Expiring** (P2 - Optional v1.0)
   - Trigger: T+46 hours (2h before expiry)
   - Contains: Magic link + upgrade CTA
   - Goal: Increase account conversions

### Email Tracking

**Brevo**:
- Contact attributes (TOTAL_SNAPSHOTS, LAST_SNAPSHOT_DATE, etc.)
- Email events (opened, clicked, bounced)
- Webhooks to track engagement

**Umami**:
- UTM parameters on all links
- Server-side: email-sent events
- Client-side: email-clicked events
- Conversion attribution

### Conversion Funnel

```
Email Sent (100%)
    ↓ 50% open rate
Email Opened (500/1000)
    ↓ 70% click rate
Dashboard Viewed (350/1000)
    ↓ 10% banner engagement
Upgrade Clicked (35/1000)
    ↓ 50% completion
Account Created (17/1000)

Target: >3% email-to-account conversion
```

---

## 💰 Cost Estimates

### Per Report
- DNS/TLS/Tech checks: $0.00
- HIBP API: $0.0004
- LLM (Claude Haiku): $0.10
- Email delivery: $0.001
- **Total**: ~$0.10

### Monthly (1,000 reports)
- Anthropic API: $100
- HIBP API: $3.50
- Brevo: $0 (free tier: 9,000 emails/month)
- Supabase: $0 (free tier)
- Vercel: $0 (free tier)
- **Total**: ~$103.50/month

**Sustainable on free tiers up to 1,000 reports/month**

---

## 🎯 Success Metrics

### Technical
- Snapshot generation: <60s
- Email delivery: >95%
- Error rate: <5%
- Dashboard load: <3s

### Business (Month 1)
- Snapshots: 100
- Email open rate: >40%
- Magic link clicks: >60%
- Account creation: >5%

### Quality
- User sentiment: Not "confused" or "scared"
- False positive rate: <10%
- LLM output quality: Manual review 10/week

---

## 🔐 Environment Setup

### Required Accounts

- [ ] **Supabase** (need to create project)
- [ ] **Anthropic API** (need to sign up)
- [ ] **HIBP API** (need to sign up - $3.50/month)
- [x] **Brevo** (already configured)
- [x] **Umami** (already configured)
- [x] **Vercel** (already configured)

### Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# LLM
ANTHROPIC_API_KEY=

# Email (Brevo)
BREVO_API_KEY=
BREVO_TEMPLATE_SNAPSHOT_COMPLETE=1
BREVO_TEMPLATE_ACCOUNT_WELCOME=2
BREVO_TEMPLATE_REPORT_EXPIRING=3
SYSTEM_EMAIL_FROM=reports@explainmyit.com
SYSTEM_EMAIL_REPLY_TO=hello@explainmyit.com

# Webhook Security
BREVO_WEBHOOK_SECRET=

# Auth
JWT_SECRET=
NEXT_PUBLIC_URL=http://localhost:3000

# External APIs
HIBP_API_KEY=

# Analytics (already configured)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SRC=
```

---

## 📁 Project Structure

```
d:\Projects\ExplainMyIT\
├── app/
│   ├── api/
│   │   ├── request-snapshot/route.ts       # Snapshot request
│   │   ├── snapshot/[token]/route.ts       # Get snapshot
│   │   ├── auth/
│   │   │   ├── claim-report/route.ts       # Link report to account
│   │   │   └── callback/route.ts           # Supabase callback
│   │   ├── webhooks/brevo/route.ts         # Email events
│   │   └── cron/
│   │       ├── generate-snapshot/route.ts  # Background job
│   │       └── expiry-reminders/route.ts   # Optional reminders
│   ├── snapshot/[token]/page.tsx           # Dashboard preview
│   ├── dashboard/page.tsx                  # User dashboard
│   └── auth/callback/page.tsx              # Auth handler
├── lib/
│   ├── db/
│   │   ├── client.ts                       # Supabase client
│   │   ├── schema.sql                      # Database schema
│   │   ├── snapshots.ts                    # Snapshot queries
│   │   ├── users.ts                        # User queries
│   │   ├── rate-limits.ts                  # Rate limiting
│   │   └── cache.ts                        # HIBP cache
│   ├── signals/
│   │   ├── dns.ts                          # Block A
│   │   ├── email.ts                        # Block B
│   │   ├── tls.ts                          # Block C
│   │   ├── techstack.ts                    # Block D
│   │   ├── exposure.ts                     # Block E
│   │   ├── hibp.ts                         # Block F
│   │   ├── orchestrator.ts                 # Run all blocks
│   │   └── flags.ts                        # Cross-block flags
│   ├── llm/
│   │   ├── client.ts                       # Anthropic wrapper
│   │   ├── prompts.ts                      # 5 prompts
│   │   ├── generator.ts                    # Orchestrate LLM
│   │   ├── validator.ts                    # JSON validation
│   │   └── fallbacks.ts                    # Cached templates
│   ├── auth/
│   │   ├── magic-link.ts                   # JWT tokens
│   │   ├── supabase-client.ts              # Client auth
│   │   ├── supabase-server.ts              # Server auth
│   │   └── middleware.ts                   # Auth middleware
│   └── email/
│       ├── brevo.ts                        # Brevo client
│       ├── templates.ts                    # Email templates
│       ├── sender.ts                       # Send logic
│       └── utils.ts                        # UTM builder
├── components/
│   ├── snapshot/
│   │   ├── OwnerSummary.tsx
│   │   ├── TopFindings.tsx
│   │   ├── Assumptions.tsx
│   │   ├── Questions.tsx
│   │   ├── DetailCard.tsx
│   │   └── UpgradeBanner.tsx
│   └── auth/
│       ├── SignUpModal.tsx
│       └── AuthButton.tsx
└── Docs/dev/
    ├── Tier1.txt                           # Product spec
    ├── Tier1-Implementation-Plan.md        # Implementation plan
    ├── LLM-Prompts-Tier1.md               # LLM prompts
    ├── System-Emails-Spec.md              # Email spec
    ├── Email-Quick-Reference.md           # Email quick ref
    ├── Email-Workflow-Diagram.md          # Email diagrams
    ├── Implementation-Status.md           # Progress tracker
    └── README.md                          # This file
```

---

## ✅ Definition of Done

Tier 1 is **complete** when:

**Functional**:
- [ ] User can request snapshot (any domain)
- [ ] Snapshot generates in <60s
- [ ] User receives email with summary + magic link
- [ ] User can view full report via link
- [ ] User can create account from report
- [ ] Report saves to account
- [ ] User can view saved reports in dashboard
- [ ] Rate limiting works (1 per domain per 30 days)

**Quality**:
- [ ] All critical tests passing
- [ ] No P0/P1 bugs
- [ ] Error rate <5%
- [ ] Email delivery >95%
- [ ] Mobile responsive
- [ ] Cross-browser compatible

**Non-Functional**:
- [ ] Security audit complete
- [ ] Documentation complete
- [ ] Monitoring in place
- [ ] Analytics tracking working
- [ ] Production environment stable

---

## 🚦 Current Status

**Planning**: ✅ Complete  
**Implementation**: Not Started (0%)  
**Testing**: Not Started  
**Deployment**: Not Started

**Next Step**: Phase 1, Task 1.1 (Database Setup)

---

## 📞 Quick Links

### Documentation
- [Product Spec](./Tier1.txt)
- [Implementation Plan](./Tier1-Implementation-Plan.md)
- [Progress Tracker](./Implementation-Status.md)

### Database Design
- [Database Schema](./Database-Schema.md)
- [Database Evolution Visual](./Database-Evolution-Visual.md)

### Email System
- [Email Specification](./System-Emails-Spec.md)
- [Email Quick Reference](./Email-Quick-Reference.md)
- [Email Workflow Diagrams](./Email-Workflow-Diagram.md)

### LLM Integration
- [LLM Prompts](./LLM-Prompts-Tier1.md)

---

## 🎬 Getting Started

### Today
1. Create Supabase project
2. Run database schema setup
3. Set up Supabase client
4. Create first signal module (DNS)
5. Test with real domain

### This Week
- Complete all 6 signal modules
- Test signal orchestrator
- Set up Anthropic API
- Test LLM generation

### Next Week
- Continue with Phase 3 (LLM Integration)
- Follow implementation plan phase-by-phase

---

**All planning complete. Ready to build. 🚀**
