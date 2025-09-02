# 🚀 快速啟動指南

本指南提供跨平台的快速啟動方法，幫助您在不同作業系統上快速設置和運行概念股篩選系統的測試環境。

## 🎯 選擇您的平台

### 🍎 macOS 用戶
- 使用 `scripts/quick-start-macos.sh`
- 詳細指南：`scripts/MACOS_GUIDE.md`

### 🪟 Windows 用戶
- 使用 `scripts/quick-start-windows.ps1`
- 詳細指南：`scripts/WINDOWS_GUIDE.md`

### 🐧 Linux/Unix 用戶
- 使用 `scripts/test-runner.sh`
- 參考 macOS 指南進行調整

## 🚀 一鍵快速啟動

### macOS
```bash
# 進入專案目錄
cd concept_stock_screener

# 一鍵啟動
chmod +x scripts/quick-start-macos.sh
./scripts/quick-start-macos.sh
```

### Windows
```powershell
# 進入專案目錄
cd concept_stock_screener

# 一鍵啟動
.\scripts\quick-start-windows.ps1 all
```

### Linux/Unix
```bash
# 進入專案目錄
cd concept_stock_screener

# 一鍵啟動
chmod +x scripts/test-runner.sh
./scripts/test-runner.sh all
```

## 📋 快速啟動會自動完成

✅ **環境檢查**
- 檢查作業系統和版本
- 檢查必要工具 (Node.js, npm, Git)
- 檢查執行權限和策略

✅ **環境設置**
- 安裝開發工具
- 設置配置文件
- 配置路徑和環境變數

✅ **依賴安裝**
- 安裝 npm 套件
- 檢查版本相容性
- 設置測試環境

✅ **測試執行**
- 運行完整測試套件
- 生成測試報告
- 顯示覆蓋率資訊

✅ **系統資訊**
- 顯示硬體資訊
- 顯示軟體版本
- 提供後續步驟建議

## 🔧 手動設置 (可選)

如果您想手動控制每個步驟：

### 1. 安裝依賴
```bash
# 進入 scripts 目錄
cd scripts

# 安裝測試依賴
npm install
```

### 2. 運行測試
```bash
# 運行所有測試
npm test

# 或使用平台特定腳本
# macOS: ./test-runner-mac.sh all
# Windows: .\test-runner.ps1 all
# Linux: ./test-runner.sh all
```

### 3. 生成報告
```bash
# 生成覆蓋率報告
npm run test:coverage

# 生成測試報告
npm run test:report
```

## 🎯 測試類型

### 單元測試 (Unit Tests)
- **目標**: 測試個別函數和組件
- **覆蓋率目標**: 80%+
- **執行**: `npm run test:unit`

### 整合測試 (Integration Tests)
- **目標**: 測試 API 端點和服務整合
- **覆蓋率目標**: 70%+
- **執行**: `npm run test:integration`

### 端到端測試 (E2E Tests)
- **目標**: 測試完整用戶流程
- **覆蓋率目標**: 60%+
- **執行**: `npm run test:e2e`

### 效能測試 (Performance Tests)
- **目標**: 測試系統效能和負載能力
- **執行**: `npm run test:performance`

## 📊 測試覆蓋率目標

| 測試類型 | 目標覆蓋率 | 狀態 |
|---------|-----------|------|
| 單元測試 | 80%+ | 🚧 進行中 |
| 整合測試 | 70%+ | 🚧 進行中 |
| 端到端測試 | 60%+ | 🚧 進行中 |
| 效能測試 | 100% | ✅ 完成 |

## 🔍 故障排除

### 常見問題

#### 1. 權限問題
```bash
# macOS/Linux
chmod +x scripts/*.sh

# Windows
# 檢查 PowerShell 執行策略
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. 依賴問題
```bash
# 清理並重新安裝
rm -rf node_modules package-lock.json
npm install
```

#### 3. 路徑問題
```bash
# 確保在正確的目錄
pwd  # 應該顯示 .../concept_stock_screener
ls scripts/  # 應該看到腳本文件
```

### 獲取幫助

#### 腳本幫助
```bash
# macOS
./scripts/test-runner-mac.sh help

# Windows
.\scripts\test-runner.ps1 help

# Linux
./scripts/test-runner.sh help
```

#### 文檔
- 主文檔：`scripts/README.md`
- macOS 指南：`scripts/MACOS_GUIDE.md`
- Windows 指南：`scripts/WINDOWS_GUIDE.md`

## 🎉 完成後

成功完成快速啟動後，您可以：

1. **查看測試結果**
   - 檢查終端輸出
   - 查看生成的報告文件

2. **開始開發**
   - 編輯測試文件
   - 添加新的測試用例
   - 修改測試配置

3. **持續集成**
   - 設置 CI/CD 流程
   - 自動化測試執行
   - 監控測試覆蓋率

## 📚 下一步

- 📖 閱讀詳細的平台特定指南
- 🧪 了解測試策略和最佳實踐
- 🔧 自定義測試配置
- 🚀 整合到您的開發工作流程

---

**最後更新**: 2025年1月15日  
**適用平台**: macOS, Windows, Linux  
**腳本版本**: v2.0.0
