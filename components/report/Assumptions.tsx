/**
 * Assumptions Component
 * 
 * Display assumptions being made about the IT setup
 */

interface AssumptionsProps {
  assumptions: string[];
}

export function Assumptions({ assumptions }: AssumptionsProps) {
  return (
    <section className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
      <div className="flex items-start gap-3 mb-6">
        <span className="text-2xl" aria-hidden="true">💭</span>
        <div>
          <h2 className="text-[24px] font-bold text-brand-navy">Assumptions Being Made</h2>
          <p className="text-sm text-brand-muted mt-1">
            Based on what we can see, here's what your setup is likely assuming
          </p>
        </div>
      </div>
      <ul className="space-y-4 border-t border-brand-border/50 pt-6">
        {assumptions.map((assumption, index) => (
          <li key={index} className="flex items-start gap-3 pb-4 border-b border-brand-border/30 last:border-0 last:pb-0">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-info/10 text-brand-info font-semibold text-xs flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-brand-slate text-[15px] leading-relaxed flex-1">{assumption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
