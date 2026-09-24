#!/usr/bin/env python3
"""Detourage des images produits du catalogue CHEVEUX de vyvre.fr.

Reutilise tel quel le moteur de ../catalogue-v2/detourage.py (u2net + masque
adouci + recadrage carre 600 px + WebP transparent). Seuls changent :
  - le catalogue lu   : public/scan/catalogue-cheveux/all.json (champ image_local)
  - les images        : public/scan/products-cheveux/<marque>/<nom>.jpg
  - le journal        : catalogue-cheveux/detourage_journal.json
Ne touche jamais aux images peau ni a Sothys.

Usage :
  python3 detourage_cheveux.py --bench 30
  python3 detourage_cheveux.py --modele u2net.onnx [--limit N] [--force]
  ECH=40 python3 detourage_cheveux.py --modele u2net.onnx   # echantillon reparti
"""
import glob
import os
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, os.path.join(RACINE, 'catalogue-v2'))

import detourage as D  # noqa: E402

ALL_CHEVEUX = os.path.join(RACINE, 'public', 'scan', 'catalogue-cheveux', 'all.json')
JOURNAL_CHEVEUX = os.path.join(ICI, 'detourage_journal.json')
DOSSIER_IMAGES = os.path.join(RACINE, 'public', 'scan', 'products-cheveux')

D.JOURNAL = JOURNAL_CHEVEUX
ECH = int(os.environ.get('ECH', '0'))


def url_de(image_local):
    """'public/scan/products-cheveux/x/y.jpg' -> '/scan/products-cheveux/x/y.jpg'"""
    u = (image_local or '').replace('\\', '/')
    if u.startswith('public/'):
        u = u[len('public'):]
    if not u.startswith('/'):
        u = '/' + u
    return u


def _a_jour(j, u, src, force):
    e = j.get(u)
    return (not force and e and e.get('statut') in ('ok', 'douteux')
            and os.path.exists(D.PUBLIC + D.cutout_de(u))
            and e.get('src_mtime') == int(os.path.getmtime(src)))


def taches(force, modele):
    import json
    P = json.load(open(ALL_CHEVEUX))['products']
    j = D.lire_journal()['images']
    vu, res = set(), []
    for p in P:
        u = url_de(p.get('image_local'))
        if not p.get('image_local') or u in vu or D.interdit({'brand': p.get('brand'), 'image_url': u}):
            continue
        vu.add(u)
        src = D.PUBLIC + u
        if not os.path.exists(src) or _a_jour(j, u, src, force):
            continue
        res.append({'src': src, 'dst': D.PUBLIC + D.cutout_de(u), 'image_url': u,
                    'cutout_url': D.cutout_de(u), 'modele': modele})
    # images presentes sur disque mais pas encore dans all.json
    for dos in sorted(glob.glob(os.path.join(DOSSIER_IMAGES, '*'))):
        if not os.path.isdir(dos) or any(w in dos.lower() for w in D.MOTS_INTERDITS):
            continue
        for src in sorted(glob.glob(os.path.join(dos, '*.jpg'))
                          + glob.glob(os.path.join(dos, '*.png'))
                          + glob.glob(os.path.join(dos, '*.webp'))):
            u = src[len(D.PUBLIC):]
            if u in vu or _a_jour(j, u, src, force):
                continue
            vu.add(u)
            res.append({'src': src, 'dst': D.PUBLIC + D.cutout_de(u), 'image_url': u,
                        'cutout_url': D.cutout_de(u), 'modele': modele})
    if ECH and len(res) > ECH:
        res = res[::max(1, len(res) // ECH)][:ECH]
    return res


def ecrire_json():
    import ajoute_cutout_url_cheveux
    ajoute_cutout_url_cheveux.main()


D.taches = taches
D.ecrire_json = ecrire_json

if __name__ == '__main__':
    D.main()
