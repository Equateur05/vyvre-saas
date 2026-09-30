# Règles de recommandation du « scan aliment »

Fichiers liés : `aliments.json` (44 aliments, teneurs CIQUAL 2020, allégations vérifiées), `QUESTIONNAIRE.md` (exclusions), `ETUDE_ALIMENTS_PEAU_LONGEVITE.md` (preuves).

---

## 1. Principe

Le scan mesure des indices optiques. Aucun aliment n'a été testé sur ces indices. L'app propose donc des aliments « pour une alimentation variée qui soutient une peau normale », choisis selon l'indice le plus faible, et affiche honnêtement le niveau de preuve. Elle ne promet jamais que l'indice va changer.

---

## 2. Correspondance indice mesuré -> aliments candidats

Ordre = priorité (grade de preuve peau d'abord, puis pertinence). Les grades sont ceux de `aliments.json`.

| Indice vyvre | Aliments candidats (grade peau) | Ce qui est honnête d'afficher | Message complémentaire obligatoire |
|---|---|---|---|
| Hydratation (image) | eau (C), graines de lin (C), cacao en poudre non sucré (C), noix (C) | « L'eau n'aide la peau que si l'on boit peu. » | « L'hydratation de surface dépend d'abord des soins et de l'environnement. » |
| Éclat | carotte, patate douce, courge butternut, abricot, mâche, épinard, poivron rouge (tous C) | « Les pigments orangés des végétaux se déposent dans la peau ; une étude a relié plus de fruits et légumes à un teint jugé plus sain en 6 semaines. » | Excès : caroténodermie bénigne |
| Rougeurs (a*) | concentré de tomate cuit à l'huile d'olive (B), tomate (C), sardine / maquereau / saumon (C), huile d'olive vierge extra (C) | « Dans de petits essais, 40 à 55 g de concentré de tomate par jour pendant 10 à 12 semaines ont un peu réduit la rougeur provoquée par les UV. » | « Ne remplace jamais une protection solaire. Rougeurs persistantes : parlez-en à un médecin. » Si rosacée (Q8) : conseils déclencheurs |
| Pores / sébum | lentilles, pois chiches, haricots rouges, flocons d'avoine, pain complet (B, via régime à faible charge glycémique) ; graines de courge, huîtres (C, zinc) | « Un régime à faible charge glycémique a réduit les lésions d'acné dans deux essais. » (seulement si Q8 = acné) ; sinon : « féculents complets et légumineuses » sans promesse | Acné sévère : consulter. Ne pas proposer laitiers ni chocolat pour cet indice |
| Uniformité / pigmentation | amande (B, conflit d'intérêts affiché), concentré de tomate (C pour la pigmentation), kiwi / orange / poivron rouge (C) | « Un essai financé par la filière a observé moins de pigmentation chez des femmes ménopausées à peau claire. » | « Contre les taches, la protection solaire reste la première mesure. » Ne jamais utiliser l'allégation cuivre (pigmentation normale) pour un problème de taches |
| Rides / fermeté | amande (B), avocat (B), cacao en poudre non sucré (C), kiwi, poivron rouge, cassis, orange, fraise, chou frisé, brocoli (C, vitamine C), noix (C) | Allégation vitamine C (collagène) quand l'aliment remplit la condition | « Le tabac et le soleil sont les deux premiers facteurs de rides. » |
| Texture / grain | cacao en poudre non sucré (C), noix (C), graines de lin (C), graines de tournesol (C), noisette (C) | « Données limitées. » | |
| Phototype (ITA°) | Aucun aliment | | ITA clair : insister sur la photoprotection ; jamais « mangez X pour protéger votre peau du soleil » |

---

## 3. Algorithme de sélection (4 aliments maximum)

Étape 0. Pré-requis : questions Q1 à Q6 renseignées. Sinon, aucun aliment, seulement les conseils généraux (eau, sommeil régulier, activité).

Étape 1. Signaux d'alerte (section 5) : si présents, afficher d'abord le message de consultation ; ne proposer aucun aliment lié à la maladie évoquée.

Étape 2. Exclusions dures (table de `QUESTIONNAIRE.md`) : allergènes (`allergenes_UE`), latex (avocat, kiwi), grossesse et allaitement (tofu, huîtres, alcool, algues, foie), traitement quotidien (pamplemousse), complément de sélénium (noix du Brésil), maladie rénale (aliments riches en potassium, pas de hausse de protéines), cancer du sein (soja), maladie cœliaque (pain complet, avoine), végétarien/végan, mineur (noix du Brésil, tout protocole restrictif).

Étape 3. Indices prioritaires : les deux indices les plus défavorables du scan (par rapport à la référence d'âge et de phototype déjà utilisée par vyvre). Indice 1 = principal, indice 2 = secondaire.

Étape 4. Score de chaque aliment restant :

- grade peau : A = 3, B = 2, C = 1, D = aliment non proposable pour la peau
- correspondance : +2 si l'aliment cible l'indice principal, +1 s'il cible l'indice secondaire, 0 sinon (un aliment sans correspondance n'est pas retenu)
- saison : +0,5 si le mois courant figure dans `saison`
- allégation UE disponible (`allegation_UE_autorisee` non nul) : +0,5
- anti-répétition : -1 si l'aliment a été proposé lors des deux derniers scans
- précaution pertinente pour le profil (ex. AVK et aliment riche en vitamine K) : -2 (ou exclusion si la règle l'exige)

Étape 5. Diversification (après tri décroissant) :

- au plus 1 aliment par `categorie` (légumineuse, fruit, légume, poisson, fruit à coque, graine, céréale complète, cacao, produit laitier, boisson, matière grasse, soja, fruit de mer, œuf) ;
- au moins 3 catégories différentes quand 4 aliments sont proposés ;
- jamais deux aliments dont le premier nutriment clé est le même (ex. pas kiwi + orange, tous deux « vitamine C ») ;
- au moins un végétal (fruit, légume, légumineuse ou céréale complète) ;
- au plus un aliment de grade C « sans étude cutanée spécifique » (graines de courge, graines de tournesol, chia, myrtille).

Étape 6. Si moins de 4 aliments passent les filtres, en proposer moins. Ne jamais compléter avec un aliment non pertinent.

Étape 7. Protocole longévité (toujours affiché, indépendant du scan, adapté aux réponses Q6, Q9, Q10) :

- Alimentation (PNNS 2019) : 5 fruits et légumes par jour, légumes secs au moins 2 fois par semaine, un féculent complet par jour, une petite poignée de fruits à coque non salés, poisson 2 fois par semaine dont un gras, charcuterie 150 g par semaine maximum, viande hors volaille 500 g par semaine maximum, limiter les ultra-transformés, l'eau comme boisson.
- Alcool : « Moins, c'est mieux ; il n'existe pas de consommation sans risque (OMS 2023). Repère français : 2 verres par jour au maximum et pas tous les jours. » Jamais de conseil de boire.
- Sommeil : au moins 7 heures ; horaires réguliers, y compris le week-end.
- Activité : 150 à 300 minutes d'activité modérée par semaine et 2 séances de renforcement ; objectif progressif de pas (environ 7 000 par jour).
- Tabac : si l'utilisateur fume, message d'aide à l'arrêt (Tabac Info Service, 39 89).
- Jeûne intermittent : non proposé (pas de bénéfice démontré au-delà de la réduction calorique ; risques pour certains profils).

Étape 8. Recettes premium : n'utiliser que des aliments autorisés par le profil ; afficher les 14 allergènes de la recette ; aucune allégation de santé sur la recette elle-même dans la version 1.

---

## 4. Règles de formulation

### 4.1 Ce que l'app peut dire

- « Idées d'aliments pour une alimentation variée » ; « à intégrer dans une alimentation variée et équilibrée et un mode de vie sain » (mention obligatoire dès qu'une allégation est affichée, article 10.2 du Règlement 1924/2006).
- Les allégations autorisées, mot pour mot, uniquement pour l'aliment qui remplit la condition (champ `allegation_UE_autorisee` et `autres_allegations_UE`), avec la quantité quand le règlement l'exige (ex. « effet obtenu avec 30 g de noix par jour »).
- Des faits de composition vérifiés : « 100 g de kiwi apportent environ 80 mg de vitamine C (CIQUAL). »
- Le niveau de preuve, en clair :
  - A : « Preuves solides (plusieurs essais cliniques) »
  - B : « Preuves modérées (au moins un essai clinique, souvent petit) »
  - C : « Preuves limitées (observations ou mécanismes) »
- Le financement quand il existe : « Étude financée par l'Almond Board of California. »
- « Ce que la science ne sait pas encore » : phrase honnête quand le grade est C.

### 4.2 Ce que l'app ne doit jamais dire

- Traiter, soigner, guérir, prévenir, combattre une maladie : acné, rosacée, eczéma, psoriasis, cancer, maladies cardiovasculaires.
- « Anti-âge », « rajeunit », « efface les rides », « anti-taches », « répare la peau », « détox », « booste le collagène », « brûle les graisses », « superaliment ».
- « Votre score va remonter si vous mangez… », « améliore votre indice ».
- Un pourcentage d'étude présenté comme un résultat personnel (« -16 % de rides »).
- « Vous manquez de… », « votre peau a besoin de… », ou toute phrase suggérant qu'on nuit à sa santé en ne mangeant pas l'aliment (article 12.a).
- « Recommandé par un dermatologue / un nutritionniste / un médecin » (article 12.c).
- Toute quantité ou vitesse de perte de poids (article 12.b).
- Toute allégation reformulée (ex. « la vitamine C fabrique votre collagène »).
- L'allégation cuivre « pigmentation normale de la peau » dans le contexte des taches ou de l'uniformité.
- Un diagnostic : « vous avez une rosacée / de l'acné » ; dire plutôt « si vous avez été diagnostiqué(e)… » ou « si ces rougeurs persistent, parlez-en à un médecin ».

### 4.3 Exemple de carte aliment conforme

> **Kiwi** · 1 gros kiwi (100 g) · de novembre à avril
> La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau.
> 100 g de kiwi apportent environ 80 mg de vitamine C.
> Preuves limitées pour un effet visible sur la peau (observations).
> À intégrer dans une alimentation variée et équilibrée et un mode de vie sain.
> Allergie au latex ou au pollen de bouleau : risque de réaction.

---

## 5. Signaux d'alerte : message « consultez un médecin »

Déclencheurs (réponse de l'utilisateur ou texte libre) et message :

| Signal | Message |
|---|---|
| Gonflement des lèvres, de la langue, de la gorge, gêne respiratoire, malaise après avoir mangé | « Urgence : appelez le 15 ou le 112. » (aucun autre contenu) |
| Grain de beauté qui change, saigne, ne cicatrise pas ; lésion qui ne guérit pas en 4 semaines | « Montrez cette lésion à un médecin ou un dermatologue rapidement. » |
| Éruption étendue soudaine, fièvre avec éruption, cloques | « Consultez un médecin sans attendre. » |
| Blanc des yeux jaune | « Consultez un médecin. » (à distinguer de la coloration orangée des paumes liée aux carottes) |
| Acné douloureuse, nodulaire, avec cicatrices, ou apparue brutalement à l'âge adulte | « Un traitement médical existe : parlez-en à un médecin ou un dermatologue. » |
| Rougeurs persistantes avec yeux irrités | « Parlez-en à un médecin. » |
| Eczéma suintant, infecté, ou eczéma d'un nourrisson | « Consultez ; n'éliminez pas d'aliments sans avis médical. » |
| Perte de poids involontaire, fatigue intense, chute de cheveux brutale | « Parlez-en à votre médecin. » |
| Grossesse, maladie rénale, thyroïde, anticoagulant, traitement quotidien | « Tout changement alimentaire important se discute avec votre médecin ou votre pharmacien. » |

---

## 6. Texte d'avertissement (à afficher avant la première utilisation et en bas de chaque écran)

Version longue (écran d'accueil du module, à accepter) :

> Les suggestions d'aliments de vyvre sont des informations générales sur l'alimentation. Elles ne constituent ni un diagnostic, ni un traitement, ni un avis médical ou diététique personnalisé, et ne remplacent pas une consultation. Les indices de votre scan sont des mesures optiques de l'image de votre peau : aucun aliment n'a été étudié pour les modifier, et nous ne promettons aucun résultat. Les aliments proposés s'intègrent dans une alimentation variée et équilibrée et un mode de vie sain. Si vous avez une allergie, une maladie, un traitement en cours, si vous êtes enceinte ou allaitez, ou pour un enfant, demandez l'avis de votre médecin ou de votre pharmacien avant de modifier votre alimentation. En cas de réaction allergique grave (gonflement du visage, gêne respiratoire), appelez le 15 ou le 112.

Version courte (bas d'écran) :

> Information générale, pas un avis médical. À intégrer dans une alimentation variée et équilibrée et un mode de vie sain.

Mention sur les données (au moment du questionnaire) :

> Vos réponses concernent votre santé. Elles servent uniquement à écarter les aliments qui ne vous conviennent pas. Vous pouvez ne pas répondre, les modifier ou les supprimer à tout moment. Elles ne sont jamais utilisées pour de la publicité.

---

## 7. Points à valider avant mise en ligne

1. Juriste : statut des recommandations au regard du Règlement 1924/2006 (communication commerciale), du Règlement 2017/745 (dispositif médical) et de l'hébergement des données de santé ; libellés français exacts sur le registre UE.
2. Médecin ou diététicien diplômé : relecture de la table d'exclusions et des signaux d'alerte.
3. Vitamine A des végétaux : confirmer qu'une allégation « vitamine A » est acceptable pour une provitamine A (bêta-carotène) avant de l'afficher sur carotte, patate douce, courge, abricot, mâche, épinard.
4. Données de saison : valider sur un calendrier officiel (Interfel ou équivalent).
