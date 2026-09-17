#!/usr/bin/env python3
"""Ajoute cutout_url aux produits dont le detourage est 'ok' (detourage_journal.json).

A relancer apres chaque regeneration de sortie/ (fusion_scores.py). Relit all.json
au moment de l'ecriture, ne modifie que le champ cutout_url, conserve le format
(all.json compact, fichiers par marque indent=1). Ne touche jamais a Sothys.
"""
import glob, json, os

ICI = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(ICI, '..', 'public'))
SORTIE = os.path.join(ICI, 'sortie')
ALL = os.path.join(SORTIE, 'all.json')
JOURNAL = os.path.join(ICI, 'detourage_journal.json')


def cutout_de(image_url):
    d, n = os.path.split(image_url)
    return d + '/cutout/' + os.path.splitext(n)[0] + '.webp'


def main():
    try:
        j = json.load(open(JOURNAL))['images']
    except FileNotFoundError:
        print('pas de journal'); return
    ok = set()
    for u, e in j.items():
        src = PUBLIC + u
        if e.get('statut') == 'ok' and os.path.exists(PUBLIC + cutout_de(u)) and os.path.exists(src) \
                and e.get('src_mtime') == int(os.path.getmtime(src)):
            ok.add(u)

    def maj(prods):
        n = 0
        for p in prods:
            u = p.get('image_url')
            sothys = 'sothys' in ((p.get('brand') or '') + (u or '')).lower()
            if u in ok and not sothys:
                c = cutout_de(u)
                if p.get('cutout_url') != c:
                    p['cutout_url'] = c; n += 1
            elif 'cutout_url' in p and not sothys:
                del p['cutout_url']; n += 1
        return n

    total, fichiers = 0, 0
    for f in sorted(glob.glob(os.path.join(SORTIE, '*.json'))):
        if 'sothys' in os.path.basename(f).lower():
            continue
        s = open(f, encoding='utf-8').read()
        b = json.loads(s)
        if not (isinstance(b, dict) and isinstance(b.get('products'), list)):
            continue
        k = maj(b['products'])
        if not k:
            continue
        if f == ALL:
            out = json.dumps(b, ensure_ascii=False, separators=(',', ':'))
        else:
            out = json.dumps(b, ensure_ascii=False, indent=1)
        if s.endswith('\n'):
            out += '\n'
        with open(f + '.tmp', 'w', encoding='utf-8') as g:
            g.write(out)
        os.replace(f + '.tmp', f)
        total += k; fichiers += 1
    print(f'cutout_url : {len(ok)} images ok au journal, {total} champs modifies dans {fichiers} fichiers')


if __name__ == '__main__':
    main()
