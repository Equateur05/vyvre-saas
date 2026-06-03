'use client';

/**
 * VYVRE — Multi-Zoom : zoome automatiquement sur des zones du visage (front,
 * yeux, joues, zone T), capture une photo par zone, puis analyse (moteur v10.5).
 * Utilise le zoom matériel de la caméra si dispo (track.zoom), sinon zoom CSS.
 */

import { useEffect, useRef, useState } from 'react';
import { openCamera, stopStream, getZoomCaps, applyZoom, scoresFromVideo, longevityScore, cameraErrorMessage } from './scanlib';
import type { ScanScores } from '@/lib/scan-types';

type Phase = 'intro' | 'scan' | 'results';

interface Zone {
  label: string;
  scale: number;
  ox: number; // transform-origin x %
  oy: number; // transform-origin y %
}
const ZONES: Zone[] = [
  { label: 'Cadrage complet', scale: 1, ox: 50, oy: 45 },
  { label: 'Front', scale: 2.1, ox: 50, oy: 20 },
  { label: 'Contour des yeux', scale: 2.6, ox: 40, oy: 36 },
  { label: 'Joue gauche', scale: 2.4, ox: 30, oy: 56 },
  { label: 'Joue droite', scale: 2.4, ox: 70, oy: 56 },
  { label: 'Zone T · nez', scale: 2.3, ox: 50, oy: 50 },
];

const BIOMARKERS: { key: keyof ScanScores; label: string }[] = [
  { key: 'hydration', label: 'Hydratation' },
  { key: 'wrinkles', label: 'Rides' },
  { key: 'firmness', label: 'Fermeté' },
  { key: 'glow', label: 'Éclat' },
  { key: 'pores', label: 'Pores' },
  { key: 'redness', label: 'Rougeurs' },
  { key: 'pigmentation', label: 'Pigmentation' },
  { key: 'sebum', label: 'Sébum' },
];

export default function MultiZoomScan({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [zoneIdx, setZoneIdx] = useState(0);
  const [transform, setTransform] = useState('scale(1)');
  const [origin, setOrigin] = useState('50% 45%');
  const [zoomLabel, setZoomLabel] = useState('×1.0');
  const [shots, setShots] = useState<{ label: string; url: string }[]>([]);
  const [scores, setScores] = useState<ScanScores | null>(null);
  const [flash, setFlash] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;
    return () => {
      disposedRef.current = true;
      stopStream(streamRef.current);
    };
  }, []);

  function captureThumb(label: string) {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement('canvas');
    c.width = 240;
    c.height = 240;
    const ctx = c.getContext('2d')!;
    // recadre selon la zone zoomée (origin + scale) pour que la vignette montre le zoom
    const z = ZONES[zoneIdx];
    const sw = v.videoWidth / z.scale;
    const sh = v.videoHeight / z.scale;
    const sx = Math.max(0, Math.min(v.videoWidth - sw, (z.ox / 100) * v.videoWidth - sw / 2));
    const sy = Math.max(0, Math.min(v.videoHeight - sh, (z.oy / 100) * v.videoHeight - sh / 2));
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-240, 0);
    ctx.drawImage(v, sx, sy, sw, sh, 0, 0, 240, 240);
    ctx.restore();
    setShots((s) => [...s, { label, url: c.toDataURL('image/jpeg', 0.85) }]);
  }

  async function start() {
    setErr(null);
    setPhase('scan');
    setShots([]);
    try {
      const v = videoRef.current!;
      streamRef.current = await openCamera(v);
      const caps = getZoomCaps(streamRef.current);

      for (let i = 0; i < ZONES.length; i++) {
        if (disposedRef.current) return;
        const z = ZONES[i];
        setZoneIdx(i);
        setOrigin(`${z.ox}% ${z.oy}%`);
        setTransform(`scale(${z.scale})`);
        setZoomLabel('×' + z.scale.toFixed(1));
        // zoom matériel si dispo
        if (caps) {
          const hw = caps.min + (caps.max - caps.min) * Math.min(1, (z.scale - 1) / 1.6);
          await applyZoom(streamRef.current, hw);
        }
        await new Promise((r) => setTimeout(r, 1300));
        if (disposedRef.current) return;
        // flash + capture
        setFlash(true);
        setTimeout(() => setFlash(false), 180);
        captureThumb(z.label);
        await new Promise((r) => setTimeout(r, 500));
      }

      // analyse finale au cadrage complet
      setTransform('scale(1)');
      if (streamRef.current && getZoomCaps(streamRef.current)) await applyZoom(streamRef.current, 1);
      await new Promise((r) => setTimeout(r, 600));
      const res = await scoresFromVideo(videoRef.current!);
      stopStream(streamRef.current);
      streamRef.current = null;
      setScores(res?.scores ?? null);
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
            Multi-Zoom · Macro-analyse
          </div>
          <h2 className="ob-title">
            Six zones. <em>Six zooms</em>. Une cartographie.
          </h2>
          <p className="ob-sub">
            La caméra zoome automatiquement sur le front, les yeux, les joues et la zone T — une macro-photo par zone, puis
            analyse fusionnée.
          </p>
          {err && <div className="scan-error">{err}</div>}
          <button className="spatial-btn" onClick={start}>
            {err ? 'Réessayer' : 'Lancer le Multi-Zoom'}
          </button>
        </div>
      )}

      {phase === 'scan' && (
        <div className="ob-wrap">
          <div className="mz-stage spatial-panel">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="mz-video"
              style={{ transform: `scaleX(-1) ${transform}`, transformOrigin: origin }}
            />
            <div className="mz-reticle" />
            {flash && <div className="mz-flash" />}
            <div className="mz-hud">
              <span className="mz-zone">{ZONES[zoneIdx].label}</span>
              <span className="mz-zoom">{zoomLabel}</span>
            </div>
            <div className="mz-progress">
              {ZONES.map((_, i) => (
                <span key={i} className={`mz-dot${i <= zoneIdx ? ' on' : ''}`} />
              ))}
            </div>
          </div>
          <div className="label-sm" style={{ marginTop: 26 }}>
            Capture {shots.length}/{ZONES.length} · zoom automatique
          </div>
        </div>
      )}

      {phase === 'results' && (
        <div className="mz-results">
          <div className="label-sm" style={{ textAlign: 'center', marginBottom: 16 }}>
            Multi-Zoom · {shots.length} macro-clichés
          </div>
          {scores && (
            <div className="mz-score">
              <span className="mz-score-num">{longevityScore(scores)}</span>
              <span className="mz-score-lbl">Score global</span>
            </div>
          )}
          <div className="mz-thumbs">
            {shots.map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <figure key={i} className="mz-thumb">
                <img src={s.url} alt={s.label} />
                <figcaption>{s.label}</figcaption>
              </figure>
            ))}
          </div>
          {scores && (
            <div className="mz-bars">
              {BIOMARKERS.map((b) => {
                const val = Math.round((scores[b.key] as number) ?? 0);
                return (
                  <div className="mz-bar" key={b.key}>
                    <div className="mz-bar-head">
                      <span>{b.label}</span>
                      <span className="mz-bar-val">{val}</span>
                    </div>
                    <div className="mz-bar-track">
                      <div className="mz-bar-fill" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
