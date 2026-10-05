#!/usr/bin/env python3
"""05/10 : refait le detourage des photos produits qui ont encore un fond plein (liste public/scan/catalogue/fond_plein.json).
Modele isnet-general-use (plus precis que u2net). Sauvegarde chaque ancienne image avant de la remplacer.
Une nouvelle image n'est gardee que si elle est vraiment detouree (bord transparent, produit entre 8 et 92 % du cadre).
Ne touche jamais a Sothys. Usage : python3 redetoure_fond_plein.py [--limit N] [--essai]"""
import json, os, sys, time, shutil, argparse
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
ICI = os.path.dirname(os.path.abspath(__file__)); PUBLIC = os.path.normpath(os.path.join(ICI, '..', 'public'))
SAUVE = os.path.expanduser('~/Documents/vyvre-backups/cutouts-avant-2026-10-05')
JOURNAL = os.path.join(ICI, 'redetoure_journal.json')
ap = argparse.ArgumentParser(); ap.add_argument('--limit', type=int, default=0); ap.add_argument('--essai', action='store_true'); a = ap.parse_args()
from rembg import new_session, remove
SESS = [new_session('u2net'), new_session('isnet-general-use')]   # u2net laisse les ombres portees dehors ; isnet en secours
liste = json.load(open(os.path.join(PUBLIC, 'scan/catalogue/fond_plein.json')))['images']
liste = [u for u in liste if 'sothys' not in u.lower()]
if a.limit: liste = liste[:a.limit]
journal = json.load(open(JOURNAL)) if os.path.exists(JOURNAL) else {}
def source(u):
    p = u.lstrip('/'); d, f = os.path.split(p)
    base = os.path.splitext(f)[0]; parent = os.path.dirname(d)
    for ext in ('.jpg', '.jpeg', '.png', '.webp'):
        s = os.path.join(PUBLIC, parent.split('public/')[-1], base + ext) if False else os.path.join(PUBLIC, parent, base + ext)
        if os.path.exists(s): return s
    return None
def bon(rgba):
    al = np.asarray(rgba)[..., 3]; h, w = al.shape
    bordure = np.concatenate([al[0], al[-1], al[:, 0], al[:, -1]])
    couv = (al > 128).mean()
    return (bordure > 200).mean() < .15 and .08 < couv < .92, round(float(couv), 3)
def carre(rgba, marge=.06, tmax=600):
    al = np.asarray(rgba)[..., 3]; ys, xs = np.where(al > 40)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    cote = int(round(max(x1 - x0, y1 - y0) * (1 + 2 * marge)))
    toile = Image.new('RGBA', (cote, cote), (0, 0, 0, 0))
    toile.paste(rgba.crop((x0, y0, x1, y1)), (int((cote - (x1 - x0)) / 2), int((cote - (y1 - y0)) / 2)))
    if cote > tmax: toile = toile.resize((tmax, tmax), Image.LANCZOS)
    return toile
ok = rate = 0; t0 = time.time()
for k, u in enumerate(liste):
    if journal.get(u, {}).get('ok'): continue
    src = source(u); dst = os.path.join(PUBLIC, u.lstrip('/'))
    if not src: journal[u] = {'ok': False, 'raison': 'source absente'}; rate += 1; continue
    try:
        img = Image.open(src).convert('RGB')
        if max(img.size) > 1400: img.thumbnail((1400, 1400), Image.LANCZOS)
        res = False
        for sess in SESS:
            out = remove(img, session=sess, post_process_mask=True)
            # trous interieurs bouches (flacons transparents), bord adouci
            al = np.asarray(out)[..., 3].astype(np.float32) / 255
            plein = ndimage.binary_fill_holes(al > .5); al = np.where(plein, np.maximum(al, .98 * plein), al)
            # miettes isolees retirees : on garde les morceaux d'au moins 3 % du plus grand
            lab, n = ndimage.label(al > .3)
            if n > 1:
                tailles = ndimage.sum(np.ones_like(al), lab, range(1, n + 1)); garde = np.isin(lab, [i + 1 for i, t in enumerate(tailles) if t >= .03 * tailles.max()])
                al = np.where(garde | (lab == 0), al, 0)
            m = Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(max(.6, min(img.size) / 800)))
            rgba = img.convert('RGBA'); rgba.putalpha(m)
            res, couv = bon(rgba)
            if res: break
        if not res: journal[u] = {'ok': False, 'raison': 'detourage douteux', 'couverture': couv}; rate += 1; continue
        fin = carre(rgba)
        if a.essai:
            fin.save(os.path.join(os.environ.get('ESSAI', '/tmp'), os.path.basename(dst).replace('.webp', '.png')))
        else:
            sv = os.path.join(SAUVE, u.lstrip('/')); os.makedirs(os.path.dirname(sv), exist_ok=True)
            if os.path.exists(dst) and not os.path.exists(sv): shutil.copy2(dst, sv)
            fin.save(dst, 'WEBP', quality=85, method=6)
        journal[u] = {'ok': True, 'couverture': couv}; ok += 1
    except Exception as e:
        journal[u] = {'ok': False, 'raison': str(e)[:120]}; rate += 1
    if (k + 1) % 25 == 0:
        json.dump(journal, open(JOURNAL, 'w'), ensure_ascii=False, indent=1)
        print(f'{k + 1}/{len(liste)} ok={ok} rate={rate} {time.time() - t0:.0f}s', flush=True)
if not a.essai: json.dump(journal, open(JOURNAL, 'w'), ensure_ascii=False, indent=1)
print(f'FIN ok={ok} rate={rate} {time.time() - t0:.0f}s')
