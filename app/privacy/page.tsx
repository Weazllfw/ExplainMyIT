import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Explain My IT handles your data',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 28, 2026';
  
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="mb-4 text-gray-900">Privacy Policy</h1>
            <p className="text-lg text-gray-600">Last updated: {lastUpdated}</p>
          </div>
        </section>
        
        <article className="container-section max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold"

          <h2>What We Collect</h2>
          <p>
            When you sign up for early access to Explain My IT, we collect:
          </p>
          <ul>
            <li>Your email address (required)</li>
            <li>Optional information: company size and IT setup type</li>
          </ul>

          <h2>How We Use It</h2>
          <p>We use your information solely for:</p>
          <ul>
            <li>Sending early access notifications when Explain My IT reports launch</li>
            <li>Occasional product updates (you can unsubscribe anytime)</li>
          </ul>
          <p>
            <strong>We will never sell your data.</strong>
          </p>

          <h2>Where It&apos;s Stored</h2>
          <p>
            Your email and contact information is stored securely with Brevo, our email service provider.
            Brevo maintains industry-standard security practices and complies with relevant data protection regulations.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Unsubscribe from our emails at any time</li>
            <li>Request to see what data we have about you</li>
            <li>Request deletion of your data</li>
          </ul>

          <h2>Analytics</h2>
          <p>
            We use privacy-friendly analytics (Umami) to understand how people use our website.
            This data is anonymized and does not personally identify you.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy as our service evolves. Any changes will be posted on this page
            with an updated date.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about privacy or your data? Email us at{' '}
            <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
