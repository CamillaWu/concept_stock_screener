/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@concept-stock-screener/types', '@concept-stock-screener/ui'],
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
  },
};

module.exports = nextConfig;
