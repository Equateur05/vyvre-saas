/**
 * VYVRE — Landing page (vyvre.fr)
 *
 * Sections (ordre Apple keynote):
 * 1. Header (mini-lattice + nav)
 * 2. Hero (titre + CTAs + 4 stats V6 dans le viewport)
 * 3. Intro Apple style ("Une nouvelle norme")
 * 4. Argument massue "Pixel par pixel" (iPhone 12M points)
 * 5. Comment ça marche (3 étapes V6)
 * 6. Souveraineté (V6 container central)
 * 7. Pricing teaser
 * 8. FAQ
 * 9. CTA final
 * 10. Footer (riche, avec liens conditions)
 */

import Link from 'next/link';
import Script from 'next/script';

export default function HomePage() {
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />

      <main className="min-h-screen flex flex-col">
        {/* ===== Header ===== */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-line">
          <Link href="/" className="brand-mark">
            <canvas className="v-mini" width="72" height="72" aria-label="VYVRE" />
            <span className="text-sm font-light tracking-[0.22em]">VYVRE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase text-text/55 font-mono">
            <a href="#about" className="hover:text-text transition-colors">À propos</a>
            <a href="#how" className="hover:text-text transition-colors">Comment ça marche</a>
            <a href="https://vyvre-demos.web.app/VYVRE_UNIVERSAL.html" target="_blank" rel="noopener" className="hover:text-text transition-colors">Démo</a>
            <Link href="/pricing" className="hover:text-text transition-colors">Pricing</Link>
            <Link href="/accuracy" className="hover:text-text transition-colors">Méthodologie</Link>
          </nav>
        </header>

        {/* ===== Hero + 4 stats (visible above fold) ===== */}
        <section className="px-8 pt-16 md:pt-20 pb-12">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              VYVRE Business · SDK Licensing
            </div>
            <h1 className="font-sans text-5xl md:text-7xl lg:text-[80px] font-thin leading-[1.02] -tracking-[0.025em]">
              Le diagnostic peau<br />
              <em className="not-italic text-text/55 font-extralight">de votre marque.</em>
            </h1>
            <p className="text-base md:text-lg text-text/65 leading-relaxed max-w-2xl font-extralight">
              Un scanner intégré à votre e-shop. 60 secondes de webcam. 6 indicateurs peau mesurés par notre IA. Une routine personnalisée composée à partir de votre catalogue.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href="https://vyvre-demos.web.app/VYVRE_UNIVERSAL.html"
                target="_blank"
                rel="noopener"
                className="btn-primary"
              >
                Voir la démo →
              </a>
              <Link href="/pricing?from=homepage" className="btn-secondary">
                Voir les tarifs
              </Link>
            </div>
          </div>

          {/* 4 stats V6 directly under hero (above fold) */}
          <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat value="60s" label="Scan webcam" />
            <Stat value="6" label="Indicateurs peau" />
            <Stat value="48h" label="Activation site" />
            <Stat value="100%" label="Données France" />
          </div>
        </section>

        {/* ===== Intro Apple style "Une nouvelle norme" ===== */}
        <section id="about" className="px-8 py-32 md:py-40 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-12">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              VYVRE
            </span>

            <h2 className="font-sans text-5xl md:text-7xl lg:text-[88px] font-thin italic leading-[1.02] -tracking-[0.03em]">
              Une nouvelle norme<br />
              <span className="not-italic font-extralight text-text/55">pour le diagnostic peau.</span>
            </h2>

            <div className="flex flex-col gap-3 text-xl md:text-2xl font-extralight text-text/75 leading-[1.5] mt-8">
              <p>Mesurée par l'IA.</p>
              <p>Composée à partir de votre catalogue.</p>
              <p>Activée sur votre site en 48 heures.</p>
            </div>

            <div className="flex flex-col gap-2 text-sm md:text-base font-mono tracking-[0.15em] uppercase text-text/45 mt-12">
              <p>Conçue en France.</p>
              <p>Pour les marques qui ne font pas semblant.</p>
            </div>
          </div>
        </section>

        {/* ===== Hero video showcase (scan en action) ===== */}
        <section className="px-8 py-24 md:py-32 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Scan en action
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                60 secondes.<br />
                <em className="not-italic text-text/55 font-extralight">Une routine personnalisée.</em>
              </h2>
            </div>
            <div className="v6 overflow-hidden" style={{ borderRadius: '36px' }}>
              <video
                src="/videos/hero-scan-green.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full block"
                style={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* ===== Argument massue "Pixel par pixel" ===== */}
        <section className="px-8 py-32 md:py-40 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-8 md:px-20 py-20 md:py-28 text-center flex flex-col items-center gap-10">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Précision matérielle
              </span>

              <h2 className="font-sans text-5xl md:text-7xl font-thin italic leading-[1.02] -tracking-[0.03em]">
                Pixel par pixel.
              </h2>

              <div className="flex flex-col gap-4 max-w-2xl text-lg md:text-xl font-extralight text-text/75 leading-[1.55]">
                <p>
                  Sur iPhone, notre moteur lit <span className="text-text">12 millions de pixels</span> par image. À 60 secondes de scan, c'est plus de <span className="text-text">700 millions de mesures</span>.
                </p>
                <p>
                  Là où les autres estiment avec des filtres IA, VYVRE mesure. Couleur, texture, micro-relief — tout est lu directement depuis l'image, sans approximation.
                </p>
              </div>

              <p className="font-sans text-base md:text-lg italic text-text/55 font-extralight mt-4 max-w-xl">
                La différence entre un selfie filtré<br />
                et une mesure réelle.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Comment ça marche (3 étapes V6) ===== */}
        <section id="how" className="px-8 py-24 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Le scanner intégré
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Trois étapes.<br />
                <em className="not-italic text-text/55 font-extralight">Zéro friction.</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step
                num="01"
                title="Scan webcam 60s"
                desc="La cliente lance un scan via sa webcam. L'IA mesure 6 indicateurs peau (rides, fermeté, pigmentation, hydratation, éclat, pores) directement depuis l'image."
              />
              <Step
                num="02"
                title="Routine personnalisée"
                desc="L'IA compose une routine matin/soir 100% issue de votre catalogue. Aucun produit générique, aucune redirection vers la concurrence. Vos flagships mis en avant selon le besoin."
              />
              <Step
                num="03"
                title="Live en 48h"
                desc="Aucun développeur mobilisé chez vous. Le scanner est branché sur votre catalogue, personnalisé à vos couleurs, prêt à déployer. Plug & play."
              />
            </div>
          </div>
        </section>

        {/* ===== Souveraineté section ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-12 md:px-16 py-16 md:py-20 text-center flex flex-col items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Souveraineté · RGPD natif
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-thin leading-[1.1] -tracking-[0.022em] max-w-3xl">
                Données 100% hébergées<br />
                <em className="not-italic text-text/55 font-extralight">en France.</em>
              </h2>
              <p className="text-base text-text/65 max-w-2xl leading-relaxed font-extralight">
                Vercel Europe + Supabase Paris. Pas de serveurs US, pas de routage Chine, pas de pixel tiers. Vos clientes ne se font pas profiler ailleurs, et vous pouvez l'afficher sur votre page d'accueil.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Pricing teaser ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center gap-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Tarification publique
            </span>
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              À partir de 299€/mois.<br />
              <em className="not-italic text-text/55 font-extralight">Pas de devis bidon.</em>
            </h2>
            <p className="text-base text-text/65 max-w-xl leading-relaxed font-extralight">
              Le seul diagnostic peau IA avec un prix affiché. Quatre plans : Pilot gratuit, Starter 299€/mo, Growth 499€/mo, Enterprise sur devis.
            </p>
            <Link href="/pricing?from=homepage" className="btn-primary mt-4">
              Voir tous les plans →
            </Link>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="px-8 py-24 border-t border-line">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Questions fréquentes
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                FAQ.
              </h2>
            </div>

            <div className="space-y-4">
              <FaqItem
                q="Vous avez accès à mon catalogue produits ?"
                a="Oui, on charge votre catalogue via une simple URL CSV ou via votre API e-commerce (Shopify, Salesforce Commerce, Centra, etc.). Aucun accès admin requis. Mise à jour automatique chaque nuit."
              />
              <FaqItem
                q="C'est compatible RGPD pour mes clientes européennes ?"
                a="Oui. Données 100% hébergées en France (Vercel EU + Supabase Paris). Aucune image stockée — le scan est traité en mémoire puis effacé. Conforme RGPD. DPA disponible."
              />
              <FaqItem
                q="Combien de temps pour intégrer sur mon site ?"
                a="48 heures. On vous livre un script à coller dans votre site (1 ligne). Le scanner s'ouvre dans une modal au clic d'un bouton. Aucun développeur mobilisé chez vous."
              />
              <FaqItem
                q="L'IA pousse-t-elle uniquement mes produits ?"
                a="Oui. Aucune redirection vers la concurrence, aucun produit générique. La routine recommandée est composée à 100% à partir de votre catalogue. Vos flagships sont mis en avant intelligemment selon le diagnostic."
              />
              <FaqItem
                q="Le scan fonctionne en webcam standard ?"
                a="Oui. Webcam HD (720p+) suffit. Sur iPhone, le moteur lit jusqu'à 12 millions de pixels par image. Aucun matériel spécifique. Fonctionne sur Chrome, Safari, Firefox, Edge. Mobile et desktop."
              />
            </div>
          </div>
        </section>

        {/* ===== CTA Final ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              Prêt à tester ?<br />
              <em className="not-italic text-text/55 font-extralight">48h pour passer en live.</em>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href="https://vyvre-demos.web.app/VYVRE_UNIVERSAL.html"
                target="_blank"
                rel="noopener"
                className="btn-primary"
              >
                Lancer la démo →
              </a>
              <a
                href="mailto:charles@symphonydrive.com?subject=VYVRE - Demande de démo personnalisée"
                className="btn-secondary"
              >
                Demander une démo
              </a>
            </div>
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <canvas className="v-mini" width="48" height="48" aria-label="VYVRE" style={{ width: 24, height: 24 }} />
                <span className="font-mono tracking-[0.18em] uppercase">VYVRE · Paris, France</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase">
                <a href="mailto:charles@symphonydrive.com" className="hover:text-text transition-colors">charles@symphonydrive.com</a>
                <a href="https://calendly.com/charles-symphonydrive" target="_blank" rel="noopener" className="hover:text-text transition-colors">Réserver 20 min →</a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px] border-t border-line pt-8">
              <Link href="/accuracy" className="hover:text-text transition-colors">Méthodologie</Link>
              <Link href="/cgv" className="hover:text-text transition-colors">CGV</Link>
              <Link href="/mentions-legales" className="hover:text-text transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-text transition-colors">Confidentialité · RGPD</Link>
              <Link href="/dpa" className="hover:text-text transition-colors">DPA</Link>
              <span className="ml-auto">© {new Date().getFullYear()} VYVRE — Tous droits réservés</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="v6 px-6 py-10 md:py-12 text-center flex flex-col items-center gap-2">
      <div className="font-sans text-5xl md:text-6xl font-thin leading-none -tracking-[0.025em]">
        {value}
      </div>
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/55">
        {label}
      </div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="v6 px-8 py-10 flex flex-col gap-4 h-full">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
        {num}
      </div>
      <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">
        {title}
      </h3>
      <p className="text-sm text-text/65 leading-relaxed font-extralight">
        {desc}
      </p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="v6-soft px-6 md:px-8 py-5 group cursor-pointer">
      <summary className="flex items-center justify-between gap-4 list-none cursor-pointer">
        <span className="font-sans text-base md:text-lg font-extralight text-text -tracking-[0.015em]">
          {q}
        </span>
        <span className="text-text/40 font-mono text-xl leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 text-sm text-text/65 leading-relaxed font-extralight">
        {a}
      </div>
    </details>
  );
}
