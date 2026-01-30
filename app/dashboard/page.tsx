/**
 * Dashboard Page
 * 
 * View all saved snapshots for logged-in users
 */

import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardClientWrapper from '@/components/dashboard/DashboardClientWrapper';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your saved IT snapshots',
};

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { welcome?: string };
}) {
  const showWelcome = searchParams.welcome === 'true';

  return (
    <>
      <Header />
      <DashboardClientWrapper showWelcome={showWelcome} />
      <Footer />
    </>
  );
}
