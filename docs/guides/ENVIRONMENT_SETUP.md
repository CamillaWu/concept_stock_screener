# 🔧 環境變數設定指南

## 📋 需要設定的環境變數

### 1. GitHub Secrets (用於 GitHub Actions)

在 GitHub 倉庫設定中，前往 Settings > Secrets and variables > Actions，添加以下 secrets：

#### Vercel 相關
- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel 組織 ID
- `VERCEL_PROJECT_ID`: Vercel 專案 ID

#### API 相關
- `GEMINI_API_KEY`: Google Gemini API Key
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token

### 2. Vercel 環境變數

在 Vercel Dashboard 中，前往專案設定 > Environment Variables，添加：

#### 前端環境變數
- `NEXT_PUBLIC_API_BASE_URL`: `https://concept-stock-screener-api.sandy246836.workers.dev`

### 3. Cloudflare Workers 環境變數

在 Cloudflare Dashboard 中，前往 Workers > 您的 Worker > Settings > Variables，添加：

#### 後端環境變數
- `GEMINI_API_KEY`: Google Gemini API Key
- `ENVIRONMENT`: `production`

## 🔍 如何取得這些值

### Vercel Token
1. 前往 https://vercel.com/account/tokens
2. 點擊 "Create Token"
3. 選擇 "Full Account" 權限
4. 複製生成的 token

### Vercel Org ID 和 Project ID
1. 在 Vercel Dashboard 中，前往專案設定
2. 在 URL 中可以看到：`https://vercel.com/[org-id]/[project-id]/settings`
3. 複製 org-id 和 project-id

### Cloudflare API Token
1. 前往 https://dash.cloudflare.com/profile/api-tokens
2. 點擊 "Create Token"
3. 選擇 "Custom token"
4. 設定權限：Zone > Zone > Read, Zone > DNS > Edit
5. 複製生成的 token

## 🚀 設定完成後

設定完成後，每次推送到 GitHub main 分支都會：
1. 自動觸發 GitHub Actions
2. 建置專案
3. 部署到 Vercel
4. 更新生產環境

## 📞 下一步

設定完成後，我們可以：
1. 測試自動部署流程
2. 添加更多功能
3. 設定監控和分析
4. 優化效能
