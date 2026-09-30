# Questionnaire ciblé avant le « scan aliment »

Objectif : 10 questions, moins de 60 secondes, posées une fois (modifiables ensuite), avant toute proposition d'aliment ou de protocole. Sans réponse aux questions 1 à 5, l'app n'affiche aucun aliment (seulement les conseils généraux sans risque : bouger, dormir régulièrement, boire de l'eau).

Données de santé : consentement explicite, finalité expliquée, possibilité de ne pas répondre et de tout effacer (RGPD, article 9). Ne jamais réutiliser ces réponses pour la publicité.

---

## Les questions

**Q1. Avez-vous une allergie alimentaire diagnostiquée ?** (choix multiples, liste des 14 allergènes UE)
Gluten (blé, seigle, orge, avoine) / crustacés / œufs / poissons / arachide / soja / lait / fruits à coque (amande, noisette, noix, cajou, pécan, noix du Brésil, pistache, macadamia) / céleri / moutarde / sésame / sulfites / lupin / mollusques / autre (texte libre) / aucune.

**Q2. Avez-vous une allergie au latex ou au pollen de bouleau (rhume des foins au printemps) ?** Oui latex / Oui bouleau / Je ne sais pas / Non.

**Q3. Êtes-vous enceinte, allaitez-vous, ou essayez-vous d'avoir un enfant ?** Enceinte / J'allaite / Projet de grossesse / Non / Je préfère ne pas répondre.

**Q4. Prenez-vous un de ces traitements ?** (choix multiples)
Anticoagulant de type AVK (warfarine, fluindione, acénocoumarol) / autre anticoagulant / traitement pour la thyroïde / lithium ou amiodarone / traitement quotidien pour le cœur, le cholestérol, la tension, une greffe, un cancer, l'épilepsie, la dépression, une infection (tout traitement pris chaque jour) / complément contenant du sélénium, du zinc, de l'iode ou du bêta-carotène / aucun.

**Q5. Avez-vous une de ces situations de santé ?** (choix multiples)
Maladie des reins / maladie de la thyroïde / maladie cœliaque / maladie du cœur / diabète traité / antécédent personnel ou familial de cancer du sein / antécédent de trouble du comportement alimentaire / calculs rénaux / aucune.

**Q6. Quel âge avez-vous ?** Moins de 18 ans / 18 à 64 ans / 65 ans et plus.

**Q7. Quel est votre régime alimentaire ?** Omnivore / Flexitarien / Pescétarien / Végétarien / Végan / Halal / Casher / Sans porc / Autre.

**Q8. Avez-vous (ou pensez-vous avoir) un de ces problèmes de peau ?** Acné / Rosacée ou rougeurs qui montent facilement / Eczéma (dermatite atopique) / Psoriasis / Aucun / Je ne sais pas.

**Q9. Votre sommeil : combien d'heures dormez-vous en général, et vos horaires sont-ils réguliers (même heure de coucher et de lever, week-end compris) ?** Moins de 6 h / 6 à 7 h / 7 à 9 h / Plus de 9 h ; Réguliers / Assez réguliers / Très irréguliers (travail de nuit ou posté inclus).

**Q10. Votre activité : combien de pas faites-vous par jour environ, ou combien de temps d'activité modérée par semaine ?** Moins de 4 000 pas / 4 000 à 7 000 / Plus de 7 000 / Je ne sais pas ; Moins de 150 min par semaine / 150 min ou plus.

Question optionnelle (si Q8 = rosacée) : **Q11. Qu'est-ce qui déclenche vos rougeurs, selon vous ?** Alcool / Boissons chaudes / Plats épicés / Soleil / Chaleur / Stress / Je ne sais pas.

---

## Table de règles : ce que chaque réponse change

| Question | Réponse | Effet sur les aliments | Effet sur les conseils et messages |
|---|---|---|---|
| Q1 | Un ou plusieurs allergènes | Exclure tout aliment dont `allergenes_UE` contient l'allergène ; exclure aussi les recettes qui le contiennent | Rappel : « Nous ne remplaçons pas votre allergologue. » |
| Q1 | Fruits à coque | Exclure noix, amande, noisette, noix du Brésil ; garder graines (courge, tournesol, lin, chia) sauf allergie connue à ces graines | |
| Q1 | Poissons | Exclure sardine, maquereau, saumon ; proposer ALA végétal (lin, chia, noix si tolérées) | Remarque : les oméga-3 végétaux ne remplacent pas exactement EPA et DHA |
| Q1 | Mollusques ou crustacés | Exclure huîtres | |
| Q1 | Gluten / maladie cœliaque (Q5) | Exclure pain complet et flocons d'avoine (sauf avoine certifiée sans gluten et avis médical) ; proposer légumineuses, sarrasin, quinoa en céréales complètes | |
| Q1 | Soja | Exclure tofu | |
| Q1 | Lait | Exclure yaourt, kéfir ; vérifier le chocolat | Rappeler les autres sources de calcium (eaux calciques, légumes verts, amandes si tolérées) |
| Q1 | Sulfites | Pas d'abricots secs dans les recettes | |
| Q2 | Latex | Exclure avocat, kiwi ; signaler tomate et poivron (réaction possible) | « Allergie au latex : certains fruits peuvent réagir (syndrome latex-fruits). » |
| Q2 | Bouleau | Signaler (sans exclure d'office) pomme, noisette, amande, carotte crue, kiwi, abricot, soja ; privilégier les versions cuites pour les fruits et légumes | Les réactions croisées au bouleau sont souvent limitées à la bouche, mais le soja peut donner des réactions sévères : avis allergologue |
| Q3 | Enceinte ou allaitement | Exclure tofu et tout soja ; exclure huîtres crues ; saumon uniquement cuit (pas fumé) ; limiter thé vert ; pas de foie dans les recettes ; pas d'alcool dans les recettes ; pas d'algues | Aucun protocole de jeûne ni de restriction ; renvoi vers la sage-femme ou le médecin ; poisson 2 fois par semaine dont un gras, pas d'espadon, marlin, siki, requin, lamproie |
| Q3 | Projet de grossesse | Pas de foie ; pas de compléments ; renvoyer au médecin pour l'acide folique | |
| Q4 | AVK | Ne jamais proposer d'augmenter épinards, chou frisé, brocoli, mâche ; si déjà consommés, message « gardez une consommation régulière » | Aucun conseil de complément ; « toute modification importante de votre alimentation se discute avec votre médecin (INR) » |
| Q4 | Traitement quotidien (toute catégorie) | Exclure pamplemousse et pomelo | « Certains aliments interagissent avec des médicaments : parlez-en à votre pharmacien. » |
| Q4 | Thyroïde, lithium, amiodarone | Exclure algues ; ne pas mettre en avant les allégations iode ; huîtres au plus occasionnelles | Renvoi au médecin |
| Q4 | Complément de sélénium | Exclure noix du Brésil | |
| Q4 | Complément de zinc ou d'iode | Ne pas proposer huîtres comme « source de zinc/iode » | |
| Q4 | Complément de bêta-carotène | Message : ne pas cumuler, surtout si fumeur ; pas de conseil de complément | |
| Q5 | Maladie rénale | Exclure les suggestions riches en potassium (avocat, fruits à coque, légumineuses, cacao, concentré de tomate, patate douce, épinard, chou frisé, abricot, courge) ; aucune portion de protéines augmentée ; pas de protocole « plus de protéines » | « Votre alimentation doit être fixée avec votre néphrologue » |
| Q5 | Maladie de la thyroïde | Exclure algues ; pas d'allégation iode | |
| Q5 | Maladie cardiaque | Exclure algues (avis ANSES) ; pas de conseils d'activité intense sans avis médical | |
| Q5 | Diabète traité | Pas de fenêtre alimentaire ni de jeûne | Conseils d'activité : avis médical |
| Q5 | Antécédent de cancer du sein (perso ou famille) | Exclure tofu et soja | Avis médical |
| Q5 | Trouble du comportement alimentaire | Aucun jeûne, aucun comptage, aucune liste « à éviter » ; seulement des propositions positives | Ton neutre, pas de chiffres de poids |
| Q5 | Calculs rénaux | Signaler l'épinard (oxalates) | Avis médical |
| Q6 | Moins de 18 ans | Pas de protocole longévité, pas de jeûne, pas de restriction, pas de noix du Brésil ; aliments courants uniquement | Activité : 60 min par jour en moyenne (OMS 2020) ; acné ou poids : médecin traitant |
| Q6 | 65 ans et plus | Mettre en avant protéines (œufs, poisson, légumineuses) sauf maladie rénale | Repère PROT-AGE 1,0 à 1,2 g/kg/j (à valider avec le médecin) ; renforcement musculaire |
| Q7 | Végétarien | Exclure poissons, huîtres | Oméga-3 : lin, chia, noix, colza |
| Q7 | Végan | Exclure aussi œufs, yaourt, kéfir | Rappel : la vitamine B12 doit être supplémentée chez les végans (recommandation classique, à faire confirmer par un professionnel) |
| Q7 | Halal / Casher | Aucun aliment de la liste n'est exclu d'office ; exclure les recettes avec alcool ou viandes non conformes ; casher : pas d'huîtres (fruits de mer) | |
| Q8 | Acné | Priorité aux aliments à faible charge glycémique (légumineuses, flocons d'avoine, pain complet) ; ne pas proposer yaourt, kéfir, chocolat pour cet indice | « Si votre acné est douloureuse, laisse des cicatrices ou dure : consultez. » |
| Q8 | Rosacée | Pas de thé vert chaud proposé en boisson chaude ; recettes non épicées ; pas d'alcool | « Observez vos propres déclencheurs ; les plus cités par les patients sont le soleil, le stress, la chaleur, l'alcool, les épices et les boissons chaudes » |
| Q8 | Eczéma | Aucune éviction proposée | « N'éliminez pas d'aliments sans avis médical, surtout chez l'enfant : cela peut créer une allergie. » |
| Q8 | Psoriasis | Pas d'éviction du gluten proposée | « La perte de poids en cas de surpoids est le seul conseil alimentaire fortement recommandé ; toujours en complément du traitement. » |
| Q9 | Moins de 7 h | | Protocole sommeil : viser au moins 7 h |
| Q9 | Horaires très irréguliers | | Priorité à la régularité (même heure de lever), lumière du jour le matin ; pas de fenêtre alimentaire pour les travailleurs de nuit sans avis médical |
| Q9 | Plus de 9 h | | Message neutre : un sommeil très long régulier peut justifier d'en parler à son médecin |
| Q10 | Moins de 4 000 pas | | Objectif progressif : +1 000 pas par jour, cible 7 000 |
| Q10 | Moins de 150 min | | Objectif OMS 150 à 300 min d'activité modérée + 2 séances de renforcement |
| Q11 | Déclencheurs cités | Retirer des recettes les déclencheurs cochés | Journal des déclencheurs personnel |

Signaux d'alerte (voir REGLES_RECOMMANDATION.md, section 5) : si l'utilisateur coche ou décrit un signal d'alerte, l'app affiche d'abord le message de consultation.
