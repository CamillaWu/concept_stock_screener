import type { StockConcept, StockAnalysisResult, SearchMode } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://concept-stock-screener-api.sandy246836.workers.dev' 
    : 'http://localhost:8787');

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const url = `${API_BASE}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 請求失敗:', error);
      throw error;
    }
  }

  // 獲取熱門概念
  async getTrendingThemes(sortBy: 'popular' | 'latest' = 'popular'): Promise<StockConcept[]> {
    try {
      const url = `${API_BASE}/trending?sort=${sortBy}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 請求失敗:', error);
      throw error;
    }
  }

  // 搜尋主題
  async searchThemes(query: string): Promise<StockConcept> {
    try {
      const url = `${API_BASE}/search?mode=theme&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 請求失敗:', error);
      throw error;
    }
  }

  // 搜尋股票
  async searchStocks(query: string): Promise<StockAnalysisResult> {
    try {
      const url = `${API_BASE}/search?mode=stock&q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API 請求失敗:', error);
      throw error;
    }
  }

  // 獲取股票分析
  async getStockAnalysis(symbol: string): Promise<StockAnalysisResult> {
    return this.searchStocks(symbol);
  }

  // 通用搜尋方法
  async search(query: string, mode: SearchMode): Promise<StockConcept | StockAnalysisResult> {
    if (mode === 'theme') {
      return this.searchThemes(query);
    } else {
      return this.searchStocks(query);
    }
  }

  // 獲取概念強度分析
  async getConceptStrength(theme: string): Promise<{
    strengthScore: number;
    dimensions: {
      marketCapRatio: number;
      priceContribution: number;
      discussionLevel: number;
    };
  }> {
    try {
      const url = `${API_BASE}/concept-strength?theme=${encodeURIComponent(theme)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('概念強度分析失敗:', error);
      throw error;
    }
  }

  // 獲取情緒分析
  async getSentiment(theme: string): Promise<{
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  }> {
    try {
      const url = `${API_BASE}/sentiment?theme=${encodeURIComponent(theme)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('情緒分析失敗:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();

// RAG 相關 API
export const ragApi = {
  // 檢查 RAG 狀態
  async checkStatus() {
    const response = await fetch(`${API_BASE}/rag/status`);
    if (!response.ok) {
      throw new Error('Failed to check RAG status');
    }
    return response.json();
  },

  // 向量化 RAG 資料
  async vectorize() {
    const response = await fetch(`${API_BASE}/rag/vectorize`, {
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
    
    const response = await fetch(`${API_BASE}/rag/search?${params}`);
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
    
    const response = await fetch(`${API_BASE}/rag/stocks-by-theme?${params}`);
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
    
    const response = await fetch(`${API_BASE}/rag/themes-by-stock?${params}`);
    if (!response.ok) {
      throw new Error('Failed to get themes by stock');
    }
    return response.json();
  },

  // 取得所有主題
  async getAllThemes() {
    const response = await fetch(`${API_BASE}/rag/themes`);
    if (!response.ok) {
      throw new Error('Failed to get all themes');
    }
    return response.json();
  },

  // 清除向量資料
  async clearVectors() {
    const response = await fetch(`${API_BASE}/rag/vectors`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to clear vectors');
    }
    return response.json();
  },
};
