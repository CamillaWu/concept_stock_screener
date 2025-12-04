# 快速開始指南完整文檔

## 1. 項目概述

### 1.1 項目簡介

概念股自動化篩選系統是一個基於 AI 的智能投資分析平台，幫助用戶快速篩選和分析與特定概念相關的股票。

### 1.2 核心功能

- **智能搜索**：基於自然語言的股票和概念搜索
- **概念分析**：深度分析概念對股票的影響
- **趨勢預測**：AI 驅動的市場趨勢分析
- **個性化收藏**：用戶自定義股票收藏夾

### 1.3 技術架構

- **前端**：Next.js 14 + React 18 + TypeScript
- **後端**：Cloudflare Workers + TypeScript
- **AI 服務**：Google Gemini 2.5 Pro
- **數據存儲**：Pinecone 向量數據庫 + Redis 快取

## 2. 開發環境設置

### 2.1 系統要求

- **操作系統**：macOS 10.15+ 或 Windows 10+
- **Node.js**：18.0.0 或更高版本
- **Python**：3.11.0 或更高版本
- **Git**：2.30.0 或更高版本
- **記憶體**：至少 8GB RAM
- **硬碟空間**：至少 5GB 可用空間

### 2.2 必備工具安裝

#### macOS 環境設置

```bash
# 安裝 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安裝 Node.js
brew install node

# 安裝 Python
brew install python@3.11

# 安裝 Git
brew install git

# 安裝 pnpm
npm install -g pnpm
# 設定 pnpm node-linker (必跑一次)
bash ./scripts/setup/configure-pnpm-linker.sh

# 安裝 VS Code
brew install --cask visual-studio-code

# 安裝 Docker
brew install --cask docker
```

#### Windows 環境設置

```powershell
# 安裝 Chocolatey (以管理員身份運行 PowerShell)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 安裝 Node.js
choco install nodejs

# 安裝 Python
choco install python

# 安裝 Git
choco install git

# 安裝 pnpm
npm install -g pnpm
# 設定 pnpm node-linker (必跑一次)
PowerShell -ExecutionPolicy Bypass -File .\scripts\setup\configure-pnpm-linker.ps1
# 如遇權限錯誤，先執行
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# 安裝 VS Code
choco install vscode

# 安裝 Docker Desktop
choco install docker-desktop
```

### 2.3 項目克隆和設置

```bash
# 克隆項目
git clone https://github.com/your-username/concept_stock_screener.git
cd concept_stock_screener

# 安裝依賴
pnpm install

> **注意**：安裝依賴後請執行 scripts/setup/configure-pnpm-linker.sh (macOS/Linux) 或 scripts/setup/configure-pnpm-linker.ps1 (Windows) 以啟用 hoisted node-linker，避免 React 類型解析問題。

# 設置環境變數
cp env.example .env.local
# 編輯 .env.local 文件，填入必要的 API 密鑰

# 驗證安裝
pnpm run verify:setup
```

## 3. 快速上手教程

### 3.1 啟動開發環境

```bash
# 啟動前端開發服務器
pnpm dev:web

# 啟動 API 開發服務器
pnpm dev:api

# 啟動數據管道
pnpm dev:pipeline

# 或者一次性啟動所有服務
pnpm dev
```

### 3.2 第一個功能開發

#### 步驟 1：創建新組件

```bash
# 創建新的 React 組件
mkdir -p src/components/StockCard
touch src/components/StockCard/StockCard.tsx
touch src/components/StockCard/StockCard.test.tsx
touch src/components/StockCard/index.ts
```

#### 步驟 2：實現組件邏輯

```typescript
// src/components/StockCard/StockCard.tsx
import React from 'react';
import { Stock } from '@/types';

interface StockCardProps {
  stock: Stock;
  onSelect?: (stock: Stock) => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onSelect }) => {
  const handleClick = () => {
    onSelect?.(stock);
  };

  return (
    <div
      className="stock-card p-4 border rounded-lg shadow-sm hover:shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{stock.name}</h3>
          <p className="text-gray-600">{stock.code}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">
            ${stock.price?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {stock.changePercent?.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {stock.concepts?.map(concept => (
            <span
              key={concept}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
```

#### 步驟 3：編寫測試

```typescript
// src/components/StockCard/StockCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StockCard } from './StockCard';

const mockStock = {
  id: '1',
  name: '台積電',
  code: '2330',
  price: 500.0,
  changePercent: 2.5,
  concepts: ['AI', '半導體']
};

describe('StockCard', () => {
  it('should render stock information correctly', () => {
    render(<StockCard stock={mockStock} />);

    expect(screen.getByText('台積電')).toBeInTheDocument();
    expect(screen.getByText('2330')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('2.50%')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('半導體')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const mockOnSelect = jest.fn();
    render(<StockCard stock={mockStock} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText('台積電'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockStock);
  });
});
```

#### 步驟 4：導出組件

```typescript
// src/components/StockCard/index.ts
export { StockCard } from './StockCard';
export type { StockCardProps } from './StockCard';
```

### 3.3 集成到應用

```typescript
// src/app/page.tsx
import { StockCard } from '@/components/StockCard';

export default function HomePage() {
  const stocks = [
    {
      id: '1',
      name: '台積電',
      code: '2330',
      price: 500.0,
      changePercent: 2.5,
      concepts: ['AI', '半導體']
    },
    // ... 更多股票數據
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">概念股篩選器</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map(stock => (
          <StockCard key={stock.id} stock={stock} />
        ))}
      </div>
    </div>
  );
}
```

## 4. 開發工作流程

### 4.1 Git 工作流程

```bash
# 創建新功能分支
git checkout -b feature/stock-card-component

# 開發和測試
pnpm test
pnpm lint
pnpm type-check

# 提交更改
git add .
git commit -m "feat: add StockCard component with tests"

# 推送到遠程分支
git push origin feature/stock-card-component

# 創建 Pull Request
# 在 GitHub 上創建 PR，等待代碼審查
```

### 4.2 代碼品質檢查

```bash
# 運行所有檢查
pnpm run quality:check

# 或者分別運行
pnpm lint          # ESLint 檢查
pnpm type-check    # TypeScript 類型檢查
pnpm test          # 單元測試
pnpm test:e2e      # 端到端測試
```

### 4.3 構建和部署

```bash
# 構建應用
pnpm build

# 本地預覽構建結果
pnpm preview

# 部署到開發環境
pnpm deploy:dev

# 部署到生產環境
pnpm deploy:prod
```

## 5. 常見問題解答

### 5.1 安裝問題

#### Q: Node.js 版本不兼容

**A:** 確保使用 Node.js 18+ 版本

```bash
# 檢查版本
node --version

# 如果版本過低，使用 nvm 切換版本
nvm install 18
nvm use 18
```

#### Q: pnpm 安裝失敗

**A:** 清除快取並重新安裝

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

#### Q: Python 依賴安裝失敗

**A:** 檢查 Python 版本和虛擬環境

```bash
# 檢查 Python 版本
python --version

# 創建虛擬環境
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate     # Windows

# 安裝依賴
pip install -r requirements.txt
```

### 5.2 開發問題

#### Q: 熱重載不工作

**A:** 檢查文件監視器設置

```bash
# 增加文件監視器限制 (macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Windows 通常不需要額外配置
```

#### Q: TypeScript 錯誤

**A:** 檢查類型定義和配置

```bash
# 重新生成類型定義
pnpm run types:generate

# 檢查 TypeScript 配置
pnpm run type-check:verbose
```

#### Q: 測試失敗

**A:** 檢查測試環境和依賴

```bash
# 清理測試快取
pnpm test --clearCache

# 檢查測試環境變數
echo $NODE_ENV
echo $TEST_DATABASE_URL
```

### 5.3 部署問題

#### Q: 構建失敗

**A:** 檢查構建日誌和依賴

```bash
# 詳細構建日誌
pnpm build --verbose

# 檢查依賴衝突
pnpm list --depth=0
```

#### Q: 環境變數缺失

**A:** 檢查環境配置文件

```bash
# 檢查環境變數
cat .env.local

# 驗證必要變數
pnpm run env:check
```

## 6. 開發工具配置

### 6.1 VS Code 配置

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### 6.2 推薦 VS Code 擴展

- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **GitLens**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### 6.3 終端配置

```bash
# ~/.zshrc (macOS) 或 ~/.bashrc (Linux)
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.pnpm:$PATH"

# Git 別名
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# 項目別名
alias dev='pnpm dev'
alias build='pnpm build'
alias test='pnpm test'
alias lint='pnpm lint'
```

## 7. 性能優化技巧

### 7.1 開發時性能優化

```typescript
// 使用 React.memo 優化組件渲染
export const StockCard = React.memo<StockCardProps>(({ stock, onSelect }) => {
  // 組件實現
});

// 使用 useMemo 優化計算
const expensiveCalculation = useMemo(() => {
  return stocks.filter(stock =>
    stock.concepts.some(concept =>
      concept.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}, [stocks, searchTerm]);

// 使用 useCallback 優化函數引用
const handleStockSelect = useCallback(
  (stock: Stock) => {
    onSelect?.(stock);
  },
  [onSelect]
);
```

### 7.2 構建優化

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/hooks'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    return config;
  },
};
```

## 8. 調試技巧

### 8.1 前端調試

```typescript
// 使用 console.log 調試
console.log('Stock data:', stock);
console.log('Component props:', props);

// 使用 React DevTools
// 安裝 React Developer Tools 瀏覽器擴展

// 使用 debugger 語句
debugger;
const result = expensiveCalculation();
```

### 8.2 後端調試

```typescript
// 使用 wrangler 調試 Cloudflare Workers
wrangler dev --local

// 使用 console.log 調試
console.log('Request:', request);
console.log('Response:', response);

// 使用 wrangler tail 查看日誌
wrangler tail --env development
```

### 8.3 數據庫調試

```bash
# 檢查 Pinecone 索引
wrangler kv:namespace list

# 檢查 Redis 數據
redis-cli
> KEYS *
> GET key_name
```

## 9. 學習資源

### 9.1 官方文檔

- [Next.js 文檔](https://nextjs.org/docs)
- [React 文檔](https://react.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)

### 9.2 相關技術

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Pinecone 向量數據庫](https://docs.pinecone.io/)

### 9.3 社區資源

- [GitHub Discussions](https://github.com/your-username/concept_stock_screener/discussions)
- [Discord 社區](https://discord.gg/your-community)
- [技術部落格](https://your-blog.com)

## 10. 後續步驟

### 10.1 立即開始

1. 完成開發環境設置
2. 運行第一個測試
3. 創建第一個組件

### 10.2 短期目標 (1-2 週)

1. 熟悉項目架構
2. 完成基礎功能開發
3. 建立開發工作流程

### 10.3 中期目標 (3-4 週)

1. 參與功能開發
2. 優化代碼品質
3. 學習高級技術

### 10.4 長期目標 (6-8 週)

1. 成為核心開發者
2. 指導新成員
3. 貢獻項目架構
