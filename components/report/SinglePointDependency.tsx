/**
 * Single-Point Dependency Callout Component
 * 
 * Detects when multiple systems rely on the same provider.
 * Creates continuity awareness without fear.
 * 
 * Purpose: Owners feel this risk immediately - calm, factual, non-technical.
 */

import type { SnapshotSignals } from '@/types/database';

interface SinglePointDependencyProps {
  signals: SnapshotSignals;
}

export function SinglePointDependency({ signals }: SinglePointDependencyProps) {
  // Detect common provider patterns
  const providers = new Set<string>();
  let systemCount = 0;

  // Check DNS
  if (signals.dns?.nameservers && signals.dns.nameservers.length > 0) {
    const dnsProvider = signals.dns.nameservers[0].split('.').slice(-2, -1)[0]?.toLowerCase();
    if (dnsProvider) {
      providers.add(dnsProvider);
      systemCount++;
    }
  }

  // Check hosting
  if (signals.techstack?.hosting_provider) {
    const hostProvider = signals.techstack.hosting_provider.toLowerCase();
    providers.add(hostProvider);
    systemCount++;
  } else if (signals.exposure?.infrastructure_type === 'cloud') {
    systemCount++;
  }

  // Check email (simplified - just count if present)
  if (signals.email?.has_spf || signals.email?.has_dkim) {
    systemCount++;
  }

  // Only show if we have 3+ systems and evidence of consolidation
  // (This is a heuristic - real detection would be more sophisticated)
  const showCallout = systemCount >= 3 && providers.size <= 2;

  if (!showCallout) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <div>
          <h4 className="text-sm font-semibold text-amber-900 mb-2">
            Provider Consolidation Observed
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed mb-3">
            Several public-facing systems appear to rely on the same provider or infrastructure.
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            This is common and often cost-effective, but it means continuity depends on access to that relationship. 
            Organizations typically address this through documented access procedures and backup authentication methods.
          </p>
        </div>
      </div>
    </div>
  );
}
