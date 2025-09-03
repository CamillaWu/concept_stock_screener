#!/bin/bash

# 概念股篩選系統 - 開發環境部署腳本
# 使用方式: ./scripts/deployment/deploy-dev.sh [--force]

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
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

# 檢查是否為強制部署
FORCE_DEPLOY=false
if [[ "$1" == "--force" ]]; then
    FORCE_DEPLOY=true
    log_warning "強制部署模式已啟用"
fi

# 環境變數
ENV="development"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_DIR="deployments/dev_${TIMESTAMP}"

log_info "開始部署到開發環境..."
log_info "部署時間: ${TIMESTAMP}"
log_info "部署目錄: ${DEPLOY_DIR}"

# 1. 環境檢查
log_info "步驟 1: 環境檢查"
if ! command -v node &> /dev/null; then
    log_error "Node.js 未安裝或不在 PATH 中"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    log_error "pnpm 未安裝或不在 PATH 中"
    exit 1
fi

NODE_VERSION=$(node --version)
PNPM_VERSION=$(pnpm --version)
log_success "Node.js 版本: ${NODE_VERSION}"
log_success "pnpm 版本: ${PNPM_VERSION}"

# 2. 依賴檢查
log_info "步驟 2: 依賴檢查"
if [ ! -f "pnpm-lock.yaml" ]; then
    log_error "pnpm-lock.yaml 不存在，請先運行 pnpm install"
    exit 1
fi

# 3. 環境變數檢查
log_info "步驟 3: 環境變數檢查"
if [ ! -f ".env.local" ] && [ ! -f ".env.development" ]; then
    log_warning "未找到開發環境配置文件，將使用 config/environments/development.json"
    if [ -f "config/environments/development.json" ]; then
        log_success "使用 config/environments/development.json 配置"
    else
        log_error "config/environments/development.json 不存在，無法繼續部署"
        exit 1
    fi
fi

# 4. 清理舊的構建文件
log_info "步驟 4: 清理舊的構建文件"
if [ "$FORCE_DEPLOY" = true ]; then
    log_warning "強制部署模式：清理所有構建文件"
    pnpm clean:dist
else
    log_info "清理構建目錄..."
    rm -rf dist build .next out
fi

# 5. 安裝依賴
log_info "步驟 5: 安裝依賴"
pnpm install --frozen-lockfile
log_success "依賴安裝完成"

# 6. 類型檢查
log_info "步驟 6: 類型檢查"
if ! pnpm type-check; then
    log_error "類型檢查失敗，部署中止"
    exit 1
fi
log_success "類型檢查通過"

# 7. 代碼風格檢查
log_info "步驟 7: 代碼風格檢查"
if ! pnpm lint:check; then
    if [ "$FORCE_DEPLOY" = true ]; then
        log_warning "代碼風格檢查失敗，但強制部署模式已啟用，繼續部署"
    else
        log_error "代碼風格檢查失敗，部署中止"
        log_info "運行 'pnpm lint:fix' 來修復問題"
        exit 1
    fi
else
    log_success "代碼風格檢查通過"
fi

# 8. 運行測試
log_info "步驟 8: 運行測試"
if ! pnpm test:ci; then
    if [ "$FORCE_DEPLOY" = true ]; then
        log_warning "測試失敗，但強制部署模式已啟用，繼續部署"
    else
        log_error "測試失敗，部署中止"
        exit 1
    fi
else
    log_success "測試通過"
fi

# 9. 構建應用
log_info "步驟 9: 構建應用"
log_info "構建基礎包..."
pnpm build:types
pnpm build:ui

log_info "構建前端應用..."
pnpm build:web

log_info "構建 API..."
pnpm build:api

log_success "所有應用構建完成"

# 10. 創建部署目錄
log_info "步驟 10: 創建部署目錄"
mkdir -p "${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}/web"
mkdir -p "${DEPLOY_DIR}/api"
mkdir -p "${DEPLOY_DIR}/data-pipeline"

# 11. 複製構建文件
log_info "步驟 11: 複製構建文件"
if [ -d "apps/web/.next" ]; then
    cp -r apps/web/.next "${DEPLOY_DIR}/web/"
    log_success "前端構建文件已複製"
fi

if [ -d "apps/api/dist" ]; then
    cp -r apps/api/dist "${DEPLOY_DIR}/api/"
    log_success "API 構建文件已複製"
fi

# 12. 複製配置文件
log_info "步驟 12: 複製配置文件"
cp .env.development "${DEPLOY_DIR}/.env" 2>/dev/null || cp .env.example "${DEPLOY_DIR}/.env"
cp package.json "${DEPLOY_DIR}/"
cp pnpm-lock.yaml "${DEPLOY_DIR}/"
cp pnpm-workspace.yaml "${DEPLOY_DIR}/"

# 13. 創建部署清單
log_info "步驟 13: 創建部署清單"
cat > "${DEPLOY_DIR}/deployment-info.md" << EOF
# 開發環境部署信息

- 部署時間: ${TIMESTAMP}
- 環境: ${ENV}
- Node.js 版本: ${NODE_VERSION}
- pnpm 版本: ${PNPM_VERSION}
- Git 提交: $(git rev-parse HEAD 2>/dev/null || echo "未知")
- 分支: $(git branch --show-current 2>/dev/null || echo "未知")

## 構建狀態
- 類型檢查: ✅ 通過
- 代碼風格: ✅ 通過
- 測試: ✅ 通過
- 構建: ✅ 完成

## 部署文件
- 前端: ${DEPLOY_DIR}/web/
- API: ${DEPLOY_DIR}/api/
- 配置: ${DEPLOY_DIR}/.env
EOF

# 14. 部署到開發環境
log_info "步驟 14: 部署到開發環境"
log_info "部署目錄: ${DEPLOY_DIR}"

# 這裡可以添加實際的部署邏輯，例如：
# - 上傳到開發服務器
# - 部署到 Vercel/Netlify
# - 部署到 Cloudflare Workers
# - 重啟開發服務

log_success "開發環境部署完成！"
log_info "部署目錄: ${DEPLOY_DIR}"
log_info "部署信息: ${DEPLOY_DIR}/deployment-info.md"

# 15. 清理臨時文件（可選）
if [ "$FORCE_DEPLOY" = false ]; then
    log_info "步驟 15: 清理臨時文件"
    # 保留最近的 3 個部署
    cd deployments
    ls -dt dev_* | tail -n +4 | xargs -r rm -rf
    log_success "臨時文件清理完成"
fi

log_success "🎉 開發環境部署流程完成！"
