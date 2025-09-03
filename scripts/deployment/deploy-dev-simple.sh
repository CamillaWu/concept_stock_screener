#!/bin/bash

# 概念股篩選系統 - 簡化開發環境部署腳本
# 跳過類型檢查和代碼風格檢查，避免與 ESLint 修復衝突

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
    exit 1
}

# 環境變數
ENV="development"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_DIR="deployments/dev_simple_${TIMESTAMP}"

log_info "開始簡化部署到開發環境..."
log_info "部署時間: ${TIMESTAMP}"
log_info "部署目錄: ${DEPLOY_DIR}"
log_warning "注意：此腳本跳過類型檢查和代碼風格檢查"

# 1. 環境檢查
log_info "步驟 1: 環境檢查"
if ! command -v node &> /dev/null; then
    log_error "Node.js 未安裝或不在 PATH 中"
fi

if ! command -v pnpm &> /dev/null; then
    log_error "pnpm 未安裝或不在 PATH 中"
fi

NODE_VERSION=$(node --version)
PNPM_VERSION=$(pnpm --version)
log_success "Node.js 版本: ${NODE_VERSION}"
log_success "pnpm 版本: ${PNPM_VERSION}"

# 2. 依賴檢查
log_info "步驟 2: 依賴檢查"
if [ ! -f "pnpm-lock.yaml" ]; then
    log_error "pnpm-lock.yaml 不存在，請先運行 pnpm install"
fi

# 3. 環境變數檢查
log_info "步驟 3: 環境變數檢查"
if [ ! -f ".env.local" ] && [ ! -f ".env.development" ]; then
    log_warning "未找到開發環境配置文件，將使用 config/environments/development.json"
    if [ -f "config/environments/development.json" ]; then
        log_success "使用 config/environments/development.json 配置"
    else
        log_error "config/environments/development.json 不存在，無法繼續部署"
    fi
fi

# 4. 清理舊的構建文件
log_info "步驟 4: 清理舊的構建文件"
log_info "清理構建目錄..."
rm -rf dist build .next out

# 5. 安裝依賴
log_info "步驟 5: 安裝依賴"
pnpm install --frozen-lockfile
log_success "依賴安裝完成"

# 6. 跳過類型檢查和代碼風格檢查
log_warning "步驟 6: 跳過類型檢查（避免與 ESLint 修復衝突）"
log_warning "步驟 7: 跳過代碼風格檢查（避免與 ESLint 修復衝突）"

# 7. 構建應用
log_info "步驟 8: 構建應用"
log_info "構建基礎包..."
pnpm build:types
pnpm build:ui

log_info "構建前端應用..."
pnpm build:web

log_info "構建 API..."
pnpm build:api

log_success "所有應用構建完成"

# 8. 創建部署目錄
log_info "步驟 9: 創建部署目錄"
mkdir -p "${DEPLOY_DIR}"
mkdir -p "${DEPLOY_DIR}/web"
mkdir -p "${DEPLOY_DIR}/api"
mkdir -p "${DEPLOY_DIR}/data-pipeline"

# 9. 複製構建文件
log_info "步驟 10: 複製構建文件"
if [ -d "apps/web/.next" ]; then
    cp -r apps/web/.next "${DEPLOY_DIR}/web/"
    log_success "前端構建文件已複製"
fi

if [ -d "apps/api/dist" ]; then
    cp -r apps/api/dist "${DEPLOY_DIR}/api/"
    log_success "API 構建文件已複製"
fi

# 10. 複製配置文件
log_info "步驟 11: 複製配置文件"
cp config/environments/development.json "${DEPLOY_DIR}/config.json" 2>/dev/null || log_warning "無法複製配置文件"
cp package.json "${DEPLOY_DIR}/"
cp pnpm-lock.yaml "${DEPLOY_DIR}/"
cp pnpm-workspace.yaml "${DEPLOY_DIR}/"

# 11. 創建部署清單
log_info "步驟 12: 創建部署清單"
cat > "${DEPLOY_DIR}/deployment-info.md" << EOF
# 簡化開發環境部署信息

- 部署時間: ${TIMESTAMP}
- 環境: ${ENV}
- Node.js 版本: ${NODE_VERSION}
- pnpm 版本: ${PNPM_VERSION}
- Git 提交: $(git rev-parse HEAD 2>/dev/null || echo "未知")
- 分支: $(git branch --show-current 2>/dev/null || echo "未知")

## 構建狀態
- 類型檢查: ⚠️ 已跳過（避免與 ESLint 修復衝突）
- 代碼風格: ⚠️ 已跳過（避免與 ESLint 修復衝突）
- 構建: ✅ 完成

## 部署文件
- 前端: ${DEPLOY_DIR}/web/
- API: ${DEPLOY_DIR}/api/
- 配置: ${DEPLOY_DIR}/config.json

## 注意事項
此部署跳過了類型檢查和代碼風格檢查，以避免與正在進行的 ESLint 修復任務衝突。
請在 ESLint 修復完成後，運行完整的部署腳本進行驗證。
EOF

# 12. 部署完成
log_success "簡化開發環境部署完成！"
log_info "部署目錄: ${DEPLOY_DIR}"
log_info "部署信息: ${DEPLOY_DIR}/deployment-info.md"
log_warning "請注意：此部署跳過了類型檢查和代碼風格檢查"

# 13. 清理臨時文件
log_info "步驟 13: 清理臨時文件"
# 保留最近的 3 個簡化部署
cd deployments
ls -dt dev_simple_* | tail -n +4 | xargs -r rm -rf
log_success "臨時文件清理完成"

log_success "🎉 簡化開發環境部署流程完成！"
log_warning "⚠️  請在 ESLint 修復完成後運行完整部署腳本進行驗證"
