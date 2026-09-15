/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
  async redirects() {
    return [
      { source: '/scan', destination: 'https://vyvre-propals.web.app/VYVRE_SCAN', permanent: false },
      { source: '/scan-universel', destination: 'https://vyvre-propals.web.app/VYVRE_SCAN', permanent: false },
    ];
  },
};

export default nextConfig;
