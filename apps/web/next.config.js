/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@concept-stock-screener/types',
    '@concept-stock-screener/ui',
  ],
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
  },
  // 構建配置
  distDir: '.next',
  // 移除可能導致 Vercel 部署問題的配置
  // output: 'standalone', // 與 Vercel 不兼容
  // generateBuildId: async () => { // 可能導致構建不穩定
  //   return 'build-' + Date.now();
  // },
  // 簡化 webpack 配置
  webpack: config => {
    // 忽略某些可能導致循環依賴的模組
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

module.exports = nextConfig;
