# 雲端部署指南

## 概述

本指南將幫助您將概念股自動化篩選系統部署到雲端，包括：
- **Cloudflare Workers** - 後端 API 服務
- **Vercel** - 前端應用部署
- **RAG 檔案服務** - 靜態檔案託管

## 部署架構

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │  Cloudflare      │    │   RAG Files     │
│   (Frontend)    │◄──►│  Workers (API)   │◄──►│   (Static)      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 前置需求

### 1. API 金鑰

#### Google Gemini API
1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 建立新的 API 金鑰
3. 複製金鑰並保存

#### Cloudflare API Token
1. 前往 [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. 建立新的 API Token
3. 權限設定：
   - Account > Cloudflare Workers > Edit
   - Account > Workers KV Storage > Edit
4. 複製 Token 並保存

#### Vercel Token
1. 前往 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 建立新的 Token
3. 複製 Token 並保存

### 2. 環境變數設定

建立 `.env` 檔案：

```bash
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_here
VERCEL_TOKEN=your_vercel_token_here

# Cloudflare Workers
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here

# Vercel
VERCEL_PROJECT_ID=your_vercel_project_id_here

# 其他設定
NODE_ENV=production
```

## 部署步驟

### 方法一：使用 GitHub Actions（推薦）
如果您已經設定好 GitHub Actions，只需要：
1. 推送程式碼到 main 分支
2. GitHub Actions 會自動部署 API 和前端

### 方法二：使用 PowerShell 腳本

```powershell
# 設定環境變數
$env:GEMINI_API_KEY = "your_gemini_api_key"
$env:CLOUDFLARE_API_TOKEN = "your_cloudflare_api_token"
$env:VERCEL_TOKEN = "your_vercel_token"

# 執行部署腳本
.\scripts\deploy-cloud.ps1
```

### 方法二：手動部署

#### 1. 部署 Cloudflare Workers API

```bash
# 進入 API 目錄
cd apps/api

# 登入 Cloudflare
npx wrangler login

# 設定環境變數
npx wrangler secret put GEMINI_API_KEY

# 部署
pnpm deploy
```

#### 2. 部署 Vercel 前端

```bash
# 進入前端目錄
cd apps/web

# 建置
pnpm build

# 部署
npx vercel --prod
```

## 環境變數設定

### Cloudflare Workers 環境變數

在 Cloudflare Dashboard 中設定：

1. 前往 [Workers & Pages](https://dash.cloudflare.com/workers)
2. 選擇您的 Worker
3. 前往 Settings > Variables
4. 添加以下環境變數：

```
GEMINI_API_KEY = your_gemini_api_key
ENVIRONMENT = production
CLOUD_DEPLOYMENT = true
```

### Vercel 環境變數

在 Vercel Dashboard 中設定：

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇您的專案
3. 前往 Settings > Environment Variables
4. 添加以下環境變數：

```
NEXT_PUBLIC_API_BASE_URL = https://concepts-radar-api.sandy246836.workers.dev
NODE_ENV = production
```

## 驗證部署

### 1. 測試 API 端點

```bash
# 健康檢查
curl https://concepts-radar-api.sandy246836.workers.dev

# RAG 狀態
curl https://concepts-radar-api.sandy246836.workers.dev/rag/status

# 主題列表
curl https://concepts-radar-api.sandy246836.workers.dev/rag/themes
```

### 2. 測試前端應用

1. 訪問 https://concept-stock-screener.vercel.app
2. 測試 RAG 管理面板：https://concept-stock-screener.vercel.app/rag
3. 驗證所有功能正常運作

## 故障排除

### 常見問題

#### 1. Cloudflare Workers 部署失敗

**問題**：`Error: Failed to deploy`
**解決方案**：
- 檢查 CLOUDFLARE_API_TOKEN 是否正確
- 確認 wrangler.toml 配置正確
- 檢查網路連接

#### 2. Vercel 部署失敗

**問題**：`Build failed`
**解決方案**：
- 檢查 VERCEL_TOKEN 是否正確
- 確認 package.json 中的建置腳本
- 檢查依賴是否正確安裝

#### 3. API 端點返回 404

**問題**：API 無法訪問
**解決方案**：
- 確認 Cloudflare Workers 已成功部署
- 檢查 CORS 設定
- 驗證環境變數是否正確設定

#### 4. RAG 功能無法使用

**問題**：RAG 搜尋無結果
**解決方案**：
- 確認 RAG 檔案已上傳到 Vercel
- 檢查向量化是否成功
- 驗證 API 金鑰設定

## 監控與維護

### 1. 日誌監控

- **Cloudflare Workers**：在 Cloudflare Dashboard 中查看日誌
- **Vercel**：在 Vercel Dashboard 中查看部署日誌

### 2. 效能監控

- 使用 Cloudflare Analytics 監控 API 效能
- 使用 Vercel Analytics 監控前端效能

### 3. 定期更新

- 定期更新依賴套件
- 監控 API 金鑰過期時間
- 備份重要配置檔案

## 支援

如果遇到問題，請：

1. 檢查本指南的故障排除部分
2. 查看專案的 GitHub Issues
3. 聯繫技術支援團隊

## 更新日誌

- **v1.0.0** - 初始雲端部署指南
- **v1.1.0** - 添加 PowerShell 腳本支援
- **v1.2.0** - 更新環境變數設定
