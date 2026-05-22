/**
 * VYVRE × Resend — Transactional emails
 *
 * All emails are sent from `hello@vyvre.fr` (domain must be verified in Resend).
 * Reply-to: charles@vyvre.fr
 */

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY!;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'VYVRE <hello@vyvre.fr>';
const replyTo = process.env.RESEND_REPLY_TO || 'charles@vyvre.fr';
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || 'https://vyvre.fr';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vyvre.fr';

if (!resendApiKey && process.env.NODE_ENV === 'production') {
  console.warn('[email] RESEND_API_KEY missing — emails will be no-ops');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// ─── Welcome email (sent right after Stripe checkout) ──────────────────
export interface WelcomeEmailParams {
  to: string;
  brandName?: string | null;
  apiKey: string;
  plan: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams) {
  if (!resend) {
    console.warn('[email] skipping welcome email (Resend not configured)');
    return { skipped: true };
  }

  const { to, brandName, apiKey, plan } = params;
  const planLabel = planDisplay(plan);

  const embedCode = `<script src="${cdnUrl}/widget.js"></script>
<div id="vyvre-widget" data-key="${apiKey}"></div>`;

  return resend.emails.send({
    from: fromEmail,
    to: [to],
    replyTo,
    subject: 'Bienvenue chez VYVRE — votre widget est prêt 🇫🇷',
    html: renderWelcomeHtml({ brandName, apiKey, planLabel, embedCode }),
    text: renderWelcomeText({ brandName, apiKey, planLabel, embedCode }),
  });
}

// ─── Auto-upgrade notification ─────────────────────────────────────────
export interface UpgradeEmailParams {
  to: string;
  brandName?: string | null;
  oldPlan: string;
  newPlanLabel: string;
  newQuota: number;
  monthlyEur: number;
}

export async function sendUpgradeEmail(params: UpgradeEmailParams) {
  if (!resend) {
    console.warn('[email] skipping upgrade email (Resend not configured)');
    return { skipped: true };
  }
  const { to, brandName, oldPlan, newPlanLabel, newQuota, monthlyEur } = params;
  const oldQuota = oldPlan === 'pilot' ? '1 000' : oldPlan === 'starter' ? '5 000' : '15 000';

  return resend.emails.send({
    from: fromEmail,
    to: [to],
    replyTo,
    subject: 'Votre plan VYVRE a été mis à jour 🚀',
    html: `
      <div style="font-family:-apple-system,sans-serif;color:#1A1A18;max-width:600px;margin:0 auto;padding:40px 24px">
        <h1 style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:32px;margin:0 0 24px">Bonjour ${brandName || ''},</h1>
        <p>Votre marque grandit — félicitations 🎉</p>
        <p>Suite à votre croissance constante (2 mois consécutifs au-dessus du quota), votre plan a été automatiquement mis à jour.</p>
        <div style="background:#F4F1EA;border-left:3px solid #C8A96E;padding:24px;margin:32px 0">
          <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8B7E6E;margin-bottom:8px">Nouveau plan</div>
          <div style="font-size:24px;font-weight:300;font-family:'Cormorant Garamond',serif">${newPlanLabel}</div>
          <div style="font-size:13px;color:#5A5A58;margin-top:8px">Facturation : ${monthlyEur} €/mois · Quota : ${oldQuota} → ${newQuota.toLocaleString('fr-FR')} scans/mois</div>
        </div>
        <p style="margin-top:32px">
          <a href="${appUrl}/dashboard" style="display:inline-block;background:#1A1A18;color:#F4F1EA;padding:14px 24px;text-decoration:none;font-size:13px;letter-spacing:.15em;text-transform:uppercase">Voir mon dashboard →</a>
        </p>
        <p style="font-size:12px;color:#8B7E6E;margin-top:48px">Désactiver l'auto-upgrade : <a href="${appUrl}/dashboard/billing" style="color:#8B7E6E">Préférences</a></p>
        <hr style="border:0;border-top:1px solid #E8E0CC;margin:40px 0">
        <p style="font-style:italic;font-family:'Cormorant Garamond',serif;font-size:18px;margin:0">Charles Rocher</p>
        <p style="font-size:13px;color:#5A5A58;margin:4px 0 0">Fondateur, VYVRE · vyvre.fr</p>
      </div>
    `,
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────

function planDisplay(plan: string): string {
  switch (plan) {
    case 'pilot':      return 'Pilot — 30 jours gratuits';
    case 'starter':    return 'Starter — 5 000 scans/mois';
    case 'growth':     return 'Growth — 15 000 scans/mois';
    case 'enterprise': return 'Enterprise — 25 000 scans/mois';
    default:           return plan;
  }
}

function renderWelcomeHtml({ brandName, apiKey, planLabel, embedCode }: {
  brandName?: string | null;
  apiKey: string;
  planLabel: string;
  embedCode: string;
}) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bienvenue chez VYVRE</title></head>
<body style="margin:0;padding:0;background:#F4F1EA;font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#1A1A18;line-height:1.55">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="#F4F1EA">
  <tr><td align="center" style="padding:32px 16px 0">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px">
      <tr><td style="background:#FFFFFF;padding:56px 48px">
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;letter-spacing:.02em;color:#1A1A18">VYVRE</div>
        <div style="font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#8B7E6E;margin:8px 0 40px">Diagnostic peau · Made in France 🇫🇷</div>

        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:300;letter-spacing:-.01em;margin:0 0 24px;color:#1A1A18;line-height:1.25">Bonjour ${escapeHtml(brandName || '')},</h1>
        <p style="font-size:15px;margin:0 0 8px">Votre plan <strong>${escapeHtml(planLabel)}</strong> est activé.</p>
        <p style="font-size:15px;margin:0 0 24px">Votre widget VYVRE est configuré et prêt à déployer.</p>

        <p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#8B7E6E;margin-top:36px;margin-bottom:12px">Votre embed code</p>
        <div style="background:#1A1A18;color:#F4F1EA;padding:24px;margin:0 0 28px;font-family:'SF Mono',Monaco,Consolas,'Courier New',monospace;font-size:12px;line-height:1.6;word-break:break-all;border-left:3px solid #C8A96E">
          ${escapeHtml(embedCode).replace(/\n/g, '<br>')}
        </div>

        <p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#8B7E6E;margin-top:36px;margin-bottom:12px">3 étapes pour aller live</p>
        <ol style="margin:0;padding:0;list-style:none">
          <li style="padding:14px 0 14px 36px;position:relative;font-size:15px;border-bottom:1px solid #F0EBE0">
            <span style="position:absolute;left:0;top:14px;width:24px;height:24px;border:1px solid #C8A96E;border-radius:50%;text-align:center;line-height:22px;font-size:11px;color:#C8A96E;font-family:monospace">1</span>
            Collez ce code juste avant <code style="font-family:monospace;font-size:13px;color:#C8A96E">&lt;/body&gt;</code> sur votre site
          </li>
          <li style="padding:14px 0 14px 36px;position:relative;font-size:15px;border-bottom:1px solid #F0EBE0">
            <span style="position:absolute;left:0;top:14px;width:24px;height:24px;border:1px solid #C8A96E;border-radius:50%;text-align:center;line-height:22px;font-size:11px;color:#C8A96E;font-family:monospace">2</span>
            Le widget apparaît immédiatement sur desktop et mobile
          </li>
          <li style="padding:14px 0 14px 36px;position:relative;font-size:15px">
            <span style="position:absolute;left:0;top:14px;width:24px;height:24px;border:1px solid #C8A96E;border-radius:50%;text-align:center;line-height:22px;font-size:11px;color:#C8A96E;font-family:monospace">3</span>
            Vos clientes scannent leur peau — sans télécharger d'app
          </li>
        </ol>

        <p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#8B7E6E;margin-top:36px;margin-bottom:12px">Ce que vous venez d'activer</p>
        <ul style="margin:0;padding:0;list-style:none">
          <li style="padding:8px 0 8px 24px;position:relative;font-size:14px"><span style="position:absolute;left:0;color:#C8A96E;font-weight:600">✓</span> Diagnostic peau 8 paramètres IA (hydratation, rides, pigmentation, pores, éclat, fermeté, rougeurs, sébum)</li>
          <li style="padding:8px 0 8px 24px;position:relative;font-size:14px"><span style="position:absolute;left:0;color:#C8A96E;font-weight:600">✓</span> Recommandations produits personnalisées depuis votre catalogue</li>
          <li style="padding:8px 0 8px 24px;position:relative;font-size:14px"><span style="position:absolute;left:0;color:#C8A96E;font-weight:600">✓</span> 100% on-device — aucune photo stockée, aucune transmission</li>
          <li style="padding:8px 0 8px 24px;position:relative;font-size:14px"><span style="position:absolute;left:0;color:#C8A96E;font-weight:600">✓</span> Infrastructure France 🇫🇷 — RGPD natif</li>
          <li style="padding:8px 0 8px 24px;position:relative;font-size:14px"><span style="position:absolute;left:0;color:#C8A96E;font-weight:600">✓</span> Dashboard analytics en temps réel</li>
        </ul>

        <hr style="border:0;border-top:1px solid #F0EBE0;margin:40px 0">
        <p style="font-size:15px;margin:0 0 24px">Une question, un blocage technique, un besoin de personnalisation ?<br>
        <a href="mailto:charles@vyvre.fr" style="color:#1A1A18;text-decoration:underline">charles@vyvre.fr</a> répond sous 24h ouvrées.</p>
        <a href="${appUrl}/dashboard" style="display:inline-block;padding:14px 28px;background:#1A1A18;color:#F4F1EA;text-decoration:none;font-size:13px;letter-spacing:.15em;text-transform:uppercase">Ouvrir le dashboard →</a>
        <hr style="border:0;border-top:1px solid #F0EBE0;margin:40px 0">
        <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;color:#1A1A18;margin:0 0 4px;font-style:italic">Charles Rocher</p>
        <p style="font-size:14px;color:#2A2A28;margin:0 0 2px">Fondateur, VYVRE</p>
        <p style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#8B7E6E;margin-top:4px">vyvre.fr · Paris · France 🇫🇷</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function renderWelcomeText({ brandName, apiKey, planLabel, embedCode }: {
  brandName?: string | null;
  apiKey: string;
  planLabel: string;
  embedCode: string;
}) {
  return `Bonjour ${brandName || ''},

Votre plan ${planLabel} est activé. Votre widget VYVRE est configuré et prêt à déployer.

═══ Votre embed code ═══

${embedCode}

═══ 3 étapes pour aller live ═══

1. Collez ce code juste avant </body> sur votre site
2. Le widget apparaît immédiatement sur desktop et mobile
3. Vos clientes scannent leur peau — sans télécharger d'app

═══ Votre API key ═══

${apiKey}

═══ Ce que vous venez d'activer ═══

✓ Diagnostic peau 8 paramètres IA
✓ Recommandations produits personnalisées
✓ 100% on-device — aucune photo stockée
✓ Infrastructure France · RGPD natif
✓ Dashboard analytics temps réel

Une question ? charles@vyvre.fr répond sous 24h.

Dashboard : ${appUrl}/dashboard

Charles Rocher
Fondateur, VYVRE
vyvre.fr · Paris, France
`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
