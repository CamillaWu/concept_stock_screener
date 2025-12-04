#!/bin/bash

# 開發環境健康檢查腳本

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
WEB_URL="http://localhost:3000"
API_URL="http://localhost:8787"
PIPELINE_URL="http://localhost:8000"
TIMEOUT=10

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查服務健康狀態
check_service() {
    local service_name=$1
    local url=$2

    log_info "檢查 $service_name 服務..."

    if curl -s --max-time $TIMEOUT "$url/health" > /dev/null 2>&1; then
        log_success "$service_name 服務正常"
        return 0
    elif curl -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
        log_success "$service_name 服務響應正常"
        return 0
    else
        log_error "$service_name 服務無響應"
        return 1
    fi
}

# 檢查端口是否被佔用
check_port() {
    local port=$1
    local service_name=$2

    if lsof -i :$port > /dev/null 2>&1; then
        log_success "$service_name 端口 $port 正常"
        return 0
    else
        log_error "$service_name 端口 $port 未啟動"
        return 1
    fi
}

# 檢查依賴服務
check_dependencies() {
    log_info "檢查依賴服務..."

    # 檢查 Node.js
    if command -v node &> /dev/null; then
        log_success "Node.js 已安裝: $(node --version)"
    else
        log_error "Node.js 未安裝"
        return 1
    fi

    # 檢查 pnpm
    if command -v pnpm &> /dev/null; then
        log_success "pnpm 已安裝: $(pnpm --version)"
    else
        log_error "pnpm 未安裝"
        return 1
    fi

    return 0
}

# 檢查文件系統
check_filesystem() {
    log_info "檢查文件系統..."

    local required_files=(
        "package.json"
        "pnpm-lock.yaml"
        "pnpm-workspace.yaml"
        ".env.development"
    )

    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log_success "文件存在: $file"
        else
            log_warning "文件缺失: $file"
        fi
    done
}

# 主檢查流程
main() {
    log_info "開始開發環境健康檢查..."

    local exit_code=0

    # 檢查依賴
    if ! check_dependencies; then
        exit_code=1
    fi

    # 檢查文件系統
    check_filesystem

    # 檢查端口
    if ! check_port 3000 "前端服務"; then
        exit_code=1
    fi

    if ! check_port 8787 "API服務"; then
        exit_code=1
    fi

    if ! check_port 8000 "數據管道"; then
        exit_code=1
    fi

    # 檢查服務響應
    if ! check_service "前端" "$WEB_URL"; then
        exit_code=1
    fi

    if ! check_service "API" "$API_URL"; then
        exit_code=1
    fi

    if ! check_service "數據管道" "$PIPELINE_URL"; then
        exit_code=1
    fi

    # 總結
    if [ $exit_code -eq 0 ]; then
        log_success "🎉 開發環境健康檢查通過！"
    else
        log_error "❌ 開發環境健康檢查失敗"
    fi

    exit $exit_code
}

main "$@"
