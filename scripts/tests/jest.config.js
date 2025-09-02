module.exports = {
  // 測試環境
  testEnvironment: 'node',
  
  // 測試文件匹配模式
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // 測試覆蓋率收集
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/legacy/**',
    '!**/*.config.js'
  ],
  
  // 覆蓋率報告目錄
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // 覆蓋率閾值
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // 測試超時時間
  testTimeout: 30000,
  
  // 設置文件
  setupFilesAfterEnv: ['<rootDir>/setup.js'],
  
  // 模組路徑映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1'
  },
  
  // 轉換器
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // 測試路徑
  roots: [
    '<rootDir>/unit',
    '<rootDir>/integration',
    '<rootDir>/e2e',
    '<rootDir>/performance'
  ],
  
  // 測試報告
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ]
};
