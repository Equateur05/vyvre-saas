/**
 * VYVRE × DIOR — App de scan (route /dior).
 *
 * Server Component : fetch les produits Dior (Supabase admin) et charge le moteur
 * v10.5 + face-api via <Script>. Le flow interactif est dans DiorScanClient.
 */

import Script from 'next/script';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { Product } from '@/lib/scan-types';
import DiorApp from './DiorApp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: 'VYVRE × DIOR · Cell Energy OS',
  description: 'La longévité, quantifiée — diagnostic peau on-device par réseau de neurones.',
  robots: { index: false, follow: false },
};

async function getDiorProducts(): Promise<Product[]> {
  try {
    const supa = getSupabaseAdmin();
    const { data: brand } = await supa.from('brands').select('id').eq('slug', 'dior').maybeSingle();
    if (!brand) return [];
    const { data: products } = await supa
      .from('products')
      .select('id, brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position')
      .eq('brand_id', brand.id)
      .order('position', { ascending: true })
      .limit(200);
    return (products as Product[]) || [];
  } catch (err) {
    console.error('[dior] products fetch failed', err);
    return [];
  }
}

export default async function DiorPage() {
  const products = await getDiorProducts();

  return (
    <>
      {/* face-api.js (détection visage + landmarks) */}
      <Script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js" strategy="afterInteractive" />
      {/* Config : chemin ABSOLU du modèle CNN (sinon résolu relatif à /dior → 404) */}
      <Script id="vyvre-cnn-cfg" strategy="afterInteractive">
        {`window.VYVRE_CNN_MODEL_URL = '/models/age-cnn-v2/model.json';`}
      </Script>
      {/* TensorFlow.js chargé EAGER (pas seulement au 1er scan) → le CNN d'âge tourne par défaut */}
      <Script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js" strategy="afterInteractive" />
      {/* Loader + moteur v10.5 + tracker + mini-lattice */}
      <Script src="/engine/vyvre-loader.js" strategy="afterInteractive" />
      <Script src="/engine/vyvre-scan-engine.js" strategy="afterInteractive" />
      <Script src="/engine/vyvre-tracker.js" strategy="afterInteractive" />
      <Script src="/engine/vyvre-mini-lattice.js" strategy="afterInteractive" />
      {/* Préchauffe le CNN d'âge dès que le moteur est prêt (warm-up GPU) */}
      <Script id="vyvre-warm-cnn" strategy="afterInteractive">
        {`(function(){var n=0,t=setInterval(function(){n++;var e=window.VYVRE_SCAN_ENGINE;if(e&&e.preloadCNN){clearInterval(t);try{e.preloadCNN().then(function(r){console.log('[dior] CNN preload',r);}).catch(function(){});}catch(_){}}if(n>60)clearInterval(t);},250);})();`}
      </Script>

      <DiorApp products={products} />
    </>
  );
}
