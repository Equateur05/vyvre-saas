'use client';

/** Sphère de points en rotation lente (rappel du logo), dessinée en SVG, sans canvas. */
import { useEffect, useRef } from 'react';

export default function ProOrb() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = 520, ns = 'http://www.w3.org/2000/svg';
    const P: number[][] = [], C: SVGCircleElement[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      P.push([Math.cos(th) * r, y, Math.sin(th) * r]);
      const c = document.createElementNS(ns, 'circle') as SVGCircleElement;
      svg.appendChild(c);
      C.push(c);
    }
    let a = 0, vis = true, raf = 0;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((e) => { vis = e[0].isIntersecting; }) : null;
    if (io) io.observe(svg);
    const cb = Math.cos(0.38), sb = Math.sin(0.38);
    const frame = () => {
      if (vis && svg.getBoundingClientRect().width > 0) {
        a += 0.0035;
        const ca = Math.cos(a), sa = Math.sin(a);
        for (let i = 0; i < N; i++) {
          const p = P[i];
          const x = p[0] * ca + p[2] * sa;
          let z = -p[0] * sa + p[2] * ca;
          const y = p[1] * cb - z * sb;
          z = p[1] * sb + z * cb;
          const k = (z + 1) / 2;
          C[i].setAttribute('cx', (x * 88).toFixed(2));
          C[i].setAttribute('cy', (y * 88).toFixed(2));
          C[i].setAttribute('r', (0.35 + k * 1.05).toFixed(2));
          C[i].setAttribute('fill', k > 0.5 ? `rgba(240,229,200,${(0.15 + k * 0.65).toFixed(2)})` : `rgba(245,244,240,${(0.04 + k * 0.2).toFixed(2)})`);
        }
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    frame();
    return () => { cancelAnimationFrame(raf); if (io) io.disconnect(); C.forEach((c) => c.remove()); };
  }, []);
  return <svg ref={ref} className="vp-orb" viewBox="-100 -100 200 200" aria-hidden="true" />;
}
