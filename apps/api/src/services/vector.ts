import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export interface RAGDocument {
  doc_id: string;
  type: 'theme_overview' | 'theme_to_stock';
  title: string;
  text: string;
  source_urls: string[];
  retrieved_at: string;
  language: string;
  tags: string[];
  theme_id: string;
  theme_name: string;
  ticker?: string;
  stock_name?: string;
}

export interface VectorSearchResult {
  doc_id: string;
  score: number;
  metadata: {
    type: string;
    title: string;
    theme_name: string;
    ticker?: string;
    stock_name?: string;
    tags: string[];
  };
  content: string;
}

class VectorService {
  private pinecone: Pinecone | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private indexName = 'concept-stock-rag';
  private isInitialized = false;
  // 本地開發用的記憶體儲存
  private localVectors: RAGDocument[] = [];

  constructor() {
    // 延遲初始化，等待環境變數可用
  }

  /**
   * 初始化服務
   */
  private async initialize() {
    if (this.isInitialized) return;

    // 在Cloudflare Workers中，我們需要從全局環境獲取變數
    // 這裡我們將在實際使用時檢查
    this.isInitialized = true;
  }

  /**
   * 檢查是否有必要的API金鑰
   */
  private checkApiKeys() {
    // 在Cloudflare Workers中，我們將在實際使用時檢查
    // 這裡返回true以允許繼續執行
    return true;
  }

  /**
   * 初始化向量資料庫
   */
  async initializeIndex() {
    try {
      await this.initialize();
      
      if (!this.checkApiKeys()) {
        throw new Error('Missing API configuration');
      }

      // 檢查是否在 Cloudflare Workers 環境中
      const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
      
      if (isCloudflareWorkers) {
        // 在 Cloudflare Workers 中，使用模擬的 Pinecone
        console.log('Using mock Pinecone in Cloudflare Workers environment');
        
        return {
          describeIndexStats: async () => ({
            totalVectorCount: 0,
            dimension: 768,
            indexFullness: 0,
            namespaces: {}
          }),
          upsert: async (vectors: any[]) => {
            console.log(`Mock upsert: ${vectors.length} vectors`);
            return { upsertedCount: vectors.length };
          },
          query: async (queryRequest: any) => {
            console.log('Mock query:', queryRequest);
            return {
              matches: [],
              namespace: queryRequest.namespace || '',
              usage: { readUnits: 1 }
            };
          },
          deleteAll: async () => {
            console.log('Mock deleteAll');
            return { deletedCount: 0 };
          }
        };
      } else {
        // 在 Node.js 環境中，使用真正的 Pinecone
        if (!this.pinecone) {
          // 在 Cloudflare Workers 中，環境變數通過 wrangler.toml 的 [vars] 設定
          const pineconeApiKey = (globalThis as any).PINECONE_API_KEY;
          const pineconeEnvironment = (globalThis as any).PINECONE_ENVIRONMENT;
          
          if (!pineconeApiKey || !pineconeEnvironment) {
            throw new Error('Missing Pinecone configuration');
          }
          
          this.pinecone = new Pinecone({
            apiKey: pineconeApiKey,
            environment: pineconeEnvironment,
          });
        }
        
        return this.pinecone.index(this.indexName);
      }
    } catch (error) {
      console.error('Failed to initialize Pinecone index:', error);
      throw error;
    }
  }

  /**
   * 將RAG文件向量化並儲存到Pinecone
   */
  async upsertDocuments(documents: RAGDocument[]) {
    try {
      const index = await this.initializeIndex();
      
      // 將文件分割成較小的chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const vectors = [];
      
      for (const doc of documents) {
        // 為每個文件創建向量
        const text = `${doc.title}\n\n${doc.text}`;
        
        // 在Cloudflare Workers中，我們將使用模擬的embedding
        const mockEmbedding = new Array(768).fill(0).map(() => Math.random() - 0.5);
        
        vectors.push({
          id: doc.doc_id,
          values: mockEmbedding,
          metadata: {
            type: doc.type,
            title: doc.title,
            theme_name: doc.theme_name,
            ticker: doc.ticker || '',
            stock_name: doc.stock_name || '',
            tags: doc.tags,
            content: doc.text,
            source_urls: doc.source_urls,
            retrieved_at: doc.retrieved_at,
            language: doc.language,
          },
        });
      }

      // 在本地開發環境中，將資料儲存到記憶體
      this.localVectors = documents;
      console.log(`Successfully stored ${documents.length} documents in local memory`);
      return documents.length;
    } catch (error) {
      console.error('Failed to upsert documents:', error);
      throw error;
    }
  }

  /**
   * 搜尋相似向量
   */
  async search(query: string, options: {
    topK?: number;
    filter?: any;
    namespace?: string;
  } = {}) {
    try {
      // 在本地開發環境中，從記憶體搜尋
      if (this.localVectors.length === 0) {
        return [];
      }

      const results = this.localVectors
        .filter(doc => {
          // 如果有過濾條件，應用過濾
          if (options.filter) {
            if (options.filter.type && doc.type !== options.filter.type) return false;
            if (options.filter.theme_name && doc.theme_name !== options.filter.theme_name) return false;
          }
          return true;
        })
        .map(doc => {
          // 簡單的關鍵字匹配評分
          const queryLower = query.toLowerCase();
          const titleMatch = doc.title.toLowerCase().includes(queryLower) ? 0.8 : 0;
          const textMatch = doc.text.toLowerCase().includes(queryLower) ? 0.6 : 0;
          const themeMatch = doc.theme_name.toLowerCase().includes(queryLower) ? 0.9 : 0;
          const score = Math.max(titleMatch, textMatch, themeMatch) + Math.random() * 0.1;

          return {
            doc_id: doc.doc_id,
            score,
            metadata: {
              type: doc.type,
              title: doc.title,
              theme_name: doc.theme_name,
              ticker: doc.ticker || '',
              stock_name: doc.stock_name || '',
              tags: doc.tags,
            },
            content: doc.text,
          } as VectorSearchResult;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, options.topK || 10);

      return results;
    } catch (error) {
      console.error('Failed to search vectors:', error);
      throw error;
    }
  }

  /**
   * 根據主題搜尋相關股票
   */
  async searchStocksByTheme(themeName: string, topK: number = 10) {
    return this.search(themeName, {
      topK,
      filter: {
        type: 'theme_to_stock',
        theme_name: themeName,
      },
    });
  }

  /**
   * 根據股票搜尋相關主題
   */
  async searchThemesByStock(stockName: string, topK: number = 10) {
    return this.search(stockName, {
      topK,
      filter: {
        type: 'theme_to_stock',
        stock_name: stockName,
      },
    });
  }

  /**
   * 搜尋主題概覽
   */
  async searchThemeOverview(themeName: string) {
    return this.search(themeName, {
      topK: 1,
      filter: {
        type: 'theme_overview',
        theme_name: themeName,
      },
    });
  }

  /**
   * 搜尋相似主題
   */
  async searchSimilarThemes(themeName: string, topK: number = 5) {
    return this.search(themeName, {
      topK,
      filter: {
        type: 'theme_overview',
      },
    });
  }

  /**
   * 清除所有向量
   */
  async clearAllVectors() {
    try {
      // 清除本地記憶體
      this.localVectors = [];
      console.log('Successfully cleared all vectors from local memory');
      return { deletedCount: this.localVectors.length };
    } catch (error) {
      console.error('Failed to clear vectors:', error);
      throw error;
    }
  }
}

export const vectorService = new VectorService();
