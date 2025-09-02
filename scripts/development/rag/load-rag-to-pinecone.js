const fs = require('fs');
const path = require('path');

// 嘗試讀取環境變數檔案
const envPath = path.join(__dirname, '../env.example');
let envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
}

// 讀取本地 RAG 資料
const docsPath = path.join(__dirname, '../data/rag/docs.jsonl');
console.log('正在讀取本地 RAG 資料...');

const content = fs.readFileSync(docsPath, 'utf8');
const lines = content.trim().split('\n');

const documents = [];
for (const line of lines) {
  try {
    const doc = JSON.parse(line);
    documents.push(doc);
  } catch (parseError) {
    console.warn('解析失敗的行:', line.substring(0, 100));
  }
}

console.log(`成功解析 ${documents.length} 筆 RAG 資料`);

// 檢查環境變數
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || envVars.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || envVars.PINECONE_ENVIRONMENT;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || envVars.PINECONE_INDEX_NAME || 'concept-radar';

if (!PINECONE_API_KEY || !PINECONE_ENVIRONMENT) {
  console.error('❌ 缺少 Pinecone 環境變數！');
  console.error('請確保以下環境變數已設定：');
  console.error('- PINECONE_API_KEY');
  console.error('- PINECONE_ENVIRONMENT');
  console.error('- PINECONE_INDEX_NAME (可選，預設為 concept-radar)');
  process.exit(1);
}

console.log('✅ Pinecone 環境變數檢查通過');
console.log(`📊 準備載入 ${documents.length} 筆資料到 Pinecone 索引: ${PINECONE_INDEX_NAME}`);

// 模擬向量嵌入（在實際環境中，您需要使用真實的 embedding 模型）
function generateMockEmbedding(dimension = 768) {
  return new Array(dimension).fill(0).map(() => Math.random() - 0.5);
}

// 準備向量資料
const vectors = documents.map(doc => {
  const text = `${doc.title}\n\n${doc.text}`;
  
  return {
    id: doc.doc_id,
    values: generateMockEmbedding(),
    metadata: {
      type: doc.type,
      title: doc.title,
      theme_name: doc.theme_name,
      ticker: doc.ticker || '',
      stock_name: doc.stock_name || '',
      tags: doc.tags,
      content: doc.text,
      source_urls: doc.source_urls,
      retrieved_at: doc.retrieved_at,
      language: doc.language,
      theme_id: doc.theme_id,
    },
  };
});

console.log(`🔧 已準備 ${vectors.length} 個向量`);

// 模擬 Pinecone 操作（因為在 Node.js 環境中無法直接使用 Pinecone SDK）
console.log('\n📝 注意：這是模擬操作，實際的 Pinecone 載入需要：');
console.log('1. 在 Cloudflare Workers 環境中執行');
console.log('2. 使用真實的 embedding 模型');
console.log('3. 確保 Pinecone 索引已建立');

// 顯示統計資訊
const themeOverviewCount = documents.filter(d => d.type === 'theme_overview').length;
const themeToStockCount = documents.filter(d => d.type === 'theme_to_stock').length;

console.log('\n📊 RAG 資料統計：');
console.log(`- 總文件數：${documents.length}`);
console.log(`- 主題概覽：${themeOverviewCount}`);
console.log(`- 主題股票關聯：${themeToStockCount}`);

// 顯示主題列表
const themes = [...new Set(documents.map(d => d.theme_name))];
console.log(`\n🎯 包含的主題：`);
themes.forEach(theme => {
  const count = documents.filter(d => d.theme_name === theme && d.type === 'theme_to_stock').length;
  console.log(`  - ${theme}: ${count} 個股票關聯`);
});

console.log('\n✅ 資料準備完成！');
console.log('\n🚀 下一步：');
console.log('1. 部署到 Cloudflare Workers');
console.log('2. 呼叫 /rag/load API 端點來載入資料到 Pinecone');
console.log('3. 或使用 curl 命令：');
console.log(`   curl -X POST https://your-worker.your-subdomain.workers.dev/rag/load`);

// 生成測試用的 curl 命令
console.log('\n📋 測試命令：');
console.log('# 載入 RAG 資料到 Pinecone');
console.log('curl -X POST https://your-worker.your-subdomain.workers.dev/rag/load');
console.log('');
console.log('# 檢查 RAG 狀態');
console.log('curl https://your-worker.your-subdomain.workers.dev/rag/status');
console.log('');
console.log('# 搜尋主題');
console.log('curl "https://your-worker.your-subdomain.workers.dev/vector-search?query=AI伺服器"');
console.log('');
console.log('# 根據主題搜尋股票');
console.log('curl "https://your-worker.your-subdomain.workers.dev/rag/stocks-by-theme?theme=AI伺服器"');
