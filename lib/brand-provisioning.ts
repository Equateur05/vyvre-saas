/**
 * VYVRE — Brand provisioning
 *
 * Idempotent: creates or fetches a brand based on Stripe customer_id.
 * Called from both the webhook handler and the /success page (race-safe).
 *
 * Returns the brand row (always — never throws on "already exists").
 */

import type Stripe from 'stripe';
import { getSupabaseAdmin, type Brand } from './supabase';
import { planFromPriceId, type STRIPE_PRICES } from './stripe';
import { generateApiKey } from './api-key';
import { sendWelcomeEmail } from './email';

export interface ProvisionInput {
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
  email: string;
  priceId: string;
  brandName?: string | null;
}

/**
 * Derive a URL-safe slug from a brand name (or fall back to the email's local
 * part, or finally the stripe_customer_id suffix). The slug is used as a stable
 * brand identifier for the products catalog lookup on /widget/embed.
 *
 * Note: we suffix with a short random hash so two brands named "Test" don't
 * collide. The slug column has a UNIQUE constraint in 003_brand_slugs.sql.
 */
function deriveSlug(
  brandName: string | null | undefined,
  email: string,
  stripeCustomerId: string
): string {
  const base = (brandName || email.split('@')[0] || stripeCustomerId.replace(/^cus_/, ''))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  const suffix = stripeCustomerId.slice(-6).toLowerCase().replace(/[^a-z0-9]/g, '');
  return base ? `${base}-${suffix}` : `brand-${suffix}`;
}

export interface ProvisionResult {
  brand: Brand;
  isNew: boolean;
  emailSent: boolean;
}

/**
 * Idempotently provision a brand after a Stripe checkout/subscription event.
 * Safe to call multiple times for the same customer — only the first call
 * actually creates the brand + sends the email.
 */
export async function provisionBrand(input: ProvisionInput): Promise<ProvisionResult> {
  const supabase = getSupabaseAdmin();

  // 1. Check if brand already exists (by stripe_customer_id)
  const { data: existing } = await supabase
    .from('brands')
    .select('*')
    .eq('stripe_customer_id', input.stripeCustomerId)
    .maybeSingle();

  if (existing) {
    return { brand: existing as Brand, isNew: false, emailSent: false };
  }

  // 2. Resolve plan from price ID
  const plan = planFromPriceId(input.priceId);
  if (!plan) {
    throw new Error(`Unknown price ID: ${input.priceId} — cannot resolve plan`);
  }

  // 3. Generate API key + slug
  const apiKey = generateApiKey();
  const slug = deriveSlug(input.brandName, input.email, input.stripeCustomerId);

  // 4. Insert brand (with ON CONFLICT handling — if another concurrent request
  //    just created it, we'll re-fetch instead of erroring out)
  const { data: inserted, error: insertError } = await supabase
    .from('brands')
    .insert({
      email: input.email,
      name: input.brandName ?? null,
      slug,
      api_key: apiKey,
      plan,
      stripe_customer_id: input.stripeCustomerId,
      stripe_subscription_id: input.stripeSubscriptionId ?? null,
      scan_count_month: 0,
      scan_count_prev_month: 0,
      overage_months: 0,
      auto_upgrade_disabled: false,
    })
    .select('*')
    .single();

  if (insertError) {
    // Possible race: someone else inserted between our SELECT and INSERT.
    // Re-fetch and return their row.
    const { data: refetched } = await supabase
      .from('brands')
      .select('*')
      .eq('stripe_customer_id', input.stripeCustomerId)
      .maybeSingle();
    if (refetched) {
      return { brand: refetched as Brand, isNew: false, emailSent: false };
    }
    throw insertError;
  }

  const brand = inserted as Brand;

  // 5. Send welcome email (fire and don't fail provisioning if email errors)
  let emailSent = false;
  try {
    const result = await sendWelcomeEmail({
      to: brand.email,
      brandName: brand.name,
      apiKey: brand.api_key,
      plan: brand.plan,
    });
    emailSent = !('skipped' in result);
  } catch (err) {
    console.error('[provisionBrand] welcome email failed', err);
    // Don't throw — brand is provisioned, email can be re-sent manually.
  }

  return { brand, isNew: true, emailSent };
}

/**
 * Extract provisioning input from a Stripe Checkout Session.
 * Throws if required fields are missing.
 */
export async function provisionFromSession(
  session: Stripe.Checkout.Session,
  stripe: Stripe
): Promise<ProvisionResult> {
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id;
  const email = session.customer_details?.email || session.customer_email;
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id ?? null;

  if (!customerId) throw new Error('Session has no customer ID');
  if (!email) throw new Error('Session has no customer email');

  // Resolve the price ID from the session line items (need to expand if not already)
  let priceId: string | undefined;

  if (session.line_items?.data?.[0]?.price?.id) {
    priceId = session.line_items.data[0].price.id;
  } else {
    // Fetch line items separately
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    priceId = lineItems.data[0]?.price?.id;
  }

  if (!priceId) throw new Error('Session has no price ID');

  // Pull brand name from custom field if present
  const brandName = session.custom_fields?.find((f) => f.key === 'company')?.text?.value ?? null;

  return provisionBrand({
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    email,
    priceId,
    brandName,
  });
}
