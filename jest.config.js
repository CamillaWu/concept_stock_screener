module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // File patterns picked up by Jest
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(spec|test).(ts|tsx|js|jsx)',
  ],

  // Resolvable extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Use Babel for TS/JS transformation
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },

  // Skip compiled output directories so we only run source tests
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Module alias support
  moduleNameMapper: {
    '^@concept-stock-screener/(.*)$': '<rootDir>/packages/$1/src',
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^@ui/(.*)$': '<rootDir>/packages/ui/src/$1',
  },

  // Coverage collection scope
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

  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 30000,
  clearMocks: true,
  collectCoverage: false,

  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  transformIgnorePatterns: ['/node_modules/(?!(@concept-stock-screener)/)'],
};
