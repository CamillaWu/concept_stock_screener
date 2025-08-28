#!/bin/bash

echo "🚀 開始安全整理專案結構..."

# 1. 創建文檔目錄
echo "📁 創建文檔目錄..."
mkdir -p docs/deployment
mkdir -p docs/guides
mkdir -p scripts

# 2. 移動部署相關文檔
echo "📄 整理部署文檔..."
mv CLOUDFLARE_SETUP.md docs/deployment/
mv VERCEL_DEPLOYMENT_GUIDE.md docs/deployment/
mv DEPLOYMENT_SUCCESS.md docs/deployment/
mv FINAL_STATUS.md docs/deployment/

# 3. 移動指南文檔
echo "📖 整理指南文檔..."
mv QUICK_START.md docs/guides/
mv SETUP.md docs/guides/
mv TROUBLESHOOTING_GUIDE.md docs/guides/
mv PROGRESS.md docs/guides/

# 4. 移動腳本文件
echo "🔧 整理腳本文件..."
mv deploy.sh scripts/
mv deploy-vercel.sh scripts/
mv dev.sh scripts/
mv test-api.sh scripts/
mv check-cloudflare.sh scripts/
mv setup-cloudflare.sh scripts/

# 5. 刪除重複的 workspace 配置
echo "🧹 清理重複配置..."
if [ -f "pnpm-workspace.yaml.bak" ]; then
    rm pnpm-workspace.yaml.bak
    echo "✅ 刪除重複的 pnpm-workspace.yaml.bak"
fi

# 6. 檢查並清理重複的 lock 文件
echo "📦 檢查依賴管理..."
if [ -f "package-lock.json" ] && [ -f "pnpm-lock.yaml" ]; then
    echo "⚠️  發現重複的 lock 文件，建議使用 pnpm"
    echo "   保留 pnpm-lock.yaml，刪除 package-lock.json"
    rm package-lock.json
fi

# 7. 清理 apps/web 中的重複配置
echo "🔧 清理 apps/web 技術棧..."
cd apps/web

# 檢查是否有 Vite 和 Next.js 的混合配置
if [ -f "index.html" ] && [ -f "next.config.js" ]; then
    echo "⚠️  發現混合配置：同時存在 Vite (index.html) 和 Next.js (next.config.js)"
    echo "   建議選擇其中一個技術棧"
    echo "   目前 package.json 顯示使用 Next.js"
    
    # 備份 Vite 相關文件
    mkdir -p backup-vite
    mv index.html backup-vite/ 2>/dev/null || true
    mv vite.config.ts backup-vite/ 2>/dev/null || true
    mv tsconfig.node.json backup-vite/ 2>/dev/null || true
    mv tsconfig.app.json backup-vite/ 2>/dev/null || true
    echo "✅ Vite 相關文件已備份到 backup-vite/"
fi

# 清理重複的 lock 文件
if [ -f "package-lock.json" ] && [ -f "pnpm-lock.yaml" ]; then
    rm package-lock.json
    echo "✅ 刪除 apps/web 中的重複 package-lock.json"
fi

cd ../..

# 8. 更新 README.md
echo "📝 更新主 README..."
cat > README.md << 'EOF'
# 🎯 概念股自動化篩選系統

## 📋 專案概述
基於 AI 的台灣概念股篩選系統，使用 Gemini 2.5 Pro 進行智能分析。

## 🚀 快速開始

### 開發環境
```bash
# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

### 部署
```bash
# 部署 API
pnpm api:deploy

# 構建前端
pnpm web:build
```

## 📁 專案結構
```
├── apps/
│   ├── api/          # Cloudflare Workers API
│   └── web/          # Next.js 前端應用
├── packages/
│   ├── types/        # 共享類型定義
│   └── ui/           # UI 組件庫
├── docs/             # 文檔
│   ├── deployment/   # 部署相關
│   └── guides/       # 使用指南
└── scripts/          # 部署腳本
```

## 🔗 相關文檔
- [部署指南](./docs/deployment/)
- [使用指南](./docs/guides/)
- [故障排除](./docs/guides/TROUBLESHOOTING_GUIDE.md)

## 🛠️ 技術棧
- **後端**: Cloudflare Workers + Hono + Gemini 2.5 Pro
- **前端**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **包管理**: pnpm + Workspaces
- **部署**: Cloudflare Workers + Vercel

## 📄 授權
MIT License
EOF

echo "✅ 專案整理完成！"
echo ""
echo "📁 新的目錄結構："
echo "├── docs/deployment/  - 部署相關文檔"
echo "├── docs/guides/      - 使用指南"
echo "├── scripts/          - 部署腳本"
echo "├── apps/             - 應用程式"
echo "└── packages/         - 共享套件"
echo ""
echo "🔧 技術棧清理："
echo "✅ 統一使用 Next.js 14"
echo "✅ 清理重複的 lock 文件"
echo "✅ 備份 Vite 相關文件到 apps/web/backup-vite/"
echo ""
echo "⚠️  請檢查移動的文件是否正確，然後運行："
echo "   git add . && git commit -m '整理專案結構'"
echo ""
echo "🔄 下一步："
echo "1. 更新 scripts/ 中的路徑引用"
echo "2. 測試開發環境是否正常"
echo "3. 確認部署流程無誤"
