#!/usr/bin/env node

/**
 * RAG 檔案載入功能測試腳本
 * 驗證 RAG 檔案是否能正確載入和解析
 */

const https = require('https');
const http = require('http');

const PRODUCTION_WEB_URL = 'https://concept-stock-screener.vercel.app';
const LOCAL_WEB_URL = 'http://localhost:3000';
const PRODUCTION_API_URL = 'https://concept-stock-screener-api.sandy246836.workers.dev';

console.log('📚 開始測試 RAG 檔案載入功能...\n');

function fetchFile(url, description) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    console.log(`🔍 載入: ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   ✅ 狀態碼: ${res.statusCode}`);
        console.log(`   📊 檔案大小: ${data.length} bytes`);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`   🎉 ${description} 載入成功\n`);
          resolve({ success: true, data, statusCode: res.statusCode });
        } else {
          console.log(`   ⚠️  ${description} 載入失敗\n`);
          resolve({ success: false, data, statusCode: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ${description} 載入失敗: ${error.message}\n`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      console.log(`   ⏰ ${description} 載入超時\n`);
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

function validateManifest(data) {
  try {
    const manifest = JSON.parse(data);
    console.log('   📋 Manifest 內容分析:');
    console.log(`      - 版本: ${manifest.version || '未指定'}`);
    console.log(`      - 文件數量: ${manifest.documents?.length || 0}`);
    console.log(`      - 最後更新: ${manifest.lastUpdated || '未指定'}`);
    
    if (manifest.documents && manifest.documents.length > 0) {
      console.log('   ✅ Manifest 格式正確，包含文件列表');
      return true;
    } else {
      console.log('   ⚠️  Manifest 格式正確，但沒有文件列表');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Manifest 解析失敗: ${error.message}`);
    return false;
  }
}

function validateDocs(data) {
  try {
    const lines = data.trim().split('\n');
    console.log(`   📋 Docs 內容分析:`);
    console.log(`      - 總行數: ${lines.length}`);
    
    if (lines.length === 0) {
      console.log('   ⚠️  文件為空');
      return false;
    }
    
    // 檢查前幾行的格式
    const validLines = lines.slice(0, 3).filter(line => {
      try {
        JSON.parse(line);
        return true;
      } catch {
        return false;
      }
    });
    
    console.log(`      - 有效 JSON 行數: ${validLines.length}/3`);
    
    if (validLines.length > 0) {
      const sampleDoc = JSON.parse(validLines[0]);
      console.log(`      - 文件結構: ${Object.keys(sampleDoc).join(', ')}`);
      console.log('   ✅ Docs 格式正確');
      return true;
    } else {
      console.log('   ❌ Docs 格式不正確');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Docs 解析失敗: ${error.message}`);
    return false;
  }
}

async function runTests() {
  const environments = [
    { name: '生產環境 API', baseUrl: PRODUCTION_API_URL },
    { name: '生產環境前端', baseUrl: PRODUCTION_WEB_URL },
    { name: '本地環境', baseUrl: LOCAL_WEB_URL }
  ];
  
  for (const env of environments) {
    console.log(`🌍 測試 ${env.name}:`);
    console.log('='.repeat(30));
    
    const tests = [
      {
        url: `${env.baseUrl}/rag/manifest.json`,
        description: 'RAG Manifest 檔案',
        validator: validateManifest
      },
      {
        url: `${env.baseUrl}/rag/docs.jsonl`,
        description: 'RAG 文件檔案',
        validator: validateDocs
      }
    ];
    
    const results = [];
    
    for (const test of tests) {
      const result = await fetchFile(test.url, test.description);
      
      if (result.success && test.validator) {
        result.valid = test.validator(result.data);
      }
      
      results.push({ ...test, ...result });
    }
    
    const successCount = results.filter(r => r.success && r.valid !== false).length;
    const totalCount = results.length;
    
    console.log(`\n📊 ${env.name} 測試結果: ${successCount}/${totalCount} 通過\n`);
  }
  
  console.log('🎯 RAG 檔案載入測試完成！');
  console.log('💡 如果本地環境測試失敗，請確保本地開發服務器正在運行');
}

runTests().catch(console.error);
