import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SnapshotRequestForm from '@/components/SnapshotRequestForm';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-brand-bg overflow-hidden">
          <div className="absolute inset-0 bg-brand-gradient opacity-[0.06]" aria-hidden="true"></div>
          <div className="container-section relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div className="space-y-6">
                <h1 className="text-brand-navy leading-tight">
                  Explain My IT
                </h1>
                <h2 className="text-[28px] md:text-[32px] text-brand-slate font-normal leading-snug">
                  Plain-English IT reports <span className="italic">for business owners</span>.
                </h2>
                <div className="text-[16px] text-brand-slate space-y-4">
                  <p>
                    No jargon. No tech talk. Just clarity.
                  </p>
                  <p className="font-medium text-brand-navy">
                    Get a free snapshot of your IT setup in plain English. No credit card required.
                  </p>
                  <p className="text-[15px] leading-relaxed">
                    You'll receive a short, plain-English report explaining what your IT setup appears to be, what it's assuming, and what questions are worth asking.
                  </p>
                  <p className="text-[14px] text-brand-muted leading-relaxed">
                    <strong className="text-brand-navy">This snapshot is dated.</strong> IT configurations change quietly over time — often without owners being notified. This creates a record of how things looked today.
                  </p>
                </div>
              </div>
              
              {/* Right Column - Snapshot Request Form */}
              <div className="bg-white rounded-[16px] shadow-brand-hover p-6 md:p-8 border border-brand-border">
                <div className="mb-6">
                  <h3 className="text-[24px] font-bold text-brand-navy mb-2">
                    Get Your Free IT Snapshot
                  </h3>
                  <p className="text-sm text-brand-muted">
                    Results delivered to your email in 30-60 seconds
                  </p>
                </div>
                <SnapshotRequestForm />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-white border-y border-brand-border">
          <div className="container-section py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-[24px] font-bold text-brand-cyan mb-1">⚡ 60 seconds</div>
                <div className="text-sm text-brand-muted">Results delivered to your email</div>
              </div>
              <div>
                <div className="text-[24px] font-bold text-brand-cyan mb-1">🔒 100% Free</div>
                <div className="text-sm text-brand-muted">No credit card. No strings.</div>
              </div>
              <div>
                <div className="text-[24px] font-bold text-brand-cyan mb-1">📧 Plain English</div>
                <div className="text-sm text-brand-muted">Written for business owners, not IT pros</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Get Section */}
        <section className="container-section bg-brand-bg">
          <h2 className="section-title">What's In Your Free Snapshot</h2>
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
            <p className="text-brand-slate text-[16px]">
              Your free snapshot includes a short owner-readable report made up of the following sections:
            </p>
            <p className="text-[15px] text-brand-navy leading-relaxed bg-white rounded-[12px] p-4 border border-brand-border">
              Most businesses don't notice changes to domains, email, certificates, or hosting until something breaks or a third party asks questions. <strong>Explain My IT keeps a dated record of how things looked at each point in time.</strong>
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[14px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow">
              <div className="text-3xl mb-3" aria-hidden="true">📊</div>
              <h3 className="text-[18px] font-bold text-brand-navy mb-2">Owner Summary</h3>
              <p className="text-[15px] text-brand-slate leading-relaxed">
                A 4-6 sentence high-level overview of what your IT setup means for your business
              </p>
            </div>
            
            <div className="bg-white rounded-[14px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow">
              <div className="text-3xl mb-3" aria-hidden="true">🎯</div>
              <h3 className="text-[18px] font-bold text-brand-navy mb-2">Top Findings</h3>
              <p className="text-[15px] text-brand-slate leading-relaxed">
                The 3 most important things we found, ranked by business impact (not technical severity)
              </p>
            </div>
            
            <div className="bg-white rounded-[14px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow">
              <div className="text-3xl mb-3" aria-hidden="true">💭</div>
              <h3 className="text-[18px] font-bold text-brand-navy mb-2">Assumptions Being Made</h3>
              <p className="text-[15px] text-brand-slate leading-relaxed">
                What your current setup is assuming works correctly (so you can verify it actually does)
              </p>
            </div>
            
            <div className="bg-white rounded-[14px] p-6 border border-brand-border shadow-brand hover:shadow-brand-hover transition-shadow">
              <div className="text-3xl mb-3" aria-hidden="true">💡</div>
              <h3 className="text-[18px] font-bold text-brand-navy mb-2">Questions to Ask</h3>
              <p className="text-[15px] text-brand-slate leading-relaxed">
                Specific questions you can ask your IT team or MSP to clarify your setup
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-brand-muted mb-4 text-[15px]">Plus detailed findings across 6 key areas:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['🌐 Domain & Infrastructure', '📧 Email Security', '🔒 Website Security', 
                '⚙️ Technology Stack', '🔍 Public Exposure', '🛡️ Breach History'].map((item) => (
                <span key={item} className="px-4 py-2 bg-white border border-brand-border rounded-full text-sm text-brand-slate shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What This Snapshot Is/Isn't - Tier 1 Clarifier */}
        <section className="container-section bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* What It Is */}
              <div className="bg-brand-bg rounded-[16px] p-6 border border-brand-border">
                <h3 className="text-[20px] font-bold text-brand-navy mb-3">
                  What This Snapshot Is
                </h3>
                <p className="text-[15px] text-brand-slate leading-relaxed mb-4">
                  A one-time, external view of your IT setup based only on publicly observable signals.
                </p>
                <p className="text-[15px] text-brand-slate leading-relaxed">
                  It explains what your current setup appears to be doing, not how to fix it.
                </p>
              </div>

              {/* What It Isn't */}
              <div className="bg-brand-bg rounded-[16px] p-6 border border-brand-border">
                <h3 className="text-[20px] font-bold text-brand-navy mb-3">
                  What This Snapshot Isn't
                </h3>
                <p className="text-[15px] text-brand-slate leading-relaxed">
                  It doesn't scan your network, access your systems, or change anything.
                </p>
              </div>
            </div>

            {/* Concrete Example */}
            <div className="mt-6 bg-white rounded-[14px] p-6 border border-brand-border">
              <p className="text-[15px] text-brand-slate leading-relaxed italic">
                <strong className="text-brand-navy not-italic">Example:</strong> "Your email protection is partially configured, which means someone could impersonate your company unless additional controls are in place. This is common in small businesses and is usually handled by internal IT or an MSP."
              </p>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="container-section bg-white">
          <h2 className="section-title">Who It&apos;s For</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Business Owners */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[14px] flex items-center justify-center">
                <svg className="w-16 h-16 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-brand-navy">Business owners</h3>
              <p className="text-[15px] text-brand-slate">who rely on IT but don&apos;t want to live in it</p>
            </div>
            
            {/* Companies with IT */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/20 rounded-[14px] flex items-center justify-center">
                <svg className="w-16 h-16 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-brand-navy">Companies with internal IT or an MSP</h3>
              <p className="text-[15px] text-brand-slate">who want independent, owner-level clarity</p>
            </div>
            
            {/* Preparing for transitions */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[14px] flex items-center justify-center">
                <svg className="w-16 h-16 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-brand-navy">Preparing</h3>
              <p className="text-[15px] text-brand-slate">for insurance, growth, audits, or transitions</p>
            </div>
          </div>
        </section>

        {/* Free vs Recurring Comparison */}
        <section className="container-section bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[28px] font-bold text-center text-brand-navy mb-3">
              One Snapshot vs. Recurring Reports
            </h2>
            <p className="text-center text-brand-muted mb-10 max-w-2xl mx-auto">
              A single snapshot answers "what does this look like today?" Recurring reports answer "when did this change, and why?"
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Snapshot */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[16px] p-8 border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-cyan/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-brand-navy">Free Snapshot</h3>
                </div>
                <ul className="space-y-3 text-[15px] text-brand-slate">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>One point in time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Useful for awareness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Answers "what does this look like today?"</span>
                  </li>
                </ul>
              </div>

              {/* Recurring Reports */}
              <div className="bg-gradient-to-br from-brand-navy to-blue-700 rounded-[16px] p-8 border-2 border-brand-navy shadow-brand-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-white">Recurring Reports</h3>
                </div>
                <ul className="space-y-3 text-[15px] text-blue-100">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Creates a timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Captures silent changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Answers "when did this change, and why?"</span>
                  </li>
                </ul>
                <p className="text-xs text-blue-200 mt-4 pt-4 border-t border-white/20">
                  Available with paid plans
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What This Is Not */}
        <section className="container-section bg-brand-bg">
          <h2 className="section-title">What It&apos;s Not</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Left: What it's not list */}
            <div className="space-y-4 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[16px] text-brand-slate">No monitoring alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[16px] text-brand-slate">No security scanning</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[16px] text-brand-slate">No tech jargon</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-brand-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[16px] text-brand-slate">No remediation services</span>
              </div>
              <p className="text-[15px] text-brand-muted pt-4 italic">
                Just clear explanations you can actually understand.
              </p>
            </div>
            
            {/* Right: Visual cards showing what we produce */}
            <div className="grid grid-cols-3 gap-3">
              {/* Card 1 - Public IT Snapshot */}
              <div className="bg-white rounded-[10px] shadow-brand p-3 border border-brand-border">
                <div className="text-xs font-semibold text-brand-navy mb-2">Public IT Snapshot</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-brand-cyan/40 rounded"></div>
                  <div className="h-1.5 bg-brand-cyan/20 rounded w-4/5"></div>
                  <div className="h-1.5 bg-brand-cyan/20 rounded w-3/5"></div>
                  <div className="flex gap-1 pt-2">
                    <div className="w-3 h-3 bg-brand-cyan rounded-full"></div>
                    <div className="flex-1 space-y-0.5">
                      <div className="h-1 bg-brand-border rounded"></div>
                      <div className="h-1 bg-brand-border/50 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card 2 - Monthly IT Report */}
              <div className="bg-white rounded-[10px] shadow-brand p-3 border border-brand-border">
                <div className="text-xs font-semibold text-brand-navy mb-2">Monthly IT Report</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-brand-navy/30 rounded"></div>
                  <div className="h-1.5 bg-brand-navy/15 rounded w-full"></div>
                  <div className="h-1.5 bg-brand-navy/15 rounded w-4/5"></div>
                  <div className="pt-2 space-y-1">
                    <div className="h-1 bg-brand-border rounded"></div>
                    <div className="h-1 bg-brand-border/50 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Card 3 - Internal IT Insights */}
              <div className="bg-white rounded-[10px] shadow-brand p-3 border border-brand-border">
                <div className="text-xs font-semibold text-brand-navy mb-2">Internal IT Insights</div>
                <div className="space-y-2 pt-2">
                  <div className="h-8 bg-brand-gradient opacity-20 rounded flex items-end px-1">
                    <div className="h-4 w-1 bg-brand-cyan"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-1 bg-brand-border rounded w-1/3"></div>
                    <div className="h-1 bg-brand-border rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-[16px] text-brand-slate">
              We build clarity tools for business owners, not monitoring dashboards for IT teams.
            </p>
            <p className="text-[15px] text-brand-muted">
              Explain My IT shows you what&apos;s happening. It doesn&apos;t run or change your systems.
            </p>
          </div>
        </section>

        {/* What You Get */}
        <section className="container-section bg-white">
          <h2 className="section-title">What You Get</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[16px] p-6 border border-brand-border">
                <div className="w-12 h-12 bg-brand-navy rounded-[12px] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-brand-navy mb-2">A simple owner dashboard</h3>
                <p className="text-[15px] text-brand-slate leading-relaxed">Clear summaries of your IT environment, written for decision-makers, not technicians.</p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-cyan/10 to-brand-cyan/20 rounded-[16px] p-6 border border-brand-cyan/30">
                <div className="w-12 h-12 bg-brand-cyan rounded-[12px] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-brand-navy mb-2">Recurring plain-English reports</h3>
                <p className="text-[15px] text-brand-slate leading-relaxed">Automatic snapshots that explain risks, assumptions, and changes over time.</p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-positive/5 to-brand-positive/10 rounded-[16px] p-6 border border-brand-positive/30">
                <div className="w-12 h-12 bg-brand-positive rounded-[12px] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-brand-navy mb-2">Business-level explanations</h3>
                <p className="text-[15px] text-brand-slate leading-relaxed">What matters, why it matters, and what could surprise you, without technical noise.</p>
              </div>
              
              <div className="bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 rounded-[16px] p-6 border border-brand-border">
                <div className="w-12 h-12 bg-brand-navy rounded-[12px] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-[18px] font-bold text-brand-navy mb-2">Calm, factual presentation</h3>
                <p className="text-[15px] text-brand-slate leading-relaxed">No blame. No fear. No upsell. Just explanation.</p>
              </div>
            </div>
            
            <p className="text-center text-[15px] text-brand-muted italic max-w-2xl mx-auto">
              Most customers use Explain My IT as a background tool, checking in periodically, not daily.
            </p>
          </div>
        </section>

        {/* CTA Section - Create Account */}
        <section className="container-section bg-brand-navy">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-[32px] md:text-[36px] font-bold mb-4">
              Create a Record of Your IT Over Time
            </h2>
            <p className="text-[16px] text-blue-100 mb-2 leading-relaxed">
              Stop relying on memory and people.
            </p>
            <p className="text-[16px] text-brand-cyan/80 mb-8 leading-relaxed">
              Have evidence when questions come up. Save your snapshots and see what changed.
            </p>
            <div className="bg-white rounded-[20px] shadow-brand-hover p-8 md:p-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[24px] font-bold text-brand-navy mb-2">
                    What You Get With a Free Account
                  </h3>
                  <p className="text-[15px] text-brand-slate">
                    100% free. No credit card required.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-brand-slate text-[15px]">
                      Keep dated records permanently
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-brand-slate text-[15px]">
                      View all domains in one place
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-brand-slate text-[15px]">
                      1 snapshot per domain every 30 days
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-brand-slate text-[15px]">
                      Build a history of what changed
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Link
                    href="/signup"
                    className="inline-block px-8 py-4 bg-brand-navy text-white rounded-[12px] font-semibold text-[16px] shadow-brand hover:shadow-brand-hover transition-all hover:scale-[1.02]"
                  >
                    Create Free Account
                  </Link>
                  <p className="text-sm text-brand-muted mt-4">
                    Already have an account? <Link href="/login" className="text-brand-cyan hover:underline font-medium">Log in</Link>
                  </p>
                  <p className="text-sm text-brand-muted mt-2">
                    Want recurring snapshots? <Link href="/pricing" className="text-brand-cyan hover:underline font-medium">View pricing</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
