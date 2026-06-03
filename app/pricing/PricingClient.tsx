'use client';

/**
 * VYVRE Pricing — Client component (style AURA·OS V6)
 * Gradient radial gris ultra-marqué + label mono top-right + Inter weight 300
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

function buildLink(baseUrl: string, brandSlug: string, tier: string, theme: 'dark' | 'light'): string {
  const ref = (brandSlug ? `${brandSlug}_${tier}` : `direct_${tier}`) + `-theme-${theme}`;
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}client_reference_id=${encodeURIComponent(ref)}`;
}

// Style AURA·OS V6 partagé entre cards
const CARD_STYLE: React.CSSProperties = {
  position: 'relative',
  background: `
    radial-gradient(ellipse 140% 100% at 50% -15%, rgba(235,235,240,0.78) 0%, rgba(180,180,188,0.55) 15%, rgba(110,110,118,0.32) 35%, rgba(50,50,58,0.15) 55%, transparent 75%),
    linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%),
    #000
  `,
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '28px',
  padding: '32px 28px 40px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '380px',
};

const CARD_RECOMMENDED: React.CSSProperties = {
  ...CARD_STYLE,
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 30px 80px rgba(255,255,255,0.05)',
};

const VIGNETTE: React.CSSProperties = {
  content: '',
  position: 'absolute',
  inset: 0,
  borderRadius: '28px',
  background: 'radial-gradient(ellipse 100% 80% at 50% 110%, rgba(0,0,0,0.85) 0%, transparent 60%)',
  pointerEvents: 'none',
  zIndex: 1,
};

export default function PricingClient({ brandSlug }: { brandSlug: string }) {
  const [annual, setAnnual] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const pilotLink      = buildLink(STRIPE_LINKS.pilot,      brandSlug, 'pilot', theme);
  const starterLink    = buildLink(annual ? STRIPE_LINKS.starter_annual    : STRIPE_LINKS.starter_monthly,    brandSlug, annual ? 'starter_annual' : 'starter_monthly', theme);
  const growthLink     = buildLink(annual ? STRIPE_LINKS.growth_annual     : STRIPE_LINKS.growth_monthly,     brandSlug, annual ? 'growth_annual'  : 'growth_monthly', theme);
  const enterpriseLink = buildLink(annual ? STRIPE_LINKS.enterprise_annual : STRIPE_LINKS.enterprise_monthly, brandSlug, annual ? 'enterprise_annual' : 'enterprise_monthly', theme);

  return (
    <section className="px-8 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Toggle Mensuel / Annuel */}
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

        {/* Sélecteur thème du widget (choisi AVANT l'achat, persisté pour la marque) */}
        <div className="flex flex-col items-center gap-2.5 mb-12">
          <div className="text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono">Thème de votre widget</div>
          <div className="inline-flex items-center gap-1 p-1 border border-line rounded-full text-xs font-mono tracking-[0.12em] uppercase backdrop-blur">
            <button
              onClick={() => setTheme('dark')}
              className={`px-5 py-2 rounded-full transition-colors flex items-center gap-2 ${theme === 'dark' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#0A0A0A', border: '1px solid rgba(160,160,160,0.6)' }} />
              Noir
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-5 py-2 rounded-full transition-colors flex items-center gap-2 ${theme === 'light' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#F4F1EA', border: '1px solid rgba(0,0,0,0.3)' }} />
              Blanc
            </button>
          </div>
          <div className="text-[10px] text-text/35 font-mono tracking-[0.05em]">
            Votre diagnostic s&apos;affichera dans ce thème · modifiable ensuite
          </div>
        </div>

        {/* 4 cards style V6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card
            tier="Pilot"
            price="Gratuit"
            priceSuffix=""
            subtitle="30 jours · sans engagement"
            features={[
              '1 000 scans / mois',
              'SDK Web',
              'Branding VYVRE',
              'Support email 48h',
              'Infrastructure France',
            ]}
            ctaLabel="Démarrer gratuitement"
            ctaUrl={pilotLink}
            recommended={false}
          />

          <Card
            tier="Starter"
            price={annual ? '249 €' : '299 €'}
            priceSuffix="/mois"
            subtitle={annual ? '2 990 € / an · 2 mois offerts' : '5 000 scans / mois'}
            features={[
              '5 000 scans / mois',
              '0,02 € par scan supp.',
              'SDK Web + iOS + Android',
              'White-label complet',
              'SLA 99.9% · support prioritaire',
            ]}
            ctaLabel="Démarrer l'essai gratuit"
            ctaUrl={starterLink}
            recommended={false}
          />

          <Card
            tier="Growth"
            price={annual ? '415 €' : '499 €'}
            priceSuffix="/mois"
            subtitle={annual ? '4 990 € / an · 2 mois offerts' : '15 000 scans / mois'}
            features={[
              '15 000 scans / mois',
              '0,015 € par scan supp.',
              'Tout Starter +',
              'Multi-marques (jusqu\'à 5)',
              'Account Manager dédié',
            ]}
            ctaLabel="Choisir Growth"
            ctaUrl={growthLink}
            recommended={true}
          />

          <Card
            tier="Enterprise"
            price={annual ? '582 €' : '699 €'}
            priceSuffix="/mois"
            subtitle={annual ? 'à partir de · contrat custom' : 'à partir de · sans engagement'}
            features={[
              '25 000 scans / mois',
              '0,01 € par scan supp.',
              'Réseau illimité boutiques',
              'App mobile native',
              'SLA 99.99% · Director 24/7',
            ]}
            ctaLabel="Nous contacter"
            ctaUrl={enterpriseLink}
            recommended={false}
          />

        </div>

        {/* Trust line */}
        <div className="mt-10 text-center text-xs text-text/45 font-mono tracking-[0.18em] uppercase">
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
    <div style={recommended ? CARD_RECOMMENDED : CARD_STYLE}>
      {/* Vignette bottom dark */}
      <div style={VIGNETTE} />

      {/* Label mono top-right (style V6 "Cible : XXX") */}
      <span
        style={{
          position: 'absolute',
          top: '26px',
          right: '28px',
          fontFamily: '"JetBrains Mono", "SF Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 400,
          zIndex: 3,
        }}
      >
        {recommended ? `Plan : ${tier} · Recommandé` : `Plan : ${tier}`}
      </span>

      {/* Titre principal centré (Inter weight 300, style V6) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '60px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {/* Prix (gros chiffre comme le score V6) */}
        <div
          style={{
            fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
            fontSize: 'clamp(36px, 3vw, 48px)',
            fontWeight: 200,
            letterSpacing: '-0.035em',
            lineHeight: 1,
            color: '#FFFFFF',
          }}
        >
          {price}
          {priceSuffix && (
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginLeft: '6px', fontWeight: 300, letterSpacing: '0' }}>
              {priceSuffix}
            </span>
          )}
        </div>

        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '12px',
            textAlign: 'center',
          }}
        >
          {subtitle}
        </div>

        {/* Features list */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '32px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            textAlign: 'left',
          }}
        >
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.55,
                paddingLeft: '18px',
                position: 'relative',
                fontWeight: 300,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >·</span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA bottom */}
        <a
          href={ctaUrl}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'auto',
            paddingTop: '32px',
            width: '100%',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 24px',
              width: '100%',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 500,
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              ...(recommended
                ? { background: '#FFFFFF', color: '#000', boxShadow: '0 14px 36px rgba(255,255,255,0.12)' }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: '#FFFFFF' }
              ),
            }}
          >
            {ctaLabel} →
          </span>
        </a>
      </div>
    </div>
  );
}
