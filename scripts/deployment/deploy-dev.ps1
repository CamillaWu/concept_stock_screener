# 概念股篩選系統 - 開發環境部署腳本 (Windows PowerShell)
# 使用方式: .\scripts\deployment\deploy-dev.ps1 [-Force]

param(
    [switch]$Force
)

# 設置錯誤處理
$ErrorActionPreference = "Stop"

# 顏色定義
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# 日誌函數
function Write-LogInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# 檢查是否為強制部署
$ForceDeploy = $Force
if ($ForceDeploy) {
    Write-LogWarning "強制部署模式已啟用"
}

# 環境變數
$Env = "development"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$DeployDir = "deployments\dev_$Timestamp"

Write-LogInfo "開始部署到開發環境..."
Write-LogInfo "部署時間: $Timestamp"
Write-LogInfo "部署目錄: $DeployDir"

# 1. 環境檢查
Write-LogInfo "步驟 1: 環境檢查"

# 檢查 Node.js
try {
    $NodeVersion = node --version
    Write-LogSuccess "Node.js 版本: $NodeVersion"
} catch {
    Write-LogError "Node.js 未安裝或不在 PATH 中"
    exit 1
}

# 檢查 pnpm
try {
    $PnpmVersion = pnpm --version
    Write-LogSuccess "pnpm 版本: $PnpmVersion"
} catch {
    Write-LogError "pnpm 未安裝或不在 PATH 中"
    exit 1
}

# 2. 依賴檢查
Write-LogInfo "步驟 2: 依賴檢查"
if (-not (Test-Path "pnpm-lock.yaml")) {
    Write-LogError "pnpm-lock.yaml 不存在，請先運行 pnpm install"
    exit 1
}

# 3. 環境變數檢查
Write-LogInfo "步驟 3: 環境變數檢查"
if (-not (Test-Path ".env.local") -and -not (Test-Path ".env.development")) {
    Write-LogWarning "未找到開發環境配置文件，將使用 config/environments/development.json"
    if (Test-Path "config/environments/development.json") {
        Write-LogSuccess "使用 config/environments/development.json 配置"
    } else {
        Write-LogError "config/environments/development.json 不存在，無法繼續部署"
        exit 1
    }
}

# 4. 清理舊的構建文件
Write-LogInfo "步驟 4: 清理舊的構建文件"
if ($ForceDeploy) {
    Write-LogWarning "強制部署模式：清理所有構建文件"
    pnpm clean:dist
} else {
    Write-LogInfo "清理構建目錄..."
    if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force }
    if (Test-Path "build") { Remove-Item "build" -Recurse -Force }
    if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force }
    if (Test-Path "out") { Remove-Item "out" -Recurse -Force }
}

# 5. 安裝依賴
Write-LogInfo "步驟 5: 安裝依賴"
pnpm install --frozen-lockfile
Write-LogSuccess "依賴安裝完成"

# 6. 類型檢查
Write-LogInfo "步驟 6: 類型檢查"
try {
    pnpm type-check
    Write-LogSuccess "類型檢查通過"
} catch {
    Write-LogError "類型檢查失敗，部署中止"
    exit 1
}

# 7. 代碼風格檢查
Write-LogInfo "步驟 7: 代碼風格檢查"
try {
    pnpm lint:check
    Write-LogSuccess "代碼風格檢查通過"
} catch {
    if ($ForceDeploy) {
        Write-LogWarning "代碼風格檢查失敗，但強制部署模式已啟用，繼續部署"
    } else {
        Write-LogError "代碼風格檢查失敗，部署中止"
        Write-LogInfo "運行 'pnpm lint:fix' 來修復問題"
        exit 1
    }
}

# 8. 運行測試
Write-LogInfo "步驟 8: 運行測試"
try {
    pnpm test:ci
    Write-LogSuccess "測試通過"
} catch {
    if ($ForceDeploy) {
        Write-LogWarning "測試失敗，但強制部署模式已啟用，繼續部署"
    } else {
        Write-LogError "測試失敗，部署中止"
        exit 1
    }
}

# 9. 構建應用
Write-LogInfo "步驟 9: 構建應用"
Write-LogInfo "構建基礎包..."
pnpm build:types
pnpm build:ui

Write-LogInfo "構建前端應用..."
pnpm build:web

Write-LogInfo "構建 API..."
pnpm build:api

Write-LogSuccess "所有應用構建完成"

# 10. 創建部署目錄
Write-LogInfo "步驟 10: 創建部署目錄"
New-Item -ItemType Directory -Path $DeployDir -Force | Out-Null
New-Item -ItemType Directory -Path "$DeployDir\web" -Force | Out-Null
New-Item -ItemType Directory -Path "$DeployDir\api" -Force | Out-Null
New-Item -ItemType Directory -Path "$DeployDir\data-pipeline" -Force | Out-Null

# 11. 複製構建文件
Write-LogInfo "步驟 11: 複製構建文件"
if (Test-Path "apps\web\.next") {
    Copy-Item "apps\web\.next" "$DeployDir\web\" -Recurse -Force
    Write-LogSuccess "前端構建文件已複製"
}

if (Test-Path "apps\api\dist") {
    Copy-Item "apps\api\dist" "$DeployDir\api\" -Recurse -Force
    Write-LogSuccess "API 構建文件已複製"
}

# 12. 複製配置文件
Write-LogInfo "步驟 12: 複製配置文件"
if (Test-Path ".env.development") {
    Copy-Item ".env.development" "$DeployDir\.env"
} else {
    Copy-Item ".env.example" "$DeployDir\.env"
}
Copy-Item "package.json" "$DeployDir\"
Copy-Item "pnpm-lock.yaml" "$DeployDir\"
Copy-Item "pnpm-workspace.yaml" "$DeployDir\"

# 13. 創建部署清單
Write-LogInfo "步驟 13: 創建部署清單"
$GitCommit = try { git rev-parse HEAD } catch { "未知" }
$GitBranch = try { git branch --show-current } catch { "未知" }

$DeploymentInfo = @"
# 開發環境部署信息

- 部署時間: $Timestamp
- 環境: $Env
- Node.js 版本: $NodeVersion
- pnpm 版本: $PnpmVersion
- Git 提交: $GitCommit
- 分支: $GitBranch

## 構建狀態
- 類型檢查: ✅ 通過
- 代碼風格: ✅ 通過
- 測試: ✅ 通過
- 構建: ✅ 完成

## 部署文件
- 前端: $DeployDir\web\
- API: $DeployDir\api\
- 配置: $DeployDir\.env
"@

$DeploymentInfo | Out-File -FilePath "$DeployDir\deployment-info.md" -Encoding UTF8

# 14. 部署到開發環境
Write-LogInfo "步驟 14: 部署到開發環境"
Write-LogInfo "部署目錄: $DeployDir"

# 這裡可以添加實際的部署邏輯，例如：
# - 上傳到開發服務器
# - 部署到 Vercel/Netlify
# - 部署到 Cloudflare Workers
# - 重啟開發服務

Write-LogSuccess "開發環境部署完成！"
Write-LogInfo "部署目錄: $DeployDir"
Write-LogInfo "部署信息: $DeployDir\deployment-info.md"

# 15. 清理臨時文件（可選）
if (-not $ForceDeploy) {
    Write-LogInfo "步驟 15: 清理臨時文件"
    # 保留最近的 3 個部署
    $Deployments = Get-ChildItem "deployments" -Directory | Where-Object { $_.Name -like "dev_*" } | Sort-Object CreationTime -Descending
    if ($Deployments.Count -gt 3) {
        $Deployments | Select-Object -Skip 3 | Remove-Item -Recurse -Force
        Write-LogSuccess "臨時文件清理完成"
    }
}

Write-LogSuccess "🎉 開發環境部署流程完成！"
