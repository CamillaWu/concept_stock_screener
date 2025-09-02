#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

class AutoSetup {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
    this.projectRoot = process.cwd();
    this.setupComplete = false;
  }

  // 顯示歡迎訊息
  showWelcome() {
    console.log(`
🚀 概念股篩選系統 - 自動化環境設置
=====================================
🎯 目標: 自動檢測並設置 ${this.platform} 開發環境
⏰ 開始時間: ${new Date().toLocaleString()}
🔧 平台: ${this.platform} ${os.arch()}
📁 專案路徑: ${this.projectRoot}

開始自動化設置...
`);
  }

  // 自動檢測並設置環境
  async autoSetup() {
    try {
      this.showWelcome();
      
      // 1. 檢測系統環境
      await this.detectSystemEnvironment();
      
      // 2. 檢查並安裝必要工具
      await this.checkAndInstallTools();
      
      // 3. 設置專案環境
      await this.setupProjectEnvironment();
      
      // 4. 安裝依賴
      await this.installDependencies();
      
      // 5. 創建專案結構
      await this.createProjectStructure();
      
      // 6. 設置測試環境
      await this.setupTestEnvironment();
      
      // 7. 驗證設置
      await this.validateSetup();
      
      // 8. 顯示完成訊息
      this.showCompletionMessage();
      
      this.setupComplete = true;
      
    } catch (error) {
      console.error('❌ 自動設置失敗:', error.message);
      this.showTroubleshootingGuide();
      process.exit(1);
    }
  }

  // 檢測系統環境
  async detectSystemEnvironment() {
    console.log('\n🔍 步驟 1/8: 檢測系統環境...');
    
    const env = {
      platform: this.platform,
      architecture: os.arch(),
      nodeVersion: process.version,
      npmVersion: this.getToolVersion('npm'),
      pnpmVersion: this.getToolVersion('pnpm'),
      gitVersion: this.getToolVersion('git'),
      availableMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
      cpuCores: os.cpus().length
    };

    Object.entries(env).forEach(([key, value]) => {
      const status = value !== '未安裝' ? '✅' : '⚠️';
      console.log(`  ${status} ${key}: ${value}`);
    });

    console.log('✅ 系統環境檢測完成');
  }

  // 檢查並安裝必要工具
  async checkAndInstallTools() {
    console.log('\n🛠️  步驟 2/8: 檢查並安裝必要工具...');
    
    const tools = ['node', 'npm', 'pnpm', 'git'];
    const missing = [];

    tools.forEach(tool => {
      try {
        const version = execSync(`${tool} --version`, { encoding: 'utf8' }).trim();
        console.log(`✅ ${tool}: ${version}`);
      } catch (error) {
        console.log(`❌ ${tool}: 未安裝`);
        missing.push(tool);
      }
    });

    if (missing.length > 0) {
      console.log(`\n⚠️  缺少必要工具: ${missing.join(', ')}`);
      await this.installMissingTools(missing);
    }

    console.log('✅ 工具檢查完成');
  }

  // 安裝缺少的工具
  async installMissingTools(missing) {
    console.log('\n📥 自動安裝缺少的工具...');
    
    if (this.isMac) {
      console.log('🍎 檢測到 macOS，使用 Homebrew 安裝...');
      
      // 檢查 Homebrew
      try {
        execSync('brew --version', { stdio: 'inherit' });
        console.log('✅ Homebrew 已安裝');
      } catch {
        console.log('📥 安裝 Homebrew...');
        execSync('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', { stdio: 'inherit' });
      }

      // 安裝缺少的工具
      missing.forEach(tool => {
        if (tool === 'pnpm') {
          try {
            execSync('npm install -g pnpm', { stdio: 'inherit' });
            console.log('✅ pnpm 安裝完成');
          } catch (error) {
            console.log('❌ pnpm 安裝失敗，請手動安裝');
          }
        }
      });

    } else if (this.isWindows) {
      console.log('🪟 檢測到 Windows，使用 npm 安裝...');
      
      missing.forEach(tool => {
        if (tool === 'pnpm') {
          try {
            execSync('npm install -g pnpm', { stdio: 'inherit' });
            console.log('✅ pnpm 安裝完成');
          } catch (error) {
            console.log('❌ pnpm 安裝失敗，請手動安裝');
          }
        }
      });
    }
  }

  // 設置專案環境
  async setupProjectEnvironment() {
    console.log('\n⚙️  步驟 3/8: 設置專案環境...');
    
    // 檢查環境文件
    const envExamplePath = path.join(this.projectRoot, 'env.example');
    const envPath = path.join(this.projectRoot, '.env');
    
    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        console.log('📝 創建 .env 文件...');
        let envContent = fs.readFileSync(envExamplePath, 'utf8');
        
        // 根據平台調整配置
        if (this.isWindows) {
          envContent = envContent.replace(/\//g, '\\');
          console.log('🪟 已調整為 Windows 配置');
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env 文件創建成功');
      } else {
        console.log('⚠️  env.example 不存在，跳過環境文件創建');
      }
    } else {
      console.log('✅ .env 文件已存在');
    }

    console.log('✅ 專案環境設置完成');
  }

  // 安裝依賴
  async installDependencies() {
    console.log('\n📦 步驟 4/8: 安裝專案依賴...');
    
    try {
      console.log('📥 安裝 pnpm 依賴...');
      execSync('pnpm install', { stdio: 'inherit' });
      console.log('✅ 依賴安裝完成');
    } catch (error) {
      console.log('❌ 依賴安裝失敗:', error.message);
      throw error;
    }
  }

  // 創建專案結構
  async createProjectStructure() {
    console.log('\n📁 步驟 5/8: 創建專案目錄結構...');
    
    const directories = [
      'dist',
      'coverage',
      'logs',
      '.temp',
      '.platform-config',
      'build',
      'out'
    ];

    directories.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ 創建目錄: ${dir}`);
      } else {
        console.log(`ℹ️  目錄已存在: ${dir}`);
      }
    });

    console.log('✅ 專案目錄結構創建完成');
  }

  // 設置測試環境
  async setupTestEnvironment() {
    console.log('\n🧪 步驟 6/8: 設置測試環境...');
    
    try {
      // 檢查測試依賴
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const testDeps = ['jest', '@types/jest', 'ts-jest'];
      const missing = testDeps.filter(dep => !packageJson.devDependencies?.[dep]);

      if (missing.length > 0) {
        console.log(`📥 安裝測試依賴: ${missing.join(', ')}`);
        execSync(`pnpm add -D ${missing.join(' ')}`, { stdio: 'inherit' });
      }

      // 創建 Jest 配置
      const jestConfig = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        roots: ['<rootDir>/apps', '<rootDir>/packages'],
        testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
        transform: { '^.+\\.ts$': 'ts-jest' },
        collectCoverageFrom: [
          'apps/**/*.ts',
          'packages/**/*.ts',
          '!**/*.d.ts',
          '!**/node_modules/**'
        ],
        coverageDirectory: 'coverage',
        coverageReporters: ['text', 'lcov', 'html']
      };

      const configPath = path.join(this.projectRoot, 'jest.config.js');
      fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(jestConfig, null, 2)};`);
      console.log('✅ Jest 配置創建完成');

      console.log('✅ 測試環境設置完成');
    } catch (error) {
      console.log('⚠️  測試環境設置失敗:', error.message);
    }
  }

  // 驗證設置
  async validateSetup() {
    console.log('\n✅ 步驟 7/8: 驗證設置...');
    
    const checks = [
      { name: 'Node.js', check: () => process.version },
      { name: 'pnpm', check: () => execSync('pnpm --version', { encoding: 'utf8' }).trim() },
      { name: '專案依賴', check: () => fs.existsSync('node_modules') ? '已安裝' : '未安裝' },
      { name: '環境文件', check: () => fs.existsSync('.env') ? '已創建' : '未創建' },
      { name: '專案結構', check: () => fs.existsSync('dist') ? '已創建' : '未創建' }
    ];

    checks.forEach(({ name, check }) => {
      try {
        const result = check();
        const status = result !== '未安裝' && result !== '未創建' ? '✅' : '❌';
        console.log(`  ${status} ${name}: ${result}`);
      } catch (error) {
        console.log(`  ❌ ${name}: 檢查失敗`);
      }
    });

    console.log('✅ 設置驗證完成');
  }

  // 顯示完成訊息
  showCompletionMessage() {
    console.log('\n🎉 步驟 8/8: 設置完成！');
    console.log(`
=====================================
🎯 跨平台開發環境設置完成！
🚀 您現在可以開始開發了

📋 常用命令:
  pnpm dev          - 啟動開發環境
  pnpm build        - 構建專案
  pnpm test         - 運行測試
  pnpm clean        - 清理專案

🔧 環境資訊:
  平台: ${this.platform}
  Node.js: ${process.version}
  pnpm: ${this.getToolVersion('pnpm')}
  專案路徑: ${this.projectRoot}

💡 提示:
  - 下次開發時，直接運行 'pnpm dev' 即可
  - 所有跨平台問題已自動處理
  - 如需重新設置，運行 'node scripts/auto-setup.js'

=====================================
`);
  }

  // 顯示故障排除指南
  showTroubleshootingGuide() {
    console.log(`
🔧 故障排除指南
===============

如果自動設置失敗，請嘗試以下步驟：

1. 手動安裝必要工具:
   - Node.js: https://nodejs.org/
   - pnpm: npm install -g pnpm

2. 檢查權限:
   - macOS: 確保有寫入權限
   - Windows: 以管理員身份運行

3. 手動設置:
   pnpm cross:info      - 檢查環境
   pnpm env:setup       - 設置環境
   pnpm path:create     - 創建目錄
   pnpm test:setup      - 設置測試

4. 查看詳細錯誤:
   node scripts/auto-setup.js --verbose

如需幫助，請查看文檔: docs/CROSS_PLATFORM_GUIDE.md
`);
  }

  // 獲取工具版本
  getToolVersion(tool) {
    try {
      return execSync(`${tool} --version`, { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }
}

// 主執行邏輯
async function main() {
  const autoSetup = new AutoSetup();
  
  try {
    await autoSetup.autoSetup();
  } catch (error) {
    console.error('❌ 自動設置失敗:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = AutoSetup;
