#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Integre les marques FRANCAISES collectees le 27/09/2026, SANS reconstruire le reste.

Pourquoi pas fusion_scores.py : il regenere tout le catalogue depuis ses sources et
defairait les corrections faites depuis (photos remplacees, categories, stock). On
reutilise donc SES fonctions de score, sur les seules nouvelles fiches, et on ajoute
ces fiches par-dessus le catalogue servi.

PEAU    : catalogue-v2/ajouts2/<slug>.json -> public/scan/catalogue/all.json, <slug>.json,
          marques.json, catalogue-v2/all_complet.json, marques_publiees.json
CHEVEUX : catalogue-cheveux/<slug>.json -> public/scan/catalogue-cheveux/all.json, marques.json

Sothys n'est ni lue ni modifiee. Usage : python3 catalogue-v2/integre_fr_2709.py [--essai]
"""
import json, os, re, sys
from collections import defaultdict, Counter

V2 = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(V2)
CH = os.path.join(RACINE, "catalogue-cheveux")
sys.path.insert(0, V2); sys.path.insert(0, CH)
import fusion_scores as FS
import enrichit_ciblage as EC
ESSAI = "--essai" in sys.argv

PEAU = {"yonka": ("Yon-Ka", "luxe", "https://yonka.com/fr"), "maria-galland": ("Maria Galland", "luxe", "https://www.mariagalland.com/fr"),
        "cinq-mondes": ("Cinq Mondes", "luxe", "https://www.cinqmondes.com"), "novexpert": ("Novexpert", "pharmacie", "https://novexpert-lab.com"),
        "orlane": ("Orlane", "luxe", "https://www.orlane.fr")}
CHEVEUX = {"franck-provost": ("Franck Provost", "salon", "https://www.franckprovost-expert.com"),
           "dessange": ("Dessange", "salon", "https://dessange.com"),
           "garnier-ultra-doux": ("Garnier Ultra Doux", "petit-prix", "https://www.garnier.fr/nos-marques/cheveux/ultra-doux"),
           "uriage-hair": ("Uriage", "pharmacie", "https://www.uriage.fr")}

# ---------------- PEAU : nettoyage et categories
HORS_PEAU = re.compile(r"fouta|serviette|bandeau|[eé]ponge|gant|spatule|pinceau|savon liquide|\bbras\b|d[eé]collet[eé] et bras|mains?\b|"
                       r"corps|jambes|pieds|minceur|parfum|bougie|diffuseur|^routine|\brouge\b|crayon|kajal|sourcil|bouquet d.orlane|lip.?up|l[eè]vres", re.I)
def cat_peau(nom, tags):
    n = nom.lower(); t = " ".join(tags).lower()
    if re.search(r"d[eé]maquill|nettoy|micellaire|mousse|gel[eé]e moussante|savon|cleans|lait d[eé]maquillant", n): return "nettoyant"
    if re.search(r"spf|solaire|sun", n): return "solaire-visage"
    if re.search(r"yeux|regard|eye|contour", n): return "contour-yeux"
    if re.search(r"patch", n): return "masque"
    if re.search(r"gommage|gommant|exfoli|peeling|scrub|polish|pâte|p[aâ]te", n) or re.search(r"exfoliant|peel", t): return "exfoliant"
    if re.search(r"masque|mask", n) or re.search(r"masks", t): return "masque"
    if re.search(r"\bhuile\b|\boil\b", n): return "huile"
    if re.search(r"s[eé]rum|concentr|ampoule|booster|[eé]lixir|essence|drops|lisseur", n) or re.search(r"serums", t): return "serum"
    if re.search(r"lotion|tonique|brume|eau (florale|de soin)|toner|mist", n) or re.search(r"toners", t): return "lotion"
    if re.search(r"cr[eè]me|baume|fluide|gel|soin|[eé]mulsion|lait|phyto|hydra|nutri|alpha|vital|excellence|time", n) or re.search(r"moistur|cream", t): return "creme"
    return "autre-visage"

def tags_yonka():
    f = "/private/tmp/claude-501/-Users-charles-Documents/a96d476b-03a5-4773-b410-0a21e760836c/scratchpad/fr/yonka_brut.json"
    try: return {p["handle"]: p.get("tags") or [] for p in json.load(open(f))}
    except Exception: return {}

def peau():
    servi_f = os.path.join(RACINE, "public/scan/catalogue/all.json")
    servi = json.load(open(servi_f)); deja = {p["id"] for p in servi["products"]}
    marques_f = os.path.join(RACINE, "public/scan/catalogue/marques.json"); marques = json.load(open(marques_f))
    complet_f = os.path.join(V2, "all_complet.json"); complet = json.load(open(complet_f))
    pub_f = os.path.join(V2, "marques_publiees.json"); publiees = json.load(open(pub_f))
    TY = tags_yonka(); bilan = {}
    for slug, (nom_m, univers, site) in PEAU.items():
        src = json.load(open(os.path.join(V2, "ajouts2", slug + ".json")))["products"]
        garde = []
        for p in src:
            if HORS_PEAU.search(p["name"]): continue
            tags = TY.get(p["url"].rsplit("/", 1)[-1], []) if slug == "yonka" else []
            if slug == "yonka" and tags and not any(re.match(r"^(face|men|serums|masks|intensive)", t) for t in tags): continue
            p["categorie"] = cat_peau(p["name"], tags)
            if p["id"] in deja: continue
            scores, targets, raisons, _ = FS.score_produit(p)
            img = p["image_local"]
            rec = {"id": p["id"], "name": p["name"], "price_eur": p.get("price_eur"),
                   "image_url": "/" + img[len("public/"):], "url": p["url"], "targets": targets, "concern_scores": scores,
                   "position": len(garde), "brand": slug, "brand_name": nom_m, "categorie": p["categorie"],
                   "price_source": p.get("price_source"), "url_verifiee_le": p.get("url_verifiee_le"), "pays": "FR",
                   "univers": univers, "score_raisons": raisons, "name_origine": p["name"]}
            garde.append((rec, p))
        bilan[slug] = (len(src), len(garde), Counter(r["categorie"] for r, _ in garde).most_common(4))
        if ESSAI: continue
        servi["products"] += [r for r, _ in garde]
        complet_l = complet["products"] if isinstance(complet, dict) else complet
        complet_l += [dict(r) for r, _ in garde]
        fiche = {"brand": slug, "brand_name": nom_m, "source": "catalogue-v2 2026-09-27 (integre_fr_2709)",
                 "products": [dict(r, ingredients=p.get("ingredients"), description=p.get("description"), claims=p.get("claims"),
                                   image_source_url=p.get("image_source_url"), source=p.get("source")) for r, p in garde]}
        json.dump(fiche, open(os.path.join(RACINE, "public/scan/catalogue", slug + ".json"), "w"), ensure_ascii=False, indent=1)
        marques["marques"][slug] = {"nom": nom_m, "univers": univers, "pays": "FR", "site": site}
        if slug not in publiees: publiees.append(slug)
    if not ESSAI:
        json.dump(servi, open(servi_f, "w"), ensure_ascii=False, separators=(", ", ": "))
        json.dump(marques, open(marques_f, "w"), ensure_ascii=False, indent=1)
        json.dump(complet, open(complet_f, "w"), ensure_ascii=False, separators=(",", ":"))
        json.dump(sorted(publiees), open(pub_f, "w"), ensure_ascii=False, indent=1)
    return bilan, servi

# ---------------- CHEVEUX : nettoyage, categories, ciblage
HORS_CHEVEUX = re.compile(r"sourcil|\bcils?\b|correcteur de racines|retouche racines|\blaque\b|\bcire\b|p[aâ]te coiffante|coffret|\bkit\b", re.I)
VERBES = re.compile(r"appliqu|masser|massez|rinc|vaporis|laisser|laissez|r[eé]partir|r[eé]partissez|[eé]mulsionn|utilis(er|ez) (sur|apr[eè]s|avant|une|deux|chaque)|fois par|chaque (jour|lavage|shampo)|quotidien", re.I)
def cat_cheveux(nom, t):
    n = nom.lower()
    if re.search(r"antipellicul|anti-pellicul|pellicul", n): return ("anti-pellicules", 1 if re.search(r"shampo", n) else 4)
    if re.search(r"apr[eè]s-?\s?shampo|d[eé]m[eê]lant|conditioner", n) and not re.search(r"sans rin|2-en-1 sans", n): return ("apres-shampooing", 2)
    if re.search(r"masque", n) and not re.search(r"masque shampo", n): return ("masque", 2)
    if re.search(r"shampo", n): return ("shampooing", 1)
    if re.search(r"anti-?chute|chute|densit|pousse", n): return ("traitement-chute", 4)
    if re.search(r"thermo|chaleur|brushing|lissage|230", n): return ("protection-thermique", 3)
    if re.search(r"\bhuile\b|elixir|[eé]lixir", n): return ("huile", 3)
    if re.search(r"s[eé]rum", n) and re.search(r"cuir chevelu|racine|scalp", n): return ("serum-cuir-chevelu", 4)
    if re.search(r"reflet|d[eé]jaunis|violet", n): return ("coloration-soin", 2)
    if re.search(r"sans rin|leave|cr[eè]me|lait|spray|s[eé]rum|soin|gel[eé]e|fluide|brume|mousse", n): return ("soin-sans-rinçage", 3)
    return ("autre-cheveux", None)

def nettoie_usage(u):
    if not u: return None
    u = re.sub(r"^[\s.,;:·-]+", "", u).strip()
    return u if (len(u) > 25 and VERBES.search(u) and not re.search(r"conditions g[eé]n[eé]rales|personnelle\s*\.", u, re.I)) else None

def cheveux():
    servi_f = os.path.join(RACINE, "public/scan/catalogue-cheveux/all.json")
    servi = json.load(open(servi_f)); deja = {p["id"] for p in servi["products"]}
    mq_f = os.path.join(RACINE, "public/scan/catalogue-cheveux/marques.json"); mq = json.load(open(mq_f))
    bilan = {}
    for slug, (nom_m, univers, site) in CHEVEUX.items():
        d = json.load(open(os.path.join(CH, slug + ".json")))
        garde = []
        for p in d["products"]:
            if HORS_CHEVEUX.search(p["name"]) or p["id"] in deja: continue
            # sur dessange.com : des soins VISAGE et une autre marque (Myriam K) vendus sur le meme site
            if slug == "dessange":
                tout = (p["name"] + " " + (p.get("description") or "")).lower()
                if re.search(r"myriam k", tout): continue
                if not re.search(r"cheveu|capillaire|cuir chevelu|boucl|shampo|longueurs|pointes|fibre|m[eè]che|racine", tout): continue
            cat, et = cat_cheveux(p["name"], p.get("description") or "")
            if et is None: continue
            p["categorie"], p["etape"] = cat, et
            p["mode_emploi"] = nettoie_usage(p.get("mode_emploi"))
            p["claims"], p["cheveux_cibles"] = [], []
            EC.traite(p, defaultdict(Counter))
            garde.append(p)
        d["products"] = garde
        bilan[slug] = (len(garde), Counter(p["categorie"] for p in garde).most_common(5), sum(1 for p in garde if p["mode_emploi"]))
        if ESSAI: continue
        json.dump(d, open(os.path.join(CH, slug + ".json"), "w"), ensure_ascii=False, indent=1)
        servi["products"] += garde
        mq["marques"] = [m for m in mq["marques"] if m.get("slug") != slug] + [
            {"slug": slug, "nom": nom_m, "univers": univers, "pays": "France", "site": site, "produits": len(garde), "code_pays": "FR"}]
    if not ESSAI:
        json.dump(servi, open(servi_f, "w"), ensure_ascii=False, indent=1)
        json.dump(mq, open(mq_f, "w"), ensure_ascii=False, indent=1)
    return bilan, servi

if __name__ == "__main__":
    bp, sp = peau()
    for k, v in bp.items(): print("PEAU    %-14s collectes %3d  gardes %3d  %s" % (k, v[0], v[1], v[2]))
    bc, sc = cheveux()
    for k, v in bc.items(): print("CHEVEUX %-20s gardes %3d  %s  modes d'emploi %d" % (k, v[0], v[1], v[2]))
    print("peau servie : %d produits, %d marques" % (len(sp["products"]), len({p["brand"] for p in sp["products"]})))
    print("cheveux servis : %d produits" % len(sc["products"]))
    print("--essai : rien n'a ete ecrit" if ESSAI else "ecrit")
