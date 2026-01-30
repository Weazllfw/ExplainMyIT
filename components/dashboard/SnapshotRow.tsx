'use client';

/**
 * Snapshot Row Component
 * 
 * Enhanced table row with time ago indicator and quick actions.
 */

import Link from 'next/link';
import { formatTimeAgo, getTimeAgoIndicator } from '@/lib/utils/time';
import { SnapshotActions } from './SnapshotActions';

interface Snapshot {
  id: string;
  domain: string;
  created_at: string;
  status: string;
}

interface SnapshotRowProps {
  snapshot: Snapshot;
}

export function SnapshotRow({ snapshot }: SnapshotRowProps) {
  const timeAgo = getTimeAgoIndicator(snapshot.created_at);
  const reportUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/report/${snapshot.id}`;

  // Style based on age (subtle, no fear)
  const timeAgoColor = {
    'fresh': 'text-green-700',
    'recent': 'text-gray-700',
    'old': 'text-gray-500',
    'very-old': 'text-gray-400',
  }[timeAgo.severity];

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Domain */}
      <td className="py-4 px-4">
        <Link
          href={`/report/${snapshot.id}`}
          className="font-medium text-brand-navy hover:text-brand-cyan transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          {snapshot.domain}
        </Link>
      </td>

      {/* Date Taken */}
      <td className="py-4 px-4 text-sm text-gray-600">
        {new Date(snapshot.created_at).toLocaleDateString()}
      </td>

      {/* Time Ago (NEW) */}
      <td className={`py-4 px-4 text-sm font-medium ${timeAgoColor}`}>
        {timeAgo.text}
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {snapshot.status}
        </span>
      </td>

      {/* Actions (NEW) */}
      <td className="py-4 px-4">
        <SnapshotActions
          snapshotId={snapshot.id}
          domain={snapshot.domain}
          reportUrl={reportUrl}
        />
      </td>
    </tr>
  );
}
