#!/usr/bin/env node

/**
 * CI/CD 運行器
 * 用於在 CI 環境中執行測試、構建和部署
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class CIRunner {
  constructor() {
    this.isCI = process.env.CI === 'true';
    this.platform = process.platform;
    this.nodeVersion = process.version;
    this.workDir = process.cwd();
    
    console.log('🚀 CI/CD 運行器啟動');
    console.log(`平台: ${this.platform}`);
    console.log(`Node.js 版本: ${this.nodeVersion}`);
    console.log(`工作目錄: ${this.workDir}`);
    console.log(`CI 環境: ${this.isCI ? '是' : '否'}`);
  }

  /**
   * 執行命令
   */
  async executeCommand(command, options = {}) {
    const { cwd = this.workDir, silent = false } = options;
    
    if (!silent) {
      console.log(`\n📋 執行命令: ${command}`);
      console.log(`工作目錄: ${cwd}`);
    }

    try {
      const result = execSync(command, {
        cwd,
        stdio: silent ? 'pipe' : 'inherit',
        encoding: 'utf8'
      });
      
      if (!silent) {
        console.log('✅ 命令執行成功');
      }
      
      return { success: true, output: result };
    } catch (error) {
      console.error(`❌ 命令執行失敗: ${command}`);
      console.error(`錯誤: ${error.message}`);
      
      if (this.isCI) {
        process.exit(1);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * 安裝依賴
   */
  async installDependencies() {
    console.log('\n📦 安裝依賴...');
    
    // 檢查 package-lock.json 是否存在
    const lockFile = path.join(this.workDir, 'package-lock.json');
    const useCI = fs.existsSync(lockFile) ? 'ci' : 'install';
    
    const result = await this.executeCommand(`npm ${useCI}`, {
      cwd: this.workDir
    });
    
    if (result.success) {
      console.log('✅ 依賴安裝完成');
    }
    
    return result;
  }

  /**
   * 運行測試
   */
  async runTests(testType = 'all') {
    console.log(`\n🧪 運行測試: ${testType}`);
    
    const testCommands = {
      all: 'npm test',
      unit: 'npm run test:unit',
      integration: 'npm run test:integration',
      e2e: 'npm run test:e2e',
      performance: 'npm run test:performance'
    };
    
    const command = testCommands[testType] || testCommands.all;
    const result = await this.executeCommand(command, {
      cwd: this.workDir
    });
    
    if (result.success) {
      console.log(`✅ ${testType} 測試完成`);
    }
    
    return result;
  }

  /**
   * 運行代碼品質檢查
   */
  async runQualityChecks() {
    console.log('\n🔍 運行代碼品質檢查...');
    
    const checks = [
      { name: 'ESLint', command: 'npm run lint' },
      { name: 'Prettier', command: 'npm run format:check' },
      { name: 'TypeScript', command: 'npm run type-check' }
    ];
    
    const results = [];
    
    for (const check of checks) {
      console.log(`\n檢查 ${check.name}...`);
      const result = await this.executeCommand(check.command, {
        cwd: this.workDir
      });
      
      results.push({ name: check.name, ...result });
      
      if (!result.success) {
        console.error(`❌ ${check.name} 檢查失敗`);
        if (this.isCI) {
          process.exit(1);
        }
      }
    }
    
    const allPassed = results.every(r => r.success);
    if (allPassed) {
      console.log('✅ 所有代碼品質檢查通過');
    }
    
    return results;
  }

  /**
   * 構建應用
   */
  async buildApp() {
    console.log('\n🏗️ 構建應用...');
    
    const result = await this.executeCommand('npm run build', {
      cwd: this.workDir
    });
    
    if (result.success) {
      console.log('✅ 應用構建完成');
      
      // 檢查構建產物
      const distPath = path.join(this.workDir, 'dist');
      if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath);
        console.log(`構建產物: ${files.join(', ')}`);
      }
    }
    
    return result;
  }

  /**
   * 部署應用
   */
  async deployApp(environment = 'staging') {
    console.log(`\n🚀 部署到 ${environment} 環境...`);
    
    const deployCommands = {
      staging: 'npm run deploy:staging',
      production: 'npm run deploy:production'
    };
    
    const command = deployCommands[environment];
    if (!command) {
      throw new Error(`不支援的部署環境: ${environment}`);
    }
    
    const result = await this.executeCommand(command, {
      cwd: this.workDir
    });
    
    if (result.success) {
      console.log(`✅ 部署到 ${environment} 完成`);
    }
    
    return result;
  }

  /**
   * 生成測試報告
   */
  async generateTestReport() {
    console.log('\n📊 生成測試報告...');
    
    const result = await this.executeCommand('npm run test:report', {
      cwd: this.workDir
    });
    
    if (result.success) {
      console.log('✅ 測試報告生成完成');
      
      // 檢查報告文件
      const reportsPath = path.join(this.workDir, 'tests', 'reports');
      if (fs.existsSync(reportsPath)) {
        const files = fs.readdirSync(reportsPath);
        console.log(`報告文件: ${files.join(', ')}`);
      }
    }
    
    return result;
  }

  /**
   * 運行完整的 CI 流程
   */
  async runCIPipeline() {
    console.log('\n🔄 開始 CI 流程...');
    
    try {
      // 1. 安裝依賴
      const installResult = await this.installDependencies();
      if (!installResult.success) {
        throw new Error('依賴安裝失敗');
      }
      
      // 2. 運行測試
      const testResult = await this.runTests('all');
      if (!testResult.success) {
        throw new Error('測試失敗');
      }
      
      // 3. 代碼品質檢查
      const qualityResults = await this.runQualityChecks();
      const qualityFailed = qualityResults.some(r => !r.success);
      if (qualityFailed) {
        throw new Error('代碼品質檢查失敗');
      }
      
      // 4. 構建應用
      const buildResult = await this.buildApp();
      if (!buildResult.success) {
        throw new Error('構建失敗');
      }
      
      // 5. 生成測試報告
      await this.generateTestReport();
      
      console.log('\n🎉 CI 流程完成！');
      return true;
      
    } catch (error) {
      console.error(`\n❌ CI 流程失敗: ${error.message}`);
      if (this.isCI) {
        process.exit(1);
      }
      return false;
    }
  }

  /**
   * 運行完整的 CD 流程
   */
  async runCDPipeline(environment = 'staging') {
    console.log(`\n🚀 開始 CD 流程 (${environment})...`);
    
    try {
      // 1. 安裝依賴
      const installResult = await this.installDependencies();
      if (!installResult.success) {
        throw new Error('依賴安裝失敗');
      }
      
      // 2. 構建應用
      const buildResult = await this.buildApp();
      if (!buildResult.success) {
        throw new Error('構建失敗');
      }
      
      // 3. 部署應用
      const deployResult = await this.deployApp(environment);
      if (!deployResult.success) {
        throw new Error('部署失敗');
      }
      
      console.log(`\n🎉 CD 流程完成 (${environment})！`);
      return true;
      
    } catch (error) {
      console.error(`\n❌ CD 流程失敗: ${error.message}`);
      if (this.isCI) {
        process.exit(1);
      }
      return false;
    }
  }
}

// 主程序
async function main() {
  const runner = new CIRunner();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'ci':
        await runner.runCIPipeline();
        break;
        
      case 'cd':
        const environment = args[1] || 'staging';
        await runner.runCDPipeline(environment);
        break;
        
      case 'test':
        const testType = args[1] || 'all';
        await runner.runTests(testType);
        break;
        
      case 'quality':
        await runner.runQualityChecks();
        break;
        
      case 'build':
        await runner.buildApp();
        break;
        
      case 'deploy':
        const deployEnv = args[1] || 'staging';
        await runner.deployApp(deployEnv);
        break;
        
      case 'install':
        await runner.installDependencies();
        break;
        
      default:
        console.log(`
使用方法: node ci-runner.js <command> [options]

命令:
  ci                   運行完整的 CI 流程
  cd [environment]     運行完整的 CD 流程 (staging/production)
  test [type]         運行測試 (all/unit/integration/e2e/performance)
  quality              運行代碼品質檢查
  build                構建應用
  deploy [environment] 部署應用 (staging/production)
  install              安裝依賴

範例:
  node ci-runner.js ci
  node ci-runner.js cd staging
  node ci-runner.js test unit
  node ci-runner.js deploy production
        `);
        break;
    }
  } catch (error) {
    console.error(`❌ 執行失敗: ${error.message}`);
    process.exit(1);
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

module.exports = CIRunner;
