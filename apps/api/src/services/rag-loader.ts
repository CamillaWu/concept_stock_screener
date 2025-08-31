import { RAGDocument } from './vector';

export interface RAGManifest {
  theme_overview: number;
  theme_to_stock: number;
  total: number;
  fields: string[];
  note: string;
}

class RAGLoaderService {
  /**
   * 載入RAG manifest檔案
   */
  async loadManifest(): Promise<RAGManifest> {
    try {
      // 檢查是否在 Cloudflare Workers 環境中
      const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
      
      console.log('Environment check:', { isCloudflareWorkers });
      
      let manifestUrl: string;
      if (isCloudflareWorkers) {
        // 在雲端環境中，使用公開的 RAG 檔案 URL
        manifestUrl = process.env.RAG_MANIFEST_URL || 'https://concept-stock-screener.vercel.app/rag/manifest.json';
      } else {
        // 在本地開發環境中，使用本地檔案
        manifestUrl = process.env.RAG_MANIFEST_URL_DEV || 'http://localhost:8787/rag/manifest.json';
      }
      
      const response = await fetch(manifestUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load RAG manifest:', error);
      // 返回預設的manifest以避免錯誤
      return {
        theme_overview: 15,
        theme_to_stock: 75,
        total: 90,
        fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
        note: 'Fallback manifest'
      };
    }
  }

  /**
   * 載入RAG documents檔案
   */
  async loadDocuments(): Promise<RAGDocument[]> {
    try {
      // 檢查是否在 Cloudflare Workers 環境中
      const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
      
      console.log('Environment check:', { isCloudflareWorkers });
      
      // 在本地開發環境中，優先嘗試從檔案系統讀取
      if (!isCloudflareWorkers) {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const docsPath = path.join((globalThis as any).process?.cwd?.() || '.', 'public/rag/docs.jsonl');
          
          console.log('Trying to load from file system:', docsPath);
          
          if (fs.existsSync(docsPath)) {
            const content = fs.readFileSync(docsPath, 'utf8');
            const lines = content.trim().split('\n');
            
            const documents: RAGDocument[] = [];
            
            for (const line of lines) {
              try {
                const doc = JSON.parse(line) as RAGDocument;
                documents.push(doc);
              } catch (parseError) {
                console.warn('Failed to parse document line:', line.substring(0, 100));
              }
            }
            
            console.log(`Loaded ${documents.length} RAG documents from file system`);
            return documents;
          } else {
            console.log('RAG documents file not found at:', docsPath);
          }
        } catch (fsError) {
          console.error('File system error:', fsError);
        }
      }
      
      // 使用環境變數配置的 URL
      const docsUrl = isCloudflareWorkers
        ? (process.env.RAG_DOCS_URL || 'https://concept-stock-screener.vercel.app/rag/docs.jsonl')
        : (process.env.RAG_DOCS_URL_DEV || 'http://localhost:3000/rag/docs.jsonl');
      
      console.log(`Loading RAG documents from: ${docsUrl}`);
      const response = await fetch(docsUrl);
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load documents: ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log(`Response text length: ${text.length}`);
      
      const lines = text.trim().split('\n');
      console.log(`Parsed ${lines.length} lines`);
      
      const documents: RAGDocument[] = [];
      
      for (const line of lines) {
        try {
          const doc = JSON.parse(line) as RAGDocument;
          documents.push(doc);
        } catch (parseError) {
          console.warn('Failed to parse document line:', line.substring(0, 100));
        }
      }
      
      console.log(`Loaded ${documents.length} RAG documents`);
      return documents;
    } catch (error) {
      console.error('Failed to load RAG documents:', error);
      // 返回空陣列以避免錯誤
      return [];
    }
  }

  /**
   * 驗證RAG資料完整性
   */
  async validateRAGData(): Promise<{
    isValid: boolean;
    stats: {
      total: number;
      theme_overview: number;
      theme_to_stock: number;
      errors: string[];
    };
  }> {
    try {
      const [manifest, documents] = await Promise.all([
        this.loadManifest(),
        this.loadDocuments(),
      ]);

      const stats = {
        total: documents.length,
        theme_overview: documents.filter(d => d.type === 'theme_overview').length,
        theme_to_stock: documents.filter(d => d.type === 'theme_to_stock').length,
        errors: [] as string[],
      };

      // 驗證數量
      if (stats.total !== manifest.total) {
        stats.errors.push(`Document count mismatch: expected ${manifest.total}, got ${stats.total}`);
      }

      if (stats.theme_overview !== manifest.theme_overview) {
        stats.errors.push(`Theme overview count mismatch: expected ${manifest.theme_overview}, got ${stats.theme_overview}`);
      }

      if (stats.theme_to_stock !== manifest.theme_to_stock) {
        stats.errors.push(`Theme to stock count mismatch: expected ${manifest.theme_to_stock}, got ${stats.theme_to_stock}`);
      }

      // 驗證必要欄位
      for (const doc of documents) {
        if (!doc.doc_id || !doc.type || !doc.title || !doc.text) {
          stats.errors.push(`Missing required fields in document: ${doc.doc_id}`);
        }
      }

      const isValid = stats.errors.length === 0;

      return { isValid, stats };
    } catch (error) {
      console.error('RAG validation failed:', error);
      return {
        isValid: false,
        stats: {
          total: 0,
          theme_overview: 0,
          theme_to_stock: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        },
      };
    }
  }

  /**
   * 取得主題概覽文件
   */
  async getThemeOverviews(): Promise<RAGDocument[]> {
    const documents = await this.loadDocuments();
    return documents.filter(doc => doc.type === 'theme_overview');
  }

  /**
   * 取得特定主題的股票關聯
   */
  async getStocksByTheme(themeName: string): Promise<RAGDocument[]> {
    const documents = await this.loadDocuments();
    return documents.filter(doc => 
      doc.type === 'theme_to_stock' && 
      doc.theme_name === themeName
    );
  }

  /**
   * 取得特定股票的主題關聯
   */
  async getThemesByStock(stockName: string): Promise<RAGDocument[]> {
    const documents = await this.loadDocuments();
    return documents.filter(doc => 
      doc.type === 'theme_to_stock' && 
      doc.stock_name === stockName
    );
  }

  /**
   * 取得所有主題名稱
   */
  async getAllThemeNames(): Promise<string[]> {
    const documents = await this.loadDocuments();
    const themeNames = new Set<string>();
    
    for (const doc of documents) {
      if (doc.theme_name) {
        themeNames.add(doc.theme_name);
      }
    }
    
    return Array.from(themeNames);
  }

  /**
   * 取得所有股票名稱
   */
  async getAllStockNames(): Promise<string[]> {
    const documents = await this.loadDocuments();
    const stockNames = new Set<string>();
    
    for (const doc of documents) {
      if (doc.stock_name) {
        stockNames.add(doc.stock_name);
      }
    }
    
    return Array.from(stockNames);
  }
}

export const ragLoaderService = new RAGLoaderService();
