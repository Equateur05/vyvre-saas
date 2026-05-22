# VYVRE — SaaS backend

> Next.js 14 · Supabase EU · Stripe · Resend
> Backend du widget VYVRE — gère le checkout, le provisioning des marques, l'envoi de l'embed code, et l'auto-upgrade.

## 🎯 Ce que ce projet fait

Quand une marque cosmétique paie sur Stripe :
1. **Stripe** envoie l'event `checkout.session.completed` → `/api/stripe/webhook`
2. Le webhook **crée la marque** dans Supabase + **génère une API key** (`vyv_pk_xxx`)
3. **Resend** envoie un email automatique avec embed code + 3 étapes
4. **Stripe redirige** vers `/success?session_id=xxx`
5. La page success **affiche l'embed code prêt à copier**

Zéro intervention humaine. La marque copie le code → widget live sur son site.

## 📦 Stack

| Couche | Outil | Région |
|---|---|---|
| Frontend | Next.js 14 App Router + Tailwind | Vercel (edge) |
| DB + Auth | Supabase | **eu-west-1** Dublin |
| Paiement | Stripe (LIVE) | EU |
| Email | Resend | EU |
| Domaine | vyvre.fr (GoDaddy) | — |

## 🚀 Setup

### 1. Install
```bash
cd /Users/charles/Documents/vyvre/saas
npm install
```

### 2. Variables d'env
```bash
cp .env.local.example .env.local
# Remplis les valeurs (voir /Users/charles/Desktop/VYVRE_AUDIT_PREREQUIS_SAAS.md)
```

### 3. Supabase
- Va sur le projet `vyvre` (org Repward, eu-west-1)
- SQL Editor → colle le contenu de `supabase/migrations/001_brands.sql`
- Run

### 4. Stripe webhook
- Dashboard → Developers → Webhooks → Add endpoint
- URL : `https://vyvre.fr/api/stripe/webhook`
- Events : `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copie le Signing secret → `STRIPE_WEBHOOK_SECRET` dans `.env.local`

### 5. Resend
- resend.com → API Keys → Create
- Domains → Add domain `vyvre.fr`
- Ajoute records DNS (SPF + DKIM) chez GoDaddy
- Verify domain

### 6. Run local
```bash
npm run dev
# → http://localhost:3000
```

### 7. Deploy Vercel
```bash
npx vercel
# Ajoute les variables d'env via Vercel dashboard
# Pointe DNS vyvre.fr A record vers Vercel
```

## 🗺️ Structure

```
/saas
├── /app
│   ├── layout.tsx              ← Root layout (fonts, metadata)
│   ├── page.tsx                ← Landing (minimal MVP)
│   ├── globals.css             ← Tailwind base
│   ├── /success
│   │   ├── page.tsx            ← Post-checkout: shows embed code
│   │   └── EmbedCard.tsx       ← Client: clipboard copy
│   └── /api
│       └── /stripe
│           ├── /webhook/route.ts    ← Receives Stripe events
│           └── /session/route.ts    ← For /success to fetch + provision
├── /lib
│   ├── supabase.ts             ← Server (service_role) + client
│   ├── stripe.ts               ← Stripe SDK + Price IDs + ladder
│   ├── email.ts                ← Resend welcome + upgrade emails
│   ├── api-key.ts              ← vyv_pk_xxx generation
│   └── brand-provisioning.ts   ← Idempotent provision (webhook + /success)
└── /supabase
    └── /migrations/001_brands.sql
```

## 🔐 Sécurité

- Service role key uniquement côté serveur (jamais bundlé client)
- Webhook signature vérifiée via `stripe.webhooks.constructEvent`
- API key au format `vyv_pk_xxx` (32 hex chars, 128 bits d'entropie)
- Pas de RLS pour l'instant (tout passe via service_role) — à ajouter quand on expose Supabase aux marques en direct

## 🧪 Test E2E

1. Va sur `https://buy.stripe.com/5kQfZh2Ns17Zgrh0tI1VK0G` (Pilot LIVE)
2. Paye (gratuit, 0€)
3. Stripe redirige vers `vyvre.fr/success?session_id=cs_xxx`
4. Tu vois ton embed code avec une vraie API key `vyv_pk_xxx`
5. Tu reçois un email Resend "Bienvenue chez VYVRE" avec le même code
6. Vérifie dans Supabase Table Editor → brands → ta marque est créée

## 🚧 TODO (V2)

- [ ] Pricing page `/pricing` avec 4 cards + toggle mensuel/annuel
- [ ] Dashboard `/dashboard` (overview + widget + branding + products + analytics + billing)
- [ ] Widget `/widget.js` lui-même (Shadow DOM, face-api.js, Three.js)
- [ ] Stripe Billing Meters pour overage scans (Starter/Growth/Enterprise)
- [ ] Reset mensuel cron Vercel (1er du mois)
- [ ] Rate limiting `/api/scan/event` (Upstash Redis 10 req/s)
- [ ] Tax setup Stripe Tax FR
- [ ] Customer Portal `/dashboard/billing` (cancel/upgrade)

## 📚 Doc

- Audit prérequis : `/Users/charles/Desktop/VYVRE_AUDIT_PREREQUIS_SAAS.md`
- Stripe config : `/Users/charles/Documents/vyvre/docs/pocs/dist/stripe-config.js`
- POCs marques : `/Users/charles/Desktop/VYVRE_LIENS_PAR_MARQUE.md`

---

VYVRE · Charles Rocher · Paris, France 🇫🇷
