import type { Metadata } from 'next';
import './globals.css';
import { getPage } from '../lib/i18n/server';

export function generateMetadata(): Metadata {
  const { t, lang } = getPage();
  return {
    title: t('home.meta.title'),
    description: t('home.meta.desc'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vyvre.fr'),
    openGraph: {
      title: t('home.meta.title'),
      description: t('home.meta.desc'),
      url: '/',
      siteName: 'VYVRE',
      locale: lang,
      type: 'website',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { htmlLang, dir } = getPage();
  return (
    <html lang={htmlLang} dir={dir}>
      <head>
        {/* 15/10/2026 : polices servies par vyvre.fr (public/fonts), plus aucun appel a Google Fonts */}
        <link rel="stylesheet" href="/fonts/vyvre-fonts.css?v=1" />
      </head>
      <body className="bg-bg text-text font-sans antialiased">{children}</body>
    </html>
  );
}
