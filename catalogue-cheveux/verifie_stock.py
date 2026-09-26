#!/usr/bin/env python3
"""Verifie, produit par produit, que la fiche du catalogue capillaire est encore vraie
chez la marque : le produit est-il en vente, le lien vit-il, et que dit la marque de
son mode d'emploi.

27/09/2026 — test de Charles : le masque propose (Hairlust Curl Crush) etait en
rupture sur hairlust.fr. Le catalogue n'avait aucun moyen de le savoir.

Statuts ecrits dans stock_etat.json :
  dispo    : la page repond et rien ne dit que le produit manque
  rupture  : Shopify « available: false », ou toutes les offres JSON-LD OutOfStock
  mort     : 404 / 410, ou redirection vers l'accueil ou une collection
  inconnu  : acces refuse, delai depasse, page illisible (le produit n'est PAS ecarte)

Le mode d'emploi n'est retenu que s'il contient une consigne d'usage explicite.

Usage : python3 verifie_stock.py            (verifie, ecrit stock_etat.json)
        python3 verifie_stock.py --applique (reporte les statuts dans le catalogue servi)
"""
import json, os, re, sys, time, html, threading, urllib.request, urllib.error, urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict

RACINE = os.path.dirname(os.path.abspath(__file__))
PEAU = "--peau" in sys.argv
# --peau : le meme controle sur le catalogue peau (public/scan/catalogue/all.json)
SERVI = os.path.join(RACINE, "..", "public", "scan", "catalogue" if PEAU else "catalogue-cheveux", "all.json")
ETAT = os.path.join(RACINE, "..", "catalogue-v2", "stock_etat.json") if PEAU else os.path.join(RACINE, "stock_etat.json")
ECARTES = os.path.join(RACINE, "..", "catalogue-v2", "stock_ecartes.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
PAR_DOMAINE = int(os.environ.get("PAR_DOMAINE", "3"))
verrous = defaultdict(lambda: threading.Semaphore(PAR_DOMAINE))

MOTS_USAGE = re.compile(r"(appliqu|utilis|mode d.emploi|conseil|how to use|apply|use (it )?(once|twice|daily|every|after|before|on)|"
                        r"leave (on|in)|laisser poser|rinc|rinse|fois par semaine|times? (a|per) week|weekly|"
                        r"chaque (jour|shampo|lavage)|every (day|wash)|massage|masser)", re.I)


def texte(h):
    h = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", h or "", flags=re.S | re.I)
    h = re.sub(r"<br\s*/?>|</p>|</li>|</h\d>|</div>", ". ", h, flags=re.I)
    h = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h)).strip()


def mode_emploi(t):
    """Les phrases d'usage, dans l'ordre, 500 caracteres au plus."""
    if not t:
        return None
    m = re.search(r"(mode d.emploi|conseils? d.utilisation|how to use|directions|utilisation)\s*:?\s*(.{20,600})", t, re.I)
    if m:
        bloc = m.group(2)
    else:
        bloc = " ".join(p for p in re.split(r"(?<=[.!?])\s+", t) if MOTS_USAGE.search(p))
    bloc = bloc.strip()[:500]
    return bloc if MOTS_USAGE.search(bloc or "") else None


def lire(url, timeout=20):
    url = urllib.parse.quote(url, safe=":/?&=%#+,;@!$'()*~")
    for essai in range(4):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.7"})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                corps = r.read(1_500_000).decode("utf-8", "replace")
                time.sleep(float(os.environ.get("PAUSE", "0")))
                return r.status, r.geturl(), corps
        except urllib.error.HTTPError as e:
            if e.code == 429 and essai < 3:
                time.sleep(8 * (essai + 1))
                continue
            raise


def verifier(p):
    url = p.get("url")
    res = {"id": p["id"], "url": url, "statut": "inconnu", "le": time.strftime("%Y-%m-%d")}
    if not url:
        res["raison"] = "sans url"
        return res
    dom = urllib.parse.urlparse(url).netloc
    with verrous[dom]:
        # 1. Shopify : l'objet produit dit s'il est en vente
        if "/products/" in url:
            try:
                st, fin, corps = lire(url.split("?")[0].rstrip("/") + ".js")
                j = json.loads(corps)
                res["statut"] = "dispo" if j.get("available") else "rupture"
                res["source"] = "shopify"
                me = mode_emploi(texte(j.get("description", "")))
                if me:
                    res["mode_emploi"] = me
                return res
            except Exception:
                # pas de .js (le site n'est pas un Shopify, ex. kerastase.be) : c'est
                # la page elle-meme qui tranche, jamais l'absence du .js
                pass
        # 2. la page elle-meme
        try:
            st, fin, corps = lire(url)
        except urllib.error.HTTPError as e:
            res["raison"] = "HTTP %d" % e.code
            if e.code in (404, 410):
                res["statut"] = "mort"
            return res
        except Exception as e:
            res["raison"] = type(e).__name__
            return res
        chemin = urllib.parse.urlparse(fin).path.rstrip("/")
        redirige = chemin != urllib.parse.urlparse(url).path.rstrip("/")
        if redirige and chemin in ("", "/fr", "/en", "/fr-fr", "/en-us") or re.search(r"/(collections?|categor|search|recherche)(/|$)", chemin) and "/products/" not in chemin and redirige:
            res.update(statut="mort", raison="redirige vers " + fin)
            return res
        dispo = re.findall(r'"availability"\s*:\s*"(?:https?://schema\.org/)?(\w+)"', corps)
        if dispo and all(d in ("OutOfStock", "SoldOut", "Discontinued") for d in dispo):
            res["statut"] = "rupture"
        else:
            res["statut"] = "dispo"
        res["source"] = "page"
        me = mode_emploi(texte(corps))
        if me:
            res["mode_emploi"] = me
        return res


def verifie():
    d = json.load(open(SERVI))
    liste = d["products"] if isinstance(d, dict) else d
    faits = {}
    if os.path.exists(ETAT):
        faits = {x["id"]: x for x in json.load(open(ETAT)).get("produits", [])}
    a_faire = [p for p in liste if p["id"] not in faits or "--tout" in sys.argv
               or ("--reprise" in sys.argv and faits[p["id"]]["statut"] in ("inconnu", "mort"))]
    print(len(liste), "produits,", len(a_faire), "a verifier", flush=True)
    n = 0
    with ThreadPoolExecutor(max_workers=24) as ex:
        for f in as_completed([ex.submit(verifier, p) for p in a_faire]):
            r = f.result()
            faits[r["id"]] = r
            n += 1
            if n % 200 == 0:
                json.dump({"produits": list(faits.values())}, open(ETAT, "w"), ensure_ascii=False, indent=0)
                print(n, flush=True)
    json.dump({"produits": list(faits.values())}, open(ETAT, "w"), ensure_ascii=False, indent=0)
    from collections import Counter
    print(Counter(x["statut"] for x in faits.values()))
    print(sum(1 for x in faits.values() if x.get("mode_emploi")), "modes d'emploi releves")


def applique_peau():
    """Peau : les pages lisent all.json a sept endroits. Plutot que d'y ajouter un filtre
    partout, on RETIRE du fichier servi ce qui est en rupture ou mort, et on le garde
    dans catalogue-v2/stock_ecartes.json (rien n'est perdu ; publie.py applique le meme
    filtre a chaque publication)."""
    etat = {x["id"]: x for x in json.load(open(ETAT))["produits"]}
    d = json.load(open(SERVI))
    liste = d["products"]
    par_marque = defaultdict(lambda: [0, 0])
    for p in liste:
        e = etat.get(p["id"])
        if e and e["statut"] in ("dispo", "rupture"):
            par_marque[p.get("brand")][0] += 1
            par_marque[p.get("brand")][1] += e["statut"] == "rupture"
    revendeurs = {m for m, (t, r) in par_marque.items() if t >= 5 and r / t >= 0.8}
    print("marques vendues ailleurs (rupture ignoree) :", sorted(revendeurs))
    garde, ecartes = [], []
    for p in liste:
        e = etat.get(p["id"])
        st = e["statut"] if e else "inconnu"
        if st == "mort" or (st == "rupture" and p.get("brand") not in revendeurs):
            ecartes.append({"id": p["id"], "brand": p.get("brand"), "name": p.get("name"), "url": p.get("url"),
                            "statut": st, "raison": e.get("raison"), "le": e["le"]})
        else:
            garde.append(p)
    d["products"] = garde
    json.dump(d, open(SERVI, "w"), ensure_ascii=False, separators=(", ", ": "))
    # le mode d'emploi officiel va dans le fichier de la maison (charge a la demande par le
    # protocole), pas dans all.json que chaque visiteur telecharge en entier
    dossier = os.path.dirname(SERVI)
    for slug in {p.get("brand") for p in garde}:
        f = os.path.join(dossier, "%s.json" % slug)
        if not slug or not os.path.exists(f):
            continue
        dm = json.load(open(f))
        for q in dm.get("products", []):
            q.pop("mode_emploi", None)
            e = etat.get(q.get("id"))
            if e and e.get("mode_emploi"):
                q["mode_emploi"] = e["mode_emploi"]
        json.dump(dm, open(f, "w"), ensure_ascii=False, indent=1)
    json.dump({"le": time.strftime("%Y-%m-%d"), "revendeurs": sorted(revendeurs), "produits": ecartes},
              open(ECARTES, "w"), ensure_ascii=False, indent=1)
    print(len(garde), "produits gardes,", len(ecartes), "ecartes,", len({p.get("brand") for p in garde}), "marques")


def applique():
    etat = {x["id"]: x for x in json.load(open(ETAT))["produits"]}
    d = json.load(open(SERVI))
    liste = d["products"] if isinstance(d, dict) else d
    # Une marque vendue seulement chez des revendeurs (Kristin Ess : Target, Ulta)
    # affiche TOUT en « indisponible » sur son propre site : ce n'est pas une rupture.
    par_marque = defaultdict(lambda: [0, 0])
    for p in liste:
        e = etat.get(p["id"])
        if e and e["statut"] in ("dispo", "rupture"):
            par_marque[p.get("brand")][0] += 1
            par_marque[p.get("brand")][1] += e["statut"] == "rupture"
    revendeurs = {m for m, (t, r) in par_marque.items() if t >= 5 and r / t >= 0.8}
    print("marques vendues ailleurs (rupture ignoree) :", sorted(revendeurs))
    n = defaultdict(int)
    for p in liste:
        e = etat.get(p["id"])
        for k in ("en_rupture", "lien_mort", "mode_emploi", "stock_verifie_le"):
            p.pop(k, None)
        if not e:
            continue
        p["stock_verifie_le"] = e["le"]
        if e["statut"] == "rupture" and p.get("brand") not in revendeurs:
            p["en_rupture"] = True
        if e["statut"] == "mort":
            p["lien_mort"] = True
        if e.get("mode_emploi"):
            p["mode_emploi"] = e["mode_emploi"]
        n[e["statut"]] += 1
    json.dump(d, open(SERVI, "w"), ensure_ascii=False, indent=1)
    print(dict(n))


if __name__ == "__main__":
    if "--applique" in sys.argv:
        applique_peau() if PEAU else applique()
    else:
        verifie()
