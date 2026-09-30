# -*- coding: utf-8 -*-
# Nouveaux champs pour les 44 aliments de v1 (les champs existants ne sont pas modifiés).
# id: (photo_en, cuisines, origine_fr, origine_ue, bio, circuits, prix, saison_controle, surgele_note_ou_None)
from foods_def import SM, MP, BI, AS, OR, PO, BO, FR_, SU, FRA, MED, ORI, ASI, LAT, AFR, NOR, UNI
EXIST = {
 'tomate': ('two ripe vine tomatoes, one sliced', [MED, FRA, LAT, UNI], True, True, True, [SM, MP, BI], 'I:tomate', 'A:tomate', None),
 'concentre_tomate': ('a small bowl of tomato paste with a spoon', [MED, ORI, UNI], True, True, True, [SM, BI], 'E:legconserve', 'ALL', 'Conserve : c’est la forme étudiée (concentré cuit avec de l’huile).'),
 'carotte': ('a bunch of carrots with green tops', [FRA, ORI, UNI], True, True, True, [SM, MP, BI], 'I:carotte', 'A:carotte', None),
 'patate_douce': ('a sweet potato and roasted orange wedges', [AFR, LAT, ASI, UNI], True, True, True, [SM, MP, BI, OR], 'E:leg', 'T:patate_douce', None),
 'epinard': ('a heap of fresh spinach leaves', [FRA, MED, ORI, ASI], True, True, True, [SM, MP, BI, SU], 'E:leg', 'A:epinard', None),
 'chou_frise': ('a bunch of curly kale', [FRA, NOR, UNI], True, True, True, [MP, BI, SM], 'E:leg2', 'A:chou', None),
 'brocoli': ('a broccoli head and a few florets', [FRA, ASI, UNI], True, True, True, [SM, MP, BI, SU], 'E:leg', 'A:brocoli', None),
 'myrtille': ('a small bowl of blueberries', [FRA, NOR, UNI], True, True, True, [SM, MP, BI, SU], 'E:fruit2', 'A:myrtille', None),
 'orange': ('an orange and one halved', [MED, ORI, UNI], False, True, True, [SM, MP, BI], 'I:orange', 'A:orange', None),
 'kiwi': ('a single ripe kiwi cut in half', [FRA, UNI], True, True, True, [SM, MP, BI], 'I:kiwi_piece', 'A:kiwi', None),
 'poivron_rouge': ('a glossy red bell pepper and one halved', [MED, LAT, ORI, UNI], True, True, True, [SM, MP, BI], 'I:poivron', 'A:poivron', None),
 'huile_olive': ('a small glass cruet of green-gold olive oil', [MED, ORI, FRA], True, True, True, [SM, BI, OR], 'E:huile', 'ALL', 'Sans objet (huile) ; à l’abri de la lumière.'),
 'noix': ('a handful of walnut halves and two whole walnuts', [FRA, ORI, UNI], True, True, True, [SM, MP, BI], 'E:noix', 'ALL', None),
 'amande': ('a small heap of whole almonds', [MED, ORI, UNI], True, True, True, [SM, BI, OR], 'E:noix', 'ALL', None),
 'graines_lin': ('golden flaxseeds in a small ceramic dish', [NOR, UNI], True, True, True, [SM, BI], 'E:noix', 'ALL', None),
 'graines_chia': ('chia seeds in a small ceramic dish', [LAT, UNI], False, False, True, [SM, BI], 'E:noix', 'ALL', None),
 'sardine': ('an open tin of sardines in olive oil', [MED, FRA, UNI], True, True, False, [SM, PO], 'E:conserve', 'ALL', 'Conserve : forme courante et pratique, garde ses oméga-3 (valeurs CIQUAL de la conserve).'),
 'maquereau': ('a roasted mackerel fillet with blistered skin', [FRA, NOR, ASI], True, True, False, [PO, SM], 'E:poisgras', 'ALL', None),
 'saumon': ('a cooked salmon fillet', [NOR, ASI, UNI], False, True, True, [PO, SM, SU], 'E:pois', 'ALL', None),
 'oeuf': ('two brown eggs, one soft-boiled and opened', [UNI], True, True, True, [SM, MP, BI], 'E:oeuf', 'ALL', 'Frais uniquement.'),
 'lentille': ('cooked brown lentils in a ceramic bowl', [FRA, ORI, ASI, UNI], True, True, True, [SM, BI, OR], 'E:sec', 'ALL', None),
 'pois_chiche': ('cooked chickpeas in a small bowl', [ORI, MED, ASI, AFR], True, True, True, [SM, BI, OR], 'E:sec', 'ALL', None),
 'haricot_rouge': ('cooked red kidney beans in a bowl', [LAT, AFR, UNI], True, True, True, [SM, BI], 'E:sec', 'ALL', None),
 'flocons_avoine': ('rolled oats in a ceramic bowl', [NOR, FRA, UNI], True, True, True, [SM, BI], 'E:sec', 'ALL', None),
 'pain_complet': ('two slices of wholemeal bread', [FRA, UNI], True, True, True, [SM, BI], 'E:pain', 'ALL', 'Se congèle bien en tranches.'),
 'the_vert': ('a cup of pale green tea', [ASI, ORI, UNI], False, False, True, [SM, BI, AS], 'E:epice', 'ALL', 'Sans objet.'),
 'chocolat_noir_70': ('two squares of dark chocolate', [UNI], False, False, True, [SM, BI], 'E:petit', 'ALL', 'Sans objet.'),
 'cacao_poudre': ('a small mound of unsweetened cocoa powder', [UNI], False, False, True, [SM, BI], 'E:petit', 'ALL', 'Sans objet.'),
 'yaourt_nature': ('a plain yogurt in a small glass jar', [FRA, MED, ORI, UNI], True, True, True, [SM, BI], 'E:laitier', 'ALL', 'Frais uniquement.'),
 'kefir': ('a glass of milk kefir', [ORI, NOR, UNI], True, True, True, [SM, BI], 'E:laitier', 'ALL', 'Frais uniquement.'),
 'graines_courge': ('green pumpkin seeds in a small dish', [LAT, UNI], True, True, True, [SM, BI], 'E:noix', 'ALL', None),
 'huitre': ('six opened oysters on crushed ice', [FRA], True, True, False, [PO, MP], 'I:huitre_douzaine', 'A_V1', 'Crues, uniquement fraîches ; hors grossesse et immunodépression.'),
 'noix_bresil': ('two Brazil nuts', [LAT, UNI], False, False, True, [SM, BI], 'E:petit', 'ALL', None),
 'avocat': ('a ripe avocado cut in half with its stone', [LAT, UNI], False, True, True, [SM, MP, BI], 'I:avocat_piece', 'A:avocat', None),
 'eau': ('a clear glass carafe of water', [UNI], True, True, False, [SM], 'E:eau', 'ALL', 'Sans objet.'),
 'fraise': ('a small bowl of ripe strawberries', [FRA, UNI], True, True, True, [SM, MP, BI, SU], 'R:fraise', 'A:fraise', None),
 'cassis': ('strings of blackcurrants', [FRA, NOR], True, True, True, [MP, SU, BI], 'E:fruit2', 'A:cassis', None),
 'abricot': ('three ripe apricots, one halved', [FRA, MED, ORI], True, True, True, [SM, MP, BI], 'R:abricot', 'A:abricot', None),
 'mache': ('a small heap of lamb’s lettuce rosettes', [FRA], True, True, True, [SM, MP, BI], 'E:leg2', 'A:mache', None),
 'courge_butternut': ('a butternut squash cut in half', [FRA, UNI, AFR], True, True, True, [SM, MP, BI], 'E:leg', 'A:courge', None),
 'tofu': ('a block of firm tofu, a few cubes cut', [ASI], True, True, True, [SM, BI, AS], 'E:soja', 'ALL', 'Frais ; se congèle (texture plus spongieuse).'),
 'pamplemousse': ('a pink grapefruit cut in half', [UNI], False, True, True, [SM, MP, BI], 'I:pamplemousse_piece', 'A:pamplemousse', None),
 'graines_tournesol': ('sunflower seeds in a small dish', [UNI, NOR], True, True, True, [SM, BI], 'E:noix', 'ALL', None),
 'noisette': ('a handful of hazelnuts, some cracked', [FRA, ORI, UNI], True, True, True, [SM, MP, BI], 'E:noix', 'ALL', None),
}
V1_CAT = {}  # rempli par le script

# Usage : « quotidien » = vendu dans la plupart des supermarchés et connu de la plupart des ménages français ;
# « rare » = surtout en épicerie spécialisée, magasin bio ou poissonnerie, ou perçu comme de niche, festif ou très cher.
RARE = {
 # v1
 'graines_chia', 'graines_lin', 'cacao_poudre', 'kefir', 'noix_bresil', 'cassis', 'tofu', 'graines_courge', 'graines_tournesol', 'huitre',
 # v2
 'miso', 'tempeh', 'tofu_soyeux', 'nori', 'wakame', 'grenade', 'pak_choi', 'shiitake', 'gombo', 'manioc', 'igname', 'banane_plantain', 'taro', 'christophine',
 'goyave', 'papaye', 'fruit_passion', 'litchi', 'kaki', 'figue_barbarie', 'kumquat', 'rutabaga', 'chou_rave', 'topinambour', 'salsifis', 'radis_noir', 'romanesco',
 'courge_spaghetti', 'cresson', 'riz_sauvage', 'millet', 'epeautre', 'sarrasin', 'son_avoine', 'haricot_mungo', 'tahin', 'pignon', 'graines_pavot', 'macadamia',
 'noix_pecan', 'huile_lin', 'huile_noix', 'yaourt_brebis', 'cardamome', 'safran', 'vanille', 'tomate_sechee', 'tourteau', 'bulot', 'poulpe', 'palourde',
 'saint_jacques', 'lotte', 'rouget', 'eglefin', 'calamar', 'lapin', 'coing', 'rhubarbe', 'groseille', 'mure', 'brebis_pyrenees', 'boisson_amande',
 'boisson_soja_calcium', 'sirop_erable', 'figue_seche', 'feve', 'lentille_blonde', 'mirabelle_reine_claude', 'chicoree_frisee',
}
