# 開發環境部署指南

## 🎯 概述

本文檔描述如何部署和管理概念股篩選系統的開發環境。

## 🏗️ 環境架構

```
開發環境 (Development)
├── 前端應用 (Next.js) - 端口 3000
├── API 服務 (Cloudflare Workers) - 端口 8787
├── 數據管道 (Python FastAPI) - 端口 8000
└── 本地數據庫 (SQLite)
```

## 🚀 快速部署

### 方法 1: 使用 npm 腳本

```bash
# 標準部署
pnpm deploy:dev

# 強制部署（忽略錯誤）
pnpm deploy:dev:force

# 健康檢查
pnpm health:check

# 啟動監控
pnpm monitor:dev
```

### 方法 2: 直接執行腳本

```bash
# macOS/Linux
./scripts/deployment/deploy-dev.sh
./scripts/deployment/deploy-dev.sh --force

# Windows PowerShell
.\scripts\deployment\deploy-dev.ps1
.\scripts\deployment\deploy-dev.ps1 -Force
```

## 📋 部署流程

### 1. 環境檢查

- ✅ Node.js 版本檢查
- ✅ pnpm 版本檢查
- ✅ 依賴文件檢查
- ✅ 環境變數檢查

### 2. 代碼質量檢查

- ✅ 類型檢查
- ✅ 代碼風格檢查
- ✅ 測試執行
- ✅ 安全審計

### 3. 構建過程

- ✅ 基礎包構建
- ✅ 前端應用構建
- ✅ API 服務構建
- ✅ 部署包創建

### 4. 部署執行

- ✅ 部署目錄創建
- ✅ 構建文件複製
- ✅ 配置文件複製
- ✅ 部署信息記錄

## 🔧 配置管理

### 環境變數

創建 `.env.development` 文件：

```bash
# 複製環境變數模板
cp .env.example .env.development

# 編輯開發環境配置
nano .env.development
```

### 配置文件

開發環境配置位於 `config/environments/development.json`：

```json
{
  "name": "development",
  "environment": "development",
  "api": {
    "baseUrl": "http://localhost:8787",
    "timeout": 30000
  },
  "web": {
    "baseUrl": "http://localhost:3000",
    "port": 3000
  }
}
```

## 🧪 測試和驗證

### 健康檢查

```bash
# 運行健康檢查
pnpm health:check

# 檢查結果包括：
# - 服務狀態
# - 端口佔用
# - 依賴檢查
# - 文件系統檢查
```

### 手動測試

```bash
# 啟動所有服務
pnpm dev:all

# 測試前端
curl http://localhost:3000

# 測試 API
curl http://localhost:8787/health

# 測試數據管道
curl http://localhost:8000/docs
```

## 📊 監控和日誌

### 啟動監控

```bash
# 後台監控
pnpm monitor:dev &

# 查看監控日誌
tail -f logs/dev-monitor.log
```

### 監控內容

- 🔍 服務狀態監控
- 💻 系統資源監控
- 🌐 網絡連接監控
- 📝 日誌文件管理

## 🚨 故障排除

### 常見問題

#### 1. 端口被佔用

```bash
# 檢查端口佔用
lsof -i :3000
lsof -i :8787
lsof -i :8000

# 殺死進程
kill -9 <PID>
```

#### 2. 依賴安裝失敗

```bash
# 清理依賴
pnpm clean:node_modules

# 重新安裝
pnpm install
```

#### 3. 構建失敗

```bash
# 清理構建文件
pnpm clean:dist

# 重新構建
pnpm build
```

### 日誌分析

```bash
# 查看部署日誌
tail -f deployments/dev_*/deployment-info.md

# 查看監控日誌
tail -f logs/dev-monitor.log

# 查看錯誤日誌
grep ERROR logs/dev-monitor.log
```

## 🔄 自動化部署

### GitHub Actions

開發環境會自動部署當：

1. 推送代碼到 `develop` 分支
2. 手動觸發工作流程
3. 所有檢查通過後

### 部署觸發條件

```yaml
# .github/workflows/ci.yml
deploy-dev:
  if: github.ref == 'refs/heads/develop'
  needs: [build, code-quality, security]
```

## 📈 性能優化

### 構建優化

```bash
# 並行構建
pnpm build --parallel

# 增量構建
pnpm build --incremental
```

### 開發體驗優化

```bash
# 熱重載
pnpm dev:all

# 快速重啟
pnpm dev:web --turbo
```

## 🔐 安全考慮

### 開發環境安全

- 🔒 本地網絡訪問限制
- 🚫 生產環境憑證禁用
- 📝 敏感信息日誌過濾
- 🛡️ 依賴安全審計

### 安全檢查

```bash
# 依賴安全審計
pnpm audit

# 安全漏洞檢查
pnpm audit --audit-level moderate
```

## 📚 相關文檔

- [CI/CD 流程指南](../ci-cd/CI_CD_GUIDE.md)
- [環境配置管理](../environments/ENVIRONMENT_CONFIG.md)
- [故障排除手冊](../troubleshooting/TROUBLESHOOTING.md)

## 🆘 獲取幫助

如果遇到問題：

1. 查看本文檔的故障排除部分
2. 檢查 GitHub Issues
3. 聯繫開發團隊
4. 查看監控日誌

---

_最後更新: 2024-12-19_
_維護者: 開發團隊_
