/**
 * Ownership Signals Component
 * 
 * Aggregates provider/service signals to surface governance questions.
 * Creates productive discomfort about access and responsibility documentation.
 * 
 * Purpose: Aligns with advisory/internal tooling upsell without selling.
 */

import type { SnapshotSignals } from '@/types/database';

interface OwnershipSignalsProps {
  signals: SnapshotSignals;
  domain: string;
}

export function OwnershipSignals({ signals, domain }: OwnershipSignalsProps) {
  const observations: Array<{ label: string; value: string }> = [];

  // Domain registrar
  if (signals.dns?.registrar) {
    const isThirdParty = !signals.dns.registrar.toLowerCase().includes(domain.split('.')[0]);
    observations.push({
      label: 'Domain registrar',
      value: isThirdParty ? 'Third-party provider' : signals.dns.registrar,
    });
  }

  // DNS hosting (if different from registrar)
  if (signals.dns?.nameservers && signals.dns.nameservers.length > 0) {
    const dnsProvider = signals.dns.nameservers[0].split('.').slice(-2, -1)[0];
    observations.push({
      label: 'DNS hosting',
      value: 'External service',
    });
  }

  // Email provider
  if (signals.email) {
    const hasMx = signals.email.has_spf || signals.email.has_dkim;
    if (hasMx) {
      observations.push({
        label: 'Email provider',
        value: 'Cloud-hosted',
      });
    }
  }

  // Website hosting
  if (signals.techstack?.hosting_provider) {
    observations.push({
      label: 'Website hosting',
      value: 'Managed infrastructure',
    });
  } else if (signals.exposure?.infrastructure_type) {
    const type = signals.exposure.infrastructure_type;
    observations.push({
      label: 'Website hosting',
      value: type === 'cloud' ? 'Cloud infrastructure' : 'Infrastructure detected',
    });
  }

  // Don't show if we have very few observations
  if (observations.length < 2) return null;

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-200">
      <h3 className="text-[18px] font-bold text-brand-navy mb-4">
        Ownership Signals Observed
      </h3>

      <div className="space-y-3 mb-4">
        {observations.map((obs, index) => (
          <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">{obs.label}</span>
            <span className="text-sm font-medium text-brand-slate">{obs.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs text-gray-700 leading-relaxed">
          This snapshot can't determine whether access and responsibility for these systems is documented or whether continuity plans exist for key vendor relationships.
        </p>
      </div>
    </div>
  );
}
