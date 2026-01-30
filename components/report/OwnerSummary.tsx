/**
 * Owner Summary Component
 * 
 * Display the high-level owner summary (4-6 sentences)
 */

interface OwnerSummaryProps {
  summary: string;
}

export function OwnerSummary({ summary }: OwnerSummaryProps) {
  return (
    <section className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
      <div className="bg-brand-navy/5 rounded-[12px] p-6 mb-4">
        <h2 className="text-[24px] font-bold text-brand-navy mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-[16px] leading-relaxed text-brand-slate whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      </div>
      <p className="text-xs text-brand-muted italic">
        Public signals only
      </p>
    </section>
  );
}
