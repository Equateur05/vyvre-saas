#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VYVRE · Le Wrap des aliments (F1 a F3) : la planche de vignettes du defilement.   07/10/2026

Le defilement du Wrap montre des dizaines de vraies photos d'aliments en 2 secondes. Les charger une a une
(121 Ko en moyenne, 245 PNG) couterait 4 a 6 Mo sur un telephone : on les assemble ici, une fois, en UNE planche
WebP (8 x 8 vignettes de 320 px, environ 0,8 Mo), plus un index JSON avec, pour chaque photo, sa luminance
(posee sur le fond #fafafa du Wrap) et sa part de rouge sature : le Wrap s'en sert pour ordonner le defilement
sans flash (moins de 3 changements forts de luminance par seconde, et pas de clignotement rouge).

Les photos : public/scan/aliment/photos/<id>.png (detourees par vyvre), SEULEMENT celles dont la licence permet
la reutilisation (photos/credits.json : CC0, CC BY, CC BY-SA, domaine public). La planche est un recueil de ces
photos, reduites : chaque photo garde sa licence et son credit, listes sur /wrap/credits.html.
Le Wrap reverifie au chargement chaque identifiant contre credits.json (une photo retiree n'apparait plus).

A relancer quand les photos ou credits.json changent :
    python3 scripts/wrap_vignettes_aliments.py
Sorties : public/wrap/aliments/vignettes-320.webp et public/wrap/aliments/vignettes.json
(puis monter le ?v= de la planche dans vy-wrap-f.js : VER_PLANCHE).
"""
import json, os, re, sys, datetime
from PIL import Image

RACINE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PHOTOS = os.path.join(RACINE, 'public', 'scan', 'aliment', 'photos')
SORTIE = os.path.join(RACINE, 'public', 'wrap', 'aliments')
CELL, COLS, QUALITE = 320, 8, 80
LICENCE_OK = re.compile(r'^(CC0|CC BY|Domaine public|Public domain)', re.I)

# les plus photogeniques, reconnaissables au premier coup d'oeil (fruits et legumes surtout, quelques
# noix, poissons entiers, epices de couleur) ; ni viande crue, ni bol, ni verre, ni emballage
CHOIX = ('abricot ananas avocat banane cerise citron citron_vert clementine figue fraise framboise fruit_passion '
         'grenade kiwi kumquat litchi mangue myrtille nectarine orange papaye pasteque peche poire pomme prune '
         'artichaut asperge aubergine betterave brocoli carotte chou_fleur chou_rouge romanesco courge_butternut '
         'epinard fenouil mais_doux oignon_rouge petits_pois piment poivron_jaune poivron_rouge potiron radis tomate '
         'tomate_cerise patate_douce champignon_paris amande noisette noix pistache dorade maquereau saint_jacques '
         'oeuf miel huile_olive comte curcuma basilic olive').split()


def lin(v):
    v /= 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


LUT = [lin(i) for i in range(256)]


def mesures(cellule):
    """luminance relative moyenne (sur le fond #fafafa), couverture, part de rouge sature (definition WCAG),
    et la luminance sur une grille 3 x 3 de la case"""
    petite = cellule.resize((96, 96), Image.BILINEAR)
    px = petite.load()
    tot = cov = rouge = 0.0
    grille = [[0.0] * 3 for _ in range(3)]
    for y in range(96):
        for x in range(96):
            r, g, b, a = px[x, y]
            a /= 255.0
            R, G, B = r * a + 250 * (1 - a), g * a + 250 * (1 - a), b * a + 250 * (1 - a)
            lr, lg, lb = LUT[int(R)], LUT[int(G)], LUT[int(B)]
            L = .2126 * lr + .7152 * lg + .0722 * lb
            tot += L
            cov += a
            s = lr + lg + lb
            if s > 0 and lr / s >= .8 and (lr - lg - lb) * 320 > 20:
                rouge += 1
            grille[y // 32][x // 32] += L
    n = 96 * 96
    return {'lum': round(tot / n, 4), 'cov': round(cov / n, 4), 'rouge': round(rouge / n, 4),
            'g': [round(v / (32 * 32), 3) for ligne in grille for v in ligne]}


def main():
    credits = json.load(open(os.path.join(PHOTOS, 'credits.json'), encoding='utf-8'))
    ids = [i for i in CHOIX if i in credits and LICENCE_OK.match(str(credits[i].get('licence', ''))) and os.path.exists(os.path.join(PHOTOS, i + '.png'))]
    ecartes = [i for i in CHOIX if i not in ids]
    if ecartes:
        print('ecartes (pas de photo ou licence non reutilisable) :', ', '.join(ecartes))
    lignes = (len(ids) + COLS - 1) // COLS
    planche = Image.new('RGBA', (COLS * CELL, lignes * CELL), (0, 0, 0, 0))
    index = {}
    for k, i in enumerate(ids):
        im = Image.open(os.path.join(PHOTOS, i + '.png')).convert('RGBA')
        bb = im.getbbox()
        if bb:
            im = im.crop(bb)
        im.thumbnail((CELL - 8, CELL - 8), Image.LANCZOS)
        cellule = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
        ox, oy = (CELL - im.width) // 2, (CELL - im.height) // 2
        cellule.paste(im, (ox, oy), im)
        planche.paste(cellule, ((k % COLS) * CELL, (k // COLS) * CELL))
        m = mesures(cellule)
        # la boite de la photo dans sa case (pour poser l'ombre au sol et dimensionner)
        m['b'] = [ox, oy, im.width, im.height]
        index[i] = m
    os.makedirs(SORTIE, exist_ok=True)
    chemin = os.path.join(SORTIE, 'vignettes-320.webp')
    planche.save(chemin, 'WEBP', quality=QUALITE, method=6)
    meta = {'version': datetime.date.today().isoformat(), 'cellule': CELL, 'colonnes': COLS, 'ids': ids, 'mesures': index,
            'source': '/scan/aliment/photos/<id>.png (detourees par vyvre)', 'licences': '/scan/aliment/photos/credits.json',
            'note': 'lum = luminance relative moyenne de la case sur le fond #fafafa ; cov = couverture ; rouge = part de rouge sature (WCAG) ; g = luminance 3 x 3 ; b = boite de la photo dans la case'}
    json.dump(meta, open(os.path.join(SORTIE, 'vignettes.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(len(ids), 'vignettes ->', chemin, os.path.getsize(chemin) // 1024, 'Ko ;', planche.size)


if __name__ == '__main__':
    sys.exit(main())
