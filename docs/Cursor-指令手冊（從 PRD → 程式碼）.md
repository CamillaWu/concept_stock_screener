# Cursor-指令手冊（從 PRD → 程式碼）

> 目的：把 `/docs` 裡的 PRD/功能規格書內容，直接餵給 Cursor，逐一生成對應元件與頁面。\
> 用法：每一節都包含「要建立的檔案、在 docs 選取哪一段、⌘K 時貼什麼指令」。

## 0\. 預備動作（只做一次）

- 專案結構：

```
vibe-demo/
├── docs/（放 PRD / 功能規格書 / Demo 部署手冊）
├── public/mock-data/（themes.json, stocks.json）
├── pages/index.js
├── pages/api/（analyzeHeat.js, themeSummary.js, stockAttribution.js）
└── components/（各功能元件）
```

- 在 Cursor 左側 **Files** 面板勾選 `/docs` 目錄，讓 Cursor 能讀文件。

- 若需要，新增 `.cursor/`[`rules.md`](rules.md)，把關鍵約束寫進去（簡短即可）。

---

## 1) 3.1 核心功能

### 3\.1.1｜雙模式搜尋框（Theme / Stock）

**檔案**：`components/SearchBar.js`\
**在 docs 選取**：**3\.1.1**\
**⌘K 指令**：

```
請根據我選取的 3.1.1 規格，建立 React 元件 SearchBar.js：
- 左側模式切換（主題 / 個股），點擊切換
- 中間輸入框，Enter 觸發搜尋
- props: { mode, onModeChange, onSearch, placeholder? }
- 使用 div/input/button，鍵盤可操作（Tab、Enter），加 aria-label
- 匯出預設元件並附最小用法註解
```

### 3\.1.2｜主題 → 個股（Theme-to-Stock 流）

**檔案**：`components/ThemeToStockList.js`\
**在 docs 選取**：**3\.1.2**\
**⌘K 指令**：

```
根據 3.1.2 規格，建立 ThemeToStockList.js：
- props: { themes, onSelectTheme, onSelectStock }
- Render 主題卡片：名稱、熱度條(占位即可)、代表性個股(最多3)
- 點主題→onSelectTheme(theme)；點個股→onSelectStock(stock)
- Loading/Empty 簡易狀態；附 mock 與用法註解
```

### 3\.1.3｜個股 → 主題（Stock-to-Theme 流）

**檔案**：`components/StockToThemePills.js`\
**在 docs 選取**：**3\.1.3**\
**⌘K 指令**：

```
根據 3.1.3 規格，建立 StockToThemePills.js：
- props: { themes, onSelectTheme }
- 以圓角 Pill 列出所屬主題（最多 5）；點擊→onSelectTheme(theme)
- 支援鍵盤操作與 aria-label；附最小用法
```

### 3\.1.4｜市場熱度指標（Heat Bar，AI 驅動）

**檔案**：`components/HeatBar.js`\
**在 docs 選取**：**3\.1.4**\
**⌘K 指令**：

```
根據 3.1.4 規格，建立 HeatBar.js：
- props: { themeName, score?, updatedAt?, fetchOnMount? = true }
- 若無 score：mount 時 POST /api/analyzeHeat { query: themeName } 取得 { heat, reason }
- 顯示 0~100 條狀漸層（藍→紅）與數值；hover Tooltip 顯示 {reason} 與 updatedAt
- Loading: 灰色 skeleton；Error: 顯示 "—" 與 title 提示
- 匯出元件並附在 Sidebar/DetailPanel 的使用範例註解
```

### 3\.1.5｜概念強度排名（Concept Strength，UI 佔位）

**檔案**：`components/ConceptStrength.js`\
**在 docs 選取**：**3\.1.5**\
**⌘K 指令**：

```
根據 3.1.5 規格，建立 ConceptStrength.js（UI 佔位）：
- props: { strengthScore?, dims? }；預設 dims 為市值佔比/漲幅貢獻/討論度（0~100 進度條）
- 無資料→顯示空狀態說明；可插入 DetailPanel；附 mock 與用法
```

### 3\.1.6｜個股歸因分析（Stock Attribution，AI 驅動）

**檔案**：`components/StockAttribution.js`\
**在 docs 選取**：**3\.1.6**\
**⌘K 指令**：

```
根據 3.1.6 規格，建立 StockAttribution.js：
- props: { stockId, stockName, currentTheme }
- 初次載入時 POST /api/stockAttribution { stock: `${stockName}(${stockId})`, theme: currentTheme }
- 顯示「入選原因」一句話 + 來源標籤('AI') + 時間
- Loading: 卡片骨架；Error: 重試按鈕；無資料：顯示空狀態
- 匯出元件；附在 StockPanel 的用法註解
```

---

## 2) 3.2 介面佈局與核心元件（UI）

### 3\.2.1｜三欄式佈局（Sidebar / Detail / Stock）

**檔案**：`pages/index.js`\
**在 docs 選取**：**3\.2.1**\
**⌘K 指令**：

```
根據 3.2.1 規格，重構 pages/index.js：
- flex 版面，左:中:右 ≈ 2:5:3
- 引入 <Sidebar /> <DetailPanel /> <StockPanel />
- 管理 selectedTheme, selectedStock；串接子元件的 onSelect*
- 內建最小 CSS，附註解說明可改成 CSS 模組
```

### 3\.2.2｜市場熱度指標（Heat Bar，UI 版）

**檔案**：`components/HeatBar.js`\
**在 docs 選取**：**3\.2.2**\
**⌘K 指令**：

```
根據 3.2.2 規格，完善 HeatBar.js（UI + AI）：
- props: { themeName, score?, updatedAt? }
- 無 score 時，POST /api/analyzeHeat { query: themeName }
- 條狀漸層、數值、Tooltip、Loading/Empty/Error 都要有
```

### 3\.2.3｜趨勢主題清單（Trending Themes）

**檔案**：`components/TrendingThemes.js`\
**在 docs 選取**：**3\.2.3**\
**⌘K 指令**：

```
根據 3.2.3 規格，建立 TrendingThemes.js：
- 讀 /public/mock-data/themes.json
- 卡片：主題名稱、<HeatBar themeName={...}/ >、代表性個股(最多3)
- 排序 Popular/Latest（前端排序即可）
- onSelectTheme/onSelectStock 回呼；三態狀態；附用法
```

### 3\.2.4｜主題分析面板（Detail Panel）

**檔案**：`components/DetailPanel.js`\
**在 docs 選取**：**3\.2.4**\
**⌘K 指令**：

```
根據 3.2.4 規格，建立 DetailPanel.js：
- props: { theme, onSelectStock }
- 區塊：標題+一句話摘要（POST /api/themeSummary）、<HeatBar>、<ConceptStrength>(假資料)、Top5 個股（點選回呼）、情緒區(占位)
- 無選取主題→顯示空狀態；各區塊 Loading/Empty/Error
```

### 3\.2.5｜個股詳情面板（Stock Detail Panel）

**檔案**：`components/StockPanel.js`\
**在 docs 選取**：**3\.2.5**\
**⌘K 指令**：

```
根據 3.2.5 規格，建立 StockPanel.js：
- props: { stock, theme, onSelectTheme? }
- 顯示：個股標題(名稱+代號)、所屬主題標籤(可回中欄)、基本概覽(占位)、入選原因(POST /api/stockAttribution)
- 三態狀態與重試；無選擇→空狀態
```

### 3\.2.6｜清單與面板狀態同步規則

**檔案**：`components/Sidebar.js`（容器，包 `TrendingThemes`）\
**在 docs 選取**：**3\.2.6**\
**⌘K 指令**：

```
根據 3.2.6 規格，建立 Sidebar.js（容器）：
- 渲染 <TrendingThemes onSelectTheme onSelectStock />
- 維持滾動位置（useRef + scrollTop 最小實作）
- 左欄固定寬度、可滾動樣式；狀態交給 pages/index.js 管理
```

### 3\.2.7｜排序與篩選規則（Sort & Filter）

**檔案**：`components/SortAndFilterBar.js`\
**在 docs 選取**：**3\.2.7**\
**⌘K 指令**：

```
根據 3.2.7 規格，建立 SortAndFilterBar.js：
- props: { sort, onSortChange, filters, onFiltersChange }
- 排序單選：Popular/Latest/Heat/Strength/ΔSentiment
- 篩選複選 Chips：收藏、異常、情緒轉正、情緒轉負；清除全部
- aria 屬性；示範在 TrendingThemes 的整合
```

### 3\.2.8｜響應式佈局與斷點

**檔案**：`styles/globals.css` 或 `components/AppLayout.css`\
**在 docs 選取**：**3\.2.8**\
**⌘K 指令**：

```
依 3.2.8 規範建立斷點 CSS：
- ≥1280 三欄；1024–1279 左+中；768–1023 單欄主內容；<768 手機分步
- 預留 Drawer class（先不實作邏輯）
- Skeleton 响應式占位 class
```

### 3\.2.9｜無障礙與鍵盤操作（A11y & Keyboard）

**檔案**：`components/KeyboardShortcuts.js` + `utils/aria.js`\
**在 docs 選取**：**3\.2.9**\
**⌘K 指令**：

```
根據 3.2.9 規格，建立 KeyboardShortcuts.js 與 utils/aria.js：
- 綁定 Ctrl/⌘+K 聚焦搜尋、ESC 關閉右欄、←→切換三欄、↑↓清單瀏覽
- aria 小工具：aria-label/aria-selected/role
- 在 Sidebar/DetailPanel/StockPanel 範例中示範掛載
```

---

## 3) API（Gemini 1.5 Flash）

**檔案**：`pages/api/analyzeHeat.js`\
**⌘K 指令**：

```
建立 /api/analyzeHeat，串接 Gemini 1.5 Flash：
- 輸入：{ query: themeName }
- 請模型回傳 JSON: { "heat": 0~100, "reason": "..." }
- 錯誤處理：fallback { heat: 50, reason: "mock" }
```

**檔案**：`pages/api/themeSummary.js`\
**⌘K 指令**：

```
建立 /api/themeSummary（簡短一句話摘要）：
- 輸入：{ query: themeName }
- 回傳：{ summary }
- 錯誤處理：fallback { summary: "mock 摘要" }
```

**檔案**：`pages/api/stockAttribution.js`\
**⌘K 指令**：

```
建立 /api/stockAttribution（個股歸因）：
- 輸入：{ stock, theme }
- 回傳：{ reason }
- 錯誤處理：fallback { reason: "mock 歸因理由" }
```

> Vercel 上設定環境變數：`GEMINI_API_KEY`

---

## 4) 整合頁面

**檔案**：`pages/index.js`\
**⌘K 指令**：

```
完成三欄接線：
- 管理 selectedTheme / selectedStock
- <Sidebar onSelectTheme onSelectStock />
- <DetailPanel theme onSelectStock />
- <StockPanel stock theme />
- 無選擇時顯示空狀態，避免白屏
```

---

## 5) 部署與驗收

**部署**：GitHub → Vercel（設定 `GEMINI_API_KEY`）\
**檢查清單**：

- 左欄主題卡片顯示 **AI 熱度條**

- 中欄主題摘要（AI）

- 右欄個股歸因（AI）

- Loading / Error / Empty 三態都有

- 手機寬度不崩版

- Demo 流程能對照 3.1\~3.3 規格