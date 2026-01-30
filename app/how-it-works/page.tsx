import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'How It Works | Explain My IT - Plain-English IT Reports for Business Owners',
  description: 'Understand how Explain My IT creates plain-English reports about your business IT setup. Get clarity on your domain, email, security, and infrastructure in 60 seconds — no jargon, no scanning, no fear.',
  keywords: [
    'how IT reports work',
    'business IT clarity',
    'plain English IT explanation',
    'domain security check',
    'email security report',
    'IT snapshot process',
    'business owner IT tools',
    'IT documentation for SMBs',
    'non-technical IT reports',
    'IT audit for business owners',
  ],
  openGraph: {
    title: 'How It Works - Plain-English IT Reports',
    description: 'See how Explain My IT creates clear, dated records of your business IT setup in 60 seconds. No scanning, no jargon, just clarity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - Explain My IT',
    description: 'Plain-English IT reports for business owners. See how we create clarity in 60 seconds.',
  },
  alternates: {
    canonical: 'https://explainmyit.com/how-it-works',
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-brand-bg overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-[0.06]" aria-hidden="true"></div>
          <div className="container-section relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-brand-navy leading-tight mb-6">
                How It Works
              </h1>
              <p className="text-[20px] md:text-[24px] text-brand-slate leading-relaxed mb-4">
                Get a plain-English snapshot of your business IT setup in 60 seconds.
              </p>
              <p className="text-[16px] text-brand-muted max-w-3xl mx-auto">
                No network scanning. No system access. No installations. Just public observations explained in language business owners can understand.
              </p>
            </div>
          </div>
        </section>

        {/* The Process - Step by Step */}
        <section className="container-section bg-white">
          <h2 className="section-title">The Process</h2>
          <p className="text-center text-brand-muted mb-12 max-w-2xl mx-auto">
            Four simple steps. One clear report. Zero technical complexity.
          </p>
          
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="grid md:grid-cols-[120px_1fr] gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-navy to-blue-700 rounded-[16px] flex items-center justify-center shadow-brand-hover">
                  <span className="text-[32px] font-bold text-white">1</span>
                </div>
                <div className="hidden md:block w-1 h-full bg-brand-border mt-4"></div>
              </div>
              <div className="bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[16px] p-8 border border-brand-border">
                <h3 className="text-[24px] font-bold text-brand-navy mb-3">You submit your domain</h3>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  Enter your business domain (like <code className="px-2 py-1 bg-white rounded border border-brand-border text-brand-cyan text-sm">yourcompany.com</code>) and your email address. That's it.
                </p>
                <div className="bg-white rounded-[12px] p-4 border border-brand-border">
                  <p className="text-[15px] text-brand-slate mb-2">
                    <strong className="text-brand-navy">What we collect:</strong>
                  </p>
                  <ul className="text-[14px] text-brand-muted space-y-1 list-disc list-inside">
                    <li>Your domain name</li>
                    <li>Your email (for report delivery only)</li>
                  </ul>
                  <p className="text-[13px] text-brand-muted mt-3 italic">
                    We don't access your network, servers, or internal systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-[120px_1fr] gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-cyan to-cyan-600 rounded-[16px] flex items-center justify-center shadow-brand-hover">
                  <span className="text-[32px] font-bold text-white">2</span>
                </div>
                <div className="hidden md:block w-1 h-full bg-brand-border mt-4"></div>
              </div>
              <div className="bg-gradient-to-br from-brand-cyan/5 to-brand-cyan/10 rounded-[16px] p-8 border border-brand-cyan/30">
                <h3 className="text-[24px] font-bold text-brand-navy mb-3">We observe public signals</h3>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  Using only publicly available information, we check how your domain, email, website, and certificates appear from the outside.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-[10px] p-4 border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Domain & DNS</span>
                    </div>
                    <p className="text-xs text-brand-muted">Who registered it, when it expires, nameservers</p>
                  </div>
                  
                  <div className="bg-white rounded-[10px] p-4 border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Email Protection</span>
                    </div>
                    <p className="text-xs text-brand-muted">SPF, DKIM, DMARC configuration status</p>
                  </div>
                  
                  <div className="bg-white rounded-[10px] p-4 border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Website Security</span>
                    </div>
                    <p className="text-xs text-brand-muted">SSL certificates, security headers, hosting</p>
                  </div>
                  
                  <div className="bg-white rounded-[10px] p-4 border border-brand-border">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Tech Stack</span>
                    </div>
                    <p className="text-xs text-brand-muted">Visible web technologies and services</p>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-[12px] p-4 border border-brand-border">
                  <p className="text-[13px] text-brand-muted italic">
                    <strong className="text-brand-navy not-italic">Note:</strong> We only look at what's publicly visible. We never scan your network, access internal systems, or test for vulnerabilities.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-[120px_1fr] gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-brand-positive to-green-600 rounded-[16px] flex items-center justify-center shadow-brand-hover">
                  <span className="text-[32px] font-bold text-white">3</span>
                </div>
                <div className="hidden md:block w-1 h-full bg-brand-border mt-4"></div>
              </div>
              <div className="bg-gradient-to-br from-brand-positive/5 to-brand-positive/10 rounded-[16px] p-8 border border-brand-positive/30">
                <h3 className="text-[24px] font-bold text-brand-navy mb-3">AI translates it into plain English</h3>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  We use Claude (Anthropic's AI) to turn technical observations into language you can understand — no certifications required.
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-[12px] p-4 border border-brand-border">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-brand-positive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy mb-1">Owner Summary</p>
                        <p className="text-xs text-brand-muted">A 4-6 sentence overview of what your IT setup means for your business</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[12px] p-4 border border-brand-border">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-brand-positive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy mb-1">Key Findings</p>
                        <p className="text-xs text-brand-muted">Top 3 observations ranked by business impact, not technical severity</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[12px] p-4 border border-brand-border">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-brand-positive flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy mb-1">Assumptions & Questions</p>
                        <p className="text-xs text-brand-muted">What your setup assumes works correctly, and what's worth clarifying with your IT team</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-brand-navy/5 rounded-[12px] p-4 border border-brand-navy/20">
                  <p className="text-[15px] text-brand-slate">
                    <strong className="text-brand-navy">Our AI is trained to:</strong>
                  </p>
                  <ul className="text-[14px] text-brand-muted mt-2 space-y-1 list-disc list-inside">
                    <li>Avoid technical jargon and fear-based language</li>
                    <li>Focus on business context, not technical perfection</li>
                    <li>Be honest about uncertainty and limitations</li>
                    <li>Never recommend specific vendors or products</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-[120px_1fr] gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-[16px] flex items-center justify-center shadow-brand-hover">
                  <span className="text-[32px] font-bold text-white">4</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-[16px] p-8 border border-purple-200">
                <h3 className="text-[24px] font-bold text-brand-navy mb-3">You receive your report</h3>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  Within 60 seconds, you'll receive an email with a link to your plain-English IT snapshot.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-[12px] p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Read online</span>
                    </div>
                    <p className="text-xs text-brand-muted">Clean, mobile-friendly report page</p>
                  </div>
                  
                  <div className="bg-white rounded-[12px] p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Print or save as PDF</span>
                    </div>
                    <p className="text-xs text-brand-muted">Keep for your records</p>
                  </div>
                  
                  <div className="bg-white rounded-[12px] p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Share with your team</span>
                    </div>
                    <p className="text-xs text-brand-muted">Copy link, forward email</p>
                  </div>
                  
                  <div className="bg-white rounded-[12px] p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-brand-navy">Dated & timestamped</span>
                    </div>
                    <p className="text-xs text-brand-muted">Know exactly when it was generated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Check - Detailed Breakdown */}
        <section className="container-section bg-brand-bg">
          <h2 className="section-title">What We Actually Check</h2>
          <p className="text-center text-brand-muted mb-12 max-w-3xl mx-auto">
            Here's exactly what we look at — and what we don't. Everything is publicly observable data only.
          </p>
          
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Domain & DNS */}
            <details className="bg-white rounded-[16px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-navy/10 to-brand-navy/20 rounded-[12px] flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-brand-navy">Domain & DNS</h3>
                      <p className="text-sm text-brand-muted">Who owns it, where it's hosted, when it expires</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Domain registration details</p>
                    <p className="text-xs text-brand-muted">Registrar, registration date, expiry date</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ DNS configuration</p>
                    <p className="text-xs text-brand-muted">Nameservers, A/MX/TXT records</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Subdomains (via certificates)</p>
                    <p className="text-xs text-brand-muted">Public subdomains visible in SSL cert history</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Domain age & history</p>
                    <p className="text-xs text-brand-muted">How long the domain has existed</p>
                  </div>
                </div>
              </div>
            </details>

            {/* Email Security */}
            <details className="bg-white rounded-[16px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/20 rounded-[12px] flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-brand-navy">Email Security</h3>
                      <p className="text-sm text-brand-muted">Protection against impersonation and spoofing</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ SPF records</p>
                    <p className="text-xs text-brand-muted">Which servers can send email for your domain</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ DKIM configuration</p>
                    <p className="text-xs text-brand-muted">Email signature verification setup</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ DMARC policy</p>
                    <p className="text-xs text-brand-muted">How receiving servers handle failed checks</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Blacklist status</p>
                    <p className="text-xs text-brand-muted">Whether your domain appears on spam lists</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Breach exposure</p>
                    <p className="text-xs text-brand-muted">Known data breaches involving your domain emails</p>
                  </div>
                </div>
              </div>
            </details>

            {/* Website & Certificates */}
            <details className="bg-white rounded-[16px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-positive/10 to-brand-positive/20 rounded-[12px] flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-brand-navy">Website & Security</h3>
                      <p className="text-sm text-brand-muted">SSL certificates, headers, and hosting</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ SSL/TLS certificates</p>
                    <p className="text-xs text-brand-muted">Valid, expiry date, issuer, coverage</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Security headers</p>
                    <p className="text-xs text-brand-muted">Common website protection mechanisms</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Hosting provider</p>
                    <p className="text-xs text-brand-muted">Where your website appears to be hosted</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Certificate history</p>
                    <p className="text-xs text-brand-muted">How many certs issued recently (change indicator)</p>
                  </div>
                </div>
              </div>
            </details>

            {/* Tech Stack */}
            <details className="bg-white rounded-[16px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow group">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[12px] flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[18px] font-bold text-brand-navy">Technology Stack</h3>
                      <p className="text-sm text-brand-muted">Visible software and services</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Web technologies</p>
                    <p className="text-xs text-brand-muted">Frameworks, CMSs, analytics visible in HTML/headers</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-brand-navy mb-1">✓ Third-party services</p>
                    <p className="text-xs text-brand-muted">CDNs, email providers, DNS services</p>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="max-w-3xl mx-auto mt-12 bg-white rounded-[16px] p-6 border-2 border-brand-navy/20">
            <h3 className="text-[20px] font-bold text-brand-navy mb-3 flex items-center gap-2">
              <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              What We Don't Touch
            </h3>
            <ul className="space-y-2 text-[15px] text-brand-slate">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Your internal network or systems</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Employee devices or credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Private databases or file systems</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Active vulnerability scanning or penetration testing</span>
              </li>
            </ul>
            <p className="text-sm text-brand-muted mt-4 italic">
              We're read-only observers of public data, not security scanners.
            </p>
          </div>
        </section>

        {/* Why This Matters - Temporal Framing */}
        <section className="container-section bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Why This Matters</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[16px] p-8 border border-brand-border">
                <h3 className="text-[22px] font-bold text-brand-navy mb-4">This snapshot is dated.</h3>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  Your IT setup <strong>will not look the same</strong> in 3–6 months. Domains renew or expire. Certificates change. Email configurations get updated. Hosting providers switch.
                </p>
                <p className="text-[16px] text-brand-slate leading-relaxed mb-4">
                  Most businesses don't notice these changes until something breaks, or until a third party (insurance, audit, acquisition) asks questions.
                </p>
                <p className="text-[16px] text-brand-navy leading-relaxed font-medium">
                  Explain My IT creates a <strong>dated record</strong> of how things looked at a specific point in time — so you have evidence when questions come up.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="text-[40px] font-bold text-brand-cyan mb-2">60s</div>
                  <p className="text-sm text-brand-slate">From submission to report</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-[40px] font-bold text-brand-cyan mb-2">0</div>
                  <p className="text-sm text-brand-slate">Internal systems accessed</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-[40px] font-bold text-brand-cyan mb-2">100%</div>
                  <p className="text-sm text-brand-slate">Plain English, no jargon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container-section bg-brand-bg">
          <h2 className="section-title">Common Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>Is this a security scan or vulnerability assessment?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                No. We don't test for vulnerabilities, attempt logins, or probe your systems. We only look at publicly visible information (like DNS records and SSL certificates) and explain what it means in plain English.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>Will this interfere with my website or systems?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                No. We make a handful of standard DNS queries and HTTPS requests — the same kind your website handles thousands of times per day. There's no load testing, no scanning, and no system modifications.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>Do I need technical knowledge to understand the report?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                No. The report is written specifically for business owners, not IT professionals. We avoid jargon and focus on business context. If you can read a business email, you can read the report.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>What if I already have an IT team or MSP?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                Perfect. This isn't a replacement — it's an independent, owner-level view of your public IT posture. Many of our customers use these reports to have better conversations with their IT team or MSP, or as documentation for insurance, audits, or transitions.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>How accurate is the AI-generated content?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                The technical data we collect is factual and accurate. The AI (Claude by Anthropic) interprets this data and explains it in plain English. We've trained the prompts to be conservative, honest about uncertainty, and focused on business context rather than technical perfection.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>Can I run this for multiple domains?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                Yes. You can run as many free snapshots as you want. If you create a free account, you can track multiple domains in one dashboard and run 1 snapshot per domain every 30 days.
              </p>
            </details>

            <details className="bg-white rounded-[14px] p-6 border border-brand-border group">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy flex items-center justify-between">
                <span>What happens after I get my free snapshot?</span>
                <svg className="w-5 h-5 text-brand-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-sm text-brand-slate mt-3 leading-relaxed">
                Nothing, unless you want to. The free snapshot is yours to keep. If you create a free account, you can save it to your dashboard and run new snapshots every 30 days. Paid plans offer more frequent snapshots and additional internal visibility features (coming soon).
              </p>
            </details>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-section bg-brand-navy">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-[32px] md:text-[36px] font-bold mb-4">
              Ready to See How Your IT Looks?
            </h2>
            <p className="text-[16px] text-blue-100 mb-2 leading-relaxed">
              Get your free snapshot in 60 seconds.
            </p>
            <p className="text-[16px] text-brand-cyan/80 mb-8 leading-relaxed">
              No credit card. No installations. No jargon.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-white text-brand-navy rounded-[12px] font-semibold text-[16px] shadow-brand-hover hover:shadow-xl transition-all hover:scale-[1.02]"
              data-umami-event="how-it-works-cta-clicked"
            >
              Get Your Free Snapshot
            </Link>
            <p className="text-sm text-brand-cyan/60 mt-6">
              Takes 60 seconds. Results delivered to your email.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
