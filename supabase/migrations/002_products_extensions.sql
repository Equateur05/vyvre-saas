-- VYVRE — Products table extensions
-- Run after 001_brands.sql
--
-- Adds:
--   - currency      (ISO 4217, defaults to EUR)
--   - concern_scores (jsonb) for smarter scan→product matching
--                    e.g. { "wrinkles": 0.9, "firmness": 0.8, "glow": 0.6 }
--                    (vs. `targets` which is just an unordered tag list)
--   - updated_at    (timestamptz) so we can track product catalog freshness

alter table public.products
  add column if not exists currency text not null default 'EUR'
    check (currency ~ '^[A-Z]{3}$');

alter table public.products
  add column if not exists concern_scores jsonb;

alter table public.products
  add column if not exists updated_at timestamptz not null default now();

-- Reuse the trigger function from 001_brands.sql
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Index for ordering products inside a brand
create index if not exists idx_products_brand_position
  on public.products (brand_id, position asc);
