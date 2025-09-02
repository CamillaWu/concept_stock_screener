#!/usr/bin/env node

/**
 * 向量搜尋功能測試腳本
 * 測試新的向量搜尋 API 端點
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8787';

// 顏色輸出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, description) {
  try {
    log(`\n🔍 測試: ${description}`, 'blue');
    log(`📡 端點: ${endpoint}`, 'yellow');
    
    const startTime = Date.now();
    const response = await fetch(endpoint);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ 成功 (${responseTime}ms)`, 'green');
      log(`📊 回應: ${JSON.stringify(data, null, 2)}`, 'green');
      return { success: true, data, responseTime };
    } else {
      log(`❌ 失敗 (${response.status})`, 'red');
      const errorText = await response.text();
      log(`📄 錯誤: ${errorText}`, 'red');
      return { success: false, error: errorText, responseTime };
    }
  } catch (error) {
    log(`❌ 錯誤: ${error}`, 'red');
    return { success: false, error: error.toString() };
  }
}

async function testVectorSearch() {
  log('🚀 開始向量搜尋功能測試', 'blue');
  log('='.repeat(50), 'blue');
  
  const tests = [
    {
      endpoint: `${API_BASE_URL}/vector-stats`,
      description: '向量索引統計'
    },
    {
      endpoint: `${API_BASE_URL}/vector-search?q=AI&topK=5`,
      description: '向量搜尋 - AI 相關'
    },
    {
      endpoint: `${API_BASE_URL}/vector-search?q=台積電&topK=3`,
      description: '向量搜尋 - 台積電相關'
    },
    {
      endpoint: `${API_BASE_URL}/vector-search?q=伺服器&type=theme_overview&topK=3`,
      description: '向量搜尋 - 伺服器主題概覽'
    },
    {
      endpoint: `${API_BASE_URL}/theme-stocks?theme=AI&topK=5`,
      description: '主題相關股票搜尋'
    },
    {
      endpoint: `${API_BASE_URL}/stock-themes?stock=2330&topK=5`,
      description: '股票相關主題搜尋'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testAPI(test.endpoint, test.description);
    results.push({ ...test, ...result });
  }
  
  // 測試載入 RAG 文件到向量資料庫
  log('\n📚 測試載入 RAG 文件到向量資料庫', 'blue');
  try {
    const response = await fetch(`${API_BASE_URL}/vector-load`, {
      method: 'POST'
    });
    
    if (response.ok) {
      const data = await response.json();
      log(`✅ 成功載入: ${data.count} 個文件`, 'green');
      results.push({
        endpoint: `${API_BASE_URL}/vector-load`,
        description: '載入 RAG 文件到向量資料庫',
        success: true,
        data
      });
    } else {
      log(`❌ 載入失敗: ${response.status}`, 'red');
      results.push({
        endpoint: `${API_BASE_URL}/vector-load`,
        description: '載入 RAG 文件到向量資料庫',
        success: false,
        error: `HTTP ${response.status}`
      });
    }
  } catch (error) {
    log(`❌ 載入錯誤: ${error}`, 'red');
    results.push({
      endpoint: `${API_BASE_URL}/vector-load`,
      description: '載入 RAG 文件到向量資料庫',
      success: false,
      error: error.toString()
    });
  }
  
  // 生成測試報告
  log('\n📊 測試報告', 'blue');
  log('='.repeat(50), 'blue');
  
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  log(`✅ 成功: ${successfulTests.length}/${results.length}`, 'green');
  log(`❌ 失敗: ${failedTests.length}/${results.length}`, 'red');
  
  if (successfulTests.length > 0) {
    log('\n✅ 成功的測試:', 'green');
    successfulTests.forEach(test => {
      log(`  - ${test.description} (${test.responseTime}ms)`, 'green');
    });
  }
  
  if (failedTests.length > 0) {
    log('\n❌ 失敗的測試:', 'red');
    failedTests.forEach(test => {
      log(`  - ${test.description}: ${test.error}`, 'red');
    });
  }
  
  // 計算平均回應時間
  const avgResponseTime = successfulTests.length > 0 
    ? successfulTests.reduce((sum, test) => sum + (test.responseTime || 0), 0) / successfulTests.length
    : 0;
  
  log(`\n⏱️  平均回應時間: ${avgResponseTime.toFixed(2)}ms`, 'yellow');
  
  // 測試建議
  log('\n💡 測試建議:', 'blue');
  if (failedTests.length === 0) {
    log('🎉 所有測試都通過！向量搜尋功能運作正常。', 'green');
  } else {
    log('⚠️  部分測試失敗，請檢查：', 'yellow');
    log('  1. API 服務是否正在運行', 'yellow');
    log('  2. 環境變數是否正確設定', 'yellow');
    log('  3. RAG 文件是否存在', 'yellow');
    log('  4. 網路連線是否正常', 'yellow');
  }
  
  return results;
}

// 執行測試
if (import.meta.url === `file://${process.argv[1]}`) {
  testVectorSearch()
    .then(() => {
      log('\n🏁 測試完成', 'blue');
      process.exit(0);
    })
    .catch(error => {
      log(`\n💥 測試執行錯誤: ${error}`, 'red');
      process.exit(1);
    });
}

export { testVectorSearch };
