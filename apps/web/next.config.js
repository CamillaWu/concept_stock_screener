/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev',
  },
        async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: `${process.env.API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev'}/:path*`,
          },
        ];
      },
};

module.exports = nextConfig;
