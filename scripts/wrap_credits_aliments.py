#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VYVRE · Le Wrap des aliments : la page des credits photos (public/wrap/credits.html).   07/10/2026

La video partagee porte une ligne fine : « Photos : contributeurs Wikimedia Commons / Flickr, licences CC — liste sur
vyvre.fr/wrap/credits ». Cette page est la liste : chaque photo d'aliment qui peut apparaitre dans un Wrap (toutes celles
dont la licence permet la reutilisation, comme sur la page de l'assiette), avec son auteur, sa licence, sa source et la
mention « detouree par vyvre ».

La liste est ecrite ici en HTML (lisible sans JavaScript) a partir de public/scan/aliment/photos/credits.json et des noms
d'aliments de public/scan/aliment/aliments_v4.json ; la page relit credits.json au chargement et se remet a jour seule
si des photos ont change depuis. A relancer quand credits.json change :
    python3 scripts/wrap_credits_aliments.py
"""
import json, os, re, html, datetime, unicodedata

RACINE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PHOTOS = os.path.join(RACINE, 'public', 'scan', 'aliment', 'photos')
BASE = os.path.join(RACINE, 'public', 'scan', 'aliment', 'aliments_v4.json')
SORTIE = os.path.join(RACINE, 'public', 'wrap', 'credits.html')
PLANCHE = os.path.join(RACINE, 'public', 'wrap', 'aliments', 'vignettes.json')
LICENCE_OK = re.compile(r'^(CC0|CC BY|Domaine public|Public domain)', re.I)


def esc(t):
    return html.escape(str(t or ''), quote=True)


def cle_tri(t):
    return ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')


def source(c):
    m = re.match(r'https?://(?:www\.)?([^/]+)/', c.get('source_url', ''))
    dom = m.group(1) if m else ''
    noms = {'commons.wikimedia.org': 'Wikimedia Commons', 'flickr.com': 'Flickr', 'rawpixel.com': 'rawpixel', 'stocksnap.io': 'StockSnap'}
    nom = noms.get(dom, dom or c.get('fournisseur', ''))
    if c.get('fournisseur') == 'Openverse' and nom != 'Openverse':
        nom += ' (via Openverse)'
    return nom


def main():
    credits = json.load(open(os.path.join(PHOTOS, 'credits.json'), encoding='utf-8'))
    noms = {f['id']: f['nom'].split(' (')[0].split(',')[0] for f in json.load(open(BASE, encoding='utf-8'))['aliments']}
    planche = set(json.load(open(PLANCHE, encoding='utf-8'))['ids']) if os.path.exists(PLANCHE) else set()
    ids = sorted([i for i, c in credits.items() if LICENCE_OK.match(str(c.get('licence', ''))) and os.path.exists(os.path.join(PHOTOS, i + '.png'))],
                 key=lambda i: cle_tri(noms.get(i, i)))
    lignes = []
    for i in ids:
        c = credits[i]
        sa = 'SA' in str(c.get('licence', '')).upper()
        lignes.append(
            '<li data-id="%s"><div class="g"><b>%s</b>%s</div><div class="d"><span class="t">%s</span><span class="a">%s · <a href="%s" rel="noopener license">%s</a> · <a href="%s" rel="noopener">%s</a></span>'
            '<span class="m" data-sa="%d">%s</span></div></li>' % (
                esc(i), esc(noms.get(i, i)), '<i title="dans le défilement du Wrap">défilement</i>' if i in planche else '',
                esc(c.get('titre', '')), esc(c.get('auteur', '') or 'auteur inconnu'), esc(c.get('licence_url', '')), esc(c.get('licence', '')),
                esc(c.get('source_url', '')), esc(source(c)), 1 if sa else 0,
                'Détourée par vyvre, même licence.' if sa else 'Détourée par vyvre.'))
    noms_js = json.dumps({i: noms[i] for i in credits if i in noms}, ensure_ascii=False, separators=(',', ':'))
    modele = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'wrap_credits_modele.html'), encoding='utf-8').read()
    page = (modele.replace('{{LISTE}}', '\n'.join(lignes)).replace('{{N}}', str(len(ids))).replace('{{NOMS}}', noms_js)
            .replace('{{PLANCHE}}', json.dumps(sorted(planche))).replace('{{DATE}}', datetime.date.today().strftime('%d/%m/%Y')))
    open(SORTIE, 'w', encoding='utf-8').write(page)
    print(len(ids), 'photos ->', SORTIE, os.path.getsize(SORTIE) // 1024, 'Ko')


if __name__ == '__main__':
    main()
