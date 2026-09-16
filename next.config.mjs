/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
  async redirects() {
    return [
      { source: '/scan-universel', destination: '/scan', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/scan', destination: '/scan/index.html' },
      { source: '/scan/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html' },
      { source: '/manifeste', destination: '/manifeste/index.html' },
    ];
  },
};

export default nextConfig;
