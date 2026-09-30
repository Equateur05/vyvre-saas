# Questionnaire V2 : une seule question avant l'assiette

Remplace le parcours de `QUESTIONNAIRE.md` (écran d'avertissement + 10 questions). Rédigé le 30/09/2026 (design produit + diététique clinique). À relire par un diététicien diplômé et par un juriste avant mise en ligne (voir section 5).

---

## 1. Verdict

1. **Un seul écran, deux touchers** dans le cas courant : « Rien de particulier », puis « Accepter et voir mon assiette ». Au retour : **un toucher** (« Toujours pareil ? » → « Oui »).
2. L'écran d'avertissement séparé disparaît : il devient une ligne courte au-dessus du bouton, avec le texte complet dépliable.
3. Des 10 questions, on en garde **5 cases à toucher seulement si elles vous concernent** : allergie, grossesse, anticoagulant, reins, végétarien ou végan. Elles se déplient au toucher.
4. **Quatre aliments sont écartés pour tout le monde** (pamplemousse, huître, tofu, noix du Brésil). Ça supprime d'un coup les questions thyroïde, cœur, cancer du sein, compléments et « traitement quotidien ». On perd 4 aliments sur 44, et chacun a des remplaçants.
5. Le trouble alimentaire, le diabète, l'eczéma, le psoriasis, le halal et le casher ne sont plus demandés. Le produit applique leurs règles **à tout le monde** (aucun jeûne, aucun grammage, aucune liste « à éviter ») ou elles n'ont aucun effet sur le catalogue actuel.
6. L'âge vient du pré-scan quand il dit 25 ans ou plus. Sinon, il est confirmé dans la phrase d'accord. Un lien « J'ai moins de 18 ans » mène à une assiette prudente, sans aucune donnée gardée.
7. Le sommeil et l'activité passent dans la section Rythme : facultatifs, un toucher chacun, sur place. Les préférences (saison, budget, bio, magasin, cuisine, « pas pour moi ») deviennent des filtres en direct sur l'écran de résultat.
8. Garder les réponses sur l'appareil est **désactivé par défaut**. On le propose après l'assiette, pour 6 mois, avec un bouton « Effacer ». Refuser de répondre donne quand même une assiette : l'**assiette prudente**.

| Parcours | Écrans | Touchers après « Composer mon assiette » |
|---|---|---|
| Ancien (6 questions obligatoires sur 10) | 2 | 8 minimum, environ 16 avec tout rempli |
| V2, première fois, rien de particulier | 1 | **2** |
| V2, une allergie (fruits à coque) | 1 | 4 (Une allergie · Fruits à coque · Accepter) |
| V2, retour avec réponses gardées | 1 | **1** |
| V2, « Je préfère ne pas répondre » ou « J'ai moins de 18 ans » | 1 | 1 |

---

## 2. Les écrans, texte exact

Style : celui de la feuille Assiette (fond « jour » #dce7e1, grands titres italiques Georgia, pastilles `.puce`). On reprend trois idées du pré-scan de peau (`/scan/avant/`, propale G WOW) :
- les choix s'écrivent dans une **phrase lue en direct** (la « dictée ») ;
- un **compteur** montre ce qui reste (« Il reste 37 aliments ») ;
- un **lien discret de sortie** (« Passer, montrez-moi tout » là-bas, « Je préfère ne pas répondre » ici).

Typographie : apostrophe ’, espace fine insécable avant ? ! : ; et à l'intérieur des « ».

### Écran 0 : l'entrée (existe déjà, inchangée)

Carte dans les résultats : « Nouveau · votre assiette » / **Assiette.** / bouton « Composer mon assiette ».

### Écran 1 : « Quelque chose à éviter ? » (première fois, ou après « Modifier »)

Il remplace l'écran d'avertissement et l'écran des 10 questions.

```
AVANT VOTRE ASSIETTE · UNE SEULE QUESTION                  [FERMER]

Quelque chose
à éviter ?

Nous écartons ce qui ne vous convient pas avant de choisir quoi que ce soit.

( Une allergie )  ( Enceinte ou allaitante )  ( Un anticoagulant )
( Une maladie des reins )  ( Végétarien ou végan )

┌──────────────────────────────────────────────┐
│            Rien de particulier               │
│ ni allergie, ni grossesse, ni anticoagulant, │
│        ni reins, ni régime végétarien        │
└──────────────────────────────────────────────┘

[ phrase lue en direct + compteur ]

[ phrase d'accord ]
[ Accepter et voir mon assiette ]        (désactivé tant qu'aucun choix)

J'ai moins de 18 ans   ·   Je préfère ne pas répondre

Information générale, pas un avis médical. Après un repas, gonflement
du visage ou gêne respiratoire : appelez le 15 ou le 112.
Lire l'avertissement complet ▾
```

**Ordre voulu.** Les cinq cases viennent **avant** le gros bouton « Rien de particulier ». L'œil lit donc les cinq situations avant d'atteindre le bouton. La deuxième ligne du bouton dit en toutes lettres ce qu'on affirme en le touchant.

**Règles de sélection**
- « Rien de particulier » et les cinq cases s'excluent : toucher l'un désélectionne les autres.
- Rien n'est présélectionné, ni « Rien de particulier » ni une case (voir section 5, RGPD).
- Une case qui se déplie exige au moins un sous-choix. Sinon le bouton reste désactivé et une aide s'affiche sous la case : « Choisissez au moins une réponse, ou touchez de nouveau « Une allergie » pour la retirer. »

**Ce qui se déplie, et quand**

1. **« Une allergie »**, sous-titre gris : *aliment, latex ou pollen*.
   Au toucher, un bloc s'ouvre sous la rangée :
   - Titre : « Lesquelles ? » · aide : « Toutes celles qui vous concernent. »
   - Pastilles (d'abord celles qui existent dans nos aliments, puis les autres) :
     Fruits à coque · Poissons · Gluten ou maladie cœliaque · Lait · Œufs · Soja · Mollusques · Crustacés · Arachide · Sésame · Moutarde · Céleri · Lupin · Sulfites · Latex · Pollen de bouleau · Une autre
   - **« Une autre »** ouvre un second bloc : « Parmi nos aliments, lesquels ? » · aide : « Nous ne proposons que ces aliments : cochez ceux qui ne vous conviennent pas, ils n'apparaîtront nulle part, ni dans une recette. »
     Pastilles : la liste fermée des aliments du catalogue qui ne portent aucun allergène majeur (abricot, avocat, brocoli, cacao, carotte, cassis, chou frisé, courge butternut, eau, épinard, fraise, graines de chia, de courge, de lin, de tournesol, haricot rouge, huile d'olive, kiwi, lentille, mâche, myrtille, orange, patate douce, pois chiche, poivron rouge, thé vert, tomate). La liste est générée depuis `aliments.json` : tout aliment ajouté y apparaît tout seul.
   - Ligne « Ce que cela change » (gris, italique, s'affiche au premier sous-choix) : « Ces aliments disparaissent de l'assiette, des recettes et des combos. Nous ne remplaçons pas votre allergologue. »

2. **« Enceinte ou allaitante »**, sous-titre : *ou projet de grossesse*. Pas de sous-choix : les trois situations reçoivent la règle la plus stricte.
   Ligne « Ce que cela change » : « Nous écartons le thé vert et les soins déconseillés pendant la grossesse, comme les rétinoïdes. Le saumon : seulement bien cuit. Zéro alcool. »

3. **« Un anticoagulant »**, sous-titre : *fluidifiant du sang*. Pas de sous-choix. Tous les anticoagulants reçoivent la règle AVK : c'est un peu trop large, mais sans danger.
   Ligne : « Nous ne vous proposerons pas d'augmenter les légumes verts riches en vitamine K. Tout changement se discute avec votre médecin. »

4. **« Une maladie des reins »**, sous-titre : *ou des calculs*. Pas de sous-choix. Les calculs reçoivent la règle rénale complète, plus l'épinard.
   Ligne : « Nous écartons les aliments riches en potassium, les graines et les épinards. Votre alimentation se fixe avec votre néphrologue. »

5. **« Végétarien ou végan »** se déplie en deux pastilles : Végétarien · Végan.
   Ligne pour Végan : « Pensez à la vitamine B12 : parlez-en à un professionnel de santé. »

**La phrase lue en direct** (italique Georgia 18 px, sous le gros bouton ; chaque mot choisi s'y pose comme dans la dictée du pré-scan) :
- Aucun choix : « Touchez « Rien de particulier » ou ce qui vous concerne. »
- Rien de particulier : « Une assiette pour moi, sans restriction particulière. »
- Avec des choix : « Une assiette pour moi » suivi des morceaux touchés, liés par des virgules et un « et » final, puis « Rien d'autre. ». Exemple : « Une assiette pour moi, sans fruits à coque ni poissons, adaptée à la grossesse et végétarienne. Rien d'autre. »
  - Allergie : « sans {liste} » (fruits à coque, poissons, gluten, lait, œufs, soja, mollusques, crustacés, arachide, sésame, moutarde, céleri, lupin, sulfites, puis les aliments de « Une autre ») ; latex : « sans avocat ni kiwi » ; bouleau : « attentive au pollen de bouleau »
  - Grossesse : « adaptée à la grossesse et à l'allaitement »
  - Anticoagulant : « compatible avec mon anticoagulant »
  - Reins : « adaptée à mes reins »
  - Régime : « végétarienne » / « végane »
- Compteur (police mono, 10 px, majuscules espacées), mis à jour à chaque toucher : « IL RESTE 37 ALIMENTS POUR COMPOSER VOTRE ASSIETTE ». Avec « Rien de particulier », le compteur affiche 40, car les 4 aliments écartés pour tous sont déjà retirés.

Le « Rien d'autre. » final est le garde-fou central : ce que vous n'avez pas touché est écrit comme une affirmation, sous vos yeux, avant le bouton.

**La phrase d'accord** (13 px, juste au-dessus du bouton, jamais repliée) :
- Si le pré-scan a répondu 25 ans ou plus :
  « Vos réponses concernent votre santé. En acceptant, vous nous autorisez à nous en servir pour une seule chose : écarter des aliments et des soins. Elles restent sur cet appareil, ne nous sont jamais envoyées et s'effacent quand vous fermez la page. »
- Sinon (âge « moins de 25 ans », « tout âge », ou pas de pré-scan comme sur les pages /m/<marque>), la même phrase commence par :
  « Vous avez 18 ans ou plus. Vos réponses concernent votre santé. En acceptant, … »

**Le bouton** : « Accepter et voir mon assiette ».

**Les deux liens** (13 px, soulignés, même poids l'un que l'autre) :
- « J'ai moins de 18 ans » → assiette prudente, version adolescent (voir plus bas). Rien n'est demandé, rien n'est gardé.
- « Je préfère ne pas répondre » → assiette prudente. Rien n'est demandé, rien n'est gardé.

**« Lire l'avertissement complet »** déplie le texte actuel de l'écran d'avertissement, mot pour mot (section 6 de `REGLES_RECOMMANDATION.md`).

### Écran 1 bis : « Toujours pareil ? » (retour, réponses gardées et valides)

```
VOS RÉPONSES DU 12 SEPTEMBRE                                [FERMER]

Toujours
pareil ?

« Une assiette pour moi, sans fruits à coque, végétarienne. Rien d'autre. »

[ Oui, voir mon assiette ]
[ Quelque chose a changé ]

Une autre personne ?   ·   Effacer mes réponses de cet appareil
```

- La phrase est la même que la phrase lue en direct de l'écran 1, reconstruite depuis la mémoire. Avec « Rien de particulier » : « Une assiette pour moi, sans restriction particulière. »
- « Oui, voir mon assiette » : un seul toucher. Le consentement et l'âge ont été donnés et datés lors du premier passage (voir section 4).
- « Quelque chose a changé » → écran 1, avec les réponses précédentes déjà cochées. Ici, cocher d'avance est correct : ce sont les réponses actives de la personne, et elle a demandé à les modifier.
- « Une autre personne ? » → écran 1 vierge. La mémoire n'est ni lue ni effacée ; à la fin, l'interrupteur « Garder » est éteint pour ce passage.
- « Effacer mes réponses de cet appareil » → effacement immédiat, retour à l'écran 1 vierge, message « Réponses effacées de cet appareil. » avec « Annuler » pendant 5 secondes.

### Écran 2 : l'assiette (existe déjà, quatre ajouts)

**a. Rangée « Affiner »** (sous le ruban, défilement horizontal). C'est ici que vivent les préférences de l'autre équipe (FILTRES.md n'existe pas encore ; hypothèse de 6 préférences) :
« De saison » (allumé par défaut) · « Budget : tous » · « Bio » · « Où j'achète » · « Cuisine » · « Pas pour moi (2) »
- Chaque toucher réordonne l'assiette **en direct**, sans rien redemander sur la santé.
- Un filtre ne peut **jamais** faire revenir un aliment écarté pour raison de santé : il choisit seulement parmi les aliments déjà autorisés.
- Si les filtres laissent moins de 4 aliments, on les relâche dans cet ordre : cuisine, magasin, bio, budget. Puis on le dit, comme la barre de préférences du scan (« échelle » de `vyPrefs`) : « Vos filtres laissaient 2 aliments : nous avons relâché « Bio ». »
- Saison : mois de l'appareil ; l'hémisphère est déduit du fuseau horaire (Australia/…, America/Sao_Paulo…).
- Budget : aucune déduction depuis la « famille de maisons » du pré-scan. Acheter du luxe en cosmétique ne dit rien du panier alimentaire.

**b. « Pas pour moi »** : lien discret sous chaque carte d'aliment. Au toucher, la carte se replie, le candidat suivant la remplace, et le compteur de « Pas pour moi (n) » augmente. C'est le filtre « je n'aime pas », posé là où la question se pose.

**c. Questions sur place dans Rythme** (facultatives, un toucher, le texte de la carte change aussitôt) :
- Carte **Dormir**, sous le texte général : « Et vous, en général ? » → Moins de 7 h · 7 à 9 h · Plus de 9 h · et, à part : « Horaires décalés ou de nuit ».
- Carte **Bouger** : « Et vous, par jour ? » → Moins de 4 000 pas · 4 000 à 7 000 · Plus de 7 000 · aide : « Votre téléphone le sait : app Santé ou Google Fit. »
- **Alcool** et **tabac** : jamais demandés. Le conseil est le même pour tous, et la question serait intrusive pour un gain nul.

**d. Bloc « Vos réponses »** (en bas, avant l'avertissement final) :
- La phrase lue en direct, chaque morceau touchable pour revenir à l'écran 1, comme les mots de la phrase du pré-scan.
- Bouton secondaire « Modifier mes réponses ».
- Interrupteur **éteint par défaut** : « Garder mes réponses sur cet appareil » · aide : « La prochaine fois, une seule question : « Toujours pareil ? ». Rien n'est envoyé. Effacement automatique dans six mois. »
- Une fois allumé : « Gardées sur cet appareil jusqu'au 30 mars 2027. » · lien « Effacer maintenant ».
- Absent pour l'assiette prudente et pour les moins de 18 ans.

### Écran 2 prudent : « Assiette prudente. »

Pour « Je préfère ne pas répondre », « J'ai moins de 18 ans », ou une réponse illisible en mémoire.
- Surtitre : « Sans vos réponses · d'après votre lecture ». Titre : « Assiette prudente. »
- Texte : « Sans vos réponses, nous ne gardons que des aliments sans aucun des 14 allergènes majeurs ni précaution médicale connue. Pour une assiette sur mesure, répondez à une seule question. » + lien « Répondre ».
- Aliments possibles, et seulement ceux-là : tomate, carotte, myrtille, orange, poivron rouge, huile d'olive, eau, fraise, cassis. Les graines sont retirées, car on ignore l'état des reins. Les notes latex (tomate, poivron) et bouleau (carotte, « de préférence cuite ») s'affichent pour tout le monde.
- Combos : uniquement les actifs marqués `grossesse: ok` (protection solaire, acide azélaïque, céramides, humectants, panthénol).
- Pour les moins de 18 ans : pas de combos, sauf la protection solaire. Le Rythme se réduit à la carte actuelle « Bouger, une heure par jour ». Pas de protocole, pas de restriction.

---

## 3. Où va chaque ancienne question

« Règle par défaut » = appliquée à tout le monde, sans question.

| Ancienne question | Où elle vit maintenant | Règle alimentée (code actuel `exclus()` / table QUESTIONNAIRE.md) | Exclusion de sécurité conservée ? |
|---|---|---|---|
| **Q1** Allergies (14 UE) | Écran 1, « Une allergie » → 14 pastilles + « Une autre » (liste fermée de nos aliments) | `allergenes_UE` sur aliments, recettes et combos ; sulfites → abricot ; lait → message calcium | Oui, et plus précise : « Une autre » exclut des aliments exacts au lieu d'un texte libre impossible à vérifier |
| Q1 gluten + **Q5 cœliaque** | Fusionnés : « Gluten ou maladie cœliaque » | pain complet, flocons d'avoine exclus | Oui |
| **Q2** Latex / bouleau | Dans « Une allergie » : pastilles Latex, Pollen de bouleau | latex → avocat, kiwi exclus ; notes tomate, poivron ; bouleau → notes | Oui. Filet en plus : les notes latex restent sur les cartes kiwi et avocat pour tout le monde (déjà dans `precautions`) |
| Q2 « Je ne sais pas » | « Je préfère ne pas répondre » → assiette prudente (sans kiwi ni avocat) | avant : aucune règle | Renforcée : avant, cette réponse n'avait aucun effet |
| **Q3** Enceinte / allaite / projet | Écran 1, « Enceinte ou allaitante » (une case, règle la plus stricte) | tofu, huître, thé vert exclus ; saumon cuit ; actifs `grossesse: eviter` retirés, `avis` signalés ; **zéro alcool dans Rythme** (manque dans le code actuel) | Oui. Un projet de grossesse reçoit maintenant aussi l'exclusion du thé vert : trop large, mais sans danger |
| Q3 « Je préfère ne pas répondre » | Lien global → assiette prudente | avant : aucune règle | Renforcée |
| **Q4** AVK | Écran 1, « Un anticoagulant » (tous les anticoagulants) | épinard, chou frisé, brocoli, mâche jamais proposés à la hausse ; message médecin (INR) | Oui. Filet en plus : la note AVK reste sur la carte épinard pour tous |
| Q4 Traitement quotidien | Règle par défaut + note universelle | **pamplemousse exclu pour tous** ; note pharmacien en pied d'assiette ; note nadolol sur la carte thé vert (déjà dans les données) | Oui (par défaut) |
| Q4 Thyroïde, lithium, amiodarone | Règle par défaut | **huître exclue pour tous** ; algues exclues pour tous si elles entrent au catalogue ; aucune allégation iode affichée | Oui (par défaut) |
| Q4 Complément de sélénium | Règle par défaut | **noix du Brésil exclue pour tous** | Oui (par défaut) |
| Q4 Complément zinc / iode | Règle par défaut | huître exclue pour tous | Oui (par défaut) |
| Q4 Complément bêta-carotène | Note universelle sur les cartes carotte et patate douce | « Ne jamais remplacer par des compléments de bêta-carotène (risque chez le fumeur) » (déjà dans les données) | Oui |
| **Q5** Maladie rénale | Écran 1, « Une maladie des reins » | liste potassium actuelle + **les 4 graines** (courge, tournesol, lin, chia : riches en potassium et en phosphore, absentes de la règle actuelle) ; pas de hausse de protéines ; message néphrologue | Oui, renforcée |
| Q5 Calculs rénaux | Fusionnés avec reins | règle rénale complète + épinard exclu (au lieu d'une simple note) | Oui, renforcée |
| Q5 Thyroïde | Règle par défaut | huître exclue pour tous ; pas d'algues | Oui (par défaut) |
| Q5 Maladie cardiaque | Règle par défaut + phrase universelle dans Bouger | algues/huître exclues ; « Maladie du cœur, diabète traité ou reprise après une longue pause : demandez l'avis de votre médecin avant d'augmenter l'effort. » | Oui (par défaut) |
| Q5 Diabète traité | Règle par défaut | aucun jeûne ni fenêtre alimentaire, pour personne ; phrase universelle dans Bouger | Oui (par défaut) |
| Q5 Cancer du sein (vous ou famille) | Règle par défaut | **tofu exclu pour tous** (soja retiré) | Oui (par défaut). Une question lourde disparaît d'un écran beauté |
| Q5 Trouble du comportement alimentaire | Règle par défaut : tout le produit est écrit sans risque pour ces personnes | pour tous : aucun jeûne, aucun comptage, aucun grammage de restriction, aucun poids. Le bloc « Limiter » (charcuterie 150 g, viande 500 g) est réécrit en positif (« plus souvent des légumes secs ») ; les repères chiffrés du PNNS passent dans un lien vers mangerbouger.fr | Oui (par défaut). **Le code actuel n'applique aucune règle TCA** : c'est corrigé |
| **Q6** Âge : moins de 18 ans | Lien « J'ai moins de 18 ans » ; l'âge du pré-scan (25 ans ou plus) évite la confirmation | assiette prudente adolescent, Rythme « Bouger » seul, noix du Brésil exclue (par défaut), aucun protocole | Oui. Mieux au regard du RGPD : on ne traite aucune donnée de santé d'un mineur |
| Q6 65 ans et plus | Carte universelle dans Rythme, masquée si « reins » | « Après 65 ans, des protéines à chaque repas… » | Oui |
| **Q7** Végétarien / végan | Écran 1, « Végétarien ou végan » → 2 pastilles | poissons, huître exclus ; végan : œuf, yaourt, kéfir aussi ; message B12 | Oui |
| Q7 Omnivore, flexitarien, pescétarien | Supprimés | aucune règle, ni avant ni après | Aucun effet perdu |
| Q7 Halal, casher, sans porc | Supprimés | casher → huître : exclue pour tous. Le catalogue n'a ni porc, ni viande, ni alcool. On ne collecte plus une donnée religieuse (article 9) pour rien. **Si le catalogue ajoute un jour viande ou alcool : ajouter « Sans porc » et « Sans alcool » (mots neutres, sans religion) dans « Végétarien ou végan » et changer la version du schéma** | Oui |
| **Q8** Acné | Déduite du scan : si « Pores et sébum » est l'un des deux indices les plus faibles | ni yaourt, ni kéfir, ni chocolat dans l'assiette, la recette (porridge sans yaourt) ou les combos ; message « Si votre acné est douloureuse, laisse des cicatrices ou dure : consultez. » | Oui |
| Q8 Rosacée | Déduite du scan : si « Rougeurs » est l'un des deux indices les plus faibles | le thé vert est proposé « tiède ou froid », jamais chaud ; recettes non épicées (déjà le cas) ; message sur les déclencheurs | Oui (le thé vert chaud n'est plus proposé à personne ayant des rougeurs) |
| Q8 Eczéma / psoriasis | Note universelle en pied d'assiette | « Eczéma ou psoriasis : n'éliminez aucun aliment sans avis médical, surtout chez l'enfant. » ; aucune éviction proposée à personne | Oui |
| **Q9** Sommeil | Carte Dormir, facultatif, un toucher | moins de 7 h / plus de 9 h / horaires décalés → texte adapté ; aucune fenêtre alimentaire pour personne | Oui |
| **Q10** Activité | Carte Bouger, facultatif, un toucher (pas seulement ; les minutes restent dans le texte OMS) | moins de 4 000 pas → « +1 000 pas » | Oui |
| Q11 Déclencheurs rosacée | Supprimée (jamais codée) | remplacée par le message sur les déclencheurs | n/a |
| Pré-scan peau : âge | Réutilisé (`window.vyPrefs.get().age`, session en cours) | 25 ans ou plus → pas de mention d'âge ; moins de 25 ans ou « tout âge » → « Vous avez 18 ans ou plus » dans la phrase d'accord | n/a |
| Pré-scan peau : objectifs, maisons, pays | Non réutilisés pour les aliments. Les maisons et pays filtrent déjà les produits des combos (`vyPrefs.filter`) | — | n/a |
| Âge estimé par le visage (`vyvre_age_display`) | **Volontairement non utilisé** : estimation optique à ±5 ans, et décider de l'éligibilité d'une personne sur une inférence tirée du visage est à proscrire | — | n/a |

**Contrôle : aucune exclusion de sécurité n'est perdue.** Chaque règle de la table de QUESTIONNAIRE.md tombe dans l'un de ces cas :
- (a) posée à l'écran 1 ;
- (b) appliquée à tout le monde par défaut ;
- (c) déduite du scan ;
- (d) rendue sans objet par le catalogue, avec un garde-fou si le catalogue change.

Quatre règles sont **renforcées** : graines pour les reins, TCA, zéro alcool pendant la grossesse, « Je ne sais pas » ou « Je préfère ne pas répondre ». Trois d'entre elles ne sont pas appliquées aujourd'hui dans `vy-aliment.js` (graines pour les reins, TCA, alcool pendant la grossesse).

Liste des exclusions par défaut, à écrire en dur dans le code :
`DEFAUT_EXCLUS = ['pamplemousse', 'huitre', 'tofu', 'noix_bresil']`, plus tout aliment futur de catégorie `algue` ou marqué riche en iode.

---

## 4. Modèle de données sur l'appareil

### Trois niveaux de conservation

| Niveau | Où | Quand | Effacé |
|---|---|---|---|
| Session | Variable JavaScript en mémoire (`REP`), aucun stockage | Toujours, dès « Accepter » | À la fermeture ou au rechargement de la page |
| Mémoire | `localStorage['vyvre-assiette-v2']` | **Seulement** si l'interrupteur « Garder » est allumé | Au bout de 6 mois, sur « Effacer », si le schéma ou le texte d'accord change, ou si le contenu est illisible |
| Préférences | `localStorage['vyvre-assiette-prefs-v1']` (équipe filtres) | Même interrupteur, même effacement : un seul contrôle pour la personne | Idem |

Rien n'est jamais écrit dans `sessionStorage`, dans un cookie, dans l'URL (seul `?assiette=1` existe, sans réponse), dans un événement de suivi, ni envoyé à Supabase.

### `vyvre-assiette-v2`

```json
{
  "schema": 2,
  "accord": { "texte": "c2-2026-10", "le": "2026-09-30T14:02:00Z" },
  "majeur": true,
  "le": "2026-09-30",
  "expire": "2027-03-30",
  "sante": {
    "rien": false,
    "allergies": ["fruits_a_coque", "latex"],
    "autres_aliments": ["fraise"],
    "grossesse": false,
    "anticoagulant": false,
    "reins": false,
    "regime": "vegetarien"
  },
  "rythme": { "sommeil": null, "decale": false, "pas": "moins4000" }
}
```

Valeurs permises :
- `allergies` : les codes de `allergenes_UE` (`fruits_a_coque`, `poissons`, `cereales_gluten`, `lait`, `oeufs`, `soja`, `mollusques`, `crustaces`, `arachides`, `sesame`, `moutarde`, `celeri`, `lupin`, `sulfites`), plus `latex` et `bouleau`.
- `autres_aliments` : des identifiants de `aliments.json`.
- `regime` : `null`, `vegetarien` ou `vegan`.
- `sommeil` : `null`, `moins7`, `7_9` ou `plus9`.
- `pas` : `null`, `moins4000`, `4000_7000` ou `plus7000`.

Ce qu'on ne stocke **jamais** : le statut de mineur (ce parcours ne garde rien), « Je préfère ne pas répondre », l'âge exact, du texte libre.

### Correspondance avec les règles actuelles

Le code `exclus()` change peu. On lui ajoute les exclusions par défaut, et on traduit les nouvelles réponses vers les anciens codes :

| Nouvelle réponse | Ancien code |
|---|---|
| `allergies` | `q1` (et `q2` pour latex et bouleau) |
| `cereales_gluten` | déclenche aussi `q5: coeliaque` |
| `grossesse` | `q3: enceinte` |
| `anticoagulant` | `q4: avk` |
| `reins` | `q5: renale` + `calculs` + épinard + 4 graines |
| `regime` | `q7` |

Les règles `q8` sont déduites de `indicesDuScan()`.

### Logique « Toujours pareil ? » (à l'ouverture de la feuille)

1. Supprimer l'ancienne clé `vy-assiette` si elle existe. Elle a été remplie sans accord séparé pour la mémoire. On ne la migre pas, comme l'audit du 26/09 a cessé de recharger en silence les réponses du pré-scan.
2. Lire `vyvre-assiette-v2`. On l'**efface et on affiche l'écran 1** si l'une de ces conditions est vraie :
   - la lecture échoue ;
   - `schema` n'est pas 2 ;
   - `accord.texte` n'est pas la version en cours ;
   - la date `expire` est passée ;
   - `sante.rien` est vrai en même temps qu'un autre champ.

   Règle de sécurité : un vieux « Rien de particulier » ne doit **jamais** couvrir une question qui n'existait pas quand il a été donné. Toute case ajoutée à l'écran 1 change donc la version de `schema`.
3. Sinon : écran 1 bis « Toujours pareil ? ».
4. Tout nouvel « Accepter » avec l'interrupteur allumé réécrit la clé et repousse `expire` de 6 mois. Changer une réponse dans Rythme la réécrit aussi, sans toucher à `expire`.

### Effacer

- Trois portes : « Effacer maintenant » (bloc Vos réponses), « Effacer mes réponses de cet appareil » (écran 1 bis), et éteindre l'interrupteur « Garder ».
- Toutes les trois suppriment les deux clés (`vyvre-assiette-v2` et `vyvre-assiette-prefs-v1`) et vident `REP`. Message : « Réponses effacées de cet appareil. » avec « Annuler » pendant 5 secondes (restauration depuis une copie en mémoire, jamais écrite ailleurs).
- Retirer son accord est donc aussi simple que le donner : un toucher (article 7.3 du RGPD).

---

## 5. Risques et parades

| Risque | Parade dans le design |
|---|---|
| **« Rien de particulier » touché trop vite** | (1) Le bouton est placé **après** les cinq cases : l'œil les lit d'abord. (2) Sa deuxième ligne dit ce qu'on affirme : « ni allergie, ni grossesse, ni anticoagulant, ni reins, ni régime végétarien ». (3) La phrase lue en direct répète l'affirmation avant le bouton. (4) Un second toucher obligatoire (« Accepter »). (5) Les 4 exclusions par défaut couvrent les cas rares mais graves qu'on ne demande plus. (6) Filet sur les cartes : notes latex (kiwi, avocat), AVK (épinard et légumes verts), grossesse (saumon, thé vert), reins (aliments riches en potassium), allergènes de chaque aliment et de chaque recette. **À corriger dans le code** : `pr.slice(0, 3)` peut couper une note de sécurité (l'épinard en a déjà 3). Il faut afficher toutes les précautions de sécurité et ne limiter que les autres. |
| Une case non touchée vaut « non » | La phrase se termine par « Rien d'autre. », et le compteur d'aliments bouge à chaque toucher : l'effet de chaque choix se voit. |
| Allergie hors des 14 | « Une autre » ouvre la liste **fermée** de nos aliments. Comme le catalogue est fini, l'exclusion est exacte. On n'utilise aucun texte libre, invérifiable. |
| Réponses anciennes devenues fausses (grossesse, nouveau traitement) | La phrase complète s'affiche à chaque retour ; « Quelque chose a changé » a le même poids visuel que « Oui » ; expiration à 6 mois ; changement de schéma = effacement. |
| Appareil partagé (couple, iPad en boutique) | Mémoire éteinte par défaut ; « Une autre personne ? » sur l'écran 1 bis ; la phrase des réponses n'apparaît jamais sur la carte d'entrée, visible par un voisin, mais seulement dans la feuille. **Ne jamais toucher au parcours Sothys institut** (hors sujet ici, décision du 09/2026). |
| Mineurs | Âge vérifié par le pré-scan ou déclaré dans la phrase d'accord ; lien « J'ai moins de 18 ans » visible et de même poids ; ce parcours ne traite aucune donnée de santé (en France, un mineur de moins de 15 ans ne peut pas consentir seul : article 45 de la loi Informatique et Libertés). |
| Consentement non valable (RGPD, article 9.2.a : consentement **explicite** aux données de santé) | Rien n'est coché d'avance, ni la réponse ni l'accord (arrêt Planet49, CJUE 2019). La phrase d'accord est propre à cet usage, séparée de l'avertissement médical, sans publicité, lisible sans déplier. Elle est acceptée par un bouton dont le libellé dit « Accepter ». Le refus reste possible et utile (assiette prudente) : l'accord est donc libre, car refuser ne prive pas du service. Retrait en un toucher. |
| « Tout reste sur l'appareil » : est-ce que ça change le RGPD ? | En partie. Si vyvre ne reçoit **jamais** les réponses (aucun envoi, aucun suivi, aucune synchronisation), on peut soutenir que vyvre n'en est pas responsable de traitement ; la CNIL admet cette lecture pour les traitements restés sur le terminal. Mais la question n'est pas tranchée. Et ça ne dispense ni de la règle sur les traceurs (article 82 de la loi Informatique et Libertés, article 5.3 de la directive ePrivacy : garder des réponses d'une visite à l'autre n'est pas strictement nécessaire, d'où l'interrupteur éteint par défaut), ni de la protection dès la conception (article 25), ni de la vérité de ce qu'on affirme (« ne nous sont jamais envoyées »). **Décision : on garde l'accord explicite quand même.** Il ne coûte aucun toucher, puisqu'il est fusionné avec le bouton qu'on touche de toute façon. À faire confirmer par un juriste. Si un jour les réponses sont synchronisées avec un compte : régime complet de l'article 9, analyse d'impact (AIPD), et pas avant l'avis d'un avocat. |
| Fuite par le suivi existant | Le suivi Supabase (`?p=`) capte le texte des boutons `.v6cta` : **aucun élément de l'assiette ne doit porter cette classe**. Aucun événement ne doit contenir une réponse. Les réponses gardées sont lisibles par tout script du même domaine : c'est pourquoi on garde peu de données, sur accord, pendant 6 mois. |
| Évolution du catalogue | Les exclusions par défaut sont liées à des catégories (`algue`, riche en iode, soja) et pas seulement à des identifiants. Toute nouvelle case = nouvelle version de `schema`. Viande ou alcool au catalogue → ajouter « Sans porc » et « Sans alcool ». |
| Coût des exclusions par défaut | 4 aliments perdus sur 44 (pamplemousse, huître, tofu, noix du Brésil). Chaque cible garde des remplaçants : orange, kiwi, fraise et cassis pour la vitamine C ; graines de courge pour le zinc ; brocoli, amande et avocat pour la fermeté. Les combos actuels n'utilisent aucun de ces quatre aliments. |
| L'assiette prudente est-elle vraiment sûre ? | 9 aliments courants, sans aucun des 14 allergènes, sans aucune exclusion de la table, sans graines (reins inconnus), avec les notes latex et bouleau pour tous. C'est l'équivalent du conseil général « fruits et légumes ». **À faire valider par le diététicien référent**, comme le demande le point 7 de REGLES. |
| Longueur perçue de l'écran 1 | Dans le cas courant, rien ne se déplie : 5 cases, 1 gros bouton, 1 phrase, 1 bouton. Les 17 pastilles d'allergie et la liste « Une autre » n'apparaissent qu'aux personnes concernées. |

**Trois écarts du code actuel à corriger en même temps** (hors questionnaire, trouvés en relisant `vy-aliment.js`) :
1. La carte Alcool donne « deux verres par jour au maximum » à tout le monde, y compris enceinte ou allaitante. Il faut « Zéro alcool pendant la grossesse et l'allaitement ».
2. Aucune règle TCA n'est appliquée, et le bloc « Limiter » affiche des grammages.
3. `slice(0, 3)` sur les précautions peut cacher une note de sécurité.

Langues : l'écran 1 et l'écran 1 bis devront rejoindre les 12 langues du pré-scan (`scan/avant/langues.js`) avant d'être ouverts hors de France.
