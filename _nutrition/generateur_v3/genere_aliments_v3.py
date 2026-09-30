# -*- coding: utf-8 -*-
"""Construit _nutrition/aliments_v3.json = aliments_v2.json (259 aliments, champs inchangés) + champ « tendance »
+ aliments ajoutés (présents dans CIQUAL 2020 uniquement).
Réutilise tel quel le code de calcul de generateur_v2/genere_aliments_v2.py (lecture CIQUAL, seuils 15 % VNR,
précautions automatiques, prix, saisons) : la partie « Construction » de v2 n'est pas exécutée.
Nécessite xlrd (lecture de ciqual.xls)."""
import json, os, copy
HERE = os.path.dirname(os.path.abspath(__file__))
NUT = os.path.dirname(HERE)
V2 = os.path.join(NUT, 'generateur_v2', 'genere_aliments_v2.py')
src = open(V2, encoding='utf-8').read().split('# ---------- Construction ----------')[0]
ns = {'__file__': V2, '__name__': 'v2_lib'}
exec(compile(src, V2, 'exec'), ns)
ciq, teneurs, claims, prec_auto, prix, saison, surgele, nutr_cles, etudes, PHOTO = (ns[k] for k in
    ('ciq', 'teneurs', 'claims', 'prec_auto', 'prix', 'saison', 'surgele', 'nutr_cles', 'etudes', 'PHOTO'))
ET, EST = ns['ET'], ns['EST']
from foods_def import SM, MP, BI, AS, OR, PO, BO, FR_, SU, FRA, MED, ORI, ASI, LAT, AFR, NOR, UNI

PM = 'https://pubmed.ncbi.nlm.nih.gov/%s/'
# Références ajoutées en v3 : identifiants vérifiés via NCBI E-utilities (esummary : premier auteur, année, revue, titre) le 30/09/2026.
ET.update({
 'ALCOCK19': ("Alcock RD 2019, Int J Sport Nutr Exerc Metab (bouillons d'os : teneurs en précurseurs du collagène faibles et très variables)", PM % 29893587),
 'MYUNG25': ("Myung SK 2025, Am J Med (compléments de collagène et vieillissement cutané, méta-analyse de 23 ECR : aucun effet dans les études non financées par l'industrie ni dans les études de haute qualité)", PM % 40324552),
 'SHISHEHBOR17': ("Shishehbor F 2017, Diabetes Res Clin Pract (vinaigre et glycémie après le repas, méta-analyse d'essais)", PM % 28292654),
 'KONDO09': ("Kondo T 2009, Biosci Biotechnol Biochem (vinaigre et poids, ECR au Japon ; auteurs salariés du fabricant de vinaigre Mizkan)", PM % 19661687),
 'HILL05': ("Hill LL 2005, J Am Diet Assoc (lésion de l'œsophage par un comprimé de vinaigre de cidre, cas et analyse de produits)", PM % 15983536),
 'LHOTTA98': ("Lhotta K 1998, Nephron (hypokaliémie chez une patiente buvant de grandes quantités de vinaigre de cidre, cas)", PM % 9736833),
 'HLEBOWICZ07': ("Hlebowicz J 2007, BMC Gastroenterol (vinaigre de cidre et vidange gastrique chez des diabétiques de type 1 avec gastroparésie, étude pilote)", PM % 18093343),
 'MARSCHNER24': ("Marschner F 2024, J Dent (facteurs de risque de l'érosion dentaire, revue systématique et méta-analyse : aliments acides OR 2,40)", PM % 38552999),
 'ANSES_SPIRULINE': ("ANSES 2017, avis 2014-SA-0096 sur les compléments alimentaires contenant de la spiruline (contaminations, phénylcétonurie, terrain allergique, vitamine B12 inactive)", "https://www.anses.fr/fr/system/files/NUT2014SA0096.pdf"),
 'SERBAN16': ("Serban MC 2016, Clin Nutr (spiruline en complément et lipides sanguins, méta-analyse de 7 ECR)", PM % 26433766),
 'OMS_SEL': ("OMS, aide-mémoire Réduction du sodium (adultes : moins de 5 g de sel par jour)", "https://www.who.int/news-room/fact-sheets/detail/sodium-reduction"),
 'OMS_SUCRES': ("OMS 2015, Guideline: sugars intake for adults and children (sucres libres, y compris ceux des jus, sous 10 % de l'énergie)", "https://www.who.int/publications/i/item/9789241549028"),
})
EST['bouillon'] = (1, "estimé par catégorie : bouillon maison (os, viande et légumes) ou prêt à consommer ; aucun relevé public daté trouvé, prix non chiffré")

NEW3 = []
def F(i, nom, en, cat, code, portion, g, cuis, fr, ue, bio, circ, prx, sais, usage, **k):
    NEW3.append(dict(id=i, nom=nom, en=en, cat=cat, code=code, portion=portion, g=g, cuis=cuis, fr=fr, ue=ue, bio=bio, circ=circ, prix=prx, sais=sais, usage=usage, **k))

F('canneberge_sechee', 'Canneberge (cranberry) séchée, sucrée', 'a small bowl of dried sweetened cranberries', 'fruit_sec', 13178, '30 g (une petite poignée)', 30,
  [NOR, UNI], False, True, True, [SM, BI], 'E:noix', 'ALL', 'quotidien', cp=[], gp='D', gl='D', cl=[], noclaim=True, et=['OMS_SUCRES', 'PNNS'],
  nu=['fibres', 'sucres ajoutés'],
  me="Fruit séché puis sucré : 73 g de sucres pour 100 g (CIQUAL). Aucune donnée cutanée ; les études sur la canneberge portent sur des jus ou des extraits et sur d'autres sujets que la peau.",
  pr=['Très sucrée : 30 g apportent environ 22 g de sucres (CIQUAL) ; à compter comme un produit sucré (PNNS).', 'Huile ou sulfites ajoutés selon les marques : lire l’étiquette en cas d’allergie aux sulfites.', 'Produit sucré : aucune allégation affichée.'])
F('vinaigre_cidre', 'Vinaigre de cidre', 'a small glass cruet of amber apple cider vinegar beside a cut apple', 'condiment', 11090, '15 mL (1 cuillère à soupe, en vinaigrette)', 15,
  [FRA, NOR, UNI], True, True, True, [SM, BI], 'E:epice', 'ALL', 'quotidien', cp=[], gp='D', gl='C', cl=[], noclaim=True,
  et=['SHISHEHBOR17', 'KONDO09', 'HLEBOWICZ07', 'HILL05', 'LHOTTA98', 'MARSCHNER24'],
  me="Condiment acide (acide acétique) ; aucune donnée cutanée. Pris avec un repas, le vinaigre a un peu réduit la hausse de la glycémie après ce repas dans de petits essais ; l'effet sur le poids repose sur un essai financé par un fabricant de vinaigre.",
  pr=['Jamais pur ni en « shot » : acide pour l’émail des dents (les aliments acides sont associés à l’érosion dentaire) et pour l’œsophage (lésion décrite avec des comprimés de vinaigre) ; en vinaigrette ou très dilué au repas.',
      'Grandes quantités prises longtemps : baisse du potassium décrite (un cas publié) ; sous diurétique, insuline ou digoxine, demander l’avis du pharmacien.',
      'Diabète avec vidange lente de l’estomac (gastroparésie) : le vinaigre l’a encore ralentie dans une petite étude ; avis médical.',
      'Sulfites possibles selon les marques : lire l’étiquette.'])
F('vinaigre_balsamique', 'Vinaigre balsamique', 'a drizzle of dark balsamic vinegar on a white ceramic spoon', 'condiment', 11091, '10 mL (1 cuillère à soupe)', 10,
  [MED], False, True, True, [SM, BI], 'E:epice', 'ALL', 'quotidien', al=['sulfites'], cp=[], gp='D', gl='C', cl=[], noclaim=True, et=['MARSCHNER24'],
  me="Condiment à base de moût de raisin et de vinaigre de vin ; environ 19 g de sucres pour 100 g (CIQUAL) ; aucune donnée cutanée.",
  pr=['Contient le plus souvent des sulfites (déclarés sur l’étiquette) : allergie aux sulfites, lire l’étiquette.', 'Crèmes et réductions balsamiques : nettement plus sucrées.', 'Acide : en assaisonnement, pas en boisson.'])
F('spiruline', 'Spiruline (séchée)', 'a small mound of deep blue-green spirulina powder', 'algue', 11086, '3 g (1 cuillère à café rase)', 3,
  [UNI], True, True, True, [BI, SM], 'E:algue', 'ALL', 'rare', cp=[], gp='D', gl='C', cl=[], noclaim=True, et=['ANSES_SPIRULINE', 'SERBAN16', 'ANSES_ALGUES'],
  nu=['protéines', 'fer', 'cuivre', 'riboflavine'],
  me="Cyanobactérie séchée (pas une algue au sens strict), consommée par petites cuillerées ; aucun essai cutané. En complément, elle a baissé le cholestérol dans de petits essais ; sa vitamine B12 est surtout une forme inactive (ANSES 2017).",
  pr=['Déconseillée en cas de phénylcétonurie (contient de la phénylalanine) et de terrain allergique (ANSES 2017).',
      'Contaminations possibles (plomb, mercure, arsenic ; toxines d’autres cyanobactéries ; bactéries) selon l’eau et la récolte (ANSES 2017) : origine tracée seulement, jamais de spiruline de cueillette.',
      'Iode non mesuré dans CIQUAL 2020 : maladie de la thyroïde, traitement à l’amiodarone ou au lithium, avis médical, comme pour les algues.',
      'Grossesse, allaitement, enfants : données insuffisantes, avis médical par prudence.',
      'Ne remplace pas une source de vitamine B12 pour les végétariens et végans (ANSES 2017).'])
F('bouillon_pot_au_feu', 'Bouillon de viande et légumes (type pot-au-feu)', 'a bowl of clear golden meat and vegetable broth', 'boisson', 25909, '250 mL (1 bol)', 250,
  [FRA, ASI, UNI], True, True, True, [BO, SM], 'E:bouillon', 'ALL', 'quotidien', al=['celeri'], cp=[], gp='D', gl='C', cl=[], et=['ALCOCK19', 'MYUNG25', 'OMS_SEL'],
  nu=['eau', 'très peu de calories (5 kcal pour 100 g)'],
  sg='Se congèle bien en portions (bouillon maison) ; les cubes déshydratés sont en général plus salés.',
  me="Bouillon de viande et légumes (le « bouillon d'os » n'a pas de fiche CIQUAL propre). Aucun essai n'a montré que le collagène d'un bouillon atteint la peau ; sa teneur en acides aminés du collagène varie beaucoup d'une préparation à l'autre (Alcock 2019).",
  pr=['Allergène majeur (céleri) : souvent présent dans ce bouillon, classé par prudence ; vérifier la recette ou l’étiquette.',
      'Salé : un bol de 250 mL apporte environ 2,7 g de sel (CIQUAL), plus de la moitié du repère OMS de moins de 5 g par jour ; hypertension ou maladie rénale : avis médical.',
      'Bouillon maison : refroidir rapidement, garder au réfrigérateur et porter à ébullition avant de servir.'])
F('levure_alimentaire', 'Levure alimentaire (paillettes)', 'a small ceramic dish of golden nutritional yeast flakes', 'condiment', 11009, '5 g (quelques pincées de paillettes)', 5,
  [UNI], True, True, True, [BI, SM], 'E:petit', 'ALL', 'rare', cp=[], gp='D', gl='C', cl=[], noclaim=True, et=[],
  nu=['protéines', 'fibres', 'niacine', 'folates', 'zinc'],
  me="Levure inactivée, au goût de fromage ; pour 100 g, riche en niacine, folates et zinc (CIQUAL), mais consommée par pincées ; aucune donnée cutanée.",
  pr=['Vitamine B12 : la teneur dépend de l’enrichissement (CIQUAL : 0,34 µg pour 100 g) ; régime végan : lire l’étiquette, la levure ne remplace pas la supplémentation conseillée.',
      'À ne pas confondre avec la levure de boulanger ni la levure chimique.'])

TENDANCE_EXIST = {'kefir', 'miso', 'curcuma', 'gingembre', 'graines_chia', 'graines_lin', 'cacao_poudre', 'the_vert', 'avocat', 'grenade', 'chou_frise', 'tempeh', 'choucroute'}

v2 = json.load(open(os.path.join(NUT, 'aliments_v2.json'), encoding='utf-8'))
out = []
for a in v2['aliments']:
    e = copy.deepcopy(a); e['tendance'] = a['id'] in TENDANCE_EXIST; out.append(e)
seen = {x['id'] for x in out}
for f in NEW3:
    assert f['id'] not in seen, f['id']; seen.add(f['id'])
    d = ciq(f['code']); t = teneurs(d)
    f['_cp'] = f['cp']
    nc = nutr_cles(f, d)
    main, autres = (None, []) if f.get('noclaim') else claims(t, d, False)
    pr = prec_auto(f, d, f['nom'], False)
    if f['id'] == 'canneberge_sechee':  # « produit sucré » remplace la phrase « petite quantité » ajoutée par la règle automatique
        pr = [x for x in pr if not x.startswith('Consommé en petite quantité')]
    n, txt, eur, rel = prix(f['prix'], f['g'], f.get('pc', 1))
    sa, ssrc = saison(f['sais'], f.get('sais_note'))
    ok, note = surgele(f, d)
    e = {'id': f['id'], 'nom': f['nom'], 'categorie': f['cat'], 'cibles_peau': f['_cp'], 'cibles_longevite': f['cl'], 'nutriments_cles': nc,
         'mecanisme_simple': f['me'], 'niveau_preuve_peau': f['gp'], 'niveau_preuve_longevite': f['gl'], 'etudes': etudes(f['et']),
         'portion_type': f['portion'], 'allergenes_UE': f.get('al', []), 'reactions_croisees': f.get('cr', []), 'precautions': pr,
         'allegation_UE_autorisee': main[0] if main else None, 'allegation_UE_libelle_EN_verifie': main[1] if main else None,
         'allegation_UE_condition': main[2] if main else None, 'allegation_UE_statut_libelle_FR': main[3] if main else None, 'autres_allegations_UE': autres,
         'saison': sa, 'ciqual': {'code': f['code'], 'nom_ciqual': d['nom'], 'source': 'ANSES, table CIQUAL 2020', 'teneurs_pour_100g': t},
         'cuisines': f['cuis'], 'origine_possible_france': f['fr'], 'origine_possible_ue': f['ue'], 'prix_niveau': n, 'prix_source': txt, 'prix_portion_indicatif_eur': eur, 'prix_releve': rel,
         'bio_disponible': f['bio'], 'circuits': f['circ'], 'surgele_ou_conserve_ok': ok, 'surgele_ou_conserve_note': note, 'saison_source': ssrc, 'usage': f['usage'],
         'photo_prompt': PHOTO % f['en'], 'tendance': True}
    out.append(e)

meta = copy.deepcopy(v2['_meta'])
meta.update({'version': '3.0', 'date': '2026-09-30',
 'description_v3': "v3 : les 259 aliments de v2 sont repris sans modification de leurs champs, avec un nouveau champ « tendance ». %d aliments « tendance » ajoutés, uniquement s'ils existent dans CIQUAL 2020 (valeurs lues dans le fichier officiel, mêmes règles de calcul que v2)." % len(NEW3),
 'tendance': "tendance = aliment mis en avant par les modes alimentaires actuelles (réseaux sociaux, cafés « healthy »). Classement éditorial, sans lien avec l'intérêt nutritionnel ni le niveau de preuve : un aliment « tendance » n'est jamais présenté comme meilleur. Vrai pour les aliments ajoutés en v3 et pour kéfir, miso, curcuma, gingembre, chia, lin, cacao, thé vert, avocat, grenade, chou frisé, tempeh et choucroute. Les verdicts sur les modes sont dans tendances.json.",
 'refuses_v3': {
   'matcha': "absent de CIQUAL 2020 (seule la fiche « Thé, feuille », sans type de thé, existe : ce n'est pas du matcha) ; la carte tendance renvoie vers the_vert",
   'rooibos': "absent de CIQUAL 2020 (seule une fiche générique « Tisane infusée » existe, déjà présente : tisane)",
   'hibiscus': "absent de CIQUAL 2020 (ni hibiscus ni bissap)",
   'goji': "absent de CIQUAL 2020",
   'acai': "absent de CIQUAL 2020",
   'argousier': "absent de CIQUAL 2020",
   'galanga': "absent de CIQUAL 2020",
   'citronnelle': "absente de CIQUAL 2020",
   'badiane': "absente de CIQUAL 2020",
   'kombucha': "présent dans CIQUAL 2020 (18025) mais volontairement non ajouté : boisson souvent non pasteurisée, à ne pas proposer dans l'assiette (grossesse, immunodépression) ; traité dans tendances.json",
   'bouillon_os': "pas de fiche « bouillon d'os » dans CIQUAL 2020 : remplacé par le bouillon de viande et légumes type pot-au-feu (25909)",
   'cranberry_jus': "pas de jus de canneberge dans CIQUAL 2020 : seule la canneberge séchée sucrée est ajoutée",
   'deja_presents': "framboise, mure, myrtille, choucroute, tempeh, the_vert existaient déjà en v2"},
 'allegations_v3': "Aucune allégation sur les aliments ajoutés : condiments, algue et levure consommés en petite quantité (règle de v2) ; canneberge séchée exclue car produit à sucre ajouté ; le bouillon n'atteint aucun seuil de 15 % de la VNR."})
json.dump({'_meta': meta, 'aliments': out}, open(os.path.join(NUT, 'aliments_v3.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('aliments', len(out), 'ajoutés', len(NEW3))
