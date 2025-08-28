#!/bin/bash

echo "🚀 開始部署概念股篩選系統..."

# 檢查環境變數
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  警告: GEMINI_API_KEY 未設定，將使用模擬資料"
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️  警告: CLOUDFLARE_API_TOKEN 未設定"
fi

# 安裝依賴
echo "📦 安裝依賴..."
pnpm install

# 建立類型定義
echo "🔧 建立類型定義..."
cd packages/types && pnpm build && cd ../..

# 建立 UI 組件
echo "🎨 建立 UI 組件..."
cd packages/ui && pnpm build && cd ../..

# 部署 API
echo "🌐 部署 Cloudflare Workers API..."
cd ../apps/api
if [ ! -z "$CLOUDFLARE_API_TOKEN" ]; then
    pnpm deploy
else
    echo "⚠️  跳過 API 部署（需要 CLOUDFLARE_API_TOKEN）"
fi
cd ../..

# 部署前端
echo "🎯 部署前端應用..."
cd ../apps/web
if [ ! -z "$VERCEL_TOKEN" ]; then
    pnpm build
    echo "✅ 前端建置完成"
    echo "📝 請手動部署到 Vercel 或設定自動部署"
else
    echo "⚠️  跳過前端部署（需要 VERCEL_TOKEN）"
fi
cd ../..

echo "✅ 部署完成！"
echo ""
echo "📋 下一步："
echo "1. 設定 Cloudflare Workers 環境變數"
echo "2. 設定 Vercel 環境變數"
echo "3. 測試 API 端點"
echo "4. 驗證前端功能"
