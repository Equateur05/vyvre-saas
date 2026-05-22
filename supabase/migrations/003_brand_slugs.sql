-- VYVRE — Add `slug` column to brands so POCs can fetch products by slug.
-- Slug is the URL-safe brand identifier used in POC HTML files
-- (e.g. "sisley", "augustinus-bader", "barbara-sturm").

alter table public.brands
  add column if not exists slug text;

-- Unique index — but only when slug is set (allows existing rows w/ NULL slug)
create unique index if not exists idx_brands_slug
  on public.brands (slug)
  where slug is not null;

-- Slugs are lowercase ASCII + hyphens (kebab-case)
alter table public.brands
  drop constraint if exists brands_slug_format;
alter table public.brands
  add constraint brands_slug_format
  check (slug is null or slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$');
