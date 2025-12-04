# RAG 系統整合完整文檔

## 1. RAG 系統設計原則

### 1.1 設計目標

- **智能檢索**：基於語義的準確信息檢索
- **實時更新**：支持動態數據更新和重新向量化
- **高效查詢**：快速響應用戶查詢，支持複雜語義理解
- **可擴展性**：支持多種數據源和 AI 模型

### 1.2 核心原則

- **檢索優先**：先檢索相關信息，再生成答案
- **上下文感知**：充分利用檢索到的上下文信息
- **事實性保證**：基於真實數據生成答案，避免幻覺
- **用戶體驗**：快速響應，準確回答

## 2. 系統架構設計

### 2.1 整體架構圖

```
用戶查詢
    ↓
查詢預處理
    ↓
語義檢索 (向量搜索)
    ↓
上下文組裝
    ↓
Gemini 2.5 Pro 生成
    ↓
答案後處理
    ↓
返回結果
```

### 2.2 組件架構

```
RAG System
├── Data Ingestion Layer (數據攝入層)
│   ├── Document Loader (文檔載入器)
│   ├── Text Processor (文本處理器)
│   └── Metadata Extractor (元數據提取器)
│
├── Vectorization Layer (向量化層)
│   ├── Embedding Model (嵌入模型)
│   ├── Chunking Strategy (分塊策略)
│   └── Vector Store (向量存儲)
│
├── Retrieval Layer (檢索層)
│   ├── Query Processor (查詢處理器)
│   ├── Vector Search (向量搜索)
│   └── Reranking (重新排序)
│
├── Generation Layer (生成層)
│   ├── Gemini 2.5 Pro (AI 模型)
│   ├── Prompt Engineering (提示工程)
│   └── Response Generator (響應生成器)
│
└── Management Layer (管理層)
    ├── Cache Manager (快取管理器)
    ├── Update Scheduler (更新調度器)
    └── Performance Monitor (性能監控器)
```

## 3. Gemini 2.5 Pro 整合

### 3.1 模型配置

```typescript
// Gemini 配置接口
interface GeminiConfig {
  apiKey: string;
  model: 'gemini-2.0-flash-exp' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  topK: number;
  safetySettings: SafetySetting[];
}

// 安全設置
interface SafetySetting {
  category: HarmCategory;
  threshold: HarmBlockThreshold;
}

// 響應接口
interface GeminiResponse {
  text: string;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  safetyRatings: SafetyRating[];
}
```

### 3.2 Gemini 服務封裝

```typescript
// Gemini 服務類
class GeminiService {
  private config: GeminiConfig;
  private client: GoogleGenerativeAI;

  constructor(config: GeminiConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  // 生成回答
  async generateResponse(
    prompt: string,
    context: string[],
    options?: Partial<GeminiConfig>
  ): Promise<GeminiResponse> {
    const model = this.client.getGenerativeModel({
      model: options?.model || this.config.model,
      generationConfig: {
        temperature: options?.temperature || this.config.temperature,
        maxOutputTokens:
          options?.maxOutputTokens || this.config.maxOutputTokens,
        topP: options?.topP || this.config.topP,
        topK: options?.topK || this.config.topK,
      },
      safetySettings: options?.safetySettings || this.config.safetySettings,
    });

    const fullPrompt = this.buildPrompt(prompt, context);
    const result = await model.generateContent(fullPrompt);

    return {
      text: result.response.text(),
      usageMetadata: result.response.usageMetadata,
      safetyRatings: result.response.safetyRatings,
    };
  }

  // 構建提示詞
  private buildPrompt(query: string, context: string[]): string {
    const contextText = context.join('\n\n');

    return `你是一個專業的股票概念分析助手。請基於以下上下文信息回答用戶的問題：

上下文信息：
${contextText}

用戶問題：${query}

請注意：
1. 只基於提供的上下文信息回答
2. 如果上下文中沒有相關信息，請明確說明
3. 回答要準確、簡潔、有用
4. 使用繁體中文回答

回答：`;
  }

  // 批量生成
  async generateBatch(
    queries: string[],
    context: string[]
  ): Promise<GeminiResponse[]> {
    const promises = queries.map(query =>
      this.generateResponse(query, context)
    );
    return Promise.all(promises);
  }
}
```

### 3.3 提示工程優化

```typescript
// 專業提示詞模板
const PROMPT_TEMPLATES = {
  // 概念股篩選提示詞
  stockScreening: `
你是一個專業的股票概念篩選專家。請基於以下信息幫助用戶篩選相關概念股：

市場背景：{marketContext}
用戶需求：{userRequirement}
相關概念：{relatedConcepts}

請提供：
1. 符合條件的股票列表（按相關性排序）
2. 每支股票的相關概念強度分析
3. 投資風險提示
4. 後續關注建議

要求：準確、專業、實用
`,

  // 概念分析提示詞
  conceptAnalysis: `
你是一個股票概念分析專家。請分析以下概念對相關股票的影響：

概念名稱：{conceptName}
概念描述：{conceptDescription}
相關股票：{relatedStocks}
市場環境：{marketEnvironment}

請提供：
1. 概念發展前景分析
2. 對相關股票的影響評估
3. 投資時機建議
4. 風險因素分析

要求：客觀、深入、實用
`,

  // 趨勢預測提示詞
  trendPrediction: `
你是一個市場趨勢預測專家。請基於以下信息預測概念股發展趨勢：

歷史數據：{historicalData}
當前狀況：{currentStatus}
外部因素：{externalFactors}
技術指標：{technicalIndicators}

請提供：
1. 短期趨勢預測（1-3個月）
2. 中期發展展望（3-6個月）
3. 關鍵影響因素分析
4. 投資策略建議

要求：謹慎、客觀、有據可依
`,
};
```

## 4. 數據處理和向量化

### 4.1 文檔處理流程

```python
# 數據處理管道
from typing import List, Dict, Any
import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
import pinecone

class DocumentProcessor:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
        )
        self.embeddings = OpenAIEmbeddings()

    def process_documents(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """處理文檔並生成向量"""
        processed_chunks = []

        for doc in documents:
            # 文本分塊
            chunks = self.text_splitter.split_text(doc['content'])

            for i, chunk in enumerate(chunks):
                # 生成嵌入向量
                embedding = self.embeddings.embed_query(chunk)

                processed_chunks.append({
                    'id': f"{doc['id']}_chunk_{i}",
                    'content': chunk,
                    'embedding': embedding,
                    'metadata': {
                        'source_id': doc['id'],
                        'chunk_index': i,
                        'source_type': doc.get('type', 'unknown'),
                        'timestamp': doc.get('timestamp'),
                        'title': doc.get('title', ''),
                        'tags': doc.get('tags', []),
                    }
                })

        return processed_chunks
```

### 4.2 向量存儲管理

```python
# Pinecone 向量存儲管理
class VectorStoreManager:
    def __init__(self, api_key: str, environment: str, index_name: str):
        pinecone.init(api_key=api_key, environment=environment)
        self.index_name = index_name
        self.index = self._get_or_create_index()

    def _get_or_create_index(self, dimension: int = 1536):
        """獲取或創建索引"""
        if self.index_name not in pinecone.list_indexes():
            pinecone.create_index(
                name=self.index_name,
                dimension=dimension,
                metric='cosine'
            )

        return pinecone.Index(self.index_name)

    def upsert_vectors(self, vectors: List[Dict[str, Any]]):
        """插入或更新向量"""
        # 準備數據格式
        ids = [v['id'] for v in vectors]
        embeddings = [v['embedding'] for v in vectors]
        metadata = [v['metadata'] for v in vectors]

        # 批量插入
        self.index.upsert(
            vectors=zip(ids, embeddings, metadata)
        )

    def search_similar(
        self,
        query_embedding: List[float],
        top_k: int = 10,
        filter_dict: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """搜索相似向量"""
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict
        )

        return results.matches

    def delete_vectors(self, vector_ids: List[str]):
        """刪除向量"""
        self.index.delete(ids=vector_ids)
```

### 4.3 數據更新策略

```python
# 數據更新管理器
class DataUpdateManager:
    def __init__(self, vector_store: VectorStoreManager):
        self.vector_store = vector_store
        self.update_scheduler = self._setup_scheduler()

    def _setup_scheduler(self):
        """設置更新調度器"""
        from apscheduler.schedulers.background import BackgroundScheduler

        scheduler = BackgroundScheduler()

        # 每日更新
        scheduler.add_job(
            self._daily_update,
            'cron',
            hour=2,  # 凌晨2點
            minute=0
        )

        # 每小時檢查
        scheduler.add_job(
            self._hourly_check,
            'interval',
            hours=1
        )

        return scheduler

    def _daily_update(self):
        """每日數據更新"""
        try:
            # 獲取最新數據
            new_data = self._fetch_latest_data()

            # 處理和向量化
            processed_data = self._process_new_data(new_data)

            # 更新向量存儲
            self._update_vector_store(processed_data)

            # 清理舊數據
            self._cleanup_old_data()

            print(f"Daily update completed: {len(processed_data)} documents processed")

        except Exception as e:
            print(f"Daily update failed: {str(e)}")
            self._send_alert(f"Daily update failed: {str(e)}")

    def _hourly_check(self):
        """每小時檢查數據新鮮度"""
        try:
            # 檢查數據新鮮度
            freshness = self._check_data_freshness()

            if freshness < 0.8:  # 數據新鮮度低於80%
                self._send_alert(f"Data freshness is low: {freshness}")

        except Exception as e:
            print(f"Hourly check failed: {str(e)}")

    def _fetch_latest_data(self) -> List[Dict[str, Any]]:
        """獲取最新數據"""
        # 實現數據獲取邏輯
        pass

    def _process_new_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """處理新數據"""
        # 實現數據處理邏輯
        pass

    def _update_vector_store(self, data: List[Dict[str, Any]]):
        """更新向量存儲"""
        # 實現向量存儲更新邏輯
        pass
```

## 5. 檢索和排序策略

### 5.1 查詢處理

```typescript
// 查詢處理器
class QueryProcessor {
  // 查詢預處理
  preprocessQuery(query: string): ProcessedQuery {
    return {
      original: query,
      normalized: this.normalizeQuery(query),
      keywords: this.extractKeywords(query),
      intent: this.detectIntent(query),
      entities: this.extractEntities(query),
    };
  }

  // 查詢正規化
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\u4e00-\u9fff]/g, '');
  }

  // 關鍵詞提取
  private extractKeywords(query: string): string[] {
    // 使用 jieba 或其他中文分詞工具
    const keywords = jieba.cut(query);
    return keywords.filter(word => word.length > 1);
  }

  // 意圖檢測
  private detectIntent(query: string): QueryIntent {
    if (query.includes('篩選') || query.includes('找出')) {
      return 'SCREENING';
    } else if (query.includes('分析') || query.includes('評估')) {
      return 'ANALYSIS';
    } else if (query.includes('預測') || query.includes('趨勢')) {
      return 'PREDICTION';
    } else {
      return 'GENERAL';
    }
  }

  // 實體提取
  private extractEntities(query: string): Entity[] {
    const entities: Entity[] = [];

    // 提取股票代碼
    const stockCodes = query.match(/\d{4,6}/g);
    if (stockCodes) {
      entities.push(
        ...stockCodes.map(code => ({
          type: 'STOCK_CODE',
          value: code,
          confidence: 0.9,
        }))
      );
    }

    // 提取概念名稱
    const conceptPatterns = [
      /(AI|人工智能|機器學習)/,
      /(新能源|電動車|太陽能)/,
      /(半導體|芯片|集成電路)/,
      /(醫療|生物|製藥)/,
    ];

    conceptPatterns.forEach(pattern => {
      const match = query.match(pattern);
      if (match) {
        entities.push({
          type: 'CONCEPT',
          value: match[0],
          confidence: 0.8,
        });
      }
    });

    return entities;
  }
}
```

## 6. 後續步驟

### 6.1 立即執行

1. 設置 Gemini API 密鑰和配置
2. 建立向量數據庫連接
3. 實現基礎的 RAG 查詢流程

### 6.2 短期目標 (1-2 週)

1. 完成數據向量化流程
2. 實現基本的檢索和生成功能
3. 建立性能監控系統

### 6.3 中期目標 (3-4 週)

1. 優化檢索策略和排序算法
2. 實現多層快取系統
3. 建立完整的錯誤處理機制

### 6.4 長期目標 (6-8 週)

1. 實現智能查詢優化
2. 建立自動化數據更新流程
3. 優化模型性能和準確性

# RAG 系統整合完整文檔 - 第二部分

## 7. 混合檢索和上下文組裝

### 7.1 混合檢索策略

```typescript
// 混合檢索器
class HybridRetriever {
  constructor(
    private vectorRetriever: VectorRetriever,
    private keywordRetriever: KeywordRetriever,
    private semanticRetriever: SemanticRetriever
  ) {}

  // 混合檢索
  async retrieve(
    query: ProcessedQuery,
    topK: number = 20
  ): Promise<RetrievalResult[]> {
    // 並行檢索
    const [vectorResults, keywordResults, semanticResults] = await Promise.all([
      this.vectorRetriever.retrieve(query, topK),
      this.keywordRetriever.retrieve(query, topK),
      this.semanticRetriever.retrieve(query, topK),
    ]);

    // 結果融合和重新排序
    const mergedResults = this.mergeResults(
      vectorResults,
      keywordResults,
      semanticResults
    );

    // 重新排序
    const rerankedResults = await this.rerank(mergedResults, query);

    return rerankedResults.slice(0, topK);
  }

  // 結果融合
  private mergeResults(
    vectorResults: RetrievalResult[],
    keywordResults: RetrievalResult[],
    semanticResults: RetrievalResult[]
  ): RetrievalResult[] {
    const resultMap = new Map<string, RetrievalResult>();

    // 合併向量檢索結果
    vectorResults.forEach(result => {
      resultMap.set(result.id, {
        ...result,
        score: result.score * 0.4, // 權重40%
      });
    });

    // 合併關鍵詞檢索結果
    keywordResults.forEach(result => {
      const existing = resultMap.get(result.id);
      if (existing) {
        existing.score += result.score * 0.3; // 權重30%
      } else {
        resultMap.set(result.id, {
          ...result,
          score: result.score * 0.3,
        });
      }
    });

    // 合併語義檢索結果
    semanticResults.forEach(result => {
      const existing = resultMap.get(result.id);
      if (existing) {
        existing.score += result.score * 0.3; // 權重30%
      } else {
        resultMap.set(result.id, {
          ...result,
          score: result.score * 0.3,
        });
      }
    });

    return Array.from(resultMap.values());
  }

  // 重新排序
  private async rerank(
    results: RetrievalResult[],
    query: ProcessedQuery
  ): Promise<RetrievalResult[]> {
    // 使用 Gemini 進行重新排序
    const reranker = new GeminiReranker();
    return reranker.rerank(results, query);
  }
}
```

### 7.2 上下文組裝

```typescript
// 上下文組裝器
class ContextAssembler {
  // 組裝上下文
  assembleContext(
    query: ProcessedQuery,
    results: RetrievalResult[],
    maxTokens: number = 4000
  ): AssembledContext {
    let currentTokens = 0;
    const selectedResults: RetrievalResult[] = [];
    const contextParts: string[] = [];

    // 按相關性排序
    const sortedResults = results.sort((a, b) => b.score - a.score);

    for (const result of sortedResults) {
      const estimatedTokens = this.estimateTokens(result.content);

      if (currentTokens + estimatedTokens <= maxTokens) {
        selectedResults.push(result);
        contextParts.push(this.formatContextPart(result));
        currentTokens += estimatedTokens;
      } else {
        break;
      }
    }

    return {
      query: query,
      context: contextParts.join('\n\n'),
      sources: selectedResults.map(r => r.metadata),
      totalTokens: currentTokens,
      coverage: selectedResults.length / results.length,
    };
  }

  // 格式化上下文片段
  private formatContextPart(result: RetrievalResult): string {
    const metadata = result.metadata;

    return `[來源: ${metadata.source_type} | 標題: ${metadata.title} | 相關性: ${(result.score * 100).toFixed(1)}%]

${result.content}

---`;
  }

  // 估算 token 數量
  private estimateTokens(text: string): number {
    // 簡單估算：中文字符約等於1個token，英文單詞約等於1.3個token
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;

    return chineseChars + Math.ceil(englishWords * 1.3);
  }
}
```

## 8. 快取和性能優化

### 8.1 多層快取策略

```typescript
// 快取管理器
class CacheManager {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private redisCache: RedisCache;
  private cdnCache: CDNCache;

  constructor() {
    this.redisCache = new RedisCache();
    this.cdnCache = new CDNCache();
  }

  // 獲取快取
  async get(key: string): Promise<any | null> {
    // 1. 檢查記憶體快取
    const memoryResult = this.memoryCache.get(key);
    if (memoryResult && !this.isExpired(memoryResult)) {
      return memoryResult.value;
    }

    // 2. 檢查 Redis 快取
    const redisResult = await this.redisCache.get(key);
    if (redisResult) {
      // 更新記憶體快取
      this.memoryCache.set(key, {
        value: redisResult,
        timestamp: Date.now(),
        ttl: 300000, // 5分鐘
      });
      return redisResult;
    }

    // 3. 檢查 CDN 快取
    const cdnResult = await this.cdnCache.get(key);
    if (cdnResult) {
      return cdnResult;
    }

    return null;
  }

  // 設置快取
  async set(key: string, value: any, ttl: number = 3600000): Promise<void> {
    // 1. 設置記憶體快取
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: Math.min(ttl, 300000), // 記憶體快取最多5分鐘
    });

    // 2. 設置 Redis 快取
    await this.redisCache.set(key, value, ttl);

    // 3. 設置 CDN 快取（適用於靜態內容）
    if (this.shouldCacheInCDN(key, value)) {
      await this.cdnCache.set(key, value, ttl);
    }
  }

  // 檢查是否過期
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  // 判斷是否應該快取在 CDN
  private shouldCacheInCDN(key: string, value: any): boolean {
    return (
      key.startsWith('/api/static/') ||
      key.startsWith('/api/public/') ||
      typeof value === 'string'
    );
  }
}
```

### 8.2 查詢優化

```typescript
// 查詢優化器
class QueryOptimizer {
  // 查詢去重和合併
  deduplicateQueries(queries: string[]): string[] {
    const normalizedQueries = queries.map(q => this.normalizeQuery(q));
    const uniqueQueries: string[] = [];
    const seen = new Set<string>();

    queries.forEach((query, index) => {
      const normalized = normalizedQueries[index];
      if (!seen.has(normalized)) {
        seen.add(normalized);
        uniqueQueries.push(query);
      }
    });

    return uniqueQueries;
  }

  // 查詢預熱
  async warmupQueries(commonQueries: string[]): Promise<void> {
    const warmupPromises = commonQueries.map(async query => {
      try {
        const result = await this.executeQuery(query);
        // 將結果存入快取
        await this.cacheManager.set(
          `warmup:${this.hashQuery(query)}`,
          result,
          1800000 // 30分鐘
        );
      } catch (error) {
        console.warn(`Warmup failed for query: ${query}`, error);
      }
    });

    await Promise.allSettled(warmupPromises);
  }

  // 查詢優先級排序
  prioritizeQueries(queries: string[]): PrioritizedQuery[] {
    return queries
      .map(query => ({
        query,
        priority: this.calculatePriority(query),
        estimatedTime: this.estimateExecutionTime(query),
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  // 計算查詢優先級
  private calculatePriority(query: string): number {
    let priority = 0;

    // 用戶查詢優先級最高
    if (query.includes('用戶') || query.includes('個人')) {
      priority += 100;
    }

    // 實時數據優先級較高
    if (query.includes('實時') || query.includes('最新')) {
      priority += 50;
    }

    // 複雜查詢優先級較低
    if (query.length > 100) {
      priority -= 20;
    }

    return priority;
  }

  // 估算執行時間
  private estimateExecutionTime(query: string): number {
    let baseTime = 100; // 基礎時間100ms

    // 查詢長度影響
    baseTime += query.length * 0.5;

    // 複雜度影響
    if (query.includes('分析') || query.includes('預測')) {
      baseTime += 200;
    }

    if (query.includes('比較') || query.includes('篩選')) {
      baseTime += 150;
    }

    return baseTime;
  }
}
```

## 9. 監控和錯誤處理

### 9.1 性能監控

```typescript
// 性能監控器
class PerformanceMonitor {
  private metrics: Map<string, MetricData[]> = new Map();

  // 記錄查詢性能
  recordQueryPerformance(
    query: string,
    startTime: number,
    endTime: number,
    success: boolean,
    resultCount: number
  ): void {
    const duration = endTime - startTime;
    const queryHash = this.hashQuery(query);

    if (!this.metrics.has(queryHash)) {
      this.metrics.set(queryHash, []);
    }

    this.metrics.get(queryHash)!.push({
      timestamp: Date.now(),
      duration,
      success,
      resultCount,
      query,
    });

    // 清理舊數據
    this.cleanupOldMetrics();
  }

  // 獲取性能統計
  getPerformanceStats(timeRange: number = 3600000): PerformanceStats {
    const now = Date.now();
    const stats: PerformanceStats = {
      totalQueries: 0,
      successfulQueries: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      totalResults: 0,
      cacheHitRate: 0,
    };

    let totalDuration = 0;
    const responseTimes: number[] = [];

    this.metrics.forEach((metricList, queryHash) => {
      const recentMetrics = metricList.filter(
        m => now - m.timestamp < timeRange
      );

      recentMetrics.forEach(metric => {
        stats.totalQueries++;
        if (metric.success) {
          stats.successfulQueries++;
        }
        totalDuration += metric.duration;
        responseTimes.push(metric.duration);
        stats.totalResults += metric.resultCount;
      });
    });

    if (stats.totalQueries > 0) {
      stats.averageResponseTime = totalDuration / stats.totalQueries;

      // 計算百分位數
      responseTimes.sort((a, b) => a - b);
      const p95Index = Math.floor(responseTimes.length * 0.95);
      const p99Index = Math.floor(responseTimes.length * 0.99);

      stats.p95ResponseTime = responseTimes[p95Index] || 0;
      stats.p99ResponseTime = responseTimes[p99Index] || 0;
    }

    return stats;
  }

  // 清理舊指標
  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - 86400000; // 24小時前

    this.metrics.forEach((metricList, queryHash) => {
      const filteredMetrics = metricList.filter(m => m.timestamp > cutoffTime);

      if (filteredMetrics.length === 0) {
        this.metrics.delete(queryHash);
      } else {
        this.metrics.set(queryHash, filteredMetrics);
      }
    });
  }
}
```

### 9.2 錯誤處理和重試

```typescript
// 錯誤處理器
class ErrorHandler {
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  // 處理查詢錯誤
  async handleQueryError(
    error: Error,
    query: string,
    context: any
  ): Promise<ErrorResponse> {
    // 記錄錯誤
    this.logError(error, query, context);

    // 分類錯誤
    const errorType = this.classifyError(error);

    // 根據錯誤類型決定處理策略
    switch (errorType) {
      case 'RATE_LIMIT':
        return this.handleRateLimitError(error, query);

      case 'TIMEOUT':
        return this.handleTimeoutError(error, query);

      case 'AUTHENTICATION':
        return this.handleAuthError(error, query);

      case 'NETWORK':
        return this.handleNetworkError(error, query);

      default:
        return this.handleGenericError(error, query);
    }
  }

  // 錯誤分類
  private classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();

    if (message.includes('rate limit') || message.includes('quota')) {
      return 'RATE_LIMIT';
    }

    if (message.includes('timeout') || message.includes('timed out')) {
      return 'TIMEOUT';
    }

    if (message.includes('unauthorized') || message.includes('invalid key')) {
      return 'AUTHENTICATION';
    }

    if (message.includes('network') || message.includes('connection')) {
      return 'NETWORK';
    }

    return 'GENERIC';
  }

  // 處理速率限制錯誤
  private async handleRateLimitError(
    error: Error,
    query: string
  ): Promise<ErrorResponse> {
    // 實現指數退避重試
    const retryDelay = this.calculateRetryDelay();

    return {
      error: 'RATE_LIMIT_EXCEEDED',
      message: '查詢頻率過高，請稍後再試',
      retryAfter: retryDelay,
      suggestion: '建議減少查詢頻率或升級服務計劃',
    };
  }

  // 計算重試延遲
  private calculateRetryDelay(): number {
    const { baseDelay, maxDelay, backoffMultiplier } = this.retryConfig;
    return Math.min(baseDelay * backoffMultiplier, maxDelay);
  }
}
```

## 10. 測試和驗證

### 10.1 單元測試

```typescript
// RAG 系統測試
describe('RAG System', () => {
  let ragSystem: RAGSystem;
  let mockGeminiService: jest.Mocked<GeminiService>;
  let mockVectorStore: jest.Mocked<VectorStore>;

  beforeEach(() => {
    mockGeminiService = createMockGeminiService();
    mockVectorStore = createMockVectorStore();

    ragSystem = new RAGSystem(mockGeminiService, mockVectorStore);
  });

  describe('query', () => {
    it('should return relevant results for stock screening query', async () => {
      // Arrange
      const query = '找出與AI概念相關的股票';
      const mockResults = [
        { id: '1', content: '台積電是AI芯片製造龍頭', score: 0.95 },
        { id: '2', content: '聯發科在AI領域有重要佈局', score: 0.88 },
      ];

      mockVectorStore.searchSimilar.mockResolvedValue(mockResults);
      mockGeminiService.generateResponse.mockResolvedValue({
        text: '根據檢索結果，推薦以下AI概念股...',
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
          totalTokenCount: 150,
        },
        safetyRatings: [],
      });

      // Act
      const result = await ragSystem.query(query);

      // Assert
      expect(result.answer).toContain('AI概念股');
      expect(result.sources).toHaveLength(2);
      expect(mockVectorStore.searchSimilar).toHaveBeenCalledWith(
        expect.any(Array),
        10
      );
    });

    it('should handle empty search results gracefully', async () => {
      // Arrange
      const query = '找出與不存在的概念相關的股票';
      mockVectorStore.searchSimilar.mockResolvedValue([]);

      // Act
      const result = await ragSystem.query(query);

      // Assert
      expect(result.answer).toContain('未找到相關信息');
      expect(result.sources).toHaveLength(0);
    });

    it('should respect max token limit', async () => {
      // Arrange
      const query = '詳細分析AI概念股發展前景';
      const largeResults = Array.from({ length: 50 }, (_, i) => ({
        id: `result-${i}`,
        content: '這是一個很長的內容...'.repeat(100),
        score: 0.9 - i * 0.01,
      }));

      mockVectorStore.searchSimilar.mockResolvedValue(largeResults);

      // Act
      const result = await ragSystem.query(query);

      // Assert
      expect(result.context.length).toBeLessThan(4000);
      expect(result.totalTokens).toBeLessThan(4000);
    });
  });

  describe('performance', () => {
    it('should respond within acceptable time limit', async () => {
      // Arrange
      const query = '篩選新能源概念股';
      const startTime = Date.now();

      // Act
      await ragSystem.query(query);
      const endTime = Date.now();

      // Assert
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // 5秒內
    });
  });
});
```

### 10.2 整合測試

```typescript
// 整合測試
describe('RAG System Integration', () => {
  let testServer: TestServer;
  let testClient: TestClient;

  beforeAll(async () => {
    testServer = new TestServer();
    await testServer.start();

    testClient = new TestClient(testServer.url);
  });

  afterAll(async () => {
    await testServer.stop();
  });

  it('should handle end-to-end query flow', async () => {
    // 1. 提交查詢
    const queryResponse = await testClient.submitQuery({
      query: '分析半導體概念股投資機會',
      userId: 'test-user-123',
    });

    expect(queryResponse.status).toBe(200);
    expect(queryResponse.data.queryId).toBeDefined();

    // 2. 等待處理完成
    const queryId = queryResponse.data.queryId;
    let result = null;

    for (let i = 0; i < 10; i++) {
      const statusResponse = await testClient.getQueryStatus(queryId);

      if (statusResponse.data.status === 'COMPLETED') {
        result = statusResponse.data.result;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. 驗證結果
    expect(result).toBeDefined();
    expect(result.answer).toContain('半導體');
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.metadata.responseTime).toBeLessThan(5000);
  });

  it('should handle concurrent queries', async () => {
    const queries = [
      '篩選AI概念股',
      '分析新能源趨勢',
      '評估醫療概念股',
      '預測科技股走勢',
    ];

    const promises = queries.map(query =>
      testClient.submitQuery({ query, userId: 'test-user-123' })
    );

    const results = await Promise.all(promises);

    results.forEach(result => {
      expect(result.status).toBe(200);
      expect(result.data.queryId).toBeDefined();
    });
  });
});
```

## 11. 部署和配置

### 11.1 環境配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  rag-api:
    build: ./apps/api
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_ENVIRONMENT=${PINECONE_ENVIRONMENT}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
      - vector-db

  rag-worker:
    build: ./apps/data-pipeline
    environment:
      - PYTHONPATH=/app
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    volumes:
      - ./data:/app/data
    depends_on:
      - vector-db

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data

  vector-db:
    image: pinecone/pinecone-server:latest
    ports:
      - '8000:8000'
    environment:
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - PINECONE_ENVIRONMENT=${PINECONE_ENVIRONMENT}

volumes:
  redis-data:
```

### 11.2 性能配置

```typescript
// 性能配置
interface PerformanceConfig {
  // 向量檢索配置
  vectorSearch: {
    maxResults: number; // 最大檢索結果數
    similarityThreshold: number; // 相似度閾值
    maxTokens: number; // 最大 token 數
  };

  // 快取配置
  cache: {
    memoryTTL: number; // 記憶體快取 TTL
    redisTTL: number; // Redis 快取 TTL
    cdnTTL: number; // CDN 快取 TTL
  };

  // 並發配置
  concurrency: {
    maxConcurrentQueries: number; // 最大並發查詢數
    maxConcurrentEmbeddings: number; // 最大並發向量化數
    queryTimeout: number; // 查詢超時時間
  };

  // 監控配置
  monitoring: {
    metricsInterval: number; // 指標收集間隔
    alertThresholds: {
      // 警報閾值
      responseTime: number;
      errorRate: number;
      cacheHitRate: number;
    };
  };
}

// 預設配置
const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  vectorSearch: {
    maxResults: 20,
    similarityThreshold: 0.7,
    maxTokens: 4000,
  },
  cache: {
    memoryTTL: 300000, // 5分鐘
    redisTTL: 3600000, // 1小時
    cdnTTL: 86400000, // 24小時
  },
  concurrency: {
    maxConcurrentQueries: 100,
    maxConcurrentEmbeddings: 50,
    queryTimeout: 30000, // 30秒
  },
  monitoring: {
    metricsInterval: 60000, // 1分鐘
    alertThresholds: {
      responseTime: 5000, // 5秒
      errorRate: 0.05, // 5%
      cacheHitRate: 0.8, // 80%
    },
  },
};
```

## 12. 成功標準和 KPI

### 12.1 性能指標

- **響應時間**：平均 < 2秒，P95 < 5秒
- **準確率**：檢索相關性 > 85%
- **召回率**：相關文檔檢索率 > 90%
- **快取命中率**：> 80%

### 12.2 品質指標

- **答案相關性**：用戶滿意度 > 90%
- **事實準確性**：基於真實數據 > 95%
- **覆蓋範圍**：支持查詢類型 > 95%

### 12.3 可靠性指標

- **系統可用性**：> 99.9%
- **錯誤率**：< 1%
- **數據新鮮度**：< 24小時

## 13. 文檔整合說明

### 13.1 與第一部分整合

本文檔是 RAG 系統整合完整文檔的第二部分，與第一部分共同構成完整的 RAG 系統設計文檔。

### 13.2 主要內容對應

- **第一部分**：設計原則、系統架構、Gemini 整合、數據處理、檢索策略
- **第二部分**：混合檢索、快取優化、監控測試、部署配置、成功標準

### 13.3 使用建議

1. 先閱讀第一部分了解整體架構
2. 再閱讀第二部分了解實現細節
3. 兩部分結合使用進行完整開發
