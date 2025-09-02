# 🪟 Windows 使用指南

本指南專門為 Windows 用戶設計，幫助您快速設置和運行概念股篩選系統的測試環境。

## 🚀 快速開始

### 方法一：一鍵快速啟動 (推薦)
```powershell
# 進入專案目錄
cd concept_stock_screener

# 一鍵完成所有設置
.\scripts\quick-start-windows.ps1 all
```

### 方法二：分步驟設置
```powershell
# 1. 設置環境
.\scripts\quick-start-windows.ps1 setup

# 2. 運行測試
.\scripts\test-runner.ps1 all
```

## 🛠️ 環境要求

### 系統要求
- **Windows 版本**: Windows 10 或更高版本
- **架構**: x64 (64位元)
- **記憶體**: 建議 8GB 或以上
- **磁碟空間**: 建議 2GB 可用空間

### 必要工具
- PowerShell 5.1+ 或 PowerShell Core 6+
- Node.js 16+ 和 npm
- Git (可選，但建議安裝)

## 📦 自動安裝

腳本會自動檢查以下工具：

### 1. PowerShell
```powershell
# 檢查版本
$PSVersionTable.PSVersion

# 如果版本過舊，可以從 Microsoft Store 或官網下載
```

### 2. Node.js
```powershell
# 檢查版本
node --version

# 如果未安裝，請從 https://nodejs.org 下載
```

### 3. npm
```powershell
# 檢查版本
npm --version

# 通常隨 Node.js 一起安裝
```

### 4. Git
```powershell
# 檢查版本
git --version

# 如果未安裝，請從 https://git-scm.com 下載
```

## 🧪 測試執行

### 基本測試命令
```powershell
# 運行所有測試
.\scripts\test-runner.ps1 all

# 運行特定類型測試
.\scripts\test-runner.ps1 unit
.\scripts\test-runner.ps1 integration
.\scripts\test-runner.ps1 e2e
.\scripts\test-runner.ps1 performance
```

### 測試報告
```powershell
# 生成覆蓋率報告
.\scripts\test-runner.ps1 coverage

# 生成測試報告
.\scripts\test-runner.ps1 report

# 清理測試文件
.\scripts\test-runner.ps1 clean
```

### 系統資訊
```powershell
# 顯示 Windows 系統資訊
.\scripts\test-runner.ps1 system-info
```

## 🔧 故障排除

### 常見問題

#### 1. 執行策略問題
```powershell
# 檢查執行策略
Get-ExecutionPolicy

# 如果太嚴格，設置為 RemoteSigned (需要管理員權限)
Set-ExecutionPolicy RemoteSigned

# 或為當前用戶設置
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. 路徑問題
```powershell
# 檢查當前目錄
Get-Location

# 確保在正確的專案目錄中
cd C:\Users\YourUsername\Documents\concept_stock_screener
```

#### 3. Node.js 路徑問題
```powershell
# 檢查 Node.js 是否在 PATH 中
Get-Command node

# 如果找不到，可能需要重新安裝 Node.js
```

#### 4. 權限問題
```powershell
# 以管理員身份運行 PowerShell
# 右鍵點擊 PowerShell，選擇「以系統管理員身分執行」
```

### 手動檢查依賴
```powershell
# 檢查所有依賴
.\scripts\test-runner.ps1 help

# 檢查系統狀態
.\scripts\test-runner.ps1 system-info
```

## 🪟 Windows 特色功能

### 1. PowerShell 優化
- 自動檢查 PowerShell 版本
- 執行策略檢查和建議
- 彩色輸出和表情符號支援

### 2. 系統資源監控
- 自動檢查記憶體使用情況
- 監控磁碟空間 (C 槽)
- 顯示處理器和系統資訊

### 3. 路徑處理
- 自動處理 Windows 路徑分隔符
- 支援相對路徑和絕對路徑
- 自動檢測腳本位置

### 4. 終端優化
- 支援 PowerShell 和 Windows Terminal
- 彩色輸出和狀態指示
- 進度條和錯誤處理

## 🎯 最佳實踐

### 1. 使用現代終端
- 推薦使用 Windows Terminal (可從 Microsoft Store 下載)
- 或使用 PowerShell 7+ (PowerShell Core)

### 2. 保持系統更新
- 定期更新 Windows 系統
- 保持 Node.js 最新版本

### 3. 使用包管理器
- 使用 npm 管理 Node.js 依賴
- 考慮使用 Chocolatey 或 Scoop 管理系統工具

### 4. 定期清理
```powershell
# 清理測試文件
.\scripts\test-runner.ps1 clean

# 清理 npm 快取
npm cache clean --force
```

## 📚 進階使用

### 1. 自定義測試配置
```powershell
# 編輯 Jest 配置
notepad scripts\tests\jest.config.js

# 編輯測試設置
notepad scripts\tests\setup.js
```

### 2. 整合 CI/CD
```powershell
# 在 GitHub Actions 中使用
# 參考 .github\workflows\ 目錄
```

### 3. 效能優化
```powershell
# 並行執行測試
npx jest --maxWorkers=4

# 監控記憶體使用
node --max-old-space-size=4096 .\scripts\test-runner.ps1 all
```

### 4. 環境變數
```powershell
# 設置環境變數
$env:NODE_ENV = "test"
$env:API_BASE_URL = "http://localhost:8787"

# 或創建 .env 文件
```

## 🆘 獲取幫助

### 1. 腳本幫助
```powershell
.\scripts\test-runner.ps1 help
.\scripts\quick-start-windows.ps1 help
```

### 2. 專案文檔
- 查看 `docs\` 目錄
- 閱讀 `README.md` 文件

### 3. 問題回報
- 檢查 GitHub Issues
- 查看錯誤日誌

### 4. Windows 特定資源
- [PowerShell 官方文檔](https://docs.microsoft.com/en-us/powershell/)
- [Node.js Windows 安裝指南](https://nodejs.org/en/download/)
- [Git for Windows](https://git-scm.com/download/win)

## 🔍 調試技巧

### 1. 啟用詳細輸出
```powershell
# 設置詳細輸出
$VerbosePreference = "Continue"

# 運行腳本
.\scripts\test-runner.ps1 all
```

### 2. 檢查錯誤
```powershell
# 檢查最後的錯誤
$Error[0]

# 檢查錯誤歷史
Get-History | Where-Object {$_.CommandLine -like "*error*"}
```

### 3. 測試單個組件
```powershell
# 只測試特定功能
.\scripts\test-runner.ps1 unit

# 使用 Jest 直接運行
npx jest tests\unit\utils.test.js
```

---

**最後更新**: 2025年1月15日  
**適用版本**: Windows 10+  
**腳本版本**: v2.0.0
