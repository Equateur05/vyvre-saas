# Mettre vyvre.fr en ligne — mode d'emploi

Ecrit le 19/09/2026, la nuit. Tout ce qui suit a ete verifie sur cette machine.

## La contrainte

Vercel, plan gratuit : **5 000 fichiers televerses par 24 heures**. Le 19/09 le
quota a ete brule, le lot 2 a ete refuse. Il se rouvre le **20/09 vers 14 h**.

Deuxieme regle, moins connue et plus dangereuse : **un deploiement est un
instantane**. Un fichier absent de l'envoi n'est plus servi a l'adresse publique,
meme s'il y etait hier. On ne peut donc pas publier le catalogue complet en
laissant les images arriver plus tard : les cartes produits seraient cassees.

C'est pour cela que `public/scan/catalogue/all.json` est **filtre** sur les
marques dont les images sont deja en ligne. Le catalogue complet, lui, vit dans
`catalogue-v2/all_complet.json`.

## Ou on en est (19/09, 23 h)

| | marques | produits | fichiers images restants |
|---|---|---|---|
| peau, en ligne | 49 | 2 283 | — |
| peau, en attente | 97 | 3 643 | 8 301 |
| cheveux, en attente | 114 | 4 446 | 4 512 (.webp) |

`.vercelignore` retire de chaque envoi ce que le site ne sert jamais :
l'outillage des catalogues, les 1 749 PNG que plus aucune fiche ne designe, et
les 4 533 packshots d'origine des cheveux (le site affiche les detourages).

## Jour 1 — 20/09 apres 14 h

1. Publier les corrections seules d'abord : elles reparent des bugs visibles.
   - la fuite des pages marque (`/m/<marque>` montrait les produits des autres)
   - les 12 langues sur le site et sur le scan
   - `/dior` n'affiche plus d'age invente
   - le menu du scan cheveux, invisible sur telephone
2. Puis ouvrir les marques peau qui tiennent dans le quota :

```bash
python3 catalogue-v2/publie.py --ajoute-lot lot2 --plafond 4400 --essai   # controle
python3 catalogue-v2/publie.py --ajoute-lot lot2 --plafond 4400           # ecrit
npx vercel deploy --prod --yes
```

   30 marques passent (4 333 fichiers), 5 attendent : codage, etude-house,
   innisfree, omorovicza, rituals.

## Jour 2 — 21/09

```bash
python3 catalogue-v2/publie.py --ajoute-lot lot2 --plafond 4400   # les 5 restantes
python3 catalogue-v2/publie.py --ajoute-lot lot3 --plafond 4400   # + le lot 3
npx vercel deploy --prod --yes
```

   Fin du catalogue peau : 146 marques, 5 926 produits.

## Jour 3 — 22/09, les cheveux

Le scan cheveux et ses 4 512 detourages (4 439 fiches sur 4 446 ; les 7 autres
n'ont aucune image et la carte le dit).

```bash
npx vercel deploy --prod --yes
```

## Avant chaque envoi

```bash
./node_modules/.bin/next build        # doit finir sans erreur
python3 catalogue-v2/publie.py --etat # dire ce qui est publie et ce qui attend
```

Apres l'envoi, verifier qu'une image d'une marque tout juste ouverte repond 200 :

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://vyvre.fr/scan/products/clinique/v2/cutout/<fiche>.webp
```

## Ce qui reste bloque, et pourquoi

- **Supabase, catalogue cheveux** : `SUPABASE_SERVICE_ROLE_KEY` est sur Vercel,
  pas sur ce Mac. Les deux CSV sont prets et a jour (114 marques, 4 446 fiches) :
  `catalogue-cheveux/supabase/hair_products.csv`. Avec la cle :
  `python3 catalogue-cheveux/supabase/import.py --dry-run` puis sans l'option.
- **Guerlain** : captcha a passer a la main.
- **12 marques cheveux** : site protege par un anti-robot, rien n'a ete force.
