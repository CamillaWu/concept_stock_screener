#!/bin/bash

# CI/CD 狀態監控腳本
# 每分鐘檢查一次 GitHub Actions 狀態

set -e

REPO="CamillaWu/concept_stock_screener"
BRANCH="develop"

echo "🔍 開始監控 CI/CD 狀態..."
echo "📦 倉庫: $REPO"
echo "🌿 分支: $BRANCH"
echo "⏰ 開始時間: $(date)"
echo ""

while true; do
    echo "🔄 檢查時間: $(date)"
    
    # 獲取最新的 workflow run
    LATEST_RUN=$(gh run list --repo $REPO --branch $BRANCH --limit 1 --json id,status,conclusion,title,workflowName,createdAt)
    
    if [ $? -eq 0 ]; then
        RUN_ID=$(echo "$LATEST_RUN" | jq -r '.[0].id')
        STATUS=$(echo "$LATEST_RUN" | jq -r '.[0].status')
        CONCLUSION=$(echo "$LATEST_RUN" | jq -r '.[0].conclusion')
        TITLE=$(echo "$LATEST_RUN" | jq -r '.[0].title')
        WORKFLOW=$(echo "$LATEST_RUN" | jq -r '.[0].workflowName')
        
        echo "📊 最新運行: $RUN_ID"
        echo "📝 標題: $TITLE"
        echo "⚙️ 工作流程: $WORKFLOW"
        echo "🔄 狀態: $STATUS"
        echo "✅ 結論: $CONCLUSION"
        
        if [ "$STATUS" = "completed" ]; then
            if [ "$CONCLUSION" = "success" ]; then
                echo "🎉 CI/CD 成功！"
                echo "✅ 問題已解決！"
                break
            else
                echo "❌ CI/CD 失敗，檢查錯誤..."
                gh run view $RUN_ID --log | grep -A 5 -B 5 "error\|Error\|ERROR" || echo "沒有找到錯誤信息"
            fi
        else
            echo "⏳ 仍在運行中..."
        fi
    else
        echo "❌ 無法獲取運行狀態"
    fi
    
    echo ""
    echo "⏰ 等待 60 秒後重新檢查..."
    echo "----------------------------------------"
    sleep 60
done

echo ""
echo "🎯 監控完成！"
