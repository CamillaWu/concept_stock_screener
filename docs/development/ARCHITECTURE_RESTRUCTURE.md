# 概念股篩選系統 - 架構重構文檔

## 項目概述

概念股篩選系統是一個基於 AI 的台股概念股自動化篩選平台，採用現代化的技術架構和開發流程。

## 架構重構進度

### ✅ 第一階段：架構重構 (100% 完成)

#### 1.1 Monorepo 結構重組
- [x] 建立 `packages/` 目錄結構
- [x] 重構 `types` 包
- [x] 重構 `ui` 包
- [x] 重構 `web` 應用
- [x] 重構 `api` 應用
- [x] 重構 `data-pipeline` 應用

#### 1.2 依賴管理優化
- [x] 統一使用 `pnpm` 作為包管理器
- [x] 建立工作區配置
- [x] 優化依賴安裝流程
- [x] 解決循環依賴問題

#### 1.3 構建流程重構
- [x] 修復 TypeScript 編譯錯誤
- [x] 修復 React 組件構建問題
- [x] 修復 API 構建問題
- [x] 建立統一的構建腳本

### ✅ 第二階段：跨平台開發腳本 (100% 完成)

#### 2.1 Windows 支援
- [x] 創建 PowerShell 腳本 (`scripts/quick-start-windows.ps1`)
- [x] 環境檢查和依賴安裝
- [x] 項目構建和測試執行

#### 2.2 macOS 支援
- [x] 創建 Bash 腳本 (`scripts/quick-start-macos.sh`)
- [x] 環境檢查和依賴安裝
- [x] 項目構建和測試執行

#### 2.3 跨平台腳本
- [x] 創建 Node.js 腳本 (`scripts/cross-platform-runner.js`)
- [x] 創建測試腳本 (`scripts/cross-platform-tester.js`)
- [x] 自動檢測操作系統
- [x] 統一命令介面

### 🔄 第三階段：測試流程建立 (90% 完成)

#### 3.1 測試架構設置
- [x] Jest 測試框架配置
- [x] Babel 轉換器配置 (支援 TypeScript + JSX)
- [x] 測試環境設置 (`jsdom`)
- [x] 測試專用 TypeScript 配置

#### 3.2 測試依賴安裝
- [x] `jest` - 測試框架
- [x] `@babel/preset-react` - JSX 支援
- [x] `@babel/preset-typescript` - TypeScript 支援
- [x] `@testing-library/react` - React 組件測試
- [x] `@testing-library/jest-dom` - DOM 匹配器
- [x] `@testing-library/user-event` - 用戶事件模擬

#### 3.3 測試文件創建
- [x] Button 組件測試 (22 個測試用例)
- [x] Input 組件測試 (30+ 個測試用例)
- [x] useApi Hook 測試 (20+ 個測試用例)
- [x] 測試設置文件 (`scripts/test-setup.js`)

#### 3.4 測試腳本配置
- [x] 單元測試腳本
- [x] 整合測試腳本
- [x] 端到端測試腳本
- [x] 覆蓋率報告腳本

#### 3.5 當前問題
- [ ] 修復 localStorage 模擬清理邏輯
- [ ] 完善測試設置文件
- [ ] 驗證所有測試用例執行

### ⏳ 第四階段：CI/CD 流程建立 (0% 完成)

#### 4.1 持續整合
- [ ] GitHub Actions 配置
- [ ] 自動化測試流程
- [ ] 代碼質量檢查
- [ ] 構建狀態監控

#### 4.2 持續部署
- [ ] 自動化部署腳本
- [ ] 環境配置管理
- [ ] 部署回滾機制
- [ ] 監控和日誌

### ⏳ 第五階段：部署配置 (0% 完成)

#### 5.1 生產環境配置
- [ ] 環境變數配置
- [ ] 數據庫配置
- [ ] 緩存配置
- [ ] 安全配置

#### 5.2 監控和維護
- [ ] 性能監控
- [ ] 錯誤追蹤
- [ ] 日誌管理
- [ ] 備份策略

## 技術架構

### 前端技術棧
- **框架**: React 18 + Next.js 14
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: React Hooks
- **測試**: Jest + Testing Library

### 後端技術棧
- **運行時**: Cloudflare Workers
- **語言**: TypeScript
- **路由**: itty-router
- **測試**: Jest

### 開發工具
- **包管理器**: pnpm
- **構建工具**: TypeScript Compiler
- **代碼質量**: ESLint + Prettier
- **測試框架**: Jest
- **版本控制**: Git

## 項目結構

```
concept_stock_screener/
├── packages/
│   ├── types/          # 共享類型定義
│   └── ui/             # 共享 UI 組件
├── apps/
│   ├── web/            # Next.js 前端應用
│   ├── api/            # Cloudflare Workers API
│   └── data-pipeline/  # 數據處理管道
├── scripts/            # 開發和部署腳本
├── docs/               # 項目文檔
└── package.json        # 工作區配置
```

## 開發流程

### 1. 環境設置
```bash
# 安裝依賴
pnpm install

# 構建所有包
pnpm build

# 運行測試
pnpm test
```

### 2. 跨平台開發
```bash
# Windows
./scripts/quick-start-windows.ps1

# macOS
./scripts/quick-start-macos.sh

# 通用腳本
node scripts/cross-platform-runner.js
```

### 3. 測試流程
```bash
# 單元測試
pnpm test:unit

# 整合測試
pnpm test:integration

# 端到端測試
pnpm test:e2e

# 覆蓋率報告
pnpm test:coverage
```

## 下一步計劃

### 短期目標 (1-2 天)
1. **完成測試流程** - 修復剩餘的測試問題
2. **驗證測試覆蓋率** - 確保所有組件都有足夠的測試
3. **建立測試文檔** - 編寫測試指南和最佳實踐

### 中期目標 (1 週)
1. **建立 CI/CD 流程** - GitHub Actions 自動化
2. **代碼質量檢查** - ESLint + Prettier 配置
3. **測試自動化** - 提交前自動運行測試

### 長期目標 (2-4 週)
1. **生產環境部署** - 配置生產環境
2. **監控和維護** - 建立監控系統
3. **性能優化** - 優化構建和運行時性能

## 注意事項

1. **依賴管理**: 所有依賴都應該通過 `pnpm` 安裝
2. **類型安全**: 嚴格使用 TypeScript，避免 `any` 類型
3. **測試覆蓋**: 新功能必須包含相應的測試
4. **跨平台兼容**: 確保所有腳本在 Windows 和 macOS 上都能運行
5. **文檔更新**: 代碼變更時同步更新相關文檔

## 聯繫信息

- **項目負責人**: Concept Stock Screener Team
- **技術支持**: 通過 GitHub Issues 報告問題
- **文檔維護**: 定期更新架構和開發文檔
