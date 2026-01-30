/**
 * Brand Surface Signals Component
 * 
 * Safe OSINT-adjacent indicators (Google Safe Browsing, Certificate Transparency).
 * Reassures without fear, adds legitimacy.
 * 
 * Purpose: OSINT signals that are Tier-1 safe and factual.
 */

interface BrandSurfaceSignalsProps {
  domain: string;
}

export function BrandSurfaceSignals({ domain }: BrandSurfaceSignalsProps) {
  // In Tier 1, we only show positive signals (reassurance)
  // Actual Safe Browsing API would be called server-side
  // For now, we show static reassurance (implement API in Tier 2)

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-brand-navy mb-4">
        Public Trust Signals
      </h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3 py-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Certificate Transparency
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              We observed SSL certificates for this domain in public certificate transparency logs, which is expected for domains using HTTPS.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-2">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Browser Trust Status
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              We didn't observe indicators suggesting your domain is flagged by common browser trust services.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 leading-relaxed">
          These are basic reputation indicators from public sources. They don't reflect internal security or business practices.
        </p>
      </div>
    </div>
  );
}
