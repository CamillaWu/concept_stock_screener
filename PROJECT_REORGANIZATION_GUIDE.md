# 🗂️ 專案重組指南

## 📋 問題分析

您的專案確實存在一些結構混亂的問題：

### 🔴 主要問題
1. **重複配置文件**：多個 lock 文件、重複的 workspace 配置
2. **技術棧混亂**：`apps/web` 同時有 Next.js 和 Vite 配置
3. **文檔分散**：根目錄有太多 `.md` 文件
4. **腳本分散**：部署腳本散落在根目錄
5. **依賴管理混亂**：同時存在 npm 和 pnpm 的 lock 文件

## 🛠️ 安全整理方案

我已經為您準備了兩個安全的整理腳本：

### 階段 1：基礎整理（安全）
```bash
./organize-project.sh
```

**這個腳本會：**
- ✅ 創建 `docs/` 和 `scripts/` 目錄
- ✅ 移動文檔到適當位置
- ✅ 移動腳本到 `scripts/` 目錄
- ✅ 清理重複的配置文件
- ✅ 統一技術棧（選擇 Next.js）
- ✅ 備份 Vite 相關文件

### 階段 2：路徑更新（安全）
```bash
./update-scripts.sh
```

**這個腳本會：**
- ✅ 更新腳本中的相對路徑
- ✅ 更新 `package.json` 的腳本引用
- ✅ 添加新的部署命令

## 📁 整理後的結構

```
concept_stock_screener/
├── apps/
│   ├── api/                    # Cloudflare Workers API
│   └── web/                    # Next.js 前端應用
│       └── backup-vite/        # Vite 配置備份
├── packages/
│   ├── types/                  # 共享類型定義
│   └── ui/                     # UI 組件庫
├── docs/
│   ├── deployment/             # 部署相關文檔
│   │   ├── CLOUDFLARE_SETUP.md
│   │   ├── VERCEL_DEPLOYMENT_GUIDE.md
│   │   ├── DEPLOYMENT_SUCCESS.md
│   │   └── FINAL_STATUS.md
│   └── guides/                 # 使用指南
│       ├── QUICK_START.md
│       ├── SETUP.md
│       ├── TROUBLESHOOTING_GUIDE.md
│       └── PROGRESS.md
├── scripts/                    # 部署腳本
│   ├── deploy.sh
│   ├── deploy-vercel.sh
│   ├── dev.sh
│   ├── test-api.sh
│   ├── check-cloudflare.sh
│   └── setup-cloudflare.sh
├── mock/                       # 模擬資料
├── README.md                   # 主文檔
├── package.json                # 根目錄配置
├── pnpm-workspace.yaml         # Workspace 配置
└── pnpm-lock.yaml              # 依賴鎖定文件
```

## 🚀 執行步驟

### 1. 備份當前狀態（可選）
```bash
git add .
git commit -m "備份：整理前的狀態"
```

### 2. 執行整理
```bash
# 執行基礎整理
./organize-project.sh

# 更新腳本路徑
./update-scripts.sh
```

### 3. 檢查結果
```bash
# 檢查目錄結構
tree -L 3 -I 'node_modules|.git|.next'

# 測試開發環境
pnpm dev
```

### 4. 提交更改
```bash
git add .
git commit -m "重組：整理專案結構和技術棧"
```

## ✅ 整理效果

### 解決的問題：
- ✅ 統一技術棧（Next.js 14）
- ✅ 清理重複配置文件
- ✅ 整理文檔結構
- ✅ 統一依賴管理（pnpm）
- ✅ 優化腳本組織

### 新的命令：
```bash
pnpm dev              # 啟動開發環境
pnpm deploy           # 部署到 Cloudflare
pnpm deploy:vercel    # 部署到 Vercel
pnpm api:deploy       # 只部署 API
pnpm web:build        # 構建前端
```

## 🔒 安全性保證

### 不會影響：
- ✅ 現有的部署配置
- ✅ Cloudflare Workers 設定
- ✅ Vercel 部署設定
- ✅ API 端點和功能
- ✅ 資料庫和快取

### 備份機制：
- ✅ Vite 配置備份到 `apps/web/backup-vite/`
- ✅ 所有文件移動而非刪除
- ✅ Git 歷史保留

## 🚨 注意事項

1. **執行前檢查**：確保沒有未提交的更改
2. **測試部署**：整理後測試部署流程
3. **團隊協調**：如果有團隊成員，請通知他們
4. **環境變數**：檢查是否需要更新環境變數路徑

## 🆘 如果出現問題

### 回滾方案：
```bash
# 如果出現問題，可以回滾
git reset --hard HEAD~1
```

### 手動修復：
如果腳本執行失敗，可以手動執行各個步驟，或聯繫我協助修復。

---

**這個整理方案是安全的，不會影響您的雲端部署和現有功能！** 🛡️
