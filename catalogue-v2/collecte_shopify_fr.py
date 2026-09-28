#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Collecte de marques FRANCAISES de soin visage vendues sur Shopify (27/09/2026).

Yon-Ka, Maria Galland, Cinq Mondes, Novexpert, Orlane : leur boutique officielle
en francais publie /products.json. On garde le SOIN VISAGE seulement (REGLES.md) :
ni coffret, ni miniature, ni corps, ni maquillage, ni complement, ni produit cache.
Chaque lien est verifie (HTTP 200, fiche produit). Les produits en rupture sont
laisses de cote. Photos : public/scan/products/<slug>/v2/<handle>.jpg (600 px, q82).

Ecrit catalogue-v2/ajouts2/<slug>.json au format de REGLES.md. Ne touche pas au site.
Usage : python3 catalogue-v2/collecte_shopify_fr.py [slug ...]
"""
import json, os, re, sys, time, html, io, urllib.request, urllib.error
from PIL import Image

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, "catalogue-v2", "ajouts2")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
AUJ = time.strftime("%Y-%m-%d")

MARQUES = {
    "yonka":         {"nom": "Yon-Ka", "base": "https://yonka.com/fr"},
    "maria-galland": {"nom": "Maria Galland", "base": "https://www.mariagalland.com/fr"},
    "cinq-mondes":   {"nom": "Cinq Mondes", "base": "https://www.cinqmondes.com"},
    "novexpert":     {"nom": "Novexpert", "base": "https://novexpert-lab.com"},
    "orlane":        {"nom": "Orlane", "base": "https://www.orlane.fr"},
}

TAGS_CACHES = re.compile(r"^(hidden|gwp_hidden|mg-hidden|hide|hide-collection|sample|__hidden|freegift_hidden)$", re.I)
TYPES_HORS = re.compile(r"cadeau|bundle|accessoire|compl[eé]ment|invitation|massage|rituel|corps|gel(s)? douche|gommages corps|"
                        r"huiles corps|eaux fraiches|parfum|maquillage|minceur|freegift|coffret|magn[eé]sium|om[eé]ga|pro-collag|polyph", re.I)
NOM_HORS = re.compile(
    r"coffret|\bset\b|\bkit\b|calendrier|cadeau|trousse|\bsac\b|pochette|\bbag\b|pouch|roller|roll-on|invitation|"
    r"\bsoin massage\b|\brituel\b|\bcure\b|\bx ?[23]\b|\bduo\b|\btrio\b|format (d[eé]couverte|voyage)|taille introduction|"
    r"introductory|[eé]chantillon|miniature|\b(1|2|3|4|5|7|10|15) ?ml\b|corps|\bbody\b|mains?\b|\bhand\b|pieds?\b|douche|shampo|"
    r"cheveux|\bl[eè]vres?\b(?!.*(yeux|regard))|mascara|poudre|bronz|gloss|rouge [àa] l[eè]vres|parfum|eau de (toilette|parfum)|"
    r"barbe|d[eé]odorant|brosse|collag[eè]ne\+|g[eé]lules|sachets?|carte|book collection|[eé]tui|calendar|advent", re.I)

def get(url, binaire=False, essais=3):
    for k in range(essais):
        try:
            r = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"})
            with urllib.request.urlopen(r, timeout=30) as f:
                d = f.read()
                return f.status, f.geturl(), (d if binaire else d.decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(10 * (k + 1)); continue
            return e.code, url, None
        except Exception:
            time.sleep(3)
    return 0, url, None

def texte(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", h or "", flags=re.S | re.I)
    h = re.sub(r"<br\s*/?>|</p>|</li>|</h\d>", ". ", h, flags=re.I)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()

def inci(t):
    m = re.search(r"(?:ingr[eé]dients?|inci|composition)\s*:?\s*((?:aqua|water|eau)[^.]{40,1500})", t, re.I)
    return m.group(1).strip() if m else None

def categorie(nom, t):
    n = nom.lower()
    if re.search(r"spf|solaire|sun", n): return "solaire-visage"
    if re.search(r"yeux|regard|eye", n): return "contour-yeux"
    if re.search(r"gommage|exfoli|peeling|scrub|polish", n): return "exfoliant"
    if re.search(r"masque|mask", n): return "masque"
    if re.search(r"d[eé]maquill|nettoy|micellaire|mousse|lait (d[eé]maquillant|nettoyant)|savon|cleans", n): return "nettoyant"
    if re.search(r"\bhuile\b|\boil\b", n): return "huile"
    if re.search(r"s[eé]rum|concentr|ampoule|booster|[eé]lixir|elixir|essence", n): return "serum"
    if re.search(r"lotion|tonique|brume|eau (florale|de soin)|toner|mist", n): return "lotion"
    if re.search(r"cr[eè]me|baume|fluide|gel|soin|emulsion|[eé]mulsion|lait", n): return "creme"
    return "autre-visage"

CLAIMS = [("hydratant", r"hydrat"), ("anti-rides", r"anti-?rides?|rides"), ("eclat", r"[eé]clat|lumin|illumin"),
          ("apaisant", r"apais|sensibl|calm"), ("anti-imperfections", r"imperfection|acn[eé]|boutons|peau nette"),
          ("anti-taches", r"tache|pigment"), ("matifiant", r"matif|brillance|s[eé]bo"), ("raffermissant", r"ferme|raffermi|lift|tonicit"),
          ("nourrissant", r"nourri|nutri"), ("anti-age", r"anti-?[aâ]ge|jeunesse|[aâ]ge"), ("purifiant", r"purifi|pores"),
          ("repulpant", r"repulp|volume|combl"), ("anti-cernes", r"cernes|poches")]

def slugifie(s):
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")[:80]

def image(url, slug, handle):
    dossier = os.path.join(RACINE, "public", "scan", "products", slug, "v2")
    os.makedirs(dossier, exist_ok=True)
    nom = slugifie(handle) + ".jpg"
    chemin = os.path.join(dossier, nom)
    if not os.path.exists(chemin):
        u = url.split("?")[0] + "?width=900"
        st, _, d = get(u, binaire=True)
        if st != 200 or not d:
            return None
        im = Image.open(io.BytesIO(d))
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA"); fond = Image.new("RGB", im.size, (255, 255, 255)); fond.paste(im, mask=im.split()[3]); im = fond
        else:
            im = im.convert("RGB")
        im.thumbnail((600, 600))
        im.save(chemin, "JPEG", quality=82)
        time.sleep(0.4)
    return "public/scan/products/%s/v2/%s" % (slug, nom)

def collecte(slug):
    conf = MARQUES[slug]
    brut = []
    for page in range(1, 20):
        st, _, d = get(conf["base"] + "/products.json?limit=250&page=%d" % page)
        if st != 200 or not d: break
        ps = json.loads(d)["products"]
        if not ps: break
        brut += ps; time.sleep(1.1)
    gardes, vus, ecartes = [], set(), []
    for p in brut:
        nom = re.sub(r"\s+", " ", p["title"]).strip()
        tags = p.get("tags") or []
        if any(TAGS_CACHES.match(t.strip()) for t in tags): ecartes.append((nom, "cache")); continue
        if TYPES_HORS.search(p.get("product_type") or ""): ecartes.append((nom, "type " + p.get("product_type"))); continue
        if NOM_HORS.search(nom): ecartes.append((nom, "nom")); continue
        if not any(v.get("available") for v in p.get("variants") or []): ecartes.append((nom, "rupture")); continue
        if not p.get("images"): ecartes.append((nom, "sans image")); continue
        cle = re.sub(r"[^a-z0-9]", "", slugifie(nom))
        if cle in vus: ecartes.append((nom, "doublon")); continue
        vus.add(cle)
        t = texte(p.get("body_html"))
        url = conf["base"] + "/products/" + p["handle"]
        st, fin, page_html = get(url)
        time.sleep(1.1)
        if st != 200 or p["handle"] not in (fin or ""):
            ecartes.append((nom, "lien %s" % st)); continue
        img = image(p["images"][0]["src"], slug, p["handle"])
        if not img: ecartes.append((nom, "image")); continue
        ing = inci(t) or inci(texte(page_html or ""))
        desc = re.sub(r"(?:ingr[eé]dients?|inci|composition)\s*:.*$", "", t, flags=re.I).strip()[:500] or None
        tt = (nom + " " + (desc or "")).lower()
        claims = [c for c, rx in CLAIMS if re.search(rx, tt)]
        prix = None
        try: prix = float(p["variants"][0]["price"])
        except Exception: pass
        gardes.append({
            "id": slug + "--" + slugifie(p["handle"]), "name": nom, "brand": slug, "brand_name": conf["nom"],
            "url": url, "url_verifiee_le": AUJ, "price_eur": prix, "price_source": "site officiel FR" if prix else None,
            "image_source_url": p["images"][0]["src"], "image_local": img, "categorie": categorie(nom, t),
            "ingredients": ing, "description": desc, "claims": claims, "source": "products.json + page",
        })
    os.makedirs(SORTIE, exist_ok=True)
    json.dump({"brand": slug, "brand_name": conf["nom"], "products": gardes},
              open(os.path.join(SORTIE, slug + ".json"), "w"), ensure_ascii=False, indent=1)
    json.dump(ecartes, open(os.path.join(SORTIE, "_ecartes_" + slug + ".json"), "w"), ensure_ascii=False, indent=0)
    print("%-14s brut %3d  gardes %3d  ecartes %3d" % (slug, len(brut), len(gardes), len(ecartes)), flush=True)

if __name__ == "__main__":
    for s in (sys.argv[1:] or list(MARQUES)):
        collecte(s)
