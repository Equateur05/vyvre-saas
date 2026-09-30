'use client';

/**
 * VYVRE Pricing — composant client (style AURA·OS V6)
 * Les textes arrivent déjà traduits depuis la page serveur : aucun
 * dictionnaire n'est envoyé au navigateur.
 */

import { useState } from 'react';


export interface PricingStrings {
  monthly: string;
  annual: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
  themeNote: string;
  plan: string;
  recommended: string;
  perMonth: string;
  trust: string;
  tiers: {
    tier: string;
    price: string;
    priceAnnual: string;
    suffix: string;
    sub: string;
    subAnnual: string;
    features: string[];
    cta: string;
    recommended: boolean;
    linkMonthly: string;
    linkAnnual: string;
    refMonthly: string;
    refAnnual: string;
  }[];
}

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

export default function PricingClient({
  brandSlug,
  s,
  rtl = false,
}: {
  brandSlug: string;
  s: PricingStrings;
  rtl?: boolean;
}) {
  // 30/09/2026 : la remise annuelle est retiree (decision de Charles) : offre mensuelle uniquement.
  const annual = false;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <section className="px-8 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Thème du widget, choisi avant l'achat */}
        <div className="flex flex-col items-center gap-2.5 mb-12">
          <div className="text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono">{s.themeLabel}</div>
          <div className="inline-flex items-center gap-1 p-1 border border-line rounded-full text-xs font-mono tracking-[0.12em] uppercase backdrop-blur">
            <button
              onClick={() => setTheme('dark')}
              className={`px-5 py-2 rounded-full transition-colors flex items-center gap-2 ${theme === 'dark' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#0A0A0A', border: '1px solid rgba(160,160,160,0.6)' }} />
              {s.themeDark}
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-5 py-2 rounded-full transition-colors flex items-center gap-2 ${theme === 'light' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: '#F4F1EA', border: '1px solid rgba(0,0,0,0.3)' }} />
              {s.themeLight}
            </button>
          </div>
          <div className="text-[10px] text-text/35 font-mono tracking-[0.05em]">
            {s.themeNote}
          </div>
        </div>

        {/* 4 plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {s.tiers.map((c) => (
            <Card
              key={c.tier}
              tier={c.tier}
              planLabel={s.plan}
              recommendedLabel={s.recommended}
              price={annual ? c.priceAnnual : c.price}
              priceSuffix={c.suffix}
              subtitle={annual ? c.subAnnual : c.sub}
              features={c.features}
              ctaLabel={c.cta}
              ctaUrl={buildLink(
                annual ? c.linkAnnual : c.linkMonthly,
                brandSlug,
                annual ? c.refAnnual : c.refMonthly,
                theme
              )}
              recommended={c.recommended}
              rtl={rtl}
            />
          ))}
        </div>

        {/* Ligne de confiance */}
        <div className="mt-10 text-center text-xs text-text/45 font-mono tracking-[0.18em] uppercase">
          {s.trust}
        </div>
      </div>
    </section>
  );
}

function Card({
  tier, planLabel, recommendedLabel, price, priceSuffix, subtitle, features, ctaLabel, ctaUrl, recommended, rtl,
}: {
  tier: string;
  planLabel: string;
  recommendedLabel: string;
  price: string;
  priceSuffix: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  recommended: boolean;
  rtl: boolean;
}) {
  return (
    <div style={recommended ? CARD_RECOMMENDED : CARD_STYLE}>
      <div style={VIGNETTE} />

      <span
        className="vy-plan-label"
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
        {recommended ? `${planLabel} : ${tier} · ${recommendedLabel}` : `${planLabel} : ${tier}`}
      </span>

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
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginInlineStart: '6px', fontWeight: 300, letterSpacing: '0' }}>
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

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '32px 0 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            textAlign: rtl ? 'right' : 'left',
          }}
        >
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.55,
                paddingInlineStart: '18px',
                position: 'relative',
                fontWeight: 300,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  insetInlineStart: 0,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >·</span>
              {f}
            </li>
          ))}
        </ul>

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
              textAlign: 'center',
              lineHeight: 1.35,
              transition: 'all 0.3s ease',
              ...(recommended
                ? { background: '#FFFFFF', color: '#000', boxShadow: '0 14px 36px rgba(255,255,255,0.12)' }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: '#FFFFFF' }
              ),
            }}
          >
            {ctaLabel} {rtl ? '←' : '→'}
          </span>
        </a>
      </div>
    </div>
  );
}
