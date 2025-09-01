import { RAGDocument, RAGManifest } from './rag-cache';
import { EnvironmentDetector } from './environment-detector';
import { FULL_RAG_DOCUMENTS, FULL_RAG_MANIFEST } from './full-rag-data';

/**
 * RAG 檔案載入服務
 * 負責從不同來源載入 RAG manifest 和 documents
 */
export class RAGFileLoader {
  /**
   * 從 Markdown 格式解析 manifest
   */
  private static parseManifestFromMarkdown(content: string): RAGManifest {
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
  static getBuiltinRAGDocuments(): RAGDocument[] {
    console.log(`使用完整的 RAG 資料: ${FULL_RAG_DOCUMENTS.length} 筆`);
    return FULL_RAG_DOCUMENTS;
  }

  /**
   * 從檔案系統載入 manifest
   */
  static async loadManifestFromFileSystem(): Promise<RAGManifest | null> {
    try {
      // 在 Cloudflare Workers 環境中，檔案系統不可用
      if (EnvironmentDetector.isCloudflareWorkers()) {
        return null;
      }
      
      // 動態導入 fs 和 path 模組
      const fs = await import('fs');
      const path = await import('path');
      
      const manifestPath = path.join((globalThis as any).process?.cwd?.() || '.', 'data/rag/manifest.md');
      
      if (fs.existsSync(manifestPath)) {
        const content = fs.readFileSync(manifestPath, 'utf8');
        const manifest = this.parseManifestFromMarkdown(content);
        console.log('Successfully loaded manifest from file system');
        return manifest;
      }
      return null;
    } catch (error) {
      console.error('File system error:', error);
      return null;
    }
  }

  /**
   * 從 URL 載入 manifest
   */
  static async loadManifestFromUrl(): Promise<RAGManifest> {
    const manifestUrl = (globalThis as any).RAG_MANIFEST_URL_DEV || 'http://localhost:3000/rag/manifest.json';
    
    console.log('Loading manifest from URL:', manifestUrl);
    const response = await fetch(manifestUrl);
    
    console.log('Manifest response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
    }
    
    const manifest = await response.json() as RAGManifest;
    console.log('Successfully loaded manifest from URL');
    return manifest;
  }

  /**
   * 從檔案系統載入 documents
   */
  static async loadDocumentsFromFileSystem(): Promise<RAGDocument[] | null> {
    try {
      // 在 Cloudflare Workers 環境中，檔案系統不可用
      if (EnvironmentDetector.isCloudflareWorkers()) {
        return null;
      }
      
      // 動態導入 fs 和 path 模組
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
          const documents = await this.parseDocumentsFromJsonl(content);
          console.log(`Loaded ${documents.length} RAG documents from file system: ${docsPath}`);
          return documents;
        }
      }
      
      console.log('RAG documents file not found in any of the expected paths');
      return null;
    } catch (error) {
      console.error('File system error:', error);
      return null;
    }
  }

  /**
   * 從 URL 載入 documents
   */
  static async loadDocumentsFromUrl(): Promise<RAGDocument[]> {
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
    
    const documents = await this.parseDocumentsFromJsonl(text);
    console.log(`Successfully loaded ${documents.length} RAG documents from URL`);
    return documents;
  }

  /**
   * 解析 JSONL 格式的 documents
   */
  private static async parseDocumentsFromJsonl(content: string): Promise<RAGDocument[]> {
    const lines = content.trim().split('\n');
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
    
    return documents;
  }

  /**
   * 載入 manifest（統一入口）
   */
  static async loadManifest(): Promise<RAGManifest> {
    const isCloudflareWorkers = EnvironmentDetector.isCloudflareWorkers();
    console.log('Loading manifest - Environment check:', { isCloudflareWorkers });
    
    if (isCloudflareWorkers) {
      // 在 Cloudflare Workers 中，使用完整的 manifest
      console.log('Using full RAG manifest for Cloudflare Workers');
      return FULL_RAG_MANIFEST;
    }
    
    // 在本地開發環境中，嘗試從檔案系統讀取
    const fileSystemManifest = await this.loadManifestFromFileSystem();
    if (fileSystemManifest) {
      return fileSystemManifest;
    }
    
    // 如果檔案系統讀取失敗，嘗試從 URL 載入
    return await this.loadManifestFromUrl();
  }

  /**
   * 載入 documents（統一入口）
   */
  static async loadDocuments(): Promise<RAGDocument[]> {
    const isCloudflareWorkers = EnvironmentDetector.isCloudflareWorkers();
    console.log('Loading documents - Environment check:', { isCloudflareWorkers });
    
    // 在 Cloudflare Workers 中，直接使用內建的完整 RAG 資料
    if (isCloudflareWorkers) {
      const builtinDocuments = this.getBuiltinRAGDocuments();
      console.log(`Using built-in RAG documents: ${builtinDocuments.length} documents`);
      return builtinDocuments;
    }
    
    // 如果環境檢測失敗，但我們在 Cloudflare Workers 中，也使用內建資料
    const hasCloudflare = EnvironmentDetector.hasCloudflareEnvironment();
    if (hasCloudflare) {
      console.log('Fallback: Using built-in RAG documents in Cloudflare environment');
      const builtinDocuments = this.getBuiltinRAGDocuments();
      console.log(`Using built-in RAG documents: ${builtinDocuments.length} documents`);
      return builtinDocuments;
    }
    
    // 在本地開發環境中，優先嘗試從檔案系統讀取
    const fileSystemDocuments = await this.loadDocumentsFromFileSystem();
    if (fileSystemDocuments) {
      return fileSystemDocuments;
    }
    
    // 如果檔案系統讀取失敗，嘗試從 URL 載入
    return await this.loadDocumentsFromUrl();
  }
}
