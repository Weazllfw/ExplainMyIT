/**
 * Forgot Password Page View Tracker
 */

'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

export default function ForgotPasswordPageTracker() {
  useEffect(() => {
    Analytics.track('page-view', { page: '/forgot-password' });
  }, []);

  return null;
}
