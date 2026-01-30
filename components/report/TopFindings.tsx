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
    <section className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
      <h2 className="text-[24px] font-bold text-brand-navy mb-6">Key Findings</h2>
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
  const sourceIcon = getSourceIcon(finding.finding_code);

  return (
    <div className="border border-brand-border rounded-[14px] p-5 hover:shadow-brand-hover hover:border-brand-cyan/30 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-cyan/15 text-brand-navy font-bold text-sm flex items-center justify-center">
              {index + 1}
            </span>
            <h3 className="text-[17px] font-bold text-brand-navy">{finding.title}</h3>
            {sourceIcon && (
              <span className="flex-shrink-0 text-xs text-brand-muted" title={`Source: ${getSourceName(finding.finding_code)}`}>
                {sourceIcon}
              </span>
            )}
          </div>
          <p className="text-brand-slate text-[15px] leading-relaxed ml-11">{finding.description}</p>
        </div>
        <div className="flex-shrink-0">{confidenceBadge}</div>
      </div>
    </div>
  );
}

function getConfidenceBadge(confidence: 'high' | 'medium' | 'low') {
  const styles = {
    high: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20',
    medium: 'bg-brand-caution/15 text-brand-caution border-brand-caution/30',
    low: 'bg-brand-info/10 text-brand-info border-brand-info/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[confidence]}`}
    >
      {confidence === 'high' ? 'High' : confidence === 'medium' ? 'Medium' : 'Low'} confidence
    </span>
  );
}

function getSourceIcon(findingCode: string): string {
  if (findingCode.startsWith('DNS')) return '🌐';
  if (findingCode.startsWith('EMAIL')) return '📧';
  if (findingCode.startsWith('TLS')) return '🔒';
  if (findingCode.startsWith('TECH')) return '⚙️';
  if (findingCode.startsWith('EXPOSURE')) return '🔍';
  if (findingCode.startsWith('HIBP')) return '🛡️';
  return '';
}

function getSourceName(findingCode: string): string {
  if (findingCode.startsWith('DNS')) return 'DNS & Infrastructure';
  if (findingCode.startsWith('EMAIL')) return 'Email Security';
  if (findingCode.startsWith('TLS')) return 'SSL/TLS';
  if (findingCode.startsWith('TECH')) return 'Technology Stack';
  if (findingCode.startsWith('EXPOSURE')) return 'Public Exposure';
  if (findingCode.startsWith('HIBP')) return 'Breach Database';
  return 'General';
}
