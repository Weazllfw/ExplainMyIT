/**
 * Stripe SDK Client Initialization
 * 
 * Centralizes Stripe instance creation with proper configuration
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

/**
 * Singleton Stripe client instance
 * Uses the latest API version
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
  appInfo: {
    name: 'Explain My IT',
    version: '1.0.0',
  },
});

/**
 * Stripe webhook signing secret
 * Required for webhook signature verification
 */
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!STRIPE_WEBHOOK_SECRET) {
  console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not set - webhook signature verification will fail');
}
