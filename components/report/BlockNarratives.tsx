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
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const toggleBlock = (blockKey: string) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blockKey)) {
        // Collapsing
        Analytics.blockCollapsed(blockKey);
        newSet.delete(blockKey);
      } else {
        // Expanding
        Analytics.blockExpanded(blockKey);
        newSet.add(blockKey);
      }
      return newSet;
    });
  };

  const blocks = Object.entries(narratives) as [
    keyof AllBlockNarratives,
    AllBlockNarratives[keyof AllBlockNarratives]
  ][];

  const allExpanded = expandedBlocks.size === blocks.length;

  const toggleAll = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedBlocks(new Set());
      Analytics.blockCollapsed('all');
    } else {
      // Expand all
      setExpandedBlocks(new Set(blocks.map(([key]) => key)));
      Analytics.blockExpanded('all');
    }
  };

  return (
    <section className="bg-white rounded-[16px] border border-brand-border shadow-brand p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-bold text-brand-navy">Detailed Findings</h2>
        <button
          onClick={toggleAll}
          className="px-4 py-2 text-sm font-semibold text-brand-cyan hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-brand-bg transition-colors"
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      <div className="space-y-3">
        {blocks.map(([blockKey, narrative]) => (
          <BlockCard
            key={blockKey}
            blockKey={blockKey}
            narrative={narrative}
            isExpanded={expandedBlocks.has(blockKey)}
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
    <div className="border border-brand-border rounded-[14px] overflow-hidden hover:border-brand-cyan/30 transition-colors">
      {/* Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-brand-bg focus:bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-cyan/35 focus:ring-inset transition-colors text-left"
        aria-expanded={isExpanded}
        aria-controls={`block-${blockKey}-content`}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <div>
            <h3 className="text-[17px] font-bold text-brand-navy">{title}</h3>
            <p className="text-sm text-brand-muted">{narrative.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {confidenceBadge}
          <svg
            className={`w-5 h-5 text-brand-muted transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          className="px-5 pb-5 border-t border-brand-border/50 pt-4 space-y-4"
          role="region"
          aria-label={`${title} details`}
        >
          <div>
            <h4 className="text-sm font-semibold text-brand-navy mb-2">What We Found</h4>
            <p className="text-[15px] text-brand-slate leading-relaxed whitespace-pre-wrap">
              {narrative.explanation}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy mb-2">Why It Matters</h4>
            <p className="text-[15px] text-brand-slate leading-relaxed whitespace-pre-wrap">
              {narrative.why_it_matters}
            </p>
          </div>

          {narrative.confidence_note && (
            <div className="bg-brand-bg rounded-[10px] p-4 border border-brand-border/50">
              <h4 className="text-sm font-semibold text-brand-navy mb-1">Confidence Note</h4>
              <p className="text-sm text-brand-muted">{narrative.confidence_note}</p>
            </div>
          )}
        </div>
      )}
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
