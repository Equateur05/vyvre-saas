# Accroches des 265 aliments (aliments_v4.json)

Trois champs ajoutés à chaque aliment de `aliments_v3.json`. Aucun autre champ n'a été modifié : le script `generateur_v4/genere_accroches.py` le vérifie aliment par aliment, avant et après écriture. Seul `_meta` change : `version` passe à 4.0 et `description_v4` est ajouté.

- `accroche` : une ou deux phrases, 77 à 134 caractères (113 en moyenne). Typographie française : apostrophe ’, espace fine insécable avant `: ; ! ?`, espace insécable avant `%` et `°C`.
- `accroche_nutrition_verifiee` : `true` pour 48 aliments, dont l'accroche contient une allégation nutritionnelle de l'annexe du Règlement 1924/2006. `false` pour les 217 autres.
- `accroche_justif` : nutriment, valeur CIQUAL 2020, seuil appliqué et code CIQUAL. `null` quand il n'y a pas d'allégation.

## Règles appliquées

**Ce qui est permis.** Le goût, la texture, la couleur, l'arôme, l'origine, la saison, la tradition, les usages en cuisine, les associations, et comment choisir, conserver ou préparer l'aliment. Une allégation nutritionnelle de l'annexe est permise aussi, mais seulement avec sa formule exacte : « source de / riche en fibres », « source de / riche en protéines », « riche en vitamine C », « riche en acides gras oméga-3 ». C'est la formule française de l'annexe, et non « oméga-3 » tout court.

**Seuils, vérifiés par le script à partir de `ciqual.teneurs_pour_100g`.**
- Fibres : à partir de 3 g pour 100 g pour « source », 6 g pour « riche ». Seul le critère pour 100 g est retenu, pas l'autre critère légal (pour 100 kcal), plus favorable.
- Protéines : au moins 12 % de l'énergie pour « source », 20 % pour « riche ». Pas d'allégation protéines quand l'énergie manque dans le fichier.
- Oméga-3 : il faut atteindre le seuil à la fois pour 100 g et pour 100 kcal. Pour « source », 0,3 g d'ALA ou 40 mg d'EPA+DHA. Pour « riche », 0,6 g d'ALA ou 80 mg d'EPA+DHA. Quand l'énergie manque (noix, lin), le calcul prend 900 kcal pour 100 g, le maximum possible : la marge reste large.
- Vitamines et minéraux : 15 % de la VNR pour 100 g pour « source », 30 % pour « riche ».

**Garde-fous plus stricts que la loi.**
- Aucune allégation pour les épices, herbes, condiments, algues, sucres, boissons et produits du cacao. Ce sont de petites portions, avec un risque d'excès ou une règle différente (seuil pour 100 mL).
- Pas de vitamine A : la provitamine A est à faire valider par un juriste. Pas de potassium ni de vitamine K, qui posent un risque pour les patients rénaux ou sous AVK (revue A13).
- Pas de vitamine C pour les 10 fiches « cru mais mangé cuit » de la revue A16.
- Pas d'allégation protéines sur un légume (conforme au seuil, mais trompeur).
- Pas d'allégation sélénium sur la noix du Brésil.
- Le brocoli n'est que « source de vitamine C » : 23,9 mg, juste sous le seuil « riche » de 24 mg.

**Ce qui est interdit, et contrôlé par une liste de motifs dans le script.**
- Tout effet sur la santé, la peau, la beauté, une maladie, une fonction du corps ou la longévité. Exemples : bon pour, protège, anti-, booste, détox, super, éclat, jeunesse, immunité, digestion, énergie, bienfaits, santé, sain, collagène, rides, hydratation, rassasiant, équilibre, naturel, vivant, probiotique, étude, médecin, cœur, sommeil.
- Tout nom de nutriment en dehors de la formule légale.
- Les allégations autorisées ne sont jamais répétées ni reformulées : l'app les affiche à part, mot pour mot.
- Aucune comparaison de santé, aucune référence à une étude.
- Les aliments « tendance » restent purement culinaires. Pour le kéfir, le miso et la choucroute, « fermenté » décrit le produit, sans « ferments », « vivant » ni « probiotique ».

**Obligation liée.** Une accroche avec allégation nutritionnelle impose d'afficher la déclaration nutritionnelle de l'aliment (article 7 du 1924/2006). L'app doit donc montrer les teneurs CIQUAL à côté de ces 48 accroches.

## Aliments où j'ai hésité

- **Eau** : pas un mot sur la soif ni sur l'hydratation, qui reviendrait à paraphraser l'allégation « eau ». J'ai gardé seulement le service : « La boisson de chaque repas ».
- **Tisane** : verveine, camomille et tilleul ont des allégations « en attente » à l'EFSA, sur le sommeil et le calme. Je ne cite que le goût et l'infusion.
- **Curcuma** : l'association « poivre noir et filet d'huile », tirée de l'exemple demandé, est aussi l'astuce d'absorption qui circule sur internet. Elle reste ici une association culinaire, mais c'est à surveiller si le texte est un jour lu à côté d'un contenu santé.
- **Spiruline** : l'ANSES la déconseille à certains publics, qui figurent dans les précautions. L'accroche ne parle que de goût et de couleur. Faut-il vraiment la mettre en avant ?
- **Noix du Brésil** : l'accroche dit « une ou deux », en accord avec la limite de sélénium. Ce n'est pas une posologie.
- **Manioc, taro** : « toujours bien cuit » est une consigne de préparation (sécurité), pas une allégation.
- **Épinard, cresson, poivron rouge** : « riche en vitamine C » seulement quand ils sont crus, car les valeurs CIQUAL sont celles du cru. L'accroche le précise.
- **Huîtres** : l'accroche les propose nature, donc crues. Les précautions pour la grossesse s'affichent ailleurs. Aucune accroche ne propose d'œuf mollet ou poché, ni de poisson cru.
- **Origines** (AOP, IGP, villes) : elles sont citées comme exemples (« de Lucques ou de Nyons ») et jamais comme l'origine du produit, sauf pour la lentille verte du Puy, le comté et la feta, dont la fiche porte l'appellation. Trois formulations ont été corrigées pour cette raison : colza, clémentine, moules.
- **Alcool, charcuterie** : aucune accroche n'en cite. Vin blanc, lardons et jambon ont été retirés, ainsi que les plats qui en contiennent, comme les moules marinières et la lotte à l'armoricaine. Ce n'est pas une obligation légale, mais une question de cohérence avec l'app.

À faire relire par le juriste en même temps que le reste du module (revue, section A).
