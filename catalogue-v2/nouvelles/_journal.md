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

---

## Passe du 19/09/2026 — completion des marques maigres

Objet : les 13 marques du catalogue peau sous 10 produits.

| marque | avant | apres | issue |
|---|---:|---:|---|
| guerlain | 1 | 1 | **bloquee** — guerlain.com repond 403 partout (FR, BE, CH, CA, UK, US, DE, IT), sitemaps declares par robots.txt compris, OCAPI compris. Les domaines nationaux qui repondent 200 ne sont pas la marque (domaines parques). guerlain.com.cn est bien officiel mais c'est une SPA : le HTML servi ne contient ni nom, ni prix, ni image. Rien contourne. Detail : `nouvelles/_bloques/guerlain.json`. |
| givenchy-beauty | 3 | 3 | **bloquee** — givenchybeauty.com 403 ; m.givenchybeauty.com/fr/fr repond 410 ; givenchybeauty.de et .it repondent 200 mais sont de faux outlets, pas LVMH ; givenchy.com n'a aucune page beaute. Detail : `nouvelles/_bloques/givenchy-beauty.json`. |
| u-beauty | 3 | 3 | **bloquee** — Cloudflare 403 sur tout ubeauty.com, y compris les fiches deja servies. Detail : `nouvelles/_bloques/u-beauty.json`. |
| lyma | 3 | 4 | gamme visage reelle = 3 soins (serum, creme, mist) ; le reste est laser, complement, recharge ou accessoire. |
| oneskin | 3 | 5 | gamme visage reelle = 5 produits ; les 76 autres entrees sont corps, levres, cheveux, doublons d'abonnement, recharges, minis et lots. |
| senka | 4 | 11 | onlineshop.finetoday.com (Fine Today, officiel). Noms officiels japonais + `name_fr` : c'est le `name_fr` qui s'affiche, comme pour les 6 fiches deja presentes. |
| wishful | 5 | 5 | la collection FR officielle contient exactement les 5 fiches deja servies. |
| mustela | 6 | 8 | **la gamme VISAGE de Mustela fait reellement 8 produits.** Sur 90 references, tout le reste est corps, bain, cheveux, maternite, solaire corps ou accessoire. |
| aime | 8 | 6 | ligne visage deja complete ; 2 fiches hors sujet retirees (sticks a boire = complement, patchs yeux reutilisables = accessoire). |
| rhode | 9 | 9 | catalogue soin visage deja complet sur 112 references ; le reste est levres, maquillage et variantes de packaging. |
| glossier | 9 | 13 | bascule sur la boutique francophone glossier.com/fr-fr (prix en euros reels, plus de conversion GBP). 2 images « no-image » reparees au passage. |
| ho-karan | 9 | 11 | ecartes : huiles sublinguales CBD, infusion, ebook, brume d'interieur, duos et routine. |
| hada-labo | 4 | 31 | jp.rohto.com (proprietaire de la marque), noms officiels japonais + `name_fr`, images officielles. **25 fiches sur 26 sans prix** : Rohto affiche « オープン価格 » (prix libre laisse au revendeur), pas un montant. Le site europeen hadalabotokyo.pl offre 38 fiches de plus mais n'affiche aucun prix et ses images sont injoignables (TLS refuse sur media.dax.com.pl) : elles sont parquees telles quelles dans `nouvelles/_bloques/hada-labo-eu.json`. |

Autres corrections de cette passe :
- **344 noms tronques repares** (« ... with Hyal… »). Le nom complet etait deja dans les fichiers bruts ; c'est `sortie/` qui etait en retard sur eux. La refusion les a restaures.
- **`norm_name()` effacait les kana et les kanji** : 8 produits Senka se reduisaient tous a la cle `f` ou `fa` (le suffixe de formule) et fusionnaient en 2. Les caracteres japonais sont desormais conserves, et une cle de moins de 3 caracteres ne sert plus a dedoublonner.
- **Prix > 500 EUR ou < 2 EUR, 90 fiches revues une par une** sur la page officielle : aucune n'etait fausse. Les prix eleves de La Prairie, Dior, Valmont, Sisley et La Mer sont reels (celui de La Mer est confirme par son prix au litre), les masques coreens a 0,99 EUR aussi. 6 ecarts de quelques euros mis a jour. 17 fiches non revues parce que leur site repond 403.
- **Aucun coffret ni parfum** dans le catalogue peau : les 47 noms suspects verifies sont des noms de gamme (« Skin Regimen », « Skin essentials », « AC Collection », « The Ritual of Karma ») ou le mot coreen « Pack » qui designe un masque.
