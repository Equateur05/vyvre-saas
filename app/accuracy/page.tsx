/**
 * VYVRE — /accuracy
 *
 * Page méthodologie publique (v7.0 HONEST). Aligne marketing avec ce que
 * fait vraiment l'engine. Distinction explicite entre :
 *   - 5 sources appliquées dans les formules (Chardon, Takiwaki, Stamatas,
 *     Mizukoshi, Vierkötter)
 *   - 4 sources référencées en roadmap Q3 2026 (Bazin détaillé, Diridollou
 *     full coefficients, Flament 2023 coefficients, Akdeniz numériques)
 *
 * Indispensable pour défendre le pitch face à un DPO cosméto ou un dermato
 * consultant. Refonte mai 2026 suite à l'audit interne v6.2.
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Méthodologie & Précision · VYVRE',
  description:
    'Sources peer-reviewed (5 appliquées, 4 en roadmap), méthode de calcul, intervalles de confiance, limitations. La transparence scientifique derrière le moteur VYVRE v7.0.',
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
            <Link href="/accuracy/benchmark" className="hover:text-text transition-colors">Benchmark</Link>
          </nav>
        </header>

        {/* ===== Hero ===== */}
        <section className="px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              Méthodologie · Sources · Limitations · v7.0 HONEST
            </div>
            <h1 className="font-sans text-5xl md:text-7xl font-thin leading-[1.02] -tracking-[0.025em]">
              La science<br />
              <em className="not-italic text-text/55 font-extralight">derrière le scan.</em>
            </h1>
            <p className="text-base md:text-lg text-text/65 leading-relaxed max-w-2xl font-extralight">
              VYVRE mesure 8 indicateurs peau à partir d'une image webcam. Cette page liste les <span className="text-text">5 sources peer-reviewed activement appliquées</span> + <span className="text-text">4 référencées en roadmap Q3 2026</span>, la méthode de calcul, les intervalles de confiance, et — surtout — les limitations honnêtes du moteur.
            </p>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/45 mt-4">
              Précision estimée ±5 ans bioAge · ±4 ans perceivedAge (95% CI · cohorte interne n=12)<br/>
              Validation externe n=100 prévue Q3 2026 · refonte mai 2026 suite audit interne
            </div>
          </div>
        </section>

        {/* ===== Sources peer-reviewed (APPLIQUÉES) ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                01 · Bibliographie · Sources appliquées
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                5 sources peer-reviewed<br />
                <em className="not-italic text-text/55 font-extralight">activement appliquées.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                Ces 5 sources sont directement utilisées dans les formules de calcul du moteur (cf. <code className="font-mono text-xs text-accent">vyvre-scan-engine.js</code>, fonction <code className="font-mono text-xs text-accent">mapToScores</code> et <code className="font-mono text-xs text-accent">estimateAge</code>). Chaque biomarker est traçable à un papier scientifique indexé sur PubMed.
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
                contribution="Proxy TEWL (Trans-Epidermal Water Loss) via σL* → indices hydratation et pores. Régression Table 3."
              />
              <Source
                authors="Mizukoshi K, Akamatsu H"
                year="2013"
                title="The investigation of the skin characteristics of the face: glossiness"
                journal="Skin Res Technol"
                contribution="Specular highlights → éclat / sébum. Détection des reflets spéculaires sur le visage"
              />
              <Source
                authors="Vierkötter A, Krutmann J"
                year="2012"
                title="Environmental influences on skin aging and ethnic-specific manifestations"
                journal="Dermato-Endocrinology"
                contribution="Bias d'âge perçu vs âge biologique (cohorte caucasienne ~1700 sujets). v7 : bias age-dependent (-2 à -6 ans selon âge bio), pas phototype-specific."
              />
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              v7.0 HONEST — refonte mai 2026 suite à audit interne v6.2 (note 4/10)<br/>
              Sources appliquées vérifiables ligne par ligne dans <span className="text-accent">vyvre-scan-engine.js</span>
            </p>
          </div>
        </section>

        {/* ===== Sources peer-reviewed (RÉFÉRENCÉES — roadmap Q3 2026) ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                02 · Bibliographie · Roadmap Q3 2026
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                4 sources référencées<br />
                <em className="not-italic text-text/55 font-extralight">pas encore pleinement appliquées.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                Ces sources sont citées pour transparence et roadmap publique. Leurs coefficients complets ne sont pas encore intégrés dans les formules — extraction et validation prévues Q3 2026 avec partenaire dermato.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SourceRoadmap
                authors="Bazin R, Doublet E"
                year="2007"
                title="Skin Aging Atlas, Volume 1: Caucasian Type"
                journal="Éditions Med'com"
                applied="Anchor age 40 (médiane cohorte adulte) + corrélation r=0.78 rides périorbitaires↔âge"
                roadmap="Extraction images → grade morphologique 0-5 (Bazin scoring) non encore implémentée. Prévue Q3 2026."
              />
              <SourceRoadmap
                authors="Diridollou S, de Rigal J, Querleux B"
                year="2007"
                title="Comparative study of skin aging between four ethnic groups"
                journal="Int J Dermatol"
                applied="Ajustement modeste -4% à -8% sur bioAge pour phototypes IV-VI"
                roadmap="Coefficients phototype-specific complets pour wrinkles/firmness/pigmentation non encore extraits."
              />
              <SourceRoadmap
                authors="Flament F, Bazin R, Qiu H"
                year="2023"
                title="Skin aging characterization in Chinese, Indian, and Caucasian women"
                journal="Int J Cosmet Sci"
                applied="Cité pour contexte multi-ethnique"
                roadmap="Coefficients spécifiques non encore extraits. Validation cohorte multi-ethnique prévue Q3 2026."
              />
              <SourceRoadmap
                authors="Akdeniz M, Gabriel S, Lichterfeld-Kottner A"
                year="2018"
                title="Transepidermal water loss in healthy adults: meta-analysis"
                journal="Br J Dermatol"
                applied="Normes cliniques TEWL référencées (sain ≤15 g/m²/h, compromis ≥25)"
                roadmap="Le pipeline numérique σL*→TEWL suit Stamatas 2011 (et non Akdeniz). Cross-validation prévue."
              />
            </div>
          </div>
        </section>

        {/* ===== Benchmark public ===== */}
        <section className="px-8 py-20 border-t border-line bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                Benchmark public · UTKFace · 26 mai 2026
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Comparé publiquement<br />
                <em className="not-italic text-text/55 font-extralight">contre 3 leaders open-source.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight leading-relaxed mt-2">
                VYVRE v7.0 testé sur 300 visages publics UTKFace (stratifiés 18-80 ans) aux côtés de DeepFace, InsightFace et OpenCV DNN. Verdict honnête publié, code reproductible, 5 scripts, 4 min runtime.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <div className="v6-soft px-5 py-5 flex flex-col gap-1 text-center">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">30-44 (target)</div>
                <div className="text-2xl font-thin text-text">5.75y</div>
                <div className="text-[10px] text-text/55 font-mono">MAE — bat OpenCV (8.66y)</div>
              </div>
              <div className="v6-soft px-5 py-5 flex flex-col gap-1 text-center">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">Overall (18-80)</div>
                <div className="text-2xl font-thin text-text">12.89y</div>
                <div className="text-[10px] text-text/55 font-mono">MAE — derrière deep nets</div>
              </div>
              <div className="v6-soft px-5 py-5 flex flex-col gap-1 text-center">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">Biais signé</div>
                <div className="text-2xl font-thin text-text">-0.71y</div>
                <div className="text-[10px] text-text/55 font-mono">Le plus neutre des 4 moteurs</div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/accuracy/benchmark" className="btn-primary inline-block">
                Voir le benchmark complet →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Fondations colorimétriques ===== */}
        <section className="px-8 py-16 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                03 · Standards colorimétriques (fondations)
              </span>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                Standards normatifs sous-jacents — pas des "papers peer-reviewed" mais des spécifications techniques actives dans le pipeline.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-text/65 font-extralight leading-relaxed">
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">IEC 61966-2-1</span> sRGB color space (gamma decode)</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">ITU-R BT.709-6</span> Rec. 709 RGB primaries</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">CIE 015:2004</span> XYZ → L*a*b* conversion</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">Del Bino 2013</span> Fitzpatrick ITA° boundaries</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">Hsu 2002</span> YCbCr skin pixel detection</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono">Pertuz 2013</span> Laplacian sharpness measure</div>
              <div className="v6-soft px-5 py-4 md:col-span-2 lg:col-span-3"><span className="text-accent font-mono">Nkengne 2008</span> Firmness ↔ perceived age correlation (corrélation r=0.65 ITA° distance ↔ fermeté perçue)</div>
            </div>
          </div>
        </section>

        {/* ===== Méthode ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                04 · Pipeline
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
                desc="ITA° + Melanin Index + Erythema Index + TEWL proxy + Specular ratio. 4 zones faciales analysées (front, joues L/R, zone T)."
              />
              <MethodStep
                num="04"
                title="Mapping biomarkers"
                desc="Chaque signal brut converti en score 0-100 via formules peer-reviewed (citations ci-dessus). Constantes nommées avec citation source ou flag ⚠️ empirique."
              />
              <MethodStep
                num="05"
                title="Détection phototype"
                desc="Classification automatique Fitzpatrick I-VI via ITA° (Chardon 1991). Clamps de pigmentation adaptés au phototype pour éviter le biais peau foncée."
              />
              <MethodStep
                num="06"
                title="Estimation âge + CI"
                desc="Formule single-biomarker (rides périorbitaires dominantes, Bazin 2007). Bias d'âge perçu age-dependent (Vierkötter 2012). CI ±5 ans (95% cohorte interne n=12)."
              />
            </div>
          </div>
        </section>

        {/* ===== Âge peau vs Âge biologique ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                05 · Âge peau · Méthode v7
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
                  Âge moyen perçu socialement par un observateur humain. Calibré sur Vierkötter & Krutmann 2012 (cohorte caucasienne ~1700 sujets) avec un bias <span className="text-text">age-dependent</span> :
                </p>
                <ul className="text-xs text-text/55 leading-relaxed font-extralight font-mono pl-4 space-y-1">
                  <li>&lt; 30 ans bio → −2 ans</li>
                  <li>30-45 ans bio → −4 ans</li>
                  <li>45-60 ans bio → −5 ans</li>
                  <li>60+ ans bio → −5 à −6 ans</li>
                </ul>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  v7 retire le mapping phototype-specific de v6 (qui n'était PAS dans la source originale). Le phototype influence l'âge biologique (Diridollou), pas la perception sociale.
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
                  Estimation directe de l'état physique de la peau via le score wrinkles dominant (rides périorbitaires, Bazin 2007). Corrélation r=0.78 avec âge chronologique en photos studio.
                </p>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  Formule v7 : <code className="font-mono text-[10px]">bioAge = 40 + (50 − wrinkles) × 0.85 × 0.85 × phototypeAdjust</code>. Le facteur 0.85 (pénalité webcam JPEG) est une compensation empirique honnête, validation cohort large planifiée Q3 2026.
                </p>
              </div>
            </div>

            <div className="v6-soft px-8 py-6 mt-4 text-center">
              <p className="text-sm text-text/65 font-extralight leading-relaxed">
                Précision estimée : <span className="text-text">±5 ans bioAge</span>, <span className="text-text">±4 ans perceivedAge</span> (95% CI sur cohorte interne n=12)
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-2">
                Validation externe n=100 prévue Q3 2026 · partenaire dermato TBD
              </p>
            </div>
          </div>
        </section>

        {/* ===== Quality-aware behavior v7 (refus de scan dégradé) ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                06 · Comportement quality-aware v7
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                3 niveaux de confiance.<br />
                <em className="not-italic text-text/55 font-extralight">Pas de hack flatteur.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                v7 retire le hack v6.2 qui rajeunissait artificiellement les scans dégradés (paradoxe « moins l'IA voit, plus elle flatte »). À la place, 3 niveaux explicites de confiance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-red-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/80">Quality &lt; 40</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">Refus du scan</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">Aucune estimation publiée. Message <code className="font-mono text-xs text-accent">scan_quality_too_low</code> avec recommandation de refaire dans une meilleure lumière. Le point estimate N'EST PAS calculé.</p>
              </div>

              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-amber-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-400/80">40 ≤ Quality &lt; 60</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">Faible confiance</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">Estimation best-effort publiée mais flag <code className="font-mono text-xs text-accent">confidence: 'low'</code>. CI élargi à ±7 ans (vs ±5 standard). Le point estimate reste honnête, pas shifté.</p>
              </div>

              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-emerald-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald-400/80">Quality ≥ 60</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">Standard</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">Estimation standard avec <code className="font-mono text-xs text-accent">confidence: 'standard'</code>. CI ±5 ans (95% sur cohorte interne n=12). Comportement nominal pour webcam HD bien éclairée.</p>
              </div>
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              Hack v6.2 retiré : −5 ans sur scan pourri (quality &lt; 45)<br/>
              v7 élargit le range plutôt que de shifter le point estimate (préfère l'honnêteté à la flatterie)
            </p>
          </div>
        </section>

        {/* ===== Variance test ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                07 · Tests de variance
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Reproductibilité.
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2">
                Test : même sujet scanné 10 fois dans 10 conditions lumière différentes. Mesure de l'écart-type des scores. Cohorte interne n=12.
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
              <VarianceCard biomarker="Âge perçu" sigma="±4" unit="ans" />
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              Cohort interne · n=12 sujets phototype I-IV · 10 scans/sujet · lumière variable · webcam HD 720p<br/>
              Phototype V-VI : extrapolation Diridollou 2007 — validation cohorte dédiée prévue Q3 2026<br/>
              <span className="text-text">Validation externe n=100 prévue Q3 2026 · partenaire dermato TBD</span>
            </p>
          </div>
        </section>

        {/* ===== Roadmap Q3 2026 ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                08 · Roadmap validation
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Ce qu'on s'engage<br />
                <em className="not-italic text-text/55 font-extralight">à valider.</em>
              </h2>
            </div>

            <div className="space-y-4">
              <RoadmapItem
                quarter="Q3 2026"
                title="Validation cohorte externe n=100"
                body="Recrutement n=100 sujets variés (20-75 ans, phototypes I-VI). Partenariat dermato TBD. Mesure ICC vs Visia/Antera de référence. Publication méthodologique."
              />
              <RoadmapItem
                quarter="Q3 2026"
                title="Bazin 0-5 grade morphologique"
                body="Extraction depuis images du grade morphologique Bazin (atlas vol.1 chap. 4) — actuellement seul l'anchor age 40 et la corrélation r=0.78 sont utilisés. Implémentation détection profondeur rides + classification 0-5."
              />
              <RoadmapItem
                quarter="Q4 2026"
                title="Coefficients phototype-specific (Diridollou + Flament)"
                body="Extraction des coefficients de Diridollou 2007 et Flament 2023 pour wrinkles/firmness/pigmentation par phototype. Actuellement v7 applique un ajustement modeste -4% à -8% sur bioAge phototypes IV-VI ; objectif : full mapping phototype-specific aux coefficients sources."
              />
              <RoadmapItem
                quarter="Q4 2026"
                title="Publication peer-reviewed"
                body="Soumission d'un papier méthodologique décrivant le pipeline VYVRE (webcam consumer → biomarqueurs CIE LAB → estimation âge) avec validation cohorte n=100. Cible : Int J Cosmet Sci ou Skin Res Technol."
              />
            </div>
          </div>
        </section>

        {/* ===== Limitations honnêtes ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                09 · Limitations
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
                title="Phototype V-VI : extrapolation honnête"
                body="La cohorte interne n=12 contient principalement phototypes I-IV. Les ajustements pour V-VI sont extrapolés des données de Diridollou 2007 (-4% à -8% sur bioAge). Validation cohorte dédiée prévue Q3 2026."
              />
              <Limitation
                title="Maquillage, lunettes, masque"
                body="Le moteur détecte ces obstructions et baisse le score de qualité. Si la qualité est trop faible (&lt;40), le scan est refusé. Entre 40-60, le scan est publié avec un flag explicite confidence=low + range élargi."
              />
              <Limitation
                title="Cohorte interne n=12 est petite — on l'assume"
                body="Les coefficients empiriques (pénalité webcam JPEG, range CI) sont calibrés sur n=12 sujets. C'est une « focus group », pas une « cohorte clinique ». Validation externe n=100 explicite dans la roadmap Q3 2026."
              />
            </div>
          </div>
        </section>

        {/* ===== Conditions cliniques (module bonus v1) ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                10 · Module bonus · Conditions cliniques (v1 indicatif)
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                Détection visuelle de 4 conditions<br />
                <em className="not-italic text-text/55 font-extralight">indicatives, jamais médicales.</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                Module séparé <code className="font-mono text-xs text-accent">vyvre-conditions-engine.js</code> (v1.0.0-heuristic) — chargement optionnel sur n'importe quel POC. Détecte par heuristiques image 4 conditions visuelles fréquentes et propose une routine cosmétique non-prescription ciblée. <strong className="text-text">Ce module ne pose aucun diagnostic médical.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <Source
                authors="Module · Acné (Tan 2018)"
                year="v1"
                title="Focal a* CIELAB erythema + texture L* variance"
                journal="Sensitivity ~70 % · Specificity ~75 % (synth. cohort n=12)"
                contribution="Détection de pixels érythémateux focaux concentrés en spots discrets sur zone T (front, nez, menton). Sortie : probability + severity {minimal, low, medium, high}."
              />
              <Source
                authors="Module · Rosacée (Sandoval-Pillajo 2020)"
                year="v1"
                title="Excès médian a* joues+nez vs baseline + symétrie bilatérale"
                journal="Sensitivity ~65 % · Specificity ~70 % (synth. cohort n=12)"
                contribution="Érythème persistant et bilatéral sur joues + nez. La symétrie inter-joues pondère le score (rosacée = bilatérale)."
              />
              <Source
                authors="Module · Mélasma (heuristic)"
                year="v1"
                title="ΔL* front & lèvre sup. vs top-quartile L* joues + Δb* (mélanine)"
                journal="Sensitivity ~55 % · Specificity ~70 % (synth. cohort n=12)"
                contribution="Hyperpigmentation symétrique centrofaciale (front, lèvre supérieure, pommettes). Distingue mélasma diffus de spots discrets."
              />
              <Source
                authors="Module · Lentigos (Pandey 2019)"
                year="v1"
                title="Blob detection (size 5-200 px², compactness ≥ 0.45)"
                journal="Sensitivity ~60 % · Specificity ~75 % (synth. cohort n=12)"
                contribution="Spots pigmentaires isolés, contours nets, sur joues + front. Compte de blobs qualifiés rapporté à la surface peau (densité / 1000 pixels)."
              />
            </div>

            <div className="v6-soft px-8 py-7">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">
                Pourquoi heuristiques et pas CNN ISIC ?
              </div>
              <ul className="text-sm text-text/65 leading-relaxed font-extralight space-y-2">
                <li>→ Les datasets ISIC / DermNet contiennent des images <em>cliniques</em> en gros plan, lumière polarisée, ROI lésionnelle ciblée. Distribution très éloignée d'une webcam consumer à 50 cm sous lumière non contrôlée — un CNN entraîné dessus transférerait mal sans fine-tune cohorte VYVRE dédiée.</li>
                <li>→ Les heuristiques restent <em>auditables ligne par ligne</em>, ce qu'un CNN black-box n'est pas. Compatible avec les exigences d'explicabilité des grandes maisons (Chanel, Dior, L'Oréal R&D).</li>
                <li>→ Pas de modèle à télécharger (0 MB), pas de GPU requis, fonctionne sur tous navigateurs en moins de 200 ms.</li>
                <li>→ Architecture stable : une v2 future peut substituer un CNN derrière la même API <code className="font-mono text-xs text-accent">detectConditions()</code> sans casser les POCs intégrants.</li>
              </ul>
            </div>

            <div className="mt-8 v6-soft px-8 py-7 border-l-4 border-accent">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
                Disclaimer médical (obligatoire sur tout affichage)
              </div>
              <p className="text-sm text-text/75 leading-relaxed font-extralight italic">
                Ce module n'est pas un dispositif médical. Il ne pose aucun diagnostic. Les probabilités retournées sont des indicateurs de « zones d'attention » pour recommander une routine cosmétique ciblée. Pour toute préoccupation cutanée réelle, consultez un dermatologue.
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-4">
                Indicative detection. NOT a medical diagnosis. Consult a dermatologist for clinical assessment.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a
                href="https://vyvre-demos.web.app/CONDITIONS_DEMO.html"
                target="_blank"
                rel="noopener"
                className="btn-primary"
              >
                Voir la démo Conditions →
              </a>
              <a
                href="https://vyvre-demos.web.app/vyvre-conditions-engine.js"
                target="_blank"
                rel="noopener"
                className="btn-secondary"
              >
                Code source du module
              </a>
            </div>
          </div>
        </section>

        {/* ===== Engagement honnêteté ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-12 md:px-16 py-16 md:py-20 text-center flex flex-col items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                11 · Garde-fou qualité · Engagement honnêteté
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-thin leading-[1.1] -tracking-[0.022em] max-w-3xl">
                Préférer l'honnêteté<br />
                <em className="not-italic text-text/55 font-extralight">à la fausse précision.</em>
              </h2>
              <p className="text-base text-text/65 max-w-2xl leading-relaxed font-extralight">
                v7.0 retire les hacks v6.2 qui flattaient artificiellement l'utilisateur (rajeunissement caché de -5 ans sur webcam dégradée, plafonds [20, 50] qui rendaient un 80ans à 50, mapping phototype-specific inventé hors-source).
              </p>
              <p className="text-sm text-text/55 max-w-2xl leading-relaxed font-extralight italic">
                Si la peau réelle de l'utilisateur fait 38 ans à un dermato, l'engine doit dire 38. Pas 28 (mensonge flatteur). Pas 44 (faux brutal). Vraie estimation.
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-4">
                VYVRE estimation is indicative. For clinical diagnosis, consult a dermatologist.
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

function SourceRoadmap({
  authors,
  year,
  title,
  journal,
  applied,
  roadmap,
}: {
  authors: string;
  year: string;
  title: string;
  journal: string;
  applied: string;
  roadmap: string;
}) {
  return (
    <div className="v6-soft px-8 py-7 flex flex-col gap-3 border-l-2 border-amber-400/30">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-amber-400/80">
        {authors} · {year}
      </div>
      <h3 className="font-sans text-base md:text-lg font-extralight text-text leading-[1.3] -tracking-[0.015em]">
        {title}
      </h3>
      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-text/45">
        {journal}
      </div>
      <p className="text-xs text-text/65 leading-relaxed font-extralight mt-1">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-text/45">Appliqué partiellement : </span>{applied}
      </p>
      <p className="text-xs text-amber-400/70 leading-relaxed font-extralight mt-1">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase">Roadmap : </span>{roadmap}
      </p>
    </div>
  );
}

function RoadmapItem({ quarter, title, body }: { quarter: string; title: string; body: string }) {
  return (
    <div className="v6-soft px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-start gap-4">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent md:w-24 md:flex-shrink-0 md:pt-1">
        {quarter}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="font-sans text-lg md:text-xl font-extralight text-text -tracking-[0.015em] leading-[1.3]">
          {title}
        </h3>
        <p className="text-sm text-text/65 leading-relaxed font-extralight">
          {body}
        </p>
      </div>
    </div>
  );
}
