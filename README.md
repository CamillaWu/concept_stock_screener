# 概念股自動化篩選系統 (Concepts Radar)

一個基於 AI 的台股概念股探索引擎，提供「免登入、三秒內回應」的投資主題搜尋服務。

## 🎯 產品特色

- **AI 雙向搜尋**：主題到個股、個股到主題的智能分析
- **市場熱度指標**：視覺化的投資主題熱度評分
- **趨勢探索**：即時熱門主題列表與分析
- **免登入設計**：零門檻的即時使用體驗

## 🏗️ 技術架構

### 前端 (Frontend)
- **框架**：React + TypeScript + Vite
- **樣式**：Tailwind CSS
- **部署**：Vercel

### 後端 (Backend)
- **API**：Cloudflare Workers + Hono
- **AI 引擎**：Google Gemini 1.5-flash
- **快取**：Cloudflare KV
- **資料管道**：GitHub Actions + Python

### 專案結構
```
/concept_stock_screener
  /apps
    /web               # 前端（Vite + React + Tailwind）
    /api               # 後端（Cloudflare Workers + Hono）
  /packages
    /ui                # 共用 UI 組件
    /types             # 共用型別定義
  /docs                # 專案文件
  /mock                # 假資料
```

## 🚀 快速開始

### 前置需求
- Node.js v20 LTS
- pnpm (推薦) 或 npm
- Cloudflare 帳號 (Workers + KV)
- Vercel 帳號 (部署)

### 安裝與開發

1. **安裝依賴**
```bash
# 安裝 pnpm
npm i -g pnpm

# 安裝專案依賴
pnpm install
```

2. **啟動開發環境**
```bash
# 啟動前端開發伺服器
cd apps/web
pnpm dev

# 啟動後端 API (另開終端)
cd apps/api
pnpm dev
```

3. **環境變數設定**
```bash
# apps/web/.env.local
VITE_API_BASE=http://127.0.0.1:8787
VITE_CACHE_TTL=60

# apps/api/.env
GEMINI_API_KEY=your_gemini_api_key
```

## 📚 文件

- [產品需求文件 (PRD)](docs/[PRD]概念股自動化篩選系統.md)
- [市場需求文件 (MRD)](docs/[MRD]概念股自動化篩選系統.md)
- [功能與流程規格](docs/[功能&流程]概念股自動化篩選系統%20-%20功能細節與流程規格書.md)
- [實戰手冊](docs/vibe_coding_從_0_到demo超細實戰手冊_v_a_2025_08_27.md)

## 🎯 MVP 目標

- **使用者觸及**：7 天內累積不重複訪客 ≥ 300 人
- **核心功能使用率**：至少 50% 的訪客完成一次有效搜尋
- **系統效能**：API 平均回應時間 < 800 毫秒
- **系統穩定性**：自動化更新排程成功率 ≥ 95%

## 📄 授權

本專案採用 MIT 授權條款，詳見 [LICENSE](LICENSE) 檔案。
