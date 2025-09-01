# API 文檔

## 概述

概念股自動化篩選系統 API 提供股票概念分析、趨勢主題搜尋和 RAG 資料存取功能。

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

獲取當前熱門的股票概念主題。

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
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
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
        "code": "2330",
        "name": "台積電",
        "price": 580,
        "change": 5,
        "changePercent": 0.87,
        "volume": 12345678,
        "marketCap": 1500000000000
      }
    ]
  }
]
```

#### 錯誤回應
```json
{
  "success": false,
  "error": "Failed to fetch trending themes",
  "code": "internal_error"
}
```

---

### 3. 搜尋

**GET** `/search`

搜尋股票概念或股票分析。

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

#### 回應範例

**主題搜尋**:
```json
{
  "id": "ai-2024",
  "theme": "AI",
  "name": "人工智慧概念股",
  "description": "與人工智慧技術相關的股票概念",
  "heatScore": 85,
  "stocks": [
    {
      "code": "2330",
      "name": "台積電",
      "price": 580,
      "change": 5,
      "changePercent": 0.87,
      "volume": 12345678,
      "marketCap": 1500000000000
    }
  ]
}
```

**股票搜尋**:
```json
{
  "stockCode": "2330",
  "stockName": "台積電",
  "currentPrice": 580,
  "change": 5,
  "changePercent": 0.87,
  "concepts": [
    {
      "theme": "AI",
      "relevance": 0.9,
      "description": "AI 晶片製造龍頭",
      "relatedStocks": ["2330", "2454", "3034"]
    }
  ],
  "analysis": "台積電是全球最大的晶圓代工廠...",
  "riskLevel": "low",
  "recommendation": "buy"
}
```

#### 錯誤回應
```json
{
  "success": false,
  "error": "Missing required parameters",
  "code": "invalid_mode"
}
```

---

### 4. RAG 資料存取

#### 4.1 獲取 RAG Manifest

**GET** `/rag/manifest.json`

獲取 RAG 系統的 manifest 檔案。

#### 回應格式
```typescript
interface RAGManifest {
  version: string;
  lastUpdated: string;
  documents: {
    total: number;
    types: string[];
  };
  themes: {
    total: number;
    categories: string[];
  };
}
```

#### 回應範例
```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T10:30:00.000Z",
  "documents": {
    "total": 1000,
    "types": ["news", "report", "analysis"]
  },
  "themes": {
    "total": 50,
    "categories": ["AI", "新能源", "半導體"]
  }
}
```

---

#### 4.2 獲取 RAG 文件

**GET** `/rag/docs.jsonl`

獲取 RAG 系統的文件資料（JSONL 格式）。

#### 回應格式
每行一個 JSON 物件：
```json
{"id": "doc1", "content": "文件內容...", "type": "news", "date": "2024-01-15"}
{"id": "doc2", "content": "文件內容...", "type": "report", "date": "2024-01-15"}
```

---

#### 4.3 RAG 狀態檢查

**GET** `/rag/status`

檢查 RAG 系統狀態。

#### 回應格式
```typescript
interface RAGStatus {
  status: 'ready' | 'loading' | 'error';
  lastUpdate: string;
  documentCount: number;
  cacheStatus: {
    manifest: boolean;
    documents: boolean;
  };
}
```

#### 回應範例
```json
{
  "status": "ready",
  "lastUpdate": "2024-01-15T10:30:00.000Z",
  "documentCount": 1000,
  "cacheStatus": {
    "manifest": true,
    "documents": true
  }
}
```

---

## 快取機制

### 快取策略
- **趨勢主題**: 5分鐘快取
- **搜尋結果**: 10分鐘快取
- **RAG 資料**: 5分鐘快取

### 快取鍵格式
- `trending:{sort}:{real}`
- `search:{mode}:{query}:{real}`
- `rag:manifest`
- `rag:documents`

---

## 錯誤處理

### HTTP 狀態碼
- `200`: 成功
- `400`: 請求參數錯誤
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
| `internal_error` | 伺服器內部錯誤 |
| `rag_error` | RAG 系統錯誤 |

---

## 效能優化

### 已實現的優化
1. **多層快取**: RAG、API、前端快取
2. **並行處理**: RAG 文件並行載入
3. **請求超時**: 前端請求 10 秒超時
4. **錯誤處理**: 完善的錯誤處理和回退機制

### 效能指標
- **RAG 載入速度**: 平均 27ms
- **API 回應時間**: 平均 8.67ms
- **快取效能改善**: 7.1%

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
API_BASE_URL=http://localhost:8787
```

### 測試
```bash
# 測試開發環境
node scripts/test-dev-environment.js

# 測試生產環境
node scripts/test-production-api.js

# 效能測試
node scripts/performance-test.js
```
