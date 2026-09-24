/**
 * VYVRE — /pricing
 *
 * Source unique du tarif public, dans les douze langues.
 * Appelée depuis les démonstrations par : vyvre.fr/pricing?from=MARQUE
 *
 * Comportement :
 * - ?from=MARQUE → bandeau personnalisé et lien de démonstration de la marque
 * - 4 plans : Pilot, Starter, Growth, Enterprise
 * - bascule mensuel / annuel
 * - boutons → Stripe Payment Links (client_reference_id pour le suivi)
 * - les prix restent en euros dans toutes les langues
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import SiteHeader from '../SiteHeader';
import PricingClient, { type PricingStrings } from './PricingClient';
import { STRIPE_LINKS } from './links';
import { getPage } from '../../lib/i18n/server';
import type { T } from '../../lib/i18n';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('pri.meta.title'), description: t('pri.meta.desc') };
}

// ── Noms de marque affichés ──
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
  // marques anglophones (anciennement /pricing/en)
  'sturm': 'Dr. Barbara Sturm',
  'laneige': 'Laneige',
  'innisfree': 'Innisfree',
  'sulwhasoo': 'Sulwhasoo',
  'cosrx': 'COSRX',
  'some-by-mi': 'Some By Mi',
  'mizon': 'Mizon',
  'klairs': 'Klairs',
  'pyunkang-yul': 'Pyunkang Yul',
  'round-lab': 'Round Lab',
  'anua': 'ANUA',
  'skin1004': 'SKIN1004',
  'tirtir': 'TIRTIR',
  'torriden': 'Torriden',
  'mediheal': 'Mediheal',
  'etude-house': 'Etude House',
  'cerave': 'CeraVe',
  'cetaphil': 'Cetaphil',
  'olay': 'Olay',
  'neutrogena': 'Neutrogena',
  'the-ordinary': 'The Ordinary',
  'drunk-elephant': 'Drunk Elephant',
  'glow-recipe': 'Glow Recipe',
  'youth-to-the-people': 'Youth To The People',
  'versed': 'Versed',
  'bubble-skincare': 'Bubble Skincare',
  'tatcha': 'Tatcha',
  'glossier': 'Glossier',
  'murad': 'Murad',
  'eucerin': 'Eucerin',
  'sensilis': 'Sensilis',
  'clinique': 'Clinique',
  'estee-lauder': 'Estée Lauder',
  'shiseido': 'Shiseido',
  'kiehls': 'Kiehl’s',
  'fresh': 'Fresh',
  'origins': 'Origins',
  'bobbi-brown': 'Bobbi Brown',
  'the-inkey-list': 'The INKEY List',
  'beauty-pie': 'Beauty Pie',
  'liz-earle': 'Liz Earle',
  'trinny-london': 'Trinny London',
  'charlotte-tilbury': 'Charlotte Tilbury',
  'wishful': 'Wishful',
  'hada-labo': 'Hada Labo',
  'curel': 'Curél',
  'senka': 'Senka',
  'sand-and-sky': 'Sand & Sky',
};

// ── Exceptions slug → fichier de démonstration ──
// Convention par défaut : VYVRE_<SLUG_MAJUSCULE_UNDERSCORE>.html
const DEMO_SLUG_OVERRIDES: Record<string, string> = {
  'barbara-sturm': 'STURM',
};

const DEMO_BASE_URL = 'https://vyvre-demos.web.app';
const GENERIC_DEMO_URL = `${DEMO_BASE_URL}/SCAN_LIVE_DEMO_VYVRE.html`;

function getDemoUrl(brandSlug: string): string {
  if (!brandSlug || !/^[a-z0-9][a-z0-9-]{1,40}$/.test(brandSlug)) return GENERIC_DEMO_URL;
  const token = DEMO_SLUG_OVERRIDES[brandSlug] || brandSlug.toUpperCase().replace(/-/g, '_');
  return `${DEMO_BASE_URL}/VYVRE_${token}.html`;
}

function pricingStrings(t: T): PricingStrings {
  return {
    monthly: t('pri.toggle.monthly'),
    annual: t('pri.toggle.annual'),
    themeLabel: t('pri.theme.label'),
    themeDark: t('pri.theme.dark'),
    themeLight: t('pri.theme.light'),
    themeNote: t('pri.theme.note'),
    plan: t('pri.card.plan'),
    recommended: t('pri.card.recommended'),
    perMonth: t('pri.per.month'),
    trust: t('pri.trust'),
    tiers: [
      {
        tier: 'Pilot',
        price: t('pri.pilot.price'),
        priceAnnual: t('pri.pilot.price'),
        suffix: '',
        sub: t('pri.pilot.sub'),
        subAnnual: t('pri.pilot.sub'),
        features: [
          t('pri.pilot.f1'),
          t('pri.pilot.f2'),
          t('pri.pilot.f3'),
          t('pri.pilot.f4'),
          t('pri.pilot.f5'),
        ],
        cta: t('pri.pilot.cta'),
        recommended: false,
        linkMonthly: STRIPE_LINKS.pilot,
        linkAnnual: STRIPE_LINKS.pilot,
        refMonthly: 'pilot',
        refAnnual: 'pilot',
      },
      {
        tier: 'Starter',
        price: '299 €',
        priceAnnual: '249 €',
        suffix: t('pri.per.month'),
        sub: t('pri.starter.subM'),
        subAnnual: t('pri.starter.subA'),
        features: [
          t('pri.starter.f1'),
          t('pri.starter.f2'),
          t('pri.starter.f3'),
          t('pri.starter.f4'),
          t('pri.starter.f5'),
        ],
        cta: t('pri.starter.cta'),
        recommended: false,
        linkMonthly: STRIPE_LINKS.starter_monthly,
        linkAnnual: STRIPE_LINKS.starter_annual,
        refMonthly: 'starter_monthly',
        refAnnual: 'starter_annual',
      },
      {
        tier: 'Growth',
        price: '499 €',
        priceAnnual: '415 €',
        suffix: t('pri.per.month'),
        sub: t('pri.growth.subM'),
        subAnnual: t('pri.growth.subA'),
        features: [
          t('pri.growth.f1'),
          t('pri.growth.f2'),
          t('pri.growth.f3'),
          t('pri.growth.f4'),
          t('pri.growth.f5'),
        ],
        cta: t('pri.growth.cta'),
        recommended: true,
        linkMonthly: STRIPE_LINKS.growth_monthly,
        linkAnnual: STRIPE_LINKS.growth_annual,
        refMonthly: 'growth_monthly',
        refAnnual: 'growth_annual',
      },
      {
        tier: 'Enterprise',
        price: '699 €',
        priceAnnual: '582 €',
        suffix: t('pri.per.month'),
        sub: t('pri.ent.subM'),
        subAnnual: t('pri.ent.subA'),
        features: [
          t('pri.ent.f1'),
          t('pri.ent.f2'),
          t('pri.ent.f3'),
          t('pri.ent.f4'),
          t('pri.ent.f5'),
        ],
        cta: t('pri.ent.cta'),
        recommended: false,
        linkMonthly: STRIPE_LINKS.enterprise_monthly,
        linkAnnual: STRIPE_LINKS.enterprise_annual,
        refMonthly: 'enterprise_monthly',
        refAnnual: 'enterprise_annual',
      },
    ],
  };
}

interface PricingPageProps {
  searchParams: { from?: string };
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const { t, dir } = getPage();
  const brandSlug = (searchParams.from || '').toLowerCase().trim();
  const brandName = BRAND_NAMES[brandSlug] || null;
  const demoUrl = getDemoUrl(brandSlug);

  return (
    <main className="min-h-screen">
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <SiteHeader demoUrl={demoUrl} />

      {/* ===== Bandeau marque (si ?from=MARQUE) ===== */}
      {brandName && (
        <section className="px-8 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4 text-sm px-6 py-4 rounded-full bg-accent/5 border border-accent/20 backdrop-blur">
            <span className="text-accent text-lg" aria-hidden="true">✓</span>
            <div>
              <span className="text-text">{t('pri.banner1', { brand: brandName })}</span>
              <span className="text-text/55 ms-2">{t('pri.banner2')}</span>
            </div>
          </div>
        </section>
      )}

      {/* ===== Hero ===== */}
      <section className="px-8 py-8 md:py-12 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
            {t('pri.hero.eyebrow')}
          </span>
          <h1 className="font-sans text-4xl md:text-6xl font-thin leading-[1.03] -tracking-[0.03em]">
            {t('pri.hero.h1a')}<br/>
            <em className="not-italic text-text/55 font-extralight">{t('pri.hero.h1b')}</em>
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-text/45 max-w-xl leading-relaxed">
            {t('pri.hero.p')}
          </p>
        </div>
      </section>

      {/* ===== Plans ===== */}
      <PricingClient brandSlug={brandSlug} s={pricingStrings(t)} rtl={dir === 'rtl'} />

      {/* ===== Arguments ===== */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              {t('pri.args.eyebrow')}
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              {t('pri.args.h2a')}
              <br />
              <span className="text-text/55">{t('pri.args.h2b')}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ArgumentCard
              eyebrow={t('pri.arg1.e')}
              title={t('pri.arg1.t')}
              body={
                <>
                  {t('pri.arg1.b')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg1.n')}</span>
                </>
              }
            />

            <ArgumentCard
              eyebrow={t('pri.arg2.e')}
              title={<>{t('pri.arg2.t1')}<br />{t('pri.arg2.t2')}</>}
              body={
                <>
                  {t('pri.arg2.b1')} <span className="text-text">{t('pri.arg2.b2')}</span> {t('pri.arg2.b3')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg2.n')}</span>
                </>
              }
            />

            <ArgumentCard
              eyebrow={t('pri.arg3.e')}
              title={t('pri.arg3.t')}
              body={
                <>
                  {t('pri.arg3.b1')} <span className="font-mono text-[12px] text-text vy-ltr">&lt;script src=&quot;vyvre.fr/widget.js&quot;&gt;</span> {t('pri.arg3.b2')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg3.n')}</span>
                </>
              }
            />

            <ArgumentCard
              eyebrow={t('pri.arg4.e')}
              title={t('pri.arg4.t')}
              body={
                <>
                  {t('pri.arg4.b')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg4.n')}</span>
                </>
              }
            />

            <ArgumentCard
              eyebrow={t('pri.arg5.e')}
              title={t('pri.arg5.t')}
              body={
                <>
                  {t('pri.arg5.b')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg5.n')}</span>
                </>
              }
            />

            <ArgumentCard
              eyebrow={t('pri.arg6.e')}
              title={t('pri.arg6.t')}
              body={
                <>
                  {t('pri.arg6.b')}
                  <span className="block mt-2 text-text/45 text-[12px]">{t('pri.arg6.n')}</span>
                </>
              }
            />
          </div>

          {/* === Comparatif marché === */}
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-8">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
                {t('pri.tbl.caption')}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-text/[0.02]">
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">{t('pri.tbl.h1')}</th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">{t('pri.tbl.h2')}</th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">{t('pri.tbl.h3')}</th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">{t('pri.tbl.h4')}</th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">{t('pri.tbl.h5')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line bg-accent/[0.04]">
                    <td className="px-5 py-4">
                      <span className="font-medium text-text">VYVRE Starter</span>
                      <span className="block text-[11px] text-accent mt-1">{t('pri.tbl.from')}</span>
                    </td>
                    <td className="px-5 py-4 text-text"><span className="vy-ltr">299 €{t('pri.tbl.month')}</span> <span className="text-text/50 text-[11px] vy-ltr">(3 588 €{t('pri.tbl.year')})</span></td>
                    <td className="px-5 py-4 text-text vy-ltr">0 €</td>
                    <td className="px-5 py-4 text-text">{t('pri.tbl.france')}</td>
                    <td className="px-5 py-4 text-text vy-ltr">48 h</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">SkinConsult AI <span className="text-text/40">(L&apos;Oréal)</span></td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.fromApprox')} <span className="vy-ltr">~50 000 €</span></td>
                    <td className="px-5 py-4 text-text/75 vy-ltr">~30 000 €</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.w812')}</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">Modiface <span className="text-text/40">(L&apos;Oréal)</span></td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.fromApprox')} <span className="vy-ltr">~80 000 €</span></td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.onQuote')}</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.w12')}</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 text-text/75">Perfect Corp <span className="text-text/40">(YouCam)</span></td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.fromApprox')} <span className="vy-ltr">~30 000 €</span></td>
                    <td className="px-5 py-4 text-text/75 vy-ltr">~10 000 €</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">{t('pri.tbl.w68')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-text/40 mt-4 text-center font-mono tracking-[0.1em]">
              {t('pri.tbl.note')}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Ce que vous obtenez ===== */}
      <section className="px-8 py-16 md:py-20 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              {t('pri.del.eyebrow')}
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              {t('pri.del.h2a')}
              <br />
              <span className="text-text/55">{t('pri.del.h2b')}</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 max-w-4xl mx-auto">
            <DeliverableItem title={t('pri.del1.t')} body={t('pri.del1.b')} />
            <DeliverableItem
              title={t('pri.del2.t')}
              body={
                <span className="font-mono text-[12px] vy-ltr">
                  &lt;script src=&quot;vyvre.fr/widget.js&quot; data-brand=&quot;...&quot;&gt;&lt;/script&gt;
                </span>
              }
            />
            <DeliverableItem title={t('pri.del3.t')} body={t('pri.del3.b')} />
            <DeliverableItem title={t('pri.del4.t')} body={t('pri.del4.b')} />
            <DeliverableItem title={t('pri.del5.t')} body={t('pri.del5.b')} />
            <DeliverableItem title={t('pri.del6.t')} body={t('pri.del6.b')} />
          </ul>
        </div>
      </section>

      {/* ===== Questions fréquentes ===== */}
      <section className="px-8 py-16 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">{t('pri.faq.eyebrow')}</span>
            <h2 className="font-sans text-2xl md:text-3xl font-extralight -tracking-[0.015em] text-text/85 mt-3">
              {t('pri.faq.h2a')} <em className="not-italic font-light text-accent" style={{ fontStyle: 'italic' }}>{t('pri.faq.h2b')}</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FAQItem question={t('pri.faq1.q')} answer={t('pri.faq1.a')} />
            <FAQItem question={t('pri.faq2.q')} answer={t('pri.faq2.a')} />
            <FAQItem question={t('pri.faq3.q')} answer={t('pri.faq3.a')} />
            <FAQItem question={t('pri.faq4.q')} answer={t('pri.faq4.a')} />
            <FAQItem question={t('pri.faq5.q')} answer={t('pri.faq5.a')} />
          </div>
        </div>
      </section>

      {/* ===== Rendez-vous ===== */}
      <section className="px-8 py-12 border-t border-line">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">{t('pri.cal.eyebrow')}</span>
          <h2 className="font-sans text-3xl md:text-4xl font-extralight -tracking-[0.02em]">
            {t('pri.cal.h2')}
          </h2>
          <p className="text-text/55 max-w-lg font-light">
            {t('pri.cal.p')}
          </p>
          <a
            href="https://calendly.com/charles-symphonydrive"
            target="_blank"
            rel="noopener"
            className="btn-secondary mt-4"
          >
            {t('pri.cal.cta')}
          </a>
        </div>
      </section>

      {/* ===== Pied de page ===== */}
      <footer className="px-8 py-12 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono mb-6">
            <Link href="/cgv" className="hover:text-accent transition-colors">{t('footer.cgv')}</Link>
            <Link href="/mentions-legales" className="hover:text-accent transition-colors">{t('footer.legal')}</Link>
            <Link href="/confidentialite" className="hover:text-accent transition-colors">{t('footer.privacy')}</Link>
            <Link href="/dpa" className="hover:text-accent transition-colors">{t('footer.dpa')}</Link>
            <a href="mailto:charles@symphonydrive.com" className="hover:text-accent transition-colors">{t('footer.contact')}</a>
            <Link href="/" className="hover:text-accent transition-colors">{t('footer.home')}</Link>
          </div>

          <div className="text-center text-[9px] tracking-[0.35em] uppercase text-text/30 font-mono">
            VYVRE © {new Date().getFullYear()} · {t('footer.company')}
          </div>
        </div>
      </footer>
    </main>
  );
}

// ── Carte argument (style V6) ──
function ArgumentCard({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        background: `
          radial-gradient(ellipse 140% 100% at 50% -15%, rgba(235,235,240,0.45) 0%, rgba(180,180,188,0.30) 18%, rgba(110,110,118,0.18) 38%, rgba(50,50,58,0.08) 58%, transparent 78%),
          #000
        `,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '28px 26px 30px',
        overflow: 'hidden',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
        {eyebrow}
      </span>
      <h3 className="font-sans text-xl md:text-[22px] font-light leading-[1.2] -tracking-[0.015em] mt-3 text-text">
        {title}
      </h3>
      <p className="text-[13px] text-text/65 leading-relaxed mt-3 font-light">
        {body}
      </p>
    </div>
  );
}

// ── Question / réponse ──
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl p-5 bg-accent/[0.02] border border-line transition-colors hover:border-accent/30">
      <p className="text-[13px] text-text font-light leading-snug mb-2">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-accent me-2 font-medium">Q.</span>
        {question}
      </p>
      <p className="text-[12px] text-text/55 leading-relaxed font-light">{answer}</p>
    </div>
  );
}

// ── Livrable ──
function DeliverableItem({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex-shrink-0 mt-[3px] text-accent"
        style={{ fontSize: '14px', lineHeight: 1 }}
        aria-hidden
      >
        ✓
      </span>
      <div>
        <div className="text-text font-light text-[15px] leading-snug">{title}</div>
        <div className="text-text/55 text-[13px] mt-1 leading-relaxed font-light">{body}</div>
      </div>
    </li>
  );
}
