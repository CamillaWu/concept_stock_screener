# 🚀 部署指南

## 📋 概述

本指南涵蓋概念股自動化篩選系統的完整部署流程，包括開發環境、測試環境和生產環境的設定。

## 🏗️ 部署架構

### 系統架構
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端應用      │    │   API 服務      │    │   RAG 系統      │
│   (Vercel)      │◄──►│   (Cloudflare)  │◄──►│   (Pinecone)    │
│   Port: 3002    │    │   Port: 8787    │    │   Vector DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術棧
- **前端**: Next.js 14 + React 18 + TypeScript
- **後端**: Cloudflare Workers + Hono
- **資料庫**: Pinecone Vector Database
- **AI**: Google Gemini API
- **部署**: Vercel (前端) + Cloudflare (後端)

## 🔧 環境準備

### 1. 必要帳戶
- [GitHub](https://github.com) - 程式碼託管
- [Vercel](https://vercel.com) - 前端部署
- [Cloudflare](https://cloudflare.com) - 後端部署
- [Google Cloud](https://cloud.google.com) - Gemini API
- [Pinecone](https://pinecone.io) - 向量資料庫

### 2. 環境變數設定
```bash
# .env.local (開發環境)
GEMINI_API_KEY=your_gemini_api_key
API_BASE_URL=http://localhost:8787
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=concept-stock-screener

# Vercel 環境變數
GEMINI_API_KEY=your_gemini_api_key
API_BASE_URL=https://your-api.workers.dev
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=concept-stock-screener

# Cloudflare Workers 環境變數
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=concept-stock-screener
```

## 🚀 部署流程

### 階段 1: 本地開發環境

#### 1.1 專案設定
```bash
# 克隆專案
git clone <repository-url>
cd concept_stock_screener

# 安裝依賴
pnpm install

# 建置共用套件
pnpm build
```

#### 1.2 環境變數設定
```bash
# 複製環境變數範本
cp .env.example .env.local

# 編輯環境變數
# 設定 GEMINI_API_KEY 和其他必要變數
```

#### 1.3 本地測試
```bash
# 啟動開發環境
pnpm dev

# 測試 API
node scripts/test-dev-environment.js

# 效能測試
node scripts/performance-test.js
```

### 階段 2: 後端 API 部署 (Cloudflare Workers)

#### 2.1 Cloudflare 設定
```bash
# 安裝 Wrangler CLI
npm install -g wrangler

# 登入 Cloudflare
wrangler login

# 建立 KV Namespace
wrangler kv:namespace create "CONCEPT_STOCK_SCREENER"
```

#### 2.2 部署 API
```bash
# 進入 API 目錄
cd apps/api

# 設定環境變數
wrangler secret put GEMINI_API_KEY
wrangler secret put PINECONE_API_KEY
wrangler secret put PINECONE_ENVIRONMENT
wrangler secret put PINECONE_INDEX_NAME

# 部署到 Cloudflare Workers
pnpm deploy
```

#### 2.3 驗證部署
```bash
# 測試 API 端點
curl https://your-api.workers.dev/

# 測試趨勢主題
curl "https://your-api.workers.dev/trending?sort=popular"

# 測試搜尋功能
curl "https://your-api.workers.dev/search?mode=theme&q=AI"
```

### 階段 3: 前端部署 (Vercel)

#### 3.1 Vercel 設定
```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login
```

#### 3.2 部署前端
```bash
# 進入前端目錄
cd apps/web

# 設定環境變數
vercel env add GEMINI_API_KEY
vercel env add API_BASE_URL
vercel env add PINECONE_API_KEY
vercel env add PINECONE_ENVIRONMENT
vercel env add PINECONE_INDEX_NAME

# 部署到 Vercel
vercel --prod
```

#### 3.3 自定義域名 (可選)
```bash
# 添加自定義域名
vercel domains add your-domain.com

# 設定 DNS 記錄
# 將 your-domain.com 指向 Vercel 提供的 IP
```

### 階段 4: RAG 系統部署

#### 4.1 Pinecone 設定
```bash
# 建立 Pinecone 索引
node scripts/setup-pinecone.js

# 載入 RAG 資料
node scripts/load-rag-to-pinecone.js
```

#### 4.2 驗證 RAG 系統
```bash
# 測試 RAG 載入
node scripts/test-rag-loading.js

# 檢查向量搜尋
curl "https://your-api.workers.dev/search?mode=theme&q=AI&real=false"
```

## 🔄 持續部署 (CI/CD)

### GitHub Actions 設定

#### 1. 建立 `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: cd apps/api && pnpm deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: cd apps/web && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

#### 2. 設定 GitHub Secrets
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `VERCEL_TOKEN`: Vercel Deploy Token
- `GEMINI_API_KEY`: Google Gemini API Key
- `PINECONE_API_KEY`: Pinecone API Key

## 📊 監控和維護

### 1. 效能監控
```bash
# 定期效能測試
node scripts/performance-test.js

# 監控 API 回應時間
curl -w "@curl-format.txt" -o /dev/null -s "https://your-api.workers.dev/trending"
```

### 2. 錯誤監控
- **Cloudflare Workers**: 查看 Workers 日誌
- **Vercel**: 查看 Function 日誌
- **Pinecone**: 監控索引使用情況

### 3. 備份策略
```bash
# 備份 RAG 資料
cp -r public/rag/ backup/rag-$(date +%Y%m%d)

# 備份環境變數
cp .env.local backup/env-$(date +%Y%m%d)
```

## 🔧 故障排除

### 常見部署問題

#### 1. Cloudflare Workers 部署失敗
```bash
# 檢查 wrangler.toml 設定
cat apps/api/wrangler.toml

# 重新登入
wrangler login

# 清理快取
wrangler kv:namespace delete
wrangler kv:namespace create
```

#### 2. Vercel 部署失敗
```bash
# 檢查建置日誌
vercel logs

# 重新部署
vercel --force

# 檢查環境變數
vercel env ls
```

#### 3. RAG 系統問題
```bash
# 檢查 Pinecone 連線
node scripts/test-rag-loading.js

# 重新載入資料
node scripts/load-rag-to-pinecone.js

# 檢查索引狀態
curl -H "Api-Key: $PINECONE_API_KEY" \
  "https://$PINECONE_ENVIRONMENT-$PINECONE_INDEX_NAME.svc.pinecone.io/describe_index_stats"
```

### 緊急回滾
```bash
# 回滾到上一個版本
git checkout HEAD~1
pnpm build
pnpm deploy

# 或者使用特定版本
git checkout v1.0.0
pnpm build
pnpm deploy
```

## 📈 擴展指南

### 1. 水平擴展
- **Cloudflare Workers**: 自動擴展，無需額外設定
- **Vercel**: 自動擴展，支援全球 CDN
- **Pinecone**: 升級到更高規格的索引

### 2. 功能擴展
```bash
# 添加新的 API 端點
# 編輯 apps/api/src/index.ts

# 添加新的前端頁面
# 編輯 apps/web/src/app/

# 更新 RAG 資料
node scripts/process-rag.js
```

### 3. 效能優化
- 啟用 Cloudflare Workers 快取
- 優化 Pinecone 查詢
- 實作前端快取策略

## 🎯 完成檢查清單

### 部署前檢查
- [ ] 所有環境變數已設定
- [ ] 本地測試通過
- [ ] 建置成功
- [ ] 依賴已安裝

### 部署後檢查
- [ ] API 端點可訪問
- [ ] 前端頁面正常載入
- [ ] RAG 系統運作正常
- [ ] 效能測試通過
- [ ] 錯誤監控已設定

### 維護檢查
- [ ] 定期效能測試
- [ ] 錯誤日誌檢查
- [ ] 備份策略執行
- [ ] 安全更新

## 📞 支援

### 文檔資源
- [API 文檔](../API_DOCUMENTATION.md)
- [快速開始指南](QUICK_START.md)
- [故障排除指南](TROUBLESHOOTING_GUIDE.md)

### 工具腳本
```bash
# 檢查部署狀態
node scripts/check-deployment.js

# 測試所有環境
node scripts/test-all-environments.js

# 效能診斷
node scripts/performance-diagnostic.js
```

---

🎉 **恭喜！您的概念股自動化篩選系統已成功部署！**
