# Vercel 環境變數設定指南

## 步驟 1：登入 Vercel Dashboard

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到專案 `concept-stock-screener`
3. 點擊專案進入管理頁面

## 步驟 2：設定環境變數

### 在 Vercel Dashboard 中：

1. **進入 Settings 頁面**
   - 點擊專案頁面頂部的 "Settings" 標籤

2. **找到 Environment Variables 區塊**
   - 在左側選單中點擊 "Environment Variables"

3. **添加以下環境變數**

#### 必需的環境變數：
```
NEXT_PUBLIC_API_BASE_URL=https://concept-stock-screener-api.sandy246836.workers.dev
```

#### RAG 相關環境變數：
```
RAG_MANIFEST_URL=https://concept-stock-screener.vercel.app/rag/manifest.json
RAG_DOCS_URL=https://concept-stock-screener.vercel.app/rag/docs.jsonl
```

#### Pinecone 向量資料庫環境變數：
```
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=aped-4627-b74a
PINECONE_INDEX_NAME=concept-radar
```

#### API Keys（如果需要的話）：
```
GEMINI_API_KEY=your_actual_gemini_api_key
PINECONE_API_KEY=your_actual_pinecone_api_key
```

## 步驟 3：設定環境範圍

對於每個環境變數：
- **Production**: ✅ 勾選
- **Preview**: ✅ 勾選  
- **Development**: ❌ 不勾選（使用本地 .env.local）

## 步驟 4：重新部署

1. 點擊 "Deployments" 標籤
2. 找到最新的部署
3. 點擊 "Redeploy" 按鈕
4. 等待部署完成

## 驗證設定

部署完成後，檢查：
1. 專案是否正常運行
2. 沒有環境變數相關的錯誤
3. API 連接正常

## 注意事項

- 環境變數名稱必須完全匹配
- 值中不能有多餘的空格
- 修改後需要重新部署才能生效
- 敏感資訊（如 API Keys）不會在客戶端暴露
