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

export interface VectorSearchOptions {
  topK?: number;
  filter?: {
    type?: string;
    theme_id?: string;
    ticker?: string;
  };
  includeMetadata?: boolean;
}

class VectorService {
  private pinecone: Pinecone | null = null;
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private indexName = 'concept-stock-screener';
  private isInitialized = false;
  // 本地開發用的記憶體儲存
  private localVectors: RAGDocument[] = [];
  private localEmbeddings: Map<string, number[]> = new Map();

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
  private checkApiKeys(env?: any) {
    // 檢查 Pinecone 環境變數
    const pineconeApiKey = env?.PINECONE_API_KEY || (globalThis as any).PINECONE_API_KEY;
    const pineconeEnvironment = env?.PINECONE_ENVIRONMENT || (globalThis as any).PINECONE_ENVIRONMENT;
    const geminiApiKey = env?.GEMINI_API_KEY || (globalThis as any).GEMINI_API_KEY;
    
    if (!pineconeApiKey || !pineconeEnvironment || !geminiApiKey) {
      console.log('API keys not found, using local memory mode');
      return false;
    }
    
    return true;
  }

  /**
   * 初始化向量資料庫
   */
  async initializeIndex(env?: any) {
    try {
      await this.initialize();
      
      // 檢查是否有 Pinecone 配置
      if (!this.checkApiKeys(env)) {
        console.log('No Pinecone configuration found, using local memory mode');
        return null; // 返回 null 表示使用本地模式
      }

      // 檢查是否在 Cloudflare Workers 環境中
      const isCloudflareWorkers = typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;
      
      if (isCloudflareWorkers) {
        // 在 Cloudflare Workers 中，使用模擬的 Pinecone
        console.log('Using mock Pinecone in Cloudflare Workers environment');
        
        return {
          describeIndexStats: async () => ({
            totalVectorCount: this.localVectors.length,
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
   * 初始化嵌入模型
   */
  private async initializeEmbeddings(env?: any) {
    if (this.embeddings) return this.embeddings;

    const geminiApiKey = env?.GEMINI_API_KEY || (globalThis as any).GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      throw new Error('Missing Gemini API key for embeddings');
    }

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: 'embedding-001',
      apiKey: geminiApiKey,
    });

    return this.embeddings;
  }

  /**
   * 生成文本嵌入
   */
  async generateEmbedding(text: string, env?: any): Promise<number[]> {
    try {
      const embeddings = await this.initializeEmbeddings(env);
      const result = await embeddings.embedQuery(text);
      return result;
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // 返回零向量作為 fallback
      return new Array(768).fill(0);
    }
  }

  /**
   * 將RAG文件向量化並儲存到Pinecone或本地記憶體
   */
  async upsertDocuments(documents: RAGDocument[], env?: any) {
    try {
      const index = await this.initializeIndex(env);
      
      // 如果沒有 Pinecone 配置，直接使用本地記憶體模式
      if (!index) {
        console.log('Using local memory mode for vector storage');
        
        // 儲存到本地記憶體
        this.localVectors = [...this.localVectors, ...documents];
        
        // 為每個文檔生成嵌入
        for (const doc of documents) {
          const embedding = await this.generateEmbedding(doc.text, env);
          this.localEmbeddings.set(doc.doc_id, embedding);
        }
        
        console.log(`Stored ${documents.length} documents in local memory`);
        return { upsertedCount: documents.length };
      }

      // 使用 Pinecone
      const embeddings = await this.initializeEmbeddings(env);
      
      // 將文檔轉換為 LangChain Document 格式
      const langchainDocs = documents.map(doc => new Document({
        pageContent: doc.text,
        metadata: {
          doc_id: doc.doc_id,
          type: doc.type,
          title: doc.title,
          theme_id: doc.theme_id,
          theme_name: doc.theme_name,
          ticker: doc.ticker,
          stock_name: doc.stock_name,
          tags: doc.tags,
          language: doc.language,
          source_urls: doc.source_urls,
          retrieved_at: doc.retrieved_at
        }
      }));

      // 生成嵌入
      const vectors = await embeddings.embedDocuments(
        langchainDocs.map(doc => doc.pageContent)
      );

      // 準備 Pinecone 向量格式
      const pineconeVectors = vectors.map((vector, index) => ({
        id: langchainDocs[index].metadata.doc_id,
        values: vector,
        metadata: langchainDocs[index].metadata
      }));

      // 儲存到 Pinecone
      const result = await index.upsert(pineconeVectors);
      console.log(`Upserted ${result.upsertedCount} vectors to Pinecone`);
      
      return result;
    } catch (error) {
      console.error('Failed to upsert documents:', error);
      throw error;
    }
  }

  /**
   * 向量搜尋
   */
  async search(
    query: string, 
    options: VectorSearchOptions = {}, 
    env?: any
  ): Promise<VectorSearchResult[]> {
    try {
      const index = await this.initializeIndex(env);
      const topK = options.topK || 10;
      
      // 如果沒有 Pinecone 配置，使用本地記憶體搜尋
      if (!index) {
        console.log('Using local memory mode for vector search');
        return this.localSearch(query, options);
      }

      // 生成查詢嵌入
      const queryEmbedding = await this.generateEmbedding(query, env);
      
      // 準備查詢參數
      const queryRequest: any = {
        vector: queryEmbedding,
        topK,
        includeMetadata: options.includeMetadata !== false
      };

      // 添加過濾條件
      if (options.filter) {
        queryRequest.filter = {};
        if (options.filter.type) {
          queryRequest.filter.type = options.filter.type;
        }
        if (options.filter.theme_id) {
          queryRequest.filter.theme_id = options.filter.theme_id;
        }
        if (options.filter.ticker) {
          queryRequest.filter.ticker = options.filter.ticker;
        }
      }

      // 執行搜尋
      const result = await index.query(queryRequest);
      
      // 轉換結果格式
      return result.matches.map(match => ({
        doc_id: match.id,
        score: match.score || 0,
        metadata: {
          type: match.metadata?.type || '',
          title: match.metadata?.title || '',
          theme_name: match.metadata?.theme_name || '',
          ticker: match.metadata?.ticker,
          stock_name: match.metadata?.stock_name,
          tags: match.metadata?.tags || []
        },
        content: match.metadata?.pageContent || ''
      }));
    } catch (error) {
      console.error('Failed to perform vector search:', error);
      // 回退到本地搜尋
      return this.localSearch(query, options);
    }
  }

  /**
   * 本地記憶體向量搜尋
   */
  private async localSearch(
    query: string, 
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    try {
      const topK = options.topK || 10;
      
      // 生成查詢嵌入
      const queryEmbedding = await this.generateEmbedding(query);
      
      // 計算相似度分數
      const scores: Array<{ doc: RAGDocument; score: number }> = [];
      
      for (const doc of this.localVectors) {
        const docEmbedding = this.localEmbeddings.get(doc.doc_id);
        
        if (docEmbedding) {
          // 計算餘弦相似度
          const score = this.cosineSimilarity(queryEmbedding, docEmbedding);
          scores.push({ doc, score });
        }
      }
      
      // 排序並取前 topK 個結果
      scores.sort((a, b) => b.score - a.score);
      const topResults = scores.slice(0, topK);
      
      // 轉換為結果格式
      return topResults.map(({ doc, score }) => ({
        doc_id: doc.doc_id,
        score,
        metadata: {
          type: doc.type,
          title: doc.title,
          theme_name: doc.theme_name,
          ticker: doc.ticker,
          stock_name: doc.stock_name,
          tags: doc.tags
        },
        content: doc.text
      }));
    } catch (error) {
      console.error('Failed to perform local search:', error);
      return [];
    }
  }

  /**
   * 計算餘弦相似度
   */
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      return 0;
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 獲取索引統計資訊
   */
  async getIndexStats(env?: any) {
    try {
      const index = await this.initializeIndex(env);
      
      if (!index) {
        return {
          totalVectorCount: this.localVectors.length,
          dimension: 768,
          indexFullness: 0,
          namespaces: {}
        };
      }
      
      return await index.describeIndexStats();
    } catch (error) {
      console.error('Failed to get index stats:', error);
      return {
        totalVectorCount: 0,
        dimension: 768,
        indexFullness: 0,
        namespaces: {}
      };
    }
  }

  /**
   * 清空索引
   */
  async clearIndex(env?: any) {
    try {
      const index = await this.initializeIndex(env);
      
      if (!index) {
        this.localVectors = [];
        this.localEmbeddings.clear();
        console.log('Cleared local memory vectors');
        return { deletedCount: 0 };
      }
      
      return await index.deleteAll();
    } catch (error) {
      console.error('Failed to clear index:', error);
      throw error;
    }
  }

  /**
   * 載入 RAG 文件到向量資料庫
   */
  async loadRAGDocuments(env?: any) {
    try {
      // 讀取 RAG 文件
      const response = await fetch('http://localhost:8787/rag/docs.jsonl');
      if (!response.ok) {
        throw new Error('Failed to fetch RAG documents');
      }
      
      const text = await response.text();
      const lines = text.trim().split('\n');
      
      const documents: RAGDocument[] = [];
      for (const line of lines) {
        try {
          const doc = JSON.parse(line) as RAGDocument;
          documents.push(doc);
        } catch (error) {
          console.warn('Failed to parse RAG document line:', line);
        }
      }
      
      console.log(`Loaded ${documents.length} RAG documents`);
      
      // 儲存到向量資料庫
      await this.upsertDocuments(documents, env);
      
      return documents.length;
    } catch (error) {
      console.error('Failed to load RAG documents:', error);
      throw error;
    }
  }
}

export const vectorService = new VectorService();
