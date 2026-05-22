/**
 * VYVRE × Products API
 *
 * Endpoint: GET /api/products?brand=<slug>
 *
 * Returns the public product catalog for a brand, ordered by `position` ASC.
 * Consumed by the 27 demo POCs hosted on https://vyvre-demos.web.app — those
 * POCs render fallback hardcoded products if this endpoint is empty/errors.
 *
 * CORS: wide-open (`*`) because the POCs are hosted on a different origin
 * (Firebase Hosting) and never carry auth cookies — there's nothing to
 * exfiltrate. The product catalog is intentionally public.
 *
 * Caching: 5 min edge cache + 1 min stale-while-revalidate (POCs use
 * `cache: 'force-cache'` on their side too).
 *
 * TODO Upstash: add IP-based rate limiting before public launch
 *               (~10 req/s/IP should be plenty for this read-only endpoint).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── CORS ──────────────────────────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const CACHE_HEADERS = {
  // 5 min fresh, 1 min serving stale while revalidating
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...CORS_HEADERS, ...CACHE_HEADERS, ...(init.headers || {}) },
  });
}

// Preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ─── Validation ────────────────────────────────────────────────────────
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

function isValidSlug(s: string | null): s is string {
  return !!s && SLUG_RE.test(s);
}

// ─── Types ────────────────────────────────────────────────────────────
interface ProductRow {
  id: string;
  name: string;
  image_url: string | null;
  url: string | null;
  price_eur: number | null;
  currency: string | null;
  targets: unknown;
  concern_scores: unknown;
  position: number | null;
}

interface ProductResponse {
  id: string;
  name: string;
  image_url: string | null;
  url: string | null;
  price_eur: number | null;
  currency: string;
  targets: string[];
  concern_scores: Record<string, number> | null;
  position: number;
}

function normalizeTargets(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((v): v is string => typeof v === 'string');
}

function normalizeConcernScores(raw: unknown): Record<string, number> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === 'number') out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

// ─── Handler ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('brand');

  if (!isValidSlug(slug)) {
    return jsonResponse(
      { error: 'Missing or invalid `brand` query parameter' },
      { status: 400 }
    );
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    console.error('[/api/products] supabase init failed:', err);
    return jsonResponse(
      { error: 'Backend not configured' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // 1. Look up the brand by slug
  const { data: brand, error: brandErr } = await supabase
    .from('brands')
    .select('id, name, slug')
    .eq('slug', slug)
    .maybeSingle();

  if (brandErr) {
    console.error('[/api/products] brand lookup error:', brandErr);
    return jsonResponse(
      { error: 'Database error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  if (!brand) {
    return jsonResponse({ error: 'Brand not found' }, { status: 404 });
  }

  // 2. Pull products ordered by position
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select(
      'id, name, image_url, url, price_eur, currency, targets, concern_scores, position'
    )
    .eq('brand_id', brand.id)
    .order('position', { ascending: true });

  if (prodErr) {
    console.error('[/api/products] product fetch error:', prodErr);
    return jsonResponse(
      { error: 'Database error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // 3. Normalize the response shape (decouple BDD column names from API)
  const normalized: ProductResponse[] = (products as ProductRow[] | null ?? []).map(
    (p, idx) => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      url: p.url,
      price_eur: p.price_eur,
      currency: p.currency ?? 'EUR',
      targets: normalizeTargets(p.targets),
      concern_scores: normalizeConcernScores(p.concern_scores),
      position: p.position ?? idx,
    })
  );

  return jsonResponse({
    brand: brand.slug,
    brand_name: brand.name,
    products: normalized,
  });
}
