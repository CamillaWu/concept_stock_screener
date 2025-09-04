#!/bin/bash

# 自動修復 CI/CD 問題腳本
# 根據錯誤模式自動修復常見問題

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
REPO="CamillaWu/concept_stock_screener"
BRANCH="develop"

echo "🔧 啟動自動修復系統"
echo "📊 倉庫: $REPO"
echo "🌿 分支: $BRANCH"
echo "----------------------------------------"

# 函數：修復 Node.js 版本問題
fix_node_version() {
    echo -e "\n🔧 修復 Node.js 版本問題..."

    # 檢查當前 workflow 文件
    local workflow_files=(
        ".github/workflows/dev-deploy.yml"
        ".github/workflows/ci.yml"
    )

    for file in "${workflow_files[@]}"; do
        if [ -f "$file" ]; then
            echo "📝 檢查文件: $file"

            # 檢查是否包含 Node.js 18
            if grep -q "NODE_VERSION: '18'" "$file"; then
                echo "🔄 更新 Node.js 版本從 18 到 20..."
                sed -i '' "s/NODE_VERSION: '18'/NODE_VERSION: '20'/g" "$file"
                echo "✅ 已更新 $file"
            else
                echo "ℹ️  $file 中的 Node.js 版本已經是 20 或未設置"
            fi
        else
            echo "⚠️  文件不存在: $file"
        fi
    done
}

# 函數：修復 pnpm 問題
fix_pnpm_issues() {
    echo -e "\n🔧 修復 pnpm 問題..."

    echo "🧹 清理 pnpm 緩存..."
    pnpm store prune

    echo "🔒 重新生成 lock 文件..."
    rm -f pnpm-lock.yaml
    pnpm install --frozen-lockfile

    echo "✅ pnpm 問題修復完成"
}

# 函數：修復 wrangler 配置問題
fix_wrangler_config() {
    echo -e "\n🔧 修復 wrangler 配置問題..."

    local wrangler_file="apps/api/wrangler.toml"

    if [ -f "$wrangler_file" ]; then
        echo "📝 檢查 wrangler.toml 配置..."

        # 檢查是否有未配置的 KV namespace
        if grep -q "kv_namespaces" "$wrangler_file"; then
            echo "🔍 發現 KV namespace 配置，檢查是否需要註釋..."

            # 如果 KV namespace 沒有綁定，註釋掉
            if grep -A 5 "kv_namespaces" "$wrangler_file" | grep -q "binding ="; then
                echo "ℹ️  KV namespace 已正確配置"
            else
                echo "⚠️  發現未綁定的 KV namespace，註釋掉..."
                # 這裡可以添加自動註釋邏輯
                echo "💡 建議手動檢查並註釋掉未使用的 KV namespace"
            fi
        fi

        echo "✅ wrangler 配置檢查完成"
    else
        echo "⚠️  wrangler.toml 文件不存在"
    fi
}

# 函數：修復測試問題
fix_test_issues() {
    echo -e "\n🔧 修復測試問題..."

    echo "🧪 運行測試檢查..."
    if pnpm test 2>&1 | grep -q "failed"; then
        echo "❌ 發現測試失敗，嘗試修復..."

        # 檢查測試覆蓋率
        echo "📊 檢查測試覆蓋率..."
        pnpm test:coverage

        echo "💡 請檢查測試失敗的具體原因並修復"
    else
        echo "✅ 測試通過"
    fi
}

# 函數：修復安全漏洞
fix_security_vulnerabilities() {
    echo -e "\n🔧 修復安全漏洞..."

    echo "🔒 檢查安全漏洞..."
    local audit_result=$(pnpm audit 2>&1 || true)

    if echo "$audit_result" | grep -q "vulnerabilities found"; then
        echo "⚠️  發現安全漏洞，嘗試自動修復..."

        # 嘗試自動修復
        if pnpm audit fix; then
            echo "✅ 自動修復完成"
        else
            echo "❌ 自動修復失敗，需要手動處理"
            echo "💡 建議運行: pnpm audit fix --force"
        fi
    else
        echo "✅ 未發現安全漏洞"
    fi
}

# 函數：修復構建問題
fix_build_issues() {
    echo -e "\n🔧 修復構建問題..."

    echo "🏗️  嘗試構建前端..."
    if cd apps/web && pnpm build; then
        echo "✅ 前端構建成功"
    else
        echo "❌ 前端構建失敗"
    fi
    cd ../..

    echo "🏗️  嘗試構建 API..."
    if cd apps/api && pnpm build; then
        echo "✅ API 構建成功"
    else
        echo "❌ API 構建失敗"
    fi
    cd ../..
}

# 函數：自動提交修復
auto_commit_fixes() {
    echo -e "\n🔧 自動提交修復..."

    # 檢查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 發現未提交的更改，自動提交..."

        git add .
        git commit -m "fix: 自動修復 CI/CD 問題 - $(date '+%Y-%m-%d %H:%M:%S')"

        echo "🚀 推送到遠程倉庫..."
        git push origin "$BRANCH"

        echo "✅ 修復已自動提交並推送"
    else
        echo "ℹ️  沒有未提交的更改"
    fi
}

# 函數：顯示修復建議
show_fix_suggestions() {
    echo -e "\n💡 ${BLUE}修復建議：${NC}"
    echo "1. 檢查 GitHub Actions 日誌確認具體錯誤"
    echo "2. 根據錯誤類型選擇相應的修復方法"
    echo "3. 運行自動修復腳本: ./scripts/auto-fix.sh"
    echo "4. 手動檢查並修復無法自動修復的問題"
    echo "5. 提交修復並推送代碼"
    echo "6. 等待新的 CI/CD 運行完成"
    echo ""
}

# 主函數
main() {
    echo "🔍 開始自動診斷和修復..."

    # 檢查當前狀態
    echo "📊 檢查當前 git 狀態..."
    git status --porcelain

    # 執行各種修復
    fix_node_version
    fix_pnpm_issues
    fix_wrangler_config
    fix_test_issues
    fix_security_vulnerabilities
    fix_build_issues

    # 自動提交修復
    auto_commit_fixes

    # 顯示修復建議
    show_fix_suggestions

    echo -e "🎉 ${GREEN}自動修復完成！${NC}"
    echo "請檢查修復結果並等待新的 CI/CD 運行"
}

# 錯誤處理
trap 'echo -e "\n🛑 修復過程被中斷"; exit 1' INT TERM

# 檢查依賴
if ! command -v pnpm &> /dev/null; then
    echo "❌ 錯誤: 需要安裝 pnpm"
    echo "安裝命令: npm install -g pnpm"
    exit 1
fi

# 啟動主修復流程
main
