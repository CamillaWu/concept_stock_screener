# API 文檔完整文檔

## 1. API 概述

### 1.1 基本信息

- **基礎 URL**：`https://api.concept-stock-screener.com`
- **API 版本**：v1
- **認證方式**：Bearer Token
- **數據格式**：JSON
- **字符編碼**：UTF-8

### 1.2 支持的 HTTP 方法

- `GET`：獲取資源
- `POST`：創建資源
- `PUT`：更新資源
- `DELETE`：刪除資源
- `PATCH`：部分更新資源

### 1.3 響應狀態碼

- `200`：成功
- `201`：創建成功
- `400`：請求錯誤
- `401`：未授權
- `403`：禁止訪問
- `404`：資源不存在
- `429`：請求過於頻繁
- `500`：服務器內部錯誤

## 2. 認證和授權

### 2.1 API 密鑰認證

```http
Authorization: Bearer YOUR_API_KEY
```

### 2.2 請求限制

- **基礎限制**：100 請求/小時
- **高級限制**：1000 請求/小時
- **企業限制**：10000 請求/小時

### 2.3 速率限制響應

```json
{
  "error": "rate_limit_exceeded",
  "message": "請求頻率過高，請稍後再試",
  "retry_after": 3600,
  "limit": 100,
  "remaining": 0
}
```

## 3. 股票相關 API

### 3.1 股票搜索

```http
GET /api/v1/stocks/search
```

#### 請求參數

| 參數        | 類型     | 必填 | 描述                                                   |
| ----------- | -------- | ---- | ------------------------------------------------------ |
| `q`         | string   | 是   | 搜索查詢（股票名稱、代碼或概念）                       |
| `page`      | integer  | 否   | 頁碼，默認 1                                           |
| `limit`     | integer  | 否   | 每頁數量，默認 20，最大 100                            |
| `sort`      | string   | 否   | 排序方式：`relevance`、`price`、`change`、`market_cap` |
| `order`     | string   | 否   | 排序順序：`asc`、`desc`，默認 `desc`                   |
| `concepts`  | string[] | 否   | 概念篩選，多個概念用逗號分隔                           |
| `min_price` | number   | 否   | 最低價格                                               |
| `max_price` | number   | 否   | 最高價格                                               |

#### 請求示例

```bash
curl -X GET "https://api.concept-stock-screener.com/api/v1/stocks/search?q=AI&page=1&limit=20&sort=relevance" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "id": "1",
        "name": "台積電",
        "code": "2330",
        "exchange": "TWSE",
        "price": 500.0,
        "change": 12.5,
        "change_percent": 2.5,
        "market_cap": 12960000000000,
        "volume": 25000000,
        "concepts": ["AI", "半導體", "芯片製造"],
        "concept_strength": 0.95,
        "last_updated": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    },
    "query": "AI",
    "search_time": 0.045
  }
}
```

### 3.2 股票詳情

```http
GET /api/v1/stocks/{stock_id}
```

#### 路徑參數

| 參數       | 類型   | 描述           |
| ---------- | ------ | -------------- |
| `stock_id` | string | 股票 ID 或代碼 |

#### 請求示例

```bash
curl -X GET "https://api.concept-stock-screener.com/api/v1/stocks/2330" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "台積電",
    "code": "2330",
    "exchange": "TWSE",
    "price": 500.0,
    "change": 12.5,
    "change_percent": 2.5,
    "market_cap": 12960000000000,
    "volume": 25000000,
    "pe_ratio": 25.5,
    "pb_ratio": 8.2,
    "dividend_yield": 2.1,
    "concepts": [
      {
        "name": "AI",
        "strength": 0.95,
        "description": "人工智能相關技術和應用",
        "impact_score": 0.88
      }
    ],
    "financials": {
      "revenue": 2500000000000,
      "profit": 850000000000,
      "assets": 4500000000000,
      "liabilities": 1200000000000
    },
    "analyst_ratings": {
      "buy": 25,
      "hold": 8,
      "sell": 2,
      "average_target": 580.0
    },
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

### 3.3 股票概念分析

```http
GET /api/v1/stocks/{stock_id}/concepts
```

#### 請求示例

```bash
curl -X GET "https://api.concept-stock-screener.com/api/v1/stocks/2330/concepts" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "stock_id": "2330",
    "stock_name": "台積電",
    "concepts": [
      {
        "name": "AI",
        "strength": 0.95,
        "description": "人工智能相關技術和應用",
        "impact_score": 0.88,
        "trend": "rising",
        "growth_potential": "high",
        "related_stocks": ["2454", "2379", "3034"],
        "market_sentiment": "positive",
        "last_updated": "2024-01-15T10:30:00Z"
      }
    ],
    "analysis": {
      "overall_score": 0.91,
      "risk_level": "low",
      "opportunity_level": "high",
      "recommendation": "strong_buy"
    }
  }
}
```

## 4. 概念相關 API

### 4.1 概念搜索

```http
GET /api/v1/concepts/search
```

#### 請求參數

| 參數       | 類型    | 必填 | 描述                                |
| ---------- | ------- | ---- | ----------------------------------- |
| `q`        | string  | 是   | 概念名稱或描述                      |
| `page`     | integer | 否   | 頁碼，默認 1                        |
| `limit`    | integer | 否   | 每頁數量，默認 20                   |
| `category` | string  | 否   | 概念分類                            |
| `trend`    | string  | 否   | 趨勢：`rising`、`falling`、`stable` |

#### 響應示例

```json
{
  "success": true,
  "data": {
    "concepts": [
      {
        "id": "1",
        "name": "AI",
        "description": "人工智能相關技術和應用",
        "category": "technology",
        "trend": "rising",
        "growth_potential": "high",
        "market_sentiment": "positive",
        "related_stocks_count": 45,
        "last_updated": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 120,
      "total_pages": 6
    }
  }
}
```

### 4.2 概念詳情

```http
GET /api/v1/concepts/{concept_id}
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "AI",
    "description": "人工智能相關技術和應用",
    "category": "technology",
    "trend": "rising",
    "growth_potential": "high",
    "market_sentiment": "positive",
    "definition": "人工智能是指機器模擬人類智能的技術...",
    "sub_concepts": ["機器學習", "深度學習", "自然語言處理"],
    "related_concepts": ["大數據", "雲計算", "物聯網"],
    "market_size": 500000000000,
    "growth_rate": 0.25,
    "key_players": ["台積電", "聯發科", "鴻海"],
    "investment_themes": ["自動化", "效率提升", "創新驅動"],
    "risks": ["技術風險", "監管風險", "競爭風險"],
    "opportunities": ["市場擴張", "技術突破", "政策支持"],
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 概念趨勢分析

```http
GET /api/v1/concepts/{concept_id}/trends
```

#### 請求參數

| 參數     | 類型   | 必填 | 描述                                                    |
| -------- | ------ | ---- | ------------------------------------------------------- |
| `period` | string | 否   | 時間週期：`1d`、`1w`、`1m`、`3m`、`6m`、`1y`，默認 `1m` |

#### 響應示例

```json
{
  "success": true,
  "data": {
    "concept_id": "1",
    "concept_name": "AI",
    "period": "1m",
    "trends": {
      "price_movement": [
        {
          "date": "2024-01-01",
          "value": 100.0,
          "change": 0.0
        }
      ],
      "volume_trend": [
        {
          "date": "2024-01-01",
          "value": 1000000,
          "change": 0.0
        }
      ],
      "sentiment_score": [
        {
          "date": "2024-01-01",
          "value": 0.75,
          "change": 0.0
        }
      ]
    },
    "analysis": {
      "trend_direction": "upward",
      "strength": "strong",
      "volatility": "medium",
      "prediction": "continued_growth"
    }
  }
}
```

## 5. 本地收藏 API

### 5.1 本地收藏管理

```http
POST /api/v1/favorites
```

#### 請求體

```json
{
  "stock_id": "2330",
  "notes": "AI 概念龍頭股"
}
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "id": "1",
    "stock_id": "2330",
    "stock_name": "台積電",
    "notes": "AI 概念龍頭股",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 5.2 獲取本地收藏

```http
GET /api/v1/favorites
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "id": "1",
        "stock_id": "2330",
        "stock_name": "台積電",
        "stock_code": "2330",
        "price": 500.0,
        "change_percent": 2.5,
        "notes": "AI 概念龍頭股",
        "added_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 1
  }
}
```

### 5.3 刪除收藏

```http
DELETE /api/v1/favorites/{favorite_id}
```

## 6. AI 分析 API

### 6.1 智能股票分析

```http
POST /api/v1/ai/analyze
```

#### 請求體

```json
{
  "query": "分析台積電在 AI 領域的投資價值",
  "stock_id": "2330",
  "analysis_type": "investment_value",
  "time_horizon": "6m"
}
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "analysis_id": "analysis_123",
    "query": "分析台積電在 AI 領域的投資價值",
    "summary": "台積電作為全球半導體製造龍頭，在 AI 領域具有顯著優勢...",
    "key_points": ["技術領先優勢明顯", "AI 芯片需求強勁", "產能擴張計劃明確"],
    "risks": ["地緣政治風險", "技術迭代風險", "競爭加劇風險"],
    "opportunities": ["AI 芯片市場擴張", "先進製程技術突破", "客戶多元化發展"],
    "recommendation": "buy",
    "confidence_score": 0.85,
    "target_price": 580.0,
    "time_horizon": "6m",
    "generated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 6.2 概念趨勢預測

```http
POST /api/v1/ai/predict
```

#### 請求體

```json
{
  "concept": "AI",
  "prediction_type": "market_trend",
  "time_horizon": "3m",
  "include_analysis": true
}
```

#### 響應示例

```json
{
  "success": true,
  "data": {
    "prediction_id": "prediction_123",
    "concept": "AI",
    "prediction_type": "market_trend",
    "time_horizon": "3m",
    "prediction": {
      "trend": "bullish",
      "confidence": 0.78,
      "expected_growth": 0.15,
      "key_factors": ["技術突破", "政策支持", "市場需求"]
    },
    "analysis": {
      "current_state": "穩健增長",
      "driving_factors": ["技術創新", "應用擴展"],
      "challenges": ["監管變化", "競爭加劇"],
      "recommendations": ["關注技術突破", "分散投資風險"]
    },
    "generated_at": "2024-01-15T10:30:00Z"
  }
}
```

## 7. 數據模型定義

### 7.1 股票模型

```typescript
interface Stock {
  id: string;
  name: string;
  code: string;
  exchange: string;
  price: number;
  change: number;
  change_percent: number;
  market_cap: number;
  volume: number;
  pe_ratio?: number;
  pb_ratio?: number;
  dividend_yield?: number;
  concepts: string[];
  concept_strength: number;
  last_updated: string;
}

interface StockDetail extends Stock {
  financials: {
    revenue: number;
    profit: number;
    assets: number;
    liabilities: number;
  };
  analyst_ratings: {
    buy: number;
    hold: number;
    sell: number;
    average_target: number;
  };
  concepts: ConceptDetail[];
}
```

### 7.2 概念模型

```typescript
interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  trend: 'rising' | 'falling' | 'stable';
  growth_potential: 'low' | 'medium' | 'high';
  market_sentiment: 'negative' | 'neutral' | 'positive';
  related_stocks_count: number;
  last_updated: string;
}

interface ConceptDetail extends Concept {
  definition: string;
  sub_concepts: string[];
  related_concepts: string[];
  market_size: number;
  growth_rate: number;
  key_players: string[];
  investment_themes: string[];
  risks: string[];
  opportunities: string[];
}
```

### 7.3 本地收藏模型

```typescript
interface LocalFavorite {
  id: string;
  stock_id: string;
  stock_name: string;
  stock_code: string;
  price: number;
  change_percent: number;
  notes?: string;
  added_at: string;
}
```

### 7.4 AI 分析模型

```typescript
interface AIAnalysis {
  analysis_id: string;
  query: string;
  summary: string;
  key_points: string[];
  risks: string[];
  opportunities: string[];
  recommendation: 'buy' | 'hold' | 'sell';
  confidence_score: number;
  target_price?: number;
  time_horizon: string;
  generated_at: string;
}

interface AIPrediction {
  prediction_id: string;
  concept: string;
  prediction_type: string;
  time_horizon: string;
  prediction: {
    trend: 'bearish' | 'neutral' | 'bullish';
    confidence: number;
    expected_growth: number;
    key_factors: string[];
  };
  analysis: {
    current_state: string;
    driving_factors: string[];
    challenges: string[];
    recommendations: string[];
  };
  generated_at: string;
}
```

## 8. 錯誤碼說明

### 8.1 通用錯誤碼

| 錯誤碼                     | HTTP 狀態碼 | 描述           | 解決方案                 |
| -------------------------- | ----------- | -------------- | ------------------------ |
| `invalid_request`          | 400         | 請求格式錯誤   | 檢查請求參數和格式       |
| `missing_parameter`        | 400         | 缺少必要參數   | 提供所有必要參數         |
| `invalid_parameter`        | 400         | 參數值無效     | 檢查參數值範圍和格式     |
| `unauthorized`             | 401         | 未提供認證信息 | 添加有效的 API 密鑰      |
| `invalid_token`            | 401         | API 密鑰無效   | 檢查 API 密鑰是否正確    |
| `insufficient_permissions` | 403         | 權限不足       | 聯繫管理員               |
| `resource_not_found`       | 404         | 資源不存在     | 檢查資源 ID 是否正確     |
| `rate_limit_exceeded`      | 429         | 請求頻率過高   | 降低請求頻率或聯繫管理員 |
| `internal_error`           | 500         | 服務器內部錯誤 | 稍後重試或聯繫支持       |

### 8.2 業務錯誤碼

| 錯誤碼                     | HTTP 狀態碼 | 描述           | 解決方案             |
| -------------------------- | ----------- | -------------- | -------------------- |
| `stock_not_found`          | 404         | 股票不存在     | 檢查股票代碼是否正確 |
| `concept_not_found`        | 404         | 概念不存在     | 檢查概念名稱是否正確 |
| `invalid_analysis_request` | 400         | 分析請求無效   | 檢查分析參數         |
| `analysis_in_progress`     | 202         | 分析正在進行中 | 稍後查詢結果         |
| `insufficient_data`        | 400         | 數據不足       | 選擇其他股票或概念   |

### 8.3 錯誤響應格式

```json
{
  "success": false,
  "error": {
    "code": "invalid_parameter",
    "message": "參數 'limit' 值必須在 1-100 之間",
    "details": {
      "parameter": "limit",
      "value": 150,
      "constraints": {
        "min": 1,
        "max": 100
      }
    },
    "request_id": "req_123456789",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 9. 最佳實踐

### 9.1 請求優化

- 使用適當的 `limit` 參數，避免一次請求過多數據
- 利用 `page` 參數進行分頁查詢
- 使用 `sort` 和 `order` 參數優化結果排序
- 合理使用篩選參數減少不必要的數據傳輸

### 9.2 錯誤處理

- 實現指數退避重試機制
- 處理速率限制錯誤，遵守 `retry_after` 指示
- 記錄錯誤詳情，包括 `request_id` 和 `timestamp`
- 實現用戶友好的錯誤提示

### 9.3 快取策略

- 快取靜態數據（如股票基本信息）
- 實現適當的快取過期策略
- 使用 ETag 和 Last-Modified 頭部
- 避免重複請求相同數據

### 9.4 監控和日誌

- 監控 API 響應時間和錯誤率
- 記錄關鍵操作日誌
- 設置適當的警報閾值
- 定期分析 API 使用模式

## 10. SDK 和工具

### 10.1 官方 SDK

- **JavaScript/TypeScript SDK**：`npm install @concept-stock-screener/sdk`
- **Python SDK**：`pip install concept-stock-screener`
- **Go SDK**：`go get github.com/concept-stock-screener/go-sdk`

### 10.2 SDK 使用示例

```typescript
// JavaScript/TypeScript
import { ConceptStockScreener } from '@concept-stock-screener/sdk';

const client = new ConceptStockScreener({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.concept-stock-screener.com',
});

// 搜索股票
const stocks = await client.stocks.search({
  query: 'AI',
  limit: 20,
});

// 獲取股票詳情
const stock = await client.stocks.get('2330');

// AI 分析
const analysis = await client.ai.analyze({
  query: '分析台積電投資價值',
  stockId: '2330',
});
```

```python
# Python
from concept_stock_screener import Client

client = Client(api_key='YOUR_API_KEY')

# 搜索股票
stocks = client.stocks.search(query='AI', limit=20)

# 獲取股票詳情
stock = client.stocks.get('2330')

# AI 分析
analysis = client.ai.analyze(
    query='分析台積電投資價值',
    stock_id='2330'
)
```

## 11. 後續步驟

### 11.1 立即開始

1. 獲取 API 密鑰
2. 閱讀 SDK 文檔
3. 運行第一個 API 請求

### 11.2 短期目標 (1-2 週)

1. 集成基本 API 功能
2. 實現錯誤處理機制
3. 建立數據快取策略

### 11.3 中期目標 (3-4 週)

1. 實現完整的 API 集成
2. 優化請求和響應處理
3. 建立監控和日誌系統

### 11.4 長期目標 (6-8 週)

1. 實現高級 AI 分析功能
2. 建立實時數據更新機制
3. 優化 API 性能和可靠性
