const fs = require('fs');
const path = require('path');

// 測試RAG檔案是否存在
console.log('🔍 檢查RAG檔案...');

const publicRagDir = path.join(__dirname, 'public', 'rag');
const dataRagDir = path.join(__dirname, 'data', 'rag');

console.log('📁 檢查 public/rag 目錄...');
if (fs.existsSync(publicRagDir)) {
  const files = fs.readdirSync(publicRagDir);
  console.log('✅ public/rag 檔案:', files);
} else {
  console.log('❌ public/rag 目錄不存在');
}

console.log('📁 檢查 data/rag 目錄...');
if (fs.existsSync(dataRagDir)) {
  const files = fs.readdirSync(dataRagDir);
  console.log('✅ data/rag 檔案:', files);
} else {
  console.log('❌ data/rag 目錄不存在');
}

// 測試API服務器
console.log('\n🌐 測試API服務器...');

async function testAPI() {
  try {
    const response = await fetch('http://127.0.0.1:8787/');
    const data = await response.json();
    console.log('✅ API服務器運行正常:', data);
    
    // 測試RAG狀態
    const ragResponse = await fetch('http://127.0.0.1:8787/rag/status');
    const ragData = await ragResponse.json();
    console.log('✅ RAG狀態:', ragData);
    
  } catch (error) {
    console.log('❌ API服務器連接失敗:', error.message);
    console.log('💡 請確保API服務器正在運行');
  }
}

testAPI();
