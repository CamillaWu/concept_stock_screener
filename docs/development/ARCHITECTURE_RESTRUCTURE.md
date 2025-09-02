# 專案架構重構完整文檔

## 1. 重構目標與原則

### 1.1 重構目標
- **清理技術債務**：移除現有損壞的前後端代碼
- **建立清晰架構**：採用 Monorepo 結構，明確模組職責
- **提升可維護性**：統一的技術棧和開發規範
- **支援跨平台開發**：macOS 和 Windows 環境兼容

### 1.2 架構原則
- **關注點分離**：前端、API、數據管道各自獨立
- **模組化設計**：可重用組件和類型定義
- **依賴最小化**：避免循環依賴和過度耦合
- **配置外部化**：環境配置和部署配置分離

## 2. 目標架構設計

### 2.1 整體目錄結構
```
concept_stock_screener/
├── apps/                           # 應用程式層
│   ├── web/                        # Next.js 前端應用
│   │   ├── src/
│   │   │   ├── app/               # App Router 頁面
│   │   │   ├── components/        # UI 組件
│   │   │   ├── hooks/            # 自定義 Hooks
│   │   │   ├── services/          # API 服務
│   │   │   ├── store/            # 狀態管理
│   │   │   ├── types/            # 類型定義
│   │   │   └── utils/            # 工具函數
│   │   ├── public/                # 靜態資源
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   ├── api/                       # Cloudflare Workers API
│   │   ├── src/
│   │   │   ├── handlers/         # API 處理器
│   │   │   ├── services/         # 業務邏輯服務
│   │   │   ├── middleware/       # 中間件
│   │   │   ├── types/           # 類型定義
│   │   │   └── utils/           # 工具函數
│   │   ├── package.json
│   │   ├── wrangler.toml
│   │   └── tsconfig.json
│   │
│   └── data-pipeline/            # Python RAG 數據管道
│       ├── src/
│       │   ├── etl/             # 數據提取轉換載入
│       │   ├── rag/             # RAG 處理邏輯
│       │   ├── models/          # 數據模型
│       │   ├── services/        # 外部服務整合
│       │   └── utils/           # 工具函數
│       ├── requirements.txt
│       ├── Dockerfile
│       └── README.md
│
├── packages/                       # 共享包層
│   ├── types/                     # 共享類型定義
│   │   ├── src/
│   │   │   ├── api/             # API 相關類型
│   │   │   ├── ui/              # UI 相關類型
│   │   │   └── common/          # 通用類型
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── ui/                        # 共享 UI 組件
│       ├── src/
│       │   ├── components/       # 基礎組件
│       │   ├── hooks/           # 共享 Hooks
│       │   └── utils/           # UI 工具
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── docs/                          # 文檔層
│   ├── development/              # 開發文檔
│   ├── deployment/               # 部署文檔
│   ├── api/                     # API 文檔
│   └── user/                    # 用戶文檔
│
├── scripts/                       # 腳本層
│   ├── development/              # 開發腳本
│   ├── deployment/               # 部署腳本
│   ├── testing/                  # 測試腳本
│   └── maintenance/              # 維護腳本
│
├── .github/                       # GitHub 配置
│   ├── workflows/                # CI/CD 工作流程
│   ├── ISSUE_TEMPLATE/           # Issue 模板
│   └── PULL_REQUEST_TEMPLATE.md  # PR 模板
│
├── .vscode/                       # VS Code 配置
├── .husky/                        # Git Hooks
├── package.json                   # 根目錄包管理
├── pnpm-workspace.yaml           # 工作區配置
├── tsconfig.base.json            # 基礎 TypeScript 配置
├── .eslintrc.js                  # ESLint 配置
├── .prettierrc                   # Prettier 配置
└── README.md                     # 專案說明
```

### 2.2 模組職責劃分

#### **apps/web (前端應用)**
- **職責**：用戶界面和交互邏輯
- **技術棧**：Next.js 14, React 18, TypeScript, Tailwind CSS
- **依賴**：packages/types, packages/ui
- **輸出**：靜態網站和客戶端應用

#### **apps/api (API 服務)**
- **職責**：後端 API 和業務邏輯
- **技術棧**：Cloudflare Workers, TypeScript
- **依賴**：packages/types
- **輸出**：RESTful API 端點

#### **apps/data-pipeline (數據管道)**
- **職責**：數據處理和 RAG 系統
- **技術棧**：Python 3.11+, FastAPI, LangChain
- **依賴**：外部數據源和 AI 服務
- **輸出**：處理後的數據和向量

#### **packages/types (類型定義)**
- **職責**：跨模組的類型定義
- **技術棧**：TypeScript
- **依賴**：無
- **輸出**：編譯後的類型定義文件

#### **packages/ui (UI 組件)**
- **職責**：可重用的 UI 組件
- **技術棧**：React, TypeScript, Tailwind CSS
- **依賴**：packages/types
- **輸出**：編譯後的組件庫

## 3. 重構執行計劃

### 3.1 第一階段：清理現有代碼
**目標**：移除損壞的代碼，保留必要文件
**時間**：1-2 天

#### 3.1.1 需要保留的文件
```
docs/
├── [PRD]概念股自動化篩選系統.md
├── archive/[功能&流程]概念股自動化篩選系統 - 功能細節與流程規格書.md
└── README.md

data/
└── rag/
    ├── docs.jsonl
    └── manifest.md

packages/
├── types/
│   └── src/
│       └── index.ts
└── ui/
    └── src/
        └── components/
```

#### 3.1.2 需要刪除的目錄
```
apps/
├── web/                          # 損壞的前端代碼
├── api/                          # 損壞的後端代碼
└── backup-components/            # 備份組件

scripts/                          # 過時的腳本
├── ci-cd/
├── tests/
├── deployment/
└── development/

.github/
└── workflows/                    # 舊的 CI/CD 配置
```

### 3.2 第二階段：建立新架構
**目標**：創建新的目錄結構和基礎配置
**時間**：2-3 天

#### 3.2.1 創建目錄結構
```bash
# 創建主要目錄
mkdir -p apps/{web,api,data-pipeline}
mkdir -p packages/{types,ui}
mkdir -p docs/{development,deployment,api,user}
mkdir -p scripts/{development,deployment,testing,maintenance}
mkdir -p .github/{workflows,ISSUE_TEMPLATE}
mkdir -p .vscode
mkdir -p .husky
```

#### 3.2.2 配置工作區
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### 3.2.3 建立基礎配置文件
- TypeScript 基礎配置
- ESLint 和 Prettier 配置
- Git Hooks 配置
- VS Code 工作區配置

### 3.3 第三階段：遷移和重構
**目標**：將保留的內容遷移到新架構
**時間**：3-4 天

#### 3.3.1 遷移類型定義
```bash
# 將現有類型定義遷移到 packages/types
cp packages/types/src/index.ts packages/types/src/
```

#### 3.3.2 遷移 UI 組件
```bash
# 將可用的 UI 組件遷移到 packages/ui
cp -r packages/ui/src/components/* packages/ui/src/components/
```

#### 3.3.3 遷移文檔
```bash
# 將文檔遷移到新的文檔結構
cp docs/[PRD]* docs/
cp docs/archive/* docs/development/
```

### 3.4 第四階段：驗證和測試
**目標**：確保新架構正常工作
**時間**：1-2 天

#### 3.4.1 依賴安裝測試
```bash
pnpm install
pnpm build
```

#### 3.4.2 類型檢查測試
```bash
pnpm type-check
```

#### 3.4.3 組件編譯測試
```bash
pnpm build:ui
```

## 4. 依賴關係管理

### 4.1 依賴圖
```
packages/types (基礎層)
    ↓
packages/ui (依賴 types)
    ↓
apps/web (依賴 types, ui)
apps/api (依賴 types)
apps/data-pipeline (獨立)
```

### 4.2 版本管理策略
- **packages/types**: 使用 semantic versioning
- **packages/ui**: 與 types 版本同步
- **apps**: 使用 workspace 協議版本

### 4.3 依賴安裝順序
```bash
# 1. 安裝根目錄依賴
pnpm install

# 2. 構建基礎包
pnpm --filter types build
pnpm --filter ui build

# 3. 構建應用
pnpm --filter web build
pnpm --filter api build
```

## 5. 開發工作流程

### 5.1 本地開發流程
```bash
# 啟動開發環境
pnpm dev:web          # 啟動前端開發服務器
pnpm dev:api          # 啟動 API 開發服務器
pnpm dev:pipeline     # 啟動數據管道
```

### 5.2 構建流程
```bash
# 構建所有包
pnpm build            # 構建所有包
pnpm build:types      # 僅構建類型定義
pnpm build:ui         # 僅構建 UI 組件
pnpm build:web        # 僅構建前端
pnpm build:api        # 僅構建 API
```

### 5.3 測試流程
```bash
# 運行測試
pnpm test             # 運行所有測試
pnpm test:types       # 測試類型定義
pnpm test:ui          # 測試 UI 組件
pnpm test:web         # 測試前端
pnpm test:api         # 測試 API
```

## 6. 配置管理

### 6.1 環境配置
```bash
# 環境變數文件
.env.local           # 本地開發
.env.development     # 開發環境
.env.production      # 生產環境
.env.test            # 測試環境
```

### 6.2 構建配置
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
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
  }
}
```

### 6.3 代碼品質配置
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
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

## 7. 風險評估與緩解

### 7.1 技術風險
- **風險**：TypeScript 配置複雜性
- **緩解**：使用基礎配置模板，逐步優化

- **風險**：工作區依賴管理
- **緩解**：建立清晰的依賴圖和安裝順序

### 7.2 時程風險
- **風險**：重構時間超出預期
- **緩解**：分階段執行，每階段都有可驗證的成果

- **風險**：依賴問題導致開發停滯
- **緩解**：預先測試依賴安裝和構建流程

### 7.3 品質風險
- **風險**：新架構引入新的 Bug
- **緩解**：建立完整的測試覆蓋和 CI/CD 流程

## 8. 成功標準

### 8.1 架構完整性
- ✅ 所有目錄結構正確創建
- ✅ 依賴關係正確配置
- ✅ 構建流程正常運行
- ✅ 類型檢查通過

### 8.2 功能完整性
- ✅ 保留的類型定義正常工作
- ✅ 保留的 UI 組件正常編譯
- ✅ 開發環境正常啟動
- ✅ 測試流程正常運行

### 8.3 開發效率
- ✅ 開發者可以快速理解架構
- ✅ 新功能開發有明確的添加位置
- ✅ 依賴管理清晰簡單
- ✅ 構建和部署流程自動化

## 9. 後續步驟

### 9.1 立即執行
1. 備份重要文件
2. 開始第一階段清理
3. 建立新的目錄結構

### 9.2 短期目標 (1-2 週)
1. 完成架構重構
2. 建立基礎開發環境
3. 開始核心功能開發

### 9.3 中期目標 (3-4 週)
1. 完成核心功能開發
2. 建立完整的測試覆蓋
3. 部署到開發環境

### 9.4 長期目標 (6-8 週)
1. 完成 MVP 功能
2. 部署到生產環境
3. 開始用戶測試和反饋收集
