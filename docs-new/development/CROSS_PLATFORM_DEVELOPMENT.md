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

#### **PowerShell 安裝腳本**
```powershell
# scripts/setup-windows.ps1

# 設置執行策略
Set-ExecutionPolicy Bypass -Scope Process -Force

Write-Host "🚀 開始設置 Windows 開發環境..." -ForegroundColor Green

# 檢查 Chocolatey 是否已安裝
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "✅ Chocolatey 已安裝" -ForegroundColor Green
}

# 更新 Chocolatey
Write-Host "🔄 更新 Chocolatey..." -ForegroundColor Yellow
choco upgrade all -y

# 安裝 Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 Node.js..." -ForegroundColor Yellow
    choco install nodejs -y
} else {
    Write-Host "✅ Node.js 已安裝: $(node --version)" -ForegroundColor Green
}

# 安裝 pnpm
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
} else {
    Write-Host "✅ pnpm 已安裝: $(pnpm --version)" -ForegroundColor Green
}

# 安裝 Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 Python 3.11..." -ForegroundColor Yellow
    choco install python311 -y
} else {
    Write-Host "✅ Python 已安裝: $(python --version)" -ForegroundColor Green
}

# 安裝 Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 Git..." -ForegroundColor Yellow
    choco install git -y
} else {
    Write-Host "✅ Git 已安裝: $(git --version)" -ForegroundColor Green
}

# 安裝 VS Code
if (!(Get-Command code -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 VS Code..." -ForegroundColor Yellow
    choco install vscode -y
} else {
    Write-Host "✅ VS Code 已安裝" -ForegroundColor Green
}

# 安裝 Docker Desktop
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "📦 安裝 Docker Desktop..." -ForegroundColor Yellow
    choco install docker-desktop -y
} else {
    Write-Host "✅ Docker 已安裝: $(docker --version)" -ForegroundColor Green
}

Write-Host "🎉 Windows 開發環境設置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 已安裝的工具：" -ForegroundColor Cyan
Write-Host "  - Chocolatey: 包管理器"
Write-Host "  - Node.js: $(node --version)"
Write-Host "  - pnpm: $(pnpm --version)"
Write-Host "  - Python: $(python --version)"
Write-Host "  - Git: $(git --version)"
Write-Host "  - VS Code: 已安裝"
Write-Host "  - Docker: $(docker --version)"
```

#### **快速啟動腳本**
```powershell
# scripts/quick-start-windows.ps1

Write-Host "🚀 快速啟動 Windows 開發環境..." -ForegroundColor Green

# 檢查必要工具
function Check-Tool {
    param([string]$ToolName, [string]$Command)
    
    if (!(Get-Command $Command -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $ToolName 未安裝，請先運行 setup-windows.ps1" -ForegroundColor Red
        exit 1
    }
}

Check-Tool "Node.js" "node"
Check-Tool "pnpm" "pnpm"
Check-Tool "Python" "python"
Check-Tool "Git" "git"

# 安裝依賴
Write-Host "📦 安裝專案依賴..." -ForegroundColor Yellow
pnpm install

# 構建基礎包
Write-Host "🔨 構建基礎包..." -ForegroundColor Yellow
pnpm --filter types build
pnpm --filter ui build

# 啟動開發環境
Write-Host "🌟 啟動開發環境..." -ForegroundColor Green
Write-Host ""
Write-Host "可用的命令：" -ForegroundColor Cyan
Write-Host "  pnpm dev:web          # 啟動前端開發服務器"
Write-Host "  pnpm dev:api          # 啟動 API 開發服務器"
Write-Host "  pnpm dev:pipeline     # 啟動數據管道"
Write-Host "  pnpm build            # 構建所有包"
Write-Host "  pnpm test             # 運行測試"
Write-Host ""
Write-Host "🎉 開發環境準備完成！" -ForegroundColor Green
```

### 3.2 開發工具配置

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
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

#### **PowerShell 配置**
```powershell
# PowerShell 配置文件
# 創建文件：$PROFILE

# 別名
Set-Alias -Name dev -Value "pnpm dev:web"
Set-Alias -Name api -Value "pnpm dev:api"
Set-Alias -Name build -Value "pnpm build"
Set-Alias -Name test -Value "pnpm test"
Set-Alias -Name lint -Value "pnpm lint"

# 函數
function Start-DevEnvironment {
    Write-Host "🚀 啟動開發環境..." -ForegroundColor Green
    pnpm dev:web
}

function Start-API {
    Write-Host "🔌 啟動 API 服務..." -ForegroundColor Green
    pnpm dev:api
}

function Start-Pipeline {
    Write-Host "📊 啟動數據管道..." -ForegroundColor Green
    pnpm dev:pipeline
}

# 導入到 PowerShell 配置
Export-ModuleMember -Alias * -Function *
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
