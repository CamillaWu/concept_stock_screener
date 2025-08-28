#!/bin/bash

# API 測試腳本

API_BASE="http://localhost:8787"

echo "🧪 測試概念股自動化篩選系統 API..."
echo ""

# 測試健康檢查
echo "1. 測試健康檢查..."
curl -s "${API_BASE}/health" | jq '.' 2>/dev/null || echo "健康檢查失敗"

echo ""
echo "2. 測試熱門概念 API..."
curl -s "${API_BASE}/trending" | jq '.' 2>/dev/null || echo "熱門概念 API 失敗"

echo ""
echo "3. 測試主題搜尋 API..."
curl -s "${API_BASE}/search?mode=theme&q=AI" | jq '.' 2>/dev/null || echo "主題搜尋 API 失敗"

echo ""
echo "4. 測試股票搜尋 API..."
curl -s "${API_BASE}/search?mode=stock&q=2330" | jq '.' 2>/dev/null || echo "股票搜尋 API 失敗"

echo ""
echo "✅ API 測試完成！"
