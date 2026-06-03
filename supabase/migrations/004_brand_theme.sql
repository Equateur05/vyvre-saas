-- Thème UI choisi par la marque (sélectionné sur /pricing avant l'achat) → widget.
-- À appliquer AVANT de déployer le code qui écrit `theme` au provisioning.
alter table public.brands
  add column if not exists theme text not null default 'dark';

-- (optionnel) contrainte de valeurs
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'brands_theme_check'
  ) then
    alter table public.brands
      add constraint brands_theme_check check (theme in ('dark','light'));
  end if;
end $$;
