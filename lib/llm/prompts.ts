/**
 * LLM Prompt Templates
 * 
 * Production-ready prompts for Claude 3.5 Haiku
 * Based on: Docs/dev/LLM-Prompts-Tier1.md
 * 
 * Architecture: 3 calls per snapshot
 * 1. Block Narratives (all 6 blocks)
 * 2. Synthesis + Assumptions + Questions
 * 3. Email Summary
 */

import type { SnapshotSignals } from '@/types/database';

/**
 * CALL 1: Generate all 6 block narratives in one request
 */
export function buildBlockNarrativesPrompt(signals: SnapshotSignals): string {
  return `You are generating plain-English explanations for all 6 signal blocks of an IT reality snapshot.

CONTEXT:
You are part of "Explain My IT" - a service that translates technical IT reality into owner-level understanding.

INPUT DATA (ALL 6 BLOCKS):
${JSON.stringify(
    {
      dns: {
        block_name: 'Domain & DNS Setup',
        confidence: signals.dns!.confidence,
        signals: {
          domain_age_days: signals.dns!.domain_age_days,
          registrar: signals.dns!.registrar,
          nameservers: signals.dns!.nameservers,
          has_dnssec: signals.dns!.has_dnssec,
        },
      },
      email: {
        block_name: 'Email & Identity Posture',
        confidence: signals.email!.confidence,
        signals: {
          has_spf: signals.email!.has_spf,
          spf_record: signals.email!.spf_record,
          has_dkim: signals.email!.has_dkim,
          has_dmarc: signals.email!.has_dmarc,
          dmarc_policy: signals.email!.dmarc_policy,
          email_spoofing_possible: signals.email!.email_spoofing_possible,
        },
      },
      tls: {
        block_name: 'Website Security (TLS/SSL)',
        confidence: signals.tls!.confidence,
        signals: {
          has_https: signals.tls!.has_https,
          https_enforced: signals.tls!.https_enforced,
          certificate_valid: signals.tls!.certificate_valid,
          certificate_issuer: signals.tls!.certificate_issuer,
          days_until_expiry: signals.tls!.days_until_expiry,
          tls_versions: signals.tls!.tls_versions,
          ssl_expiring_soon: signals.tls!.ssl_expiring_soon,
        },
      },
      techstack: {
        block_name: 'Website Technology & Hosting',
        confidence: signals.techstack!.confidence,
        signals: {
          cms: signals.techstack!.cms,
          cdn_detected: signals.techstack!.cdn_detected,
          cdn_provider: signals.techstack!.cdn_provider,
          hosting_provider: signals.techstack!.hosting_provider,
          frameworks: signals.techstack!.frameworks,
        },
      },
      exposure: {
        block_name: 'Public Exposure Awareness',
        confidence: signals.exposure!.confidence,
        signals: {
          reverse_dns: signals.exposure!.reverse_dns,
          infrastructure_type: signals.exposure!.infrastructure_type,
          ip_geolocation: signals.exposure!.ip_geolocation,
        },
      },
      hibp: {
        block_name: 'Breach History',
        confidence: signals.hibp!.confidence,
        signals: {
          breaches_found: signals.hibp!.breaches_found,
          most_recent_breach_date: signals.hibp!.most_recent_breach_date,
          breach_names: signals.hibp!.breach_names.slice(0, 3), // First 3 for context
        },
      },
    },
    null,
    2
  )}

RULES (apply to all 6 blocks):
1. Write for business owners, not IT staff
2. Explain what this means for the business, not how it works technically
3. Be calm and factual. Avoid fear words ('critical', 'severe', 'immediately')
4. No remediation steps
5. No vendor recommendations
6. No CVE IDs or version numbers
7. Keep each explanation to 2-4 sentences

CONFIDENCE HANDLING (MANDATORY FOR EACH BLOCK):
- High confidence → Declarative language allowed ("Your domain uses...")
- Medium confidence → MUST include one qualifier: "appears", "likely", or "seems"
- Low confidence → MUST include both:
  * One qualifier word
  * One explicit limitation: "This cannot be confirmed from public signals alone."

OUTPUT FORMAT (JSON):
{
  "dns": {
    "finding_code": "UNIQUE_CODE",
    "title": "Brief heading (5-7 words)",
    "explanation": "2-4 sentence explanation",
    "why_it_matters": "One sentence on business relevance",
    "confidence": "high|medium|low",
    "confidence_note": "One sentence explaining confidence level"
  },
  "email": { ... same structure ... },
  "tls": { ... same structure ... },
  "techstack": { ... same structure ... },
  "exposure": { ... same structure ... },
  "hibp": { ... same structure ... }
}

Return ONLY JSON. No markdown. No commentary.
Use double quotes for all JSON keys/strings.
Do not include unescaped quotes inside strings.
If you cannot comply, return: {"error":"invalid_output"}

Generate all 6 block narratives now.`;
}

/**
 * CALL 2: Generate synthesis, assumptions, and questions in one request
 */
export function buildSynthesisPrompt(signals: SnapshotSignals): string {
  return `You are generating the executive summary, assumptions, and questions for a business owner's IT reality snapshot.

CONTEXT:
You are part of "Explain My IT" - a service that helps business owners understand their IT setup in plain English.

INPUT DATA (ALL SIGNALS + FLAGS):
${JSON.stringify(
    {
      blocks: {
        dns: {
          confidence: signals.dns!.confidence,
          domain_age_days: signals.dns!.domain_age_days,
        },
        email: {
          confidence: signals.email!.confidence,
          has_spf: signals.email!.has_spf,
          has_dmarc: signals.email!.has_dmarc,
          dmarc_policy: signals.email!.dmarc_policy,
        },
        tls: {
          confidence: signals.tls!.confidence,
          https_enforced: signals.tls!.https_enforced,
          certificate_valid: signals.tls!.certificate_valid,
          ssl_expiring_soon: signals.tls!.ssl_expiring_soon,
        },
        techstack: {
          confidence: signals.techstack!.confidence,
          cms: signals.techstack!.cms,
          cdn_detected: signals.techstack!.cdn_detected,
        },
        exposure: {
          confidence: signals.exposure!.confidence,
          infrastructure_type: signals.exposure!.infrastructure_type,
        },
        hibp: {
          confidence: signals.hibp!.confidence,
          breaches_found: signals.hibp!.breaches_found,
        },
      },
      cross_block_flags: signals.cross_block_flags || [],
    },
    null,
    2
  )}

YOUR TASKS:
1. Write an owner_summary (4-6 sentences, max 150 words)
2. Select top 3 findings (ranked by business relevance)
3. Select 3-5 assumptions (MUST include 1 organizational assumption)
4. Generate 3-5 owner-safe questions (no yes/no phrasing)

RULES FOR OWNER SUMMARY:
- Write for business owners who rely on IT but don't manage it directly
- Be calm and factual. Avoid fear words ('critical', 'severe', 'immediately')
- Focus on what this setup implies for the business
- MUST include exactly one sentence: "This snapshot is based on public signals only and cannot see inside your network."

RULES FOR TOP FINDINGS:
- Maximum 3 findings
- Rank by business relevance, not technical severity
- 2-3 sentences each
- Focus on "what this means" not "what was found"

RULES FOR ASSUMPTIONS:
- Write assumptions the BUSINESS is making, not the IT team
- Focus on governance, continuity, and organizational responsibility
- Use "You're assuming..." format consistently
- MUST include at least 1 Organizational assumption

ASSUMPTION TAXONOMY:
Domain & Infrastructure:
- "You're assuming your domain registrar access is secure and documented."
- "You're assuming your DNS provider will notify you of configuration issues."
- "You're assuming someone would notice if your domain or DNS settings changed."

Email & Identity:
- "You're assuming email impersonation controls are sufficient for your risk profile."
- "You're assuming all employee email accounts use strong, unique passwords."
- "You're assuming your email provider is filtering phishing attempts effectively."

Website & Hosting:
- "You're assuming your hosting provider is patching underlying server software."
- "You're assuming someone is monitoring for website downtime or certificate expiry."
- "You're assuming your website's content management system is being maintained."

Organizational (MUST INCLUDE AT LEAST 1):
- "You're assuming someone has documented who is responsible for IT maintenance."
- "You're assuming your IT setup is recoverable if a key person or vendor becomes unavailable."
- "You're assuming important IT credentials are stored securely and accessibly."

RULES FOR QUESTIONS:
- Questions should be safe for owners to ask without sounding accusatory
- No technical jargon—owner should be able to ask these verbatim
- No instructions or fixes—just questions
- Focus on "who handles this" and "what's the process" questions
- Avoid yes/no phrasing. Use "How do we..." / "Who is responsible for..." / "Where is... documented..."

OUTPUT FORMAT (JSON):
{
  "owner_summary": "4-6 sentences giving an overall picture. MUST include limitation sentence.",
  "top_findings": [
    {
      "finding_code": "UNIQUE_CODE",
      "title": "Brief heading",
      "description": "2-3 sentences",
      "confidence": "high|medium|low"
    }
  ],
  "assumptions": [
    "Assumption statement 1",
    "Assumption statement 2",
    "Assumption statement 3"
  ],
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}

Return ONLY JSON. No markdown. No commentary.
Use double quotes for all JSON keys/strings.
Do not include unescaped quotes inside strings.
If you cannot comply, return: {"error":"invalid_output"}

Generate synthesis, assumptions, and questions now.`;
}

/**
 * CALL 3: Generate email summary
 */
export function buildEmailPrompt(
  ownerSummary: string,
  topFindings: Array<{ title: string; description: string }>,
  reportUrl: string
): string {
  return `You are writing a plain-text email summary of an IT reality snapshot.

CONTEXT:
This email is sent immediately after report generation. It serves three purposes:
1. Deliver value (the owner can understand their IT without logging in)
2. Drive dashboard clicks (teaser + link)
3. Create upgrade interest (subtle mention of recurring reports)

INPUT DATA:
Owner Summary: ${ownerSummary}

Top Findings:
${topFindings.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join('\n')}

Report URL: ${reportUrl}

RULES:
1. Plain text only (no HTML)
2. Keep it short—owners are busy
3. Lead with value, not features
4. One subtle CTA to recurring reports
5. No fear language
6. Professional but conversational
7. Product positioning:
   - This is a "one-time snapshot" (Tier 1)
   - Paid tiers offer "recurring snapshots" and "internal insights"
   - NO mention of "monitoring", "real-time alerts", or "continuous"
   - Tier 1 can be re-run once per 30 days (not "refreshes monthly by default")

OUTPUT FORMAT (JSON):
{
  "subject": "Clear, specific subject line (no hype)",
  "body": "Complete email body as plain text"
}

STRUCTURE FOR BODY:
- Greeting: Conversational
- Context: 1 sentence on what this is
- Value: Owner summary (condensed if needed)
- Hook: 1-2 top findings (bullet points with • symbol)
- Link: Dashboard URL on its own line
- Soft CTA: Mention recurring snapshots (not "monitoring")
- Close: Professional

EXAMPLE SUBJECT:
Your IT Reality Check for example.com

EXAMPLE BODY OPENING:
Hi there,

We've completed a public-signals snapshot of example.com. This is a one-time check based on what's observable from outside your network—think of it as an external perspective on how your IT setup appears to the internet.

[Continue with findings and link...]

Return ONLY JSON. No markdown. No commentary.
Use double quotes for all JSON keys/strings.
If you cannot comply, return: {"error":"invalid_output"}

Generate email subject and body now.`;
}
