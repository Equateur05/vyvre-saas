# -*- coding: utf-8 -*-
"""Construit _nutrition/tendances.json : cartes « verdict » sur les modes alimentaires.
Références PubMed vérifiées via NCBI E-utilities (esummary / efetch) le 30/09/2026 ; sites officiels ouverts le même jour
(DOI EFSA contrôlés via l'API Crossref, le site Wiley bloquant les robots)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); NUT = os.path.dirname(HERE)
PM = 'https://pubmed.ncbi.nlm.nih.gov/%s/'
R = {
 'MYUNG25': ("Myung SK 2025, Am J Med (collagène en compléments et vieillissement cutané, méta-analyse de 23 ECR, 1 474 participants, analyse par financement)", PM % 40324552),
 'DEMIRANDA21': ("de Miranda RB 2021, Int J Dermatol (collagène hydrolysé et peau, méta-analyse de 19 ECR, financement non analysé)", PM % 33742704),
 'ALCOCK19': ("Alcock RD 2019, Int J Sport Nutr Exerc Metab (bouillons d'os : précurseurs du collagène faibles et variables)", PM % 29893587),
 'UE432': ("Règlement (UE) n° 432/2012, liste des allégations de santé autorisées", "https://eur-lex.europa.eu/eli/reg/2012/432/oj"),
 'EFSA_PROT': ("EFSA 2012, EFSA Journal (valeurs nutritionnelles de référence pour les protéines)", "https://doi.org/10.2903/j.efsa.2012.2557"),
 'OMS_SUCRES': ("OMS 2015, Guideline: sugars intake for adults and children", "https://www.who.int/publications/i/item/9789241549028"),
 'SHISHEHBOR17': ("Shishehbor F 2017, Diabetes Res Clin Pract (vinaigre et glycémie après le repas, méta-analyse d'essais)", PM % 28292654),
 'KONDO09': ("Kondo T 2009, Biosci Biotechnol Biochem (vinaigre et poids, ECR, auteurs salariés de Mizkan, fabricant de vinaigre)", PM % 19661687),
 'ABOUKHALIL24': ("Abou-Khalil R 2024, BMJ Nutr Prev Health (vinaigre de cidre et poids) : article rétracté en 2025", PM % 38966098),
 'ABOUKHALIL_RET': ("BMJ Nutr Prev Health 2025, avis de rétractation de l'essai Abou-Khalil 2024", PM % 41789013),
 'HILL05': ("Hill LL 2005, J Am Diet Assoc (lésion de l'œsophage par comprimé de vinaigre de cidre)", PM % 15983536),
 'LHOTTA98': ("Lhotta K 1998, Nephron (hypokaliémie avec de grandes quantités de vinaigre de cidre, cas)", PM % 9736833),
 'HLEBOWICZ07': ("Hlebowicz J 2007, BMC Gastroenterol (vinaigre de cidre et vidange gastrique, diabète de type 1 avec gastroparésie, pilote)", PM % 18093343),
 'MARSCHNER24': ("Marschner F 2024, J Dent (facteurs de risque de l'érosion dentaire, méta-analyse : aliments acides OR 2,40)", PM % 38552999),
 'FENTON16': ("Fenton TR 2016, BMJ Open (charge acide de l'alimentation, eau alcaline et cancer, revue systématique)", PM % 27297008),
 'CIQUAL': ("ANSES, table CIQUAL 2020 (jus de citron maison : 42,4 mg de vitamine C pour 100 g ; kombucha : 1,45 g de sucres pour 100 g)", "https://ciqual.anses.fr/"),
 'KLEIN15': ("Klein AV 2015, J Hum Nutr Diet (régimes « détox » : revue critique, aucun ECR chez l'humain)", PM % 25522674),
 'GETTING13': ("Getting JE 2013, Am J Med (néphropathie à l'oxalate après une cure de jus, cas et revue)", PM % 23830537),
 'MAKKAPATI18': ("Makkapati S 2018, Am J Kidney Dis (cure de smoothies verts et néphropathie aiguë à l'oxalate, cas)", PM % 29203127),
 'LIU22': ("Liu D 2022, N Engl J Med (restriction calorique avec ou sans fenêtre de 8 h, ECR de 12 mois, n=139)", PM % 35443107),
 'LOWE20': ("Lowe DA 2020, JAMA Intern Med (essai TREAT, fenêtre 16:8, 12 semaines, n=116)", PM % 32986097),
 'KAPP19': ("Kapp JM 2019, Ann Epidemiol (kombucha : revue systématique, une seule étude chez l'humain)", PM % 30527803),
 'CDC95': ("CDC 1995, MMWR (maladie grave inexpliquée, dont un décès, chez deux buveuses de kombucha maison, Iowa)", PM % 7476846),
 'HEINRICH11': ("Heinrich U 2011, J Nutr (boisson de polyphénols de thé vert, 1 402 mg de catéchines/j, ECR n=60)", PM % 21525260),
 'FARRAR15': ("Farrar MD 2015, Am J Clin Nutr (catéchines de thé vert, ECR n=50, sans effet)", PM % 26178731),
 'JANJUA09': ("Janjua R 2009, Dermatol Surg (polyphénols de thé vert pendant 2 ans, ECR, pas mieux que le placebo)", PM % 19469799),
 'EFSA_CATECHINES': ("EFSA 2018, EFSA Journal (sécurité des catéchines du thé vert)", "https://doi.org/10.2903/j.efsa.2018.5239"),
 'EFSA_CAFEINE': ("EFSA 2015, EFSA Journal (sécurité de la caféine)", "https://doi.org/10.2903/j.efsa.2015.4102"),
 'HURRELL99': ("Hurrell RF 1999, Br J Nutr (boissons riches en polyphénols et absorption du fer)", PM % 10999016),
 'LAM01': ("Lam AY 2001, Ann Pharmacother (interaction possible entre warfarine et baie de goji, cas)", PM % 11675844),
 'LARRAMENDI12': ("Larramendi CH 2012, J Investig Allergol Clin Immunol (baies de goji et risque allergique chez les allergiques alimentaires)", PM % 23101309),
 'NOBREGA09': ("Nóbrega AA 2009, Emerg Infect Dis (transmission orale de la maladie de Chagas par l'açaï, Brésil)", PM % 19331764),
 'ANSES_SPIRULINE': ("ANSES 2017, avis 2014-SA-0096 sur les compléments contenant de la spiruline", "https://www.anses.fr/fr/system/files/NUT2014SA0096.pdf"),
 'SERBAN16': ("Serban MC 2016, Clin Nutr (spiruline en complément et lipides sanguins, méta-analyse de 7 ECR)", PM % 26433766),
 'VOLLONO19': ("Vollono L 2019, Nutrients (curcumine et maladies de peau, revue ; formes topiques et compléments)", PM % 31509968),
 'ANAND07': ("Anand P 2007, Mol Pharm (faible biodisponibilité de la curcumine, revue)", PM % 17999464),
 'ANSES_CURCUMA': ("ANSES 2022, avis révisé sur les compléments alimentaires contenant du curcuma", "https://www.anses.fr/fr/content/avis-revise-de-lanses-relatif-levaluation-des-risques-relatifs-la-consommation-de"),
 'VILJOEN14': ("Viljoen E 2014, Nutr J (gingembre et nausées de grossesse, méta-analyse de 12 ECR, 1 278 femmes, qualité faible)", PM % 24642205),
 'WASTYK21': ("Wastyk HC 2021, Cell (régime riche en aliments fermentés, 17 semaines, 2 bras de 18 adultes : microbiote et marqueurs d'inflammation)", PM % 34256014),
 'LEE15': ("Lee DE 2015, J Microbiol Biotechnol (probiotique L. plantarum HY7714 en gélules, ECR n=110, auteurs Korea Yakult)", PM % 26428734),
 'PALMA15': ("Palma L 2015, Clin Cosmet Investig Dermatol (eau et hydratation cutanée, n=49, non randomisé)", PM % 26345226),
 'AKDENIZ18': ("Akdeniz M 2018, Skin Res Technol (apports hydriques et hydratation cutanée, revue systématique, preuves faibles)", PM % 29392767),
 'EFSA_EAU': ("EFSA 2010, EFSA Journal (valeurs de référence pour l'eau : 2,0 L/j pour les femmes, 2,5 L/j pour les hommes, toutes sources)", "https://doi.org/10.2903/j.efsa.2010.1459"),
 'DANBY10': ("Danby FW 2010, Clin Dermatol (sucre, glycation et vieillissement cutané, revue)", PM % 20620757),
 'NOORDAM13': ("Noordam R 2013, Age (glycémie et âge perçu, Leiden Longevity Study, n=602)", PM % 22102339),
 'SMITH07': ("Smith RN 2007, Am J Clin Nutr (régime à faible charge glycémique et acné, ECR n=43)", PM % 17616769),
 'KWON12': ("Kwon HH 2012, Acta Derm Venereol (faible charge glycémique et acné, ECR n=32)", PM % 22678562),
 'CAPERTON14': ("Caperton C 2014, J Clin Aesthet Dermatol (cacao pur en gélules et acné, ECR en double aveugle, 14 hommes)", PM % 24847404),
 'DELOST16': ("Delost GR 2016, J Am Acad Dermatol (chocolat au lait contre bonbons de même charge glycémique, essai croisé, 54 étudiants)", PM % 27317522),
 'VONGRA16': ("Vongraviopap S 2016, Int J Dermatol (chocolat noir 99 % et acné, 25 hommes, sans groupe témoin)", PM % 26711092),
 'JUHL18': ("Juhl CR 2018, Nutrients (laitiers et acné, méta-analyse d'observation, 78 529 jeunes)", PM % 30096883),
 'AGHASI19': ("Aghasi M 2019, Clin Nutr (laitiers et acné, méta-analyse d'observation)", PM % 29778512),
 'MANSON19': ("Manson JE 2019, N Engl J Med (essai VITAL : oméga-3 1 g/j contre placebo, 25 871 participants, 5,3 ans)", PM % 30415637),
 'ABDELHAMID20': ("Abdelhamid AS 2020, Cochrane Database Syst Rev (oméga-3 et prévention cardiovasculaire, 86 ECR)", PM % 32114706),
 'GENCER21': ("Gencer B 2021, Circulation (oméga-3 en compléments et fibrillation atriale, méta-analyse de 7 ECR)", PM % 34612056),
 'RHODES03': ("Rhodes LE 2003, Carcinogenesis (EPA 4 g/j en complément et coup de soleil, ECR n=42)", PM % 12771037),
 'JAYEDI18': ("Jayedi A 2018, Public Health Nutr (poisson et mortalité, méta-analyse de cohortes)", PM % 29317009),
 'ANSES_POISSONS': ("ANSES, fiche Poissons : conseils de consommation (poissons prédateurs, grossesse)", "https://www.anses.fr/system/files/ANSES-Ft-RecosPoissons.pdf"),
 'PNNS': ("Santé publique France 2019, recommandations PNNS pour les adultes", "https://www.mangerbouger.fr/ressources-pros/elaboration-des-recommandations-nutritionnelles/les-recommandations-adultes-alimentation-activite-physique-et-sedentarite"),
 'PULLAR17': ("Pullar JM 2017, Nutrients (rôles de la vitamine C dans la peau, revue)", PM % 28805671),
 'COSGROVE07': ("Cosgrove MC 2007, Am J Clin Nutr (apports alimentaires et aspect de la peau, transversal, 4 025 femmes, auteurs Unilever)", PM % 17921406),
}
T = []
def C(id, titre, accroche, verdict, texte, faire, prudence, ids, refs):
    T.append({'id': id, 'titre': titre, 'accroche': accroche, 'verdict': verdict, 'verdict_texte': texte, 'ce_quon_peut_faire': faire, 'prudence': prudence,
              'aliment_ids': ids, 'etudes': [{'ref': R[k][0], 'lien': R[k][1]} for k in refs]})
VITC = "« La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau. »"

C('collagene', "Collagène en poudre, en boisson ou en bouillon d'os", "Le collagène à boire", 'pas_demontre',
  "Tous essais confondus, les compléments de collagène semblent agir sur l'hydratation et les rides. Mais la méta-analyse la plus rigoureuse (23 essais, 2025) ne trouve plus aucun effet dans les études non financées par l'industrie, ni dans celles de bonne qualité. Le bouillon d'os, lui, apporte des précurseurs du collagène en quantités faibles et très variables ; aucune allégation européenne n'est autorisée pour le collagène.",
  "Des protéines variées à chaque repas, et des fruits et légumes sources de vitamine C : " + VITC,
  "Poudres et boissons sont des compléments, souvent aromatisés ou sucrés : lire l'étiquette ; les bouillons sont souvent très salés.",
  ['bouillon_pot_au_feu', 'kiwi', 'poivron_rouge'], ['MYUNG25', 'DEMIRANDA21', 'ALCOCK19', 'UE432'])
C('smoothies_los_angeles', "Les smoothies « à la Los Angeles »", "Le verre qui promet tout", 'pas_demontre',
  "Aucun essai n'a testé sur la peau ces mélanges de fruits, de protéines en poudre, de collagène ou de poudres de plantes. Le collagène ajouté n'a pas d'effet démontré dans les études indépendantes, et le repère de protéines (0,83 g par kilo et par jour chez l'adulte, EFSA) est en général atteint par l'alimentation habituelle en Europe. Les jus de fruits ajoutés comptent comme sucres libres pour l'OMS.",
  "Préférez les fruits entiers et gardez la protéine dans l'assiette (œuf, yaourt, légumineuses) ; si vous aimez le smoothie, faites-le maison, sans poudre ni jus ajouté.",
  "Les poudres de plantes sont des compléments, avec des interactions possibles : grossesse, traitement ou maladie, demandez l'avis du pharmacien.",
  ['myrtille', 'kiwi', 'yaourt_nature', 'flocons_avoine'], ['MYUNG25', 'EFSA_PROT', 'OMS_SUCRES'])
C('vinaigre_cidre', "Le vinaigre de cidre à jeun", "Une cuillère avant le repas", 'pas_demontre',
  "Pris avec un repas, le vinaigre a un peu réduit la hausse de la glycémie qui suit ce repas, dans de petits essais (méta-analyse 2017). Pour le poids, l'essai le plus cité a été mené par les chercheurs d'un fabricant de vinaigre, et un essai récent très relayé a été rétracté en 2025. Aucune étude sur la peau.",
  "En vinaigrette sur des crudités, au cours du repas : c'est la façon la plus simple et la plus sûre de l'utiliser.",
  "Jamais pur ni en « shot » : acide pour l'émail des dents et l'œsophage. Sous diurétique, insuline ou digoxine, ou en cas de diabète avec vidange lente de l'estomac, avis médical.",
  ['vinaigre_cidre'], ['SHISHEHBOR17', 'KONDO09', 'ABOUKHALIL24', 'ABOUKHALIL_RET', 'HLEBOWICZ07', 'HILL05', 'LHOTTA98', 'MARSCHNER24'])
C('eau_citronnee', "L'eau citronnée au réveil", "Un rituel, pas un remède", 'pas_demontre',
  "Aucune étude n'a montré que l'eau citronnée « alcalinise » le corps, accélère le métabolisme ou purifie la peau ; une revue systématique ne trouve pas d'appui à l'idée d'une alimentation « alcalinisante ». Une cuillère à soupe de jus de citron apporte environ 6 mg de vitamine C (CIQUAL) : l'essentiel, c'est le verre d'eau.",
  "Si ce verre vous aide à boire le matin, gardez-le : c'est de l'eau en plus, avec du goût.",
  "Acide pour l'émail : les aliments et boissons acides sont associés à l'érosion dentaire ; reflux gastrique, à éviter s'il vous gêne.",
  ['citron', 'eau'], ['FENTON16', 'MARSCHNER24', 'CIQUAL'])
C('jus_detox', "Les cures de jus « détox »", "Nettoyer l'intérieur ?", 'deconseille',
  "L'idée d'une cure « détox » n'a aucune base scientifique : aucun essai randomisé n'a évalué ces programmes chez l'humain, et le foie et les reins assurent déjà l'élimination. Ces cures remplacent des repas par des boissons pauvres en protéines et en fibres, souvent riches en sucres ; des atteintes rénales aiguës ont été décrites après des cures de jus ou de smoothies verts riches en oxalates.",
  "Mangez les fruits et légumes entiers et variés, dans des repas complets.",
  "Maladie rénale, diabète, grossesse, traitement quotidien ou antécédent de trouble du comportement alimentaire : aucune cure sans avis médical.",
  [], ['KLEIN15', 'GETTING13', 'MAKKAPATI18', 'OMS_SUCRES'])
C('jeune_intermittent', "Le jeûne intermittent (16:8 et autres fenêtres)", "Manger moins souvent", 'pas_demontre',
  "Dans les essais randomisés, manger sur une fenêtre de 8 heures ne fait pas perdre plus qu'une simple réduction des calories : 8,0 contre 6,3 kg en un an, écart non significatif (NEJM 2022) ; un autre essai de 12 semaines ne trouve aucune différence avec trois repas par jour. Aucun effet sur la peau n'a été étudié.",
  "Des repas à heures régulières suffisent ; si une fenêtre vous convient et reste facile, rien n'oblige à l'abandonner, mais elle n'apporte rien de démontré en plus.",
  "Jamais chez les mineurs, pendant la grossesse ou l'allaitement, en cas de diabète traité ou d'antécédent de trouble du comportement alimentaire.",
  [], ['LIU22', 'LOWE20'])
C('kombucha', "Le kombucha", "Le thé qui pétille", 'pas_demontre',
  "Une revue systématique de 310 articles n'a trouvé qu'une seule étude menée chez l'humain : les bienfaits annoncés reposent sur des travaux de laboratoire ou chez l'animal. Rien n'est démontré chez l'humain pour la peau ni pour le microbiote avec le kombucha lui-même.",
  "Si vous l'aimez, c'est une boisson plaisir, peu sucrée en version nature (1,5 g de sucres pour 100 g, CIQUAL) ; vyvre ne la propose pas dans l'assiette.",
  "Souvent non pasteurisé et légèrement alcoolisé : par prudence, pas pendant la grossesse ou l'allaitement, chez l'enfant ni en cas d'immunodépression ; des cas graves ont été rapportés avec du kombucha maison (CDC, 1995).",
  [], ['KAPP19', 'CDC95', 'CIQUAL'])
C('matcha', "Le matcha", "Le thé vert en poudre", 'pas_demontre',
  "Le matcha est une feuille de thé vert moulue, bue entière ; il n'a pas de fiche dans la table CIQUAL. Pour la peau, les essais sur le thé vert se contredisent : une boisson très concentrée (1 402 mg de catéchines par jour) a réduit de 25 % la rougeur après UV, mais deux autres essais, dont un de 2 ans, n'ont trouvé aucun effet.",
  "Une ou deux tasses comme boisson plaisir, à la place d'une boisson sucrée ; le thé vert infusé est une alternative plus économique.",
  "Contient de la caféine (grossesse : au plus 200 mg par jour toutes sources, EFSA) et réduit l'absorption du fer ; jamais d'extrait de thé vert en gélules (atteintes du foie à partir de 800 mg d'EGCG par jour, EFSA 2018).",
  ['the_vert'], ['HEINRICH11', 'FARRAR15', 'JANJUA09', 'EFSA_CATECHINES', 'EFSA_CAFEINE', 'HURRELL99'])
C('goji_acai', "Goji et açaï", "Les baies venues de loin", 'pas_demontre',
  "Aucun essai clinique n'a évalué la baie de goji ni l'açaï sur la peau : les promesses reposent sur des mesures en laboratoire. Ni l'une ni l'autre ne figurent dans la table CIQUAL, et rien ne montre qu'elles valent mieux que les baies d'ici.",
  "Une poignée de fruits rouges de saison, ou surgelés nature le reste de l'année.",
  "Goji : interaction décrite avec la warfarine et risque d'allergie chez les personnes déjà allergiques à d'autres aliments. Açaï : jamais de pulpe non pasteurisée (transmission de la maladie de Chagas décrite au Brésil).",
  ['myrtille', 'cassis', 'mure', 'framboise'], ['LAM01', 'LARRAMENDI12', 'NOBREGA09'])
C('spiruline', "La spiruline", "La poudre bleu-vert", 'pas_demontre',
  "Aucun essai n'a mesuré d'effet de la spiruline sur la peau. En complément, elle a baissé le cholestérol dans une méta-analyse de 7 petits essais ; sa vitamine B12 est surtout une forme inactive (ANSES). Riche en protéines pour 100 g, elle se prend par cuillerée de 3 g : l'apport reste modeste.",
  "Si vous l'aimez, une cuillère à café d'origine tracée, sans en attendre d'effet sur la peau.",
  "Déconseillée en cas de phénylcétonurie ou de terrain allergique ; contaminations possibles par des métaux lourds et des toxines (ANSES 2017) ; thyroïde, grossesse, enfant : avis médical.",
  ['spiruline'], ['ANSES_SPIRULINE', 'SERBAN16'])
C('curcuma', "Le curcuma et le « golden latte »", "L'or des épices", 'pas_demontre',
  "Les effets cutanés étudiés concernent la curcumine concentrée, en gélules ou en gel, pas l'épice ; et la curcumine est très mal absorbée par l'intestin. Aucun essai n'a testé le curcuma de cuisine ni le « golden latte » sur la peau.",
  "En cuisine, pour le goût et la couleur : currys, soupes, légumes rôtis.",
  "Les compléments de curcuma ne sont pas l'épice : l'ANSES a recensé des hépatites et des interactions (anticoagulants notamment) ; en cuisine, aucune restriction connue.",
  ['curcuma'], ['VOLLONO19', 'ANAND07', 'ANSES_CURCUMA'])
C('gingembre', "Les shots de gingembre", "Le petit verre piquant", 'pas_demontre',
  "Le gingembre n'a un effet documenté que sur un terrain : en gélules, il a un peu réduit les nausées de grossesse (pas les vomissements) dans 12 essais de faible qualité. Rien n'est démontré pour l'immunité, l'élimination ou la peau.",
  "Frais et râpé dans un plat, une infusion ou une vinaigrette, pour le goût.",
  "Les shots sont acides et piquants (émail, estomac sensible) ; sous anticoagulant, pas de compléments de gingembre sans avis ; grossesse : gélules seulement sur avis médical.",
  ['gingembre'], ['VILJOEN14'])
C('fermentes_probiotiques', "Probiotiques et aliments fermentés", "Kéfir, choucroute et compagnie", 'plausible',
  "Dans un essai de 17 semaines, un régime riche en aliments fermentés a augmenté la diversité du microbiote et baissé plusieurs marqueurs d'inflammation, sur 18 adultes par groupe. Pour la peau, les résultats positifs concernent des souches précises en gélules, souvent financées par le fabricant, pas le yaourt ni le kéfir ; aucune allégation n'est autorisée pour les probiotiques.",
  "Un yaourt nature ou un kéfir, et de temps en temps de la choucroute crue ou du miso, dans une alimentation variée.",
  "Choucroute et miso sont salés ; kéfir maison au lait cru à éviter pendant la grossesse ; immunodépression : pas de probiotiques en gélules sans avis médical.",
  ['kefir', 'yaourt_nature', 'choucroute', 'miso', 'tempeh'], ['WASTYK21', 'LEE15'])
C('eau_deux_litres', "Boire 2 litres d'eau pour la peau", "L'hydratation par le verre", 'pas_demontre',
  "Boire davantage n'a augmenté un peu l'hydratation de la peau que chez les personnes qui buvaient peu, dans de petites études non randomisées ; une revue systématique juge ces preuves faibles, et aucun effet sur les rides n'est démontré. Les 2 litres de l'EFSA (femmes ; 2,5 litres pour les hommes) comptent toute l'eau, y compris celle des aliments.",
  "Boire selon sa soif, surtout de l'eau, un peu plus quand il fait chaud ou après l'effort ; l'hydratation de surface dépend d'abord des soins et de l'environnement.",
  "Insuffisance cardiaque ou rénale : la quantité d'eau se fixe avec le médecin.",
  ['eau', 'tisane'], ['PALMA15', 'AKDENIZ18', 'EFSA_EAU'])
C('sucre_glycation', "Sucre et peau : la glycation", "Quand le sucre caramélise", 'plausible',
  "Le sucre peut se fixer sur le collagène (glycation) : le mécanisme est solide au laboratoire, mais aucun essai n'a montré qu'en manger moins change l'aspect de la peau. Dans une cohorte néerlandaise, chaque mmol/L de glycémie en plus correspondait à 0,4 an d'âge perçu en plus ; un régime à faible charge glycémique a réduit les lésions d'acné dans deux petits essais.",
  "Moins de sucres ajoutés et de boissons sucrées, plus de légumineuses et de céréales complètes, comme le conseille le PNNS.",
  "Diabète : tout changement d'alimentation se discute avec le médecin.",
  ['lentille', 'pois_chiche', 'flocons_avoine', 'pain_complet'], ['DANBY10', 'NOORDAM13', 'SMITH07', 'KWON12', 'OMS_SUCRES', 'PNNS'])
C('chocolat_acne', "Chocolat et acné", "Coupable ou innocent ?", 'plausible',
  "Trois petits essais vont dans le même sens : un peu plus de boutons, en 2 jours à 4 semaines, après du chocolat au lait, du chocolat noir ou du cacao pur, chez de jeunes adultes (13 à 54 participants). Ces études sont très courtes, parfois sans groupe témoin, et ne disent pas si c'est le cacao, le lait ou le sucre qui compte.",
  "Si vous avez de l'acné, observez votre propre réaction : le chocolat reste un plaisir à garder raisonnable, pas un aliment à bannir.",
  "Acné douloureuse, nodulaire ou apparue brutalement à l'âge adulte : parlez-en à un médecin ou un dermatologue.",
  ['chocolat_noir_70', 'cacao_poudre'], ['CAPERTON14', 'DELOST16', 'VONGRA16'])
C('laitiers_acne', "Produits laitiers et acné", "Le lait sur le banc des accusés", 'plausible',
  "Les méta-analyses d'études d'observation associent les laitiers, surtout le lait, à plus d'acné (rapport de cotes de 1,25 pour l'ensemble des laitiers dans l'une, 1,48 pour le lait dans l'autre) ; les résultats divergent pour le yaourt et le fromage. Aucun essai n'a testé l'arrêt des laitiers, et un auteur d'une des méta-analyses a reçu une bourse de la filière laitière danoise.",
  "Ne supprimez pas les laitiers sans remplacer le calcium (boissons végétales enrichies, eaux riches en calcium, légumes verts) ; parlez-en si vous pensez y réagir.",
  "Adolescents : pas d'éviction sans avis médical ; acné sévère : consulter.",
  ['yaourt_nature', 'lait_demi_ecreme', 'fromage_blanc', 'boisson_soja_calcium'], ['JUHL18', 'AGHASI19'])
C('omega3_poisson_gelules', "Oméga-3 : poisson ou gélules ?", "Le gras qui fait débat", 'pas_demontre',
  "Chez l'adulte en bonne santé, les gélules d'huile de poisson n'ont réduit ni les accidents cardiovasculaires ni les cancers dans le grand essai VITAL (25 871 personnes, 5 ans), et la revue Cochrane ne trouve pas d'effet sur la mortalité totale. Elles sont associées à 25 % de fibrillation atriale en plus, davantage au-delà de 1 g par jour ; les effets cutanés n'ont été vus qu'à des doses de compléments (4 g par jour).",
  "Du poisson deux fois par semaine, dont un poisson gras (sardine, maquereau, hareng), comme le conseille le PNNS.",
  "Pas de gélules à forte dose sans avis médical ; grossesse : éviter les grands prédateurs (espadon, requin, marlin) mais garder deux portions de poisson par semaine (ANSES).",
  ['sardine', 'maquereau', 'hareng', 'saumon', 'anchois'], ['MANSON19', 'ABDELHAMID20', 'GENCER21', 'RHODES03', 'JAYEDI18', 'ANSES_POISSONS', 'PNNS'])
C('vitamine_c_assiette', "La vitamine C dans l'assiette", "Le kiwi plutôt que la gélule", 'prouve',
  "C'est l'une des rares allégations autorisées pour la peau : " + VITC + " Un effet visible sur les rides n'est en revanche montré que par des études d'observation (moins d'aspect ridé chez les plus fortes consommatrices, 4 025 Américaines), dont les auteurs travaillaient pour Unilever.",
  "Un kiwi, une orange, du poivron cru, du cassis ou du brocoli chaque jour : une portion suffit souvent à atteindre les 80 mg de référence.",
  None,
  ['kiwi', 'poivron_rouge', 'cassis', 'orange', 'fraise', 'brocoli', 'chou_frise'], ['UE432', 'PULLAR17', 'COSGROVE07'])

# Contrôles : identifiants d'aliments existants, vocabulaire interdit
ids = {a['id'] for a in json.load(open(os.path.join(NUT, 'aliments_v3.json'), encoding='utf-8'))['aliments']}
for t in T:
    for i in t['aliment_ids']: assert i in ids, (t['id'], i)
    txt = ' '.join(str(v) for k, v in t.items() if k in ('titre', 'accroche', 'verdict_texte', 'ce_quon_peut_faire', 'prudence'))
    assert not re.search(r'superaliment|anti-âge|antiâge|booste|rajeun|brûle', txt, re.I), t['id']
    assert not re.search(r'(?<!« )d[ée]tox', txt, re.I), t['id']  # « détox » seulement entre guillemets
meta = {'version': '1.0', 'date': '2026-09-30',
 'description': "Cartes « verdict » sur les modes alimentaires, pour l'écran Tendances de vyvre. Chaque carte dit ce que montrent les meilleures preuves disponibles, en mots simples, avec la taille de l'effet quand elle existe et les conflits d'intérêts connus.",
 'verdicts': {'prouve': "Rôle établi (allégation européenne autorisée ou plusieurs essais concordants).", 'plausible': "Des essais ou des études d'observation vont dans le même sens, mais petits, courts ou non causaux.", 'pas_demontre': "Pas de preuve chez l'humain pour la promesse de la mode, ou preuves contradictoires, ou effet qui disparaît dans les études indépendantes.", 'deconseille': "Aucune base scientifique et des risques documentés."},
 'regles_texte': "Jamais « superaliment », « anti-âge » ; « détox » seulement entre guillemets pour nommer la mode. Aucune allégation de santé hors libellé européen autorisé, cité mot pour mot. Ces cartes informent : elles ne remplacent pas un avis médical.",
 'verification': "Identifiants PubMed contrôlés via NCBI E-utilities (premier auteur, année, revue, titre ; statut de rétractation) le 30/09/2026 ; DOI EFSA contrôlés via Crossref ; sites officiels (OMS, ANSES, Santé publique France, EUR-Lex, CIQUAL) ouverts le même jour.",
 'aliment_ids': "Renvoient à aliments_v3.json ; liste vide quand vyvre ne propose aucun aliment pour cette mode (kombucha, cures, jeûne).",
 'repartition': {v: sum(1 for t in T if t['verdict'] == v) for v in ('prouve', 'plausible', 'pas_demontre', 'deconseille')}}
json.dump({'_meta': meta, 'tendances': T}, open(os.path.join(NUT, 'tendances.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(T), meta['repartition'])
