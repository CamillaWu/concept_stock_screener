import { RAGDocument } from './vector';
import { FULL_RAG_DOCUMENTS, FULL_RAG_MANIFEST } from './full-rag-data';

export interface RAGManifest {
  theme_overview: number;
  theme_to_stock: number;
  total: number;
  fields: string[];
  note: string;
}

// 快取機制
class RAGCache {
  private static instance: RAGCache;
  private manifestCache: RAGManifest | null = null;
  private documentsCache: RAGDocument[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分鐘快取

  static getInstance(): RAGCache {
    if (!RAGCache.instance) {
      RAGCache.instance = new RAGCache();
    }
    return RAGCache.instance;
  }

  isCacheValid(): boolean {
    return this.cacheTimestamp > 0 && 
           (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  setManifest(manifest: RAGManifest): void {
    this.manifestCache = manifest;
    this.cacheTimestamp = Date.now();
  }

  getManifest(): RAGManifest | null {
    return this.isCacheValid() ? this.manifestCache : null;
  }

  setDocuments(documents: RAGDocument[]): void {
    this.documentsCache = documents;
    this.cacheTimestamp = Date.now();
  }

  getDocuments(): RAGDocument[] | null {
    return this.isCacheValid() ? this.documentsCache : null;
  }

  clearCache(): void {
    this.manifestCache = null;
    this.documentsCache = null;
    this.cacheTimestamp = 0;
  }
}

class RAGLoaderService {
  private cache = RAGCache.getInstance();

  /**
   * 統一環境檢測邏輯
   */
  private isCloudflareWorkers(): boolean {
    // 檢查是否在 Cloudflare Workers 環境中
    const hasCloudflare = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
    const hasProcess = typeof (globalThis as any).process !== 'undefined';
    const hasNodeModules = typeof (globalThis as any).require !== 'undefined';
    const isDev = (globalThis as any).__DEV__ === true;
    
    // 如果有 Cloudflare 對象，且沒有 Node.js 相關對象，則認為是 Cloudflare Workers
    const result = hasCloudflare && !hasProcess && !hasNodeModules && !isDev;
    console.log('Environment detection:', { hasCloudflare, hasProcess, hasNodeModules, isDev, result });
    return result;
  }

  /**
   * 從 Markdown 格式解析 manifest
   */
  private parseManifestFromMarkdown(content: string): RAGManifest {
    // 簡單的 markdown 解析邏輯
    const lines = content.split('\n');
    let themeOverview = 15;
    let themeToStock = 75;
    let total = 90;
    
    for (const line of lines) {
      if (line.includes('theme_overview')) {
        const match = line.match(/(\d+)/);
        if (match) themeOverview = parseInt(match[1]);
      } else if (line.includes('theme_to_stock')) {
        const match = line.match(/(\d+)/);
        if (match) themeToStock = parseInt(match[1]);
      } else if (line.includes('total')) {
        const match = line.match(/(\d+)/);
        if (match) total = parseInt(match[1]);
      }
    }
    
    return {
      theme_overview: themeOverview,
      theme_to_stock: themeToStock,
      total,
      fields: ['doc_id', 'type', 'title', 'text', 'source_urls', 'theme_id', 'theme_name'],
      note: 'Parsed from markdown manifest'
    };
  }

  /**
   * 獲取內建的 RAG 資料（用於 Cloudflare Workers）
   */
  private getBuiltinRAGDocuments(): RAGDocument[] {
    // 使用完整的 90 筆 RAG 資料
    console.log(`使用完整的 RAG 資料: ${FULL_RAG_DOCUMENTS.length} 筆`);
    return FULL_RAG_DOCUMENTS;
  }

  /**
   * 載入RAG manifest檔案（優化版本）
   */
  async loadManifest(): Promise<RAGManifest> {
    // 檢查快取
    const cachedManifest = this.cache.getManifest();
    if (cachedManifest) {
      console.log('Using cached RAG manifest');
      return cachedManifest;
    }

    try {
      const isCloudflareWorkers = this.isCloudflareWorkers();
      console.log('Loading manifest - Environment check:', { isCloudflareWorkers });
      
      if (isCloudflareWorkers) {
        // 在 Cloudflare Workers 中，使用完整的 manifest
        console.log('Using full RAG manifest for Cloudflare Workers');
        const manifest = FULL_RAG_MANIFEST;
        this.cache.setManifest(manifest);
        return manifest;
      }
      
      // 在本地開發環境中，嘗試從檔案系統讀取
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const manifestPath = path.join((globalThis as any).process?.cwd?.() || '.', 'data/rag/manifest.md');
        
        if (fs.existsSync(manifestPath)) {
          const content = fs.readFileSync(manifestPath, 'utf8');
          // 解析 markdown 格式的 manifest
          const manifest = this.parseManifestFromMarkdown(content);
          console.log('Successfully loaded manifest from file system');
          this.cache.setManifest(manifest);
          return manifest;
        }
      } catch (fsError) {
        console.error('File system error:', fsError);
      }
      
      // 如果檔案系統讀取失敗，嘗試從 URL 載入
      let manifestUrl: string;
      manifestUrl = (globalThis as any).RAG_MANIFEST_URL_DEV || 'http://localhost:3000/rag/manifest.json';
      
      console.log('Loading manifest from URL:', manifestUrl);
      const response = await fetch(manifestUrl);
      
      console.log('Manifest response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
      }
      
      const manifest = await response.json();
      console.log('Successfully loaded manifest from URL');
      this.cache.setManifest(manifest);
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
      this.cache.setManifest(fallbackManifest);
      return fallbackManifest;
    }
  }

  /**
   * 載入RAG documents檔案（優化版本）
   */
  async loadDocuments(): Promise<RAGDocument[]> {
    // 檢查快取
    const cachedDocuments = this.cache.getDocuments();
    if (cachedDocuments) {
      console.log('Using cached RAG documents');
      return cachedDocuments;
    }

    try {
      const isCloudflareWorkers = this.isCloudflareWorkers();
      console.log('Loading documents - Environment check:', { isCloudflareWorkers });
      
      // 在 Cloudflare Workers 中，直接使用內建的完整 RAG 資料
      if (isCloudflareWorkers) {
        const builtinDocuments = this.getBuiltinRAGDocuments();
        console.log(`Using built-in RAG documents: ${builtinDocuments.length} documents`);
        this.cache.setDocuments(builtinDocuments);
        return builtinDocuments;
      }
      
      // 如果環境檢測失敗，但我們在 Cloudflare Workers 中，也使用內建資料
      const hasCloudflare = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
      if (hasCloudflare) {
        console.log('Fallback: Using built-in RAG documents in Cloudflare environment');
        const builtinDocuments = this.getBuiltinRAGDocuments();
        console.log(`Using built-in RAG documents: ${builtinDocuments.length} documents`);
        this.cache.setDocuments(builtinDocuments);
        return builtinDocuments;
      }
      
      // 在本地開發環境中，優先嘗試從檔案系統讀取
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
            
            // 使用並行處理來加速解析
            const batchSize = 10;
            for (let i = 0; i < lines.length; i += batchSize) {
              const batch = lines.slice(i, i + batchSize);
              const batchPromises = batch.map(async (line) => {
                try {
                  return JSON.parse(line) as RAGDocument;
                } catch (parseError) {
                  console.warn('Failed to parse document line:', line.substring(0, 100));
                  return null;
                }
              });
              
              const batchResults = await Promise.all(batchPromises);
              documents.push(...batchResults.filter(Boolean) as RAGDocument[]);
            }
            
            console.log(`Loaded ${documents.length} RAG documents from file system: ${docsPath}`);
            this.cache.setDocuments(documents);
            return documents;
          }
        }
        
        console.log('RAG documents file not found in any of the expected paths');
      } catch (fsError) {
        console.error('File system error:', fsError);
      }
      
      // 如果檔案系統讀取失敗，嘗試從 URL 載入
      // 嘗試多個可能的本地 URL
      const possibleUrls = [
        (globalThis as any).RAG_DOCS_URL_DEV,
        'http://localhost:3000/rag/docs.jsonl',
        'http://localhost:3001/rag/docs.jsonl',
        'http://localhost:3002/rag/docs.jsonl'
      ].filter(Boolean);
      
      const docsUrl = possibleUrls[0] || 'http://localhost:3000/rag/docs.jsonl';
      
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
      
      // 使用並行處理來加速解析
      const batchSize = 10;
      for (let i = 0; i < lines.length; i += batchSize) {
        const batch = lines.slice(i, i + batchSize);
        const batchPromises = batch.map(async (line) => {
          try {
            return JSON.parse(line) as RAGDocument;
          } catch (parseError) {
            console.warn('Failed to parse document line:', line.substring(0, 100));
            return null;
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        documents.push(...batchResults.filter(Boolean) as RAGDocument[]);
      }
      
      console.log(`Successfully loaded ${documents.length} RAG documents from URL`);
      this.cache.setDocuments(documents);
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
        }
      ];
      
      console.log('Using fallback RAG documents');
      this.cache.setDocuments(fallbackDocs);
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

  /**
   * 清除快取（用於開發和測試）
   */
  clearCache(): void {
    this.cache.clearCache();
    console.log('RAG cache cleared');
  }

  /**
   * 獲取快取狀態
   */
  getCacheStatus(): { hasManifest: boolean; hasDocuments: boolean; timestamp: number } {
    return {
      hasManifest: this.cache.getManifest() !== null,
      hasDocuments: this.cache.getDocuments() !== null,
      timestamp: this.cache['cacheTimestamp']
    };
  }
}

export const ragLoaderService = new RAGLoaderService();
