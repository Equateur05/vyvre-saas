# -*- coding: utf-8 -*-
# Lot 5 : desserts (45), en-cas (15), 1 petit-déjeuner
D = 'dessert'; S = 'encas'
R('tartine_seigle_chevre_poire', 'Tartine de seigle, chèvre frais et poire', 'rye toast with fresh goat cheese, pear slices and walnuts', 'petit_dejeuner', 'nordique', 10, 2,
  "pain_seigle 100|pain de seigle|2 tranches; chevre_frais 60|chèvre frais; poire 150; noix 15|cerneaux de noix; miel 5",
  ["Griller le pain.", "Tartiner de chèvre frais.", "Couvrir de poire en lamelles, de noix et d'un filet de miel."])
R('pommes_four_cannelle_noix', 'Pommes au four, cannelle et noix', 'baked apples filled with walnuts and cinnamon', D, 'francaise', 35, 4,
  "pomme 600|pommes|4; noix 30|cerneaux de noix; cannelle 1|cannelle; miel 20; x:beurre 10|beurre",
  ["Évider les pommes.", "Garnir de noix concassées, miel, cannelle et une noisette de beurre.", "Cuire 30 minutes à 180 °C."])
R('poires_pochees_the_vanille', 'Poires pochées au thé et à la vanille', 'poached pears in vanilla tea syrup', D, 'francaise', 30, 4,
  "poire 600|poires|4; the_noir 600|thé noir infusé; vanille 2|gousse de vanille; x:sucre 30|sucre; citron 10|zeste de citron",
  ["Porter le thé à frémissement avec sucre, vanille fendue et zeste.", "Pocher les poires pelées 20 minutes.", "Servir tièdes ou froides avec un peu de sirop réduit."])
R('clafoutis_cerises', 'Clafoutis aux cerises, version légère', 'a golden cherry clafoutis in a ceramic dish', D, 'francaise', 40, 6,
  "cerise 500|cerises; oeuf 150|œufs|3; lait_demi_ecreme 300|lait; x:farine_t65 60|farine; x:sucre 50|sucre; vanille 1|vanille",
  ["Fouetter œufs, sucre, farine, lait et vanille.", "Verser sur les cerises dans un plat beurré.", "Cuire 30 minutes à 180 °C (appareil bien pris)."])
R('crumble_pomme_poire_avoine', 'Crumble pomme-poire aux flocons d’avoine', 'an apple pear crumble with an oat topping', D, 'francaise', 40, 6,
  "pomme 500|pommes; poire 400|poires; flocons_avoine 80|flocons d'avoine; x:beurre 50|beurre; x:sucre_roux 40|sucre roux; cannelle 1|cannelle",
  ["Couper les fruits en dés dans un plat, ajouter la cannelle.", "Sabler flocons, beurre et sucre du bout des doigts.", "Couvrir les fruits, cuire 30 minutes à 180 °C."])
R('compote_rhubarbe_fraise', 'Compote rhubarbe et fraise', 'a pink rhubarb strawberry compote in a glass', D, 'francaise', 20, 4,
  "rhubarbe 400|rhubarbe (tiges); fraise 300|fraises; x:sucre 40|sucre; vanille 1|vanille; yaourt_nature 250|yaourt nature",
  ["Cuire la rhubarbe en tronçons avec le sucre et la vanille 10 minutes.", "Ajouter les fraises coupées 3 minutes.", "Laisser refroidir, servir avec le yaourt."])
R('salade_fruits_hiver', 'Salade d’oranges, kiwis et grenade à la menthe', 'a winter fruit salad of orange, kiwi and pomegranate with mint', D, 'universelle', 15, 4,
  "orange 400|oranges; kiwi 300|kiwis; grenade 100|grains de grenade; menthe 5; citron 10|jus de citron",
  ["Peler à vif les oranges, trancher les kiwis.", "Mélanger avec les grains de grenade et le citron.", "Parsemer de menthe ciselée, servir frais."])
R('fraises_fromage_blanc_basilic', 'Fraises, fromage blanc et basilic', 'strawberries with fromage blanc and basil leaves', D, 'francaise', 15, 4,
  "fraise 500|fraises; fromage_blanc 300|fromage blanc; basilic 5; miel 15; citron 10|zeste de citron",
  ["Couper les fraises, les mélanger au miel et au zeste.", "Répartir le fromage blanc.", "Couvrir de fraises et de basilic ciselé."])
R('mousse_chocolat_aquafaba', 'Mousse au chocolat noir à l’aquafaba', 'a chocolate mousse in a small glass', D, 'francaise', 20, 4,
  "chocolat_noir_70 150|chocolat noir 70 %; x:aquafaba 120|jus de pois chiches en conserve (aquafaba); x:sucre 20|sucre; orange 20|zeste d'orange; cacao_poudre 5|cacao",
  ["Fondre le chocolat au bain-marie, laisser tiédir.", "Monter l'aquafaba en neige ferme, ajouter le sucre.", "Incorporer délicatement au chocolat avec le zeste ; réserver 3 heures au frais, saupoudrer de cacao."], notes=['Sans œuf cru : l’aquafaba remplace les blancs. Repos de 3 heures au réfrigérateur.'])
R('panna_cotta_agar_framboise', 'Panna cotta à l’agar et coulis de framboise', 'a vanilla panna cotta with raspberry coulis', D, 'mediterraneenne', 20, 4,
  "lait_demi_ecreme 400|lait; x:creme 100|crème fraîche légère; x:agar 2|agar-agar; x:sucre 30|sucre; vanille 1|vanille; framboise 200|framboises",
  ["Porter lait, crème, sucre, vanille et agar à ébullition 1 minute.", "Verser dans des verrines, réserver 2 heures au frais.", "Mixer les framboises en coulis et napper."])
R('figues_roties_miel_thym', 'Figues rôties au miel et au thym', 'roasted figs with honey and thyme, with Greek yogurt', D, 'mediterraneenne', 20, 4,
  "figue 400|figues|8; miel 20; thym 2; yaourt_grec 250|yaourt à la grecque; noix 20|cerneaux de noix",
  ["Inciser les figues en croix, les arroser de miel et de thym.", "Rôtir 12 minutes à 200 °C.", "Servir avec le yaourt et les noix."])
R('peches_roties_romarin', 'Pêches rôties au romarin, yaourt grec', 'roasted peach halves with rosemary and Greek yogurt', D, 'mediterraneenne', 25, 4,
  "peche 600|pêches|4; romarin 2; miel 15; yaourt_grec 250|yaourt à la grecque; amande 20|amandes effilées",
  ["Couper les pêches en deux, poser dans un plat avec romarin et miel.", "Rôtir 15 minutes à 200 °C.", "Servir avec le yaourt et les amandes grillées."])
R('abricots_rotis_amandes', 'Abricots rôtis aux amandes et à la vanille', 'roasted apricots with almonds and vanilla', D, 'francaise', 25, 4,
  "abricot 600|abricots; amande 30|amandes effilées; vanille 1|vanille; miel 15; fromage_blanc 200|fromage blanc",
  ["Couper les abricots en deux, les disposer avec vanille et miel.", "Rôtir 15 minutes à 190 °C, parsemer d'amandes les 5 dernières minutes.", "Servir avec le fromage blanc."])
R('yaourt_glace_fruits_rouges', 'Yaourt glacé minute aux fruits rouges', 'a scoop of frozen berry yogurt', D, 'universelle', 15, 4,
  "framboise 250|framboises surgelées; mure 150|mûres surgelées; yaourt_grec 250|yaourt à la grecque; miel 20; menthe 5",
  ["Mixer les fruits encore congelés avec le yaourt et le miel.", "Servir aussitôt (texture de glace) ou placer 30 minutes au congélateur.", "Décorer de menthe."])
R('granite_pasteque_citron_vert', 'Granité de pastèque au citron vert', 'a pink watermelon lime granita in a glass', D, 'mediterraneenne', 15, 4,
  "pasteque 800|pastèque (chair); citron_vert 30|jus de citron vert; menthe 5; miel 15",
  ["Mixer la pastèque avec le citron vert et le miel.", "Verser dans un plat, placer au congélateur.", "Gratter à la fourchette toutes les 30 minutes pendant 3 heures ; servir avec la menthe."], notes=['Temps de congélation : 3 heures (non compté).'])
R('sorbet_minute_mangue', 'Sorbet minute mangue et citron vert', 'a quick mango lime sorbet', D, 'latino', 15, 4,
  "mangue 400|mangue en dés surgelée; yaourt_nature 125|yaourt nature; citron_vert 20|jus de citron vert; miel 10",
  ["Mixer la mangue congelée avec le yaourt, le citron vert et le miel.", "Servir aussitôt."])
R('mahalabia', 'Mahalabia (crème de lait à la fleur d’oranger et pistaches)', 'a milk pudding with orange blossom and pistachios', D, 'orientale', 25, 4,
  "lait_demi_ecreme 500|lait; x:fecule 35|fécule de maïs; x:sucre 40|sucre; x:eau_fleur_oranger 10|eau de fleur d'oranger; pistache 20|pistaches",
  ["Délayer la fécule dans un peu de lait froid.", "Chauffer le reste du lait avec le sucre, ajouter la fécule et épaissir 3 minutes en remuant.", "Ajouter la fleur d'oranger, verser en coupes, réserver au frais ; parsemer de pistaches."])
R('kheer_cardamome', 'Riz au lait à la cardamome et aux pistaches (kheer)', 'a bowl of kheer rice pudding with cardamom and pistachios', D, 'asiatique', 40, 4,
  "x:riz_rond 80|riz rond; lait_demi_ecreme 700|lait; cardamome 1|cardamome; x:sucre 40|sucre; pistache 20|pistaches; raisin_sec 20|raisins secs",
  ["Cuire le riz dans le lait avec la cardamome 35 minutes à feu doux en remuant.", "Ajouter sucre et raisins en fin de cuisson.", "Servir tiède ou froid avec les pistaches."])
R('verrine_mangue_coco', 'Verrine mangue, coco et citron vert', 'a layered glass of mango and coconut yogurt with lime', D, 'asiatique', 15, 4,
  "mangue 400; yaourt_nature 250|yaourt nature; lait_coco 60|lait de coco; citron_vert 15|citron vert (zeste et jus); noix_coco_rapee 10|noix de coco râpée",
  ["Couper la mangue en dés, l'arroser de citron vert.", "Mélanger yaourt et lait de coco.", "Alterner en verrines, parsemer de coco râpée."])
R('bananes_roties_cannelle_coco', 'Bananes rôties à la cannelle et à la noix de coco', 'roasted bananas with cinnamon and toasted coconut', D, 'africaine', 20, 4,
  "banane 480|bananes|4; cannelle 1|cannelle; noix_coco_rapee 15|noix de coco râpée; citron_vert 15|jus de citron vert; yaourt_nature 250|yaourt nature",
  ["Fendre les bananes dans leur peau, arroser de citron vert et de cannelle.", "Cuire 15 minutes à 200 °C.", "Servir avec le yaourt et la coco grillée."])
R('gateau_banane_avoine', 'Gâteau banane et flocons d’avoine', 'a sliced banana oat loaf cake', D, 'universelle', 40, 8,
  "banane 360|bananes très mûres|3; oeuf 100|œufs|2; farine_complete 120|farine complète; flocons_avoine 60|flocons d'avoine; huile_colza 40|huile de colza; x:levure_chimique 8|levure chimique",
  ["Écraser les bananes, ajouter œufs et huile.", "Incorporer farine, flocons et levure.", "Cuire 35 minutes à 180 °C dans un moule à cake."])
R('flan_coco', 'Flan au lait de coco', 'a coconut flan with a light caramel top', D, 'latino', 40, 6,
  "oeuf 200|œufs|4; lait_coco 200|lait de coco; lait_demi_ecreme 300|lait; x:sucre 60|sucre; vanille 1|vanille",
  ["Fouetter œufs, sucre, laits et vanille.", "Verser dans des ramequins.", "Cuire 30 minutes au bain-marie à 170 °C (appareil bien pris) ; réserver au frais."])
R('arroz_con_leche', 'Riz au lait à la cannelle et au citron', 'a bowl of arroz con leche with cinnamon', D, 'latino', 40, 4,
  "x:riz_rond 80|riz rond; lait_demi_ecreme 700|lait; cannelle 2|bâton de cannelle; citron 10|zeste de citron; x:sucre 40|sucre",
  ["Cuire le riz dans le lait avec la cannelle et le zeste 35 minutes à feu doux en remuant.", "Ajouter le sucre.", "Servir tiède saupoudré de cannelle."])
R('papaye_citron_vert_coco', 'Papaye au citron vert et à la noix de coco', 'papaya boats with lime and coconut', D, 'latino', 15, 4,
  "papaye 600|papaye; citron_vert 30|citron vert; noix_coco_rapee 15|noix de coco râpée; menthe 5; yaourt_nature 250|yaourt nature",
  ["Épépiner la papaye, la couper en quartiers.", "Arroser de citron vert.", "Servir avec le yaourt, la coco et la menthe."])
R('ananas_roti_gingembre', 'Ananas rôti au gingembre et à la vanille', 'roasted pineapple slices with ginger and vanilla', D, 'asiatique', 25, 4,
  "ananas 600|ananas; gingembre 10|gingembre; vanille 1|vanille; miel 15; yaourt_grec 200|yaourt à la grecque",
  ["Trancher l'ananas, le disposer avec gingembre râpé, vanille et miel.", "Rôtir 15 minutes à 200 °C.", "Servir avec le yaourt."])
R('poires_chocolat', 'Poires pochées, sauce chocolat noir', 'poached pears with dark chocolate sauce', D, 'francaise', 25, 4,
  "poire 600|poires|4; chocolat_noir_70 60|chocolat noir 70 %; lait_demi_ecreme 60|lait; vanille 1|vanille",
  ["Pocher les poires pelées 15 minutes dans l'eau vanillée.", "Fondre le chocolat avec le lait.", "Napper les poires de sauce."])
R('gateau_fromage_blanc', 'Gâteau léger au fromage blanc et citron', 'a light lemon fromage blanc cake', D, 'francaise', 40, 8,
  "fromage_blanc 500|fromage blanc; oeuf 150|œufs|3; x:sucre 70|sucre; x:fecule 40|fécule de maïs; citron 40|citron (zeste et jus)",
  ["Fouetter œufs et sucre, ajouter fromage blanc, fécule, zeste et jus.", "Verser dans un moule chemisé.", "Cuire 35 minutes à 170 °C ; laisser refroidir."])
R('galette_sarrasin_pommes', 'Galette de sarrasin aux pommes poêlées et cannelle', 'a buckwheat crêpe with sautéed apples and cinnamon', D, 'francaise', 20, 4,
  "galette_sarrasin 240|galettes de sarrasin|4; pomme 400|pommes; cannelle 1|cannelle; miel 20; x:beurre 10|beurre",
  ["Poêler les pommes en lamelles dans le beurre 8 minutes avec la cannelle.", "Chauffer les galettes.", "Garnir de pommes, arroser de miel, plier."])
R('rodgrod_fruits_rouges', 'Compote épaisse de fruits rouges à la danoise (rødgrød)', 'a Danish red berry pudding with a splash of milk', D, 'nordique', 20, 4,
  "groseille 200|groseilles; framboise 200|framboises; fraise 200|fraises; x:sucre 40|sucre; x:fecule 20|fécule de pomme de terre ou de maïs; lait_demi_ecreme 200|lait froid",
  ["Cuire les fruits avec le sucre et un peu d'eau 8 minutes.", "Épaissir avec la fécule délayée, 2 minutes.", "Servir froid avec un filet de lait."])
R('tarte_myrtilles_amande', 'Croustillant aux myrtilles et amandes (façon blåbärspaj)', 'a Swedish blueberry crisp with almonds and oats', D, 'nordique', 40, 6,
  "myrtille 500|myrtilles (fraîches ou surgelées); flocons_avoine 80|flocons d'avoine; amande 40|poudre d'amande; x:beurre 50|beurre; x:sucre_roux 40|sucre roux",
  ["Disposer les myrtilles dans un plat.", "Sabler flocons, amande, beurre et sucre.", "Couvrir les fruits, cuire 30 minutes à 180 °C."])
R('brochettes_fruits_grilles', 'Brochettes de fruits grillés au citron vert', 'grilled skewers of pineapple, mango and banana with lime', D, 'latino', 20, 4,
  "ananas 300; mangue 300; banane 240|bananes|2; citron_vert 20|citron vert; miel 15; menthe 5",
  ["Couper les fruits en cubes, les piquer sur des brochettes.", "Badigeonner de miel et de citron vert.", "Griller 6 minutes, servir avec la menthe."])
R('mousse_mangue_yaourt', 'Mousse légère mangue et yaourt grec', 'a mango Greek yogurt mousse in a glass', D, 'asiatique', 15, 4,
  "mangue 400; yaourt_grec 300|yaourt à la grecque; citron_vert 15|jus de citron vert; miel 10; pistache 15|pistaches",
  ["Mixer la mangue avec le citron vert et le miel.", "Mélanger délicatement au yaourt en marbrant.", "Servir frais avec les pistaches."])
R('compote_pomme_coing', 'Compote pomme et coing', 'a golden apple and quince compote', D, 'francaise', 35, 4,
  "coing 400|coings; pomme 400|pommes; vanille 1|vanille; x:sucre 30|sucre; eau 150",
  ["Peler et couper coings et pommes.", "Cuire à couvert avec l'eau, le sucre et la vanille 30 minutes.", "Écraser et servir tiède ou froid."])
R('prunes_poelees_fromage_blanc', 'Prunes poêlées à la cannelle et fromage blanc', 'pan-roasted plums with cinnamon over fromage blanc', D, 'francaise', 20, 4,
  "prune 500|prunes; cannelle 1|cannelle; miel 15; fromage_blanc 300|fromage blanc; noisette 20|noisettes",
  ["Couper les prunes en deux, les poêler 6 minutes avec miel et cannelle.", "Répartir le fromage blanc.", "Couvrir de prunes tièdes et de noisettes concassées."])
R('tarte_fine_pommes', 'Tarte fine aux pommes', 'a thin apple tart with fanned apple slices', D, 'francaise', 40, 6,
  "x:pate_brisee_maison 250|pâte brisée maison (200 g de farine, 80 g de beurre, eau); pomme 600|pommes; x:sucre 20|sucre; cannelle 1|cannelle; citron 10|jus de citron",
  ["Étaler la pâte finement sur une plaque.", "Couvrir de fines lamelles de pommes arrosées de citron, saupoudrer de sucre et cannelle.", "Cuire 30 minutes à 200 °C."])
R('verrine_kiwi_yaourt_granola', 'Verrine kiwi, yaourt grec et granola', 'a glass layered with kiwi, Greek yogurt and granola', D, 'universelle', 15, 4,
  "kiwi 300|kiwis; yaourt_grec 300|yaourt à la grecque; flocons_avoine 60|flocons d'avoine grillés; amande 20|amandes; miel 15",
  ["Griller les flocons et les amandes concassées avec le miel 5 minutes à la poêle.", "Alterner yaourt et kiwis en dés.", "Parsemer de granola."])
R('oranges_safran_pistache', 'Oranges pochées au safran et pistaches', 'orange slices poached in saffron syrup with pistachios', D, 'orientale', 20, 4,
  "orange 600|oranges; safran 0.1|safran|1 pincée; miel 20; pistache 20|pistaches; cannelle 1|bâton de cannelle",
  ["Peler à vif les oranges, les trancher.", "Chauffer 150 mL d'eau avec miel, safran et cannelle 5 minutes.", "Verser sur les oranges, laisser refroidir, parsemer de pistaches."])
R('gateau_yaourt_pommes', 'Gâteau au yaourt et aux pommes', 'a French yogurt cake with apple slices', D, 'francaise', 40, 8,
  "yaourt_nature 125|yaourt nature|1 pot; oeuf 150|œufs|3; x:farine_t65 180|farine|2 pots de yaourt; x:sucre 100|sucre; huile_colza 50|huile de colza; pomme 300|pommes; x:levure_chimique 8|levure chimique",
  ["Mélanger yaourt, œufs, sucre, huile, farine et levure.", "Verser dans un moule, couvrir de pommes en lamelles.", "Cuire 35 minutes à 180 °C."])
R('litchis_passion_menthe', 'Litchis, fruit de la passion et menthe', 'peeled lychees with passion fruit pulp and mint', D, 'asiatique', 15, 4,
  "litchi 400|litchis; fruit_passion 100|fruits de la passion|4; citron_vert 10|jus de citron vert; menthe 5",
  ["Décortiquer et dénoyauter les litchis.", "Arroser de pulpe de fruit de la passion et de citron vert.", "Servir frais avec la menthe."])
R('mendiants_chocolat', 'Mendiants au chocolat noir, amandes et orange', 'dark chocolate discs with almonds, pistachios and orange zest', D, 'francaise', 25, 8,
  "chocolat_noir_70 150|chocolat noir 70 %; amande 30|amandes; pistache 20|pistaches; noisette 20|noisettes; orange 20|zeste d'orange",
  ["Fondre le chocolat au bain-marie.", "Déposer des petits disques sur papier cuisson.", "Garnir de fruits secs et de zeste, laisser durcir au frais."])
R('banane_chocolat_papillote', 'Banane en papillote, chocolat noir et noisettes', 'a banana baked in parchment with dark chocolate and hazelnuts', D, 'francaise', 20, 4,
  "banane 480|bananes|4; chocolat_noir_70 40|chocolat noir 70 %; noisette 20|noisettes; cannelle 1|cannelle",
  ["Fendre les bananes, glisser des carrés de chocolat et des noisettes.", "Envelopper dans du papier cuisson avec la cannelle.", "Cuire 12 minutes à 200 °C."])
R('gratin_fruits_rouges', 'Gratin de fruits rouges au fromage blanc', 'a warm red berry gratin with fromage blanc', D, 'francaise', 25, 4,
  "framboise 250|framboises; groseille 150|groseilles; fromage_blanc 250|fromage blanc; oeuf 50|œuf|1; x:sucre 30|sucre",
  ["Répartir les fruits dans des plats individuels.", "Mélanger fromage blanc, œuf et sucre, napper.", "Gratiner 12 minutes à 220 °C (appareil bien pris)."])
R('compote_abricot_amande', 'Compote d’abricots à la vanille et amandes', 'apricot compote with vanilla and toasted almonds', D, 'mediterraneenne', 20, 4,
  "abricot 600|abricots; vanille 1|vanille; miel 15; amande 20|amandes effilées; yaourt_nature 250|yaourt nature",
  ["Cuire les abricots en quartiers avec la vanille et 3 cuillères d'eau 10 minutes.", "Ajouter le miel.", "Servir avec le yaourt et les amandes grillées."])
R('salade_melon_framboise_menthe', 'Melon, framboises et menthe', 'melon balls with raspberries and mint', D, 'francaise', 15, 4,
  "melon 600|melon; framboise 125|framboises; menthe 5; citron_vert 10|jus de citron vert",
  ["Former des billes de melon.", "Mélanger avec les framboises et le citron vert.", "Parsemer de menthe, servir très frais."])
R('cerises_chocolat_amande', 'Cerises, chocolat noir râpé et amandes', 'fresh cherries with grated dark chocolate and almonds over yogurt', D, 'francaise', 15, 4,
  "cerise 400|cerises dénoyautées; yaourt_grec 250|yaourt à la grecque; chocolat_noir_70 20|chocolat noir 70 %; amande 20|amandes",
  ["Répartir le yaourt.", "Ajouter les cerises.", "Râper le chocolat par-dessus, parsemer d'amandes concassées."])
R('kaki_grenade_yaourt', 'Kaki, grenade et yaourt à la cannelle', 'ripe persimmon with pomegranate seeds and cinnamon yogurt', D, 'asiatique', 15, 4,
  "kaki 400|kakis mûrs; grenade 100|grains de grenade; yaourt_nature 250|yaourt nature; cannelle 1|cannelle; miel 10",
  ["Couper les kakis en quartiers.", "Mélanger yaourt, cannelle et miel.", "Dresser avec les grains de grenade."])
R('clementines_rotis_miel', 'Clémentines rôties au miel et à la cardamome', 'roasted clementine halves with honey and cardamom', D, 'mediterraneenne', 25, 4,
  "clementine 600|clémentines; miel 20; cardamome 1|cardamome; yaourt_grec 250|yaourt à la grecque; pistache 15|pistaches",
  ["Couper les clémentines en deux, les poser dans un plat avec miel et cardamome.", "Rôtir 15 minutes à 200 °C.", "Servir avec le yaourt et les pistaches."])
# ---- En-cas ----
R('batonnets_houmous_betterave', 'Houmous de betterave et bâtonnets de légumes', 'a pink beetroot hummus with vegetable sticks', S, 'orientale', 15, 4,
  "pois_chiche 250|pois chiches cuits; betterave 150|betterave cuite; tahin 20|tahin; citron 20|jus de citron; carotte 200|bâtonnets de carotte; concombre 200|bâtonnets de concombre",
  ["Mixer pois chiches, betterave, tahin, citron et sel.", "Couper les légumes en bâtonnets.", "Servir ensemble."])
R('dattes_farcies_noix', 'Dattes farcies aux noix', 'medjool dates stuffed with walnut halves', S, 'orientale', 5, 4,
  "datte 120|dattes|8; noix 30|cerneaux de noix; cannelle 0.5|cannelle; orange 10|zeste d'orange",
  ["Dénoyauter les dattes.", "Glisser un cerneau de noix dans chacune.", "Saupoudrer de cannelle et de zeste."], notes=['Sucres naturellement concentrés : 2 dattes par personne.'])
R('pois_chiches_rotis_paprika', 'Pois chiches rôtis au paprika', 'crunchy roasted chickpeas with paprika', S, 'mediterraneenne', 35, 4,
  "pois_chiche 400|pois chiches cuits; huile_olive 15|huile d'olive; paprika 3|paprika; cumin 1|cumin; x:sel 2|sel",
  ["Sécher les pois chiches dans un torchon.", "Mélanger avec huile, épices et sel.", "Rôtir 30 minutes à 200 °C en remuant ; laisser refroidir pour qu'ils croustillent."])
R('boules_energie_dattes_cacao', 'Bouchées dattes, cacao et amandes', 'no-bake date cocoa almond bites', S, 'universelle', 15, 8,
  "datte 150|dattes; amande 80|amandes; cacao_poudre 15|cacao non sucré; flocons_avoine 40|flocons d'avoine; noix_coco_rapee 10|noix de coco râpée",
  ["Mixer amandes et flocons.", "Ajouter dattes et cacao, mixer jusqu'à former une pâte.", "Façonner des billes, rouler dans la coco ; réserver au frais."])
R('pomme_beurre_cacahuete', 'Pomme et beurre de cacahuète', 'apple slices with peanut butter dip', S, 'universelle', 5, 2,
  "pomme 300|pommes; beurre_cacahuete 30|beurre de cacahuète; cannelle 0.5|cannelle; citron 5|jus de citron",
  ["Couper les pommes en quartiers, les arroser de citron.", "Servir avec le beurre de cacahuète saupoudré de cannelle."])
R('melange_fruits_coque_maison', 'Mélange maison noix, amandes et abricots secs', 'a small bowl of mixed nuts and dried apricots', S, 'universelle', 5, 6,
  "noix 40|cerneaux de noix; amande 40|amandes; noisette 40|noisettes; abricot_sec 60|abricots secs; graines_courge 30|graines de courge",
  ["Mélanger tous les ingrédients.", "Répartir en portions de 35 g environ.", "Conserver en bocal."])
R('crackers_graines', 'Crackers aux graines, au four', 'thin seeded crackers on parchment', S, 'nordique', 40, 8,
  "graines_lin 60|graines de lin; graines_courge 60|graines de courge; graines_tournesol 60|graines de tournesol; sesame 40|graines de sésame; graines_chia 20|graines de chia; eau 200; x:sel 3|sel",
  ["Mélanger graines, eau et sel, laisser gonfler 15 minutes.", "Étaler très finement sur papier cuisson.", "Cuire 25 minutes à 170 °C puis casser en morceaux."])
R('muffins_myrtilles_avoine', 'Muffins myrtilles et flocons d’avoine', 'blueberry oat muffins on a cooling rack', S, 'universelle', 35, 8,
  "myrtille 150|myrtilles; flocons_avoine 100|flocons d'avoine; farine_complete 100|farine complète; oeuf 100|œufs|2; yaourt_nature 125|yaourt nature; huile_colza 40|huile de colza; x:levure_chimique 8|levure chimique",
  ["Mélanger œufs, yaourt et huile ; ajouter farine, flocons et levure.", "Incorporer les myrtilles.", "Remplir 8 moules, cuire 20 minutes à 180 °C."])
R('chips_chou_kale', 'Chips de chou kale au four', 'crispy baked kale chips', S, 'universelle', 25, 4,
  "chou_frise 200|chou kale; huile_olive 15|huile d'olive; paprika 1|paprika; sesame 10|graines de sésame; x:sel 2|sel",
  ["Retirer les côtes, déchirer les feuilles, bien les sécher.", "Masser avec l'huile, le paprika et le sel.", "Cuire 15 minutes à 150 °C, parsemer de sésame."])
R('oeufs_durs_radis', 'Œufs durs, radis et fleur de sel', 'hard-boiled eggs with radishes and salt', S, 'francaise', 15, 2,
  "oeuf 200|œufs|4; radis 150|radis; ciboulette 5; pain_seigle 50|pain de seigle; x:sel 1|fleur de sel",
  ["Cuire les œufs 10 minutes, les refroidir et les écaler.", "Laver les radis.", "Servir avec le pain, la ciboulette et la fleur de sel."])
R('brochettes_tomate_mozzarella', 'Brochettes tomate cerise, mozzarella et basilic', 'cherry tomato, mozzarella and basil skewers', S, 'mediterraneenne', 10, 4,
  "tomate_cerise 250|tomates cerises; mozzarella 125|mini-mozzarellas; basilic 5; huile_olive 10|huile d'olive",
  ["Piquer tomate, basilic et mozzarella sur des piques.", "Arroser d'un filet d'huile, poivrer.", "Servir frais."])
R('barres_cereales_maison', 'Barres de céréales maison (flocons, miel, noix, abricots)', 'homemade oat bars with nuts and dried apricots', S, 'universelle', 35, 10,
  "flocons_avoine 200|flocons d'avoine; noix 50|cerneaux de noix; abricot_sec 80|abricots secs; miel 60; huile_colza 30|huile de colza; graines_tournesol 30|graines de tournesol",
  ["Mélanger flocons, noix, abricots en dés et graines.", "Chauffer miel et huile, verser, bien mélanger.", "Tasser dans un moule, cuire 20 minutes à 170 °C, couper froid."])
R('fromage_blanc_herbes_crudites', 'Fromage blanc aux herbes et crudités', 'herbed fromage blanc dip with raw vegetables', S, 'francaise', 10, 4,
  "fromage_blanc 250|fromage blanc; ciboulette 5; aneth 3; radis 150|radis; concombre 200; carotte 200",
  ["Mélanger fromage blanc, herbes ciselées, sel et poivre.", "Couper les légumes en bâtonnets.", "Servir ensemble."])
R('muhammara', 'Muhammara (tartinade poivron rouge et noix)', 'a red pepper and walnut muhammara spread with pita', S, 'orientale', 30, 4,
  "poivron_rouge 400|poivrons rouges; noix 60|cerneaux de noix; grenade 20|grains de grenade; cumin 1|cumin; huile_olive 15|huile d'olive; pain_pita 120|pain pita",
  ["Rôtir les poivrons 20 minutes à 220 °C, les peler.", "Mixer avec noix, cumin, huile et sel.", "Servir parsemé de grenade, avec le pita grillé."])
R('yaourt_poire_graines', 'Yaourt, poire et graines de courge', 'a small bowl of yogurt with pear and pumpkin seeds', S, 'universelle', 5, 2,
  "yaourt_nature 250|yaourt nature; poire 150; graines_courge 15|graines de courge; cannelle 0.5|cannelle",
  ["Couper la poire en dés.", "Ajouter au yaourt.", "Parsemer de graines et de cannelle."])
