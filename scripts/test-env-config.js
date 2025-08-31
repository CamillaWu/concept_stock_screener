#!/usr/bin/env node

/**
 * 環境配置測試腳本
 * 檢查所有必要的環境變數和配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 開始檢查環境配置...\n');

const configs = [
  {
    name: '根目錄 package.json',
    path: 'package.json',
    required: true,
    check: (content) => {
      const pkg = JSON.parse(content);
      return pkg.name && pkg.scripts;
    }
  },
  {
    name: 'Web App package.json',
    path: 'apps/web/package.json',
    required: true,
    check: (content) => {
      const pkg = JSON.parse(content);
      return pkg.name === '@concepts-radar/web' && pkg.scripts.dev;
    }
  },
  {
    name: 'API package.json',
    path: 'apps/api/package.json',
    required: true,
    check: (content) => {
      const pkg = JSON.parse(content);
      return pkg.name && pkg.scripts.dev;
    }
  },
  {
    name: 'Next.js 配置',
    path: 'apps/web/next.config.js',
    required: true,
    check: (content) => {
      return content.includes('NEXT_PUBLIC_API_BASE_URL');
    }
  },
  {
    name: 'TypeScript 配置 (Web)',
    path: 'apps/web/tsconfig.json',
    required: true,
    check: (content) => {
      const config = JSON.parse(content);
      return config.compilerOptions && config.include;
    }
  },
  {
    name: 'TypeScript 配置 (API)',
    path: 'apps/api/tsconfig.json',
    required: true,
    check: (content) => {
      const config = JSON.parse(content);
      return config.compilerOptions && config.include;
    }
  },
  {
    name: 'Tailwind 配置',
    path: 'apps/web/tailwind.config.js',
    required: true,
    check: (content) => {
      return content.includes('tailwindcss');
    }
  },
  {
    name: 'Wrangler 配置',
    path: 'apps/api/wrangler.toml',
    required: true,
    check: (content) => {
      return content.includes('name') && content.includes('main');
    }
  },
  {
    name: 'RAG 文件 (manifest.json)',
    path: 'public/rag/manifest.json',
    required: false,
    check: (content) => {
      try {
        const manifest = JSON.parse(content);
        return manifest && typeof manifest === 'object';
      } catch {
        return false;
      }
    }
  },
  {
    name: 'RAG 文件 (docs.jsonl)',
    path: 'public/rag/docs.jsonl',
    required: false,
    check: (content) => {
      const lines = content.trim().split('\n');
      return lines.length > 0;
    }
  }
];

function checkConfig(config) {
  console.log(`🔍 檢查: ${config.name}`);
  
  const fullPath = path.join(process.cwd(), config.path);
  
  if (!fs.existsSync(fullPath)) {
    if (config.required) {
      console.log(`   ❌ 文件不存在: ${config.path}`);
      return { success: false, error: 'File not found' };
    } else {
      console.log(`   ⚠️  文件不存在: ${config.path} (可選)`);
      return { success: true, warning: 'File not found' };
    }
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (config.check) {
      const isValid = config.check(content);
      if (isValid) {
        console.log(`   ✅ 配置正確: ${config.path}`);
        return { success: true };
      } else {
        console.log(`   ❌ 配置無效: ${config.path}`);
        return { success: false, error: 'Invalid configuration' };
      }
    } else {
      console.log(`   ✅ 文件存在: ${config.path}`);
      return { success: true };
    }
  } catch (error) {
    console.log(`   ❌ 讀取失敗: ${config.path} - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runConfigTests() {
  const results = [];
  
  for (const config of configs) {
    const result = checkConfig(config);
    results.push({ ...config, ...result });
    console.log('');
  }
  
  // 生成報告
  console.log('='.repeat(50));
  console.log('📋 環境配置檢查報告');
  console.log('='.repeat(50));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const requiredCount = results.filter(r => r.required).length;
  const requiredSuccessCount = results.filter(r => r.required && r.success).length;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const required = result.required ? '(必需)' : '(可選)';
    console.log(`${index + 1}. ${status} ${result.name} ${required}`);
    
    if (result.warning) {
      console.log(`   警告: ${result.warning}`);
    }
    if (result.error) {
      console.log(`   錯誤: ${result.error}`);
    }
  });
  
  console.log(`\n📊 檢查結果:`);
  console.log(`   - 總體: ${successCount}/${totalCount} 通過`);
  console.log(`   - 必需配置: ${requiredSuccessCount}/${requiredCount} 通過`);
  
  if (requiredSuccessCount === requiredCount) {
    console.log('\n🎉 所有必需配置都正確！環境設置完成。');
  } else {
    console.log('\n⚠️  部分必需配置有問題，請檢查上述錯誤。');
  }
  
  return results;
}

// 如果直接運行此腳本
if (require.main === module) {
  runConfigTests().catch(console.error);
}

module.exports = { runConfigTests, configs };
