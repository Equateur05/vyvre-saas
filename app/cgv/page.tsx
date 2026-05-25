/**
 * VYVRE — /cgv
 * Conditions Générales de Vente pour le SaaS B2B VYVRE Business.
 */

import Link from 'next/link';
import Script from 'next/script';

export const metadata = {
  title: 'CGV · VYVRE',
  description: 'Conditions Générales de Vente VYVRE Business — abonnements SaaS B2B pour marques cosmétiques.',
};

export default function CGVPage() {
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
              Conditions générales de vente
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              CGV.
            </h1>

            <p className="text-lg text-text/75 font-extralight leading-relaxed mb-12">
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du service VYVRE Business, fourni par Symphony Drive SAS aux marques et entreprises clientes (« Client »).
            </p>

            <Block title="Article 1 — Objet">
              <p>VYVRE Business est un service SaaS (Software as a Service) de diagnostic peau par intelligence artificielle, fourni sous forme de widget intégrable à un site e-commerce, ainsi que sous forme d'API.</p>
              <p className="mt-3">Le service inclut : moteur de scan webcam, analyse de 6 indicateurs peau, estimation âge peau, matching avec le catalogue produit du Client, hébergement, support technique et mises à jour.</p>
            </Block>

            <Block title="Article 2 — Souscription et activation">
              <p>La souscription s'effectue en ligne via vyvre.fr/pricing ou sur devis pour le plan Enterprise. Le contrat prend effet dès validation du paiement.</p>
              <p className="mt-3">L'activation du service sur le site du Client est réalisée sous <strong className="font-medium">48 heures ouvrées</strong> après réception de :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Catalogue produits (URL CSV, accès API Shopify/Salesforce, ou export manuel)</li>
                <li>Charte graphique de la marque (couleurs, typographie, logo)</li>
                <li>Validation du script d'intégration à coller sur le site</li>
              </ul>
            </Block>

            <Block title="Article 3 — Tarifs">
              <p>Les tarifs publics sont indiqués sur la page vyvre.fr/pricing :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Pilot</strong> : Gratuit (jusqu'à 500 scans/mois)</li>
                <li><strong className="font-medium">Starter</strong> : 299€/mois HT (jusqu'à 5 000 scans/mois)</li>
                <li><strong className="font-medium">Growth</strong> : 499€/mois HT (jusqu'à 50 000 scans/mois)</li>
                <li><strong className="font-medium">Enterprise</strong> : sur devis (volume illimité, SLA dédié)</li>
              </ul>
              <p className="mt-3">Les prix sont indiqués hors taxes (HT). La TVA applicable selon la législation française en vigueur (20% pour les clients français, autoliquidation pour les clients européens B2B avec numéro de TVA intracommunautaire valide).</p>
              <p className="mt-3">Au-delà du volume inclus, un tarif de <strong className="font-medium">0,02€ HT par scan supplémentaire</strong> s'applique (Starter et Growth).</p>
            </Block>

            <Block title="Article 4 — Modalités de paiement">
              <p>Le paiement s'effectue par carte bancaire via notre prestataire Stripe (certifié PCI-DSS niveau 1) ou par virement SEPA pour les plans Enterprise.</p>
              <p className="mt-3">Les abonnements mensuels sont facturés au début de chaque période. Les abonnements annuels (avec remise -20%) sont facturés à la souscription.</p>
              <p className="mt-3">En cas de retard de paiement, des pénalités de retard égales à 3 fois le taux d'intérêt légal s'appliquent, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement (article L.441-10 du Code de commerce).</p>
            </Block>

            <Block title="Article 5 — Durée et résiliation">
              <p>Les abonnements mensuels sont sans engagement de durée minimum. Ils sont reconductibles tacitement chaque mois et résiliables à tout moment depuis l'espace client ou par email avec un préavis de 30 jours.</p>
              <p className="mt-3">Les abonnements annuels sont conclus pour une durée de 12 mois, reconductibles tacitement. Conformément à la loi Châtel, le Client est informé par email 60 jours avant la date de reconduction et peut s'y opposer à tout moment.</p>
              <p className="mt-3">Le plan Pilot (gratuit) peut être interrompu unilatéralement par Symphony Drive SAS avec un préavis de 7 jours.</p>
            </Block>

            <Block title="Article 6 — Engagement de service (SLA)">
              <p>Symphony Drive SAS s'engage à un taux de disponibilité du service de :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Pilot</strong> : 95% (best effort)</li>
                <li><strong className="font-medium">Starter</strong> : 99% (best effort)</li>
                <li><strong className="font-medium">Growth</strong> : 99.5% (compensation prorata)</li>
                <li><strong className="font-medium">Enterprise</strong> : 99.9% (SLA contractuel personnalisé)</li>
              </ul>
              <p className="mt-3">Les fenêtres de maintenance programmées sont notifiées au moins 48h à l'avance et ne sont pas comptabilisées dans le calcul du SLA.</p>
            </Block>

            <Block title="Article 7 — Propriété des données">
              <p>Le catalogue produits du Client reste la propriété exclusive du Client. Symphony Drive SAS dispose d'une licence d'utilisation limitée au strict nécessaire pour fournir le service.</p>
              <p className="mt-3">Les données agrégées issues des scans (anonymisées, sans données personnelles identifiantes) peuvent être utilisées par Symphony Drive SAS pour améliorer le moteur d'analyse et publier des statistiques globales agrégées (jamais individuelles).</p>
              <p className="mt-3">En cas de résiliation, le Client peut demander un export complet de ses données dans un délai de 30 jours, après quoi elles sont supprimées définitivement.</p>
            </Block>

            <Block title="Article 8 — Limitation de responsabilité">
              <p><strong className="font-medium text-text">VYVRE n'est pas un dispositif médical.</strong> Le diagnostic peau fourni est une estimation visuelle basée sur des indicateurs colorimétriques peer-reviewed (cf. <Link href="/accuracy" className="text-accent hover:opacity-80">/accuracy</Link>). Il ne se substitue pas à un examen dermatologique professionnel.</p>
              <p className="mt-3">La responsabilité de Symphony Drive SAS est limitée au montant des abonnements payés par le Client au cours des 12 mois précédant l'événement générateur de responsabilité.</p>
              <p className="mt-3">Symphony Drive SAS ne peut être tenu responsable des dommages indirects, perte de revenus, perte de clientèle ou perte de réputation.</p>
            </Block>

            <Block title="Article 9 — Confidentialité et RGPD">
              <p>Les parties s'engagent au respect mutuel de la confidentialité des informations échangées.</p>
              <p className="mt-3">Le traitement des données personnelles est encadré par un DPA (Data Processing Agreement) conforme à l'article 28 du RGPD, disponible à la page <Link href="/dpa" className="text-accent hover:opacity-80">/dpa</Link>.</p>
              <p className="mt-3">Pour plus de détails, consultez notre <Link href="/confidentialite" className="text-accent hover:opacity-80">Politique de confidentialité</Link>.</p>
            </Block>

            <Block title="Article 10 — Droit applicable et juridiction">
              <p>Les présentes CGV sont régies par le droit français. En cas de litige, et après échec d'une tentative de résolution amiable, les tribunaux de Paris seront seuls compétents.</p>
            </Block>

            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 mt-16 pt-8 border-t border-line">
              Version 1.0 — Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
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
        <Link href="/cgv" className="text-text">CGV</Link>
        <Link href="/mentions-legales" className="hover:text-text">Mentions légales</Link>
        <Link href="/confidentialite" className="hover:text-text">Confidentialité · RGPD</Link>
        <Link href="/dpa" className="hover:text-text">DPA</Link>
        <a href="mailto:charles@symphonydrive.com" className="hover:text-text ml-auto">charles@symphonydrive.com</a>
      </div>
    </footer>
  );
}
