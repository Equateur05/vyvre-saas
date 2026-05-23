/**
 * VYVRE — Landing page (vyvre.fr)
 *
 * Minimal MVP. La vraie landing (avec démos iframe, comparatif, FAQ)
 * sera buildée plus tard. Pour l'instant : juste un message + CTAs vers
 * les démos (vyvre-demos.web.app) et le pricing (qui pour l'instant
 * redirige vers les Payment Links Stripe).
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ===== Header ===== */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-line">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-text/30 rounded-full flex items-center justify-center text-[10px]">V</div>
          <span className="text-sm font-medium tracking-[0.18em]">VYVRE</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-text/60">
          <a href="https://vyvre-demos.web.app/SCAN_LIVE_DEMO_VYVRE.html" target="_blank" rel="noopener" className="hover:text-text">Démo</a>
          <Link href="/pricing" className="hover:text-text">Pricing</Link>
          <a href="mailto:charles@vyvre.fr" className="hover:text-text">Contact</a>
        </nav>
      </header>

      {/* ===== Hero ===== */}
      <section className="flex-1 flex items-center justify-center px-8 py-32">
        <div className="max-w-3xl text-center flex flex-col items-center gap-8">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            VYVRE Business · SDK Licensing
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-extralight leading-[1.05] -tracking-[0.025em]">
            Le diagnostic peau<br />
            <span className="text-accent font-light">de votre marque</span>.
          </h1>
          <p className="text-base md:text-lg text-text/65 leading-relaxed max-w-xl font-light">
            En 90 secondes. Hébergé en France. 100% on-device.<br />
            Le seul diagnostic peau avec un prix public.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <a
              href="https://vyvre-demos.web.app/SCAN_LIVE_DEMO_VYVRE.html"
              target="_blank"
              rel="noopener"
              className="btn-primary"
            >
              Voir la démo →
            </a>
            <Link href="/pricing?from=homepage" className="btn-secondary">
              Démarrer gratuitement
            </Link>
          </div>

          <div className="text-xs text-text/40 tracking-[0.15em] uppercase mt-12 font-mono">
            Infrastructure 100% France 🇫🇷 · RGPD natif · On-device · Zéro upload
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="px-8 py-12 border-t border-line text-xs text-text/45 flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono tracking-[0.15em] uppercase">
          VYVRE · Paris, France
        </div>
        <div className="flex items-center gap-6 font-mono tracking-[0.15em] uppercase">
          <a href="mailto:charles@vyvre.fr" className="hover:text-text">charles@vyvre.fr</a>
          <a href="https://calendly.com/charles-symphonydrive" target="_blank" rel="noopener" className="hover:text-text">Réserver 20 min →</a>
        </div>
      </footer>
    </main>
  );
}
