#!/bin/bash

# 概念股篩選系統 - 測試執行腳本
# 用於執行不同類型的測試並生成報告

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 腳本目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TESTS_DIR="$SCRIPT_DIR/tests"

# 日誌函數
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}============================================================${NC}"
}

# 檢查依賴
check_dependencies() {
    log "檢查依賴..."
    
    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安裝"
        exit 1
    fi
    
    # 檢查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安裝"
        exit 1
    fi
    
    # 檢查 Jest
    if ! npx jest --version &> /dev/null; then
        log_warning "Jest 未安裝，正在安裝..."
        npm install --save-dev jest
    fi
    
    log_success "依賴檢查完成"
}

# 安裝測試依賴
install_test_dependencies() {
    log "安裝測試依賴..."
    
    cd "$SCRIPT_DIR"
    
    if [ -f "package.json" ]; then
        npm install
        log_success "測試依賴安裝完成"
    else
        log_warning "未找到 package.json，跳過依賴安裝"
    fi
}

# 運行單元測試
run_unit_tests() {
    log_header "運行單元測試"
    
    cd "$TESTS_DIR"
    
    if [ -d "unit" ]; then
        log "執行單元測試..."
        npx jest unit --coverage --testTimeout=30000 || {
            log_error "單元測試失敗"
            return 1
        }
        log_success "單元測試完成"
    else
        log_warning "單元測試目錄不存在"
    fi
}

# 運行整合測試
run_integration_tests() {
    log_header "運行整合測試"
    
    cd "$TESTS_DIR"
    
    if [ -d "integration" ]; then
        log "執行整合測試..."
        npx jest integration --coverage --testTimeout=30000 || {
            log_error "整合測試失敗"
            return 1
        }
        log_success "整合測試完成"
    else
        log_warning "整合測試目錄不存在"
    fi
}

# 運行端到端測試
run_e2e_tests() {
    log_header "運行端到端測試"
    
    cd "$TESTS_DIR"
    
    if [ -d "e2e" ]; then
        log "執行端到端測試..."
        npx jest e2e --coverage --testTimeout=30000 || {
            log_error "端到端測試失敗"
            return 1
        }
        log_success "端到端測試完成"
    else
        log_warning "端到端測試目錄不存在"
    fi
}

# 運行效能測試
run_performance_tests() {
    log_header "運行效能測試"
    
    cd "$TESTS_DIR"
    
    if [ -d "performance" ]; then
        log "執行效能測試..."
        npx jest performance --coverage --testTimeout=30000 || {
            log_error "效能測試失敗"
            return 1
        }
        log_success "效能測試完成"
    else
        log_warning "效能測試目錄不存在"
    fi
}

# 運行所有測試
run_all_tests() {
    log_header "運行所有測試"
    
    local failed_tests=0
    
    # 單元測試
    if run_unit_tests; then
        log_success "單元測試通過"
    else
        log_error "單元測試失敗"
        ((failed_tests++))
    fi
    
    # 整合測試
    if run_integration_tests; then
        log_success "整合測試通過"
    else
        log_error "整合測試失敗"
        ((failed_tests++))
    fi
    
    # 端到端測試
    if run_e2e_tests; then
        log_success "端到端測試通過"
    else
        log_error "端到端測試失敗"
        ((failed_tests++))
    fi
    
    # 效能測試
    if run_performance_tests; then
        log_success "效能測試通過"
    else
        log_error "效能測試失敗"
        ((failed_tests++))
    fi
    
    # 總結
    if [ $failed_tests -eq 0 ]; then
        log_success "所有測試都通過了！"
        return 0
    else
        log_error "$failed_tests 個測試類型失敗"
        return 1
    fi
}

# 生成覆蓋率報告
generate_coverage_report() {
    log_header "生成覆蓋率報告"
    
    cd "$TESTS_DIR"
    
    if [ -d "coverage" ]; then
        log "覆蓋率報告已生成"
        log "報告位置: $TESTS_DIR/coverage"
        
        # 檢查 HTML 報告
        if [ -f "coverage/index.html" ]; then
            log "HTML 報告: coverage/index.html"
        fi
        
        # 檢查 LCOV 報告
        if [ -f "coverage/lcov.info" ]; then
            log "LCOV 報告: coverage/lcov.info"
        fi
        
        # 運行覆蓋率追蹤器
        if [ -f "coverage-tracker.js" ]; then
            log "運行覆蓋率追蹤器..."
            node coverage-tracker.js report
        fi
        
        log_success "覆蓋率報告生成完成"
    else
        log_warning "覆蓋率報告未生成，請先運行測試"
    fi
}

# 清理測試文件
cleanup_test_files() {
    log_header "清理測試文件"
    
    cd "$TESTS_DIR"
    
    local dirs_to_clean=("coverage" "reports")
    
    for dir in "${dirs_to_clean[@]}"; do
        if [ -d "$dir" ]; then
            rm -rf "$dir"
            log_success "已清理 $dir 目錄"
        else
            log "目錄 $dir 不存在，跳過清理"
        fi
    done
    
    log_success "測試文件清理完成"
}

# 顯示幫助信息
show_help() {
    echo "概念股篩選系統 - 測試執行腳本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  unit          運行單元測試"
    echo "  integration   運行整合測試"
    echo "  e2e           運行端到端測試"
    echo "  performance   運行效能測試"
    echo "  all           運行所有測試"
    echo "  coverage      生成覆蓋率報告"
    echo "  clean         清理測試文件"
    echo "  install       安裝測試依賴"
    echo "  help          顯示此幫助信息"
    echo ""
    echo "示例:"
    echo "  $0 all         # 運行所有測試"
    echo "  $0 unit        # 只運行單元測試"
    echo "  $0 coverage    # 生成覆蓋率報告"
}

# 主函數
main() {
    local command="${1:-all}"
    
    log_header "概念股篩選系統 - 測試執行器"
    
    # 檢查依賴
    check_dependencies
    
    case "$command" in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "all")
            run_all_tests
            ;;
        "coverage")
            generate_coverage_report
            ;;
        "clean")
            cleanup_test_files
            ;;
        "install")
            install_test_dependencies
            ;;
        "help"|"-h"|"--help")
            show_help
            exit 0
            ;;
        *)
            log_error "未知命令: $command"
            show_help
            exit 1
            ;;
    esac
    
    log_header "測試執行完成"
}

# 錯誤處理
trap 'log_error "腳本執行失敗，退出碼: $?"' ERR

# 運行主函數
main "$@"
