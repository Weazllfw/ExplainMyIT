# Critical Analytics Implementation - Quick Guide

**Time Required:** 2 hours  
**Impact:** HIGH (enable full funnel tracking)  
**Priority:** Post-Launch Week 1

---

## Quick Wins (30 minutes each)

### **1. Report Tracking** (30 min)

**File:** `app/report/[id]/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { UmamiEvents } from '@/lib/analytics/umami-events';

// Add to component
useEffect(() => {
  // Track report opened
  UmamiEvents.reportViewed(domain, snapshotId);
  
  // Track time spent
  const startTime = Date.now();
  
  return () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    if (timeSpent > 5) { // Only track if spent > 5 seconds
      UmamiEvents.timeOnReport(domain, timeSpent);
    }
  };
}, [domain, snapshotId]);
```

**Add to `lib/analytics/umami-events.ts`:**

```typescript
static reportViewedDetailed(snapshotId: string, domain: string, userType: 'anonymous' | 'authenticated') {
  this.track('report_viewed_detailed', { snapshotId, domain, userType });
}

static sectionViewed(section: string, snapshotId: string) {
  this.track('section_viewed', { section, snapshotId });
}

static technicalDetailsExpanded(snapshotId: string) {
  this.track('technical_details_expanded', { snapshotId });
}
```

---

### **2. Pricing Page Tracking** (30 min)

**File:** `app/pricing/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { UmamiEvents } from '@/lib/analytics/umami-events';

export default function PricingPage() {
  // Track page view
  useEffect(() => {
    UmamiEvents.pricingPageViewed();
  }, []);

  // ... rest of component
}
```

**Add to `lib/analytics/umami-events.ts`:**

```typescript
static pricingPageViewed() {
  this.track('pricing_page_viewed');
}

static annualToggleClicked(plan: string) {
  this.track('annual_toggle_clicked', { plan });
}

static comparisonTableViewed() {
  this.track('comparison_table_viewed');
}
```

**Update:** `components/pricing/SubscribeButton.tsx`

```typescript
// Already has data-umami-event, add interval tracking
data-umami-event-plan={plan}
data-umami-event-interval={interval}
```

---

### **3. Dashboard Action Tracking** (30 min)

**File:** `components/dashboard/DashboardContent.tsx`

Already has some tracking, add:

```typescript
const handleManageSubscription = async () => {
  // Track event BEFORE action
  UmamiEvents.manageSubscriptionClicked();
  
  setIsLoadingPortal(true);
  // ... existing code
};

const handleSort = (newSort: 'date' | 'domain') => {
  setSortBy(newSort);
  UmamiEvents.sortPreferenceChanged(newSort);
};
```

**Add to `lib/analytics/umami-events.ts`:**

```typescript
static manageSubscriptionClicked() {
  this.track('manage_subscription_clicked');
}

static upgradeToBasicClicked(source: string) {
  this.track('upgrade_to_basic_clicked', { source });
}

static sortPreferenceChanged(sortBy: 'date' | 'domain') {
  this.track('sort_preference_changed', { sortBy });
}

static snapshotDetailOpened(snapshotId: string, domain: string) {
  this.track('snapshot_detail_opened', { snapshotId, domain });
}
```

---

### **4. Checkout Funnel Tracking** (30 min)

**File:** `components/pricing/SubscribeButton.tsx`

```typescript
const handleClick = async () => {
  setIsLoading(true);
  
  // Track checkout initiated
  UmamiEvents.checkoutInitiated(plan, interval);
  
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      // ... existing code
    });
    
    const { url } = await response.json();
    
    // Track redirect
    UmamiEvents.checkoutRedirecting(plan, interval);
    
    window.location.href = url;
  } catch (error) {
    // Track failure
    UmamiEvents.checkoutFailed(plan, error.message);
    // ... existing error handling
  }
};
```

**Add to `lib/analytics/umami-events.ts`:**

```typescript
static checkoutInitiated(plan: string, interval: 'month' | 'year') {
  this.track('checkout_initiated', { plan, interval });
}

static checkoutRedirecting(plan: string, interval: 'month' | 'year') {
  this.track('checkout_redirecting', { plan, interval });
}

static checkoutFailed(plan: string, reason: string) {
  this.track('checkout_failed', { plan, reason });
}

static checkoutCompleted(plan: string, interval: 'month' | 'year', amount: number) {
  this.track('checkout_completed', { plan, interval, amount });
}

static stripePortalOpened() {
  this.track('stripe_portal_opened');
}
```

**File:** `app/api/stripe/webhook/route.ts`

```typescript
// In handleSubscriptionChange function
if (event.type === 'customer.subscription.created' && details.status === 'active') {
  // Server-side logging (Umami doesn't work server-side)
  console.log('[Analytics] Checkout completed:', {
    customerId: details.customerId,
    subscriptionId: details.subscriptionId,
    status: details.status,
  });
  
  // Send email with tracking link that triggers client-side event
  await sendSubscriptionWelcomeEmail({
    email: user.email,
    name: user.full_name || undefined,
  });
}
```

---

## Loading States Implementation

### **1. Manage Subscription Button** (15 min)

**File:** `components/dashboard/DashboardContent.tsx`

```typescript
<button
  onClick={handleManageSubscription}
  disabled={isLoadingPortal}
  className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
>
  {isLoadingPortal ? (
    <>
      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Opening...</span>
    </>
  ) : (
    'Manage Subscription'
  )}
</button>
```

---

### **2. Success Toast Notification** (15 min)

**File:** `components/ui/Toast.tsx` (create new)

```typescript
'use client';

import { useEffect, useState } from 'react';

export function Toast({ message, type = 'success', onClose }: { 
  message: string; 
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
```

**Usage in Dashboard:**

```typescript
const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

// Check for success/error params
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  
  if (params.get('success') === 'true') {
    setToast({ message: 'Subscription updated successfully!', type: 'success' });
  }
  
  if (params.get('canceled') === 'true') {
    setToast({ message: 'Subscription canceled. Access continues until subscription end date.', type: 'info' });
  }
}, []);

// Render toast
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

---

## Success Pages

### **1. Subscription Success Page** (30 min)

**File:** `app/subscription/success/page.tsx` (create new)

```typescript
import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubscriptionSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-brand-bg py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>

          {/* Hero */}
          <h1 className="text-4xl font-bold text-brand-navy mb-4">
            Welcome to Explain My IT Basic!
          </h1>
          <p className="text-xl text-brand-slate mb-8">
            Your subscription is now active.
          </p>

          {/* What's Next */}
          <div className="bg-white rounded-xl border-2 border-brand-border p-8 mb-8 text-left">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              What Happens Next
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📅</span>
                <div>
                  <p className="font-semibold text-brand-navy">Your first automatic snapshot runs in 30 days</p>
                  <p className="text-sm text-brand-muted">We'll email you when it's ready</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <p className="font-semibold text-brand-navy">View all your snapshots in the dashboard</p>
                  <p className="text-sm text-brand-muted">Track changes over time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">⚙️</span>
                <div>
                  <p className="font-semibold text-brand-navy">Manage your subscription anytime</p>
                  <p className="text-sm text-brand-muted">Cancel, update payment method, or change plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-navy/90 transition-all shadow-lg"
          >
            Go to Dashboard
          </Link>

          <p className="text-sm text-brand-muted mt-6">
            Questions? Email us at <a href="mailto:hello@explainmyit.com" className="text-brand-cyan hover:underline">hello@explainmyit.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Update Stripe checkout success_url:**

```typescript
// In app/api/stripe/create-checkout/route.ts
success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/success`,
cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
```

---

## Testing Checklist

### **Analytics Events:**
- [ ] Report opened event fires
- [ ] Time on report tracked correctly
- [ ] Pricing page view tracked
- [ ] Subscribe button click tracked with plan/interval
- [ ] Dashboard actions tracked
- [ ] Checkout initiation tracked
- [ ] Events visible in Umami dashboard

### **Loading States:**
- [ ] "Manage Subscription" button shows spinner
- [ ] Spinner disappears when portal opens
- [ ] Button disabled during loading
- [ ] No double-clicks possible

### **Success Page:**
- [ ] Success page renders after checkout
- [ ] Copy matches subscription type
- [ ] "Go to Dashboard" link works
- [ ] Page is mobile-responsive

### **Toasts:**
- [ ] Toast appears on dashboard return with ?success=true
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Toast can be manually closed
- [ ] Multiple toasts don't stack badly

---

## Deploy Steps

1. **Add analytics events** (2 hours)
2. **Test events in Umami dashboard** (30 min)
3. **Add loading states** (1 hour)
4. **Create success page** (30 min)
5. **Update Stripe URLs** (15 min)
6. **Test complete flow** (1 hour)
7. **Deploy to production** (15 min)

**Total Time:** ~5 hours

---

## Success Metrics (Week 1)

**Track these in Umami:**
- Report views (target: >80% of email sends)
- Average time on report (target: >2 minutes)
- Pricing page → Subscribe rate (target: >5%)
- Subscribe → Checkout complete (target: >70%)
- Dashboard return visits (target: >50% within 7 days)

---

**Status:** READY TO IMPLEMENT  
**Priority:** Post-Launch Week 1  
**Blocking:** None (can launch without these)
