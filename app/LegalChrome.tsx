import Link from 'next/link';
import { getPage } from '../lib/i18n/server';

type Page = 'cgv' | 'mentions-legales' | 'confidentialite' | 'dpa';

/**
 * Bandeau des pages juridiques.
 *
 * Les titres et l'ossature sont traduits ; le corps des documents reste en
 * français, seule version faisant foi. Un contrat ne se traduit pas à la
 * volée : une traduction de courtoisie est fournie sur demande.
 */
export function LegalNotice() {
  const { t, lang } = getPage();
  if (lang === 'fr') return null;
  return (
    <div className="v6-soft px-6 py-5 mb-12 text-sm text-text/75 font-extralight leading-relaxed">
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
        {t('legal.notice.t')}
      </div>
      <p>{t('legal.notice.b')}</p>
    </div>
  );
}

/** « Dernière mise à jour », dans la langue et le calendrier du lecteur. */
export function LegalUpdated({ version = false }: { version?: boolean }) {
  const { t, htmlLang } = getPage();
  const date = new Date().toLocaleDateString(htmlLang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return (
    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 mt-16 pt-8 border-t border-line">
      {version ? `${t('legal.version')} ` : ''}
      {t('legal.updated')} {date}
    </p>
  );
}

export function LegalFooter({ current }: { current: Page }) {
  const { t } = getPage();
  const cls = (p: Page) => (p === current ? 'text-text' : 'hover:text-text');
  return (
    <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px]">
        <Link href="/accuracy" className="hover:text-text">{t('footer.method')}</Link>
        <Link href="/cgv" className={cls('cgv')}>{t('footer.cgv')}</Link>
        <Link href="/mentions-legales" className={cls('mentions-legales')}>{t('footer.legal')}</Link>
        <Link href="/confidentialite" className={cls('confidentialite')}>{t('footer.privacyGdpr')}</Link>
        <Link href="/dpa" className={cls('dpa')}>{t('footer.dpa')}</Link>
        <a href="mailto:charles@symphonydrive.com" className="hover:text-text ml-auto">charles@symphonydrive.com</a>
      </div>
    </footer>
  );
}
