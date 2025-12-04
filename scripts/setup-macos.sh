#!/bin/bash

# 概念?�篩?�系�?- macOS ?��?設置?�本
# ?�於??macOS 上設置�??�環�?

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ?�本?��?
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# ?��??�數
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}??$1${NC}"
}

log_warning() {
    echo -e "${YELLOW}?��?  $1${NC}"
}

log_error() {
    echo -e "${RED}??$1${NC}"
}

log_info() {
    echo -e "${CYAN}?��?  $1${NC}"
}

log_header() {
    echo -e "\n${PURPLE}============================================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}============================================================${NC}"
}

# 檢查 macOS ?�本
check_macos_version() {
    log_header "檢查 macOS ?�本"
    
    local macos_version=$(sw_vers -productVersion)
    local major_version=$(echo "$macos_version" | cut -d. -f1)
    
    log "?��? macOS ?�本: $macos_version"
    
    if [ "$major_version" -lt 10 ]; then
        log_error "不支?��? macOS ?�本，�?�?macOS 10.15 ?�更高�???
        exit 1
    elif [ "$major_version" -eq 10 ]; then
        local minor_version=$(echo "$macos_version" | cut -d. -f2)
        if [ "$minor_version" -lt 15 ]; then
            log_error "不支?��? macOS ?�本，�?�?macOS 10.15 ?�更高�???
            exit 1
        fi
    fi
    
    log_success "macOS ?�本檢查?��?"
}

# 安�? Xcode Command Line Tools
install_xcode_tools() {
    log_header "安�? Xcode Command Line Tools"
    
    if xcode-select -p &> /dev/null; then
        log_success "Xcode Command Line Tools 已�?�?
        return 0
    fi
    
    log "�?��安�? Xcode Command Line Tools..."
    log "?�可?��?要�?些�??��?請耐�?等�?..."
    
    xcode-select --install
    
    log_warning "請在彈出?��?話�?中�??��?裝�??��??�任?�鍵繼�?..."
    read -n 1 -s -r -p ""
    
    # 等�?安�?完�?
    while ! xcode-select -p &> /dev/null; do
        log "等�? Xcode Command Line Tools 安�?完�?..."
        sleep 10
    done
    
    log_success "Xcode Command Line Tools 安�?完�?"
}

# 安�? Homebrew
install_homebrew() {
    log_header "安�? Homebrew"
    
    if command -v brew &> /dev/null; then
        log_success "Homebrew 已�?�?
        return 0
    fi
    
    log "�?��安�? Homebrew..."
    
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
    
    log_success "Homebrew 安�?完�?"
}

# 安�? Node.js
install_nodejs() {
    log_header "安�? Node.js"
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log "Node.js 已�?裝�??�本: $node_version"
        
        # 檢查?�本?�否?��?
        local major_version=$(echo "$node_version" | cut -d. -f1 | tr -d 'v')
        if [ "$major_version" -lt 16 ]; then
            log_warning "Node.js ?�本?��?，建議�?級到 16 ?�更高�???
            log "�?��?��? Node.js..."
            brew upgrade node
        else
            log_success "Node.js ?�本檢查?��?"
            return 0
        fi
    else
        log "�?��安�? Node.js..."
        brew install node
    fi
    
    log_success "Node.js 安�?完�?"
}

# 安�? Git
install_git() {
    log_header "安�? Git"
    
    if command -v git &> /dev/null; then
        local git_version=$(git --version)
        log "Git 已�?�? $git_version"
        return 0
    fi
    
    log "�?��安�? Git..."
    brew install git
    
    log_success "Git 安�?完�?"
}

# 安�??��??�發工具
install_dev_tools() {
    log_header "安�??�發工具"
    
    local tools=("wget" "curl" "jq" "tree")
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "�?��安�? $tool..."
            brew install "$tool"
        else
            log "$tool 已�?�?
        fi
    done
    
    log_success "?�發工具安�?完�?"
}

# 設置 Git ?�置
setup_git_config() {
    log_header "設置 Git ?�置"
    
    if [ -z "$(git config --global user.name)" ]; then
        log_warning "Git ?�戶?�未設置"
        read -p "請輸?�您??Git ?�戶?? " git_username
        if [ -n "$git_username" ]; then
            git config --global user.name "$git_username"
        fi
    fi
    
    if [ -z "$(git config --global user.email)" ]; then
        log_warning "Git ?�箱?�設�?
        read -p "請輸?�您??Git ?�箱: " git_email
        if [ -n "$git_email" ]; then
            git config --global user.email "$git_email"
        fi
    fi
    
    # 設置默�??�支?�稱
    git config --global init.defaultBranch main
    
    log_success "Git ?�置設置完�?"
}

# 安�?測試依賴
install_test_dependencies() {
    log_header "安�?測試依賴"
    
    cd "$SCRIPT_DIR"
    bash "$PROJECT_ROOT/scripts/setup/configure-pnpm-linker.sh"
    
    if [ -f "package.json" ]; then
        log "�?��安�?測試依賴..."
        npm install
        log_success "測試依賴安�?完�?"
    else
        log_warning "?�找??package.json，跳?�測試�?賴�?�?
    fi
}

# ?�建?�發?��??�置?�件
create_dev_config() {
    log_header "?�建?�發?��??�置"
    
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
        log_success "?�發?��??�置?�件已創�? $config_file"
    else
        log "?�發?��??�置?�件已�???
    fi
}

# 顯示系統資�?
show_system_info() {
    log_header "系統資�?"
    
    log "macOS ?�本: $(sw_vers -productVersion)"
    log "?��?: $(uname -m)"
    log "?��??? $(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo '?��??��?')"
    
    local total_mem=$(sysctl -n hw.memsize 2>/dev/null)
    if [ -n "$total_mem" ]; then
        local total_mem_gb=$((total_mem / 1024 / 1024 / 1024))
        log "總�??��?: ${total_mem_gb}GB"
    fi
    
    log "?�用磁�?空�?: $(df -h . | tail -1 | awk '{print $4}')"
    
    if command -v node &> /dev/null; then
        log "Node.js ?�本: $(node --version)"
    fi
    
    if command -v npm &> /dev/null; then
        log "npm ?�本: $(npm --version)"
    fi
    
    if command -v git &> /dev/null; then
        log "Git ?�本: $(git --version)"
    fi
}

# 顯示後�?步�?
show_next_steps() {
    log_header "設置完�?！�?續步�?
    
    echo ""
    echo "?? ?��?！您??macOS ?�發?��?已設置�??��?
    echo ""
    echo "?? ?��?來您?�以�?
    echo "  1. ?�入專�??��?: cd $SCRIPT_DIR/.."
    echo "  2. ?��?測試: ./scripts/test-runner-mac.sh all"
    echo "  3. ?��?測試覆�??? ./scripts/test-runner-mac.sh coverage"
    echo "  4. ?��??�發�?
    echo ""
    echo "?�� ?�用?�命令�?"
    echo "  - ?��?幫助: ./scripts/test-runner-mac.sh help"
    echo "  - 清�?測試?�件: ./scripts/test-runner-mac.sh clean"
    echo "  - 顯示系統資�?: ./scripts/test-runner-mac.sh macos"
    echo ""
    echo "?? 如�??��?幫助，�??��?專�??��???
    echo ""
}

# 主函??
main() {
    log_header "概念?�篩?�系�?- macOS ?��?設置"
    
    log "歡�?使用 macOS ?��?設置?�本�?
    log "此腳?��?幫助?�設置�??��??�發?��???
    echo ""
    
    # 檢查 macOS ?�本
    check_macos_version
    
    # 安�?必�?工具
    install_xcode_tools
    install_homebrew
    install_nodejs
    install_git
    install_dev_tools
    bash "$PROJECT_ROOT/scripts/setup/configure-pnpm-linker.sh"
    
    # 設置?�置
    setup_git_config
    create_dev_config
    
    # 安�?測試依賴
    install_test_dependencies
    
    # 顯示系統資�?
    show_system_info
    
    # 顯示後�?步�?
    show_next_steps
}

# ?�誤?��?
trap 'log_error "?�本?��?失�?，退?�碼: $?"' ERR

# ?��?主函??
main "$@"




