/**
 * Header Actions - Client Component
 * Shows login/signup or dashboard/logout based on auth state
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth/supabase-auth';
import { Analytics } from '@/lib/analytics';

export default function HeaderActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount and when pathname changes
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      Analytics.userLoggedOut();
      setUser(null);
      router.push('/');
      router.refresh();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-32 h-10 bg-gray-100 rounded-[12px] animate-pulse"></div>
    );
  }

  // Logged in state
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          className="hidden md:inline-flex text-brand-navy hover:text-brand-cyan transition-colors font-medium text-[15px]"
        >
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="text-brand-muted hover:text-brand-navy transition-colors font-medium text-[15px]"
        >
          Log out
        </button>
      </div>
    );
  }

  // Logged out state
  return (
    <div className="flex items-center gap-3">
      <Link 
        href="/login" 
        className="text-brand-navy hover:text-brand-cyan transition-colors font-medium text-[15px]"
      >
        Log in
      </Link>
      <Link 
        href="/signup" 
        className="bg-brand-navy text-white px-5 py-2 rounded-[12px] hover:bg-brand-navy/90 transition-all font-medium shadow-brand text-[15px]"
      >
        Sign up
      </Link>
    </div>
  );
}
