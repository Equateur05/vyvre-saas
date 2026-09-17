# Journal — nouvelles marques (catalogue v2)

Dernière mise à jour : 17/09/2026. 44 marques, 1832 produits. Sources : products.json (Shopify), sitemaps + JSON-LD/microdonnées, pages catégories. Chaque fiche gardée a été ouverte (HTTP 200, pas l'accueil, nom ou JSON-LD Product présent). Nettoyage ensuite : maquillage, corps, coffrets/routines, minis, recharges, soins en cabine, doublons de taille (on garde le plus grand format) retirés à la main par marque.

## Marques ajoutées

| Marque | Univers | Pays | Produits | Prix |
|---|---|---|---|---|
| Absolution | normal | FR | 23 | oui |
| Aime | normal | FR | 8 | oui |
| AXIS-Y | petit-prix | KR | 24 | oui |
| BYOMA | petit-prix | GB | 20 | oui |
| Cattier | petit-prix | FR | 34 | oui |
| Cellcosmet | luxe | CH | 34 | oui |
| Chantecaille | luxe | FR | 35 | oui |
| Clé de Peau Beauté | luxe | JP | 29 | oui |
| Codage | normal | FR | 44 | oui |
| Collistar | normal | IT | 60 | oui |
| Comfort Zone | normal | IT | 66 | oui |
| Darphin | luxe | FR | 58 | oui |
| Dermalogica | normal | US | 67 | oui |
| Elizabeth Arden | normal | US | 53 | oui |
| Erno Laszlo | luxe | US | 17 | oui |
| Garnier | petit-prix | FR | 63 | non (null) |
| Givenchy Beauty | luxe | FR | 3 | oui |
| Guinot | luxe | FR | 93 | oui |
| Haruharu Wonder | petit-prix | KR | 24 | oui |
| heimish | petit-prix | KR | 30 | oui |
| Ho Karan | normal | FR | 9 | oui |
| Institut Esthederm | luxe | FR | 49 | oui |
| IOMA Paris | luxe | FR | 36 | oui |
| ISDIN | pharmacie | ES | 34 | non (null) |
| KIKO Milano | petit-prix | IT | 58 | oui |
| La Mer | luxe | US | 30 | oui |
| La Rosée | pharmacie | FR | 16 | oui |
| Lancaster | normal | MC | 33 | non (null) |
| ma:nyo | petit-prix | KR | 45 | oui |
| Mary Cohr | luxe | FR | 76 | oui |
| Medik8 | normal | GB | 51 | oui |
| Melvita | normal | FR | 46 | oui |
| mixsoon | petit-prix | KR | 60 | oui |
| NIVEA | petit-prix | DE | 66 | non (null) |
| Omorovicza | luxe | HU | 40 | oui |
| Patyka | normal | FR | 46 | oui |
| Pixi | petit-prix | GB | 60 | oui |
| Polaar | normal | FR | 16 | oui |
| Respire | normal | FR | 18 | oui |
| Seasonly | normal | FR | 16 | oui |
| SENSAI | luxe | JP | 53 | non (null) |
| Sesderma | pharmacie | ES | 65 | oui |
| Typology | normal | FR | 77 | oui |
| Weleda | normal | CH | 47 | oui |

## Notes par marque
- Prix convertis USD x 0,92 (le 17/09) : Omorovicza, Pixi, BYOMA, Chantecaille, Cellcosmet, AXIS-Y, mixsoon, Haruharu Wonder, ma:nyo, heimish (pas de boutique EU accessible : pixibeauty.eu et byoma.eu renvoient un défi anti-robot).
- Sans prix (site vitrine) : NIVEA, Garnier, ISDIN (France), Lancaster, SENSAI.
- Typology : fr.typology.com refuse la connexion TLS, le site FR est www.typology.com ; images via medias.typology.com (media.typology.com renvoie 403).
- Collistar, Givenchy : pagination interdite par robots.txt, union des sous-catégories.
- La Mer : prix = premier format affiché. Darphin : 8 fiches sans image et en « BackOrder » retirées (probablement arrêtées).
- Dermalogica : les « pro … » (soins en institut, type TRAITEMENT) retirés.

## Bloquées / non faites
- Givenchy Beauty : 3 produits seulement. Akamai sert un défi comportemental (sec-if-cpt) après ~5 requêtes ; toujours actif 30 min plus tard. Les 26 autres fiches sont listées dans _bloques/givenchy-beauty.json. Pas de Chrome headless lancé : ce serait contourner un défi anti-robot.
- Erborian : défi DataDome dès la page d'accueil.
- Biotherm, L'Oréal Paris, Carita : défi Cloudflare / anti-robot (403).
- Laboratoires Vendôme, Garancia, Institut Arnaud, Novexpert : connexion refusée ou délai dépassé.
- Rilastil : pas de sitemap exploitable ni de prix ; Natura Bissé : pas de site FR, pas d'URL produit dans le sitemap ; Elemis : prix non présent dans la page ; Rodial, Zelens : boutique en GBP seulement ; Lavera : site en allemand seulement. Non faites.
