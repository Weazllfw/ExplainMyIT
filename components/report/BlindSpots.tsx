/**
 * Blind Spots Section Component
 * 
 * Static section that explicitly names what the snapshot cannot see.
 * Appears at the end of the report, before footer actions.
 * 
 * Purpose: Honest limitation disclosure + soft conversion framing.
 * Non-negotiable: Must be static (not LLM-generated) for consistency.
 */

export function BlindSpots() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-[16px] p-8">
      <h3 className="text-[20px] font-bold text-brand-navy mb-4">
        What This Snapshot Cannot See
      </h3>
      
      <div className="space-y-4 text-brand-slate">
        <p className="leading-relaxed">
          This snapshot reflects only what is publicly observable from outside your 
          network. It cannot see internal systems, access controls, backups, 
          documentation, or who is responsible for day-to-day IT operations.
        </p>
        
        <p className="leading-relaxed text-sm">
          Many businesses use recurring snapshots or internal visibility tools to 
          reduce this uncertainty over time.
        </p>
      </div>
    </div>
  );
}
