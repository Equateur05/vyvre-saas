'use client';

/**
 * VYVRE — Helpers partagés par les modules de scan de l'app (caméra + moteur).
 * N'altère NI le POC NI le widget : utilise window.VYVRE_SCAN_ENGINE chargé par /dior.
 */

import type { ScanResult, ScanScores } from '@/lib/scan-types';

export async function openCamera(
  video: HTMLVideoElement,
  facingMode: 'user' | 'environment' = 'user',
): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } },
    audio: false,
  });
  video.srcObject = stream;
  await video.play().catch(() => {});
  return stream;
}

export function stopStream(stream: MediaStream | null) {
  try {
    stream?.getTracks().forEach((t) => t.stop());
  } catch {
    /* noop */
  }
}

/** Capacité de zoom optique/numérique de la track (iPhone/Android récents). */
export function getZoomCaps(stream: MediaStream | null): { min: number; max: number; step: number } | null {
  try {
    const track = stream?.getVideoTracks()[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const caps = track?.getCapabilities?.() as any;
    if (caps && typeof caps.zoom === 'object' && caps.zoom) {
      return { min: caps.zoom.min ?? 1, max: caps.zoom.max ?? 1, step: caps.zoom.step ?? 0.1 };
    }
  } catch {
    /* noop */
  }
  return null;
}

export async function applyZoom(stream: MediaStream | null, zoom: number) {
  try {
    const track = stream?.getVideoTracks()[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await track?.applyConstraints({ advanced: [{ zoom } as any] });
  } catch {
    /* zoom non supporté → l'UI fait un zoom CSS à la place */
  }
}

export function videoToCanvas(video: HTMLVideoElement): HTMLCanvasElement {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d')!.drawImage(video, 0, 0, w, h);
  return c;
}

/** Scores à partir d'une vidéo : moteur réel runRealScan, sinon pipeline pixels. */
export async function scoresFromVideo(video: HTMLVideoElement): Promise<ScanResult | null> {
  const eng = window.VYVRE_SCAN_ENGINE;
  if (!eng) return null;
  try {
    if (typeof eng.runRealScan === 'function' && video.videoWidth) {
      const r = await eng.runRealScan(video);
      if (r && r.scores) return r;
    }
  } catch {
    /* fallback */
  }
  return scoresFromCanvas(videoToCanvas(video));
}

/** Pipeline CIE LAB sur une image fixe (réplique scanFromImage du POC). */
export async function scoresFromCanvas(canvas: HTMLCanvasElement): Promise<ScanResult | null> {
  const eng = window.VYVRE_SCAN_ENGINE;
  if (!eng) return null;
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const roi = await eng.detectFaceROI(imageData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cheek = eng.samplePixelsInROI(imageData, roi, 'cheekL', 3).concat(eng.samplePixelsInROI(imageData, roi, 'cheekR', 3));
    const tzone = eng.samplePixelsInROI(imageData, roi, 'tzone', 3);
    if (!cheek.length) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labArr = cheek.map((p: any) => eng.rgbToLab(p.r, p.g, p.b));
    let sL = 0, sA = 0, sB = 0, sR = 0, sG = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const l of labArr) { sL += l.L; sA += l.a; sB += l.b; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const p of cheek) { sR += p.r / 255; sG += p.g / 255; }
    const n = labArr.length;
    const avgL = sL / n, avgA = sA / n, avgB = sB / n;
    const avgRed = sR / cheek.length, avgGreen = sG / cheek.length;
    const itaAngle = eng.ita(avgL, avgB);
    const raw = {
      L: avgL, a: avgA, b: avgB, ita: itaAngle, fitz: eng.itaToFitzpatrick(itaAngle),
      MI: eng.melaninIndex(avgRed), EI: eng.erythemaIndex(avgRed, avgGreen),
      sebum: eng.sebumProxy(tzone, 0.5, 0.05), tewl: eng.tewlProxy(labArr),
      avgRed, avgGreen, avgLum: 0.5,
    };
    return { scores: eng.mapToScores(raw), raw, framesAccepted: 1, framesAttempted: 1, source: 'image' };
  } catch {
    return null;
  }
}

/** Message d'erreur caméra clair et actionnable (FR). */
export function cameraErrorMessage(e: unknown): string {
  const err = e as { name?: string; message?: string };
  const s = `${err?.name || ''} ${err?.message || ''}`;
  if (/NotAllowed|Permission|Denied/i.test(s))
    return "Accès caméra refusé. Cliquez sur l'icône 🎥 à gauche de l'adresse, autorisez la caméra, puis réessayez.";
  if (/NotReadable|TrackStart|Abort|in use|already/i.test(s))
    return 'Caméra déjà utilisée par une autre application (Zoom, FaceTime, Photo Booth…). Fermez-la et réessayez.';
  if (/NotFound|DevicesNotFound|Overconstrained|no.*camera/i.test(s))
    return "Aucune caméra détectée sur cet appareil. Vous pouvez importer une photo à la place.";
  if (/secure|https/i.test(s))
    return 'La caméra nécessite une connexion sécurisée (https ou localhost).';
  return "Impossible d'activer la caméra. Vérifiez les permissions, ou importez une photo.";
}

/** Scores depuis un fichier image uploadé (fallback sans caméra). */
export async function scoresFromImageFile(file: File): Promise<ScanResult | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 640;
    c.height = img.naturalHeight || 480;
    c.getContext('2d')!.drawImage(img, 0, 0);
    return await scoresFromCanvas(c);
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Score de longévité agrégé (même formule que le POC, sans le modifier). */
export function longevityScore(s: ScanScores): number {
  const sebumScore = 100 - (s.sebum ?? 50);
  const pigmentScore = 100 - (s.pigmentation ?? 50);
  let g = Math.round(
    (s.hydration ?? 50) * 0.2 + (s.wrinkles ?? 50) * 0.15 + pigmentScore * 0.1 +
    (s.pores ?? 50) * 0.08 + (s.glow ?? 50) * 0.17 + (s.firmness ?? 50) * 0.15 +
    (s.redness ?? 50) * 0.08 + sebumScore * 0.07,
  );
  g = Math.max(20, Math.min(99, g));
  return g;
}
