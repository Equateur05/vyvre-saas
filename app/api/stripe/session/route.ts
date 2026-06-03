/**
 * VYVRE × Stripe Session lookup
 *
 * Endpoint: GET /api/stripe/session?id=cs_xxx
 *
 * Used by /success page to fetch session details + ensure brand is provisioned.
 *
 * Idempotent fallback: if the webhook hasn't fired yet (race condition),
 * this endpoint provisions the brand inline so the success page can
 * display the API key immediately.
 */

import { NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { provisionFromSession } from '@/lib/brand-provisioning';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('id');

  if (!sessionId) {
    return Response.json({ error: 'Missing session id' }, { status: 400 });
  }

  if (!sessionId.startsWith('cs_')) {
    return Response.json({ error: 'Invalid session id format' }, { status: 400 });
  }

  try {
    // Fetch session with line items expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    if (session.status !== 'complete') {
      return Response.json({
        status: session.status,
        message: 'Session not yet complete',
      }, { status: 202 });
    }

    // Provision (idempotent — webhook may already have done this)
    const { brand, isNew, emailSent } = await provisionFromSession(session, stripe);

    return Response.json({
      status: 'complete',
      email: brand.email,
      brand_name: brand.name,
      plan: brand.plan,
      api_key: brand.api_key,
      theme: brand.theme ?? 'dark',
      is_new: isNew,
      welcome_email_sent: emailSent,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';

    // Stripe throws StripeInvalidRequestError for malformed or non-existent
    // session IDs. Surface those as 404 (not found) rather than a generic 500,
    // so the /success page can distinguish "bad link" from "server error".
    const e = err as { type?: string; code?: string; statusCode?: number };
    if (
      e?.type === 'StripeInvalidRequestError' ||
      e?.code === 'resource_missing' ||
      e?.statusCode === 404
    ) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    console.error('[api/stripe/session] failed:', msg, err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
