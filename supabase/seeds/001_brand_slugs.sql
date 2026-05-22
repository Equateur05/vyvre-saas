-- VYVRE — Demo brands seed
-- Run after migrations 001/002/003.
--
-- Seeds 27 brand rows that map to the 27 production POCs hosted on
-- https://vyvre-demos.web.app. Each row uses:
--   email   = demo+<slug>@vyvre.fr        (unique-by-constraint)
--   api_key = vyv_demo_<slug>_<pad>       (unique-by-constraint, 32+ chars)
--   plan    = 'pilot'                     (demo tier)
--
-- These are SAFE to seed in prod — the demo API keys are not active SDK keys
-- and the email addresses are owned by VYVRE. `on conflict (slug) do nothing`
-- makes this idempotent.

insert into public.brands (slug, name, email, api_key, plan) values
  ('caudalie',           'Caudalie',           'demo+caudalie@vyvre.fr',           'vyv_demo_caudalie_seed_000000000001',           'pilot'),
  ('sisley',             'Sisley Paris',       'demo+sisley@vyvre.fr',             'vyv_demo_sisley_seed_000000000002',             'pilot'),
  ('chanel',             'Chanel',             'demo+chanel@vyvre.fr',             'vyv_demo_chanel_seed_000000000003',             'pilot'),
  ('dior',               'Dior',               'demo+dior@vyvre.fr',               'vyv_demo_dior_seed_000000000004',               'pilot'),
  ('guerlain',           'Guerlain',           'demo+guerlain@vyvre.fr',           'vyv_demo_guerlain_seed_000000000005',           'pilot'),
  ('valmont',            'Valmont',            'demo+valmont@vyvre.fr',            'vyv_demo_valmont_seed_000000000006',            'pilot'),
  ('augustinus-bader',   'Augustinus Bader',   'demo+augustinus-bader@vyvre.fr',   'vyv_demo_augustinus_bader_seed_000007',         'pilot'),
  ('la-prairie',         'La Prairie',         'demo+la-prairie@vyvre.fr',         'vyv_demo_la_prairie_seed_000000000008',         'pilot'),
  ('sk-ii',              'SK-II',              'demo+sk-ii@vyvre.fr',              'vyv_demo_sk_ii_seed_000000000000009',           'pilot'),
  ('lyma',               'LYMA',               'demo+lyma@vyvre.fr',               'vyv_demo_lyma_seed_000000000000000010',         'pilot'),
  ('oneskin',            'OneSkin',            'demo+oneskin@vyvre.fr',            'vyv_demo_oneskin_seed_000000000000011',         'pilot'),
  ('tally-health',       'Tally Health',       'demo+tally-health@vyvre.fr',       'vyv_demo_tally_health_seed_0000000012',         'pilot'),
  ('neko-health',        'Neko Health',        'demo+neko-health@vyvre.fr',        'vyv_demo_neko_health_seed_00000000013',         'pilot'),
  ('blueprint',          'Blueprint',          'demo+blueprint@vyvre.fr',          'vyv_demo_blueprint_seed_000000000014',          'pilot'),
  ('elysium',            'Elysium Health',     'demo+elysium@vyvre.fr',            'vyv_demo_elysium_seed_000000000000015',         'pilot'),
  ('barbara-sturm',      'Dr. Barbara Sturm',  'demo+barbara-sturm@vyvre.fr',      'vyv_demo_barbara_sturm_seed_000000016',         'pilot'),
  ('noble-panacea',      'Noble Panacea',      'demo+noble-panacea@vyvre.fr',      'vyv_demo_noble_panacea_seed_000000017',         'pilot'),
  ('revive',             'RéVive Skincare',    'demo+revive@vyvre.fr',             'vyv_demo_revive_seed_0000000000000018',         'pilot'),
  ('u-beauty',           'U Beauty',           'demo+u-beauty@vyvre.fr',           'vyv_demo_u_beauty_seed_00000000000019',         'pilot'),
  ('helena-rubinstein',  'Helena Rubinstein',  'demo+helena-rubinstein@vyvre.fr',  'vyv_demo_helena_rubinstein_seed_00020',         'pilot'),
  ('embryolisse',        'Embryolisse',        'demo+embryolisse@vyvre.fr',        'vyv_demo_embryolisse_seed_0000000021',          'pilot'),
  ('biologique-recherche','Biologique Recherche','demo+biologique-recherche@vyvre.fr','vyv_demo_biologique_recherche_022',          'pilot'),
  ('aesop',              'Aesop',              'demo+aesop@vyvre.fr',              'vyv_demo_aesop_seed_000000000000000023',        'pilot'),
  ('111skin',            '111SKIN',            'demo+111skin@vyvre.fr',            'vyv_demo_111skin_seed_0000000000000024',        'pilot'),
  ('tata-harper',        'Tata Harper',        'demo+tata-harper@vyvre.fr',        'vyv_demo_tata_harper_seed_0000000025',          'pilot'),
  ('beauty-of-joseon',   'Beauty of Joseon',   'demo+beauty-of-joseon@vyvre.fr',   'vyv_demo_beauty_of_joseon_seed_00026',          'pilot'),
  ('medicube',           'Medicube',           'demo+medicube@vyvre.fr',           'vyv_demo_medicube_seed_00000000027',            'pilot')
on conflict (slug) do nothing;
