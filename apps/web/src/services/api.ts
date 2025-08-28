import type { StockConcept, Stock, StockAnalysisResult, ApiResponse, SearchMode } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://concept-stock-screener-api.sandy246836.workers.dev';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
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
  async getTrendingThemes(): Promise<StockConcept[]> {
    try {
      const url = `${API_BASE}/trending`;
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
  async searchStocks(query: string): Promise<Stock[]> {
    const response = await this.request<Stock[]>(`/search?mode=stock&q=${encodeURIComponent(query)}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || '搜尋股票失敗');
  }

  // 獲取股票分析
  async getStockAnalysis(symbol: string): Promise<StockAnalysisResult> {
    const response = await this.request<StockAnalysisResult>(`/stock/${symbol}/analysis`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || '獲取股票分析失敗');
  }

  // 通用搜尋方法
  async search(query: string, mode: SearchMode): Promise<StockConcept | Stock[]> {
    if (mode === 'theme') {
      return await this.searchThemes(query);
    } else {
      return await this.searchStocks(query);
    }
  }
}

export const apiService = new ApiService();
