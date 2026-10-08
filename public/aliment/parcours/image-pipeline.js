async function scanFromImage(imgEl) {
  if (!imgEl || !imgEl.naturalWidth) return null;
  // Crée un canvas temporaire qui se comporte comme un videoEl (videoWidth/videoHeight)
  const fakeVideo = {
    videoWidth: imgEl.naturalWidth,
    videoHeight: imgEl.naturalHeight,
    clientWidth: imgEl.naturalWidth,
    clientHeight: imgEl.naturalHeight,
    paused: false
  };
  // Patch captureFrame pour utiliser l'img : on construit l'imageData manuellement
  // et on appelle directement analyzeMultiFrame ne marche pas car capture interne.
  // On fait le pipeline manuel via les helpers exposés.
  const eng = window.VYVRE_SCAN_ENGINE;
  if (!eng) return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(imgEl, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const roi = await eng.detectFaceROI(imageData);

    const cheekPixels = eng.samplePixelsInROI(imageData, roi, 'cheekL', 3)
      .concat(eng.samplePixelsInROI(imageData, roi, 'cheekR', 3));
    const tzonePixels = eng.samplePixelsInROI(imageData, roi, 'tzone', 3);
    const foreheadPixels = eng.samplePixelsInROI(imageData, roi, 'forehead', 3);
    const allPixels = cheekPixels.concat(tzonePixels, foreheadPixels);

    const quality = eng.assessFrameQuality(allPixels);
    if (!quality.ok) {
      throw new Error(quality.reason || 'Image insuffisante');
    }

    // Construit le raw manuellement
    const labArr = cheekPixels.map(p => eng.rgbToLab(p.r, p.g, p.b));
    let sumL=0, sumA=0, sumB=0, sumR=0, sumG=0;
    for (const lab of labArr) { sumL += lab.L; sumA += lab.a; sumB += lab.b; }
    for (const p of cheekPixels) { sumR += p.r/255; sumG += p.g/255; }
    const n = labArr.length;
    if (n === 0) return null;
    const avgL = sumL/n, avgA = sumA/n, avgB = sumB/n;
    const avgRed = sumR/cheekPixels.length, avgGreen = sumG/cheekPixels.length;
    const avgLum = quality.avgLum || 0.5;
    const itaAngle = eng.ita(avgL, avgB);
    const fitz = eng.itaToFitzpatrick(itaAngle);
    const MI = eng.melaninIndex(avgRed);
    const EI = eng.erythemaIndex(avgRed, avgGreen);
    /* 07/10 (moteur v10.13) : seuil des reflets rapporte au niveau des joues (peau seule), comme la camera */
    const tZoneSebum = eng.sebumProxy(tzonePixels, (eng.niveauIntensite && eng.niveauIntensite(cheekPixels)) || avgLum, 0.05);
    const tewlSigma = eng.tewlProxy(labArr);

    const raw = { L: avgL, a: avgA, b: avgB, ita: itaAngle, fitz, MI, EI, sebum: tZoneSebum, tewl: tewlSigma, avgRed, avgGreen, avgLum,
      /* 07/10 (moteur v10.13) : l'image et ses 68 reperes ; sans eux, fermete, eclat, pores, hydratation et rides restent neutres */
      _frame: { imageData, roi, landmarks: roi && roi.landmarks || null } };
    const scores = eng.mapToScores(raw);
    eng.updateBiomarkerBars(scores);
    return { scores, raw, framesAccepted: 1, framesAttempted: 1, source: 'image' };
  } catch(e) {
    console.error('[CHARLOTTE_TILBURY] scanFromImage error:', e);
    return null;
  }
}
