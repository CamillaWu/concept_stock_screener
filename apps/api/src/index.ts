import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

// Google Gemini API 配置
const GEMINI_API_KEY = (globalThis as any).GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Gemini API 呼叫函數
async function callGeminiAPI(prompt: string) {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY 未設定，使用模擬資料');
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json() as any;
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error('Gemini API 呼叫失敗:', error);
    return null;
  }
}

// 讀取 mock 資料的函數
async function load(filename: string) {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/your-repo/concept_stock_screener/main/mock/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    // 如果無法讀取外部檔案，返回預設資料
    console.warn(`Failed to load ${filename}, using fallback data`);
    return getFallbackData(filename);
  }
}

// 預設資料
function getFallbackData(filename: string) {
  if (filename === 'trending.json') {
    return [
      {
        theme: 'AI 伺服器',
        description: '人工智慧伺服器相關概念股',
        heatScore: 85,
        stocks: [
          { ticker: '2330', name: '台積電', reason: 'AI 晶片主要代工廠' },
          { ticker: '2317', name: '鴻海', reason: 'AI 伺服器組裝大廠' }
        ]
      },
      {
        theme: '光通訊',
        description: '高速傳輸與資料中心光模組',
        heatScore: 81,
        stocks: [
          { ticker: '4977', name: '眾達', reason: '光通訊模組供應商' },
          { ticker: '4979', name: '華星光', reason: '光纖通訊設備' }
        ]
      },
      {
        theme: '電動車',
        description: '電動車與充電樁相關概念股',
        heatScore: 78,
        stocks: [
          { ticker: '2207', name: '和泰車', reason: '電動車銷售龍頭' },
          { ticker: '3661', name: '世芯', reason: '車用晶片設計' }
        ]
      },
      {
        theme: '5G 通訊',
        description: '5G 網路建設與設備供應商',
        heatScore: 72,
        stocks: [
          { ticker: '2412', name: '中華電', reason: '5G 網路營運商' },
          { ticker: '2317', name: '鴻海', reason: '5G 設備製造' }
        ]
      },
      {
        theme: '物聯網',
        description: '物聯網設備與平台服務',
        heatScore: 68,
        stocks: [
          { ticker: '2454', name: '聯發科', reason: '物聯網晶片' },
          { ticker: '2308', name: '台達電', reason: '智慧電網設備' }
        ]
      }
    ];
  }
  return [];
}

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
    status: 'healthy',
    gemini_configured: !!GEMINI_API_KEY
  });
});

// 熱門主題 API - 符合功能流程圖 2.4 規格
app.get('/trending', async (c) => {
  try {
    // 讀取 mock 資料
    const mockData = await load('trending.json');
    return c.json(mockData);
  } catch (error) {
    return c.json({ 
      code: 'internal_error', 
      message: 'Failed to load trending data' 
    }, 500);
  }
});

// 搜尋 API - 符合功能流程圖 2.4 規格
app.get('/search', async (c) => {
  const mode = c.req.query('mode');
  const q = c.req.query('q')?.trim();
  
  // 驗證參數
  if (!['theme', 'stock'].includes(mode || '')) {
    return c.json({ 
      code: 'invalid_mode', 
      message: 'mode must be theme or stock' 
    }, 400);
  }
  
  if (!q) {
    return c.json({ 
      code: 'no_results', 
      message: 'q required' 
    }, 404);
  }

  try {
    // 如果有 Gemini API 金鑰，使用 AI 搜尋
    if (GEMINI_API_KEY) {
      const prompt = mode === 'theme' 
        ? `請分析投資主題「${q}」，找出相關的台灣上市股票，並說明關聯性。請以 JSON 格式回傳：{"theme": "${q}", "description": "主題描述", "heatScore": 熱度分數(0-100), "stocks": [{"ticker": "股號", "name": "公司名稱", "reason": "關聯原因"}]}`
        : `請分析股票「${q}」，找出它可能屬於的投資主題，並說明關聯性。請以 JSON 格式回傳：{"stock": {"ticker": "${q}", "name": "公司名稱"}, "themes": [{"theme": "主題名稱", "heatScore": 熱度分數(0-100), "reason": "關聯原因"}]}`;
      
      const aiResult = await callGeminiAPI(prompt);
      if (aiResult) {
        try {
          const parsed = JSON.parse(aiResult);
          return c.json(parsed as any);
        } catch (parseError) {
          console.warn('AI 回傳格式錯誤，使用模擬資料');
        }
      }
    }

    // 使用模擬搜尋結果
    if (mode === 'theme') {
      // 主題搜尋結果
      const mockResult = {
        theme: q,
        description: `關於 ${q} 的投資主題分析`,
        heatScore: Math.floor(Math.random() * 100),
        stocks: [
          { ticker: '2330', name: '台積電', reason: '相關產業龍頭' },
          { ticker: '2317', name: '鴻海', reason: '供應鏈重要廠商' }
        ]
      };
      return c.json(mockResult);
    } else {
      // 個股搜尋結果
      const mockResult = {
        stock: { ticker: q, name: '測試股票' },
        themes: [
          { theme: 'AI 伺服器', heatScore: 85, reason: '主要供應商' },
          { theme: '半導體', heatScore: 78, reason: '產業龍頭' },
          { theme: '5G 通訊', heatScore: 72, reason: '技術領先' },
          { theme: '電動車', heatScore: 65, reason: '新興市場' },
          { theme: '物聯網', heatScore: 58, reason: '應用廣泛' }
        ]
      };
      return c.json(mockResult);
    }
  } catch (error) {
    return c.json({ 
      code: 'internal_error', 
      message: 'Search failed' 
    }, 500);
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
