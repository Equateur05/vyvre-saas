#!/usr/bin/env python3
"""Ecrit cutout_url (et image_fond) dans le catalogue CHEVEUX.

Meme principe que ../catalogue-v2/ajoute_cutout_url.py, adapte au catalogue
cheveux (champ image_local, chemins 'public/scan/products-cheveux/...').

  statut ok      -> cutout_url = .../cutout/<nom>.webp (fond transparent)
  statut douteux -> cutout_url + "image_fond": true    (fond blanc nettoye)
  echec / absent -> les deux champs sont retires

Fichiers mis a jour : public/scan/catalogue-cheveux/all.json (servi, compact)
et catalogue-cheveux/<marque>.json (source, indent=1). Jamais Sothys, jamais
le catalogue peau.
"""
import glob
import json
import os

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
PUBLIC = os.path.join(RACINE, 'public')
ALL = os.path.join(PUBLIC, 'scan', 'catalogue-cheveux', 'all.json')
JOURNAL = os.path.join(ICI, 'detourage_journal.json')


def url_de(image_local):
    u = (image_local or '').replace('\\', '/')
    if u.startswith('public/'):
        u = u[len('public'):]
    if not u.startswith('/'):
        u = '/' + u
    return u


def cutout_de(image_url):
    d, n = os.path.split(image_url)
    return d + '/cutout/' + os.path.splitext(n)[0] + '.webp'


def etats():
    """{url image -> (chemin cutout 'public/...', fond_blanc)} pour les images a jour."""
    try:
        j = json.load(open(JOURNAL))['images']
    except FileNotFoundError:
        print('pas de journal')
        return {}
    res = {}
    for u, e in j.items():
        if '/products-cheveux/' not in u or e.get('statut') not in ('ok', 'douteux'):
            continue
        src, c = PUBLIC + u, cutout_de(u)
        if os.path.exists(PUBLIC + c) and os.path.exists(src) \
                and e.get('src_mtime') == int(os.path.getmtime(src)):
            res[u] = ('public' + c, e['statut'] == 'douteux')
    return res


def maj(prods, etat):
    n = 0
    for p in prods:
        u = url_de(p.get('image_local'))
        if 'sothys' in ((p.get('brand') or '') + u).lower():
            continue
        e = etat.get(u) if p.get('image_local') else None
        if e:
            c, fond = e
            if p.get('cutout_url') != c:
                p['cutout_url'] = c
                n += 1
            if fond and p.get('image_fond') is not True:
                p['image_fond'] = True
                n += 1
            elif not fond and 'image_fond' in p:
                del p['image_fond']
                n += 1
        else:
            for k in ('cutout_url', 'image_fond'):
                if k in p:
                    del p[k]
                    n += 1
    return n


def ecrire(f, b, indent):
    s = open(f, encoding='utf-8').read()
    out = json.dumps(b, ensure_ascii=False, indent=indent)
    if s.endswith('\n'):
        out += '\n'
    with open(f + '.tmp', 'w', encoding='utf-8') as g:
        g.write(out)
    os.replace(f + '.tmp', f)


def main():
    etat = etats()
    if not etat:
        print('rien a ecrire')
        return
    total, fichiers = 0, 0
    cibles = [(ALL, None)] + [(f, 1) for f in sorted(glob.glob(os.path.join(ICI, '*.json')))]
    for f, indent in cibles:
        base = os.path.basename(f)
        if base.startswith('_') or base == 'detourage_journal.json' or 'sothys' in base.lower():
            continue
        b = json.loads(open(f, encoding='utf-8').read())
        if not (isinstance(b, dict) and isinstance(b.get('products'), list)):
            continue
        k = maj(b['products'], etat)
        if not k:
            continue
        ecrire(f, b, indent)
        total += k
        fichiers += 1
    fonds = sum(1 for _, fond in etat.values() if fond)
    print(f'cutout_url : {len(etat)} images au journal ({fonds} fond blanc), '
          f'{total} champs modifies dans {fichiers} fichiers')


if __name__ == '__main__':
    main()
