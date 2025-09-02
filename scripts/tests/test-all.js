#!/usr/bin/env node

/**
 * 綜合測試腳本
 * 運行所有測試並提供詳細報告
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 開始運行綜合測試...\n');

const tests = [
  {
    name: '環境配置檢查',
    script: 'scripts/test-env-config.js',
    description: '檢查所有必要的環境變數和配置文件'
  },
  {
    name: '開發環境測試',
    script: 'scripts/test-dev-environment.js',
    description: '測試本地開發環境的 API 和前端服務'
  },
  {
    name: '生產環境 API 測試',
    script: 'scripts/test-production-api.js',
    description: '測試生產環境的 API 連接'
  },
  {
    name: 'RAG 檔案載入測試',
    script: 'scripts/test-rag-loading.js',
    description: '測試 RAG 檔案的載入和解析'
  }
];

function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n🔍 運行測試: ${test.name}`);
    console.log(`📝 描述: ${test.description}`);
    console.log('─'.repeat(50));
    
    const child = spawn('node', [test.script], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
    });
    
    child.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      process.stderr.write(text);
    });
    
    child.on('close', (code) => {
      console.log(`\n📊 測試完成: ${test.name} (退出碼: ${code})`);
      console.log('─'.repeat(50));
      
      resolve({
        name: test.name,
        success: code === 0,
        exitCode: code,
        output,
        errorOutput
      });
    });
    
    child.on('error', (error) => {
      console.log(`\n❌ 測試錯誤: ${test.name} - ${error.message}`);
      console.log('─'.repeat(50));
      
      resolve({
        name: test.name,
        success: false,
        error: error.message,
        output,
        errorOutput
      });
    });
  });
}

async function runAllTests() {
  console.log('🚀 開始執行所有測試...\n');
  
  const results = [];
  
  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }
  
  // 生成測試報告
  console.log('\n' + '='.repeat(60));
  console.log('📋 測試報告摘要');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${index + 1}. ${status} ${result.name}`);
    if (!result.success) {
      console.log(`   退出碼: ${result.exitCode || 'N/A'}`);
      if (result.error) {
        console.log(`   錯誤: ${result.error}`);
      }
    }
  });
  
  console.log(`\n📊 總體結果: ${successCount}/${totalCount} 測試通過`);
  
  if (successCount === totalCount) {
    console.log('🎉 所有測試都通過了！系統運行正常。');
  } else {
    console.log('⚠️  部分測試失敗，請檢查相關服務。');
  }
  
  console.log('\n💡 提示:');
  console.log('- 如果開發環境測試失敗，請確保本地服務正在運行');
  console.log('- 如果生產環境測試失敗，請檢查部署狀態');
  console.log('- 如果 RAG 測試失敗，請檢查 RAG 檔案配置');
  
  return results;
}

// 如果直接運行此腳本
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, tests };
