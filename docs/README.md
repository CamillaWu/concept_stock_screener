# 概念股篩選系統 - 項目文檔

歡迎來到概念股自動化篩選系統的項目文檔！本目錄包含了項目的完整文檔，幫助您了解系統架構、開發進度和使用方法。

## 📚 文檔結構

### 🚀 快速開始

- **[快速開始指南](quick-start/QUICK_START_GUIDE.md)** - 5分鐘內啟動項目
- **[用戶手冊](user/USER_GUIDE.md)** - 系統功能和使用說明

### 🏗️ 開發文檔

- **[架構設計](development/architecture/ARCHITECTURE_RESTRUCTURE.md)** - 系統架構和設計原則
- **[技術棧配置](development/architecture/TECH_STACK_CONFIGURATION.md)** - 開發環境和工具配置
- **[開發任務](development/DEVELOPMENT_TASKS.md)** - 開發任務清單和進度

### 🔧 技術實現

- **[核心功能開發](development/features/CORE_FEATURES_DEVELOPMENT.md)** - 主要功能實現詳情
- **[RAG 系統整合](development/features/RAG_SYSTEM_INTEGRATION.md)** - AI 檢索增強生成系統
- **[測試策略](development/testing/TESTING_STRATEGY.md)** - 測試方法和覆蓋率

### 🌐 跨平台開發

- **[跨平台開發支援](development/platform/CROSS_PLATFORM_DEVELOPMENT.md)** - Windows 和 macOS 環境配置
- **[Windows 環境修復](development/platform/WINDOWS_ENVIRONMENT_FIX_SUMMARY.md)** - 環境問題解決記錄

### 🔄 流程和部署

- **[CI/CD 流程設計](development/ci-cd/CI_CD_PIPELINE_DESIGN.md)** - 持續整合和部署流程
- **[CI/CD 進度總結](development/ci-cd/CI_CD_PROGRESS_SUMMARY.md)** - 建制進度和完成狀態
- **[CI/CD 工作注意事項](deployment/CI_CD_NOTES.md)** - GitHub Actions 密鑰設定與疑難排解筆記
- **[部署指南](deployment/DEPLOYMENT_GUIDE.md)** - 生產環境部署說明
- **[開發環境部署](deployment/DEVELOPMENT_DEPLOYMENT.md)** - 本地開發環境部署

### 📡 API 文檔

- **[API 文檔](api/API_DOCUMENTATION.md)** - 完整的 API 接口說明

### 📊 項目管理

- **[進度追蹤](development/PROJECT_PROGRESS_TRACKER.md)** - 開發進度追蹤
- **[任務追蹤](development/DEVELOPMENT_TASKS.md)** - 開發任務清單和進度
- **[修改協調](development/MODIFICATION_COORDINATION.md)** - 代碼修改協調流程

### 🐛 問題和修復

- **[技術問題](development/issues/TECHNICAL_ISSUES.md)** - 已知技術問題和解決方案
- **[ESLint 修復總結](development/issues/ESLINT_FIX_SUMMARY.md)** - 代碼質量問題修復記錄

## 🔄 進度追蹤整合

為了避免進度信息散落在多個文件中，我們已經將所有進度追蹤相關的內容整合到以下文件中：

1. **PROJECT_PROGRESS_TRACKER.md** - 主要進度概覽和監控
2. **DEVELOPMENT_TASKS.md** - 詳細的開發任務清單
3. **TECHNICAL_ISSUES.md** - 技術問題追蹤
4. **MODIFICATION_COORDINATION.md** - 團隊變更協調流程

這樣的分拆結構讓每個文件都有明確的職責，便於維護和查找信息。

## 📖 如何使用這些文檔

### 🆕 新加入的開發者

1. 從 **QUICK_START_GUIDE.md** 開始，了解如何設置開發環境
2. 閱讀 **PRD** 了解產品需求和目標
3. 查看 **PROJECT_PROGRESS_TRACKER.md** 了解當前開發狀態
4. 參考 **TECH_STACK_CONFIGURATION.md** 了解技術選擇

### 🔍 查找特定信息

- **進度狀態**: 查看 **PROJECT_PROGRESS_TRACKER.md**
- **任務清單**: 查看 **DEVELOPMENT_TASKS.md**
- **變更協調**: 查看 **MODIFICATION_COORDINATION.md**
- **技術問題**: 查看 **TECHNICAL_ISSUES.md**
- **API 文檔**: 查看 **API_DOCUMENTATION.md**

### 📝 更新文檔

當您更新代碼或進度時，請同步更新相關的文檔：

- 代碼變更 → 更新相關的技術文檔
- 進度更新 → 更新 **PROJECT_PROGRESS_TRACKER.md**
- 新任務 → 更新 **DEVELOPMENT_TASKS.md**
- 解決問題 → 更新 **TECHNICAL_ISSUES.md**

## 🎯 項目狀態

**當前階段**: 開發環境配置完成，準備進入 CI/CD 階段
**主要目標**: 建立 CI/CD 流程，修復 ESLint 錯誤，準備生產部署
**負責人**: 您一個人

---

_最後更新: 2024-12-19_
_文檔維護者: 您一個人_
