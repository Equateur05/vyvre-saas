"""Pour chaque actif de combos.json : les produits du catalogue en ligne (all.json) qui le contiennent.
Les ingredients sont dans catalogue/<marque>.json (champ « ingredients »), joints par id.
Rang : la position de l'actif dans la liste INCI (plus il est tot, plus il est concentre, en UE
les ingredients au-dessus de 1 % sont listes par ordre decroissant). Ecrans : categorie ou SPF dans le nom."""
import json, re, glob, os
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(RACINE, 'public/scan/catalogue')
combos = json.load(open(os.path.join(RACINE, '_nutrition/combos.json')))
enligne = {p['id']: p for p in json.load(open(os.path.join(CAT, 'all.json')))['products']}
inci = {}
for f in glob.glob(os.path.join(CAT, '*.json')):
    if os.path.basename(f) in ('all.json', '_controle.json'): continue
    try: d = json.load(open(f))
    except Exception: continue
    for p in (d.get('products') if isinstance(d, dict) else d) or []:
        ing = p.get('ingredients')
        if isinstance(ing, list): ing = ', '.join(map(str, ing))
        if ing and p.get('id'): inci[p['id']] = str(ing).lower()
EXCLU = re.compile(r'\b(US|USA)\s*ONLY\b|^\s*\[subscr', re.I)
def fiche(p, pos):
    return {'id': p['id'], 'n': p.get('name'), 'b': p.get('brand_name') or p.get('brand'), 'brand': p.get('brand'), 'img': p.get('cutout_url') or p.get('image_url'),
            'url': p.get('url'), 'cat': p.get('categorie'), 'pays': p.get('pays'), 'pos': pos}
sortie = {}
for a in combos['actifs']:
    res = []
    for pid, p in enligne.items():
        if EXCLU.search(p.get('name') or ''): continue
        if a['id'] == 'protection_solaire':
            if p.get('categorie') == 'solaire-visage' or re.search(r'\bSPF\s?\d{2}', p.get('name') or '', re.I): res.append(fiche(p, 0))
            continue
        txt = inci.get(pid)
        if not txt: continue
        # la liste brute peut etre suivie de texte parasite : on coupe au premier long paragraphe
        items = [i.strip() for i in re.split(r',|•|;', txt.split('\n')[0]) if i.strip()]
        pos = next((k for k, it in enumerate(items) for m in a['inci_mots_cles'] if m in it), None)
        if pos is None: continue
        if a['id'] == 'humectants' and pos > 4: continue   # la glycerine est partout : seulement si elle est parmi les 5 premiers
        res.append(fiche(p, pos))
    res.sort(key=lambda r: (r['pos'], r['n'] or ''))
    sortie[a['id']] = res[:60]
    print(a['id'], len(res))
json.dump({'_meta': {'date': '2026-09-30', 'regle': "position de l'actif dans la liste INCI ; ecrans par categorie ou SPF dans le nom ; seulement les produits en ligne (all.json)"}, 'actifs': sortie},
          open(os.path.join(RACINE, 'public/scan/aliment/actifs_produits.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
