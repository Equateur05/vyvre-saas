/**
 * VYVRE — /mentions-legales
 * Page mentions légales obligatoire (loi LCEN 2004).
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Mentions légales · VYVRE',
  description: 'Mentions légales de VYVRE / Symphony Drive SAS.',
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <main className="min-h-screen flex flex-col">
        <header className="px-8 py-6 flex items-center justify-between border-b border-line">
          <Link href="/" className="brand-mark">
            <canvas className="v-mini" width="72" height="72" aria-label="VYVRE" />
            <span className="text-sm font-light tracking-[0.22em]">VYVRE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase text-text/55 font-mono">
            <Link href="/" className="hover:text-text">← Accueil</Link>
            <Link href="/pricing" className="hover:text-text">Pricing</Link>
            <Link href="/accuracy" className="hover:text-text">Méthodologie</Link>
          </nav>
        </header>

        <section className="px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              Informations légales
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              Mentions légales.
            </h1>

            <Block title="Éditeur du site">
              <p><strong className="font-medium">Symphony Drive SAS</strong></p>
              <p>Société par actions simplifiée au capital social de 1 000 €</p>
              <p>Siège social : Paris, France</p>
              <p>SIREN : en cours d'immatriculation</p>
              <p>Numéro de TVA intracommunautaire : en cours</p>
              <p>Représentant légal : Charles Rocher, Président</p>
              <p>Contact : <a href="mailto:charles@symphonydrive.com" className="text-accent hover:opacity-80">charles@symphonydrive.com</a></p>
            </Block>

            <Block title="Directeur de la publication">
              <p>Charles Rocher, en qualité de Président de Symphony Drive SAS.</p>
            </Block>

            <Block title="Hébergement">
              <p><strong className="font-medium">Vercel Inc.</strong> (frontend)</p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p>Infrastructure européenne (région Paris, France) pour vyvre.fr</p>
              <p className="mt-3"><strong className="font-medium">Supabase Inc.</strong> (base de données)</p>
              <p>970 Toa Payoh North #07-04, Singapore 318992</p>
              <p>Région : EU-West-3 (Paris, France)</p>
              <p className="mt-3"><strong className="font-medium">Firebase Hosting / Google Cloud</strong> (démos)</p>
              <p>1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
            </Block>

            <Block title="Propriété intellectuelle">
              <p>L'ensemble des éléments figurant sur le site vyvre.fr — textes, images, vidéos, codes sources, marques, logos, modèles et plus généralement tous les contenus — sont la propriété exclusive de Symphony Drive SAS ou de ses partenaires.</p>
              <p className="mt-3">Toute reproduction, représentation, modification, publication, transmission ou exploitation, totale ou partielle, du contenu de ce site, par quelque procédé que ce soit, sans autorisation expresse préalable de Symphony Drive SAS, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
              <p className="mt-3">Les marques tierces citées (Dior, Sisley, Chanel, etc.) sont la propriété de leurs détenteurs respectifs.</p>
            </Block>

            <Block title="Limitation de responsabilité">
              <p>Symphony Drive SAS met tout en œuvre pour offrir aux utilisateurs des informations et outils disponibles et vérifiés. Toutefois, elle ne saurait être tenue responsable des erreurs, d'une absence de disponibilité des fonctionnalités, ou de la présence éventuelle de virus sur son site.</p>
              <p className="mt-3"><strong className="font-medium">Le diagnostic peau proposé par VYVRE n'est pas un dispositif médical.</strong> Il ne se substitue pas à un examen dermatologique professionnel. Toute préoccupation médicale doit être adressée à un médecin ou dermatologue qualifié.</p>
            </Block>

            <Block title="Liens hypertextes">
              <p>Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau internet ne sauraient engager la responsabilité de Symphony Drive SAS.</p>
            </Block>

            <Block title="Droit applicable">
              <p>Le présent site et ses conditions d'utilisation sont régis par le droit français. Tout litige relatif à l'utilisation du site relève de la compétence des tribunaux français.</p>
            </Block>

            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 mt-16 pt-8 border-t border-line">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </section>

        <LegalFooter />
      </main>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent mb-4">{title}</h2>
      <div className="text-base text-text/75 leading-relaxed font-extralight space-y-1">{children}</div>
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px]">
        <Link href="/accuracy" className="hover:text-text">Méthodologie</Link>
        <Link href="/cgv" className="hover:text-text">CGV</Link>
        <Link href="/mentions-legales" className="text-text">Mentions légales</Link>
        <Link href="/confidentialite" className="hover:text-text">Confidentialité · RGPD</Link>
        <Link href="/dpa" className="hover:text-text">DPA</Link>
        <a href="mailto:charles@symphonydrive.com" className="hover:text-text ml-auto">charles@symphonydrive.com</a>
      </div>
    </footer>
  );
}
