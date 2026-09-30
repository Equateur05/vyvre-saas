# -*- coding: utf-8 -*-
"""Construit _nutrition/aliments_v2.json : les 44 aliments de v1 inchangés + nouveaux champs, et les aliments ajoutés.
Valeurs nutritionnelles : table CIQUAL 2020 (ANSES), fichier officiel ciqual.xls.
Allégations : seuil « source » = 15 % de la VNR pour 100 g (Règlement 1169/2011, annexe XIII), mêmes libellés que v1."""
import json, os, sys, copy, xlrd
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from foods_def import NEW
from exist_def import EXIST, RARE
NUT = os.environ.get('NUT_DIR', os.path.dirname(HERE))
CIQ = os.environ.get('CIQUAL_XLS', os.path.join(HERE, 'ciqual.xls'))

# ---------- CIQUAL ----------
wb = xlrd.open_workbook(CIQ); sh = wb.sheet_by_index(0)
ROW = {int(sh.cell_value(i, 6)): i for i in range(1, sh.nrows) if sh.cell_value(i, 6) != ''}
COLS = {'kcal': 10, 'prot': 14, 'fib': 26, 'sucres': 18, 'ala': 44, 'epa': 46, 'dha': 47, 'sel': 49, 'ca': 50, 'cu': 52, 'fe': 53, 'iode': 54, 'mg': 55, 'k': 58, 'se': 59, 'zn': 61,
        'ret': 62, 'bcar': 63, 'vitd': 64, 'vite': 65, 'vitk1': 66, 'vitc': 68, 'b2': 70, 'b3': 71, 'b9': 74, 'b12': 75}
def num(v):
    if isinstance(v, (int, float)): return float(v)
    v = str(v).replace(',', '.').strip()
    if v in ('', '-'): return None
    if v.startswith('<') or v == 'traces': return 0.0
    try: return float(v)
    except ValueError: return None
def ciq(code):
    r = sh.row_values(ROW[code]); d = {k: num(r[c]) for k, c in COLS.items()}
    d['vita'] = ((d['ret'] or 0) + (d['bcar'] or 0) / 6) if (d['ret'] is not None or d['bcar'] is not None) else None
    d['epadha_mg'] = ((d['epa'] or 0) + (d['dha'] or 0)) * 1000
    d['nom'] = r[7]; return d
def r1(x, n=3):
    if x is None: return None
    return round(x, n) if abs(x) < 10 else round(x, 1)
def teneurs(d):
    return {'energie_kcal': r1(d['kcal']), 'proteines_g': r1(d['prot']), 'fibres_g': r1(d['fib']), 'ala_g': r1(d['ala'], 4), 'epa_dha_mg': round(d['epadha_mg']),
            'vitamine_a_ug_ER_calcule': (round(d['vita'], 1) if d['vita'] is not None else None), 'vitamine_c_mg': r1(d['vitc']), 'vitamine_e_mg': r1(d['vite']),
            'vitamine_k1_ug': r1(d['vitk1']), 'riboflavine_mg': r1(d['b2']), 'niacine_mg': r1(d['b3']), 'zinc_mg': r1(d['zn']), 'cuivre_mg': r1(d['cu']),
            'iode_ug': r1(d['iode']), 'selenium_ug': r1(d['se']), 'potassium_mg': r1(d['k'])}

# ---------- Allégations (libellés repris de v1) ----------
OFF = 'traduction officielle confirmée par sources secondaires'; ACF = 'traduction à confirmer sur le registre UE'
CL = [  # cle, champ teneur, seuil, FR, EN, statut
 ('vitc', 'vitamine_c_mg', 12, "La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau", "Vitamin C contributes to normal collagen formation for the normal function of skin", OFF),
 ('vita', 'vitamine_a_ug_ER_calcule', 120, "La vitamine A contribue au maintien d'une peau normale", "Vitamin A contributes to the maintenance of normal skin", OFF),
 ('zn', 'zinc_mg', 1.5, "Le zinc contribue au maintien d'une peau normale", "Zinc contributes to the maintenance of normal skin", OFF),
 ('b3', 'niacine_mg', 2.4, "La niacine contribue au maintien d'une peau normale", "Niacin contributes to the maintenance of normal skin", OFF),
 ('b2', 'riboflavine_mg', 0.21, "La riboflavine contribue au maintien d'une peau normale", "Riboflavin contributes to the maintenance of normal skin", OFF),
 ('iode', 'iode_ug', 22.5, "L'iode contribue au maintien d'une peau normale", "Iodine contributes to the maintenance of normal skin", OFF),
 ('cu', 'cuivre_mg', 0.15, "Le cuivre contribue à une pigmentation normale de la peau", "Copper contributes to normal skin pigmentation", OFF),
 ('vite', 'vitamine_e_mg', 1.8, "La vitamine E contribue à protéger les cellules contre le stress oxydatif", "Vitamin E contributes to the protection of cells from oxidative stress", ACF),
 ('se', 'selenium_ug', 8.25, "Le sélénium contribue à protéger les cellules contre le stress oxydatif", "Selenium contributes to the protection of cells from oxidative stress", ACF),
]
ALA_C = {'libelle_FR': "L'acide alpha-linolénique (ALA) contribue au maintien d'une cholestérolémie normale (effet obtenu avec 2 g d'ALA par jour)", 'libelle_EN_verifie': "ALA contributes to the maintenance of normal blood cholesterol levels",
         'condition': "Aliment au moins source d'oméga-3 (0,3 g ALA pour 100 g et pour 100 kcal) ; informer que l'effet est obtenu avec 2 g d'ALA par jour.", 'statut_libelle_FR': ACF}
EPA_C = {'libelle_FR': "L'EPA et le DHA contribuent à une fonction cardiaque normale (effet obtenu avec 250 mg d'EPA et de DHA par jour)", 'libelle_EN_verifie': "EPA and DHA contribute to the normal function of the heart",
         'condition': "Aliment au moins source d'oméga-3 (40 mg EPA+DHA pour 100 g et pour 100 kcal) ; informer que l'effet est obtenu avec 250 mg d'EPA et DHA par jour.", 'statut_libelle_FR': ACF}
def fmt(x): return ('%g' % x)
ANIMAL_ORDER = ['zn', 'b3', 'b2', 'iode', 'se', 'vita', 'vitc', 'cu', 'vite']
def claims(t, d, animal=False):
    ok = [c for c in CL if t.get(c[1]) is not None and t[c[1]] >= c[2]]
    if animal: ok.sort(key=lambda c: ANIMAL_ORDER.index(c[0]))
    main = None; autres = []
    for c in ok:
        cond_main = "Aliment au moins « source » du nutriment : 15 %% de la VNR pour 100 g (%s=%s (seuil %s/100 g), CIQUAL 2020). Accompagner de la mention d'une alimentation variée et équilibrée et d'un mode de vie sain (art. 10.2 du Règlement 1924/2006)." % (c[1], fmt(t[c[1]]), fmt(c[2]))
        if main is None: main = (c[3], c[4], cond_main, c[5])
        else: autres.append({'libelle_FR': c[3], 'libelle_EN_verifie': c[4], 'condition': 'source du nutriment (%s=%s (seuil %s/100 g))' % (c[1], fmt(t[c[1]]), fmt(c[2])), 'statut_libelle_FR': c[5]})
    kc = d['kcal'] or 1
    if (d['ala'] or 0) >= 0.3 and (d['ala'] or 0) / kc * 100 >= 0.3: autres.append(dict(ALA_C))
    if d['epadha_mg'] >= 40 and d['epadha_mg'] / kc * 100 >= 40: autres.append(dict(EPA_C))
    return main, autres

# ---------- Études (liens vérifiés : PubMed via E-utilities, ou site de l'organisme) ----------
PM = 'https://pubmed.ncbi.nlm.nih.gov/%s/'
ET = {
 'AUNE17': ("Aune D 2017, Int J Epidemiol (fruits et légumes et mortalité, méta-analyse)", PM % 28338764),
 'AUNE16N': ("Aune D 2016, BMC Med (fruits à coque et mortalité, méta-analyse)", PM % 27916000),
 'BAO13': ("Bao Y 2013, N Engl J Med (fruits à coque et mortalité, 2 cohortes, financement partiel International Tree Nut Council)", PM % 24256379),
 'AUNE16W': ("Aune D 2016, BMJ (céréales complètes et mortalité, méta-analyse)", PM % 27301975),
 'REYN19': ("Reynolds A 2019, Lancet (fibres et santé, 185 cohortes et 58 ECR)", PM % 30638909),
 'SMITH07': ("Smith RN 2007, Am J Clin Nutr (régime à faible charge glycémique et acné, ECR n=43)", PM % 17616769),
 'KWON12': ("Kwon HH 2012, Acta Derm Venereol (faible charge glycémique et acné, ECR n=32)", PM % 22678562),
 'JAYEDI18': ("Jayedi A 2018, Public Health Nutr (poisson et mortalité, méta-analyse)", PM % 29317009),
 'RHODES03': ("Rhodes LE 2003, Carcinogenesis (EPA 4 g/j en complément et coup de soleil, ECR n=42)", PM % 12771037),
 'PILK13': ("Pilkington SM 2013, Am J Clin Nutr (oméga-3 5 g/j, ECR n=79, critère principal non significatif)", PM % 23364005),
 'LATREILLE13': ("Latreille J 2013, J Dermatol Sci (oméga-3 alimentaires et photovieillissement, SU.VI.MAX n=2919, observationnel)", PM % 23938188),
 'NAGATA10': ("Nagata C 2010, Br J Nutr (légumes verts et jaunes et rides, transversal n=716)", PM % 20085665),
 'COSGROVE07': ("Cosgrove MC 2007, Am J Clin Nutr (vitamine C et aspect ridé, transversal n=4025)", PM % 17921406),
 'PULLAR17': ("Pullar JM 2017, Nutrients (rôles de la vitamine C dans la peau, revue)", PM % 28805671),
 'WHITEHEAD12': ("Whitehead RD 2012, PLoS One (fruits et légumes et couleur de peau, n=35, financé par Unilever)", PM % 22412966),
 'STAHL12': ("Stahl W 2012, Am J Clin Nutr (bêta-carotène et caroténoïdes, protection solaire, revue)", PM % 23053552),
 'WERFEL15': ("Werfel T 2015, Allergy (EAACI, allergies alimentaires croisées avec les pollens)", PM % 26095197),
 'WAGNER02': ("Wagner S 2002, Biochem Soc Trans (syndrome latex-fruits, revue)", PM % 12440950),
 'HOLBROOK05': ("Holbrook AM 2005, Arch Intern Med (interactions warfarine, revue)", PM % 15911722),
 'WASTYK21': ("Wastyk HC 2021, Cell (régime riche en aliments fermentés contre régime riche en fibres, 17 semaines, 2 bras de 18 adultes : diversité du microbiote et marqueurs d'inflammation)", PM % 34256014),
 'PAN12': ("Pan A 2012, Am J Clin Nutr (ALA et maladies cardiovasculaires, méta-analyse)", PM % 23076616),
 'FAM20': ("Fam VW 2020, Nutrients (mangue 85 g ou 250 g/j et rides, essai pilote randomisé sans groupe témoin sans mangue, financement partiel National Mango Board)", PM % 33158079),
 'HENNING19': ("Henning SM 2019, Sci Rep (jus ou extrait de grenade et érythème UV, ECR ouvert n=74)", PM % 31601842),
 'VOLLONO19': ("Vollono L 2019, Nutrients (curcumine et maladies de peau, revue ; formes topiques et compléments)", PM % 31509968),
 'IZUMI07': ("Izumi T 2007, J Nutr Sci Vitaminol (isoflavones 40 mg/j en complément, ECR n=26, auteurs Kikkoman)", PM % 17484381),
 'JUHL18': ("Juhl CR 2018, Nutrients (laitiers et acné, méta-analyse d'observation n=78529)", PM % 30096883),
 'AGHASI19': ("Aghasi M 2019, Clin Nutr (laitiers et acné, méta-analyse d'observation)", PM % 29778512),
 'NEUKAM11': ("Neukam K 2011, Skin Pharmacol Physiol (huile de lin en complément, ECR 2x13)", PM % 21088453),
 'DESPIRT09': ("De Spirt S 2009, Br J Nutr (huiles de lin et bourrache en complément, ECR)", PM % 18761778),
 'PALMA15': ("Palma L 2015, Clin Cosmet Investig Dermatol (eau et hydratation cutanée, n=49, non randomisé)", PM % 26345226),
 'AKDENIZ18': ("Akdeniz M 2018, Skin Res Technol (apports hydriques et hydratation cutanée, revue systématique, preuves faibles)", PM % 29392767),
 'HURRELL99': ("Hurrell RF 1999, Br J Nutr (boissons polyphénoliques et absorption du fer)", PM % 10999016),
 'BOUVARD15': ("Bouvard V 2015, Lancet Oncol (CIRC : cancérogénicité de la viande rouge et transformée)", PM % 26514947),
 'ZERAATKAR19': ("Zeraatkar D 2019, Ann Intern Med (viande rouge et transformée, méta-analyse de cohortes, certitude faible)", PM % 31569213),
 'SCHWING17': ("Schwingshackl L 2017, Am J Clin Nutr (groupes d'aliments et mortalité, méta-analyse)", PM % 28446499),
 'IARC114': ("CIRC 2015, Monographie 114, questions-réponses (viande rouge 2A, viande transformée 1)", "https://www.iarc.who.int/wp-content/uploads/2018/11/Monographs-QA_Vol114.pdf"),
 'PNNS': ("Santé publique France 2019, recommandations PNNS pour les adultes", "https://www.mangerbouger.fr/ressources-pros/elaboration-des-recommandations-nutritionnelles/les-recommandations-adultes-alimentation-activite-physique-et-sedentarite"),
 'ANSES_ALGUES': ("ANSES 2018, avis 2017-SA-0086 (iode et algues)", "https://www.anses.fr/en/system/files/NUT2017SA0086.pdf"),
 'ANSES_POISSONS': ("ANSES, fiche Poissons et produits de la pêche : conseils de consommation (poissons prédateurs, grossesse)", "https://www.anses.fr/system/files/ANSES-Ft-RecosPoissons.pdf"),
 'ANSES_CURCUMA': ("ANSES 2022, avis révisé sur les compléments alimentaires contenant du curcuma (hépatites, interactions)", "https://www.anses.fr/fr/content/avis-revise-de-lanses-relatif-levaluation-des-risques-relatifs-la-consommation-de"),
 'EFSA_COUMARINE': ("EFSA 2008, EFSA Journal (coumarine dans les arômes et ingrédients, dont la cannelle)", "https://doi.org/10.2903/j.efsa.2008.793"),
 'SANTE_GROSSESSE': ("Santé.fr, Manger mieux pendant la grossesse (lait cru, poisson cru ou fumé, coquillages crus, crustacés décortiqués cuits, soja, foie)", "https://www.sante.fr/manger-mieux-pendant-la-grossesse-les-aliments-limiter-ou-eviter"),
 'ROSACEA_SURVEY': ("National Rosacea Society, enquête sur les déclencheurs (1 066 patients, déclaratif)", "https://www.rosacea.org/patients/rosacea-triggers/rosacea-triggers-survey"),
}
def etudes(keys): return [{'ref': ET[k][0], 'lien': ET[k][1]} for k in keys]

# ---------- Prix ----------
INSEE_RAW = json.load(open(os.path.join(HERE, 'insee_prix.json')))
IS = {  # cle: (idbank, unite, mode) mode kg | piece | douzaine
 'artichaut_piece': ('001791256', '€/pièce', 'piece'), 'champignon': ('000641423', '€/kg', 'kg'), 'choufleur_piece': ('001791254', '€/pièce', 'piece_sans_poids'),
 'courgette': ('000641425', '€/kg', 'kg'), 'endive': ('000641426', '€/kg', 'kg'), 'haricotvert': ('000641359', '€/kg', 'kg'), 'oignon': ('000641427', '€/kg', 'kg'),
 'poireau': ('000641428', '€/kg', 'kg'), 'poivron': ('010596274', '€/kg', 'kg'), 'pdt': ('000641360', '€/kg', 'kg'), 'pomme': ('000641367', '€/kg', 'kg'),
 'poire': ('000641369', '€/kg', 'kg'), 'citron': ('000641434', '€/kg', 'kg'), 'clementine': ('000641435', '€/kg', 'kg'), 'banane': ('000641432', '€/kg', 'kg'),
 'merlan': ('000641408', '€/kg', 'kg'), 'moule': ('000641418', '€/kg', 'kg'), 'crevette': ('000641354', '€/kg', 'kg_crevette'), 'stjacques': ('000641416', '€/kg', 'entier'),
 'lapin': ('000442453', '€/kg', 'entier'), 'rumsteck': ('000442434', '€/kg', 'kg'), 'porc_filet': ('000442448', '€/kg', 'kg'), 'veau': ('000442441', '€/kg', 'kg'),
 'lotte': ('000641405', '€/kg', 'kg'), 'tourteau': ('000641419', '€/kg', 'entier'), 'orange': ('000641365', '€/kg', 'kg'), 'orange_jus': ('000641365', '€/kg', 'jus'),
 'tomate': ('000641429', '€/kg', 'kg'), 'carotte': ('000641422', '€/kg', 'kg'), 'kiwi_piece': ('001791257', '€/pièce', 'piece'), 'avocat_piece': ('001791255', '€/pièce', 'piece'),
 'pamplemousse_piece': ('010536481', '€/pièce', 'piece'), 'huitre_douzaine': ('000641355', '€/douzaine', 'douzaine'),
}
FRR = {  # Familles Rurales, relevés du 8 au 21 juin 2026, 118 relevés, 40 départements ; €/kg (conventionnel, bio)
 'aubergine': (2.89, 5.05, 'Aubergine violette'), 'concombre': (3.34, 4.81, 'Concombre'), 'laitue': (4.39, 5.90, 'Laitue verte'), 'melon': (3.33, 5.45, 'Melon type charentais'),
 'pasteque': (1.77, 2.10, 'Pastèque verte'), 'peche': (3.92, 7.06, 'Pêche'), 'cerise': (7.86, 15.21, 'Cerise rouge'), 'abricot': (4.24, 9.07, 'Abricot'), 'fraise': (9.09, 12.44, 'Fraise ronde'),
 'poivron_vert': (4.39, 7.98, 'Poivron vert'), 'pomme': (2.64, 3.57, 'Pomme Golden ou Gala'), 'carotte': (2.08, 2.86, 'Carottes'), 'banane': (2.20, 2.38, 'Banane'),
 'citron': (3.90, 5.33, 'Citron jaune'), 'courgette': (2.00, 4.04, 'Courgette longue'), 'haricotvert': (7.14, 12.93, 'Haricots verts'), 'oignon': (2.37, 3.02, 'Oignon jaune'),
 'pdt': (1.23, 2.15, 'Pomme de terre type vapeur'), 'tomate': (2.91, 5.99, 'Tomate grappe'),
}
FR_URL = 'https://www.famillesrurales.org/sites/multisite.famillesrurales.org._www/files/ckeditor/actualites/fichiers/observatoire-fruits-legumes-2026-07.pdf'
EST = {  # categorie: (niveau, texte)
 'leg': (1, "estimé par catégorie : légumes frais courants (Familles Rurales, relevés du 8 au 21 juin 2026 : 3,27 €/kg en moyenne en conventionnel, 5,47 €/kg en bio ; INSEE carottes 2,04 €/kg et poireaux 2,54 €/kg, moyenne sept. 2025-août 2026) ; aucun relevé propre à cet aliment"),
 'leg2': (2, "estimé par catégorie : légumes frais plus chers au kilo (INSEE, moyenne sept. 2025-août 2026 : haricots verts 7,26 €/kg, champignons de Paris 6,39 €/kg) ; aucun relevé propre à cet aliment"),
 'legconserve': (1, "estimé par catégorie : conserves de légumes, petite portion ; aucune série publique active trouvée (INSEE a arrêté ses séries de conserves de légumes)"),
 'fruit': (1, "estimé par catégorie : fruits frais courants (Familles Rurales, juin 2026 : 4,33 €/kg en moyenne en conventionnel, 6,96 €/kg en bio) ; aucun relevé propre à cet aliment"),
 'fruit2': (2, "estimé par catégorie : petits fruits et fruits fragiles (Familles Rurales, juin 2026 : cerise 7,86 €/kg, fraise 9,09 €/kg) ; aucun relevé propre à cet aliment"),
 'exo': (2, "estimé par catégorie : produits importés ou d'épicerie spécialisée ; aucun relevé public daté trouvé, niveau 2 retenu par prudence"),
 'sec': (1, "estimé par catégorie : féculents et légumineuses secs, portion de 50 à 70 g crue ; aucune série publique active (série INSEE « pâtes » arrêtée en 2019), prix non chiffré"),
 'pain': (1, "estimé par catégorie : pain (INSEE baguette 4,09 €/kg, moyenne sept. 2025-août 2026 ; le pain complet n'a pas de série propre), portion de 50 g"),
 'noix': (2, "estimé par catégorie : fruits à coque, graines et fruits secs ; aucun relevé public daté trouvé, niveau 2 retenu par prudence (portion de 20 à 30 g)"),
 'petit': (1, "estimé par catégorie : aliment consommé en petite portion (moins de 20 g) ; aucun relevé public daté, prix non chiffré"),
 'pois': (3, "estimé par catégorie : poissons frais (INSEE, moyenne sept. 2025-août 2026 : filet de merlan 24,60 €/kg, lotte 29,77 €/kg, sole 39,01 €/kg) ; aucun relevé propre à cet aliment"),
 'poisgras': (2, "estimé par catégorie : petits poissons gras courants (maquereau, hareng) ; aucune série INSEE active, niveau 2 retenu par prudence"),
 'conserve': (2, "estimé par catégorie : conserves de poisson ; aucune série publique active (série INSEE thon en boîte arrêtée en 2020), niveau 2 par prudence"),
 'crust': (3, "estimé par catégorie : fruits de mer (INSEE, moyenne sept. 2025-août 2026 : crevettes roses tropicales 17,09 €/kg, tourteau 17,64 €/kg) ; aucun relevé propre à cet aliment"),
 'viande3': (3, "estimé par catégorie : viandes rouges (INSEE, moyenne sept. 2025-août 2026 : bœuf rumsteck 30,40 €/kg, bavette 31,43 €/kg) ; aucun relevé propre à cet aliment"),
 'volaille': (2, "estimé par catégorie : volaille ; série INSEE poulet arrêtée en 2000, aucun relevé récent (repères INSEE de viandes blanches : lapin 13,73 €/kg, porc rôti 13,84 €/kg)"),
 'oeuf': (1, "estimé par catégorie : œufs ; aucune série INSEE active, prix non chiffré"),
 'fromage': (2, "estimé par catégorie : fromages ; aucune série INSEE active (emmental arrêtée en 2019), portion de 15 à 60 g"),
 'laitier': (1, "estimé par catégorie : produits laitiers frais et boissons végétales ; aucune série INSEE active (yaourt et lait arrêtées en 2019), prix non chiffré"),
 'soja': (2, "estimé par catégorie : produits à base de soja ; aucun relevé public daté trouvé, niveau 2 par prudence"),
 'epice': (1, "estimé par catégorie : épices, herbes, condiments et boissons infusées, quelques grammes par portion ; prix non chiffré"),
 'huile': (1, "estimé par catégorie : huiles, portion de 5 à 10 g ; aucune série INSEE active (huile d'olive arrêtée en 2019), prix non chiffré"),
 'algue': (2, "estimé par catégorie : algues séchées d'épicerie ; aucun relevé public daté trouvé, niveau 2 par prudence"),
 'eau': (1, "estimé par catégorie : eau du robinet ; non chiffré ici"),
}
def niveau(eur):
    return 1 if eur <= 0.60 else (2 if eur <= 2.00 else 3)
def prix(key, g, pc):
    typ, k = key.split(':', 1)
    if typ == 'E':
        n, txt = EST[k]; return n, txt, None, None
    if typ == 'R':
        conv, bio, lib = FRR[k]; eur = round(conv * g / 1000, 2)
        rel = {'valeur': conv, 'unite': '€/kg', 'produit': lib, 'periode': 'relevés du 8 au 21 juin 2026', 'zone': '40 départements de France métropolitaine (118 relevés, hyper, super, hard discount, magasins bio)',
               'source': 'Familles Rurales, Observatoire des prix des fruits et légumes 2026', 'url': FR_URL, 'bio_valeur': bio}
        return niveau(eur), "Familles Rurales, Observatoire des prix des fruits et légumes 2026 (%s : %s €/kg conventionnel, %s €/kg bio, relevés 8-21 juin 2026)" % (lib, fmt(conv), fmt(bio)), eur, rel
    idb, unite, mode = IS[k]; s = INSEE_RAW[idb]; v = s['moyenne_12m']
    rel = {'valeur': v, 'unite': unite, 'produit': s['titre'], 'periode': 'moyenne des 12 mois %s à %s' % tuple(s['periodes']), 'zone': 'France métropolitaine',
           'source': 'INSEE, prix moyens mensuels de vente au détail (série %s)' % idb, 'url': 'https://www.insee.fr/fr/statistiques/serie/%s' % idb}
    if k in FRR or k.replace('_piece', '') in FRR:
        conv, bio, lib = FRR.get(k) or FRR[k.replace('_piece', '')]; rel['bio_valeur'] = bio; rel['bio_source'] = 'Familles Rurales, juin 2026 (%s)' % lib
    txt = "INSEE, prix moyens mensuels de vente au détail en métropole, série %s « %s » : %s %s en moyenne de %s à %s" % (idb, s['titre'], fmt(v), unite, s['periodes'][0], s['periodes'][1])
    if mode == 'kg': eur = round(v * g / 1000, 2)
    elif mode == 'piece': eur = round(v * pc, 2)
    elif mode == 'douzaine': eur = round(v * pc / 12, 2)
    elif mode == 'jus': eur = round(v * 0.30, 2); txt += " ; 1 verre de 150 mL ≈ 300 g d'oranges (hypothèse)"
    elif mode == 'kg_crevette': eur = round(v * g / 1000, 2); txt += " ; série crevettes roses tropicales (non décortiquées)"
    else: eur = None; txt += " ; produit vendu entier (coquilles, carcasse ou pièce de poids variable) : prix par portion non calculé"
    if mode == 'piece_sans_poids': eur = None
    n = niveau(eur) if eur is not None else {'choufleur_piece': 1, 'stjacques': 3, 'lapin': 2, 'tourteau': 3}[k]
    return n, txt, eur, rel

# ---------- Saisons ----------
ADEME = json.load(open(os.path.join(HERE, 'ademe_saisons.json')))
INTF = json.load(open(os.path.join(HERE, 'interfel_saisons.json')))
SRC_A = "ADEME, Impact CO2 : calendrier des fruits et légumes de saison en France (API impactco2.fr/api/v1/fruitsetlegumes, consultée le 30/09/2026)"
SRC_T = "Interfel/CTIFL, « Le calendrier des fruits et légumes frais » (2025), mois « cœur de saison » seulement ; construit sur les achats des ménages, peut inclure la serre et l'import"
ALL = list(range(1, 13))
def saison(key, note=None):
    if key.startswith('A:'):
        return sorted(ADEME[key[2:]]['months']), SRC_A + (' (« %s »)' % ADEME[key[2:]]['name'])
    if key.startswith('T:'):
        x = INTF[key[2:]]; return sorted(x['coeur']), SRC_T + (' (ligne « %s »)' % key[2:].replace('_', ' '))
    if key == 'ALL': return ALL, note or "Produit sec, en conserve, animal ou importé : disponible toute l'année, pas de saison de production retenue"
    if key == 'NONE': return [], "Aucun des calendriers consultés (ADEME, Interfel) ne couvre cet aliment : saison non renseignée"
    raise ValueError(key)

# ---------- Règles automatiques ----------
NRV = {'vitc': 80, 'vite': 12, 'vita': 800, 'b2': 1.4, 'b3': 16, 'zn': 10, 'cu': 1, 'iode': 150, 'se': 55, 'vitk1': 75, 'k': 2000, 'b9': 200, 'b12': 2.5, 'fe': 14, 'mg': 375, 'ca': 800, 'vitd': 5}
NAME = {'vitc': 'vitamine C', 'vite': 'vitamine E', 'b2': 'riboflavine', 'b3': 'niacine', 'zn': 'zinc', 'cu': 'cuivre', 'iode': 'iode', 'se': 'sélénium', 'vitk1': 'vitamine K', 'k': 'potassium',
        'b9': 'folates', 'b12': 'vitamine B12', 'fe': 'fer', 'mg': 'magnésium', 'ca': 'calcium', 'vitd': 'vitamine D'}
VEG = {'legume', 'fruit', 'legumineuse', 'cereale_complete', 'feculent', 'fruit_sec', 'soja', 'graine', 'fruit_a_coque', 'algue', 'matiere_grasse'}
ALLERG_LIB = {'cereales_gluten': 'céréales contenant du gluten', 'crustaces': 'crustacés', 'oeufs': 'œufs', 'poissons': 'poissons', 'arachides': 'arachide', 'soja': 'soja', 'lait': 'lait',
              'fruits_a_coque': 'fruits à coque', 'celeri': 'céleri', 'moutarde': 'moutarde', 'sesame': 'sésame', 'sulfites': 'anhydride sulfureux et sulfites', 'lupin': 'lupin', 'mollusques': 'mollusques'}
def nutr_cles(f, d):
    if f.get('noclaim'): return list(f.get('nu', []))
    out = list(f.get('nu', []))
    if (d['epadha_mg'] or 0) >= 200: out.append('EPA et DHA (oméga-3)')
    if (d['ala'] or 0) >= 0.3: out.append('ALA (oméga-3 végétal)')
    if (d['prot'] or 0) >= 10: out.append('protéines' + (' végétales' if f['cat'] in VEG else ''))
    if (d['fib'] or 0) >= 3: out.append('fibres')
    sc = []
    if d['vita'] is not None and d['vita'] >= 120: sc.append((d['vita'] / 800, 'provitamine A (bêta-carotène)' if f['cat'] in VEG else 'vitamine A'))
    for k, n in NRV.items():
        if k == 'vita': continue
        v = d.get(k)
        if v is not None and v >= 0.15 * n: sc.append((v / n, NAME[k]))
    sc.sort(reverse=True)
    for _, n in sc[:5]:
        if n not in out: out.append(n)
    if not out:
        mod = sorted(((d.get(k) or 0) / n, NAME[k]) for k, n in NRV.items() if k != 'vita' and (d.get(k) or 0) >= 0.075 * n)[::-1][:2]
        out = ['apport modeste en ' + n for _, n in mod] + (['un peu de fibres'] if (d['fib'] or 0) >= 1.5 else [])
    res = []
    for x in out:
        if not any(x.split(' ')[0].lower() == y.split(' ')[0].lower() for y in res): res.append(x)
    return res[:7]
def cibles_auto(f, d):
    if 'cp' in f: return f['cp']
    c = []; cat = f['cat']
    if cat in ('legumineuse', 'cereale_complete'): c.append('pores_sebum')
    if cat in ('legume', 'fruit', 'fruit_sec'):
        if d['vita'] is not None and d['vita'] >= 120: c.append('eclat')
        if (d['vitc'] or 0) >= 12: c.append('rides_fermete')
        if (d['vitc'] or 0) >= 50: c.append('uniformite')
        if any('lycopène' in x for x in f.get('nu', [])): c.insert(0, 'rougeurs')
    if cat == 'poisson' and d['epadha_mg'] >= 500: c += ['rougeurs']
    if cat in ('fruit_a_coque', 'graine'): c.append('texture')
    if cat in ('graine', 'fruit_de_mer') and (d['zn'] or 0) >= 3: c.append('pores_sebum')
    if cat == 'soja' and (d['prot'] or 0) >= 10: c.append('rides_fermete')
    out = []
    for x in c:
        if x not in out: out.append(x)
    return out[:3]
LONG = {'legume': (['fruits_legumes'], 'B', ['AUNE17']), 'fruit': (['fruits_legumes'], 'B', ['AUNE17']),
        'legumineuse': (['legumineuses', 'fibres', 'faible_charge_glycemique'], 'B', ['SMITH07', 'KWON12', 'REYN19']),
        'cereale_complete': (['cereales_completes', 'fibres', 'faible_charge_glycemique'], 'A', ['SMITH07', 'KWON12', 'AUNE16W']),
        'fruit_a_coque': (['fruits_a_coque'], 'B', ['BAO13', 'AUNE16N']), 'graine': (['fibres'], 'C', []), 'soja': (['proteines', 'legumineuses'], 'C', ['IZUMI07']),
        'fruit_de_mer': ([], 'C', []), 'feculent': ([], 'C', []), 'fruit_sec': ([], 'C', []), 'epice_herbe': ([], 'C', []), 'fromage': ([], 'C', []),
        'produit_laitier': ([], 'C', []), 'produit_laitier_fermente': (['proteines'], 'C', ['JUHL18', 'AGHASI19']), 'matiere_grasse': ([], 'C', []), 'viande': ([], 'C', ['PNNS']),
        'volaille': (['proteines'], 'C', ['PNNS']), 'boisson': ([], 'C', []), 'condiment': ([], 'C', []), 'sucre': ([], 'D', ['PNNS']), 'algue': ([], 'C', ['ANSES_ALGUES']), 'poisson': (['poisson'], 'B', ['JAYEDI18'])}
def fibre_txt(d): return 'riche en fibres' if (d['fib'] or 0) >= 6 else ('source de fibres' if (d['fib'] or 0) >= 3 else '')
def meca_auto(f, d, nc):
    cat = f['cat']; top = ', '.join(x for x in nc[:3]) or 'nutriments variés'
    if cat in ('legume', 'fruit'):
        return "Apporte %s (CIQUAL). Aucun essai n'a testé cet aliment sur la peau : intérêt déduit de sa composition ; manger plus de fruits et légumes est associé à une mortalité plus faible." % top
    if cat in ('legumineuse', 'cereale_complete') and 'pores_sebum' in f['_cp']:
        return "Féculent %s à faible charge glycémique ; un régime à faible charge glycémique a réduit l'acné dans deux essais (pas cet aliment testé seul)." % (fibre_txt(d) or 'complet')
    if cat == 'poisson':
        if d['epadha_mg'] >= 500: return "Poisson gras riche en oméga-3 marins ; les essais cutanés positifs utilisent des doses de compléments bien supérieures à une portion."
        return "Poisson maigre, apporte %s ; peu d'oméga-3 ; aucune donnée cutanée, mais manger du poisson est associé à une mortalité plus faible." % top
    if cat == 'fruit_a_coque': return "Fruit à coque qui apporte %s ; les fruits à coque sont associés à une mortalité plus faible dans les cohortes ; aucun essai cutané pour cet aliment." % top
    if cat == 'graine': return "Graine qui apporte %s ; aucun essai cutané." % top
    if cat == 'soja': return "Protéine végétale contenant des isoflavones ; les essais cutanés portent sur des isoflavones en complément, très petits."
    if cat == 'fruit_de_mer': return "Apporte %s ; aucune donnée cutanée." % top
    if cat in ('fromage', 'produit_laitier', 'produit_laitier_fermente'): return "Produit laitier qui apporte %s ; aucune donnée cutanée favorable ; le lait est associé à l'acné dans des études d'observation." % top
    if cat == 'feculent': return "Féculent ; aucune donnée cutanée."
    if cat == 'fruit_sec': return "Fruit séché : sucres et fibres concentrés ; aucune donnée cutanée."
    return "Aucune donnée cutanée."
def prec_auto(f, d, nom, gp_lowgl):
    pr = list(f.get('pr', [])); low = ' '.join(pr).lower()
    for a in f.get('al', []):
        if not any(x.startswith('Allergène majeur') and ALLERG_LIB[a].split()[0] in x.lower() for x in pr) and a != 'sulfites':
            pr.insert(0, 'Allergène majeur (%s).' % ALLERG_LIB[a])
    if gp_lowgl: pr.insert(0, "Le grade B concerne le régime à faible charge glycémique dans l'acné, pas cet aliment (%s) testé seul." % nom)
    g = f['g']
    if f['cat'] not in ('epice_herbe', 'condiment') and g >= 30:
        if (d['vitk1'] or 0) >= 100 and 'avk' not in low:
            pr.append('Sous anticoagulant AVK : riche en vitamine K ; garder une consommation régulière et stable, ne pas augmenter brutalement.')
        if (d['k'] or 0) >= 400 and 'potassium' not in low:
            pr.append('Maladie rénale chronique : riche en potassium, quantité à fixer avec le néphrologue.')
    if (d['sel'] or 0) >= 1.2 and g >= 10 and 'sal' not in low:
        pr.append('Riche en sel (%s g pour 100 g) : petite quantité ; hypertension ou maladie rénale : avis médical.' % fmt(round(d['sel'], 1)))
    if f['cat'] in ('legume', 'fruit') and d['bcar'] is None:
        pr.append("Bêta-carotène non mesuré dans CIQUAL 2020 pour cet aliment : ni cible « éclat » ni allégation vitamine A tant que la teneur n'est pas documentée.")
    if f['cat'] == 'legumineuse' and 'progressivement' not in low and f['id'] not in ('houmous', 'cacahuete', 'beurre_cacahuete'):
        pr.append('Introduire progressivement (tolérance digestive).')
    if f.get('noclaim') and f['cat'] not in ('sucre',):
        pr.append("Consommé en petite quantité : aucune allégation affichée (les seuils réglementaires sont calculés pour 100 g).")
    return pr
def surgele(f, d):
    if 'sg' in f: return (not f['sg'].startswith('Frais uniquement')), f['sg']
    cat = f['cat']
    if f.get('fz'):
        z = ciq(f['fz']); a, b = d['vitc'], z['vitc']
        return True, "Surgelé nature : bonne alternative hors saison ; CIQUAL 2020 : vitamine C %s mg/100 g (frais, cru) et %s mg/100 g (%s)." % (fmt(a) if a is not None else 'nd', fmt(b) if b is not None else 'nd', z['nom'])
    if cat == 'legume': return True, "Surgelé nature ou conserve au naturel : alternatives pratiques ; rincer les conserves salées."
    if cat == 'fruit': return True, "Surgelé nature : pratique pour les compotes et smoothies ; conserves au sirop plus sucrées."
    if cat == 'legumineuse': return True, "Conserve au naturel : pratique ; rincer pour enlever une partie du sel."
    if cat == 'epice_herbe' and f.get('sais', '').startswith('T:'): return True, "Herbe fraîche : se congèle hachée ; séchée, se garde longtemps."
    if cat in ('cereale_complete', 'feculent', 'fruit_sec', 'fruit_a_coque', 'graine', 'epice_herbe', 'condiment', 'sucre', 'algue', 'matiere_grasse', 'boisson'):
        return True, "Produit sec ou de longue conservation : sans objet."
    if cat == 'poisson': return True, "Surgelé nature ou conserve : bonnes alternatives au frais."
    if cat == 'fruit_de_mer': return True, "Surgelé : bonne alternative ; toujours bien cuire."
    if cat in ('viande', 'volaille'): return True, "Surgelée nature : possible ; décongeler au réfrigérateur."
    if cat in ('fromage', 'produit_laitier', 'produit_laitier_fermente', 'soja'): return False, "Frais uniquement."
    return True, "Sans objet."
PHOTO = "%s, on warm beige stone, soft daylight, minimal luxury food photography, top view"

# ---------- Construction ----------
v1 = json.load(open(os.path.join(NUT, 'aliments.json')))
out = []
for a in v1['aliments']:
    e = copy.deepcopy(a); en, cuis, fr, ue, bio, circ, pk, sk, sg = EXIST[a['id']]
    g = {'huitre': 80, 'avocat': 70, 'kiwi': 100, 'pamplemousse': 150}.get(a['id'])
    pc = {'huitre': 6, 'avocat': 0.5, 'kiwi': 1, 'pamplemousse': 0.5}.get(a['id'], 1)
    import re
    if g is None:
        m = re.match(r'(\d+)', a['portion_type']); g = int(m.group(1)) if m else 100
        if a['id'] == 'oeuf': g = 100
    n, txt, eur, rel = prix(pk, g, pc)
    if sk == 'ALL': ss = "Produit sec, en conserve, animal ou disponible toute l'année : saison v1 (12 mois) conservée"
    elif sk == 'A_V1': ss = "Saison v1 conservée (indicative) ; aucun calendrier officiel consulté ne couvre les huîtres"
    else:
        ref, src = saison(sk); v1s = sorted(a['saison'])
        ss = "Saison v1 conservée ; contrôle %s : %s" % (src, 'identique' if ref == v1s else 'mois %s (écart avec v1, à arbitrer)' % ref)
    d = ciq(a['ciqual']['code'])
    ok, note = (True, sg) if sg and not sg.startswith('Frais uniquement') else ((False, sg) if sg else surgele({'cat': a['categorie'], 'id': a['id']}, d))
    e.update({'cuisines': cuis, 'origine_possible_france': fr, 'origine_possible_ue': ue, 'prix_niveau': n, 'prix_source': txt, 'prix_portion_indicatif_eur': eur, 'prix_releve': rel,
              'bio_disponible': bio, 'circuits': circ, 'surgele_ou_conserve_ok': ok, 'surgele_ou_conserve_note': note, 'saison_source': ss, 'usage': 'rare' if a['id'] in RARE else 'quotidien', 'photo_prompt': PHOTO % en})
    out.append(e)
seen = {x['id'] for x in out}
for f in NEW:
    assert f['id'] not in seen, f['id']; seen.add(f['id'])
    d = ciq(f['code']); t = teneurs(d)
    f['_cp'] = cibles_auto(f, d)
    nc = nutr_cles(f, d)
    cl, gl_def, et_def = LONG[f['cat']]
    if f['cat'] == 'poisson' and d['epadha_mg'] >= 500: cl = ['poisson_gras', 'acides_gras_omega3']
    gp = f.get('gp') or ('B' if f['cat'] in ('legumineuse', 'cereale_complete') and 'pores_sebum' in f['_cp'] else ('C' if f['_cp'] else 'D'))
    gl = f.get('gl') or gl_def
    ets = list(f['et']) if 'et' in f else list(et_def)
    if 'et' not in f:
        if f['cat'] == 'poisson':
            ets = ['JAYEDI18'] + (['RHODES03', 'PILK13'] if d['epadha_mg'] >= 500 else [])
        if f['cat'] in ('legume', 'fruit') and 'eclat' in f['_cp']: ets.append('WHITEHEAD12')
        if f['cat'] in ('legume', 'fruit') and 'rides_fermete' in f['_cp']: ets.append('COSGROVE07')
        if f['cat'] in ('fruit_a_coque', 'graine') and (d['ala'] or 0) >= 0.3: ets.append('LATREILLE13')
    if any('Wagner' in x for x in f.get('cr', [])) and 'WAGNER02' not in ets: ets.append('WAGNER02')
    if any('Werfel' in x for x in f.get('cr', [])) and 'WERFEL15' not in ets: ets.append('WERFEL15')
    main, autres = (None, []) if f.get('noclaim') else claims(t, d, f['cat'] in ('poisson', 'fruit_de_mer', 'viande', 'volaille', 'fromage', 'produit_laitier', 'produit_laitier_fermente'))
    lowgl = gp == 'B' and f['cat'] in ('legumineuse', 'cereale_complete') and not f.get('gp')
    pr = prec_auto(f, d, f['nom'], lowgl)
    if any('AVK' in x for x in pr) and 'HOLBROOK05' not in ets and f['cat'] != 'epice_herbe': ets.append('HOLBROOK05')
    n, txt, eur, rel = prix(f['prix'], f['g'], f.get('pc', 1))
    sa, ssrc = saison(f['sais'], f.get('sais_note'))
    ok, note = surgele(f, d)
    e = {'id': f['id'], 'nom': f['nom'], 'categorie': f['cat'], 'cibles_peau': f['_cp'], 'cibles_longevite': f.get('cl', cl), 'nutriments_cles': nc,
         'mecanisme_simple': f.get('me') or meca_auto(f, d, nc), 'niveau_preuve_peau': gp, 'niveau_preuve_longevite': gl, 'etudes': etudes(ets),
         'portion_type': f['portion'], 'allergenes_UE': f.get('al', []), 'reactions_croisees': f.get('cr', []), 'precautions': pr,
         'allegation_UE_autorisee': main[0] if main else None, 'allegation_UE_libelle_EN_verifie': main[1] if main else None,
         'allegation_UE_condition': main[2] if main else None, 'allegation_UE_statut_libelle_FR': main[3] if main else None, 'autres_allegations_UE': autres,
         'saison': sa, 'ciqual': {'code': f['code'], 'nom_ciqual': d['nom'], 'source': 'ANSES, table CIQUAL 2020', 'teneurs_pour_100g': t},
         'cuisines': f['cuis'], 'origine_possible_france': f['fr'], 'origine_possible_ue': f['ue'], 'prix_niveau': n, 'prix_source': txt, 'prix_portion_indicatif_eur': eur, 'prix_releve': rel,
         'bio_disponible': f['bio'], 'circuits': f['circ'], 'surgele_ou_conserve_ok': ok, 'surgele_ou_conserve_note': note, 'saison_source': ssrc, 'usage': 'rare' if f['id'] in RARE else 'quotidien', 'photo_prompt': PHOTO % f['en']}
    out.append(e)

meta = copy.deepcopy(v1['_meta'])
meta.update({'version': '2.0', 'date': '2026-09-30',
 'description_v2': "v2 : les 44 aliments de v1 sont repris sans modification de leurs champs ; tous les aliments reçoivent les champs cuisines, origine, prix, bio, circuits, surgelé/conserve, saison_source et photo_prompt. %d aliments ajoutés, valeurs CIQUAL 2020 lues dans le fichier officiel, allégations calculées automatiquement avec les seuils et libellés de v1." % len(NEW),
 'grades_v2': "Aliments ajoutés : grade peau B seulement pour les légumineuses et céréales complètes (via le régime à faible charge glycémique dans l'acné, pas l'aliment seul) ; C quand l'intérêt est déduit de la composition ; D quand aucun lien cutané n'existe (l'aliment ne sert alors qu'aux recettes et à la variété, jamais proposé pour un indice).",
 'allegations_v2': "Allégation principale = première allégation remplie dans l'ordre : vitamine C, vitamine A, zinc, niacine, riboflavine, iode, cuivre, vitamine E, sélénium ; autres allégations dans le même ordre, puis ALA et EPA+DHA. Aucune allégation pour les épices, herbes, condiments, algues et sucres (petites portions ou excès possible).",
 'prix': "prix_niveau : 1 abordable (portion ≤ 0,60 €), 2 moyen (≤ 2,00 €), 3 cher (> 2,00 €), calculé sur le prix de la portion quand un relevé public daté existe (INSEE, moyenne des 12 mois sept. 2025-août 2026 ; Familles Rurales, relevés du 8 au 21 juin 2026). Sinon niveau estimé par catégorie, écrit « estimé par catégorie » dans prix_source, et prix_portion_indicatif_eur = null. Jamais de prix inventé.",
 'origine': "origine_possible_france : production réaliste en France métropolitaine (les DROM ne sont pas comptés) ; origine_possible_ue : production réaliste dans l'Union européenne.",
 'saison_v2': "Nouveaux aliments : ADEME Impact CO2 en priorité, sinon Interfel/CTIFL (mois « cœur de saison »), sinon [] (non documentée) ; 12 mois pour les produits secs, conserves, produits animaux et importés. Les 44 aliments de v1 gardent leur saison, contrôlée contre ADEME dans saison_source.",
 'usage': "quotidien = vendu dans la plupart des supermarchés et connu de la plupart des ménages français ; rare = surtout acheté en épicerie spécialisée, magasin bio ou poissonnerie, ou perçu comme de niche, festif ou très cher. Classement éditorial, sans lien avec l'intérêt nutritionnel.",
 'photo_prompt': "Description anglaise d'une photo produit studio homogène (pierre beige chaude, lumière du jour douce, vue de dessus)."})
json.dump({'_meta': meta, 'aliments': out}, open(os.path.join(NUT, 'aliments_v2.json'), 'w'), ensure_ascii=False, indent=1)
print('aliments', len(out))
