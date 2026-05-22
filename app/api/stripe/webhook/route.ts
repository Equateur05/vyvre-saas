/**
 * VYVRE × Stripe Webhook handler
 *
 * Endpoint: POST /api/stripe/webhook
 *
 * Configure in Stripe Dashboard → Developers → Webhooks → Add endpoint
 * URL: https://vyvre.fr/api/stripe/webhook
 * Events to listen for:
 *   - checkout.session.completed       (provision brand + send email)
 *   - invoice.payment_succeeded        (auto-upgrade logic)
 *   - customer.subscription.deleted    (mark cancelled)
 *   - invoice.payment_failed           (notify)
 */

import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe, UPGRADE_LADDER, PLAN_QUOTAS } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { provisionFromSession } from '@/lib/brand-provisioning';
import { sendUpgradeEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET missing');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  // Read raw body for signature verification
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.error('[webhook] signature verification failed:', msg);
    return new Response(`Webhook Error: ${msg}`, { status: 400 });
  }

  console.log(`[webhook] received: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[webhook] unhandled event: ${event.type}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    console.error(`[webhook] handler failed for ${event.type}:`, msg, err);
    // Return 200 to Stripe to avoid retries on our bugs;
    // the dashboard will show the error in event logs.
    return Response.json({ received: true, handled: false, error: msg }, { status: 200 });
  }

  return Response.json({ received: true, handled: true });
}

// ─── Event Handlers ────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Provision the brand (idempotent — safe to call from /success page too)
  const result = await provisionFromSession(session, stripe);
  console.log(
    `[webhook] checkout.completed: brand=${result.brand.id} plan=${result.brand.plan} isNew=${result.isNew} emailSent=${result.emailSent}`
  );
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!subscriptionId) return;

  const supabase = getSupabaseAdmin();
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();

  if (!brand) {
    console.log(`[webhook] payment_succeeded: no brand for sub=${subscriptionId} (likely first invoice — checkout webhook will handle)`);
    return;
  }

  const currentPlan = brand.plan as keyof typeof PLAN_QUOTAS;
  const quota = PLAN_QUOTAS[currentPlan];
  const usage = brand.scan_count_month || 0;

  // Quota exceeded this month?
  if (usage <= quota) {
    // Reset overage counter if previously accumulated
    if (brand.overage_months > 0) {
      await supabase
        .from('brands')
        .update({ overage_months: 0 })
        .eq('id', brand.id);
    }
    return;
  }

  const newOverageMonths = (brand.overage_months || 0) + 1;

  await supabase
    .from('brands')
    .update({
      overage_months: newOverageMonths,
      scan_count_prev_month: usage,
    })
    .eq('id', brand.id);

  // Auto-upgrade if 2+ consecutive months overage
  const upgrade = UPGRADE_LADDER[currentPlan];
  if (newOverageMonths >= 2 && upgrade && !brand.auto_upgrade_disabled) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const currentItemId = subscription.items.data[0].id;

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: currentItemId, price: upgrade.nextPriceId }],
      proration_behavior: 'always_invoice',
      metadata: {
        auto_upgraded_from: currentPlan,
        auto_upgraded_at: new Date().toISOString(),
      },
    });

    await supabase
      .from('brands')
      .update({
        plan: upgrade.nextPlan,
        overage_months: 0,
        auto_upgraded_at: new Date().toISOString(),
      })
      .eq('id', brand.id);

    try {
      await sendUpgradeEmail({
        to: brand.email,
        brandName: brand.name,
        oldPlan: currentPlan,
        newPlanLabel: upgrade.label,
        newQuota: upgrade.nextQuota,
        monthlyEur: upgrade.monthlyEur,
      });
    } catch (err) {
      console.error('[webhook] upgrade email failed', err);
    }

    console.log(`[webhook] auto-upgraded brand=${brand.id} ${currentPlan} → ${upgrade.nextPlan}`);
  } else if (currentPlan === 'enterprise') {
    // Enterprise overage: handled via Billing Meter (not yet wired)
    console.log(`[webhook] enterprise overage: brand=${brand.id} usage=${usage} (meter pending)`);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('brands')
    .update({ plan: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id);
  console.log(`[webhook] subscription deleted: ${subscription.id} → plan='cancelled'`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
  if (!customerId) return;

  const supabase = getSupabaseAdmin();
  const { data: brand } = await supabase
    .from('brands')
    .select('id, email, name, plan')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (!brand) return;

  console.warn(`[webhook] payment failed for brand=${brand.id} (${brand.email}) — TODO: send dunning email`);
  // TODO: send "Problème de paiement" email via Resend
}
