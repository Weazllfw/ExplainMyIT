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
    <section className="bg-amber-50 rounded-lg border border-amber-200 p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">⚠️</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assumptions Being Made</h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on what we can see, here's what your setup is likely assuming
          </p>
        </div>
      </div>
      <ul className="space-y-3">
        {assumptions.map((assumption, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-semibold text-sm flex items-center justify-center mt-0.5">
              {index + 1}
            </span>
            <p className="text-gray-800 leading-relaxed flex-1">{assumption}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
