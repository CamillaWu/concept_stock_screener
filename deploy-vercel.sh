#!/bin/bash

echo "🚀 開始部署到 Vercel..."

# 檢查是否已安裝 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安裝，正在安裝..."
    npm install -g vercel
fi

# 切換到前端目錄
cd apps/web

# 檢查是否已登入 Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 請先登入 Vercel..."
    vercel login
fi

# 建立生產版本
echo "📦 建立生產版本..."
pnpm build

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "�� 您的應用程式現在可以公開訪問了！"
