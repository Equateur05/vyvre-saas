/**
 * Garde Supabase éveillé.
 *
 * L'offre gratuite met le projet en pause après 7 jours sans requête : vyvre.fr/api/products
 * tombait en « Database error » et les webhooks Stripe ne pouvaient plus rien enregistrer.
 * Vercel appelle cette route une fois par jour (vercel.json → crons).
 */

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const started = Date.now();
  const { error, count } = await getSupabaseAdmin()
    .from('products')
    .select('id', { count: 'exact', head: true });
  if (error) {
    console.error('[keepalive] supabase error:', error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, products: count, ms: Date.now() - started });
}
