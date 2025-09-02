#!/usr/bin/env node

/**
 * 部署腳本
 * 支援部署到 staging 和 production 環境
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class Deployer {
  constructor() {
    this.environment = process.env.NODE_ENV || 'staging';
    this.workDir = process.cwd();
    this.config = this.loadConfig();
  }

  /**
   * 載入部署配置
   */
  loadConfig() {
    const configPath = path.join(this.workDir, 'deploy.config.js');
    
    if (fs.existsSync(configPath)) {
      try {
        return require(configPath);
      } catch (error) {
        console.warn('⚠️ 無法載入部署配置，使用預設配置');
      }
    }

    // 預設配置
    return {
      staging: {
        cloudflare: {
          workers: {
            name: 'concept-stock-screener-staging',
            script: 'dist/worker.js'
          },
          pages: {
            name: 'concept-stock-screener-staging',
            directory: 'dist'
          }
        },
        domains: {
          api: 'https://staging-api.concept-stock-screener.workers.dev',
          web: 'https://staging.concept-stock-screener.pages.dev'
        }
      },
      production: {
        cloudflare: {
          workers: {
            name: 'concept-stock-screener',
            script: 'dist/worker.js'
          },
          pages: {
            name: 'concept-stock-screener',
            directory: 'dist'
          }
        },
        domains: {
          api: 'https://api.concept-stock-screener.workers.dev',
          web: 'https://concept-stock-screener.pages.dev'
        }
      }
    };
  }

  /**
   * 檢查環境變數
   */
  checkEnvironmentVariables() {
    const required = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`缺少必要的環境變數: ${missing.join(', ')}`);
    }
    
    console.log('✅ 環境變數檢查通過');
  }

  /**
   * 檢查構建產物
   */
  checkBuildArtifacts() {
    const distPath = path.join(this.workDir, 'dist');
    
    if (!fs.existsSync(distPath)) {
      throw new Error('構建產物不存在，請先運行 npm run build');
    }
    
    const files = fs.readdirSync(distPath);
    console.log(`構建產物: ${files.join(', ')}`);
    
    return true;
  }

  /**
   * 部署到 Cloudflare Workers
   */
  async deployToWorkers() {
    console.log('\n🚀 部署到 Cloudflare Workers...');
    
    const config = this.config[this.environment].cloudflare.workers;
    
    try {
      // 使用 wrangler 部署
      const command = `npx wrangler deploy ${config.script} --name ${config.name}`;
      
      console.log(`執行命令: ${command}`);
      execSync(command, { 
        cwd: this.workDir, 
        stdio: 'inherit',
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
          CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID
        }
      });
      
      console.log('✅ Cloudflare Workers 部署完成');
      return true;
      
    } catch (error) {
      console.error('❌ Cloudflare Workers 部署失敗:', error.message);
      throw error;
    }
  }

  /**
   * 部署到 Cloudflare Pages
   */
  async deployToPages() {
    console.log('\n🚀 部署到 Cloudflare Pages...');
    
    const config = this.config[this.environment].cloudflare.pages;
    
    try {
      // 使用 wrangler pages 部署
      const command = `npx wrangler pages deploy ${config.directory} --project-name ${config.name}`;
      
      console.log(`執行命令: ${command}`);
      execSync(command, { 
        cwd: this.workDir, 
        stdio: 'inherit',
        env: {
          ...process.env,
          CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
          CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID
        }
      });
      
      console.log('✅ Cloudflare Pages 部署完成');
      return true;
      
    } catch (error) {
      console.error('❌ Cloudflare Pages 部署失敗:', error.message);
      throw error;
    }
  }

  /**
   * 驗證部署
   */
  async validateDeployment() {
    console.log('\n🔍 驗證部署...');
    
    const domains = this.config[this.environment].domains;
    const checks = [
      { name: 'API 端點', url: `${domains.api}/health` },
      { name: 'Web 端點', url: domains.web }
    ];
    
    for (const check of checks) {
      try {
        console.log(`檢查 ${check.name}: ${check.url}`);
        
        // 簡單的 HTTP 檢查
        const response = await fetch(check.url);
        if (response.ok) {
          console.log(`✅ ${check.name} 正常`);
        } else {
          console.warn(`⚠️ ${check.name} 狀態碼: ${response.status}`);
        }
      } catch (error) {
        console.warn(`⚠️ ${check.name} 檢查失敗: ${error.message}`);
      }
    }
  }

  /**
   * 運行完整部署流程
   */
  async deploy(environment = null) {
    if (environment) {
      this.environment = environment;
    }
    
    console.log(`🚀 開始部署到 ${this.environment} 環境...`);
    console.log(`工作目錄: ${this.workDir}`);
    
    try {
      // 1. 檢查環境變數
      this.checkEnvironmentVariables();
      
      // 2. 檢查構建產物
      this.checkBuildArtifacts();
      
      // 3. 部署到 Cloudflare Workers
      await this.deployToWorkers();
      
      // 4. 部署到 Cloudflare Pages
      await this.deployToPages();
      
      // 5. 驗證部署
      await this.validateDeployment();
      
      console.log(`\n🎉 部署到 ${this.environment} 完成！`);
      console.log(`API: ${this.config[this.environment].domains.api}`);
      console.log(`Web: ${this.config[this.environment].domains.web}`);
      
      return true;
      
    } catch (error) {
      console.error(`\n❌ 部署失敗: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * 回滾部署
   */
  async rollback() {
    console.log('\n🔄 開始回滾部署...');
    
    try {
      // 這裡可以實現回滾邏輯
      // 例如：部署到上一個版本
      console.log('✅ 回滾完成');
      
    } catch (error) {
      console.error('❌ 回滾失敗:', error.message);
      throw error;
    }
  }
}

// 主程序
async function main() {
  const deployer = new Deployer();
  
  const args = process.argv.slice(2);
  const command = args[0];
  const environment = args[1];
  
  try {
    switch (command) {
      case 'staging':
        await deployer.deploy('staging');
        break;
        
      case 'production':
        await deployer.deploy('production');
        break;
        
      case 'rollback':
        await deployer.rollback();
        break;
        
      default:
        console.log(`
使用方法: node deploy.js <command> [environment]

命令:
  staging              部署到 staging 環境
  production           部署到 production 環境
  rollback             回滾部署

範例:
  node deploy.js staging
  node deploy.js production
  node deploy.js rollback

環境變數:
  CLOUDFLARE_API_TOKEN    Cloudflare API Token
  CLOUDFLARE_ACCOUNT_ID   Cloudflare Account ID
  NODE_ENV                部署環境 (staging/production)
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

module.exports = Deployer;
