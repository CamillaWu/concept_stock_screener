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
   * 統一環境檢測邏輯
   */
  private isCloudflareWorkers(): boolean {
    // 在本地開發環境中，即使有 Cloudflare 對象，我們也應該使用本地文件
    const hasCloudflare = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    const hasProcess = typeof (globalThis as any).process !== 'undefined';
    const isDev = (globalThis as any).__DEV__ === true;
    
    // 如果有開發標記，或者有 process 對象，則認為是本地環境
    return hasCloudflare && !hasProcess && !isDev;
  }

  /**
   * 載入RAG manifest檔案
   */
  async loadManifest(): Promise<RAGManifest> {
    try {
      const isCloudflareWorkers = this.isCloudflareWorkers();
      console.log('Loading manifest - Environment check:', { isCloudflareWorkers });
      
      let manifestUrl: string;
      if (isCloudflareWorkers) {
        // 在雲端環境中，使用公開的 RAG 檔案 URL
        manifestUrl = (globalThis as any).RAG_MANIFEST_URL || 'https://concept-stock-screener.vercel.app/rag/manifest.json';
      } else {
        // 在本地開發環境中，使用本地檔案
        manifestUrl = (globalThis as any).RAG_MANIFEST_URL_DEV || 'http://localhost:3000/rag/manifest.json';
      }
      
      console.log('Loading manifest from:', manifestUrl);
      const response = await fetch(manifestUrl);
      
      console.log('Manifest response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
      }
      
      const manifest = await response.json();
      console.log('Successfully loaded manifest:', manifest);
      return manifest;
    } catch (error) {
      console.error('Failed to load RAG manifest:', error);
      // 返回預設的manifest以避免錯誤
      const fallbackManifest = {
        theme_overview: 15,
        theme_to_stock: 75,
        total: 90,
        fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
        note: 'Fallback manifest - RAG manifest loading failed'
      };
      console.log('Using fallback manifest:', fallbackManifest);
      return fallbackManifest;
    }
  }

  /**
   * 載入RAG documents檔案
   */
  async loadDocuments(): Promise<RAGDocument[]> {
    try {
      const isCloudflareWorkers = this.isCloudflareWorkers();
      console.log('Loading documents - Environment check:', { isCloudflareWorkers });
      
      // 在本地開發環境中，優先嘗試從檔案系統讀取
      if (!isCloudflareWorkers) {
        try {
          const fs = await import('fs');
          const path = await import('path');
          
          // 嘗試多個可能的檔案路徑
          const possiblePaths = [
            path.join((globalThis as any).process?.cwd?.() || '.', 'public/rag/docs.jsonl'),
            path.join((globalThis as any).process?.cwd?.() || '.', 'apps/web/public/rag/docs.jsonl'),
            path.join((globalThis as any).process?.cwd?.() || '.', 'data/rag/docs.jsonl'),
          ];
          
          for (const docsPath of possiblePaths) {
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
              
              console.log(`Loaded ${documents.length} RAG documents from file system: ${docsPath}`);
              return documents;
            }
          }
          
          console.log('RAG documents file not found in any of the expected paths');
        } catch (fsError) {
          console.error('File system error:', fsError);
        }
      }
      
      // 在本地開發環境中，嘗試從多個可能的 URL 載入
      let docsUrl: string;
      if (isCloudflareWorkers) {
        docsUrl = (globalThis as any).RAG_DOCS_URL || 'https://concept-stock-screener.vercel.app/rag/docs.jsonl';
      } else {
        // 嘗試多個可能的本地 URL
        const possibleUrls = [
          (globalThis as any).RAG_DOCS_URL_DEV,
          'http://localhost:3000/rag/docs.jsonl',
          'http://localhost:3001/rag/docs.jsonl',
          'http://localhost:3002/rag/docs.jsonl'
        ].filter(Boolean);
        
        docsUrl = possibleUrls[0] || 'http://localhost:3000/rag/docs.jsonl';
      }
      
      console.log(`Loading RAG documents from URL: ${docsUrl}`);
      const response = await fetch(docsUrl);
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load documents: ${response.status} ${response.statusText}`);
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
      
      console.log(`Successfully loaded ${documents.length} RAG documents from URL`);
      return documents;
    } catch (error) {
      console.error('Failed to load RAG documents:', error);
      
      // 返回模擬資料作為 fallback
      const fallbackDocs: RAGDocument[] = [
        {
          doc_id: "theme.ai_server.overview",
          type: "theme_overview",
          title: "AI 伺服器",
          text: "主題：AI 伺服器\n說明：本卡用於 Trending Top 15 的主題層檢索與說明。AI 伺服器是支援人工智慧運算的專用伺服器，具有高效能處理器、大容量記憶體和高速網路連接。",
          theme_id: "theme.ai_server",
          theme_name: "AI 伺服器",
          source_urls: [],
          retrieved_at: new Date().toISOString(),
          language: "zh-TW"
        },
        {
          doc_id: "theme.ai_server.stock.2330",
          type: "theme_to_stock",
          title: "台積電 (2330) - AI 伺服器",
          text: "台積電是全球最大的晶圓代工廠，在 AI 伺服器晶片製造方面具有領先優勢。公司為 NVIDIA、AMD 等 AI 晶片廠商提供先進製程服務。",
          theme_id: "theme.ai_server",
          theme_name: "AI 伺服器",
          ticker: "2330",
          stock_name: "台積電",
          source_urls: [],
          retrieved_at: new Date().toISOString(),
          language: "zh-TW"
        }
      ];
      
      console.log('Using fallback RAG documents:', fallbackDocs.length);
      return fallbackDocs;
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
