#!/usr/bin/env python3
"""Catalogue v2 : FUSION des 3 sources + SCORES par produit.
Ecrit uniquement dans catalogue-v2/sortie/. Ne touche pas au site.
Usage : python3 catalogue-v2/fusion_scores.py
"""
import json, glob, os, re, math, unicodedata, collections as C, shutil
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(HERE, 'sortie')
AXES = ['wrinkles', 'firmness', 'glow', 'hydration', 'redness', 'pores', 'sebum', 'pigmentation']
FAUSSES = {'sephora', 'ulta', 'cult-beauty', 'space-nk', 'oh-my-cream', 'neko-health', 'tally-health', 'elysium', 'blueprint'}
REVENDEURS = ['sephora', 'notino', 'ulta.com', 'cultbeauty', 'spacenk', 'ohmycream', 'amazon.', 'lookfantastic', 'nocibe',
              'marionnaud', 'douglas', 'pharmacie', 'pharma-gdd', 'boots.com', 'feelunique', 'yesstyle', 'stylevana',
              'oliveyoung', 'galerieslafayette', 'printemps.com', 'bonpoint', 'mecca.com', 'nordstrom', 'target.com',
              'walmart', 'cvs.com', 'walgreens', 'dermstore', 'skinstore', 'beautybay', 'jolse', 'soko', 'ebay', 'aliexpress']
CATS = {'nettoyant', 'lotion', 'serum', 'creme', 'contour-yeux', 'masque', 'exfoliant', 'huile', 'solaire-visage', 'autre-visage'}
# Hors soin visage repere a la main dans les noms (appareil, maquillage)
EXCLUS_NOM = re.compile(r"cryo sculpting globes|vitamin enriched (face|eye) base", re.I)


def deaccent(s):
    return ''.join(c for c in unicodedata.normalize('NFKD', s or '') if not unicodedata.combining(c))


def norm_txt(s):
    s = unicodedata.normalize('NFC', deaccent(s)).lower().replace('’', "'")
    return re.sub(r'\s+', ' ', s)


def norm_url(u):
    p = urlparse((u or '').strip())
    host = p.netloc.lower()
    path = re.sub(r'/+$', '', p.path)
    # Query retiree SAUF les parametres qui identifient la fiche (sites coreens : ?branduid=, ?product_no=...).
    # Sans cette exception, 93 produits Mizon et 46 Some By Mi fusionnaient en 1 seul.
    garde = sorted(kv for kv in p.query.split('&') if kv and re.match(r'(branduid|product_no|pid|product_id|productid|idx|goodsno|it_id|no)=', kv, re.I))
    return host + path.lower() + ('?' + '&'.join(garde) if garde else '')


SIZE = re.compile(r"\b\d+([.,]\d+)?\s*(ml|g|gr|oz|fl\.?\s?oz|l|cl|mg|pcs?|pieces|x\s?\d+)\b|\bx\s?\d+\b")


def norm_name(name, brand_name):
    s = unicodedata.normalize('NFC', norm_txt(name))  # NFC : ne pas decomposer le hangeul en jamos
    s = SIZE.sub(' ', s)
    s = re.sub(r'[®™©]', '', s)
    s = re.sub(r"[^a-z0-9%가-힣 ]+", ' ', s)
    b = re.sub(r"[^a-z0-9 ]+", ' ', norm_txt(brand_name)).strip()
    s = re.sub(r'\s+', ' ', s).strip()
    if b and s.startswith(b + ' '):
        s = s[len(b) + 1:]
    return s


def completude(p):
    sc = 0
    if p.get('price_eur') is not None: sc += 4
    if p.get('ingredients'): sc += 4
    if p.get('image_local') and os.path.exists(os.path.join(ROOT, p['image_local'])): sc += 3
    if p.get('description'): sc += 1
    sc += min(len(p.get('claims') or []), 5) * 0.1
    return sc


# ------------------------------------------------------------------ INCI
JUNK = re.compile(r"add to cart|you may also|view all|subscribe|les listes d|ingredients? list|share|close|refresh|\[|la creme|popular categories", re.I)


def split_inci(txt):
    if not txt:
        return []
    t = deaccent(txt).replace('•', ',').replace('·', ',').replace(';', ',')
    t = re.sub(r'^\s*(ingredients?|inci|composition)\s*:?', '', t, flags=re.I)
    toks = [x.strip(' .*\n\t') for x in re.split(r',(?!\d)', t)]
    out = []
    for tok in toks:
        if not tok:
            continue
        m = JUNK.search(tok)
        words = tok.split()
        if m or len(words) > 8:
            cut = tok[:m.start()] if m else ' '.join(words[:5])
            if cut.strip():
                out.append(cut.strip().lower())
            break
        out.append(tok.lower())
    return out


# ------------------------------------------------------------------ TABLE D'ACTIFS
# (nom lisible, regex sur un element INCI, {axe: poids}, condition de position max ou None)
ACTIFS = [
    ('acide hyaluronique', r'hyaluron', {'hydration': 1.0, 'wrinkles': 0.15}, None),
    ('glycerine en tete', r'^glycerin', {'hydration': 0.5}, 3),
    ('ceramides', r'ceramide', {'hydration': 0.7, 'redness': 0.25}, None),
    ('squalane', r'squalane', {'hydration': 0.5}, None),
    ('uree', r'^urea\b', {'hydration': 0.7}, None),
    ('panthenol', r'panthenol', {'hydration': 0.4, 'redness': 0.35}, None),
    ('aloe', r'aloe barbadensis', {'hydration': 0.35, 'redness': 0.3}, None),
    ('polyglutamate', r'polyglutam', {'hydration': 0.7}, None),
    ('betaine/trehalose/PCA', r'^betaine$|trehalose|^sodium pca', {'hydration': 0.35}, None),
    ('beurre de karite', r'butyrospermum|shea butter', {'hydration': 0.35}, None),
    ('beta-glucane', r'beta-glucan', {'hydration': 0.4, 'redness': 0.3}, None),
    ('tremella', r'tremella', {'hydration': 0.4}, None),
    ('mucine d\'escargot', r'snail secretion', {'hydration': 0.4, 'firmness': 0.25, 'redness': 0.2}, None),
    ('huile de jojoba', r'simmondsia', {'hydration': 0.3, 'sebum': 0.1}, None),
    ('occlusifs', r'^petrolatum|^paraffinum liquidum|mineral oil', {'hydration': 0.3}, 6),
    ('retinol', r'^retinol\b', {'wrinkles': 1.0, 'firmness': 0.6, 'pigmentation': 0.35, 'pores': 0.2, 'glow': 0.2}, None),
    ('retinal', r'retinal', {'wrinkles': 1.0, 'firmness': 0.6, 'pigmentation': 0.35, 'glow': 0.2}, None),
    ('ester de retinol', r'retinyl', {'wrinkles': 0.6, 'firmness': 0.35, 'pigmentation': 0.2}, None),
    ('retinoate (HPR)', r'hydroxypinacolone retinoate|granactive retinoid', {'wrinkles': 0.85, 'firmness': 0.5, 'pigmentation': 0.25}, None),
    ('adapalene', r'adapalene', {'pores': 0.9, 'sebum': 0.5, 'wrinkles': 0.4}, None),
    ('bakuchiol', r'bakuchiol', {'wrinkles': 0.75, 'firmness': 0.45, 'pigmentation': 0.2}, None),
    ('peptides', r'peptide|matrixyl|argireline|palmitoyl (tri|tetra|penta|hexa|oligo)', {'wrinkles': 0.7, 'firmness': 0.7}, None),
    ('collagene', r'collagen', {'firmness': 0.5, 'wrinkles': 0.3, 'hydration': 0.2}, None),
    ('adenosine', r'^adenosine', {'wrinkles': 0.6, 'firmness': 0.3}, None),
    ('elastine', r'elastin', {'firmness': 0.35}, None),
    ('coenzyme Q10', r'ubiquinone|coenzyme q', {'wrinkles': 0.4, 'glow': 0.2}, None),
    ('DMAE', r'dimethyl mea|dmae', {'firmness': 0.5}, None),
    ('PDRN', r'sodium dna|pdrn|polydeoxyribonucleotide', {'wrinkles': 0.5, 'firmness': 0.4, 'redness': 0.2}, None),
    ('vitamine C pure', r'^ascorbic acid|3-o-ethyl ascorbic|ethyl ascorbic', {'glow': 1.0, 'pigmentation': 0.8, 'wrinkles': 0.4, 'firmness': 0.3}, None),
    ('vitamine C stable', r'tetrahexyldecyl ascorbate|ascorbyl tetraisopalmitate|ascorbyl glucoside|sodium ascorbyl phosphate|magnesium ascorbyl phosphate', {'glow': 0.85, 'pigmentation': 0.7, 'wrinkles': 0.35, 'firmness': 0.25}, None),
    ('palmitate d\'ascorbyle', r'ascorbyl palmitate', {'glow': 0.35, 'pigmentation': 0.2}, None),
    ('niacinamide', r'niacinamide', {'pores': 0.8, 'sebum': 0.7, 'glow': 0.7, 'pigmentation': 0.7, 'redness': 0.35}, None),
    ('acide glycolique', r'glycolic acid', {'glow': 0.85, 'pigmentation': 0.5, 'pores': 0.45, 'wrinkles': 0.3}, None),
    ('acide lactique', r'^lactic acid', {'glow': 0.7, 'pigmentation': 0.35, 'hydration': 0.2}, 15),
    ('acide mandelique', r'mandelic acid', {'glow': 0.6, 'pores': 0.5, 'pigmentation': 0.4}, None),
    ('PHA', r'gluconolactone|lactobionic', {'glow': 0.5, 'hydration': 0.2, 'redness': 0.1}, None),
    ('acide salicylique / BHA', r'salicylic acid|betaine salicylate|salix alba|willow bark', {'pores': 1.0, 'sebum': 0.8, 'glow': 0.3}, None),
    ('zinc (PCA/gluconate)', r'zinc (pca|gluconate|sulfate|sulphate|lactate)', {'sebum': 0.8, 'pores': 0.4, 'redness': 0.2}, None),
    ('argile / charbon', r'kaolin|bentonite|\bclay\b|illite|montmorillonite|charcoal', {'sebum': 0.8, 'pores': 0.7}, None),
    ('soufre', r'^sulfur|^sulphur', {'pores': 0.7, 'sebum': 0.6}, None),
    ('tea tree', r'melaleuca alternifolia|tea tree', {'pores': 0.6, 'sebum': 0.5}, None),
    ('acide azelaique', r'azelaic|azeloyl', {'pigmentation': 0.7, 'pores': 0.6, 'redness': 0.6, 'sebum': 0.4}, None),
    ('acide succinique', r'succinic acid', {'pores': 0.5, 'sebum': 0.3}, None),
    ('acide tranexamique', r'tranexamic', {'pigmentation': 1.0, 'redness': 0.2}, None),
    ('arbutine', r'arbutin', {'pigmentation': 1.0}, None),
    ('acide kojique', r'kojic', {'pigmentation': 0.9}, None),
    ('resorcinols (thiamidol...)', r'resorcinol', {'pigmentation': 0.95}, None),
    ('reglisse (glabridine)', r'glabridin|glycyrrhiza glabra|licorice', {'pigmentation': 0.6, 'redness': 0.5}, None),
    ('glycyrrhizate', r'glycyrrhizate', {'redness': 0.5}, None),
    ('glutathion', r'glutathione', {'pigmentation': 0.6, 'glow': 0.3}, None),
    ('centella / madecassoside', r'centella|madecass|asiaticoside|asiatic acid', {'redness': 1.0, 'hydration': 0.2, 'firmness': 0.15}, None),
    ('allantoine', r'allantoin', {'redness': 0.45}, None),
    ('bisabolol', r'bisabolol', {'redness': 0.6}, None),
    ('avoine', r'avena sativa|colloidal oat', {'redness': 0.6, 'hydration': 0.25}, None),
    ('eau thermale', r'thermal|spring water|eau thermale', {'redness': 0.5}, None),
    ('camomille / calendula', r'chamomilla|anthemis nobilis|calendula', {'redness': 0.4}, None),
    ('armoise / houttuynia', r'artemisia|houttuynia', {'redness': 0.45, 'sebum': 0.15}, None),
    ('the vert', r'camellia sinensis|epigallocatechin', {'redness': 0.3, 'sebum': 0.2, 'glow': 0.1}, None),
    ('ectoine', r'ectoin', {'redness': 0.5, 'hydration': 0.3}, None),
    ('cafeine', r'^caffeine', {'firmness': 0.4, 'redness': 0.15}, None),
    ('acide ferulique', r'ferulic', {'glow': 0.4, 'wrinkles': 0.3}, None),
    ('resveratrol', r'resveratrol', {'wrinkles': 0.35, 'glow': 0.3}, None),
    ('ferments (galactomyces...)', r'galactomyces|saccharomyces.*ferment|rice ferment', {'glow': 0.5, 'pigmentation': 0.25}, None),
    ('propolis', r'propolis', {'redness': 0.3, 'glow': 0.3}, None),
    ('probiotiques', r'lactobacillus|bifida', {'redness': 0.3, 'hydration': 0.2}, None),
    ('huile de rose musquee', r'rosa canina|rosa rubiginosa', {'glow': 0.3, 'pigmentation': 0.2, 'wrinkles': 0.2}, None),
]
FILTRES_UV = r'ethylhexyl triazone|bis-ethylhexyloxyphenol|butyl methoxydibenzoylmethane|avobenzone|^zinc oxide|octocrylene|homosalate|drometrizole|terephthalylidene|diethylamino hydroxybenzoyl|methylene bis-benzotriazolyl|ethylhexyl methoxycinnamate|octinoxate|octisalate|tris-biphenyl triazine|phenylbenzimidazole'
ACTIFS = [(n, re.compile(r), w, pmax) for n, r, w, pmax in ACTIFS]
FILTRES_UV = re.compile(FILTRES_UV)

# Mots des claims / nom / description (texte sans accents, minuscules)
MOTS = [
    ('hydratant', r'hydrat|moistur|hydra\b|repulp|plump|gorge d.eau|deshydrat|dewy', {'hydration': 0.8}),
    ('nourrissant', r'nourri|nutri|nourish|confort', {'hydration': 0.45}),
    ('acide hyaluronique (texte)', r'hyaluron', {'hydration': 0.6}),
    ('anti-rides', r'anti-?rides?|\brides\b|ridule|wrinkle|fine lines|anti-?age|anti-?aging|age defy|jeunesse|youth|rejuven|longevit|premiers signes', {'wrinkles': 0.8, 'firmness': 0.25}),
    ('lissant', r'lissant|smooth', {'wrinkles': 0.35}),
    ('retinol (texte)', r'retino|retinal|bakuchiol', {'wrinkles': 0.7, 'firmness': 0.3}),
    ('peptides (texte)', r'peptide|collag', {'firmness': 0.5, 'wrinkles': 0.35}),
    ('fermete', r'fermete|raffermi|\blift|firm|tenseur|tighten|sculpt|densi|elastic|rebond|bounce|remodel|volum|ovale', {'firmness': 0.85, 'wrinkles': 0.2}),
    ('eclat', r'eclat|radian|glow|illumin|lumin|bright|bonne mine|teint terne|dull|revitalis|energi', {'glow': 0.8}),
    ('vitamine C (texte)', r'vitamin[e]? c\b|vita c|ascorbi', {'glow': 0.6, 'pigmentation': 0.4}),
    ('exfoliant', r'exfoli|peeling|\baha\b|resurfac|gommage|scrub|renouvel|renewal', {'glow': 0.5, 'pores': 0.35}),
    ('antioxydant', r'anti-?oxy|antioxid|anti-?pollution|defatig|anti-?fatigue', {'glow': 0.3, 'wrinkles': 0.15}),
    ('apaisant', r'apais|calm|sooth|rougeur|redness|\bcica|irrit|atopi|intoleran|reactiv|couperose|rosacea|relief', {'redness': 0.85}),
    ('peaux sensibles', r'sensib|sensitive|tolerance', {'redness': 0.5}),
    ('reparateur', r'repar|repair|barri|restor|recover|sos', {'redness': 0.4, 'hydration': 0.25}),
    ('pores', r'\bpores?\b|pore-|poremiz|grain de peau|resserr|refin', {'pores': 0.8}),
    ('anti-imperfections', r'imperfection|blemish|acne|bouton|pimple|point noir|blackhead|comedo|spot (treatment|gel|patch)|breakout|clear', {'pores': 0.8, 'sebum': 0.45}),
    ('purifiant', r'purifi|clarif|detox|desincrust|deep clean|nettoyage profond', {'pores': 0.5, 'sebum': 0.45}),
    ('matifiant', r'matif|mattif|\bmat\b|sebum|sebo|brillance|shine|oil control|oil-free|peau grasse|peaux grasses|oily|mixte', {'sebum': 0.85, 'pores': 0.25}),
    ('BHA/salicylique (texte)', r'salicyl|\bbha\b', {'pores': 0.6, 'sebum': 0.4}),
    ('argile (texte)', r'argile|\bclay|charbon|charcoal|mud|boue', {'sebum': 0.5, 'pores': 0.45}),
    ('niacinamide (texte)', r'niacinamid', {'pores': 0.45, 'sebum': 0.35, 'glow': 0.35, 'pigmentation': 0.35}),
    ('anti-taches', r'tache|dark spot|age spot|pigment|uniform|even tone|even skin|melasma|discolor|whiten|blanc|tone|mela|txa|tranexam|arbutin|kojic', {'pigmentation': 0.85, 'glow': 0.2}),
    ('anti-cernes', r'cerne|dark circle|poche|puff', {'firmness': 0.3, 'pigmentation': 0.3, 'redness': 0.1}),
    ('protection solaire', r'spf|solaire|\bsun|\buv|ecran|protection solaire', {'pigmentation': 0.5, 'wrinkles': 0.3}),
    # --- signaux faibles de texture / positionnement (departagent les fiches pauvres en actifs)
    ('texture riche', r'baume|balm|riche|\brich|butter|beurre|cold.?cream|peaux? seches?|dry skin|dessech', {'hydration': 0.4}),
    ('texture legere', r'\bgel\b|gelee|jelly|fluide|fluid|\blight|legere|\baqua|water|\beau\b|brume|mist|essence|toner|tonique', {'hydration': 0.3, 'sebum': 0.15}),
    ('demaquillant doux', r'demaquill|make-?up remover|micellaire|micellar|douceur|gentle|\bdou(x|ce)\b|cleansing balm|milk|\blait\b', {'redness': 0.3, 'hydration': 0.1}),
    ('soin de nuit', r'\bnuit|night|overnight|sleeping|regener|recharg', {'wrinkles': 0.3, 'hydration': 0.2}),
    ('positionnement prestige', r'prestige|supreme|absolu|precious|caviar|\bgold|\bor\b|diamond|platinum|excellence|ultimate|cellul|orchid|imperial|royal', {'wrinkles': 0.4, 'firmness': 0.3}),
    ('floral apaisant', r'\brose|flower|fleur|floral|neroli|lavand|jasmin|camomil|bleuet|cornflower', {'redness': 0.25, 'glow': 0.15}),
    ('peau mixte', r'mixte|combination|equilibr|balanc|normalis', {'sebum': 0.35, 'pores': 0.2}),
    ('vitamines', r'vitamin|vitamine|antioxyd', {'glow': 0.2}),
    ('soin de jour', r'\bjour\b|\bday\b|daily|quotidien', {'glow': 0.15, 'pigmentation': 0.1}),
    ('homme', r'\bmen\b|homme|for him', {'sebum': 0.15, 'redness': 0.15}),
]
MOTS = [(n, re.compile(r), w) for n, r, w in MOTS]

# Prior de categorie (raw ajoute) et multiplicateurs par axe
CAT_PRIOR = {
    'nettoyant': {'pores': 0.25, 'sebum': 0.3},
    'lotion': {'hydration': 0.2},
    'serum': {},
    'creme': {'hydration': 0.3},
    'contour-yeux': {'wrinkles': 0.45, 'firmness': 0.45},
    'masque': {'hydration': 0.2},
    'exfoliant': {'glow': 0.55, 'pores': 0.5, 'pigmentation': 0.15},
    'huile': {'hydration': 0.35, 'glow': 0.2},
    'solaire-visage': {'pigmentation': 0.6, 'wrinkles': 0.4},
    'autre-visage': {},
}
CAT_MULT = {
    'nettoyant': {'_': 0.7, 'pores': 0.85, 'sebum': 0.85},
    'lotion': {'_': 0.85},
    'serum': {'_': 1.05},
    'creme': {'_': 0.95},
    'contour-yeux': {'_': 0.9, 'pores': 0.45, 'sebum': 0.45, 'wrinkles': 1.0, 'firmness': 1.0},
    'masque': {'_': 0.85},
    'exfoliant': {'_': 0.8, 'glow': 0.95, 'pores': 0.95},
    'huile': {'_': 0.85, 'sebum': 0.55, 'pores': 0.7},
    'solaire-visage': {'_': 0.8, 'pigmentation': 0.95, 'wrinkles': 0.9},
    'autre-visage': {'_': 0.9},
}
AXE_FR = {'wrinkles': 'rides', 'firmness': 'fermete', 'glow': 'eclat', 'hydration': 'hydratation', 'redness': 'rougeurs',
          'pores': 'pores', 'sebum': 'sebum', 'pigmentation': 'taches'}
DIMIN = [1.0, 0.65, 0.45, 0.32, 0.24, 0.18, 0.14, 0.11]


def posf(pos):
    return 0.3 + 0.7 * math.exp(-pos / 7.0)


def score_produit(p):
    cat = p['categorie']
    inci = split_inci(p.get('ingredients'))
    has_inci = len(inci) >= 5
    contrib = {a: [] for a in AXES}   # (valeur, raison)
    raisons = []
    found = set()

    # 1. INCI
    uv = False
    for i, tok in enumerate(inci):
        if FILTRES_UV.search(tok):
            uv = True
        for n, rx, w, pmax in ACTIFS:
            if n in found or not rx.search(tok):
                continue
            if pmax is not None and i > pmax:
                continue
            found.add(n)
            f = posf(i) if has_inci else 0.75  # liste courte = actifs cles, poids fixe
            for a, v in w.items():
                contrib[a].append((v * f, n))
            raisons.append((max(w.values()) * f, f"{n} (INCI #{i + 1})" if has_inci else f"{n} (actif cle)"))
    if has_inci:  # signaux INCI faibles hors actifs
        huiles = sum(1 for t in inci[:15] if re.search(r'(seed|kernel|fruit|nut) oil|olea europaea|argania|persea', t))
        if huiles:
            contrib['hydration'].append((0.15 * min(huiles, 4), 'huiles vegetales'))
            contrib['glow'].append((0.05 * min(huiles, 4), 'huiles vegetales'))
            raisons.append((0.1 * min(huiles, 4), f"{min(huiles, 4)} huile(s) vegetale(s) dans le haut de liste"))
        if any(re.search(r'^alcohol( denat)?$', t) for t in inci[:5]):
            contrib['sebum'].append((0.25, 'alcool en tete')); raisons.append((0.2, 'alcool en tete de liste'))
        if not any(re.search(r'parfum|fragrance|linalool|limonene', t) for t in inci):
            contrib['redness'].append((0.15, 'sans parfum')); raisons.append((0.12, 'sans parfum (INCI)'))
    if uv:
        for a, v in {'pigmentation': 0.45, 'wrinkles': 0.3}.items():
            contrib[a].append((v, 'filtres UV'))
        raisons.append((0.45, 'filtres UV (INCI)'))

    # 2. Actifs nommes dans le nom (poids fort, bonus si pourcentage)
    nom = norm_txt(p.get('name_fr') or '') + ' ' + norm_txt(p['name'])
    pct = re.search(r'(\d+(?:[.,]\d+)?)\s*%', nom)
    for n, rx, w, pmax in ACTIFS:
        key = rx.pattern.replace('^', '').replace('$', '')
        if n in found and not pct:
            continue
        if re.search(key, nom):
            f = 0.9 + (0.25 if pct else 0)
            for a, v in w.items():
                contrib[a].append((v * f, n + ' (nom)'))
            raisons.append((max(w.values()) * f, f"{n} dans le nom" + (f" {pct.group(0)}" if pct else '')))
            found.add(n)

    # 3. Texte : nom (1.0), claims (0.8), description (0.45) ; frequence dans la description
    claims = norm_txt(' '.join(p.get('claims') or []))
    desc = norm_txt(p.get('description') or '')
    for n, rx, w in MOTS:
        src = []
        if rx.search(nom): src.append(('nom', 1.0))
        if rx.search(claims): src.append(('claim', 0.8))
        k = len(rx.findall(desc))
        if k: src.append(('description', 0.35 + 0.1 * min(k, 4)))
        if not src:
            continue
        f = src[0][1] + sum(s[1] for s in src[1:]) * 0.35
        for a, v in w.items():
            contrib[a].append((v * f, n))
        raisons.append((max(w.values()) * f, f"{n} ({'+'.join(s[0] for s in src)})"))

    # 4. Categorie
    for a, v in CAT_PRIOR.get(cat, {}).items():
        contrib[a].append((v, 'categorie'))
    mult = CAT_MULT.get(cat, {'_': 0.9})

    scores = {}
    for a in AXES:
        vals = sorted((v for v, _ in contrib[a]), reverse=True)
        raw = sum(v * DIMIN[min(i, len(DIMIN) - 1)] for i, v in enumerate(vals))
        s = 0.08 + 0.9 * (1 - math.exp(-raw / 1.1))
        s *= mult.get(a, mult['_'])
        scores[a] = round(max(0.05, min(0.98, s)), 2)

    top = sorted(AXES, key=lambda a: -scores[a])
    targets = [a for a in top[:3] if scores[a] >= 0.5 and scores[a] >= scores[top[0]] - 0.3] or [top[0]]
    raisons.sort(key=lambda r: -r[0])
    rs = [r for _, r in raisons[:6]] + [f"categorie {cat}"]
    return scores, targets, rs, has_inci


def vec_dup_rate(prods):
    cnt = C.Counter(tuple(p['concern_scores'][a] for a in AXES) for p in prods)
    n = len(prods)
    return (sum(1 for p in prods if cnt[tuple(p['concern_scores'][a] for a in AXES)] >= 5) / n,
            sum(1 for p in prods if cnt[tuple(p['concern_scores'][a] for a in AXES)] >= 2) / n)


def main():
    marques_old = json.load(open(os.path.join(ROOT, 'public/scan/catalogue/marques.json')))
    marques_new = json.load(open(os.path.join(HERE, 'nouvelles/_marques.json')))
    MQ = dict(marques_old['marques']); MQ.update(marques_new)

    brut = []
    for src in ['verif', 'ajouts', 'nouvelles']:
        for f in sorted(glob.glob(os.path.join(HERE, src, '*.json'))):
            if os.path.basename(f).startswith('_'):
                continue
            for p in json.load(open(f))['products']:
                p['_src'] = src
                brut.append(p)
    log = C.Counter()
    log['brut'] = len(brut)

    # Filtres
    garde = []
    rejets = []
    for p in brut:
        host = urlparse(p['url']).netloc.lower()
        why = None
        if p['brand'] in FAUSSES: why = 'fausse marque'
        elif any(r in host for r in REVENDEURS): why = 'revendeur'
        elif p.get('categorie') not in CATS: why = 'categorie hors soin visage'
        elif EXCLUS_NOM.search(p['name']): why = 'hors soin visage (appareil/maquillage)'
        elif not p['url'].startswith('http'): why = 'url invalide'
        if why:
            rejets.append((why, p['brand'], p['name'])); log['rejet ' + why] += 1
        else:
            garde.append(p)

    # Dedoublonnage : union-find sur URL normalisee puis nom normalise par marque
    parent = list(range(len(garde)))
    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]; i = parent[i]
        return i
    def union(i, j):
        parent[find(i)] = find(j)
    seen = {}
    for i, p in enumerate(garde):
        k = norm_url(p['url'])
        if k in seen: union(i, seen[k]); log['doublon url'] += 1
        else: seen[k] = i
    seen = {}
    for i, p in enumerate(garde):
        keys = {norm_name(p['name'], p['brand_name'])}
        if p.get('name_fr'): keys.add(norm_name(p['name_fr'], p['brand_name']))
        for k in keys:
            if not k: continue
            kk = (p['brand'], k)
            if kk in seen:
                if find(i) != find(seen[kk]): log['doublon nom'] += 1
                union(i, seen[kk])
            else:
                seen[kk] = i
    groups = C.defaultdict(list)
    for i in range(len(garde)): groups[find(i)].append(garde[i])
    fusion = []
    ordre_src = {'verif': 0, 'ajouts': 1, 'nouvelles': 2}
    for g in groups.values():
        g.sort(key=lambda p: (-completude(p), ordre_src[p['_src']]))
        best = dict(g[0])
        for o in g[1:]:  # completer les trous avec les doublons
            for k in ('price_eur', 'ingredients', 'description', 'name_fr'):
                if best.get(k) in (None, '') and o.get(k) not in (None, ''):
                    best[k] = o[k]
                    if k == 'price_eur': best['price_source'] = o.get('price_source')
            if not best.get('image_local') and o.get('image_local'):
                best['image_local'] = o['image_local']
        fusion.append(best)
    log['apres dedoublonnage'] = len(fusion)

    # Scores + format de sortie
    out = []
    for p in fusion:
        if p['categorie'] == 'autre-visage' and re.search(r'nettoyant|cleanser|cleansing|demaquill|wash', norm_txt(p['name'])):
            p['categorie'] = 'nettoyant'; log['recategorise autre-visage -> nettoyant'] += 1
        scores, targets, raisons, has_inci = score_produit(p)
        mq = MQ.get(p['brand'], {})
        img = p.get('image_local')
        image_url = None
        if img and os.path.exists(os.path.join(ROOT, img)):
            image_url = '/' + img[len('public/'):] if img.startswith('public/') else img
        out.append({
            'id': p['id'],
            'name': p.get('name_fr') or p['name'],
            'name_origine': p['name'],
            'price_eur': p.get('price_eur'),
            'price_source': p.get('price_source'),
            'image_url': image_url,
            'url': p['url'],
            'url_verifiee_le': p.get('url_verifiee_le'),
            'targets': targets,
            'concern_scores': scores,
            'score_raisons': raisons,
            'categorie': p['categorie'],
            'brand': p['brand'],
            'brand_name': mq.get('nom') or p['brand_name'],
            'pays': mq.get('pays'),
            'univers': mq.get('univers'),
            '_has_inci': has_inci,
            '_full': p,
        })
    out.sort(key=lambda x: (x['brand'], x['categorie'], x['name'].lower()))
    pos = C.Counter()
    for x in out:
        x['position'] = pos[x['brand']]; pos[x['brand']] += 1

    # IDs uniques
    ids = C.Counter(x['id'] for x in out)
    for x in out:
        if ids[x['id']] > 1:
            x['id'] = x['id'] + '--' + str(x['position'])

    # Ecriture
    if os.path.exists(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    PUB = ['id', 'name', 'price_eur', 'image_url', 'url', 'targets', 'concern_scores', 'position', 'brand', 'brand_name',
           'categorie', 'price_source', 'url_verifiee_le', 'pays', 'univers', 'score_raisons', 'name_origine']
    pub = [{k: x[k] for k in PUB} for x in out]
    json.dump({'brand': 'all', 'source': 'catalogue-v2 2026-09-17', 'products': pub},
              open(os.path.join(OUT, 'all.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    parb = C.defaultdict(list)
    for x, pp in zip(out, pub):
        d = dict(pp)
        f = x['_full']
        d.update({'ingredients': f.get('ingredients'), 'description': f.get('description'), 'claims': f.get('claims'),
                  'image_source_url': f.get('image_source_url'), 'source': f.get('source')})
        parb[x['brand']].append(d)
    for b, lst in parb.items():
        json.dump({'brand': b, 'brand_name': lst[0]['brand_name'], 'source': 'catalogue-v2 2026-09-17', 'products': lst},
                  open(os.path.join(OUT, b + '.json'), 'w'), ensure_ascii=False, indent=1)
    marques = {}
    retirees = []
    for b, v in sorted(MQ.items()):
        if b == 'sothys':  # consigne : ne jamais toucher a Sothys -> entree conservee telle quelle
            marques[b] = marques_old['marques'][b]; continue
        if b in FAUSSES or b not in parb:
            retirees.append(b); continue
        marques[b] = {k: v[k] for k in ('nom', 'univers', 'pays', 'site') if k in v}
    json.dump({'version': 2, 'marques': marques}, open(os.path.join(OUT, 'marques.json'), 'w'), ensure_ascii=False, indent=1)

    # Controles / stats
    old = json.load(open(os.path.join(ROOT, 'public/scan/catalogue/all.json')))['products']
    d5_old, d2_old = vec_dup_rate(old)
    d5_new, d2_new = vec_dup_rate(out)
    stats = {
        'log': dict(log), 'retirees': retirees, 'rejets': rejets,
        'dup_old': (d5_old, d2_old), 'dup_new': (d5_new, d2_new),
    }
    json.dump(stats, open(os.path.join(HERE, 'sortie', '_controle.json'), 'w'), ensure_ascii=False, indent=1)
    ecrire_stats(out, marques, retirees, log, rejets)
    print(json.dumps(dict(log), ensure_ascii=False))
    print('marques retirees', retirees)
    print('dup>=5 old %.3f new %.3f | dup>=2 old %.3f new %.3f' % (d5_old, d5_new, d2_old, d2_new))
    return out


def ecrire_stats(out, marques, retirees, log, rejets):
    n = len(out)
    L = ['# Catalogue v2 - statistiques (sortie du 17/09/2026)', '',
         f'- Marques avec produits : **{len(set(x["brand"] for x in out))}** (marques.json : {len(marques)} entrees, dont Sothys conservee sans produit)',
         f'- Produits : **{n}** (sources brutes {log["brut"]}, doublons URL {log["doublon url"]}, doublons nom {log["doublon nom"]}, rejets {sum(v for k, v in log.items() if k.startswith("rejet"))})',
         f'- Sans prix : {sum(1 for x in out if x["price_eur"] is None)} ({100 * sum(1 for x in out if x["price_eur"] is None) / n:.1f} %)',
         f'- Sans INCI (champ vide) : {sum(1 for x in out if not x["_full"].get("ingredients"))}',
         f'- Sans INCI exploitable (vide ou moins de 5 ingredients) : {sum(1 for x in out if not x["_has_inci"])} ({100 * sum(1 for x in out if not x["_has_inci"]) / n:.1f} %)',
         f'- Sans image : {sum(1 for x in out if not x["image_url"])}',
         f'- Marques retirees de marques.json : {", ".join(retirees)}', '']
    for titre, key in (('Par univers', 'univers'), ('Par pays', 'pays'), ('Par categorie', 'categorie')):
        L += [f'## {titre}', '', '| valeur | produits | marques |', '|---|---:|---:|']
        c = C.Counter(x[key] for x in out)
        for v, k in c.most_common():
            L.append(f'| {v} | {k} | {len(set(x["brand"] for x in out if x[key] == v))} |')
        L.append('')
    L += ['## Marques avec moins de 5 produits', '']
    cb = C.Counter(x['brand'] for x in out)
    for b, k in sorted(cb.items(), key=lambda t: (t[1], t[0])):
        if k < 5: L.append(f'- {b} : {k}')
    L += ['', '## Rejets', '']
    for why, b, nm in rejets: L.append(f'- {why} : {b} / {nm}')
    open(os.path.join(OUT, 'STATS.md'), 'w').write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
