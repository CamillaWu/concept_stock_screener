const fs = require('fs');
const path = require('path');

console.log('🔍 檢查RAG檔案內容...');

// 檢查public/rag/manifest.json
const manifestPath = path.join(__dirname, 'public', 'rag', 'manifest.json');
console.log('\n📄 檢查 manifest.json...');
if (fs.existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('✅ manifest.json 內容:', manifest);
  } catch (error) {
    console.log('❌ manifest.json 解析錯誤:', error.message);
  }
} else {
  console.log('❌ manifest.json 不存在');
}

// 檢查public/rag/docs.jsonl的前幾行
const docsPath = path.join(__dirname, 'public', 'rag', 'docs.jsonl');
console.log('\n📄 檢查 docs.jsonl...');
if (fs.existsSync(docsPath)) {
  try {
    const content = fs.readFileSync(docsPath, 'utf8');
    const lines = content.trim().split('\n');
    console.log(`✅ docs.jsonl 總行數: ${lines.length}`);
    
    // 顯示前3行
    console.log('📝 前3行內容:');
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      try {
        const doc = JSON.parse(lines[i]);
        console.log(`  行 ${i + 1}: ${doc.title || doc.doc_id}`);
      } catch (error) {
        console.log(`  行 ${i + 1}: 解析錯誤`);
      }
    }
  } catch (error) {
    console.log('❌ docs.jsonl 讀取錯誤:', error.message);
  }
} else {
  console.log('❌ docs.jsonl 不存在');
}

// 測試API端點
console.log('\n🌐 測試API端點...');

async function testEndpoints() {
  try {
    // 測試manifest端點
    const manifestResponse = await fetch('http://127.0.0.1:8787/rag/manifest.json');
    const manifestData = await manifestResponse.json();
    console.log('✅ /rag/manifest.json:', manifestData);
    
    // 測試docs端點
    const docsResponse = await fetch('http://127.0.0.1:8787/rag/docs.jsonl');
    const docsText = await docsResponse.text();
    const docsLines = docsText.trim().split('\n');
    console.log(`✅ /rag/docs.jsonl: ${docsLines.length} 行`);
    
    // 測試RAG狀態
    const statusResponse = await fetch('http://127.0.0.1:8787/rag/status');
    const statusData = await statusResponse.json();
    console.log('✅ /rag/status:', statusData);
    
  } catch (error) {
    console.log('❌ API測試失敗:', error.message);
  }
}

testEndpoints();
