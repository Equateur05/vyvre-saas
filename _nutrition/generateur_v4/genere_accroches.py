import json, re, sys, copy, collections
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from accroches_src import A

BASE = '/Users/charles/Documents/vyvre-saas-scan/_nutrition/'
src = json.load(open(BASE + 'aliments_v3.json'))
orig = copy.deepcopy(src)
al = src['aliments']
ids = [x['id'] for x in al]
errs = []
miss = set(ids) - set(A); extra = set(A) - set(ids)
if miss or extra: errs.append(f'ids manquants {miss} / en trop {extra}')

NNBSP = ' '; NBSP = ' '
def typo(t):
    t = t.replace("'", '’')
    t = re.sub(r' ([:;!?])', NNBSP + r'\1', t)
    t = t.replace('« ', '«' + NNBSP).replace(' »', NNBSP + '»')
    t = re.sub(r'(\d) (%|°C)', r'\1' + NBSP + r'\2', t)
    return t

# Nutriments admis dans une accroche (voir ACCROCHES.md)
NRV = {'vitamine_c_mg': (80, 'mg', 'vitamine C'), 'vitamine_e_mg': (12, 'mg', 'vitamine E'),
       'zinc_mg': (10, 'mg', 'zinc'), 'selenium_ug': (55, 'µg', 'sélénium'), 'iode_ug': (150, 'µg', 'iode'),
       'niacine_mg': (16, 'mg', 'niacine'), 'riboflavine_mg': (1.4, 'mg', 'riboflavine'), 'cuivre_mg': (1, 'mg', 'cuivre')}
CAT_SANS_ALLEGATION = {'epice_herbe', 'condiment', 'algue', 'sucre', 'boisson', 'cacao'}
# portion cuite mais valeurs CIQUAL crues (revue A16) : pas de vitamine C
CRU_CUIT = {'haricot_vert', 'poireau', 'navet', 'courgette', 'petits_pois', 'haricot_beurre', 'rutabaga',
            'chou_bruxelles', 'coing', 'courge_butternut'}

def verifie(x, niv, nut):
    L = "riche en" if niv == "riche" else "source de"
    t = x['ciqual']['teneurs_pour_100g']; kcal = t.get('energie_kcal'); code = x['ciqual']['code']
    src_ = f"CIQUAL 2020 code {code} « {x['ciqual']['nom_ciqual']} »"
    if x['categorie'] in CAT_SANS_ALLEGATION: return None, 'catégorie exclue'
    if nut == 'fibres':
        v = t.get('fibres_g') or 0; seuil = 6 if niv == 'riche' else 3
        if v >= seuil: return f"{L} fibres : {v} g de fibres pour 100 g (seuil {seuil} g/100 g), {src_}", 'ok'
    elif nut == 'proteines':
        if not kcal: return None, 'énergie absente'
        p = t.get('proteines_g') or 0; pc = p * 4 / kcal * 100; seuil = 20 if niv == 'riche' else 12
        if pc >= seuil: return f"{L} protéines : {p} g pour {kcal} kcal = {pc:.1f} % de l'énergie (seuil {seuil} %), {src_}", 'ok'
    elif nut == 'omega3':
        ala = t.get('ala_g') or 0; ed = t.get('epa_dha_mg') or 0
        k = kcal if kcal else 900.0
        s_ala, s_ed = (0.6, 80) if niv == 'riche' else (0.3, 40)
        note = '' if kcal else ' (énergie absente du fichier : borne prudente de 900 kcal/100 g, maximum physique)'
        if ala >= s_ala and ala / k * 100 >= s_ala:
            return (f"{L} acides gras oméga-3 : ALA {ala} g/100 g et {ala / k * 100:.2f} g/100 kcal"
                    f" (seuil {s_ala} g pour 100 g et pour 100 kcal){note}, {src_}"), 'ok'
        if ed >= s_ed and ed / k * 100 >= s_ed:
            return (f"{L} acides gras oméga-3 : EPA+DHA {ed} mg/100 g et {ed / k * 100:.0f} mg/100 kcal"
                    f" (seuil {s_ed} mg pour 100 g et pour 100 kcal){note}, {src_}"), 'ok'
    elif nut in NRV:
        if nut == 'vitamine_c_mg' and x['id'] in CRU_CUIT: return None, 'cru/cuit'
        vnr, u, lib = NRV[nut]; v = t.get(nut) or 0; pc = v / vnr * 100; seuil = 30 if niv == 'riche' else 15
        if pc >= seuil: return f"{L} {lib} : {v} {u}/100 g = {pc:.1f} % de la VNR ({vnr} {u}, seuil {seuil} %), {src_}", 'ok'
    else:
        return None, 'nutriment non admis'
    return None, 'seuil non atteint'

PHRASE = {'fibres': 'fibres', 'proteines': 'protéines', 'omega3': 'acides gras oméga-3'}
for k, (_, _, lib) in NRV.items(): PHRASE[k] = lib

INTERDITS = [r'bon(ne)? pour', r'prot[eè]g', r'protect', r'\banti-', r'antioxy', r'boost', r'd[ée]tox', r'\bsuper',
    r'[ée]clat', r'jeunesse', r'immun', r'dig[eè]st', r'[ée]nergi', r'bienfait', r'sant[ée]', r'\bsaine?s?\b',
    r'vitalit', r'minceur', r'calori', r'transit', r'vertu', r'rem[eè]de', r'soign', r'gu[ée]ri', r'pr[ée]vien',
    r'pr[ée]ven', r'cholest', r'c[œo]eur', r'cardi', r'cerveau', r'm[ée]moire', r'sommeil', r'dormir', r'stress',
    r'inflamm', r'probiot', r'pr[ée]biot', r'vivant', r'[ée]tude', r'prouv', r'scientif', r'm[ée]dec', r'nutrition',
    r'min[ée]ra', r'collag', r'\bride', r'\bteint\b', r'glow', r'hydrat', r'd[ée]salt', r'rassas', r'sati[ée]t',
    r'[ée]quilibr', r'naturel', r'light', r'all[ée]g', r'r[ée]confort', r'coupab', r'\bpeau', r'\bforme\b',
    r'purif', r'drain', r'br[uû]le', r'm[ée]tabol', r'ventre', r'poids', r'maigr', r'\bsucre ajout', r'id[ée]al pour',
    r'vitamine', r'oméga', r'fibre', r'protéine', r'\bzinc', r'cuivre', r's[ée]l[ée]nium', r'\biode\b',
    r'niacine', r'riboflavine', r'\bfer\b', r'calcium', r'magn[ée]sium', r'potassium', r'bêta|beta']
# les mots nutriments ne sont admis que dans la formule légale exacte, retirée avant ce contrôle

rapport = []
for x in al:
    txt, cl = A[x['id']]
    t = typo(txt)
    if len(t) > 140: errs.append(f"{x['id']} trop long ({len(t)})")
    reste = t
    if cl:
        niv, nut = cl
        just, st = verifie(x, niv, nut)
        if st != 'ok': errs.append(f"{x['id']} allégation {cl} refusée : {st}")
        # formule exacte : « riche(s) en X » / « source de X » (« source d’acides… »)
        lib = PHRASE[nut]
        if niv == 'riche': pat = r'[Rr]iches? en ' + re.escape(lib)
        else: pat = r'[Ss]ource d(e |’)' + re.escape(lib)
        m = re.search(pat, t)
        if not m: errs.append(f"{x['id']} formule légale absente : {pat}")
        else: reste = t[:m.start()] + t[m.end():]
        x['accroche_nutrition_verifiee'] = True
        x['accroche_justif'] = just
    else:
        x['accroche_nutrition_verifiee'] = False
        x['accroche_justif'] = None
    if re.search(r'[Rr]iches? en|[Ss]ource d', reste): errs.append(f"{x['id']} mot d'allégation hors formule")
    for w in INTERDITS:
        if re.search(w, reste, re.I): errs.append(f"{x['id']} mot interdit /{w}/ : {t}")
    x['accroche'] = t
    rapport.append((x['id'], len(t)))

# ordre des clés : accroche après usage/tendance, en fin d'objet
if errs:
    print('\n'.join(errs)); print(len(errs), 'erreurs'); sys.exit(1)

# vérification : tous les autres champs inchangés
NEW = {'accroche', 'accroche_nutrition_verifiee', 'accroche_justif'}
assert orig['_meta'] == src['_meta'] or True
for o, n in zip(orig['aliments'], al):
    assert o['id'] == n['id']
    assert {k: v for k, v in n.items() if k not in NEW} == o, o['id']
    assert set(n) - set(o) == NEW
assert len(al) == len(orig['aliments']) == 265

src['_meta']['version'] = '4.0'
src['_meta']['description_v4'] = ("v4 : les 265 aliments de v3 sont repris sans modification de leurs champs, avec trois champs ajoutés : "
    "« accroche » (une ou deux phrases culinaires et sensorielles, sans allégation de santé), « accroche_nutrition_verifiee » "
    "(true si l'accroche contient une allégation nutritionnelle de l'annexe du Règlement 1924/2006, seuil vérifié) et "
    "« accroche_justif » (nutriment, valeur CIQUAL et seuil ; null sinon). Règles : _nutrition/ACCROCHES.md.")
json.dump(src, open(BASE + 'aliments_v4.json', 'w'), ensure_ascii=False, indent=1)
# re-vérification sur le fichier écrit
w = json.load(open(BASE + 'aliments_v4.json'))
for k in orig['_meta']: assert w['_meta'][k] == orig['_meta'][k] or k == 'version', k
for o, n in zip(orig['aliments'], w['aliments']):
    assert {k: v for k, v in n.items() if k not in NEW} == o
print('OK', len(w['aliments']), 'aliments ;', sum(x['accroche_nutrition_verifiee'] for x in w['aliments']), 'avec allégation nutritionnelle')
L = [l for _, l in rapport]; print('longueur min/moy/max', min(L), sum(L) // len(L), max(L))
c = collections.Counter(re.sub(r'[^\w\s]', '', a).lower() for x in w['aliments'] for a in [x['accroche']] )
mots = collections.Counter(m for x in w['aliments'] for m in re.findall(r"\w+", x['accroche'].lower()) if len(m) > 5)
print(mots.most_common(40))
