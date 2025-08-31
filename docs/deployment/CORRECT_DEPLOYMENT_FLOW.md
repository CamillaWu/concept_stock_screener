# 正確的部署流程指南

## 🚨 重要提醒

**不要直接操作正式環境！** 所有部署都應該通過 GitHub Actions 進行。

## 📋 正確的開發和部署流程

### **1. 本地開發**
```bash
# 在本地進行開發和測試
cd apps/web
pnpm dev

# 測試 API
cd ../api
pnpm dev
```

### **2. 提交程式碼到 GitHub**
```bash
# 確保所有修改都已提交
git add .
git commit -m "修復環境配置問題"
git push origin main
```

### **3. GitHub Actions 自動部署**

當您推送程式碼到 `main` 分支時，GitHub Actions 會自動執行：

#### **步驟 1: 部署 API 到 Cloudflare Workers**
- 構建 packages/types 和 packages/ui
- 部署 apps/api 到 Cloudflare Workers
- 設定環境變數

#### **步驟 2: 部署前端到 Vercel**
- 構建 apps/web
- 部署到 Vercel
- 設定環境變數

### **4. 驗證部署結果**

部署完成後，驗證以下端點：

```bash
# 測試 API
curl https://concept-stock-screener-api.sandy246836.workers.dev/

# 測試前端
curl https://concept-stock-screener.vercel.app/
```

## 🔧 環境變數設定

### **Cloudflare Workers 環境變數**
在 Cloudflare Dashboard 中設定：
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX_NAME`
- `GEMINI_API_KEY`
- `RAG_DOCS_URL`
- `RAG_MANIFEST_URL`

### **Vercel 環境變數**
在 Vercel Dashboard 中設定：
- `NEXT_PUBLIC_API_BASE_URL`
- `RAG_DOCS_URL`
- `RAG_MANIFEST_URL`

## 🚫 避免的操作

### **不要直接執行：**
```bash
# ❌ 不要直接部署到 Cloudflare Workers
cd apps/api && npm run deploy

# ❌ 不要直接部署到 Vercel
cd apps/web && vercel --prod

# ❌ 不要直接修改生產環境配置
```

### **正確的做法：**
```bash
# ✅ 提交程式碼到 GitHub
git push origin main

# ✅ 讓 GitHub Actions 處理部署
# 查看部署狀態：https://github.com/your-repo/actions
```

## 📊 監控部署狀態

1. **GitHub Actions**: https://github.com/your-repo/actions
2. **Cloudflare Workers**: https://dash.cloudflare.com/
3. **Vercel**: https://vercel.com/dashboard

## 🔍 故障排除

### **如果部署失敗：**
1. 檢查 GitHub Actions 日誌
2. 確認環境變數設定正確
3. 檢查程式碼是否有語法錯誤
4. 重新推送程式碼觸發部署

### **如果需要緊急修復：**
1. 創建 hotfix 分支
2. 修復問題
3. 推送並創建 Pull Request
4. 合併到 main 分支

## 📝 最佳實踐

1. **總是通過 Git 提交程式碼**
2. **使用 Pull Request 進行程式碼審查**
3. **在合併前測試本地構建**
4. **監控部署日誌**
5. **保持環境變數同步**

## 🎯 總結

- ✅ 使用 GitHub Actions 進行所有部署
- ✅ 在本地進行開發和測試
- ✅ 通過 Git 提交程式碼
- ❌ 不要直接操作生產環境
- ❌ 不要跳過 CI/CD 流程
