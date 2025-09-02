const fs = require('fs');
const path = require('path');

/**
 * 處理RAG檔案，將其轉換為適合部署的格式
 */
async function processRAGFiles() {
  try {
    console.log('開始處理RAG檔案...');
    
    // 讀取RAG檔案 - 更新路徑到 data/rag
    const ragDir = path.join(__dirname, '..', 'data', 'rag');
    const manifestPath = path.join(ragDir, 'manifest.md');
    const docsPath = path.join(ragDir, 'docs.jsonl');
    
    // 檢查檔案是否存在
    if (!fs.existsSync(manifestPath) || !fs.existsSync(docsPath)) {
      throw new Error('RAG檔案不存在');
    }
    
    // 讀取manifest
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = parseManifest(manifestContent);
    
    // 讀取documents
    const docsContent = fs.readFileSync(docsPath, 'utf8');
    const documents = parseDocuments(docsContent);
    
    // 驗證資料
    const validation = validateData(manifest, documents);
    if (!validation.isValid) {
      console.error('資料驗證失敗:', validation.errors);
      return;
    }
    
    // 建立輸出目錄
    const outputDir = path.join(__dirname, '..', 'public', 'rag');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 轉換manifest為JSON
    const manifestJson = {
      theme_overview: manifest.theme_overview,
      theme_to_stock: manifest.theme_to_stock,
      total: manifest.total,
      fields: manifest.fields,
      note: manifest.note,
      processed_at: new Date().toISOString()
    };
    
    // 寫入處理後的檔案
    fs.writeFileSync(
      path.join(outputDir, 'manifest.json'),
      JSON.stringify(manifestJson, null, 2)
    );
    
    // 寫入documents檔案
    fs.writeFileSync(
      path.join(outputDir, 'docs.jsonl'),
      docsContent
    );
    
    // 建立主題索引
    const themeIndex = buildThemeIndex(documents);
    fs.writeFileSync(
      path.join(outputDir, 'theme-index.json'),
      JSON.stringify(themeIndex, null, 2)
    );
    
    // 建立股票索引
    const stockIndex = buildStockIndex(documents);
    fs.writeFileSync(
      path.join(outputDir, 'stock-index.json'),
      JSON.stringify(stockIndex, null, 2)
    );
    
    console.log('RAG檔案處理完成！');
    console.log(`- 主題概覽: ${manifest.theme_overview}`);
    console.log(`- 主題股票關聯: ${manifest.theme_to_stock}`);
    console.log(`- 總文件數: ${manifest.total}`);
    console.log(`- 輸出目錄: ${outputDir}`);
    
  } catch (error) {
    console.error('處理RAG檔案時發生錯誤:', error);
    process.exit(1);
  }
}

/**
 * 解析manifest檔案
 */
function parseManifest(content) {
  const lines = content.split('\n');
  const manifest = {
    theme_overview: 0,
    theme_to_stock: 0,
    total: 0,
    fields: [],
    note: ''
  };
  
  for (const line of lines) {
    if (line.includes('theme_overview:')) {
      manifest.theme_overview = parseInt(line.split(':')[1].trim());
    } else if (line.includes('theme_to_stock:')) {
      manifest.theme_to_stock = parseInt(line.split(':')[1].trim());
    } else if (line.includes('total:')) {
      manifest.total = parseInt(line.split(':')[1].trim());
    } else if (line.includes('fields')) {
      const fieldsMatch = line.match(/\[(.*)\]/);
      if (fieldsMatch) {
        manifest.fields = fieldsMatch[1].split(',').map(f => f.trim());
      }
    } else if (line.includes('note:')) {
      manifest.note = line.split(':')[1].trim();
    }
  }
  
  return manifest;
}

/**
 * 解析documents檔案
 */
function parseDocuments(content) {
  const lines = content.trim().split('\n');
  const documents = [];
  
  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      documents.push(doc);
    } catch (error) {
      console.warn('無法解析文件行:', line);
    }
  }
  
  return documents;
}

/**
 * 驗證資料完整性
 */
function validateData(manifest, documents) {
  const errors = [];
  
  if (documents.length !== manifest.total) {
    errors.push(`文件數量不匹配: 預期 ${manifest.total}, 實際 ${documents.length}`);
  }
  
  const themeOverviewCount = documents.filter(d => d.type === 'theme_overview').length;
  if (themeOverviewCount !== manifest.theme_overview) {
    errors.push(`主題概覽數量不匹配: 預期 ${manifest.theme_overview}, 實際 ${themeOverviewCount}`);
  }
  
  const themeToStockCount = documents.filter(d => d.type === 'theme_to_stock').length;
  if (themeToStockCount !== manifest.theme_to_stock) {
    errors.push(`主題股票關聯數量不匹配: 預期 ${manifest.theme_to_stock}, 實際 ${themeToStockCount}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 建立主題索引
 */
function buildThemeIndex(documents) {
  const themeIndex = {};
  
  for (const doc of documents) {
    if (doc.theme_name) {
      if (!themeIndex[doc.theme_name]) {
        themeIndex[doc.theme_name] = {
          theme_id: doc.theme_id,
          overview: null,
          stocks: []
        };
      }
      
      if (doc.type === 'theme_overview') {
        themeIndex[doc.theme_name].overview = {
          title: doc.title,
          text: doc.text,
          source_urls: doc.source_urls,
          tags: doc.tags
        };
      } else if (doc.type === 'theme_to_stock' && doc.stock_name) {
        themeIndex[doc.theme_name].stocks.push({
          ticker: doc.ticker,
          stock_name: doc.stock_name,
          text: doc.text,
          source_urls: doc.source_urls
        });
      }
    }
  }
  
  return themeIndex;
}

/**
 * 建立股票索引
 */
function buildStockIndex(documents) {
  const stockIndex = {};
  
  for (const doc of documents) {
    if (doc.type === 'theme_to_stock' && doc.stock_name) {
      if (!stockIndex[doc.stock_name]) {
        stockIndex[doc.stock_name] = {
          ticker: doc.ticker,
          themes: []
        };
      }
      
      stockIndex[doc.stock_name].themes.push({
        theme_id: doc.theme_id,
        theme_name: doc.theme_name,
        text: doc.text,
        source_urls: doc.source_urls
      });
    }
  }
  
  return stockIndex;
}

// 執行處理
if (require.main === module) {
  processRAGFiles();
}

module.exports = {
  processRAGFiles,
  parseManifest,
  parseDocuments,
  validateData,
  buildThemeIndex,
  buildStockIndex
};
