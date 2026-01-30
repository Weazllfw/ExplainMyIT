/**
 * Questions Component
 * 
 * Display questions to ask IT team/MSP
 */

interface QuestionsProps {
  questions: string[];
}

export function Questions({ questions }: QuestionsProps) {
  return (
    <section className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
      <div className="flex items-start gap-3 mb-6">
        <span className="text-2xl" aria-hidden="true">💡</span>
        <div>
          <h2 className="text-[24px] font-bold text-brand-navy">Questions to Ask</h2>
          <p className="text-sm text-brand-muted mt-1">
            Use these questions to clarify your IT setup with your team or MSP
          </p>
        </div>
      </div>
      <ul className="space-y-4 border-t border-brand-border/50 pt-6">
        {questions.map((question, index) => (
          <li key={index} className="flex items-start gap-3 pb-4 border-b border-brand-border/30 last:border-0 last:pb-0">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-cyan/15 text-brand-navy font-semibold text-xs flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-brand-slate text-[15px] leading-relaxed flex-1">{question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
