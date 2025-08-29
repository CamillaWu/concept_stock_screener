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
      
      let manifestUrl: string;
      if (isCloudflareWorkers) {
        // 在雲端環境中，使用公開的 RAG 檔案 URL
        manifestUrl = 'https://concept-stock-screener.vercel.app/rag/manifest.json';
      } else {
        // 在本地開發環境中，使用本地檔案服務
        manifestUrl = 'http://localhost:3001/rag/manifest.json';
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
      
      let docsUrl: string;
      if (isCloudflareWorkers) {
        // 在雲端環境中，使用公開的 RAG 檔案 URL
        docsUrl = 'https://concept-stock-screener.vercel.app/rag/docs.jsonl';
      } else {
        // 在本地開發環境中，使用本地檔案服務
        docsUrl = 'http://localhost:3001/rag/docs.jsonl';
      }
      
      const response = await fetch(docsUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to load documents: ${response.statusText}`);
      }
      
      const text = await response.text();
      const lines = text.trim().split('\n');
      
      const documents: RAGDocument[] = [];
      
      for (const line of lines) {
        try {
          const doc = JSON.parse(line) as RAGDocument;
          documents.push(doc);
        } catch (parseError) {
          console.warn('Failed to parse document line:', line);
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
