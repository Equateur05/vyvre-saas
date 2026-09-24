#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification de TOUS les detourages capillaires, un par un.

Ce qu'on mesure sur chaque fichier, sans juger a l'oeil :
  - part de l'image reellement opaque (un flacon occupe entre 8 et 75 %) ;
  - contact avec les bords (un produit coupe touche le cadre) ;
  - nombre de morceaux separes (un detourage propre en a un, deux pour un
    coffret ; au-dela ce sont des residus) ;
  - fond restant : les fichiers marques image_fond gardent leur fond d'origine ;
  - image quasi vide, ou au contraire opaque partout (le detourage n'a rien fait).

Sortie : un rapport JSON + un resume lisible + une planche des cas suspects.
"""
import os, sys, json, math
from collections import Counter
from PIL import Image

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT    = os.path.join(RACINE, "public", "scan", "catalogue-cheveux", "all.json")
SORTIE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "verif_detourages.json")

def morceaux(masque, w, h, mini):
    """Nombre de composantes connexes de taille >= mini (balayage iteratif)."""
    vus = bytearray(w * h)
    n = 0
    for dep in range(w * h):
        if masque[dep] == 0 or vus[dep]:
            continue
        pile = [dep]; vus[dep] = 1; taille = 0
        while pile:
            i = pile.pop(); taille += 1
            x = i % w; y = i // w
            for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0 <= nx < w and 0 <= ny < h:
                    j = ny*w + nx
                    if masque[j] and not vus[j]:
                        vus[j] = 1; pile.append(j)
        if taille >= mini:
            n += 1
    return n

def verifie(chemin):
    im = Image.open(chemin)
    fmt = im.format
    im = im.convert("RGBA")
    w, h = im.size
    # on travaille sur une vignette : 40x fois moins de pixels, memes conclusions
    p = im.resize((120, 120), Image.BILINEAR)
    a = p.getchannel("A").tobytes()
    W = H = 120
    opaque = bytearray(1 if v > 128 else 0 for v in a)
    part = sum(opaque) / (W * H)

    # contact avec les bords
    bord = 0
    for x in range(W):
        bord += opaque[x] + opaque[(H-1)*W + x]
    for y in range(H):
        bord += opaque[y*W] + opaque[y*W + W-1]
    partBord = bord / (2*W + 2*H)

    n = morceaux(opaque, W, H, 20) if 0 < part < 0.99 else (1 if part >= 0.99 else 0)

    # couleur moyenne des pixels opaques, pour reperer les images vides
    px = p.load()
    somme = [0, 0, 0]; cpt = 0
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            if opaque[y*W + x]:
                r, g, b, _ = px[x, y]
                somme[0] += r; somme[1] += g; somme[2] += b; cpt += 1
    moy = [s // cpt for s in somme] if cpt else [0, 0, 0]

    return { "w": w, "h": h, "format": fmt, "part": round(part, 4),
             "bord": round(partBord, 4), "morceaux": n, "moy": moy }

def main():
    doc = json.load(open(CAT, encoding="utf-8"))
    produits = doc.get("products", doc if isinstance(doc, list) else [])
    avec = [p for p in produits if p.get("cutout_url")]
    print("fiches avec detourage : %d / %d" % (len(avec), len(produits)))

    res, soucis = [], []
    manquants = 0
    for i, p in enumerate(avec):
        chemin = os.path.join(RACINE, p["cutout_url"])
        if not os.path.exists(chemin):
            manquants += 1
            soucis.append({ "id": p["id"], "quoi": "fichier_absent", "url": p["cutout_url"] })
            continue
        try:
            m = verifie(chemin)
        except Exception as e:
            soucis.append({ "id": p["id"], "quoi": "illisible", "err": str(e)[:80] })
            continue
        m["id"] = p["id"]; m["marque"] = p.get("brand")
        m["fond"] = bool(p.get("image_fond"))
        m["octets"] = os.path.getsize(chemin)
        defauts = []
        if m["part"] >= 0.985:               defauts.append("aucun_detourage")   # tout opaque
        elif m["part"] < 0.03:               defauts.append("presque_vide")
        elif m["part"] > 0.80 and not m["fond"]: defauts.append("masque_trop_large")
        if m["bord"] > 0.25 and not m["fond"]:   defauts.append("colle_aux_bords")
        if m["morceaux"] >= 4:               defauts.append("morceaux_%d" % m["morceaux"])
        if m["w"] != 600 or m["h"] != 600:   defauts.append("taille_%dx%d" % (m["w"], m["h"]))
        if m["format"] != "WEBP":            defauts.append("format_%s" % m["format"])
        if defauts:
            m["defauts"] = defauts
            soucis.append(m)
        res.append(m)
        if (i + 1) % 400 == 0:
            print("  %d/%d vus" % (i + 1, len(avec))); sys.stdout.flush()

    parts = sorted(x["part"] for x in res)
    def pct(q): return round(parts[int(q * (len(parts)-1))], 3) if parts else None
    resume = {
        "fiches": len(produits), "avec_detourage": len(avec), "verifies": len(res),
        "fichiers_absents": manquants,
        "avec_fond_dorigine": sum(1 for x in res if x["fond"]),
        "part_opaque": { "p10": pct(.10), "mediane": pct(.50), "p90": pct(.90) },
        "defauts": Counter(d for x in soucis for d in x.get("defauts", [x.get("quoi","?")])),
        "octets_total_Mo": round(sum(x["octets"] for x in res) / 1e6, 1),
    }
    resume["defauts"] = dict(resume["defauts"])
    json.dump({ "resume": resume, "soucis": soucis }, open(SORTIE, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(json.dumps(resume, ensure_ascii=False, indent=1))
    print("detail : %s (%d cas)" % (os.path.relpath(SORTIE), len(soucis)))

if __name__ == "__main__":
    main()
