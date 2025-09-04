#!/bin/bash

# 持續 CI/CD 監控腳本
# 每次 push 後等待 40 秒檢查，直到成功才停止

set -e

REPO="CamillaWu/concept_stock_screener"
BRANCH="develop"
WAIT_TIME=40
MAX_ATTEMPTS=100  # 最大嘗試次數，防止無限循環

echo "🚀 開始持續監控 CI/CD 狀態..."
echo "📦 倉庫: $REPO"
echo "🌿 分支: $BRANCH"
echo "⏰ 檢查間隔: ${WAIT_TIME}秒"
echo "⏰ 開始時間: $(date)"
echo ""

# 記錄最後檢查的 commit hash
LAST_COMMIT=""
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "🔄 第 $ATTEMPT 次檢查 - $(date)"

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

        # 檢查是否有新的 commit
        if [ "$COMMIT_HASH" != "$LAST_COMMIT" ]; then
            echo "🆕 發現新的 commit！"
            LAST_COMMIT="$COMMIT_HASH"
        fi

        if [ "$STATUS" = "completed" ]; then
            if [ "$CONCLUSION" = "success" ]; then
                echo ""
                echo "🎉 CI/CD 成功！"
                echo "✅ 所有問題已解決！"
                echo "⏰ 成功時間: $(date)"
                echo "🔄 總共檢查次數: $ATTEMPT"
                break
            else
                echo ""
                echo "❌ CI/CD 失敗，檢查錯誤..."
                echo "🔍 獲取詳細錯誤信息..."
                gh run view $RUN_ID --log | grep -A 10 -B 5 "error\|Error\|ERROR" || echo "沒有找到錯誤信息"
                echo ""
                echo "💡 分析問題並修復..."
            fi
        else
            echo ""
            echo "⏳ 仍在運行中..."
        fi
    else
        echo "❌ 無法獲取運行狀態"
    fi

    echo ""
    echo "⏰ 等待 ${WAIT_TIME} 秒後重新檢查..."
    echo "----------------------------------------"

    # 如果不是最後一次嘗試，則等待
    if [ $ATTEMPT -lt $MAX_ATTEMPTS ]; then
        sleep $WAIT_TIME
    fi

    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo ""
    echo "⚠️ 達到最大嘗試次數 ($MAX_ATTEMPTS)"
    echo "❌ 監控任務結束，但 CI/CD 仍未成功"
    exit 1
else
    echo ""
    echo "🎯 監控任務完成！"
    echo "✅ CI/CD 已成功！"
    exit 0
fi
