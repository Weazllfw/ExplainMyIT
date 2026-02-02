/**
 * Upgrade Modal Component
 * 
 * Shows when free tier users hit limits with clear upgrade path
 */

'use client';

import Link from 'next/link';
import { Analytics } from '@/lib/analytics';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'domain-limit' | 'snapshot-limit' | 'anonymous-limit';
  currentDomains?: number;
  maxDomains?: number;
  domain?: string;
}

export function UpgradeModal({ isOpen, onClose, reason, currentDomains, maxDomains, domain }: UpgradeModalProps) {
  if (!isOpen) return null;

  // Different messaging based on reason
  const getContent = () => {
    switch (reason) {
      case 'domain-limit':
        return {
          title: '🚀 Unlock Unlimited Domains',
          description: `You've used ${currentDomains} of ${maxDomains} domains on the free tier. Upgrade to Basic for unlimited domains and automatic monthly snapshots.`,
          benefits: [
            'Unlimited domains',
            'Automatic monthly snapshots',
            'Full history and timeline',
            'Run snapshots anytime',
            'Cancel anytime',
          ],
        };
      case 'snapshot-limit':
        return {
          title: '📊 Track Changes Over Time',
          description: `You've already run a snapshot for ${domain}. Upgrade to Basic for automatic monthly snapshots and unlimited re-runs.`,
          benefits: [
            'Automatic monthly snapshots',
            'Unlimited manual re-runs',
            'Full history and timeline',
            'Track changes over time',
            'Cancel anytime',
          ],
        };
      case 'anonymous-limit':
        return {
          title: '💾 Save & Track Your Reports',
          description: `You've already received a free snapshot for ${domain}. Create a free account to run snapshots for up to 3 domains, or upgrade to Basic for unlimited.`,
          benefits: [
            'Save all your reports',
            'Up to 3 domains (free account)',
            'Or unlimited with Basic ($19.99/mo)',
            'Automatic monthly snapshots (Basic)',
            'Full history and timeline (Basic)',
          ],
        };
    }
  };

  const content = getContent();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[16px] shadow-2xl max-w-[500px] w-full overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-navy to-brand-cyan p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-[24px] font-bold mb-2">{content.title}</h2>
            <p className="text-blue-100 text-[15px] leading-relaxed">{content.description}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Pricing */}
            <div className="bg-brand-cyan/5 border-2 border-brand-cyan rounded-[12px] p-5 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[36px] font-bold text-brand-navy">$19.99</span>
                <span className="text-[18px] text-brand-muted">/ month</span>
              </div>
              <p className="text-[14px] text-brand-slate mb-3">
                or <strong className="text-brand-green">$199/year</strong> <span className="text-brand-green">(save 2 months)</span>
              </p>
              <p className="text-[13px] text-brand-muted">
                Cancel anytime. No contracts.
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-[16px] font-semibold text-brand-navy mb-3">What you get:</h3>
              <ul className="space-y-2.5">
                {content.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[15px] text-brand-slate">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              {reason === 'anonymous-limit' ? (
                <>
                  <Link
                    href="/signup"
                    onClick={() => {
                      Analytics.upgradePromptClicked('create-account', reason);
                      onClose();
                    }}
                    className="block w-full text-center bg-brand-navy text-white px-6 py-3 rounded-[12px] text-[16px] font-semibold hover:bg-brand-navy/90 transition-all"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => {
                      Analytics.upgradePromptClicked('view-pricing', reason);
                      onClose();
                    }}
                    className="block w-full text-center bg-brand-cyan text-white px-6 py-3 rounded-[12px] text-[16px] font-semibold hover:bg-brand-cyan/90 transition-all"
                  >
                    Upgrade to Basic
                  </Link>
                </>
              ) : (
                <Link
                  href="/pricing"
                  onClick={() => {
                    Analytics.upgradePromptClicked('upgrade-to-basic', reason);
                    onClose();
                  }}
                  className="block w-full text-center bg-brand-cyan text-white px-6 py-3 rounded-[12px] text-[16px] font-semibold hover:bg-brand-cyan/90 transition-all"
                >
                  Upgrade to Basic
                </Link>
              )}
              <button
                onClick={onClose}
                className="block w-full text-center text-brand-muted px-6 py-2 text-[14px] hover:text-brand-slate transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
