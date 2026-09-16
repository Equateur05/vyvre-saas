import Link from 'next/link';

/** Header unique du site — identique sur toutes les pages. */
export default function SiteHeader({ demoUrl = '/scan' }: { demoUrl?: string }) {
  return (
    <header className="v-bar">
      <Link href="/" className="brand-mark">
        <canvas className="v-mini" width="72" height="72" aria-label="VYVRE" />
        <span className="text-sm font-light tracking-[0.22em]">VYVRE</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase text-text/55 font-mono">
        <Link href="/manifeste" className="hover:text-text transition-colors">Manifeste</Link>
        <Link href="/accuracy" className="hover:text-text transition-colors">Méthode</Link>
        <a href={demoUrl} className="hover:text-text transition-colors">Tester le scan</a>
        <Link href="/pricing" className="hover:text-text transition-colors">Tarifs</Link>
      </nav>
    </header>
  );
}
