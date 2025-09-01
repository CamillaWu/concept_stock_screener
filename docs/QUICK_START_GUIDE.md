# 🚀 概念股篩選系統 - 快速開始指南

## 📋 專案概述

概念股自動化篩選系統是一個基於 AI 的股票分析平台，提供：
- 🔍 智能股票搜尋和篩選
- 📊 趨勢主題分析
- 🤖 RAG (Retrieval-Augmented Generation) 智能分析
- 📈 即時股票數據
- 🎯 概念股自動化篩選

## 🏗️ 技術架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端應用      │    │   API 服務      │    │   RAG 系統      │
│   (Next.js)     │◄──►│   (Cloudflare)  │◄──►│   (Pinecone)    │
│   Port: 3002    │    │   Port: 8787    │    │   Vector DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術棧
- **前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **後端**: Cloudflare Workers + Hono
- **資料庫**: Pinecone Vector Database
- **AI**: Google Gemini API
- **部署**: Vercel (前端) + Cloudflare (後端)

## ⚡ 5分鐘快速設置

### 1. 環境準備
```bash
# 克隆專案
git clone <repository-url>
cd concept_stock_screener

# 安裝依賴
pnpm install

# 複製環境變數範本
cp env.example .env.local
```

### 2. 環境變數設定
編輯 `.env.local` 文件，填入必要的 API 金鑰：

```bash
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Pinecone Vector Database
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=concept-stock-screener

# API 設定
API_BASE_URL=http://localhost:8787
```

### 3. 啟動開發環境
```bash
# 建置共用套件
pnpm build

# 啟動開發環境
pnpm dev
```

### 4. 驗證設置
```bash
# 測試開發環境
node scripts/test-dev-environment.js

# 測試 RAG 功能
node scripts/test-rag-loading.js
```

## 🚀 部署指南

### 本地開發
- **前端**: http://localhost:3002
- **API**: http://localhost:8787

### 生產部署
詳細部署步驟請參考 [部署指南](./DEPLOYMENT_GUIDE.md)

## 🛠️ 開發工具

### 常用指令
```bash
# 開發環境
pnpm dev              # 啟動所有服務
pnpm dev:web          # 只啟動前端
pnpm dev:api          # 只啟動 API

# 建置
pnpm build            # 建置所有套件
pnpm build:ui         # 建置 UI 套件
pnpm build:types      # 建置類型套件

# 測試
pnpm test             # 執行測試
node scripts/test-dev-environment.js    # 測試開發環境
node scripts/test-production-api.js     # 測試生產 API

# 部署
pnpm deploy:vercel    # 部署到 Vercel
pnpm deploy:cloudflare # 部署到 Cloudflare
```

### 除錯工具
```bash
# 環境檢查
node scripts/check-env-config.js

# RAG 文件檢查
node scripts/rag-tools/check-rag-files.js

# 效能測試
node scripts/performance-test.js
```

## 📁 專案結構

```
concept_stock_screener/
├── apps/
│   ├── web/                 # 前端應用 (Next.js)
│   │   ├── src/
│   │   │   ├── app/         # 頁面組件
│   │   │   ├── components/  # 本地組件
│   │   │   └── services/    # API 服務
│   │   └── package.json
│   └── api/                 # 後端 API (Cloudflare Workers)
│       ├── src/
│       │   ├── services/    # 業務邏輯
│       │   └── index.ts     # 入口文件
│       └── package.json
├── packages/
│   ├── ui/                  # 共用 UI 組件
│   │   ├── src/components/  # UI 組件庫
│   │   └── package.json
│   └── types/               # 共用類型定義
│       ├── src/
│       └── package.json
├── docs/                    # 專案文檔
├── scripts/                 # 工具腳本
└── public/                  # 靜態資源
```

## 🔧 核心功能

### 1. 股票搜尋
- 基於主題的概念股搜尋
- 智能篩選和排序
- 即時數據更新

### 2. 趨勢分析
- 熱門主題識別
- 趨勢變化追蹤
- 市場情緒分析

### 3. RAG 智能分析
- 向量化文檔檢索
- AI 驅動的內容分析
- 智能推薦系統

### 4. 數據管理
- 股票數據整合
- 主題分類管理
- 快取優化

## 📊 效能指標

- **API 回應時間**: < 2秒
- **頁面載入時間**: < 3秒
- **RAG 查詢時間**: < 1秒
- **記憶體使用量**: < 500MB
- **錯誤率**: < 1%

## 🔗 重要連結

- **詳細進度**: [任務進度與交接](./TASK_PROGRESS_AND_HANDOVER.md)
- **API 文檔**: [API 文檔](./API_DOCUMENTATION.md)
- **部署指南**: [部署指南](./DEPLOYMENT_GUIDE.md)
- **組件分析**: [組件分析](./COMPONENT_ANALYSIS.md)

## 🚧 故障排除

### 常見問題

#### 1. 環境變數錯誤
```bash
# 檢查環境變數
node scripts/check-env-config.js
```

#### 2. RAG 功能異常
```bash
# 測試 RAG 載入
node scripts/test-rag-loading.js
```

#### 3. API 連接問題
```bash
# 測試 API 端點
curl http://localhost:8787/
```

#### 4. 建置失敗
```bash
# 清理並重新建置
rm -rf node_modules
pnpm install
pnpm build
```

## 📞 支援

如需更多協助，請參考：
1. [任務進度與交接文件](./TASK_PROGRESS_AND_HANDOVER.md)
2. [API 文檔](./API_DOCUMENTATION.md)
3. [部署指南](./DEPLOYMENT_GUIDE.md)

---

**最後更新**: 2025年8月31日  
**文件版本**: v2.0
