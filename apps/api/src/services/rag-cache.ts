import { RAGDocument } from './vector';

export { RAGDocument };
export interface RAGManifest {
  theme_overview: number;
  theme_to_stock: number;
  total: number;
  fields: string[];
  note: string;
}

/**
 * RAG 快取管理服務
 * 負責管理 RAG manifest 和 documents 的快取
 */
export class RAGCache {
  private static instance: RAGCache;
  private manifestCache: RAGManifest | null = null;
  private documentsCache: RAGDocument[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分鐘快取

  private constructor() {}

  static getInstance(): RAGCache {
    if (!RAGCache.instance) {
      RAGCache.instance = new RAGCache();
    }
    return RAGCache.instance;
  }

  /**
   * 檢查快取是否有效
   */
  isCacheValid(): boolean {
    return this.cacheTimestamp > 0 && 
           (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION;
  }

  /**
   * 設定 manifest 快取
   */
  setManifest(manifest: RAGManifest): void {
    this.manifestCache = manifest;
    this.cacheTimestamp = Date.now();
  }

  /**
   * 取得 manifest 快取
   */
  getManifest(): RAGManifest | null {
    return this.isCacheValid() ? this.manifestCache : null;
  }

  /**
   * 設定 documents 快取
   */
  setDocuments(documents: RAGDocument[]): void {
    this.documentsCache = documents;
    this.cacheTimestamp = Date.now();
  }

  /**
   * 取得 documents 快取
   */
  getDocuments(): RAGDocument[] | null {
    return this.isCacheValid() ? this.documentsCache : null;
  }

  /**
   * 清除快取
   */
  clearCache(): void {
    this.manifestCache = null;
    this.documentsCache = null;
    this.cacheTimestamp = 0;
  }

  /**
   * 獲取快取狀態
   */
  getCacheStatus(): { hasManifest: boolean; hasDocuments: boolean; timestamp: number } {
    return {
      hasManifest: this.manifestCache !== null,
      hasDocuments: this.documentsCache !== null,
      timestamp: this.cacheTimestamp
    };
  }
}
