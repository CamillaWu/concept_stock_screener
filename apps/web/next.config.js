/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev',
    NEXT_PUBLIC_API_BASE_URL_DEV: process.env.NEXT_PUBLIC_API_BASE_URL_DEV || 'http://localhost:8787',
  },
  async rewrites() {
    const apiBaseUrl = process.env.NODE_ENV === 'production'
      ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev')
      : (process.env.NEXT_PUBLIC_API_BASE_URL_DEV || 'http://localhost:8787');
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
