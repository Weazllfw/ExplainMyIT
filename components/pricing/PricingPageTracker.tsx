/**
 * Pricing Page Tracker
 * 
 * Tracks pricing page engagement and interactions
 */

'use client';

import { useEffect } from 'react';
import { UmamiEvents } from '@/lib/analytics/umami-events';

export function PricingPageTracker() {
  useEffect(() => {
    // Track pricing page view
    UmamiEvents.pricingPageViewed();
  }, []);

  return null;
}
