/**
 * Enhanced Umami Event Tracking
 * 
 * Centralized event tracking for all user interactions.
 * Provides type-safe event names and properties.
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export class UmamiEvents {
  /**
   * Track generic event
   */
  private static track(eventName: string, eventData?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(eventName, eventData);
    }
  }

  // ===== Report Events =====
  
  static reportViewed(domain: string, snapshotId: string) {
    this.track('report_viewed', { domain, snapshotId });
  }

  static visualGridViewed(domain: string) {
    this.track('visual_grid_viewed', { domain });
  }

  static blindSpotsReached(domain: string) {
    this.track('blind_spots_reached', { domain });
  }

  static technicalDataOpened(domain: string) {
    this.track('technical_data_opened', { domain });
  }

  static reportPrinted(domain: string) {
    this.track('report_printed', { domain });
  }

  static shareClicked(domain: string, method: 'copy' | 'linkedin') {
    this.track('share_clicked', { domain, method });
  }

  static runAnotherDomainClicked() {
    this.track('run_another_domain_clicked');
  }

  // ===== Dashboard Events =====

  static dashboardViewed(snapshotCount: number) {
    this.track('dashboard_viewed', { snapshotCount });
  }

  static dashboardCopyLink(domain: string) {
    this.track('dashboard_copy_link', { domain });
  }

  static dashboardRerunClicked(domain: string) {
    this.track('dashboard_rerun_clicked', { domain });
  }

  // ===== Snapshot Request Events =====

  static snapshotFormStarted() {
    this.track('snapshot_form_started');
  }

  static snapshotRequested(domain: string) {
    this.track('snapshot_requested', { domain });
  }

  static snapshotCompleted(domain: string, durationSeconds: number) {
    this.track('snapshot_completed', { domain, durationSeconds });
  }

  static snapshotFailed(domain: string, error: string) {
    this.track('snapshot_failed', { domain, error });
  }

  // ===== Auth Events =====

  static signupStarted() {
    this.track('signup_started');
  }

  static signupCompleted() {
    this.track('signup_completed');
  }

  static loginStarted() {
    this.track('login_started');
  }

  static loginCompleted() {
    this.track('login_completed');
  }

  // ===== Conversion Events =====

  static conversionCtaClicked(location: string) {
    this.track('conversion_cta_clicked', { location });
  }

  static emailSubscribed(source: string) {
    this.track('email_subscribed', { source });
  }

  // ===== Engagement Events =====

  static timeOnReport(domain: string, seconds: number) {
    this.track('time_on_report', { domain, seconds });
  }

  static scrollDepth(page: string, depth: number) {
    this.track('scroll_depth', { page, depth });
  }

  // ===== Pricing Page Events =====

  static pricingPageViewed() {
    this.track('pricing_page_viewed');
  }

  static comparisonTableViewed() {
    this.track('comparison_table_viewed');
  }

  // ===== Checkout Events =====

  static checkoutInitiated(plan: string, interval: string) {
    this.track('checkout_initiated', { plan, interval });
  }

  static checkoutRedirecting(plan: string, interval: string) {
    this.track('checkout_redirecting', { plan, interval });
  }

  static checkoutFailed(plan: string, reason: string) {
    this.track('checkout_failed', { plan, reason });
  }

  // ===== Dashboard Events (Enhanced) =====

  static manageSubscriptionClicked() {
    this.track('manage_subscription_clicked');
  }

  static upgradeToBasicClicked(source: string) {
    this.track('upgrade_to_basic_clicked', { source });
  }

  static sortPreferenceChanged(sortBy: string) {
    this.track('sort_preference_changed', { sortBy });
  }

  static snapshotDetailOpened(snapshotId: string, domain: string) {
    this.track('snapshot_detail_opened', { snapshotId, domain });
  }

  // ===== Report Events (Enhanced) =====

  static reportViewedDetail(snapshotId: string, domain: string, isAuthenticated: boolean) {
    this.track('report_viewed_detail', { snapshotId, domain, isAuthenticated });
  }

  static sectionViewed(section: string, snapshotId: string) {
    this.track('section_viewed', { section, snapshotId });
  }
}
