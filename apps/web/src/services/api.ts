import type { StockConcept, StockAnalysisResult, Stock } from '@concepts-radar/types';

interface StockPriceData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

interface MarketData {
  totalStocks: number;
  upStocks: number;
  downStocks: number;
  unchangedStocks: number;
  totalVolume: number;
  timestamp: string;
}

interface AttributionSource {
  type: 'news' | 'report' | 'announcement' | 'ai';
  title: string;
  url?: string;
  timestamp: string;
  summary: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://concept-stock-screener-api.camilla-wu.workers.dev'
  : 'http://localhost:8787';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

  async getStockAttribution(stockId: string, theme: string): Promise<AttributionSource[]> {
    return this.request<AttributionSource[]>(`/stock-attribution?stockId=${stockId}&theme=${encodeURIComponent(theme)}`);
  }

  async getThemeAnalysis(theme: string): Promise<{
    analysis: string;
    recommendations: string[];
    risks: string[];
  }> {
    return this.request<{
      analysis: string;
      recommendations: string[];
      risks: string[];
    }>(`/theme-analysis?theme=${encodeURIComponent(theme)}`);
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
