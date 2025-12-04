# 概念股自動化篩選系統

智能篩選概念股，提供專業的投資分析工具，助您做出明智的投資決策。

## 🚀 快速開始

### 前置需求

- **Node.js** 18.0.0 或更高版本
- **pnpm** 8.0.0 或更高版本
- **Python** 3.11+ (用於數據管道)

### 一鍵設置

```bash
# 克隆專案
git clone <your-repo-url>
cd concept_stock_screener

# 一鍵設置開發環境
pnpm setup

# 啟動所有服務
pnpm start
```

### 手動設置

```bash
# 安裝依賴
pnpm install

# 構建基礎包
pnpm build:types
pnpm build:ui

# 啟動開發服務
pnpm dev:web      # 前端 (http://localhost:3000)
pnpm dev:api      # API (http://localhost:8787)
pnpm dev:pipeline # 數據管道 (http://localhost:8000)
```

> **注意**：首次在每台機器上安裝依賴後，請執行 scripts/setup/configure-pnpm-linker.sh (macOS/Linux) 或 scripts/setup/configure-pnpm-linker.ps1 (Windows) 讓 pnpm 使用 hoisted node-linker，避免 React 類型解析問題。

## 🏗️ 專案架構

```
concept_stock_screener/
├── apps/                    # 應用程式層
│   ├── web/                # Next.js 前端應用
│   ├── api/                # Cloudflare Workers API
│   └── data-pipeline/      # Python RAG 數據管道
├── packages/                # 共享包層
│   ├── types/              # 共享類型定義
│   └── ui/                 # 共享 UI 組件
├── docs-new/               # 新文檔結構
├── scripts/                # 開發和部署腳本
└── .github/                # GitHub 配置
```

## 🎯 核心功能

### 智能搜尋

- 支援股票代碼、名稱、產業等多維度搜尋
- 即時搜尋建議和自動完成
- 模糊搜尋和智能匹配

### 概念股分析

- 深入分析概念股產業鏈
- 相關股票關聯分析
- 投資機會和風險評估

### 即時數據

- 即時股價、成交量、市值等關鍵數據
- 歷史數據圖表和趨勢分析
- 市場動態監控

## 🛠️ 技術棧

### 前端

- **Next.js 14** - React 框架
- **React 18** - UI 庫
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架

### 後端

- **Cloudflare Workers** - 邊緣計算
- **TypeScript** - 類型安全
- **RESTful API** - 標準化接口

### 數據管道

- **Python 3.11+** - 數據處理
- **FastAPI** - Web 框架
- **LangChain** - AI 整合
- **RAG** - 檢索增強生成

## 📊 項目狀態

### 開發進度

- ✅ **架構重構**: Monorepo 結構建立完成
- ✅ **跨平台腳本**: Windows 和 macOS 支持完成
- ✅ **測試流程**: 70 個測試用例全部通過
- ✅ **開發環境**: ESLint、Prettier、Husky 配置完成
- ✅ **代碼質量**: ESLint 問題全部解決 (0 錯誤，0 警告)
- ⏳ **CI/CD 流程**: 準備開始建立
- ⏳ **部署配置**: 準備開始建立

### 代碼質量指標

- **ESLint 狀態**: ✅ 通過 (0 錯誤，0 警告)
- **測試覆蓋率**: 69.62% (目標: 70%+)
- **類型檢查**: ✅ 通過
- **代碼格式化**: ✅ 通過

## 📚 開發指南

### 添加新功能

1. **類型定義**：在 `packages/types/src/` 中添加新的接口
2. **UI 組件**：在 `packages/ui/src/components/` 中創建可重用組件
3. **API 端點**：在 `apps/api/src/handlers/` 中實現新的處理器
4. **前端頁面**：在 `apps/web/src/app/` 中創建新的頁面

### 開發流程

```bash
# 開發模式
pnpm dev:all

# 構建檢查
pnpm type-check
pnpm lint
pnpm test

# 生產構建
pnpm build
```

### 代碼規範

- 使用 TypeScript 嚴格模式
- 遵循 ESLint 和 Prettier 配置
- 組件使用函數式組件和 Hooks
- API 遵循 RESTful 設計原則

## 🌐 部署

### 開發環境

- 前端：http://localhost:3000
- API：http://localhost:8787
- 數據管道：http://localhost:8000

### 生產環境

- 前端：Vercel / Netlify
- API：Cloudflare Workers
- 數據管道：Docker + 雲端服務

## 📖 文檔

- [文檔中心](docs/) - 完整的項目文檔
- [架構設計](docs/development/ARCHITECTURE_RESTRUCTURE.md)
- [API 文檔](docs/api/)
- [部署指南](docs/deployment/)
- [用戶手冊](docs/user/)

## 🤝 貢獻

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 支援

如有問題或建議，請：

- 開啟 [Issue](../../issues)
- 聯繫開發團隊
- 查看 [文檔](docs-new/)

---

**概念股篩選系統** - 讓投資更智能，讓決策更明智 🚀
