# 🚀 快速接手指南

## 📋 專案狀態摘要

**當前階段**: 漸進式整合修復  
**完成度**: ~70%  
**主要目標**: 修復資料夾結構和程式碼髒亂問題  

## ⚡ 5分鐘快速上手

### 1. 環境設置
```bash
# 克隆專案後執行
pnpm install
cp env.example .env
# 編輯 .env 填入必要環境變數
pnpm dev
```

### 2. 當前工作重點
- **RAG 系統效能優化** (高優先級)
- **API 穩定性修復** (高優先級)  
- **UI/UX 問題修復** (高優先級)

### 3. 關鍵檔案位置
```
apps/web/src/          # 前端應用
apps/api/src/          # 後端 API
packages/ui/           # 共用 UI 組件
packages/types/        # 共用類型定義
docs/                  # 專案文件
```

## 🚧 立即需要處理的問題

### 高優先級 (本週內)
1. **RAG 系統慢** - `apps/api/src/services/rag-loader.ts`
2. **API 超時** - `apps/api/src/services/`
3. **UI 載入問題** - `apps/web/src/components/`

### 中優先級 (下週)
4. **測試覆蓋** - 建立單元測試
5. **錯誤處理** - 統一錯誤處理機制

## 🛠️ 開發工具

### 常用指令
```bash
pnpm dev              # 啟動所有服務
pnpm dev:web          # 只啟動前端
pnpm dev:api          # 只啟動 API
pnpm build            # 建置專案
pnpm test             # 執行測試
pnpm deploy:vercel    # 部署到 Vercel
```

### 除錯工具
```bash
node scripts/check-env-config.js     # 檢查環境配置
node scripts/rag-tools/check-rag-files.js  # 檢查 RAG 文件
pnpm test:api                        # 測試 API
```

## 📊 效能目標

- API 響應時間: < 2秒
- 頁面載入時間: < 3秒  
- 記憶體使用量: < 500MB
- 錯誤率: < 1%

## 🔗 重要連結

- **詳細進度**: `docs/TASK_PROGRESS_AND_HANDOVER.md`
- **部署指南**: `docs/deployment/`
- **API 文檔**: `apps/api/README.md`
- **UI 組件**: `packages/ui/README.md`

## 📞 需要協助？

1. 查看 `docs/TASK_PROGRESS_AND_HANDOVER.md` 詳細文件
2. 檢查 `docs/guides/` 目錄的技術指南
3. 查看 `docs/troubleshooting/` 常見問題解決

---

**最後更新**: 2025-01-27  
**文件版本**: v1.0
