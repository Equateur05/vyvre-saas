/**
 * VYVRE Widget Embed Page
 *
 * URL: https://vyvre.fr/widget/embed?key=vyv_pk_xxx
 *
 * Loaded inside an iframe by /widget.js on customer brand sites.
 * Provides : branded scan UI + real biomarkers + product recommendations.
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import WidgetClient from './WidgetClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: 'VYVRE Skin Diagnostic',
  description: 'On-device skin analysis',
  robots: { index: false, follow: false },
};

interface WidgetEmbedProps {
  searchParams: {
    key?: string;
    brand?: string;
    theme?: string;
    locale?: string;
    host?: string;
  };
}

async function resolveBrand(apiKey: string) {
  if (!apiKey || !apiKey.startsWith('vyv_pk_')) return null;
  try {
    const supa = getSupabaseAdmin();
    const { data: brand } = await supa
      .from('brands')
      .select('id, name, slug, plan, scan_count_month, primary_color, logo_url, auto_upgrade_disabled')
      .eq('api_key', apiKey)
      .neq('plan', 'cancelled')
      .maybeSingle();
    return brand;
  } catch (err) {
    console.error('[widget/embed] brand lookup failed', err);
    return null;
  }
}

async function getProducts(brandSlug: string | null | undefined) {
  if (!brandSlug) return [];
  try {
    const supa = getSupabaseAdmin();
    const { data: brand } = await supa
      .from('brands')
      .select('id')
      .eq('slug', brandSlug)
      .maybeSingle();
    if (!brand) return [];
    const { data: products } = await supa
      .from('products')
      .select('*')
      .eq('brand_id', brand.id)
      .order('position', { ascending: true })
      .limit(50);
    return products || [];
  } catch (err) {
    console.error('[widget/embed] products fetch failed', err);
    return [];
  }
}

export default async function WidgetEmbedPage({ searchParams }: WidgetEmbedProps) {
  const apiKey = searchParams.key || '';
  const locale = (searchParams.locale || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const theme = (searchParams.theme === 'light' ? 'light' : 'dark');

  const brand = await resolveBrand(apiKey);

  // Fallback : if API key invalid, show "Invalid key" error
  if (!brand) {
    return (
      <html lang={locale}>
        <head>
          <style>{`* { box-sizing: border-box; margin: 0; padding: 0 } body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif; background: #0A0A0A; color: #F4F1EA; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px }`}</style>
        </head>
        <body>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 300, marginBottom: 16 }}>
              {locale === 'fr' ? 'Clé invalide' : 'Invalid key'}
            </h1>
            <p style={{ opacity: 0.6, fontSize: 14, lineHeight: 1.6 }}>
              {locale === 'fr'
                ? 'Cette API key VYVRE n\'est pas reconnue ou l\'abonnement a expiré. Contactez charles@vyvre.fr pour assistance.'
                : 'This VYVRE API key is invalid or the subscription has expired. Contact charles@vyvre.fr for help.'}
            </p>
          </div>
        </body>
      </html>
    );
  }

  // Fetch products catalog for matching post-scan
  const products = await getProducts(brand.slug);

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
          html, body { background: ${theme === 'light' ? '#F4F1EA' : '#0A0A0A'}; color: ${theme === 'light' ? '#1A1A18' : '#F4F1EA'}; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif; min-height: 100vh; }
          a { color: inherit; }
        `}</style>
        {/* Real scan engine */}
        <script src="https://vyvre-demos.web.app/vyvre-scan-engine.js" defer />
        {/* face-api.js for face detection */}
        <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js" defer />
      </head>
      <body>
        <WidgetClient
          brand={brand}
          products={products}
          locale={locale as 'fr' | 'en'}
          theme={theme as 'light' | 'dark'}
        />
      </body>
    </html>
  );
}
