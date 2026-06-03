/**
 * VYVRE × Supabase
 *
 * Two clients:
 * - `supabase` (anon) for client-side, respects RLS
 * - `supabaseAdmin` (service_role) for server-side webhook handlers, bypasses RLS
 *
 * Always use `supabaseAdmin` in /api routes that handle Stripe webhooks.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Anon client (respects RLS). Lazy so the build doesn't crash if env vars
 * aren't set during static analysis.
 */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL — check .env.local');
    if (!anonKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY — check .env.local');
    _supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabase;
}

/**
 * Server-only admin client (bypasses RLS).
 * Never imported in client components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL — check .env.local');
    if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY — server-only env var');
    _supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabaseAdmin;
}

// ─── Types ─────────────────────────────────────────────────────────────
export type Plan = 'pilot' | 'starter' | 'growth' | 'enterprise' | 'cancelled';

export interface Brand {
  id: string;
  email: string;
  name: string | null;
  api_key: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  scan_count_month: number;
  scan_count_prev_month: number;
  overage_months: number;
  auto_upgraded_at: string | null;
  auto_upgrade_disabled: boolean;
  theme?: 'dark' | 'light' | null;
  created_at: string;
}
