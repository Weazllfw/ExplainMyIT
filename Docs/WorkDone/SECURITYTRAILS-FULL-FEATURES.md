# SecurityTrails: Full Feature Breakdown

**Cost**: $49/month for 2,000 API calls  
**What You Get**: Way more than just subdomains

---

## Core Features (All Included)

### **1. Subdomain Enumeration** ⭐
**Endpoint**: `/domain/{domain}/subdomains`

**What you get**:
```json
{
  "subdomains": ["www", "mail", "dev", "staging", "api", ...],
  "meta": {
    "total_count": 47
  }
}
```

**Business value**:
- "We found 47 subdomains under your domain"
- "4 appear to be abandoned (dev, test, old-site, 2019)"
- Forgotten infrastructure = security blind spots

---

### **2. DNS History** 🔥
**Endpoint**: `/history/{domain}/dns/{type}`

**What you get**:
Historical changes to DNS records over time:
- A records (IP addresses)
- MX records (mail servers)
- NS records (nameservers)
- TXT records (SPF/DMARC changes)

**Example**:
```json
{
  "records": [
    {
      "values": ["192.168.1.1"],
      "first_seen": "2023-01-15",
      "last_seen": "2024-06-10"
    },
    {
      "values": ["54.23.45.67"],
      "first_seen": "2024-06-11",
      "last_seen": "2026-01-30"
    }
  ]
}
```

**Business value**:
- "Your email server changed 3 times in the last year"
- "Your DNS was migrated from GoDaddy to Cloudflare in June 2024"
- "Your website moved from on-prem to AWS 8 months ago"

**This is HUGE for Tier 1**: Shows infrastructure changes owners might not remember!

---

### **3. WHOIS History** 📋
**Endpoint**: `/history/{domain}/whois`

**What you get**:
Historical WHOIS changes:
- Registrar changes
- Ownership changes
- Contact detail updates
- Registration/expiry date changes

**Business value**:
- "Your domain registrar changed 2 years ago"
- "Your domain contact info was updated 6 months ago"
- Change detection = governance visibility

---

### **4. Associated Domains**
**Endpoint**: `/domain/{domain}/associated`

**What you get**:
Domains sharing infrastructure with yours:
- Same IP address
- Same nameservers
- Same mail servers

**Business value** (less relevant for Tier 1):
- Detect shared hosting environments
- Identify multi-tenant risks

---

### **5. Company Enrichment**
**Endpoint**: `/company/{domain}`

**What you get**:
Company metadata:
- Organization name
- Industry
- Employee count (estimate)
- Technology stack

**Business value** (Tier 2 potential):
- Contextualize findings by company size
- "For a 50-person company, your setup is typical"

---

### **6. IP Intelligence**
**Endpoint**: `/ips/nearby/{ip}`

**What you get**:
- Reverse DNS
- IP geolocation
- ASN (network owner)
- Historical IP neighbors

**Business value**:
- Confirm hosting provider
- Detect infrastructure migrations

---

## What's Most Valuable for Tier 1?

### **Must Use** (Tier 1):
1. ✅ **Subdomain Enumeration** - Core feature, high business value
2. ✅ **DNS History** (MX, NS) - Shows infrastructure changes over time

### **Nice to Have** (Tier 1):
3. ⭐ **WHOIS History** - Shows governance changes (registrar, contacts)

### **Save for Later** (Tier 2):
4. ⏸️ Associated Domains - More technical, less owner-relevant
5. ⏸️ Company Enrichment - Better for Tier 2 contextualization
6. ⏸️ IP Intelligence - Too technical for Tier 1

---

## What I'd Implement for $49/Month

If you pay for SecurityTrails, here's what I'd build:

### **Phase 1** (Week 1 - Core Value):
```typescript
// 1. Subdomain enumeration (primary feature)
const subdomains = await getSubdomains(domain);
// → "12 subdomains found, 4 potentially abandoned"

// 2. DNS history for MX records (email changes)
const mxHistory = await getDnsHistory(domain, 'mx');
// → "Your mail server changed 3 times in the last 12 months"

// 3. DNS history for NS records (DNS provider changes)
const nsHistory = await getDnsHistory(domain, 'ns');
// → "Your DNS was migrated to Cloudflare 8 months ago"
```

**LLM Narrative Enhancement**:
- Email block: "Your email server configuration has changed X times recently"
- DNS block: "Your DNS provider was changed X months ago"
- New Assumptions: "You're assuming DNS migrations were properly documented"

---

### **Phase 2** (Week 2-3 - Historical Context):
```typescript
// WHOIS history (registrar changes)
const whoisHistory = await getWhoisHistory(domain);
// → "Your registrar was changed from GoDaddy to Namecheap 2 years ago"
```

**LLM Enhancement**:
- Owner Summary: Mention significant infrastructure changes
- Top Findings: "Recent infrastructure migration detected"

---

### **Phase 3** (Future - Tier 2):
- Associated domains (shared hosting detection)
- Company enrichment (size-based contextualization)

---

## Cost-Benefit Analysis

### **What You Pay**:
- SecurityTrails: $49/month
- Per snapshot (at 1,000/month): +$0.049

### **What You Get**:
1. **Subdomains**: Surface area awareness
2. **DNS History**: Infrastructure change detection
3. **WHOIS History**: Governance change visibility
4. **2,000 API calls/month**: Room for 3 calls per snapshot if needed

### **Total Snapshot Cost**:
- Before: $0.03 (LLM only)
- After: $0.079 (LLM + SecurityTrails)
- **Increase**: +163%

### **Is It Worth It?**

**YES if**:
- Subdomain/history data drives conversions
- You're doing 100+ snapshots/month (under $0.50 per snapshot)
- Users engage with "change detection" narratives

**NO if**:
- You're doing <50 snapshots/month ($1+ per snapshot)
- Users don't care about historical data
- Budget is very tight

---

## My Honest Recommendation

### **For Tier 1 Launch**:

**Don't start with SecurityTrails**. Here's why:

1. **You haven't proven subdomain value yet**
   - Test with free crt.sh first
   - See if users engage

2. **DNS/WHOIS history is Tier 2 material**
   - "Your DNS changed 3 times" = more advanced than Tier 1 needs
   - Save this for paid tiers

3. **$49/month hurts at low volume**
   - At 100 snapshots/month = $0.49 per snapshot (expensive!)
   - At 1,000 snapshots/month = $0.05 per snapshot (reasonable)

---

### **Better Strategy**:

**Phase 1** (Launch):
- Use **crt.sh (free)** for subdomains only
- Monitor engagement
- **Cost**: $0

**Phase 2** (After 100-200 snapshots):
- Add **SecurityTrails** if subdomain data drives conversions
- Use for: Subdomains + DNS history (MX/NS changes)
- **Cost**: $49/month

**Phase 3** (Tier 2):
- Add WHOIS history
- Add associated domains
- Add company enrichment
- **Value**: Premium features for paid customers

---

## Full Feature Matrix

| Feature | Tier 1 Value | Implementation Effort | Cost |
|---------|--------------|---------------------|------|
| **Subdomains** | ⭐⭐⭐⭐⭐ High | 30 min | Free (crt.sh) or $49 (ST) |
| **DNS History (MX)** | ⭐⭐⭐⭐ High | 45 min | $49 (SecurityTrails) |
| **DNS History (NS)** | ⭐⭐⭐ Medium | 30 min | $49 (SecurityTrails) |
| **WHOIS History** | ⭐⭐ Low (Tier 2) | 45 min | $49 (SecurityTrails) |
| Associated Domains | ⭐ Low (Tier 2) | 1 hour | $49 (SecurityTrails) |
| Company Data | ⭐ Low (Tier 2) | 1 hour | $49 (SecurityTrails) |

---

## What Else Could You Use $49/Month For?

**Alternative investments**:
- Better LLM (GPT-4 instead of Haiku): More nuanced narratives
- Google Safe Browsing API: Reputation checking
- Email deliverability monitoring: Real-time blacklist tracking
- SSL monitoring service: Alert before certs expire
- More HIBP calls: Deeper breach analysis

**My take**: SecurityTrails is the best use of $49 if you're doing 200+ snapshots/month.

---

## Final Answer

### **What else do you get from SecurityTrails?**

Beyond subdomains:
1. ✅ **DNS History** (see infrastructure changes over time)
2. ✅ **WHOIS History** (see registrar/contact changes)
3. ✅ Associated Domains (shared infrastructure)
4. ✅ Company metadata (org info)
5. ✅ Historical IP data
6. ✅ 2,000 API calls/month (multiple endpoints per snapshot)

### **Should you buy it now?**

**No. Start with free crt.sh.**

**Upgrade when**:
- You've done 100+ snapshots
- Users engage with subdomain data
- You want DNS/WHOIS history for Tier 2

---

**Want me to implement the free crt.sh version for now?** (30 min, $0 cost, good enough for launch)
