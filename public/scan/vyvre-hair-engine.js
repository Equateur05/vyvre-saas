/**
 * VYVRE HAIR ENGINE — ICE v1 (Indice Capillaire par Extraction)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 *
 * Moteur de scan CHEVEUX de vyvre.fr. Même contrat d'honnêteté que le moteur peau
 * (public/scan/vyvre-scan-engine.js) : tout ce qui sort d'ici est CALCULÉ depuis les
 * pixels. Aucune valeur inventée, aucun aléatoire, aucune simulation.
 *
 * RÈGLE ABSOLUE DU FICHIER
 *   - Une mesure impossible renvoie { valeur: null, raison: "..." }. Jamais un chiffre
 *     de remplacement, jamais une moyenne "plausible".
 *   - Chaque mesure porte sa méthode (comment c'est calculé) et sa limite (ce qui la
 *     fait mentir). Les limites sont écrites pour être lues par un auditeur hostile.
 *   - Le questionnaire pondère, il ne remplace jamais une mesure. Chaque score publie
 *     sa part mesurée et sa part déclarée.
 *
 * CE QUI EST MESURÉ ICI, ET CE QUI A PASSÉ LA VALIDATION
 *   Validation du 19/09/2026 sur 60+ chevelures annotées à la main
 *   (catalogue-cheveux/ICE_V1_VALIDATION.md). Résultat sans maquillage :
 *
 *   VALIDÉ, affichable :
 *     - boucle / type 1 à 4 : juste à 1 près 3 fois sur 4 (75 % sur 52 chevelures)
 *     - couleur L*a*b* : clair vs foncé juste 7 fois sur 10 (70 % sur 54 chevelures).
 *       Noir, brun foncé et châtain ne se séparent PAS : leurs L* se recouvrent.
 *     - qualité de prise et refus : 46 % d'un corpus difficile refusé avec une raison
 *
 *   CALCULÉ MAIS NON VALIDÉ — retiré des scores affichés, gardé dans `mesures` :
 *     - brillance   : Spearman -0,30 contre l'annotation. La mesure suit la NOIRCEUR
 *                     du cheveu, pas sa brillance (un reflet ajoute une lumière à peu
 *                     près constante : il ressort sur un cheveu noir, se noie sur un blond)
 *     - frizz       : Spearman -0,26 ; les photos n'ont pas la résolution d'un fil
 *     - sécheresse  : dérivée de la brillance, donc non validée elle aussi
 *     - casse, racines grasses : aucune vérité terrain, et l'éclairage du dessus
 *                     imite parfaitement des racines grasses
 *     - cheveux blancs : Spearman 0,15, trop faible
 *     - densité à la raie : raie trouvée sur 6 chevelures sur 58
 *
 *   DÉSACTIVÉ :
 *     - finesse de fibre : aucune période plausible trouvée sur 58 chevelures. Un cheveu
 *       fait 0,04-0,12 mm, un pixel de webcam 0,15-0,4 mm. Renvoie null, point.
 *
 *   JAMAIS MESURÉ (vient du questionnaire, étiqueté déclaré) :
 *     chute, pellicules, porosité, état du bulbe, dommage chimique interne.
 *
 *   ANGLE MORT CONNU ET NON CORRIGÉ : bonnet, casquette, foulard, casque, perruque.
 *   Le moteur mesure le tissu comme une chevelure. L'écran doit demander de se découvrir.
 *
 * SEGMENTATION SANS MODÈLE LOURD
 *   face-api.js (déjà chargé sur le site, modèles dans public/scan/models/faceapi) donne
 *   la boîte visage et/ou les 68 repères. La chevelure est apprise sur une bande juste
 *   au-dessus du front (graine), puis étendue par croissance de région en CIE L*a*b*,
 *   en excluant : la peau (test YCbCr Hsu 2002 + ellipse du visage), le fond lisse
 *   (énergie de gradient très inférieure à celle de la graine) et tout ce qui dépasse
 *   d'un cadre de tolérance autour de la tête. Le taux d'échec est renvoyé dans
 *   qualite.masque, pas caché.
 *
 * TOUT SE CALCULE SUR L'APPAREIL. Aucun octet n'est envoyé nulle part.
 *
 * API
 *   window.VYVRE_HAIR_ENGINE = {
 *     version: 'ice-v1',
 *     runHairScan(videoOrImage, options) -> Promise<{ mesures, scores, qualite, routine, limites, raw, debug }>,
 *     analyseFrame(imageData, roi),
 *     segmentCheveux(imageData, faceBoxOuLandmarks, options),
 *     composerRoutine(scores, reponses, produits, options),
 *     QUESTIONS, JEU_ESSAI_PRODUITS, ...helpers
 *   }
 *
 * Références utilisées (méthodes standard, pas de recette maison non sourcée) :
 *   - CIE 015:2004 § 8.2.1 — conversion sRGB → XYZ → L*a*b* (D65, observateur 2°)
 *   - Hsu et al. 2002, IEEE TPAMI 24(5):696-706 — seuil peau YCbCr
 *   - Pertuz et al. 2013, Pattern Recognition 46(5) — variance du laplacien = netteté
 *   - Bigün & Granlund 1987 — tenseur de structure, orientation locale et cohérence
 *   - Zhang & Suen 1984, CACM 27(3):236-239 — squelettisation, comptage d'extrémités
 *   - Shafer 1985 (modèle dichromatique) — le reflet spéculaire garde la couleur de la
 *     source, donc chroma basse + luminance haute : base de la mesure de brillance
 *   - Adam et al. 2022 / De la Mettrie 2007 — typologie de boucle 1 à 4 (indicative)
 *
 * Dernière mise à jour : 2026-09-19
 * Validation : catalogue-cheveux/ICE_V1_VALIDATION.md (lire AVANT de croire un chiffre)
 */
(function (global) {
  'use strict';

  var VERSION = 'ice-v1';
  var LOG = (global && global.VYVRE_DEBUG) ? console.log.bind(console, '[ice]') : function () {};

  // ════════════════════════════════════════════════════════════════════════
  // 0. OUTILS NUMÉRIQUES
  // ════════════════════════════════════════════════════════════════════════

  function clamp(min, max, v) { return v < min ? min : (v > max ? max : v); }

  function median(arr) {
    if (!arr || !arr.length) return null;
    var a = Float64Array.from(arr); a.sort();
    var n = a.length;
    return n % 2 ? a[(n - 1) >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2;
  }

  /** Percentile sur tableau NON trié (copie + tri). p en 0..100. */
  function percentile(arr, p) {
    if (!arr || !arr.length) return null;
    var a = Float64Array.from(arr); a.sort();
    var idx = clamp(0, a.length - 1, Math.round((p / 100) * (a.length - 1)));
    return a[idx];
  }

  function mean(arr) {
    if (!arr || !arr.length) return null;
    var s = 0; for (var i = 0; i < arr.length; i++) s += arr[i];
    return s / arr.length;
  }

  function std(arr) {
    if (!arr || arr.length < 2) return null;
    var m = mean(arr), s = 0;
    for (var i = 0; i < arr.length; i++) { var d = arr[i] - m; s += d * d; }
    return Math.sqrt(s / (arr.length - 1));
  }

  /** Median absolute deviation — dispersion robuste (insensible aux reflets). */
  function mad(arr) {
    var m = median(arr);
    if (m === null) return null;
    var dev = new Float64Array(arr.length);
    for (var i = 0; i < arr.length; i++) dev[i] = Math.abs(arr[i] - m);
    return median(dev);
  }

  /** Différence circulaire d'orientations non signées (période pi). */
  function diffOrientation(a, b) {
    var d = Math.abs(a - b) % Math.PI;
    return d > Math.PI / 2 ? Math.PI - d : d;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 1. COULEUR — sRGB → CIE L*a*b* (identique au moteur peau, recopié pour
  //    que ce fichier reste utilisable seul, sans dépendance)
  // ════════════════════════════════════════════════════════════════════════

  var SRGB_LINEAR_THRESHOLD = 0.04045;
  function srgbToLinear(c8) {
    var c = c8 / 255;
    return c <= SRGB_LINEAR_THRESHOLD ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  // ITU-R BT.709-6, blanc D65
  var D65_Xn = 95.047, D65_Yn = 100.0, D65_Zn = 108.883;
  var LAB_DELTA3 = Math.pow(6 / 29, 3);
  function labF(t) { return t > LAB_DELTA3 ? Math.cbrt(t) : (1 / (3 * Math.pow(6 / 29, 2))) * t + 4 / 29; }

  function rgbToLab(r, g, b) {
    var rl = srgbToLinear(r), gl = srgbToLinear(g), bl = srgbToLinear(b);
    var X = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) * 100;
    var Y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) * 100;
    var Z = (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) * 100;
    var fx = labF(X / D65_Xn), fy = labF(Y / D65_Yn), fz = labF(Z / D65_Zn);
    return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
  }

  /** Chroma C* = sqrt(a²+b²) et teinte h° (CIE LCh). */
  function labToLCh(a, b) {
    var C = Math.sqrt(a * a + b * b);
    var h = Math.atan2(b, a) * 180 / Math.PI;
    if (h < 0) h += 360;
    return { C: C, h: h };
  }

  /**
   * Test peau YCbCr (Hsu 2002 § 3.2, bornes valables toutes carnations).
   * Sert à EXCLURE la peau du masque cheveux, jamais à mesurer la peau.
   */
  function estPeau(r, g, b) {
    var cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    var cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 2. PRÉPARATION D'IMAGE
  //    Sous-échantillonnage par moyenne de blocs (box filter) : garde la
  //    photométrie (contrairement au plus proche voisin) et divise le coût.
  //    Toutes les mesures spatiales sont ensuite exprimées relativement à la
  //    taille de la tête, donc invariantes à ce facteur d'échelle.
  // ════════════════════════════════════════════════════════════════════════

  var LARGEUR_TRAVAIL = 384;   // px — compromis mesuré : < 3 s pour 3 frames sur MacBook
  var LARGEUR_TRAVAIL_MAX = 560;  // au-dela, le cout des mesures spatiales explose

  function preparerImage(imageData, largeurCible) {
    var W = imageData.width, H = imageData.height, src = imageData.data;
    largeurCible = Math.min(LARGEUR_TRAVAIL_MAX, largeurCible || LARGEUR_TRAVAIL);
    var pas = Math.max(1, Math.round(W / largeurCible));
    var w = Math.floor(W / pas), h = Math.floor(H / pas);
    var n = w * h;
    var R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
    var L = new Float32Array(n), A = new Float32Array(n), Bb = new Float32Array(n);
    var peau = new Uint8Array(n);
    var clip = 0;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var sr = 0, sg = 0, sb = 0, cnt = 0;
        for (var dy = 0; dy < pas; dy++) {
          var sy = y * pas + dy;
          if (sy >= H) break;
          var base = (sy * W + x * pas) * 4;
          for (var dx = 0; dx < pas; dx++) {
            if (x * pas + dx >= W) break;
            var o = base + dx * 4;
            sr += src[o]; sg += src[o + 1]; sb += src[o + 2];
            cnt++;
          }
        }
        if (!cnt) continue;
        var r = sr / cnt, g = sg / cnt, b = sb / cnt;
        var i = y * w + x;
        R[i] = r; G[i] = g; B[i] = b;
        var lab = rgbToLab(r, g, b);
        L[i] = lab.L; A[i] = lab.a; Bb[i] = lab.b;
        peau[i] = estPeau(r, g, b) ? 1 : 0;
        if ((r > 250 && g > 250 && b > 250) || (r < 3 && g < 3 && b < 3)) clip++;
      }
    }

    // Gradient de Sobel sur L* — énergie de texture (fils, bords, mèches).
    var grad = new Float32Array(n);
    var gx = new Float32Array(n), gy = new Float32Array(n);
    for (var yy = 1; yy < h - 1; yy++) {
      for (var xx = 1; xx < w - 1; xx++) {
        var k = yy * w + xx;
        var l00 = L[k - w - 1], l01 = L[k - w], l02 = L[k - w + 1];
        var l10 = L[k - 1], l12 = L[k + 1];
        var l20 = L[k + w - 1], l21 = L[k + w], l22 = L[k + w + 1];
        var vx = (l02 + 2 * l12 + l22) - (l00 + 2 * l10 + l20);
        var vy = (l20 + 2 * l21 + l22) - (l00 + 2 * l01 + l02);
        gx[k] = vx; gy[k] = vy;
        grad[k] = Math.sqrt(vx * vx + vy * vy);
      }
    }

    // Image en noir et blanc ? La chroma mediane de TOUTE l'image le dit. Sur une
    // image monochrome (photo N&B, scan ancien, filtre), a* et b* ne veulent plus rien
    // dire : la couleur, le ton et la part de blancs doivent etre refuses.
    var chromas = [];
    for (var ic = 0; ic < n; ic += 7) chromas.push(Math.sqrt(A[ic] * A[ic] + Bb[ic] * Bb[ic]));
    var chromaMedianeImage = median(chromas);

    return {
      w: w, h: h, pas: pas, largeurOrigine: W, hauteurOrigine: H,
      chromaMedianeImage: chromaMedianeImage,
      imageMonochrome: chromaMedianeImage < 2.0,
      R: R, G: G, B: B, L: L, a: A, b: Bb,
      peau: peau, grad: grad, gx: gx, gy: gy,
      partPixelsSatures: clip / n
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 3. GÉOMÉTRIE VISAGE
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Normalise l'entrée géométrique : on accepte
   *   - un faceBox { x, y, width, height } (coordonnées image d'origine)
   *   - un tableau de 68 repères face-api [{x,y}, ...]
   *   - un objet face-api { detection: { box }, landmarks: { positions } }
   * Renvoie { box, landmarks, ipdPx, source } ou null.
   */
  function normaliserGeometrie(entree) {
    if (!entree) return null;

    var landmarks = null, box = null, source = 'inconnu';

    if (Array.isArray(entree) && entree.length >= 68 && typeof entree[0].x === 'number') {
      landmarks = entree; source = 'landmarks68';
    } else if (entree.positions && entree.positions.length >= 68) {
      landmarks = entree.positions; source = 'landmarks68';
    } else if (entree.landmarks && (entree.landmarks.positions || Array.isArray(entree.landmarks))) {
      landmarks = entree.landmarks.positions || entree.landmarks; source = 'landmarks68';
      if (entree.detection && entree.detection.box) box = entree.detection.box;
    } else if (typeof entree.width === 'number' && typeof entree.height === 'number') {
      box = { x: entree.x || entree.left || 0, y: entree.y || entree.top || 0, width: entree.width, height: entree.height };
      source = 'faceBox';
    } else if (entree.box) {
      box = entree.box; source = 'faceBox';
    }
    // Un appelant peut fournir directement l'ecart inter-pupillaire (certains
    // detecteurs donnent les deux yeux sans les 68 reperes).
    var ipdFournie = (typeof entree.ipdPx === 'number' && entree.ipdPx > 0) ? entree.ipdPx : null;

    if (landmarks && !box) {
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (var i = 0; i < landmarks.length; i++) {
        minX = Math.min(minX, landmarks[i].x); maxX = Math.max(maxX, landmarks[i].x);
        minY = Math.min(minY, landmarks[i].y); maxY = Math.max(maxY, landmarks[i].y);
      }
      // Les 68 repères dlib s'arrêtent aux sourcils : la boîte visage réelle
      // remonte d'environ 25 % de la hauteur mesurée (front non couvert).
      var hh = maxY - minY;
      box = { x: minX, y: minY - hh * 0.25, width: maxX - minX, height: hh * 1.25 };
    }
    if (!box) return null;

    // Écart inter-pupillaire : barycentre des points 36-41 et 42-47 (norme dlib).
    var ipd = null;
    if (landmarks && landmarks.length >= 48) {
      var lx = 0, ly = 0, rx = 0, ry = 0, j;
      for (j = 36; j <= 41; j++) { lx += landmarks[j].x; ly += landmarks[j].y; }
      for (j = 42; j <= 47; j++) { rx += landmarks[j].x; ry += landmarks[j].y; }
      lx /= 6; ly /= 6; rx /= 6; ry /= 6;
      ipd = Math.sqrt((rx - lx) * (rx - lx) + (ry - ly) * (ry - ly));
    }

    return { box: box, landmarks: landmarks || null, ipdPx: ipd || ipdFournie, source: source };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 4. SEGMENTATION DE LA CHEVELURE
  // ════════════════════════════════════════════════════════════════════════

  var SEG = {
    // Bande graine : juste au-dessus du front, au centre du visage.
    GRAINE_HAUT: 0.42,        // × hauteur visage, au-dessus du haut de la boîte
    GRAINE_BAS: 0.04,
    GRAINE_LARGEUR: 0.55,     // × largeur visage
    // Ellipse du visage à exclure (peau) — un peu plus étroite que la boîte
    // pour laisser passer les cheveux qui retombent sur les tempes.
    ELLIPSE_RX: 0.44, ELLIPSE_RY: 0.47, ELLIPSE_CY: 0.52,
    // Cadre de tolérance autour de la tête (au-delà = vêtement / fond)
    // Cadre de tolerance ELLIPTIQUE autour de la tete (le rectangle large laissait
    // entrer les coins de l'image, ou vit le fond).
    CADRE_RX: 1.55, CADRE_RY: 1.85, CADRE_CY: 0.35,
    DIST_MIN: 8, DIST_MAX: 34,   // seuil de distance Lab, bornes dures
    POIDS_L: 0.35,               // la luminance pèse moins que la chroma :
                                 // une mèche à l'ombre reste la même couleur
    MASQUE_MIN: 0.012,           // part de l'image en dessous de laquelle on refuse
    MASQUE_MAX: 0.62             // au-dessus : la croissance a fui dans le fond
  };

  function distanceLab(p, i, mL, ma, mb) {
    var dL = p.L[i] - mL, da = p.a[i] - ma, db = p.b[i] - mb;
    return Math.sqrt(SEG.POIDS_L * dL * dL + da * da + db * db);
  }

  /** Distance au modele chevelure : clarte tolerante (intervalle), couleur stricte. */
  function distanceCheveu(p, i, Lmin, Lmax, ma, mb) {
    var L = p.L[i];
    var dL = L < Lmin ? Lmin - L : (L > Lmax ? L - Lmax : 0);
    var da = p.a[i] - ma, db = p.b[i] - mb;
    // A l'INTERIEUR de l'intervalle de clarte, la clarte ne coute rien ; a l'exterieur
    // elle coute PLEIN TARIF (poids 1 et non 0,35). Sans cela, une chemise blanche ou un
    // mur clair entrait dans le masque d'une chevelure foncee et la couleur sortait
    // "blond" (cas p_147, vu en rendant le masque).
    return Math.sqrt(dL * dL + da * da + db * db);
  }

  /**
   * segmentCheveux(imageData, faceBoxOuLandmarks, options)
   *
   * MÉTHODE
   *   1. Bande graine au-dessus du front → modèle chromatique robuste (médiane +
   *      MAD sur L*, a*, b*), seuil de distance = p85 des distances de la graine × 1.8.
   *   2. Croissance de région 4-connexe depuis la graine, refusée sur : peau (YCbCr),
   *      intérieur de l'ellipse visage, hors cadre de tolérance, distance > seuil.
   *   3. Nettoyage : filtre majoritaire 3×3, puis retrait des pixels "fond lisse"
   *      (énergie de gradient < 30 % de celle de la graine ET couleur limite),
   *      puis plus grande composante connexe contenant la graine.
   *   4. Diagnostic : couverture, contact avec le bord de l'image, ressemblance de la
   *      graine avec la peau. Tout est renvoyé, rien n'est lissé.
   *
   * LIMITES CONNUES (mesurées, voir ICE_V1_VALIDATION.md)
   *   - Cheveux foncés sur fond foncé : la croissance fuit dans le fond. Détecté par
   *     contactBord élevé et couverture > 62 % → masque refusé.
   *   - Chapeau, capuche, casque : segmenté comme "chevelure". Non détectable ici.
   *   - Crâne rasé / calvitie : la graine tombe sur la peau → seedRessembleAPeau = true,
   *     confiance effondrée, mesures couleur marquées non fiables.
   *   - Vêtement de la couleur des cheveux et cheveux longs : fuite partielle vers le bas.
   */
  function segmentCheveux(imageData, faceBoxOuLandmarks, options) {
    options = options || {};
    var p = options.prep || preparerImage(imageData, options.largeurTravail);
    var geo = normaliserGeometrie(faceBoxOuLandmarks);

    if (!geo) {
      return { ok: false, raison: 'aucune_geometrie_visage', masque: null, prep: p,
               note: 'face-api n a pas fourni de boite visage ni de reperes : sans le visage, on ne sait pas ou commence la chevelure.' };
    }

    var s = 1 / p.pas;
    var fx = geo.box.x * s, fy = geo.box.y * s;
    var fw = geo.box.width * s, fh = geo.box.height * s;
    var w = p.w, h = p.h;

    // --- 1. bande graine
    var gx0 = Math.round(fx + fw * (0.5 - SEG.GRAINE_LARGEUR / 2));
    var gx1 = Math.round(fx + fw * (0.5 + SEG.GRAINE_LARGEUR / 2));
    var gy0 = Math.round(fy - fh * SEG.GRAINE_HAUT);
    var gy1 = Math.round(fy - fh * SEG.GRAINE_BAS);
    gx0 = clamp(0, w - 1, gx0); gx1 = clamp(0, w - 1, gx1);
    gy0 = clamp(0, h - 1, gy0); gy1 = clamp(0, h - 1, gy1);

    if (gy1 - gy0 < 3 || gx1 - gx0 < 5) {
      return { ok: false, raison: 'chevelure_hors_cadre', masque: null, prep: p, geo: geo,
               note: 'la zone au-dessus du front sort de l image : reculer ou recadrer plus haut.' };
    }

    // --- reference PEAU personnalisee
    // Le seuil YCbCr generique (Hsu 2002) classe un cheveu chatain clair comme de la
    // peau : teste sur une chevelure synthetique RGB(70,48,35), Cb=118 et Cr=140 tombent
    // en plein dans la boite peau, et la graine etait entierement rejetee. On apprend
    // donc la peau SUR LE VISAGE DE LA PERSONNE (bande des joues, dans l ellipse) et on
    // exclut par distance CIE Lab a cette peau-la. Le test YCbCr ne sert plus que de
    // repli quand le visage n est pas exploitable.
    var refPeau = null;
    (function () {
      var px = [], py = [];
      var yJoue0 = Math.round(fy + fh * 0.45), yJoue1 = Math.round(fy + fh * 0.72);
      var xJ0 = Math.round(fx + fw * 0.12), xJ1 = Math.round(fx + fw * 0.88);
      var pl = [], pa = [], pb = [];
      for (var yy = Math.max(0, yJoue0); yy <= Math.min(h - 1, yJoue1); yy++) {
        for (var xx = Math.max(0, xJ0); xx <= Math.min(w - 1, xJ1); xx++) {
          var ii = yy * w + xx;
          // on ne garde que les pixels que le test generique reconnait comme peau :
          // dans cette bande du visage, c est une hypothese sure.
          if (!p.peau[ii]) continue;
          pl.push(p.L[ii]); pa.push(p.a[ii]); pb.push(p.b[ii]);
        }
      }
      if (pl.length < 60) return;
      var mL2 = median(pl), ma2 = median(pa), mb2 = median(pb);
      var dd = [];
      for (var q = 0; q < pl.length; q++) {
        var d1 = pl[q] - mL2, d2 = pa[q] - ma2, d3 = pb[q] - mb2;
        dd.push(Math.sqrt(SEG.POIDS_L * d1 * d1 + d2 * d2 + d3 * d3));
      }
      // Dispersion ROBUSTE : le percentile 90 des distances intra-joue integrait les
      // ombres et la bouche, le seuil saturait a 22 et la "peau" couvrait l image
      // entiere (vu en rendant le masque). La mediane des distances x 2.2, bornee a 14,
      // colle a la peau et a elle seule.
      refPeau = { L: mL2, a: ma2, b: mb2, seuil: clamp(5, 14, (median(dd) || 4) * 2.2), n: pl.length };
    })();

    // Carte de peau calculee UNE fois (la croissance de region visite chaque pixel
    // plusieurs fois : recalculer la distance a chaque visite coutait 380 ms).
    var peauLocale = p.peau;
    if (refPeau) {
      peauLocale = new Uint8Array(w * h);
      for (var ip = 0; ip < peauLocale.length; ip++) {
        peauLocale[ip] = distanceLab(p, ip, refPeau.L, refPeau.a, refPeau.b) < refPeau.seuil ? 1 : 0;
      }
    }
    function estPeauIci(i) { return !!peauLocale[i]; }

    // --- modeles de FOND, appris sur l'anneau exterieur de l'image.
    // Une croissance de region a seuil unilateral finit toujours par sortir dans le
    // fond (couverture mesuree jusqu'a 57 % de l'image). On apprend donc jusqu'a trois
    // couleurs dominantes du bord et un pixel n'est accepte que s'il est PLUS PROCHE du
    // modele chevelure que de la peau et de tous les fonds : classification au plus
    // proche modele, pas un seuil.
    var fonds = [];
    (function () {
      var ep = Math.max(2, Math.round(0.03 * Math.min(w, h)));
      var bins = {};
      function ajoute(i) {
        var kb = (Math.round(p.L[i] / 8) * 1000000) + (Math.round((p.a[i] + 128) / 8) * 1000) + Math.round((p.b[i] + 128) / 8);
        (bins[kb] = bins[kb] || { n: 0, L: 0, a: 0, b: 0 });
        bins[kb].n++; bins[kb].L += p.L[i]; bins[kb].a += p.a[i]; bins[kb].b += p.b[i];
      }
      var tot = 0;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          if (y >= ep && y < h - ep && x >= ep && x < w - ep) { x = w - ep - 1; continue; }
          ajoute(y * w + x); tot++;
        }
      }
      var liste = [];
      for (var kk in bins) if (Object.prototype.hasOwnProperty.call(bins, kk)) liste.push(bins[kk]);
      liste.sort(function (A, B) { return B.n - A.n; });
      for (var z = 0; z < Math.min(3, liste.length); z++) {
        if (liste[z].n < 0.08 * tot) break;
        fonds.push({ L: liste[z].L / liste[z].n, a: liste[z].a / liste[z].n, b: liste[z].b / liste[z].n, part: liste[z].n / tot });
      }
    })();

    // La graine ne doit contenir NI peau NI fond. C'est le point le plus fragile du
    // moteur : quand la bande au-dessus du front tombe sur un mur clair, le "modele
    // chevelure" devient le mur, tout le reste est coherent avec lui, et une chevelure
    // noire ressort a L* = 85 avec un masque juge pur a 96 %. Cas p_147, mesure.
    function estFond(i) {
      for (var z = 0; z < fonds.length; z++) {
        if (distanceLab(p, i, fonds[z].L, fonds[z].a, fonds[z].b) < 10) return true;
      }
      return false;
    }
    var sL = [], sa = [], sb = [], sg = [], nPeauGraine = 0, nGraine = 0, nFondGraine = 0;
    for (var y = gy0; y <= gy1; y++) {
      for (var x = gx0; x <= gx1; x++) {
        var i = y * w + x;
        nGraine++;
        if (estPeauIci(i)) { nPeauGraine++; continue; }
        if (estFond(i)) { nFondGraine++; continue; }
        sL.push(p.L[i]); sa.push(p.a[i]); sb.push(p.b[i]); sg.push(p.grad[i]);
      }
    }
    var partPeauGraine = nGraine ? nPeauGraine / nGraine : 1;
    var partFondGraine = nGraine ? nFondGraine / nGraine : 0;
    if (sL.length < Math.max(30, 0.12 * nGraine)) {
      return { ok: false, raison: 'graine_indistincte_du_fond', masque: null, prep: p, geo: geo,
               partPeauGraine: partPeauGraine, partFondGraine: partFondGraine,
               note: 'la zone au-dessus du front est soit de la peau, soit de la meme couleur que le fond : impossible d apprendre la couleur des cheveux sans risquer de segmenter le mur.' };
    }

    var mL = median(sL), ma = median(sa), mb = median(sb);
    var gradGraine = median(sg);
    // Une chevelure couvre une TRES large plage de clarte (de l'ombre entre les meches
    // au reflet). Modelisee par un point, seuls les pixels sombres restaient dans le
    // masque et la couleur sortait "noir" pour tout le monde. On modelise donc la
    // clarte par un INTERVALLE (distance nulle a l'interieur) et la couleur par un point.
    var Lmin = (percentile(sL, 10) || mL) - 12;
    var Lmax = (percentile(sL, 90) || mL) + 20;

    // seuil adaptatif : p85 des distances intra-graine × 1.8
    var dists = [];
    for (var k = 0; k < sL.length; k++) {
      var Lk = sL[k];
      var dL = Lk < Lmin ? Lmin - Lk : (Lk > Lmax ? Lk - Lmax : 0);
      var da = sa[k] - ma, db = sb[k] - mb;
      dists.push(Math.sqrt(dL * dL + da * da + db * db));
    }
    var seuil = clamp(SEG.DIST_MIN, SEG.DIST_MAX, (percentile(dists, 85) || 6) * 2.0 + 6);

    // --- 2. croissance de région
    var cx = fx + fw / 2, cy = fy + fh * SEG.ELLIPSE_CY;
    var rx = fw * SEG.ELLIPSE_RX, ry = fh * SEG.ELLIPSE_RY;
    var crx = fw * SEG.CADRE_RX, cry = fh * SEG.CADRE_RY;
    var ccx = fx + fw / 2, ccy = fy + fh * SEG.CADRE_CY;
    function dansCadre(x, y) {
      var u = (x - ccx) / crx, v = (y - ccy) / cry;
      return u * u + v * v <= 1;
    }

    function distMin(i, liste) {
      var best = Infinity;
      for (var z = 0; z < liste.length; z++) {
        var d = distanceLab(p, i, liste[z].L, liste[z].a, liste[z].b);
        if (d < best) best = d;
      }
      return best;
    }
    function plusProcheDuCheveu(i) {
      var dCheveu = distanceCheveu(p, i, Lmin, Lmax, ma, mb);
      if (dCheveu > seuil) return false;
      if (refPeau) {
        var dP = distanceLab(p, i, refPeau.L, refPeau.a, refPeau.b);
        if (dP < dCheveu) return false;
      }
      if (fonds.length) {
        var dF = distMin(i, fonds);
        if (dF < dCheveu) return false;
      }
      return true;
    }

    var masque = new Uint8Array(w * h);
    var file = new Int32Array(w * h);
    var tete = 0, queue = 0, total = 0;

    function pousser(idx) {
      if (masque[idx]) return;
      masque[idx] = 1; file[queue++] = idx; total++;
    }

    for (var yg = gy0; yg <= gy1; yg++) {
      for (var xg = gx0; xg <= gx1; xg++) {
        var ig = yg * w + xg;
        if (estPeauIci(ig)) continue;          // graine sur la peau : on ne l'ensemence pas
        if (estFond(ig)) continue;             // graine sur le fond : idem
        if (p.L[ig] > 98) continue;            // pixel cramé
        pousser(ig);
      }
    }
    var grainesUtiles = total;
    if (grainesUtiles < 12) {
      return { ok: false, raison: 'graine_vide', masque: null, prep: p, geo: geo,
               partPeauGraine: partPeauGraine,
               note: 'la bande au-dessus du front est de la peau ou du blanc pur : pas de chevelure exploitable (crane rase, calvitie frontale, ou cadrage trop bas).' };
    }

    var fuite = false;
    var maxPix = Math.round(SEG.MASQUE_MAX * w * h);
    while (tete < queue) {
      var cur = file[tete++];
      var cyy = (cur / w) | 0, cxx = cur - cyy * w;
      for (var d = 0; d < 4; d++) {
        var nx = cxx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        var ny = cyy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (!dansCadre(nx, ny)) continue;
        var ni = ny * w + nx;
        if (masque[ni]) continue;
        if (estPeauIci(ni)) continue;
        var ddx = (nx - cx) / rx, ddy = (ny - cy) / ry;
        if (ddx * ddx + ddy * ddy < 1) continue;          // intérieur du visage
        if (p.L[ni] > 98) continue;
        if (!plusProcheDuCheveu(ni)) continue;
        pousser(ni);
        if (total > maxPix) { fuite = true; break; }
      }
      if (fuite) break;
    }

    if (fuite) {
      return { ok: false, raison: 'fuite_dans_le_fond', masque: null, prep: p, geo: geo,
               couverture: total / (w * h), partPeauGraine: partPeauGraine,
               note: 'la chevelure et le fond ont la meme couleur : la region a debordé sur plus de 62 % de l image. Changer de fond ou d eclairage.' };
    }

    // --- 3. nettoyage
    // 3a. filtre majoritaire 3×3 (comble les trous d'un pixel, retire le bruit isolé)
    var m2 = new Uint8Array(masque);
    for (var y2 = 1; y2 < h - 1; y2++) {
      for (var x2 = 1; x2 < w - 1; x2++) {
        var idx = y2 * w + x2, c = 0;
        for (var dy2 = -1; dy2 <= 1; dy2++) for (var dx2 = -1; dx2 <= 1; dx2++) {
          if (dx2 || dy2) c += masque[idx + dy2 * w + dx2];
        }
        if (masque[idx] && c <= 2) m2[idx] = 0;
        else if (!masque[idx] && c >= 7) {
          var ddx2 = (x2 - cx) / rx, ddy2 = (y2 - cy) / ry;
          if (!(ddx2 * ddx2 + ddy2 * ddy2 < 1) && !estPeauIci(idx)) m2[idx] = 1;
        }
      }
    }

    // 3b. retrait du fond lisse : un fond uni a une énergie de gradient très
    //     inférieure à celle d'une chevelure (les fils créent du gradient).
    var seuilGrad = 0.30 * (gradGraine || 0);
    var retiresFond = 0;
    if (seuilGrad > 0.4) {
      for (var i3 = 0; i3 < m2.length; i3++) {
        if (!m2[i3]) continue;
        if (p.grad[i3] < seuilGrad && distanceCheveu(p, i3, Lmin, Lmax, ma, mb) > 0.45 * seuil) {
          m2[i3] = 0; retiresFond++;
        }
      }
    }

    // 3c. plus grande composante connexe contenant la graine
    var comp = composanteDepuisGraine(m2, w, h, gx0, gx1, gy0, gy1);
    var final = comp.masque, nFinal = comp.taille;

    // Hauteur de chevelure AU-DESSUS du front. Un crane rase ou une calvitie complete
    // n'en a pas : le masque reste colle au niveau du visage. Sans ce controle, le
    // moteur acceptait des cranes rases et mesurait la peau ou le fond.
    var hautMasque = h;
    for (var ih = 0; ih < final.length; ih++) {
      if (!final[ih]) continue;
      var yh = (ih / w) | 0;
      if (yh < hautMasque) hautMasque = yh;
    }
    var montee = (fy - hautMasque) / Math.max(1, fh);
    if (nFinal > 0 && montee < 0.10) {
      return { ok: false, raison: 'pas_de_chevelure_au_dessus_du_front', masque: null, prep: p, geo: geo,
               montee: Math.round(montee * 100) / 100,
               note: 'rien qui ressemble a une chevelure ne depasse au-dessus du front : crane rase, calvitie, ou tete coupee par le cadre.' };
    }

    var couverture = nFinal / (w * h);
    if (couverture < SEG.MASQUE_MIN) {
      return { ok: false, raison: 'masque_trop_petit', masque: null, prep: p, geo: geo,
               couverture: couverture, partPeauGraine: partPeauGraine,
               note: 'moins de 1,2 % de l image reconnue comme chevelure : cheveux tres courts, tete coupee par le cadre, ou couvre-chef.' };
    }

    // --- 4. diagnostic du masque
    var contactBord = 0, bordTotal = 0;
    for (var xb = 0; xb < w; xb++) {
      bordTotal += 2;
      if (final[xb]) contactBord++;
      if (final[(h - 1) * w + xb]) contactBord++;
    }
    for (var yb = 0; yb < h; yb++) {
      bordTotal += 2;
      if (final[yb * w]) contactBord++;
      if (final[yb * w + w - 1]) contactBord++;
    }

    var bbox = { x0: w, y0: h, x1: 0, y1: 0 };
    for (var yy2 = 0; yy2 < h; yy2++) for (var xx2 = 0; xx2 < w; xx2++) {
      if (final[yy2 * w + xx2]) {
        if (xx2 < bbox.x0) bbox.x0 = xx2; if (xx2 > bbox.x1) bbox.x1 = xx2;
        if (yy2 < bbox.y0) bbox.y0 = yy2; if (yy2 > bbox.y1) bbox.y1 = yy2;
      }
    }

    // Énergie de texture du masque vs graine : un masque qui a avalé du fond lisse
    // a un rapport très inférieur à 1.
    var gradMasque = [];
    for (var ig2 = 0; ig2 < final.length; ig2 += 3) if (final[ig2]) gradMasque.push(p.grad[ig2]);
    var ratioTexture = (gradGraine > 0.01 && gradMasque.length) ? (median(gradMasque) / gradGraine) : null;

    // PURETE DU MASQUE : part des pixels retenus qui sont encore, apres nettoyage,
    // plus proches du modele chevelure que de la peau et du fond. Le filtre majoritaire
    // et le rebouchage des trous peuvent faire entrer de la peau ou du fond ; sans cette
    // verification, une chevelure noire pouvait ressortir a L* = 85 avec une confiance
    // de masque de 0,96 (cas mesure).
    var nPur = 0, nTest = 0;
    for (var ip2 = 0; ip2 < final.length; ip2++) {
      if (!final[ip2]) continue;
      nTest++;
      if (plusProcheDuCheveu(ip2)) nPur++;
    }
    var purete = nTest ? nPur / nTest : 0;

    var alertes = [];
    if (partPeauGraine > 0.35) alertes.push('graine_proche_peau');
    if (contactBord / bordTotal > 0.35) alertes.push('masque_colle_au_bord');
    if (ratioTexture !== null && ratioTexture < 0.45) alertes.push('texture_faible_dans_le_masque');
    if (purete < 0.80) alertes.push('masque_impur_' + Math.round(purete * 100) + 'pc');
    if (couverture > 0.45) alertes.push('couverture_elevee');

    return {
      ok: true,
      masque: final, w: w, h: h, prep: p, geo: geo, bbox: bbox,
      taille: nFinal, couverture: couverture,
      // cadrage : largeur du visage rapportee a la largeur de l'image. Un scan de
      // chevelure n'a de sens que si la tete occupe vraiment le cadre.
      cadrage: geo.box.width / p.largeurOrigine,
      modele: { L: mL, a: ma, b: mb, Lmin: Lmin, Lmax: Lmax, seuil: seuil, gradGraine: gradGraine },
      refPeau: refPeau, peauLocale: peauLocale, fonds: fonds,
      graine: { x0: gx0, x1: gx1, y0: gy0, y1: gy1, partPeau: partPeauGraine,
                partFond: partFondGraine, pixels: grainesUtiles },
      contactBord: contactBord / bordTotal,
      ratioTexture: ratioTexture,
      purete: Math.round(purete * 100) / 100,
      retiresFond: retiresFond,
      alertes: alertes,
      confiance: confianceMasque(couverture, contactBord / bordTotal, ratioTexture, partPeauGraine, purete)
    };
  }

  function composanteDepuisGraine(m, w, h, gx0, gx1, gy0, gy1) {
    var vus = new Uint8Array(w * h);
    var out = new Uint8Array(w * h);
    var file = new Int32Array(w * h);
    var tete = 0, queue = 0, taille = 0;
    for (var y = gy0; y <= gy1; y++) for (var x = gx0; x <= gx1; x++) {
      var i = y * w + x;
      if (m[i] && !vus[i]) { vus[i] = 1; file[queue++] = i; }
    }
    while (tete < queue) {
      var cur = file[tete++];
      out[cur] = 1; taille++;
      var cy = (cur / w) | 0, cx = cur - cy * w;
      for (var d = 0; d < 8; d++) {
        var nx = cx + [1, -1, 0, 0, 1, 1, -1, -1][d];
        var ny = cy + [0, 0, 1, -1, 1, -1, 1, -1][d];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        var ni = ny * w + nx;
        if (m[ni] && !vus[ni]) { vus[ni] = 1; file[queue++] = ni; }
      }
    }
    return { masque: out, taille: taille };
  }

  /** Confiance du masque 0..1 — produit de quatre pénalités indépendantes. */
  function confianceMasque(couverture, contactBord, ratioTexture, partPeauGraine, purete) {
    var c = 1;
    if (typeof purete === 'number') c *= clamp(0.05, 1, Math.pow(purete, 2.5));
    if (couverture < 0.03) c *= couverture / 0.03;
    if (couverture > 0.42) c *= clamp(0.2, 1, 1 - (couverture - 0.42) / 0.25);
    c *= clamp(0.2, 1, 1 - contactBord / 0.6);
    if (ratioTexture !== null) c *= clamp(0.25, 1, ratioTexture / 0.8);
    c *= clamp(0.2, 1, 1 - partPeauGraine * 1.2);
    return Math.round(clamp(0, 1, c) * 100) / 100;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 5. OUTILS MORPHOLOGIQUES ET SPECTRAUX
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Transformée de distance au masque (chamfer 3-4, deux passes, Borgefors 1986).
   * Coût O(nombre de pixels), INDÉPENDANT du rayon : la version precedente faisait r
   * passes sur toute l'image et rendait le moteur inutilisable au-dela de 500 px de
   * largeur de travail (plusieurs dizaines de secondes par image, mesure faite).
   * Renvoie une Float32Array : 0 dans le masque, distance approchée en pixels dehors.
   */
  function distanceAuMasque(m, w, h) {
    var GRAND = 1e9;
    var d = new Float32Array(w * h);
    var i;
    for (i = 0; i < d.length; i++) d[i] = m[i] ? 0 : GRAND;
    var a = 1, b = Math.SQRT2;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        i = y * w + x;
        if (d[i] === 0) continue;
        var v = d[i];
        if (x > 0) v = Math.min(v, d[i - 1] + a);
        if (y > 0) {
          v = Math.min(v, d[i - w] + a);
          if (x > 0) v = Math.min(v, d[i - w - 1] + b);
          if (x < w - 1) v = Math.min(v, d[i - w + 1] + b);
        }
        d[i] = v;
      }
    }
    for (var y2 = h - 1; y2 >= 0; y2--) {
      for (var x2 = w - 1; x2 >= 0; x2--) {
        i = y2 * w + x2;
        if (d[i] === 0) continue;
        var v2 = d[i];
        if (x2 < w - 1) v2 = Math.min(v2, d[i + 1] + a);
        if (y2 < h - 1) {
          v2 = Math.min(v2, d[i + w] + a);
          if (x2 > 0) v2 = Math.min(v2, d[i + w - 1] + b);
          if (x2 < w - 1) v2 = Math.min(v2, d[i + w + 1] + b);
        }
        d[i] = v2;
      }
    }
    return d;
  }

  /** Dilatation de rayon r, obtenue par seuillage de la transformée de distance. */
  function dilater(m, w, h, r, dist) {
    var d = dist || distanceAuMasque(m, w, h);
    var out = new Uint8Array(w * h);
    for (var i = 0; i < out.length; i++) if (d[i] <= r) out[i] = 1;
    return out;
  }

  /**
   * Squelettisation Zhang-Suen 1984 (CACM 27(3):236-239), version complète à deux
   * sous-itérations. Utilisée seulement sur une petite zone (tiers bas de la
   * chevelure) pour compter les extrémités de fils : coût négligeable.
   */
  function zhangSuen(bin, w, h) {
    var img = new Uint8Array(bin), change = true, garde = 0;
    if (w * h > 400000) return img;   // garde-fou : zone trop grande, on ne squelettise pas
    function P(i) { return img[i] ? 1 : 0; }
    while (change && garde++ < 25) {
      change = false;
      for (var pass = 0; pass < 2; pass++) {
        var aSupprimer = [];
        for (var y = 1; y < h - 1; y++) {
          for (var x = 1; x < w - 1; x++) {
            var i = y * w + x;
            if (!img[i]) continue;
            var p2 = P(i - w), p3 = P(i - w + 1), p4 = P(i + 1), p5 = P(i + w + 1),
                p6 = P(i + w), p7 = P(i + w - 1), p8 = P(i - 1), p9 = P(i - w - 1);
            var B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
            if (B < 2 || B > 6) continue;
            var seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2], A = 0;
            for (var k = 0; k < 8; k++) if (seq[k] === 0 && seq[k + 1] === 1) A++;
            if (A !== 1) continue;
            if (pass === 0) {
              if (p2 * p4 * p6 !== 0) continue;
              if (p4 * p6 * p8 !== 0) continue;
            } else {
              if (p2 * p4 * p8 !== 0) continue;
              if (p2 * p6 * p8 !== 0) continue;
            }
            aSupprimer.push(i);
          }
        }
        if (aSupprimer.length) { change = true; for (var s = 0; s < aSupprimer.length; s++) img[aSupprimer[s]] = 0; }
      }
    }
    return img;
  }

  /** FFT radix-2 en place (tableaux de taille puissance de 2). */
  function fft(re, im) {
    var n = re.length, i, j = 0, k, m;
    for (i = 0; i < n - 1; i++) {
      if (i < j) { var tr = re[i]; re[i] = re[j]; re[j] = tr; var ti = im[i]; im[i] = im[j]; im[j] = ti; }
      k = n >> 1;
      while (k <= j) { j -= k; k >>= 1; }
      j += k;
    }
    for (var len = 2; len <= n; len <<= 1) {
      var ang = -2 * Math.PI / len;
      var wr = Math.cos(ang), wi = Math.sin(ang);
      for (i = 0; i < n; i += len) {
        var cr = 1, ci = 0;
        for (m = 0; m < len / 2; m++) {
          var ar = re[i + m], ai = im[i + m];
          var br = re[i + m + len / 2] * cr - im[i + m + len / 2] * ci;
          var bi = re[i + m + len / 2] * ci + im[i + m + len / 2] * cr;
          re[i + m] = ar + br; im[i + m] = ai + bi;
          re[i + m + len / 2] = ar - br; im[i + m + len / 2] = ai - bi;
          var ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 6. CONTEXTE DE MESURE
  // ════════════════════════════════════════════════════════════════════════

  /** Test peau au sens du visage de CETTE personne (repli sur le test generique). */
  function peauIci(ctx, i) {
    var pl = ctx.seg && ctx.seg.peauLocale;
    return pl ? !!pl[i] : !!ctx.p.peau[i];
  }

  /**
   * Contexte de mesure. Tableaux TYPES et UN SEUL tri de L* : la premiere version
   * appelait percentile() sept fois sur le meme tableau (sept tris de 40 000 valeurs)
   * et recopiait toute l'image pour en faire la moyenne — 800 ms pour rien, mesure faite.
   */
  function construireContexte(seg) {
    var p = seg.prep, m = seg.masque, w = seg.w, h = seg.h;
    var n = 0, i;
    for (i = 0; i < m.length; i++) if (m[i]) n++;
    var idx = new Int32Array(n), Ls = new Float32Array(n), as = new Float32Array(n),
        bs = new Float32Array(n), Cs = new Float32Array(n), gs = new Float32Array(n);
    var k = 0;
    for (i = 0; i < m.length; i++) {
      if (!m[i]) continue;
      idx[k] = i; Ls[k] = p.L[i]; as[k] = p.a[i]; bs[k] = p.b[i];
      Cs[k] = Math.sqrt(p.a[i] * p.a[i] + p.b[i] * p.b[i]);
      gs[k] = p.grad[i];
      k++;
    }
    var Ltri = Float32Array.from(Ls); Ltri.sort();
    function pc(p100) { return n ? Ltri[clamp(0, n - 1, Math.round(p100 / 100 * (n - 1)))] : null; }
    var Ctri = Float32Array.from(Cs); Ctri.sort();
    var Gtri = Float32Array.from(gs); Gtri.sort();
    var somme = 0;
    for (i = 0; i < p.L.length; i++) somme += p.L[i];

    var bb = seg.bbox;
    return {
      p: p, seg: seg, m: m, w: w, h: h, idx: idx,
      L: Ls, a: as, b: bs, C: Cs, g: gs, Ltri: Ltri,
      n: n,
      L50: pc(50), L90: pc(90), L95: pc(95), L99: pc(99), L10: pc(10),
      C50: n ? Ctri[(n - 1) >> 1] : null,
      g50: n ? Gtri[(n - 1) >> 1] : null,
      pcL: pc,
      bbox: bb, hauteurTete: Math.max(1, bb.y1 - bb.y0), largeurTete: Math.max(1, bb.x1 - bb.x0),
      LmoyenImage: p.L.length ? somme / p.L.length : 0
    };
  }

  /**
   * ETAT DE VALIDATION DE CHAQUE MESURE — resultat du banc du 19/09/2026
   * (60+ chevelures annotees a la main, voir catalogue-cheveux/ICE_V1_VALIDATION.md).
   *
   * Une mesure NON VALIDEE continue d'etre calculee et publiee dans `mesures` (c'est
   * un vrai nombre, calcule depuis les pixels), mais elle est EXCLUE des `scores`
   * destines a l'ecran : on ne montre pas a un client un chiffre dont on n'a pas
   * prouve qu'il veut dire quelque chose.
   */
  var VALIDATION = {
    boucle:         { validee: true,  accord: 'type a 1 pres 75 % (44 % exact) sur 52 chevelures' },
    couleur:        { validee: true,  accord: 'clair vs fonce 70 % sur 54 chevelures ; noir/brun/chatain ne se separent pas' },
    brillance:      { validee: false, accord: 'Spearman -0,30 contre l annotation visuelle sur 58 chevelures : la mesure suit la noirceur du cheveu, pas sa brillance' },
    frizz:          { validee: false, accord: 'Spearman -0,26 sur 38 chevelures ; resolution des photos insuffisante pour les fils isoles' },
    secheresse:     { validee: false, accord: 'derivee de la brillance, donc non validee elle aussi' },
    cassePointes:   { validee: false, accord: 'aucune verite terrain : rien ne prouve que la densite d extremites mesure une casse' },
    racinesGrasses: { validee: false, accord: 'aucune verite terrain, et confondue avec l eclairage par le dessus' },
    densiteRaie:    { validee: false, accord: 'raie trouvee sur 6 chevelures sur 58 ; correction jamais verifiee' },
    finesse:        { validee: false, accord: 'desactivee : aucune periode plausible trouvee sur 58 chevelures' },
    blancs:         { validee: false, accord: 'Spearman 0,15 contre l annotation : trop faible pour etre montre' }
  };

  function mesure(valeur, unite, methode, limite, fiabilite, extra) {
    var o = { valeur: valeur, unite: unite, methode: methode, limite: limite, fiabilite: fiabilite };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return o;
  }

  function mesureNulle(raison, methode, limite) {
    return { valeur: null, raison: raison, methode: methode, limite: limite, fiabilite: 'nulle' };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 7. LES MESURES
  // ════════════════════════════════════════════════════════════════════════

  /**
   * BRILLANCE — part et répartition des reflets spéculaires.
   *
   * MÉTHODE
   *   Modèle dichromatique (Shafer 1985) : un reflet spéculaire renvoie la couleur de
   *   la SOURCE, donc L* haut ET chroma C* basse par rapport au corps de la mèche.
   *   1. Écart relatif de luminance : (p95(L*) - p50(L*)) / p50(L*). Rapport, donc
   *      insensible au gain global de la caméra : c'est la correction d'exposition.
   *   2. Part spéculaire : pixels avec L* > p50 + 0.55·(p99 - p50) ET C* < 0.85·médiane(C*).
   *   3. Largeur de la bande brillante : profil ligne par ligne de la moyenne L* dans la
   *      chevelure ; largeur (en part de la hauteur de la tête) des lignes au-dessus de
   *      la mi-hauteur entre la ligne la plus claire et la médiane. Une bande étroite et
   *      intense = cheveu lisse et brillant ; une bande large et molle = diffusion, mat.
   *
   * LIMITE
   *   Un flash direct ou une fenêtre dans le dos fabriquent de la brillance qui n'est pas
   *   celle du cheveu. Des cheveux très foncés renvoient un reflet plus contrasté que des
   *   cheveux clairs à état égal : la mesure n'est comparable qu'à couleur voisine.
   *   Sous-exposée ou surexposée (pixels saturés > 3 %), la mesure est marquée peu fiable.
   */
  function mesureBrillance(ctx) {
    if (ctx.n < 200) return mesureNulle('masque_trop_petit', 'percentiles L* + part speculaire', 'moins de 200 pixels de chevelure');
    var p50 = ctx.L50, p95 = ctx.L95, p99 = ctx.L99;
    var michelson = (p95 - p50) / Math.max(1, p95 + p50);

    var seuilL = p50 + 0.55 * (p99 - p50);
    var seuilC = 0.85 * ctx.C50;
    var spec = 0;
    for (var i = 0; i < ctx.n; i++) if (ctx.L[i] > seuilL && ctx.C[i] < seuilC) spec++;
    var partSpec = spec / ctx.n;

    // profil vertical
    var bb = ctx.bbox, w = ctx.w;
    var lignes = [], yOf = [];
    for (var y = bb.y0; y <= bb.y1; y++) {
      var s = 0, c = 0;
      for (var x = bb.x0; x <= bb.x1; x++) {
        var k = y * w + x;
        if (ctx.m[k]) { s += ctx.p.L[k]; c++; }
      }
      if (c >= 8) { lignes.push(s / c); yOf.push(y); }
    }
    var largeurBande = null, posBande = null;
    if (lignes.length >= 8) {
      var maxV = -Infinity, maxI = 0;
      for (var li = 0; li < lignes.length; li++) if (lignes[li] > maxV) { maxV = lignes[li]; maxI = li; }
      var medL = median(lignes);
      var seuilBande = (maxV + medL) / 2;
      var a = maxI, bq = maxI;
      while (a > 0 && lignes[a - 1] > seuilBande) a--;
      while (bq < lignes.length - 1 && lignes[bq + 1] > seuilBande) bq++;
      largeurBande = (bq - a + 1) / lignes.length;
      posBande = (yOf[maxI] - bb.y0) / Math.max(1, bb.y1 - bb.y0);
    }

    // note 0..1
    // Le contraste de Michelson mesure surtout la NOIRCEUR du cheveu : sur 73
    // chevelures annotees il correlait NEGATIVEMENT avec la brillance percue
    // (Spearman -0,21). C'est la part speculaire (pixels clairs ET desatures, modele
    // dichromatique) qui porte l'information de brillance ; le contraste ne sert plus
    // que de correctif mineur.
    var nEcart = clamp(0, 1, (michelson - 0.12) / 0.50);
    var nSpec = clamp(0, 1, partSpec / 0.09);
    var v = 0.80 * nSpec + 0.20 * nEcart;
    if (largeurBande !== null && largeurBande > 0.55) v *= 0.85;  // pas de bande : lumiere plate

    var fiab = 'moyenne';
    if (ctx.p.partPixelsSatures > 0.03 || ctx.LmoyenImage < 20 || ctx.LmoyenImage > 86) fiab = 'faible';
    else if (ctx.seg.confiance > 0.6 && ctx.n > 1500) fiab = 'bonne';

    return mesure(Math.round(clamp(0, 1, v) * 1000) / 1000, '0..1',
      'contraste de Michelson p95/p50 de L* + part de pixels L* haut / C* bas (Shafer 1985) + largeur de la bande brillante',
      'le reflet speculaire ajoute une quantite de lumiere a peu pres constante : sur cheveux fonces il ressort plus que sur cheveux clairs. La brillance n est donc comparable qu entre chevelures de clarte voisine. Flash ou fenetre derriere le sujet fabriquent de la brillance qui n est pas celle du cheveu.',
      fiab, {
        contrasteMichelson: Math.round(michelson * 1000) / 1000,
        partSpeculaire: Math.round(partSpec * 10000) / 10000,
        largeurBande: largeurBande === null ? null : Math.round(largeurBande * 1000) / 1000,
        positionBande: posBande === null ? null : Math.round(posBande * 100) / 100,
        L50: Math.round(p50 * 10) / 10, L95: Math.round(p95 * 10) / 10
      });
  }

  /**
   * FRIZZ / HALO — densité de fils isolés hors du contour principal.
   *
   * MÉTHODE
   *   1. Couronne = dilatation du masque de r = 6 % de la hauteur de la tête, moins le
   *      masque. Limitée aux 75 % du haut (le bas, ce sont les pointes : mesure séparée).
   *   2. Un pixel de la couronne compte comme "fil isolé" s'il a une énergie de gradient
   *      > 0.5 × médiane du masque ET une couleur proche du modèle chevelure.
   *   3. Densité = fils isolés / surface de la couronne. La couronne suit la taille de la
   *      tête, donc la densité ne dépend pas de la distance à la caméra.
   *   4. GARDE-FOU : même calcul sur une couronne témoin plus lointaine (r à 2,2 r), qui
   *      devrait être du fond pur. Sa densité est SOUSTRAITE de celle de la couronne
   *      (le fond a ses propres bords). Si le témoin atteint 90 % de la couronne, il ne
   *      reste rien de séparable et la mesure est refusée ; au-delà de 55 % elle est
   *      marquée peu fiable.
   *
   * LIMITE
   *   Demande une image nette : sur une photo floue les fils disparaissent et le frizz est
   *   sous-estimé. Une mèche volante isolée compte comme du frizz.
   */
  function mesureFrizz(ctx) {
    var methode = 'densite de bords couleur-cheveu dans une couronne de 6 % de la hauteur de tete, avec couronne temoin de controle du fond';
    var limite = 'flou = frizz sous-estime ; fond texture = frizz surestime (garde-fou temoin) ; ne distingue pas un frizz d un cheveu volant';
    if (ctx.n < 300) return mesureNulle('masque_trop_petit', methode, limite);

    var r = Math.max(2, Math.round(0.06 * ctx.hauteurTete));
    var dist = ctx.distance || (ctx.distance = distanceAuMasque(ctx.m, ctx.w, ctx.h));
    var rTemoin = r * 2.2;
    var bb = ctx.bbox;
    var yMax = bb.y0 + 0.75 * (bb.y1 - bb.y0);
    var mod = ctx.seg.modele;
    var seuilG = 0.5 * ctx.g50;
    var seuilD = 2.2 * mod.seuil;

    var nC = 0, filsC = 0, nT = 0, filsT = 0;
    for (var y = 0; y < ctx.h; y++) {
      if (y > yMax) break;
      for (var x = 0; x < ctx.w; x++) {
        var i = y * ctx.w + x;
        if (ctx.m[i]) continue;
        if (peauIci(ctx, i)) continue;
        var dd = distanceLab(ctx.p, i, mod.L, mod.a, mod.b);
        var estFil = (ctx.p.grad[i] > seuilG && dd < seuilD) ? 1 : 0;
        var dv = dist[i];
        if (dv > 0 && dv <= r) { nC++; filsC += estFil; }
        else if (dv > r && dv <= rTemoin) { nT++; filsT += estFil; }
      }
    }
    if (nC < 150) return mesureNulle('couronne_trop_petite', methode, limite);

    var densite = filsC / nC;
    var densiteTemoin = nT > 80 ? filsT / nT : null;
    var ratioTemoin = (densiteTemoin !== null && densite > 0.001) ? densiteTemoin / densite : null;

    // Le fond a sa propre densite de bords : on la SOUSTRAIT au lieu de refuser la
    // mesure. On ne refuse que si le fond en produit autant que la couronne : il ne
    // reste alors rien a distinguer.
    if (ratioTemoin !== null && ratioTemoin > 0.90) {
      return mesureNulle('fond_aussi_texture_que_la_chevelure', methode, limite);
    }
    var densiteNette = densiteTemoin === null ? densite : Math.max(0, densite - densiteTemoin);

    // netteté : sans netteté, pas de fils
    var nettete = netteteMasque(ctx);
    if (nettete !== null && nettete < 12) return mesureNulle('image_trop_floue', methode, limite);

    var v = clamp(0, 1, (densiteNette - 0.015) / 0.30);
    var fiab = 'moyenne';
    if (ratioTemoin !== null && ratioTemoin > 0.55) fiab = 'faible';
    else if (nettete !== null && nettete > 45 && ctx.seg.confiance > 0.6) fiab = 'bonne';

    return mesure(Math.round(v * 1000) / 1000, '0..1', methode, limite, fiab, {
      densiteCouronne: Math.round(densite * 10000) / 10000,
      densiteNetteDuFond: Math.round(densiteNette * 10000) / 10000,
      densiteTemoinFond: densiteTemoin === null ? null : Math.round(densiteTemoin * 10000) / 10000,
      ratioTemoin: ratioTemoin === null ? null : Math.round(ratioTemoin * 100) / 100,
      rayonCouronnePx: r
    });
  }

  /** Variance du laplacien sur la zone chevelure (Pertuz 2013). Proxy de netteté. */
  function netteteMasque(ctx) {
    var w = ctx.w, h = ctx.h, L = ctx.p.L, m = ctx.m;
    var vals = [];
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var i = y * w + x;
        if (!m[i]) continue;
        if (!m[i - 1] || !m[i + 1] || !m[i - w] || !m[i + w]) continue;
        vals.push(L[i - 1] + L[i + 1] + L[i - w] + L[i + w] - 4 * L[i]);
      }
    }
    if (vals.length < 100) return null;
    var mu = mean(vals), s = 0;
    for (var k = 0; k < vals.length; k++) { var d = vals[k] - mu; s += d * d; }
    return s / vals.length;
  }

  /**
   * COULEUR — L*a*b* moyen, ton, homogénéité, part de cheveux blancs.
   *
   * MÉTHODE
   *   Les 8 % de pixels les plus clairs sont retirés avant de calculer la couleur : ce
   *   sont les reflets, ils tirent la couleur vers celle de la lampe (Shafer 1985).
   *   - L*a*b* : la couleur de corps est lue au percentile 75 de L* (partie éclairée de
   *     la chevelure), a* et b* étant médianés sur les seuls pixels à ±9 de cette clarté.
   *     La médiane simple donnait "noir" pour la plupart des châtains, les zones d'ombre
   *     entre les mèches tirant la distribution vers le bas.
   *   - ton : angle de teinte h° en CIE LCh. Chaud si b* > 6 et h dans 40°..100°,
   *     froid si b* < 3, neutre entre.
   *   - homogénéité : 1 - (écart-type de L*)/25 combiné à l'écart-type de chroma.
   *   ACCORD MESURE (60 chevelures annotees a la main) : la distinction clair / fonce
   *   tombe juste 70 % du temps, et noir / brun / chatain ne se separent pas du tout.
   *   Cette mesure ne doit pas etre presentee comme un diagnostic de couleur.
   *   - blancs/gris : pixels C* < max(4, 0,55 × médiane C*) ET L* > médiane + 18 ET L* < p98
   *     (seuil de chroma RELATIF : une chevelure brune a déjà une chroma très basse, un
   *     seuil absolu comptait la moitié de la tête comme blanche ; on exclut le reflet
   *     par le haut). On exige en plus que ces pixels soient DISPERSÉS : la part des
   *     tuiles d'une grille 6×6 qui en contiennent doit dépasser 35 %, sinon c'est un
   *     reflet groupé et on renvoie null.
   *
   * LIMITE
   *   Sur une image en noir et blanc (chroma médiane de l'image < 2), a* et b* ne
   *   veulent plus rien dire : la mesure entière est refusée.
   *   La balance des blancs de la caméra n'est pas calibrée : a* et b* sont justes en
   *   relatif (comparaison entre zones de la même photo), pas en absolu. Sous lampe très
   *   chaude tous les cheveux virent au roux. La part de blancs est la mesure la plus
   *   fragile du moteur : cheveux blonds très clairs et reflets se confondent avec du blanc.
   */
  function mesureCouleur(ctx) {
    var methode = 'mediane L*a*b* apres retrait des 8 % de pixels les plus clairs (reflets), teinte h en CIE LCh, homogeneite par ecart-type, blancs par chroma basse + luminance haute + test de dispersion sur grille 6x6';
    var limite = 'balance des blancs non calibree : couleur juste en relatif, pas en absolu ; la part de blancs confond cheveu blanc, blond tres clair et reflet';
    if (ctx.n < 200) return mesureNulle('masque_trop_petit', methode, limite);
    if (ctx.p.imageMonochrome) return mesureNulle('image_monochrome', methode, limite);

    var seuilHaut = ctx.pcL(92);
    var Lc = [], ac = [], bc = [], Cc = [], gardes = [];
    for (var i = 0; i < ctx.n; i++) {
      if (ctx.L[i] > seuilHaut) continue;
      Lc.push(ctx.L[i]); ac.push(ctx.a[i]); bc.push(ctx.b[i]); Cc.push(ctx.C[i]); gardes.push(i);
    }
    if (Lc.length < 100) return mesureNulle('trop_de_reflets', methode, limite);

    // La couleur du cheveu se lit sur la partie ECLAIREE de la chevelure, pas sur sa
    // mediane. Une chevelure chataine comporte une grande part de pixels a l'ombre
    // (entre les meches, sous la nuque) qui sont presque noirs : prendre la mediane
    // faisait sortir "noir" pour la plupart des chatains (mesure sur 73 chevelures
    // annotees : 21 % d'accord seulement). On prend le percentile 75 de L*, hors
    // reflets, et on ne moyenne a* et b* que sur les pixels proches de cette clarte.
    // Couleur de corps = MODE de la distribution de L* (pic d'un histogramme lisse),
    // pas un percentile : le percentile 75 suivait tout pixel clair reste dans le
    // masque (fond, epaule, peau) et faisait sortir des chevelures noires a L*=54.
    var Lcorps = (function () {
      var NB = 50, hist = new Float64Array(NB);
      for (var z = 0; z < Lc.length; z++) hist[clamp(0, NB - 1, Math.floor(Lc[z] / 100 * NB))]++;
      var liss = new Float64Array(NB);
      for (var z2 = 0; z2 < NB; z2++) {
        liss[z2] = (hist[z2 - 2] || 0) * 0.1 + (hist[z2 - 1] || 0) * 0.2 + hist[z2] * 0.4 +
                   (hist[z2 + 1] || 0) * 0.2 + (hist[z2 + 2] || 0) * 0.1;
      }
      var best = 0, bi = 0;
      for (var z3 = 0; z3 < NB; z3++) if (liss[z3] > best) { best = liss[z3]; bi = z3; }
      return (bi + 0.5) * (100 / NB);
    })();
    var aSel = [], bSel = [], Lsel = [];
    for (var k2 = 0; k2 < Lc.length; k2++) {
      if (Math.abs(Lc[k2] - Lcorps) <= 9) { aSel.push(ac[k2]); bSel.push(bc[k2]); Lsel.push(Lc[k2]); }
    }
    if (aSel.length < 40) { aSel = ac; bSel = bc; Lsel = Lc; }
    var L = median(Lsel), A = median(aSel), B = median(bSel);
    var lch = labToLCh(A, B);
    var ton = (B > 6 && lch.h > 35 && lch.h < 105) ? 'chaud' : (B < 3 ? 'froid' : 'neutre');

    var sL = std(Lc), sC = std(Cc);
    var homogeneite = clamp(0, 1, 1 - (0.6 * (sL / 26) + 0.4 * (sC / 13)));

    // --- blancs / gris
    var medL = L, p98 = ctx.pcL(98);
    var grilleW = 6, grilleH = 6, bb = ctx.bbox;
    var tuilesAvec = new Uint8Array(grilleW * grilleH), tuilesMasque = new Uint8Array(grilleW * grilleH);
    var nBlanc = 0;
    var bw = Math.max(1, bb.x1 - bb.x0), bh = Math.max(1, bb.y1 - bb.y0);
    for (var k = 0; k < ctx.n; k++) {
      var gi = ctx.idx[k];
      var gy = (gi / ctx.w) | 0, gx = gi - gy * ctx.w;
      var tx = clamp(0, grilleW - 1, Math.floor((gx - bb.x0) / bw * grilleW));
      var ty = clamp(0, grilleH - 1, Math.floor((gy - bb.y0) / bh * grilleH));
      tuilesMasque[ty * grilleW + tx] = 1;
      // Critere ABSOLU : un cheveu blanc ou gris est clair (L* > 58) et desature
      // (C* < 12), quelle que soit la couleur du reste de la tete. Le critere relatif
      // de la v1-alpha (plus clair que la mediane) ne correlait pas du tout avec
      // l'annotation (Spearman 0,02 sur 62 chevelures) : il comptait les reflets d'une
      // chevelure brune et ne voyait rien sur une tete entierement blanche.
      if (ctx.C[k] < 12 && ctx.L[k] > 58 && ctx.L[k] < p98) {
        nBlanc++; tuilesAvec[ty * grilleW + tx] = 1;
      }
    }
    var nTM = 0, nTA = 0;
    for (var t = 0; t < tuilesMasque.length; t++) { if (tuilesMasque[t]) nTM++; if (tuilesAvec[t]) nTA++; }
    var dispersion = nTM ? nTA / nTM : 0;
    var partBlancs = nBlanc / ctx.n;
    var blancs;
    if (dispersion < 0.25 && partBlancs > 0.02) {
      blancs = { valeur: null, raison: 'candidats_groupes_probable_reflet', dispersion: Math.round(dispersion * 100) / 100 };
    } else if (lch.C > 22 && L > 58) {
      // chevelure claire mais coloree (blond dore, cuivre) : on ne sait pas separer
      blancs = { valeur: null, raison: 'chevelure_claire_et_coloree_non_separable', dispersion: Math.round(dispersion * 100) / 100 };
    } else {
      blancs = { valeur: Math.round(partBlancs * 1000) / 1000, dispersion: Math.round(dispersion * 100) / 100,
                 fiabilite: dispersion > 0.6 ? 'moyenne' : 'faible' };
    }

    return mesure({ L: Math.round(L * 10) / 10, a: Math.round(A * 10) / 10, b: Math.round(B * 10) / 10 },
      'CIE L*a*b*', methode, limite,
      // Fiabilite bornee par la mesure : sur 54 chevelures annotees, la seule
      // distinction clair/fonce n'est juste que 70 % du temps. La couleur ne depasse
      // donc JAMAIS 'moyenne', et seulement si le masque est bon.
      (ctx.seg.confiance > 0.8 && ctx.seg.purete > 0.95) ? 'moyenne' : 'faible', {
        chroma: Math.round(lch.C * 10) / 10,
        teinte: Math.round(lch.h),
        ton: ton,
        homogeneite: Math.round(homogeneite * 1000) / 1000,
        ecartTypeL: Math.round(sL * 10) / 10,
        ecartTypeChroma: Math.round(sC * 10) / 10,
        partBlancs: blancs,
        famille: familleCouleur(L, lch.C, lch.h, B)
      });
  }

  /**
   * Classe de clarte et de nuance — VOLONTAIREMENT GROSSIERE.
   *
   * La validation sur 60 chevelures annotees montre que noir, brun fonce et chatain ne
   * se separent PAS sur une photo non calibree : leurs distributions de L* se
   * recouvrent entierement (medianes 23, 8 et 17). Annoncer "chatain" plutot que "noir"
   * serait inventer une precision qui n'existe pas. Le moteur ne publie donc que ce
   * qu'il sait distinguer :
   *   - la clarte (4 classes, separation clair/fonce validee),
   *   - une nuance cuivree ou une coloration vive (chroma et teinte),
   *   - le gris/blanc (clair ET desature).
   * La vraie sortie reste le triplet L*a*b*, pas cette etiquette.
   */
  function familleCouleur(L, C, h, b) {
    var vive = C >= 30 && !(h > 5 && h < 75);
    if (vive) return 'coloration vive';
    if (C >= 22 && h > 10 && h < 65) return L >= 45 ? 'cuivre clair' : 'cuivre fonce';
    if (L >= 55 && C < 10) return 'tres clair, gris ou blanc';
    if (L >= 55) return 'tres clair';
    if (L >= 38) return 'clair';
    if (L >= 22) return 'moyen';
    return 'fonce';
  }

  /**
   * BOUCLE — courbure moyenne des mèches par tenseur de structure.
   *
   * MÉTHODE (Bigün & Granlund 1987)
   *   Sur des blocs de ~6 % de la largeur de tête : Jxx = Σgx², Jyy = Σgy², Jxy = Σgxgy.
   *   L'orientation dominante du gradient est 0.5·atan2(2Jxy, Jxx-Jyy) ; la mèche est
   *   perpendiculaire, donc theta_meche = orientation_gradient + pi/2.
   *   Cohérence = sqrt((Jxx-Jyy)² + 4Jxy²)/(Jxx+Jyy) : 1 = direction franche, 0 = isotrope.
   *   Seuls les blocs entièrement contenus dans la chevelure et de cohérence > 0,28 sont
   *   retenus : les blocs à cheval sur le contour lisent le bord comme une boucle.
   *   Courbure = moyenne, pondérée par la cohérence, des écarts d'orientation entre blocs
   *   voisins (différence circulaire de période pi), normalisée en 0..1.
   *   Entropie du histogramme d'orientation (18 bins) : lisse = pic net (entropie basse),
   *   crépu = plat (entropie haute).
   *
   * LIMITE
   *   Une queue de cheval, un chignon, des tresses ou un lissage à la brosse donnent une
   *   orientation régulière quel que soit le cheveu : le type est alors sous-estimé. C'est
   *   la raison pour laquelle le type mesuré ne remplace jamais le type ressenti déclaré,
   *   il le confirme ou le contredit. Type 1 à 4 = indicatif, pas une classification validée.
   */
  function mesureBoucle(ctx) {
    var methode = 'tenseur de structure par blocs (Bigun & Granlund 1987) : orientation locale des meches, variation d orientation entre blocs voisins ponderee par la coherence, entropie du histogramme d orientation';
    var limite = 'coiffure attachee, tressee ou brossee = orientation reguliere, type sous-estime ; type 1 a 4 indicatif, non valide cliniquement';
    if (ctx.n < 400) return mesureNulle('masque_trop_petit', methode, limite);

    var B = Math.max(5, Math.round(0.06 * ctx.largeurTete));
    var w = ctx.w, h = ctx.h;
    var nbx = Math.ceil(w / B), nby = Math.ceil(h / B);
    var theta = new Float32Array(nbx * nby), coh = new Float32Array(nbx * nby), occup = new Float32Array(nbx * nby);

    for (var by = 0; by < nby; by++) {
      for (var bx = 0; bx < nbx; bx++) {
        var Jxx = 0, Jyy = 0, Jxy = 0, cnt = 0, tot = 0;
        for (var y = by * B; y < Math.min(h, (by + 1) * B); y++) {
          for (var x = bx * B; x < Math.min(w, (bx + 1) * B); x++) {
            var i = y * w + x; tot++;
            if (!ctx.m[i]) continue;
            var gx = ctx.p.gx[i], gy = ctx.p.gy[i];
            Jxx += gx * gx; Jyy += gy * gy; Jxy += gx * gy; cnt++;
          }
        }
        var bi = by * nbx + bx;
        occup[bi] = tot ? cnt / tot : 0;
        // Bloc retenu seulement s'il est ENTIEREMENT dans la chevelure : les blocs a
        // cheval sur le contour contiennent un bord franc qui se lit comme une forte
        // variation d'orientation et faisait surestimer le type de boucle.
        if (cnt < B * B * 0.92 || (Jxx + Jyy) < 1e-3) { coh[bi] = 0; theta[bi] = 0; continue; }
        var og = 0.5 * Math.atan2(2 * Jxy, Jxx - Jyy);
        theta[bi] = og + Math.PI / 2;
        coh[bi] = Math.sqrt((Jxx - Jyy) * (Jxx - Jyy) + 4 * Jxy * Jxy) / (Jxx + Jyy);
      }
    }

    var somme = 0, poids = 0, blocs = 0;
    var hist = new Float64Array(18), histTot = 0;
    for (var byy = 0; byy < nby; byy++) {
      for (var bxx = 0; bxx < nbx; bxx++) {
        var b0 = byy * nbx + bxx;
        if (coh[b0] < 0.28) continue;
        blocs++;
        var bin = Math.floor(((theta[b0] % Math.PI) + Math.PI) % Math.PI / Math.PI * 18) % 18;
        hist[bin] += coh[b0]; histTot += coh[b0];
        var vois = [[1, 0], [0, 1]];
        for (var v = 0; v < 2; v++) {
          var nx2 = bxx + vois[v][0], ny2 = byy + vois[v][1];
          if (nx2 >= nbx || ny2 >= nby) continue;
          var b1 = ny2 * nbx + nx2;
          if (coh[b1] < 0.28) continue;
          var wgt = Math.min(coh[b0], coh[b1]);
          somme += diffOrientation(theta[b0], theta[b1]) * wgt;
          poids += wgt;
        }
      }
    }
    if (blocs < 8 || poids < 0.5) return mesureNulle('trop_peu_de_blocs_orientes', methode, limite);

    var courbureRad = somme / poids;                       // radians par bloc voisin
    var courbureNorm = clamp(0, 1, courbureRad / (Math.PI / 4));

    var entropie = 0;
    for (var hb = 0; hb < 18; hb++) {
      if (hist[hb] <= 0) continue;
      var pr = hist[hb] / histTot;
      entropie -= pr * Math.log(pr);
    }
    var entropieNorm = clamp(0, 1, entropie / Math.log(18));
    var coherenceMoy = 0, nc = 0;
    for (var ci = 0; ci < coh.length; ci++) if (coh[ci] > 0.28) { coherenceMoy += coh[ci]; nc++; }
    coherenceMoy = nc ? coherenceMoy / nc : 0;

    // Indice combiné : la courbure porte l'essentiel, l'entropie confirme.
    var indice = clamp(0, 1, 0.65 * courbureNorm + 0.35 * entropieNorm);
    // Seuils calés sur le jeu de validation (60 chevelures) — voir ICE_V1_VALIDATION.md.
    // Ce sont des seuils AJUSTÉS sur ce jeu : l'accord annoncé est donc optimiste.
    var type = indice < 0.42 ? 1 : indice < 0.52 ? 2 : indice < 0.62 ? 3 : 4;

    return mesure(Math.round(indice * 1000) / 1000, '0..1', methode, limite,
      ctx.seg.confiance > 0.55 && blocs > 25 ? 'moyenne' : 'faible', {
        typeIndicatif: type,
        courbureRadParBloc: Math.round(courbureRad * 1000) / 1000,
        entropieOrientation: Math.round(entropieNorm * 1000) / 1000,
        coherenceMoyenne: Math.round(coherenceMoy * 1000) / 1000,
        blocsUtiles: blocs,
        tailleBlocPx: B
      });
  }

  /**
   * DENSITÉ APPARENTE À LA RAIE — contraste cuir chevelu / cheveux le long de la raie.
   *
   * MÉTHODE
   *   1. Dans les 45 % du haut de la chevelure, on cherche ligne par ligne un segment
   *      court (1 à 18 % de la largeur de tête) de pixels de TEINTE PEAU (YCbCr, Hsu 2002),
   *      ENCADRÉ de cheveux des deux côtés.
   *   2. Une raie n'est retenue que si ces segments sont verticalement alignés (au moins
   *      8 lignes autour d'une même colonne à ±4 px), CONTIGUS (la hauteur totale ne peut
   *      pas dépasser 2,2 fois le nombre de lignes) et si le contraste de L* entre cuir
   *      chevelu et cheveux adjacents dépasse 6 unités.
   *   3. Densité apparente = 1 - largeur relative de la raie, et contraste = différence
   *      de L* entre le cuir chevelu et les cheveux adjacents.
   *
   * LIMITE — LA PLUS IMPORTANTE DU MOTEUR
   *   Sans raie visible (cheveux tirés en arrière, coupe courte, frange, boucles,
   *   afro, chignon) il n'y a RIEN à mesurer : on renvoie null. C'est le cas le plus
   *   fréquent. Une raie large peut venir d'une coiffure, pas d'une perte de densité ;
   *   ce chiffre ne dit pas si quelqu'un perd ses cheveux et ne doit jamais être présenté
   *   comme tel.
   */
  function mesureDensiteRaie(ctx) {
    var methode = 'detection d une raie : segments courts de teinte peau encadres de cheveux, alignes verticalement sur au moins 6 lignes ; largeur relative + contraste L* cuir chevelu / cheveux';
    var limite = 'null des qu il n y a pas de raie nette (le cas le plus frequent) ; une raie large peut etre une coiffure et non une perte de densite ; ne dit rien de la chute';
    var bb = ctx.bbox, w = ctx.w;
    var bh = bb.y1 - bb.y0, bw = bb.x1 - bb.x0;
    if (bh < 20 || bw < 20) return mesureNulle('chevelure_trop_petite', methode, limite);

    var yFin = bb.y0 + Math.round(0.45 * bh);
    var largeurMax = Math.max(2, Math.round(0.18 * ctx.largeurTete));
    var mod = ctx.seg.modele;
    var candidats = [];

    for (var y = bb.y0 + 2; y <= yFin; y++) {
      var x = bb.x0, run = -1;
      for (x = bb.x0; x <= bb.x1; x++) {
        var i = y * w + x;
        // Le cuir chevelu est de la PEAU : le test chromatique YCbCr est exige.
        // (La v1-alpha acceptait "plus clair que les cheveux" : elle trouvait une raie
        // sur 98 chevelures sur 107, donc presque toujours a tort.)
        var estCuir = !ctx.m[i] && peauIci(ctx, i);
        if (estCuir) { if (run < 0) run = x; }
        else {
          if (run >= 0) {
            var lon = x - run;
            if (lon >= 1 && lon <= largeurMax) {
              var gauche = run - 1 >= 0 ? ctx.m[y * w + run - 1] : 0;
              var droite = x < w ? ctx.m[y * w + x] : 0;
              if (gauche && droite) candidats.push({ y: y, cx: run + lon / 2, lon: lon, x0: run, x1: x - 1 });
            }
            run = -1;
          }
        }
      }
    }
    if (candidats.length < 8) return mesureNulle('aucune_raie_visible', methode, limite);

    // alignement vertical : mode de la position x sur des bacs de 3 px
    var bacs = {};
    for (var c = 0; c < candidats.length; c++) {
      var b = Math.round(candidats[c].cx / 3);
      (bacs[b] = bacs[b] || []).push(candidats[c]);
    }
    var meilleur = null;
    for (var k in bacs) {
      if (!Object.prototype.hasOwnProperty.call(bacs, k)) continue;
      var grp = bacs[k].concat(bacs[+k - 1] || [], bacs[+k + 1] || []);
      if (!meilleur || grp.length > meilleur.length) meilleur = grp;
    }
    if (!meilleur || meilleur.length < 8) return mesureNulle('raie_non_alignee', methode, limite);

    var lignesUniques = {}, yMin = Infinity, yMaxG = -Infinity;
    for (var g = 0; g < meilleur.length; g++) {
      lignesUniques[meilleur[g].y] = 1;
      if (meilleur[g].y < yMin) yMin = meilleur[g].y;
      if (meilleur[g].y > yMaxG) yMaxG = meilleur[g].y;
    }
    var nLignes = Object.keys(lignesUniques).length;
    if (nLignes < 8) return mesureNulle('raie_non_alignee', methode, limite);
    // les lignes doivent se suivre : une raie est un trait continu, pas des taches
    // eparpillees sur toute la hauteur.
    if ((yMaxG - yMin + 1) > 2.2 * nLignes) return mesureNulle('raie_discontinue', methode, limite);

    var lons = [], Lcuir = [], Lcheveu = [];
    for (var q = 0; q < meilleur.length; q++) {
      var cd = meilleur[q];
      lons.push(cd.lon);
      for (var xx = cd.x0; xx <= cd.x1; xx++) Lcuir.push(ctx.p.L[cd.y * w + xx]);
      for (var d = 1; d <= 4; d++) {
        var xg = cd.x0 - d, xd = cd.x1 + d;
        if (xg >= 0 && ctx.m[cd.y * w + xg]) Lcheveu.push(ctx.p.L[cd.y * w + xg]);
        if (xd < w && ctx.m[cd.y * w + xd]) Lcheveu.push(ctx.p.L[cd.y * w + xd]);
      }
    }
    if (Lcuir.length < 10 || Lcheveu.length < 10) return mesureNulle('raie_trop_mince', methode, limite);

    var largeurRel = median(lons) / ctx.largeurTete;
    var contraste = median(Lcuir) - median(Lcheveu);
    // sans contraste franc entre cuir chevelu et cheveux, ce n'est pas une raie
    if (contraste < 6) return mesureNulle('contraste_cuir_chevelu_insuffisant', methode, limite);
    var densite = clamp(0, 1, 1 - (largeurRel - 0.012) / 0.10);

    return mesure(Math.round(densite * 1000) / 1000, '0..1 (1 = raie fine, dense en apparence)',
      methode, limite, 'faible', {
        largeurRaieRelative: Math.round(largeurRel * 10000) / 10000,
        contrasteL: Math.round(contraste * 10) / 10,
        lignesDetectees: nLignes
      });
  }

  // Tant que la validation n'aura pas montré une correspondance réelle entre
  // l'espacement apparent des mèches et le diamètre de fibre, la CLASSE
  // fin/moyen/épais n'est pas publiée. Voir ICE_V1_VALIDATION.md.
  var FINESSE_CLASSE_ACTIVE = false;

  /**
   * FINESSE DE FIBRE — fréquence spatiale dominante sur une zone nette.
   *
   * CE QUE C'EST VRAIMENT
   *   Un cheveu mesure 0,04 à 0,12 mm de diamètre. À 40 cm d'une webcam, un pixel vaut
   *   0,15 à 0,4 mm : UN CHEVEU NE FAIT PAS UN PIXEL. Ce qui est mesuré ici n'est donc
   *   PAS le diamètre du cheveu mais la période apparente des MÈCHES (paquets de
   *   cheveux), perpendiculairement à leur direction.
   *
   * MÉTHODE
   *   1. Recherche de la fenêtre 32×32 la plus nette entièrement dans la chevelure
   *      (variance du laplacien maximale).
   *   2. Orientation locale par tenseur de structure ; 24 profils de 32 échantillons
   *      sont tirés PERPENDICULAIREMENT aux mèches, en interpolation bilinéaire.
   *   3. Fenêtre de Hann, FFT 32 points, spectres de puissance moyennés, pic cherché
   *      entre les bins 3 et 15 (on exclut le continu et les très basses fréquences).
   *   4. Période en pixels = 32 / bin. Conversion en mm avec l'échelle du visage :
   *      écart inter-pupillaire réel moyen adulte 63 mm (Dodgson 2004), ou, à défaut de
   *      repères, largeur bizygomatique moyenne 139 mm — échelle alors marquée approchée.
   *
   * LIMITE
   *   Aucune correspondance publiée ne relie l'espacement des mèches au diamètre du
   *   cheveu. La classe fin/moyen/épais n'est donc PAS publiée tant qu'elle n'est pas
   *   validée. Période en dessous de 0,3 mm = sous la résolution : null.
   */
  // Resultat de validation : sur 73 chevelures annotees, la FFT n'a produit AUCUNE
  // periode dans la plage plausible des meches (0,3 a 3 mm). La mesure est donc
  // DESACTIVEE : elle renvoie null avec sa raison. Le code reste en place, documente,
  // pour qu'on puisse la reprendre avec des photos macro ou une camera dediee.
  var FINESSE_ACTIVE = false;

  function mesureFinesse(ctx) {
    var methode = 'FFT 32 points sur 24 profils tires perpendiculairement aux meches dans la fenetre 32x32 la plus nette, echelle donnee par l ecart inter-pupillaire (63 mm) ou la largeur du visage (139 mm)';
    var limite = 'ce n est PAS le diametre du cheveu (0,04-0,12 mm, sous la resolution) mais l espacement apparent des meches ; aucune correspondance publiee vers fin/moyen/epais';
    var W = 32;
    if (!FINESSE_ACTIVE) return mesureNulle('mesure_desactivee_non_validee', methode, limite);
    if (ctx.largeurTete < 60) return mesureNulle('tete_trop_petite_dans_l_image', methode, limite);

    // 1. fenêtre la plus nette
    var best = null, w = ctx.w, h = ctx.h, bb = ctx.bbox;
    for (var y = bb.y0; y + W < Math.min(h - 1, bb.y1); y += 8) {
      for (var x = bb.x0; x + W < Math.min(w - 1, bb.x1); x += 8) {
        var plein = true, vals = [], Jxx = 0, Jyy = 0, Jxy = 0;
        for (var dy = 0; dy < W && plein; dy += 2) {
          for (var dx = 0; dx < W; dx += 2) {
            var i = (y + dy) * w + (x + dx);
            if (!ctx.m[i]) { plein = false; break; }
            if (dy > 0 && dy < W - 1 && dx > 0 && dx < W - 1) {
              vals.push(ctx.p.L[i - 1] + ctx.p.L[i + 1] + ctx.p.L[i - w] + ctx.p.L[i + w] - 4 * ctx.p.L[i]);
              Jxx += ctx.p.gx[i] * ctx.p.gx[i]; Jyy += ctx.p.gy[i] * ctx.p.gy[i];
              Jxy += ctx.p.gx[i] * ctx.p.gy[i];
            }
          }
        }
        if (!plein || vals.length < 40) continue;
        var vr = 0, mu = mean(vals);
        for (var v = 0; v < vals.length; v++) vr += (vals[v] - mu) * (vals[v] - mu);
        vr /= vals.length;
        if (!best || vr > best.variance) best = { x: x, y: y, variance: vr, Jxx: Jxx, Jyy: Jyy, Jxy: Jxy };
      }
    }
    if (!best) return mesureNulle('aucune_fenetre_pleine_dans_la_chevelure', methode, limite);
    if (best.variance < 8) return mesureNulle('zone_trop_floue', methode, limite);

    // 2. orientation des mèches dans la fenêtre
    var thetaMeche = 0.5 * Math.atan2(2 * best.Jxy, best.Jxx - best.Jyy) + Math.PI / 2;
    var perp = thetaMeche + Math.PI / 2;
    var ux = Math.cos(perp), uy = Math.sin(perp);
    var vx = Math.cos(thetaMeche), vy = Math.sin(thetaMeche);

    function bilin(px, py) {
      if (px < 0 || py < 0 || px >= w - 1 || py >= h - 1) return null;
      var x0 = px | 0, y0 = py | 0, fx = px - x0, fy = py - y0;
      var i0 = y0 * w + x0;
      return ctx.p.L[i0] * (1 - fx) * (1 - fy) + ctx.p.L[i0 + 1] * fx * (1 - fy) +
             ctx.p.L[i0 + w] * (1 - fx) * fy + ctx.p.L[i0 + w + 1] * fx * fy;
    }

    var N = 32, spectre = new Float64Array(N / 2), lignesOk = 0;
    var cx0 = best.x + W / 2, cy0 = best.y + W / 2;
    for (var li = -12; li <= 12; li++) {
      var ox = cx0 + vx * li, oy = cy0 + vy * li;
      var re = new Float64Array(N), im = new Float64Array(N), ok = true, ech = [];
      for (var s = 0; s < N; s++) {
        var t = s - N / 2;
        var val = bilin(ox + ux * t, oy + uy * t);
        if (val === null) { ok = false; break; }
        ech.push(val);
      }
      if (!ok) continue;
      var mu2 = mean(ech);
      for (var s2 = 0; s2 < N; s2++) {
        var hann = 0.5 * (1 - Math.cos(2 * Math.PI * s2 / (N - 1)));
        re[s2] = (ech[s2] - mu2) * hann;
      }
      fft(re, im);
      for (var f = 0; f < N / 2; f++) spectre[f] += re[f] * re[f] + im[f] * im[f];
      lignesOk++;
    }
    if (lignesOk < 8) return mesureNulle('profils_hors_image', methode, limite);

    var pic = 0, picV = -1;
    for (var f2 = 3; f2 <= 15; f2++) if (spectre[f2] > picV) { picV = spectre[f2]; pic = f2; }
    var somme = 0; for (var f3 = 1; f3 < N / 2; f3++) somme += spectre[f3];
    var saillance = somme > 0 ? picV / somme : 0;
    if (saillance < 0.14) return mesureNulle('aucune_periodicite_nette', methode, limite);

    var periodePxTravail = N / pic;
    var periodePxOrigine = periodePxTravail * ctx.p.pas;

    // 3. échelle physique
    var mmParPx = null, sourceEchelle = null;
    if (ctx.seg.geo && ctx.seg.geo.ipdPx) {
      mmParPx = 63 / ctx.seg.geo.ipdPx; sourceEchelle = 'ecart_inter_pupillaire_63mm';
    } else if (ctx.seg.geo && ctx.seg.geo.box && ctx.seg.geo.box.width) {
      mmParPx = 139 / ctx.seg.geo.box.width; sourceEchelle = 'largeur_visage_139mm_approchee';
    }
    if (mmParPx === null) return mesureNulle('echelle_inconnue', methode, limite);

    var periodeMm = periodePxOrigine * mmParPx;
    if (periodeMm < 0.3) return mesureNulle('periode_sous_la_resolution', methode, limite);
    // Au-dela de 3 mm, le pic ne correspond plus a un espacement de meches mais a une
    // ondulation large ou a une ombre : on refuse plutot que de publier un faux.
    if (periodeMm > 3.0) return mesureNulle('periode_hors_plage_des_meches', methode, limite);

    var classe = null, raisonClasse = 'classe non publiee : aucune correspondance validee entre espacement de meches et diametre de fibre';
    if (FINESSE_CLASSE_ACTIVE) {
      classe = periodeMm < 0.9 ? 'fin' : periodeMm < 1.8 ? 'moyen' : 'epais';
      raisonClasse = null;
    }

    return mesure(Math.round(periodeMm * 1000) / 1000, 'mm (periode apparente des meches)',
      methode, limite, 'faible', {
        periodePxImageOrigine: Math.round(periodePxOrigine * 100) / 100,
        saillanceDuPic: Math.round(saillance * 1000) / 1000,
        sourceEchelle: sourceEchelle,
        classe: classe, raisonClasse: raisonClasse,
        fenetre: { x: best.x, y: best.y, variance: Math.round(best.variance) }
      });
  }

  /**
   * RACINES GRASSES — gradient de brillance et de saturation racines / longueurs.
   *
   * MÉTHODE
   *   Bande racines : les 28 % du haut de la chevelure, restreints au centre du crâne.
   *   Bande longueurs : de 45 % à 85 % de la hauteur. Dans chaque bande : part de pixels
   *   spéculaires (même définition que brillance), médiane de L* et de chroma C*.
   *   Le sébum lisse la surface : il augmente la part spéculaire et abaisse la chroma
   *   (film gras = réflexion de la source, pas de la couleur du cheveu).
   *
   * LIMITE — CONFONDANT MAJEUR, ASSUMÉ
   *   Presque toutes les pièces sont éclairées PAR LE DESSUS. Le haut du crâne est donc
   *   plus clair et plus spéculaire chez tout le monde, cheveux gras ou pas. Il n'existe
   *   aucun moyen de séparer les deux sur une seule photo non calibrée. Cette mesure est
   *   publiée comme INDICATIVE, pèse peu dans le score, et le questionnaire (fréquence de
   *   lavage) reste la source principale sur ce sujet.
   */
  function mesureRacinesGrasses(ctx) {
    var methode = 'comparaison de la part speculaire, de L* et de la chroma entre la bande racines (28 % du haut, centre du crane) et la bande longueurs (45-85 % de la hauteur)';
    var limite = 'l eclairage vient du dessus dans presque toutes les pieces : le haut du crane est plus brillant chez tout le monde. Mesure indicative, non separable de l eclairage sur une photo unique.';
    var bb = ctx.bbox, w = ctx.w;
    var bh = bb.y1 - bb.y0;
    if (bh < 40) return mesureNulle('chevelure_trop_courte_pour_separer_racines_et_longueurs', methode, limite);

    var cxTete = (bb.x0 + bb.x1) / 2, demi = 0.35 * ctx.largeurTete;
    var seuilL = ctx.L50 + 0.55 * (ctx.L99 - ctx.L50), seuilC = 0.85 * ctx.C50;

    function bande(y0, y1, centre) {
      var n = 0, spec = 0, Ls = [], Cs = [];
      for (var y = Math.round(y0); y <= Math.round(y1); y++) {
        for (var x = bb.x0; x <= bb.x1; x++) {
          if (centre && Math.abs(x - cxTete) > demi) continue;
          var i = y * w + x;
          if (!ctx.m[i]) continue;
          var C = Math.sqrt(ctx.p.a[i] * ctx.p.a[i] + ctx.p.b[i] * ctx.p.b[i]);
          n++;
          if (ctx.p.L[i] > seuilL && C < seuilC) spec++;
          Ls.push(ctx.p.L[i]); Cs.push(C);
        }
      }
      return n < 60 ? null : { n: n, spec: spec / n, L: median(Ls), C: median(Cs) };
    }

    var racines = bande(bb.y0, bb.y0 + 0.28 * bh, true);
    var longueurs = bande(bb.y0 + 0.45 * bh, bb.y0 + 0.85 * bh, false);
    if (!racines || !longueurs) return mesureNulle('bandes_insuffisantes', methode, limite);

    var dSpec = racines.spec - longueurs.spec;
    var dL = racines.L - longueurs.L;
    var dC = racines.C - longueurs.C;
    // 0.5 = pas de différence ; > 0.5 = racines plus grasses en apparence
    var v = clamp(0, 1, 0.5 + dSpec * 2.2 + (dC < 0 ? -dC * 0.012 : -dC * 0.006));

    return mesure(Math.round(v * 1000) / 1000, '0..1 (0,5 = aucune difference mesuree)',
      methode, limite, 'faible', {
        partSpeculaireRacines: Math.round(racines.spec * 10000) / 10000,
        partSpeculaireLongueurs: Math.round(longueurs.spec * 10000) / 10000,
        deltaSpeculaire: Math.round(dSpec * 10000) / 10000,
        deltaL: Math.round(dL * 10) / 10,
        deltaChroma: Math.round(dC * 10) / 10
      });
  }

  /**
   * SÉCHERESSE / MATITÉ — rapport reflet / matité + entropie de texture.
   *
   * MÉTHODE
   *   Matité = 1 - indice de brillance. Entropie de Shannon de l'histogramme de L* de la
   *   chevelure (64 bacs, normalisée par log 64) : une chevelure sèche diffuse la lumière
   *   dans tous les sens, sa distribution de luminance est plus étalée et plus désordonnée
   *   qu'une chevelure lisse où l'énergie se concentre dans un corps sombre + une bande
   *   de reflet. Sécheresse = 0,60 × matité + 0,40 × entropie.
   *
   * LIMITE
   *   Cette mesure n'est PAS indépendante de la brillance : elle en est en grande partie
   *   l'inverse. Elle ne mesure pas l'hydratation du cheveu (impossible en photo), mais
   *   son aspect mat. Une coloration multi-tons monte l'entropie sans aucune sécheresse.
   */
  function mesureSecheresse(ctx, brillance) {
    var methode = 'matite (inverse de l indice de brillance) combinee a l entropie de Shannon de l histogramme L* de la chevelure (64 bacs)';
    var limite = 'non independante de la brillance ; ne mesure pas l hydratation mais l aspect mat ; un balayage multi-tons monte l entropie sans secheresse';
    if (ctx.n < 200 || !brillance || brillance.valeur === null) {
      return mesureNulle('brillance_indisponible', methode, limite);
    }
    var bacs = new Float64Array(64);
    for (var i = 0; i < ctx.n; i++) bacs[clamp(0, 63, Math.floor(ctx.L[i] / 100 * 64))]++;
    var ent = 0;
    for (var k = 0; k < 64; k++) {
      if (!bacs[k]) continue;
      var pr = bacs[k] / ctx.n;
      ent -= pr * Math.log(pr);
    }
    var entN = clamp(0, 1, ent / Math.log(64));
    var matite = 1 - brillance.valeur;
    var v = clamp(0, 1, 0.60 * matite + 0.40 * entN);
    return mesure(Math.round(v * 1000) / 1000, '0..1', methode, limite,
      brillance.fiabilite === 'bonne' ? 'moyenne' : 'faible', {
        matite: Math.round(matite * 1000) / 1000,
        entropieTexture: Math.round(entN * 1000) / 1000
      });
  }

  /**
   * CASSE / POINTES — densité d'extrémités de fils dans le tiers bas.
   *
   * MÉTHODE
   *   1. Dans le tiers bas de la chevelure, on binarise les "fils" : pixels du masque
   *      dilaté ayant une énergie de gradient > 0,8 × médiane et une couleur de cheveu.
   *   2. Squelettisation Zhang-Suen 1984 de cette carte binaire.
   *   3. Comptage des extrémités : pixel du squelette ayant exactement UN voisin.
   *   4. Densité rapportée à la longueur du contour bas du masque (invariante à l'échelle).
   *
   * LIMITE
   *   Une coupe nette et droite donne peu d'extrémités, un dégradé volontaire en donne
   *   beaucoup : la coiffure se confond avec l'abîmé. Mesure d'ASPECT des pointes, pas
   *   d'état de la kératine. Inexploitable sur cheveux attachés ou très courts.
   */
  function mesureCassePointes(ctx) {
    var methode = 'binarisation des fils dans le tiers bas, squelettisation Zhang-Suen 1984, comptage des pixels du squelette a un seul voisin (extremites), rapporte a la longueur du contour bas';
    var limite = 'un degrade volontaire produit autant d extremites qu une casse ; mesure d aspect, pas d etat de la keratine ; inexploitable si les cheveux sont attaches ou tres courts';
    var bb = ctx.bbox, w = ctx.w, h = ctx.h;
    var bh = bb.y1 - bb.y0;
    if (bh < 30) return mesureNulle('chevelure_trop_courte', methode, limite);

    var y0 = Math.round(bb.y0 + 0.66 * bh), y1 = Math.min(h - 2, bb.y1 + Math.round(0.06 * bh));
    var x0 = Math.max(1, bb.x0 - 4), x1 = Math.min(w - 2, bb.x1 + 4);
    var rw = x1 - x0 + 1, rh = y1 - y0 + 1;
    if (rw < 12 || rh < 12) return mesureNulle('zone_basse_trop_petite', methode, limite);

    var r = Math.max(1, Math.round(0.03 * ctx.hauteurTete));
    var dist2 = ctx.distance || (ctx.distance = distanceAuMasque(ctx.m, w, h));
    var mod = ctx.seg.modele;
    var seuilG = 0.8 * ctx.g50, seuilD = 2.0 * mod.seuil;

    var bin = new Uint8Array(rw * rh), nFils = 0;
    for (var y = y0; y <= y1; y++) {
      for (var x = x0; x <= x1; x++) {
        var i = y * w + x;
        if (dist2[i] > r) continue;
        if (peauIci(ctx, i)) continue;
        if (ctx.p.grad[i] > seuilG && distanceLab(ctx.p, i, mod.L, mod.a, mod.b) < seuilD) {
          bin[(y - y0) * rw + (x - x0)] = 1; nFils++;
        }
      }
    }
    if (nFils < 60) return mesureNulle('pas_assez_de_fils_detectes', methode, limite);

    var squelette = zhangSuen(bin, rw, rh);
    var extremites = 0, pixSquelette = 0;
    for (var yy = 1; yy < rh - 1; yy++) {
      for (var xx = 1; xx < rw - 1; xx++) {
        var ii = yy * rw + xx;
        if (!squelette[ii]) continue;
        pixSquelette++;
        var v = squelette[ii - 1] + squelette[ii + 1] + squelette[ii - rw] + squelette[ii + rw] +
                squelette[ii - rw - 1] + squelette[ii - rw + 1] + squelette[ii + rw - 1] + squelette[ii + rw + 1];
        if (v === 1) extremites++;
      }
    }
    // longueur du contour bas du masque (pixels de bord dans la zone)
    var contour = 0;
    for (var y2 = y0; y2 <= y1; y2++) {
      for (var x2 = x0; x2 <= x1; x2++) {
        var i2 = y2 * w + x2;
        if (!ctx.m[i2]) continue;
        if (!ctx.m[i2 - 1] || !ctx.m[i2 + 1] || !ctx.m[i2 - w] || !ctx.m[i2 + w]) contour++;
      }
    }
    if (contour < 25) return mesureNulle('contour_bas_insuffisant', methode, limite);

    var densite = extremites / contour;
    // Bornes calees sur la distribution mesuree du jeu de validation
    // (p10 = 0,027 ; mediane = 0,067 ; p90 = 0,147 extremites par pixel de contour).
    var v2 = clamp(0, 1, (densite - 0.02) / 0.17);
    var nettete = netteteMasque(ctx);
    if (nettete !== null && nettete < 12) return mesureNulle('image_trop_floue', methode, limite);

    return mesure(Math.round(v2 * 1000) / 1000, '0..1', methode, limite, 'faible', {
      extremites: extremites, pixelsSquelette: pixSquelette, contourBas: contour,
      densiteExtremites: Math.round(densite * 1000) / 1000
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // 8. QUALITÉ DE PRISE
  // ════════════════════════════════════════════════════════════════════════

  var QUALITE = {
    NETTETE_MIN: 10, NETTETE_BONNE: 45,
    L_MIN: 26, L_MAX: 80,
    SATURES_MAX: 0.04,
    COUVERTURE_MIN: 0.02,
    // Cadrage : largeur du visage / largeur de l'image. En dessous de 0,10 la tete est
    // un timbre-poste dans la photo : les mesures de fils, de pointes et de raie n'ont
    // plus de support en pixels. En dessous de 0,06 on refuse.
    CADRAGE_CIBLE: 0.22, CADRAGE_MIN: 0.10, CADRAGE_REFUS: 0.06,
    SCORE_REFUS: 35
  };

  /**
   * Qualité de prise : netteté (variance du laplacien, Pertuz 2013), exposition
   * (L* moyen de l'image + part de pixels saturés), masque (présence, taille, confiance)
   * et cadrage (largeur du visage rapportée à la largeur de l'image).
   * En dessous de 35/100, ou si le visage fait moins de 6 % de la largeur de l'image,
   * l'image est refusée : aucune mesure n'est publiée.
   */
  function qualitePrise(ctx) {
    var nettete = netteteMasque(ctx);
    var Lmoy = ctx.LmoyenImage;
    var satures = ctx.p.partPixelsSatures;

    var nNettete = nettete === null ? 0 : clamp(0, 1, nettete / QUALITE.NETTETE_BONNE);
    var nExpo;
    if (Lmoy >= QUALITE.L_MIN && Lmoy <= QUALITE.L_MAX) nExpo = 1;
    else if (Lmoy < QUALITE.L_MIN) nExpo = clamp(0, 1, Lmoy / QUALITE.L_MIN);
    else nExpo = clamp(0, 1, 1 - (Lmoy - QUALITE.L_MAX) / (100 - QUALITE.L_MAX));
    nExpo *= clamp(0, 1, 1 - satures / QUALITE.SATURES_MAX);
    var nMasque = ctx.seg.confiance;
    var cadrage = ctx.seg.cadrage;
    var nCadrage = clamp(0, 1, cadrage / QUALITE.CADRAGE_CIBLE);

    var score = Math.round(100 * (0.28 * nNettete + 0.20 * nExpo + 0.32 * nMasque + 0.20 * nCadrage));
    var raisons = [];
    if (cadrage < QUALITE.CADRAGE_MIN) raisons.push('tete trop petite dans le cadre (' + Math.round(cadrage * 100) + ' % de la largeur)');
    if (ctx.seg.confiance < 0.30) raisons.push('chevelure mal separee du fond (confiance du masque ' + ctx.seg.confiance + ')');
    if (nettete !== null && nettete < QUALITE.NETTETE_MIN) raisons.push('image floue');
    if (Lmoy < QUALITE.L_MIN) raisons.push('image trop sombre');
    if (Lmoy > QUALITE.L_MAX) raisons.push('image trop claire');
    if (satures > QUALITE.SATURES_MAX) raisons.push('zones brulees par la lumiere');
    if (ctx.seg.couverture < QUALITE.COUVERTURE_MIN) raisons.push('chevelure trop petite dans le cadre');
    for (var a = 0; a < ctx.seg.alertes.length; a++) raisons.push('masque : ' + ctx.seg.alertes[a]);

    return {
      score: clamp(0, 100, score),
      // Un masque dont la confiance est au plancher ne doit RIEN publier, meme si la
      // photo est nette et bien cadree : c'est le cas ou le moteur a segmente le fond.
      exploitable: score >= QUALITE.SCORE_REFUS && cadrage >= QUALITE.CADRAGE_REFUS &&
                   ctx.seg.confiance >= 0.30,
      cadrage: Math.round(cadrage * 1000) / 1000,
      nettete: nettete === null ? null : Math.round(nettete * 10) / 10,
      exposition: { LmoyenImage: Math.round(Lmoy * 10) / 10, partPixelsSatures: Math.round(satures * 10000) / 10000 },
      masque: {
        couverture: Math.round(ctx.seg.couverture * 10000) / 10000,
        confiance: ctx.seg.confiance,
        contactBord: Math.round(ctx.seg.contactBord * 1000) / 1000,
        ratioTexture: ctx.seg.ratioTexture === null ? null : Math.round(ctx.seg.ratioTexture * 100) / 100,
        partPeauDansLaGraine: Math.round(ctx.seg.graine.partPeau * 100) / 100,
        purete: ctx.seg.purete,
        alertes: ctx.seg.alertes,
        pixels: ctx.seg.taille
      },
      raisons: raisons
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 9. QUESTIONNAIRE — 5 questions, posées AVANT le scan
  //    Il pondère, il ne remplace jamais une mesure. Chaque score publie sa
  //    part mesurée et sa part déclarée.
  // ════════════════════════════════════════════════════════════════════════

  var QUESTIONS = [
    { id: 'type_ressenti', libelle: 'Vos cheveux sont plutot',
      options: [
        { v: 'raides', l: 'Raides' }, { v: 'ondules', l: 'Ondules' },
        { v: 'boucles', l: 'Boucles' }, { v: 'crepus', l: 'Crepus' }
      ] },
    { id: 'etat', libelle: 'Aujourd hui ils sont',
      options: [
        { v: 'naturels', l: 'Naturels' }, { v: 'colores', l: 'Colores' },
        { v: 'decolores', l: 'Decolores ou meches' }, { v: 'defrises', l: 'Defrises ou permanentes' }
      ] },
    { id: 'probleme', libelle: 'Ce qui vous gene le plus',
      options: [
        { v: 'chute', l: 'Ils tombent' }, { v: 'pellicules', l: 'Pellicules' },
        { v: 'secheresse', l: 'Secs' }, { v: 'gras', l: 'Gras vite' },
        { v: 'casse', l: 'Ils cassent' }, { v: 'plats', l: 'Plats, sans volume' }
      ] },
    { id: 'lavage', libelle: 'Vous les lavez',
      options: [
        { v: 'quotidien', l: 'Tous les jours' }, { v: 'tous_deux_jours', l: 'Un jour sur deux' },
        { v: 'hebdo', l: 'Une a deux fois par semaine' }, { v: 'rare', l: 'Moins souvent' }
      ] },
    { id: 'age', libelle: 'Votre age',
      options: [
        { v: '-25', l: 'Moins de 25 ans' }, { v: '25-39', l: '25 a 39 ans' },
        { v: '40-54', l: '40 a 54 ans' }, { v: '55+', l: '55 ans et plus' }
      ] }
  ];

  /**
   * Combine une mesure (0..1) et une valeur déclarée (0..1).
   * - mesure absente  -> 100 % déclaré, et le score le dit.
   * - déclaré absent  -> 100 % mesuré.
   * - les deux absents-> null avec la raison. Jamais de valeur de remplissage.
   */
  function combiner(mes, dec, poidsMesure, libelle, sourceMesure, sourceDeclare) {
    var mv = (mes && mes.valeur !== null && mes.valeur !== undefined) ? mes.valeur : null;
    var dv = (dec === null || dec === undefined) ? null : dec;

    if (mv === null && dv === null) {
      return { libelle: libelle, valeur: null,
               raison: (mes && mes.raison) ? mes.raison : 'ni mesure ni reponse',
               partMesuree: 0, partDeclaree: 0, fiabilite: 'nulle' };
    }
    if (mv === null) {
      return { libelle: libelle, valeur: Math.round(dv * 100), partMesuree: 0, partDeclaree: 1,
               fiabilite: 'declaree',
               note: 'aucune mesure exploitable (' + ((mes && mes.raison) || 'mesure absente') + ') : ce score vient uniquement de la reponse au questionnaire',
               sources: [sourceDeclare] };
    }
    if (dv === null) {
      return { libelle: libelle, valeur: Math.round(mv * 100), partMesuree: 1, partDeclaree: 0,
               fiabilite: (mes.fiabilite || 'moyenne'), sources: [sourceMesure] };
    }
    var pm = clamp(0, 1, poidsMesure);
    // une mesure peu fiable pèse moins, automatiquement
    if (mes.fiabilite === 'faible') pm *= 0.6;
    var v = pm * mv + (1 - pm) * dv;
    return { libelle: libelle, valeur: Math.round(v * 100),
             partMesuree: Math.round(pm * 100) / 100, partDeclaree: Math.round((1 - pm) * 100) / 100,
             fiabilite: mes.fiabilite || 'moyenne',
             sources: [sourceMesure, sourceDeclare] };
  }

  /** Traductions réponse -> valeur 0..1. Aucune n'est une mesure, toutes sont déclarées. */
  function declare(rep, cle) {
    if (!rep) return null;
    var p = rep.probleme, e = rep.etat, l = rep.lavage, t = rep.type_ressenti, a = rep.age;
    switch (cle) {
      case 'secheresse':
        if (p === 'secheresse') return 0.85;
        if (e === 'decolores') return 0.72;
        if (p === 'gras') return 0.25;
        if (e === 'colores' || e === 'defrises') return 0.6;
        return p ? 0.45 : null;
      case 'casse':
        if (p === 'casse') return 0.85;
        if (e === 'decolores') return 0.7;
        if (e === 'defrises') return 0.65;
        if (e === 'colores') return 0.5;
        return p ? 0.35 : null;
      case 'gras':
        if (l === 'quotidien') return 0.85;
        if (l === 'tous_deux_jours') return 0.6;
        if (l === 'hebdo') return 0.3;
        if (l === 'rare') return 0.15;
        return p === 'gras' ? 0.8 : null;
      case 'frizz':
        if (t === 'crepus') return 0.75;
        if (t === 'boucles') return 0.6;
        if (t === 'ondules') return 0.4;
        if (t === 'raides') return 0.2;
        return null;
      case 'boucle':
        if (t === 'crepus') return 0.9;
        if (t === 'boucles') return 0.65;
        if (t === 'ondules') return 0.45;
        if (t === 'raides') return 0.15;
        return null;
      case 'blancs':
        if (a === '55+') return 0.55;
        if (a === '40-54') return 0.3;
        if (a === '25-39') return 0.08;
        if (a === '-25') return 0.02;
        return null;
      case 'densite':
        if (p === 'chute') return 0.25;
        if (p === 'plats') return 0.35;
        return null;
      default: return null;
    }
  }

  /**
   * Scores 0..100 destinés à l'écran. Chaque score dit d'où il vient.
   * Les scores 100 % déclarés (pellicules, chute) sont marqués comme tels :
   * le moteur ne sait pas les mesurer et ne fait pas semblant.
   */
  function composerScores(mesures, reponses) {
    var s = {};
    // Une mesure non validee est traitee comme absente pour la partie affichee.
    function m(cle) {
      var x = mesures[cle];
      if (!x) return null;
      var v = VALIDATION[cle];
      if (v && !v.validee) {
        return { valeur: null, raison: 'mesure_non_validee', detail: v.accord, fiabilite: 'nulle' };
      }
      return x;
    }

    s.secheresse = combiner(m('secheresse'), declare(reponses, 'secheresse'), 0.6,
      'Secheresse et matite', 'matite + entropie de texture (mesure)', 'etat et gene declares');

    s.brillance = combiner(m('brillance'), null, 1,
      'Brillance', 'reflets speculaires (mesure)', null);

    s.frizz = combiner(m('frizz'), declare(reponses, 'frizz'), 0.7,
      'Frizz et halo', 'fils isoles autour du contour (mesure)', 'type ressenti declare');

    s.casse = combiner(m('cassePointes'), declare(reponses, 'casse'), 0.45,
      'Pointes et casse', 'extremites de fils dans le tiers bas (mesure)', 'etat et gene declares');

    s.racinesGrasses = combiner(m('racinesGrasses'), declare(reponses, 'gras'), 0.30,
      'Racines grasses', 'gradient de brillance racines/longueurs (mesure indicative)', 'frequence de lavage declaree');

    s.boucle = combiner(m('boucle'), declare(reponses, 'boucle'), 0.55,
      'Boucle', 'orientation et courbure des meches (mesure)', 'type ressenti declare');

    var mBlancs = null;
    if (!VALIDATION.blancs.validee) {
      mBlancs = { valeur: null, raison: 'mesure_non_validee', detail: VALIDATION.blancs.accord };
    } else if (mesures.couleur && mesures.couleur.valeur !== null && mesures.couleur.partBlancs) {
      mBlancs = mesures.couleur.partBlancs.valeur === null
        ? { valeur: null, raison: mesures.couleur.partBlancs.raison }
        : { valeur: clamp(0, 1, mesures.couleur.partBlancs.valeur * 2.5),
            fiabilite: mesures.couleur.partBlancs.fiabilite };
    }
    s.blancs = combiner(mBlancs, declare(reponses, 'blancs'), 0.5,
      'Cheveux blancs', 'pixels chroma basse dispersés (mesure fragile)', 'age declare');

    var mDensite = m('densiteRaie');
    s.densite = combiner(mDensite, declare(reponses, 'densite'), 0.5,
      'Densite apparente', 'contraste a la raie (mesure, souvent indisponible)', 'gene declaree');

    // 100 % déclarés — assumés comme tels
    s.pellicules = {
      libelle: 'Pellicules', valeur: reponses && reponses.probleme === 'pellicules' ? 80 : (reponses ? 10 : null),
      partMesuree: 0, partDeclaree: 1, fiabilite: 'declaree',
      note: 'les pellicules ne sont pas mesurables sur une photo de chevelure : score entierement declare'
    };
    s.chute = {
      libelle: 'Chute', valeur: reponses && reponses.probleme === 'chute' ? 80 : (reponses ? 10 : null),
      partMesuree: 0, partDeclaree: 1, fiabilite: 'declaree',
      note: 'la chute se constate dans le temps, pas sur une image : score entierement declare'
    };

    if (mesures.couleur && mesures.couleur.valeur) {
      s.couleur = {
        libelle: 'Couleur', valeur: null, partMesuree: 1, partDeclaree: 0,
        lab: mesures.couleur.valeur, ton: mesures.couleur.ton, famille: mesures.couleur.famille,
        homogeneite: Math.round((mesures.couleur.homogeneite || 0) * 100),
        fiabilite: mesures.couleur.fiabilite,
        note: 'couleur mesuree en CIE L*a*b* ; pas de note sur 100, une couleur n est ni bonne ni mauvaise'
      };
    }

    return s;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 10. ROUTINE — 4 produits, un par étape
  // ════════════════════════════════════════════════════════════════════════

  var ETAPES = {
    1: { cle: 'lavage', libelle: 'Lavage',
         categories: ['shampooing', 'anti-pellicules'] },
    2: { cle: 'soin', libelle: 'Soin rince',
         categories: ['apres-shampooing', 'masque', 'proteine-reconstruction', 'coloration-soin'] },
    3: { cle: 'sans-rincage', libelle: 'Sans rincage',
         categories: ['soin-sans-rinçage', 'soin-sans-rincage', 'huile', 'protection-thermique'] },
    4: { cle: 'cible', libelle: 'Traitement cible',
         categories: ['serum-cuir-chevelu', 'traitement-chute', 'anti-pellicules', 'proteine-reconstruction', 'autre-cheveux'] }
  };

  /**
   * Étape d'un produit. La CATÉGORIE prime sur le champ etape du catalogue : sur le
   * catalogue reel du 19/09, un masque avant-shampooing et un apres-shampooing
   * portaient etape=1 et se retrouvaient proposes comme shampooing. La categorie est
   * plus fiable ; le champ etape ne sert que quand la categorie ne tranche pas.
   */
  function etapeDe(prod) {
    var c = (prod.categorie || '').toLowerCase();
    var nom = String(prod.name || '').toLowerCase();
    // Le NOM tranche quand il contredit franchement la categorie. Exemple reel du
    // catalogue du 19/09 : "Le Masque Nutrition Avant-Shampooing" etait range en
    // categorie shampooing, et se retrouvait propose comme produit de lavage.
    var estMasque = /\b(masque|mask)\b/.test(nom);
    var estApres = /(apr[eè]s-?shampo|conditioner|d[eé]m[eê]lant)/.test(nom);
    var estLavage = /(shampo|shampoo|cleanser|wash)\b/.test(nom) && !estMasque && !estApres;
    if (estMasque && c === 'shampooing') return 2;
    if (estApres && c === 'shampooing') return 2;
    if (estLavage && (c === 'masque' || c === 'apres-shampooing')) return 1;
    if (c === 'shampooing') return 1;
    if (c === 'apres-shampooing' || c === 'masque' || c === 'coloration-soin') return 2;
    if (c.indexOf('soin-sans-rin') === 0 || c === 'huile' || c === 'protection-thermique') return 3;
    if (c === 'serum-cuir-chevelu' || c === 'traitement-chute' || c === 'proteine-reconstruction') return 4;
    if (c === 'anti-pellicules') {
      // un antipelliculaire est un shampooing ou une lotion selon le produit
      var n = (prod.name || '').toLowerCase();
      if (n.indexOf('shampo') !== -1 || n.indexOf('shampoo') !== -1) return 1;
      return 4;
    }
    if (prod.etape && prod.etape >= 1 && prod.etape <= 4) return prod.etape;
    return null;
  }

  // Motifs de produits a ECARTER d'une routine. Trouves sur le catalogue reel :
  // un baume levres, des coffrets multi-produits, des entrees promotionnelles avec
  // emoji dans le nom (interdit a l'ecran), des noms a l'encodage casse.
  var HORS_ROUTINE = [
    { re: /\b(l[eè]vres?|lips?|corps|body|visage|face cream|mains|hands|parfum|perfume|bougie|candle|deodorant|d[eé]odorant|savon|gel douche|shower)\b/i,
      raison: 'produit qui n est pas un soin capillaire' },
    { re: /\b(set|kit|duo|trio|bundle|coffret|pack|collection)\b/i,
      raison: 'coffret ou lot : une routine propose des produits a l unite' },
    // "free" doit etre un mot isole : \b le trouvait dans "Snag-Free Detangler",
    // un vrai produit, qui se faisait ecarter a tort (bug trouve sur le catalogue reel).
    { re: /(^|\s)(free|gratuit|offert|gift|cadeau)(\s|$)/i,
      raison: 'entree promotionnelle, pas un produit' },
    { re: /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/u,
      raison: 'nom contenant un pictogramme : interdit a l ecran' },
    { re: /Ã[\u0080-\u00BF]/,
      raison: 'nom a l encodage casse (mojibake) : illisible a l ecran' }
  ];

  /** Renvoie null si le produit est utilisable, sinon la raison de l'ecart. */
  function raisonEcart(prod) {
    var n = String(prod.name || '');
    if (!n) return 'produit sans nom';
    for (var i = 0; i < HORS_ROUTINE.length; i++) {
      if (HORS_ROUTINE[i].re.test(n)) return HORS_ROUTINE[i].raison;
    }
    return null;
  }

  function texteProduit(p) {
    return [p.name, p.categorie, (p.actifs || []).join(' '), (p.cheveux_cibles || []).join(' '),
            (p.claims || []).join(' '), p.description || ''].join(' ').toLowerCase();
  }

  // Marqueurs lexicaux — cherchés dans le nom, les actifs, les cibles, les claims
  // et la description du produit. Tout vient du catalogue, rien n'est inventé.
  var MOTS = {
    nourrissant: ['nourriss', 'nutriti', 'riche', 'beurre', 'karite', 'huile', 'hydrat', 'masque', 'secs', 'seche'],
    purifiant: ['purifiant', 'clarifiant', 'sebo', 'sebum', 'gras', 'detox', 'equilibrant', 'fraicheur', 'argile', 'charbon'],
    reparation: ['repar', 'reconstruc', 'keratine', 'proteine', 'acide maleique', 'maleique', 'bond', 'liaison', 'abime', 'casse', 'fortifi'],
    // 'zinc' seul a ete retire : le zinc PCA est sebo-regulateur, pas antipelliculaire.
    // Il declenchait de fausses reserves sur les shampooings purifiants (bug trouve au
    // test de bout en bout).
    antipelliculaire: ['pellicul', 'piroctone', 'pyrithione de zinc', 'climbazole', 'ketoconazole', 'antifongique', 'squam'],
    chute: ['chute', 'densifi', 'redensifi', 'cafeine', 'aminexil', 'minoxidil', 'croissance', 'anti-chute'],
    boucles: ['boucl', 'crepu', 'curl', 'definition', 'frisot', 'frizz', 'ondul'],
    couleur: ['couleur', 'color', 'decolor', 'meche', 'blond', 'pigment', 'violet', 'eclat de la couleur'],
    volume: ['volume', 'fins', 'legere', 'leger', 'texturis', 'corps', 'aerien'],
    apaisant: ['apais', 'sensible', 'cuir chevelu', 'demangeaison', 'irrit'],
    thermique: ['thermique', 'chaleur', 'lissage', 'brushing'],
    blancs: ['blanc', 'gris', 'argent', 'violet', 'anti-jaune', 'jaunissement']
  };

  function compte(txt, liste) {
    var n = 0;
    for (var i = 0; i < liste.length; i++) if (txt.indexOf(liste[i]) !== -1) n++;
    return n;
  }

  /**
   * composerRoutine(scores, reponses, produits, options) -> 4 produits, 1 par étape.
   *
   * produits : tableau du catalogue capillaire (catalogue-cheveux/sortie/all.json, format
   *   REGLES.md : categorie, etape, cheveux_cibles, actifs, brand, name, url, price_eur).
   *   Accepté aussi sous la forme { products: [...] } ou { produits: [...] }.
   *   Si rien n'est fourni, le JEU D'ESSAI interne est utilisé et le resultat porte
   *   jeuEssai: true — à ne jamais afficher en production.
   *
   * Règles dures :
   *   - jamais deux produits de la même étape ;
   *   - jamais deux fois la même marque, SAUF en mode marque (vyvre.fr/m/<marque>/cheveux)
   *     où le catalogue est déjà filtré sur une seule marque ;
   *   - contresens interdits (shampooing nourrissant sur racines grasses, purifiant fort
   *     sur cheveux tres secs, etc.) : pénalités explicites, traçables dans pourquoi[] ;
   *   - une étape sans produit acceptable reste VIDE et est listée dans manques[].
   */
  function composerRoutine(scores, reponses, produits, options) {
    options = options || {};
    var jeuEssai = false;
    var liste = produits;
    if (liste && !Array.isArray(liste)) liste = liste.products || liste.produits || null;
    if (!liste || !liste.length) { liste = JEU_ESSAI_PRODUITS; jeuEssai = true; }

    var marque = options.marque || null;
    if (marque) {
      liste = liste.filter(function (p) {
        return (p.brand || '').toLowerCase() === String(marque).toLowerCase() ||
               (p.brand_name || '').toLowerCase() === String(marque).toLowerCase();
      });
    }

    var n = function (cle) {
      var sc = scores && scores[cle];
      return (sc && typeof sc.valeur === 'number') ? sc.valeur / 100 : null;
    };
    var besoins = {
      secheresse: n('secheresse'), casse: n('casse'), gras: n('racinesGrasses'),
      frizz: n('frizz'), boucle: n('boucle'), densite: n('densite'), blancs: n('blancs'),
      pellicules: n('pellicules'), chute: n('chute'),
      colore: reponses && (reponses.etat === 'colores' || reponses.etat === 'decolores') ? 1 : 0,
      decolore: reponses && reponses.etat === 'decolores' ? 1 : 0,
      plats: reponses && reponses.probleme === 'plats' ? 1 : 0
    };

    // Cibles attendues pour ce profil, dans le vocabulaire cheveux_cibles du catalogue.
    // Elles servent a la fois de bonus (le produit vise juste) et de malus (le produit
    // vise le contraire de ce qu'on a mesure).
    var attendues = {}, contraires = {};
    function poser(cle, cond) { if (cond) attendues[cle] = true; }
    poser('secs', besoins.secheresse !== null && besoins.secheresse > 0.6);
    poser('gras', besoins.gras !== null && besoins.gras > 0.65);
    poser('fins', besoins.plats === 1 || (besoins.densite !== null && besoins.densite < 0.4));
    poser('boucles', besoins.boucle !== null && besoins.boucle > 0.5);
    poser('crepus', besoins.boucle !== null && besoins.boucle > 0.78);
    poser('lisses', besoins.boucle !== null && besoins.boucle < 0.3);
    poser('colores', besoins.colore === 1);
    poser('abimes', besoins.casse !== null && besoins.casse > 0.6);
    poser('chute', besoins.chute !== null && besoins.chute > 0.5);
    poser('pellicules', besoins.pellicules !== null && besoins.pellicules > 0.5);
    poser('cuir-chevelu-sensible', besoins.pellicules !== null && besoins.pellicules > 0.5);
    if (attendues.secs && !attendues.gras) contraires.gras = true;
    if (attendues.gras && !attendues.secs) contraires.secs = true;
    if (attendues.lisses) { contraires.crepus = true; }
    if (attendues.crepus || attendues.boucles) contraires.lisses = true;
    if (attendues.fins) contraires.epais = true;

    function noter(prod, etape) {
      var t = texteProduit(prod);
      var cibles = (prod.cheveux_cibles || []).map(function (x) { return String(x).toLowerCase(); });
      // Base non nulle : sans elle, tous les produits hors sujet sont a egalite a 0 et
      // l'ordre du catalogue decide. C'est exactement le bug trouve au premier test de
      // bout en bout (un shampooing antipelliculaire propose a une chevelure seche).
      var score = 0.4, pourquoi = [], interdits = [];

      function plus(v, txt) { if (v > 0) { score += v; pourquoi.push(txt); } }
      function moins(v, txt) { if (v > 0) { score -= v; interdits.push(txt); } }

      var sec = besoins.secheresse, gras = besoins.gras, casse = besoins.casse;
      var pell = besoins.pellicules, chute = besoins.chute, boucle = besoins.boucle;

      // ---- affinite par cibles declarees du produit
      // Un produit qui vise plusieurs natures (secs + boucles + crepus) ne doit pas
      // etre puni pour celles qui ne correspondent pas des lors qu'il en vise une juste.
      var nJustes = 0;
      for (var cj = 0; cj < cibles.length; cj++) if (attendues[cibles[cj]]) nJustes++;
      for (var ci = 0; ci < cibles.length; ci++) {
        if (attendues[cibles[ci]]) plus(1.3, 'cible ' + cibles[ci]);
        else if (contraires[cibles[ci]]) moins(1.6 * (nJustes > 0 ? 0.35 : 1),
          'produit aussi destine aux cheveux ' + cibles[ci] + ', ce qui ne correspond pas au diagnostic');
      }

      // ---- contresens durs, valables a toutes les etapes
      // Un produit antipelliculaire est un traitement : hors sujet sans pellicules.
      if ((pell === null || pell < 0.4) && compte(t, MOTS.antipelliculaire) > 0) {
        moins(3.5, 'traitement antipelliculaire alors qu aucune pellicule n est declaree');
      }
      // Idem pour un anti-chute.
      if ((chute === null || chute < 0.4) && compte(t, MOTS.chute) > 0 &&
          !(besoins.densite !== null && besoins.densite < 0.4)) {
        moins(2.5, 'traitement chute alors qu aucune chute n est declaree');
      }
      // Produit pour boucles sur cheveux mesures raides.
      if (boucle !== null && boucle < 0.35 && compte(t, MOTS.boucles) > 1) {
        moins(2.0, 'produit boucles sur des cheveux raides');
      }
      // Un produit clarifiant / purifiant sur des cheveux secs est un contresens,
      // quelle que soit l'etape (le premier test ne le voyait qu'aux etapes 1 et 2).
      if (sec !== null && sec > 0.65 && (gras === null || gras < 0.6)) {
        moins(compte(t, MOTS.purifiant) * 1.3, 'produit purifiant sur des cheveux secs');
      }
      // Une laque ou un produit de coiffage pur n'est pas un soin.
      if (/\b(laque|hairspray|spray fixant|gel fixant|cire|wax|pommade)\b/i.test(prod.name || '')) {
        moins(1.6, 'produit de coiffage, pas un soin');
      }
      // Produit anti-jaunissement (pigment violet) sans cheveux clairs ni blancs.
      if ((besoins.blancs === null || besoins.blancs < 0.35) && !besoins.decolore &&
          compte(t, MOTS.blancs) > 1) {
        moins(1.5, 'soin anti-jaunissement sans cheveux blancs ni decoloration');
      }

      // ---- etape 1 : lavage
      if (etape === 1) {
        if (pell !== null && pell > 0.5) plus(compte(t, MOTS.antipelliculaire) * 2.2, 'shampooing antipelliculaire');
        if (gras !== null && gras > 0.6) {
          plus(compte(t, MOTS.purifiant) * 1.8, 'lavage purifiant pour racines grasses');
          moins(compte(t, MOTS.nourrissant) * 1.6, 'shampooing riche sur racines grasses');
        }
        if (sec !== null && sec > 0.6) {
          moins(compte(t, MOTS.purifiant) * 1.7, 'shampooing clarifiant sur cheveux secs');
          plus(compte(t, MOTS.nourrissant) * 1.0, 'lavage doux et nourrissant');
        }
        if (besoins.colore) plus(compte(t, MOTS.couleur) * 0.8, 'respecte la couleur');
        if (besoins.plats) {
          plus(compte(t, MOTS.volume) * 1.2, 'donne du corps');
          moins(compte(t, MOTS.nourrissant) * 1.0, 'trop riche pour des cheveux plats');
        }
      }

      // ---- etape 2 : soin rince
      if (etape === 2) {
        if (sec !== null) plus(compte(t, MOTS.nourrissant) * sec * 2.2, 'soin nourrissant pour la secheresse');
        if (casse !== null && casse > 0.55) plus(compte(t, MOTS.reparation) * 1.8, 'soin reconstructeur pour la casse');
        if (besoins.decolore) plus(compte(t, MOTS.reparation) * 1.2, 'cheveux decolores : reconstruction');
        if (gras !== null && gras > 0.7) moins(compte(t, MOTS.nourrissant) * 0.8, 'soin tres riche alors que les racines sont grasses');
        if (besoins.plats) moins(compte(t, MOTS.nourrissant) * 1.4, 'masque riche sur des cheveux fins et plats');
        if (boucle !== null && boucle > 0.55) plus(compte(t, MOTS.boucles) * 1.2, 'adapte aux boucles');
        if (sec !== null && sec > 0.6) moins(compte(t, MOTS.purifiant) * 1.2, 'soin purifiant sur cheveux secs');
      }

      // ---- etape 3 : sans rincage
      if (etape === 3) {
        if (besoins.frizz !== null && boucle !== null && boucle > 0.4) {
          plus(compte(t, MOTS.boucles) * besoins.frizz * 2.0, 'discipline le frizz');
        }
        if (sec !== null) plus(compte(t, MOTS.nourrissant) * sec * 1.4, 'nourrit sans rincer');
        if (casse !== null && casse > 0.55) plus(compte(t, MOTS.reparation) * 1.0, 'protege des longueurs fragiles');
        plus(compte(t, MOTS.thermique) * 0.6, 'protege de la chaleur');
        if (gras !== null && gras > 0.7) moins(compte(t, MOTS.nourrissant) * 1.2, 'huile lourde alors que les racines regraissent vite');
        if (besoins.plats) {
          moins(compte(t, MOTS.nourrissant) * 1.6, 'alourdit des cheveux deja plats');
          plus(compte(t, MOTS.volume) * 1.2, 'texture leger');
        }
      }

      // ---- etape 4 : traitement cible
      if (etape === 4) {
        if (pell !== null && pell > 0.5) plus(compte(t, MOTS.antipelliculaire) * 2.5, 'traitement antipelliculaire');
        if (chute !== null && chute > 0.5) plus(compte(t, MOTS.chute) * 2.5, 'traitement chute');
        if (casse !== null && casse > 0.6) plus(compte(t, MOTS.reparation) * 2.2, 'traitement reconstruction pour la casse');
        if (besoins.densite !== null && besoins.densite < 0.4) plus(compte(t, MOTS.chute) * 1.2, 'densite apparente faible');
        if (besoins.blancs !== null && besoins.blancs > 0.45) plus(compte(t, MOTS.blancs) * 1.2, 'entretient les cheveux blancs');
        if (sec !== null && sec > 0.7) plus(compte(t, MOTS.nourrissant) * 0.7, 'apport nourrissant cible');
        plus(compte(t, MOTS.apaisant) * 0.5, 'apaise le cuir chevelu');
      }

      return { score: score, pourquoi: pourquoi, interdits: interdits };
    }

    var parEtape = { 1: [], 2: [], 3: [], 4: [] };
    var ecartes = [];
    for (var i = 0; i < liste.length; i++) {
      var prod = liste[i];
      var motif = raisonEcart(prod);
      if (motif) { ecartes.push({ nom: prod.name, raison: motif }); continue; }
      var e = etapeDe(prod);
      if (!e) continue;
      var note = noter(prod, e);
      parEtape[e].push({ produit: prod, etape: e, note: note.score, pourquoi: note.pourquoi, interdits: note.interdits });
    }
    for (var e2 = 1; e2 <= 4; e2++) {
      parEtape[e2].sort(function (a, b) { return b.note - a.note; });
    }

    // Choix étape par étape, en commençant par celle qui a le moins de candidats
    // acceptables, pour que la contrainte de marque unique ne bloque pas une étape rare.
    var ordre = [1, 2, 3, 4].sort(function (a, b) { return parEtape[a].length - parEtape[b].length; });
    var marquesPrises = {}, choix = {}, manques = [], assouplissements = [];

    for (var o = 0; o < ordre.length; o++) {
      var et = ordre[o], pris = null;
      var meilleurToutes = parEtape[et].length ? parEtape[et][0] : null;
      var meilleurAutreMarque = null;
      for (var c = 0; c < parEtape[et].length; c++) {
        var cand = parEtape[et][c];
        var mq = (cand.produit.brand || cand.produit.brand_name || '').toLowerCase();
        if (!marque && mq && marquesPrises[mq]) continue;
        meilleurAutreMarque = cand; break;
      }
      // La regle "jamais deux fois la meme marque" ne doit pas imposer un contresens.
      // Si le meilleur produit d'une autre marque est nettement moins pertinent que le
      // meilleur produit tout court, on repete la marque ET on l'ecrit noir sur blanc.
      if (!marque && meilleurToutes && meilleurAutreMarque && meilleurAutreMarque !== meilleurToutes &&
          meilleurAutreMarque.note < Math.max(0.8, 0.5 * meilleurToutes.note)) {
        pris = meilleurToutes;
        assouplissements.push('etape ' + et + ' : marque repetee (' +
          (meilleurToutes.produit.brand_name || meilleurToutes.produit.brand) +
          ') parce que le meilleur produit d une autre marque etait nettement moins adapte');
      } else {
        pris = meilleurAutreMarque;
      }
      if (!pris && parEtape[et].length) {
        pris = parEtape[et][0];
        assouplissements.push('etape ' + et + ' : marque repetee, aucun autre produit disponible pour cette etape');
      }
      if (pris && pris.note <= 0) {
        // Tous les candidats de cette etape sont des contresens : on prefere une etape
        // vide a une recommandation absurde.
        manques.push('etape ' + et + ' (' + ETAPES[et].libelle + ') : aucun produit sans contresens dans le catalogue fourni (meilleure note ' + Math.round(pris.note * 100) / 100 + ')');
        continue;
      }
      if (!pris) {
        manques.push('etape ' + et + ' (' + ETAPES[et].libelle + ') : aucun produit de cette etape dans le catalogue fourni');
        continue;
      }
      choix[et] = pris;
      var mq2 = (pris.produit.brand || pris.produit.brand_name || '').toLowerCase();
      if (mq2) marquesPrises[mq2] = true;
    }

    var routine = [];
    for (var e3 = 1; e3 <= 4; e3++) {
      if (!choix[e3]) continue;
      var ch = choix[e3];
      routine.push({
        etape: e3, etapeLibelle: ETAPES[e3].libelle,
        id: ch.produit.id || null, nom: ch.produit.name, marque: ch.produit.brand_name || ch.produit.brand || null,
        categorie: ch.produit.categorie || null, url: ch.produit.url || null,
        image: ch.produit.image_local || ch.produit.image_url || null,
        actifs: ch.produit.actifs || [],
        note: Math.round(ch.note * 100) / 100,
        pourquoi: ch.pourquoi,
        reserves: ch.interdits
      });
    }

    return {
      routine: routine,
      complete: routine.length === 4,
      manques: manques,
      assouplissements: assouplissements,
      jeuEssai: jeuEssai,
      modeMarque: marque || null,
      produitsEcartes: ecartes.length,
      exemplesEcartes: ecartes.slice(0, 8),
      avertissement: jeuEssai
        ? 'JEU D ESSAI interne : produits reels mais sans lien verifie ni prix. Ne jamais afficher en production, remplacer par catalogue-cheveux/sortie/all.json.'
        : null,
      besoins: besoins
    };
  }

  /**
   * JEU D'ESSAI — sert uniquement à tester composerRoutine tant que
   * catalogue-cheveux/sortie/all.json n'existe pas.
   * Produits réels, actifs réels. AUCUN lien et AUCUN prix : on ne fabrique pas
   * d'URL ni de tarif. Chaque entrée porte jeuEssai: true.
   */
  var JEU_ESSAI_PRODUITS = [
    // --- étape 1 : lavage
    { id: 'essai--sh-doux-nutrition', name: 'Shampooing nutrition intense', brand: 'essai', brand_name: 'Jeu d essai', categorie: 'shampooing', etape: 1, cheveux_cibles: ['secs', 'abimes'], actifs: ['huile de karite', 'panthenol'], claims: ['nourrissant', 'douceur'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sh-purifiant', name: 'Shampooing purifiant equilibrant', brand: 'essai2', brand_name: 'Jeu d essai 2', categorie: 'shampooing', etape: 1, cheveux_cibles: ['gras'], actifs: ['argile verte', 'zinc'], claims: ['purifiant', 'sebo-regulateur'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sh-antipell', name: 'Shampooing antipelliculaire piroctone', brand: 'essai3', brand_name: 'Jeu d essai 3', categorie: 'anti-pellicules', etape: 1, cheveux_cibles: ['pellicules', 'cuir-chevelu-sensible'], actifs: ['piroctone olamine', 'acide salicylique'], claims: ['antipelliculaire', 'apaisant'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sh-volume', name: 'Shampooing volume cheveux fins', brand: 'essai4', brand_name: 'Jeu d essai 4', categorie: 'shampooing', etape: 1, cheveux_cibles: ['fins'], actifs: ['proteines de riz'], claims: ['volume', 'legere'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sh-couleur', name: 'Shampooing protection couleur', brand: 'essai5', brand_name: 'Jeu d essai 5', categorie: 'shampooing', etape: 1, cheveux_cibles: ['colores'], actifs: ['filtre UV', 'pigment violet'], claims: ['couleur', 'anti-jaunissement'], url: null, price_eur: null, jeuEssai: true },
    // --- étape 2 : soin rincé
    { id: 'essai--masque-nutrition', name: 'Masque nutrition beurre de karite', brand: 'essai', brand_name: 'Jeu d essai', categorie: 'masque', etape: 2, cheveux_cibles: ['secs', 'crepus', 'boucles'], actifs: ['beurre de karite', 'huile de coco'], claims: ['nourrissant', 'riche'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--masque-reconstruction', name: 'Masque reconstruction acide maleique', brand: 'essai6', brand_name: 'Jeu d essai 6', categorie: 'proteine-reconstruction', etape: 2, cheveux_cibles: ['abimes', 'colores'], actifs: ['acide maleique', 'keratine'], claims: ['reparation', 'liaison'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--ap-leger', name: 'Apres-shampooing demelant leger', brand: 'essai4', brand_name: 'Jeu d essai 4', categorie: 'apres-shampooing', etape: 2, cheveux_cibles: ['fins'], actifs: ['panthenol'], claims: ['legere', 'volume'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--ap-boucles', name: 'Apres-shampooing definition boucles', brand: 'essai7', brand_name: 'Jeu d essai 7', categorie: 'apres-shampooing', etape: 2, cheveux_cibles: ['boucles', 'crepus'], actifs: ['glycerine', 'huile d avocat'], claims: ['definition', 'boucles'], url: null, price_eur: null, jeuEssai: true },
    // --- étape 3 : sans rinçage
    { id: 'essai--sr-creme-boucles', name: 'Creme sans rincage definition boucles', brand: 'essai7', brand_name: 'Jeu d essai 7', categorie: 'soin-sans-rinçage', etape: 3, cheveux_cibles: ['boucles', 'crepus', 'secs'], actifs: ['glycerine', 'huile de brocoli'], claims: ['definition', 'anti-frizz'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sr-spray-leger', name: 'Spray sans rincage leger demelant', brand: 'essai4', brand_name: 'Jeu d essai 4', categorie: 'soin-sans-rinçage', etape: 3, cheveux_cibles: ['fins'], actifs: ['panthenol'], claims: ['legere', 'volume'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sr-huile', name: 'Huile de finition nourrissante', brand: 'essai', brand_name: 'Jeu d essai', categorie: 'huile', etape: 3, cheveux_cibles: ['secs', 'abimes'], actifs: ['huile d argan'], claims: ['nourrissant', 'brillance'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--sr-thermo', name: 'Spray protection thermique', brand: 'essai8', brand_name: 'Jeu d essai 8', categorie: 'protection-thermique', etape: 3, cheveux_cibles: ['abimes', 'colores'], actifs: ['proteines de ble'], claims: ['thermique', 'lissage'], url: null, price_eur: null, jeuEssai: true },
    // --- étape 4 : traitement ciblé
    { id: 'essai--tr-chute', name: 'Serum cuir chevelu anti-chute cafeine', brand: 'essai9', brand_name: 'Jeu d essai 9', categorie: 'traitement-chute', etape: 4, cheveux_cibles: ['chute'], actifs: ['cafeine', 'aminexil'], claims: ['anti-chute', 'densifiant'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--tr-pellicules', name: 'Lotion cuir chevelu antipelliculaire', brand: 'essai3', brand_name: 'Jeu d essai 3', categorie: 'serum-cuir-chevelu', etape: 4, cheveux_cibles: ['pellicules', 'cuir-chevelu-sensible'], actifs: ['piroctone olamine', 'climbazole'], claims: ['antipelliculaire', 'apaisant'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--tr-bond', name: 'Traitement liaisons reconstruction', brand: 'essai6', brand_name: 'Jeu d essai 6', categorie: 'proteine-reconstruction', etape: 4, cheveux_cibles: ['abimes', 'colores'], actifs: ['acide maleique'], claims: ['reparation', 'liaison', 'casse'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--tr-blancs', name: 'Soin cheveux blancs anti-jaunissement', brand: 'essai5', brand_name: 'Jeu d essai 5', categorie: 'coloration-soin', etape: 4, cheveux_cibles: ['colores'], actifs: ['pigment violet'], claims: ['blanc', 'argent', 'anti-jaune'], url: null, price_eur: null, jeuEssai: true },
    { id: 'essai--tr-apaisant', name: 'Serum cuir chevelu apaisant', brand: 'essai10', brand_name: 'Jeu d essai 10', categorie: 'serum-cuir-chevelu', etape: 4, cheveux_cibles: ['cuir-chevelu-sensible'], actifs: ['bisabolol'], claims: ['apaisant', 'demangeaisons'], url: null, price_eur: null, jeuEssai: true }
  ];

  // ════════════════════════════════════════════════════════════════════════
  // 11. PIPELINE
  // ════════════════════════════════════════════════════════════════════════

  /**
   * analyseFrame(imageData, roi)
   * roi = { faceBox } ou { landmarks } ou directement un faceBox / un tableau de 68 points.
   * Renvoie { ok, mesures, qualite, segmentation } pour UNE image.
   */
  function analyseFrame(imageData, roi, options) {
    options = options || {};
    var t0 = maintenant();
    var geoEntree = roi;
    if (roi && (roi.faceBox || roi.landmarks)) geoEntree = roi.landmarks || roi.faceBox;

    var seg = segmentCheveux(imageData, geoEntree, options);
    if (!seg.ok) {
      return {
        ok: false, raison: seg.raison, note: seg.note || null,
        mesures: null, qualite: { score: 0, exploitable: false, raisons: [seg.raison], masque: null },
        segmentation: seg, dureeMs: Math.round(maintenant() - t0)
      };
    }

    var ctx = construireContexte(seg);
    var qualite = qualitePrise(ctx);

    if (!qualite.exploitable) {
      return {
        ok: false, raison: 'qualite_insuffisante', note: qualite.raisons.join(' ; '),
        mesures: null, qualite: qualite, segmentation: seg,
        dureeMs: Math.round(maintenant() - t0)
      };
    }

    var brillance = mesureBrillance(ctx);
    var mesures = {
      brillance: brillance,
      frizz: mesureFrizz(ctx),
      couleur: mesureCouleur(ctx),
      boucle: mesureBoucle(ctx),
      densiteRaie: mesureDensiteRaie(ctx),
      finesse: mesureFinesse(ctx),
      racinesGrasses: mesureRacinesGrasses(ctx),
      secheresse: mesureSecheresse(ctx, brillance),
      cassePointes: mesureCassePointes(ctx)
    };

    return {
      ok: true, mesures: mesures, qualite: qualite, segmentation: seg, contexte: ctx,
      dureeMs: Math.round(maintenant() - t0)
    };
  }

  function maintenant() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  /** Agrège n frames : médiane des valeurs non nulles, mesure par mesure. */
  function agregerFrames(frames) {
    var cles = ['brillance', 'frizz', 'couleur', 'boucle', 'densiteRaie', 'finesse',
                'racinesGrasses', 'secheresse', 'cassePointes'];
    var out = {}, dispersion = {};
    for (var c = 0; c < cles.length; c++) {
      var cle = cles[c], valides = [], modeles = [];
      for (var f = 0; f < frames.length; f++) {
        var m = frames[f].mesures && frames[f].mesures[cle];
        if (m && m.valeur !== null && m.valeur !== undefined) { valides.push(m); }
      }
      if (!valides.length) {
        var premier = null;
        for (var g = 0; g < frames.length; g++) {
          var mm = frames[g].mesures && frames[g].mesures[cle];
          if (mm) { premier = mm; break; }
        }
        out[cle] = premier || mesureNulle('aucune_frame_exploitable', null, null);
        dispersion[cle] = null;
        continue;
      }
      if (cle === 'couleur') {
        // médiane composante par composante
        var Ls = [], as = [], bs = [];
        for (var k = 0; k < valides.length; k++) { Ls.push(valides[k].valeur.L); as.push(valides[k].valeur.a); bs.push(valides[k].valeur.b); }
        var ref = valides[Math.floor(valides.length / 2)];
        var copie = {}; for (var p in ref) if (Object.prototype.hasOwnProperty.call(ref, p)) copie[p] = ref[p];
        copie.valeur = { L: Math.round(median(Ls) * 10) / 10, a: Math.round(median(as) * 10) / 10, b: Math.round(median(bs) * 10) / 10 };
        copie.framesUtilisees = valides.length + '/' + frames.length;
        out[cle] = copie; dispersion[cle] = { L: std(Ls), a: std(as), b: std(bs) };
        continue;
      }
      var vals = valides.map(function (x) { return x.valeur; });
      var med = median(vals);
      var proche = valides[0], dmin = Infinity;
      for (var q = 0; q < valides.length; q++) {
        var d = Math.abs(valides[q].valeur - med);
        if (d < dmin) { dmin = d; proche = valides[q]; }
      }
      var copie2 = {}; for (var p2 in proche) if (Object.prototype.hasOwnProperty.call(proche, p2)) copie2[p2] = proche[p2];
      copie2.valeur = Math.round(med * 1000) / 1000;
      copie2.framesUtilisees = valides.length + '/' + frames.length;
      copie2.ecartTypeEntreFrames = valides.length > 1 ? Math.round(std(vals) * 1000) / 1000 : null;
      out[cle] = copie2;
      dispersion[cle] = valides.length > 1 ? std(vals) : null;
    }
    return { mesures: out, dispersion: dispersion };
  }

  // ---- capture navigateur -------------------------------------------------

  function versImageData(source, maxLargeur) {
    if (!source) return null;
    if (source.data && source.width && source.height) return source;    // déjà une ImageData
    if (typeof document === 'undefined') return null;
    var W = source.videoWidth || source.naturalWidth || source.width;
    var H = source.videoHeight || source.naturalHeight || source.height;
    if (!W || !H) return null;
    var ech = maxLargeur && W > maxLargeur ? maxLargeur / W : 1;
    var cw = Math.round(W * ech), ch = Math.round(H * ech);
    var cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(source, 0, 0, cw, ch);
    return cx.getImageData(0, 0, cw, ch);
  }

  /** Détection visage via face-api si présent. Renvoie null sinon (pas de repli inventé). */
  async function detecterVisage(source) {
    if (typeof global === 'undefined' || !global.faceapi) return null;
    var fa = global.faceapi;
    try {
      if (fa.nets && fa.nets.tinyFaceDetector && !fa.nets.tinyFaceDetector.params) {
        await fa.nets.tinyFaceDetector.loadFromUri('/scan/models/faceapi');
      }
      if (fa.nets && fa.nets.faceLandmark68Net && !fa.nets.faceLandmark68Net.params) {
        try { await fa.nets.faceLandmark68Net.loadFromUri('/scan/models/faceapi'); } catch (e) { /* facultatif */ }
      }
      var opts = new fa.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.35 });
      var det;
      if (fa.nets.faceLandmark68Net && fa.nets.faceLandmark68Net.params) {
        det = await fa.detectSingleFace(source, opts).withFaceLandmarks();
      } else {
        det = await fa.detectSingleFace(source, opts);
      }
      return det || null;
    } catch (e) {
      LOG('face-api indisponible :', e && e.message);
      return null;
    }
  }

  /**
   * runHairScan(videoOrImage, options) -> Promise
   *
   * options
   *   reponses       : réponses au questionnaire { type_ressenti, etat, probleme, lavage, age }
   *   faceBox        : { x, y, width, height } si l'appelant l'a déjà (coordonnées de l'image)
   *   landmarks      : 68 points face-api
   *   frames         : nombre de frames sur une video (defaut 3)
   *   intervalleMs   : espacement des frames (defaut 220)
   *   produits       : catalogue capillaire pour composer la routine (facultatif)
   *   marque         : mode marque, vyvre.fr/m/<marque>/cheveux
   *   largeurTravail : largeur de calcul (defaut 384)
   *
   * Renvoie { version, ok, mesures, scores, qualite, routine, raw, debug }.
   * Si l'image n'est pas exploitable : ok=false, mesures=null, une raison en clair,
   * et AUCUN chiffre de remplacement.
   */
  async function runHairScan(videoOrImage, options) {
    options = options || {};
    var t0 = maintenant();
    var nFrames = options.frames || (estVideo(videoOrImage) ? 3 : 1);
    var intervalle = options.intervalleMs || 220;
    var maxLargeur = options.captureLargeur || 900;

    // géométrie : fournie par l'appelant, sinon face-api, sinon échec explicite
    var geo = options.landmarks || options.faceBox || null;
    var sourceGeo = geo ? 'fournie_par_l_appelant' : null;
    if (!geo) {
      var det = await detecterVisage(videoOrImage);
      if (det) {
        geo = det.landmarks ? det : (det.box ? { box: det.box } : det);
        sourceGeo = 'face-api';
      }
    }
    if (!geo) {
      return {
        version: VERSION, ok: false, raison: 'visage_non_detecte',
        message: 'Aucun visage detecte : sans le visage, le moteur ne sait pas ou commence la chevelure. Se recadrer de face, tete entiere dans l image.',
        mesures: null, scores: null,
        qualite: { score: 0, exploitable: false, raisons: ['visage non detecte'] },
        raw: null, debug: { dureeMs: Math.round(maintenant() - t0) }
      };
    }

    var frames = [], echecs = [];
    for (var f = 0; f < nFrames; f++) {
      var img = versImageData(videoOrImage, maxLargeur);
      if (!img) { echecs.push('capture_impossible'); break; }
      var r = analyseFrame(img, geo, { largeurTravail: options.largeurTravail });
      if (r.ok) frames.push(r); else echecs.push(r.raison);
      if (f < nFrames - 1 && estVideo(videoOrImage)) await attendre(intervalle);
    }

    if (!frames.length) {
      return {
        version: VERSION, ok: false,
        raison: echecs[0] || 'aucune_frame_exploitable',
        message: messageRefus(echecs[0]),
        mesures: null, scores: null,
        qualite: { score: 0, exploitable: false, raisons: echecs },
        raw: { echecs: echecs, geometrie: sourceGeo },
        debug: { dureeMs: Math.round(maintenant() - t0) }
      };
    }

    var agr = agregerFrames(frames);
    var derniere = frames[frames.length - 1];
    var scores = composerScores(agr.mesures, options.reponses || null);

    var resultat = {
      version: VERSION, ok: true,
      mesures: agr.mesures,
      scores: scores,
      qualite: derniere.qualite,
      raw: {
        framesAnalysees: frames.length, framesDemandees: nFrames, echecs: echecs,
        geometrie: sourceGeo,
        modeleChevelure: derniere.segmentation.modele,
        bbox: derniere.segmentation.bbox,
        largeurTravail: derniere.segmentation.w,
        dispersionEntreFrames: agr.dispersion
      },
      limites: [
        'Le moteur ne sait pas distinguer un bonnet, une casquette, un foulard ou une perruque d une vraie chevelure : il mesure le tissu. Demander de se decouvrir avant le scan.',
        'Sur une photo ou plusieurs personnes apparaissent, seule la chevelure du visage le plus grand est mesuree.',
        'La couleur n est juste qu en relatif : la balance des blancs de la camera n est pas calibree.'
      ],
      debug: {
        dureeMs: Math.round(maintenant() - t0),
        parFrame: frames.map(function (x) { return { dureeMs: x.dureeMs, qualite: x.qualite.score }; }),
        avertissement: 'toutes les valeurs de ce resultat sont calculees depuis les pixels de l image ou issues du questionnaire ; aucune n est simulee'
      }
    };

    if (options.produits || options.composerRoutine !== false) {
      resultat.routine = composerRoutine(scores, options.reponses || null, options.produits || null,
        { marque: options.marque || null });
    }
    return resultat;
  }

  function estVideo(x) {
    return typeof HTMLVideoElement !== 'undefined' && x instanceof HTMLVideoElement;
  }
  function attendre(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function messageRefus(raison) {
    var m = {
      graine_indistincte_du_fond: 'Les cheveux et le fond se ressemblent trop juste au-dessus du front : changer de fond ou d eclairage.',
      pas_de_chevelure_au_dessus_du_front: 'Aucune chevelure ne depasse au-dessus du front.',
      chevelure_hors_cadre: 'La tete est coupee en haut de l image : reculer ou baisser la camera.',
      graine_vide: 'Rien de reconnaissable comme chevelure au-dessus du front : crane rase, casquette, ou cadrage trop bas.',
      fuite_dans_le_fond: 'Les cheveux et le fond ont la meme couleur : se placer devant un mur plus clair ou plus sombre.',
      masque_trop_petit: 'La chevelure occupe trop peu de place dans l image : se rapprocher.',
      aucune_geometrie_visage: 'Visage non detecte.',
      qualite_insuffisante: 'Image trop floue, trop sombre ou trop brulee pour mesurer quoi que ce soit.'
    };
    return m[raison] || 'Image inexploitable : ' + (raison || 'raison inconnue') + '.';
  }

  // ════════════════════════════════════════════════════════════════════════
  // 12. API PUBLIQUE
  // ════════════════════════════════════════════════════════════════════════

  var API = {
    version: VERSION,
    // entrées principales
    runHairScan: runHairScan,
    analyseFrame: analyseFrame,
    segmentCheveux: segmentCheveux,
    composerRoutine: composerRoutine,
    // questionnaire
    QUESTIONS: QUESTIONS,
    JEU_ESSAI_PRODUITS: JEU_ESSAI_PRODUITS,
    ETAPES: ETAPES,
    // briques exposées pour audit et tests
    preparerImage: preparerImage,
    construireContexte: construireContexte,
    normaliserGeometrie: normaliserGeometrie,
    qualitePrise: qualitePrise,
    composerScores: composerScores,
    mesureBrillance: mesureBrillance, mesureFrizz: mesureFrizz, mesureCouleur: mesureCouleur,
    mesureBoucle: mesureBoucle, mesureDensiteRaie: mesureDensiteRaie, mesureFinesse: mesureFinesse,
    mesureRacinesGrasses: mesureRacinesGrasses, mesureSecheresse: mesureSecheresse,
    mesureCassePointes: mesureCassePointes,
    netteteMasque: netteteMasque, peauIci: peauIci,
    rgbToLab: rgbToLab, labToLCh: labToLCh, estPeau: estPeau,
    distanceCheveu: distanceCheveu,
    dilater: dilater, distanceAuMasque: distanceAuMasque, zhangSuen: zhangSuen, fft: fft,
    percentile: percentile, median: median, ecartType: std, mad: mad, clamp: clamp,
    // honnêteté
    VALIDATION: VALIDATION,
    CE_QUI_EST_MESURE: {
      valide_sur_60_chevelures: ['boucle / type (75 % a 1 pres)', 'couleur L*a*b* clair vs fonce (70 %)'],
      calcule_mais_non_valide: ['brillance', 'frizz', 'secheresse', 'casse / pointes', 'racines grasses', 'part de cheveux blancs', 'densite a la raie'],
      desactive: ['finesse de fibre (aucune periode plausible trouvee)'],
      jamais_mesure: ['chute', 'pellicules', 'porosite', 'etat du bulbe', 'dommage chimique interne'],
      angle_mort: ['bonnet, casquette, foulard, perruque : mesures comme une chevelure', 'crane rase : parfois accepte a tort'],
      note: 'lire catalogue-cheveux/ICE_V1_VALIDATION.md avant de presenter un chiffre a un client'
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (global) global.VYVRE_HAIR_ENGINE = API;

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
