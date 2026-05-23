'use client';

/**
 * VYVRE Pricing — Client component (toggle monthly/annual + CTA clicks)
 */

import { useState } from 'react';

// ── Stripe Payment Links (LIVE) ──
const STRIPE_LINKS = {
  pilot:               'https://buy.stripe.com/5kQfZh2Ns17Zgrh0tI1VK0G',
  starter_monthly:     'https://buy.stripe.com/6oUfZh2NsbMD6QHgsG1VK0H',
  starter_annual:      'https://buy.stripe.com/cNi28r3RwdULb6X6S61VK0I',
  growth_monthly:      'https://buy.stripe.com/fZu7sLbjY17Za2T7Wa1VK0J',
  growth_annual:       'https://buy.stripe.com/3cIaEXco28ArgrhfoC1VK0K',
  enterprise_monthly:  'https://buy.stripe.com/28EaEX87MbMD1wnb8m1VK0L',
  enterprise_annual:   'https://buy.stripe.com/aFa28r87M4kb1wnfoC1VK0M',
};

function buildLink(baseUrl: string, brandSlug: string, tier: string): string {
  const ref = brandSlug ? `${brandSlug}_${tier}` : `direct_${tier}`;
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}client_reference_id=${encodeURIComponent(ref)}`;
}

export default function PricingClient({ brandSlug }: { brandSlug: string }) {
  const [annual, setAnnual] = useState(false);

  const pilotLink      = buildLink(STRIPE_LINKS.pilot,      brandSlug, 'pilot');
  const starterLink    = buildLink(annual ? STRIPE_LINKS.starter_annual    : STRIPE_LINKS.starter_monthly,    brandSlug, annual ? 'starter_annual' : 'starter_monthly');
  const growthLink     = buildLink(annual ? STRIPE_LINKS.growth_annual     : STRIPE_LINKS.growth_monthly,     brandSlug, annual ? 'growth_annual'  : 'growth_monthly');
  const enterpriseLink = buildLink(annual ? STRIPE_LINKS.enterprise_annual : STRIPE_LINKS.enterprise_monthly, brandSlug, annual ? 'enterprise_annual' : 'enterprise_monthly');

  return (
    <section className="px-8 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 border border-line rounded-full text-xs font-mono tracking-[0.12em] uppercase backdrop-blur">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full transition-colors ${!annual ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >Mensuel</button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full transition-colors ${annual ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >Annuel <span className="text-accent">· -17%</span></button>
          </div>
        </div>

        {/* 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* ── PILOT ── */}
          <Card
            tier="Pilot"
            price="Gratuit"
            priceSuffix=""
            subtitle="30 jours · sans engagement"
            features={[
              '1 000 scans / mois',
              'SDK Web',
              'Branding VYVRE par défaut',
              'Support email 48h',
              'Infrastructure France 🇫🇷',
            ]}
            ctaLabel="Démarrer gratuitement"
            ctaUrl={pilotLink}
            recommended={false}
          />

          {/* ── STARTER ── */}
          <Card
            tier="Starter"
            price={annual ? '249 €' : '299 €'}
            priceSuffix={annual ? '/mois' : '/mois'}
            subtitle={annual ? '2 990 € facturé annuellement · 2 mois offerts' : '5 000 scans / mois · sans engagement'}
            features={[
              '5 000 scans / mois inclus',
              '0,02 € par scan supplémentaire',
              'SDK Web + iOS + Android',
              'White-label complet',
              'Dashboard analytics premium',
              'SLA 99.9% · support prioritaire',
              'Onboarding 48h',
            ]}
            ctaLabel="Démarrer l'essai gratuit"
            ctaUrl={starterLink}
            recommended={false}
          />

          {/* ── GROWTH (recommended) ── */}
          <Card
            tier="Growth"
            price={annual ? '415 €' : '499 €'}
            priceSuffix="/mois"
            subtitle={annual ? '4 990 € facturé annuellement · 2 mois offerts' : '15 000 scans / mois · sans engagement'}
            features={[
              '15 000 scans / mois inclus',
              '0,015 € par scan supplémentaire',
              'Tout Starter +',
              'Multi-marques (jusqu\'à 5)',
              'Dashboard avancé multi-stores',
              'Account Manager dédié',
              'Onboarding équipe sur site',
            ]}
            ctaLabel="Choisir Growth"
            ctaUrl={growthLink}
            recommended={true}
          />

          {/* ── ENTERPRISE ── */}
          <Card
            tier="Enterprise"
            price={annual ? '582 €' : '699 €'}
            priceSuffix="/mois"
            subtitle={annual ? 'à partir de · contrat annuel custom' : 'à partir de · sans engagement'}
            features={[
              '25 000 scans / mois inclus',
              '0,01 € par scan supplémentaire',
              'Réseau illimité de boutiques',
              'App mobile native (App Store)',
              'API brute + intégrations custom',
              'R&D conjointe × VYVRE Labs',
              'SLA 99.99% · Account Director 24/7',
              'Rapport data insights trimestriel',
            ]}
            ctaLabel="Nous contacter"
            ctaUrl={enterpriseLink}
            recommended={false}
          />

        </div>

        {/* Trust signals */}
        <div className="mt-12 text-center text-xs text-text/45 font-mono tracking-[0.15em] uppercase">
          Tarification publique · TVA en supplément · Annulation à tout moment
        </div>
      </div>
    </section>
  );
}

function Card({
  tier, price, priceSuffix, subtitle, features, ctaLabel, ctaUrl, recommended,
}: {
  tier: string;
  price: string;
  priceSuffix: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  recommended: boolean;
}) {
  return (
    <div
      className={`relative p-7 flex flex-col gap-5 border rounded-3xl ${
        recommended
          ? 'border-accent bg-accent/5 shadow-[0_0_60px_-20px_rgba(200,169,110,0.4)]'
          : 'border-line bg-glass'
      }`}
      style={{
        background: recommended
          ? 'radial-gradient(ellipse at 0% 0%, rgba(200,169,110,0.08) 0%, rgba(200,169,110,0.02) 35%, rgba(255,255,255,0.005) 100%)'
          : 'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.005) 100%)',
      }}
    >
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-bg px-4 py-1.5 text-[9px] tracking-[0.25em] uppercase font-semibold font-mono rounded-full">
          Recommandé
        </span>
      )}

      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${recommended ? 'bg-accent' : 'bg-text/35'}`}></span>
        <span className={`text-[10px] tracking-[0.3em] uppercase font-mono ${recommended ? 'text-accent' : 'text-text/65'}`}>{tier}</span>
      </div>

      <div>
        <div className="font-sans text-5xl font-extralight leading-none -tracking-[0.03em]">
          {price}
          {priceSuffix && <span className="text-base text-text/55 ml-1 font-light tracking-normal">{priceSuffix}</span>}
        </div>
        <div className="text-[11px] text-text/55 font-mono mt-2 tracking-[0.05em]">{subtitle}</div>
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-[13px] text-text/80 leading-relaxed pl-4 relative">
            <span className={`absolute left-0 ${recommended ? 'text-accent' : 'text-accent/70'}`}>·</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={ctaUrl}
        className={`block text-center py-3.5 text-xs tracking-[0.15em] uppercase font-medium transition-opacity rounded-full ${
          recommended
            ? 'bg-accent text-bg hover:opacity-90'
            : 'border border-text/40 text-text hover:bg-text hover:text-bg'
        }`}
      >
        {ctaLabel} →
      </a>
    </div>
  );
}
