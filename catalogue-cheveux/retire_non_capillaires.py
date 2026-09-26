#!/usr/bin/env python3
"""Sort du catalogue capillaire ce qui n'est pas un soin des cheveux.

L'audit du 23/09 a trouve 11 rouges a levres Lavera classes en
« apres-shampooing » et « soin-sans-rincage » : le moteur pouvait donc
recommander un rouge a levres comme 2e geste d'une routine. Les 5 « Hair
Makeup » Curlsmith sont des maquillages de meche (coloration ephemere), pas
une etape de soin : ils sortent aussi de la routine.

Usage : python3 retire_non_capillaires.py [--applique]
Sans --applique, rien n'est ecrit."""
import json, os, sys, re

RACINE = os.path.dirname(os.path.abspath(__file__))
SERVI = os.path.join(RACINE, "..", "public", "scan", "catalogue-cheveux", "all.json")
MOTS = [r"\blipstick\b", r"rouge à lèvres", r"\bhair makeup\b", r"\bmascara\b",
        r"fond de teint", r"\bdentifrice\b", r"\bdéodorant\b", r"\bdeodorant\b",
        # accessoires : un porte-cles ou une spatule ne sont pas un geste de soin
        r"\bkeychain\b", r"porte-cl[ée]s?\b", r"\bspatula\b", r"\bspatule\b"]


# Balayage du 26/09 : produits sortis nommement, parce qu'un mot-cle les
# attraperait mal (« body » est aussi un volume, « bebe » un nom de gamme).
IDS = {
    # peau, pas cheveux : Kelual DS est un gel-creme pour la dermite seborrheique du visage
    "ducray--creme-apaisante",
    # maquillage sourcils / yeux
    "lavera--eyebrow-pencil-blonde-02-116209", "lavera--soft-eyeliner-brown-02-113253",
    "cecred--restoring-lash-and-brow-builder", "virtue--flourish-brow-density-booster",
    # toilette de bebe (corps), coffrets
    "cattier--valise-maternite-indispensables-maman-bebe-cattier", "cattier--essentiels-soins-bebe-cattier",
    "cattier--mousse-lavante-bebe", "cattier--lait-toilette-bebe",
    "klorane--eau-nettoyante-bebe", "klorane--lait-de-toilette-bebe-sans-rincage",
    # ongles, barbe seule, corps, visage
    "luxeol--soin-ongles-fortifiant", "luxeol--huile-barbe-nutrition", "unite-hair--body-wash",
    "oway--fabulous-body-oil", "oway--after-sun-body-balm", "oway--age-better-face-mask",
    "oway--calming-face-mask", "oway--compressed-face-mask-sheets", "oway--glowing-face-gommage",
    "oway--blooming-gleam-face-cream", "oway--de-stress-tonic-potion",
    # complement alimentaire
    "vegamour--gro-advanced-hair-growth-and-density-supplements",
}


def a_sortir(p):
    if p.get("id") in IDS:
        return True
    n = (p.get("name") or "").lower()
    return any(re.search(m, n) for m in MOTS)


def main():
    applique = "--applique" in sys.argv
    doc = json.load(open(SERVI, encoding="utf-8"))
    prods = doc["products"] if isinstance(doc, dict) else doc
    sortis = [p for p in prods if a_sortir(p)]
    gardes = [p for p in prods if not a_sortir(p)]
    for p in sortis:
        print("sorti : %-16s %s" % (p.get("brand"), (p.get("name") or "")[:52]))
    print("%d produits sortis, %d gardes" % (len(sortis), len(gardes)))

    # les fichiers de marque, source du catalogue
    par_marque = {}
    for p in sortis:
        par_marque.setdefault(p.get("brand"), []).append(p.get("id"))
    for marque, ids in par_marque.items():
        f = os.path.join(RACINE, "%s.json" % marque)
        if not os.path.exists(f):
            print("source absente : %s" % f); continue
        src = json.load(open(f, encoding="utf-8"))
        liste = src["products"] if isinstance(src, dict) else src
        reste = [x for x in liste if x.get("id") not in ids]
        print("%s : %d -> %d" % (marque, len(liste), len(reste)))
        if applique:
            if isinstance(src, dict): src["products"] = reste
            else: src = reste
            json.dump(src, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    if not applique:
        print("--applique pour ecrire."); return
    if isinstance(doc, dict):
        doc["products"] = gardes
        if "count" in doc: doc["count"] = len(gardes)
    else:
        doc = gardes
    json.dump(doc, open(SERVI, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("ecrit : %s" % SERVI)
    # le compte de produits par marque affiche sur le site
    fm = os.path.join(os.path.dirname(SERVI), "marques.json")
    if os.path.exists(fm):
        m = json.load(open(fm, encoding="utf-8"))
        n = {}
        for p in gardes: n[p.get("brand")] = n.get(p.get("brand"), 0) + 1
        for x in (m.get("marques") if isinstance(m, dict) else m):
            if x.get("slug") in n and "produits" in x: x["produits"] = n[x["slug"]]
        json.dump(m, open(fm, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("ecrit : %s" % fm)


if __name__ == "__main__":
    main()
