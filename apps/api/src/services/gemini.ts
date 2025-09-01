import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StockConcept, StockAnalysisResult } from '@concepts-radar/types';

let genAI: GoogleGenerativeAI | null = null;

// 延遲初始化 Gemini
function initializeGemini(env?: any) {
  if (genAI) return genAI;
  
  const GEMINI_API_KEY = env?.GEMINI_API_KEY || (globalThis as any).GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY 未設定，將使用模擬資料');
    return null;
  }
  
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('Gemini service initialized successfully');
    return genAI;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    return null;
  }
}

// 模擬資料（當 Gemini API 不可用時使用）
const mockTrendingThemes: StockConcept[] = [
  {
    id: '1',
    theme: 'AI 伺服器',
    name: 'AI 伺服器',
    description: 'AI 伺服器相關概念股，包括伺服器製造、晶片供應商等',
    heatScore: 85,
    stocks: [
      { ticker: '2330', symbol: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
      { ticker: '2317', symbol: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
    ]
  },
  {
    id: '2',
    theme: '電動車',
    name: '電動車',
    description: '電動車產業鏈，包括電池、馬達、充電樁等相關概念',
    heatScore: 78,
    stocks: [
      { ticker: '2330', symbol: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
      { ticker: '2317', symbol: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
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
  async fetchTrendingThemes(sortBy: 'popular' | 'latest' = 'popular', env?: any): Promise<StockConcept[]> {
    const ai = initializeGemini(env);
    if (!ai) {
      console.log('使用模擬趨勢主題資料');
      return mockTrendingThemes;
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
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
        name: prompt,
        description: `關於 ${prompt} 的投資主題分析`,
        heatScore: Math.floor(Math.random() * 100),
        stocks: [
          { ticker: '2330', symbol: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
          { ticker: '2317', symbol: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
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
        name: prompt,
        description: `關於 ${prompt} 的投資主題分析`,
        heatScore: Math.floor(Math.random() * 100),
        stocks: [
          { ticker: '2330', symbol: '2330', name: '台積電', exchange: 'TWSE' as const, reason: '相關產業龍頭' },
          { ticker: '2317', symbol: '2317', name: '鴻海', exchange: 'TWSE' as const, reason: '供應鏈重要廠商' }
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
          { theme: 'AI 伺服器', name: 'AI 伺服器', description: '主要供應商', heatScore: 85, relevanceScore: 85 },
          { theme: '半導體', name: '半導體', description: '產業龍頭', heatScore: 78, relevanceScore: 78 },
          { theme: '5G 通訊', name: '5G 通訊', description: '技術領先', heatScore: 72, relevanceScore: 72 },
          { theme: '電動車', name: '電動車', description: '新興市場', heatScore: 65, relevanceScore: 65 },
          { theme: '物聯網', name: '物聯網', description: '應用廣泛', heatScore: 58, relevanceScore: 58 }
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
          { theme: 'AI 伺服器', name: 'AI 伺服器', description: '主要供應商', heatScore: 85, relevanceScore: 85 },
          { theme: '半導體', name: '半導體', description: '產業龍頭', heatScore: 78, relevanceScore: 78 },
          { theme: '5G 通訊', name: '5G 通訊', description: '技術領先', heatScore: 72, relevanceScore: 72 },
          { theme: '電動車', name: '電動車', description: '新興市場', heatScore: 65, relevanceScore: 65 },
          { theme: '物聯網', name: '物聯網', description: '應用廣泛', heatScore: 58, relevanceScore: 58 }
        ]
      };
    }
  },

  // 新增：概念強度分析
  async analyzeConceptStrength(theme: string): Promise<{
    strengthScore: number;
    dimensions: {
      marketCapRatio: number;
      priceContribution: number;
      discussionLevel: number;
    };
  }> {
    if (!genAI) {
      console.log('使用模擬概念強度分析資料');
      return {
        strengthScore: 85,
        dimensions: {
          marketCapRatio: 75,
          priceContribution: 60,
          discussionLevel: 85
        }
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請分析投資主題「${theme}」的概念強度，基於以下三個維度進行評估：

1. 市值佔比：該主題相關股票在整體市場的市值佔比
2. 漲幅貢獻：該主題股票對市場漲幅的貢獻度
3. 討論熱度：新聞和社群對該主題的討論程度

請以 JSON 格式回傳：
{
  "strengthScore": 0-100的綜合強度分數,
  "dimensions": {
    "marketCapRatio": 0-100的市值佔比分數,
    "priceContribution": 0-100的漲幅貢獻分數,
    "discussionLevel": 0-100的討論熱度分數
  }
}`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return {
        strengthScore: 85,
        dimensions: {
          marketCapRatio: 75,
          priceContribution: 60,
          discussionLevel: 85
        }
      };
    }
  },

  // 新增：情緒分析
  async analyzeSentiment(theme: string): Promise<{
    score: number;
    trend: 'up' | 'down' | 'stable';
    sources: {
      news: number;
      social: number;
    };
    recentTrend: number[];
  }> {
    if (!genAI) {
      console.log('使用模擬情緒分析資料');
      return {
        score: 0.7,
        trend: 'up',
        sources: {
          news: 65,
          social: 35
        },
        recentTrend: [0.3, 0.5, 0.4, 0.6, 0.7, 0.8, 0.7]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請分析投資主題「${theme}」的市場情緒，基於新聞和社群討論進行評估。

請以 JSON 格式回傳：
{
  "score": -1.0到+1.0的情緒分數（負值為悲觀，正值為樂觀）,
  "trend": "up"或"down"或"stable"的趨勢方向,
  "sources": {
    "news": 0-100的新聞來源佔比,
    "social": 0-100的社群來源佔比
  },
  "recentTrend": [最近7天的情緒分數陣列]
}`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return {
        score: 0.7,
        trend: 'up',
        sources: {
          news: 65,
          social: 35
        },
        recentTrend: [0.3, 0.5, 0.4, 0.6, 0.7, 0.8, 0.7]
      };
    }
  },

  // 新增：個股歸因分析
  async analyzeStockAttribution(stockId: string, theme: string): Promise<{
    sources: Array<{
      type: 'news' | 'report' | 'announcement' | 'ai';
      title: string;
      url?: string;
      timestamp: string;
      summary: string;
    }>;
  }> {
    if (!genAI) {
      console.log('使用模擬個股歸因分析資料');
      return {
        sources: [
          {
            type: 'news',
            title: `${stockId} ${theme} 相關新聞`,
            url: 'https://example.com/news/1',
            timestamp: '2024-01-15',
            summary: '該公司為相關產業重要供應商'
          },
          {
            type: 'report',
            title: '2024年第一季財報摘要',
            url: 'https://example.com/report/1',
            timestamp: '2024-01-10',
            summary: '財報顯示相關業務營收佔比提升'
          },
          {
            type: 'ai',
            title: 'AI 分析結果',
            timestamp: '2024-01-15',
            summary: '基於市場數據分析，該股在相關概念中具有重要地位'
          }
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請分析股票「${stockId}」在「${theme}」主題中的歸因，找出支持其入選的具體依據。

請以 JSON 格式回傳：
{
  "sources": [
    {
      "type": "news"或"report"或"announcement"或"ai",
      "title": "來源標題",
      "url": "來源連結（可選）",
      "timestamp": "時間戳",
      "summary": "簡短摘要說明"
    }
  ]
}

注意：
- 提供具體的新聞、財報或公告依據
- 說明該股票與主題的具體關聯性
- 包含時間戳和來源資訊`;

      const result = await model.generateContent(aiPrompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      return {
        sources: [
          {
            type: 'news',
            title: `${stockId} ${theme} 相關新聞`,
            url: 'https://example.com/news/1',
            timestamp: '2024-01-15',
            summary: '該公司為相關產業重要供應商'
          },
          {
            type: 'report',
            title: '2024年第一季財報摘要',
            url: 'https://example.com/report/1',
            timestamp: '2024-01-10',
            summary: '財報顯示相關業務營收佔比提升'
          },
          {
            type: 'ai',
            title: 'AI 分析結果',
            timestamp: '2024-01-15',
            summary: '基於市場數據分析，該股在相關概念中具有重要地位'
          }
        ]
      };
    }
  }
};
