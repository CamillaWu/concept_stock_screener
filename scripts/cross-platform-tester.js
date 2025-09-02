#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 檢測作業系統
function detectOS() {
  const platform = process.platform;

  if (platform === 'win32') {
    return 'windows';
  } else if (platform === 'darwin') {
    return 'macos';
  } else {
    return 'unknown';
  }
}

class CrossPlatformTester {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
    this.projectRoot = process.cwd();
    this.testResults = [];
  }

  // 檢測測試環境
  detectTestEnvironment() {
    console.log('🔍 檢測測試環境...');

    const env = {
      platform: this.platform,
      nodeVersion: process.version,
      npmVersion: this.getToolVersion('npm'),
      pnpmVersion: this.getToolVersion('pnpm'),
      gitVersion: this.getToolVersion('git'),
      availableMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
      cpuCores: os.cpus().length,
      tempDir: os.tmpdir(),
      homeDir: os.homedir()
    };

    Object.entries(env).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    return env;
  }

  // 獲取工具版本
  getToolVersion(tool) {
    try {
      return execSync(`${tool} --version`, { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  // 檢查測試依賴
  checkTestDependencies() {
    console.log('\n📦 檢查測試依賴...');

    const dependencies = [
      'jest',
      '@types/jest',
      'ts-jest',
      'supertest',
      'playwright'
    ];

    const missing = [];

    dependencies.forEach(dep => {
      try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasDep = packageJson.devDependencies && packageJson.devDependencies[dep];

        if (hasDep) {
          console.log(`✅ ${dep}: 已安裝`);
        } else {
          console.log(`❌ ${dep}: 未安裝`);
          missing.push(dep);
        }
      } catch (error) {
        console.log(`⚠️  無法檢查 ${dep}: ${error.message}`);
      }
    });

    if (missing.length > 0) {
      console.log(`\n⚠️  缺少測試依賴: ${missing.join(', ')}`);
      this.installTestDependencies(missing);
    }

    return missing.length === 0;
  }

  // 安裝測試依賴
  installTestDependencies(dependencies) {
    console.log('\n📥 安裝測試依賴...');

    try {
      execSync(`pnpm add -D ${dependencies.join(' ')}`, { stdio: 'inherit' });
      console.log('✅ 測試依賴安裝完成');
    } catch (error) {
      console.log('❌ 測試依賴安裝失敗:', error.message);
    }
  }

  // 創建測試配置
  createTestConfig() {
    console.log('\n⚙️  創建測試配置...');

    const jestConfig = {
      preset: 'ts-jest',
      testEnvironment: 'node',
      roots: ['<rootDir>/apps', '<rootDir>/packages'],
      testMatch: [
        '**/__tests__/**/*.ts',
        '**/?(*.)+(spec|test).ts'
      ],
      transform: {
        '^.+\\.ts$': 'ts-jest'
      },
      collectCoverageFrom: [
        'apps/**/*.ts',
        'packages/**/*.ts',
        '!**/*.d.ts',
        '!**/node_modules/**'
      ],
      coverageDirectory: 'coverage',
      coverageReporters: ['text', 'lcov', 'html'],
      setupFilesAfterEnv: ['<rootDir>/scripts/test-setup.js']
    };

    const configPath = path.join(this.projectRoot, 'jest.config.js');
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(jestConfig, null, 2)};`);

    console.log('✅ Jest 配置創建完成');
    return configPath;
  }

  // 創建測試設置文件
  createTestSetup() {
    console.log('\n🔧 創建測試設置...');

    const setupContent = `
// 測試環境設置
process.env.NODE_ENV = 'test';

// 模擬環境變數
process.env.GEMINI_API_KEY = 'test-key';
process.env.PINECONE_API_KEY = 'test-key';
process.env.PINECONE_ENVIRONMENT = 'test';

// 設置測試超時
jest.setTimeout(30000);

// 清理測試數據
afterEach(() => {
  jest.clearAllMocks();
});

// 全局測試工具
global.testUtils = {
  createMockData: () => ({
    id: 'test-id',
    name: 'test-name',
    timestamp: new Date().toISOString()
  }),

  createMockApiResponse: (data) => ({
    success: true,
    data,
    timestamp: new Date().toISOString()
  })
};
`;

    const setupPath = path.join(this.projectRoot, 'scripts', 'test-setup.js');
    fs.writeFileSync(setupPath, setupContent);

    console.log('✅ 測試設置文件創建完成');
    return setupPath;
  }

  // 運行單元測試
  async runUnitTests() {
    console.log('\n🧪 運行單元測試...');

    try {
      await this.runCommand('pnpm', ['test', '--testPathPattern=unit']);
      this.testResults.push({ type: 'unit', status: 'passed' });
      console.log('✅ 單元測試通過');
    } catch (error) {
      this.testResults.push({ type: 'unit', status: 'failed', error: error.message });
      console.log('❌ 單元測試失敗:', error.message);
    }
  }

  // 運行整合測試
  async runIntegrationTests() {
    console.log('\n🔗 運行整合測試...');

    try {
      await this.runCommand('pnpm', ['test', '--testPathPattern=integration']);
      this.testResults.push({ type: 'integration', status: 'passed' });
      console.log('✅ 整合測試通過');
    } catch (error) {
      this.testResults.push({ type: 'integration', status: 'failed', error: error.message });
      console.log('❌ 整合測試失敗:', error.message);
    }
  }

  // 運行 E2E 測試
  async runE2ETests() {
    console.log('\n🌐 運行 E2E 測試...');

    try {
      await this.runCommand('pnpm', ['test', '--testPathPattern=e2e']);
      this.testResults.push({ type: 'e2e', status: 'passed' });
      console.log('✅ E2E 測試通過');
    } catch (error) {
      this.testResults.push({ type: 'e2e', status: 'failed', error: error.message });
      console.log('❌ E2E 測試失敗:', error.message);
    }
  }

  // 運行性能測試
  async runPerformanceTests() {
    console.log('\n⚡ 運行性能測試...');

    try {
      await this.runCommand('pnpm', ['test', '--testPathPattern=performance']);
      this.testResults.push({ type: 'performance', status: 'passed' });
      console.log('✅ 性能測試通過');
    } catch (error) {
      this.testResults.push({ type: 'performance', status: 'failed', error: error.message });
      console.log('❌ 性能測試失敗:', error.message);
    }
  }

  // 運行所有測試
  async runAllTests() {
    console.log('\n🚀 運行所有測試...');

    await this.runUnitTests();
    await this.runIntegrationTests();
    await this.runE2ETests();
    await this.runPerformanceTests();

    this.generateTestReport();
  }

  // 執行命令
  runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: this.isWindows,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`命令執行失敗，退出碼: ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  // 生成測試報告
  generateTestReport() {
    console.log('\n📊 測試結果報告:');

    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const total = this.testResults.length;

    console.log(`總計: ${total} 項測試`);
    console.log(`通過: ${passed} 項`);
    console.log(`失敗: ${failed} 項`);

    this.testResults.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.type}: ${result.status}`);
      if (result.error) {
        console.log(`  錯誤: ${result.error}`);
      }
    });

    // 保存測試報告
    const reportPath = path.join(this.projectRoot, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      platform: this.platform,
      timestamp: new Date().toISOString(),
      results: this.testResults,
      summary: { total, passed, failed }
    }, null, 2));

    console.log(`\n📝 測試報告已保存到: ${reportPath}`);
  }

  // 顯示幫助
  showHelp() {
    console.log(`
🧪 跨平台測試器

用法: node scripts/cross-platform-tester.js [命令]

命令:
  detect     - 檢測測試環境
  setup      - 設置測試環境
  unit       - 運行單元測試
  integration - 運行整合測試
  e2e        - 運行 E2E 測試
  performance - 運行性能測試
  all        - 運行所有測試
  help       - 顯示此幫助

範例:
  node scripts/cross-platform-tester.js detect
  node scripts/cross-platform-tester.js setup
  node scripts/cross-platform-tester.js all
`);
  }
}

// 主執行邏輯
async function main() {
  const tester = new CrossPlatformTester();
  const command = process.argv[2] || 'help';

  try {
    switch (command) {
      case 'detect':
        tester.detectTestEnvironment();
        break;
      case 'setup':
        tester.checkTestDependencies();
        tester.createTestConfig();
        tester.createTestSetup();
        break;
      case 'unit':
        await tester.runUnitTests();
        break;
      case 'integration':
        await tester.runIntegrationTests();
        break;
      case 'e2e':
        await tester.runE2ETests();
        break;
      case 'performance':
        await tester.runPerformanceTests();
        break;
      case 'all':
        await tester.runAllTests();
        break;
      case 'help':
      default:
        tester.showHelp();
        break;
    }
  } catch (error) {
    console.error('❌ 執行失敗:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CrossPlatformTester;
