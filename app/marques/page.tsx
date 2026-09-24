/**
 * VYVRE — vyvre.fr
 * Page marques : hero animé (scan 68 repères), 8 mesures, les trois étapes,
 * le socle groupe (multi-marques / souveraineté), tarifs, questions.
 * Douze langues, choisies côté serveur (voir lib/i18n).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import HeroScan from '../HeroScan';
import SiteHeader from '../SiteHeader';
import { getPage } from '../../lib/i18n/server';
import type { T } from '../../lib/i18n';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('home.meta.title'), description: t('home.meta.desc') };
}

export default function HomePage() {
  const { t } = getPage();

  const mesures = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    nom: t(`home.mes.${i}.n` as 'home.mes.1.n'),
    unite: t(`home.mes.${i}.u` as 'home.mes.1.u'),
  }));

  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />

      <main className="min-h-screen flex flex-col">
        <SiteHeader />

        {/* ===== Hero ===== */}
        <section className="relative min-h-[88vh] flex items-center overflow-hidden border-b border-line">
          <div className="vy-hero-visual absolute inset-0 md:left-[42%] z-0"><HeroScan /></div>
          <div className="vy-hero-veil absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.72)_45%,rgba(0,0,0,.25)_75%,rgba(0,0,0,.6)_100%)]" aria-hidden="true" />
          <div className="relative z-20 w-full max-w-6xl mx-auto px-8 py-24 flex flex-col items-start">
            <div className="max-w-xl flex flex-col gap-7">
              <span className="font-mono text-[10px] tracking-[0.42em] uppercase text-accent">{t('home.hero.eyebrow')}</span>
              <h1 className="font-sans text-5xl md:text-7xl font-thin leading-[1.02] -tracking-[0.03em]">
                {t('home.hero.h1a')}<br />
                <em className="not-italic text-text/55 font-extralight">{t('home.hero.h1b')}</em>
              </h1>
              <p className="text-base md:text-lg text-text/70 leading-relaxed font-extralight">
                {t('home.hero.p')}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a href="/scan" className="btn-primary">{t('home.hero.cta1')}</a>
                <Link href="/pricing?from=homepage" className="btn-secondary">{t('home.hero.cta2')}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Chiffres ===== */}
        <section className="px-8 py-16 border-t border-line">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat value="8" label={t('home.stat1')} />
            <Stat value="<10s" label={t('home.stat2')} />
            <Stat value="48h" label={t('home.stat3')} />
            <Stat value="0" label={t('home.stat4')} />
          </div>
        </section>

        {/* ===== Manifeste court ===== */}
        <section id="methode" className="px-8 py-32 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
            <h2 className="font-sans text-5xl md:text-7xl font-thin italic leading-[1.02] -tracking-[0.03em]">
              {t('home.man.h2a')}<br /><span className="not-italic font-extralight text-text/55">{t('home.man.h2b')}</span>
            </h2>
            <p className="text-lg md:text-xl font-extralight text-text/70 leading-[1.6] max-w-2xl">
              {t('home.man.p')}
            </p>
            <Link href="/accuracy" className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent hover:text-text transition-colors">
              {t('home.man.link')}
            </Link>
          </div>
        </section>

        {/* ===== Les 8 mesures ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em] text-center mb-14">
              {t('home.mes.h2a')}<br /><em className="not-italic text-text/55 font-extralight">{t('home.mes.h2b')}</em>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mesures.map(({ nom, unite }) => (
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
              {t('home.steps.h2a')}<br /><em className="not-italic text-text/55 font-extralight">{t('home.steps.h2b')}</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Step num="01" title={t('home.step1.t')} desc={t('home.step1.d')} />
              <Step num="02" title={t('home.step2.t')} desc={t('home.step2.d')} />
              <Step num="03" title={t('home.step3.t')} desc={t('home.step3.d')} />
            </div>
          </div>
        </section>

        {/* ===== Socle groupe ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-5xl mx-auto">
            <div className="v6 px-10 md:px-16 py-16 flex flex-col items-center gap-10 text-center">
              <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent">{t('home.groupe.eyebrow')}</span>
              <h2 className="font-sans text-3xl md:text-5xl font-thin leading-[1.08] -tracking-[0.025em] max-w-3xl">
                {t('home.groupe.h2a')}<br /><em className="not-italic text-text/55 font-extralight">{t('home.groupe.h2b')}</em>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full mt-2">
                <Socle titre={t('home.socle1.t')} texte={t('home.socle1.d')} />
                <Socle titre={t('home.socle2.t')} texte={t('home.socle2.d')} />
                <Socle titre={t('home.socle3.t')} texte={t('home.socle3.d')} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Tarifs ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              {t('home.price.h2a')}<br /><em className="not-italic text-text/55 font-extralight">{t('home.price.h2b')}</em>
            </h2>
            <Link href="/pricing?from=homepage" className="btn-primary mt-2">{t('home.price.cta')}</Link>
          </div>
        </section>

        {/* ===== Questions ===== */}
        <section id="faq" className="px-8 py-24 border-t border-line">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em] text-center mb-12">{t('home.faq.h2')}</h2>
            <div className="space-y-4">
              <FaqItem q={t('home.faq1.q')} a={t('home.faq1.a')} />
              <FaqItem q={t('home.faq2.q')} a={t('home.faq2.a')} />
              <FaqItem q={t('home.faq3.q')} a={t('home.faq3.a')} />
              <FaqItem q={t('home.faq4.q')} a={t('home.faq4.a')} />
            </div>
          </div>
        </section>

        {/* ===== Appel ===== */}
        <section className="px-8 py-24 border-t border-line">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-sans text-4xl md:text-5xl font-thin leading-[1.05] -tracking-[0.022em]">
              {t('home.cta.h2')}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <a href="/scan" className="btn-primary">{t('home.cta.1')}</a>
              <a href="mailto:charles@symphonydrive.com?subject=VYVRE%20-%20D%C3%A9mo" className="btn-secondary">{t('home.cta.2')}</a>
            </div>
          </div>
        </section>

        <HomeFooter t={t} />
      </main>
    </>
  );
}

function HomeFooter({ t }: { t: T }) {
  return (
    <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <canvas className="v-mini" width="48" height="48" aria-label="VYVRE" style={{ width: 24, height: 24 }} />
            <span className="font-mono tracking-[0.18em] uppercase">{t('footer.city')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase">
            <a href="mailto:charles@symphonydrive.com" className="hover:text-text transition-colors">charles@symphonydrive.com</a>
            <a href="https://calendly.com/charles-symphonydrive" target="_blank" rel="noopener" className="hover:text-text transition-colors">{t('footer.book')}</a>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px] border-t border-line pt-8">
          <Link href="/manifeste" className="hover:text-text transition-colors">{t('footer.manifeste')}</Link>
          <Link href="/accuracy" className="hover:text-text transition-colors">{t('footer.method')}</Link>
          <Link href="/cgv" className="hover:text-text transition-colors">{t('footer.cgv')}</Link>
          <Link href="/mentions-legales" className="hover:text-text transition-colors">{t('footer.legal')}</Link>
          <Link href="/confidentialite" className="hover:text-text transition-colors">{t('footer.privacy')}</Link>
          <Link href="/dpa" className="hover:text-text transition-colors">{t('footer.dpa')}</Link>
          <span className="ml-auto">© {new Date().getFullYear()} VYVRE</span>
        </div>
      </div>
    </footer>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="v6 px-6 py-10 text-center flex flex-col items-center gap-2">
      <div className="font-sans text-5xl md:text-6xl font-thin leading-none -tracking-[0.025em] vy-ltr">{value}</div>
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
