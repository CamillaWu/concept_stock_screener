# GitHub 環境配置完整指南

## 🎯 概述

本文檔提供概念股篩選系統 GitHub 環境配置的詳細步驟，包括截圖中所有選項的配置建議和實際操作指南。系統已簡化為兩個環境：開發環境和生產環境。

## 📸 截圖選項配置建議

### 1. 部署保護規則 (Deployment protection rules)

#### 1.1 Required reviewers (需要審閱者)

**❌ 單人項目不建議勾選**

**配置原因：**

- 單人項目不需要審閱流程
- 會增加不必要的部署延遲
- 簡化部署流程，提高效率

**建議設置：**

- 審閱者數量：0 人
- 審閱權限：無需審閱
- 直接部署：推送到對應分支自動部署

**配置步驟：**

1. 勾選 "Required reviewers"
2. 點擊 "Select people or teams"
3. 搜索並選擇審閱者
4. 設置為 "Required" 狀態

#### 1.2 Wait timer (等待計時器)

**❌ 單人項目不建議勾選**

**配置原因：**

- 單人項目不需要等待時間
- 會增加不必要的部署延遲
- 簡化部署流程，提高效率

**建議設置：**

- 等待時間：0 分鐘
- 計時器類型：無需等待
- 直接部署：推送到對應分支立即部署

**配置步驟：**

1. 勾選 "Wait timer"
2. 設置等待時間為 1-2 分鐘
3. 選擇計時器類型

#### 1.3 Enable custom rules with GitHub Apps (使用 GitHub Apps 啟用自定義規則)

**❌ 暫時不勾選**

**不勾選原因：**

- 這是預覽功能，可能不穩定
- 當前項目不需要複雜的自定義規則
- 避免增加配置複雜性

**未來考慮：**

- 當功能穩定後可以考慮啟用
- 用於實現特定的部署檢查邏輯

#### 1.4 Allow administrators to bypass configured protection rules (允許管理員繞過已配置的保護規則)

**✅ 保持勾選**

**保持勾選原因：**

- 緊急情況下管理員可以快速部署
- 避免保護規則過於嚴格導致部署阻塞
- 符合企業級部署的最佳實踐

### 2. 部署分支和標籤 (Deployment branches and tags)

#### 2.1 當前狀態：No restriction (無限制)

**❌ 建議更改**

**更改原因：**

- 提高安全性，只允許特定分支部署
- 避免意外分支的部署
- 符合環境隔離原則

#### 2.2 建議設置：Selected branches and tags (選定的分支和標籤)

**允許部署的分支：**

- `develop` - 主要開發分支
- `feature/*` - 功能開發分支
- `hotfix/*` - 緊急修復分支

**配置步驟：**

1. 點擊下拉菜單
2. 選擇 "Selected branches and tags"
3. 點擊 "Add rule"
4. 添加分支模式：
   - `develop`
   - `feature/*`
   - `hotfix/*`

### 3. 環境密鑰 (Environment secrets)

#### 3.1 需要配置的密鑰

**基礎環境配置：**

```bash
ENVIRONMENT=development
NODE_ENV=development
```

**服務 URL 配置：**

```bash
API_BASE_URL=https://dev-api.concept-stock-screener.com
WEB_BASE_URL=https://dev.concept-stock-screener.com
PIPELINE_BASE_URL=https://dev-pipeline.concept-stock-screener.com
```

**部署憑證：**

```bash
# Cloudflare Workers (API 服務)
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id

# Vercel (前端應用)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# 數據庫連接
DATABASE_URL=your_database_connection_string
```

#### 3.2 配置步驟

1. 點擊 "Add secret"
2. 輸入密鑰名稱（例如：`CLOUDFLARE_API_TOKEN`）
3. 輸入密鑰值
4. 點擊 "Add secret" 保存

## 🔧 實際配置步驟

### 步驟 1：訪問環境配置頁面

1. 進入 GitHub 倉庫
2. 點擊 "Settings" 標籤
3. 左側菜單選擇 "Environments"
4. 點擊 "development" 環境

### 步驟 2：配置部署保護規則

1. **Required reviewers**
   - 勾選 "Required reviewers"
   - 點擊 "Select people or teams"
   - 選擇審閱者並設置為 "Required"

2. **Wait timer**
   - 勾選 "Wait timer"
   - 設置等待時間為 1-2 分鐘

3. **Allow administrators to bypass**
   - 保持勾選狀態

### 步驟 3：配置部署分支限制

1. 點擊 "Deployment branches and tags"
2. 選擇 "Selected branches and tags"
3. 添加分支規則：
   - `develop`
   - `feature/*`
   - `hotfix/*`

### 步驟 4：配置環境密鑰

1. 點擊 "Environment secrets"
2. 添加所有必要的密鑰
3. 確保密鑰名稱與 CI/CD 工作流程中的引用一致

### 步驟 5：保存配置

1. 點擊 "Save protection rules"
2. 確認所有配置正確
3. 測試配置是否生效

## 🧪 配置驗證

### 1. 測試審閱者要求

1. 創建一個 Pull Request 到 `develop` 分支
2. 嘗試部署到開發環境
3. 確認需要審閱者批准

### 2. 測試分支限制

1. 從非允許分支創建部署
2. 確認部署被阻止
3. 從允許分支創建部署
4. 確認部署可以進行

### 3. 測試等待計時器

1. 觸發部署
2. 確認計時器開始計時
3. 等待計時器結束
4. 確認部署繼續進行

## ⚠️ 注意事項

### 1. 安全考慮

- 不要將敏感信息提交到代碼倉庫
- 定期輪換 API 令牌和密鑰
- 限制審閱者的權限範圍

### 2. 團隊協作

- 確保所有團隊成員了解新的部署流程
- 培訓審閱者的職責和流程
- 建立緊急部署的流程和聯繫方式

### 3. 監控和維護

- 監控部署成功率
- 追蹤審閱時間和效率
- 定期評估和優化配置

## 🔮 未來改進

### 1. 短期改進 (1-2 週)

- [ ] 集成 Slack 通知
- [ ] 添加部署狀態頁面
- [ ] 實現自動化回滾機制

### 2. 中期改進 (3-4 週)

- [ ] 添加更多部署檢查規則
- [ ] 實現部署性能監控
- [ ] 建立部署文檔自動化

### 3. 長期改進 (6-8 週)

- [ ] 實現藍綠部署
- [ ] 添加機器學習異常檢測
- [ ] 建立完整的部署分析系統

## 📚 相關文檔

- [CI/CD 流程設計](./CI_CD_PIPELINE_DESIGN.md)
- [開發環境 CI/CD 配置](./DEV_ENVIRONMENT_CI_CD.md)
- [部署指南](../../deployment/DEPLOYMENT_GUIDE.md)
- [開發部署指南](../../deployment/DEVELOPMENT_DEPLOYMENT.md)

## 🤝 需要幫助？

如果您在配置過程中遇到任何問題：

1. 檢查 GitHub 文檔
2. 查看項目 CI/CD 文檔
3. 聯繫項目維護者
4. 創建 GitHub Issue 描述問題

---

**最後更新**：2024-12-19  
**維護者**：Concept Stock Screener Team  
**版本**：1.0.0
