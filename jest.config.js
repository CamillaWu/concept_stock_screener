module.exports = {
  // 測試環境
  testEnvironment: 'jsdom',

  // 測試文件匹配模式
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(spec|test).(ts|tsx|js|jsx)',
    '**/*.test.(ts|tsx|js|jsx)',
    '**/*.spec.(ts|tsx|js|jsx)',
    '**/__tests__/**/*.test.(ts|tsx|js|jsx)',
    '**/__tests__/**/*.spec.(ts|tsx|js|jsx)'
  ],

  // 測試文件擴展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 轉換器配置 - 統一使用 Babel 處理所有文件
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },

  // 轉換器預設 - 移除 ts-jest 預設以支援 Babel 轉換
  // preset: 'ts-jest',

  // 測試路徑
  roots: [
    '<rootDir>'
  ],

  // 模組路徑映射
  moduleNameMapper: {
    '^@concept-stock-screener/(.*)$': '<rootDir>/packages/$1/src',
    '^@/(.*)$': '<rootDir>/apps/web/src/$1'
  },

  // 收集覆蓋率的文件
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx,js,jsx}',
    'packages/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/scripts/**'
  ],

  // 覆蓋率目錄
  coverageDirectory: 'coverage',

  // 覆蓋率報告器
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],

  // 覆蓋率閾值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // 測試設置文件
  setupFilesAfterEnv: [
    '<rootDir>/scripts/test-setup.js'
  ],

  // 測試超時
  testTimeout: 30000,

  // 清除模擬
  clearMocks: true,

  // 恢復模擬
  restoreMocks: true,

  // 模擬重置
  resetMocks: true,

  // 收集覆蓋率
  collectCoverage: true,

  // 強制覆蓋率收集
  forceCoverageMatch: [],

  // 測試環境變數
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },

  // 模組路徑
  modulePaths: [
    '<rootDir>'
  ],

  // 測試路徑忽略
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],

  // 轉換忽略
  transformIgnorePatterns: [
    '/node_modules/(?!(@concept-stock-screener)/)'
  ],

  // 全局設置 - 移除 ts-jest 配置
  globals: {}
};
