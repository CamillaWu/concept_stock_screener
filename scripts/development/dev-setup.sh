#!/bin/bash

# 概念股篩選系統 - 開發環境設置腳本
echo "🚀 開始設置概念股篩選系統開發環境..."

# 檢查 Node.js 版本
echo "📋 檢查 Node.js 版本..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安裝，請先安裝 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本過低，需要 18+ 版本"
    exit 1
fi

echo "✅ Node.js 版本檢查通過: $(node -v)"

# 檢查 pnpm
echo "📋 檢查 pnpm..."
if ! command -v pnpm &> /dev/null; then
    echo "📦 安裝 pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm 已安裝: $(pnpm -v)"

# 安裝依賴
echo "📦 安裝專案依賴..."
pnpm install

# 構建基礎包
echo "🔨 構建基礎包..."
pnpm --filter types build
pnpm --filter ui build

# 設置環境變數
echo "⚙️  設置環境變數..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# 開發環境配置
NEXT_PUBLIC_API_URL=http://localhost:8787
NODE_ENV=development
EOF
    echo "✅ 已創建 .env.local 文件"
fi

# 檢查端口可用性
echo "🔍 檢查端口可用性..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 3000 已被佔用，請檢查是否有其他服務運行"
fi

if lsof -Pi :8787 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 8787 已被佔用，請檢查是否有其他服務運行"
fi

echo ""
echo "🎉 開發環境設置完成！"
echo ""
echo "📝 下一步操作："
echo "1. 啟動前端開發服務器：pnpm dev:web"
echo "2. 啟動 API 開發服務器：pnpm dev:api"
echo "3. 啟動數據管道：pnpm dev:pipeline"
echo ""
echo "🌐 訪問地址："
echo "- 前端：http://localhost:3000"
echo "- API：http://localhost:8787"
echo ""
echo "📚 更多資訊請查看 docs-new/ 目錄"
