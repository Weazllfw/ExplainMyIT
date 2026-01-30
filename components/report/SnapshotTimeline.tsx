/**
 * Snapshot Timeline Component
 * 
 * Visual representation of point-in-time nature of snapshots.
 * Shows current snapshot as single point, with ghosted past/future to create
 * temporal incompleteness and drive recurring value.
 * 
 * Conversion Purpose: Make one-time snapshots feel incomplete without fear.
 */

'use client';

import { formatDistanceToNow } from 'date-fns';

interface SnapshotTimelineProps {
  createdAt: string;
}

export function SnapshotTimeline({ createdAt }: SnapshotTimelineProps) {
  const createdDate = new Date(createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-brand-navy mb-6">
        Snapshot Timeline
      </h3>
      
      {/* Timeline visual */}
      <div className="relative mb-6">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        
        {/* Timeline points */}
        <div className="relative flex items-center justify-between">
          {/* Past snapshot (ghosted) */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white relative z-10" />
            <span className="text-xs text-gray-400 mt-2">Past</span>
          </div>
          
          {/* Past snapshot 2 (ghosted) */}
          <div className="flex flex-col items-center opacity-60">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white relative z-10" />
            <span className="text-xs text-gray-400 mt-2">Past</span>
          </div>
          
          {/* Current snapshot (active) */}
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-brand-navy border-4 border-blue-100 relative z-10 shadow-md" />
            <span className="text-xs text-brand-navy font-semibold mt-2">
              Today
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5">
              {timeAgo}
            </span>
          </div>
          
          {/* Future snapshot (locked) */}
          <div className="flex flex-col items-center opacity-40" title="Recurring snapshots show what changed">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300 bg-white relative z-10" />
            <span className="text-xs text-gray-400 mt-2">Future</span>
          </div>
          
          {/* Future snapshot 2 (locked) */}
          <div className="flex flex-col items-center opacity-40" title="Recurring snapshots show what changed">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-gray-300 bg-white relative z-10" />
            <span className="text-xs text-gray-400 mt-2">Future</span>
          </div>
        </div>
      </div>
      
      {/* Conversion caption */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs text-gray-600 text-center leading-relaxed">
          This is a point-in-time snapshot. Track changes over time with{' '}
          <span className="text-brand-navy font-medium">
            recurring snapshots
          </span>
          .
        </p>
      </div>
    </div>
  );
}
