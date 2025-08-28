# 概念股篩選系統 - 設定指南

## 🚀 Phase 1: 基礎架構設定

### 步驟 1: Google Gemini AI 設定

1. **前往**: https://makersuite.google.com/app/apikey
2. **登入** Google 帳號
3. **建立新的 API Key**
4. **複製 API Key** 並設定環境變數：
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

### 步驟 2: Cloudflare 設定

1. **註冊/登入**: https://dash.cloudflare.com/sign-up
2. **建立 Workers 專案**:
   - 前往 Workers & Pages
   - 建立新的 Worker
   - 複製 Account ID

3. **建立 KV Namespace**:
   - 前往 Workers > KV
   - 建立新的 Namespace
   - 複製 Namespace ID

4. **取得 API Token**:
   - 前往 My Profile > API Tokens
   - 建立新的 Token（需要 Workers 和 KV 權限）

5. **設定環境變數**:
   ```bash
   export CLOUDFLARE_API_TOKEN="your_api_token_here"
   export CLOUDFLARE_ACCOUNT_ID="your_account_id_here"
   export CLOUDFLARE_KV_NAMESPACE_ID="your_kv_namespace_id_here"
   ```

### 步驟 3: 更新 wrangler.toml

編輯 `apps/api/wrangler.toml`，更新以下值：
```toml
[[kv_namespaces]]
binding = "CONCEPTS_CACHE"
id = "your_kv_namespace_id"
preview_id = "your_preview_kv_namespace_id"
```

### 步驟 4: 安裝依賴

```bash
# 安裝 pnpm（如果還沒安裝）
npm install -g pnpm

# 安裝專案依賴
pnpm install
```

### 步驟 5: 本地開發

```bash
# 啟動 API 服務
cd apps/api
pnpm dev

# 新開一個終端，啟動前端
cd apps/web
pnpm dev
```

### 步驟 6: 部署

```bash
# 部署 API 到 Cloudflare Workers
cd apps/api
pnpm deploy

# 部署前端到 Vercel
cd apps/web
pnpm build
# 然後手動部署到 Vercel
```

## 🔧 環境變數設定

複製 `env.example` 到 `.env` 並填入實際值：

```bash
cp env.example .env
```

### 必要環境變數

- `GEMINI_API_KEY`: Google Gemini AI API Key
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID
- `CLOUDFLARE_KV_NAMESPACE_ID`: KV Namespace ID

### 可選環境變數

- `YAHOO_FINANCE_API_KEY`: Yahoo Finance API Key
- `NEWS_API_KEY`: News API Key
- `PLAUSIBLE_DOMAIN`: Plausible Analytics Domain

## 🧪 測試

### API 測試

```bash
# 健康檢查
curl https://your-workers-domain.workers.dev/

# 趨勢主題
curl https://your-workers-domain.workers.dev/trending

# 主題搜尋
curl "https://your-workers-domain.workers.dev/search?mode=theme&q=AI"

# 個股搜尋
curl "https://your-workers-domain.workers.dev/search?mode=stock&q=2330"
```

### 前端測試

1. 開啟 http://localhost:3000
2. 測試搜尋功能
3. 檢查熱度條顯示
4. 驗證響應式設計

## 📋 檢查清單

- [ ] Google Gemini API Key 已設定
- [ ] Cloudflare Workers 已部署
- [ ] KV Namespace 已建立
- [ ] 環境變數已配置
- [ ] API 端點可正常訪問
- [ ] 前端可正常載入
- [ ] 搜尋功能正常運作
- [ ] 熱度條正常顯示

## 🆘 常見問題

### Q: Gemini API 無法連接
A: 檢查 API Key 是否正確，確認有足夠的配額

### Q: Cloudflare Workers 部署失敗
A: 檢查 API Token 權限，確認 Account ID 正確

### Q: KV 快取不工作
A: 確認 KV Namespace ID 正確，檢查綁定設定

### Q: 前端無法連接 API
A: 檢查 CORS 設定，確認 API_BASE_URL 正確

## 📞 支援

如有問題，請檢查：
1. 環境變數設定
2. API 端點狀態
3. 瀏覽器開發者工具錯誤
4. Cloudflare Workers 日誌
