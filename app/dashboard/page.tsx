/**
 * Dashboard Page
 * 
 * View all saved snapshots for logged-in users
 */

import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth/supabase-auth';
import { getUserSnapshots } from '@/lib/db/snapshots';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your saved IT snapshots',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  // Check authentication
  const user = await getCurrentUser();

  if (!user) {
    // Not logged in - redirect to login with return URL
    redirect('/login?redirect=/dashboard');
  }

  // Get user's snapshots
  const { snapshots, error } = await getUserSnapshots(user.id);

  const showWelcome = searchParams.welcome === 'true';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-brand-bg">
        <div className="container-section py-12">
          {/* Welcome Banner (shown after signup) */}
          {showWelcome && (
            <div className="mb-8 bg-brand-positive/10 border border-brand-positive/30 rounded-[16px] p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-positive/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-[20px] font-bold text-brand-navy mb-2">
                    Welcome to Explain My IT! 🎉
                  </h2>
                  <p className="text-brand-slate text-[15px]">
                    Your account is ready. You can now run snapshots and save them to your dashboard. Each domain gets 1 free snapshot every 30 days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-[36px] font-bold text-brand-navy mb-2">
              Your Dashboard
            </h1>
            <p className="text-brand-slate text-[16px]">
              View and manage your IT snapshots
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardContent 
            user={user} 
            snapshots={snapshots || []} 
            error={error} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
