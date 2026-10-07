/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
  async redirects() {
    return [
      { source: '/scan-universel', destination: '/scan', permanent: false },
      // l'ancienne page anglaise est devenue la page unique, servie en anglais
      { source: '/pricing/en', destination: '/pricing?lang=en', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/m/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      { source: '/scan/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      { source: '/manifeste/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      /* la page de travail des animations de chargement n'a plus de route publique ;
         son fichier reste servi par son chemin brut, on interdit au moins l'indexation. */
      { source: '/propals/chargement/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/scan/index.html' },
      ],
      afterFiles: [
      { source: '/scan', destination: '/scan/index.html' },
      { source: '/cheveux', destination: '/cheveux/index.html' },
      { source: '/m/:brand/cheveux', destination: '/cheveux/index.html?b=:brand' },
      { source: '/scan/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html' },
      { source: '/manifeste', destination: '/manifeste/index.html' },
      /* /chargements retiree le 19/09 : page de travail interne (propales d'animations
         de chargement, mentions « A placer »). Le fichier reste dans
         public/propals/chargement/ et s'ouvre en local, il n'est plus servi en ligne. */
      { source: '/m/:brand', destination: '/m/index.html?b=:brand' },
      { source: '/m/:brand/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html?b=:brand' },
      /* 07/10/2026 : la fin de chaque Wrap aliments ecrit « liste sur vyvre.fr/wrap/credits » (credits des photos) */
      { source: '/wrap/credits', destination: '/wrap/credits.html' },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
