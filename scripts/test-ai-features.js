#!/usr/bin/env node

/**
 * AI 功能增強測試腳本
 * 測試新增的 AI 分析功能
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

async function testAPI(endpoint, description, method = 'GET', body = null) {
  try {
    log(`\n🔍 測試: ${description}`, 'blue');
    log(`📡 端點: ${endpoint}`, 'yellow');
    
    const startTime = Date.now();
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(endpoint, options);
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

async function testAIFeatures() {
  log('🚀 開始 AI 功能增強測試', 'blue');
  log('='.repeat(50), 'blue');
  
  const tests = [
    {
      endpoint: `${API_BASE_URL}/ai/investment-advice?stockId=2330&theme=AI`,
      description: '智能投資建議 - 台積電 AI 主題',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/risk-assessment?stockId=2330&theme=AI`,
      description: '風險評估分析 - 台積電 AI 主題',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/market-trend?theme=AI&timeframe=medium`,
      description: '市場趨勢預測 - AI 主題中期',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/concept-strength?theme=AI`,
      description: '概念強度分析 - AI 主題',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/sentiment?theme=AI`,
      description: '情緒分析 - AI 主題',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/stock-attribution?stockId=2330&theme=AI`,
      description: '個股歸因分析 - 台積電 AI 主題',
      method: 'GET'
    },
    {
      endpoint: `${API_BASE_URL}/ai/portfolio-optimization`,
      description: '投資組合優化建議',
      method: 'POST',
      body: {
        portfolio: [
          { ticker: '2330', weight: 0.4 },
          { ticker: '2317', weight: 0.3 },
          { ticker: '2454', weight: 0.2 },
          { ticker: '1301', weight: 0.1 }
        ],
        riskTolerance: 'medium'
      }
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testAPI(test.endpoint, test.description, test.method, test.body);
    results.push({ ...test, ...result });
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
    log('🎉 所有測試都通過！AI 功能增強運作正常。', 'green');
  } else {
    log('⚠️  部分測試失敗，請檢查：', 'yellow');
    log('  1. API 服務是否正在運行', 'yellow');
    log('  2. GEMINI_API_KEY 是否正確設定', 'yellow');
    log('  3. 網路連線是否正常', 'yellow');
    log('  4. 請求參數是否正確', 'yellow');
  }
  
  return results;
}

// 執行測試
if (import.meta.url === `file://${process.argv[1]}`) {
  testAIFeatures()
    .then(() => {
      log('\n🏁 測試完成', 'blue');
      process.exit(0);
    })
    .catch(error => {
      log(`\n💥 測試執行錯誤: ${error}`, 'red');
      process.exit(1);
    });
}

export { testAIFeatures };
