#!/bin/bash

echo "🚀 開始執行立即項目..."
echo "========================"

# 步驟 1: 檢查環境配置
echo -e "
📋 步驟 1: 檢查環境配置"
echo "--------------------------------"
node scripts/check-env-config.js

# 步驟 2: 測試生產環境 API
echo -e "
📋 步驟 2: 測試生產環境 API 連接"
echo "--------------------------------"
node scripts/test-production-api.js

# 步驟 3: 驗證 RAG 檔案載入
echo -e "
📋 步驟 3: 驗證 RAG 檔案載入功能"
echo "--------------------------------"
node scripts/test-rag-loading.js

# 步驟 4: 顯示指南
echo -e "
📋 步驟 4: 下一步操作指南"
echo "--------------------------------"
echo ""
echo "📖 接下來您需要手動執行以下操作："
echo ""
echo "1. 🌐 在 Vercel Dashboard 設定環境變數："
echo "   - 前往: https://vercel.com/dashboard"
echo "   - 找到專案: concept-stock-screener"
echo "   - 進入 Settings > Environment Variables"
echo "   - 添加: NEXT_PUBLIC_API_BASE_URL"
echo "   - 值: https://concept-stock-screener-api.sandy246836.workers.dev"
echo ""
echo "2. 🔄 重新部署專案："
echo "   - 在 Vercel Dashboard 點擊 Redeploy"
echo "   - 等待部署完成"
echo ""
echo "3. 🧪 驗證部署結果："
echo "   - 訪問: https://concept-stock-screener.vercel.app"
echo "   - 測試搜尋功能"
echo "   - 檢查 RAG 功能是否正常"
echo ""
echo "✅ 立即項目執行完成！"
