'use client';

/**
 * VYVRE — Embed code card with clipboard copy
 *
 * Client component so we can use clipboard API + animated "Copied" state.
 */

import { useState } from 'react';

export default function EmbedCard({
  apiKey,
  cdnUrl,
  initialTheme = 'dark',
}: {
  apiKey: string;
  cdnUrl: string;
  initialTheme?: 'dark' | 'light';
}) {
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);

  const embedCode = `<script src="${cdnUrl}/widget.js"></script>
<div id="vyvre-widget" data-key="${apiKey}" data-theme="${theme}"></div>`;

  async function copy(text: string, setter: (v: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('clipboard error', err);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ===== Embed code box ===== */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Votre embed code</div>
          <div className="flex items-center gap-3">
            {/* Toggle thème du widget */}
            <div className="inline-flex items-center gap-1 p-0.5 border border-line rounded-full text-[10px] font-mono tracking-[0.1em] uppercase">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-full transition-colors ${theme === 'dark' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
              >
                Noir
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-full transition-colors ${theme === 'light' ? 'bg-text text-bg' : 'text-text/55 hover:text-text'}`}
              >
                Blanc
              </button>
            </div>
            <button
              type="button"
              onClick={() => copy(embedCode, setCopiedEmbed)}
              className="text-xs tracking-[0.15em] uppercase font-mono text-text/60 hover:text-accent transition-colors"
            >
              {copiedEmbed ? '✓ Copié' : 'Copier'}
            </button>
          </div>
        </div>
        <pre className="glass p-5 rounded-none border-l-2 border-accent font-mono text-[12px] md:text-[13px] leading-relaxed text-text/90 overflow-x-auto whitespace-pre-wrap break-all select-all">
{embedCode}
        </pre>
      </div>

      {/* ===== API key (smaller, separate) ===== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] tracking-[0.3em] uppercase text-text/45 font-mono">Votre API key</div>
          <button
            type="button"
            onClick={() => copy(apiKey, setCopiedKey)}
            className="text-xs tracking-[0.15em] uppercase font-mono text-text/60 hover:text-accent transition-colors"
          >
            {copiedKey ? '✓ Copié' : 'Copier la clé'}
          </button>
        </div>
        <code className="block font-mono text-[12px] md:text-[13px] text-text/85 select-all bg-bg/50 border border-line px-4 py-3 break-all">
          {apiKey}
        </code>
        <p className="mt-2 text-[11px] text-text/45 font-mono tracking-[0.05em]">
          Conservez cette clé — elle identifie votre marque dans les analytics.
        </p>
      </div>
    </div>
  );
}
