import Link from 'next/link';
import LangMenu from './LangMenu';
import { getPage } from '../lib/i18n/server';

/** Header unique du site — identique sur toutes les pages, dans les douze langues. */
export default function SiteHeader({ demoUrl = '/scan' }: { demoUrl?: string }) {
  const { t, lang } = getPage();
  return (
    <>
      <header className="v-bar">
        <Link href="/" className="brand-mark">
          <canvas className="v-mini" width="72" height="72" aria-label="VYVRE" />
          <span className="flex flex-col leading-none">
            <span data-vyvre-logo className="text-sm font-light tracking-[0.22em]">VYVRE</span>
            <span data-vyvre-signature className="mt-1 font-['Playfair_Display',Georgia,serif] italic text-[11px] tracking-[0.01em] text-text/60">skin intelligence</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase text-text/55 font-mono me-20">
          <Link href="/manifeste" className="hover:text-text transition-colors">{t('nav.manifeste')}</Link>
          <Link href="/accuracy" className="hover:text-text transition-colors">{t('nav.method')}</Link>
          <a href={demoUrl} className="hover:text-text transition-colors">{t('nav.demo')}</a>
          <Link href="/pricing" className="hover:text-text transition-colors">{t('nav.pricing')}</Link>
        </nav>
      </header>
      <LangMenu lang={lang} label={t('lang.aria')} />
    </>
  );
}
