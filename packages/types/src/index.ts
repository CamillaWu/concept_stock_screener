// 個股基本資訊
export interface Stock {
  ticker: string;          // 股票代號，例：2330
  name: string;            // 股票名稱，例：台積電
  exchange?: string;       // 交易所，例：TWSE
  reason?: string;         // 入選理由（對應主題）
}

// 主題基本資訊
export interface Theme {
  name: string;            // 主題名稱
  description?: string;    // 主題描述
}

// 主題（含關聯個股）
export interface StockConcept {
  id: string;              // 唯一識別
  theme: string;           // 主題名稱
  description?: string;    // 主題描述
  heatScore: number;       // 熱度評分 0–100（整數）
  stocks: Stock[];         // 關聯個股清單（最多 10 檔）
}

// 個股 → 主題的對應
export interface ThemeForStock {
  theme: string;           // 主題名稱
  description?: string;    // 主題描述
  heatScore: number;       // 熱度評分 0–100（整數）
}

// 個股分析結果（供右欄使用）
export interface StockAnalysisResult {
  stock: { 
    ticker: string; 
    name: string; 
  };
  themes: ThemeForStock[]; // 至少 5 筆（若不足呈現空狀態）
}

// API 回應格式
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 搜尋模式
export type SearchMode = 'theme' | 'stock';

// 搜尋請求
export interface SearchRequest {
  query: string;
  mode: SearchMode;
}

// 搜尋結果
export interface SearchResult {
  mode: SearchMode;
  query: string;
  result: StockConcept | StockAnalysisResult;
  timestamp: number;
}

// 熱門主題列表
export interface TrendingThemes {
  themes: StockConcept[];
  lastUpdated: string;
}

// 收藏主題
export interface FavoriteTheme {
  id: string;
  theme: string;
  addedAt: number;
}

// 快取設定
export interface CacheConfig {
  ttl: number;             // 快取時間（秒）
  key: string;             // 快取鍵值
}
