/**
 * VYVRE — vyvre.fr
 * Accueil : hero animé (scan 68 repères), 8 mesures, les trois étapes,
 * le socle groupe (multi-marques / souveraineté), pricing, FAQ.
 */

import Link from 'next/link';
import Script from 'next/script';
import HeroScan from './HeroScan';
import SiteHeader from './SiteHeader';
import IntroFusion from './IntroFusion';

const MESURES = [
  ['Carnation', 'ITA° · CIE L*a*b*'],
  ['Éclat', 'Luminance L*'],
  ['Rougeurs', 'Indice érythème'],
  ['Uniformité', 'Écart-type chromatique'],
  ['Texture', 'Micro-contraste local'],
  ['Pores', 'Densité des minima'],
  ['Sébum', 'Réflexion spéculaire'],
  ['Hydratation', 'Proxy TEWL optique'],
];

export default function HomePage() {
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />

      <main className="min-h-screen flex flex-col">
        <IntroFusion />
        <SiteHeader />

        {/* ===== Hero ===== */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-line">
          <div className="absolute inset-0 md:left-[42%] z-0"><HeroScan /></div>
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.72)_45%,rgba(0,0,0,.25)_75%,rgba(0,0,0,.6)_100%)]" aria-hidden="true" />
          <div className="relative z-20 w-full max-w-6xl mx-auto px-8 py-24 flex flex-col items-start">
            <div className="max-w-xl flex flex-col gap-7">
              <span className="font-mono text-[10px] tracking-[0.42em] uppercase text-accent">Diagnostic de peau mesuré</span>
              <h1 className="font-sans text-5xl md:text-7xl font-thin leading-[1.02] -tracking-[0.03em]">
                Le diagnostic peau<br />
                <em className="not-italic text-text/55 font-extralight">de votre maison.</em>
              </h1>
              <p className="text-base md:text-lg text-text/70 leading-relaxed font-extralight">
                Moins de dix secondes de caméra. Huit mesures lues pixel par pixel. Une routine composée dans votre seul catalogue.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a href="/scan" className="btn-primary">Tester le scan</a>
                <Link href="/pricing?from=homepage" className="btn-secondary">Équiper ma marque</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Chiffres ===== */}
        <section className="px-8 py-16 border-t border-line">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat value="8" label="Mesures de peau" />
            <Stat value="<10s" label="Durée du scan" />
            <Stat value="48h" label="Mise en ligne" />
            <Stat value="0" label="Photo conservée" />
          </div>
        </section>

        {/* ===== Manifeste court ===== */}
        <section id="methode" className="px-8 py-32 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
            <h2 className="font-sans text-5xl md:text-7xl font-thin italic leading-[1.02] -tracking-[0.03em]">
              Mesurée,<br /><span className="not-italic font-extralight text-text/55">pas devinée.</span>
            </h2>
            <p className="text-lg md:text-xl font-extralight text-text/70 leading-[1.6] max-w-2xl">
              Le moteur convertit chaque zone du visage en coordonnées CIE&nbsp;L*a*b*, puis en indices dermatologiques.
              Pas d&apos;estimation à partir d&apos;un filtre : une lecture optique, reproductible, documentée.
            </p>
            <Link href="/accuracy" className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent hover:text-text transition-colors">
              Lire la méthodologie →
            </Link>
          </div>
        </section>

        {/* ===== Les 8 mesures ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em] text-center mb-14">
              Huit mesures.<br /><em className="not-italic text-text/55 font-extralight">Une seule lecture.</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MESURES.map(([nom, unite]) => (
                <div key={nom} className="v6 px-6 py-8 flex flex-col gap-2">
                  <div className="font-sans text-xl font-extralight -tracking-[0.02em]">{nom}</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45">{unite}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Trois étapes ===== */}
        <section id="how" className="px-8 py-24 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em] text-center mb-14">
              Trois étapes.<br /><em className="not-italic text-text/55 font-extralight">Zéro friction.</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step num="01" title="La cliente scanne" desc="Caméra du téléphone ou du poste conseil. Rien à installer, rien à téléverser : l'image est traitée puis effacée." />
              <Step num="02" title="Le moteur compose" desc="Une routine matin et soir issue de votre seul catalogue, hiérarchisée selon les mesures et vos priorités commerciales." />
              <Step num="03" title="Vous passez en ligne" desc="Une ligne de script sur votre site, vos couleurs, votre typographie. Aucun développeur mobilisé chez vous." />
            </div>
          </div>
        </section>

        {/* ===== Socle groupe ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-10 md:px-16 py-16 flex flex-col items-center gap-10 text-center">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">Pour les groupes</span>
              <h2 className="font-sans text-3xl md:text-5xl font-thin leading-[1.08] -tracking-[0.025em] max-w-3xl">
                Une maison, dix marques,<br /><em className="not-italic text-text/55 font-extralight">un seul moteur.</em>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-2">
                <Socle titre="Multi-marques" texte="Un espace par marque : catalogue, charte, règles de recommandation et statistiques séparés." />
                <Socle titre="Souveraineté" texte="Hébergement France, RGPD natif, DPA signé, aucune image conservée, aucun pixel tiers." />
                <Socle titre="Boutique et e-shop" texte="Le même moteur au comptoir sur tablette et sur la fiche produit, avec le même référentiel de mesures." />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Tarifs ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              À partir de 299&nbsp;€/mois.<br /><em className="not-italic text-text/55 font-extralight">Prix affiché.</em>
            </h2>
            <Link href="/pricing?from=homepage" className="btn-primary mt-2">Voir les plans</Link>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="px-8 py-24 border-t border-line">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em] text-center mb-12">Questions.</h2>
            <div className="space-y-4">
              <FaqItem q="Comment mon catalogue arrive-t-il dans le moteur ?" a="Par un flux CSV ou l'API de votre e-commerce (Shopify, Salesforce Commerce, Centra). Aucun accès administrateur, synchronisation chaque nuit." />
              <FaqItem q="Que devient l'image de la cliente ?" a="Elle est analysée en mémoire puis effacée : aucune photo n'est stockée ni transmise. Hébergement France, DPA disponible." />
              <FaqItem q="Le moteur peut-il recommander un concurrent ?" a="Non. La routine est composée exclusivement dans votre catalogue, avec les priorités que vous fixez." />
              <FaqItem q="Quel matériel faut-il ?" a="Une caméra 720p suffit, sur mobile comme sur ordinateur. Les résultats gagnent en finesse sur les capteurs récents." />
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              Voir le scan sur votre catalogue.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <a href="/scan" className="btn-primary">Lancer la démo</a>
              <a href="mailto:charles@symphonydrive.com?subject=VYVRE%20-%20D%C3%A9mo" className="btn-secondary">Demander une démo</a>
            </div>
          </div>
        </section>

        <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <canvas className="v-mini" width="48" height="48" aria-label="VYVRE" style={{ width: 24, height: 24 }} />
                <span className="font-mono tracking-[0.18em] uppercase">VYVRE · Paris</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase">
                <a href="mailto:charles@symphonydrive.com" className="hover:text-text transition-colors">charles@symphonydrive.com</a>
                <a href="https://calendly.com/charles-symphonydrive" target="_blank" rel="noopener" className="hover:text-text transition-colors">Réserver 20 min →</a>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px] border-t border-line pt-8">
              <Link href="/manifeste" className="hover:text-text transition-colors">Manifeste</Link>
              <Link href="/accuracy" className="hover:text-text transition-colors">Méthodologie</Link>
              <Link href="/cgv" className="hover:text-text transition-colors">CGV</Link>
              <Link href="/mentions-legales" className="hover:text-text transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-text transition-colors">Confidentialité</Link>
              <Link href="/dpa" className="hover:text-text transition-colors">DPA</Link>
              <span className="ml-auto">© {new Date().getFullYear()} VYVRE</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="v6 px-6 py-10 text-center flex flex-col items-center gap-2">
      <div className="font-sans text-5xl md:text-6xl font-thin leading-none -tracking-[0.025em]">{value}</div>
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/55">{label}</div>
    </div>
  );
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="v6 px-8 py-10 flex flex-col gap-4 h-full">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">{num}</div>
      <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">{title}</h3>
      <p className="text-sm text-text/65 leading-relaxed font-extralight">{desc}</p>
    </div>
  );
}

function Socle({ titre, texte }: { titre: string; texte: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">{titre}</div>
      <p className="text-sm text-text/65 leading-relaxed font-extralight">{texte}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="v6-soft px-6 md:px-8 py-5 group cursor-pointer">
      <summary className="flex items-center justify-between gap-4 list-none cursor-pointer">
        <span className="font-sans text-base md:text-lg font-extralight text-text -tracking-[0.015em]">{q}</span>
        <span className="text-text/40 font-mono text-xl leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4 text-sm text-text/65 leading-relaxed font-extralight">{a}</div>
    </details>
  );
}
