/**
 * Login Page Analytics Tracker
 * 
 * Tracks page view for login page
 */

'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export default function LoginPageTracker() {
  useEffect(() => {
    trackEvent('page-view', { page: 'login' });
  }, []);

  return null;
}
