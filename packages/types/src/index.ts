// 基礎型別定義
export type Exchange = 'TWSE' | 'TPEx';
export type SearchMode = 'theme' | 'stock';
export type SortOption = 'popular' | 'latest' | 'heat' | 'strength' | 'sentiment';
export type RiskLevel = 'low' | 'medium' | 'high';
export type Recommendation = 'buy' | 'hold' | 'sell';
export type Sentiment = 'positive' | 'negative' | 'neutral';

// 泛型約束的基礎介面
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseStock extends BaseEntity {
  ticker: string;
  symbol: string;
  name: string;
  exchange: Exchange;
}

// 代表單一股票的結構
export interface Stock extends BaseStock {
  reason?: string;      // AI 分析的入選理由
  heatScore?: number;   // 市場熱度分數 (0-100)
  concepts?: string[];  // 相關概念標籤
  currentPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
}

// 代表一個概念主題及其關聯股票的結構
export interface StockConcept extends BaseEntity {
  theme: string;        // 主題名稱, e.g., "AI 伺服器"
  name: string;         // 主題名稱 (與 theme 相同)
  description?: string; // 主題的詳細說明
  heatScore: number;    // 市場熱度分數 (0-100)
  stocks: Stock[];      // 該主題下的相關股票陣列
  tags?: string[];      // 主題標籤
  category?: string;    // 主題分類
}

// 代表在個股分析中，單一主題的結構
export interface ThemeForStock extends BaseEntity {
  theme: string;        // 主題名稱
  name: string;         // 主題名稱 (與 theme 相同)
  description?: string; // 該股在此主題中的角色與重要性說明
  heatScore: number;    // 市場熱度分數 (0-100)
  relevanceScore: number; // 相關性分數 (0-100)
  category?: string;    // 主題分類
}

// 代表單一股票反向分析結果的結構
export interface StockAnalysisResult extends BaseEntity {
  stock: Pick<Stock, 'ticker' | 'name'>;
  themes: ThemeForStock[]; // 該股票所屬的主題陣列
  summary?: string;        // AI 分析摘要
  riskLevel?: RiskLevel;
  recommendation?: Recommendation;
  sentiment?: Sentiment;
}

// 股票價格資料
export interface StockPriceData extends BaseStock {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  pb: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

// 市場概況資料
export interface MarketData {
  date: string;
  totalVolume: number;
  totalValue: number;
  upCount: number;
  downCount: number;
  unchangedCount: number;
  indexValue?: number;
  indexChange?: number;
  indexChangePercent?: number;
}

// 泛型 API 回應類型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  trace_id?: string;
  timestamp?: string;
}

// 分頁回應類型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 搜尋結果類型
export interface SearchResult<T> {
  query: string;
  results: T[];
  total: number;
  searchTime: number;
  suggestions?: string[];
}

// 篩選選項
export interface FilterOptions {
  favorites?: boolean;
  anomalies?: boolean;
  sentimentPositive?: boolean;
  sentimentNegative?: boolean;
  exchange?: Exchange;
  minHeatScore?: number;
  maxHeatScore?: number;
  categories?: string[];
}

// 排序選項
export interface SortOptions {
  field: keyof Stock | keyof StockConcept;
  direction: 'asc' | 'desc';
}

// 投資組合相關型別
export interface PortfolioItem {
  ticker: string;
  weight: number;
  shares?: number;
  cost?: number;
  currentValue?: number;
}

export interface PortfolioOptimizationRequest {
  portfolio: PortfolioItem[];
  riskTolerance: RiskLevel;
  targetReturn?: number;
  constraints?: {
    maxWeight?: number;
    minWeight?: number;
    maxSectorWeight?: number;
  };
}

// AI 分析相關型別
export interface AIAnalysisRequest {
  query: string;
  context?: string;
  maxLength?: number;
  includeSentiment?: boolean;
  includeRisk?: boolean;
}

export interface AIAnalysisResult {
  analysis: string;
  sentiment?: Sentiment;
  riskLevel?: RiskLevel;
  confidence: number;
  keywords: string[];
  summary: string;
}

// RAG 和向量搜尋相關型別
export interface VectorSearchResult {
  doc_id: string;
  score: number;
  metadata: {
    type: string;
    title: string;
    theme_name?: string;
    ticker?: string;
    stock_name?: string;
    tags: string[];
    category?: string;
  };
  content: string;
}

export interface RAGManifest {
  theme_overview: number;
  theme_to_stock: number;
  total: number;
  fields: string[];
  note: string;
  last_updated: string;
}

// 快取相關型別
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// 事件和日誌相關型別
export interface SystemEvent {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// 用戶偏好設定
export interface UserPreferences {
  defaultSort: SortOption;
  defaultSearchMode: SearchMode;
  favoriteThemes: string[];
  favoriteStocks: string[];
  uiTheme: 'light' | 'dark' | 'auto';
  notifications: {
    priceAlerts: boolean;
    themeUpdates: boolean;
    marketNews: boolean;
  };
}
