/**
 * Error Page
 * 
 * Generic error page for report access issues
 */

import Link from 'next/link';

interface ErrorPageProps {
  searchParams: {
    message?: string;
  };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const message = searchParams.message || 'Something went wrong';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4" aria-hidden="true">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h1>
        <p className="text-gray-600 mb-6">{decodeURIComponent(message)}</p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
            aria-label="Go to homepage to request a new snapshot"
          >
            Request New Snapshot
          </Link>
          <p className="text-sm text-gray-500">
            If you think this is a mistake, please check your email for the correct link or{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              request a new snapshot
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata({ searchParams }: ErrorPageProps) {
  return {
    title: 'Error - Explain My IT',
    description: 'An error occurred while accessing your report',
    robots: 'noindex, nofollow',
  };
}
