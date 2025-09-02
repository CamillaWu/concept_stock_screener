#!/bin/bash

# 概念股篩選系統 - macOS 快速啟動腳本
# 一鍵設置和運行測試環境

set -e

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 腳本目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 日誌函數
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_header() {
    echo -e "\n${PURPLE}============================================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}============================================================${NC}"
}

# 檢查腳本權限
check_permissions() {
    log "檢查腳本權限..."
    
    local scripts=("setup-macos.sh" "test-runner-mac.sh")
    
    for script in "${scripts[@]}"; do
        if [ ! -x "$SCRIPT_DIR/$script" ]; then
            log "設置 $script 執行權限..."
            chmod +x "$SCRIPT_DIR/$script"
        fi
    done
    
    log_success "腳本權限檢查完成"
}

# 快速設置
quick_setup() {
    log_header "快速設置 macOS 開發環境"
    
    if [ -f "$HOME/.concept-stock-screener/config.json" ]; then
        log "檢測到現有配置，跳過環境設置"
        return 0
    fi
    
    log "開始設置開發環境..."
    "$SCRIPT_DIR/setup-macos.sh"
}

# 安裝測試依賴
install_dependencies() {
    log_header "安裝測試依賴"
    
    cd "$SCRIPT_DIR"
    
    if [ -f "package.json" ]; then
        log "安裝 npm 依賴..."
        npm install
        log_success "依賴安裝完成"
    else
        log "未找到 package.json"
    fi
}

# 運行測試
run_tests() {
    log_header "運行測試套件"
    
    log "開始執行測試..."
    "$SCRIPT_DIR/test-runner-mac.sh" all
    
    if [ $? -eq 0 ]; then
        log_success "所有測試通過！"
    else
        log "部分測試失敗，請檢查錯誤訊息"
    fi
}

# 生成報告
generate_reports() {
    log_header "生成測試報告"
    
    log "生成覆蓋率報告..."
    "$SCRIPT_DIR/test-runner-mac.sh" coverage
    
    log "生成測試報告..."
    "$SCRIPT_DIR/test-runner-mac.sh" report
}

# 顯示完成訊息
show_completion() {
    log_header "🎉 快速啟動完成！"
    
    echo ""
    echo "📋 接下來您可以："
    echo "  1. 查看測試覆蓋率: ./scripts/test-runner-mac.sh coverage"
    echo "  2. 運行特定測試: ./scripts/test-runner-mac.sh unit"
    echo "  3. 清理測試文件: ./scripts/test-runner-mac.sh clean"
    echo "  4. 開始開發！"
    echo ""
    echo "🔧 有用的命令："
    echo "  - 查看幫助: ./scripts/test-runner-mac.sh help"
    echo "  - 系統資訊: ./scripts/test-runner-mac.sh macos"
    echo ""
    echo "📚 專案文檔位於 docs/ 目錄"
    echo ""
}

# 主函數
main() {
    log_header "概念股篩選系統 - macOS 快速啟動"
    
    log "歡迎使用快速啟動腳本！"
    log "此腳本將自動完成環境設置和測試執行。"
    echo ""
    
    # 檢查腳本權限
    check_permissions
    
    # 快速設置
    quick_setup
    
    # 安裝依賴
    install_dependencies
    
    # 運行測試
    run_tests
    
    # 生成報告
    generate_reports
    
    # 顯示完成訊息
    show_completion
}

# 錯誤處理
trap 'echo -e "${RED}❌ 腳本執行失敗${NC}"; exit 1' ERR

# 運行主函數
main "$@"
