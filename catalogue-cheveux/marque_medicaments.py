#!/usr/bin/env python3
"""Marque les medicaments pour qu'ils ne tombent jamais dans une routine.

Le 23/09, le profil « chute » recevait un Minoxidil 5 % : c'est un medicament,
pas un geste de soin. On ne le supprime pas du catalogue (il existe, et une
marque peut vouloir l'afficher), on le marque `medicament: true` et le moteur
l'ecarte de la routine.

Usage : python3 marque_medicaments.py [--applique]"""
import json, os, re, sys

RACINE = os.path.dirname(os.path.abspath(__file__))
SERVI = os.path.join(RACINE, "..", "public", "scan", "catalogue-cheveux", "all.json")
MOTS = [r"minoxidil", r"\bfinast", r"\bdutast", r"\bketoconazol", r"\bkétoconazol",
        r"corticoid", r"corticoïd", r"\bpropecia\b", r"\bregaine\b", r"\brogaine\b",
        r"sur ordonnance", r"\bmédicament\b"]


def est_medicament(p):
    t = (str(p.get("name") or "") + " " + str(p.get("description") or "")).lower()
    return any(re.search(m, t) for m in MOTS)


def main():
    applique = "--applique" in sys.argv
    doc = json.load(open(SERVI, encoding="utf-8"))
    prods = doc["products"] if isinstance(doc, dict) else doc
    vus, par_marque = [], {}
    for p in prods:
        if est_medicament(p):
            vus.append(p)
            par_marque.setdefault(p.get("brand"), set()).add(p.get("id"))
            if applique:
                p["medicament"] = True
    for p in vus:
        print("medicament : %-14s %s" % (p.get("brand"), (p.get("name") or "")[:56]))
    print("%d fiches marquees" % len(vus))
    if not applique:
        print("--applique pour ecrire."); return
    json.dump(doc, open(SERVI, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for marque, ids in par_marque.items():
        f = os.path.join(RACINE, "%s.json" % marque)
        if not os.path.exists(f):
            continue
        src = json.load(open(f, encoding="utf-8"))
        liste = src["products"] if isinstance(src, dict) else src
        for x in liste:
            if x.get("id") in ids:
                x["medicament"] = True
        json.dump(src, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("source mise a jour : %s" % marque)
    print("ecrit : %s" % SERVI)


if __name__ == "__main__":
    main()
