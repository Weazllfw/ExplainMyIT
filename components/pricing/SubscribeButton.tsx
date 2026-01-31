'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/db/supabase-browser';
import { UmamiEvents } from '@/lib/analytics/umami-events';

interface SubscribeButtonProps {
  priceId: string;
  interval: 'monthly' | 'annual';
  className?: string;
  children: React.ReactNode;
}

export default function SubscribeButton({
  priceId,
  interval,
  className,
  children,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      // Track checkout initiated
      UmamiEvents.checkoutInitiated('basic', interval);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to signup with return URL
        router.push(`/signup?returnTo=/pricing&action=subscribe&priceId=${priceId}`);
        return;
      }

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Track redirect
        UmamiEvents.checkoutRedirecting('basic', interval);
        
        // Redirect to Stripe Checkout
        window.location.href = url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      
      // Track failure
      UmamiEvents.checkoutFailed('basic', error.message);
      
      alert(error.message || 'Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={className}
      data-umami-event="pricing-cta-clicked"
      data-umami-event-cta-type={`tier1-${interval}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
