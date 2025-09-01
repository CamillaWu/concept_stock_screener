import { useApi, type ApiOptions } from './useApi';
import type { StockConcept, StockAnalysisResult, Stock } from '@concepts-radar/types';

// 股票數據 Hook 選項
export interface StockDataOptions extends ApiOptions {
  useRealData?: boolean;
  sortBy?: 'popular' | 'latest' | 'heat' | 'strength' | 'sentiment';
}

// 使用趨勢主題 Hook
export function useTrendingThemes(options: StockDataOptions = {}) {
  const { useRealData = false, sortBy = 'popular', ...apiOptions } = options;
  
  const url = `/trending?sort=${sortBy}&real=${useRealData}`;
  
  return useApi<StockConcept[]>(url, {
    cacheTime: 5 * 60 * 1000, // 5分鐘快取
    staleTime: 2 * 60 * 1000, // 2分鐘過期
    retryCount: 3,
    ...apiOptions
  });
}

// 使用主題搜尋 Hook
export function useThemeSearch(query: string, options: StockDataOptions = {}) {
  const { useRealData = false, ...apiOptions } = options;
  
  const url = `/search?mode=theme&q=${encodeURIComponent(query)}&real=${useRealData}`;
  
  return useApi<StockConcept>(url, {
    enabled: !!query.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用股票搜尋 Hook
export function useStockSearch(query: string, options: StockDataOptions = {}) {
  const { useRealData = false, ...apiOptions } = options;
  
  const url = `/search?mode=stock&q=${encodeURIComponent(query)}&real=${useRealData}`;
  
  return useApi<StockAnalysisResult>(url, {
    enabled: !!query.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用股票價格 Hook
export function useStockPrice(ticker: string, options: ApiOptions = {}) {
  const url = `/stock-price/${ticker}`;
  
  return useApi<{
    ticker: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  }>(url, {
    enabled: !!ticker,
    cacheTime: 1 * 60 * 1000, // 1分鐘快取
    staleTime: 30 * 1000,      // 30秒過期
    retryCount: 3,
    ...options
  });
}

// 使用市場概覽 Hook
export function useMarketOverview(options: ApiOptions = {}) {
  return useApi<{
    totalStocks: number;
    upStocks: number;
    downStocks: number;
    unchangedStocks: number;
    totalVolume: number;
    timestamp: string;
  }>('/market-overview', {
    cacheTime: 2 * 60 * 1000, // 2分鐘快取
    staleTime: 1 * 60 * 1000, // 1分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用股票列表 Hook
export function useStocks(industry?: string, options: ApiOptions = {}) {
  const url = industry ? `/stocks?industry=${encodeURIComponent(industry)}` : '/stocks';
  
  return useApi<Stock[]>(url, {
    cacheTime: 15 * 60 * 1000, // 15分鐘快取
    staleTime: 10 * 60 * 1000,  // 10分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 RAG 狀態 Hook
export function useRagStatus(options: ApiOptions = {}) {
  return useApi<{
    status: 'ready' | 'loading' | 'error';
    lastUpdate: string;
    documentCount: number;
    cacheStatus: {
      manifest: boolean;
      documents: boolean;
    };
  }>('/rag/status', {
    cacheTime: 1 * 60 * 1000, // 1分鐘快取
    staleTime: 30 * 1000,      // 30秒過期
    retryCount: 2,
    ...options
  });
}

// 使用 RAG 主題列表 Hook
export function useRagThemes(options: ApiOptions = {}) {
  return useApi<string[]>('/rag/themes', {
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 RAG 股票搜尋 Hook
export function useRagStockSearch(theme: string, options: ApiOptions = {}) {
  const url = `/rag/stocks-by-theme?theme=${encodeURIComponent(theme)}`;
  
  return useApi<Stock[]>(url, {
    enabled: !!theme.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 RAG 主題搜尋 Hook
export function useRagThemeSearch(stock: string, options: ApiOptions = {}) {
  const url = `/rag/themes-by-stock?stock=${encodeURIComponent(stock)}`;
  
  return useApi<string[]>(url, {
    enabled: !!stock.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用向量搜尋 Hook
export function useVectorSearch(query: string, options: ApiOptions = {}) {
  const url = `/vector-search?query=${encodeURIComponent(query)}`;
  
  return useApi<{
    results: Array<{
      id: string;
      title: string;
      content: string;
      score: number;
      type: string;
    }>;
    total: number;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 15 * 60 * 1000, // 15分鐘快取
    staleTime: 10 * 60 * 1000, // 10分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 投資建議 Hook
export function useAiInvestmentAdvice(stockCode: string, options: ApiOptions = {}) {
  const url = `/ai/investment-advice?stock=${encodeURIComponent(stockCode)}`;
  
  return useApi<{
    recommendation: 'buy' | 'hold' | 'sell';
    confidence: number;
    reasoning: string;
    riskFactors: string[];
    targetPrice?: number;
  }>(url, {
    enabled: !!stockCode.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 風險評估 Hook
export function useAiRiskAssessment(stockCode: string, options: ApiOptions = {}) {
  const url = `/ai/risk-assessment?stock=${encodeURIComponent(stockCode)}`;
  
  return useApi<{
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    riskFactors: Array<{
      factor: string;
      impact: 'low' | 'medium' | 'high';
      description: string;
    }>;
    mitigationStrategies: string[];
  }>(url, {
    enabled: !!stockCode.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 市場趨勢 Hook
export function useAiMarketTrend(theme: string, options: ApiOptions = {}) {
  const url = `/ai/market-trend?theme=${encodeURIComponent(theme)}`;
  
  return useApi<{
    trend: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    analysis: string;
    keyDrivers: string[];
    timeHorizon: string;
    potentialImpact: string;
  }>(url, {
    enabled: !!theme.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 概念強度分析 Hook
export function useAiConceptStrength(theme: string, options: ApiOptions = {}) {
  const url = `/ai/concept-strength?theme=${encodeURIComponent(theme)}`;
  
  return useApi<{
    strength: 'weak' | 'moderate' | 'strong';
    score: number;
    analysis: string;
    keyMetrics: Array<{
      metric: string;
      value: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    sustainability: string;
  }>(url, {
    enabled: !!theme.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 情緒分析 Hook
export function useAiSentiment(stockCode: string, options: ApiOptions = {}) {
  const url = `/ai/sentiment?stock=${encodeURIComponent(stockCode)}`;
  
  return useApi<{
    sentiment: 'positive' | 'negative' | 'neutral';
    score: number;
    analysis: string;
    sources: Array<{
      type: 'news' | 'social' | 'analyst';
      sentiment: 'positive' | 'negative' | 'neutral';
      weight: number;
    }>;
    trend: 'improving' | 'declining' | 'stable';
  }>(url, {
    enabled: !!stockCode.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}

// 使用 AI 個股歸因分析 Hook
export function useAiStockAttribution(stockCode: string, options: ApiOptions = {}) {
  const url = `/ai/stock-attribution?stock=${encodeURIComponent(stockCode)}`;
  
  return useApi<{
    attribution: Array<{
      factor: string;
      impact: number;
      description: string;
      confidence: number;
    }>;
    summary: string;
    keyDrivers: string[];
    riskFactors: string[];
  }>(url, {
    enabled: !!stockCode.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...options
  });
}
