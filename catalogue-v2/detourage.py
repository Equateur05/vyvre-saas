#!/usr/bin/env python3
"""Detourage des images produits du catalogue v2 de vyvre.fr.

Relancable : ne traite que les images sans detourage a jour (journal + fichier
de sortie present + source non modifiee). Ne touche jamais a Sothys.

Usage :
  python3 detourage.py                 # tout ce qui manque
  python3 detourage.py --bench 30      # mesure la vitesse u2net sur 30 images
  python3 detourage.py --limit 200     # seulement N images (essai)
  python3 detourage.py --force         # retraite tout
  (les champs cutout_url sont ecrits par ajoute_cutout_url.py, relancable seul)
"""
import argparse, json, os, shutil, sys, time, glob
from concurrent.futures import ProcessPoolExecutor, as_completed
import numpy as np
from PIL import Image, ImageFilter

ICI = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(ICI, '..', 'public'))
SORTIE = os.path.join(ICI, 'sortie')
ALL = os.path.join(SORTIE, 'all.json')
JOURNAL = os.path.join(ICI, 'detourage_journal.json')
MODELES = os.path.expanduser('~/.u2net')

TAILLE_MAX = 600
MARGE = 0.06
QUALITE = 85
LOT = 200
MIN_LIBRE_GO = 1.5
SEUIL_BAS, SEUIL_HAUT = 8.0, 92.0   # % de l'image gardee par le masque
MOTS_INTERDITS = ('sothys',)

# ---------------------------------------------------------------- modele
_sess = None
_modele = None

def charger(modele):
    global _sess, _modele
    if _sess is None or _modele != modele:
        import onnxruntime as ort
        o = ort.SessionOptions()
        o.intra_op_num_threads = 2
        o.log_severity_level = 3
        # CoreML (GPU/ANE du M4) : ~0,5 s pour u2net contre 3,5 s en CPU
        _sess = ort.InferenceSession(os.path.join(MODELES, modele), o,
                                     providers=['CoreMLExecutionProvider', 'CPUExecutionProvider'])
        _modele = modele
    return _sess

def predire(img, modele):
    s = charger(modele)
    x = img.convert('RGB').resize((320, 320), Image.BILINEAR)
    a = np.asarray(x, dtype=np.float32) / 255.0
    a = (a - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    a = a.transpose(2, 0, 1)[None]
    out = s.run(None, {s.get_inputs()[0].name: a})[0][0, 0]
    mi, ma = float(out.min()), float(out.max())
    out = (out - mi) / (ma - mi + 1e-8)
    m = Image.fromarray((out * 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)
    return np.asarray(m, dtype=np.float32) / 255.0

# ---------------------------------------------------------------- analyse
def bord(rgb, ep=4):
    return np.concatenate([rgb[:ep].reshape(-1, 3), rgb[-ep:].reshape(-1, 3),
                           rgb[:, :ep].reshape(-1, 3), rgb[:, -ep:].reshape(-1, 3)])

def fond_blanc_uni(rgb):
    b = bord(rgb).astype(np.float32)
    return bool(b.mean() > 238 and b.std() < 10 and np.percentile(b.min(axis=1), 5) > 225)

def masque_blanc(rgb):
    """Pixels qui s'ecartent du blanc : masque grossier pour fonds blancs."""
    f = rgb.astype(np.float32)
    ecart = 255 - f.min(axis=2)
    sat = f.max(axis=2) - f.min(axis=2)
    return ((ecart > 14) | (sat > 10)).astype(np.float32)

def adoucir(m):
    """Seuil doux (supprime les halos gris), trous interieurs bouches
    (flacons transparents), puis leger flou de bord."""
    from scipy import ndimage
    # tout ce qui est < 0.15 disparait, > 0.75 est plein ; rampe lineaire entre
    m = np.clip((m - 0.15) / 0.60, 0, 1)
    plein = ndimage.binary_fill_holes(m > 0.3)
    m = np.where(plein & (m < 1), np.maximum(m, plein.astype(np.float32)), m)
    im = Image.fromarray((m * 255).astype(np.uint8))
    rayon = max(0.6, min(im.size) / 700.0)
    im = im.filter(ImageFilter.GaussianBlur(rayon))
    return np.asarray(im, dtype=np.float32) / 255.0

def boite(m, seuil=0.5):
    ys, xs = np.where(m > seuil)
    if len(xs) == 0:
        return None
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

def carre(rgba, bx, fond=None):
    x0, y0, x1, y1 = bx
    w, h = x1 - x0, y1 - y0
    cote = int(round(max(w, h) * (1 + 2 * MARGE)))
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    toile = Image.new('RGBA', (cote, cote), fond or (0, 0, 0, 0))
    toile.paste(rgba, (int(round(cote / 2 - cx)), int(round(cote / 2 - cy))), rgba)
    if cote > TAILLE_MAX:
        toile = toile.resize((TAILLE_MAX, TAILLE_MAX), Image.LANCZOS)
    return toile

def blanc_nettoye(img, rgb):
    """Version fond blanc : blancs casses ramenes a 255, recadrage carre."""
    f = rgb.astype(np.float32)
    proche = f.min(axis=2) > 240
    f[proche] = 255
    base = Image.fromarray(f.astype(np.uint8)).convert('RGBA')
    bx = boite(masque_blanc(f.astype(np.uint8)), 0.5) or (0, 0, img.width, img.height)
    return carre(base, bx, fond=(255, 255, 255, 255)).convert('RGB')

# ---------------------------------------------------------------- une image
def traiter(tache):
    src, dst, modele = tache['src'], tache['dst'], tache['modele']
    t0 = time.time()
    r = {'image_url': tache['image_url'], 'cutout': tache['cutout_url'], 'modele': modele}
    try:
        img = Image.open(src)
        img.load()
        if img.mode in ('RGBA', 'LA', 'P') and 'A' in img.convert('RGBA').getbands():
            a = np.asarray(img.convert('RGBA'))[..., 3]
            transparent = bool((a < 250).mean() > 0.02)
        else:
            transparent = False
        base = Image.new('RGB', img.size, (255, 255, 255))
        base.paste(img.convert('RGBA'), mask=img.convert('RGBA'))
        img = base
        if max(img.size) > 1600:
            img.thumbnail((1600, 1600), Image.LANCZOS)
        rgb = np.asarray(img)
        blanc = fond_blanc_uni(rgb)
        os.makedirs(os.path.dirname(dst), exist_ok=True)

        m = adoucir(predire(img, modele))
        part = float((m > 0.5).mean() * 100)
        r['part_masque'] = round(part, 1)
        raisons = []
        if part < SEUIL_BAS:
            raisons.append(f'masque trop petit ({part:.1f} %)')
        if part > SEUIL_HAUT:
            raisons.append(f'masque trop grand ({part:.1f} %)')
        if transparent:
            raisons.append('source deja transparente')
        if blanc and not raisons:
            # source sur fond blanc uni : on n'accepte le detourage IA que s'il
            # concorde avec l'ecart au blanc (sinon flacons clairs manges)
            # ecart franc au blanc seulement : les ombres portees grises ne comptent pas
            f = rgb.astype(np.float32)
            mb = (((255 - f.min(axis=2)) > 70) | ((f.max(axis=2) - f.min(axis=2)) > 30)).astype(np.float32)
            mb = np.asarray(Image.fromarray((mb * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5)), dtype=np.float32) / 255
            bb = boite(mb)
            bm = boite(m)
            if bb and bm:
                # la boite du modele doit couvrir celle de l'ecart au blanc
                perte = max(bm[0] - bb[0], bb[2] - bm[2], bm[1] - bb[1], bb[3] - bm[3], 0)
                perte /= max(bb[2] - bb[0], bb[3] - bb[1])
                # part du produit franc (ecart net au blanc) couverte par le masque
                inter = ((m > 0.5) & (mb > 0.5)).sum()
                iou = inter / max((mb > 0.5).sum(), 1)
                r['couverture_blanc'] = round(float(iou), 2)
                if perte > 0.10:
                    raisons.append(f'fond blanc uni, detourage coupe le produit ({perte*100:.0f} %)')
                elif iou < 0.85:
                    raisons.append(f'fond blanc uni, detourage mange le produit (couverture {iou:.2f})')
        if raisons:
            out = blanc_nettoye(img, rgb)
            out.save(dst, 'WEBP', quality=QUALITE, method=5)
            r.update(statut='douteux', raison='; '.join(raisons), sortie='fond blanc nettoye')
        else:
            rgba = img.convert('RGBA')
            rgba.putalpha(Image.fromarray((m * 255).astype(np.uint8)))
            # couleurs des pixels semi-transparents : pas de liseré sombre/clair
            out = carre(rgba, boite(m, 0.1))
            out.save(dst, 'WEBP', quality=QUALITE, method=5, exact=False)
            r.update(statut='ok', raison='fond blanc uni, detourage concordant' if blanc else '', sortie='transparent')
        r['octets'] = os.path.getsize(dst)
    except Exception as e:
        r.update(statut='echec', raison=f'{type(e).__name__}: {e}')
    r['src_mtime'] = int(os.path.getmtime(src)) if os.path.exists(src) else None
    r['secondes'] = round(time.time() - t0, 3)
    return r

# ---------------------------------------------------------------- orchestration
def lire_journal():
    try:
        return json.load(open(JOURNAL))
    except Exception:
        return {'images': {}}

def ecrire_journal(j):
    tmp = JOURNAL + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(j, f, ensure_ascii=False, indent=1)
    os.replace(tmp, JOURNAL)

def cutout_de(image_url):
    d, n = os.path.split(image_url)
    return d + '/cutout/' + os.path.splitext(n)[0] + '.webp'

def interdit(p):
    s = (p.get('brand') or '') + ' ' + (p.get('image_url') or '')
    return any(w in s.lower() for w in MOTS_INTERDITS)

def taches(force, modele):
    P = json.load(open(ALL))['products']
    j = lire_journal()['images']
    vu, res = set(), []
    for p in P:
        u = p.get('image_url')
        if not u or u in vu or interdit(p):
            continue
        vu.add(u)
        src = PUBLIC + u
        if not os.path.exists(src):
            continue
        c = cutout_de(u)
        dst = PUBLIC + c
        e = j.get(u)
        if not force and e and e.get('statut') in ('ok', 'douteux') and os.path.exists(dst) \
                and e.get('src_mtime') == int(os.path.getmtime(src)):
            continue
        res.append({'src': src, 'dst': dst, 'image_url': u, 'cutout_url': c, 'modele': modele})
    # images presentes sur disque mais pas encore dans all.json (marques en cours d'ajout)
    for dos in sorted(glob.glob(os.path.join(PUBLIC, 'scan/products/*/v2'))):
        if any(w in dos.lower() for w in MOTS_INTERDITS):
            continue
        for src in sorted(glob.glob(os.path.join(dos, '*.jpg')) + glob.glob(os.path.join(dos, '*.png')) + glob.glob(os.path.join(dos, '*.webp'))):
            u = src[len(PUBLIC):]
            if u in vu:
                continue
            vu.add(u)
            c = cutout_de(u)
            e = j.get(u)
            if not force and e and e.get('statut') in ('ok', 'douteux') and os.path.exists(PUBLIC + c) \
                    and e.get('src_mtime') == int(os.path.getmtime(src)):
                continue
            res.append({'src': src, 'dst': PUBLIC + c, 'image_url': u, 'cutout_url': c, 'modele': modele})
    return res

def libre_go():
    st = shutil.disk_usage(PUBLIC)
    return st.free / 1e9

def bench(n):
    ts = taches(True, 'u2net.onnx')
    step = max(1, len(ts) // n)
    ech = ts[::step][:n]
    img = [Image.open(t['src']).convert('RGB') for t in ech]
    charger('u2net.onnx')
    predire(img[0], 'u2net.onnx')
    t0 = time.time()
    for i in img:
        predire(i, 'u2net.onnx')
    moy = (time.time() - t0) / len(img)
    print(f'u2net : {moy:.3f} s / image ({len(img)} images)')
    return moy

def ecrire_json():
    import ajoute_cutout_url
    ajoute_cutout_url.main()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bench', type=int)
    ap.add_argument('--limit', type=int)
    ap.add_argument('--force', action='store_true')
    ap.add_argument('--modele')
    ap.add_argument('--ecrire-json', action='store_true')
    ap.add_argument('--procs', type=int, default=max(1, (os.cpu_count() or 4) - 2))
    a = ap.parse_args()
    if a.bench:
        bench(a.bench)
        return
    if a.ecrire_json:
        ecrire_json()
        return
    modele = a.modele
    if not modele:
        modele = 'u2net.onnx' if bench(30) <= 0.6 else 'u2netp.onnx'
    print('modele :', modele)
    ts = taches(a.force, modele)
    if a.limit:
        ts = ts[:a.limit]
    print(f'{len(ts)} images a traiter, {a.procs} processus')
    j = lire_journal()
    t0 = time.time()
    fait = 0
    arret = False
    with ProcessPoolExecutor(a.procs) as ex:
        for i in range(0, len(ts), LOT):
            go = libre_go()
            if go < MIN_LIBRE_GO:
                print(f'ARRET : {go:.2f} Go libres (< {MIN_LIBRE_GO}). {fait} images traitees, relancer plus tard.')
                arret = True
                break
            for fu in as_completed([ex.submit(traiter, t) for t in ts[i:i + LOT]]):
                r = fu.result()
                j['images'][r['image_url']] = r
                fait += 1
            j['maj'] = time.strftime('%Y-%m-%d %H:%M:%S')
            ecrire_journal(j)
            print(f'{fait}/{len(ts)}  {time.time() - t0:.0f} s  {go:.1f} Go libres', flush=True)
    im = j['images']
    c = {s: sum(1 for e in im.values() if e.get('statut') == s) for s in ('ok', 'douteux', 'echec')}
    poids = sum(e.get('octets', 0) for e in im.values())
    print(f'termine en {time.time() - t0:.0f} s ; total journal {c} ; {poids/1e6:.1f} Mo')
    if arret:
        sys.exit(2)

if __name__ == '__main__':
    main()
