'use client';

/**
 * VYVRE — Embed code card with clipboard copy
 *
 * Client component so we can use clipboard API + animated "Copied" state.
 */

import { useState } from 'react';

export default function EmbedCard({
  embedCode,
  apiKey,
}: {
  embedCode: string;
  apiKey: string;
}) {
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

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
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] tracking-[0.3em] uppercase text-accent font-mono">Votre embed code</div>
          <button
            type="button"
            onClick={() => copy(embedCode, setCopiedEmbed)}
            className="text-xs tracking-[0.15em] uppercase font-mono text-text/60 hover:text-accent transition-colors"
          >
            {copiedEmbed ? '✓ Copié' : 'Copier'}
          </button>
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
