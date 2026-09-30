# -*- coding: utf-8 -*-
# Lot 1 : jus, smoothies, boissons (50). Les jus se préparent à la centrifugeuse ou à l'extracteur ; les smoothies au blender.
J = 'jus_boisson'
R('jus_carotte_orange_gingembre', 'Jus carotte, orange et gingembre', 'a glass of bright orange carrot, orange and ginger juice', J, 'francaise', 10, 2,
  "carotte 300; orange 400|oranges; gingembre 10; citron 30|jus de citron|1/2 citron",
  ["Laver et éplucher les carottes, peler les oranges et le gingembre.", "Passer le tout à l'extracteur ou à la centrifugeuse.", "Ajouter le jus de citron, mélanger et servir frais."])
R('jus_pomme_celeri_concombre', 'Jus pomme, céleri et concombre', 'a glass of pale green apple, celery and cucumber juice', J, 'francaise', 10, 2,
  "pomme 300|pommes; celeri_branche 150|branches de céleri; concombre 200; citron 30|jus de citron; menthe 5|feuilles de menthe",
  ["Laver les légumes et les pommes, couper en morceaux.", "Passer à l'extracteur avec la menthe.", "Ajouter le citron et servir aussitôt."])
R('smoothie_betterave_pomme_framboise', 'Smoothie betterave, pomme et framboise', 'a deep magenta beetroot, apple and raspberry smoothie', J, 'francaise', 10, 2,
  "betterave 100|betterave cuite; pomme 200; framboise 125|framboises (fraîches ou surgelées); citron 30|jus de citron; eau 150",
  ["Couper la betterave et la pomme en morceaux.", "Mixer avec les framboises, le citron et l'eau jusqu'à consistance lisse.", "Servir frais."])
R('smoothie_kiwi_epinard_pomme', 'Smoothie kiwi, épinard et pomme', 'a vivid green kiwi, spinach and apple smoothie', J, 'francaise', 10, 2,
  "kiwi 200|kiwis; epinard 60|jeunes pousses d'épinard; pomme 200; citron 20|jus de citron; eau 150",
  ["Peler les kiwis, couper la pomme.", "Mixer avec les épinards lavés, le citron et l'eau.", "Servir aussitôt."])
R('smoothie_fraise_banane_yaourt', 'Smoothie fraise, banane et yaourt', 'a pink strawberry banana yogurt smoothie', J, 'francaise', 10, 2,
  "fraise 250|fraises; banane 120; yaourt_nature 250|yaourt nature|2 pots; menthe 5|feuilles de menthe",
  ["Équeuter les fraises, peler la banane.", "Mixer avec le yaourt et la menthe.", "Servir bien frais."], pas_jus=True)
R('lassi_mangue_cardamome', 'Lassi mangue et cardamome', 'a creamy mango lassi with a pinch of cardamom', J, 'asiatique', 10, 2,
  "mangue 200; yaourt_nature 250|yaourt nature; cardamome 1|cardamome moulue|1 pincée; citron_vert 10|jus de citron vert; eau 100",
  ["Peler la mangue et la couper en dés.", "Mixer avec le yaourt, l'eau, la cardamome et le citron vert.", "Servir frais."], pas_jus=True)
R('jus_pasteque_concombre_menthe', 'Jus pastèque, concombre et citron vert', 'a glass of pink watermelon, cucumber and lime juice with mint', J, 'mediterraneenne', 10, 2,
  "pasteque 600|pastèque (sans écorce); concombre 100; citron_vert 30|jus de citron vert; menthe 5|feuilles de menthe",
  ["Couper la pastèque et le concombre en morceaux.", "Mixer avec la menthe puis filtrer si on le souhaite.", "Ajouter le citron vert et servir frais."])
R('citronnade_menthe_miel', 'Citronnade maison à la menthe', 'a carafe of homemade lemonade with mint leaves', J, 'orientale', 10, 4,
  "citron 120|citrons (jus); menthe 10|feuilles de menthe; miel 20; gingembre 5|gingembre frais râpé; eau 800",
  ["Presser les citrons.", "Délayer le miel dans un peu d'eau tiède, ajouter le reste de l'eau froide.", "Ajouter jus de citron, gingembre et menthe froissée ; servir frais."])
R('the_glace_peche_romarin', 'Thé glacé pêche et romarin', 'a tall glass of iced black tea with peach slices and rosemary', J, 'francaise', 15, 4,
  "the_noir 800|thé noir infusé puis refroidi; peche 300|pêches; romarin 1|brin de romarin; citron 20|jus de citron; miel 10",
  ["Infuser le thé 4 minutes avec le romarin, retirer, laisser refroidir.", "Mixer la moitié des pêches avec le miel et le citron.", "Mélanger au thé, ajouter le reste des pêches en lamelles, servir frais."])
R('infusion_gingembre_citron_miel', 'Infusion gingembre, citron et miel', 'a steaming cup of ginger lemon infusion', J, 'universelle', 10, 2,
  "gingembre 15|gingembre frais en lamelles; citron 60|citron (jus et 2 rondelles); miel 20; cannelle 1|bâton de cannelle; eau 500",
  ["Porter l'eau à frémissement avec le gingembre et la cannelle, 5 minutes.", "Hors du feu, ajouter le jus de citron et le miel.", "Servir chaud ou tiède."], chaud=True)
R('lait_curcuma_cannelle', 'Lait chaud au curcuma et à la cannelle', 'a mug of golden turmeric milk dusted with cinnamon', J, 'asiatique', 10, 2,
  "lait_demi_ecreme 400|lait (ou boisson végétale enrichie en calcium); curcuma 2|curcuma en poudre; cannelle 1|cannelle en poudre; gingembre 5|gingembre frais râpé; poivre_noir 0.5|poivre noir|1 pincée; miel 10",
  ["Chauffer le lait avec les épices et le gingembre sans faire bouillir, 5 minutes.", "Filtrer, sucrer avec le miel.", "Servir chaud."], chaud=True)
R('smoothie_myrtille_banane_avoine', 'Smoothie myrtille, banane et avoine', 'a purple blueberry banana oat smoothie', J, 'nordique', 10, 2,
  "myrtille 150|myrtilles (fraîches ou surgelées); banane 120; flocons_avoine 30|flocons d'avoine; lait_demi_ecreme 300|lait (ou boisson végétale)",
  ["Mixer les flocons avec le lait 30 secondes.", "Ajouter la banane et les myrtilles, mixer jusqu'à consistance lisse.", "Servir aussitôt."], pas_jus=True)
R('smoothie_mangue_ananas_citron_vert', 'Smoothie mangue, ananas et citron vert', 'a sunny yellow mango pineapple smoothie with lime', J, 'latino', 10, 2,
  "mangue 200; ananas 200; citron_vert 20|jus de citron vert; menthe 5|feuilles de menthe; eau 200",
  ["Peler et couper les fruits.", "Mixer avec l'eau, le citron vert et la menthe.", "Servir frais."])
R('jus_clementine_carotte_curcuma', 'Jus clémentine, carotte et curcuma', 'a glass of orange clementine carrot juice with turmeric', J, 'francaise', 10, 2,
  "clementine 500|clémentines; carotte 200; curcuma 1|curcuma en poudre|1 pincée; citron 30|jus de citron",
  ["Peler les clémentines, éplucher les carottes.", "Passer à l'extracteur.", "Ajouter le curcuma et le citron, mélanger, servir."])
R('smoothie_poire_epinard_gingembre', 'Smoothie poire, épinard et gingembre', 'a pale green pear spinach ginger smoothie', J, 'francaise', 10, 2,
  "poire 300|poires mûres; epinard 50|jeunes pousses d'épinard; gingembre 5|gingembre frais; citron 20|jus de citron; eau 150",
  ["Couper les poires en morceaux.", "Mixer avec les épinards, le gingembre, le citron et l'eau.", "Servir aussitôt."])
R('jus_raisin_pomme_menthe', 'Jus raisin, pomme et menthe', 'a glass of purple grape and apple juice with mint', J, 'francaise', 10, 2,
  "raisin 300|raisin noir; pomme 300|pommes; citron 20|jus de citron; menthe 5|feuilles de menthe",
  ["Laver le raisin et les pommes.", "Passer à l'extracteur avec la menthe.", "Ajouter le citron et servir frais."])
R('smoothie_abricot_peche_amande', 'Smoothie abricot, pêche et amande', 'an apricot peach almond smoothie', J, 'mediterraneenne', 10, 2,
  "abricot 200|abricots; peche 200|pêche; amande 20|amandes; yaourt_nature 125|yaourt nature",
  ["Dénoyauter les fruits.", "Mixer les amandes finement, puis ajouter fruits et yaourt.", "Mixer et servir frais."], pas_jus=True)
R('agua_fresca_melon', 'Agua fresca melon et citron vert', 'a jar of pale orange melon agua fresca with lime', J, 'latino', 10, 4,
  "melon 500|melon (chair); citron_vert 30|jus de citron vert; menthe 5|feuilles de menthe; miel 10; eau 300",
  ["Mixer le melon avec l'eau.", "Filtrer, ajouter citron vert et miel.", "Servir très frais avec la menthe."])
R('agua_fresca_pasteque_fraise', 'Agua fresca pastèque et fraise', 'a jar of pink watermelon strawberry agua fresca', J, 'latino', 10, 4,
  "pasteque 400|pastèque (chair); fraise 150|fraises; citron_vert 20|jus de citron vert; menthe 5|feuilles de menthe; eau 200",
  ["Mixer la pastèque et les fraises avec l'eau.", "Filtrer, ajouter le citron vert.", "Servir très frais avec la menthe."])
R('smoothie_cassis_banane_kefir', 'Smoothie cassis, banane et kéfir', 'a deep purple blackcurrant banana kefir smoothie', J, 'nordique', 10, 2,
  "cassis 100|cassis (frais ou surgelé); banane 120; kefir 300|kéfir de lait; miel 10",
  ["Mixer tous les ingrédients jusqu'à consistance lisse.", "Goûter, ajuster le miel.", "Servir frais."], pas_jus=True)
R('smoothie_framboise_poire_chia', 'Smoothie framboise, poire et chia', 'a pink raspberry pear smoothie topped with chia seeds', J, 'universelle', 10, 2,
  "framboise 125|framboises; poire 150; graines_chia 10|graines de chia; boisson_amande 300|boisson à l'amande non sucrée",
  ["Mixer framboises, poire et boisson à l'amande.", "Ajouter les graines de chia, laisser gonfler 5 minutes.", "Mélanger et servir."], pas_jus=True)
R('jus_pomme_kiwi_menthe', 'Jus pomme, kiwi et menthe', 'a glass of green apple kiwi mint juice', J, 'francaise', 10, 2,
  "pomme 400|pommes; kiwi 200|kiwis; menthe 5|feuilles de menthe; citron 20|jus de citron",
  ["Peler les kiwis, couper les pommes.", "Passer à l'extracteur avec la menthe.", "Ajouter le citron et servir."])
R('smoothie_papaye_orange', 'Smoothie papaye, orange et gingembre', 'a coral papaya orange ginger smoothie', J, 'latino', 10, 2,
  "papaye 250; orange 300|oranges pressées; citron_vert 20|jus de citron vert; gingembre 5|gingembre frais",
  ["Épépiner et peler la papaye.", "Mixer avec le jus d'orange, le gingembre et le citron vert.", "Servir frais."])
R('jus_ananas_gingembre', 'Jus ananas, gingembre et citron vert', 'a glass of golden pineapple ginger juice', J, 'asiatique', 10, 2,
  "ananas 400; gingembre 10|gingembre frais; citron_vert 30|jus de citron vert; menthe 5|feuilles de menthe",
  ["Peler l'ananas et le gingembre.", "Passer à l'extracteur.", "Ajouter le citron vert et la menthe, servir frais."])
R('smoothie_goyave_banane', 'Smoothie goyave, banane et citron vert', 'a pink guava banana smoothie', J, 'latino', 10, 2,
  "goyave 200; banane 120; citron_vert 20|jus de citron vert; cannelle 0.5|cannelle|1 pincée; eau 200",
  ["Couper les goyaves, peler la banane.", "Mixer avec l'eau, la cannelle et le citron vert, filtrer les pépins.", "Servir frais."])
R('smoothie_cerise_yaourt_vanille', 'Smoothie cerise, yaourt et vanille', 'a deep red cherry vanilla yogurt smoothie', J, 'francaise', 10, 2,
  "cerise 250|cerises dénoyautées; yaourt_nature 250|yaourt nature; vanille 1|vanille|1/2 gousse; amande 15|amandes",
  ["Dénoyauter les cerises.", "Mixer avec le yaourt, les amandes et les grains de vanille.", "Servir frais."], pas_jus=True)
R('smoothie_prune_pomme_cannelle', 'Smoothie prune, pomme et cannelle', 'a plum apple cinnamon smoothie', J, 'francaise', 10, 2,
  "prune 250|prunes; pomme 200; cannelle 1|cannelle|1 pincée; yaourt_nature 125|yaourt nature",
  ["Dénoyauter les prunes, couper la pomme.", "Mixer avec le yaourt et la cannelle.", "Servir frais."], pas_jus=True)
R('smoothie_fruits_rouges_avoine', 'Smoothie fruits rouges et avoine', 'a red berry oat smoothie', J, 'universelle', 10, 2,
  "framboise 125|framboises (surgelées possibles); fraise 125|fraises; flocons_avoine 30|flocons d'avoine; lait_demi_ecreme 300|lait (ou boisson végétale)",
  ["Mixer les flocons avec le lait.", "Ajouter les fruits et mixer.", "Servir aussitôt."], pas_jus=True)
R('jus_grenade_orange', 'Jus grenade et orange', 'a glass of ruby pomegranate and orange juice', J, 'orientale', 10, 2,
  "grenade 200|grains de grenade; orange 400|oranges; citron 20|jus de citron; menthe 5|feuilles de menthe",
  ["Égrainer la grenade, presser les oranges.", "Mixer les grains de grenade puis filtrer.", "Mélanger les jus, ajouter citron et menthe."])
R('smoothie_kaki_clementine', 'Smoothie kaki, clémentine et gingembre', 'an orange persimmon clementine smoothie', J, 'asiatique', 10, 2,
  "kaki 200|kaki bien mûr; clementine 300|clémentines pressées; gingembre 5|gingembre frais; citron 20|jus de citron",
  ["Évider le kaki mûr à la cuillère.", "Mixer avec le jus de clémentine, le gingembre et le citron.", "Servir frais."])
R('smoothie_figue_banane_amande', 'Smoothie figue, banane et lait d’amande', 'a mauve fig banana almond milk smoothie', J, 'mediterraneenne', 10, 2,
  "figue 150|figues fraîches; banane 120; boisson_amande 300|boisson à l'amande non sucrée; cannelle 1|cannelle|1 pincée",
  ["Couper les figues en quatre, peler la banane.", "Mixer avec la boisson à l'amande et la cannelle.", "Servir frais."], pas_jus=True)
R('smoothie_chou_frise_pomme', 'Smoothie chou kale, pomme et citron', 'a bright green kale apple lemon smoothie', J, 'nordique', 10, 2,
  "chou_frise 50|feuilles de chou kale (sans les côtes); pomme 300|pommes; citron 30|jus de citron; gingembre 5|gingembre frais; eau 200",
  ["Retirer les côtes du chou.", "Mixer avec les pommes, le gingembre, le citron et l'eau.", "Filtrer si on le souhaite et servir."])
R('smoothie_avocat_epinard_banane', 'Smoothie avocat, épinard et banane', 'a creamy green avocado spinach banana smoothie', J, 'latino', 10, 2,
  "avocat 100|avocat (1/2); epinard 50|jeunes pousses d'épinard; banane 120; lait_demi_ecreme 300|lait (ou boisson végétale); citron_vert 10|jus de citron vert",
  ["Évider l'avocat, peler la banane.", "Mixer avec les épinards, le lait et le citron vert.", "Servir aussitôt."], pas_jus=True)
R('lassi_concombre_cumin', 'Lassi salé concombre et cumin', 'a frothy savory cucumber cumin lassi', J, 'asiatique', 10, 2,
  "yaourt_nature 300|yaourt nature; concombre 150; cumin 1|cumin grillé moulu|1 pincée; menthe 5|feuilles de menthe; eau 150; x:sel 1|sel|1 pincée",
  ["Faire griller le cumin à sec 1 minute puis le moudre.", "Mixer le yaourt, le concombre, la menthe, l'eau et le sel.", "Servir frais saupoudré de cumin."], pas_jus=True)
R('the_menthe_fraiche', 'Thé vert à la menthe fraîche, peu sucré', 'a Moroccan glass of mint green tea', J, 'orientale', 10, 4,
  "the_vert 800|thé vert infusé; menthe 15|bouquet de menthe fraîche; miel 15; citron 10|zeste et jus de citron",
  ["Infuser le thé 3 minutes.", "Ajouter la menthe et laisser infuser encore 3 minutes.", "Sucrer légèrement au miel, servir chaud ou refroidi."], chaud=True)
R('chocolat_chaud_cacao_cannelle', 'Chocolat chaud au cacao et à la cannelle', 'a mug of hot cocoa with a cinnamon stick', J, 'latino', 10, 2,
  "cacao_poudre 20|cacao en poudre non sucré; lait_demi_ecreme 400|lait; cannelle 1|bâton de cannelle; miel 15",
  ["Chauffer le lait avec la cannelle.", "Délayer le cacao dans un peu de lait chaud puis verser le reste en fouettant.", "Sucrer au miel et servir chaud."], chaud=True)
R('infusion_pomme_cannelle_badiane', 'Infusion pomme, cannelle et badiane', 'a cup of warm apple cinnamon star anise infusion', J, 'francaise', 15, 2,
  "pomme 150|pomme en lamelles; cannelle 1|bâton de cannelle; x:badiane 1|anis étoilé|1 étoile; miel 10; eau 500",
  ["Porter l'eau à frémissement avec la pomme et les épices, 10 minutes.", "Filtrer, sucrer au miel.", "Servir chaud."], chaud=True)
R('infusion_thym_citron', 'Infusion de thym au citron et au miel', 'a glass cup of thyme lemon infusion with honey', J, 'mediterraneenne', 10, 2,
  "thym 3|brins de thym frais; citron 40|citron (jus et zeste); miel 15; gingembre 5|gingembre frais; eau 500",
  ["Verser l'eau frémissante sur le thym et le gingembre, infuser 7 minutes.", "Filtrer, ajouter jus de citron et miel.", "Servir chaud."], chaud=True)
R('smoothie_carotte_mangue_orange', 'Smoothie carotte, mangue et orange', 'a vivid orange carrot mango smoothie', J, 'universelle', 10, 2,
  "carotte 150; mangue 150; orange 300|oranges pressées; gingembre 5|gingembre frais",
  ["Râper finement les carottes.", "Mixer avec la mangue, le jus d'orange et le gingembre.", "Servir frais."])
R('jus_tomate_celeri_basilic', 'Jus de tomate, céleri et basilic', 'a glass of fresh tomato juice with celery stick and basil', J, 'mediterraneenne', 10, 2,
  "tomate 500|tomates bien mûres; celeri_branche 100|branche de céleri; basilic 5|feuilles de basilic; citron 20|jus de citron; poivre_noir 0.5|poivre|1 pincée",
  ["Couper les tomates et le céleri.", "Mixer avec le basilic puis filtrer.", "Ajouter citron et poivre, servir frais."])
R('smoothie_mure_pomme_yaourt', 'Smoothie mûre, pomme et yaourt', 'a dark purple blackberry apple yogurt smoothie', J, 'francaise', 10, 2,
  "mure 125|mûres; pomme 200; yaourt_nature 125|yaourt nature; miel 10",
  ["Laver les mûres, couper la pomme.", "Mixer avec le yaourt et le miel.", "Filtrer les pépins si on le souhaite, servir."], pas_jus=True)
R('smoothie_groseille_framboise_banane', 'Smoothie groseille, framboise et banane', 'a bright red currant raspberry banana smoothie', J, 'francaise', 10, 2,
  "groseille 100|groseilles égrappées; framboise 100|framboises; banane 120; lait_demi_ecreme 250|lait (ou boisson végétale)",
  ["Égrapper les groseilles.", "Mixer avec les framboises, la banane et le lait.", "Servir frais."], pas_jus=True)
R('smoothie_litchi_poire', 'Smoothie litchi, poire et citron vert', 'a pale litchi pear lime smoothie', J, 'asiatique', 10, 2,
  "litchi 200|litchis décortiqués; poire 150; citron_vert 15|jus de citron vert; menthe 5|feuilles de menthe; eau 100",
  ["Décortiquer et dénoyauter les litchis.", "Mixer avec la poire, le citron vert, la menthe et l'eau.", "Servir frais."])
R('smoothie_banane_cacahuete_cacao', 'Smoothie banane, cacahuète et cacao', 'a chocolate peanut banana smoothie', J, 'africaine', 10, 2,
  "banane 120; beurre_cacahuete 20|beurre de cacahuète; cacao_poudre 10|cacao non sucré; lait_demi_ecreme 300|lait (ou boisson végétale)",
  ["Mixer tous les ingrédients jusqu'à consistance lisse.", "Servir aussitôt."], pas_jus=True)
R('smoothie_ananas_coco', 'Smoothie ananas, coco et citron vert', 'a creamy pineapple coconut lime smoothie', J, 'latino', 10, 2,
  "ananas 250; lait_coco 50|lait de coco; citron_vert 15|jus de citron vert; menthe 5|feuilles de menthe; eau 150",
  ["Couper l'ananas.", "Mixer avec le lait de coco, l'eau et le citron vert.", "Servir frais avec la menthe."])
R('boisson_gingembre_citron_vert', 'Limonade gingembre et citron vert', 'a sparkling ginger lime soda in a tall glass', J, 'africaine', 15, 4,
  "gingembre 30|gingembre frais; citron_vert 60|jus de citron vert; miel 30; menthe 5|feuilles de menthe; x:eau_gazeuse 600|eau gazeuse|600 mL",
  ["Râper le gingembre, le faire infuser 10 minutes dans 100 mL d'eau chaude avec le miel.", "Filtrer, laisser refroidir, ajouter le citron vert.", "Allonger d'eau gazeuse froide au moment de servir."])
R('smoothie_poire_noix_cannelle', 'Smoothie poire, noix et cannelle', 'a creamy pear walnut cinnamon smoothie', J, 'francaise', 10, 2,
  "poire 300|poires mûres; noix 20|cerneaux de noix; cannelle 1|cannelle|1 pincée; lait_demi_ecreme 300|lait (ou boisson végétale)",
  ["Mixer les noix avec le lait.", "Ajouter les poires et la cannelle, mixer.", "Servir frais."], pas_jus=True)
R('jus_pomme_fenouil', 'Jus pomme, fenouil et citron', 'a pale green apple fennel juice with fennel fronds', J, 'mediterraneenne', 10, 2,
  "pomme 400|pommes; fenouil 150|bulbe de fenouil; citron 20|jus de citron; menthe 5|feuilles de menthe",
  ["Couper pommes et fenouil.", "Passer à l'extracteur avec la menthe.", "Ajouter le citron et servir."])
R('kefir_fraise_basilic', 'Kéfir fraise et basilic', 'a pink strawberry kefir drink with basil leaf', J, 'universelle', 10, 2,
  "kefir 300|kéfir de lait; fraise 200|fraises; basilic 3|feuilles de basilic; miel 10",
  ["Équeuter les fraises.", "Mixer avec le kéfir, le basilic et le miel.", "Servir frais."], pas_jus=True)
R('smoothie_peche_framboise_the', 'Smoothie pêche, framboise et thé vert', 'a peach raspberry green tea smoothie', J, 'asiatique', 10, 2,
  "peche 250|pêches; framboise 100|framboises; the_vert 200|thé vert infusé et refroidi; miel 10",
  ["Infuser le thé, laisser refroidir.", "Mixer avec les pêches, les framboises et le miel.", "Servir frais."])
R('jus_orange_sanguine_carotte', 'Jus orange et carotte au citron vert', 'a glass of orange carrot juice with lime wedge', J, 'mediterraneenne', 10, 2,
  "orange 500|oranges; carotte 200; citron_vert 15|jus de citron vert; menthe 5|feuilles de menthe",
  ["Peler les oranges, éplucher les carottes.", "Passer à l'extracteur.", "Ajouter citron vert et menthe, servir."])
R('boisson_pomme_cannelle_cardamome', 'Boisson froide pomme, cannelle et cardamome', 'a chilled spiced apple drink with cinnamon stick', J, 'nordique', 15, 4,
  "pomme 400|pommes; cannelle 2|bâton de cannelle; citron 20|jus de citron; miel 15; cardamome 1|cardamome|2 gousses; eau 600",
  ["Cuire les pommes en morceaux 10 minutes dans l'eau avec les épices.", "Filtrer en pressant, ajouter citron et miel.", "Laisser refroidir, servir frais."])
