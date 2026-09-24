#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Retire les images qui ne montrent PAS le produit.

Deux cas trouves le 20/09 en verifiant les 4 439 detourages un par un :

1. Head & Shoulders : les 30 fiches pointent toutes `hs_logo.png`, le logo du
   site. Le detourage a donc produit 30 logos. Une carte produit qui affiche un
   logo a la place du flacon, c'est pire qu'une carte sans image.

2. Huit paires de produits differents partagent une meme photo (Redken, Cantu,
   DevaCurl, Briogeo, Hairstory, Kalia Nature) : le collecteur a pris un visuel
   de gamme. On ne sait pas laquelle des deux fiches il represente vraiment, donc
   on ne devine pas : les deux sont marquees `image_incertaine`.

Rien n'est supprime du disque : seules les references du catalogue changent.
"""
import json, os, hashlib
from collections import defaultdict

R   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALL = os.path.join(R, "public", "scan", "catalogue-cheveux", "all.json")
DOS = os.path.dirname(os.path.abspath(__file__))

def main():
    doc = json.load(open(ALL, encoding="utf-8"))
    prods = doc["products"]

    # --- 1. les images qui sont un logo -----------------------------------
    sans_image, logos = [], 0
    for p in prods:
        src = (p.get("image_source_url") or "").lower()
        if "logo" in src.rsplit("/", 1)[-1]:
            for cle in ("cutout_url", "image_local", "image_url", "image"):
                if cle in p: p[cle] = None
            p["image_absente"] = "source_etait_un_logo"
            p.pop("image_fond", None)
            logos += 1
            sans_image.append(p["id"])

    # --- 2. une meme photo pour deux produits ------------------------------
    par_hash = defaultdict(list)
    for p in prods:
        u = p.get("cutout_url")
        if not u: continue
        ch = os.path.join(R, u)
        if not os.path.exists(ch): continue
        par_hash[hashlib.md5(open(ch, "rb").read()).hexdigest()].append(p)
    incertaines = 0
    for lot in par_hash.values():
        if len(lot) < 2: continue
        for p in lot:
            p["image_incertaine"] = True
            incertaines += 1

    json.dump(doc, open(ALL, "w", encoding="utf-8"), ensure_ascii=False, separators=(", ", ": "))

    # --- report la meme chose dans les fichiers par marque ------------------
    touches = 0
    index = {p["id"]: p for p in prods}
    for f in sorted(os.listdir(DOS)):
        if not f.endswith(".json") or f.startswith("_"): continue
        chemin = os.path.join(DOS, f)
        d = json.load(open(chemin, encoding="utf-8"))
        if not isinstance(d, dict) or "products" not in d: continue
        change = False
        for p in d["products"]:
            src = index.get(p.get("id"))
            if not src: continue
            for cle in ("cutout_url", "image_local", "image_url", "image",
                        "image_absente", "image_incertaine", "image_fond"):
                if src.get(cle) != p.get(cle):
                    if cle in src: p[cle] = src[cle]
                    else: p.pop(cle, None)
                    change = True
        if change:
            json.dump(d, open(chemin, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            touches += 1

    print("images de logo retirees      : %d fiches" % logos)
    print("photos partagees signalees   : %d fiches" % incertaines)
    print("fichiers de marque mis a jour: %d" % touches)
    restant = sum(1 for p in prods if p.get("cutout_url"))
    print("fiches avec une image propre : %d / %d" % (restant, len(prods)))

if __name__ == "__main__":
    main()
