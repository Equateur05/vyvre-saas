/**
 * VYVRE — /accuracy
 *
 * Page méthodologie publique (v7.0). Distinction explicite entre :
 *   - 5 sources appliquées dans les formules (Chardon, Takiwaki, Stamatas,
 *     Mizukoshi, Vierkötter)
 *   - 4 sources référencées en feuille de route fin 2026 (Bazin, Diridollou,
 *     Flament 2023, Akdeniz)
 *
 * Douze langues, choisies côté serveur (lib/i18n). Ne se traduisent jamais :
 * les noms d'auteurs, les titres d'articles, les noms de revues, les noms de
 * normes et les extraits de code — ce sont des références citables.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import SiteHeader from '../SiteHeader';
import { getPage } from '../../lib/i18n/server';
import type { T } from '../../lib/i18n';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('acc.meta.title'), description: t('acc.meta.desc') };
}

export default function AccuracyPage() {
  const { t } = getPage();

  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />

      <main className="min-h-screen flex flex-col">
        <SiteHeader />

        {/* ===== Hero ===== */}
        <section className="px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
              {t('acc.hero.eyebrow')}
            </div>
            <h1 className="font-sans text-5xl md:text-7xl font-thin leading-[1.02] -tracking-[0.025em]">
              {t('acc.hero.h1a')}<br />
              <em className="not-italic text-text/55 font-extralight">{t('acc.hero.h1b')}</em>
            </h1>
            <p className="text-base md:text-lg text-text/65 leading-relaxed max-w-2xl font-extralight">
              {t('acc.hero.p')}
            </p>
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/45 mt-4">
              {t('acc.hero.note1')}<br />
              {t('acc.hero.note2')}
            </div>
          </div>
        </section>

        {/* ===== Sources appliquées ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s1.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s1.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s1.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s1.p1')} <code className="font-mono text-xs text-accent">vyvre-scan-engine.js</code>{t('acc.s1.p2')} <code className="font-mono text-xs text-accent">mapToScores</code> {t('acc.s1.p3')} <code className="font-mono text-xs text-accent">estimateAge</code>{t('acc.s1.p4')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Source
                authors="Chardon A, Cretois I, Hourseau C"
                year="1991"
                title="Skin colour typology and suntanning pathways"
                journal="Int J Cosmet Sci"
                contribution={t('acc.src1.c')}
              />
              <Source
                authors="Takiwaki H"
                year="1998"
                title="Measurement of skin color: practical application and theoretical considerations"
                journal="J Med Invest"
                contribution={t('acc.src2.c')}
              />
              <Source
                authors="Stamatas GN, Zmudzka BZ, Kollias N, Beer JZ"
                year="2011"
                title="Non-invasive measurements of skin pigmentation in situ"
                journal="Pigment Cell Res"
                contribution={t('acc.src3.c')}
              />
              <Source
                authors="Mizukoshi K, Akamatsu H"
                year="2013"
                title="The investigation of the skin characteristics of the face: glossiness"
                journal="Skin Res Technol"
                contribution={t('acc.src4.c')}
              />
              <Source
                authors="Vierkötter A, Krutmann J"
                year="2012"
                title="Environmental influences on skin aging and ethnic-specific manifestations"
                journal="Dermato-Endocrinology"
                contribution={t('acc.src5.c')}
              />
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              {t('acc.s1.foot1')}<br />
              {t('acc.s1.foot2')} <span className="text-accent vy-ltr">vyvre-scan-engine.js</span>
            </p>
          </div>
        </section>

        {/* ===== Sources référencées — feuille de route ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s2.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s2.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s2.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s2.p')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SourceRoadmap
                t={t}
                authors="Bazin R, Doublet E"
                year="2007"
                title="Skin Aging Atlas, Volume 1: Caucasian Type"
                journal="Éditions Med'com"
                applied={t('acc.rm1.a')}
                roadmap={t('acc.rm1.r')}
              />
              <SourceRoadmap
                t={t}
                authors="Diridollou S, de Rigal J, Querleux B"
                year="2007"
                title="Comparative study of skin aging between four ethnic groups"
                journal="Int J Dermatol"
                applied={t('acc.rm2.a')}
                roadmap={t('acc.rm2.r')}
              />
              <SourceRoadmap
                t={t}
                authors="Flament F, Bazin R, Qiu H"
                year="2023"
                title="Skin aging characterization in Chinese, Indian, and Caucasian women"
                journal="Int J Cosmet Sci"
                applied={t('acc.rm3.a')}
                roadmap={t('acc.rm3.r')}
              />
              <SourceRoadmap
                t={t}
                authors="Akdeniz M, Gabriel S, Lichterfeld-Kottner A"
                year="2018"
                title="Transepidermal water loss in healthy adults: meta-analysis"
                journal="Br J Dermatol"
                applied={t('acc.rm4.a')}
                roadmap={t('acc.rm4.r')}
              />
            </div>
          </div>
        </section>

        {/* ===== Benchmark public ===== */}
        <section className="px-8 py-20 border-t border-line bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.bench.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.bench.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.bench.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight leading-relaxed mt-2">
                {t('acc.bench.p')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <BenchCard label={t('acc.bench.k1.l')} value={`5.75 ${t('acc.var.unitYears')}`} note={t('acc.bench.k1.n')} />
              <BenchCard label={t('acc.bench.k2.l')} value={`12.89 ${t('acc.var.unitYears')}`} note={t('acc.bench.k2.n')} />
              <BenchCard label={t('acc.bench.k3.l')} value={`-0.71 ${t('acc.var.unitYears')}`} note={t('acc.bench.k3.n')} />
            </div>

            <div className="text-center">
              <Link href="/accuracy/benchmark" className="btn-primary inline-block">
                {t('acc.bench.cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Fondations colorimétriques ===== */}
        <section className="px-8 py-16 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s3.eyebrow')}
              </span>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s3.p')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-text/65 font-extralight leading-relaxed">
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">IEC 61966-2-1</span> {t('acc.s3.std1')}</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">ITU-R BT.709-6</span> {t('acc.s3.std2')}</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">CIE 015:2004</span> {t('acc.s3.std3')}</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">Del Bino 2013</span> {t('acc.s3.std4')}</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">Hsu 2002</span> {t('acc.s3.std5')}</div>
              <div className="v6-soft px-5 py-4"><span className="text-accent font-mono vy-ltr">Pertuz 2013</span> {t('acc.s3.std6')}</div>
              <div className="v6-soft px-5 py-4 md:col-span-2 lg:col-span-3"><span className="text-accent font-mono vy-ltr">Nkengne 2008</span> {t('acc.s3.std7')}</div>
            </div>
          </div>
        </section>

        {/* ===== Méthode ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s4.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s4.h2')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MethodStep num="01" title={t('acc.st1.t')} desc={t('acc.st1.d')} />
              <MethodStep num="02" title={t('acc.st2.t')} desc={t('acc.st2.d')} />
              <MethodStep num="03" title={t('acc.st3.t')} desc={t('acc.st3.d')} />
              <MethodStep num="04" title={t('acc.st4.t')} desc={t('acc.st4.d')} />
              <MethodStep num="05" title={t('acc.st5.t')} desc={t('acc.st5.d')} />
              <MethodStep num="06" title={t('acc.st6.t')} desc={t('acc.st6.d')} />
            </div>
          </div>
        </section>

        {/* ===== Âge peau / âge biologique ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s5.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s5.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s5.h2b')}</em>
              </h2>
              <p className="text-sm text-text/65 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s5.p')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="v6 px-8 py-10 flex flex-col gap-4 h-full">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
                  {t('acc.age.l.tag')}
                </div>
                <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">
                  {t('acc.age.l.h3')}
                </h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  {t('acc.age.l.p')} <span className="text-text">{t('acc.age.l.pEm')}</span> :
                </p>
                <ul className="text-xs text-text/55 leading-relaxed font-extralight font-mono pl-4 space-y-1 vy-ltr-list">
                  <li>{t('acc.age.l.li1')}</li>
                  <li>{t('acc.age.l.li2')}</li>
                  <li>{t('acc.age.l.li3')}</li>
                  <li>{t('acc.age.l.li4')}</li>
                </ul>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  {t('acc.age.l.note')}
                </p>
              </div>

              <div className="v6-soft px-8 py-10 flex flex-col gap-4 h-full">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/55">
                  {t('acc.age.r.tag')}
                </div>
                <h3 className="font-sans text-2xl md:text-3xl font-thin leading-[1.15] -tracking-[0.02em]">
                  {t('acc.age.r.h3')}
                </h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  {t('acc.age.r.p')}
                </p>
                <p className="text-xs text-text/45 leading-relaxed font-extralight">
                  {t('acc.age.r.note1')}{' '}
                  <code className="font-mono text-[10px]">bioAge = 40 + (50 − wrinkles) × 0.85 × 0.85 × phototypeAdjust</code>. {t('acc.age.r.note2')}
                </p>
              </div>
            </div>

            <div className="v6-soft px-8 py-6 mt-4 text-center">
              <p className="text-sm text-text/65 font-extralight leading-relaxed">
                {t('acc.age.prec1')} <span className="text-text">{t('acc.age.prec.bio')}</span>, <span className="text-text">{t('acc.age.prec.perc')}</span> {t('acc.age.prec2')}
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-2">
                {t('acc.age.prec3')}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Comportement selon la qualité ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s6.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s6.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s6.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s6.p')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-red-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/80 vy-ltr">{t('acc.q1.tag')}</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">{t('acc.q1.h3')}</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  {t('acc.q1.p1')} <code className="font-mono text-xs text-accent">scan_quality_too_low</code> {t('acc.q1.p2')}
                </p>
              </div>

              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-amber-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-amber-400/80 vy-ltr">{t('acc.q2.tag')}</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">{t('acc.q2.h3')}</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  {t('acc.q2.p1')} <code className="font-mono text-xs text-accent">confidence: &apos;low&apos;</code>{t('acc.q2.p2')}
                </p>
              </div>

              <div className="v6-soft px-7 py-8 flex flex-col gap-3 h-full border-l-2 border-emerald-400/50">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-emerald-400/80 vy-ltr">{t('acc.q3.tag')}</div>
                <h3 className="font-sans text-xl font-thin leading-[1.2]">{t('acc.q3.h3')}</h3>
                <p className="text-sm text-text/65 leading-relaxed font-extralight">
                  {t('acc.q3.p1')} <code className="font-mono text-xs text-accent">confidence: &apos;standard&apos;</code>{t('acc.q3.p2')}
                </p>
              </div>
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              {t('acc.s6.foot1')}<br />
              {t('acc.s6.foot2')}
            </p>
          </div>
        </section>

        {/* ===== Variance ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s7.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s7.h2')}
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2">
                {t('acc.s7.p')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <VarianceCard biomarker={t('acc.var1')} sigma="±6" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var2')} sigma="±7" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var3')} sigma="±4" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var4')} sigma="±8" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var5')} sigma="±9" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var6')} sigma="±7" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var7')} sigma="±3" unit={t('acc.var.unitPts')} />
              <VarianceCard biomarker={t('acc.var8')} sigma="±4" unit={t('acc.var.unitYears')} />
            </div>

            <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase text-center mt-12 max-w-3xl mx-auto leading-relaxed">
              {t('acc.s7.foot1')}<br />
              {t('acc.s7.foot2')}<br />
              <span className="text-text">{t('acc.s7.foot3')}</span>
            </p>
          </div>
        </section>

        {/* ===== Feuille de route ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s8.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s8.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s8.h2b')}</em>
              </h2>
            </div>

            <div className="space-y-4">
              <RoadmapItem quarter={t('acc.q.late2026')} title={t('acc.rd1.t')} body={t('acc.rd1.b')} />
              <RoadmapItem quarter={t('acc.q.late2026')} title={t('acc.rd2.t')} body={t('acc.rd2.b')} />
              <RoadmapItem quarter={t('acc.q.q42026')} title={t('acc.rd3.t')} body={t('acc.rd3.b')} />
              <RoadmapItem quarter={t('acc.q.q42026')} title={t('acc.rd4.t')} body={t('acc.rd4.b')} />
            </div>
          </div>
        </section>

        {/* ===== Limites ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s9.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s9.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s9.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2">
                {t('acc.s9.p')}
              </p>
            </div>

            <div className="space-y-4">
              <Limitation title={t('acc.lim1.t')} body={t('acc.lim1.b')} />
              <Limitation title={t('acc.lim2.t')} body={t('acc.lim2.b')} />
              <Limitation title={t('acc.lim3.t')} body={t('acc.lim3.b')} />
              <Limitation title={t('acc.lim4.t')} body={t('acc.lim4.b')} />
              <Limitation title={t('acc.lim5.t')} body={t('acc.lim5.b')} />
              <Limitation title={t('acc.lim6.t')} body={t('acc.lim6.b')} />
              <Limitation title={t('acc.lim7.t')} body={t('acc.lim7.b')} />
            </div>
          </div>
        </section>

        {/* ===== Module conditions cutanées ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s10.eyebrow')}
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
                {t('acc.s10.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s10.h2b')}</em>
              </h2>
              <p className="text-sm text-text/55 max-w-2xl font-extralight mt-2 leading-relaxed">
                {t('acc.s10.p1')} <code className="font-mono text-xs text-accent">vyvre-conditions-engine.js</code> {t('acc.s10.p2')} <strong className="text-text">{t('acc.s10.p3')}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <Source
                authors={`${t('acc.cond1.a')} (Tan 2018)`}
                year="v1"
                title={t('acc.cond1.t')}
                journal={`${t('acc.cond.sens')} ~70 % · ${t('acc.cond.spec')} ~75 % (${t('acc.cond.cohort')})`}
                contribution={t('acc.cond1.c')}
              />
              <Source
                authors={`${t('acc.cond2.a')} (Sandoval-Pillajo 2020)`}
                year="v1"
                title={t('acc.cond2.t')}
                journal={`${t('acc.cond.sens')} ~65 % · ${t('acc.cond.spec')} ~70 % (${t('acc.cond.cohort')})`}
                contribution={t('acc.cond2.c')}
              />
              <Source
                authors={t('acc.cond3.a')}
                year="v1"
                title={t('acc.cond3.t')}
                journal={`${t('acc.cond.sens')} ~55 % · ${t('acc.cond.spec')} ~70 % (${t('acc.cond.cohort')})`}
                contribution={t('acc.cond3.c')}
              />
              <Source
                authors={`${t('acc.cond4.a')} (Pandey 2019)`}
                year="v1"
                title={t('acc.cond4.t')}
                journal={`${t('acc.cond.sens')} ~60 % · ${t('acc.cond.spec')} ~75 % (${t('acc.cond.cohort')})`}
                contribution={t('acc.cond4.c')}
              />
            </div>

            <div className="v6-soft px-8 py-7">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">
                {t('acc.s10.why.t')}
              </div>
              <ul className="text-sm text-text/65 leading-relaxed font-extralight space-y-2">
                <li>→ {t('acc.s10.why1')}</li>
                <li>→ {t('acc.s10.why2')}</li>
                <li>→ {t('acc.s10.why3')}</li>
                <li>→ {t('acc.s10.why4a')} <code className="font-mono text-xs text-accent">detectConditions()</code> {t('acc.s10.why4b')}</li>
              </ul>
            </div>

            <div className="mt-8 v6-soft px-8 py-7 border-l-4 border-accent">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
                {t('acc.s10.disc.t')}
              </div>
              <p className="text-sm text-text/75 leading-relaxed font-extralight italic">
                {t('acc.s10.disc.b')}
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-4 vy-ltr">
                Indicative detection. NOT a medical diagnosis. Consult a dermatologist for clinical assessment.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a href="https://vyvre-demos.web.app/CONDITIONS_DEMO.html" target="_blank" rel="noopener" className="btn-primary">
                {t('acc.s10.cta1')}
              </a>
              <a href="https://vyvre-demos.web.app/vyvre-conditions-engine.js" target="_blank" rel="noopener" className="btn-secondary">
                {t('acc.s10.cta2')}
              </a>
            </div>
          </div>
        </section>

        {/* ===== Engagement honnêteté ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-12 md:px-16 py-16 md:py-20 text-center flex flex-col items-center gap-6">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">
                {t('acc.s11.eyebrow')}
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-thin leading-[1.1] -tracking-[0.022em] max-w-3xl">
                {t('acc.s11.h2a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('acc.s11.h2b')}</em>
              </h2>
              <p className="text-base text-text/65 max-w-2xl leading-relaxed font-extralight">
                {t('acc.s11.p1')}
              </p>
              <p className="text-sm text-text/55 max-w-2xl leading-relaxed font-extralight italic">
                {t('acc.s11.p2')}
              </p>
              <p className="text-xs text-text/45 font-mono tracking-[0.1em] uppercase mt-4 vy-ltr">
                VYVRE estimation is indicative. For clinical diagnosis, consult a dermatologist.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Appel ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              {t('acc.cta.h2a')}<br />
              <em className="not-italic text-text/55 font-extralight">{t('acc.cta.h2b')}</em>
            </h2>
            <p className="text-base text-text/65 max-w-xl leading-relaxed font-extralight">
              {t('acc.cta.p')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a href="mailto:charles@symphonydrive.com?subject=VYVRE - Documentation" className="btn-primary">
                {t('acc.cta.1')}
              </a>
              <Link href="/" className="btn-secondary">
                {t('acc.cta.2')}
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
                <span className="font-mono tracking-[0.18em] uppercase">{t('footer.cityFull')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase">
                <a href="mailto:charles@symphonydrive.com" className="hover:text-text transition-colors">charles@symphonydrive.com</a>
                <a href="https://calendly.com/charles-symphonydrive" target="_blank" rel="noopener" className="hover:text-text transition-colors">{t('footer.book')}</a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px] border-t border-line pt-8">
              <Link href="/cgv" className="hover:text-text transition-colors">{t('footer.cgv')}</Link>
              <Link href="/mentions-legales" className="hover:text-text transition-colors">{t('footer.legal')}</Link>
              <Link href="/confidentialite" className="hover:text-text transition-colors">{t('footer.privacyGdpr')}</Link>
              <Link href="/dpa" className="hover:text-text transition-colors">{t('footer.dpa')}</Link>
              <Link href="/accuracy" className="hover:text-text transition-colors">{t('footer.method')}</Link>
              <span className="ml-auto">© {new Date().getFullYear()} VYVRE — {t('footer.rights')}</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Composants
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

function BenchCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="v6-soft px-5 py-5 flex flex-col gap-1 text-center">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">{label}</div>
      <div className="text-2xl font-thin text-text vy-ltr">{value}</div>
      <div className="text-[10px] text-text/55 font-mono">{note}</div>
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
      <div className="font-sans text-3xl md:text-4xl font-thin leading-none -tracking-[0.02em] text-accent vy-ltr">
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
  t,
  authors,
  year,
  title,
  journal,
  applied,
  roadmap,
}: {
  t: T;
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
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-text/45">{t('acc.rm.appliedLabel')}</span>{applied}
      </p>
      <p className="text-xs text-amber-400/70 leading-relaxed font-extralight mt-1">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase">{t('acc.rm.roadmapLabel')}</span>{roadmap}
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
