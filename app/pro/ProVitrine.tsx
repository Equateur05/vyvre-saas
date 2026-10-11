'use client';

/**
 * VYVRE Pro — la vitrine : ce que vit la cliente, en quatre temps, joué dans un téléphone.
 * Les valeurs affichées dans le téléphone sont une illustration de l'écran, pas des données.
 */
import { useEffect, useRef, useState } from 'react';

export interface VitrineStrings {
  steps: { t: string; d: string }[];
  house: string;
  w1: string;
  w2: string;
  start: string;
  nophoto: string;
  reading: string;
  light: string;
  today2: string;
  routine1: string;
  routine2: string;
  add: string;
  measures: string[];
  gestures: string[];
  products: string[];
  side: { tag: string; t: string; p: string }[];
}

const VALS = [67, 72, 58, 70, 63, 66, 74, 69];
const SHAPES = [
  'M14 14h18v6l4 6v44a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V26l4-6z',
  'M20 6h6v10h4l2 6v48a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V22l2-6h4z',
  'M6 40h34v26a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6zM8 32h30v8H8z',
  'M17 8h12v12l3 4v46a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V24l3-4z',
];

export default function ProVitrine({ s }: { s: VitrineStrings }) {
  const [cur, setCur] = useState(0);
  const [seen, setSeen] = useState(false);
  const phone = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const timer = useRef<number | null>(null);

  /* démarre quand le téléphone entre à l'écran, puis avance seul toutes les 3,6 s */
  useEffect(() => {
    const el = phone.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer.current = window.setInterval(() => setCur((c) => (c + 1) % 4), 3600);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [seen]);

  /* l'anneau de lecture se dessine à chaque passage sur la deuxième scène */
  useEffect(() => {
    const r = ring.current;
    if (!r || cur !== 1) return;
    r.style.transition = 'none';
    r.style.strokeDashoffset = '565.5';
    void r.getBoundingClientRect();
    r.style.transition = 'stroke-dashoffset 2.8s cubic-bezier(.4,0,.2,1)';
    r.style.strokeDashoffset = '0';
  }, [cur]);

  const go = (i: number) => {
    setCur(i);
    setSeen(true);
    if (timer.current) window.clearInterval(timer.current);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer.current = window.setInterval(() => setCur((c) => (c + 1) % 4), 3600);
    }
  };

  return (
    <div className="vp-vit">
      <div className="vp-steps">
        {s.steps.map((st, i) => (
          <button key={i} type="button" aria-pressed={cur === i} className={`vp-stp${cur === i ? ' on' : ''}`} onClick={() => go(i)}>
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <b>{st.t}</b>
            <span className="d">{st.d}</span>
          </button>
        ))}
      </div>

      <div className="vp-ph" ref={phone} aria-hidden="true">
        <div className={`vp-scn c${cur === 0 ? ' on' : ''}`}>
          <span className="vp-mk">{s.house}</span>
          <p className="t1">{s.w1}<br />{s.w2}</p>
          <span className="fake" style={{ margin: '34px auto 0' }}>{s.start}</span>
          <p className="small">{s.nophoto}</p>
        </div>
        <div className={`vp-scn${cur === 1 ? ' on' : ''}`} style={{ textAlign: 'center' }}>
          <span className="vp-mk">{s.house}</span>
          <div className="vp-ring">
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
              <circle ref={ring} cx="100" cy="100" r="90" fill="none" stroke="#F0E5C8" strokeWidth="2" strokeLinecap="round" strokeDasharray="565.5" strokeDashoffset="565.5" transform="rotate(-90 100 100)" />
              <ellipse cx="100" cy="98" rx="46" ry="60" fill="none" stroke="rgba(255,255,255,.22)" strokeDasharray="2 5" />
            </svg>
          </div>
          <p style={{ fontWeight: 200, fontSize: 22, marginTop: 22 }}>{s.reading}</p>
          <p style={{ fontSize: 12, color: 'rgba(245,244,240,.55)', marginTop: 6 }}>{s.light}</p>
        </div>
        <div className={`vp-scn${cur === 2 ? ' on' : ''}`}>
          <span className="vp-mk">{s.house}</span>
          <p className="t2">{s.w1}<span>{s.today2}</span></p>
          <div style={{ marginTop: 18 }}>
            {s.measures.map((m, k) => (
              <div className="vp-mbar" key={k}>
                <span>{m}</span>
                <div className="t"><i style={{ width: cur === 2 ? `${VALS[k]}%` : 0, transitionDelay: cur === 2 ? `${120 + k * 80}ms` : '0ms' }} /></div>
                <b>{VALS[k]}</b>
              </div>
            ))}
          </div>
        </div>
        <div className={`vp-scn${cur === 3 ? ' on' : ''}`}>
          <span className="vp-mk">{s.house}</span>
          <p className="t2">{s.routine1}<span>{s.routine2}</span></p>
          <div className="vp-pgrid">
            {s.products.map((p, k) => (
              <div key={k}>
                <svg viewBox="0 0 46 80"><path d={SHAPES[k]} fill="#efe3c6" fillOpacity=".9" stroke="rgba(255,255,255,.5)" strokeWidth=".6" /></svg>
                <small>{s.gestures[k]}</small>
                <b>{p}</b>
              </div>
            ))}
          </div>
          <span className="fake" style={{ marginTop: 'auto' }}>{s.add}</span>
        </div>
      </div>

      <div className="vp-side">
        {s.side.map((p, i) => (
          <div className="vp-panel" key={i}>
            <span className={`vp-tag${i === 2 ? ' o' : ''}`}>{p.tag}</span>
            <p><b>{p.t}</b>{p.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
