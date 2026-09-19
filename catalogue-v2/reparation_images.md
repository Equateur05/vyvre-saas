# Réparation des images produits mal détourées

Point de départ : `detourage_journal.json`, 841 images en statut **douteux** sur 6 115
(817 d'entre elles portaient 818 produits du catalogue en ligne, aucune n'avait de `cutout_url`).
Jamais Sothys : aucun fichier `*sothys*` n'a été lu ni écrit.

Résultat : **841 → 770 douteux**.

| | images |
|---|---|
| réparées (redétourées proprement après remplacement) | 71 |
| remplacées par une photo officielle (dont 1 restée en plaque) | 72 |
| laissées en plaque (`image_fond: true`) | 770 |
| candidats téléchargés puis **refusés** et originaux rendus | 291 |

Côté catalogue : 5 857 produits sur 5 883 ont maintenant un `cutout_url`
(les 26 restants n'ont pas d'`image_url` du tout, défaut antérieur),
et **747 produits** portent `image_fond: true`.

---

## 1. Classement des 841 cas (planches de contrôle regardées une à une)

| famille | images | ce qu'on voit |
|---|---|---|
| packshot sur fond blanc | 690 | le fond est bon, c'est le détourage IA qui mange ou coupe le produit (flacons transparents, blancs cassés, verre) ; beaucoup ont un badge ou un cartouche en coin (TIRTIR « Vegan », Caudalie « Beauty Tested », Barbara Sturm, Bubble, Byoma, Cellcosmet, Manyo, skin1004) qui fait déborder la boîte de recadrage |
| photo d'ambiance avec décor | 117 | eau, sable, fleurs, pierre, fond dégradé (Valmont, Clarins, Lancaster, Thalgo, Medicube, La Roche-Posay, Olay) |
| fond uni coloré | 34 | pêche, rose, vert : le modèle croit que tout l'écran est le produit |

Quatre pathologies « photo sans produit » sont ressorties du lot :

- **SENSAI, 53 images strictement identiques** : une carte au logo SENSAI. Le site ne renvoie
  aucune image produit dans le HTML serveur ; son `og:image` **est** cette carte logo, c'est
  donc elle que le moissonnage d'origine a prise.
- **Bioderma, 29 images identiques** (36 douteuses au total) : la même photo de mannequin
  qui se met de la crème sur le front.
- **Dior, 14 images** : la carte blanche au mot DIOR.
- Divers : swatches de texture sans flacon (Darphin, Barbara Sturm, Bioderma), 4 bandeaux
  ultra-larges Drunk Elephant, 3 vignettes « No image » (Garnier), 1 logo Valmont.

## 2. Remplacements retenus — 72 images, 16 marques

Méthode : page officielle du produit → JSON-LD, `og:image`, galerie et `srcset` →
choix du meilleur candidat (nom de fichier contenant le produit, fond blanc, taille) →
téléchargement, carré 600 px sur fond blanc, redétourage, **contrôle à l'œil sur planche**.
Une image n'est gardée que si le redétourage passe en `ok`, ou si elle remplace une photo
de décor par un packshot sur fond neutre.

| marque | images | avant → après |
|---|---|---|
| bioderma | 36 | photo de mannequin → packshot officiel `back-ac-prod.bioderma.com` (36/36 vérifiés un par un, produits concordants) |
| valmont | 10 | fonds mauves, éclaboussures d'eau → flacons sur fond blanc |
| sensilis | 4 | fonds colorés → packshots |
| nivea, liz-earle, klorane | 3 chacune | décor floral / fond coloré → packshot |
| tatcha, skin1004, lancaster | 2 chacune | idem |
| clarins, eucerin, isdin, la-rosee, loccitane, manyo, medicube | 1 chacune | décor ou badge → packshot (medicube : version sans la pastille BYRDIE) |

Cas particuliers assumés : le packshot officiel de **Bioderma Créaline H2O** porte le
médaillon « ELLE Beauty Awards 2026 », celui de **skin1004 Centella Light Cleansing Oil**
un macaron « Cleanser No.1 » — ce sont les visuels officiels, on les garde tels quels.

## 3. Remplacements refusés — 291 images rendues à l'original

- **280** : la photo trouvée sur le site officiel est **la même** que celle déjà en base
  (le moissonnage initial avait déjà pris la meilleure), le redétourage restait douteux.
- **11 rendues après contrôle visuel**, parce que le candidat n'était pas le bon produit :
  - **mixa** (7) : « gelée démaquillante », « lait démaquillant », « crème visage bio »
    renvoyaient vers un sérum Mixa ou une crème Cica Réparation ;
  - **trinny-london** (2) : un élixir remplacé par un stick rouge ;
  - **round-lab** (1) : remplacé par une infographie « Blackheads cleansing effect » ;
  - **sulwhasoo** (1) : sérum blanc remplacé par un flacon ambré.
  - (et **valmont/time-master-xl**, coffret d'ampoules douteux, rendu lui aussi.)

## 4. Laissées en plaque — 770 images, 92 marques

`"image_fond": true` a été posé sur les produits dont le détourage reste douteux, et
`cutout_url` pointe désormais vers la sortie « fond blanc nettoyé » de `detourage.py`
(carré 600 px, blancs cassés ramenés à 255, produit recadré et centré) : c'est une plaque
claire propre, bien meilleure que la photo brute non recadrée qui s'affichait avant.

Les dix plus gros volumes : sensai 53, comfort-zone 43, medicube 36, omorovicza 36,
dior 35, darphin 31, medik8 27, lierac 25, torriden 25, caudalie 23.

## 5. Marques à problème (aucune protection contournée)

**Refus 403 dès la page produit** (pare-feu anti-robot ; rien tenté pour le contourner) :
dior 35, darphin 31, barbara-sturm 17, clinique 17, la-mer 14, fresh 12, kiehls 12,
lancome 10, origins 8, bubble-skincare 6, chanel 4, bobbi-brown 2, yves-rocher 1.

**Refus 429 « Too Many Requests » persistant**, y compris en repassant à 1 requête toutes
les 4 secondes (0 page récupérée sur 59) : olay 8, klairs 7, elizabeth-arden 6, skin1004 5,
murad 5, payot 5, melvita 3, glossier 3, nuxe 3, absolution 2, byoma 2, cattier 2, sk-ii 2,
la-prairie 1, orveda 1, pixi 1, respire 1, svr 1, the-inkey-list 1.

**SENSAI (53) — cas à part** : le site répond 200 mais ne sert aucune image produit dans le
HTML ; la galerie est montée en JavaScript et la page ouverte dans un navigateur réel
retombe sur un 404 régional. Les 53 produits restent donc sur la carte au logo SENSAI.
**C'est le seul lot où la plaque n'affiche toujours aucun produit** — à reprendre quand une
source d'images SENSAI exploitable sera disponible.

**Dior (35)** : même situation de fond, aggravée par le 403 ; 14 des 35 sont la carte au mot
DIOR, sans produit.

Autres refus isolés : medik8 (2 URL non encodables en ASCII), medicube (1 page en HTTP 500).

## 6. Politesse réseau et disque

- 1 requête par seconde et par domaine, plusieurs domaines en parallèle, en-têtes Chrome
  complets (`User-Agent`, `Accept-Language`, `Sec-Ch-Ua`, `Sec-Fetch-*`, `Referer`).
  Aucun CAPTCHA, aucun contournement de pare-feu : un refus est consigné tel quel.
- **Piège disque rencontré** : `detourage.py` tourne sous `CoreMLExecutionProvider`, et
  onnxruntime recopie le modèle (≈ 76 Mo) dans `/private/var/folders/.../T/onnxruntime-*`
  à chaque session sans jamais la supprimer — 907 copies, 3,8 Go, disque tombé à 439 Mo.
  Les copies ont été purgées et la fin du chantier s'est faite en forçant
  `CPUExecutionProvider` (aucune copie temporaire, ~0,5 s/image en 4 processus).
  **À prévoir dans `detourage.py`** : nettoyer ces dossiers en fin de run.

## 7. Fichiers touchés

- `public/scan/products/<marque>/v2/*.jpg` : 72 images remplacées.
- `public/scan/products/<marque>/v2/cutout/*.webp` : régénérés par `detourage.py`.
- `catalogue-v2/detourage_journal.json` : mis à jour par `detourage.py`.
- `public/scan/catalogue/*.json` et `catalogue-v2/sortie/*.json` : seuls les champs
  `cutout_url` et `image_fond` ont été écrits (vérifié par diff champ par champ sur les
  5 883 produits : 818 `cutout_url`, 747 `image_fond`, aucun autre champ modifié).
  Les deux arborescences sont identiques (même md5).

Rien n'a été commité ni déployé. `public/cheveux/`, `catalogue-cheveux/`,
`public/scan/vyvre-hair-engine.js` et `public/scan/vy-i18n.js` n'ont pas été touchés.
