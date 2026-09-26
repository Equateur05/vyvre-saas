#!/usr/bin/env python3
"""Corrections de categorie du catalogue peau (balayage du 26/09/2026).

Chaque correction a ete decidee a la main, nom et description du produit sous
les yeux, apres un balayage automatique nom <-> categorie. Les scores
(concern_scores, targets, score_raisons) dependent de la categorie : ils sont
recalcules avec fusion_scores.score_produit, sur la fiche complete (INCI,
description, claims) du fichier de marque.

Fichiers tenus a jour, les memes produits partout :
  catalogue-v2/all_complet.json          (reference de publie.py)
  public/scan/catalogue/<marque>.json    (fiche complete par marque)
  catalogue-v2/sortie/<marque>.json + sortie/all.json (sortie de fusion_scores.py)
Ensuite : python3 catalogue-v2/publie.py --applique

Usage : python3 corrige_categories.py [--applique]
"""
import json, os, sys

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
from fusion_scores import score_produit  # noqa: E402

CAT = {
    # soins cibles imperfections (la categorie des traitements locaux est autre-visage)
    "origins--super-spot-remover-acne-treatment-gel-with-salicylic-acid": "autre-visage",   # etait nettoyant
    "dermalogica--deep-breakout-liquid-patch-patch-liquide-anti-imperfections": "autre-visage",  # etait creme
    "patyka--soin-cible-stop-boutons": "autre-visage",
    "respire--soin-flash-boutons": "autre-visage",
    "typology--soin-cible-imperfections-bakuchiol-1-extrait-d-arbre-a-the": "autre-visage",
    "skin1004--tea-trica-spot-cream": "autre-visage",
    "neutrogena--neutrogena-stubborn-acne-spot-drying-lotion": "autre-visage",
    # traitements locaux et patchs anti-boutons (second balayage)
    "caudalie--vinopure-stop-boutons-salicylique-l-acide-salicylique": "autre-visage",
    "cetaphil--fast-rescue-pimple-patch": "autre-visage",
    "dr-dennis-gross--alpha-beta-acne-spot-treatment": "autre-visage",
    "neutrogena--neutrogena-rapid-clear-acne-eliminating-spot-gel-with-witch-hazel": "autre-visage",
    "nuxe--stop-boutons": "autre-visage",
    "anua--triple-acid-spot-care-microdart-patch": "autre-visage",
    "anua--ultra-thin-spot-cover-patch": "autre-visage",
    "axis-y--spot-the-difference-blemish-treatment": "autre-visage",
    "kiehls--truly-targeted-overnight-blemish-patch": "autre-visage",
    "manyo--ac-rescue-ampoule-spot-patch": "autre-visage",
    "medicube--3h-overnight-drying-lotion": "autre-visage",
    "mediheal--derma-clear-madecassoside-blemish-spot-patch": "autre-visage",
    "mediheal--derma-clear-teatree-cica-spot-patch": "autre-visage",
    "mediheal--derma-clear-teatree-trouble-spot-patch": "autre-visage",
    "mizon--ddfd5d7a": "autre-visage",
    "neutrogena--neutrogena-on-the-spot-acne-treatment": "autre-visage",
    "neutrogena--neutrogena-sensitive-skin-blemish-patches": "autre-visage",
    "neutrogena--neutrogena-sensitive-skin-triangle-acne-patches": "autre-visage",
    "sand-and-sky--oil-control-dual-action-blemish-patches": "autre-visage",
    "skin1004--tea-trica-spot-cover-patch": "autre-visage",
    "some-by-mi--7cc8f4ea": "autre-visage",
    "some-by-mi--10a48652": "autre-visage",
    "torriden--balanceful-azelaic-acid-micropoint-spot-patch": "autre-visage",
    "yves-rocher--soin-sos-boutons": "autre-visage",
    # nettoyants / demaquillants ranges ailleurs
    "payot--gelee-nettoyante-moussante-purifiante": "nettoyant",          # etait creme
    "bioderma--crealine-gel-moussant": "nettoyant",
    "bioderma--hydrabio-gel-moussant": "nettoyant",
    "bioderma--sebium-gel-moussant": "nettoyant",
    "chanel--demaquillant-lacte-intense": "nettoyant",                   # etait contour-yeux
    "thalgo--gelee-micellaire-demaquillante-yeux": "nettoyant",
    "uriage--demaquillant-yeux-waterproof": "nettoyant",
    "nuxe--demaquillant-waterproof-yeux-et-levres-biphase": "nettoyant",
    "kiko-milano--new-pure-clean-eyes-lips": "nettoyant",
    "111skin--brightening-double-cleanse": "nettoyant",                   # etait solaire-visage
    "estee-lauder--perfectly-clean-creme-nettoyante-multi-action-masque-hydratant": "nettoyant",
    "estee-lauder--perfectly-clean-mousse-nettoyante-multi-action-masque-purifiant": "nettoyant",
    "neutrogena--neutrogena-clear-pore-cleanser-mask": "nettoyant",
    # ranges nettoyant alors que ce n'en sont pas
    "cellcosmet--cellmen-cellsplash": "lotion",                          # tonique
    "medik8--press-clear": "exfoliant",                                  # tonique BHA
    "medik8--press-glow": "exfoliant",                                   # tonique PHA
    "darphin--dermabrasion-anti-age": "exfoliant",
    # masques ranges en creme / huile / autre
    "mary-cohr--matimasque-purifiant": "masque",
    "mediheal--derma-modeling-pack-hyaluronate-moisture": "masque",
    "mediheal--derma-modeling-pack-teatree-calming": "masque",
    "mediheal--derma-modeling-pack-vitamin-brightening": "masque",
    "mediheal--derma-modeling-pack-madecassoside-blemish": "masque",
    "mediheal--derma-modeling-pack-collagen-firming": "masque",
    # protection solaire (SPF 30 et plus, ou vendu comme ecran) non marquee
    "caudalie--creme-tres-haute-protection-spf50": "solaire-visage",
    "cerave--creme-hydratante-visage-spf30": "solaire-visage",
    "etude-house--soonjung-director-s-tone-up-cream-spf50-pa": "solaire-visage",
    "fenty-skin--a-ap-rocky-hydra-vizor-invisible-moisturizer-broad-spectrum-spf30sunscreen-colle": "solaire-visage",
    "horace--hydratant-visage-matifiant-spf30": "solaire-visage",
    "noble-panacea--multi-defense-cream-spf50": "solaire-visage",
    "revive--intensite-creme-lustre-day-firming-moisture-cream-broad-spectrum-spf30sunscreen": "solaire-visage",
    "neutrogena--neutrogena-mineral-ultra-sheer-dry-touch-spf30sunscreen-lotion": "solaire-visage",
    "bioderma--pigmentbio-daily-care-spf50": "solaire-visage",
    "mary-cohr--day-cream": "solaire-visage",                            # creme eclaircissante FPS 30 (lu sur le pot)
    # contour des yeux
    "sesderma--k-vit-serum-anticernes": "contour-yeux",
    "valmont--prime-contour": "contour-yeux",                            # creme contour yeux et levres
    # divers
    "thalgo--embruns-vivifiants-remineralisants": "lotion",               # brume
    "polaar--anti-age-de-glace-polaar-men": "creme",
}

# hors soin du visage : sortis du catalogue
RETIRES = {
    "bioderma--pigmentbio-sensitive-areas": "zones sensibles du corps (aisselles, plis, zones intimes)",
}


def charge(p):
    return json.load(open(p, encoding="utf-8"))


def ecrit(p, doc, compact):
    s = json.dumps(doc, ensure_ascii=False, separators=(", ", ": ") if compact == 1 else (",", ":")) \
        if compact else json.dumps(doc, ensure_ascii=False, indent=1)
    with open(p + ".tmp", "w", encoding="utf-8") as f:
        f.write(s)
    os.replace(p + ".tmp", p)


def main():
    applique = "--applique" in sys.argv
    complet_p = os.path.join(ICI, "all_complet.json")
    complet = charge(complet_p)
    par_id = {p["id"]: p for p in complet["products"]}
    RETIRES_RESTANTS = {i: r for i, r in RETIRES.items() if i in par_id}   # deja sortis : rien a faire
    inconnus = [i for i in CAT if i not in par_id]
    if inconnus:
        sys.exit("ids inconnus : %s" % inconnus)

    # la fiche complete, pour recalculer les scores
    nouveaux = {}
    marques = sorted({par_id[i]["brand"] for i in list(CAT) + list(RETIRES_RESTANTS)})
    for m in marques:
        f = os.path.join(RACINE, "public", "scan", "catalogue", m + ".json")
        for p in charge(f)["products"]:
            if p["id"] in CAT:
                q = dict(p); q["categorie"] = CAT[p["id"]]
                s, t, r, _ = score_produit(q)
                nouveaux[p["id"]] = {"categorie": CAT[p["id"]], "concern_scores": s, "targets": t, "score_raisons": r}
                print("%-14s -> %-14s %s" % (p["categorie"], CAT[p["id"]], p["id"]))
    for i, raison in RETIRES_RESTANTS.items():
        print("retire : %s (%s)" % (i, raison))
    if len(nouveaux) != len(CAT):
        sys.exit("fiches completes introuvables : %s" % (set(CAT) - set(nouveaux)))
    if not applique:
        print("--applique pour ecrire."); return

    def maj(liste):
        out, n = [], 0
        for p in liste:
            if p.get("id") in RETIRES:
                n += 1; continue
            if p.get("id") in nouveaux:
                p.update(nouveaux[p["id"]]); n += 1
            out.append(p)
        return out, n

    complet["products"], n = maj(complet["products"])
    ecrit(complet_p, complet, 2)
    print("all_complet.json : %d produits touches" % n)
    for m in marques:
        for f, compact in ((os.path.join(RACINE, "public", "scan", "catalogue", m + ".json"), 0),
                           (os.path.join(ICI, "sortie", m + ".json"), 0)):
            if not os.path.exists(f): continue
            d = charge(f); d["products"], n = maj(d["products"])
            if n: ecrit(f, d, compact); print("%s : %d" % (os.path.relpath(f, RACINE), n))
    f = os.path.join(ICI, "sortie", "all.json")
    if os.path.exists(f):
        d = charge(f); d["products"], n = maj(d["products"])
        if n: ecrit(f, d, 2); print("sortie/all.json : %d" % n)


if __name__ == "__main__":
    main()
