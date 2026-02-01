---
title: "Email Security: SPF, DKIM, and DMARC in Plain English"
slug: email-security-spf-dkim-dmarc
excerpt: "Someone could be sending emails that look like they're from you. Here's what SPF, DKIM, and DMARC do to prevent that - explained without the jargon."
publishedAt: 2026-01-31
readingTime: 7
seo:
  metaTitle: "Email Security Explained: SPF, DKIM, DMARC for Business Owners | Explain My IT"
  metaDescription: "Understand email security (SPF, DKIM, DMARC) in plain English. Learn why it matters for your business and how to verify it's actually configured."
  keywords:
    - SPF DKIM DMARC explained
    - email security business
    - prevent email spoofing
    - business email authentication
    - email security plain English
---

# Email Security: SPF, DKIM, and DMARC in Plain English

Someone could be sending emails that look like they're from you@yourcompany.com. Your customers receive them, thinking they're legitimate. But they're not from you - they're from a spammer using your business name.

This is called email spoofing, and it's surprisingly easy without proper email security. The bad news: it can damage your reputation and your customers' trust. The good news: three security measures prevent it - SPF, DKIM, and DMARC.

You've probably heard these terms from your IT person. They sound technical, but the concepts are straightforward. Here's what they actually do for your business.

## The Email Trust Problem

Email was designed in an era when everyone trusted everyone. There was no built-in way to prove an email was actually from who it claimed to be.

That's a problem today. Anyone can send an email that looks like it's from your business. The "From:" address can say anything - there's no automatic verification.

**Without email security:**
- Spammers can send emails from "you@yourcompany.com" (even though they don't control your domain)
- Recipients see your company name and trust the email
- Your reputation gets damaged by spam you didn't send
- Your legitimate emails might get flagged as suspicious

**With email security:**
- The email system checks: "Is this actually from yourcompany.com?"
- If yes, it gets delivered
- If no, it gets rejected or flagged
- Your legitimate emails are trusted, fake ones are caught

SPF, DKIM, and DMARC are the three systems that make this verification happen.

## SPF: The Authorized Sender List

SPF stands for "Sender Policy Framework," but forget the term. Think of it as your authorized sender list.

**What it does:**  
SPF is a record in your DNS that says "These are the only servers allowed to send email from my domain."

**The analogy:**  
Imagine your business has official letterhead. You publish a list saying "The only people authorized to use our letterhead are our main office, our satellite office, and our approved printer." Anyone else using your letterhead is unauthorized.

SPF is that list, but for email servers.

**How it works:**
1. You publish an SPF record in your DNS
2. It lists the servers that can send email from your domain
3. When you send an email, the recipient's server checks your SPF record
4. If the email came from a listed server: approved
5. If it came from somewhere else: suspicious

**Example SPF record:**  
"Email from yourcompany.com can be sent by Google Workspace servers and Mailchimp. That's it. Reject everything else."

**Why it matters:**  
Without SPF, anyone's email server can send email claiming to be from your domain. With SPF, only authorized servers can.

**The catch:**  
SPF only works if you include all your actual email sources. If you send email through:
- Your email provider (Google, Microsoft, etc.)
- Your email marketing tool (Mailchimp, etc.)
- Your invoicing system (QuickBooks, etc.)
- Any other tool that sends email on your behalf

...all of those need to be in your SPF record. Miss one, and legitimate emails from that service might get rejected.

## DKIM: The Signature

DKIM stands for "DomainKeys Identified Mail," but think of it as a signature that proves emails weren't tampered with.

**What it does:**  
DKIM adds an encrypted signature to your emails that proves:
1. The email really came from your domain
2. The email wasn't modified in transit

**The analogy:**  
You sign documents to prove they're from you. Someone receiving the signed document can verify your signature. They can also tell if someone altered the document after you signed it.

DKIM is that signature, but for email.

**How it works:**
1. When you send an email, your email server adds an encrypted signature
2. The signature is created using a private key only you have
3. You publish a public key in your DNS
4. Recipients use that public key to verify the signature
5. If the signature matches: the email is authentic and unchanged
6. If it doesn't: the email was forged or modified

**Why it matters:**  
DKIM proves your emails are actually from you and haven't been tampered with. It's harder to forge than SPF alone.

**The catch:**  
Your email provider needs to configure DKIM properly. It involves generating keys and adding records to your DNS. It's not complicated, but it does need to be done.

## DMARC: The Policy

DMARC stands for "Domain-based Message Authentication, Reporting and Conformance," which is a mouthful. Think of it as your email security policy.

**What it does:**  
DMARC tells other email servers: "If an email claiming to be from my domain fails SPF or DKIM, here's what you should do with it."

**The analogy:**  
You've published who can use your letterhead (SPF) and how to verify your signature (DKIM). Now you're saying "If a letter claims to be from us but doesn't match either of those checks, throw it away."

**How it works:**
1. You publish a DMARC record in your DNS
2. It says what to do with emails that fail SPF/DKIM checks:
   - **None**: Just monitor (report failures but deliver anyway)
   - **Quarantine**: Treat as suspicious (deliver to spam folder)
   - **Reject**: Don't deliver at all
3. It also tells servers to send you reports about failed authentication attempts

**Why it matters:**  
DMARC closes the loop. SPF and DKIM provide verification, but without DMARC, email servers might still deliver emails that fail those checks. DMARC says "Actually block them."

**The catch:**  
You need to start with DMARC set to "none" (monitoring) until you're confident your SPF and DKIM are correctly configured. Otherwise, you might accidentally block your own legitimate emails.

## How They Work Together

Think of these three as layers of security:

**Layer 1 - SPF:**  
"Is this email coming from an authorized server?"

**Layer 2 - DKIM:**  
"Does this email have a valid signature proving it's authentic?"

**Layer 3 - DMARC:**  
"If the email fails those checks, what should we do about it?"

All three together create strong email authentication:
- SPF prevents servers you don't control from sending email as you
- DKIM proves emails are authentic and unmodified
- DMARC enforces your policy and gives you visibility into authentication failures

## What Happens Without These

**Scenario: Your business doesn't have email security configured.**

A spammer wants to send scam emails. They set their email to appear from "ceo@yourcompany.com" even though they don't control your domain.

Recipients see:
```
From: Your Company CEO <ceo@yourcompany.com>
Subject: Urgent: Update your payment information
```

The email looks legitimate. It has your company name. It might even copy your branding. Recipients trust it because it looks like it's from you.

**Without SPF/DKIM/DMARC:**  
The email gets delivered. Recipients assume it's real. Some click links or respond. Your reputation takes the hit.

**With SPF/DKIM/DMARC:**  
The recipient's email server checks:
- SPF: "Is this from an authorized server?" No.
- DKIM: "Does it have a valid signature?" No.
- DMARC: "What should I do?" Your policy says reject it.

The email never reaches recipients. The spammer's attempt fails. Your business is protected.

## How to Check If You Have These

You don't need technical expertise to verify your email security is configured. Here's the simple test:

**Send an email from your business email to Gmail (your personal or a test account).**

1. Open the email in Gmail
2. Click the three dots menu (⋮) in the top right
3. Select "Show original"
4. Look for these lines:

```
SPF: PASS
DKIM: PASS
DMARC: PASS
```

If you see "PASS" next to all three, your email security is properly configured.

If you see "FAIL" or "NEUTRAL" or they're missing entirely, your email security has gaps.

This is something you can check yourself, right now, without asking your IT person. It's a quick verification of whether the security you're paying for is actually in place.

## Common Configuration Mistakes

**SPF includes old services**  
Your SPF record lists email servers you used to use but no longer do. This isn't necessarily broken, but it's sloppy and creates security gaps.

**SPF is missing new services**  
You started using a new tool that sends email on your behalf, but never added it to SPF. Now those emails are getting rejected.

**DKIM was never set up**  
Your IT person said they'd configure it, but never actually did. Your emails work, but they're not cryptographically signed.

**DMARC is set too aggressively**  
Your DMARC policy is set to "reject" before SPF/DKIM were fully tested. Now legitimate emails are being blocked.

**DMARC is set too leniently**  
Your DMARC policy is stuck on "none" (monitoring only). You're getting reports about spoofing attempts, but not actually blocking them.

## Questions to Ask Your IT Provider

Don't accept "email security is all set" without verification. Ask:

**"Can you show me that our SPF, DKIM, and DMARC are passing?"**  
They should be able to demonstrate this with a test email.

**"What's included in our SPF record?"**  
They should be able to list which services are authorized to send email as you.

**"Is our DMARC policy set to reject or quarantine failed emails?"**  
If it's still on "none," ask when they plan to move it to a stronger policy.

**"Are we getting DMARC reports?"**  
These reports tell you if anyone's trying to spoof your domain. You should be monitoring them (or someone should).

## The Business Impact

**With proper email security:**
- Your legitimate emails are more likely to land in inboxes, not spam folders
- Recipients trust emails from your domain
- Spammers can't easily impersonate your business
- You have visibility into authentication failures
- Your reputation is protected

**Without it:**
- Your legitimate emails might get flagged as spam
- Spammers can send emails appearing to be from you
- You won't know when someone's trying to impersonate your business
- Your domain's reputation can be damaged by spam you didn't send
- Recipients might start distrusting emails from your actual domain

This isn't theoretical. Email spoofing happens constantly. The question is whether your business is protected against it.

## The Setup Process

If you don't have email security configured, here's what needs to happen:

1. **Identify all email sources**  
   List everything that sends email as your business (email provider, marketing tools, invoicing systems, etc.)

2. **Configure SPF**  
   Add a DNS record listing all those authorized sources

3. **Set up DKIM**  
   Generate keys, add public key to DNS, configure email server to sign outgoing emails

4. **Enable DMARC monitoring**  
   Add DMARC record set to "none" to start getting reports

5. **Monitor for issues**  
   Check DMARC reports, verify legitimate emails are passing

6. **Strengthen DMARC policy**  
   Once confident everything's working, change from "none" to "quarantine" or "reject"

This isn't a weekend project, but it's not months of work either. A competent IT provider can set this up in a few hours.

## The Bottom Line

Email security (SPF, DKIM, DMARC) protects your business from email spoofing and improves your email deliverability.

You don't need to configure these yourself. But you should:
- Verify they're actually set up
- Understand what they protect against
- Check them periodically to ensure they're still working
- Update them when you add new email services

"Our email works" isn't the same as "our email is secure." Take the two minutes to check. Send yourself a test email and look for those three "PASS" indicators.

If you don't see them, you have a conversation to have with your IT provider.

**Many owners only realize these gaps after something changes** — a vendor leaves, a certificate expires, or an insurance renewal asks unexpected questions.

Explain My IT exists to create a dated, owner-readable record of what's visible from the outside — so you don't have to reconstruct this later.

---

**Related reading:**
- [What is DNS and Why Should Business Owners Care?](/blog/what-is-dns-business-owners)
- [How to Know If Your IT is Actually Secure](/blog/know-if-it-is-secure)
