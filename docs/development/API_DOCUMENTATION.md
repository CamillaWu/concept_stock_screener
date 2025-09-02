# API 文檔

## 概述

概念股自動化篩選系統 API 提供股票概念分析、趨勢主題搜尋、RAG 資料存取、向量搜尋和 AI 智能分析功能。系統整合了真實台股資料、AI 生成內容和向量化知識庫。

### 基礎資訊
- **基礎 URL**: `http://localhost:8787` (開發環境)
- **內容類型**: `application/json`
- **認證**: 目前無需認證
- **CORS**: 已啟用，支援所有來源

## 端點列表

### 1. 健康檢查

**GET** `/`

檢查 API 服務狀態。

#### 回應範例
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. 趨勢主題

**GET** `/trending`

獲取當前熱門的股票概念主題，支援真實台股資料和 AI 生成資料的混合模式。

#### 查詢參數
| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `sort` | string | 否 | `popular` | 排序方式：`popular` (熱門) 或 `latest` (最新) |
| `real` | boolean | 否 | `false` | 是否使用真實台股資料：`true` 或 `false` |

#### 回應格式
```typescript
interface StockConcept {
  id: string;
  theme: string;
  name: string;
  description: string;
  heatScore: number;
  stocks: Stock[];
}

interface Stock {
  ticker: string;
  symbol: string;
  name: string;
  exchange: 'TWSE' | 'TPEx';
  reason: string;
}
```

#### 回應範例
```json
[
  {
    "id": "ai-2024",
    "theme": "AI",
    "name": "人工智慧概念股",
    "description": "與人工智慧技術相關的股票概念",
    "heatScore": 85,
    "stocks": [
      {
        "ticker": "2330",
        "symbol": "2330",
        "name": "台積電",
        "exchange": "TWSE",
        "reason": "AI 晶片製造龍頭"
      }
    ]
  }
]
```

---

### 3. 搜尋

**GET** `/search`

搜尋股票概念或股票分析，支援真實資料和 AI 生成內容。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `mode` | string | 是 | 搜尋模式：`theme` (主題) 或 `stock` (股票) |
| `q` | string | 是 | 搜尋關鍵字 |
| `real` | boolean | 否 | 是否使用真實台股資料：`true` 或 `false` |

#### 回應格式

**主題搜尋模式** (`mode=theme`):
```typescript
interface StockConcept {
  id: string;
  theme: string;
  name: string;
  description: string;
  heatScore: number;
  stocks: Stock[];
}
```

**股票搜尋模式** (`mode=stock`):
```typescript
interface StockAnalysisResult {
  stockCode: string;
  stockName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  concepts: ThemeForStock[];
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'buy' | 'hold' | 'sell';
}

interface ThemeForStock {
  theme: string;
  relevance: number;
  description: string;
  relatedStocks: string[];
}
```

---

### 4. 股票即時資料

#### 4.1 股票即時價格

**GET** `/stock-price/:ticker`

獲取指定股票的即時價格資訊。

#### 路徑參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `ticker` | string | 是 | 股票代碼 |

#### 回應格式
```typescript
interface StockPriceData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  pb: number;
}
```

#### 4.2 市場概況

**GET** `/market-overview`

獲取台股市場整體概況。

#### 回應格式
```typescript
interface MarketData {
  date: string;
  totalVolume: number;
  totalValue: number;
  upCount: number;
  downCount: number;
  unchangedCount: number;
}
```

#### 4.3 股票列表

**GET** `/stocks`

獲取股票列表，支援按產業篩選。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `industry` | string | 否 | 產業類別篩選 |

---

### 5. AI 智能分析

#### 5.1 概念強度分析

**GET** `/ai/concept-strength`

分析特定概念主題的強度和影響力。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `theme` | string | 是 | 概念主題名稱 |

#### 5.2 情緒分析

**GET** `/ai/sentiment`

分析市場對特定概念主題的情緒傾向。

#### 5.3 個股歸因分析

**GET** `/ai/stock-attribution`

分析個股與特定概念主題的關聯性。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `stockId` | string | 是 | 股票代碼 |
| `theme` | string | 是 | 概念主題 |

#### 5.4 投資建議

**GET** `/ai/investment-advice`

生成基於 AI 的投資建議。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `stockId` | string | 是 | 股票代碼 |
| `theme` | string | 是 | 概念主題 |
| `marketContext` | string | 否 | 市場背景資訊 |

#### 5.5 風險評估

**GET** `/ai/risk-assessment`

評估特定股票在概念主題下的風險等級。

#### 5.6 市場趨勢預測

**GET** `/ai/market-trend`

預測特定概念主題的市場趨勢。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `theme` | string | 是 | 概念主題 |
| `timeframe` | string | 否 | 預測時間範圍：`short`、`medium`、`long` |

#### 5.7 投資組合優化

**POST** `/ai/portfolio-optimization`

提供投資組合優化建議。

#### 請求格式
```typescript
interface PortfolioOptimizationRequest {
  portfolio: Array<{
    ticker: string;
    weight: number;
  }>;
  riskTolerance: 'low' | 'medium' | 'high';
}
```

---

### 6. 向量搜尋與 RAG 系統

#### 6.1 向量搜尋

**GET** `/vector-search`

執行語義向量搜尋。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `q` | string | 是 | 搜尋查詢 |
| `topK` | number | 否 | 返回結果數量，預設 10 |
| `type` | string | 否 | 文件類型篩選 |
| `themeId` | string | 否 | 主題 ID 篩選 |
| `ticker` | string | 否 | 股票代碼篩選 |

#### 回應格式
```typescript
interface VectorSearchResult {
  doc_id: string;
  score: number;
  metadata: {
    type: string;
    title: string;
    theme_name: string;
    ticker?: string;
    stock_name?: string;
    tags: string[];
  };
  content: string;
}
```

#### 6.2 向量索引統計

**GET** `/vector-stats`

獲取向量資料庫統計資訊。

#### 6.3 載入向量資料

**POST** `/vector-load`

將 RAG 文件載入到向量資料庫。

#### 6.4 清空向量資料

**DELETE** `/vector-clear`

清空向量資料庫。

---

### 7. 智能搜尋

#### 7.1 智能搜尋

**GET** `/smart-search`

結合 RAG 和 AI 的智能搜尋功能。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `q` | string | 是 | 搜尋查詢 |
| `mode` | string | 否 | 搜尋模式：`theme`、`stock`、`general` |
| `ai` | boolean | 否 | 是否啟用 AI 分析，預設 `true` |

#### 7.2 RAG + AI 混合分析

**GET** `/ai/rag-analysis`

結合 RAG 資料和 AI 的深度分析。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `q` | string | 是 | 分析查詢 |
| `ai` | boolean | 否 | 是否啟用 AI，預設 `true` |
| `maxLength` | number | 否 | 最大上下文長度，預設 4000 |

#### 7.3 智能概念股搜尋

**GET** `/ai/smart-stock-search`

智能搜尋與概念主題相關的股票。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `q` | string | 否 | 搜尋查詢 |
| `theme` | string | 否 | 概念主題 |
| `ai` | boolean | 否 | 是否啟用 AI 分析 |

---

### 8. RAG 資料存取

#### 8.1 獲取 RAG Manifest

**GET** `/rag/manifest.json`

獲取 RAG 系統的 manifest 檔案。

#### 回應格式
```typescript
interface RAGManifest {
  theme_overview: number;
  theme_to_stock: number;
  total: number;
  fields: string[];
  note: string;
}
```

#### 8.2 獲取 RAG 文件

**GET** `/rag/docs.jsonl`

獲取 RAG 系統的文件資料（JSONL 格式）。

#### 8.3 RAG 狀態檢查

**GET** `/rag/status`

檢查 RAG 系統狀態。

#### 回應格式
```typescript
interface RAGStatus {
  success: boolean;
  data: {
    pineconeConfigured: boolean;
    indexName: string;
    pineconeEnvironment: string;
    apiKeySet: boolean;
    ragDataValid: boolean;
    ragStats: any;
    vectorServiceStatus: string;
    environment: string;
    timestamp: string;
  };
}
```

#### 8.4 主題相關股票搜尋

**GET** `/rag/stocks-by-theme`

搜尋與特定主題相關的股票。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `theme` | string | 是 | 主題名稱 |
| `topK` | number | 否 | 返回結果數量，預設 10 |

#### 8.5 股票相關主題搜尋

**GET** `/rag/themes-by-stock`

搜尋與特定股票相關的主題。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `stock` | string | 是 | 股票名稱 |
| `topK` | number | 否 | 返回結果數量，預設 10 |

#### 8.6 獲取所有主題

**GET** `/rag/themes`

獲取 RAG 系統中的所有主題。

#### 8.7 載入 RAG 資料

**POST** `/rag/load`

將 RAG 資料載入到向量資料庫。

#### 8.8 向量化 RAG 資料

**POST** `/rag/vectorize`

將 RAG 資料向量化（別名端點）。

#### 8.9 清除向量資料

**DELETE** `/rag/vectors`

清除 RAG 向量資料。

---

### 9. 主題分析

#### 9.1 概念強度分析

**GET** `/concept-strength`

分析概念主題的強度（舊版端點，建議使用 `/ai/concept-strength`）。

#### 9.2 情緒分析

**GET** `/sentiment`

分析概念主題的情緒（舊版端點，建議使用 `/ai/sentiment`）。

#### 9.3 個股歸因分析

**GET** `/stock-attribution`

分析個股歸因（舊版端點，建議使用 `/ai/stock-attribution`）。

#### 9.4 綜合主題分析

**GET** `/theme-analysis`

綜合主題分析（舊版端點，建議使用 `/ai/rag-analysis`）。

---

### 10. 主題股票搜尋

#### 10.1 主題相關股票

**GET** `/theme-stocks`

搜尋與主題相關的股票。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `theme` | string | 是 | 主題名稱 |
| `topK` | number | 否 | 返回結果數量，預設 10 |

#### 10.2 股票相關主題

**GET** `/stock-themes`

搜尋與股票相關的主題。

#### 查詢參數
| 參數 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `stock` | string | 是 | 股票名稱 |
| `topK` | number | 否 | 返回結果數量，預設 10 |

---

## 快取機制

### 快取策略
- **趨勢主題**: 5分鐘快取
- **搜尋結果**: 10分鐘快取
- **股票價格**: 1分鐘快取
- **市場概況**: 5分鐘快取
- **股票列表**: 30分鐘快取
- **AI 分析**: 15分鐘 - 4小時快取（根據功能類型）
- **RAG 資料**: 5分鐘快取
- **向量搜尋**: 10分鐘快取

### 快取鍵格式
- `trending:{sort}:{real}`
- `search:{mode}:{query}:{real}`
- `stock-price:{ticker}`
- `market-overview`
- `stocks:{industry}`
- `ai:{function}:{params}`
- `vector-search:{query}:{options}`
- `rag:{function}:{params}`

---

## 錯誤處理

### HTTP 狀態碼
- `200`: 成功
- `400`: 請求參數錯誤
- `404`: 資源未找到
- `500`: 伺服器內部錯誤

### 錯誤回應格式
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}
```

### 錯誤代碼
| 代碼 | 說明 |
|------|------|
| `invalid_mode` | 無效的搜尋模式 |
| `missing_params` | 缺少必要參數 |
| `invalid_ticker` | 無效的股票代碼 |
| `invalid_theme` | 無效的主題參數 |
| `invalid_query` | 無效的查詢參數 |
| `invalid_portfolio` | 無效的投資組合格式 |
| `invalid_weights` | 投資組合權重總和不為 1 |
| `no_results` | 沒有找到結果 |
| `no_documents` | 沒有找到文件 |
| `internal_error` | 伺服器內部錯誤 |
| `rag_error` | RAG 系統錯誤 |

---

## 效能優化

### 已實現的優化
1. **多層快取**: RAG、API、前端快取
2. **並行處理**: RAG 文件並行載入
3. **請求超時**: 前端請求 10 秒超時
4. **錯誤處理**: 完善的錯誤處理和回退機制
5. **智能快取**: 根據功能類型設定不同的快取時間
6. **向量化搜尋**: 支援語義搜尋和相似度匹配

### 效能指標
- **RAG 載入速度**: 平均 27ms
- **API 回應時間**: 平均 8.67ms
- **快取效能改善**: 7.1%
- **向量搜尋響應**: 平均 50-200ms

---

## 開發指南

### 本地開發
```bash
# 啟動 API 服務
cd apps/api && pnpm dev

# 測試 API
curl http://localhost:8787/
```

### 環境變數
```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
API_BASE_URL=http://localhost:8787
```

### 測試
```bash
# 測試開發環境
node scripts/test-dev-environment.js

# 測試生產環境
node scripts/test-production-api.js

# 測試向量搜尋
node scripts/test-vector-search.js

# 測試 RAG 載入
node scripts/test-rag-loading.js

# 效能測試
node scripts/performance-test.js
```

### 部署
```bash
# 部署到 Cloudflare Workers
cd apps/api && pnpm deploy

# 部署到 Vercel
cd apps/web && pnpm deploy
```

---

## 更新日誌

### v2.0.0 (2024-01-15)
- 新增 AI 智能分析功能
- 整合真實台股資料
- 新增向量搜尋和 RAG 系統
- 新增智能搜尋功能
- 優化快取機制
- 新增投資組合優化建議

### v1.0.0 (2024-01-01)
- 基礎股票概念搜尋
- 趨勢主題分析
- 基本 RAG 資料存取
