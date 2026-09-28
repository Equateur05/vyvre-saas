#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Collecte de 4 marques FRANCAISES de soin capillaire (27/09/2026) :
Franck Provost, Dessange, Garnier Ultra Doux, Uriage (DS Hair / AP Hair).

Sites lisibles (pas de protection anti-robots), 1 requete par seconde et par site.
Pour chaque fiche : nom, photo officielle, description, INCI, mode d'emploi, lien
verifie (HTTP 200). Le ciblage (cheveux_cibles, claims) est calcule par la MEME
fonction que le reste du catalogue (enrichit_ciblage.traite).

Ecrit catalogue-cheveux/<slug>.json et les photos dans public/scan/products-cheveux/<slug>/.
Ne touche pas au catalogue servi (voir integre_fr_2709.py).
"""
import json, os, re, sys, time, html, io, urllib.request, urllib.error, urllib.parse
from collections import defaultdict, Counter
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
import enrichit_ciblage as EC

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
AUJ = time.strftime("%Y-%m-%d")

def get(url, binaire=False):
    for k in range(3):
        try:
            u = urllib.parse.quote(url, safe=":/?&=%#+,;@!$'()*~")
            r = urllib.request.Request(u, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"})
            with urllib.request.urlopen(r, timeout=30) as f:
                d = f.read()
                return f.status, f.geturl(), (d if binaire else d.decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(10 * (k + 1)); continue
            return e.code, url, None
        except Exception:
            time.sleep(3)
    return 0, url, None

def texte(h):
    h = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", " ", h or "", flags=re.S | re.I)
    h = re.sub(r"<br\s*/?>|</p>|</li>|</h\d>|</div>", " . ", h, flags=re.I)
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()

def slugifie(s):
    import unicodedata
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")[:80]

def ld_produit(h):
    for b in re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', h or "", re.S):
        try: j = json.loads(b.strip())
        except Exception: continue
        for x in (j if isinstance(j, list) else j.get("@graph", [j])):
            if isinstance(x, dict) and x.get("@type") in ("Product", ["Product"]):
                return x
    return None

def meta(h, prop):
    m = re.search(r'<meta[^>]+(?:property|name)="%s"[^>]+content="([^"]*)"' % re.escape(prop), h or "")
    if not m: m = re.search(r'<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="%s"' % re.escape(prop), h or "")
    return html.unescape(m.group(1)) if m else None

def image_de(h, ld, base):
    cand = []
    if ld:
        im = ld.get("image")
        if isinstance(im, list) and im: im = im[0]
        if isinstance(im, dict): im = im.get("url")
        if im: cand.append(im)
    og = meta(h, "og:image")
    if og: cand.append(og)
    for s in re.findall(r'<img[^>]+src="([^"]+)"', h or ""):
        s = html.unescape(s)
        if "/_next/image" in s:
            q = urllib.parse.parse_qs(urllib.parse.urlparse(s).query).get("url")
            if q: s = q[0]
        if re.search(r"/products?/|produit|catalog/product|/media/catalog", s, re.I) and not re.search(r"logo|icon|picto", s, re.I):
            cand.append(s)
    # toutes les candidates, dans l'ordre : la premiere peut etre cassee cote marque
    # (Uriage : la photo principale repond 502 sur leur CDN, la suivante 200)
    return [urllib.parse.urljoin(base, c) for c in dict.fromkeys(cand)]

def telecharge(url, slug, nom):
    dossier = os.path.join(RACINE, "public", "scan", "products-cheveux", slug)
    os.makedirs(dossier, exist_ok=True)
    chemin = os.path.join(dossier, nom + ".jpg")
    if not os.path.exists(chemin):
        st, _, d = get(url, binaire=True)
        if st != 200 or not d: return None
        try: im = Image.open(io.BytesIO(d))
        except Exception: return None
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA"); f = Image.new("RGB", im.size, (255, 255, 255)); f.paste(im, mask=im.split()[3]); im = f
        else: im = im.convert("RGB")
        if min(im.size) < 180: return None
        im.thumbnail((600, 600)); im.save(chemin, "JPEG", quality=82); time.sleep(0.5)
    return "public/scan/products-cheveux/%s/%s.jpg" % (slug, nom)

INCI_RX = re.compile(r"(?:ingr[eé]dients?|inci|composition)\s*(?:[0-9A-Z]{4,}\s*[A-Z]?\s*[–-]\s*)?(?:ingr[eé]dients?)?\s*:?\s*((?:aqua|water|eau)\b[^.]{30,1800})", re.I)
USAGE_RX = re.compile(r"(?:mode d.emploi|conseils? d.utilisation|comment l.utiliser|utilisation)\s*:?\s*(.{20,420}?)(?:\.\s|$)", re.I)

def categorie_etape(nom, t):
    n = nom.lower()
    if re.search(r"antipellicul|anti-pellicul|pellicul", n): return ("anti-pellicules", 1 if re.search(r"shampo", n) else 4)
    if re.search(r"shampo", n): return ("shampooing", 1)
    if re.search(r"anti-?chute|chute|densit|pousse", n): return ("traitement-chute", 4)
    if re.search(r"masque|mask", n): return ("masque", 2)
    if re.search(r"apr[eè]s-shampo|d[eé]m[eê]lant|conditioner|baume apr", n) and not re.search(r"sans rin", n): return ("apres-shampooing", 2)
    if re.search(r"thermo|chaleur|brushing|lissage", n): return ("protection-thermique", 3)
    if re.search(r"\bhuile\b|elixir|[eé]lixir", n): return ("huile", 3)
    if re.search(r"s[eé]rum", n) and re.search(r"cuir chevelu|racine|scalp", n + " " + t[:300].lower()): return ("serum-cuir-chevelu", 4)
    if re.search(r"reflet|d[eé]jaunis|violet|couleur", n): return ("coloration-soin", 2)
    if re.search(r"sans rin|leave|cr[eè]me|lait|spray|s[eé]rum|soin|gel[eé]e|fluide|brume|mousse|cire|p[aâ]te|laque", n): return ("soin-sans-rinçage", 3)
    return ("autre-cheveux", None)

ACTIFS = [("kératine", r"keratin"), ("panthénol", r"panthenol"), ("huile d'argan", r"argania"), ("caféine", r"caffeine"),
          ("acide hyaluronique", r"hyaluron"), ("beurre de karité", r"butyrospermum|shea butter"), ("huile de coco", r"cocos nucifera"),
          ("aloe vera", r"aloe barbadensis"), ("protéines de riz", r"hydrolyzed rice protein"), ("protéines de blé", r"hydrolyzed wheat protein"),
          ("céramides", r"ceramide"), ("biotine", r"biotin"), ("niacinamide", r"niacinamide"), ("piroctone olamine", r"piroctone"),
          ("acide salicylique", r"salicylic acid"), ("huile de ricin", r"ricinus"), ("huile de jojoba", r"simmondsia"),
          ("huile d'avocat", r"persea gratissima"), ("acides aminés", r"arginine|glycine|serine|alanine"), ("vitamine E", r"tocopher"),
          ("romarin", r"rosmarinus"), ("miel", r"\bmel\b|honey"), ("argile", r"kaolin|clay|montmorillonite"), ("acide citrique", r"citric acid"),
          ("glycérine", r"glycerin"), ("huile d'olive", r"olea europaea"), ("avoine", r"avena sativa"), ("urée", r"\burea\b")]

def actifs(inci, t):
    src = (inci or "").lower() + " " + t.lower()
    return [n for n, rx in ACTIFS if re.search(rx, src)][:8]

# ---------------- les listes d'URL, marque par marque
def urls_sitemap(url, filtre):
    st, _, d = get(url)
    return [u for u in re.findall(r"<loc>([^<]+)</loc>", d or "") if filtre(u)]

MARQUES = {
    "franck-provost": {"nom": "Franck Provost", "univers": "salon",
        "urls": lambda: urls_sitemap("https://www.franckprovost-expert.com/sitemap.xml",
            lambda u: "/soins-et-coiffants-professionnels/" in u or re.search(r"\.com/expert-[a-z-]+$", u))},
    "dessange": {"nom": "Dessange", "univers": "salon",
        "urls": lambda: urls_sitemap("https://dessange.com/media/sitemap_product.xml",
            lambda u: re.search(r"shampo|apres-shampo|masque|cheveux|capillaire|soin-sans|serum|huile|cuir-chevelu|laque|coiffant|boucle|reflet|dejaunis|blond", u)
                      and not re.search(r"pinceau|crayon|teint|anti-cernes|levres|mascara|vernis|ongle|yeux|visage|corps(?!.*cheveux)|rides|poudre|blush|fond", u))},
    "garnier-ultra-doux": {"nom": "Garnier Ultra Doux", "univers": "petit-prix",
        "urls": lambda: [u for u in urls_sitemap("https://www.garnier.fr/sitemap.xml", lambda u: "/nos-marques/cheveux/ultra-doux/" in u)
                         if len(urllib.parse.urlparse(u).path.strip("/").split("/")) >= 5]},
    "uriage-hair": {"nom": "Uriage", "univers": "pharmacie",
        "urls": lambda: ["https://www.uriage.fr" + p for p in sorted(set(re.findall(r'href="(/produits/[^"]+)"',
            get("https://www.uriage.fr/ligne-produits/corps/besoin/shampoings-et-soins-capillaires")[2] or "")))
            if re.search(r"hair|shampo|capill|antipellicul", p)]},
}

def collecte(slug):
    conf = MARQUES[slug]
    urls = list(dict.fromkeys(conf["urls"]()))
    gardes, ecartes, vus = [], [], set()
    for url in urls:
        st, fin, h = get(url); time.sleep(1.1)
        if st != 200 or not h: ecartes.append((url, "HTTP %s" % st)); continue
        if urllib.parse.urlparse(fin).path.rstrip("/") != urllib.parse.urlparse(url).path.rstrip("/"):
            ecartes.append((url, "redirige " + fin)); continue
        ld = ld_produit(h)
        nom = (ld or {}).get("name") or meta(h, "og:title") or (re.findall(r"<h1[^>]*>(.*?)</h1>", h, re.S) or [""])[0]
        nom = re.sub(r"\s+", " ", texte(nom)).replace("​", "").strip(" -|")
        nom = re.sub(r"\s*[|–-]\s*(Garnier|Dessange|Franck Provost|Uriage).*$", "", nom, flags=re.I).strip()
        if not nom: ecartes.append((url, "sans nom")); continue
        t = texte(h)
        if slug == "uriage-hair" and re.search(r"eau nettoyante|lingettes|solaire|lait|corps|baume|emulsion|lotion|gel nettoyant", nom, re.I) and not re.search(r"hair|shampo|capill", nom, re.I):
            ecartes.append((url, "pas capillaire")); continue
        if re.search(r"coffret|\bkit\b|\bduo\b|\btrio\b|routine|lot de|\bset\b|pinceau|brosse|peigne", nom, re.I):
            ecartes.append((url, "lot ou accessoire")); continue
        if ld:
            offres = ld.get("offers") or {}
            offres = offres if isinstance(offres, list) else [offres]
            dispo = [str(o.get("availability", "")) for o in offres if isinstance(o, dict)]
            if dispo and all(re.search(r"OutOfStock|Discontinued|SoldOut", d) for d in dispo):
                ecartes.append((url, "rupture")); continue
        cle = slugifie(nom)
        if cle in vus: ecartes.append((url, "doublon")); continue
        vus.add(cle)
        img, imgu = None, None
        for cand in image_de(h, ld, fin)[:6]:
            img = telecharge(cand, slug, cle)
            if img: imgu = cand; break
        if not img: ecartes.append((url, "image")); continue
        m = INCI_RX.search(t); inci = m.group(1).strip() if m else None
        u = USAGE_RX.search(t); usage = u.group(1).strip() if u else None
        desc = ((ld or {}).get("description") or meta(h, "description") or meta(h, "og:description") or "")
        desc = texte(desc)[:500] or None
        cat, etape = categorie_etape(nom, t)
        if etape is None: ecartes.append((url, "categorie inconnue")); continue
        p = {"id": slug + "--" + cle, "name": nom, "brand": slug, "brand_name": conf["nom"], "url": fin,
             "url_verifiee_le": AUJ, "price_eur": None, "price_source": None, "image_source_url": imgu, "image_local": img,
             "categorie": cat, "etape": etape, "cheveux_cibles": [], "actifs": actifs(inci, (desc or "") + " " + nom),
             "ingredients": inci, "description": desc, "claims": [], "source": "sitemap + page (json-ld si present)",
             "mode_emploi": usage, "image_fond": True}
        EC.traite(p, defaultdict(Counter))
        gardes.append(p)
    json.dump({"brand": slug, "brand_name": conf["nom"], "products": gardes},
              open(os.path.join(ICI, slug + ".json"), "w"), ensure_ascii=False, indent=1)
    json.dump(ecartes, open(os.path.join(ICI, "_ecartes_" + slug + ".json"), "w"), ensure_ascii=False, indent=0)
    print("%-20s urls %3d  gardes %3d  ecartes %3d" % (slug, len(urls), len(gardes), len(ecartes)), flush=True)

if __name__ == "__main__":
    for s in (sys.argv[1:] or list(MARQUES)):
        collecte(s)
