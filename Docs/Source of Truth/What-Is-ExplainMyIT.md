# What Is ExplainMyIT

**Last Updated**: February 4, 2026  
**Status**: Production Ready  
**Version**: Tier 1 (Basic)

---

## Overview

**ExplainMyIT** is a web-based SaaS product that generates plain-English IT reality reports for business owners who need clarity about their company's IT setup without technical jargon.

### Core Value Proposition

Business owners rely on IT but don't want to live in it. ExplainMyIT bridges the gap between technical infrastructure and business understanding by:

1. **Collecting public signals** about a company's IT setup (DNS, email security, TLS certificates, technology stack, public exposure, breach history)
2. **Generating AI-powered narratives** that explain what these signals mean in business terms
3. **Creating dated records** that track what changed over time
4. **Providing clarity tools** that help owners understand assumptions, ask better questions, and make informed decisions

**What It Is**: A clarity and record-keeping tool for business owners  
**What It's Not**: Not a monitoring system, not a security scanner, not an IT management service

---

## Product Tiers

### Free Tier (Currently Available)

- **Snapshots**: 1 per domain (no re-runs or updates)
- **Domains**: Up to 3 domains maximum
- **Dashboard**: Full access to view all snapshots
- **History**: Permanent dated records of all snapshots
- **No Credit Card**: Completely free, no payment required
- **Upgrade Required**: For re-runs, updates, or automatic monthly snapshots

### Basic Subscription (Currently Available)

- **Price**: $19.99/month or $199/year (save 2 months)
- **Snapshots**: Unlimited on-demand snapshots
- **Domains**: Unlimited domains
- **Automatic Reports**: Monthly snapshots for all domains
- **Dashboard**: Full access with subscription management
- **Payment**: Stripe integration with customer portal

### Future Tiers (Roadmap)

- **Tier 2 (Internal Insights)**: Network scanning, internal signals, compliance mapping
- **Tier 3 (Enterprise)**: Team collaboration, custom integrations, white-label reports

---

## What ExplainMyIT Does

### 1. Signal Collection (The Foundation)

ExplainMyIT collects publicly observable signals about a domain's IT infrastructure across **6 key areas** (plus an optional 7th module for subdomains):

#### DNS & Infrastructure (dns.ts)
- **What It Collects**: Domain age, registrar, nameservers, A/AAAA/MX records
- **Derived Flags**: 
  - Domain age concerns (< 1 year)
  - Third-party DNS provider usage
  - Single point of DNS dependency
- **Technology**: WHOIS lookups, DNS queries
- **Speed**: ~250ms (parallel with other modules)

#### Email Authentication (email.ts)
- **What It Collects**: MX provider, SPF records, DKIM detection, DMARC policies
- **Derived Flags**:
  - Email spoofing possible
  - Email protection partial
  - Email protection strong
- **Technology**: DNS TXT record queries, MX lookups
- **Speed**: ~250ms (parallel)

#### Website Security (tls.ts)
- **What It Collects**: HTTPS certificate details, TLS versions, certificate expiry, HTTP→HTTPS redirects
- **Derived Flags**:
  - SSL expiring soon (< 30 days)
  - Legacy TLS supported
  - No HTTPS redirect
- **Technology**: TLS connection testing, HTTP header analysis
- **Speed**: ~250ms (parallel)

#### Technology Stack (techstack.ts)
- **What It Collects**: CMS platform (WordPress, Shopify, etc.), CDN provider (Cloudflare, AWS), hosting provider, web frameworks
- **Derived Flags**:
  - CMS common target (WordPress/Joomla/Drupal)
  - CDN present
  - Hosting identified
- **Detection Coverage**:
  - 10 CMS platforms
  - 7 CDN providers
  - 11+ hosting providers
  - Web servers, frameworks, libraries
- **Technology**: HTML parsing, HTTP header analysis
- **Speed**: ~250ms (parallel)

#### Public Exposure (exposure.ts)
- **What It Collects**: Reverse DNS, geolocation inference, infrastructure patterns
- **Derived Flags**:
  - Cloud hosted
  - Infrastructure identifiable
- **Constraints**: Passive DNS only (no port scanning)
- **Technology**: PTR lookups, hostname pattern matching
- **Speed**: ~5s timeout (race condition)

#### Breach History (hibp.ts)
- **What It Collects**: Known breaches from Have I Been Pwned (HIBP) API
- **Derived Flags**:
  - Recent breach (< 12 months)
  - Multiple breaches
  - Credential breach (passwords/emails exposed)
- **Technology**: HIBP API v3 integration
- **Caching**: 30-day database cache to reduce API calls
- **Speed**: ~100ms (cached) or ~500ms (API call)

#### Subdomains (subdomains.ts) - Optional Module
- **What It Collects**: Subdomains discovered via Certificate Transparency logs (crt.sh)
- **Derived Flags**:
  - Presence of dev/test/staging patterns
  - Total subdomain count
- **Technology**: Certificate Transparency logs via crt.sh API
- **Speed**: ~1-2 seconds
- **Note**: This module is OPTIONAL and conditionally included in reports only when subdomain data exists. It's NOT counted in the "6 key areas" marketing messaging.

### 2. LLM Report Generation (The Intelligence)

After collecting signals, ExplainMyIT uses **Claude 4.5 Haiku** to generate human-readable reports through a **3-call architecture**:

#### Call 1: Block Narratives
- **Input**: All 6 signal blocks with raw signals, flags, and confidence levels
- **Output**: JSON object with narratives for all 6 blocks
- **Format**: 2-4 sentences per block, business language, confidence qualifiers
- **Rules**: No fear language, no vendor names, no remediation steps
- **Cost**: ~$0.015 per snapshot
- **Speed**: ~7-8 seconds

#### Call 2: Synthesis + Assumptions + Questions
- **Input**: All signals + cross-block flags
- **Output**:
  - **Owner Summary**: 4-6 sentence high-level overview (max 150 words)
  - **Top Findings**: Top 3 findings ranked by business impact (not technical severity)
  - **Assumptions**: 3-5 assumptions about the setup (must include 1 organizational)
  - **Questions**: 3-5 open-ended questions to ask IT team/MSP
- **Rules**: Must include "based on public signals only" disclaimer
- **Cost**: ~$0.010 per snapshot
- **Speed**: ~7-8 seconds

#### Call 3: Email Summary
- **Input**: Owner summary, top findings, report URL
- **Output**: Email subject and plain-text body
- **Purpose**: Optimized for conversion, includes upgrade CTA
- **Cost**: ~$0.006 per snapshot
- **Speed**: ~3-4 seconds

**Total LLM Cost**: ~$0.03 per complete snapshot  
**Total Generation Time**: 20-25 seconds (signals + LLM)

### 3. Report Delivery & Display

#### Email Delivery (Brevo)
- **Template**: HTML email with company branding
- **Content**: Owner summary, top 2 findings, magic link to full report
- **Magic Link**: JWT token with 30-day expiry, no account required
- **Sender**: `noreply@explainmyit.com`
- **Templates**: 7 total (welcome, snapshot ready, monthly snapshot, payment failed, subscription canceled, confirm signup, reset password)

#### Report View (/report/[id])
- **Authentication**: Magic link token verification (server-side)
- **Display Sections**:
  1. **Report Header**: Domain name, generation date
  2. **Owner Summary**: High-level 4-6 sentence overview
  3. **Top Findings**: Top 3 business-ranked findings with confidence badges
  4. **Block Narratives**: 6 collapsible detailed sections with icons
  5. **Assumptions**: Warning-styled list of setup assumptions
  6. **Questions**: Actionable questions for IT team/MSP
  7. **CTA**: "Create Free Account" and "Upgrade to Basic"
- **Features**: 
  - Mobile-responsive design
  - Server-side rendering (SSR)
  - Expand/collapse block interactivity
  - Confidence indicators (high/medium/low)
  - No indexing (noindex, nofollow for privacy)

### 4. User Dashboard (/dashboard)

#### Free Tier Dashboard
- **Snapshots List**: All snapshots with domain, date, status
- **Actions**: 
  - View existing reports
  - Request new snapshot (limit: 1 per domain, no re-runs)
  - See rate limit status
- **Limits Display**: Shows remaining free snapshots clearly
- **Upgrade CTA**: Prominent upgrade to Basic messaging

#### Basic Subscriber Dashboard
- **Snapshots List**: Unlimited historical snapshots
- **Actions**:
  - View any report
  - Request unlimited new snapshots
  - Manage subscription (via Stripe portal)
- **Subscription Status**: Shows plan, billing cycle, next renewal
- **Monthly Snapshots**: Automatic snapshots via cron job

### 5. Subscription Management

#### Stripe Integration
- **Checkout**: Stripe-hosted checkout page
- **Customer Portal**: Stripe customer portal for self-service
- **Webhooks**: Idempotent processing with deduplication
- **Supported Events**:
  - `checkout.session.completed` - New subscription
  - `customer.subscription.updated` - Plan changes
  - `customer.subscription.deleted` - Cancellation
  - `invoice.payment_failed` - Payment failures
- **Sync**: Real-time database updates from webhooks

#### Subscription Lifecycle
1. **Signup**: User clicks "Upgrade to Basic" → Stripe checkout
2. **Payment**: Stripe processes payment → webhook fires
3. **Activation**: Database updates `stripe_subscription_id`, `stripe_subscription_status`
4. **Usage**: User gets unlimited snapshots, automatic monthly reports
5. **Renewal**: Stripe auto-renews monthly/yearly
6. **Cancellation**: User cancels via portal → webhook updates DB → email sent
7. **Failed Payment**: Stripe retries → webhook fires → email sent

---

## Technical Architecture

### Tech Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Server-side rendering (SSR)

**Backend**:
- Next.js API routes
- Node.js (built-in modules for DNS, TLS, HTTP)
- Anthropic SDK (Claude AI)
- Stripe SDK

**Database**:
- Supabase (PostgreSQL)
- 5 core tables: `users`, `snapshots`, `rate_limits`, `hibp_cache`, `stripe_events`
- Row Level Security (RLS) policies
- Admin client for server-side operations

**External Services**:
- **Brevo**: Transactional emails (7 templates)
- **Stripe**: Payments and subscriptions
- **Umami**: Privacy-focused analytics
- **HIBP API**: Breach data (Pwned 1 tier, $4.50/month)

**Hosting & Deployment**:
- Vercel (hosting + serverless functions)
- Vercel Cron Jobs (monthly snapshots)
- Environment-based configuration (.env.local)

### Database Schema

#### `users` Table
```sql
- id (uuid, primary key)
- auth_user_id (uuid, nullable, links to Supabase Auth)
- email (text, unique)
- email_verified (boolean)
- full_name (text, nullable)
- subscription_tier (text: 'free', 'pro', 'team', 'enterprise')
- organization_id (uuid, nullable)
- is_active (boolean)
- deleted_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- last_login_at (timestamp, nullable)
- stripe_customer_id (text, nullable, unique)
- stripe_subscription_id (text, nullable, unique)
- subscription_status (text, nullable)
- subscription_period_end (timestamp, nullable)
- subscription_cancel_at_period_end (boolean, default false)
```

#### `snapshots` Table
```sql
- id (uuid, primary key)
- domain (text)
- user_id (uuid, foreign key to users, nullable for anonymous)
- email_hash (text, nullable, SHA-256 for anonymous users)
- access_token_hash (text, nullable, SHA-256 of magic link JWT)
- access_expires_at (timestamp, nullable)
- status (text: 'pending', 'processing', 'completed', 'failed')
- signals_json (jsonb, nullable, contains 6 signal blocks)
- report_json (jsonb, nullable, contains LLM-generated report)
- generation_duration_seconds (integer, nullable)
- error_message (text, nullable)
- snapshot_version (integer)
- parent_snapshot_id (uuid, nullable, foreign key to snapshots)
- schedule_id (uuid, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- completed_at (timestamp, nullable)
- deleted_at (timestamp, nullable)
```

#### `rate_limits` Table
```sql
- id (serial, primary key)
- user_id (uuid, nullable, foreign key to users)
- email_hash (text, nullable, SHA-256 for anonymous users)
- domain_hash (text, SHA-256 of domain)
- last_run_at (timestamp)
- run_count (integer)
- tier_limit_type (text: 'free', 'pro', 'team', 'enterprise')
- created_at (timestamp)
- updated_at (timestamp)
```

#### `hibp_cache` Table
```sql
- domain_hash (text, primary key, SHA-256 of domain)
- results_json (jsonb, HIBP breach results)
- cached_at (timestamp)
- expires_at (timestamp)
```

#### `stripe_events` Table (Webhook Deduplication)
```sql
- id (serial, primary key)
- stripe_event_id (text, unique, not null)
- type (text, not null)
- data (jsonb)
- processed_at (timestamp, default now())
```

### API Endpoints

#### Public Endpoints

**POST /api/snapshot**
- **Purpose**: Request new snapshot (free or paid)
- **Input**: `{ email, domain }`
- **Output**: `{ success, snapshotId, message }`
- **Rate Limits**: 
  - Free: 1 per domain (no re-runs), max 3 domains
  - Basic: Unlimited
- **Process**:
  1. Validate email and domain
  2. Check rate limits (free tier only)
  3. Create snapshot record (status: 'pending')
  4. Collect signals (6 modules in parallel)
  5. Generate LLM report (3 calls)
  6. Update snapshot (status: 'completed')
  7. Send email with magic link
  8. Return success

**POST /api/stripe/webhook**
- **Purpose**: Handle Stripe webhook events
- **Security**: Signature verification
- **Events**: checkout, subscription updates, payment failures
- **Idempotency**: Webhook ID tracking to prevent duplicates

**GET /api/health**
- **Purpose**: Health check for monitoring
- **Output**: `{ status: 'ok' }`

#### Authenticated Endpoints (Supabase Auth)

**POST /api/auth/create-user-record**
- **Purpose**: Create user record after Supabase signup
- **Trigger**: Called after email confirmation

**GET /api/subscription-status**
- **Purpose**: Get current subscription status
- **Output**: `{ status, plan, nextBilling, cancelAtPeriodEnd }`

**POST /api/stripe/create-checkout**
- **Purpose**: Create Stripe checkout session
- **Input**: `{ priceId, userId, email }`
- **Output**: `{ sessionId, url }`

**POST /api/stripe/portal**
- **Purpose**: Create Stripe customer portal session
- **Output**: `{ url }`

**POST /api/claim-report**
- **Purpose**: Claim anonymous snapshot to user account
- **Input**: `{ snapshotId }`
- **Output**: `{ success }`

#### Cron Jobs

**GET /api/cron/monthly-snapshots**
- **Purpose**: Generate automatic monthly snapshots for Basic subscribers
- **Schedule**: 1st of every month at 9am UTC
- **Security**: Vercel cron secret header
- **Process**:
  1. Query all active Basic subscribers
  2. Get last snapshot date for each domain
  3. Generate new snapshot if 25+ days since last
  4. Send "monthly snapshot ready" email

---

## User Flows

### Flow 1: Anonymous Free Snapshot (No Account)

1. User lands on homepage
2. Enters email + domain in hero form
3. Clicks "Get My Free IT Snapshot"
4. Loading spinner (30-60 seconds)
5. Success message appears
6. User receives email with magic link
7. Clicks magic link → views report
8. Report shows CTA to create account
9. (Optional) User creates account to save report

**Conversion Points**:
- Homepage → Form submission
- Email → Magic link click
- Report → Account creation

### Flow 2: Authenticated User (Free Account)

1. User creates account (signup)
2. Email confirmation link sent
3. User confirms email
4. Redirected to dashboard
5. Dashboard shows "Request Snapshot" button
6. User enters domain
7. Snapshot generated (same as anonymous)
8. Snapshot appears in dashboard
9. Limit applied (1 snapshot per domain, no re-runs)
10. User can view past snapshots anytime

**Limits**:
- 1 snapshot per domain (no re-runs or updates)
- Maximum 3 domains
- Must upgrade to Basic for re-runs or monthly snapshots

### Flow 3: Basic Subscriber (Paid)

1. User clicks "Upgrade to Basic" (from dashboard or pricing page)
2. Redirected to Stripe checkout
3. Enters payment details
4. Stripe processes payment
5. Webhook fires → database updated
6. User receives "subscription welcome" email
7. Dashboard shows "Unlimited snapshots"
8. User can request unlimited snapshots anytime
9. Automatic monthly snapshots via cron job
10. User can manage subscription via Stripe portal

**Benefits**:
- Unlimited on-demand snapshots
- Unlimited domains
- Automatic monthly snapshots
- No rate limits

### Flow 4: Subscription Cancellation

1. User clicks "Manage Subscription" in dashboard
2. Redirected to Stripe customer portal
3. User clicks "Cancel Subscription"
4. Stripe confirms cancellation
5. Webhook fires → database updated (`cancel_at_period_end: true`)
6. User receives "subscription canceled" email
7. Dashboard shows "Active until [end date]"
8. At period end, subscription ends
9. User reverts to free tier limits

---

## Current Capabilities (February 2026)

### ✅ Production Ready

**Core Features**:
- [x] Free tier snapshots (1 per domain, no re-runs)
- [x] Basic subscription ($19.99/month, $199/year)
- [x] Automatic monthly snapshots for subscribers
- [x] Full subscription lifecycle (signup → payment → cancel)
- [x] Dashboard with subscription management
- [x] Magic link authentication for reports
- [x] Anonymous snapshot requests (no account required)
- [x] Account creation to save snapshots
- [x] Stripe integration (checkout, portal, webhooks)
- [x] Email system (7 HTML templates)
- [x] Signal collection across 6 modules
- [x] LLM report generation (Claude 4.5 Haiku)
- [x] Mobile-responsive design
- [x] SEO optimization
- [x] Privacy-focused analytics (Umami)

**Analytics Coverage** (90%):
- [x] Report engagement tracking
- [x] Pricing page funnel
- [x] Checkout flow tracking
- [x] Dashboard action tracking
- [ ] Success page (optional)

**Email Templates**:
1. Welcome (new user)
2. Snapshot Ready (magic link)
3. Monthly Snapshot Ready (subscribers)
4. Payment Failed
5. Subscription Canceled
6. Confirm Signup (Supabase auth)
7. Reset Password (Supabase auth)

**Performance**:
- Signal collection: ~0.5 seconds (parallel)
- LLM generation: ~20-25 seconds (3 calls)
- Total snapshot time: ~25 seconds
- Page load: < 2 seconds (SSR)

**Cost Structure**:
- LLM cost: ~$0.03 per snapshot
- HIBP API: $4.50/month (Pwned 1 tier)
- Brevo: Free tier (300 emails/day)
- Umami: Self-hosted (free)
- Vercel: Hobby plan (free) or Pro ($20/month)

---

## Limitations & Constraints

### Technical Limitations

**Signal Collection**:
- **Public signals only**: Cannot see inside networks or access internal systems
- **DNS rate limits**: WHOIS lookups may fail due to registrar rate limits
- **DKIM detection**: Only common selectors checked (custom selectors missed)
- **Tech stack detection**: Pattern-based, may miss custom setups
- **Passive DNS only**: No port scanning, no service enumeration

**Report Generation**:
- **LLM variability**: Output may vary slightly between runs (temperature: 0.3)
- **Confidence levels**: Based on data completeness, not authoritative certainty
- **No remediation**: Reports explain findings but don't provide fix instructions
- **English only**: Reports currently only in English

**Free Tier**:
- **One-time snapshots only**: 1 snapshot per domain with no re-runs
- **Domain limit**: Maximum 3 domains
- **No automatic snapshots**: Manual requests only, no updates
- **No cooldown period**: Once used, must upgrade for more snapshots

**Basic Tier**:
- **Monthly snapshots only**: Not daily or weekly (by design)
- **No change alerts**: No real-time monitoring
- **No team features**: Single-user accounts only

### Business Constraints

**Target Audience**:
- Designed for business owners, not IT professionals
- Assumes minimal technical knowledge
- Not suitable for highly technical users seeking deep analysis

**Not a Replacement For**:
- IT management services (MSP/internal IT)
- Security scanning tools (Nessus, Qualys, etc.)
- Monitoring systems (Datadog, New Relic, etc.)
- Compliance audits (SOC 2, ISO 27001, etc.)

**Privacy & Legal**:
- Only collects publicly available data
- No access to internal systems or networks
- No port scanning or penetration testing
- GDPR-compliant (data deletion on request)
- Terms of Service and Privacy Policy in place

---

## Roadmap & Future Enhancements

### Short Term (Pre-Launch)
- [ ] Production Brevo sender verification
- [ ] Smoke test all user flows
- [ ] Switch Stripe to production mode
- [ ] Success page after checkout
- [ ] Form analytics (focus, abandon, errors)
- [ ] A/B test CTA copy

### Medium Term (Post-Launch)
- [ ] PDF export for reports
- [ ] Report sharing (generate new magic link)
- [ ] Domain autocomplete
- [ ] Comparison view (before/after snapshots)
- [ ] Multi-domain batch requests
- [ ] Weekly snapshots option (paid tier upgrade)

### Long Term (Tier 2+)
- [ ] Internal network scanning (authenticated)
- [ ] Compliance mapping (SOC 2, ISO 27001)
- [ ] Team collaboration features
- [ ] Custom integrations (API access)
- [ ] White-label reports (enterprise)
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Slack/Teams notifications

---

## Key Technical Decisions

### Why Claude 4.5 Haiku?
- **Instruction following**: Excellent JSON adherence
- **Tone control**: Reliably follows confidence guardrails
- **Cost**: $1/M input, $5/M output (10x cheaper than GPT-4)
- **Speed**: Fast enough for real-time (~7-8s per call)
- **Context**: 200K tokens (more than enough)

### Why 3-Call LLM Architecture?
- **Efficiency**: 40% cost savings vs. 6+ separate calls
- **Consistency**: Single context for all block narratives
- **Speed**: Fewer API round trips
- **Maintainability**: Easier to update prompts

### Why Magic Links?
- **UX**: No password to remember for anonymous users
- **Security**: Short-lived tokens (30 days)
- **Simplicity**: No session management
- **Conversion**: Lower friction than account creation

### Why Supabase?
- **Auth**: Built-in email authentication
- **Database**: PostgreSQL with RLS policies
- **Real-time**: Potential for future features
- **Cost**: Generous free tier
- **Developer Experience**: Excellent TypeScript support

### Why Stripe?
- **Reliability**: Industry-standard payment processing
- **Customer Portal**: Self-service subscription management
- **Webhooks**: Real-time subscription updates
- **Developer Experience**: Excellent API and documentation

### Why Brevo (vs. SendGrid/Mailgun)?
- **HTML templates in code**: Not dashboard-based
- **Version control**: Templates tracked in Git
- **Cost**: Free tier (300 emails/day)
- **API**: Simple REST API
- **Deliverability**: Good reputation

---

## Documentation

### Source of Truth Docs (Complete)
- [x] Frontend Visual Language
- [x] Umami Analytics Setup
- [x] Signal Collection Architecture
- [x] LLM Integration Architecture
- [x] Frontend Report Architecture
- [x] Homepage Architecture
- [x] Brevo Mailing List Integration
- [x] Pre-Launch Status Report

### Needs Update
- [ ] Tier1-System-Architecture.md (reflects old architecture)
- [ ] Basic-Subscription-Architecture.md (Stripe flow)
- [ ] Email-System-Architecture.md (templates + Brevo)

---

## Summary

**ExplainMyIT is a clarity tool that helps business owners understand their IT setup in plain English.**

It works by:
1. **Collecting** public signals about IT infrastructure (6 modules, ~0.5s)
2. **Generating** AI-powered narratives using Claude 4.5 Haiku (3 calls, ~20s)
3. **Delivering** reports via email with magic links (Brevo)
4. **Tracking** dated records over time (dashboard)

**It's production-ready for:**
- Free tier users (1 snapshot per domain, no re-runs, max 3 domains)
- Basic subscribers ($19.99/month, unlimited snapshots + automatic monthly reports)
- Anonymous snapshot requests (no account required)

**It's NOT:**
- A monitoring system
- A security scanner
- An IT management service
- A remediation tool

**Next Milestone**: Launch (pending final pre-launch verification)

---

**Last Updated**: February 4, 2026  
**Product Status**: Production Ready  
**Version**: Tier 1 (Basic)  
**Next Phase**: Pre-Launch Verification → Launch
