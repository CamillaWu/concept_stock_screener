#!/bin/bash

# Cloudflare 自動設定腳本

echo "🌐 Cloudflare 設定精靈"
echo "========================"

# 檢查 wrangler 是否安裝
if ! command -v wrangler &> /dev/null; then
    echo "❌ wrangler 未安裝，正在安裝..."
    npm install -g wrangler
fi

# 檢查是否已登入
if ! wrangler whoami &> /dev/null; then
    echo "🔐 請先登入 Cloudflare..."
    echo "1. 前往 https://dash.cloudflare.com/profile/api-tokens"
    echo "2. 建立 API Token"
    echo "3. 執行: wrangler login"
    echo ""
    read -p "按 Enter 繼續..."
    wrangler login
fi

echo ""
echo "📋 設定步驟："
echo "1. 建立 KV Namespace"
echo "2. 更新 wrangler.toml"
echo "3. 設定環境變數"
echo "4. 部署 Workers"
echo ""

# 建立 KV Namespace
echo "🗄️  建立 KV Namespace..."
echo "正在建立 concepts-cache namespace..."

# 建立生產環境 KV
PROD_KV_ID=$(wrangler kv:namespace create "concepts-cache" --preview=false 2>/dev/null | grep -o '[a-f0-9]\{32\}' | head -1)
if [ -z "$PROD_KV_ID" ]; then
    echo "❌ 無法建立生產環境 KV Namespace"
    exit 1
fi

# 建立預覽環境 KV
PREVIEW_KV_ID=$(wrangler kv:namespace create "concepts-cache" --preview=true 2>/dev/null | grep -o '[a-f0-9]\{32\}' | head -1)
if [ -z "$PREVIEW_KV_ID" ]; then
    echo "❌ 無法建立預覽環境 KV Namespace"
    exit 1
fi

echo "✅ KV Namespace 建立完成："
echo "   生產環境: $PROD_KV_ID"
echo "   預覽環境: $PREVIEW_KV_ID"

# 更新 wrangler.toml
echo ""
echo "📝 更新 wrangler.toml..."

# 備份原始檔案
cp apps/api/wrangler.toml apps/api/wrangler.toml.backup

# 更新 KV Namespace ID
sed -i '' "s/id = \"your-kv-namespace-id\"/id = \"$PROD_KV_ID\"/" apps/api/wrangler.toml
sed -i '' "s/preview_id = \"your-preview-kv-namespace-id\"/preview_id = \"$PREVIEW_KV_ID\"/" apps/api/wrangler.toml

echo "✅ wrangler.toml 已更新"

# 設定環境變數
echo ""
echo "🔑 設定環境變數..."

# 檢查 .env 檔案中的 Gemini API Key
GEMINI_KEY=$(grep "GEMINI_API_KEY=" .env | cut -d'=' -f2)
if [ -n "$GEMINI_KEY" ] && [ "$GEMINI_KEY" != "your_gemini_api_key_here" ]; then
    echo "設定 Gemini API Key..."
    echo "$GEMINI_KEY" | wrangler secret put GEMINI_API_KEY
    echo "✅ Gemini API Key 已設定"
else
    echo "⚠️  請先在 .env 檔案中設定 GEMINI_API_KEY"
fi

# 提示設定 Cloudflare API Token
echo ""
echo "🔐 請設定 Cloudflare API Token："
echo "1. 前往 https://dash.cloudflare.com/profile/api-tokens"
echo "2. 建立新的 API Token"
echo "3. 權限設定："
echo "   - Account > Cloudflare Workers > Edit"
echo "   - Account > Workers KV Storage > Edit"
echo "4. 複製 Token"
echo ""
read -p "請輸入您的 Cloudflare API Token: " CLOUDFLARE_TOKEN

if [ -n "$CLOUDFLARE_TOKEN" ]; then
    echo "$CLOUDFLARE_TOKEN" | wrangler secret put CLOUDFLARE_API_TOKEN
    echo "✅ Cloudflare API Token 已設定"
fi

# 部署 Workers
echo ""
echo "🚀 部署 Workers..."

cd apps/api

echo "正在部署到 Cloudflare Workers..."
if wrangler deploy; then
    echo "✅ Workers 部署成功！"
    
    # 取得部署 URL
    WORKER_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://[^.]*\.workers\.dev' | head -1)
    if [ -n "$WORKER_URL" ]; then
        echo ""
        echo "🌐 您的 API 網址："
        echo "   $WORKER_URL"
        echo ""
        echo "🧪 測試 API："
        echo "   curl $WORKER_URL/health"
        echo "   curl $WORKER_URL/trending"
    fi
else
    echo "❌ Workers 部署失敗"
    exit 1
fi

cd ../..

echo ""
echo "🎉 Cloudflare 設定完成！"
echo ""
echo "📋 下一步："
echo "1. 測試 API 端點"
echo "2. 設定前端環境變數"
echo "3. 部署前端到 Vercel"
echo ""
echo "📚 詳細文件："
echo "   - CLOUDFLARE_SETUP.md"
echo "   - SETUP.md"
