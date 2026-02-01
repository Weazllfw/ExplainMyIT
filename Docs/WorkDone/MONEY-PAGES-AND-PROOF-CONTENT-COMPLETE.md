# Money Pages & Proof Content - Implementation Complete

**Date**: 2026-01-31  
**Status**: ✅ 3 Money Pages Created + Content Plan Updated

---

## Fix #3: Money Pages Created ✅

### 1. /use-cases Page
**File**: `app/use-cases/page.tsx`  
**Purpose**: Convert traffic by showing specific scenarios  
**Status**: ✅ Complete

**Content covers**:
- Insurance renewal ("Prove your IT security")
- Business acquisition ("What IT am I acquiring?")  
- MSP transition ("What's our current state?")
- Ownership clarity ("I don't know who owns what")

**Each use case includes**:
- The triggering question/situation
- What business owners face
- What Explain My IT provides
- Real scenario example
- CTA to pricing

**SEO**: insurance renewal IT, business acquisition due diligence, MSP transition, IT ownership

---

### 2. /examples Page  
**File**: `app/examples/page.tsx`  
**Purpose**: Show what reports look like, build trust  
**Status**: ✅ Complete

**Content includes**:
- What every report covers (domain, email, SSL, DNS)
- **Example 1**: Clean setup (all passing, well-configured)
- **Example 2**: Issues found (DKIM failing, DMARC missing, domain expiring)
- What reports are NOT (security audit, IT management, compliance cert, recommendations)
- Dual CTA (free snapshot + monthly upsell)

**Format**: Realistic report snippets with color-coded status, plain-English explanations

---

### 3. /why-monthly Page
**File**: `app/why-monthly/page.tsx`  
**Purpose**: The "drift" narrative in one page  
**Status**: ✅ Complete

**Core narrative**: "IT changes quietly. Monthly snapshots document change."

**Content structure**:
1. The drift problem (configuration changes without notice)
2. The "I think so" problem (assumptions vs. information)
3. What monthly snapshots actually do (comparison power)
4. Real scenarios where monthly matters
5. Who needs monthly vs. one-time
6. The reality check (when you wish you had it)

**Key messages**:
- Changes happen without you noticing
- Monthly comparison reveals when/what changed
- Dated records = evidence when needed
- Not paranoid, prudent (like bank statements)

---

## Supporting Updates ✅

### Sitemap Updated
**File**: `app/sitemap.ts`  
**Added**:
- `/use-cases` (priority 0.9 - high conversion)
- `/examples` (priority 0.8)
- `/why-monthly` (priority 0.8)

### Footer Navigation Updated
**File**: `components/Footer.tsx`  
**Added to Product section**:
- Use Cases
- Example Reports
- Why Monthly?

All three money pages now discoverable from every page footer.

---

## Fix #4: "Proof" Content Added to Calendar ✅

Updated `Docs/BlogSeed/ContentPlan/Q1-2026-Content-Calendar.md` with 3 new "proof" articles:

### Week 14 (May 10, 2026) 🆕
**Title**: "What a Normal Small Business IT Footprint Looks Like"  
**Type**: Proof/Educational  
**Why**: Maps directly to report experience, builds credibility

**Key points**:
- What's typical for 5-10 person business
- Common configurations (Google Workspace, WordPress, Cloudflare)
- Normal vs. concerning setups
- "You're not behind" reassurance
- Sets expectations for what snapshots show

**SEO**: "normal business IT setup", "small business IT baseline"  
**Cross-links**: Examples page, Use Cases page, Inherited IT (seed #1)

---

### Week 15 (May 17, 2026) 🆕
**Title**: "Common Domain Ownership Mistakes We See (And How to Fix Them)"  
**Type**: Proof/Practical  
**Why**: Shows you've seen real situations, provides social proof

**Key points**:
- Registered under personal email (not company)
- Former employee controls domain
- Auto-renew disabled without owner knowing
- Multiple domains, nobody tracking expiration
- Registrar lock not enabled
- Real examples (anonymized) with outcomes

**SEO**: "domain ownership mistakes", "domain control issues"  
**Cross-links**: Domain Registrar (seed #8), Use Cases page, Inherited IT (seed #1)

---

### Week 16 (May 24, 2026) 🆕
**Title**: "Assumptions Business Owners Make About Their IT (That Turn Out to Be Wrong)"  
**Type**: Proof/Eye-Opening  
**Why**: Makes readers question their assumptions, drives snapshot requests

**Key points**:
- "My IT person handles everything" (but can't show proof)
- "Email security is configured" (SPF only, missing DKIM/DMARC)
- "SSL auto-renews" (until it doesn't)
- "I have backups" (untested, or missing entirely)
- "Domain won't expire" (auto-renew was off)
- Pattern: "We assumed X, snapshot showed Y, we fixed Z"

**SEO**: "IT assumptions", "business IT misconceptions"  
**Cross-links**: All seed articles, Examples page, Use Cases page  
**Note**: High conversion potential - directly challenges assumptions

---

## Fix #5: Dual CTA Structure - Template Created ✅

### New Blog Post Ending Structure

**Current structure** (good but incomplete):
```markdown
[Article content]

**Many owners only realize these gaps after something changes...

Explain My IT exists to create a dated, owner-readable record...

---

**Related reading:**
- [Link 1]
- [Link 2]
```

**NEW structure** (with dual CTA):
```markdown
[Article content]

**Many owners only realize these gaps after something changes** — a vendor leaves, 
a certificate expires, or an insurance renewal asks unexpected questions.

Explain My IT exists to create a dated, owner-readable record of what's visible 
from the outside — so you don't have to reconstruct this later.

---

**Ready to see your IT setup?**

🎯 **[Run your free snapshot →](/pricing)** — See your current configuration in 60 seconds

📅 **Want this monthly with full history?** [See Basic subscription →](/pricing) ($15/month)

---

**Related reading:**
- [Link 1]
- [Link 2]
- [Link 3]
```

### Benefits of Dual CTA

✅ **Primary CTA**: Low-friction entry (free snapshot)  
✅ **Secondary CTA**: Introduces monthly concept naturally  
✅ **Training effect**: "Monthly with history" becomes normal expectation  
✅ **No pressure**: Secondary is informational, not pushy  
✅ **Clear paths**: Readers choose their own journey  

---

## Implementation Status

### ✅ Complete (Immediate)
- [x] 3 money pages created (`/use-cases`, `/examples`, `/why-monthly`)
- [x] Sitemap updated with new pages
- [x] Footer navigation updated
- [x] 3 "proof" articles added to content calendar
- [x] Dual CTA template designed

### ⏳ To Be Implemented (Next)
- [ ] Update all 12 blog seed articles with dual CTA structure
- [ ] Write weeks 14-16 "proof" articles by mid-April
- [ ] Add internal links from blog posts to money pages

---

## Dual CTA Implementation Guide

### For All 12 Blog Seed Articles

**Location**: Between closing paragraph and "Related reading" section

**Template**:
```markdown
---

**Ready to see your IT setup?**

🎯 **[Run your free snapshot →](/pricing)** — See your current configuration in 60 seconds

📅 **Want this monthly with full history?** [See Basic subscription →](/pricing) ($15/month)

---
```

**Files to update**:
1. `01-inherited-company-it-setup.md`
2. `02-know-if-it-is-secure.md`
3. `03-when-it-provider-uses-jargon.md`
4. `04-why-dated-it-records-matter.md`
5. `05-what-is-dns-business-owners.md`
6. `06-email-security-spf-dkim-dmarc.md`
7. `07-ssl-certificates-business.md`
8. `08-domain-registrar-explained.md`
9. `09-quarterly-it-review-checklist.md`
10. `10-audit-it-non-technical.md`
11. `11-it-when-someone-leaves.md`
12. `12-choose-it-provider-non-technical.md`

**Estimated time**: ~30 minutes for all 12 updates

---

## Internal Linking Strategy (Next Phase)

### From Blog Posts to Money Pages

**Pattern**: Add contextual links within article body (not just at end)

**Example locations**:
- **Use Cases**: When mentioning insurance, acquisition, transitions
  - "Many owners face this during [insurance renewals](/use-cases#insurance-renewal)"
  
- **Examples**: When describing what reports show
  - "For example, [see how email security appears in reports](/examples)"
  
- **Why Monthly**: When discussing tracking over time
  - "This is why [monthly snapshots](/why-monthly) catch these issues early"

**Target**: 2-3 contextual links per article to money pages

---

## Content Calendar Updates

### Original: 13 articles (weeks 1-13)
### Updated: 16 articles (weeks 1-16)

**Added**:
- Week 14: "What Normal Small Business IT Looks Like" (proof)
- Week 15: "Common Domain Ownership Mistakes" (proof + practical)
- Week 16: "Assumptions That Turn Out Wrong" (proof + conversion)

**New total**: 25 articles at launch + 16 new articles = 41 articles by end of May

---

## Money Pages SEO Strategy

### Target Keywords

**Use Cases**:
- IT for insurance renewal
- business acquisition IT due diligence
- MSP transition checklist
- IT ownership clarity

**Examples**:
- IT snapshot example
- plain English IT report
- business IT documentation sample

**Why Monthly**:
- monthly IT monitoring
- track IT changes
- IT configuration drift
- dated IT records

### Internal Link Targets

**All blog posts should link to these money pages** when contextually relevant:
- Insurance/compliance mentions → `/use-cases#insurance-renewal`
- Business buying/selling → `/use-cases#business-acquisition`
- Specific report questions → `/examples`
- Tracking/monitoring discussions → `/why-monthly`

---

## Success Metrics (Money Pages)

### Traffic Goals (First 3 Months)
- **Use Cases**: 500+ visitors (high conversion intent)
- **Examples**: 800+ visitors (pre-conversion research)
- **Why Monthly**: 400+ visitors (subscription education)

### Conversion Goals
- **Use Cases → Snapshot**: 15%+ CTR
- **Examples → Snapshot**: 12%+ CTR
- **Why Monthly → Basic**: 8%+ CTR (premium conversion)

### Engagement Goals
- **Time on page**: 3+ minutes (money pages are longer)
- **Scroll depth**: 60%+ (readers engage with full content)
- **Return visits**: 25%+ (bookmark-worthy content)

---

## Summary

### Fix #3: Money Pages ✅
**Created**: `/use-cases`, `/examples`, `/why-monthly`  
**Purpose**: Convert traffic better than blog posts  
**Status**: Live and ready, added to sitemap and footer

### Fix #4: Proof Content ✅
**Added**: 3 "proof" articles to content calendar (weeks 14-16)  
**Purpose**: Show you've seen real situations, build credibility  
**Topics**: Normal setups, ownership mistakes, wrong assumptions

### Fix #5: Dual CTA ✅
**Template**: Created for all blog posts  
**Primary**: "Run your free snapshot"  
**Secondary**: "Want this monthly? See Basic"  
**Purpose**: Train readers that monthly is normal option

---

## Next Actions

1. **Immediate**: Update 12 blog seed articles with dual CTA (30 min task)
2. **Week 1**: Add contextual links from blog posts to money pages
3. **April**: Write weeks 14-16 "proof" articles
4. **Ongoing**: Monitor money page conversion rates, optimize CTAs

---

**Created**: 2026-01-31  
**Status**: Money pages live, proof content planned, dual CTA template ready  
**Impact**: Clear conversion paths from every blog post to both free and paid tiers
