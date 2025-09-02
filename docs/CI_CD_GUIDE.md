# CI/CD 整合指南

本指南說明如何將測試框架與 CI/CD 流程整合，實現自動化測試、構建和部署。

## 📋 目錄

- [概述](#概述)
- [CI/CD 架構](#cicd-架構)
- [GitHub Actions](#github-actions)

- [本地 CI/CD 工具](#本地-cicd-工具)
- [部署配置](#部署配置)
- [監控和通知](#監控和通知)
- [故障排除](#故障排除)

## 🎯 概述

我們的 CI/CD 流程整合了以下功能：

- **自動化測試**: 單元測試、整合測試、E2E 測試、效能測試
- **代碼品質檢查**: ESLint、Prettier、TypeScript 類型檢查
- **自動構建**: 生成生產就緒的構建產物
- **自動部署**: 支援 staging 和 production 環境
- **監控和通知**: 部署狀態通知和健康檢查

## 🏗️ CI/CD 架構

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   代碼提交      │───▶│   CI 流程       │───▶│   CD 流程       │
│   (Git)         │    │   (測試+品質)   │    │   (構建+部署)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   測試報告      │    │   部署驗證      │
                       │   覆蓋率報告    │    │   健康檢查      │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 GitHub Actions

### 觸發條件

- **Push**: `main` 和 `develop` 分支
- **Pull Request**: 到 `main` 和 `develop` 分支
- **定時**: 每天凌晨 2 點自動運行測試

### 工作流程

1. **測試階段** (`test`)
   - 多 Node.js 版本測試 (16, 18, 20)
   - 運行所有測試類型
   - 生成測試報告和覆蓋率

2. **代碼品質階段** (`quality`)
   - ESLint 檢查
   - Prettier 格式檢查
   - TypeScript 類型檢查

3. **構建階段** (`build`)
   - 構建應用
   - 上傳構建產物

4. **部署階段** (`deploy`)
   - 部署到 Cloudflare Workers (後端 API)
   - 部署到 Vercel (前端網站)

5. **通知階段** (`notify`)
   - Slack 通知
   - 郵件通知

### 使用方法

```bash
# 查看 GitHub Actions 狀態
# 訪問: https://github.com/your-repo/actions

# 手動觸發工作流程
# 在 GitHub 倉庫頁面點擊 "Actions" → "Run workflow"
```



## 🛠️ 本地 CI/CD 工具

### CI 運行器

```bash
# 進入 scripts 目錄
cd scripts

# 運行完整的 CI 流程
node ci-cd/ci-runner.js ci

# 運行特定測試
node ci-cd/ci-runner.js test unit
node ci-cd/ci-runner.js test integration
node ci-cd/ci-runner.js test e2e
node ci-cd/ci-runner.js test performance

# 運行代碼品質檢查
node ci-cd/ci-runner.js quality

# 構建應用
node ci-cd/ci-runner.js build
```

### 部署腳本

```bash
# 部署到 staging 環境
node ci-cd/deploy.js staging

# 部署到 production 環境
node ci-cd/deploy.js production

# 回滾部署
node ci-cd/deploy.js rollback
```

## ⚙️ 部署配置

### 環境配置

部署配置在 `scripts/deploy.config.js` 中定義：

```javascript
module.exports = {
  staging: {
    cloudflare: {
      workers: { name: 'concept-stock-screener-staging' },
      pages: { name: 'concept-stock-screener-staging' }
    },
    domains: {
      api: 'https://staging-api.concept-stock-screener.workers.dev',
      web: 'https://staging.concept-stock-screener.pages.dev'
    }
  },
  production: {
    cloudflare: {
      workers: { name: 'concept-stock-screener' },
      pages: { name: 'concept-stock-screener' }
    },
    domains: {
      api: 'https://api.concept-stock-screener.workers.dev',
      web: 'https://concept-stock-screener.pages.dev'
    }
  }
};
```

### 部署策略

- **藍綠部署**: 零停機部署
- **金絲雀部署**: 漸進式流量切換
- **滾動部署**: 批次更新

## 📊 監控和通知

### 監控指標

- 響應時間
- 錯誤率
- 吞吐量
- 可用性

### 通知渠道

- **Slack**: CI/CD 狀態、警報、部署通知
- **郵件**: 開發者和運維團隊通知
- **Webhook**: 第三方系統集成

### 健康檢查

```bash
# API 健康檢查
curl https://api.concept-stock-screener.workers.dev/health

# Web 端點檢查
curl -I https://concept-stock-screener.pages.dev
```

## 🔍 故障排除

### 常見問題

#### 1. 測試失敗

```bash
# 檢查測試環境
cd scripts
npm test -- --verbose

# 檢查特定測試
npm test -- --testNamePattern="測試名稱"

# 檢查測試覆蓋率
npm run test:coverage
```

#### 2. 構建失敗

```bash
# 檢查依賴
npm ci

# 清理緩存
npm run clean
npm ci

# 檢查 Node.js 版本
node --version
```

#### 3. 部署失敗

```bash
# 檢查環境變數
echo $CLOUDFLARE_API_TOKEN
echo $CLOUDFLARE_ACCOUNT_ID

# 檢查構建產物
ls -la dist/

# 手動部署測試
npx wrangler deploy dist/worker.js --name test-worker
```

#### 4. CI/CD 管道失敗

```bash
# 本地運行 CI 流程
node ci-cd/ci-runner.js ci

# 檢查日誌
# 在 GitHub Actions 或 GitLab CI 頁面查看詳細日誌

# 檢查配置
cat .github/workflows/ci-cd.yml
cat .gitlab-ci.yml
```

### 調試技巧

1. **啟用詳細日誌**
   ```bash
   npm test -- --verbose --detectOpenHandles
   ```

2. **檢查環境變數**
   ```bash
   node -e "console.log(process.env)"
   ```

3. **模擬 CI 環境**
   ```bash
   CI=true node ci-cd/ci-runner.js ci
   ```

4. **檢查網絡連接**
   ```bash
   curl -I https://api.concept-stock-screener.workers.dev
   ```

## 📚 相關文檔

- [測試框架指南](./TESTING_FRAMEWORK.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [監控指南](./MONITORING_GUIDE.md)
- [故障排除指南](./TROUBLESHOOTING.md)

## 🤝 貢獻

如需改進 CI/CD 流程，請：

1. 創建 Issue 描述問題或建議
2. 創建 Pull Request 提交改進
3. 確保所有測試通過
4. 更新相關文檔

## 📞 支援

如有問題，請：

- 查看 [故障排除](#故障排除) 部分
- 檢查 [GitHub Issues](https://github.com/your-repo/issues)
- 聯繫開發團隊
- 查看 CI/CD 管道日誌
