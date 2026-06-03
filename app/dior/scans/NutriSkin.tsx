'use client';

/**
 * VYVRE — Nutri Skin : scanne la peau, en déduit des carences probables, et
 * recommande aliments + recettes. (Module APP, indépendant du POC/widget.)
 * Wellness/nutrition générale — pas un avis médical.
 */

import { useEffect, useRef, useState } from 'react';
import { openCamera, stopStream, scoresFromVideo, cameraErrorMessage, scoresFromImageFile } from './scanlib';
import type { ScanScores } from '@/lib/scan-types';

type Phase = 'intro' | 'scan' | 'results';

interface Nutrient {
  key: string;
  name: string;
  why: string;
  foods: { emoji: string; label: string }[];
}

// concern → nutriment ciblé
const MAP: Record<string, Nutrient> = {
  hydration: {
    key: 'omega3',
    name: 'Oméga-3 & hydratation',
    why: 'Barrière hydrique fragilisée — les acides gras renforcent le film lipidique.',
    foods: [
      { emoji: '🐟', label: 'Saumon' },
      { emoji: '🥑', label: 'Avocat' },
      { emoji: '🥜', label: 'Noix' },
      { emoji: '🫒', label: "Huile d'olive" },
    ],
  },
  glow: {
    key: 'vitc',
    name: 'Vitamine C & antioxydants',
    why: "Éclat en baisse — la vitamine C relance la luminosité et neutralise les radicaux libres.",
    foods: [
      { emoji: '🍊', label: 'Agrumes' },
      { emoji: '🫐', label: 'Myrtilles' },
      { emoji: '🥝', label: 'Kiwi' },
      { emoji: '🫑', label: 'Poivron' },
    ],
  },
  redness: {
    key: 'antiinf',
    name: 'Anti-inflammatoires',
    why: 'Rougeurs détectées — oméga-3, zinc et curcuma apaisent l’inflammation cutanée.',
    foods: [
      { emoji: '🐟', label: 'Sardine' },
      { emoji: '🟡', label: 'Curcuma' },
      { emoji: '🫚', label: 'Gingembre' },
      { emoji: '🥬', label: 'Légumes verts' },
    ],
  },
  wrinkles: {
    key: 'collagen',
    name: 'Collagène & protéines',
    why: 'Rides marquées — collagène et vitamine C soutiennent la synthèse du derme.',
    foods: [
      { emoji: '🍳', label: 'Œufs' },
      { emoji: '🍲', label: "Bouillon d'os" },
      { emoji: '🫘', label: 'Légumineuses' },
      { emoji: '🍊', label: 'Vitamine C' },
    ],
  },
  firmness: {
    key: 'collagen2',
    name: 'Collagène & élasticité',
    why: 'Fermeté en baisse — protéines, vitamine C et silicium nourrissent l’élastine.',
    foods: [
      { emoji: '🐠', label: 'Poisson' },
      { emoji: '🌾', label: 'Avoine' },
      { emoji: '🥦', label: 'Brocoli' },
      { emoji: '🥚', label: 'Protéines' },
    ],
  },
  pigmentation: {
    key: 'vite',
    name: 'Vitamine E & C anti-taches',
    why: 'Taches pigmentaires — vitamines C/E et niacinamide unifient le teint.',
    foods: [
      { emoji: '🌰', label: 'Amandes' },
      { emoji: '🫒', label: 'Olives' },
      { emoji: '🥬', label: 'Épinards' },
      { emoji: '🍊', label: 'Agrumes' },
    ],
  },
  sebum: {
    key: 'zinc',
    name: 'Zinc & vitamine A',
    why: 'Excès de sébum — le zinc régule la production et la vitamine A affine le grain.',
    foods: [
      { emoji: '🦪', label: 'Huîtres' },
      { emoji: '🍠', label: 'Patate douce' },
      { emoji: '🎃', label: 'Courge' },
      { emoji: '🥩', label: 'Viande maigre' },
    ],
  },
  pores: {
    key: 'zinc2',
    name: 'Zinc & purifiants',
    why: 'Pores dilatés — zinc et hydratation légère resserrent le grain de peau.',
    foods: [
      { emoji: '🎃', label: 'Graines de courge' },
      { emoji: '🫘', label: 'Pois chiches' },
      { emoji: '🥗', label: 'Légumes crus' },
      { emoji: '💧', label: 'Eau' },
    ],
  },
};

const RECIPES = [
  { tags: ['omega3', 'collagen', 'firmness'], emoji: '🥗', name: 'Bowl saumon-avocat', desc: 'Saumon, avocat, quinoa, graines de courge, citron. Oméga-3 + protéines + zinc.' },
  { tags: ['vitc', 'glow', 'pigmentation'], emoji: '🥤', name: 'Smoothie éclat', desc: 'Kiwi, myrtilles, orange, épinards, graines de chia. Bombe de vitamine C & antioxydants.' },
  { tags: ['antiinf', 'redness'], emoji: '🍵', name: 'Golden latte apaisant', desc: 'Lait végétal, curcuma, gingembre, poivre noir, miel. Anti-inflammatoire ciblé.' },
  { tags: ['collagen', 'wrinkles', 'firmness'], emoji: '🍲', name: "Bouillon d'os & légumes", desc: "Bouillon d'os longue cuisson, brocoli, œuf poché. Collagène + vitamine C." },
  { tags: ['zinc', 'sebum', 'pores'], emoji: '🥘', name: 'Patate douce rôtie & courge', desc: 'Patate douce, graines de courge, pois chiches grillés. Zinc & vitamine A.' },
];

function topConcerns(s: ScanScores): string[] {
  const sev: Record<string, number> = {
    hydration: 100 - (s.hydration ?? 50),
    glow: 100 - (s.glow ?? 50),
    redness: 100 - (s.redness ?? 50),
    wrinkles: 100 - (s.wrinkles ?? 50),
    firmness: 100 - (s.firmness ?? 50),
    pigmentation: s.pigmentation ?? 50,
    sebum: s.sebum ?? 50,
    pores: 100 - (s.pores ?? 50),
  };
  return Object.entries(sev).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
}

export default function NutriSkin({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [progress, setProgress] = useState(0);
  const [scores, setScores] = useState<ScanScores | null>(null);
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
    const res = await scoresFromImageFile(file);
    setProgress(100);
    if (!res?.scores) {
      setErr("Aucun visage exploitable sur cette photo. Réessayez avec un portrait bien éclairé.");
      setPhase('intro');
      return;
    }
    setScores(res.scores);
    setTimeout(() => setPhase('results'), 400);
  }

  async function startScan() {
    setErr(null);
    setPhase('scan');
    setProgress(0);
    try {
      const v = videoRef.current!;
      streamRef.current = await openCamera(v);
      const t0 = performance.now();
      const tick = () => {
        const p = Math.min(95, ((performance.now() - t0) / 4500) * 100);
        setProgress(p);
        if (p < 95) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      // laisse la caméra se stabiliser puis scanne
      await new Promise((r) => setTimeout(r, 2200));
      const res = await scoresFromVideo(v);
      setProgress(100);
      stopStream(streamRef.current);
      streamRef.current = null;
      setScores(res?.scores ?? null);
      setTimeout(() => setPhase('results'), 500);
    } catch (e) {
      stopStream(streamRef.current);
      setErr(cameraErrorMessage(e));
      setPhase('intro');
    }
  }

  const concerns = scores ? topConcerns(scores) : [];
  const nutrients = concerns.map((c) => MAP[c]).filter(Boolean);
  const nutrientKeys = new Set(nutrients.map((n) => n.key.replace(/\d/g, '')));
  const recipes = RECIPES.filter((r) => r.tags.some((t) => nutrientKeys.has(t.replace(/\d/g, '')))).slice(0, 3);

  return (
    <div className={`dior-app scan-module ${phase === 'results' ? 'scrollable' : ''}`}>
      <div className="ambient-light" />
      <button className="scan-back" onClick={onBack}>
        ← Suite
      </button>

      {phase === 'intro' && (
        <div className="ob-wrap">
          <div className="label-sm" style={{ marginBottom: 22 }}>
            Nutri Skin · Diagnostic nutritionnel
          </div>
          <h2 className="ob-title">
            Votre peau dit ce que <em>votre assiette</em> oublie.
          </h2>
          <p className="ob-sub">
            On lit vos biomarqueurs cutanés et on en déduit les nutriments à privilégier — avec aliments et recettes.
          </p>
          {err && <div className="scan-error">{err}</div>}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="spatial-btn" onClick={startScan}>
              {err ? 'Réessayer' : 'Lancer Nutri Skin'}
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
            Lecture des marqueurs cutanés…
          </div>
        </div>
      )}

      {phase === 'results' && (
        <div className="nutri-results">
          <div className="label-sm" style={{ textAlign: 'center', marginBottom: 16 }}>
            Nutri Skin · Plan nutritionnel personnalisé
          </div>
          <h2 className="nutri-h2">
            Vos <em>3 priorités</em> nutritionnelles.
          </h2>

          <div className="nutri-grid">
            {nutrients.map((n, i) => (
              <div className="nutri-card" key={n.key}>
                <span className="nutri-rank">0{i + 1}</span>
                <h3>{n.name}</h3>
                <p>{n.why}</p>
                <div className="nutri-foods">
                  {n.foods.map((f) => (
                    <span className="nutri-food" key={f.label}>
                      <span className="nutri-emoji">{f.emoji}</span>
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h2 className="nutri-h2" style={{ marginTop: 80 }}>
            Vos <em>recettes</em>.
          </h2>
          <div className="nutri-recipes">
            {recipes.map((r) => (
              <div className="nutri-recipe" key={r.name}>
                <span className="nutri-recipe-emoji">{r.emoji}</span>
                <div>
                  <h4>{r.name}</h4>
                  <p>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="nutri-disclaimer">
            Conseils nutritionnels généraux à visée bien-être — ne remplacent pas un avis médical.
          </div>
          <div style={{ textAlign: 'center', marginTop: 30, paddingBottom: 60 }}>
            <button className="spatial-btn secondary" onClick={onBack}>
              ← Retour à la suite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
