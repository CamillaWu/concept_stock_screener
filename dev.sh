#!/bin/bash

# 概念股自動化篩選系統 - 開發腳本

echo "🚀 啟動概念股自動化篩選系統開發環境..."

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js"
    echo "   建議使用 Homebrew: brew install node"
    exit 1
fi

# 檢查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安裝，正在安裝..."
    npm install -g pnpm
fi

# 檢查環境變數檔案
if [ ! -f ".env" ]; then
    echo "⚠️  .env 檔案不存在，正在複製範例檔案..."
    cp env.example .env
    echo "📝 請編輯 .env 檔案，填入您的 API Keys"
fi

# 安裝依賴
echo "📦 安裝專案依賴..."
pnpm install

# 建立共享套件
echo "🔨 建立共享套件..."
cd packages/types && pnpm build && cd ../..
cd packages/ui && pnpm build && cd ../..

# 啟動開發伺服器
echo "🌐 啟動開發伺服器..."

# 啟動 API 服務（背景執行）
echo "🔧 啟動 API 服務 (http://localhost:8787)..."
cd apps/api
pnpm dev &
API_PID=$!
cd ../..

# 等待 API 服務啟動
sleep 3

# 啟動前端服務
echo "🎨 啟動前端服務 (http://localhost:3000)..."
cd apps/web
pnpm dev &
WEB_PID=$!
cd ../..

echo "✅ 開發環境已啟動！"
echo ""
echo "📱 前端: http://localhost:3000"
echo "🔧 API:  http://localhost:8787"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待中斷信號
trap "echo '🛑 停止開發環境...'; kill $API_PID $WEB_PID 2>/dev/null; exit" INT

# 保持腳本運行
wait
