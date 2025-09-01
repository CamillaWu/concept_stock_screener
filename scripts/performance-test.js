#!/usr/bin/env node

/**
 * 效能測試腳本
 * 測試 RAG 載入速度、API 回應時間和前端載入效能
 */

// 使用內建的 fetch（Node.js 18+）
const fetch = globalThis.fetch || require('node-fetch');

// 測試配置
const CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8787',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3002',
  TIMEOUT: 30000, // 30秒超時
  ITERATIONS: 3, // 每個測試重複3次取平均值
};

// 效能測試結果
const results = {
  ragLoading: [],
  apiResponse: [],
  frontendLoading: [],
  cachePerformance: []
};

/**
 * 測量執行時間
 */
function measureTime(fn) {
  const start = Date.now();
  return fn().then(() => Date.now() - start);
}

/**
 * 計算平均值
 */
function calculateAverage(times) {
  return times.reduce((sum, time) => sum + time, 0) / times.length;
}

/**
 * 測試 RAG 載入速度
 */
async function testRAGLoading() {
  console.log('\n🔍 測試 RAG 載入速度...');
  
  const endpoints = [
    '/rag/manifest.json',
    '/rag/docs.jsonl',
    '/rag/status'
  ];

  for (const endpoint of endpoints) {
    console.log(`  測試端點: ${endpoint}`);
    const times = [];

    for (let i = 0; i < CONFIG.ITERATIONS; i++) {
      try {
        const time = await measureTime(async () => {
          const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            timeout: CONFIG.TIMEOUT
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.text();
          return data.length; // 返回資料大小
        });

        times.push(time);
        console.log(`    第 ${i + 1} 次: ${time}ms`);
      } catch (error) {
        console.log(`    第 ${i + 1} 次: 失敗 - ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avgTime = calculateAverage(times);
      results.ragLoading.push({
        endpoint,
        averageTime: avgTime,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        successRate: (times.length / CONFIG.ITERATIONS) * 100
      });
    }
  }
}

/**
 * 測試 API 回應時間
 */
async function testAPIResponse() {
  console.log('\n🚀 測試 API 回應時間...');
  
  const endpoints = [
    '/trending?sort=popular',
    '/search?mode=theme&q=AI&real=false',
    '/search?mode=stock&q=2330&real=false'
  ];

  for (const endpoint of endpoints) {
    console.log(`  測試端點: ${endpoint}`);
    const times = [];

    for (let i = 0; i < CONFIG.ITERATIONS; i++) {
      try {
        const time = await measureTime(async () => {
          const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            timeout: CONFIG.TIMEOUT,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const data = await response.json();
          return data; // 返回資料
        });

        times.push(time);
        console.log(`    第 ${i + 1} 次: ${time}ms`);
      } catch (error) {
        console.log(`    第 ${i + 1} 次: 失敗 - ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avgTime = calculateAverage(times);
      results.apiResponse.push({
        endpoint,
        averageTime: avgTime,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        successRate: (times.length / CONFIG.ITERATIONS) * 100
      });
    }
  }
}

/**
 * 測試前端載入效能
 */
async function testFrontendLoading() {
  console.log('\n🌐 測試前端載入效能...');
  
  const pages = [
    '/',
    '/components-demo',
    '/rag-demo'
  ];

  for (const page of pages) {
    console.log(`  測試頁面: ${page}`);
    const times = [];

    for (let i = 0; i < CONFIG.ITERATIONS; i++) {
      try {
        const time = await measureTime(async () => {
          const response = await fetch(`${CONFIG.FRONTEND_URL}${page}`, {
            timeout: CONFIG.TIMEOUT
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const html = await response.text();
          return html.length; // 返回 HTML 大小
        });

        times.push(time);
        console.log(`    第 ${i + 1} 次: ${time}ms`);
      } catch (error) {
        console.log(`    第 ${i + 1} 次: 失敗 - ${error.message}`);
      }
    }

    if (times.length > 0) {
      const avgTime = calculateAverage(times);
      results.frontendLoading.push({
        page,
        averageTime: avgTime,
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        successRate: (times.length / CONFIG.ITERATIONS) * 100
      });
    }
  }
}

/**
 * 測試快取效能
 */
async function testCachePerformance() {
  console.log('\n💾 測試快取效能...');
  
  const testEndpoint = '/trending?sort=popular';
  const times = [];

  // 第一次請求（無快取）
  console.log('  第一次請求（無快取）...');
  let firstTime;
  try {
    firstTime = await measureTime(async () => {
      const response = await fetch(`${CONFIG.API_BASE_URL}${testEndpoint}`, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });

    times.push(firstTime);
    console.log(`    無快取時間: ${firstTime}ms`);
  } catch (error) {
    console.log(`    無快取請求失敗: ${error.message}`);
    return;
  }

  // 第二次請求（有快取）
  console.log('  第二次請求（有快取）...');
  try {
    const secondTime = await measureTime(async () => {
      const response = await fetch(`${CONFIG.API_BASE_URL}${testEndpoint}`, {
        timeout: CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });

    times.push(secondTime);
    console.log(`    有快取時間: ${secondTime}ms`);
    
    const improvement = ((firstTime - secondTime) / firstTime) * 100;
    results.cachePerformance.push({
      endpoint: testEndpoint,
      noCacheTime: firstTime,
      cachedTime: secondTime,
      improvement: improvement
    });
  } catch (error) {
    console.log(`    有快取請求失敗: ${error.message}`);
  }
}

/**
 * 生成效能報告
 */
function generateReport() {
  console.log('\n📊 效能測試報告');
  console.log('=' .repeat(50));

  // RAG 載入報告
  if (results.ragLoading.length > 0) {
    console.log('\n🔍 RAG 載入速度:');
    results.ragLoading.forEach(result => {
      console.log(`  ${result.endpoint}:`);
      console.log(`    平均時間: ${result.averageTime.toFixed(2)}ms`);
      console.log(`    最快時間: ${result.minTime}ms`);
      console.log(`    最慢時間: ${result.maxTime}ms`);
      console.log(`    成功率: ${result.successRate.toFixed(1)}%`);
    });
  }

  // API 回應報告
  if (results.apiResponse.length > 0) {
    console.log('\n🚀 API 回應時間:');
    results.apiResponse.forEach(result => {
      console.log(`  ${result.endpoint}:`);
      console.log(`    平均時間: ${result.averageTime.toFixed(2)}ms`);
      console.log(`    最快時間: ${result.minTime}ms`);
      console.log(`    最慢時間: ${result.maxTime}ms`);
      console.log(`    成功率: ${result.successRate.toFixed(1)}%`);
    });
  }

  // 前端載入報告
  if (results.frontendLoading.length > 0) {
    console.log('\n🌐 前端載入效能:');
    results.frontendLoading.forEach(result => {
      console.log(`  ${result.page}:`);
      console.log(`    平均時間: ${result.averageTime.toFixed(2)}ms`);
      console.log(`    最快時間: ${result.minTime}ms`);
      console.log(`    最慢時間: ${result.maxTime}ms`);
      console.log(`    成功率: ${result.successRate.toFixed(1)}%`);
    });
  }

  // 快取效能報告
  if (results.cachePerformance.length > 0) {
    console.log('\n💾 快取效能改善:');
    results.cachePerformance.forEach(result => {
      console.log(`  ${result.endpoint}:`);
      console.log(`    無快取時間: ${result.noCacheTime}ms`);
      console.log(`    有快取時間: ${result.cachedTime}ms`);
      console.log(`    效能改善: ${result.improvement.toFixed(1)}%`);
    });
  }

  // 總結
  console.log('\n📈 效能總結:');
  const allTimes = [
    ...results.ragLoading.map(r => r.averageTime),
    ...results.apiResponse.map(r => r.averageTime),
    ...results.frontendLoading.map(r => r.averageTime)
  ];

  if (allTimes.length > 0) {
    const avgTime = calculateAverage(allTimes);
    const maxTime = Math.max(...allTimes);
    const minTime = Math.min(...allTimes);
    
    console.log(`  總平均回應時間: ${avgTime.toFixed(2)}ms`);
    console.log(`  最快回應時間: ${minTime}ms`);
    console.log(`  最慢回應時間: ${maxTime}ms`);
  }

  if (results.cachePerformance.length > 0) {
    const avgImprovement = calculateAverage(results.cachePerformance.map(r => r.improvement));
    console.log(`  平均快取效能改善: ${avgImprovement.toFixed(1)}%`);
  }
}

/**
 * 主測試函數
 */
async function runPerformanceTests() {
  console.log('🎯 開始效能測試...');
  console.log(`API 端點: ${CONFIG.API_BASE_URL}`);
  console.log(`前端端點: ${CONFIG.FRONTEND_URL}`);
  console.log(`測試次數: ${CONFIG.ITERATIONS} 次/端點`);

  try {
    await testRAGLoading();
    await testAPIResponse();
    await testFrontendLoading();
    await testCachePerformance();
    
    generateReport();
    
    console.log('\n✅ 效能測試完成！');
  } catch (error) {
    console.error('\n❌ 效能測試失敗:', error.message);
    process.exit(1);
  }
}

// 執行測試
if (require.main === module) {
  runPerformanceTests();
}

module.exports = {
  runPerformanceTests,
  testRAGLoading,
  testAPIResponse,
  testFrontendLoading,
  testCachePerformance,
  generateReport
};
