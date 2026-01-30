import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeButton from '@/components/pricing/SubscribeButton';
import ProWaitlistForm from '@/components/pricing/ProWaitlistForm';

export const metadata: Metadata = {
  title: 'Pricing — Explain My IT',
  description:
    'Simple, subscription-based pricing for ongoing IT visibility. Run once for free. Keep it running if it matters. No contracts, no pressure.',
  keywords: [
    'IT snapshot pricing',
    'recurring IT monitoring',
    'business owner IT visibility',
    'IT documentation service',
    'monthly IT reports',
    'IT governance pricing',
  ],
  openGraph: {
    title: 'Pricing — Explain My IT',
    description:
      'Simple, subscription-based pricing for ongoing IT visibility. Run once for free. Keep it running if it matters.',
    type: 'website',
    url: 'https://explainmyit.com/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Explain My IT',
    description:
      'Simple, subscription-based pricing for ongoing IT visibility. Run once for free. Keep it running if it matters.',
  },
  alternates: {
    canonical: 'https://explainmyit.com/pricing',
  },
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-brand-bg">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-[900px] mx-auto text-center">
            <h1 className="text-[40px] md:text-[56px] font-bold text-brand-navy mb-6 leading-tight">
              Simple, Subscription-Based Pricing
            </h1>
            <p className="text-[18px] md:text-[20px] text-brand-slate leading-relaxed max-w-[700px] mx-auto">
              Explain My IT is designed to run quietly in the background of your
              business — like an insurance rider or compliance record — not as
              another tool that demands attention.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 px-4">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Free Snapshot */}
              <div className="bg-white rounded-[16px] border-2 border-brand-border p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h2 className="text-[28px] font-bold text-brand-navy mb-2">
                    Free Snapshot
                  </h2>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[48px] font-bold text-brand-navy">
                      $0
                    </span>
                    <span className="text-[18px] text-brand-muted">
                      — one time
                    </span>
                  </div>
                  <p className="text-[16px] text-brand-slate leading-relaxed">
                    A single, external snapshot of your public IT footprint.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    Includes:
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'One-time public snapshot (domains, email, website, exposure signals)',
                      'Owner-readable summary',
                      'Assumptions being made',
                      'Questions to ask your IT provider',
                      'Delivered by email',
                      'No account required',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-slate leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    Limits:
                  </h3>
                  <ul className="space-y-2">
                    {[
                      'One snapshot per domain',
                      'No history or timeline',
                      'No re-runs unless you upgrade',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-muted flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-muted leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/"
                  data-umami-event="pricing-cta-clicked"
                  data-umami-event-cta-type="free-snapshot"
                  className="block w-full text-center bg-white border-2 border-brand-cyan text-brand-cyan px-8 py-4 rounded-[12px] text-[16px] font-semibold hover:bg-brand-cyan hover:text-white transition-all shadow-sm"
                >
                  Run Your Free Snapshot
                </Link>
              </div>

              {/* Tier 1 - Recurring */}
              <div className="bg-gradient-to-br from-brand-cyan/5 to-brand-navy/5 rounded-[16px] border-2 border-brand-cyan p-8 shadow-md hover:shadow-lg transition-shadow relative">
                <div className="absolute top-4 right-4 bg-brand-cyan text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>

                <div className="mb-6">
                  <h2 className="text-[28px] font-bold text-brand-navy mb-2">
                    Tier 1 — Recurring IT Snapshot
                  </h2>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[48px] font-bold text-brand-navy">
                      $19.99
                    </span>
                    <span className="text-[18px] text-brand-muted">
                      / month
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[24px] font-bold text-brand-green">
                      $199
                    </span>
                    <span className="text-[16px] text-brand-muted">
                      / year
                    </span>
                    <span className="text-[14px] text-brand-green font-semibold ml-2 px-2 py-0.5 bg-brand-green/10 rounded">
                      2 months free
                    </span>
                  </div>
                  <p className="text-[16px] text-brand-slate leading-relaxed">
                    Ongoing visibility into how your IT setup appears over time.
                  </p>
                  <p className="text-[14px] text-brand-muted leading-relaxed mt-2 italic">
                    This tier exists for owners who want continuity,
                    documentation, and awareness — without dashboards, alerts, or
                    remediation.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    Includes:
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'Automatic monthly snapshots',
                      'Full snapshot history & timeline',
                      'Owner-readable summaries for each snapshot',
                      'Explicit assumptions and blind spots',
                      'Process-focused questions to ask your IT/MSP',
                      'Access to all past reports',
                      'Cancel anytime',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-slate leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    What this gives you:
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'A dated record of your external IT posture',
                      'Visibility into silent drift over time',
                      'Governance evidence for insurance, audits, or transitions',
                      'Clarity without interfering with your IT provider',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-slate leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <SubscribeButton
                    priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY!}
                    interval="monthly"
                    className="block w-full text-center bg-brand-navy text-white px-8 py-4 rounded-[12px] text-[16px] font-semibold hover:bg-brand-navy/90 transition-all shadow-sm"
                  >
                    Subscribe Monthly — $19.99
                  </SubscribeButton>
                  <SubscribeButton
                    priceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL!}
                    interval="annual"
                    className="block w-full text-center bg-brand-cyan text-white px-8 py-4 rounded-[12px] text-[16px] font-semibold hover:bg-brand-cyan/90 transition-all shadow-sm"
                  >
                    Subscribe Annually — $199 <span className="text-[14px] opacity-90">(Save $40)</span>
                  </SubscribeButton>
                </div>
                <p className="text-center text-[13px] text-brand-muted mt-3">
                  No credit card required for free account. Cancel anytime.
                </p>
              </div>

              {/* Pro - On-Premise (Coming Soon) */}
              <div className="bg-gradient-to-br from-brand-navy/5 to-brand-muted/5 rounded-[16px] border-2 border-brand-border p-8 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-4 right-4 bg-brand-muted text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                  COMING SOON
                </div>

                <div className="mb-6">
                  <h2 className="text-[28px] font-bold text-brand-navy mb-2">
                    Pro — On-Premise
                  </h2>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[24px] font-bold text-brand-muted">
                      Contact Us
                    </span>
                  </div>
                  <p className="text-[16px] text-brand-slate leading-relaxed">
                    Internal visibility tool installed within your network for comprehensive IT oversight.
                  </p>
                  <p className="text-[14px] text-brand-muted leading-relaxed mt-2 italic">
                    Gives you visibility into internal systems, changes, and configurations that external snapshots cannot see.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    Includes:
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'Everything in Tier 1',
                      'Internal network scanning',
                      'Asset discovery and inventory',
                      'Configuration change detection',
                      'User and permission tracking',
                      'Integration with your systems',
                      'On-premise or private cloud deployment',
                      'Dedicated support',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-muted flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-slate leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h3 className="text-[16px] font-semibold text-brand-navy mb-3">
                    What this gives you:
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'Complete internal and external IT visibility',
                      'Real-time change detection across your infrastructure',
                      'Audit trail for compliance and governance',
                      'Answers the questions Tier 1 cannot',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-[15px] text-brand-slate leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-brand-bg rounded-[12px] p-6">
                  <p className="text-[14px] text-brand-navy font-semibold mb-4 text-center">
                    Get notified when Pro is available
                  </p>
                  <ProWaitlistForm />
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-[16px] border border-brand-border p-8 shadow-sm mb-12">
              <h2 className="text-[28px] font-bold text-brand-navy mb-6 text-center">
                Compare Plans
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <th className="text-left py-4 px-4 text-[16px] font-semibold text-brand-navy">
                        Feature
                      </th>
                      <th className="text-center py-4 px-4 text-[16px] font-semibold text-brand-navy">
                        Free Snapshot
                      </th>
                      <th className="text-center py-4 px-4 text-[16px] font-semibold text-brand-navy bg-brand-cyan/5">
                        Tier 1
                      </th>
                      <th className="text-center py-4 px-4 text-[16px] font-semibold text-brand-muted">
                        Pro
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: 'Public IT snapshot',
                        free: true,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Owner-readable summary',
                        free: true,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Assumptions & questions',
                        free: true,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Monthly snapshots',
                        free: false,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Full history & timeline',
                        free: false,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Access to past reports',
                        free: false,
                        tier1: true,
                        pro: true,
                      },
                      {
                        feature: 'Internal network scanning',
                        free: false,
                        tier1: false,
                        pro: true,
                      },
                      {
                        feature: 'Asset discovery & inventory',
                        free: false,
                        tier1: false,
                        pro: true,
                      },
                      {
                        feature: 'Change detection',
                        free: false,
                        tier1: false,
                        pro: true,
                      },
                      {
                        feature: 'On-premise deployment',
                        free: false,
                        tier1: false,
                        pro: true,
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-brand-border/50">
                        <td className="py-4 px-4 text-[15px] text-brand-slate">
                          {row.feature}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.free ? (
                            <svg
                              className="w-5 h-5 text-brand-cyan mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-brand-muted">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center bg-brand-cyan/5">
                          {row.tier1 ? (
                            <svg
                              className="w-5 h-5 text-brand-cyan mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-brand-muted">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.pro ? (
                            <svg
                              className="w-5 h-5 text-brand-muted mx-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-brand-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-4 px-4 text-[15px] font-semibold text-brand-navy">
                        Price
                      </td>
                      <td className="py-4 px-4 text-center text-[16px] font-bold text-brand-navy">
                        $0
                      </td>
                      <td className="py-4 px-4 text-center text-[16px] font-bold text-brand-navy bg-brand-cyan/5">
                        $19.99/mo
                      </td>
                      <td className="py-4 px-4 text-center text-[15px] text-brand-muted">
                        Contact us
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* What This Is / Isn't */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-[900px] mx-auto">
            <h2 className="text-[36px] font-bold text-brand-navy mb-12 text-center">
              What This Is — and Is Not
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* This Is */}
              <div className="bg-brand-cyan/5 rounded-[12px] p-6 border border-brand-cyan/20">
                <h3 className="text-[20px] font-semibold text-brand-navy mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-brand-cyan"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  This is:
                </h3>
                <ul className="space-y-3">
                  {[
                    'A neutral, external perspective',
                    'A continuity and governance artifact',
                    'A way to stay informed without becoming technical',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="text-[15px] text-brand-slate leading-relaxed pl-2"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* This Is Not */}
              <div className="bg-brand-muted/5 rounded-[12px] p-6 border border-brand-border">
                <h3 className="text-[20px] font-semibold text-brand-navy mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-brand-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  This is not:
                </h3>
                <ul className="space-y-3">
                  {[
                    'A security monitoring service',
                    'An alerting or remediation tool',
                    'A replacement for your MSP or IT team',
                    'A penetration test or internal audit',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="text-[15px] text-brand-muted leading-relaxed pl-2"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-cyan">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[36px] md:text-[44px] font-bold text-white mb-6">
              Understand it once. Track it over time.
            </h2>
            <p className="text-[18px] text-blue-100 mb-8 leading-relaxed">
              Run once for free. Keep it running if it matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                data-umami-event="pricing-cta-clicked"
                data-umami-event-cta-type="free-snapshot-cta-bottom"
                className="bg-white text-brand-navy px-8 py-4 rounded-[12px] text-[16px] font-semibold hover:bg-gray-50 transition-all shadow-lg"
              >
                Run Your Free Snapshot
              </Link>
              <Link
                href="/how-it-works"
                data-umami-event="pricing-cta-clicked"
                data-umami-event-cta-type="how-it-works"
                className="bg-brand-cyan text-white px-8 py-4 rounded-[12px] text-[16px] font-semibold hover:bg-brand-cyan/90 transition-all shadow-lg"
              >
                How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
