/**
 * VYVRE — dictionnaire anglais des pages Next (marques, accuracy, pricing, légal).
 *
 * Le français est la source : toute clé ajoutée ici doit l'être dans les onze
 * autres fichiers de /lib/i18n/dict. Ce qui ne se traduit jamais reste dans le
 * JSX : noms de marques, « VYVRE », « skin intelligence », titres de papiers
 * scientifiques, noms de revues, extraits de code, chiffres et prix en euros.
 */

const en = {
  /* ─────────── commun : en-tête, pied de page, sélecteur ─────────── */
  'lang.aria': 'Choose language',
  'nav.manifeste': 'Manifesto',
  'nav.method': 'Method',
  'nav.demo': 'Try the scan',
  'nav.pricing': 'Pricing',

  'footer.city': 'VYVRE · Paris',
  'footer.cityFull': 'VYVRE · Paris, France',
  'footer.book': 'Book 20 min →',
  'footer.manifeste': 'Manifesto',
  'footer.method': 'Methodology',
  'footer.cgv': 'Terms of Sale',
  'footer.legal': 'Legal notice',
  'footer.privacy': 'Privacy',
  'footer.privacyGdpr': 'Privacy · GDPR',
  'footer.dpa': 'DPA',
  'footer.contact': 'Contact',
  'footer.home': 'Home',
  'footer.rights': 'All rights reserved',
  'footer.company': 'SAS with share capital of €1,000 · Paris, France · SIREN pending',

  /* ─────────── /marques ─────────── */
  'home.meta.title': 'VYVRE — Measured skin diagnostic, for skincare brands',
  'home.meta.desc':
    'The only skin diagnostic with a public price. Infrastructure in France, GDPR-native, on-device processing, no photo uploaded.',

  'home.hero.eyebrow': 'Measured skin diagnostic',
  'home.hero.h1a': 'The skin diagnostic',
  'home.hero.h1b': 'of your maison.',
  'home.hero.p':
    'Under ten seconds of camera. Eight measurements read pixel by pixel. A routine composed from your catalogue alone.',
  'home.hero.cta1': 'Try the scan',
  'home.hero.cta2': 'Equip my brand',

  'home.stat1': 'Skin measurements',
  'home.stat2': 'Scan duration',
  'home.stat3': 'Go-live',
  'home.stat4': 'Photo kept',

  'home.man.h2a': 'Measured,',
  'home.man.h2b': 'not guessed.',
  'home.man.p':
    'The engine converts each zone of the face into CIE L*a*b* coordinates, then into dermatological indices. No estimate drawn from a filter: an optical reading, reproducible, documented.',
  'home.man.link': 'Read the methodology →',

  'home.mes.h2a': 'Eight measurements.',
  'home.mes.h2b': 'A single reading.',
  'home.mes.1.n': 'Complexion',
  'home.mes.1.u': 'ITA° · CIE L*a*b*',
  'home.mes.2.n': 'Radiance',
  'home.mes.2.u': 'Luminance L*',
  'home.mes.3.n': 'Redness',
  'home.mes.3.u': 'Erythema index',
  'home.mes.4.n': 'Evenness',
  'home.mes.4.u': 'Chromatic standard deviation',
  'home.mes.5.n': 'Texture',
  'home.mes.5.u': 'Local micro-contrast',
  'home.mes.6.n': 'Pores',
  'home.mes.6.u': 'Minima density',
  'home.mes.7.n': 'Sebum',
  'home.mes.7.u': 'Specular reflection',
  'home.mes.8.n': 'Hydration',
  'home.mes.8.u': 'Optical TEWL proxy',

  'home.steps.h2a': 'Three steps.',
  'home.steps.h2b': 'Zero friction.',
  'home.step1.t': 'Your client scans',
  'home.step1.d':
    'Phone camera or in-store consultation station. Nothing to install, nothing to upload: the image is processed then erased.',
  'home.step2.t': 'The engine composes',
  'home.step2.d':
    'A morning and evening routine drawn from your catalogue alone, ranked by the measurements and by your commercial priorities.',
  'home.step3.t': 'You go live',
  'home.step3.d':
    'One line of script on your site, your colours, your typography. No developer needed on your side.',

  'home.groupe.eyebrow': 'For groups',
  'home.groupe.h2a': 'One house, ten brands,',
  'home.groupe.h2b': 'one single engine.',
  'home.socle1.t': 'Multi-brand',
  'home.socle1.d':
    'One space per brand: separate catalogue, brand identity, recommendation rules and statistics.',
  'home.socle2.t': 'Sovereignty',
  'home.socle2.d':
    'Hosting in France, GDPR-native, signed DPA, no image kept, no third-party pixel.',
  'home.socle3.t': 'Store and e-shop',
  'home.socle3.d':
    'The same engine at the counter on tablet and on the product page, with the same measurement reference.',

  'home.price.h2a': 'From €299/month.',
  'home.price.h2b': 'Price displayed.',
  'home.price.cta': 'See the plans',

  'home.faq.h2': 'Questions.',
  'home.faq1.q': 'How does my catalogue reach the engine?',
  'home.faq1.a':
    'Through a CSV feed or your e-commerce API (Shopify, Salesforce Commerce, Centra). No administrator access, synchronised every night.',
  'home.faq2.q': 'What happens to the client’s image?',
  'home.faq2.a':
    'It is analysed in memory then erased: no photo is stored or transmitted. Hosting in France, DPA available.',
  'home.faq3.q': 'Can the engine recommend a competitor?',
  'home.faq3.a':
    'No. The routine is composed exclusively from your catalogue, with the priorities you set.',
  'home.faq4.q': 'What equipment is required?',
  'home.faq4.a':
    'A 720p camera is enough, on mobile as on desktop. Results gain in precision on recent sensors.',

  'home.cta.h2': 'See the scan on your catalogue.',
  'home.cta.1': 'Launch the demo',
  'home.cta.2': 'Request a demo',

  /* ─────────── /accuracy ─────────── */
  'acc.meta.title': 'Methodology & accuracy · VYVRE',
  'acc.meta.desc':
    'Peer-reviewed sources (5 cited, 4 on the roadmap), calculation method, confidence intervals, limits. The scientific transparency behind the VYVRE engine.',

  'acc.hero.eyebrow': 'Methodology · Sources · Limits',
  'acc.hero.h1a': 'The science',
  'acc.hero.h1b': 'behind the scan.',
  'acc.hero.p':
    'Eight measurements read from the image. Here: the scientific sources, the calculation method, the confidence intervals and the limits of the engine.',
  'acc.hero.note1':
    'Estimated accuracy ±5 years biological age · ±4 years perceived age (95 % CI · internal cohort n=12)',
  'acc.hero.note2':
    'External validation n=100 planned for late 2026 · rebuilt May 2026 after internal audit',

  'acc.s1.eyebrow': '01 · Bibliography · Applied sources',
  'acc.s1.h2a': '5 peer-reviewed sources',
  'acc.s1.h2b': 'and what the engine applies.',
  'acc.s1.p1': 'What each of these 5 sources contributes to the engine, verifiable in the code (see',
  'acc.s1.p2': ', function',
  'acc.s1.p3': 'and',
  'acc.s1.p4': '). Since October 2026, none of the eight measures depends on skin colour or image brightness: each measure compares the skin with itself, on the same image.',
  'acc.s1.foot1': 'Engine v10.13 — relative measures, October 2026',
  'acc.s1.foot2': 'Applied sources verifiable line by line in',

  'acc.src1.c':
    'ITA° (Individual Typology Angle) — basis of automatic Fitzpatrick I-VI phototype detection',
  'acc.src2.c':
    'Melanin Index and Erythema Index — computed for information. Redness is read as a* (CIE L*a*b*) on the cheeks; pigmentation is measured against the person’s own skin tone (areas 10 % darker than their own skin).',
  'acc.src3.c':
    'Former σL* indicator (hydration and pores), withdrawn in October 2026: it mostly read the shading of facial relief. Hydration: finest micro-texture of the cheeks, pores excluded, relative to the skin’s own level. Pores: small dark dots standing out from the surrounding skin grain.',
  'acc.src4.c':
    'Specular highlights → sebum, with a threshold relative to the cheek skin level. Radiance no longer reads raw brightness: evenness of light on the cheekbones and forehead, soft cheekbone highlight, relative to the person’s own skin.',
  'acc.src5.c':
    'Gap between perceived age and biological age (Caucasian cohort ~1,700 subjects). v7: age-dependent gap (−2 to −6 years depending on biological age), not linked to phototype.',

  'acc.s2.eyebrow': '02 · Bibliography · Roadmap late 2026',
  'acc.s2.h2a': '4 referenced sources',
  'acc.s2.h2b': 'not yet fully applied.',
  'acc.s2.p':
    'These sources are cited for transparency and for the public roadmap. Their full coefficients are not yet integrated into the formulas — extraction and validation planned for late 2026 with a dermatologist partner.',
  'acc.rm.appliedLabel': 'Partially applied: ',
  'acc.rm.roadmapLabel': 'Roadmap: ',
  'acc.rm1.a':
    'Anchor age 40 (median of the adult cohort) + correlation r=0.78 periorbital wrinkles ↔ age',
  'acc.rm1.r':
    'Extraction from images → morphological grade 0-5 (Bazin scale) not yet implemented. Planned for late 2026.',
  'acc.rm2.a': 'Modest adjustment of −4 % to −8 % on biological age for phototypes IV-VI',
  'acc.rm2.r':
    'Full per-phototype coefficients for wrinkles / firmness / pigmentation not yet extracted.',
  'acc.rm3.a': 'Cited for the multi-ethnic context',
  'acc.rm3.r':
    'Specific coefficients not yet extracted. Validation on a multi-ethnic cohort planned for late 2026.',
  'acc.rm4.a': 'Clinical TEWL norms referenced (healthy ≤ 15 g/m²/h, impaired ≥ 25)',
  'acc.rm4.r':
    'The numerical σL* → TEWL calculation follows Stamatas 2011 (and not Akdeniz). Cross-validation planned.',

  'acc.bench.eyebrow': 'Public benchmark · UTKFace · 26 May 2026',
  'acc.bench.h2a': 'Publicly compared',
  'acc.bench.h2b': 'with 3 open-source references.',
  'acc.bench.p':
    'VYVRE v7.0 tested on 300 public UTKFace faces (stratified 18-80 years) alongside DeepFace, InsightFace and OpenCV DNN. Verdict published unedited, reproducible code, 5 scripts, 4 min run time.',
  'acc.bench.k1.l': '30-44 (target)',
  'acc.bench.k1.n': 'MAE — ahead of OpenCV (8.66 years)',
  'acc.bench.k2.l': 'Overall (18-80)',
  'acc.bench.k2.n': 'MAE — behind the deep networks',
  'acc.bench.k3.l': 'Signed bias',
  'acc.bench.k3.n': 'The most neutral of the 4 engines',
  'acc.bench.cta': 'See the full benchmark →',

  'acc.s3.eyebrow': '03 · Colorimetric standards (foundations)',
  'acc.s3.p':
    'Underlying normative standards — not peer-reviewed articles, but technical specifications active in the processing chain.',
  'acc.s3.std1': 'sRGB colour space (gamma decoding)',
  'acc.s3.std2': 'Rec. 709 RGB primaries',
  'acc.s3.std3': 'XYZ → L*a*b* conversion',
  'acc.s3.std4': 'Fitzpatrick boundaries by ITA°',
  'acc.s3.std5': 'YCbCr skin pixel detection',
  'acc.s3.std6': 'Laplacian sharpness measurement',
  'acc.s3.std7':
    'no longer used: since October 2026, firmness no longer depends on skin colour (nasolabial fold relief, lower-face contour, mouth corners).',

  'acc.s4.eyebrow': '04 · Processing chain',
  'acc.s4.h2': 'Calculation method.',
  'acc.st1.t': 'Image capture',
  'acc.st1.d':
    'Standard webcam (≥ 720p). Less than 10 seconds of capture, 8 frames retained. Face detection by face-api.js (68 landmarks). Cropping of the facial area and light correction.',
  'acc.st2.t': 'Colorimetric conversion',
  'acc.st2.d':
    'sRGB → XYZ → CIE L*a*b* chain (IEC 61966-2-1, CIE 015:2004). Self-test on 6 reference colours at every scan. Pixel-level precision.',
  'acc.st3.t': 'Signal extraction',
  'acc.st3.d':
    'Colour (L*a*b*: ITA° for the phototype, a* for redness), highlights (sebum) and relative textures: small dark dots (pores), micro-texture (hydration), folds at the eye corners and forehead (wrinkles), nasolabial fold and lower face (firmness), evenness of light (radiance). Cheeks, nose, forehead, eye area.',
  'acc.st4.t': 'Conversion into biomarkers',
  'acc.st4.d':
    'Each signal is a deviation of the skin from itself, on the same image: never a skin colour or an absolute brightness. Converted into a 0-100 score with named constants, tuned on test photos and flagged as such; an unreadable measure gives a neutral score, flagged.',
  'acc.st5.t': 'Phototype detection',
  'acc.st5.d':
    'Fitzpatrick I-VI classification by ITA° (Chardon 1991), shown for information. None of the eight measures uses the phototype or skin colour.',
  'acc.st6.t': 'Age estimate + interval',
  'acc.st6.d':
    'Age is not displayed: the combination of measures does not yet follow real age reliably. It will only be shown after validation on faces of known ages.',

  'acc.s5.eyebrow': '05 · Skin age · v7 method',
  'acc.s5.h2a': 'Perceived skin age',
  'acc.s5.h2b': 'or raw biological age.',
  'acc.s5.p': 'Two numbers are calculated, only one is displayed. Here is why.',
  'acc.age.l.tag': 'Displayed — Skin age',
  'acc.age.l.h3': 'Visually perceived age',
  'acc.age.l.p':
    'Average age perceived socially by a human observer. Calibrated on Vierkötter & Krutmann 2012 (Caucasian cohort ~1,700 subjects) with a gap that is',
  'acc.age.l.pEm': 'age-dependent',
  'acc.age.l.li1': '< 30 years bio → −2 years',
  'acc.age.l.li2': '30-45 years bio → −4 years',
  'acc.age.l.li3': '45-60 years bio → −5 years',
  'acc.age.l.li4': '60 years and over bio → −5 to −6 years',
  'acc.age.l.note':
    'v7 removes the per-phototype mapping of v6, absent from the original source. The phototype influences biological age (Diridollou), not social perception.',
  'acc.age.r.tag': 'Internal — Biological age',
  'acc.age.r.h3': 'Raw biological age',
  'acc.age.r.p':
    'Direct estimate of the physical state of the skin via the dominant wrinkle score (periorbital wrinkles, Bazin 2007). Correlation r=0.78 with chronological age on studio photographs.',
  'acc.age.r.note1': 'v7 formula:',
  'acc.age.r.note2':
    'The 0.85 factor (JPEG webcam penalty) is an acknowledged empirical compensation; validation on a large cohort planned for late 2026.',
  'acc.age.prec1': 'Estimated accuracy:',
  'acc.age.prec.bio': '±5 years biological age',
  'acc.age.prec.perc': '±4 years perceived age',
  'acc.age.prec2': '(95 % CI on internal cohort n=12)',
  'acc.age.prec3': 'External validation n=100 planned for late 2026',

  'acc.s6.eyebrow': '06 · Behaviour by quality · v7',
  'acc.s6.h2a': '3 confidence levels.',
  'acc.s6.h2b': 'No flattering arrangement.',
  'acc.s6.p':
    'v7 removes the v6.2 correction that artificially rejuvenated degraded scans (the “the less the engine sees, the more it flatters” paradox). In its place, 3 explicit confidence levels.',
  'acc.q1.tag': 'Quality < 40',
  'acc.q1.h3': 'Scan refused',
  'acc.q1.p1': 'No estimate published. Message',
  'acc.q1.p2':
    'with a recommendation to redo the scan in better light. The estimate is not calculated.',
  'acc.q2.tag': '40 ≤ Quality < 60',
  'acc.q2.h3': 'Low confidence',
  'acc.q2.p1': 'Best-effort estimate published, but flagged',
  'acc.q2.p2':
    '. Interval widened to ±7 years (against ±5 as standard). The estimate stays honest, not shifted.',
  'acc.q3.tag': 'Quality ≥ 60',
  'acc.q3.h3': 'Standard',
  'acc.q3.p1': 'Standard estimate with',
  'acc.q3.p2':
    '. Interval ±5 years (95 % on internal cohort n=12). Nominal behaviour for a well-lit HD webcam.',
  'acc.s6.foot1': 'v6.2 correction removed: −5 years on a degraded scan (quality < 45)',
  'acc.s6.foot2':
    'v7 widens the interval rather than shifting the estimate (honesty over flattery)',

  'acc.s7.eyebrow': '07 · Variance tests',
  'acc.s7.h2': 'Reproducibility.',
  'acc.s7.p':
    'Test: the same subject scanned 10 times under 10 different lighting conditions. Measurement of the standard deviation of the scores. Internal cohort n=12.',
  'acc.var1': 'Wrinkles',
  'acc.var2': 'Firmness',
  'acc.var3': 'Pigmentation',
  'acc.var4': 'Hydration',
  'acc.var5': 'Radiance',
  'acc.var6': 'Pores',
  'acc.var7': 'Redness',
  'acc.var8': 'Perceived age',
  'acc.var.unitPts': 'pts/100',
  'acc.var.unitYears': 'years',
  'acc.s7.foot1':
    'Internal cohort · n=12 subjects phototypes I-IV · 10 scans/subject · variable light · HD 720p webcam',
  'acc.s7.foot2':
    'Phototypes V-VI: Diridollou 2007 extrapolation — validation on a dedicated cohort planned for late 2026',
  'acc.s7.foot3': 'External validation n=100 planned for late 2026',

  'acc.s8.eyebrow': '08 · Validation roadmap',
  'acc.s8.h2a': 'What we commit',
  'acc.s8.h2b': 'to validating.',
  'acc.q.late2026': 'late 2026',
  'acc.q.q42026': 'Q4 2026',
  'acc.rd1.t': 'Validation on external cohort n=100',
  'acc.rd1.b':
    'Recruitment of 100 varied subjects (20-75 years, phototypes I-VI). Measurement of agreement with the reference Visia / Antera devices. Methodological publication.',
  'acc.rd2.t': 'Bazin morphological grade 0-5',
  'acc.rd2.b':
    'Extraction from the images of the Bazin morphological grade (atlas vol. 1, chap. 4) — today only the anchor age 40 and the correlation r=0.78 are used. Implementation of wrinkle-depth detection and of the 0-5 classification.',
  'acc.rd3.t': 'Per-phototype coefficients (Diridollou + Flament)',
  'acc.rd3.b':
    'Extraction of the Diridollou 2007 and Flament 2023 coefficients for wrinkles / firmness / pigmentation by phototype. Today v7 applies a modest adjustment of −4 % to −8 % on the biological age of phototypes IV-VI; objective: full per-phototype mapping with the source coefficients.',
  'acc.rd4.t': 'Peer-reviewed publication',
  'acc.rd4.b':
    'Submission of a methodological article describing the VYVRE chain (consumer webcam → CIE L*a*b* biomarkers → age estimate) with validation on a n=100 cohort. Target: Int J Cosmet Sci or Skin Res Technol.',

  'acc.s9.eyebrow': '09 · Limits',
  'acc.s9.h2a': 'What VYVRE',
  'acc.s9.h2b': 'does not do.',
  'acc.s9.p':
    'We prefer to be radically honest about what the engine does not measure, rather than sell a dream.',
  'acc.lim1.t': 'VYVRE is not a medical device',
  'acc.lim1.b':
    'The engine makes no medical diagnosis. It does not detect dermatological pathologies (skin cancer, melanoma, dermatitis, psoriasis, etc.). For any medical concern, consult a dermatologist.',
  'acc.lim2.t': 'A standard webcam is not a professional scanner',
  'acc.lim2.b':
    'A professional dermatological scanner uses polarised light, UV fluorescence and a 3D sensor. VYVRE relies on a standard webcam and uncontrolled light. Variance ±8 % (against ±2 % in clinic).',
  'acc.lim3.t': 'No 3D wrinkle detection',
  'acc.lim3.b':
    'The real depth of wrinkles requires a stereoscopic sensor. VYVRE estimates severity through the colorimetric analysis of shadows (2D approach). Reliable on pronounced wrinkles, less precise on emerging fine lines.',
  'acc.lim4.t': 'Deep hyperpigmentation not detected',
  'acc.lim4.b':
    'Sub-epidermal pigment spots (deep melasma, old actinic spots) are not visible in visible light. A UV fluorescence camera would be required (not included).',
  'acc.lim5.t': 'Phototypes V-VI: acknowledged extrapolation',
  'acc.lim5.b':
    'The internal cohort n=12 contains mainly phototypes I-IV. The adjustments for V-VI are extrapolated from the Diridollou 2007 data (−4 % to −8 % on biological age). Validation on a dedicated cohort planned for late 2026.',
  'acc.lim6.t': 'Make-up, glasses, mask',
  'acc.lim6.b':
    'The engine detects these obstructions and lowers the quality score. If the quality is too low (< 40), the scan is refused. Between 40 and 60, the result is published with an explicit low-confidence flag and a widened interval.',
  'acc.lim7.t': 'The internal cohort n=12 is small — we acknowledge it',
  'acc.lim7.b':
    'The empirical coefficients (JPEG webcam penalty, interval width) are calibrated on 12 subjects. It is a test group, not a clinical cohort. External validation n=100 is on the roadmap for late 2026.',

  'acc.s10.eyebrow': '10 · Add-on module · Skin conditions (v1 indicative)',
  'acc.s10.h2a': 'Visual detection of 4 conditions',
  'acc.s10.h2b': 'indicative, never medical.',
  'acc.s10.p1': 'Separate module',
  'acc.s10.p2':
    '(v1.0.0-heuristic) — optional loading on any demonstration. Detects, through image heuristics, 4 frequent visual conditions and proposes a targeted cosmetic routine, outside any prescription.',
  'acc.s10.p3': 'This module makes no medical diagnosis.',
  'acc.cond.sens': 'Sensitivity',
  'acc.cond.spec': 'Specificity',
  'acc.cond.cohort': 'synthetic cohort n=12',
  'acc.cond1.a': 'Module · Acne',
  'acc.cond1.t': 'Localised CIELAB a* erythema + L* texture variance',
  'acc.cond1.c':
    'Detection of erythematous pixels concentrated in distinct points on the T-zone (forehead, nose, chin). Output: probability + severity (minimal, low, moderate, high).',
  'acc.cond2.a': 'Module · Rosacea',
  'acc.cond2.t': 'Median a* excess on cheeks + nose against the baseline + bilateral symmetry',
  'acc.cond2.c':
    'Persistent and bilateral erythema on the cheeks and the nose. The symmetry between the cheeks weights the score (rosacea is bilateral).',
  'acc.cond3.a': 'Module · Melasma',
  'acc.cond3.t': 'ΔL* forehead and upper lip vs upper L* quartile of the cheeks + Δb* (melanin)',
  'acc.cond3.c':
    'Symmetrical hyperpigmentation of the centre of the face (forehead, upper lip, cheekbones). Distinguishes diffuse melasma from distinct spots.',
  'acc.cond4.a': 'Module · Lentigines',
  'acc.cond4.t': 'Spot detection (size 5-200 px², compactness ≥ 0.45)',
  'acc.cond4.c':
    'Isolated pigment spots, with sharp outlines, on the cheeks and the forehead. Number of qualified spots related to the skin surface (density per 1,000 pixels).',
  'acc.s10.why.t': 'Why heuristics rather than a neural network?',
  'acc.s10.why1':
    'The ISIC / DermNet datasets contain clinical close-up images, in polarised light, centred on the lesion. A distribution very far from a consumer webcam at 50 cm under uncontrolled light: a model trained on them would transfer poorly without retraining on a dedicated VYVRE cohort.',
  'acc.s10.why2':
    'Heuristics remain auditable line by line, which an opaque model is not. Compatible with the explainability requirements of the major houses.',
  'acc.s10.why3':
    'No model to download (0 MB), no graphics processor required, runs on every browser in under 200 ms.',
  'acc.s10.why4a': 'Stable architecture: a v2 will be able to substitute a learned model behind the same interface',
  'acc.s10.why4b': 'without breaking existing integrations.',
  'acc.s10.disc.t': 'Medical disclaimer (mandatory on every display)',
  'acc.s10.disc.b':
    'This module is not a medical device. It makes no diagnosis. The probabilities returned are indicators of areas to watch, intended to recommend a targeted cosmetic routine. For any real skin concern, consult a dermatologist.',
  'acc.s10.cta1': 'See the Conditions demonstration →',
  'acc.s10.cta2': 'Module source code',

  'acc.s11.eyebrow': '11 · Quality safeguard · Honesty commitment',
  'acc.s11.h2a': 'Preferring honesty',
  'acc.s11.h2b': 'to false precision.',
  'acc.s11.p1':
    'v7.0 removes the v6.2 corrections that artificially flattered the user: a hidden 5-year rejuvenation on a degraded webcam, [20, 50] caps that brought an 80-year-old subject back to 50, a per-phototype mapping invented outside any source.',
  'acc.s11.p2':
    'If the user’s real skin reads 38 years to a dermatologist, the engine must say 38. Not 28 (a flattering lie). Not 44 (false brutality). A real estimate.',

  'acc.cta.h2a': 'Technical questions?',
  'acc.cta.h2b': 'Request the full DPA.',
  'acc.cta.p':
    'On request we send to DPOs, consulting dermatologists and R&D teams: DPA, detailed methodology, accuracy report, audited engine source code.',
  'acc.cta.1': 'Request the documentation →',
  'acc.cta.2': '← Back',

  /* ─────────── /pricing ─────────── */
  'pri.meta.title': 'Pricing · VYVRE',
  'pri.meta.desc':
    'Measured skin diagnostic, hosted in France. Free Pilot, Starter €299/month, Growth €499/month, Enterprise from €699/month.',

  'pri.banner1': 'You just tested the {brand} demonstration',
  'pri.banner2': '— Pick your plan to activate it on your site.',

  'pri.hero.eyebrow': 'Pricing · VYVRE Business',
  'pri.hero.h1a': 'The price is',
  'pri.hero.h1b': 'on the page.',
  'pri.hero.p': 'Hosting in France · GDPR-native · No photo kept',

  'pri.toggle.monthly': 'Monthly',
  'pri.toggle.annual': 'Annual',
  'pri.theme.label': 'Theme of your widget',
  'pri.theme.dark': 'Black',
  'pri.theme.light': 'White',
  'pri.theme.note': 'Your diagnostic will display in this theme · changeable later',

  'pri.card.plan': 'Plan',
  'pri.card.recommended': 'Recommended',
  'pri.per.month': '/month',

  'pri.pilot.price': 'Free',
  'pri.pilot.sub': '30 days · no commitment',
  'pri.pilot.f1': '1,000 scans / month',
  'pri.pilot.f2': 'Web SDK',
  'pri.pilot.f3': 'VYVRE branding',
  'pri.pilot.f4': 'Email support within 48 h',
  'pri.pilot.f5': 'France-based infrastructure',
  'pri.pilot.cta': 'Start for free',

  'pri.starter.subA': '€2,990 / year · 2 months free',
  'pri.starter.subM': '5,000 scans / month',
  'pri.starter.f1': '5,000 scans / month',
  'pri.starter.f2': '€0.02 per extra scan',
  'pri.starter.f3': 'Web + iOS + Android SDKs',
  'pri.starter.f4': 'Full white-label',
  'pri.starter.f5': 'SLA 99.9 % · priority support',
  'pri.starter.cta': 'Start the free trial',

  'pri.growth.subA': '€4,990 / year · 2 months free',
  'pri.growth.subM': '15,000 scans / month',
  'pri.growth.f1': '15,000 scans / month',
  'pri.growth.f2': '€0.015 per extra scan',
  'pri.growth.f3': 'Everything in Starter, plus:',
  'pri.growth.f4': 'Multi-brand (up to 5)',
  'pri.growth.f5': 'Dedicated Account Manager',
  'pri.growth.cta': 'Choose Growth',

  'pri.ent.subA': 'starts at · custom contract',
  'pri.ent.subM': 'starts at · no commitment',
  'pri.ent.f1': '25,000 scans / month',
  'pri.ent.f2': '€0.01 per extra scan',
  'pri.ent.f3': 'Unlimited store network',
  'pri.ent.f4': 'Native mobile app',
  'pri.ent.f5': 'SLA 99.99 % · 24/7 on-call',
  'pri.ent.cta': 'Contact us',

  'pri.trust': 'Public pricing · VAT extra · Cancel anytime',

  'pri.args.eyebrow': 'Why choose us',
  'pri.args.h2a': 'Why VYVRE',
  'pri.args.h2b': 'and not the others?',
  'pri.arg1.e': 'Made in France',
  'pri.arg1.t': 'The only fully French skin diagnostic module',
  'pri.arg1.b': 'Infrastructure hosted in France, team in Paris, signed DPA.',
  'pri.arg1.n': 'Comparable solutions are hosted outside the European Union.',
  'pri.arg2.e': '−90 % on the invoice',
  'pri.arg2.t1': 'Up to 10× cheaper',
  'pri.arg2.t2': 'than the alternatives',
  'pri.arg2.b1': 'VYVRE Starter =',
  'pri.arg2.b2': 'from €299 / month',
  'pri.arg2.b3':
    '(€3,588 / year). SkinConsult AI starts around €50,000 / year + €30,000 setup, Perfect Corp around €30,000 / year.',
  'pri.arg2.n': 'Detailed comparison table further down this page.',
  'pri.arg3.e': '48 h activation',
  'pri.arg3.t': 'Embed code sent after payment',
  'pri.arg3.b1': 'You paste',
  'pri.arg3.b2': 'on your site, it’s live.',
  'pri.arg3.n': 'No kick-off meeting, no third-party integrator fee.',
  'pri.arg4.e': 'No commitment',
  'pri.arg4.t': 'One-click cancellation',
  'pri.arg4.b':
    'Downgrade, upgrade or cancel from your dashboard. No contractual lock-in, no penalty.',
  'pri.arg4.n': 'You keep the export of all your scan data.',
  'pri.arg5.e': 'Full white-label',
  'pri.arg5.t': 'Your brand, not ours',
  'pri.arg5.b':
    'Logo, colours, typography, recommended products — everything is set to your brand identity.',
  'pri.arg5.n': 'No forced “Powered by VYVRE” from the Starter plan onwards.',
  'pri.arg6.e': 'Peer-reviewed science',
  'pri.arg6.t': 'A measurement, not a simulation',
  'pri.arg6.b':
    'CIE L*a*b* colorimetry, 68 face landmarks, indices derived from the dermatological literature.',
  'pri.arg6.n': 'Bibliography: Flament, Chardon, Stamatas, Takiwaki, Yamamoto.',

  'pri.tbl.caption': 'Market comparison · public pricing observed 2025',
  'pri.tbl.h1': 'Solution',
  'pri.tbl.h2': 'Annual entry price',
  'pri.tbl.h3': 'Setup / integration',
  'pri.tbl.h4': 'Hosting',
  'pri.tbl.h5': 'Time to live',
  'pri.tbl.from': 'Starts at',
  'pri.tbl.month': '/month',
  'pri.tbl.year': '/year',
  'pri.tbl.fromApprox': 'from',
  'pri.tbl.onQuote': 'on quote',
  'pri.tbl.france': 'France',
  'pri.tbl.w812': '8-12 wks',
  'pri.tbl.w12': '12+ wks',
  'pri.tbl.w68': '6-8 wks',
  'pri.tbl.note':
    'Competitor pricing: public ranges observed (cosmetics-brand RFPs 2024-2025).',

  'pri.del.eyebrow': 'Onboarding · from the second of payment',
  'pri.del.h2a': 'What you get,',
  'pri.del.h2b': 'on Stripe confirmation.',
  'pri.del1.t': 'Welcome email',
  'pri.del1.b': 'With your personal admin link and your credentials.',
  'pri.del2.t': 'Embed code ready to paste',
  'pri.del3.t': 'Pre-loaded product catalogue',
  'pri.del3.b':
    '30 to 60 of your products taken from your site, already mapped to the biomarkers.',
  'pri.del4.t': 'Styled to your brand',
  'pri.del4.b':
    'Logo, colour palette and brand name applied to the module and to the dashboard.',
  'pri.del5.t': 'Analytics dashboard',
  'pri.del5.b':
    'Scans per day, conversion rate, average biomarkers, most recommended products.',
  'pri.del6.t': 'Full GDPR export',
  'pri.del6.b':
    'You keep all your scan data, exportable to CSV at any time.',

  'pri.faq.eyebrow': 'Frequently asked questions',
  'pri.faq.h2a': 'Everything you want',
  'pri.faq.h2b': 'to know.',
  'pri.faq1.q': 'What happens if I exceed my scan quota?',
  'pri.faq1.a':
    'The service continues. Each extra scan is billed between €0.01 and €0.02 depending on your plan, on the next month’s invoice.',
  'pri.faq2.q': 'Where is user data stored?',
  'pri.faq2.a':
    'Exclusively in France. No photo kept, no transfer outside the European Union, signed DPA.',
  'pri.faq3.q': 'Can I change plans along the way?',
  'pri.faq3.a':
    'Yes, at any time from your dashboard. Upgrade prorates immediately, downgrade applies the following month.',
  'pri.faq4.q': 'What level of technical support?',
  'pri.faq4.a':
    'Email support within 48 h on every plan. Priority support with a dedicated Account Manager from Growth onwards.',
  'pri.faq5.q': 'Can the recommended products be configured?',
  'pri.faq5.a':
    'Yes. Your catalogue is fully editable: you add, remove and modify products from the dashboard.',

  'pri.cal.eyebrow': 'Not ready yet?',
  'pri.cal.h2': 'Book a 20-minute demonstration',
  'pri.cal.p':
    'Charles, founder, walks you through the module on video and answers all your technical and contractual questions.',
  'pri.cal.cta': 'Book 20 min →',

  /* ─────────── pages légales ─────────── */
  'legal.notice.t': 'The French version prevails',
  'legal.notice.b':
    'The text below is deliberately left in French: only the French version of this document has contractual value. The headings are translated for reading. A courtesy translation can be requested at charles@symphonydrive.com.',
  'legal.updated': 'Last updated:',
  'legal.version': 'Version 1.0 —',

  'cgv.meta.title': 'Terms of Sale · VYVRE',
  'cgv.meta.desc':
    'VYVRE Business terms of sale — B2B SaaS subscriptions for cosmetics brands.',
  'cgv.eyebrow': 'General terms of sale',
  'cgv.h1': 'Terms of Sale.',
  'cgv.a1': 'Article 1 — Purpose',
  'cgv.a2': 'Article 2 — Subscription and activation',
  'cgv.a3': 'Article 3 — Pricing',
  'cgv.a4': 'Article 4 — Payment terms',
  'cgv.a5': 'Article 5 — Term and termination',
  'cgv.a6': 'Article 6 — Service level agreement (SLA)',
  'cgv.a7': 'Article 7 — Data ownership',
  'cgv.a8': 'Article 8 — Limitation of liability',
  'cgv.a9': 'Article 9 — Confidentiality and GDPR',
  'cgv.a10': 'Article 10 — Governing law and jurisdiction',

  'conf.meta.title': 'Privacy policy · VYVRE',
  'conf.meta.desc':
    'VYVRE privacy policy and personal data protection. GDPR compliance.',
  'conf.eyebrow': 'Data protection · GDPR',
  'conf.h1': 'Privacy.',
  'conf.b1': 'Data controller',
  'conf.b2': 'Data collected by the skin scan',
  'conf.b3': 'Data hosting',
  'conf.b4': 'Data collected by the website',
  'conf.b5': 'Data collected at purchase',
  'conf.b6': 'Legal basis for the processing',
  'conf.b7': 'Retention period',
  'conf.b8': 'Your GDPR rights',
  'conf.b9': 'DPA (data processing agreement)',

  'ml.meta.title': 'Legal notice · VYVRE',
  'ml.meta.desc': 'Legal notice of VYVRE / Symphony Drive SAS.',
  'ml.eyebrow': 'Legal information',
  'ml.h1': 'Legal notice.',
  'ml.b1': 'Site publisher',
  'ml.b2': 'Publication director',
  'ml.b3': 'Hosting',
  'ml.b4': 'Intellectual property',
  'ml.b5': 'Limitation of liability',
  'ml.b6': 'Hyperlinks',
  'ml.b7': 'Governing law',

  'dpa.meta.title': 'DPA · Data processing agreement · VYVRE',
  'dpa.meta.desc':
    'Data processing agreement (article 28 of the GDPR) between VYVRE and B2B clients.',
  'dpa.eyebrow': 'Article 28 GDPR · Processor',
  'dpa.h1a': 'Data Processing',
  'dpa.h1b': 'Agreement.',
  'dpa.b1': '1. Parties',
  'dpa.b2': '2. Purpose of the processing',
  'dpa.b3': '3. Categories of data processed',
  'dpa.b4': '4. Categories of data subjects',
  'dpa.b5': '5. Duration of the processing',
  'dpa.b6': '6. Obligations of the processor',
  'dpa.b7': '7. Security measures (article 32 of the GDPR)',
  'dpa.b8': '8. Sub-processors',
  'dpa.b9': '9. Transfers outside the European Union',
  'dpa.b10': '10. Audit and control',
  'dpa.b11': '11. Personal data breach notification',
  'dpa.b12': '12. Return and deletion of data',
} as const;

export default en;
