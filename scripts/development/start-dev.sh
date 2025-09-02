#!/bin/bash

# 概念股篩選系統 - 開發環境啟動腳本
echo "🚀 啟動概念股篩選系統開發環境..."

# 檢查是否已安裝依賴
if [ ! -d "node_modules" ]; then
    echo "📦 依賴未安裝，正在安裝..."
    pnpm install
fi

# 檢查基礎包是否已構建
if [ ! -d "packages/types/dist" ] || [ ! -d "packages/ui/dist" ]; then
    echo "🔨 構建基礎包..."
    pnpm --filter types build
    pnpm --filter ui build
fi

# 啟動所有服務
echo "🌟 啟動所有開發服務..."

# 使用 concurrently 同時啟動多個服務
if command -v concurrently &> /dev/null; then
    echo "📡 使用 concurrently 啟動服務..."
    concurrently \
        "pnpm --filter web dev" \
        "pnpm --filter api dev" \
        "echo '等待服務啟動...' && sleep 5 && echo '✅ 所有服務已啟動！'"
else
    echo "📡 安裝並使用 concurrently 啟動服務..."
    pnpm add -g concurrently
    concurrently \
        "pnpm --filter web dev" \
        "pnpm --filter api dev" \
        "echo '等待服務啟動...' && sleep 5 && echo '✅ 所有服務已啟動！'"
fi
