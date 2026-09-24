-- =====================================================================
-- vyvre.fr — CATALOGUE CAPILLAIRE
-- Tables dédiées, totalement séparées du scan PEAU.
-- Les tables peau existantes (skin_products, products, brands, scans…)
-- ne sont NI lues NI modifiées par ce schéma.
-- Généré le 2026-09-19. À exécuter à la main dans Supabase (SQL editor).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Marques capillaires
-- ---------------------------------------------------------------------
create table if not exists public.hair_brands (
  slug         text primary key,                 -- ex. 'kerastase', 'olaplex'
  name         text not null,                    -- nom affiché, ex. 'Kérastase'
  univers      text not null
               check (univers in ('luxe','pharmacie','normal','petit-prix','salon')),
  pays         text,                             -- pays d'origine de la marque (FR, US, IT…)
  site         text,                             -- site officiel de la marque
  product_count integer not null default 0,      -- nombre de fiches importées
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table  public.hair_brands is 'Marques de soin capillaire du catalogue vyvre CHEVEUX. Rien à voir avec les tables du scan peau.';
comment on column public.hair_brands.univers is 'Positionnement commercial : luxe | pharmacie | normal | petit-prix | salon.';
comment on column public.hair_brands.site is 'Site officiel de la marque : c''est la seule source autorisée pour les fiches produits (aucun revendeur).';

create index if not exists hair_brands_univers_idx on public.hair_brands (univers);
create index if not exists hair_brands_pays_idx    on public.hair_brands (pays);

-- ---------------------------------------------------------------------
-- 2) Produits capillaires
-- ---------------------------------------------------------------------
create table if not exists public.hair_products (
  id              text primary key,              -- '<slug-marque>--<slug-produit>'
  brand           text not null references public.hair_brands (slug) on update cascade on delete restrict,
  brand_name      text not null,
  name            text not null,                 -- nom exact tel qu'écrit sur le site officiel

  url             text not null,                 -- fiche produit officielle (HTTP 200 vérifié)
  url_verifiee_le date,                           -- date de la dernière vérification du lien

  price_eur       numeric(10,2),                 -- prix en euros, null si la marque n'affiche pas de prix
  price_source    text,                          -- 'site officiel EUR' | 'converti USD x0.92 le 19/09' | null

  image_source_url text,                         -- image d'origine sur le site de la marque
  image_local      text,                         -- 'public/scan/products-cheveux/<slug>/<produit>.jpg' (600 px)

  categorie       text not null
                  check (categorie in ('shampooing','apres-shampooing','masque','soin-sans-rinçage',
                                       'huile','serum-cuir-chevelu','traitement-chute','coloration-soin',
                                       'proteine-reconstruction','anti-pellicules','protection-thermique',
                                       'autre-cheveux')),
  etape           smallint not null check (etape between 1 and 4),
  cheveux_cibles  text[] not null default '{}',  -- secs, gras, fins, boucles, crepus, colores, abimes…
  actifs          text[] not null default '{}',  -- actifs lus dans l'INCI
  claims          text[] not null default '{}',  -- promesses marketing relevées sur la fiche

  ingredients     text,                          -- liste INCI si la marque la publie
  description     text,                          -- texte officiel court (500 car. max)
  source          text,                          -- d'où vient la fiche : products.json | sitemap | json-ld | page

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table  public.hair_products is 'Produits capillaires en vente, un par fiche officielle vérifiée. Séparé de skin_products : aucun produit visage ici.';
comment on column public.hair_products.etape is 'Place dans une routine de 4 produits : 1 lavage, 2 soin, 3 sans-rinçage, 4 traitement ciblé.';
comment on column public.hair_products.cheveux_cibles is 'Types de cheveux visés, utilisés pour composer la routine après le scan.';
comment on column public.hair_products.url is 'Toujours le site officiel de la marque : aucun lien revendeur n''est accepté.';
comment on column public.hair_products.price_source is 'Dit si le prix vient du site FR en euros ou d''une conversion, avec le taux et la date.';

create index if not exists hair_products_brand_idx     on public.hair_products (brand);
create index if not exists hair_products_categorie_idx on public.hair_products (categorie);
create index if not exists hair_products_etape_idx     on public.hair_products (etape);
create index if not exists hair_products_cibles_idx    on public.hair_products using gin (cheveux_cibles);
create index if not exists hair_products_actifs_idx    on public.hair_products using gin (actifs);
create index if not exists hair_products_price_idx     on public.hair_products (price_eur);
create unique index if not exists hair_products_url_key on public.hair_products (url);

-- ---------------------------------------------------------------------
-- 3) updated_at automatique
-- ---------------------------------------------------------------------
create or replace function public.hair_touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists hair_brands_touch on public.hair_brands;
create trigger hair_brands_touch before update on public.hair_brands
  for each row execute function public.hair_touch_updated_at();

drop trigger if exists hair_products_touch on public.hair_products;
create trigger hair_products_touch before update on public.hair_products
  for each row execute function public.hair_touch_updated_at();

-- ---------------------------------------------------------------------
-- 4) Lecture publique, écriture réservée au service role
-- ---------------------------------------------------------------------
alter table public.hair_brands   enable row level security;
alter table public.hair_products enable row level security;

drop policy if exists hair_brands_read   on public.hair_brands;
drop policy if exists hair_products_read on public.hair_products;
create policy hair_brands_read   on public.hair_brands   for select using (true);
create policy hair_products_read on public.hair_products for select using (true);
-- Aucune policy d'écriture : seul SUPABASE_SERVICE_ROLE_KEY (qui contourne RLS) peut importer.

-- ---------------------------------------------------------------------
-- 5) Garde-fou : le catalogue cheveux ne doit jamais croiser le catalogue peau
--    (à lancer après import ; doit renvoyer 0 ligne)
-- ---------------------------------------------------------------------
-- select h.id, h.url from public.hair_products h
--   join public.skin_products s on s.id = h.id;
-- select h.url from public.hair_products h
--   join public.products p on p.url = h.url;

-- 23/09/2026 — trois colonnes ajoutees apres l'audit : sans elles, l'import
-- perdait les alertes qualite d'image (fiche sans photo, photo douteuse), le
-- detourage, et l'origine du ciblage (declare par la marque ou deduit).
alter table public.hair_products
  add column if not exists image_absente    boolean not null default false,
  add column if not exists image_incertaine boolean not null default false,
  add column if not exists cutout_url       text,
  add column if not exists ciblage_source   text;
