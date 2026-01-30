'use client';

import { useState } from 'react';
import type { SnapshotSignals } from '@/types/database';

interface TechnicalDataViewerProps {
  signals: SnapshotSignals;
  domain: string;
}

export function TechnicalDataViewer({ signals, domain }: TechnicalDataViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  if (!isOpen) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-brand-navy mb-1">
              Technical Data
            </h3>
            <p className="text-sm text-brand-slate">
              View the raw signals and data we collected for {domain}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 text-sm font-semibold text-brand-cyan hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-white transition-colors"
          >
            Show Data
          </button>
        </div>
      </div>
    );
  }

  const blocks = [
    { id: 'dns', label: 'DNS & Domain', icon: '🌐', data: signals.dns },
    { id: 'email', label: 'Email Auth', icon: '📧', data: signals.email },
    { id: 'tls', label: 'TLS/SSL', icon: '🔒', data: signals.tls },
    { id: 'techstack', label: 'Tech Stack', icon: '⚙️', data: signals.techstack },
    { id: 'exposure', label: 'Exposure', icon: '🔍', data: signals.exposure },
    { id: 'hibp', label: 'Breaches', icon: '🛡️', data: signals.hibp },
    ...(signals.subdomains ? [{ id: 'subdomains', label: 'Subdomains', icon: '🔗', data: signals.subdomains }] : []),
  ].filter(block => block.data !== undefined);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[18px] font-bold text-brand-navy mb-1">
            Technical Data
          </h3>
          <p className="text-sm text-brand-slate">
            Raw signals collected from {domain}{signals.collected_at ? ` on ${new Date(signals.collected_at).toLocaleDateString()}` : ''}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-brand-navy border border-brand-border rounded-[10px] hover:bg-white transition-colors"
        >
          Hide Data
        </button>
      </div>

      {/* Block Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
            className={`p-4 rounded-[10px] border-2 text-left transition-all ${
              activeBlock === block.id
                ? 'border-brand-cyan bg-brand-cyan/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{block.icon}</span>
              <span className="text-sm font-semibold text-brand-navy">
                {block.label}
              </span>
            </div>
            <div className="text-xs text-brand-slate">
              {block.data?.confidence || 'unknown'} confidence
            </div>
          </button>
        ))}
      </div>

      {/* Active Block Data */}
      {activeBlock && (
        <div className="bg-white border border-gray-200 rounded-[10px] p-6">
          <h4 className="text-[16px] font-bold text-brand-navy mb-4">
            {blocks.find(b => b.id === activeBlock)?.label} Data
          </h4>
          
          <div className="space-y-4">
            {/* Confidence Badge */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-slate">
                Confidence:
              </span>
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                blocks.find(b => b.id === activeBlock)?.data?.confidence === 'high'
                  ? 'bg-brand-positive/20 text-brand-positive'
                  : blocks.find(b => b.id === activeBlock)?.data?.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {blocks.find(b => b.id === activeBlock)?.data?.confidence}
              </span>
            </div>

            {/* Raw Data JSON */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-2">
                Raw Signals
              </h5>
              <pre className="bg-gray-50 rounded-[8px] p-4 text-xs text-brand-navy overflow-x-auto border border-gray-200">
                {JSON.stringify(blocks.find(b => b.id === activeBlock)?.data, null, 2)}
              </pre>
            </div>

            {/* Collection Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-brand-slate mb-2">
                Collection Info
              </h5>
              <div className="text-xs text-brand-slate space-y-1">
                <div>
                  <span className="font-semibold">Collected:</span>{' '}
                  {signals.collected_at ? new Date(signals.collected_at).toLocaleString() : 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span>{' '}
                  {signals.collection_duration_ms ? `${signals.collection_duration_ms}ms` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeBlock && (
        <div className="text-center py-8 text-brand-slate text-sm">
          Select a block above to view its technical data
        </div>
      )}
    </div>
  );
}
