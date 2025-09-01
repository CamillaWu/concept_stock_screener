// 基礎 API Hook
export { useApi, type ApiState, type ApiOptions, type ApiError, cacheManager, errorHandler } from './useApi';

// 股票數據 Hook
export {
  useTrendingThemes,
  useThemeSearch,
  useStockSearch,
  useStockPrice,
  useMarketOverview,
  useStocks,
  useRagStatus,
  useRagThemes,
  useRagStockSearch,
  useRagThemeSearch,
  useVectorSearch,
  useAiInvestmentAdvice,
  useAiRiskAssessment,
  useAiMarketTrend,
  useAiConceptStrength,
  useAiSentiment,
  useAiStockAttribution,
  type StockDataOptions
} from './useStockData';

// RAG 搜尋 Hook
export {
  useRagSearch,
  useRagSmartSearch,
  useRagThemeSearch as useRagThemeSearchFromRag,
  useRagStockSearch as useRagStockSearchFromRag,
  useRagHybridSearch,
  useRagRelatedSearch,
  useRagSemanticSearch,
  useRagSearchSuggestions,
  useRagSearchHistory,
  useRagSearchStats,
  useCustomRagSearch,
  type RagSearchOptions,
  type RagSearchResult
} from './useRagSearch';

// 快取管理 Hook
export {
  useCache,
  useCacheMonitor,
  useCacheStrategy,
  useCacheOptimization,
  type CacheStats,
  type CacheItemInfo
} from './useCache';
