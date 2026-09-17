# Journal AJOUTS catalogue v2 (2026-09-17)

Produits de soin visage ajoutes (hors ceux deja dans public/scan/catalogue/all.json). Total garde : **3408**.

trouves = produits vus sur le site officiel ; deja = deja au catalogue ; exclus = pas soin visage / mini / coffret / doublon / lien KO ; bloques = produits ou site inaccessibles.

| marque | source | trouves | deja | exclus | gardes | bloques | note |
|---|---|---|---|---|---|---|---|
| 111skin | products.json | 79 | 20 | 43 | 16 | 0 | products.json + prix EUR du marche en-eu (.js) |
| a-derma | sitemap aderma.fr + json-ld | 72 | 9 | 38 | 25 | 0 | sitemap aderma.fr/fr-fr ; prix null : aderma.fr ne vend pas en ligne (renvoi revendeurs) ; INCI onglet Composition |
| aesop | sitemap aesop.fr + pages soins de la peau (Chrome) | 43 | 23 | 3 | 17 | 0 | aesop.com redirige vers aesop.fr (Cloudflare : Chrome) ; correspondance manuelle FR/EN par code SK |
| anua | products.json | 95 | 7 | 39 | 49 | 0 | anua.com Shopify US, collections par routine, USD converti |
| augustinus-bader | products.json | 61 | 12 | 38 | 11 | 0 | products.json marche en-eu, prix EUR (.js) |
| avene | sitemap product.xml + json-ld | 162 | 5 | 79 | 78 | 0 | sitemap product.xml (fiches /p/) ; prix null : eau-thermale-avene.fr ne vend pas en ligne (bouton Acheter = revendeurs) ; INCI onglet Composition ; relecture manuelle corps/enfant/doublons |
| barbara-sturm | sitemap US (USD converti) | 327 | 16 | 281 | 30 | 0 | drsturm.com (pas de boutique EU accessible) : prix USD convertis ; sitemap filtre |
| beauty-of-joseon | products.json | 57 | 13 | 32 | 12 | 0 | beautyofjoseon.com Shopify, collections soin, USD converti |
| beauty-pie | products.json | 163 | 4 | 99 | 60 | 0 | beautypie.com UK (GBP converti, prix non-membre du JSON-LD) ; collections soin visage, type Skincare ; 4 produits reconnus deja au catalogue sous un ancien nom |
| bioderma | sitemap | 133 | 32 | 58 | 43 | 0 | sitemap + rubrique Soin visage (hors sprays/laits corps) produits bioderma.fr (Crealine = Sensibio en France) ; nom = h1, INCI et description lus sur la fiche ; Sensibio = Crealine : fiches reintegrees tant que verif ne les retient pas |
| biologique-recherche | products.json | 85 | 25 | 14 | 46 | 0 | Shopify biologique-recherche.com/fr-fr (EUR), handles de la collection soins-visage (collection products.json vide) ; sets, maquillage (serums teintes, concealers), levres seules, cils exclus |
| bobbi-brown | sitemap FR | 23 | 4 | 9 | 10 | 0 | sitemap bobbibrowncosmetics.fr rubrique soin (EUR) ; noms FR, deja rapproches a la main (Hydratant Visage, Base Vitaminee Yeux) |
| bubble-skincare | products.json | 62 | 5 | 37 | 20 | 0 | hellobubble.com products.json (USD converti) ; nom complete depuis la description quand elle le donne |
| caudalie | sitemap | 118 | 34 | 67 | 17 | 0 | sitemap fr.caudalie.com (fiches /p/), fil d Ariane Visage ; nom = gamme + nom de la fiche ; rapprochements par nom annules sauf URL retenue par verif |
| cerave | sitemap cerave.fr + json-ld | 41 | 8 | 11 | 22 | 0 | sitemap cerave.fr (fiches /nos-produits/...) ; prix null : pas de prix sur les fiches cerave.fr (vente renvoyee aux revendeurs) |
| cetaphil | sitemap US | 59 | 8 | 19 | 32 | 0 | sitemap cetaphil.com/us ; prix null : le site officiel ne vend pas en direct (boutons vers revendeurs) ; gammes corps exclues |
| chanel | sitemap chanel.com/fr (URLs /fr/soins/p/) ; fiches bloquees | 141 | 28 | 66 | 0 | 47 | BLOQUE : chanel.com protege par Akamai (defi JS puis 403 meme en Chrome) ; 47 URLs soin visage du sitemap FR non presentes au catalogue listees dans _bloques/chanel.json (nom depuis l URL, non verifiees) |
| charlotte-tilbury | pages categorie soins visage + fiches (donnees Next.js) | 145 | 11 | 122 | 12 | 0 | site /fr (EUR) ; donnees produit Next.js ; minis/recharges/coffrets exclus |
| clarins | page categorie soin visage + json-ld | 106 | 6 | 13 | 87 | 0 | source: listings clarins.fr/soins-visage/200 (124 tuiles) + soin visage homme 531 ; fiches JSON-LD ; INCI non expose en HTML |
| clinique | sitemap FR | 333 | 6 | 234 | 93 | 0 | sitemap clinique.fr (EUR), filtre par fil d Ariane soin ; noms FR, deja rapproches a la main ; prix = taille standard estimee (offre mediane, les tailles ne sont pas dans le JSON-LD) ; 137 fiches en 403 temporaire re-visitees |
| cosrx | products.json | 174 | 9 | 116 | 49 | 0 | www.cosrx.com Shopify products.json (USD converti) ; exclus : 404 (fiches retirees), epuises, cadeaux offerts, lots/duos, variantes CPNP |
| curel | us.curel.com + curel.com/en-gb | 28 | 11 | 3 | 14 | 0 | us.curel.com (boutique officielle Kao USA, USD converti) + curel.com/en-gb pour les produits absents des US (prix null : le site UK ne vend pas en direct) ; corps et lots exclus |
| decleor | products.json | 28 | 0 | 0 | 28 | 0 | Shopify decleor.com, collections soins visage (duos/routines/corps exclus) |
| dior | sitemap fr_fr/beauty + json-ld | 370 | 13 | 303 | 54 | 0 | sitemap fr_fr/beauty (fiches dont le fil d ariane = Le Soin) + soins visage Sauvage Mencare ; recharges/coffrets/corps/bebe exclus ; doublons approchants (anciens noms Capture Totale) exclus a la main |
| diptyque | products.json diptyqueparis.com | 395 | 0 | 395 | 0 | 0 | aucun soin visage en vente : boutique Shopify = bougies/parfums/corps/mains ; les 5 fiches du catalogue actuel (/fr_fr/p/...) renvoient 404 |
| dr-dennis-gross | sitemap US | 51 | 8 | 18 | 25 | 0 | sitemap drdennisgross.com (US, USD converti) ; noms complets via og:title ; tailles voyage et doublons de SKU exclus ; appareils LED/vapeur et autobronzants exclus |
| drunk-elephant | sitemap US | 35 | 3 | 17 | 15 | 0 | sitemap drunkelephant.com (USD converti) ; le sitemap ne liste que ~35 fiches soin |
| ducray | sitemap ducray.com/fr-fr + json-ld | 79 | 5 | 54 | 20 | 0 | sitemap ducray.com/fr-fr ; prix null : pas de vente en ligne sur le site (renvoi revendeurs) ; INCI onglet Composition |
| embryolisse | products.json | 89 | 15 | 57 | 17 | 0 | Shopify embryolisse.fr products.json complet, exclusions explicites (maquillage, lots, corps, minis) |
| estee-lauder | sitemap FR | 357 | 7 | 279 | 71 | 0 | sitemap esteelauder.fr (EUR), noms FR, deja rapproches a la main ; prix = taille standard estimee (offre mediane) ; 216 fiches en 403 temporaire re-visitees |
| etude-house | sitemap | 216 | 10 | 166 | 40 | 0 | int.etude.com (site global officiel WooCommerce), sitemap produits filtre skin-care/cleanser/sun-care/mask-pack ; maquillage/ongles/outils exclus par categorie ; USD converti |
| eucerin | sitemap | 99 | 1 | 46 | 52 | 0 | sitemap eucerin.fr (/nos-produits/gamme/produit) ; eucerin.fr ne vend pas en ligne : aucun prix officiel affiche -> price_eur null |
| fenty-skin | products.json | 47 | 1 | 30 | 16 | 0 | fentybeauty.com (Shopify, marche en-fr) collections skincare ; prix EUR lu sur la fiche (og:price) sinon USD converti ; anciennes URL /fenty-skin/... en 404 |
| filorga | products.json | 58 | 6 | 5 | 47 | 0 | Shopify fr.filorga.com (euros, prix du jour), collections soin visage ; minis/coffrets/protocoles exclus |
| fresh | sitemap fresh.com/int (France, EUR) | 39 | 4 | 15 | 20 | 0 | fresh.com/int/fr/en (site officiel international, livraison France, EUR) ; fresh.com/us et /fr bloques (Akamai Access Denied) ; une taille par produit (Full Size si indiquee, sinon mediane), les autres tailles comptees en exclus |
| galenic | products.json | 31 | 0 | 19 | 12 | 0 | Shopify galenic.com (prix EUR), catalogue complet filtre (services, echantillons, rituels, corps exclus) |
| glossier | products.json | 23 | 6 | 10 | 7 | 0 | uk.glossier.com (GBP converti), collections skincare, type Skincare seulement |
| glow-recipe | products.json | 129 | 7 | 103 | 19 | 0 | glowrecipe.com products.json, prix EUR (JSON-LD). Hue Drops/Dewy Flush (teintes) exclus |
| guerlain | pages categorie soin (JSON-LD ItemList) ; fiches produit bloquees | 86 | 12 | 34 | 0 | 40 | BLOQUE : fiches /p/ protegees par Akamai (defi JS + 403 en Chrome) ; 40 produits soin visage candidats listes depuis les pages categorie dans _bloques/guerlain.json (nom, URL, prix categorie), non verifies |
| hada-labo | products.json | 7 | 6 | 1 | 0 | 0 | hadalabotokyo.com Shopify (US), 7 produits dont 6 deja au catalogue, USD converti |
| helena-rubinstein | sitemap site international (int) | 29 | 12 | 1 | 16 | 0 | site officiel international (/int/) = vitrine SANS prix ni vente en ligne (aucune version FR) : price_eur null ; noms anglais |
| horace | pages categorie visage FR | 50 | 18 | 28 | 4 | 0 | horace.com/fr, liens des pages categorie Visage (menu inclus, filtres) |
| innisfree | products.json | 94 | 6 | 52 | 36 | 0 | us.innisfree.com Shopify, collections soin, USD converti |
| kiehls | sitemap US (Chrome) | 68 | 7 | 27 | 34 | 0 | kiehls.com (US) via Chrome : kiehls.fr bloque par Cloudflare meme en Chrome ; sitemap US partiel (~68 fiches soin) ; USD converti ; prix = taille standard (offre mediane) ; images telechargees via Chrome |
| klairs | products.json | 88 | 6 | 59 | 23 | 0 | www.klairs.com Shopify, seulement vendor Klairs (Wishtrend/Im from exclus), USD converti |
| klorane | sitemap klorane.com/fr-fr + json-ld | 113 | 1 | 103 | 9 | 0 | sitemap klorane.com/fr-fr, visage uniquement ; prix null : pas de prix sur le site ; INCI onglet Composition |
| la-prairie | products.json | 92 | 18 | 44 | 30 | 0 | Shopify laprairie.com/fr-fr (EUR) ; nom du site prefixe de la ligne (Skin Caviar, Pure Gold...) car les titres FR sont nus ("CRÈME") ; coffrets/duos/recharges exclus ; doublons EN du catalogue existant exclus a la main |
| la-roche-posay | sitemap laroche-posay.be (fiches FR) | 158 | 20 | 93 | 45 | 0 | laroche-posay.fr derriere un challenge anti-robot Cloudflare (403) : non contourne ; source = site officiel La Roche-Posay Belgique en francais (laroche-posay.be/fr-be), fiches sans prix -> price null |
| lancome | sitemap produits + categories soin (Chrome) | 112 | 5 | 51 | 56 | 0 | lancome.fr via Chrome (get() = 403) : sitemap produits + categories soin ; prix = prix barre (hors promo) de la taille affichee par defaut, sinon prix affiche ; recharges/coffrets/duos/editions limitees exclus |
| laneige | products.json | 96 | 7 | 71 | 18 | 0 | us.laneige.com Shopify, collections soin visage, USD converti ; levres et maquillage exclus |
| lierac | sitemap | 149 | 2 | 102 | 45 | 0 | sitemap fr.lierac.com (fiches /p/) ; coffrets, recharges, minis, corps exclus par code article ; nom = gamme + produit |
| liz-earle | sitemap | 105 | 11 | 68 | 26 | 0 | www.lizearle.com (boutique internationale en EUR) : sitemap produits + pages categorie soin visage ; tailles fusionnees, kits/duos exclus |
| loccitane | sitemap FR .xml.gz + page tous les soins visage | 43 | 3 | 0 | 0 | 40 | BLOQUE DataDome : candidats (URL officielles non verifiees) dans _bloques/loccitane.json |
| lyma | products.json | 27 | 2 | 25 | 0 | 0 | products.json ; seuls 2 soins visage vendus, deja au catalogue sous leur ancien nom |
| medicube | products.json | 317 | 12 | 228 | 77 | 0 | medicube.us Shopify, collections soin (appareils AGE-R, sets, corps, cheveux exclus), USD converti |
| mediheal | products.json | 129 | 4 | 43 | 82 | 0 | mediheal.com Shopify US ; masques en feuille : reference standard (boite), USD converti |
| mixa | sitemap | 44 | 1 | 15 | 28 | 0 | sitemap mixa.fr (rubriques visage + solaire visage) ; mixa.fr ne vend pas en ligne : aucun prix officiel -> price_eur null |
| mizon | page | 104 | 6 | 5 | 93 | 0 | themizon.com N EST PAS officiel (blog vape/coque telephone) : non utilise ; source = boutique officielle coreenne pfdbrand.co.kr (Mizon & Village 11 Factory), noms coreens, KRW converti ; categories cleansing/toner/ampoule/lotion/creme/masque/solaire |
| murad | products.json | 48 | 6 | 9 | 33 | 0 | murad.com Shopify, collections soin visage (USD converti) ; exclus : kits/bundles, tailles voyage/valeur, recharges, complements, corps |
| mustela | products.json | 90 | 7 | 78 | 5 | 0 | Shopify mustela.fr : seuls les soins du visage (bebe/famille) gardes apres revue manuelle des 90 fiches |
| neutrogena | sitemap US | 246 | 12 | 59 | 175 | 0 | sitemap neutrogena.com (US) ; prix null : le site officiel ne publie aucun prix (achat renvoye vers revendeurs) ; noms US avec tailles retirees |
| noble-panacea | sitemap -> pages fr-fr (EUR) | 43 | 15 | 22 | 6 | 0 | noblepanacea.com/fr-fr ; recharges et formats 7 doses exclus |
| nuxe | products.json | 105 | 10 | 34 | 61 | 0 |  |
| olay | products.json | 81 | 6 | 6 | 69 | 0 | olay.com Shopify collection all-face-skincare (USD converti) ; exclus : lots, coffrets, minis, corps |
| oneskin | products.json | 81 | 7 | 73 | 1 | 0 | products.json, prix EUR (.js) |
| origins | sitemap US | 56 | 6 | 2 | 48 | 0 | sitemap origins.com rubrique skincare (USD converti) ; noms complets via og:title ; prix = taille standard (offre mediane) |
| orveda | products.json | 61 | 1 | 37 | 23 | 0 | products.json eu.orveda.com (FR, EUR) |
| paulas-choice | sitemap FR | 113 | 4 | 39 | 70 | 0 | paulaschoice.fr sitemap produits /fr/ (EUR, prix standard hors promo lu dans la page, pas de JSON-LD) ; deja rapproches a la main (BHA 2% liquide, C15, Niacinamide 10%, Resist SPF50) |
| payot | products.json | 79 | 7 | 8 | 64 | 0 | Shopify payot.com (EUR, FR) : union des collections soin visage moins coffrets/corps/levres/cheveux/echantillons ; nom prefixe de la ligne Payot (product_type) quand elle existe |
| pyunkang-yul | sitemap | 224 | 12 | 194 | 18 | 0 | pyunkangyul.us detourne (redirige vers un site de streaming xoilac, jamais utilise) ; source = boutique officielle cafe24 en.pyunkangyul.com (numeros produits du sitemap pyunkangyul.com), USD converti |
| revive | products.json | 96 | 30 | 42 | 24 | 0 | products.json ; noms du site au format "Nom / sous-titre" |
| rhode | products.json | 112 | 4 | 103 | 5 | 0 | rhodeskin.com products.json (USD converti) ; levres, blush, bronze, highlight milk (teinte), sets exclus ; spotwear/eye prep = 1 produit (motifs) |
| rituals | sitemap | 228 | 0 | 188 | 40 | 0 | rituals.com/fr-fr : sitemap FR (URLs manifestement hors visage ecartees avant visite), fil d Ariane = soins visage ; les anciens produits Namaste au catalogue ont disparu du site |
| roger-gallet | sitemap | 136 | 15 | 121 | 0 | 0 | sitemap fr.roger-gallet.com : 136 fiches, aucun soin visage en vente (gamme Aura Mirabilis absente du site) ; 0 ajout |
| round-lab | products.json | 124 | 8 | 57 | 59 | 0 | roundlab.com Shopify US, USD converti ; masques en feuille : reference standard |
| sand-and-sky | products.json | 48 | 1 | 28 | 19 | 0 | eu.sandandsky.com (EUR), collections products-all/best-sellers/new ; type HERO seulement (kits exclus) |
| senka | products.json | 19 | 5 | 8 | 6 | 0 | www.shiseido.co.jp ne vend plus Senka (marque cedee a Fine Today) ; source = boutique officielle onlineshop.finetoday.com (Shopify), noms japonais, JPY converti ; recharges et corps exclus |
| sensilis | sitemap | 75 | 6 | 6 | 63 | 0 | sensilis.com/fr : sitemap FR, rubriques skincare/suncare visage/acne ; AUCUN PRIX : le site officiel n a pas de boutique pour la France (hasEcommerce=false, marche World Wide), price_eur=null |
| shiseido | sitemap FR | 188 | 9 | 130 | 49 | 0 | sitemap produits shiseido.fr (EUR), noms FR sans nom de gamme ; deja rapproches a la main (Skin Filler, Ultimune, Future Solution LX, Benefiance, White Lucent, Vital Perfection, Essential Energy) |
| sisley | categories soin-du-visage + json-ld | 78 | 27 | 12 | 39 | 0 | categories /fr-FR/soin/soin-du-visage/* ; nom = fil d ariane ; doublons approchants du catalogue existant (noms EN/abreges) exclus a la main |
| sk-ii | products.json | 23 | 10 | 6 | 7 | 0 | www.sk-ii.com Shopify (US), USD converti |
| skin1004 | products.json | 79 | 7 | 26 | 46 | 0 | www.skin1004.com Shopify, USD converti |
| skinceuticals |  | 0 | 0 | 0 | 0 | site | tous les sites officiels (skinceuticals.fr, .com, .co.uk, .de, .it, .es, .be, .ch, .nl, .ca, .com.au) renvoient 403 challenge anti-robot Cloudflare (Just a moment) ; non contourne (pas de resolution de challenge) ; aucun produit invente |
| some-by-mi | sitemap | 88 | 8 | 34 | 46 | 0 | somebymi.com (boutique officielle coreenne cafe24), noms coreens, KRW converti ; en.somebymi.com non utilise (robots.txt Disallow: / pour tous) |
| sulwhasoo | products.json | 129 | 7 | 90 | 32 | 0 | us.sulwhasoo.com Shopify, collections soin, USD converti |
| svr | products.json | 67 | 3 | 15 | 49 | 0 | Shopify fr.svr.com, collections soin visage (hors corps, formats voyage, routines) |
| tata-harper | products.json | 87 | 15 | 64 | 8 | 0 | products.json, prix EUR (.js) |
| tatcha | products.json | 64 | 6 | 28 | 30 | 0 | tatcha.com Shopify, collections soin, USD converti |
| thalgo | sitemap-fr (fiches produit, dataLayer productDetail) | 131 | 32 | 50 | 49 | 0 | sitemap-fr thalgo.fr, fiches sans JSON-LD : nom/prix lus dans le dataLayer productDetail, image via avis-verifies, INCI du bloc ingredients ; eco-recharges, formats gt (petits prix/coffrets), complements alimentaires (shots collagene), rasage, BB creams exclus |
| the-inkey-list | products.json | 88 | 7 | 53 | 28 | 0 | eu.theinkeylist.com (EUR), collections skin+shop-all |
| the-ordinary | sitemap fr-fr | 81 | 9 | 23 | 49 | 0 | sitemap fr-fr (EUR), noms FR ; deja via id produit des URLs en-us ; 3 soins visage exclus a tort par les filtres (poudre vit C, soufre, emulsion visage&corps) remis |
| tirtir | products.json | 67 | 3 | 38 | 26 | 0 | tirtir.global Shopify, soin seulement (cushions/fonds de teint/fixateurs exclus), USD converti |
| topicrem | products.json | 48 | 8 | 14 | 26 | 0 | Shopify fr.topicrem.com, collection visage ; gamme (AC, MELA, HYDRA+...) ajoutee devant le nom de la fiche |
| torriden | products.json | 71 | 5 | 36 | 30 | 0 | torriden.us = boutique officielle US Shopify (torriden.com coreen : robots.txt interdit ClaudeBot), USD converti |
| trinny-london | sitemap | 107 | 7 | 89 | 11 | 0 | trinnylondon.com/eu (EUR) : sitemap EU, JSON-LD categorie Skin Care, sets/recharges/minis/cou/mains exclus ; nom = titre de la fiche (og:title) |
| u-beauty | products.json | 108 | 11 | 94 | 3 | 0 | products.json, marche en-eu, prix EUR (.js) |
| uriage | pages categorie | 160 | 0 | 85 | 75 | 0 | uriage.fr (e-shop officiel FR, www.uriage.com/fr y renvoie) : liens des rubriques Visage + Solaires visage ; fil d Ariane Visage ; verif bloque les 8 produits existants (liens generiques) : aucun rapprochement "deja" par nom conserve |
| valmont | categories /fr/skincare/products/* + json-ld (boutique internationale CHF) | 52 | 15 | 5 | 32 | 0 | categories /fr/skincare/products/* ; boutique internationale en CHF (pas de boutique EUR) : prix convertis CHF 1.06 ; les "Pack" Valmont sont des masques ; anciens noms EN du catalogue (V-Line, cleansing with a...) exclus a la main |
| versed | products.json | 76 | 6 | 59 | 11 | 0 | versedskin.com products.json (USD converti), nom = titre + type |
| vichy | sitemap vichy.be (fiches FR) | 125 | 18 | 54 | 53 | 0 | vichy.fr derriere un challenge anti-robot Cloudflare (403 "Just a moment") : non contourne ; source = site officiel Vichy Belgique en francais (vichy.be/fr-be), fiches sans prix (pas d e-shop) -> price null |
| wishful | products.json | 8 | 4 | 3 | 1 | 0 | hudabeauty.com/fr-fr : gamme Wishful quasi retiree (8 fiches au sitemap, 7 dans le JSON produits) ; seuls les produits hors catalogue sont gardes |
| youth-to-the-people | sitemap US (Chrome) | 16 | 5 | 0 | 11 | 0 | youthtothepeople.com (US) via Chrome (Cloudflare) ; sitemap tres partiel (15 fiches soin) + 1 fiche trouvee en page categorie ; USD converti ; images via Chrome |
| yves-rocher | pages categorie soin visage (39 pages) + fiches | 97 | 1 | 32 | 64 | 0 | listing soin visage (marque Yves Rocher seulement, hors marketplace), prix du listing |
| zo-skin-health | sitemap | 60 | 8 | 16 | 36 | 0 | zoskinhealth.com/us (seul site marchand officiel, USD converti) : sitemap + page shop ; minis/kits/programmes/recharges/corps/cou exclus |
