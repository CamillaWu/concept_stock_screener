// 代表單一股票的結構
export interface Stock {
  ticker: string;       // 股票代碼, e.g., "2330"
  symbol: string;       // 股票代碼 (與 ticker 相同)
  name: string;         // 股票名稱, e.g., "台積電"
  exchange: 'TWSE' | 'TPEx'; // 交易所：上市(TWSE)或上櫃(TPEx)
  reason?: string;      // AI 分析的入選理由
  heatScore?: number;   // 市場熱度分數 (0-100)
  concepts?: string[];  // 相關概念標籤
}

// 代表一個概念主題及其關聯股票的結構 (用於「主題到個股」搜尋)
export interface StockConcept {
  id: string;           // 由 uuid 生成的唯一識別碼
  theme: string;        // 主題名稱, e.g., "AI 伺服器"
  name: string;         // 主題名稱 (與 theme 相同)
  description?: string; // 主題的詳細說明
  heatScore: number;    // 市場熱度分數 (0-100)
  stocks: Stock[];      // 該主題下的相關股票陣列
}

// 代表單一股票反向分析結果的結構 (用於「個股到主題」搜尋)
export interface StockAnalysisResult {
  stock: { 
    ticker: string;
    name: string;
  };
  themes: ThemeForStock[]; // 該股票所屬的主題陣列
  summary?: string;        // AI 分析摘要
}

// 代表在個股分析中，單一主題的結構
export interface ThemeForStock {
  theme: string;        // 主題名稱
  name: string;         // 主題名稱 (與 theme 相同)
  description?: string; // 該股在此主題中的角色與重要性說明
  heatScore: number;    // 市場熱度分數 (0-100)
  relevanceScore: number; // 相關性分數 (0-100)
}

// API 回應類型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  trace_id?: string;
}

// 搜尋模式
export type SearchMode = 'theme' | 'stock';

// 排序選項
export type SortOption = 'popular' | 'latest' | 'heat' | 'strength' | 'sentiment';

// 篩選選項
export interface FilterOptions {
  favorites?: boolean;
  anomalies?: boolean;
  sentimentPositive?: boolean;
  sentimentNegative?: boolean;
}
