'use client';
import { useEffect, useRef } from 'react';

/** Fond animé du hero : les 68 repères du visage, lecture continue, réactif au curseur. */
export default function HeroScan() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const x = c.getContext('2d'); if (!x) return;
    const TAU = Math.PI * 2;
    let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { const b = c.getBoundingClientRect(); W = b.width; H = b.height;
      c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener('resize', resize);

    const F: number[][] = [];
    for (let i = 0; i < 17; i++) { const a = Math.PI * (1.03 - i / 16 * 1.06); F.push([Math.cos(a) * .40, Math.sin(a) * .50 + .06]); }
    for (let i = 0; i < 5; i++) F.push([-.33 + i * .065, -.24 - .03 * Math.sin(i / 4 * Math.PI)]);
    for (let i = 0; i < 5; i++) F.push([.07 + i * .065, -.24 - .03 * Math.sin(i / 4 * Math.PI)]);
    for (let i = 0; i < 4; i++) F.push([0, -.15 + i * .07]);
    for (let i = 0; i < 5; i++) F.push([-.10 + i * .05, .12]);
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; F.push([-.19 + Math.cos(a) * .075, -.13 + Math.sin(a) * .035]); }
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; F.push([.19 + Math.cos(a) * .075, -.13 + Math.sin(a) * .035]); }
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; F.push([Math.cos(a) * .145, .30 + Math.sin(a) * .055]); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; F.push([Math.cos(a) * .085, .30 + Math.sin(a) * .028]); }

    let mx = 0, my = 0, tx = 0, ty = 0;
    const move = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - .5); ty = (e.clientY / window.innerHeight - .5); };
    window.addEventListener('pointermove', move, { passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, t0 = performance.now();
    const boucle = (now: number) => {
      raf = requestAnimationFrame(boucle);
      const t = (now - t0) / 1000;
      mx += (tx - mx) * .022; my += (ty - my) * .022;
      x.clearRect(0, 0, W, H);
      const S = Math.min(W, H) * 1.02, cx = W / 2 + mx * W * .05, cy = H / 2 + my * H * .05;
      const yaw = (reduce ? 0 : Math.sin(t * .12) * .30) + mx * .5;
      const balay = ((t * .13) % 1);
      const pts = F.map((q) => {
        const cs = Math.cos(yaw), sn = Math.sin(yaw), z = Math.sin(Math.abs(q[0]) * 3.1) * .12;
        const X = q[0] * cs + z * sn, Z = -q[0] * sn + z * cs, k = 1 / (1 + Z * .5);
        return [cx + X * S * k, cy + (q[1] - my * .06) * S * k, k];
      });
      // ligne de balayage
      const ly = cy - S * .55 + balay * S * 1.1;
      const lg = x.createLinearGradient(0, ly - S * .10, 0, ly + S * .10);
      lg.addColorStop(0, 'rgba(127,224,167,0)'); lg.addColorStop(.5, 'rgba(127,224,167,.055)');
      lg.addColorStop(1, 'rgba(127,224,167,0)');
      x.fillStyle = lg; x.fillRect(0, ly - S * .10, W, S * .20);
      x.lineWidth = .7;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d < S * .11) { x.beginPath(); x.moveTo(pts[i][0], pts[i][1]); x.lineTo(pts[j][0], pts[j][1]);
          x.strokeStyle = 'rgba(210,235,225,' + (1 - d / (S * .11)) * .17 + ')'; x.stroke(); }
      }
      pts.forEach((q) => {
        const pr = Math.abs(q[1] - ly) < S * .06 ? 1 - Math.abs(q[1] - ly) / (S * .06) : 0;
        x.beginPath(); x.arc(q[0], q[1], 1.1 + q[2] * .9 + pr * 1.8, 0, TAU);
        x.fillStyle = 'rgba(255,255,255,' + (.30 + .40 * q[2] + pr * .7) + ')'; x.fill();
      });
    };
    raf = requestAnimationFrame(boucle);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full z-0" />;
}
