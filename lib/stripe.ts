/**
 * VYVRE × Stripe
 *
 * Server-side Stripe client + constants for our products.
 * LIVE MODE — careful, real money flows through here.
 */

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazy Stripe client — env var checked at first use, not at module load.
 * Routes import this and use it inside handlers.
 */
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY — check .env.local');
    _stripe = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
      appInfo: {
        name: 'VYVRE SaaS',
        version: '0.1.0',
        url: 'https://vyvre.fr',
      },
    });
  }
  return _stripe;
}

/**
 * Stripe client proxy — same usage as `stripe.foo.bar()` but lazy under the hood.
 * Keeps callers simple while avoiding build-time env var crashes.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop);
  },
});

// ─── Price IDs (LIVE) ──────────────────────────────────────────────────
// Source of truth — also mirrored in /docs/pocs/dist/stripe-config.js
export const STRIPE_PRICES = {
  PILOT_MONTHLY:      'price_1Ta0NzGsTEuTtdYpU7q5lmTu',
  STARTER_MONTHLY:    'price_1Ta0O2GsTEuTtdYpGeV06lrO',
  STARTER_ANNUAL:     'price_1Ta0O5GsTEuTtdYpDC6sgdL6',
  GROWTH_MONTHLY:     'price_1Ta0O8GsTEuTtdYpb4Lr5GnJ',
  GROWTH_ANNUAL:      'price_1Ta0OhGsTEuTtdYpmpptvzz9',
  ENTERPRISE_MONTHLY: 'price_1Ta0OkGsTEuTtdYpDmbtd1YW',
  ENTERPRISE_ANNUAL:  'price_1Ta0OnGsTEuTtdYpdQCBRJJW',
} as const;

// ─── Plan resolution: Price ID → plan name ─────────────────────────────
export function planFromPriceId(priceId: string): 'pilot' | 'starter' | 'growth' | 'enterprise' | null {
  switch (priceId) {
    case STRIPE_PRICES.PILOT_MONTHLY:
      return 'pilot';
    case STRIPE_PRICES.STARTER_MONTHLY:
    case STRIPE_PRICES.STARTER_ANNUAL:
      return 'starter';
    case STRIPE_PRICES.GROWTH_MONTHLY:
    case STRIPE_PRICES.GROWTH_ANNUAL:
      return 'growth';
    case STRIPE_PRICES.ENTERPRISE_MONTHLY:
    case STRIPE_PRICES.ENTERPRISE_ANNUAL:
      return 'enterprise';
    default:
      return null;
  }
}

// ─── Plan quotas (scans/month) ─────────────────────────────────────────
export const PLAN_QUOTAS = {
  pilot:      1_000,
  starter:    5_000,
  growth:    15_000,
  enterprise: 25_000,
} as const;

// ─── Auto-upgrade ladder ───────────────────────────────────────────────
export const UPGRADE_LADDER = {
  pilot: {
    nextPlan: 'starter' as const,
    nextPriceId: STRIPE_PRICES.STARTER_MONTHLY,
    nextQuota: PLAN_QUOTAS.starter,
    label: 'Starter — 5 000 scans/mois',
    monthlyEur: 299,
  },
  starter: {
    nextPlan: 'growth' as const,
    nextPriceId: STRIPE_PRICES.GROWTH_MONTHLY,
    nextQuota: PLAN_QUOTAS.growth,
    label: 'Growth — 15 000 scans/mois',
    monthlyEur: 499,
  },
  growth: {
    nextPlan: 'enterprise' as const,
    nextPriceId: STRIPE_PRICES.ENTERPRISE_MONTHLY,
    nextQuota: PLAN_QUOTAS.enterprise,
    label: 'Enterprise — 25 000 scans/mois',
    monthlyEur: 699,
  },
  enterprise: null, // overage metered (Billing Meter à créer)
} as const;
