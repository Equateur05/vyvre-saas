/**
 * VYVRE — /confidentialite
 * Politique de confidentialité conforme RGPD (Règlement UE 2016/679).
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'Politique de confidentialité · VYVRE',
  description: 'Politique de confidentialité et protection des données personnelles VYVRE. Conformité RGPD.',
};

export default function ConfidentialitePage() {
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
              Protection des données · RGPD
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              Confidentialité.
            </h1>

            <p className="text-lg text-text/75 font-extralight leading-relaxed mb-12">
              VYVRE prend la protection de vos données personnelles au sérieux. Cette politique explique quelles données nous collectons, comment nous les utilisons, où elles sont stockées, et quels sont vos droits.
            </p>

            <Block title="Responsable du traitement">
              <p><strong className="font-medium">Symphony Drive SAS</strong> (VYVRE)</p>
              <p>Siège social : Paris, France</p>
              <p>Contact DPO : <a href="mailto:charles@symphonydrive.com?subject=RGPD - Demande DPO" className="text-accent hover:opacity-80">charles@symphonydrive.com</a></p>
            </Block>

            <Block title="Données collectées par le scanner peau">
              <p><strong className="font-medium text-text">Les images de votre visage ne sont JAMAIS stockées.</strong> Elles sont traitées en mémoire vive (RAM) du serveur le temps de l'analyse (typiquement &lt;100ms), puis effacées immédiatement.</p>
              <p className="mt-3">Seules les <strong className="font-medium">données agrégées et anonymisées</strong> du scan sont conservées : 8 scores numériques (rides, fermeté, pigmentation, hydratation, éclat, pores, rougeur, sébum), phototype Fitzpatrick (1-6), et âge peau estimé. Aucune information permettant de vous identifier visuellement n'est conservée.</p>
              <p className="mt-3">Ces données agrégées sont utilisées exclusivement pour vous proposer une routine de soin personnalisée à partir du catalogue de la marque sur laquelle le scan a été effectué.</p>
            </Block>

            <Block title="Hébergement des données">
              <p>L'ensemble des données est hébergé exclusivement dans l'<strong className="font-medium text-text">Union européenne</strong> :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Frontend : Vercel, région Paris (CDN edge)</li>
                <li>Base de données : Supabase, région EU-West-3 (Paris, France)</li>
                <li>Catalogue produits : Supabase Paris</li>
                <li>Démos hébergées : Firebase Hosting (Google Cloud, CDN mondial mais traitement principal en France)</li>
              </ul>
              <p className="mt-3"><strong className="font-medium text-text">Aucune donnée n'est transférée vers les États-Unis ou la Chine sans votre consentement explicite.</strong></p>
            </Block>

            <Block title="Données collectées par le site web">
              <p>Lorsque vous visitez vyvre.fr ou nos démos hébergées sur vyvre-demos.web.app, nous collectons :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Adresse IP (anonymisée après 24h)</li>
                <li>User-agent du navigateur</li>
                <li>Pages visitées (analytics agrégées via Vercel Analytics, sans cookies)</li>
                <li>Référent (site d'origine)</li>
              </ul>
              <p className="mt-3"><strong className="font-medium text-text">Nous n'utilisons aucun cookie tiers, aucun pixel de tracking (Meta, Google Ads, TikTok, etc.).</strong> Aucune publicité ciblée n'est servie sur notre site.</p>
            </Block>

            <Block title="Données collectées lors d'un achat">
              <p>Si vous souscrivez à un plan VYVRE Business, nous collectons via notre prestataire de paiement Stripe :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nom et prénom du responsable de la souscription</li>
                <li>Email professionnel</li>
                <li>Raison sociale et SIREN de l'entreprise</li>
                <li>Coordonnées de facturation</li>
              </ul>
              <p className="mt-3">Les données bancaires (numéro de carte, CVV) ne transitent jamais par nos serveurs. Elles sont gérées exclusivement par Stripe, certifié PCI-DSS niveau 1.</p>
            </Block>

            <Block title="Base légale du traitement">
              <p>Les traitements sont fondés sur :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>L'<strong className="font-medium">exécution du contrat</strong> (article 6.1.b RGPD) pour le scan et la routine</li>
                <li>L'<strong className="font-medium">intérêt légitime</strong> (article 6.1.f RGPD) pour les analytics agrégées</li>
                <li>Le <strong className="font-medium">consentement explicite</strong> (article 6.1.a RGPD) pour toute autre utilisation</li>
              </ul>
            </Block>

            <Block title="Durée de conservation">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Images scan : <strong>0 seconde</strong> (traitement en mémoire vive, jamais persistées)</li>
                <li>Scores agrégés du scan : 30 jours (pour comparaison historique éventuelle)</li>
                <li>Données de facturation : 10 ans (obligation légale comptable)</li>
                <li>Logs serveur : 90 jours maximum</li>
                <li>Analytics agrégées : 24 mois</li>
              </ul>
            </Block>

            <Block title="Vos droits RGPD">
              <p>Conformément aux articles 15 à 22 du RGPD, vous disposez à tout moment des droits suivants :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Droit d'accès</strong> à vos données</li>
                <li><strong className="font-medium">Droit de rectification</strong> de vos données inexactes</li>
                <li><strong className="font-medium">Droit à l'effacement</strong> (« droit à l'oubli »)</li>
                <li><strong className="font-medium">Droit à la limitation</strong> du traitement</li>
                <li><strong className="font-medium">Droit à la portabilité</strong> de vos données</li>
                <li><strong className="font-medium">Droit d'opposition</strong> au traitement</li>
                <li><strong className="font-medium">Droit de retirer votre consentement</strong> à tout moment</li>
              </ul>
              <p className="mt-3">Pour exercer ces droits, contactez : <a href="mailto:charles@symphonydrive.com?subject=RGPD - Exercice de mes droits" className="text-accent hover:opacity-80">charles@symphonydrive.com</a></p>
              <p className="mt-2">Nous répondons sous 30 jours maximum.</p>
              <p className="mt-3">Vous disposez également du droit d'introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-accent hover:opacity-80">www.cnil.fr</a></p>
            </Block>

            <Block title="DPA (Data Processing Agreement)">
              <p>Pour les clients B2B (marques cosméto utilisant VYVRE sur leur site), un <strong className="font-medium">accord de traitement des données (DPA)</strong> conforme à l'article 28 du RGPD est disponible sur demande à <a href="mailto:charles@symphonydrive.com?subject=DPA - Demande" className="text-accent hover:opacity-80">charles@symphonydrive.com</a>, ou consultable à la page <Link href="/dpa" className="text-accent hover:opacity-80">/dpa</Link>.</p>
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
      <div className="text-base text-text/75 leading-relaxed font-extralight">{children}</div>
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="px-8 py-16 border-t border-line text-xs text-text/45 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-6 font-mono tracking-[0.18em] uppercase text-text/35 text-[10px]">
        <Link href="/accuracy" className="hover:text-text">Méthodologie</Link>
        <Link href="/cgv" className="hover:text-text">CGV</Link>
        <Link href="/mentions-legales" className="hover:text-text">Mentions légales</Link>
        <Link href="/confidentialite" className="text-text">Confidentialité · RGPD</Link>
        <Link href="/dpa" className="hover:text-text">DPA</Link>
        <a href="mailto:charles@symphonydrive.com" className="hover:text-text ml-auto">charles@symphonydrive.com</a>
      </div>
    </footer>
  );
}
