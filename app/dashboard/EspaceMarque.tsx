/**
 * VYVRE — gabarit des pages /dashboard et /dashboard/billing (11/10/2026).
 * L'e-mail de bienvenue (lib/email.ts) et /success y envoient les clients payants :
 * tant que le tableau de bord n'existe pas, ces pages disent la vérité et donnent un contact.
 */
import Link from 'next/link';
import Script from 'next/script';
import SiteHeader from '../SiteHeader';

export const CONTACT = 'charles@vyvre.fr';

export default function EspaceMarque({
  eyebrow, h1a, h1b, p, cta, ctaHref, ask, other, otherHref, home,
}: {
  eyebrow: string; h1a: string; h1b: string; p: string; cta: string; ctaHref: string;
  ask: string; other: string; otherHref: string; home: string;
}) {
  return (
    <main className="min-h-screen flex flex-col">
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <SiteHeader />
      <section className="flex-1 flex items-center px-4 md:px-10 py-20 md:py-28">
        <div className="w-full max-w-3xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#d9c9a3]">{eyebrow}</span>
          <h1 className="mt-5 font-sans font-thin text-[clamp(38px,6.4vw,72px)] leading-[1.02] -tracking-[0.035em]">
            {h1a}
            <span className="block font-['Playfair_Display',Georgia,serif] italic font-medium text-[0.86em] -tracking-[0.01em] text-champagne mt-1">{h1b}</span>
          </h1>
          <p className="mt-7 max-w-xl text-text/70 text-base md:text-lg font-light leading-relaxed">{p}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center min-h-[50px] px-7 rounded-full text-sm font-normal text-[#15120a] bg-[linear-gradient(180deg,#efe3c6,#cbb88c)] shadow-[inset_0_1px_0_rgba(255,255,255,.7)]"
            >
              {cta}
            </a>
            <Link href={otherHref} className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-text/55 hover:text-text border-b border-text/15 pb-[3px] transition-colors">
              {other}
            </Link>
          </div>
          <p className="mt-14 pt-6 border-t border-line text-sm text-text/55 font-light">
            {ask}{' '}
            <a href={`mailto:${CONTACT}`} className="text-text hover:text-champagne underline underline-offset-4 decoration-text/30">{CONTACT}</a>
          </p>
          <p className="mt-4">
            <Link href="/" className="font-mono text-[10px] tracking-[0.3em] uppercase text-text/40 hover:text-text transition-colors">{home}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
