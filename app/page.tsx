import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaitlistForm from '@/components/WaitlistForm';
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
                </div>
              </div>
              
              {/* Right Column - Snapshot Request Form */}
              <div className="bg-white rounded-[16px] shadow-brand-hover p-6 md:p-8 border border-brand-border">
                <div className="mb-6">
                  <h3 className="text-[24px] font-bold text-brand-navy mb-2">
                    Get Your Free IT Snapshot
                  </h3>
                  <p className="text-sm text-brand-muted">
                    See what your IT setup actually means, explained in plain English
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

        {/* CTA Section - Dashboard Early Access */}
        <section id="waitlist" className="container-section bg-brand-navy">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-[32px] md:text-[36px] font-bold mb-4">
              Want Recurring Reports & a Dashboard?
            </h2>
            <p className="text-[16px] text-brand-cyan/80 mb-8">
              The free snapshot is just the beginning. Get early access to our full dashboard with recurring reports, change tracking, and more.
            </p>
            <div className="bg-white rounded-[20px] shadow-brand-hover p-8 md:p-10">
              <h3 className="text-[24px] font-bold text-brand-navy mb-4">
                Join the Early Access Waitlist
              </h3>
              <WaitlistForm />
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-brand-muted">
                  No spam. Just IT clarity.
                </p>
                <p className="text-xs text-brand-muted/70">
                  Pricing will be simple, subscription-based, and designed to stay in the background of normal business software spend.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
