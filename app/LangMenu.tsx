'use client';

/**
 * VYVRE — sélecteur de langue des pages Next.
 *
 * Même pastille de verre, mêmes douze langues et surtout même mémoire que le
 * sélecteur du scan (/scan/vy-i18n.js) : la clé « vyvre-lang » est partagée,
 * en localStorage pour les pages statiques et en cookie pour le rendu serveur.
 * Le choix fait sur le scan suit donc l'utilisateur sur tout le site.
 */

import { useEffect, useRef, useState } from 'react';
import { LANGS, LANG_KEY, normalizeLang, type Lang } from '../lib/i18n/langs';

const ONE_YEAR = 60 * 60 * 24 * 365;

function readStored(): Lang | null {
  try {
    return normalizeLang(window.localStorage.getItem(LANG_KEY));
  } catch {
    return null;
  }
}

function remember(lang: Lang) {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* navigation privée : le cookie suffit */
  }
  document.cookie = `${LANG_KEY}=${lang};path=/;max-age=${ONE_YEAR};samesite=lax`;
}

export default function LangMenu({ lang, label }: { lang: Lang; label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  /* Accord entre la mémoire du scan (localStorage) et celle du serveur (cookie). */
  useEffect(() => {
    const url = new URL(window.location.href);
    const asked = normalizeLang(url.searchParams.get('lang'));
    if (asked) {
      remember(asked);
      return;
    }
    const stored = readStored();
    if (stored && stored !== lang) {
      remember(stored);
      window.location.reload();
      return;
    }
    if (!stored) remember(lang);
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('click', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  function choose(next: Lang) {
    setOpen(false);
    remember(next);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.location.href = url.toString();
  }

  return (
    <div id="vy-lang" ref={root} className={open ? 'on' : undefined}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="vy-lang-code">{lang.toUpperCase()}</span>
        <i aria-hidden="true">▾</i>
      </button>
      <ul>
        {LANGS.map((l) => (
          <li key={l.c}>
            <button
              type="button"
              aria-current={l.c === lang}
              onClick={() => choose(l.c)}
            >
              <b>{l.c.toUpperCase()}</b>
              <span>{l.n}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
