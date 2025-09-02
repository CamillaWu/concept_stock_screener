#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

class CrossPlatformRunner {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
  }

  // 檢測系統資訊
  getSystemInfo() {
    console.log(`🖥️  作業系統: ${this.platform}`);
    console.log(`📦 Node.js 版本: ${process.version}`);
    console.log(`🔧 架構: ${os.arch()}`);
    console.log(`💾 記憶體: ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`);
  }

  // 檢查必要工具
  checkRequiredTools() {
    const tools = ['node', 'npm', 'pnpm'];
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
      this.installMissingTools(missing);
    }
  }

  // 安裝缺少的工具
  installMissingTools(missing) {
    if (this.isMac) {
      console.log('\n🍎 macOS 自動安裝...');
      if (missing.includes('pnpm')) {
        try {
          execSync('npm install -g pnpm', { stdio: 'inherit' });
          console.log('✅ pnpm 安裝完成');
        } catch (error) {
          console.log('❌ pnpm 安裝失敗，請手動安裝');
        }
      }
    } else if (this.isWindows) {
      console.log('\n🪟 Windows 自動安裝...');
      if (missing.includes('pnpm')) {
        try {
          execSync('npm install -g pnpm', { stdio: 'inherit' });
          console.log('✅ pnpm 安裝完成');
        } catch (error) {
          console.log('❌ pnpm 安裝失敗，請手動安裝');
        }
      }
    }
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

  // 安裝依賴
  async installDependencies() {
    console.log('\n📦 安裝專案依賴...');
    try {
      await this.runCommand('pnpm', ['install']);
      console.log('✅ 依賴安裝完成');
    } catch (error) {
      console.log('❌ 依賴安裝失敗:', error.message);
    }
  }

  // 運行開發環境
  async runDev() {
    console.log('\n🚀 啟動開發環境...');
    try {
      // 啟動 API
      const apiProcess = spawn('pnpm', ['api:dev'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: this.isWindows
      });

      // 等待一下再啟動 web
      setTimeout(async () => {
        try {
          await this.runCommand('pnpm', ['web:dev']);
        } catch (error) {
          console.log('❌ Web 啟動失敗:', error.message);
        }
      }, 3000);

      apiProcess.on('close', (code) => {
        console.log(`API 服務已停止，退出碼: ${code}`);
      });

    } catch (error) {
      console.log('❌ 開發環境啟動失敗:', error.message);
    }
  }

  // 運行測試
  async runTests(type = 'all') {
    console.log(`\n🧪 運行測試: ${type}`);
    try {
      if (type === 'all') {
        await this.runCommand('pnpm', ['test']);
      } else {
        await this.runCommand('pnpm', ['test', type]);
      }
      console.log('✅ 測試完成');
    } catch (error) {
      console.log('❌ 測試失敗:', error.message);
    }
  }

  // 構建專案
  async build() {
    console.log('\n🔨 構建專案...');
    try {
      await this.runCommand('pnpm', ['build']);
      console.log('✅ 構建完成');
    } catch (error) {
      console.log('❌ 構建失敗:', error.message);
    }
  }

  // 清理
  async clean() {
    console.log('\n🧹 清理專案...');
    try {
      await this.runCommand('pnpm', ['clean']);
      console.log('✅ 清理完成');
    } catch (error) {
      console.log('❌ 清理失敗:', error.message);
    }
  }

  // 顯示幫助
  showHelp() {
    console.log(`
🔄 跨平台腳本執行器

用法: node scripts/cross-platform-runner.js [命令]

命令:
  info      - 顯示系統資訊
  check     - 檢查必要工具
  install   - 安裝依賴
  dev       - 啟動開發環境
  test      - 運行測試
  build     - 構建專案
  clean     - 清理專案
  help      - 顯示此幫助

範例:
  node scripts/cross-platform-runner.js info
  node scripts/cross-platform-runner.js dev
  node scripts/cross-platform-runner.js test all
`);
  }
}

// 主執行邏輯
async function main() {
  const runner = new CrossPlatformRunner();
  const command = process.argv[2] || 'help';

  try {
    switch (command) {
      case 'info':
        runner.getSystemInfo();
        break;
      case 'check':
        runner.checkRequiredTools();
        break;
      case 'install':
        await runner.installDependencies();
        break;
      case 'dev':
        await runner.runDev();
        break;
      case 'test':
        const testType = process.argv[3] || 'all';
        await runner.runTests(testType);
        break;
      case 'build':
        await runner.build();
        break;
      case 'clean':
        await runner.clean();
        break;
      case 'help':
      default:
        runner.showHelp();
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

module.exports = CrossPlatformRunner;
