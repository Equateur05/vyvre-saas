# Revue UI : « Votre assiette » (vyvre.fr, scan de peau)

Revue du 30/09/2026, lecture seule. Code : `public/scan/aliment/vy-aliment.js` (584 lignes), propositions : `public/propals/assiette/index.html` et `scan.html`.
Méthode : Chrome headless piloté par CDP (`_revue/revue.mjs`, port 9361, fausse caméra `droit.y4m`), parcours complet (scan, résultats, « Quelque chose à éviter ? », roue, assiette) capturé en 390×844 (x2) et 1440×900, plus mesures dans la page (tailles des zones tactiles, polices calculées, contrastes WCAG recalculés).
Profil obtenu : Éclat 47/100 puis Hydratation 52/100, « Rien de particulier » ; assiette = Tomate, Melon charentais, Abricot sec, Graines de lin.

---

## 1. Verdict (10 lignes)

1. Note actuelle : 5,5/10. Le fond (sources, prudence, pas de fausse promesse) est d'un niveau rare ; la forme ne suit pas encore.
2. Deux défauts bloquants avant lancement : sur ordinateur (≥ 1100 px) la carte d'entrée « Assiette. » est éclatée, illisible (texte vert foncé sur noir, bouton de 77 px de large), et la feuille plein écran n'a pas de voile : les résultats restent en pleine lumière de chaque côté.
3. Troisième bloquant : les choix (allergies, grossesse…) sont des `<span>` cliquables ; au clavier et avec un lecteur d'écran, on ne peut pas franchir la question santé.
4. Le moment fort (la roue qui s'arrête sur quatre aliments) est jeté : coupe sèche, puis un écran « Quatre aliments. » qui ne montre aucun aliment avant 675 px de défilement.
5. La roue dure environ 11,7 s d'après le code ; sur téléphone le journal grandit et pousse « Passer » hors de l'écran.
6. L'écran « une seule question » contient en réalité une deuxième question, un compteur, un consentement de 5 lignes, deux liens de sortie et un avertissement ; après « Rien de particulier », le bouton qui valide est sous la ligne de flottaison.
7. Typographie hors marque : Helvetica Neue, Georgia et IBM Plex Mono (non chargées), alors que vyvre est en Inter, JetBrains Mono et serif Instrument ou Playfair ; les boutons tombent même en Arial (mesuré).
8. La page de l'assiette fait 10 224 px sur téléphone : sept titres de 52 px à égalité, des paragraphes entiers en capitales de 10 px, 35 zones tactiles sous 44 px, et des notes internes de recherche visibles dans le Combo (« peau de porc », « les signaler comme formes faibles »).
9. Ce qui fait premium aujourd'hui : les grands titres italiques, la mise en page numérotée 01–04, la citation d'allégation, le bloc Combo sombre. Ce qui fait bon marché : le reste de la liste ci-dessous.
10. Avec les points 1 à 12 corrigés (environ deux jours de travail), la fonction passe à 8/10 et peut sortir.

---

## 2. Les 25 problèmes, du plus grave au moins grave

Chaque correctif est écrit pour être appliqué tel quel. Les numéros de ligne renvoient à `vy-aliment.js`.

### 1. Ordinateur : la carte d'entrée est éclatée (BLOQUANT)
Constat : à 1440 px, la règle de la page `.vyvre-v6 .v6grid>*{display:contents}` (index.html l. 2263) supprime la boîte de `#vy-as-entree` : plus de fond blanc, le libellé, le titre, le texte et le bouton deviennent quatre cellules de 77 px dans une grille de 12 colonnes. Le texte `#183b3e` se retrouve sur fond noir (illisible), le bouton mesure 77 × 271 px.
Correctif (l. 167, dans la chaîne CSS) :
```css
#vy-as-entree{display:block!important;grid-column:1/-1;...}
@media(min-width:1100px){#vy-as-entree{max-width:760px;justify-self:center;width:100%;margin:28px auto 0}}
```
Le sélecteur par identifiant l'emporte sur `.vyvre-v6 .v6grid>*`.

### 2. Ordinateur : la feuille n'a ni voile ni cadre (BLOQUANT)
Constat : `#vy-as` n'a pas de fond ; seule la colonne `.ec` de 560 px est claire. Les résultats du scan restent visibles, en pleine lumière, à gauche et à droite : on croit à un bug d'affichage.
Correctif (l. 173 et 175) :
```css
#vy-as{background:rgba(3,4,5,.78);-webkit-backdrop-filter:blur(24px) saturate(.7);backdrop-filter:blur(24px) saturate(.7)}
@media(min-width:700px){
  #vy-as .ec{margin:32px auto;min-height:calc(100% - 64px);border-radius:28px;box-shadow:0 60px 140px -40px rgba(0,0,0,.9)}
}
```

### 3. Clavier et lecteur d'écran : la question santé est infranchissable (BLOQUANT, WCAG 2.1.1, 4.1.2)
Constat : `.puce` est un `<span>` avec un écouteur de clic (l. 299, 313, 381, 509, 539) : pas de focus, pas de rôle, pas d'état. Un utilisateur clavier ne peut pas cocher « Une allergie ». La feuille ne reçoit pas le focus à l'ouverture et ne le rend pas à la fermeture.
Correctif :
- Toutes les puces : `<button type="button" class="puce" aria-pressed="true|false">` ; dans `maj()`, `z.setAttribute('aria-pressed', on)`.
- CSS : `#vy-as button{font:inherit;color:inherit;background:none}` puis `#vy-as .puce.on{background:#173d3f;color:#fff}` ; `#vy-as :focus-visible{outline:2px solid #173d3f;outline-offset:3px}` (sur le bloc Combo : `outline-color:#e3eee7`).
- `feuille()` : `ouvert.setAttribute('aria-modal','true')`, puis après chaque rendu `ouvert.querySelector('h1,h2').setAttribute('tabindex','-1'); ...focus({preventScroll:true})`. Mémoriser `document.activeElement` à l'ouverture et le refocaliser dans `fermer()`. Piéger Tab entre le premier et le dernier élément focalisable.
- La roue : `aria-hidden="true"` sur `.roue` et `.fond-tri`, et `aria-live="polite"` sur `#vy-as-ct`, pour que VoiceOver annonce « Tomate, 1 sur 4 ».

### 4. Le moment fort est jeté : aucun aliment visible en haut de l'assiette
Constat : la roue remplit quatre cases, puis coupe sèche vers un écran dont le haut dit « Quatre aliments. » + 11 lignes d'explication. Les quatre noms n'apparaissent qu'à 675 px, dans un `.ruban` en capitales de 9,5 px qui ressemble à des onglets mais ne réagit pas au toucher (l. 451).
Correctif :
- Supprimer le ruban. Sous le titre, une grille 2 × 2 de tuiles (même élément que `.cases4`, pour la continuité) :
```css
#vy-as .tuiles{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0 8px}
#vy-as .tuile{aspect-ratio:1/1;border-radius:22px;background:#fff;box-shadow:0 20px 44px -28px rgba(0,0,0,.35);padding:14px;display:flex;flex-direction:column;justify-content:space-between}
#vy-as .tuile img,#vy-as .tuile .disque{width:56px;height:56px;border-radius:50%;object-fit:contain}
#vy-as .tuile b{font:italic 400 15px/1 'Instrument Serif',Georgia,serif;opacity:.6}
#vy-as .tuile h3{font-size:17px;font-weight:500;letter-spacing:-.2px;margin:0}
#vy-as .tuile small{font-size:13px;color:#52716f}
```
Chaque tuile est un `<a href="#al-01">` qui fait défiler vers la fiche.
- Titre : « Votre assiette. » (56 px), sous-titre 15 px : « Pour l'éclat et l'hydratation, d'après votre lecture de ce jour. »
- Le paragraphe « Pourquoi cette sélection » descend sous les tuiles, réduit à deux lignes, avec un lien « Comment nous avons choisi » qui déplie le reste.
- Transition roue vers assiette : au lieu de `innerHTML`, garder `.cases4` et l'animer vers la grille 2 × 2 (technique FLIP : mesurer, changer la mise en page, `transform` inverse puis retour en 480 ms `cubic-bezier(.2,.9,.2,1)`), le reste apparaît en fondu 300 ms décalé de 120 ms.

### 5. La roue est trop longue et « Passer » disparaît
Constat : durée d'après le code : 200 + 7 × 330 (journal) + 4 × (1 500 + 650) + 900 ≈ 11,7 s, sans aucune indication d'avancement. En 390 × 844, à 9 s, le journal fait 12 lignes et pousse « Passer » sous le bord de l'écran (capture `m_12_roue9000`).
Correctif (tout reste réel, seulement plus court, ≈ 5,5 s) :
- l. 422 et 433 : pas de 330 → 220 ms ; ne garder que 4 lignes de journal (base, écartés, lecture, candidats).
- l. 425 : `dur = 900` ; l. 432 : `setTimeout(..., 260)` ; l. 423 : `900` → `500`.
- Journal : `#vy-as .journal{height:88px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;-webkit-mask-image:linear-gradient(transparent,#000 40%);mask-image:linear-gradient(transparent,#000 40%)}` : il n'agrandit plus la page.
- « Passer » sort du flux : un lien texte dans l'en-tête à côté de « Fermer » (`font-size:15px;min-height:44px;padding:0 12px`), ou `position:sticky;bottom:calc(16px + env(safe-area-inset-bottom))`.
- Indicateur : les quatre cases servent de barre de progression ; ajouter sous le titre « 1 sur 4 », « 2 sur 4 »…

### 6. « Une seule question » : l'écran en fait trop et le bouton qui valide est caché
Constat (390 × 844) : le titre de 76 px occupe 450 px sur trois lignes ; après les 5 choix viennent « Rien de particulier », une deuxième question « Et plutôt ? », une phrase de synthèse, un compteur en capitales, 5 lignes de consentement, le bouton « Accepter » (à 1 320 px, hors écran), deux liens et un avertissement. Toucher « Rien de particulier » ne change rien de visible hors du bouton : on ne sait pas qu'il faut défiler.
Correctif :
- Titre de cet écran à 48 px (`#vy-as .ec h1.q1{font-size:48px;letter-spacing:-.035em}`) : deux lignes au lieu de trois.
- Supprimer « Et plutôt ? » (l. 302) : les mêmes filtres existent déjà dans « Affiner » sur l'assiette.
- Consentement en une ligne au-dessus du bouton : « Vos réponses restent sur cet appareil et s'effacent à la fermeture. » + lien « Détails » qui déplie le texte actuel.
- Barre de validation collée en bas :
```css
#vy-as .barre{position:sticky;bottom:0;margin:24px -24px 0;padding:14px 24px calc(14px + env(safe-area-inset-bottom));background:linear-gradient(rgba(239,240,243,0),#eff0f3 28%)}
```
Elle contient la phrase de synthèse (15 px, italique) et le bouton. Le bouton reste actif ; s'il manque une réponse, il fait défiler vers le groupe incomplet et l'encadre (`box-shadow:0 0 0 2px #8a4b1c`) au lieu d'être grisé à 45 %.

### 7. Les réponses santé : deux composants différents pour le même geste
Constat : les 5 cas sont des pilules à deux lignes de largeurs inégales (rangées 2-2-1 en dents de scie), « Rien de particulier » est un autre objet (rayon 22 px, police Arial car `<button>` n'hérite pas), placé en dernier alors que c'est la réponse de la majorité.
Correctif : une liste verticale façon Réglages iOS, « Rien de particulier » en premier, séparé par 16 px :
```css
#vy-as .choix{display:flex;flex-direction:column;gap:8px}
#vy-as .choix button{display:flex;justify-content:space-between;align-items:center;min-height:60px;padding:12px 18px;border-radius:18px;border:1px solid rgba(24,59,62,.28);text-align:left}
#vy-as .choix button small{display:block;font-size:13px;color:#52716f;margin-top:2px}
#vy-as .choix button[aria-pressed=true]{background:#173d3f;color:#fff;border-color:#173d3f}
#vy-as .choix button[aria-pressed=true] small{color:#b6cdc8}
#vy-as .choix button::after{content:'';width:22px;height:22px;border-radius:50%;border:1.5px solid currentColor;opacity:.5;flex:none}
#vy-as .choix button[aria-pressed=true]::after{opacity:1;background:#fff;box-shadow:inset 0 0 0 5px #173d3f}
```

### 8. Polices hors marque, non chargées, boutons en Arial
Constat : le module déclare « Helvetica Neue » (absente sous Android et Windows, donc Arial), Georgia (absente sous Android) et « IBM Plex Mono » (jamais chargée). Mesure dans Chrome sur Mac : « FERMER », « Rien de particulier » et tous les `.btn` sont rendus en Arial 400. Le reste de vyvre utilise Inter, JetBrains Mono et, pour les titres serif, Playfair Display et Instrument Serif.
Correctif :
```css
#vy-as,#vy-as-entree{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
#vy-as button,#vy-as input,#vy-as-entree button{font:inherit}
#vy-as h1,#vy-as h2,#vy-as .rit>i,#vy-as .alleg,#vy-as-entree h3{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
#vy-as .journal{font-family:'JetBrains Mono',ui-monospace,monospace}
```
et dans `style()` : ajouter une fois `<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">` (une seule graisse, environ 20 Ko). Instrument Serif garde le caractère éditorial de Georgia italique, en plus fin, et existe déjà dans la page.

### 9. Échelle typographique : 24 tailles différentes
Constat : mesuré sur l'assiette : 9 ; 9,5 ; 10 ; 10,5 ; 11 ; 11,5 ; 12 ; 12,5 ; 13 ; 13,5 ; 14 ; 14,5 ; 15 ; 16 ; 17 ; 18 ; 19 ; 22 ; 24 ; 28 ; 40 ; 52 ; 58 ; 76 px. Aucun rythme, et du texte à 9 et 9,5 px.
Correctif : 7 niveaux, rien sous 11 px.
| rôle | taille / interligne | graisse | usage |
|---|---|---|---|
| étiquette | 11 / 1.3, `letter-spacing:.14em`, capitales | 600 | 1 à 3 mots seulement |
| méta | 13 / 1.45 | 400, `#52716f` | portion, saison, prix, sources |
| corps | 15 / 1.55 | 400 | toutes les phrases |
| accroche | 17 / 1.5 | 400 | introductions |
| titre de fiche | 22 / 1.15, `-.01em` | 500 | nom de l'aliment, de la recette |
| titre de section | 34 / 1, `-.03em` | italique serif | Recettes., Rythme., Soins. |
| titre d'écran | 56 / .95 (88 au-delà de 700 px), `-.035em` | italique serif | un seul par écran |
Remplacer les approches en pixels (`-5px`, `-4px`) par des `em` : à 76 px, `-5px` fait se toucher les lettres de « Assiette. ».

### 10. Paragraphes entiers en capitales de 10 px
Constat : `.preuve` (10 px, capitales, espacement 1,4 px) sert à des phrases de 2 à 10 lignes : « PREUVE C · PREUVES LIMITÉES POUR UN EFFET VISIBLE… », « 150 À 300 MINUTES D'ACTIVITÉ… MÉDECIN AVANT D'AUGMENTER L'EFFORT. », et dans le Combo un paragraphe de 10 lignes en capitales sur la vitamine C. Illisible, et c'est l'effet « notice de médicament ».
Correctif : `.preuve` réservé aux étiquettes de 1 à 3 mots (« Combien », « Une portion apporte »). Tout le reste passe en style méta : `#vy-as .meta{font-size:13px;line-height:1.5;color:#52716f;letter-spacing:0;text-transform:none}`. Le niveau de preuve devient une pastille :
```css
#vy-as .grade{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:7px;font:600 12px 'Inter';margin-right:8px;vertical-align:-6px}
#vy-as .grade.A{background:#173d3f;color:#fff}#vy-as .grade.B{background:#5f8f5b;color:#fff}#vy-as .grade.C{border:1px solid #52716f;color:#52716f}
```
Texte : « <span class="grade C">C</span> Preuves limitées : observations ou mécanismes. »

### 11. Les fiches aliment sont des murs de texte
Constat : une fiche fait environ 700 px sur téléphone (4 fiches = 3,4 écrans), avec jusqu'à 11 blocs : mécanisme, combien, apports (4 lignes), allégation, fait CIQUAL qui répète l'apport, preuve, prix de 3 à 5 lignes avec la source complète, allergènes, 2 précautions, études, « Pas pour moi ».
Correctif, visible d'emblée (cible ≤ 320 px par fiche) : nom (22 px) ; méta 13 px « Pour l'éclat · 150 g · de saison » ; une phrase « pourquoi » (couper `mecanisme_simple` à la première phrase) ; « Combien » ; pastille de preuve ; précautions de sécurité (celles-ci restent toujours visibles). Tout le reste dans un seul `<details>` « Nutriments, prix et sources » : apports, allégation, prix, études. Prix affiché court : « ≈ 3,92 €/kg » ; la source (INSEE, période, zone) va dans le dépliant. Supprimer la ligne `fait(f)` quand `apports(f)` existe (même information deux fois).

### 12. Des notes internes de recherche sont visibles dans le Combo
Constat (captures `m_22`, `m_25`) : « dans les essais : Rarement indiquée ; efficacité démontrée pour des formules complètes… » affiché deux fois (dans « Votre rituel » et à nouveau en capitales l. 369) ; « Pinnell 2001, peau de porc », « les signaler comme formes faibles », « Glycérine… ne la compter que dans les 5 premiers ingrédients », « Présence dans l'INCI ≠ quantité utile ». Ce sont des consignes de l'équipe, pas des phrases pour une cliente. « Très bien tolérés. » est affiché dans la couleur d'alerte orange.
Correctif :
- Supprimer la ligne 369 (le doublon en capitales).
- Ajouter dans `combos.json` un champ `concentration_affichee` court (« 10 à 20 % », « formule complète ») et n'afficher que lui ; à défaut, n'afficher `concentration_efficace` que s'il contient `/\d+\s*%/`, coupé au premier « ; » ou « ( ».
- Dans `precautions`, ne rendre que les entrées marquées `public:true` ; les textes positifs (tolérance) en couleur neutre `#b6cdc8`.
- Normaliser les noms produits (« mixsoon Vitamin C Cream 30ml » : première lettre en capitale, contenance retirée).

### 13. Le Combo parle d'aliments qui ne sont pas dans l'assiette
Constat : l'assiette montrée = tomate, melon, abricot sec, graines de lin ; le combo 03 est « Poivron rouge + Vitamine C ». Le tri met d'abord les aliments de l'assiette mais complète avec d'autres (l. 357) : l'histoire « votre assiette + votre soin » se casse.
Correctif l. 356 : ajouter `&& ids[c.aliment_id]` au filtre ; s'il reste moins d'une ligne, masquer le bloc plutôt que de le compléter. Titre du bloc : « Avec votre assiette, côté soin. » au lieu de « Combo. ».

### 14. « Premium » affiché sans rien derrière
Constat : « Premium · combo aliment + crème et sérum » et « Premium · 312 recettes pour vous » sont entièrement ouverts : pas de prix, pas de verrou, pas d'explication. Le mot promet quelque chose qui n'existe pas ; c'est le signal le plus « bon marché » de la page.
Correctif : retirer « Premium · » des deux étiquettes (l. 359 et 538) tant que l'offre n'existe pas. Le jour où elle existe : montrer 1 combo et 3 recettes, puis une carte de 180 px avec flou `filter:blur(6px)` sur la suite et un bouton « Débloquer » avec le prix.

### 15. Zones tactiles sous 44 px (35 relevées sur l'assiette)
Constat (390 px) : puces « Affiner » et onglets recettes 35 px de haut, puces Rythme 33 px, puces allergènes 38 px, « Pas pour moi » 92 × 13 px, « Les études (3) » et « Ingrédients et étapes » 12 px de haut, « J'ai moins de 18 ans » et « Je préfère ne pas répondre » 22 px, case « Garder mes réponses » 13 × 18 px, « FERMER » environ 34 px.
Correctif :
```css
#vy-as .puce{min-height:44px;padding:0 16px;display:inline-flex;align-items:center}
#vy-as summary{display:flex;align-items:center;justify-content:space-between;min-height:44px;font-size:13px;letter-spacing:0;text-transform:none;color:#183b3e}
#vy-as summary::after{content:'';width:8px;height:8px;border-right:1.5px solid;border-bottom:1.5px solid;transform:rotate(45deg);transition:transform .25s}
#vy-as details[open]>summary::after{transform:rotate(-135deg)}
#vy-as .vy-as-pas,#vy-as .fine a{display:inline-flex;align-items:center;min-height:44px}
#vy-as input[type=checkbox]{width:22px;height:22px}
```
Retirer tous les `style="font-size:12px;padding:8px 11px"` en ligne sur les puces (l. 381, 509, 539).

### 16. Pas de navigation dans une page de 10 224 px
Constat : 7 titres de section à 52 px, tous au même niveau ; « Fermer » disparaît dès le premier défilement ; aucun moyen de sauter aux recettes.
Correctif : en-tête collant, avec une commande segmentée :
```css
#vy-as .haut{position:sticky;top:0;z-index:5;margin:0 -24px 24px;padding:calc(10px + env(safe-area-inset-top)) 24px 10px;background:rgba(239,240,243,.82);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}
#vy-as .seg{display:flex;gap:2px;padding:3px;border-radius:12px;background:rgba(24,59,62,.07)}
#vy-as .seg a{flex:1;min-height:36px;display:grid;place-items:center;font-size:13px;border-radius:9px;color:inherit;text-decoration:none}
#vy-as .seg a.on{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12)}
```
Quatre destinations : Assiette · Recettes · Soins · Rythme (un `IntersectionObserver` met `.on`). Titres de section ramenés à 34 px.

### 17. « Vos réponses. » en titre de 52 px en bas de page
Constat : une section entière (titre géant, citation italique 18 px, bouton pleine largeur, case à cocher) pour rappeler « sans restriction particulière ».
Correctif : une ligne compacte juste sous le titre de l'assiette : « Sans restriction particulière · <a>Modifier</a> » (13 px, `#52716f`, lien souligné 1 px). La case « Garder mes réponses sur cet appareil » descend dans le pied de page avec les mentions.

### 18. « Près de vous » arrive trop tôt et s'efface tout seul
Constat : la demande de géolocalisation est la première section après les aliments, avant les recettes ; et chaque toucher sur un filtre « Affiner » ou « Pas pour moi » relance `assiette()`, qui réécrit `#vy-as-geo` (l. 492) : les magasins trouvés disparaissent.
Correctif : déplacer après les recettes, sous forme d'une ligne : « Où les trouver ? Magasins bio près de vous → » (44 px). Garder le dernier résultat dans une variable du module (`var GEO_HTML = null`) et le réinjecter dans `presDeVous()` s'il existe.

### 19. Chaque filtre reconstruit toute la page
Constat : `assiette()` remplace tout le `innerHTML` de la feuille à chaque toucher (l. 485, 487, 488, 489, 491) : les `<details>` ouverts se referment, le bloc Combo repart vide puis réapparaît après `catalogue()` et pousse les recettes vers le bas pendant la lecture ; aucun retour visuel sur ce qui a changé ; « Pas pour moi » fait disparaître la fiche sans possibilité immédiate d'annuler.
Correctif : isoler `<div id="vy-as-liste">` (tuiles + fiches) et ne réécrire que lui ; garder le HTML du Combo en cache ; animer les fiches nouvelles `@keyframes vient{from{opacity:0;transform:translateY(8px)}}` 350 ms ; ajouter `<p class="sr" aria-live="polite">` « Assiette mise à jour ». Après « Pas pour moi » : bandeau bas 4 s « Melon retiré · Annuler » (`position:fixed;bottom:calc(16px + env(safe-area-inset-bottom));left:16px;right:16px;min-height:52px;border-radius:16px;background:#173d3f;color:#fff`).

### 20. Aucun état de chargement ni d'erreur
Constat : « Composer mon assiette » charge trois fichiers l'un après l'autre (l. 69–72 : 920 Ko + 517 Ko + 56 Ko, soit 1,5 Mo) avant d'afficher quoi que ce soit ; en 4G, une à trois secondes où le bouton ne réagit pas. Si `aliments_v2.json` échoue, rien ne se passe, sans message. « Recherche autour de vous… » n'a pas de délai maximum côté Overpass.
Correctif : ouvrir la feuille immédiatement (l'écran de question n'a besoin de `DATA` que pour la liste « Une autre » et le compteur, qui peuvent arriver après) ; `Promise.all` pour les trois fichiers ; état appuyé `#vy-as-entree button:active{transform:scale(.98)}` + texte « Ouverture… » ; en cas d'échec : `.alerte` « L'assiette n'a pas pu se charger. » + bouton « Réessayer ». Pour Overpass : `AbortController` à 12 s, puis « La carte ne répond pas. Réessayer ».

### 21. La grille des noms barrés est invisible, mais elle salit l'écran
Constat : `.fond-tri` à 7,5 % d'opacité donne un contraste de 1,14 : 1 ; les noms barrés tombent à 1,04 : 1 ; police de 9 px. L'idée (259 noms, les filtres barrent) ne se voit pas, mais les noms transparaissent derrière le titre, derrière les quatre cases transparentes (« Chou de Bruxelles » derrière « 02 ») et derrière le journal.
Correctif, au choix :
- l'assumer ailleurs que derrière la roue : `#vy-as .fond-tri{font-size:11px;opacity:1;color:rgba(28,47,48,.28);-webkit-mask-image:linear-gradient(transparent 0 420px,#000 520px);mask-image:linear-gradient(transparent 0 420px,#000 520px)}`, `.x{color:rgba(28,47,48,.1);text-decoration:line-through}`, `.k{color:#1c2f30;font-weight:600}` et cases opaques `#vy-as .cases4 div{background:#f4f5f7}` ;
- ou la supprimer. Aujourd'hui elle coûte sans rien rapporter.

### 22. La roue elle-même : langage de podium, pas d'image, atterrissage mou
Constat : « Première place. », « Deuxième place. » suggère un classement (le premier serait meilleur), alors que la règle est la diversité (une famille par aliment). Points de couleur de 9 px, pas de photo ; quand la roue s'arrête, rien ne marque l'arrêt ; la case se remplit d'un texte de 12,5 px.
Correctif : titre « Pour l'éclat. » puis « Pour l'hydratation. » (l'indice réellement servi, `INDICES[pris[k].pour]`) avec « 1 sur 4 » en méta. Utiliser les photos quand elles existent (`/scan/aliment/photos/<id>.png`, 28 fichiers) sinon un disque de catégorie de même taille (28 px dans la roue, 44 px dans les cases), jamais un mélange de tailles. À l'arrêt : l'élément central `transform:scale(1.06)` 160 ms puis retour, case qui se remplit avec `animation:vient .35s`, et `navigator.vibrate && navigator.vibrate(8)`.

### 23. Contrastes sous le seuil AA
Constat (recalculé) : compteur « Il reste 249 aliments » 3,78 : 1 à 9,5 px ; sous-lignes des puces (`small` à 60 %) 3,84 : 1 à 11 px ; contour des puces `rgba(24,59,62,.3)` 1,75 : 1 alors qu'il est le seul repère de la zone tactile (WCAG 1.4.11 demande 3 : 1) ; bouton désactivé 2,37 : 1 (toléré par la norme, mais il paraît cassé).
Correctif : aucune opacité sur du texte : couleurs pleines `#52716f` (4,66 : 1) minimum pour le texte secondaire ; contour des puces `rgba(24,59,62,.55)` (environ 3,2 : 1) ; compteur passé en 13 px sans capitales ; bouton jamais grisé (voir point 6).

### 24. L'entrée ne ressemble pas à vyvre
Constat : la page de résultats est en verre sombre (noir `#030405`, Inter 200–300, étiquettes JetBrains Mono, accents or). La carte « Assiette. » est une dalle blanche avec une ombre de 80 px qui écrase le bouton « Protocole complet » juste au-dessus : la nouveauté l'emporte sur le produit principal, et l'ouverture d'une page blanche donne l'impression de changer de site.
Correctif :
```css
#vy-as-entree{background:var(--sg-glass,rgba(255,255,255,.04))!important;border:1px solid var(--sg-line,rgba(255,255,255,.12))!important;color:#f2f4f5!important;box-shadow:none}
#vy-as-entree h3{color:#f2f4f5;font:italic 400 52px/.95 'Instrument Serif',Georgia,serif;letter-spacing:-.03em}
#vy-as-entree p{color:rgba(242,244,245,.72)}
#vy-as-entree .m{font-family:'JetBrains Mono',monospace;color:#d9c9a3}
#vy-as-entree button{background:linear-gradient(180deg,#fff,#e4e0d6);color:#04050a}
```
La feuille peut rester claire (c'est le ton éditorial voulu), mais on y entre par un fondu depuis le noir : `#vy-as{background:#030405;transition:background .5s .15s}` puis `#vy-as.on{background:#eff0f3}`.

### 25. Mouvement : entrées et sorties sans chorégraphie
Constat : la feuille arrive en `translateY(30px)` 0,8 s puis tous les changements d'écran (question, roue, assiette) sont des coupes sèches par `innerHTML` avec `scrollTop = 0`. Sur ordinateur, 30 px de glissement sans voile se lit comme un saut.
Correctif : entrée `transform:translateY(24px) scale(.985)` vers `none`, 520 ms, `cubic-bezier(.2,.9,.2,1)` ; entre deux écrans, fondu croisé de 240 ms (ancien contenu `opacity:0` 160 ms, nouveau `vient` 280 ms décalé de 80 ms) ; sortie 280 ms `cubic-bezier(.4,0,1,1)` (plus rapide que l'entrée). `prefers-reduced-motion` : conserver la roue en version statique (les quatre cases remplies d'un coup, journal visible) plutôt que de sauter directement à l'assiette (l. 396), sinon ces personnes ne voient jamais comment le choix a été fait.

---

## 3. Recommandation : la roue dans le module ou les 4 écrans partagés ?

**Recommandation : garder la roue dans le module, après le scan, raccourcie (point 5) et enrichie de ce que les propositions font mieux. Ne pas adopter l'écran partagé scan + roue.**

Raisons :
1. **La donnée n'existe pas pendant le scan.** L'assiette dépend des deux indices les plus faibles de la lecture terminée et des réponses santé. Pendant la capture, ni l'un ni l'autre n'est connu : la roue de l'écran partagé tournerait sur un profil provisoire ou d'exemple (c'est d'ailleurs ce que font les propositions : « profil d'exemple »). C'est exactement le « simulé » que la règle « pas simulé, vraiment lié » interdit.
2. **La sécurité passe avant le calcul.** « Quelque chose à éviter ? » doit précéder toute proposition. En écran partagé, il faudrait poser la question santé avant le scan, à 100 % des visiteurs, alors que la plupart viennent pour leur peau, pas pour leur assiette : friction ajoutée au cœur du produit.
3. **Le scan a besoin du regard.** Pendant la capture, la personne doit rester immobile face à la caméra. Une roue qui défile à côté du visage attire les yeux et fait tourner la tête : risque réel sur la qualité de la mesure.
4. **À 390 px, la colonne de roue fait environ 170 px** : noms en 17 px, « Chou romanesco » ou « Cacao en poudre non sucré » coupés ; les quatre cases et le journal se partagent le bas de l'écran avec le sélecteur.
5. **Sur ordinateur, deux styles sur quatre cassent** (capture `planche_pd_b`) : S3 Éditorial, l'ovale du portrait déborde et recouvre le titre et les cases ; S4 Cinéma, le visage n'est plus lisible et la colonne de verre de 52 % flotte sans ancrage. S2 Nuit, noir, se heurte ensuite à l'assiette claire.

À reprendre des propositions dans le module actuel :
- les **photos d'aliments** dans la roue et dans les cases (proposition A et S1) : c'est le plus gros gain de qualité perçue pour le moins d'effort ; mais photographier ou détourer de façon homogène au moins les aliments qui peuvent sortir (environ 60), car mélanger photos et points de couleur (Épinard en point, Amande en photo) fait brouillon ;
- l'**aspect « Labo » de S1** (cartes blanches, ombre douce, rouge laser en accent) pour la roue elle-même ;
- le **journal court** de la proposition A (« 62 candidats pour Éclat et Rides ») : quatre lignes courtes plutôt que douze longues.

Si l'écran partagé reste souhaité plus tard : seulement le style S1, seulement après la fin de la capture (le visage figé à gauche, la roue réelle à droite pendant que le rapport se prépare), jamais pendant la mesure.

---

Captures de travail (non versionnées) : dossier `revue/` du scratchpad de session ; script de capture réutilisable : `_revue/revue.mjs` (`MOB=1 node revue.mjs m` pour le téléphone).
