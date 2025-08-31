# 測試工具說明

本目錄包含用於測試概念股篩選系統的各種測試腳本。

## 測試腳本列表

### 1. 綜合測試腳本
```bash
node scripts/test-all.js
```
- **功能**: 運行所有測試並提供詳細報告
- **包含**: 環境配置檢查、開發環境測試、生產環境測試、RAG 檔案測試
- **建議**: 在部署前或問題排查時使用

### 2. 環境配置檢查
```bash
node scripts/test-env-config.js
```
- **功能**: 檢查所有必要的環境變數和配置文件
- **檢查項目**:
  - 根目錄 package.json
  - Web App package.json
  - API package.json
  - Next.js 配置
  - TypeScript 配置 (Web/API)
  - Tailwind 配置
  - Wrangler 配置
  - RAG 文件 (可選)

### 3. 開發環境測試
```bash
node scripts/test-dev-environment.js
```
- **功能**: 測試本地開發環境的 API 和前端服務
- **測試項目**:
  - API Root (localhost:8787)
  - Trending API
  - RAG Manifest API
  - Frontend RAG Manifest (localhost:3000)
  - Frontend RAG Docs

### 4. 生產環境 API 測試
```bash
node scripts/test-production-api.js
```
- **功能**: 測試生產環境的 API 連接
- **測試項目**:
  - API Root Endpoint
  - Trending API
  - RAG Manifest API

### 5. RAG 檔案載入測試
```bash
node scripts/test-rag-loading.js
```
- **功能**: 測試 RAG 檔案的載入和解析
- **測試環境**:
  - 生產環境 API
  - 生產環境前端
  - 本地環境
- **測試項目**:
  - RAG Manifest 檔案載入和驗證
  - RAG 文件檔案載入和驗證

## 使用建議

### 開發階段
1. 啟動本地服務後，運行開發環境測試
2. 修改配置後，運行環境配置檢查
3. 部署前，運行綜合測試

### 問題排查
1. 先運行環境配置檢查，確保基礎配置正確
2. 根據問題類型選擇對應的測試腳本
3. 查看測試報告中的詳細錯誤信息

### 部署驗證
1. 部署完成後，運行生產環境 API 測試
2. 檢查 RAG 檔案載入測試結果
3. 如有問題，對比本地和生產環境的差異

## 測試結果解讀

### 成功指標
- ✅ PASS: 測試通過
- 🎉 所有測試都通過了！系統運行正常

### 失敗指標
- ❌ FAIL: 測試失敗
- ⚠️ 警告: 非關鍵問題，但需要注意
- ⏰ 超時: 網絡或服務響應問題

### 常見問題
1. **開發環境測試失敗**: 確保本地服務正在運行
2. **生產環境測試失敗**: 檢查部署狀態和網絡連接
3. **RAG 測試失敗**: 檢查 RAG 檔案配置和路徑

## 腳本權限

所有測試腳本都已設置為可執行：
```bash
chmod +x scripts/*.js
```

## 依賴要求

- Node.js 14+
- 本地開發服務 (API: 8787, Web: 3000)
- 網絡連接 (用於生產環境測試)

## 注意事項

1. 測試腳本會自動處理超時和錯誤
2. 生產環境測試需要網絡連接
3. 本地測試需要先啟動開發服務
4. RAG 檔案測試會驗證文件格式和內容
