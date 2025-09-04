# 簡化 CI/CD 架構文檔

## 🎯 概述

概念股篩選系統已簡化為兩個環境的 CI/CD 架構，適合單人項目使用。本文檔詳細說明簡化後的架構設計和工作流程。

## 🏗️ 簡化架構

### 1.1 環境設計

```
概念股篩選系統 CI/CD
├── CI 工作流程 (ci.yml)
│   ├── 構建和測試
│   ├── 上傳構建產物
│   └── 環境部署通知
│
├── 開發環境 (dev-deploy.yml)
│   ├── 觸發：develop, feature/* 分支
│   ├── 自動部署
│   └── 快速驗證
│
└── 生產環境 (production-deploy.yml)
    ├── 觸發：main 分支
    ├── 自動部署
    └── 完整驗證
```

### 1.2 分支策略

- **develop** 分支 → 開發環境部署
- **main** 分支 → 生產環境部署
- **feature/\*** 分支 → 開發環境部署

## 🔄 工作流程

### 2.1 CI 工作流程 (ci.yml)

**觸發條件**：

- 所有分支的 push 和 PR

**主要職責**：

1. **環境設置和檢查**
   - 安裝依賴
   - 類型檢查
   - 代碼風格檢查

2. **構建和測試**
   - 構建基礎包
   - 構建前端
   - 構建 API
   - 運行測試

3. **上傳構建產物**
   - 創建部署包
   - 上傳到 GitHub Artifacts

4. **環境部署通知**
   - 開發環境通知（develop 分支）
   - 生產環境通知（main 分支）

### 2.2 開發環境部署 (dev-deploy.yml)

**觸發條件**：

- `develop` 分支 push
- `feature/*` 分支 push
- 手動觸發

**部署流程**：

1. 下載構建產物
2. 部署前端到 Vercel 開發環境
3. 部署 API 到 Cloudflare 開發環境
4. 部署數據管道
5. 更新部署狀態

**驗證流程**：

1. 等待服務啟動
2. 健康檢查
3. 基本功能測試

### 2.3 生產環境部署 (production-deploy.yml)

**觸發條件**：

- `main` 分支 push
- 手動觸發

**部署流程**：

1. 下載構建產物
2. 部署前端到 Vercel 生產環境
3. 部署 API 到 Cloudflare 生產環境
4. 部署數據管道
5. 更新部署狀態

**驗證流程**：

1. 等待服務啟動
2. 生產環境健康檢查
3. 生產環境功能測試
4. 性能測試

## 🚀 部署流程

### 3.1 開發流程

```
開發者提交代碼到 develop 分支
           ↓
    觸發 CI 工作流程
           ↓
      構建和測試
           ↓
    上傳構建產物
           ↓
    觸發開發環境部署
           ↓
      自動部署完成
           ↓
      快速驗證通過
```

### 3.2 生產流程

```
開發者合併到 main 分支
           ↓
    觸發 CI 工作流程
           ↓
      構建和測試
           ↓
    上傳構建產物
           ↓
    觸發生產環境部署
           ↓
      自動部署完成
           ↓
      完整驗證通過
```

## 🔧 配置要求

### 4.1 GitHub Secrets

**開發環境**：

- `VERCEL_TOKEN_DEV`
- `VERCEL_ORG_ID_DEV`
- `VERCEL_PROJECT_ID_DEV`
- `CLOUDFLARE_API_TOKEN_DEV`
- `CLOUDFLARE_ACCOUNT_ID_DEV`

**生產環境**：

- `VERCEL_TOKEN_PRODUCTION`
- `VERCEL_ORG_ID_PRODUCTION`
- `VERCEL_PROJECT_ID_PRODUCTION`
- `CLOUDFLARE_API_TOKEN_PRODUCTION`
- `CLOUDFLARE_ACCOUNT_ID_PRODUCTION`

### 4.2 環境變數

**開發環境**：

- `NODE_ENV=development`
- `NEXT_PUBLIC_ENVIRONMENT=development`
- `NEXT_PUBLIC_API_BASE_URL=https://dev-api.concept-stock-screener.com`

**生產環境**：

- `NODE_ENV=production`
- `NEXT_PUBLIC_ENVIRONMENT=production`
- `NEXT_PUBLIC_API_BASE_URL=https://api.concept-stock-screener.com`

## 📊 監控和驗證

### 5.1 健康檢查

每個環境都包含健康檢查端點：

- 開發環境：`https://dev-api.concept-stock-screener.com/health`
- 生產環境：`https://api.concept-stock-screener.com/health`

### 5.2 部署狀態

每個部署都會創建狀態文件：

- 開發環境：`deployment-status.json`
- 生產環境：`production-deployment-status.json`

## 🎯 優勢

### 6.1 簡化優勢

1. **職責分離**：CI 專注構建，部署專注部署
2. **自動化**：推送到對應分支自動觸發部署
3. **單人友好**：不需要複雜的審批流程
4. **維護簡單**：每個工作流程職責單一

### 6.2 適合場景

- 單人開發項目
- 中小型項目
- 需要快速迭代的項目
- 對部署流程要求不複雜的項目

## 🔄 擴展性

### 7.1 未來擴展

如果需要更複雜的部署策略，可以：

1. 添加審批流程
2. 增加更多環境（如預發布環境）
3. 添加回滾機制
4. 增加更詳細的監控告警

### 7.2 當前限制

- 只有兩個環境
- 沒有審批流程
- 沒有自動回滾
- 監控告警相對簡單

---

**最後更新**: 2024-12-19
**維護者**: Concept Stock Screener Team
**狀態**: 已簡化為兩個環境
**適用場景**: 單人項目
