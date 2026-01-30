# ✅ Tier 1 Enhancements: Governance & Observational Signals

**Date**: 2026-01-30  
**Status**: ✅ IMPLEMENTED  
**Build Status**: ✅ Passing  
**Cost Impact**: $0 (all enhancements are free)

---

## Summary

Implemented **4 recommended easy wins + WHOIS governance signals**, all following locked Tier 1 philosophy:
- Expose ambiguity ✅
- Surface assumptions ✅
- Show breadth ✅
- Create mild discomfort ✅
- NO judgment ✅
- NO scoring ✅
- NO fear language ✅

---

## ✅ What Was Added

### **1. WHOIS-Derived Governance Signals** (DNS Module)

**Purpose**: Ownership and continuity clarity, NOT "who owns this"

**New Raw Signals**:
```typescript
domain_expiry_days: number | null;
domain_expiry_window: 'more_than_1_year' | '6_to_12_months' | 'under_6_months' | 'unknown';
registrant_type: 'business' | 'individual' | 'proxy' | 'unknown';
transfer_lock_enabled: boolean | null;
```

**New Derived Flags**:
```typescript
registrar_dns_separated: boolean;     // Registrar and DNS provider are different
domain_expiry_soon: boolean;          // Expiring within 6 months
registrant_individual: boolean;       // Registered to individual, not business
registrant_privacy_enabled: boolean;  // Privacy protection enabled
transfer_lock_confirmed: boolean;     // Transfer lock is present
```

**Tier 1 Framing Examples**:
- ✅ "Your domain registration is protected by a privacy service, which is common."
- ✅ "Your domain is set to renew within the next six months."
- ✅ "Your domain registration and DNS are managed by different providers."
- ❌ NEVER: "You personally own this domain"
- ❌ NEVER: "Urgent: domain expires soon!"

**What We NEVER Store/Expose**:
- ❌ Registrant names
- ❌ Registrant emails
- ❌ Registrant phone numbers
- ❌ Registrant addresses
- ❌ Admin/tech contact info

---

### **2. Registrar/DNS Provider Separation Signal** (DNS Module)

**Purpose**: Governance awareness - split vendors = split responsibilities

**Derived Flag**: `registrar_dns_separated`

**Tier 1 Framing**:
> "Your domain registration and DNS are managed by different providers. This is common, but it means access and responsibility may be split across vendors."

**Why it matters**:
- Feeds "assumptions" section perfectly
- Non-technical, business-relevant
- No fear framing needed

---

### **3. Domain Expiry Window Awareness** (DNS Module)

**Purpose**: Renewal visibility without urgency

**Raw Signal**: `domain_expiry_window` (bucketed, not exact days)

**Buckets**:
- `'more_than_1_year'` - No mention needed
- `'6_to_12_months'` - Casual mention
- `'under_6_months'` - Awareness without urgency

**Tier 1 Framing**:
> "Your domain registration is set to renew within the next six months. Many businesses rely on auto-renew being correctly configured."

**What we DON'T do**:
- ❌ Countdown timers
- ❌ "URGENT" language
- ❌ Red alerts

---

### **4. Certificate Issuance Count** (Subdomain Module)

**Purpose**: Observational signal of operational activity

**New Raw Signals**:
```typescript
certificate_issuance_count_12mo: number;  // Certs issued in last 12 months
most_recent_certificate_date: string | null; // ISO date
```

**Data Source**: crt.sh (already querying for subdomains - FREE bonus data)

**Tier 1 Framing**:
> "Your website certificate has been reissued multiple times over the past year, which usually indicates either routine renewals or infrastructure changes."

**Why it's safe**:
- Observational only
- NOT framed as instability
- NO risk assignment
- Normalizes the behavior

---

### **5. Email Provider Identity Clarity** (Already Had This!)

**Signal**: `mx_provider` (Google Workspace, Microsoft 365, Custom, etc.)

**Status**: ✅ Already implemented in email module

**Tier 1 Framing**:
> "Your business email appears to be hosted with Google Workspace."

or

> "Your email infrastructure appears to be custom or hosted outside major platforms."

---

### **6. HTTPS Enforcement (HTTP Redirect)** (Already Had This!)

**Signal**: `https_enforced` (boolean)

**Status**: ✅ Already implemented in TLS module

**Tier 1 Framing**:
> "Visitors who use an unsecured web address are automatically redirected to the secure version of your site."

or

> "Your site supports HTTPS, but unsecured access may still be possible."

---

## 📊 Complete Tier 1 Signal Inventory (Updated)

### **Block A: DNS & Domain**
- Domain age
- Registrar
- Nameservers
- DNS provider
- A/AAAA records
- MX records
- **NEW: Domain expiry window** ✨
- **NEW: Registrant type** ✨
- **NEW: Transfer lock status** ✨
- **NEW: Registrar/DNS separation** ✨

### **Block B: Email Authentication**
- SPF, DKIM, DMARC
- Email spoofing risk
- Email provider identity (Google/Microsoft/Custom)
- Email deliverability score
- Blacklist checks

### **Block C: TLS/SSL**
- HTTPS availability & enforcement
- Certificate validity & expiry
- TLS versions
- Security headers (abstracted)
- Enhanced certificate details (org, SAN, wildcard, type)

### **Block D: Tech Stack**
- CMS detection
- CDN provider
- Hosting provider
- Technologies

### **Block E: Public Exposure**
- Reverse DNS
- Infrastructure type
- IP geolocation

### **Block F: Breach History**
- HIBP domain breaches
- Breach count, names, dates

### **Block G: Subdomains** ✨
- Certificate-observed subdomains (crt.sh)
- Subdomain count
- Naming patterns (dev, test, staging)
- **NEW: Certificate issuance count (12 months)** ✨
- **NEW: Most recent certificate date** ✨

---

## 🎯 Tier 1 Framing Rules (LOCKED)

### ✅ **What Tier 1 DOES**:
- Expose ambiguity
- Surface assumptions
- Show breadth
- Create mild discomfort
- Raise questions
- State facts

### ❌ **What Tier 1 NEVER DOES**:
- Judge
- Score
- Label risk
- Imply negligence ("abandoned", "exposed", "vulnerable")
- Recommend fixes
- Expose personal data (names, emails, addresses)
- Use urgency language

---

## 📝 LLM Prompt Updates

Added special framing sections for:

1. **WHOIS Governance Signals**:
   - NEVER answer "who owns this?"
   - ONLY answer "how clearly is ownership defined?"
   - NEVER expose names, emails, addresses

2. **Certificate Issuance**:
   - Observational only
   - NOT framed as instability
   - Normalize the behavior

3. **Registrar/DNS Separation**:
   - Governance framing
   - "Access and responsibility may be split"

---

## 💰 Cost Impact

| Enhancement | Data Source | Cost |
|-------------|-------------|------|
| WHOIS governance signals | WHOIS lookup | $0 |
| Registrar/DNS separation | Derived flag | $0 |
| Domain expiry window | WHOIS lookup | $0 |
| Certificate issuance count | crt.sh (bonus data) | $0 |
| Email provider clarity | Already implemented | $0 |
| HTTPS enforcement | Already implemented | $0 |
| **Total** | - | **$0** |

**No cost increase. No API changes. No environment variables.**

---

## 🧪 Testing Plan

### **Test Scenarios**:

1. **Domain with privacy protection**:
   - Should show: "registration is protected by a privacy service"
   - Should NOT show: actual registrant name

2. **Domain expiring in 4 months**:
   - Should show: "set to renew within the next six months"
   - Should NOT show: countdown timer or urgency

3. **Registrar ≠ DNS provider**:
   - Should show: "registration and DNS are managed by different providers"
   - Should mention: "access and responsibility may be split"

4. **Multiple certificate reissues**:
   - Should show: "reissued multiple times over the past year"
   - Should say: "usually indicates routine renewals or infrastructure changes"
   - Should NOT imply: instability or problems

5. **Individual registrant**:
   - Should show: "appears to be registered under an individual"
   - Should mention: "many businesses do this early on"
   - Should NOT expose: actual name

---

## 📂 Files Modified

1. ✅ `lib/signals/dns.ts` - Added WHOIS governance data extraction
2. ✅ `lib/signals/subdomains.ts` - Added certificate issuance counting
3. ✅ `lib/signals/types.ts` - Updated type definitions
4. ✅ `lib/llm/prompts.ts` - Added governance signal framing rules

---

## 🚀 Deployment Status

- ✅ Build passing
- ✅ Zero TypeScript errors
- ✅ Zero new dependencies
- ✅ Zero environment variable changes
- ✅ Zero database schema changes (signals stored in JSONB)
- ✅ All enhancements follow locked Tier 1 rules

---

## 🎉 What This Achieves

### **For Business Owners**:
1. **Ownership clarity** without exposure
2. **Governance awareness** without blame
3. **Infrastructure visibility** without fear
4. **Continuity questions** without accusations

### **For Monetization**:
1. **Stronger assumptions section** ("You're assuming...")
2. **Better questions** ("Who has registrar access?")
3. **Clearer gaps** between Tier 1 (awareness) and Tier 2 (answers)

### **For Tier 2 Positioning**:
- Tier 1: "Your domain renews in 5 months"
- Tier 2: "Alert me 60 days before renewal"
- Tier 1: "Certificate reissued 3 times last year"
- Tier 2: "Show me what changed and when"
- Tier 1: "Registrar and DNS are separate"
- Tier 2: "Map all vendor access and document it"

---

## ✅ Tier 1 Completion Status

**Overall**: 95-98% complete

**What's left** (Optional, not required):
- ⏸️ Geographic hosting awareness (careful tone needed)
- ⏸️ DNS record complexity indicator (can feel vague)

**What's explicitly excluded** (Never add):
- ❌ Page speed / Lighthouse scores
- ❌ CVEs, versions, vulnerabilities
- ❌ Open port lists
- ❌ "Risk levels", "severity", "health scores"
- ❌ Uptime checks
- ❌ Active scanning
- ❌ Compliance claims

---

## 🎯 Next Steps

### **Immediate**:
1. Deploy this build to production
2. Test with real domains
3. Verify LLM output uses correct framing

### **Near-term** (Week 1-2):
1. Monitor user engagement with governance signals
2. Collect feedback on assumptions section
3. Refine framing if needed (without changing data)

### **Future** (Tier 2 Definition):
1. Define Tier 2 as "change over time"
2. SecurityTrails integration ($500/mo) - DNS/WHOIS history
3. Alerting & monitoring
4. Historical comparisons

---

## 📋 Summary for User

You now have:

✅ **Domain governance clarity** (expiry, ownership type, transfer locks)  
✅ **Vendor separation awareness** (registrar ≠ DNS)  
✅ **Certificate activity observability** (issuance count)  
✅ **Email provider identification** (Google/Microsoft/Custom)  
✅ **HTTPS enforcement status** (redirect behavior)

All with:
- $0 additional cost
- Zero fear language
- Zero judgment
- Perfect Tier 1 framing
- Strong monetization positioning

**Tier 1 is now 95%+ complete. Ready to lock and focus on Tier 2 definition.**
