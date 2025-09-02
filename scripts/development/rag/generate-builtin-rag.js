const fs = require('fs');
const path = require('path');

// 讀取完整的 RAG 資料
const docsPath = path.join(__dirname, '../data/rag/docs.jsonl');
const outputPath = path.join(__dirname, '../apps/api/src/services/builtin-rag-data.ts');

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
const tsContent = `// 此檔案由 scripts/generate-builtin-rag.js 自動生成
// 請勿手動編輯，如需更新請重新執行腳本

import { RAGDocument } from './vector';

export const BUILTIN_RAG_DOCUMENTS: RAGDocument[] = ${JSON.stringify(documents, null, 2)};

export const BUILTIN_RAG_MANIFEST = {
  theme_overview: ${documents.filter(d => d.type === 'theme_overview').length},
  theme_to_stock: ${documents.filter(d => d.type === 'theme_to_stock').length},
  total: ${documents.length},
  fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
  note: 'Built-in RAG data generated from local docs.jsonl'
};
`;

// 寫入檔案
fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log(`已生成內建 RAG 資料檔案: ${outputPath}`);
console.log(`包含 ${documents.length} 筆資料`);
console.log(`- 主題概覽: ${documents.filter(d => d.type === 'theme_overview').length} 筆`);
console.log(`- 主題股票關聯: ${documents.filter(d => d.type === 'theme_to_stock').length} 筆`);
