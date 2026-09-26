#!/usr/bin/env python3
"""Remplace les photos fausses du catalogue peau par le vrai packshot (26/09/2026).

Entree : un ou plusieurs manifestes JSON (liste de
  {"id", "fichier" (image candidate verifiee a l'oeil) | null, "image_src", "source_page", "source_type", "raison"}).

Pour chaque produit trouve :
  1. l'image est aplatie sur fond blanc, 1000 px max, JPEG q88, et ecrite A LA PLACE
     de l'ancienne (meme chemin image_url : aucun nouveau nom de fichier) ;
  2. elle est redetouree par detourage.traiter (la methode du reste du catalogue),
     en CPU (CoreML laisse des copies du modele dans /private/var/folders) ;
  3. le journal detourage_journal.json est mis a jour ;
  4. dans all_complet.json, public/scan/catalogue/<marque>.json et sortie/ :
     cutout_url pose, image_fond retire si le detourage est bon (pose sinon),
     image_source_url mis a jour, image_absente retire.
Pour chaque produit introuvable : image_absente = true (+ image_absente_raison).

Usage : python3 remplace_photos.py manifeste.json [...] [--applique]
Ensuite : python3 publie.py --applique
"""
import json, os, sys, time
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
PUBLIC = os.path.join(RACINE, "public")
sys.path.insert(0, ICI)
import detourage  # noqa: E402

TAILLE = 1000


def _charger_cpu(modele):
    if detourage._sess is None or detourage._modele != modele:
        import onnxruntime as ort
        o = ort.SessionOptions(); o.intra_op_num_threads = 4; o.log_severity_level = 3
        detourage._sess = ort.InferenceSession(os.path.join(detourage.MODELES, modele), o,
                                               providers=["CPUExecutionProvider"])
        detourage._modele = modele
    return detourage._sess


detourage.charger = _charger_cpu


def charge(p):
    return json.load(open(p, encoding="utf-8"))


def ecrit(p, doc, style):
    if style == "compact":
        s = json.dumps(doc, ensure_ascii=False, separators=(",", ":"))
    elif style == "servi":
        s = json.dumps(doc, ensure_ascii=False, separators=(", ", ": "))
    else:
        s = json.dumps(doc, ensure_ascii=False, indent=1)
    with open(p + ".tmp", "w", encoding="utf-8") as f:
        f.write(s)
    os.replace(p + ".tmp", p)


def aplatit(src, dst):
    im = Image.open(src); im.load()
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        fond = Image.new("RGBA", im.size, (255, 255, 255, 255)); fond.alpha_composite(im); im = fond
    im = im.convert("RGB")
    # packshots officiels souvent centres dans une grande toile vide (Drunk Elephant :
    # le flacon occupe un tiers de 3334 px) : on recadre sur le produit avant de
    # reduire, sinon il resterait 300 px de produit sur 1000.
    import numpy as np
    a = np.asarray(im)
    ys, xs = np.where(a.min(axis=2) < 245)
    if len(xs):
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        m = int(max(x1 - x0, y1 - y0) * 0.08)
        x0, y0 = max(0, x0 - m), max(0, y0 - m)
        x1, y1 = min(im.width, x1 + m), min(im.height, y1 + m)
        if (x1 - x0) * (y1 - y0) < 0.8 * im.width * im.height:
            im = im.crop((x0, y0, x1, y1))
    if max(im.size) > TAILLE:
        im.thumbnail((TAILLE, TAILLE), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "JPEG", quality=88, optimize=True)
    return im.size


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    applique = "--applique" in sys.argv
    entrees = []
    for m in args:
        base = os.path.dirname(os.path.abspath(m))
        for e in charge(m):
            e = dict(e)
            if e.get("fichier") and not os.path.isabs(e["fichier"]):
                # chemins relatifs au dossier cfix (parent de cand/<marque>/)
                cand = os.path.join(os.path.dirname(os.path.dirname(base)), e["fichier"])
                e["fichier"] = cand if os.path.exists(cand) else os.path.join(base, os.path.basename(e["fichier"]))
            entrees.append(e)
    complet_p = os.path.join(ICI, "all_complet.json")
    complet = charge(complet_p)
    par_id = {p["id"]: p for p in complet["products"]}
    trouves = [e for e in entrees if e.get("fichier")]
    absents = [e for e in entrees if not e.get("fichier")]
    for e in entrees:
        if e["id"] not in par_id: sys.exit("id inconnu : %s" % e["id"])
        if e.get("fichier") and not os.path.exists(e["fichier"]): sys.exit("fichier absent : %s" % e["fichier"])
        if e.get("fichier") and not par_id[e["id"]].get("image_url"): sys.exit("pas d'image_url : %s" % e["id"])
    print("%d photos a remplacer, %d produits sans photo" % (len(trouves), len(absents)))
    if not applique:
        print("--applique pour ecrire."); return

    journal = detourage.lire_journal()
    maj = {}
    t0 = time.time()
    for k, e in enumerate(trouves):
        p = par_id[e["id"]]
        u = p["image_url"]
        src = PUBLIC + u
        taille = aplatit(e["fichier"], src)
        c = detourage.cutout_de(u)
        r = detourage.traiter({"src": src, "dst": PUBLIC + c, "image_url": u, "cutout_url": c,
                               "modele": "u2net.onnx"})
        r["remplace_le"] = "2026-09-26"; r["image_src"] = e.get("image_src")
        journal["images"][u] = r
        ok = r.get("statut") == "ok"
        maj[e["id"]] = {"cutout_url": c, "image_fond": (None if ok else True),
                        "image_source_url": e.get("image_src"), "image_absente": None, "image_absente_raison": None}
        print("%3d/%d %-8s %s %s" % (k + 1, len(trouves), r.get("statut"), e["id"], taille), flush=True)
        if r.get("statut") == "echec":
            sys.exit("echec detourage : %s" % r)
    journal["maj"] = time.strftime("%Y-%m-%d %H:%M:%S")
    detourage.ecrire_journal(journal)
    for e in absents:
        maj[e["id"]] = {"image_absente": True, "image_absente_raison": e.get("raison") or "aucune photo trouvable"}
    print("detourage : %.0f s" % (time.time() - t0))

    def applique_liste(liste, avec_source):
        n = 0
        for p in liste:
            m = maj.get(p.get("id"))
            if not m: continue
            for k, v in m.items():
                if k == "image_source_url" and not avec_source: continue
                if v is None: p.pop(k, None)
                else: p[k] = v
            n += 1
        return n

    n = applique_liste(complet["products"], False); ecrit(complet_p, complet, "compact")
    print("all_complet.json : %d" % n)
    marques = sorted({par_id[i]["brand"] for i in maj})
    for mq in marques:
        for f in (os.path.join(PUBLIC, "scan", "catalogue", mq + ".json"), os.path.join(ICI, "sortie", mq + ".json")):
            if os.path.exists(f):
                d = charge(f); n = applique_liste(d["products"], True); ecrit(f, d, "indent")
                print("%s : %d" % (os.path.relpath(f, RACINE), n))
    f = os.path.join(ICI, "sortie", "all.json")
    if os.path.exists(f):
        d = charge(f); n = applique_liste(d["products"], False); ecrit(f, d, "compact")
        print("sortie/all.json : %d" % n)


if __name__ == "__main__":
    main()
