#!/bin/bash

echo "🚀 開始雲端部署概念股篩選系統..."
echo "=================================="

# 檢查必要的環境變數
echo "🔍 檢查環境變數..."

if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  警告: GEMINI_API_KEY 未設定"
    echo "請設定 GEMINI_API_KEY 環境變數"
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "⚠️  警告: CLOUDFLARE_API_TOKEN 未設定"
    echo "請設定 CLOUDFLARE_API_TOKEN 環境變數"
fi

if [ -z "$VERCEL_TOKEN" ]; then
    echo "⚠️  警告: VERCEL_TOKEN 未設定"
    echo "請設定 VERCEL_TOKEN 環境變數"
fi

# 安裝依賴
echo ""
echo "📦 安裝依賴..."
pnpm install

# 建立類型定義
echo "🔧 建立類型定義..."
cd packages/types && pnpm build && cd ../..

# 建立 UI 組件
echo "🎨 建立 UI 組件..."
cd packages/ui && pnpm build && cd ../..

# 部署 API 到 Cloudflare Workers
echo ""
echo "🌐 部署 Cloudflare Workers API..."
cd apps/api

if [ ! -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "設定 Cloudflare API Token..."
    export CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
    
    echo "部署到 Cloudflare Workers..."
    pnpm deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Cloudflare Workers 部署成功"
    else
        echo "❌ Cloudflare Workers 部署失敗"
        exit 1
    fi
else
    echo "⚠️  跳過 Cloudflare Workers 部署（需要 CLOUDFLARE_API_TOKEN）"
fi

cd ../..

# 部署前端到 Vercel
echo ""
echo "🎯 部署前端應用..."
cd apps/web

if [ ! -z "$VERCEL_TOKEN" ]; then
    echo "設定 Vercel Token..."
    export VERCEL_TOKEN=$VERCEL_TOKEN
    
    echo "建置前端應用..."
    pnpm build
    
    if [ $? -eq 0 ]; then
        echo "✅ 前端建置成功"
        
        echo "部署到 Vercel..."
        npx vercel --prod --token $VERCEL_TOKEN
        
        if [ $? -eq 0 ]; then
            echo "✅ Vercel 部署成功"
        else
            echo "❌ Vercel 部署失敗"
            exit 1
        fi
    else
        echo "❌ 前端建置失敗"
        exit 1
    fi
else
    echo "⚠️  跳過 Vercel 部署（需要 VERCEL_TOKEN）"
    echo "請手動部署到 Vercel 或設定 VERCEL_TOKEN"
fi

cd ../..

echo ""
echo "✅ 雲端部署完成！"
echo ""
echo "📋 部署結果："
echo "- Cloudflare Workers API: https://concepts-radar-api.sandy246836.workers.dev"
echo "- Vercel 前端: https://concept-stock-screener.vercel.app"
echo ""
echo "🔧 下一步："
echo "1. 設定 Cloudflare Workers 環境變數（GEMINI_API_KEY 等）"
echo "2. 設定 Vercel 環境變數（NEXT_PUBLIC_API_BASE_URL）"
echo "3. 測試 API 端點"
echo "4. 驗證前端功能"
echo ""
echo "🌐 測試連結："
echo "- API 健康檢查: https://concepts-radar-api.sandy246836.workers.dev"
echo "- RAG 狀態: https://concepts-radar-api.sandy246836.workers.dev/rag/status"
echo "- 前端應用: https://concept-stock-screener.vercel.app"
