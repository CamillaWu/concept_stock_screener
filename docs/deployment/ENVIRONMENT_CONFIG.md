# 環境配置管理指南

## 概述

本文件說明如何正確配置概念股篩選系統的開發和生產環境，避免環境混用問題。

## 環境變數配置

### 開發環境 (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://concept-stock-screener-api.sandy246836.workers.dev
NEXT_PUBLIC_API_BASE_URL_DEV=http://localhost:8787

# RAG Configuration
RAG_MANIFEST_URL=https://concept-stock-screener.vercel.app/rag/manifest.json
RAG_MANIFEST_URL_DEV=http://localhost:8787/rag/manifest.json
RAG_DOCS_URL=https://concept-stock-screener.vercel.app/rag/docs.jsonl
RAG_DOCS_URL_DEV=http://localhost:3000/rag/docs.jsonl

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Environment
NODE_ENV=development
```

### 生產環境 (Vercel Environment Variables)

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://concept-stock-screener-api.sandy246836.workers.dev

# RAG Configuration
RAG_MANIFEST_URL=https://concept-stock-screener.vercel.app/rag/manifest.json
RAG_DOCS_URL=https://concept-stock-screener.vercel.app/rag/docs.jsonl

# API Keys
GEMINI_API_KEY=your_production_gemini_api_key

# Environment
NODE_ENV=production
```

## API 端點統一配置

### 前端配置

1. **apps/web/src/services/api.ts**
   - 使用 `NEXT_PUBLIC_API_BASE_URL` 和 `NEXT_PUBLIC_API_BASE_URL_DEV`
   - 根據 `NODE_ENV` 自動選擇正確的端點

2. **apps/web/next.config.js**
   - 配置 API 重寫規則
   - 使用環境變數而非硬編碼

3. **apps/web/vercel.json**
   - 生產環境的 API 端點配置

### 後端配置

1. **apps/api/wrangler.toml**
   - Cloudflare Workers 環境配置
   - KV Namespace 配置

2. **apps/api/src/services/rag-loader.ts**
   - RAG 檔案載入配置
   - 使用環境變數配置 URL

## 部署檢查清單

### 開發環境
- [ ] 複製 `env.example` 到 `.env.local`
- [ ] 設定正確的 API 金鑰
- [ ] 確認 `NODE_ENV=development`
- [ ] 測試本地 API 連接

### 生產環境
- [ ] 在 Vercel 設定環境變數
- [ ] 確認 API 端點正確
- [ ] 測試生產 API 連接
- [ ] 驗證 RAG 檔案載入

## 常見問題

### Q: 為什麼會出現環境混用問題？
A: 主要原因是硬編碼的 URL 和環境判斷邏輯不一致。現在已統一使用環境變數。

### Q: 如何檢查當前使用的 API 端點？
A: 在瀏覽器開發者工具中查看 Network 標籤，或檢查 `process.env.NODE_ENV` 的值。

### Q: RAG 檔案載入失敗怎麼辦？
A: 檢查 RAG 相關的環境變數是否正確設定，確認檔案 URL 是否可訪問。

## 最佳實踐

1. **永遠使用環境變數**：不要硬編碼任何 URL 或 API 端點
2. **統一命名規範**：使用 `NEXT_PUBLIC_` 前綴表示前端可用的變數
3. **環境分離**：開發和生產環境使用不同的配置
4. **定期檢查**：定期驗證環境配置的正確性
5. **文檔更新**：環境變更時及時更新文檔
