import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Explain My IT handles your data',
};

export default function PrivacyPage() {
  const lastUpdated = 'January 31, 2026';
  
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
        
        <article className="container-section max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold">
          <h2>Introduction</h2>
          <p>
            Explain My IT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
            our website and services.
          </p>
          <p>
            <strong>By using our service, you agree to the collection and use of information in accordance with this policy.</strong>
          </p>

          <h2>Information We Collect</h2>
          
          <h3>Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Email address (required for authentication and service delivery)</li>
            <li>Full name (required)</li>
            <li>Password (encrypted and never stored in plain text)</li>
          </ul>

          <h3>Domain Information</h3>
          <p>When you request IT snapshots, we collect:</p>
          <ul>
            <li>Domain names you submit for analysis</li>
            <li>Publicly available DNS, SSL, and email security configuration data for those domains</li>
            <li>Technical metadata about domain infrastructure (all obtained from public sources)</li>
          </ul>

          <h3>Payment Information</h3>
          <p>
            If you subscribe to a paid plan, we collect payment information through our payment processor, Stripe. 
            We do not store your complete credit card information on our servers. Stripe stores your payment 
            information in accordance with PCI-DSS standards.
          </p>
          <p>We store:</p>
          <ul>
            <li>Stripe customer ID (for billing management)</li>
            <li>Subscription status and tier</li>
            <li>Last 4 digits of card (for your reference)</li>
            <li>Payment history and invoice records</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information about your use of our service:</p>
          <ul>
            <li>Report generation timestamps and domain queries</li>
            <li>Login timestamps and authentication events</li>
            <li>Feature usage patterns (anonymized)</li>
            <li>Browser type, operating system, and device information</li>
            <li>IP address (for security and fraud prevention)</li>
          </ul>

          <h3>Analytics Data</h3>
          <p>
            We use Umami Analytics, a privacy-friendly analytics service, to understand how visitors interact 
            with our website. Umami:
          </p>
          <ul>
            <li>Does not use cookies</li>
            <li>Does not track users across websites</li>
            <li>Anonymizes all visitor data</li>
            <li>Does not collect personally identifiable information</li>
            <li>Is GDPR, CCPA, and PECR compliant</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our service</li>
            <li>Generate IT snapshot reports for your submitted domains</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send service-related emails (welcome, subscription confirmations, monthly snapshots, payment issues)</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Monitor and analyze usage patterns to improve our service</li>
            <li>Detect, prevent, and address security issues or fraudulent activity</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
          </ul>
          <p>
            <strong>We will never sell, rent, or share your personal information with third parties for their marketing purposes.</strong>
          </p>

          <h2>Data Storage and Security</h2>
          
          <h3>Where Your Data is Stored</h3>
          <ul>
            <li><strong>Account data:</strong> Stored in Supabase (PostgreSQL database) with encryption at rest and in transit</li>
            <li><strong>Authentication:</strong> Managed by Supabase Auth with industry-standard security</li>
            <li><strong>Payment data:</strong> Stored by Stripe (PCI-DSS Level 1 certified)</li>
            <li><strong>Email delivery:</strong> Managed by Brevo (complies with GDPR and data protection regulations)</li>
            <li><strong>Analytics:</strong> Umami Analytics (privacy-focused, no personal data stored)</li>
            <li><strong>Application hosting:</strong> Vercel (SOC 2 Type II certified)</li>
          </ul>

          <h3>Security Measures</h3>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li>All data transmission is encrypted using SSL/TLS</li>
            <li>Passwords are hashed using bcrypt before storage</li>
            <li>Database access is restricted and logged</li>
            <li>Regular security audits and updates</li>
            <li>Row-level security policies in our database</li>
            <li>Automatic logout after inactivity</li>
          </ul>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure. 
            While we strive to protect your information, we cannot guarantee absolute security.
          </p>

          <h2>Data Retention</h2>
          <p>We retain your information for as long as necessary to provide our services and as required by law:</p>
          <ul>
            <li><strong>Account data:</strong> Retained while your account is active and for 90 days after account deletion</li>
            <li><strong>Report data:</strong> Retained according to your subscription tier (30 days for free, unlimited for Basic subscribers)</li>
            <li><strong>Payment records:</strong> Retained for 7 years to comply with financial regulations</li>
            <li><strong>Email logs:</strong> Retained for 30 days for deliverability tracking</li>
          </ul>

          <h2>Data Sharing and Disclosure</h2>
          <p>We do not sell or rent your personal information. We may share your information only in the following circumstances:</p>
          
          <h3>Service Providers</h3>
          <p>We share data with trusted third-party service providers who help us operate our service:</p>
          <ul>
            <li><strong>Supabase:</strong> Database and authentication services</li>
            <li><strong>Vercel:</strong> Application hosting and deployment</li>
            <li><strong>Stripe:</strong> Payment processing</li>
            <li><strong>Brevo:</strong> Transactional email delivery</li>
            <li><strong>Umami:</strong> Privacy-friendly analytics</li>
            <li><strong>Anthropic (Claude AI):</strong> AI-powered report generation (only domain configuration data, no personal information)</li>
          </ul>
          <p>
            All service providers are contractually obligated to protect your data and use it only for the purposes 
            we specify.
          </p>

          <h3>Legal Requirements</h3>
          <p>We may disclose your information if required by law or if we believe it&apos;s necessary to:</p>
          <ul>
            <li>Comply with legal process or government requests</li>
            <li>Enforce our Terms of Service</li>
            <li>Protect our rights, property, or safety, or that of our users or the public</li>
            <li>Detect, prevent, or address fraud, security, or technical issues</li>
          </ul>

          <h3>Business Transfers</h3>
          <p>
            If Explain My IT is involved in a merger, acquisition, or sale of assets, your information may be 
            transferred as part of that transaction. We will notify you via email and/or a prominent notice on 
            our website before your information is transferred and becomes subject to a different privacy policy.
          </p>

          <h2>Your Rights and Choices</h2>
          
          <h3>Access and Portability</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information at any time through your account dashboard</li>
            <li>Export your report data and account information</li>
            <li>Request a copy of all data we hold about you</li>
          </ul>

          <h3>Correction and Deletion</h3>
          <p>You can:</p>
          <ul>
            <li>Update your account information at any time in your account settings</li>
            <li>Delete individual reports from your dashboard</li>
            <li>Request full account deletion by contacting us at{' '}
              <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a>
            </li>
          </ul>
          <p>
            When you delete your account, we will delete or anonymize your personal information within 90 days, 
            except where we are required to retain it for legal or regulatory purposes.
          </p>

          <h3>Email Communications</h3>
          <p>You will receive:</p>
          <ul>
            <li><strong>Transactional emails</strong> (account confirmations, subscription updates, password resets) - 
            these are necessary for service operation and cannot be opted out of while you have an account</li>
            <li><strong>Service updates</strong> (new features, important changes) - you can unsubscribe from these 
            while maintaining your account</li>
          </ul>

          <h3>Subscription Management</h3>
          <p>You can:</p>
          <ul>
            <li>Cancel your subscription at any time (access continues until the end of your billing period)</li>
            <li>Manage payment methods through your dashboard</li>
            <li>View billing history and download invoices</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>We use minimal cookies and tracking technologies:</p>
          <ul>
            <li><strong>Authentication cookies:</strong> Required to keep you logged in (session-only)</li>
            <li><strong>CSRF protection:</strong> Security tokens to protect against cross-site attacks</li>
            <li><strong>Analytics:</strong> Umami (cookieless, privacy-friendly analytics)</li>
          </ul>
          <p>
            We do <strong>not</strong> use third-party advertising cookies or tracking pixels. We do <strong>not</strong> 
            track you across other websites.
          </p>

          <h2>International Users and Data Transfers</h2>
          <p>
            Our service is operated from the United States. If you are accessing our service from outside the 
            United States, please be aware that your information may be transferred to, stored, and processed in 
            the United States and other countries where our service providers operate.
          </p>
          <p>
            By using our service, you consent to the transfer of your information to countries outside of your 
            country of residence, which may have different data protection rules.
          </p>

          <h3>GDPR Compliance (European Users)</h3>
          <p>If you are in the European Economic Area (EEA), you have additional rights under GDPR:</p>
          <ul>
            <li><strong>Right to access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to rectification:</strong> Correct inaccurate personal data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
            <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
            <li><strong>Right to data portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to object:</strong> Object to processing of your personal data</li>
            <li><strong>Right to withdraw consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a>. 
            We will respond within 30 days.
          </p>

          <h3>CCPA Compliance (California Users)</h3>
          <p>If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):</p>
          <ul>
            <li><strong>Right to know:</strong> What personal information we collect and how we use it</li>
            <li><strong>Right to delete:</strong> Request deletion of your personal information</li>
            <li><strong>Right to opt-out:</strong> We do not sell personal information, so there is nothing to opt out of</li>
            <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising your rights</li>
          </ul>

          <h3>PIPEDA Compliance (Canadian Users)</h3>
          <p>
            We comply with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA). 
            As a Canadian company (Marshall Digital Solutions LTD, Toronto, Ontario), we are committed to:
          </p>
          <ul>
            <li><strong>Accountability:</strong> We are responsible for personal information under our control</li>
            <li><strong>Identifying purposes:</strong> We clearly identify why we collect information before or at the time of collection</li>
            <li><strong>Consent:</strong> We obtain your consent for collection, use, or disclosure of personal information</li>
            <li><strong>Limiting collection:</strong> We only collect information necessary for identified purposes</li>
            <li><strong>Limiting use and disclosure:</strong> We only use or disclose information for the purposes identified</li>
            <li><strong>Accuracy:</strong> We keep personal information accurate, complete, and up-to-date</li>
            <li><strong>Safeguards:</strong> We protect personal information with appropriate security measures</li>
            <li><strong>Openness:</strong> We are transparent about our privacy practices</li>
            <li><strong>Individual access:</strong> You can access your personal information and challenge its accuracy</li>
            <li><strong>Challenging compliance:</strong> You can challenge our compliance with PIPEDA</li>
          </ul>
          <p>
            If you have concerns about our privacy practices that we have not adequately addressed, you may 
            file a complaint with the Office of the Privacy Commissioner of Canada.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our service is not directed to individuals under the age of 18. We do not knowingly collect 
            personal information from children under 18. If you are a parent or guardian and believe your 
            child has provided us with personal information, please contact us immediately. If we become 
            aware that we have collected personal information from children under 18, we will take steps 
            to delete that information.
          </p>

          <h2>Do Not Track Signals</h2>
          <p>
            We respect Do Not Track (DNT) signals. Our analytics provider (Umami) does not track users 
            regardless of DNT settings, as it is privacy-focused by design and does not collect personally 
            identifiable information.
          </p>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for 
            legal, regulatory, or operational reasons. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on this page with a new &quot;Last Updated&quot; date</li>
            <li>Sending an email notification to your registered email address</li>
            <li>Displaying a prominent notice in your dashboard</li>
          </ul>
          <p>
            Your continued use of our service after changes are posted constitutes your acceptance of the 
            updated Privacy Policy. We encourage you to review this policy periodically.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our service may contain links to third-party websites or services that are not owned or 
            controlled by Explain My IT. We are not responsible for the privacy practices of these 
            third parties. We encourage you to review their privacy policies before providing any 
            personal information.
          </p>

          <h2>Data Breach Notification</h2>
          <p>
            In the event of a data breach that affects your personal information, we will notify you 
            within 72 hours of becoming aware of the breach, in compliance with applicable data protection 
            laws. We will provide information about the nature of the breach, the data affected, and steps 
            we are taking to address it.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us at:
          </p>
          <p>
            <strong>Marshall Digital Solutions LTD</strong>
            <br />
            <strong>Operating as:</strong> Explain My IT
            <br />
            <strong>Location:</strong> Toronto, Ontario, Canada
            <br />
            <strong>Email:</strong>{' '}
            <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a>
            <br />
            <strong>Privacy Requests:</strong> Please include &quot;Privacy Request&quot; in the subject line
          </p>
          <p>
            We will respond to all legitimate requests within 30 days (or sooner as required by applicable law).
          </p>

          <h2>Dispute Resolution</h2>
          <p>
            If you have a complaint about our privacy practices that we have not adequately addressed, 
            you may have the right to lodge a complaint with your local data protection authority.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
