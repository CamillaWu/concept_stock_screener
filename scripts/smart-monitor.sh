#!/bin/bash

# 智能 CI/CD 監控腳本
# 自動分析失敗原因並提供修復建議

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
REPO="CamillaWu/concept_stock_screener"
BRANCH="develop"
CHECK_INTERVAL=60  # 60秒檢查一次
MAX_FAILURES=3     # 連續失敗3次後停止

# 統計變量
total_checks=0
success_count=0
failure_count=0
consecutive_failures=0

echo "🚀 啟動智能 CI/CD 監控系統"
echo "📊 監控倉庫: $REPO"
echo "🌿 監控分支: $BRANCH"
echo "⏰ 檢查間隔: ${CHECK_INTERVAL}秒"
echo "🛑 連續失敗限制: ${MAX_FAILURES}次"
echo "----------------------------------------"

# 函數：分析失敗原因
analyze_failure() {
    local run_id=$1
    echo -e "\n🔍 分析失敗原因 (運行ID: $run_id)..."
    
    # 獲取詳細日誌
    local logs=$(gh run view "$run_id" --log 2>/dev/null)
    
    if [ -z "$logs" ]; then
        echo "❌ 無法獲取日誌信息"
        return 1
    fi
    
    # 分析常見錯誤模式
    echo "📋 錯誤分析結果："
    
    # 檢查 Node.js 版本問題
    if echo "$logs" | grep -q "Wrangler requires at least Node.js v20"; then
        echo -e "❌ ${RED}Node.js 版本過低${NC}"
        echo "   - 需要: Node.js v20.0.0+"
        echo "   - 當前: Node.js v18.x"
        echo "   - 修復: 更新 workflow 中的 NODE_VERSION 到 '20'"
        echo "   - 文件: .github/workflows/*.yml"
    fi
    
    # 檢查 pnpm 問題
    if echo "$logs" | grep -q "ERR_PNPM"; then
        echo -e "❌ ${RED}pnpm 安裝或構建失敗${NC}"
        echo "   - 可能原因: 依賴衝突、版本不兼容"
        echo "   - 修復: 檢查 package.json 和 pnpm-lock.yaml"
    fi
    
    # 檢查 wrangler 問題
    if echo "$logs" | grep -q "wrangler build"; then
        echo -e "❌ ${RED}Cloudflare Workers 構建失敗${NC}"
        echo "   - 可能原因: 配置錯誤、依賴缺失"
        echo "   - 修復: 檢查 wrangler.toml 和 API 代碼"
    fi
    
    # 檢查測試失敗
    if echo "$logs" | grep -q "Tests:.*failed"; then
        local failed_tests=$(echo "$logs" | grep "Tests:" | head -1)
        echo -e "❌ ${RED}測試失敗${NC}"
        echo "   - 狀態: $failed_tests"
        echo "   - 修復: 檢查測試代碼和測試環境"
    fi
    
    # 檢查安全漏洞
    if echo "$logs" | grep -q "vulnerabilities found"; then
        local vuln_info=$(echo "$logs" | grep -A 5 "vulnerabilities found" | head -6)
        echo -e "❌ ${RED}安全漏洞${NC}"
        echo "   - 詳情: $vuln_info"
        echo "   - 修復: 運行 'pnpm audit fix' 或手動更新依賴"
    fi
    
    # 檢查構建錯誤
    if echo "$logs" | grep -q "Build failed\|Build error"; then
        echo -e "❌ ${RED}構建失敗${NC}"
        echo "   - 可能原因: 編譯錯誤、配置問題"
        echo "   - 修復: 檢查構建配置和代碼語法"
    fi
    
    echo ""
}

# 函數：提供修復建議
provide_fix_suggestions() {
    echo -e "\n💡 ${BLUE}修復建議：${NC}"
    echo "1. 檢查 GitHub Actions 日誌獲取詳細錯誤"
    echo "2. 根據錯誤分析結果進行針對性修復"
    echo "3. 修復後提交並推送代碼"
    echo "4. 等待新的 CI/CD 運行完成"
    echo "5. 如果仍有問題，重複此過程"
    echo ""
}

# 函數：檢查 CI/CD 狀態
check_ci_status() {
    local latest_run=$(gh run list --repo "$REPO" --branch "$BRANCH" --limit 1 --json databaseId,status,conclusion,headSha,url,createdAt,displayTitle --jq '.[0]')
    
    if [ -z "$latest_run" ] || [ "$latest_run" = "null" ]; then
        echo "❌ 無法獲取 CI/CD 狀態"
        return 1
    fi
    
    local run_id=$(echo "$latest_run" | jq -r '.databaseId')
    local status=$(echo "$latest_run" | jq -r '.status')
    local conclusion=$(echo "$latest_run" | jq -r '.conclusion')
    local title=$(echo "$latest_run" | jq -r '.displayTitle')
    local created_at=$(echo "$latest_run" | jq -r '.createdAt')
    local url=$(echo "$latest_run" | jq -r '.url')
    
    # 檢查必要字段
    if [ "$run_id" = "null" ] || [ "$status" = "null" ]; then
        echo "❌ CI/CD 狀態數據不完整"
        return 1
    fi
    
    # 格式化時間
    local local_time
    if [ "$created_at" != "null" ]; then
        local_time=$(date -d "$created_at" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "$created_at")
    else
        local_time="未知"
    fi
    
    echo -e "\n🔄 第 $((total_checks + 1)) 次檢查 - $(date '+%a %b %d %H:%M:%S %Z %Y')"
    echo "📊 最新運行: $run_id"
    echo "📝 標題: ${title:-未知}"
    echo "⚙️ 工作流程: 開發環境 CI/CD"
    echo "🔄 狀態: $status"
    echo "⏰ 創建時間: $local_time"
    echo "🔗 鏈接: ${url:-未知}"
    
    if [ "$status" = "completed" ]; then
        if [ "$conclusion" = "success" ]; then
            echo -e "✅ ${GREEN}結論: success${NC}"
            echo -e "🎉 ${GREEN}CI/CD 成功！${NC}"
            consecutive_failures=0
            success_count=$((success_count + 1))
            
            # 成功後等待更長時間
            echo "💤 CI/CD 成功，等待 5 分鐘後繼續監控..."
            sleep 300
            return 0
        else
            echo -e "❌ ${RED}結論: $conclusion${NC}"
            echo -e "💥 ${RED}CI/CD 失敗！${NC}"
            consecutive_failures=$((consecutive_failures + 1))
            failure_count=$((failure_count + 1))
            
            # 分析失敗原因
            analyze_failure "$run_id"
            
            # 提供修復建議
            provide_fix_suggestions
            
            # 檢查是否達到連續失敗限制
            if [ $consecutive_failures -ge $MAX_FAILURES ]; then
                echo -e "🛑 ${YELLOW}連續失敗 $consecutive_failures 次，停止監控${NC}"
                echo "請手動檢查並修復問題後重新啟動監控"
                return 1
            fi
            
            echo -e "⏰ 等待 ${CHECK_INTERVAL} 秒後重新檢查..."
            sleep $CHECK_INTERVAL
            return 0
        fi
    else
        echo -e "⏳ ${YELLOW}狀態: $status${NC}"
        echo -e "🔄 ${BLUE}CI/CD 正在運行中...${NC}"
        echo -e "⏰ 等待 ${CHECK_INTERVAL} 秒後重新檢查..."
        sleep $CHECK_INTERVAL
        return 0
    fi
}

# 主監控循環
main() {
    while true; do
        if check_ci_status; then
            total_checks=$((total_checks + 1))
        else
            break
        fi
    done
    
    # 顯示統計信息
    echo -e "\n📊 ${BLUE}監控統計：${NC}"
    echo "總檢查次數: $total_checks"
    echo "成功次數: $success_count"
    echo "失敗次數: $failure_count"
    if [ $total_checks -gt 0 ]; then
        echo "成功率: $((success_count * 100 / total_checks))%"
    else
        echo "成功率: 0% (無檢查記錄)"
    fi
}

# 錯誤處理
trap 'echo -e "\n🛑 監控被中斷"; exit 1' INT TERM

# 檢查依賴
if ! command -v gh &> /dev/null; then
    echo "❌ 錯誤: 需要安裝 GitHub CLI (gh)"
    echo "安裝命令: brew install gh"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "❌ 錯誤: 需要安裝 jq"
    echo "安裝命令: brew install jq"
    exit 1
fi

# 檢查 GitHub 認證
if ! gh auth status &> /dev/null; then
    echo "❌ 錯誤: 需要 GitHub 認證"
    echo "認證命令: gh auth login"
    exit 1
fi

# 啟動主監控
main
