#!/bin/bash

# 開發環境監控腳本

set -e

# 配置
LOG_FILE="logs/dev-monitor.log"
CHECK_INTERVAL=30
MAX_LOG_SIZE=10485760  # 10MB

# 創建日誌目錄
mkdir -p logs

# 日誌函數
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# 檢查日誌文件大小
check_log_size() {
    if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null) -gt $MAX_LOG_SIZE ]; then
        mv "$LOG_FILE" "${LOG_FILE}.old"
        log "INFO" "日誌文件已輪轉"
    fi
}

# 檢查服務狀態
check_service_status() {
    local service_name=$1
    local port=$2

    if lsof -i :$port > /dev/null 2>&1; then
        log "INFO" "$service_name 服務運行正常 (端口: $port)"
        return 0
    else
        log "ERROR" "$service_name 服務未運行 (端口: $port)"
        return 1
    fi
}

# 檢查系統資源
check_system_resources() {
    # CPU 使用率
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
    log "INFO" "CPU 使用率: ${cpu_usage}%"

    # 記憶體使用率
    local mem_info=$(vm_stat | grep "Pages free:" | awk '{print $3}' | sed 's/\.//')
    local mem_total=$(vm_stat | grep "Pages active:" | awk '{print $3}' | sed 's/\.//')
    local mem_usage=$((100 - (mem_info * 100 / mem_total)))
    log "INFO" "記憶體使用率: ${mem_usage}%"

    # 磁碟使用率
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    log "INFO" "磁碟使用率: ${disk_usage}%"
}

# 檢查網絡連接
check_network() {
    if ping -c 1 8.8.8.8 > /dev/null 2>&1; then
        log "INFO" "網絡連接正常"
    else
        log "WARNING" "網絡連接異常"
    fi
}

# 主監控循環
main() {
    log "INFO" "開發環境監控啟動"

    while true; do
        log "INFO" "=== 開始監控檢查 ==="

        # 檢查日誌大小
        check_log_size

        # 檢查服務狀態
        check_service_status "前端" 3000
        check_service_status "API" 8787
        check_service_status "數據管道" 8000

        # 檢查系統資源
        check_system_resources

        # 檢查網絡
        check_network

        log "INFO" "=== 監控檢查完成 ==="
        log "INFO" "等待 $CHECK_INTERVAL 秒後進行下次檢查..."

        sleep $CHECK_INTERVAL
    done
}

# 信號處理
trap 'log "INFO" "監控腳本收到中斷信號，正在退出..."; exit 0' INT TERM

main "$@"
