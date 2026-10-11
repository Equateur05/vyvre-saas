/** VYVRE — /dashboard : l'espace marque est en cours d'ouverture (plus de page introuvable). */
import type { Metadata } from 'next';
import EspaceMarque, { CONTACT } from './EspaceMarque';
import { getPage } from '../../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t } = getPage();
  return { title: t('dash.meta.title'), robots: { index: false, follow: false } };
}

export default function DashboardPage() {
  const { t } = getPage();
  return (
    <EspaceMarque
      eyebrow={t('dash.eyebrow')}
      h1a={t('dash.h1a')}
      h1b={t('dash.h1b')}
      p={t('dash.p')}
      cta={CONTACT}
      ctaHref={`mailto:${CONTACT}?subject=${encodeURIComponent(t('dash.subject'))}`}
      ask={t('dash.ask')}
      other={t('dash.billing')}
      otherHref="/dashboard/billing"
      home={t('dash.home')}
    />
  );
}
