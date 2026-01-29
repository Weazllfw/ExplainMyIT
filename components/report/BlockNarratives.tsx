/**
 * Block Narratives Component
 * 
 * Display detailed narratives for each signal block
 */

'use client';

import { useState } from 'react';
import { Analytics } from '@/lib/analytics';
import type { AllBlockNarratives } from '@/lib/llm/types';

interface BlockNarrativesProps {
  narratives: AllBlockNarratives;
}

const BLOCK_TITLES = {
  dns: 'Domain & Infrastructure',
  email: 'Email Authentication',
  tls: 'Website Security',
  techstack: 'Technology Stack',
  exposure: 'Public Exposure',
  hibp: 'Breach History',
};

const BLOCK_ICONS = {
  dns: '🌐',
  email: '📧',
  tls: '🔒',
  techstack: '⚙️',
  exposure: '🔍',
  hibp: '🛡️',
};

export function BlockNarratives({ narratives }: BlockNarrativesProps) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const toggleBlock = (blockKey: string) => {
    const isCurrentlyExpanded = expandedBlock === blockKey;
    
    if (isCurrentlyExpanded) {
      // Collapsing
      Analytics.blockCollapsed(blockKey);
      setExpandedBlock(null);
    } else {
      // Expanding
      Analytics.blockExpanded(blockKey);
      setExpandedBlock(blockKey);
    }
  };

  const blocks = Object.entries(narratives) as [
    keyof AllBlockNarratives,
    AllBlockNarratives[keyof AllBlockNarratives]
  ][];

  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Findings</h2>
      <div className="space-y-3">
        {blocks.map(([blockKey, narrative]) => (
          <BlockCard
            key={blockKey}
            blockKey={blockKey}
            narrative={narrative}
            isExpanded={expandedBlock === blockKey}
            onToggle={() => toggleBlock(blockKey)}
          />
        ))}
      </div>
    </section>
  );
}

interface BlockCardProps {
  blockKey: keyof AllBlockNarratives;
  narrative: AllBlockNarratives[keyof AllBlockNarratives];
  isExpanded: boolean;
  onToggle: () => void;
}

function BlockCard({ blockKey, narrative, isExpanded, onToggle }: BlockCardProps) {
  const title = BLOCK_TITLES[blockKey];
  const icon = BLOCK_ICONS[blockKey];
  const confidenceBadge = getConfidenceBadge(narrative.confidence);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors text-left"
        aria-expanded={isExpanded}
        aria-controls={`block-${blockKey}-content`}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{narrative.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {confidenceBadge}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          id={`block-${blockKey}-content`}
          className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4"
          role="region"
          aria-label={`${title} details`}
        >
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">What We Found</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {narrative.explanation}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Why It Matters</h4>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {narrative.why_it_matters}
            </p>
          </div>

          {narrative.confidence_note && (
            <div className="bg-gray-50 rounded-md p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Confidence Note</h4>
              <p className="text-sm text-gray-600">{narrative.confidence_note}</p>
            </div>
          )}
        </div>
      )}
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
      {confidence}
    </span>
  );
}
