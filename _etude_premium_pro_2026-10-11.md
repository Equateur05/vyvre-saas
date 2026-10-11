# vyvre.fr : Premium grand public et Pro pour les marques

Étude du 11/10/2026. Lecture du code seulement : aucune requête Supabase, aucun .env lu, aucun fichier en ligne modifié. Rien n'est relié au menu.

Maquettes :
- http://localhost:8766/propals/premium/
- http://localhost:8766/propals/pro/

---

## 0. Ce qu'il y a déjà dans le code

| Sujet | Ce qui existe | Conséquence |
|---|---|---|
| Menu réel | L'accueil `/` sert `public/scan/index.html` (réécriture dans `next.config.mjs`). Le menu visible est `public/scan/vy-menu.js` : logo, sélecteur Peau / Cheveux / Aliment, langue, menu burger (Manifeste, Méthode, Pour les marques). `app/SiteHeader.tsx` ne sert que les pages Next (/pricing, /marques, /accuracy). | Le lien « Pro » doit être ajouté **à deux endroits** : `vy-menu.js` (accueil, cheveux, aliment) et `SiteHeader.tsx`. |
| Lumière mesurée | `public/scan/vyvre-scan-engine.js` : luminance moyenne de l'image (contrôle d'avant scan, seuils 35 et 225 sur 255) ; luminance par image et sa stabilité ; part de pixels saturés (≥ 250, tolérance 5 %) ; netteté (variance du laplacien) ; distance (taille du visage) et angle (lacet, inclinaison) ; L\*, a\*, b\* moyens des joues ; écart d'éclairage joue gauche / joue droite (motif `lumiere_laterale` au-delà de 10) ; score de qualité 0-100 et son détail (luminosité, cadrage, stabilité, netteté, part de peau). | Tout ce qu'il faut pour une « empreinte de lumière » sans image (voir § 2.5). |
| Historique local | `public/scan/vyvre-tracker.js` garde jusqu'à 60 scans dans le téléphone (`vyvre_scan_history`) **avec une vignette du visage** (`photoCropped`, 160 px). Le scan écrit aussi `vyvre_scan_face` (vignette JPEG) pour le protocole et le Wrapped X1. | Légal tant que cela reste sur le téléphone, mais à **retirer de toute synchronisation** vers le compte. Je recommande de supprimer `photoCropped` de l'historique pour que la phrase « aucune photo conservée » soit vraie partout. |
| Soins | `public/scan/vy-choix.js` : 4 soins du matin (nettoyer, traiter, hydrater, protéger), un **soir** déjà calculé (`soir()`), règle « un seul actif fort », SPF 30 minimum. | La routine du soir est le Premium le plus simple à livrer : elle existe déjà. |
| Wrapped | `public/wrap/` : séries X1-X4 (3D) et F1-F3 (aliments), format 1080 × 1920, fin « Et toi ? » + vyvre.fr. | Le moteur peut produire un « film du progrès » à partir des scores. |
| Supabase | Tables trouvées dans le code : `brands` (plan, quotas, clé API, Stripe), `products`, `scans` (brand_id, scores, product_clicked, country_code, user_agent_hash), `vyvre_tracking` (suivi de démarchage `?p=`). **Aucune table d'utilisateur grand public.** | Tout le compte Premium est à créer (§ 2.7). |
| `scans` | Aucune ligne de code n'écrit dans `scans` (seul `brand-provisioning.ts` insère, dans `brands`). | Les « données agrégées » promises aux marques n'existent pas encore. |
| Tableau de bord B2B | `lib/email.ts` et `app/success/page.tsx` envoient vers `/dashboard` et `/dashboard/billing`. **Aucune route `app/dashboard` n'existe** : un client payant tombe sur une page introuvable. /pricing promet aussi « résiliation depuis votre tableau de bord ». | À corriger avant toute relance B2B. |
| Stripe | `lib/stripe.ts` et `app/pricing/links.ts` : uniquement les plans B2B, en mode réel. Non modifiés. | Le Premium demande de nouveaux produits Stripe (4,49 € et 34,99 €). |

---

## 1. Concurrents et modèles (prix vérifiés le 11/10/2026)

### 1.1 Analyse de peau, grand public

| Appli | Prix constaté | Modèle | Source |
|---|---|---|---|
| Skin Bliss | Pro **4,99 €/mois**, **24,99 €/an** (App Store France) ; aussi « Face Scanner » 1,99 € à l'unité | Freemium : analyse d'ingrédients et routines, le Pro débloque le reste | [App Store FR](https://apps.apple.com/fr/app/id1385561364) |
| YouCam Makeup (Perfect Corp) | Premium **5,99 à 9,99 $/mois**, **31,99 à 39,99 $/an** ; Pro 19,99 $/mois, 79,99 $/an (App Store US) | Plusieurs prix testés en parallèle, essai, abonnement fort | [App Pricing Lab](https://apppricinglab.com/iap/apple/863844475), [Adapty](https://adapty.io/paywall-library/youcam-makeup/) |
| SkinVision | **49,99 €/an**, 24,99 € les 3 mois, 6,99 € le contrôle unique | Dispositif médical (grains de beauté), remboursé en partie par des mutuelles | [NL Times](https://nltimes.nl/node/90665), [Test-Achats](https://www.test-aankoop.be/gezond/gezondheidszorg/medische-hulpmiddelen/nieuws/app-skinvision-werking-oordeel) |
| TroveSkin | Prix non vérifiable : l'appli n'est plus trouvée sur l'App Store US | Gratuit, points échangeables contre produits, revenus venant des marques (Asie du Sud-Est, 1,2 M d'inscrits annoncés) | [The Edge Singapore](https://testing.dev.theedgesingapore.com/news/startups-entrepreneurs-digital-economy/skincare-app-company-leverages-treasure-trove-data) |
| Haut.AI (côté marques) | Sur devis uniquement | API et marque blanche, « SkinGPT » | [Capterra](https://www.capterra.com/p/10020940/Haut-AI/alternatives/), [haut.ai](https://haut.ai) |
| Perfect Corp Skincare Pro (côté marques) | **¥26 100 / licence / mois** (Essential, 8 préoccupations) et **¥39 100** (Premium, 15), facturés à l'année ; Enterprise sur devis | Libre-service en ligne | [perfectcorp.com](https://www.perfectcorp.com/business/solutions/online-service/skincare-pro/plan) |

Lecture : le marché grand public se situe entre **4 et 10 € par mois** et **25 à 50 € par an**. À 4,49 €, vyvre est juste sous Skin Bliss (4,99 €) et sous YouCam. Le prix est cohérent.

### 1.2 Références freemium

| Service | Prix | Ce qui est gratuit / payant | Source |
|---|---|---|---|
| Yuka | À partir de **10 €/an** (Europe) | Gratuit : scan, note, alternatives. Premium : recherche, hors ligne, historique illimité. Pas de publicité, pas de marque payante. | [Aide Yuka](https://help.yuka.io/l/en/article/hkzw2hkj5w-cost-membership), [iPhoneSoft](https://iphonesoft.fr/2019/05/23/yuka-l-app-scan-produits-devient-partie-payante) |
| Flo | Prix de référence **~39,99 $/an**, varie selon pays et offres | Suivi gratuit, analyses et contenus en Premium | [Aide Flo](https://help.flo.health/hc/en-us/articles/4411278780564-What-is-the-price-for-a-Flo-subscription), [Subger](https://subger.com/en/service/flo-health) |
| Strava | **11,99 $/mois**, **79,99 $/an** | Gratuit : enregistrement, fil social, 30 jours d'historique. Payant : historique complet, tendances, classements. Le bilan annuel « Year in Sport » est passé **payant en décembre 2025** et a été très critiqué. | [Runner's Picks](https://www.runnerspicks.com/blog/strava-pricing-is-it-worth-it/), [Ars Technica via Harvard](https://tagteam.harvard.edu/hub_feeds/3415/feed_items/17132945/about), [T3](https://www.t3.com/tech/dear-strava-we-have-a-paywall-problem-thats-gone-a-step-too-far) |
| Spotify | Premium individuel France **~12 €/mois** (11,99 à 12,14 € selon la source, 2026) | Le Wrapped est **gratuit pour tous** | [KultureGeek](https://kulturegeek.fr/news-342637/spotify-prevoit-hausse-prix-2026) |
| Duolingo | Super : ~10 €/mois facturé à l'année en France (source tierce, à revérifier) | Les leçons restent gratuites ; Super retire la limite de vies et la pub | [Subger](https://subger.com/fr/deal/duolingo) |

### 1.3 Mécaniques virales qui marchent

- **Wrapped (Spotify)** : 2025, plus de 200 millions d'utilisateurs le premier jour et **500 millions de partages en 24 h** ([TechCrunch](https://techcrunch.com/2025/12/04/spotify-says-wrapped-2025-is-its-biggest-yet-with-200m-users-in-its-first-day), [IBTimes](https://www.ibtimes.com/record-breaking-spotify-wrapped-2025-sees-200m-engage-500m-shares-day-3792059)). Il est gratuit. Strava a fait l'inverse en 2025 et l'a payé en image. **Leçon : le Wrapped de vyvre reste gratuit.**
- **Séries (Duolingo)** : à 7 jours de série, un utilisateur a **2,4 fois plus de chances** de revenir le lendemain ([blog Duolingo](https://blog.duolingo.com/how-duolingo-streak-builds-habit)). Pour la peau, une série **quotidienne** serait une erreur (la peau ne change pas en un jour, et scanner tous les jours brouille la courbe). Il faut une **série de semaines** : « 6 semaines de suite au même rendez-vous ».
- **Parrainage** : le schéma le plus simple et le plus juste est « un mois offert à chacun ».
- **Défis** : un « défi 28 jours » (un scan par semaine, même heure), qui se termine par un film à partager.

---

## 2. Recommandation grand public

### 2.1 En dix lignes

1. **Prix** : 4,49 €/mois (décidé), **34,99 €/an** (soit 2,92 €/mois, −35 %). La suggestion de Charles est bonne : elle tombe au milieu du marché (Skin Bliss 24,99 €, YouCam ~33 $, Flo ~40 $, SkinVision 49,99 €).
2. **Gratuit** : 1 scan par jour au choix, avec un plafond par semaine : **peau 2, cheveux 1, aliments 2**.
3. **Un scan refusé ne compte jamais** (lumière, flou, visage mal cadré), ni un scan classé « autre lumière ».
4. **Toujours gratuit** : le scan et ses 8 mesures, les **4 soins du matin**, le Wrapped à partager, le contrôle de la lumière.
5. **Premium** : scans illimités, la **routine du soir**, **trois gammes de prix** à chaque étape, l'historique complet et le **film de ta peau**, **« ce qui marche sur toi »**, un bilan mensuel peau + cheveux + assiette, les rappels de rendez-vous.
6. **Entrée** : 7 jours de Premium offerts à la création du compte, **sans carte bancaire**, puis retour automatique au gratuit. Pas d'essai qui se transforme en paiement.
7. **Parrainage** : un mois de Premium offert à chacun (jusqu'à 12 par an). Le code apparaît sur la dernière image du Wrapped.
8. **Partage** : le Wrapped reste gratuit pour tous ; le Premium ajoute le **Wrapped du progrès** (film vertical fait de chiffres et de courbes), qui sert aussi de publicité au Premium.
9. **Produits floutés** : ne pas flouter le matin. Réserver au Premium ce qui est vraiment en plus (soir, gammes de prix). Jamais de floutage sur /m/<marque>.
10. **Aucune photo** dans le compte : seulement les scores, l'empreinte de lumière (8 chiffres) et l'historique des produits proposés.

### 2.2 La règle du gratuit, pourquoi celle-là

Le scan tourne sur le téléphone : un scan ne coûte presque rien au serveur. Le quota n'est donc pas une économie, c'est un **rythme**.

| Règle | Avantage | Défaut |
|---|---|---|
| Idée de Charles : un domaine par jour, pas deux jours de suite le même | Pousse à découvrir cheveux et aliments | Difficile à expliquer ; punit celle qui ne s'intéresse qu'à sa peau |
| Quota mensuel par domaine (ex. 4 peau / mois) | Simple | Tout est consommé la première semaine, puis plus rien pendant trois semaines |
| **Recommandé : 1 par jour + plafond hebdomadaire (peau 2, cheveux 1, aliments 2)** | Se lit en trois jauges ; colle au bon rythme de suivi (une peau se suit à la semaine) ; laisse une reprise si le premier scan de la semaine était raté | Un peu plus de logique à coder |

Détails :
- **Sans compte** : le premier scan reste libre, comme aujourd'hui (l'accueil ne change pas). Le compte (e-mail, lien magique, pas de mot de passe) est demandé pour garder l'historique, faire le deuxième scan de la semaine, ou démarrer l'essai.
- Sans compte, le quota est tenu sur l'appareil : contournable en navigation privée. C'est acceptable : le scan ne coûte rien, et la valeur du Premium est dans le suivi, pas dans le nombre.
- Le parcours Aliments fait lui-même un scan de peau. Ce scan compte comme **Aliments**, pas comme Peau.

### 2.3 Le Premium « incroyable », mais réaliste

| Fonction | Base dans le code | Effort |
|---|---|---|
| Routine du soir (4 soins), sans doublon d'actif fort | `vy-choix.js` `soir()` existe | Faible |
| Trois gammes de prix par étape (essentiel, bien fait, prestige) | Logique déjà faite pour les eaux ; prix présents dans les catalogues | Moyen |
| Historique complet, courbes, radar des 8 mesures | `vyvre-tracker.js` (local), à synchroniser sans vignette | Moyen |
| Le film de ta peau (vidéo 9:16 à partager) | Moteur du Wrapped | Moyen |
| « Ce qui marche sur toi » : on coche « j'utilise ce soin », et après 4 à 6 semaines on montre l'évolution des mesures liées | Historique des produits proposés + scores | Moyen. Toujours présenté comme indicatif, jamais comme preuve |
| Bilan 360 mensuel : peau + cheveux + assiette sur une page | Les trois moteurs existent | Moyen |
| Rendez-vous et rappels (e-mail ; notification si l'appli est ajoutée à l'écran d'accueil) | `manifest.webmanifest` existe | Moyen |
| Récapitulatif imprimable des mesures (à montrer à un professionnel) | Scores | Faible. Mention « non médical » |

### 2.4 Produits floutés : avis honnête

| Critère | Pour | Contre |
|---|---|---|
| Conversion | Le manque se voit au moment où l'envie est la plus forte. C'est le levier le plus direct. | Une partie des gens part sans rien : ni l'abonnement, ni les 2 soins visibles (routine jugée incomplète). |
| Confiance | — | On soupçonne une recommandation faite pour vendre. Cacher l'étape SPF est difficile à défendre. |
| Partage | Un « regarde, c'est flouté » peut circuler, mais en négatif. | Une capture floutée se partage mal. « Vyvre m'a donné ma routine » est la phrase qui fait venir des gens. |
| Marques qui paient pour être vues | — | Une marque partenaire floutée une fois sur deux ne peut pas être vendue. |
| Sécurité | — | La règle « un seul actif fort » ne tient que si la personne voit toute la routine. |

**Recommandation** : matin complet et net ; soir et gammes de prix en Premium (maquette D, à droite). Si Charles veut tester son idée : test A/B de 3 semaines sur vyvre.fr seulement, jamais sur l'étape SPF, jamais sur /m/<marque>, et on compare le taux d'abonnement **et** le taux de partage.

### 2.5 « Même heure, même endroit, même lumière »

**Où l'expliquer** : une page à part (« Le rendez-vous »), ouverte depuis le suivi et rappelée en une ligne avant chaque scan. Trois règles : la même heure (une heure d'écart au plus, le matin avant la crème) ; face à la même fenêtre ; la lumière du jour, plafonnier éteint, visage propre.

**Empreinte de lumière** (8 chiffres, aucune image), calculée avec ce que le moteur mesure déjà :

| Chiffre | Source dans le moteur | Écart toléré (à caler) |
|---|---|---|
| Intensité : luminance moyenne de l'image | contrôle d'avant scan et `quality.avgLum` | ±15 % |
| Couleur de la lumière : L\* et b\* des joues | moyenne Lab des joues (la peau de la personne sert de carte de référence) | écart de 5 |
| Côté : écart joue gauche / joue droite | `Lj` gauche et droite (contour des yeux) | écart de 5 |
| Reflets : part de pixels saturés | contrôle par image (seuil 250) | ±3 points |
| Netteté, distance, angle | laplacien, taille du visage, lacet et inclinaison | indicatifs |
| Heure locale du scan | horodatage | ±2 h |

a\* est volontairement exclu de la comparaison : il porte la mesure des rougeurs, il doit pouvoir changer.

Verdict, en trois couleurs :
- **Comparable** : le point entre dans la courbe.
- **À confirmer** (un écart modéré) : point marqué d'un rond creux sur la courbe.
- **Autre lumière** (gros écart d'intensité, de couleur ou de côté) : le scan reste dans l'historique, **hors courbe**, et **ne compte pas dans le quota** ; on propose de le refaire.

Limite à dire franchement : un bronzage ou une poussée de rougeurs change aussi la couleur des joues. Les seuils doivent être calés sur de vrais tests (même visage, lumière qui change), comme le banc d'équité du 08/10.

Ce contrôle est **gratuit pour tous** : l'honnêteté de la mesure ne se vend pas.

### 2.6 Ce que rapporte un abonné

| | Web (Stripe) | App Store (programme petites entreprises, 15 %) |
|---|---|---|
| 4,49 € TTC/mois | 3,74 € HT − frais (~1,5 % + 0,25 € + 0,7 % de facturation) ≈ **3,40 €** | 3,74 × 0,85 ≈ **3,18 €** |
| 34,99 € TTC/an | 29,16 € HT − frais ≈ **28,10 €/an** (2,34 €/mois) | 29,16 × 0,85 ≈ **24,80 €/an** |

Frais Stripe : tarif standard des cartes européennes, à vérifier sur le compte. Les 0,25 € fixes pèsent lourd sur un petit montant mensuel : c'est un argument de plus pour pousser l'annuel.

### 2.7 Ce qu'il faudrait construire (pour chiffrer, pas à faire maintenant)

- Supabase : `profiles` (lié à l'authentification), `user_scans` (domaine, scores, empreinte de lumière, qualité, date ; **pas de colonne image**), `user_products` (produit proposé, étape, date, cliqué, « j'utilise »), `subscriptions` (identifiants Stripe, statut, fin de période), `referrals`. Sécurité ligne par ligne : chacun ne lit que ses lignes.
- Stripe : deux prix (4,49 €/mois, 34,99 €/an), Stripe Tax, portail client pour la résiliation, webhook qui met `subscriptions` à jour.
- Le projet Supabase était en pause sur l'offre gratuite (mémoire du 16/09, réveil automatique depuis). À vérifier avant de bâtir dessus.

---

## 3. Recommandation B2B

### 3.1 En dix lignes

1. **Lien dans le menu** : « **Pro** », en petites capitales, gris clair, avec un point doré, juste avant le sélecteur Peau / Cheveux / Aliment. Sur téléphone, premier élément du menu burger, en doré.
2. Il mène à une nouvelle page **vyvre.fr/pro**. /marques et /pricing restent en ligne, telles quelles (liens Stripe en mode réel non touchés).
3. **À qui** : marques de soin (cœur de cible : les maisons premium plus petites que les grands groupes), marques capillaires (le moteur cheveux existe), instituts et pharmacies (QR code au comptoir). Nutrition et compléments : plus tard, et avec prudence (allégations santé encadrées).
4. **Quoi, ce qui existe** : la page à son nom (/m/<marque>), le widget en une ligne (`widget.js`), la marque blanche, 12 langues, aucune photo conservée.
5. **Quoi, réaliste à court terme** : le mode comptoir (QR code, rien à acheter), la présence « Partenaire » dans le scan grand public, signalée comme telle.
6. **Quoi, à construire avant de le vendre** : le tableau de bord (aujourd'hui `/dashboard` renvoie une page introuvable) et les données agrégées (rien n'écrit encore dans la table `scans`).
7. **Comment le montrer sans dévoiler les moteurs** : vendre des résultats et des faits vérifiables (8 mesures, 10 s, 0 photo, 12 langues, 48 h), montrer l'expérience de la cliente, jamais les mots « CIE Lab », « repères », « Gabor » ni la bibliographie sur la page Pro (ils restent sur /accuracy pour qui veut vérifier).
8. **Prix** : un seul prix d'appel sur la page Pro (« 30 jours offerts, puis à partir de 299 € HT par mois »), un lien discret vers la grille, « sur rendez-vous » pour les grandes maisons. Bouton principal : « Demander une démonstration ».
9. **Direction préférée** : A « Atelier » pour l'image, avec le téléphone animé de C « Vitrine » au milieu. B « Observatoire » seulement quand le tableau de bord existera vraiment.
10. **À corriger sur /pricing avant de relancer des marques** : le tableau qui chiffre les concurrents (§ 4.6) et les liens morts vers `/dashboard`.

### 3.2 Offre par cible

| Cible | Ce qu'on vend | Existe ? |
|---|---|---|
| Marque de soin | Page /m/<marque>, widget sur le site, marque blanche, ses soins seulement | Oui |
| Marque capillaire | Même chose avec le scan cheveux (`/m/:brand/cheveux` existe déjà en réécriture) | Oui, à mettre en avant |
| Institut, spa | QR code en cabine ou à l'accueil, liste de soins de l'institut | Réaliste (c'est le web, sur le téléphone de la cliente) |
| Pharmacie, parapharmacie | QR code au rayon, catalogue multi-marques du point de vente | Réaliste, demande un catalogue par magasin |
| Nutrition, compléments | Présence dans le parcours Aliments | Plus tard : le parcours propose des aliments, pas des compléments ; les allégations santé sont encadrées (règlement (CE) 1924/2006) |
| Tous | Données agrégées et anonymes (préoccupations, saisons, pays, soins choisis) | **Non** : à construire, avec un seuil (aucun chiffre sous 50 personnes) |
| Tous | « Partenaire » dans le scan grand public | À construire, avec mention visible et règle de classement publiée (§ 4.5) |

### 3.3 Prix publics ou démonstration

| Option | Pour | Contre |
|---|---|---|
| Tout public (aujourd'hui) | Rassure les petites marques ; paiement sans échange | Fait « logiciel », pas « maison » |
| **Prix d'appel + démonstration (recommandé)** | Garde la transparence et la vente en libre-service ; laisse la place au rendez-vous | Demande de répondre vite aux demandes |
| Démonstration seule | Très haut de gamme | Perd les marques qui veulent essayer seules ; le pilote gratuit existe déjà |

### 3.4 Le nom du lien

| Nom | Avis |
|---|---|
| **Pro** | Recommandé : court, compris dans les 12 langues, discret, convient aux marques, instituts et pharmacies. |
| Maisons | Le plus élégant, mais obscur pour une pharmacie ou une marque de compléments, et intraduisible tel quel. |
| Espace Pro | Plus visible, mais il attire l'œil des particuliers et dispute la place au scan. |
| Pour les marques | Clair mais long ; reste le libellé du menu burger. |

---

## 4. Points juridiques

### 4.1 RGPD sans photo
- Ne garder aucune image réduit fortement le risque, mais **les scores restent des données personnelles** dès qu'ils sont liés à un compte.
- Certaines mesures (rougeurs, acné, ombres sous les yeux) peuvent être lues comme des **données de santé** (article 9 du RGPD). Par prudence : consentement explicite et séparé à la création du compte, finalité écrite (« suivre l'évolution de vos mesures »), **analyse d'impact (AIPD)**, hébergement dans l'Union européenne, suppression du compte en un clic avec effacement réel.
- Le visage n'est pas une donnée biométrique au sens du RGPD tant qu'il ne sert pas à **identifier** la personne. C'est le cas ici : à écrire noir sur blanc dans la politique de confidentialité.
- Mineurs : le public TikTok est jeune. En France, le consentement seul vaut à partir de 15 ans pour ces services ; en dessous, accord parental. Prévoir une question d'âge à la création du compte et pas de ciblage des mineurs pour le Premium.
- Données B2B : seulement des agrégats, avec un seuil minimal, sans identifiant de personne ; un DPA existe déjà (`/dpa`).
- Cohérence : retirer la vignette du visage de `vyvre-tracker.js`, ou dire clairement qu'elle reste sur le téléphone.
- Sources : [article 9 RGPD](https://gdpr-text.com/fr/read/article-9), [ANS, protection des données de santé](https://esante.gouv.fr/sites/default/files/media_entity/documents/la-protection-des-donnees-de-sante.pdf).

### 4.2 Résiliation en un clic
- Loi n° 2022-1158 du 16 août 2022 et **décret n° 2023-417 du 31 mai 2023**, en vigueur depuis le 1er juin 2023 (mise en conformité au 1er septembre 2023) : une fonction « résilier votre contrat » facile d'accès depuis l'espace en ligne, avec confirmation. Chemin proposé : Compte › Abonnement › Résilier ([Blog du Modérateur](https://www.blogdumoderateur.com/resilier-contrat-en-ligne-septembre-2023), [Deloitte Avocats](https://blog.avocats.deloitte.fr/la-resiliation-en-3-clics-nouvel-outil-au-service-des-consommateurs/)).
- Droit de rétractation de 14 jours : pour un abonnement qui démarre tout de suite, prévoir l'accord exprès de la personne ; le plus simple est de rembourser sur demande pendant 14 jours.
- L'essai de 7 jours sans carte évite le piège classique de l'essai qui se transforme en paiement.

### 4.3 TVA
- Prix affichés **TTC** au grand public. 4,49 € TTC = 3,74 € HT en France (20 %).
- Services numériques vendus à des particuliers d'autres pays de l'UE : TVA du pays de l'acheteur via le **guichet unique (OSS)** au-delà de 10 000 € de ventes hors de France par an. Stripe Tax le calcule.
- B2B : prix HT, autoliquidation pour un client européen avec numéro de TVA.

### 4.4 App Store contre web
- Aujourd'hui vyvre est un site (avec un manifeste d'appli web) : **vendre sur le web avec Stripe** garde ~3,40 € par mois au lieu de ~3,18 €, et laisse libre de la politique de prix.
- Si une appli native sort plus tard, Apple impose son système de paiement pour un abonnement vendu dans l'appli, avec des assouplissements partiels dans l'UE (liens externes, mais frais encore contestés par la Commission) : [TechRepublic](https://www.techrepublic.com/article/news-apple-eu-fees-digital-markets-act/), [Adapty](https://adapty.io/blog/markdown/alternative-payments-in-the-app-store.md). Une appli peut en revanche donner accès à un abonnement acheté ailleurs (règle « multiplateforme »).

### 4.5 Marques payantes dans les résultats
- Un classement influencé par un paiement doit être **signalé** (« Partenaire » ou « Sponsorisé ») et les critères de classement doivent être expliqués (Code de la consommation, article L. 111-7, et directive « Omnibus » 2019/2161).
- Règle proposée : un produit partenaire n'apparaît que s'il convient à la peau ; à pertinence égale, il passe devant ; la mention est visible.

### 4.6 Autres risques repérés
- **Le mot « diagnostic »** : un logiciel qui prétend diagnostiquer peut tomber sous le règlement européen sur les dispositifs médicaux (2017/745). À l'écran, dire « analyse » ou « lecture », garder « résultat indicatif, non médical ».
- **/pricing chiffre les concurrents** (« SkinConsult AI ~50 000 € », « Perfect Corp ~30 000 € »). Une publicité comparative doit être objective et vérifiable (Code de la consommation, L. 122-1). Or Perfect Corp affiche un libre-service à ¥26 100 par licence et par mois, bien loin de 30 000 €. Et « le seul module entièrement français » n'est pas démontrable. À retirer ou à sourcer.
- **Accessibilité** : l'European Accessibility Act s'applique depuis le 28 juin 2025 aux services de commerce en ligne destinés aux particuliers (les microentreprises de services en sont exemptées). Le parcours d'abonnement doit être utilisable au clavier et au lecteur d'écran.

---

## 5. Décisions pour Charles (questions fermées)

1. Prix annuel à 34,99 € : oui ou non ?
2. Offre de lancement à 29,99 € la première année pour les premiers abonnés : oui ou non ?
3. Règle du gratuit : « 1 par jour, peau 2, cheveux 1, aliments 2 par semaine » (recommandée) ou ta règle « pas deux jours de suite le même domaine » ?
4. Essai de 7 jours sans carte à la création du compte (recommandé) ou pas d'essai ?
5. Parrainage « un mois offert à chacun » : oui ou non ?
6. Floutage : ne pas flouter le matin et réserver le soir au Premium (recommandé), ou tester tes 2 sur 4 en A/B ?
7. Direction Premium : A Verre, B Instrument ou C Film ?
8. Direction Pro : A Atelier, B Observatoire, C Vitrine, ou A avec le téléphone de C (recommandé) ?
9. Nom du lien : « Pro » (recommandé), « Maisons » ou « Espace Pro » ?
10. Prix B2B : un prix d'appel + démonstration (recommandé), tout public, ou démonstration seule ?
11. Retirer la vignette du visage de l'historique local (`vyvre-tracker.js`) : oui ou non ?
12. Retirer de /pricing le tableau des prix concurrents : oui ou non ?
13. Remplacer « diagnostic » par « analyse » partout à l'écran : oui ou non ?
14. Ouvrir des emplacements « Partenaire » signalés dans le scan grand public : oui ou non ?
15. Construire le tableau de bord marques (`/dashboard`) avant toute relance B2B : oui ou non ?
