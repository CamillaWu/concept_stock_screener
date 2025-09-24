# CI/CD 流程設計完整文檔

## 1. CI/CD 設計原則

### 1.1 設計目標

- **雙環境支援**：開發環境和生產環境完全分離，適合單人項目
- **自動化程度高**：最小化人工干預，提升部署效率
- **品質保證**：每次部署前必須通過完整的測試和檢查
- **快速回滾**：問題發生時能夠快速恢復到穩定版本

### 1.2 核心原則

- **Infrastructure as Code**：所有配置都版本化
- **藍綠部署**：生產環境使用藍綠部署策略
- **持續監控**：部署後持續監控系統狀態
- **安全優先**：所有部署都經過安全檢查

## 2. 整體架構設計

### 2.1 CI/CD 流程圖

```
開發者提交代碼
       ↓
  觸發 CI 流程
       ↓
  代碼品質檢查
       ↓
  自動化測試
       ↓
  構建和打包
       ↓
  部署到開發環境
       ↓
  自動化測試驗證
       ↓
  手動審核確認
       ↓
  部署到生產環境
       ↓
  生產環境驗證
       ↓
  監控和警報
```

### 2.2 環境分離策略

- **開發環境 (Development)**
  - 用途：功能開發、測試、整合測試
  - 部署：每次 push 到 develop 分支自動部署
  - 數據：測試數據，可重置
  - 分支：develop, feature/\*

- **生產環境 (Production)**
  - 用途：正式用戶服務
  - 部署：push 到 main 分支自動部署
  - 數據：真實用戶數據，不可重置
  - 分支：main

## 3. 開發環境 CI/CD 流程

### 3.1 觸發條件

```yaml
# .github/workflows/dev-ci.yml
name: Development CI/CD
on:
  push:
    branches: [develop, feature/*]
  pull_request:
    branches: [develop]
  workflow_dispatch:
```

### 3.2 開發環境 CI 流程

#### 3.2.1 代碼品質檢查

```yaml
jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint check
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Format check
        run: pnpm format:check
```

#### 3.2.2 自動化測試

```yaml
test:
  runs-on: ubuntu-latest
  needs: code-quality
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: pnpm install

    - name: Run unit tests
      run: pnpm test:unit

    - name: Run integration tests
      run: pnpm test:integration

    - name: Run E2E tests
      run: pnpm test:e2e

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

#### 3.2.3 構建和打包

```yaml
build:
  runs-on: ubuntu-latest
  needs: test
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: pnpm install

    - name: Build packages
      run: |
        pnpm build:types
        pnpm build:ui

    - name: Build applications
      run: |
        pnpm build:web
        pnpm build:api

    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          apps/web/.next/
          apps/api/dist/
          packages/types/dist/
          packages/ui/dist/
```

### 3.3 開發環境 CD 流程

#### 3.3.1 自動部署到開發環境

```yaml
deploy-dev:
  runs-on: ubuntu-latest
  needs: build
  environment: development
  steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts

    - name: Deploy to Vercel (Frontend)
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN_DEV }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID_DEV }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DEV }}
        vercel-args: '--prod'

    - name: Deploy to Cloudflare (API)
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN_DEV }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID_DEV }}
        command: deploy
        environment: development

    - name: Deploy to Cloudflare (Data Pipeline)
      run: |
        cd apps/data-pipeline
        pip install -r requirements.txt
        python -m pytest tests/
        # 部署到 Cloudflare Workers
```

#### 3.2.2 開發環境驗證

```yaml
verify-dev:
  runs-on: ubuntu-latest
  needs: deploy-dev
  steps:
    - name: Health check - Frontend
      run: |
        curl -f ${{ secrets.DEV_FRONTEND_URL }}/api/health

    - name: Health check - API
      run: |
        curl -f ${{ secrets.DEV_API_URL }}/health

    - name: Run smoke tests
      run: pnpm test:smoke:dev

    - name: Notify deployment success
      if: success()
      uses: 8398a7/action-slack@v3
      with:
        status: success
        channel: '#dev-deployments'
        text: '✅ Development deployment successful!'
```

## 4. 生產環境 CI/CD 流程

### 4.1 觸發條件

```yaml
# .github/workflows/prod-ci.yml
name: Production CI/CD
on:
  push:
    tags: ['v*']
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        default: 'latest'
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

### 4.2 生產環境 CI 流程

#### 4.2.1 生產環境代碼檢查

```yaml
jobs:
  production-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: pnpm install

      - name: Security audit
        run: pnpm audit --audit-level=moderate

      - name: Dependency check
        run: pnpm outdated

      - name: Bundle analysis
        run: pnpm build:analyze

      - name: Performance test
        run: pnpm test:performance
```

#### 4.2.2 生產環境測試

```yaml
production-test:
  runs-on: ubuntu-latest
  needs: production-quality
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: pnpm install

    - name: Run full test suite
      run: pnpm test:all

    - name: Load testing
      run: pnpm test:load

    - name: Security testing
      run: pnpm test:security

    - name: Accessibility testing
      run: pnpm test:a11y
```

### 4.3 生產環境 CD 流程

#### 4.3.1 藍綠部署策略

```yaml
deploy-production:
  runs-on: ubuntu-latest
  needs: production-test
  environment: production
  steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: production-build-artifacts

    - name: Deploy to staging
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN_PROD }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID_PROD }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_PROD }}
        vercel-args: '--prod'

    - name: Staging validation
      run: |
        # 等待部署完成
        sleep 30
        # 運行驗證測試
        pnpm test:staging-validation

    - name: Deploy to production (Blue)
      if: success()
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN_PROD }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID_PROD }}
        command: deploy
        environment: production-blue

    - name: Production validation
      if: success()
      run: |
        # 等待部署完成
        sleep 30
        # 運行生產環境驗證
        pnpm test:production-validation

    - name: Switch traffic to Blue
      if: success()
      run: |
        # 切換流量到新版本
        curl -X POST ${{ secrets.TRAFFIC_SWITCH_URL }} \
          -H "Authorization: Bearer ${{ secrets.TRAFFIC_SWITCH_TOKEN }}" \
          -d '{"version": "blue"}'
```

#### 4.3.2 生產環境監控

```yaml
monitor-production:
  runs-on: ubuntu-latest
  needs: deploy-production
  steps:
    - name: Setup monitoring
      run: |
        # 設置監控和警報
        echo "Setting up production monitoring..."

    - name: Health check
      run: |
        # 檢查所有服務健康狀態
        curl -f ${{ secrets.PROD_FRONTEND_URL }}/api/health
        curl -f ${{ secrets.PROD_API_URL }}/health

    - name: Performance monitoring
      run: |
        # 設置性能監控
        echo "Performance monitoring active"

    - name: Notify deployment success
      if: success()
      uses: 8398a7/action-slack@v3
      with:
        status: success
        channel: '#prod-deployments'
        text: '🚀 Production deployment successful!'
```

## 5. 部署策略詳解

### 5.1 藍綠部署 (Blue-Green Deployment)

#### 5.1.1 部署流程

```bash
# 1. 部署新版本到藍色環境
wrangler deploy --env production-blue

# 2. 驗證藍色環境
curl -f https://api-blue.example.com/health

# 3. 切換流量
curl -X POST https://traffic-manager.example.com/switch \
  -H "Content-Type: application/json" \
  -d '{"version": "blue"}'

# 4. 監控新版本
curl -f https://api.example.com/metrics

# 5. 如果正常，保持藍色；如果有問題，回滾到綠色
```

#### 5.1.2 回滾機制

```bash
# 快速回滾到綠色環境
curl -X POST https://traffic-manager.example.com/switch \
  -H "Content-Type: application/json" \
  -d '{"version": "green"}'
```

### 5.2 金絲雀部署 (Canary Deployment)

#### 5.2.1 漸進式部署

```yaml
# 金絲雀部署配置
canary:
  initial_percentage: 5
  increment: 10
  interval: 5m
  max_percentage: 100
  auto_promote: false
```

#### 5.2.2 監控指標

- **錯誤率**：< 0.1%
- **響應時間**：< 800ms (平均), < 1.5s (P99)
- **成功率**：> 99.9%

## 6. 監控和警報系統

### 6.1 關鍵指標監控

#### 6.1.1 前端指標

```typescript
// 前端性能監控
interface FrontendMetrics {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
  FCP: number; // First Contentful Paint
}
```

#### 6.1.2 後端指標

```typescript
// 後端性能監控
interface BackendMetrics {
  responseTime: number; // 響應時間
  throughput: number; // 吞吐量
  errorRate: number; // 錯誤率
  cpuUsage: number; // CPU 使用率
  memoryUsage: number; // 記憶體使用率
}
```

### 6.2 警報規則

```yaml
# 警報配置
alerts:
  - name: 'High Error Rate'
    condition: 'error_rate > 0.05'
    duration: '5m'
    severity: 'critical'

  - name: 'High Response Time'
    condition: 'response_time > 1.5s'
    duration: '3m'
    severity: 'warning'

  - name: 'Service Down'
    condition: 'health_check == false'
    duration: '1m'
    severity: 'critical'
```

## 7. 安全檢查和合規

### 7.1 安全掃描

```yaml
security-scan:
  runs-on: ubuntu-latest
  steps:
    - name: Run SAST scan
      uses: github/codeql-action/analyze@v2
      with:
        languages: javascript, typescript

    - name: Run dependency scan
      run: pnpm audit --audit-level=moderate

    - name: Run container scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'ghcr.io/${{ github.repository }}:${{ github.sha }}'
        format: 'sarif'
        output: 'trivy-results.sarif'
```

### 7.2 合規檢查

```yaml
compliance-check:
  runs-on: ubuntu-latest
  steps:
    - name: License check
      run: pnpm license-check

    - name: GDPR compliance check
      run: pnpm gdpr-check

    - name: Accessibility compliance
      run: pnpm a11y-check
```

## 8. 災難恢復和備份

### 8.1 備份策略

```yaml
backup:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 點
  retention:
    days: 30
  locations:
    - cloudflare-r2
    - local-storage
```

### 8.2 恢復流程

```bash
# 災難恢復腳本
#!/bin/bash

# 1. 停止服務
systemctl stop concept-stock-screener

# 2. 恢復數據
wrangler kv:bulk restore --env production

# 3. 恢復配置
cp backup/config/* /etc/concept-stock-screener/

# 4. 重啟服務
systemctl start concept-stock-screener

# 5. 驗證恢復
curl -f http://localhost:3000/health
```

## 9. 性能優化和測試

### 9.1 性能測試

```yaml
performance-test:
  runs-on: ubuntu-latest
  steps:
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        urls: |
          ${{ secrets.FRONTEND_URL }}
        uploadArtifacts: true
        temporaryPublicStorage: true

    - name: Run k6 load test
      run: |
        k6 run scripts/load-test.js

    - name: Run WebPageTest
      run: |
        npm install -g webpagetest
        webpagetest test ${{ secrets.FRONTEND_URL }}
```

### 9.2 性能基準

```typescript
// 性能基準配置
interface PerformanceBaseline {
  frontend: {
    LCP: number; // < 2.5s
    FID: number; // < 100ms
    CLS: number; // < 0.1
  };
  backend: {
    responseTime: number; // < 800ms
    throughput: number; // > 1000 req/s
  };
}
```

## 10. 部署後驗證

### 10.1 自動化驗證

```yaml
post-deployment-verification:
  runs-on: ubuntu-latest
  needs: deploy-production
  steps:
    - name: Health check
      run: |
        # 檢查所有服務健康狀態
        for url in ${{ secrets.HEALTH_CHECK_URLS }}; do
          curl -f "$url" || exit 1
        done

    - name: Smoke tests
      run: pnpm test:smoke:production

    - name: Performance validation
      run: pnpm test:performance:production

    - name: Security validation
      run: pnpm test:security:production
```

### 10.2 用戶體驗驗證

```yaml
user-experience-validation:
  runs-on: ubuntu-latest
  needs: post-deployment-verification
  steps:
    - name: Accessibility test
      run: pnpm test:a11y:production

    - name: Cross-browser test
      run: pnpm test:cross-browser

    - name: Mobile responsiveness test
      run: pnpm test:mobile:production
```

## 11. 文檔和知識管理

### 11.1 部署文檔

```markdown
# 部署文檔模板

## 部署版本

- 版本號：v1.2.3
- 部署時間：2024-01-15 14:00 UTC
- 部署者：@username

## 變更內容

- 新增功能：概念股篩選器優化
- 修復問題：API 響應時間優化
- 安全更新：依賴包更新

## 部署結果

- 狀態：✅ 成功
- 部署時間：15 分鐘
- 用戶影響：無

## 監控指標

- 錯誤率：0.02%
- 響應時間：650ms
- 系統負載：正常
```

### 11.2 故障排除指南

```markdown
# 故障排除指南

## 常見問題

### 1. 部署失敗

**症狀**：GitHub Actions 顯示失敗
**解決方案**：

1. 檢查構建日誌
2. 驗證環境變數
3. 檢查依賴版本

### 2. 服務不可用

**症狀**：健康檢查失敗
**解決方案**：

1. 檢查服務狀態
2. 查看錯誤日誌
3. 重啟服務

### 3. 性能下降

**症狀**：響應時間增加
**解決方案**：

1. 檢查系統資源
2. 分析性能指標
3. 優化數據庫查詢
```

## 12. 成功標準和 KPI

### 12.1 部署成功率

- **目標**：≥ 99.5%
- **測量**：每月部署成功次數 / 總部署次數
- **監控**：GitHub Actions 狀態

### 12.2 部署時間

- **開發環境**：≤ 10 分鐘
- **生產環境**：≤ 30 分鐘
- **測量**：從代碼提交到部署完成的時間

### 12.3 系統可用性

- **目標**：≥ 99.9%
- **測量**：系統運行時間 / 總時間
- **監控**：健康檢查端點

### 12.4 錯誤率

- **目標**：≤ 0.1%
- **測量**：錯誤請求數 / 總請求數
- **監控**：應用程序日誌

## 13. 後續步驟

### 13.1 立即執行

1. 設置 GitHub Actions 工作流程
2. 配置環境變數和密鑰
3. 建立監控和警報系統

### 13.2 短期目標 (1-2 週)

1. 完成開發環境 CI/CD
2. 建立基礎監控
3. 開始生產環境準備

### 13.3 中期目標 (3-4 週)

1. 完成生產環境 CI/CD
2. 實現藍綠部署
3. 建立完整的監控系統

### 13.4 長期目標 (6-8 週)

1. 優化部署流程
2. 實現自動化回滾
3. 建立災難恢復計劃
