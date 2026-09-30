# -*- coding: utf-8 -*-
"""Construit _nutrition/recettes.json à partir des lots rec_*.py et de aliments_v2.json.
Allergènes, régimes, cibles peau, saison et prix sont CALCULÉS ingrédient par ingrédient (jamais saisis à la main)."""
import json, os, sys, glob, importlib, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
NUT = os.environ.get('NUT_DIR', os.path.dirname(HERE))
AL = {a['id']: a for a in json.load(open(os.path.join(NUT, 'aliments_v2.json')))['aliments']}

# Ingrédients hors base (aliment_id = null) : libellé, allergènes UE, drapeaux
X = {
 'sel': ('sel', [], {'neg'}), 'farine_t65': ('farine de blé T65', ['cereales_gluten'], set()), 'beurre': ('beurre', ['lait'], set()), 'creme': ('crème fraîche légère', ['lait'], set()),
 'sucre': ('sucre', [], set()), 'sucre_roux': ('sucre roux', [], set()), 'levure_chimique': ('levure chimique (poudre à lever)', [], set()), 'levure_boulanger': ('levure de boulanger', [], set()),
 'huile_tournesol': ('huile de tournesol', [], set()), 'huile_sesame': ('huile de sésame', ['sesame'], set()), 'fecule': ('fécule de maïs', [], set()), 'agar': ('agar-agar', [], set()),
 'eau_gazeuse': ('eau gazeuse', [], {'neg'}), 'glacons': ('glaçons', [], {'neg'}), 'nouilles_ble': ('nouilles de blé', ['cereales_gluten'], set()), 'riz_rond': ('riz rond', [], set()),
 'feuilles_brick': ('feuilles de brick', ['cereales_gluten'], set()), 'citronnelle': ('citronnelle fraîche', [], set()), 'eau_fleur_oranger': ("eau de fleur d'oranger", [], set()),
 'eau_rose': ('eau de rose alimentaire', [], set()), 'zaatar': ("za'atar (thym, sumac, sésame)", ['sesame'], set()), 'sumac': ('sumac', [], set()), 'badiane': ('anis étoilé (badiane)', [], set()),
 'riz_arborio': ('riz arborio', [], set()), 'sauce_poisson': ('sauce nuoc-mâm (sauce de poisson)', ['poissons'], {'poisson'}), 'galette_riz': ('galettes de riz (feuilles de riz)', [], set()),
 'nouilles_soba': ('nouilles soba (sarrasin et blé)', ['cereales_gluten'], set()), 'poivre_blanc': ('poivre blanc', [], {'neg'}), 'piment_espelette': ("piment d'Espelette", [], {'epice'}),
 'garam_masala': ('garam masala', [], set()), 'ras_el_hanout': ('ras el hanout', [], set()), 'graines_moutarde': ('graines de moutarde', ['moutarde'], set()), 'chapelure': ('chapelure', ['cereales_gluten'], set()),
 'semoule_fine': ('semoule de blé fine', ['cereales_gluten'], set()), 'pate_brisee_maison': ('pâte brisée maison (farine, beurre, eau)', ['cereales_gluten', 'lait'], set()),
 'gelee_agar': ('agar-agar', [], set()), 'noix_muscade': ('muscade', [], set()), 'fecule_pdt': ('fécule de pomme de terre', [], set()), 'lait_fermente': ('lait fermenté', ['lait'], set()),
 'cacao_nibs': ('éclats de fèves de cacao', [], set()), 'pain_mie_complet': ('pain de mie complet', ['cereales_gluten'], set()), 'tortilla_ble': ('tortilla de blé', ['cereales_gluten'], set()),
 'vinaigre_balsamique': ('vinaigre balsamique', ['sulfites'], set()), 'jus_citron_vert': ('jus de citron vert', [], set()), 'aquafaba': ('jus de pois chiches en conserve (aquafaba)', [], set()),
}
X_RARE = {'galette_riz', 'nouilles_soba', 'citronnelle', 'sumac', 'ras_el_hanout', 'garam_masala', 'zaatar', 'aquafaba', 'feuilles_brick', 'agar', 'eau_rose', 'badiane'}
MEAT = {'viande', 'volaille'}; SEA = {'poisson', 'fruit_de_mer'}
NON_CASHER_POISSON = {'lotte', 'anchois_sans_ecailles'}  # la lotte n'a pas d'écailles
CRU_LAIT = {'parmesan', 'comte', 'brebis_pyrenees'}
SOJA = {'tofu', 'tofu_soyeux', 'tempeh', 'miso', 'boisson_soja_calcium', 'sauce_soja'}
PREDATEUR = {'thon_naturel', 'dorade', 'bar', 'lotte'}
SEC_SULFITES = {'raisin_sec', 'figue_seche', 'abricot_sec'}
EPICE = {'piment', 'harissa', 'curry'}
ALLERG_ORDER = ['cereales_gluten', 'crustaces', 'oeufs', 'poissons', 'arachides', 'soja', 'lait', 'fruits_a_coque', 'celeri', 'moutarde', 'sesame', 'sulfites', 'lupin', 'mollusques']
PHOTO = "%s, served in matte handmade ceramic on warm beige stone, soft daylight, minimal luxury food photography, three-quarter view"
PHOTO_BOISSON = "%s, in a clear glass on warm beige stone, soft daylight, minimal luxury food photography, three-quarter view"

RECS = []
def R(id, nom, en, type, cuisine, temps, pers, ing, etapes, **k):
    RECS.append(dict(id=id, nom=nom, en=en, type=type, cuisine=cuisine, temps=temps, pers=pers, ing=ing, etapes=etapes, **k))

def parse(spec):
    out = []
    for tok in [t.strip() for t in spec.split(';') if t.strip()]:
        parts = tok.split('|'); head = parts[0].split()
        key, g = head[0], float(head[1].replace(',', '.'))
        lib = parts[1].strip() if len(parts) > 1 and parts[1].strip() else None
        q = parts[2].strip() if len(parts) > 2 else None
        out.append((key, g, lib, q))
    return out
def gtxt(g, key):
    if key == 'eau' or key.startswith('x:eau') or key in ('lait_demi_ecreme', 'boisson_amande', 'boisson_soja_calcium', 'kefir', 'jus_orange', 'the_noir', 'the_vert', 'tisane', 'x:eau_gazeuse', 'lait_coco'):
        return '%d mL' % g
    return ('%g g' % g).replace('.', ',')

def build(r):
    ings = parse(r['ing']); items = []; allerg = set(); notes = list(r.get('notes', []))
    counted = 0; tot = 0; flags = set(); cost = 0.0; cost_ok = True; lv = []
    for key, g, lib, q in ings:
        if key.startswith('x:'):
            k = key[2:]; L, al, fl = X[k]; allerg |= set(al); flags |= fl
            items.append({'aliment_id': None, 'libelle': lib or L, 'quantite': q or gtxt(g, key)})
            if 'neg' not in fl: counted += 1; cost_ok = False
            if 'poisson' in fl: flags.add('animal_mer')
            if 'epice' in fl: flags.add('epice')
            continue
        a = AL[key]
        items.append({'aliment_id': key, 'libelle': lib or a['nom'][0].lower() + a['nom'][1:], 'quantite': q or gtxt(g, key)})
        allerg |= set(a['allergenes_UE'])
        if key != 'eau': counted += 1; tot += g
        cat = a['categorie']
        if cat in MEAT: flags.add('viande' if cat == 'viande' else 'volaille')
        if cat in SEA: flags.add('animal_mer')
        if key == 'porc_filet': flags.add('porc')
        if key == 'lapin': flags.add('lapin')
        if key in ('moule', 'crevette', 'calamar', 'poulpe', 'saint_jacques', 'palourde', 'tourteau', 'bulot', 'crabe_miettes', 'huitre'): flags.add('fruit_de_mer')
        if key in NON_CASHER_POISSON: flags.add('poisson_sans_ecailles')
        if key == 'miel': flags.add('miel')
        if key in EPICE: flags.add('epice')
        if key in SEC_SULFITES: allerg.add('sulfites'); flags.add('sulfites_sec')
        if key in CRU_LAIT: flags.add('lait_cru')
        if key == 'feta': flags.add('feta')
        if key in SOJA: flags.add('soja_prod')
        if key in PREDATEUR: flags.add('predateur')
        if a['categorie'] == 'algue': flags.add('algue')
        if key == 'crevette' or key == 'crabe_miettes' or key == 'tourteau': flags.add('crustace_cuit')
        if key == 'persil' and g / max(r['pers'], 1) >= 15: flags.add('persil_avk')
        if key == 'pamplemousse': flags.add('pamplemousse')
        if key in ('chocolat_noir_70', 'tortilla_mais', 'galette_sarrasin', 'sarrasin', 'miso'): flags.add('etiquette_' + key)
        if key in ('cannelle',) and g / max(r['pers'], 1) > 2: flags.add('cannelle')
        if key != 'eau':
            if a['prix_portion_indicatif_eur'] is not None and a['prix_releve'] and a['prix_releve']['unite'] == '€/kg':
                cost += a['prix_releve']['valeur'] * g / 1000
            elif cat in ('epice_herbe', 'condiment') or key in ('sel',):
                pass
            else:
                cost_ok = False
    # niveaux de prix des ingrédients principaux (au moins 20 % du poids hors eau)
    for key, g, lib, q in ings:
        if key.startswith('x:') or key == 'eau': continue
        if tot and g / tot >= 0.20: lv.append(AL[key]['prix_niveau'])
    cout = round(cost / r['pers'], 2) if cost_ok else None
    if cout is not None: niveau = 1 if cout <= 1.5 else (2 if cout <= 3.5 else 3)
    else: niveau = max(lv) if lv else 1
    # cibles peau : aliments de grade B ou C pesant au moins 10 % du poids hors eau
    cibles = []
    for key, g, lib, q in ings:
        if key.startswith('x:') or key == 'eau': continue
        a = AL[key]
        if tot and g / tot >= 0.10 and a['niveau_preuve_peau'] in ('A', 'B', 'C'):
            for c in a['cibles_peau']:
                if c not in cibles: cibles.append(c)
    # saison : intersection des mois des fruits et légumes frais de saison (≥ 10 % du poids)
    sets = []; main = None
    for key, g, lib, q in sorted(ings, key=lambda x: -x[1]):
        if key.startswith('x:') or key == 'eau': continue
        a = AL[key]
        if key in ('citron', 'citron_vert', 'oignon', 'oignon_rouge', 'echalote', 'ail'): continue
        if lib and any(w in lib.lower() for w in ('concass', 'coulis', 'surgel', 'conserve')): continue
        if a['categorie'] in ('legume', 'fruit') and 0 < len(a['saison']) < 12 and tot and g / tot >= 0.10:
            sets.append(set(a['saison'])); main = main or a
    if r.get('saison'): saison = r['saison']
    elif not sets: saison = list(range(1, 13))
    else:
        inter = set.intersection(*sets)
        if inter: saison = sorted(inter)
        else:
            saison = sorted(main['saison']); notes.append('Saison de l’ingrédient principal (%s) ; les autres fruits ou légumes peuvent être pris surgelés.' % main['nom'].lower())
    # usage : quotidien si tous les ingrédients qui pèsent au moins 10 % (hors eau) sont d'usage quotidien
    rare_main = []
    for key, g, lib, q in ings:
        if key == 'eau' or not tot: continue
        if key.startswith('x:'):
            if key[2:] in X_RARE and g / tot >= 0.10: rare_main.append(X[key[2:]][0])
            continue
        if g / tot >= 0.10 and AL[key].get('usage') == 'rare': rare_main.append(AL[key]['nom'].lower())
    usage = 'rare' if rare_main else 'quotidien'
    # régimes
    veg = not ({'viande', 'volaille', 'animal_mer'} & flags)
    reg = []
    if veg: reg.append('vegetarien')
    if veg and not ({'lait', 'oeufs'} & allerg) and 'miel' not in flags: reg.append('vegan')
    if 'cereales_gluten' not in allerg: reg.append('sans_gluten')
    if 'lait' not in allerg: reg.append('sans_lactose')
    if 'porc' not in flags: reg.append('halal_possible')
    if not ({'porc', 'fruit_de_mer', 'lapin', 'poisson_sans_ecailles'} & flags) and not ({'viande', 'volaille'} & flags and 'lait' in allerg) and not ({'viande', 'volaille'} & flags and 'animal_mer' in flags): reg.append('casher_possible')
    # notes automatiques
    if r['type'] == 'jus_boisson' and not r.get('chaud') and not r.get('pas_jus'):
        notes.append("Le fruit entier garde ses fibres ; un verre de jus compte au plus pour une portion de fruits par jour (PNNS).")
        notes.append("À boire aussitôt ; grossesse : bien laver les fruits et légumes, pas de jus non pasteurisé du commerce.")
    if r.get('chaud'): notes.append('Boisson chaude : laisser tiédir en cas de rosacée (déclencheur cité par des patients).')
    if 'epice' in flags: notes.append('epice : plat pimenté, déclencheur de rougeurs cité en cas de rosacée ; réduire ou supprimer le piment.')
    if 'lait_cru' in flags: notes.append('Fromage au lait cru : à éviter pendant la grossesse (Santé.fr) ; le remplacer par un fromage au lait pasteurisé.')
    if 'feta' in flags: notes.append('Grossesse : choisir une feta au lait pasteurisé.')
    if 'soja_prod' in flags: notes.append('Contient du soja : déconseillé pendant la grossesse et l’allaitement (Santé.fr).')
    if 'predateur' in flags: notes.append('Poisson prédateur : grossesse, allaitement et jeunes enfants, au plus 150 g par semaine (ANSES).')
    if 'algue' in flags: notes.append('Algues : à éviter en cas de maladie de la thyroïde, maladie cardiaque ou rénale, grossesse et allaitement sans avis médical (ANSES).')
    if 'crustace_cuit' in flags: notes.append('Grossesse : acheter les crustacés crus et les cuire soi-même (Santé.fr déconseille les crustacés décortiqués vendus cuits).')
    if 'persil_avk' in flags: notes.append('Très persillé : sous anticoagulant AVK, garder une consommation de persil stable.')
    if 'pamplemousse' in flags: notes.append('Pamplemousse : interactions avec de nombreux médicaments ; traitement quotidien, demander au pharmacien.')
    if 'sulfites_sec' in flags: notes.append('Fruits secs : sulfites possibles selon la marque (lire l’étiquette) ; abricots secs bruns non soufrés sans sulfites.')
    if 'miel' in flags: notes.append('Miel : jamais avant 1 an.')
    if 'etiquette_chocolat_noir_70' in flags: notes.append('Chocolat : lire l’étiquette (lait, soja ou fruits à coque possibles selon la marque).')
    if 'etiquette_tortilla_mais' in flags: notes.append('Tortillas de maïs : certaines contiennent du blé, lire l’étiquette en cas de maladie cœliaque.')
    if {'etiquette_galette_sarrasin', 'etiquette_sarrasin'} & flags: notes.append('Sarrasin : sans gluten par nature, mais contamination croisée ou galettes mêlées de blé possibles ; lire l’étiquette en cas de maladie cœliaque.')
    if {'viande', 'volaille'} & flags: notes.append('Halal ou casher : utiliser une viande certifiée.')
    if 'viande' in flags: notes.append('Viande hors volaille : au plus 500 g par semaine (PNNS).')
    # contrôles
    assert 15 <= r['temps'] <= 40 or r['type'] in ('jus_boisson', 'encas', 'petit_dejeuner') and 5 <= r['temps'] <= 40, (r['id'], r['temps'])
    assert 4 <= counted <= 7, (r['id'], counted)
    txt = (r['nom'] + ' ' + ' '.join(r['etapes'])).lower()
    for w in ('détox', 'detox', 'brûle-graisse', 'anti-âge', 'antiâge', 'minceur', 'santé', 'immunit', 'booste', 'guérit', 'vin ', 'bière', 'alcool', 'rhum'):
        assert w not in txt, (r['id'], w)
    return {'id': r['id'], 'nom': r['nom'], 'type': r['type'], 'cuisine': r['cuisine'], 'saison': saison, 'temps_min': r['temps'], 'personnes': r['pers'],
            'ingredients': items, 'etapes': r['etapes'], 'allergenes_UE': [a for a in ALLERG_ORDER if a in allerg], 'regimes': reg, 'prix_niveau': niveau,
            'cout_portion_indicatif_eur': cout, 'cibles_peau': cibles, 'usage': usage, 'notes': notes,
            'photo_prompt': (PHOTO_BOISSON if r['type'] == 'jus_boisson' else PHOTO) % r['en']}

for f in sorted(glob.glob(os.path.join(HERE, 'rec_*.py'))):
    exec(open(f, encoding='utf-8').read(), {'R': R})
ids = [r['id'] for r in RECS]; assert len(ids) == len(set(ids)), [i for i in ids if ids.count(i) > 1]
out = [build(r) for r in RECS]
meta = {'version': '1.0', 'date': '2026-09-30', 'nombre': len(out),
 'objectif': '300 recettes : 50 jus_boisson, 40 petit_dejeuner, 60 entree, 90 plat, 45 dessert, 15 encas',
 'methode': "Recettes maison simples (4 à 7 ingrédients hors eau et sel), construites avec les aliments de aliments_v2.json. Allergènes UE, régimes, cibles peau, saison et prix CALCULÉS par script ingrédient par ingrédient à partir de aliments_v2.json (générateur : genere_recettes.py).",
 'regles': "Aucune allégation de santé ; aucun alcool ; pas de poisson ni de fruits de mer crus, pas d'œuf cru, pas de graines germées crues ; plats pimentés signalés « epice » dans notes (rosacée). Temps : 15 à 40 min pour les plats, entrées et desserts ; 5 à 40 min pour les jus, boissons, petits-déjeuners et en-cas.",
 'allergenes': "Les 14 allergènes UE (annexe II du Règlement 1169/2011) : un allergène est listé dès qu'un ingrédient le contient ; sulfites listés dès qu'un fruit sec potentiellement soufré est utilisé (principe de précaution).",
 'regimes': "vegetarien : ni viande, ni volaille, ni poisson, ni fruits de mer ; vegan : en plus ni lait, ni œuf, ni miel ; sans_gluten / sans_lactose : aucun ingrédient contenant gluten / lait (contamination croisée non évaluée) ; halal_possible : ni porc ni alcool (viande certifiée nécessaire) ; casher_possible : ni porc, ni lapin, ni fruits de mer, ni poisson sans écailles, pas de viande avec du lait ni avec du poisson (viande certifiée nécessaire).",
 'prix': "cout_portion_indicatif_eur calculé seulement si TOUS les ingrédients (hors épices, herbes, sel, eau) ont un relevé de prix public daté (INSEE ou Familles Rurales, voir aliments_v2.json) ; sinon null. prix_niveau = niveau du coût par portion (≤ 1,50 € : 1 ; ≤ 3,50 € : 2 ; au-delà : 3), sinon le niveau le plus élevé des ingrédients qui pèsent au moins 20 % de la recette.",
 'cibles_peau': "Réunion des cibles des aliments de grade B ou C qui pèsent au moins 10 % de la recette (hors eau). Information pour le classement ; aucune allégation sur la recette.",
 'saison': "Intersection des mois de saison des fruits et légumes frais qui pèsent au moins 10 % de la recette (citron, oignon, ail et échalote ignorés, ainsi que les ingrédients en conserve ou surgelés) ; si vide, saison de l'ingrédient principal (note) ; 12 mois si aucun produit de saison.",
 'usage': "quotidien si tous les ingrédients qui pèsent au moins 10 % de la recette (hors eau) sont d'usage quotidien dans aliments_v2.json ; sinon rare.",
 'photo_prompt': "Description anglaise d'une photo studio homogène (céramique mate, pierre beige chaude, lumière du jour douce)."}
json.dump({'_meta': meta, 'recettes': out}, open(os.path.join(NUT, 'recettes.json'), 'w'), ensure_ascii=False, indent=1)
import collections
print(len(out), collections.Counter(r['type'] for r in out), collections.Counter(r['cuisine'] for r in out))
