# Catalogue v2 — règles communes (17/09/2026)

But : ~5 000 produits de SOIN VISAGE, tous réellement en vente, chacun avec un lien qui ouvre la VRAIE fiche produit sur le site OFFICIEL de la marque.

## Format d'un produit (JSON, un fichier par marque : <dossier>/<slug>.json = {"brand": slug, "brand_name": ..., "products": [...]})
{
  "id": "<slug-marque>--<slug-produit>",
  "name": "nom exact tel que sur le site officiel",
  "brand": "<slug>", "brand_name": "<nom>",
  "url": "URL officielle de la fiche produit (HTTP 200, page produit, PAS la page d'accueil, PAS une catégorie)",
  "url_verifiee_le": "2026-09-17",
  "price_eur": nombre ou null,  "price_source": "site officiel FR" | "site officiel EU" | "converti USD 0.92 le 17/09" | null,
  "image_source_url": "URL de l'image officielle",
  "image_local": "public/scan/products/<slug>/<fichier>.jpg" (téléchargée, 600 px de large max, JPEG qualité 82),
  "categorie": "nettoyant|lotion|serum|creme|contour-yeux|masque|exfoliant|huile|solaire-visage|autre-visage",
  "ingredients": "liste INCI si disponible, sinon null",
  "description": "texte officiel court (500 caractères max) si disponible",
  "claims": ["mots-clés marketing trouvés : hydratant, anti-rides, éclat, apaisant, anti-imperfections, anti-taches, matifiant, raffermissant..."],
  "source": "sitemap|products.json|json-ld|page"
}

## Interdits
- Rien qui n'est pas du soin VISAGE : pas de maquillage, parfum, corps, cheveux, lèvres seules, compléments, appareils, alimentation, coffrets, recharges, minis/tailles voyage (garder la taille standard), échantillons.
- Pas de doublons (même produit en plusieurs tailles = 1 produit).
- Pas de lien vers un revendeur (Sephora, Notino, pharmacies en ligne…) : SEULEMENT le site officiel de la marque. Si le site officiel est inaccessible pour toi, n'invente pas de lien : mets le produit dans <dossier>/_bloques/<slug>.json avec la raison.
- Ne jamais toucher à Sothys (aucune lecture, aucun scraping).
- Ne rien modifier dans public/scan/catalogue/ ni ailleurs dans le site : écrire UNIQUEMENT dans catalogue-v2/ et télécharger les images UNIQUEMENT dans public/scan/products/<slug>/v2/.
- Politesse réseau : 1 requête/seconde max par domaine, en-têtes Chrome complets (User-Agent, Accept, Accept-Language fr-FR, sec-ch-ua, Sec-Fetch-*), respecter les 429 (attendre).
- Disque presque plein (6 Go libres) : images redimensionnées, aucun fichier HTML brut conservé, supprimer les fichiers temporaires.
- Aucun commit, aucun déploiement, aucun envoi vers Supabase.

## Vérification d'un lien (obligatoire pour CHAQUE produit gardé)
GET avec redirections suivies → code 200 ET l'URL finale n'est pas la page d'accueil ni une catégorie ET la page contient le nom du produit (ou son JSON-LD Product). Un produit dont la fiche n'existe plus = produit retiré (plus en vente) → ne pas le garder.
