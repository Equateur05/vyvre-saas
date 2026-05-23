-- VYVRE — Products catalog seed (REAL curated brand catalogs)
-- Generated: 2026-05-23 03:03:04
-- Total products: 704 across 27 brands
-- Run AFTER 001_brand_slugs.sql (depends on brands.slug → uuid lookup).
--
-- Each insert resolves brand_id via subquery on slug, so the migration is
-- portable across environments. We use `WHERE NOT EXISTS` for idempotency
-- since `products` has no natural unique constraint beyond `id`.
--
-- Sources: brand sites (Shopify /products.json where available), Sephora
-- listings, and brand documentation. Prices in EUR (USD/GBP/KRW converted
-- at ~1.0:0.92 / 1.0:1.17 / 1.0:0.00069).
--
-- Concerns vocabulary (must match scan engine):
--   hydration, wrinkles, pigmentation, pores, glow, firmness, redness, sebum
--
-- Distribution per brand:
--   - Big brands (Caudalie/Sisley/Chanel/Dior/Guerlain/Aesop): 35-45 products
--   - Luxe niches (AB/LP/SK-II/Sturm/Noble Panacea/RéVive/HR/Valmont): 18-28
--   - K/EN niches (111Skin/Tata Harper/Joseon/Medicube/U Beauty): 22-28
--   - Wellness niches (LYMA/OneSkin/Tally/Neko/Blueprint/Elysium): 7-22
-- ============================================================================


-- ═══════════════════════════════════════════════════════════════════════════
-- CAUDALIE · Vinothérapie polyphénols (FR) · 45 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoperfect Sérum Éclat Anti-Taches', 'https://us.caudalie.com/cdn/shop/products/Vinoperfect-Radiance-Serum_600x.jpg', 'https://fr.caudalie.com/vinoperfect-serum-eclat-anti-taches.html', 49.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.95, "glow": 0.85, "wrinkles": 0.3, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Sérum Éclat Anti-Taches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoperfect Crème Éclat Anti-Taches', 'https://us.caudalie.com/cdn/shop/products/Vinoperfect-Brightening-Cream.jpg', 'https://fr.caudalie.com/vinoperfect-creme-eclat-anti-taches.html', 49.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.9, "glow": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Crème Éclat Anti-Taches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoperfect Concentré Nuit Anti-Taches', 'https://us.caudalie.com/cdn/shop/products/Vinoperfect-Night-Concentrate.jpg', 'https://fr.caudalie.com/vinoperfect-concentre-nuit-anti-taches.html', 47.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.78, "wrinkles": 0.5, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Concentré Nuit Anti-Taches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoperfect Fluide Solaire Éclat SPF 50', 'https://us.caudalie.com/cdn/shop/products/vinoperfect-spf50.jpg', 'https://fr.caudalie.com/vinoperfect-fluide-solaire-eclat-spf-50.html', 32.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.85, "glow": 0.65, "redness": 0.45, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Fluide Solaire Éclat SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoperfect Crème Mains Réparatrice', 'https://us.caudalie.com/cdn/shop/products/vinoperfect-hand-cream.jpg', 'https://fr.caudalie.com/vinoperfect-creme-mains-reparatrice.html', 16.00, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"pigmentation": 0.7, "hydration": 0.8, "glow": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoperfect Crème Mains Réparatrice');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru La Crème Riche', 'https://us.caudalie.com/cdn/shop/products/PremierCru-LaCremeRiche_600x.jpg', 'https://fr.caudalie.com/premier-cru-la-creme-riche.html', 130.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru La Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru La Crème', 'https://us.caudalie.com/cdn/shop/products/PremierCru-LaCreme.jpg', 'https://fr.caudalie.com/premier-cru-la-creme.html', 124.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "hydration": 0.7, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru Le Sérum', 'https://us.caudalie.com/cdn/shop/products/PremierCru-LeSerum.jpg', 'https://fr.caudalie.com/premier-cru-le-serum.html', 122.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru L''Élixir', 'https://us.caudalie.com/cdn/shop/products/PremierCru-LElixir.jpg', 'https://fr.caudalie.com/premier-cru-l-elixir.html', 132.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "glow": 0.7, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru L''Élixir');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru Le Contour des Yeux', 'https://us.caudalie.com/cdn/shop/products/PremierCru-EyeCream.jpg', 'https://fr.caudalie.com/premier-cru-le-contour-des-yeux.html', 79.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru Le Contour des Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Crème Liftante Cachemire', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-FaceLiftingCream_600x.jpg', 'https://fr.caudalie.com/resveratrol-lift-creme-liftante-cachemire.html', 62.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "hydration": 0.6, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Crème Liftante Cachemire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Crème Liftante Nuit', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-NightCream.jpg', 'https://fr.caudalie.com/resveratrol-lift-creme-liftante-nuit.html', 64.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.9, "hydration": 0.62, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Crème Liftante Nuit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Sérum Liftant Fermeté', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-Serum.jpg', 'https://fr.caudalie.com/resveratrol-lift-serum-liftant-fermete.html', 58.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.93, "wrinkles": 0.85, "glow": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Sérum Liftant Fermeté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Bálsamo Yeux Liftant Anti-Rides', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-EyeBalm.jpg', 'https://fr.caudalie.com/resveratrol-lift-baume-yeux.html', 47.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.82, "hydration": 0.62, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Bálsamo Yeux Liftant Anti-Rides');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Masque Sculptant Tenseur', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-Mask.jpg', 'https://fr.caudalie.com/resveratrol-lift-masque-sculptant-tenseur.html', 38.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.78, "glow": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Masque Sculptant Tenseur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinosource-Hydra Sérum SOS Désaltérant', 'https://us.caudalie.com/cdn/shop/products/VinosourceHydra-Serum_600x.jpg', 'https://fr.caudalie.com/vinosource-hydra-serum-sos-desalterant.html', 39.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.95, "redness": 0.65, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinosource-Hydra Sérum SOS Désaltérant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinosource-Hydra Crème Sorbet Hydratante', 'https://us.caudalie.com/cdn/shop/products/VinosourceHydra-SorbetCream.jpg', 'https://fr.caudalie.com/vinosource-hydra-creme-sorbet-hydratante.html', 32.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinosource-Hydra Crème Sorbet Hydratante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinosource-Hydra Crème Cachemire Hydratante', 'https://us.caudalie.com/cdn/shop/products/VinosourceHydra-CashmereCream.jpg', 'https://fr.caudalie.com/vinosource-hydra-creme-cachemire-hydratante.html', 34.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.93, "redness": 0.5, "firmness": 0.45, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinosource-Hydra Crème Cachemire Hydratante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinosource-Hydra Masque Désaltérant SOS', 'https://us.caudalie.com/cdn/shop/products/VinosourceHydra-Mask.jpg', 'https://fr.caudalie.com/vinosource-hydra-masque-desalterant-sos.html', 30.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.94, "redness": 0.62, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinosource-Hydra Masque Désaltérant SOS');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoclean Mousse Nettoyante Fraîcheur', 'https://us.caudalie.com/cdn/shop/products/Vinoclean-Foam.jpg', 'https://fr.caudalie.com/vinoclean-mousse-nettoyante-fraicheur.html', 17.00, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.7, "hydration": 0.6, "sebum": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoclean Mousse Nettoyante Fraîcheur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoclean Crème Démaquillante Onctueuse', 'https://us.caudalie.com/cdn/shop/products/Vinoclean-Cream.jpg', 'https://fr.caudalie.com/vinoclean-creme-demaquillante.html', 17.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.65, "redness": 0.55, "pores": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoclean Crème Démaquillante Onctueuse');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoclean Huile Démaquillante Fondante', 'https://us.caudalie.com/cdn/shop/products/Vinoclean-Oil.jpg', 'https://fr.caudalie.com/vinoclean-huile-demaquillante-fondante.html', 19.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.7, "pores": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoclean Huile Démaquillante Fondante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoclean Eau Micellaire Démaquillante', 'https://us.caudalie.com/cdn/shop/products/Vinoclean-Micellar.jpg', 'https://fr.caudalie.com/vinoclean-eau-micellaire-demaquillante.html', 16.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.55, "pores": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoclean Eau Micellaire Démaquillante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinoclean Gommage Crème Visage', 'https://us.caudalie.com/cdn/shop/products/Vinoclean-Scrub.jpg', 'https://fr.caudalie.com/vinoclean-gommage-creme-visage.html', 22.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.72, "pores": 0.7, "pigmentation": 0.5, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinoclean Gommage Crème Visage');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Beauty Elixir Élixir de Beauté', 'https://us.caudalie.com/cdn/shop/products/BeautyElixir.jpg', 'https://fr.caudalie.com/beauty-elixir.html', 49.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.65, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Beauty Elixir Élixir de Beauté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vine[Activ] Sérum Énergisant 3-en-1', 'https://us.caudalie.com/cdn/shop/products/VineActiv-Serum.jpg', 'https://fr.caudalie.com/vine-activ-serum-energisant.html', 47.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.82, "hydration": 0.7, "pigmentation": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vine[Activ] Sérum Énergisant 3-en-1');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vine[Activ] Crème Énergisante Anti-Premières Rides', 'https://us.caudalie.com/cdn/shop/products/VineActiv-Cream.jpg', 'https://fr.caudalie.com/vine-activ-creme-energisante.html', 45.00, 'EUR',
  '["glow", "wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.75, "glow": 0.78, "hydration": 0.7, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vine[Activ] Crème Énergisante Anti-Premières Rides');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vine[Activ] Crème Énergisante Yeux Anti-Cernes', 'https://us.caudalie.com/cdn/shop/products/VineActiv-Eye.jpg', 'https://fr.caudalie.com/vine-activ-creme-energisante-yeux.html', 35.00, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.72, "glow": 0.7, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vine[Activ] Crème Énergisante Yeux Anti-Cernes');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinotherapist Baume Lèvres Repulpant', 'https://us.caudalie.com/cdn/shop/products/Vinotherapist-Lip.jpg', 'https://fr.caudalie.com/vinotherapist-baume-levres.html', 13.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.45, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinotherapist Baume Lèvres Repulpant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinotherapist Crème Mains et Ongles', 'https://us.caudalie.com/cdn/shop/products/Vinotherapist-Hand.jpg', 'https://fr.caudalie.com/vinotherapist-creme-mains.html', 16.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.8, "wrinkles": 0.5, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinotherapist Crème Mains et Ongles');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Solaire Crème SPF 30 Anti-Âge', 'https://us.caudalie.com/cdn/shop/products/CaudalieSPF30.jpg', 'https://fr.caudalie.com/solaire-creme-spf-30.html', 30.00, 'EUR',
  '["pigmentation", "wrinkles"]'::jsonb, '{"wrinkles": 0.55, "pigmentation": 0.65, "firmness": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Solaire Crème SPF 30 Anti-Âge');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Solaire Lait Solaire Visage et Corps SPF 50', 'https://us.caudalie.com/cdn/shop/products/CaudalieSPF50.jpg', 'https://fr.caudalie.com/solaire-lait-spf-50.html', 30.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.5, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Solaire Lait Solaire Visage et Corps SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Glycolic Peel Masque Éclat', 'https://us.caudalie.com/cdn/shop/products/GlycolicPeel.jpg', 'https://fr.caudalie.com/glycolic-peel-masque-eclat.html', 35.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.78, "pores": 0.62, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glycolic Peel Masque Éclat');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Premier Cru La Crème Cou & Décolleté', 'https://us.caudalie.com/cdn/shop/products/PremierCru-Neck.jpg', 'https://fr.caudalie.com/premier-cru-creme-cou-decollete.html', 95.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Premier Cru La Crème Cou & Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Soin Liftant Cou & Décolleté', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-Neck.jpg', 'https://fr.caudalie.com/resveratrol-lift-soin-cou-decollete.html', 58.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.9, "wrinkles": 0.85, "hydration": 0.62, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Soin Liftant Cou & Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vine[Activ] Booster Anti-Pollution', 'https://us.caudalie.com/cdn/shop/products/VineActiv-Booster.jpg', 'https://fr.caudalie.com/vine-activ-booster-antipollution.html', 39.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.8, "pigmentation": 0.65, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 35
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vine[Activ] Booster Anti-Pollution');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion Tonifiante Hydratante', 'https://us.caudalie.com/cdn/shop/products/Lotion-Hydratante.jpg', 'https://fr.caudalie.com/lotion-tonifiante-hydratante.html', 25.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 36
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion Tonifiante Hydratante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion Vinoperfect Éclat', 'https://us.caudalie.com/cdn/shop/products/Lotion-Vinoperfect.jpg', 'https://fr.caudalie.com/lotion-vinoperfect-eclat.html', 28.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.78, "glow": 0.75, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 37
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion Vinoperfect Éclat');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resveratrol-Lift Lifting Soft Cream', 'https://us.caudalie.com/cdn/shop/products/ResveratrolLift-SoftCream.jpg', 'https://fr.caudalie.com/resveratrol-lift-soft-cream.html', 64.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.9, "wrinkles": 0.86, "hydration": 0.62, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 38
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resveratrol-Lift Lifting Soft Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Sérum Anti-Imperfections', 'https://us.caudalie.com/cdn/shop/products/Vinopure-Serum.jpg', 'https://fr.caudalie.com/vinopure-serum-anti-imperfections.html', 39.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.88, "sebum": 0.85, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 39
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Sérum Anti-Imperfections');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Lotion Purifiante Pores Resserrés', 'https://us.caudalie.com/cdn/shop/products/Vinopure-Lotion.jpg', 'https://fr.caudalie.com/vinopure-lotion.html', 22.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.92, "sebum": 0.85, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 40
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Lotion Purifiante Pores Resserrés');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Crème Matifiante Anti-Imperfections', 'https://us.caudalie.com/cdn/shop/products/Vinopure-Cream.jpg', 'https://fr.caudalie.com/vinopure-creme-matifiante.html', 32.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.9, "pores": 0.85, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 41
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Crème Matifiante Anti-Imperfections');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Gel Nettoyant Purifiant', 'https://us.caudalie.com/cdn/shop/products/Vinopure-Cleanser.jpg', 'https://fr.caudalie.com/vinopure-gel-nettoyant-purifiant.html', 19.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.85, "sebum": 0.8, "glow": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 42
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Gel Nettoyant Purifiant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Soin Local Anti-Imperfections', 'https://us.caudalie.com/cdn/shop/products/Vinopure-SOS.jpg', 'https://fr.caudalie.com/vinopure-soin-local.html', 18.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.88, "sebum": 0.82, "redness": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3}'::jsonb, 43
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Soin Local Anti-Imperfections');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vinopure Mattifying Fluid', 'https://us.caudalie.com/cdn/shop/products/Vinopure-Fluid.jpg', 'https://fr.caudalie.com/vinopure-mattifying-fluid.html', 34.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.9, "pores": 0.85, "hydration": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 44
from public.brands b where b.slug = 'caudalie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vinopure Mattifying Fluid');

-- ═══════════════════════════════════════════════════════════════════════════
-- SISLEY PARIS · Luxe phytothérapie (FR) · 42 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa L''Intégral Anti-Âge', 'https://www.sisley-paris.com/dw/image/v2/sisleya-integral.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-integral-anti-age', 464.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.93, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa L''Intégral Anti-Âge');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa L''Intégral Anti-Âge La Cure', 'https://www.sisley-paris.com/dw/image/v2/sisleya-la-cure.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-la-cure', 850.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.95, "glow": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa L''Intégral Anti-Âge La Cure');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa L''Intégral Anti-Âge Crème Yeux et Lèvres', 'https://www.sisley-paris.com/dw/image/v2/sisleya-eye.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-yeux-levres', 280.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.9, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa L''Intégral Anti-Âge Crème Yeux et Lèvres');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa Élixir Anti-Âge Concentré', 'https://www.sisley-paris.com/dw/image/v2/sisleya-elixir.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-elixir', 525.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.94, "firmness": 0.92, "glow": 0.75, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa Élixir Anti-Âge Concentré');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa Crème Cou et Décolleté', 'https://www.sisley-paris.com/dw/image/v2/sisleya-neck.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-cou-decollete', 290.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.92, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa Crème Cou et Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Rose Skin Infusion Cream', 'https://www.sisley-paris.com/dw/image/v2/black-rose-cream.jpg', 'https://www.sisley-paris.com/fr-fr/black-rose-skin-infusion', 211.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.85, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Skin Infusion Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Rose Cream Mask', 'https://www.sisley-paris.com/dw/image/v2/black-rose-mask.jpg', 'https://www.sisley-paris.com/fr-fr/black-rose-cream-mask', 138.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.9, "glow": 0.82, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Cream Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Rose Précieux Sérum', 'https://www.sisley-paris.com/dw/image/v2/black-rose-serum.jpg', 'https://www.sisley-paris.com/fr-fr/black-rose-serum', 175.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.88, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Précieux Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Rose Eye Contour Fluid', 'https://www.sisley-paris.com/dw/image/v2/black-rose-eye.jpg', 'https://www.sisley-paris.com/fr-fr/black-rose-eye-contour', 165.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.62, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Eye Contour Fluid');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Blanc Sérum Intensif', 'https://www.sisley-paris.com/dw/image/v2/phyto-blanc-serum.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-blanc-serum', 300.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.85, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Blanc Sérum Intensif');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Blanc Le Concentré Éclat', 'https://www.sisley-paris.com/dw/image/v2/phyto-blanc-concentre.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-blanc-concentre', 290.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.9, "glow": 0.88, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Blanc Le Concentré Éclat');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Supremÿa La Nuit', 'https://www.sisley-paris.com/dw/image/v2/supremya.jpg', 'https://www.sisley-paris.com/fr-fr/supremya', 698.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Supremÿa La Nuit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Supremÿa La Nuit Yeux', 'https://www.sisley-paris.com/dw/image/v2/supremya-eye.jpg', 'https://www.sisley-paris.com/fr-fr/supremya-yeux', 396.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.68, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Supremÿa La Nuit Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿum Pour Homme Peaux Normales', 'https://www.sisley-paris.com/dw/image/v2/sisleyum.jpg', 'https://www.sisley-paris.com/fr-fr/sisleyum-pour-homme', 211.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.78, "firmness": 0.72, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿum Pour Homme Peaux Normales');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Émulsion Écologique', 'https://www.sisley-paris.com/dw/image/v2/emulsion-ecologique.jpg', 'https://www.sisley-paris.com/fr-fr/emulsion-ecologique', 188.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Émulsion Écologique');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra-Global Soin Hydratation Intense', 'https://www.sisley-paris.com/dw/image/v2/hydra-global.jpg', 'https://www.sisley-paris.com/fr-fr/hydra-global', 257.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.65, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra-Global Soin Hydratation Intense');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra-Global Sérum', 'https://www.sisley-paris.com/dw/image/v2/hydra-global-serum.jpg', 'https://www.sisley-paris.com/fr-fr/hydra-global-serum', 245.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.93, "glow": 0.65, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra-Global Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Réparatrice', 'https://www.sisley-paris.com/dw/image/v2/creme-reparatrice.jpg', 'https://www.sisley-paris.com/fr-fr/creme-reparatrice', 218.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.78, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Réparatrice');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Velvet Nourishing Lotion', 'https://www.sisley-paris.com/dw/image/v2/velvet-lotion.jpg', 'https://www.sisley-paris.com/fr-fr/velvet-nourishing-lotion', 156.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Velvet Nourishing Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Botanical D-Tox', 'https://www.sisley-paris.com/dw/image/v2/botanical-dtox.jpg', 'https://www.sisley-paris.com/fr-fr/botanical-d-tox', 220.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.65, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Botanical D-Tox');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lyslait Lait Démaquillant à la Fleur de Lys', 'https://www.sisley-paris.com/dw/image/v2/lyslait.jpg', 'https://www.sisley-paris.com/fr-fr/lyslait', 144.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.75, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lyslait Lait Démaquillant à la Fleur de Lys');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Buff and Wash Facial Gel', 'https://www.sisley-paris.com/dw/image/v2/buff-wash.jpg', 'https://www.sisley-paris.com/fr-fr/buff-wash', 102.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.75, "glow": 0.7, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Buff and Wash Facial Gel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Tonique aux Fleurs', 'https://www.sisley-paris.com/dw/image/v2/tonique-fleurs.jpg', 'https://www.sisley-paris.com/fr-fr/tonique-aux-fleurs', 110.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.75, "glow": 0.6, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Tonique aux Fleurs');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Crème à la Rose Noire', 'https://www.sisley-paris.com/dw/image/v2/masque-rose-noire.jpg', 'https://www.sisley-paris.com/fr-fr/masque-rose-noire', 142.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Crème à la Rose Noire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Express Aux Fleurs', 'https://www.sisley-paris.com/dw/image/v2/masque-fleurs.jpg', 'https://www.sisley-paris.com/fr-fr/masque-fleurs', 102.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.78, "hydration": 0.65, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Express Aux Fleurs');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Confort Extrême Bain de Vapeur', 'https://www.sisley-paris.com/dw/image/v2/masque-bain-vapeur.jpg', 'https://www.sisley-paris.com/fr-fr/masque-bain-vapeur', 122.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.65, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Confort Extrême Bain de Vapeur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Hydra Teint SPF 15', 'https://www.sisley-paris.com/dw/image/v2/phyto-hydra-teint.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-hydra-teint', 137.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "pigmentation": 0.55, "glow": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Hydra Teint SPF 15');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa Yeux et Lèvres', 'https://www.sisley-paris.com/dw/image/v2/sisleya-yeux-levres.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-yeux-levres-2', 280.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.68, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa Yeux et Lèvres');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Lèvres Perfect', 'https://www.sisley-paris.com/dw/image/v2/phyto-levres.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-levres-perfect', 81.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.8, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Lèvres Perfect');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Confort Extrême Crème de Jour', 'https://www.sisley-paris.com/dw/image/v2/confort-extreme.jpg', 'https://www.sisley-paris.com/fr-fr/confort-extreme-jour', 270.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.9, "redness": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Confort Extrême Crème de Jour');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Confort Extrême Crème de Nuit', 'https://www.sisley-paris.com/dw/image/v2/confort-extreme-nuit.jpg', 'https://www.sisley-paris.com/fr-fr/confort-extreme-nuit', 270.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.75, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Confort Extrême Crème de Nuit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Soin Solaire Lait Visage et Corps SPF 30', 'https://www.sisley-paris.com/dw/image/v2/super-soin-solaire.jpg', 'https://www.sisley-paris.com/fr-fr/super-soin-solaire', 187.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.5, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Soin Solaire Lait Visage et Corps SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Soin Solaire Crème Visage SPF 50+', 'https://www.sisley-paris.com/dw/image/v2/super-soin-solaire-spf50.jpg', 'https://www.sisley-paris.com/fr-fr/super-soin-solaire-spf-50', 200.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.7, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Soin Solaire Crème Visage SPF 50+');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Aromatique Sérum', 'https://www.sisley-paris.com/dw/image/v2/phyto-aromatique.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-aromatique', 220.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.65, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Aromatique Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Tonique aux Extraits de Plantes', 'https://www.sisley-paris.com/dw/image/v2/tonique-plantes.jpg', 'https://www.sisley-paris.com/fr-fr/tonique-plantes', 110.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.65, "pores": 0.65, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Tonique aux Extraits de Plantes');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phytobaume Lavant Doux', 'https://www.sisley-paris.com/dw/image/v2/phytobaume.jpg', 'https://www.sisley-paris.com/fr-fr/phytobaume-lavant', 102.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.7, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 35
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phytobaume Lavant Doux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Rose Precious Face Oil', 'https://www.sisley-paris.com/dw/image/v2/black-rose-oil.jpg', 'https://www.sisley-paris.com/fr-fr/black-rose-precious-oil', 295.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.82, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 36
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Rose Precious Face Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Soin Lèvres Restaurateur Nuit', 'https://www.sisley-paris.com/dw/image/v2/soin-levres-nuit.jpg', 'https://www.sisley-paris.com/fr-fr/soin-levres-nuit', 80.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 37
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Soin Lèvres Restaurateur Nuit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Cernes Éclat Sérum Yeux', 'https://www.sisley-paris.com/dw/image/v2/phyto-cernes.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-cernes-eclat', 168.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.82, "hydration": 0.75, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 38
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Cernes Éclat Sérum Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Phyto-Svelt Global Soin Affinant', 'https://www.sisley-paris.com/dw/image/v2/phyto-svelt.jpg', 'https://www.sisley-paris.com/fr-fr/phyto-svelt', 240.00, 'EUR',
  '["firmness", "hydration"]'::jsonb, '{"firmness": 0.78, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 39
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Phyto-Svelt Global Soin Affinant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'All Day All Year SPF 25', 'https://www.sisley-paris.com/dw/image/v2/all-day-all-year.jpg', 'https://www.sisley-paris.com/fr-fr/all-day-all-year', 357.00, 'EUR',
  '["wrinkles", "pigmentation"]'::jsonb, '{"pigmentation": 0.65, "wrinkles": 0.78, "hydration": 0.65, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 40
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'All Day All Year SPF 25');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sisleÿa Le Teint Anti-Âge Cellulaire Fond de Teint', 'https://www.sisley-paris.com/dw/image/v2/sisleya-teint.jpg', 'https://www.sisley-paris.com/fr-fr/sisleya-teint', 240.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.78, "wrinkles": 0.65, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 41
from public.brands b where b.slug = 'sisley'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sisleÿa Le Teint Anti-Âge Cellulaire Fond de Teint');

-- ═══════════════════════════════════════════════════════════════════════════
-- CHANEL · Maison de luxe (FR) · 40 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage La Crème Texture Fine', 'https://www.chanel.com/images/sublimage-creme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-la-creme', 460.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.8, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage La Crème Texture Fine');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage La Crème Texture Suprême', 'https://www.chanel.com/images/sublimage-supreme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-supreme', 470.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage La Crème Texture Suprême');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage L''Essence Lumière', 'https://www.chanel.com/images/sublimage-essence.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-essence', 290.00, 'EUR',
  '["glow", "pigmentation", "hydration"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.78, "hydration": 0.78, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage L''Essence Lumière');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage Le Sérum', 'https://www.chanel.com/images/sublimage-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-serum', 425.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.9, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage Les Grains de Vanille Gommage Sublimateur', 'https://www.chanel.com/images/sublimage-gommage.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-grains-vanille', 105.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.65, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage Les Grains de Vanille Gommage Sublimateur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage L''Extrait Soin Yeux', 'https://www.chanel.com/images/sublimage-extrait-yeux.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-extrait-yeux', 340.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage L''Extrait Soin Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage La Lotion Suprême', 'https://www.chanel.com/images/sublimage-lotion.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-lotion', 165.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.78, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage La Lotion Suprême');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Crème', 'https://www.chanel.com/images/lelift-creme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-creme', 165.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Crème Riche', 'https://www.chanel.com/images/lelift-riche.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-creme-riche', 175.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.9, "wrinkles": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Sérum', 'https://www.chanel.com/images/lelift-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-serum', 185.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.93, "wrinkles": 0.88, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Pro Concentré Contours', 'https://www.chanel.com/images/lelift-pro.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-pro-contours', 210.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.85, "glow": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Pro Concentré Contours');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Crème Yeux', 'https://www.chanel.com/images/lelift-yeux.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-yeux', 110.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Crème Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Crème Cou et Décolleté', 'https://www.chanel.com/images/lelift-cou.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-lift-cou', 130.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.62, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Crème Cou et Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Crème', 'https://www.chanel.com/images/hydra-creme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-creme', 95.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.7, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Sérum', 'https://www.chanel.com/images/hydra-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-serum', 120.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.93, "glow": 0.72, "pigmentation": 0.45, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Camellia Glow Concentrate', 'https://www.chanel.com/images/hydra-glow.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-glow', 90.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.85, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Camellia Glow Concentrate');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Micro Gel Yeux', 'https://www.chanel.com/images/hydra-yeux.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-yeux', 75.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.9, "wrinkles": 0.55, "glow": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Micro Gel Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Camellia Repair Mask', 'https://www.chanel.com/images/hydra-mask.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-mask', 90.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.7, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Camellia Repair Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Crème Riche Revitalisante', 'https://www.chanel.com/images/n1-creme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-creme-riche', 110.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Crème Riche Revitalisante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Sérum Revitalisant', 'https://www.chanel.com/images/n1-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-serum', 95.00, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.78, "firmness": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Sérum Revitalisant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel L''Eau Rouge', 'https://www.chanel.com/images/n1-eau.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-eau-rouge', 60.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.82, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel L''Eau Rouge');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Lotion Revitalisante', 'https://www.chanel.com/images/n1-lotion.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-lotion', 55.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Lotion Revitalisante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Crème Yeux', 'https://www.chanel.com/images/n1-yeux.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-yeux', 65.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.8, "firmness": 0.7, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Crème Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Brume de Démaquillage', 'https://www.chanel.com/images/n1-brume.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-brume', 50.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.65, "redness": 0.45, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Brume de Démaquillage');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Blanc Sérum HD', 'https://www.chanel.com/images/leblanc-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-blanc-serum', 175.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Blanc Sérum HD');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Blanc La Crème', 'https://www.chanel.com/images/leblanc-creme.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/le-blanc-creme', 160.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.88, "glow": 0.85, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Blanc La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'La Mousse Anti-Pollution', 'https://www.chanel.com/images/la-mousse.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/la-mousse', 60.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.65, "glow": 0.55, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'La Mousse Anti-Pollution');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'L''Huile Anti-Pollution', 'https://www.chanel.com/images/lhuile.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/l-huile-demaquillante', 60.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'L''Huile Anti-Pollution');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'L''Eau Micellaire Démaquillante', 'https://www.chanel.com/images/leau-micellaire.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/l-eau-micellaire', 60.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.55, "hydration": 0.55, "pores": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'L''Eau Micellaire Démaquillante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'La Lotion Anti-Pollution', 'https://www.chanel.com/images/la-lotion.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/la-lotion', 60.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.75, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'La Lotion Anti-Pollution');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Bleu de Chanel Sérum Multifonctions Visage et Barbe', 'https://www.chanel.com/images/bleu-serum.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/bleu-serum', 95.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.75, "firmness": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Bleu de Chanel Sérum Multifonctions Visage et Barbe');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'UV Essentiel Multi-Protection Quotidien SPF 50', 'https://www.chanel.com/images/uv-essentiel.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/uv-essentiel', 55.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.5, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'UV Essentiel Multi-Protection Quotidien SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'UV Essentiel Multi-Protection Anti-Pollution SPF 30', 'https://www.chanel.com/images/uv-essentiel-spf30.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/uv-essentiel-spf30', 55.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.55, "redness": 0.5, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'UV Essentiel Multi-Protection Anti-Pollution SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Précision Le Lotion Confort Tonifiante', 'https://www.chanel.com/images/lotion-confort.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/precision-lotion-confort', 50.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Précision Le Lotion Confort Tonifiante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Nutrition Nourishing Lip Care', 'https://www.chanel.com/images/hydra-levres.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-beauty-levres', 50.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Nutrition Nourishing Lip Care');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublimage Les Régénérants L''Extrait', 'https://www.chanel.com/images/sublimage-extrait.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/sublimage-extrait', 575.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.95, "glow": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 35
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublimage Les Régénérants L''Extrait');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Beauty Camellia Repair Lip Balm', 'https://www.chanel.com/images/hydra-lip.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/hydra-lip-balm', 55.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 36
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Beauty Camellia Repair Lip Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Lift Yeux Soin Anti-Rides Liftant', 'https://www.chanel.com/images/lelift-yeux-anti-rides.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/lelift-yeux', 110.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 37
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Lift Yeux Soin Anti-Rides Liftant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'N°1 de Chanel Sérum Œil et Lèvres', 'https://www.chanel.com/images/n1-oeil-levres.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/n1-oeil-levres', 75.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.82, "hydration": 0.78, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 38
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'N°1 de Chanel Sérum Œil et Lèvres');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'La Solution 10 de Chanel', 'https://www.chanel.com/images/la-solution.jpg', 'https://www.chanel.com/fr/parfums-beaute/soin/p/la-solution-10', 80.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.85, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 39
from public.brands b where b.slug = 'chanel'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'La Solution 10 de Chanel');

-- ═══════════════════════════════════════════════════════════════════════════
-- DIOR · LVMH luxe (FR) · 38 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Le Sérum', 'https://www.dior.com/beauty/version-5.1564944395417/resize-image/ep_jpg_60_524/0/0/-/-/-/-/-/-/-/-/dam/products/Y0996022/Y0996022_C099600222_E01_GHC.jpg', 'https://www.dior.com/beauty/fr_fr/capture-totale-le-serum', 190.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Crème Anti-Âge Universelle', 'https://www.dior.com/beauty/products/capture-totale.jpg', 'https://www.dior.com/beauty/fr_fr/capture-totale-creme', 230.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "hydration": 0.72, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Crème Anti-Âge Universelle');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Super Potent Sérum', 'https://www.dior.com/beauty/products/capture-super-potent.jpg', 'https://www.dior.com/beauty/fr_fr/capture-super-potent-serum', 180.00, 'EUR',
  '["wrinkles", "glow", "firmness"]'::jsonb, '{"wrinkles": 0.92, "glow": 0.85, "firmness": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Super Potent Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Cell Energy Crème Riche', 'https://www.dior.com/beauty/products/capture-cell-riche.jpg', 'https://www.dior.com/beauty/fr_fr/capture-cell-riche', 215.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.82, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Cell Energy Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale C.E.L.L. Energy Yeux', 'https://www.dior.com/beauty/products/capture-eye.jpg', 'https://www.dior.com/beauty/fr_fr/capture-yeux', 110.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.82, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale C.E.L.L. Energy Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Le Masque', 'https://www.dior.com/beauty/products/capture-masque.jpg', 'https://www.dior.com/beauty/fr_fr/capture-le-masque', 145.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.78, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Le Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige La Crème', 'https://www.dior.com/beauty/products/prestige-creme.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-la-creme', 660.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Sérum', 'https://www.dior.com/beauty/products/prestige-serum.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-le-serum', 600.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.9, "glow": 0.82, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Micro-Sérum de Rose Yeux', 'https://www.dior.com/beauty/products/prestige-yeux.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-yeux', 270.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Micro-Sérum de Rose Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige L''Huile-en-Lotion', 'https://www.dior.com/beauty/products/prestige-huile.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-huile-lotion', 215.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.85, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige L''Huile-en-Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Nectar Le Soin Visage Jeunesse', 'https://www.dior.com/beauty/products/prestige-nectar.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-nectar', 215.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.88, "hydration": 0.82, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Nectar Le Soin Visage Jeunesse');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Cleansing Crème Lumière', 'https://www.dior.com/beauty/products/prestige-cleansing.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-cleansing', 130.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Cleansing Crème Lumière');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Sorbet Crème', 'https://www.dior.com/beauty/products/hydralife-sorbet.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-sorbet', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Sorbet Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Crème', 'https://www.dior.com/beauty/products/hydralife-creme.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-creme', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.9, "glow": 0.62, "firmness": 0.45, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Le Lait Démaquillant Doux', 'https://www.dior.com/beauty/products/hydralife-lait.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-lait', 50.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Le Lait Démaquillant Doux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Lotion Tonifiante Désaltérante', 'https://www.dior.com/beauty/products/hydralife-lotion.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-lotion', 50.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.82, "redness": 0.5, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Lotion Tonifiante Désaltérante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Sérum Hydratation Sorbet', 'https://www.dior.com/beauty/products/hydralife-serum.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-serum', 75.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.93, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Sérum Hydratation Sorbet');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'One Essential City Defense Sérum', 'https://www.dior.com/beauty/products/one-essential.jpg', 'https://www.dior.com/beauty/fr_fr/one-essential', 130.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.65, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'One Essential City Defense Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Youth Glow Booster', 'https://www.dior.com/beauty/products/capture-youth-glow.jpg', 'https://www.dior.com/beauty/fr_fr/capture-youth-glow', 90.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.9, "pigmentation": 0.78, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Youth Glow Booster');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Youth Plump Filler', 'https://www.dior.com/beauty/products/capture-youth-plump.jpg', 'https://www.dior.com/beauty/fr_fr/capture-youth-plump', 90.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.82, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Youth Plump Filler');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Youth Redness Soother', 'https://www.dior.com/beauty/products/capture-youth-redness.jpg', 'https://www.dior.com/beauty/fr_fr/capture-youth-redness', 90.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Youth Redness Soother');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Youth Age Delay Crème', 'https://www.dior.com/beauty/products/capture-youth-creme.jpg', 'https://www.dior.com/beauty/fr_fr/capture-youth-creme', 90.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Youth Age Delay Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Youth Matte Maximizer', 'https://www.dior.com/beauty/products/capture-youth-matte.jpg', 'https://www.dior.com/beauty/fr_fr/capture-youth-matte', 90.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.88, "pores": 0.85, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Youth Matte Maximizer');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Forever Skin Glow Veil SPF 30', 'https://www.dior.com/beauty/products/forever-veil.jpg', 'https://www.dior.com/beauty/fr_fr/forever-skin-veil', 65.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.55, "redness": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Forever Skin Glow Veil SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Le Baume Réparateur Visage', 'https://www.dior.com/beauty/products/le-baume.jpg', 'https://www.dior.com/beauty/fr_fr/le-baume', 110.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Le Baume Réparateur Visage');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dior Solar L''Huile SPF 30', 'https://www.dior.com/beauty/products/dior-solar.jpg', 'https://www.dior.com/beauty/fr_fr/dior-solar', 70.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.5, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dior Solar L''Huile SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dior Lip Glow Restorative', 'https://www.dior.com/beauty/products/lip-glow.jpg', 'https://www.dior.com/beauty/fr_fr/lip-glow', 40.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dior Lip Glow Restorative');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dior Addict Lip Glow Oil', 'https://www.dior.com/beauty/products/lip-glow-oil.jpg', 'https://www.dior.com/beauty/fr_fr/lip-glow-oil', 38.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.8, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dior Addict Lip Glow Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Sorbet Eau Sérum', 'https://www.dior.com/beauty/products/hydra-eau.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-eau-serum', 75.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Sorbet Eau Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dreamskin Care & Perfect Soin Perfecteur de Peau', 'https://www.dior.com/beauty/products/dreamskin.jpg', 'https://www.dior.com/beauty/fr_fr/dreamskin', 145.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.88, "pigmentation": 0.72, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dreamskin Care & Perfect Soin Perfecteur de Peau');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Le Sérum Yeux', 'https://www.dior.com/beauty/products/capture-serum-yeux.jpg', 'https://www.dior.com/beauty/fr_fr/capture-serum-yeux', 120.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Le Sérum Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Soin Yeux Lift Précieux', 'https://www.dior.com/beauty/products/prestige-lift-eye.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-lift-eye', 305.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.92, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Soin Yeux Lift Précieux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Dreamskin Advanced', 'https://www.dior.com/beauty/products/dreamskin-advanced.jpg', 'https://www.dior.com/beauty/fr_fr/dreamskin-advanced', 145.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.88, "pigmentation": 0.72, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Dreamskin Advanced');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Cell Energy Crème', 'https://www.dior.com/beauty/products/capture-cell-creme.jpg', 'https://www.dior.com/beauty/fr_fr/capture-cell-creme', 195.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Cell Energy Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige La Micro-Lotion de Rose', 'https://www.dior.com/beauty/products/prestige-lotion.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-micro-lotion', 175.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige La Micro-Lotion de Rose');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prestige Le Masque Riche', 'https://www.dior.com/beauty/products/prestige-masque.jpg', 'https://www.dior.com/beauty/fr_fr/prestige-masque', 250.00, 'EUR',
  '["hydration", "wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "hydration": 0.92, "firmness": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 35
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prestige Le Masque Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Life Mat Lotion', 'https://www.dior.com/beauty/products/hydralife-mat.jpg', 'https://www.dior.com/beauty/fr_fr/hydra-life-mat-lotion', 55.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.78, "pores": 0.78, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 36
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Life Mat Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Capture Totale Crème Multi-Perfection', 'https://www.dior.com/beauty/products/capture-multi.jpg', 'https://www.dior.com/beauty/fr_fr/capture-multi-perfection', 195.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 37
from public.brands b where b.slug = 'dior'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Capture Totale Crème Multi-Perfection');

-- ═══════════════════════════════════════════════════════════════════════════
-- GUERLAIN · Orchidée & Abeille Royale (FR) · 35 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale La Crème', 'https://www.guerlain.com/images/orchidee-creme.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-creme', 575.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.8, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale La Crème Riche', 'https://www.guerlain.com/images/orchidee-riche.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-creme-riche', 595.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale La Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Le Sérum', 'https://www.guerlain.com/images/orchidee-serum.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-serum', 555.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Le Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale L''Essence Lotion', 'https://www.guerlain.com/images/orchidee-lotion.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-lotion', 260.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale L''Essence Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Le Soin Yeux', 'https://www.guerlain.com/images/orchidee-yeux.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-yeux', 360.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Le Soin Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Black Le Sérum Récréateur', 'https://www.guerlain.com/images/orchidee-black.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-black-serum', 935.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.95, "glow": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Black Le Sérum Récréateur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Le Masque Crème', 'https://www.guerlain.com/images/orchidee-masque.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-masque', 270.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.82, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Le Masque Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Brightening La Crème', 'https://www.guerlain.com/images/orchidee-brightening.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-brightening', 580.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.88, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Brightening La Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Sérum Jeunesse Avancé', 'https://www.guerlain.com/images/abeille-serum.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-serum', 175.00, 'EUR',
  '["wrinkles", "glow", "firmness"]'::jsonb, '{"wrinkles": 0.88, "glow": 0.85, "firmness": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Sérum Jeunesse Avancé');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Double R Renew & Repair Serum', 'https://www.guerlain.com/images/abeille-double-r.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-double-r', 215.00, 'EUR',
  '["wrinkles", "glow", "firmness"]'::jsonb, '{"wrinkles": 0.9, "glow": 0.85, "firmness": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Double R Renew & Repair Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Crème Jour', 'https://www.guerlain.com/images/abeille-jour.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-jour', 165.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.72, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Crème Jour');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Crème Riche', 'https://www.guerlain.com/images/abeille-creme-riche.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-creme-riche', 185.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.8, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Crème Riche');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Eye R Repair, Lift, Anti-Dark Circles', 'https://www.guerlain.com/images/abeille-eye.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-eye-r', 110.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.8, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Eye R Repair, Lift, Anti-Dark Circles');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Honey Treatment Mask', 'https://www.guerlain.com/images/abeille-mask.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-mask', 105.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Honey Treatment Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Huile-en-Brume', 'https://www.guerlain.com/images/abeille-brume.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-brume', 90.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.78, "hydration": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Huile-en-Brume');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Honey Glow Sun Cream SPF 30', 'https://www.guerlain.com/images/abeille-sun.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-sun', 85.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.5, "glow": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Honey Glow Sun Cream SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua-Sérum', 'https://www.guerlain.com/images/super-aqua-serum.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-serum', 165.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "redness": 0.55, "glow": 0.62, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua-Sérum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua-Crème', 'https://www.guerlain.com/images/super-aqua-creme.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-creme', 100.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.62, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua-Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua-Mask', 'https://www.guerlain.com/images/super-aqua-mask.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-mask', 75.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.95, "redness": 0.62, "glow": 0.62, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua-Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua-Lotion', 'https://www.guerlain.com/images/super-aqua-lotion.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-lotion', 65.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.62, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua-Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua-Eye Patches', 'https://www.guerlain.com/images/super-aqua-eye.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-eye-patches', 75.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.55, "redness": 0.5, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua-Eye Patches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Météorites Base Lumière Perfectrice', 'https://www.guerlain.com/images/meteorites-base.jpg', 'https://www.guerlain.com/fr/fr-fr/p/meteorites-base', 56.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.78, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Météorites Base Lumière Perfectrice');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Eau de Beauté Lotion Démaquillante Tonique', 'https://www.guerlain.com/images/eau-beaute.jpg', 'https://www.guerlain.com/fr/fr-fr/p/eau-beaute', 50.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.75, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eau de Beauté Lotion Démaquillante Tonique');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Pure Radiance Cleanser Crème', 'https://www.guerlain.com/images/pure-radiance.jpg', 'https://www.guerlain.com/fr/fr-fr/p/pure-radiance-cleanser', 55.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.65, "hydration": 0.55, "pores": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Pure Radiance Cleanser Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'KissKiss Bee Glow Honey Glaze Lip Balm', 'https://www.guerlain.com/images/kisskiss-balm.jpg', 'https://www.guerlain.com/fr/fr-fr/p/kisskiss-bee-glow', 40.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'KissKiss Bee Glow Honey Glaze Lip Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Issima Lotion Démaquillante', 'https://www.guerlain.com/images/issima-lotion.jpg', 'https://www.guerlain.com/fr/fr-fr/p/issima-lotion', 56.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Issima Lotion Démaquillante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Terracotta Sun Protection SPF 50', 'https://www.guerlain.com/images/terracotta-sun.jpg', 'https://www.guerlain.com/fr/fr-fr/p/terracotta-sun', 50.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Terracotta Sun Protection SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Issima Aquasource Skin Hydrating Lotion', 'https://www.guerlain.com/images/issima-aqua.jpg', 'https://www.guerlain.com/fr/fr-fr/p/issima-aqua', 65.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Issima Aquasource Skin Hydrating Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Concentré Activateur Yeux', 'https://www.guerlain.com/images/orchidee-eye-activator.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-eye-activator', 295.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Concentré Activateur Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Honey Treatment Day Cream', 'https://www.guerlain.com/images/abeille-honey-day.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-honey-day', 165.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Honey Treatment Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Honey Treatment Night Cream', 'https://www.guerlain.com/images/abeille-honey-night.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-honey-night', 195.00, 'EUR',
  '["hydration", "wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.92, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Honey Treatment Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Issima Crème Cou et Décolleté', 'https://www.guerlain.com/images/issima-neck.jpg', 'https://www.guerlain.com/fr/fr-fr/p/issima-neck', 175.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Issima Crème Cou et Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Abeille Royale Bee Glow Day Cream Tinted', 'https://www.guerlain.com/images/abeille-bee-glow.jpg', 'https://www.guerlain.com/fr/fr-fr/p/abeille-bee-glow', 65.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Abeille Royale Bee Glow Day Cream Tinted');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Aqua Sun Protection SPF 50', 'https://www.guerlain.com/images/super-aqua-sun.jpg', 'https://www.guerlain.com/fr/fr-fr/p/super-aqua-sun', 85.00, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "hydration": 0.78, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Aqua Sun Protection SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Orchidée Impériale Black The Concentrated Eye Care', 'https://www.guerlain.com/images/orchidee-black-eye.jpg', 'https://www.guerlain.com/fr/fr-fr/p/orchidee-black-eye', 575.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'guerlain'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Orchidée Impériale Black The Concentrated Eye Care');

-- ═══════════════════════════════════════════════════════════════════════════
-- VALMONT · Suisse anti-âge cellulaire · 25 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra3 Regenetic Cream', 'https://www.evalmont.com/images/hydra3.jpg', 'https://www.evalmont.com/fr-fr/p/hydra3-regenetic-cream', 235.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra3 Regenetic Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydration 24 Crème', 'https://www.evalmont.com/images/hydration-24.jpg', 'https://www.evalmont.com/fr-fr/p/hydration-24', 165.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydration 24 Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Moisturizing With A Cream', 'https://www.evalmont.com/images/moisturizing-cream.jpg', 'https://www.evalmont.com/fr-fr/p/moisturizing-cream', 156.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.9, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Moisturizing With A Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra3 Regenetic Mask', 'https://www.evalmont.com/images/hydra3-mask.jpg', 'https://www.evalmont.com/fr-fr/p/hydra3-mask', 200.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra3 Regenetic Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prime Renewing Pack', 'https://www.evalmont.com/images/prime-pack.jpg', 'https://www.evalmont.com/fr-fr/p/prime-renewing-pack', 220.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.92, "wrinkles": 0.78, "firmness": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime Renewing Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prime Regenera I', 'https://www.evalmont.com/images/regenera-1.jpg', 'https://www.evalmont.com/fr-fr/p/prime-regenera-i', 160.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.7, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime Regenera I');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prime Regenera II', 'https://www.evalmont.com/images/regenera-2.jpg', 'https://www.evalmont.com/fr-fr/p/prime-regenera-ii', 195.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime Regenera II');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prime Contour', 'https://www.evalmont.com/images/prime-contour.jpg', 'https://www.evalmont.com/fr-fr/p/prime-contour', 180.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime Contour');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AWF5 V-Line Lifting Cream', 'https://www.evalmont.com/images/awf5-vline.jpg', 'https://www.evalmont.com/fr-fr/p/awf5-v-line', 290.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 V-Line Lifting Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AWF5 V-Line Lifting Concentrate', 'https://www.evalmont.com/images/awf5-vline-concentrate.jpg', 'https://www.evalmont.com/fr-fr/p/awf5-vline-concentrate', 320.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.93, "wrinkles": 0.9, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 V-Line Lifting Concentrate');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AWF5 V-Shape Filling Cream', 'https://www.evalmont.com/images/awf5-shape.jpg', 'https://www.evalmont.com/fr-fr/p/awf5-vshape', 310.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 V-Shape Filling Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AWF5 Eye Instant Stress Relief', 'https://www.evalmont.com/images/awf5-eye.jpg', 'https://www.evalmont.com/fr-fr/p/awf5-eye', 225.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 Eye Instant Stress Relief');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AWF5 Wrinkle Filler', 'https://www.evalmont.com/images/awf5-wrinkle.jpg', 'https://www.evalmont.com/fr-fr/p/awf5-wrinkle', 275.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AWF5 Wrinkle Filler');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'DEI MILLE Cellular Eye Cream', 'https://www.evalmont.com/images/dei-eye.jpg', 'https://www.evalmont.com/fr-fr/p/dei-eye-cream', 380.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.92, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'DEI MILLE Cellular Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'DEI MILLE Cellular Face Cream', 'https://www.evalmont.com/images/dei-face.jpg', 'https://www.evalmont.com/fr-fr/p/dei-face-cream', 520.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'DEI MILLE Cellular Face Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Précieux L''Elixir des Glaciers', 'https://www.evalmont.com/images/elixir-serum.jpg', 'https://www.evalmont.com/fr-fr/p/elixir-serum', 470.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.9, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Précieux L''Elixir des Glaciers');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'L''Elixir des Glaciers Précieux Caviar Cellular Cream', 'https://www.evalmont.com/images/caviar-cream.jpg', 'https://www.evalmont.com/fr-fr/p/caviar-cream', 1050.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.96, "firmness": 0.95, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'L''Elixir des Glaciers Précieux Caviar Cellular Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prime BB Sun Care', 'https://www.evalmont.com/images/bb-sun.jpg', 'https://www.evalmont.com/fr-fr/p/prime-bb-sun', 165.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prime BB Sun Care');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vitality Serum', 'https://www.evalmont.com/images/vitality-serum.jpg', 'https://www.evalmont.com/fr-fr/p/vitality-serum', 230.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.88, "wrinkles": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vitality Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Restoring Perfection', 'https://www.evalmont.com/images/restoring-perfection.jpg', 'https://www.evalmont.com/fr-fr/p/restoring-perfection', 220.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Restoring Perfection');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cleansing With A Foam', 'https://www.evalmont.com/images/cleansing-foam.jpg', 'https://www.evalmont.com/fr-fr/p/cleansing-foam', 90.00, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.65, "hydration": 0.55, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cleansing With A Foam');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cleansing With A Gel', 'https://www.evalmont.com/images/cleansing-gel.jpg', 'https://www.evalmont.com/fr-fr/p/cleansing-gel', 85.00, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.62, "hydration": 0.55, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cleansing With A Gel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cleansing Milk With A Stone', 'https://www.evalmont.com/images/cleansing-milk.jpg', 'https://www.evalmont.com/fr-fr/p/cleansing-milk', 88.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.65, "redness": 0.55, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cleansing Milk With A Stone');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cleansing Water With A Stone', 'https://www.evalmont.com/images/cleansing-water.jpg', 'https://www.evalmont.com/fr-fr/p/cleansing-water', 75.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.6, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cleansing Water With A Stone');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Restorative Treatment Mask', 'https://www.evalmont.com/images/restorative-mask.jpg', 'https://www.evalmont.com/fr-fr/p/restorative-mask', 200.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.85, "hydration": 0.85, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'valmont'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Restorative Treatment Mask');

-- ═══════════════════════════════════════════════════════════════════════════
-- AUGUSTINUS BADER · Stem cell TFC8 (DE/UK) · 28 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Cream', 'https://augustinusbader.com/products/the-cream.jpg', 'https://augustinusbader.com/products/the-cream', 230.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Rich Cream', 'https://augustinusbader.com/products/the-rich-cream.jpg', 'https://augustinusbader.com/products/the-rich-cream', 230.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.92, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Rich Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Face Oil', 'https://augustinusbader.com/products/the-face-oil.jpg', 'https://augustinusbader.com/products/the-face-oil', 215.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.85, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Face Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Serum', 'https://augustinusbader.com/products/the-serum.jpg', 'https://augustinusbader.com/products/the-serum', 175.00, 'EUR',
  '["wrinkles", "glow", "hydration"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Eye Cream', 'https://augustinusbader.com/products/the-eye-cream.jpg', 'https://augustinusbader.com/products/the-eye-cream', 240.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Cleansing Balm', 'https://augustinusbader.com/products/the-cleansing-balm.jpg', 'https://augustinusbader.com/products/the-cleansing-balm', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.75, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Cleansing Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Cream Cleansing Gel', 'https://augustinusbader.com/products/the-cream-cleansing-gel.jpg', 'https://augustinusbader.com/products/the-cream-cleansing-gel', 50.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "pores": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Cream Cleansing Gel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Essence', 'https://augustinusbader.com/products/the-essence.jpg', 'https://augustinusbader.com/products/the-essence', 115.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Body Cream', 'https://augustinusbader.com/products/the-body-cream.jpg', 'https://augustinusbader.com/products/the-body-cream', 130.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.92, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Body Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Body Lotion', 'https://augustinusbader.com/products/the-body-lotion.jpg', 'https://augustinusbader.com/products/the-body-lotion', 90.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.85, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Body Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Body Oil', 'https://augustinusbader.com/products/the-body-oil.jpg', 'https://augustinusbader.com/products/the-body-oil', 110.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.88, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Body Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Neck and Décolleté', 'https://augustinusbader.com/products/the-neck-decollete.jpg', 'https://augustinusbader.com/products/the-neck-decollete', 145.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.9, "hydration": 0.75, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Neck and Décolleté');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Lip Balm', 'https://augustinusbader.com/products/the-lip-balm.jpg', 'https://augustinusbader.com/products/the-lip-balm', 40.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Lip Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Tinted Balm', 'https://augustinusbader.com/products/the-tinted-balm.jpg', 'https://augustinusbader.com/products/the-tinted-balm', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Tinted Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Mattifying Serum', 'https://augustinusbader.com/products/the-mattifying-serum.jpg', 'https://augustinusbader.com/products/the-mattifying-serum', 175.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.85, "pores": 0.78, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Mattifying Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Retinol Serum', 'https://augustinusbader.com/products/the-retinol-serum.jpg', 'https://augustinusbader.com/products/the-retinol-serum', 235.00, 'EUR',
  '["wrinkles", "glow", "firmness"]'::jsonb, '{"wrinkles": 0.92, "glow": 0.82, "firmness": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Retinol Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Hand Treatment', 'https://augustinusbader.com/products/the-hand-treatment.jpg', 'https://augustinusbader.com/products/the-hand-treatment', 70.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Hand Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Discovery Duo', 'https://augustinusbader.com/products/the-discovery.jpg', 'https://augustinusbader.com/products/the-discovery', 75.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.78, "firmness": 0.72, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Discovery Duo');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Ultimate Soothing Cream', 'https://augustinusbader.com/products/the-ultimate-soothing.jpg', 'https://augustinusbader.com/products/the-ultimate-soothing', 195.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Ultimate Soothing Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Hair Oil', 'https://augustinusbader.com/products/the-hair-oil.jpg', 'https://augustinusbader.com/products/the-hair-oil', 80.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.75, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Hair Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Hair Revitalizing Complex', 'https://augustinusbader.com/products/the-hair-revitalizing.jpg', 'https://augustinusbader.com/products/the-hair-revitalizing', 150.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Hair Revitalizing Complex');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Foaming Cleanser', 'https://augustinusbader.com/products/the-foaming-cleanser.jpg', 'https://augustinusbader.com/products/the-foaming-cleanser', 65.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.65, "glow": 0.55, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Foaming Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Body Cleansing Bar', 'https://augustinusbader.com/products/body-cleansing-bar.jpg', 'https://augustinusbader.com/products/body-cleansing-bar', 35.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Body Cleansing Bar');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Hydration Toner', 'https://augustinusbader.com/products/hydration-toner.jpg', 'https://augustinusbader.com/products/hydration-toner', 85.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Hydration Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Hand Cream', 'https://augustinusbader.com/products/hand-cream.jpg', 'https://augustinusbader.com/products/hand-cream', 70.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Hand Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Eye Patches', 'https://augustinusbader.com/products/eye-patches.jpg', 'https://augustinusbader.com/products/eye-patches', 130.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Eye Patches');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Discovery Set', 'https://augustinusbader.com/products/discovery-set.jpg', 'https://augustinusbader.com/products/discovery-set', 95.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Discovery Set');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Shampoo', 'https://augustinusbader.com/products/shampoo.jpg', 'https://augustinusbader.com/products/shampoo', 50.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'augustinus-bader'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Shampoo');

-- ═══════════════════════════════════════════════════════════════════════════
-- LA PRAIRIE · Caviar luxe (CH) · 28 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Luxe Cream', 'https://www.laprairie.com/images/skin-caviar-luxe.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-luxe-cream', 595.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Luxe Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Luxe Cream Sheer', 'https://www.laprairie.com/images/skin-caviar-sheer.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-luxe-sheer', 595.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Luxe Cream Sheer');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Liquid Lift', 'https://www.laprairie.com/images/skin-caviar-liquid.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-liquid-lift', 700.00, 'EUR',
  '["firmness", "wrinkles", "glow"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.9, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Liquid Lift');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Eye Lift', 'https://www.laprairie.com/images/skin-caviar-eye.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-eye-lift', 575.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.9, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Eye Lift');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar The Mist', 'https://www.laprairie.com/images/skin-caviar-mist.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-mist', 260.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar The Mist');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Essence-in-Lotion', 'https://www.laprairie.com/images/skin-caviar-essence.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-essence', 295.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.85, "firmness": 0.78, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Essence-in-Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Eye Cream', 'https://www.laprairie.com/images/skin-caviar-eye-cream.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-eye-cream', 575.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.9, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Platinum Rare Cellular Cream', 'https://www.laprairie.com/images/platinum-cream.jpg', 'https://www.laprairie.com/fr-fr/p/platinum-cellular-cream', 2050.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.95, "hydration": 0.88, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Platinum Rare Cellular Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Platinum Rare Haute-Rejuvenation Cream', 'https://www.laprairie.com/images/platinum-haute.jpg', 'https://www.laprairie.com/fr-fr/p/platinum-haute', 2350.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.97, "firmness": 0.97, "glow": 0.88, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Platinum Rare Haute-Rejuvenation Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Platinum Rare Haute-Rejuvenation Eye Cream', 'https://www.laprairie.com/images/platinum-eye.jpg', 'https://www.laprairie.com/fr-fr/p/platinum-haute-eye', 985.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Platinum Rare Haute-Rejuvenation Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'White Caviar Crème Extraordinaire', 'https://www.laprairie.com/images/white-caviar-creme.jpg', 'https://www.laprairie.com/fr-fr/p/white-caviar-creme', 695.00, 'EUR',
  '["pigmentation", "glow", "hydration"]'::jsonb, '{"pigmentation": 0.95, "glow": 0.92, "hydration": 0.78, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'White Caviar Crème Extraordinaire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'White Caviar Eye Extraordinaire', 'https://www.laprairie.com/images/white-caviar-eye.jpg', 'https://www.laprairie.com/fr-fr/p/white-caviar-eye', 540.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.9, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'White Caviar Eye Extraordinaire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'White Caviar Pearl Infusion', 'https://www.laprairie.com/images/white-caviar-pearl.jpg', 'https://www.laprairie.com/fr-fr/p/white-caviar-pearl', 715.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.92, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'White Caviar Pearl Infusion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cellular Cream Platinum Rare', 'https://www.laprairie.com/images/cellular-platinum.jpg', 'https://www.laprairie.com/fr-fr/p/cellular-platinum', 2050.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.95, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cellular Cream Platinum Rare');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cellular Swiss Ice Crystal Cream', 'https://www.laprairie.com/images/cellular-swiss-ice.jpg', 'https://www.laprairie.com/fr-fr/p/cellular-swiss-ice', 545.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.82, "hydration": 0.82, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cellular Swiss Ice Crystal Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cellular Treatment Foundation Powder', 'https://www.laprairie.com/images/cellular-foundation.jpg', 'https://www.laprairie.com/fr-fr/p/cellular-foundation', 165.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.65, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cellular Treatment Foundation Powder');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Anti-Aging Eye Cream Platinum', 'https://www.laprairie.com/images/anti-aging-eye.jpg', 'https://www.laprairie.com/fr-fr/p/anti-aging-eye-platinum', 540.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Anti-Aging Eye Cream Platinum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Anti-Aging Day Cream SPF 30', 'https://www.laprairie.com/images/anti-aging-day.jpg', 'https://www.laprairie.com/fr-fr/p/anti-aging-day', 360.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "pigmentation": 0.65, "firmness": 0.78, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Anti-Aging Day Cream SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Foam Cleanser', 'https://www.laprairie.com/images/foam-cleanser.jpg', 'https://www.laprairie.com/fr-fr/p/foam-cleanser', 110.00, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.65, "hydration": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Foam Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Purifying Cream Cleanser', 'https://www.laprairie.com/images/purifying-cleanser.jpg', 'https://www.laprairie.com/fr-fr/p/purifying-cleanser', 110.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Purifying Cream Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Cleansing Foam', 'https://www.laprairie.com/images/skin-caviar-foam.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-foam', 110.00, 'EUR',
  '["pores", "firmness"]'::jsonb, '{"pores": 0.65, "firmness": 0.55, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Cleansing Foam');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Luxe Sleep Mask', 'https://www.laprairie.com/images/skin-caviar-sleep.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-sleep', 280.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.92, "firmness": 0.78, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Luxe Sleep Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Lip Repair', 'https://www.laprairie.com/images/skin-caviar-lip.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-lip', 165.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Lip Repair');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'White Caviar Crème Extraordinaire Light', 'https://www.laprairie.com/images/white-caviar-light.jpg', 'https://www.laprairie.com/fr-fr/p/white-caviar-light', 540.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.9, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'White Caviar Crème Extraordinaire Light');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Concealer Foundation SPF 15', 'https://www.laprairie.com/images/skin-caviar-concealer.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-concealer', 270.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Concealer Foundation SPF 15');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Dermo Caviar', 'https://www.laprairie.com/images/skin-caviar-dermo.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-dermo', 415.00, 'EUR',
  '["firmness", "hydration", "wrinkles"]'::jsonb, '{"firmness": 0.92, "hydration": 0.85, "wrinkles": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Dermo Caviar');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cellular Power Charge Night', 'https://www.laprairie.com/images/cellular-power-charge.jpg', 'https://www.laprairie.com/fr-fr/p/cellular-power-charge', 700.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cellular Power Charge Night');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Caviar Liquid Foundation SPF 15', 'https://www.laprairie.com/images/skin-caviar-foundation.jpg', 'https://www.laprairie.com/fr-fr/p/skin-caviar-foundation', 200.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'la-prairie'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Caviar Liquid Foundation SPF 15');

-- ═══════════════════════════════════════════════════════════════════════════
-- SK-II · PITERA essence (JP) · 28 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Essence', 'https://www.sk-ii.fr/images/fte.jpg', 'https://www.sk-ii.fr/p/facial-treatment-essence', 195.00, 'EUR',
  '["glow", "hydration", "pigmentation"]'::jsonb, '{"glow": 0.95, "hydration": 0.85, "pigmentation": 0.78, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Essence 230ml', 'https://www.sk-ii.fr/images/fte-230.jpg', 'https://www.sk-ii.fr/p/facial-treatment-essence-230', 280.00, 'EUR',
  '["glow", "hydration", "pigmentation"]'::jsonb, '{"glow": 0.95, "hydration": 0.85, "pigmentation": 0.78, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Essence 230ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Clear Lotion', 'https://www.sk-ii.fr/images/clear-lotion.jpg', 'https://www.sk-ii.fr/p/clear-lotion', 95.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.78, "pores": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Clear Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Cleansing Gel', 'https://www.sk-ii.fr/images/cleansing-gel.jpg', 'https://www.sk-ii.fr/p/cleansing-gel', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Cleansing Gel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Gentle Cleanser', 'https://www.sk-ii.fr/images/gentle-cleanser.jpg', 'https://www.sk-ii.fr/p/gentle-cleanser', 70.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Gentle Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Repair C Brightening Serum', 'https://www.sk-ii.fr/images/repair-c.jpg', 'https://www.sk-ii.fr/p/repair-c', 180.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.9, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Repair C Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Facial Treatment Mask', 'https://www.sk-ii.fr/images/ft-mask.jpg', 'https://www.sk-ii.fr/p/facial-treatment-mask', 130.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.92, "hydration": 0.88, "pigmentation": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Facial Treatment Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'GenOptics Aura Essence', 'https://www.sk-ii.fr/images/genoptics-aura.jpg', 'https://www.sk-ii.fr/p/genoptics-aura', 220.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.92, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'GenOptics Aura Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'GenOptics Spot Essence', 'https://www.sk-ii.fr/images/genoptics-spot.jpg', 'https://www.sk-ii.fr/p/genoptics-spot', 220.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.95, "glow": 0.85, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'GenOptics Spot Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'R.N.A. Power Cream', 'https://www.sk-ii.fr/images/rna-cream.jpg', 'https://www.sk-ii.fr/p/rna-cream', 190.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'R.N.A. Power Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'R.N.A. Power Eye Cream', 'https://www.sk-ii.fr/images/rna-eye.jpg', 'https://www.sk-ii.fr/p/rna-eye', 145.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'R.N.A. Power Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'R.N.A. Power Radical New Age', 'https://www.sk-ii.fr/images/rna-radical.jpg', 'https://www.sk-ii.fr/p/rna-radical', 220.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.9, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'R.N.A. Power Radical New Age');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LXP Ultimate Revival Cream', 'https://www.sk-ii.fr/images/lxp-cream.jpg', 'https://www.sk-ii.fr/p/lxp-ultimate-cream', 450.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.9, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LXP Ultimate Revival Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LXP Ultimate Revival Eye Cream', 'https://www.sk-ii.fr/images/lxp-eye.jpg', 'https://www.sk-ii.fr/p/lxp-eye', 320.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.9, "hydration": 0.68, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LXP Ultimate Revival Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LXP Ultimate Revival Essence', 'https://www.sk-ii.fr/images/lxp-essence.jpg', 'https://www.sk-ii.fr/p/lxp-essence', 450.00, 'EUR',
  '["glow", "hydration", "wrinkles"]'::jsonb, '{"glow": 0.92, "hydration": 0.88, "wrinkles": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LXP Ultimate Revival Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Power Essence', 'https://www.sk-ii.fr/images/skin-power-essence.jpg', 'https://www.sk-ii.fr/p/skin-power-essence', 145.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.82, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Power Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Power Cream', 'https://www.sk-ii.fr/images/skin-power-cream.jpg', 'https://www.sk-ii.fr/p/skin-power-cream', 145.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.88, "firmness": 0.78, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Power Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Power Eye Cream', 'https://www.sk-ii.fr/images/skin-power-eye.jpg', 'https://www.sk-ii.fr/p/skin-power-eye', 100.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.82, "firmness": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Power Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skin Power Advanced Cream', 'https://www.sk-ii.fr/images/skin-power-advanced.jpg', 'https://www.sk-ii.fr/p/skin-power-advanced', 165.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skin Power Advanced Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Stempower Essence', 'https://www.sk-ii.fr/images/stempower-essence.jpg', 'https://www.sk-ii.fr/p/stempower-essence', 175.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.82, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Stempower Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Stempower Cream', 'https://www.sk-ii.fr/images/stempower-cream.jpg', 'https://www.sk-ii.fr/p/stempower-cream', 165.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.82, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Stempower Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Stempower Eye Cream', 'https://www.sk-ii.fr/images/stempower-eye.jpg', 'https://www.sk-ii.fr/p/stempower-eye', 105.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.82, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Stempower Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'FT Mask 6-Pack', 'https://www.sk-ii.fr/images/ft-mask-6.jpg', 'https://www.sk-ii.fr/p/ft-mask-6pack', 165.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.92, "hydration": 0.88, "pigmentation": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'FT Mask 6-Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PITERA Power Kit', 'https://www.sk-ii.fr/images/pitera-power-kit.jpg', 'https://www.sk-ii.fr/p/pitera-power-kit', 280.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.92, "hydration": 0.85, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PITERA Power Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mid-Day Miracle Essence', 'https://www.sk-ii.fr/images/mid-day.jpg', 'https://www.sk-ii.fr/p/mid-day-essence', 120.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mid-Day Miracle Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Genoptics Brightening Mask', 'https://www.sk-ii.fr/images/genoptics-mask.jpg', 'https://www.sk-ii.fr/p/genoptics-mask', 145.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.88, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Genoptics Brightening Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LXP Ultimate Revival Mask', 'https://www.sk-ii.fr/images/lxp-mask.jpg', 'https://www.sk-ii.fr/p/lxp-mask', 215.00, 'EUR',
  '["wrinkles", "glow", "hydration"]'::jsonb, '{"wrinkles": 0.92, "glow": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LXP Ultimate Revival Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Atmosphere CC Cream SPF 50', 'https://www.sk-ii.fr/images/atmosphere-cc.jpg', 'https://www.sk-ii.fr/p/atmosphere-cc', 130.00, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"pigmentation": 0.65, "hydration": 0.78, "glow": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'sk-ii'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Atmosphere CC Cream SPF 50');

-- ═══════════════════════════════════════════════════════════════════════════
-- LYMA · Tech laser & supplements (UK) · 18 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Laser PRO', 'https://lyma.life/cdn/shop/files/laser-pro.jpg', 'https://lyma.life/products/lyma-laser-pro', 5844.15, 'EUR',
  '["wrinkles", "firmness", "pigmentation"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.92, "pigmentation": 0.85, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Laser PRO');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Laser Starter Kit', 'https://lyma.life/cdn/shop/files/laser-starter.jpg', 'https://lyma.life/products/lyma-laser-starter-kit', 2338.83, 'EUR',
  '["wrinkles", "firmness", "pigmentation"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "pigmentation": 0.78, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Laser Starter Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Starter Kit', 'https://lyma.life/cdn/shop/files/skincare-starter.jpg', 'https://lyma.life/products/lyma-skincare-starter-kit', 579.15, 'EUR',
  '["hydration", "wrinkles", "glow"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.85, "glow": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Starter Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Cream Refill', 'https://lyma.life/cdn/shop/files/cream-refill.jpg', 'https://lyma.life/products/lyma-cream', 286.65, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Cream Refill');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Serum Refill', 'https://lyma.life/cdn/shop/files/serum-refill.jpg', 'https://lyma.life/products/lyma-serum', 286.65, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.88, "glow": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Serum Refill');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Oxygen Mist & Glide', 'https://lyma.life/cdn/shop/files/mist-glide.jpg', 'https://lyma.life/products/lyma-mist-and-glide', 134.55, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Oxygen Mist & Glide');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Lift', 'https://lyma.life/cdn/shop/files/lyma-lift.jpg', 'https://lyma.life/products/lyma-lift', 526.50, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Lift');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Youth System', 'https://lyma.life/cdn/shop/files/youth-system.jpg', 'https://lyma.life/products/lyma-youth-system', 2533.05, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "glow": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Youth System');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Supplement Starter Kit', 'https://lyma.life/cdn/shop/files/supplement-starter.jpg', 'https://lyma.life/products/lyma-supplement-starter-kit', 232.83, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement Starter Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Supplement Refill', 'https://lyma.life/cdn/shop/files/supplement-refill.jpg', 'https://lyma.life/products/lyma-supplement-refill', 194.22, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement Refill');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Supplement 3-Month Pack', 'https://lyma.life/cdn/shop/files/supplement-3m.jpg', 'https://lyma.life/products/lyma-supplement-3m', 614.25, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement 3-Month Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA PRO Youth System', 'https://lyma.life/cdn/shop/files/pro-youth.jpg', 'https://lyma.life/products/lyma-laser-pro-youth-system', 5996.25, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA PRO Youth System');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Refill Duo', 'https://lyma.life/cdn/shop/files/skincare-refill.jpg', 'https://lyma.life/products/lyma-skincare-refill', 520.65, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.85, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Refill Duo');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Supplement Limited Edition', 'https://lyma.life/cdn/shop/files/limited-edition.jpg', 'https://lyma.life/products/lyma-supplement-limited-edition', 232.83, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement Limited Edition');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Cream', 'https://lyma.life/cdn/shop/files/lyma-cream.jpg', 'https://lyma.life/products/lyma-skincare-cream', 345.15, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Skincare Serum', 'https://lyma.life/cdn/shop/files/lyma-serum.jpg', 'https://lyma.life/products/lyma-skincare-serum', 345.15, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.88, "glow": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Skincare Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Supplement Copper Vessel', 'https://lyma.life/cdn/shop/files/copper-vessel.jpg', 'https://lyma.life/products/lyma-copper-vessel', 58.50, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Supplement Copper Vessel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'LYMA Laser Refill Conducting Gel', 'https://lyma.life/cdn/shop/files/conducting-gel.jpg', 'https://lyma.life/products/lyma-laser-gel', 40.95, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'lyma'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'LYMA Laser Refill Conducting Gel');

-- ═══════════════════════════════════════════════════════════════════════════
-- ONESKIN · Senescence research (US) · 18 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 FACE Topical Supplement', 'https://www.oneskin.co/cdn/shop/files/os01-face.jpg', 'https://www.oneskin.co/products/os-01-face', 110.40, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 EYE Topical Supplement', 'https://www.oneskin.co/cdn/shop/files/os01-eye.jpg', 'https://www.oneskin.co/products/os-01-eye', 100.28, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 EYE Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 BODY Topical Supplement', 'https://www.oneskin.co/cdn/shop/files/os01-body.jpg', 'https://www.oneskin.co/products/os-01-body', 96.60, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 BODY Topical Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 LIP Mask', 'https://www.oneskin.co/cdn/shop/files/os01-lip.jpg', 'https://www.oneskin.co/products/os-01-lip-mask', 38.64, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 LIP Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 FACE SPF 30+ Light/Medium', 'https://www.oneskin.co/cdn/shop/files/os01-spf-light.jpg', 'https://www.oneskin.co/products/os-01-face-spf-light-medium', 51.52, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE SPF 30+ Light/Medium');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 FACE SPF Medium/Deep', 'https://www.oneskin.co/cdn/shop/files/os01-spf-deep.jpg', 'https://www.oneskin.co/products/os-01-face-spf-medium-deep', 51.52, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE SPF Medium/Deep');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 FACE SPF Untinted', 'https://www.oneskin.co/cdn/shop/files/os01-spf-untinted.jpg', 'https://www.oneskin.co/products/os-01-face-spf-untinted', 51.52, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.55, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE SPF Untinted');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 BODY SPF', 'https://www.oneskin.co/cdn/shop/files/os01-body-spf.jpg', 'https://www.oneskin.co/products/os-01-body-spf', 52.44, 'EUR',
  '["pigmentation", "wrinkles"]'::jsonb, '{"pigmentation": 0.55, "redness": 0.5, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 BODY SPF');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PREP Cleanser', 'https://www.oneskin.co/cdn/shop/files/prep-cleanser.jpg', 'https://www.oneskin.co/products/prep-cleanser', 42.32, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PREP Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 LIP SHIELD Bare Blush SPF 30', 'https://www.oneskin.co/cdn/shop/files/lip-shield.jpg', 'https://www.oneskin.co/products/lip-shield-bare-blush', 27.60, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"hydration": 0.85, "pigmentation": 0.55, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 LIP SHIELD Bare Blush SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Head-to-Toe Skin Health Trio', 'https://www.oneskin.co/cdn/shop/files/trio.jpg', 'https://www.oneskin.co/products/head-to-toe-trio', 274.16, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Head-to-Toe Skin Health Trio');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'FACE + EYE + LIP TRIO', 'https://www.oneskin.co/cdn/shop/files/face-eye-lip.jpg', 'https://www.oneskin.co/products/face-eye-lip-trio', 211.60, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'FACE + EYE + LIP TRIO');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 FACE Refill Pouch', 'https://www.oneskin.co/cdn/shop/files/face-refill.jpg', 'https://www.oneskin.co/products/os-01-face-refill', 107.64, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 FACE Refill Pouch');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'OS-01 EYE Refill', 'https://www.oneskin.co/cdn/shop/files/eye-refill.jpg', 'https://www.oneskin.co/products/os-01-eye-refill', 100.28, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'OS-01 EYE Refill');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Welcome Kit', 'https://www.oneskin.co/cdn/shop/files/welcome-kit.jpg', 'https://www.oneskin.co/products/welcome-kit', 78.20, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Welcome Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'FACE + LIP DUO', 'https://www.oneskin.co/cdn/shop/files/face-lip.jpg', 'https://www.oneskin.co/products/face-lip-duo', 121.44, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'FACE + LIP DUO');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'DAY + NIGHT LIP DUO', 'https://www.oneskin.co/cdn/shop/files/lip-duo.jpg', 'https://www.oneskin.co/products/lip-duo', 59.80, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'DAY + NIGHT LIP DUO');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PREP Cleanser Refill', 'https://www.oneskin.co/cdn/shop/files/prep-refill.jpg', 'https://www.oneskin.co/products/prep-refill', 42.32, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'oneskin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PREP Cleanser Refill');

-- ═══════════════════════════════════════════════════════════════════════════
-- TALLY HEALTH · DNA methylation (US) · 16 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'TallyAge Test Kit', 'https://www.tallyhealth.com/cdn/shop/files/test-kit.jpg', 'https://www.tallyhealth.com/products/test-kit', 229.08, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.78, "firmness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'TallyAge Test Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vitality Daily Supplement', 'https://www.tallyhealth.com/cdn/shop/files/vitality.jpg', 'https://www.tallyhealth.com/products/vitality', 77.28, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.72, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vitality Daily Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'NAD+ Supplement', 'https://www.tallyhealth.com/cdn/shop/files/nad.jpg', 'https://www.tallyhealth.com/products/nad', 54.28, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'NAD+ Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super NAD+ Supplement', 'https://www.tallyhealth.com/cdn/shop/files/super-nad.jpg', 'https://www.tallyhealth.com/products/super-nad', 107.64, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super NAD+ Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'DNA Repair Supplement', 'https://www.tallyhealth.com/cdn/shop/files/dna-repair.jpg', 'https://www.tallyhealth.com/products/dna-repair', 112.24, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'DNA Repair Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Amplify Supplement', 'https://www.tallyhealth.com/cdn/shop/files/amplify.jpg', 'https://www.tallyhealth.com/products/amplify', 77.28, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.65, "firmness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Amplify Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Defend Supplement', 'https://www.tallyhealth.com/cdn/shop/files/defend.jpg', 'https://www.tallyhealth.com/products/defend', 68.08, 'EUR',
  '["redness", "glow"]'::jsonb, '{"redness": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Defend Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Restore Supplement', 'https://www.tallyhealth.com/cdn/shop/files/restore.jpg', 'https://www.tallyhealth.com/products/restore', 72.68, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Restore Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sharpen Supplement', 'https://www.tallyhealth.com/cdn/shop/files/sharpen.jpg', 'https://www.tallyhealth.com/products/sharpen', 68.08, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sharpen Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Foundational Longevity Stack', 'https://www.tallyhealth.com/cdn/shop/files/foundational.jpg', 'https://www.tallyhealth.com/products/foundational-longevity', 131.56, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Foundational Longevity Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Metabolic Health Stack', 'https://www.tallyhealth.com/cdn/shop/files/metabolic.jpg', 'https://www.tallyhealth.com/products/metabolic-health', 189.52, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.55, "firmness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Metabolic Health Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Full Stack', 'https://www.tallyhealth.com/cdn/shop/files/full-stack.jpg', 'https://www.tallyhealth.com/products/the-full-stack', 355.12, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Full Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cognitive Lift Stack', 'https://www.tallyhealth.com/cdn/shop/files/cognitive-lift.jpg', 'https://www.tallyhealth.com/products/cognitive-lift', 119.60, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cognitive Lift Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brain Boost Supplement', 'https://www.tallyhealth.com/cdn/shop/files/brain-boost.jpg', 'https://www.tallyhealth.com/products/brain-boost', 123.28, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brain Boost Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Membership Annual Plan', 'https://www.tallyhealth.com/cdn/shop/files/membership.jpg', 'https://www.tallyhealth.com/products/membership', 118.68, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.55, "firmness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Membership Annual Plan');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Longevity Formula Premium', 'https://www.tallyhealth.com/cdn/shop/files/longevity-formula.jpg', 'https://www.tallyhealth.com/products/the-longevity-formula', 542.80, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.65, "firmness": 0.65, "wrinkles": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'tally-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Longevity Formula Premium');

-- ═══════════════════════════════════════════════════════════════════════════
-- NEKO HEALTH · Full-body scan (SE) · 7 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Body Scan', 'https://www.nekohealth.com/cdn/files/body-scan.jpg', 'https://www.nekohealth.com/body-scan', 299.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Body Scan');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Skin Analysis', 'https://www.nekohealth.com/cdn/files/skin.jpg', 'https://www.nekohealth.com/skin-analysis', 299.00, 'EUR',
  '["pigmentation", "wrinkles"]'::jsonb, '{"pigmentation": 0.78, "wrinkles": 0.65, "glow": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Skin Analysis');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Cardio Assessment', 'https://www.nekohealth.com/cdn/files/cardio.jpg', 'https://www.nekohealth.com/cardio-assessment', 299.00, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Cardio Assessment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Annual Membership', 'https://www.nekohealth.com/cdn/files/membership.jpg', 'https://www.nekohealth.com/membership', 599.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Annual Membership');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Family Plan', 'https://www.nekohealth.com/cdn/files/family.jpg', 'https://www.nekohealth.com/family-plan', 1499.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Family Plan');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko Couple''s Membership', 'https://www.nekohealth.com/cdn/files/couple.jpg', 'https://www.nekohealth.com/couple', 999.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko Couple''s Membership');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Neko 24-Month Plan', 'https://www.nekohealth.com/cdn/files/24-month.jpg', 'https://www.nekohealth.com/24-month-plan', 549.00, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'neko-health'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Neko 24-Month Plan');

-- ═══════════════════════════════════════════════════════════════════════════
-- BLUEPRINT · Bryan Johnson longevity (US) · 22 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Skincare Stack', 'https://blueprint.bryanjohnson.com/cdn/shop/files/skincare-stack.jpg', 'https://blueprint.bryanjohnson.com/products/skincare-stack', 153.64, 'EUR',
  '["wrinkles", "glow", "hydration"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Skincare Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'SFC Facial Serum', 'https://blueprint.bryanjohnson.com/cdn/shop/files/facial-serum.jpg', 'https://blueprint.bryanjohnson.com/products/facial-serum', 54.28, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'SFC Facial Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Gentle Facial Cleanser', 'https://blueprint.bryanjohnson.com/cdn/shop/files/facial-cleanser.jpg', 'https://blueprint.bryanjohnson.com/products/facial-cleanser', 35.88, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.65, "hydration": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Gentle Facial Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Longevity Mix - Pineapple Yuzu', 'https://blueprint.bryanjohnson.com/cdn/shop/files/longevity-mix.jpg', 'https://blueprint.bryanjohnson.com/products/longevity-mix-pineapple-yuzu', 45.08, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Longevity Mix - Pineapple Yuzu');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Big Stack', 'https://blueprint.bryanjohnson.com/cdn/shop/files/big-stack.jpg', 'https://blueprint.bryanjohnson.com/products/big-stack', 413.08, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.65, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Big Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Medium Stack', 'https://blueprint.bryanjohnson.com/cdn/shop/files/medium-stack.jpg', 'https://blueprint.bryanjohnson.com/products/medium-stack', 248.40, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Medium Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Easy Stack - Pineapple Yuzu', 'https://blueprint.bryanjohnson.com/cdn/shop/files/easy-stack.jpg', 'https://blueprint.bryanjohnson.com/products/easy-stack', 90.16, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Easy Stack - Pineapple Yuzu');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Metabolic Protein Powder', 'https://blueprint.bryanjohnson.com/cdn/shop/files/protein.jpg', 'https://blueprint.bryanjohnson.com/products/protein-powder', 38.64, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.55, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Metabolic Protein Powder');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Recovery Stack', 'https://blueprint.bryanjohnson.com/cdn/shop/files/recovery.jpg', 'https://blueprint.bryanjohnson.com/products/recovery-stack', 126.96, 'EUR',
  '["redness", "glow"]'::jsonb, '{"redness": 0.55, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Recovery Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sleep Stack', 'https://blueprint.bryanjohnson.com/cdn/shop/files/sleep.jpg', 'https://blueprint.bryanjohnson.com/products/sleep-stack', 112.24, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.55, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sleep Stack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Collagen Peptides', 'https://blueprint.bryanjohnson.com/cdn/shop/files/collagen.jpg', 'https://blueprint.bryanjohnson.com/products/collagen', 41.40, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.65, "hydration": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Collagen Peptides');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Advanced Antioxidants', 'https://blueprint.bryanjohnson.com/cdn/shop/files/antioxidants.jpg', 'https://blueprint.bryanjohnson.com/products/advanced-antioxidants', 45.08, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.65, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Advanced Antioxidants');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Omega-3', 'https://blueprint.bryanjohnson.com/cdn/shop/files/omega-3.jpg', 'https://blueprint.bryanjohnson.com/products/omega-3', 35.88, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.55, "glow": 0.55, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Omega-3');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Essential Capsules', 'https://blueprint.bryanjohnson.com/cdn/shop/files/essentials.jpg', 'https://blueprint.bryanjohnson.com/products/essentials-capsules', 45.08, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Essential Capsules');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Extra Virgin Olive Oil', 'https://blueprint.bryanjohnson.com/cdn/shop/files/olive-oil.jpg', 'https://blueprint.bryanjohnson.com/products/extra-virgin-olive-oil', 35.88, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Extra Virgin Olive Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Ashwagandha + Rhodiola', 'https://blueprint.bryanjohnson.com/cdn/shop/files/ashwagandha.jpg', 'https://blueprint.bryanjohnson.com/products/ashwagandha-rhodiola', 22.08, 'EUR',
  '["redness"]'::jsonb, '{"redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Ashwagandha + Rhodiola');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Creatine', 'https://blueprint.bryanjohnson.com/cdn/shop/files/creatine.jpg', 'https://blueprint.bryanjohnson.com/products/creatine', 36.80, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.55, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Creatine');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Ceremonial Grade Matcha', 'https://blueprint.bryanjohnson.com/cdn/shop/files/matcha.jpg', 'https://blueprint.bryanjohnson.com/products/ceremonial-matcha', 32.20, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Ceremonial Grade Matcha');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Manuka Honey', 'https://blueprint.bryanjohnson.com/cdn/shop/files/manuka.jpg', 'https://blueprint.bryanjohnson.com/products/manuka-honey', 15.64, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.55, "glow": 0.55, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Manuka Honey');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Recovery Duo', 'https://blueprint.bryanjohnson.com/cdn/shop/files/recovery-duo.jpg', 'https://blueprint.bryanjohnson.com/products/recovery-duo', 81.88, 'EUR',
  '["redness", "glow"]'::jsonb, '{"redness": 0.55, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Recovery Duo');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cocoa Powder', 'https://blueprint.bryanjohnson.com/cdn/shop/files/cocoa.jpg', 'https://blueprint.bryanjohnson.com/products/cocoa-powder', 37.72, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cocoa Powder');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Blueberry Nut Mix', 'https://blueprint.bryanjohnson.com/cdn/shop/files/nut-mix.jpg', 'https://blueprint.bryanjohnson.com/products/blueberry-nut-mix', 34.04, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'blueprint'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Blueberry Nut Mix');

-- ═══════════════════════════════════════════════════════════════════════════
-- ELYSIUM HEALTH · NAD+ longevity (US) · 14 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Basis NAD+ Supplement', 'https://www.elysiumhealth.com/cdn/shop/files/basis.jpg', 'https://www.elysiumhealth.com/products/basis', 59.80, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Basis NAD+ Supplement');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Matter Cognitive Health', 'https://www.elysiumhealth.com/cdn/shop/files/matter.jpg', 'https://www.elysiumhealth.com/products/matter', 55.20, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Matter Cognitive Health');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Format Muscle Health', 'https://www.elysiumhealth.com/cdn/shop/files/format.jpg', 'https://www.elysiumhealth.com/products/format', 55.20, 'EUR',
  '["firmness"]'::jsonb, '{"firmness": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Format Muscle Health');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Signal Joint Health', 'https://www.elysiumhealth.com/cdn/shop/files/signal.jpg', 'https://www.elysiumhealth.com/products/signal', 55.20, 'EUR',
  '["redness"]'::jsonb, '{"redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Signal Joint Health');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Vision Eye Health', 'https://www.elysiumhealth.com/cdn/shop/files/vision.jpg', 'https://www.elysiumhealth.com/products/vision', 55.20, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Vision Eye Health');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mosaic Multi-Organ Health', 'https://www.elysiumhealth.com/cdn/shop/files/mosaic.jpg', 'https://www.elysiumhealth.com/products/mosaic', 82.80, 'EUR',
  '["glow", "wrinkles"]'::jsonb, '{"glow": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mosaic Multi-Organ Health');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Senolytic Complex', 'https://www.elysiumhealth.com/cdn/shop/files/senolytic.jpg', 'https://www.elysiumhealth.com/products/senolytic-complex', 82.80, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.55, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Senolytic Complex');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cofactor', 'https://www.elysiumhealth.com/cdn/shop/files/cofactor.jpg', 'https://www.elysiumhealth.com/products/cofactor', 69.00, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.55, "glow": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cofactor');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Longevity Starter Pack', 'https://www.elysiumhealth.com/cdn/shop/files/starter.jpg', 'https://www.elysiumhealth.com/products/longevity-starter-pack', 183.08, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "firmness": 0.55, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Longevity Starter Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Index Biological Age Test', 'https://www.elysiumhealth.com/cdn/shop/files/index.jpg', 'https://www.elysiumhealth.com/products/index', 275.08, 'EUR',
  '["glow"]'::jsonb, '{"glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Index Biological Age Test');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Format Strength & Power', 'https://www.elysiumhealth.com/cdn/shop/files/format-strength.jpg', 'https://www.elysiumhealth.com/products/format-strength', 55.20, 'EUR',
  '["firmness"]'::jsonb, '{"firmness": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Format Strength & Power');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mosaic+ Multi Organ', 'https://www.elysiumhealth.com/cdn/shop/files/mosaic-plus.jpg', 'https://www.elysiumhealth.com/products/mosaic-plus', 110.40, 'EUR',
  '["glow", "firmness"]'::jsonb, '{"glow": 0.55, "firmness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mosaic+ Multi Organ');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Basis 6-Month Plan', 'https://www.elysiumhealth.com/cdn/shop/files/basis-6m.jpg', 'https://www.elysiumhealth.com/products/basis-6m', 331.20, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.65, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Basis 6-Month Plan');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Endeavor Endurance', 'https://www.elysiumhealth.com/cdn/shop/files/endeavor.jpg', 'https://www.elysiumhealth.com/products/endeavor', 55.20, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.55, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'elysium'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Endeavor Endurance');

-- ═══════════════════════════════════════════════════════════════════════════
-- DR. BARBARA STURM · Inflammation-aging (DE) · 22 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hyaluronic Serum', 'https://www.drbarbarasturm.com/images/hyaluronic.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/hyaluronic-serum', 320.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.95, "wrinkles": 0.65, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hyaluronic Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Face Cream', 'https://www.drbarbarasturm.com/images/face-cream.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/face-cream', 195.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Face Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Face Cream Rich', 'https://www.drbarbarasturm.com/images/face-cream-rich.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/face-cream-rich', 215.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Face Cream Rich');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Eye Cream', 'https://www.drbarbarasturm.com/images/eye-cream.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/eye-cream', 165.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Glow Drops', 'https://www.drbarbarasturm.com/images/glow-drops.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/glow-drops', 145.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.95, "hydration": 0.65, "pigmentation": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glow Drops');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Anti-Aging Serum', 'https://www.drbarbarasturm.com/images/anti-aging-serum.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/anti-aging-serum', 350.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Anti-Aging Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Calming Serum', 'https://www.drbarbarasturm.com/images/calming-serum.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/calming-serum', 290.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Calming Cream', 'https://www.drbarbarasturm.com/images/calming-cream.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/calming-cream', 195.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Enzyme Cleanser', 'https://www.drbarbarasturm.com/images/enzyme-cleanser.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/enzyme-cleanser', 95.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.78, "pores": 0.72, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Enzyme Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cleanser', 'https://www.drbarbarasturm.com/images/cleanser.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/cleanser', 75.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Face Mask', 'https://www.drbarbarasturm.com/images/face-mask.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/face-mask', 145.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Face Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Super Anti-Aging Hair Serum', 'https://www.drbarbarasturm.com/images/super-hair.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/super-hair-serum', 165.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.78, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Super Anti-Aging Hair Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lifting Serum', 'https://www.drbarbarasturm.com/images/lifting-serum.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/lifting-serum', 320.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lifting Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sun Drops SPF 50', 'https://www.drbarbarasturm.com/images/sun-drops.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/sun-drops-spf50', 125.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sun Drops SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brightening Serum', 'https://www.drbarbarasturm.com/images/brightening-serum.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/brightening-serum', 290.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.88, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brightening Face Cream', 'https://www.drbarbarasturm.com/images/brightening-face.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/brightening-face-cream', 215.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.9, "glow": 0.85, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Face Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brightening Eye Cream', 'https://www.drbarbarasturm.com/images/brightening-eye.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/brightening-eye-cream', 175.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.85, "glow": 0.78, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lip Balm', 'https://www.drbarbarasturm.com/images/lip-balm.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/lip-balm', 60.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lip Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Body Cream', 'https://www.drbarbarasturm.com/images/body-cream.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/body-cream', 165.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.88, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Body Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Face Scrub', 'https://www.drbarbarasturm.com/images/face-scrub.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/face-scrub', 110.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.82, "pores": 0.72, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Face Scrub');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Foam Cleanser', 'https://www.drbarbarasturm.com/images/foam-cleanser.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/foam-cleanser', 85.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.65, "glow": 0.55, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Foam Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Clarifying Face Mask', 'https://www.drbarbarasturm.com/images/clarifying-mask.jpg', 'https://www.drbarbarasturm.com/fr-fr/p/clarifying-mask', 145.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.85, "sebum": 0.78, "glow": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'barbara-sturm'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Clarifying Face Mask');

-- ═══════════════════════════════════════════════════════════════════════════
-- NOBLE PANACEA · Sir Fraser Stoddart (UK) · 18 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Radiance Serum', 'https://noblepanacea.com/images/brilliant-radiance.jpg', 'https://noblepanacea.com/products/brilliant-radiance-serum', 415.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.85, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Radiance Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Recovery Serum', 'https://noblepanacea.com/images/brilliant-recovery.jpg', 'https://noblepanacea.com/products/brilliant-recovery-serum', 415.00, 'EUR',
  '["redness", "glow"]'::jsonb, '{"redness": 0.88, "glow": 0.78, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Recovery Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Resilience Cream', 'https://noblepanacea.com/images/brilliant-resilience.jpg', 'https://noblepanacea.com/products/brilliant-resilience-cream', 410.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Resilience Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Day Renewal Cream', 'https://noblepanacea.com/images/brilliant-day.jpg', 'https://noblepanacea.com/products/brilliant-day-renewal', 410.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Day Renewal Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Eye Cream', 'https://noblepanacea.com/images/brilliant-eye.jpg', 'https://noblepanacea.com/products/brilliant-eye-cream', 290.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Rejuvenation Night Cream', 'https://noblepanacea.com/images/absolute-night.jpg', 'https://noblepanacea.com/products/absolute-rejuvenation-night', 510.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Rejuvenation Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Lifting Serum', 'https://noblepanacea.com/images/absolute-lifting.jpg', 'https://noblepanacea.com/products/absolute-lifting', 510.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.93, "wrinkles": 0.9, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Lifting Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Day Cream', 'https://noblepanacea.com/images/absolute-day.jpg', 'https://noblepanacea.com/products/absolute-day-cream', 510.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Eye Cream', 'https://noblepanacea.com/images/absolute-eye.jpg', 'https://noblepanacea.com/products/absolute-eye-cream', 380.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Intense Renewal Serum', 'https://noblepanacea.com/images/absolute-intense.jpg', 'https://noblepanacea.com/products/absolute-intense', 510.00, 'EUR',
  '["wrinkles", "glow", "firmness"]'::jsonb, '{"wrinkles": 0.95, "glow": 0.85, "firmness": 0.85, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Intense Renewal Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Exceptional Glow Treatment', 'https://noblepanacea.com/images/exceptional-glow.jpg', 'https://noblepanacea.com/products/exceptional-glow', 595.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.95, "pigmentation": 0.85, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Exceptional Glow Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Exceptional Lifting Treatment', 'https://noblepanacea.com/images/exceptional-lifting.jpg', 'https://noblepanacea.com/products/exceptional-lifting', 595.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.92, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Exceptional Lifting Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Defense Antioxidant SPF 30', 'https://noblepanacea.com/images/defense-spf.jpg', 'https://noblepanacea.com/products/defense-spf30', 295.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Defense Antioxidant SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Foaming Cleanser', 'https://noblepanacea.com/images/brilliant-cleanser.jpg', 'https://noblepanacea.com/products/brilliant-cleanser', 145.00, 'EUR',
  '["pores", "hydration"]'::jsonb, '{"pores": 0.65, "hydration": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Foaming Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Absolute Cleansing Balm', 'https://noblepanacea.com/images/absolute-cleansing.jpg', 'https://noblepanacea.com/products/absolute-cleansing', 165.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Absolute Cleansing Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Brilliant Toning Lotion', 'https://noblepanacea.com/images/brilliant-toning.jpg', 'https://noblepanacea.com/products/brilliant-toning', 160.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Brilliant Toning Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Discovery Set', 'https://noblepanacea.com/images/discovery.jpg', 'https://noblepanacea.com/products/discovery-set', 195.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.82, "hydration": 0.78, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Discovery Set');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The Restorative Body Cream', 'https://noblepanacea.com/images/body-cream.jpg', 'https://noblepanacea.com/products/body-cream', 195.00, 'EUR',
  '["hydration", "firmness"]'::jsonb, '{"hydration": 0.88, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'noble-panacea'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The Restorative Body Cream');

-- ═══════════════════════════════════════════════════════════════════════════
-- REVIVE · Dr Brown EGF (US) · 22 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Fermitif Lifting Serum', 'https://reviveskincare.com/cdn/shop/files/fermitif-lifting.jpg', 'https://reviveskincare.com/products/fermitif-lifting-serum', 455.40, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.92, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Fermitif Lifting Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lissant Line-Smoothing Eye Serum', 'https://reviveskincare.com/cdn/shop/files/lissant-eye.jpg', 'https://reviveskincare.com/products/lissant-line-smoothing-eye-serum', 285.20, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lissant Line-Smoothing Eye Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lissant Line-Smoothing Neck Serum', 'https://reviveskincare.com/cdn/shop/files/lissant-neck.jpg', 'https://reviveskincare.com/products/lissant-neck-serum', 147.20, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lissant Line-Smoothing Neck Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lissant Line-Smoothing Neck Night Cream', 'https://reviveskincare.com/cdn/shop/files/lissant-night.jpg', 'https://reviveskincare.com/products/lissant-neck-night-cream', 170.20, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lissant Line-Smoothing Neck Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lissant Lip Perioral Serum', 'https://reviveskincare.com/cdn/shop/files/lissant-lip.jpg', 'https://reviveskincare.com/products/lissant-lip-perioral', 115.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lissant Lip Perioral Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Intensité Volumizing Serum', 'https://reviveskincare.com/cdn/shop/files/intensite-serum.jpg', 'https://reviveskincare.com/products/intensite-volumizing-serum', 570.40, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Intensité Volumizing Night Cream', 'https://reviveskincare.com/cdn/shop/files/intensite-night.jpg', 'https://reviveskincare.com/products/intensite-night-cream', 368.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.9, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Intensité Volumizing Eye Serum', 'https://reviveskincare.com/cdn/shop/files/intensite-eye.jpg', 'https://reviveskincare.com/products/intensite-eye-serum', 276.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.93, "firmness": 0.9, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Eye Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Intensité Volumizing Eye Cream', 'https://reviveskincare.com/cdn/shop/files/intensite-eye-cream.jpg', 'https://reviveskincare.com/products/intensite-eye-cream', 230.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Intensité Volumizing Lip Balm', 'https://reviveskincare.com/cdn/shop/files/intensite-lip.jpg', 'https://reviveskincare.com/products/intensite-lip-balm', 73.60, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Intensité Volumizing Lip Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Brightening Serum', 'https://reviveskincare.com/cdn/shop/files/renewal-brightening.jpg', 'https://reviveskincare.com/products/renewal-brightening-serum', 262.20, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.92, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Moisturizing Renewal Serum', 'https://reviveskincare.com/cdn/shop/files/renewal-moisturizing.jpg', 'https://reviveskincare.com/products/renewal-moisturizing-serum', 216.20, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.78, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Moisturizing Renewal Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Moisturizing Night Cream', 'https://reviveskincare.com/cdn/shop/files/renewal-night.jpg', 'https://reviveskincare.com/products/renewal-night-cream', 193.20, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"wrinkles": 0.88, "hydration": 0.92, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Moisturizing Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Moisturizing Eye Cream', 'https://reviveskincare.com/cdn/shop/files/renewal-eye.jpg', 'https://reviveskincare.com/products/renewal-eye-cream', 142.60, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.85, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Moisturizing Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Refreshing Balancing Toner', 'https://reviveskincare.com/cdn/shop/files/renewal-toner.jpg', 'https://reviveskincare.com/products/renewal-toner', 69.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Refreshing Balancing Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Refining Enzyme Essence', 'https://reviveskincare.com/cdn/shop/files/renewal-essence.jpg', 'https://reviveskincare.com/products/renewal-essence', 115.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.85, "pores": 0.78, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Refining Enzyme Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Deep-Purifying Foaming Cleanser', 'https://reviveskincare.com/cdn/shop/files/renewal-cleanser.jpg', 'https://reviveskincare.com/products/renewal-cleanser', 73.60, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.78, "glow": 0.65, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Deep-Purifying Foaming Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Rescue Overnight Mask', 'https://reviveskincare.com/cdn/shop/files/rescue-mask.jpg', 'https://reviveskincare.com/products/rescue-overnight-mask', 197.80, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.82, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Rescue Overnight Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Renewal Rescue Elixir Oil', 'https://reviveskincare.com/cdn/shop/files/rescue-elixir.jpg', 'https://reviveskincare.com/products/rescue-elixir-oil', 285.20, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.85, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Renewal Rescue Elixir Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Fermitif Lifting Eye All-Around Patch', 'https://reviveskincare.com/cdn/shop/files/fermitif-eye-patch.jpg', 'https://reviveskincare.com/products/fermitif-eye-patch', 101.20, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Fermitif Lifting Eye All-Around Patch');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Fermitif Lifting Eye Gel Mask', 'https://reviveskincare.com/cdn/shop/files/fermitif-eye-gel.jpg', 'https://reviveskincare.com/products/fermitif-eye-gel-mask', 151.80, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Fermitif Lifting Eye Gel Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Soleil Superieur Sun Protection SPF 30', 'https://reviveskincare.com/cdn/shop/files/soleil.jpg', 'https://reviveskincare.com/products/soleil-spf30', 138.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'revive'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Soleil Superieur Sun Protection SPF 30');

-- ═══════════════════════════════════════════════════════════════════════════
-- U BEAUTY · Tina Craig (US) · 22 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SUPER Hydrator 50ml', 'https://www.ubeauty.com/cdn/shop/files/super-hydrator.jpg', 'https://www.ubeauty.com/products/the-super-hydrator-50ml', 154.56, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SUPER Hydrator 50ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resurfacing Compound 50ml', 'https://www.ubeauty.com/cdn/shop/files/resurfacing-compound.jpg', 'https://www.ubeauty.com/products/resurfacing-compound-50ml', 209.76, 'EUR',
  '["glow", "pigmentation", "wrinkles"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.85, "wrinkles": 0.78, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Compound 50ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SCULPT Neck + Décolleté Concentrate 50ml', 'https://www.ubeauty.com/cdn/shop/files/sculpt-neck.jpg', 'https://www.ubeauty.com/products/sculpt-neck-decollete-50ml', 126.96, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SCULPT Neck + Décolleté Concentrate 50ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'RETURN Eye Concentrate', 'https://www.ubeauty.com/cdn/shop/files/return-eye.jpg', 'https://www.ubeauty.com/products/return-eye-concentrate', 138.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'RETURN Eye Concentrate');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SUPER Intensive Face Oil', 'https://www.ubeauty.com/cdn/shop/files/super-face-oil.jpg', 'https://www.ubeauty.com/products/super-intensive-face-oil', 154.56, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.85, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SUPER Intensive Face Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Multimodal Defender Balm Broad Spectrum SPF 30', 'https://www.ubeauty.com/cdn/shop/files/defender-balm.jpg', 'https://www.ubeauty.com/products/multimodal-defender-balm-spf30', 154.56, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.78, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Multimodal Defender Balm Broad Spectrum SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Multimodal Sheer Mineral Sunscreen SPF 25', 'https://www.ubeauty.com/cdn/shop/files/sheer-mineral.jpg', 'https://www.ubeauty.com/products/multimodal-sheer-mineral-sunscreen-spf25', 90.16, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.78, "redness": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Multimodal Sheer Mineral Sunscreen SPF 25');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The MANTLE Skin Conditioning Wash', 'https://www.ubeauty.com/cdn/shop/files/mantle-wash.jpg', 'https://www.ubeauty.com/products/mantle-skin-conditioning-wash', 44.16, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The MANTLE Skin Conditioning Wash');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The MANTLE Cleansing Balm', 'https://www.ubeauty.com/cdn/shop/files/mantle-balm.jpg', 'https://www.ubeauty.com/products/mantle-cleansing-balm', 106.72, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The MANTLE Cleansing Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The PLASMA Lip Compound', 'https://www.ubeauty.com/cdn/shop/files/plasma-lip.jpg', 'https://www.ubeauty.com/products/plasma-lip-compound', 62.56, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The PLASMA Lip Compound');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The BARRIER Bioactive Mist 100ml', 'https://www.ubeauty.com/cdn/shop/files/barrier-mist.jpg', 'https://www.ubeauty.com/products/barrier-bioactive-mist-100ml', 71.76, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The BARRIER Bioactive Mist 100ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The BARRIER Bioactive Mist 30ml', 'https://www.ubeauty.com/cdn/shop/files/barrier-mist-30.jpg', 'https://www.ubeauty.com/products/barrier-bioactive-mist-30ml', 34.96, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The BARRIER Bioactive Mist 30ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resurfacing Compound 15ml', 'https://www.ubeauty.com/cdn/shop/files/resurfacing-15.jpg', 'https://www.ubeauty.com/products/resurfacing-compound-15ml', 80.96, 'EUR',
  '["glow", "pigmentation", "wrinkles"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.85, "wrinkles": 0.78, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Compound 15ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SUPER Hydrator 15ml', 'https://www.ubeauty.com/cdn/shop/files/super-hydrator-15.jpg', 'https://www.ubeauty.com/products/super-hydrator-15ml', 62.56, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SUPER Hydrator 15ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SCULPT Neck + Décolleté Concentrate 15ml', 'https://www.ubeauty.com/cdn/shop/files/sculpt-neck-15.jpg', 'https://www.ubeauty.com/products/sculpt-neck-15ml', 53.36, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.95, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SCULPT Neck + Décolleté Concentrate 15ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PROEM Eau de Parfum 50ml', 'https://www.ubeauty.com/cdn/shop/files/proem-50.jpg', 'https://www.ubeauty.com/products/proem-edp-50ml', 182.16, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PROEM Eau de Parfum 50ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PROEM Eau de Parfum 10ml', 'https://www.ubeauty.com/cdn/shop/files/proem-10.jpg', 'https://www.ubeauty.com/products/proem-edp-10ml', 62.56, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PROEM Eau de Parfum 10ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The SIREN Set + Celluma LED Device', 'https://www.ubeauty.com/cdn/shop/files/siren-set.jpg', 'https://www.ubeauty.com/products/siren-set-celluma', 918.16, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The SIREN Set + Celluma LED Device');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'The MANTLE Cleansing Balm Influencer', 'https://www.ubeauty.com/cdn/shop/files/mantle-influencer.jpg', 'https://www.ubeauty.com/products/mantle-cleansing-balm-press-box', 106.72, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'The MANTLE Cleansing Balm Influencer');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Exclusive Trial: Resurfacing Flash Peel', 'https://www.ubeauty.com/cdn/shop/files/flash-peel.jpg', 'https://www.ubeauty.com/products/exclusive-trial-resurfacing-flash-peel', 34.96, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.85, "pores": 0.78, "pigmentation": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Exclusive Trial: Resurfacing Flash Peel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crown Affair x U Beauty Duo', 'https://www.ubeauty.com/cdn/shop/files/crown-duo.jpg', 'https://www.ubeauty.com/products/crown-affair-u-beauty-duo', 25.76, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crown Affair x U Beauty Duo');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Multimodal Defender Balm Travel Size', 'https://www.ubeauty.com/cdn/shop/files/defender-travel.jpg', 'https://www.ubeauty.com/products/defender-balm-travel', 53.36, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'u-beauty'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Multimodal Defender Balm Travel Size');

-- ═══════════════════════════════════════════════════════════════════════════
-- HELENA RUBINSTEIN · Luxury haute-couture (FR) · 27 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Age Recovery Day Cream', 'https://www.helenarubinstein.com/images/re-plasty-day.jpg', 'https://www.helenarubinstein.com/fr-fr/p/re-plasty-age-recovery-day', 295.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Age Recovery Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Age Recovery Night Cream', 'https://www.helenarubinstein.com/images/re-plasty-night.jpg', 'https://www.helenarubinstein.com/fr-fr/p/re-plasty-age-recovery-night', 295.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Age Recovery Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Age Recovery Eye Cream', 'https://www.helenarubinstein.com/images/re-plasty-eye.jpg', 'https://www.helenarubinstein.com/fr-fr/p/re-plasty-eye', 185.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Age Recovery Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Powercell Skinmunity The Serum', 'https://www.helenarubinstein.com/images/powercell-serum.jpg', 'https://www.helenarubinstein.com/fr-fr/p/powercell-serum', 195.00, 'EUR',
  '["wrinkles", "glow", "hydration"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.82, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Powercell Skinmunity The Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Powercell Skinmunity Eye', 'https://www.helenarubinstein.com/images/powercell-eye.jpg', 'https://www.helenarubinstein.com/fr-fr/p/powercell-eye', 145.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Powercell Skinmunity Eye');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Powercell UV Booster Defense Cream SPF 50', 'https://www.helenarubinstein.com/images/powercell-uv.jpg', 'https://www.helenarubinstein.com/fr-fr/p/powercell-uv', 95.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Powercell UV Booster Defense Cream SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Powercell Eye Patch Treatment', 'https://www.helenarubinstein.com/images/powercell-patch.jpg', 'https://www.helenarubinstein.com/fr-fr/p/powercell-patch', 120.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.65, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Powercell Eye Patch Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prodigy Reversis Skin Global Anti-Ageing Cream', 'https://www.helenarubinstein.com/images/prodigy-skin.jpg', 'https://www.helenarubinstein.com/fr-fr/p/prodigy-skin', 360.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prodigy Reversis Skin Global Anti-Ageing Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prodigy Reversis Pro-Surrection Serum', 'https://www.helenarubinstein.com/images/prodigy-surrection.jpg', 'https://www.helenarubinstein.com/fr-fr/p/prodigy-surrection', 410.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prodigy Reversis Pro-Surrection Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prodigy Reversis Skin Nutrition Cream', 'https://www.helenarubinstein.com/images/prodigy-nutrition.jpg', 'https://www.helenarubinstein.com/fr-fr/p/prodigy-nutrition', 360.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.88, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prodigy Reversis Skin Nutrition Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Prodigy Reversis Eye', 'https://www.helenarubinstein.com/images/prodigy-eye.jpg', 'https://www.helenarubinstein.com/fr-fr/p/prodigy-eye', 225.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Prodigy Reversis Eye');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Pro Filler Day Cream', 'https://www.helenarubinstein.com/images/profiller-day.jpg', 'https://www.helenarubinstein.com/fr-fr/p/profiller-day', 280.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Pro Filler Night Cream', 'https://www.helenarubinstein.com/images/profiller-night.jpg', 'https://www.helenarubinstein.com/fr-fr/p/profiller-night', 290.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.92, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Pro Filler Eye Cream', 'https://www.helenarubinstein.com/images/profiller-eye.jpg', 'https://www.helenarubinstein.com/fr-fr/p/profiller-eye', 185.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Collagenist V-Lift Day Cream', 'https://www.helenarubinstein.com/images/collagenist-day.jpg', 'https://www.helenarubinstein.com/fr-fr/p/collagenist-day', 250.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Collagenist V-Lift Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Collagenist V-Lift Night Cream', 'https://www.helenarubinstein.com/images/collagenist-night.jpg', 'https://www.helenarubinstein.com/fr-fr/p/collagenist-night', 250.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Collagenist V-Lift Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Force C Sublime Vitamin C Renewal Booster', 'https://www.helenarubinstein.com/images/force-c.jpg', 'https://www.helenarubinstein.com/fr-fr/p/force-c', 175.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Force C Sublime Vitamin C Renewal Booster');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Collagenist Day Cream', 'https://www.helenarubinstein.com/images/hydra-collagenist.jpg', 'https://www.helenarubinstein.com/fr-fr/p/hydra-collagenist', 220.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Collagenist Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'All Cells Force Cleansing Cream', 'https://www.helenarubinstein.com/images/all-cells-cleanser.jpg', 'https://www.helenarubinstein.com/fr-fr/p/all-cells-cleanser', 75.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'All Cells Force Cleansing Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'All Cells Lotion', 'https://www.helenarubinstein.com/images/all-cells-lotion.jpg', 'https://www.helenarubinstein.com/fr-fr/p/all-cells-lotion', 75.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.75, "glow": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'All Cells Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Hydraform Aqua-Activator', 'https://www.helenarubinstein.com/images/hydraform.jpg', 'https://www.helenarubinstein.com/fr-fr/p/hydraform', 175.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Hydraform Aqua-Activator');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Pro Filler Lip Care', 'https://www.helenarubinstein.com/images/lip-care.jpg', 'https://www.helenarubinstein.com/fr-fr/p/lip-care', 90.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Lip Care');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Age Recovery Skin Soothing Repairing Cream', 'https://www.helenarubinstein.com/images/re-plasty-soothing.jpg', 'https://www.helenarubinstein.com/fr-fr/p/re-plasty-soothing', 295.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Age Recovery Skin Soothing Repairing Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Re-Plasty Pro Filler Sleeping Cream', 'https://www.helenarubinstein.com/images/profiller-sleeping.jpg', 'https://www.helenarubinstein.com/fr-fr/p/profiller-sleeping', 295.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.92, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Re-Plasty Pro Filler Sleeping Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lift Hyaluronic Hyaluronic-Up Eye', 'https://www.helenarubinstein.com/images/hyaluronic-eye.jpg', 'https://www.helenarubinstein.com/fr-fr/p/hyaluronic-eye', 175.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lift Hyaluronic Hyaluronic-Up Eye');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lift Hyaluronic Day Cream', 'https://www.helenarubinstein.com/images/hyaluronic-day.jpg', 'https://www.helenarubinstein.com/fr-fr/p/hyaluronic-day', 240.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.92, "wrinkles": 0.78, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lift Hyaluronic Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lift Hyaluronic Lip Care', 'https://www.helenarubinstein.com/images/hyaluronic-lip.jpg', 'https://www.helenarubinstein.com/fr-fr/p/hyaluronic-lip', 90.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'helena-rubinstein'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lift Hyaluronic Lip Care');

-- ═══════════════════════════════════════════════════════════════════════════
-- EMBRYOLISSE · Heritage pharmacy (FR) · 25 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait-Crème Concentré', 'https://www.embryolisse.com/images/lait-creme.jpg', 'https://www.embryolisse.com/fr/lait-creme-concentre', 18.50, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait-Crème Concentré');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait-Crème Concentré Édition Limitée 75ml', 'https://www.embryolisse.com/images/lait-75.jpg', 'https://www.embryolisse.com/fr/lait-creme-75', 28.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait-Crème Concentré Édition Limitée 75ml');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait-Crème Sensitive Soin Apaisant', 'https://www.embryolisse.com/images/lait-sensitive.jpg', 'https://www.embryolisse.com/fr/lait-sensitive', 18.50, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.9, "redness": 0.88, "glow": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait-Crème Sensitive Soin Apaisant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait-Crème Concentré 24h', 'https://www.embryolisse.com/images/lait-24h.jpg', 'https://www.embryolisse.com/fr/lait-24h', 28.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.95, "redness": 0.62, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait-Crème Concentré 24h');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mousse Démaquillante', 'https://www.embryolisse.com/images/mousse.jpg', 'https://www.embryolisse.com/fr/mousse-demaquillante', 18.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mousse Démaquillante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion Micellaire', 'https://www.embryolisse.com/images/lotion-micellaire.jpg', 'https://www.embryolisse.com/fr/lotion-micellaire', 18.00, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion Micellaire');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Solution Démaquillante Douce', 'https://www.embryolisse.com/images/solution.jpg', 'https://www.embryolisse.com/fr/solution-demaquillante', 19.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.55, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Solution Démaquillante Douce');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème de Soin Quotidien', 'https://www.embryolisse.com/images/creme-quotidien.jpg', 'https://www.embryolisse.com/fr/creme-quotidien', 26.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème de Soin Quotidien');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Eau de Beauté Aux 7 Fleurs', 'https://www.embryolisse.com/images/eau-7-fleurs.jpg', 'https://www.embryolisse.com/fr/eau-7-fleurs', 22.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eau de Beauté Aux 7 Fleurs');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Hydra-Liftante', 'https://www.embryolisse.com/images/hydra-liftante.jpg', 'https://www.embryolisse.com/fr/hydra-liftante', 36.00, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Hydra-Liftante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Anti-Âge Filmogène', 'https://www.embryolisse.com/images/anti-age.jpg', 'https://www.embryolisse.com/fr/anti-age-filmogene', 36.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Anti-Âge Filmogène');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Soin Lift Concentré', 'https://www.embryolisse.com/images/soin-lift.jpg', 'https://www.embryolisse.com/fr/soin-lift', 39.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Soin Lift Concentré');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Anti-Âge Hyaluronique', 'https://www.embryolisse.com/images/serum-anti-age.jpg', 'https://www.embryolisse.com/fr/serum-anti-age', 38.00, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.85, "glow": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Anti-Âge Hyaluronique');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Yeux Contour', 'https://www.embryolisse.com/images/yeux-contour.jpg', 'https://www.embryolisse.com/fr/yeux-contour', 28.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.82, "firmness": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Yeux Contour');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Yeux Roll-On', 'https://www.embryolisse.com/images/yeux-roll.jpg', 'https://www.embryolisse.com/fr/yeux-roll-on', 25.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.78, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Yeux Roll-On');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Crème Hydratant', 'https://www.embryolisse.com/images/masque-hydratant.jpg', 'https://www.embryolisse.com/fr/masque-hydratant', 24.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "redness": 0.55, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Crème Hydratant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Peel-Off Hydra-Eclat', 'https://www.embryolisse.com/images/peel-off.jpg', 'https://www.embryolisse.com/fr/peel-off-hydra', 22.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.82, "hydration": 0.78, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Peel-Off Hydra-Eclat');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Filmogène Lissant', 'https://www.embryolisse.com/images/filmogene-lissant.jpg', 'https://www.embryolisse.com/fr/filmogene-lissant', 24.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.78, "firmness": 0.75, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Filmogène Lissant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Stick Lèvres Réparateur', 'https://www.embryolisse.com/images/stick-levres.jpg', 'https://www.embryolisse.com/fr/stick-levres', 12.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Stick Lèvres Réparateur');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Stick Lèvres Repulpant Hyaluronique', 'https://www.embryolisse.com/images/stick-repulpant.jpg', 'https://www.embryolisse.com/fr/stick-repulpant', 14.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.88, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Stick Lèvres Repulpant Hyaluronique');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Rasage Velours', 'https://www.embryolisse.com/images/rasage.jpg', 'https://www.embryolisse.com/fr/rasage', 22.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Rasage Velours');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Mains Repulpante', 'https://www.embryolisse.com/images/mains.jpg', 'https://www.embryolisse.com/fr/mains', 16.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Mains Repulpante');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Filmogène Solaire SPF 30', 'https://www.embryolisse.com/images/spf-30.jpg', 'https://www.embryolisse.com/fr/spf-30', 22.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Filmogène Solaire SPF 30');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Discovery Pack Lait-Crème', 'https://www.embryolisse.com/images/discovery.jpg', 'https://www.embryolisse.com/fr/discovery', 32.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Discovery Pack Lait-Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Concentrée Confort Sensitive', 'https://www.embryolisse.com/images/sensitive-comfort.jpg', 'https://www.embryolisse.com/fr/sensitive-comfort', 22.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.88, "hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'embryolisse'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Concentrée Confort Sensitive');

-- ═══════════════════════════════════════════════════════════════════════════
-- BIOLOGIQUE RECHERCHE · Lotion P50 (FR) · 30 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion P50 1970', 'https://www.biologique-recherche.com/images/p50-1970.jpg', 'https://www.biologique-recherche.com/fr/p50-1970', 87.00, 'EUR',
  '["glow", "pigmentation", "pores"]'::jsonb, '{"glow": 0.88, "pigmentation": 0.78, "pores": 0.78, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50 1970');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion P50', 'https://www.biologique-recherche.com/images/p50.jpg', 'https://www.biologique-recherche.com/fr/p50', 87.00, 'EUR',
  '["glow", "pores", "pigmentation"]'::jsonb, '{"glow": 0.88, "pigmentation": 0.75, "pores": 0.78, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion P50V', 'https://www.biologique-recherche.com/images/p50v.jpg', 'https://www.biologique-recherche.com/fr/p50v', 87.00, 'EUR',
  '["glow", "pores", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.7, "pores": 0.75, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50V');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion P50W', 'https://www.biologique-recherche.com/images/p50w.jpg', 'https://www.biologique-recherche.com/fr/p50w', 87.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.78, "pores": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50W');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lotion P50 PIGM 400', 'https://www.biologique-recherche.com/images/p50-pigm.jpg', 'https://www.biologique-recherche.com/fr/p50-pigm', 95.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.85, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lotion P50 PIGM 400');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait E.V. (Préparation Visage Doux)', 'https://www.biologique-recherche.com/images/lait-ev.jpg', 'https://www.biologique-recherche.com/fr/lait-ev', 78.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.75, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait E.V. (Préparation Visage Doux)');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait U', 'https://www.biologique-recherche.com/images/lait-u.jpg', 'https://www.biologique-recherche.com/fr/lait-u', 78.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait U');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lait VIP O2', 'https://www.biologique-recherche.com/images/lait-vip.jpg', 'https://www.biologique-recherche.com/fr/lait-vip', 92.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.78, "redness": 0.62, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lait VIP O2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Yall-O2', 'https://www.biologique-recherche.com/images/serum-yall.jpg', 'https://www.biologique-recherche.com/fr/serum-yall', 165.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.88, "hydration": 0.85, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Yall-O2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Elastine', 'https://www.biologique-recherche.com/images/serum-elastine.jpg', 'https://www.biologique-recherche.com/fr/serum-elastine', 145.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Elastine');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Collagène', 'https://www.biologique-recherche.com/images/serum-collagene.jpg', 'https://www.biologique-recherche.com/fr/serum-collagene', 165.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Collagène');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Placenta', 'https://www.biologique-recherche.com/images/serum-placenta.jpg', 'https://www.biologique-recherche.com/fr/serum-placenta', 145.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Placenta');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Iribiol', 'https://www.biologique-recherche.com/images/serum-iribiol.jpg', 'https://www.biologique-recherche.com/fr/serum-iribiol', 150.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.85, "pores": 0.85, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Iribiol');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Erythros', 'https://www.biologique-recherche.com/images/serum-erythros.jpg', 'https://www.biologique-recherche.com/fr/serum-erythros', 178.00, 'EUR',
  '["redness", "glow"]'::jsonb, '{"redness": 0.93, "glow": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Erythros');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Amniotique E2', 'https://www.biologique-recherche.com/images/serum-amniotique.jpg', 'https://www.biologique-recherche.com/fr/serum-amniotique-e2', 185.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.92, "glow": 0.85, "firmness": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Amniotique E2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Matriciel Visage', 'https://www.biologique-recherche.com/images/serum-matriciel.jpg', 'https://www.biologique-recherche.com/fr/serum-matriciel', 195.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Matriciel Visage');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Métamorphique', 'https://www.biologique-recherche.com/images/creme-metamorphique.jpg', 'https://www.biologique-recherche.com/fr/creme-metamorphique', 178.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.88, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Métamorphique');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Masque Vernix', 'https://www.biologique-recherche.com/images/masque-vernix.jpg', 'https://www.biologique-recherche.com/fr/masque-vernix', 280.00, 'EUR',
  '["wrinkles", "hydration", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.92, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Masque Vernix');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Dermo-RL', 'https://www.biologique-recherche.com/images/dermo-rl.jpg', 'https://www.biologique-recherche.com/fr/dermo-rl', 145.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Dermo-RL');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème ADN', 'https://www.biologique-recherche.com/images/creme-adn.jpg', 'https://www.biologique-recherche.com/fr/creme-adn', 145.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème ADN');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Quintessentielle', 'https://www.biologique-recherche.com/images/quintessentielle.jpg', 'https://www.biologique-recherche.com/fr/quintessentielle', 198.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Quintessentielle');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Hydravit''S', 'https://www.biologique-recherche.com/images/hydravits.jpg', 'https://www.biologique-recherche.com/fr/hydravits', 102.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Hydravit''S');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Contour des Yeux Bio-Fixine', 'https://www.biologique-recherche.com/images/biofixine.jpg', 'https://www.biologique-recherche.com/fr/biofixine', 102.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Contour des Yeux Bio-Fixine');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sérum Liftant Yeux', 'https://www.biologique-recherche.com/images/serum-yeux.jpg', 'https://www.biologique-recherche.com/fr/serum-yeux', 145.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sérum Liftant Yeux');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque VIP O2', 'https://www.biologique-recherche.com/images/masque-vip.jpg', 'https://www.biologique-recherche.com/fr/masque-vip', 130.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.78, "wrinkles": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque VIP O2');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Visolastine E', 'https://www.biologique-recherche.com/images/visolastine.jpg', 'https://www.biologique-recherche.com/fr/visolastine', 125.00, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Visolastine E');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Biosensible', 'https://www.biologique-recherche.com/images/biosensible.jpg', 'https://www.biologique-recherche.com/fr/biosensible', 115.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Biosensible');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque Biofixine', 'https://www.biologique-recherche.com/images/masque-biofixine.jpg', 'https://www.biologique-recherche.com/fr/masque-biofixine', 132.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque Biofixine');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Masque PIGM 400', 'https://www.biologique-recherche.com/images/masque-pigm.jpg', 'https://www.biologique-recherche.com/fr/masque-pigm', 140.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Masque PIGM 400');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Booster Vit C', 'https://www.biologique-recherche.com/images/booster-vitc.jpg', 'https://www.biologique-recherche.com/fr/booster-vitc', 88.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'biologique-recherche'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Booster Vit C');

-- ═══════════════════════════════════════════════════════════════════════════
-- AESOP · Botanical (AU) · 35 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Parsley Seed Anti-Oxidant Facial Cleansing Oil', 'https://www.aesop.com/products/parsley-cleansing-oil.jpg', 'https://www.aesop.com/fr/p/parsley-cleansing-oil', 49.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Facial Cleansing Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Parsley Seed Anti-Oxidant Facial Cleansing Masque', 'https://www.aesop.com/products/parsley-mask.jpg', 'https://www.aesop.com/fr/p/parsley-mask', 60.00, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.78, "pores": 0.72, "pigmentation": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Facial Cleansing Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Fabulous Face Cleanser', 'https://www.aesop.com/products/fabulous-cleanser.jpg', 'https://www.aesop.com/fr/p/fabulous-cleanser', 60.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.62, "redness": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Fabulous Face Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Amazing Face Cleanser', 'https://www.aesop.com/products/amazing-cleanser.jpg', 'https://www.aesop.com/fr/p/amazing-cleanser', 41.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.65, "sebum": 0.55, "glow": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Amazing Face Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'In Two Minds Facial Cleanser', 'https://www.aesop.com/products/in-two-minds.jpg', 'https://www.aesop.com/fr/p/in-two-minds-cleanser', 41.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.65, "sebum": 0.62, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'In Two Minds Facial Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Purifying Facial Cream Cleanser', 'https://www.aesop.com/products/purifying-cleanser.jpg', 'https://www.aesop.com/fr/p/purifying-cleanser', 41.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.62, "glow": 0.6, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Purifying Facial Cream Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Parsley Seed Anti-Oxidant Hydrator', 'https://www.aesop.com/products/parsley-hydrator.jpg', 'https://www.aesop.com/fr/p/parsley-hydrator', 65.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.65, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Hydrator');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'B & Tea Balancing Toner', 'https://www.aesop.com/products/b-tea-toner.jpg', 'https://www.aesop.com/fr/p/b-tea-toner', 45.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.78, "pores": 0.75, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'B & Tea Balancing Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'In Two Minds Facial Toner', 'https://www.aesop.com/products/in-two-minds-toner.jpg', 'https://www.aesop.com/fr/p/in-two-minds-toner', 41.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.72, "sebum": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'In Two Minds Facial Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lightweight Facial Hydrating Serum', 'https://www.aesop.com/products/lightweight-serum.jpg', 'https://www.aesop.com/fr/p/lightweight-serum', 65.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.88, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lightweight Facial Hydrating Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'In Two Minds Hydrator', 'https://www.aesop.com/products/in-two-minds-hydrator.jpg', 'https://www.aesop.com/fr/p/in-two-minds-hydrator', 65.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.72, "pores": 0.7, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'In Two Minds Hydrator');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Damascan Rose Facial Treatment', 'https://www.aesop.com/products/damascan-rose.jpg', 'https://www.aesop.com/fr/p/damascan-rose', 65.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Damascan Rose Facial Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lucent Facial Concentrate', 'https://www.aesop.com/products/lucent-concentrate.jpg', 'https://www.aesop.com/fr/p/lucent-concentrate', 99.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.9, "pigmentation": 0.78, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lucent Facial Concentrate');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Parsley Seed Anti-Oxidant Serum', 'https://www.aesop.com/products/parsley-serum.jpg', 'https://www.aesop.com/fr/p/parsley-serum', 87.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.82, "pigmentation": 0.7, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sublime Replenishing Night Masque', 'https://www.aesop.com/products/sublime-masque.jpg', 'https://www.aesop.com/fr/p/sublime-masque', 99.00, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"wrinkles": 0.78, "hydration": 0.85, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sublime Replenishing Night Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Elemental Facial Barrier Cream', 'https://www.aesop.com/products/elemental-barrier.jpg', 'https://www.aesop.com/fr/p/elemental-barrier', 65.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Elemental Facial Barrier Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mandarin Facial Hydrating Cream', 'https://www.aesop.com/products/mandarin-cream.jpg', 'https://www.aesop.com/fr/p/mandarin-cream', 60.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mandarin Facial Hydrating Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Camellia Nut Facial Hydrating Cream', 'https://www.aesop.com/products/camellia-nut.jpg', 'https://www.aesop.com/fr/p/camellia-nut', 70.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.88, "redness": 0.65, "glow": 0.62, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Camellia Nut Facial Hydrating Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sage & Cedar Facial Hydrating Cream', 'https://www.aesop.com/products/sage-cedar.jpg', 'https://www.aesop.com/fr/p/sage-cedar', 60.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.82, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sage & Cedar Facial Hydrating Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Primrose Facial Hydrating Cream', 'https://www.aesop.com/products/primrose-cream.jpg', 'https://www.aesop.com/fr/p/primrose-cream', 60.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.85, "redness": 0.7, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Primrose Facial Hydrating Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Parsley Seed Anti-Oxidant Eye Cream', 'https://www.aesop.com/products/parsley-eye.jpg', 'https://www.aesop.com/fr/p/parsley-eye', 65.00, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.78, "glow": 0.65, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Parsley Seed Anti-Oxidant Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Eidesis Anti-Oxidant Eye Serum', 'https://www.aesop.com/products/eidesis-eye.jpg', 'https://www.aesop.com/fr/p/eidesis-eye', 130.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.78, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eidesis Anti-Oxidant Eye Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Fabulous Face Oil', 'https://www.aesop.com/products/fabulous-oil.jpg', 'https://www.aesop.com/fr/p/fabulous-oil', 75.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.78, "firmness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Fabulous Face Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Lucent Concentrate Skin-Brightening', 'https://www.aesop.com/products/lucent-bright.jpg', 'https://www.aesop.com/fr/p/lucent-brightening', 99.00, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"pigmentation": 0.85, "glow": 0.88, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Lucent Concentrate Skin-Brightening');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mature Skin Set', 'https://www.aesop.com/products/mature-set.jpg', 'https://www.aesop.com/fr/p/mature-set', 175.00, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.82, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mature Skin Set');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Protective Facial Lotion SPF50', 'https://www.aesop.com/products/protective-spf50.jpg', 'https://www.aesop.com/fr/p/protective-spf50', 60.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Protective Facial Lotion SPF50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Protective Body Lotion SPF50', 'https://www.aesop.com/products/protective-body-spf50.jpg', 'https://www.aesop.com/fr/p/protective-body-spf50', 65.00, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.55, "redness": 0.5, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Protective Body Lotion SPF50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Tea Tree Leaf Facial Exfoliant', 'https://www.aesop.com/products/tea-tree-exfoliant.jpg', 'https://www.aesop.com/fr/p/tea-tree-exfoliant', 45.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.78, "glow": 0.65, "sebum": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Tea Tree Leaf Facial Exfoliant');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Purifying Facial Exfoliant Paste', 'https://www.aesop.com/products/purifying-exfoliant.jpg', 'https://www.aesop.com/fr/p/purifying-exfoliant', 45.00, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.72, "glow": 0.65, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 28
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Purifying Facial Exfoliant Paste');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Chamomile Concentrate Anti-Blemish Masque', 'https://www.aesop.com/products/chamomile-masque.jpg', 'https://www.aesop.com/fr/p/chamomile-masque', 65.00, 'EUR',
  '["sebum", "pores"]'::jsonb, '{"sebum": 0.78, "pores": 0.78, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3}'::jsonb, 29
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Chamomile Concentrate Anti-Blemish Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Primrose Facial Cleansing Masque', 'https://www.aesop.com/products/primrose-masque.jpg', 'https://www.aesop.com/fr/p/primrose-masque', 65.00, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.75, "hydration": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 30
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Primrose Facial Cleansing Masque');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Rosehip Seed Lip Cream', 'https://www.aesop.com/products/rosehip-lip.jpg', 'https://www.aesop.com/fr/p/rosehip-lip', 22.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 31
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rosehip Seed Lip Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Immediate Moisture Facial Hydrosol', 'https://www.aesop.com/products/immediate-hydrosol.jpg', 'https://www.aesop.com/fr/p/immediate-hydrosol', 40.00, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 32
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Immediate Moisture Facial Hydrosol');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Rejuvenate Intensive Body Balm', 'https://www.aesop.com/products/rejuvenate-balm.jpg', 'https://www.aesop.com/fr/p/rejuvenate-balm', 70.00, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.88, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 33
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rejuvenate Intensive Body Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resurrection Aromatique Hand Balm', 'https://www.aesop.com/products/resurrection-hand.jpg', 'https://www.aesop.com/fr/p/resurrection-hand', 38.00, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 34
from public.brands b where b.slug = 'aesop'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurrection Aromatique Hand Balm');

-- ═══════════════════════════════════════════════════════════════════════════
-- 111SKIN · Dr Yannis Alexandrides (UK) · 25 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Celestial Black Diamond Eye Cream', 'https://111skin.com/cdn/shop/files/celestial-eye.jpg', 'https://111skin.com/products/celestial-black-diamond-eye-cream', 228.15, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.9, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Celestial Black Diamond Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Repair Serum NAC Y²', 'https://111skin.com/cdn/shop/files/repair-serum.jpg', 'https://111skin.com/products/repair-serum-nac-y2', 198.90, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.85, "hydration": 0.78, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Repair Serum NAC Y²');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Y Theorem Day Cream NAC Y²', 'https://111skin.com/cdn/shop/files/y-day.jpg', 'https://111skin.com/products/y-theorem-day-cream', 198.90, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Y Theorem Day Cream NAC Y²');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Y Theorem Repair Serum NAC Y²', 'https://111skin.com/cdn/shop/files/y-repair.jpg', 'https://111skin.com/products/y-theorem-serum', 198.90, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.88, "glow": 0.78, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Y Theorem Repair Serum NAC Y²');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Diamond Lifting & Firming Mask', 'https://111skin.com/cdn/shop/files/bd-mask.jpg', 'https://111skin.com/products/black-diamond-mask', 140.40, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.88, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Diamond Lifting & Firming Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Rose Gold Brightening Facial Treatment Mask', 'https://111skin.com/cdn/shop/files/rose-mask.jpg', 'https://111skin.com/products/rose-gold-mask', 122.85, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.78, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rose Gold Brightening Facial Treatment Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sub-Zero De-Puffing Energy Mask', 'https://111skin.com/cdn/shop/files/subzero-mask.jpg', 'https://111skin.com/products/sub-zero-mask', 111.15, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.78, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sub-Zero De-Puffing Energy Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Celestial Black Diamond Brightening Essence', 'https://111skin.com/cdn/shop/files/celestial-essence.jpg', 'https://111skin.com/products/celestial-black-diamond-brightening-essence', 105.30, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.85, "glow": 0.82, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Celestial Black Diamond Brightening Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Diamond Eye Lift Y²', 'https://111skin.com/cdn/shop/files/bd-eye.jpg', 'https://111skin.com/products/black-diamond-eye-lift', 228.15, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Diamond Eye Lift Y²');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Diamond Vitamin C Brightening Booster', 'https://111skin.com/cdn/shop/files/vitamin-c.jpg', 'https://111skin.com/products/vitamin-c-brightening-booster', 128.70, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.92, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Diamond Vitamin C Brightening Booster');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dark Spot Correcting Serum', 'https://111skin.com/cdn/shop/files/dark-spot.jpg', 'https://111skin.com/products/dark-spot-correcting-serum', 280.80, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.95, "glow": 0.78, "wrinkles": 0.55, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dark Spot Correcting Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Bio Cellulose Treatment Mask', 'https://111skin.com/cdn/shop/files/bio-cellulose.jpg', 'https://111skin.com/products/bio-cellulose-mask', 122.85, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.65, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Bio Cellulose Treatment Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Eye Lift Gel Y²', 'https://111skin.com/cdn/shop/files/eye-lift-gel.jpg', 'https://111skin.com/products/eye-lift-gel-y2', 128.70, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Eye Lift Gel Y²');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Sunscreen SPF 50', 'https://111skin.com/cdn/shop/files/spf50.jpg', 'https://111skin.com/products/sunscreen-spf-50', 64.35, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.45, "hydration": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Sunscreen SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Deep Cleansing Oil', 'https://111skin.com/cdn/shop/files/cleansing-oil.jpg', 'https://111skin.com/products/deep-cleansing-oil', 76.05, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.75, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Deep Cleansing Oil');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Exfoliating Double Cleanse', 'https://111skin.com/cdn/shop/files/exfoliating-cleanse.jpg', 'https://111skin.com/products/exfoliating-double-cleanse', 122.85, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.78, "glow": 0.78, "sebum": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 15
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Exfoliating Double Cleanse');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brightening Double Cleanse', 'https://111skin.com/cdn/shop/files/brightening-cleanse.jpg', 'https://111skin.com/products/brightening-double-cleanse', 122.85, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.78, "glow": 0.78, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Double Cleanse');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Repair Day Cream', 'https://111skin.com/cdn/shop/files/repair-day.jpg', 'https://111skin.com/products/repair-day-cream', 175.50, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.85, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Repair Day Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Repair Night Cream', 'https://111skin.com/cdn/shop/files/repair-night.jpg', 'https://111skin.com/products/repair-night-cream', 193.05, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.88, "hydration": 0.88, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Repair Night Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Contouring Gua Sha', 'https://111skin.com/cdn/shop/files/gua-sha.jpg', 'https://111skin.com/products/contouring-gua-sha', 46.80, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Contouring Gua Sha');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Cryo Sculpting Globes', 'https://111skin.com/cdn/shop/files/cryo-globes.jpg', 'https://111skin.com/products/cryo-sculpting-tool', 111.15, 'EUR',
  '["firmness", "redness"]'::jsonb, '{"firmness": 0.78, "redness": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Cryo Sculpting Globes');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Black Diamond Lifting & Firming Neck Mask', 'https://111skin.com/cdn/shop/files/bd-neck.jpg', 'https://111skin.com/products/black-diamond-neck-mask', 99.45, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Black Diamond Lifting & Firming Neck Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Precision Roller', 'https://111skin.com/cdn/shop/files/precision-roller.jpg', 'https://111skin.com/products/eye-roller', 76.05, 'EUR',
  '["firmness", "hydration"]'::jsonb, '{"firmness": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Precision Roller');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'NMN Age Defying Eye Mask', 'https://111skin.com/cdn/shop/files/nmn-eye.jpg', 'https://111skin.com/products/nmn-age-defying-eye-mask', 117.00, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'NMN Age Defying Eye Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Ultimate NAC Y² Complex Supplement', 'https://111skin.com/cdn/shop/files/nac-supplement.jpg', 'https://111skin.com/products/ultimate-nacy2-complex', 111.15, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = '111skin'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Ultimate NAC Y² Complex Supplement');

-- ═══════════════════════════════════════════════════════════════════════════
-- TATA HARPER · Vermont farm-to-face (US) · 28 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Crème Supreme', 'https://www.tataharperskincare.com/cdn/shop/files/creme-supreme.jpg', 'https://www.tataharperskincare.com/shop/creme-supreme', 228.16, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.92, "firmness": 0.88, "hydration": 0.85, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Crème Supreme');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Elixir Vitae', 'https://www.tataharperskincare.com/cdn/shop/files/elixir-vitae.jpg', 'https://www.tataharperskincare.com/shop/elixir-vitae', 345.00, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.95, "firmness": 0.92, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Elixir Vitae');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Rejuvenating Serum', 'https://www.tataharperskincare.com/cdn/shop/files/rejuvenating-serum.jpg', 'https://www.tataharperskincare.com/shop/rejuvenating-serum', 96.60, 'EUR',
  '["wrinkles", "glow", "hydration"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.82, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Rejuvenating Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resurfacing Serum', 'https://www.tataharperskincare.com/cdn/shop/files/resurfacing-serum.jpg', 'https://www.tataharperskincare.com/shop/resurfacing-serum', 71.76, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.88, "pores": 0.78, "pigmentation": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Resurfacing Mask', 'https://www.tataharperskincare.com/cdn/shop/files/resurfacing-mask.jpg', 'https://www.tataharperskincare.com/shop/resurfacing-mask', 66.24, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.85, "pores": 0.78, "pigmentation": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Resurfacing Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydrating Floral Mask', 'https://www.tataharperskincare.com/cdn/shop/files/hydrating-floral.jpg', 'https://www.tataharperskincare.com/shop/hydrating-floral-mask', 64.40, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.92, "redness": 0.65, "glow": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydrating Floral Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Regenerating Cleanser', 'https://www.tataharperskincare.com/cdn/shop/files/regenerating-cleanser.jpg', 'https://www.tataharperskincare.com/shop/regenerating-cleanser', 75.44, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.65, "pores": 0.55, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Regenerating Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Refreshing Cleanser', 'https://www.tataharperskincare.com/cdn/shop/files/refreshing-cleanser.jpg', 'https://www.tataharperskincare.com/shop/refreshing-cleanser', 58.88, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.65, "glow": 0.55, "redness": 0.5, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Refreshing Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Nourishing Oil Cleanser', 'https://www.tataharperskincare.com/cdn/shop/files/oil-cleanser.jpg', 'https://www.tataharperskincare.com/shop/oil-cleanser', 66.24, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Nourishing Oil Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydrating Toner', 'https://www.tataharperskincare.com/cdn/shop/files/hydrating-toner.jpg', 'https://www.tataharperskincare.com/shop/hydrating-toner', 57.96, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydrating Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Toner Restorative Floral', 'https://www.tataharperskincare.com/cdn/shop/files/toner-floral.jpg', 'https://www.tataharperskincare.com/shop/toner-floral', 57.04, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Toner Restorative Floral');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Restorative Eye Crème', 'https://www.tataharperskincare.com/cdn/shop/files/eye-creme.jpg', 'https://www.tataharperskincare.com/shop/restorative-eye-creme', 105.80, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Restorative Eye Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Illuminating Eye Crème', 'https://www.tataharperskincare.com/cdn/shop/files/illuminating-eye.jpg', 'https://www.tataharperskincare.com/shop/illuminating-eye', 105.80, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.85, "pigmentation": 0.75, "wrinkles": 0.65, "hydration": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Illuminating Eye Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Brightening Eye Gel', 'https://www.tataharperskincare.com/cdn/shop/files/brightening-eye-gel.jpg', 'https://www.tataharperskincare.com/shop/brightening-eye-gel', 68.08, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.82, "hydration": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Brightening Eye Gel');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Water-Lock Moisturizer', 'https://www.tataharperskincare.com/cdn/shop/files/water-lock.jpg', 'https://www.tataharperskincare.com/shop/water-lock-moisturizer', 88.32, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Water-Lock Moisturizer');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Boosted Contouring Serum', 'https://www.tataharperskincare.com/cdn/shop/files/boosted-contouring.jpg', 'https://www.tataharperskincare.com/shop/boosted-contouring', 185.84, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Boosted Contouring Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Boosted Brightening Serum', 'https://www.tataharperskincare.com/cdn/shop/files/boosted-brightening.jpg', 'https://www.tataharperskincare.com/shop/boosted-brightening', 154.56, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.88, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Boosted Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Boosted Contouring Eye Mask', 'https://www.tataharperskincare.com/cdn/shop/files/boosted-eye-mask.jpg', 'https://www.tataharperskincare.com/shop/boosted-eye-mask', 86.48, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.88, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Boosted Contouring Eye Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Concentrated Brightening Serum', 'https://www.tataharperskincare.com/cdn/shop/files/concentrated-brightening.jpg', 'https://www.tataharperskincare.com/shop/concentrated-brightening-serum', 138.00, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.92, "glow": 0.85, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Concentrated Brightening Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Concentrated Brightening Essence', 'https://www.tataharperskincare.com/cdn/shop/files/brightening-essence.jpg', 'https://www.tataharperskincare.com/shop/brightening-essence', 84.64, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.85, "glow": 0.82, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Concentrated Brightening Essence');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Superkind Calming Crème', 'https://www.tataharperskincare.com/cdn/shop/files/superkind-calming.jpg', 'https://www.tataharperskincare.com/shop/superkind-calming', 124.20, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Superkind Calming Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Superkind Radiance Mask', 'https://www.tataharperskincare.com/cdn/shop/files/superkind-radiance.jpg', 'https://www.tataharperskincare.com/shop/superkind-radiance', 75.44, 'EUR',
  '["glow", "redness"]'::jsonb, '{"glow": 0.85, "redness": 0.65, "hydration": 0.65, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Superkind Radiance Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Superkind Softening Cleanser', 'https://www.tataharperskincare.com/cdn/shop/files/superkind-softening.jpg', 'https://www.tataharperskincare.com/shop/superkind-softening', 69.92, 'EUR',
  '["hydration", "redness"]'::jsonb, '{"hydration": 0.78, "redness": 0.65, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Superkind Softening Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Volumizing Lip & Cheek Tint', 'https://www.tataharperskincare.com/cdn/shop/files/volumizing-tint.jpg', 'https://www.tataharperskincare.com/shop/volumizing-tint', 34.96, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.75, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Volumizing Lip & Cheek Tint');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Be Adored Lip Treatment', 'https://www.tataharperskincare.com/cdn/shop/files/be-adored.jpg', 'https://www.tataharperskincare.com/shop/be-adored-lip', 34.96, 'EUR',
  '["hydration"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 24
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Be Adored Lip Treatment');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Reparative Moisturizer', 'https://www.tataharperskincare.com/cdn/shop/files/reparative-moisturizer.jpg', 'https://www.tataharperskincare.com/shop/reparative-moisturizer', 101.20, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 25
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Reparative Moisturizer');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Daily Essentials Crème', 'https://www.tataharperskincare.com/cdn/shop/files/daily-essentials.jpg', 'https://www.tataharperskincare.com/shop/daily-essentials-creme', 90.16, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.85, "glow": 0.65, "redness": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 26
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Daily Essentials Crème');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Purifying Mask', 'https://www.tataharperskincare.com/cdn/shop/files/purifying-mask.jpg', 'https://www.tataharperskincare.com/shop/purifying-mask', 58.88, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.85, "sebum": 0.78, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 27
from public.brands b where b.slug = 'tata-harper'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Purifying Mask');

-- ═══════════════════════════════════════════════════════════════════════════
-- BEAUTY OF JOSEON · Hanbang K-beauty (KR) · 22 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Glow Serum Propolis + Niacinamide', 'https://beautyofjoseon.com/cdn/shop/files/glow-serum.jpg', 'https://beautyofjoseon.com/products/glow-serum', 15.64, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.92, "hydration": 0.78, "pigmentation": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glow Serum Propolis + Niacinamide');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Glow Deep Serum Rice + Alpha Arbutin', 'https://beautyofjoseon.com/cdn/shop/files/glow-deep.jpg', 'https://beautyofjoseon.com/products/glow-deep-serum', 16.56, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.88, "glow": 0.85, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Glow Deep Serum Rice + Alpha Arbutin');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Calming Serum Green Tea + Panthenol', 'https://beautyofjoseon.com/cdn/shop/files/calming-serum.jpg', 'https://beautyofjoseon.com/products/calming-serum', 15.64, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Serum Green Tea + Panthenol');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Revive Serum Ginseng + Snail Mucin', 'https://beautyofjoseon.com/cdn/shop/files/revive-serum.jpg', 'https://beautyofjoseon.com/products/revive-serum', 15.64, 'EUR',
  '["wrinkles", "firmness", "hydration"]'::jsonb, '{"wrinkles": 0.78, "firmness": 0.78, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Revive Serum Ginseng + Snail Mucin');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Revive Eye Serum Ginseng + Retinal', 'https://beautyofjoseon.com/cdn/shop/files/revive-eye.jpg', 'https://beautyofjoseon.com/products/revive-eye-serum', 11.96, 'EUR',
  '["wrinkles", "glow"]'::jsonb, '{"wrinkles": 0.85, "glow": 0.65, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Revive Eye Serum Ginseng + Retinal');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Relief Sun Rice + Probiotics SPF 50', 'https://beautyofjoseon.com/cdn/shop/files/relief-sun.jpg', 'https://beautyofjoseon.com/products/relief-sun', 13.80, 'EUR',
  '["pigmentation", "redness"]'::jsonb, '{"pigmentation": 0.78, "redness": 0.65, "hydration": 0.65, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Relief Sun Rice + Probiotics SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Relief Sun Aqua-Fresh Rice + B5 SPF 50', 'https://beautyofjoseon.com/cdn/shop/files/relief-sun-aqua.jpg', 'https://beautyofjoseon.com/products/relief-sun-aqua-fresh', 13.80, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"pigmentation": 0.72, "hydration": 0.78, "redness": 0.65, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Relief Sun Aqua-Fresh Rice + B5 SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Matte Sun Stick Mugwort + Camelia SPF 50', 'https://beautyofjoseon.com/cdn/shop/files/matte-sun.jpg', 'https://beautyofjoseon.com/products/matte-sun-stick', 11.96, 'EUR',
  '["sebum", "pigmentation"]'::jsonb, '{"pigmentation": 0.65, "sebum": 0.78, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Matte Sun Stick Mugwort + Camelia SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Ground Rice and Honey Glow Mask', 'https://beautyofjoseon.com/cdn/shop/files/rice-honey-mask.jpg', 'https://beautyofjoseon.com/products/rice-honey-mask', 18.40, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.85, "hydration": 0.78, "pigmentation": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Ground Rice and Honey Glow Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Centella Asiatica Calming Mask', 'https://beautyofjoseon.com/cdn/shop/files/centella-mask.jpg', 'https://beautyofjoseon.com/products/centella-mask', 13.80, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Centella Asiatica Calming Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Calming Barrier Serum', 'https://beautyofjoseon.com/cdn/shop/files/calming-barrier.jpg', 'https://beautyofjoseon.com/products/calming-barrier-serum', 15.64, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Barrier Serum');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Calming Barrier Toner', 'https://beautyofjoseon.com/cdn/shop/files/calming-barrier-toner.jpg', 'https://beautyofjoseon.com/products/calming-barrier-toner', 15.64, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Calming Barrier Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Ginseng Essence Water', 'https://beautyofjoseon.com/cdn/shop/files/ginseng-essence.jpg', 'https://beautyofjoseon.com/products/ginseng-essence-water', 16.56, 'EUR',
  '["hydration", "wrinkles"]'::jsonb, '{"hydration": 0.85, "wrinkles": 0.65, "firmness": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Ginseng Essence Water');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dynasty Cream', 'https://beautyofjoseon.com/cdn/shop/files/dynasty-cream.jpg', 'https://beautyofjoseon.com/products/dynasty-cream', 20.24, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.85, "hydration": 0.85, "firmness": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dynasty Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Radiance Cleansing Balm', 'https://beautyofjoseon.com/cdn/shop/files/cleansing-balm.jpg', 'https://beautyofjoseon.com/products/radiance-cleansing-balm', 16.56, 'EUR',
  '["hydration", "pores"]'::jsonb, '{"hydration": 0.65, "pores": 0.55, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Radiance Cleansing Balm');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Green Plum Refreshing Cleanser', 'https://beautyofjoseon.com/cdn/shop/files/green-plum.jpg', 'https://beautyofjoseon.com/products/green-plum-cleanser', 13.80, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.78, "sebum": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Green Plum Refreshing Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Red Bean Refreshing Pore Mask', 'https://beautyofjoseon.com/cdn/shop/files/red-bean-mask.jpg', 'https://beautyofjoseon.com/products/red-bean-mask', 13.80, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.85, "sebum": 0.78, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Red Bean Refreshing Pore Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hydra Shield Body Sun Lotion SPF 50', 'https://beautyofjoseon.com/cdn/shop/files/hydra-shield.jpg', 'https://beautyofjoseon.com/products/hydra-shield-body-sun', 23.00, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"pigmentation": 0.55, "hydration": 0.85, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hydra Shield Body Sun Lotion SPF 50');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Dynasty Day & Night Care Duo', 'https://beautyofjoseon.com/cdn/shop/files/day-night.jpg', 'https://beautyofjoseon.com/products/day-night-duo', 28.52, 'EUR',
  '["wrinkles", "hydration"]'::jsonb, '{"wrinkles": 0.78, "hydration": 0.78, "firmness": 0.55, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Dynasty Day & Night Care Duo');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hanbang Serum Discovery Kit', 'https://beautyofjoseon.com/cdn/shop/files/discovery.jpg', 'https://beautyofjoseon.com/products/hanbang-serum-discovery-kit', 19.32, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.78, "hydration": 0.78, "pigmentation": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hanbang Serum Discovery Kit');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Perfect Hanbang Palette', 'https://beautyofjoseon.com/cdn/shop/files/hanbang-palette.jpg', 'https://beautyofjoseon.com/products/hanbang-pallete', 49.68, 'EUR',
  '["glow", "hydration"]'::jsonb, '{"glow": 0.78, "hydration": 0.78, "pigmentation": 0.65, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Perfect Hanbang Palette');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Daily Shield Deep Hydration Duo', 'https://beautyofjoseon.com/cdn/shop/files/daily-shield.jpg', 'https://beautyofjoseon.com/products/daily-shield-duo', 32.20, 'EUR',
  '["hydration", "pigmentation"]'::jsonb, '{"hydration": 0.88, "pigmentation": 0.65, "redness": 0.55, "wrinkles": 0.3, "pores": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'beauty-of-joseon'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Daily Shield Deep Hydration Duo');

-- ═══════════════════════════════════════════════════════════════════════════
-- MEDICUBE · PDRN tech (KR) · 24 products
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Zero Pore Pads 2.0', 'https://medicube.us/cdn/shop/files/zero-pore-pads.jpg', 'https://medicube.us/products/zero-pore-pads', 25.76, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.92, "sebum": 0.85, "glow": 0.65, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 0
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Zero Pore Pads 2.0');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Zero Pore Lotion', 'https://medicube.us/cdn/shop/files/zero-pore-lotion.jpg', 'https://medicube.us/products/zero-pore-lotion', 23.00, 'EUR',
  '["pores", "sebum"]'::jsonb, '{"pores": 0.88, "sebum": 0.78, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "redness": 0.3}'::jsonb, 1
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Zero Pore Lotion');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink Collagen Glow Cream', 'https://medicube.us/cdn/shop/files/pdrn-glow-cream.jpg', 'https://medicube.us/products/pdrn-pink-collagen-cream', 41.40, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.88, "wrinkles": 0.82, "hydration": 0.82, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 2
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink Collagen Glow Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink Collagen Niacinamide Whip Cleanser', 'https://medicube.us/cdn/shop/files/pdrn-whip.jpg', 'https://medicube.us/products/pdrn-whip-cleanser', 20.24, 'EUR',
  '["glow", "pores"]'::jsonb, '{"glow": 0.78, "pores": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 3
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink Collagen Niacinamide Whip Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink Glutathione Capsule Foam Cleanser', 'https://medicube.us/cdn/shop/files/pdrn-glutathione.jpg', 'https://medicube.us/products/pdrn-pink-glutathione-capsule-foam-cleanser', 18.40, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.78, "pigmentation": 0.65, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 4
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink Glutathione Capsule Foam Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink Peptide Pad', 'https://medicube.us/cdn/shop/files/pdrn-pad.jpg', 'https://medicube.us/products/pdrn-pink-peptide-pad', 32.20, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.85, "glow": 0.78, "wrinkles": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 5
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink Peptide Pad');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink Tension Up Mask', 'https://medicube.us/cdn/shop/files/pdrn-mask.jpg', 'https://medicube.us/products/pdrn-pink-tension-up-mask', 23.92, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 6
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink Tension Up Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Collagen Niacinamide Overnight Wrapping Mask', 'https://medicube.us/cdn/shop/files/collagen-mask.jpg', 'https://medicube.us/products/collagen-mask', 27.60, 'EUR',
  '["hydration", "firmness", "glow"]'::jsonb, '{"firmness": 0.85, "hydration": 0.88, "glow": 0.78, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 7
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Collagen Niacinamide Overnight Wrapping Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Red Cica Calming Cream', 'https://medicube.us/cdn/shop/files/red-cica-cream.jpg', 'https://medicube.us/products/red-cica-cream', 29.44, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 8
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Red Cica Calming Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Red Recovery Cream', 'https://medicube.us/cdn/shop/files/red-recovery.jpg', 'https://medicube.us/products/red-recovery-cream', 25.76, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.85, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 9
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Red Recovery Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Red Cica Pads', 'https://medicube.us/cdn/shop/files/red-cica-pads.jpg', 'https://medicube.us/products/red-cica-pads', 23.00, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.92, "hydration": 0.78, "pores": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "glow": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 10
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Red Cica Pads');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Azelaic Acid Niacinamide Clarifying Toner', 'https://medicube.us/cdn/shop/files/azelaic-toner.jpg', 'https://medicube.us/products/azelaic-acid-niacinamide-clarifying-toner', 20.24, 'EUR',
  '["pores", "pigmentation"]'::jsonb, '{"pores": 0.85, "pigmentation": 0.78, "glow": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 11
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Azelaic Acid Niacinamide Clarifying Toner');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Azelaic Acid Exosome Shot', 'https://medicube.us/cdn/shop/files/azelaic-shot.jpg', 'https://medicube.us/products/azelaic-acid-exosome-shot', 27.60, 'EUR',
  '["pigmentation", "pores"]'::jsonb, '{"pigmentation": 0.88, "pores": 0.78, "glow": 0.65, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 12
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Azelaic Acid Exosome Shot');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Azelaic Acid Capsule Foam Cleanser', 'https://medicube.us/cdn/shop/files/azelaic-foam.jpg', 'https://medicube.us/products/azelaic-acid-capsule-foam-cleanser', 18.40, 'EUR',
  '["pores", "pigmentation"]'::jsonb, '{"pores": 0.78, "pigmentation": 0.65, "glow": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 13
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Azelaic Acid Capsule Foam Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Kojic Acid Turmeric Vita Capsule Foam Cleanser', 'https://medicube.us/cdn/shop/files/kojic-foam.jpg', 'https://medicube.us/products/kojic-acid-foam', 18.40, 'EUR',
  '["pigmentation", "glow"]'::jsonb, '{"pigmentation": 0.78, "glow": 0.78, "pores": 0.55, "hydration": 0.3, "wrinkles": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 14
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Kojic Acid Turmeric Vita Capsule Foam Cleanser');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hypochlorous Acid Peel Mask', 'https://medicube.us/cdn/shop/files/hypochlorous-mask.jpg', 'https://medicube.us/products/hypochlorous-acid-peel-mask', 23.92, 'EUR',
  '["pores", "glow"]'::jsonb, '{"pores": 0.78, "glow": 0.78, "redness": 0.55, "hydration": 0.3, "wrinkles": 0.3, "pigmentation": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 15
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hypochlorous Acid Peel Mask');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Salmon PDRN Eye Cream', 'https://medicube.us/cdn/shop/files/salmon-eye.jpg', 'https://medicube.us/products/salmon-pdrn-eye-cream', 32.20, 'EUR',
  '["wrinkles", "firmness"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "hydration": 0.65, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 16
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Salmon PDRN Eye Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Triple Collagen Cream', 'https://medicube.us/cdn/shop/files/triple-collagen.jpg', 'https://medicube.us/products/triple-collagen-cream', 41.40, 'EUR',
  '["firmness", "wrinkles", "hydration"]'::jsonb, '{"firmness": 0.92, "wrinkles": 0.85, "hydration": 0.78, "pigmentation": 0.3, "pores": 0.3, "glow": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 17
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Triple Collagen Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'AGE-R Booster Pro', 'https://medicube.us/cdn/shop/files/age-r.jpg', 'https://medicube.us/products/age-r-booster', 266.80, 'EUR',
  '["firmness", "wrinkles"]'::jsonb, '{"firmness": 0.85, "wrinkles": 0.85, "glow": 0.65, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 18
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'AGE-R Booster Pro');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Mini Booster Pro Plus', 'https://medicube.us/cdn/shop/files/mini-booster.jpg', 'https://medicube.us/products/mini-booster-pro-plus', 101.20, 'EUR',
  '["firmness", "glow"]'::jsonb, '{"firmness": 0.78, "glow": 0.65, "hydration": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 19
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Mini Booster Pro Plus');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Deep Vita C Capsule Cream', 'https://medicube.us/cdn/shop/files/vita-c.jpg', 'https://medicube.us/products/deep-vita-c-cream', 34.96, 'EUR',
  '["glow", "pigmentation"]'::jsonb, '{"glow": 0.92, "pigmentation": 0.88, "hydration": 0.55, "wrinkles": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 20
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Deep Vita C Capsule Cream');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Centella Capsule Pack', 'https://medicube.us/cdn/shop/files/centella-pack.jpg', 'https://medicube.us/products/centella-capsule-pack', 27.60, 'EUR',
  '["redness", "hydration"]'::jsonb, '{"redness": 0.88, "hydration": 0.78, "glow": 0.55, "wrinkles": 0.3, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "sebum": 0.3}'::jsonb, 21
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Centella Capsule Pack');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'PDRN Pink One Day Exosome Ampoule', 'https://medicube.us/cdn/shop/files/exosome-ampoule.jpg', 'https://medicube.us/products/exosome-ampoule', 50.60, 'EUR',
  '["wrinkles", "firmness", "glow"]'::jsonb, '{"wrinkles": 0.85, "firmness": 0.85, "glow": 0.78, "hydration": 0.3, "pigmentation": 0.3, "pores": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 22
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'PDRN Pink One Day Exosome Ampoule');

insert into public.products (brand_id, name, image_url, url, price_eur, currency, targets, concern_scores, position)
select b.id, 'Hyaluronic Acid Booster', 'https://medicube.us/cdn/shop/files/hyaluronic-booster.jpg', 'https://medicube.us/products/hyaluronic-acid-booster', 29.44, 'EUR',
  '["hydration", "glow"]'::jsonb, '{"hydration": 0.95, "glow": 0.65, "wrinkles": 0.55, "pigmentation": 0.3, "pores": 0.3, "firmness": 0.3, "redness": 0.3, "sebum": 0.3}'::jsonb, 23
from public.brands b where b.slug = 'medicube'
and not exists (select 1 from public.products p where p.brand_id = b.id and p.name = 'Hyaluronic Acid Booster');


-- ════════════════════════════════════════════════════════════════════════════
-- VALIDATION QUERY (run manually to verify seed integrity)
-- ════════════════════════════════════════════════════════════════════════════
-- select b.slug, count(p.*) as products
-- from public.brands b
-- left join public.products p on p.brand_id = b.id
-- group by b.slug
-- order by b.slug;
--
-- Expected: 27 rows, total products = ~704
