# 多環境部署配置指南

## 🎯 概述

本文檔詳細說明概念股篩選系統的雙環境部署策略，包括開發環境和生產環境的完全分離配置。系統已簡化為兩個環境，適合單人項目使用。

## 🏗️ 環境架構設計

### 1.1 環境分離原則

```
概念股篩選系統
├── 開發環境 (Development)
│   ├── 前端：dev.concept-stock-screener.com
│   ├── API：dev-api.concept-stock-screener.com
│   └── 數據管道：dev-pipeline.concept-stock-screener.com
│   └── 分支：develop, feature/*
│
└── 生產環境 (Production)
    ├── 前端：concept-stock-screener.com
    ├── API：api.concept-stock-screener.com
    └── 數據管道：pipeline.concept-stock-screener.com
    └── 分支：main
```

### 1.2 為什麼需要環境分離？

- **安全性**：開發環境可能包含調試信息和測試數據
- **穩定性**：生產環境需要穩定可靠的版本
- **數據隔離**：避免測試數據污染生產環境
- **部署頻率**：開發環境可以頻繁部署，生產環境需要謹慎

## 🌐 Vercel 前端部署配置

### 2.1 開發環境專案

#### 2.1.1 專案配置

```bash
專案名稱：concept-stock-screener-dev
域名：dev.concept-stock-screener.com
環境：Development
Git 分支：develop, feature/*
自動部署：每次 push 到 develop 分支
```

#### 2.1.2 環境變數

```bash
# Vercel 開發環境變數
VERCEL_ENV=development
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_BASE_URL=https://dev-api.concept-stock-screener.com
NEXT_PUBLIC_APP_URL=https://dev.concept-stock-screener.com
```

#### 2.1.3 創建步驟

```bash
# 1. 切換到開發分支
git checkout develop

# 2. 創建開發環境專案
vercel --name concept-stock-screener-dev

# 3. 配置環境變數
vercel env add VERCEL_ENV development
vercel env add NODE_ENV development
vercel env add NEXT_PUBLIC_ENVIRONMENT development
vercel env add NEXT_PUBLIC_API_BASE_URL https://dev-api.concept-stock-screener.com
vercel env add NEXT_PUBLIC_APP_URL https://dev.concept-stock-screener.com

# 4. 設置域名
vercel domains add dev.concept-stock-screener.com
```

### 2.2 生產環境專案

#### 2.2.1 專案配置

```bash
專案名稱：concept-stock-screener-prod
域名：concept-stock-screener.com
環境：Production
Git 分支：main, release/*
自動部署：手動觸發或標籤觸發
```

#### 2.2.2 環境變數

```bash
# Vercel 生產環境變數
VERCEL_ENV=production
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_BASE_URL=https://api.concept-stock-screener.com
NEXT_PUBLIC_APP_URL=https://concept-stock-screener.com
```

#### 2.2.3 創建步驟

```bash
# 1. 切換到主分支
git checkout main

# 2. 創建生產環境專案
vercel --name concept-stock-screener-prod

# 3. 配置環境變數
vercel env add VERCEL_ENV production
vercel env add NODE_ENV production
vercel env add NEXT_PUBLIC_ENVIRONMENT production
vercel env add NEXT_PUBLIC_API_BASE_URL https://api.concept-stock-screener.com
vercel env add NEXT_PUBLIC_APP_URL https://concept-stock-screener.com

# 4. 設置域名
vercel domains add concept-stock-screener.com
```

## ⚡ Cloudflare Workers API 部署配置

### 3.1 開發環境

#### 3.1.1 wrangler.toml 配置

```toml
# apps/api/wrangler.dev.toml
name = "concept-stock-screener-api-dev"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.development]
name = "concept-stock-screener-api-dev"
vars = { ENVIRONMENT = "development" }

[[env.development.kv_namespaces]]
binding = "CONCEPT_DATA"
id = "your-dev-kv-namespace-id"
preview_id = "your-dev-preview-kv-namespace-id"

[[env.development.r2_buckets]]
binding = "STORAGE"
bucket_name = "concept-stock-screener-dev"
```

#### 3.1.2 環境變數

```bash
# Cloudflare 開發環境
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
ENVIRONMENT=development
API_BASE_URL=https://dev-api.concept-stock-screener.com
```

#### 3.1.3 部署命令

```bash
# 部署到開發環境
wrangler deploy --env development

# 或使用環境變數
CLOUDFLARE_ACCOUNT_ID=your_account_id wrangler deploy --env development
```

### 3.2 生產環境

#### 3.2.1 wrangler.toml 配置

```toml
# apps/api/wrangler.prod.toml
name = "concept-stock-screener-api-prod"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "concept-stock-screener-api-prod"
vars = { ENVIRONMENT = "production" }

[[env.production.kv_namespaces]]
binding = "CONCEPT_DATA"
id = "your-prod-kv-namespace-id"

[[env.production.r2_buckets]]
binding = "STORAGE"
bucket_name = "concept-stock-screener-prod"
```

#### 3.2.2 環境變數

```bash
# Cloudflare 生產環境
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
ENVIRONMENT=production
API_BASE_URL=https://api.concept-stock-screener.com
```

#### 3.2.3 部署命令

```bash
# 部署到生產環境
wrangler deploy --env production

# 或使用環境變數
CLOUDFLARE_ACCOUNT_ID=your_account_id wrangler deploy --env production
```

## 🔄 CI/CD 工作流程配置

### 4.1 開發環境部署工作流程

```yaml
# .github/workflows/dev-deploy.yml
name: 開發環境部署

on:
  push:
    branches: [develop, feature/*]
  workflow_dispatch:

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development

    steps:
      - name: 部署前端到 Vercel 開發環境
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN_DEV }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID_DEV }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DEV }}
          vercel-args: '--prod'
          working-directory: ./apps/web

      - name: 部署 API 到 Cloudflare 開發環境
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN_DEV }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID_DEV }}
          command: deploy
          environment: development
          working-directory: ./apps/api
```

### 4.2 生產環境部署工作流程

```yaml
# .github/workflows/prod-deploy.yml
name: 生產環境部署

on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - name: 部署前端到 Vercel 生產環境
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN_PROD }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID_PROD }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
          vercel-args: '--prod'
          working-directory: ./apps/web

      - name: 部署 API 到 Cloudflare 生產環境
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN_PROD }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID_PROD }}
          command: deploy
          environment: production
          working-directory: ./apps/api
```

## 🔐 GitHub Secrets 配置

### 5.1 開發環境 Secrets

```bash
# Vercel 開發環境
VERCEL_TOKEN_DEV=your_dev_vercel_token
VERCEL_ORG_ID_DEV=your_dev_vercel_org_id
VERCEL_PROJECT_ID_DEV=your_dev_vercel_project_id

# Cloudflare 開發環境
CLOUDFLARE_API_TOKEN_DEV=your_dev_cloudflare_token
CLOUDFLARE_ACCOUNT_ID_DEV=your_cloudflare_account_id
```

### 5.2 生產環境 Secrets

```bash
# Vercel 生產環境
VERCEL_TOKEN_PROD=your_prod_vercel_token
VERCEL_ORG_ID_PROD=your_prod_vercel_org_id
VERCEL_PROJECT_ID_PROD=your_prod_vercel_project_id

# Cloudflare 生產環境
CLOUDFLARE_API_TOKEN_PROD=your_prod_cloudflare_token
CLOUDFLARE_ACCOUNT_ID_PROD=your_cloudflare_account_id
```

## 📊 環境管理最佳實踐

### 6.1 分支策略

```
main (生產環境)
├── develop (開發環境)
├── feature/新功能
├── hotfix/緊急修復
└── release/版本發布
```

### 6.2 部署流程

1. **功能開發** → `feature/*` 分支 → 開發環境測試
2. **功能完成** → 合併到 `develop` → 自動部署到開發環境
3. **測試驗證** → 在開發環境進行完整測試
4. **版本發布** → 創建 `release/*` 分支 → 合併到 `main`
5. **生產部署** → 標籤觸發 → 自動部署到生產環境

### 6.3 回滾策略

- **開發環境**：自動回滾到上一個穩定版本
- **生產環境**：手動回滾或自動回滾（基於健康檢查）

## 🧪 測試和驗證

### 7.1 環境隔離測試

```bash
# 測試開發環境
curl -f https://dev-api.concept-stock-screener.com/health
curl -f https://dev.concept-stock-screener.com

# 測試生產環境
curl -f https://api.concept-stock-screener.com/health
curl -f https://concept-stock-screener.com
```

### 7.2 部署驗證

- 檢查環境變數是否正確
- 驗證 API 端點是否響應
- 確認前端頁面是否正常加載
- 測試數據庫連接和功能

## ⚠️ 注意事項

### 8.1 安全考慮

- 不同環境使用不同的 API 令牌
- 生產環境的密鑰需要更高的安全標準
- 定期輪換所有環境的密鑰

### 8.2 成本控制

- 開發環境可以使用免費套餐
- 生產環境根據實際需求選擇付費套餐
- 監控各環境的資源使用情況

### 8.3 維護管理

- 定期同步兩個環境的配置
- 保持環境變數的一致性
- 建立環境配置的文檔和變更記錄

## 🔮 未來改進

### 9.1 短期目標 (1-2 週)

- [ ] 完成開發環境和生產環境的分離
- [ ] 建立自動化部署流程
- [ ] 實現基本的健康檢查

### 9.2 中期目標 (3-4 週)

- [ ] 添加環境配置管理工具
- [ ] 實現自動化測試和驗證
- [ ] 建立監控告警系統

### 9.3 長期目標 (6-8 週)

- [ ] 實現藍綠部署
- [ ] 添加自動化回滾機制
- [ ] 建立完整的環境管理平台

## 📚 相關文檔

- [GitHub 環境配置指南](./GITHUB_ENVIRONMENT_SETUP.md)
- [CI/CD 流程設計](./CI_CD_PIPELINE_DESIGN.md)
- [開發環境 CI/CD 配置](./DEV_ENVIRONMENT_CI_CD.md)
- [部署指南](../../deployment/DEPLOYMENT_GUIDE.md)

---

**最後更新**：2024-12-19
**維護者**：Concept Stock Screener Team
**版本**：1.0.0
