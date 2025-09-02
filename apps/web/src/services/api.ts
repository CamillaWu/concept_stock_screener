import type { 
  StockConcept, 
  StockAnalysisResult, 
  Stock, 
  StockPriceData, 
  MarketData
} from '@concepts-radar/types';

interface AttributionSource {
  type: 'news' | 'report' | 'announcement' | 'ai';
  title: string;
  url?: string;
  timestamp: string;
  summary: string;
}

// 統一 API 端點配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev')
  : (process.env.NEXT_PUBLIC_API_BASE_URL_DEV || 'http://localhost:8787');

// 前端快取機制
class FrontendCache {
  private static instance: FrontendCache;
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  static getInstance(): FrontendCache {
    if (!FrontendCache.instance) {
      FrontendCache.instance = new FrontendCache();
    }
    return FrontendCache.instance;
  }

  set(key: string, data: unknown, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = (Date.now() - cached.timestamp) > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

class ApiService {
  private cache = FrontendCache.getInstance();
  private requestTimeout = 10000; // 10秒超時

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 檢查快取
    const cacheKey = `${endpoint}_${JSON.stringify(options || {})}`;
    const cached = this.cache.get(cacheKey) as T | null;
    if (cached) {
      console.log('Using cached API response:', endpoint);
      return cached;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as T;
      
      // 快取成功的回應
      this.cache.set(cacheKey, data, 2 * 60 * 1000); // 2分鐘快取
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.requestTimeout}ms`);
      }
      
      throw error;
    }
  }

  async getTrendingThemes(sortBy: 'popular' | 'latest' = 'popular', useRealData: boolean = false): Promise<StockConcept[]> {
    return this.request<StockConcept[]>(`/trending?sort=${sortBy}&real=${useRealData}`);
  }

  async searchThemes(query: string, useRealData: boolean = false): Promise<StockConcept> {
    return this.request<StockConcept>(`/search?mode=theme&q=${encodeURIComponent(query)}&real=${useRealData}`);
  }

  async searchStocks(query: string, useRealData: boolean = false): Promise<StockAnalysisResult> {
    return this.request<StockAnalysisResult>(`/search?mode=stock&q=${encodeURIComponent(query)}&real=${useRealData}`);
  }

  async getStockPrice(ticker: string): Promise<StockPriceData> {
    return this.request<StockPriceData>(`/stock-price/${ticker}`);
  }

  async getMarketOverview(): Promise<MarketData> {
    return this.request<MarketData>('/market-overview');
  }

  async getStocks(industry?: string): Promise<Stock[]> {
    const endpoint = industry ? `/stocks?industry=${encodeURIComponent(industry)}` : '/stocks';
    return this.request<Stock[]>(endpoint);
  }

  async getConceptStrength(theme: string): Promise<{
    strengthScore: number;
    dimensions: {
      marketCapRatio: number;
      priceContribution: number;
      discussionLevel: number;
    };
  }> {
    return this.request<{
      strengthScore: number;
      dimensions: {
        marketCapRatio: number;
        priceContribution: number;
        discussionLevel: number;
      };
    }>(`/concept-strength?theme=${encodeURIComponent(theme)}`);
  }

  async getSentiment(theme: string): Promise<{
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  }> {
    return this.request<{
      score: number;
      trend: 'up' | 'down' | 'stable';
      sources: {
        news: number;
        social: number;
      };
      recentTrend: number[];
    }>(`/sentiment?theme=${encodeURIComponent(theme)}`);
  }

  async getAnomalies(theme?: string): Promise<{
    type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
    value: number;
    threshold: number;
    timestamp: string;
    description: string;
    affectedStocks: string[];
  }[]> {
    const endpoint = theme ? `/anomalies?theme=${encodeURIComponent(theme)}` : '/anomalies';
    return this.request<{
      type: 'price_up' | 'price_down' | 'volume_up' | 'volume_down';
      value: number;
      threshold: number;
      timestamp: string;
      description: string;
      affectedStocks: string[];
    }[]>(endpoint);
  }

  async getAttributionSources(stockId: string, theme?: string): Promise<AttributionSource[]> {
    const endpoint = theme 
      ? `/attribution?stock=${stockId}&theme=${encodeURIComponent(theme)}`
      : `/attribution?stock=${stockId}`;
    return this.request<AttributionSource[]>(endpoint);
  }

  // RAG 相關 API
  async getRAGManifest(): Promise<unknown> {
    return this.request<unknown>('/rag/manifest.json');
  }

  async getRAGDocs(): Promise<unknown[]> {
    return this.request<unknown[]>('/rag/docs.jsonl');
  }

  async getRAGStatus(): Promise<unknown> {
    return this.request<unknown>('/rag/status');
  }

  async vectorizeQuery(query: string): Promise<unknown> {
    return this.request<unknown>('/rag/vectorize', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }

  async searchRAGThemes(query: string): Promise<unknown[]> {
    return this.request<unknown[]>(`/rag/themes?q=${encodeURIComponent(query)}`);
  }

  async getStocksByTheme(themeId: string): Promise<unknown[]> {
    return this.request<unknown[]>(`/rag/stocks-by-theme?theme=${encodeURIComponent(themeId)}`);
  }

  // 快取管理方法
  clearCache(): void {
    this.cache.clear();
    console.log('Frontend cache cleared');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return this.cache.getStats();
  }

  // 設定請求超時時間
  setTimeout(timeout: number): void {
    this.requestTimeout = timeout;
  }
}

export const apiService = new ApiService();

// RAG 相關 API
export const ragApi = {
  // 檢查 RAG 狀態
  async checkStatus() {
    const response = await fetch(`${API_BASE_URL}/rag/status`);
    if (!response.ok) {
      throw new Error('Failed to check RAG status');
    }
    return response.json();
  },

  // 向量化 RAG 資料
  async vectorize() {
    const response = await fetch(`${API_BASE_URL}/rag/vectorize`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to vectorize RAG data');
    }
    return response.json();
  },

  // 向量搜尋
  async search(query: string, options: {
    type?: 'theme_overview' | 'theme_to_stock';
    theme?: string;
    topK?: number;
  } = {}) {
    const params = new URLSearchParams({
      q: query,
      ...(options.type && { type: options.type }),
      ...(options.theme && { theme: options.theme }),
      ...(options.topK && { topK: options.topK.toString() }),
    });
    
    const response = await fetch(`${API_BASE_URL}/rag/search?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search RAG data');
    }
    return response.json();
  },

  // 搜尋主題相關股票
  async getStocksByTheme(theme: string, topK: number = 10) {
    const params = new URLSearchParams({
      theme,
      topK: topK.toString(),
    });
    
    const response = await fetch(`${API_BASE_URL}/rag/stocks-by-theme?${params}`);
    if (!response.ok) {
      throw new Error('Failed to get stocks by theme');
    }
    return response.json();
  },

  // 搜尋股票相關主題
  async getThemesByStock(stock: string, topK: number = 10) {
    const params = new URLSearchParams({
      stock,
      topK: topK.toString(),
    });
    
    const response = await fetch(`${API_BASE_URL}/rag/themes-by-stock?${params}`);
    if (!response.ok) {
      throw new Error('Failed to get themes by stock');
    }
    return response.json();
  },

  // 取得所有主題
  async getAllThemes() {
    const response = await fetch(`${API_BASE_URL}/rag/themes`);
    if (!response.ok) {
      throw new Error('Failed to get all themes');
    }
    return response.json();
  },

  // 清除向量資料
  async clearVectors() {
    const response = await fetch(`${API_BASE_URL}/rag/vectors`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to clear vectors');
    }
    return response.json();
  },
};
