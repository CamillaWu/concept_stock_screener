# Scripts 資料夾

本資料夾包含概念股篩選系統的各種腳本和工具，已重新組織以提高可維護性和測試覆蓋率。

## 📁 資料夾結構

```
scripts/
├── tests/                    # 測試腳本
│   ├── unit/                # 單元測試
│   ├── integration/         # 整合測試
│   ├── e2e/                # 端到端測試
│   └── performance/         # 效能測試
├── deployment/              # 部署腳本
│   ├── cloudflare/         # Cloudflare Workers 部署
│   ├── vercel/             # Vercel 部署
│   └── scripts/            # 通用部署腳本
├── development/             # 開發工具
│   ├── environment/        # 環境配置
│   ├── rag/                # RAG 相關工具
│   └── utilities/          # 通用工具
├── maintenance/             # 維護腳本
│   ├── cleanup/            # 清理腳本
│   └── monitoring/         # 監控腳本
└── legacy/                  # 舊版腳本（已歸檔）
```

## 🧪 測試策略

### 1. 單元測試 (Unit Tests)
- **目標**: 測試個別函數和組件的功能
- **覆蓋率目標**: 80%+
- **工具**: Jest + TypeScript
- **執行**: `pnpm test:unit`

### 2. 整合測試 (Integration Tests)
- **目標**: 測試 API 端點和服務整合
- **覆蓋率目標**: 70%+
- **工具**: Jest + Supertest
- **執行**: `pnpm test:integration`

### 3. 端到端測試 (E2E Tests)
- **目標**: 測試完整用戶流程
- **覆蓋率目標**: 60%+
- **工具**: Playwright
- **執行**: `pnpm test:e2e`

### 4. 效能測試 (Performance Tests)
- **目標**: 測試系統效能和負載能力
- **工具**: 自定義效能測試腳本
- **執行**: `pnpm test:performance`

## 🚀 快速開始

### 安裝依賴
```bash
pnpm install
```

### 執行所有測試
```bash
pnpm test
```

### 執行特定測試類型
```bash
pnpm test:unit          # 單元測試
pnpm test:integration   # 整合測試
pnpm test:e2e          # 端到端測試
pnpm test:performance  # 效能測試
```

### 生成測試報告
```bash
pnpm test:coverage      # 生成覆蓋率報告
pnpm test:report        # 生成詳細測試報告
```

## 🍎 macOS 特定功能

### 環境設置
```bash
# 設置 macOS 開發環境
chmod +x scripts/setup-macos.sh
./scripts/setup-macos.sh
```

### 測試執行
```bash
# 使用 macOS 優化腳本
chmod +x scripts/test-runner-mac.sh
./scripts/test-runner-mac.sh all

# 查看幫助
./scripts/test-runner-mac.sh help

# 顯示 macOS 系統資訊
./scripts/test-runner-mac.sh macos
```

### macOS 特色功能
- 🚀 自動安裝 Xcode Command Line Tools
- 🍺 Homebrew 依賴管理
- 📱 自動打開 HTML 覆蓋率報告
- 💻 系統資源檢查 (記憶體、磁碟空間)
- 🔧 Apple Silicon 和 Intel 架構支援

## 🪟 Windows 特定功能

### 環境設置
```powershell
# 設置 Windows 開發環境
.\scripts\quick-start-windows.ps1 setup
```

### 測試執行
```powershell
# 使用 Windows 優化腳本
.\scripts\test-runner.ps1 all

# 查看幫助
.\scripts\test-runner.ps1 help

# 顯示 Windows 系統資訊
.\scripts\test-runner.ps1 system-info
```

### Windows 特色功能
- 🔧 PowerShell 執行策略檢查和建議
- 💻 Windows 系統資訊顯示 (記憶體、磁碟、處理器)
- 📁 自動路徑處理和分隔符轉換
- 🎨 彩色輸出和表情符號支援
- 🚀 一鍵快速啟動腳本

### 🚀 一鍵快速啟動

**macOS**
```bash
# 一鍵完成環境設置和測試執行
chmod +x scripts/quick-start-macos.sh
./scripts/quick-start-macos.sh
```

**Windows**
```powershell
# 一鍵完成環境設置和測試執行
.\scripts\quick-start-windows.ps1 all
```

這些腳本會自動：
1. 檢查和設置腳本權限
2. 設置開發環境 (macOS/Windows)
3. 安裝測試依賴
4. 運行完整測試套件
5. 生成測試報告

## 📊 測試覆蓋率目標

| 測試類型 | 當前覆蓋率 | 目標覆蓋率 | 狀態 |
|---------|-----------|-----------|------|
| 單元測試 | 0% | 80% | 🚧 進行中 |
| 整合測試 | 0% | 70% | 🚧 進行中 |
| 端到端測試 | 0% | 60% | 🚧 進行中 |
| 效能測試 | 100% | 100% | ✅ 完成 |

## 🔧 腳本分類

### 測試腳本 (tests/)
- `unit/` - 單元測試
- `integration/` - 整合測試
- `e2e/` - 端到端測試
- `performance/` - 效能測試

### 部署腳本 (deployment/)
- `cloudflare/` - Cloudflare Workers 部署
- `vercel/` - Vercel 部署
- `scripts/` - 通用部署腳本

### 開發工具 (development/)
- `environment/` - 環境配置管理
- `rag/` - RAG 系統工具
- `utilities/` - 通用開發工具

### 維護腳本 (maintenance/)
- `cleanup/` - 系統清理
- `monitoring/` - 系統監控

## 📝 腳本命名規範

- **測試腳本**: `test-*.js`
- **部署腳本**: `deploy-*.sh` 或 `deploy-*.ps1`
- **工具腳本**: `*-tool.js` 或 `*-manager.js`
- **配置腳本**: `config-*.js` 或 `setup-*.sh`

## ⚠️ 注意事項

1. **環境變數**: 執行腳本前請確保環境變數已正確設定
2. **權限**: 某些腳本可能需要管理員權限
3. **依賴**: 確保所有必要的依賴已安裝
4. **備份**: 執行破壞性操作前請備份重要資料

## 🔄 遷移指南

舊版腳本已移至 `legacy/` 資料夾，如需使用請參考對應的遷移說明。

---

**最後更新**: 2025年1月15日
**版本**: v2.0.0
