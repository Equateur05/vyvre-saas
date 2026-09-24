/**
 * VYVRE — dictionnaire français des pages Next (marques, accuracy, pricing, légal).
 *
 * Le français est la source : toute clé ajoutée ici doit l'être dans les onze
 * autres fichiers de /lib/i18n/dict. Ce qui ne se traduit jamais reste dans le
 * JSX : noms de marques, « VYVRE », « skin intelligence », titres de papiers
 * scientifiques, noms de revues, extraits de code, chiffres et prix en euros.
 */

const fr = {
  /* ─────────── commun : en-tête, pied de page, sélecteur ─────────── */
  'lang.aria': 'Choisir la langue',
  'nav.manifeste': 'Manifeste',
  'nav.method': 'Méthode',
  'nav.demo': 'Tester le scan',
  'nav.pricing': 'Tarifs',

  'footer.city': 'VYVRE · Paris',
  'footer.cityFull': 'VYVRE · Paris, France',
  'footer.book': 'Réserver 20 min →',
  'footer.manifeste': 'Manifeste',
  'footer.method': 'Méthodologie',
  'footer.cgv': 'CGV',
  'footer.legal': 'Mentions légales',
  'footer.privacy': 'Confidentialité',
  'footer.privacyGdpr': 'Confidentialité · RGPD',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contact',
  'footer.home': 'Accueil',
  'footer.rights': 'Tous droits réservés',
  'footer.company': 'SAS au capital de 1 000 € · Paris, France · SIREN en cours',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Diagnostic de peau mesuré, pour les marques de soin',
  'home.meta.desc':
    'Le seul diagnostic de peau avec un prix public. Infrastructure en France, RGPD natif, traitement sur l’appareil, aucune photo téléversée.',

  'home.hero.eyebrow': 'Diagnostic de peau mesuré',
  'home.hero.h1a': 'Le diagnostic peau',
  'home.hero.h1b': 'de votre maison.',
  'home.hero.p':
    'Moins de dix secondes de caméra. Huit mesures lues pixel par pixel. Une routine composée dans votre seul catalogue.',
  'home.hero.cta1': 'Tester le scan',
  'home.hero.cta2': 'Équiper ma marque',

  'home.stat1': 'Mesures de peau',
  'home.stat2': 'Durée du scan',
  'home.stat3': 'Mise en ligne',
  'home.stat4': 'Photo conservée',

  'home.man.h2a': 'Mesurée,',
  'home.man.h2b': 'pas devinée.',
  'home.man.p':
    'Le moteur convertit chaque zone du visage en coordonnées CIE L*a*b*, puis en indices dermatologiques. Pas d’estimation à partir d’un filtre : une lecture optique, reproductible, documentée.',
  'home.man.link': 'Lire la méthodologie →',

  'home.mes.h2a': 'Huit mesures.',
  'home.mes.h2b': 'Une seule lecture.',
  'home.mes.1.n': 'Carnation',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Éclat',
  'home.mes.2.u': 'Luminance L*',
  'home.mes.3.n': 'Rougeurs',
  'home.mes.3.u': 'Indice érythème',
  'home.mes.4.n': 'Uniformité',
  'home.mes.4.u': 'Écart-type chromatique',
  'home.mes.5.n': 'Texture',
  'home.mes.5.u': 'Micro-contraste local',
  'home.mes.6.n': 'Pores',
  'home.mes.6.u': 'Densité des minima',
  'home.mes.7.n': 'Sébum',
  'home.mes.7.u': 'Réflexion spéculaire',
  'home.mes.8.n': 'Hydratation',
  'home.mes.8.u': 'Proxy TEWL optique',

  'home.steps.h2a': 'Trois étapes.',
  'home.steps.h2b': 'Zéro friction.',
  'home.step1.t': 'La cliente scanne',
  'home.step1.d':
    'Caméra du téléphone ou du poste conseil. Rien à installer, rien à téléverser : l’image est traitée puis effacée.',
  'home.step2.t': 'Le moteur compose',
  'home.step2.d':
    'Une routine matin et soir issue de votre seul catalogue, hiérarchisée selon les mesures et vos priorités commerciales.',
  'home.step3.t': 'Vous passez en ligne',
  'home.step3.d':
    'Une ligne de script sur votre site, vos couleurs, votre typographie. Aucun développeur mobilisé chez vous.',

  'home.groupe.eyebrow': 'Pour les groupes',
  'home.groupe.h2a': 'Une maison, dix marques,',
  'home.groupe.h2b': 'un seul moteur.',
  'home.socle1.t': 'Multi-marques',
  'home.socle1.d':
    'Un espace par marque : catalogue, charte, règles de recommandation et statistiques séparés.',
  'home.socle2.t': 'Souveraineté',
  'home.socle2.d':
    'Hébergement France, RGPD natif, DPA signé, aucune image conservée, aucun pixel tiers.',
  'home.socle3.t': 'Boutique et e-shop',
  'home.socle3.d':
    'Le même moteur au comptoir sur tablette et sur la fiche produit, avec le même référentiel de mesures.',

  'home.price.h2a': 'À partir de 299 €/mois.',
  'home.price.h2b': 'Prix affiché.',
  'home.price.cta': 'Voir les plans',

  'home.faq.h2': 'Questions.',
  'home.faq1.q': 'Comment mon catalogue arrive-t-il dans le moteur ?',
  'home.faq1.a':
    'Par un flux CSV ou l’API de votre e-commerce (Shopify, Salesforce Commerce, Centra). Aucun accès administrateur, synchronisation chaque nuit.',
  'home.faq2.q': 'Que devient l’image de la cliente ?',
  'home.faq2.a':
    'Elle est analysée en mémoire puis effacée : aucune photo n’est stockée ni transmise. Hébergement France, DPA disponible.',
  'home.faq3.q': 'Le moteur peut-il recommander un concurrent ?',
  'home.faq3.a':
    'Non. La routine est composée exclusivement dans votre catalogue, avec les priorités que vous fixez.',
  'home.faq4.q': 'Quel matériel faut-il ?',
  'home.faq4.a':
    'Une caméra 720p suffit, sur mobile comme sur ordinateur. Les résultats gagnent en finesse sur les capteurs récents.',

  'home.cta.h2': 'Voir le scan sur votre catalogue.',
  'home.cta.1': 'Lancer la démo',
  'home.cta.2': 'Demander une démo',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Méthodologie & précision · VYVRE',
  'acc.meta.desc':
    'Sources revues par les pairs (5 appliquées, 4 en feuille de route), méthode de calcul, intervalles de confiance, limites. La transparence scientifique derrière le moteur VYVRE v7.0.',

  'acc.hero.eyebrow': 'Méthodologie · Sources · Limites',
  'acc.hero.h1a': 'La science',
  'acc.hero.h1b': 'derrière le scan.',
  'acc.hero.p':
    'Huit mesures lues depuis l’image. Ici : les sources scientifiques, la méthode de calcul, les intervalles de confiance et les limites du moteur.',
  'acc.hero.note1':
    'Précision estimée ±5 ans âge biologique · ±4 ans âge perçu (IC 95 % · cohorte interne n=12)',
  'acc.hero.note2':
    'Validation externe n=100 prévue fin 2026 · refonte mai 2026 après audit interne',

  'acc.s1.eyebrow': '01 · Bibliographie · Sources appliquées',
  'acc.s1.h2a': '5 sources revues par les pairs',
  'acc.s1.h2b': 'activement appliquées.',
  'acc.s1.p1': 'Ces 5 sources sont directement utilisées dans les formules de calcul du moteur (cf.',
  'acc.s1.p2': ', fonction',
  'acc.s1.p3': 'et',
  'acc.s1.p4': '). Chaque biomarqueur est traçable à un article scientifique indexé sur PubMed.',
  'acc.s1.foot1': 'Moteur v7 — refonte mai 2026',
  'acc.s1.foot2': 'Sources appliquées vérifiables ligne par ligne dans',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — base de la détection automatique du phototype Fitzpatrick I-VI',
  'acc.src2.c':
    'Melanin Index (MI) et Erythema Index (EI) — quantification de la pigmentation et de la rougeur',
  'acc.src3.c':
    'Proxy TEWL (perte insensible en eau) via σL* → indices hydratation et pores. Régression table 3.',
  'acc.src4.c':
    'Reflets spéculaires → éclat / sébum. Détection des reflets spéculaires sur le visage',
  'acc.src5.c':
    'Écart âge perçu / âge biologique (cohorte caucasienne ~1 700 sujets). v7 : écart dépendant de l’âge (−2 à −6 ans selon l’âge biologique), non lié au phototype.',

  'acc.s2.eyebrow': '02 · Bibliographie · Feuille de route fin 2026',
  'acc.s2.h2a': '4 sources référencées',
  'acc.s2.h2b': 'pas encore pleinement appliquées.',
  'acc.s2.p':
    'Ces sources sont citées pour la transparence et la feuille de route publique. Leurs coefficients complets ne sont pas encore intégrés aux formules — extraction et validation prévues fin 2026 avec un partenaire dermatologue.',
  'acc.rm.appliedLabel': 'Appliqué partiellement : ',
  'acc.rm.roadmapLabel': 'Feuille de route : ',
  'acc.rm1.a':
    'Âge d’ancrage 40 (médiane de la cohorte adulte) + corrélation r=0,78 rides périorbitaires ↔ âge',
  'acc.rm1.r':
    'Extraction images → grade morphologique 0-5 (échelle Bazin) non encore implémentée. Prévue fin 2026.',
  'acc.rm2.a': 'Ajustement modeste −4 % à −8 % sur l’âge biologique pour les phototypes IV-VI',
  'acc.rm2.r':
    'Coefficients complets par phototype pour rides / fermeté / pigmentation non encore extraits.',
  'acc.rm3.a': 'Cité pour le contexte multi-ethnique',
  'acc.rm3.r':
    'Coefficients spécifiques non encore extraits. Validation sur cohorte multi-ethnique prévue fin 2026.',
  'acc.rm4.a': 'Normes cliniques TEWL référencées (sain ≤ 15 g/m²/h, altéré ≥ 25)',
  'acc.rm4.r':
    'Le calcul numérique σL* → TEWL suit Stamatas 2011 (et non Akdeniz). Validation croisée prévue.',

  'acc.bench.eyebrow': 'Benchmark public · UTKFace · 26 mai 2026',
  'acc.bench.h2a': 'Comparé publiquement',
  'acc.bench.h2b': 'à 3 références open source.',
  'acc.bench.p':
    'VYVRE v7.0 testé sur 300 visages publics UTKFace (stratifiés 18-80 ans) aux côtés de DeepFace, InsightFace et OpenCV DNN. Verdict publié sans retouche, code reproductible, 5 scripts, 4 min d’exécution.',
  'acc.bench.k1.l': '30-44 (cible)',
  'acc.bench.k1.n': 'MAE — devant OpenCV (8,66 ans)',
  'acc.bench.k2.l': 'Ensemble (18-80)',
  'acc.bench.k2.n': 'MAE — derrière les réseaux profonds',
  'acc.bench.k3.l': 'Biais signé',
  'acc.bench.k3.n': 'Le plus neutre des 4 moteurs',
  'acc.bench.cta': 'Voir le benchmark complet →',

  'acc.s3.eyebrow': '03 · Standards colorimétriques (fondations)',
  'acc.s3.p':
    'Standards normatifs sous-jacents — pas des articles revus par les pairs, mais des spécifications techniques actives dans la chaîne de traitement.',
  'acc.s3.std1': 'Espace colorimétrique sRGB (décodage gamma)',
  'acc.s3.std2': 'Primaires RVB Rec. 709',
  'acc.s3.std3': 'Conversion XYZ → L*a*b*',
  'acc.s3.std4': 'Limites Fitzpatrick par ITA°',
  'acc.s3.std5': 'Détection des pixels de peau YCbCr',
  'acc.s3.std6': 'Mesure de netteté laplacienne',
  'acc.s3.std7':
    'Corrélation fermeté ↔ âge perçu (r=0,65 entre distance ITA° et fermeté perçue)',

  'acc.s4.eyebrow': '04 · Chaîne de traitement',
  'acc.s4.h2': 'Méthode de calcul.',
  'acc.st1.t': 'Capture de l’image',
  'acc.st1.d':
    'Webcam standard (≥ 720p). Moins de 10 secondes de capture, 8 images retenues. Détection du visage par face-api.js (68 repères). Recadrage de la zone faciale et correction de lumière.',
  'acc.st2.t': 'Conversion colorimétrique',
  'acc.st2.d':
    'Chaîne sRGB → XYZ → CIE L*a*b* (IEC 61966-2-1, CIE 015:2004). Autotest sur 6 couleurs de référence à chaque scan. Précision au pixel.',
  'acc.st3.t': 'Extraction des signaux',
  'acc.st3.d':
    'ITA° + Melanin Index + Erythema Index + proxy TEWL + ratio spéculaire. 4 zones du visage analysées (front, joues gauche et droite, zone T).',
  'acc.st4.t': 'Conversion en biomarqueurs',
  'acc.st4.d':
    'Chaque signal brut converti en score 0-100 par des formules revues par les pairs (citations ci-dessus). Constantes nommées avec leur source, ou signalées comme empiriques.',
  'acc.st5.t': 'Détection du phototype',
  'acc.st5.d':
    'Classification automatique Fitzpatrick I-VI par ITA° (Chardon 1991). Bornes de pigmentation adaptées au phototype pour éviter le biais sur peaux foncées.',
  'acc.st6.t': 'Estimation de l’âge + intervalle',
  'acc.st6.d':
    'Formule à biomarqueur unique (rides périorbitaires dominantes, Bazin 2007). Écart d’âge perçu dépendant de l’âge (Vierkötter 2012). Intervalle ±5 ans (95 %, cohorte interne n=12).',

  'acc.s5.eyebrow': '05 · Âge de la peau · Méthode v7',
  'acc.s5.h2a': 'Âge de peau perçu',
  'acc.s5.h2b': 'ou âge biologique brut.',
  'acc.s5.p': 'Deux nombres sont calculés, un seul est affiché. Voici pourquoi.',
  'acc.age.l.tag': 'Affiché — Âge de la peau',
  'acc.age.l.h3': 'Âge perçu visuellement',
  'acc.age.l.p':
    'Âge moyen perçu socialement par un observateur humain. Calibré sur Vierkötter & Krutmann 2012 (cohorte caucasienne ~1 700 sujets) avec un écart',
  'acc.age.l.pEm': 'dépendant de l’âge',
  'acc.age.l.li1': '< 30 ans bio → −2 ans',
  'acc.age.l.li2': '30-45 ans bio → −4 ans',
  'acc.age.l.li3': '45-60 ans bio → −5 ans',
  'acc.age.l.li4': '60 ans et + bio → −5 à −6 ans',
  'acc.age.l.note':
    'La v7 retire la correspondance par phototype de la v6, absente de la source d’origine. Le phototype influence l’âge biologique (Diridollou), pas la perception sociale.',
  'acc.age.r.tag': 'Interne — Âge biologique',
  'acc.age.r.h3': 'Âge biologique brut',
  'acc.age.r.p':
    'Estimation directe de l’état physique de la peau via le score de rides dominant (rides périorbitaires, Bazin 2007). Corrélation r=0,78 avec l’âge chronologique sur photos en studio.',
  'acc.age.r.note1': 'Formule v7 :',
  'acc.age.r.note2':
    'Le facteur 0,85 (pénalité webcam JPEG) est une compensation empirique assumée ; validation sur cohorte large prévue fin 2026.',
  'acc.age.prec1': 'Précision estimée :',
  'acc.age.prec.bio': '±5 ans âge biologique',
  'acc.age.prec.perc': '±4 ans âge perçu',
  'acc.age.prec2': '(IC 95 % sur cohorte interne n=12)',
  'acc.age.prec3': 'Validation externe n=100 prévue fin 2026',

  'acc.s6.eyebrow': '06 · Comportement selon la qualité · v7',
  'acc.s6.h2a': '3 niveaux de confiance.',
  'acc.s6.h2b': 'Aucun arrangement flatteur.',
  'acc.s6.p':
    'La v7 retire le correctif v6.2 qui rajeunissait artificiellement les scans dégradés (paradoxe « moins le moteur voit, plus il flatte »). À la place, 3 niveaux de confiance explicites.',
  'acc.q1.tag': 'Qualité < 40',
  'acc.q1.h3': 'Refus du scan',
  'acc.q1.p1': 'Aucune estimation publiée. Message',
  'acc.q1.p2':
    'avec recommandation de refaire le scan dans une meilleure lumière. L’estimation n’est pas calculée.',
  'acc.q2.tag': '40 ≤ Qualité < 60',
  'acc.q2.h3': 'Confiance faible',
  'acc.q2.p1': 'Estimation au mieux publiée, mais signalée',
  'acc.q2.p2':
    '. Intervalle élargi à ±7 ans (contre ±5 en standard). L’estimation reste honnête, non décalée.',
  'acc.q3.tag': 'Qualité ≥ 60',
  'acc.q3.h3': 'Standard',
  'acc.q3.p1': 'Estimation standard avec',
  'acc.q3.p2':
    '. Intervalle ±5 ans (95 % sur cohorte interne n=12). Comportement nominal pour une webcam HD bien éclairée.',
  'acc.s6.foot1': 'Correctif v6.2 retiré : −5 ans sur un scan dégradé (qualité < 45)',
  'acc.s6.foot2':
    'La v7 élargit l’intervalle plutôt que de décaler l’estimation (l’honnêteté plutôt que la flatterie)',

  'acc.s7.eyebrow': '07 · Tests de variance',
  'acc.s7.h2': 'Reproductibilité.',
  'acc.s7.p':
    'Test : même sujet scanné 10 fois dans 10 conditions de lumière différentes. Mesure de l’écart-type des scores. Cohorte interne n=12.',
  'acc.var1': 'Rides',
  'acc.var2': 'Fermeté',
  'acc.var3': 'Pigmentation',
  'acc.var4': 'Hydratation',
  'acc.var5': 'Éclat',
  'acc.var6': 'Pores',
  'acc.var7': 'Rougeur',
  'acc.var8': 'Âge perçu',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': 'ans',
  'acc.s7.foot1':
    'Cohorte interne · n=12 sujets phototypes I-IV · 10 scans/sujet · lumière variable · webcam HD 720p',
  'acc.s7.foot2':
    'Phototypes V-VI : extrapolation Diridollou 2007 — validation sur cohorte dédiée prévue fin 2026',
  'acc.s7.foot3': 'Validation externe n=100 prévue fin 2026',

  'acc.s8.eyebrow': '08 · Feuille de route de validation',
  'acc.s8.h2a': 'Ce que nous nous engageons',
  'acc.s8.h2b': 'à valider.',
  'acc.q.late2026': 'fin 2026',
  'acc.q.q42026': 'T4 2026',
  'acc.rd1.t': 'Validation sur cohorte externe n=100',
  'acc.rd1.b':
    'Recrutement de 100 sujets variés (20-75 ans, phototypes I-VI). Mesure de la concordance avec les appareils Visia / Antera de référence. Publication méthodologique.',
  'acc.rd2.t': 'Grade morphologique Bazin 0-5',
  'acc.rd2.b':
    'Extraction depuis les images du grade morphologique Bazin (atlas vol. 1, chap. 4) — aujourd’hui seuls l’âge d’ancrage 40 et la corrélation r=0,78 sont utilisés. Implémentation de la détection de profondeur des rides et de la classification 0-5.',
  'acc.rd3.t': 'Coefficients par phototype (Diridollou + Flament)',
  'acc.rd3.b':
    'Extraction des coefficients de Diridollou 2007 et Flament 2023 pour rides / fermeté / pigmentation par phototype. La v7 applique aujourd’hui un ajustement modeste de −4 % à −8 % sur l’âge biologique des phototypes IV-VI ; objectif : correspondance complète par phototype avec les coefficients sources.',
  'acc.rd4.t': 'Publication revue par les pairs',
  'acc.rd4.b':
    'Soumission d’un article méthodologique décrivant la chaîne VYVRE (webcam grand public → biomarqueurs CIE L*a*b* → estimation d’âge) avec validation sur cohorte n=100. Cible : Int J Cosmet Sci ou Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Limites',
  'acc.s9.h2a': 'Ce que VYVRE',
  'acc.s9.h2b': 'ne fait pas.',
  'acc.s9.p':
    'Nous préférons être radicalement honnêtes sur ce que le moteur ne mesure pas, plutôt que de vendre du rêve.',
  'acc.lim1.t': 'VYVRE n’est pas un dispositif médical',
  'acc.lim1.b':
    'Le moteur ne pose aucun diagnostic médical. Il ne détecte pas les pathologies dermatologiques (cancer cutané, mélanome, dermatite, psoriasis, etc.). Pour toute préoccupation médicale, consultez un dermatologue.',
  'acc.lim2.t': 'Une webcam standard n’est pas un scanner professionnel',
  'acc.lim2.b':
    'Un scanner dermatologique professionnel utilise lumière polarisée, fluorescence UV et capteur 3D. VYVRE s’appuie sur une webcam standard et une lumière non contrôlée. Variance ±8 % (contre ±2 % en cabinet).',
  'acc.lim3.t': 'Pas de détection 3D des rides',
  'acc.lim3.b':
    'La profondeur réelle des rides demande un capteur stéréoscopique. VYVRE estime la sévérité par l’analyse colorimétrique des ombres (approche 2D). Fiable sur les rides marquées, moins précis sur les ridules naissantes.',
  'acc.lim4.t': 'Hyperpigmentation profonde non détectée',
  'acc.lim4.b':
    'Les taches pigmentaires sous-épidermiques (mélasma profond, taches actiniques anciennes) ne sont pas visibles en lumière visible. Il faudrait une caméra à fluorescence UV (non incluse).',
  'acc.lim5.t': 'Phototypes V-VI : extrapolation assumée',
  'acc.lim5.b':
    'La cohorte interne n=12 contient surtout des phototypes I-IV. Les ajustements pour V-VI sont extrapolés des données de Diridollou 2007 (−4 % à −8 % sur l’âge biologique). Validation sur cohorte dédiée prévue fin 2026.',
  'acc.lim6.t': 'Maquillage, lunettes, masque',
  'acc.lim6.b':
    'Le moteur détecte ces obstructions et baisse le score de qualité. Si la qualité est trop faible (< 40), le scan est refusé. Entre 40 et 60, le résultat est publié avec un signalement explicite de confiance faible et un intervalle élargi.',
  'acc.lim7.t': 'La cohorte interne n=12 est petite — nous l’assumons',
  'acc.lim7.b':
    'Les coefficients empiriques (pénalité webcam JPEG, largeur d’intervalle) sont calibrés sur 12 sujets. C’est un groupe de test, pas une cohorte clinique. La validation externe n=100 est inscrite à la feuille de route fin 2026.',

  'acc.s10.eyebrow': '10 · Module complémentaire · Conditions cutanées (v1 indicatif)',
  'acc.s10.h2a': 'Détection visuelle de 4 conditions',
  'acc.s10.h2b': 'indicative, jamais médicale.',
  'acc.s10.p1': 'Module séparé',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — chargement optionnel sur n’importe quelle démonstration. Détecte par heuristiques d’image 4 conditions visuelles fréquentes et propose une routine cosmétique ciblée, hors prescription.',
  'acc.s10.p3': 'Ce module ne pose aucun diagnostic médical.',
  'acc.cond.sens': 'Sensibilité',
  'acc.cond.spec': 'Spécificité',
  'acc.cond.cohort': 'cohorte de synthèse n=12',
  'acc.cond1.a': 'Module · Acné',
  'acc.cond1.t': 'Érythème a* CIELAB localisé + variance de texture L*',
  'acc.cond1.c':
    'Détection de pixels érythémateux concentrés en points distincts sur la zone T (front, nez, menton). Sortie : probabilité + sévérité (minimale, faible, moyenne, élevée).',
  'acc.cond2.a': 'Module · Rosacée',
  'acc.cond2.t': 'Excès médian a* joues + nez par rapport à la base + symétrie bilatérale',
  'acc.cond2.c':
    'Érythème persistant et bilatéral sur les joues et le nez. La symétrie entre les joues pondère le score (la rosacée est bilatérale).',
  'acc.cond3.a': 'Module · Mélasma',
  'acc.cond3.t': 'ΔL* front et lèvre supérieure vs quartile haut L* des joues + Δb* (mélanine)',
  'acc.cond3.c':
    'Hyperpigmentation symétrique du centre du visage (front, lèvre supérieure, pommettes). Distingue un mélasma diffus de taches distinctes.',
  'acc.cond4.a': 'Module · Lentigos',
  'acc.cond4.t': 'Détection de taches (taille 5-200 px², compacité ≥ 0,45)',
  'acc.cond4.c':
    'Taches pigmentaires isolées, aux contours nets, sur les joues et le front. Nombre de taches qualifiées rapporté à la surface de peau (densité pour 1 000 pixels).',
  'acc.s10.why.t': 'Pourquoi des heuristiques plutôt qu’un réseau de neurones ?',
  'acc.s10.why1':
    'Les jeux de données ISIC / DermNet contiennent des images cliniques en gros plan, en lumière polarisée, centrées sur la lésion. Une distribution très éloignée d’une webcam grand public à 50 cm sous lumière non contrôlée : un modèle entraîné dessus transférerait mal sans réapprentissage sur une cohorte VYVRE dédiée.',
  'acc.s10.why2':
    'Les heuristiques restent auditables ligne par ligne, ce qu’un modèle opaque n’est pas. Compatible avec les exigences d’explicabilité des grandes maisons.',
  'acc.s10.why3':
    'Aucun modèle à télécharger (0 Mo), aucun processeur graphique requis, fonctionne sur tous les navigateurs en moins de 200 ms.',
  'acc.s10.why4a': 'Architecture stable : une v2 pourra substituer un modèle appris derrière la même interface',
  'acc.s10.why4b': 'sans casser les intégrations existantes.',
  'acc.s10.disc.t': 'Avertissement médical (obligatoire sur tout affichage)',
  'acc.s10.disc.b':
    'Ce module n’est pas un dispositif médical. Il ne pose aucun diagnostic. Les probabilités retournées sont des indicateurs de zones d’attention, destinés à recommander une routine cosmétique ciblée. Pour toute préoccupation cutanée réelle, consultez un dermatologue.',
  'acc.s10.cta1': 'Voir la démonstration Conditions →',
  'acc.s10.cta2': 'Code source du module',

  'acc.s11.eyebrow': '11 · Garde-fou qualité · Engagement d’honnêteté',
  'acc.s11.h2a': 'Préférer l’honnêteté',
  'acc.s11.h2b': 'à la fausse précision.',
  'acc.s11.p1':
    'La v7.0 retire les correctifs v6.2 qui flattaient artificiellement l’utilisateur : rajeunissement caché de 5 ans sur webcam dégradée, plafonds [20, 50] qui ramenaient un sujet de 80 ans à 50, correspondance par phototype inventée hors source.',
  'acc.s11.p2':
    'Si la peau réelle de l’utilisateur fait 38 ans pour un dermatologue, le moteur doit dire 38. Pas 28 (mensonge flatteur). Pas 44 (fausse brutalité). Une vraie estimation.',

  'acc.cta.h2a': 'Questions techniques ?',
  'acc.cta.h2b': 'Demandez le DPA complet.',
  'acc.cta.p':
    'Nous envoyons sur demande aux DPO, dermatologues consultants et équipes R&D : DPA, méthodologie détaillée, rapport de précision, code source du moteur audité.',
  'acc.cta.1': 'Demander la documentation →',
  'acc.cta.2': '← Retour',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Tarifs · VYVRE',
  'pri.meta.desc':
    'Diagnostic de peau mesuré, hébergé en France. Pilot gratuit, Starter 299 €/mois, Growth 499 €/mois, Enterprise à partir de 699 €/mois.',

  'pri.banner1': 'Vous venez de tester la démonstration {brand}',
  'pri.banner2': '— Choisissez votre plan pour l’activer sur votre site.',

  'pri.hero.eyebrow': 'Tarification · VYVRE Business',
  'pri.hero.h1a': 'Le prix est',
  'pri.hero.h1b': 'sur la page.',
  'pri.hero.p': 'Hébergement France · RGPD natif · Aucune photo conservée',

  'pri.toggle.monthly': 'Mensuel',
  'pri.toggle.annual': 'Annuel',
  'pri.theme.label': 'Thème de votre widget',
  'pri.theme.dark': 'Noir',
  'pri.theme.light': 'Blanc',
  'pri.theme.note': 'Votre diagnostic s’affichera dans ce thème · modifiable ensuite',

  'pri.card.plan': 'Plan',
  'pri.card.recommended': 'Recommandé',
  'pri.per.month': '/mois',

  'pri.pilot.price': 'Gratuit',
  'pri.pilot.sub': '30 jours · sans engagement',
  'pri.pilot.f1': '1 000 scans / mois',
  'pri.pilot.f2': 'SDK Web',
  'pri.pilot.f3': 'Marquage VYVRE',
  'pri.pilot.f4': 'Support e-mail sous 48 h',
  'pri.pilot.f5': 'Infrastructure France',
  'pri.pilot.cta': 'Démarrer gratuitement',

  'pri.starter.subA': '2 990 € / an · 2 mois offerts',
  'pri.starter.subM': '5 000 scans / mois',
  'pri.starter.f1': '5 000 scans / mois',
  'pri.starter.f2': '0,02 € par scan supplémentaire',
  'pri.starter.f3': 'SDK Web + iOS + Android',
  'pri.starter.f4': 'Marque blanche complète',
  'pri.starter.f5': 'SLA 99,9 % · support prioritaire',
  'pri.starter.cta': 'Démarrer l’essai gratuit',

  'pri.growth.subA': '4 990 € / an · 2 mois offerts',
  'pri.growth.subM': '15 000 scans / mois',
  'pri.growth.f1': '15 000 scans / mois',
  'pri.growth.f2': '0,015 € par scan supplémentaire',
  'pri.growth.f3': 'Tout Starter, plus :',
  'pri.growth.f4': 'Multi-marques (jusqu’à 5)',
  'pri.growth.f5': 'Responsable de compte dédié',
  'pri.growth.cta': 'Choisir Growth',

  'pri.ent.subA': 'à partir de · contrat sur mesure',
  'pri.ent.subM': 'à partir de · sans engagement',
  'pri.ent.f1': '25 000 scans / mois',
  'pri.ent.f2': '0,01 € par scan supplémentaire',
  'pri.ent.f3': 'Réseau de boutiques illimité',
  'pri.ent.f4': 'Application mobile native',
  'pri.ent.f5': 'SLA 99,99 % · astreinte 24/7',
  'pri.ent.cta': 'Nous contacter',

  'pri.trust': 'Tarification publique · TVA en supplément · Annulation à tout moment',

  'pri.args.eyebrow': 'Pourquoi nous choisir',
  'pri.args.h2a': 'Pourquoi VYVRE',
  'pri.args.h2b': 'et pas les autres ?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': 'Le seul module de diagnostic peau entièrement français',
  'pri.arg1.b': 'Infrastructure hébergée en France, équipe à Paris, DPA signé.',
  'pri.arg1.n': 'Les solutions comparables sont hébergées hors Union européenne.',
  'pri.arg2.e': '−90 % sur la facture',
  'pri.arg2.t1': 'Jusqu’à 10× moins cher',
  'pri.arg2.t2': 'que la concurrence',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'à partir de 299 € / mois',
  'pri.arg2.b3':
    '(3 588 € / an). SkinConsult AI démarre à ~50 000 € / an + 30 000 € de mise en place, Perfect Corp à ~30 000 € / an.',
  'pri.arg2.n': 'Tableau comparatif détaillé plus bas sur cette page.',
  'pri.arg3.e': 'Activation en 48 h',
  'pri.arg3.t': 'Code d’intégration envoyé après paiement',
  'pri.arg3.b1': 'Vous collez',
  'pri.arg3.b2': 'sur votre site, c’est en ligne.',
  'pri.arg3.n': 'Pas de réunion de démarrage, pas d’intégrateur tiers facturé.',
  'pri.arg4.e': 'Sans engagement',
  'pri.arg4.t': 'Résiliation en un clic',
  'pri.arg4.b':
    'Passage à un plan inférieur ou supérieur, ou résiliation, depuis votre tableau de bord. Aucun verrouillage contractuel, aucune pénalité.',
  'pri.arg4.n': 'Vous gardez l’export de toutes vos données de scan.',
  'pri.arg5.e': 'Marque blanche totale',
  'pri.arg5.t': 'Votre marque, pas la nôtre',
  'pri.arg5.b':
    'Logo, couleurs, typographie, produits recommandés — tout est réglé sur votre charte.',
  'pri.arg5.n': 'Aucune mention « Powered by VYVRE » imposée dès le plan Starter.',
  'pri.arg6.e': 'Science revue par les pairs',
  'pri.arg6.t': 'Une mesure, pas une simulation',
  'pri.arg6.b':
    'Colorimétrie CIE L*a*b*, 68 repères de visage, indices dérivés de la littérature dermatologique.',
  'pri.arg6.n': 'Bibliographie : Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Comparatif marché · prix publics constatés 2025',
  'pri.tbl.h1': 'Solution',
  'pri.tbl.h2': 'Tarif annuel (entrée)',
  'pri.tbl.h3': 'Mise en place / intégration',
  'pri.tbl.h4': 'Hébergement',
  'pri.tbl.h5': 'Activation',
  'pri.tbl.from': 'À partir de',
  'pri.tbl.month': '/mois',
  'pri.tbl.year': '/an',
  'pri.tbl.fromApprox': 'à partir de',
  'pri.tbl.onQuote': 'sur devis',
  'pri.tbl.france': 'France',
  'pri.tbl.w812': '8-12 sem.',
  'pri.tbl.w12': '12 sem. et +',
  'pri.tbl.w68': '6-8 sem.',
  'pri.tbl.note':
    'Tarifs concurrents : ordres de grandeur publics constatés (appels d’offres de marques cosmétiques 2024-2025).',

  'pri.del.eyebrow': 'Mise en route · dès la seconde du paiement',
  'pri.del.h2a': 'Ce que vous obtenez,',
  'pri.del.h2b': 'dès la confirmation Stripe.',
  'pri.del1.t': 'E-mail de bienvenue',
  'pri.del1.b': 'Avec votre lien d’administration personnel et vos identifiants.',
  'pri.del2.t': 'Code d’intégration prêt à coller',
  'pri.del3.t': 'Catalogue produits pré-rempli',
  'pri.del3.b':
    '30 à 60 de vos produits repris depuis votre site, déjà associés aux biomarqueurs.',
  'pri.del4.t': 'Habillage à votre marque',
  'pri.del4.b':
    'Logo, palette de couleurs et nom de marque appliqués au module et au tableau de bord.',
  'pri.del5.t': 'Tableau de bord analytique',
  'pri.del5.b':
    'Scans par jour, taux de conversion, biomarqueurs moyens, produits les plus recommandés.',
  'pri.del6.t': 'Export RGPD complet',
  'pri.del6.b':
    'Vous gardez l’intégralité de vos données de scan, exportables en CSV à tout moment.',

  'pri.faq.eyebrow': 'Questions fréquentes',
  'pri.faq.h2a': 'Tout ce que vous voulez',
  'pri.faq.h2b': 'savoir.',
  'pri.faq1.q': 'Que se passe-t-il si je dépasse mon quota de scans ?',
  'pri.faq1.a':
    'Le service continue. Chaque scan supplémentaire est facturé entre 0,01 € et 0,02 € selon votre plan, sur la facture du mois suivant.',
  'pri.faq2.q': 'Où sont stockées les données des utilisatrices ?',
  'pri.faq2.a':
    'Exclusivement en France. Aucune photo conservée, aucun transfert hors Union européenne, DPA signé.',
  'pri.faq3.q': 'Puis-je changer de plan en cours de route ?',
  'pri.faq3.a':
    'Oui, à tout moment depuis votre tableau de bord. Passage au plan supérieur au prorata immédiat, passage au plan inférieur le mois suivant.',
  'pri.faq4.q': 'Quel niveau de support technique ?',
  'pri.faq4.a':
    'Support e-mail sous 48 h sur tous les plans. Support prioritaire avec responsable de compte dédié à partir de Growth.',
  'pri.faq5.q': 'Les produits recommandés sont-ils paramétrables ?',
  'pri.faq5.a':
    'Oui. Votre catalogue est entièrement modifiable : vous ajoutez, retirez et modifiez les produits depuis le tableau de bord.',

  'pri.cal.eyebrow': 'Pas encore prêt ?',
  'pri.cal.h2': 'Réservez une démonstration de 20 minutes',
  'pri.cal.p':
    'Charles, fondateur, vous montre le module en visioconférence et répond à toutes vos questions techniques et contractuelles.',
  'pri.cal.cta': 'Réserver 20 min →',

  /* ─────────── pages légales ─────────── */
  'legal.notice.t': 'Version française faisant foi',
  'legal.notice.b':
    'Le texte ci-dessous est volontairement laissé en français : seule la version française de ce document a valeur contractuelle. Les titres sont traduits pour la lecture. Une traduction de courtoisie peut être demandée à charles@symphonydrive.com.',
  'legal.updated': 'Dernière mise à jour :',
  'legal.version': 'Version 1.0 —',

  'cgv.meta.title': 'CGV · VYVRE',
  'cgv.meta.desc':
    'Conditions générales de vente VYVRE Business — abonnements SaaS B2B pour les marques cosmétiques.',
  'cgv.eyebrow': 'Conditions générales de vente',
  'cgv.h1': 'CGV.',
  'cgv.a1': 'Article 1 — Objet',
  'cgv.a2': 'Article 2 — Souscription et activation',
  'cgv.a3': 'Article 3 — Tarifs',
  'cgv.a4': 'Article 4 — Modalités de paiement',
  'cgv.a5': 'Article 5 — Durée et résiliation',
  'cgv.a6': 'Article 6 — Engagement de service (SLA)',
  'cgv.a7': 'Article 7 — Propriété des données',
  'cgv.a8': 'Article 8 — Limitation de responsabilité',
  'cgv.a9': 'Article 9 — Confidentialité et RGPD',
  'cgv.a10': 'Article 10 — Droit applicable et juridiction',

  'conf.meta.title': 'Politique de confidentialité · VYVRE',
  'conf.meta.desc':
    'Politique de confidentialité et protection des données personnelles VYVRE. Conformité RGPD.',
  'conf.eyebrow': 'Protection des données · RGPD',
  'conf.h1': 'Confidentialité.',
  'conf.b1': 'Responsable du traitement',
  'conf.b2': 'Données collectées par le scan de peau',
  'conf.b3': 'Hébergement des données',
  'conf.b4': 'Données collectées par le site web',
  'conf.b5': 'Données collectées lors d’un achat',
  'conf.b6': 'Base légale du traitement',
  'conf.b7': 'Durée de conservation',
  'conf.b8': 'Vos droits RGPD',
  'conf.b9': 'DPA (accord de traitement des données)',

  'ml.meta.title': 'Mentions légales · VYVRE',
  'ml.meta.desc': 'Mentions légales de VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Informations légales',
  'ml.h1': 'Mentions légales.',
  'ml.b1': 'Éditeur du site',
  'ml.b2': 'Directeur de la publication',
  'ml.b3': 'Hébergement',
  'ml.b4': 'Propriété intellectuelle',
  'ml.b5': 'Limitation de responsabilité',
  'ml.b6': 'Liens hypertextes',
  'ml.b7': 'Droit applicable',

  'dpa.meta.title': 'DPA · Accord de traitement des données · VYVRE',
  'dpa.meta.desc':
    'Accord de traitement des données (article 28 du RGPD) entre VYVRE et les clients B2B.',
  'dpa.eyebrow': 'Article 28 RGPD · Sous-traitant',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Parties',
  'dpa.b2': '2. Objet du traitement',
  'dpa.b3': '3. Catégories de données traitées',
  'dpa.b4': '4. Catégories de personnes concernées',
  'dpa.b5': '5. Durée du traitement',
  'dpa.b6': '6. Obligations du sous-traitant',
  'dpa.b7': '7. Mesures de sécurité (article 32 du RGPD)',
  'dpa.b8': '8. Sous-traitants ultérieurs',
  'dpa.b9': '9. Transferts hors Union européenne',
  'dpa.b10': '10. Audit et contrôle',
  'dpa.b11': '11. Notification de violation de données',
  'dpa.b12': '12. Restitution et suppression des données',
} as const;

export default fr;
