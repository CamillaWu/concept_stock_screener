#!/bin/bash

# 概念股篩選系統 - 專案狀態檢查腳本
echo "🔍 檢查專案狀態..."

# 檢查目錄結構
echo "📁 檢查目錄結構..."
required_dirs=(
    "apps/web"
    "apps/api"
    "apps/data-pipeline"
    "packages/types"
    "packages/ui"
    "docs-new"
    "scripts"
    ".github"
    ".vscode"
    ".husky"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir"
    else
        echo "❌ $dir - 缺失"
    fi
done

echo ""

# 檢查配置文件
echo "⚙️  檢查配置文件..."
required_files=(
    "package.json"
    "pnpm-workspace.yaml"
    "tsconfig.base.json"
    ".eslintrc.js"
    ".prettierrc"
    "env.example"
    "README.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - 缺失"
    fi
done

echo ""

# 檢查依賴狀態
echo "📦 檢查依賴狀態..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules 已安裝"

    # 檢查 pnpm 鎖定文件
    if [ -f "pnpm-lock.yaml" ]; then
        echo "✅ pnpm-lock.yaml 存在"
    else
        echo "❌ pnpm-lock.yaml 缺失"
    fi
else
    echo "❌ node_modules 未安裝"
fi

echo ""

# 檢查構建狀態
echo "🔨 檢查構建狀態..."
if [ -d "packages/types/dist" ]; then
    echo "✅ types 包已構建"
else
    echo "❌ types 包未構建"
fi

if [ -d "packages/ui/dist" ]; then
    echo "✅ ui 包已構建"
else
    echo "❌ ui 包未構建"
fi

echo ""

# 檢查端口狀態
echo "🌐 檢查端口狀態..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 3000 (前端) 已被佔用"
else
    echo "✅ 端口 3000 (前端) 可用"
fi

if lsof -Pi :8787 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 8787 (API) 已被佔用"
else
    echo "✅ 端口 8787 (API) 可用"
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 8000 (數據管道) 已被佔用"
else
    echo "✅ 端口 8000 (數據管道) 可用"
fi

echo ""
echo "📊 專案狀態檢查完成！"
echo "💡 建議："
echo "1. 如果發現缺失的目錄或文件，請檢查專案結構"
echo "2. 如果依賴未安裝，請運行 'pnpm install'"
echo "3. 如果包未構建，請運行 'pnpm build:types' 和 'pnpm build:ui'"
echo "4. 如果端口被佔用，請檢查是否有其他服務運行"
