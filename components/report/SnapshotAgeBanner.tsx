/**
 * Snapshot Age Banner Component
 * 
 * Shows age of snapshot to introduce temporal decay awareness.
 * No urgency, just neutral time passage.
 * 
 * Purpose: Makes recurring snapshots feel inevitable, not upsold.
 */

import { formatTimeAgo, getTimeAgoIndicator } from '@/lib/utils/time';

interface SnapshotAgeBannerProps {
  createdAt: string;
}

export function SnapshotAgeBanner({ createdAt }: SnapshotAgeBannerProps) {
  const timeAgo = getTimeAgoIndicator(createdAt);
  const daysSince = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Don't show if less than 3 days old
  if (daysSince < 3) return null;

  // Basic message for 3-14 days
  let message = `This snapshot reflects how your IT appeared ${formatTimeAgo(createdAt)}.`;

  // Add drift language after 14 days
  if (daysSince >= 14) {
    message += ' Public-facing IT configurations often change quietly over time.';
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 print:hidden">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-900 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
