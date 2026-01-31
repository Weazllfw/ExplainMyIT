import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Explain My IT',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  const lastUpdated = 'January 31, 2026';
  const effectiveDate = 'January 31, 2026';
  
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="mb-4 text-gray-900">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: {lastUpdated} | Effective: {effectiveDate}
            </p>
          </div>
        </section>
        
        <article className="container-section max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-bold">
          <h2>Agreement to Terms</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you 
            (&quot;you,&quot; &quot;your,&quot; or &quot;User&quot;) and Explain My IT (&quot;we,&quot; 
            &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;) governing your access to and use of 
            our website, services, and products (collectively, the &quot;Service&quot;).
          </p>
          <p>
            <strong>
              BY ACCESSING OR USING THE SERVICE, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE 
              TO THESE TERMS, DO NOT USE THE SERVICE.
            </strong>
          </p>
          <p>
            These Terms apply to all users of the Service, including both free and paid subscribers.
          </p>

          <h2>Description of Service</h2>
          <p>
            Explain My IT is a software-as-a-service (SaaS) platform that generates plain-English reports 
            about business IT infrastructure. Our Service:
          </p>
          <ul>
            <li>Collects publicly available information about domains, DNS configurations, SSL certificates, 
            and email security settings</li>
            <li>Uses artificial intelligence to analyze and interpret this technical data</li>
            <li>Generates plain-English reports explaining IT configuration in business terms</li>
            <li>Maintains dated records of IT configuration over time</li>
            <li>Provides dashboard access to view and manage reports</li>
          </ul>
          <p>
            <strong>Important:</strong> Explain My IT is an informational tool. We do not:
          </p>
          <ul>
            <li>Access, scan, or interact with your private systems or servers</li>
            <li>Make changes to your IT infrastructure</li>
            <li>Provide IT management, security services, or technical support for your systems</li>
            <li>Guarantee the security of your IT infrastructure</li>
            <li>Act as a managed service provider (MSP) or IT consultant</li>
          </ul>

          <h2>Eligibility</h2>
          <p>You must meet the following requirements to use the Service:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Have the legal capacity to enter into a binding agreement</li>
            <li>Not be prohibited from using the Service under applicable laws</li>
            <li>Not have been previously banned or suspended from the Service</li>
          </ul>
          <p>
            By using the Service, you represent and warrant that you meet these eligibility requirements.
          </p>

          <h2>Account Registration and Security</h2>
          
          <h3>Account Creation</h3>
          <p>To use certain features of the Service, you must create an account by providing:</p>
          <ul>
            <li>A valid email address</li>
            <li>Your full name</li>
            <li>A secure password</li>
          </ul>

          <h3>Account Responsibilities</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access or security breach</li>
            <li>Ensuring the accuracy and completeness of information provided</li>
          </ul>

          <h3>Account Security</h3>
          <p>
            You agree to use a strong, unique password and not share your account credentials with others. 
            We are not liable for any loss or damage arising from your failure to maintain account security.
          </p>

          <h3>Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without notice, 
            if we believe you have violated these Terms or engaged in fraudulent, abusive, or illegal activity.
          </p>

          <h2>Subscription Plans and Pricing</h2>
          
          <h3>Service Tiers</h3>
          <p>We offer the following service tiers:</p>
          <ul>
            <li><strong>Free Tier:</strong> Limited access to generate IT snapshot reports with restrictions 
            on frequency and history retention (30 days)</li>
            <li><strong>Basic Subscription ($15/month):</strong> Automatic monthly snapshots, unlimited report 
            history, full access to past reports, and priority support</li>
          </ul>

          <h3>Pricing</h3>
          <p>
            Subscription pricing is displayed on our Pricing page and is subject to change. We will provide 
            at least 30 days&apos; notice before any price increases for existing subscribers. New prices will 
            not affect existing subscriptions until the next billing cycle following the notice period.
          </p>

          <h3>Billing and Payment</h3>
          <p>
            Subscriptions are billed monthly in advance. By subscribing, you authorize us to charge your 
            payment method on file:
          </p>
          <ul>
            <li>At the start of each billing period</li>
            <li>Upon renewal unless you cancel before the renewal date</li>
            <li>For any applicable taxes or fees</li>
          </ul>

          <h3>Payment Processing</h3>
          <p>
            All payments are processed securely through Stripe, our third-party payment processor. You agree 
            to Stripe&apos;s Terms of Service and Privacy Policy. We do not store complete payment card information.
          </p>

          <h3>Failed Payments</h3>
          <p>
            If a payment fails, we will:
          </p>
          <ul>
            <li>Notify you via email</li>
            <li>Attempt to process payment again according to Stripe&apos;s retry schedule</li>
            <li>Downgrade your account to the Free tier if payment cannot be completed</li>
          </ul>
          <p>
            You remain responsible for any outstanding amounts owed.
          </p>

          <h3>Taxes</h3>
          <p>
            Prices do not include applicable sales tax, VAT, GST, or other taxes. You are responsible for 
            any taxes that apply to your purchase. We will collect and remit taxes where required by law.
          </p>

          <h2>Cancellation and Refunds</h2>
          
          <h3>Cancellation Policy</h3>
          <p>You may cancel your subscription at any time:</p>
          <ul>
            <li>Cancellation takes effect at the end of your current billing period</li>
            <li>You retain access to paid features until the end of the paid period</li>
            <li>Your account automatically converts to the Free tier after the paid period ends</li>
            <li>No refunds are provided for partial months or unused time</li>
          </ul>

          <h3>Refund Policy</h3>
          <p>
            <strong>All subscription payments are non-refundable</strong>, except:
          </p>
          <ul>
            <li>If we terminate your account without cause</li>
            <li>If we fail to provide the Service as described</li>
            <li>If required by applicable law</li>
            <li>At our sole discretion on a case-by-case basis</li>
          </ul>
          <p>
            To request a refund, contact us at{' '}
            <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a> within 7 days of the charge.
          </p>

          <h3>Free Trial (if applicable)</h3>
          <p>
            If we offer a free trial, your payment method will be charged automatically at the end of the 
            trial period unless you cancel before the trial ends. Trial terms will be specified at signup 
            and may not be combined with other offers.
          </p>

          <h2>Acceptable Use Policy</h2>
          
          <h3>Permitted Use</h3>
          <p>You may use the Service only for lawful purposes and in accordance with these Terms. You agree to:</p>
          <ul>
            <li>Use the Service for legitimate business purposes</li>
            <li>Submit only domains you own or have authorization to analyze</li>
            <li>Respect the intellectual property rights of others</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>

          <h3>Prohibited Conduct</h3>
          <p>You agree NOT to:</p>
          <ul>
            <li>Use the Service to violate any law or regulation</li>
            <li>Submit domains you do not own or have authorization to analyze</li>
            <li>Use the Service to harm, harass, or interfere with others</li>
            <li>Attempt to gain unauthorized access to the Service or other users&apos; accounts</li>
            <li>Reverse engineer, decompile, or disassemble the Service</li>
            <li>Use automated scripts, bots, or scrapers to access the Service</li>
            <li>Overload or interfere with the proper functioning of the Service</li>
            <li>Circumvent or disable any security features or usage limits</li>
            <li>Share your account credentials or allow others to use your account</li>
            <li>Resell, sublicense, or redistribute the Service without authorization</li>
            <li>Use the Service to compete with us or create a similar product</li>
            <li>Collect or store personal data of other users</li>
            <li>Upload or transmit viruses, malware, or harmful code</li>
            <li>Engage in fraudulent activity or payment disputes without valid cause</li>
          </ul>

          <h3>Rate Limits</h3>
          <p>
            Free tier accounts are subject to usage limits, including frequency of report generation. 
            Excessive use may result in temporary suspension or account termination.
          </p>

          <h3>Enforcement</h3>
          <p>
            Violation of this Acceptable Use Policy may result in:
          </p>
          <ul>
            <li>Warning and request to cease prohibited activity</li>
            <li>Temporary suspension of your account</li>
            <li>Permanent termination of your account without refund</li>
            <li>Legal action if warranted</li>
          </ul>

          <h2>Intellectual Property Rights</h2>
          
          <h3>Our Intellectual Property</h3>
          <p>
            The Service, including all software, content, designs, trademarks, logos, and materials 
            (&quot;Company IP&quot;), is owned by Explain My IT and is protected by copyright, trademark, 
            and other intellectual property laws.
          </p>
          <p>
            We grant you a limited, non-exclusive, non-transferable, revocable license to access and use 
            the Service for your personal or internal business purposes, subject to these Terms.
          </p>
          <p>
            You do NOT acquire any ownership rights to the Service or Company IP. You may not reproduce, 
            distribute, modify, or create derivative works based on the Service without our express written 
            permission.
          </p>

          <h3>Your Content</h3>
          <p>
            You retain ownership of any domain names you submit and any content you provide 
            (&quot;Your Content&quot;). By submitting Your Content, you grant us a worldwide, non-exclusive, 
            royalty-free license to:
          </p>
          <ul>
            <li>Collect publicly available information about domains you submit</li>
            <li>Process and analyze this information using our Service</li>
            <li>Generate and deliver reports to you</li>
            <li>Store Your Content as necessary to provide the Service</li>
          </ul>

          <h3>Report Ownership</h3>
          <p>
            Reports generated by the Service are provided to you for your use. You may:
          </p>
          <ul>
            <li>Download, print, and share reports within your organization</li>
            <li>Use reports for your business purposes</li>
          </ul>
          <p>
            You may NOT:
          </p>
          <ul>
            <li>Resell or redistribute reports to third parties as a commercial service</li>
            <li>Remove or obscure any attribution or branding from reports</li>
            <li>Use reports to create a competing product or service</li>
          </ul>

          <h3>Feedback</h3>
          <p>
            If you provide feedback, suggestions, or ideas about the Service, you grant us the right to use 
            them without compensation or attribution, for any purpose, including improving the Service.
          </p>

          <h2>Disclaimers and Limitations of Liability</h2>
          
          <h3>Service Provided &quot;AS IS&quot;</h3>
          <p>
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT 
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
            <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
            <li>Warranties regarding the accuracy, reliability, or completeness of reports or information</li>
          </ul>

          <h3>No Professional Advice</h3>
          <p>
            <strong>IMPORTANT:</strong> The Service provides informational reports only and does not 
            constitute professional IT advice, security audits, or recommendations. We are NOT:
          </p>
          <ul>
            <li>IT consultants, security professionals, or managed service providers</li>
            <li>Responsible for making decisions about your IT infrastructure</li>
            <li>Liable for the security or operation of your systems</li>
          </ul>
          <p>
            You should consult qualified IT professionals before making any decisions based on our reports. 
            Do not rely solely on our Service for security, compliance, or operational decisions.
          </p>

          <h3>AI-Generated Content</h3>
          <p>
            Reports are generated using artificial intelligence and may contain errors, omissions, or 
            inaccuracies. We do not guarantee the accuracy or completeness of AI-generated content. 
            You are responsible for verifying all information before relying on it.
          </p>

          <h3>Third-Party Data</h3>
          <p>
            Our Service relies on publicly available data from third-party sources (DNS servers, SSL 
            certificate authorities, etc.). We are not responsible for the accuracy, availability, or 
            reliability of third-party data.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, EXPLAIN MY IT AND ITS OFFICERS, DIRECTORS, EMPLOYEES, 
            AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
          </p>
          <ul>
            <li>ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
            <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
            <li>BUSINESS INTERRUPTION OR DOWNTIME</li>
            <li>SECURITY BREACHES, DATA LOSS, OR SYSTEM FAILURES</li>
            <li>ERRORS, OMISSIONS, OR INACCURACIES IN REPORTS</li>
            <li>DECISIONS MADE BASED ON OUR REPORTS OR SERVICE</li>
            <li>THIRD-PARTY CONDUCT OR CONTENT</li>
          </ul>
          <p>
            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS 
            PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
          </p>
          <p>
            This limitation applies regardless of the legal theory (contract, tort, negligence, strict 
            liability, or otherwise) and even if we have been advised of the possibility of such damages.
          </p>

          <h3>Jurisdictional Limitations</h3>
          <p>
            Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability 
            for consequential damages. In such jurisdictions, our liability is limited to the maximum extent 
            permitted by law.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Explain My IT and its officers, directors, 
            employees, agents, and affiliates from and against any and all claims, damages, obligations, 
            losses, liabilities, costs, and expenses (including attorney&apos;s fees) arising from:
          </p>
          <ul>
            <li>Your use or misuse of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any law or regulation</li>
            <li>Your violation of any third-party rights</li>
            <li>Any content you submit or actions you take using the Service</li>
            <li>Decisions you make based on reports or information from the Service</li>
          </ul>
          <p>
            We reserve the right to assume exclusive defense and control of any matter subject to 
            indemnification, and you agree to cooperate with our defense.
          </p>

          <h2>Data Privacy and Security</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into 
            these Terms by reference. Please review our{' '}
            <a href="/privacy">Privacy Policy</a> to understand how we collect, use, and protect your data.
          </p>
          <p>
            We implement reasonable security measures to protect your data, but we cannot guarantee absolute 
            security. You acknowledge that internet transmission is never completely secure, and you use the 
            Service at your own risk.
          </p>

          <h2>Service Availability and Modifications</h2>
          
          <h3>Availability</h3>
          <p>
            We strive to provide reliable service but do not guarantee uninterrupted availability. The 
            Service may be unavailable due to:
          </p>
          <ul>
            <li>Scheduled maintenance (we will provide advance notice when possible)</li>
            <li>Emergencies or technical issues</li>
            <li>Third-party service disruptions</li>
            <li>Events beyond our reasonable control</li>
          </ul>

          <h3>Modifications to the Service</h3>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, 
            with or without notice. We are not liable for any modification, suspension, or discontinuation 
            of the Service.
          </p>

          <h3>Updates to Terms</h3>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify you by:
          </p>
          <ul>
            <li>Email notification to your registered email address</li>
            <li>Prominent notice in your dashboard</li>
            <li>Updating the &quot;Last Updated&quot; date at the top of this page</li>
          </ul>
          <p>
            Your continued use of the Service after changes take effect constitutes acceptance of the 
            updated Terms. If you do not agree to the updated Terms, you must stop using the Service and 
            cancel your account.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our Service may integrate with or link to third-party services, websites, or content. We are 
            not responsible for:
          </p>
          <ul>
            <li>The availability, accuracy, or content of third-party services</li>
            <li>Third-party privacy practices or terms of service</li>
            <li>Any damages or losses resulting from your use of third-party services</li>
          </ul>
          <p>
            Your use of third-party services is governed by their respective terms and privacy policies.
          </p>

          <h2>Governing Law and Dispute Resolution</h2>
          
          <h3>Governing Law</h3>
          <p>
            These Terms are governed by and construed in accordance with the laws of the Province of 
            Ontario and the federal laws of Canada applicable therein, without regard to conflict of 
            law principles.
          </p>
          <p>
            The Service is operated by Marshall Digital Solutions LTD, a company incorporated in Ontario, 
            Canada.
          </p>

          <h3>Dispute Resolution</h3>
          <p>
            In the event of any dispute, controversy, or claim arising out of or relating to these Terms 
            or the Service:
          </p>
          <ul>
            <li><strong>Informal Resolution:</strong> You agree to first contact us at{' '}
            <a href="mailto:contact@explainmyit.com">contact@explainmyit.com</a> to attempt to resolve 
            the dispute informally</li>
            <li><strong>Binding Arbitration:</strong> If we cannot resolve the dispute informally within 
            30 days, the dispute will be resolved through binding arbitration in accordance with the 
            Arbitration Act (Ontario) and the rules of the ADR Institute of Canada</li>
            <li><strong>Class Action Waiver:</strong> You agree to resolve disputes on an individual basis 
            only and waive any right to participate in a class action or class-wide arbitration</li>
            <li><strong>Small Claims Court:</strong> Either party may bring an action in small claims court 
            in Ontario as an alternative to arbitration</li>
          </ul>

          <h3>Jurisdiction and Venue</h3>
          <p>
            To the extent arbitration does not apply, you agree that any legal action must be brought in 
            the courts located in Toronto, Ontario, Canada, and you consent to the exclusive jurisdiction 
            of those courts.
          </p>

          <h3>Injunctive Relief</h3>
          <p>
            Notwithstanding the above, we may seek injunctive or other equitable relief in any court of 
            competent jurisdiction to prevent unauthorized use or abuse of the Service or infringement of 
            our intellectual property rights.
          </p>

          <h2>General Provisions</h2>
          
          <h3>Entire Agreement</h3>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
            Explain My IT regarding the Service and supersede all prior agreements, understandings, or 
            communications.
          </p>

          <h3>Severability</h3>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, that provision will be 
            limited or eliminated to the minimum extent necessary, and the remaining provisions will remain 
            in full force and effect.
          </p>

          <h3>Waiver</h3>
          <p>
            Our failure to enforce any provision of these Terms does not constitute a waiver of that 
            provision or any other provision. No waiver will be effective unless in writing and signed by us.
          </p>

          <h3>Assignment</h3>
          <p>
            You may not assign or transfer these Terms or your account without our prior written consent. 
            We may assign these Terms or delegate any obligations without restriction.
          </p>

          <h3>Force Majeure</h3>
          <p>
            We are not liable for any failure or delay in performance due to causes beyond our reasonable 
            control, including acts of God, natural disasters, war, terrorism, labor disputes, or government 
            actions.
          </p>

          <h3>Survival</h3>
          <p>
            Provisions that by their nature should survive termination of these Terms (including intellectual 
            property, disclaimers, limitation of liability, indemnification, and dispute resolution) will 
            survive termination.
          </p>

          <h3>Relationship</h3>
          <p>
            Nothing in these Terms creates a partnership, joint venture, employment, or agency relationship 
            between you and Explain My IT.
          </p>

          <h3>Export Compliance</h3>
          <p>
            You agree to comply with all applicable Canadian export control laws and regulations, as well 
            as international trade laws. You represent that you are not located in a country subject to 
            Canadian government embargo or designated as a country supporting terrorism, and that you are 
            not on any Canadian government prohibited or restricted party list.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have questions about these Terms or the Service, please contact us:
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
            <strong>Legal Inquiries:</strong> Include &quot;Legal&quot; in the subject line
          </p>

          <h2>Acknowledgment</h2>
          <p>
            <strong>
              BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND 
              BY THESE TERMS OF SERVICE. IF YOU DO NOT AGREE, YOU MUST NOT USE THE SERVICE.
            </strong>
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
