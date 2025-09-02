# 🚀 快速開始指南

歡迎使用概念股自動化篩選系統！本指南將幫助您快速設置開發環境並開始開發。

## 📋 目錄

- **[快速開始指南](./QUICK_START_GUIDE.md)** - 傳統的逐步設置指南
- **[跨平台開發指南](../development/CROSS_PLATFORM_GUIDE.md)** - 跨平台開發完整指南

## 🎯 推薦路徑

### 🚀 新用戶（強烈推薦）
1. **自動化設置** - 執行 `pnpm auto:setup`
2. **開始開發** - 運行 `pnpm dev`
3. **參考文檔** - 查看 [跨平台開發指南](../development/CROSS_PLATFORM_GUIDE.md)

### 🔧 進階用戶
1. **手動設置** - 參考 [快速開始指南](./QUICK_START_GUIDE.md)
2. **自定義配置** - 根據需求調整環境
3. **深入開發** - 查看 [開發文檔](../development/README.md)

## ⚡ 5分鐘快速開始

```bash
# 1. 克隆專案
git clone <repository-url>
cd concept_stock_screener

# 2. 自動設置環境（推薦）
pnpm auto:setup

# 3. 啟動開發環境
pnpm dev
```

## 🛠️ 環境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Git**: 最新版本
- **作業系統**: Windows 10+, macOS 10.15+, Linux

## 🤖 自動化功能

### ✅ 完全自動處理
- **平台檢測**: 自動識別 macOS/Windows/Linux
- **工具安裝**: 自動安裝缺少的 Node.js、pnpm、Git
- **環境配置**: 自動創建 .env 文件並調整平台設定
- **路徑處理**: 自動處理路徑分隔符差異
- **依賴管理**: 自動安裝專案依賴
- **目錄結構**: 自動創建標準專案目錄
- **測試環境**: 自動設置 Jest 測試環境
- **權限處理**: 自動處理不同平台的權限問題

### 🎯 智能平台適配
- **macOS**: 自動使用 Homebrew 安裝工具
- **Windows**: 自動調整 PowerShell 執行策略
- **Linux**: 自動使用系統包管理器

## 🔍 常見問題

### 設置失敗怎麼辦？
1. 檢查 Node.js 版本
2. 手動安裝 pnpm: `npm install -g pnpm`
3. 重新運行: `pnpm auto:setup`

### 跨平台問題？
- 查看 [跨平台開發指南](../development/CROSS_PLATFORM_GUIDE.md)
- 使用自動化工具處理所有平台差異

### 需要幫助？
- 查看 [故障排除指南](../development/CROSS_PLATFORM_GUIDE.md#故障排除)
- 檢查 [技術債務追蹤](../progress/TECHNICAL_DEBT_TRACKER.md)

## 📱 跨平台工作流程

### 🍎 macOS 用戶
1. 執行 `pnpm auto:setup`
2. 系統自動檢測並安裝 Homebrew
3. 自動安裝 pnpm 和其他工具
4. 自動設置環境變數和路徑
5. 完成！直接使用 `pnpm dev`

### 🪟 Windows 用戶
1. 執行 `pnpm auto:setup`
2. 系統自動檢測 PowerShell 執行策略
3. 自動安裝 pnpm 和其他工具
4. 自動調整路徑分隔符
5. 完成！直接使用 `pnpm dev`

---

**提示**: 強烈建議使用自動化設置工具，它會自動處理所有跨平台問題！
**維護者**: Concept Stock Screener Team
**最後更新**: 2024年12月
