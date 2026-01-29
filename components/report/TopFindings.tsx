/**
 * Top Findings Component
 * 
 * Display the top 3 findings (ranked by business relevance)
 */

import type { TopFinding } from '@/lib/llm/types';

interface TopFindingsProps {
  findings: TopFinding[];
}

export function TopFindings({ findings }: TopFindingsProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Findings</h2>
      <div className="space-y-4">
        {findings.map((finding, index) => (
          <FindingCard key={finding.finding_code} finding={finding} index={index} />
        ))}
      </div>
    </section>
  );
}

function FindingCard({ finding, index }: { finding: TopFinding; index: number }) {
  const confidenceBadge = getConfidenceBadge(finding.confidence);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
              {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">{finding.title}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed ml-11">{finding.description}</p>
        </div>
        <div className="flex-shrink-0">{confidenceBadge}</div>
      </div>
    </div>
  );
}

function getConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[confidence]}`}
    >
      {confidence} confidence
    </span>
  );
}
