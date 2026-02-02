# Source of Truth Documentation

**Purpose**: Cast-iron technical reference for Explain My IT.

This directory contains minimal, focused documentation explaining exactly how each part works. These are living documents that get updated as we build.

---

## 📖 Quick Navigation

### **🚀 Start Here**
- **[Current Product Status](#current-product-status)** - What's done, what's next
- **[Pre-Launch Checklist](../WorkDone/PRE-LAUNCH-STATUS-REPORT.md)** - Final readiness assessment

### **🏗️ System Architecture**
- **[Tier1-System-Architecture.md](./Tier1-System-Architecture.md)** - Complete system overview *(needs update)*
- **[Signal-Collection-Architecture.md](./Signal-Collection-Architecture.md)** - How signal modules work
- **[LLM-Integration-Architecture.md](./LLM-Integration-Architecture.md)** - Report generation with Claude

### **🎨 Frontend & UX**
- **[Frontend-Visual-Language.md](./Frontend-Visual-Language.md)** - Visual design system (CURRENT)
- **[Frontend-Report-Architecture.md](./Frontend-Report-Architecture.md)** - Report view page
- **[Homepage-Architecture.md](./Homepage-Architecture.md)** - Homepage architecture

### **📊 Analytics & Tracking**
- **[Umami-Analytics-Setup.md](./Umami-Analytics-Setup.md)** - ⭐ **SOURCE OF TRUTH** - Complete configuration & event tracking
- **[Umami-Quick-Start-Checklist.md](./Umami-Quick-Start-Checklist.md)** - ⚡ 15 min setup
- **[Umami-Cloud-Setup-Guide.md](./Umami-Cloud-Setup-Guide.md)** - Complete guide

### **💳 Subscriptions & Payments**
- **[Basic-Subscription-Architecture.md](./Basic-Subscription-Architecture.md)** - Stripe integration *(to be created)*

### **📧 Email & Communications**
- **[Brevo-Mailing-List-Integration.md](./Brevo-Mailing-List-Integration.md)** - ⭐ **SOURCE OF TRUTH** - Mailing list opt-ins & integration
- **[Email-System-Architecture.md](./Email-System-Architecture.md)** - Email templates & Brevo *(to be created)*

---

## Current Product Status

### **✅ PRODUCTION READY (Tier 1 - Basic)**

#### **Core Features (100%)**
- ✅ Free tier snapshots (1 per domain/30 days, max 3 domains)
- ✅ Basic subscription ($20/month, $199/year)
- ✅ Automatic monthly snapshots
- ✅ Full subscription lifecycle (signup → payment → cancel)
- ✅ Dashboard with subscription management
- ✅ Stripe integration (webhooks, customer portal)
- ✅ Email system (4 HTML templates in code)

#### **Technical Stack**
- ✅ Next.js 14 (App Router)
- ✅ Supabase (database + auth)
- ✅ Stripe (payments)
- ✅ Brevo (transactional emails)
- ✅ Umami (analytics)
- ✅ Vercel (hosting + cron jobs)

#### **Analytics Coverage (90%)**
- ✅ Report engagement tracking
- ✅ Pricing page funnel
- ✅ Checkout flow
- ✅ Dashboard actions
- ⏳ Success page (optional)

---

## Implementation Phases

### **Phase 1-6: Core Product** - ✅ COMPLETE

**Database & Auth:**
- ✅ 4 core tables (users, snapshots, rate_limits, hibp_cache)
- ✅ Stripe subscription columns (6 fields)
- ✅ Supabase Auth integration
- ✅ RLS policies + admin client

**Signal Collection:**
- ✅ 6 signal modules (DNS, Email, TLS, Tech, Exposure, HIBP)
- ✅ Parallel orchestrator (<0.5s collection time)

**LLM Integration:**
- ✅ Claude 3.5 Haiku integration
- ✅ 3-call architecture (narratives → synthesis → email)
- ✅ Cost: ~$0.03 per snapshot

**API & Backend:**
- ✅ Snapshot generation API
- ✅ Stripe webhook handling
- ✅ Subscription status sync
- ✅ Vercel cron job (monthly snapshots)

**Email System:**
- ✅ Centralized email service (`lib/email/index.ts`)
- ✅ 4 HTML templates (welcome, snapshot, payment failed, canceled)
- ✅ Brevo API integration
- ✅ Sender: `noreply@explainmyit.com`

**Frontend:**
- ✅ Homepage with snapshot request
- ✅ Report display (7 components)
- ✅ Pricing page (Basic tier)
- ✅ Dashboard (snapshots + subscription status)
- ✅ Stripe checkout integration
- ✅ Mobile-responsive design

---

### **Phase 7: Pre-Launch** - 🔄 IN PROGRESS

**Critical (30 min):**
- [ ] Verify Brevo sender (`noreply@explainmyit.com`)
- [ ] Test emails (all 4 templates)
- [ ] Smoke test (free + Basic flows)
- [ ] Switch Stripe to production mode

**Optional (2 hours):**
- [ ] Success page (`/subscription/success`)
- [ ] Loading state improvements
- [ ] Toast notifications

---

### **Phase 8: Launch & Monitor** - ⏳ NEXT

**Day 1:**
- [ ] Deploy to production
- [ ] Monitor webhooks (24 hours)
- [ ] Test with friends/colleagues
- [ ] Fix critical issues

**Week 1:**
- [ ] Soft launch (network)
- [ ] Monitor analytics
- [ ] Collect feedback
- [ ] Quick fixes

---

## Key Technical Decisions

### **Free Tier Limits**
- **Enforcement:** Database-level checks (`lib/subscriptions/free-tier-limits.ts`)
- **Rules:** 1 snapshot/domain/30 days, max 3 domains
- **Bypass:** Basic subscribers get unlimited snapshots

### **Subscription Model**
- **Tiers:** Free (limited) → Basic ($20/month, unlimited)
- **Payment:** Stripe checkout + customer portal
- **Webhooks:** Idempotent processing with deduplication
- **Sync:** Stripe → Database → Dashboard (real-time)

### **Email Architecture**
- **Approach:** HTML templates in code (NOT Brevo dashboard)
- **Why:** Version control, TypeScript safety, local preview
- **Delivery:** Brevo API (`sendEmail`, not `sendTemplateEmail`)

### **Analytics Strategy**
- **Tool:** Umami (privacy-focused, self-hosted)
- **Coverage:** Report engagement, pricing funnel, checkout flow
- **Server-side:** Limited (only where necessary)

---

## Documentation Status

### **✅ Current & Accurate**
- [x] Frontend Visual Language
- [x] Umami Analytics Setup (SOURCE OF TRUTH)
- [x] Umami Setup Guides
- [x] Email Templates Documentation
- [x] Pre-Launch Status Report

### **⏳ Needs Update**
- [ ] Tier1-System-Architecture.md (reflects old architecture)
- [ ] Signal-Collection-Architecture.md (add new modules)
- [ ] LLM-Integration-Architecture.md (update token counts)

### **📝 To Be Created**
- [ ] Basic-Subscription-Architecture.md (Stripe flow)
- [ ] Email-System-Architecture.md (templates + Brevo)
- [ ] Free-Tier-Limits-Architecture.md (enforcement logic)

---

## Documentation Philosophy

1. **Minimal**: Only what's needed to understand how it works
2. **Technical**: Implementation details, not marketing
3. **Current**: Updated as we build, not after
4. **Reference**: Quick lookup, not tutorials
5. **Navigable**: Clear structure, cross-references

---

## How to Use These Docs

**When building**: Update relevant doc as you implement

**When debugging**: Reference to understand current implementation

**When planning**: See what's done and what's next

**When onboarding**: Start with README → System Architecture → Specific components

**Before deploying**: Review Pre-Launch Status Report

---

## Recent Major Updates

**2026-02-02:**
- ✅ Umami Analytics fully operational (events tracking fixed)
- ✅ Complete Umami setup documented as Source of Truth
- ✅ Dashboard date bug fixed (-1 days ago issue resolved)
- ✅ Email templates for Supabase auth created (3 templates)

**2026-01-31:**
- ✅ HTML email templates created (4 templates in code)
- ✅ Email system standardized (`noreply@explainmyit.com`)
- ✅ Free tier limits implemented
- ✅ UX/UI analytics audit complete
- ✅ Pre-launch status report created

**2026-01-30:**
- ✅ Basic subscription complete (Stripe webhooks working)
- ✅ Monthly snapshot cron job deployed
- ✅ Dashboard subscription status display
- ✅ Stripe customer portal integration

**2026-01-29:**
- ✅ Frontend brand alignment complete
- ✅ Visual language documented
- ✅ Pricing page finalized

---

**Last Updated**: 2026-02-02  
**Product Status**: Production Ready  
**Analytics**: ✅ Fully Operational
**Next Milestone**: Launch (pre-launch tasks remaining)
