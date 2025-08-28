#!/bin/bash

echo "🔧 更新腳本中的路徑引用..."

# 更新 scripts/dev.sh 中的路徑
if [ -f "scripts/dev.sh" ]; then
    echo "📝 更新 scripts/dev.sh..."
    sed -i '' 's|cd apps/api|cd ../apps/api|g' scripts/dev.sh
    sed -i '' 's|cd apps/web|cd ../apps/web|g' scripts/dev.sh
    echo "✅ 更新完成"
fi

# 更新 scripts/deploy.sh 中的路徑
if [ -f "scripts/deploy.sh" ]; then
    echo "📝 更新 scripts/deploy.sh..."
    sed -i '' 's|cd apps/api|cd ../apps/api|g' scripts/deploy.sh
    sed -i '' 's|cd apps/web|cd ../apps/web|g' scripts/deploy.sh
    echo "✅ 更新完成"
fi

# 更新 scripts/deploy-vercel.sh 中的路徑
if [ -f "scripts/deploy-vercel.sh" ]; then
    echo "📝 更新 scripts/deploy-vercel.sh..."
    sed -i '' 's|cd apps/web|cd ../apps/web|g' scripts/deploy-vercel.sh
    echo "✅ 更新完成"
fi

# 更新根目錄的 package.json 腳本
echo "📝 更新根目錄 package.json 腳本..."
cat > package.json << 'EOF'
{
  "name": "concept-stock-screener",
  "version": "1.0.0",
  "description": "概念股自動化篩選系統",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "./scripts/dev.sh",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r clean",
    "api:dev": "cd apps/api && pnpm dev",
    "web:dev": "cd apps/web && pnpm dev",
    "api:deploy": "cd apps/api && pnpm deploy",
    "web:build": "cd apps/web && pnpm build",
    "test:api": "./scripts/test-api.sh",
    "deploy": "./scripts/deploy.sh",
    "deploy:vercel": "./scripts/deploy-vercel.sh"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "keywords": [
    "stock",
    "ai",
    "taiwan",
    "investment",
    "concepts",
    "screener"
  ],
  "author": "Concept Stock Screener Team",
  "license": "MIT",
  "dependencies": {
    "zustand": "^5.0.8"
  }
}
EOF

echo "✅ 腳本路徑更新完成！"
echo ""
echo "📋 更新內容："
echo "- 修正了腳本中的相對路徑"
echo "- 更新了根目錄 package.json 的腳本引用"
echo "- 添加了新的部署腳本命令"
echo ""
echo "🚀 現在可以使用以下命令："
echo "  pnpm dev          # 啟動開發環境"
echo "  pnpm deploy       # 部署到 Cloudflare"
echo "  pnpm deploy:vercel # 部署到 Vercel"
