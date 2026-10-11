# Audit acné / imperfections dans le scan de peau (11/10/2026)

Périmètre : questions avant le scan (`public/scan/avant/`), résultats du scan (`public/scan/index.html`),
cerveau de choix (`public/scan/vy-choix.js`), protocole complet (`public/scan/PROTOCOL_UNIVERSAL.html`),
pages de marque (`public/m/index.html`), moteur de mesure v10.13 (lu, non modifié), catalogue local
`public/scan/catalogue/all.json` (5 831 produits, 151 marques ; le chiffre « 1 863 » est celui de l'ancien
catalogue de juin, cité dans `catalogue-v2/SCORES_METHODE.md`).

Banc d'essai : `vy-choix.js` chargé dans Node avec le vrai catalogue, même enchaînement que `/scan`
(filtre des préférences, `rituel`) puis le protocole (`soir`, réponse « peau » du protocole). Vérifié ensuite
en Chrome headless sur les vraies pages (scores injectés).

---

## 1. La question : peut-on dire « acné » avant le scan ? (AVANT : NON)

L'écran « Avant votre scan » (`scan/avant/dictee-wow.js`, libellés dans `scan/avant/langues.js`, 12 langues)
propose 8 objectifs : anti-âge, éclat, hydratant, apaisant, affinant les pores, anti-taches, matifiant,
contour des yeux. **Aucun choix acné, boutons ou imperfections.**

- La personne qui a des boutons choisit au mieux « Affinant les pores » ou « Matifiant ».
- Incohérence de libellés : le même objectif `pores` s'affiche « Affinant les pores » sur l'écran des
  questions, mais « Imperfections, pores » dans la barre de résumé des résultats et dans le questionnaire
  du protocole (`g.pores` dans `scan/i18n/*.js`). On promet « imperfections » sans rien faire de spécial.
- Le protocole ne garde que les objectifs qu'il connaît (`GOAL_SEV`) : un nouvel objectif non déclaré
  y serait silencieusement jeté.

## 2. La détection quand la personne ne dit rien (AVANT : AUCUNE)

- `vy-choix.js` ne déduit rien : il prend les 3 points faibles parmi les 8 mesures et choisit dessus.
- Le moteur contient un détecteur `clinical.acne` (v10.0, `detectAcne`) : pixels « a* > 20 et L < 60 »
  regroupés par paquets de 16 pixels dans l'ordre de lecture. **Inutilisable** : le seuil absolu L < 60
  vise d'office les peaux foncées, les « paquets » ne sont pas des zones du visage, et il n'a jamais été
  validé. Il n'est lu par aucune page. On ne s'en sert pas.
- Ce que le moteur mesure honnêtement et qui touche au terrain acnéique : le **sébum** (reflets de la
  zone T, relatif à la peau de la personne, 10 à 75) et les **pores** (points sombres comptés, 35 à 85,
  valeur neutre 62 quand ils ne sont pas lisibles). Les rougeurs sont une moyenne a* des joues
  (diffuse), pas des rougeurs localisées : elles ne disent pas « bouton ».
- Le scan ne voit pas les boutons. Une déduction ne peut donc être qu'un **terrain à tendance
  acnéique** (peau grasse, pores visibles), jamais un diagnostic d'acné.

## 3. Les produits qui sortent aujourd'hui (AVANT)

Scores injectés (sébum et taches : haut = problème ; les autres : bas = problème). Sans choix « acné »,
on simule la personne qui prend l'objectif le plus proche (« pores » + un second). Matin = les 4 soins du
scan (repris tels quels par le protocole) ; soir = le protocole complet.

| Profil | Scores principaux | Objectifs simulés |
|---|---|---|
| A. Grasse à imperfections | sébum 78, pores 35, rougeurs 62, âge < 25 | pores + matifiant |
| B. Mixte, imperfections et rougeurs | sébum 66, pores 40, rougeurs 38 | pores + apaisant |
| C. Sèche à imperfections (traitement asséchant) | sébum 30, pores 45, hydratation 30 | pores + hydratant |
| D. Mature, acné de l'adulte | sébum 62, pores 42, rides 50, fermeté 52, âge 45-54 | pores + anti-âge |
| E. Peau foncée, taches après les boutons | sébum 64, pores 42, taches 68 | pores + anti-taches |

### Constat avant correction

| Profil | Matin (scan) | Soir (protocole) | Verdict |
|---|---|---|---|
| A | Neutrogena Oil-Free Acne Wash · INKEY 20 % Niacinamide · Mixa Gelée Matifiante Anti-Imperfections · Garnier Fluide anti-imperfections SPF 50+ | Medicube **huile** démaquillante · Codage Sérum BHA (fort) · Decléor **Baume de nuit** (texture riche) | Matin juste. Soir faux : huile démaquillante et baume riche sur une peau grasse à boutons. |
| A sans objectif | Novexpert Mousse **Éclat vitamine C** · Orlane Niacinamide · Yon-Ka Nude Perfect · Garnier SPF 50+ | TIRTIR **baume** démaquillant · INKEY Niacinamide · Decléor **Baume de nuit** | Nettoyant hors sujet, deux baumes le soir. |
| B | Torriden gel nettoyant · Cetaphil sérum post-acné · Murad Calm & Recover · Avène Fluide anti-imperfection SPF 50 | SVR Sebiaclear micellaire · TIRTIR **acide azélaïque 12 %** · Mixa Gelée matifiante | Juste (règle des rougeurs respectée : ni BHA ni vitamine C). |
| C | Medicube mousse PDRN · NIVEA sérum purifiant · INKEY Blemish Clearing Moisturizer · Olay SPF 30 | BYOMA **baume** démaquillant · Fenty sérum éclat · Klairs crème | Moyen : rien de ciblé le soir, baume. |
| D | Mediheal nettoyant · COSRX bakuchiol · Torriden crème fermeté · Sisley SPF 50+ | mixsoon **baume** collagène · Olay sérum · Murad crème rétinol (fort) | Anti-âge juste, l'imperfection n'est traitée par rien de précis ; baume démaquillant. |
| E | Medicube gel kojique · Fenty niacinamide · Decléor fluide argile · Garnier SPF 50+ | NIVEA micellaire **BHA** (fort) · 111SKIN sérum taches · Beauty Pie azélaïque 10 % | Plutôt juste ; l'actif fort part dans une eau micellaire. |

Défauts relevés :
1. Pas de choix « acné », pas de déduction : le choix suit seulement les points faibles.
2. **Textures riches et huiles** retenues le soir pour des peaux grasses à boutons (baumes démaquillants,
   baume de nuit, huile démaquillante). Rien ne les écarte.
3. Les **gommages à grains** ne sont écartés qu'indirectement (comptés comme « actif fort »).
4. Les **médicaments** ne sont pas écartés par une règle : le catalogue contient du peroxyde de benzoyle
   sous nom commercial (Neutrogena On-The-Spot, Rapid Clear Stubborn Acne Spot Gel, catégorie
   « autre-visage », jamais choisie aujourd'hui, mais rien ne l'interdit si la catégorie change).
5. Aucune phrase d'orientation vers un médecin.
6. Les règles existantes sont bien respectées partout : un seul actif fort, aucun avec rougeurs,
   jamais de vitamine C avec rougeurs, SPF ≥ 30, pas de photo fond plein.

## 4. Ce qu'est un bon choix acné (sources)

Références :
- AAD : Reynolds RV et al., *Guidelines of care for the management of acne vulgaris*, J Am Acad Dermatol
  2024;90(5):1006.e1-e30 ; et la fiche grand public AAD « Acne: tips for managing » (nettoyant doux deux
  fois par jour, ne pas frotter, produits non comédogènes, protection solaire, 6 à 8 semaines d'attente).
- Europe : Nast A et al., *European evidence-based (S3) guideline for the treatment of acne – update 2016*,
  J Eur Acad Dermatol Venereol 2016;30:1261-1268.
- SFD : *Traitement de l'acné par voie locale et générale*, recommandations de bonne pratique, Société
  Française de Dermatologie, 2015.
- Dermocosmétique et acné : Araviiskaia E, Dréno B, *The role of topical dermocosmetics in acne vulgaris*,
  JEADV 2016;30:926-935 ; Dréno B et al., *Adult female acne: a new paradigm*, JEADV 2013;27:1063-1070.
- Niacinamide : Shalita AR et al., Int J Dermatol 1995;34:434-437 (gel 4 % comparable à la clindamycine 1 %).
- Zinc : Cervantes J et al., *The role of zinc in the treatment of acne*, Dermatol Pract Concept 2018;8:e2018ADR.
- Comédogénicité : Draelos ZD, DiNardo JC, *A re-evaluation of the comedogenicity concept*, JAAD
  2006;54:507-512 (le test d'oreille de lapin surestime ; c'est le produit fini qui compte).
- Taches après les boutons sur peau foncée : Davis EC, Callender VD, *Postinflammatory hyperpigmentation*,
  J Clin Aesthet Dermatol 2010;3(7):20-31 (photoprotection, éviter l'irritation, acide azélaïque, niacinamide).
- Règlement cosmétique européen (CE) 1223/2009 : acide salicylique limité (2 % dans la plupart des soins) ;
  peroxyde de benzoyle interdit en cosmétique hors ongles artificiels (en France, c'est un médicament).

Critères retenus :
- **Nettoyant doux, non décapant**, sans grains. Pas d'huile ni de baume démaquillant pour une peau à
  boutons (prudence : les huiles rincées sont discutées, mais « baumes et huiles » sont la consigne).
- **Actifs cosmétiques utiles en vente libre** : acide salicylique (BHA), niacinamide, acide azélaïque à
  dose cosmétique, zinc, rétinal ou rétinol doux le soir. Niveau de preuve : correct pour niacinamide,
  BHA (recommandation conditionnelle AAD 2024), azélaïque ; plus faible pour le rétinol cosmétique
  (les preuves fortes portent sur les rétinoïdes médicaments).
- **Crème légère non comédogène** ; pour la peau sèche à boutons (souvent après un traitement
  asséchant), une crème hydratante légère, sans matifiant ni argile ni alcool en tête.
- **SPF non comédogène** (fluide), au moins 30.
- **À éviter** : baumes riches, huiles, beurre de karité ou occlusifs en tête de liste, gommages à grains,
  alcool en tête de liste, cumul d'actifs forts (un seul par routine, règle déjà en place).
- **Rougeurs** : pas de BHA, pas de rétinoïde, pas de vitamine C (règle existante, cohérente avec la
  prudence des recommandations sur les peaux irritables) ; l'acide azélaïque et la niacinamide restent
  possibles (bien tolérés, utiles à la fois sur les boutons et les rougeurs).
- **Médicaments** (peroxyde de benzoyle, adapalène, trétinoïne, isotrétinoïne, antibiotiques) : jamais
  proposés. Une phrase oriente vers un médecin ou un dermatologue pour une acné douloureuse,
  inflammatoire, avec cicatrices ou qui dure.

---


## 5. Corrections faites (un seul cerveau : `vy-choix.js`)

Sauvegardes : `~/Documents/vyvre-backups/*.avant-acne-scan-2026-10-11`.

- **`scan/vy-choix.js`** (v=2)
  - Objectif `acne` (pèse sur les pores, pas sur le sébum : une peau sèche peut avoir des boutons).
  - `profilAcne(scores, goals)` : « declare » si l'objectif est choisi ; « deduit » si sébum ≥ 60 ET
    pores ≤ 50 ET mesure des pores réellement lue (`analyses.pores.neutre` absent ; la valeur neutre 62
    ne déclenche jamais). Le détecteur `clinical.acne` du moteur n'est pas utilisé (biais de teint).
  - Peau sèche à boutons : sébum < 45 (scan) ou « peau sèche » (protocole) → pas de matifiant, d'argile
    ni d'alcool, et **aucun actif fort** (souvent déjà sous traitement asséchant).
  - `acneOk` écarte : catégorie huile, baume / balm / rich / butter / huile / oil dans le nom (sauf
    « oil-free », « non comédogène », « oil control »), « texture riche » dans le nom, karité ou
    occlusifs dans les 5 premiers ingrédients, plusieurs huiles végétales en tête, gommages à grains,
    alcool en tête de liste ; « texture riche » de la description seulement au premier passage (et
    jamais pour une peau sèche). Si rien ne passe, l'étape reste vide plutôt qu'un baume.
  - `acneAtout` classe vers l'avant : nom acné / imperfections / gammes dermo (Effaclar, Sébiaclear,
    Cleanance, Normaderm, Sébium, Keracnyl, Hyséac), raison « anti-imperfections », BHA, niacinamide,
    zinc, azélaïque, tea tree, rétinal / rétinol, « oil-free / non comédogène ».
  - Le matin : nettoyant doux (un nettoyant exfoliant ou salicylique passe loin derrière), l'actif fort
    est gardé pour le soir. Le soir : le sérum porte l'actif utile (BHA, ou rétinal / rétinol doux ;
    les rétinoïdes « 1 % / max / extreme » passent derrière), sauf rougeurs ou peau sèche.
  - Règles existantes inchangées et vérifiées : un seul actif fort sur la journée, rien de fort ni de
    vitamine C avec des rougeurs, SPF ≥ 30, pas de photo fond plein.
  - Le **repli** (périmètre d'une ou deux maisons) respecte maintenant les mêmes règles : pas de soin
    du soir le matin, pas de SPF < 30, rien de fort ni de vitamine C avec rougeurs, exclusions acné, un seul
    actif fort (défaut antérieur trouvé par le contrôle automatique, voir section 6).
  - **Jamais un médicament**, pour tout le monde : peroxyde de benzoyle, adapalène, trétinoïne,
    isotrétinoïne, clindamycine, érythromycine (nom), plus les deux fiches Neutrogena au peroxyde de
    benzoyle qui ne le disent pas dans leur nom.
- **`scan/avant/dictee-wow.js` + `scan/avant/langues.js`** (v=7, `avant/index.html` v=7) : choix
  « Boutons, acné » dans les 12 langues, juste après « Affinant les pores » (phrase : « Cherchez-moi un
  soin anti-imperfections »).
- **`scan/i18n/*.js`** (12 langues ; `vy-i18n.js` charge maintenant `?v=32`, et `vy-i18n.js?v=32`
  partout où il est chargé) : `g.acne` (« Boutons, acné »), `ac.med` (la phrase médicale), et `g.pores`
  devient « Pores » (il disait « Imperfections, pores » sans rien faire de spécial).
- **`scan/index.html`** : passe les objectifs au cerveau (`goals`), les cibles viennent de
  `VyChoix.cibles` (plus de copie locale), résumé « Boutons, acné », et sous les 4 soins la phrase
  « Boutons douloureux, cicatrices ou acné qui dure : un médecin ou un dermatologue peut vous aider. »
  seulement si l'acné est déclarée ou déduite.
- **`scan/PROTOCOL_UNIVERSAL.html`** : `acne` accepté dans les préférences (avant, un objectif inconnu
  était jeté), choix « Boutons, acné » dans son questionnaire (9 objectifs, 3 par ligne), libellé du
  récapitulatif, et la même phrase médicale dans le périmètre. Le matin reste le rituel du scan,
  le soir profite de la même lecture acné (même cerveau).
- **`m/index.html`** (pages de marque) : même lecture déduite (pas de questions sur ces pages) et même
  phrase médicale.

## 6. Constat après correction

Mêmes scores. « Déclarée » = la personne choisit « Boutons, acné » ; « déduite » = elle ne dit rien.
Le matin du protocole est exactement le rituel du scan (source « scan » vérifiée en Chrome headless).

| Profil | Matin (scan, 4 soins) | Soir (protocole) | Verdict |
|---|---|---|---|
| A grasse, déclarée | Fenty Cherry Dub gel nettoyant (niacinamide) · INKEY 20 % Niacinamide · Mixa Gelée Matifiante Anti-Imperfections · Garnier Fluide anti-imperfections SPF 50+ | SVR Sébiaclear micellaire · Dermalogica Clearing Serum (BHA + niacinamide, le seul actif fort) · La Roche-Posay Effaclar correcteur sébum et pores | Juste. Plus de baume ni d'huile. |
| A grasse, déduite | Fenty Cherry Dub · Cattier Sérum anti-imperfections · SVR Sébiaclear Mat+Pores · Garnier SPF 50+ | Avène Cleanance micellaire · Dermalogica Clearing Serum (fort) · Mixa Gelée matifiante | Juste. |
| B mixte + rougeurs (déclarée ou déduite) | La Mer Lait nettoyant apaisant · Cetaphil Gentle Clear sérum post-acné · Mixa Gelée matifiante · Avène Fluide anti-imperfection SPF 50 | SVR Sébiaclear micellaire · The Ordinary Sérum équilibrant (azélaïque) · Novexpert Fluide Pureté (azélaïque) | Juste : ni BHA, ni rétinoïde, ni vitamine C ; azélaïque et niacinamide. |
| C sèche à boutons, déclarée | Cetaphil Daily Facial Cleanser · TIRTIR Niacinamide 20 % · INKEY Blemish Clearing Moisturizer · Olay Total Effects SPF 30 | Torriden eau nettoyante · Fenty Dew N Plump sérum hydratant · Klairs Midnight Blue crème | Juste et sobre : aucun actif fort, aucun matifiant, aucun baume. |
| C sèche, rien déclaré | (inchangé : pas de terrain gras, rien n'est déduit) | (inchangé) | Le scan ne peut pas deviner des boutons sur peau sèche : il faut le dire. |
| D mature, déclarée | Sulwhasoo mousse au ginseng · Medicube Zero Pore sérum peptides · Torriden Cellmazing crème fermeté · Ducray Keracnyl UV fluide | SVR Sébiaclear micellaire · Youth To The People Rétinal + Niacinamide (fort) · Olay Age Defying crème de nuit | Juste : le rétinal du soir sert à la fois les boutons et les rides. |
| D mature, déduite | Novexpert Gelée moussante Peau Nette · Olay Niacinamide MAX · Melvita Fluide liftant matifiant · Uriage Hyséac fluide matifiant SPF 50+ | SVR · Youth To The People Rétinal (fort) · Clarins crème de nuit Premières Rides (niacinamide) | Juste. |
| E foncée + taches, déclarée | Horace nettoyant purifiant (zinc) · Fenty Fat Water niacinamide · Mixa Gelée matifiante · Garnier SPF 50+ | SVR · Seasonly Sérum Imperfections (fort) · La Roche-Posay Effaclar correcteur | Juste. |
| E foncée, déduite | Horace · Medicube TXA + Niacinamide (taches) · Mixa · Garnier SPF 50+ | SVR · Seasonly Sérum Imperfections · La Roche-Posay Effaclar | Juste ; SPF 50 quotidien, priorité pour les taches après les boutons. |

Contrôles automatiques (600 profils tirés au hasard, 5 univers × 7 origines, avec ou sans acné) :
aucun médicament, aucun deuxième actif fort, rien de fort ni de vitamine C avec rougeurs, aucun SPF < 30,
aucune photo fond plein, aucune texture riche pour une peau à boutons, aucun actif fort pour une peau
sèche à boutons. Ce contrôle a trouvé un défaut **antérieur** : quand le périmètre ne compte qu'une ou deux
maisons (luxe + Corée = Sulwhasoo seul, quotidien + Corée, luxe + Royaume-Uni, petit prix + Europe), le
rituel tombait dans un « repli » qui ignorait toutes les règles (deux rétinoïdes, vitamine C avec rougeurs,
soins de nuit le matin, SPF 15). Corrigé : le repli garde les mêmes règles.
Résultat chiffré sur les mêmes 600 profils : 31 écarts aux règles avant, **0 après** ; étapes du soir
restées vides faute de produit dans le périmètre : 18 avant, 18 après (les exclusions acné n'en ajoutent
aucune).

Vérification en Chrome headless (son coupé, scores injectés, serveur local 8766) : les 5 profils,
déclarés et non déclarés, sur `/scan` puis le protocole (matin repris tel quel, source « scan »), les
pages de marque La Roche-Posay, Caudalie, The Ordinary et Sisley (terrain acnéique et peau normale :
la phrase n'apparaît que dans le premier cas), l'écran des questions en français, anglais, japonais et
arabe, et 390 px de large. Aucune erreur JavaScript ; les seuls messages réseau sont les 404 déjà
existants de la sonde d'image `cutout-u` du protocole et de `favicon.ico`.

## 7. Ce qui manque dans le catalogue (rien n'a été fabriqué)

Compte des produits montrables **adaptés** (passent les exclusions et visent vraiment les imperfections :
nom, raison « anti-imperfections » ou actif utile), par étape. Catalogue local, 5 831 produits.

| Univers | Maisons | Nettoyant | Sérum | Crème | SPF |
|---|---|---|---|---|---|
| Luxe | 41 | 42 (24 maisons) | 33 (21) | 26 (15) | **0** |
| Quotidien | 46 | 59 (29) | 65 (27) | 44 (28) | 11 (9) |
| Petit prix | 36 | 88 (27) | 78 (30) | 60 (26) | 16 (7) |
| Pharmacie | 28 | 37 (19) | 36 (21) | 43 (17) | 23 (11) |

| Origine | Maisons | Nettoyant | Sérum | Crème | SPF |
|---|---|---|---|---|---|
| France | 57 | 74 | 54 | 78 | 18 |
| Corée | 22 | 54 | 57 | 42 | **4** |
| États-Unis | 34 | 53 | 50 | 31 | 18 |
| Europe (hors France) | 18 | 20 | 24 | 16 | 8 |
| Royaume-Uni | 10 | 9 | 18 | 5 | **1** |
| Japon | 7 | 14 | **3** | **0** | **0** |
| Australie | 2 | 2 | 1 | 1 | 1 |
| Canada (The Ordinary) | 1 | 0 | 5 | 0 | 0 |

Trous constatés en faisant tourner le profil « peau grasse à boutons » dans chaque combinaison :
- **Luxe : aucun SPF pensé pour les peaux à boutons.** Le rituel prend un SPF de luxe qui passe les
  exclusions (texture non riche) mais n'est pas ciblé. Maisons qui combleraient : Dr. Dennis Gross,
  Sunday Riley, Kate Somerville, Peter Thomas Roth (gammes imperfections), et côté solaire luxe des
  fluides matifiants (à vérifier marque par marque avant d'ajouter).
- **Japon** : rien de ciblé en crème et en SPF ; « petit prix + Japon » (Hada Labo, Senka) et
  « pharmacie + Japon » (Curel) donnent un rituel sans aucun produit imperfections. Maisons
  manquantes : Rohto (Mentholatum Acnes, Melano CC), Kao Biore UV (solaires fluides), Shiseido
  pharmacie / d program.
- **Corée** : bien fourni en nettoyants et sérums, très peu de SPF ciblés ; luxe coréen = Sulwhasoo
  seul. Maisons qui combleraient : Round Lab, Isntree, Some By Mi, Dr.G.
- **Royaume-Uni** petit prix et quotidien : 3 produits seulement dans certains croisements (le rituel
  tombe à 3 soins). The INKEY List et Medik8 portent tout ; manquent par exemple Byoma (gamme
  imperfections), Garden of Wisdom, Revolution Skincare.
- **Europe (hors France), quotidien** : soir peu ciblé (Comfort Zone, Rituals, Collistar).
- **Pharmacie France** : très bien couverte (La Roche-Posay Effaclar, Avène Cleanance, Bioderma
  Sébium, SVR Sébiaclear, Ducray Keracnyl, Uriage Hyséac, Caudalie, Novexpert).

## 8. Ce qui reste incertain

- **La déduction est un terrain, pas un diagnostic.** Le scan ne voit pas les boutons. Seuils sébum ≥ 60
  et pores ≤ 50 posés à partir de l'échelle du moteur, non calés sur de vrais testeurs ; une peau grasse
  à pores visibles sans boutons reçoit aussi un rituel « imperfections » (sans danger : ce sont les
  conseils AAD pour peau grasse) et la phrase médicale. À recaler avec des testeurs de tous teints.
- **Peau sèche à boutons non déclarée** : rien n'est déduit (le sébum est bas). Il faut le choix.
- **Le catalogue servi n'a pas la liste d'ingrédients.** Actifs forts, alcool et huiles sont lus dans le
  nom et les 6 « raisons » de chaque fiche. Exemple : la Mixa Gelée Matifiante a l'alcool en 3e position
  et de l'acide salicylique en 18e (liste dans `catalogue-v2/sortie/mixa.json`) ; l'alcool n'apparaît
  pas dans ses raisons, elle reste donc choisie. L'acide salicylique en 18e position reste sous le seuil
  « fort » existant (rang ≤ 15). Prochaine étape conseillée : faire porter à `all.json` trois drapeaux
  calculés par `catalogue-v2/fusion_scores.py` (alcool dans les 5 premiers, acide exfoliant et rang,
  huiles ou beurres dans les 5 premiers). La moitié des fiches seulement a une liste d'ingrédients.
- **Huiles démaquillantes** : écartées par prudence (consigne « baumes et huiles ») ; les huiles rincées
  ne sont pas clairement comédogènes dans la littérature.
- **Concentrations** : plusieurs niacinamides à 10-20 % sont retenues ; les études portent surtout sur
  4-5 %. Les rétinoïdes « 1 % / max / extreme » passent derrière mais ne sont pas exclus.
- **Rougeurs + boutons** : la règle « rien de fort » écarte le BHA ; l'acide azélaïque et la niacinamide
  prennent le relais. Si les rougeurs sont une rosacée, seul un médecin peut le dire.
- **Les deux produits Neutrogena au peroxyde de benzoyle** sont exclus par leur nom exact ; un autre
  médicament sous nom commercial ne serait repéré que si son nom ou ses raisons le disent (catégorie
  « autre-visage », jamais proposée, ce qui protège aujourd'hui).
- **Pages de marque** : une marque sans gamme imperfections (luxe surtout) peut rendre un rituel
  « déduit acné » peu ciblé ; la phrase médicale s'affiche quand même.
- **Références** : citées de mémoire documentaire, à vérifier avant tout usage public (aucune n'est
  affichée sur le site).
