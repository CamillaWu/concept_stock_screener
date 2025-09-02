const fs = require('fs');
const path = require('path');

// 讀取完整的 RAG 資料
const docsPath = path.join(__dirname, '../data/rag/docs.jsonl');
const outputPath = path.join(__dirname, '../apps/api/src/services/full-rag-data.ts');

console.log('正在讀取 RAG 資料...');
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

// 生成 TypeScript 檔案
const tsContent = `// 此檔案由 scripts/convert-rag-to-ts.js 自動生成
// 包含完整的 90 筆 RAG 資料
// 請勿手動編輯，如需更新請重新執行腳本

import { RAGDocument } from './vector';

export const FULL_RAG_DOCUMENTS: RAGDocument[] = ${JSON.stringify(documents, null, 2)};

export const FULL_RAG_MANIFEST = {
  theme_overview: ${documents.filter(d => d.type === 'theme_overview').length},
  theme_to_stock: ${documents.filter(d => d.type === 'theme_to_stock').length},
  total: ${documents.length},
  fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
  note: 'Full RAG data with 90 documents'
};
`;

// 寫入檔案
fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log(`已生成完整 RAG 資料檔案: ${outputPath}`);
console.log(`包含 ${documents.length} 筆資料`);
console.log(`- 主題概覽: ${documents.filter(d => d.type === 'theme_overview').length} 筆`);
console.log(`- 主題股票關聯: ${documents.filter(d => d.type === 'theme_to_stock').length} 筆`);

// 顯示主題列表
const themes = [...new Set(documents.map(d => d.theme_name))];
console.log(`\n🎯 包含的主題：`);
themes.forEach(theme => {
  const count = documents.filter(d => d.theme_name === theme && d.type === 'theme_to_stock').length;
  console.log(`  - ${theme}: ${count} 個股票關聯`);
});
