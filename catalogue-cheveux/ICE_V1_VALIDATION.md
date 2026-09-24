# ICE v1 — Indice Capillaire par Extraction : validation

Moteur : `public/scan/vyvre-hair-engine.js` (`window.VYVRE_HAIR_ENGINE`, version `ice-v1`).
Banc et mesures du 19/09/2026. Tout ce qui suit est mesuré, rien n'est estimé de tête.

**Lire ce document avant de montrer un chiffre du moteur à un client.** Plusieurs mesures
sont calculées correctement mais ne veulent rien dire : elles sont listées comme telles et
le moteur refuse lui-même de les publier en score.

---

## 1. En une phrase

Sur 60+ chevelures très variées, ICE v1 sait **refuser proprement une image inexploitable**
(46 % du corpus refusé avec une raison en clair), sait **estimer la nature de la boucle**
(type juste à 1 près 3 fois sur 4) et **distinguer une chevelure claire d'une chevelure
foncée** (7 fois sur 10). Tout le reste — brillance, frizz, sécheresse, casse, racines
grasses, cheveux blancs, densité à la raie, finesse de fibre — est calculé depuis les
pixels mais **n'a pas passé la validation** : le moteur le garde dans `mesures` avec son
état de validation et le **retire des scores affichés**.

---

## 2. Comment appeler le moteur

```html
<script src="/scan/vendor/face-api-1.7.15.min.js"></script>
<script src="/scan/vyvre-hair-engine.js"></script>
```

```js
// 1. le questionnaire est posé AVANT le scan — TROIS questions depuis le 19/09/2026
const questions = VYVRE_HAIR_ENGINE.QUESTIONS;       // type_ressenti, probleme, etat
const reponses  = { type_ressenti:'boucles', probleme:'secheresse', etat:'colores' };
// lavage et age ne sont plus demandés. Un appelant qui les possède déjà (fiche institut)
// peut les passer quand même : VYVRE_HAIR_ENGINE.QUESTIONS_FACULTATIVES les décrit.

// 2. scan (video, image ou canvas). Rien ne sort de l'appareil.
const r = await VYVRE_HAIR_ENGINE.runHairScan(videoOuImage, {
  reponses,
  produits: catalogueCheveux,          // catalogue-cheveux/sortie/all.json ou les .json par marque
  marque:  'olaplex'                   // seulement en mode marque vyvre.fr/m/<marque>/cheveux
});

if (!r.ok) montrer(r.message);          // refus explicite, aucun chiffre inventé
else {
  r.mesures;    // mesures brutes + methode + limite + raison quand c'est null
  r.scores;     // scores 0..100 avec partMesuree / partDeclaree pour chacun
  r.qualite;    // score de prise, netteté, exposition, état du masque
  r.limites;    // les angles morts, à afficher ou au moins à connaître
  r.routine;    // 4 produits, un par étape
}
```

API : `runHairScan`, `analyseFrame(imageData, roi)`, `segmentCheveux(imageData, faceBoxOuLandmarks)`,
`composerRoutine(scores, reponses, produits, options)`, plus `QUESTIONS`,
`QUESTIONS_FACULTATIVES`, `VALIDATION`, `CE_QUI_EST_MESURE` et toutes les briques exposées
pour audit.

Aucune dépendance en dehors de face-api déjà présent. Tout se calcule sur l'appareil.

---

## 3. Le jeu de test

| | |
|---|---|
| Images téléchargées | 406, Wikimedia Commons, API `commons.wikimedia.org` |
| Licences | CC BY-SA 4.0 (132), CC BY 2.0 (56), CC BY-SA 2.0 (56), domaine public (47), CC BY-SA 3.0 (44), CC0 (28), CC BY 4.0 (21), sans restriction (6) |
| Variantes de re-prise générées | 50 (5 par chevelure sur 10 chevelures) |
| Versions haute résolution | 73 (mêmes personnes, 1600 px) |
| Total passé au banc | 529 |
| Chevelures regardées une par une et annotées à la main | 99 |
| Retenues comme exploitables pour comparer | 73 |

Variété obtenue : types 1 à 4, cheveux noirs, bruns, châtains, blonds, roux, blancs et
gris, colorations vives (rouge, vert), tresses, locs, cornrows, chignons, queues, coupes
très courtes, hommes et femmes, enfants et personnes âgées, studio, extérieur, lumière de
scène, photos de téléphone, photos anciennes en noir et blanc.

Chaque source (titre Commons, licence, auteur) est conservée dans le tableau du § 8.

**Limite de ce jeu de test, à dire tout de suite** : ce sont des photos de presse et de
portrait libres de droits, pas des selfies pris en conditions de scan. Elles sont plus
difficiles que le vrai cas d'usage (arrière-plans chargés, plusieurs personnes, lumière de
scène colorée), et mon annotation a été faite sur des vignettes de 300 px, ce qui la rend
fiable pour la couleur et le type de boucle, et **peu fiable pour le frizz et la
brillance**. Les chiffres ci-dessous sont donc un plancher, pas un verdict définitif — mais
c'est le seul chiffre que j'ai le droit d'écrire aujourd'hui.

---

## 4. Ce que le moteur accepte et ce qu'il refuse

Sur les 529 images passées au banc :

| Issue | Nombre | Part |
|---|---|---|
| Scan publié | 284 | 54 % |
| Visage non détecté | 108 | 20 % |
| Cheveux et fond indistincts au-dessus du front | 43 | 8 % |
| Masque trop petit | 42 | 8 % |
| Qualité de prise insuffisante | 26 | 5 % |
| Chevelure hors cadre | 19 | 4 % |
| Rien au-dessus du front (crâne rasé, calvitie) | 6 | 1 % |
| Fuite du masque dans le fond | 1 | 0 % |

Sur les 73 chevelures annotées comme exploitables, le moteur en accepte 58 et en refuse 15
(6 graine indistincte du fond, 3 hors cadre, 3 masque trop petit, 2 qualité, 1 sans
chevelure au-dessus du front). **Ces refus sont volontaires** : mieux vaut redemander une
photo que publier une mesure prise sur un mur.

Durée : médiane **186 ms** par image, p90 377 ms, maximum 1 200 ms (Node, machine chargée).
Trois frames de vidéo restent donc largement sous les 3 s demandées.

---

## 5. Accord mesure / annotation manuelle

### 5.1 Boucle et type (la mesure la plus solide)

| | |
|---|---|
| Chevelures comparées | 52 |
| Type exact | 23 (44 %) |
| Type juste à 1 près | 39 (**75 %**) |
| Écart de 2 types ou plus | 13 |

Méthode : tenseur de structure (Bigün & Granlund 1987), variation d'orientation entre blocs
voisins pondérée par la cohérence, plus l'entropie de l'histogramme d'orientation.

Les 13 gros écarts sont presque tous explicables et **prévus** : coiffure attachée,
tressée ou lissée (locs, cornrows, chignon) où l'orientation devient régulière quel que
soit le cheveu ; et bigoudis ou mains de coiffeur dans le champ. C'est la raison pour
laquelle le type mesuré **ne remplace jamais** le type déclaré : il le confirme ou le
contredit, avec 55 % de poids mesuré et 45 % de poids déclaré.

### 5.2 Couleur

| | |
|---|---|
| Chevelures comparées | 54 |
| Clair vs foncé juste | 38 (**70 %**) |
| Noir / brun foncé / châtain séparés | **non, jamais** |

Mesuré : L\*a\*b\* CIE, chroma, teinte, homogénéité. La couleur de corps est prise au
**mode** de l'histogramme de L\* (pic), après retrait des 8 % de pixels les plus clairs.

Distribution mesurée de L\* par famille annotée (médianes) : noir 23, brun foncé 8,
châtain 17, blond 74, blanc 53. **Les trois familles foncées se recouvrent entièrement.**
Annoncer « châtain » plutôt que « noir » serait inventer une précision qui n'existe pas.
Le moteur ne publie donc plus qu'une classe grossière (fonce / moyen / clair / très clair /
gris ou blanc / cuivré / coloration vive) et la vraie sortie reste le triplet L\*a\*b\*.

Ce qui fait encore échouer les 30 % restants : lumière de scène colorée (une blonde sous un
projecteur violet ressort en « coloration vive »), foulards et bandeaux colorés pris pour
des cheveux, et arrière-plans très contrastés.

### 5.3 Cheveux blancs — NON VALIDÉ

Corrélation de rang avec mon annotation (échelle 0 à 3) : **Spearman 0,15** sur 54
chevelures. C'est proche de rien. Le premier critère (relatif à la médiane) donnait 0,02 ;
le critère absolu (L\* > 58 et chroma < 12, dispersion sur une grille 6×6) monte à 0,15.
Ce n'est pas assez. **Le score « cheveux blancs » est retiré de l'affichage** et retombe
sur la tranche d'âge déclarée.

### 5.4 Brillance — NON VALIDÉ, et pour une raison intéressante

**Spearman −0,30** sur 58 chevelures : la mesure est **anti-corrélée** avec la brillance
que je vois. L'explication est physique et je l'avais écrite dans le code avant de la
mesurer : un reflet spéculaire ajoute une quantité de lumière à peu près constante ; sur un
cheveu noir il ressort énormément, sur un cheveu blond il se noie. La mesure suit donc la
**noirceur** du cheveu plus que sa brillance. Le passage du contraste de Michelson à la part
spéculaire (pixels clairs ET désaturés, modèle dichromatique de Shafer) a amélioré la
segmentation mais pas le signe de la corrélation.

**Le score « brillance » n'est plus publié.** Pour qu'il le devienne, il faudrait comparer à
couleur constante (ce que ce jeu d'images ne permet pas) ou calibrer avec une charte.

### 5.5 Frizz / halo — NON VALIDÉ

**Spearman −0,26** sur 38 chevelures ; 20 chevelures sans mesure du tout (fond aussi texturé
que la chevelure, ou image trop floue). Cause principale mesurée : les photos Commons font
455 à 700 px de large, la tête en occupe 150 à 300 px, **un cheveu ne fait pas un pixel**.
J'ai téléchargé 73 versions 1600 px des mêmes personnes pour tester l'hypothèse ; le moteur
travaille de toute façon à 384 px (au-delà, le coût des mesures spatiales explose, mesuré
à plusieurs dizaines de secondes par image avant que je remplace la dilatation itérative par
une transformée de distance). **Le score « frizz » n'est plus publié** et retombe sur le
type ressenti déclaré.

### 5.6 Sécheresse, casse, racines grasses — NON VALIDÉS

- **Sécheresse** : construite à 60 % sur l'inverse de la brillance. Comme la brillance n'est
  pas validée, elle ne l'est pas non plus. Retombe sur l'état et la gêne déclarés.
- **Casse / pointes** : mesurée sur 57 chevelures sur 58 (squelettisation Zhang-Suen du
  tiers bas, comptage des extrémités). **Aucune vérité terrain** : je n'ai aucun moyen de
  savoir en regardant une photo si des pointes sont cassées ou coupées en dégradé. Le
  chiffre existe, rien ne prouve qu'il mesure une casse.
- **Racines grasses** : le haut du crâne est plus brillant chez tout le monde parce que
  l'éclairage vient du dessus. Ce confondant n'est pas séparable sur une photo unique non
  calibrée. La fréquence de lavage déclarée reste la seule source utilisable.

### 5.7 Densité à la raie — presque toujours indisponible

Raie trouvée et mesurée sur **6 chevelures sur 58** (10 %). La première version en trouvait
une sur 98 sur 107 : c'était un générateur de faux positifs, il acceptait tout segment plus
clair que les cheveux. La version actuelle exige des pixels de **teinte peau** (YCbCr, Hsu
2002) encadrés de cheveux, alignés sur 8 lignes contiguës, avec un contraste de L\* > 6.
Correction jamais vérifiée faute de vérité terrain. **Non publié.**

### 5.8 Finesse de fibre — DÉSACTIVÉE

Sur 58 chevelures, la FFT n'a trouvé **aucune** période dans la plage plausible d'un
espacement de mèches (0,3 à 3 mm). Les pics trouvés correspondaient à des ondulations
larges (2,6 à 32 mm), pas à des fibres. C'est cohérent avec la physique : un cheveu fait
0,04 à 0,12 mm de diamètre, un pixel de webcam vaut 0,15 à 0,4 mm. **La mesure renvoie
maintenant null avec la raison `mesure_desactivee_non_validee`.** Le code reste en place,
documenté, pour une reprise avec une photo macro.

---

## 6. Répétabilité

C'est le test qui dit si on mesure vraiment quelque chose. Deux protocoles.

### 6.1 Cinq prises de la même chevelure (variations de prise de vue)

10 chevelures, 5 variantes chacune : cadrage réduit de 14 % avec décalage, rotation +4°,
exposition +11 %, rotation −3,5° avec exposition −8 % et compression forte. Écart-type
médian entre prises, sur l'échelle 0 à 1 :

| mesure | écart-type médian | sur 100 points d'écran |
|---|---|---|
| sécheresse | 0,054 | ±5 |
| racines grasses | 0,056 | ±6 |
| boucle | 0,065 | ±7 |
| brillance | 0,076 | ±8 |
| casse | 0,123 | ±12 |
| frizz | 0,151 | ±15 |

**Ce sont des transformations d'une même photo, pas cinq vraies photos** : ni la pose, ni
la direction de la lumière, ni la coiffure ne changent. Ce test mesure la robustesse au
cadrage et à l'exposition, rien de plus.

### 6.2 Vraies photos différentes de la même personne

6 personnes retrouvées en 2 à 5 photos distinctes dans le corpus (séances et jours
différents) : homme blond platine, homme à locs grisonnantes, femme blonde sur scène,
homme à cornrows, fillette crépue, joueur à cheveux bouclés.

| mesure | écart-type médian | sur 100 points d'écran |
|---|---|---|
| casse | 0,084 | ±8 |
| sécheresse | 0,090 | ±9 |
| boucle | 0,104 | ±10 |
| racines grasses | 0,118 | ±12 |
| brillance | 0,157 | ±16 |
| frizz | 0,220 | ±22 |

**Lecture honnête** : entre deux vraies photos de la même personne, un score bouge de 8 à 22
points sur 100. La boucle (±10) est la plus stable des mesures utiles. La brillance et le
frizz bougent trop pour être affichés — ce qui confirme, par un deuxième chemin, la décision
du § 5.4 et du § 5.5.

---

## 7. Cas extrêmes

| Situation | Images | Comportement | Verdict |
|---|---|---|---|
| Aucune personne (paysages) | 23 | 22 refusées (visage non détecté), 1 acceptée (une personne était présente) | **correct** |
| Photo en noir et blanc | 2 | couleur refusée (`image_monochrome`, chroma médiane de l'image < 2) ; 1 des 2 refusée dès la segmentation | **correct** |
| Peinture, fresque, portrait ancien | 5 | 2 refusées, 3 acceptées et mesurées | acceptable, pas un cas réel |
| Mannequin de vitrine | 3 | 3 acceptées et mesurées comme une chevelure | **trou** |
| Fond de la même couleur que les cheveux | 43 | refusées `graine_indistincte_du_fond` | **correct, et c'est un vrai gain** |
| Cheveux attachés, tressés, chignon | 12 | acceptées, type de boucle sous-estimé (signalé § 5.1) | acceptable |
| Crâne rasé, calvitie | 8 | 6 refusées `pas_de_chevelure_au_dessus_du_front`, **2 acceptées à tort** | **trou partiel** |
| Bonnet, casquette, casque, foulard, cagoule | 12 | **majoritairement acceptées, le tissu est mesuré comme une chevelure** | **TROU** |
| Plusieurs personnes dans l'image | 8 | acceptées, seule la chevelure du plus grand visage est mesurée | à documenter côté écran |

**Le trou le plus grave** : ICE v1 ne sait pas distinguer un bonnet, une casquette, un
foulard, un casque ou une perruque d'une vraie chevelure. Il mesure le tissu et publie des
chiffres. Aucun réglage colorimétrique ne corrige ça. **L'écran doit demander de se
découvrir avant le scan** ; le moteur renvoie cet avertissement en permanence dans
`resultat.limites`.

---

## 8. Tableau image par image

Colonnes : ce que j'ai annoté à la main en regardant l'image, puis ce que le moteur a
mesuré. « REFUSE » = le moteur n'a rien publié, avec sa raison.

| image | source (Commons) | licence | couleur attendue | classe mesuree | L* | type attendu | type mesure | blancs attendus | blancs mesures | etat |
|---|---|---|---|---|---|---|---|---|---|---|
| p_028 | 12 de Abril de 2011 (5616533478).jpg | CC BY-SA 2.0 | brun fonce | fonce | 18 | 1 | 1 | 0 | 0 | ok (q=73, masque 0.79) |
| p_032 | Diane Ackerman 2007.jpg | CC BY 4.0 | brun fonce | fonce | 2 | 4 | 3 | 0 | 0 | ok (q=81, masque 0.98) |
| p_035 | 2009 Women's British Open - Suzann Pet | CC BY-SA 3.0 | blond | moyen | 37 | 1 | 3 | 0 | 0.13 | ok (q=98, masque 1) |
| p_042 | 20131031 AT06 Jelena Prvulovic 8840.jp | CC BY-SA 3.0 a | chatain fonce | fonce | 8 | 1 | 2 | 0 | 0.001 | ok (q=85, masque 0.52) |
| p_046 | 20160224 Köln ESC Unser Lied fuer Stoc | CC BY-SA 3.0 | brun | tres clair, gris ou blanc | 88 | 2 | 1 | 0 | 0.449 | ok (q=85, masque 0.92) |
| p_047 | 20160224 Köln ESC Unser Lied fuer Stoc | CC BY-SA 3.0 | brun | tres clair | 83 | 2 | 4 | 0 | 0.287 | ok (q=80, masque 0.9) |
| p_058 | After- new hair colour.jpg | CC BY 2.0 | chatain clair | moyen | 33 | 1 | 1 | 0 | 0 | ok (q=71, masque 0.97) |
| p_073 | Elizabeth Scarlett in Manhattan, 2019. | CC BY-SA 4.0 | blond cendre gris | tres clair | 65 | 1 | 1 | 2 | 0.417 | ok (q=87, masque 0.61) |
| p_081 | 2020-05-07 12.29.42 copy.jpg | CC BY-SA 4.0 | noir | fonce | 16 | 1 | 1 | 0 | 0 | ok (q=84, masque 0.96) |
| p_083 | Abdel-Rehim.jpg | CC BY-SA 4.0 | noir | moyen | 34 | 1 | 1 | 1 | 0.225 | ok (q=79, masque 0.81) |
| p_089 | Andrey rossomahin self-portret.jpg | CC BY-SA 4.0 | noir et blanc | REFUSE | - | 1 | - | None | - | refuse : graine_indistincte_du_fond |
| p_095 | Asi tzobel.jpg | CC BY-SA 3.0 | brun | fonce | 17 | 3 | 4 | 0 | 0.003 | ok (q=98, masque 0.96) |
| p_098 | Bitsgrafia.jpg | CC BY-SA 4.0 | noir | fonce | 6 | 2 | 3 | 0 | 0.038 | ok (q=67, masque 0.59) |
| p_115 | 28º Salão Internacional do Automóvel d | CC BY 2.0 | blond | moyen | 35 | 1 | - | 0 | 0.095 | ok (q=72, masque 0.41) |
| p_123 | 6F1A0099.JPG | CC BY-SA 4.0 | vert turquoise (coloration vive) | REFUSE | - | 2 | - | 0 | - | refuse : chevelure_hors_cadre |
| p_124 | 6F1A0110.JPG | CC BY-SA 4.0 | vert (coloration vive) | REFUSE | - | 2 | - | 0 | - | refuse : chevelure_hors_cadre |
| p_126 | Anouck Lepere 03.jpg | CC BY-SA 2.0 | roux | fonce | 10 | 3 | 3 | 0 | 0 | ok (q=72, masque 0.62) |
| p_127 | Anouck Lepere 04.jpg | CC BY-SA 2.0 | brun | REFUSE | - | 2 | - | 0 | - | refuse : chevelure_hors_cadre |
| p_128 | Anouck Lepere 05.jpg | CC BY-SA 2.0 | brun | fonce | 11 | 2 | 4 | 0 | 0 | ok (q=82, masque 0.99) |
| p_129 | Anouck Lepere.jpg | CC BY-SA 2.0 | brun | REFUSE | - | 2 | - | 0 | - | refuse : graine_indistincte_du_fond |
| p_142 | 06NRcGsh95g.jpg | CC BY-SA 4.0 | brun balayage | REFUSE | - | 2 | - | 0 | - | refuse : graine_indistincte_du_fond |
| p_147 | A girl holding an open book in an indo | CC BY-SA 4.0 | noir | fonce | 18 | 1 | 2 | 0 | 0.032 | ok (q=100, masque 0.99) |
| p_156 | Harajuku Fashion Street Snap (2018-01- | CC BY 2.0 | brun | fonce | 19 | 2 | 3 | 0 | 0.193 | ok (q=61, masque 0.42) |
| p_161 | Luca Nowak portrait.jpg | CC BY-SA 4.0 | brun | moyen | 34 | 1 | - | 0 | 0 | ok (q=73, masque 0.8) |
| p_167 | Madagascar Kids 21 (4884780758).jpg | CC BY 2.0 | noir | REFUSE | - | 4 | - | 0 | - | refuse : graine_indistincte_du_fond |
| p_176 | 250412 FC 서울 vs 대전 (Jesse Lingard) 1.j | CC BY-SA 4.0 | chatain | fonce | 13 | 3 | - | 0 | 0 | ok (q=88, masque 0.62) |
| p_177 | 250412 FC 서울 vs 대전 (Jesse Lingard) 2.j | CC BY-SA 4.0 | noir | fonce | 6 | 4 | 4 | 0 | 0 | ok (q=88, masque 0.69) |
| p_178 | 250419 FC 서울 vs 광주 (Gabriel Tigrão).jp | CC BY-SA 4.0 | noir | REFUSE | - | 4 | - | 0 | - | refuse : pas_de_chevelure_au_dessus_du_front |
| p_181 | 250617 FC 서울 vs 강원 (Vitor Gabriel) 2.j | CC BY-SA 4.0 | blond platine decolore | tres clair, gris ou blanc | 86 | 4 | 4 | 0 | 0.806 | ok (q=83, masque 0.54) |
| p_182 | 250617 FC 서울 vs 강원 (Vitor Gabriel) 3.j | CC BY-SA 4.0 | blond platine decolore | tres clair, gris ou blanc | 81 | 4 | 1 | 0 | 0.859 | ok (q=98, masque 0.93) |
| p_183 | 250720 FC 서울 vs 울산 (Anderson Oliveira) | CC BY-SA 4.0 | noir | clair | 45 | 4 | 4 | 0 | 0.128 | ok (q=85, masque 0.78) |
| p_185 | 250720 FC 서울 vs 울산 (Jesse Lingard).jpg | CC BY-SA 4.0 | chatain | fonce | 15 | 3 | - | 0 | 0.034 | ok (q=88, masque 0.72) |
| p_187 | 250831 FC 서울 vs 안양 (Jesse Lingard) 1.j | CC BY-SA 4.0 | noir | fonce | 2 | 4 | 4 | 0 | 0.008 | ok (q=85, masque 0.78) |
| p_189 | 250831 FC 서울 vs 안양 (Jesse Lingard) 4.j | CC BY-SA 4.0 | chatain | REFUSE | - | 3 | - | 0 | - | refuse : masque_trop_petit |
| p_192 | 2021-10-09 BLT Sbobo Ndlangamadla-7761 | CC BY-SA 2.0 | noir | fonce | 3 | 4 | 3 | 0 | 0.057 | ok (q=79, masque 0.97) |
| p_196 | Abena, 2019.jpg | CC BY-SA 4.0 | noir | moyen | 26 | 4 | - | 0 | 0.137 | ok (q=74, masque 0.52) |
| p_202 | Black Lives Matter Rotterdam (5).jpg | CC BY-SA 4.0 | noir | tres clair, gris ou blanc | 69 | 4 | 4 | 0 | 0.452 | ok (q=84, masque 0.89) |
| p_213 | Eric Von Haynes BLT20thAnniversary Mar | Public domain | noir grisonnant | coloration vive | 53 | 4 | 4 | 1 | 0.002 | ok (q=93, masque 0.87) |
| p_214 | Eric Von Haynes BLT20thAnniversary Mar | Public domain | noir grisonnant | fonce | 5 | 4 | 4 | 1 | 0.003 | ok (q=90, masque 0.79) |
| p_217 | -colognepride 2019 - DIE LINKE (482292 | CC BY-SA 2.0 | blond platine | tres clair, gris ou blanc | 76 | 1 | 2 | 0 | 0.581 | ok (q=94, masque 0.8) |
| p_220 | 2008 LAAFF 36 - 2840999917.jpg | CC BY-SA 2.0 | blond platine | tres clair, gris ou blanc | 71 | 1 | 2 | 0 | 0.659 | ok (q=79, masque 0.87) |
| p_223 | 2016-05-14 16-33-50 ILCE-6300 5590 DxO | CC BY-SA 2.0 | blond | tres clair, gris ou blanc | 55 | 2 | 2 | 0 | 0.351 | ok (q=70, masque 0.7) |
| p_224 | 2018-02-11 12-19-27 ILCE-6500 DSC05882 | CC BY-SA 2.0 | blond | coloration vive | 69 | 2 | 4 | 0 | - | ok (q=79, masque 0.88) |
| p_225 | 2018-02-11 12-30-33 ILCE-6500 DSC05945 | CC BY-SA 2.0 | blond | coloration vive | 74 | 2 | 3 | 0 | - | ok (q=88, masque 0.96) |
| p_232 | 2022 Visita oficial do núcleo Brasil d | CC BY 2.0 | chatain balayage | fonce | 13 | 2 | 2 | 0 | 0 | ok (q=100, masque 0.99) |
| p_235 | 2022-12-17 18-57-42 ILCE-7C DSC15794 K | CC BY-SA 2.0 | blond platine | tres clair, gris ou blanc | 63 | 1 | - | 0 | 0.455 | ok (q=79, masque 0.97) |
| p_238 | Bearded man with arm tattoo.jpg | CC BY-SA 2.0 | roux | tres clair | 60 | 2 | 4 | 0 | 0.024 | ok (q=82, masque 0.72) |
| p_243 | Catherine Tait at Republica 2024 01.jp | CC BY-SA 4.0 | roux | cuivre fonce | 31 | 2 | 1 | 0 | 0 | ok (q=94, masque 0.93) |
| p_244 | Celebrating Sanctuary 2012 - 18 (74884 | CC BY 2.0 | rouge (coloration vive) | cuivre fonce | 23 | 3 | 3 | 0 | 0 | ok (q=89, masque 0.83) |
| p_248 | Eelyn chan red 003.jpg | CC0 | rouge (coloration vive) | cuivre fonce | 41 | 2 | 1 | 0 | 0 | ok (q=96, masque 0.97) |
| p_251 | GulyakovaMD.jpg | CC BY-SA 4.0 | chatain clair | fonce | 7 | 2 | 4 | 0 | 0 | ok (q=98, masque 0.99) |
| p_253 | Justin Wigard Photograph 2020.jpg | CC BY-SA 4.0 | roux | tres clair | 67 | 1 | 4 | 0 | 0.16 | ok (q=75, masque 0.81) |
| p_260 | Premier Cartel de la Mega.jpg | CC BY-SA 4.0 | rouge (coloration vive) | tres clair | 67 | 2 | 2 | 0 | - | ok (q=74, masque 0.63) |
| p_268 | 260705 FC 서울 vs 인천 (Morgan Ferrier).jp | CC BY-SA 4.0 | noir | fonce | 4 | 4 | 2 | 0 | 0.061 | ok (q=77, masque 0.49) |
| p_269 | 60-DresstoKill (6839095301).jpg | CC BY-SA 2.0 | tresses multicolores (vert) | fonce | 5 | 4 | 4 | 0 | 0.166 | ok (q=79, masque 0.46) |
| p_276 | Allen Iverson Detroit Pistons (cropped | CC BY-SA 2.0 | noir | REFUSE | - | 4 | - | 0 | - | refuse : masque_trop_petit |
| p_278 | Allen Iverson headshot.jpg | CC BY-SA 2.0 | noir | fonce | 14 | 4 | 1 | 0 | 0.07 | ok (q=87, masque 0.59) |
| p_279 | Allen Iverson Smile.jpg | CC BY-SA 2.0 | noir | REFUSE | - | 4 | - | 0 | - | refuse : masque_trop_petit |
| p_280 | Allen Iverson, Denver Nuggets.jpg | CC BY 2.0 | noir | fonce | 3 | 4 | 2 | 0 | 0.131 | ok (q=91, masque 0.73) |
| p_281 | Allen Iverson.jpg | CC BY-SA 2.0 | noir | fonce | 20 | 4 | 4 | 0 | 0.003 | ok (q=75, masque 0.38) |
| p_284 | Ashenda Girl, Tigray, Ethiopia (153639 | CC BY-SA 2.0 | noir | tres clair | 76 | 4 | 4 | 0 | 0.236 | ok (q=62, masque 0.45) |
| p_285 | Ashenda Girl, Tigray, Ethiopia (153882 | CC BY-SA 2.0 | noir | tres clair, gris ou blanc | 79 | 4 | 3 | 0 | 0.427 | ok (q=86, masque 0.56) |
| p_315 | Cadets arrive at the United States Air | Public domain | brun | cuivre clair | 64 | 1 | 4 | 0 | - | ok (q=84, masque 0.63) |
| p_324 | Gerhard Medicus.jpg | CC BY-SA 4.0 | blanc | tres clair | 67 | 1 | 2 | 3 | 0.272 | ok (q=79, masque 0.38) |
| p_329 | Portrait AG HD.jpg | CC BY-SA 4.0 | gris blanc | REFUSE | - | 2 | - | 3 | - | refuse : qualite_insuffisante |
| p_330 | Richter-manfred-2019-1048.jpg | CC BY-SA 4.0 | blanc | moyen | 37 | 2 | 2 | 3 | 0.194 | ok (q=93, masque 0.83) |
| p_332 | Asha image.jpg | CC BY-SA 4.0 | noir | REFUSE | - | 1 | - | 0 | - | refuse : graine_indistincte_du_fond |
| p_336 | Janaina Aparecida de Lemos.jpg | CC BY-SA 4.0 | blond platine | tres clair, gris ou blanc | 78 | 1 | 2 | 0 | 0.419 | ok (q=77, masque 0.3) |
| p_356 | Megan Marie Hart - Theaterpreis 2019 J | CC BY-SA 4.0 | brun fonce | fonce | 7 | 2 | 2 | 0 | 0.01 | ok (q=76, masque 0.8) |
| p_357 | Megan Marie Hart - Theaterpreis 2019 J | CC BY-SA 4.0 | brun fonce | REFUSE | - | 2 | - | 0 | - | refuse : qualite_insuffisante |
| p_363 | Dewayne Washington Portrait (NHQ202301 | Public domain | gris | REFUSE | - | 4 | - | 2 | - | refuse : graine_indistincte_du_fond |
| p_373 | Dress (Klashorst)-cropped.jpg | CC BY 2.0 | noir | fonce | 4 | 4 | 1 | 0 | 0 | ok (q=85, masque 0.54) |
| p_376 | Beautiful Woman is Asian Looking.jpg | CC BY 2.0 | brun | fonce | 6 | 2 | 2 | 0 | 0.018 | ok (q=61, masque 0.42) |


---

## 9. Test de bout en bout de la routine : 16 profils vers 4 produits

Catalogue réel utilisé : `catalogue-cheveux/*.json` du 19/09/2026, **474 produits, 14
marques** (157 en étape 1, 107 en 2, 170 en 3, 40 en 4).

Règles vérifiées à chaque profil : jamais deux produits de la même étape, jamais deux fois
la même marque sauf assouplissement écrit noir sur blanc, jamais de contresens.
Résultat : **16 profils sur 16 complets, 0 doublon d'étape, 0 doublon de marque non
justifié.**

| profil | 1 lavage | 2 soin | 3 sans-rinçage | 4 traitement ciblé |
|---|---|---|---|---|
| **Secs et boucles** | Hydrating Shampoo<br>Moroccanoil | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Curl Cream<br>Verb | Curl Rituals<br>Rahua |
| **Gras aux racines, secs aux pointes** | Jumbo PEPTIDE PREP™ detox shampoo<br>K18 | Scalp Balancing Conditioner<br>Moroccanoil | Wave Spray<br>Ouai | RITUEL PURIFIANT<br>Leonor Greyl |
| **Colores et cassants** | Blonde Perfecting Purple Shampoo<br>Moroccanoil | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Nº.0 INTENSIVE BOND BUILDING TREATMENT<br>Olaplex |
| **Fins et plats** | Jumbo PEPTIDE PREP™ detox shampoo<br>K18 | Full Conditioner<br>Living Proof | VOLUMIZING BLOW DRY MIST<br>Olaplex | RITUEL ANTICHUTE<br>Leonor Greyl |
| **Pellicules** | Dandruff Shampoo<br>Verb | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Lotion Antipelliculaire Cuir Chevelu D<br>Head & Shoulders |
| **Chute saisonniere** | Color Security Shampoo<br>Color Wow | Le Masque Nutrition Avant-Shampooing<br>Nuxe | THE WEIGHTLESS VOLUME ROUTINE<br>Olaplex | RITUEL ANTICHUTE<br>Leonor Greyl |
| **Crepus tres secs** | Hydrating Shampoo<br>Moroccanoil | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Curl Cream<br>Verb | Curl Rituals<br>Rahua |
| **Cheveux blancs** | Money Laundering Hydrating Shampoo<br>Color Wow | Le Masque Nutrition Avant-Shampooing<br>Nuxe | Molding Cream<br>Moroccanoil | RITUEL PURIFIANT<br>Leonor Greyl |
| **Decolores blond platine** | Blonde Perfecting Purple Shampoo<br>Moroccanoil | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Nº.0 INTENSIVE BOND BUILDING TREATMENT<br>Olaplex |
| **Raides gras lave tous les jours** | Jumbo PEPTIDE PREP™ detox shampoo<br>K18 | Scalp Balancing Conditioner<br>Moroccanoil | Extra Mist-ical Shine Spray<br>Color Wow | RITUEL PURIFIANT<br>Leonor Greyl |
| **Ondules colores ternes** | Blonde Perfecting Purple Shampoo<br>Moroccanoil | MASQUE QUINTESSENCE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Scalp Care Dry Scalp Treatment<br>Living Proof |
| **Cuir chevelu sensible + pellicules seches** | Dandruff Shampoo<br>Verb | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Lotion Antipelliculaire Cuir Chevelu D<br>Head & Shoulders |
| **Boucles definies gras racines** | Jumbo PEPTIDE PREP™ detox shampoo<br>K18 | Nº.5CURL BOND SHAPER™ HYDRATING CURL C<br>Olaplex | Curl Control Mousse<br>Moroccanoil | RITUEL PURIFIANT<br>Leonor Greyl |
| **Defrises abimes** | Thick Hair Shampoo - Jumbo<br>Ouai | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Soin Capillaire Nutrition Intense<br>Nuxe | Nº.0 INTENSIVE BOND BUILDING TREATMENT<br>Olaplex |
| **Homme court, chute debutante** | Jumbo PEPTIDE PREP™ detox shampoo<br>K18 | Le Masque Nutrition Avant-Shampooing<br>Nuxe | THE WEIGHTLESS VOLUME ROUTINE<br>Olaplex | RITUEL ANTICHUTE<br>Leonor Greyl |
| **Aucune reponse au questionnaire (mesure seule)** | Hydrating Shampoo<br>Moroccanoil | MASQUE À L’ORCHIDÉE<br>Leonor Greyl | Curl Cream<br>Verb | Scalp Care Dry Scalp Treatment<br>Living Proof |

### 9.1 Erreurs trouvées à la main dans ce test, et corrigées

Le premier passage sortait des routines absurdes. Chaque erreur a été retrouvée en lisant
les 16 routines une par une, puis corrigée dans le moteur :

1. **Shampooing antipelliculaire proposé à une chevelure sèche sans pellicules.**
   Cause : tous les shampooings hors sujet marquaient 0, et l'ordre du catalogue
   décidait. Correction : note de base non nulle, plus une pénalité explicite de −3,5
   quand un traitement antipelliculaire est proposé sans pellicules déclarées. Même
   pénalité pour un anti-chute sans chute.
2. **Masque riche proposé à des cheveux fins et plats.** Correction : pénalité sur les
   produits nourrissants aux étapes 2 et 3 quand le profil est « plats ou fins ».
3. **Crème boucles proposée à des cheveux mesurés raides.** Correction : pénalité quand
   l'indice de boucle est bas.
4. **La règle « jamais deux fois la même marque » imposait un produit hors sujet.**
   Sur un profil sec et bouclé, elle éliminait le seul shampooing nourrissant et
   proposait un shampooing volume. Correction : la marque peut être répétée si le
   meilleur produit d'une autre marque vaut moins de la moitié du meilleur produit tout
   court, et l'assouplissement est écrit dans `assouplissements`.
5. **Zinc classé comme antipelliculaire.** Le zinc PCA est séborégulateur ; il déclenchait
   de fausses réserves sur les shampooings purifiants. Retiré de la liste, seul
   « pyrithione de zinc » reste.
6. **Un produit visant plusieurs natures était puni pour celles qui ne correspondent
   pas.** Un masque « secs + bouclés + crépus » était pénalisé sur des cheveux raides
   alors qu'il vise juste sur « secs ». Correction : la pénalité tombe à 35 % dès qu'une
   cible correspond.
7. **Produit purifiant accepté en étape 4 sur des cheveux secs.** La pénalité
   n'existait qu'aux étapes 1 et 2 ; elle s'applique maintenant à toutes les étapes.

### 9.2 Défauts trouvés dans le catalogue capillaire (à transmettre)

Le moteur écarte **72 produits sur 474** avant de composer, et dit pourquoi
(`resultat.produitsEcartes` et `exemplesEcartes`) :

| Motif | Nombre | Exemples |
|---|---|---|
| Coffret ou lot multi-produits | 39 | « Best Anti-Frizz Curl Styling Set », « The Travel Essentials Set » |
| Nom à l'encodage cassé (mojibake) | 18 | « AprÃ¨s-Shampooing RÃ©parateur DERMA XPRO » |
| Produit qui n'est pas un soin capillaire | 13 | « Honey Infused Hair Perfume », un baume lèvres Nuxe rangé en après-shampooing |
| Entrée promotionnelle | 2 | un nom commençant par un pictogramme, « Recharge Gift » |

Deux défauts de **classement** ont aussi dû être compensés côté moteur :
« Le Masque Nutrition Avant-Shampooing » (Nuxe) est rangé en catégorie `shampooing` et
sortait donc comme produit de lavage ; plusieurs après-shampooings portent `etape: 1`.
Le moteur fait désormais primer la **catégorie** sur le champ `etape`, et le **nom** sur la
catégorie quand les deux se contredisent franchement (« masque » ou « après-shampooing »
dans le nom contre catégorie `shampooing`).

Ces quatre points sont à corriger dans le catalogue, pas dans le moteur.

### 9.3 Ce qui reste discutable dans les routines

- Étape 3 pour un profil très gras : « Extra Mist-ical Shine Spray » est un spray de
  brillance, pas un soin. La pénalité ne couvre aujourd'hui que laque, gel, cire et
  pommade.
- Étape 2 pour « gras aux racines, secs aux pointes » : le masque reconstructeur est
  retenu **avec une réserve écrite** (« soin très riche alors que les racines sont
  grasses »). C'est voulu : la réserve est visible dans `reserves`, pas cachée.
- Le catalogue ne contient qu'un seul traitement chute et sept antipelliculaires : les
  profils correspondants tombent presque toujours sur le même produit.

---

## 9.4 Passage à trois questions (19/09/2026) — effet mesuré sur les routines

Le questionnaire passe de cinq à trois questions : **nature ressentie**, **gêne
principale**, **naturels ou colorés**. La fréquence de lavage et l'âge ne sont plus
demandés.

Règle appliquée dans le moteur : **aucune valeur par défaut ne remplace une réponse
absente.** Chaque score ne retient que les signaux réellement présents dans les réponses et
garde le plus fort ; s'il n'y en a aucun, le score vaut `null` avec ses deux causes
(`pourquoiNull` : ce qu'a donné la mesure, et le fait que le questionnaire n'informe pas ce
point). Trois valeurs inventées ont été supprimées au passage :

| Valeur inventée avant | Ce qu'elle affirmait à tort | Maintenant |
|---|---|---|
| sécheresse = 0,45 dès qu'une réponse existait | « moyennement sec » sans que rien ne le dise | `null` si ni la gêne ni l'état n'informent |
| casse = 0,35 dans le même cas | idem | `null` |
| pellicules = 10 et chute = 10 quand ce n'était pas la gêne principale | « cette personne n'a pas de pellicules » — jamais constaté | `null`, raison `non_declaree_comme_gene_principale` |

### Comparaison avant / après sur les 16 mêmes profils

Chemin réel testé : `mesures` → `composerScores` → `composerRoutine`, catalogue réel de
474 produits.

| | avant (5 réponses) | après (3 réponses) |
|---|---|---|
| Routines complètes (4 produits) | 16 / 16 | **16 / 16** |
| Doublons d'étape | 0 | **0** |
| Routines strictement identiques | — | **15 / 16** |
| Scores lisibles en moins | — | `racinesGrasses` sur 13 profils, `blancs` sur 15 profils |

**La qualité des routines ne baisse pas.** Un seul profil change, « Homme court, chute
débutante » :

| étape | avant (savait qu'il lave tous les jours) | après (ne le sait plus) |
|---|---|---|
| 1 lavage | Jumbo PEPTIDE PREP detox shampoo (K18) | Color Security Shampoo (Color Wow) |
| 2 soin | Full Conditioner (Living Proof) | Full Conditioner (Living Proof) |
| 3 sans-rinçage | VOLUMIZING BLOW DRY MIST (Olaplex) | Wave Spray (Ouai) |
| 4 traitement | RITUEL ANTICHUTE (Leonor Greyl) | RITUEL ANTICHUTE (Leonor Greyl) |

Le shampooing détoxifiant n'était justifié que par « il lave tous les jours ». Cette
information n'existe plus, donc la justification disparaît avec elle : c'est le
comportement attendu, pas une régression. Le traitement ciblé, qui est le produit qui
compte pour ce profil, est identique.

Pour les trois profils dont la gêne principale EST « gras vite », rien ne change : le score
racines grasses passe simplement de 85 (déduit du lavage quotidien) à 80 (déduit de la gêne
déclarée), et les quatre produits sont les mêmes.

### Ce que l'on ne sait plus, et qu'il faut assumer à l'écran

- **Racines grasses** : lisible uniquement si « gras vite » est la gêne choisie. Pour tous
  les autres, le score est `null`. La mesure photo existe mais n'est pas validée (§ 5.6),
  elle ne peut donc pas compenser.
- **Cheveux blancs** : plus aucune source. La mesure n'est pas validée (§ 5.3) et l'âge
  n'est plus demandé : le score est `null` pour tout le monde. Il ne faut pas l'afficher.
- **Pellicules et chute** : lisibles seulement si c'est la gêne choisie. Ne pas l'avoir
  choisie ne veut pas dire qu'on ne l'a pas — le moteur ne se prononce plus.

Sans aucune réponse du tout (questionnaire sauté), le moteur reste utilisable : un seul
score lisible, la boucle, et une routine complète construite sur les cibles produit.

### Faiblesse résiduelle constatée

Pour « Homme court, chute débutante », l'étape 1 retenue est un shampooing de protection de
la couleur sur des cheveux naturels (note 2,44, retenu pour « cible fins » et « cible
chute »). Ce n'est pas un contresens mais ce n'est pas idéal : le catalogue ne contient
aucun shampooing visant à la fois cheveux fins et chute. À corriger côté catalogue, pas
côté moteur.

---

## 10. Ce qu'il faut faire ensuite, dans l'ordre

1. **Interdire le scan tête couverte** côté écran, et redire dans le parcours que bonnet,
   casquette, foulard et perruque faussent tout. C'est le trou le plus grave et il ne se
   corrige pas dans le moteur.
2. **Refaire la validation sur de vrais selfies de scan** (20 à 30 personnes, fond uni,
   lumière de face, tête entière dans le cadre, deux prises chacune). Les chiffres du § 5
   sont un plancher obtenu sur des photos de presse ; le vrai cas d'usage est plus facile,
   et c'est là qu'il faut décider si la brillance et le frizz redeviennent affichables.
3. **Ne rien afficher aujourd'hui en dehors de** : la nature de la boucle, la couleur en
   L\*a\*b\* avec sa classe grossière, la qualité de prise, et les scores déclarés issus des
   trois questions. Ne pas afficher « cheveux blancs » : depuis le passage à trois
   questions, plus aucune source ne l'alimente. Le reste est dans `mesures` pour l'audit, pas pour l'écran.
4. Si la brillance et le frizz sont nécessaires commercialement, il faut **une capture
   guidée** (distance imposée, lumière de face, fond uni) ou une charte de gris dans le
   champ. Sans ça, ils resteront non validés.
5. Corriger les quatre défauts de catalogue du § 9.2.

---

## 11. Journal des défauts trouvés et corrigés dans le moteur

Tous ont été trouvés **en mesurant**, pas en relisant le code.

| # | Défaut | Comment il a été trouvé | Correction |
|---|---|---|---|
| 1 | Le test de peau générique YCbCr classait les cheveux châtains comme de la peau et les excluait du masque | image synthétique RGB(70,48,35) : Cb=118, Cr=140, en plein dans la boîte peau, graine entièrement rejetée | peau apprise sur les joues **de la personne**, distance CIE Lab |
| 2 | La référence de peau débordait sur tout : visage, vêtements, fond | rendu du masque en image, la peau apprise couvrait l'image entière | dispersion robuste (médiane des distances × 2,2, bornée à 14) au lieu du percentile 90 |
| 3 | La croissance de région fuyait dans le fond (jusqu'à 57 % de l'image) | couverture et confiance du masque mesurées sur 400 images | classification au **plus proche modèle** parmi cheveu, peau et jusqu'à 3 couleurs de fond apprises sur le bord de l'image |
| 4 | Le modèle chevelure était un point : seuls les pixels sombres restaient, tout le monde sortait « noir » | distribution de L\* par famille annotée | clarté modélisée par un **intervalle** (coût nul à l'intérieur, plein tarif à l'extérieur) |
| 5 | Une chemise blanche entrait dans le masque d'une chevelure foncée, couleur « blond » | rendu du masque (cas p_147) | poids 1 au lieu de 0,35 pour l'écart de clarté hors intervalle |
| 6 | La graine tombait parfois sur le fond : modèle chevelure = le mur, masque jugé « pur » à 96 %, chevelure noire à L\*=85 | rendu du masque + pureté | graine filtrée par le modèle de fond ; refus `graine_indistincte_du_fond` (43 images) |
| 7 | La couleur de corps prise à la médiane puis au percentile 75 suivait tout pixel clair resté dans le masque | L\* médian « noir » = 54 | **mode** de l'histogramme de L\* |
| 8 | Détection de raie sur 98 chevelures sur 107 : générateur de faux positifs | taux de détection invraisemblable | teinte peau exigée, 8 lignes contiguës, contraste L\* > 6 → 10 % de détection |
| 9 | Part de cheveux blancs sur seuil de chroma relatif : la moitié d'une tête brune comptait comme blanche | Spearman 0,02 | critère absolu L\* > 58 et C\* < 12 → 0,15 (toujours insuffisant, mesure retirée de l'affichage) |
| 10 | Brillance en écart relatif non borné : explosait sur cheveux noirs (jusqu'à 15,6) | distribution sur 107 chevelures | contraste de Michelson borné, puis part spéculaire dominante — **toujours non validé** |
| 11 | Le frizz refusait 67 chevelures sur 107 pour « fond texturé » | taux de null | densité du fond **soustraite** au lieu de refuser ; refus seulement au-delà de 90 % |
| 12 | Aucun contrôle de cadrage : une tête de 5 % de la largeur passait le scan | photos de sport avec tête minuscule acceptées | cadrage ajouté à la qualité, refus sous 6 % de la largeur |
| 13 | Images en noir et blanc mesurées en couleur | photos anciennes dans le jeu de test | chroma médiane de l'image < 2 → couleur refusée |
| 14 | Dilatation itérative en r passes : plusieurs dizaines de secondes par image au-delà de 500 px | le banc bloquait sur une image | transformée de distance chamfer, coût indépendant du rayon |
| 15 | Contexte de mesure : 7 tris de 40 000 valeurs et une copie de toute l'image | profilage, 800 ms perdues | tableaux typés, un seul tri, carte de peau précalculée |
| 16 | Aucun refus quand le masque était visiblement faux | confiance 0,08 et scan publié quand même | pureté du masque mesurée, refus sous 0,30 de confiance |
| 17 | Crâne rasé accepté | cas extrêmes | hauteur de chevelure au-dessus du front exigée (≥ 10 % de la hauteur du visage) — attrape 6 cas sur 8 |

---

## 12. Comment la validation a été faite, pour qu'elle soit refaisable

- Images : API Wikimedia Commons, catégories et recherches listées dans le script de
  collecte, licence de chaque fichier enregistrée.
- Repères de visage : face-api.js dans le navigateur au premier passage, puis **OpenCV
  YuNet** hors navigateur quand la machine est devenue trop chargée. Les deux détecteurs
  ont été comparés sur les 133 images où les deux réussissaient : rapport de largeur
  médian 0,91, 95 % à moins de 30 % d'écart. Les boîtes YuNet sont élargies de 10 % pour
  rester dans la convention de la chaîne de production.
- Décodage des images hors navigateur : ffmpeg vers RGBA brut, puis `analyseFrame` du
  moteur — **le même code que dans le navigateur**, aucune variante d'évaluation.
- Annotation : chaque image regardée en vignette 300 px, notée sur couleur, type 1 à 4,
  cheveux blancs (0 à 3), frizz (0 à 3), brillance (0 à 3), coiffure attachée, utilisable
  ou non avec la raison.
- Accord : correspondance exacte et à 1 près pour le type, classes pour la couleur,
  corrélation de rang de Spearman pour les échelles ordinales.

Un point d'honnêteté sur la méthode : **les seuils du type de boucle et des classes de
couleur ont été calés sur ce jeu de 60+ chevelures**, puis évalués sur ce même jeu. Les
75 % et les 70 % annoncés sont donc des chiffres **dans l'échantillon**, et donc
optimistes. Un jeu de test indépendant les ferait baisser.
