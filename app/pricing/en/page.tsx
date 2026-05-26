/**
 * VYVRE — /pricing/en page (English version)
 *
 * Single source of truth pour le pricing public, version anglaise.
 * Linked depuis les 66 POCs EN Firebase via : vyvre.fr/pricing/en?from=BRAND
 *
 * Behavior :
 * - Detects ?from=BRAND → personalizes the header ("You just tested the X demo")
 * - 4 tiers : Pilot, Starter, Growth, Enterprise
 * - Monthly/annual toggle
 * - CTAs → Stripe Payment Links (with client_reference_id for tracking)
 * - EUR primary, USD/GBP conversion shown beside
 */

import Link from 'next/link';
import PricingClientEn from './PricingClient';

export const metadata = {
  title: 'Pricing · VYVRE',
  description: 'The only premium standard your DPO can sign off on. France-based infrastructure, GDPR-native, on-device processing. Free pilot, Starter €299/mo, Growth €499/mo, Enterprise on quote.',
};

// ── Brand display name mapping (EN brands) ──
const BRAND_NAMES: Record<string, string> = {
  // Luxury · UK/US/CH/AU/DE
  '111skin': '111SKIN',
  'aesop': 'Aesop',
  'augustinus-bader': 'Augustinus Bader',
  'beauty-of-joseon': 'Beauty of Joseon',
  'blueprint': 'Blueprint',
  'elysium': 'Elysium',
  'la-prairie': 'La Prairie',
  'lyma': 'LYMA',
  'medicube': 'Medicube',
  'neko-health': 'Neko Health',
  'noble-panacea': 'Noble Panacea',
  'oneskin': 'OneSkin',
  'revive': 'Revive',
  'sk-ii': 'SK-II',
  'sturm': 'Dr. Barbara Sturm',
  'barbara-sturm': 'Dr. Barbara Sturm',
  'tally-health': 'Tally Health',
  'tata-harper': 'Tata Harper',
  'u-beauty': 'U Beauty',
  'valmont': 'Valmont',
  // K-Beauty
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
  // US drugstore + indie
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
  // DE/ES
  'eucerin': 'Eucerin',
  'sensilis': 'Sensilis',
  // US Estée Lauder Companies
  'clinique': 'Clinique',
  'estee-lauder': 'Estée Lauder',
  'shiseido': 'Shiseido',
  'kiehls': 'Kiehl’s',
  'fresh': 'Fresh',
  'origins': 'Origins',
  'bobbi-brown': 'Bobbi Brown',
  // UK
  'the-inkey-list': 'The INKEY List',
  'beauty-pie': 'Beauty Pie',
  'liz-earle': 'Liz Earle',
  'trinny-london': 'Trinny London',
  'charlotte-tilbury': 'Charlotte Tilbury',
  'wishful': 'Wishful',
  // JP
  'hada-labo': 'Hada Labo',
  'curel': 'Curél',
  'senka': 'Senka',
  // AU
  'sand-and-sky': 'Sand & Sky',
};

interface PricingPageProps {
  searchParams: { from?: string };
}

export default function PricingEnPage({ searchParams }: PricingPageProps) {
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
          <a href="https://vyvre-demos.web.app/SCAN_LIVE_DEMO_VYVRE.html" target="_blank" rel="noopener" className="hover:text-text">Demo</a>
          <Link href="/pricing/en" className="text-text">Pricing</Link>
          <a href="mailto:charles@symphonydrive.com" className="hover:text-text">Contact</a>
          <Link href="/pricing" className="hover:text-accent text-text/45">FR</Link>
        </nav>
      </header>

      {/* ===== Brand personalization banner (only if ?from=BRAND) ===== */}
      {brandName && (
        <section className="px-8 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4 text-sm px-6 py-4 rounded-full bg-accent/5 border border-accent/20 backdrop-blur">
            <span className="text-accent text-lg">✓</span>
            <div>
              <span className="text-text">You just tested the {brandName} demo</span>
              <span className="text-text/55 ml-2">— Pick a plan to activate it on your own site.</span>
            </div>
          </div>
        </section>
      )}

      {/* ===== Hero ===== */}
      <section className="px-8 py-8 md:py-12 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
            Pricing · VYVRE Business
          </span>
          <h1 className="font-sans text-3xl md:text-4xl font-light leading-[1.05] -tracking-[0.022em]">
            The only premium standard<br/>
            <span className="text-text/60">your DPO can sign off on.</span>
          </h1>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-text/45 max-w-xl leading-relaxed">
            France-based infrastructure · GDPR-native · On-device · 48h activation
          </p>
        </div>
      </section>

      {/* ===== Pricing Cards (moved right after hero for conversion) ===== */}
      <PricingClientEn brandSlug={brandSlug} />

      {/* ===== Why VYVRE section (now below cards) ===== */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Why choose us
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              Why VYVRE
              <br />
              <span className="text-text/55">and not the others?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ArgumentCard
              eyebrow="Made in France"
              title="The only skin-tech widget hosted in the EU"
              body={
                <>
                  Clever Cloud + OVH hosting, data stored in France, team based in Paris.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Modiface and Perfect Corp run on AWS US — GDPR-compatible but not GDPR-native.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="-90% on the invoice"
              title={<>Up to 10&times; cheaper<br />than the alternatives</>}
              body={
                <>
                  VYVRE Starter = <span className="text-text">from &euro;299 / month</span> (&euro;3,588 / year). SkinConsult AI starts around &euro;50,000 / year + &euro;30,000 setup. Perfect Corp around &euro;30,000 / year.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Detailed comparison table below.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="48h activation"
              title="Embed code in your inbox after payment"
              body={
                <>
                  You paste <span className="font-mono text-[12px] text-text">&lt;script src=&quot;vyvre.fr/widget.js&quot;&gt;</span> on your site, it&apos;s live.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    No onboarding meeting, no third-party integrator fee.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="No commitment"
              title="One-click cancellation"
              body={
                <>
                  Downgrade, upgrade or cancel from your dashboard. No contractual lock-in, no penalty.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    You keep the export of all your scan data.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="Full white-label"
              title="Your brand, not ours"
              body={
                <>
                  Logo, colors, typography, matched products — all configured to your brand identity.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    No forced &laquo; Powered by VYVRE &raquo; from the Starter plan onwards.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="Peer-reviewed science"
              title="Real diagnostic, not a simulation"
              body={
                <>
                  CIE LAB colorimetric engine · 468 face-api landmarks · peer-reviewed biological age formula.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    References: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.
                  </span>
                </>
              }
            />
          </div>

          {/* === Comparison table === */}
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-8">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
                Market comparison · public pricing observed 2025
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-text/[0.02]">
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Solution
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Annual entry price
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Setup / integration
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Hosting
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Time to live
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line bg-accent/[0.04]">
                    <td className="px-5 py-4">
                      <span className="font-medium text-text">VYVRE Starter</span>
                      <span className="block text-[11px] text-accent mt-1">Starts at</span>
                    </td>
                    <td className="px-5 py-4 text-text">&euro;299/month <span className="text-text/50 text-[11px]">(&euro;3,588/year)</span></td>
                    <td className="px-5 py-4 text-text">&euro;0</td>
                    <td className="px-5 py-4 text-text">France (Clever Cloud · OVH)</td>
                    <td className="px-5 py-4 text-text">48h</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">SkinConsult AI <span className="text-text/40">(L&apos;Or&eacute;al)</span></td>
                    <td className="px-5 py-4 text-text/75">from ~&euro;50,000</td>
                    <td className="px-5 py-4 text-text/75">~&euro;30,000</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">8-12 weeks</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">Modiface <span className="text-text/40">(L&apos;Or&eacute;al)</span></td>
                    <td className="px-5 py-4 text-text/75">from ~&euro;80,000</td>
                    <td className="px-5 py-4 text-text/75">on quote</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">12+ weeks</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 text-text/75">Perfect Corp <span className="text-text/40">(YouCam)</span></td>
                    <td className="px-5 py-4 text-text/75">from ~&euro;30,000</td>
                    <td className="px-5 py-4 text-text/75">~&euro;10,000</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">6-8 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-text/40 mt-4 text-center font-mono tracking-[0.1em]">
              Competitor pricing: public ranges observed in cosmetics-brand RFPs 2024-2025.
            </p>
          </div>
        </div>
      </section>

      {/* ===== "What you get" section ===== */}
      <section className="px-8 py-16 md:py-20 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Onboarding · the second your Stripe payment confirms
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              What you get,
              <br />
              <span className="text-text/55">on payment confirmation.</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 max-w-4xl mx-auto">
            <DeliverableItem
              title="Welcome email"
              body="With your personal admin link + dashboard credentials."
            />
            <DeliverableItem
              title="Embed code ready to paste"
              body={
                <span className="font-mono text-[12px]">
                  &lt;script src=&quot;vyvre.fr/widget.js&quot; data-brand=&quot;you&quot;&gt;&lt;/script&gt;
                </span>
              }
            />
            <DeliverableItem
              title="Pre-loaded product catalog"
              body="30 to 60 of your products scraped from your site, already mapped to skin biomarkers."
            />
            <DeliverableItem
              title="Custom branding"
              body="Logo + color palette + brand name applied to the widget and the dashboard."
            />
            <DeliverableItem
              title="Analytics dashboard"
              body="Scans/day, conversion rate, average biomarkers, top recommended products."
            />
            <DeliverableItem
              title="Email support < 48h"
              body="Pilot and Starter. Priority support from Growth onwards, dedicated Account Manager."
            />
            <DeliverableItem
              title="No hidden fees"
              body="No setup, no minimum commitment. VAT shown separately at checkout."
            />
            <DeliverableItem
              title="Full GDPR export"
              body="You keep all your scan data, exportable to CSV at any time."
            />
          </ul>
        </div>
      </section>

      {/* ===== FAQ — 8 concrete questions ===== */}
      <section className="px-8 py-16 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Frequently asked questions</span>
            <h2 className="font-sans text-2xl md:text-3xl font-extralight -tracking-[0.015em] text-text/85 mt-3">
              Everything you want to <em className="not-italic font-light text-accent" style={{ fontStyle: 'italic' }}>know.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FAQItem
              question="How long until we go live?"
              answer="48 hours from payment to live widget. You receive the embed code by email, paste it on your site — it&apos;s in production."
            />
            <FAQItem
              question="How do I cancel my subscription?"
              answer="One click from your dashboard. No penalty, no reason needed. Service stays active until the end of the current month."
            />
            <FAQItem
              question="What if I exceed my scan quota?"
              answer="Service continues. Each extra scan is billed between €0.01 and €0.02 depending on your plan, on the next month&apos;s invoice."
            />
            <FAQItem
              question="Where is user data stored?"
              answer="Exclusively in France, on OVH Roubaix and Clever Cloud datacenters. GDPR-native. No transfer outside the EU."
            />
            <FAQItem
              question="Can I change plans later?"
              answer="Yes, anytime from your dashboard. Upgrade prorates immediately, downgrade applies the following month."
            />
            <FAQItem
              question="Is the widget really 100% white-label?"
              answer="From the Starter plan onwards, yes. Logo, colors, interface name, custom domain on request. No VYVRE branding visible to your customers."
            />
            <FAQItem
              question="What level of technical support?"
              answer="48h email support on every plan. Priority support with dedicated Account Manager from Growth onwards."
            />
            <FAQItem
              question="Can the matched products be configured?"
              answer="Yes. Your Supabase catalog is fully editable. You add, remove and modify products from the dashboard."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA Calendly ===== */}
      <section className="px-8 py-12 border-t border-line">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Not ready yet?</span>
          <h2 className="font-sans text-3xl md:text-4xl font-extralight -tracking-[0.02em]">
            Book a 20-minute personalized demo
          </h2>
          <p className="text-text/55 max-w-lg font-light">
            Charles, founder, walks you through the widget on video + answers any technical and contractual questions.
          </p>
          <a
            href="https://calendly.com/charles-symphonydrive"
            target="_blank"
            rel="noopener"
            className="btn-secondary mt-4"
          >
            Book 20 min →
          </a>
        </div>
      </section>

      {/* ===== Footer · Conditions ===== */}
      <footer className="px-8 py-12 border-t border-line">
        <div className="max-w-5xl mx-auto">
          {/* Conditions links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono mb-6">
            <Link href="/cgv" className="hover:text-accent transition-colors">Terms</Link>
            <Link href="/mentions-legales" className="hover:text-accent transition-colors">Legal</Link>
            <Link href="/confidentialite" className="hover:text-accent transition-colors">Privacy</Link>
            <Link href="/dpa" className="hover:text-accent transition-colors">DPA</Link>
            <a href="mailto:charles@symphonydrive.com" className="hover:text-accent transition-colors">Contact</a>
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-accent transition-colors">FR version</Link>
          </div>

          {/* Copyright + legal */}
          <div className="text-center text-[9px] tracking-[0.35em] uppercase text-text/30 font-mono">
            VYVRE © 2026 · SAS · Paris, France · Registered in France · Billing in EUR (VAT extra)
          </div>
        </div>
      </footer>
    </main>
  );
}

// ── Argument card ──
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

// ── FAQ Item ──
function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 bg-accent/[0.02] border border-line transition-colors hover:border-accent/30"
    >
      <p className="text-[13px] text-text font-light leading-snug mb-2">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-accent mr-2 font-medium">Q.</span>
        {question}
      </p>
      <p className="text-[12px] text-text/55 leading-relaxed font-light">{answer}</p>
    </div>
  );
}

// ── Deliverable Item (checklist) ──
function DeliverableItem({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
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
