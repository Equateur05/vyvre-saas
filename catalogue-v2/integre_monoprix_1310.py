#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Integre les soins visage des marques vues chez Monoprix (13/10/2026, GO de Charles), SANS reconstruire le reste.
Meme pipeline que integre_marques_1210.py (12/10), lu dans ajouts4/ au lieu de ajouts3/.

Source : catalogue-v2/ajouts4/<slug>.json (une fiche par produit : nom exact, categorie, URL de vente, source,
liste INCI et sa source, photo d'origine, prix, stock constate le 13/10). Donnees reelles uniquement : site
officiel de la marque, ou la fiche Monoprix (courses.monoprix.fr : nom, INCI, photo, prix releve le 13/10).
Le prix n'est renseigne que s'il vient d'une vraie source datee (Monoprix, ou la boutique officielle de la marque).

Pour chaque fiche : photo telechargee (600 px max, JPEG 82) dans public/scan/products/<slug>/v2/, detourage
avec le pipeline existant (detourage.traiter, u2net), scores avec fusion_scores.score_produit, puis ajout au
catalogue servi (all.json, <slug>.json, marques.json) et a la reference (all_complet.json, marques_publiees.json).
Une photo dont le detourage reste a fond blanc est marquee image_fond (comme les fiches existantes).

Sothys n'est ni lue ni modifiee. Usage : python3 catalogue-v2/integre_monoprix_1310.py [--essai]
"""
import io, json, os, re, sys, unicodedata, urllib.request, gzip
from PIL import Image

V2 = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(V2)
PUBLIC = os.path.join(RACINE, "public")
sys.path.insert(0, V2)
import fusion_scores as FS
import detourage as DT
ESSAI = "--essai" in sys.argv
LE = "2026-10-13"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8", "Accept-Language": "fr-FR,fr;q=0.9", "Accept-Encoding": "gzip"}
# nouvelles maisons (absentes de marques.json)
NOUVELLES = {
    "loreal-paris": {"nom": "L'Oréal Paris", "univers": "petit-prix", "pays": "FR", "site": "https://www.loreal-paris.fr/"},
    "diadermine": {"nom": "Diadermine", "univers": "petit-prix", "pays": "FR", "site": "https://www.diadermine.fr/"},
    "erborian": {"nom": "Erborian", "univers": "normal", "pays": "KR", "site": "https://fr.erborian.com/"},
    "kreme": {"nom": "Krème", "univers": "normal", "pays": "FR", "site": "https://kreme-paris.com/"},
    "biore": {"nom": "Bioré", "univers": "petit-prix", "pays": "JP", "site": "https://www.biore.com/fr-fr/"},
    "korres": {"nom": "Korres", "univers": "normal", "pays": "GR", "site": "https://www.korres.fr/"},
    "so-bio-etic": {"nom": "SO'BiO étic", "univers": "petit-prix", "pays": "FR", "site": "https://www.leanature.com/"},
    "christian-lenart": {"nom": "Christian Lénart", "univers": "petit-prix", "pays": "FR", "site": "https://www.christianlenart.com/"},
    "avril": {"nom": "Avril", "univers": "petit-prix", "pays": "FR", "site": "https://www.avril-beaute.fr/"},
    "la-beaute-bio": {"nom": "Monoprix La Beauté Bio", "univers": "petit-prix", "pays": "FR", "site": "https://courses.monoprix.fr/"}}

# 12/10 : score_produit ne garde que 6 raisons ; un actif fort plus bas dans la liste (PHA de l'Abeille Royale
# Double R, BHA...) disparaissait, et vy-choix (estAcide / estRetino lisent score_raisons) le proposait le matin.
# On ajoute donc toujours les actifs forts presents dans l'INCI, au format lu par vy-choix.
FORTS = [("retinol", r"^retinol\b"), ("retinal", r"retinal"), ("retinoate (HPR)", r"hydroxypinacolone retinoate"),
         ("acide glycolique", r"glycolic acid"), ("acide lactique", r"^lactic acid"), ("PHA", r"gluconolactone|lactobionic"),
         ("acide salicylique / BHA", r"salicylic acid|betaine salicylate|salix alba|willow bark")]
def actifs_forts(inci, raisons):
    toks = FS.split_inci(inci) if inci else []
    out = list(raisons)
    for nom, rx in FORTS:
        if any(r.lower().startswith(nom.lower() + " (inci #") for r in out): continue
        for i, t in enumerate(toks):
            if re.search(rx, t):
                out.insert(len(out) - 1, "%s (INCI #%d)" % (nom, i + 1)); break
    return out

def slugifie(s):
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s.replace("&", " and ")).strip("-")[:90]

def telecharge(url, dst, img_dir_locale=None):
    """photo produit -> JPEG 600 px max (fond blanc sous la transparence)"""
    if img_dir_locale and os.path.exists(img_dir_locale):
        b = open(img_dir_locale, "rb").read()
    else:
        u = url
        if "beautysuccess.fr/media/catalog/product/cache/" in u:   # l'original plutot que la vignette
            u = re.sub(r"/cache/[0-9a-f]{32}/", "/", u)
        if "thgimages.com/?url=" in u:
            u = urllib.request.unquote(u.split("?url=", 1)[1].split("&", 1)[0])
        r = urllib.request.Request(u, headers=UA)
        with urllib.request.urlopen(r, timeout=40) as f:
            b = f.read()
            if f.headers.get("Content-Encoding") == "gzip": b = gzip.decompress(b)
    im = Image.open(io.BytesIO(b)); im.load()
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA"); fond = Image.new("RGB", im.size, (255, 255, 255)); fond.paste(im, mask=im.split()[3]); im = fond
    else:
        im = im.convert("RGB")
    if im.width > 600: im = im.resize((600, round(im.height * 600 / im.width)), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "JPEG", quality=82, optimize=True)
    return im.size

def main():
    servi_f = os.path.join(PUBLIC, "scan/catalogue/all.json"); servi = json.load(open(servi_f))
    deja = {p["id"] for p in servi["products"]}
    noms_deja = {(p["brand"], slugifie(p["name"])) for p in servi["products"]}
    marques_f = os.path.join(PUBLIC, "scan/catalogue/marques.json"); marques = json.load(open(marques_f))
    complet_f = os.path.join(V2, "all_complet.json"); complet = json.load(open(complet_f))
    pub_f = os.path.join(V2, "marques_publiees.json"); publiees = json.load(open(pub_f))
    journal = DT.lire_journal()
    bilan = {}
    for f in sorted(os.listdir(os.path.join(V2, "ajouts4"))):
        if not f.endswith(".json") or "sothys" in f: continue
        slug = f[:-5]
        src = json.load(open(os.path.join(V2, "ajouts4", f)))["products"]
        meta = marques["marques"].get(slug) or NOUVELLES[slug]
        nom_m = next((p["brand_name"] for p in servi["products"] if p["brand"] == slug), meta["nom"])
        pos0 = sum(1 for p in servi["products"] if p["brand"] == slug)
        garde = []
        for p in src:
            pid = slug + "--" + slugifie(p["name"])
            if pid in deja or (slug, slugifie(p["name"])) in noms_deja:
                print("deja au catalogue :", pid); continue
            fichier = slugifie(p["name"])[:70]
            img_rel = "scan/products/%s/v2/%s.jpg" % (slug, fichier)
            img_abs = os.path.join(PUBLIC, img_rel)
            if not ESSAI:
                loc = p.get("image_locale") and os.path.join(RACINE, p["image_locale"])
                telecharge(p["image_source_url"], img_abs, loc)
                cut = DT.cutout_de("/" + img_rel)
                r = DT.traiter({"src": img_abs, "dst": PUBLIC + cut, "image_url": "/" + img_rel, "cutout_url": cut, "modele": "u2net.onnx"})
                journal["images"]["/" + img_rel] = r
                if r.get("statut") not in ("ok", "douteux"): raise SystemExit("detourage en echec : %s %s" % (img_rel, r))
            else:
                cut = DT.cutout_de("/" + img_rel); r = {"statut": "essai"}
            sp = {"name": p["name"], "categorie": p["categorie"], "ingredients": p.get("inci"), "description": p.get("description"), "claims": []}
            scores, targets, raisons, _ = FS.score_produit(sp)
            raisons = actifs_forts(p.get("inci"), raisons)
            eur = p.get("prix") if p.get("devise") == "EUR" else None
            rec = {"id": pid, "name": p["name"], "price_eur": eur, "image_url": "/" + img_rel, "url": p["url"], "targets": targets,
                   "concern_scores": scores, "position": pos0 + len(garde), "brand": slug, "brand_name": nom_m, "categorie": p["categorie"],
                   "price_source": (p["source"] if eur is not None else None), "url_verifiee_le": LE, "pays": meta.get("pays"),
                   "univers": meta.get("univers"), "score_raisons": raisons, "name_origine": p.get("name_source") or p["name"],
                   "cutout_url": cut, "source_fiche": p["source"]}
            if p.get("spf"): rec["spf"] = p["spf"]
            if r.get("statut") == "douteux": rec["image_fond"] = True
            garde.append((rec, p))
            deja.add(pid)
        bilan[slug] = [(r["name"], r["categorie"], r.get("image_fond", False)) for r, _ in garde]
        if ESSAI or not garde: continue
        servi["products"] += [r for r, _ in garde]
        (complet["products"] if isinstance(complet, dict) else complet).extend(dict(r) for r, _ in garde)
        mf = os.path.join(PUBLIC, "scan/catalogue", slug + ".json")
        fiche = json.load(open(mf)) if os.path.exists(mf) else {"brand": slug, "brand_name": nom_m, "source": "catalogue-v2 2026-10-13 (integre_monoprix_1310)", "products": []}
        fiche["products"] += [dict(r, ingredients=p.get("inci"), inci_source=p.get("inci_source"), description=p.get("description"), claims=[],
                                   image_source_url=p.get("image_source_url"), source=p["source"], prix_constate=p.get("prix"),
                                   devise=p.get("devise"), stock_le_2026_10_13=p.get("stock_le_2026_10_13"),
                                   origine_fabrication=p.get("origine_fabrication")) for r, p in garde]
        json.dump(fiche, open(mf, "w"), ensure_ascii=False, indent=1)
        if slug not in marques["marques"]: marques["marques"][slug] = meta
        if slug not in publiees: publiees.append(slug)
    if not ESSAI:
        json.dump(servi, open(servi_f, "w"), ensure_ascii=False, separators=(", ", ": "))
        json.dump(marques, open(marques_f, "w"), ensure_ascii=False, indent=1)
        json.dump(complet, open(complet_f, "w"), ensure_ascii=False, separators=(",", ":"))
        json.dump(sorted(publiees), open(pub_f, "w"), ensure_ascii=False, indent=1)
        DT.ecrire_journal(journal)
    for k, v in bilan.items():
        print("%-16s +%2d  %s" % (k, len(v), "; ".join("%s [%s]%s" % (n, c, " (fond)" if fo else "") for n, c, fo in v)))
    print("servi : %d produits, %d marques" % (len(servi["products"]), len({p["brand"] for p in servi["products"]})))
    print("--essai : rien n'a ete ecrit" if ESSAI else "ecrit")

if __name__ == "__main__":
    main()
