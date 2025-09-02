#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

class EnvironmentManager {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
    this.projectRoot = process.cwd();
    this.envExamplePath = path.join(this.projectRoot, 'env.example');
    this.envPath = path.join(this.projectRoot, '.env');
  }

  // 檢測作業系統特性
  detectPlatformFeatures() {
    const features = {
      platform: this.platform,
      isWindows: this.isWindows,
      isMac: this.isMac,
      isLinux: this.isLinux,
      architecture: os.arch(),
      nodeVersion: process.version,
      npmVersion: this.getNpmVersion(),
      pnpmVersion: this.getPnpmVersion(),
      homeDir: os.homedir(),
      tempDir: os.tmpdir(),
      lineEnding: this.isWindows ? 'CRLF' : 'LF'
    };

    console.log('🔍 平台特性檢測結果:');
    Object.entries(features).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    return features;
  }

  // 獲取 npm 版本
  getNpmVersion() {
    try {
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  // 獲取 pnpm 版本
  getPnpmVersion() {
    try {
      return execSync('pnpm --version', { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  // 檢查環境變數文件
  checkEnvironmentFiles() {
    console.log('\n📁 環境變數文件檢查:');
    
    if (fs.existsSync(this.envExamplePath)) {
      console.log('✅ env.example 存在');
    } else {
      console.log('❌ env.example 不存在');
      return false;
    }

    if (fs.existsSync(this.envPath)) {
      console.log('✅ .env 存在');
      return true;
    } else {
      console.log('⚠️  .env 不存在，需要創建');
      return false;
    }
  }

  // 創建環境變數文件
  createEnvironmentFile() {
    if (!fs.existsSync(this.envExamplePath)) {
      console.log('❌ env.example 不存在，無法創建 .env');
      return false;
    }

    try {
      let envContent = fs.readFileSync(this.envExamplePath, 'utf8');
      
      // 根據平台調整配置
      envContent = this.adjustForPlatform(envContent);
      
      // 寫入 .env 文件
      fs.writeFileSync(this.envPath, envContent);
      console.log('✅ .env 文件創建成功');
      
      return true;
    } catch (error) {
      console.log('❌ 創建 .env 文件失敗:', error.message);
      return false;
    }
  }

  // 根據平台調整配置
  adjustForPlatform(content) {
    let adjustedContent = content;

    if (this.isWindows) {
      // Windows 特定調整
      adjustedContent = adjustedContent.replace(
        /API_BASE_URL_DEV=http:\/\/localhost:8787/g,
        'API_BASE_URL_DEV=http://localhost:8787'
      );
      
      // 調整路徑分隔符
      adjustedContent = adjustedContent.replace(/\//g, '\\');
      
      console.log('🪟 已調整為 Windows 配置');
    } else if (this.isMac) {
      // macOS 特定調整
      adjustedContent = adjustedContent.replace(
        /API_BASE_URL_DEV=http:\/\/localhost:8787/g,
        'API_BASE_URL_DEV=http://localhost:8787'
      );
      
      console.log('🍎 已調整為 macOS 配置');
    }

    return adjustedContent;
  }

  // 驗證環境變數
  validateEnvironment() {
    if (!fs.existsSync(this.envPath)) {
      console.log('❌ .env 文件不存在');
      return false;
    }

    const envContent = fs.readFileSync(this.envPath, 'utf8');
    const requiredVars = [
      'GEMINI_API_KEY',
      'PINECONE_API_KEY',
      'PINECONE_ENVIRONMENT'
    ];

    const missing = [];
    requiredVars.forEach(varName => {
      if (!envContent.includes(`${varName}=`)) {
        missing.push(varName);
      }
    });

    if (missing.length > 0) {
      console.log(`⚠️  缺少必要的環境變數: ${missing.join(', ')}`);
      return false;
    }

    console.log('✅ 環境變數驗證通過');
    return true;
  }

  // 設置開發環境
  setupDevelopmentEnvironment() {
    console.log('\n🚀 設置開發環境...');
    
    // 檢查並創建環境文件
    if (!this.checkEnvironmentFiles()) {
      this.createEnvironmentFile();
    }

    // 驗證環境
    if (!this.validateEnvironment()) {
      console.log('⚠️  請檢查並設置必要的環境變數');
      return false;
    }

    // 創建平台特定的配置
    this.createPlatformSpecificConfig();
    
    console.log('✅ 開發環境設置完成');
    return true;
  }

  // 創建平台特定配置
  createPlatformSpecificConfig() {
    const configDir = path.join(this.projectRoot, '.platform-config');
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const config = {
      platform: this.platform,
      timestamp: new Date().toISOString(),
      features: this.detectPlatformFeatures(),
      paths: {
        projectRoot: this.projectRoot,
        homeDir: os.homedir(),
        tempDir: os.tmpdir()
      }
    };

    const configPath = path.join(configDir, `${this.platform}-config.json`);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`📝 平台配置已保存到: ${configPath}`);
  }

  // 顯示幫助
  showHelp() {
    console.log(`
🔧 環境管理器

用法: node scripts/env-manager.js [命令]

命令:
  detect     - 檢測平台特性
  check      - 檢查環境文件
  create     - 創建環境文件
  validate   - 驗證環境變數
  setup      - 設置開發環境
  help       - 顯示此幫助

範例:
  node scripts/env-manager.js detect
  node scripts/env-manager.js setup
  node scripts/env-manager.js validate
`);
  }
}

// 主執行邏輯
async function main() {
  const manager = new EnvironmentManager();
  const command = process.argv[2] || 'help';

  try {
    switch (command) {
      case 'detect':
        manager.detectPlatformFeatures();
        break;
      case 'check':
        manager.checkEnvironmentFiles();
        break;
      case 'create':
        manager.createEnvironmentFile();
        break;
      case 'validate':
        manager.validateEnvironment();
        break;
      case 'setup':
        manager.setupDevelopmentEnvironment();
        break;
      case 'help':
      default:
        manager.showHelp();
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

module.exports = EnvironmentManager;
