const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// 啟用CORS
app.use(cors());

// 記錄所有請求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 提供靜態檔案
const ragPath = path.join(__dirname, 'public', 'rag');
console.log('RAG 檔案路徑:', ragPath);
console.log('RAG 目錄是否存在:', fs.existsSync(ragPath));

app.use('/rag', express.static(ragPath));

// 列出 RAG 目錄內容的路由
app.get('/rag', (req, res) => {
  try {
    const files = fs.readdirSync(ragPath);
    res.json({
      status: 'ok',
      message: 'RAG 檔案列表',
      files: files,
      path: ragPath
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: '無法讀取 RAG 目錄',
      error: error.message
    });
  }
});

// 健康檢查
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'RAG File Server',
    ragPath: ragPath,
    ragExists: fs.existsSync(ragPath)
  });
});

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: '找不到路徑',
    path: req.url,
    availablePaths: ['/', '/rag', '/rag/*']
  });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 RAG檔案服務器運行在 http://localhost:${PORT}`);
  console.log(`📁 提供檔案: http://localhost:${PORT}/rag/`);
  console.log(`📂 RAG 目錄: ${ragPath}`);
});

module.exports = app;
