#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Import du CATALOGUE CAPILLAIRE vyvre dans Supabase.

NE POUSSE RIEN TANT QU'ON NE LE LANCE PAS A LA MAIN, et refuse de partir
si les variables d'environnement ne sont pas là (elles sont sur Vercel,
pas sur ce Mac).

    export NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    export SUPABASE_SERVICE_ROLE_KEY=...
    python3 catalogue-cheveux/supabase/import.py --dry-run   # contrôle seul
    python3 catalogue-cheveux/supabase/import.py             # import réel

Ne touche QUE hair_brands et hair_products. Les tables du scan peau
(skin_products, products, brands, scans…) ne sont jamais lues ni écrites.
Exécuter schema.sql avant le premier import.
"""
import os, sys, io, json, glob, argparse, urllib.request, urllib.error

HERE      = os.path.dirname(os.path.abspath(__file__))
CATALOGUE = os.path.dirname(HERE)                       # catalogue-cheveux/
SKIN_ALL  = os.path.join(os.path.dirname(CATALOGUE), "public", "scan", "catalogue", "all.json")
TABLES    = ("hair_brands", "hair_products")
BATCH     = 200

def die(msg, code=2):
    sys.stderr.write("ARRET : %s\n" % msg)
    sys.exit(code)

def env():
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").strip().rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    manquantes = [n for n, v in (("NEXT_PUBLIC_SUPABASE_URL", url), ("SUPABASE_SERVICE_ROLE_KEY", key)) if not v]
    if manquantes:
        die("variable(s) d'environnement absente(s) : %s.\n"
            "        Elles sont sur Vercel, pas sur ce Mac : exporte-les avant de relancer." % ", ".join(manquantes))
    if not url.startswith("https://"):
        die("NEXT_PUBLIC_SUPABASE_URL doit commencer par https://")
    return url, key

def charge():
    marques_f = os.path.join(CATALOGUE, "_marques.json")
    if not os.path.exists(marques_f):
        die("catalogue-cheveux/_marques.json est introuvable.")
    marques = json.load(open(marques_f, encoding="utf-8"))
    produits, par_marque = [], {}
    for f in sorted(glob.glob(os.path.join(CATALOGUE, "*.json"))):
        base = os.path.basename(f)
        if base.startswith("_"):
            continue
        d = json.load(open(f, encoding="utf-8"))
        # le dossier contient aussi des fichiers de travail (journal de detourage…) :
        # une fiche de marque, c'est un "brand" et une liste "products", rien d'autre.
        if not isinstance(d, dict) or "brand" not in d or "products" not in d:
            continue
        ps = d.get("products", [])
        par_marque[d["brand"]] = len(ps)
        for p in ps:
            produits.append({
                "id": p["id"], "brand": p["brand"], "brand_name": p["brand_name"], "name": p["name"],
                "url": p["url"], "url_verifiee_le": p.get("url_verifiee_le"),
                "price_eur": p.get("price_eur"), "price_source": p.get("price_source"),
                "image_source_url": p.get("image_source_url"), "image_local": p.get("image_local"),
                "categorie": p["categorie"], "etape": p["etape"],
                "cheveux_cibles": p.get("cheveux_cibles") or [], "actifs": p.get("actifs") or [],
                "claims": p.get("claims") or [], "ingredients": p.get("ingredients"),
                "description": p.get("description"), "source": p.get("source"),
                # 23/09 : les trois colonnes ajoutees a ecrire_csv() n'etaient pas
                # relues ici, le CSV sortait donc avec trois colonnes vides.
                # les deux drapeaux sont NOT NULL cote base : une fiche qui ne dit
                # rien vaut « image presente », pas null (sinon la base refuse le lot)
                "image_absente": bool(p.get("image_absente")),
                "image_incertaine": bool(p.get("image_incertaine")),
                "cutout_url": p.get("cutout_url"),
                "ciblage_source": p.get("ciblage_source"),
            })
    # la table attend name/univers/pays/site : on normalise les cles du fichier (nom, produits)
    PAYS = {"France":"FR","États-Unis":"US","Etats-Unis":"US","Royaume-Uni":"GB","Italie":"IT","Espagne":"ES",
            "Allemagne":"DE","Japon":"JP","Coree du Sud":"KR","Corée du Sud":"KR","Australie":"AU","Canada":"CA",
            "Suisse":"CH","Bresil":"BR","Brésil":"BR","Pays-Bas":"NL","Belgique":"BE","Suede":"SE","Suède":"SE",
            "Danemark":"DK","Inde":"IN","Coree":"KR","Corée":"KR"}
    UNIV = {"luxe","pharmacie","normal","petit-prix","salon"}
    nettes = []
    for m in marques:
        u = (m.get("univers") or "normal").strip().lower()
        pays = (m.get("pays") or "").strip()
        nettes.append({
            "slug": m["slug"],
            "name": m.get("name") or m.get("nom") or m["slug"],
            "univers": u if u in UNIV else "normal",
            "pays": PAYS.get(pays, pays[:2].upper() if len(pays) >= 2 else None),
            "site": m.get("site"),
            "product_count": par_marque.get(m["slug"], 0),
        })
    return nettes, produits

def controles(marques, produits):
    """Refuse d'importer si le catalogue cheveux croise le catalogue peau."""
    erreurs = []
    slugs = {m["slug"] for m in marques}
    for p in produits:
        if p["brand"] not in slugs:
            erreurs.append("marque absente de _marques.json : %s" % p["brand"]); break
    vus = set()
    for p in produits:
        if p["id"] in vus: erreurs.append("id en double : %s" % p["id"]); break
        vus.add(p["id"])
    for p in produits:
        il = p.get("image_local")
        if il and not il.startswith("public/scan/products-cheveux/"):
            erreurs.append("image hors du dossier cheveux : %s" % il); break
    if os.path.exists(SKIN_ALL):
        try:
            skin = json.load(open(SKIN_ALL, encoding="utf-8"))
            sp = skin.get("products", skin) if isinstance(skin, dict) else skin
            sid = {str(x.get("id")) for x in sp if isinstance(x, dict)}
            surl = {str(x.get("url") or x.get("link") or "").split("?")[0].rstrip("/").lower() for x in sp if isinstance(x, dict)}
            for p in produits:
                if p["id"] in sid:
                    erreurs.append("id déjà présent dans le catalogue PEAU : %s" % p["id"]); break
            for p in produits:
                if p["url"].split("?")[0].rstrip("/").lower() in surl:
                    erreurs.append("URL déjà présente dans le catalogue PEAU : %s" % p["url"]); break
        except Exception as e:
            erreurs.append("lecture du catalogue peau impossible : %r" % e)
    return erreurs

def post(url, key, table, rows):
    data = json.dumps(rows, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        "%s/rest/v1/%s?on_conflict=%s" % (url, table, "slug" if table == "hair_brands" else "id"),
        data=data, method="POST",
        headers={"apikey": key, "Authorization": "Bearer " + key,
                 "Content-Type": "application/json",
                 "Prefer": "resolution=merge-duplicates,return=minimal"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status
    except urllib.error.HTTPError as e:
        die("%s a refusé le lot : HTTP %s %s" % (table, e.code, e.read()[:400].decode("utf-8", "replace")))

def pg_array(v):
    """Un text[] Postgres en CSV : {"a","b"}. Les guillemets internes se doublent."""
    if not v:
        return "{}"
    def q(x):
        return '"' + str(x).replace("\\", "\\\\").replace('"', '\\"') + '"'
    return "{" + ",".join(q(x) for x in v) + "}"

def ecrire_csv(marques, produits):
    """Regenere les deux CSV a partir du catalogue courant, pour un import par
    l'interface Supabase quand la cle de service n'est pas sur la machine."""
    import csv
    sorties = []
    fb = os.path.join(HERE, "hair_brands.csv")
    with io.open(fb, "w", encoding="utf-8", newline="") as f:
        cols = ["slug", "name", "univers", "pays", "site", "product_count"]
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for m in marques:
            w.writerow({c: ("" if m.get(c) is None else m.get(c)) for c in cols})
    sorties.append((fb, len(marques)))

    fp = os.path.join(HERE, "hair_products.csv")
    with io.open(fp, "w", encoding="utf-8", newline="") as f:
        cols = ["id", "brand", "brand_name", "name", "url", "url_verifiee_le", "price_eur",
                "price_source", "image_source_url", "image_local", "categorie", "etape",
                "cheveux_cibles", "actifs", "claims", "ingredients", "description", "source",
                # 23/09 : sans ces trois colonnes, l'import perdait les alertes qualite
                # d'image (fiche sans photo, photo douteuse) et le detourage.
                "image_absente", "image_incertaine", "cutout_url"]
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for p in produits:
            ligne = {}
            for c in cols:
                v = p.get(c)
                if c in ("cheveux_cibles", "actifs", "claims"):
                    ligne[c] = pg_array(v)
                else:
                    ligne[c] = "" if v is None else v
            w.writerow(ligne)
    sorties.append((fp, len(produits)))
    for chemin, n in sorties:
        print("écrit : %s (%d lignes)" % (os.path.relpath(chemin), n))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="tout contrôler sans rien envoyer")
    ap.add_argument("--csv", action="store_true",
                    help="regenerer hair_brands.csv et hair_products.csv, sans rien envoyer")
    a = ap.parse_args()

    marques, produits = charge()
    erreurs = controles(marques, produits)
    print("marques : %d   produits : %d" % (len(marques), len(produits)))
    if erreurs:
        for e in erreurs: sys.stderr.write("  ! %s\n" % e)
        die("contrôles échoués, rien n'a été envoyé.")
    print("contrôles OK : aucun id ni aucune URL en commun avec le catalogue peau.")

    if a.csv:
        ecrire_csv(marques, produits)
        print("--csv : rien n'a été envoyé à Supabase.")
        return

    if a.dry_run:
        print("--dry-run : rien n'a été envoyé.")
        return

    url, key = env()
    for i in range(0, len(marques), BATCH):
        post(url, key, "hair_brands", marques[i:i+BATCH])
    print("hair_brands : %d lignes" % len(marques))
    for i in range(0, len(produits), BATCH):
        post(url, key, "hair_products", produits[i:i+BATCH])
        print("  hair_products %d/%d" % (min(i+BATCH, len(produits)), len(produits)))
    print("import terminé.")

if __name__ == "__main__":
    main()
