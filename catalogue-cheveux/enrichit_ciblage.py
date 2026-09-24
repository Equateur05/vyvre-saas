#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ENRICHIT LE CIBLAGE DU CATALOGUE CAPILLAIRE (cheveux_cibles + claims).

Pourquoi
--------
Audit du 23/09/2026 sur les 4 425 fiches :
  - cheveux_cibles VIDE pour 7,0 % des produits, et UNE SEULE valeur pour 43,5 %
    de plus : la moitie du catalogue n'apporte quasiment aucun signal au moteur.
  - claims VIDE pour 13,2 % et 437 valeurs distinctes en texte libre non controle
    (« Urban Defence Pro », « Shine Fix Complex », des phrases entieres de SEO).
  - 174 fiches n'ont ni cible ni promesse.

Ce que fait ce script
---------------------
1. Il FERME le vocabulaire des promesses : `claims` ne contient plus que des
   valeurs de la liste PROMESSES ci-dessous.
2. Il range les valeurs existantes dans ce vocabulaire, d'abord par une table
   explicite (TABLE_CLAIMS), puis par un repli lexical controle sur les phrases
   libres. Toute valeur qui ne se range nulle part est RECOPIEE DANS LE RAPPORT,
   jamais devinee, jamais remplacee au hasard.
3. Il deduit les cibles (`cheveux_cibles`) et les promesses manquantes a partir
   de ce que la fiche dit vraiment : nom, description, claims d'origine, actifs,
   categorie. Regles explicites, une par ligne, tracables dans le rapport.
   Si rien ne permet de trancher, le champ reste VIDE et c'est compte.
4. Il ecrit `ciblage_source` : "fiche" (rien n'a ete ajoute) ou "deduit".

Ce qu'il ne touche JAMAIS
-------------------------
price_eur, price_source, url, url_verifiee_le, image_source_url, image_local,
cutout_url, image_fond, image_absente, image_incertaine, ingredients, source.

Usage
-----
    python3 catalogue-cheveux/enrichit_ciblage.py --essai      # rien n'est ecrit
    python3 catalogue-cheveux/enrichit_ciblage.py --applique   # ecrit les fichiers

    --rapport <chemin>   ou ecrire le rapport JSON
                         (defaut : catalogue-cheveux/_rapport_ciblage.json,
                          le prefixe _ le tient hors de l'import Supabase)

Ecrit, en mode --applique :
    catalogue-cheveux/<marque>.json          (fichiers source, ils font foi)
    public/scan/catalogue-cheveux/all.json   (le fichier servi au navigateur)
Puis il faut regenerer les CSV :
    python3 catalogue-cheveux/supabase/import.py --csv
"""

import argparse
import html
import json
import os
import re
import sys
import unicodedata
from collections import Counter, OrderedDict

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
ALL_JSON = os.path.join(RACINE, "public", "scan", "catalogue-cheveux", "all.json")
RAPPORT_DEFAUT = os.path.join(ICI, "_rapport_ciblage.json")


# =====================================================================
# 1) VOCABULAIRE FERME
# =====================================================================

# Les 12 seules cibles autorisees (catalogue-cheveux/REGLES.md). Le moteur
# public/scan/vyvre-hair-engine.js ne connait que celles-la dans composerRoutine :
# secs, gras, fins, boucles, crepus, lisses, colores, abimes, chute, pellicules,
# cuir-chevelu-sensible sont des « attendues » ; epais sert de contraire a fins.
CIBLES = ("secs", "gras", "fins", "epais", "boucles", "crepus", "lisses",
          "colores", "abimes", "chute", "pellicules", "cuir-chevelu-sensible")

# Les seules promesses autorisees dans `claims` apres passage du script.
#
# Le libelle n'est pas choisi au hasard : le moteur ne lit pas les claims comme
# une liste, il les colle dans une soupe de texte (texteProduit, ligne 2853) et
# y cherche des morceaux de mots (le dictionnaire MOTS, ligne 2859). Chaque
# libelle ci-dessous contient donc le morceau de mot que le moteur cherche ;
# le commentaire dit lequel. Un libelle « joli » mais muet pour le moteur
# (« densite » au lieu de « densifiant ») ne servirait a rien.
PROMESSES = (
    "hydratation",             # 'hydrat'      -> MOTS.nourrissant
    "nutrition",               # 'nutriti'     -> MOTS.nourrissant
    "reparation",              # 'repar'       -> MOTS.reparation
    "fortifiant",              # 'fortifi'     -> MOTS.reparation
    "anti-frisottis",          # 'frisot'      -> MOTS.boucles (1 point : pas de malus sur cheveux raides)
    "definition-boucles",      # 'boucl' + 'definition' -> MOTS.boucles (2 points : malus voulu sur cheveux raides)
    "volume",                  # 'volume'      -> MOTS.volume
    "texturisant",             # 'texturis'    -> MOTS.volume (coiffage : n'implique PAS des cheveux fins)
    "densifiant",              # 'densifi'     -> MOTS.chute
    "anti-chute",              # 'chute' + 'anti-chute' -> MOTS.chute
    "croissance",              # 'croissance'  -> MOTS.chute
    "antipelliculaire",        # 'pellicul'    -> MOTS.antipelliculaire
    "apaisant-cuir-chevelu",   # 'apais'       -> MOTS.apaisant
    "purifiant",               # 'purifiant'   -> MOTS.purifiant
    "anti-gras",               # 'gras'        -> MOTS.purifiant
    "brillance",               # aucun marqueur moteur : sert a l'affichage et a Supabase
    "protection-couleur",      # 'couleur' + 'color' -> MOTS.couleur
    "anti-jaunissement",       # 'jaunissement' + 'anti-jaune' -> MOTS.blancs
    "protection-chaleur",      # 'chaleur'     -> MOTS.thermique
    "anti-pollution",          # aucun marqueur moteur
    "demelant",                # aucun marqueur moteur
    "fixation",                # aucun marqueur moteur (le moteur penalise deja le coiffage par le nom)
    "anti-age",                # aucun marqueur moteur
    "sans-sulfate",            # aucun marqueur moteur
    "sans-silicone",           # aucun marqueur moteur
    "sans-paraben",            # aucun marqueur moteur
)
RANG_PROMESSE = {p: i for i, p in enumerate(PROMESSES)}
RANG_CIBLE = {c: i for i, c in enumerate(CIBLES)}


# =====================================================================
# 2) NORMALISATION DU TEXTE
# =====================================================================

def sans_accents(txt):
    """'cheveux abîmés' -> 'cheveux abimes'. Les fiches melangent les deux."""
    d = unicodedata.normalize("NFKD", txt)
    return "".join(c for c in d if not unicodedata.combining(c))


def normalise(txt):
    """Minuscules, sans accents, sans entites HTML, ponctuation adoucie.

    Les fiches collectees contiennent des &#039; &amp; &eacute; parfois
    doublement echappes : on deplie deux fois, jamais plus (une chaine qui
    contient un vrai « & » ne doit pas partir en boucle).
    """
    if not txt:
        return ""
    t = html.unescape(html.unescape(str(txt)))
    t = sans_accents(t).lower()
    t = t.replace("’", "'").replace("‘", "'")
    t = t.replace("–", "-").replace("—", "-")
    # apostrophes et ponctuation -> espace : « l'hydratation » doit contenir « hydratation »
    t = re.sub(r"[''`\"/\\(),;:!?*®™]", " ", t)
    t = re.sub(r"\s+", " ", t)
    return t.strip()


# « no waxy greasy buildup », « texture non grasse », « sans effet gras »,
# « silicone-free, oil-free » : la phrase contient le mot mais promet l'inverse.
# Un simple lookbehind ne suffit pas (la negation est parfois deux mots avant),
# alors on efface le mot nie et on garde le reste de la phrase.
RE_NEGATION_GRAS = re.compile(
    r"\b(?:no|non|non-|not|sans|without|zero|free of|-free)\b[a-z '-]{0,24}?"
    r"\b(gras\w*|greasy|oily|huileu\w*)\b")


def sans_negations(txt):
    """Efface le mot « gras » quand la phrase dit qu'il n'y en a pas."""
    return RE_NEGATION_GRAS.sub(lambda mo: mo.group(0)[:mo.start(1) - mo.start(0)], txt)


# =====================================================================
# 3) TABLE DES CLAIMS EXISTANTS -> PROMESSES
#
# Une entree par valeur normalisee rencontree dans le catalogue. La valeur ()
# veut dire « ce n'est pas une promesse de soin » (un label ecologique, un nom
# de complexe, une forme galenique) : elle est SUPPRIMEE de claims et comptee
# dans le rapport, pas transformee en promesse.
# =====================================================================

TABLE_CLAIMS = {
    # --- les 20 valeurs deja quasi propres, qui couvrent l'essentiel du volume
    "hydratant": ("hydratation",),
    "brillance": ("brillance",),
    "lissant": ("anti-frisottis",),
    "nourrissant": ("nutrition",),
    "fortifiant": ("fortifiant",),
    "reparateur": ("reparation",),
    "volume": ("volume",),
    "volumisant": ("volume",),
    "definition-boucles": ("definition-boucles",),
    "apaisant": ("apaisant-cuir-chevelu",),
    "purifiant": ("purifiant",),
    "texturisant": ("texturisant",),
    "protection-thermique": ("protection-chaleur",),
    "anti-pellicules": ("antipelliculaire",),
    "anti-chute": ("anti-chute",),
    "anti-frisottis": ("anti-frisottis",),
    "anti-casse": ("reparation",),
    "anti-jaunissement": ("anti-jaunissement",),
    "protection-couleur": ("protection-couleur",),
    "protecteur-couleur": ("protection-couleur",),
    "adapte cheveux colores": ("protection-couleur",),
    "demelant": ("demelant",),
    "fixation": ("fixation",),
    "sans sulfate": ("sans-sulfate",),
    "sans silicone": ("sans-silicone",),
    "sans paraben": ("sans-paraben",),
    "silicone-free": ("sans-silicone",),
    "paraben-free": ("sans-paraben",),
    "hypoallerg": (),
    "hypoallergenique": (),
    "bio": (),
    "eau thermale": (),

    # --- noms de complexes et de technologies : ce n'est pas une promesse.
    # On les jette ICI, explicitement, plutot que de laisser le repli lexical
    # leur inventer un sens a partir d'un mot du nom commercial.
    "urban defence pro": ("anti-pollution",),      # le nom dit la promesse, elle est reelle
    "shine fix complex": ("brillance",),
    "color fix complex": ("protection-couleur",),
    "antifade complex": ("protection-couleur",),
    "climate-proof": ("anti-frisottis",),          # tenue face a l'humidite
    "blue light shield": ("anti-pollution",),
    "sun shield": (),
    "chlorine fence": (),
    "a-z bond complex": ("reparation",),
    "frizz defeat protein": ("anti-frisottis",),
    "curl amplifier": ("definition-boucles",),
    "volume boost complex": ("volume",),
    "filler complex": (),
    "multivitamin complex": (),
    "microbiotic system": (),
    "derma comfort complex": ("apaisant-cuir-chevelu",),
    "sebonorm complex": ("anti-gras",),
    "biorenew complex": (),
    "pure-set complex": (),
    "nutri-sugars": (),
    "specific active ingredient": (),
    "multi-sensory experience": (),
    "concentrated formulas": (),
    "stainless-steel ball technology": (),

    # --- ingredients cites seuls : ce n'est pas une promesse (ils sont deja
    # dans `actifs`, c'est leur place).
    "vitamin e": (), "flaxseed oil": (), "olive oil": (), "flaxseed oil extract": (),
    "blackcurrant": (), "manketti oil": (), "hyaluronic acid": (), "baobab oil": (),
    "rice oil": (), "nettle extract": (), "centella asiatica extract": (),
    "hibiscus oil": (), "eau volcanique": (), "hyperfermented oak bark": (),
    "hyperfermented vine sap": (), "hyperfermented rice water": (),
    "hyperfermented citrus fruits": (), "centella asiatica extract and vitamin f": (),
    "bamboo marrow and cortex repair": ("reparation",),

    # --- labels et emballage : jamais une promesse de soin
    "vegan": (), "no nasties": (), "100% recyclable": (),
    "95% post-consumer recyclable materials": (),

    # --- formes galeniques et noms de gamme ecrits en majuscules par le collecteur
    "shampoo": (), "conditioner": (), "spray": (), "mask": (), "mousse": (),
    "serum": (), "styling": (), "treatment": (), "nanoworks": (),
    "pure volume": ("volume",),
    "strength cure": ("fortifiant",),
    "strength cure blonde": ("fortifiant",),
    "style + protect": (),
    "color fanatic": ("protection-couleur",),
    "smooth perfection": ("anti-frisottis",),
    "anti-frizz smoothing": ("anti-frisottis",),
    "blonde recovery": ("reparation",),
    "brunette recovery": ("reparation",),
    "hydrate": ("hydratation",),
    "moisturising": ("hydratation",),
    "volumising": ("volume",),
    "repair": ("reparation",),
    "hair shine": ("brillance",),
    "heat protection": ("protection-chaleur",),
    "thermal protector": ("protection-chaleur",),

    # --- « claims » qui sont en fait des types de cheveux : ils ne disent pas
    # ce que le produit promet, ils disent a qui il s'adresse. Ils sont lus
    # comme CIBLE (voir REGLES_CIBLES, champ « claims ») et retires de claims.
    "fine & thin hair": (), "dry hair": (), "hair breakage": (),
    "curly and wavy hair": (), "blonde hair": (),
}


# =====================================================================
# 4) MOTS CONTROLES -> PROMESSE
#
# Sert deux fois :
#   - repli lexical sur les claims libres que TABLE_CLAIMS ne connait pas
#     (les phrases entieres : « Reduces frizz », « Protects from heat up to 232°C ») ;
#   - deduction depuis le nom, la description, les actifs.
# Un motif est une expression reguliere appliquee au texte normalise.
# =====================================================================

# « non-greasy », « non grasse », « sans effet gras », « anti-gras » : la phrase
# promet l'inverse du mot qu'elle contient.
# « acides gras » de l'INCI n'est pas « cheveux gras » : ce faux ami la,
# lui, se regle bien avec un lookbehind.
NEG_GRAS = r"(?<!acide )(?<!acides )(?<!anti-)"

MOTS_PROMESSE = OrderedDict([
    ("hydratation", [r"hydrat", r"moistur", r"humect", r"hydra-", r"moisture"]),
    ("nutrition", [r"nourri", r"nutri", r"nourish", r"\bbutter\b", r"beurre de",
                   r"deeply nourishes", r"replenish"]),
    ("reparation", [r"\brepar", r"\brepair", r"reconstruct", r"restructur", r"rebuild",
                    r"\bmend\b", r"\bbond\b", r"\bbonds\b", r"bond builder", r"liaison",
                    r"breakage", r"\bcasse\b", r"cassant", r"abime", r"damaged hair",
                    r"split end", r"fourche", r"anti-casse"]),
    ("fortifiant", [r"fortifi", r"fortify", r"strength", r"renforce", r"reinforc",
                    r"stronger hair", r"resistan"]),
    ("anti-frisottis", [r"frisot", r"frizz", r"\bliss", r"smooth", r"discipline",
                        r"humidity", r"flyaway", r"statique", r"\bstatic\b", r"anti-humidite"]),
    ("definition-boucles", [r"boucl", r"\bcurl", r"\bcoil", r"ondul", r"\bwavy\b",
                            r"\bwaves\b", r"definition", r"curl pattern"]),
    ("volume", [r"volum", r"epaissi", r"thicken", r"thicker", r"fuller", r"fullness",
                r"gonflant", r"\bplump", r"body and bounce",
                r"instant lift", r"adds .{0,12}body"]),
    ("texturisant", [r"texturis", r"texturiz", r"\btexture\b", r"\bgrip\b"]),
    ("densifiant", [r"densifi", r"densit", r"\bdensity\b", r"clairseme", r"thinning hair",
                    r"s affinent", r"cheveux affines"]),
    ("anti-chute", [r"chute", r"hair loss", r"hair fall", r"hairfall", r"shedding",
                    r"alopec", r"perte de cheveux"]),
    ("croissance", [r"croissance", r"growth", r"regrowth", r"repousse", r"stimule la pousse"]),
    ("antipelliculaire", [r"pellicul", r"dandruff", r"squam", r"desquam"]),
    ("apaisant-cuir-chevelu", [r"apais", r"soothe", r"soothing", r"irrit", r"demangeais",
                               r"\bitch", r"\bcalm", r"sensitive scalp", r"cuir chevelu sensible",
                               r"scalp comfort", r"rougeurs"]),
    ("purifiant", [r"purifi", r"clarifi", r"\bdetox", r"exfoli", r"\bscrub\b", r"gommage",
                   r"buildup", r"build-up", r"nettoie en profondeur", r"deeply cleanse",
                   r"deep cleans", r"impuret", r"residus", r"product build"]),
    # NEG_GRAS : « non-greasy formula », « texture non grasse », « sans effet gras »
    # promettent l'inverse. Sans ce garde-fou, 3 fiches sur 20 du controle a la main
    # ressortaient « cheveux gras » alors que la fiche dit « ne graisse pas ».
    ("anti-gras", [NEG_GRAS + r"gras", NEG_GRAS + r"oily\b", r"sebum", r"\bsebo",
                   NEG_GRAS + r"greasy", r"excess oil", r"exces de sebum", r"oil control",
                   r"absorbs excess oil"]),
    ("brillance", [r"brillan", r"\bshine\b", r"\bshiny\b", r"\bgloss", r"\beclat",
                   r"luminos", r"lumineu", r"radian", r"polish", r"mirror-like",
                   r"miroir", r"boost shine", r"boosts shine"]),
    ("protection-couleur", [r"protection couleur", r"protege la couleur", r"eclat de la couleur",
                            r"color-treated", r"colour-treated", r"color treated",
                            r"color safe", r"color-safe", r"colour-safe", r"antifade",
                            r"anti-fade", r"color fade", r"haircolor", r"color vibrancy",
                            r"colour vibrancy", r"apres-coloration", r"protecteur couleur",
                            r"soin couleur", r"preserves .{0,12}color"]),
    ("anti-jaunissement", [r"jaunissement", r"anti-jaune", r"anti-yellow", r"brassy",
                           r"\bbrass\b", r"pigment violet", r"purple shampoo", r"blue shampoo",
                           r"shampoing bleu", r"neutraliz.{0,20}(yellow|brass|orange)",
                           r"anti-orange", r"orange hues",
                           r"neutralis.{0,25}(reflets )?(jaunes|orange|cuivres|chauds)"]),
    ("protection-chaleur", [r"thermique", r"thermal", r"heat protect", r"heat-protect",
                            r"protection contre la chaleur", r"protege de la chaleur",
                            r"from heat", r"against heat", r"heat damage", r"bouclier thermique",
                            r"protects .{0,20}heat", r"heat styling"]),
    ("anti-pollution", [r"pollution", r"pollutant", r"urban defence", r"urban defense",
                        r"blue light", r"environmental aggressor"]),
    ("demelant", [r"demel", r"detangl", r"\btangle", r"noeuds"]),
    ("fixation", [r"fixation", r"fixant", r"\bhold\b", r"\bholding\b", r"\btenue\b",
                  r"\blaque\b", r"hairspray", r"coiffage", r"style retention",
                  r"style memory", r"holding power"]),
    ("anti-age", [r"anti-age", r"anti-aging", r"anti-ageing", r"rajeuni",
                  r"vieillissement capillaire", r"youthful", r"youthlock", r"age defy"]),
    ("sans-sulfate", [r"sans sulfate", r"sulfate-free", r"sulfate free", r"sulphate-free",
                      r"sulphate free", r"free of sls", r"sls/sles", r"sans sulfates"]),
    ("sans-silicone", [r"sans silicone", r"silicone-free", r"silicone free"]),
    ("sans-paraben", [r"sans paraben", r"paraben-free", r"paraben free"]),
])
MOTS_PROMESSE_C = {p: [re.compile(m) for m in ms] for p, ms in MOTS_PROMESSE.items()}


# =====================================================================
# 5) REGLES DE CIBLE
#
# Chaque regle est (cible, ou_chercher, motif) et on garde la trace de celle
# qui a declenche. « ou_chercher » :
#   'nom'    -> le nom commercial seul. Reserve aux mots trop courants pour la
#               description : tout le monde ecrit « hydrate » dans sa prose,
#               seul un produit fait pour les cheveux secs le met dans son NOM.
#   'texte'  -> nom + description + claims d'origine. Reserve aux formules qui
#               nomment le type de cheveux (« for dry hair », « cheveux fins »).
#   'actif'  -> la liste actifs.
#   'categorie' -> la categorie du catalogue.
# =====================================================================

REGLES_CIBLES = [
    # ---- secs
    ("secs", "texte", r"cheveux (tres |extremement )?secs"),
    ("secs", "texte", r"cheveux deshydrates"),
    ("secs", "texte", r"\bdry (to |and |, )?(very |extremely )?(dry )?hair"),
    ("secs", "texte", r"very dry|extremely dry|dry-to-extremely dry"),
    ("secs", "texte", r"secheresse|\bdryness\b|dehydrated hair"),
    ("secs", "texte", r"assoiff|\bthirsty\b|parched"),
    ("secs", "texte", r"dry strands|dry, damaged|brittle hair|cheveux ternes et secs"),
    ("secs", "texte", r"deep conditioning|intense moisture|nutrition intense|hydratation intense"),
    ("secs", "nom", r"hydrat|moistur|moisture|nourish|nourri|nutri|\bsecs?\b|\bseche"),
    # les corps gras lourds ne sont pas mis dans une formule pour des cheveux qui
    # n'en ont pas besoin : beurres et huiles riches lus dans `actifs`.
    # « actifs2 » : il faut DEUX corps gras riches, pas un. Un masque proteine
    # qui contient de l'huile de coco n'est pas pour autant un soin pour cheveux
    # secs (fiche « Masque Coco-Spiruline », controle a la main du 23/09).
    ("secs", "actifs2", r"beurre de (karite|mangue|murumuru|cacao|cupuacu)|"
                        r"huile de (coco|avocat|ricin|olive|baobab|marula|macadamia|brocoli)"),
    # ---- gras
    ("gras", "texte", r"cheveux (a tendance )?gras|racines grasses|cuir chevelu gras"),
    ("gras", "texte", NEG_GRAS + r"oily (hair|scalp|roots)|" + NEG_GRAS + r"greasy"),
    ("gras", "texte", r"exces de sebum|excess (oil|sebum)|seborrh"),
    ("gras", "texte", r"tendance grasse|cheveux et cuir chevelu gras"),
    ("gras", "nom", r"purifiant|clarifying|clarifiant|\bdetox|\bsebo|oil control"),
    ("gras", "nom", r"shampooing sec|dry shampoo|shampoing sec"),
    ("gras", "actif", r"\bargile\b|charbon|zinc pca|\bortie\b"),
    # ---- fins
    ("fins", "texte", r"cheveux fins|fine hair|thin hair|fine & thin|fine and thin|fine, thin"),
    ("fins", "texte", r"cheveux plats|limp hair|flat hair|cheveux sans volume"),
    ("fins", "texte", r"manque de volume|lack of volume|cheveux clairsemes|cheveux affines"),
    ("fins", "texte", r"fine to medium|won t weigh fine|weigh down fine"),
    ("fins", "texte", r"won t weigh .{0,14}down|sans alourdir|without weighing|weightless"),
    ("fins", "nom", r"volume|volumis|volumiz|epaississ|thicken|root lift|densifi"),
    # ---- epais
    ("epais", "texte", r"cheveux epais|\bthick hair\b|\bcoarse\b|thick/ ?coarse|thick, coarse"),
    ("epais", "texte", r"medium to thick|cheveux moyens a epais|gros cheveux"),
    # ---- boucles
    ("boucles", "texte", r"boucl|\bcurl|\bcurly\b|\bwavy\b|\bwaves\b|ondul|\bcoils?\b"),
    # ---- crepus
    ("crepus", "texte", r"crepu|\bcoily\b|kinky|\bafro\b|type 4|\b4[abc]\b"),
    ("crepus", "texte", r"\blocs\b|\bbraid|\btwists?\b|protective style"),
    # ---- lisses
    ("lisses", "texte", r"cheveux (lisses|raides)|straight hair|straight to wavy"),
    # ---- colores
    ("colores", "texte", r"cheveux colores|colou?r-treated|colou?r treated|colou?red hair"),
    ("colores", "texte", r"apres-coloration|post-coloration|cheveux teints"),
    ("colores", "texte", r"decolor|\bbleached\b|\bmeches\b|highlighted|high-lifted"),
    ("colores", "texte", r"safe for colou?r|colou?r-safe|haircolor|hair colou?r"),
    ("colores", "texte", r"cheveux blonds|blonde hair|blond hair|\bblondes\b"),
    ("colores", "categorie", r"^coloration-soin$"),
    # ---- abimes
    ("abimes", "texte", r"abime|damaged|endommage|fragilise|affaibli|weakened|sensitized"),
    ("abimes", "texte", r"\bcasse\b|cassant|breakage|fourche|split end|\bbrittle\b"),
    ("abimes", "texte", r"over-processed|chimiquement traites|poreux|\bporous\b"),
    ("abimes", "nom", r"\brepar|\brepair|reconstruct|restructur|\bbond|\bmend\b|rescue"),
    ("abimes", "categorie", r"^proteine-reconstruction$"),
    ("abimes", "actif", r"acide maleique|\bkeratine\b"),
    # ---- chute
    ("chute", "texte", r"chute de cheveux|anti-?chute|reduction chute|perte de cheveux"),
    ("chute", "texte", r"hair loss|hair fall|hairfall|shedding|alopec|thinning hair"),
    ("chute", "categorie", r"^traitement-chute$"),
    ("chute", "actif", r"cafeine|aminexil|minoxidil|redensyl|capixyl|procapil|stemoxydine|sandalore"),
    # ---- pellicules
    ("pellicules", "texte", r"pellicul|dandruff|squam|desquam"),
    ("pellicules", "categorie", r"^anti-pellicules$"),
    ("pellicules", "actif", r"piroctone|climbazole|pyrithione|ketoconazole|sulfure de selenium"),
    # ---- cuir chevelu sensible
    ("cuir-chevelu-sensible", "texte", r"cuir chevelu (tres )?sensible|sensitive scalp"),
    ("cuir-chevelu-sensible", "texte", r"irrit|demangeais|\bitch|rougeurs|scalp discomfort"),
    ("cuir-chevelu-sensible", "texte", r"psoriasi|dermite|seborrheique|cuir chevelu sec|dry scalp"),
    ("cuir-chevelu-sensible", "texte", r"apaise? le cuir|soothes? .{0,12}scalp|cuir chevelu reactif"),
    ("cuir-chevelu-sensible", "actif", r"bisabolol|allantoine|calendula|camomille"),
]
REGLES_CIBLES_C = [(c, ou, re.compile(m)) for c, ou, m in REGLES_CIBLES]

# Une cible peut aussi se deduire des promesses une fois celles-ci normalisees,
# quand la promesse ne peut s'adresser qu'a un type de cheveux : un soin qui
# promet du volume parle a des cheveux qui en manquent, un soin anti-pelliculaire
# parle d'un cuir chevelu qui pelle. Toutes les promesses listees doivent etre
# presentes pour que la cible soit posee (d'ou le couple hydratation+nutrition :
# « hydratant » tout seul est ecrit sur un tiers du catalogue et ne prouve rien).
REGLES_CIBLES_PAR_PROMESSE = OrderedDict([
    ("secs", ("hydratation", "nutrition")),
    ("fins", ("volume",)),
    ("chute", ("anti-chute",)),
    ("pellicules", ("antipelliculaire",)),
    ("cuir-chevelu-sensible", ("apaisant-cuir-chevelu",)),
    ("colores", ("protection-couleur",)),
    ("gras", ("anti-gras",)),
    ("boucles", ("definition-boucles",)),
])

# Paires qui ne peuvent pas etre vraies en meme temps SANS appui textuel.
# On ne retire QUE si la valeur de la fiche n'a aucun appui dans le texte ET
# que la valeur opposee en a un.
OPPOSES = {
    "epais": ("fins",),
    "fins": ("epais",),
    "secs": ("gras",),
    "gras": ("secs",),
    "lisses": ("boucles", "crepus"),
}

# DEUX valeurs ont ete posees par defaut par le collecteur et ne veulent rien
# dire. Mesure du 23/09 sur les 4 425 fiches, part des fiches portant la valeur
# ou le texte de la marque la confirme :
#     boucles 98 %   pellicules 91 %   abimes 82 %   chute 72 %   crepus 68 %
#     colores 61 %   gras 54 %   fins 51 %   cuir-chevelu-sensible 41 %
#     secs 37 %      ...mais epais 6 % et lisses 3 %.
# 855 fiches « epais » et 520 fiches « lisses » pour 59 et 20 confirmations :
# c'est le « convient a tous les cheveux » du collecteur, pas une cible. Et ce
# n'est pas neutre pour le moteur : composerRoutine met « epais » en contraire
# des cheveux fins et « lisses » en contraire des boucles (-1,6 chacun). Ces
# deux valeurs sont donc gardees SEULEMENT quand la fiche les dit vraiment.
CIBLES_POSEES_PAR_DEFAUT = ("epais", "lisses")


# =====================================================================
# 6) LECTURE / ECRITURE
# =====================================================================

def fichiers_marque():
    """Les fichiers <marque>.json, dans l'ordre. Les fichiers de travail
    (journal de detourage, _marques.json) sont ignores comme dans import.py :
    une fiche de marque, c'est un « brand » et une liste « products »."""
    out = []
    for nom in sorted(os.listdir(ICI)):
        if not nom.endswith(".json") or nom.startswith("_"):
            continue
        chemin = os.path.join(ICI, nom)
        try:
            d = json.load(open(chemin, encoding="utf-8"))
        except (ValueError, OSError):
            continue
        if isinstance(d, dict) and "brand" in d and isinstance(d.get("products"), list):
            out.append((chemin, d))
    return out


def ecrire_json(chemin, donnees):
    """Meme mise en forme que les fichiers existants : indent=1, accents gardes."""
    tmp = chemin + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(donnees, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, chemin)


# =====================================================================
# 7) LE TRAVAIL SUR UNE FICHE
# =====================================================================

def range_claim(valeur, suivi):
    """Une valeur brute de `claims` -> liste de promesses normalisees.

    Trois sorties possibles, toutes comptees dans le rapport :
      - table     : la valeur est dans TABLE_CLAIMS (eventuellement vers ())
      - lexical   : la valeur est une phrase libre ou l'on reconnait des mots controles
      - non_range : on n'y comprend rien -> la valeur est recopiee dans le rapport
    """
    brut = normalise(valeur)
    if not brut:
        return []
    if brut in TABLE_CLAIMS:
        suivi["table"][valeur] += 1
        return list(TABLE_CLAIMS[brut])
    trouve = []
    for promesse, motifs in MOTS_PROMESSE_C.items():
        if any(m.search(brut) for m in motifs):
            trouve.append(promesse)
    if trouve:
        suivi["lexical"][valeur] += 1
    else:
        suivi["non_range"][valeur] += 1
    return trouve


def deduit_promesses(texte):
    """Promesses lues dans un texte deja normalise."""
    return [p for p, motifs in MOTS_PROMESSE_C.items()
            if any(m.search(texte) for m in motifs)]


def deduit_cibles(textes, categorie, actifs_txt):
    """Cibles lues dans la fiche, avec la regle qui a declenche."""
    trouve = OrderedDict()
    for cible, ou, motif in REGLES_CIBLES_C:
        if ou == "nom":
            cible_txt = textes["nom"]
        elif ou == "texte":
            cible_txt = textes["texte"]
        elif ou == "actif":
            cible_txt = actifs_txt
        elif ou == "actifs2":
            # la regle ne vaut qu'a partir de deux occurrences distinctes
            if len(set(motif.findall(actifs_txt))) >= 2:
                trouve.setdefault(cible, "%s:%s" % (ou, motif.pattern))
            continue
        else:
            cible_txt = normalise(categorie)
        if motif.search(cible_txt):
            trouve.setdefault(cible, "%s:%s" % (ou, motif.pattern))
    return trouve


def traite(produit, suivi):
    """Enrichit une fiche EN PLACE. Renvoie un petit journal pour le rapport."""
    nom = produit.get("name") or ""
    desc = produit.get("description") or ""
    claims_avant = list(produit.get("claims") or [])
    cibles_avant = list(produit.get("cheveux_cibles") or [])
    actifs = produit.get("actifs") or []

    n_nom = sans_negations(normalise(nom))
    n_desc = sans_negations(normalise(desc))
    n_claims = sans_negations(normalise(" ; ".join(str(c) for c in claims_avant)))
    n_actifs = normalise(" ; ".join(str(a) for a in actifs))
    textes = {
        "nom": n_nom,
        # `texte` = ce que la marque ecrit sur le produit. Les ingredients (INCI)
        # en sont volontairement absents : « Sodium Lauryl Sulfate » ne dit pas
        # a qui le produit s'adresse.
        "texte": " | ".join([n_nom, n_desc, n_claims]),
        "tout": " | ".join([n_nom, n_desc, n_claims, n_actifs]),
    }

    # ---------- promesses
    promesses = []
    for valeur in claims_avant:
        for p in range_claim(valeur, suivi):
            if p not in promesses:
                promesses.append(p)
    promesses_de_la_fiche = list(promesses)
    # Une promesse lue dans le NOM du produit est une promesse assumee ; la meme
    # lue au milieu de 500 caracteres de prose ne l'est pas. On garde les deux
    # dans claims, mais seules les premieres ont le droit d'impliquer une cible
    # (sans ce partage, un apres-shampooing clarifiant qui promet « bounce and
    # fullness » en fin de paragraphe se retrouvait cible « cheveux fins »).
    promesses_fortes = set(promesses_de_la_fiche) | set(deduit_promesses(textes["nom"]))
    for p in deduit_promesses(textes["tout"]):
        if p not in promesses:
            promesses.append(p)
    promesses.sort(key=lambda p: RANG_PROMESSE[p])

    # ---------- cibles
    deduites = deduit_cibles(textes, produit.get("categorie") or "", n_actifs)
    for cible, requises in REGLES_CIBLES_PAR_PROMESSE.items():
        if all(r in promesses_fortes for r in requises):
            deduites.setdefault(cible, "promesse:" + "+".join(requises))
    cibles = [c for c in cibles_avant if c in RANG_CIBLE]
    hors_vocabulaire = [c for c in cibles_avant if c not in RANG_CIBLE]
    for c in hors_vocabulaire:
        suivi["cibles_hors_vocabulaire"][c] += 1

    # retrait des valeurs de fiche manifestement fausses
    retirees = []
    for c in list(cibles):
        if c in deduites:
            continue  # la fiche le dit ET le texte le confirme : on garde
        opposees = OPPOSES.get(c, ())
        if any(o in cibles_avant for o in opposees):
            # la fiche declare la valeur ET son contraire (« squames secs ou gras »,
            # un spray multi-usages donne pour lisses ET boucles) : c'est voulu.
            continue
        if c in CIBLES_POSEES_PAR_DEFAUT or any(o in deduites for o in opposees):
            cibles.remove(c)
            retirees.append(c)
            suivi["cibles_retirees"][c] += 1

    ajoutees = [c for c in deduites if c not in cibles]
    cibles.extend(ajoutees)
    cibles.sort(key=lambda c: RANG_CIBLE[c])

    a_change = bool(ajoutees or retirees or
                    [p for p in promesses if p not in promesses_de_la_fiche])

    produit["cheveux_cibles"] = cibles
    produit["claims"] = promesses
    produit["ciblage_source"] = "deduit" if a_change else "fiche"

    return {
        "id": produit.get("id"), "nom": nom,
        "cibles_avant": cibles_avant, "cibles_apres": cibles,
        "cibles_ajoutees": ajoutees, "cibles_retirees": retirees,
        "claims_avant": claims_avant, "claims_apres": promesses,
        "regles": [deduites[c] for c in ajoutees],
    }


# =====================================================================
# 8) MESURES AVANT / APRES
# =====================================================================

def mesures(produits):
    n = len(produits) or 1
    sans_cible = sum(1 for p in produits if not p.get("cheveux_cibles"))
    une_cible = sum(1 for p in produits if len(p.get("cheveux_cibles") or []) == 1)
    sans_promesse = sum(1 for p in produits if not p.get("claims"))
    rien = sum(1 for p in produits
               if not p.get("cheveux_cibles") and not p.get("claims"))
    distinctes = set()
    for p in produits:
        distinctes.update(p.get("claims") or [])
    # « signaux » = tout ce que composerRoutine peut exploiter sur une fiche :
    # une cible declaree + une promesse normalisee. C'est la vraie mesure de
    # richesse du catalogue, le compte de cibles seul ne dit pas tout.
    signaux = [len(p.get("cheveux_cibles") or []) + len(p.get("claims") or [])
               for p in produits]
    return OrderedDict([
        ("produits", len(produits)),
        ("sans_cible", sans_cible),
        ("sans_cible_pct", round(100.0 * sans_cible / n, 1)),
        ("une_seule_cible", une_cible),
        ("une_seule_cible_pct", round(100.0 * une_cible / n, 1)),
        ("sans_promesse", sans_promesse),
        ("sans_promesse_pct", round(100.0 * sans_promesse / n, 1)),
        ("ni_cible_ni_promesse", rien),
        ("claims_valeurs_distinctes", len(distinctes)),
        ("signaux_moyens_par_fiche", round(sum(signaux) / float(n), 2)),
        ("fiches_a_moins_de_2_signaux", sum(1 for s in signaux if s < 2)),
    ])


def tableau(colonnes):
    """colonnes : liste de (titre, dict de mesures)."""
    cles = list(colonnes[0][1].keys())
    lignes = [["mesure"] + [t for t, _ in colonnes]]
    for cle in cles:
        lignes.append([cle] + [str(d[cle]) for _, d in colonnes])
    larg = [max(len(l[i]) for l in lignes) for i in range(len(lignes[0]))]
    out = []
    for i, l in enumerate(lignes):
        out.append("  ".join(l[j].ljust(larg[j]) for j in range(len(l))).rstrip())
        if i == 0:
            out.append("  ".join("-" * w for w in larg))
    return "\n".join(out)


# =====================================================================
# 9) MAIN
# =====================================================================

def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--essai", action="store_true",
                    help="tout calculer et tout compter, sans ecrire un seul fichier")
    ap.add_argument("--applique", action="store_true",
                    help="ecrire les fichiers de marque et public/scan/catalogue-cheveux/all.json")
    ap.add_argument("--rapport", default=RAPPORT_DEFAUT,
                    help="ou ecrire le rapport JSON (defaut : catalogue-cheveux/_rapport_ciblage.json)")
    a = ap.parse_args()
    if a.essai == a.applique:
        ap.error("choisis --essai OU --applique.")

    marques = fichiers_marque()
    if not marques:
        sys.stderr.write("ARRET : aucun fichier de marque lu dans %s\n" % ICI)
        sys.exit(2)
    if not os.path.exists(ALL_JSON):
        sys.stderr.write("ARRET : %s est introuvable.\n" % ALL_JSON)
        sys.exit(2)

    produits = [p for _, d in marques for p in d["products"]]
    avant = mesures(produits)

    suivi = {"table": Counter(), "lexical": Counter(), "non_range": Counter(),
             "cibles_hors_vocabulaire": Counter(), "cibles_retirees": Counter()}
    journal = [traite(p, suivi) for p in produits]
    apres = mesures(produits)
    # Colonne intermediaire honnete : l'avant une fois retirees les valeurs que le
    # collecteur avait posees par defaut (epais, lisses) et que rien ne confirme.
    # Sans elle le tableau ment : « sans cible » remonte mecaniquement alors que
    # ces fiches n'avaient en realite jamais eu de cible.
    avant_net = mesures([
        {"cheveux_cibles": [c for c in j["cibles_avant"] if c not in j["cibles_retirees"]],
         "claims": j["claims_avant"]} for j in journal])

    # --- rapport
    rapport = OrderedDict([
        ("genere_par", "catalogue-cheveux/enrichit_ciblage.py"),
        ("mode", "essai" if a.essai else "applique"),
        ("avant", avant),
        ("avant_hors_valeurs_posees_par_defaut", avant_net),
        ("apres", apres),
        ("promesses_vocabulaire", list(PROMESSES)),
        ("cibles_vocabulaire", list(CIBLES)),
        ("claims_ranges_par_la_table", OrderedDict(
            (k, v) for k, v in suivi["table"].most_common())),
        ("claims_ranges_par_repli_lexical", OrderedDict(
            (k, v) for k, v in suivi["lexical"].most_common())),
        # LE POINT IMPORTANT : ce qui n'a pas ete range n'est pas invente, il est ici.
        ("claims_NON_RANGES", OrderedDict(
            (k, v) for k, v in suivi["non_range"].most_common())),
        ("cibles_hors_vocabulaire", dict(suivi["cibles_hors_vocabulaire"])),
        ("cibles_retirees_car_contredites", dict(suivi["cibles_retirees"])),
        ("repartition_promesses", OrderedDict(
            Counter(p for j in journal for p in j["claims_apres"]).most_common())),
        ("repartition_cibles", OrderedDict(
            Counter(c for j in journal for c in j["cibles_apres"]).most_common())),
        ("fiches_sans_aucun_signal", [
            {"id": j["id"], "nom": j["nom"]}
            for j in journal if not j["cibles_apres"] and not j["claims_apres"]]),
        ("ciblage_source", OrderedDict(
            Counter(p.get("ciblage_source") for p in produits).most_common())),
    ])
    with open(a.rapport, "w", encoding="utf-8") as f:
        json.dump(rapport, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(tableau([("avant", avant), ("avant hors defauts", avant_net), ("apres", apres)]))
    print()
    print("claims ranges par la table       : %d valeurs distinctes" % len(suivi["table"]))
    print("claims ranges par repli lexical  : %d valeurs distinctes" % len(suivi["lexical"]))
    print("claims NON RANGES (dans le rapport, rien n'a ete invente) : %d valeurs distinctes, %d occurrences"
          % (len(suivi["non_range"]), sum(suivi["non_range"].values())))
    print("cibles retirees car contredites par le texte : %s" % dict(suivi["cibles_retirees"]))
    print("fiches sans aucun signal apres passage : %d" % len(rapport["fiches_sans_aucun_signal"]))
    print("rapport : %s" % os.path.relpath(a.rapport, RACINE))

    if a.essai:
        print("\n--essai : aucun fichier du catalogue n'a ete modifie.")
        return

    # --- ecriture : fichiers de marque, puis all.json
    for chemin, d in marques:
        ecrire_json(chemin, d)
    par_id = {p["id"]: p for p in produits}
    tout = json.load(open(ALL_JSON, encoding="utf-8"))
    manquants = 0
    for p in tout["products"]:
        src = par_id.get(p.get("id"))
        if not src:
            manquants += 1
            continue
        # On ne recopie QUE les trois champs du ciblage. Prix, URL, images :
        # on n'y touche pas, meme pas pour les recopier.
        p["cheveux_cibles"] = list(src["cheveux_cibles"])
        p["claims"] = list(src["claims"])
        p["ciblage_source"] = src["ciblage_source"]
    ecrire_json(ALL_JSON, tout)
    print("\necrit : %d fichiers de marque + public/scan/catalogue-cheveux/all.json" % len(marques))
    if manquants:
        print("  ! %d fiches de all.json sans equivalent dans les fichiers de marque" % manquants)
    print("pense a regenerer les CSV : python3 catalogue-cheveux/supabase/import.py --csv")


if __name__ == "__main__":
    main()
