/**
 * Email Authentication Matrix Component
 * 
 * Visual representation of email authentication signal coverage.
 * Shows SPF, DKIM, DMARC status at a glance without jargon.
 * 
 * Purpose: Instant clarity on partial coverage, pairs with LLM narrative.
 */

import type { EmailSignals } from '@/types/database';

interface EmailAuthMatrixProps {
  signals: EmailSignals | null | undefined;
}

export function EmailAuthMatrix({ signals }: EmailAuthMatrixProps) {
  if (!signals) return null;

  const authSignals = [
    {
      id: 'spf',
      label: 'SPF',
      present: signals.has_spf,
      tooltip: 'Sender Policy Framework - helps verify sending server',
    },
    {
      id: 'dkim',
      label: 'DKIM',
      present: signals.has_dkim,
      tooltip: 'DomainKeys Identified Mail - email signature verification',
    },
    {
      id: 'dmarc',
      label: 'DMARC',
      present: signals.has_dmarc,
      tooltip: 'Domain-based Message Authentication - email policy enforcement',
    },
  ];

  const presentCount = authSignals.filter(s => s.present).length;

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-brand-navy">
          Email Identity Signals
        </h3>
        <span className="text-xs text-gray-500">
          {presentCount} of {authSignals.length} observed
        </span>
      </div>
      
      {/* Matrix view */}
      <div className="space-y-3">
        {authSignals.map((signal) => (
          <div
            key={signal.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              <div className="relative">
                {signal.present ? (
                  <div className="w-5 h-5 rounded-full bg-brand-navy flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white" />
                )}
              </div>
              
              {/* Label */}
              <span className="font-medium text-sm text-brand-slate">
                {signal.label}
              </span>
            </div>
            
            {/* Status text */}
            <span className="text-xs text-gray-500">
              {signal.present ? 'Present' : 'Not observed'}
            </span>
          </div>
        ))}
      </div>
      
      {/* Context note */}
      {presentCount < 3 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-600 leading-relaxed">
            Partial email authentication coverage is common. See the detailed narrative below for context.
          </p>
        </div>
      )}
    </div>
  );
}
