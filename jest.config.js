module.exports = {
  // 皜祈岫?啣?
  testEnvironment: 'jsdom',

  // 皜祈岫?辣?寥?璅∪?
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(spec|test).(ts|tsx|js|jsx)',
  ],

  // 皜祈岫?辣?游???
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 頧??券?蝵?- 雿輻 Babel ?????隞?
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  // Skip compiled output directories so we only run source tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // 璅∠?頝臬???
  moduleNameMapper: {
    '^@concept-stock-screener/(.*)$': '<rootDir>/packages/$1/src',
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
  },

  // ?園?閬????辣
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx,js,jsx}',
    'apps/web/src/**/*.{ts,tsx,js,jsx}',
    'apps/api/src/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/scripts/**',
    '!**/.next/**',
    '!**/index.ts',
  ],

  // 閬????
  coverageDirectory: 'coverage',

  // 閬???
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // 閬????
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // 皜祈岫閮剔蔭?辣
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 皜祈岫頞?
  testTimeout: 30000,

  // 皜璅⊥
  clearMocks: true,

  // ?園?閬???
  collectCoverage: false,

  // 皜祈岫?啣?霈
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  // 頧?敹賜
  transformIgnorePatterns: ['/node_modules/(?!(@concept-stock-screener)/)'],
};
