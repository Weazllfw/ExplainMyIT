/**
 * Temporal Disclaimer Component
 * 
 * Static framing that introduces time as a dimension.
 * Appears immediately after Owner Summary to contextualize the snapshot.
 * 
 * Purpose: Create mild discomfort about temporal incompleteness without fear.
 */

export function TemporalDisclaimer() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-6 text-sm text-brand-slate">
      <h4 className="font-semibold text-brand-navy mb-2">
        About This Snapshot
      </h4>
      <p className="leading-relaxed">
        This snapshot reflects how your IT setup appears today, based on publicly 
        observable signals. Public-facing systems like domains, email, certificates, 
        and hosting often change quietly over time — especially when vendors, staff, 
        or providers change.
      </p>
    </div>
  );
}
