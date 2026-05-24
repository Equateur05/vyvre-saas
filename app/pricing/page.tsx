/**
 * VYVRE — /pricing page
 *
 * Single source of truth pour le pricing public.
 * Linked depuis les 27 POCs Firebase via : vyvre.fr/pricing?from=BRAND
 *
 * Comportement :
 * - Détecte ?from=BRAND → personnalise le header ("Vous venez de tester la démo X")
 * - 4 tiers : Pilot, Starter, Growth, Enterprise
 * - Toggle monthly/annual
 * - CTAs → Stripe Payment Links (avec client_reference_id pour tracking)
 */

import Link from 'next/link';
import PricingClient from './PricingClient';

export const metadata = {
  title: 'Pricing · VYVRE',
  description: 'Le seul standard premium compatible avec votre DPO. Infrastructure France, RGPD natif, on-device. Pilot gratuit, Starter 299€/mo, Growth 499€/mo, Enterprise sur devis.',
};

// ── Brand display name mapping ──
const BRAND_NAMES: Record<string, string> = {
  'caudalie': 'Caudalie',
  'sisley': 'Sisley',
  'chanel': 'Chanel',
  'dior': 'Dior',
  'guerlain': 'Guerlain',
  'valmont': 'Valmont',
  'augustinus-bader': 'Augustinus Bader',
  'la-prairie': 'La Prairie',
  'sk-ii': 'SK-II',
  'lyma': 'LYMA',
  'oneskin': 'OneSkin',
  'tally-health': 'Tally Health',
  'neko-health': 'Neko Health',
  'blueprint': 'Blueprint',
  'elysium': 'Elysium',
  'barbara-sturm': 'Dr. Barbara Sturm',
  'noble-panacea': 'Noble Panacea',
  'revive': 'Revive',
  'u-beauty': 'U Beauty',
  'helena-rubinstein': 'Helena Rubinstein',
  'embryolisse': 'Embryolisse',
  'biologique-recherche': 'Biologique Recherche',
  'aesop': 'Aesop',
  '111skin': '111SKIN',
  'tata-harper': 'Tata Harper',
  'beauty-of-joseon': 'Beauty of Joseon',
  'medicube': 'Medicube',
};

interface PricingPageProps {
  searchParams: { from?: string };
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const brandSlug = (searchParams.from || '').toLowerCase().trim();
  const brandName = BRAND_NAMES[brandSlug] || null;

  return (
    <main className="min-h-screen">
      {/* ===== Header ===== */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-line">
        <Link href="/" className="flex items-center gap-3 no-underline text-text">
          <div className="w-8 h-8 border border-text/30 rounded-full flex items-center justify-center text-[10px]">V</div>
          <span className="text-sm font-medium tracking-[0.18em]">VYVRE</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-text/60">
          <a href="https://vyvre-demos.web.app/SCAN_LIVE_DEMO_VYVRE.html" target="_blank" rel="noopener" className="hover:text-text">Démo</a>
          <Link href="/pricing" className="text-text">Pricing</Link>
          <a href="mailto:charles@vyvre.fr" className="hover:text-text">Contact</a>
        </nav>
      </header>

      {/* ===== Brand personalization banner (only if ?from=BRAND) ===== */}
      {brandName && (
        <section className="px-8 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4 text-sm px-6 py-4 rounded-full bg-accent/5 border border-accent/20 backdrop-blur">
            <span className="text-accent text-lg">✓</span>
            <div>
              <span className="text-text">Vous venez de tester la démo {brandName}</span>
              <span className="text-text/55 ml-2">— Choisissez votre plan pour l'activer sur votre site.</span>
            </div>
          </div>
        </section>
      )}

      {/* ===== Hero (style V6 minimal, compact) ===== */}
      <section className="px-8 py-8 md:py-12 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
            Tarification · VYVRE Business
          </span>
          <h1 className="font-sans text-3xl md:text-4xl font-light leading-[1.05] -tracking-[0.022em]">
            Le seul standard premium<br/>
            <span className="text-text/60">compatible avec votre DPO.</span>
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-text/45 max-w-xl leading-relaxed">
            Infrastructure France · RGPD natif · On-device · Activation 48h
          </p>
        </div>
      </section>

      {/* ===== Pricing Cards (client component for toggle) ===== */}
      <PricingClient brandSlug={brandSlug} />

      {/* ===== FAQ + Calendly ===== */}
      <section className="px-8 py-12 border-t border-line">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Pas encore prêt ?</span>
          <h2 className="font-sans text-3xl md:text-4xl font-extralight -tracking-[0.02em]">
            Réservez une démo de 20 minutes
          </h2>
          <p className="text-text/55 max-w-lg font-light">
            Charles, fondateur, vous montre le widget en visio + répond à toutes vos questions techniques et contractuelles.
          </p>
          <a
            href="https://calendly.com/charles-symphonydrive"
            target="_blank"
            rel="noopener"
            className="btn-secondary mt-4"
          >
            Réserver 20 min →
          </a>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="px-8 py-12 border-t border-line text-xs text-text/45 flex flex-wrap items-center justify-between gap-4 font-mono tracking-[0.15em] uppercase">
        <div>VYVRE · Paris, France 🇫🇷</div>
        <div className="flex items-center gap-6">
          <a href="mailto:charles@vyvre.fr" className="hover:text-text">charles@vyvre.fr</a>
          <Link href="/" className="hover:text-text">Accueil</Link>
        </div>
      </footer>
    </main>
  );
}
