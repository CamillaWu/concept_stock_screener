# 開發環境 CI/CD 配置文檔

## 📋 概述

本文檔詳細說明概念股篩選系統開發環境的 CI/CD 流程配置，包括自動化構建、測試、部署和監控。系統已簡化為兩個環境：開發環境和生產環境。

## 🏗️ 架構設計

### 1.1 工作流程結構

```
開發環境 CI/CD 流程
├── CI 工作流程 (ci.yml)
│   ├── 代碼品質檢查 (code-quality)
│   ├── 構建和測試 (build-and-test)
│   └── 上傳構建產物 (upload-artifacts)
├── 開發環境部署 (dev-deploy.yml)
│   ├── 部署到開發環境 (deploy-dev)
│   └── 部署後驗證 (post-deploy-verification)
└── 生產環境部署 (production-deploy.yml)
    ├── 部署到生產環境 (deploy-production)
    └── 部署後驗證 (post-deploy-verification)
```

### 1.2 觸發條件

- **自動觸發**：
  - `develop` 分支推送
  - `feature/*` 分支推送
  - 對 `develop` 分支的 Pull Request

- **手動觸發**：
  - 可選參數：跳過測試、跳過品質檢查、強制部署

## 🔧 工作流程配置

### 2.1 主要開發環境工作流程

**文件位置**：`.github/workflows/dev-deploy.yml`

#### 2.1.1 代碼品質檢查

```yaml
code-quality:
  runs-on: ubuntu-latest
  timeout-minutes: 10

  steps:
    - 類型檢查 (pnpm type-check)
    - 代碼風格檢查 (pnpm lint:check)
    - 代碼格式化檢查 (pnpm format:check)
```

#### 2.1.2 構建和測試

```yaml
build-and-test:
  needs: code-quality
  timeout-minutes: 15

  steps:
    - 構建基礎包 (types, ui)
    - 構建前端應用
    - 構建 API 服務
    - 運行測試 (pnpm test:ci)
    - 上傳測試覆蓋率
    - 創建部署包
```

#### 2.1.3 部署到開發環境

```yaml
deploy-dev:
  needs: build-and-test
  environment: development
  timeout-minutes: 20

  steps:
    - 下載部署包
    - 部署 API 服務
    - 部署前端應用
    - 部署數據管道
    - 更新部署狀態
```

#### 2.1.4 部署後驗證

```yaml
post-deploy-verification:
  needs: deploy-dev
  timeout-minutes: 10

  steps:
    - 等待服務啟動
    - 健康檢查
    - 基本功能測試
    - 更新驗證狀態
```

### 2.2 快速部署工作流程

**文件位置**：`.github/workflows/dev-quick-deploy.yml`

#### 2.2.1 特點

- 跳過部分檢查以加快部署速度
- 適用於緊急修復和快速迭代
- 可配置跳過測試和品質檢查

#### 2.2.2 手動觸發參數

```yaml
workflow_dispatch:
  inputs:
    skip_quality_checks: false # 跳過代碼品質檢查
    skip_tests: false # 跳過測試
    force_deploy: false # 強制部署
    deploy_message: '快速部署' # 部署說明
```

### 2.3 監控工作流程

**文件位置**：`.github/workflows/dev-monitoring.yml`

#### 2.3.1 監控類型

- **健康檢查**：服務狀態、數據庫連接
- **性能監控**：響應時間、吞吐量、錯誤率
- **安全檢查**：依賴安全、代碼安全、配置安全
- **日誌分析**：錯誤分析、性能分析

#### 2.3.2 執行頻率

- **自動執行**：每 5 分鐘
- **手動觸發**：可選擇特定檢查類型

## 🚀 部署流程

### 3.1 標準部署流程

1. **代碼提交** → 觸發 CI 流程
2. **品質檢查** → 類型檢查、代碼風格檢查
3. **構建測試** → 構建應用、運行測試
4. **創建部署包** → 打包構建產物和配置
5. **部署到開發環境** → 部署各個服務
6. **部署後驗證** → 健康檢查、功能測試
7. **發送通知** → 部署結果通知

### 3.2 快速部署流程

1. **手動觸發** → 選擇部署參數
2. **快速構建** → 跳過部分檢查
3. **創建快速部署包** → 最小化部署包
4. **快速部署** → 直接部署到開發環境
5. **快速驗證** → 基本健康檢查
6. **發送通知** → 部署結果通知

### 3.3 部署包結構

```
deployment/
├── web/                    # 前端構建產物
├── api/                    # API 構建產物
├── types/                  # 類型包構建產物
├── ui/                     # UI 包構建產物
├── config/                 # 配置文件
├── scripts/                # 部署腳本
├── package.json            # 依賴配置
├── pnpm-lock.yaml         # 鎖定文件
├── pnpm-workspace.yaml    # 工作區配置
├── deployment-info.txt     # 部署信息
└── deployment-status.json  # 部署狀態
```

## 📊 監控和警報

### 4.1 監控指標

#### 4.1.1 健康指標

- API 服務響應狀態
- 前端服務加載狀態
- 數據管道運行狀態
- 數據庫連接狀態

#### 4.1.2 性能指標

- API 響應時間
- 前端頁面加載時間
- 數據管道吞吐量
- 系統資源使用率

#### 4.1.3 安全指標

- 依賴安全漏洞數量
- 代碼安全評分
- 配置安全狀態

### 4.2 警報機制

#### 4.2.1 警報觸發條件

- 服務健康檢查失敗
- 性能指標超閾值
- 安全漏洞發現
- 錯誤率超標

#### 4.2.2 通知方式

- GitHub Actions 通知
- Slack 通知（可配置）
- 郵件通知（可配置）

## 🛠️ 本地開發工具

### 5.1 npm 腳本

```json
{
  "ci:dev": "pnpm run quality:gate && pnpm run build && pnpm run test:ci",
  "ci:dev:quick": "pnpm run build && pnpm run test:unit",
  "ci:monitor": "pnpm run health:check && pnpm run monitor:dev",
  "deploy:dev:quick": "./scripts/deployment/deploy-dev-quick.sh"
}
```

### 5.2 部署腳本

#### 5.2.1 快速部署腳本

**文件位置**：`scripts/deployment/deploy-dev-quick.sh`

**功能**：

- 環境檢查
- 依賴安裝
- 可選的代碼品質檢查
- 應用構建
- 可選的測試執行
- 部署包創建
- 部署後檢查

**使用方式**：

```bash
# 基本快速部署
./scripts/deployment/deploy-dev-quick.sh

# 跳過測試
./scripts/deployment/deploy-dev-quick.sh --skip-tests

# 跳過品質檢查
./scripts/deployment/deploy-dev-quick.sh --skip-quality

# 強制部署
./scripts/deployment/deploy-dev-quick.sh --force

# 自定義部署說明
./scripts/deployment/deploy-dev-quick.sh --message "緊急修復"
```

## 🔍 故障排除

### 6.1 常見問題

#### 6.1.1 構建失敗

**問題**：TypeScript 編譯錯誤
**解決方案**：

1. 檢查類型定義
2. 修復類型錯誤
3. 使用 `--force` 參數跳過檢查

#### 6.1.2 測試失敗

**問題**：單元測試失敗
**解決方案**：

1. 修復測試代碼
2. 使用 `--skip-tests` 參數
3. 檢查測試環境配置

#### 6.1.3 部署失敗

**問題**：部署到開發環境失敗
**解決方案**：

1. 檢查環境配置
2. 驗證部署權限
3. 查看部署日誌

### 6.2 調試技巧

#### 6.2.1 查看工作流程日誌

1. 進入 GitHub Actions 頁面
2. 選擇失敗的工作流程
3. 查看具體步驟的日誌

#### 6.2.2 本地測試

```bash
# 本地運行 CI 流程
pnpm run ci:dev

# 本地運行快速 CI 流程
pnpm run ci:dev:quick

# 本地健康檢查
pnpm run health:check
```

## 📈 最佳實踐

### 7.1 開發流程

1. **分支管理**：使用 `feature/*` 分支進行功能開發
2. **代碼審查**：所有代碼必須通過 PR 審查
3. **測試覆蓋**：保持高測試覆蓋率
4. **文檔更新**：及時更新相關文檔

### 7.2 部署策略

1. **漸進式部署**：先部署到開發環境，驗證後再部署到生產環境
2. **回滾機制**：準備快速回滾方案
3. **監控告警**：設置適當的監控閾值
4. **日誌記錄**：記錄所有部署操作

### 7.3 性能優化

1. **構建優化**：使用緩存減少構建時間
2. **並行執行**：並行執行獨立的檢查步驟
3. **資源管理**：合理設置超時時間和資源限制

## 🔮 未來改進

### 8.1 短期目標

- [ ] 集成 Slack 通知
- [ ] 添加更多性能監控指標
- [ ] 實現自動回滾機制
- [ ] 優化構建緩存策略

### 8.2 長期目標

- [ ] 實現藍綠部署
- [ ] 添加機器學習異常檢測
- [ ] 集成 APM 工具
- [ ] 實現自動化性能測試

## 📚 相關文檔

- [CI/CD 流程設計](../ci-cd/CI_CD_PIPELINE_DESIGN.md)
- [部署指南](../../deployment/DEPLOYMENT_GUIDE.md)
- [開發部署指南](../../deployment/DEVELOPMENT_DEPLOYMENT.md)
- [測試策略](../testing/TESTING_STRATEGY.md)

## 🤝 貢獻指南

如果您發現本文檔有任何問題或需要改進的地方，請：

1. 創建 Issue 描述問題
2. 提交 Pull Request 進行修復
3. 參與相關討論

---

**最後更新**：2024-12-19  
**維護者**：Concept Stock Screener Team  
**版本**：1.0.0
