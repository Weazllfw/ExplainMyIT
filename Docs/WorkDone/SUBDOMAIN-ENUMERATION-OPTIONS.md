# Subdomain Enumeration: Options & Cost Analysis

**Date**: January 30, 2026  
**Context**: Evaluating subdomain discovery for Tier 1 snapshots

---

## Overview

Subdomain enumeration reveals the **attack surface** and **forgotten infrastructure** for a domain. For business owners, this translates to:

**Business Value**:
- "We found 12 subdomains under your domain"
- "4 appear to be abandoned (dev.example.com, old-site.example.com)"
- "Forgotten subdomains = forgotten security risks"

**Why It Matters**:
- Subdomains often host forgotten admin panels, dev servers, staging environments
- Owners typically don't know their full subdomain inventory
- This is **high-value, low-fear** data (perfect for your positioning)

---

## Option 1: SecurityTrails (Recommended)

**Website**: https://securitytrails.com  
**What It Does**: Comprehensive DNS history and subdomain discovery

### **Free Tier**:
- **Cost**: $0/month
- **Limit**: 50 API calls/month
- **Best for**: Testing and low-volume production

### **Paid Tier** (Recommended for production):
- **Cost**: $49/month
- **Limit**: 2,000 API calls/month
- **Cost per snapshot**: $0.024 (at full volume)

### **Data Quality**:
- **Subdomains**: Comprehensive (passive DNS aggregation)
- **Historical data**: First seen / last seen timestamps
- **Coverage**: Excellent (100M+ domains indexed)
- **Accuracy**: Very high (aggregates multiple DNS sources)

### **What You Get**:
```json
{
  "subdomains": [
    "www",
    "mail",
    "dev",
    "staging",
    "old-site",
    "api",
    "admin",
    ...
  ],
  "subdomain_count": 47
}
```

### **Pros**:
- ✅ Comprehensive coverage
- ✅ Historical data (first/last seen)
- ✅ Fast API (<500ms)
- ✅ Reliable uptime
- ✅ Great docs and support

### **Cons**:
- ❌ Paid tier required for meaningful volume
- ❌ Doesn't verify if subdomains are currently active

---

## Option 2: Shodan (Not Recommended for Tier 1)

**Website**: https://www.shodan.io  
**What It Does**: Internet-wide device search engine

### **Pricing**:
- **Cost**: $59/month (Academic: $49/month)
- **Limit**: Unlimited API calls
- **Query credits**: 100/month (additional $1 per 100)

### **Data Quality**:
- **Subdomains**: Good (from SSL certificates and HTTP crawls)
- **Bonus**: Port scans, service fingerprinting, vulnerability data
- **Coverage**: Good for public-facing services

### **Why NOT for Tier 1**:
- ❌ **Looks like "security scanning"** (conflicts with your positioning)
- ❌ More expensive than SecurityTrails
- ❌ Provides data you explicitly DON'T want to show (open ports, CVEs)
- ❌ Could scare owners or trigger legal concerns

### **Verdict**: Save Shodan for Tier 2 (Internal Insights) if at all

---

## Option 3: Certificate Transparency Logs (crt.sh)

**Website**: https://crt.sh  
**What It Does**: Free subdomain discovery from SSL certificates

### **Free API**:
- **Cost**: $0/month
- **Limit**: None (but rate-limited informally)
- **Best for**: Budget-conscious production

### **Data Quality**:
- **Subdomains**: Good (only shows subdomains with SSL certs)
- **Historical**: Yes (cert issuance dates)
- **Coverage**: Only HTTPS subdomains (misses HTTP-only)
- **Accuracy**: High (authoritative source)

### **What You Get**:
```json
{
  "subdomains": [
    "www.example.com",
    "mail.example.com",
    "api.example.com"
  ]
}
```

### **Pros**:
- ✅ **100% free**
- ✅ Legitimate data source (CT logs are public)
- ✅ No vendor lock-in
- ✅ Fast enough (<2 seconds)

### **Cons**:
- ❌ **Misses HTTP-only subdomains** (significant gap)
- ❌ Rate limiting (informal, unpredictable)
- ❌ No guaranteed SLA or support
- ❌ Less comprehensive than SecurityTrails

---

## Option 4: DIY (DNS Brute Force)

**What It Does**: Brute force common subdomain patterns

### **Cost**:
- **API Cost**: $0 (just DNS queries)
- **Time Cost**: 5-30 seconds per domain (slow)
- **Infrastructure**: Your server's DNS resolver

### **How It Works**:
```typescript
const commonSubdomains = [
  'www', 'mail', 'smtp', 'pop', 'imap',
  'ftp', 'ssh', 'vpn', 'remote',
  'dev', 'staging', 'test', 'uat',
  'api', 'app', 'admin', 'portal',
  'blog', 'shop', 'store',
  // ... 500+ patterns
];

for (const sub of commonSubdomains) {
  try {
    await dns.resolve4(`${sub}.${domain}`);
    // Subdomain exists!
  } catch {
    // Doesn't exist
  }
}
```

### **Pros**:
- ✅ **100% free**
- ✅ Real-time verification (actively resolves)
- ✅ No vendor dependency
- ✅ Can verify if subdomain is currently active

### **Cons**:
- ❌ **Very slow** (5-30 seconds)
- ❌ **Incomplete coverage** (only finds known patterns)
- ❌ Can trigger rate limits on target DNS servers
- ❌ Looks like scanning behavior
- ❌ Misses creative subdomain names

### **Verdict**: Avoid. Too slow and incomplete for production.

---

## Option 5: Hybrid Approach (Budget Option)

**Strategy**: Combine crt.sh (free) + DNS validation

### **How It Works**:
1. Query crt.sh for SSL-based subdomains (free, fast)
2. Validate each subdomain with DNS query (verify active)
3. Return only active subdomains

### **Cost**:
- **Total**: $0/month
- **Time**: ~2-4 seconds per domain

### **Data Quality**:
- **Coverage**: Good (70-80% of SecurityTrails)
- **Accuracy**: High (validated active subdomains)
- **Completeness**: Misses HTTP-only subdomains

### **Pros**:
- ✅ **Free**
- ✅ Validates active subdomains
- ✅ Fast enough for real-time
- ✅ Good enough for Tier 1

### **Cons**:
- ❌ Not as comprehensive as SecurityTrails
- ❌ Dependent on CT logs being up
- ❌ No historical data

---

## Cost Comparison

| Option | Monthly Cost | Per Snapshot | Coverage | Speed | Recommendation |
|--------|--------------|--------------|----------|-------|----------------|
| **SecurityTrails** | $49 | $0.024 | Excellent | Fast | ⭐ **Best** |
| Shodan | $59 | $0.059 | Good | Fast | ❌ Skip (wrong fit) |
| crt.sh | $0 | $0 | Good | Medium | ✅ Good budget option |
| DIY Brute Force | $0 | $0 | Poor | Very Slow | ❌ Avoid |
| **Hybrid (crt.sh + validate)** | $0 | $0 | Good | Medium | ✅ **Budget choice** |

---

## Recommendation Matrix

### **For Testing** (Now):
Use **crt.sh** (free)
- No cost commitment
- Test user reaction to subdomain data
- Validate business value

### **For Production Launch** (Week 1-2):
Upgrade to **SecurityTrails** ($49/month)
- Better coverage
- Reliable SLA
- Professional appearance
- Worth the cost if users engage with data

### **For Future** (Tier 2):
Consider **SecurityTrails + Shodan**
- SecurityTrails for subdomains
- Shodan for internal insights (behind auth)
- Total: $108/month

---

## Implementation Recommendation

### **Phase 1: Free Tier (Launch)**

Use the **Hybrid Approach** (crt.sh + validation):

```typescript
// lib/signals/subdomains.ts (free version)

export async function collectSubdomainSignals(domain: string) {
  // 1. Query crt.sh for SSL-based subdomains
  const certSubdomains = await queryCertificateTransparency(domain);
  
  // 2. Validate each (parallel DNS checks)
  const activeSubdomains = await validateSubdomains(certSubdomains);
  
  // 3. Identify abandoned patterns
  const abandoned = identifyAbandoned(activeSubdomains);
  
  return {
    subdomains: activeSubdomains,
    total_count: activeSubdomains.length,
    abandoned_count: abandoned.length,
    abandoned_list: abandoned,
  };
}
```

**Cost**: $0  
**Time**: ~2-4 seconds  
**Coverage**: 70-80% of SecurityTrails

---

### **Phase 2: Paid Upgrade (After Validation)**

Once you confirm users value subdomain data:

**Add SecurityTrails integration**:
- Sign up: https://securitytrails.com/app/signup
- Start with free tier (50 calls/month)
- Upgrade to paid if you hit limit ($49/month)

**Expected Timeline**: 2-4 weeks after launch

---

## Business Impact

### **For 100 Snapshots/Month**:

| Option | Monthly Cost | Total Cost with LLM |
|--------|--------------|---------------------|
| No subdomains | $0 | $3 (LLM only) |
| crt.sh (free) | $0 | $3 |
| SecurityTrails | $49 | $52 (+1733%) |

### **For 1,000 Snapshots/Month**:

| Option | Monthly Cost | Total Cost with LLM | Cost/Snapshot |
|--------|--------------|---------------------|---------------|
| No subdomains | $0 | $30 (LLM only) | $0.030 |
| crt.sh (free) | $0 | $30 | $0.030 |
| SecurityTrails | $49 | $79 (+163%) | **$0.079** |

**At scale, SecurityTrails adds only $0.05 per snapshot**

---

## User Experience Impact

### **Without Subdomains**:
"Your domain and website security are in good shape."

### **With Subdomains**:
"We found 12 subdomains under your domain, including 4 potentially abandoned ones (dev.example.com, test.example.com). Forgotten subdomains can become security blind spots."

**Conversion value**: This is **exactly** the kind of insight that drives "Oh, I didn't know that" moments.

---

## My Recommendation (Final)

### **For Your Specific Case**:

1. **Start with crt.sh (free)** in this deployment
   - Zero cost
   - Validates the feature
   - Good enough for Tier 1

2. **Monitor user engagement** (Umami events)
   - Track: "subdomain_section_expanded"
   - Track: "subdomain_count_displayed"

3. **Upgrade to SecurityTrails after 50-100 snapshots**
   - If users engage with subdomain data
   - $49/month is nothing if it drives conversions

4. **Skip Shodan entirely for Tier 1**
   - Wrong positioning fit
   - Save for Tier 2 (Internal Insights)

---

## Decision Framework

**Questions to answer before committing**:

1. **Will users understand subdomains?**
   - YES: Business owners recognize "dev.example.com" as "our test site"

2. **Is this scary or helpful?**
   - HELPFUL: Framed as "forgotten infrastructure" not "vulnerabilities"

3. **Does this fit "insights, not alerts"?**
   - YES: "You have X subdomains" = insight, not alarm

4. **Is it worth $49/month?**
   - MAYBE: Test with free crt.sh first, upgrade if validated

---

## Next Steps

**Option A: Start Free** (Recommended)
1. I implement crt.sh integration (30 min)
2. You deploy and test (1 day)
3. Monitor user engagement (1-2 weeks)
4. Upgrade to SecurityTrails if validated

**Option B: Go Paid Now**
1. You sign up for SecurityTrails ($49/month)
2. I implement SecurityTrails integration (45 min)
3. Deploy with full coverage from day 1

**Option C: Skip For Now**
1. Focus on other enhancements (security headers, etc.)
2. Add subdomains in Phase 2 after launch

---

## My Vote

**Start with Option A (crt.sh free)**:
- No financial risk
- Validates feature value
- Easy to upgrade later
- Good enough for Tier 1

**Then upgrade to SecurityTrails if**:
- >20% of users expand subdomain section
- Subdomain findings drive conversions
- You hit 50+ snapshots/month

---

**Want me to implement the free crt.sh version now, or skip subdomains for this release?**
