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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&family=JetBrains+Mono:wght@300;400&family=Playfair+Display:ital,wght@1,500&display=swap"
        />
      </head>
      <body className="bg-bg text-text font-sans antialiased">{children}</body>
    </html>
  );
}
