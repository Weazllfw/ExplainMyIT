/**
 * Dashboard Client Wrapper
 * Handles client-side auth check and data loading
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/supabase-auth';
import { getUserSnapshots } from '@/lib/db/snapshots';
import DashboardContent from './DashboardContent';
import { Analytics } from '@/lib/analytics';

interface DashboardClientWrapperProps {
  showWelcome: boolean;
}

export default function DashboardClientWrapper({ showWelcome }: DashboardClientWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    console.log('[Dashboard] Checking auth...');
    
    // Check if user is logged in
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      console.log('[Dashboard] No user found, redirecting to login');
      router.push('/login?redirect=/dashboard');
      return;
    }

    console.log('[Dashboard] User authenticated:', currentUser.id);
    setUser(currentUser);

    // Track dashboard view
    Analytics.dashboardViewed();

    // Load user's snapshots
    try {
      const { snapshots: userSnapshots, error: snapshotsError } = await getUserSnapshots(currentUser.id);
      if (snapshotsError) {
        setError(snapshotsError);
      } else {
        setSnapshots(userSnapshots || []);
      }
    } catch (err) {
      console.error('[Dashboard] Error loading snapshots:', err);
      setError('Failed to load snapshots');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-bg">
        <div className="container-section py-12">
          <div className="space-y-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  // Not authenticated (redirecting)
  if (!user) {
    return null;
  }

  return (
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
          snapshots={snapshots} 
          error={error} 
        />
      </div>
    </main>
  );
}
