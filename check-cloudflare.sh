#!/bin/bash

# Cloudflare 設定檢查腳本

echo "🔍 Cloudflare 設定檢查"
echo "======================"

# 檢查 wrangler 是否安裝
if command -v wrangler &> /dev/null; then
    echo "✅ wrangler 已安裝"
    WRANGLER_VERSION=$(wrangler --version)
    echo "   版本: $WRANGLER_VERSION"
else
    echo "❌ wrangler 未安裝"
    echo "   請執行: npm install -g wrangler"
    exit 1
fi

echo ""

# 檢查是否已登入
if wrangler whoami &> /dev/null; then
    echo "✅ 已登入 Cloudflare"
    ACCOUNT_INFO=$(wrangler whoami 2>/dev/null | head -1)
    echo "   帳戶: $ACCOUNT_INFO"
else
    echo "❌ 未登入 Cloudflare"
    echo "   請執行: wrangler login"
    exit 1
fi

echo ""

# 檢查 wrangler.toml 配置
if [ -f "apps/api/wrangler.toml" ]; then
    echo "✅ wrangler.toml 存在"
    
    # 檢查 KV Namespace 配置
    if grep -q "your-kv-namespace-id" apps/api/wrangler.toml; then
        echo "⚠️  KV Namespace ID 尚未設定"
        echo "   請執行: ./setup-cloudflare.sh"
    else
        echo "✅ KV Namespace ID 已設定"
    fi
else
    echo "❌ wrangler.toml 不存在"
    exit 1
fi

echo ""

# 檢查環境變數
echo "🔑 環境變數檢查："

# 檢查 Gemini API Key
if [ -f ".env" ]; then
    GEMINI_KEY=$(grep "GEMINI_API_KEY=" .env | cut -d'=' -f2)
    if [ -n "$GEMINI_KEY" ] && [ "$GEMINI_KEY" != "your_gemini_api_key_here" ]; then
        echo "✅ Gemini API Key 已設定"
    else
        echo "⚠️  Gemini API Key 尚未設定"
    fi
else
    echo "❌ .env 檔案不存在"
fi

# 檢查 Cloudflare API Token
if wrangler secret list 2>/dev/null | grep -q "GEMINI_API_KEY"; then
    echo "✅ Gemini API Key 已上傳到 Cloudflare"
else
    echo "⚠️  Gemini API Key 尚未上傳到 Cloudflare"
fi

if wrangler secret list 2>/dev/null | grep -q "CLOUDFLARE_API_TOKEN"; then
    echo "✅ Cloudflare API Token 已設定"
else
    echo "⚠️  Cloudflare API Token 尚未設定"
fi

echo ""

# 檢查 Workers 部署狀態
echo "🚀 Workers 部署狀態："

cd apps/api

if wrangler whoami &> /dev/null; then
    # 嘗試獲取 Workers 列表
    WORKERS_LIST=$(wrangler workers list 2>/dev/null)
    if echo "$WORKERS_LIST" | grep -q "concept-stock-screener-api"; then
        echo "✅ Workers 已部署"
        
        # 嘗試測試 API
        WORKER_URL="https://concept-stock-screener-api.$(wrangler whoami 2>/dev/null | grep -o '[^.]*\.workers\.dev' | head -1)"
        echo "   URL: $WORKER_URL"
        
        # 測試健康檢查
        if curl -s "$WORKER_URL/health" &> /dev/null; then
            echo "✅ API 健康檢查通過"
        else
            echo "⚠️  API 健康檢查失敗"
        fi
    else
        echo "❌ Workers 尚未部署"
        echo "   請執行: wrangler deploy"
    fi
else
    echo "❌ 無法檢查 Workers 狀態"
fi

cd ../..

echo ""
echo "📋 建議操作："

if ! grep -q "your-kv-namespace-id" apps/api/wrangler.toml; then
    echo "✅ 所有設定看起來都正確！"
    echo "   您可以開始使用 API 了"
else
    echo "🔧 需要完成的設定："
    echo "   1. 執行 ./setup-cloudflare.sh 完成 Cloudflare 設定"
    echo "   2. 或手動設定 KV Namespace ID"
fi

echo ""
echo "📚 相關文件："
echo "   - CLOUDFLARE_SETUP.md"
echo "   - SETUP.md"
