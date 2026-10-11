# Audit wellness et boissons tendance — 11/10/2026

Demande : « pas que les eaux, aussi tous les trucs wellness (lattes, ube, matcha, laits végétaux…), les bienfaits, les cafés à 100 €, le rooibos, le thé, l'eau de coco ; ce qu'on a oublié d'important pour la peau ».

## Méthode

- Composition : table CIQUAL 2020 de l'ANSES, lue dans le fichier officiel du projet (`_nutrition/generateur_v2/ciqual.xls`), mêmes calculs que les versions précédentes. Quand un produit n'a pas de fiche CIQUAL, aucun chiffre n'est inventé : le produit n'entre pas dans `aliments_v4.json`.
- Allégations : texte français du règlement (UE) n° 432/2012 relu sur EUR-Lex le 11/10/2026. Les deux libellés utilisés ici sont recopiés mot pour mot :
  - « La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau »
  - « Le zinc contribue au maintien d'une peau normale »
  Condition légale : l'aliment doit être au moins « source » du nutriment, soit 15 % de la VNR pour 100 g (7,5 % pour 100 mL pour une boisson), règlement 1169/2011, annexe XIII. Règle VYVRE plus stricte demandée ici : la portion usuelle doit aussi apporter 15 % de la VNR.
- Études : identifiants PubMed contrôlés le 11/10/2026 via NCBI E-utilities (auteur, année, revue, titre, pas de rétractation) ; DOI EFSA contrôlés via Crossref ; page NHS et décision baobab ouvertes le même jour.
- VNR utilisées : vitamine C 80 mg, zinc 10 mg, niacine 16 mg, riboflavine 1,4 mg, potassium 2 000 mg.

## Tableau produit par produit

Légende verdict : ALIMENT = ajouté à `aliments_v4.json` ; RECETTE = latte ou boisson ajoutée à `recettes.json` ; FICHE = carte vrai/faux dans `tendances.json` ; NON = ne pas proposer.

| Produit | Apport réel par portion usuelle (source) | Allégation UE peau | Preuve peau | Précautions | Verdict |
|---|---|---|---|---|---|
| Matcha | Feuille de thé vert moulue bue entière. Pas de fiche CIQUAL. Contient caféine et catéchines (Koláčková 2020, PMID 31832980, composition sans valeur de portion exploitable). | Non | C au mieux, essais contradictoires sur le thé vert (Heinrich 2011 positif, Farrar 2015 et Janjua 2009 négatifs) | Caféine (EFSA 2015 : au plus 200 mg/j pendant la grossesse) ; fer ; jamais d'extrait en gélules (EFSA 2018) ; laits « matcha » du commerce souvent sucrés | RECETTE (latte au lait d'avoine) ; FICHE existante gardée |
| Hojicha | Thé vert torréfié. Pas de fiche CIQUAL. | Non | Aucune étude cutanée | Caféine ; mêmes réserves que le thé vert | RECETTE (latte) + FICHE infusions |
| Rooibos | Infusion : CIQUAL n'a qu'une fiche générique « tisane » (18022), 0,9 kcal, rien de notable. Naturellement sans caféine. | Non | Aucune étude cutanée chez l'humain | Rosacée : boisson chaude à laisser tiédir | RECETTE (rooibos latte) + FICHE infusions |
| Hibiscus (bissap) | Pas de fiche CIQUAL. Infusion : apport nutritionnel négligeable. | Non | Aucune | Fait baisser un peu la tension (McKay 2010, PMID 20018807) : traitement de la tension, avis du pharmacien ; bissap du commerce très sucré | RECETTE (bissap peu sucré) + FICHE infusions |
| Maté | Pas de fiche CIQUAL. Caféine. | Non | Aucune | Caféine ; maté bu très chaud (au-delà de 65 °C) : « probablement cancérogène » pour l'œsophage (CIRC, Loomis 2016, PMID 27318851) | FICHE infusions |
| Thé vert, thé noir | Déjà dans la base (CIQUAL 18155, 18154). | Non | C (thé vert) | Déjà renseignées | Rien à ajouter |
| Café filtre | CIQUAL 18004 : 250 mL = 3,2 mg de niacine (20 % VNR), 375 mg de potassium ; 7 kcal. | Techniquement oui pour une boisson (1,26 mg/100 mL = 7,9 % VNR ≥ 7,5 %), mais teneur variable selon la torréfaction : **non affiché** | Observationnel seulement : plus de caféine, moins de rosacée chez 82 737 infirmières (Li 2018, PMID 30347034) ; pas d'essai | Caféine (EFSA 2015) ; boisson chaude et rosacée | FICHE (café et cafés de luxe) ; pas d'aliment |
| Cafés de luxe (Kopi Luwak, Geisha, Black Ivory) | Même composition qu'un café. | Non | Aucune | Kopi Luwak : civettes en cage, aucune ne remplit les cinq libertés dans 29 plantations visitées à Bali (Lewis-Whelan 2024, PMID 37853780) ; fraudes d'étiquetage fréquentes (Lachenmeier 2021, PMID 34207718) | FICHE ; ne jamais proposer le Kopi Luwak |
| Ube (igname violette) | CIQUAL igname cuite (53503) : 150 g = 1 005 mg de potassium, 5,9 g de fibres, 18 mg de vitamine C (23 % VNR). L'igname est déjà dans la base. | Vitamine C : oui sur l'igname cuite (12,1 mg/100 g = 15 %), mais l'igname reste grade D et hors sélection | Aucune étude cutanée ; les anthocyanes n'ont été testées que chez l'animal | Toujours cuite ; potassium (reins) ; poudres et sirops « ube » sucrés et colorés | RECETTE (ube latte maison) + FICHE |
| Kombucha | CIQUAL 18025 : 9 kcal/100 mL, rien de notable. | Non | Aucune | Souvent non pasteurisé (grossesse, immunodépression) | FICHE existante ; refus de v3 maintenu |
| Eau de coco | CIQUAL 18011 : 250 mL = 500 mg de potassium (25 % VNR), 6 g de sucres, 38 kcal. | Non (potassium : pas d'allégation peau) | Aucune ; pas plus hydratante que l'eau (Saat 2002, PMID 12056182 ; Kalman 2012, PMID 22257640) | Maladie des reins ou médicaments qui retiennent le potassium : un cas mortel d'hyperkaliémie publié (Hakimian 2014, PMID 24550410) | ALIMENT (pour les recettes, hors sélection) + RECETTE + FICHE |
| Boisson d'avoine | CIQUAL 18905 : 250 mL = 0 g de protéines, 12,5 g de sucres (issus de l'hydrolyse de l'avoine, même « nature »), 2,5 mg de calcium si non enrichie. | Non | Aucune | Gluten (avoine, allergène UE) ; choisir enrichie en calcium | ALIMENT (recettes) + RECETTES + FICHE laits végétaux |
| Boisson d'amande | Déjà dans la base (CIQUAL 18107). | Non | Aucune | Fruits à coque | Rien à ajouter |
| Boisson de coco (à boire) | CIQUAL 18907 : 250 mL = 79 kcal, 6 g de sucres, rien de notable. Différente du lait de coco de cuisine (déjà dans la base). | Non | Aucune | Lire l'étiquette (sucres, enrichissement) | ALIMENT (recettes) + RECETTES |
| Boisson de soja enrichie | Déjà dans la base. | Non | Aucune | Soja écarté pour tous par prudence | Rien à ajouter |
| Boisson de riz | CIQUAL 18904 : 250 mL = 0 g de protéines, 14 g de sucres. | Non | Aucune | Arsenic inorganique : « Children under 5 years old should not have rice drinks » (NHS) ; EFSA 2024 | FICHE laits végétaux ; NON comme recette |
| Cacao cru | Le cacao en poudre est déjà dans la base (grade C). « Cru » n'a pas de définition réglementaire. | Non | Les essais portent sur des cacaos standardisés riches en flavanols, pas sur le « cru » | Caféine, théobromine, potassium | Rien à ajouter (fiche chocolat existante) |
| Açaï | Pas de fiche CIQUAL (refus de v3). | Non | Aucune | Bols du commerce très sucrés | FICHE existante « goji et açaï » |
| Acérola | CIQUAL 13404 : 2 850 mg de vitamine C pour 100 g ; 10 g de pulpe (1 à 2 cerises) = 285 mg, 356 % de la VNR. | **Oui**, vitamine C : 3 562 % de la VNR pour 100 g et 356 % par portion | C : intérêt déduit de la composition (Pullar 2017 ; Cosgrove 2007) | Fortes doses régulières de vitamine C et calculs rénaux chez l'homme (Thomas 2013, PMID 23381591, compléments) ; poudres souvent coupées de maltodextrine | ALIMENT (sans photo, hors sélection principale pour l'instant) + RECETTE |
| Camu camu | Pas de fiche CIQUAL ; teneur en vitamine C très variable selon le lot et le séchage. | Non (pas de teneur fiable) | Aucune | Poudre importée | FICHE poudres vitamine C |
| Argousier | Pas de fiche CIQUAL (refus de v3). | Non | Un essai ancien et petit sur des huiles d'argousier dans l'eczéma (Yang 1999, PMID 15539258), pas sur le jus | Jus très acide ; compléments d'huile ≠ fruit | RECETTE (smoothie, ingrédient hors base) + FICHE |
| Baobab | Pas de fiche CIQUAL. Pulpe séchée autorisée comme nouvel aliment dans l'UE (décision 2008/575/CE). | Non (pas de teneur fiable) | Aucune | Poudre importée | FICHE poudres vitamine C |
| Moringa | Pas de fiche CIQUAL (seule USDA a des feuilles fraîches, introuvables ici). | Non | Aucune | Complément concentré ; grossesse et traitements : avis médical | FICHE poudres |
| Sésame noir | Même composition que le sésame (CIQUAL 15010), déjà dans la base : 10 g = 0,6 mg de zinc (6 %). | Zinc : oui pour 100 g (57 %), **pas** par portion de 10 g | C (composition) | Allergène majeur (sésame) | RECETTE (latte au sésame noir) |
| Collagène, bouillon d'os | Pas d'aliment ; bouillon = précurseurs faibles et variables (Alcock 2019, PMID 29893587). | Non (aucune allégation autorisée pour le collagène) | Pas démontré dans les essais indépendants (Myung 2025, PMID 40324552) | Compléments sucrés ou aromatisés ; bouillons salés | FICHE existante, déjà complète : inchangée |
| Golden latte | Curcuma en petite quantité, déjà dans la base. | Non | Pas démontré (fiche curcuma existante) | Compléments de curcuma : hépatites et interactions (ANSES) | RECETTE (version au lait de coco) |
| Lattes aux champignons (reishi, chaga, lion's mane, cordyceps) | Pas d'aliment, poudres d'extraits. | Non | Aucune étude cutanée chez l'humain | Chaga : néphropathie à oxalates (Kikuchi 2014, PMID 23149251) ; reishi en poudre : hépatite fulminante décrite (Wanmuang 2007, PMID 17621752) | FICHE |
| Ashwagandha | Pas d'aliment, complément. | Non | Aucune étude cutanée | Atteintes du foie décrites (Björnsson 2020, PMID 31991029) ; grossesse, thyroïde | FICHE |

## Les cafés à 100 €

- Le prix achète la rareté et un procédé : quelques kilos par an (Black Ivory, digéré par des éléphants), des enchères de lots Geisha du Panama, une histoire (Kopi Luwak, grains récupérés dans les excréments de civettes).
- Pour la peau, rien ne change : même composition qu'un café ordinaire, aucune étude ; le seul lien publié est observationnel et vaut pour tout café (Li 2018).
- Le Kopi Luwak pose un problème de bien-être animal documenté (civettes capturées et mises en cage, Lewis-Whelan 2024) et de fraude fréquente (Lachenmeier 2021) : VYVRE ne le propose pas.

## Ce qui manquait d'important pour la peau dans la base

Contrôle des sources fortes des nutriments qui portent une allégation peau (vitamine C, zinc, riboflavine, niacine, iode, vitamine A, biotine, cuivre) et des oméga-3, sélénium :

- Vitamine C : kiwi, poivron, cassis, goyave, persil, agrumes présents. **Manquait l'acérola**, la source la plus forte de CIQUAL : ajoutée.
- Zinc : huître, bœuf, graines de courge, sésame présents. **Manquait le germe de blé** (CIQUAL 9660 : 14 mg/100 g ; 15 g = 2,1 mg, 21 % de la VNR), courant aux États-Unis, au Royaume-Uni et en Europe du Nord : ajouté (sans photo, hors sélection principale pour l'instant).
- Sélénium, oméga-3 EPA et DHA, vitamine E : noix du Brésil, poissons gras, huiles de colza et de noix, amande, tournesol présents. Rien de majeur ne manque.
- Vitamine A : carotte, patate douce, courges, épinard, mangue présents. Le foie de volaille (CIQUAL 40109 : 18 700 µg de vitamine A pour 100 g, soit six fois la limite de sécurité de l'EFSA dans une portion de 100 g) est **volontairement non ajouté** : excès de vitamine A et grossesse.
- Riboflavine, niacine : laitiers, amande, champignons, volaille, poissons, cacahuète présents.
- Iode : poissons, fruits de mer, laitiers présents ; algues écartées pour tous (excès).
- Biotine : absente de CIQUAL 2020, donc aucune allégation biotine possible (inchangé).

## Ce qui a été fait, et pas fait

- Ajoutés à `aliments_v4.json` (5) : acérola, germe de blé, boisson d'avoine, boisson de coco, eau de coco. Tous ont `photo_disponible: false` : le choix de l'assiette (aliment-core.js et vy-aliment.js) les ignore tant qu'une photo n'existe pas ; ils servent déjà aux recettes, où une photo absente n'est jamais affichée (les vignettes ne prennent que les aliments qui ont un crédit photo).
- Ajoutées à `recettes.json` (10) : matcha latte au lait d'avoine, hojicha latte, rooibos latte à la vanille, ube latte maison, golden latte au lait de coco, latte au sésame noir, smoothie acérola mangue et eau de coco, smoothie argousier banane et kéfir, bissap peu sucré à la menthe, smoothie banane cacao et germe de blé.
- Ajoutées à `tendances.json` (8) : cafés de luxe, lattes aux champignons, ashwagandha, eau de coco, ube, laits végétaux, poudres riches en vitamine C (acérola, camu camu, baobab, argousier, moringa), infusions tendance (maté, rooibos, hibiscus, hojicha).
- Sécurité : les lattes au matcha et au hojicha utilisent l'aliment `the_vert`, donc ils disparaissent déjà pour une personne enceinte ou qui allaite ; les recettes avec matcha ou eau de coco sont retirées en cas de maladie des reins.
- Pas fait : boisson de riz comme recette (arsenic), café comme aliment, foie, kombucha, poudres sans fiche CIQUAL.
- Reste à faire : les photos des 5 nouveaux aliments (prompts prêts dans `photo_prompt`), puis passer `photo_disponible` à true ; faire valider par le juriste l'absence d'allégation sur le café.
