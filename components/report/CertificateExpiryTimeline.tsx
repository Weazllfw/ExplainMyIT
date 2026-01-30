/**
 * Certificate Expiry Timeline Component
 * 
 * Visual timeline showing certificate validity period.
 * Introduces time dimension without fear (even healthy certs expire).
 * 
 * Purpose: Time-based responsibility signal, no urgency needed.
 */

import { format, parseISO } from 'date-fns';
import type { TlsSignals } from '@/types/database';

interface CertificateExpiryTimelineProps {
  signals: TlsSignals | null | undefined;
}

export function CertificateExpiryTimeline({ signals }: CertificateExpiryTimelineProps) {
  if (!signals?.certificate_expires_at || signals.days_until_expiry === null) {
    return null;
  }

  const expiryDate = parseISO(signals.certificate_expires_at);
  const daysRemaining = signals.days_until_expiry;
  
  // Estimate issued date (most certs are 90 days, let's use that or default to 1 year back)
  const today = new Date();
  const estimatedTotalDays = 90; // Common cert validity period
  const daysElapsed = Math.max(0, estimatedTotalDays - daysRemaining);
  const percentElapsed = Math.min(100, Math.max(0, (daysElapsed / estimatedTotalDays) * 100));
  
  const validFrom = new Date(today);
  validFrom.setDate(validFrom.getDate() - daysElapsed);

  // Format dates
  const issuedDate = format(validFrom, 'MMM d, yyyy');
  const expiryDateFormatted = format(expiryDate, 'MMM d, yyyy');

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-brand-navy mb-6">
        Certificate Validity Period
      </h3>
      
      {/* Timeline visual */}
      <div className="relative mb-6">
        {/* Background track */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress bar */}
          <div
            className="h-full bg-gradient-to-r from-brand-navy to-blue-600 rounded-full transition-all"
            style={{ width: `${percentElapsed}%` }}
          />
        </div>
        
        {/* Current position marker */}
        <div
          className="absolute top-0 -translate-y-1 -translate-x-1/2 transition-all"
          style={{ left: `${percentElapsed}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-brand-navy border-2 border-white shadow-md" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-semibold text-brand-navy">Today</span>
          </div>
        </div>
      </div>
      
      {/* Timeline labels */}
      <div className="flex items-center justify-between text-xs mb-6 mt-12">
        <div className="text-left">
          <div className="text-gray-500">Issued</div>
          <div className="font-medium text-brand-slate">{issuedDate}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-500">Expires</div>
          <div className="font-medium text-brand-slate">{expiryDateFormatted}</div>
        </div>
      </div>
      
      {/* Days remaining */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-navy mb-1">
            {daysRemaining} days
          </div>
          <div className="text-xs text-gray-600">
            until certificate renewal is needed
          </div>
        </div>
      </div>
      
      {/* Issuer info */}
      {signals.certificate_issuer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Issued by</span>
            <span className="font-medium text-brand-slate">
              {signals.certificate_issuer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
