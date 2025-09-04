# 智能 CI/CD 監控系統

## 概述

智能 CI/CD 監控系統是一個自動化的監控和修復解決方案，能夠：

- 🔍 **自動監控** CI/CD 狀態
- 🧠 **智能分析** 失敗原因
- 🔧 **自動修復** 常見問題
- 📊 **實時統計** 監控數據
- 🚨 **智能通知** 問題狀態

## 系統組件

### 1. 智能監控腳本 (`scripts/smart-monitor.sh`)

**功能**：

- 定期檢查 CI/CD 狀態
- 自動分析失敗原因
- 提供修復建議
- 統計成功/失敗率

**使用方法**：

```bash
# 啟動智能監控
./scripts/smart-monitor.sh

# 監控會在後台運行，自動分析問題
```

**特點**：

- 🎯 **智能分析**：自動識別常見錯誤模式
- 📈 **實時統計**：追蹤成功率和失敗趨勢
- 🛑 **自動停止**：連續失敗達到限制時自動停止
- 💤 **智能等待**：成功後延長檢查間隔

### 2. 自動修復腳本 (`scripts/auto-fix.sh`)

**功能**：

- 自動修復 Node.js 版本問題
- 修復 pnpm 依賴問題
- 修復 wrangler 配置問題
- 修復測試和安全問題
- 自動提交修復

**使用方法**：

```bash
# 運行自動修復
./scripts/auto-fix.sh

# 腳本會自動檢測並修復問題
```

**修復能力**：

- 🔧 **Node.js 版本**：自動更新到 v20
- 📦 **pnpm 問題**：清理緩存、重新安裝
- ⚙️ **wrangler 配置**：檢查並修復配置
- 🧪 **測試問題**：運行測試檢查
- 🔒 **安全漏洞**：自動修復依賴漏洞
- 🏗️ **構建問題**：嘗試重新構建

### 3. 監控配置 (`scripts/monitor-config.sh`)

**功能**：

- 配置監控參數
- 設置通知選項
- 管理自動修復選項
- 驗證配置有效性

**使用方法**：

```bash
# 顯示當前配置
./scripts/monitor-config.sh show

# 驗證配置
./scripts/monitor-config.sh validate

# 初始化配置
./scripts/monitor-config.sh init
```

## 配置選項

### 監控配置

```bash
export MONITOR_REPO="CamillaWu/concept_stock_screener"
export MONITOR_BRANCH="develop"
export MONITOR_INTERVAL=60          # 檢查間隔（秒）
export MAX_CONSECUTIVE_FAILURES=3    # 最大連續失敗次數
export SUCCESS_WAIT_TIME=300        # 成功後等待時間（秒）
```

### 自動修復配置

```bash
export AUTO_FIX_ENABLED=true        # 啟用自動修復
export AUTO_FIX_NODE_VERSION=true   # 自動修復 Node.js 版本
export AUTO_FIX_PNPM=true           # 自動修復 pnpm 問題
export AUTO_FIX_WRANGLER=true       # 自動修復 wrangler 配置
export AUTO_FIX_TESTS=true          # 自動修復測試問題
export AUTO_FIX_SECURITY=true       # 自動修復安全漏洞
export AUTO_FIX_BUILD=true          # 自動修復構建問題
```

## 使用流程

### 1. 初始設置

```bash
# 1. 檢查依賴
brew install gh jq

# 2. GitHub 認證
gh auth login

# 3. 初始化配置
./scripts/monitor-config.sh init
```

### 2. 啟動監控

```bash
# 啟動智能監控
./scripts/smart-monitor.sh
```

### 3. 自動修復

```bash
# 當監控發現問題時，運行自動修復
./scripts/auto-fix.sh
```

### 4. 監控配置

```bash
# 查看當前配置
./scripts/monitor-config.sh show

# 驗證配置
./scripts/monitor-config.sh validate
```

## 錯誤分析能力

### Node.js 版本問題

```
❌ Node.js 版本過低
   - 需要: Node.js v20.0.0+
   - 當前: Node.js v18.x
   - 修復: 更新 workflow 中的 NODE_VERSION 到 '20'
   - 文件: .github/workflows/*.yml
```

### pnpm 問題

```
❌ pnpm 安裝或構建失敗
   - 可能原因: 依賴衝突、版本不兼容
   - 修復: 檢查 package.json 和 pnpm-lock.yaml
```

### wrangler 問題

```
❌ Cloudflare Workers 構建失敗
   - 可能原因: 配置錯誤、依賴缺失
   - 修復: 檢查 wrangler.toml 和 API 代碼
```

### 測試問題

```
❌ 測試失敗
   - 狀態: Tests: 28 failed, 188 passed, 216 total
   - 修復: 檢查測試代碼和測試環境
```

### 安全漏洞

```
❌ 安全漏洞
   - 詳情: 11 vulnerabilities found
   - 修復: 運行 'pnpm audit fix' 或手動更新依賴
```

## 監控統計

系統會自動統計：

- 📊 **總檢查次數**
- ✅ **成功次數**
- ❌ **失敗次數**
- 📈 **成功率百分比**

## 智能特性

### 1. 自動問題識別

- 基於錯誤模式自動分類問題
- 提供針對性的修復建議
- 避免重複分析相同問題

### 2. 智能等待策略

- 成功後延長檢查間隔（5分鐘）
- 失敗後保持正常檢查間隔（1分鐘）
- 連續失敗達到限制時自動停止

### 3. 自動修復集成

- 監控發現問題後可自動觸發修復
- 修復完成後自動提交和推送
- 支持部分自動修復和手動修復

## 故障排除

### 常見問題

#### 1. 監控腳本無法啟動

```bash
# 檢查依賴
which gh
which jq

# 檢查 GitHub 認證
gh auth status
```

#### 2. 無法獲取 CI/CD 狀態

```bash
# 檢查倉庫權限
gh repo view $MONITOR_REPO

# 檢查分支是否存在
gh repo view $MONITOR_REPO --json defaultBranchRef
```

#### 3. 自動修復失敗

```bash
# 檢查腳本權限
ls -la scripts/auto-fix.sh

# 手動運行修復步驟
./scripts/auto-fix.sh
```

### 日誌分析

監控系統會記錄詳細日誌：

```bash
# 查看監控日誌
tail -f logs/monitor.log

# 查看錯誤日誌
grep "ERROR" logs/monitor.log
```

## 最佳實踐

### 1. 監控設置

- 設置合理的檢查間隔（建議 60 秒）
- 配置適當的連續失敗限制（建議 3 次）
- 啟用自動修復功能

### 2. 問題處理

- 優先使用自動修復腳本
- 手動修復複雜問題
- 定期檢查監控統計

### 3. 維護建議

- 定期更新依賴版本
- 檢查監控日誌
- 優化自動修復規則

## 總結

智能 CI/CD 監控系統提供了：

1. **自動化監控**：無需手動檢查 CI/CD 狀態
2. **智能分析**：自動識別問題類型
3. **自動修復**：解決常見問題
4. **實時統計**：追蹤項目健康狀況
5. **配置靈活**：根據需求調整參數

通過這個系統，您可以：

- 🚀 **專注開發**：無需擔心 CI/CD 問題
- 🔧 **快速修復**：自動解決常見問題
- 📊 **實時掌握**：了解項目狀態
- 🎯 **預防問題**：及早發現和修復問題

開始使用智能監控系統，讓您的 CI/CD 流程更加穩定和高效！
