import type { StockConcept, Stock, StockAnalysisResult, ApiResponse, SearchMode } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev';

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

  // 搜尋概念
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
    return await this.request<StockAnalysisResult>(`/search?mode=stock&q=${encodeURIComponent(symbol)}`);
  }

  // 新增：概念強度分析
  async getConceptStrength(theme: string): Promise<{
    strengthScore: number;
    dimensions: {
      marketCapRatio: number;
      priceContribution: number;
      discussionLevel: number;
    };
  }> {
    return await this.request(`/concept-strength?theme=${encodeURIComponent(theme)}`);
  }

  // 新增：情緒分析
  async getSentiment(theme: string): Promise<{
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  }> {
    return await this.request(`/sentiment?theme=${encodeURIComponent(theme)}`);
  }

  // 新增：個股歸因分析
  async getStockAttribution(stockId: string, theme: string): Promise<{
    sources: Array<{
      type: 'news' | 'report' | 'announcement' | 'ai';
      title: string;
      url?: string;
      timestamp: string;
      summary: string;
    }>;
  }> {
    return await this.request(`/stock-attribution?stockId=${encodeURIComponent(stockId)}&theme=${encodeURIComponent(theme)}`);
  }

  // 新增：綜合主題分析
  async getThemeAnalysis(theme: string): Promise<{
    theme: string;
    strength: {
      strengthScore: number;
      dimensions: {
        marketCapRatio: number;
        priceContribution: number;
        discussionLevel: number;
      };
    };
    sentiment: {
      score: number;
      trend: 'up' | 'down' | 'stable';
      sources: {
        news: number;
        social: number;
      };
      recentTrend: number[];
    };
    timestamp: string;
  }> {
    return await this.request(`/theme-analysis?theme=${encodeURIComponent(theme)}`);
  }

  // 通用搜尋方法
  async search(query: string, mode: SearchMode): Promise<StockConcept | StockAnalysisResult> {
    if (mode === 'theme') {
      return await this.searchThemes(query);
    } else {
      return await this.searchStocks(query);
    }
  }
}

export const apiService = new ApiService();
