/**
 * VYVRE — /pro (11/10/2026)
 *
 * La page des marques, instituts et pharmacies, amenée par le lien « Pro » du menu.
 * Direction « A Atelier » des maquettes (public/propals/pro/), avec le téléphone animé
 * de la direction « C Vitrine » au centre. Douze langues (lib/i18n/dict, clés pro.*).
 *
 * Règles : on vend des résultats, pas des moteurs (aucun mot technique) ; on ne vend que ce
 * qui existe ; les données agrégées sont dites « en préparation ». Les liens de paiement de
 * /pricing ne sont pas touchés : la page y renvoie seulement par « Voir tous les tarifs ».
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import SiteHeader from '../SiteHeader';
import ProOrb from './ProOrb';
import ProCount from './ProCount';
import ProVitrine, { type VitrineStrings } from './ProVitrine';
import { getPage } from '../../lib/i18n/server';
import type { Key, T } from '../../lib/i18n';
import './pro.css';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return {
    title: t('pro.meta.title'),
    description: t('pro.meta.desc'),
    openGraph: { title: t('pro.meta.title'), description: t('pro.meta.desc'), url: '/pro', siteName: 'VYVRE', type: 'website' },
  };
}

const CONTACT = 'charles@vyvre.fr';

function demoHref(t: T): string {
  return `mailto:${CONTACT}?subject=${encodeURIComponent(t('pro.mail.subject'))}`;
}

function vitrine(t: T): VitrineStrings {
  const k = (s: string) => t(s as Key);
  return {
    steps: [1, 2, 3, 4].map((i) => ({ t: k(`pro.v.s${i}.t`), d: k(`pro.v.s${i}.d`) })),
    house: t('pro.ph.house'),
    w1: t('pro.ph.w1'),
    w2: t('pro.ph.w2'),
    start: t('pro.ph.start'),
    nophoto: t('pro.ph.nophoto'),
    reading: t('pro.ph.reading'),
    light: t('pro.ph.light'),
    today2: t('pro.ph.today2'),
    routine1: t('pro.ph.routine1'),
    routine2: t('pro.ph.routine2'),
    add: t('pro.ph.add'),
    measures: [2, 3, 8, 5, 6, 7, 4, 1].map((i) => k(`home.mes.${i}.n`)),
    gestures: [1, 2, 3, 4].map((i) => k(`pro.ph.g${i}`)),
    products: [1, 2, 3, 4].map((i) => k(`pro.ph.p${i}`)),
    side: [1, 2, 3].map((i) => ({ tag: k(`pro.side${i}.tag`), t: k(`pro.side${i}.t`), p: k(`pro.side${i}.p`) })),
  };
}

export default function ProPage() {
  const { t } = getPage();
  const k = (s: string) => t(s as Key);
  const mail = demoHref(t);

  return (
    <main className="min-h-screen">
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <SiteHeader active="pro" />

      <div className="vp">
        {/* ===== Ouverture ===== */}
        <section className="vp-hero vp-wrap">
          <ProOrb />
          <span className="vp-k o">{t('pro.eyebrow')}</span>
          <h1>
            {t('pro.h1a')}
            <span className="vp-serif">{t('pro.h1b')}</span>
          </h1>
          <p className="vp-lead">{t('pro.lead')}</p>
          <div className="vp-ctas">
            <a className="vp-btn" href={mail}>{t('pro.cta.demo')}</a>
            <a className="vp-btn ghost" href="/">{t('pro.cta.try')}</a>
          </div>
          <div className="vp-facts">
            <div><ProCount to={8} /><span>{t('pro.fact1')}</span></div>
            <div><b className="vy-ltr">10 s</b><span>{t('pro.fact2')}</span></div>
            <div><b>0</b><span>{t('pro.fact3')}</span></div>
            <div><ProCount to={12} /><span>{t('pro.fact4')}</span></div>
          </div>
        </section>

        {/* ===== Ce que vit la cliente ===== */}
        <section className="vp-sec vp-wrap">
          <div className="vp-center">
            <span className="vp-k o">{t('pro.v.eyebrow')}</span>
            <h2 className="vp-h2">
              {t('pro.v.h2a')}<br />
              <span className="vp-serif">{t('pro.v.h2b')}</span>
            </h2>
            <p className="vp-sub">{t('pro.v.p')}</p>
          </div>
          <ProVitrine s={vitrine(t)} />
        </section>

        {/* ===== Trois scènes ===== */}
        <section className="vp-sec vp-wrap">
          <span className="vp-k">{t('pro.sc.eyebrow')}</span>
          <h2 className="vp-h2">{t('pro.sc.h2a')}<br /><em>{t('pro.sc.h2b')}</em></h2>
          <div className="vp-trio">
            <div className="vp-sc">
              <span className="vp-tag">{t('pro.sc1.tag')}</span>
              <h3>{t('pro.sc1.t')}</h3>
              <p>{t('pro.sc1.p')}</p>
              <span className="mono">vyvre.fr/m/{t('pro.sc1.slug')}</span>
            </div>
            <div className="vp-sc">
              <span className="vp-tag">{t('pro.sc2.tag')}</span>
              <h3>{t('pro.sc2.t')}</h3>
              <p>{t('pro.sc2.p')}</p>
              <span className="mono">&lt;script src=&quot;vyvre.fr/widget.js&quot;&gt;</span>
            </div>
            <div className="vp-sc">
              <span className="vp-tag">{t('pro.sc3.tag')}</span>
              <h3>{t('pro.sc3.t')}</h3>
              <p>{t('pro.sc3.p')}</p>
              <span className="mono">{t('pro.sc3.mono')}</span>
            </div>
          </div>
        </section>

        {/* ===== Compris dès le premier jour ===== */}
        <section className="vp-sec vp-wrap">
          <span className="vp-k">{t('pro.inc.eyebrow')}</span>
          <h2 className="vp-h2">{t('pro.inc.h2a')}<br /><em>{t('pro.inc.h2b')}</em></h2>
          <div className="vp-inc">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <span className="n">{String(i).padStart(2, '0')}</span>
                <b>{k(`pro.inc${i}.t`)}</b>
                <span className="d">{k(`pro.inc${i}.d`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== En préparation : le relevé mensuel ===== */}
        <section className="vp-sec vp-wrap">
          <span className="vp-k o">{t('pro.data.eyebrow')}</span>
          <h2 className="vp-h2">{t('pro.data.h2a')}<br /><em>{t('pro.data.h2b')}</em></h2>
          <p className="vp-sub">{t('pro.data.p')}</p>
          <div className="vp-rep">
            <div className="vp-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <b style={{ fontWeight: 300, fontSize: 17 }}>{t('pro.data.panel')}</b>
                <span className="vp-tag">{t('pro.data.illu')}</span>
              </div>
              <div style={{ marginTop: 14 }} aria-hidden="true">
                {[[2, 100], [8, 78], [3, 56], [6, 40], [4, 30], [7, 22]].map(([m, w]) => (
                  <div className="vp-hb" key={m}>
                    <span>{k(`home.mes.${m}.n`)}</span>
                    <div className="t"><i style={{ width: `${w}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="vp-panel vp-soon">
              <div>
                <span className="vp-tag o">{t('pro.data.tag')}</span>
                <p className="big">{t('pro.data.big1')}<span>{t('pro.data.big2')}</span></p>
              </div>
              <p className="note">{t('pro.data.note')}</p>
            </div>
          </div>
        </section>

        {/* ===== L'offre ===== */}
        <section className="vp-wrap">
          <div className="vp-offer">
            <div>
              <span className="vp-k o">{t('pro.offer.eyebrow')}</span>
              <p className="pr">{t('pro.offer.t')}</p>
              <p>{t('pro.offer.p')}</p>
            </div>
            <div className="act">
              <a className="vp-btn" href={mail}>{t('pro.cta.demo')}</a>
              <Link className="vp-all" href="/pricing">{t('pro.all')}</Link>
            </div>
          </div>
        </section>

        <footer className="vp-foot vp-wrap">
          <nav>
            <Link href="/cgv">{t('footer.cgv')}</Link>
            <Link href="/mentions-legales">{t('footer.legal')}</Link>
            <Link href="/confidentialite">{t('footer.privacy')}</Link>
            <Link href="/dpa">{t('footer.dpa')}</Link>
            <a href={`mailto:${CONTACT}`}>{t('footer.contact')}</a>
            <Link prefetch={false} href="/">{t('footer.home')}</Link>
          </nav>
          <div className="c">VYVRE © {new Date().getFullYear()} · {t('footer.company')}</div>
        </footer>
      </div>
    </main>
  );
}
