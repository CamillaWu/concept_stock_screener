# RAG 工具集

這個目錄包含概念股篩選系統的 RAG (Retrieval-Augmented Generation) 相關工具。

## 工具說明

### `test-rag.js`
- **功能**：測試 RAG 檔案是否存在和 API 服務器是否正常運行
- **用法**：`node test-rag.js`

### `check-rag-files.js`
- **功能**：檢查 RAG 檔案內容和 API 端點
- **用法**：`node check-rag-files.js`

### `local-rag-server.js`
- **功能**：本地 RAG 檔案服務器，提供靜態檔案服務
- **用法**：`node local-rag-server.js`
- **端口**：3001

## 相關工具

- `../rag-manager.js` - RAG 部署管理工具
- `../process-rag.js` - RAG 檔案處理工具

## 注意事項

這些工具僅用於開發和測試，不影響核心功能。
