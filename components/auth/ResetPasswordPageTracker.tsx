/**
 * Reset Password Page View Tracker
 */

'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

export default function ResetPasswordPageTracker() {
  useEffect(() => {
    Analytics.track('page-view', { page: '/reset-password' });
  }, []);

  return null;
}
