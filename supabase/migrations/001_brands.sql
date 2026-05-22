-- VYVRE — Brands table
-- Run this in Supabase SQL Editor (or via supabase db push)
--
-- Stores one row per marque cosmétique that signed up via Stripe.
-- Source of truth for: plan, quota usage, API key, auto-upgrade state.

create table if not exists public.brands (
  id                       uuid primary key default gen_random_uuid(),
  -- Identity
  email                    text unique not null,
  name                     text,
  -- Auth / SDK
  api_key                  text unique not null,
  -- Stripe linkage
  stripe_customer_id       text unique,
  stripe_subscription_id   text unique,
  -- Plan + quota
  plan                     text not null default 'pilot'
    check (plan in ('pilot', 'starter', 'growth', 'enterprise', 'cancelled')),
  scan_count_month         integer not null default 0,
  scan_count_prev_month    integer not null default 0,
  -- Auto-upgrade state
  overage_months           integer not null default 0,
  auto_upgraded_at         timestamptz,
  auto_upgrade_disabled    boolean not null default false,
  -- Branding (for white-label widget)
  logo_url                 text,
  primary_color            text default '#C8A96E',
  -- Timestamps
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_brands_api_key       on public.brands (api_key);
create index if not exists idx_brands_stripe_customer on public.brands (stripe_customer_id);
create index if not exists idx_brands_stripe_sub    on public.brands (stripe_subscription_id);
create index if not exists idx_brands_plan          on public.brands (plan) where plan != 'cancelled';

-- Auto-update `updated_at` on row change
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_brands_updated_at on public.brands;
create trigger trg_brands_updated_at before update on public.brands
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Scans table (anonymized — no photo data ever)
-- ============================================================================

create table if not exists public.scans (
  id                uuid primary key default gen_random_uuid(),
  brand_id          uuid not null references public.brands(id) on delete cascade,
  timestamp         timestamptz not null default now(),
  scores            jsonb,  -- { hydration: 72, wrinkles: 41, ... }
  completed         boolean not null default false,
  product_clicked   text,
  -- Coarse demographics (optional, anonymized)
  user_agent_hash   text,
  country_code      text   -- ISO 3166-1 alpha-2
);

create index if not exists idx_scans_brand_id   on public.scans (brand_id);
create index if not exists idx_scans_timestamp  on public.scans (timestamp desc);

-- ============================================================================
-- Products catalog (one per brand, for in-widget recommendations)
-- ============================================================================

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands(id) on delete cascade,
  name        text not null,
  image_url   text,
  url         text,
  price_eur   numeric(10,2),
  targets     jsonb,  -- ['hydration', 'wrinkles', ...]
  position    integer default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_products_brand on public.products (brand_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- For now: only service_role (backend) can read/write. Brands access via API key
-- through our /api/* endpoints, which use the service_role internally.

alter table public.brands   enable row level security;
alter table public.scans    enable row level security;
alter table public.products enable row level security;

-- No public policies — all access via server-side service_role.
-- Add policies later if we expose direct supabase-js usage to brands.
