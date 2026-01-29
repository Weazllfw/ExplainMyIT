# Tier 1 Implementation Plan - Complete

**Product**: Explain My IT - Tier 1 (Free Public Snapshot)  
**Version**: 1.0  
**Status**: Ready to Build  
**Estimated Timeline**: 6-8 weeks  
**Created**: January 28, 2026

---

## Executive Summary

This document is the complete implementation plan for Tier 1. It includes:
- ✅ Task breakdown (90+ tasks)
- ✅ File structure (complete architecture)
- ✅ Implementation order (phase-by-phase)
- ✅ Acceptance criteria (testable outcomes)
- ✅ Dependencies (what blocks what)

**Goal**: Build a production-ready free IT snapshot tool that converts users to paid tiers.

---

## Product Requirements (Locked)

### User Journey

```
1. User enters domain + email → No signup required
2. System generates snapshot (30-60s)
3. Email sent with:
   - Plain text summary
   - Magic link to full dashboard
4. User clicks link → Views full report
5. Banner: "Create free account to save this report"
6. User creates account → Report saved
7. Can now run more snapshots (rate limited)
```

### Core Features

**Must Have**:
- 6 signal blocks (DNS, Email, TLS, Tech Stack, Exposure, HIBP)
- LLM-generated narratives (5 sections)
- Magic link access (48-hour expiry)
- Email report summary
- Dashboard preview
- Account upgrade flow
- Rate limiting (1 per domain per email per 30 days)

**Nice to Have** (v1.1):
- Email reminder (24h before expiry)
- Social sharing
- PDF export

---

## Tech Stack (Locked)

| Component | Technology | Reasoning |
|-----------|-----------|-----------|
| Framework | Next.js 14 (App Router) | Already in use |
| Database | Supabase PostgreSQL | Auth-ready, real-time, generous free tier |
| Auth | Supabase Auth (magic links) | Passwordless, built-in |
| Email | Brevo | Already integrated |
| LLM | Claude 3.5 Haiku | Cost-optimized (~$0.10/report) |
| Analytics | Umami | Already integrated |
| Hosting | Vercel | Already in use |

---

## Project Structure (Complete)

```
d:\Projects\ExplainMyIT\
├── app/
│   ├── api/
│   │   ├── request-snapshot/
│   │   │   └── route.ts           # Initial snapshot request
│   │   ├── snapshot/
│   │   │   └── [token]/
│   │   │       └── route.ts       # Get snapshot by token
│   │   ├── auth/
│   │   │   ├── claim-report/
│   │   │   │   └── route.ts       # Link report to account
│   │   │   └── callback/
│   │   │       └── route.ts       # Supabase auth callback
│   │   ├── webhooks/
│   │   │   └── brevo/
│   │   │       └── route.ts       # Brevo webhook handler
│   │   └── cron/
│   │       ├── generate-snapshot/
│   │       │   └── route.ts       # Background processing
│   │       └── expiry-reminders/
│   │           └── route.ts       # Send expiry emails (optional)
│   ├── snapshot/
│   │   └── [token]/
│   │       └── page.tsx           # Dashboard preview
│   ├── dashboard/
│   │   └── page.tsx               # User dashboard (auth required)
│   └── auth/
│       └── callback/
│           └── page.tsx           # Auth redirect handler
├── lib/
│   ├── db/
│   │   ├── client.ts              # Supabase client
│   │   ├── schema.sql             # Database schema
│   │   ├── snapshots.ts           # Snapshot queries
│   │   ├── users.ts               # User queries
│   │   ├── rate-limits.ts         # Rate limiting logic
│   │   └── cache.ts               # HIBP caching
│   ├── signals/
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── dns.ts                 # Block A: DNS checks
│   │   ├── email.ts               # Block B: Email auth
│   │   ├── tls.ts                 # Block C: TLS/SSL
│   │   ├── techstack.ts           # Block D: Website tech
│   │   ├── exposure.ts            # Block E: Public exposure
│   │   ├── hibp.ts                # Block F: HIBP integration
│   │   ├── orchestrator.ts        # Run all blocks in parallel
│   │   └── flags.ts               # Compute cross-block flags
│   ├── llm/
│   │   ├── client.ts              # Anthropic API wrapper
│   │   ├── prompts.ts             # All 5 prompts
│   │   ├── generator.ts           # Orchestrate LLM calls
│   │   ├── validator.ts           # JSON validation
│   │   └── fallbacks.ts           # Cached templates
│   ├── auth/
│   │   ├── magic-link.ts          # JWT token generation
│   │   ├── supabase-client.ts     # Client-side Supabase
│   │   ├── supabase-server.ts     # Server-side Supabase
│   │   └── middleware.ts          # Auth middleware
│   ├── email/
│   │   ├── brevo.ts               # Brevo API client (extend existing)
│   │   ├── templates.ts           # System email templates
│   │   ├── sender.ts              # Email sender + Brevo integration
│   │   └── utils.ts               # UTM builder, email validation
│   └── utils/
│       ├── hash.ts                # Hashing utilities
│       ├── validation.ts          # Input validation
│       └── errors.ts              # Error classes
├── components/
│   ├── snapshot/
│   │   ├── OwnerSummary.tsx       # Summary section
│   │   ├── TopFindings.tsx        # Top 3 findings
│   │   ├── Assumptions.tsx        # Assumptions section
│   │   ├── Questions.tsx          # Questions section
│   │   ├── DetailCard.tsx         # Block detail cards
│   │   └── UpgradeBanner.tsx      # Account creation CTA
│   ├── auth/
│   │   ├── SignUpModal.tsx        # Account creation modal
│   │   └── AuthButton.tsx         # Login/Signup button
│   └── ui/
│       ├── LoadingSpinner.tsx     # Loading states
│       └── ErrorMessage.tsx       # Error display
├── types/
│   ├── snapshot.ts                # Snapshot types
│   ├── signals.ts                 # Signal block types
│   ├── llm.ts                     # LLM output types
│   └── database.ts                # Supabase types
├── scripts/
│   ├── test-signals.ts            # Test signal collection
│   ├── test-llm.ts                # Test LLM generation
│   ├── test-full-flow.ts          # End-to-end test
│   └── setup-db.ts                # Database setup script
└── Docs/dev/
    ├── Tier1.txt                  # Product spec (locked)
    ├── LLM-Prompts-Tier1.md      # Prompt library (locked)
    └── Tier1-Implementation-Plan.md  # This file
```

---

## Phase-by-Phase Implementation

### Phase 1: Foundation (Week 1)

**Goal**: Database + basic signal collection working

#### Tasks

**1.1 Database Setup** (Day 1)
- [ ] Create Supabase project
- [ ] Run Tier 1 schema SQL (4 tables only)
  - [ ] `users` - User accounts
  - [ ] `snapshots` - All snapshot data
  - [ ] `rate_limits` - Usage controls
  - [ ] `hibp_cache` - API cache
- [ ] Set up Row Level Security (basic)
- [ ] Test connection from Next.js
- [ ] Add Supabase env vars

**Reference**: See `Docs/dev/Database-Schema.md` for complete schema (Tier 1 + Tier 2-ready)

**Files to create**:
- `lib/db/schema.sql` (Tier 1 only - 4 tables)
- `lib/db/client.ts` (Supabase connection)
- `scripts/setup-db.ts` (Setup script)

**Schema Design Principles**:
- ✅ Extensible: Add Tier 2 tables later without breaking changes
- ✅ JSONB: Flexible signal/report storage (add new blocks without migration)
- ✅ Nullable fields: Support anonymous → authenticated transition
- ✅ Soft deletes: Data retention with `deleted_at`
- ✅ Audit timestamps: Track creation, updates, completion

**Acceptance criteria**:
- Can connect to Supabase from Next.js
- All 4 Tier 1 tables created with correct schema
- Can insert/query test data
- RLS policies working
- Indexes created for performance

**1.2 DNS Signal Module** (Day 2-3)
- [ ] Install DNS libraries (`dns-packet`, `whois-json`)
- [ ] Create DNS check function
- [ ] Implement domain age check
- [ ] Implement registrar detection
- [ ] Implement nameserver checks
- [ ] Implement A/AAAA/MX record checks
- [ ] Compute confidence flags
- [ ] Write unit tests

**Files to create**:
- `lib/signals/types.ts`
- `lib/signals/dns.ts`
- `scripts/test-signals.ts`

**Acceptance criteria**:
- `checkDNS('example.com')` returns valid BlockResult
- Handles errors gracefully (NXDOMAIN, timeout)
- Unit tests pass

**1.3 Email Auth Signal Module** (Day 3-4)
- [ ] Install DNS query library
- [ ] Create SPF check function
- [ ] Create DKIM check function
- [ ] Create DMARC check function
- [ ] Compute email_spoofing_possible flag
- [ ] Write unit tests

**Files to create**:
- `lib/signals/email.ts`

**Acceptance criteria**:
- Correctly identifies SPF/DKIM/DMARC presence
- Returns high confidence for all checks
- Handles missing records gracefully

**1.4 TLS/SSL Signal Module** (Day 4-5)
- [ ] Install TLS libraries (`tls`, `https`)
- [ ] Create certificate check function
- [ ] Check HTTPS enforcement
- [ ] Check certificate expiry
- [ ] Check TLS versions
- [ ] Compute ssl_expiring_soon flag
- [ ] Write unit tests

**Files to create**:
- `lib/signals/tls.ts`

**Acceptance criteria**:
- Correctly checks certificate validity
- Handles non-HTTPS sites
- Handles timeout/connection errors

---

### Phase 2: Remaining Signals (Week 2)

**Goal**: All 6 signal blocks working

**2.1 Tech Stack Detection** (Day 6-7)
- [ ] Install `wappalyzer` or similar
- [ ] Detect CMS (WordPress, etc.)
- [ ] Detect CDN presence
- [ ] Infer hosting provider
- [ ] Parse server headers
- [ ] Compute cms_common_target flag
- [ ] Write unit tests

**Files to create**:
- `lib/signals/techstack.ts`

**Acceptance criteria**:
- Correctly identifies WordPress sites
- Detects Cloudflare, etc.
- Returns medium confidence

**2.2 Public Exposure Module** (Day 7-8)
- [ ] Implement reverse DNS lookup
- [ ] Implement IP geolocation
- [ ] Infer infrastructure type
- [ ] Compute exposure flags
- [ ] Write disclaimer text
- [ ] Write unit tests

**Files to create**:
- `lib/signals/exposure.ts`

**Acceptance criteria**:
- Returns low confidence
- Never mentions "ports" or "scanning"
- Handles DNS failures

**2.3 HIBP Integration** (Day 8-9)
- [ ] Sign up for HIBP API
- [ ] Create HIBP client
- [ ] Implement domain breach check
- [ ] Implement caching (30 days)
- [ ] Handle API rate limits
- [ ] Write unit tests

**Files to create**:
- `lib/signals/hibp.ts`
- `lib/db/cache.ts`

**Acceptance criteria**:
- Correctly checks domain breaches
- Caches results for 30 days
- Handles API downtime gracefully

**2.4 Signal Orchestrator** (Day 9-10)
- [ ] Create orchestrator to run all blocks
- [ ] Run blocks in parallel
- [ ] Handle partial failures
- [ ] Compute cross-block flags
- [ ] Return complete signal set
- [ ] Write integration tests

**Files to create**:
- `lib/signals/orchestrator.ts`
- `lib/signals/flags.ts`

**Acceptance criteria**:
- All 6 blocks run in parallel
- Completes in <30 seconds
- Gracefully handles individual block failures
- Returns complete data structure

---

### Phase 3: LLM Integration (Week 3)

**Goal**: Narrative generation working

**3.1 Anthropic Client Setup** (Day 11)
- [ ] Sign up for Anthropic API
- [ ] Install `@anthropic-ai/sdk`
- [ ] Create API client wrapper
- [ ] Add retry logic
- [ ] Add timeout handling
- [ ] Write unit tests

**Files to create**:
- `lib/llm/client.ts`

**Acceptance criteria**:
- Can call Claude API successfully
- Handles rate limits
- Retries on transient failures

**3.2 Prompt Implementation** (Day 11-12)
- [ ] Copy all 5 prompts from `LLM-Prompts-Tier1.md`
- [ ] Create prompt template functions
- [ ] Add variable interpolation
- [ ] Add JSON validation
- [ ] Test each prompt independently

**Files to create**:
- `lib/llm/prompts.ts`
- `lib/llm/validator.ts`

**Acceptance criteria**:
- All 5 prompts defined as functions
- Variable substitution works
- Returns valid JSON

**3.3 LLM Generator** (Day 13-14)
- [ ] Create block narrative generator
- [ ] Create synthesis generator
- [ ] Create assumptions generator
- [ ] Create questions generator
- [ ] Create email summary generator
- [ ] Handle LLM failures (fallbacks)
- [ ] Write integration tests

**Files to create**:
- `lib/llm/generator.ts`
- `lib/llm/fallbacks.ts`

**Acceptance criteria**:
- All 5 LLM outputs generated
- Total time <30 seconds
- Handles API failures gracefully
- JSON parsing never fails

**3.4 End-to-End Test** (Day 14-15)
- [ ] Create full flow test script
- [ ] Test: Signals → LLM → Report
- [ ] Test with 5 real domains
- [ ] Validate output quality
- [ ] Refine prompts if needed

**Files to create**:
- `scripts/test-full-flow.ts`

**Acceptance criteria**:
- Complete report generated for test domains
- Tone is calm and factual
- Confidence levels enforced
- Finding codes present

---

### Phase 4: API & Auth (Week 4)

**Goal**: Request flow + magic links working

**4.1 Rate Limiting Logic** (Day 16-17)
- [ ] Create rate limit checker
- [ ] Implement 30-day window
- [ ] Handle email hash + domain hash
- [ ] Create cleanup job (old records)
- [ ] Write unit tests

**Files to create**:
- `lib/db/rate-limits.ts`

**Acceptance criteria**:
- Correctly prevents duplicate runs
- Allows re-run after 30 days
- Handles edge cases (same domain, different email)

**4.2 Magic Link System** (Day 17-18)
- [ ] Install `jose` (JWT library)
- [ ] Create token generation function
- [ ] Create token validation function
- [ ] Store token hash in database
- [ ] Handle token expiry (48 hours)
- [ ] Write unit tests

**Files to create**:
- `lib/auth/magic-link.ts`
- `lib/utils/hash.ts`

**Acceptance criteria**:
- Tokens are cryptographically secure
- Validation works correctly
- Expired tokens rejected

**4.3 Snapshot Request API** (Day 18-19)
- [ ] Create POST `/api/request-snapshot`
- [ ] Validate domain + email input
- [ ] Check rate limits
- [ ] Create snapshot record (pending)
- [ ] Trigger background processing
- [ ] Return success response
- [ ] Write API tests

**Files to create**:
- `app/api/request-snapshot/route.ts`
- `lib/utils/validation.ts`
- `lib/db/snapshots.ts`

**Acceptance criteria**:
- Valid requests accepted
- Invalid domains rejected
- Rate limits enforced
- Database record created

**4.4 Background Processing** (Day 19-20)
- [ ] Create background job handler
- [ ] Run signal collection
- [ ] Run LLM generation
- [ ] Save results to database
- [ ] Update snapshot status
- [ ] Handle processing failures
- [ ] Write integration tests

**Files to create**:
- `app/api/cron/generate-snapshot/route.ts`

**Acceptance criteria**:
- Snapshot completes in 30-60 seconds
- Results saved correctly
- Errors logged but don't crash

**4.5 Supabase Auth Setup** (Day 20-21)
- [ ] Enable Supabase Auth
- [ ] Configure magic link auth
- [ ] Create auth callback handler
- [ ] Set up client-side auth
- [ ] Set up server-side auth
- [ ] Create auth middleware
- [ ] Write auth tests

**Files to create**:
- `lib/auth/supabase-client.ts`
- `lib/auth/supabase-server.ts`
- `lib/auth/middleware.ts`
- `app/auth/callback/page.tsx`
- `app/api/auth/callback/route.ts`

**Acceptance criteria**:
- Users can sign up with magic link
- Users can log in
- Sessions persist
- Protected routes work

---

### Phase 5: Email Integration (Week 5)

**Goal**: Email reports + magic links sent

**Reference**: See `Docs/dev/System-Emails-Spec.md` for complete email specifications

**5.1 Email Templates** (Day 22-23)
- [ ] Create `lib/email/templates.ts`
  - [ ] snapshotCompleteEmail() with LLM summary
  - [ ] accountWelcomeEmail() with report count
  - [ ] reportExpiringEmail() (optional)
  - [ ] Include UTM parameters in all links
- [ ] Set up Brevo templates in dashboard
  - [ ] Template 1: Snapshot Complete (P0)
  - [ ] Template 2: Account Welcome (P0)
  - [ ] Template 3: Report Expiring (P2)
- [ ] Test email rendering
  - [ ] Gmail, Outlook, Apple Mail
  - [ ] Mobile clients
  - [ ] Plain text formatting

**Files to create**:
- `lib/email/templates.ts`
- `lib/email/utils.ts` (UTM builder)

**Acceptance criteria**:
- Emails render correctly in all clients
- Plain text formatting professional
- All links work with UTM tracking
- Mobile responsive

**5.2 Email Sender Logic** (Day 23-24)
- [ ] Create `lib/email/sender.ts`
  - [ ] sendSnapshotComplete() → Triggers after LLM generation
  - [ ] sendAccountWelcome() → Triggers after Supabase signup
  - [ ] sendReportExpiring() → Triggers via cron (optional)
  - [ ] Error handling & retry logic (3 attempts)
- [ ] Update Brevo contact attributes
  - [ ] Add: ACCOUNT_CREATED, USER_TIER, TOTAL_SNAPSHOTS
  - [ ] Add: LAST_SNAPSHOT_DATE, LAST_SNAPSHOT_DOMAIN
  - [ ] Update on each email send
- [ ] Handle send failures gracefully
- [ ] Write unit tests

**Files to create**:
- `lib/email/sender.ts`

**Acceptance criteria**:
- Emails send successfully via Brevo API
- Brevo contact attributes update correctly
- Failures handled without crashing
- Retry logic works (3 attempts)

**5.3 Email Triggers** (Day 24-25)
- [ ] Snapshot completion trigger
  - [ ] In `app/api/cron/generate-snapshot/route.ts`
  - [ ] After LLM generation complete
  - [ ] Pass email summary from LLM Prompt 5
  - [ ] Include magic link with UTM parameters
- [ ] Account creation trigger
  - [ ] In `app/api/auth/callback/route.ts`
  - [ ] After Supabase signup complete
  - [ ] Fetch user's report count + domain list
  - [ ] Send welcome email immediately
- [ ] Expiry reminder trigger (optional)
  - [ ] Create `app/api/cron/expiry-reminders/route.ts`
  - [ ] Vercel cron: runs every hour
  - [ ] Query: snapshots expiring in 2 hours
  - [ ] Only send if ACCOUNT_CREATED = false
- [ ] Write integration tests

**Files to create**:
- `app/api/cron/expiry-reminders/route.ts` (optional)

**Acceptance criteria**:
- Email sent within 90s of snapshot completion
- Welcome email sent immediately after signup
- Expiry email sent exactly 2h before expiry
- All tracking events fire correctly

**5.4 Brevo Webhook Handler** (Day 25)
- [ ] Create `app/api/webhooks/brevo/route.ts`
  - [ ] Verify webhook signature (security)
  - [ ] Handle `email.opened` event
  - [ ] Handle `email.clicked` event
  - [ ] Handle `email.bounced` event
  - [ ] Track events in Umami (server-side)
  - [ ] Update Supabase if email bounced
- [ ] Configure webhook in Brevo dashboard
  - [ ] URL: `https://explainmyit.com/api/webhooks/brevo`
  - [ ] Events: opened, clicked, bounced, spam
- [ ] Write webhook tests

**Files to create**:
- `app/api/webhooks/brevo/route.ts`

**Acceptance criteria**:
- Webhook signature validation works
- Email open events tracked in Umami
- Email click events tracked in Umami
- Bounced emails flagged in database

**5.5 Umami Analytics Integration** (Day 25-26)
- [ ] Add UTM parameters to all email links
  - [ ] Magic link: `?utm_source=email&utm_medium=snapshot-complete&utm_campaign=tier1-conversion&utm_content=magic-link`
  - [ ] Dashboard: `?utm_source=email&utm_medium=welcome&utm_campaign=engagement&utm_content=dashboard-link`
  - [ ] Upgrade CTA: `?utm_source=email&utm_medium={email_type}&utm_campaign=conversion&utm_content=upgrade`
- [ ] Track server-side events (via `lib/analytics.ts`)
  - [ ] `email-snapshot-complete-sent`
  - [ ] `email-welcome-sent`
  - [ ] `email-expiring-sent`
- [ ] Track client-side events (via UTM → Umami)
  - [ ] `email-magic-link-clicked`
  - [ ] `upgrade-banner-clicked` (with utm_source)
- [ ] Track Brevo webhook events
  - [ ] `email-{template}-opened`
  - [ ] `email-{template}-clicked`
- [ ] Create Umami dashboard queries
  - [ ] Email performance by type
  - [ ] Conversion funnel: Email → Dashboard → Signup
  - [ ] Attribution: Signups by email type

**Acceptance criteria**:
- All email links have UTM parameters
- Conversion funnel visible in Umami
- Can attribute signups to specific emails
- No PII in event data

**5.6 End-to-End Email Testing** (Day 26-27)
- [ ] Test full email flow
  - [ ] Request snapshot → Email received
  - [ ] Click magic link → Dashboard loads
  - [ ] Create account → Welcome email received
  - [ ] Wait 46h → Expiry email received (if no account)
- [ ] Test email deliverability
  - [ ] Run spam score check (mail-tester.com)
  - [ ] Test in Gmail, Outlook, Yahoo, ProtonMail
  - [ ] Verify links work in all clients
  - [ ] Check mobile rendering (iOS, Android)
- [ ] Test analytics tracking
  - [ ] Verify all events fire in Umami
  - [ ] Check UTM parameters appear in Umami
  - [ ] Confirm Brevo webhooks work
  - [ ] Validate conversion funnel data
- [ ] Test error scenarios
  - [ ] Brevo API failure (retry logic)
  - [ ] Invalid email address (bounce handling)
  - [ ] Webhook signature mismatch (reject)
  - [ ] Expired magic link (error page)

**Acceptance criteria**:
- All critical email paths tested
- Deliverability >95% (verified in Brevo)
- All tracking events validated
- Error handling works correctly

---

### Phase 6: Dashboard UI (Week 5-6)

**Goal**: Full report display + upgrade flow

**6.1 Dashboard Layout** (Day 26-27)
- [ ] Create snapshot page route
- [ ] Implement token validation
- [ ] Create layout structure
- [ ] Add loading states
- [ ] Add error states
- [ ] Test responsive design

**Files to create**:
- `app/snapshot/[token]/page.tsx`

**Acceptance criteria**:
- Valid tokens load report
- Invalid tokens show error
- Mobile responsive

**6.2 Report Components** (Day 27-29)
- [ ] Create OwnerSummary component
- [ ] Create TopFindings component
- [ ] Create Assumptions component
- [ ] Create Questions component
- [ ] Create DetailCard component
- [ ] Style all components
- [ ] Add animations/transitions

**Files to create**:
- `components/snapshot/OwnerSummary.tsx`
- `components/snapshot/TopFindings.tsx`
- `components/snapshot/Assumptions.tsx`
- `components/snapshot/Questions.tsx`
- `components/snapshot/DetailCard.tsx`

**Acceptance criteria**:
- All sections render correctly
- Data displays properly
- Confidence levels shown
- Mobile responsive

**6.3 Upgrade Banner** (Day 29-30)
- [ ] Create UpgradeBanner component
- [ ] Show expiry countdown
- [ ] Add "Create Account" CTA
- [ ] Implement modal/flow
- [ ] Track banner clicks (Umami)
- [ ] A/B test copy variations

**Files to create**:
- `components/snapshot/UpgradeBanner.tsx`
- `components/auth/SignUpModal.tsx`

**Acceptance criteria**:
- Banner shows for anonymous users
- Click opens signup flow
- Events tracked

**6.4 Account Creation Flow** (Day 30-31)
- [ ] Create signup modal
- [ ] Integrate Supabase Auth signup
- [ ] Handle email verification
- [ ] Implement report claiming
- [ ] Redirect to dashboard after signup
- [ ] Write flow tests

**Files to create**:
- `app/api/auth/claim-report/route.ts`
- `lib/db/users.ts`

**Acceptance criteria**:
- Users can create accounts
- Reports claimed automatically
- Redirect works correctly

**6.5 User Dashboard** (Day 31-32)
- [ ] Create /dashboard route (auth required)
- [ ] Display user's saved snapshots
- [ ] Show "Run New Snapshot" CTA
- [ ] Add sorting/filtering
- [ ] Test with multiple reports

**Files to create**:
- `app/dashboard/page.tsx`

**Acceptance criteria**:
- Only logged-in users can access
- Shows all user's reports
- Can navigate to individual reports

---

### Phase 7: Analytics & Polish (Week 6)

**Goal**: Tracking, monitoring, optimization

**7.1 Analytics Integration** (Day 33-34)
- [ ] Add Umami events for snapshot flow
- [ ] Track: request, generated, viewed, upgraded
- [ ] Track: banner clicks, signup starts, signups
- [ ] Track: email opens (via Brevo)
- [ ] Create analytics dashboard view
- [ ] Write tracking tests

**Events to track**:
```
- snapshot-requested (domain, email)
- snapshot-generated (duration, success)
- dashboard-viewed (token, anonymous/user)
- upgrade-banner-viewed
- upgrade-clicked
- signup-started
- signup-completed
- report-claimed
- email-opened (via Brevo webhook)
```

**Acceptance criteria**:
- All key events tracked
- Conversion funnel visible in Umami
- No PII in event data

**7.2 Error Handling & Monitoring** (Day 34-35)
- [ ] Add error boundaries
- [ ] Implement error logging (Sentry optional)
- [ ] Create error display components
- [ ] Add retry logic for transient failures
- [ ] Test error scenarios

**Files to create**:
- `lib/utils/errors.ts`
- `components/ui/ErrorMessage.tsx`

**Acceptance criteria**:
- User-friendly error messages
- Errors logged for debugging
- Retry works for API failures

**7.3 Performance Optimization** (Day 35-36)
- [ ] Optimize signal collection (parallel)
- [ ] Cache HIBP results (30 days)
- [ ] Optimize LLM calls (parallel where possible)
- [ ] Add loading indicators
- [ ] Optimize images/assets
- [ ] Test performance on slow connections

**Acceptance criteria**:
- Total generation time <60s
- Dashboard loads <3s
- Mobile performance good

**7.4 Testing & QA** (Day 36-37)
- [ ] Test full flow with 20 real domains
- [ ] Test rate limiting edge cases
- [ ] Test token expiry scenarios
- [ ] Test account upgrade flow
- [ ] Test email delivery
- [ ] Cross-browser testing
- [ ] Mobile testing

**Acceptance criteria**:
- All critical paths tested
- No blocking bugs
- Mobile works smoothly

**7.5 Documentation** (Day 37-38)
- [ ] Create user guide (how to run snapshot)
- [ ] Create API documentation
- [ ] Document environment variables
- [ ] Create deployment checklist
- [ ] Create troubleshooting guide

**Files to create**:
- `Docs/USER-GUIDE.md`
- `Docs/API-REFERENCE.md`
- `Docs/DEPLOYMENT.md`

**Acceptance criteria**:
- All docs complete
- Non-technical users can follow

---

### Phase 8: Production Launch (Week 7-8)

**Goal**: Deployed and monitored

**8.1 Production Setup** (Day 39-40)
- [ ] Set up production Supabase project
- [ ] Set up production Anthropic account
- [ ] Configure Vercel production env vars
- [ ] Set up custom domain (explainmyit.com)
- [ ] Configure Brevo production API key
- [ ] Test production email delivery

**Acceptance criteria**:
- All services configured
- Production environment works
- Emails deliver correctly

**8.2 Security Audit** (Day 40-41)
- [ ] Review authentication logic
- [ ] Test token security
- [ ] Review database permissions (RLS)
- [ ] Test rate limiting bypass attempts
- [ ] Check for XSS vulnerabilities
- [ ] Review env var security

**Acceptance criteria**:
- No critical security issues
- RLS policies correct
- Tokens secure

**8.3 Soft Launch** (Day 41-42)
- [ ] Deploy to production
- [ ] Run 10 test snapshots
- [ ] Monitor error rates
- [ ] Check email delivery rates
- [ ] Test upgrade flow live
- [ ] Monitor performance

**Acceptance criteria**:
- Everything works in production
- No critical errors
- Analytics tracking works

**8.4 Monitoring Setup** (Day 42-43)
- [ ] Set up Vercel monitoring
- [ ] Set up Supabase monitoring
- [ ] Create alert for high error rates
- [ ] Create alert for API failures
- [ ] Set up daily metrics email
- [ ] Create status dashboard

**Acceptance criteria**:
- Can monitor key metrics
- Alerts configured
- Know immediately if something breaks

**8.5 Launch** (Day 43-44)
- [ ] Update homepage with Tier 1 CTA
- [ ] Write launch blog post
- [ ] Announce on social media
- [ ] Post on relevant forums
- [ ] Email waitlist
- [ ] Monitor closely for 48 hours

**Acceptance criteria**:
- Tier 1 is live
- First real users successfully generate reports
- Conversion funnel works

---

## Testing Strategy

### Unit Tests

Test individual functions in isolation:
- Signal modules (DNS, Email, TLS, etc.)
- LLM prompt generation
- Rate limiting logic
- Token generation/validation
- Email template rendering

**Tools**: Vitest or Jest

### Integration Tests

Test modules working together:
- Full signal collection pipeline
- Signal → LLM → Report flow
- Auth → Claim → Dashboard flow
- Email sending pipeline

**Tools**: Playwright or Cypress

### End-to-End Tests

Test complete user journeys:
1. Request snapshot → Email → View report
2. View report → Create account → Dashboard
3. Rate limit enforcement
4. Token expiry handling

**Tools**: Playwright

### Manual Testing Checklist

- [ ] Test with 20 different domains
- [ ] Test mobile responsiveness
- [ ] Test email delivery (Gmail, Outlook, etc.)
- [ ] Test slow connections
- [ ] Test error scenarios (API down, timeout, etc.)
- [ ] Test cross-browser (Chrome, Firefox, Safari)

---

## Dependencies & Blockers

### Critical Path

```
Database Schema
    ↓
Signal Modules → LLM Integration → Background Processing
    ↓                                      ↓
Rate Limiting                    Email Integration
    ↓                                      ↓
Magic Links ←──────────────────────────────┘
    ↓
Dashboard UI
    ↓
Supabase Auth
    ↓
Account Upgrade Flow
    ↓
Launch
```

### External Dependencies

| Dependency | Purpose | Cost | Setup Time |
|------------|---------|------|------------|
| Supabase | Database + Auth | Free tier | 1 hour |
| Anthropic API | LLM generation | ~$0.10/report | 30 min |
| HIBP API | Breach data | $3.50/month | 30 min |
| Brevo | Email delivery | Already set up | N/A |
| Umami | Analytics | Already set up | N/A |
| Vercel | Hosting | Already set up | N/A |

### Risk Mitigation

**Risk 1: LLM costs too high**
- Mitigation: Use Claude Haiku (cheapest)
- Fallback: Cached templates if API down
- Budget: Cap at $100/month initially

**Risk 2: HIBP API rate limits**
- Mitigation: Cache results for 30 days
- Fallback: Skip Block F if API down

**Risk 3: Email deliverability**
- Mitigation: Use Brevo (high deliverability)
- Monitor: Bounce rates in Brevo dashboard
- Fallback: Use transactional email service

**Risk 4: Slow snapshot generation**
- Mitigation: Parallel signal collection
- Optimize: Cache DNS results
- Target: <60 seconds total

---

## Success Metrics

### Technical Metrics

| Metric | Target | Critical? |
|--------|--------|-----------|
| Snapshot generation time | <60s | Yes |
| Email delivery rate | >95% | Yes |
| Error rate | <5% | Yes |
| Dashboard load time | <3s | No |
| Token validation speed | <500ms | No |

### Business Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Snapshots requested | 100 | 500 |
| Email open rate | >40% | >50% |
| Dashboard view rate | >60% | >70% |
| Account creation rate | >5% | >10% |
| Cost per report | <$0.50 | <$0.30 |

### Quality Metrics

- User sentiment: Not "confused", "scared", or "underwhelmed"
- LLM output quality: Manual review of 10/week
- False positive rate: <10% of findings disputed

---

## Environment Variables

### Required for Development

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
SYSTEM_EMAIL_FROM_NAME=Explain My IT
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

### Required for Production

Same as development, plus:
```bash
NEXT_PUBLIC_URL=https://explainmyit.com
```

---

## Deployment Checklist

### Pre-Launch

- [ ] All tests passing
- [ ] Manual QA complete
- [ ] Security audit done
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Monitoring set up
- [ ] Production env vars configured
- [ ] Backup strategy in place

### Launch Day

- [ ] Deploy to production
- [ ] Verify all services working
- [ ] Test 5 real snapshots end-to-end
- [ ] Monitor error rates (check every hour)
- [ ] Monitor email delivery
- [ ] Check analytics tracking

### Post-Launch (Week 1)

- [ ] Daily check of error logs
- [ ] Daily check of conversion metrics
- [ ] Review 10 sample reports (quality check)
- [ ] Respond to user feedback
- [ ] Fix critical bugs within 24h
- [ ] Optimize based on performance data

---

## Cost Estimates

### Per Report

| Component | Cost |
|-----------|------|
| DNS queries | $0.00 |
| WHOIS lookup | $0.00 |
| TLS check | $0.00 |
| Tech detection | $0.00 |
| HIBP API | $0.0004 |
| LLM (Claude Haiku) | $0.10 |
| Email delivery | $0.001 |
| **Total** | **~$0.10** |

### Monthly (1,000 reports)

| Service | Cost |
|---------|------|
| Supabase | $0 (free tier) |
| Anthropic | $100 |
| HIBP | $3.50 |
| Brevo | $0 (free tier) |
| Vercel | $0 (free tier) |
| **Total** | **~$103.50** |

### Break-even Analysis

- Cost per report: $0.10
- Free tier: Sustainable up to 1,000 reports/month
- Tier 2 price: $30/month suggested
- Need: 4 paid users to cover 1,000 free reports
- Target: 3-5% conversion = need 100 free users for 4 paid

---

## Definition of Done

### Tier 1 is "Done" when:

**Functional Requirements**:
- [ ] User can request snapshot (any domain)
- [ ] Snapshot generates in <60 seconds
- [ ] User receives email with summary + magic link
- [ ] User can view full report via link
- [ ] Report includes all 6 signal blocks
- [ ] Report includes all 5 LLM sections
- [ ] User can create account from report
- [ ] Report saves to user account
- [ ] User can view saved reports in dashboard
- [ ] Rate limiting works (1 per 30 days)

**Quality Requirements**:
- [ ] All critical tests passing
- [ ] No P0/P1 bugs
- [ ] Error rate <5%
- [ ] Email delivery >95%
- [ ] Mobile responsive
- [ ] Cross-browser compatible

**Non-Functional Requirements**:
- [ ] Security audit complete
- [ ] Documentation complete
- [ ] Monitoring in place
- [ ] Analytics tracking working
- [ ] Production environment stable

---

## Timeline Summary

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1. Foundation | Week 1 | Database + DNS/Email/TLS signals |
| 2. Signals | Week 2 | All 6 blocks working |
| 3. LLM | Week 3 | Full narrative generation |
| 4. API & Auth | Week 4 | Request flow + magic links |
| 5. Email | Week 5 | Email integration complete |
| 6. Dashboard | Week 5-6 | Full UI + upgrade flow |
| 7. Polish | Week 6 | Analytics + optimization |
| 8. Launch | Week 7-8 | Production + monitoring |

**Total**: 8 weeks to production launch

---

## Next Steps

### Immediate (Today)

1. ✅ Create Supabase project
2. ✅ Run database schema setup
3. ✅ Create first signal module (DNS)
4. ✅ Test with real domain

### This Week

5. Complete all 6 signal modules
6. Test signal orchestrator
7. Set up Anthropic API
8. Test LLM generation

### Next Week

Continue following phase-by-phase plan above.

---

## Notes & Decisions

### Design Decisions

1. **Magic links over passwords**: Lower friction, consistent with "one-time" positioning
2. **LLM: Claude over GPT**: Better instruction following, cheaper
3. **Database: Supabase over others**: Auth built-in, easy upgrade path
4. **Email: Plain text**: Professional, accessible, high deliverability
5. **Rate limit: Email + domain**: Prevents spam, allows legitimate re-runs

### Future Considerations (Tier 2)

- Recurring snapshots (automatic)
- Internal insights (needs agent/API access)
- Alerting (only for changes)
- Historical comparison
- Multi-domain support
- Team collaboration

---

## Version History

### v1.0 (January 28, 2026)
- Initial complete implementation plan
- 90+ tasks defined
- 8-week timeline
- All acceptance criteria specified

---

**This plan is now locked and ready to execute.**

**Start with Phase 1, Task 1.1 (Database Setup)**
