#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Re-telecharge en plus grand les packshots trop petits.

Verification du 20/09 : 293 detourages font moins de 300 px de cote. Affiches
sur une carte de routine (200 a 260 px de large, donc 400 a 520 px sur un ecran
retine), ils sont visiblement flous.

Beaucoup d'URL sources portent un parametre de largeur (?width=600, w=400,
sw=300...). On redemande la meme image en 1200 et on ne garde le nouveau fichier
QUE s'il est vraiment plus grand. Une requete par seconde et par domaine, les
en-tetes d'un navigateur, aucun contournement d'anti-robot : un site qui refuse
est note comme refusant, et on passe.
"""
import json, os, re, sys, time, urllib.request, urllib.error
from collections import defaultdict
from urllib.parse import urlparse

R    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALL  = os.path.join(R, "public", "scan", "catalogue-cheveux", "all.json")
BRUT = os.path.join(R, "public", "scan", "products-cheveux")
JOURNAL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reprise_images.json")
SEUIL = int(os.environ.get("SEUIL", "400"))

ENTETES = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
}

def agrandit(url, large=1400):
    """Remonte la largeur demandee dans l'URL, si elle y est."""
    n, cpt = re.subn(r'([?&](?:width|w|sw|max-w|maxwidth|size)=)\d+', r'\g<1>%d' % large, url, flags=re.I)
    if cpt: return n
    n, cpt = re.subn(r'/(\d{2,4})x(\d{2,4})/', '/%dx%d/' % (large, large), url)
    if cpt: return n
    # Cloudinary : w_600 dans le chemin
    n, cpt = re.subn(r'([,/])w_\d+', r'\g<1>w_%d' % large, url)
    if cpt: return n
    # Adobe Scene7 (Henkel) : pas de parametre, on en ajoute un
    if 'henkel-dam.com/is/image' in url and 'wid=' not in url:
        return url + ('&' if '?' in url else '?') + 'wid=%d' % large
    return None

def taille(chemin):
    from PIL import Image
    with Image.open(chemin) as im: return im.size

def main():
    doc = json.load(open(ALL, encoding="utf-8"))
    prods = doc["products"]
    from PIL import Image

    # On choisit sur la taille du DETOURAGE, pas sur celle du jpg : un jpg de
    # 600 px ou le flacon n'occupe que 130 px donne un detourage de 130 px, et
    # c'est lui qu'on affiche. La liste vient donc de la verification.
    verif = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                        "verif_detourages.json"), encoding="utf-8"))
    trop_petits = {s["id"]: s.get("w", 600) for s in verif["soucis"] if s.get("w", 600) < SEUIL}
    index = {p["id"]: p for p in prods}
    cibles = []
    for pid, wcut in sorted(trop_petits.items(), key=lambda kv: kv[1]):
        p = index.get(pid)
        if not p: continue
        loc = p.get("image_local")
        if not loc: continue
        ch = os.path.join(R, loc)
        if not os.path.exists(ch): continue
        try: w, h = taille(ch)
        except Exception: continue
        src = p.get("image_source_url") or ""
        grand = agrandit(src, 1400)
        if not grand or grand == src: continue
        cibles.append((p, ch, (w, h), grand))

    print("fiches sous %d px avec une URL agrandissable : %d" % (SEUIL, len(cibles)))
    dernier = defaultdict(float)
    gagne = refus = pareil = 0
    journal = []
    for i, (p, ch, avant, url) in enumerate(cibles):
        dom = urlparse(url).netloc
        attente = 1.0 - (time.time() - dernier[dom])
        if attente > 0: time.sleep(attente)
        dernier[dom] = time.time()
        try:
            req = urllib.request.Request(url, headers=ENTETES)
            with urllib.request.urlopen(req, timeout=25) as r:
                data = r.read()
        except Exception as e:
            refus += 1
            journal.append({"id": p["id"], "etat": "refus", "err": str(e)[:70]})
            continue
        tmp = ch + ".neuf"
        open(tmp, "wb").write(data)
        try:
            with Image.open(tmp) as im:
                nw, nh = im.size
                fmt = im.format
        except Exception:
            os.remove(tmp); refus += 1
            journal.append({"id": p["id"], "etat": "illisible"})
            continue
        if max(nw, nh) <= max(avant):
            os.remove(tmp); pareil += 1
            journal.append({"id": p["id"], "etat": "pas_plus_grand", "avant": avant, "recu": [nw, nh]})
            continue
        with Image.open(tmp) as im:
            im = im.convert("RGB")
            im.thumbnail((1000, 1000), Image.LANCZOS)
            im.save(ch, "JPEG", quality=88)
        os.remove(tmp)
        gagne += 1
        journal.append({"id": p["id"], "etat": "agrandi", "avant": avant, "apres": [nw, nh]})
        if (i + 1) % 25 == 0:
            print("  %d/%d · agrandies %d · refus %d · inchangees %d"
                  % (i + 1, len(cibles), gagne, refus, pareil)); sys.stdout.flush()

    json.dump(journal, open(JOURNAL, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\nagrandies %d · refusees %d · pas plus grandes %d" % (gagne, refus, pareil))
    print("journal : %s" % os.path.relpath(JOURNAL))
    print("Relancer le detourage sur ces fiches : python3 catalogue-cheveux/detourage_cheveux.py")

if __name__ == "__main__":
    main()
