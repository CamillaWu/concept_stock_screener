# 🎯 概念股自動化篩選系統

## 📋 專案概述
基於 AI 的台灣概念股篩選系統，使用 Gemini 2.5 Pro 進行智能分析。

## 🚀 快速開始

### 開發環境
```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

### 部署
```bash
# 部署 API
pnpm api:deploy

# 構建前端
pnpm web:build
```

## 📁 專案結構
```
├── apps/
│   ├── api/          # Cloudflare Workers API
│   └── web/          # Next.js 前端應用
├── packages/
│   ├── types/        # 共享類型定義
│   └── ui/           # UI 組件庫
├── docs/             # 文檔目錄
│   ├── development/  # 開發工具和指南
│   ├── reports/      # 完成報告
│   └── archive/      # 歷史文檔
├── scripts/          # 部署和工具腳本
├── data/             # 資料文件
└── mock/             # 模擬資料
```

## 🔗 相關文檔

### 🚀 快速開始
- [快速開始指南](./docs/QUICK_START_GUIDE.md)
- [部署指南](./docs/DEPLOYMENT_GUIDE.md)

### 📊 專案狀態
- [任務進度與交接](./docs/TASK_PROGRESS_AND_HANDOVER.md)
- [技術債務追蹤](./docs/TECHNICAL_DEBT_TRACKER.md)
- [專案進度總結](./docs/PROGRESS_SUMMARY.md)

### 🔧 技術文檔
- [API 文檔](./docs/API_DOCUMENTATION.md)
- [組件分析](./docs/COMPONENT_ANALYSIS.md)
- [Pinecone 設置指南](./docs/PINECONE_LOADING_GUIDE.md)

### 📖 產品文檔
- [產品需求文檔](./docs/[PRD]概念股自動化篩選系統.md)

### 🐛 問題追蹤
- [UI/UX 問題追蹤](./docs/UI_UX_ISSUES.md)

## 🛠️ 技術棧
- **後端**: Cloudflare Workers + Hono + Gemini 2.5 Pro
- **前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **包管理**: pnpm + Workspaces
- **部署**: Cloudflare Workers + Vercel + GitHub Actions
- **CI/CD**: 自動化部署流程

## 📄 授權
MIT License
