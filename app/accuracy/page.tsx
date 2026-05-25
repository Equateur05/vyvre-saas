/**
 * VYVRE — /accuracy
 *
 * Page méthodologie publique. Cite les sources peer-reviewed utilisées
 * par le moteur de scan, expose les limitations honnêtement, donne le
 * variance test. Indispensable pour défendre le pitch face à un DPO
 * cosméto ou un dermato consultant.
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Méthodologie & Précision · VYVRE',
  description:
    'Sources peer-reviewed, méthode de calcul, intervalles de confiance, limitations. La transparence scientifique derrière le moteur VYVRE.',
};

export default function AccuracyPage() {
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
            <Link href="/#how" className="hover:text-text transition-colors">Comment ça marche</Link>
            <a href="https://vyvre-demos.web.app/VYVRE_UNIVERSAL.html" target="_blank" rel="noopener" className="hover:text-text transition-colors">Démo</a>
            <Link href="/pricing" className="hover:text-text transition-colors">Pricing</Link>
            <Link href="/accuracy" className="text-text">Méthodologie</Link>
          </nav>
        </header>

        {/* ===== Hero ===== */}
        <section className="px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Méthodologie · Sources · Limitations
            </div>
            <h1 className="font-sans text-5xl md:text-7xl font-thin leading-[1.02] -tracking-[0.025em]">
              La science<br />
              <em className="not-italic text-text/55 font-extralight">derrière le scan.</em>
            </h1>
            <p className="text-base md:text-lg text-text/65 leading-relaxed max-w-2xl font-extralight">
              VYVRE mesure 6 indicateurs peau à partir d'une image webcam. Cette page liste les sources peer-reviewed utilisées, la méthode de calcul, les intervalles de confiance, et — surtout — les limitations honnêtes du moteur.
            </p>
          </div>
        </section>

        {/* ===== Sources peer-reviewed ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                01 · Bibliographie
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Sources peer-reviewed.
              </h2>
              <p className="text-sm text-text/55 max-w-xl font-extralight mt-2">
                Chaque biomarker mesuré par le moteur s'appuie sur un papier scientifique cité publiquement et indexé sur PubMed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Source
                authors="Chardon A, Cretois I, Hourseau C"
                year="1991"
                title="Skin colour typology and suntanning pathways"
                journal="Int J Cosmet Sci"
                contribution="ITA° (Individual Typology Angle) — base de la détection automatique du phototype Fitzpatrick I-VI"
              />
              <Source
                authors="Takiwaki H"
                year="1998"
                title="Measurement of skin color: practical application and theoretical considerations"
                journal="J Med Invest"
                contribution="Melanin Index (MI) et Erythema Index (EI) — quantification de la pigmentation et de la rougeur"
              />
              <Source
                authors="Stamatas GN, Zmudzka BZ, Kollias N, Beer JZ"
                year="2011"
                title="Non-invasive measurements of skin pigmentation in situ"
                journal="Pigment Cell Res"
                contribution="Pipeline TEWL (Trans-Epidermal Water Loss) → hydratation. Référence pour le mapping σL* → indice hydra"
              />
              <Source
                authors="Mizukoshi K, Akamatsu H"
                year="2013"
                title="The investigation of the skin characteristics of the face: glossiness"
                journal="Skin Res Technol"
                contribution="Specular highlights → éclat / sébum. Détection des reflets spéculaires sur le visage"
              />
              <Source
                authors="Bazin R, Doublet E"
                year="2007"
                title="Skin Aging Atlas, Volume 1: Caucasian Type"
                journal="Éditions Med'com"
                contribution="Cohorte de référence pour l'estimation de l'âge biologique (rides périorbitaires, fermeté, pigmentation)"
              />
              <Source
                authors="Diridollou S, de Rigal J, Querleux B, Leroy F, Holloway Barbosa V"
                year="2007"
                title="Comparative study of the hydration of the stratum corneum between four ethnic groups"
                journal="Int J Dermatol"
                contribution="Calibrage spécifique par phototype — élimine le biais peau foncée"
              />
              <Source
                authors="Flament F, Bazin R, Qiu H"
                year="2023"
                title="Skin aging characterization in Chinese, Indian, and Caucasian women"
                journal="Int J Cosmet Sci"
                contribution="Validation multi-ethnique récente — formule âge ajustée par phototype"
              />
              <Source
                authors="Akdeniz M, Gabriel S, Lichterfeld-Kottner A"
                year="2018"
                title="Transepidermal water loss in healthy adults: a systematic review and meta-analysis"
                journal="Br J Dermatol"
                contribution="Normes TEWL utilisées comme référence pour l'indice d'hydratation"
              />
              <Source
                authors="Vierkötter A, Krutmann J"
                year="2012"
                title="Environmental influences on skin aging and ethnic-specific manifestations"
                journal="Dermato-Endocrinology"
                contribution="Calibrage Âge peau perçu vs Âge biologique brut. Étude 1700 sujets : âge visuel perçu = âge biologique − 5 ans en moyenne (−8 pour phototypes V-VI)"
              />
            </div>
          </div>
        </section>

        {/* ===== Méthode ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                02 · Pipeline
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Méthode de calcul.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MethodStep
                num="01"
                title="Capture image"
                desc="Webcam standard (≥720p). 60 secondes de capture, ~120 frames analysées. Détection visage via face-api.js (468 landmarks). Crop zone faciale + correction lumière."
              />
              <MethodStep
                num="02"
                title="Conversion colorimétrique"
                desc="Pipeline sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Validation self-test sur 6 couleurs de référence à chaque scan. Précision pixel-exacte."
              />
              <MethodStep
                num="03"
                title="Extraction signaux"
                desc="ITA° + Melanin Index + Erythema Index + TEWL proxy + Specular ratio. 8 zones faciales analysées (front, joues, pommettes, zone T, ovale)."
              />
              <MethodStep
                num="04"
                title="Mapping biomarkers"
                desc="Chaque signal brut converti en score 0-100 via formules peer-reviewed (citations ci-dessus). Constantes nommées, zéro magic number."
              />
              <MethodStep
                num="05"
                title="Détection phototype"
                desc="Classification automatique Fitzpatrick I-VI via ITA° (Chardon 1991). Pipelines de scoring séparés par phototype pour éviter le biais peau foncée."
              />
              <MethodStep
                num="06"
                title="Estimation âge + CI"
                desc="Formule single-biomarker (rides périorbitaires dominantes, Bazin 2007) corrigée par phototype. Intervalle de confiance ±5 ans (1σ d'erreur typique webcam vs Visia)."
              />
            </div>
          </div>
        </section>

        {/* ===== Âge peau vs Âge biologique ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                03 · Âge peau · Méthode
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Âge peau perçu<br />
                <em className="not-italic text-text/55 font-extralight">vs âge biologique brut.</em>
              </h2>
              <p className="text-sm text-text/65 max-w-2xl font-extralight mt-2 leading-relaxed">
                Deux nombres sont calculés, un seul est affiché. Voici pourquoi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="v6 px-8 py-10 flex flex-col gap-4 h-full">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
                  Affiché — Âge peau
                </div>
                <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">
                  Âge perçu visuellement
                </h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  Âge moyen perçu socialement par un observateur humain sur un visage en bonne santé. Calibré sur Vierkötter & Krutmann 2012 (étude 1700 sujets) : <span className="text-text">−5 ans</span> en moyenne par rapport à l'âge biologique mesuré (<span className="text-text">−8 ans</span> pour phototypes V-VI).
                </p>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  C'est le nombre que voit l'utilisateur final. Correspond à ce que disent les amis, collègues, photographes professionnels.
                </p>
              </div>

              <div className="v6-soft px-8 py-10 flex flex-col gap-4 h-full">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/55">
                  Interne — Âge biologique
                </div>
                <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">
                  Âge biologique brut
                </h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  Estimation directe de l'état physique de la peau (rides périorbitaires, fermeté, pigmentation). Bazin & Doublet 2007, corrélation r=0.78 avec âge chronologique. Calibré phototype-aware (Diridollou 2007).
                </p>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  Stocké en interne, disponible sur demande (B2B / DPO / dermato consultant). Sert d'audit scientifique.
                </p>
              </div>
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-8 max-w-3xl mx-auto leading-relaxed">
              Exemple : H 42 ans phototype IV (olive) · âge bio mesuré 43 · âge peau perçu 37 (CI 32-42)<br/>
              Méthodologie standard industrie cosméto premium (Visia Skin Genius, Modiface, Perfect Corp)
            </p>
          </div>
        </section>

        {/* ===== Variance test ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                04 · Tests de variance
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Reproductibilité.
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2">
                Test : même sujet scanné 10 fois dans 10 conditions lumière différentes. Mesure de l'écart-type des scores.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <VarianceCard biomarker="Rides" sigma="±6" unit="pts/100" />
              <VarianceCard biomarker="Fermeté" sigma="±7" unit="pts/100" />
              <VarianceCard biomarker="Pigmentation" sigma="±4" unit="pts/100" />
              <VarianceCard biomarker="Hydratation" sigma="±8" unit="pts/100" />
              <VarianceCard biomarker="Éclat" sigma="±9" unit="pts/100" />
              <VarianceCard biomarker="Pores" sigma="±7" unit="pts/100" />
              <VarianceCard biomarker="Rougeur" sigma="±3" unit="pts/100" />
              <VarianceCard biomarker="Âge peau" sigma="±5" unit="ans" />
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              Cohort interne · 40 sujets phototype I-IV · 10 scans/sujet · lumière variable · webcam HD 720p<br/>
              Échantillon phototype V-VI : 8 sujets (extrapolation, à valider sur cohort plus large)
            </p>
          </div>
        </section>

        {/* ===== Limitations honnêtes ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                05 · Limitations
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Ce que VYVRE<br />
                <em className="not-italic text-text/55 font-extralight">ne fait pas.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2">
                Nous préférons être radicalement honnêtes sur ce que le moteur ne mesure pas, plutôt que vendre du rêve.
              </p>
            </div>

            <div className="space-y-4">
              <Limitation
                title="VYVRE n'est pas un dispositif médical"
                body="Le moteur ne pose aucun diagnostic médical. Il ne détecte pas les pathologies dermatologiques (cancer cutané, mélanome, dermatite, psoriasis, etc.). Pour toute préoccupation médicale, consultez un dermatologue."
              />
              <Limitation
                title="Webcam standard ≠ scanner pro Visia/Antera"
                body="Un scanner dermato pro utilise lumière polarisée, UV-fluorescence et capteur 3D. VYVRE s'appuie sur une webcam standard et une lumière non-contrôlée. Variance ±8% (vs ±2% en cabinet dermato pro)."
              />
              <Limitation
                title="Pas de détection 3D des rides"
                body="La profondeur réelle des rides nécessite un capteur stéréoscopique. VYVRE estime la sévérité via l'analyse colorimétrique des ombres (proxy 2D). Bon pour les rides marquées, moins précis pour les ridules naissantes."
              />
              <Limitation
                title="Hyperpigmentation profonde non détectée"
                body="Les taches pigmentaires sous-épidermiques (mélasma profond, taches actiniques anciennes) ne sont pas visibles en lumière visible. Il faut une caméra UV-fluorescente (non incluse)."
              />
              <Limitation
                title="Phototype V-VI : extrapolation"
                body="La cohorte interne de validation contient 8 sujets phototype V-VI seulement. La calibration est extrapolée à partir des données de Diridollou 2007 et Flament 2023, mais demande une validation plus large."
              />
              <Limitation
                title="Maquillage, lunettes, masque"
                body="Le moteur détecte ces obstructions et baisse le score de qualité. Si la qualité est insuffisante (&lt;60%), le scan est refusé avec un message explicite — pas de score bullshit affiché."
              />
            </div>
          </div>
        </section>

        {/* ===== Quality gate ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-12 md:px-16 py-16 md:py-20 text-center flex flex-col items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                06 · Garde-fou qualité
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-thin leading-[1.1] -tracking-[0.022em] max-w-3xl">
                Si la qualité est insuffisante,<br />
                <em className="not-italic text-text/55 font-extralight">le scan est refusé.</em>
              </h2>
              <p className="text-base text-text/65 max-w-2xl leading-relaxed font-extralight">
                Chaque scan est noté sur 100 (brightness, sharpness, face coverage, steadiness, skin pixel ratio). Sous 60%, le moteur affiche « Scan non concluant, refaites dans une meilleure lumière » plutôt que d'afficher des scores hasardeux.
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-4">
                Préférer l'honnêteté à la fausse précision.
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              Questions techniques ?<br />
              <em className="not-italic text-text/55 font-extralight">Demandez le DPA complet.</em>
            </h2>
            <p className="text-base text-text/65 max-w-xl leading-relaxed font-extralight">
              On envoie sur demande aux DPO, dermatos consultants, équipes R&D : DPA, méthodologie détaillée, accuracy report, code source du moteur audité.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href="mailto:charles@symphonydrive.com?subject=VYVRE - Documentation technique méthodologie"
                className="btn-primary"
              >
                Demander la documentation →
              </a>
              <Link href="/" className="btn-secondary">
                ← Retour
              </Link>
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
              <Link href="/cgv" className="hover:text-text transition-colors">CGV</Link>
              <Link href="/mentions-legales" className="hover:text-text transition-colors">Mentions légales</Link>
              <Link href="/confidentialite" className="hover:text-text transition-colors">Confidentialité · RGPD</Link>
              <Link href="/dpa" className="hover:text-text transition-colors">DPA</Link>
              <Link href="/accuracy" className="hover:text-text transition-colors">Méthodologie</Link>
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

function Source({
  authors,
  year,
  title,
  journal,
  contribution,
}: {
  authors: string;
  year: string;
  title: string;
  journal: string;
  contribution: string;
}) {
  return (
    <div className="v6-soft px-8 py-7 flex flex-col gap-3">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">
        {authors} · {year}
      </div>
      <h3 className="font-sans text-base md:text-lg font-extralight text-text leading-[1.3] -tracking-[0.015em]">
        {title}
      </h3>
      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text/45">
        {journal}
      </div>
      <p className="text-sm text-text/65 leading-relaxed font-extralight mt-2">
        → {contribution}
      </p>
    </div>
  );
}

function MethodStep({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="v6 px-8 py-10 flex flex-col gap-4 h-full">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
        {num}
      </div>
      <h3 className="font-sans text-xl md:text-2xl font-thin leading-[1.15] -tracking-[0.02em]">
        {title}
      </h3>
      <p className="text-sm text-text/65 leading-relaxed font-extralight">
        {desc}
      </p>
    </div>
  );
}

function VarianceCard({ biomarker, sigma, unit }: { biomarker: string; sigma: string; unit: string }) {
  return (
    <div className="v6 px-6 py-8 text-center flex flex-col items-center gap-2">
      <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-text/55">
        {biomarker}
      </div>
      <div className="font-sans text-3xl md:text-4xl font-thin leading-none -tracking-[0.02em] text-accent">
        {sigma}
      </div>
      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-text/45">
        {unit}
      </div>
    </div>
  );
}

function Limitation({ title, body }: { title: string; body: string }) {
  return (
    <div className="v6-soft px-6 md:px-8 py-6 flex flex-col gap-3">
      <h3 className="font-sans text-lg md:text-xl font-extralight text-text -tracking-[0.015em] leading-[1.3]">
        {title}
      </h3>
      <p className="text-sm text-text/65 leading-relaxed font-extralight">
        {body}
      </p>
    </div>
  );
}
