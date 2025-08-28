# 概念股自動化篩選系統

一個基於 AI 的台灣股市概念股篩選系統，使用 Google Gemini 1.5-flash 模型進行智能分析。

## 🚀 快速開始

### 前置需求

- Node.js 18+ 
- pnpm
- Google Gemini API Key
- Cloudflare 帳戶（用於 Workers 和 KV）

### 安裝步驟

1. **安裝依賴**
   ```bash
   pnpm install
   ```

2. **設定環境變數**
   ```bash
   cp env.example .env
   # 編輯 .env 檔案，填入您的 API Keys
   ```

3. **啟動開發伺服器**
   ```bash
   # 啟動 API 服務
   cd apps/api
   pnpm dev
   
   # 新開一個終端機，啟動前端服務
   cd apps/web
   pnpm dev
   ```

4. **開啟瀏覽器**
   - 前端：http://localhost:3000
   - API：http://localhost:8787

## 🏗️ 專案結構

```
concept_stock_screener/
├── apps/
│   ├── api/                 # Cloudflare Workers API
│   │   ├── src/
│   │   │   ├── index.ts     # API 入口點
│   │   │   └── services/    # AI 和快取服務
│   │   └── wrangler.toml    # Workers 配置
│   └── web/                 # Next.js 前端
│       ├── src/
│       │   ├── App.tsx      # 主要應用程式
│       │   ├── services/    # API 服務
│       │   ├── hooks/       # 自定義 Hooks
│       │   └── store/       # 狀態管理
│       └── next.config.js   # Next.js 配置
├── packages/
│   ├── types/               # 共享 TypeScript 類型
│   └── ui/                  # 共享 UI 組件
└── docs/                    # 專案文件
```

## 🔧 核心功能

### 雙模式搜尋引擎
- **主題到個股**：輸入投資主題，AI 分析相關股票
- **個股到主題**：輸入股票代號，AI 分析所屬概念

### AI 驅動分析
- 使用 Google Gemini 1.5-flash 模型
- 即時市場熱度分析
- 智能概念關聯性分析

### 高效能架構
- Cloudflare Workers 邊緣運算
- KV 快取系統
- 響應式 UI 設計

## 📊 API 端點

- `GET /trending` - 獲取熱門概念
- `GET /search?mode=theme&q=...` - 主題搜尋
- `GET /search?mode=stock&q=...` - 股票搜尋

## 🎨 UI 組件

### 核心組件
- `SearchBar` - 雙模式搜尋欄
- `HeatBar` - 市場熱度指標
- `ThemeCard` - 概念卡片
- `StockList` - 股票列表
- `TrendingList` - 熱門概念列表

### 佈局組件
- `Sidebar` - 側邊欄
- `DetailPanel` - 詳細面板
- `StockDetailPanel` - 股票詳細面板

### 工具組件
- `LoadingSkeleton` - 載入骨架屏
- `ErrorState` - 錯誤狀態
- `EmptyState` - 空狀態

## 🚀 部署

### 部署 API
```bash
cd apps/api
pnpm deploy
```

### 部署前端
```bash
cd apps/web
pnpm build
pnpm start
```

## 📝 開發指南

### 新增 UI 組件
1. 在 `packages/ui/src/components/` 建立組件
2. 在 `packages/ui/src/index.ts` 匯出
3. 在 `apps/web/src/App.tsx` 中使用

### 新增 API 端點
1. 在 `apps/api/src/index.ts` 新增路由
2. 在 `apps/api/src/services/` 新增服務
3. 更新 TypeScript 類型定義

## 🤝 貢獻

1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 發起 Pull Request

## 📄 授權

MIT License

## 🆘 支援

如有問題，請查看：
- [功能規格書](docs/[功能&流程]概念股自動化篩選系統%20-%20功能細節與流程規格書.md)
- [產品需求文件](docs/[PRD]概念股自動化篩選系統.md)
- [設定指南](SETUP.md)
