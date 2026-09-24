#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Qui part en ligne, et qui attend.

Vercel (plan gratuit) n'accepte que 5 000 fichiers televerses par 24 h, et un
deploiement est un instantane : ce qui n'est pas dans l'envoi n'existe plus a
l'adresse publique. Publier le catalogue entier sans ses images, c'est afficher
des cartes produits cassees sur un site commercial.

Ce script decide donc ce que `public/scan/catalogue/all.json` contient :
la reference complete reste dans `catalogue-v2/all_complet.json`, et le fichier
servi est filtre sur les marques deja publiees, plus celles qu'on ajoute.

    python3 catalogue-v2/publie.py --etat
    python3 catalogue-v2/publie.py --ajoute clinique,guinot --essai
    python3 catalogue-v2/publie.py --ajoute-lot lot2
    python3 catalogue-v2/publie.py --ajoute-lot lot2 --plafond 4400

Il refuse de publier une marque dont les images ne sont pas sur le disque.
"""
import os, sys, json, argparse, shutil

RACINE   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V2       = os.path.join(RACINE, "catalogue-v2")
COMPLET  = os.path.join(V2, "all_complet.json")
PUBLIEES = os.path.join(V2, "marques_publiees.json")
LOTS     = os.path.join(V2, "lots_deploiement.json")
SERVI    = os.path.join(RACINE, "public", "scan", "catalogue", "all.json")
IMAGES   = os.path.join(RACINE, "public", "scan", "products")

def arret(m):
    sys.stderr.write("ARRET : %s\n" % m); sys.exit(2)

def charge_json(p):
    with open(p, encoding="utf-8") as f: return json.load(f)

def produits(doc):
    return doc if isinstance(doc, list) else (doc.get("products") or [])

def enveloppe(doc, liste):
    if isinstance(doc, list): return liste
    d = dict(doc); d["products"] = liste; return d

def complet():
    if not os.path.exists(COMPLET):
        # premiere fois : le fichier servi fait foi, on en garde la reference
        shutil.copy2(SERVI, COMPLET)
        print("reference creee : %s" % os.path.relpath(COMPLET))
    return charge_json(COMPLET)

def publiees():
    if os.path.exists(PUBLIEES): return set(charge_json(PUBLIEES))
    # pas d'etat connu : on le deduit du fichier actuellement servi
    return {p.get("brand") for p in produits(charge_json(SERVI)) if p.get("brand")}

def fichiers_marque(slug):
    base = os.path.join(IMAGES, slug)
    n = 0
    for racine, _, fs in os.walk(base):
        n += sum(1 for f in fs if not f.endswith(".png"))   # les png ne sont references nulle part
    return n

def images_manquantes(ps):
    manquent = []
    for p in ps:
        for cle in ("cutout_url", "image_url"):
            u = p.get(cle)
            if not u or not u.startswith("/"): continue
            if not os.path.exists(os.path.join(RACINE, "public", u.lstrip("/"))):
                manquent.append(u)
            break
    return manquent

I18N   = os.path.join(RACINE, "public", "scan", "vy-i18n.js")
SCAN   = os.path.join(RACINE, "public", "scan", "index.html")

def cale_les_chiffres(n_produits, n_marques):
    """Les nombres affiches avant que le catalogue ait repondu.

    Ils servent de repli une fraction de seconde. Quand ils datent d'un autre
    etat du catalogue, la page annonce 147 marques alors que 49 sont servies :
    un chiffre faux, meme bref, sur une page commerciale. On les recale ici,
    au moment ou on decide ce qui est publie."""
    import re
    faits = []
    if os.path.exists(I18N):
        t = open(I18N, encoding="utf-8").read()
        t2 = re.sub(r"var NUM = \{ p: \d+, b: \d+ \};",
                    "var NUM = { p: %d, b: %d };" % (n_produits, n_marques), t, count=1)
        if t2 != t:
            open(I18N, "w", encoding="utf-8").write(t2); faits.append(os.path.relpath(I18N))
    if os.path.exists(SCAN):
        t = open(SCAN, encoding="utf-8").read()
        t2 = re.sub(r"(data-i18n=\"hd\.free\">Lecture de peau offerte · )\d+( marques)",
                    lambda m: m.group(1) + str(n_marques) + m.group(2), t, count=1)
        if t2 != t:
            open(SCAN, "w", encoding="utf-8").write(t2); faits.append(os.path.relpath(SCAN))
    if faits:
        print("chiffres de repli recales (%d produits, %d marques) : %s"
              % (n_produits, n_marques, ", ".join(faits)))

VIGNORE = os.path.join(RACINE, ".vercelignore")
DEB = "# ---- AUTO publie.py : marques pas encore publiees ----"
FIN = "# ---- fin AUTO publie.py ----"

# Fichiers de marques NON publiees que les pages affichent quand meme en dur
# (les 3 produits de demonstration de l'accueil /scan et des pages /m avant
# chargement). Sans eux, l'accueil aurait 3 images cassees.
GARDER = {
    "charlotte-tilbury": ["charlotte-s-magic-cream-moisturiser.jpg", "magic-eye-rescue.jpg",
                          "magic-serum-crystal-elixir.jpg"],
}


def ecrit_vercelignore(publiees, par_marque):
    """Les images des marques non publiees ne partent pas.

    Vercel refuse un deploiement de plus de 15 000 fichiers, et surtout : envoyer
    les images d'une marque absente du catalogue servi, c'est bruler du quota
    pour des fichiers que personne ne demande. On liste donc les dossiers des
    marques en attente, entre deux balises, et on ne touche a rien d'autre."""
    attente = sorted(set(par_marque) - set(publiees))
    lignes = [DEB,
              "# %d marques en attente, regenere a chaque publication." % len(attente)]
    for m in attente:
        if not m: continue
        if m in GARDER:
            # la marque attend, mais la page d'accueil montre quelques-uns de ses
            # produits en dur : ces fichiers-la partent, le reste du dossier non
            lignes.append("public/scan/products/%s/*" % m)
            lignes += ["!public/scan/products/%s/%s" % (m, f) for f in GARDER[m]]
        else:
            lignes.append("public/scan/products/%s/" % m)
    lignes.append(FIN)
    bloc = "\n".join(lignes) + "\n"

    texte = open(VIGNORE, encoding="utf-8").read() if os.path.exists(VIGNORE) else ""
    if DEB in texte and FIN in texte:
        a = texte.index(DEB); b = texte.index(FIN) + len(FIN) + 1
        texte = texte[:a] + bloc + texte[b:]
    else:
        texte = texte.rstrip("\n") + "\n\n" + bloc
    open(VIGNORE, "w", encoding="utf-8").write(texte)
    print("vercelignore : %d marques en attente exclues de l'envoi" % len(attente))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--etat", action="store_true", help="dire ou on en est, sans rien ecrire")
    ap.add_argument("--ajoute", default="", help="slugs de marques separes par des virgules")
    ap.add_argument("--ajoute-lot", default="", help="lot1 | lot2 | lot3")
    ap.add_argument("--plafond", type=int, default=0,
                    help="nombre maximum de fichiers images a ajouter ; les marques en trop attendent")
    ap.add_argument("--essai", action="store_true", help="tout calculer sans ecrire")
    ap.add_argument("--applique", action="store_true",
                    help="reecrire le fichier servi a partir de l'etat courant, sans rien ajouter")
    a = ap.parse_args()

    doc = complet()
    tous = produits(doc)
    par_marque = {}
    for p in tous:
        par_marque.setdefault(p.get("brand"), []).append(p)
    deja = publiees()

    if a.etat or (not a.ajoute and not a.ajoute_lot and not a.applique):
        reste = sorted(set(par_marque) - deja)
        print("catalogue complet : %d produits, %d marques" % (len(tous), len(par_marque)))
        print("publiees          : %d marques, %d produits"
              % (len(deja), sum(len(par_marque.get(m, [])) for m in deja)))
        print("en attente        : %d marques, %d fichiers images"
              % (len(reste), sum(fichiers_marque(m) for m in reste)))
        if reste: print("                    " + ", ".join(reste[:12]) + (" …" if len(reste) > 12 else ""))
        return

    demandees = [s.strip() for s in a.ajoute.split(",") if s.strip()]
    if a.ajoute_lot:
        lots = charge_json(LOTS)
        if a.ajoute_lot not in lots: arret("lot inconnu : %s" % a.ajoute_lot)
        demandees += lots[a.ajoute_lot]
    demandees = [m for m in dict.fromkeys(demandees) if m not in deja]

    inconnues = [m for m in demandees if m not in par_marque]
    if inconnues: arret("marque(s) absente(s) du catalogue : %s" % ", ".join(inconnues))

    retenues, repoussees, cumul = [], [], 0
    for m in demandees:
        n = fichiers_marque(m)
        if a.plafond and cumul + n > a.plafond:
            repoussees.append((m, n)); continue
        manquent = images_manquantes(par_marque[m])
        if manquent:
            repoussees.append((m, n))
            sys.stderr.write("  ! %s : %d image(s) absente(s) du disque, ex. %s\n"
                             % (m, len(manquent), manquent[0]))
            continue
        retenues.append(m); cumul += n

    nouvelles = sorted(deja | set(retenues))
    liste = [p for p in tous if p.get("brand") in set(nouvelles)]
    print("ajoutees  : %d marques, %d fichiers images" % (len(retenues), cumul))
    if repoussees:
        print("repoussees: %d marques (%d fichiers)"
              % (len(repoussees), sum(n for _, n in repoussees)))
        print("            " + ", ".join(m for m, _ in repoussees[:12])
              + (" …" if len(repoussees) > 12 else ""))
    print("servi     : %d marques, %d produits" % (len(nouvelles), len(liste)))

    if a.essai:
        print("--essai : rien n'a été écrit."); return

    with open(SERVI, "w", encoding="utf-8") as f:
        json.dump(enveloppe(doc, liste), f, ensure_ascii=False, separators=(", ", ": "))
    cale_les_chiffres(len(liste), len(nouvelles))
    ecrit_vercelignore(nouvelles, par_marque)
    with open(PUBLIEES, "w", encoding="utf-8") as f:
        json.dump(nouvelles, f, ensure_ascii=False, indent=1)
    print("écrit : %s et %s" % (os.path.relpath(SERVI), os.path.relpath(PUBLIEES)))

if __name__ == "__main__":
    main()
