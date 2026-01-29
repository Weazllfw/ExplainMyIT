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
    <section className="bg-blue-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">💡</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questions to Ask</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use these questions to clarify your IT setup with your team or MSP
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {questions.map((question, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-900 font-semibold text-sm flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-gray-800 leading-relaxed flex-1">{question}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
