/**
 * Domain Age Timeline Component
 * 
 * Visual representation of domain registration age.
 * Shows organizational maturity/continuity without judgment.
 * 
 * Purpose: Introduces continuity questions (who managed this 5 years ago?).
 */

import type { DnsSignals } from '@/types/database';

interface DomainAgeTimelineProps {
  signals: DnsSignals | null | undefined;
}

export function DomainAgeTimeline({ signals }: DomainAgeTimelineProps) {
  if (!signals?.domain_age_days) {
    return null;
  }

  const ageDays = signals.domain_age_days;
  const ageYears = Math.floor(ageDays / 365);
  const ageMonths = Math.floor((ageDays % 365) / 30);

  // Determine maturity level for visual representation (no judgment language)
  let maturitySegment: 'new' | 'established' | 'mature' | 'legacy';
  let maturityLabel: string;
  let barWidth: number;

  if (ageYears < 1) {
    maturitySegment = 'new';
    maturityLabel = 'Recently registered';
    barWidth = 15;
  } else if (ageYears < 5) {
    maturitySegment = 'established';
    maturityLabel = 'Established domain';
    barWidth = 40;
  } else if (ageYears < 10) {
    maturitySegment = 'mature';
    maturityLabel = 'Mature domain';
    barWidth = 70;
  } else {
    maturitySegment = 'legacy';
    maturityLabel = 'Long-standing domain';
    barWidth = 100;
  }

  // Format age string
  let ageString: string;
  if (ageYears === 0) {
    ageString = `${ageMonths} ${ageMonths === 1 ? 'month' : 'months'}`;
  } else if (ageMonths === 0) {
    ageString = `${ageYears} ${ageYears === 1 ? 'year' : 'years'}`;
  } else {
    ageString = `${ageYears} ${ageYears === 1 ? 'year' : 'years'}, ${ageMonths} ${ageMonths === 1 ? 'month' : 'months'}`;
  }

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-brand-navy mb-6">
        Domain Registration History
      </h3>
      
      {/* Timeline visual */}
      <div className="relative mb-6">
        {/* Background track */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Age indicator bar */}
          <div
            className="h-full bg-gradient-to-r from-brand-navy to-blue-600 rounded-full transition-all"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        
        {/* Current position marker */}
        <div
          className="absolute top-0 -translate-y-1 transition-all"
          style={{ left: `${barWidth}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-brand-navy border-2 border-white shadow-md" />
        </div>
      </div>
      
      {/* Timeline labels */}
      <div className="flex items-center justify-between text-xs mb-6 mt-8">
        <div className="text-left">
          <div className="text-gray-500">Registered</div>
          <div className="font-medium text-brand-slate">{ageString} ago</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500">Status</div>
          <div className="font-medium text-brand-slate">{maturityLabel}</div>
        </div>
      </div>
      
      {/* Age display */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-navy mb-1">
            {ageYears} {ageYears === 1 ? 'year' : 'years'}
          </div>
          <div className="text-xs text-gray-600">
            of domain ownership history
          </div>
        </div>
      </div>
      
      {/* Note: domain_expiry_days not available in simplified database type */}
    </div>
  );
}
