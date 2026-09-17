'use client';
import { useEffect, useState } from 'react';

/**
 * Intro « La fusion » (validée par Charles le 17/09/2026), une fois par session.
 * public/intro/fusion.html joue la scène dans une iframe transparente, puis fait glisser
 * le logo jusqu'au « VYVRE » du menu : on lui donne ce rectangle, il répond 'fin'.
 */
const KEY = 'vyvre-intro-vue';
// décidé une seule fois par chargement (React StrictMode rejoue les effets en dev)
let jouer: boolean | null = null;

export default function IntroFusion() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (jouer === null) {
      let vue = false;
      try { vue = sessionStorage.getItem(KEY) === '1'; sessionStorage.setItem(KEY, '1'); } catch { /* navigation privée */ }
      jouer = !vue || new URLSearchParams(location.search).has('intro'); // ?intro pour la revoir
    }
    if (!jouer) return;
    document.documentElement.classList.add('vy-intro-on');
    setOn(true);
    const fin = () => {
      jouer = false;
      document.documentElement.classList.remove('vy-intro-on');
      setOn(false);
    };
    let demarre = false;
    // si l'intro n'a rien dessiné en 3 s (navigateur sans WebGL2, onglet en arrière-plan, erreur), on rend le site
    const pasDemarre = window.setTimeout(() => { if (!demarre) fin(); }, 3000);
    const onMsg = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.vyvreIntro === 'debut') demarre = true;
      if (e.data.vyvreIntro === 'fin') fin();
    };
    window.addEventListener('message', onMsg);
    const secours = window.setTimeout(fin, 8000);
    return () => { window.removeEventListener('message', onMsg); window.clearTimeout(secours); window.clearTimeout(pasDemarre); };
  }, []);

  if (!on) return null;
  const envoyerCible = (f: HTMLIFrameElement) => {
    const el = document.querySelector('[data-vyvre-logo]');
    if (!el || !f.contentWindow) return;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize) || 14;
    const ls = (parseFloat(cs.letterSpacing) || 0) / fs; // espacement en em (0,22 dans le menu)
    // le navigateur ajoute l'espacement après le dernier « E » : on le retire de la largeur
    f.contentWindow.postMessage({ vyvreIntroCible: { x: r.left, y: r.top, w: r.width - ls * fs, h: r.height, ls, fs } }, '*');
  };
  return (
    <iframe
      src="/intro/fusion.html"
      title="VYVRE"
      aria-hidden="true"
      onLoad={(e) => envoyerCible(e.currentTarget)}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', border: 0, zIndex: 9999, background: 'transparent', colorScheme: 'normal' }}
    />
  );
}
