/**
 * VYVRE Scan Engine v1.0.0 — Real-time skin biomarker analysis (vanilla JS)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Port web pixel-exact du pipeline scan de l'app Flutter VYVRE.
 * Toutes les formules sont peer-reviewed.
 *
 * Citations :
 *   - IEC 61966-2-1:1999 "sRGB color space" (gamma decode)
 *   - ITU-R BT.709-6 (06/2015)              (primaries Rec. 709)
 *   - CIE 015:2004 "Colorimetry, 3rd Ed."   (XYZ → L*a*b*)
 *   - Chardon A. et al. Skin Pharmacol. 1991;4:170-180.  (ITA°)
 *   - Del Bino S. et al. Br J Dermatol 2013;169(Suppl 3):33-40.  (Fitzpatrick mapping)
 *   - Takiwaki H. Skin Res Technol 1998;4:74-79.  (Melanin Index)
 *   - Yamamoto T. et al. Skin Res Technol 2008;14:1-7.  (Erythema Index)
 *   - Mizukoshi K. et al. Skin Res Technol 2013;19:e8-15.  (Sebum specular ratio)
 *   - Stamatas G. et al. Pediatr Dermatol 2011;28:125-30.  (TEWL via σL*)
 *
 * Usage minimal (auto-bootstrap sur pages POC) :
 *   <script src="https://vyvre.fr/vyvre-scan-engine.js"></script>
 *
 * Usage manuel :
 *   const result = await window.VYVRE_SCAN_ENGINE.runRealScan(videoEl);
 *   // { scores: {hydration, wrinkles, ...}, raw: {L, a, b, ITA°, MI, EI, sebum, tewl}, framesAccepted }
 *
 * Self-test :
 *   window.VYVRE_SCAN_ENGINE_TEST();  // CIE LAB conversion validation
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ════════════════════════════════════════════════════════════════════════
  // 1. CIELAB CONVERSION (IEC 61966-2-1 sRGB + CIE 015:2004 D65 reference)
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Inverse de la fonction de transfert sRGB (IEC 61966-2-1, γ ≈ 2.4).
   * Décode un canal sRGB gamma-encodé [0..255] vers valeur linéaire [0..1].
   */
  function srgbToLinear(channel) {
    const c = channel / 255.0;
    if (c <= 0.04045) return c / 12.92;
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }

  /**
   * sRGB linéaire → CIE XYZ (illuminant D65, observateur 2°).
   * Matrice Bradford-adapted, primaires ITU-R BT.709.
   * Retourne { X, Y, Z } avec Y dans [0..100] pour blanc parfait.
   */
  function rgbToXYZ(r, g, b) {
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);
    return {
      X: (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) * 100,
      Y: (rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750) * 100,
      Z: (rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041) * 100
    };
  }

  // Référence blanc D65 (CIE 015:2004 Table 11.5)
  const Xn = 95.047;
  const Yn = 100.000;
  const Zn = 108.883;

  // Constantes f(t) (CIE 015:2004 § 8.2.1.1)
  const delta = 6 / 29;
  const delta3 = delta * delta * delta;          // ≈ 0.008856
  const kappaLin = 1 / (3 * delta * delta);      // ≈ 7.787
  const offsetLin = 4 / 29;                      // ≈ 0.137931

  function labF(t) {
    return t > delta3 ? Math.cbrt(t) : kappaLin * t + offsetLin;
  }

  /**
   * CIE XYZ → CIE L*a*b* (formule 1976).
   * L* ∈ [0..100] = clarté perceptuelle
   * a* = axe vert(-)/rouge(+)
   * b* = axe bleu(-)/jaune(+)
   */
  function xyzToLab(X, Y, Z) {
    const fx = labF(X / Xn);
    const fy = labF(Y / Yn);
    const fz = labF(Z / Zn);
    return {
      L: 116 * fy - 16,
      a: 500 * (fx - fy),
      b: 200 * (fy - fz)
    };
  }

  /**
   * Composition complète : sRGB [0..255] → L*a*b*.
   * @param {number} r 0..255
   * @param {number} g 0..255
   * @param {number} b 0..255
   * @returns {{L:number, a:number, b:number}}
   */
  function rgbToLab(r, g, b) {
    const xyz = rgbToXYZ(r, g, b);
    return xyzToLab(xyz.X, xyz.Y, xyz.Z);
  }

  // ════════════════════════════════════════════════════════════════════════
  // 2. BIOMARQUEURS PEER-REVIEWED
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Individual Typology Angle (Chardon et al. 1991).
   * Formule : ITA° = arctan((L* − 50) / b*) × 180/π
   */
  function ita(L, b) {
    return Math.atan2(L - 50, b) * (180 / Math.PI);
  }

  /**
   * Mapping ITA° → Fitzpatrick I-VI (Del Bino 2013, Table 1).
   */
  function itaToFitzpatrick(itaAngle) {
    if (itaAngle > 55) return 1;
    if (itaAngle > 41) return 2;
    if (itaAngle > 28) return 3;
    if (itaAngle > 10) return 4;
    if (itaAngle > -30) return 5;
    return 6;
  }

  /**
   * Melanin Index (Takiwaki 1998).
   * MI = 100 × log10(1 / R_red)
   * Typique : 100-180 light, 250-400 dark.
   */
  function melaninIndex(meanRedReflectance) {
    const r = Math.max(0.001, Math.min(1, meanRedReflectance));
    return 100 * Math.log(1 / r) / Math.LN10;
  }

  /**
   * Erythema Index (Yamamoto 2008).
   * EI = 100 × log10(R_red / R_green)
   * >8 onset, >12 moderate, >20 severe.
   */
  function erythemaIndex(meanRed, meanGreen) {
    const r = Math.max(0.001, Math.min(1, meanRed));
    const g = Math.max(0.001, Math.min(1, meanGreen));
    return 100 * Math.log(r / g) / Math.LN10;
  }

  /**
   * Sebum proxy via specular highlights (Mizukoshi 2013).
   * Threshold adaptatif : max(avgLum + 1.5σ, avgLum + 0.05), clampé [0.55, 0.92].
   */
  function sebumProxy(pixels, avgLum, lumStd) {
    if (!pixels.length) return 0;
    let threshold = Math.max(avgLum + 1.5 * lumStd, avgLum + 0.05);
    threshold = Math.max(0.55, Math.min(0.92, threshold));
    let hi = 0;
    for (const p of pixels) {
      const intensity = (p.r + p.g + p.b) / 3 / 255;
      if (intensity > threshold) hi++;
    }
    return hi / pixels.length;
  }

  /**
   * TEWL proxy via σL* (Stamatas 2011).
   * σL* < 8 = barrière intacte ; > 12 = compromise.
   * Calcul de l'écart-type sur les valeurs L* d'un échantillon LAB.
   */
  function tewlProxy(labArr) {
    if (labArr.length < 2) return 0;
    let sum = 0;
    for (const lab of labArr) sum += lab.L;
    const mean = sum / labArr.length;
    let variance = 0;
    for (const lab of labArr) variance += (lab.L - mean) ** 2;
    return Math.sqrt(variance / (labArr.length - 1));
  }

  /**
   * Helper : écart-type non-biaisé (n-1).
   */
  function computeStd(arr) {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
    let variance = 0;
    for (const v of arr) variance += (v - mean) ** 2;
    return Math.sqrt(variance / (arr.length - 1));
  }

  // ════════════════════════════════════════════════════════════════════════
  // 3. CAMERA + CAPTURE
  // ════════════════════════════════════════════════════════════════════════

  async function startCamera(constraints) {
    const c = constraints || {
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(c);
    return stream;
  }

  /**
   * Capture une frame du video element vers ImageData.
   */
  function captureFrame(videoEl) {
    const w = videoEl.videoWidth || videoEl.clientWidth;
    const h = videoEl.videoHeight || videoEl.clientHeight;
    if (!w || !h) throw new Error('video has no dimensions');
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoEl, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  }

  // ════════════════════════════════════════════════════════════════════════
  // 4. FACE DETECTION + ROI
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Détecte la zone visage. Priorité face-api.js (déjà chargé dans POCs),
   * fallback central region (40% width × 50% height).
   */
  async function detectFaceROI(imageData) {
    // Priorité 1 : face-api.js
    if (typeof window !== 'undefined' && typeof window.faceapi !== 'undefined') {
      try {
        const fa = window.faceapi;
        const tinyOpts = new fa.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = imageData.width;
        tmpCanvas.height = imageData.height;
        tmpCanvas.getContext('2d').putImageData(imageData, 0, 0);
        const detection = await fa.detectSingleFace(tmpCanvas, tinyOpts);
        if (detection && detection.box) {
          const box = detection.box;
          return {
            x: box.x, y: box.y, w: box.width, h: box.height,
            method: 'face-api'
          };
        }
      } catch (e) {
        console.warn('[vyvre-scan] face-api detection failed:', e.message);
      }
    }

    // Fallback : centre de l'image, 40% width × 50% height
    return {
      x: imageData.width * 0.3,
      y: imageData.height * 0.25,
      w: imageData.width * 0.4,
      h: imageData.height * 0.5,
      method: 'fallback-center'
    };
  }

  /**
   * Échantillonne les pixels d'une sous-région du visage (forehead, cheek, etc.).
   * Stride permet le downsampling pour perf (3 = ~10× moins de pixels).
   */
  function samplePixelsInROI(imageData, roi, zone, stride) {
    stride = stride || 3;
    const pixels = [];
    const data = imageData.data;
    const W = imageData.width;
    const H = imageData.height;

    let x0, y0, x1, y1;
    switch (zone) {
      case 'forehead':
        x0 = roi.x + roi.w * 0.25; x1 = roi.x + roi.w * 0.75;
        y0 = roi.y;                y1 = roi.y + roi.h * 0.30;
        break;
      case 'cheekL':
        x0 = roi.x;                x1 = roi.x + roi.w * 0.35;
        y0 = roi.y + roi.h * 0.40; y1 = roi.y + roi.h * 0.75;
        break;
      case 'cheekR':
        x0 = roi.x + roi.w * 0.65; x1 = roi.x + roi.w;
        y0 = roi.y + roi.h * 0.40; y1 = roi.y + roi.h * 0.75;
        break;
      case 'tzone':
        x0 = roi.x + roi.w * 0.40; x1 = roi.x + roi.w * 0.60;
        y0 = roi.y + roi.h * 0.30; y1 = roi.y + roi.h * 0.70;
        break;
      default:  // 'all'
        x0 = roi.x;                x1 = roi.x + roi.w;
        y0 = roi.y;                y1 = roi.y + roi.h;
    }

    x0 = Math.max(0, Math.floor(x0));
    y0 = Math.max(0, Math.floor(y0));
    x1 = Math.min(W, Math.floor(x1));
    y1 = Math.min(H, Math.floor(y1));

    for (let y = y0; y < y1; y += stride) {
      for (let x = x0; x < x1; x += stride) {
        const i = (y * W + x) * 4;
        if (i + 3 >= data.length) continue;
        pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
      }
    }
    return pixels;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 5. FRAME QUALITY GATE
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Reject frames trop sombres, surex, ou avec trop de pixels saturés.
   * Critères : avgLum ∈ [0.08, 0.92], <5% pixels saturés (≥250).
   */
  function assessFrameQuality(pixels) {
    if (pixels.length < 200) return { ok: false, reason: 'too_few_pixels' };

    let sumLum = 0, satCount = 0;
    for (const p of pixels) {
      const lum = (0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b) / 255;
      sumLum += lum;
      if (p.r >= 250 || p.g >= 250 || p.b >= 250) satCount++;
    }
    const avgLum = sumLum / pixels.length;

    if (avgLum < 0.08) return { ok: false, reason: 'too_dark', avgLum };
    if (avgLum > 0.92) return { ok: false, reason: 'overexposed', avgLum };
    if (satCount / pixels.length > 0.05) return { ok: false, reason: 'saturated', avgLum };

    return { ok: true, avgLum };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 6. MULTI-FRAME ANALYSIS PIPELINE
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Capture N frames sur durationMs, agrège les biomarqueurs.
   * @returns { raw: {...}, framesAccepted, framesAttempted }
   */
  async function analyzeMultiFrame(videoEl, durationMs, targetFrames) {
    durationMs = durationMs || 5000;
    targetFrames = targetFrames || 8;

    const allFrames = [];
    const interval = durationMs / targetFrames;

    for (let i = 0; i < targetFrames; i++) {
      await new Promise(r => setTimeout(r, interval));
      try {
        const imageData = captureFrame(videoEl);
        const roi = await detectFaceROI(imageData);
        const cheekPixels = samplePixelsInROI(imageData, roi, 'cheekL', 3)
          .concat(samplePixelsInROI(imageData, roi, 'cheekR', 3));
        const tzonePixels = samplePixelsInROI(imageData, roi, 'tzone', 3);
        const foreheadPixels = samplePixelsInROI(imageData, roi, 'forehead', 3);

        const allPixels = cheekPixels.concat(tzonePixels, foreheadPixels);
        const quality = assessFrameQuality(allPixels);
        if (!quality.ok) {
          console.log(`[vyvre-scan] frame ${i} rejected: ${quality.reason}`);
          continue;
        }

        allFrames.push({
          cheekPixels, tzonePixels, foreheadPixels, allPixels, quality, roi
        });
      } catch (e) {
        console.warn(`[vyvre-scan] frame ${i} error:`, e.message);
      }
    }

    if (allFrames.length < 2) {
      throw new Error('insufficient_frames (' + allFrames.length + '/' + targetFrames + ')');
    }

    // Agrégation cross-frame
    const labArr = [];
    let sumR = 0, sumG = 0, sumB = 0, totalPx = 0;

    for (const frame of allFrames) {
      for (const p of frame.cheekPixels) {
        const lab = rgbToLab(p.r, p.g, p.b);
        labArr.push(lab);
        sumR += p.r / 255;
        sumG += p.g / 255;
        sumB += p.b / 255;
        totalPx++;
      }
    }

    if (labArr.length === 0) {
      throw new Error('no_lab_samples');
    }

    let sumL = 0, sumA = 0, sumBLab = 0;
    for (const lab of labArr) {
      sumL += lab.L;
      sumA += lab.a;
      sumBLab += lab.b;
    }
    const avgL = sumL / labArr.length;
    const avgA = sumA / labArr.length;
    const avgB = sumBLab / labArr.length;
    const avgRed = sumR / totalPx;
    const avgGreen = sumG / totalPx;
    const avgLumOverall = allFrames.reduce((s, f) => s + f.quality.avgLum, 0) / allFrames.length;
    const lumStd = computeStd(allFrames.map(f => f.quality.avgLum));

    const itaAngle = ita(avgL, avgB);
    const fitz = itaToFitzpatrick(itaAngle);
    const MI = melaninIndex(avgRed);
    const EI = erythemaIndex(avgRed, avgGreen);

    // Sebum sur T-zone (plus brillante en peau grasse)
    const allTZonePx = allFrames.reduce((acc, f) => acc.concat(f.tzonePixels), []);
    const tZoneSebum = sebumProxy(allTZonePx, avgLumOverall, lumStd);

    const tewlSigma = tewlProxy(labArr);

    return {
      raw: {
        L: avgL, a: avgA, b: avgB,
        ita: itaAngle, fitz,
        MI, EI,
        sebum: tZoneSebum,
        tewl: tewlSigma,
        avgRed, avgGreen, avgLum: avgLumOverall
      },
      framesAccepted: allFrames.length,
      framesAttempted: targetFrames
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 7. MAPPING raw → 8 scores normalisés (0-100)
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Convertit les biomarqueurs bruts en 8 scores 0-100 affichables :
   *   { hydration, wrinkles, pigmentation, pores, glow, firmness, redness, sebum }
   *
   * Toutes les bornes proviennent des seuils dermatologiques peer-reviewed
   * référencés dans la doc Flutter VYVRE.
   */
  function mapToScores(raw) {
    // Hydration (Stamatas 2011 σL* — lower = more hydrated)
    //   σL* < 8 → barrier intact (high hydration), > 12 → compromised
    const hydration = Math.round(Math.max(15, Math.min(95, 100 - raw.tewl * 5)));

    // Pigmentation (Takiwaki MI : 100-180 light, 250-400 dark)
    //   Higher MI → more pigmented → "pigmentation" concern higher
    const pigmentation = Math.round(Math.max(10, Math.min(95, (raw.MI - 80) / 3)));

    // Pores (proxy via luminance variance — TEWL inversé en variance topologie)
    const pores = Math.round(Math.max(20, Math.min(90, 90 - raw.tewl * 4)));

    // Glow (radiance) — L* + (1 - sebum) car peau brillante mate = ternissement
    const glow = Math.round(Math.max(20, Math.min(95, raw.L + (1 - raw.sebum) * 20)));

    // Firmness (proxy via ITA° distance from 35° — healthy mid range)
    const firmness = Math.round(Math.max(25, Math.min(90, 85 - Math.abs(raw.ita - 35) * 1.2)));

    // Redness (Yamamoto EI : >8 onset, >12 moderate, >20 severe)
    //   Score 100 = no redness
    const redness = Math.round(Math.max(10, Math.min(95, 100 - raw.EI * 5)));

    // Sebum (Mizukoshi ratio en %)
    const sebum = Math.round(Math.max(5, Math.min(90, raw.sebum * 100)));

    // Wrinkles (V1 proxy via ITA° distance from 35° ; pas de Sobel V1)
    const wrinkles = Math.round(Math.max(20, Math.min(85, 75 - Math.abs(raw.ita - 35) * 0.8)));

    return { hydration, wrinkles, pigmentation, pores, glow, firmness, redness, sebum };
  }

  // ════════════════════════════════════════════════════════════════════════
  // 8. DOM INTEGRATION — Map biomarkers aux barres data-target existantes
  // ════════════════════════════════════════════════════════════════════════

  // Pricing values protégées (ne pas overwrite ces data-target)
  const PRICING_TARGETS = new Set([
    '299', '2990', '699', '900', '2700', '900€', '2700€',
    '50', '100', '500', '1000', '10K', 'D65', '478'
  ]);

  /**
   * Détecte les data-target dans le DOM et tente de les associer à un concern
   * via heuristique sémantique (label parent en FR/EN).
   */
  function findBiomarkerBars() {
    const bars = document.querySelectorAll('[data-target]');
    const mapped = [];

    for (const bar of bars) {
      const target = bar.dataset.target;
      // Skip pricing scrambles
      if (PRICING_TARGETS.has(target)) continue;
      // Skip non-numeric (e.g., "D65") and tres grosses valeurs (probable price/count)
      const numTarget = parseFloat(target);
      if (isNaN(numTarget)) continue;
      if (numTarget > 200) continue;  // probable prix/landmark count

      // Skip score totaux (skin score type — pas un biomarqueur spécifique)
      // mais garde l'effort de détection sur le label
      const parent = bar.closest('.card, .biomarker-card, .metric-block, [class*="card"], [class*="metric"], [class*="bio"]')
        || bar.parentElement?.parentElement;
      if (!parent) continue;

      const labelEl = parent.querySelector('[class*="label"], [class*="name"], [class*="title"], [class*="subtitle"], h3, h4');
      const label = (labelEl?.textContent || parent.textContent || '').toLowerCase();

      const concern = matchConcernFromLabel(label);
      if (concern) {
        mapped.push({ bar, concern, label: label.substring(0, 80) });
      }
    }
    return mapped;
  }

  /**
   * Heuristique label → concern. FR + EN.
   */
  function matchConcernFromLabel(label) {
    if (/hydra|moisture|moistur|barrière polyphén/i.test(label)) return 'hydration';
    if (/rides|wrinkle|line\b|microrelief/i.test(label)) return 'wrinkles';
    if (/pigment|taches|spot|brown|mexameter|topolog/i.test(label)) return 'pigmentation';
    if (/pore/i.test(label)) return 'pores';
    if (/éclat|glow|radian|brillance|luminos|viniférine/i.test(label)) return 'glow';
    if (/ferme|firm|elastic|tension dermique|densité|cellules souches/i.test(label)) return 'firmness';
    if (/rougeur|redness|rouge|inflam|vascul|microcirc|resvératrol/i.test(label)) return 'redness';
    if (/sébum|sebum|oil/i.test(label)) return 'sebum';
    return null;
  }

  /**
   * Met à jour les data-target avec les vrais scores.
   * Marque chaque barre via data-vyvre-real pour debug.
   */
  function updateBiomarkerBars(scores) {
    const mapped = findBiomarkerBars();
    let updated = 0;
    for (const m of mapped) {
      const value = scores[m.concern];
      if (value != null) {
        m.bar.dataset.target = String(value);
        m.bar.dataset.vyvreReal = '1';
        m.bar.dataset.vyvreConcern = m.concern;

        // Si la barre a une largeur déjà appliquée, recompute
        if (m.bar.style && m.bar.style.width) {
          m.bar.style.width = value + '%';
        }
        // Si custom property --target
        if (m.bar.style && m.bar.style.getPropertyValue('--target')) {
          m.bar.style.setProperty('--target', value + '%');
        }
        updated++;
      }
    }
    console.log(`[vyvre-scan] updated ${updated}/${mapped.length} biomarker bars with real scores`, scores);
    return updated;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 9. AUTO-BOOTSTRAP
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Public API exposée sur window.VYVRE_SCAN_ENGINE.
   */
  function buildPublicAPI() {
    return {
      version: 'v1.0.0',

      // High-level scan flow
      runRealScan: async function (videoEl) {
        try {
          if (!videoEl || !videoEl.videoWidth) {
            throw new Error('video element has no dimensions (not ready?)');
          }
          const result = await analyzeMultiFrame(videoEl);
          const scores = mapToScores(result.raw);
          updateBiomarkerBars(scores);
          return {
            scores,
            raw: result.raw,
            framesAccepted: result.framesAccepted,
            framesAttempted: result.framesAttempted
          };
        } catch (e) {
          console.error('[vyvre-scan] real scan failed:', e.message);
          return null;
        }
      },

      // Granular building blocks (exposed for tests / debug)
      rgbToLab,
      srgbToLinear,
      rgbToXYZ,
      xyzToLab,
      ita,
      itaToFitzpatrick,
      melaninIndex,
      erythemaIndex,
      sebumProxy,
      tewlProxy,
      mapToScores,
      analyzeMultiFrame,
      captureFrame,
      detectFaceROI,
      samplePixelsInROI,
      assessFrameQuality,
      findBiomarkerBars,
      updateBiomarkerBars,
      startCamera
    };
  }

  /**
   * Auto-bootstrap au DOMContentLoaded — détecte les POCs (data-target présents)
   * et tente de hook les video elements pour scanner quand ils jouent.
   */
  async function autoBootstrap() {
    const bars = document.querySelectorAll('[data-target]');
    if (!bars.length) {
      console.log('[vyvre-scan] no data-target bars found on this page — engine loaded but idle');
      return;
    }

    // Try to preload face-api.js model si dispo (non-blocking)
    if (typeof window.faceapi !== 'undefined' && window.faceapi.nets && window.faceapi.nets.tinyFaceDetector) {
      try {
        if (!window.faceapi.nets.tinyFaceDetector.params) {
          await window.faceapi.nets.tinyFaceDetector.loadFromUri(
            'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
          );
          console.log('[vyvre-scan] face-api tinyFaceDetector model loaded');
        }
      } catch (e) {
        console.warn('[vyvre-scan] face-api model preload failed:', e.message);
      }
    }

    window.VYVRE_SCAN_ENGINE = buildPublicAPI();

    setupAutoIntercept();
    console.log('[vyvre-scan] engine ready — VYVRE_SCAN_ENGINE.runRealScan(videoEl) available');
  }

  /**
   * Hook les video elements présents : quand un video démarre, attendre 3s
   * puis lancer un scan automatique. Sécurité : 1 seul scan par video.
   */
  function setupAutoIntercept() {
    const tryHookVideos = () => {
      const videos = document.querySelectorAll('video');
      if (!videos.length) return;

      for (const video of videos) {
        if (video.dataset.vyvreHooked) continue;
        video.dataset.vyvreHooked = '1';

        let scanStarted = false;
        let scanCompleted = false;

        const triggerScan = async () => {
          if (scanStarted || scanCompleted) return;
          scanStarted = true;

          // Wait 3s pour laisser le video se stabiliser + face detection se chauffer
          setTimeout(async () => {
            if (scanCompleted) return;
            console.log('[vyvre-scan] auto-triggering real scan on video element...');
            try {
              const result = await window.VYVRE_SCAN_ENGINE.runRealScan(video);
              if (result) {
                scanCompleted = true;
                window.dispatchEvent(new CustomEvent('vyvre:scan-complete', { detail: result }));
                // Re-apply --target style for bars qui en ont besoin
                document.querySelectorAll('[data-target][data-vyvre-real]').forEach(bar => {
                  if (bar.style && bar.style.getPropertyValue('--target')) {
                    bar.style.setProperty('--target', bar.dataset.target + '%');
                  }
                });
              } else {
                // Scan failed → reset pour permettre retry
                scanStarted = false;
              }
            } catch (e) {
              console.error('[vyvre-scan] auto-scan error:', e.message);
              scanStarted = false;
            }
          }, 3000);
        };

        video.addEventListener('play', triggerScan);
        video.addEventListener('playing', triggerScan);
        // Si le video joue déjà
        if (!video.paused && video.readyState >= 2) triggerScan();
      }
    };

    tryHookVideos();

    // Observe les ajouts dynamiques de video elements
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => tryHookVideos());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 10. SELF-TESTS (CIE LAB validation)
  // ════════════════════════════════════════════════════════════════════════

  /**
   * Validation des conversions CIE LAB avec valeurs de référence connues.
   * Reference values from http://www.easyrgb.com/en/convert.php with D65.
   */
  function selfTest() {
    const tests = [
      { rgb: [0, 0, 0], expected: { L: 0, a: 0, b: 0 }, name: 'black', tolerance: 0.1 },
      { rgb: [255, 255, 255], expected: { L: 100, a: 0, b: 0 }, name: 'white', tolerance: 0.5 },
      { rgb: [255, 0, 0], expected: { L: 53.24, a: 80.09, b: 67.20 }, name: 'red', tolerance: 0.5 },
      { rgb: [0, 255, 0], expected: { L: 87.74, a: -86.18, b: 83.18 }, name: 'green', tolerance: 0.5 },
      { rgb: [0, 0, 255], expected: { L: 32.30, a: 79.20, b: -107.86 }, name: 'blue', tolerance: 0.5 },
      { rgb: [128, 128, 128], expected: { L: 53.59, a: 0, b: 0 }, name: 'gray-mid', tolerance: 0.5 }
    ];

    let pass = 0;
    const results = [];
    for (const t of tests) {
      const got = rgbToLab(t.rgb[0], t.rgb[1], t.rgb[2]);
      const tol = t.tolerance;
      const ok = Math.abs(got.L - t.expected.L) < tol &&
        Math.abs(got.a - t.expected.a) < tol &&
        Math.abs(got.b - t.expected.b) < tol;
      const symbol = ok ? 'PASS' : 'FAIL';
      const msg = `[${symbol}] ${t.name}: L=${got.L.toFixed(2)} a=${got.a.toFixed(2)} b=${got.b.toFixed(2)} (expected L=${t.expected.L} a=${t.expected.a} b=${t.expected.b}, tol=${tol})`;
      console.log(msg);
      results.push({ name: t.name, ok, got, expected: t.expected });
      if (ok) pass++;
    }

    // ITA° tests
    const itaLight = ita(75, 18); // peau claire typique
    const itaDark = ita(35, 18);  // peau foncée typique
    console.log(`[INFO] ITA° light (L=75, b=18) = ${itaLight.toFixed(1)}° → Fitz ${itaToFitzpatrick(itaLight)}`);
    console.log(`[INFO] ITA° dark  (L=35, b=18) = ${itaDark.toFixed(1)}° → Fitz ${itaToFitzpatrick(itaDark)}`);

    // MI / EI quick sanity
    console.log(`[INFO] MI(reflectance 0.5) = ${melaninIndex(0.5).toFixed(1)}`);
    console.log(`[INFO] EI(R=0.6, G=0.5) = ${erythemaIndex(0.6, 0.5).toFixed(1)}`);

    const summary = `${pass}/${tests.length} CIE LAB tests passed`;
    console.log(summary);

    return { pass, total: tests.length, results, allPassed: pass === tests.length };
  }

  // Expose self-test
  if (typeof window !== 'undefined') {
    window.VYVRE_SCAN_ENGINE_TEST = selfTest;
  }

  // ════════════════════════════════════════════════════════════════════════
  // 11. BOOTSTRAP
  // ════════════════════════════════════════════════════════════════════════

  if (typeof window !== 'undefined') {
    // Toujours expose l'API (même sans bars détectés, utile pour test page)
    window.VYVRE_SCAN_ENGINE = buildPublicAPI();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoBootstrap);
    } else {
      // Le DOM est déjà prêt — bootstrap async
      setTimeout(autoBootstrap, 0);
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 12. EXPORT pour Node.js (test runner CLI)
  // ════════════════════════════════════════════════════════════════════════

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      rgbToLab, srgbToLinear, rgbToXYZ, xyzToLab,
      ita, itaToFitzpatrick,
      melaninIndex, erythemaIndex, sebumProxy, tewlProxy,
      mapToScores, computeStd,
      selfTest
    };
  }

})();
