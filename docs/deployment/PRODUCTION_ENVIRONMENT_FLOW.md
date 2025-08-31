# 正式環境流程分析

## 📋 當前狀況

### **已部署的服務**
1. **Cloudflare Workers API** ✅
   - URL: https://concept-stock-screener-api.sandy246836.workers.dev
   - 狀態: 正常運行
   - 功能: 完整的 API 端點

2. **Vercel 前端** ✅
   - URL: https://concept-stock-screener.vercel.app
   - 狀態: 已部署但可能有配置問題
   - 功能: Next.js 應用

### **GitHub Actions 配置**
- **觸發條件**: 推送到 `main` 分支
- **部署順序**: 
  1. 先部署 API 到 Cloudflare Workers
  2. 再部署前端到 Vercel

## 🔄 正式環境部署流程

### **步驟 1: 程式碼提交**
```bash
# 1. 確保所有修改已提交
git add .
git commit -m "修復環境配置和 RAG 功能"

# 2. 推送到 GitHub
git push origin main
```

### **步驟 2: GitHub Actions 自動執行**
1. **觸發條件**: 推送到 `main` 分支
2. **執行順序**:
   - 構建 packages/types 和 packages/ui
   - 部署 API 到 Cloudflare Workers
   - 部署前端到 Vercel

### **步驟 3: 環境變數設定**
需要在兩個平台設定環境變數：

#### **Cloudflare Workers 環境變數**
- `GEMINI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX_NAME`
- `RAG_DOCS_URL`
- `RAG_MANIFEST_URL`

#### **Vercel 環境變數**
- `NEXT_PUBLIC_API_BASE_URL`
- `RAG_DOCS_URL`
- `RAG_MANIFEST_URL`

## 🚨 發現的問題

### **1. 環境變數不一致**
- 開發環境: 使用 localhost
- 生產環境: 需要正確的 URL

### **2. RAG 檔案路徑問題**
- API 中的 RAG 端點可能無法正確載入檔案
- 需要確保 RAG 檔案在生產環境中可訪問

### **3. 部署順序問題**
- 前端依賴於 API，但部署可能不同步

## 🔧 修復計劃

### **階段 1: 修復環境配置**
1. 統一環境變數配置
2. 修復 RAG 檔案路徑
3. 確保 API 端點正確

### **階段 2: 測試部署流程**
1. 提交程式碼到 GitHub
2. 監控 GitHub Actions 執行
3. 驗證部署結果

### **階段 3: 驗證生產環境**
1. 測試 API 端點
2. 測試前端功能
3. 測試 RAG 功能

## 📊 當前測試結果

### **開發環境** ✅
- API: http://localhost:8787 - 正常
- 前端: http://localhost:3002 - 正常
- RAG 檔案: 正常載入

### **生產環境** ⚠️
- API: https://concept-stock-screener-api.sandy246836.workers.dev - 部分正常
- 前端: https://concept-stock-screener.vercel.app - 需要驗證
- RAG 檔案: 需要修復

## 🎯 下一步行動

### **立即執行**
1. 修復 API 中的 RAG 檔案路徑問題
2. 提交所有修改到 GitHub
3. 監控 GitHub Actions 部署

### **驗證步驟**
1. 測試生產環境 API
2. 測試生產環境前端
3. 驗證 RAG 功能

### **長期維護**
1. 設定監控和警報
2. 定期檢查部署狀態
3. 更新文檔和流程

## 📝 重要提醒

1. **不要直接操作生產環境**
2. **所有修改都通過 Git 提交**
3. **讓 GitHub Actions 處理部署**
4. **測試開發環境後再部署**
5. **監控部署日誌和錯誤**

## 🔍 監控點

### **GitHub Actions**
- 部署狀態: https://github.com/your-repo/actions
- 構建日誌: 檢查錯誤和警告

### **Cloudflare Workers**
- 日誌: Cloudflare Dashboard
- 效能: 監控回應時間

### **Vercel**
- 部署狀態: Vercel Dashboard
- 效能: 監控載入時間

## 📞 故障排除

### **如果部署失敗**
1. 檢查 GitHub Actions 日誌
2. 確認環境變數設定
3. 檢查程式碼語法錯誤
4. 重新推送觸發部署

### **如果功能異常**
1. 檢查 API 端點狀態
2. 驗證環境變數
3. 檢查 RAG 檔案路徑
4. 查看瀏覽器控制台錯誤
