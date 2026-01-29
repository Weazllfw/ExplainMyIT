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
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
          {summary}
        </p>
      </div>
    </section>
  );
}
