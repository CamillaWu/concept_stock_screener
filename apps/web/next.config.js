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
  // 構建優化
  experimental: {
    // 禁用一些可能導致問題的實驗性功能
    optimizeCss: false,
    scrollRestoration: false,
  },
  // 構建配置
  distDir: '.next',
  // 輸出配置
  output: 'standalone',
  // 構建追蹤優化
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // 忽略某些文件
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // 構建時忽略某些路徑
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
