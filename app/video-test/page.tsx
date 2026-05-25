/**
 * VYVRE — /video-test
 * Page de test des 4 variantes couleur hero video.
 * Choix final → on garde celle qui te plait + on intègre dans homepage.
 */

import Link from 'next/link';

export const metadata = {
  title: 'Hero video — color test · VYVRE',
};

const VARIANTS = [
  { color: 'Green (original)', file: '/videos/hero-scan-green.mp4', tint: '#7FE0A7', desc: 'Mint green VYVRE signature' },
  { color: 'Blue électrique', file: '/videos/hero-scan-blue.mp4', tint: '#7DA8E8', desc: 'Cyan tech / Apple Health' },
  { color: 'Orange chaleureux', file: '/videos/hero-scan-orange.mp4', tint: '#E8A87D', desc: 'Glow naturel / lumière dorée' },
  { color: 'Rose magenta', file: '/videos/hero-scan-pink.mp4', tint: '#E87DCE', desc: 'Beauté éditoriale / fashion' },
];

export default function VideoTestPage() {
  return (
    <main className="min-h-screen px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-xs font-mono tracking-[0.22em] uppercase text-text/55 hover:text-text">
          ← Accueil
        </Link>

        <h1 className="font-sans text-4xl md:text-5xl font-thin mt-8 mb-2 -tracking-[0.025em]">
          Hero video <em className="not-italic text-text/55">— color test</em>
        </h1>
        <p className="text-sm text-text/55 font-extralight mb-12 max-w-2xl">
          4 variantes couleur de la vidéo hero. Dis-moi laquelle tu préfères → je l'intègre dans la homepage. Chaque vidéo : 1920×1080 paysage, 5s, ~2MB.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VARIANTS.map((v) => (
            <div key={v.color} className="v6 p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: v.tint }}>
                    {v.color}
                  </div>
                  <div className="text-sm text-text/55 font-extralight mt-1">{v.desc}</div>
                </div>
                <div className="w-8 h-8 rounded-full" style={{ background: v.tint }} />
              </div>
              <video
                src={v.file}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-lg"
                style={{ aspectRatio: '16/9' }}
              />
              <a
                href={v.file}
                download
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/45 hover:text-text"
              >
                Télécharger ↓
              </a>
            </div>
          ))}
        </div>

        <div className="mt-16 v6-soft p-6 max-w-2xl">
          <h2 className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent mb-3">
            Note technique
          </h2>
          <p className="text-sm text-text/65 font-extralight leading-relaxed">
            Source originale : portrait 560×704. Convertie en landscape 1920×1080 avec background <strong>blurred mirror</strong> (le visage centré, blur derrière pour combler les côtés — premium style Apple keynote). Variantes via <code className="text-accent">ffmpeg hue rotation</code> appliquée à toute l'image.
          </p>
        </div>
      </div>
    </main>
  );
}
