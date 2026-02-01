---
title: "You Got a Security Warning About Your Website: Here's What to Do"
slug: "website-security-warning-fix-guide"
publishDate: "2026-04-12"
description: "Your website is showing a security warning and you're panicking. Here's what different warnings mean and how to fix them step by step."
keywords: ["website security warning", "fix SSL warning", "site may be hacked", "connection not private"]
category: "Emergency"
---

# You Got a Security Warning About Your Website: Here's What to Do

You open your website and see: **"Your connection is not private"** or **"This site may be hacked"** or **"Deceptive site ahead."**

Or worse: a customer emails you a screenshot of the warning they're seeing.

Here's what these warnings mean, why they appear, and exactly what to do to fix them.

---

## Types of Security Warnings (And What They Mean)

### 1. "Your Connection Is Not Private" (SSL/HTTPS Warning)

**What it looks like**:
- Browser blocks access with warning screen
- Says "NET::ERR_CERT_DATE_INVALID" or similar
- Shows broken padlock or "Not Secure" in address bar

**What it means**: Your SSL certificate has a problem

**Common causes**:
- SSL certificate expired
- SSL not installed
- SSL installed incorrectly
- Mixed content (HTTP and HTTPS on same page)

**Severity**: High. Browsers block access. Customers can't reach your site (unless they click "proceed anyway," which most won't).

---

### 2. "This Site May Be Hacked" (Malware Warning)

**What it looks like**:
- Google warning page before reaching site
- Says "This site may harm your computer"
- Red warning screen

**What it means**: Google detected malware or malicious code on your site

**Common causes**:
- Your site was actually hacked
- Malicious code injected into pages
- Compromised plugins or themes
- Hosting account compromised

**Severity**: Critical. Google blacklists your site. All traffic stopped.

---

### 3. "Deceptive Site Ahead" (Phishing Warning)

**What it looks like**:
- Google warning page
- Says site is "deceptive" or "phishing"
- Blocks access

**What it means**: Google thinks your site is trying to steal user information

**Common causes**:
- Your site was hacked and turned into phishing page
- False positive (rare)
- Compromised advertising or third-party content

**Severity**: Critical. Complete traffic block.

---

### 4. "Certificate Error" or "Certificate Not Trusted"

**What it looks like**:
- Browser warning about certificate
- Says certificate is from wrong domain
- Certificate issuer not trusted

**What it means**: SSL certificate doesn't match your domain or isn't from trusted authority

**Common causes**:
- Self-signed certificate (not trusted)
- Certificate for different domain
- Certificate not installed properly

**Severity**: High. Most users won't proceed.

---

## How to Fix: SSL/HTTPS Warnings

### Problem: SSL Certificate Expired

**How to check**:
- Look at browser error details
- Check expiration date in certificate info

**How to fix**:
1. Log into your hosting control panel
2. Find SSL/TLS section
3. Renew or install new SSL certificate

**If using Let's Encrypt (free SSL)**:
- Should auto-renew. Check why auto-renewal failed
- Manually trigger renewal
- Fix underlying issue (permissions, DNS, etc.)

**If using paid SSL**:
- Purchase renewal
- Install new certificate
- Update any hardcoded references

**Time to fix**: 15 minutes - 2 hours

---

### Problem: No SSL Certificate Installed

**How to check**: Visit https://yoursite.com — does it load?

**How to fix**:
1. Most hosts offer free SSL (Let's Encrypt)
2. Log into hosting control panel
3. Find SSL/TLS section
4. Click "Install SSL" or "Enable HTTPS"
5. Wait 10-30 minutes for activation

**Alternative**: Use Cloudflare (free SSL)
- Sign up for Cloudflare
- Point your DNS to Cloudflare
- Enable SSL in Cloudflare settings

**Time to fix**: 30 minutes - 2 hours

---

### Problem: Mixed Content (HTTP and HTTPS)

**What it means**: Your site loads over HTTPS, but images/scripts load over HTTP

**How to check**: Browser console shows "mixed content" errors

**How to fix**:
1. Update all internal links to use https:// instead of http://
2. Use protocol-relative URLs (//example.com instead of http://example.com)
3. Use a plugin to fix (WordPress: Really Simple SSL)
4. Search database for http:// references, replace with https://

**Time to fix**: 30 minutes - 4 hours (depending on site size)

---

### Problem: Wrong Domain on Certificate

**What it means**: Certificate is for different domain (e.g., cert for example.com but site is www.example.com)

**How to fix**:
- Install certificate that covers all variations
- Use wildcard certificate (*.example.com)
- Set up proper redirects

**Time to fix**: 1-2 hours

---

## How to Fix: Malware/Hacked Site Warnings

### Step 1: Verify Your Site Is Actually Hacked

**Check Google Search Console**:
- Log into Search Console
- Check Security Issues section
- See what Google flagged

**Scan your site**:
- Sucuri SiteCheck (free online scanner)
- VirusTotal
- Your hosting provider's malware scanner

**Signs of compromise**:
- Unknown files in directories
- Modified core files
- Suspicious database entries
- Unexpected admin users

Security warnings often surface during [insurance applications](/use-cases#insurance-renewal) or [due diligence reviews](/use-cases#business-acquisition). See [typical security configurations](/examples) that pass insurance and compliance requirements.

---

### Step 2: Take Site Offline (Temporarily)

**Put up maintenance page**:
- Prevents visitors from seeing hacked content
- Stops malware from spreading
- Protects visitors

**How**:
- Use hosting control panel "maintenance mode"
- Or upload simple maintenance.html page
- Or use Cloudflare to show custom page

---

### Step 3: Clean the Infection

**Option 1: Restore from backup** (if you have clean backup)
- Restore site from before infection
- Update all passwords
- Update all software immediately

**Option 2: Manual cleanup** (if no backup)
- Remove malicious files
- Clean infected files
- Remove backdoors
- Check database for malicious entries

**Option 3: Hire professional cleanup**
- Sucuri, WordFence, or similar service
- Cost: $200-$500+
- They handle investigation, cleanup, and hardening

**Time**: 2-24 hours depending on severity

---

### Step 4: Harden Security

**After cleaning**:
- Update all passwords (hosting, FTP, database, admin accounts)
- Update all software (WordPress, plugins, themes)
- Install security plugin (WordFence, Sucuri)
- Remove unused plugins/themes
- Disable file editing in WordPress
- Set up proper file permissions

---

### Step 5: Request Review from Google

**Once site is clean**:
1. Log into Google Search Console
2. Go to Security Issues
3. Click "Request Review"
4. Explain what you fixed
5. Submit

**Review time**: 1-7 days

**Note**: Don't request review until site is actually clean. False submissions delay the process.

---

## How to Fix: Phishing Warnings

**Same process as malware warnings**:
1. Verify the issue in Google Search Console
2. Take site offline
3. Remove phishing content
4. Harden security
5. Request review from Google

**Additional step**: Check for compromised forms or login pages. Phishing often involves fake login screens.

---

## How to Check If Warning Is Real

### For SSL Warnings
**Always real.** Browser wouldn't show warning unless there's an actual certificate problem.

---

### For Malware/Phishing Warnings
**Usually real, but occasionally false positives.**

**How to verify**:
- Check Google Search Console (definitive source)
- Scan site with multiple tools
- Review files for modification dates
- Check hosting logs for suspicious activity

**If false positive**:
- Request review with detailed explanation
- Provide evidence it's a false positive

---

## Prevention: How to Avoid These Warnings

### For SSL Warnings
1. **Use auto-renewing SSL** (Let's Encrypt)
2. **Set calendar reminder** 30 days before manual SSL expires
3. **Monitor SSL status** (use UptimeRobot or similar)
4. **Test HTTPS regularly** to catch mixed content issues

---

### For Malware/Hacking
1. **Keep everything updated** (WordPress, plugins, themes, server software)
2. **Use strong passwords** (unique, complex, stored in password manager)
3. **Install security plugin** (WordFence, Sucuri, iThemes Security)
4. **Regular backups** (daily or weekly)
5. **Remove unused plugins/themes**
6. **Limit login attempts**
7. **Use two-factor authentication** on admin accounts

---

## Common Questions

### "How did my site get hacked?"
**Most common causes**:
- Outdated plugins or themes with known vulnerabilities
- Weak passwords
- Shared hosting compromise (neighboring site infected yours)
- Compromised FTP/hosting credentials

---

### "Can I just ignore the warning?"
**No.** 
- Most visitors will leave immediately
- Google may de-index your site
- Other sites may blacklist you
- Existing infection can spread

**Bottom line**: Fix it immediately.

---

### "How long until the warning goes away?"
**For SSL issues**: Immediately after fixing (users may need to clear cache)

**For malware/phishing**: 1-7 days after cleanup and Google review

**Note**: If warning persists after fix, you may have missed something or Google is still reviewing.

---

### "Will this hurt my search rankings?"
**Yes.**
- Google de-ranks sites with security warnings
- Can take weeks to recover after fixing
- Lost traffic during warning period

**Fix quickly to minimize damage.**

---

### "Should I hire someone?"
**Hire help if**:
- You're not technical
- Site is hacked (malware/phishing)
- SSL issue is complex
- You can't afford extended downtime

**DIY if**:
- Simple SSL expiration
- You have good backups
- Issue is clearly identified
- You're comfortable with hosting panel

---

## What to Tell Customers

**If your site is showing warnings**:

**Short-term** (while fixing):
- "We're aware of a technical issue and working to resolve it"
- "Site will be back shortly"
- Provide alternative contact method (phone, email, social media)

**After fixing**:
- "Issue resolved. Site is secure and safe to use"
- Don't over-explain technical details
- Focus on "back to normal"

**Don't**:
- Downplay it ("just a small issue")
- Blame your IT provider publicly
- Provide play-by-play updates

---

## Emergency Checklist (Print This)

**When you see a security warning**:

☐ Take screenshot of exact warning message  
☐ Check Google Search Console (if applicable)  
☐ Scan site with online malware scanner  
☐ Contact hosting provider immediately  
☐ Take site offline if actively compromised  
☐ Restore from backup (if clean backup exists)  
☐ Update all passwords  
☐ Clean infection or fix SSL issue  
☐ Test thoroughly  
☐ Request Google review (if applicable)  
☐ Monitor for recurrence  

---

## When to Call for Help Immediately

**Call hosting provider or security expert if**:
- Site is completely down
- You see "This site may be hacked" warning
- Customer data may be compromised
- You don't know how to fix SSL issues
- Infection keeps coming back after cleanup
- You're losing significant revenue

**Don't wait**: Security warnings cost you traffic and trust every minute they're live.

---

## Bottom Line

**Security warnings mean something is wrong. Fix it immediately.**

**For SSL warnings**: Usually simple fix (renew certificate, enable HTTPS)

**For malware warnings**: More serious. Clean thoroughly, harden security, request review.

**Prevention is cheaper than cure**: Keep software updated, use strong passwords, regular backups.

**When in doubt**: Hire help. $200-500 for professional fix is cheaper than extended downtime and lost business.

---

**Many owners only realize these gaps after something changes** — a vendor leaves, a certificate expires, or an insurance renewal asks unexpected questions.

Explain My IT exists to create a dated, owner-readable record of what's visible from the outside — so you don't have to reconstruct this later.

---

**Ready to see your IT setup?**

🎯 **[Run your free snapshot →](/pricing)** — See your current configuration in 60 seconds

📅 **Want this monthly with full history?** [See Basic subscription →](/pricing) ($15/month)

---

**Related reading:**
- [SSL Certificates: What They Are and Why They Matter](/blog/ssl-certificates-business)
- [How to Know If Your IT is Actually Secure](/blog/know-if-it-is-secure)
- [The Business Owner's Quarterly IT Review Checklist](/blog/quarterly-it-review-checklist)
