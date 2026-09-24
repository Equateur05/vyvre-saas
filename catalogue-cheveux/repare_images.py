#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Repare les images du catalogue CHEVEUX a partir des pages produit officielles.

Le principe : chaque fiche du catalogue porte deja l'adresse de sa page produit
(champ `url`). Quand l'image est absente, douteuse ou trop petite, on retourne
chercher le visuel a la source plutot que de deviner une adresse d'image.

Pour chaque fiche retenue :
  1. on telecharge la page produit (1 requete par seconde et par domaine) ;
  2. on en extrait les candidats image : og:image, twitter:image, JSON-LD
     (champ `image`), <link rel=preload as=image>, le plus grand `srcset`,
     puis les <img> restantes ;
  3. on agrandit ce qui peut l'etre : les CDN Shopify acceptent `?width=1200`,
     les parametres de redimensionnement trop petits sont relaves ;
  4. on telecharge le candidat et on verifie l'image elle-meme : au moins
     600 px de large, pas un logo, pas un pixel de suivi, pas une image plate ;
  5. on l'enregistre en JPEG dans public/scan/products-cheveux/<marque>/<nom>.jpg
     et on met la fiche a jour (image_local, provenance, date), en retirant
     image_absente / image_incertaine.

Le detourage n'est PAS refait ici : `cutout_url` est remis a zero pour les
fiches reparees (l'ancien decoupage ne correspond plus a la nouvelle photo) et
l'affichage retombe sur l'image de packshot. Un passage de detourage_cheveux.py
regenerera les decoupages ; il repere les nouvelles images a leur date de
fichier.

Politesse : User-Agent honnete et joignable, une requete par seconde et par
domaine, robots.txt respecte. Un domaine qui refuse (403, 429, robots) est
note et abandonne, jamais contourne.

Usage :
  python3 repare_images.py --absentes --incertaines --petites      # les 3 lots
  python3 repare_images.py --petites --seuil 300                   # un seul lot
  python3 repare_images.py --ids briogeo--xxx joico--yyy
  python3 repare_images.py --absentes --essai                      # rien n'est ecrit
  python3 repare_images.py --absentes --journal /chemin/journal.json
"""
import argparse
import hashlib
import io
import json
import os
import re
import sys
import time
from collections import defaultdict
from urllib.parse import urljoin, urlparse, urlsplit, urlunsplit, parse_qsl, urlencode
from urllib.robotparser import RobotFileParser

import requests
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
ALL_JSON = os.path.join(RACINE, "public", "scan", "catalogue-cheveux", "all.json")
DOSSIER_IMAGES = os.path.join(RACINE, "public", "scan", "products-cheveux")

# Un agent honnete : on dit qui on est et ou nous ecrire.
AGENT = ("vyvre-catalogue/1.0 (+https://vyvre.fr ; contact charlesrocher75@gmail.com) "
         "verification des visuels du catalogue")
ENTETES = {
    "User-Agent": AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.5",
    "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate",
}
DELAI_PAR_DOMAINE = 1.0     # secondes
DELAI_MAX = 25              # secondes par requete
MIN_LARGEUR = 600           # px : en dessous, on ne remplace pas
REFUS_AVANT_ABANDON = 3     # refus d'affilee avant d'abandonner un domaine

# Ce qui, dans un nom de fichier, trahit autre chose qu'un packshot.
MOTS_SUSPECTS = (
    "logo", "sprite", "favicon", "icon", "icone", "placeholder", "pixel",
    "spacer", "blank", "transparent", "no-image", "noimage", "default",
    "badge", "banner", "banniere", "header", "footer", "social", "share",
    "loader", "loading", "arrow", "fleche", "picto", "avatar", "flag",
    "drapeau", "paiement", "payment", "trustpilot", "watermark",
)
# `1x1` n'est pas retenu comme suspect : chez Virtue c'est le nom du format
# carre des packshots. Les vrais pixels de suivi sont ecartes plus loin, sur
# leurs dimensions reelles.

# Mouchards : inutile d'aller les chercher, et inutile de les compter comme
# essais. On ne tape pas a leur porte.
HOTES_MOUCHARDS = (
    "facebook.com", "facebook.net", "google-analytics.com", "googletagmanager.com",
    "doubleclick.net", "criteo.", "pinterest.com/ct", "bat.bing.com",
    "analytics.tiktok.com", "snap.licdn.com", "ct.pinterest.com", "px.ads.",
)


# --------------------------------------------------------------------------
#  Politesse : un rythme par domaine, un robots.txt par domaine
# --------------------------------------------------------------------------
class Politesse:
    """Une requete par seconde et par domaine, robots.txt respecte."""

    def __init__(self, delai=DELAI_PAR_DOMAINE):
        self.delai = delai
        self.dernier = {}
        self.robots = {}
        self.refus = defaultdict(int)
        self.abandonnes = set()

    def attends(self, domaine):
        precedent = self.dernier.get(domaine)
        if precedent is not None:
            reste = self.delai - (time.time() - precedent)
            if reste > 0:
                time.sleep(reste)
        self.dernier[domaine] = time.time()

    def autorise(self, url):
        """False si le robots.txt du site nous interdit cette adresse."""
        parts = urlsplit(url)
        domaine = parts.netloc
        if domaine not in self.robots:
            rp = RobotFileParser()
            adresse = "%s://%s/robots.txt" % (parts.scheme or "https", domaine)
            try:
                self.attends(domaine)
                rep = requests.get(adresse, headers=ENTETES, timeout=DELAI_MAX)
                if rep.status_code >= 400:
                    rp = None          # pas de robots.txt lisible : on reste prudent mais on passe
                else:
                    rp.parse(rep.text.splitlines())
            except Exception:
                rp = None
            self.robots[domaine] = rp
        rp = self.robots[domaine]
        if rp is None:
            return True
        try:
            return rp.can_fetch(AGENT, url)
        except Exception:
            return True

    def note_refus(self, domaine):
        self.refus[domaine] += 1
        if self.refus[domaine] >= REFUS_AVANT_ABANDON:
            self.abandonnes.add(domaine)

    def note_succes(self, domaine):
        self.refus[domaine] = 0


def recupere(url, politesse, binaire=False):
    """Telecharge une adresse. Renvoie (contenu, erreur) ; l'un des deux est None."""
    domaine = urlsplit(url).netloc
    if domaine in politesse.abandonnes:
        return None, "domaine abandonne (trop de refus)"
    if not politesse.autorise(url):
        politesse.note_refus(domaine)
        return None, "robots.txt interdit"
    politesse.attends(domaine)
    try:
        rep = requests.get(url, headers=ENTETES, timeout=DELAI_MAX, allow_redirects=True)
    except Exception as e:
        return None, "reseau: %s" % type(e).__name__
    if rep.status_code in (403, 401, 429):
        politesse.note_refus(domaine)
        return None, "refus HTTP %d" % rep.status_code
    if rep.status_code >= 400:
        return None, "HTTP %d" % rep.status_code
    politesse.note_succes(domaine)
    if binaire:
        type_mime = (rep.headers.get("Content-Type") or "").lower()
        if "image" not in type_mime and not rep.content[:4] in (b"\xff\xd8\xff\xe0", b"\x89PNG"):
            if "image" not in type_mime:
                return None, "pas une image (%s)" % (type_mime.split(";")[0] or "?")
        return rep.content, None
    return rep.text, None


# --------------------------------------------------------------------------
#  Extraction des candidats dans la page produit
# --------------------------------------------------------------------------
def _attribut(balise, nom):
    m = re.search(r'%s\s*=\s*("([^"]*)"|\'([^\']*)\')' % nom, balise, re.I)
    if not m:
        return None
    return m.group(2) if m.group(2) is not None else m.group(3)


def _plus_grand_srcset(valeur):
    """Renvoie l'adresse du plus grand descripteur `w` d'un srcset."""
    meilleur, largeur_max = None, -1
    for morceau in valeur.split(","):
        morceau = morceau.strip()
        if not morceau:
            continue
        bouts = morceau.split()
        adresse = bouts[0]
        largeur = 0
        if len(bouts) > 1 and bouts[1].endswith("w"):
            try:
                largeur = int(bouts[1][:-1])
            except ValueError:
                largeur = 0
        if largeur > largeur_max:
            meilleur, largeur_max = adresse, largeur
    return meilleur, max(largeur_max, 0)


def _images_jsonld(html):
    """Toutes les valeurs `image` trouvees dans les blocs JSON-LD de la page."""
    trouvees = []

    def creuse(noeud):
        if isinstance(noeud, dict):
            for cle, val in noeud.items():
                if cle == "image":
                    if isinstance(val, str):
                        trouvees.append(val)
                    elif isinstance(val, list):
                        trouvees.extend(v for v in val if isinstance(v, str))
                        for v in val:
                            if isinstance(v, dict) and isinstance(v.get("url"), str):
                                trouvees.append(v["url"])
                    elif isinstance(val, dict) and isinstance(val.get("url"), str):
                        trouvees.append(val["url"])
                else:
                    creuse(val)
        elif isinstance(noeud, list):
            for v in noeud:
                creuse(v)

    for bloc in re.findall(
            r'<script[^>]+type\s*=\s*["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.I | re.S):
        texte = bloc.strip()
        try:
            creuse(json.loads(texte))
        except Exception:
            # certains sites collent plusieurs objets a la suite
            for m in re.finditer(r'"image"\s*:\s*"([^"]+)"', texte):
                trouvees.append(m.group(1))
    return trouvees


def candidats(html, url_page):
    """Liste ordonnee d'adresses d'image plausibles, la plus prometteuse d'abord."""
    vus, sortie = set(), []

    # Certains sites (DevaCurl) ne donnent pas une adresse mais l'identifiant
    # Cloudinary de la photo. On retrouve le compte dans la page et on
    # reconstruit l'adresse : c'est la, et seulement la, qu'on a l'original.
    m = re.search(r"res\.cloudinary\.com/([A-Za-z0-9_-]+)/image/upload", html)
    compte_cloudinary = m.group(1) if m else None

    def ajoute(adresse, rang):
        if not adresse:
            return
        adresse = adresse.strip().replace("&amp;", "&")
        if adresse.startswith("data:") or not adresse:
            return
        if (compte_cloudinary and not adresse.startswith(("http", "//", "/"))
                and "." not in adresse.rsplit("/", 1)[-1]):
            adresse = "https://res.cloudinary.com/%s/image/upload/%s" % (
                compte_cloudinary, adresse.lstrip("/"))
        absolue = urljoin(url_page, adresse)
        if absolue in vus:
            return
        vus.add(absolue)
        sortie.append((rang, absolue))

    # 1. les metadonnees sociales : c'est ce que le site lui-meme met en avant
    for balise in re.findall(r"<meta\b[^>]*>", html, re.I):
        prop = (_attribut(balise, "property") or _attribut(balise, "name") or "").lower()
        if prop in ("og:image", "og:image:secure_url", "og:image:url",
                    "twitter:image", "twitter:image:src"):
            ajoute(_attribut(balise, "content"), 0)

    # 2. le JSON-LD du produit
    for adresse in _images_jsonld(html):
        ajoute(adresse, 1)

    # 3. l'image que la page precharge (souvent le visuel principal)
    for balise in re.findall(r"<link\b[^>]*>", html, re.I):
        if (_attribut(balise, "as") or "").lower() == "image":
            srcset = _attribut(balise, "imagesrcset")
            if srcset:
                ajoute(_plus_grand_srcset(srcset)[0], 2)
            ajoute(_attribut(balise, "href"), 2)

    # 4. les <img> : d'abord le plus grand srcset, sinon la source directe
    for balise in re.findall(r"<(?:img|source)\b[^>]*>", html, re.I):
        srcset = _attribut(balise, "srcset") or _attribut(balise, "data-srcset")
        if srcset:
            adresse, largeur = _plus_grand_srcset(srcset)
            ajoute(adresse, 3 if largeur >= MIN_LARGEUR else 4)
        for cle in ("src", "data-src", "data-original", "data-zoom-image", "data-large_image"):
            ajoute(_attribut(balise, cle), 4)

    sortie.sort(key=lambda t: t[0])
    return [a for _, a in sortie]


# --------------------------------------------------------------------------
#  Agrandissement des adresses connues
# --------------------------------------------------------------------------
def agrandit(url):
    """Demande la plus grande version quand le CDN sait la servir.

    Renvoie une liste d'adresses a essayer dans l'ordre (la version agrandie
    d'abord, l'originale ensuite)."""
    essais = []
    parts = urlsplit(url)
    parametres = dict(parse_qsl(parts.query, keep_blank_values=True))
    domaine = parts.netloc.lower()

    def avec(nouveaux):
        p = dict(parametres)
        p.update(nouveaux)
        return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(p), parts.fragment))

    if "cdn.shopify.com" in domaine or "/cdn/shop/" in parts.path:
        # Shopify : ?width=1200 suffit, et les suffixes _600x du nom de fichier
        # sont des miniatures figees qu'il faut retirer.
        chemin = re.sub(r"_(\d+x\d*|\d*x\d+|small|medium|large|grande|compact|pico|icon|thumb)"
                        r"(?=\.(?:jpg|jpeg|png|webp)\b)", "", parts.path, flags=re.I)
        p = dict(parametres)
        p.pop("height", None)
        p["width"] = "1200"
        essais.append(urlunsplit((parts.scheme, parts.netloc, chemin, urlencode(p), parts.fragment)))
    elif "/media/catalog/product/cache/" in parts.path:
        # Magento (Virtue) : le segment `cache/<empreinte>/` sert une vignette
        # figee ; sans lui, le media renvoie le fichier d'origine.
        essais.append(urlunsplit((parts.scheme, parts.netloc,
                                  re.sub(r"/cache/[0-9a-f]{8,}/", "/", parts.path),
                                  parts.query, parts.fragment)))
    elif "/is/image/" in parts.path:
        # Adobe Dynamic Media (scene7, dm.henkel-dam.com...) : `wid` commande la
        # largeur servie, l'original par defaut est une vignette.
        essais.append(avec({"wid": "1200"}))
    elif "wedia-group.com" in domaine:
        # Wedia (Pierre Fabre : Klorane, Ducray, Rene Furterer) : la page
        # demande `t=resize&height=400`. Sans parametre, le DAM rend l'original.
        essais.append(urlunsplit((parts.scheme, parts.netloc, parts.path,
                                  urlencode({"t": "resize", "width": "1600"}), "")))
        essais.append(urlunsplit((parts.scheme, parts.netloc, parts.path, "", "")))
    elif any(k in parametres for k in ("width", "w", "sw", "wid", "maxWidth")):
        cle = next(k for k in ("width", "w", "sw", "wid", "maxWidth") if k in parametres)
        try:
            if int(re.sub(r"\D", "", parametres[cle]) or 0) < 1200:
                essais.append(avec({cle: "1200"}))
        except ValueError:
            pass

    if url not in essais:
        essais.append(url)
    return essais


# --------------------------------------------------------------------------
#  Verification de l'image elle-meme
# --------------------------------------------------------------------------
MOTS_VIDES = {"the", "and", "pour", "avec", "des", "les", "une", "shampooing", "shampoo",
              "conditioner", "apres", "soin", "creme", "cream", "hair", "cheveux"}


def _mots(texte):
    return {m for m in re.split(r"[^a-z0-9]+", (texte or "").lower()) if len(m) >= 4}


def pertinent(url, fiche):
    """Le nom du fichier parle-t-il du produit ?

    `gg-core-shampoo.png` sur une fiche Glycolic Gloss, oui. `2.jpg`, non : ce
    n'est qu'un numero dans une galerie, ou peut se cacher un bandeau de
    promesses plutot que le flacon."""
    nom = urlsplit(url).path.rsplit("/", 1)[-1]
    nom = re.sub(r"\.(jpg|jpeg|png|webp|gif|avif)$", "", nom, flags=re.I)
    mots_fichier = _mots(nom) - MOTS_VIDES
    if not mots_fichier:
        return False
    mots_fiche = (_mots(fiche.get("name")) | _mots(fiche.get("id"))) - MOTS_VIDES
    communs = mots_fichier & mots_fiche
    if len(communs) >= 2:
        return True
    return any(len(m) >= 6 for m in communs)


def numero_de_galerie(url):
    """`.../2.jpg` : une case de carrousel, designee par son rang et rien d'autre."""
    nom = urlsplit(url).path.rsplit("/", 1)[-1]
    return bool(re.match(r"^\d{1,2}\.(jpg|jpeg|png|webp|avif)$", nom, re.I))


def nom_suspect(url):
    parts = urlsplit(url)
    if any(h in parts.netloc.lower() + parts.path.lower() for h in HOTES_MOUCHARDS):
        return True
    nom = parts.path.rsplit("/", 1)[-1].lower()
    return any(mot in nom for mot in MOTS_SUSPECTS)


def verifie(octets, min_largeur=MIN_LARGEUR):
    """Renvoie (image, None) si l'image est un packshot utilisable, sinon (None, raison)."""
    try:
        im = Image.open(io.BytesIO(octets))
        im.load()
    except Exception:
        return None, "illisible"
    largeur, hauteur = im.size
    if largeur < 50 or hauteur < 50:
        return None, "pixel de suivi (%dx%d)" % (largeur, hauteur)
    if largeur < min_largeur:
        return None, "trop petite (%d px)" % largeur
    rapport = largeur / float(hauteur)
    if rapport > 4 or rapport < 0.25:
        return None, "proportions de banniere (%dx%d)" % (largeur, hauteur)
    # une image plate (un aplat de couleur, un cadre vide) n'est pas un produit
    controle = im.convert("RGB").resize((64, 64))
    valeurs = controle.getdata()
    mini = [255, 255, 255]
    maxi = [0, 0, 0]
    for pixel in valeurs:
        for c in range(3):
            if pixel[c] < mini[c]:
                mini[c] = pixel[c]
            if pixel[c] > maxi[c]:
                maxi[c] = pixel[c]
    if max(maxi[c] - mini[c] for c in range(3)) < 24:
        return None, "image plate (aucun contraste)"
    return im, None


def enregistre_jpeg(im, chemin):
    """Ecrit l'image en JPEG, fond blanc si elle est transparente."""
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        fond = Image.new("RGB", im.size, (255, 255, 255))
        fond.paste(im, mask=im.split()[-1])
        im = fond
    else:
        im = im.convert("RGB")
    im.save(chemin, "JPEG", quality=88, optimize=True, progressive=True)


# --------------------------------------------------------------------------
#  Selection des fiches a reparer
# --------------------------------------------------------------------------
def largeur_locale(fiche):
    """Largeur en pixels de l'image deja enregistree, 0 si aucune."""
    rel = fiche.get("image_local")
    if not rel:
        return 0
    chemin = os.path.join(RACINE, rel)
    if not os.path.exists(chemin):
        return 0
    try:
        return Image.open(chemin).size[0]
    except Exception:
        return 0


def selection(produits, args):
    lots, retenus = [], []
    for p in produits:
        motifs = []
        if args.absentes and p.get("image_absente"):
            motifs.append("absente")
        if args.incertaines and p.get("image_incertaine"):
            motifs.append("incertaine")
        if args.petites and not p.get("image_absente"):
            l = largeur_locale(p)
            if 0 < l < args.seuil:
                motifs.append("petite(%d px)" % l)
        if args.ids and p.get("id") in args.ids:
            motifs.append("demandee")
        if motifs:
            p["_motifs"] = motifs
            retenus.append(p)
    lots.extend(retenus)
    return lots


def chemin_image(fiche):
    """Ou enregistrer l'image : on garde le chemin existant quand il y en a un."""
    rel = fiche.get("image_local")
    if rel:
        return os.path.join(RACINE, rel), rel
    marque = fiche["brand"]
    identifiant = fiche["id"]
    nom = identifiant[len(marque) + 2:] if identifiant.startswith(marque + "--") else identifiant
    nom = re.sub(r"[^a-z0-9._-]+", "-", nom.lower()).strip("-") or "produit"
    rel = "public/scan/products-cheveux/%s/%s.jpg" % (marque, nom)
    return os.path.join(RACINE, rel), rel


# --------------------------------------------------------------------------
#  Reparation d'une fiche
# --------------------------------------------------------------------------
def empreintes_existantes(produits, exclus):
    """Empreinte de chaque image deja en place, pour ne pas recreer de doublon.

    Deux fiches differentes qui partagent le meme fichier, c'est exactement le
    defaut que l'audit avait nomme `image_incertaine` : on ne sait pas laquelle
    des deux la photo represente."""
    table = {}
    for p in produits:
        if p["id"] in exclus:
            continue
        rel = p.get("image_local")
        if not rel:
            continue
        chemin = os.path.join(RACINE, rel)
        if not os.path.exists(chemin):
            continue
        try:
            table.setdefault(hashlib.md5(open(chemin, "rb").read()).hexdigest(), p["id"])
        except Exception:
            pass
    return table


def repare(fiche, politesse, args, journal, empreintes):
    ligne = {"id": fiche["id"], "brand": fiche["brand"], "motifs": fiche.get("_motifs", []),
             "url": fiche.get("url")}
    url_page = fiche.get("url")
    if not url_page:
        ligne["statut"] = "echec"
        ligne["raison"] = "aucune page produit dans la fiche"
        journal.append(ligne)
        return False

    domaine = urlsplit(url_page).netloc
    if domaine in politesse.abandonnes:
        ligne["statut"] = "abandon"
        ligne["raison"] = "domaine %s abandonne apres %d refus" % (domaine, REFUS_AVANT_ABANDON)
        journal.append(ligne)
        return False

    html, erreur = recupere(url_page, politesse)
    if erreur:
        ligne["statut"] = "echec"
        ligne["raison"] = "page produit: %s" % erreur
        journal.append(ligne)
        return False

    essais, refusees, repli = 0, [], None
    liste = [a for a in candidats(html, url_page) if not nom_suspect(a)]
    refusees.extend("%s : nom suspect" % a.rsplit("/", 1)[-1][:60]
                    for a in candidats(html, url_page) if nom_suspect(a))

    # On essaie d'abord les visuels dont le nom parle du produit : c'est le
    # meilleur indice qu'on a que la photo est bien la bonne.
    nommes = [a for a in liste if pertinent(a, fiche)]
    liste = nommes + [a for a in liste if a not in nommes]
    nomme_trop_petit, galerie = False, None

    for adresse in liste:
        if essais >= args.candidats_max:
            break
        for candidate in agrandit(adresse):
            if essais >= args.candidats_max:
                break
            essais += 1
            octets, erreur = recupere(candidate, politesse, binaire=True)
            if erreur:
                refusees.append("%s : %s" % (candidate.rsplit("/", 1)[-1][:60], erreur))
                continue
            image, raison = verifie(octets, args.min_largeur)
            if raison:
                refusees.append("%s : %s" % (candidate.rsplit("/", 1)[-1][:60], raison))
                if raison.startswith("trop petite") and pertinent(candidate, fiche):
                    # le vrai packshot existe mais le site ne le sert qu'en
                    # petit : on ne lui substituera pas un visuel anonyme.
                    nomme_trop_petit = True
                continue
            marque = hashlib.md5(octets).hexdigest()
            proprietaire = empreintes.get(marque)
            if proprietaire and proprietaire != fiche["id"]:
                # cette photo sert deja a une autre fiche : on cherche mieux,
                # et on la garde seulement en dernier recours.
                refusees.append("%s : deja utilisee par %s"
                                % (candidate.rsplit("/", 1)[-1][:60], proprietaire))
                if repli is None:
                    repli = (image, candidate, octets, proprietaire)
                continue
            if numero_de_galerie(candidate):
                # `2.jpg`, `3.jpg` : une case de carrousel sans nom. C'est
                # souvent un bandeau de promesses plutot que le flacon. On la
                # garde en dernier recours seulement.
                refusees.append("%s : case de galerie sans nom"
                                % candidate.rsplit("/", 1)[-1][:60])
                if galerie is None:
                    galerie = (image, candidate, octets)
                continue
            return _pose(fiche, image, candidate, octets, url_page, args, journal, ligne,
                         empreintes, None)
    if repli is None and galerie is not None and not nomme_trop_petit:
        image, candidate, octets = galerie
        return _pose(fiche, image, candidate, octets, url_page, args, journal, ligne,
                     empreintes, None)
    if repli is not None:
        image, candidate, octets, proprietaire = repli
        return _pose(fiche, image, candidate, octets, url_page, args, journal, ligne,
                     empreintes, proprietaire)

    ligne["statut"] = "echec"
    ligne["raison"] = "aucun visuel utilisable (%d candidats essayes)" % essais
    ligne["refusees"] = refusees[:8]
    journal.append(ligne)
    return False


def _pose(fiche, image, url_image, octets, url_page, args, journal, ligne, empreintes,
          partagee_avec):
    """Enregistre l'image retenue et met la fiche a jour."""
    chemin, rel = chemin_image(fiche)
    ligne.update({
        "statut": "reparee",
        "image": url_image,
        "taille": "%dx%d" % image.size,
        "fichier": rel,
        "ancienne_largeur": largeur_locale(fiche),
    })
    if partagee_avec:
        ligne["statut"] = "reparee (partagee)"
        ligne["partagee_avec"] = partagee_avec
    empreintes.setdefault(hashlib.md5(octets).hexdigest(), fiche["id"])
    if not args.essai:
        enregistre_jpeg(image, chemin)
        applique(fiche, rel, url_image, url_page, args.date)
        if partagee_avec:
            # la photo est la meme que celle d'une autre fiche : le doute reste,
            # on le redit au lieu de le masquer.
            fiche["image_incertaine"] = True
            fiche["image_provenance"] += " (meme visuel que %s)" % partagee_avec
        try:
            empreintes.setdefault(hashlib.md5(open(chemin, "rb").read()).hexdigest(), fiche["id"])
        except Exception:
            pass
    journal.append(ligne)
    return True


def applique(fiche, rel, url_image, url_page, date):
    """Met la fiche a jour, en gardant la structure du catalogue."""
    fiche["image_local"] = rel
    fiche["image_source_url"] = url_image
    fiche.pop("image_absente", None)
    fiche.pop("image_incertaine", None)
    # l'ancien detourage ne correspond plus a cette photo : on le laisse tomber,
    # detourage_cheveux.py le regenerera et reposera cutout_url.
    fiche["cutout_url"] = None
    fiche["image_fond"] = True
    fiche["image_provenance"] = "page produit %s" % url_page
    fiche["image_reparee_le"] = date


# --------------------------------------------------------------------------
#  Ecriture : all.json puis les fichiers de marque
# --------------------------------------------------------------------------
CLES_IMAGE = ("image_local", "image_source_url", "cutout_url", "image_fond",
              "image_absente", "image_incertaine", "image_provenance",
              "image_reparee_le")


def ecris_catalogue(doc):
    json.dump(doc, open(ALL_JSON, "w", encoding="utf-8"),
              ensure_ascii=False, separators=(", ", ": "))


def ecris_marques(produits):
    """Reporte les champs image dans catalogue-cheveux/<marque>.json."""
    index = {p["id"]: p for p in produits}
    touches = 0
    for nom in sorted(os.listdir(ICI)):
        if not nom.endswith(".json") or nom.startswith("_"):
            continue
        chemin = os.path.join(ICI, nom)
        try:
            d = json.load(open(chemin, encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict) or "products" not in d:
            continue
        change = False
        for p in d["products"]:
            src = index.get(p.get("id"))
            if not src:
                continue
            for cle in CLES_IMAGE:
                if cle in src:
                    if p.get(cle) != src[cle]:
                        p[cle] = src[cle]
                        change = True
                elif cle in p:
                    p.pop(cle, None)
                    change = True
        if change:
            json.dump(d, open(chemin, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
            touches += 1
    return touches


# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Repare les images du catalogue cheveux.")
    ap.add_argument("--absentes", action="store_true", help="fiches marquees image_absente")
    ap.add_argument("--incertaines", action="store_true", help="fiches marquees image_incertaine")
    ap.add_argument("--petites", action="store_true", help="images plus etroites que --seuil")
    ap.add_argument("--seuil", type=int, default=300, help="largeur jugee trop petite (defaut 300)")
    ap.add_argument("--min-largeur", type=int, default=MIN_LARGEUR, dest="min_largeur",
                    help="largeur minimale acceptee pour la nouvelle image (defaut 600)")
    ap.add_argument("--ids", nargs="*", default=[], help="identifiants de fiches a reparer")
    ap.add_argument("--limite", type=int, default=0, help="s'arreter apres N fiches")
    ap.add_argument("--candidats-max", type=int, default=6, dest="candidats_max",
                    help="images essayees au maximum par fiche (defaut 6)")
    ap.add_argument("--essai", action="store_true", help="ne rien ecrire, seulement dire")
    ap.add_argument("--journal", default=os.path.join(ICI, "_reparation_images.json"),
                    help="ou ecrire le journal detaille")
    ap.add_argument("--date", default=time.strftime("%Y-%m-%d"), help="date notee dans les fiches")
    args = ap.parse_args()

    if not (args.absentes or args.incertaines or args.petites or args.ids):
        ap.error("choisir au moins un lot : --absentes, --incertaines, --petites ou --ids")

    doc = json.load(open(ALL_JSON, encoding="utf-8"))
    produits = doc["products"]
    cibles = selection(produits, args)
    if args.limite:
        cibles = cibles[:args.limite]
    print("fiches a reparer : %d" % len(cibles))

    politesse = Politesse()
    empreintes = empreintes_existantes(produits, {p["id"] for p in cibles})
    journal, reparees = [], 0
    for i, fiche in enumerate(cibles, 1):
        ok = repare(fiche, politesse, args, journal, empreintes)
        reparees += 1 if ok else 0
        etat = journal[-1]
        print("%4d/%d  %-9s %s  %s" % (
            i, len(cibles), etat.get("statut"), fiche["id"][:58],
            etat.get("taille") or etat.get("raison") or ""))
        sys.stdout.flush()

    for fiche in produits:
        fiche.pop("_motifs", None)

    if not args.essai and reparees:
        ecris_catalogue(doc)
        touches = ecris_marques(produits)
        print("fichiers de marque mis a jour : %d" % touches)

    try:
        json.dump({"date": args.date, "reparees": reparees, "total": len(cibles),
                   "domaines_abandonnes": sorted(politesse.abandonnes),
                   "detail": journal},
                  open(args.journal, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print("journal : %s" % args.journal)
    except Exception as e:
        print("journal non ecrit : %s" % e)

    print("reparees : %d / %d" % (reparees, len(cibles)))
    if politesse.abandonnes:
        print("domaines abandonnes : %s" % ", ".join(sorted(politesse.abandonnes)))


if __name__ == "__main__":
    main()
