import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Use Cases | Explain My IT',
  description: 'Common scenarios when business owners need clear IT documentation: insurance renewals, business acquisitions, vendor changes, and ownership clarity.',
  openGraph: {
    title: 'Use Cases | Explain My IT',
    description: 'See how business owners use Explain My IT for insurance renewals, due diligence, MSP transitions, and ownership clarity.',
  },
};

export default function UseCasesPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Use Cases' },
              ]}
            />
            <h1 className="mb-6 text-gray-900">When Business Owners Need IT Clarity</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Most owners don't think about their IT documentation until someone asks a question they can't answer. 
              Here's when that happens.
            </p>
          </div>
        </section>

        {/* Use Cases */}
        <section className="container-section max-w-5xl mx-auto">
          {/* Use Case 1: Insurance Renewal */}
          <div className="mb-16 pb-16 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Renewal: "Prove your IT security"</h2>
                <p className="text-gray-600">Cyber insurance applications ask technical questions you may not be able to answer</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">The Question:</p>
              <p className="text-gray-700 mb-4">
                "Does your domain have SPF, DKIM, and DMARC configured? Is your SSL certificate current? 
                When was your last security review?"
              </p>
              <p className="font-semibold text-gray-900 mb-2">Your Response:</p>
              <p className="text-gray-700">
                "I think so? Let me ask our IT person... if they get back to me... and hope they can explain it..."
              </p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              <h3>What business owners face:</h3>
              <ul>
                <li>Insurance applications with 20+ technical questions</li>
                <li>IT provider says "yes, it's all handled" but can't show proof</li>
                <li>Renewal deadline approaching, no time to verify everything</li>
                <li>Risk of denied coverage or higher premiums without documentation</li>
              </ul>

              <h3>What Explain My IT provides:</h3>
              <ul>
                <li><strong>Current security configuration</strong> in plain English</li>
                <li><strong>Dated snapshot</strong> showing what's in place as of [date]</li>
                <li><strong>Specific answers</strong> to common insurance questions</li>
                <li><strong>Evidence</strong> you can share with underwriters</li>
              </ul>

              <p className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <strong>Real scenario:</strong> Owner needed proof of email security for cyber insurance. 
                IT provider said "it's configured" but couldn't show documentation. Snapshot confirmed DMARC 
                was missing. Fixed before renewal, avoided coverage gap.
              </p>

              <Link 
                href="/pricing" 
                className="inline-block bg-brand-cyan text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy transition-colors"
              >
                See how it works →
              </Link>
            </div>
          </div>

          {/* Use Case 2: Business Acquisition */}
          <div className="mb-16 pb-16 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Buying a Business: "What IT am I actually acquiring?"</h2>
                <p className="text-gray-600">Due diligence requires understanding what's included, what works, and what's at risk</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">The Question:</p>
              <p className="text-gray-700 mb-4">
                "The seller says IT is 'all handled' — but what do they actually have? Is the domain in their 
                personal name? Will email keep working after purchase?"
              </p>
              <p className="font-semibold text-gray-900 mb-2">Your Situation:</p>
              <p className="text-gray-700">
                You need to understand the IT before closing, but you're not technical and the seller's 
                answers are vague.
              </p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              <h3>What buyers need to verify:</h3>
              <ul>
                <li>Domain ownership (is it in the seller's personal account?)</li>
                <li>Email configuration (will it transfer cleanly?)</li>
                <li>Website hosting (what's the renewal situation?)</li>
                <li>Security posture (will insurance continue?)</li>
                <li>What expires when (surprises after closing are expensive)</li>
              </ul>

              <h3>What Explain My IT provides:</h3>
              <ul>
                <li><strong>Pre-acquisition baseline</strong> showing actual configuration</li>
                <li><strong>Issues to negotiate</strong> before closing (domain control, missing security)</li>
                <li><strong>Post-acquisition verification</strong> that everything transferred correctly</li>
                <li><strong>Documentation for your records</strong> of what you actually bought</li>
              </ul>

              <p className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <strong>Real scenario:</strong> Buyer ordered snapshot during due diligence. Discovered domain 
                was registered under seller's personal email and SSL cert was expired. Negotiated $3K off purchase 
                price to fix issues. Post-close snapshot confirmed everything was transferred properly.
              </p>

              <Link 
                href="/pricing" 
                className="inline-block bg-brand-cyan text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy transition-colors"
              >
                Run pre-acquisition snapshot →
              </Link>
            </div>
          </div>

          {/* Use Case 3: MSP Transition */}
          <div className="mb-16 pb-16 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Switching IT Providers: "What's our current state?"</h2>
                <p className="text-gray-600">Transitioning providers requires knowing what you have before and after</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">The Situation:</p>
              <p className="text-gray-700 mb-4">
                You're unhappy with your current IT provider. You want to switch. But new providers ask "what's your 
                current setup?" and you realize... you don't actually know.
              </p>
              <p className="font-semibold text-gray-900 mb-2">The Problem:</p>
              <p className="text-gray-700">
                Your old provider isn't incentivized to document things clearly. Your new provider needs to know 
                what they're taking over. You're caught in the middle.
              </p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              <h3>Why transitions fail:</h3>
              <ul>
                <li>Old provider doesn't document thoroughly (or holds information hostage)</li>
                <li>New provider doesn't know what they're inheriting</li>
                <li>Business owner can't verify if transition was complete</li>
                <li>Issues discovered weeks later when old provider is gone</li>
              </ul>

              <h3>What Explain My IT provides:</h3>
              <ul>
                <li><strong>Pre-transition snapshot</strong> showing current state</li>
                <li><strong>Neutral documentation</strong> you control, not your old provider</li>
                <li><strong>Post-transition verification</strong> that everything migrated correctly</li>
                <li><strong>Comparison</strong> between before/after states</li>
              </ul>

              <p className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <strong>Real scenario:</strong> Owner switching MSPs ordered snapshot before transition. 
                Showed it to new MSP as baseline. After migration, ordered another snapshot. Comparison revealed 
                email security wasn't migrated properly. New MSP fixed it immediately instead of owner discovering 
                it months later when emails started bouncing.
              </p>

              <Link 
                href="/pricing" 
                className="inline-block bg-brand-cyan text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy transition-colors"
              >
                Document current state →
              </Link>
            </div>
          </div>

          {/* Use Case 4: Ownership Clarity */}
          <div className="mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">"I Don't Actually Know Who Owns What"</h2>
                <p className="text-gray-600">Inheriting unclear IT, employee departures, or years of accumulated changes</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">The Realization:</p>
              <p className="text-gray-700 mb-4">
                Your website works, email flows, everything seems fine. Until someone asks "where is your domain 
                registered?" and you realize... you're not sure. Maybe under your IT person's personal account? 
                Maybe the founder who retired? Nobody documented it.
              </p>
              <p className="font-semibold text-gray-900 mb-2">The Risk:</p>
              <p className="text-gray-700">
                If you don't know who controls what, you can't verify security, plan renewals, or confidently 
                answer basic questions about your own business.
              </p>
            </div>

            <div className="prose prose-lg prose-slate max-w-none">
              <h3>Common ownership gaps:</h3>
              <ul>
                <li>Domain registered under former employee's personal email</li>
                <li>Hosting account in contractor's name who left years ago</li>
                <li>Email configured by "someone" at "some point" but no record of it</li>
                <li>SSL certificate auto-renewing... probably... maybe... you think?</li>
                <li>Nobody can log in to check because credentials were never documented</li>
              </ul>

              <h3>What Explain My IT provides:</h3>
              <ul>
                <li><strong>Visibility</strong> into what's actually configured</li>
                <li><strong>Starting point</strong> for taking control of your infrastructure</li>
                <li><strong>Evidence</strong> of gaps that need fixing</li>
                <li><strong>Documentation</strong> you can reference going forward</li>
              </ul>

              <p className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <strong>Real scenario:</strong> New owner inherited business, couldn't find domain registrar login. 
                Snapshot showed domain configuration and who the registrar was. Owner contacted registrar, proved 
                business ownership, regained control. Now has monthly snapshots to never lose track again.
              </p>

              <Link 
                href="/pricing" 
                className="inline-block bg-brand-cyan text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-navy transition-colors"
              >
                See what you actually have →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-brand-navy to-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Most owners don't think about IT documentation until they need it
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              The best time to create your first snapshot is before someone asks a question you can't answer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/pricing" 
                className="bg-brand-cyan text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-400 transition-colors text-lg"
              >
                Run Your Free Snapshot
              </Link>
              <Link 
                href="/how-it-works" 
                className="bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors text-lg backdrop-blur-sm"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
