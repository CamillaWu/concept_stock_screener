#!/bin/bash

# 概念股篩選系統 - macOS 環境設置腳本
# 用於在 macOS 上設置開發環境

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 腳本目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_header() {
    echo -e "\n${PURPLE}============================================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}============================================================${NC}"
}

# 檢查 macOS 版本
check_macos_version() {
    log_header "檢查 macOS 版本"
    
    local macos_version=$(sw_vers -productVersion)
    local major_version=$(echo "$macos_version" | cut -d. -f1)
    
    log "當前 macOS 版本: $macos_version"
    
    if [ "$major_version" -lt 10 ]; then
        log_error "不支援的 macOS 版本，需要 macOS 10.15 或更高版本"
        exit 1
    elif [ "$major_version" -eq 10 ]; then
        local minor_version=$(echo "$macos_version" | cut -d. -f2)
        if [ "$minor_version" -lt 15 ]; then
            log_error "不支援的 macOS 版本，需要 macOS 10.15 或更高版本"
            exit 1
        fi
    fi
    
    log_success "macOS 版本檢查通過"
}

# 安裝 Xcode Command Line Tools
install_xcode_tools() {
    log_header "安裝 Xcode Command Line Tools"
    
    if xcode-select -p &> /dev/null; then
        log_success "Xcode Command Line Tools 已安裝"
        return 0
    fi
    
    log "正在安裝 Xcode Command Line Tools..."
    log "這可能需要一些時間，請耐心等待..."
    
    xcode-select --install
    
    log_warning "請在彈出的對話框中完成安裝，然後按任意鍵繼續..."
    read -n 1 -s -r -p ""
    
    # 等待安裝完成
    while ! xcode-select -p &> /dev/null; do
        log "等待 Xcode Command Line Tools 安裝完成..."
        sleep 10
    done
    
    log_success "Xcode Command Line Tools 安裝完成"
}

# 安裝 Homebrew
install_homebrew() {
    log_header "安裝 Homebrew"
    
    if command -v brew &> /dev/null; then
        log_success "Homebrew 已安裝"
        return 0
    fi
    
    log "正在安裝 Homebrew..."
    
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # 設置 PATH
    if [[ "$(uname -m)" == "arm64" ]]; then
        # Apple Silicon
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        # Intel
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    log_success "Homebrew 安裝完成"
}

# 安裝 Node.js
install_nodejs() {
    log_header "安裝 Node.js"
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log "Node.js 已安裝，版本: $node_version"
        
        # 檢查版本是否過舊
        local major_version=$(echo "$node_version" | cut -d. -f1 | tr -d 'v')
        if [ "$major_version" -lt 16 ]; then
            log_warning "Node.js 版本過舊，建議升級到 16 或更高版本"
            log "正在升級 Node.js..."
            brew upgrade node
        else
            log_success "Node.js 版本檢查通過"
            return 0
        fi
    else
        log "正在安裝 Node.js..."
        brew install node
    fi
    
    log_success "Node.js 安裝完成"
}

# 安裝 Git
install_git() {
    log_header "安裝 Git"
    
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        log "Git 已安裝: $git_version"
        return 0
    fi
    
    log "正在安裝 Git..."
    brew install git
    
    log_success "Git 安裝完成"
}

# 安裝其他開發工具
install_dev_tools() {
    log_header "安裝開發工具"
    
    local tools=("wget" "curl" "jq" "tree")
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "正在安裝 $tool..."
            brew install "$tool"
        else
            log "$tool 已安裝"
        fi
    done
    
    log_success "開發工具安裝完成"
}

# 設置 Git 配置
setup_git_config() {
    log_header "設置 Git 配置"
    
    if [ -z "$(git config --global user.name)" ]; then
        log_warning "Git 用戶名未設置"
        read -p "請輸入您的 Git 用戶名: " git_username
        if [ -n "$git_username" ]; then
            git config --global user.name "$git_username"
        fi
    fi
    
    if [ -z "$(git config --global user.email)" ]; then
        log_warning "Git 郵箱未設置"
        read -p "請輸入您的 Git 郵箱: " git_email
        if [ -n "$git_email" ]; then
            git config --global user.email "$git_email"
        fi
    fi
    
    # 設置默認分支名稱
    git config --global init.defaultBranch main
    
    log_success "Git 配置設置完成"
}

# 安裝測試依賴
install_test_dependencies() {
    log_header "安裝測試依賴"
    
    cd "$SCRIPT_DIR"
    
    if [ -f "package.json" ]; then
        log "正在安裝測試依賴..."
        npm install
        log_success "測試依賴安裝完成"
    else
        log_warning "未找到 package.json，跳過測試依賴安裝"
    fi
}

# 創建開發環境配置文件
create_dev_config() {
    log_header "創建開發環境配置"
    
    local config_dir="$HOME/.concept-stock-screener"
    mkdir -p "$config_dir"
    
    local config_file="$config_dir/config.json"
    
    if [ ! -f "$config_file" ]; then
        cat > "$config_file" << EOF
{
  "environment": "development",
  "platform": "macos",
  "setup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "node_version": "$(node --version 2>/dev/null || echo 'unknown')",
  "npm_version": "$(npm --version 2>/dev/null || echo 'unknown')",
  "homebrew_version": "$(brew --version 2>/dev/null | head -1 || echo 'unknown')"
}
EOF
        log_success "開發環境配置文件已創建: $config_file"
    else
        log "開發環境配置文件已存在"
    fi
}

# 顯示系統資訊
show_system_info() {
    log_header "系統資訊"
    
    log "macOS 版本: $(sw_vers -productVersion)"
    log "架構: $(uname -m)"
    log "處理器: $(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo '無法獲取')"
    
    local total_mem=$(sysctl -n hw.memsize 2>/dev/null)
    if [ -n "$total_mem" ]; then
        local total_mem_gb=$((total_mem / 1024 / 1024 / 1024))
        log "總記憶體: ${total_mem_gb}GB"
    fi
    
    log "可用磁碟空間: $(df -h . | tail -1 | awk '{print $4}')"
    
    if command -v node &> /dev/null; then
        log "Node.js 版本: $(node --version)"
    fi
    
    if command -v npm &> /dev/null; then
        log "npm 版本: $(npm --version)"
    fi
    
    if command -v git &> /dev/null; then
        log "Git 版本: $(git --version)"
    fi
}

# 顯示後續步驟
show_next_steps() {
    log_header "設置完成！後續步驟"
    
    echo ""
    echo "🎉 恭喜！您的 macOS 開發環境已設置完成。"
    echo ""
    echo "📋 接下來您可以："
    echo "  1. 進入專案目錄: cd $SCRIPT_DIR/.."
    echo "  2. 運行測試: ./scripts/test-runner-mac.sh all"
    echo "  3. 查看測試覆蓋率: ./scripts/test-runner-mac.sh coverage"
    echo "  4. 開始開發！"
    echo ""
    echo "🔧 有用的命令："
    echo "  - 查看幫助: ./scripts/test-runner-mac.sh help"
    echo "  - 清理測試文件: ./scripts/test-runner-mac.sh clean"
    echo "  - 顯示系統資訊: ./scripts/test-runner-mac.sh macos"
    echo ""
    echo "📚 如需更多幫助，請查看專案文檔。"
    echo ""
}

# 主函數
main() {
    log_header "概念股篩選系統 - macOS 環境設置"
    
    log "歡迎使用 macOS 環境設置腳本！"
    log "此腳本將幫助您設置完整的開發環境。"
    echo ""
    
    # 檢查 macOS 版本
    check_macos_version
    
    # 安裝必要工具
    install_xcode_tools
    install_homebrew
    install_nodejs
    install_git
    install_dev_tools
    
    # 設置配置
    setup_git_config
    create_dev_config
    
    # 安裝測試依賴
    install_test_dependencies
    
    # 顯示系統資訊
    show_system_info
    
    # 顯示後續步驟
    show_next_steps
}

# 錯誤處理
trap 'log_error "腳本執行失敗，退出碼: $?"' ERR

# 運行主函數
main "$@"
