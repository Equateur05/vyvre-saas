'use client';

/**
 * VYVRE Widget — Client component
 *
 * 4 phases :
 * 1. Intro : "Diagnostic peau · 90 secondes"
 * 2. Scan : caméra + face-api + scan engine
 * 3. Results : 8 biomarqueurs + tagline
 * 4. Routine : 3 produits matchés au scan
 */

import { useEffect, useRef, useState } from 'react';

interface Brand {
  id: string;
  name: string | null;
  slug: string | null;
  plan: string;
  primary_color?: string | null;
  logo_url?: string | null;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  url: string | null;
  price_eur: number | null;
  currency: string | null;
  targets: string[] | null;
  concern_scores: Record<string, number> | null;
  position: number;
}

interface WidgetClientProps {
  brand: Brand;
  products: Product[];
  locale: 'fr' | 'en';
  theme: 'light' | 'dark';
}

type Phase = 'intro' | 'scan' | 'results' | 'routine';

const T = {
  fr: {
    intro_label: 'Diagnostic peau VYVRE',
    intro_title: 'Votre peau, en 90 secondes',
    intro_sub: 'Analyse colorimétrique on-device · Aucune photo stockée · 100% France',
    start_button: 'Démarrer le scan',
    consent: 'En démarrant, vous autorisez l\'accès à la caméra. Aucune photo n\'est sauvegardée ni transmise.',
    scanning: 'Analyse en cours…',
    capturing: 'Capture {n}/8',
    results_title: 'Votre diagnostic',
    routine_title: 'Routine personnalisée',
    routine_sub: 'Produits {brand} matching vos besoins',
    no_products: 'Catalogue en cours d\'activation chez {brand}. Revenez bientôt.',
    biomarkers: {
      hydration: 'Hydratation',
      wrinkles: 'Rides',
      pigmentation: 'Pigmentation',
      pores: 'Pores',
      glow: 'Éclat',
      firmness: 'Fermeté',
      redness: 'Rougeurs',
      sebum: 'Sébum',
    },
    powered: 'Propulsé par VYVRE · vyvre.fr',
    restart: 'Refaire un scan',
    discover: 'Découvrir',
  },
  en: {
    intro_label: 'VYVRE Skin Diagnostic',
    intro_title: 'Your skin, in 90 seconds',
    intro_sub: 'On-device colorimetric analysis · No photo stored · 100% France',
    start_button: 'Start the scan',
    consent: 'By starting, you allow camera access. No photo is saved or transmitted.',
    scanning: 'Analyzing…',
    capturing: 'Capture {n}/8',
    results_title: 'Your diagnostic',
    routine_title: 'Personalized routine',
    routine_sub: '{brand} products matching your needs',
    no_products: 'Catalog activation in progress at {brand}. Check back soon.',
    biomarkers: {
      hydration: 'Hydration',
      wrinkles: 'Wrinkles',
      pigmentation: 'Pigmentation',
      pores: 'Pores',
      glow: 'Glow',
      firmness: 'Firmness',
      redness: 'Redness',
      sebum: 'Sebum',
    },
    powered: 'Powered by VYVRE · vyvre.fr',
    restart: 'Scan again',
    discover: 'Discover',
  },
};

const CONCERN_LIST = ['hydration', 'wrinkles', 'pigmentation', 'pores', 'glow', 'firmness', 'redness', 'sebum'] as const;
type Concern = typeof CONCERN_LIST[number];

export default function WidgetClient({ brand, products, locale, theme }: WidgetClientProps) {
  const t = T[locale];
  const accent = brand.primary_color || '#C8A96E';
  const bgPrimary = theme === 'light' ? '#F4F1EA' : '#0A0A0A';
  const textPrimary = theme === 'light' ? '#1A1A18' : '#F4F1EA';
  const cardBg = theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const cardBorder = theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)';

  const [phase, setPhase] = useState<Phase>('intro');
  const [progress, setProgress] = useState(0);  // 0-100
  const [scores, setScores] = useState<Record<Concern, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Notify parent iframe of height changes
  useEffect(() => {
    const sendHeight = () => {
      try {
        window.parent.postMessage({ type: 'vyvre:resize', height: document.body.scrollHeight }, '*');
      } catch (e) {}
    };
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [phase]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  async function startScan() {
    setError(null);
    setProgress(5);
    setPhase('scan');

    try {
      // Acquire camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setProgress(15);

      // Wait for scan engine to be available
      const t0 = Date.now();
      while (!(window as any).VYVRE_SCAN_ENGINE && Date.now() - t0 < 8000) {
        await new Promise((r) => setTimeout(r, 200));
      }
      const engine = (window as any).VYVRE_SCAN_ENGINE;
      if (!engine || !engine.runRealScan) {
        throw new Error('scan_engine_unavailable');
      }
      setProgress(25);

      // Simulate capture progress while engine runs
      let captureProgress = 25;
      const progressInterval = setInterval(() => {
        captureProgress = Math.min(85, captureProgress + 5);
        setProgress(captureProgress);
      }, 600);

      // Run real scan (5s, 8 frames)
      const result = await engine.runRealScan(videoRef.current);
      clearInterval(progressInterval);

      if (!result || !result.scores) {
        throw new Error('scan_failed');
      }

      setScores(result.scores as Record<Concern, number>);
      setProgress(100);

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      // Notify parent
      try {
        window.parent.postMessage({ type: 'vyvre:event', event: 'scan-complete', detail: result.scores }, '*');
      } catch (e) {}

      // Transition to results
      setTimeout(() => setPhase('results'), 600);
    } catch (err: any) {
      console.error('[widget] scan failed', err);
      setError(err?.message || 'scan_failed');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setPhase('intro');
    }
  }

  function restartScan() {
    setScores(null);
    setProgress(0);
    setError(null);
    setPhase('intro');
  }

  // Match products to scores
  const matchedProducts = scores ? matchProducts(scores, products) : [];

  return (
    <main style={{ minHeight: '100vh', padding: '48px 24px', background: bgPrimary, color: textPrimary }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name || ''} style={{ height: 24, width: 'auto' }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${textPrimary}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>
                {(brand.name || 'V').charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
              {brand.name || 'VYVRE'}
            </span>
          </div>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.45, fontFamily: 'monospace' }}>
            {t.intro_label}
          </span>
        </header>

        {/* ────────── INTRO ────────── */}
        {phase === 'intro' && (
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, textAlign: 'center', padding: '40px 0' }}>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 200, letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'Georgia, serif' }}>
              {t.intro_title}
            </h1>
            <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 480, lineHeight: 1.6 }}>{t.intro_sub}</p>
            <button
              onClick={startScan}
              style={{
                marginTop: 16,
                padding: '18px 40px',
                background: accent,
                color: theme === 'light' ? '#FFFFFF' : '#0A0A0A',
                border: 0,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              {t.start_button} →
            </button>
            <p style={{ fontSize: 11, opacity: 0.45, maxWidth: 420, lineHeight: 1.5, fontFamily: 'monospace' }}>{t.consent}</p>
            {error && (
              <div style={{ background: 'rgba(224,112,96,0.1)', border: '1px solid rgba(224,112,96,0.3)', padding: '12px 16px', fontSize: 13, color: '#e07060', borderRadius: 4 }}>
                {error === 'NotAllowedError' || error.includes('Permission') ? 'Camera permission denied.' : `Error: ${error}`}
              </div>
            )}
          </section>
        )}

        {/* ────────── SCAN ────────── */}
        {phase === 'scan' && (
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 480, aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
              <video
                ref={videoRef}
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />
              {/* Scan overlay */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', aspectRatio: '3/4', border: `2px solid ${accent}88`, borderRadius: '50% / 60%' }} />
                {/* Progress ring */}
                <svg style={{ position: 'absolute', top: 16, right: 16, width: 56, height: 56 }} viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                  <circle
                    cx="28" cy="28" r="24" fill="none" stroke={accent} strokeWidth="3"
                    strokeDasharray={`${(progress / 100) * 150.8} 150.8`}
                    strokeLinecap="round" transform="rotate(-90 28 28)"
                  />
                  <text x="28" y="32" textAnchor="middle" fill={accent} fontSize="11" fontFamily="monospace" fontWeight="600">{progress}%</text>
                </svg>
              </div>
            </div>
            <p style={{ fontSize: 14, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, fontFamily: 'monospace' }}>
              {t.scanning}
            </p>
          </section>
        )}

        {/* ────────── RESULTS ────────── */}
        {phase === 'results' && scores && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 200, letterSpacing: '-0.02em', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
              {t.results_title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {CONCERN_LIST.map((c) => {
                const value = scores[c];
                return (
                  <div key={c} style={{ background: cardBg, border: `1px solid ${cardBorder}`, padding: '16px 14px', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 8, fontFamily: 'monospace' }}>
                      {t.biomarkers[c]}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 200, color: accent, lineHeight: 1, marginBottom: 8 }}>
                      {value}
                      <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 2 }}>/100</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 1.5 }}>
                      <div style={{ height: '100%', width: `${value}%`, background: accent, borderRadius: 1.5 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              <button
                onClick={() => setPhase('routine')}
                style={{
                  padding: '14px 32px', background: accent, color: theme === 'light' ? '#FFFFFF' : '#0A0A0A', border: 0,
                  fontSize: 12, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                {locale === 'fr' ? 'Voir ma routine →' : 'See my routine →'}
              </button>
              <button
                onClick={restartScan}
                style={{
                  padding: '14px 32px', background: 'transparent', color: textPrimary,
                  border: `1px solid ${textPrimary}40`, fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                {t.restart}
              </button>
            </div>
          </section>
        )}

        {/* ────────── ROUTINE (products) ────────── */}
        {phase === 'routine' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <header style={{ textAlign: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 200, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif' }}>
                {t.routine_title}
              </h2>
              <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>
                {t.routine_sub.replace('{brand}', brand.name || 'VYVRE')}
              </p>
            </header>

            {matchedProducts.length === 0 ? (
              <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, padding: 32, textAlign: 'center', borderRadius: 6 }}>
                <p style={{ fontSize: 14, opacity: 0.7 }}>
                  {t.no_products.replace('{brand}', brand.name || 'VYVRE')}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {matchedProducts.map((p) => (
                  <a
                    key={p.id}
                    href={p.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', background: cardBg, border: `1px solid ${cardBorder}`, padding: 18, textDecoration: 'none', color: textPrimary, borderRadius: 6, transition: 'border-color 0.25s' }}
                  >
                    {p.image_url && (
                      <div style={{ aspectRatio: '1/1', background: '#FFFFFF', borderRadius: 4, marginBottom: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    )}
                    <h3 style={{ fontSize: 15, fontWeight: 400, marginBottom: 6, fontFamily: 'Georgia, serif' }}>{p.name}</h3>
                    {p.price_eur != null && (
                      <p style={{ fontSize: 13, color: accent, fontWeight: 500 }}>{p.price_eur} {p.currency || 'EUR'}</p>
                    )}
                    <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.5, fontFamily: 'monospace', marginTop: 10 }}>
                      {t.discover} →
                    </p>
                  </a>
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button
                onClick={restartScan}
                style={{
                  padding: '12px 28px', background: 'transparent', color: textPrimary,
                  border: `1px solid ${textPrimary}40`, fontSize: 12, fontWeight: 500,
                  letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer'
                }}
              >
                {t.restart}
              </button>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${cardBorder}`, textAlign: 'center' }}>
          <a
            href="https://vyvre.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.45, textDecoration: 'none', color: textPrimary, fontFamily: 'monospace' }}
          >
            {t.powered}
          </a>
        </footer>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════════════════
// Match products to scan scores
// ════════════════════════════════════════════════════════════════════════
function matchProducts(scores: Record<string, number>, products: Product[]): Product[] {
  if (!products.length) return [];

  // Top 3 concerns (lowest scores = strongest needs)
  const concerns = Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([c]) => c);

  // Score each product : sum of weights from concern_scores OR boolean from targets
  const ranked = products.map((p) => {
    let score = 0;
    if (p.concern_scores && typeof p.concern_scores === 'object') {
      for (const c of concerns) {
        score += Number(p.concern_scores[c] || 0);
      }
    } else if (Array.isArray(p.targets)) {
      for (const c of concerns) {
        if (p.targets.includes(c)) score += 1;
      }
    }
    return { p, score };
  });

  ranked.sort((a, b) => b.score - a.score);
  const filtered = ranked.filter((r) => r.score > 0).slice(0, 3);

  // If no product matches any concern, just return first 3 (gentle fallback)
  if (filtered.length === 0) return products.slice(0, 3);
  return filtered.map((r) => r.p);
}
