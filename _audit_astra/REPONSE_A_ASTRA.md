Merci Astra. J'ai fait vérifier ton audit ligne par ligne dans le code. Voici le retour, puis ce que j'attends de toi pour aller plus loin.

RÈGLE INCHANGÉE : tu ne touches à AUCUN fichier existant du projet. Tu écris seulement dans _audit_astra/ et _astra_propals/. Pas de git en écriture, pas de npm/npx, pas de déploiement, pas de lecture des secrets.

====================================================================
1. TON AUDIT : CE QUI EST CONFIRMÉ, CE QUI NE L'EST PAS
====================================================================
Confirmé : plus de 30 affirmations sont justes, avec les bons numéros de ligne. Merci.

Exagéré :
- « Sans parfum déduit d'une donnée manquante » : catalogue-v2/fusion_scores.py:275 ne s'applique que si la liste INCI existe.
- « Statistiques /m enregistrées unknown » : m/index.html:1653, le chemin /m/<marque> est quand même envoyé (url_path).

Dépassé :
- Tu as noté l'ancienne série laser A à F. La série actuelle est public/propals/laser/reel.html : 7 modèles × 5 couleurs, sur le vrai visage.

Ce que tu as MANQUÉ (le plus grave) :
- Le vrai scan peau ne finit jamais à temps. La page n'attend que 2 s d'étapes + 3,5 s de course (public/scan/index.html, autour de la ligne 1522, Promise.race avec 3500 ms). Le moteur, lui, fait 3 s de pré-contrôle (vyvre-scan-engine.js, PRESCAN_DURATION_MS) + 5 s de lecture (SCAN_DEFAULT_DURATION_MS). Le résultat affiché vient donc presque toujours de deriveScoresFromPixels, sur une seule image, sans contrôle qualité.
- Si la lumière est mauvaise, le refus arrive vers 3 s. La page le prend pour un résultat et affiche le tableau avec les valeurs d'exemple 91 / 88 / 70, avec le message d'erreur par-dessus.
- public/m/index.html (les pages marque /m/<marque>) est une copie du même code, avec le même défaut. En plus, elle télécharge le catalogue de 5,9 Mo deux à trois fois.

====================================================================
2. CE QUE J'ATTENDS : APPROFONDIR, SANS CODER
====================================================================
Écris _audit_astra/PLAN_CORRECTIONS.md, en mots simples, avec pour chaque point : le problème, la solution proposée, le risque de casser quelque chose, et comment on vérifie que c'est réparé.

A. Plus jamais de chiffre inventé.
   Décris le parcours idéal : combien de temps la cliente attend, ce qu'elle voit pendant la lecture (elle dure 8 s), et ce qu'on affiche si la lecture échoue (message clair, bouton recommencer, AUCUN chiffre). Pense iPhone d'abord. Pense aussi à la tablette d'institut (Sothys) : plusieurs clientes à la suite sur le même appareil.

B. Les mots à l'écran.
   Donne la liste exacte des textes à changer, sous la forme « avant → après », en français. Par exemple : Barrière d'hydratation %, âge biologique, ± 3, pixel par pixel, Stamatas 2011. Et dis comment traiter la fermeté, qui dépend aujourd'hui de la couleur de peau (biais).

C. Confidentialité.
   Réécris les passages de /confidentialite et du DPA pour qu'ils décrivent la réalité : l'analyse se fait sur l'appareil, et la photo est effacée en fin de séance. Propose le texte.

D. Tarifs et CGV.
   Présente les deux versions côte à côte (Pilot, Growth, SLA) et propose UNE grille cohérente. C'est le fondateur qui tranchera.

E. Classement.
   Classe A à D par ordre de priorité pour une démonstration devant une marque de luxe.

====================================================================
3. TES PROPOSITIONS VISUELLES : À REFAIRE
====================================================================
Constat : les 8 fichiers p01 à p08 sont un seul et même fichier. Il y a 12 lignes de différence sur 173 : la couleur, le titre et un numéro de variante. Ce qu'on voit est un œuf stylisé avec un petit visage souriant dessiné, dans une mise en page identique. C'est propre, mais ce n'est pas « wow ». Marée (cheveux) est la plus réussie.

Ce que je veux maintenant : 3 propositions VRAIMENT différentes, plutôt que 8 variantes. Pour chacune :
- un fichier et un code à elle, pas un gabarit commun ;
- sur le VRAI visage en direct (MediaPipe FaceLandmarker, 478 repères), comme public/propals/laser/reel.html. Le mode ?demo=1 reste obligatoire sans caméra, mais sans visage souriant dessiné : un maillage 3D réaliste, ou une vraie photo de public/_test_masque/p_073.jpg ;
- pensée pour l'iPhone (390 × 844), plein écran, pas une carte au milieu d'une page ;
- plus forte que notre série laser actuelle : ouvre reel.html?s=7 pour voir la barre ;
- 1 pour la peau, 1 pour les cheveux (face, profils, crâne, nuque), et 1 libre, la plus audacieuse.

Pour tester : Chrome bloque les fichiers locaux. Lance un petit serveur dans ton dossier (python3 -m http.server 8790 dans _astra_propals/, puis http://localhost:8790/). Vérifie la console et fais une capture de chaque proposition à 390 px de large.

Mets à jour NOTES.md avec ta recommandation finale.
