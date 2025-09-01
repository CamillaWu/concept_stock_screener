# 🎯 Pinecone 向量資料庫載入指南

## 概述
本指南說明如何將本地的 RAG（Retrieval Augmented Generation）資料載入到 Pinecone 向量資料庫中。

## 📊 資料概覽
- **總文件數**: 90 筆
- **主題概覽**: 15 個投資主題
- **股票關聯**: 75 個主題-股票關聯
- **涵蓋主題**: AI 伺服器、先進封裝、資料中心網通等 15 個熱門投資主題

## 🚀 載入流程

### 步驟 1: 準備環境變數
確保您的 `.env` 檔案包含以下 Pinecone 設定：

```bash
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=concept-radar
```

### 步驟 2: 部署到 Cloudflare Workers
```bash
cd apps/api
wrangler deploy --env production
```

### 步驟 3: 載入資料到 Pinecone
使用以下 API 端點載入資料：

```bash
# 載入 RAG 資料到 Pinecone
curl -X POST https://your-worker.your-subdomain.workers.dev/rag/load
```

### 步驟 4: 驗證載入結果
```bash
# 檢查 RAG 狀態
curl https://your-worker.your-subdomain.workers.dev/rag/status

# 測試向量搜尋
curl "https://your-worker.your-subdomain.workers.dev/vector-search?query=AI伺服器"

# 根據主題搜尋股票
curl "https://your-worker.your-subdomain.workers.dev/rag/stocks-by-theme?theme=AI伺服器"
```

## 📋 API 端點說明

### `/rag/load` - 載入 RAG 資料
- **方法**: POST
- **功能**: 將本地 RAG 資料載入到 Pinecone 向量資料庫
- **回應**: 載入的文件數量

### `/rag/status` - 檢查 RAG 狀態
- **方法**: GET
- **功能**: 檢查 RAG 資料的載入狀態和統計資訊
- **回應**: 資料統計和驗證結果

### `/vector-search` - 向量搜尋
- **方法**: GET
- **參數**: `query` (搜尋查詢)
- **功能**: 在 Pinecone 中搜尋相似向量
- **回應**: 搜尋結果列表

### `/rag/stocks-by-theme` - 根據主題搜尋股票
- **方法**: GET
- **參數**: `theme` (主題名稱)
- **功能**: 搜尋特定主題相關的股票
- **回應**: 相關股票列表

### `/rag/themes-by-stock` - 根據股票搜尋主題
- **方法**: GET
- **參數**: `stock` (股票名稱)
- **功能**: 搜尋特定股票相關的主題
- **回應**: 相關主題列表

## 🎯 包含的投資主題

1. **AI 伺服器** - 5 個股票關聯
2. **先進封裝（CoWoS / 3DFabric）** - 5 個股票關聯
3. **資料中心網通（交換器/白牌）** - 5 個股票關聯
4. **資料中心散熱（風冷/液冷）** - 5 個股票關聯
5. **OCP 機櫃/電源** - 5 個股票關聯
6. **HBM 記憶體生態** - 5 個股票關聯
7. **AI PC / 邊緣 AI** - 5 個股票關聯
8. **伺服器 ODM** - 5 個股票關聯
9. **雲端基礎設施（硬體）** - 5 個股票關聯
10. **資料中心高速互連（光互連）** - 5 個股票關聯
11. **台灣 AI 供應鏈（指數映射）** - 5 個股票關聯
12. **機櫃/機構整合** - 5 個股票關聯
13. **企業 AI 落地（生成式/代理）** - 5 個股票關聯
14. **開關電源/風扇** - 5 個股票關聯
15. **TIP：特選臺灣AI優息動能** - 5 個股票關聯

## 🔧 技術細節

### 向量嵌入
- **維度**: 768
- **模型**: Google Generative AI Embeddings
- **分塊策略**: 1000 字元，200 字元重疊

### 元資料結構
```typescript
{
  type: 'theme_overview' | 'theme_to_stock',
  title: string,
  theme_name: string,
  ticker?: string,
  stock_name?: string,
  tags: string[],
  content: string,
  source_urls: string[],
  retrieved_at: string,
  language: string,
  theme_id: string
}
```

## 🚨 注意事項

1. **Pinecone 索引**: 確保 Pinecone 索引已建立且維度為 768
2. **API 限制**: 注意 Pinecone 的 API 呼叫限制
3. **環境變數**: 確保所有必要的環境變數都已正確設定
4. **網路連線**: 確保 Cloudflare Workers 可以存取 Pinecone API

## 🔍 故障排除

### 常見問題

**Q: 載入失敗怎麼辦？**
A: 檢查 Pinecone API 金鑰和環境設定是否正確

**Q: 搜尋結果為空？**
A: 確認資料已成功載入到 Pinecone，檢查索引名稱

**Q: API 回應錯誤？**
A: 檢查 Cloudflare Workers 日誌，確認環境變數設定

### 日誌檢查
```bash
# 查看 Cloudflare Workers 日誌
wrangler tail --env production
```

## 📈 效能優化

1. **批次處理**: 大量資料建議分批載入
2. **快取策略**: 考慮實作搜尋結果快取
3. **索引優化**: 根據搜尋模式調整 Pinecone 索引設定

## 🔄 更新資料

當本地 RAG 資料更新時：

1. 更新 `data/rag/docs.jsonl` 檔案
2. 重新部署 Cloudflare Workers
3. 呼叫 `/rag/load` 端點重新載入資料

---

**最後更新**: 2025-01-01
**版本**: 1.0.0
