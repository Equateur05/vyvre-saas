'use client';

/** Un chiffre qui se compte jusqu'à sa valeur quand il entre à l'écran. */
import { useEffect, useRef, useState } from 'react';

export default function ProCount({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let raf = 0;
    setN(0);
    const io = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const f = (now: number) => {
        const t = Math.min(1, (now - t0) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <b ref={ref}>{n}</b>;
}
