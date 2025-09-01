# 環境切換腳本
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod")]
    [string]$Environment
)

Write-Host "🔄 切換到 $Environment 環境..." -ForegroundColor Yellow

if ($Environment -eq "dev") {
    Write-Host "📝 設定開發環境..." -ForegroundColor Green
    Write-Host "   - 使用模擬資料" -ForegroundColor Cyan
    Write-Host "   - 避免消耗 API 配額" -ForegroundColor Cyan
    
    # 備份原始 .env
    if (Test-Path ".env") {
        Copy-Item ".env" ".env.backup"
        Write-Host "   - 已備份原始 .env 為 .env.backup" -ForegroundColor Cyan
    }
    
    # 建立開發環境 .env
    $devEnv = @"
# 開發環境設定
NODE_ENV=development
LOG_LEVEL=debug

# 開發環境 API 配置
API_BASE_URL_DEV=http://localhost:8787
RAG_MANIFEST_URL_DEV=http://localhost:8787/rag/manifest.json
RAG_DOCS_URL_DEV=http://localhost:3000/rag/docs.jsonl

# 功能開關 (開發環境)
ENABLE_RAG=true
ENABLE_VECTOR_SEARCH=true
ENABLE_CACHE=false

# CORS Origins (開發環境)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# 開發環境使用模擬資料 (不設定 API Keys)
# GEMINI_API_KEY=
# PINECONE_API_KEY=
"@
    
    $devEnv | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ 已切換到開發環境" -ForegroundColor Green
}

if ($Environment -eq "prod") {
    Write-Host "🚀 設定正式環境..." -ForegroundColor Green
    Write-Host "   - 使用真實 API Keys" -ForegroundColor Cyan
    Write-Host "   - 啟用所有功能" -ForegroundColor Cyan
    
    # 恢復原始 .env
    if (Test-Path ".env.backup") {
        Copy-Item ".env.backup" ".env"
        Write-Host "   - 已恢復原始 .env" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  找不到 .env.backup，請手動設定 API Keys" -ForegroundColor Yellow
    }
    
    Write-Host "✅ 已切換到正式環境" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 使用方式：" -ForegroundColor Yellow
Write-Host "   ./scripts/switch-env.ps1 dev   # 切換到開發環境" -ForegroundColor Cyan
Write-Host "   ./scripts/switch-env.ps1 prod  # 切換到正式環境" -ForegroundColor Cyan
