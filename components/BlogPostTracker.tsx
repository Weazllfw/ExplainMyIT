'use client';

import { useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

interface BlogPostTrackerProps {
  slug: string;
  readingTime?: number;
}

/**
 * Client component to track blog post engagement
 * Tracks: post views, reading completion, time spent
 */
export default function BlogPostTracker({ slug, readingTime }: BlogPostTrackerProps) {
  const startTime = useRef<number>(Date.now());
  const hasTrackedView = useRef<boolean>(false);
  const hasTrackedCompletion = useRef<boolean>(false);

  useEffect(() => {
    // Track post view (once per session)
    if (!hasTrackedView.current) {
      Analytics.blogPostRead(slug, readingTime);
      hasTrackedView.current = true;
    }

    // Track scroll-based completion
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;

      // If user scrolled 90% down, consider post "completed"
      if (scrollPercentage > 0.9 && !hasTrackedCompletion.current) {
        const timeSpent = Date.now() - startTime.current;
        Analytics.blogPostCompleted(slug, timeSpent);
        hasTrackedCompletion.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug, readingTime]);

  // Track time spent on page when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!hasTrackedCompletion.current) {
        // User left before completing, still track time spent
        const timeSpent = Date.now() - startTime.current;
        if (timeSpent > 10000) {
          // Only track if spent more than 10 seconds
          Analytics.blogPostCompleted(slug, timeSpent);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [slug]);

  return null; // This component renders nothing
}
