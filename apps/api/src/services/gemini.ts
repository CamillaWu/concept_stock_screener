import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StockConcept, StockAnalysisResult } from '@concepts-radar/types';

const GEMINI_API_KEY = (globalThis as any).GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY 未設定，將使用模擬資料');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// 模擬資料（當 Gemini API 不可用時使用）
const mockTrendingThemes = [
  {
    id: 'ai-servers',
    theme: 'AI 伺服器',
    description: '人工智慧伺服器相關概念股，包含伺服器製造、晶片供應鏈等',
    heatScore: 85,
    stocks: [
      { ticker: '2330', name: '台積電', exchange: 'TWSE' as const, reason: 'AI 晶片主要代工廠' },
      { ticker: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: 'AI 伺服器組裝大廠' }
    ]
  },
  {
    id: 'optical-communication',
    theme: '光通訊',
    description: '高速傳輸與資料中心光模組相關概念股',
    heatScore: 81,
    stocks: [
      { ticker: '4977', name: '眾達', exchange: 'TWSE' as const, reason: '光通訊模組供應商' },
      { ticker: '4979', name: '華星光', exchange: 'TWSE' as const, reason: '光纖通訊設備' }
    ]
  }
];

const mockStockAnalysis = {
  stock: { ticker: '2330', name: '台積電' },
  themes: [
    { theme: 'AI 伺服器', description: 'AI 晶片主要代工廠', heatScore: 85 },
    { theme: '半導體設備', description: '先進製程技術領先', heatScore: 78 },
    { theme: '5G 通訊', description: '通訊晶片供應商', heatScore: 72 }
  ]
};

export const geminiService = {
  async fetchTrendingThemes(sortBy: 'popular' | 'latest' = 'popular'): Promise<StockConcept[]> {
    if (!genAI) {
      console.log('使用模擬趨勢主題資料');
      return mockTrendingThemes;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const prompt = `請分析台灣股市當前最熱門的投資主題，${sortBy === 'popular' ? '根據市場熱度' : '根據最新發展'}列出前15個主題。

請以 JSON 格式回傳，格式如下：
[
  {
    "id": "unique-id",
    "theme": "主題名稱",
    "description": "主題簡短描述",
    "heatScore": 0-100的熱度分數,
    "stocks": [
      {
        "ticker": "股票代號",
        "name": "公司名稱", 
        "exchange": "TWSE或TPEx",
        "reason": "入選理由"
      }
    ]
  }
]

注意：
- 只包含台灣上市櫃股票
- 每個主題最多包含3檔代表性股票
- 股票代號必須正確
- 交易所必須標明 TWSE（上市）或 TPEx（上櫃）`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // 嘗試解析 JSON
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return mockTrendingThemes;
    }
  },

  async fetchStockConcepts(prompt: string): Promise<StockConcept> {
    if (!genAI) {
      console.log('使用模擬主題搜尋資料');
      return {
        id: 'mock-theme',
        theme: prompt,
        description: `關於 ${prompt} 的投資主題分析`,
        heatScore: Math.floor(Math.random() * 100),
        stocks: [
          { ticker: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
          { ticker: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請分析投資主題「${prompt}」，找出相關的台灣上市櫃股票，並說明關聯性。

請以 JSON 格式回傳：
{
  "id": "unique-id",
  "theme": "${prompt}",
  "description": "主題詳細描述",
  "heatScore": 0-100的熱度分數,
  "stocks": [
    {
      "ticker": "股票代號",
      "name": "公司名稱",
      "exchange": "TWSE或TPEx",
      "reason": "入選理由"
    }
  ]
}

注意：
- 只包含台灣上市櫃股票
- 最多包含10檔相關股票
- 股票代號必須正確
- 交易所必須標明 TWSE（上市）或 TPEx（上櫃）
- 入選理由要具體說明與主題的關聯性`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      
      // 嘗試解析 JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return {
        id: 'mock-theme',
        theme: prompt,
        description: `關於 ${prompt} 的投資主題分析`,
        heatScore: Math.floor(Math.random() * 100),
        stocks: [
          { ticker: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
          { ticker: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
        ]
      };
    }
  },

  async fetchConceptsForStock(stockIdentifier: string): Promise<StockAnalysisResult> {
    if (!genAI) {
      console.log('使用模擬個股分析資料');
      return {
        stock: { ticker: stockIdentifier, name: '測試股票' },
        themes: [
          { theme: 'AI 伺服器', description: '主要供應商', heatScore: 85 },
          { theme: '半導體', description: '產業龍頭', heatScore: 78 },
          { theme: '5G 通訊', description: '技術領先', heatScore: 72 },
          { theme: '電動車', description: '新興市場', heatScore: 65 },
          { theme: '物聯網', description: '應用廣泛', heatScore: 58 }
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請分析股票「${stockIdentifier}」，找出它可能屬於的投資主題，並說明關聯性。

請以 JSON 格式回傳：
{
  "stock": {
    "ticker": "${stockIdentifier}",
    "name": "公司名稱"
  },
  "themes": [
    {
      "theme": "主題名稱",
      "description": "該股在此主題中的角色與重要性說明",
      "heatScore": 0-100的熱度分數
    }
  ]
}

注意：
- 至少找出5個相關主題
- 每個主題都要說明該股票在其中的具體角色
- 熱度分數反映該主題的市場關注度`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      
      // 嘗試解析 JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return {
        stock: { ticker: stockIdentifier, name: '測試股票' },
        themes: [
          { theme: 'AI 伺服器', description: '主要供應商', heatScore: 85 },
          { theme: '半導體', description: '產業龍頭', heatScore: 78 },
          { theme: '5G 通訊', description: '技術領先', heatScore: 72 },
          { theme: '電動車', description: '新興市場', heatScore: 65 },
          { theme: '物聯網', description: '應用廣泛', heatScore: 58 }
        ]
      };
    }
  }
};
