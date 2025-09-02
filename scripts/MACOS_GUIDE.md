# 🍎 macOS 使用指南

本指南專門為 macOS 用戶設計，幫助您快速設置和運行概念股篩選系統的測試環境。

## 🚀 快速開始

### 方法一：一鍵快速啟動 (推薦)
```bash
# 進入專案目錄
cd concept_stock_screener

# 一鍵完成所有設置
chmod +x scripts/quick-start-macos.sh
./scripts/quick-start-macos.sh
```

### 方法二：分步驟設置
```bash
# 1. 設置開發環境
chmod +x scripts/setup-macos.sh
./scripts/setup-macos.sh

# 2. 運行測試
chmod +x scripts/test-runner-mac.sh
./scripts/test-runner-mac.sh all
```

## 🛠️ 環境要求

### 系統要求
- **macOS 版本**: 10.15 (Catalina) 或更高版本
- **架構**: Intel 或 Apple Silicon (M1/M2/M3)
- **記憶體**: 建議 8GB 或以上
- **磁碟空間**: 建議 2GB 可用空間

### 必要工具
- Xcode Command Line Tools
- Homebrew (包管理器)
- Node.js 16+ 和 npm
- Git

## 📦 自動安裝

腳本會自動安裝以下工具：

### 1. Xcode Command Line Tools
```bash
# 自動檢測和安裝
xcode-select --install
```

### 2. Homebrew
```bash
# 自動安裝 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 3. Node.js
```bash
# 使用 Homebrew 安裝
brew install node
```

### 4. 開發工具
```bash
# 安裝常用開發工具
brew install wget curl jq tree
```

## 🧪 測試執行

### 基本測試命令
```bash
# 運行所有測試
./scripts/test-runner-mac.sh all

# 運行特定類型測試
./scripts/test-runner-mac.sh unit
./scripts/test-runner-mac.sh integration
./scripts/test-runner-mac.sh e2e
./scripts/test-runner-mac.sh performance
```

### 測試報告
```bash
# 生成覆蓋率報告
./scripts/test-runner-mac.sh coverage

# 生成測試報告
./scripts/test-runner-mac.sh report

# 清理測試文件
./scripts/test-runner-mac.sh clean
```

### 系統資訊
```bash
# 顯示 macOS 系統資訊
./scripts/test-runner-mac.sh macos
```

## 🔧 故障排除

### 常見問題

#### 1. 權限問題
```bash
# 設置腳本執行權限
chmod +x scripts/*.sh
```

#### 2. Homebrew 路徑問題
```bash
# 檢查 Homebrew 路徑
which brew

# 如果路徑不正確，重新設置
if [[ "$(uname -m)" == "arm64" ]]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/usr/local/bin/brew shellenv)"
fi
```

#### 3. Node.js 版本問題
```bash
# 檢查 Node.js 版本
node --version

# 如果版本過舊，升級
brew upgrade node
```

#### 4. Xcode Command Line Tools 問題
```bash
# 檢查是否已安裝
xcode-select -p

# 如果未安裝，手動安裝
xcode-select --install
```

### 手動檢查依賴
```bash
# 檢查所有依賴
./scripts/test-runner-mac.sh help

# 檢查系統狀態
./scripts/test-runner-mac.sh macos
```

## 📱 macOS 特色功能

### 1. 自動打開報告
- HTML 覆蓋率報告會自動在預設瀏覽器中打開
- 使用 `open` 命令，macOS 原生支援

### 2. 系統資源監控
- 自動檢查記憶體使用情況
- 監控磁碟空間
- 顯示處理器資訊

### 3. 架構適配
- 自動檢測 Intel 或 Apple Silicon
- 設置正確的 Homebrew 路徑
- 優化 Node.js 安裝

### 4. 終端優化
- 支援 macOS Terminal 和 iTerm2
- 彩色輸出和表情符號
- 進度條和狀態指示

## 🎯 最佳實踐

### 1. 使用 Terminal 應用
- 推薦使用 macOS 內建的 Terminal 應用
- 或使用 iTerm2 獲得更好的體驗

### 2. 保持系統更新
- 定期更新 macOS 系統
- 保持 Xcode Command Line Tools 最新

### 3. 使用 Homebrew 管理依賴
- 避免手動安裝 Node.js
- 使用 `brew update` 和 `brew upgrade` 保持工具最新

### 4. 定期清理
```bash
# 清理測試文件
./scripts/test-runner-mac.sh clean

# 清理 Homebrew 快取
brew cleanup
```

## 📚 進階使用

### 1. 自定義測試配置
```bash
# 編輯 Jest 配置
nano scripts/tests/jest.config.js

# 編輯測試設置
nano scripts/tests/setup.js
```

### 2. 整合 CI/CD
```bash
# 在 GitHub Actions 中使用
# 參考 .github/workflows/ 目錄
```

### 3. 效能優化
```bash
# 並行執行測試
npx jest --maxWorkers=4

# 監控記憶體使用
node --max-old-space-size=4096 scripts/test-runner-mac.sh all
```

## 🆘 獲取幫助

### 1. 腳本幫助
```bash
./scripts/test-runner-mac.sh help
./scripts/setup-macos.sh --help
```

### 2. 專案文檔
- 查看 `docs/` 目錄
- 閱讀 `README.md` 文件

### 3. 問題回報
- 檢查 GitHub Issues
- 查看錯誤日誌

---

**最後更新**: 2025年1月15日  
**適用版本**: macOS 10.15+  
**腳本版本**: v2.0.0
