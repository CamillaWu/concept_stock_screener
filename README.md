# 🎯 概念股自動化篩選系統

## 📋 專案概述
基於 AI 的台灣概念股篩選系統，使用 Gemini 2.5 Pro 進行智能分析。

## 🚀 快速開始

### 開發環境設置
```bash
# macOS 用戶
pnpm run setup:macos

# Windows 用戶
pnpm run setup:windows

# 快速開始 (macOS)
pnpm run quick:macos
```

### 開發命令
```bash
# 開發環境
pnpm dev

# 構建
pnpm build

# 測試
pnpm test

# 代碼檢查
pnpm lint
```

## 📁 專案結構
```
├── docs-new/         # 新的完整文檔體系
│   ├── development/  # 開發文檔
│   ├── deployment/   # 部署文檔
│   ├── quick-start/  # 快速開始指南
│   ├── progress/     # 進度追蹤
│   ├── reports/      # 報告文檔
│   ├── api/          # API 文檔
│   └── user/         # 用戶文檔
├── docs/             # 保留的核心文檔
│   ├── [PRD]概念股自動化篩選系統.md
│   └── archive/[功能&流程]概念股自動化篩選系統 - 功能細節與流程規格書.md
├── scripts/          # 跨平台腳本
├── data/             # 資料文件
└── env.example       # 環境配置範例
```

## 🔗 相關文檔

### 🚀 快速開始
- [快速開始指南](./docs-new/quick-start/QUICK_START_GUIDE.md)
- [部署指南](./docs-new/deployment/DEPLOYMENT_GUIDE.md)

### 📊 開發文檔
- [專案架構重構](./docs-new/development/ARCHITECTURE_RESTRUCTURE.md)
- [技術棧配置](./docs-new/development/TECH_STACK_CONFIGURATION.md)
- [核心功能開發](./docs-new/development/CORE_FEATURES_DEVELOPMENT.md)
- [跨平台開發支援](./docs-new/development/CROSS_PLATFORM_DEVELOPMENT.md)
- [CI/CD 流程設計](./docs-new/development/CI_CD_PIPELINE_DESIGN.md)
- [RAG 系統整合](./docs-new/development/RAG_SYSTEM_INTEGRATION.md)
- [測試策略](./docs-new/development/TESTING_STRATEGY.md)

### 📖 產品文檔
- [產品需求文檔](./docs/[PRD]概念股自動化篩選系統.md)
- [功能規格書](./docs/archive/[功能&流程]概念股自動化篩選系統 - 功能細節與流程規格書.md)
- [用戶使用指南](./docs-new/user/USER_GUIDE.md)
- [API 文檔](./docs-new/api/API_DOCUMENTATION.md)

### 📈 進度追蹤
- [開發進度追蹤](./docs-new/progress/DEVELOPMENT_PROGRESS_TRACKER.md)

## 🛠️ 技術棧
- **後端**: Cloudflare Workers + TypeScript + Gemini 2.5 Pro
- **前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **AI/RAG**: Python + FastAPI + LangChain + Pinecone
- **包管理**: pnpm
- **部署**: Cloudflare Workers + Vercel + GitHub Actions
- **CI/CD**: 雙環境自動化部署流程

## 🔄 重要說明
⚠️ **注意**: 此專案正在進行全面重構，舊的程式碼已被清理。
所有新的開發都基於 `docs-new/` 目錄中的完整文檔體系進行。

## 📄 授權
MIT License
