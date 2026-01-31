/**
 * Report Tracker Component
 * 
 * Tracks report page views and engagement via Umami (client-side)
 */

'use client';

import { useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';
import { UmamiEvents } from '@/lib/analytics/umami-events';

interface ReportTrackerProps {
  snapshotId: string;
  domain: string;
  isAuthenticated?: boolean;
}

export function ReportTracker({ snapshotId, domain, isAuthenticated = false }: ReportTrackerProps) {
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Track report view on mount (once)
    if (!hasTrackedView.current) {
      Analytics.reportViewed(snapshotId, domain);
      UmamiEvents.reportViewedDetail(snapshotId, domain, isAuthenticated);
      hasTrackedView.current = true;
    }

    // Track time spent on report
    const startTime = startTimeRef.current;
    
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      // Only track if user spent > 5 seconds (filter bounces)
      if (timeSpent > 5) {
        UmamiEvents.timeOnReport(domain, timeSpent);
      }
    };
  }, [snapshotId, domain, isAuthenticated]);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
      }

      // Debounce: Report scroll milestones
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (maxScroll >= 25 && maxScroll < 50) {
          UmamiEvents.scrollDepth('report', 25);
        } else if (maxScroll >= 50 && maxScroll < 75) {
          UmamiEvents.scrollDepth('report', 50);
        } else if (maxScroll >= 75 && maxScroll < 90) {
          UmamiEvents.scrollDepth('report', 75);
        } else if (maxScroll >= 90) {
          UmamiEvents.scrollDepth('report', 100);
        }
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null; // No UI
}
