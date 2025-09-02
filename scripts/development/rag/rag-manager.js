const fs = require('fs');
const path = require('path');
const { processRAGFiles } = require('./process-rag');

/**
 * RAG 管理工具
 */
class RAGManager {
  constructor() {
    this.ragDir = path.join(__dirname, '..', 'data', 'rag');
    this.publicDir = path.join(__dirname, '..', 'public', 'rag');
    this.apiUrl = process.env.API_BASE_URL || 'http://localhost:8787';
  }

  /**
   * 處理並部署 RAG 檔案
   */
  async deployRAG() {
    try {
      console.log('🚀 開始部署 RAG 檔案...');
      
      // 1. 處理 RAG 檔案
      await processRAGFiles();
      
      // 2. 檢查處理結果
      const manifestPath = path.join(this.publicDir, 'manifest.json');
      const docsPath = path.join(this.publicDir, 'docs.jsonl');
      
      if (!fs.existsSync(manifestPath) || !fs.existsSync(docsPath)) {
        throw new Error('RAG 檔案處理失敗');
      }
      
      console.log('✅ RAG 檔案處理完成');
      
      // 3. 向量化資料（如果 API 可用）
      if (process.env.ENABLE_VECTORIZATION === 'true') {
        await this.vectorizeRAGData();
      }
      
      console.log('🎉 RAG 部署完成！');
      
    } catch (error) {
      console.error('❌ RAG 部署失敗:', error);
      process.exit(1);
    }
  }

  /**
   * 向量化 RAG 資料
   */
  async vectorizeRAGData() {
    try {
      console.log('🔍 開始向量化 RAG 資料...');
      
      const response = await fetch(`${this.apiUrl}/rag/vectorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`向量化失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ 向量化完成:', result.data);
      
    } catch (error) {
      console.error('❌ 向量化失敗:', error);
      throw error;
    }
  }

  /**
   * 檢查 RAG 狀態
   */
  async checkRAGStatus() {
    try {
      console.log('🔍 檢查 RAG 狀態...');
      
      const response = await fetch(`${this.apiUrl}/rag/status`);
      
      if (!response.ok) {
        throw new Error(`狀態檢查失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📊 RAG 狀態:', result.data);
      
      return result.data;
      
    } catch (error) {
      console.error('❌ 狀態檢查失敗:', error);
      throw error;
    }
  }

  /**
   * 測試 RAG 搜尋功能
   */
  async testRAGSearch() {
    try {
      console.log('🧪 測試 RAG 搜尋功能...');
      
      const testQueries = [
        { query: 'AI 伺服器', type: 'theme_overview' },
        { query: '台積電', type: 'theme_to_stock' },
        { query: '資料中心', type: 'theme_overview' },
      ];
      
      for (const test of testQueries) {
        console.log(`\n🔍 測試查詢: "${test.query}" (${test.type})`);
        
        const response = await fetch(
          `${this.apiUrl}/rag/search?q=${encodeURIComponent(test.query)}&type=${test.type}&topK=3`
        );
        
        if (!response.ok) {
          console.error(`❌ 查詢失敗: ${response.statusText}`);
          continue;
        }
        
        const result = await response.json();
        console.log(`✅ 找到 ${result.data.count} 個結果`);
        
        if (result.data.results.length > 0) {
          console.log('📝 第一個結果:', result.data.results[0].metadata.title);
        }
      }
      
    } catch (error) {
      console.error('❌ 搜尋測試失敗:', error);
      throw error;
    }
  }

  /**
   * 清除向量資料
   */
  async clearVectors() {
    try {
      console.log('🗑️ 清除向量資料...');
      
      const response = await fetch(`${this.apiUrl}/rag/vectors`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`清除失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ 向量資料已清除:', result.data);
      
    } catch (error) {
      console.error('❌ 清除失敗:', error);
      throw error;
    }
  }

  /**
   * 取得所有主題
   */
  async getAllThemes() {
    try {
      console.log('📋 取得所有主題...');
      
      const response = await fetch(`${this.apiUrl}/rag/themes`);
      
      if (!response.ok) {
        throw new Error(`取得主題失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ 找到 ${result.data.count} 個主題`);
      
      result.data.themes.forEach((theme, index) => {
        console.log(`${index + 1}. ${theme.name}`);
      });
      
      return result.data.themes;
      
    } catch (error) {
      console.error('❌ 取得主題失敗:', error);
      throw error;
    }
  }

  /**
   * 搜尋主題相關股票
   */
  async searchStocksByTheme(themeName) {
    try {
      console.log(`🔍 搜尋主題 "${themeName}" 相關股票...`);
      
      const response = await fetch(
        `${this.apiUrl}/rag/stocks-by-theme?theme=${encodeURIComponent(themeName)}&topK=10`
      );
      
      if (!response.ok) {
        throw new Error(`搜尋失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ 找到 ${result.data.count} 個相關股票`);
      
      result.data.stocks.forEach((stock, index) => {
        console.log(`${index + 1}. ${stock.stock_name} (${stock.ticker}) - 相似度: ${(stock.score * 100).toFixed(1)}%`);
      });
      
      return result.data.stocks;
      
    } catch (error) {
      console.error('❌ 搜尋股票失敗:', error);
      throw error;
    }
  }

  /**
   * 搜尋股票相關主題
   */
  async searchThemesByStock(stockName) {
    try {
      console.log(`🔍 搜尋股票 "${stockName}" 相關主題...`);
      
      const response = await fetch(
        `${this.apiUrl}/rag/themes-by-stock?stock=${encodeURIComponent(stockName)}&topK=10`
      );
      
      if (!response.ok) {
        throw new Error(`搜尋失敗: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ 找到 ${result.data.count} 個相關主題`);
      
      result.data.themes.forEach((theme, index) => {
        console.log(`${index + 1}. ${theme.theme_name} - 相似度: ${(theme.score * 100).toFixed(1)}%`);
      });
      
      return result.data.themes;
      
    } catch (error) {
      console.error('❌ 搜尋主題失敗:', error);
      throw error;
    }
  }
}

// 命令列介面
async function main() {
  const manager = new RAGManager();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  try {
    switch (command) {
      case 'deploy':
        await manager.deployRAG();
        break;
        
      case 'status':
        await manager.checkRAGStatus();
        break;
        
      case 'test':
        await manager.testRAGSearch();
        break;
        
      case 'clear':
        await manager.clearVectors();
        break;
        
      case 'themes':
        await manager.getAllThemes();
        break;
        
      case 'stocks':
        if (!args[0]) {
          console.error('❌ 請提供主題名稱');
          process.exit(1);
        }
        await manager.searchStocksByTheme(args[0]);
        break;
        
      case 'themes-by-stock':
        if (!args[0]) {
          console.error('❌ 請提供股票名稱');
          process.exit(1);
        }
        await manager.searchThemesByStock(args[0]);
        break;
        
      default:
        console.log(`
🔧 RAG 管理工具

用法: node scripts/rag-manager.js <command> [args]

命令:
  deploy              部署 RAG 檔案並向量化
  status              檢查 RAG 狀態
  test                測試 RAG 搜尋功能
  clear               清除向量資料
  themes              取得所有主題
  stocks <theme>      搜尋主題相關股票
  themes-by-stock <stock>  搜尋股票相關主題

範例:
  node scripts/rag-manager.js deploy
  node scripts/rag-manager.js stocks "AI 伺服器"
  node scripts/rag-manager.js themes-by-stock "台積電"
        `);
        break;
    }
  } catch (error) {
    console.error('❌ 執行失敗:', error);
    process.exit(1);
  }
}

// 執行
if (require.main === module) {
  main();
}

module.exports = RAGManager;
