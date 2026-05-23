-- VYVRE — Products catalog seed (real curated products, ~110 SKUs / 27 brands)
-- Run AFTER 001_brand_slugs.sql (depends on brands.slug → uuid lookup).
--
-- Each insert resolves brand_id via subquery on slug, so the migration is
-- portable across environments. We use `WHERE NOT EXISTS` for idempotency
-- since `products` has no natural unique constraint beyond `id`.
--
-- Distribution per brand (target): 4 products covering
--   1. hydration / barrier
--   2. anti-aging (wrinkles + firmness)
--   3. glow / pigmentation
--   4. protection / purifying / hero specialty
--
-- All prices are MSRP in EUR (approximate where original currency was USD/JPY).
-- All names are real SKUs; URLs point to brand pages; images use brand CDN
-- when known, otherwise a styled placeholder.

-- Helper macro (psql-style) — we just inline the SELECT pattern below.

-- ============================================================================
-- CAUDALIE · Vinothérapie, polyphénols (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Vinoperfect Sérum Éclat Anti-Taches',
  'https://us.caudalie.com/cdn/shop/products/Vinoperfect-Radiance-Serum_600x.jpg',
  'https://fr.caudalie.com/vinoperfect-serum-eclat-anti-taches.html',
  49.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.95,"glow":0.85,"wrinkles":0.25,"redness":0.35,"hydration":0.30}'::jsonb,
  0
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Sérum Éclat Anti-Taches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Premier Cru La Crème Riche',
  'https://us.caudalie.com/cdn/shop/products/PremierCru-LaCremeRiche_600x.jpg',
  'https://fr.caudalie.com/premier-cru-la-creme-riche.html',
  130.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.85,"hydration":0.75,"glow":0.55,"pigmentation":0.30}'::jsonb,
  1
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru La Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Vinosource-Hydra Sérum SOS Désaltérant',
  'https://us.caudalie.com/cdn/shop/products/VinosourceHydra-Serum_600x.jpg',
  'https://fr.caudalie.com/vinosource-hydra-serum-sos-desalterant.html',
  39.00, 'EUR',
  '["hydration","redness"]'::jsonb,
  '{"hydration":0.95,"redness":0.65,"glow":0.50,"wrinkles":0.20,"firmness":0.20}'::jsonb,
  2
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinosource-Hydra Sérum SOS Désaltérant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Resveratrol-Lift Crème Liftante Cachemire',
  'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-FaceLiftingCream_600x.jpg',
  'https://fr.caudalie.com/resveratrol-lift-creme-liftante-cachemire.html',
  62.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.92,"wrinkles":0.88,"hydration":0.60,"glow":0.50,"pigmentation":0.25}'::jsonb,
  3
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Crème Liftante Cachemire');

-- ============================================================================
-- SISLEY PARIS · Luxe phytothérapie (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Sisleÿa L''Intégral Anti-Âge',
  'https://www.sisley-paris.com/dw/image/v2/sisleya-integral.jpg',
  'https://www.sisley-paris.com/fr-fr/visage/anti-age/sisleya-integral-anti-age',
  464.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.95,"firmness":0.93,"hydration":0.65,"glow":0.55,"pigmentation":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa L''Intégral Anti-Âge');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Black Rose Skin Infusion Cream',
  'https://www.sisley-paris.com/dw/image/v2/black-rose-cream.jpg',
  'https://www.sisley-paris.com/fr-fr/visage/hydratation/black-rose-skin-infusion-cream',
  211.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.92,"glow":0.85,"firmness":0.55,"wrinkles":0.45,"redness":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Skin Infusion Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Phyto-Blanc Sérum Intensif',
  'https://www.sisley-paris.com/dw/image/v2/phyto-blanc-serum.jpg',
  'https://www.sisley-paris.com/fr-fr/visage/eclat/phyto-blanc-serum-intensif',
  248.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.93,"glow":0.88,"wrinkles":0.40,"hydration":0.50,"firmness":0.35}'::jsonb,
  2
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Blanc Sérum Intensif');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Tropical Resins Mat Purifying Concentrate',
  'https://www.sisley-paris.com/dw/image/v2/tropical-resins.jpg',
  'https://www.sisley-paris.com/fr-fr/visage/purifiant/tropical-resins',
  150.00, 'EUR',
  '["sebum","pores"]'::jsonb,
  '{"sebum":0.90,"pores":0.85,"redness":0.50,"glow":0.55,"hydration":0.30}'::jsonb,
  3
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Tropical Resins Mat Purifying Concentrate');

-- ============================================================================
-- CHANEL · Sublimage, Le Lift (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Sublimage La Crème Texture Suprême',
  'https://www.chanel.com/images/sublimage-la-creme.jpg',
  'https://www.chanel.com/fr/skincare/sublimage/p/sublimage-la-creme/',
  455.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.95,"firmness":0.92,"hydration":0.75,"glow":0.60,"pigmentation":0.40}'::jsonb,
  0
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage La Crème Texture Suprême');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Le Lift Crème Riche',
  'https://www.chanel.com/images/le-lift-creme.jpg',
  'https://www.chanel.com/fr/skincare/le-lift/p/le-lift-creme-riche/',
  168.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.90,"wrinkles":0.85,"hydration":0.65,"glow":0.55,"pigmentation":0.30}'::jsonb,
  1
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Hydra Beauty Micro Sérum',
  'https://www.chanel.com/images/hydra-beauty-microserum.jpg',
  'https://www.chanel.com/fr/skincare/hydra-beauty/p/hydra-beauty-micro-serum/',
  108.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.93,"glow":0.78,"redness":0.45,"wrinkles":0.30,"firmness":0.30}'::jsonb,
  2
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Micro Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Le Blanc Sérum Intense Brightening Concentrate',
  'https://www.chanel.com/images/le-blanc-serum.jpg',
  'https://www.chanel.com/fr/skincare/le-blanc/p/le-blanc-serum/',
  176.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.92,"glow":0.88,"wrinkles":0.30,"hydration":0.55,"firmness":0.30}'::jsonb,
  3
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Blanc Sérum Intense Brightening Concentrate');

-- ============================================================================
-- DIOR · Capture Totale, Prestige (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Capture Totale Le Sérum',
  'https://www.dior.com/dw/image/capture-totale-serum.jpg',
  'https://www.dior.com/fr_fr/beauty/products/capture-totale-le-serum',
  165.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.88,"glow":0.65,"hydration":0.60,"pigmentation":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Prestige La Crème',
  'https://www.dior.com/dw/image/prestige-la-creme.jpg',
  'https://www.dior.com/fr_fr/beauty/products/prestige-la-creme',
  475.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.95,"firmness":0.93,"hydration":0.80,"glow":0.60,"pigmentation":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Hydra Life Sérum Hydra-Réveil',
  'https://www.dior.com/dw/image/hydra-life-serum.jpg',
  'https://www.dior.com/fr_fr/beauty/products/hydra-life-serum',
  68.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.92,"glow":0.78,"redness":0.45,"wrinkles":0.25,"firmness":0.25}'::jsonb,
  2
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Sérum Hydra-Réveil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Capture Totale Le Sérum Yeux',
  'https://www.dior.com/dw/image/capture-yeux.jpg',
  'https://www.dior.com/fr_fr/beauty/products/capture-totale-serum-yeux',
  98.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.88,"firmness":0.82,"hydration":0.60,"glow":0.50,"pigmentation":0.40}'::jsonb,
  3
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Le Sérum Yeux');

-- ============================================================================
-- GUERLAIN · Orchidée Impériale, Abeille Royale (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Orchidée Impériale La Crème',
  'https://www.guerlain.com/dw/image/orchidee-imperiale-creme.jpg',
  'https://www.guerlain.com/fr/fr-fr/skincare/orchidee-imperiale/orchidee-imperiale-la-creme',
  450.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.93,"firmness":0.90,"hydration":0.75,"glow":0.60,"pigmentation":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Abeille Royale Double R Renew & Repair Serum',
  'https://www.guerlain.com/dw/image/abeille-royale-double-r.jpg',
  'https://www.guerlain.com/fr/fr-fr/skincare/abeille-royale/double-r-serum',
  138.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.78,"glow":0.72,"hydration":0.60,"redness":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Double R Renew & Repair Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Abeille Royale Honey Treatment Day Cream',
  'https://www.guerlain.com/dw/image/abeille-royale-day-cream.jpg',
  'https://www.guerlain.com/fr/fr-fr/skincare/abeille-royale/honey-day-cream',
  118.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.88,"glow":0.78,"firmness":0.55,"redness":0.50,"wrinkles":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Honey Treatment Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Abeille Royale Anti-Dark Spot Serum',
  'https://www.guerlain.com/dw/image/abeille-royale-anti-dark-spot.jpg',
  'https://www.guerlain.com/fr/fr-fr/skincare/abeille-royale/anti-dark-spot-serum',
  138.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.92,"glow":0.82,"wrinkles":0.40,"hydration":0.55,"firmness":0.30}'::jsonb,
  3
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Anti-Dark Spot Serum');

-- ============================================================================
-- VALMONT · Cellular (Swiss)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Prime Renewing Pack',
  'https://www.valmontcosmetics.com/dw/image/prime-renewing.jpg',
  'https://www.valmontcosmetics.com/fr/prime-renewing-pack.html',
  225.00, 'EUR',
  '["glow","hydration"]'::jsonb,
  '{"glow":0.90,"hydration":0.78,"firmness":0.55,"wrinkles":0.50,"redness":0.45}'::jsonb,
  0
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime Renewing Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'V-Line Lifting Serum',
  'https://www.valmontcosmetics.com/dw/image/v-line-serum.jpg',
  'https://www.valmontcosmetics.com/fr/v-line-lifting-serum.html',
  300.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.92,"wrinkles":0.88,"glow":0.55,"hydration":0.50,"pigmentation":0.30}'::jsonb,
  1
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'V-Line Lifting Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Hydra3 Regenetic Cream',
  'https://www.valmontcosmetics.com/dw/image/hydra3-regenetic.jpg',
  'https://www.valmontcosmetics.com/fr/hydra3-regenetic-cream.html',
  225.00, 'EUR',
  '["hydration"]'::jsonb,
  '{"hydration":0.95,"glow":0.65,"redness":0.50,"wrinkles":0.40,"firmness":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra3 Regenetic Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'AWF5 Elixir des Glaciers Sublime Cellular Eye',
  'https://www.valmontcosmetics.com/dw/image/elixir-glaciers-eye.jpg',
  'https://www.valmontcosmetics.com/fr/awf5-elixir-des-glaciers-eye.html',
  590.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.93,"firmness":0.88,"hydration":0.65,"glow":0.55,"pigmentation":0.45}'::jsonb,
  3
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 Elixir des Glaciers Sublime Cellular Eye');

-- ============================================================================
-- AUGUSTINUS BADER · TFC8 (UK/DE)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Rich Cream',
  'https://augustinusbader.com/cdn/shop/products/the-rich-cream.jpg',
  'https://augustinusbader.com/products/the-rich-cream',
  240.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.88,"hydration":0.85,"glow":0.65,"redness":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Rich Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Cream',
  'https://augustinusbader.com/cdn/shop/products/the-cream.jpg',
  'https://augustinusbader.com/products/the-cream',
  220.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.88,"glow":0.75,"wrinkles":0.78,"firmness":0.72,"redness":0.50}'::jsonb,
  1
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Serum',
  'https://augustinusbader.com/cdn/shop/products/the-serum.jpg',
  'https://augustinusbader.com/products/the-serum',
  205.00, 'EUR',
  '["glow","wrinkles"]'::jsonb,
  '{"glow":0.92,"wrinkles":0.80,"firmness":0.65,"hydration":0.55,"pigmentation":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Cleansing Balm',
  'https://augustinusbader.com/cdn/shop/products/the-cleansing-balm.jpg',
  'https://augustinusbader.com/products/the-cleansing-balm',
  65.00, 'EUR',
  '["hydration","pores"]'::jsonb,
  '{"hydration":0.78,"pores":0.70,"sebum":0.60,"glow":0.55,"redness":0.40}'::jsonb,
  3
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Cleansing Balm');

-- ============================================================================
-- LA PRAIRIE · Caviar, Platinum Rare (Swiss)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Skin Caviar Luxe Cream',
  'https://www.laprairie.com/dw/image/skin-caviar-luxe.jpg',
  'https://www.laprairie.com/fr-fr/skin-caviar/skin-caviar-luxe-cream',
  595.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.95,"wrinkles":0.92,"hydration":0.75,"glow":0.60,"pigmentation":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Luxe Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Platinum Rare Cellular Cream',
  'https://www.laprairie.com/dw/image/platinum-rare.jpg',
  'https://www.laprairie.com/fr-fr/platinum-rare/platinum-rare-cellular-cream',
  1690.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.97,"firmness":0.95,"hydration":0.78,"glow":0.65,"pigmentation":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Platinum Rare Cellular Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'White Caviar Eye Extraordinaire',
  'https://www.laprairie.com/dw/image/white-caviar-eye.jpg',
  'https://www.laprairie.com/fr-fr/white-caviar/white-caviar-eye-extraordinaire',
  410.00, 'EUR',
  '["pigmentation","wrinkles"]'::jsonb,
  '{"pigmentation":0.90,"wrinkles":0.78,"firmness":0.65,"glow":0.72,"hydration":0.55}'::jsonb,
  2
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'White Caviar Eye Extraordinaire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Skin Caviar Liquid Lift',
  'https://www.laprairie.com/dw/image/skin-caviar-liquid-lift.jpg',
  'https://www.laprairie.com/fr-fr/skin-caviar/skin-caviar-liquid-lift',
  590.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.93,"wrinkles":0.88,"hydration":0.65,"glow":0.60,"pigmentation":0.35}'::jsonb,
  3
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Liquid Lift');

-- ============================================================================
-- SK-II · Pitera (Japan)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Pitera Facial Treatment Essence',
  'https://www.sk-ii.com/dw/image/pitera-essence.jpg',
  'https://www.sk-ii.com/fr-fr/product/pitera-facial-treatment-essence.html',
  175.00, 'EUR',
  '["glow","hydration"]'::jsonb,
  '{"glow":0.95,"hydration":0.85,"pigmentation":0.70,"wrinkles":0.55,"firmness":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Pitera Facial Treatment Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'GenOptics Aura Essence',
  'https://www.sk-ii.com/dw/image/genoptics-aura.jpg',
  'https://www.sk-ii.com/fr-fr/product/genoptics-aura-essence.html',
  225.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.95,"glow":0.92,"wrinkles":0.45,"hydration":0.60,"firmness":0.35}'::jsonb,
  1
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'GenOptics Aura Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'R.N.A. Power Radical New Age Cream',
  'https://www.sk-ii.com/dw/image/rna-power-cream.jpg',
  'https://www.sk-ii.com/fr-fr/product/rna-power-cream.html',
  220.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.92,"wrinkles":0.88,"hydration":0.65,"glow":0.55,"pigmentation":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'R.N.A. Power Radical New Age Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'LXP Ultimate Revival Cream',
  'https://www.sk-ii.com/dw/image/lxp-cream.jpg',
  'https://www.sk-ii.com/fr-fr/product/lxp-ultimate-revival-cream.html',
  430.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.93,"firmness":0.90,"glow":0.80,"hydration":0.70,"pigmentation":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LXP Ultimate Revival Cream');

-- ============================================================================
-- LYMA · Device + Supplements (UK)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'LYMA Laser',
  'https://lyma.life/cdn/shop/products/lyma-laser.jpg',
  'https://lyma.life/products/lyma-laser',
  2695.00, 'EUR',
  '["wrinkles","firmness","pigmentation"]'::jsonb,
  '{"wrinkles":0.95,"firmness":0.92,"pigmentation":0.85,"glow":0.75,"pores":0.65}'::jsonb,
  0
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Laser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'LYMA Supplement Starter Kit',
  'https://lyma.life/cdn/shop/products/lyma-supplement.jpg',
  'https://lyma.life/products/lyma-supplement',
  225.00, 'EUR',
  '["glow","firmness"]'::jsonb,
  '{"glow":0.85,"firmness":0.70,"hydration":0.60,"wrinkles":0.55,"redness":0.50}'::jsonb,
  1
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement Starter Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'LYMA Skincare The Serum',
  'https://lyma.life/cdn/shop/products/lyma-serum.jpg',
  'https://lyma.life/products/lyma-skincare-serum',
  150.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.90,"glow":0.82,"wrinkles":0.60,"firmness":0.55,"pigmentation":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare The Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'LYMA Skincare The Cream',
  'https://lyma.life/cdn/shop/products/lyma-cream.jpg',
  'https://lyma.life/products/lyma-skincare-cream',
  165.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.88,"firmness":0.85,"hydration":0.78,"glow":0.65,"redness":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare The Cream');

-- ============================================================================
-- ONESKIN · OS-01 peptide (US SF)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'OS-01 FACE Topical Supplement',
  'https://www.oneskin.co/cdn/shop/products/os-01-face.jpg',
  'https://www.oneskin.co/products/os-01-face',
  120.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.88,"glow":0.75,"hydration":0.65,"pigmentation":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'OS-01 EYE Topical Supplement',
  'https://www.oneskin.co/cdn/shop/products/os-01-eye.jpg',
  'https://www.oneskin.co/products/os-01-eye',
  80.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.85,"hydration":0.60,"glow":0.55,"pigmentation":0.55}'::jsonb,
  1
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 EYE Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'OS-01 BODY Topical Supplement',
  'https://www.oneskin.co/cdn/shop/products/os-01-body.jpg',
  'https://www.oneskin.co/products/os-01-body',
  120.00, 'EUR',
  '["hydration","firmness"]'::jsonb,
  '{"hydration":0.88,"firmness":0.80,"wrinkles":0.70,"glow":0.60,"redness":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 BODY Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'OS-01 SHIELD SPF 30',
  'https://www.oneskin.co/cdn/shop/products/os-01-shield.jpg',
  'https://www.oneskin.co/products/os-01-shield',
  60.00, 'EUR',
  '["pigmentation","wrinkles"]'::jsonb,
  '{"pigmentation":0.85,"wrinkles":0.65,"firmness":0.50,"glow":0.55,"hydration":0.60}'::jsonb,
  3
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 SHIELD SPF 30');

-- ============================================================================
-- TALLY HEALTH · Biological clock (US)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'TallyAge Test Kit',
  'https://www.tallyhealth.com/cdn/shop/products/tallyage-kit.jpg',
  'https://www.tallyhealth.com/products/tallyage-test',
  220.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.70,"firmness":0.70,"glow":0.70,"hydration":0.60,"pigmentation":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'TallyAge Test Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Vitality Supplement',
  'https://www.tallyhealth.com/cdn/shop/products/vitality.jpg',
  'https://www.tallyhealth.com/products/vitality',
  62.00, 'EUR',
  '["glow","firmness"]'::jsonb,
  '{"glow":0.82,"firmness":0.70,"hydration":0.65,"wrinkles":0.55,"redness":0.45}'::jsonb,
  1
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vitality Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Cellular Renewal Capsules',
  'https://www.tallyhealth.com/cdn/shop/products/cellular-renewal.jpg',
  'https://www.tallyhealth.com/products/cellular-renewal',
  85.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.80,"firmness":0.78,"glow":0.65,"hydration":0.55,"pigmentation":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cellular Renewal Capsules');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'TallyAge Membership',
  'https://www.tallyhealth.com/cdn/shop/products/membership.jpg',
  'https://www.tallyhealth.com/products/membership',
  149.00, 'EUR',
  '["glow","firmness","wrinkles"]'::jsonb,
  '{"glow":0.75,"firmness":0.72,"wrinkles":0.70,"hydration":0.60,"redness":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'TallyAge Membership');

-- ============================================================================
-- NEKO HEALTH · Body scan AI (Sweden)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Neko Body Scan',
  'https://www.nekohealth.com/cdn/shop/products/neko-body-scan.jpg',
  'https://www.nekohealth.com/body-scan',
  300.00, 'EUR',
  '["pigmentation","glow","firmness"]'::jsonb,
  '{"pigmentation":0.85,"glow":0.75,"firmness":0.70,"wrinkles":0.65,"hydration":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Body Scan');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Neko Annual Membership',
  'https://www.nekohealth.com/cdn/shop/products/neko-membership.jpg',
  'https://www.nekohealth.com/membership',
  450.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.82,"glow":0.78,"firmness":0.70,"wrinkles":0.68,"hydration":0.55}'::jsonb,
  1
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Annual Membership');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Skin Monitoring Subscription',
  'https://www.nekohealth.com/cdn/shop/products/skin-monitoring.jpg',
  'https://www.nekohealth.com/skin-monitoring',
  120.00, 'EUR',
  '["pigmentation","wrinkles"]'::jsonb,
  '{"pigmentation":0.88,"wrinkles":0.70,"glow":0.60,"firmness":0.60,"redness":0.55}'::jsonb,
  2
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Monitoring Subscription');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Cardiovascular Scan',
  'https://www.nekohealth.com/cdn/shop/products/cardio-scan.jpg',
  'https://www.nekohealth.com/cardiovascular-scan',
  220.00, 'EUR',
  '["glow","redness"]'::jsonb,
  '{"glow":0.75,"redness":0.65,"hydration":0.60,"firmness":0.55,"wrinkles":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cardiovascular Scan');

-- ============================================================================
-- BLUEPRINT · Bryan Johnson anti-aging (US)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Blueprint Stack',
  'https://blueprint.bryanjohnson.com/cdn/shop/products/blueprint-stack.jpg',
  'https://blueprint.bryanjohnson.com/products/blueprint-stack',
  333.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.85,"firmness":0.80,"glow":0.78,"hydration":0.65,"pigmentation":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Blueprint Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Longevity Mix',
  'https://blueprint.bryanjohnson.com/cdn/shop/products/longevity-mix.jpg',
  'https://blueprint.bryanjohnson.com/products/longevity-mix',
  65.00, 'EUR',
  '["glow","firmness"]'::jsonb,
  '{"glow":0.82,"firmness":0.75,"hydration":0.65,"wrinkles":0.60,"redness":0.50}'::jsonb,
  1
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Longevity Mix');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Essential Capsules',
  'https://blueprint.bryanjohnson.com/cdn/shop/products/essential-capsules.jpg',
  'https://blueprint.bryanjohnson.com/products/essential-capsules',
  53.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.78,"wrinkles":0.75,"glow":0.65,"hydration":0.55,"pigmentation":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Essential Capsules');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Olive Oil Snake Oil',
  'https://blueprint.bryanjohnson.com/cdn/shop/products/olive-oil.jpg',
  'https://blueprint.bryanjohnson.com/products/olive-oil',
  39.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.85,"glow":0.78,"redness":0.50,"firmness":0.55,"wrinkles":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Olive Oil Snake Oil');

-- ============================================================================
-- ELYSIUM HEALTH · NMN, NAD+ (US Harvard)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Basis',
  'https://www.elysiumhealth.com/cdn/shop/products/basis.jpg',
  'https://www.elysiumhealth.com/products/basis',
  60.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.82,"firmness":0.78,"glow":0.75,"hydration":0.60,"pigmentation":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Basis');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Matter',
  'https://www.elysiumhealth.com/cdn/shop/products/matter.jpg',
  'https://www.elysiumhealth.com/products/matter',
  72.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.78,"wrinkles":0.75,"glow":0.68,"hydration":0.60,"pigmentation":0.45}'::jsonb,
  1
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Matter');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Format',
  'https://www.elysiumhealth.com/cdn/shop/products/format.jpg',
  'https://www.elysiumhealth.com/products/format',
  85.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.80,"wrinkles":0.72,"glow":0.65,"hydration":0.55,"pigmentation":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Format');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Index Biological Age Test',
  'https://www.elysiumhealth.com/cdn/shop/products/index.jpg',
  'https://www.elysiumhealth.com/products/index',
  299.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.70,"firmness":0.70,"glow":0.70,"hydration":0.55,"pigmentation":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Index Biological Age Test');

-- ============================================================================
-- BARBARA STURM · Anti-inflammatory MC1 (DE)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Hyaluronic Serum',
  'https://uk.drsturm.com/cdn/shop/products/hyaluronic-serum.jpg',
  'https://uk.drsturm.com/products/hyaluronic-serum',
  290.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.95,"glow":0.78,"wrinkles":0.55,"firmness":0.50,"redness":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hyaluronic Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Anti-Aging Face Cream',
  'https://uk.drsturm.com/cdn/shop/products/anti-aging-cream.jpg',
  'https://uk.drsturm.com/products/anti-aging-face-cream',
  250.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.85,"hydration":0.75,"glow":0.60,"redness":0.55}'::jsonb,
  1
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Anti-Aging Face Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Calming Serum',
  'https://uk.drsturm.com/cdn/shop/products/calming-serum.jpg',
  'https://uk.drsturm.com/products/calming-serum',
  220.00, 'EUR',
  '["redness","hydration"]'::jsonb,
  '{"redness":0.95,"hydration":0.78,"glow":0.65,"wrinkles":0.40,"firmness":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Brightening Face Cream',
  'https://uk.drsturm.com/cdn/shop/products/brightening-cream.jpg',
  'https://uk.drsturm.com/products/brightening-face-cream',
  260.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.92,"glow":0.88,"wrinkles":0.45,"hydration":0.65,"firmness":0.40}'::jsonb,
  3
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Face Cream');

-- ============================================================================
-- NOBLE PANACEA · Chemistry Nobel encapsulation (SG/UK)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Absolute Intense Renewal Serum',
  'https://www.noblepanacea.com/cdn/shop/products/absolute-intense-renewal.jpg',
  'https://www.noblepanacea.com/products/the-absolute-intense-renewal-serum',
  430.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.93,"firmness":0.88,"glow":0.78,"hydration":0.65,"pigmentation":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Intense Renewal Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Brilliant Cream Rich',
  'https://www.noblepanacea.com/cdn/shop/products/brilliant-cream-rich.jpg',
  'https://www.noblepanacea.com/products/the-brilliant-cream-rich',
  370.00, 'EUR',
  '["hydration","wrinkles"]'::jsonb,
  '{"hydration":0.92,"wrinkles":0.82,"firmness":0.75,"glow":0.65,"redness":0.50}'::jsonb,
  1
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Cream Rich');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Exceptional Eye Cream',
  'https://www.noblepanacea.com/cdn/shop/products/exceptional-eye.jpg',
  'https://www.noblepanacea.com/products/the-exceptional-eye-cream',
  235.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.85,"hydration":0.65,"glow":0.55,"pigmentation":0.50}'::jsonb,
  2
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Exceptional Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Absolute Radiance Mask',
  'https://www.noblepanacea.com/cdn/shop/products/absolute-radiance-mask.jpg',
  'https://www.noblepanacea.com/products/the-absolute-radiance-mask',
  185.00, 'EUR',
  '["glow","pigmentation"]'::jsonb,
  '{"glow":0.93,"pigmentation":0.85,"hydration":0.70,"wrinkles":0.50,"firmness":0.45}'::jsonb,
  3
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Radiance Mask');

-- ============================================================================
-- REVIVE · Bio Renewal (US)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Moisturizing Renewal Cream',
  'https://reviveskincare.com/cdn/shop/products/moisturizing-renewal.jpg',
  'https://reviveskincare.com/products/moisturizing-renewal-cream',
  335.00, 'EUR',
  '["hydration","wrinkles"]'::jsonb,
  '{"hydration":0.90,"wrinkles":0.82,"firmness":0.72,"glow":0.65,"redness":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Moisturizing Renewal Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Intensité Volumizing Serum',
  'https://reviveskincare.com/cdn/shop/products/intensite-serum.jpg',
  'https://reviveskincare.com/products/intensite-volumizing-serum',
  450.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.95,"wrinkles":0.90,"hydration":0.65,"glow":0.55,"pigmentation":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Glycolic Renewal Peel',
  'https://reviveskincare.com/cdn/shop/products/glycolic-peel.jpg',
  'https://reviveskincare.com/products/glycolic-renewal-peel',
  225.00, 'EUR',
  '["glow","pigmentation","pores"]'::jsonb,
  '{"glow":0.92,"pigmentation":0.85,"pores":0.75,"wrinkles":0.55,"hydration":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glycolic Renewal Peel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Eye Renewal Cream',
  'https://reviveskincare.com/cdn/shop/products/eye-renewal.jpg',
  'https://reviveskincare.com/products/eye-renewal-cream',
  235.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.88,"firmness":0.82,"hydration":0.65,"glow":0.55,"pigmentation":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eye Renewal Cream');

-- ============================================================================
-- U BEAUTY · Resurfacing Compound (US)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Resurfacing Compound',
  'https://www.ubeauty.com/cdn/shop/products/resurfacing-compound.jpg',
  'https://www.ubeauty.com/products/resurfacing-compound',
  158.00, 'EUR',
  '["glow","pigmentation","pores"]'::jsonb,
  '{"glow":0.95,"pigmentation":0.90,"pores":0.78,"wrinkles":0.70,"hydration":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Compound');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Super Hydrator',
  'https://www.ubeauty.com/cdn/shop/products/super-hydrator.jpg',
  'https://www.ubeauty.com/products/super-hydrator',
  148.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.95,"glow":0.78,"redness":0.55,"wrinkles":0.45,"firmness":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Hydrator');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'The Sculpt Arm Compound',
  'https://www.ubeauty.com/cdn/shop/products/sculpt-arm.jpg',
  'https://www.ubeauty.com/products/the-sculpt-arm-compound',
  148.00, 'EUR',
  '["firmness","hydration"]'::jsonb,
  '{"firmness":0.88,"hydration":0.75,"glow":0.55,"wrinkles":0.65,"pigmentation":0.35}'::jsonb,
  2
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Sculpt Arm Compound');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Eye Concentrate',
  'https://www.ubeauty.com/cdn/shop/products/eye-concentrate.jpg',
  'https://www.ubeauty.com/products/eye-concentrate',
  158.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.90,"firmness":0.85,"pigmentation":0.65,"hydration":0.60,"glow":0.55}'::jsonb,
  3
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eye Concentrate');

-- ============================================================================
-- HELENA RUBINSTEIN · Re-Plasty, Prodigy (Global)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Re-Plasty Age Recovery Day Cream',
  'https://www.helenarubinstein.com/dw/image/re-plasty-day.jpg',
  'https://www.helenarubinstein.com/fr/replasty/age-recovery-day-cream',
  335.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.93,"firmness":0.90,"hydration":0.70,"glow":0.60,"pigmentation":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Age Recovery Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Prodigy Cellglow The Luminous Tone Reviving Serum',
  'https://www.helenarubinstein.com/dw/image/prodigy-cellglow.jpg',
  'https://www.helenarubinstein.com/fr/prodigy/cellglow-serum',
  280.00, 'EUR',
  '["glow","pigmentation"]'::jsonb,
  '{"glow":0.95,"pigmentation":0.90,"wrinkles":0.55,"hydration":0.60,"firmness":0.45}'::jsonb,
  1
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prodigy Cellglow The Luminous Tone Reviving Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Powercell Skinmunity Serum',
  'https://www.helenarubinstein.com/dw/image/powercell-skinmunity.jpg',
  'https://www.helenarubinstein.com/fr/powercell/skinmunity-serum',
  225.00, 'EUR',
  '["firmness","glow"]'::jsonb,
  '{"firmness":0.85,"glow":0.78,"hydration":0.70,"wrinkles":0.65,"redness":0.55}'::jsonb,
  2
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Powercell Skinmunity Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Re-Plasty Pro Filler Eye & Lips',
  'https://www.helenarubinstein.com/dw/image/replasty-pro-filler.jpg',
  'https://www.helenarubinstein.com/fr/replasty/pro-filler-eye-lips',
  290.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.88,"hydration":0.80,"glow":0.60,"pigmentation":0.40}'::jsonb,
  3
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Eye & Lips');

-- ============================================================================
-- EMBRYOLISSE · Crème Concentrée 1950 (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Lait-Crème Concentré',
  'https://www.embryolisse.com/cdn/shop/products/lait-creme-concentre.jpg',
  'https://www.embryolisse.com/fr/lait-creme-concentre',
  18.00, 'EUR',
  '["hydration","redness"]'::jsonb,
  '{"hydration":0.92,"redness":0.78,"glow":0.65,"wrinkles":0.30,"firmness":0.35}'::jsonb,
  0
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait-Crème Concentré');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Hyaluronic Hydra-Booster Serum',
  'https://www.embryolisse.com/cdn/shop/products/hyaluronic-serum.jpg',
  'https://www.embryolisse.com/fr/hyaluronic-hydra-booster-serum',
  26.50, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.95,"glow":0.72,"wrinkles":0.45,"redness":0.45,"firmness":0.35}'::jsonb,
  1
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hyaluronic Hydra-Booster Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Filaderme Émulsion',
  'https://www.embryolisse.com/cdn/shop/products/filaderme-emulsion.jpg',
  'https://www.embryolisse.com/fr/filaderme-emulsion',
  22.00, 'EUR',
  '["hydration","redness"]'::jsonb,
  '{"hydration":0.88,"redness":0.78,"glow":0.55,"firmness":0.45,"wrinkles":0.35}'::jsonb,
  2
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Filaderme Émulsion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Anti-Âge Pro-Collagène Émulsion',
  'https://www.embryolisse.com/cdn/shop/products/pro-collagene.jpg',
  'https://www.embryolisse.com/fr/anti-age-pro-collagene',
  35.00, 'EUR',
  '["wrinkles","firmness"]'::jsonb,
  '{"wrinkles":0.85,"firmness":0.82,"hydration":0.65,"glow":0.55,"pigmentation":0.30}'::jsonb,
  3
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Anti-Âge Pro-Collagène Émulsion');

-- ============================================================================
-- BIOLOGIQUE RECHERCHE · P50, VIP O2 (FR)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Lotion P50 PIGM 400',
  'https://www.biologique-recherche.com/cdn/shop/products/p50-pigm-400.jpg',
  'https://www.biologique-recherche.com/fr/lotion-p50-pigm-400',
  72.00, 'EUR',
  '["pigmentation","glow","pores"]'::jsonb,
  '{"pigmentation":0.95,"glow":0.85,"pores":0.78,"wrinkles":0.55,"hydration":0.40}'::jsonb,
  0
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50 PIGM 400');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Masque VIP O2',
  'https://www.biologique-recherche.com/cdn/shop/products/masque-vip-o2.jpg',
  'https://www.biologique-recherche.com/fr/masque-vip-o2',
  92.00, 'EUR',
  '["glow","hydration"]'::jsonb,
  '{"glow":0.93,"hydration":0.78,"redness":0.55,"pigmentation":0.50,"wrinkles":0.45}'::jsonb,
  1
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque VIP O2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Crème Dermo-RL',
  'https://www.biologique-recherche.com/cdn/shop/products/creme-dermo-rl.jpg',
  'https://www.biologique-recherche.com/fr/creme-dermo-rl',
  98.00, 'EUR',
  '["hydration","redness"]'::jsonb,
  '{"hydration":0.92,"redness":0.85,"glow":0.65,"wrinkles":0.45,"firmness":0.40}'::jsonb,
  2
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Dermo-RL');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Sérum Elastine Pure',
  'https://www.biologique-recherche.com/cdn/shop/products/serum-elastine.jpg',
  'https://www.biologique-recherche.com/fr/serum-elastine-pure',
  168.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.95,"wrinkles":0.88,"hydration":0.65,"glow":0.55,"pigmentation":0.35}'::jsonb,
  3
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Elastine Pure');

-- ============================================================================
-- AESOP · Parsley Seed, Damascan Rose (Australia)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Parsley Seed Anti-Oxidant Serum',
  'https://www.aesop.com/dw/image/parsley-seed-serum.jpg',
  'https://www.aesop.com/fr/p/skin/serums/parsley-seed-anti-oxidant-serum/',
  98.00, 'EUR',
  '["glow","pigmentation"]'::jsonb,
  '{"glow":0.85,"pigmentation":0.72,"wrinkles":0.55,"hydration":0.60,"redness":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Damascan Rose Facial Treatment',
  'https://www.aesop.com/dw/image/damascan-rose-treatment.jpg',
  'https://www.aesop.com/fr/p/skin/treatments/damascan-rose-facial-treatment/',
  142.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.90,"glow":0.82,"wrinkles":0.55,"redness":0.55,"firmness":0.45}'::jsonb,
  1
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Damascan Rose Facial Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Sublime Replenishing Night Masque',
  'https://www.aesop.com/dw/image/sublime-night-masque.jpg',
  'https://www.aesop.com/fr/p/skin/masques/sublime-replenishing-night-masque/',
  138.00, 'EUR',
  '["wrinkles","hydration"]'::jsonb,
  '{"wrinkles":0.82,"hydration":0.85,"firmness":0.70,"glow":0.70,"redness":0.50}'::jsonb,
  2
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublime Replenishing Night Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'In Two Minds Facial Cleanser',
  'https://www.aesop.com/dw/image/in-two-minds-cleanser.jpg',
  'https://www.aesop.com/fr/p/skin/cleansers/in-two-minds-facial-cleanser/',
  46.00, 'EUR',
  '["sebum","pores"]'::jsonb,
  '{"sebum":0.85,"pores":0.78,"redness":0.55,"glow":0.55,"hydration":0.45}'::jsonb,
  3
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'In Two Minds Facial Cleanser');

-- ============================================================================
-- 111SKIN · NAC Y2, Rose Gold (UK)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Y Theorem Repair Serum NAC Y2',
  'https://www.111skin.com/cdn/shop/products/y-theorem-serum.jpg',
  'https://www.111skin.com/products/y-theorem-repair-serum',
  225.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.85,"glow":0.78,"hydration":0.65,"pigmentation":0.55}'::jsonb,
  0
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Y Theorem Repair Serum NAC Y2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Rose Gold Brightening Facial Treatment Mask',
  'https://www.111skin.com/cdn/shop/products/rose-gold-mask.jpg',
  'https://www.111skin.com/products/rose-gold-brightening-facial-treatment-mask',
  130.00, 'EUR',
  '["glow","pigmentation"]'::jsonb,
  '{"glow":0.95,"pigmentation":0.85,"hydration":0.70,"wrinkles":0.45,"firmness":0.40}'::jsonb,
  1
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rose Gold Brightening Facial Treatment Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Celestial Black Diamond Cream',
  'https://www.111skin.com/cdn/shop/products/celestial-black-diamond.jpg',
  'https://www.111skin.com/products/celestial-black-diamond-cream',
  295.00, 'EUR',
  '["firmness","wrinkles"]'::jsonb,
  '{"firmness":0.92,"wrinkles":0.88,"hydration":0.75,"glow":0.65,"pigmentation":0.50}'::jsonb,
  2
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Celestial Black Diamond Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Meso Infusion Overnight Mask',
  'https://www.111skin.com/cdn/shop/products/meso-overnight-mask.jpg',
  'https://www.111skin.com/products/meso-infusion-overnight-mask',
  98.00, 'EUR',
  '["hydration","glow"]'::jsonb,
  '{"hydration":0.92,"glow":0.78,"firmness":0.60,"wrinkles":0.55,"redness":0.50}'::jsonb,
  3
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Meso Infusion Overnight Mask');

-- ============================================================================
-- TATA HARPER · Organic Vermont (US)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Rejuvenating Serum',
  'https://www.tataharperskincare.com/cdn/shop/products/rejuvenating-serum.jpg',
  'https://www.tataharperskincare.com/products/rejuvenating-serum',
  148.00, 'EUR',
  '["glow","firmness","wrinkles"]'::jsonb,
  '{"glow":0.88,"firmness":0.78,"wrinkles":0.75,"hydration":0.65,"pigmentation":0.50}'::jsonb,
  0
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rejuvenating Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Concentrated Brightening Serum',
  'https://www.tataharperskincare.com/cdn/shop/products/brightening-serum.jpg',
  'https://www.tataharperskincare.com/products/concentrated-brightening-serum',
  140.00, 'EUR',
  '["pigmentation","glow"]'::jsonb,
  '{"pigmentation":0.92,"glow":0.88,"wrinkles":0.45,"hydration":0.60,"firmness":0.40}'::jsonb,
  1
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Concentrated Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Crème Riche Anti-Aging Night Cream',
  'https://www.tataharperskincare.com/cdn/shop/products/creme-riche.jpg',
  'https://www.tataharperskincare.com/products/creme-riche',
  295.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.85,"hydration":0.80,"glow":0.60,"redness":0.50}'::jsonb,
  2
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Riche Anti-Aging Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Resurfacing Mask',
  'https://www.tataharperskincare.com/cdn/shop/products/resurfacing-mask.jpg',
  'https://www.tataharperskincare.com/products/resurfacing-mask',
  68.00, 'EUR',
  '["glow","pores","sebum"]'::jsonb,
  '{"glow":0.90,"pores":0.85,"sebum":0.72,"pigmentation":0.65,"redness":0.40}'::jsonb,
  3
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Mask');

-- ============================================================================
-- BEAUTY OF JOSEON · Rice, propolis (Korea)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Glow Serum Propolis + Niacinamide',
  'https://beautyofjoseon.com/cdn/shop/products/glow-serum.jpg',
  'https://beautyofjoseon.com/products/glow-serum-propolis-niacinamide',
  17.50, 'EUR',
  '["glow","pigmentation","sebum"]'::jsonb,
  '{"glow":0.92,"pigmentation":0.80,"sebum":0.70,"pores":0.65,"hydration":0.55}'::jsonb,
  0
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glow Serum Propolis + Niacinamide');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Relief Sun Rice + Probiotics SPF50+',
  'https://beautyofjoseon.com/cdn/shop/products/relief-sun.jpg',
  'https://beautyofjoseon.com/products/relief-sun-rice-probiotics',
  16.00, 'EUR',
  '["pigmentation","hydration"]'::jsonb,
  '{"pigmentation":0.85,"hydration":0.75,"redness":0.55,"wrinkles":0.45,"glow":0.55}'::jsonb,
  1
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Relief Sun Rice + Probiotics SPF50+');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Revive Serum Ginseng + Snail Mucin',
  'https://beautyofjoseon.com/cdn/shop/products/revive-serum.jpg',
  'https://beautyofjoseon.com/products/revive-serum-ginseng-snail-mucin',
  17.50, 'EUR',
  '["hydration","wrinkles","glow"]'::jsonb,
  '{"hydration":0.88,"wrinkles":0.75,"glow":0.78,"firmness":0.60,"redness":0.45}'::jsonb,
  2
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Revive Serum Ginseng + Snail Mucin');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Dynasty Cream',
  'https://beautyofjoseon.com/cdn/shop/products/dynasty-cream.jpg',
  'https://beautyofjoseon.com/products/dynasty-cream',
  22.00, 'EUR',
  '["wrinkles","firmness","hydration"]'::jsonb,
  '{"wrinkles":0.82,"firmness":0.75,"hydration":0.85,"glow":0.65,"redness":0.50}'::jsonb,
  3
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dynasty Cream');

-- ============================================================================
-- MEDICUBE · Zero Pore, AGE-R (Korea)
-- ============================================================================
insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Zero Pore Pad 2.0',
  'https://medicube.us/cdn/shop/products/zero-pore-pad.jpg',
  'https://medicube.us/products/zero-pore-pad',
  28.00, 'EUR',
  '["pores","sebum","glow"]'::jsonb,
  '{"pores":0.95,"sebum":0.88,"glow":0.72,"pigmentation":0.55,"hydration":0.40}'::jsonb,
  0
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Zero Pore Pad 2.0');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'AGE-R Booster Pro',
  'https://medicube.us/cdn/shop/products/age-r-booster.jpg',
  'https://medicube.us/products/age-r-booster-pro',
  295.00, 'EUR',
  '["wrinkles","firmness","glow"]'::jsonb,
  '{"wrinkles":0.92,"firmness":0.88,"glow":0.78,"hydration":0.65,"pigmentation":0.55}'::jsonb,
  1
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AGE-R Booster Pro');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Collagen Niacinamide Overnight Wrapping Mask',
  'https://medicube.us/cdn/shop/products/collagen-mask.jpg',
  'https://medicube.us/products/collagen-overnight-mask',
  35.00, 'EUR',
  '["firmness","hydration","glow"]'::jsonb,
  '{"firmness":0.85,"hydration":0.88,"glow":0.80,"wrinkles":0.65,"pigmentation":0.50}'::jsonb,
  2
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Collagen Niacinamide Overnight Wrapping Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id,
  'Red Cica Calming Cream',
  'https://medicube.us/cdn/shop/products/red-cica-cream.jpg',
  'https://medicube.us/products/red-cica-cream',
  29.00, 'EUR',
  '["redness","hydration"]'::jsonb,
  '{"redness":0.92,"hydration":0.78,"glow":0.55,"wrinkles":0.35,"firmness":0.35}'::jsonb,
  3
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Red Cica Calming Cream');

-- ============================================================================
-- VALIDATION HELPERS (run manually to verify seed integrity)
-- ============================================================================
-- select b.slug, count(p.*) as products
-- from public.brands b
-- left join public.products p on p.brand_id = b.id
-- group by b.slug
-- order by b.slug;
--
-- Expected: 27 rows, each with count = 4
-- Total products: 108
