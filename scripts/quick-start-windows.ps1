# 概念股篩選系統 - Windows 快速啟動腳本
# 一鍵設置和運行測試環境

param(
    [Parameter(Position=0)]
    [string]$Command = "all"
)

# 腳本目錄
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 顏色函數
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️  $Message" "Blue"
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput ""
    Write-ColorOutput "============================================================" "Cyan"
    Write-ColorOutput "  $Title" "Cyan"
    Write-ColorOutput "============================================================" "Cyan"
}

# 檢查 PowerShell 版本
function Test-PowerShellVersion {
    Write-Info "檢查 PowerShell 版本..."
    
    $psVersion = $PSVersionTable.PSVersion
    Write-Info "PowerShell 版本: $psVersion"
    
    if ($psVersion.Major -lt 5) {
        Write-Warning "建議使用 PowerShell 5.1 或更高版本"
        Write-Info "可以從 Microsoft Store 或官網下載最新版本"
    } else {
        Write-Success "PowerShell 版本檢查通過"
    }
}

# 檢查執行策略
function Test-ExecutionPolicy {
    Write-Info "檢查執行策略..."
    
    $currentPolicy = Get-ExecutionPolicy
    Write-Info "當前執行策略: $currentPolicy"
    
    if ($currentPolicy -eq "Restricted") {
        Write-Warning "執行策略過於嚴格，建議設置為 RemoteSigned"
        Write-Info "請以管理員身份運行: Set-ExecutionPolicy RemoteSigned"
        Write-Info "或為當前用戶設置: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser"
    } else {
        Write-Success "執行策略檢查通過"
    }
}

# 檢查依賴
function Test-Dependencies {
    Write-Info "檢查依賴..."
    
    # 檢查 Node.js
    $nodeVersion = $null
    try {
        $nodeVersion = node --version 2>$null
    } catch {
        $nodeVersion = $null
    }
    
    if ($nodeVersion) {
        Write-Success "Node.js 已安裝，版本: $nodeVersion"
    } else {
        Write-Error "Node.js 未安裝"
        Write-Info "請從 https://nodejs.org 下載並安裝"
        return $false
    }
    
    # 檢查 npm
    $npmVersion = $null
    try {
        $npmVersion = npm --version 2>$null
    } catch {
        $npmVersion = $null
    }
    
    if ($npmVersion) {
        Write-Success "npm 已安裝，版本: $npmVersion"
    } else {
        Write-Error "npm 未安裝"
        return $false
    }
    
    # 檢查 Git
    $gitVersion = $null
    try {
        $gitVersion = git --version 2>$null
    } catch {
        $gitVersion = $null
    }
    
    if ($gitVersion) {
        Write-Success "Git 已安裝: $gitVersion"
    } else {
        Write-Warning "Git 未安裝，建議安裝以獲得更好的開發體驗"
        Write-Info "請從 https://git-scm.com 下載並安裝"
    }
    
    Write-Success "依賴檢查完成"
    return $true
}

# 安裝測試依賴
function Install-TestDependencies {
    Write-Header "安裝測試依賴"
    
    Set-Location $ScriptDir
    
    if (Test-Path "package.json") {
        Write-Info "安裝 npm 依賴..."
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Success "測試依賴安裝完成"
        } else {
            Write-Error "依賴安裝失敗"
            return $false
        }
    } else {
        Write-Warning "未找到 package.json"
        return $false
    }
    
    return $true
}

# 運行測試
function Invoke-Tests {
    Write-Header "運行測試套件"
    
    Write-Info "開始執行測試..."
    
    # 使用 PowerShell 腳本運行測試
    if (Test-Path "$ScriptDir\test-runner.ps1") {
        & "$ScriptDir\test-runner.ps1" all
        if ($LASTEXITCODE -eq 0) {
            Write-Success "所有測試通過！"
            return $true
        } else {
            Write-Error "部分測試失敗，請檢查錯誤訊息"
            return $false
        }
    } else {
        Write-Error "未找到 test-runner.ps1 腳本"
        return $false
    }
}

# 生成報告
function Generate-Reports {
    Write-Header "生成測試報告"
    
    if (Test-Path "$ScriptDir\test-runner.ps1") {
        Write-Info "生成覆蓋率報告..."
        & "$ScriptDir\test-runner.ps1" coverage
        
        Write-Info "生成測試報告..."
        & "$ScriptDir\test-runner.ps1" report
    } else {
        Write-Error "未找到 test-runner.ps1 腳本"
    }
}

# 創建開發環境配置
function New-DevConfig {
    Write-Header "創建開發環境配置"
    
    $configDir = "$env:USERPROFILE\.concept-stock-screener"
    if (!(Test-Path $configDir)) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
    
    $configFile = "$configDir\config.json"
    
    if (!(Test-Path $configFile)) {
        $nodeVersion = "unknown"
        $npmVersion = "unknown"
        
        try {
            $nodeVersion = node --version
        } catch {
            $nodeVersion = "unknown"
        }
        
        try {
            $npmVersion = npm --version
        } catch {
            $npmVersion = "unknown"
        }
        
        $config = @{
            environment = "development"
            platform = "windows"
            setup_date = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
            node_version = $nodeVersion
            npm_version = $npmVersion
            powershell_version = $PSVersionTable.PSVersion.ToString()
        } | ConvertTo-Json -Depth 3
        
        $config | Out-File -FilePath $configFile -Encoding UTF8
        Write-Success "開發環境配置文件已創建: $configFile"
    } else {
        Write-Info "開發環境配置文件已存在"
    }
}

# 顯示系統資訊
function Show-SystemInfo {
    Write-Header "系統資訊"
    
    Write-Info "作業系統: $($env:OS)"
    Write-Info "Windows 版本: $(Get-WmiObject -Class Win32_OperatingSystem | Select-Object -ExpandProperty Caption)"
    Write-Info "架構: $env:PROCESSOR_ARCHITECTURE"
    Write-Info "處理器: $(Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty Name)"
    
    # 記憶體資訊
    $memory = Get-WmiObject -Class Win32_ComputerSystem
    $totalMemoryGB = [math]::Round($memory.TotalPhysicalMemory / 1GB, 2)
    Write-Info "總記憶體: ${totalMemoryGB}GB"
    
    # 磁碟空間
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'"
    $freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
    Write-Info "C 槽可用空間: ${freeSpaceGB}GB"
    
    # 依賴版本
    if (Get-Command node -ErrorAction SilentlyContinue) {
        Write-Info "Node.js 版本: $(node --version)"
    }
    
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        Write-Info "npm 版本: $(npm --version)"
    }
    
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Info "Git 版本: $(git --version)"
    }
}

# 顯示完成訊息
function Show-Completion {
    Write-Header "🎉 快速啟動完成！"
    
    Write-Host ""
    Write-Host "📋 接下來您可以："
    Write-Host "  1. 查看測試覆蓋率: .\scripts\test-runner.ps1 coverage"
    Write-Host "  2. 運行特定測試: .\scripts\test-runner.ps1 unit"
    Write-Host "  3. 清理測試文件: .\scripts\test-runner.ps1 clean"
    Write-Host "  4. 開始開發！"
    Write-Host ""
    Write-Host "🔧 有用的命令："
    Write-Host "  - 查看幫助: .\scripts\test-runner.ps1 help"
    Write-Host "  - 系統資訊: .\scripts\test-runner.ps1 system-info"
    Write-Host ""
    Write-Host "📚 專案文檔位於 docs\ 目錄"
    Write-Host ""
    Write-Host "💡 Windows 特定提示："
    Write-Host "  - 使用 PowerShell 或 Windows Terminal 獲得最佳體驗"
    Write-Host "  - 如果遇到執行策略問題，請檢查 PowerShell 執行策略"
    Write-Host "  - 建議安裝 Git for Windows 以獲得更好的 Git 支援"
    Write-Host ""
}

# 顯示幫助
function Show-Help {
    Write-ColorOutput "概念股篩選系統 - Windows 快速啟動腳本" "Cyan"
    Write-Host ""
    Write-ColorOutput "用法: .\quick-start-windows.ps1 [命令]" "White"
    Write-Host ""
    Write-ColorOutput "命令:" "White"
    Write-ColorOutput "  all            完整設置和測試 (預設)" "White"
    Write-ColorOutput "  setup          只設置環境" "White"
    Write-ColorOutput "  test           只運行測試" "White"
    Write-ColorOutput "  help           顯示此幫助信息" "White"
    Write-Host ""
    Write-ColorOutput "示例:" "White"
    Write-ColorOutput "  .\quick-start-windows.ps1 all      # 完整設置和測試" "White"
    Write-ColorOutput "  .\quick-start-windows.ps1 setup    # 只設置環境" "White"
    Write-ColorOutput "  .\quick-start-windows.ps1 test     # 只運行測試" "White"
    Write-Host ""
    Write-ColorOutput "Windows 特定功能:" "White"
    Write-ColorOutput "  - PowerShell 執行策略檢查" "White"
    Write-ColorOutput "  - Windows 系統資訊顯示" "White"
    Write-ColorOutput "  - 自動路徑處理" "White"
}

# 主函數
function Main {
    Write-Header "概念股篩選系統 - Windows 快速啟動"
    
    Write-Info "歡迎使用 Windows 快速啟動腳本！"
    Write-Info "此腳本將自動完成環境設置和測試執行。"
    Write-Host ""
    
    # 檢查 PowerShell 環境
    Test-PowerShellVersion
    Test-ExecutionPolicy
    
    # 檢查依賴
    if (!(Test-Dependencies)) {
        Write-Error "依賴檢查失敗，請先安裝必要的工具"
        exit 1
    }
    
    # 創建配置
    New-DevConfig
    
    switch ($Command.ToLower()) {
        "setup" {
            Write-Header "只設置環境"
            Install-TestDependencies
            Show-SystemInfo
        }
        "test" {
            Write-Header "只運行測試"
            if (Install-TestDependencies) {
                Invoke-Tests
                Generate-Reports
            }
        }
        "help" {
            Show-Help
            return
        }
        "all" {
            # 完整設置和測試
            if (Install-TestDependencies) {
                if (Invoke-Tests) {
                    Generate-Reports
                    Show-SystemInfo
                    Show-Completion
                }
            }
        }
        default {
            Write-Error "未知命令: $Command"
            Show-Help
            exit 1
        }
    }
}

# 錯誤處理
$ErrorActionPreference = "Stop"

# 運行主函數
try {
    Main
} catch {
    Write-Error "腳本執行失敗: $_"
    exit 1
}
