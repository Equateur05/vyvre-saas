import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VYVRE — Diagnostic peau IA pour marques cosmétiques',
  description:
    'Le seul diagnostic peau avec un prix public. Infrastructure 100% France 🇫🇷, RGPD natif, on-device, zéro upload photo.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://vyvre.fr'),
  openGraph: {
    title: 'VYVRE — Diagnostic peau IA',
    description: 'Widget white-label · Made in France 🇫🇷',
    url: '/',
    siteName: 'VYVRE',
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400&display=swap"
        />
      </head>
      <body className="bg-bg text-text font-sans antialiased">{children}</body>
    </html>
  );
}
