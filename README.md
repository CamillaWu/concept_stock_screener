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
├── docs/             # 文檔
│   ├── deployment/   # 部署相關
│   └── guides/       # 使用指南
└── scripts/          # 部署腳本
```

## 🔗 相關文檔
- [部署指南](./docs/deployment/)
- [使用指南](./docs/guides/)
- [環境設定](./docs/guides/ENVIRONMENT_SETUP.md)
- [域名設定](./docs/deployment/DOMAIN_SETUP_GUIDE.md)
- [故障排除](./docs/guides/TROUBLESHOOTING_GUIDE.md)

## 🛠️ 技術棧
- **後端**: Cloudflare Workers + Hono + Gemini 2.5 Pro
- **前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **包管理**: pnpm + Workspaces
- **部署**: Cloudflare Workers + Vercel + GitHub Actions
- **CI/CD**: 自動化部署流程

## 📄 授權
MIT License
