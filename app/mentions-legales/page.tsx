/**
 * VYVRE — /mentions-legales
 * Page mentions légales obligatoire (loi LCEN 2004).
 */

import type { Metadata } from 'next';
import SiteHeader from '../SiteHeader';
import Script from 'next/script';
import { LegalFooter, LegalNotice, LegalUpdated } from '../LegalChrome';
import { getPage } from '../../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('ml.meta.title'), description: t('ml.meta.desc') };
}

export default function MentionsLegalesPage() {
  const { t } = getPage();
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <main className="min-h-screen flex flex-col">
        <SiteHeader />

        <section className="px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              {t('ml.eyebrow')}
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              {t('ml.h1')}
            </h1>

            <LegalNotice />

            <Block title={t('ml.b1')}>
              <p><strong className="font-medium">LE KIT PARISIEN</strong></p>
              <p>Société par actions simplifiée (SAS) au capital de 1 000 €</p>
              <p>Siège social : 15 rue des Écoles, 75005 Paris, France</p>
              <p>SIREN et RCS : 939 752 374 R.C.S. Paris</p>
              <p>SIRET du siège : 939 752 374 00016</p>
              <p>TVA intracommunautaire : FR 52 939 752 374</p>
              <p>Contact : <a href="mailto:charles@vyvre.fr" className="text-accent hover:opacity-80">charles@vyvre.fr</a></p>
              <p className="mt-3">VYVRE est une marque déposée de LE KIT PARISIEN SAS.</p>
            </Block>

            <Block title={t('ml.b2')}>
              <p>Charles Rocher</p>
            </Block>

            <Block title={t('ml.b3')}>
              <p><strong className="font-medium">Vercel Inc.</strong></p>
              <p>440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
              <p><a href="https://vercel.com" target="_blank" rel="noopener" className="text-accent hover:opacity-80">vercel.com</a></p>
            </Block>

            <Block title={t('ml.b4')}>
              <p>L'ensemble des éléments figurant sur le site vyvre.fr — textes, images, vidéos, codes sources, marques, logos, modèles et plus généralement tous les contenus — sont la propriété exclusive de LE KIT PARISIEN SAS ou de ses partenaires.</p>
              <p className="mt-3">Toute reproduction, représentation, modification, publication, transmission ou exploitation, totale ou partielle, du contenu de ce site, par quelque procédé que ce soit, sans autorisation expresse préalable de LE KIT PARISIEN SAS, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
              <p className="mt-3">Les marques tierces citées (Dior, Sisley, Chanel, etc.) sont la propriété de leurs détenteurs respectifs.</p>
            </Block>

            <Block title={t('ml.b5')}>
              <p>LE KIT PARISIEN SAS met tout en œuvre pour offrir aux utilisateurs des informations et outils disponibles et vérifiés. Toutefois, elle ne saurait être tenue responsable des erreurs, d'une absence de disponibilité des fonctionnalités, ou de la présence éventuelle de virus sur son site.</p>
              <p className="mt-3"><strong className="font-medium">L'analyse de peau proposée par VYVRE n'est pas un dispositif médical.</strong> Elle ne se substitue pas à un examen dermatologique professionnel. Toute préoccupation médicale doit être adressée à un médecin ou dermatologue qualifié.</p>
            </Block>

            <Block title={t('ml.b6')}>
              <p>Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau internet ne sauraient engager la responsabilité de LE KIT PARISIEN SAS.</p>
            </Block>

            <Block title={t('ml.b7')}>
              <p>Le présent site et ses conditions d'utilisation sont régis par le droit français. Tout litige relatif à l'utilisation du site relève de la compétence des tribunaux français.</p>
            </Block>

            <LegalUpdated />
          </div>
        </section>

        <LegalFooter current="mentions-legales" />
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

