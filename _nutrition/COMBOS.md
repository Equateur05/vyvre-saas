# COMBO ALIMENT + CRÈME ET SÉRUM : dossier de preuves

Projet : vyvre.fr, section premium. Date : 30 septembre 2026. Fichiers liés : `combos.json` (données pour l'app), `aliments.json`, `ETUDE_ALIMENTS_PEAU_LONGEVITE.md`, `REGLES_RECOMMANDATION.md`, `QUESTIONNAIRE.md`.
Statut : document de travail interne ; ne remplace ni un avis médical ni un avis juridique.

---

## L'essentiel en mots simples (pour le fondateur)

1. Une paire = un aliment + un actif de soin qui visent le même souci de peau, l'un par l'assiette, l'autre par la peau.
2. Aucune étude n'a jamais testé une de ces paires. Chaque côté a ses preuves, affichées séparément. On ne dit jamais « les deux ensemble font mieux ».
3. Le côté soin est souvent mieux prouvé que le côté assiette : l'écran solaire, la glycérine et la niacinamide sont au niveau A ; la plupart des aliments sont au niveau C.
4. L'écran solaire quotidien est la mesure la plus solide contre rides, taches et rougeurs dues au soleil : il passe en premier pour ces trois indices.
5. Rétinol : efficace (B) mais à éviter en cas de grossesse, le soir seulement, avec écran le matin. La trétinoïne est un médicament, interdite en cosmétique.
6. Acide azélaïque : les bons essais portent sur des médicaments à 15-20 % ; en cosmétique (10 % ou moins), c'est une extrapolation (C).
7. La loi interdit à un cosmétique de « traiter » l'acné, la rosacée ou les taches ; on dit « aide à atténuer l'apparence de… ».
8. Côté aliment, seules les allégations autorisées par l'UE, mot pour mot.
9. Catalogue : la liste d'ingrédients n'est pas dans `all.json` mais dans les fichiers par marque ; 2 951 produits sur 5 831 (51 %) en ont une.
10. Trouver un actif dans la liste d'ingrédients ne prouve pas qu'il y est à dose efficace : on ne promet rien sur un produit précis.
11. Le scan mesure une photo ; aucun aliment ni aucun actif n'a été étudié sur ces indices-là : jamais « votre score va remonter ».

---

## 1. Méthode

- Échelle identique à l'étude aliments : A plusieurs essais randomisés (ECR) concordants ou méta-analyse concordante ; B au moins un ECR correct ; C observationnel, mécanistique ou extrapolé d'un médicament ; D non étayé.
- Chaque référence PubMed a été vérifiée via l'API NCBI E-utilities (esearch + esummary + efetch du résumé) : titre, premier auteur, année et revue concordants. Les résumés des essais clés ont été relus pour les effectifs, doses et financements.
- Statut réglementaire des ingrédients vérifié dans la base officielle CosIng (API de la Commission européenne) : annexe II (interdit) ou III (restreint).
- Un grade est donné par actif et, dans `combos.json`, par indice (`grade_par_indice`), car un même actif est mieux prouvé pour un souci que pour un autre.

---

## 2. Les actifs cosmétiques

| Actif | Grade | Dose étudiée | Ce qu'on peut dire (formulation cosmétique) | Moment | Grossesse |
|---|---|---|---|---|---|
| Protection solaire SPF large spectre | A | SPF 30+ avec UVA, chaque matin, quantité suffisante | Aide à protéger la peau des effets visibles du soleil (coups de soleil, taches, rides liées au soleil) | matin | ok |
| Rétinol / rétinal | B | Rétinol 0,1-0,4 % (plafond UE 0,3 % visage) ; rétinal 0,05 % | Aide à atténuer l'apparence des rides et ridules, lisse le grain de peau | soir | éviter |
| Vitamine C (acide L-ascorbique) | B | 5 à 20 %, pH < 3,5 | Antioxydant ; contribue à un teint plus lumineux ; aide à atténuer l'apparence des ridules et des taches | matin | avis |
| Niacinamide | A (taches) / B (autres) | 2 % (sébum) à 4-5 % (taches, rides) | Aide à atténuer l'apparence des taches et rougeurs, à réduire l'aspect brillant, renforce la barrière de surface | les deux | avis |
| Acide azélaïque | C en cosmétique (A en médicament) | Médicaments : 15 % (rosacée), 20 % (acné). Cosmétiques : ≤ 10 %, non testés | Aide à unifier le teint et à réduire l'apparence des imperfections | les deux | ok (CRAT) |
| AHA (glycolique, lactique) | B | 8 % dans l'ECR ; SCCNFP conseille ≤ 4 % glycolique pH ≥ 3,8 | Exfolie la surface, lisse le grain, ravive l'éclat | soir | avis |
| Acide salicylique (BHA) | B | 0,5 à 2 % (plafond UE 2 %) | Désincruste les pores, aide à réduire l'apparence des points noirs et imperfections | soir | avis |
| Céramides | B | Formules complètes (céramides + cholestérol + acides gras) | Aide à restaurer la barrière des couches supérieures de l'épiderme | les deux | ok |
| Glycérine, acide hyaluronique | A (glycérine) / B (hyaluronique) | Glycérine 5-20 % ; hyaluronique 0,1 % | Hydrate les couches supérieures de l'épiderme | les deux | ok |
| Peptides | B (faible, industrie) | Palmitoyl pentapeptide 3 ppm | Aide à atténuer l'apparence des ridules (preuves limitées) | les deux | avis |
| Acide tranexamique (application) | B | 2 à 3 % | Aide à atténuer l'apparence des taches pigmentaires | les deux | avis |
| Bakuchiol | B (un seul ECR, sans placebo) | 0,5 % deux fois par jour | Aide à atténuer l'apparence des rides ; mieux toléré que le rétinol dans un essai | les deux | avis |
| Panthénol | B | 1 à 5 % | Apaise et hydrate, aide à préserver la barrière | les deux | ok |
| Centella asiatica | C | Non établie | Apaise les peaux sensibles (preuves limitées) | les deux | avis |
| Thé vert en application | C | Non établie | Antioxydant ; preuves limitées et contradictoires | matin | avis |

« avis » = aucune donnée de sécurité trouvée chez la femme enceinte (ni fiche CRAT) : l'app affiche « demandez conseil à votre médecin ou pharmacien », sans affirmer de risque ni d'innocuité.

### 2.1 Détail par actif (preuves, précautions)

**Protection solaire (A).** Hughes 2013 (Ann Intern Med, ECR communautaire, 903 adultes de moins de 55 ans, 4,5 ans, financement public) : aucun vieillissement cutané détectable dans le groupe écran quotidien, 24 % de vieillissement en moins que l'usage à la demande. Green 1999 et Green 2011 : moins de carcinomes puis de mélanomes dans le même essai. Boukari 2015 : écran filtrant aussi la lumière visible, moins de rechutes de mélasma (un auteur salarié de Bioderma). Randhawa 2016 : 32 sujets, un an, sans groupe témoin, auteurs Johnson & Johnson (faible). Règles UE (Recommandation 2006/647/CE) : pas de « sunblock », « écran total » ni « 100 % » ; UVA au moins un tiers du SPF.

**Rétinol, rétinal (B).** Kafi 2007 (ECR double aveugle, 36 sujets âgés, rétinol 0,4 % sur un bras, 24 semaines) : ridules nettement améliorées. Randhawa 2015 (ECR, un an, auteurs J&J). Creidi 1998 (ECR, 125 patients, rétinal 0,05 % comparable à la trétinoïne sur rides et rugosité à 18 semaines, mieux toléré). Kong 2016 (rétinol : mêmes effets que l'acide rétinoïque, en plus faible ; auteurs Amway). La trétinoïne (Weiss 1988) est un médicament et figure à l'annexe II (interdite en cosmétique, n° 375).
Précautions : irritation et desquamation au début (2-3 soirs par semaine) ; écran obligatoire ; ne pas cumuler le même soir avec AHA/BHA. Règlement (UE) 2024/996 : plafond 0,3 % d'équivalent rétinol (0,05 % pour les laits corps) pour rétinol, acétate et palmitate de rétinyle, mise sur le marché dès le 1er novembre 2025, produits non conformes retirés au 1er mai 2027, étiquette « Contains Vitamin A. Consider your daily intake before use. » (la raison est le cumul avec la vitamine A de l'alimentation et des compléments). Le rétinal et l'hydroxypinacolone retinoate n'ont pas de restriction dans CosIng. Grossesse : l'ANSM a contre-indiqué le 25/10/2018 les rétinoïdes médicaments par voie cutanée ; aucun texte équivalent trouvé pour le rétinol cosmétique, on applique la même prudence.

**Vitamine C (B).** Humbert 2003 (ECR contre excipient, 20 femmes, 5 %, 6 mois : microrelief amélioré). Traikovich 1999 (ECR, 3 mois : rugosité et ridules). Espinal-Perez 2004 (mélasma, 16 femmes : moins efficace que l'hydroquinone mais bien mieux tolérée). Pinnell 2001 : l'acide L-ascorbique ne pénètre qu'à pH < 3,5, maximum utile 20 % ; les dérivés testés (magnesium ascorbyl phosphate, ascorbyl palmitate) n'augmentaient pas la vitamine C de la peau. Lin 2005 : association vitamine C 15 % + E + acide férulique, photoprotection doublée (expérimental). S'oxyde : flacon opaque.

**Niacinamide (A pour les taches, B ailleurs).** Bissett 2005 (ECR hémivisage, 50 femmes, 5 %, 12 semaines : ridules, taches, rougeurs, teint jaune, élasticité). Hakozaki 2002 (essais de 18 et 120 personnes : hyperpigmentation réduite dès 4 semaines). Navarrete-Solís 2011 (ECR, mélasma, 4 % proche de l'hydroquinone 4 %). Draelos 2006 (2 % : sébum réduit, résultat différent selon les populations). Draelos 2005 (rosacée : barrière améliorée, étude contrôlée mais non aveugle pour le sujet). Plusieurs essais sont financés par Procter & Gamble : à afficher.

**Acide azélaïque (C en cosmétique).** Elewski 2003 (ECR rosacée, gel 15 % supérieur au métronidazole ; médicament). Verallo-Rowell 1989 (ECR, 155 patients, mélasma, crème 20 % ; médicament). AAD 2024 : recommandation conditionnelle dans l'acné. En cosmétique : ingrédient sans restriction d'annexe dans CosIng ; aucun ECR vérifié aux concentrations cosmétiques. Grossesse : le CRAT le juge utilisable à tous les termes. Picotements fréquents au début.

**AHA (B).** Stiller 1996 (ECR, 74 femmes, 8 % glycolique ou lactique, 22 semaines : amélioration chez 76 % et 71 % contre 40 % avec l'excipient). Photosensibilité : Kaidbey 2003 (glycolique 10 % : sensibilité aux UV accrue, réversible une semaine après l'arrêt) ; la FDA recommande un avertissement « coup de soleil » et une protection pendant l'usage et la semaine suivante. Le comité scientifique européen (SCCNFP/0370/00, 28 juin 2000) suggérait par précaution ≤ 4 % d'acide glycolique à pH ≥ 3,8 et ≤ 2,5 % d'acide lactique à pH ≥ 5 : ce n'est pas une limite légale. L'acide lactique en fin de liste est souvent un simple correcteur de pH.

**Acide salicylique (B).** AAD 2024 : recommandation conditionnelle dans l'acné (certitude faible). Arif 2015 : revue. Lee 2003 : peelings à 30 % sans groupe témoin (acte professionnel, hors champ). UE : annexe III n° 98, 2 % maximum dans les soins sans rinçage, interdit chez l'enfant de moins de 3 ans. Ne pas cumuler avec un rétinoïde le même soir.

**Céramides (B).** Lueangarun 2019 (ECR double aveugle, 24 sujets, xérose). Spada 2018 (crème vs placebo et 3 références, hydratation à 24 h). Preuve pour des formules complètes, pas pour la molécule seule en traces.

**Glycérine et acide hyaluronique (A pour la glycérine).** Lodén 2002 (ECR double aveugle, 197 patients atopiques, crème à 20 % de glycérine vs excipient). Breternitz 2008 (ECR contre placebo). Cochrane van Zuuren 2017 (émollients dans l'eczéma). Pavicic 2011 (acide hyaluronique 0,1 % : hydratation, élasticité ; ridules pour les petits poids moléculaires). Interdit : « comble les rides », « repulpe comme une injection ».

**Peptides (B faible).** Robinson 2005 (ECR hémivisage, 93 femmes, palmitoyl pentapeptide : rides réduites ; auteurs Procter & Gamble). Chaque peptide est une molécule différente : les preuves de l'un ne valent pas pour l'autre.

**Acide tranexamique en application (B).** Ebrahimi 2014 (ECR hémivisage, 50 femmes, 3 % aussi efficace que hydroquinone + dexaméthasone, mieux toléré). Kim 2016 (23 patients, 2 %, sans témoin ; co-auteurs Shiseido). Kim 2017 (méta-analyse, 11 études, 667 participants, surtout la forme orale). Sans écran solaire, les taches reviennent.

**Bakuchiol (B fragile).** Dhaliwal 2019 (ECR double aveugle, 44 patients, 0,5 % deux fois par jour vs rétinol 0,5 % : pas de différence, moins d'irritation ; pas de groupe placebo). Aucune donnée pendant la grossesse : ne pas le vendre comme « le rétinol de la grossesse ».

**Panthénol (B).** Proksch 2002, Gehring 2000, Camargo 2011 (1 % suffit à réduire la perte en eau). « Cicatrisant » est une allégation médicale.

**Centella (C).** Petites études sur avant-bras ; Haftek 2008 teste l'association vitamine C + madécassoside, pas le madécassoside seul.

**Thé vert en application (C).** Elmets 2001 (moins d'érythème UV, expérimental). Chiu 2005 (ECR : aucune différence clinique, plus d'irritation). Mahmood 2010 et 2013 (petites études, sébum réduit).

### 2.2 Moment d'application et associations

| Règle | Fondement |
|---|---|
| Écran solaire chaque matin, et obligatoire avec rétinoïdes et AHA | Kaidbey 2003, avertissement FDA pour les AHA ; photosensibilité connue des rétinoïdes |
| Rétinoïde le soir | Sensibilité à la lumière du rétinol (dégradation) et à la peau ; pratique standard |
| Vitamine C le matin | Rôle antioxydant sous les UV, en complément de l'écran (Lin 2005) |
| Pas de rétinoïde et d'AHA/BHA le même soir ; alterner | Pratique courante pour limiter l'irritation ; pas d'essai qui le démontre |
| Rétinoïde : pas en même temps qu'un complément de vitamine A | Motif même du Règlement (UE) 2024/996 (cumul des apports) |
| Vitamine C et niacinamide dans la même routine | Souvent dite incompatible ; aucune donnée clinique trouvée pour l'affirmer ; ne pas l'interdire, ne pas en parler |

---

## 3. Les paires (le tableau COMBO)

Phrase obligatoire sous chaque paire : « Aucune étude n'a testé cette association. Chaque côté a ses propres preuves, indiquées séparément ; on ne peut pas dire que les deux ensemble font mieux que chacun seul. »

| Indice | Ordre | Aliment (grade peau) | Actif (grade pour cet indice) | Pourquoi (même cible, voie différente) |
|---|---|---|---|---|
| Hydratation | 1 | eau (C) | glycérine / acide hyaluronique (A) | Boire aide surtout ceux qui boivent peu ; les humectants hydratent les couches supérieures de l'épiderme |
| Hydratation | 2 | graines de lin (C) | céramides (B) | Oméga-3 végétaux ; barrière de surface qui retient l'eau |
| Hydratation | 3 | cacao en poudre non sucré (C) | panthénol (B) | Cacao riche en flavanols : hydratation cutanée dans un petit essai ; panthénol hydratant |
| Éclat | 1 | poivron rouge (C) | vitamine C (B) | Même nutriment, deux voies ; allégation UE vitamine C citée mot pour mot |
| Éclat | 2 | carotte (C) | AHA (B) + écran le matin | Caroténoïdes colorant la peau ; exfoliation de surface |
| Éclat | 3 | patate douce (C) | niacinamide (B) | Caroténoïdes ; teint moins terne et jaune (Bissett 2005) |
| Rougeurs | 1 | concentré de tomate cuit à l'huile (B) | protection solaire (A) | Même cible, les UV |
| Rougeurs | 2 | sardine (C) | niacinamide (B) | Même vitamine B3 : « La niacine contribue au maintien d'une peau normale » ; niacinamide pour l'apparence des rougeurs |
| Rougeurs | 3 | thé vert (C) | panthénol (B) | Polyphénols (essais contradictoires) ; apaisement et barrière |
| Pores / sébum | 1 | lentille (B, via régime à faible charge glycémique) | niacinamide 2 % (B) | Charge glycémique et lésions d'acné ; sébum de surface réduit |
| Pores / sébum | 2 | flocons d'avoine (B, même logique) | acide salicylique (B) | Céréale complète ; désincrustation des pores |
| Uniformité | 1 | amande (B, financement filière) | protection solaire (A) | Même cible, les taches ; l'écran reste la première mesure |
| Uniformité | 2 | concentré de tomate (C pour la pigmentation) | niacinamide (A) | Moindre sensibilité aux UV ; apparence des taches |
| Uniformité | 3 | amande (B) | acide tranexamique (B) | Moins de pigmentation dans un essai ; apparence des taches |
| Rides / fermeté | 1 | avocat (B, pilote financé par la filière) | protection solaire (A) | Même cible, le vieillissement lié au soleil |
| Rides / fermeté | 2 | amande (B) | rétinol / rétinal (B), masqué si grossesse | Moins de rides dans 2 petits essais ; apparence des rides |
| Rides / fermeté | 3 | kiwi (C) | vitamine C (B) | Même nutriment, deux voies ; allégation UE vitamine C mot pour mot |
| Texture | 1 | cacao en poudre non sucré (C) | AHA (B) + écran le matin | Moins de rugosité (cacao riche en flavanols) ; grain de peau lissé |
| Texture | 2 | noix (C) | rétinol / rétinal (B), masqué si grossesse | Oméga-3 associés à moins de photovieillissement (observation) ; rugosité réduite (Creidi 1998) |

Paires solides des deux côtés (B ou mieux) : concentré de tomate + écran (rougeurs), lentille + niacinamide et avoine + acide salicylique (pores), amande + écran, amande + acide tranexamique (uniformité), avocat + écran, amande + rétinol (rides). Mais les aliments B reposent sur de petits essais, souvent financés par la filière.
Paires faibles côté aliment (C) : toutes les autres ; les garder avec l'étiquette « preuves limitées ».

Règles d'affichage (reprises dans `combos.json`, `_meta.regles_affichage`) : écran en premier pour rougeurs, uniformité et rides ; un actif `exige_spf` déclenche l'affichage d'un écran ; grossesse = « éviter » masque la paire ; exclusions alimentaires du questionnaire appliquées à l'aliment ; allégation alimentaire mot pour mot.

---

## 4. Ce que la loi permet de dire

### 4.1 Côté cosmétique (UE)

- Règlement (CE) 1223/2009, article 20 : dans l'étiquetage, la mise à disposition et la publicité, aucun texte, nom, marque, image ou signe ne doit laisser croire qu'un cosmétique a des caractéristiques ou fonctions qu'il n'a pas.
- Règlement (UE) 655/2013, six critères communs : conformité légale (pas d'« approuvé par les autorités »), véracité, éléments probants, sincérité (ne pas aller au-delà des preuves), équité (ne pas dénigrer), choix en connaissance de cause (compréhensible par l'utilisateur moyen).
- Document technique de la Commission sur les allégations (sous-groupe « claims », juillet 2017), deux points décisifs pour vyvre :
  - une allégation qui transpose les propriétés d'un ingrédient au produit fini doit être prouvée, par exemple en démontrant la présence de l'ingrédient à une concentration efficace ;
  - l'ingrédient mis en avant doit être présent volontairement, et ses propriétés ne doivent pas faire croire que le produit fini les possède s'il ne les a pas.
  Conséquence : vyvre peut dire « ce soin contient de la niacinamide, un actif étudié pour… », jamais « ce soin réduit vos taches ».
- Un produit présenté comme traitant ou prévenant une maladie devient un médicament par présentation (Directive 2001/83/CE, article 1). À bannir : « traite l'acné », « soigne la rosacée », « guérit l'eczéma », « répare l'ADN », « cicatrisant », « anti-inflammatoire », « dépigmentant », « effet botox ».
- Formulations acceptables : « aide à atténuer l'apparence de… », « contribue à un teint plus lumineux », « hydrate les couches supérieures de l'épiderme », « aide à préserver la barrière cutanée », « désincruste les pores », « pour les peaux à imperfections ».
- Solaires (Recommandation 2006/647/CE) : pas de « sunblock », « écran total », « protection 100 % ».
- Rétinol : étiquette « vitamine A » obligatoire ; trétinoïne interdite (annexe II n° 375) ; acide salicylique restreint (annexe III n° 98).

### 4.2 Côté aliment

Inchangé : Règlement (CE) 1924/2006, seules les allégations du registre UE (Règlement (UE) 432/2012), mot pour mot, si l'aliment remplit la condition, avec la mention « alimentation variée et équilibrée et mode de vie sain » (voir `REGLES_RECOMMANDATION.md`, section 4). Une paire ne doit jamais transformer l'allégation alimentaire (ex. interdit : « la vitamine C du kiwi fabrique votre collagène »).

### 4.3 À faire valider par un juriste

Statut de vyvre quand il met en avant des produits tiers (publicité au sens de l'article 20 ? affiliation ?), libellé français officiel de l'étiquette vitamine A, et formulation des paires mêlant allégation alimentaire et allégation cosmétique sur un même écran.

---

## 5. Le catalogue : peut-on retrouver les produits ?

- `public/scan/catalogue/all.json` : 5 831 produits, **aucun champ ingrédients**. Champs : id, name, brand, brand_name, categorie, univers, price_eur, targets, concern_scores, score_raisons, url, image_url, pays…
- Les ingrédients sont dans les fichiers par marque `public/scan/catalogue/<marque>.json` (6 157 produits, tous ceux de `all.json` s'y retrouvent par `id`), champ **`ingredients`** (chaîne INCI brute) ; aussi `description`, `claims`, `mode_emploi`. Pas de champ `inci`, `key_ingredients` ni `actives`.
- 2 951 produits sur 5 831 (51 %) ont une liste de plus de 30 caractères. 31 marques sur 151 n'en ont aucune (dont Neutrogena, Guinot, Mizon, Payot, Kiehl's, La Prairie, Weleda, Clé de Peau).
- Qualité : séparateurs virgule ou point selon la marque ; texte parasite de page web parfois collé en fin de chaîne (ex. « Skip to content ») : couper avant de chercher.
- Type de produit : champ **`categorie`** : creme 1 444, serum 1 095, nettoyant 850, masque 511, contour-yeux 504, solaire-visage 500, lotion 440, exfoliant 274, huile 126, autre-visage 87. Gamme : `univers` (luxe, normal, petit-prix, pharmacie). Soucis : `targets` (hydration, glow, redness, pores, sebum, pigmentation, wrinkles, firmness).

Comptage (sur les 2 951 produits avec INCI, sauf écran solaire) :

| Actif | Produits détectés | Actif dans les 10 premiers ingrédients | Dont crèmes | Dont sérums | Formes faibles seules |
|---|---|---|---|---|---|
| Protection solaire | 511 (500 solaire-visage + 11 avec SPF dans le nom) | sans objet | 8 | 0 | |
| Rétinol / rétinal | 151 (rétinol 124, rétinal 37) | 28 | 34 | 58 | 68 (esters, HPR) |
| Vitamine C (acide ascorbique) | 148 | 36 | 32 | 42 | 405 (dérivés) |
| Niacinamide | 746 | 592 | 168 | 204 | |
| Acide azélaïque | 40 | 26 | 10 | 14 | 9 |
| AHA (glycolique 130, lactique 264, mandélique 35) | 357 | 156 | 59 | 96 | 103 |
| Acide salicylique | 220 | 92 | 38 | 40 | 61 (LHA, bétaïne) |
| Céramides | 381 | 55 | 118 | 86 | |
| Glycérine (rang ≤ 5) ou acide hyaluronique | 2 292 | 2 113 | 597 | 502 | |
| Peptides | 633 | 100 | 183 | 187 | |
| Acide tranexamique | 37 | 18 | 11 | 16 | |
| Bakuchiol | 52 | 17 | 15 | 26 | |
| Panthénol | 645 | 270 | 149 | 137 | |
| Centella | 354 | 81 | 89 | 87 | |
| Thé vert (feuille) | 245 | 56 | 47 | 49 | 30 |

Règle proposée : ne proposer un produit que si l'actif est dans les 10 premiers ingrédients (glycérine : 5 premiers) ; afficher « contient X » et non « fait Y ». Le rang n'est qu'une indication : sous 1 %, l'ordre des ingrédients est libre.

---

## 6. Ce qui n'est pas vérifié

- Libellé français officiel de l'étiquette vitamine A (seul le libellé anglais est repris de sources concordantes ; EUR-Lex a bloqué la lecture directe du texte).
- Limites exactes de l'acide salicylique (2 %, moins de 3 ans) : reprises de sources secondaires concordantes ; la référence III/98 est confirmée dans CosIng.
- Financement de Spada 2018 et rôle du co-auteur Graupe (Verallo-Rowell 1989).
- Le SPF exact utilisé dans Hughes 2013 (texte intégral non relu).
- Sécurité pendant la grossesse de la vitamine C, de la niacinamide, des AHA, du BHA en soin visage, des peptides, de l'acide tranexamique, du bakuchiol, de la centella et du thé vert : aucune fiche CRAT trouvée (d'où « avis »).
- Qu'un produit donné du catalogue contienne l'actif à dose efficace : impossible à savoir à partir de l'INCI.

---

## 7. Références vérifiées (PubMed)

Protection solaire : Hughes MC 2013 Ann Intern Med PMID 23732711 ; Green A 1999 Lancet PMID 10475183 ; Green AC 2011 J Clin Oncol PMID 21135266 ; Boukari F 2015 J Am Acad Dermatol PMID 25443629 ; Randhawa M 2016 Dermatol Surg PMID 27749441.
Rétinoïdes : Kafi R 2007 Arch Dermatol PMID 17515510 ; Randhawa M 2015 J Drugs Dermatol PMID 25738849 ; Creidi P 1998 J Am Acad Dermatol PMID 9843009 ; Kong R 2016 J Cosmet Dermatol PMID 26578346 ; Mukherjee S 2006 Clin Interv Aging PMID 18046911 ; Weiss JS 1988 JAMA PMID 3336176.
Vitamine C : Humbert PG 2003 Exp Dermatol PMID 12823436 ; Traikovich SS 1999 Arch Otolaryngol Head Neck Surg PMID 10522500 ; Espinal-Perez LE 2004 Int J Dermatol PMID 15304189 ; Pinnell SR 2001 Dermatol Surg PMID 11207686 ; Lin FH 2005 J Invest Dermatol PMID 16185284 ; Al-Niaimi F 2017 J Clin Aesthet Dermatol PMID 29104718.
Niacinamide : Bissett DL 2005 Dermatol Surg PMID 16029679 ; Hakozaki T 2002 Br J Dermatol PMID 12100180 ; Navarrete-Solís J 2011 Dermatol Res Pract PMID 21822427 ; Draelos ZD 2006 J Cosmet Laser Ther PMID 16766489 ; Draelos ZD 2005 Cutis PMID 16209160 ; Tanno O 2000 Br J Dermatol PMID 10971324 ; Boo YC 2021 Antioxidants PMID 34439563.
Acide azélaïque : Elewski BE 2003 Arch Dermatol PMID 14623704 ; Verallo-Rowell VM 1989 Acta Derm Venereol Suppl PMID 2528260 ; Schulte BC 2015 J Drugs Dermatol PMID 26355614.
AHA : Stiller MJ 1996 Arch Dermatol PMID 8651713 ; Ditre CM 1996 J Am Acad Dermatol PMID 8642081 ; Kaidbey K 2003 Photodermatol Photoimmunol Photomed PMID 12713551 ; Kornhauser A 2010 Clin Cosmet Investig Dermatol PMID 21437068.
Acide salicylique : Reynolds RV 2024 J Am Acad Dermatol PMID 38300170 ; Arif T 2015 Clin Cosmet Investig Dermatol PMID 26347269 ; Lee HS 2003 Dermatol Surg PMID 14725662.
Céramides : Spada F 2018 Clin Cosmet Investig Dermatol PMID 30410378 ; Lueangarun S 2019 Dermatol Ther PMID 31585489 ; Coderch L 2003 Am J Clin Dermatol PMID 12553851.
Humectants : Lodén M 2002 Acta Derm Venereol PMID 12013198 ; Breternitz M 2008 Skin Pharmacol Physiol PMID 18025807 ; Fluhr JW 2008 Br J Dermatol PMID 18510666 ; van Zuuren EJ 2017 Cochrane PMID 28166390 ; Pavicic T 2011 J Drugs Dermatol PMID 22052267.
Peptides : Robinson LR 2005 Int J Cosmet Sci PMID 18492182 ; Blanes-Mira C 2002 Int J Cosmet Sci PMID 18498523 ; Gorouhi F 2009 Int J Cosmet Sci PMID 19570099.
Acide tranexamique : Ebrahimi B 2014 J Res Med Sci PMID 25422661 ; Kim SJ 2016 Clin Exp Dermatol PMID 27135282 ; Kim HJ 2017 Acta Derm Venereol PMID 28374042 ; Taraz M 2017 Dermatol Ther PMID 28133910.
Bakuchiol : Dhaliwal S 2019 Br J Dermatol PMID 29947134 ; Chaudhuri RK 2014 Int J Cosmet Sci PMID 24471735.
Panthénol : Proksch E 2002 J Dermatolog Treat PMID 19753737 ; Camargo FB Jr 2011 J Cosmet Sci PMID 21982351 ; Gehring W 2000 Arzneimittelforschung PMID 10965426 ; Proksch E 2017 J Dermatolog Treat PMID 28503966.
Centella : Bylka W 2013 Postepy Dermatol Alergol PMID 24278045 ; Ratz-Łyko A 2016 Indian J Pharm Sci PMID 27168678 ; Haftek M 2008 Exp Dermatol PMID 18503551.
Thé vert : Elmets CA 2001 J Am Acad Dermatol PMID 11209110 ; Chiu AE 2005 Dermatol Surg PMID 16029678 ; Mahmood T 2010 Bosn J Basic Med Sci PMID 20846135 ; Mahmood T 2013 Hippokratia PMID 23935347.

Textes et organismes : Règlement (CE) 1223/2009 (article 20) ; Règlement (UE) 655/2013 (annexe, critères communs, lu sur legislation.gov.uk) ; Règlement (UE) 2024/996 (vitamine A) ; Recommandation 2006/647/CE (solaires) ; Commission européenne, Technical document on cosmetic claims (juillet 2017, lu dans le texte) ; SCCNFP/0370/00 (AHA, 28 juin 2000, lu dans le texte) ; FDA, page « Alpha Hydroxy Acids » ; base CosIng (API officielle, statut de chaque ingrédient) ; ANSM, décision du 25/10/2018 sur les rétinoïdes cutanés (résumé VIDAL) ; CRAT, fiche acide azélaïque (lecrat.fr/6347).
