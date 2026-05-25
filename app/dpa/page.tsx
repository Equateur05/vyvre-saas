/**
 * VYVRE — /dpa
 * Data Processing Agreement (article 28 RGPD).
 * Template B2B SaaS standard. Toujours faire valider par un avocat avant signature.
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'DPA · Data Processing Agreement · VYVRE',
  description: 'Accord de traitement des données (article 28 RGPD) entre VYVRE et les clients B2B.',
};

export default function DPAPage() {
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
              Article 28 RGPD · Sous-traitant
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-8">
              Data Processing<br />
              <em className="not-italic text-text/55 font-extralight">Agreement.</em>
            </h1>

            <div className="v6-soft px-6 py-5 mb-12 text-sm text-text/75 font-extralight leading-relaxed">
              <p><strong className="font-medium text-text">Note importante :</strong> ce DPA est un résumé public des principaux engagements. Le document contractuel complet, signé et conforme à la jurisprudence EDPB la plus récente, est disponible sur simple demande à <a href="mailto:charles@symphonydrive.com?subject=DPA - Document signé" className="text-accent hover:opacity-80">charles@symphonydrive.com</a>. Il est obligatoirement signé avant toute mise en production chez un Client B2B.</p>
            </div>

            <Block title="1. Parties">
              <p><strong className="font-medium text-text">Responsable de traitement</strong> : le Client B2B (marque cosmétique) utilisant VYVRE Business sur son site.</p>
              <p className="mt-3"><strong className="font-medium text-text">Sous-traitant</strong> : Symphony Drive SAS, éditrice de VYVRE.</p>
            </Block>

            <Block title="2. Objet du traitement">
              <p>Le sous-traitant fournit au responsable de traitement un service de diagnostic peau par IA, incluant :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Analyse colorimétrique d'images webcam</li>
                <li>Calcul de 6 indicateurs peau peer-reviewed</li>
                <li>Estimation âge peau perçu (Vierkötter 2009)</li>
                <li>Matching avec le catalogue produits du Client</li>
                <li>Hébergement de l'infrastructure technique</li>
              </ul>
            </Block>

            <Block title="3. Catégories de données traitées">
              <p>Le sous-traitant traite, pour le compte du responsable de traitement :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Images du visage</strong> de l'utilisateur final (donnée biométrique au sens de l'article 9 RGPD) — <span className="text-text">traitement éphémère en mémoire vive uniquement, jamais persistées</span></li>
                <li><strong className="font-medium">Scores agrégés</strong> du scan (8 valeurs numériques 0-100) — anonymisées, sans rattachement à l'identité</li>
                <li><strong className="font-medium">Phototype Fitzpatrick</strong> détecté (1-6)</li>
                <li><strong className="font-medium">Métadonnées techniques</strong> : timestamp, IP anonymisée, user-agent</li>
              </ul>
            </Block>

            <Block title="4. Catégories de personnes concernées">
              <p>Les visiteurs et clients du site e-commerce du responsable de traitement qui choisissent volontairement d'utiliser le scanner peau VYVRE.</p>
            </Block>

            <Block title="5. Durée du traitement">
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Images : durée du scan uniquement (typiquement &lt;100ms)</li>
                <li>Scores agrégés : 30 jours (puis suppression automatique)</li>
                <li>Logs techniques : 90 jours maximum</li>
              </ul>
              <p className="mt-3">Le présent DPA prend effet à la signature du contrat principal et reste en vigueur pendant toute la durée de la relation contractuelle.</p>
            </Block>

            <Block title="6. Obligations du sous-traitant">
              <p>Symphony Drive SAS s'engage à :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Traiter les données uniquement sur instruction documentée du responsable de traitement</li>
                <li>Garantir que les personnes autorisées à traiter les données sont soumises à une obligation de confidentialité</li>
                <li>Mettre en œuvre les mesures techniques et organisationnelles appropriées (article 32 RGPD)</li>
                <li>Respecter les conditions de recours à un autre sous-traitant (article 28.2 RGPD)</li>
                <li>Aider le responsable de traitement dans l'exercice des droits des personnes concernées (articles 15-22 RGPD)</li>
                <li>Notifier toute violation de données dans un délai maximal de <strong className="font-medium text-text">48 heures</strong></li>
                <li>Supprimer ou restituer toutes les données en fin de contrat (au choix du responsable de traitement)</li>
                <li>Mettre à disposition toute information nécessaire pour démontrer le respect du présent DPA</li>
              </ul>
            </Block>

            <Block title="7. Mesures de sécurité (article 32 RGPD)">
              <p>Symphony Drive SAS met en œuvre les mesures techniques suivantes :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Chiffrement en transit</strong> : TLS 1.3 sur toutes les communications</li>
                <li><strong className="font-medium">Chiffrement au repos</strong> : AES-256 sur la base de données Supabase</li>
                <li><strong className="font-medium">Authentification forte</strong> : 2FA obligatoire sur tous les comptes admin</li>
                <li><strong className="font-medium">Pseudonymisation</strong> des données utilisateur dans les logs</li>
                <li><strong className="font-medium">Pas de stockage d'images</strong> : traitement en RAM uniquement</li>
                <li><strong className="font-medium">Sauvegardes</strong> chiffrées, rétention 30 jours, géo-redondance EU</li>
                <li><strong className="font-medium">Audits réguliers</strong> de sécurité (interne + externe)</li>
                <li><strong className="font-medium">Logs d'accès</strong> aux données conservés 1 an</li>
              </ul>
            </Block>

            <Block title="8. Sous-traitants ultérieurs">
              <p>Symphony Drive SAS a recours aux sous-traitants ultérieurs suivants, listés au moment de la signature :</p>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left py-2 pr-4 font-mono text-[10px] tracking-[0.15em] uppercase text-text/55">Sous-traitant</th>
                      <th className="text-left py-2 pr-4 font-mono text-[10px] tracking-[0.15em] uppercase text-text/55">Service</th>
                      <th className="text-left py-2 font-mono text-[10px] tracking-[0.15em] uppercase text-text/55">Localisation</th>
                    </tr>
                  </thead>
                  <tbody className="text-text/75 font-extralight">
                    <tr className="border-b border-line/40">
                      <td className="py-3 pr-4">Vercel Inc.</td>
                      <td className="py-3 pr-4">Hébergement frontend</td>
                      <td className="py-3">UE (Paris, edge)</td>
                    </tr>
                    <tr className="border-b border-line/40">
                      <td className="py-3 pr-4">Supabase Inc.</td>
                      <td className="py-3 pr-4">Base de données PostgreSQL</td>
                      <td className="py-3">UE (eu-west-3 Paris)</td>
                    </tr>
                    <tr className="border-b border-line/40">
                      <td className="py-3 pr-4">Google Cloud (Firebase)</td>
                      <td className="py-3 pr-4">Hébergement démos</td>
                      <td className="py-3">UE (europe-west1)</td>
                    </tr>
                    <tr className="border-b border-line/40">
                      <td className="py-3 pr-4">Stripe</td>
                      <td className="py-3 pr-4">Traitement paiements B2B</td>
                      <td className="py-3">UE + USA (PCI-DSS L1)</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Resend</td>
                      <td className="py-3 pr-4">Envoi emails transactionnels</td>
                      <td className="py-3">UE (Paris)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">Toute modification de cette liste sera notifiée au responsable de traitement avec un préavis de 30 jours, permettant l'exercice d'un droit d'opposition motivé.</p>
            </Block>

            <Block title="9. Transferts hors UE">
              <p><strong className="font-medium text-text">Aucun transfert de données personnelles hors de l'Union européenne n'est effectué dans le cadre du service VYVRE.</strong></p>
              <p className="mt-3">Les sous-traitants ultérieurs basés aux USA (Vercel, Google Cloud) traitent les données exclusivement via leurs régions européennes (Paris). Stripe applique des Clauses Contractuelles Types (CCT) approuvées par la Commission européenne pour ses traitements transfrontaliers minimaux.</p>
            </Block>

            <Block title="10. Audit et contrôle">
              <p>Le responsable de traitement dispose d'un droit d'audit annuel des mesures techniques et organisationnelles mises en place par le sous-traitant, sur préavis de 30 jours et à ses frais.</p>
              <p className="mt-3">Symphony Drive SAS fournit annuellement un rapport d'audit interne synthétique sur demande.</p>
            </Block>

            <Block title="11. Notification de violation de données">
              <p>En cas de violation de données personnelles, Symphony Drive SAS s'engage à notifier le responsable de traitement dans un délai maximal de <strong className="font-medium text-text">48 heures</strong> après en avoir pris connaissance, avec :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Description de la nature de la violation</li>
                <li>Catégories et nombre approximatif de personnes concernées</li>
                <li>Conséquences probables</li>
                <li>Mesures prises ou proposées pour y remédier</li>
              </ul>
            </Block>

            <Block title="12. Restitution / suppression des données">
              <p>En fin de contrat, le responsable de traitement peut demander :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>L'export complet de ses données dans un format structuré (JSON, CSV) sous 15 jours</li>
                <li>La suppression définitive de toutes les données sous 30 jours après la fin du contrat</li>
              </ul>
            </Block>

            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 mt-16 pt-8 border-t border-line">
              Version 1.0 — Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="v6-soft px-6 py-5 mt-8 text-sm text-text/75 font-extralight leading-relaxed">
              <p>Pour obtenir le DPA contractuel signé, contactez : <a href="mailto:charles@symphonydrive.com?subject=DPA - Demande de signature" className="text-accent hover:opacity-80">charles@symphonydrive.com</a></p>
            </div>
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
        <Link href="/confidentialite" className="hover:text-text">Confidentialité · RGPD</Link>
        <Link href="/dpa" className="text-text">DPA</Link>
        <a href="mailto:charles@symphonydrive.com" className="hover:text-text ml-auto">charles@symphonydrive.com</a>
      </div>
    </footer>
  );
}
