#!/bin/bash

# Vercel 專用構建腳本
# 只構建前端應用，跳過其他包的構建

set -e

echo "🚀 開始 Vercel 構建..."

# 檢查環境
if [ -z "$VERCEL_ENV" ]; then
  export VERCEL_ENV="development"
fi

echo "📦 環境: $VERCEL_ENV"

# 安裝依賴
echo "📥 安裝依賴..."
pnpm install --frozen-lockfile

# 只構建前端應用
echo "🔨 構建前端應用..."
cd apps/web

# 設置環境變數
export NODE_ENV="production"
export NEXT_TELEMETRY_DISABLED="1"

# 構建 Next.js 應用
echo "⚡ 執行 Next.js 構建..."
pnpm run build

echo "✅ Vercel 構建完成！"
echo "📁 輸出目錄: .next"
