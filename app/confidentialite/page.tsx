/**
 * VYVRE — /confidentialite
 * Politique de confidentialité conforme RGPD (Règlement UE 2016/679).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '../SiteHeader';
import Script from 'next/script';
import { LegalFooter, LegalNotice, LegalUpdated } from '../LegalChrome';
import { getPage } from '../../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('conf.meta.title'), description: t('conf.meta.desc') };
}

export default function ConfidentialitePage() {
  const { t } = getPage();
  return (
    <>
      <Script src="/vyvre-mini-lattice.js" strategy="afterInteractive" />
      <main className="min-h-screen flex flex-col">
        <SiteHeader />

        <section className="px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-accent mb-4">
              {t('conf.eyebrow')}
            </div>
            <h1 className="font-sans text-5xl md:text-6xl font-thin leading-[1.05] -tracking-[0.025em] mb-12">
              {t('conf.h1')}
            </h1>

            <LegalNotice />

            <p className="text-lg text-text/75 font-extralight leading-relaxed mb-12">
              Cette page dit ce que VYVRE fait de vos données, sans exception. L’essentiel : votre visage est analysé dans votre téléphone ou votre ordinateur, et aucune photo ni vidéo n’est envoyée ni conservée.
            </p>

            <Block title={t('conf.b1')}>
              <p><strong className="font-medium">LE KIT PARISIEN SAS</strong>, éditeur de VYVRE</p>
              <p>15 rue des Écoles, 75005 Paris, France</p>
              <p>RCS Paris 939 752 374</p>
              <p className="mt-3">Pour toute question sur vos données : <a href="mailto:charles@vyvre.fr?subject=Donn%C3%A9es%20personnelles" className="text-accent hover:opacity-80">charles@vyvre.fr</a>. Nous n’avons pas désigné de délégué à la protection des données ; cette adresse le remplace.</p>
            </Block>

            <Block title={t('conf.b2')}>
              <p>Le scan de peau, le scan des cheveux et la lecture du parcours Aliments utilisent votre caméra, ou une photo que vous choisissez. L’image est analysée <strong className="font-medium text-text">dans votre navigateur, sur votre téléphone ou votre ordinateur</strong>, par un programme chargé depuis vyvre.fr.</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li><strong className="font-medium text-text">Aucune photo ni vidéo n’est envoyée</strong>, ni à nous ni à un tiers, et aucune n’est conservée. L’image reste en mémoire le temps de la page et disparaît à sa fermeture.</li>
                <li>Les résultats (scores, phototype, âge de peau estimé, soins proposés) sont calculés et affichés dans votre appareil. Ils ne nous sont pas envoyés.</li>
                <li>Un Wrap (image à partager) est fabriqué dans votre appareil. Il n’en sort que si vous le partagez ou l’enregistrez vous-même.</li>
                <li>Scan des cheveux : à chaque lecture, la page envoie à notre hébergeur un court journal technique, <strong className="font-medium text-text">sans image ni résultat</strong> (navigateur, définition de la caméra, durée, étapes franchies, raison d’un échec, quelques mesures de qualité d’image). Il sert seulement à corriger les pannes.</li>
              </ul>
            </Block>

            <Block title={t('conf.b3')}>
              <p>Pour que les pages suivantes (protocole, aliments) retrouvent vos résultats, votre navigateur garde, <strong className="font-medium text-text">sur votre appareil seulement</strong> (stockage local) :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>vos scores de peau, la date du scan et les soins retenus, ainsi qu’un historique de vos scores (60 scans au plus) pour suivre leur évolution ; jamais d’image ;</li>
                <li>vos réponses aux questions d’avant scan (pour qui, objectifs, marques, budget, pays) ;</li>
                <li>votre langue, aussi enregistrée dans un cookie technique « vyvre-lang » valable un an.</li>
              </ul>
              <p className="mt-3">Pendant la visite seulement (stockage de session, effacé à la fermeture de l’onglet) : l’avancement du parcours Aliments et le fait d’avoir vu l’introduction.</p>
              <p className="mt-3">Ces informations ne nous sont pas envoyées. Vous pouvez les effacer à tout moment dans les réglages de votre navigateur (données du site vyvre.fr). <strong className="font-medium text-text">Aucun cookie publicitaire, aucun outil de mesure d’audience, aucun pixel de suivi.</strong></p>
            </Block>

            <Block title={t('conf.b4')}>
              <p>Le parcours Aliments peut vous demander des informations de santé : allergies, grossesse, traitement anticoagulant, maladie des reins, régime végétarien ou végan. Ce sont des données sensibles au sens de l’article 9 du RGPD.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Elles servent uniquement à écarter des aliments ou à afficher une précaution, et seulement après votre <strong className="font-medium text-text">accord explicite</strong>, demandé à l’écran (« Accepter et voir mon assiette »). Vous pouvez aussi ne pas répondre.</li>
                <li>Elles <strong className="font-medium text-text">restent dans votre appareil</strong> : en stockage de session pendant la visite, effacées à la fermeture de l’onglet. Elles ne nous sont jamais envoyées.</li>
                <li>Si vous choisissez « Garder mes réponses sur cet appareil » (réservé aux personnes majeures), elles restent dans votre navigateur 6 mois au plus, puis s’effacent. Un bouton permet de les effacer à tout moment.</li>
                <li>« Près de vous » : seulement si vous le demandez, votre position, arrondie à environ 1 km, est envoyée au service de carte ouverte OpenStreetMap (Overpass) pour trouver des commerces. VYVRE ne l’enregistre pas.</li>
              </ul>
            </Block>

            <Block title={t('conf.b5')}>
              <p>Certains liens que nous envoyons à des professionnels contiennent un paramètre <span className="font-mono text-sm">?p=</span>. Sur ces liens seulement, et avec un bandeau qui le signale, la page enregistre la visite dans notre base de données (Supabase) : identifiant du lien, page vue, navigateur, site d’origine, taille d’écran, temps passé, défilement, boutons cliqués, début du scan.</p>
              <p className="mt-3"><strong className="font-medium text-text">Aucune image ni aucun résultat de scan n’est transmis.</strong> Sans <span className="font-mono text-sm">?p=</span> dans l’adresse, rien n’est enregistré. Vous pouvez vous y opposer en écrivant à <a href="mailto:charles@vyvre.fr" className="text-accent hover:opacity-80">charles@vyvre.fr</a>.</p>
            </Block>

            <Block title={t('conf.b6')}>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong className="font-medium">Vercel Inc.</strong> (États-Unis) héberge le site. Les pages sont servies au plus près de vous (Paris pour la France) ; les fonctions serveur du site tournent aux États-Unis. Comme tout hébergeur, Vercel reçoit votre adresse IP et le nom de votre navigateur, et tient des journaux techniques pendant une durée courte qu’il fixe.</li>
                <li><strong className="font-medium">Supabase Inc.</strong> (États-Unis) : base de données hébergée dans l’Union européenne (Irlande). Elle garde les visites des liens personnels et les comptes des marques clientes.</li>
                <li><strong className="font-medium">Stripe</strong> (Stripe Payments Europe Ltd, Irlande) encaisse les abonnements des marques.</li>
                <li><strong className="font-medium">Resend Inc.</strong> (États-Unis) envoie les e-mails liés aux abonnements des marques.</li>
                <li><strong className="font-medium">OpenStreetMap (Overpass)</strong> : seulement si vous utilisez « Près de vous ».</li>
                <li><strong className="font-medium">jsDelivr</strong> : le scan des cheveux charge une bibliothèque d’affichage 3D depuis cdn.jsdelivr.net, qui reçoit alors votre adresse IP.</li>
                <li><strong className="font-medium">Polices de caractères</strong> : servies par vyvre.fr. Les pages du site ne les demandent plus à Google ; seules quelques maquettes de travail, absentes des menus, le font encore.</li>
              </ul>
              <p className="mt-3">Vercel, Supabase, Stripe et Resend sont des sociétés américaines ou liées à une société américaine : certaines données (adresse IP, données de facturation des marques) peuvent donc être transférées ou consultées aux États-Unis. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne et, pour les prestataires qui y adhèrent, par le cadre de protection des données UE–États-Unis.</p>
            </Block>

            <Block title={t('conf.b7')}>
              <p>Quand une marque souscrit un abonnement VYVRE, Stripe recueille le nom, l’e-mail professionnel, la raison sociale et les coordonnées de facturation. <strong className="font-medium text-text">Les données de carte bancaire sont traitées par Stripe seul</strong> et ne passent jamais par nos serveurs.</p>
              <p className="mt-3">Nous gardons dans Supabase : l’e-mail, le nom de la marque, la formule choisie, les identifiants Stripe du client et de l’abonnement, et un compteur de scans du mois (un nombre, sans aucun résultat individuel).</p>
            </Block>

            <Block title={t('conf.b8')}>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Le scan se fait dans votre appareil, à votre demande : nous ne recevons ni l’image ni le résultat.</li>
                <li>Fonctionnement et sécurité du site, journaux techniques, suivi des liens personnels : <strong className="font-medium">intérêt légitime</strong> (article 6.1.f du RGPD).</li>
                <li>Réponses de santé du parcours Aliments : <strong className="font-medium">consentement explicite</strong> (article 9.2.a), que vous pouvez retirer à tout moment en les effaçant.</li>
                <li>Position pour « Près de vous » : <strong className="font-medium">consentement</strong>, donné par l’autorisation de votre navigateur.</li>
                <li>Abonnement des marques : <strong className="font-medium">exécution du contrat</strong> (article 6.1.b) ; factures : <strong className="font-medium">obligation légale</strong> (article 6.1.c).</li>
              </ul>
            </Block>

            <Block title={t('conf.b9')}>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Images du visage : <strong>aucune conservation</strong>, rien n’est envoyé.</li>
                <li>Informations gardées par votre navigateur : jusqu’à ce que vous les effaciez ; réponses de santé gardées sur l’appareil : 6 mois au plus ; stockage de session : jusqu’à la fermeture de l’onglet.</li>
                <li>Visites des liens personnels : 12 mois au plus.</li>
                <li>Comptes des marques clientes : durée de l’abonnement, puis 3 ans.</li>
                <li>Factures : 10 ans (obligation comptable).</li>
                <li>Journaux techniques de l’hébergeur : durée courte fixée par Vercel.</li>
              </ul>
            </Block>

            <Block title={t('conf.b10')}>
              <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong className="font-medium">Droit d’accès</strong> à vos données</li>
                <li><strong className="font-medium">Droit de rectification</strong> des données inexactes</li>
                <li><strong className="font-medium">Droit à l’effacement</strong></li>
                <li><strong className="font-medium">Droit à la limitation</strong> du traitement</li>
                <li><strong className="font-medium">Droit à la portabilité</strong></li>
                <li><strong className="font-medium">Droit d’opposition</strong></li>
                <li><strong className="font-medium">Droit de retirer votre consentement</strong> à tout moment</li>
                <li><strong className="font-medium">Droit de définir des directives</strong> sur le sort de vos données après votre décès</li>
              </ul>
              <p className="mt-3">Ce que garde votre navigateur, vous l’effacez vous-même : nous n’y avons pas accès. Pour le reste, écrivez à <a href="mailto:charles@vyvre.fr?subject=RGPD%20-%20Exercice%20de%20mes%20droits" className="text-accent hover:opacity-80">charles@vyvre.fr</a>. Nous répondons dans un délai d’un mois.</p>
              <p className="mt-3">Vous pouvez aussi adresser une réclamation à la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 : <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-accent hover:opacity-80">www.cnil.fr</a>.</p>
            </Block>

            <Block title={t('conf.b11')}>
              <p>Pour les marques qui intègrent VYVRE sur leur site, un accord de traitement des données (article 28 du RGPD) est disponible sur demande à <a href="mailto:charles@vyvre.fr?subject=DPA%20-%20Demande" className="text-accent hover:opacity-80">charles@vyvre.fr</a>. Un résumé est consultable à la page <Link href="/dpa" className="text-accent hover:opacity-80">/dpa</Link>.</p>
            </Block>

            <LegalUpdated />
          </div>
        </section>

        <LegalFooter current="confidentialite" />
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

