# 🚀 快速開始指南

## 5 分鐘設定 Cloudflare

### 步驟 1: 建立 Cloudflare 帳戶
1. 前往 [Cloudflare 官網](https://cloudflare.com)
2. 點擊 "Sign Up" 註冊
3. 驗證電子郵件

### 步驟 2: 取得 API Token
1. 登入後前往 [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 點擊 "Create Token"
3. 選擇 "Custom token"
4. 設定權限：
   - **Account** → **Cloudflare Workers** → **Edit**
   - **Account** → **Workers KV Storage** → **Edit**
5. 命名為 `concept-stock-screener`
6. 點擊 "Create Token"
7. **複製 Token** (重要！)

### 步驟 3: 自動設定
```bash
# 執行自動設定腳本
./setup-cloudflare.sh
```

腳本會自動：
- 安裝 wrangler CLI
- 建立 KV Namespace
- 更新配置文件
- 設定環境變數
- 部署 Workers

### 步驟 4: 測試 API
```bash
# 檢查設定狀態
./check-cloudflare.sh

# 測試 API 端點
./test-api.sh
```

## 🎯 完成！

您的 API 現在應該可以運作了！

### 測試 URL
- 健康檢查: `https://concept-stock-screener-api.your-subdomain.workers.dev/health`
- 熱門概念: `https://concept-stock-screener-api.your-subdomain.workers.dev/trending`
- 搜尋: `https://concept-stock-screener-api.your-subdomain.workers.dev/search?mode=theme&q=AI`

## 🔧 故障排除

### 如果自動設定失敗：
1. 手動安裝 wrangler: `npm install -g wrangler`
2. 登入: `wrangler login`
3. 重新執行: `./setup-cloudflare.sh`

### 如果 API 無法訪問：
1. 檢查 Workers 是否已部署
2. 確認環境變數已設定
3. 查看 Workers 日誌

## 📞 需要幫助？

- 查看 [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) 詳細指南
- 查看 [SETUP.md](SETUP.md) 完整設定文件
- 執行 `./check-cloudflare.sh` 診斷問題
