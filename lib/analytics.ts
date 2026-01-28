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
}

/**
 * Track a custom event in Umami
 * @param eventName - Name of the event (kebab-case recommended)
 * @param eventData - Optional event properties
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  if (window.umami) {
    window.umami.track(eventName, eventData);
  } else {
    // Log for debugging if Umami isn't loaded
    if (process.env.NODE_ENV === 'development') {
      console.log('[Umami Event]', eventName, eventData);
    }
  }
}

/**
 * Pre-defined event trackers for common actions
 */
export const Analytics = {
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

  // Error tracking (non-PII)
  formError: (formName: string, errorType: string) => {
    trackEvent('form-error', {
      formName,
      errorType,
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
