# Cloudflare 設定指南

## 🚀 快速設定步驟

### 1. 建立 Cloudflare 帳戶

1. 前往 [Cloudflare 官網](https://cloudflare.com)
2. 點擊 "Sign Up" 註冊帳戶
3. 驗證電子郵件
4. 完成帳戶設定

### 2. 取得 API Token

1. 登入 Cloudflare Dashboard
2. 前往 **My Profile** → **API Tokens**
3. 點擊 **Create Token**
4. 選擇 **Custom token** 模板
5. 設定權限：
   - **Account** → **Cloudflare Workers** → **Edit**
   - **Account** → **Workers KV Storage** → **Edit**
   - **Zone** → **Zone** → **Read** (選擇您的網域)
6. 設定 Token 名稱：`concept-stock-screener`
7. 點擊 **Continue to summary** → **Create Token**
8. **複製 Token** (只會顯示一次！)

### 3. 建立 KV Namespace

1. 前往 **Workers & Pages**
2. 點擊 **KV** 標籤
3. 點擊 **Create a namespace**
4. 輸入名稱：`concepts-cache`
5. 點擊 **Add binding**
6. 複製 **Namespace ID**

### 4. 更新專案配置

#### 更新 wrangler.toml
```toml
name = "concept-stock-screener-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "concept-stock-screener-api"

[env.staging]
name = "concept-stock-screener-api-staging"

# KV Namespace
[[kv_namespaces]]
binding = "CONCEPTS_CACHE"
id = "YOUR_KV_NAMESPACE_ID"  # 替換為您的 Namespace ID
preview_id = "YOUR_PREVIEW_KV_NAMESPACE_ID"  # 替換為您的 Preview Namespace ID

# 環境變數
[vars]
ENVIRONMENT = "development"
```

#### 設定環境變數
```bash
# 設定 Gemini API Key
wrangler secret put GEMINI_API_KEY

# 設定 Cloudflare API Token
wrangler secret put CLOUDFLARE_API_TOKEN
```

### 5. 部署 Workers

```bash
cd apps/api
pnpm deploy
```

## 🔧 詳細設定

### 建立 Preview KV Namespace

為了支援本地開發，您需要建立一個 Preview KV Namespace：

1. 前往 **Workers & Pages** → **KV**
2. 點擊 **Create a namespace**
3. 輸入名稱：`concepts-cache-preview`
4. 複製 **Namespace ID**

### 更新 wrangler.toml 的 preview_id

```toml
[[kv_namespaces]]
binding = "CONCEPTS_CACHE"
id = "YOUR_PRODUCTION_KV_ID"
preview_id = "YOUR_PREVIEW_KV_ID"
```

### 設定自定義網域 (可選)

1. 前往 **Workers & Pages**
2. 選擇您的 Worker
3. 點擊 **Settings** → **Triggers**
4. 在 **Custom Domains** 下點擊 **Add Custom Domain**
5. 輸入您的網域，例如：`api.yourdomain.com`

## 🧪 測試部署

### 1. 本地測試
```bash
cd apps/api
pnpm dev
```

### 2. 生產環境測試
```bash
# 部署到生產環境
pnpm deploy

# 測試 API 端點
curl https://concept-stock-screener-api.your-subdomain.workers.dev/health
```

### 3. 測試 KV 快取
```bash
# 測試熱門概念 API
curl https://concept-stock-screener-api.your-subdomain.workers.dev/trending

# 測試搜尋 API
curl "https://concept-stock-screener-api.your-subdomain.workers.dev/search?mode=theme&q=AI"
```

## 📊 監控與分析

### 1. 查看 Workers 分析
- 前往 **Workers & Pages**
- 選擇您的 Worker
- 查看 **Analytics** 標籤

### 2. 查看 KV 使用情況
- 前往 **Workers & Pages** → **KV**
- 選擇您的 Namespace
- 查看使用統計

### 3. 查看錯誤日誌
- 前往 **Workers & Pages**
- 選擇您的 Worker
- 查看 **Logs** 標籤

## 🔒 安全性設定

### 1. 環境變數
- 確保所有敏感資訊都使用 `wrangler secret` 設定
- 不要在程式碼中硬編碼 API Keys

### 2. CORS 設定
- 在 API 中正確設定 CORS 標頭
- 限制允許的來源網域

### 3. 速率限制
- 考慮實作速率限制
- 監控 API 使用情況

## 🚨 常見問題

### Q: 部署失敗怎麼辦？
A: 檢查：
- API Token 是否正確
- KV Namespace ID 是否正確
- 環境變數是否已設定

### Q: KV 快取不工作？
A: 檢查：
- KV Namespace 是否已建立
- binding 名稱是否正確
- 權限是否設定正確

### Q: API 回應很慢？
A: 檢查：
- Gemini API 回應時間
- KV 快取是否生效
- Workers 執行時間限制

## 📞 支援

如果遇到問題：
1. 查看 [Cloudflare Workers 文件](https://developers.cloudflare.com/workers/)
2. 查看 [Workers KV 文件](https://developers.cloudflare.com/workers/configuration/bindings/kv/)
3. 檢查專案的 [SETUP.md](SETUP.md) 檔案
