import { useCallback, useState } from 'react';
import { useApi, type ApiOptions } from './useApi';
import type { Stock } from '@concepts-radar/types';

// RAG 搜尋選項
export interface RagSearchOptions extends ApiOptions {
  maxResults?: number;
  minScore?: number;
  includeMetadata?: boolean;
}

// RAG 搜尋結果
export interface RagSearchResult {
  id: string;
  title: string;
  content: string;
  score: number;
  type: 'theme_overview' | 'theme_to_stock';
  metadata?: {
    theme_name?: string;
    ticker?: string;
    stock_name?: string;
    tags?: string[];
    source_urls?: string[];
    retrieved_at?: string;
  };
}

// 使用 RAG 搜尋 Hook
export function useRagSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, includeMetadata = true, ...apiOptions } = options;
  
  const url = `/rag/search?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}&includeMetadata=${includeMetadata}`;
  
  return useApi<{
    results: RagSearchResult[];
    total: number;
    query: string;
    searchTime: number;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 15 * 60 * 1000, // 15分鐘快取
    staleTime: 10 * 60 * 1000,  // 10分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 智能搜尋 Hook（結合 AI 分析）
export function useRagSmartSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, includeMetadata = true, ...apiOptions } = options;
  
  const url = `/ai/rag-analysis?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}&includeMetadata=${includeMetadata}`;
  
  return useApi<{
    results: RagSearchResult[];
    analysis: {
      summary: string;
      keyInsights: string[];
      recommendations: string[];
      confidence: number;
    };
    total: number;
    query: string;
    searchTime: number;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 30 * 60 * 1000, // 30分鐘快取
    staleTime: 15 * 60 * 1000,  // 15分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 主題搜尋 Hook
export function useRagThemeSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, ...apiOptions } = options;
  
  const url = `/rag/themes?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}`;
  
  return useApi<{
    themes: Array<{
      name: string;
      description: string;
      score: number;
      stockCount: number;
      heatScore: number;
    }>;
    total: number;
    query: string;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 股票搜尋 Hook
export function useRagStockSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, ...apiOptions } = options;
  
  const url = `/rag/stocks?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}`;
  
  return useApi<{
    stocks: Stock[];
    total: number;
    query: string;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 混合搜尋 Hook（同時搜尋主題和股票）
export function useRagHybridSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, ...apiOptions } = options;
  
  const url = `/rag/hybrid-search?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}`;
  
  return useApi<{
    themes: Array<{
      name: string;
      description: string;
      score: number;
      stockCount: number;
      heatScore: number;
    }>;
    stocks: Stock[];
    total: {
      themes: number;
      stocks: number;
    };
    query: string;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 10 * 60 * 1000, // 10分鐘快取
    staleTime: 5 * 60 * 1000,   // 5分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 相關性搜尋 Hook
export function useRagRelatedSearch(query: string, context: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, ...apiOptions } = options;
  
  const url = `/rag/related-search?query=${encodeURIComponent(query)}&context=${encodeURIComponent(context)}&maxResults=${maxResults}&minScore=${minScore}`;
  
  return useApi<{
    results: RagSearchResult[];
    relatedness: number;
    context: string;
    total: number;
  }>(url, {
    enabled: !!query.trim() && !!context.trim(),
    cacheTime: 15 * 60 * 1000, // 15分鐘快取
    staleTime: 10 * 60 * 1000,  // 10分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 語義搜尋 Hook
export function useRagSemanticSearch(query: string, options: RagSearchOptions = {}) {
  const { maxResults = 10, minScore = 0.5, ...apiOptions } = options;
  
  const url = `/rag/semantic-search?query=${encodeURIComponent(query)}&maxResults=${maxResults}&minScore=${minScore}`;
  
  return useApi<{
    results: RagSearchResult[];
    semanticScore: number;
    query: string;
    total: number;
  }>(url, {
    enabled: !!query.trim(),
    cacheTime: 15 * 60 * 1000, // 15分鐘快取
    staleTime: 10 * 60 * 1000,  // 10分鐘過期
    retryCount: 2,
    ...apiOptions
  });
}

// 使用 RAG 搜尋建議 Hook
export function useRagSearchSuggestions(query: string, options: ApiOptions = {}) {
  const url = `/rag/suggestions?query=${encodeURIComponent(query)}`;
  
  return useApi<{
    suggestions: Array<{
      text: string;
      type: 'theme' | 'stock' | 'concept';
      score: number;
    }>;
    query: string;
  }>(url, {
    enabled: !!query.trim() && query.length >= 2,
    cacheTime: 5 * 60 * 1000, // 5分鐘快取
    staleTime: 2 * 60 * 1000,  // 2分鐘過期
    retryCount: 1,
    ...options
  });
}

// 使用 RAG 搜尋歷史 Hook
export function useRagSearchHistory(options: ApiOptions = {}) {
  return useApi<{
    history: Array<{
      query: string;
      timestamp: string;
      resultCount: number;
      searchType: 'theme' | 'stock' | 'hybrid' | 'semantic';
    }>;
    total: number;
  }>('/rag/search-history', {
    cacheTime: 1 * 60 * 1000, // 1分鐘快取
    staleTime: 30 * 1000,      // 30秒過期
    retryCount: 1,
    ...options
  });
}

// 使用 RAG 搜尋統計 Hook
export function useRagSearchStats(options: ApiOptions = {}) {
  return useApi<{
    totalSearches: number;
    popularQueries: Array<{
      query: string;
      count: number;
    }>;
    searchTypes: {
      theme: number;
      stock: number;
      hybrid: number;
      semantic: number;
    };
    averageResponseTime: number;
  }>('/rag/search-stats', {
    cacheTime: 5 * 60 * 1000, // 5分鐘快取
    staleTime: 2 * 60 * 1000, // 2分鐘過期
    retryCount: 1,
    ...options
  });
}

// 自定義 RAG 搜尋 Hook（支援多種搜尋模式）
export function useCustomRagSearch(
  query: string,
  searchType: 'basic' | 'smart' | 'semantic' | 'hybrid' = 'basic',
  options: RagSearchOptions = {}
) {
  const [searchTypeState, setSearchTypeState] = useState(searchType);
  
  const basicSearch = useRagSearch(query, options);
  const smartSearch = useRagSmartSearch(query, options);
  const semanticSearch = useRagSemanticSearch(query, options);
  const hybridSearch = useRagHybridSearch(query, options);
  
  const getCurrentSearch = () => {
    switch (searchTypeState) {
      case 'smart':
        return smartSearch;
      case 'semantic':
        return semanticSearch;
      case 'hybrid':
        return hybridSearch;
      default:
        return basicSearch;
    }
  };
  
  const switchSearchType = useCallback((type: 'basic' | 'smart' | 'semantic' | 'hybrid') => {
    setSearchTypeState(type);
  }, []);
  
  return {
    ...getCurrentSearch(),
    searchType: searchTypeState,
    switchSearchType,
    allSearches: {
      basic: basicSearch,
      smart: smartSearch,
      semantic: semanticSearch,
      hybrid: hybridSearch
    }
  };
}
