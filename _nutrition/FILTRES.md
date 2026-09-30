# Filtres avant l'« assiette » (pré-questions de goût, budget et courses)

Fichiers liés : `aliments_v2.json` (259 aliments), `recettes.json` (recettes), `QUESTIONNAIRE.md` (sécurité), `REGLES_RECOMMANDATION.md` (score peau).
Principe, comme les filtres avant le scan peau et le scan cheveux : quelques questions de goût posées avant l'assiette, sautables et modifiables à tout moment. **Elles classent, elles n'excluent jamais un aliment pour des raisons de sécurité et ne réintroduisent jamais un aliment exclu par le questionnaire.**

---

## 1. Ordre d'application (à respecter dans le code)

1. **Sécurité (dur, jamais contourné)** : signaux d'alerte, puis exclusions du `QUESTIONNAIRE.md` (allergènes, grossesse, traitements, reins, thyroïde, âge, régime Q7). Ce qui est exclu ici reste exclu, quelles que soient les réponses ci-dessous.
2. **Préférences qui retirent** (le choix de la personne, pas un conseil) : aliments non aimés (F6), temps de cuisine (F7, recettes seulement).
3. **Score peau** (`REGLES_RECOMMANDATION.md`, étape 4) : grade, correspondance à l'indice, saison, allégation, anti-répétition.
4. **Bonus des filtres** (F1 à F5 et F9) : additionnés puis **plafonnés entre −2 et +2** pour qu'ils ne dépassent jamais le poids du grade de preuve et de la correspondance à l'indice (un aliment de grade B qui cible l'indice principal vaut 2×2 + 2 = 6 points).
5. **Diversification** (`REGLES_RECOMMANDATION.md`, étape 5), puis au plus 4 aliments.

Aucun filtre ne change le texte santé d'un aliment : allégations, niveaux de preuve et précautions restent affichés tels quels.

---

## 2. Les questions (moins de 40 secondes, toutes facultatives)

### F1. Quelles cuisines aimez-vous ? (jusqu'à 3, ou « pas de préférence »)
Française / Méditerranéenne (Italie, Espagne, Grèce) / Orientale (Maghreb, Moyen-Orient) / Asiatique (Japon, Corée, Chine, Vietnam, Thaïlande, Inde) / Amérique latine / Afrique de l'Ouest / Nordique.

| Règle | Aliments (`cuisines`) | Recettes (`cuisine`) |
|---|---|---|
| Cuisine choisie présente | +1 | +1,5 |
| Aliment « universelle » seulement | +0,5 | — |
| Aucune cuisine choisie | 0 | 0 |

Garantie : si au moins un aliment d'une cuisine choisie passe les filtres de sécurité et correspond à l'indice, il figure dans les 4 propositions. Les autres cuisines ne sont jamais masquées.

### F2. Votre budget pour ces idées ?
Serré / Moyen / Pas de contrainte.

| Réponse | `prix_niveau` 1 | 2 | 3 |
|---|---|---|---|
| Serré | +1 | 0 | −1,5 |
| Moyen | +0,5 | 0 | −0,5 |
| Pas de contrainte | 0 | 0 | 0 |

Budget serré : proposer d'abord les formes économiques citées dans `surgele_ou_conserve_note` (légumes surgelés nature, légumineuses et poissons en conserve).

### F3. Le bio compte-t-il pour vous ?
Je privilégie le bio / Indifférent.
Si « je privilégie » : +0,5 quand `bio_disponible` = true ; afficher « existe en bio ». **Ne jamais écrire que le bio est meilleur pour la peau ou la santé** : aucune preuve n'a été établie dans notre étude. Indiquer que le bio coûte en moyenne plus cher (Familles Rurales, juin 2026 : fruits bio +61 %, légumes bio +67 %).

### F4. Où faites-vous vos courses ? (plusieurs choix)
Supermarché / Marché ou primeur / Magasin bio / Épicerie asiatique / Épicerie orientale / Poissonnerie / Boucherie / Fromagerie / Surgelés.

| Règle | Effet |
|---|---|
| Au moins un lieu choisi figure dans `circuits` | +0,5 |
| Aucun lieu choisi ne figure dans `circuits` | −1 et mention « à trouver en … » (premier circuit de la liste) |
| Recette avec un ingrédient introuvable dans les lieux choisis | −0,5 et mention « à trouver en … » |

### F5. Saison et origine d'abord ?
Oui, de saison et plutôt de France / Indifférent.

| Règle (si « oui ») | Effet |
|---|---|
| Mois courant dans `saison` (produit frais, liste de 1 à 11 mois) | +1 (remplace le +0,5 de saison de `REGLES_RECOMMANDATION.md`) |
| Produit frais hors saison (liste non vide, mois absent) | −1, et proposer la version surgelée si `surgele_ou_conserve_ok` |
| `saison` = [] (saison non documentée) | 0, jamais « de saison » à l'écran |
| `origine_possible_france` = true | +0,5 |
| Recette : mois courant dans `saison` de la recette | +1 ; sinon −1 |

Si « indifférent » : seule la règle de saison de `REGLES_RECOMMANDATION.md` s'applique (+0,5). Afficher la source de la saison quand on écrit « de saison » (`saison_source` : ADEME ou Interfel).

### F6. Des aliments que vous n'aimez pas ? (liste à cocher, recherche possible)
Préférence personnelle, pas un conseil de santé : l'aliment et les recettes où il pèse au moins 5 % du poids sont retirés. Pour une herbe ou une épice en plus petite quantité, garder la recette avec la mention « (facultatif : sans X) ».

| Choix affiché | Identifiants retirés |
|---|---|
| Poisson | sardine, maquereau, saumon, hareng, anchois, truite, cabillaud, lieu_noir, merlan, dorade, bar, thon_naturel, eglefin, lotte, rouget |
| Fruits de mer | huitre, moule, crevette, calamar, poulpe, saint_jacques, palourde, tourteau, bulot, crabe_miettes |
| Viande rouge | boeuf_maigre, agneau, veau_escalope, porc_filet |
| Volaille et lapin | poulet, dinde, lapin |
| Œufs | oeuf |
| Produits laitiers | yaourt_nature, yaourt_grec, yaourt_brebis, fromage_blanc, kefir, lait_demi_ecreme |
| Fromage de chèvre | chevre_frais |
| Fromages forts ou affinés | comte, parmesan, brebis_pyrenees, feta |
| Tofu et soja | tofu, tofu_soyeux, tempeh, miso, boisson_soja_calcium, sauce_soja |
| Légumineuses | lentille, lentille_verte_puy, lentille_corail, lentille_blonde, pois_chiche, haricot_rouge, haricot_blanc, flageolet, haricot_mungo, pois_casse, feve, houmous |
| Chou (toutes sortes) | chou_blanc, chou_rouge, chou_vert, chou_fleur, chou_bruxelles, chou_frise, romanesco, chou_rave, pak_choi, choucroute |
| Champignons | champignon_paris, shiitake |
| Betterave | betterave |
| Aubergine | aubergine |
| Poivron | poivron_rouge, poivron_jaune, poivron_vert |
| Céleri | celeri_rave, celeri_branche |
| Fenouil | fenouil |
| Épinard et blette | epinard, blette |
| Radis et navet | radis, radis_noir, navet, rutabaga |
| Oignon, ail, échalote | oignon, oignon_rouge, echalote, ail |
| Avocat | avocat |
| Olives et câpres | olive, capres |
| Algues | nori, wakame |
| Coriandre | coriandre |
| Menthe | menthe |
| Aneth | aneth |
| Plats pimentés | piment, harissa, curry (et recettes marquées « epice ») |
| Gingembre | gingembre |
| Cannelle | cannelle |
| Noix de coco | lait_coco, noix_coco_rapee |
| Fruits secs (dattes, pruneaux, raisins secs) | datte, figue_seche, pruneau, raisin_sec, abricot_sec |
| Banane | banane, banane_plantain |
| Kiwi | kiwi |
| Agrumes amers | pamplemousse |
| Graines | graines_lin, graines_chia, graines_courge, graines_tournesol, sesame, tahin, graines_pavot |
| Fruits à coque | noix, amande, noisette, noix_bresil, pistache, noix_cajou, noix_pecan, macadamia, pignon |

Un aliment non aimé n'est jamais remplacé par un aliment moins adapté à l'indice : si moins de 4 aliments restent, en proposer moins (`REGLES_RECOMMANDATION.md`, étape 6).

### F7. Combien de temps pour cuisiner ? (recettes seulement)
15 min / 30 min / 40 min / Pas de contrainte.
Filtre sur `temps_min` (≤ la réponse). Les temps de repos ou de congélation écrits dans `notes` ne comptent pas, mais la carte les affiche (« + une nuit au frais »).

### F9. Plutôt des aliments du quotidien, ou ouvert aux découvertes ?
Du quotidien / Ouvert aux découvertes / Indifférent.

Règle de classement du champ `usage` (aliments) : **« quotidien » = vendu dans la plupart des supermarchés et connu de la plupart des ménages français ; « rare » = surtout acheté en épicerie spécialisée, magasin bio ou poissonnerie, ou perçu comme de niche, festif ou très cher.** Classement éditorial, sans lien avec l'intérêt nutritionnel ni avec le niveau de preuve (un aliment « rare » n'est jamais présenté comme meilleur). Recettes : `usage` = « quotidien » si tous les ingrédients qui pèsent au moins 10 % de la recette (hors eau) sont d'usage quotidien, sinon « rare ».

| Réponse | `usage` = quotidien | `usage` = rare |
|---|---|---|
| Du quotidien | +0,5 | −1 |
| Ouvert aux découvertes | 0 | +0,5 |
| Indifférent | 0 | 0 |

Sans réponse à F9, ne proposer qu'un aliment « rare » au plus parmi les 4.

### F8. Pour combien de personnes ? (recettes seulement)
1 à 8. Les quantités se recalculent au prorata de `personnes` ; arrondir les pièces (œufs, fruits) à l'unité supérieure.

---

## 3. Règles de sécurité appliquées aux recettes (rappel, à partir du questionnaire)

| Réponse du questionnaire | Recettes retirées |
|---|---|
| Q1 allergie | toute recette dont `allergenes_UE` contient l'allergène |
| Q1 sulfites | recettes avec abricot_sec, raisin_sec, figue_seche, câpres |
| Q3 grossesse ou allaitement | recettes contenant tofu, tofu_soyeux, tempeh, miso, boisson_soja_calcium, sauce_soja, nori, wakame ; recettes avec parmesan, comte ou brebis_pyrenees (lait cru) sauf si l'app propose un fromage pasteurisé à la place ; recettes avec crevette, crabe_miettes ou tourteau vendus cuits (la note l'indique) ; plus d'une recette par semaine avec thon_naturel, dorade, bar ou lotte (150 g par semaine au plus) |
| Q4 traitement quotidien | recettes avec pamplemousse |
| Q4 AVK | ne pas mettre en avant les recettes marquées « très persillé » ; ne pas multiplier les recettes riches en épinard, chou kale, persil |
| Q4 ou Q5 thyroïde, lithium, amiodarone, maladie cardiaque | recettes avec algues |
| Q5 maladie rénale | recettes dont l'ingrédient principal (au moins 20 % du poids) est exclu pour le potassium dans `QUESTIONNAIRE.md` |
| Q5 maladie cœliaque | recettes sans « sans_gluten » ; afficher les notes « lire l'étiquette » (sarrasin, tortillas de maïs) |
| Q6 moins de 18 ans | pas de restriction ; pas de café, pas de compléments (aucune recette n'en contient) |
| Q7 régime | garder seulement les recettes dont `regimes` contient le régime (végétarien, végan) ; halal et casher : `halal_possible` / `casher_possible` et afficher « viande certifiée » quand la note le demande |
| Q8 rosacée, Q11 déclencheurs | retirer les recettes marquées « epice » ; boissons chaudes (note « Boisson chaude ») : proposer tiédies ou retirer si « boissons chaudes » est coché |

Les recettes ne portent aucune allégation de santé ; `cibles_peau` ne sert qu'au classement.

---

## 4. Afficher le prix honnêtement

Le prix n'est **jamais** un chiffre inventé. Trois cas, lus dans `aliments_v2.json` :

| Cas | Champs | Texte à l'écran (exemple) |
|---|---|---|
| Relevé INSEE | `prix_releve.source` commence par « INSEE » | « Prix indicatif : 3,01 €/kg (pommes). Moyenne INSEE des prix de détail, septembre 2025 à août 2026, France métropolitaine. Environ 0,45 € la portion de 150 g. » |
| Relevé Familles Rurales | `prix_releve.source` commence par « Familles Rurales » | « Prix indicatif : 9,09 €/kg (fraises), 12,44 €/kg en bio. Relevés Familles Rurales du 8 au 21 juin 2026, 40 départements. Environ 1,36 € la portion. » |
| Estimation | `prix_portion_indicatif_eur` = null et `prix_source` commence par « estimé par catégorie » | « € (abordable) : estimation d'après la catégorie « légumineuses sèches », pas de prix relevé pour cet aliment. » |

Règles :
- Toujours écrire « indicatif », la source, la période et la zone. Les sources sont nationales (France métropolitaine) : **pas de prix régional** ; écrire « vos prix peuvent varier selon le magasin et la région ».
- Afficher le niveau en symboles : € (1), €€ (2), €€€ (3). Ne jamais afficher d'euros quand `prix_portion_indicatif_eur` est null.
- Coût d'une recette : seulement si `cout_portion_indicatif_eur` n'est pas null (« ≈ 0,91 € par personne, d'après les prix moyens INSEE et Familles Rurales »). Sinon, seulement les symboles.
- Prix au kilo des produits vendus à la pièce (kiwi, avocat, artichaut, chou-fleur, pamplemousse) : afficher le prix à la pièce de l'INSEE, pas un prix au kilo.
- Mise à jour : les séries INSEE se relisent chaque mois (identifiant dans `prix_releve.url`, API publique `bdm.insee.fr/series/sdmx`) ; l'observatoire Familles Rurales est annuel (juin). Afficher la date de la dernière mise à jour ; au-delà de 18 mois sans mise à jour, ne plus afficher d'euros, seulement les symboles.

---

## 5. Ce que les filtres ne font jamais

- Réintroduire un aliment ou une recette exclu pour la sécurité.
- Changer un niveau de preuve, une allégation ou une précaution.
- Présenter le bio, le local ou la saison comme meilleurs pour la peau.
- Pousser un aliment de grade D (sans lien cutané) dans les idées pour un indice : ces aliments ne servent qu'aux recettes et à la variété.
- Afficher un prix sans source, sans période et sans zone.
- Employer un vocabulaire promotionnel interdit par nos règles (voir `REGLES_RECOMMANDATION.md`, section 4.2), y compris pour les aliments d'usage « rare ».
