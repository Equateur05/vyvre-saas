/**
 * VYVRE HAIR ENGINE — ICE v2 (Indice Capillaire par Extraction)
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
 *   - Le questionnaire (TROIS questions) pondère, il ne remplace jamais une mesure.
 *     Chaque score publie sa part mesurée et sa part déclarée. Une information qui n'a
 *     pas été demandée ne reçoit pas de valeur par défaut : le score vaut null.
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
 *     QUESTIONS (3 questions), QUESTIONS_FACULTATIVES, JEU_ESSAI_PRODUITS, ...helpers
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

  var VERSION = 'ice-v2';
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
   * TEST DE PEAU EN CIE Lab — strict.
   *
   * La peau humaine, toutes carnations confondues, occupe un domaine etroit en Lab :
   * clarte moyenne a haute, a* positif modere (rougeur du sang), b* positif franc
   * (jaune du carotene et de la melanine), teinte entre 25 et 75 degres.
   * Bornes : Zhang & Wang 2013 (skin color modelling in CIELab), elargies aux carnations
   * foncees vers le bas de L*.
   *
   * Un cheveu chatain clair peut tomber dedans : ce test n'est donc JAMAIS utilise seul.
   * Il est combine soit a la geometrie du visage, soit a l'absence de texture (la peau
   * est lisse, un cheveu ne l'est pas).
   */
  function estPeauLab(L, a, b) {
    if (L < 28 || L > 92) return false;
    if (a < 3 || a > 28) return false;
    if (b < 5 || b > 36) return false;
    var h = Math.atan2(b, a) * 180 / Math.PI;
    if (h < 22 || h > 78) return false;
    var C = Math.sqrt(a * a + b * b);
    return C > 6 && C < 45;
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

  /**
   * Distance CIE Delta E 1976 — poids EGAUX sur L*, a*, b*.
   *
   * C'est la distance a utiliser pour la PEAU. La distance ponderee (L* a 0,35) est faite
   * pour la chevelure, ou l'ombre entre les meches fait varier la clarte sans changer le
   * cheveu. Pour la peau c'est l'inverse : ce qui separe une peau d'un cheveu chatain,
   * c'est precisement la clarte (36 unites de L* d'ecart mesurees), et la ponderer a 0,35
   * revient a effacer la seule chose qui les distingue.
   */
  function distanceE76(p, i, L, a, b) {
    var dL = p.L[i] - L, da = p.a[i] - a, db = p.b[i] - b;
    return Math.sqrt(dL * dL + da * da + db * db);
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
   * PEAU DE CETTE PERSONNE, apprise sur la bande des joues.
   *
   * Ce bloc vivait a l'interieur de segmentCheveux. Il en est sorti tel quel le 23/09
   * parce que la voie « masque fourni de l'exterieur » doit appliquer EXACTEMENT la
   * meme definition de la peau : deux definitions qui divergeraient, ce serait deux
   * moteurs differents sous le meme nom, et les mesures ne seraient plus comparables.
   * fx, fy, fw, fh sont la boite du visage A LA RESOLUTION DE TRAVAIL (deja divisee
   * par p.pas). Renvoie null quand la bande des joues ne donne pas assez de pixels surs.
   */
  function apprendrePeauDuVisage(p, fx, fy, fw, fh) {
    var w = p.w, h = p.h;
    var refPeau = null;
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
      if (pl.length < 60) return null;
      var mL2 = median(pl), ma2 = median(pa), mb2 = median(pb);
      var dd = [], gg2 = [];
      for (var q = 0; q < pl.length; q++) {
        var d1 = pl[q] - mL2, d2 = pa[q] - ma2, d3 = pb[q] - mb2;
        dd.push(Math.sqrt(d1 * d1 + d2 * d2 + d3 * d3));    // Delta E76
      }
      // Gradient median de la peau de cette personne : sert de reference de LISSAGE.
      for (var yg2 = Math.max(0, yJoue0); yg2 <= Math.min(h - 1, yJoue1); yg2++) {
        for (var xg2 = Math.max(0, xJ0); xg2 <= Math.min(w - 1, xJ1); xg2++) {
          var ig3 = yg2 * w + xg2;
          if (p.peau[ig3]) gg2.push(p.grad[ig3]);
        }
      }
      // Dispersion ROBUSTE : le percentile 90 des distances intra-joue integrait les
      // ombres et la bouche, le seuil saturait a 22 et la "peau" couvrait l image
      // entiere (vu en rendant le masque). La mediane des distances x 2.2, bornee a 14,
      // colle a la peau et a elle seule.
      // Seuil en Delta E76, borne a 18 : deux peaux de la meme personne restent sous 10,
      // un cheveu chatain est a 37, un blond fonce a 26, un poivre et sel a 26.
      // Au-dela de 18 on mangerait des cheveux ; en dessous de 8 on ne verrait plus la
      // peau a l'ombre.
      refPeau = { L: mL2, a: ma2, b: mb2,
                  seuil: clamp(8, 18, (median(dd) || 5) * 2.2),
                  gradMedian: gg2.length ? median(gg2) : null,
                  n: pl.length };
    return refPeau;
  }

  /**
   * CARTE DE PEAU de l'image entiere, au sens de la peau apprise ci-dessus.
   * Egalement sortie de segmentCheveux le 23/09, et pour la meme raison.
   */
  function cartePeauLocale(p, refPeau, filtresVisage, ligneYeux, peauAncienne) {
    var w = p.w, h = p.h;
    var seuilLisse = (refPeau && refPeau.gradMedian)
      ? Math.max(1.5, refPeau.gradMedian * 2.5)
      : null;
    var peauLocale = new Uint8Array(w * h);
    if (peauAncienne) {
      // REPRODUCTION DU DEFAUT, pour mesurer l'avant et l'apres sur la meme image :
      // exclusion par la couleur seule (domaine Lab generique ou YCbCr). C'est cette
      // regle qui classait une chevelure chatain comme de la peau a 100 %.
      for (var ia = 0; ia < peauLocale.length; ia++) {
        if (refPeau && distanceLab(p, ia, refPeau.L, refPeau.a, refPeau.b) < 14) peauLocale[ia] = 1;
        else if (estPeauLab(p.L[ia], p.a[ia], p.b[ia])) peauLocale[ia] = 1;
        else if (!refPeau && p.peau[ia]) peauLocale[ia] = 1;
      }
    } else if (refPeau && seuilLisse !== null) {
      // 21/09 — LE FRONT. Captures de Charles : le masque couvrait son front, et
      // c'etait structurel : au-dessus de la ligne des yeux, aucun pixel ne pouvait
      // etre exclu comme peau. Or un front degarni, c'est de la peau AU-DESSUS des
      // yeux. On l'exclut desormais aussi, mais avec des exigences plus dures que
      // sous les yeux — plus lisse (0,6 x) et plus proche de SA peau (0,85 x) —
      // pour qu'une meche chatain, texturee, ne soit jamais prise pour du front.
      var dessusLisse = seuilLisse * 0.6, dessusCouleur = refPeau.seuil * 0.85;
      for (var ipy = 0; ipy < h; ipy++) {
        var auDessus = filtresVisage && ipy < ligneYeux;
        for (var ipx = 0; ipx < w; ipx++) {
          var ip = ipy * w + ipx;
          var dC = distanceE76(p, ip, refPeau.L, refPeau.a, refPeau.b);
          if (dC >= (auDessus ? dessusCouleur : refPeau.seuil)) continue;
          if (p.grad[ip] >= (auDessus ? dessusLisse : seuilLisse)) continue;   // texture : pas de la peau
          peauLocale[ip] = 1;
        }
      }
    }
    return peauLocale;
  }

  /**
   * segmentDepuisMasqueExterne(imageData, faceBoxOuLandmarks, options)
   *
   * POURQUOI CETTE VOIE EXISTE
   *   La segmentation maison part d'une graine au-dessus du front et fait pousser une
   *   region par la couleur. Quand le decor ressemble aux cheveux, la region sort dans
   *   le decor : audit du 23/09 sur 40 portraits, 20 % de refus et deux erreurs franches
   *   de couleur — p_213, ou du feuillage vert entrait dans le masque et faisait dire
   *   « coloration vive » ; p_225, ou un fond magenta faisait lire des cheveux platines
   *   comme crepus colores. Aucun reglage de seuil ne repare cela : il faut que quelque
   *   chose sache ce qu'est un cheveu. Le guidage possede deja ce quelque chose, le
   *   modele hair_segmenter de MediaPipe. On accepte donc son masque tel quel.
   *
   * CE QUI CHANGE, ET CE QUI NE CHANGE PAS
   *   Ne change pas : toutes les mesures, la qualite de prise, les scores, la routine.
   *   Elles lisent un objet de segmentation, et cet objet a ici exactement les memes
   *   champs que celui de la voie maison — masque, w, h, prep, geo, bbox, taille,
   *   couverture, cadrage, modele, refPeau, fonds — a l'origine pres ('externe').
   *   Change : le masque n'est plus appris, il est donne. Le « modele chevelure »
   *   (L*, a*, b* medians, intervalle de clarte, seuil de distance) est donc appris SUR
   *   TOUT LE MASQUE et non sur une bande graine : c'est tout l'interet, la couleur de
   *   reference ne peut plus venir d'un mur.
   *
   * CE QUI RESTE REFUSE
   *   Les memes garde-fous de securite qu'en voie maison : chevelure hors cadre (la
   *   zone au-dessus du front sort de l'image) et masque trop petit (moins de 1,2 % de
   *   l'image). Un masque fourni n'est pas une garantie : MediaPipe rend aussi un
   *   masque quasi vide sur un crane rase, et on ne mesure pas une chevelure absente.
   *
   * options.masqueExterne = { data, largeur, hauteur, seuil }
   *   data    : Float32Array (0..1) ou Uint8Array (0..255, ou 0..1 si c'est deja un
   *             booleen). L'echelle est devinee sur le maximum observe, pour que
   *             l'appelant n'ait pas a la declarer.
   *   largeur, hauteur : dimensions du masque. Il couvre le MEME cadrage que l'image
   *             (pas un recadrage), il est donc simplement rechantillonne.
   *   seuil   : au-dessus, le pixel est cheveu. 0,5 par defaut.
   */
  function segmentDepuisMasqueExterne(imageData, faceBoxOuLandmarks, options) {
    options = options || {};
    var p = options.prep || preparerImage(imageData, options.largeurTravail);
    var geo = normaliserGeometrie(faceBoxOuLandmarks);
    var ext = options.masqueExterne;
    var w = p.w, h = p.h, i;

    if (!ext || !ext.data || !ext.largeur || !ext.hauteur) {
      return { ok: false, raison: 'masque_externe_invalide', masque: null, prep: p, geo: geo,
               note: 'masqueExterne attendu sous la forme { data, largeur, hauteur, seuil } : rien d exploitable n a ete fourni.' };
    }

    // Echelle des valeurs : un Float32Array de MediaPipe va de 0 a 1, un PNG en niveaux
    // de gris relu au canvas va de 0 a 255. On ne demande pas a l'appelant de le dire,
    // on le lit sur le maximum : c'est la seule facon de ne pas tout refuser en silence
    // quand le format change de main.
    var maxV = 0;
    for (i = 0; i < ext.data.length; i++) if (ext.data[i] > maxV) maxV = ext.data[i];
    var echelle = maxV > 1.5 ? (1 / 255) : 1;
    var seuil01 = (typeof ext.seuil === 'number' ? ext.seuil : 0.5);

    // Rechantillonnage a la resolution de travail. Moyenne des pixels source couverts
    // (et non plus proche voisin) : le masque fait 256 px de large, la resolution de
    // travail 384, et le plus proche voisin fabriquait des dents de scie qui faisaient
    // monter le contact avec le bord et l'energie de gradient du bord de masque.
    var masque = new Uint8Array(w * h), taille = 0;
    var ex = ext.largeur / w, ey = ext.hauteur / h;
    for (var y = 0; y < h; y++) {
      var sy0 = Math.floor(y * ey), sy1 = Math.max(sy0 + 1, Math.floor((y + 1) * ey));
      if (sy1 > ext.hauteur) sy1 = ext.hauteur;
      for (var x = 0; x < w; x++) {
        var sx0 = Math.floor(x * ex), sx1 = Math.max(sx0 + 1, Math.floor((x + 1) * ex));
        if (sx1 > ext.largeur) sx1 = ext.largeur;
        var somme = 0, cnt = 0;
        for (var sy = sy0; sy < sy1; sy++) {
          for (var sx = sx0; sx < sx1; sx++) { somme += ext.data[sy * ext.largeur + sx]; cnt++; }
        }
        if (!cnt) continue;
        if ((somme / cnt) * echelle > seuil01) { masque[y * w + x] = 1; taille++; }
      }
    }

    // CE QUI N'EST PAS ACCROCHE A LA TETE N'EST PAS SA CHEVELURE.
    // Un modele de segmentation repond sur toute l'image, pas sur une personne. Mesure
    // du 23/09 sur p_045 (plan large de concert) : hair_segmenter avait marque la
    // chevelure, mais aussi un pied de micro et une chaussure a l'autre bout du cadre,
    // et la couleur lue tombait de « cuivre clair » a « fonce ».
    // La regle est donc topologique, pas geometrique : on garde les morceaux de masque
    // RELIES a la tete, et on jette les ilots poses ailleurs. Decouper a l'emporte-piece
    // dans une ellipse autour du visage a ete essaye et rejete le meme jour : cela
    // amputait les cheveux longs, et cinq portraits de plus passaient sous le seuil de
    // taille (p_036, p_178, p_211, p_331, p_339). Une chevelure descend aussi bas
    // qu'elle veut, du moment qu'elle part de la tete.
    // C'est une regle de forme, pas de couleur : elle ne redonne aucun droit d'entree
    // au decor. Sans visage (nuque, dessus du crane), il n'y a pas de tete reperee :
    // on retombe sur le seul nettoyage possible, le retrait des poussieres.
    var zoneTete = null;
    if (geo) {
      var sc = 1 / p.pas;
      var tfx = geo.box.x * sc, tfy = geo.box.y * sc;
      var tfw = geo.box.width * sc, tfh = geo.box.height * sc;
      zoneTete = { x0: tfx - 0.7 * tfw, x1: tfx + 1.7 * tfw,
                   y0: tfy - 1.0 * tfh, y1: tfy + 1.6 * tfh };
    }
    if (taille > 0) {
      var net = composantesRetenues(masque, w, h, 0.03 * taille, zoneTete);
      masque = net.masque; taille = net.taille;
    }

    var couverture = taille / (w * h);

    // GARDE-FOU 1, le meme qu'en voie maison : la zone au-dessus du front doit tenir
    // dans l'image. Si la tete est coupee en haut, il n'y a pas de chevelure a lire,
    // seulement le morceau qui reste.
    if (geo) {
      var s0 = 1 / p.pas;
      var gy0 = Math.round(geo.box.y * s0 - geo.box.height * s0 * SEG.GRAINE_HAUT);
      var gy1 = Math.round(geo.box.y * s0 - geo.box.height * s0 * SEG.GRAINE_BAS);
      gy0 = clamp(0, h - 1, gy0); gy1 = clamp(0, h - 1, gy1);
      if (gy1 - gy0 < 3) {
        return { ok: false, raison: 'chevelure_hors_cadre', masque: null, prep: p, geo: geo,
                 origine: 'externe',
                 note: 'la zone au-dessus du front sort de l image : reculer ou recadrer plus haut.' };
      }
    }

    // GARDE-FOU 2 : un masque fourni peut etre quasi vide (crane rase, bonnet, tete
    // hors champ). On ne mesure pas une chevelure absente.
    if (couverture < SEG.MASQUE_MIN) {
      return { ok: false, raison: 'masque_trop_petit', masque: null, prep: p, geo: geo,
               couverture: couverture, origine: 'externe',
               note: 'moins de 1,2 % de l image reconnue comme chevelure par le masque fourni : cheveux tres courts, tete coupee par le cadre, ou couvre-chef.' };
    }

    // --- modele chromatique, appris SUR LE MASQUE ENTIER
    // En voie maison ce modele vient d'une bande graine de quelques centaines de pixels
    // au-dessus du front, et c'est sa fragilite : quand la graine tombe sur un mur, tout
    // le reste du calcul herite du mur. Ici le masque est la verite de depart, donc la
    // couleur de reference est celle de toute la chevelure.
    var sL = [], sa = [], sb = [], sg = [];
    for (i = 0; i < masque.length; i++) {
      if (!masque[i]) continue;
      sL.push(p.L[i]); sa.push(p.a[i]); sb.push(p.b[i]); sg.push(p.grad[i]);
    }
    var mL = median(sL), ma = median(sa), mb = median(sb);
    var gradGraine = median(sg);
    var Lmin = (percentile(sL, 10) || mL) - 12;
    var Lmax = (percentile(sL, 90) || mL) + 20;
    var dists = [];
    for (var k = 0; k < sL.length; k++) {
      var Lk = sL[k];
      var dLk = Lk < Lmin ? Lmin - Lk : (Lk > Lmax ? Lk - Lmax : 0);
      var dak = sa[k] - ma, dbk = sb[k] - mb;
      dists.push(Math.sqrt(dLk * dLk + dak * dak + dbk * dbk));
    }
    var seuil = clamp(SEG.DIST_MIN, SEG.DIST_MAX, (percentile(dists, 85) || 6) * 2.0 + 6);

    // --- peau de la personne et fonds de l'image : mesures identiques a la voie maison.
    // Elles ne servent plus a construire le masque (il est donne) mais les mesures s'en
    // servent encore — la raie cherche du cuir chevelu, les pointes evitent la peau.
    var refPeau = null, ligneYeux = null, filtresVisage = options.filtresVisage !== false;
    if (geo) {
      var s = 1 / p.pas;
      var fx = geo.box.x * s, fy = geo.box.y * s, fw = geo.box.width * s, fh = geo.box.height * s;
      refPeau = apprendrePeauDuVisage(p, fx, fy, fw, fh);
      if (geo.landmarks && geo.landmarks.length >= 48) {
        var syy = 0;
        for (var ly = 36; ly <= 47; ly++) syy += geo.landmarks[ly].y;
        ligneYeux = (syy / 12) * s;
      } else if (typeof options.ligneYeux === 'number') {
        ligneYeux = options.ligneYeux * s;
      } else {
        ligneYeux = fy + fh * 0.40;
      }
    }
    var peauLocale = (refPeau && ligneYeux !== null)
      ? cartePeauLocale(p, refPeau, filtresVisage, ligneYeux, false)
      : new Uint8Array(w * h);
    var fonds = modelesDeFond(p);

    // --- diagnostic, aux memes definitions qu'en voie maison
    var bbox = { x0: w, y0: h, x1: 0, y1: 0 };
    for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) {
      if (masque[yy * w + xx]) {
        if (xx < bbox.x0) bbox.x0 = xx; if (xx > bbox.x1) bbox.x1 = xx;
        if (yy < bbox.y0) bbox.y0 = yy; if (yy > bbox.y1) bbox.y1 = yy;
      }
    }

    var contactBord = 0, bordTotal = 0;
    for (var xb = 0; xb < w; xb++) { bordTotal += 2; if (masque[xb]) contactBord++; if (masque[(h - 1) * w + xb]) contactBord++; }
    for (var yb = 0; yb < h; yb++) { bordTotal += 2; if (masque[yb * w]) contactBord++; if (masque[yb * w + w - 1]) contactBord++; }

    // Part de PEAU restee dans le masque fourni. C'est l'equivalent honnete de la
    // « part de peau dans la graine » : ce que le masque a avale de visage.
    var nPeau = 0;
    for (i = 0; i < masque.length; i++) if (masque[i] && peauLocale[i]) nPeau++;
    var partPeau = taille ? nPeau / taille : 0;

    // PURETE ET CONFIANCE : CE QUE LE MOTEUR N'A PLUS LE DROIT DE JUGER.
    //
    // En voie maison, la purete est la part des pixels encore plus proches du modele
    // chevelure que de la peau et du decor. Applique a un masque fourni, ce test refait
    // exactement le jugement qu'on vient de lui retirer — et il se trompe de la meme
    // facon. Mesure du 23/09, banc des 40 portraits : p_062 sortait a 26 % de purete
    // avec zero pixel de peau, uniquement parce que la chevelure a la couleur du mur ;
    // p_084 a 79 % de « peau dans le masque » parce que la regle de peau, qui est une
    // regle de couleur, reconnait une chevelure foncee sur une carnation foncee. Les
    // deux etaient refuses, alors que MediaPipe avait raison sur les deux.
    //
    // On mesure donc encore ces deux nombres — ils sont publies, ils sont vrais, et ils
    // servent a comprendre une prise apres coup — mais ils ne PESENT PLUS sur la
    // confiance. La confiance d'un masque fourni ne retient que ce qui reste
    // independant de la couleur : la place qu'il prend dans l'image, et le fait qu'il
    // sorte du cadre. Le jour ou on saura auditer un masque fourni autrement que par
    // la couleur, ce sera ici.
    var nPur = 0;
    for (i = 0; i < masque.length; i++) {
      if (!masque[i]) continue;
      var dCheveu = distanceCheveu(p, i, Lmin, Lmax, ma, mb);
      if (dCheveu > seuil) continue;
      if (refPeau && distanceLab(p, i, refPeau.L, refPeau.a, refPeau.b) < dCheveu) continue;
      var pris = false;
      for (var z = 0; z < fonds.length; z++) {
        if (distanceLab(p, i, fonds[z].L, fonds[z].a, fonds[z].b) < dCheveu) { pris = true; break; }
      }
      if (!pris) nPur++;
    }
    var pureteCouleur = taille ? nPur / taille : 0;

    // ratioTexture reste a 1 : il mesurait « le masque a-t-il avale du fond lisse par
    // rapport a sa graine ». Sans graine ni croissance, ce rapport n'a plus de sens, et
    // le faire calculer contre un modele tire du masque lui-meme donnerait 1 par
    // construction. On l'annonce a 1 plutot que d'inventer un chiffre, comme le fait
    // deja la segmentation par texture.
    //
    // Les alertes suivent la meme regle : seules celles qui ne parlent pas de couleur
    // sont levees. Une alerte « masque impur » sur un masque fourni ne dirait rien de
    // sa qualite, seulement que la chevelure ressemble au decor.
    var alertes = [];
    if (contactBord / bordTotal > 0.35) alertes.push('masque_colle_au_bord');
    if (couverture > 0.45) alertes.push('couverture_elevee');

    return {
      ok: true,
      masque: masque, w: w, h: h, prep: p, geo: geo, bbox: bbox,
      taille: taille, couverture: couverture,
      cadrage: geo ? (geo.box.width / p.largeurOrigine) : null,
      modele: { L: mL, a: ma, b: mb, Lmin: Lmin, Lmax: Lmax, seuil: seuil, gradGraine: gradGraine },
      refPeau: refPeau, peauLocale: peauLocale, fonds: fonds,
      zoneVisage: geo ? { ligneYeux: ligneYeux, active: filtresVisage } : null,
      // Il n'y a pas de graine : le champ existe pour que qualitePrise lise la meme
      // chose des deux cotes, et il dit la verite — la part de peau du MASQUE.
      graine: { x0: 0, x1: 0, y0: 0, y1: 0, partPeau: partPeau, partFond: 0, pixels: taille },
      origine: 'externe',
      sourceMasque: ext.source || 'fourni par l appelant',
      contactBord: contactBord / bordTotal,
      ratioTexture: 1,
      // purete = null : inconnue, et on le dit. Voir plus haut pourquoi le chiffre
      // mesure (pureteCouleur) n'est pas une purete mais une ressemblance au decor.
      purete: null,
      pureteCouleur: Math.round(pureteCouleur * 100) / 100,
      retiresFond: 0,
      alertes: alertes,
      confiance: confianceMasque(couverture, contactBord / bordTotal, 1, 0, null)
    };
  }

  /**
   * Nettoyage d'un masque fourni, par composantes 8-connexes.
   *   zone fournie : on garde les composantes qui touchent la tete, et elles seules.
   *   zone absente (ou aucune composante ne la touche) : on garde celles qui pesent au
   *   moins `mini` pixels — le seul tri possible quand on ne sait pas ou est la tete.
   */
  function composantesRetenues(m, w, h, mini, zone) {
    var vus = new Uint8Array(w * h), out = new Uint8Array(w * h);
    var file = new Int32Array(w * h), taille = 0;
    var DX = [1, -1, 0, 0, 1, 1, -1, -1], DY = [0, 0, 1, -1, 1, -1, 1, -1];
    var comps = [], touche = false;
    for (var d0 = 0; d0 < m.length; d0++) {
      if (!m[d0] || vus[d0]) continue;
      var tete = 0, queue = 0, dansZone = false;
      vus[d0] = 1; file[queue++] = d0;
      while (tete < queue) {
        var cur = file[tete++];
        var cy = (cur / w) | 0, cx = cur - cy * w;
        if (zone && cx >= zone.x0 && cx <= zone.x1 && cy >= zone.y0 && cy <= zone.y1) dansZone = true;
        for (var d = 0; d < 8; d++) {
          var nx = cx + DX[d], ny = cy + DY[d];
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          var ni = ny * w + nx;
          if (m[ni] && !vus[ni]) { vus[ni] = 1; file[queue++] = ni; }
        }
      }
      comps.push({ pixels: file.slice(0, queue), n: queue, dansZone: dansZone });
      if (dansZone) touche = true;
    }
    for (var c = 0; c < comps.length; c++) {
      var garde = touche ? comps[c].dansZone : (comps[c].n >= mini);
      if (!garde) continue;
      for (var g = 0; g < comps[c].n; g++) { out[comps[c].pixels[g]] = 1; taille++; }
    }
    return { masque: out, taille: taille };
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
    // Un masque fourni de l'exterieur remplace la segmentation maison, il ne la corrige
    // pas : melanger les deux reviendrait a redonner au decor le droit d'entrer.
    if (options.masqueExterne) return segmentDepuisMasqueExterne(imageData, faceBoxOuLandmarks, options);
    var p = options.prep || preparerImage(imageData, options.largeurTravail);
    var geo = normaliserGeometrie(faceBoxOuLandmarks);

    if (!geo) {
      // Pas de visage : on cherche la chevelure POUR ELLE-MEME (dessus du crane, nuque,
      // profil serre, raie de pres). Le visage ne sert plus que d'echelle quand il est la.
      if (options.sansVisage === false) {
        return { ok: false, raison: 'aucune_geometrie_visage', masque: null, prep: p,
                 note: 'aucune boite visage fournie et la segmentation par texture a ete desactivee.' };
      }
      return segmenterMasseCheveux(imageData, { prep: p, largeurTravail: options.largeurTravail });
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
    var refPeau = apprendrePeauDuVisage(p, fx, fy, fw, fh);

    // Carte de peau calculee UNE fois (la croissance de region visite chaque pixel
    // plusieurs fois : recalculer la distance a chaque visite coutait 380 ms).
    // --- 2. croissance de région
    //
    // ZONE VISAGE + BARBE, EXCLUE SANS CONDITION.
    // Retour de terrain : sur un homme barbu en webcam, le masque prenait le front, les
    // joues, le nez, la moustache et la barbe. La texture d'une barbe EST celle d'un
    // cheveu : aucun critere de texture ne peut les separer. Seule la geometrie le peut.
    // Regle : tout ce qui est SOUS LA LIGNE DES YEUX et dans l'ovale du visage est
    // exclu. L'ovale est elargi (0,54 de largeur de visage) et descendu sous le menton
    // (0,62 de hauteur, centre a 0,58) pour attraper la barbe qui deborde de la boite.
    // Au-dessus de la ligne des yeux, rien n'est exclu : c'est la que sont les cheveux.
    var filtresVisage = options.filtresVisage !== false;
    var ligneYeux;
    if (geo.landmarks && geo.landmarks.length >= 48) {
      var syy = 0;
      for (var ly = 36; ly <= 47; ly++) syy += geo.landmarks[ly].y;
      ligneYeux = (syy / 12) * s;
    } else if (typeof options.ligneYeux === 'number') {
      ligneYeux = options.ligneYeux * s;
    } else {
      ligneYeux = fy + fh * 0.40;
    }
    var vcx = fx + fw / 2, vcy = fy + fh * 0.58;
    var vrx = fw * 0.54, vry = fh * 0.62;
    function dansVisageOuBarbe(x, y) {
      if (!filtresVisage) return false;
      if (y < ligneYeux) return false;
      var u = (x - vcx) / vrx, v = (y - vcy) / vry;
      return u * u + v * v <= 1;
    }

    // ────────────────────────────────────────────────────────────────────
    // CARTE DE PEAU — trois conditions, jamais la couleur seule.
    //
    // Defaut trouve en production (tete a cheveux chatains) : le masque refusait de se
    // former, partPeauGraine a 100 %. Deux causes, mesurees :
    //   - le domaine Lab generique de la peau contient le chatain (Delta E 37 de la peau
    //     mais L*, a*, b* tous dans les bornes), le blond fonce et le roux ;
    //   - quand la peau ne pouvait pas etre apprise, on retombait sur le test YCbCr, qui
    //     classe lui aussi le chatain comme peau — le bug deja corrige en v1, revenu par
    //     la porte de derriere.
    //
    // Regle desormais : un pixel n'est PEAU que si les TROIS conditions sont vraies.
    //   1. COULEUR : proche de la peau DE CETTE PERSONNE (Delta E76 < seuil appris).
    //      Aucun domaine de peau theorique n'intervient dans l'exclusion.
    //   2. TEXTURE : lisse, c'est-a-dire gradient sous 2,5 fois celui de sa propre peau.
    //      Un cheveu a une energie de gradient elevee, la peau non. C'est la condition
    //      qui sauve les chatains, les blonds fonces et les roux.
    //   3. GEOMETRIE : sous la ligne des yeux. Au-dessus, on est dans la chevelure :
    //      aucun pixel n'y est jamais exclu comme peau.
    // Si la peau n'a pas pu etre apprise sur la personne, AUCUNE exclusion par la
    // couleur n'est faite : seule la geometrie joue.
    // ────────────────────────────────────────────────────────────────────
    var peauLocale = cartePeauLocale(p, refPeau, filtresVisage, ligneYeux, options.peauAncienne);
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
    var graineSeparee = null;
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

    // ────────────────────────────────────────────────────────────────────
    // LE MODELE APPRIS EST-IL SEPARABLE DU FOND ?
    // Meme apres la separation, il arrive qu'on n'ait appris QUE le decor (mur
    // de la meme couleur que les cheveux, ou chevelure entierement hors cadre).
    // On ne publie alors pas un masque : une mesure prise sur un mur est pire
    // qu'une absence de mesure.
    // ────────────────────────────────────────────────────────────────────
    var dFondModele = Infinity;
    for (var zf = 0; zf < fonds.length; zf++) {
      var dLf = (mL - fonds[zf].L) * SEG.POIDS_L, daf = ma - fonds[zf].a, dbf = mb - fonds[zf].b;
      var ddf = Math.sqrt(dLf * dLf + daf * daf + dbf * dbf);
      if (ddf < dFondModele) dFondModele = ddf;
    }
    // ────────────────────────────────────────────────────────────────────
    // UN MUR, UN RIDEAU OU UNE VITRE NE SONT PAS UNE CHEVELURE.
    //
    // Mesure du 20/09 sur quatre captures de la webcam de Charles : le modele
    // appris sortait a L* 71,6 / 75,2 / 86,1 avec une CHROMA de 1,4 a 2,2 — du
    // gris parfaitement neutre. Le masque couvrait le rideau derriere lui et le
    // moteur annoncait 93 a 100 % de confiance. Sur la meme serie, la seule pose
    // ou le masque tombait vraiment sur les cheveux donnait L* 24,2, chroma 13,7.
    //
    // Une chevelure garde toujours un reste de couleur : le brun tire sur le
    // jaune-rouge, le blond aussi, et meme un poivre et sel n'est pas neutre a
    // ce point. Un gris de chroma < 4 a cette clarte est une surface peinte ou
    // tissee. On exige les TROIS conditions pour ne pas ecarter de vrais cheveux
    // blancs devant un fond sombre : neutre, clair, ET de la couleur du decor.
    // ────────────────────────────────────────────────────────────────────
    var chromaModele = Math.sqrt(ma * ma + mb * mb);
    if (fonds.length && chromaModele < 4 && mL > 55 && dFondModele < 20) {
      return { ok: false, raison: 'fond_pris_pour_des_cheveux', masque: null, prep: p, geo: geo,
               modeleRejete: { L: Math.round(mL * 10) / 10, chroma: Math.round(chromaModele * 10) / 10,
                               dFond: Math.round(dFondModele) },
               note: 'la zone au-dessus du front est un gris neutre a la couleur du decor (L* ' +
                     Math.round(mL) + ', chroma ' + Math.round(chromaModele) + ') : c\'est le mur ou ' +
                     'le rideau, pas une chevelure. Se placer devant un fond plus sombre que les cheveux, ' +
                     'ou eclairer la tete davantage que l arriere-plan.' };
    }

    if (fonds.length && dFondModele < 9) {
      return { ok: false, raison: 'chevelure_et_fond_identiques', masque: null, prep: p, geo: geo,
               dFondModele: Math.round(dFondModele), graineSeparee: graineSeparee,
               note: 'la couleur apprise au-dessus du front est celle du decor (distance ' +
                     Math.round(dFondModele) + ' seulement) : impossible de separer la chevelure du fond. ' +
                     'Changer de fond, ou eclairer la tete plus que le mur.' };
    }
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
        if (dansVisageOuBarbe(xg, yg)) continue;
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
        if (dansVisageOuBarbe(nx, ny)) continue;          // visage, moustache, barbe
        var ddx = (nx - cx) / rx, ddy = (ny - cy) / ry;
        if (ddx * ddx + ddy * ddy < 1) continue;          // intérieur du visage
        if (p.L[ni] > 98) continue;
        if (filtresVisage && p.grad[ni] < 0.18 * (gradGraine || 1)) continue;   // zone floue / uniforme
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
          if (!(ddx2 * ddx2 + ddy2 * ddy2 < 1) && !estPeauIci(idx) && !dansVisageOuBarbe(x2, y2)) m2[idx] = 1;
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
    if (filtresVisage && nFinal < 0.25 * total && couverture < 0.05) {
      return { ok: false, raison: 'chevelure_indissociable_du_visage', masque: null, prep: p, geo: geo,
               couverture: couverture,
               note: 'apres exclusion de la peau, de la barbe et du fond, il ne reste presque rien : la chevelure n est pas separable sur cette image. Mieux vaut ne rien afficher.' };
    }
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
      zoneVisage: { ligneYeux: ligneYeux, cx: vcx, cy: vcy, rx: vrx, ry: vry, active: filtresVisage },
      graine: { x0: gx0, x1: gx1, y0: gy0, y1: gy1, partPeau: partPeauGraine,
                partFond: partFondGraine, pixels: grainesUtiles },
      origine: 'visage',
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
   *      court (1 à 18 % de la largeur de tête) de pixels de TEINTE PEAU (YCbCr, Hsu 2002)
   *      ET LISSES (le cuir chevelu n'a pas de fils), ENCADRÉ de cheveux des deux côtés.
   *      Le segment peut se trouver à l'intérieur du masque : quand la raie est entourée
   *      de cheveux, la croissance de région l'avale.
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

    // Sans visage (dessus du crane, raie de pres), la raie n'est pas forcement dans le
    // haut du cadre : on balaie toute la masse. Mesure : avec la fenetre limitee au haut,
    // la raie n'etait trouvee sur AUCUNE des 27 chevelures sans visage annotees.
    var sansVisage = !(ctx.seg.geo && ctx.seg.geo.box);
    var yFin = sansVisage ? bb.y1 - 2 : bb.y0 + Math.round(0.45 * bh);
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
        // Le cuir chevelu peut se trouver DANS le masque (la croissance de region
        // l'avale quand il est entoure de cheveux). On l'accepte donc a l'interieur du
        // masque a condition qu'il soit lisse : le cuir chevelu n'a pas de fils.
        var lisse = ctx.p.grad[i] < 0.45 * ctx.g50;
        var estCuir = peauIci(ctx, i) && (!ctx.m[i] || lisse);
        if (estCuir) { if (run < 0) run = x; }
        else {
          if (run >= 0) {
            var lon = x - run;
            if (lon >= 1 && lon <= largeurMax) {
              // encadrement par des cheveux : on cherche du masque NON lisse de part
              // et d'autre, a quelques pixels
              var gauche = 0, droite = 0;
              for (var dg = 1; dg <= 4; dg++) {
                var ig2 = y * w + (run - dg);
                if (run - dg >= 0 && ctx.m[ig2] && ctx.p.grad[ig2] >= 0.45 * ctx.g50) { gauche = 1; break; }
              }
              for (var dd2 = 0; dd2 < 4; dd2++) {
                var id2 = y * w + (x + dd2);
                if (x + dd2 < w && ctx.m[id2] && ctx.p.grad[id2] >= 0.45 * ctx.g50) { droite = 1; break; }
              }
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
      for (var d = 1; d <= 6; d++) {
        var xg = cd.x0 - d, xd = cd.x1 + d;
        if (xg >= 0 && ctx.m[cd.y * w + xg] && ctx.p.grad[cd.y * w + xg] >= 0.45 * ctx.g50) Lcheveu.push(ctx.p.L[cd.y * w + xg]);
        if (xd < w && ctx.m[cd.y * w + xd] && ctx.p.grad[cd.y * w + xd] >= 0.45 * ctx.g50) Lcheveu.push(ctx.p.L[cd.y * w + xd]);
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
    // Sans visage, il n'y a pas de largeur de visage a rapporter : le cadrage se juge
    // alors sur la place que prend la masse de cheveux dans l'image.
    var sansVisage = (cadrage === null || cadrage === undefined);
    var nCadrage = sansVisage
      ? clamp(0, 1, ctx.seg.couverture / 0.18)
      : clamp(0, 1, cadrage / QUALITE.CADRAGE_CIBLE);

    var score = Math.round(100 * (0.28 * nNettete + 0.20 * nExpo + 0.32 * nMasque + 0.20 * nCadrage));
    var raisons = [];
    if (!sansVisage && cadrage < QUALITE.CADRAGE_MIN) raisons.push('tete trop petite dans le cadre (' + Math.round(cadrage * 100) + ' % de la largeur)');
    if (sansVisage && ctx.seg.couverture < 0.05) raisons.push('la chevelure occupe moins de 5 % de l image');
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
      exploitable: score >= QUALITE.SCORE_REFUS &&
                   (sansVisage ? ctx.seg.couverture >= 0.03 : cadrage >= QUALITE.CADRAGE_REFUS) &&
                   ctx.seg.confiance >= 0.30,
      origineMasque: ctx.seg.origine || 'visage',
      cadrage: sansVisage ? null : Math.round(cadrage * 1000) / 1000,
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
  // 9. QUESTIONNAIRE — 3 questions, posées AVANT le scan
  //    Il pondère, il ne remplace jamais une mesure. Chaque score publie sa
  //    part mesurée et sa part déclarée, et vaut null quand rien ne l'informe.
  // ════════════════════════════════════════════════════════════════════════

  /**
   * QUESTIONNAIRE — TROIS questions, posées AVANT le scan (19/09/2026 : réduit de 5 à 3,
   * le parcours était trop long). Elles pondèrent, elles ne remplacent jamais une mesure.
   *
   * La fréquence de lavage et l'âge NE SONT PLUS DEMANDÉS. Le moteur accepte encore ces
   * deux champs si un appelant les fournit, mais il ne suppose jamais leur présence et
   * n'invente aucune valeur par défaut à leur place : quand l'information manque, le
   * score concerné vaut null avec sa raison, il ne prend pas une valeur moyenne.
   */
  var QUESTIONS = [
    { id: 'type_ressenti', libelle: 'Vos cheveux sont plutot', requise: true,
      options: [
        { v: 'raides', l: 'Raides' }, { v: 'ondules', l: 'Ondules' },
        { v: 'boucles', l: 'Boucles' }, { v: 'crepus', l: 'Crepus' }
      ] },
    { id: 'probleme', libelle: 'Ce qui vous gene le plus', requise: true,
      options: [
        { v: 'chute', l: 'Ils tombent' }, { v: 'pellicules', l: 'Pellicules' },
        { v: 'secheresse', l: 'Secs' }, { v: 'gras', l: 'Gras vite' },
        { v: 'casse', l: 'Ils cassent' }, { v: 'plats', l: 'Plats, sans volume' }
      ] },
    { id: 'etat', libelle: 'Aujourd hui ils sont', requise: true,
      options: [
        { v: 'naturels', l: 'Naturels' }, { v: 'colores', l: 'Colores' },
        { v: 'decolores', l: 'Decolores ou meches' }, { v: 'defrises', l: 'Defrises ou permanentes' }
      ] }
  ];

  /**
   * Anciennes questions, retirées du parcours. Conservées pour deux raisons : un appelant
   * qui les possède déjà (formulaire institut, fiche client) peut les passer et le moteur
   * les utilisera ; et la liste documente ce que le moteur ne sait PLUS depuis qu'on ne
   * les pose plus (voir § scores non lisibles).
   */
  var QUESTIONS_FACULTATIVES = [
    // 26/09 — la page /cheveux repose cette question, en TROIS choix : tous les jours,
    // tous les 2-3 jours, moins souvent. Les quatre anciennes valeurs restent acceptees.
    // Avant, « une fois par semaine » et « plus rarement » donnaient la meme routine :
    // voir besoins.rythme dans composerRoutine, qui distingue maintenant les trois.
    { id: 'lavage', libelle: 'Vous les lavez', requise: false,
      options: [
        { v: 'quotidien', l: 'Tous les jours' }, { v: 'deux_trois_jours', l: 'Tous les 2-3 jours' },
        { v: 'moins_souvent', l: 'Moins souvent' }
      ],
      anciennes: ['tous_deux_jours', 'hebdo', 'rare'] },
    { id: 'age', libelle: 'Votre age', requise: false,
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
      // On dit les DEUX causes : la mesure n'a rien donne ET le questionnaire non plus.
      var causes = [];
      causes.push('mesure : ' + ((mes && mes.raison) ? mes.raison : 'absente'));
      causes.push('questionnaire : aucune reponse n informe ce point');
      return { libelle: libelle, valeur: null,
               raison: (mes && mes.raison) ? mes.raison : 'ni mesure ni reponse',
               pourquoiNull: causes,
               partMesuree: 0, partDeclaree: 0, fiabilite: 'nulle',
               note: 'score non lisible : ni la photo ni les trois questions ne permettent de se prononcer' };
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

  /**
   * Traductions réponse -> valeur 0..1. Aucune n'est une mesure, toutes sont déclarées.
   *
   * RÈGLE : on ne retient QUE les signaux effectivement présents dans les réponses, et on
   * garde le plus fort d'entre eux. S'il n'y en a aucun, on renvoie null — jamais une
   * valeur moyenne de remplissage. La version à 5 questions renvoyait par exemple 0,45 de
   * sécheresse à quiconque avait répondu quelque chose, même sans rapport : c'était un
   * chiffre inventé, il a été retiré.
   */
  function declare(rep, cle) {
    if (!rep) return null;
    var p = rep.probleme, e = rep.etat, l = rep.lavage, t = rep.type_ressenti, a = rep.age;
    var signaux = [];
    function sig(v) { if (v !== null && v !== undefined) signaux.push(v); }

    switch (cle) {
      case 'secheresse':
        if (p === 'secheresse') sig(0.85);
        if (p === 'gras') sig(0.25);
        if (e === 'decolores') sig(0.72);
        if (e === 'defrises') sig(0.60);
        if (e === 'colores') sig(0.60);
        break;
      case 'casse':
        if (p === 'casse') sig(0.85);
        if (e === 'decolores') sig(0.70);
        if (e === 'defrises') sig(0.65);
        if (e === 'colores') sig(0.50);
        break;
      case 'gras':
        // 'lavage' n'est plus demandé : sans lui, seule la gêne principale informe.
        if (l === 'quotidien') sig(0.85);
        else if (l === 'tous_deux_jours') sig(0.60);
        else if (l === 'deux_trois_jours') sig(0.50);
        else if (l === 'hebdo' || l === 'moins_souvent') sig(0.30);
        else if (l === 'rare') sig(0.15);
        if (p === 'gras') sig(0.80);
        break;
      case 'frizz':
        if (t === 'crepus') sig(0.75);
        else if (t === 'boucles') sig(0.60);
        else if (t === 'ondules') sig(0.40);
        else if (t === 'raides') sig(0.20);
        break;
      case 'boucle':
        if (t === 'crepus') sig(0.90);
        else if (t === 'boucles') sig(0.65);
        else if (t === 'ondules') sig(0.45);
        else if (t === 'raides') sig(0.15);
        break;
      case 'blancs':
        // 'age' n'est plus demandé : sans lui, rien n'informe sur les cheveux blancs,
        // et la mesure n'est pas validée. Le score reste donc non lisible.
        if (a === '55+') sig(0.55);
        else if (a === '40-54') sig(0.30);
        else if (a === '25-39') sig(0.08);
        else if (a === '-25') sig(0.02);
        break;
      case 'densite':
        if (p === 'chute') sig(0.25);
        if (p === 'plats') sig(0.35);
        break;
      default: return null;
    }
    if (!signaux.length) return null;
    var m = signaux[0];
    for (var i = 1; i < signaux.length; i++) if (signaux[i] > m) m = signaux[i];
    return m;
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
      'Racines grasses', 'gradient de brillance racines/longueurs (mesure indicative)', 'gene principale declaree');

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
      'Cheveux blancs', 'pixels chroma basse dispersés (mesure fragile)', 'age declare si fourni');

    var mDensite = m('densiteRaie');
    s.densite = combiner(mDensite, declare(reponses, 'densite'), 0.5,
      'Densite apparente', 'contraste a la raie (mesure, souvent indisponible)', 'gene declaree');

    // 100 % déclarés — assumés comme tels
    // 100 % déclarés — et null quand rien ne les déclare.
    // La question ne demande QUE la gêne principale : ne pas l'avoir choisie ne veut pas
    // dire qu'on n'a pas de pellicules. Mettre 10 comme avant, c'était affirmer une
    // absence qu'on n'a jamais constatée.
    s.pellicules = (reponses && reponses.probleme === 'pellicules')
      ? { libelle: 'Pellicules', valeur: 80, partMesuree: 0, partDeclaree: 1, fiabilite: 'declaree',
          note: 'les pellicules ne sont pas mesurables sur une photo de chevelure : score entierement declare' }
      : { libelle: 'Pellicules', valeur: null, partMesuree: 0, partDeclaree: 0, fiabilite: 'nulle',
          raison: 'non_declaree_comme_gene_principale',
          note: 'non mesurable sur une photo, et non signalee comme gene principale : le moteur ne se prononce pas' };
    s.chute = (reponses && reponses.probleme === 'chute')
      ? { libelle: 'Chute', valeur: 80, partMesuree: 0, partDeclaree: 1, fiabilite: 'declaree',
          note: 'la chute se constate dans le temps, pas sur une image : score entierement declare' }
      : { libelle: 'Chute', valeur: null, partMesuree: 0, partDeclaree: 0, fiabilite: 'nulle',
          raison: 'non_declaree_comme_gene_principale',
          note: 'la chute se constate dans le temps, pas sur une image, et elle n a pas ete signalee' };

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
    // Le catalogue a ete relu a la main : son champ `etape` FAIT FOI. On ne recalcule
    // que s'il est absent. La version precedente faisait l'inverse (categorie puis nom)
    // et se trompait sur trois cas verifies : un « Bain Creme » Kerastase, qui est un
    // shampooing, partait en traitement cible, et deux demelants « Pre-Shampoo » ranges
    // en soin partaient en lavage parce que leur nom contient « shampoo ».
    if (prod.etape === 1 || prod.etape === 2 || prod.etape === 3 || prod.etape === 4) {
      return prod.etape;
    }
    var c = (prod.categorie || '').toLowerCase();
    if (c === 'shampooing') return 1;
    if (c === 'apres-shampooing' || c === 'masque' || c === 'coloration-soin') return 2;
    if (c.indexOf('soin-sans-rin') === 0 || c === 'huile' || c === 'protection-thermique') return 3;
    if (c === 'serum-cuir-chevelu' || c === 'traitement-chute' || c === 'proteine-reconstruction') return 4;
    if (c === 'anti-pellicules') {
      var na = (prod.name || '').toLowerCase();
      return (na.indexOf('shampo') !== -1 || na.indexOf('bain') === 0) ? 1 : 4;
    }
    // Ni etape ni categorie exploitable : le nom, en dernier recours seulement.
    var nom = String(prod.name || '').toLowerCase();
    if (/\b(masque|mask)\b/.test(nom)) return 2;
    if (/(apr[e\u00e8]s-?shampo|conditioner|d[e\u00e9]m[e\u00ea]lant)/.test(nom)) return 2;
    if (/(shampo|shampoo|cleanser|wash)\b/.test(nom)) return 1;
    return null;
  }

  // Formes galeniques : quand l'un de ces mots suit « set », on est devant un PRODUIT
  // (« SWIFT SET LOTION », « SHAPE SET HAIRSPRAY ») et non devant un coffret.
  var FORMES_GALENIQUES = 'lotion|spray|hairspray|cream|creme|cr\u00e8me|mousse|gel|foam|balm|baume|oil|huile|serum|s\u00e9rum|milk|lait|butter|beurre|masque|mask|wax|cire|paste|pate|p\u00e2te|fluide|fluid|powder|poudre|shampoo|shampooing';

  var HORS_ROUTINE = [
    // « set » seul, ou suivi d'autre chose qu'une forme galenique = coffret.
    // Mesure sur le catalogue relu : la regle brute ecartait SWIFT SET LOTION et
    // SHAPE SET HAIRSPRAY, qui sont de vrais produits.
    { re: new RegExp('\\bset\\b', 'i'),
      // La forme galenique peut se trouver n'importe ou dans le nom : « SHAPE SET(tm)
      // HAIRSPRAY GRAND FORMAT » a son mot-cle a trois mots de « set ».
      sauf: new RegExp('\\b(?:' + FORMES_GALENIQUES + ')\\b', 'i'),
      raison: 'coffret ou lot : une routine propose des produits a l unite' },
    { re: /\b(kit|duo|trio|bundle|coffret|pack|collection)\b/i,
      raison: 'coffret ou lot : une routine propose des produits a l unite' },
    // « free » a ete RETIRE de ce motif : il ecartait 20 vrais produits (Sulfate Free,
    // Paraben Free, Fragrance Free, Frizz Free, Free Styler...). Seules restent les
    // formules explicitement promotionnelles.
    { re: /(^|\s)(gratuit|offert|offerte|cadeau)(\s|$)/i,
      raison: 'entree promotionnelle, pas un produit' },
    { re: /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/u,
      raison: 'nom contenant un pictogramme : interdit a l ecran' },
    { re: /\u00c3[\u0080-\u00bf]/,
      raison: 'nom a l encodage casse (mojibake) : illisible a l ecran' }
  ];

  // « body », « shower », « corps », « douche » : ces mots NE SUFFISENT PAS a ecarter un
  // produit. BODY.BUILDER est un soin volume pour cheveux, « Volume + Body » aussi, et un
  // « Hair & Body Wash » lave bien les cheveux. On n'ecarte que si la categorie n'est pas
  // une categorie capillaire, ou si la description parle explicitement de soin du corps.
  // (Mesure : 29 produits du catalogue relu portent un de ces mots, tous capillaires.)
  // Mots qui EVOQUENT un autre soin que le cheveu. Aucun d'eux n'ecarte un produit a
  // lui seul : il faut en plus que la categorie ne soit pas capillaire ET que le nom ne
  // parle pas de cheveux. Mesure sur le catalogue relu : la regle brute ecartait des
  // apres-shampooings « sans parfum », une huile parfumante capillaire, une creme
  // « mains et cheveux » et trois lavants « cheveux et corps ».
  var MOT_HORS_CHEVEU = /\b(body|shower|corps|douche|l[eè]vres?|lips?|visage|face cream|mains|hands|parfum|perfume|bougie|candle|d[eé]odorant|deodorant|savon)\b/i;
  // Un nom qui parle de cheveux reste un produit capillaire, meme s'il fait aussi autre chose.
  var MOT_CHEVEU = /(cheveu|cheveux|capillaire|hair|shampo|conditioner|boucl|curl|scalp|cuir chevelu|m[eè]che)/i;
  // « sans parfum » n'est pas un parfum.
  var SANS_PARFUM = /(sans|without|free of|no)\s+(parfum|perfume|fragrance)/i;
  var CATEGORIES_CAPILLAIRES = ['shampooing', 'apres-shampooing', 'masque', 'soin-sans-rin\u00e7age',
    'soin-sans-rincage', 'huile', 'serum-cuir-chevelu', 'traitement-chute', 'coloration-soin',
    'proteine-reconstruction', 'anti-pellicules', 'protection-thermique', 'autre-cheveux'];
  var DESCRIPTION_CORPS = /(soin du corps|body lotion|body cream|cr[e\u00e8]me pour le corps|gel douche|shower gel|pour le corps)/i;

  /** Renvoie null si le produit est utilisable, sinon la raison de l'ecart. */
  function raisonEcart(prod) {
    var n = String(prod.name || '');
    if (!n) return 'produit sans nom';
    for (var i = 0; i < HORS_ROUTINE.length; i++) {
      if (!HORS_ROUTINE[i].re.test(n)) continue;
      // « sauf » : le motif est annule quand le nom designe clairement une forme galenique.
      if (HORS_ROUTINE[i].sauf && HORS_ROUTINE[i].sauf.test(n)) continue;
      return HORS_ROUTINE[i].raison;
    }
    if (MOT_HORS_CHEVEU.test(n) && !SANS_PARFUM.test(n)) {
      var cat = String(prod.categorie || '').toLowerCase();
      var estCapillaire = CATEGORIES_CAPILLAIRES.indexOf(cat) !== -1;
      // Trois garde-fous avant d'ecarter : categorie non capillaire, ET nom qui ne parle
      // pas de cheveux, ET description qui parle explicitement de soin du corps.
      if (!estCapillaire && !MOT_CHEVEU.test(n)) {
        return 'produit qui n est pas un soin capillaire';
      }
      if (!MOT_CHEVEU.test(n) && DESCRIPTION_CORPS.test(String(prod.description || ''))) {
        return 'produit de soin du corps, pas de soin capillaire';
      }
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
    blancs: ['blanc', 'gris', 'argent', 'violet', 'anti-jaune', 'jaunissement'],
    // 26/09 — shampooing fait pour un lavage frequent. « douce » est ecarte expres :
    // il attrape « douceur », qui parle du toucher du cheveu, pas du lavage.
    doux: ['doux', 'usage fréquent', 'usage frequent', 'quotidien', 'daily', 'gentle', 'micellaire', 'everyday', 'sans-sulfate']
  };

  /**
   * FAMILLE DE MAISONS ET PAYS D'ORIGINE (26/09/2026)
   * Les fiches marques (catalogue-cheveux/marques.json) portent univers et code_pays.
   * 'EU' = pays europeens hors France, la meme liste que l'ecran peau.
   */
  var EUROPE_HORS_FR = { DE: 1, CH: 1, SE: 1, BE: 1, NL: 1, ES: 1, IT: 1, AT: 1, DK: 1, PT: 1, MC: 1, HU: 1, IE: 1, PL: 1 };
  var UNIVERS_CONNUS = ['luxe', 'salon', 'pharmacie', 'normal', 'petit-prix'];
  var PAYS_NOM_ISO = { 'états-unis': 'US', 'etats-unis': 'US', 'france': 'FR', 'royaume-uni': 'GB', 'australie': 'AU',
    'allemagne': 'DE', 'italie': 'IT', 'suède': 'SE', 'suede': 'SE', 'danemark': 'DK', 'canada': 'CA', 'israël': 'IL',
    'israel': 'IL', 'nouvelle-zélande': 'NZ', 'nouvelle-zelande': 'NZ', 'pays-bas': 'NL', 'suisse': 'CH', 'espagne': 'ES',
    'belgique': 'BE', 'japon': 'JP', 'corée du sud': 'KR', 'coree du sud': 'KR' };

  function indexFichesMarques(fiches) {
    var idx = {};
    if (!fiches) return idx;
    var liste = Array.isArray(fiches) ? fiches : (fiches.marques || null);
    if (liste && !Array.isArray(liste)) {           // format { slug: fiche }
      for (var k in liste) if (Object.prototype.hasOwnProperty.call(liste, k)) idx[k.toLowerCase()] = liste[k];
      return idx;
    }
    if (!liste) {
      for (var k2 in fiches) if (Object.prototype.hasOwnProperty.call(fiches, k2)) idx[k2.toLowerCase()] = fiches[k2];
      return idx;
    }
    for (var i = 0; i < liste.length; i++) if (liste[i] && liste[i].slug) idx[String(liste[i].slug).toLowerCase()] = liste[i];
    return idx;
  }
  function codePaysFiche(f) {
    if (!f) return null;
    if (f.code_pays) return String(f.code_pays).toUpperCase();
    var p = String(f.pays || '').trim();
    if (/^[A-Za-z]{2}$/.test(p)) return p.toUpperCase();
    return PAYS_NOM_ISO[p.toLowerCase()] || null;
  }
  /** region d'un code pays : 'FR', 'EU' (Europe hors France) ou le code lui-meme */
  function regionPays(code) {
    if (!code) return null;
    code = String(code).toUpperCase();
    return EUROPE_HORS_FR[code] ? 'EU' : code;
  }

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

    // ---- famille de maisons et pays d'origine (26/09/2026)
    // options.univers : ['luxe', 'salon', 'pharmacie', 'normal', 'petit-prix'] (un ou plusieurs)
    // options.origine : codes pays ISO, ou 'EU' pour l'Europe hors France
    // options.fichesMarques : marques.json (ou { slug: fiche }) ; a defaut, le produit
    //   peut porter lui-meme univers et code_pays.
    // Ce ne sont PAS des besoins : ce sont des preferences. Si une etape n'a plus aucun
    // produit acceptable dans le perimetre, on relache d'abord le pays, puis la famille,
    // et chaque relachement est rendu dans relachements[] pour etre dit a l'ecran.
    function versListe(x) {
      if (x === null || x === undefined || x === '') return [];
      return (Array.isArray(x) ? x : [x]).filter(function (v) { return v !== null && v !== undefined && v !== ''; });
    }
    var prefUnivers = versListe(options.univers).map(function (u) { return String(u).toLowerCase(); });
    var prefOrigine = versListe(options.origine).map(function (o) { return String(o).toUpperCase(); });
    var fichesIdx = indexFichesMarques(options.fichesMarques);
    function ficheDe(p) { return fichesIdx[String(p.brand || '').toLowerCase()] || null; }
    function universDe(p) { var f = ficheDe(p); return String(p.univers || (f && f.univers) || '').toLowerCase() || null; }
    function paysDe(p) { return p.code_pays ? String(p.code_pays).toUpperCase() : codePaysFiche(ficheDe(p)); }
    function dansUnivers(p) { return !prefUnivers.length || prefUnivers.indexOf(universDe(p)) !== -1; }
    function dansOrigine(p) {
      if (!prefOrigine.length) return true;
      var c = paysDe(p);
      return !!c && (prefOrigine.indexOf(c) !== -1 || prefOrigine.indexOf(regionPays(c)) !== -1);
    }
    var prefsActives = !marque && (prefUnivers.length > 0 || prefOrigine.length > 0);
    // 0 = famille et pays respectes ; 1 = famille respectee, pays elargi ; 2 = tout elargi
    function niveauPref(p) {
      if (!prefsActives) return 0;
      var u = dansUnivers(p), o = dansOrigine(p);
      return (u && o) ? 0 : (u ? 1 : 2);
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
      plats: reponses && reponses.probleme === 'plats' ? 1 : 0,
      // 26/09 — le rythme de lavage pese enfin sur la routine elle-meme, en trois
      // niveaux. Avant, seul le signal « racines grasses » en dependait, et seul
      // « tous les jours » depassait un seuil : les autres choix ne changeaient rien.
      rythme: !reponses || !reponses.lavage ? null
        : (reponses.lavage === 'quotidien' ? 'frequent'
          : (reponses.lavage === 'tous_deux_jours' || reponses.lavage === 'deux_trois_jours') ? 'moyen'
          : (reponses.lavage === 'hebdo' || reponses.lavage === 'rare' || reponses.lavage === 'moins_souvent') ? 'espace'
          : null)
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
        if (besoins.rythme === 'frequent') plus(compte(t, MOTS.doux) * 0.8, 'lavage quotidien : shampooing doux, fait pour un usage frequent');
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
        // lavages espaces : chaque shampooing est l'occasion d'un vrai masque
        if (besoins.rythme === 'espace' && String(prod.categorie || '').toLowerCase() === 'masque' &&
            !(gras !== null && gras > 0.7) && !besoins.plats) {
          plus(0.6, 'lavages espaces : un masque a chaque shampooing');
        }
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
        // lavages espaces : le sans-rincage porte le cheveu d'un shampooing a l'autre
        if (besoins.rythme === 'espace' && !(gras !== null && gras > 0.7) && !besoins.plats) {
          plus(compte(t, MOTS.nourrissant) * 0.5, 'lavages espaces : nourrit entre deux shampooings');
        }
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
      parEtape[e].push({ produit: prod, etape: e, note: note.score, pourquoi: note.pourquoi, interdits: note.interdits,
                         niveau: niveauPref(prod) });
    }
    for (var e2 = 1; e2 <= 4; e2++) {
      // 20/09 — a pertinence egale, on prefere un produit dont on a une VRAIE
      // photo. Sur 4 446 fiches, 38 n'ont aucune image (le collecteur avait pris
      // le logo du site) et 16 partagent une photo avec un autre produit : une
      // carte de routine sans image, ou avec la photo du voisin, decredibilise
      // toute la lecture. Le depart ne se fait qu'a note tres proche : jamais au
      // prix d'une recommandation moins juste.
      parEtape[e2].sort(function (a, b) {
        var d = b.note - a.note;
        if (Math.abs(d) > 0.05) return d;
        function rang(x) {
          var pr = x.produit;
          if (!pr.cutout_url && !pr.image_local && !pr.image_url) return 2;  // aucune image
          if (pr.image_incertaine) return 1;                                 // photo partagee
          return 0;
        }
        return rang(a) - rang(b) || d;
      });
    }

    // Choix étape par étape, en commençant par celle qui a le moins de candidats
    // acceptables, pour que la contrainte de marque unique ne bloque pas une étape rare.
    // Avec des preferences, on compte les candidats DANS le perimetre choisi.
    function dansPerimetre(et, niv) {
      return parEtape[et].filter(function (x) { return x.niveau <= niv; });
    }
    var ordre = [1, 2, 3, 4].sort(function (a, b) { return dansPerimetre(a, 0).length - dansPerimetre(b, 0).length; });
    var marquesPrises = {}, choix = {}, manques = [], assouplissements = [], relachements = [];
    var NIVEAUX = prefsActives ? [0, 1, 2] : [2];
    if (prefsActives && !prefOrigine.length) NIVEAUX = [0, 2];   // rien a relacher cote pays

    for (var o = 0; o < ordre.length; o++) {
      var et = ordre[o], essai = null;
      for (var nv = 0; nv < NIVEAUX.length; nv++) {
        essai = choisirEtape(et, dansPerimetre(et, NIVEAUX[nv]));
        if (essai.pris) break;
      }
      assouplissements.push.apply(assouplissements, essai.assouplissements);
      if (!essai.pris) { manques.push(essai.manque); continue; }
      var pris = essai.pris;
      if (prefsActives && pris.niveau > 0) {
        var relache = [];
        if (!dansOrigine(pris.produit)) relache.push('pays');
        if (!dansUnivers(pris.produit)) relache.push('famille');
        relachements.push({
          etape: et, etapeLibelle: ETAPES[et].libelle, relache: relache,
          note: 'etape ' + et + ' (' + ETAPES[et].libelle + ') : aucun produit adapte ' +
            (relache.length === 2 ? 'dans la famille et le pays choisis' : relache[0] === 'pays' ? 'dans le pays choisi' : 'dans la famille choisie') +
            ', produit pris ' + (relache.length === 2 ? 'hors de ces deux preferences' : relache[0] === 'pays' ? 'dans un autre pays' : 'dans une autre famille de maisons')
        });
      }
      choix[et] = pris;
      var mq2 = (pris.produit.brand || pris.produit.brand_name || '').toLowerCase();
      if (mq2) marquesPrises[mq2] = true;
    }

    // Le choix d'UNE etape parmi des candidats deja tries. Rend { pris, assouplissements, manque }.
    function choisirEtape(et, cands) {
      var pris = null, asp = [];
      var meilleurToutes = cands.length ? cands[0] : null;
      var meilleurAutreMarque = null;
      for (var c = 0; c < cands.length; c++) {
        var cand = cands[c];
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
        asp.push('etape ' + et + ' : marque repetee (' +
          (meilleurToutes.produit.brand_name || meilleurToutes.produit.brand) +
          ') parce que le meilleur produit d une autre marque etait nettement moins adapte');
      } else {
        pris = meilleurAutreMarque;
      }
      if (!pris && cands.length) {
        pris = cands[0];
        asp.push('etape ' + et + ' : marque repetee, aucun autre produit disponible pour cette etape');
      }
      if (pris && pris.note <= 0) {
        // Tous les candidats de cette etape sont des contresens : on prefere une etape
        // vide a une recommandation absurde.
        return { pris: null, assouplissements: [], manque: 'etape ' + et + ' (' + ETAPES[et].libelle + ') : aucun produit sans contresens dans le catalogue fourni (meilleure note ' + Math.round(pris.note * 100) / 100 + ')' };
      }
      if (!pris) {
        return { pris: null, assouplissements: [], manque: 'etape ' + et + ' (' + ETAPES[et].libelle + ') : aucun produit de cette etape dans le catalogue fourni' };
      }
      return { pris: pris, assouplissements: asp, manque: null };
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
        // le detourage (fond transparent) quand il existe ; l'UI le prefere au packshot
        cutout_url: ch.produit.cutout_url || null,
        image_fond: ch.produit.image_fond === true,
        actifs: ch.produit.actifs || [],
        note: Math.round(ch.note * 100) / 100,
        pourquoi: ch.pourquoi,
        reserves: ch.interdits,
        // preferences non tenues pour CE produit ('pays', 'famille'), vide sinon
        horsPreferences: (prefsActives && ch.niveau > 0)
          ? [].concat(dansOrigine(ch.produit) ? [] : ['pays'], dansUnivers(ch.produit) ? [] : ['famille']) : []
      });
    }

    return {
      routine: routine,
      complete: routine.length === 4,
      manques: manques,
      assouplissements: assouplissements,
      preferences: { univers: prefUnivers, origine: prefOrigine, appliquees: prefsActives,
                     ignorees: (!!marque && (prefUnivers.length > 0 || prefOrigine.length > 0)) ? 'mode marque : le catalogue est deja celui d une seule maison' : null },
      relachements: relachements,
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
   *   reponses       : réponses au questionnaire { type_ressenti, probleme, etat }.
   *                    lavage et age ne sont plus demandés ; s'ils sont absents, les
   *                    scores qui en dépendaient valent null avec leur raison.
   *   faceBox        : { x, y, width, height } si l'appelant l'a déjà (coordonnées de l'image)
   *   landmarks      : 68 points face-api
   *   frames         : nombre de frames sur une video (defaut 3)
   *   intervalleMs   : espacement des frames (defaut 220)
   *   produits       : catalogue capillaire pour composer la routine (facultatif)
   *   marque         : mode marque, vyvre.fr/m/<marque>/cheveux
   *   largeurTravail : largeur de calcul (defaut 384)
   *   masqueExterne  : { data, largeur, hauteur, seuil } — masque de cheveux deja
   *                    calcule par l'appelant (hair_segmenter de MediaPipe cote
   *                    guidage). Fourni, il REMPLACE la segmentation maison : c'est
   *                    la seule facon d'empecher le decor d'entrer dans la mesure.
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
    // Pas de visage : ce n'est plus un refus. On cherche la chevelure pour elle-meme.
    // Les mesures qui ont besoin de l'echelle du visage restent en relatif et le disent.
    if (!geo) sourceGeo = 'aucune (segmentation par texture)';

    var frames = [], echecs = [];
    for (var f = 0; f < nFrames; f++) {
      var img = versImageData(videoOrImage, maxLargeur);
      if (!img) { echecs.push('capture_impossible'); break; }
      var r = analyseFrame(img, geo, { largeurTravail: options.largeurTravail, sansVisage: options.sansVisage,
                                        masqueExterne: options.masqueExterne || null });
      if (r.ok) frames.push(r); else echecs.push(r.raison);
      if (f < nFrames - 1 && estVideo(videoOrImage)) await attendre(intervalle);
    }

    if (!frames.length) {
      return {
        version: VERSION, mode: 'lecture-rapide', ok: false,
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
      version: VERSION, mode: 'lecture-rapide', ok: true,
      mesures: agr.mesures,
      scores: scores,
      qualite: derniere.qualite,
      raw: {
        framesAnalysees: frames.length, framesDemandees: nFrames, echecs: echecs,
        geometrie: sourceGeo,
        origineMasque: derniere.segmentation.origine || 'visage',
        echelleDuVisageDisponible: !!(derniere.segmentation.geo && derniere.segmentation.geo.ipdPx),
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
        { marque: options.marque || null, univers: options.univers || null, origine: options.origine || null,
          fichesMarques: options.fichesMarques || null });
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
      chevelure_indissociable_du_visage: 'La chevelure n est pas separable du visage sur cette image.',
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
  // 13. ICE v2 — LECTURE FIBRE (macro guidée sur une mèche)
  //
  //   Le constat de la v1 : à 40 cm, un cheveu ne fait pas un pixel, donc l'épaisseur,
  //   la cuticule, les fourches et la brillance ne sont pas mesurables — quoi qu'on
  //   fasse au traitement d'image. La v2 ne change pas les formules : elle change la
  //   PRISE DE VUE. À 5-10 cm d'une mèche tenue devant un fond sombre, torche allumée,
  //   un cheveu fait 15 à 40 pixels. Ce qui était impossible devient mesurable.
  //
  //   Ce mode ne remplace pas la photo de face : il s'ajoute. Le résultat dit toujours
  //   quel mode a servi (`mode`: 'lecture-rapide' ou 'lecture-fibre').
  // ════════════════════════════════════════════════════════════════════════

  /**
   * OPTIQUE — CE QU'UN TÉLÉPHONE LIT VRAIMENT (calculé, pas supposé)
   *
   * Champ = 2 · distance · tan(FOV/2), FOV donnée par l'équivalent 35 mm de l'objectif.
   * Sur un capteur de 4032 px de large :
   *
   *   capteur principal 24 mm eq. a 10 cm  -> champ 150 mm, 0,037 mm/px, cheveu 70 um = 1,9 px
   *   ultra grand-angle macro 13 mm a 3 cm -> champ  83 mm, 0,021 mm/px, cheveu 70 um = 3,4 px
   *   ultra grand-angle macro 13 mm a 2 cm -> champ  55 mm, 0,014 mm/px, cheveu 70 um = 5,1 px
   *   bonnette macro clipsee, champ 15 mm  -> champ  15 mm, 0,004 mm/px, cheveu 70 um = 19 px
   *
   * CONCLUSION, et elle change la promesse du mode : « 15 a 40 px par cheveu » demande un
   * champ de 19 mm, donc une BONNETTE MACRO. Un telephone nu en mode macro donne 3 a 5 px
   * par cheveu, soit une incertitude de 14 a 21 um sur un cheveu qui en fait 40 a 120.
   * Et a 19 mm de champ, ni la carte bancaire (85,6 mm) ni la piece de 2 euros (25,75 mm)
   * ne tiennent dans le cadre : l'echelle doit alors venir d'autre chose.
   *
   * Le moteur ne suppose rien de tout cela : il MESURE l'echelle quand une reference est
   * dans le cadre, en deduit l'incertitude (1 pixel) et refuse de publier toute valeur
   * dont l'incertitude depasse 30 % — quel que soit le materiel utilise.
   */
  var MACRO = {
    LARGEUR_TRAVAIL: 1100,    // on garde la résolution : c'est tout l'intérêt du mode
    NETTETE_MIN: 60,          // variance du laplacien sous laquelle rien n'est mesurable
    NETTETE_BONNE: 250,
    LARGEUR_FIL_MIN: 2.5,     // px — en dessous, aucune mesure de largeur n'a de sens
    LARGEUR_FIL_MAX: 90,      // px — au-dessus, ce n'est plus un cheveu isolé
    LARGEUR_FIL_CIBLE: [4, 60],
    COUVERTURE_MIN: 0.004,    // part de l'image occupée par des fils
    COUVERTURE_MAX: 0.60,
    INCERTITUDE_MAX_RELATIVE: 0.30,   // au-dela, on ne publie pas la valeur
    // Dimensions normalisées des références d'échelle
    CARTE_MM: 85.60, CARTE_RATIO: 85.60 / 53.98,   // ISO/IEC 7810 ID-1
    PIECE_2E_MM: 25.75,                             // 2 euros
    ONGLE_POUCE_MM: 15.0                            // ordre de grandeur seulement
  };

  /**
   * Seuil d'Otsu (1979) sur l'histogramme de L*. Sépare les fils éclairés du fond
   * sombre sans réglage manuel. Renvoie le seuil et la séparabilité (variance
   * inter-classes normalisée) : si elle est basse, il n'y a pas deux populations,
   * donc pas de mèche détachée du fond.
   */
  function seuilOtsu(valeurs, nbBacs) {
    nbBacs = nbBacs || 64;
    var hist = new Float64Array(nbBacs), n = valeurs.length, i;
    for (i = 0; i < n; i++) hist[clamp(0, nbBacs - 1, Math.floor(valeurs[i] / 100 * nbBacs))]++;
    var somme = 0;
    for (i = 0; i < nbBacs; i++) somme += i * hist[i];
    var sommeB = 0, poidsB = 0, maxVar = -1, seuil = 0, varTotale = 0, moy = somme / n;
    for (i = 0; i < nbBacs; i++) varTotale += hist[i] * (i - moy) * (i - moy);
    varTotale /= n;
    for (i = 0; i < nbBacs; i++) {
      poidsB += hist[i];
      if (!poidsB) continue;
      var poidsF = n - poidsB;
      if (!poidsF) break;
      sommeB += i * hist[i];
      var mB = sommeB / poidsB, mF = (somme - sommeB) / poidsF;
      var v = poidsB * poidsF * (mB - mF) * (mB - mF) / (n * n);
      if (v > maxVar) { maxVar = v; seuil = i; }
    }
    return {
      seuil: (seuil + 1) * (100 / nbBacs),
      separabilite: varTotale > 0 ? maxVar / varTotale : 0
    };
  }

  /** Distance à l'INTÉRIEUR d'un binaire (chamfer sur le complément). */
  function distanceInterne(bin, w, h) {
    var comp = new Uint8Array(w * h);
    for (var i = 0; i < comp.length; i++) comp[i] = bin[i] ? 0 : 1;
    return distanceAuMasque(comp, w, h);
  }

  /**
   * Squelettisation Zhang-Suen sur liste d'avant-plan : au lieu de balayer toute
   * l'image à chaque sous-itération, on ne parcourt que les pixels encore allumés.
   * Sur un masque de fils (2 à 20 % de l'image) c'est 10 à 50 fois plus rapide, ce qui
   * rend la squelettisation utilisable à 900 px de large.
   */
  function squelettiser(bin, w, h) {
    var img = new Uint8Array(bin);
    var avant = [];
    for (var i = w; i < w * (h - 1); i++) {
      var x = i % w;
      if (x === 0 || x === w - 1) continue;
      if (img[i]) avant.push(i);
    }
    var change = true, garde = 0;
    while (change && garde++ < 30) {
      change = false;
      for (var pass = 0; pass < 2; pass++) {
        var aSupp = [];
        for (var k = 0; k < avant.length; k++) {
          var j = avant[k];
          if (!img[j]) continue;
          var p2 = img[j - w] ? 1 : 0, p3 = img[j - w + 1] ? 1 : 0, p4 = img[j + 1] ? 1 : 0,
              p5 = img[j + w + 1] ? 1 : 0, p6 = img[j + w] ? 1 : 0, p7 = img[j + w - 1] ? 1 : 0,
              p8 = img[j - 1] ? 1 : 0, p9 = img[j - w - 1] ? 1 : 0;
          var B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (B < 2 || B > 6) continue;
          var seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2], A = 0;
          for (var q = 0; q < 8; q++) if (seq[q] === 0 && seq[q + 1] === 1) A++;
          if (A !== 1) continue;
          if (pass === 0) { if (p2 * p4 * p6 !== 0 || p4 * p6 * p8 !== 0) continue; }
          else { if (p2 * p4 * p8 !== 0 || p2 * p6 * p8 !== 0) continue; }
          aSupp.push(j);
        }
        if (aSupp.length) {
          change = true;
          for (var z = 0; z < aSupp.length; z++) img[aSupp[z]] = 0;
        }
      }
      var reste = [];
      for (var k2 = 0; k2 < avant.length; k2++) if (img[avant[k2]]) reste.push(avant[k2]);
      avant = reste;
    }
    return { squelette: img, pixels: avant };
  }

  /**
   * Contexte macro : binarisation des fils, distance interne, squelette.
   * Tout le mode fibre travaille là-dessus.
   */
  function construireContexteMacro(imageData, options) {
    options = options || {};
    var p = options.prep || preparerImage(imageData, options.largeurTravail || MACRO.LARGEUR_TRAVAIL);
    var w = p.w, h = p.h, n = w * h;

    var otsu = seuilOtsu(p.L, 64);
    var bin = new Uint8Array(n), nFil = 0;
    // Les fils sont la classe CLAIRE (mèche éclairée par la torche sur fond sombre).
    for (var i = 0; i < n; i++) if (p.L[i] > otsu.seuil) { bin[i] = 1; nFil++; }
    // Si la classe claire domine largement, c'est le fond qui est clair : on inverse.
    var inverse = false;
    if (nFil > 0.6 * n) {
      inverse = true; nFil = 0;
      for (var i2 = 0; i2 < n; i2++) { bin[i2] = p.L[i2] <= otsu.seuil ? 1 : 0; if (bin[i2]) nFil++; }
    }
    // nettoyage : retire les pixels isolés (bruit de capteur)
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var j = y * w + x;
        if (!bin[j]) continue;
        var c = bin[j - 1] + bin[j + 1] + bin[j - w] + bin[j + w];
        if (c === 0) { bin[j] = 0; nFil--; }
      }
    }
    var dist = distanceInterne(bin, w, h);
    var sq = squelettiser(bin, w, h);

    // Largeur locale = 2 x distance au bord, lue sur l'axe médian (largeur médiale,
    // mesure standard d'un ruban). Seules les valeurs plausibles sont gardées.
    var largeurs = [];
    for (var k = 0; k < sq.pixels.length; k++) {
      var l = 2 * dist[sq.pixels[k]];
      if (l >= 2 && l <= 200) largeurs.push(l);
    }
    // Estimateur AIRE / LONGUEUR : la surface du binaire divisee par la longueur de
    // l'axe median donne la largeur moyenne au SOUS-PIXEL, la ou la largeur mediale
    // est quantifiee par la transformee de distance (mesure : +33 % a 3 px, +20 % a
    // 5 px, exacte au-dela de 8 px). On publie celui-ci, l'autre reste en detail.
    var largeurAireLongueur = sq.pixels.length > 0 ? (nFil / sq.pixels.length) : null;
    return {
      largeurAireLongueur: largeurAireLongueur,
      p: p, w: w, h: h, bin: bin, dist: dist,
      squelette: sq.squelette, pixelsSquelette: sq.pixels,
      largeurs: largeurs,
      largeurMediane: largeurs.length ? median(largeurs) : null,
      couverture: nFil / n,
      otsu: otsu, binaireInverse: inverse,
      nettete: netteteGlobale(p)
    };
  }

  /** Variance du laplacien sur toute l'image (Pertuz 2013). */
  function netteteGlobale(p) {
    var w = p.w, h = p.h, L = p.L, vals = [];
    for (var y = 1; y < h - 1; y += 2) {
      for (var x = 1; x < w - 1; x += 2) {
        var i = y * w + x;
        vals.push(L[i - 1] + L[i + 1] + L[i - w] + L[i + w] - 4 * L[i]);
      }
    }
    if (vals.length < 50) return 0;
    var mu = mean(vals), s = 0;
    for (var k = 0; k < vals.length; k++) { var d = vals[k] - mu; s += d * d; }
    return s / vals.length;
  }

  /**
   * evaluerPriseMacro(imageData, options)
   *
   * Ce que l'écran doit faire tourner en continu pendant que la personne approche le
   * téléphone. Renvoie de quoi guider ET la décision de déclenchement automatique.
   *
   *   { pret, declencher, message, nettete, largeurFilPx, couverture, separabilite,
   *     raisons: [...] }
   *
   * Déclenchement automatique quand, ET SEULEMENT QUAND :
   *   - la netteté (variance du laplacien) dépasse MACRO.NETTETE_MIN,
   *   - la largeur médiane des fils tombe dans 12-45 px (la bonne distance),
   *   - les fils occupent entre 0,8 % et 55 % de l'image,
   *   - la séparabilité d'Otsu montre bien deux populations (mèche / fond).
   * Sinon on refuse, avec le message qui dit quoi corriger.
   */
  function evaluerPriseMacro(imageData, options) {
    var c = construireContexteMacro(imageData, options);
    var raisons = [], message = 'Pret', pret = true;

    if (c.otsu.separabilite < 0.45) {
      raisons.push('meche non detachee du fond'); pret = false;
      message = 'Mettre un fond sombre derriere la meche';
    }
    if (c.couverture < MACRO.COUVERTURE_MIN) {
      raisons.push('aucun fil detecte'); pret = false;
      message = 'Approcher le telephone de la meche';
    } else if (c.couverture > MACRO.COUVERTURE_MAX) {
      raisons.push('trop de matiere dans le cadre'); pret = false;
      message = 'Reculer un peu, ne garder qu une meche';
    }
    if (c.nettete < MACRO.NETTETE_MIN) {
      raisons.push('image floue'); pret = false;
      message = 'Stabiliser, attendre la mise au point';
    }
    if (c.largeurMediane === null) {
      raisons.push('aucun fil mesurable'); pret = false;
    } else if (c.largeurMediane < MACRO.LARGEUR_FIL_MIN) {
      raisons.push('fils trop fins : trop loin'); pret = false;
      message = 'Approcher encore';
    } else if (c.largeurMediane > MACRO.LARGEUR_FIL_MAX) {
      raisons.push('fils trop epais : trop pres ou ce n est pas un cheveu'); pret = false;
      message = 'Reculer un peu';
    } else if (c.largeurMediane < MACRO.LARGEUR_FIL_CIBLE[0] || c.largeurMediane > MACRO.LARGEUR_FIL_CIBLE[1]) {
      raisons.push('distance acceptable mais pas ideale');
    }

    return {
      pret: pret,
      declencher: pret && c.nettete >= MACRO.NETTETE_MIN,
      message: message,
      nettete: Math.round(c.nettete),
      qualiteNettete: Math.round(100 * clamp(0, 1, c.nettete / MACRO.NETTETE_BONNE)),
      largeurFilPx: c.largeurMediane === null ? null : Math.round(c.largeurMediane * 10) / 10,
      couverture: Math.round(c.couverture * 10000) / 10000,
      separabilite: Math.round(c.otsu.separabilite * 100) / 100,
      raisons: raisons,
      contexte: c
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.2  ÉCHELLE RÉELLE : pixels -> millimètres
  // ──────────────────────────────────────────────────────────────────────

  /** Composantes connexes 4-voisins d'un binaire, au-dessus d'une taille minimale. */
  function composantes(bin, w, h, tailleMin) {
    var vus = new Uint8Array(w * h), file = new Int32Array(w * h), out = [];
    for (var s = 0; s < w * h; s++) {
      if (!bin[s] || vus[s]) continue;
      var t = 0, q = 0; file[q++] = s; vus[s] = 1;
      var pts = [];
      while (t < q) {
        var c = file[t++]; pts.push(c);
        var cy = (c / w) | 0, cx = c - cy * w;
        if (cx > 0 && bin[c - 1] && !vus[c - 1]) { vus[c - 1] = 1; file[q++] = c - 1; }
        if (cx < w - 1 && bin[c + 1] && !vus[c + 1]) { vus[c + 1] = 1; file[q++] = c + 1; }
        if (cy > 0 && bin[c - w] && !vus[c - w]) { vus[c - w] = 1; file[q++] = c - w; }
        if (cy < h - 1 && bin[c + w] && !vus[c + w]) { vus[c + w] = 1; file[q++] = c + w; }
      }
      if (pts.length >= tailleMin) out.push(pts);
    }
    return out;
  }

  /** Enveloppe convexe, parcours monotone d'Andrew (1979). */
  function enveloppeConvexe(pts) {
    if (pts.length < 3) return pts.slice();
    var p = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var bas = [], i;
    for (i = 0; i < p.length; i++) {
      while (bas.length >= 2 && cross(bas[bas.length - 2], bas[bas.length - 1], p[i]) <= 0) bas.pop();
      bas.push(p[i]);
    }
    var haut = [];
    for (i = p.length - 1; i >= 0; i--) {
      while (haut.length >= 2 && cross(haut[haut.length - 2], haut[haut.length - 1], p[i]) <= 0) haut.pop();
      haut.push(p[i]);
    }
    bas.pop(); haut.pop();
    return bas.concat(haut);
  }

  /** Rectangle d'aire minimale d'une enveloppe convexe (calipers tournants). */
  function rectangleMinimal(hull) {
    if (hull.length < 3) return null;
    var best = null;
    for (var i = 0; i < hull.length; i++) {
      var j = (i + 1) % hull.length;
      var dx = hull[j][0] - hull[i][0], dy = hull[j][1] - hull[i][1];
      var l = Math.sqrt(dx * dx + dy * dy);
      if (l < 1e-6) continue;
      var ux = dx / l, uy = dy / l;
      var minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
      for (var k = 0; k < hull.length; k++) {
        var u = hull[k][0] * ux + hull[k][1] * uy;
        var v = -hull[k][0] * uy + hull[k][1] * ux;
        if (u < minU) minU = u; if (u > maxU) maxU = u;
        if (v < minV) minV = v; if (v > maxV) maxV = v;
      }
      var a = (maxU - minU), b = (maxV - minV), aire = a * b;
      if (!best || aire < best.aire) best = { aire: aire, cote1: a, cote2: b, angle: Math.atan2(uy, ux) };
    }
    if (!best) return null;
    best.grand = Math.max(best.cote1, best.cote2);
    best.petit = Math.min(best.cote1, best.cote2);
    best.rapport = best.petit > 0 ? best.grand / best.petit : Infinity;
    return best;
  }

  function perimetrePolygone(poly) {
    var per = 0;
    for (var i = 0; i < poly.length; i++) {
      var j = (i + 1) % poly.length;
      per += Math.hypot(poly[j][0] - poly[i][0], poly[j][1] - poly[i][1]);
    }
    return per;
  }

  /**
   * detecterReferenceEchelle(imageData, options) -> { type, mmParPx, incertitudeUmParPx, ... }
   *
   * Cherche dans le cadre un objet de dimension normalisée :
   *   - carte bancaire (ISO 7810 ID-1, 85,60 mm de long, rapport 1,586)
   *     -> plus grande composante dont le rectangle minimal a un rapport 1,50-1,68
   *        et un taux de remplissage > 0,80
   *   - pièce de 2 euros (25,75 mm de diamètre)
   *     -> composante de circularité 4·pi·A/P² > 0,80 et de rectangle quasi carré
   *
   * L'ongle du pouce est ACCEPTÉ sur demande explicite (options.reference='ongle') mais
   * renvoyé avec fiabilite 'faible' : la largeur d'un ongle de pouce varie de 13 à 20 mm
   * selon les personnes, soit ±25 % d'erreur d'échelle. Aucune valeur en micromètres
   * n'est publiée à partir de cette référence.
   *
   * Sans référence : mmParPx = null. Le moteur ne publie alors QUE du relatif.
   */
  function detecterReferenceEchelle(imageData, options) {
    options = options || {};
    var p = options.prep || preparerImage(imageData, 520);
    var w = p.w, h = p.h, n = w * h;

    if (options.reference === 'ongle' && options.largeurOnglePx) {
      return { type: 'ongle', mmParPx: MACRO.ONGLE_POUCE_MM / options.largeurOnglePx,
               fiabilite: 'faible',
               note: 'echelle donnee par un ongle de pouce : la largeur varie de 13 a 20 mm selon les personnes, soit environ 25 % d erreur. Aucune valeur en micrometres n est publiee avec cette reference.' };
    }
    if (typeof options.mmParPx === 'number' && options.mmParPx > 0) {
      return { type: 'fournie', mmParPx: options.mmParPx, fiabilite: 'bonne',
               note: 'echelle fournie par l appelant (banc optique, bonnette calibree)' };
    }

    // On cherche les objets plats et clairs : la carte et la pièce sont nettement plus
    // uniformes que la chevelure. Binarisation par Otsu sur L*, puis composantes.
    var otsu = seuilOtsu(p.L, 64);
    var bin = new Uint8Array(n);
    for (var i = 0; i < n; i++) bin[i] = p.L[i] > otsu.seuil ? 1 : 0;
    // Les fils traversent la carte ou la piece et relient tout en une seule composante
    // (constate sur les cas de controle : aucune reference detectee). On EROD le binaire
    // d'un rayon superieur a la demi-largeur d'un fil : les fils disparaissent, les
    // objets massifs restent. La taille est corrigee ensuite.
    var rayonErosion = Math.max(2, Math.round(0.012 * w));
    var distInt = distanceInterne(bin, w, h);
    var binErode = new Uint8Array(n);
    for (var e0 = 0; e0 < n; e0++) binErode[e0] = distInt[e0] > rayonErosion ? 1 : 0;
    var comps = composantes(binErode, w, h, Math.round(0.002 * n));
    var candidats = [];
    for (var c = 0; c < comps.length; c++) {
      var pts = comps[c];
      var xy = [];
      for (var k = 0; k < pts.length; k += Math.max(1, Math.floor(pts.length / 4000))) {
        var y0 = (pts[k] / w) | 0; xy.push([pts[k] - y0 * w, y0]);
      }
      var hull = enveloppeConvexe(xy);
      var rect = rectangleMinimal(hull);
      if (!rect) continue;
      // on rend ce que l'erosion a retire
      rect.grand += 2 * rayonErosion; rect.petit += 2 * rayonErosion;
      rect.aire = rect.grand * rect.petit;
      rect.rapport = rect.petit > 0 ? rect.grand / rect.petit : Infinity;
      if (rect.grand < 0.12 * w) continue;
      var remplissage = (pts.length + 2 * rayonErosion * (rect.grand + rect.petit)) / Math.max(1, rect.aire);
      var per = perimetrePolygone(hull);
      // aire du polygone convexe (formule du lacet)
      var aireHull = 0;
      for (var q = 0; q < hull.length; q++) {
        var r2 = (q + 1) % hull.length;
        aireHull += hull[q][0] * hull[r2][1] - hull[r2][0] * hull[q][1];
      }
      aireHull = Math.abs(aireHull) / 2;
      var circ = per > 0 ? 4 * Math.PI * aireHull / (per * per) : 0;
      candidats.push({ rect: rect, remplissage: remplissage, circularite: circ, taille: pts.length });
    }

    var carte = null, piece = null;
    for (var z = 0; z < candidats.length; z++) {
      var cd = candidats[z];
      if (cd.rect.rapport > 1.50 && cd.rect.rapport < 1.68 && cd.remplissage > 0.80) {
        if (!carte || cd.rect.grand > carte.rect.grand) carte = cd;
      }
      if (cd.circularite > 0.80 && cd.rect.rapport < 1.15 && cd.remplissage > 0.72) {
        if (!piece || cd.rect.grand > piece.rect.grand) piece = cd;
      }
    }

    // IMPORTANT : la detection tourne sur une image de travail reduite. On ramene
    // l'echelle au pixel de l'IMAGE D'ORIGINE, sinon elle est fausse d'un facteur egal
    // au sous-echantillonnage (mesure : +100 % d'erreur avant correction).
    var pas = p.pas || 1;
    if (carte) {
      return { type: 'carte', mmParPx: MACRO.CARTE_MM / (carte.rect.grand * pas), fiabilite: 'bonne',
               pasImageDeTravail: pas,
               detail: { longueurPx: Math.round(carte.rect.grand), rapport: Math.round(carte.rect.rapport * 1000) / 1000,
                         remplissage: Math.round(carte.remplissage * 100) / 100 },
               note: 'carte au format ISO 7810 ID-1, 85,60 mm de long' };
    }
    if (piece) {
      var diam = (piece.rect.grand + piece.rect.petit) / 2;
      return { type: 'piece_2_euros', mmParPx: MACRO.PIECE_2E_MM / (diam * pas), fiabilite: 'moyenne',
               pasImageDeTravail: pas,
               detail: { diametrePx: Math.round(diam), circularite: Math.round(piece.circularite * 100) / 100 },
               note: 'piece de 2 euros, 25,75 mm de diametre. Toute piece ronde de taille voisine serait confondue : a confirmer par l ecran.' };
    }
    return { type: 'aucune', mmParPx: null, fiabilite: 'nulle',
             note: 'aucune reference d echelle dans le cadre : le moteur ne publie que du relatif, jamais de millimetres.' };
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.3  MESURES SUR LA FIBRE
  // ──────────────────────────────────────────────────────────────────────

  /**
   * ÉPAISSEUR DE FIBRE — largeur médiale des fils.
   *
   * MÉTHODE
   *   Binarisation d'Otsu (mèche éclairée / fond sombre), squelettisation Zhang-Suen,
   *   puis largeur = SURFACE DU BINAIRE / LONGUEUR DE L'AXE MÉDIAN. Cet estimateur est
   *   au sous-pixel. La largeur médiale (2 × distance au bord sur l'axe) est calculée
   *   aussi mais seulement publiée en détail : elle est quantifiée par la transformée de
   *   distance et surestime de 20 à 33 % en dessous de 6 px (mesuré sur fils de largeur
   *   connue). Les deux sont insensibles à la courbure du fil.
   *
   * INCERTITUDE, CALCULÉE ET NON SUPPOSÉE
   *   La binarisation place le bord à ±1 pixel, donc la largeur est connue à ±1 px, soit
   *   ±(mmParPx × 1000) micromètres. Le moteur publie cette incertitude et REFUSE de
   *   publier le diamètre en micromètres dès qu'elle dépasse 30 % de la valeur.
   *
   * LIMITE
   *   Avec un téléphone nu en mode macro (champ 55 à 83 mm), un cheveu fait 3 à 5 px :
   *   l'incertitude est de 14 à 21 um sur un cheveu de 40 a 120 um, soit 15 a 50 %. Il
   *   faut une bonnette macro (champ ~15 mm) pour descendre a ±4 um. Sans reference
   *   d'echelle dans le cadre, la mesure reste en pixels et n'est comparable qu'a
   *   elle-meme.
   */
  function mesureEpaisseurFibre(cm, echelle) {
    var methode = 'largeur mediale : binarisation Otsu, transformee de distance interne, squelettisation Zhang-Suen, largeur = 2 x distance au bord sur l axe median';
    var limite = 'incertitude de 1 pixel sur le bord ; sans reference d echelle la mesure reste en pixels ; un telephone nu donne 3 a 5 px par cheveu';
    if (!cm.largeurs.length) return mesureNulle('aucun_fil_mesurable', methode, limite);
    if (cm.largeurMediane < MACRO.LARGEUR_FIL_MIN) return mesureNulle('fils_trop_fins_pour_mesurer', methode, limite);
    if (cm.largeurMediane > MACRO.LARGEUR_FIL_MAX) return mesureNulle('objet_trop_epais_pour_un_cheveu', methode, limite);

    var q = {
      p25: percentile(cm.largeurs, 25),
      p50: (cm.largeurAireLongueur !== null && cm.largeurAireLongueur > 0)
             ? cm.largeurAireLongueur : cm.largeurMediane,
      p75: percentile(cm.largeurs, 75), n: cm.largeurs.length
    };
    var dispersion = q.p50 > 0 ? (q.p75 - q.p25) / q.p50 : null;

    var extra = {
      largeurPx: Math.round(q.p50 * 100) / 100,
      p25Px: Math.round(q.p25 * 100) / 100, p75Px: Math.round(q.p75 * 100) / 100,
      dispersionRelative: dispersion === null ? null : Math.round(dispersion * 1000) / 1000,
      largeurMedialePx: cm.largeurMediane === null ? null : Math.round(cm.largeurMediane * 100) / 100,
      pointsMesures: q.n,
      diametreUm: null, incertitudeUm: null, classe: null, raisonClasse: null
    };

    if (echelle && echelle.mmParPx) {
      // q.p50 est en pixels de l'image de TRAVAIL macro ; l'echelle est en pixels de
      // l'image d'origine. On convertit avant de multiplier.
      var pasMacro = (cm.p && cm.p.pas) ? cm.p.pas : 1;
      var largeurOriginePx = q.p50 * pasMacro;
      var um = largeurOriginePx * echelle.mmParPx * 1000;
      var incert = pasMacro * echelle.mmParPx * 1000;   // 1 pixel de travail
      extra.incertitudeUm = Math.round(incert * 10) / 10;
      if (echelle.fiabilite === 'faible') {
        extra.raisonClasse = 'echelle trop approximative (' + echelle.type + ') pour publier des micrometres';
      } else if (incert > MACRO.INCERTITUDE_MAX_RELATIVE * um) {
        extra.raisonClasse = 'incertitude de ' + Math.round(incert) + ' um pour un diametre de ' +
          Math.round(um) + ' um : au-dela de 30 %, la valeur n est pas publiee';
      } else {
        extra.diametreUm = Math.round(um);
        // Bornes usuelles du cheveu humain (Robbins 2012, Chemical and Physical
        // Behavior of Human Hair, chap. 1) : fin < 60 um, moyen 60-80, epais > 80.
        extra.classe = um < 60 ? 'fin' : (um <= 80 ? 'moyen' : 'epais');
        if (um < 20 || um > 250) {
          extra.classe = null;
          extra.raisonClasse = 'diametre hors de la plage humaine (20-250 um) : ce n est probablement pas un cheveu isole';
        }
      }
    } else {
      extra.raisonClasse = 'aucune reference d echelle dans le cadre : mesure en pixels seulement';
    }

    return mesure(extra.largeurPx, 'px (largeur mediale)', methode, limite,
      echelle && echelle.mmParPx && extra.diametreUm !== null ? 'moyenne' : 'faible', extra);
  }

  /**
   * FOURCHES ET CASSE — bifurcations en bout de fil.
   *
   * MÉTHODE
   *   Sur le squelette : les extrémités sont les pixels à 1 voisin, les bifurcations les
   *   pixels à 3 voisins ou plus. Les pixels de bifurcation adjacents sont REGROUPÉS en
   *   une seule jonction. Une FOURCHE est une jonction ayant au moins deux extrémités à
   *   moins de 3,5 fois la largeur du fil : un Y en bout de cheveu. Une bifurcation loin de toute extrémité est un simple
   *   croisement de deux cheveux, elle ne compte pas.
   *   Taux = fourches / extrémités. Une CASSE nette (fil coupé net) compte comme une
   *   extrémité sans fourche : le rapport distingue donc bien les deux.
   *
   * ÉCHELLE
   *   Une fourche ouverte de 0,2 à 1 mm fait 15 à 70 px avec un téléphone en mode macro :
   *   c'est la mesure de la v2 qui est la plus confortablement au-dessus de la résolution.
   *
   * LIMITE
   *   Deux cheveux qui se croisent en bout de mèche imitent une fourche. Le seuil de
   *   proximité limite le faux positif sans l'annuler.
   */
  function mesureFourches(cm) {
    var methode = 'squelettisation, puis regroupement des extremites distantes de moins de 8 largeurs de fil : une pointe portant 2 extremites ou plus est fourchue ; taux = pointes fourchues / pointes totales';
    var limite = 'deux cheveux qui se croisent pres d une pointe imitent une fourche ; mesure d aspect, pas d analyse de la keratine';
    var w = cm.w, h = cm.h, sq = cm.squelette;
    if (!cm.pixelsSquelette.length) return mesureNulle('aucun_squelette', methode, limite);
    if (cm.largeurMediane === null) return mesureNulle('largeur_de_fil_inconnue', methode, limite);

    var extremites = [], bifurcations = [];
    for (var k = 0; k < cm.pixelsSquelette.length; k++) {
      var i = cm.pixelsSquelette[k];
      if (!sq[i]) continue;
      var v = sq[i - 1] + sq[i + 1] + sq[i - w] + sq[i + w] +
              sq[i - w - 1] + sq[i - w + 1] + sq[i + w - 1] + sq[i + w + 1];
      if (v === 1) {
        // Une extremite collee au bord du cadre n'est pas une pointe de cheveu :
        // c'est un fil qui SORT de l'image. On ne la compte pas.
        var ey0 = (i / w) | 0, ex0 = i - ey0 * w;
        if (ex0 > 3 && ey0 > 3 && ex0 < w - 4 && ey0 < h - 4) extremites.push(i);
      } else if (v >= 3) bifurcations.push(i);
    }
    if (extremites.length < 4) return mesureNulle('pas_assez_d_extremites', methode, limite);

    // COMPTAGE PAR LES POINTES, PAS PAR LES JONCTIONS.
    // Le parcours de branches depuis les jonctions a echoue sur les cas de controle :
    // une fourche a angle ouvert produit une ZONE de bifurcation large, qui avale les
    // deux branches et ne laisse qu'un seul depart. Une pointe fourchue se reconnait
    // beaucoup plus simplement : elle donne DEUX EXTREMITES VOISINES, la ou une coupe
    // nette n'en donne qu'une. On regroupe donc les extremites distantes de moins de
    // 8 largeurs de fil ; un groupe de 2 extremites ou plus est une fourche.
    // Rayon de regroupement : 5 largeurs de fil. Au-dela, deux cheveux voisins se
    // retrouvent fusionnes en une fausse fourche (mesure : a 8 largeurs, toutes les
    // pointes du cas de controle se regroupaient en un seul paquet). Une fourche qui
    // s'ouvre de plus de 5 largeurs est donc manquee : c'est la limite assumee.
    var rayonFourche = Math.max(6, 5 * cm.largeurMediane);
    var vuE = new Uint8Array(extremites.length);
    var fourches = 0, groupesPointes = 0, pointesIsolees = 0;
    for (var e1 = 0; e1 < extremites.length; e1++) {
      if (vuE[e1]) continue;
      var pile = [e1]; vuE[e1] = 1; var taille = 0;
      while (pile.length) {
        var cur = pile.pop(); taille++;
        var cy = (extremites[cur] / w) | 0, cx = extremites[cur] - cy * w;
        for (var e2 = 0; e2 < extremites.length; e2++) {
          if (vuE[e2]) continue;
          var oy = (extremites[e2] / w) | 0, ox = extremites[e2] - oy * w;
          if (Math.hypot(ox - cx, oy - cy) <= rayonFourche) { vuE[e2] = 1; pile.push(e2); }
        }
      }
      groupesPointes++;
      if (taille >= 2) fourches++; else pointesIsolees++;
    }

    // Les jonctions restent comptees, en detail : elles disent combien de cheveux se
    // croisent dans le cadre, ce qui sert a juger si la prise est trop dense.
    var binBif = new Uint8Array(w * h);
    for (var bb = 0; bb < bifurcations.length; bb++) binBif[bifurcations[bb]] = 1;
    var groupes = composantes(dilater(binBif, w, h, Math.max(2, cm.largeurMediane)), w, h, 1);
    var taux = groupesPointes > 0 ? fourches / groupesPointes : 0;
    return mesure(Math.round(taux * 1000) / 1000, 'part des pointes qui sont fourchues', methode, limite, 'faible', {
      fourches: fourches, pointesIsolees: pointesIsolees, groupesDePointes: groupesPointes,
      extremites: extremites.length,
      jonctions: groupes.length, pixelsDeBifurcation: bifurcations.length,
      rayonFourchePx: Math.round(rayonFourche)
    });
  }

  /**
   * RÉGULARITÉ DU BORD DU FIL — ce que le mode macro peut dire de l'état de surface.
   *
   * CE QUE C'EST, ET CE QUE CE N'EST PAS
   *   Ce N'EST PAS une mesure de la cuticule. Les écailles de cuticule font 0,5 à 1 um de
   *   haut et se chevauchent tous les 5 a 10 um : il faut un microscope electronique, pas
   *   un telephone (1 px vaut 14 a 21 um en macro telephone, 4 um avec une bonnette).
   *   Ce qui EST mesurable, c'est la REGULARITE DU BORD du fil a l'echelle de 20-100 um :
   *   un cheveu abime s'effiloche et son bord devient irregulier.
   *
   * MÉTHODE
   *   1. Coefficient de variation de la largeur locale le long de l'axe median
   *      (ecart-type / moyenne) : un fil sain a une largeur stable.
   *   2. Tortuosite du contour : perimetre du binaire rapporte a 2 x la longueur du
   *      squelette. Un ruban lisse vaut ~1, un bord effiloche monte.
   *   Indice = moyenne des deux, normalise.
   *
   * LIMITE
   *   Le flou de bouge augmente les deux indicateurs. La mesure n'a de sens qu'au-dessus
   *   du seuil de nettete du mode macro, et n'est comparable qu'a echelle egale.
   */
  function mesureRegulariteBord(cm) {
    var methode = 'coefficient de variation de la largeur mediale le long du fil + tortuosite du contour (perimetre / 2 x longueur du squelette)';
    var limite = 'ne mesure PAS la cuticule (ecailles de 0,5 a 1 um, hors de portee d un telephone) mais la regularite du bord a 20-100 um ; le flou de bouge la gonfle';
    if (cm.largeurs.length < 50) return mesureNulle('pas_assez_de_points_sur_l_axe_median', methode, limite);
    if (cm.nettete < MACRO.NETTETE_MIN) return mesureNulle('image_trop_floue', methode, limite);

    var mu = mean(cm.largeurs), sd = std(cm.largeurs);
    var cv = mu > 0 ? sd / mu : null;

    var w = cm.w, h = cm.h, bin = cm.bin, per = 0;
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var i = y * w + x;
        if (!bin[i]) continue;
        if (!bin[i - 1] || !bin[i + 1] || !bin[i - w] || !bin[i + w]) per++;
      }
    }
    var longueur = cm.pixelsSquelette.length;
    var tort = longueur > 0 ? per / (2 * longueur) : null;
    if (cv === null || tort === null) return mesureNulle('calcul_impossible', methode, limite);

    var nCv = clamp(0, 1, (cv - 0.12) / 0.45);
    var nTort = clamp(0, 1, (tort - 1.0) / 1.2);
    var v = clamp(0, 1, 0.5 * nCv + 0.5 * nTort);
    return mesure(Math.round(v * 1000) / 1000, '0..1 (1 = bord tres irregulier)', methode, limite, 'faible', {
      coefficientVariationLargeur: Math.round(cv * 1000) / 1000,
      tortuositeContour: Math.round(tort * 1000) / 1000,
      longueurSqueletteePx: longueur, perimetrePx: per
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.4  DOUBLE PRISE TORCHE : séparer le reflet de la couleur
  // ──────────────────────────────────────────────────────────────────────

  /**
   * separerSpeculaire(imageTorche, imageSansTorche, options)
   *
   * POURQUOI
   *   En v1, la brillance mesurée sur une seule image était ANTI-CORRÉLÉE avec la
   *   brillance perçue (Spearman -0,30) : un reflet ajoute une quantité de lumière à peu
   *   près constante, qui ressort sur un cheveu noir et se noie sur un blond. La mesure
   *   suivait la noirceur du cheveu. Deux images prises dans la même seconde, torche
   *   allumée puis éteinte, lèvent l'ambiguïté : la DIFFÉRENCE ne contient que ce que la
   *   torche a ajouté.
   *
   * MÉTHODE (modèle dichromatique, Shafer 1985)
   *   1. Les deux images sont converties en lumière LINÉAIRE (le gamma sRGB est défait) :
   *      sans cela, une soustraction n'a aucun sens physique.
   *   2. Δ = max(0, lin(torche) − lin(sans torche)), pixel à pixel.
   *   3. Dans Δ, la partie diffuse porte la couleur du cheveu C_d, la partie spéculaire
   *      porte la couleur de la source C_s. C_d est estimée sur les 40 % de pixels les
   *      plus sombres de Δ (les moins spéculaires), C_s sur les 2 % les plus clairs.
   *   4. Pour chaque pixel : Δ = m_d·C_d + m_s·C_s, résolu aux moindres carrés
   *      (3 équations, 2 inconnues), m_d et m_s bornés à zéro.
   *   5. On publie la part spéculaire Σm_s / (Σm_s + Σm_d).
   *
   * CE QUE ÇA RÈGLE ET CE QUE ÇA NE RÈGLE PAS
   *   Ça sépare vraiment reflet et couleur. Mais m_s dépend aussi de la distance et de la
   *   puissance de la torche : deux personnes ne sont comparables que si l'éclairement est
   *   connu. Quand une surface de référence de réflectance connue est dans le cadre
   *   (la carte blanche, options.niveauReference), le moteur normalise et le dit ; sinon
   *   il publie une valeur RELATIVE, comparable à elle-même dans le temps, pas entre
   *   personnes.
   *
   * REFUS
   *   Si C_s et C_d sont trop proches (angle < 8°), le système est mal conditionné :
   *   on refuse au lieu de renvoyer un partage arbitraire. C'est le cas d'un cheveu
   *   blanc sous une torche blanche.
   */
  function separerSpeculaire(imageTorche, imageSansTorche, options) {
    options = options || {};
    var methode = 'double prise torche allumee / eteinte, difference en lumiere lineaire, separation dichromatique (Shafer 1985) entre couleur du cheveu et couleur de la source';
    var limite = 'm_s depend de la distance et de la puissance de la torche : sans surface de reference dans le cadre, la valeur est relative et non comparable entre personnes ; refus si la couleur du cheveu et celle de la torche sont trop proches (cheveu blanc)';

    if (!imageTorche || !imageSansTorche) return mesureNulle('deux_images_requises', methode, limite);
    if (imageTorche.width !== imageSansTorche.width || imageTorche.height !== imageSansTorche.height) {
      return mesureNulle('images_de_tailles_differentes', methode, limite);
    }
    var lTarget = options.largeurTravail || 700;
    var pOn = preparerImage(imageTorche, lTarget);
    var pOff = preparerImage(imageSansTorche, lTarget);
    if (pOn.w !== pOff.w || pOn.h !== pOff.h) return mesureNulle('echantillonnage_incoherent', methode, limite);
    var n = pOn.w * pOn.h;

    // masque : la matière éclairée par la torche (seuil d'Otsu sur l'image torche)
    var otsu = seuilOtsu(pOn.L, 64);
    var dR = new Float64Array(n), dG = new Float64Array(n), dB = new Float64Array(n);
    var lum = [], idx = [];
    for (var i = 0; i < n; i++) {
      if (pOn.L[i] <= otsu.seuil) continue;
      var r = srgbToLinear(pOn.R[i]) - srgbToLinear(pOff.R[i]);
      var g = srgbToLinear(pOn.G[i]) - srgbToLinear(pOff.G[i]);
      var b = srgbToLinear(pOn.B[i]) - srgbToLinear(pOff.B[i]);
      if (r < 0) r = 0; if (g < 0) g = 0; if (b < 0) b = 0;
      var y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (y <= 1e-5) continue;
      dR[i] = r; dG[i] = g; dB[i] = b;
      lum.push(y); idx.push(i);
    }
    if (idx.length < 300) return mesureNulle('la_torche_n_a_rien_change', methode, limite);

    var tri = Float64Array.from(lum); tri.sort();
    var seuilBas = tri[Math.floor(0.40 * (tri.length - 1))];
    var seuilHaut = tri[Math.floor(0.98 * (tri.length - 1))];

    function moyenneNormalisee(filtre) {
      var sr = 0, sg = 0, sb = 0, c = 0;
      for (var k = 0; k < idx.length; k++) {
        if (!filtre(lum[k])) continue;
        sr += dR[idx[k]]; sg += dG[idx[k]]; sb += dB[idx[k]]; c++;
      }
      if (!c) return null;
      var t = sr + sg + sb;
      if (t <= 0) return null;
      return [sr / t, sg / t, sb / t];
    }
    var Cd = moyenneNormalisee(function (y) { return y <= seuilBas; });
    // La torche d'un telephone est une LED blanche : sa chromaticite est NEUTRE. La
    // deduire des pixels les plus clairs etait mal conditionne (le lobe speculaire n'y
    // domine pas toujours) et faisait refuser des cas ou la separation etait possible.
    var Cs = (options.chromaticiteSource && options.chromaticiteSource.length === 3)
      ? options.chromaticiteSource : [1 / 3, 1 / 3, 1 / 3];
    if (!Cd) return mesureNulle('chromaticite_du_cheveu_non_estimable', methode, limite);

    // conditionnement : angle entre les deux chromaticités
    var dot = Cd[0] * Cs[0] + Cd[1] * Cs[1] + Cd[2] * Cs[2];
    var nd = Math.hypot(Cd[0], Cd[1], Cd[2]), ns = Math.hypot(Cs[0], Cs[1], Cs[2]);
    var angle = Math.acos(clamp(-1, 1, dot / (nd * ns))) * 180 / Math.PI;
    if (angle < 8) {
      // Deux causes possibles, et elles ne se valent pas : soit il n'y a PAS de reflet
      // (rien a separer, la reponse est zero), soit le cheveu est blanc comme la torche
      // (la separation est impossible, il faut refuser). On les distingue par la queue
      // claire de la distribution : un lobe speculaire cree un p98 nettement au-dessus
      // de la mediane.
      var med = tri[Math.floor(0.50 * (tri.length - 1))];
      var p98 = tri[Math.floor(0.98 * (tri.length - 1))];
      if (med > 0 && p98 / med < 1.8) {
        return mesure(0, '0..1 (part speculaire de ce que la torche a ajoute)', methode, limite, 'moyenne', {
          partSpeculaire: 0, angleChromatiqueDeg: Math.round(angle * 10) / 10,
          rapportP98surMediane: Math.round(p98 / med * 100) / 100,
          pixelsUtilises: idx.length,
          note: 'aucun lobe speculaire dans la difference : la torche n a ajoute que du diffus'
        });
      }
      return mesureNulle('couleur_du_cheveu_trop_proche_de_celle_de_la_torche', methode, limite);
    }

    // moindres carrés 3x2, matrice normale fixe (Cd, Cs constants)
    var a11 = Cd[0] * Cd[0] + Cd[1] * Cd[1] + Cd[2] * Cd[2];
    var a12 = Cd[0] * Cs[0] + Cd[1] * Cs[1] + Cd[2] * Cs[2];
    var a22 = Cs[0] * Cs[0] + Cs[1] * Cs[1] + Cs[2] * Cs[2];
    var det = a11 * a22 - a12 * a12;
    if (Math.abs(det) < 1e-12) return mesureNulle('systeme_mal_conditionne', methode, limite);

    var sMd = 0, sMs = 0, nPix = 0, msPix = [];
    for (var k2 = 0; k2 < idx.length; k2++) {
      var j = idx[k2];
      var b1 = Cd[0] * dR[j] + Cd[1] * dG[j] + Cd[2] * dB[j];
      var b2 = Cs[0] * dR[j] + Cs[1] * dG[j] + Cs[2] * dB[j];
      var md = (a22 * b1 - a12 * b2) / det;
      var ms = (a11 * b2 - a12 * b1) / det;
      if (md < 0) md = 0;
      if (ms < 0) ms = 0;
      sMd += md; sMs += ms; nPix++;
      msPix.push(ms);
    }
    if (!nPix || (sMd + sMs) <= 0) return mesureNulle('separation_vide', methode, limite);

    var part = sMs / (sMs + sMd);
    var extra = {
      partSpeculaire: Math.round(part * 10000) / 10000,
      energieSpeculaire: Math.round(sMs / nPix * 1e6) / 1e6,
      energieDiffuse: Math.round(sMd / nPix * 1e6) / 1e6,
      chromaticiteCheveu: Cd.map(function (x) { return Math.round(x * 1000) / 1000; }),
      chromaticiteSource: Cs.map(function (x) { return Math.round(x * 1000) / 1000; }),
      angleChromatiqueDeg: Math.round(angle * 10) / 10,
      pixelsUtilises: nPix,
      normalisee: false, valeurNormalisee: null
    };
    if (typeof options.niveauReference === 'number' && options.niveauReference > 0) {
      extra.normalisee = true;
      extra.valeurNormalisee = Math.round((sMs / nPix) / options.niveauReference * 10000) / 10000;
    }
    return mesure(Math.round(part * 1000) / 1000, '0..1 (part speculaire de ce que la torche a ajoute)',
      methode, limite, extra.normalisee ? 'moyenne' : 'faible', extra);
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.5  SÉQUENCE AVEC MOUVEMENT
  // ──────────────────────────────────────────────────────────────────────

  /**
   * analyserSequence(frames, options)
   *
   * frames : [{ imageData, faceBox }] — la personne bouge doucement la tête.
   *
   * DEUX CHOSES QUE LE MOUVEMENT PERMET, ET QU'UNE IMAGE FIXE NE PERMET PAS
   *
   *   1. FRIZZ RÉEL contre BRUIT DE FOND. C'est le défaut qui a fait échouer le frizz en
   *      v1 : un feuillage derrière la tête produit exactement la même densité de bords
   *      qu'un halo de frisottis. Mais quand la tête bouge, LES CHEVEUX BOUGENT AVEC ELLE
   *      ET LE FOND NON. On estime le déplacement de la tête entre deux images (centre de
   *      la boîte visage), puis on compte, dans la couronne autour de la chevelure, les
   *      pixels de bord qui retrouvent un bord à la position DÉCALÉE du mouvement de tête
   *      (ils suivent la tête : cheveux) et ceux qui retrouvent un bord à la MÊME position
   *      (ils sont immobiles : fond). Le frizz réel est la densité des premiers.
   *
   *   2. RÉGULARITÉ APPARENTE DU REFLET. Quand la tête tourne, le reflet se déplace le
   *      long des mèches. On calcule l'amplitude temporelle de L* par pixel (max − min sur
   *      la séquence) : un reflet qui glisse proprement donne une carte d'amplitude
   *      SPATIALEMENT LISSE, un cheveu qui diffuse dans tous les sens donne un grésil.
   *      L'indice est le rapport entre la variance de la carte lissée et sa variance
   *      brute : proche de 1, le reflet est cohérent ; proche de 0, il est éparpillé.
   *
   * REFUS
   *   Moins de 3 images exploitables, ou tête immobile (déplacement < 2 px) : on ne peut
   *   rien séparer, on refuse.
   */
  function analyserSequence(frames, options) {
    options = options || {};
    var methode = 'suivi du deplacement de la tete entre images : les bords qui suivent la tete sont des cheveux, ceux qui restent immobiles sont le fond ; amplitude temporelle de L* pour la coherence du reflet';
    var limite = 'demande que la tete bouge d au moins 2 px entre deux images et que le fond soit fixe ; un fond en mouvement (foule, feuillage dans le vent) casse la separation';

    if (!frames || frames.length < 3) return { ok: false, raison: 'sequence_trop_courte', methode: methode, limite: limite };

    var analyses = [];
    for (var f = 0; f < frames.length; f++) {
      var fr = frames[f];
      var seg = segmentCheveux(fr.imageData, fr.faceBox || fr.landmarks, { largeurTravail: options.largeurTravail });
      if (!seg.ok) continue;
      analyses.push({ seg: seg, box: normaliserGeometrie(fr.faceBox || fr.landmarks) });
    }
    if (analyses.length < 3) return { ok: false, raison: 'moins_de_trois_images_exploitables', methode: methode, limite: limite };

    var w = analyses[0].seg.w, h = analyses[0].seg.h;
    for (var a = 1; a < analyses.length; a++) {
      if (analyses[a].seg.w !== w || analyses[a].seg.h !== h) {
        return { ok: false, raison: 'images_de_tailles_differentes', methode: methode, limite: limite };
      }
    }
    var ech = 1 / analyses[0].seg.prep.pas;

    // --- 1. frizz qui suit la tête
    var suit = 0, fixe = 0, total = 0, deplacements = [];
    for (var t = 0; t + 1 < analyses.length; t++) {
      var A = analyses[t], B = analyses[t + 1];
      var dx = Math.round(((B.box.box.x + B.box.box.width / 2) - (A.box.box.x + A.box.box.width / 2)) * ech);
      var dy = Math.round(((B.box.box.y + B.box.box.height / 2) - (A.box.box.y + A.box.box.height / 2)) * ech);
      deplacements.push(Math.hypot(dx, dy));
      if (Math.hypot(dx, dy) < 2) continue;

      var distA = distanceAuMasque(A.seg.masque, w, h);
      var r = Math.max(2, Math.round(0.06 * (A.seg.bbox.y1 - A.seg.bbox.y0)));
      var gA = A.seg.prep.grad, gB = B.seg.prep.grad;
      var seuilG = 0.5 * (median(Array.prototype.slice.call(gA, 0, 5000)) || 1);
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var i = y * w + x;
          if (A.seg.masque[i]) continue;
          if (distA[i] <= 0 || distA[i] > r) continue;
          if (gA[i] <= seuilG) continue;
          total++;
          var xm = x + dx, ym = y + dy;
          var bouge = false, immobile = false;
          if (xm > 0 && xm < w - 1 && ym > 0 && ym < h - 1 && gB[ym * w + xm] > seuilG) bouge = true;
          if (gB[i] > seuilG) immobile = true;
          if (bouge && !immobile) suit++;
          else if (immobile && !bouge) fixe++;
        }
      }
    }
    var depMedian = deplacements.length ? median(deplacements) : 0;
    if (depMedian < 2) return { ok: false, raison: 'tete_immobile', deplacementMedianPx: depMedian, methode: methode, limite: limite };

    var frizzReel = total > 0 ? suit / total : null;
    var partFond = total > 0 ? fixe / total : null;

    // --- 2. cohérence du reflet
    var amp = new Float32Array(w * h), minL = new Float32Array(w * h), maxL = new Float32Array(w * h);
    for (var q = 0; q < w * h; q++) { minL[q] = 1e9; maxL[q] = -1e9; }
    var commun = new Uint8Array(w * h);
    for (var q2 = 0; q2 < w * h; q2++) commun[q2] = 1;
    for (var m2 = 0; m2 < analyses.length; m2++) {
      var M = analyses[m2].seg.masque, P = analyses[m2].seg.prep;
      for (var q3 = 0; q3 < w * h; q3++) {
        if (!M[q3]) { commun[q3] = 0; continue; }
        if (P.L[q3] < minL[q3]) minL[q3] = P.L[q3];
        if (P.L[q3] > maxL[q3]) maxL[q3] = P.L[q3];
      }
    }
    var vals = [];
    for (var q4 = 0; q4 < w * h; q4++) {
      if (!commun[q4]) continue;
      amp[q4] = maxL[q4] - minL[q4];
      vals.push(amp[q4]);
    }
    var coherence = null;
    if (vals.length > 500) {
      var lisse = new Float32Array(w * h), vLisse = [];
      for (var y2 = 1; y2 < h - 1; y2++) {
        for (var x2 = 1; x2 < w - 1; x2++) {
          var i2 = y2 * w + x2;
          if (!commun[i2]) continue;
          var sm = 0, c2 = 0;
          for (var dy2 = -1; dy2 <= 1; dy2++) for (var dx2 = -1; dx2 <= 1; dx2++) {
            var j2 = i2 + dy2 * w + dx2;
            if (commun[j2]) { sm += amp[j2]; c2++; }
          }
          if (c2 >= 5) { lisse[i2] = sm / c2; vLisse.push(lisse[i2]); }
        }
      }
      var vb = std(vals), vl = std(vLisse);
      if (vb && vb > 0) coherence = clamp(0, 1, (vl * vl) / (vb * vb));
    }

    return {
      ok: true,
      imagesUtilisees: analyses.length,
      deplacementMedianPx: Math.round(depMedian * 10) / 10,
      frizzQuiSuitLaTete: frizzReel === null ? null : Math.round(frizzReel * 1000) / 1000,
      partDeBordsImmobiles: partFond === null ? null : Math.round(partFond * 1000) / 1000,
      coherenceDuReflet: coherence === null ? null : Math.round(coherence * 1000) / 1000,
      pixelsDeCouronneTestes: total,
      methode: methode, limite: limite
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.6  ORCHESTRATION DU MODE LECTURE FIBRE
  // ──────────────────────────────────────────────────────────────────────

  /**
   * État de validation des mesures propres à la v2. Même règle qu'en v1 : une mesure non
   * validée est calculée et publiée dans `mesures`, mais jamais présentée comme un
   * résultat. Rempli par le banc du 19/09/2026, voir catalogue-cheveux/ICE_V2_VALIDATION.md.
   */
  var VALIDATION_V2 = {
    priseMacro:        { validee: true,  accord: '148 macros reelles : 70 acceptees, 78 refusees et toutes pour la bonne raison (flou, trop loin, trop pres). Largeurs de fil mesurees 3 a 8 px, mediane 4,8 : exactement ce que l optique prevoit pour un telephone en mode macro.' },
    epaisseurFibre:    { validee: true,  accord: 'fils de largeur connue : +3 a +7 % de 3 a 48 px, refus en dessous de 2,5 px. Repetabilite sur 5 prises : ecart-type 0,9 px, soit 17 % de la valeur. En micrometres seulement si une reference d echelle est dans le cadre ET si l incertitude reste sous 30 %.' },
    fourches:          { validee: true,  accord: 'cas de controle a nombre de fourches connu : 0, 2, 4 et 8 injectees, 0, 2, 4 et 8 retrouvees. Repetabilite 15 %. Aucune verite terrain sur macros reelles.' },
    echelle:           { validee: true,  accord: 'carte bancaire et piece de 2 euros de taille connue : erreur de 0,8 a 1,7 % sur six cas. Sur 148 macros reelles, une reference n est presente que 20 fois : sans elle, aucune valeur en millimetres.' },
    regulariteBord:    { validee: false, accord: 'aucune verite terrain : rien ne prouve que l irregularite du bord mesure un cheveu abime. Ne mesure PAS la cuticule (ecailles de 0,5 a 1 um, hors de portee).' },
    speculaireTorche:  { validee: false, accord: 'sur paires fabriquees a part speculaire connue, l ORDRE est parfait (0 < 0,10 < 0,25 < 0,45 donnent 0,035 < 0,052 < 0,114 < 0,231) mais la valeur absolue est sous-estimee d un facteur 2 environ. Jamais teste sur de vraies paires torche allumee / eteinte : non publiable tant que ce test n est pas fait.' },
    sequenceMouvement: { validee: false, accord: 'implementee et raisonnee, jamais testee sur de vraies sequences : aucune video de chevelure en mouvement libre de droits dans le corpus.' },
    segmentationSansVisage: { validee: 'partiel', accord: '157 images sans visage : 155 segmentees (la v1 les refusait toutes). Sur les 27 annotees comme vraies chevelures : couleur 25/27, boucle 26/27, casse 27/27, frizz 22/27. MAIS la segmentation ne certifie pas qu elle regarde des cheveux : l indicateur construit pour cela atteint 43 % d exactitude sur 72 images annotees, il est renvoye a null.' },
    densiteRaie:       { validee: false, accord: 'toujours pas demontree : 2 detections sur 27 chevelures sans visage. Le corpus libre de droits ne contient AUCUNE vraie photo de raie de pres (les recherches ne rendent que des epingles en bronze et des bustes) : le test est impossible, pas concluant.' }
  };

  /**
   * runFibreScan(sources, options) -> Promise
   *
   * MODE LECTURE FIBRE. La personne approche le téléphone à quelques centimètres d'une
   * mèche tenue devant un fond sombre, torche allumée. L'écran appelle evaluerPriseMacro
   * en continu et déclenche quand c'est net ; ce scan-ci fait le reste.
   *
   * sources :
   *   - une ImageData (la macro torche allumée), OU
   *   - { macro, macroSansTorche, sequence: [{imageData, faceBox}] }
   *
   * options :
   *   - reference : 'auto' (défaut), 'ongle', ou mmParPx fourni directement
   *   - largeurOnglePx : requis si reference='ongle'
   *   - niveauReference : niveau de la surface blanche de référence, pour normaliser
   *     la part spéculaire (facultatif)
   *
   * Renvoie { version, mode:'lecture-fibre', ok, prise, echelle, mesures, limites, debug }.
   * Si la prise n'est pas bonne : ok=false et le message dit quoi corriger.
   */
  async function runFibreScan(sources, options) {
    options = options || {};
    var t0 = maintenant();
    var macro = sources && sources.macro ? sources.macro : sources;
    var img = versImageData(macro, options.captureLargeur || 1600);
    if (!img) {
      return { version: VERSION, mode: 'lecture-fibre', ok: false, raison: 'image_illisible',
               message: 'Image macro illisible.', mesures: null,
               debug: { dureeMs: Math.round(maintenant() - t0) } };
    }

    var prise = evaluerPriseMacro(img, { largeurTravail: options.largeurTravail });
    if (!prise.pret) {
      return {
        version: VERSION, mode: 'lecture-fibre', ok: false, raison: 'prise_macro_insuffisante',
        message: prise.message, prise: sansContexte(prise), mesures: null,
        limites: LIMITES_FIBRE,
        debug: { dureeMs: Math.round(maintenant() - t0) }
      };
    }

    var cm = prise.contexte;
    var echelle = detecterReferenceEchelle(img, {
      reference: options.reference, largeurOnglePx: options.largeurOnglePx,
      mmParPx: options.mmParPx
    });

    var mesures = {
      epaisseurFibre: mesureEpaisseurFibre(cm, echelle),
      fourches: mesureFourches(cm),
      regulariteBord: mesureRegulariteBord(cm)
    };

    var sansTorche = sources && sources.macroSansTorche
      ? versImageData(sources.macroSansTorche, options.captureLargeur || 1600) : null;
    mesures.speculaireTorche = sansTorche
      ? separerSpeculaire(img, sansTorche, { niveauReference: options.niveauReference,
                                             largeurTravail: options.largeurTravail })
      : mesureNulle('pas_de_prise_sans_torche',
          'double prise torche allumee / eteinte',
          'demande deux images de la meme scene prises dans la meme seconde');

    var sequence = null;
    if (sources && sources.sequence && sources.sequence.length) {
      sequence = analyserSequence(sources.sequence, { largeurTravail: options.largeurTravail });
    }

    return {
      version: VERSION, mode: 'lecture-fibre', ok: true,
      prise: sansContexte(prise),
      echelle: echelle,
      mesures: mesures,
      sequence: sequence,
      validation: VALIDATION_V2,
      limites: LIMITES_FIBRE,
      debug: {
        dureeMs: Math.round(maintenant() - t0),
        largeurTravail: cm.w,
        avertissement: 'toutes les valeurs sont calculees depuis les pixels ; celles dont validation.validee est false ne doivent pas etre presentees comme un resultat'
      }
    };
  }

  function sansContexte(prise) {
    var o = {};
    for (var k in prise) if (Object.prototype.hasOwnProperty.call(prise, k) && k !== 'contexte') o[k] = prise[k];
    return o;
  }

  var LIMITES_FIBRE = [
    'Un telephone nu en mode macro donne 3 a 5 pixels par cheveu : l incertitude sur le diametre est de 14 a 21 micrometres. Une bonnette macro clipsee descend a 4 micrometres.',
    'Sans carte bancaire ou piece de 2 euros dans le cadre, aucune valeur en millimetres n est publiee : la mesure reste en pixels.',
    'Ce mode ne lit PAS la cuticule : les ecailles font 0,5 a 1 micrometre, il faut un microscope electronique. Il lit la regularite du bord du fil a 20-100 micrometres.',
    'La part speculaire mesuree par double prise depend de la distance et de la puissance de la torche : elle est comparable a elle-meme dans le temps, pas entre deux personnes, sauf si une surface de reference est dans le cadre.'
  ];

  // ──────────────────────────────────────────────────────────────────────
  // 13.7  SEGMENTATION SANS VISAGE : chercher les CHEVEUX, pas la tête
  //
  //   Retour de terrain : les meilleures images pour la densité à la raie et pour la
  //   longueur sont le dessus du crâne, la nuque, le profil serré — et sur aucune il n'y
  //   a de visage. La v1 les refusait toutes (`visage_non_detecte`). Ici la chevelure est
  //   trouvée pour elle-même, par ce qui la caractérise vraiment : une TEXTURE ORIENTÉE.
  //
  //   Ce qui distingue des cheveux d'un mur, d'un pull ou d'une peau :
  //     - énergie de gradient élevée (des fils, pas une surface lisse) ;
  //     - ET orientation locale cohérente (les fils sont parallèles par paquets) ;
  //     - ET continuité spatiale (une masse, pas des taches).
  //   La peau est lisse : elle est écartée par l'énergie, pas par sa couleur — ce qui
  //   évite l'erreur de la v1, où le test de peau générique éliminait les cheveux
  //   châtains. Un pixel n'est écarté comme peau que s'il est à la fois de teinte peau
  //   ET lisse.
  //
  //   Le visage, quand il est là, ne sert plus qu'à UNE chose : donner l'échelle.
  //
  //   CE QUE CETTE SEGMENTATION NE SAIT PAS FAIRE, ET C'EST MESURÉ : elle ne certifie
  //   PAS que l'image contient des cheveux. Sur 72 images sans visage annotées, elle
  //   accepte aussi bien une chevelure qu'un buste en marbre, une épingle en bronze, un
  //   cordage tressé, un chat ou une façade de brique. L'indicateur de plausibilité
  //   construit pour trancher a été mesuré : 43 % d'exactitude, il ne sert à rien et il
  //   est renvoyé à null. Ce mode suppose donc que l'INTERFACE garantit le contenu
  //   (« cadrez votre chevelure ») : c'est une hypothèse de protocole, pas une mesure.
  // ──────────────────────────────────────────────────────────────────────

  function segmenterMasseCheveux(imageData, options) {
    options = options || {};
    var p = options.prep || preparerImage(imageData, options.largeurTravail || 450);
    var w = p.w, h = p.h, n = w * h;
    var B = Math.max(4, Math.round(w / 90));
    var nbx = Math.ceil(w / B), nby = Math.ceil(h / B);
    var coh = new Float32Array(nbx * nby), ener = new Float32Array(nbx * nby);
    var bL = new Float32Array(nbx * nby), ba = new Float32Array(nbx * nby), bb = new Float32Array(nbx * nby);

    for (var by = 0; by < nby; by++) {
      for (var bx = 0; bx < nbx; bx++) {
        var Jxx = 0, Jyy = 0, Jxy = 0, sL = 0, sa = 0, sb = 0, c = 0;
        for (var y = by * B; y < Math.min(h, (by + 1) * B); y++) {
          for (var x = bx * B; x < Math.min(w, (bx + 1) * B); x++) {
            var i = y * w + x;
            var gx = p.gx[i], gy = p.gy[i];
            Jxx += gx * gx; Jyy += gy * gy; Jxy += gx * gy;
            sL += p.L[i]; sa += p.a[i]; sb += p.b[i]; c++;
          }
        }
        var bi = by * nbx + bx;
        if (!c) continue;
        bL[bi] = sL / c; ba[bi] = sa / c; bb[bi] = sb / c;
        var tr = Jxx + Jyy;
        ener[bi] = tr / c;
        coh[bi] = tr > 1e-6 ? Math.sqrt((Jxx - Jyy) * (Jxx - Jyy) + 4 * Jxy * Jxy) / tr : 0;
      }
    }

    // Seuil d'énergie relatif à l'image : une image de chevelure n'a pas la même
    // dynamique qu'une image de mur. On prend le percentile 55 des blocs.
    var eners = Array.prototype.slice.call(ener);
    var seuilE = percentile(eners, 55);
    var candidats = new Uint8Array(nbx * nby), nCand = 0;
    for (var k = 0; k < nbx * nby; k++) {
      if (ener[k] > seuilE && ener[k] > 8 && coh[k] > 0.30) { candidats[k] = 1; nCand++; }
    }
    if (nCand < 6) {
      return { ok: false, raison: 'aucune_texture_de_cheveux', origine: 'texture', prep: p,
               note: 'aucune zone de l image n a la texture orientee d une chevelure : image lisse, floue, ou sujet absent.' };
    }

    // plus grande composante de blocs
    var comps = composantes(candidats, nbx, nby, 4);
    if (!comps.length) return { ok: false, raison: 'texture_eparpillee', origine: 'texture', prep: p,
      note: 'la texture orientee est eparpillee en petites taches : ce n est pas une masse de cheveux.' };
    comps.sort(function (A, Bq) { return Bq.length - A.length; });
    var principale = comps[0];

    // modèle chromatique de la masse
    var mL = [], ma = [], mb = [];
    for (var q = 0; q < principale.length; q++) {
      mL.push(bL[principale[q]]); ma.push(ba[principale[q]]); mb.push(bb[principale[q]]);
    }
    var cL = median(mL), ca = median(ma), cb = median(mb);
    var Lmin = (percentile(mL, 10) || cL) - 14, Lmax = (percentile(mL, 90) || cL) + 22;

    // fond appris sur le bord de l'image
    var fonds = modelesDeFond(p);

    // croissance au niveau pixel depuis les blocs retenus
    var masque = new Uint8Array(n), file = new Int32Array(n), tete = 0, queue = 0, total = 0;
    var seuilTexture = 0.35 * (percentile(Array.prototype.slice.call(p.grad), 70) || 1);
    function admissible(i) {
      var dCheveu = distanceCheveu(p, i, Lmin, Lmax, ca, cb);
      if (dCheveu > 26) return false;
      // peau = teinte peau ET lisse. Un cheveu chatain est de teinte peau mais texture.
      if ((p.peau[i] || estPeauLab(p.L[i], p.a[i], p.b[i])) && p.grad[i] < seuilTexture) return false;
      for (var z = 0; z < fonds.length; z++) {
        if (distanceLab(p, i, fonds[z].L, fonds[z].a, fonds[z].b) < dCheveu) return false;
      }
      return true;
    }
    for (var pb = 0; pb < principale.length; pb++) {
      var bidx = principale[pb];
      var byy = (bidx / nbx) | 0, bxx = bidx - byy * nbx;
      for (var yy = byy * B; yy < Math.min(h, (byy + 1) * B); yy++) {
        for (var xx = bxx * B; xx < Math.min(w, (bxx + 1) * B); xx++) {
          var ii = yy * w + xx;
          if (masque[ii] || !admissible(ii)) continue;
          masque[ii] = 1; file[queue++] = ii; total++;
        }
      }
    }
    var maxPix = Math.round(0.85 * n);
    while (tete < queue && total < maxPix) {
      var cur = file[tete++];
      var cy2 = (cur / w) | 0, cx2 = cur - cy2 * w;
      for (var d = 0; d < 4; d++) {
        var nx = cx2 + (d === 0 ? 1 : d === 1 ? -1 : 0);
        var ny = cy2 + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        var ni = ny * w + nx;
        if (masque[ni] || !admissible(ni)) continue;
        masque[ni] = 1; file[queue++] = ni; total++;
      }
    }

    var couverture = total / n;
    if (couverture < 0.03) {
      return { ok: false, raison: 'masse_de_cheveux_trop_petite', origine: 'texture', prep: p,
               couverture: couverture,
               note: 'la masse de cheveux trouvee occupe moins de 3 % de l image : se rapprocher ou recadrer sur la chevelure.' };
    }

    var bbox = { x0: w, y0: h, x1: 0, y1: 0 }, contactBord = 0, bordTotal = 2 * (w + h);
    for (var y3 = 0; y3 < h; y3++) {
      for (var x3 = 0; x3 < w; x3++) {
        if (!masque[y3 * w + x3]) continue;
        if (x3 < bbox.x0) bbox.x0 = x3; if (x3 > bbox.x1) bbox.x1 = x3;
        if (y3 < bbox.y0) bbox.y0 = y3; if (y3 > bbox.y1) bbox.y1 = y3;
        if (x3 === 0 || y3 === 0 || x3 === w - 1 || y3 === h - 1) contactBord++;
      }
    }

    var cohMoy = 0;
    for (var cc = 0; cc < principale.length; cc++) cohMoy += coh[principale[cc]];
    cohMoy /= principale.length;

    // PLAUSIBILITÉ « CHEVEU ».
    // Une texture orientée ne suffit pas : testée sur des images reelles sans visage, la
    // segmentation acceptait une epingle en os, un dessin au trait, un vetement raye et
    // une barriere de stade. Ce qui distingue vraiment une chevelure, c'est qu'elle est
    // faite de NOMBREUX FILAMENTS FINS : a l'interieur du masque, les crêtes de contraste
    // local font quelques pixels de large, pas trente. On mesure donc :
    //   - la largeur mediane des crêtes internes (fine = cheveu, epaisse = objet plein) ;
    //   - leur densite (longueur de crête par unite de surface) ;
    //   - la diversite d'orientation des blocs (une chevelure tourne, un objet non).
    var plaus = (function () {
      var moyL = 0, cnt = 0;
      for (var i0 = 0; i0 < n; i0++) if (masque[i0]) { moyL += p.L[i0]; cnt++; }
      if (!cnt) return null;
      moyL /= cnt;
      // crêtes = pixels du masque nettement plus clairs que la moyenne locale
      var cre = new Uint8Array(n), nc = 0;
      for (var y4 = 2; y4 < h - 2; y4++) {
        for (var x4 = 2; x4 < w - 2; x4++) {
          var i4 = y4 * w + x4;
          if (!masque[i4]) continue;
          var voisin = (p.L[i4 - 2] + p.L[i4 + 2] + p.L[i4 - 2 * w] + p.L[i4 + 2 * w]) / 4;
          if (p.L[i4] > voisin + 2.5) { cre[i4] = 1; nc++; }
        }
      }
      if (nc < 200) return { largeurCretePx: null, densiteCretes: 0, diversiteOrientation: null, valeur: 0 };
      var dInt = distanceInterne(cre, w, h);
      var sq2 = squelettiser(cre, w, h);
      var larg = [];
      for (var k4 = 0; k4 < sq2.pixels.length; k4++) {
        var lw2 = 2 * dInt[sq2.pixels[k4]];
        if (lw2 >= 1 && lw2 <= 60) larg.push(lw2);
      }
      var lm = larg.length ? median(larg) : null;
      var densite = sq2.pixels.length / Math.max(1, total);
      // diversite d'orientation
      var hist = new Float64Array(12), ht = 0;
      for (var b5 = 0; b5 < principale.length; b5++) {
        var bi5 = principale[b5];
        if (coh[bi5] < 0.3) continue;
        var by5 = (bi5 / nbx) | 0, bx5 = bi5 - by5 * nbx;
        var Jxx5 = 0, Jyy5 = 0, Jxy5 = 0;
        for (var y5 = by5 * B; y5 < Math.min(h, (by5 + 1) * B); y5++) {
          for (var x5 = bx5 * B; x5 < Math.min(w, (bx5 + 1) * B); x5++) {
            var i5 = y5 * w + x5;
            Jxx5 += p.gx[i5] * p.gx[i5]; Jyy5 += p.gy[i5] * p.gy[i5]; Jxy5 += p.gx[i5] * p.gy[i5];
          }
        }
        var th = 0.5 * Math.atan2(2 * Jxy5, Jxx5 - Jyy5);
        var bin5 = Math.floor((((th % Math.PI) + Math.PI) % Math.PI) / Math.PI * 12) % 12;
        hist[bin5] += coh[bi5]; ht += coh[bi5];
      }
      var ent = 0;
      for (var e5 = 0; e5 < 12; e5++) { if (hist[e5] <= 0) continue; var pr5 = hist[e5] / ht; ent -= pr5 * Math.log(pr5); }
      var entN = clamp(0, 1, ent / Math.log(12));
      var nFin = lm === null ? 0 : clamp(0, 1, (9 - lm) / 6);        // <=3 px : tres fin
      var nDens = clamp(0, 1, densite / 0.06);
      var nDiv = clamp(0, 1, (entN - 0.35) / 0.45);
      // RÉSULTAT DE VALIDATION, ET IL EST NÉGATIF.
      // Sur 72 images sans visage annotées à la main (27 vraies chevelures, 45 autres
      // choses : bustes en marbre, épingles en bronze, cordages tressés, chats, façades,
      // dentelle), cet indicateur n'a AUCUN pouvoir de séparation : sa médiane vaut 1,00
      // dans les deux groupes, et le meilleur seuil possible donne 43 % d'exactitude,
      // c'est-à-dire moins bien que répondre toujours « ce n'est pas une chevelure ».
      // On garde donc les trois sous-indicateurs (ce sont de vraies mesures) mais la
      // conclusion est NULL : le moteur ne sait pas certifier qu'il regarde des cheveux.
      return {
        largeurCretePx: lm === null ? null : Math.round(lm * 100) / 100,
        densiteCretes: Math.round(densite * 10000) / 10000,
        diversiteOrientation: Math.round(entN * 1000) / 1000,
        indiceBrut: Math.round(Math.pow(nFin * nDens * nDiv, 1 / 3) * 1000) / 1000,
        valeur: null,
        raison: 'indicateur mesure sur 72 images annotees : 43 % d exactitude, il ne separe pas une chevelure d un buste en marbre ou d un cordage. Ne pas l utiliser.'
      };
    })();

    var confiance = clamp(0, 1,
      clamp(0, 1, (cohMoy - 0.30) / 0.35) *
      clamp(0.3, 1, 1 - contactBord / bordTotal) *
      clamp(0.3, 1, couverture / 0.10));

    return {
      ok: true, origine: 'texture',
      masque: masque, w: w, h: h, prep: p, bbox: bbox,
      taille: total, couverture: couverture,
      modele: { L: cL, a: ca, b: cb, Lmin: Lmin, Lmax: Lmax, seuil: 26, gradGraine: percentile(Array.prototype.slice.call(p.grad), 70) },
      graine: { partPeau: 0, partFond: 0, pixels: principale.length * B * B },
      contactBord: contactBord / bordTotal,
      ratioTexture: 1, purete: 1,
      coherenceMoyenne: Math.round(cohMoy * 1000) / 1000,
      plausibiliteCheveux: plaus,
      cadrage: null,                    // pas de visage : pas d'echelle
      alertes: (cohMoy < 0.36 ? ['texture_peu_orientee'] : []),
      confiance: Math.round(confiance * 100) / 100,
      geo: null
    };
  }

  /** Jusqu'à trois couleurs dominantes du bord de l'image (modèle de fond). */
  function modelesDeFond(p) {
    var w = p.w, h = p.h, ep = Math.max(2, Math.round(0.03 * Math.min(w, h)));
    var bins = {}, tot = 0;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        if (y >= ep && y < h - ep && x >= ep && x < w - ep) { x = w - ep - 1; continue; }
        var i = y * w + x;
        var kb = (Math.round(p.L[i] / 8) * 1000000) + (Math.round((p.a[i] + 128) / 8) * 1000) + Math.round((p.b[i] + 128) / 8);
        (bins[kb] = bins[kb] || { n: 0, L: 0, a: 0, b: 0 });
        bins[kb].n++; bins[kb].L += p.L[i]; bins[kb].a += p.a[i]; bins[kb].b += p.b[i];
        tot++;
      }
    }
    var liste = [];
    for (var kk in bins) if (Object.prototype.hasOwnProperty.call(bins, kk)) liste.push(bins[kk]);
    liste.sort(function (A, Bq) { return Bq.n - A.n; });
    var out = [];
    for (var z = 0; z < Math.min(3, liste.length); z++) {
      if (liste[z].n < 0.08 * tot) break;
      out.push({ L: liste[z].L / liste[z].n, a: liste[z].a / liste[z].n, b: liste[z].b / liste[z].n });
    }
    return out;
  }

  // ──────────────────────────────────────────────────────────────────────
  // 13.8  LECTURE MULTI-POSES
  //
  //   L'interface guide plusieurs prises. Chaque mesure est alors lue LÀ OÙ ELLE EST LA
  //   PLUS FIABLE, et le résultat dit toujours de quelle pose elle vient.
  //
  //   Table de préférence (l'ordre compte, on prend la première pose qui donne une
  //   valeur non nulle) :
  //     densiteRaie     : raie > dessus > face
  //     couleur         : face > dessus > profil
  //     boucle          : profil > face > dessus
  //     frizz           : profil > face
  //     longueur        : profil > face
  //     epaisseurFibre  : macro seulement
  //     fourches        : macro seulement
  //     regulariteBord  : macro seulement
  //     racinesGrasses  : raie > dessus > face
  //     secheresse      : face > profil
  //     cassePointes    : profil > face
  // ──────────────────────────────────────────────────────────────────────

  var POSES_CONNUES = ['face', 'gauche', 'droite', 'dessus', 'nuque', 'raie', 'macro'];

  var PREFERENCE_POSE = {
    densiteRaie:    ['raie', 'dessus', 'face'],
    couleur:        ['face', 'dessus', 'gauche', 'droite', 'nuque'],
    boucle:         ['gauche', 'droite', 'nuque', 'face', 'dessus'],
    frizz:          ['gauche', 'droite', 'face'],
    longueur:       ['gauche', 'droite', 'nuque', 'face'],
    racinesGrasses: ['raie', 'dessus', 'face'],
    secheresse:     ['face', 'gauche', 'droite'],
    cassePointes:   ['gauche', 'droite', 'nuque', 'face'],
    brillance:      ['face', 'gauche', 'droite'],
    epaisseurFibre: ['macro'],
    fourches:       ['macro'],
    regulariteBord: ['macro'],
    speculaireTorche: ['macro']
  };

  /**
   * LONGUEUR APPARENTE — hauteur de la masse de cheveux.
   *
   * Avec un visage dans l'image, elle est exprimée en HAUTEURS DE VISAGE, ce qui est une
   * échelle réelle (un visage adulte fait 18 à 23 cm du menton au sommet du crâne) ;
   * sans visage, elle reste un rapport à la largeur de la masse et n'est comparable
   * qu'à elle-même.
   *
   * LIMITE : une chevelure qui sort du cadre est tronquée, et le moteur ne peut pas le
   * savoir. Si la masse touche le bord bas de l'image, la mesure est refusée.
   */
  function mesureLongueur(ctx) {
    var methode = 'hauteur de la masse de cheveux rapportee a la hauteur du visage quand il est present, sinon a la largeur de la masse';
    var limite = 'refusee si la chevelure touche le bord bas de l image (coupee par le cadre) ; ne distingue pas une queue de cheval de cheveux laches';
    var bb = ctx.bbox, w = ctx.w, h = ctx.h;
    var toucheBas = false;
    for (var x = 0; x < w; x++) if (ctx.m[(h - 1) * w + x]) { toucheBas = true; break; }
    if (toucheBas) return mesureNulle('chevelure_coupee_par_le_bas_du_cadre', methode, limite);
    var hauteur = bb.y1 - bb.y0, largeur = Math.max(1, bb.x1 - bb.x0);
    var geo = ctx.seg.geo;
    if (geo && geo.box && geo.box.height) {
      var hv = geo.box.height / ctx.p.pas;
      return mesure(Math.round(hauteur / hv * 100) / 100, 'hauteurs de visage', methode, limite, 'faible', {
        hauteurMassePx: hauteur, hauteurVisagePx: Math.round(hv),
        note: 'un visage adulte fait 18 a 23 cm : multiplier par cette plage pour un ordre de grandeur en centimetres'
      });
    }
    return mesure(Math.round(hauteur / largeur * 100) / 100, 'rapport hauteur/largeur de la masse (relatif)',
      methode, limite, 'faible', { hauteurMassePx: hauteur, largeurMassePx: largeur,
        note: 'aucun visage dans l image : aucune echelle, valeur relative uniquement' });
  }

  /**
   * lectureMultiPoses(poses, options) -> Promise
   *
   * poses : [{ pose, imageData, faceBox, landmarks, macroSansTorche, masqueExterne }]
   *   masqueExterne : { data, largeur, hauteur, seuil } du masque de CETTE pose ;
   *   a defaut, options.masqueExterne s'applique a toutes.
   *   pose ∈ face | gauche | droite | dessus | nuque | raie | macro
   *
   * Renvoie une lecture consolidée : pour chaque mesure, la valeur retenue et LA POSE
   * D'OÙ ELLE VIENT, plus le détail par pose.
   */
  async function lectureMultiPoses(poses, options) {
    options = options || {};
    var t0 = maintenant();
    if (!poses || !poses.length) {
      return { version: VERSION, mode: 'multi-poses', ok: false, raison: 'aucune_pose_fournie' };
    }

    var parPose = {}, echecs = [];
    for (var i = 0; i < poses.length; i++) {
      var entree = poses[i];
      var nom = entree.pose || 'face';
      if (POSES_CONNUES.indexOf(nom) === -1) { echecs.push({ pose: nom, raison: 'pose_inconnue' }); continue; }
      var img = versImageData(entree.imageData || entree.image, options.captureLargeur || 1400);
      if (!img) { echecs.push({ pose: nom, raison: 'image_illisible' }); continue; }

      if (nom === 'macro') {
        var rf = await runFibreScan({ macro: img, macroSansTorche: entree.macroSansTorche },
                                    { largeurTravail: options.largeurTravailMacro });
        parPose[nom] = { type: 'fibre', ok: rf.ok, resultat: rf };
        if (!rf.ok) echecs.push({ pose: nom, raison: rf.raison, message: rf.message });
        continue;
      }
      var geo = entree.landmarks || entree.faceBox || null;
      // Le masque de la pose passe avant celui des options : chaque prise a le sien,
      // celui de l'image qu'elle a envoyee et d'aucune autre.
      var r = analyseFrame(img, geo, { largeurTravail: options.largeurTravail,
                                       masqueExterne: entree.masqueExterne || options.masqueExterne || null });
      if (!r.ok) { echecs.push({ pose: nom, raison: r.raison, message: r.note }); parPose[nom] = { type: 'face', ok: false, resultat: r }; continue; }
      r.mesures.longueur = mesureLongueur(r.contexte);
      parPose[nom] = {
        type: 'face', ok: true, resultat: r,
        origineMasque: r.segmentation.origine || 'visage',
        echelleVisage: !!(r.segmentation.geo && r.segmentation.geo.box)
      };
    }

    // consolidation
    var consolidees = {}, manquantes = [];
    for (var cle in PREFERENCE_POSE) {
      if (!Object.prototype.hasOwnProperty.call(PREFERENCE_POSE, cle)) continue;
      var ordre = PREFERENCE_POSE[cle], retenu = null;
      for (var o = 0; o < ordre.length; o++) {
        var pp = parPose[ordre[o]];
        if (!pp || !pp.ok) continue;
        var m = pp.type === 'fibre' ? (pp.resultat.mesures || {})[cle] : (pp.resultat.mesures || {})[cle];
        if (m && m.valeur !== null && m.valeur !== undefined) {
          retenu = { valeur: m.valeur, unite: m.unite, fiabilite: m.fiabilite, poseUtilisee: ordre[o],
                     detail: m };
          break;
        }
      }
      if (retenu) consolidees[cle] = retenu;
      else manquantes.push({ mesure: cle, raison: 'aucune pose ne l a donnee',
                             posesEssayees: ordre.filter(function (x) { return !!parPose[x]; }) });
    }

    var posesOk = Object.keys(parPose).filter(function (k) { return parPose[k].ok; });
    return {
      version: VERSION, mode: 'multi-poses', ok: posesOk.length > 0,
      posesRecues: poses.map(function (x) { return x.pose; }),
      posesExploitables: posesOk,
      echecs: echecs,
      mesures: consolidees,
      manquantes: manquantes,
      detailParPose: parPose,
      preference: PREFERENCE_POSE,
      limites: [
        'Chaque mesure vient d une seule pose, celle jugee la plus fiable pour elle : le resultat n est pas une moyenne.',
        'Sans visage dans aucune pose, aucune mesure n a d echelle reelle : longueur et densite restent relatives.',
        'Le moteur ne verifie pas que les poses montrent la meme personne.'
      ],
      debug: { dureeMs: Math.round(maintenant() - t0) }
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 12. API PUBLIQUE
  // ════════════════════════════════════════════════════════════════════════

  var API = {
    version: VERSION,
    // entrées principales — deux modes
    runHairScan: runHairScan,          // lecture rapide : photo de face
    runFibreScan: runFibreScan,        // lecture experte : macro guidee sur une meche
    lectureMultiPoses: lectureMultiPoses,   // lecture consolidee sur plusieurs poses
    segmenterMasseCheveux: segmenterMasseCheveux,  // chevelure trouvee SANS visage
    mesureLongueur: mesureLongueur,
    POSES_CONNUES: POSES_CONNUES, PREFERENCE_POSE: PREFERENCE_POSE,
    evaluerPriseMacro: evaluerPriseMacro,
    detecterReferenceEchelle: detecterReferenceEchelle,
    separerSpeculaire: separerSpeculaire,
    analyserSequence: analyserSequence,
    construireContexteMacro: construireContexteMacro,
    mesureEpaisseurFibre: mesureEpaisseurFibre,
    mesureFourches: mesureFourches,
    mesureRegulariteBord: mesureRegulariteBord,
    seuilOtsu: seuilOtsu, squelettiser: squelettiser, distanceInterne: distanceInterne,
    enveloppeConvexe: enveloppeConvexe, rectangleMinimal: rectangleMinimal,
    VALIDATION_V2: VALIDATION_V2, LIMITES_FIBRE: LIMITES_FIBRE, MACRO: MACRO,
    analyseFrame: analyseFrame,
    segmentCheveux: segmentCheveux,
    segmentDepuisMasqueExterne: segmentDepuisMasqueExterne,   // masque fourni (MediaPipe hair_segmenter)
    composerRoutine: composerRoutine,
    regionPays: regionPays, codePaysFiche: codePaysFiche, indexFichesMarques: indexFichesMarques,
    EUROPE_HORS_FR: EUROPE_HORS_FR, UNIVERS_CONNUS: UNIVERS_CONNUS,
    // questionnaire
    QUESTIONS: QUESTIONS,
    QUESTIONS_FACULTATIVES: QUESTIONS_FACULTATIVES,
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
    rgbToLab: rgbToLab, labToLCh: labToLCh, estPeau: estPeau, estPeauLab: estPeauLab,
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
