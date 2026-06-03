'use client';

/**
 * VYVRE — Bascule thème sombre / clair pour l'app /dior.
 * Applique la classe `vyvre-light` sur <html> (le CSS .vyvre-light .dior-app gère le reste).
 * Choix persistant (localStorage). Visible sur tous les écrans (bouton fixe).
 */

import { useEffect, useState } from 'react';

function apply(light: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('vyvre-light', light);
  }
}

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    let v = false;
    try {
      v = localStorage.getItem('vyvre_theme') === 'light';
    } catch {
      /* noop */
    }
    setLight(v);
    apply(v);
  }, []);

  function toggle() {
    const nv = !light;
    setLight(nv);
    apply(nv);
    try {
      localStorage.setItem('vyvre_theme', nv ? 'light' : 'dark');
    } catch {
      /* noop */
    }
  }

  return (
    <button className="vyvre-theme-toggle" onClick={toggle} aria-label="Basculer le thème" title="Thème clair / sombre">
      {light ? '☾  Sombre' : '☀  Clair'}
    </button>
  );
}
