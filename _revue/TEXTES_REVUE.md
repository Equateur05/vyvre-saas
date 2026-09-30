# Revue des textes · Votre assiette

Fichiers relus le 30/09/2026 : `public/scan/aliment/vy-aliment.js` (583 lignes) et `public/scan/aliment/combos.json` (actifs + combos). Numéros de ligne au 30/09.

Convention de la colonne « Après » : chaque espace avant `: ; ? ! %` et à l’intérieur de `« »` est une espace fine insécable (U+202F, à écrire ` ` dans le JS). La colonne « Avant » reste strictement identique au code, pour la recherche. `{x}` = une variable du code.

Ne jamais toucher : les allégations UE entre guillemets (combos `poivron_rouge`, `sardine`, `kiwi` ; champ `allegation_UE_autorisee`), la phrase « À intégrer dans une alimentation variée et équilibrée et un mode de vie sain. » (assiette(), l. 467), les numéros 15, 112 et 39 89.

---

## 1. Verdict

1. Le fond est rare et juste : honnête, sourcé, sans promesse ; le « nous/vous » tient, la retenue est déjà celle d’une grande maison.
2. La voix glisse par endroits vers l’ingénieur (« candidats », « écartés », « Nous lisons. », « Pas pour moi · rétablir ») ou le familier (« Toujours pareil ? »).
3. Aux moments clés, les phrases sont trop longues : le consentement, l’avertissement complet, et « Pourquoi cette sélection » (plus de 60 mots d’un seul souffle).
4. Deux erreurs de sens : « Une famille par aliment » dit l’inverse de la règle (un aliment par famille) ; « ces deux indices » s’affiche même quand il n’y en a qu’un. Le bloc « Près de vous » numérote « ma » au lieu de « 01 ».
5. Urgence : combos.json envoie des notes internes à l’écran (« l'afficher », « non relu dans le texte intégral », « peau de porc », « les signaler comme formes faibles »), et la phrase d’honnêteté s’affiche jusqu’à quatre fois par écran.
6. Typographie : zéro espace fine sur environ 420 ponctuations doubles ; combos.json est entièrement en apostrophes droites ; le règlement se cite « (CE) n° 1924/2006 ».

---

## 2. Avant → après

### Carte d’entrée · entree()

| # | Où | Avant | Après |
|---|---|---|---|
| 1 | entree(), l. 251, `<p>` | Jusqu’à quatre aliments du quotidien, choisis d’après votre lecture ({I1}, {I2}), avec ce que la science sait vraiment. | Jusqu’à quatre aliments, choisis d’après votre lecture : {i1}, {i2}. Pour chacun, ce que les études montrent. Rien de plus. *(indices en minuscules : `INDICES[..].toLowerCase()` ; « du quotidien » retiré car l’option « Des découvertes » existe)* |
| 2 | entree(), l. 251, `.m` | Nouveau · votre assiette | Nouveau · Votre assiette |

### Retour · pareil()

| # | Où | Avant | Après |
|---|---|---|---|
| 3 | pareil(), l. 284, `<h1>` | Toujours pareil ? | Rien n’a changé ? |
| 4 | pareil(), l. 286, `#vy-as-change` | Quelque chose a changé | Modifier mes réponses |
| 5 | pareil(), l. 287, `#vy-as-autre` | Une autre personne ? | Pour une autre personne |
| 6 | pareil(), l. 291, message | Réponses effacées de cet appareil. | Vos réponses sont effacées de cet appareil. |

### « Quelque chose à éviter ? » · eviter(), phrase()

| # | Où | Avant | Après |
|---|---|---|---|
| 7 | eviter(), l. 298, `.m` | Avant votre assiette · une seule question | Une seule question, avant votre assiette |
| 8 | eviter(), l. 298, `.lead` | Nous écartons ce qui ne vous convient pas avant de choisir quoi que ce soit. | D’abord, nous retirons ce qui ne vous convient pas. Ensuite seulement, nous choisissons. |
| 9 | eviter(), l. 295, `CASES` anticoagulant | fluidifiant du sang | traitement qui fluidifie le sang |
| 10 | eviter(), l. 295, `CASES` reins | ou des calculs | ou des calculs rénaux |
| 11 | eviter(), l. 301, sous-titre de `#vy-as-rien` | ni allergie, ni grossesse, ni anticoagulant, ni reins, ni régime végétarien | ni allergie, ni grossesse, ni anticoagulant, ni maladie des reins, ni régime végétarien ou végan |
| 12 | eviter(), l. 302, question | Et plutôt ? | Plutôt du quotidien, ou des découvertes ? *(garder `<small>FACULTATIF</small>`)* |
| 13 | eviter(), l. 302, puce `data-v=""` | Tous | Peu importe |
| 14 | phrase(), l. 263 et 271 | Touchez « Rien de particulier » ou ce qui vous concerne. | Touchez ce qui vous concerne, ou « Rien de particulier ». |
| 15 | eviter() › maj(), l. 325, `#vy-as-compte` | Il reste {n} aliments pour composer votre assiette | {n} aliments possibles pour votre assiette |
| 16 | eviter() › maj(), l. 313, `<small>` | TOUTES CELLES QUI VOUS CONCERNENT | PLUSIEURS CHOIX POSSIBLES |
| 17 | `ALLERG`, l. 261 | ['arachides','Arachide'] · ['autre','Une autre'] | ['arachides','Arachides'] · ['autre','Un autre aliment'] *(pluriel aligné sur Crustacés, Mollusques)* |
| 18 | eviter() › maj(), l. 314, `.fine` | Nous ne proposons que ces aliments : cochez ceux qui ne vous conviennent pas, ils n’apparaîtront nulle part, ni dans une recette. | Voici tous nos aliments. Touchez ceux qui ne vous conviennent pas : ils n’apparaîtront nulle part, pas même dans une recette. |
| 19 | eviter() › maj(), l. 315, `.fine` | Ces aliments disparaissent de l’assiette, des recettes et des combos. Nous ne remplaçons pas votre allergologue. | Ces aliments disparaissent de l’assiette, des recettes et des combos. Cela ne remplace pas l’avis de votre allergologue. |
| 20 | eviter() › maj(), l. 318, grossesse | Nous écartons le thé vert et les soins déconseillés pendant la grossesse, comme les rétinoïdes. Le saumon : seulement bien cuit. Zéro alcool. | Nous écartons le thé vert et les soins déconseillés pendant la grossesse, comme les rétinoïdes. Le saumon : seulement bien cuit, jamais fumé. Zéro alcool. *(« jamais fumé » = la note déjà affichée sur la carte saumon, l. 107)* |
| 21 | eviter(), l. 304, consentement | {Vous avez 18 ans ou plus. }Vos réponses concernent votre santé. En acceptant, vous nous autorisez à nous en servir pour une seule chose : écarter des aliments et des soins. Elles restent sur cet appareil, ne nous sont jamais envoyées et s’effacent quand vous fermez la page. | {Vous confirmez avoir 18 ans ou plus. }Vos réponses concernent votre santé. En acceptant, vous nous autorisez à nous en servir pour une seule chose : écarter des aliments et des soins. Elles restent sur cet appareil. Elles ne nous sont jamais envoyées. Elles s’effacent quand vous fermez la page. *(à faire valider : l’attestation d’âge devient explicite)* |
| 22 | eviter(), l. 307, `.fine` | Information générale, pas un avis médical. Après un repas, gonflement du visage ou gêne respiratoire : appelez le 15 ou le 112. | Information générale, pas un avis médical. Gonflement du visage ou gêne respiratoire après un repas : appelez le 15 ou le 112. |
| 23 | eviter(), l. 308, `<details>` | Les suggestions d’aliments de vyvre sont des informations générales sur l’alimentation. Elles ne constituent ni un diagnostic, ni un traitement, ni un avis médical ou diététique personnalisé, et ne remplacent pas une consultation. Les indices de votre scan sont des mesures optiques de l’image de votre peau : aucun aliment n’a été étudié pour les modifier, et nous ne promettons aucun résultat. Les aliments proposés s’intègrent dans une alimentation variée et équilibrée et un mode de vie sain. Si vous avez une allergie, une maladie, un traitement en cours, si vous êtes enceinte ou allaitez, ou pour un enfant, demandez l’avis de votre médecin ou de votre pharmacien avant de modifier votre alimentation. En cas de réaction allergique grave (gonflement du visage, gêne respiratoire), appelez le 15 ou le 112. | Les suggestions d’aliments de vyvre sont des informations générales sur l’alimentation. Elles ne sont ni un diagnostic, ni un traitement, ni un avis médical ou diététique personnalisé. Elles ne remplacent pas une consultation. Les indices de votre scan sont des mesures optiques de l’image de votre peau. Aucun aliment n’a été étudié pour les modifier, et nous ne promettons aucun résultat. Les aliments proposés s’intègrent dans une alimentation variée et équilibrée et un mode de vie sain. Allergie, maladie, traitement en cours, grossesse, allaitement, ou pour un enfant : demandez l’avis de votre médecin ou de votre pharmacien avant de modifier votre alimentation. Réaction allergique grave (gonflement du visage, gêne respiratoire) : appelez le 15 ou le 112. |

### Composition, la roue et son journal · lancer()

| # | Où | Avant | Après |
|---|---|---|---|
| 24 | lancer(), l. 403, `#vy-as-ct` | Nous lisons. | Nous trions. |
| 25 | lancer(), l. 419, `etapes[0]` | {N} aliments dans la base · teneurs CIQUAL 2020 (ANSES) | {N} aliments au départ · composition CIQUAL 2020 (ANSES) |
| 26 | lancer(), l. 419, `etapes[1]` | − {n} écartés pour tous : algues, soja, pamplemousse, huître, noix du Brésil | − {n} écartés pour tous, par prudence : algues, soja, pamplemousse, huître, noix du Brésil |
| 27 | lancer(), l. 421 | {n} candidats pour ces deux indices | {n} aliments étudiés pour {ces deux indices / cet indice} *(bug : le pluriel s’affiche même si `ind.i2` est vide)* |
| 28 | lancer(), l. 421 | Les preuves d’abord, puis la saison ({mois}) et vos goûts | Classement : les preuves d’abord, puis la saison ({mois}) et vos goûts |
| 29 | lancer(), l. 421 | Une famille par aliment, jamais deux fois le même nutriment | Un aliment par famille, jamais deux fois le même nutriment *(l’original dit l’inverse de la règle de choisir())* |
| 30 | lancer(), l. 426 | ['Première', 'Deuxième', 'Troisième', 'Quatrième'][k] + ' place.' | ['Premier', 'Deuxième', 'Troisième', 'Quatrième'][k] + ' choix.' |
| 31 | lancer(), l. 431, ligne du journal | {01} · {Carotte} · preuve {B} · pour {éclat} · de saison | {01} · {Carotte} · preuve {B} · {Éclat} · de saison *(« pour éclat » sans article sonne machine)* |
| 32 | lancer(), l. 406, `#vy-as-passer` | Passer | Voir l’assiette tout de suite |

### L’assiette · assiette(), PHRASE, PREUVE, FREQ, prix(), affiner()

| # | Où | Avant | Après |
|---|---|---|---|
| 33 | assiette(), l. 437, `titres[0]` | Rien. | Aucun aliment. |
| 34 | assiette(), l. 447, `.lead` prudent | Sans vos réponses, nous ne gardons que des aliments sans aucun des 14 allergènes majeurs ni précaution médicale connue. Pour une assiette sur mesure, répondez à une seule question. Répondre | Sans vos réponses, nous ne gardons que des aliments sans aucun des 14 allergènes majeurs ni précaution médicale connue. Pour une assiette sur mesure, une seule question suffit. Répondre à la question |
| 35 | assiette(), l. 448, `.m` | Pourquoi cette sélection pour vous | Pourquoi ces aliments, pour vous |
| 36 | assiette(), l. 448, `.lead` | Votre lecture montre d’abord {i1} ({n1} sur 100), puis {i2} ({n2} sur 100). Parmi {N} aliments, nous avons gardé ceux qui ont été étudiés pour ces points, écarté {x} aliments {pour tous ou d’après vos réponses / par prudence}, puis classé par solidité des preuves, saison et goûts. Une seule famille par aliment, pour varier. | Votre lecture montre d’abord {i1} ({n1} sur 100), puis {i2} ({n2} sur 100). Sur {N} aliments, nous en avons écarté {x}, {pour tous ou d’après vos réponses / par prudence}. Parmi les autres, nous avons gardé ceux qui ont été étudiés pour ces points. Puis nous les avons classés : les preuves d’abord, ensuite la saison et vos goûts. Un seul aliment par famille, pour varier. |
| 37 | assiette(), l. 449, cas vide | Vos réponses écartent tous les aliments liés à vos indices. Nous préférons ne rien proposer plutôt qu’un aliment sans rapport. | Vos réponses écartent tous les aliments étudiés pour vos indices. Plutôt qu’un aliment sans rapport, nous préférons ne rien proposer. |
| 38 | `PHRASE.hydratation`, l. 15 | L’eau n’aide la peau que si l’on boit peu. L’hydratation de surface dépend d’abord des soins et de l’environnement. | Boire davantage n’aide la peau que si vous buvez peu. L’hydratation de surface dépend d’abord des soins et de l’environnement. *(l’original se lit « l’eau n’aide que les petits buveurs » au premier regard)* |
| 39 | `PHRASE.eclat`, l. 16 | Les pigments orangés des végétaux se déposent dans la peau ; une étude a relié plus de fruits et légumes à un teint jugé plus sain en six semaines. | Les pigments orangés des végétaux se déposent dans la peau. Dans une étude, plus de fruits et légumes ont été reliés à un teint jugé plus sain, en six semaines. |
| 40 | `PHRASE.pores_sebum`, l. 18 | Féculents complets et légumineuses : une alimentation à faible charge glycémique. | Féculents complets et légumineuses composent une alimentation à faible charge glycémique. |
| 41 | `PHRASE.texture`, l. 21 | Les données sont encore limitées. | Sur le grain de peau, les données restent limitées. |
| 42 | `PREUVE`, l. 33 (rendu « Preuve A · Preuves solides… », l. 460) | A:'Preuves solides : plusieurs essais cliniques.' · B:'Preuves modérées : au moins un essai clinique, souvent petit.' · C:'Preuves limitées pour un effet visible sur la peau : observations ou mécanismes.' | A:'solide : plusieurs essais cliniques.' · B:'modérée : au moins un essai clinique, souvent petit.' · C:'limitée pour un effet visible sur la peau : observations ou mécanismes.' *(rendu : « Preuve A · solide : … », sans le doublon)* |
| 43 | `FREQ.boisson`, l. 160 | Sans sucre ajouté. | Au fil de la journée, sans sucre ajouté. |
| 44 | prix(), l. 392 | {€€} · estimation d’après la catégorie, pas de prix relevé pour cet aliment. | {€€} · niveau estimé d’après la catégorie ; aucun prix relevé pour cet aliment. |
| 45 | assiette(), l. 465, `.vy-as-pas` | Pas pour moi | Retirer cet aliment |
| 46 | affiner(), l. 386, `#vy-as-pp` | Pas pour moi ({n}) · rétablir | Rétablir les aliments retirés ({n}) |
| 47 | affiner(), l. 384 | Je privilégie le bio | Bio de préférence |
| 48 | affiner(), l. 388, `.fine` bio | Le bio n’a pas montré d’effet propre sur la peau dans notre étude ; il coûte en moyenne plus cher (fruits +61 %, légumes +67 %, Familles Rurales, juin 2026). | Dans notre revue des études, le bio n’a pas montré d’effet propre sur la peau. Il coûte en moyenne plus cher : fruits +61 %, légumes +67 % (Familles Rurales, juin 2026). |
| 49 | assiette(), l. 441, alerte acné | Si votre acné est douloureuse, laisse des cicatrices ou dure : consultez un médecin ou un dermatologue. | Acné douloureuse, qui laisse des cicatrices ou qui dure : consultez un médecin ou un dermatologue. |
| 50 | assiette(), l. 444, alerte allergie | Nous ne remplaçons pas votre allergologue. | Cela ne remplace pas l’avis de votre allergologue. |
| 51 | assiette(), l. 474, `<small>` Garder | La prochaine fois, une seule question : « Toujours pareil ? ». Rien n’est envoyé. Effacement automatique dans six mois. | La prochaine fois, une seule question vous sera posée. Vos réponses ne quittent pas cet appareil. Effacement automatique dans six mois. |
| 52 | assiette(), l. 477, `.fine` | Allégations : registre de l’Union européenne (Règlement 1924/2006). | Allégations : registre de l’Union européenne, règlement (CE) n° 1924/2006. |

### Rythme · rythme()

| # | Où | Avant | Après |
|---|---|---|---|
| 53 | rythme(), l. 512, `.lead` | Ce que les grandes études montrent le plus solidement pour vivre longtemps en bonne santé, adapté à vos réponses. | Les repères de santé les plus solides des grandes études, adaptés à vos réponses. *(retire la promesse implicite de longévité)* |
| 54 | rythme(), l. 503, Dormir, `plus9` | Un sommeil très long et régulier peut justifier d’en parler à votre médecin. | Plus de neuf heures par nuit, d’habitude ? Cela peut valoir la peine d’en parler à votre médecin. |
| 55 | rythme(), l. 503, Dormir, `irregulier` | Priorité à la régularité : même heure de lever, lumière du jour le matin. Travail de nuit : pas de fenêtre alimentaire sans avis médical. | Priorité à la régularité : même heure de lever, lumière du jour le matin. Travail de nuit : pas de jeûne ni de repas limités à une plage horaire sans avis médical. |
| 56 | rythme(), l. 511, Bouger | Et vous, par jour ? Votre téléphone le sait : app Santé ou Google Fit. | Et vous, par jour ? Votre téléphone le mesure : app Santé ou Google Fit. |
| 57 | rythme(), l. 508, protéines | Après 65 ans, des protéines à chaque repas (œufs, poisson, légumineuses) aident à garder ses muscles. | Après 65 ans, des protéines à chaque repas (œufs, poisson, légumineuses) aident à garder vos muscles. |
| 58 | rythme(), l. 498, mineur | Une heure par jour en moyenne (OMS 2020). | Une heure d’activité par jour en moyenne (OMS 2020). |

### Combo · combos() (vy-aliment.js)

| # | Où | Avant | Après |
|---|---|---|---|
| 59 | combos(), l. 359, `.m` | Premium · combo aliment + crème et sérum | Premium · Un aliment, un soin |
| 60 | combos(), l. 359, `.lead` | Pour la même cible, un aliment de l’intérieur et un actif de soin de l’extérieur. Chacun a ses propres preuves ; aucune étude n’a testé leur association, nous ne promettons donc aucun effet combiné. | Pour une même cible, un aliment à table et un actif en soin. Chacun a ses propres preuves. Aucune étude n’a testé les deux ensemble : nous ne promettons donc aucun effet combiné. |
| 61 | combos(), l. 362, `.sous` | · aliment : preuve {B} · actif : preuve {A} | · aliment : preuve {B} · soin : preuve {A} |
| 62 | combos(), l. 365 et l. 369 | ' (dans les essais : ' + ac.concentration_efficace + ')' puis, à nouveau, ' · ' + ac.concentration_efficace | Afficher une seule fois un nouveau champ court `dose_affichee` (textes en 2 bis) ; supprimer la ligne `.preuve` de la l. 369, qui répète le moment et la dose. |
| 63 | combos(), l. 366 et l. 372 | Chaque matin : une protection solaire. + Avec cet actif, une protection solaire chaque matin est indispensable. | Garder seulement la seconde, en l. 372. La même consigne apparaît deux fois dans la même carte. |
| 64 | combos(), l. 368 | {phrase_honnete} (répétée sur chaque carte) | Ne plus l’afficher par carte : le `.lead` du bloc (ligne 60) le dit déjà. Si le juridique veut la garder par carte, utiliser le texte de la ligne 65. |
| 65 | combos(), l. 374 | En complément, dans notre catalogue | Dans notre catalogue |

### combos.json

| # | Où | Avant | Après |
|---|---|---|---|
| 66 | `combos[*].phrase_honnete` (19 fois) et `_meta.phrase_honnete_standard` | Aucune étude n'a testé cette association. Chaque côté a ses propres preuves, indiquées séparément ; on ne peut pas dire que les deux ensemble font mieux que chacun seul. | Aucune étude n’a testé cette association. Chaque côté a ses propres preuves, indiquées à part. Rien ne permet de dire qu’ensemble, ils font mieux que chacun seul. |
| 67 | `actifs[niacinamide].precautions[1]` (affiché) | La plupart des essais sont petits et plusieurs sont financés par Procter & Gamble : l'afficher. | La plupart des essais sont petits ; plusieurs sont financés par un fabricant, Procter & Gamble. *(« l'afficher » est une note interne, visible aujourd’hui à l’écran)* |
| 68 | `actifs[ceramides].precautions[1]` (affiché) | Présence dans l'INCI ≠ quantité utile : souvent à l'état de traces (fin de liste). | Figurer dans la liste d’ingrédients ne veut pas dire en quantité utile : souvent à l’état de traces, en fin de liste. |
| 69 | `actifs[humectants].precautions[1]` (affiché) | Glycérine présente dans presque tous les soins : ne la compter que dans les 5 premiers ingrédients. | La glycérine est dans presque tous les soins. Elle ne compte vraiment que parmi les cinq premiers ingrédients. |
| 70 | `combos[eau/humectants].pourquoi` | Côté assiette, boire suffisamment aide surtout ceux qui boivent peu ; côté soin, la glycérine et l'acide hyaluronique hydratent les couches supérieures de l'épiderme. | À table, boire suffisamment aide surtout si vous buvez peu. En soin, la glycérine et l’acide hyaluronique hydratent les couches supérieures de l’épiderme. |
| 71 | `combos[poivron_rouge/vitamine_c].pourquoi` | Même nutriment, deux voies. Assiette (le poivron rouge en est source) : « La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau. » Soin : appliquée en sérum, la vitamine C contribue à un teint plus lumineux. | Un même nutriment, deux voies. À table, le poivron rouge en est source : « La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau. » En sérum, la vitamine C contribue à un teint plus lumineux. *(allégation inchangée, caractère pour caractère ; même traitement pour `kiwi/vitamine_c`)* |
| 72 | `combos[sardine/niacinamide].pourquoi` | Même vitamine (B3), deux voies. Assiette (la sardine en est source) : « La niacine contribue au maintien d'une peau normale. » Soin : la niacinamide aide à atténuer l'apparence des rougeurs et renforce la barrière de surface. | Une même vitamine, la B3, deux voies. À table, la sardine en est source : « La niacine contribue au maintien d'une peau normale. » En soin, la niacinamide aide à atténuer l’apparence des rougeurs et renforce la barrière de surface. *(allégation inchangée, apostrophe droite comprise)* |
| 73 | `combos[concentre_tomate/protection_solaire].pourquoi` | Même cible, les UV : le concentré de tomate cuit à l'huile a un peu réduit les coups de soleil après 10 à 12 semaines ; l'écran solaire est la protection de référence. | Une même cible, les UV. Cuit avec de l’huile, le concentré de tomate a un peu réduit les coups de soleil après 10 à 12 semaines. L’écran solaire est la protection de référence. |
| 74 | `combos[the_vert/panthenol].pourquoi` | Des boissons très concentrées en polyphénols de thé vert ont réduit l'érythème UV dans un essai (et pas dans un autre) ; le panthénol apaise et aide à préserver la barrière. | Des boissons très concentrées en polyphénols de thé vert ont réduit la rougeur due aux UV dans un essai, pas dans un autre. Le panthénol apaise et aide à préserver la barrière. |
| 75 | `combos[lentille/niacinamide].pourquoi` | Un régime à faible charge glycémique (légumineuses) a réduit les lésions d'acné dans deux essais ; la niacinamide à 2 % a réduit le sébum de surface. | Dans deux essais, une alimentation à faible charge glycémique, dont les légumineuses font partie, a réduit les lésions d’acné. La niacinamide à 2 % a réduit le sébum de surface. |
| 76 | `combos[avocat/protection_solaire].pourquoi` | Même cible, le relâchement lié au soleil : un avocat par jour a amélioré un peu la fermeté dans un essai pilote (financé par la filière) ; l'écran quotidien a ralenti le vieillissement visible sur 4,5 ans. | Une même cible, le relâchement lié au soleil. Dans un essai pilote financé par la filière, un avocat par jour a un peu amélioré la fermeté. L’écran quotidien a ralenti le vieillissement visible sur quatre ans et demi. |
| 77 | `combos[amande/retinoide].pourquoi` | Les amandes ont été associées à moins de rides dans deux petits essais (financés par la filière) ; le rétinol aide à atténuer l'apparence des rides. | Dans deux petits essais financés par la filière, les amandes ont été associées à moins de rides. Le rétinol aide à atténuer l’apparence des rides. |
| 78 | `combos[*].pourquoi`, `actifs[*].ce_qu_on_peut_dire`, `actifs[*].precautions` | apostrophes droites (118 dans le fichier) | apostrophe typographique ’ partout, sauf à l’intérieur des deux allégations UE citées. |

### 2 bis · Nouveau champ `dose_affichee` (combos.json › actifs)

Aujourd’hui, `concentration_efficace` part à l’écran tel quel, deux fois par carte. Il contient des notes de travail : « non relu dans le texte intégral » (protection solaire), « peau de porc » et « les signaler comme formes faibles » (vitamine C), l’historique réglementaire complet (rétinoïdes, AHA). Garder ce champ pour la documentation et afficher plutôt :

| Actif | dose_affichee |
|---|---|
| protection_solaire | SPF 30 ou plus, avec le logo UVA cerclé, en quantité suffisante, renouvelé en cas d’exposition |
| retinoide | rétinol de 0,1 à 0,4 % dans les essais ; en Europe, 0,3 % au plus pour le visage |
| vitamine_c | acide L-ascorbique de 5 à 20 %, à pH acide ; ses dérivés sont moins étudiés |
| niacinamide | 2 % pour le sébum, 4 à 5 % pour les taches et les ridules |
| aha | acide glycolique ou lactique à 8 % dans l’essai de référence |
| acide_salicylique | 0,5 à 2 %, sans rinçage ; 2 % au plus en Europe |
| ceramides | rarement indiquée ; les preuves portent sur des formules complètes |
| humectants | glycérine de 5 à 20 %, acide hyaluronique autour de 0,1 % |
| panthenol | 1 à 5 % |
| acide_tranexamique | 2 à 3 % |

### À faire vérifier (hors texte pur)

- Mode prudent (assiette(), l. 447) : le texte promet « ni précaution médicale connue », mais exclus(), l. 102, ajoute des notes latex et bouleau sur tomate, poivron et carotte dans ce même mode. Il faut soit adoucir le texte, soit retirer ces aliments. Décision juridique.
- Près de vous (chercher(), l. 576) : `t.nom.slice(0, 2)` affiche « ma » en chiffre italique. Remplacer par `n2(0)`.
- `QUESTIONS` (l. 22) et `RECETTES` (l. 38) sont déclarés mais jamais lus : c’est du texte mort, à retirer pour éviter qu’on corrige la mauvaise copie.
- Hors périmètre, non relu : `aliments_v2.json` (259 aliments, champs `mecanisme_simple` et `precautions`), qui a les mêmes apostrophes droites. Exemple à revoir : chou frisé, « nécessaire à la formation normale du collagène », paraphrase une allégation UE hors de sa forme autorisée.

---

## 3. Lignes de tête

### Carte d’entrée (h3, 58 px italique ; aujourd’hui « Assiette. »)

1. **À table.** Quatre aliments au plus, choisis d’après votre lecture.
2. **De la peau à l’assiette.** Votre lecture, puis ce que les études disent des aliments.
3. **Votre assiette.** Choisie d’après votre lecture, preuves à l’appui.
4. **L’assiette, lue.** Quatre aliments au plus, chacun avec le niveau de ses preuves.
5. **Peu, mais juste.** Quatre aliments au plus, choisis d’après votre lecture.

### Titre de l’assiette (h1, 76 px italique ; aujourd’hui « Quatre aliments. »)

Chaque ligne se décline selon le nombre choisi (un à quatre).

1. **Quatre, pour vous.** / Un, pour vous.
2. **Quatre aliments. Pas un de plus.** / Un aliment. Pas un de plus.
3. **Quatre, et leurs preuves.** / Un, et ses preuves.
4. **L’essentiel, en quatre.** / L’essentiel, en un.
5. **Votre assiette, en quatre.** / Votre assiette, en un.
