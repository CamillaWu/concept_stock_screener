# 概念股篩選系統 - Windows 快速啟動腳本
# 適用於 Windows 10/11 + PowerShell 5.1+

param(
    [switch]$SkipChecks,
    [switch]$SkipInstall,
    [switch]$SkipBuild,
    [switch]$SkipTest,
    [switch]$Help
)

# 顯示幫助信息
if ($Help) {
    Write-Host @"
概念股篩選系統 - Windows 快速啟動腳本

用法:
    .\quick-start-windows.ps1 [選項]

選項:
    -SkipChecks    跳過環境檢查
    -SkipInstall   跳過依賴安裝
    -SkipBuild     跳過專案構建
    -SkipTest      跳過測試執行
    -Help          顯示此幫助信息

示例:
    .\quick-start-windows.ps1                    # 完整流程
    .\quick-start-windows.ps1 -SkipChecks        # 跳過環境檢查
    .\quick-start-windows.ps1 -SkipInstall       # 跳過依賴安裝
"@
    exit 0
}

# 顏色定義
$Colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
}

# 日誌函數
function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "Info"
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = $Colors[$Level]
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

# 檢查執行策略
function Test-ExecutionPolicy {
    Write-Log "檢查 PowerShell 執行策略..." "Info"
    
    $policy = Get-ExecutionPolicy
    if ($policy -eq "Restricted") {
        Write-Log "執行策略過於嚴格，嘗試設置為 RemoteSigned..." "Warning"
        try {
            Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
            Write-Log "執行策略已設置為 RemoteSigned" "Success"
        }
        catch {
            Write-Log "無法設置執行策略，請手動執行: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" "Error"
            return $false
        }
    }
    else {
        Write-Log "執行策略: $policy" "Success"
    }
    return $true
}

# 檢查 Node.js
function Test-NodeJS {
    Write-Log "檢查 Node.js..." "Info"
    
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        Write-Log "Node.js 版本: $nodeVersion" "Success"
        Write-Log "npm 版本: $npmVersion" "Success"
        return $true
    }
    catch {
        Write-Log "Node.js 未安裝或不在 PATH 中" "Error"
        Write-Log "請從 https://nodejs.org/ 下載並安裝 Node.js" "Error"
        return $false
    }
}

# 檢查 pnpm
function Test-Pnpm {
    Write-Log "檢查 pnpm..." "Info"
    
    try {
        $pnpmVersion = pnpm --version
        Write-Log "pnpm 版本: $pnpmVersion" "Success"
        return $true
    }
    catch {
        Write-Log "pnpm 未安裝，正在安裝..." "Warning"
        try {
            npm install -g pnpm
            Write-Log "pnpm 安裝成功" "Success"
            return $true
        }
        catch {
            Write-Log "pnpm 安裝失敗" "Error"
            return $false
        }
    }
}

# 檢查 Git
function Test-Git {
    Write-Log "檢查 Git..." "Info"
    
    try {
        $gitVersion = git --version
        Write-Log "Git 版本: $gitVersion" "Success"
        return $true
    }
    catch {
        Write-Log "Git 未安裝或不在 PATH 中" "Warning"
        Write-Log "建議從 https://git-scm.com/ 下載並安裝 Git" "Warning"
        return $false
    }
}

# 環境檢查
function Start-EnvironmentCheck {
    if ($SkipChecks) {
        Write-Log "跳過環境檢查" "Warning"
        return $true
    }
    
    Write-Log "開始環境檢查..." "Info"
    
    $checks = @(
        @{ Name = "PowerShell 執行策略"; Function = "Test-ExecutionPolicy" },
        @{ Name = "Node.js"; Function = "Test-NodeJS" },
        @{ Name = "pnpm"; Function = "Test-Pnpm" },
        @{ Name = "Git"; Function = "Test-Git" }
    )
    
    $allPassed = $true
    foreach ($check in $checks) {
        Write-Log "檢查: $($check.Name)" "Info"
        $result = & $check.Function
        if (-not $result) {
            $allPassed = $false
        }
        Write-Host ""
    }
    
    if ($allPassed) {
        Write-Log "所有環境檢查通過！" "Success"
    }
    else {
        Write-Log "部分環境檢查失敗，請解決問題後重試" "Error"
    }
    
    return $allPassed
}

# 安裝依賴
function Start-DependencyInstall {
    if ($SkipInstall) {
        Write-Log "跳過依賴安裝" "Warning"
        return $true
    }
    
    Write-Log "開始安裝依賴..." "Info"
    
    try {
        # 清理舊的依賴
        if (Test-Path "node_modules") {
            Write-Log "清理舊的依賴..." "Info"
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        }
        
        if (Test-Path "packages/*/node_modules") {
            Write-Log "清理包的依賴..." "Info"
            Get-ChildItem "packages" -Directory | ForEach-Object {
                if (Test-Path "$($_.FullName)/node_modules") {
                    Remove-Item -Recurse -Force "$($_.FullName)/node_modules" -ErrorAction SilentlyContinue
                }
            }
        }
        
        # 安裝依賴
        Write-Log "安裝專案依賴..." "Info"
        pnpm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "依賴安裝成功！" "Success"
            return $true
        }
        else {
            Write-Log "依賴安裝失敗" "Error"
            return $false
        }
    }
    catch {
        Write-Log "依賴安裝過程中發生錯誤: $($_.Exception.Message)" "Error"
        return $false
    }
}

# 構建專案
function Start-ProjectBuild {
    if ($SkipBuild) {
        Write-Log "跳過專案構建" "Warning"
        return $true
    }
    
    Write-Log "開始構建專案..." "Info"
    
    try {
        # 構建類型定義
        Write-Log "構建類型定義..." "Info"
        pnpm build:types
        if ($LASTEXITCODE -ne 0) {
            Write-Log "類型定義構建失敗" "Error"
            return $false
        }
        
        # 構建 UI 組件
        Write-Log "構建 UI 組件..." "Info"
        pnpm build:ui
        if ($LASTEXITCODE -ne 0) {
            Write-Log "UI 組件構建失敗" "Error"
            return $false
        }
        
        # 構建前端
        Write-Log "構建前端..." "Info"
        pnpm build:web
        if ($LASTEXITCODE -ne 0) {
            Write-Log "前端構建失敗" "Error"
            return $false
        }
        
        # 構建 API
        Write-Log "構建 API..." "Info"
        pnpm build:api
        if ($LASTEXITCODE -ne 0) {
            Write-Log "API 構建失敗" "Error"
            return $false
        }
        
        Write-Log "專案構建成功！" "Success"
        return $true
    }
    catch {
        Write-Log "專案構建過程中發生錯誤: $($_.Exception.Message)" "Error"
        return $false
    }
}

# 運行測試
function Start-Testing {
    if ($SkipTest) {
        Write-Log "跳過測試執行" "Warning"
        return $true
    }
    
    Write-Log "開始運行測試..." "Info"
    
    try {
        # 類型檢查
        Write-Log "運行類型檢查..." "Info"
        pnpm type-check:types
        pnpm type-check:ui
        pnpm type-check:web
        
        # 基礎測試
        Write-Log "運行基礎測試..." "Info"
        pnpm test:basic
        
        Write-Log "測試完成！" "Success"
        return $true
    }
    catch {
        Write-Log "測試過程中發生錯誤: $($_.Exception.Message)" "Error"
        return $false
    }
}

# 顯示完成信息
function Show-CompletionMessage {
    Write-Host ""
    Write-Log "🎉 概念股篩選系統設置完成！" "Success"
    Write-Host ""
    Write-Log "下一步操作:" "Info"
    Write-Log "1. 啟動開發環境: pnpm start" "Info"
    Write-Log "2. 運行完整測試: pnpm test" "Info"
    Write-Log "3. 查看專案狀態: .\scripts\maintenance\status-check.ps1" "Info"
    Write-Host ""
    Write-Log "專案文檔位於 docs/ 目錄" "Info"
    Write-Log "快速開始指南: docs/quick-start/QUICK_START_GUIDE.md" "Info"
}

# 主函數
function Main {
    Write-Host ""
    Write-Log "🚀 概念股篩選系統 - Windows 快速啟動" "Info"
    Write-Log "開始時間: $(Get-Date)" "Info"
    Write-Host ""
    
    # 檢查工作目錄
    if (-not (Test-Path "package.json")) {
        Write-Log "錯誤：請在專案根目錄執行此腳本" "Error"
        exit 1
    }
    
    # 執行各階段
    $stages = @(
        @{ Name = "環境檢查"; Function = "Start-EnvironmentCheck" },
        @{ Name = "依賴安裝"; Function = "Start-DependencyInstall" },
        @{ Name = "專案構建"; Function = "Start-ProjectBuild" },
        @{ Name = "測試執行"; Function = "Start-Testing" }
    )
    
    foreach ($stage in $stages) {
        Write-Log "=== $($stage.Name) ===" "Info"
        $result = & $stage.Function
        
        if (-not $result) {
            Write-Log "$($stage.Name) 失敗，停止執行" "Error"
            exit 1
        }
        
        Write-Host ""
    }
    
    # 顯示完成信息
    Show-CompletionMessage
}

# 執行主函數
try {
    Main
}
catch {
    Write-Log "腳本執行過程中發生未預期的錯誤: $($_.Exception.Message)" "Error"
    Write-Log "請檢查錯誤信息並重試" "Error"
    exit 1
}
