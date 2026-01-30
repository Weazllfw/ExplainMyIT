/**
 * Signup Page Analytics Tracker
 * 
 * Tracks page view for signup page
 */

'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function SignupPageTracker() {
  useEffect(() => {
    trackEvent('page-view', { page: 'signup' });
  }, []);

  return null;
}
