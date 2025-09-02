#!/usr/bin/env node

/**
 * 環境配置檢查腳本
 * 用於驗證開發和生產環境配置是否正確
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 檢查環境配置...\n');

// 檢查檔案是否存在
const filesToCheck = [
  'apps/web/src/services/api.ts',
  'apps/web/next.config.js',
  'apps/web/vercel.json',
  'apps/api/src/services/rag-loader.ts',
  'env.example'
];

console.log('📁 檢查必要檔案:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🔧 檢查 API 端點配置:');

// 檢查 API 服務檔案
const apiServicePath = 'apps/web/src/services/api.ts';
if (fs.existsSync(apiServicePath)) {
  const content = fs.readFileSync(apiServicePath, 'utf8');
  
  // 檢查是否使用環境變數
  const usesEnvVars = content.includes('NEXT_PUBLIC_API_BASE_URL');
  const hasHardcodedUrls = content.includes('concept-stock-screener-api.camilla-wu.workers.dev');
  
  console.log(`  ${usesEnvVars ? '✅' : '❌'} 使用環境變數配置 API 端點`);
  console.log(`  ${!hasHardcodedUrls ? '✅' : '❌'} 沒有硬編碼的錯誤 URL`);
}

// 檢查 Next.js 配置
const nextConfigPath = 'apps/web/next.config.js';
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  
  const usesEnvVars = content.includes('NEXT_PUBLIC_API_BASE_URL');
  const hasEnvironmentCheck = content.includes('process.env.NODE_ENV');
  
  console.log(`  ${usesEnvVars ? '✅' : '❌'} Next.js 配置使用環境變數`);
  console.log(`  ${hasEnvironmentCheck ? '✅' : '❌'} 有環境檢查邏輯`);
}

// 檢查 Vercel 配置
const vercelConfigPath = 'apps/web/vercel.json';
if (fs.existsSync(vercelConfigPath)) {
  const content = fs.readFileSync(vercelConfigPath, 'utf8');
  
  const usesCorrectUrl = content.includes('concept-stock-screener-api.sandy246836.workers.dev');
  const hasEnvConfig = content.includes('NEXT_PUBLIC_API_BASE_URL');
  
  console.log(`  ${usesCorrectUrl ? '✅' : '❌'} Vercel 配置使用正確的 API URL`);
  console.log(`  ${hasEnvConfig ? '✅' : '❌'} 包含環境變數配置`);
}

console.log('\n📚 檢查 RAG 配置:');

// 檢查 RAG 載入器
const ragLoaderPath = 'apps/api/src/services/rag-loader.ts';
if (fs.existsSync(ragLoaderPath)) {
  const content = fs.readFileSync(ragLoaderPath, 'utf8');
  
  const usesEnvVars = content.includes('RAG_MANIFEST_URL') || content.includes('RAG_DOCS_URL');
  const hasEnvironmentCheck = content.includes('isCloudflareWorkers');
  
  console.log(`  ${usesEnvVars ? '✅' : '❌'} RAG 載入器使用環境變數`);
  console.log(`  ${hasEnvironmentCheck ? '✅' : '❌'} 有環境檢查邏輯`);
}

// 檢查環境變數範例檔案
const envExamplePath = 'env.example';
if (fs.existsSync(envExamplePath)) {
  const content = fs.readFileSync(envExamplePath, 'utf8');
  
  const hasApiConfig = content.includes('API_BASE_URL');
  const hasRagConfig = content.includes('RAG_MANIFEST_URL');
  const hasDevConfig = content.includes('_DEV');
  
  console.log(`  ${hasApiConfig ? '✅' : '❌'} 包含 API 配置`);
  console.log(`  ${hasRagConfig ? '✅' : '❌'} 包含 RAG 配置`);
  console.log(`  ${hasDevConfig ? '✅' : '❌'} 包含開發環境配置`);
}

console.log('\n📋 檢查結果摘要:');

// 檢查是否有 .env.local 檔案
const envLocalPath = '.env.local';
const hasEnvLocal = fs.existsSync(envLocalPath);
console.log(`  ${hasEnvLocal ? '✅' : '⚠️'} 本地環境變數檔案 (.env.local)`);

if (!hasEnvLocal) {
  console.log('    💡 建議: 複製 env.example 到 .env.local 並設定正確的值');
}

console.log('\n🎯 修復建議:');

const recommendations = [
  '1. 確保所有 API 端點使用環境變數而非硬編碼',
  '2. 在 Vercel 設定正確的環境變數',
  '3. 測試開發和生產環境的 API 連接',
  '4. 驗證 RAG 檔案載入功能',
  '5. 定期檢查環境配置的一致性'
];

recommendations.forEach(rec => {
  console.log(`   ${rec}`);
});

console.log('\n✅ 環境配置檢查完成！');
console.log('📖 詳細配置說明請參考: docs/QUICK_START_GUIDE.md');
