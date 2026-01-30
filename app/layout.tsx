import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://explainmyit.com'),
  title: {
    default: 'Explain My IT: Plain-English IT Reports for Business Owners',
    template: '%s | Explain My IT',
  },
  description: 'Explain My IT produces plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes. Just clarity.',
  keywords: [
    'IT explained for business owners',
    'understand my IT',
    'IT clarity for owners',
    'IT reality report',
    'business owner IT understanding',
  ],
  authors: [{ name: 'Explain My IT' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://explainmyit.com',
    siteName: 'Explain My IT',
    title: 'Explain My IT: Plain-English IT Reports for Business Owners',
    description: 'Plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes. Just clarity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explain My IT: Plain-English IT Reports for Business Owners',
    description: 'Plain-English IT reality reports for business owners. No jargon, no dashboards, no fixes. Just clarity.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Explain My IT',
      url: 'https://explainmyit.com',
      logo: 'https://explainmyit.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@explainmyit.com',
        contactType: 'customer service',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Explain My IT',
      applicationCategory: 'BusinessApplication',
      description: 'Plain-English IT reports for business owners',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {umamiSrc && umamiWebsiteId && (
          <script
            defer
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
          />
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
