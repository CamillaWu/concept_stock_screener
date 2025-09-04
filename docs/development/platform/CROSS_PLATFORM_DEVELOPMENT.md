# 跨平台開發支援完整文檔

## 1. 跨平台開發原則

### 1.1 開發環境統一

- **技術棧一致**：所有平台使用相同的技術棧
- **配置標準化**：統一的開發工具和配置
- **依賴管理**：使用 pnpm 工作區管理依賴
- **腳本自動化**：自動化環境設置和依賴安裝

### 1.2 兼容性要求

- **macOS 10.15+**：支援最新的 macOS 版本
- **Windows 10/11**：支援 Windows 10 和 11
- **Node.js 18+**：使用 LTS 版本的 Node.js
- **Python 3.11+**：使用穩定的 Python 版本

## 2. macOS 開發環境

### 2.1 環境設置腳本

#### **自動化安裝腳本**

```bash
#!/bin/bash
# scripts/setup-macos.sh

set -e

echo "🚀 開始設置 macOS 開發環境..."

# 檢查 Homebrew 是否已安裝
if ! command -v brew &> /dev/null; then
    echo "📦 安裝 Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # 添加 Homebrew 到 PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
else
    echo "✅ Homebrew 已安裝"
fi

# 更新 Homebrew
echo "🔄 更新 Homebrew..."
brew update

# 安裝 Node.js
if ! command -v node &> /dev/null; then
    echo "📦 安裝 Node.js..."
    brew install node
else
    echo "✅ Node.js 已安裝: $(node --version)"
fi

# 安裝 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安裝 pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm 已安裝: $(pnpm --version)"
fi

# 安裝 Python
if ! command -v python3 &> /dev/null; then
    echo "📦 安裝 Python 3.11..."
    brew install python@3.11
else
    echo "✅ Python 已安裝: $(python3 --version)"
fi

# 安裝 Git
if ! command -v git &> /dev/null; then
    echo "📦 安裝 Git..."
    brew install git
else
    echo "✅ Git 已安裝: $(git --version)"
fi

# 安裝 VS Code
if ! command -v code &> /dev/null; then
    echo "📦 安裝 VS Code..."
    brew install --cask visual-studio-code
else
    echo "✅ VS Code 已安裝"
fi

# 安裝 Docker
if ! command -v docker &> /dev/null; then
    echo "📦 安裝 Docker..."
    brew install --cask docker
else
    echo "✅ Docker 已安裝: $(docker --version)"
fi

echo "🎉 macOS 開發環境設置完成！"
echo ""
echo "📋 已安裝的工具："
echo "  - Homebrew: $(brew --version)"
echo "  - Node.js: $(node --version)"
echo "  - pnpm: $(pnpm --version)"
echo "  - Python: $(python3 --version)"
echo "  - Git: $(git --version)"
echo "  - VS Code: 已安裝"
echo "  - Docker: $(docker --version)"
```

#### **快速啟動腳本**

```bash
#!/bin/bash
# scripts/quick-start-macos.sh

set -e

echo "🚀 快速啟動 macOS 開發環境..."

# 檢查必要工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安裝，請先運行 setup-macos.sh"
        exit 1
    fi
}

check_tool "node"
check_tool "pnpm"
check_tool "python3"
check_tool "git"

# 安裝依賴
echo "📦 安裝專案依賴..."
pnpm install

# 構建基礎包
echo "🔨 構建基礎包..."
pnpm --filter types build
pnpm --filter ui build

# 啟動開發環境
echo "🌟 啟動開發環境..."
echo ""
echo "可用的命令："
echo "  pnpm dev:web          # 啟動前端開發服務器"
echo "  pnpm dev:api          # 啟動 API 開發服務器"
echo "  pnpm dev:pipeline     # 啟動數據管道"
echo "  pnpm build            # 構建所有包"
echo "  pnpm test             # 運行測試"
echo ""
echo "🎉 開發環境準備完成！"
```

### 2.2 開發工具配置

#### **VS Code 配置**

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.suggest.autoImports": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### **Shell 配置**

```bash
# ~/.zshrc 或 ~/.bash_profile
export PATH="/opt/homebrew/bin:$PATH"
export PATH="/opt/homebrew/sbin:$PATH"

# Node.js 版本管理
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Python 路徑
export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"

# 別名
alias dev="pnpm dev:web"
alias api="pnpm dev:api"
alias build="pnpm build"
alias test="pnpm test"
alias lint="pnpm lint"
```

## 3. Windows 開發環境

### 3.1 環境設置腳本

#### **自動化安裝腳本**

```powershell
# scripts/quick-start-windows.ps1

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
        Write-Log "pnpm 未安裝或不在 PATH 中" "Error"
        Write-Log "請執行: npm install -g pnpm" "Error"
        return $false
    }
}

# 檢查 Python
function Test-Python {
    Write-Log "檢查 Python..." "Info"

    try {
        $pythonVersion = py -3.11 --version
        Write-Log "Python 版本: $pythonVersion" "Success"
        return $true
    }
    catch {
        Write-Log "Python 3.11 未安裝或不在 PATH 中" "Error"
        Write-Log "請從 https://www.python.org/downloads/ 下載並安裝 Python 3.11+" "Error"
        return $false
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
        Write-Log "Git 未安裝或不在 PATH 中" "Error"
        Write-Log "請從 https://git-scm.com/ 下載並安裝 Git" "Error"
        return $false
    }
}

# 環境檢查主函數
function Start-EnvironmentCheck {
    if ($SkipChecks) {
        Write-Log "跳過環境檢查" "Warning"
        return $true
    }

    Write-Log "開始環境檢查..." "Info"

    $allPassed = $true

    # 檢查執行策略
    if (-not (Test-ExecutionPolicy)) {
        $allPassed = $false
    }

    # 檢查 Node.js
    if (-not (Test-NodeJS)) {
        $allPassed = $false
    }

    # 檢查 pnpm
    if (-not (Test-Pnpm)) {
        $allPassed = $false
    }

    # 檢查 Python
    if (-not (Test-Python)) {
        $allPassed = $false
    }

    # 檢查 Git
    if (-not (Test-Git)) {
        $allPassed = $false
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
```

### 3.2 環境修復記錄 (2024-12-19)

#### 3.2.1 問題識別

在從 Mac 環境遷移到 Windows 環境時，發現以下問題：

1. **Python 環境缺失**: Windows 環境未安裝 Python 3.11+
2. **TypeScript 版本兼容性**: 使用 TypeScript 5.9.2 與 ESLint 不兼容
3. **API 模組類型錯誤**: Cloudflare Workers 與 `itty-router` 類型不匹配

#### 3.2.2 解決方案

1. **Python 環境安裝**:

   ```powershell
   winget install Python.Python.3.11
   # 使用 py -3.11 命令運行 Python
   ```

2. **TypeScript 版本降級**:

   ```powershell
   pnpm add -D typescript@5.5.3 -w
   # 解決 ESLint 版本警告
   ```

3. **API 類型錯誤修復**:
   ```typescript
   // 使用類型斷言解決 itty-router 兼容性問題
   router.get('/api/stocks/:symbol', stockHandler.getStock as any);
   ```

#### 3.2.3 修復結果

- ✅ 所有環境問題已解決
- ✅ 項目在 Windows 環境下構建成功
- ✅ 代碼質量檢查全部通過
- ✅ Mac → Windows 環境遷移完全成功

### 3.3 狀態檢查腳本

#### 3.3.1 簡化狀態檢查腳本

創建了 `scripts/status-check.ps1` 用於快速檢查 Windows 環境狀態：

```powershell
# 運行狀態檢查
.\scripts\status-check.ps1
```

#### 3.3.2 檢查內容

- Node.js 和 pnpm 版本
- Python 環境狀態
- 項目構建狀態
- 代碼質量檢查結果
- 環境遷移完成確認

### 3.4 使用說明

#### 3.4.1 快速啟動

```powershell
# 完整流程
.\scripts\quick-start-windows.ps1

# 跳過環境檢查
.\scripts\quick-start-windows.ps1 -SkipChecks

# 跳過依賴安裝
.\scripts\quick-start-windows.ps1 -SkipInstall
```

#### 3.4.2 手動設置

```powershell
# 安裝依賴
pnpm install

# 構建基礎包
pnpm build:types
pnpm build:ui

# 啟動開發服務
pnpm dev:web      # 前端 (http://localhost:3000)
pnpm dev:api      # API (http://localhost:8787)
```

## 4. 跨平台腳本系統

### 4.1 統一腳本接口

#### **跨平台運行器**

```javascript
// scripts/cross-platform-runner.js
#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

class CrossPlatformRunner {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
    this.isMac = this.platform === 'darwin';
    this.isLinux = this.platform === 'linux';
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: this.isWindows,
        ...options
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runScript(scriptName) {
    const scriptPath = path.join(__dirname, scriptName);

    if (this.isWindows) {
      await this.runCommand('powershell', ['-ExecutionPolicy', 'Bypass', '-File', scriptPath]);
    } else {
      await this.runCommand('bash', [scriptPath]);
    }
  }

  async setupEnvironment() {
    console.log(`🚀 設置 ${this.platform} 開發環境...`);

    if (this.isWindows) {
      await this.runScript('setup-windows.ps1');
    } else if (this.isMac) {
      await this.runScript('setup-macos.sh');
    } else {
      console.log('❌ 不支援的作業系統');
      process.exit(1);
    }
  }

  async quickStart() {
    console.log(`🚀 快速啟動 ${this.platform} 開發環境...`);

    if (this.isWindows) {
      await this.runScript('quick-start-windows.ps1');
    } else if (this.isMac) {
      await this.runScript('quick-start-macos.sh');
    } else {
      console.log('❌ 不支援的作業系統');
      process.exit(1);
    }
  }
}

// 命令行接口
const runner = new CrossPlatformRunner();
const command = process.argv[2];

switch (command) {
  case 'setup':
    runner.setupEnvironment().catch(console.error);
    break;
  case 'start':
    runner.quickStart().catch(console.error);
    break;
  default:
    console.log('可用命令：');
    console.log('  node cross-platform-runner.js setup  # 設置開發環境');
    console.log('  node cross-platform-runner.js start  # 快速啟動');
    break;
}
```

### 4.2 環境檢測腳本

#### **環境檢測工具**

```javascript
// scripts/environment-detector.js
#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

class EnvironmentDetector {
  constructor() {
    this.platform = os.platform();
    this.arch = os.arch();
    this.nodeVersion = process.version;
    this.npmVersion = this.getNpmVersion();
    this.pnpmVersion = this.getPnpmVersion();
    this.pythonVersion = this.getPythonVersion();
    this.gitVersion = this.getGitVersion();
  }

  getNpmVersion() {
    try {
      return execSync('npm --version', { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  getPnpmVersion() {
    try {
      return execSync('pnpm --version', { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  getPythonVersion() {
    try {
      return execSync('python3 --version', { encoding: 'utf8' }).trim();
    } catch {
      try {
        return execSync('python --version', { encoding: 'utf8' }).trim();
      } catch {
        return '未安裝';
      }
    }
  }

  getGitVersion() {
    try {
      return execSync('git --version', { encoding: 'utf8' }).trim();
    } catch {
      return '未安裝';
    }
  }

  generateReport() {
    console.log('🔍 開發環境檢測報告');
    console.log('========================');
    console.log(`作業系統: ${this.platform} (${this.arch})`);
    console.log(`Node.js: ${this.nodeVersion}`);
    console.log(`npm: ${this.npmVersion}`);
    console.log(`pnpm: ${this.pnpmVersion}`);
    console.log(`Python: ${this.pythonVersion}`);
    console.log(`Git: ${this.gitVersion}`);
    console.log('========================');

    this.checkCompatibility();
  }

  checkCompatibility() {
    console.log('\n📋 相容性檢查:');

    // 檢查 Node.js 版本
    const nodeMajor = parseInt(process.version.slice(1).split('.')[0]);
    if (nodeMajor >= 18) {
      console.log('✅ Node.js 版本符合要求 (>= 18)');
    } else {
      console.log('❌ Node.js 版本過低，需要 18+');
    }

    // 檢查 pnpm
    if (this.pnpmVersion !== '未安裝') {
      console.log('✅ pnpm 已安裝');
    } else {
      console.log('❌ pnpm 未安裝');
    }

    // 檢查 Python
    if (this.pythonVersion !== '未安裝') {
      const pythonMajor = parseInt(this.pythonVersion.split(' ')[1].split('.')[0]);
      if (pythonMajor >= 3) {
        console.log('✅ Python 版本符合要求 (>= 3.11)');
      } else {
        console.log('❌ Python 版本過低，需要 3.11+');
      }
    } else {
      console.log('❌ Python 未安裝');
    }

    // 檢查 Git
    if (this.gitVersion !== '未安裝') {
      console.log('✅ Git 已安裝');
    } else {
      console.log('❌ Git 未安裝');
    }
  }
}

// 執行檢測
const detector = new EnvironmentDetector();
detector.generateReport();
```

## 5. 依賴管理策略

### 5.1 跨平台依賴管理

#### **package.json 腳本**

```json
// package.json
{
  "scripts": {
    "setup:mac": "bash scripts/setup-macos.sh",
    "setup:win": "powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1",
    "setup": "node scripts/cross-platform-runner.js setup",
    "start:mac": "bash scripts/quick-start-macos.sh",
    "start:win": "powershell -ExecutionPolicy Bypass -File scripts/quick-start-windows.ps1",
    "start": "node scripts/cross-platform-runner.js start",
    "check-env": "node scripts/environment-detector.js",
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "dev:pipeline": "pnpm --filter data-pipeline dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint"
  }
}
```

### 5.2 環境變數管理

#### **環境配置模板**

```bash
# .env.example
# 跨平台環境變數配置

# 應用配置
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8787

# AI 服務配置
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp

# Cloudflare 配置
CLOUDFLARE_API_TOKEN=your_cloudflare_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here

# 數據管道配置
PYTHON_PATH=python3
PIP_PATH=pip3

# 開發工具配置
EDITOR=code
BROWSER=open
```

## 6. 常見問題解決

### 6.1 macOS 常見問題

#### **權限問題**

```bash
# 解決 Homebrew 權限問題
sudo chown -R $(whoami) /opt/homebrew

# 解決 npm 全局安裝權限問題
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zprofile
```

#### **Python 路徑問題**

```bash
# 添加 Python 到 PATH
echo 'export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"' >> ~/.zprofile
source ~/.zprofile
```

### 6.2 Windows 常見問題

#### **執行策略問題**

```powershell
# 設置 PowerShell 執行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 或者設置為 Bypass（僅開發環境）
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

#### **路徑問題**

```powershell
# 檢查環境變數
$env:PATH -split ';'

# 添加工具到 PATH
$env:PATH += ";C:\Users\$env:USERNAME\AppData\Roaming\npm"
```

## 7. 開發工作流程

### 7.1 標準開發流程

#### **新功能開發流程**

```bash
# 1. 檢查環境
pnpm check-env

# 2. 安裝依賴
pnpm install

# 3. 啟動開發環境
pnpm dev:web

# 4. 新終端啟動 API
pnpm dev:api

# 5. 新終端啟動數據管道
pnpm dev:pipeline
```

### 7.2 跨平台測試

#### **測試腳本**

```bash
# scripts/test-cross-platform.sh
#!/bin/bash

echo "🧪 開始跨平台測試..."

# 測試 Node.js
echo "測試 Node.js..."
node --version

# 測試 pnpm
echo "測試 pnpm..."
pnpm --version

# 測試 Python
echo "測試 Python..."
python3 --version

# 測試 Git
echo "測試 Git..."
git --version

# 測試構建
echo "測試構建..."
pnpm build

# 測試測試
echo "測試測試..."
pnpm test

echo "✅ 跨平台測試完成！"
```

## 8. 成功標準

### 8.1 環境一致性

- ✅ macOS 和 Windows 環境設置成功
- ✅ 所有必要工具正確安裝
- ✅ 依賴管理正常工作
- ✅ 構建流程跨平台兼容

### 8.2 開發效率

- ✅ 環境設置腳本自動化
- ✅ 開發環境快速啟動
- ✅ 跨平台腳本統一接口
- ✅ 問題診斷工具完整

### 8.3 維護性

- ✅ 環境配置文檔完整
- ✅ 問題解決指南詳細
- ✅ 腳本代碼可維護
- ✅ 版本控制規範

## 9. 後續優化

### 9.1 短期優化 (1-2 週)

- 完善環境檢測工具
- 優化腳本執行效率
- 增加更多平台支持

### 9.2 中期優化 (3-4 週)

- 自動化環境同步
- 雲端開發環境
- 容器化開發環境

### 9.3 長期優化 (6-8 週)

- 多平台 CI/CD
- 自動化測試環境
- 開發環境標準化
