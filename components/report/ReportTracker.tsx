/**
 * Report Tracker Component
 * 
 * Tracks report page views via Umami (client-side)
 */

'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

interface ReportTrackerProps {
  snapshotId: string;
  domain: string;
}

export function ReportTracker({ snapshotId, domain }: ReportTrackerProps) {
  useEffect(() => {
    // Track report view on mount
    Analytics.reportViewed(snapshotId, domain);
  }, [snapshotId, domain]);

  return null; // No UI
}
