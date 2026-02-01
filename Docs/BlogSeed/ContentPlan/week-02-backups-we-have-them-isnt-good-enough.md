---
title: "Backups: Why 'We Have Them' Isn't Good Enough"
slug: "backups-we-have-them-isnt-good-enough"
publishDate: "2026-02-15"
description: "Having backups and having working backups are two different things. Here's what business owners need to verify about their backup strategy."
keywords: ["business backups", "test IT backups", "backup strategy", "data recovery"]
category: "Practical"
---

# Backups: Why 'We Have Them' Isn't Good Enough

**Question**: "Do you have backups of your website and business data?"

**Most business owners**: "I think so? My IT person said they set that up."

**The problem**: "We have backups" and "we have *tested* backups that we can actually restore" are very different things.

And most business owners don't know which one they have until something breaks.

---

## Why "We Have Backups" Isn't Reassuring

Here's what usually happens:

1. Your IT person or hosting provider says "backups are configured"
2. You assume this means everything is backed up and restorable
3. Years pass, nothing breaks, you never think about it again
4. Something catastrophic happens (hack, server failure, accidental deletion)
5. You ask to restore from backup
6. **Reality check**: The backups don't exist, are incomplete, are corrupted, or can't be restored

By then, it's too late.

---

## The Uncomfortable Truth About Backups

**Having backups means nothing if you can't restore them.**

It's like having a fire extinguisher that's never been tested. You assume it works. But when there's an actual fire, you discover it's empty or broken.

**Common backup failures**:
- Backups were never actually configured (someone *said* they'd do it)
- Backups run but fail silently (no one checks the logs)
- Backups exist but are stored on the same server (so if the server dies, backups die too)
- Backups are encrypted and no one has the password
- Backups are incomplete (missing databases, files, or configuration)
- Backups are so old they're useless (last one from 2 years ago)
- Restoration process was never tested (theory vs. reality)

The only way to know backups work: **Test restoration at least once.**

---

## What Should Be Backed Up?

Most business owners don't think through what actually needs to be backed up. Here's a checklist:

### 1. **Website Files**
- HTML, CSS, JavaScript, images
- Theme files (if using WordPress, etc.)
- Configuration files

**Why it matters**: If your website is hacked or deleted, you need these files to rebuild.

---

### 2. **Database**
- Content (blog posts, pages, products)
- User data
- Settings and configuration

**Why it matters**: Your website might look fine without the database, but all your content is stored there. Lose the database = lose everything.

---

### 3. **Email**
- Inbox, sent items, archives
- Contacts
- Calendar (if applicable)

**Why it matters**: Some businesses lose years of client correspondence when email isn't backed up.

**Note**: If you use Google Workspace or Microsoft 365, your email is *usually* backed up by the provider. Verify this. Also verify you can export your data if you ever need to leave.

---

### 4. **Business Files**
- Documents, spreadsheets, presentations
- Images, videos, assets
- Contracts, invoices, records

**Why it matters**: Losing business files means losing operational history, financial records, and client work.

**Where these might be**: Google Drive, Dropbox, local computers, servers

---

### 5. **Code and Repositories**
- Custom software or applications
- Integrations
- Configuration scripts

**Why it matters**: If you have custom software, losing code means starting over from scratch.

**Note**: If you use GitHub, GitLab, or Bitbucket, your code is *likely* backed up. Verify this with your developer.

---

### 6. **Configuration and Credentials**
- DNS settings
- API keys
- Server configurations
- Access credentials (documented securely)

**Why it matters**: Rebuilding infrastructure is 10x harder if you don't know how it was configured.

---

## Backup Frequency: How Often Is Enough?

**Answer**: It depends on how much data you can afford to lose.

### Daily Backups
**Good for**: Active websites, frequently updated content, e-commerce

**Why**: If your site is hacked today and you restore from yesterday's backup, you lose 1 day of data. Acceptable for most businesses.

---

### Weekly Backups
**Good for**: Static websites that rarely change, personal sites

**Why**: Cheaper, lower overhead. But if something breaks on day 6, you lose 6 days of changes.

---

### Real-Time/Hourly Backups
**Good for**: High-traffic e-commerce, SaaS platforms, critical applications

**Why**: Minimizes data loss. Expensive and complex. Overkill for most small businesses.

---

### What About Retention?

**Retention**: How long you keep old backups.

**Minimum**: 30 days (allows you to go back if an issue isn't discovered immediately)

**Better**: 90 days

**Best**: 1 year+ for critical data

**Why this matters**: Sometimes you don't discover a problem immediately. If your only backup is from yesterday, and the problem started 2 weeks ago, you're stuck.

---

## Where Should Backups Be Stored?

### ❌ **Worst Option**: Same Server as Your Website

**Why it's bad**: If the server crashes, gets hacked, or is deleted, your backups are gone too.

**Analogy**: Storing your house key inside your house doesn't help if you're locked out.

---

### ⚠️ **Risky Option**: Same Hosting Provider, Different Server

**Why it's risky**: If your hosting provider has an outage or your account is compromised, both your site and backups could be affected.

**When it's okay**: If it's a major provider (AWS, Google Cloud) with strong redundancy and you trust their infrastructure.

---

### ✅ **Better Option**: Different Provider

**Why it's better**: If your hosting provider goes down, your backups are elsewhere. True redundancy.

**Example**: Site hosted on Bluehost, backups stored on AWS S3 or Google Drive.

---

### ✅ **Best Option**: Multiple Locations (3-2-1 Rule)

**The 3-2-1 backup rule**:
- **3** copies of your data
- **2** different storage types (e.g., cloud + local)
- **1** copy offsite (different physical location)

**Why it's best**: Maximum redundancy. Almost impossible to lose everything.

**For most businesses**: This is overkill. Offsite cloud backups are usually enough.

---

## The Testing Problem

**You don't have backups until you've tested restoration.**

Most businesses *think* they have backups. But they've never actually restored from them. So when disaster strikes, they discover:
- The backup files are corrupted
- The restoration process doesn't work
- Critical data is missing from the backup
- No one knows how to restore (the person who set it up is gone)

### How to Test Your Backups

**Option 1: Full Restoration Test (Best)**
1. Spin up a test environment (separate server/staging site)
2. Attempt full restoration from backup
3. Verify everything works (site loads, database intact, files present)
4. Document the restoration process

**How often**: At least once per year

---

**Option 2: Spot Check (Easier)**
1. Download a recent backup
2. Open it and verify files are present
3. Check that database exports aren't empty
4. Verify backup isn't corrupted (open files, check sizes)

**How often**: Quarterly

---

**Option 3: Ask Your Provider (Minimum)**
1. Ask your hosting provider or IT person: "Can you show me the last successful backup?"
2. Ask: "Can you walk me through how restoration works?"
3. Ask: "When was the last time we tested restoration?"

If they can't answer confidently, that's a problem.

---

## Red Flags: Your Backup Strategy Might Not Exist

### 1. **"I think we have backups"**
If you're not *certain*, you probably don't have a reliable backup strategy.

### 2. **"My hosting provider handles it"**
Some do. Many don't. Or they backup only certain things (files but not database, or vice versa). This often becomes an issue during [business acquisitions](/use-cases#business-acquisition) when due diligence requires proof of backups, or during [insurance renewals](/use-cases#insurance-renewal) when policies require documented backup procedures.

**Verify**: Log into your hosting account and check backup settings. Can you see backup files? Can you download them?

### 3. **"We back up locally"**
Backing up to the same server, same building, or same computer as your live data is not a real backup.

### 4. **"Backups run automatically"**
Automatic doesn't mean successful. If no one checks logs or tests restoration, automatic backups often fail silently for months.

### 5. **"We used to have backups, but..."**
Backups that were set up years ago often break when configurations change, servers migrate, or software updates. If no one maintains them, they stop working.

---

## Common Backup Mistakes

### Mistake #1: Assuming Your Host Backs Everything Up

**Reality**: Many hosting providers back up files but not databases. Or vice versa. Or they backup but only keep 7 days. Or they "don't guarantee" backups in their terms of service.

**What to do**: Read your hosting plan. Ask explicitly: "What is backed up, how often, and for how long?"

---

### Mistake #2: Storing Backups Only on the Same Server

**Reality**: If the server dies, your backups die with it.

**What to do**: Store backups offsite (cloud storage, different provider, separate location).

---

### Mistake #3: Never Testing Restoration

**Reality**: Backups that look fine but can't be restored are useless. [See examples of what tested, verified backups actually look like](/examples).

**What to do**: Test restoration at least once a year. Document the process. [Monthly IT reviews](/why-monthly) are a perfect time to verify your last backup date.

---

### Mistake #4: No One Knows Where Backups Are

**Reality**: IT person leaves. Contractor disappears. No one knows where backups are stored or how to access them.

**What to do**: Document where backups are stored, how to access them, and who has credentials.

---

### Mistake #5: Forgetting About Email

**Reality**: Website backups don't include email. Many businesses lose years of correspondence.

**What to do**: Verify email is backed up separately. If using Gmail/Outlook, export periodically.

---

## Questions to Ask Your IT Person (or Hosting Provider)

If you're not sure about your backup situation, ask these questions:

1. **What is backed up?** (Website files? Database? Email? Business files?)
2. **How often are backups run?** (Daily? Weekly? Real-time?)
3. **Where are backups stored?** (Same server? Cloud? Different provider?)
4. **How long are backups kept?** (30 days? 90 days? Forever?)
5. **Can I access backups myself?** (Or do I need to ask you every time?)
6. **When was the last successful backup?** (Can you show me the logs?)
7. **When was the last time we tested restoration?** (Ever?)
8. **How long would it take to restore everything if the site went down?** (Hours? Days?)
9. **What's not backed up?** (This question often reveals gaps)

If they can't answer these clearly, your backup strategy probably needs work.

---

## What a Good Backup Strategy Looks Like

### Minimum Standard (Small Business)
- **Daily backups** of website (files + database)
- **Stored offsite** (different provider or cloud storage)
- **30 days retention**
- **Tested at least once per year**
- **Documented process** for restoration

**Cost**: $5-20/month for backup storage + setup time

---

### Better Standard (Growing Business)
- **Daily backups** with real-time monitoring
- **Multiple storage locations** (cloud + local)
- **90 days retention**
- **Quarterly restoration tests**
- **Email backups** included
- **Automated alerts** if backups fail

**Cost**: $20-50/month + management time

---

### Premium Standard (High-Stakes Business)
- **Real-time or hourly backups**
- **3-2-1 rule** (multiple copies, different storage types, offsite)
- **1 year+ retention**
- **Quarterly restoration tests + annual full disaster recovery drill**
- **Versioning** (can restore from any point in time)
- **Dedicated backup management**

**Cost**: $100-500+/month + significant management

**For most small businesses, the minimum standard is enough.** Just make sure you actually have it.

---

## How to Set Up Backups (If You Don't Have Them)

### Option 1: Hosting Provider Backups
**Check if your hosting provider offers backups**:
- Log into your hosting control panel
- Look for "Backups" or "Backup Manager"
- Enable daily backups if available
- Set retention to 30+ days
- Verify you can download backups yourself

**Pros**: Easy, usually cheap or free  
**Cons**: Stored with same provider (less redundancy)

---

### Option 2: Backup Plugins (WordPress)
**If you use WordPress**:
- Install a backup plugin (UpdraftPlus, BackWPup, BlogVault)
- Configure daily backups (files + database)
- Store backups on cloud storage (Google Drive, Dropbox, AWS S3)
- Test restoration once

**Pros**: Independent of hosting provider, easy to set up  
**Cons**: Requires you to manage the plugin

---

### Option 3: Managed Backup Service
**Hire a service to manage backups**:
- CodeGuard, VaultPress, or similar
- They handle setup, monitoring, alerts, and restoration

**Pros**: Hands-off, professional management  
**Cons**: More expensive ($10-50/month)

---

### Option 4: Have Your IT Provider Do It
**Ask your IT provider or developer** to:
- Set up automated daily backups
- Store backups offsite
- Document the restoration process
- Test restoration once

**Pros**: Professional setup, integrated with your infrastructure  
**Cons**: Costs more upfront, depends on provider quality

---

## What to Do If You Don't Have Backups

**Step 1: Don't panic, but act now.**

**Step 2: Prioritize what needs backing up most:**
- Website (files + database)
- Email (if not using Gmail/Outlook)
- Business files (documents, spreadsheets, client work)

**Step 3: Set up backups for #1 priority immediately:**
- If website: Use hosting provider backups or a plugin
- If email: Use export tools or enable backup in Gmail/Outlook
- If files: Use cloud storage with versioning (Google Drive, Dropbox)

**Step 4: Test restoration within 30 days:**
- Don't wait. Test now while you have time.

**Step 5: Document the process:**
- Where backups are stored
- How to access them
- How to restore them

**Step 6: Schedule quarterly checks:**
- Verify backups are still running
- Verify you can still access them

---

## The Bottom Line for Business Owners

**You don't have backups until you've tested restoration.**

"We have backups" is reassuring. "We restored from backup last month to verify it works" is confidence.

**Backups are insurance.** You hope you never need them. But when you do, you need them to work.

**The cost of good backups**: $5-50/month  
**The cost of no backups when disaster strikes**: Rebuilding everything from scratch, lost data, lost revenue, lost client trust

**Most businesses learn this lesson the hard way.** Don't be one of them.

---

**Many owners only realize these gaps after something changes** — a vendor leaves, a certificate expires, or an insurance renewal asks unexpected questions.

Explain My IT exists to create a dated, owner-readable record of what's visible from the outside — so you don't have to reconstruct this later.

---

**Ready to see your IT setup?**

🎯 **[Run your free snapshot →](/pricing)** — See your current configuration in 60 seconds

📅 **Want this monthly with full history?** [See Basic subscription →](/pricing) ($15/month)

---

**Related reading:**
- [How to Know If Your IT is Actually Secure](/blog/know-if-it-is-secure)
- [The Business Owner's Quarterly IT Review Checklist](/blog/quarterly-it-review-checklist)
- [How to Audit Your IT When You Don't Know What You're Looking For](/blog/audit-it-non-technical)
