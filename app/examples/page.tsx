import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Example Reports | Explain My IT',
  description: 'See real examples of plain-English IT reports for business owners. Understand what your snapshot will look like before you run it.',
  openGraph: {
    title: 'Example Reports | Explain My IT',
    description: 'Real examples of plain-English IT reports that business owners can actually understand.',
  },
};

export default function ExamplesPage() {
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
                { label: 'Example Reports' },
              ]}
            />
            <h1 className="mb-6 text-gray-900">Example Reports</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              See what you'll get: real IT snapshot reports in plain English. No jargon, no overwhelming dashboards — 
              just clear answers to questions business owners actually have.
            </p>
          </div>
        </section>

        {/* What You'll See */}
        <section className="container-section max-w-5xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-brand-cyan p-8 rounded-r-xl mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Every Report Covers:</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Domain Status
                </h3>
                <p className="text-gray-600 text-sm">Where it's registered, when it expires, who controls it</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Email Security
                </h3>
                <p className="text-gray-600 text-sm">SPF, DKIM, DMARC explained — whether they're passing or failing</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL Certificate
                </h3>
                <p className="text-gray-600 text-sm">Valid or expired, who issued it, when it renews</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  DNS Configuration
                </h3>
                <p className="text-gray-600 text-sm">Where your domain points, what records are configured</p>
              </div>
            </div>
          </div>

          {/* Example 1: Small Service Business */}
          <div className="mb-16 pb-16 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Example 1: Small Service Business</h2>
            <p className="text-gray-600 mb-6">
              A consulting firm with 8 employees. Domain registered 5 years ago, website on shared hosting, 
              email through Google Workspace.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Domain Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Domain Status</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Domain:</span>
                        <span className="ml-2 font-mono">exampleconsulting.com</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registrar:</span>
                        <span className="ml-2">GoDaddy</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Registered:</span>
                        <span className="ml-2">2019-03-15</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-2 font-semibold text-green-600">2027-03-15 (auto-renew enabled)</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-green-700">✓ Good:</strong> Domain is set to auto-renew and won't expire unexpectedly. 
                        You have 14 months before next renewal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Security */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Email Security</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">PASS</span>
                        <span className="font-mono text-sm">SPF</span>
                        <span className="text-gray-500 text-sm">— Authorized mail servers configured correctly</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">PASS</span>
                        <span className="font-mono text-sm">DKIM</span>
                        <span className="text-gray-500 text-sm">— Emails are cryptographically signed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">PASS</span>
                        <span className="font-mono text-sm">DMARC</span>
                        <span className="text-gray-500 text-sm">— Policy set to quarantine failed emails</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-green-700">✓ Strong:</strong> Your email security is properly configured. 
                        Spammers can't easily impersonate your domain, and your legitimate emails are less likely to be marked as spam.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SSL Certificate */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">SSL Certificate</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-2 font-semibold text-green-600">✓ Valid</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Issued by:</span>
                        <span className="ml-2">Let's Encrypt</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Valid from:</span>
                        <span className="ml-2">2025-12-15</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-2">2026-03-15 (auto-renews)</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-green-700">✓ Secure:</strong> Your website has a valid SSL certificate 
                        that auto-renews every 90 days. Visitors see the padlock and "https://" in their browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  This is a simplified example. Full reports include DNS records, hosting details, and technical context 
                  explained in plain English.
                </p>
              </div>
            </div>
          </div>

          {/* Example 2: Business with Issues Found */}
          <div className="mb-16 pb-16 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Example 2: Business with Issues Found</h2>
            <p className="text-gray-600 mb-6">
              A retail business preparing for insurance renewal. Snapshot revealed gaps the owner wasn't aware of.
            </p>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Email Security - Issues */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Email Security</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">PASS</span>
                        <span className="font-mono text-sm">SPF</span>
                        <span className="text-gray-500 text-sm">— Authorized mail servers configured</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">FAIL</span>
                        <span className="font-mono text-sm">DKIM</span>
                        <span className="text-gray-500 text-sm">— No cryptographic signature found</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">MISSING</span>
                        <span className="font-mono text-sm">DMARC</span>
                        <span className="text-gray-500 text-sm">— No policy configured</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-amber-700">⚠ Gap:</strong> Your email security is partially configured but incomplete. 
                        This may affect insurance applications and makes it easier for spammers to impersonate your domain. 
                        Your IT provider should add DKIM and DMARC.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Domain - Concern */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Domain Status</h3>
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expires:</span>
                        <span className="ml-2 font-semibold text-amber-600">2026-02-28 (37 days)</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Auto-renew:</span>
                        <span className="ml-2 font-semibold text-red-600">✗ Not enabled</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-700">
                        <strong className="text-red-700">⚠ Urgent:</strong> Your domain expires in 37 days and auto-renew is not enabled. 
                        If it expires, your website and email will stop working. Enable auto-renew immediately or mark your calendar 
                        to renew manually before February 28.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Outcome Note */}
                <div className="bg-blue-50 border-l-4 border-brand-cyan p-6 rounded-r-lg">
                  <p className="font-semibold text-gray-900 mb-2">What Happened:</p>
                  <p className="text-gray-700 text-sm mb-3">
                    Owner was preparing insurance renewal when they ordered this snapshot. Assumed email security was 
                    "all handled" because they paid for Google Workspace.
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    <strong>Snapshot revealed:</strong> SPF was configured, but DKIM and DMARC weren't. Also caught 
                    domain expiring soon without auto-renew.
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Result:</strong> Owner forwarded snapshot to IT provider with specific issues to fix. 
                    Fixed in 2 days, well before insurance renewal and domain expiration. Owner now has monthly 
                    snapshots to catch issues early.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What Reports Aren't */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What These Reports Are NOT</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Not a Security Audit
                </h3>
                <p className="text-sm text-gray-600">
                  We show you what's visible from the outside (like DNS, SSL, email configuration). We don't scan your 
                  internal systems, test for vulnerabilities, or provide penetration testing. Think of it as "what can 
                  anyone see about your IT" not "is your IT impenetrable."
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Not IT Management
                </h3>
                <p className="text-sm text-gray-600">
                  We don't fix issues, manage your infrastructure, or replace your IT provider. We show you what your 
                  setup looks like in plain English. What you do with that information is up to you — but you'll know 
                  what questions to ask.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Not Compliance Certification
                </h3>
                <p className="text-sm text-gray-600">
                  We provide information, not certification. We can show you what email security is configured, but 
                  we don't certify compliance with specific regulations. That said, the information in our reports 
                  helps answer common compliance and insurance questions.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  Not Recommendations
                </h3>
                <p className="text-sm text-gray-600">
                  We explain what's configured, not what you should do about it. We'll flag things like "DMARC is 
                  missing" or "domain expires soon," but we don't tell you how to run your business. We give you 
                  information — you make the decisions.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">See Your Own Report</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get a plain-English snapshot of your IT setup in 60 seconds. Free, no scanning, no credit card.
            </p>
            <Link 
              href="/pricing" 
              className="inline-block bg-brand-cyan text-white px-8 py-4 rounded-lg font-semibold hover:bg-cyan-400 transition-colors text-lg"
            >
              Run Your Free Snapshot →
            </Link>
            <p className="mt-4 text-sm text-blue-200">
              Want this monthly with history? <Link href="/pricing" className="underline hover:text-white">See Basic subscription</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
