#!/bin/bash

# 開發環境快速部署腳本
# 用途：緊急修復、快速迭代、跳過部分檢查

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 腳本信息
SCRIPT_NAME="開發環境快速部署"
VERSION="1.0.0"
AUTHOR="Concept Stock Screener Team"

# 默認配置
SKIP_TESTS=false
SKIP_QUALITY_CHECKS=false
FORCE_DEPLOY=false
DEPLOY_MESSAGE="快速部署"

# 顯示幫助信息
show_help() {
    echo -e "${BLUE}${SCRIPT_NAME} v${VERSION}${NC}"
    echo -e "${BLUE}作者: ${AUTHOR}${NC}"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  -h, --help              顯示此幫助信息"
    echo "  -s, --skip-tests        跳過測試"
    echo "  -q, --skip-quality      跳過代碼品質檢查"
    echo "  -f, --force             強制部署（忽略錯誤）"
    echo "  -m, --message TEXT      部署說明"
    echo "  -v, --version           顯示版本信息"
    echo ""
    echo "示例:"
    echo "  $0 --skip-tests --message '緊急修復'"
    echo "  $0 -s -m '快速迭代'"
    echo ""
}

# 顯示版本信息
show_version() {
    echo -e "${BLUE}${SCRIPT_NAME} v${VERSION}${NC}"
    echo -e "${BLUE}作者: ${AUTHOR}${NC}"
}

# 解析命令行參數
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--version)
                show_version
                exit 0
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -q|--skip-quality)
                SKIP_QUALITY_CHECKS=true
                shift
                ;;
            -f|--force)
                FORCE_DEPLOY=true
                shift
                ;;
            -m|--message)
                DEPLOY_MESSAGE="$2"
                shift 2
                ;;
            *)
                echo -e "${RED}錯誤: 未知參數 $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
}

# 顯示部署信息
show_deploy_info() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}    開發環境快速部署${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}腳本版本: ${VERSION}${NC}"
    echo -e "${BLUE}部署時間: $(date)${NC}"
    echo -e "${BLUE}部署說明: ${DEPLOY_MESSAGE}${NC}"
    echo -e "${BLUE}跳過測試: ${SKIP_TESTS}${NC}"
    echo -e "${BLUE}跳過品質檢查: ${SKIP_QUALITY_CHECKS}${NC}"
    echo -e "${BLUE}強制部署: ${FORCE_DEPLOY}${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

# 檢查環境
check_environment() {
    echo -e "${BLUE}🔍 檢查部署環境...${NC}"
    
    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安裝${NC}"
        exit 1
    fi
    
    # 檢查 pnpm
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm 未安裝${NC}"
        exit 1
    fi
    
    # 檢查項目目錄
    if [[ ! -f "package.json" ]]; then
        echo -e "${RED}❌ 不在項目根目錄${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 環境檢查通過${NC}"
    echo ""
}

# 安裝依賴
install_dependencies() {
    echo -e "${BLUE}📦 安裝依賴...${NC}"
    
    if pnpm install --frozen-lockfile; then
        echo -e "${GREEN}✅ 依賴安裝完成${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}⚠️ 依賴安裝失敗，但繼續部署${NC}"
        else
            echo -e "${RED}❌ 依賴安裝失敗${NC}"
            exit 1
        fi
    fi
    echo ""
}

# 代碼品質檢查
run_quality_checks() {
    if [[ "$SKIP_QUALITY_CHECKS" == "true" ]]; then
        echo -e "${YELLOW}⚠️ 跳過代碼品質檢查${NC}"
        echo ""
        return 0
    fi
    
    echo -e "${BLUE}🔍 執行代碼品質檢查...${NC}"
    
    # 類型檢查
    echo -e "${BLUE}  - 類型檢查...${NC}"
    if pnpm type-check; then
        echo -e "${GREEN}    ✅ 類型檢查通過${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ 類型檢查失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ 類型檢查失敗${NC}"
            exit 1
        fi
    fi
    
    # 代碼風格檢查
    echo -e "${BLUE}  - 代碼風格檢查...${NC}"
    if pnpm lint:check; then
        echo -e "${GREEN}    ✅ 代碼風格檢查通過${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ 代碼風格檢查失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ 代碼風格檢查失敗${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ 代碼品質檢查完成${NC}"
    echo ""
}

# 構建應用
build_application() {
    echo -e "${BLUE}🔨 構建應用...${NC}"
    
    # 構建基礎包
    echo -e "${BLUE}  - 構建基礎包...${NC}"
    if pnpm build:types; then
        echo -e "${GREEN}    ✅ 類型包構建成功${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ 類型包構建失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ 類型包構建失敗${NC}"
            exit 1
        fi
    fi
    
    if pnpm build:ui; then
        echo -e "${GREEN}    ✅ UI 包構建成功${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ UI 包構建失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ UI 包構建失敗${NC}"
            exit 1
        fi
    fi
    
    # 構建前端
    echo -e "${BLUE}  - 構建前端...${NC}"
    if pnpm build:web; then
        echo -e "${GREEN}    ✅ 前端構建成功${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ 前端構建失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ 前端構建失敗${NC}"
            exit 1
        fi
    fi
    
    # 構建 API
    echo -e "${BLUE}  - 構建 API...${NC}"
    if pnpm build:api; then
        echo -e "${GREEN}    ✅ API 構建成功${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}    ⚠️ API 構建失敗，但繼續部署${NC}"
        else
            echo -e "${RED}    ❌ API 構建失敗${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ 應用構建完成${NC}"
    echo ""
}

# 運行測試
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        echo -e "${YELLOW}⚠️ 跳過測試${NC}"
        echo ""
        return 0
    fi
    
    echo -e "${BLUE}🧪 運行測試...${NC}"
    
    if pnpm test:unit; then
        echo -e "${GREEN}✅ 單元測試通過${NC}"
    else
        if [[ "$FORCE_DEPLOY" == "true" ]]; then
            echo -e "${YELLOW}⚠️ 單元測試失敗，但繼續部署${NC}"
        else
            echo -e "${RED}❌ 單元測試失敗${NC}"
            exit 1
        fi
    fi
    
    echo ""
}

# 部署應用
deploy_application() {
    echo -e "${BLUE}🚀 開始部署...${NC}"
    
    # 創建部署目錄
    DEPLOY_DIR="deployments/dev_quick_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$DEPLOY_DIR"
    
    echo -e "${BLUE}  - 創建部署目錄: ${DEPLOY_DIR}${NC}"
    
    # 複製構建產物
    echo -e "${BLUE}  - 複製構建產物...${NC}"
    
    # 前端
    if [[ -d "apps/web/.next" ]]; then
        cp -r apps/web/.next "$DEPLOY_DIR/web/"
        echo -e "${GREEN}    ✅ 前端構建產物複製成功${NC}"
    else
        echo -e "${YELLOW}    ⚠️ 前端構建產物不存在${NC}"
    fi
    
    # API
    if [[ -d "apps/api/dist" ]]; then
        cp -r apps/api/dist "$DEPLOY_DIR/api/"
        echo -e "${GREEN}    ✅ API 構建產物複製成功${NC}"
    else
        echo -e "${YELLOW}    ⚠️ API 構建產物不存在${NC}"
    fi
    
    # 基礎包
    if [[ -d "packages/types/dist" ]]; then
        cp -r packages/types/dist "$DEPLOY_DIR/types/"
        echo -e "${GREEN}    ✅ 類型包複製成功${NC}"
    fi
    
    if [[ -d "packages/ui/dist" ]]; then
        cp -r packages/ui/dist "$DEPLOY_DIR/ui/"
        echo -e "${GREEN}    ✅ UI 包複製成功${NC}"
    fi
    
    # 配置文件
    cp package.json "$DEPLOY_DIR/"
    cp pnpm-lock.yaml "$DEPLOY_DIR/"
    cp pnpm-workspace.yaml "$DEPLOY_DIR/"
    cp -r config "$DEPLOY_DIR/"
    cp -r scripts "$DEPLOY_DIR/"
    
    # 創建部署信息
    cat > "$DEPLOY_DIR/deployment-info.md" << EOF
# 開發環境快速部署信息

**部署時間**: $(date)
**部署說明**: ${DEPLOY_MESSAGE}
**跳過測試**: ${SKIP_TESTS}
**跳過品質檢查**: ${SKIP_QUALITY_CHECKS}
**強制部署**: ${FORCE_DEPLOY}
**Git 提交**: $(git rev-parse HEAD 2>/dev/null || echo "未知")
**Git 分支**: $(git branch --show-current 2>/dev/null || echo "未知")

## 構建狀態
- 類型包: $(if [[ -d "packages/types/dist" ]]; then echo "✅ 成功"; else echo "❌ 失敗"; fi)
- UI 包: $(if [[ -d "packages/ui/dist" ]]; then echo "✅ 成功"; else echo "❌ 失敗"; fi)
- 前端: $(if [[ -d "apps/web/.next" ]]; then echo "✅ 成功"; else echo "❌ 失敗"; fi)
- API: $(if [[ -d "apps/api/dist" ]]; then echo "✅ 成功"; else echo "❌ 失敗"; fi)

## 部署目錄
\`\`\`
${DEPLOY_DIR}
\`\`\`
EOF
    
    echo -e "${GREEN}✅ 部署包創建完成${NC}"
    echo ""
    
    # 這裡可以添加實際的部署邏輯
    # 例如：上傳到開發服務器、部署到雲服務等
    echo -e "${BLUE}  - 部署到開發環境...${NC}"
    echo -e "${BLUE}    （實際部署邏輯需要根據具體環境配置）${NC}"
    
    echo -e "${GREEN}✅ 部署完成${NC}"
    echo ""
}

# 部署後檢查
post_deploy_check() {
    echo -e "${BLUE}🔍 部署後檢查...${NC}"
    
    # 檢查部署目錄
    if [[ -d "$DEPLOY_DIR" ]]; then
        echo -e "${GREEN}  ✅ 部署目錄存在${NC}"
        echo -e "${BLUE}    路徑: ${DEPLOY_DIR}${NC}"
    else
        echo -e "${RED}  ❌ 部署目錄不存在${NC}"
    fi
    
    # 檢查關鍵文件
    if [[ -f "$DEPLOY_DIR/deployment-info.md" ]]; then
        echo -e "${GREEN}  ✅ 部署信息文件存在${NC}"
    else
        echo -e "${RED}  ❌ 部署信息文件不存在${NC}"
    fi
    
    echo -e "${GREEN}✅ 部署後檢查完成${NC}"
    echo ""
}

# 顯示部署摘要
show_deploy_summary() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}        部署摘要${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}部署時間: $(date)${NC}"
    echo -e "${BLUE}部署說明: ${DEPLOY_MESSAGE}${NC}"
    echo -e "${BLUE}部署目錄: ${DEPLOY_DIR}${NC}"
    echo -e "${BLUE}跳過測試: ${SKIP_TESTS}${NC}"
    echo -e "${BLUE}跳過品質檢查: ${SKIP_QUALITY_CHECKS}${NC}"
    echo -e "${BLUE}強制部署: ${FORCE_DEPLOY}${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo -e "${GREEN}🎉 開發環境快速部署完成！${NC}"
    echo ""
}

# 主函數
main() {
    # 解析參數
    parse_args "$@"
    
    # 顯示部署信息
    show_deploy_info
    
    # 檢查環境
    check_environment
    
    # 安裝依賴
    install_dependencies
    
    # 代碼品質檢查
    run_quality_checks
    
    # 構建應用
    build_application
    
    # 運行測試
    run_tests
    
    # 部署應用
    deploy_application
    
    # 部署後檢查
    post_deploy_check
    
    # 顯示部署摘要
    show_deploy_summary
}

# 執行主函數
main "$@"
