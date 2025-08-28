import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// 模擬假資料（暫時內嵌，之後會從外部檔案讀取）
const trendingData = {
  "themes": [
    {
      "id": "ai-servers",
      "theme": "AI 伺服器",
      "description": "人工智慧伺服器相關概念股，包含伺服器製造、晶片供應鏈等",
      "heatScore": 85,
      "stocks": [
        {
          "ticker": "2330",
          "name": "台積電",
          "reason": "AI 晶片主要代工廠，CoWoS 先進封裝技術領先"
        },
        {
          "ticker": "2317",
          "name": "鴻海",
          "reason": "AI 伺服器組裝大廠，客戶包含 NVIDIA、AMD 等"
        }
      ]
    }
  ],
  "lastUpdated": "2025-08-28T12:00:00Z"
};

const stockAnalysisData = {
  "stock": {
    "ticker": "2330",
    "name": "台積電"
  },
  "themes": [
    {
      "theme": "AI 伺服器",
      "description": "人工智慧伺服器相關概念股",
      "heatScore": 85
    },
    {
      "theme": "半導體設備",
      "description": "半導體製造設備與材料供應鏈",
      "heatScore": 68
    }
  ]
};

const app = new Hono();

// 中間件
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 健康檢查
app.get('/', (c) => {
  return c.json({
    message: 'Concepts Radar API',
    version: '1.0.0',
    status: 'healthy'
  });
});

// 熱門主題 API
app.get('/api/trending', (c) => {
  return c.json({
    success: true,
    data: trendingData
  });
});

// 搜尋 API (主題到個股)
app.post('/api/search/theme', async (c) => {
  try {
    const body = await c.req.json();
    const { query } = body;
    
    // 模擬 AI 搜尋結果
    const mockResult = {
      id: `theme-${Date.now()}`,
      theme: query,
      description: `關於 ${query} 的投資主題分析`,
      heatScore: Math.floor(Math.random() * 100),
      stocks: trendingData.themes[0]?.stocks || []
    };
    
    return c.json({
      success: true,
      data: mockResult
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request'
    }, 400);
  }
});

// 搜尋 API (個股到主題)
app.post('/api/search/stock', async (c) => {
  try {
    const body = await c.req.json();
    const { query } = body;
    
    // 模擬 AI 分析結果
    const mockResult = {
      stock: {
        ticker: query,
        name: '模擬股票'
      },
      themes: stockAnalysisData.themes
    };
    
    return c.json({
      success: true,
      data: mockResult
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid request'
    }, 400);
  }
});

// 錯誤處理
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    success: false,
    error: 'Internal server error'
  }, 500);
});

export default app;
