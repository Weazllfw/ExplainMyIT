/**
 * Umami Analytics Utilities
 * Privacy-friendly analytics tracking for Explain My IT
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
  // Also support global umami object (Umami v2 style)
  const umami: {
    track: (eventName: string, eventData?: Record<string, any>) => void;
  };
}

/**
 * Track a custom event in Umami
 * @param eventName - Name of the event (kebab-case recommended)
 * @param eventData - Optional event properties
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  // Try global umami first (Umami v2)
  if (typeof window !== 'undefined' && (window as any).umami?.track) {
    try {
      (window as any).umami.track(eventName, eventData);
      console.log('📊 [Umami Event]', eventName, eventData);
    } catch (error) {
      console.error('[Umami Error]', error, { eventName, eventData });
    }
  } 
  // Fallback to window.umami
  else if (window.umami?.track) {
    try {
      window.umami.track(eventName, eventData);
      console.log('📊 [Umami Event]', eventName, eventData);
    } catch (error) {
      console.error('[Umami Error]', error, { eventName, eventData });
    }
  } 
  // Log warning if Umami isn't loaded
  else {
    console.warn('⚠️ [Umami Not Loaded] Event not sent:', eventName, eventData);
    console.log('Debug: window.umami =', window.umami);
    console.log('Debug: typeof umami =', typeof (window as any).umami);
  }
}

/**
 * Pre-defined event trackers for common actions
 */
export const Analytics = {
  // Generic track method (exposes trackEvent for custom events)
  track: trackEvent,

  // Waitlist events
  waitlistSignup: (data: { companySize?: string; hasIT?: string; source?: string }) => {
    trackEvent('waitlist-signup', {
      companySize: data.companySize || 'not-provided',
      hasIT: data.hasIT || 'not-provided',
      source: data.source || 'direct',
    });
  },

  waitlistFormStarted: () => {
    trackEvent('waitlist-form-started');
  },

  // Blog events
  blogPostRead: (slug: string, readingTime?: number) => {
    trackEvent('blog-post-read', {
      slug,
      readingTime: readingTime || 0,
    });
  },

  blogPostCompleted: (slug: string, timeSpent: number) => {
    trackEvent('blog-post-completed', {
      slug,
      timeSpent: Math.round(timeSpent / 1000), // Convert to seconds
    });
  },

  // Navigation events
  ctaClicked: (location: string, ctaText: string) => {
    trackEvent('cta-clicked', {
      location, // e.g., 'hero', 'footer', 'blog-post'
      ctaText, // e.g., 'Get Early Access'
    });
  },

  blogLinkClicked: (from: string) => {
    trackEvent('blog-link-clicked', {
      from, // e.g., 'header', 'footer', 'homepage'
    });
  },

  // External link tracking
  externalLinkClicked: (url: string, from: string) => {
    trackEvent('external-link-clicked', {
      url,
      from,
    });
  },

  // Engagement events
  scrolledToBottom: (page: string) => {
    trackEvent('scrolled-to-bottom', {
      page,
    });
  },

  // Form tracking
  formStarted: (formName: string) => {
    trackEvent('form-started', {
      formName,
    });
  },

  formSubmitted: (formName: string) => {
    trackEvent('form-submitted', {
      formName,
    });
  },

  // Error tracking (non-PII)
  formError: (formName: string, errorType: string) => {
    trackEvent('form-error', {
      formName,
      errorType,
    });
  },

  // Tier 1: Snapshot events
  snapshotFormStarted: () => {
    trackEvent('snapshot-form-started');
  },

  snapshotRequested: (domain: string) => {
    trackEvent('snapshot-requested', {
      domain,
    });
  },

  snapshotRequestFailed: (errorType: string) => {
    trackEvent('snapshot-request-failed', {
      errorType,
    });
  },

  // Tier 1: Report view events
  reportViewed: (snapshotId: string, domain: string) => {
    trackEvent('report-viewed', {
      snapshotId,
      domain,
    });
  },

  blockExpanded: (blockName: string) => {
    trackEvent('block-expanded', {
      blockName,
    });
  },

  blockCollapsed: (blockName: string) => {
    trackEvent('block-collapsed', {
      blockName,
    });
  },

  reportCtaClicked: (ctaType: 'create-account' | 'run-another') => {
    trackEvent('report-cta-clicked', {
      ctaType,
    });
  },

  // Tier 1: Email events (server-side, via webhook)
  emailDelivered: (snapshotId: string) => {
    trackEvent('email-delivered', {
      snapshotId,
    });
  },

  emailOpened: (snapshotId: string) => {
    trackEvent('email-opened', {
      snapshotId,
    });
  },

  emailClicked: (snapshotId: string, link: string) => {
    trackEvent('email-clicked', {
      snapshotId,
      link,
    });
  },

  // Auth events
  userSignedUp: () => {
    trackEvent('user-signed-up');
  },

  userLoggedIn: () => {
    trackEvent('user-logged-in');
  },

  userLoggedOut: () => {
    trackEvent('user-logged-out');
  },

  // Dashboard events
  dashboardViewed: () => {
    trackEvent('dashboard-viewed');
  },

  dashboardCtaClicked: (ctaType: 'new-snapshot' | 'view-report' | 'copy-link' | 'rerun-domain') => {
    trackEvent('dashboard-cta-clicked', {
      ctaType,
    });
  },

  // Report claiming
  reportClaimStarted: (snapshotId: string, domain: string) => {
    trackEvent('report-claim-started', {
      snapshotId,
      domain,
    });
  },

  reportClaimCompleted: (snapshotId: string, domain: string) => {
    trackEvent('report-claim-completed', {
      snapshotId,
      domain,
    });
  },

  // Email opt-in events
  emailOptInChecked: (source: 'snapshot-form' | 'success-state' | 'report-footer' | 'signup-form') => {
    trackEvent('email-opt-in-checked', {
      source,
    });
  },

  emailOptInSubmitted: (source: 'snapshot-form' | 'success-state' | 'report-footer' | 'signup-form', domain?: string) => {
    trackEvent('email-opt-in-submitted', {
      source,
      domain: domain || 'unknown',
    });
  },

  // Snapshot success state CTAs
  snapshotSuccessCtaClicked: (ctaType: 'create-account' | 'go-to-dashboard' | 'request-another' | 'request-another-auth') => {
    trackEvent('snapshot-success-cta-clicked', {
      ctaType,
    });
  },

  // Upgrade prompt events
  upgradePromptClicked: (action: 'upgrade-to-basic' | 'view-pricing' | 'create-account', reason: string) => {
    trackEvent('upgrade-prompt-clicked', {
      action,
      reason,
    });
  },

  // Header navigation CTAs
  headerCtaClicked: (ctaType: 'signup' | 'login' | 'dashboard' | 'logout') => {
    trackEvent('header-cta-clicked', {
      ctaType,
    });
  },

  // Pricing page CTAs
  pricingCtaClicked: (ctaType: 'free-snapshot' | 'tier1-coming-soon' | 'free-snapshot-cta-bottom' | 'how-it-works') => {
    trackEvent('pricing-cta-clicked', {
      ctaType,
    });
  },
};

/**
 * Track page view (automatic via Umami, but can be called manually for SPAs)
 */
export function trackPageView(url?: string): void {
  if (typeof window === 'undefined') return;
  
  // Umami automatically tracks page views, but we can manually trigger if needed
  if (window.umami && url) {
    // Note: Umami auto-tracks, this is for manual override scenarios
    console.log('[Umami] Page view:', url);
  }
}

/**
 * Check if analytics is enabled/loaded
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.umami;
}
