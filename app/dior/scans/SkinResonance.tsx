'use client';

/**
 * VYVRE — Skin Resonance / Skin Sound : émet des fréquences sonores "accordées"
 * aux marqueurs de la peau, avec visualiseur temps réel (Web Audio API).
 * Expérience bien-être sensorielle — pas un dispositif médical.
 */

import { useEffect, useRef, useState } from 'react';
import { openCamera, stopStream, scoresFromVideo } from './scanlib';
import type { ScanScores } from '@/lib/scan-types';

type Phase = 'intro' | 'scan' | 'session';

interface Freq {
  hz: number;
  intent: string;
  concern: string;
}
const LIBRARY: Freq[] = [
  { hz: 528, intent: 'Régénération cellulaire', concern: 'wrinkles' },
  { hz: 396, intent: 'Apaisement des rougeurs', concern: 'redness' },
  { hz: 639, intent: 'Hydratation & équilibre', concern: 'hydration' },
  { hz: 432, intent: 'Éclat & harmonie', concern: 'glow' },
  { hz: 285, intent: 'Réparation tissulaire', concern: 'firmness' },
];

function pickFreqs(s: ScanScores | null): Freq[] {
  if (!s) return [LIBRARY[3], LIBRARY[0], LIBRARY[2]];
  const sev: Record<string, number> = {
    wrinkles: 100 - (s.wrinkles ?? 50),
    redness: 100 - (s.redness ?? 50),
    hydration: 100 - (s.hydration ?? 50),
    glow: 100 - (s.glow ?? 50),
    firmness: 100 - (s.firmness ?? 50),
  };
  const top = Object.entries(sev).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return top.map((c) => LIBRARY.find((f) => f.concern === c)!).filter(Boolean);
}

const SESSION_SEC = 90;

export default function SkinResonance({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [scores, setScores] = useState<ScanScores | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [freqs, setFreqs] = useState<Freq[]>(pickFreqs(null));

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioRef = useRef<{ ctx: AudioContext; oscs: OscillatorNode[]; analyser: AnalyserNode; master: GainNode } | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopStream(streamRef.current);
      stopAudio();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function quickScan() {
    setPhase('scan');
    try {
      const v = videoRef.current!;
      streamRef.current = await openCamera(v);
      await new Promise((r) => setTimeout(r, 2400));
      const res = await scoresFromVideo(v);
      stopStream(streamRef.current);
      streamRef.current = null;
      setScores(res?.scores ?? null);
      setFreqs(pickFreqs(res?.scores ?? null));
      setPhase('session');
    } catch {
      stopStream(streamRef.current);
      setFreqs(pickFreqs(null));
      setPhase('session');
    }
  }

  function startAudio() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 2);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    const oscs: OscillatorNode[] = [];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f.hz;
      const g = ctx.createGain();
      g.gain.value = 0.22 / (i * 0.5 + 1);
      // LFO "pulsation vers la peau"
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12 + i * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      osc.connect(g);
      g.connect(master);
      osc.start();
      lfo.start();
      oscs.push(osc, lfo);
    });

    audioRef.current = { ctx, oscs, analyser, master };
    setPlaying(true);
    drawViz();

    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= SESSION_SEC) {
          stopAudio();
          return SESSION_SEC;
        }
        return e + 1;
      });
    }, 1000);
  }

  function stopAudio() {
    const a = audioRef.current;
    if (a) {
      try {
        a.master.gain.exponentialRampToValueAtTime(0.0001, a.ctx.currentTime + 0.6);
        setTimeout(() => {
          a.oscs.forEach((o) => {
            try {
              o.stop();
            } catch {
              /* noop */
            }
          });
          a.ctx.close().catch(() => {});
        }, 700);
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPlaying(false);
  }

  function drawViz() {
    const canvas = canvasRef.current;
    const a = audioRef.current;
    if (!canvas || !a) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (canvas.width = canvas.offsetWidth * dpr);
    const H = (canvas.height = canvas.offsetHeight * dpr);
    const buf = new Uint8Array(a.analyser.frequencyBinCount);

    const loop = () => {
      const cur = audioRef.current;
      if (!cur) return;
      cur.analyser.getByteFrequencyData(buf);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const t = performance.now() * 0.001;
      // anneaux concentriques pulsants
      for (let ring = 0; ring < 5; ring++) {
        const amp = buf[ring * 8] / 255;
        const r = (Math.min(W, H) * 0.08) * (ring + 1) + amp * 40 * dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(240,199,128,${0.06 + amp * 0.4})`;
        ctx.lineWidth = (1 + amp * 2) * dpr;
        ctx.stroke();
      }
      // onde radiale
      const N = buf.length;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const ang = (i / N) * Math.PI * 2;
        const amp = buf[i] / 255;
        const rr = Math.min(W, H) * 0.22 + amp * 70 * dpr + Math.sin(t * 2 + i * 0.2) * 4 * dpr;
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,229,176,0.55)';
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke();
      // noyau
      const coreAmp = buf[2] / 255;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 * dpr * (1 + coreAmp));
      grad.addColorStop(0, `rgba(255,229,176,${0.25 + coreAmp * 0.4})`);
      grad.addColorStop(1, 'rgba(255,229,176,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 * dpr * (1 + coreAmp), 0, Math.PI * 2);
      ctx.fill();
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
  }

  return (
    <div className="dior-app scan-module">
      <div className="ambient-light" />
      <button className="scan-back" onClick={onBack}>
        ← Suite
      </button>

      {phase === 'intro' && (
        <div className="ob-wrap">
          <div className="label-sm" style={{ marginBottom: 22 }}>
            Skin Resonance · Thérapie fréquentielle
          </div>
          <h2 className="ob-title">
            Des <em>fréquences</em> accordées à votre peau.
          </h2>
          <p className="ob-sub">
            On scanne votre peau, puis on émet des fréquences sonores choisies pour vos marqueurs. Mettez le son, fermez les
            yeux 90 secondes.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="spatial-btn" onClick={quickScan}>
              Scanner & accorder
            </button>
            <button
              className="spatial-btn secondary"
              onClick={() => {
                setFreqs(pickFreqs(null));
                setPhase('session');
              }}
            >
              Séance harmonisante
            </button>
          </div>
        </div>
      )}

      {phase === 'scan' && (
        <div className="ob-wrap">
          <div className="nutri-cam spatial-panel">
            <video ref={videoRef} autoPlay muted playsInline className="nutri-video" />
            <div className="nutri-ring">
              <span>♪</span>
            </div>
          </div>
          <div className="label-sm" style={{ marginTop: 30 }}>
            Accordage en cours…
          </div>
        </div>
      )}

      {phase === 'session' && (
        <div className="ob-wrap">
          <canvas ref={canvasRef} className="reso-canvas" />
          <div className="reso-freqs">
            {freqs.map((f) => (
              <div className="reso-freq" key={f.hz}>
                <span className="reso-hz">{f.hz} Hz</span>
                <span className="reso-intent">{f.intent}</span>
              </div>
            ))}
          </div>
          <div className="reso-timer">
            {playing ? `${Math.floor((SESSION_SEC - elapsed) / 60)}:${String((SESSION_SEC - elapsed) % 60).padStart(2, '0')}` : '90 s'}
          </div>
          <button className="spatial-btn" onClick={() => (playing ? stopAudio() : startAudio())}>
            {playing ? 'Arrêter' : '▶ Démarrer la résonance'}
          </button>
          <div className="nutri-disclaimer" style={{ marginTop: 24 }}>
            Expérience sensorielle de bien-être — sans visée thérapeutique médicale. Volume modéré conseillé.
          </div>
        </div>
      )}
    </div>
  );
}
