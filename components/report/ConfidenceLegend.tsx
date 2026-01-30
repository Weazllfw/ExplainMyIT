/**
 * Confidence Legend Component
 * 
 * Global legend explaining confidence levels used throughout the report.
 * Prevents misinterpretation and strengthens credibility.
 * 
 * Purpose: Transparency + liability reduction.
 */

export function ConfidenceLegend() {
  return (
    <div className="bg-gray-50 rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-sm font-semibold text-brand-navy mb-4">
        Confidence Levels
      </h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-16 h-6 bg-green-100 border border-green-300 rounded flex items-center justify-center">
            <span className="text-[10px] font-semibold text-green-800">HIGH</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Directly observed</strong> from public DNS records, HTTPS headers, or authoritative sources
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-16 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
            <span className="text-[10px] font-semibold text-yellow-800">MEDIUM</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Inferred</strong> from multiple signals or common patterns
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-16 h-6 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-[10px] font-semibold text-gray-700">LOW</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>Educated guess</strong> based on limited public data
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>How this was observed:</strong> All data in this snapshot comes from publicly accessible sources including DNS records, HTTPS certificates, HTTP headers, and breach databases. No internal systems were accessed.
        </p>
      </div>
    </div>
  );
}
