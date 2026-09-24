# ICE v2 — validation

Moteur : `public/scan/vyvre-hair-engine.js`, version `ice-v2`.
Banc du 19/09/2026. Même règle qu'en v1 : **une mesure n'est publiée que si elle est
validée**, et ce qui échoue est écrit ici noir sur blanc.

---

## 1. Ce que v2 change, en une page

v1 mesurait une photo de face et abandonnait presque tout : la brillance était
anti-corrélée avec ce qu'on voit, le frizz aussi, la finesse de fibre était hors de
portée, et toute image sans visage était refusée. v2 ne triche pas sur les chiffres :
elle change **la prise de vue** et **ce que le moteur cherche**.

Trois choses redeviennent vraies, mesurées et validées :

| | |
|---|---|
| **Épaisseur de fibre** | Mesurée à +3 à +7 % près sur des fils de largeur connue, de 3 à 48 px. Publiée en micromètres seulement si une référence d'échelle est dans le cadre et si l'incertitude reste sous 30 %. |
| **Fourches (pointes fourchues)** | 0, 2, 4 et 8 fourches injectées dans des cas de contrôle : 0, 2, 4 et 8 retrouvées. Exact. |
| **Échelle réelle pixels → millimètres** | Carte bancaire et pièce de 2 euros détectées automatiquement, erreur de 0,8 à 1,7 % sur six cas de taille connue. |

Et une quatrième, sur la prise de vue elle-même : **le déclenchement automatique**
(netteté + largeur de fil + séparation du fond) refuse 78 macros sur 148, toutes pour la
bonne raison.

Une cinquième, sur le cadrage : **la chevelure est maintenant cherchée pour elle-même**.
157 images sans aucun visage (nuque, chignon, tresses, mèches posées) : 155 segmentées et
mesurées, là où la v1 les refusait toutes.

Ce qui reste faux, impossible ou non démontré est au § 6. Il y en a, et c'est important.

---

## 2. L'optique d'abord : ce qu'un téléphone lit vraiment

La consigne parlait de « 15 à 40 pixels par cheveu à 5-10 cm ». **C'est faux d'un facteur
3 à 8, et il valait mieux le calculer avant d'écrire le code.** Champ = 2·distance·tan(FOV/2),
sur un capteur de 4032 px :

| configuration | champ | mm/px | cheveu de 70 µm | incertitude (1 px) |
|---|---|---|---|---|
| capteur principal 24 mm éq. à 10 cm | 150 mm | 0,037 | **1,9 px** | 37 µm |
| ultra grand-angle macro 13 mm à 3 cm | 83 mm | 0,021 | **3,4 px** | 21 µm |
| ultra grand-angle macro 13 mm à 2 cm | 55 mm | 0,014 | **5,1 px** | 14 µm |
| bonnette macro clipsée, champ 15 mm | 15 mm | 0,004 | **19 px** | 4 µm |

Deux conséquences dures :

1. **« 15 à 40 px par cheveu » demande une bonnette macro clipsée**, pas un téléphone nu.
   Un téléphone nu en mode macro donne 3 à 5 px, ce que la mesure sur 148 macros réelles
   confirme exactement (largeur médiane mesurée : **4,8 px**, p10 3,1, p90 7,6).
2. **À 15 mm de champ, ni la carte bancaire (85,6 mm) ni la pièce de 2 euros (25,75 mm) ne
   tiennent dans le cadre.** Référence d'échelle et résolution maximale sont donc
   incompatibles : il faut choisir. Le compromis utilisable est le téléphone nu en mode
   macro à 2-3 cm avec une pièce de 2 euros dans le cadre.

Le moteur ne suppose rien de tout cela. Il mesure l'échelle quand une référence est là,
en déduit l'incertitude (un pixel) et **refuse de publier toute valeur dont l'incertitude
dépasse 30 %**, quel que soit le matériel.

---

## 3. Cas de contrôle : vérité terrain exacte

Fils tracés par distance analytique point-segment, largeur et nombre de fourches connus au
pixel près ; références d'échelle composées à une taille connue ; paires torche à part
spéculaire injectée **en lumière linéaire** (soustraire en sRGB n'aurait aucun sens).

### 3.1 Largeur de fibre

| largeur vraie | mesurée | écart |
|---|---|---|
| 2 px | refusée | — (sous le seuil, correct) |
| 3 px | 3,14 | +5 % |
| 5 px | 5,15 | +3 % |
| 8 px | 8,39 | +5 % |
| 12 px | 12,45 | +4 % |
| 20 px | 20,9 | +4 % |
| 32 px | 34,35 | +7 % |
| 48 px | 47,9 | −0 % |

Le biais de +5 % vient du bord anti-aliasé, qui ajoute environ un demi-pixel de chaque
côté. Il est **constaté et non corrigé en douce** : le corriger reviendrait à caler le
moteur sur mes propres images de test.

Défaut trouvé et corrigé en route : la première version lisait la largeur sur l'axe médian
(2 × distance au bord), quantifiée par la transformée de distance, qui surestimait de
+33 % à 3 px et +20 % à 5 px. L'estimateur publié est désormais **surface / longueur de
l'axe médian**, qui est au sous-pixel.

### 3.2 Fourches

| fourches injectées | pointes détectées | fourchues détectées | taux |
|---|---|---|---|
| 0 / 8 fils | 16 | **0** | 0 |
| 2 / 8 fils | 16 | **2** | 0,125 |
| 4 / 8 fils | 16 | **4** | 0,25 |
| 8 / 8 fils | 16 | **8** | 0,5 |

Exact. Trois versions ont été nécessaires, et les deux premières sont instructives :

1. Comptage des pixels de bifurcation : **294 fourches détectées pour 2 injectées** (une
   jonction en Y produit des centaines de pixels de bifurcation).
2. Regroupement des jonctions puis parcours des branches : **0 détectée sur 8**. Une
   fourche à angle ouvert produit une zone de bifurcation si large qu'elle avale ses
   propres branches.
3. Version retenue : **regroupement des POINTES**. Deux extrémités distantes de moins de
   5 largeurs de fil appartiennent à la même pointe ; une pointe portant 2 extrémités ou
   plus est fourchue. Les extrémités qui touchent le bord du cadre sont exclues (un fil
   qui sort de l'image n'est pas une pointe).

Limite assumée : une fourche qui s'ouvre de plus de 5 largeurs est manquée, et deux
cheveux dont les pointes se touchent font une fausse fourche.

### 3.3 Échelle réelle

| cas | mm/px vrai | mm/px mesuré | écart |
|---|---|---|---|
| carte, 180 px de long | 0,4756 | 0,4809 | +1,1 % |
| carte, 260 px | 0,3292 | 0,3267 | −0,8 % |
| carte, 340 px | 0,2518 | 0,2474 | −1,7 % |
| pièce, 120 px de diamètre | 0,2146 | 0,2182 | +1,7 % |
| pièce, 180 px | 0,1431 | 0,1447 | +1,1 % |
| pièce, 240 px | 0,1073 | 0,1082 | +0,8 % |

Deux défauts trouvés et corrigés : les fils traversent la carte et relient tout en une
seule composante (aucune référence détectée au premier essai) — corrigé par une **érosion**
avant l'étiquetage, dont la taille est ensuite rendue ; et l'échelle était exprimée en
pixels de l'image de travail réduite au lieu de l'image d'origine, soit **+100 % d'erreur**.

L'ongle du pouce est accepté sur demande explicite mais renvoyé avec `fiabilite: 'faible'`
et **aucune valeur en micromètres n'en est déduite** : la largeur d'un ongle de pouce varie
de 13 à 20 mm selon les personnes, soit ±25 % d'erreur d'échelle.

### 3.4 Double prise torche

| part spéculaire injectée | mesurée |
|---|---|
| 0,00 | 0,035 |
| 0,10 | 0,052 |
| 0,25 | 0,114 |
| 0,45 | 0,231 |

**L'ordre est parfait, la valeur absolue est sous-estimée d'un facteur 2 environ.** La
séparation dichromatique fonctionne : elle sépare bien ce que la torche a ajouté en une
part qui porte la couleur du cheveu et une part qui porte la couleur de la source.

Deux corrections en route : la chromaticité de la source était estimée sur les pixels les
plus clairs, ce qui est mal conditionné — elle est maintenant **neutre par construction**
(une torche de téléphone est une LED blanche) ; et l'absence totale de reflet provoquait un
refus au lieu de la réponse « zéro », maintenant distinguée par la queue claire de la
distribution.

**Ce n'est pas suffisant pour publier.** Cette validation porte sur des paires fabriquées.
Aucune vraie paire torche allumée / éteinte n'a pu être testée : il n'en existe pas dans un
corpus libre de droits, et il faut un téléphone pour en produire. Tant que ce test n'est
pas fait sur de vraies images, la brillance par double prise reste **non publiée**.

---

## 4. Images réelles

353 images, Wikimedia Commons, licences relevées fichier par fichier : domaine public (77),
CC BY-SA 4.0 (64), CC BY-SA 2.0 (58), CC BY-SA 3.0 (51), CC BY 2.0 (40), CC0 (23), autres.

### 4.1 Le déclenchement automatique de la macro (148 macros réelles)

| | |
|---|---|
| Prises acceptées | **70 / 148** |
| Refusées « image floue » | 39 |
| Refusées « fils trop épais : trop près ou ce n'est pas un cheveu » | 42 |
| Refusées « fils trop fins : trop loin » | 15 |
| Largeur de fil mesurée | p10 3,1 px, médiane **4,8 px**, p90 7,6 px |
| Référence d'échelle présente dans le cadre | **20 / 148** |

Les refus tombent tous pour la bonne raison, et la distribution des largeurs colle à ce que
l'optique prévoit. Mais **une référence d'échelle n'est présente que 20 fois sur 148** :
en pratique, sans consigne explicite, personne ne met une pièce dans le cadre. Sans elle,
l'épaisseur reste en pixels et n'est comparable qu'à elle-même.

### 4.2 Répétabilité du mode macro (5 prises par mèche)

Cadrage réduit de 10 % avec décalage, rotation ±3°, exposition ±8 %, compression forte.

| mesure | écart-type médian | en part de la valeur |
|---|---|---|
| largeur de fibre | 0,91 px | **17 %** |
| taux de fourches | 0,107 | **15 %** |
| régularité du bord | 0,000 | 0 % (sature : à ne pas lire comme une qualité) |

17 % sur la largeur, c'est cohérent avec l'incertitude théorique de ±1 px sur un fil de
5 px. C'est la précision réelle du mode, et elle interdit de publier un diamètre au
micromètre près avec un téléphone nu.

### 4.3 Chercher les cheveux et non le visage (157 images sans visage)

| | |
|---|---|
| Images segmentées | **155 / 157** (v1 : 0 / 157, toutes refusées `visage_non_detecte`) |
| Durée médiane | 268 ms |

Sur les **27 images annotées à la main comme de vraies chevelures** :

| mesure | lisible |
|---|---|
| couleur | 25 / 27 |
| boucle et type | 26 / 27 |
| casse / pointes | 27 / 27 |
| frizz | 22 / 27 |
| longueur apparente | 6 / 27 (les 21 autres sont coupées par le bas du cadre, refus correct) |
| densité à la raie | **2 / 27** |

C'est un vrai gain : ces images étaient entièrement perdues en v1.

### 4.4 Et le trou béant : le moteur ne sait pas qu'il regarde des cheveux

72 images sans visage annotées à la main : **27 vraies chevelures, 45 autres choses** —
bustes en marbre, épingles en bronze avec réglette, cordages tressés multicolores, gravures
anciennes, chats, façades de brique, dentelle, saules tressés.

La segmentation par texture **accepte les unes comme les autres**. J'ai construit un
indicateur de plausibilité (finesse des crêtes internes, densité de crêtes, diversité
d'orientation) pour trancher. Résultat mesuré :

| | chevelures (27) | non-chevelures (45) |
|---|---|---|
| plausibilité, médiane | 1,00 | 1,00 |
| largeur de crête interne, médiane | 2,00 px | 2,00 px |
| densité de crêtes, médiane | 0,105 | 0,168 |
| cohérence d'orientation, médiane | 0,821 | 0,751 |

**Meilleur seuil possible : 43 % d'exactitude** — moins bien que répondre toujours « ce
n'est pas une chevelure ». L'indicateur ne sert à rien. Il est donc renvoyé à `null` avec sa
raison, et les trois sous-indicateurs restent publiés comme ce qu'ils sont : des mesures,
pas une conclusion.

**Conséquence pour le produit : le mode sans visage suppose que l'interface garantit le
contenu** (« cadrez votre chevelure »). C'est une hypothèse de protocole, pas une mesure.
Si quelqu'un photographie son chat, le moteur lui rendra une lecture capillaire.

### 4.5 Lecture multi-poses

Cinq poses (face, gauche, dessus, raie, macro) passées à `lectureMultiPoses` :

```
ok true | poses exploitables : face, gauche, dessus, raie, macro
  couleur          <- face    | boucle        <- gauche   | frizz      <- gauche
  longueur         <- face    | racinesGrasses<- raie     | secheresse <- face
  cassePointes     <- gauche  | brillance     <- face     | epaisseurFibre <- macro
  fourches         <- macro   | regulariteBord<- macro
  manquantes : densiteRaie, speculaireTorche
  duree 3007 ms
```

Chaque mesure est prise là où elle est la plus fiable et **dit de quelle pose elle vient**.
Le résultat n'est pas une moyenne : c'est une sélection, et la table de préférence est
publiée dans `PREFERENCE_POSE`. Les mesures qu'aucune pose n'a données sont listées dans
`manquantes` plutôt que remplies.

Validation honnête de ce point : **fonctionnelle seulement**. Les cinq poses viennent de
cinq personnes différentes — je n'avais pas de jeu multi-poses d'une même personne. Ce qui
est prouvé, c'est que la consolidation choisit la bonne pose et trace son origine ; ce qui
ne l'est pas, c'est qu'une même chevelure vue sous cinq angles donne des mesures
cohérentes entre elles.

---

## 5. Tableau v1 → v2, mesure par mesure

| mesure | v1 | v2 | verdict |
|---|---|---|---|
| Épaisseur de fibre | **désactivée** (aucune période plausible sur 58 chevelures) | mesurée, +3 à +7 % sur largeur connue, ±17 % en répétabilité | **redevient vraie** en macro, en pixels toujours, en micromètres seulement avec référence |
| Fourches / pointes fourchues | inexistante (la « casse » v1 était un proxy sans vérité terrain) | 0, 2, 4, 8 injectées → 0, 2, 4, 8 retrouvées | **redevient vraie** |
| Échelle pixels → mm | inexistante | carte et pièce détectées, ±1,7 % | **nouvelle, validée** |
| Cadrage / déclenchement | gate de qualité sur photo de face | gate macro : 78 refus sur 148, tous justifiés | **nouvelle, validée** |
| Images sans visage | **refusées** (100 %) | 155 / 157 segmentées et mesurées | **débloquées** |
| Brillance | Spearman −0,30, retirée | double prise torche : ordre parfait sur paires fabriquées, facteur 2 d'erreur absolue, jamais testée en vrai | **toujours non publiée** |
| Frizz | Spearman −0,26, retiré | lisible sur 22/27 images sans visage, mais toujours aucune vérité terrain ; la séquence en mouvement qui devait le sauver n'a pas pu être testée | **toujours non publié** |
| Cuticule | hors sujet | **impossible** : les écailles font 0,5 à 1 µm, un pixel en vaut 14 à 21 | **impossible sans microscope électronique** |
| Régularité du bord du fil | inexistante | mesurée à 20-100 µm, aucune vérité terrain | **non validée** |
| Densité à la raie | 6 détections sur 58 | 2 sur 27 sans visage, 0 sur les 15 images censées montrer une raie — mais **aucune de ces 15 n'est une vraie photo de raie** | **non testable avec ce corpus** |
| Certifier qu'on regarde des cheveux | le visage servait de garantie | 43 % d'exactitude : aucune garantie | **perdue en échange de la liberté de cadrage** |
| Boucle et type | 75 % à 1 près | inchangée, disponible aussi sans visage (26/27) | inchangée, élargie |
| Couleur L\*a\*b\* | clair/foncé 70 % | inchangée, disponible aussi sans visage (25/27) | inchangée, élargie |

---

## 6. Réponse directe : qu'est-ce qui redevient vrai, qu'est-ce qui reste impossible

**Redeviennent vraies, et je les publierais devant un client :**
- l'épaisseur de fibre, en pixels toujours, en micromètres si et seulement si une pièce ou
  une carte est dans le cadre et que l'incertitude reste sous 30 % ;
- le taux de pointes fourchues ;
- l'échelle réelle ;
- le guidage de prise de vue et son déclenchement automatique ;
- et, sans être une mesure nouvelle, **tout ce que la v1 mesurait déjà devient disponible
  sur des images sans visage**, ce qui double le nombre de photos exploitables.

**Restent non publiables aujourd'hui, faute de preuve et non faute de code :**
- la brillance par double prise torche : l'algorithme est bon sur des paires fabriquées,
  il n'a jamais vu de vraie paire. Il faut un téléphone et une demi-journée de prises.
- le frizz réel par le mouvement : implémenté, jamais testé, aucune vidéo utilisable.
- la régularité du bord : mesurée, mais rien ne prouve qu'elle dise quelque chose de
  l'état du cheveu.

**Restent impossibles, et aucune astuce logicielle n'y changera rien :**
- la cuticule : 0,5 à 1 µm, il faut un microscope électronique ;
- un diamètre au micromètre près avec un téléphone nu : l'incertitude est de 14 à 21 µm ;
- certifier que l'image contient bien des cheveux sans visage ni consigne d'interface.

**Reste non testé, et c'est ma limite, pas celle du moteur :**
- la densité à la raie. Le corpus libre de droits ne contient aucune vraie photo de raie
  de près — les recherches « hair parting scalp » rendent des épingles en bronze et des
  bustes romains. Il faut une vingtaine de photos de raie réelles pour trancher.

---

## 7. Ce qu'il faut faire ensuite, dans l'ordre

1. **Une demi-journée de prises réelles avec un téléphone** : 20 personnes, pour chacune
   une paire torche allumée / éteinte, une macro avec une pièce de 2 euros dans le cadre,
   une photo de raie de près, et une séquence de 2 secondes avec la tête qui tourne. C'est
   le seul verrou qui bloque la brillance, le frizz et la densité à la raie.
2. **Tester une bonnette macro clipsée à 10 euros.** Elle fait passer le cheveu de 5 à
   19 pixels et l'incertitude de 14 µm à 4 µm : c'est la différence entre « fin, moyen ou
   épais » et un vrai diamètre. Il faudra alors une autre référence d'échelle que la carte
   ou la pièce, qui ne tiennent plus dans le cadre.
3. **Écrire l'interface comme une garantie de contenu.** Le mode sans visage ne sait pas ce
   qu'il regarde : c'est le parcours qui doit le savoir. Chaque pose demandée explicitement,
   et rien de mesuré sur une image que l'utilisateur n'a pas confirmée.
4. **Ne pas afficher** : brillance, frizz, régularité du bord, densité à la raie, cheveux
   blancs. Elles sont dans `mesures` pour l'audit, avec leur état de validation.

---

## 8. Rejet de la peau, de la barbe et du fond (retour terrain du 19/09)

Test réel de Charles, homme barbu, webcam de MacBook : **le masque prenait le front, les
joues, le nez, la moustache et la barbe, et débordait sur le fond.** C'était le défaut le
plus visible du produit.

### 8.1 Ce qui a été changé

1. **Peau, test CIE Lab strict.** La peau humaine occupe un domaine étroit en Lab :
   L\* 28-92, a\* 3-28, b\* 5-36, teinte 22-78°, chroma 6-45. Ce test ne sert **jamais
   seul** — un châtain clair tombe dedans : il est combiné soit à la géométrie du visage,
   soit à l'absence de texture (la peau est lisse, un cheveu ne l'est pas). Il s'ajoute à
   la peau apprise sur les joues de la personne, déjà présente en v1.
2. **Barbe et moustache, par la géométrie et rien d'autre.** La texture d'une barbe EST
   celle d'un cheveu : aucun critère de texture ne peut les séparer, il ne faut même pas
   essayer. Règle : **tout ce qui est sous la ligne des yeux et dans l'ovale du visage est
   exclu**. La ligne des yeux vient des repères quand ils existent, sinon de 0,40 hauteur
   de visage. L'ovale est élargi à 0,54 de largeur et descendu sous le menton (centre à
   0,58, demi-hauteur 0,62) pour attraper la barbe qui déborde de la boîte. Au-dessus de
   la ligne des yeux, rien n'est exclu : c'est là que sont les cheveux.
3. **Fond.** La croissance refuse les pixels dont l'énergie de gradient tombe sous 18 % de
   celle de la graine (zone floue ou uniforme), en plus de la classification au plus proche
   modèle parmi cheveu, peau et trois couleurs de fond apprises sur le bord de l'image. Le
   masque final reste la seule composante connexe contenant la graine.
4. **Refus explicite.** Si après ces trois filtres il reste moins de 25 % du masque initial
   et moins de 5 % de l'image, le moteur renvoie `chevelure_indissociable_du_visage` au
   lieu d'un masque approximatif.

Un commutateur `filtresVisage: false` désactive les trois filtres : c'est lui qui permet de
mesurer l'avant et l'après sur exactement la même image.

### 8.2 Corpus

87 portraits Wikimedia Commons, licences relevées ; 75 visages détectés (OpenCV YuNet,
boîte + 5 repères) ; **55 images segmentées avant ET après** ; 53 annotées à la main :
**35 avec barbe ou moustache, 18 sans**.

Zones de vérité terrain construites géométriquement à partir de la boîte et des repères :
zone **peau** = ovale du visage entre la ligne des yeux et la ligne de bouche ;
zone **barbe** = ovale descendu, sous la ligne de bouche.
Contamination = part **du masque** occupée par la zone.

### 8.3 Résultat chiffré

**35 visages barbus ou moustachus**

| | avant | après | objectif |
|---|---|---|---|
| contamination par la peau — médiane | 0,19 % | **0,01 %** | < 2 % |
| contamination par la peau — maximum | 1,35 % | **0,79 %** | |
| images sous 2 % | 35/35 | **35/35** | atteint |
| contamination par la barbe — médiane | 0,85 % | **0,00 %** | < 5 % |
| contamination par la barbe — moyenne | 2,13 % | **0,00 %** | |
| contamination par la barbe — maximum | **9,69 %** | **0,00 %** | |
| images sous 5 % | 30/35 | **35/35** | atteint |

**18 visages sans barbe**

| | avant | après |
|---|---|---|
| contamination par la peau — médiane | 0,09 % | **0,00 %** |
| contamination par la peau — maximum | 0,85 % | **0,46 %** |
| images sous 2 % | 18/18 | **18/18** |

### 8.4 Objectif atteint ? Oui sur les chiffres, et voici les trois réserves

**Oui : 55/55 sous 2 % de peau, 55/55 sous 5 % de barbe.** Mais je ne vais pas arrondir en
ma faveur, et trois choses doivent être dites.

**Réserve 1 — le zéro sur la barbe est tautologique.** Ma zone de vérité terrain « barbe »
et ma zone d'exclusion sont toutes les deux dérivées de la même boîte visage, et
l'exclusion contient géométriquement la zone de vérité. Le zéro était donc acquis d'avance.
**Ce qui prouve quelque chose, c'est la colonne AVANT** : jusqu'à 9,7 % du masque était de
la barbe, médiane 0,85 %, cinq images au-dessus de 5 %. Le défaut existait, il est bien
supprimé — mais la mesure de l'après ne mesure que la cohérence de ma propre géométrie.
La vraie preuve est visuelle : sur un homme à barbe fournie, le masque couvrait avant les
cheveux **et** toute la barbe **et** la chemise **et** le fond ; après, il ne reste que la
chevelure sur le dessus de la tête.

**Réserve 2 — mon corpus est plus facile que le cas de Charles.** Ce sont des portraits de
presse cadrés large : la peau ne représentait déjà que 0,19 % du masque en médiane avant
correction. Une webcam de MacBook en gros plan, où le visage occupe la moitié du cadre,
est un cas nettement plus dur que tout ce que j'ai pu tester. **Le chiffre « moins de 2 %
de peau » est donc démontré sur des portraits larges, pas sur une webcam en gros plan.**

**Réserve 3 — le coût n'est pas nul et je ne peux pas le borner.** Les filtres retirent en
médiane 7,6 % du masque initial, mais jusqu'à 46 % au 90e centile. Et **91 % des pixels
retirés tombent hors des zones peau et barbe** : ils viennent du test de peau Lab (cou,
oreilles, épaules) et du filtre de flou. Sans vérité terrain sur les cheveux eux-mêmes, je
ne peux pas prouver qu'aucun vrai cheveu n'a été retiré. La couverture médiane du masque
passe de 12,7 % à 6,9 % chez les barbus : c'est beaucoup, et une partie est certainement du
fond correctement écarté, mais je ne sais pas dire quelle partie.

**Ce qui n'est pas réglé** : un casque de chantier ou un bonnet reste pris pour une
chevelure (visible sur une des images de contrôle), et sur un visage minuscule dans un
grand cadre, le masque peut se poser sur le mur derrière la tête sans que la confiance
descende assez pour refuser. Ces deux cas relèvent du § 7 et de l'interface.

---

## 9. Régression corrigée : la carte de peau mangeait les cheveux châtains

Signalé par l'agent interface : sur une tête à cheveux **châtains**, le moteur refusait
avant même de segmenter, `graine_indistincte_du_fond`, avec `partPeauGraine` à 99,9 puis
100 %. Autrement dit le filtre de peau du § 8 mangeait la couleur de cheveux la plus
fréquente en France.

### 9.1 Cause, mesurée et non supposée

Deux fautes cumulées, toutes deux dans le chemin ajouté au § 8.

**Faute 1 — un domaine de peau théorique contient le châtain.** Mesure directe sur des
couleurs de référence, peau claire RGB(222,178,152) soit L\*=75,8 a\*=12,3 b\*=19,4 :

| couleur de cheveu | L\* | ΔE 76 à la peau | mon test Lab générique disait |
|---|---|---|---|
| châtain RGB(118,86,58) | 39,3 | 36,7 | **peau** |
| blond foncé RGB(150,118,78) | 51,8 | 25,6 | **peau** |
| roux RGB(140,78,42) | 39,9 | 39,6 | **peau** |
| brun foncé RGB(62,45,35) | 20,1 | 56,9 | pas peau |
| poivre et sel RGB(150,148,145) | 61,4 | 25,7 | pas peau |

Le domaine Lab de la peau (L\* 28-92, a\* 3-28, b\* 5-36, teinte 22-78°) **contient
exactement** le châtain, le blond foncé et le roux. Ils y sont par construction : ce sont
des couleurs de mélanine, comme la peau.

**Faute 2 — quand la peau ne pouvait pas être apprise, on retombait sur le test YCbCr**,
celui-là même qui classait le châtain comme peau et que j'avais corrigé en v1. Il était
revenu par la porte de derrière, dans la branche de repli.

**Sens des seuils, vérifié.** Le test de peau personnalisé utilisait la distance pondérée
de la chevelure (L\* à 0,35). Pour la peau c'est à l'envers : ce qui sépare une peau d'un
châtain, c'est précisément la clarté — 36 unités de L\* — et la pondérer à 0,35 efface la
seule chose qui les distingue. Un châtain tombait à 21,9 d'une peau au lieu de 36,7.

### 9.2 Correction

Un pixel n'est PEAU que si les **trois** conditions sont vraies :

1. **Couleur** : proche de la peau **de cette personne**, apprise sur ses joues, en ΔE 76
   (poids égaux sur L\*, a\*, b\*), seuil appris sur la dispersion de sa propre peau et
   borné à 18. Aucun domaine de peau théorique n'intervient plus dans l'exclusion.
2. **Texture** : gradient sous 2,5 fois celui de **sa propre peau**. Un cheveu a une
   énergie de gradient élevée, la peau non. C'est cette condition qui sauve les châtains.
3. **Géométrie** : sous la ligne des yeux. Au-dessus, on est dans la chevelure : aucun
   pixel n'y est jamais exclu comme peau.

Si la peau ne peut pas être apprise sur la personne, **aucune exclusion par la couleur
n'est faite** : seule la géométrie joue. Plus aucun repli sur un test générique.

### 9.3 Preuve sur têtes de contrôle (couleur de cheveu exacte, texture de fils)

| couleur | avant (couleur seule) | après (couleur + texture + géométrie) |
|---|---|---|
| châtain | **REFUS `graine_indistincte_du_fond`** | OK, couverture 33,7 % |
| blond foncé | **REFUS `graine_indistincte_du_fond`** | OK, couverture 33,7 % |
| roux | **REFUS `graine_indistincte_du_fond`** | OK, couverture 33,7 % |
| brun foncé | OK 31,0 % | OK 33,7 % |
| blond clair | OK 2,9 % (masque presque entièrement mangé) | OK 33,6 % |
| poivre et sel | OK 34,0 % | OK 34,0 % |

Le défaut signalé est reproduit à l'identique, et il disparaît.

### 9.4 Sur images réelles : le refus ne se reproduit pas, mais le risque se mesure

18 portraits couleur modernes annotés à la main par couleur de cheveux (7 châtains,
6 noirs, 1 roux, 1 blond clair, 1 blond cendré, 2 poivre et sel), visages détectés par
OpenCV YuNet.

**Taux de refus, avant et après : identiques, 3 sur 18 (16 %) dans les deux cas** — et
**aucun châtain refusé, même avant**. Les 3 refus sont 2 chevelures noires sur fond sombre
et 1 tête coupée par le cadre, sans rapport avec la peau.

Je ne vais pas présenter cela comme une validation : **je n'ai pas reproduit le défaut sur
mes images réelles.** Ce que j'ai pu mesurer, c'est le risque qui restait :

| couleur | n | part du masque que l'ANCIENNE règle appelait « peau » (médiane / max) | NOUVELLE règle | L\* moyen des cheveux |
|---|---|---|---|---|
| blond cendré | 1 | **68,0 % / 68,0 %** | 0,00 % | 54,0 |
| roux | 1 | 24,9 % / 24,9 % | 0,00 % | 48,8 |
| châtain | 7 | 16,1 % / **47,3 %** | 0,00 % | 25,3 |
| blond clair | 1 | 9,6 % / 9,6 % | 0,00 % | 47,8 |
| noir | 4 | 8,2 % / 10,2 % | 0,00 % | 20,5 |
| poivre et sel | 1 | 0,2 % / 0,2 % | 0,00 % | 24,1 |

**La contamination suit la clarté du cheveu** : elle est maximale sur les chevelures
claires (blond cendré L\*=54 : 68 % du masque), et mes châtains réels sont sombres
(L\*=25) parce que ce sont des photos d'extérieur ou de studio. Une webcam de MacBook,
où l'écran éclaire la tête de face, donne un châtain **clair** — exactement la zone où la
contamination atteignait 47 à 68 %. C'est cohérent avec ce qui a été observé en
production, et c'est pour cela que mon corpus ne l'a pas reproduit.

### 9.5 Réponse franche

**Les châtains ne sont plus refusés** : reproduit et corrigé sur cas de contrôle, et sur
images réelles la nouvelle règle ne classe **plus aucun pixel** de chevelure comme peau,
toutes couleurs confondues (0,00 % partout, contre jusqu'à 68 % avant).

**Mais je n'ai pas de preuve sur le cas exact de Charles.** Mon corpus libre de droits ne
contient pas de webcam de MacBook en gros plan sur un châtain clair. Il faut **une seule
capture de son écran** pour clore le sujet : c'est le test qui manque, et il prend deux
minutes.

---

## 10. Filtre produits et etape : alignement sur le catalogue relu (19/09)

Deux defauts remontes par l'agent catalogue, corriges et mesures sur le catalogue complet
(**4 446 produits, 114 marques**).

### 10.1 Le filtre anti-coffret ecartait de vrais produits

Regles affinees :

- **« set »** ne vaut coffret que si **aucune forme galenique** n'apparait dans le nom
  (lotion, spray, hairspray, cream, mousse, gel, foam, balm, huile, serum, lait, beurre,
  masque, cire, pate, poudre). « shampoo » et « conditioner » sont volontairement exclus de
  cette liste : un « Shampoo + Conditioner Set » reste un lot.
- **« body », « shower », « corps », « douche », « parfum », « mains », « visage »** :
  aucun de ces mots n'ecarte plus un produit a lui seul. Il faut en plus que la categorie
  ne soit pas capillaire ET que le nom ne parle pas de cheveux.
- **« sans parfum »** n'est plus confondu avec un parfum.
- **« free »** retire du motif promotionnel : il ecartait vingt vrais produits
  (Sulfate Free, Paraben Free, Fragrance Free, Frizz Free, Free Styler).

**Effet mesure : de 56 produits ecartes a 2 sur 4 446.** Les deux restants sont de vraies
entrees promotionnelles (« 3 mois + 1 mois OFFERT », « 1 mois offert »). Verifie un par un
sur les cas cites : SWIFT SET LOTION, SHAPE SET HAIRSPRAY, BODY.BUILDER, Body Envy
Volumizing Shampoo, Hair & Body Wash, Creme Legere Mains et Cheveux, Chronologiste L'Huile
de Parfum, les quatre produits « sans parfum » — **tous gardes**.

### 10.2 L'etape du catalogue fait foi

`etapeDe` utilise desormais le champ `etape` du catalogue **en premier**, la categorie
ensuite, et le nom en tout dernier recours. C'est l'inverse de la v2 initiale, ou le nom
primait — un choix qui se justifiait quand le catalogue n'etait pas relu, et qui ne se
justifie plus.

**Effet mesure : 3 produits sur 4 446 changent d'etape**, exactement les trois signales :

| produit | avant | apres | categorie catalogue |
|---|---|---|---|
| Snag-Free Pre-Shampoo Detangler For Curly Hair | 1 lavage | **2 soin** | apres-shampooing |
| Mega Slip Pre-Shampoo Detangler | 1 lavage | **2 soin** | apres-shampooing |
| Bain Creme Symbiose anti-pelliculaire | 4 traitement | **1 lavage** | anti-pellicules |

### 10.3 Effet sur les 16 routines : aucun

Les 16 profils repasses sur le catalogue complet donnent **exactement les memes quatre
produits qu'avant la correction** : 0 routine modifiee, 0 incomplete, 0 doublon d'etape.
C'est logique et c'est une bonne nouvelle : les 34 produits rendus au catalogue n'etaient
pas ceux qui gagnaient, et les 3 reclassements ne concernaient pas des produits retenus.
La correction rend de la matiere disponible sans rien casser.

### 10.4 Un point a renvoyer au catalogue

Sur le profil « gras aux racines », l'etape 3 retenue est un **gommage moussant au sel**
(TEA TREE SPECIAL DETOX FOAMING SALT SCRUB), range en `soin-sans-rincage` etape 3 dans le
catalogue. Un gommage n'est pas un soin sans rincage. Maintenant que le moteur s'aligne sur
le champ `etape`, ce genre de classement passe tel quel : c'est au catalogue de trancher,
pas au moteur de le contredire.

---

## 11. Le decor pris pour une chevelure — reproduit et corrige (20/09/2026)

La reserve ouverte en §9.5 disait : « il manque une seule capture de son ecran ».
Charles en a envoye quatre le 20/09. Elles ont ete decoupees dans le cadre video
et passees au moteur hors ligne (`segmentCheveux`, boite visage posee a la main).

### Ce que le moteur faisait

| pose | modele appris | chroma | confiance annoncee | ou tombait le masque |
|---|---|---|---|---|
| face | L\* 75,2 | 2,2 | **0,93** | le rideau, a gauche |
| gauche | L\* 71,6 | 2,0 | **0,95** | le rideau |
| droite | L\* 86,1 | 1,4 | **1,00** | le rideau |
| raie | L\* 24,2 | 13,7 | 1,00 | les cheveux |

Trois poses sur quatre mesuraient le decor **en annoncant 93 a 100 % de
confiance**. Le masque rendu a l'ecran couvrait le rideau et laissait la
chevelure dans le noir : c'est ce que Charles voyait.

### La regle ajoutee

Une chevelure garde toujours un reste de couleur. Le brun tire sur le jaune-rouge,
le blond aussi, et un poivre et sel n'est pas neutre a ce point. Un gris de
**chroma < 4** a **L\* > 55** qui est en plus **a moins de 20 du modele de fond**
est une surface peinte ou tissee, pas des cheveux. Les trois conditions sont
exigees ensemble pour ne pas ecarter de vrais cheveux blancs devant un fond sombre,
ou la distance au fond est grande.

Le moteur refuse alors avec `fond_pris_pour_des_cheveux`, et l'interface dit quoi
faire : se placer devant un fond plus sombre que les cheveux.

### Apres correction, sur les memes images

| pose | resultat |
|---|---|
| face | refusee — L\* 75,2 / chroma 2,2 / distance au fond 15 |
| gauche | refusee — L\* 71,6 / chroma 2,0 / distance 14 |
| droite | refusee — L\* 86,1 / chroma 1,4 / distance 13 |
| raie | **acceptee**, modele inchange : L\* 24,2, chroma 13,7, confiance 1,00 |

La seule pose qui lisait vraiment des cheveux passe toujours, avec exactement le
meme modele qu'avant. Les trois autres ne publient plus rien.

### Ce que cela ne prouve pas

Le corpus reste de quatre images, d'une seule personne, dans une seule piece, avec
un serre-tete lumineux sur la tete. La regle est fondee sur une propriete physique
(la chromaticite du cheveu) et non sur ces quatre cas, mais son seuil, lui, n'est
cale que sur eux. Il faudra le reverifier des qu'on aura des captures d'autres
personnes — en particulier une chevelure blanche ou grise devant un mur clair, qui
sera refusee alors qu'elle est reelle.
