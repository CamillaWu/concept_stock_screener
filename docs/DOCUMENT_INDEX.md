# 文件索引

## 1. 核心文件概覽

### 1.1 入門與使用

| 文件名稱          | 路徑                               | 說明                             | 更新日期   |
| ----------------- | ---------------------------------- | -------------------------------- | ---------- |
| 快速開始指南      | `quick-start/QUICK_START_GUIDE.md` | 五分鐘帶你配置開發環境與啟動專案 | 2024-12-19 |
| 使用者手冊        | `user/USER_GUIDE.md`               | 系統功能與主要操作流程           | 2024-12-19 |
| 產品需求書（PRD） | `[PRD]概念股自動化篩選系統.md`     | 產品目標、功能規格與驗收標準     | 2024-12-19 |

### 1.2 架構與技術

| 文件名稱     | 路徑                                                   | 說明                              | 更新日期   |
| ------------ | ------------------------------------------------------ | --------------------------------- | ---------- |
| 架構調整記錄 | `development/architecture/ARCHITECTURE_RESTRUCTURE.md` | Monorepo 結構、依賴管理與重構歷程 | 2024-12-19 |
| 技術棧配置   | `development/architecture/TECH_STACK_CONFIGURATION.md` | 使用的框架、部署目標與設計考量    | 2024-12-19 |

### 1.3 功能與測試

| 文件名稱         | 路徑                                                 | 說明                             | 更新日期   |
| ---------------- | ---------------------------------------------------- | -------------------------------- | ---------- |
| 核心功能開發手冊 | `development/features/CORE_FEATURES_DEVELOPMENT.md`  | 主題/個股雙向搜尋與 UI 流程細節  | 2024-12-19 |
| RAG 系統整合     | `development/features/RAG_SYSTEM_INTEGRATION.md`     | 資料擷取、嵌入向量與 Gemini 互動 | 2024-12-19 |
| 測試策略         | `development/testing/TESTING_STRATEGY.md`            | 單元、整合、E2E 策略與品質門檻   | 2024-12-19 |
| 測試策略補充     | `development/testing/TESTING_STRATEGY_SUPPLEMENT.md` | 測試案例範例與工具設定補充       | 2024-12-19 |
| API 文件         | `api/API_DOCUMENTATION.md`                           | Cloudflare Workers API 端點說明  | 2024-12-19 |

### 1.4 平台支援

| 文件名稱         | 路徑                                                      | 說明                               | 更新日期   |
| ---------------- | --------------------------------------------------------- | ---------------------------------- | ---------- |
| 跨平台開發指引   | `development/platform/CROSS_PLATFORM_DEVELOPMENT.md`      | Windows / macOS 開發環境差異與調整 | 2024-12-19 |
| Windows 修復摘要 | `development/platform/WINDOWS_ENVIRONMENT_FIX_SUMMARY.md` | Windows 相容性修復紀錄             | 2024-12-19 |

### 1.5 CI/CD 與部署

| 文件名稱         | 路徑                                          | 說明                              | 更新日期   |
| ---------------- | --------------------------------------------- | --------------------------------- | ---------- |
| CI/CD 流程設計   | `development/ci-cd/CI_CD_PIPELINE_DESIGN.md`  | GitHub Actions 工作流程與環境配置 | 2024-12-19 |
| CI/CD 進度總結   | `development/ci-cd/CI_CD_PROGRESS_SUMMARY.md` | 建置里程碑與未來待辦追蹤          | 2024-12-19 |
| 部署指南（生產） | `deployment/DEPLOYMENT_GUIDE.md`              | 生產環境部署腳本與故障排除        | 2024-12-19 |
| 部署指南（開發） | `deployment/DEVELOPMENT_DEPLOYMENT.md`        | 開發/測試環境部署流程             | 2024-12-19 |
| CI/CD 注意事項   | `deployment/CI_CD_NOTES.md`                   | GitHub Actions 密鑰設定與疑難排解 | 2025-09-25 |

## 2. 其他參考

- `AGENTS.md`：協作者守則與操作提示。
- `DOCUMENT_STRUCTURE.md`：文件夾結構與維護說明。
- `docs/development/features/`：所有功能需求拆解與設計細節。
- `docs/development/ci-cd/reports/`：CI/CD 報表、稽核紀錄。

> 如有新文檔加入或路徑調整，請同步更新本索引，以確保團隊快速定位資訊。
