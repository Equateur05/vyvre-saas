# Prompt pour Astra : l'intro du scan aliment de vyvre.fr

Tu es directeur artistique et designer d'interface, au niveau d'Apple (pages produit iPhone, AirPods, Vision Pro). Tu travailles pour vyvre.fr, un service de lecture de la peau haut de gamme.

## Ce qu'on te demande

Plusieurs propositions visuelles (4 à 6), TRÈS différentes entre elles, de la page d'intro du « scan aliment ».

Le parcours voulu :
1. Sur vyvre.fr, dans le menu, on clique « Aliment ».
2. On arrive sur une intro : une page toute blanche (blanc à gris très clair, dégradé léger). Au milieu, les fruits et légumes défilent : de vraies photos détourées, pas des dessins, pas des emoji. Il faut que ce soit iconique, façon Apple, super beau, avec un léger reflet des fruits sur le sol.
3. Plus bas, un bouton « Lancer le scan ».
4. Ce bouton mène au scan de peau existant, qui débouche ensuite sur « Votre assiette » (4 aliments choisis pour la peau).

Chaque proposition doit être une page HTML autonome qui marche vraiment (animation réelle, vraies photos), pas une maquette figée. Elle doit tenir sur iPhone (390 px de large) comme sur ordinateur (1440 px), rester fluide (60 images par seconde sur un iPhone récent) et se charger vite.

## Où chercher, exactement

Racine : `/Users/charles/Documents/vyvre-saas-scan/`

- **Les photos détourées** (PNG transparents, 600 px de large) : `public/scan/aliment/photos/<id>.png`. Il y en a environ 190. Les crédits et licences sont dans `public/scan/aliment/photos/credits.json`. Les licences CC BY et CC BY-SA exigent d'afficher le crédit : prévois un lien discret « Crédits photos » qui liste les photos utilisées.
- **Les photos les plus photogéniques** : grenade, orange, citron, kiwi, avocat, mangue, myrtille, fraise, framboise, figue, raisin, ananas, poire, pomme, peche, cerise, abricot, betterave, brocoli, poivron_rouge, carotte, pasteque, papaye, citron_vert, gingembre, curcuma, fruit_passion, potiron, artichaut, chou_rouge, radis, fenouil, aubergine, tomate, mure, litchi, clementine. Regarde-les avant de choisir. Écarte celles qui sont mal détourées.
- **Les données des aliments** (noms, catégories, couleurs) : `public/scan/aliment/aliments_v4.json`.
- **Le module actuel « Votre assiette »** : `public/scan/aliment/vy-aliment.js`. La fonction `lancer()` contient la roue de composition façon sélecteur iOS. La fonction `assiette()` construit la page de résultats.
- **Les propositions déjà faites**, pour t'en inspirer et faire mieux, pas pour les copier :
  - `public/propals/assiette/index.html` : A = la roue qui défile, que le fondateur aime ; E = la grille de noms qui se barrent.
  - `public/propals/assiette/scan.html` : écran partagé, scan à gauche et roue à droite. Le style S1 « Labo » (blanc Apple) plaît au fondateur.
  - `public/propals/resultats/index.html?v=gpt` : la page de résultats que le fondateur adore (ta direction « Skin Edit »).
- **Le vrai menu du site** : `public/scan/index.html` (page d'accueil du scan) et `public/propals/menu/index.html`. La variante G est celle retenue : menu en haut, éléments à droite.
- **Tes travaux précédents** : `_astra_propals/` (collections 01 et 02). Garde ce niveau d'exigence.

## Contraintes absolues

- Tu ne modifies RIEN dans `public/`, `app/` ni ailleurs dans le projet. Tu écris uniquement dans un nouveau dossier : `_astra_propals/intro-aliment/`. Tu y mets une page par proposition, une page `index.html` qui les présente toutes, et un `NOTES.md`.
- Tu charges les photos par chemin relatif vers `../../public/scan/aliment/photos/`, ou tu les copies dans ton dossier. Ne les retouche pas en place.
- Le bouton « Lancer le scan » pointe vers `/scan/`.
- Aucune emoji, nulle part.
- Jamais le mot « IA » à l'écran. Aucun prix affiché.
- Vocabulaire interdit : « superaliment », « détox », « anti-âge », « booste », ni aucune promesse de santé ou d'effet d'un aliment sur la peau. On parle de composition, de choix et de raisons, jamais de guérison.
- Pas de faux chiffres ni de fausses statistiques.
- Pas d'image générée qui imite une vraie marque.
- Ne lis aucun fichier `.env` ni aucun secret.
- Le site existe en 12 langues. Garde les textes courts et isolés dans le code (un objet de textes en haut du fichier), pour qu'on puisse les traduire.

## Ce qui fera la différence

- Le reflet au sol : léger, crédible, qui s'estompe. Pas un miroir brutal.
- Le mouvement : ralenti, précis, avec une vraie inertie (ressort, décélération), comme un carrousel Apple. Pas un défilement linéaire bête.
- La lumière : ombres de contact douces sous chaque fruit, un blanc qui respire, une typographie fine et grande.
- Le texte : un titre court et fort, une phrase dessous, le bouton. Rien de plus.
- Chaque proposition doit avoir sa propre idée de mise en scène, pas la même page recolorée. Par exemple : un carrousel en arc 3D, un seul fruit à la fois en grand, une vitrine sur plateau tournant, un défilé infini sur deux rangs, des fruits qui se posent un à un sur une ligne d'horizon… À toi de trouver mieux.

## Rendu attendu

1. Le dossier `_astra_propals/intro-aliment/` avec les pages.
2. Dans `NOTES.md` : une ligne par proposition (l'idée en une phrase), comment l'ouvrir en local (`python3 -m http.server` depuis la racine du projet), les photos utilisées et leurs crédits.
3. Des captures d'écran de chaque proposition, en largeur iPhone et en largeur ordinateur.
