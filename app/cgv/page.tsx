/**
 * VYVRE — /cgv
 * Conditions Générales de Vente pour le SaaS B2B VYVRE Business.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../SiteHeader';
import Script from 'next/script';
import { LegalFooter, LegalNotice, LegalUpdated } from '../LegalChrome';
import { getPage } from '../../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('cgv.meta.title'), description: t('cgv.meta.desc') };
}

export default function CGVPage() {
  const { t } = getPage();
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <main className="min-h-screen flex flex-col">
        <SiteHeader />

        <section className="px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              {t('cgv.eyebrow')}
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              {t('cgv.h1')}
            </h1>

            <LegalNotice />

            <p className="text-lg text-text/75 font-extralight leading-relaxed mb-12">
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du service VYVRE Business, fourni par Symphony Drive SAS aux marques et entreprises clientes (« Client »).
            </p>

            <Block title={t('cgv.a1')}>
              <p>VYVRE Business est un service SaaS (Software as a Service) de diagnostic de peau par analyse colorimétrique de l'image, fourni sous forme de widget intégrable à un site e-commerce, ainsi que sous forme d'API.</p>
              <p className="mt-3">Le service inclut : moteur de scan webcam, analyse de 6 indicateurs peau, estimation âge peau, matching avec le catalogue produit du Client, hébergement, support technique et mises à jour.</p>
            </Block>

            <Block title={t('cgv.a2')}>
              <p>La souscription s'effectue en ligne via vyvre.fr/pricing ou sur devis pour le plan Enterprise. Le contrat prend effet dès validation du paiement.</p>
              <p className="mt-3">L'activation du service sur le site du Client est réalisée sous <strong className="font-medium">48 heures ouvrées</strong> après réception de :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Catalogue produits (URL CSV, accès API Shopify/Salesforce, ou export manuel)</li>
                <li>Charte graphique de la marque (couleurs, typographie, logo)</li>
                <li>Validation du script d'intégration à coller sur le site</li>
              </ul>
            </Block>

            <Block title={t('cgv.a3')}>
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

            <Block title={t('cgv.a4')}>
              <p>Le paiement s'effectue par carte bancaire via notre prestataire Stripe (certifié PCI-DSS niveau 1) ou par virement SEPA pour les plans Enterprise.</p>
              <p className="mt-3">Les abonnements mensuels sont facturés au début de chaque période.</p>
              <p className="mt-3">En cas de retard de paiement, des pénalités de retard égales à 3 fois le taux d'intérêt légal s'appliquent, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement (article L.441-10 du Code de commerce).</p>
            </Block>

            <Block title={t('cgv.a5')}>
              <p>Les abonnements mensuels sont sans engagement de durée minimum. Ils sont reconductibles tacitement chaque mois et résiliables à tout moment depuis l'espace client ou par email avec un préavis de 30 jours.</p>
              <p className="mt-3">Le plan Pilot (gratuit) peut être interrompu unilatéralement par Symphony Drive SAS avec un préavis de 7 jours.</p>
            </Block>

            <Block title={t('cgv.a6')}>
              <p>Symphony Drive SAS s'engage à un taux de disponibilité du service de :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Pilot</strong> : 95% (best effort)</li>
                <li><strong className="font-medium">Starter</strong> : 99% (best effort)</li>
                <li><strong className="font-medium">Growth</strong> : 99.5% (compensation prorata)</li>
                <li><strong className="font-medium">Enterprise</strong> : 99.9% (SLA contractuel personnalisé)</li>
              </ul>
              <p className="mt-3">Les fenêtres de maintenance programmées sont notifiées au moins 48h à l'avance et ne sont pas comptabilisées dans le calcul du SLA.</p>
            </Block>

            <Block title={t('cgv.a7')}>
              <p>Le catalogue produits du Client reste la propriété exclusive du Client. Symphony Drive SAS dispose d'une licence d'utilisation limitée au strict nécessaire pour fournir le service.</p>
              <p className="mt-3">Les données agrégées issues des scans (anonymisées, sans données personnelles identifiantes) peuvent être utilisées par Symphony Drive SAS pour améliorer le moteur d'analyse et publier des statistiques globales agrégées (jamais individuelles).</p>
              <p className="mt-3">En cas de résiliation, le Client peut demander un export complet de ses données dans un délai de 30 jours, après quoi elles sont supprimées définitivement.</p>
            </Block>

            <Block title={t('cgv.a8')}>
              <p><strong className="font-medium text-text">VYVRE n'est pas un dispositif médical.</strong> Le diagnostic peau fourni est une estimation visuelle basée sur des indicateurs colorimétriques peer-reviewed (cf. <Link href="/accuracy" className="text-accent hover:opacity-80">/accuracy</Link>). Il ne se substitue pas à un examen dermatologique professionnel.</p>
              <p className="mt-3">La responsabilité de Symphony Drive SAS est limitée au montant des abonnements payés par le Client au cours des 12 mois précédant l'événement générateur de responsabilité.</p>
              <p className="mt-3">Symphony Drive SAS ne peut être tenu responsable des dommages indirects, perte de revenus, perte de clientèle ou perte de réputation.</p>
            </Block>

            <Block title={t('cgv.a9')}>
              <p>Les parties s'engagent au respect mutuel de la confidentialité des informations échangées.</p>
              <p className="mt-3">Le traitement des données personnelles est encadré par un DPA (Data Processing Agreement) conforme à l'article 28 du RGPD, disponible à la page <Link href="/dpa" className="text-accent hover:opacity-80">/dpa</Link>.</p>
              <p className="mt-3">Pour plus de détails, consultez notre <Link href="/confidentialite" className="text-accent hover:opacity-80">Politique de confidentialité</Link>.</p>
            </Block>

            <Block title={t('cgv.a10')}>
              <p>Les présentes CGV sont régies par le droit français. En cas de litige, et après échec d'une tentative de résolution amiable, les tribunaux de Paris seront seuls compétents.</p>
            </Block>

            <LegalUpdated version />
          </div>
        </section>

        <LegalFooter current="cgv" />
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

