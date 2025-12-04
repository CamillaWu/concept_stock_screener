#!/bin/bash

# 概念股篩選系統 - 快速測試腳本
echo "🧪 開始運行快速測試..."

# 檢查依賴是否已安裝
if [ ! -d "node_modules" ]; then
    echo "❌ 依賴未安裝，請先運行 'pnpm install'"
    exit 1
fi

# 檢查基礎包是否已構建
if [ ! -d "packages/types/dist" ] || [ ! -d "packages/ui/dist" ]; then
    echo "🔨 構建基礎包..."
    pnpm build:types
    pnpm build:ui
fi

echo "📋 運行類型檢查..."
pnpm type-check

if [ $? -eq 0 ]; then
    echo "✅ 類型檢查通過"
else
    echo "❌ 類型檢查失敗"
    exit 1
fi

echo "📋 運行代碼風格檢查..."
pnpm lint

if [ $? -eq 0 ]; then
    echo "✅ 代碼風格檢查通過"
else
    echo "❌ 代碼風格檢查失敗"
    exit 1
fi

echo "📋 構建測試..."
pnpm build:web
pnpm build:api

if [ $? -eq 0 ]; then
    echo "✅ 構建測試通過"
else
    echo "❌ 構建測試失敗"
    exit 1
fi

echo ""
echo "🎉 所有快速測試通過！"
echo "📝 下一步："
echo "1. 啟動開發環境：pnpm start"
echo "2. 運行完整測試：pnpm test"
echo "3. 檢查代碼覆蓋率：pnpm test:coverage"
