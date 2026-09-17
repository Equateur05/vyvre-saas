# Catalogue v2 - methode des scores produit (17/09/2026)

Script : `catalogue-v2/fusion_scores.py` (deterministe, relancable, ~3 s). Sortie : `catalogue-v2/sortie/`.

## Pourquoi
Dans l'ancien `all.json`, 41,4 % des produits avaient un vecteur `concern_scores` identique a au moins 4 autres produits (57,6 % identique a au moins 1 autre) : le scan ne pouvait pas les departager. Chaque produit a maintenant un vecteur calcule a partir de SA fiche.

## Calcul (par axe : wrinkles, firmness, glow, hydration, redness, pores, sebum, pigmentation)
1. **INCI** (liste nettoyee : coupure au premier texte parasite du site, ex. « Add to cart »). Chaque actif de la table ci-dessous compte une fois, avec un poids par axe multiplie par un facteur de position `0,3 + 0,7 x exp(-rang/7)` (rang 0 = 1er ingredient : x1,0 ; 7e : x0,56 ; 20e : x0,34). Si la liste a moins de 5 elements (actifs cles seulement), facteur fixe 0,75.
   - Signaux INCI faibles : huiles vegetales dans les 15 premiers (hydration), alcool dans les 5 premiers (sebum), aucune trace de parfum (redness +0,15), filtres UV (pigmentation +0,45, wrinkles +0,3).
2. **Actif cite dans le nom** (ex. « Niacinamide 10% ») : poids de l'actif x0,9, x1,15 si un pourcentage figure dans le nom.
3. **Texte** (claims, nom, description, FR et EN, sans accents) : table de mots ci-dessous. Poids source : nom 1,0 ; claim 0,8 ; description 0,35 + 0,1 par occurrence (max 4). Plusieurs sources : la premiere compte plein, les autres a 35 %.
4. **Categorie** : un apport de depart (prior) puis un multiplicateur par axe.
5. **Agregation** : contributions triees par force, rendements decroissants (1 ; 0,65 ; 0,45 ; 0,32 ; 0,24 ; 0,18...), puis `score = (0,08 + 0,9 x (1 - exp(-brut/1,1))) x multiplicateur_categorie`, borne 0,05..0,98, arrondi a 0,01.
6. **targets** : les axes du top 3 dont le score >= 0,50 et a moins de 0,30 du meilleur ; a defaut, le meilleur axe seul.
7. **score_raisons** : les 6 contributions les plus fortes (actif + rang INCI, ou mot + source) + la categorie.

## Table des actifs INCI (poids par axe avant position)
| actif (regex INCI) | poids |
|---|---|
| acide hyaluronique / hyaluronate | hydration 1,0 ; wrinkles 0,15 |
| glycerine (seulement rangs 1-4) | hydration 0,5 |
| ceramides | hydration 0,7 ; redness 0,25 |
| squalane | hydration 0,5 |
| uree | hydration 0,7 |
| panthenol | hydration 0,4 ; redness 0,35 |
| aloe | hydration 0,35 ; redness 0,3 |
| polyglutamate | hydration 0,7 |
| betaine, trehalose, sodium PCA | hydration 0,35 |
| karite ; beta-glucane ; tremella | hydration 0,35-0,4 (beta-glucane redness 0,3) |
| mucine d'escargot | hydration 0,4 ; firmness 0,25 ; redness 0,2 |
| jojoba ; petrolatum/huile minerale (rangs 1-7) | hydration 0,3 |
| retinol ; retinal | wrinkles 1,0 ; firmness 0,6 ; pigmentation 0,35 ; glow 0,2 (retinol pores 0,2) |
| esters de retinyl | wrinkles 0,6 ; firmness 0,35 ; pigmentation 0,2 |
| hydroxypinacolone retinoate (Granactive) | wrinkles 0,85 ; firmness 0,5 ; pigmentation 0,25 |
| adapalene | pores 0,9 ; sebum 0,5 ; wrinkles 0,4 |
| bakuchiol | wrinkles 0,75 ; firmness 0,45 ; pigmentation 0,2 |
| peptides (palmitoyl..., matrixyl, argireline) | wrinkles 0,7 ; firmness 0,7 |
| collagene | firmness 0,5 ; wrinkles 0,3 ; hydration 0,2 |
| adenosine | wrinkles 0,6 ; firmness 0,3 |
| elastine ; DMAE ; cafeine | firmness 0,35 / 0,5 / 0,4 |
| coenzyme Q10 | wrinkles 0,4 ; glow 0,2 |
| PDRN / sodium DNA | wrinkles 0,5 ; firmness 0,4 ; redness 0,2 |
| vitamine C pure (acide ascorbique, ethyl ascorbique) | glow 1,0 ; pigmentation 0,8 ; wrinkles 0,4 ; firmness 0,3 |
| vitamine C stable (THD, ascorbyl glucoside, SAP, MAP) | glow 0,85 ; pigmentation 0,7 ; wrinkles 0,35 ; firmness 0,25 |
| palmitate d'ascorbyle | glow 0,35 ; pigmentation 0,2 |
| niacinamide | pores 0,8 ; sebum 0,7 ; glow 0,7 ; pigmentation 0,7 ; redness 0,35 |
| acide glycolique | glow 0,85 ; pigmentation 0,5 ; pores 0,45 ; wrinkles 0,3 |
| acide lactique (rangs 1-16) | glow 0,7 ; pigmentation 0,35 ; hydration 0,2 |
| acide mandelique | glow 0,6 ; pores 0,5 ; pigmentation 0,4 |
| PHA (gluconolactone, lactobionique) | glow 0,5 ; hydration 0,2 |
| acide salicylique / BHA / saule | pores 1,0 ; sebum 0,8 ; glow 0,3 |
| zinc PCA / gluconate / sulfate | sebum 0,8 ; pores 0,4 ; redness 0,2 |
| argile, kaolin, bentonite, charbon | sebum 0,8 ; pores 0,7 |
| soufre | pores 0,7 ; sebum 0,6 |
| tea tree | pores 0,6 ; sebum 0,5 |
| acide azelaique | pigmentation 0,7 ; pores 0,6 ; redness 0,6 ; sebum 0,4 |
| acide succinique | pores 0,5 ; sebum 0,3 |
| acide tranexamique | pigmentation 1,0 ; redness 0,2 |
| arbutine | pigmentation 1,0 |
| acide kojique | pigmentation 0,9 |
| resorcinols (thiamidol, phenylethyl resorcinol) | pigmentation 0,95 |
| reglisse / glabridine | pigmentation 0,6 ; redness 0,5 |
| glycyrrhizate | redness 0,5 |
| glutathion | pigmentation 0,6 ; glow 0,3 |
| centella, madecassoside, asiaticoside | redness 1,0 ; hydration 0,2 ; firmness 0,15 |
| allantoine ; bisabolol ; avoine | redness 0,45 / 0,6 / 0,6 |
| eau thermale | redness 0,5 |
| camomille, calendula ; armoise, houttuynia | redness 0,4 / 0,45 |
| the vert / EGCG | redness 0,3 ; sebum 0,2 |
| ectoine | redness 0,5 ; hydration 0,3 |
| acide ferulique ; resveratrol | glow 0,4 / 0,3 ; wrinkles 0,3 / 0,35 |
| ferments (galactomyces, saccharomyces, riz) | glow 0,5 ; pigmentation 0,25 |
| propolis ; probiotiques | redness 0,3 (+ glow 0,3 / hydration 0,2) |
| rose musquee | glow 0,3 ; pigmentation 0,2 ; wrinkles 0,2 |

## Table des mots (claims / nom / description)
| famille | exemples de racines | poids |
|---|---|---|
| hydratant | hydrat, moistur, repulp, plump, deshydrat | hydration 0,8 |
| nourrissant | nourri, nutri, nourish, confort | hydration 0,45 |
| acide hyaluronique (texte) | hyaluron | hydration 0,6 |
| anti-rides | anti-rides, ridule, wrinkle, fine lines, anti-age, youth, jeunesse | wrinkles 0,8 ; firmness 0,25 |
| lissant | lissant, smooth | wrinkles 0,35 |
| retinoides (texte) | retino, retinal, bakuchiol | wrinkles 0,7 ; firmness 0,3 |
| peptides / collagene (texte) | peptide, collag | firmness 0,5 ; wrinkles 0,35 |
| fermete | fermete, raffermi, lift, firm, tenseur, sculpt, densi, elastic, rebond, volume | firmness 0,85 ; wrinkles 0,2 |
| eclat | eclat, radian, glow, illumin, lumin, bright, teint terne, dull | glow 0,8 |
| vitamine C (texte) | vitamine c, ascorbi | glow 0,6 ; pigmentation 0,4 |
| exfoliant | exfoli, peeling, AHA, resurfac, gommage, scrub | glow 0,5 ; pores 0,35 |
| antioxydant | antioxyd, anti-pollution, defatigant | glow 0,3 ; wrinkles 0,15 |
| apaisant | apais, calm, sooth, rougeur, redness, cica, irrit, atopi, couperose | redness 0,85 |
| peaux sensibles | sensib, sensitive, tolerance | redness 0,5 |
| reparateur | repar, repair, barriere, restor, SOS | redness 0,4 ; hydration 0,25 |
| pores | pore, grain de peau, resserr, refin | pores 0,8 |
| anti-imperfections | imperfection, blemish, acne, bouton, pimple, point noir, blackhead | pores 0,8 ; sebum 0,45 |
| purifiant | purifi, clarif, detox, desincrust | pores 0,5 ; sebum 0,45 |
| matifiant | matif, sebum, brillance, shine, oil control, peau grasse, mixte, oily | sebum 0,85 ; pores 0,25 |
| BHA / salicylique (texte) | salicyl, BHA | pores 0,6 ; sebum 0,4 |
| argile (texte) | argile, clay, charbon, mud | sebum 0,5 ; pores 0,45 |
| niacinamide (texte) | niacinamid | pores 0,45 ; sebum 0,35 ; glow 0,35 ; pigmentation 0,35 |
| anti-taches | tache, dark spot, pigment, uniform, even tone, melasma, TXA, arbutin, kojic | pigmentation 0,85 ; glow 0,2 |
| anti-cernes | cerne, dark circle, poche, puff | firmness 0,3 ; pigmentation 0,3 |
| protection solaire | SPF, solaire, sun, UV, ecran | pigmentation 0,5 ; wrinkles 0,3 |
| signaux faibles (departagent les fiches pauvres) | texture riche (baume, rich, peaux seches) hydration 0,4 ; texture legere (gel, fluide, water, essence) hydration 0,3 sebum 0,15 ; demaquillant doux (micellaire, lait, gentle) redness 0,3 ; soin de nuit (night, overnight, regener) wrinkles 0,3 hydration 0,2 ; positionnement prestige (prestige, supreme, caviar, gold, cellul...) wrinkles 0,4 firmness 0,3 ; floral (rose, neroli, bleuet) redness 0,25 glow 0,15 ; peau mixte (equilibr, balanc) sebum 0,35 ; vitamines glow 0,2 ; soin de jour glow 0,15 ; homme sebum/redness 0,15 | |

## Modulateurs de categorie
| categorie | apport de depart (brut) | multiplicateur |
|---|---|---|
| nettoyant | pores 0,25 ; sebum 0,3 | x0,70 (pores, sebum x0,85) |
| lotion | hydration 0,2 | x0,85 |
| serum | - | x1,05 |
| creme | hydration 0,3 | x0,95 |
| contour-yeux | wrinkles 0,45 ; firmness 0,45 | x0,90 (wrinkles/firmness x1,0 ; pores/sebum x0,45) |
| masque | hydration 0,2 | x0,85 |
| exfoliant | glow 0,55 ; pores 0,5 ; pigmentation 0,15 | x0,80 (glow, pores x0,95) |
| huile | hydration 0,35 ; glow 0,2 | x0,85 (sebum x0,55 ; pores x0,7) |
| solaire-visage | pigmentation 0,6 ; wrinkles 0,4 (prevention) | x0,80 (pigmentation x0,95 ; wrinkles x0,9) |
| autre-visage | - | x0,90 |

Les produits sans INCI (2 820, 48,9 %) n'ont que les etapes 2 a 4 ; ils restent disperses grace au nombre d'occurrences dans la description, aux sources multiples et aux signaux faibles.

## Controles

### Vecteurs dupliques
| | produits | identique a 4+ autres (objectif < 5 %) | identique a au moins 1 autre |
|---|---:|---:|---:|
| ancien all.json (06/2026) | 1 863 | 41,4 % | 57,6 % |
| catalogue v2 | 5 768 | **1,9 %** | 5,1 % |
| catalogue v2, produits sans INCI seulement | 2 820 | 3,7 % | - |

Avant l'ajout des signaux faibles, le taux etait de 5,5 % (plus gros groupe : 74 demaquillants/baumes sans INCI ni claim). Les groupes restants (13 produits au plus) sont des fiches sans aucun signal : contours des yeux, serums et demaquillants au nom purement commercial (ex. « EVERYTHING EYE PATCHES », « Made-to-measure face »).

### Distribution par axe
| axe | min | p10 | mediane | p90 | max | ecart-type | produits ou l axe est en targets |
|---|---:|---:|---:|---:|---:|---:|---:|
| wrinkles | 0.06 | 0.07 | 0.3 | 0.69 | 0.96 | 0.24 | 1543 |
| firmness | 0.06 | 0.06 | 0.15 | 0.66 | 0.89 | 0.24 | 1179 |
| glow | 0.06 | 0.07 | 0.28 | 0.66 | 0.92 | 0.24 | 1563 |
| hydration | 0.06 | 0.12 | 0.49 | 0.73 | 0.95 | 0.21 | 2909 |
| redness | 0.06 | 0.07 | 0.29 | 0.63 | 0.89 | 0.21 | 1278 |
| pores | 0.05 | 0.06 | 0.19 | 0.63 | 0.92 | 0.23 | 1234 |
| sebum | 0.05 | 0.06 | 0.19 | 0.55 | 0.91 | 0.19 | 695 |
| pigmentation | 0.06 | 0.07 | 0.2 | 0.64 | 0.92 | 0.23 | 1124 |

### 20 exemples verifies a la main
Attendu = axes qui doivent figurer dans le top 3. Verifies en relisant la fiche, l INCI et les raisons.

| # | produit | attendu | top 3 obtenu | raisons principales | verdict |
|---|---|---|---|---|---|
| 1 | The Ordinary - Niacinamide 10% + Zinc 1% | pores, sebum, glow | pores 0.87, glow 0.83, sebum 0.83 | niacinamide dans le nom 10%; eclat (claim+description); anti-imperfections (claim+description) | OK |
| 2 | The Ordinary - Acide Hyaluronique 2% + B5 (Formulation d'origine) | hydration | hydration 0.92, redness 0.32, wrinkles 0.28 | acide hyaluronique dans le nom 2%; acide hyaluronique (INCI #2); hydratant (claim+description) | OK |
| 3 | The Ordinary - Retinol 0.5% in Squalane | wrinkles | wrinkles 0.9, firmness 0.71, hydration 0.67 | retinol dans le nom 0.5%; retinol (texte) (nom+description); retinol (INCI #4) | OK |
| 4 | The Ordinary - Salicylic Acid 2% Solution | pores, sebum | pores 0.83, sebum 0.62, glow 0.6 | acide salicylique / BHA dans le nom 2%; anti-imperfections (claim+description); acide salicylique / BHA (INCI #4) | OK |
| 5 | The Ordinary - Alpha Arbutin 2% + HA | pigmentation | pigmentation 0.92, hydration 0.53, glow 0.3 | anti-taches (nom+claim+description); arbutine dans le nom 2%; arbutine (INCI #2) | OK |
| 6 | The Ordinary - Granactive Retinoid 5% dans du Squalane | wrinkles | wrinkles 0.81, firmness 0.57, hydration 0.47 | retinoate (HPR) dans le nom 5%; retinol (texte) (nom+description); squalane dans le nom 5% | OK |
| 7 | La Roche-Posay - Cicaplast B5 Sérum | redness | redness 0.82, hydration 0.78, sebum 0.28 | apaisant (nom+claim+description); hydratant (claim+description); acide hyaluronique (INCI #8) | OK |
| 8 | Avène - Cicalfate+ Sérum restaurateur intense | redness | redness 0.82, hydration 0.27, wrinkles 0.08 | apaisant (nom+claim+description); reparateur (claim+description); eau thermale (actif cle) | OK |
| 9 | Medik8 - Crystal Retinal® | wrinkles, firmness | wrinkles 0.82, firmness 0.73, glow 0.71 | retinol (texte) (nom+description); fermete (claim+description); anti-taches (claim+description) | OK |
| 10 | The INKEY List - Tranexamic Acid Serum | pigmentation | pigmentation 0.88, glow 0.8, pores 0.5 | anti-taches (nom+claim+description); eclat (claim+description); acide tranexamique (INCI #5) | OK |
| 11 | The INKEY List - 15% Vitamin C + EGF Serum | glow, pigmentation | glow 0.86, pigmentation 0.78, firmness 0.71 | eclat (claim+description); fermete (claim+description); anti-taches (claim+description) | OK |
| 12 | Skin1004 - Centella Soothing Cream | redness | redness 0.79, hydration 0.72, pigmentation 0.3 | apaisant (nom+claim+description); hydratant (claim+description); centella / madecassoside (INCI #6) | OK |
| 13 | Kiehl's - Rare Earth Pore-Minimizing Clay Mask | pores, sebum | pores 0.69, sebum 0.59, hydration 0.2 | pores (nom+description); argile / charbon dans le nom; anti-imperfections (claim) | OK |
| 14 | Neutrogena - Neutrogena® Hydro Boost Gel-cream With Hyaluronic Acid  | hydration | hydration 0.78, sebum 0.18, wrinkles 0.17 | acide hyaluronique dans le nom; hydratant (claim); acide hyaluronique (texte) (nom) | OK |
| 15 | La Roche-Posay - Anthelios Fluide Invisible SPF30 | pigmentation | pigmentation 0.68, wrinkles 0.52, sebum 0.27 | protection solaire (nom+claim+description); filtres UV (INCI); texture legere (nom+description) | OK |
| 16 | Vichy - LIFTACTIV CRÈME DE JOUR H.A. ANTI-RIDES RAFFERMISSANTE  | firmness, wrinkles | firmness 0.73, wrinkles 0.71, hydration 0.52 | fermete (nom+claim+description); anti-rides (nom+claim+description); glycerine en tete (INCI #2) | OK |
| 17 | Caudalie - Vinopure Fluide Matifiant Hydratant à la Poudre de Sili | sebum | sebum 0.73, hydration 0.71, pores 0.59 | matifiant (nom+claim+description); hydratant (nom+claim+description); anti-imperfections (claim+description) | OK |
| 18 | Eucerin - ANTI-PIGMENT Soin de Nuit | pigmentation | pigmentation 0.67, glow 0.58, hydration 0.36 | anti-taches (nom+claim+description); eclat (claim+description); soin de nuit (nom+description) | OK |
| 19 | Paula's Choice - Clear Extra Strength 2% BHA Exfoliant | pores | pores 0.79, glow 0.61, sebum 0.47 | anti-imperfections (nom+claim+description); exfoliant (nom+claim+description); BHA/salicylique (texte) (nom) | OK |
| 20 | Drunk Elephant - C-Firma Fresh Vitamin-C Day Serum | glow | firmness 0.73, glow 0.72, pigmentation 0.61 | fermete (nom+claim); vitamine C pure (INCI #3); acide hyaluronique (INCI #18) | OK |

### Limites connues
- Les mots du texte l'emportent parfois sur l'INCI quand la description marketing est bavarde (ex. Bioderma Sebium Serum sort aussi fort en wrinkles parce que ses claims le revendiquent).
- Les concentrations ne sont lues que si elles figurent dans le nom ; le pourcentage est attribue a tous les actifs du nom.
- Un actif en fin de liste compte encore (x0,3 minimum) : la liste INCI ne donne pas les pourcentages.
- Le prior hydration des cremes/masques/lotions fait de hydration le premier axe de 30 % des produits.
- La table des 20 exemples a ete ecrite par la personne qui a regle les poids : c'est un controle de coherence, pas une validation independante.
