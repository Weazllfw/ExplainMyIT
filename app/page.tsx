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
        <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-hidden">
          <div className="container-section">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text */}
              <div className="space-y-6">
                <h1 className="text-gray-900 leading-tight">
                  Explain My IT
                </h1>
                <h2 className="text-2xl md:text-3xl text-gray-700 font-normal">
                  Plain-English IT reports <span className="italic">for business owners</span>.
                </h2>
                <div className="text-lg text-gray-600 space-y-4">
                  <p>
                    No jargon. No tech talk. Just clarity.
                  </p>
                  <p className="font-medium text-gray-700">
                    Get a free snapshot of your IT setup in plain English. No credit card required.
                  </p>
                </div>
              </div>
              
              {/* Right Column - Snapshot Request Form */}
              <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-200">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Your Free IT Snapshot
                  </h3>
                  <p className="text-sm text-gray-600">
                    See what your IT setup actually means, explained in plain English
                  </p>
                </div>
                <SnapshotRequestForm />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="bg-white border-y border-gray-200">
          <div className="container-section py-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">⚡ 60 seconds</div>
                <div className="text-sm text-gray-600">Results delivered to your email</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">🔒 100% Free</div>
                <div className="text-sm text-gray-600">No credit card. No strings.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">📧 Plain English</div>
                <div className="text-sm text-gray-600">Written for business owners, not IT pros</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Get Section */}
        <section className="container-section bg-gradient-to-br from-gray-50 to-slate-50">
          <h2 className="section-title">What's In Your Free Snapshot</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner Summary</h3>
              <p className="text-gray-600">
                A 4-6 sentence high-level overview of what your IT setup means for your business
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Findings</h3>
              <p className="text-gray-600">
                The 3 most important things we found, ranked by business impact (not technical severity)
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assumptions Being Made</h3>
              <p className="text-gray-600">
                What your current setup is assuming works correctly (so you can verify it actually does)
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions to Ask</h3>
              <p className="text-gray-600">
                Specific questions you can ask your IT team or MSP to clarify your setup
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Plus detailed findings across 6 key areas:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['🌐 Domain & Infrastructure', '📧 Email Security', '🔒 Website Security', 
                '⚙️ Technology Stack', '🔍 Public Exposure', '🛡️ Breach History'].map((item) => (
                <span key={item} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
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
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Business owners</h3>
              <p className="text-gray-600">who rely on IT but don&apos;t want to live in it</p>
            </div>
            
            {/* Companies with IT */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Companies with internal IT or an MSP</h3>
              <p className="text-gray-600">who want independent, owner-level clarity</p>
            </div>
            
            {/* Preparing for transitions */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Preparing</h3>
              <p className="text-gray-600">for insurance, growth, audits, or transitions</p>
            </div>
          </div>
        </section>

        {/* What This Is Not */}
        <section className="container-section bg-gradient-to-br from-gray-50 to-slate-50">
          <h2 className="section-title">What It&apos;s Not</h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Left: What it's not list */}
            <div className="space-y-4 flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-700">No monitoring alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-700">No security scanning</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-700">No tech jargon</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg text-gray-700">No remediation services</span>
              </div>
              <p className="text-base text-gray-600 pt-4 italic">
                Just clear explanations you can actually understand.
              </p>
            </div>
            
            {/* Right: Visual cards showing what we produce */}
            <div className="grid grid-cols-3 gap-3">
              {/* Card 1 - Public IT Snapshot */}
              <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">Public IT Snapshot</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-blue-200 rounded"></div>
                  <div className="h-1.5 bg-blue-100 rounded w-4/5"></div>
                  <div className="h-1.5 bg-blue-100 rounded w-3/5"></div>
                  <div className="flex gap-1 pt-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div className="flex-1 space-y-0.5">
                      <div className="h-1 bg-gray-200 rounded"></div>
                      <div className="h-1 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card 2 - Monthly IT Report */}
              <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">Monthly IT Report</div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-slate-200 rounded"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-4/5"></div>
                  <div className="pt-2 space-y-1">
                    <div className="h-1 bg-gray-200 rounded"></div>
                    <div className="h-1 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Card 3 - Internal IT Insights */}
              <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
                <div className="text-xs font-semibold text-gray-700 mb-2">Internal IT Insights</div>
                <div className="space-y-2 pt-2">
                  <div className="h-8 bg-gradient-to-r from-blue-100 to-slate-100 rounded flex items-end px-1">
                    <div className="h-4 w-1 bg-blue-400"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-1 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-1 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-lg text-gray-700">
              We build clarity tools for business owners, not monitoring dashboards for IT teams.
            </p>
            <p className="text-base text-gray-600">
              Explain My IT shows you what&apos;s happening. It doesn&apos;t run or change your systems.
            </p>
          </div>
        </section>

        {/* What You Get */}
        <section className="container-section bg-white">
          <h2 className="section-title">What You Get</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">A simple owner dashboard</h3>
                <p className="text-gray-600">Clear summaries of your IT environment, written for decision-makers, not technicians.</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Recurring plain-English reports</h3>
                <p className="text-gray-600">Automatic snapshots that explain risks, assumptions, and changes over time.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business-level explanations</h3>
                <p className="text-gray-600">What matters, why it matters, and what could surprise you, without technical noise.</p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calm, factual presentation</h3>
                <p className="text-gray-600">No blame. No fear. No upsell. Just explanation.</p>
              </div>
            </div>
            
            <p className="text-center text-base text-gray-600 italic max-w-2xl mx-auto">
              Most customers use Explain My IT as a background tool, checking in periodically, not daily.
            </p>
          </div>
        </section>

        {/* CTA Section - Dashboard Early Access */}
        <section id="waitlist" className="container-section bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want Recurring Reports & a Dashboard?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              The free snapshot is just the beginning. Get early access to our full dashboard with recurring reports, change tracking, and more.
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join the Early Access Waitlist
              </h3>
              <WaitlistForm />
              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-gray-500">
                  No spam. Just IT clarity.
                </p>
                <p className="text-xs text-gray-400">
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
