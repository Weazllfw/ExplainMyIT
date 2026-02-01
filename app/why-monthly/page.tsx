import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Monthly? | Explain My IT',
  description: 'IT changes quietly over time. Monthly snapshots track drift, catch issues early, and give you a dated record of how things looked at each point in time.',
  openGraph: {
    title: 'Why Monthly Snapshots? | Explain My IT',
    description: 'Understand why business owners track their IT monthly — because things change without anyone telling you.',
  },
};

export default function WhyMonthlyPage() {
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
                { label: 'Why Monthly?' },
              ]}
            />
            <h1 className="mb-6 text-gray-900">Why Monthly?</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Because IT changes quietly. And by the time you notice, you often can't remember what changed or when.
            </p>
          </div>
        </section>

        {/* The Drift Problem */}
        <section className="container-section max-w-4xl mx-auto prose prose-lg prose-slate">
          <h2>The Problem: Configuration Drift</h2>
          
          <p className="lead">
            Your IT setup doesn't stay static. It changes constantly — often without anyone telling you.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg not-prose my-8">
            <p className="font-semibold text-gray-900 mb-3">What changes without you noticing:</p>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• Your hosting provider updates something on their end</li>
              <li>• Your SSL certificate renews (or doesn't)</li>
              <li>• Your email configuration gets modified by a contractor</li>
              <li>• Your DNS records change as part of a migration</li>
              <li>• A service gets added or removed</li>
              <li>• An employee leaves and takes knowledge with them</li>
            </ul>
          </div>

          <p>
            These changes aren't usually dramatic. Your website still loads. Your email still works. Everything seems fine.
          </p>

          <p>
            <strong>Until someone asks a question.</strong>
          </p>

          <h2>The "I Think So" Problem</h2>

          <p>
            Insurance renewal: <em>"Is your email security configured?"</em>
          </p>

          <p>
            You: <em>"I think so? We set that up... maybe two years ago? Let me check..."</em>
          </p>

          <p>
            But you can't check because:
          </p>

          <ul>
            <li>You don't know where to look</li>
            <li>The person who configured it is gone</li>
            <li>Your IT provider says "yes, it's handled" but can't show proof</li>
            <li>You have no record of what it looked like before vs. now</li>
          </ul>

          <p>
            <strong>You're making decisions based on assumptions, not information.</strong>
          </p>

          <h2>What Monthly Snapshots Actually Do</h2>

          <p>
            Monthly snapshots don't prevent changes. They document changes.
          </p>

          <div className="bg-blue-50 border-l-4 border-brand-cyan p-6 rounded-r-lg not-prose my-8">
            <p className="font-semibold text-gray-900 mb-3">Every month, you get a dated record:</p>
            <div className="space-y-4 text-gray-700 text-sm">
              <div>
                <p className="font-semibold text-gray-900">March 2026 snapshot:</p>
                <p>Domain expires June 2026, email security passing, SSL valid until May 2026</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">April 2026 snapshot:</p>
                <p>Same as March — nothing changed</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-amber-700">May 2026 snapshot:</p>
                <p className="text-amber-700">DKIM now failing, SSL renewed to August 2026</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700">
              <strong>What you now know:</strong> Something changed with email between April and May. SSL auto-renewed successfully. 
              You have specific information to investigate the DKIM issue.
            </p>
          </div>

          <p>
            Without monthly snapshots, you wouldn't know:
          </p>

          <ul>
            <li><strong>When</strong> DKIM broke (April? March? Last year?)</li>
            <li><strong>What</strong> was working before</li>
            <li><strong>If</strong> SSL is actually auto-renewing or if it was manual</li>
          </ul>

          <p>
            You'd just know "DKIM is failing now" with no context for troubleshooting.
          </p>

          <h2>Real Scenarios Where Monthly Matters</h2>

          <h3>Scenario 1: The Silent Break</h3>

          <p>
            Your email security was configured correctly in January. By June, DMARC was no longer passing.
          </p>

          <p>
            <strong>With monthly snapshots:</strong> You see it broke between April and May. You check what changed — 
            oh, you switched email marketing tools in late April. The new tool wasn't added to SPF. Fix it in 10 minutes.
          </p>

          <p>
            <strong>Without monthly snapshots:</strong> You discover DMARC is broken when insurance renewal asks about it 
            in December. You have no idea when it broke or what changed. You spend hours troubleshooting and may never 
            know what originally caused it.
          </p>

          <h3>Scenario 2: The Dispute</h3>

          <p>
            Your IT provider claims they configured email security "months ago." But your insurance company says it's 
            not properly set up.
          </p>

          <p>
            <strong>With monthly snapshots:</strong> You pull up your March snapshot — email security was passing then. 
            You show both parties evidence of the configuration at that time. Clear resolution.
          </p>

          <p>
            <strong>Without monthly snapshots:</strong> It's your word against theirs. No evidence of what was configured 
            when. The dispute takes weeks and you still don't know the truth.
          </p>

          <h3>Scenario 3: The Departed Employee</h3>

          <p>
            Your IT person leaves in August. They say everything is documented and up to date. In November, your domain 
            almost expires because auto-renew was disabled.
          </p>

          <p>
            <strong>With monthly snapshots:</strong> Your September snapshot (after they left) shows auto-renew disabled. 
            Your August snapshot (before they left) shows it enabled. You know exactly when it changed and can investigate why.
          </p>

          <p>
            <strong>Without monthly snapshots:</strong> You catch it at the last minute by luck. You never know if it 
            was always disabled (and they lied) or if it changed after they left. No recourse, no evidence.
          </p>

          <h2>What "Monthly" Doesn't Mean</h2>

          <p>
            Monthly snapshots don't mean:
          </p>

          <ul>
            <li><strong>You check them monthly.</strong> Most customers glance when the email arrives, then file it away. 
            You don't need to study each one — you just need them to exist when questions arise.</li>
            <li><strong>You need IT expertise.</strong> The reports are in plain English. You're not expected to act on 
            every detail — just to have information available when you need it.</li>
            <li><strong>Something's broken.</strong> Most months, snapshots show "everything's the same." That's actually 
            good news — it means nothing unexpectedly changed.</li>
            <li><strong>You're paranoid.</strong> You're being prudent. Business owners track financials monthly even when 
            nothing's wrong. IT documentation is the same principle.</li>
          </ul>

          <h2>The Comparison Power</h2>

          <p>
            The real value of monthly snapshots is comparison.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 not-prose my-8">
            <p className="text-sm text-slate-600 mb-4">A single snapshot tells you:</p>
            <p className="text-slate-900 mb-6">"Here's your IT setup as of May 15, 2026"</p>
            
            <p className="text-sm text-slate-600 mb-4">Monthly snapshots tell you:</p>
            <ul className="space-y-2 text-slate-900 text-sm">
              <li>• How your setup has changed over time</li>
              <li>• When something broke or was misconfigured</li>
              <li>• What was working before a migration or change</li>
              <li>• Whether "fixes" actually fixed anything</li>
              <li>• If something is stable or constantly changing</li>
            </ul>
          </div>

          <p>
            That context is what turns information into insight.
          </p>

          <h2>Who Actually Needs Monthly?</h2>

          <p>
            Not everyone needs monthly snapshots. A single snapshot might be enough if:
          </p>

          <ul>
            <li>You're doing one-time due diligence (buying a business, insurance app)</li>
            <li>You just want to understand your current setup</li>
            <li>You're comfortable manually requesting snapshots as needed</li>
          </ul>

          <p>
            <strong>Monthly makes sense if:</strong>
          </p>

          <ul>
            <li>You want to track changes over time without thinking about it</li>
            <li>You need dated records for compliance or insurance</li>
            <li>You've been surprised by IT changes in the past</li>
            <li>You don't trust that "it's all handled" without verification</li>
            <li>You want a paper trail showing what was configured when</li>
          </ul>

          <p>
            Think of it like bank statements. You <em>could</em> request them only when you need them. But automatic 
            monthly statements are easier, and you have them if questions arise.
          </p>

          <h2>The Reality Check</h2>

          <p>
            Most business owners don't think about IT documentation until they're in a situation that requires it:
          </p>

          <ul>
            <li>Insurance renewal with technical questions</li>
            <li>IT provider dispute</li>
            <li>Employee departure</li>
            <li>Business sale or acquisition</li>
            <li>Compliance audit</li>
            <li>Something broke and nobody knows what changed</li>
          </ul>

          <p>
            <strong>At that point, having monthly records is the difference between:</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
              <p className="font-semibold text-green-900 mb-2">With Monthly Snapshots:</p>
              <p className="text-sm text-gray-700">
                "Here's our configuration from March through June. Here's when it changed. Here's what was working before. 
                Here's the evidence."
              </p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
              <p className="font-semibold text-red-900 mb-2">Without:</p>
              <p className="text-sm text-gray-700">
                "I think it was configured? Maybe? I'm not sure when it changed. Let me try to reconstruct this from memory..."
              </p>
            </div>
          </div>

          <h2>The Bottom Line</h2>

          <p>
            IT changes quietly. By the time you notice, you often can't answer:
          </p>

          <ul>
            <li>When did it change?</li>
            <li>What was it like before?</li>
            <li>What triggered the change?</li>
            <li>Was this intentional or accidental?</li>
          </ul>

          <p>
            Monthly snapshots don't prevent change. They document it. So when questions arise — and they will — you 
            have answers instead of assumptions.
          </p>

          <p>
            That's why monthly.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-brand-navy to-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Start with one snapshot. See if it's useful.
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              If you find yourself thinking "I should check this again in a few months," that's when monthly makes sense.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/pricing" 
                className="bg-brand-cyan text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-400 transition-colors text-lg"
              >
                Run Your Free Snapshot
              </Link>
              <Link 
                href="/pricing" 
                className="bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors text-lg backdrop-blur-sm"
              >
                See Basic ($15/mo) →
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              Free tier: On-demand snapshots, 30-day history<br/>
              Basic tier: Automatic monthly snapshots, unlimited history
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
