/**
 * Changeability Tag Component
 * 
 * Subtle indicator that certain blocks are "likely to change".
 * No scoring, just factual observation about change patterns.
 * 
 * Purpose: Mentally primes "this won't stay the same" without urgency.
 */

interface ChangeabilityTagProps {
  blockType: 'dns' | 'email' | 'tls' | 'techstack' | 'exposure' | 'hibp' | 'subdomains';
}

const CHANGEABILITY_MAP: Record<string, { label: string; description: string } | null> = {
  dns: {
    label: 'Configuration changes occasionally',
    description: 'DNS records are updated during provider changes, migrations, or infrastructure adjustments',
  },
  tls: {
    label: 'Expires on a schedule',
    description: 'SSL certificates are renewed periodically, typically every 90 days',
  },
  email: {
    label: 'Often modified during migrations',
    description: 'Email authentication is commonly adjusted when changing providers or adding services',
  },
  techstack: {
    label: 'Updates periodically',
    description: 'Technology stacks evolve as software is updated or replaced',
  },
  subdomains: {
    label: 'Changes with organizational activity',
    description: 'Subdomains are added or removed as projects and services evolve',
  },
  exposure: null, // Less relevant for temporal framing
  hibp: null, // Static historical data
};

export function ChangeabilityTag({ blockType }: ChangeabilityTagProps) {
  const config = CHANGEABILITY_MAP[blockType];

  if (!config) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md" title={config.description}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span>{config.label}</span>
    </div>
  );
}
