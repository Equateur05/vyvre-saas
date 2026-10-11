/** VYVRE — /dashboard/billing : aucun portail client Stripe n'existe encore dans le code, on donne un contact. */
import type { Metadata } from 'next';
import EspaceMarque, { CONTACT } from '../EspaceMarque';
import { getPage } from '../../../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('dash.bill.meta'), robots: { index: false, follow: false } };
}

export default function BillingPage() {
  const { t } = getPage();
  return (
    <EspaceMarque
      eyebrow={t('dash.bill.eyebrow')}
      h1a={t('dash.bill.h1a')}
      h1b={t('dash.bill.h1b')}
      p={t('dash.bill.p')}
      cta={t('dash.bill.cta')}
      ctaHref={`mailto:${CONTACT}?subject=${encodeURIComponent(t('dash.bill.subject'))}`}
      ask={t('dash.ask')}
      other={t('dash.bill.back')}
      otherHref="/dashboard"
      home={t('dash.home')}
    />
  );
}
