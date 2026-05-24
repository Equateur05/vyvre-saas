/**
 * VYVRE — /success page
 *
 * Affiché après un checkout Stripe réussi.
 * Stripe Payment Links → redirect ici avec ?session_id={CHECKOUT_SESSION_ID}
 *
 * Comportement :
 * 1. Server fetch GET /api/stripe/session?id=xxx (provisionne la marque idempotemment)
 * 2. Affiche l'embed code prêt à copier avec l'API key réelle
 * 3. Boutons "Copier le code" + "Accéder au dashboard"
 */

import Link from 'next/link';
import EmbedCard from './EmbedCard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

async function fetchSession(sessionId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/stripe/session?id=${encodeURIComponent(sessionId)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as {
      status: string;
      email: string;
      brand_name: string | null;
      plan: string;
      api_key: string;
      is_new: boolean;
      welcome_email_sent: boolean;
    };
  } catch (err) {
    console.error('[success page] fetch session failed', err);
    return null;
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-md text-center flex flex-col items-center gap-6">
          <h1 className="font-sans text-4xl font-extralight -tracking-[0.02em]">Session introuvable</h1>
          <p className="text-text/60">L'URL ne contient pas de <code className="font-mono text-accent">session_id</code>.</p>
          <Link href="/" className="btn-secondary">Retour à l'accueil</Link>
        </div>
      </main>
    );
  }

  const session = await fetchSession(sessionId);

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-md text-center flex flex-col items-center gap-6">
          <h1 className="font-sans text-4xl font-extralight -tracking-[0.02em]">Erreur de provisioning</h1>
          <p className="text-text/60">Impossible de récupérer la session Stripe. Si vous avez bien payé, vous recevrez votre embed code par email sous quelques minutes.</p>
          <p className="text-xs text-text/40 font-mono">Besoin d'aide ? <a href="mailto:charles@symphonydrive.com" className="text-accent">charles@symphonydrive.com</a></p>
        </div>
      </main>
    );
  }

  // Webhook not yet fired? (session.status !== 'complete' or api_key missing)
  if (session.status !== 'complete' || !session.api_key) {
    return (
      <main className="min-h-screen flex items-center justify-center px-8 py-20">
        <div className="max-w-md text-center flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <h1 className="font-sans text-3xl font-extralight -tracking-[0.02em]">Activation en cours…</h1>
          <p className="text-text/60">Votre clé API arrive dans quelques secondes. Cette page se rafraîchira automatiquement.</p>
          <meta httpEquiv="refresh" content="3" />
        </div>
      </main>
    );
  }

  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://vyvre.fr';
  const embedCode = `<script src="${cdnUrl}/widget.js"></script>
<div id="vyvre-widget" data-key="${session.api_key}"></div>`;

  const planLabel = planDisplay(session.plan);

  return (
    <main className="min-h-screen px-8 py-12 md:py-20">
      <div className="max-w-2xl mx-auto flex flex-col gap-10">

        {/* ===== Check + Title ===== */}
        <div className="flex flex-col items-center gap-6 text-center">
          <CheckIcon />
          <div>
            <h1 className="font-sans text-4xl md:text-5xl font-extralight -tracking-[0.025em] leading-tight">
              Bienvenue chez VYVRE <span className="text-accent font-light">🇫🇷</span>
            </h1>
            <p className="mt-3 text-text/60">Votre plan <span className="text-text">{planLabel}</span> est activé. Votre widget est prêt à déployer.</p>
          </div>
        </div>

        {/* ===== Embed Code (client component for clipboard) ===== */}
        <EmbedCard embedCode={embedCode} apiKey={session.api_key} />

        {/* ===== 3 Steps ===== */}
        <section>
          <div className="text-[10px] tracking-[0.3em] uppercase text-text/45 mb-4 font-mono">3 étapes pour aller live</div>
          <ol className="flex flex-col gap-3">
            <Step n={1}>Collez ce code juste avant <code className="font-mono text-accent">&lt;/body&gt;</code> sur votre site</Step>
            <Step n={2}>Le widget apparaît immédiatement sur desktop et mobile</Step>
            <Step n={3}>Vos clientes scannent leur peau — sans télécharger d'app</Step>
          </ol>
        </section>

        {/* ===== What you just activated ===== */}
        <section>
          <div className="text-[10px] tracking-[0.3em] uppercase text-text/45 mb-4 font-mono">Ce que vous avez activé</div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm text-text/75">
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> Diagnostic peau 8 paramètres IA</li>
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> Recommandations produits personnalisées</li>
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> 100% on-device — aucune photo stockée</li>
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> Infrastructure France 🇫🇷 — RGPD natif</li>
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> Dashboard analytics temps réel</li>
            <li className="flex items-start gap-2"><span className="text-accent">✓</span> Support email 48h</li>
          </ul>
        </section>

        {/* ===== CTA Dashboard + Support ===== */}
        <div className="flex flex-col sm:flex-row gap-3 items-center pt-4">
          <Link href="/dashboard" className="btn-primary w-full sm:w-auto">Accéder à mon dashboard →</Link>
          <a href="mailto:charles@symphonydrive.com" className="text-sm text-text/60 hover:text-text underline underline-offset-4 decoration-text/30">Une question ? charles@symphonydrive.com</a>
        </div>

        {/* ===== Footer note ===== */}
        <div className="mt-8 pt-8 border-t border-line text-center">
          <p className="font-sans font-light text-lg text-text/80">Charles Rocher</p>
          <p className="text-sm text-text/60">Fondateur, VYVRE</p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text/40 mt-2">vyvre.fr · Paris · France</p>
        </div>
      </div>
    </main>
  );
}

// ───────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────

function planDisplay(plan: string): string {
  switch (plan) {
    case 'pilot':      return 'Pilot — 30 jours gratuits';
    case 'starter':    return 'Starter';
    case 'growth':     return 'Growth';
    case 'enterprise': return 'Enterprise';
    default:           return plan;
  }
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4 py-3 border-b border-line last:border-b-0">
      <span className="w-7 h-7 rounded-full border border-accent text-accent text-xs font-mono flex items-center justify-center flex-shrink-0">{n}</span>
      <span className="text-sm md:text-base text-text/85 leading-relaxed">{children}</span>
    </li>
  );
}

function CheckIcon() {
  return (
    <div className="w-20 h-20 rounded-full bg-accent/15 border border-accent flex items-center justify-center">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M9 18.5l5.5 5.5L27 11.5" stroke="#C8A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
