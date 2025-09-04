#!/bin/bash

# CI/CD 監控配置文件
# 用於配置監控參數和通知設置

# 監控配置
export MONITOR_REPO="CamillaWu/concept_stock_screener"
export MONITOR_BRANCH="develop"
export MONITOR_INTERVAL=60          # 檢查間隔（秒）
export MAX_CONSECUTIVE_FAILURES=3    # 最大連續失敗次數
export SUCCESS_WAIT_TIME=300        # 成功後等待時間（秒）

# 通知配置
export ENABLE_NOTIFICATIONS=true    # 啟用通知
export NOTIFICATION_EMAIL=""        # 通知郵箱（可選）
export SLACK_WEBHOOK_URL=""         # Slack webhook URL（可選）

# 自動修復配置
export AUTO_FIX_ENABLED=true        # 啟用自動修復
export AUTO_FIX_NODE_VERSION=true   # 自動修復 Node.js 版本
export AUTO_FIX_PNPM=true           # 自動修復 pnpm 問題
export AUTO_FIX_WRANGLER=true       # 自動修復 wrangler 配置
export AUTO_FIX_TESTS=true          # 自動修復測試問題
export AUTO_FIX_SECURITY=true       # 自動修復安全漏洞
export AUTO_FIX_BUILD=true          # 自動修復構建問題

# 日誌配置
export LOG_LEVEL="INFO"             # 日誌級別：DEBUG, INFO, WARN, ERROR
export LOG_FILE="logs/monitor.log"  # 日誌文件路徑
export MAX_LOG_SIZE=10MB            # 最大日誌文件大小

# 性能配置
export ENABLE_PERFORMANCE_MONITORING=true  # 啟用性能監控
export PERFORMANCE_CHECK_INTERVAL=300      # 性能檢查間隔（秒）

# 清理配置
export CLEANUP_ENABLED=true         # 啟用自動清理
export CLEANUP_INTERVAL=3600        # 清理間隔（秒）
export MAX_LOG_AGE=7                # 日誌最大保留天數

# 健康檢查配置
export HEALTH_CHECK_ENABLED=true    # 啟用健康檢查
export HEALTH_CHECK_INTERVAL=300    # 健康檢查間隔（秒）

# 顯示配置
show_config() {
    echo "🔧 CI/CD 監控配置"
    echo "========================================"
    echo "📊 監控倉庫: $MONITOR_REPO"
    echo "🌿 監控分支: $MONITOR_BRANCH"
    echo "⏰ 檢查間隔: ${MONITOR_INTERVAL}秒"
    echo "🛑 最大連續失敗: ${MAX_CONSECUTIVE_FAILURES}次"
    echo "💤 成功後等待: ${SUCCESS_WAIT_TIME}秒"
    echo ""
    echo "🔔 通知設置:"
    echo "   - 啟用通知: $ENABLE_NOTIFICATIONS"
    echo "   - 通知郵箱: ${NOTIFICATION_EMAIL:-未設置}"
    echo "   - Slack webhook: ${SLACK_WEBHOOK_URL:-未設置}"
    echo ""
    echo "🔧 自動修復設置:"
    echo "   - 啟用自動修復: $AUTO_FIX_ENABLED"
    echo "   - Node.js 版本修復: $AUTO_FIX_NODE_VERSION"
    echo "   - pnpm 修復: $AUTO_FIX_PNPM"
    echo "   - wrangler 修復: $AUTO_FIX_WRANGLER"
    echo "   - 測試修復: $AUTO_FIX_TESTS"
    echo "   - 安全漏洞修復: $AUTO_FIX_SECURITY"
    echo "   - 構建修復: $AUTO_FIX_BUILD"
    echo ""
    echo "📝 日誌設置:"
    echo "   - 日誌級別: $LOG_LEVEL"
    echo "   - 日誌文件: $LOG_FILE"
    echo "   - 最大日誌大小: $MAX_LOG_SIZE"
    echo ""
    echo "⚡ 性能設置:"
    echo "   - 性能監控: $ENABLE_PERFORMANCE_MONITORING"
    echo "   - 性能檢查間隔: ${PERFORMANCE_CHECK_INTERVAL}秒"
    echo ""
    echo "🧹 清理設置:"
    echo "   - 自動清理: $CLEANUP_ENABLED"
    echo "   - 清理間隔: ${CLEANUP_INTERVAL}秒"
    echo "   - 日誌保留天數: ${MAX_LOG_AGE}天"
    echo ""
    echo "🏥 健康檢查:"
    echo "   - 健康檢查: $HEALTH_CHECK_ENABLED"
    echo "   - 檢查間隔: ${HEALTH_CHECK_INTERVAL}秒"
    echo "========================================"
}

# 驗證配置
validate_config() {
    local errors=0

    echo "🔍 驗證配置..."

    # 檢查必需配置
    if [ -z "$MONITOR_REPO" ]; then
        echo "❌ 錯誤: MONITOR_REPO 未設置"
        errors=$((errors + 1))
    fi

    if [ -z "$MONITOR_BRANCH" ]; then
        echo "❌ 錯誤: MONITOR_BRANCH 未設置"
        errors=$((errors + 1))
    fi

    if [ "$MONITOR_INTERVAL" -lt 10 ]; then
        echo "❌ 錯誤: MONITOR_INTERVAL 不能小於 10 秒"
        errors=$((errors + 1))
    fi

    if [ "$MAX_CONSECUTIVE_FAILURES" -lt 1 ]; then
        echo "❌ 錯誤: MAX_CONSECUTIVE_FAILURES 不能小於 1"
        errors=$((errors + 1))
    fi

    # 檢查依賴
    if ! command -v gh &> /dev/null; then
        echo "❌ 錯誤: 需要安裝 GitHub CLI (gh)"
        errors=$((errors + 1))
    fi

    if ! command -v jq &> /dev/null; then
        echo "❌ 錯誤: 需要安裝 jq"
        errors=$((errors + 1))
    fi

    if [ $errors -eq 0 ]; then
        echo "✅ 配置驗證通過"
        return 0
    else
        echo "❌ 配置驗證失敗，發現 $errors 個錯誤"
        return 1
    fi
}

# 創建日誌目錄
create_log_directory() {
    local log_dir=$(dirname "$LOG_FILE")
    if [ ! -d "$log_dir" ]; then
        echo "📁 創建日誌目錄: $log_dir"
        mkdir -p "$log_dir"
    fi
}

# 主函數
main() {
    case "${1:-show}" in
        "show")
            show_config
            ;;
        "validate")
            validate_config
            ;;
        "init")
            create_log_directory
            validate_config
            ;;
        *)
            echo "用法: $0 {show|validate|init}"
            echo "  show     - 顯示當前配置"
            echo "  validate - 驗證配置"
            echo "  init     - 初始化配置（創建日誌目錄等）"
            exit 1
            ;;
    esac
}

# 如果直接執行此腳本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
