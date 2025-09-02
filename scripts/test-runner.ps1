# 概念股篩選系統 - 測試執行腳本 (PowerShell)
# 用於執行不同類型的測試並生成報告

param(
    [Parameter(Position=0)]
    [string]$Command = "all"
)

# 腳本目錄
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TestsDir = Join-Path $ScriptDir "tests"

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
    Write-ColorOutput "⚠️ $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️ $Message" "Blue"
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput ""
    Write-ColorOutput "============================================================" "Cyan"
    Write-ColorOutput "  $Title" "Cyan"
    Write-ColorOutput "============================================================" "Cyan"
}

# 檢查依賴
function Test-Dependencies {
    Write-Info "檢查依賴..."
    
    # 檢查 Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Node.js 未安裝"
            exit 1
        }
        Write-Info "Node.js 版本: $nodeVersion"
    } catch {
        Write-Error "Node.js 未安裝"
        exit 1
    }
    
    # 檢查 npm
    try {
        $npmVersion = npm --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "npm 未安裝"
            exit 1
        }
        Write-Info "npm 版本: $npmVersion"
    } catch {
        Write-Error "npm 未安裝"
        exit 1
    }
    
    # 檢查 Jest
    try {
        $jestVersion = npx jest --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Jest 未安裝，正在安裝..."
            npm install --save-dev jest
        } else {
            Write-Info "Jest 版本: $jestVersion"
        }
    } catch {
        Write-Warning "Jest 未安裝，正在安裝..."
        npm install --save-dev jest
    }
    
    Write-Success "依賴檢查完成"
}

# 安裝測試依賴
function Install-TestDependencies {
    Write-Info "安裝測試依賴..."
    
    Set-Location $ScriptDir
    
    if (Test-Path "package.json") {
        npm install
        Write-Success "測試依賴安裝完成"
    } else {
        Write-Warning "未找到 package.json，跳過依賴安裝"
    }
}

# 運行單元測試
function Invoke-UnitTests {
    Write-Header "運行單元測試"
    
    Set-Location $TestsDir
    
    if (Test-Path "unit") {
        Write-Info "執行單元測試..."
        try {
            npx jest unit --coverage --testTimeout=30000
            if ($LASTEXITCODE -eq 0) {
                Write-Success "單元測試完成"
                return $true
            } else {
                Write-Error "單元測試失敗"
                return $false
            }
        } catch {
            Write-Error "單元測試執行時發生錯誤: $_"
            return $false
        }
    } else {
        Write-Warning "單元測試目錄不存在"
        return $true
    }
}

# 運行整合測試
function Invoke-IntegrationTests {
    Write-Header "運行整合測試"
    
    Set-Location $TestsDir
    
    if (Test-Path "integration") {
        Write-Info "執行整合測試..."
        try {
            npx jest integration --coverage --testTimeout=30000
            if ($LASTEXITCODE -eq 0) {
                Write-Success "整合測試完成"
                return $true
            } else {
                Write-Error "整合測試失敗"
                return $false
            }
        } catch {
            Write-Error "整合測試執行時發生錯誤: $_"
            return $false
        }
    } else {
        Write-Warning "整合測試目錄不存在"
        return $true
    }
}

# 運行端到端測試
function Invoke-E2ETests {
    Write-Header "運行端到端測試"
    
    Set-Location $TestsDir
    
    if (Test-Path "e2e") {
        Write-Info "執行端到端測試..."
        try {
            npx jest e2e --coverage --testTimeout=30000
            if ($LASTEXITCODE -eq 0) {
                Write-Success "端到端測試完成"
                return $true
            } else {
                Write-Error "端到端測試失敗"
                return $false
            }
        } catch {
            Write-Error "端到端測試執行時發生錯誤: $_"
            return $false
        }
    } else {
        Write-Warning "端到端測試目錄不存在"
        return $true
    }
}

# 運行效能測試
function Invoke-PerformanceTests {
    Write-Header "運行效能測試"
    
    Set-Location $TestsDir
    
    if (Test-Path "performance") {
        Write-Info "執行效能測試..."
        try {
            npx jest performance --coverage --testTimeout=30000
            if ($LASTEXITCODE -eq 0) {
                Write-Success "效能測試完成"
                return $true
            } else {
                Write-Error "效能測試失敗"
                return $false
            }
        } catch {
            Write-Error "效能測試執行時發生錯誤: $_"
            return $false
        }
    } else {
        Write-Warning "效能測試目錄不存在"
        return $true
    }
}

# 運行所有測試
function Invoke-AllTests {
    Write-Header "運行所有測試"
    
    $failedTests = 0
    
    # 單元測試
    if (Invoke-UnitTests) {
        Write-Success "單元測試通過"
    } else {
        Write-Error "單元測試失敗"
        $failedTests++
    }
    
    # 整合測試
    if (Invoke-IntegrationTests) {
        Write-Success "整合測試通過"
    } else {
        Write-Error "整合測試失敗"
        $failedTests++
    }
    
    # 端到端測試
    if (Invoke-E2ETests) {
        Write-Success "端到端測試通過"
    } else {
        Write-Error "端到端測試失敗"
        $failedTests++
    }
    
    # 效能測試
    if (Invoke-PerformanceTests) {
        Write-Success "效能測試通過"
    } else {
        Write-Error "效能測試失敗"
        $failedTests++
    }
    
    # 總結
    if ($failedTests -eq 0) {
        Write-Success "所有測試都通過了！"
        return $true
    } else {
        Write-Error "$failedTests 個測試類型失敗"
        return $false
    }
}

# 生成覆蓋率報告
function Generate-CoverageReport {
    Write-Header "生成覆蓋率報告"
    
    Set-Location $TestsDir
    
    if (Test-Path "coverage") {
        Write-Info "覆蓋率報告已生成"
        Write-Info "報告位置: $TestsDir\coverage"
        
        # 檢查 HTML 報告
        if (Test-Path "coverage\index.html") {
            Write-Info "HTML 報告: coverage\index.html"
        }
        
        # 檢查 LCOV 報告
        if (Test-Path "coverage\lcov.info") {
            Write-Info "LCOV 報告: coverage\lcov.info"
        }
        
        # 運行覆蓋率追蹤器
        if (Test-Path "coverage-tracker.js") {
            Write-Info "運行覆蓋率追蹤器..."
            try {
                node coverage-tracker.js report
            } catch {
                Write-Warning "覆蓋率追蹤器執行失敗: $_"
            }
        }
        
        Write-Success "覆蓋率報告生成完成"
    } else {
        Write-Warning "覆蓋率報告未生成，請先運行測試"
    }
}

# 清理測試文件
function Clear-TestFiles {
    Write-Header "清理測試文件"
    
    Set-Location $TestsDir
    
    $dirsToClean = @("coverage", "reports")
    
    foreach ($dir in $dirsToClean) {
        if (Test-Path $dir) {
            Remove-Item -Recurse -Force $dir
            Write-Success "已清理 $dir 目錄"
        } else {
            Write-Info "目錄 $dir 不存在，跳過清理"
        }
    }
    
    Write-Success "測試文件清理完成"
}

# 顯示幫助信息
function Show-Help {
    Write-ColorOutput "概念股篩選系統 - 測試執行腳本 (PowerShell)" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "用法: .\test-runner.ps1 [命令]" "White"
    Write-ColorOutput ""
    Write-ColorOutput "命令:" "White"
    Write-ColorOutput "  unit          運行單元測試" "White"
    Write-ColorOutput "  integration   運行整合測試" "White"
    Write-ColorOutput "  e2e           運行端到端測試" "White"
    Write-ColorOutput "  performance   運行效能測試" "White"
    Write-ColorOutput "  all           運行所有測試" "White"
    Write-ColorOutput "  coverage      生成覆蓋率報告" "White"
    Write-ColorOutput "  clean         清理測試文件" "White"
    Write-ColorOutput "  install       安裝測試依賴" "White"
    Write-ColorOutput "  help          顯示此幫助信息" "White"
    Write-ColorOutput ""
    Write-ColorOutput "示例:" "White"
    Write-ColorOutput "  .\test-runner.ps1 all         # 運行所有測試" "White"
    Write-ColorOutput "  .\test-runner.ps1 unit        # 只運行單元測試" "White"
    Write-ColorOutput "  .\test-runner.ps1 coverage    # 生成覆蓋率報告" "White"
}

# 主函數
function Main {
    Write-Header "概念股篩選系統 - 測試執行器 (PowerShell)"
    
    # 檢查依賴
    Test-Dependencies
    
    switch ($Command.ToLower()) {
        "unit" {
            Invoke-UnitTests
        }
        "integration" {
            Invoke-IntegrationTests
        }
        "e2e" {
            Invoke-E2ETests
        }
        "performance" {
            Invoke-PerformanceTests
        }
        "all" {
            Invoke-AllTests
        }
        "coverage" {
            Generate-CoverageReport
        }
        "clean" {
            Clear-TestFiles
        }
        "install" {
            Install-TestDependencies
        }
        "help" {
            Show-Help
            return
        }
        default {
            Write-Error "未知命令: $Command"
            Show-Help
            exit 1
        }
    }
    
    Write-Header "測試執行完成"
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
