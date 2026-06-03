'use client';

/**
 * VYVRE — Scan Hair : analyse cheveux & cuir chevelu via la caméra.
 * Métriques : densité, brillance, uniformité de fibre, santé du cuir chevelu.
 * Calcul maison (échantillonnage pixels + rgbToLab/erythemaIndex du moteur).
 */

import { useEffect, useRef, useState } from 'react';
import { openCamera, stopStream, videoToCanvas, cameraErrorMessage } from './scanlib';

type Phase = 'intro' | 'scan' | 'results';

interface HairMetrics {
  density: number;
  shine: number;
  fiber: number;
  scalp: number;
  vitality: number;
}

function analyzeHair(canvas: HTMLCanvasElement): HairMetrics {
  const eng = window.VYVRE_SCAN_ENGINE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const w = canvas.width, h = canvas.height;
  // bande supérieure (cheveux/cuir chevelu)
  const band = ctx.getImageData(0, 0, w, Math.floor(h * 0.5)).data;
  let hairPx = 0, total = 0;
  let lumSum = 0, lumSqSum = 0, brightPx = 0;
  const scalpReds: number[] = [];
  for (let i = 0; i < band.length; i += 16) {
    const r = band[i], g = band[i + 1], b = band[i + 2];
    total++;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const isHair = lum < 0.42 || (sat > 0.35 && lum < 0.6); // sombre ou coloré
    if (isHair) {
      hairPx++;
      lumSum += lum;
      lumSqSum += lum * lum;
      if (lum > 0.55) brightPx++;
    } else if (lum > 0.5) {
      // cuir chevelu probable → rougeur
      if (eng?.erythemaIndex) scalpReds.push(eng.erythemaIndex(r / 255, g / 255));
    }
  }
  const hairRatio = total ? hairPx / total : 0;
  const density = Math.round(Math.max(8, Math.min(99, hairRatio * 145)));
  const n = Math.max(1, hairPx);
  const mean = lumSum / n;
  const variance = Math.max(0, lumSqSum / n - mean * mean);
  const std = Math.sqrt(variance);
  // brillance : présence de reflets contrôlés
  const shine = Math.round(Math.max(10, Math.min(99, (brightPx / n) * 320 + 25)));
  // uniformité de fibre : faible variance = fibre régulière
  const fiber = Math.round(Math.max(15, Math.min(99, 100 - std * 230)));
  // cuir chevelu : faible érythème = sain
  const avgRed = scalpReds.length ? scalpReds.reduce((a, c) => a + c, 0) / scalpReds.length : 0.15;
  const scalp = Math.round(Math.max(20, Math.min(99, 100 - avgRed * 180)));
  const vitality = Math.round(density * 0.3 + shine * 0.25 + fiber * 0.25 + scalp * 0.2);
  return { density, shine, fiber, scalp, vitality };
}

function reco(m: HairMetrics): string[] {
  const out: string[] = [];
  if (m.density < 55) out.push('Densité à soutenir : sérum fortifiant cuir chevelu + apport en fer/biotine.');
  if (m.shine < 55) out.push('Brillance faible : masque nourrissant hebdomadaire, rinçage à l’eau froide.');
  if (m.fiber < 55) out.push('Fibre irrégulière : soin anti-casse aux protéines, limiter la chaleur.');
  if (m.scalp < 60) out.push('Cuir chevelu sensible : shampoing apaisant doux, éviter l’eau trop chaude.');
  if (out.length === 0) out.push('Cheveux en bonne santé — entretien : protection thermique & hydratation régulière.');
  return out;
}

const BARS: { key: keyof HairMetrics; label: string }[] = [
  { key: 'density', label: 'Densité' },
  { key: 'shine', label: 'Brillance' },
  { key: 'fiber', label: 'Fibre / uniformité' },
  { key: 'scalp', label: 'Cuir chevelu' },
];

export default function HairScan({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<HairMetrics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => stopStream(streamRef.current), []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setPhase('scan');
    setProgress(60);
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
      setProgress(100);
      setMetrics(analyzeHair(c));
      setPhase('results');
    } catch {
      setErr('Image illisible. Réessayez avec une autre photo.');
      setPhase('intro');
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function start() {
    setErr(null);
    setPhase('scan');
    setProgress(0);
    try {
      const v = videoRef.current!;
      streamRef.current = await openCamera(v);
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(96, ((performance.now() - t0) / 4000) * 100);
        setProgress(p);
        if (p < 96 && streamRef.current) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      await new Promise((r) => setTimeout(r, 2600));
      // moyenne sur 3 frames
      const samples: HairMetrics[] = [];
      for (let i = 0; i < 3; i++) {
        samples.push(analyzeHair(videoToCanvas(v)));
        await new Promise((r) => setTimeout(r, 220));
      }
      const avg: HairMetrics = {
        density: Math.round(samples.reduce((s, m) => s + m.density, 0) / samples.length),
        shine: Math.round(samples.reduce((s, m) => s + m.shine, 0) / samples.length),
        fiber: Math.round(samples.reduce((s, m) => s + m.fiber, 0) / samples.length),
        scalp: Math.round(samples.reduce((s, m) => s + m.scalp, 0) / samples.length),
        vitality: Math.round(samples.reduce((s, m) => s + m.vitality, 0) / samples.length),
      };
      setProgress(100);
      stopStream(streamRef.current);
      streamRef.current = null;
      setMetrics(avg);
      setPhase('results');
    } catch (e) {
      stopStream(streamRef.current);
      setErr(cameraErrorMessage(e));
      setPhase('intro');
    }
  }

  return (
    <div className={`dior-app scan-module ${phase === 'results' ? 'scrollable' : ''}`}>
      <div className="ambient-light" />
      <button className="scan-back" onClick={onBack}>
        ← Suite
      </button>

      {phase === 'intro' && (
        <div className="ob-wrap">
          <div className="label-sm" style={{ marginBottom: 22 }}>
            Scan Hair · Cheveux & cuir chevelu
          </div>
          <h2 className="ob-title">
            Vos cheveux, <em>diagnostiqués</em>.
          </h2>
          <p className="ob-sub">
            Cadrez vos cheveux et la racine face caméra. On évalue densité, brillance, régularité de la fibre et santé du
            cuir chevelu.
          </p>
          {err && <div className="scan-error">{err}</div>}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="spatial-btn" onClick={start}>
              {err ? 'Réessayer' : 'Lancer le Scan Hair'}
            </button>
            <button className="spatial-btn secondary" onClick={() => fileRef.current?.click()}>
              Importer une photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
        </div>
      )}

      {phase === 'scan' && (
        <div className="ob-wrap">
          <div className="nutri-cam spatial-panel">
            <video ref={videoRef} autoPlay muted playsInline className="nutri-video" />
            <div className="nutri-ring">
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
          <div className="label-sm" style={{ marginTop: 30 }}>
            Analyse de la fibre capillaire…
          </div>
        </div>
      )}

      {phase === 'results' && metrics && (
        <div className="mz-results">
          <div className="label-sm" style={{ textAlign: 'center', marginBottom: 16 }}>
            Scan Hair · Bilan capillaire
          </div>
          <div className="mz-score">
            <span className="mz-score-num">{metrics.vitality}</span>
            <span className="mz-score-lbl">Vitalité capillaire</span>
          </div>
          <div className="mz-bars" style={{ maxWidth: 640, margin: '0 auto' }}>
            {BARS.map((b) => (
              <div className="mz-bar" key={b.key}>
                <div className="mz-bar-head">
                  <span>{b.label}</span>
                  <span className="mz-bar-val">{metrics[b.key]}</span>
                </div>
                <div className="mz-bar-track">
                  <div className="mz-bar-fill" style={{ width: `${metrics[b.key]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="hair-reco">
            {reco(metrics).map((r, i) => (
              <div className="hair-reco-item" key={i}>
                <span className="hair-reco-dot">●</span>
                {r}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40, paddingBottom: 60 }}>
            <button className="spatial-btn secondary" onClick={onBack}>
              ← Retour à la suite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
