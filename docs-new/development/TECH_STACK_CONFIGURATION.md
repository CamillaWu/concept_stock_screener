# 技術棧選擇與配置完整文檔

## 1. 技術棧選擇原則

### 1.1 選擇標準
- **穩定性優先**：選擇成熟、穩定的技術
- **開發效率**：提升開發速度和代碼品質
- **維護成本**：降低長期維護成本
- **跨平台兼容**：支援 macOS 和 Windows 開發
- **社區支持**：有活躍的社區和豐富的資源

### 1.2 重構原則
- **完全重頭開始**：除了必要文件，所有代碼重新開發
- **統一技術棧**：避免技術碎片化
- **現代化架構**：採用最新的最佳實踐
- **簡化依賴**：最小化外部依賴

## 2. 前端技術棧

### 2.1 Next.js 14
#### **選擇原因**
- **App Router**：最新的路由系統，支援 React 18 特性
- **TypeScript 原生支持**：完整的類型安全
- **SSR/SSG 支持**：提升 SEO 和首屏載入速度
- **Vercel 部署**：簡單的部署流程
- **開發體驗**：熱重載、快速刷新等

#### **配置要求**
```json
// package.json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

#### **基礎配置**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
}

module.exports = nextConfig
```

### 2.2 TypeScript 5.0+
#### **選擇原因**
- **類型安全**：減少運行時錯誤
- **開發體驗**：智能提示、重構支持
- **代碼品質**：強制類型檢查
- **團隊協作**：清晰的接口定義

#### **配置要求**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 2.3 Tailwind CSS 3.3+
#### **選擇原因**
- **原子化 CSS**：快速構建界面
- **響應式設計**：內建響應式工具
- **設計系統**：一致的設計語言
- **開發效率**：減少 CSS 編寫時間

#### **配置要求**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

## 3. 後端技術棧

### 3.1 Cloudflare Workers
#### **選擇原因**
- **邊緣計算**：全球低延遲
- **無服務器**：自動擴展，按使用計費
- **TypeScript 支持**：原生 TypeScript 支持
- **KV 存儲**：內建鍵值存儲
- **基礎額度**：每日 10 萬次請求基礎額度

#### **配置要求**
```toml
# wrangler.toml
name = "concept-stock-api"
main = "src/index.ts"
compatibility_date = "2023-10-30"

[env.production]
name = "concept-stock-api-prod"

[env.staging]
name = "concept-stock-api-staging"

[[kv_namespaces]]
binding = "STOCK_DATA"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

#### **依賴配置**
```json
// package.json
{
  "dependencies": {
    "@cloudflare/workers-types": "^4.0.0"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
```

### 3.2 類型定義
#### **API 類型**
```typescript
// packages/types/src/api/index.ts
export interface StockConcept {
  id: string;
  theme: string;
  description: string;
  heatScore: number;
  stocks: Stock[];
}

export interface Stock {
  ticker: string;
  name: string;
  exchange: 'TWSE' | 'TPEx';
  reason: string;
}

export interface StockAnalysisResult {
  stock: {
    ticker: string;
    name: string;
  };
  themes: ThemeForStock[];
}
```

## 4. 數據管道技術棧

### 4.1 Python 3.11+
#### **選擇原因**
- **AI/ML 生態**：豐富的機器學習庫
- **RAG 支持**：LangChain、Chroma 等
- **數據處理**：Pandas、NumPy 等
- **社區支持**：活躍的 AI 開發社區

#### **環境配置**
```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
langchain==0.0.350
chromadb==0.4.15
pandas==2.1.3
numpy==1.25.2
python-dotenv==1.0.0
httpx==0.25.2
```

### 4.2 FastAPI
#### **選擇原因**
- **現代化框架**：基於 Python 3.6+ 類型提示
- **自動文檔**：OpenAPI/Swagger 自動生成
- **高性能**：基於 Starlette 和 Pydantic
- **類型安全**：完整的類型檢查

#### **基礎配置**
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Concept Stock Data Pipeline",
    description="RAG 數據處理管道",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 5. 開發工具配置

### 5.1 包管理器：pnpm
#### **選擇原因**
- **效能優越**：比 npm 快 2-3 倍
- **磁盤空間**：節省大量磁盤空間
- **Monorepo 支持**：原生工作區支持
- **依賴管理**：更嚴格的依賴管理

#### **配置要求**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json
{
  "packageManager": "pnpm@8.0.0",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "lint": "pnpm --recursive lint"
  }
}
```

### 5.2 代碼品質工具

#### **ESLint**
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

#### **Prettier**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### **Husky + lint-staged**
```json
// package.json
{
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 6. 環境配置

### 6.1 環境變數
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_APP_ENV=development

# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_ENV=production
```

### 6.2 開發環境配置
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.suggest.autoImports": true
}
```

## 7. 依賴管理策略

### 7.1 版本鎖定
- **生產依賴**：使用 `^` 允許補丁和次要版本更新
- **開發依賴**：使用 `~` 只允許補丁版本更新
- **核心依賴**：鎖定特定版本確保穩定性

### 7.2 依賴更新策略
```bash
# 檢查過時依賴
pnpm outdated

# 更新依賴
pnpm update

# 安全更新
pnpm audit --fix
```

## 8. 跨平台兼容性

### 8.1 macOS 開發環境
```bash
# 安裝 Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安裝 Node.js
brew install node

# 安裝 pnpm
npm install -g pnpm

# 安裝 Python
brew install python@3.11
```

### 8.2 Windows 開發環境
```powershell
# 安裝 Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 安裝 Node.js
choco install nodejs

# 安裝 pnpm
npm install -g pnpm

# 安裝 Python
choco install python
```

## 9. 性能優化配置

### 9.1 Next.js 優化
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components']
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif']
  }
}
```

### 9.2 TypeScript 優化
```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo",
    "skipLibCheck": true
  }
}
```

## 10. 安全配置

### 10.1 環境變數安全
```bash
# .env.example
NEXT_PUBLIC_API_URL=
GEMINI_API_KEY=
CLOUDFLARE_API_TOKEN=
```

### 10.2 依賴安全
```bash
# 定期檢查安全漏洞
pnpm audit

# 自動修復
pnpm audit --fix
```

## 11. 成功標準

### 11.1 技術棧完整性
- ✅ 所有技術選擇明確且有充分理由
- ✅ 配置文件完整且正確
- ✅ 依賴關係清晰且無衝突
- ✅ 跨平台兼容性驗證通過

### 11.2 開發效率
- ✅ 開發環境快速啟動
- ✅ 構建流程穩定快速
- ✅ 代碼品質工具正常工作
- ✅ 熱重載和快速刷新正常

### 11.3 維護性
- ✅ 技術棧現代化且穩定
- ✅ 配置集中管理
- ✅ 依賴版本控制
- ✅ 文檔完整清晰
