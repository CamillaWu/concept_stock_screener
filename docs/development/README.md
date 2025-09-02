# 🛠️ 開發文檔中心

本目錄包含概念股篩選系統的開發指南、技術文檔和開發工具說明。

## 📋 目錄

### 🚀 開發指南
- **[跨平台開發指南](./CROSS_PLATFORM_GUIDE.md)** - 跨平台開發完整指南（推薦）
- **[API 文檔](./API_DOCUMENTATION.md)** - API 接口完整說明
- **[組件分析](./COMPONENT_ANALYSIS.md)** - UI 組件結構分析
- **[UI/UX 問題追蹤](./UI_UX_ISSUES.md)** - 用戶體驗問題記錄

### 🛠️ 開發工具
- **[Cursor 指令手冊](./Cursor-指令手冊（從 PRD → 程式碼）.md)** - AI 編程助手使用指南
- **[Vibe Coding 實戰手冊](./vibe_coding_從_0_到demo超細實戰手冊_v_a_2025_08_27.md)** - 實戰開發手冊

## 🎯 快速開始

### 新開發者
1. **閱讀跨平台指南**: [跨平台開發指南](./CROSS_PLATFORM_GUIDE.md)
2. **自動化設置**: 執行 `pnpm auto:setup`
3. **開始開發**: 運行 `pnpm dev`

### 進階開發者
1. **查看 API 文檔**: [API 文檔](./API_DOCUMENTATION.md)
2. **分析組件結構**: [組件分析](./COMPONENT_ANALYSIS.md)
3. **追蹤 UI/UX 問題**: [UI/UX 問題](./UI_UX_ISSUES.md)
4. **使用 AI 工具**: [Cursor 指令手冊](./Cursor-指令手冊（從 PRD → 程式碼）.md)

## 🔧 開發環境

### 環境要求
- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本

### 自動化設置
```bash
# 一鍵設置跨平台環境
pnpm auto:setup

# 啟動開發環境
pnpm dev
```

## 📚 技術文檔

### 架構設計
- **前端**: Next.js + React + TypeScript
- **後端**: Cloudflare Workers + Hono
- **資料庫**: Pinecone 向量資料庫
- **AI**: Google Gemini API

### 開發規範
- **代碼風格**: ESLint + Prettier
- **類型檢查**: TypeScript 嚴格模式
- **測試框架**: Jest + Testing Library
- **文檔格式**: Markdown + 中文

## 🔍 常見問題

### 跨平台問題
- 查看 [跨平台開發指南](./CROSS_PLATFORM_GUIDE.md)
- 使用自動化工具處理所有平台差異

### 開發問題
- 參考 [API 文檔](./API_DOCUMENTATION.md)
- 查看 [組件分析](./COMPONENT_ANALYSIS.md)

### 環境問題
- 執行 `pnpm auto:setup` 自動修復
- 查看 [故障排除指南](./CROSS_PLATFORM_GUIDE.md#故障排除)

### UI/UX 問題
- 查看 [UI/UX 問題追蹤](./UI_UX_ISSUES.md)
- 參考 [組件分析](./COMPONENT_ANALYSIS.md)

## 📝 文檔維護

### 更新原則
- 保持與代碼同步
- 記錄重要決策和變更
- 定期審查和更新

### 貢獻指南
- 新增文檔請更新此 README
- 使用統一的文檔模板
- 包含實用的代碼示例

---

**維護者**: Concept Stock Screener Team
**更新頻率**: 根據開發進度
**最後更新**: 2024年12月
