# 部署指南完整文檔

> See `docs/deployment/CI_CD_NOTES.md` for GitHub Actions configuration.

## 1. 部署概述

### 1.1 部署架構

```
開發環境 (Development)
    ↓
測試環境 (Staging)
    ↓
生產環境 (Production)
```

### 1.2 部署策略

- **藍綠部署**：生產環境使用藍綠部署策略
- **金絲雀部署**：漸進式流量切換
- **自動化部署**：CI/CD 流程自動化
- **快速回滾**：問題發生時快速恢復

## 2. 環境配置

### 2.1 開發環境配置

```bash
# 環境變數配置
NODE_ENV=development
GEMINI_API_KEY=your_dev_gemini_key
PINECONE_API_KEY=your_dev_pinecone_key
PINECONE_ENVIRONMENT=us-west1-gcp
REDIS_URL=redis://localhost:6379
VERCEL_TOKEN=your_dev_vercel_token
CLOUDFLARE_API_TOKEN=your_dev_cloudflare_token
```

### 2.2 測試環境配置

```bash
# 環境變數配置
NODE_ENV=staging
GEMINI_API_KEY=your_staging_gemini_key
PINECONE_API_KEY=your_staging_pinecone_key
PINECONE_ENVIRONMENT=us-west1-gcp
REDIS_URL=redis://staging-redis.example.com:6379
VERCEL_TOKEN=your_staging_vercel_token
CLOUDFLARE_API_TOKEN=your_staging_cloudflare_token
```

### 2.3 生產環境配置

```bash
# 環境變數配置
NODE_ENV=production
GEMINI_API_KEY=your_prod_gemini_key
PINECONE_API_KEY=your_prod_pinecone_key
PINECONE_ENVIRONMENT=us-west1-gcp
REDIS_URL=redis://prod-redis.example.com:6379
VERCEL_TOKEN=your_prod_vercel_token
CLOUDFLARE_API_TOKEN=your_prod_cloudflare_token
```

## 3. 部署流程

### 3.1 開發環境部署

```bash
# 1. 構建應用
pnpm build

# 2. 部署前端到 Vercel
vercel --prod --token $VERCEL_TOKEN

# 3. 部署 API 到 Cloudflare
wrangler deploy --env development

# 4. 部署數據管道
cd apps/data-pipeline
python deploy.py --env development
```

### 3.2 測試環境部署

```bash
# 1. 構建應用
pnpm build:staging

# 2. 部署到測試環境
vercel --prod --token $VERCEL_TOKEN_STAGING
wrangler deploy --env staging
```

### 3.3 生產環境部署

```bash
# 1. 構建生產版本
pnpm build:production

# 2. 部署到生產環境
vercel --prod --token $VERCEL_TOKEN_PROD
wrangler deploy --env production

# 3. 驗證部署
pnpm test:production-validation
```

## 4. 部署腳本

### 4.1 自動化部署腳本

```bash
#!/bin/bash
# deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "Usage: ./deploy.sh <environment> <version>"
    echo "Example: ./deploy.sh production v1.2.3"
    exit 1
fi

echo "🚀 Starting deployment to $ENVIRONMENT (version: $VERSION)"

# 檢查環境變數
check_environment_variables() {
    local env=$1
    case $env in
        "development")
            required_vars=("DEV_GEMINI_API_KEY" "DEV_PINECONE_API_KEY")
            ;;
        "staging")
            required_vars=("STAGING_GEMINI_API_KEY" "STAGING_PINECONE_API_KEY")
            ;;
        "production")
            required_vars=("PROD_GEMINI_API_KEY" "PROD_PINECONE_API_KEY")
            ;;
        *)
            echo "❌ Unknown environment: $env"
            exit 1
            ;;
    esac

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Missing environment variable: $var"
            exit 1
        fi
    done
}

# 構建應用
build_application() {
    echo "🔨 Building application..."
    pnpm install
    pnpm build:$ENVIRONMENT

    if [ $? -eq 0 ]; then
        echo "✅ Build completed successfully"
    else
        echo "❌ Build failed"
        exit 1
    fi
}

# 部署前端
deploy_frontend() {
    echo "🌐 Deploying frontend..."
    case $ENVIRONMENT in
        "development")
            vercel --prod --token $DEV_VERCEL_TOKEN
            ;;
        "staging")
            vercel --prod --token $STAGING_VERCEL_TOKEN
            ;;
        "production")
            vercel --prod --token $PROD_VERCEL_TOKEN
            ;;
    esac
}

# 部署 API
deploy_api() {
    echo "🔌 Deploying API..."
    case $ENVIRONMENT in
        "development")
            wrangler deploy --env development
            ;;
        "staging")
            wrangler deploy --env staging
            ;;
        "production")
            wrangler deploy --env production
            ;;
    esac
}

# 部署數據管道
deploy_data_pipeline() {
    echo "📊 Deploying data pipeline..."
    cd apps/data-pipeline

    case $ENVIRONMENT in
        "development")
            python deploy.py --env development
            ;;
        "staging")
            python deploy.py --env staging
            ;;
        "production")
            python deploy.py --env production
            ;;
    esac

    cd ../..
}

# 驗證部署
validate_deployment() {
    echo "✅ Validating deployment..."

    # 等待服務啟動
    sleep 30

    # 健康檢查
    case $ENVIRONMENT in
        "development")
            curl -f $DEV_FRONTEND_URL/api/health
            curl -f $DEV_API_URL/health
            ;;
        "staging")
            curl -f $STAGING_FRONTEND_URL/api/health
            curl -f $STAGING_API_URL/health
            ;;
        "production")
            curl -f $PROD_FRONTEND_URL/api/health
            curl -f $PROD_API_URL/health
            ;;
    esac

    echo "✅ Health checks passed"
}

# 主部署流程
main() {
    echo "🚀 Starting deployment process..."

    check_environment_variables $ENVIRONMENT
    build_application
    deploy_frontend
    deploy_api
    deploy_data_pipeline
    validate_deployment

    echo "🎉 Deployment to $ENVIRONMENT completed successfully!"
    echo "📅 Deployment time: $(date)"
    echo "🏷️  Version: $VERSION"
}

main
```

### 4.2 回滾腳本

```bash
#!/bin/bash
# rollback.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
    echo "Usage: ./rollback.sh <environment> <version>"
    echo "Example: ./rollback.sh production v1.2.2"
    exit 1
fi

echo "🔄 Starting rollback to $VERSION on $ENVIRONMENT"

rollback_frontend() {
    echo "🌐 Rolling back frontend..."
    case $ENVIRONMENT in
        "production")
            vercel rollback $VERSION --token $PROD_VERCEL_TOKEN
            ;;
        *)
            echo "⚠️  Rollback not supported for $ENVIRONMENT"
            ;;
    esac
}

rollback_api() {
    echo "🔌 Rolling back API..."
    case $ENVIRONMENT in
        "production")
            wrangler rollback --env production --version $VERSION
            ;;
        *)
            echo "⚠️  Rollback not supported for $ENVIRONMENT"
            ;;
    esac
}

rollback_data_pipeline() {
    echo "📊 Rolling back data pipeline..."
    case $ENVIRONMENT in
        "production")
            cd apps/data-pipeline
            python rollback.py --env production --version $VERSION
            cd ../..
            ;;
        *)
            echo "⚠️  Rollback not supported for $ENVIRONMENT"
            ;;
    esac
}

main() {
    echo "🔄 Starting rollback process..."

    rollback_frontend
    rollback_api
    rollback_data_pipeline

    echo "✅ Rollback to $VERSION completed successfully!"
    echo "📅 Rollback time: $(date)"
}

main
```

## 5. 監控和維護

### 5.1 健康檢查端點

```typescript
// 健康檢查實現
app.get('/health', async (req, res) => {
  try {
    // 檢查數據庫連接
    const dbStatus = await checkDatabaseConnection();

    // 檢查外部服務
    const geminiStatus = await checkGeminiService();
    const pineconeStatus = await checkPineconeService();

    // 檢查系統資源
    const systemStatus = await checkSystemResources();

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || 'unknown',
      services: {
        database: dbStatus,
        gemini: geminiStatus,
        pinecone: pineconeStatus,
        system: systemStatus,
      },
      uptime: process.uptime(),
    };

    const isHealthy = Object.values(healthStatus.services).every(
      service => service.status === 'healthy'
    );

    if (isHealthy) {
      res.status(200).json(healthStatus);
    } else {
      res.status(503).json({
        ...healthStatus,
        status: 'unhealthy',
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// 詳細健康檢查
app.get('/health/detailed', async (req, res) => {
  const detailedHealth = await getDetailedHealthStatus();
  res.json(detailedHealth);
});
```

### 5.2 性能監控

```typescript
// 性能監控中間件
import { performance } from 'perf_hooks';

export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = performance.now();

  // 監聽響應完成
  res.on('finish', () => {
    const duration = performance.now() - start;

    // 記錄性能指標
    recordPerformanceMetric({
      path: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    // 檢查性能閾值
    if (duration > 1000) {
      // 超過1秒
      console.warn(
        `Slow request: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`
      );
    }
  });

  next();
};

// 性能指標記錄
interface PerformanceMetric {
  path: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

const recordPerformanceMetric = (metric: PerformanceMetric) => {
  // 存儲到監控系統
  // 這裡可以集成 Prometheus、DataDog 等監控工具
  console.log('Performance metric:', metric);
};
```

### 5.3 日誌管理

```typescript
// 日誌配置
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'concept-stock-screener' },
  transports: [
    // 錯誤日誌
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // 所有日誌
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// 生產環境添加控制台輸出
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
```

## 6. 安全配置

### 6.1 安全頭部配置

```typescript
// 安全中間件
import helmet from 'helmet';

// 配置安全頭部
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://api.gemini.com',
          'https://api.pinecone.io',
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// CORS 配置
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

### 6.2 環境變數安全

```bash
# .env.example (不要包含實際密鑰)
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
REDIS_URL=redis://localhost:6379
VERCEL_TOKEN=your_vercel_token_here
CLOUDFLARE_API_TOKEN=your_cloudflare_token_here

# 安全配置
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
ENCRYPTION_KEY=your_encryption_key_here

# 限制配置
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
```

## 7. 備份和恢復

### 7.1 數據備份策略

```bash
#!/bin/bash
# backup.sh

set -e

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

echo "🔄 Starting backup process..."

# 備份向量數據庫
echo "📊 Backing up vector database..."
wrangler kv:bulk export --env production > $BACKUP_DIR/vectors.json

# 備份 Redis 數據
echo "🔴 Backing up Redis data..."
redis-cli --rdb $BACKUP_DIR/redis.rdb

# 備份配置文件
echo "⚙️  Backing up configuration files..."
cp -r config/ $BACKUP_DIR/
cp .env.production $BACKUP_DIR/

# 備份日誌文件
echo "📝 Backing up log files..."
cp -r logs/ $BACKUP_DIR/

# 壓縮備份
echo "🗜️  Compressing backup..."
tar -czf $BACKUP_DIR.tar.gz -C $BACKUP_DIR .

# 清理臨時文件
rm -rf $BACKUP_DIR

echo "✅ Backup completed: $BACKUP_DIR.tar.gz"

# 上傳到雲存儲
echo "☁️  Uploading to cloud storage..."
aws s3 cp $BACKUP_DIR.tar.gz s3://backup-bucket/concept-stock-screener/

echo "🎉 Backup process completed successfully!"
```

### 7.2 災難恢復流程

```bash
#!/bin/bash
# disaster-recovery.sh

set -e

BACKUP_FILE=$1
ENVIRONMENT=$2

if [ -z "$BACKUP_FILE" ] || [ -z "$ENVIRONMENT" ]; then
    echo "Usage: ./disaster-recovery.sh <backup_file> <environment>"
    echo "Example: ./disaster-recovery.sh backup-20240115.tar.gz production"
    exit 1
fi

echo "🚨 Starting disaster recovery process..."
echo "📦 Backup file: $BACKUP_FILE"
echo "🌍 Environment: $ENVIRONMENT"

# 停止服務
stop_services() {
    echo "🛑 Stopping services..."
    # 實現停止服務的邏輯
    echo "✅ Services stopped"
}

# 恢復數據
restore_data() {
    echo "🔄 Restoring data from backup..."

    # 解壓備份文件
    tar -xzf $BACKUP_FILE

    # 恢復向量數據庫
    echo "📊 Restoring vector database..."
    wrangler kv:bulk import --env $ENVIRONMENT vectors.json

    # 恢復 Redis 數據
    echo "🔴 Restoring Redis data..."
    redis-cli --rdb redis.rdb

    # 恢復配置文件
    echo "⚙️  Restoring configuration files..."
    cp -r config/* ./
    cp .env.$ENVIRONMENT .env

    echo "✅ Data restoration completed"
}

# 啟動服務
start_services() {
    echo "🚀 Starting services..."
    # 實現啟動服務的邏輯
    echo "✅ Services started"
}

# 驗證恢復
verify_recovery() {
    echo "✅ Verifying recovery..."

    # 等待服務啟動
    sleep 30

    # 健康檢查
    curl -f http://localhost:3000/health

    echo "✅ Recovery verification completed"
}

# 主恢復流程
main() {
    echo "🚨 Starting disaster recovery..."

    stop_services
    restore_data
    start_services
    verify_recovery

    echo "🎉 Disaster recovery completed successfully!"
    echo "📅 Recovery time: $(date)"
}

main
```

## 8. 部署檢查清單

### 8.1 部署前檢查

- [ ] 代碼審查完成
- [ ] 測試通過
- [ ] 環境變數配置正確
- [ ] 依賴包版本確認
- [ ] 數據庫遷移腳本準備
- [ ] 回滾計劃準備

### 8.2 部署中檢查

- [ ] 構建成功
- [ ] 部署到目標環境
- [ ] 健康檢查通過
- [ ] 功能測試通過
- [ ] 性能測試通過

### 8.3 部署後檢查

- [ ] 監控指標正常
- [ ] 錯誤日誌檢查
- [ ] 用戶反饋收集
- [ ] 性能基準比較
- [ ] 文檔更新

## 9. 常見問題和故障排除

### 9.1 部署失敗問題

```bash
# 檢查部署日誌
vercel logs --token $VERCEL_TOKEN
wrangler tail --env production

# 檢查環境變數
echo $GEMINI_API_KEY
echo $PINECONE_API_KEY

# 檢查服務狀態
curl -f $FRONTEND_URL/api/health
curl -f $API_URL/health
```

### 9.2 性能問題

```bash
# 檢查系統資源
htop
df -h
free -h

# 檢查網絡延遲
ping api.gemini.com
ping api.pinecone.io

# 檢查數據庫性能
redis-cli info memory
redis-cli info stats
```

### 9.3 安全問題

```bash
# 檢查安全掃描
npm audit
npm audit fix

# 檢查依賴漏洞
snyk test

# 檢查 SSL 證書
openssl s_client -connect your-domain.com:443
```

## 10. 成功標準和 KPI

### 10.1 部署成功率

- **目標**：≥ 99.5%
- **測量**：成功部署次數 / 總部署次數

### 10.2 部署時間

- **開發環境**：≤ 5 分鐘
- **測試環境**：≤ 10 分鐘
- **生產環境**：≤ 20 分鐘

### 10.3 系統可用性

- **目標**：≥ 99.9%
- **測量**：系統運行時間 / 總時間

### 10.4 恢復時間

- **目標**：≤ 15 分鐘
- **測量**：從故障到恢復的時間

## 11. 後續步驟

### 11.1 立即執行

1. 配置環境變數
2. 設置監控系統
3. 建立備份流程

### 11.2 短期目標 (1-2 週)

1. 完成自動化部署
2. 建立監控儀表板
3. 實現自動化備份

### 11.3 中期目標 (3-4 週)

1. 優化部署流程
2. 實現藍綠部署
3. 建立災難恢復計劃

### 11.4 長期目標 (6-8 週)

1. 實現零停機部署
2. 建立完整的監控生態
3. 自動化故障恢復
