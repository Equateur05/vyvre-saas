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
          <a href="mailto:charles@symphonydrive.com" className="hover:text-text">Contact</a>
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

      {/* ===== Section ARGUMENTS (au-dessus du tableau) ===== */}
      <section className="px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Pourquoi nous choisir
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              Pourquoi VYVRE
              <br />
              <span className="text-text/55">et pas les autres ?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ArgumentCard
              eyebrow="Made in France"
              title="Le seul widget skin tech 100% français"
              body={
                <>
                  Hébergement Clever Cloud + OVH, données stockées en France, équipe à Paris.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Modiface et Perfect Corp = cloud AWS US, hors RGPD natif.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="-90% sur la facture"
              title={<>Jusqu&apos;à 10× moins cher<br />que la concurrence</>}
              body={
                <>
                  VYVRE Starter = <span className="text-text">à partir de 299 € / mois</span> (3 588 € / an). SkinConsult AI démarre à ~50 000 € / an + 30 000 € de setup, Perfect Corp à ~30 000 € / an.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Tableau comparatif détaillé plus bas sur cette page.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="Activation 48h chrono"
              title="Embed code reçu après paiement"
              body={
                <>
                  Vous collez <span className="font-mono text-[12px] text-text">&lt;script src=&quot;vyvre.fr/widget.js&quot;&gt;</span> sur votre site, c&apos;est live.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Pas de meeting d&apos;onboarding, pas d&apos;intégrateur tiers facturé.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="Sans engagement"
              title="Annulation en 1 clic"
              body={
                <>
                  Downgrade, upgrade, ou résiliation depuis votre dashboard. Aucun lock-in contractuel, aucune pénalité.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Vous gardez l&apos;export de toutes vos données scans.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="White-label total"
              title="Votre marque, pas la nôtre"
              body={
                <>
                  Logo, couleurs, typographie, produits matchés — tout est paramétré à votre charte.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Aucun &laquo; Powered by VYVRE &raquo; imposé dès le plan Starter.
                  </span>
                </>
              }
            />

            <ArgumentCard
              eyebrow="Science peer-reviewed"
              title="Vrai diagnostic, pas une simulation"
              body={
                <>
                  Engine colorimétrique CIE LAB · 468 landmarks face-api · formule âge biologique peer-reviewed.
                  <span className="block mt-2 text-text/45 text-[12px]">
                    Bibliographie : Flament, Chardon, Stamatas, Takiwaki, Yamamoto.
                  </span>
                </>
              }
            />
          </div>

          {/* === Tableau comparatif concurrence === */}
          <div className="mt-16 md:mt-20">
            <div className="text-center mb-8">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-text/55">
                Comparatif marché · prix publics constatés 2025
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
                      Tarif annuel (entry)
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Setup / intégration
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Hébergement
                    </th>
                    <th className="text-left font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 px-5 py-4">
                      Activation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line bg-accent/[0.04]">
                    <td className="px-5 py-4">
                      <span className="font-medium text-text">VYVRE Starter</span>
                      <span className="block text-[11px] text-accent mt-1">À partir de</span>
                    </td>
                    <td className="px-5 py-4 text-text">299 €/mois <span className="text-text/50 text-[11px]">(3 588 €/an)</span></td>
                    <td className="px-5 py-4 text-text">0 €</td>
                    <td className="px-5 py-4 text-text">France (Clever Cloud · OVH)</td>
                    <td className="px-5 py-4 text-text">48h</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">SkinConsult AI <span className="text-text/40">(L&apos;Oréal)</span></td>
                    <td className="px-5 py-4 text-text/75">à partir de ~50 000 €</td>
                    <td className="px-5 py-4 text-text/75">~30 000 €</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">8-12 sem.</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-5 py-4 text-text/75">Modiface <span className="text-text/40">(L&apos;Oréal)</span></td>
                    <td className="px-5 py-4 text-text/75">à partir de ~80 000 €</td>
                    <td className="px-5 py-4 text-text/75">sur devis</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">12 sem. +</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 text-text/75">Perfect Corp <span className="text-text/40">(YouCam)</span></td>
                    <td className="px-5 py-4 text-text/75">à partir de ~30 000 €</td>
                    <td className="px-5 py-4 text-text/75">~10 000 €</td>
                    <td className="px-5 py-4 text-text/75">AWS US</td>
                    <td className="px-5 py-4 text-text/75">6-8 sem.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-text/40 mt-4 text-center font-mono tracking-[0.1em]">
              Tarifs concurrents : ordres de grandeur publics constatés (RFP marques cosmétiques 2024-2025).
            </p>
          </div>
        </div>
      </section>

      {/* ===== Pricing Cards (client component for toggle) ===== */}
      <PricingClient brandSlug={brandSlug} />

      {/* ===== Section "Ce que vous obtenez" (sous le tableau) ===== */}
      <section className="px-8 py-16 md:py-20 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Onboarding · à la seconde du paiement
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-extralight leading-[1.05] -tracking-[0.022em] max-w-3xl">
              Ce que vous obtenez,
              <br />
              <span className="text-text/55">dès la confirmation Stripe.</span>
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 max-w-4xl mx-auto">
            <DeliverableItem
              title="Email de bienvenue"
              body="Avec votre lien d'admin personnel + identifiants dashboard."
            />
            <DeliverableItem
              title="Embed code prêt à coller"
              body={
                <span className="font-mono text-[12px]">
                  &lt;script src=&quot;vyvre.fr/widget.js&quot; data-brand=&quot;vous&quot;&gt;&lt;/script&gt;
                </span>
              }
            />
            <DeliverableItem
              title="Catalogue produits pré-rempli"
              body="30 à 60 de vos produits scrapés depuis votre site, déjà mappés aux biomarqueurs."
            />
            <DeliverableItem
              title="Branding personnalisé"
              body="Logo + palette couleurs + nom de marque appliqués au widget et au dashboard."
            />
            <DeliverableItem
              title="Dashboard analytics"
              body="Scans/jour, taux de conversion, biomarqueurs moyens, top produits recommandés."
            />
            <DeliverableItem
              title="Support email < 48h"
              body="Pilot et Starter. Support prioritaire dès Growth, Account Manager dédié."
            />
            <DeliverableItem
              title="Aucun frais caché"
              body="Pas de setup, pas de minimum d'engagement. TVA indiquée à part au paiement."
            />
            <DeliverableItem
              title="Export RGPD complet"
              body="Vous gardez l'intégralité de vos données scans, exportables CSV à tout moment."
            />
          </ul>
        </div>
      </section>

      {/* ===== FAQ — 8 questions concrètes ===== */}
      <section className="px-8 py-16 border-t border-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Questions fréquentes</span>
            <h2 className="font-sans text-2xl md:text-3xl font-extralight -tracking-[0.015em] text-text/85 mt-3">
              Tout ce que vous voulez <em className="not-italic font-light text-accent" style={{ fontStyle: 'italic' }}>savoir.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FAQItem
              question="Combien de temps pour démarrer ?"
              answer="48 heures du paiement au widget live. Vous recevez votre embed code par email, vous le collez sur votre site, c'est en production."
            />
            <FAQItem
              question="Comment annuler mon abonnement ?"
              answer="En un clic depuis votre dashboard. Aucune pénalité, aucune justification demandée. Le service reste actif jusqu'à la fin du mois en cours."
            />
            <FAQItem
              question="Que se passe-t-il si je dépasse mon quota de scans ?"
              answer="Le service continue. Chaque scan supplémentaire est facturé entre 0,01 € et 0,02 € selon votre plan, sur la facture du mois suivant."
            />
            <FAQItem
              question="Où sont stockées les données utilisateurs ?"
              answer="Exclusivement en France, sur les datacenters OVH Roubaix et Clever Cloud. RGPD natif. Aucun transfert hors UE."
            />
            <FAQItem
              question="Puis-je changer de plan en cours de route ?"
              answer="Oui, à tout moment depuis votre dashboard. Upgrade prorata immédiat, downgrade au mois suivant."
            />
            <FAQItem
              question="Le widget est-il vraiment 100 % white-label ?"
              answer="À partir du plan Starter, oui. Logo, couleurs, nom interface, domaine personnalisé sur demande. Aucune mention VYVRE visible côté client."
            />
            <FAQItem
              question="Quel niveau de support technique ?"
              answer="Support email sous 48h sur tous les plans. Support prioritaire avec Account Manager dédié à partir de Growth."
            />
            <FAQItem
              question="Les produits matchés sont-ils paramétrables ?"
              answer="Oui. Votre catalogue Supabase est entièrement éditable. Vous ajoutez, retirez, modifiez les produits depuis le dashboard."
            />
          </div>
        </div>
      </section>

      {/* ===== CTA Calendly ===== */}
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

      {/* ===== Footer · Conditions ===== */}
      <footer className="px-8 py-12 border-t border-line">
        <div className="max-w-5xl mx-auto">
          {/* Conditions links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono mb-6">
            <Link href="/cgv" className="hover:text-accent transition-colors">CGV</Link>
            <Link href="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-accent transition-colors">Confidentialité</Link>
            <Link href="/dpa" className="hover:text-accent transition-colors">DPA</Link>
            <a href="mailto:charles@symphonydrive.com" className="hover:text-accent transition-colors">Contact</a>
            <Link href="/" className="hover:text-accent transition-colors">Accueil</Link>
          </div>

          {/* Copyright + mentions */}
          <div className="text-center text-[9px] tracking-[0.35em] uppercase text-text/30 font-mono">
            VYVRE © 2026 · SAS au capital de 1 000 € · Paris, France · SIREN en cours
          </div>
        </div>
      </footer>
    </main>
  );
}

// ── Card argument (style V6 — gradient radial gris + label mono) ──
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

// ── FAQ Item (Q/R sobre) ──
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

// ── Item livrable (checklist verte) ──
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
