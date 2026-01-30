'use client';

/**
 * Saved Indicator Component
 * 
 * Shows that snapshot has been saved for future reference.
 * Makes it feel like a record, not a toy.
 * 
 * Purpose: Behavioral nudge toward treating snapshots as valuable records.
 */

import { useState, useEffect } from 'react';

interface SavedIndicatorProps {
  isOwnedByUser: boolean;
}

export function SavedIndicator({ isOwnedByUser }: SavedIndicatorProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOwnedByUser) {
      // Show after a brief delay
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOwnedByUser]);

  if (!show || !isOwnedByUser) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in print:hidden">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">
          Snapshot saved to your account for future reference
        </span>
      </div>
    </div>
  );
}
