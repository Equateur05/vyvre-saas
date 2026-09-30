# Prompt pour Astra : la suite du parcours aliment, après « Lancer le scan »

Bravo pour l'intro. Le fondateur a adoré la **01 Orbite** (« Le goût du choix. »). Elle est en ligne telle quelle sur https://vyvre.fr/aliment. Sur iPhone, on a seulement réduit un peu la taille des fruits, qui s'empilaient. Le fichier en ligne est `public/aliment/index.html`.

Il aime aussi beaucoup la mise en page de ta **02 Solo** (« Tout commence par vous. ») : le grand titre fin à gauche, un seul grand visuel à droite, un seul bouton, beaucoup d'air. **C'est ce style qu'il veut pour les questions** : une question par écran, on répond, la suivante arrive. Pas un formulaire.

Garde exactement la même famille visuelle que ces deux pages. Blanc à gris très clair, titres fins et très serrés, vraies photos détourées avec reflet léger, bouton noir arrondi, petits points de progression.

## Ce qu'on te demande

Des propositions (2 ou 3 variantes quand ça a du sens) pour **tout le parcours qui suit le clic sur « Lancer le scan »**, jusqu'à la fin. Chaque écran doit être une vraie page qui marche : animation réelle, vraies photos, vraies données lues dans nos fichiers JSON. Pas de maquette figée, pas de faux chiffres.

Le parcours, dans l'ordre :

1. **Les questions** (style 02 Solo, une par écran, 3 à 4 écrans au maximum, c'est une règle ferme).
   - Écran 1 : « Quelque chose à éviter ? » avec les 5 cas qui comptent vraiment : une allergie, enceinte ou allaitante, un anticoagulant, une maladie des reins, végétarien ou végan. Plus un grand choix « Rien de particulier » qui passe directement à la suite.
   - Si « allergie » : un écran pour préciser lesquelles (les 14 allergènes réglementaires, plus latex et pollen).
   - Écran suivant : « Plutôt du quotidien, des découvertes, ou les tendances ? »
   - Dernier écran : l'accord. Une phrase courte, le texte complet dépliable, et un lien discret « Je préfère ne pas répondre » qui donne quand même une assiette, dite prudente. Ajoute aussi un lien « J'ai moins de 18 ans ».
   - Les règles exactes et les textes sont dans `_nutrition/QUESTIONNAIRE_V2.md`. La version V2 tient en un seul écran ; toi, tu la découpes en plusieurs écrans Solo, sans ajouter de question.
2. **Le scan de peau** : la caméra (visage à gauche, ou en haut sur iPhone) avec l'analyse qui se fait en direct.
3. **La composition, juste après le scan, avant de montrer les produits** : le fondateur veut **le style de ta 04 Traversée** (« Ouvrez le champ des possibles. » : deux rangées de fruits qui défilent en sens opposé autour du texte). C'est l'écran de chargement pendant qu'on choisit les 4 aliments. Les rangées ralentissent puis s'arrêtent sur les 4 choix, un par un, qui viennent se poser au centre. Le texte au centre suit les vraies étapes : aliments étudiés, écartés pour vous, classés par preuves, puis retenus. La roue façon sélecteur iOS de `lancer()` peut servir de variante, mais c'est la Traversée qui mène.
4. **Le résultat « Votre assiette »** : les 4 aliments, pourquoi chacun, combien, ce qu'une portion apporte, le niveau de preuve, les précautions. Pars de ta page « Skin Edit » que le fondateur adore (`public/propals/resultats/index.html?v=gpt`), dans le nouveau style blanc.
5. **La suite de la page de résultat** : les filtres (saison, budget, bio, cuisine, « pas pour moi »), les recettes, « Près de vous » (magasins bio), le rythme (sommeil, pas, alcool), les combos « un aliment, un soin » (offre premium) et les tendances (collagène, matcha, vinaigre de cidre…) avec leur verdict honnête.

## Où chercher, exactement

Racine : `/Users/charles/Documents/vyvre-saas-scan/`

- **Le module actuel, qui marche déjà** : `public/scan/aliment/vy-aliment.js`. Les fonctions à lire :
  - `eviter()` : l'écran des questions ;
  - `pareil()` : le retour d'une personne déjà venue ;
  - `versRep()` : la traduction des réponses en règles ;
  - `exclus()` et `prudentOk()` : les règles de sécurité ;
  - `choisir()` : le choix des 4 aliments ;
  - `lancer()` : la roue ;
  - `assiette()` et `editTete()` : la page de résultat ;
  - `affiner()` : les filtres ;
  - `composition()` et `apports()` : ce qu'un aliment contient et ce qu'une portion apporte ;
  - `recettes()`, `presDeVous()`, `rythme()`, `combos()`, `tendances()`.

  Pour le voir tourner : https://vyvre.fr/scan/?assiette=1 (avec un profil d'exemple si l'appareil n'a jamais fait de scan).
- **Les données réelles**, dans `public/scan/aliment/` :
  - `aliments_v4.json` (265 aliments, avec composition CIQUAL, portion, saison, prix, allergènes, niveau de preuve, allégation autorisée) ;
  - `recettes.json` (320 recettes) ;
  - `combos.json` ;
  - `actifs_produits.json` (les soins du catalogue qui contiennent chaque actif) ;
  - `tendances.json` ;
  - `photos/<id>.png` et `photos/credits.json`.
- **Les règles de fond** : `_nutrition/REGLES_RECOMMANDATION.md`, `_nutrition/FILTRES.md`, `_nutrition/COMBOS.md`, `_nutrition/ACCROCHES.md`, `_nutrition/ETUDE_ALIMENTS_PEAU_LONGEVITE.md`.
- **Le scan de peau actuel** : `public/scan/index.html`. Il stocke les scores dans le localStorage : `vyvre_scan_scores`, et `vyvre_rituel` pour les 4 soins.
- **Tes pages de référence** : `public/aliment/index.html` (Orbite en ligne), `_astra_propals/intro-aliment/02-solo.html` (style des questions) et `_astra_propals/intro-aliment/04-traverse.html` (style de la composition).
- **Les propositions précédentes**, pour faire mieux : `public/propals/assiette/index.html` (A = la roue) et `public/propals/assiette/scan.html` (écran partagé scan et roue ; le style S1 « Labo » plaît).

Pour lire les JSON depuis tes pages, sers la racine du projet en local (`python3 -m http.server 8792 --bind 127.0.0.1` depuis `/Users/charles/Documents/vyvre-saas-scan/`) et charge-les par `/public/scan/aliment/...`.

## Contraintes absolues

- Tu ne modifies RIEN dans `public/`, `app/`, `_nutrition/` ni ailleurs dans le projet. Tu écris uniquement dans un nouveau dossier : `_astra_propals/parcours-aliment/`. Tu y mets une page par écran ou par variante, un `index.html` qui présente le parcours dans l'ordre, et un `NOTES.md`.
- Tu ne changes aucune règle de sécurité ni aucun texte juridique. Si quelque chose te semble faux, note-le dans `NOTES.md` au lieu de le changer.
- Aucune emoji, nulle part.
- Jamais le mot « IA » à l'écran.
- Aucun prix en euros. Le niveau de budget (€, €€, €€€) reste permis dans les filtres.
- Vocabulaire interdit : « superaliment », « détox », « anti-âge », « booste ».
- Aucune promesse de santé ni d'effet d'un aliment sur la peau, aucun diagnostic. Une allégation n'apparaît que si elle est autorisée par le registre UE, et alors mot pour mot : elle est dans le champ `allegation_UE_autorisee`. Sinon, on parle de composition (« riche en », « source de », selon les seuils du règlement 1924/2006) et d'études, à titre d'information.
- Toutes les précautions d'un aliment restent visibles.
- Les crédits photos restent accessibles (licences CC BY et CC BY-SA).
- Pas de faux chiffres, pas de faux avis, pas de fausse marque.
- Ne lis aucun fichier `.env` ni aucun secret. Ne contourne aucune protection anti-robot.
- Textes courts, regroupés dans un objet en haut de chaque fichier, pour la traduction en 12 langues.
- Tout doit tenir sur iPhone (390 px) comme sur ordinateur (1440 px) et rester fluide.

## Rendu attendu

1. Le dossier `_astra_propals/parcours-aliment/` avec les pages et un `index.html` qui déroule le parcours dans l'ordre (1 à 5).
2. Dans `NOTES.md` : une ligne par écran (l'idée), comment l'ouvrir en local, et ce que tu recommandes de garder.
3. Des captures de chaque écran en 390 × 844 et en 1440 × 1000.
