#!/bin/bash

# Push 後 CI/CD 狀態檢查腳本
# 等待 40 秒後檢查一次 GitHub Actions 狀態

set -e

REPO="CamillaWu/concept_stock_screener"
BRANCH="develop"
WAIT_TIME=40

echo "🚀 Push 後 CI/CD 狀態檢查..."
echo "📦 倉庫: $REPO"
echo "🌿 分支: $BRANCH"
echo "⏰ 等待時間: ${WAIT_TIME}秒"
echo "⏰ 開始時間: $(date)"
echo ""

echo "⏳ 等待 ${WAIT_TIME} 秒讓 GitHub Actions 開始運行..."
sleep $WAIT_TIME

echo "🔄 檢查時間: $(date)"
echo ""

# 獲取最新的 workflow run
LATEST_RUN=$(gh run list --repo $REPO --branch $BRANCH --limit 1 --json databaseId,status,conclusion,displayTitle,workflowName,headSha)

if [ $? -eq 0 ]; then
    RUN_ID=$(echo "$LATEST_RUN" | jq -r '.[0].databaseId')
    STATUS=$(echo "$LATEST_RUN" | jq -r '.[0].status')
    CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion')
    TITLE=$(echo "$LATEST_RUN" | jq -r '.[0].displayTitle')
    WORKFLOW=$(echo "$LATEST_RUN" | jq -r '.[0].workflowName')
    COMMIT_HASH=$(echo "$LATEST_RUN" | jq -r '.[0].headSha')

    echo "📊 最新運行: $RUN_ID"
    echo "📝 標題: $TITLE"
    echo "⚙️ 工作流程: $WORKFLOW"
    echo "🔄 狀態: $STATUS"
    echo "✅ 結論: $CONCLUSION"
    echo "🔗 Commit: ${COMMIT_HASH:0:8}"

    if [ "$STATUS" = "completed" ]; then
        if [ "$CONCLUSION" = "success" ]; then
            echo ""
            echo "🎉 CI/CD 成功！"
            echo "✅ 所有問題已解決！"
        else
            echo ""
            echo "❌ CI/CD 失敗，檢查錯誤..."
            gh run view $RUN_ID --log | grep -A 5 -B 5 "error\|Error\|ERROR" || echo "沒有找到錯誤信息"
        fi
    else
        echo ""
        echo "⏳ 仍在運行中..."
        echo "💡 提示：可以稍後手動檢查或再次運行此腳本"
    fi
else
    echo "❌ 無法獲取運行狀態"
fi

echo ""
echo "🎯 檢查完成！"
