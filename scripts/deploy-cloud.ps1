# 雲端部署腳本 - PowerShell 版本

Write-Host "🚀 開始雲端部署概念股篩選系統..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# 檢查必要的環境變數
Write-Host "🔍 檢查環境變數..." -ForegroundColor Yellow

if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️  警告: GEMINI_API_KEY 未設定" -ForegroundColor Yellow
    Write-Host "請設定 GEMINI_API_KEY 環境變數" -ForegroundColor Yellow
}

if (-not $env:CLOUDFLARE_API_TOKEN) {
    Write-Host "⚠️  警告: CLOUDFLARE_API_TOKEN 未設定" -ForegroundColor Yellow
    Write-Host "請設定 CLOUDFLARE_API_TOKEN 環境變數" -ForegroundColor Yellow
}

if (-not $env:VERCEL_TOKEN) {
    Write-Host "⚠️  警告: VERCEL_TOKEN 未設定" -ForegroundColor Yellow
    Write-Host "請設定 VERCEL_TOKEN 環境變數" -ForegroundColor Yellow
}

# 安裝依賴
Write-Host ""
Write-Host "📦 安裝依賴..." -ForegroundColor Cyan
pnpm install

# 建立類型定義
Write-Host "🔧 建立類型定義..." -ForegroundColor Cyan
Set-Location packages/types
pnpm build
Set-Location ../..

# 建立 UI 組件
Write-Host "🎨 建立 UI 組件..." -ForegroundColor Cyan
Set-Location packages/ui
pnpm build
Set-Location ../..

# 部署 API 到 Cloudflare Workers
Write-Host ""
Write-Host "🌐 部署 Cloudflare Workers API..." -ForegroundColor Cyan
Set-Location apps/api

if ($env:CLOUDFLARE_API_TOKEN) {
    Write-Host "設定 Cloudflare API Token..." -ForegroundColor Green
    
    Write-Host "部署到 Cloudflare Workers..." -ForegroundColor Green
    pnpm deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cloudflare Workers 部署成功" -ForegroundColor Green
    } else {
        Write-Host "❌ Cloudflare Workers 部署失敗" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  跳過 Cloudflare Workers 部署（需要 CLOUDFLARE_API_TOKEN）" -ForegroundColor Yellow
}

Set-Location ../..

# 部署前端到 Vercel
Write-Host ""
Write-Host "🎯 部署前端應用..." -ForegroundColor Cyan
Set-Location apps/web

if ($env:VERCEL_TOKEN) {
    Write-Host "設定 Vercel Token..." -ForegroundColor Green
    
    Write-Host "建置前端應用..." -ForegroundColor Green
    pnpm build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 前端建置成功" -ForegroundColor Green
        
        Write-Host "部署到 Vercel..." -ForegroundColor Green
        npx vercel --prod --token $env:VERCEL_TOKEN
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Vercel 部署成功" -ForegroundColor Green
        } else {
            Write-Host "❌ Vercel 部署失敗" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ 前端建置失敗" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  跳過 Vercel 部署（需要 VERCEL_TOKEN）" -ForegroundColor Yellow
    Write-Host "請手動部署到 Vercel 或設定 VERCEL_TOKEN" -ForegroundColor Yellow
}

Set-Location ../..

Write-Host ""
Write-Host "✅ 雲端部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 部署結果：" -ForegroundColor Cyan
Write-Host "- Cloudflare Workers API: https://concepts-radar-api.sandy246836.workers.dev" -ForegroundColor White
Write-Host "- Vercel 前端: https://concept-stock-screener.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "🔧 下一步：" -ForegroundColor Cyan
Write-Host "1. 設定 Cloudflare Workers 環境變數（GEMINI_API_KEY 等）" -ForegroundColor White
Write-Host "2. 設定 Vercel 環境變數（NEXT_PUBLIC_API_BASE_URL）" -ForegroundColor White
Write-Host "3. 測試 API 端點" -ForegroundColor White
Write-Host "4. 驗證前端功能" -ForegroundColor White
Write-Host ""
Write-Host "🌐 測試連結：" -ForegroundColor Cyan
Write-Host "- API 健康檢查: https://concepts-radar-api.sandy246836.workers.dev" -ForegroundColor White
Write-Host "- RAG 狀態: https://concepts-radar-api.sandy246836.workers.dev/rag/status" -ForegroundColor White
Write-Host "- 前端應用: https://concept-stock-screener.vercel.app" -ForegroundColor White
