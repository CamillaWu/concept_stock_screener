# 🔄 跨平台開發指南

本指南提供在 macOS 和 Windows 上開發概念股篩選系統的完整說明，使用統一的 Node.js 腳本替代平台特定的 shell 腳本。

## 🚀 快速開始

### 1. 環境檢測
```bash
# 檢測系統資訊和必要工具
pnpm cross:info

# 檢查環境配置
pnpm env:detect
```

### 2. 環境設置
```bash
# 設置開發環境
pnpm env:setup

# 創建專案目錄結構
pnpm path:create
```

### 3. 安裝依賴
```bash
# 安裝專案依賴
pnpm cross:install

# 設置測試環境
pnpm test:setup
```

### 4. 啟動開發環境
```bash
# 啟動開發環境（API + Web）
pnpm dev

# 或分別啟動
pnpm api:dev
pnpm web:dev
```

## 🛠️ 跨平台工具說明

### Cross-Platform Runner (`cross-platform-runner.js`)
統一的腳本執行器，自動檢測平台並執行相應命令。

**主要功能：**
- 自動檢測作業系統
- 檢查必要工具（Node.js, npm, pnpm）
- 跨平台命令執行
- 開發環境管理

**使用命令：**
```bash
# 顯示系統資訊
pnpm cross:info

# 檢查必要工具
pnpm cross:check

# 安裝依賴
pnpm cross:install

# 啟動開發環境
pnpm cross:dev
```

### Environment Manager (`env-manager.js`)
環境變數和配置管理工具，自動調整平台特定設定。

**主要功能：**
- 檢測平台特性
- 創建和驗證環境文件
- 自動調整平台配置
- 環境變數驗證

**使用命令：**
```bash
# 檢測平台特性
pnpm env:detect

# 檢查環境文件
pnpm env:check

# 創建環境文件
pnpm env:create

# 驗證環境變數
pnpm env:validate

# 完整環境設置
pnpm env:setup
```

### Path Utils (`path-utils.js`)
路徑標準化工具，使用 `path.join()` 處理跨平台路徑問題。

**主要功能：**
- 路徑標準化
- 目錄創建和管理
- 專案結構管理
- 文件清理

**使用命令：**
```bash
# 顯示路徑資訊
pnpm path:info

# 創建專案目錄結構
pnpm path:create

# 清理專案文件
pnpm path:clean
```

### Cross-Platform Tester (`cross-platform-tester.js`)
跨平台測試配置和執行器，支援多種測試類型。

**主要功能：**
- 測試環境檢測
- 自動安裝測試依賴
- 多類型測試執行
- 測試報告生成

**使用命令：**
```bash
# 檢測測試環境
pnpm test:detect

# 設置測試環境
pnpm test:setup

# 運行所有測試
pnpm test:cross

# 運行特定測試
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:performance
```

## 🍎 macOS 特定說明

### 權限設置
```bash
# 給予腳本執行權限
chmod +x scripts/*.sh

# 檢查 Homebrew 安裝
brew --version
```

### 推薦工具
- **終端機**: iTerm2 或 Terminal.app
- **包管理器**: Homebrew
- **Node.js**: 使用 Homebrew 安裝

## 🪟 Windows 特定說明

### PowerShell 執行策略
```powershell
# 檢查執行策略
Get-ExecutionPolicy

# 設置執行策略（如果需要）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 推薦工具
- **終端機**: Windows Terminal 或 PowerShell
- **包管理器**: Chocolatey 或 Scoop
- **Node.js**: 從官網下載安裝

## 🔧 常見問題解決

### 1. 路徑分隔符問題
**問題**: Windows 使用 `\`，macOS/Linux 使用 `/`
**解決**: 使用 `path.join()` 自動處理

```javascript
const path = require('path');
const filePath = path.join('src', 'components', 'Button.tsx');
```

### 2. 環境變數差異
**問題**: 不同平台的環境變數設定方式不同
**解決**: 使用 `env-manager.js` 自動調整

```bash
pnpm env:setup
```

### 3. 腳本執行權限
**問題**: macOS 需要 `chmod +x`，Windows 需要執行策略
**解決**: 使用 Node.js 腳本替代 shell 腳本

```bash
# 替代 chmod +x scripts/*.sh
node scripts/cross-platform-runner.js dev
```

### 4. 套件管理器差異
**問題**: 不同平台使用不同的包管理器
**解決**: 統一使用 pnpm，自動檢測安裝

```bash
pnpm cross:check
pnpm cross:install
```

## 📋 開發工作流程

### 日常開發流程
1. **環境檢查**: `pnpm cross:info`
2. **依賴安裝**: `pnpm cross:install`
3. **環境設置**: `pnpm env:setup`
4. **啟動開發**: `pnpm dev`
5. **運行測試**: `pnpm test:cross`

### 新環境設置流程
1. **克隆專案**: `git clone <repository>`
2. **進入目錄**: `cd concept_stock_screener`
3. **環境檢測**: `pnpm cross:info`
4. **完整設置**: `pnpm env:setup && pnpm path:create`
5. **安裝依賴**: `pnpm cross:install`
6. **測試環境**: `pnpm test:setup`
7. **驗證設置**: `pnpm test:cross`

### 部署前檢查
1. **環境驗證**: `pnpm env:validate`
2. **路徑檢查**: `pnpm path:info`
3. **測試執行**: `pnpm test:cross`
4. **構建測試**: `pnpm build`

## 🚨 注意事項

### 安全性
- 不要將 `.env` 文件提交到版本控制
- 定期更新依賴套件
- 使用安全的環境變數管理

### 相容性
- 確保 Node.js 版本 >= 18.0.0
- 確保 pnpm 版本 >= 8.0.0
- 測試腳本在不同平台上的執行

### 維護
- 定期更新跨平台工具
- 監控測試結果和錯誤報告
- 根據新平台特性調整配置

## 📚 相關文檔

- [技術債務追蹤器](./TECHNICAL_DEBT_TRACKER.md)
- [macOS 使用指南](../scripts/MACOS_GUIDE.md)
- [Windows 使用指南](../scripts/WINDOWS_GUIDE.md)
- [快速開始指南](../scripts/QUICK_START_GUIDE.md)

## 🤝 貢獻指南

如果您發現跨平台相容性問題或有改進建議：

1. 檢查現有問題報告
2. 創建新的問題報告
3. 提交修復程式碼
4. 更新相關文檔

---

**最後更新**: 2024年12月
**維護者**: Concept Stock Screener Team
