import { GoogleGenerativeAI } from '@google/generative-ai';
import type { StockConcept, StockAnalysisResult } from '@concepts-radar/types';

let genAI: GoogleGenerativeAI | null = null;

// API 快取機制
class APICache {
  private static instance: APICache;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  static getInstance(): APICache {
    if (!APICache.instance) {
      APICache.instance = new APICache();
    }
    return APICache.instance;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = (Date.now() - cached.timestamp) > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

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
      
      const aiPrompt = `請分析股票「${stockIdentifier}」，找出相關的投資主題，並說明關聯性。

請以 JSON 格式回傳：
{
  "stock": {
    "ticker": "${stockIdentifier}",
    "name": "公司名稱"
  },
  "themes": [
    {
      "theme": "主題名稱",
      "name": "主題名稱",
      "description": "與該股票的關聯性描述",
      "heatScore": 0-100的熱度分數,
      "relevanceScore": 0-100的關聯性分數
    }
  ]
}

注意：
- 只包含台灣股市相關的投資主題
- 最多包含5個相關主題
- 關聯性描述要具體說明與該股票的業務關聯
- 熱度分數反映市場關注度
- 關聯性分數反映與該股票的業務相關程度`;

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

  // 🎯 新增：結合 RAG 資料的 AI 分析
  async generateAnalysisWithRAG(query: string, ragContext: string): Promise<any> {
    if (!genAI) {
      console.log('使用模擬 RAG + AI 分析資料');
      return {
        query,
        analysis: `基於 RAG 資料對「${query}」的分析`,
        insights: [
          '這是基於 RAG 資料庫的 AI 分析',
          '結合了結構化資料和 AI 生成內容',
          '提供更準確和豐富的投資建議'
        ],
        recommendations: [
          '建議關注相關概念股',
          '注意產業發展趨勢',
          '評估投資風險'
        ]
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const aiPrompt = `請基於以下 RAG 資料庫的內容，對查詢「${query}」進行深入分析：

RAG 資料庫內容：
${ragContext}

請提供：
1. 詳細的產業分析
2. 相關概念股分析
3. 投資機會和風險評估
4. 市場趨勢預測

請以 JSON 格式回傳：
{
  "query": "${query}",
  "analysis": "詳細的產業和市場分析",
  "insights": ["關鍵洞察1", "關鍵洞察2", "關鍵洞察3"],
  "recommendations": ["投資建議1", "投資建議2", "投資建議3"],
  "relatedStocks": [
    {
      "ticker": "股票代號",
      "name": "公司名稱",
      "reason": "推薦理由"
    }
  ],
  "riskFactors": ["風險因素1", "風險因素2"],
  "marketTrend": "市場趨勢分析"
}

注意：
- 分析要基於提供的 RAG 資料
- 提供具體的投資建議
- 包含風險評估
- 股票資訊要準確`;

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
      console.error('Gemini RAG Analysis API 錯誤:', error);
      return {
        query,
        analysis: `基於 RAG 資料對「${query}」的分析`,
        insights: [
          '這是基於 RAG 資料庫的 AI 分析',
          '結合了結構化資料和 AI 生成內容',
          '提供更準確和豐富的投資建議'
        ],
        recommendations: [
          '建議關注相關概念股',
          '注意產業發展趨勢',
          '評估投資風險'
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
  },

  // 快取管理方法
  clearCache(): void {
    const cache = APICache.getInstance();
    cache.clear();
    console.log('API cache cleared');
  },

  getCacheStats(): { size: number; keys: string[] } {
    const cache = APICache.getInstance();
    return cache.getStats();
  },

  // 🚀 AI 功能增強：智能投資建議
  async generateInvestmentAdvice(stockId: string, theme: string, marketContext?: string): Promise<{
    stockId: string;
    theme: string;
    advice: {
      type: 'buy' | 'hold' | 'sell';
      confidence: number;
      reasoning: string;
      timeframe: 'short' | 'medium' | 'long';
    };
    analysis: {
      fundamentals: string;
      technical: string;
      sentiment: string;
    };
    risks: string[];
    opportunities: string[];
    targetPrice?: {
      conservative: number;
      moderate: number;
      aggressive: number;
    };
  }> {
    const cache = APICache.getInstance();
    const cacheKey = `investment_advice_${stockId}_${theme}`;
    
    // 檢查快取
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Using cached investment advice');
      return cached;
    }

    if (!genAI) {
      console.log('使用模擬智能投資建議');
      const result = {
        stockId,
        theme,
        advice: {
          type: 'buy' as const,
          confidence: 75,
          reasoning: '基於產業發展趨勢和公司基本面分析',
          timeframe: 'medium' as const
        },
        analysis: {
          fundamentals: '公司基本面穩健，營收成長符合預期',
          technical: '技術面顯示上升趨勢，支撐位明確',
          sentiment: '市場情緒偏向樂觀，機構評級正面'
        },
        risks: ['產業競爭加劇', '政策風險', '匯率波動'],
        opportunities: ['新產品線推出', '海外市場擴張', '技術創新'],
        targetPrice: {
          conservative: 500,
          moderate: 600,
          aggressive: 750
        }
      };
      cache.set(cacheKey, result, 30 * 60 * 1000); // 30分鐘快取
      return result;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const prompt = `請為股票「${stockId}」在「${theme}」主題下提供智能投資建議。

${marketContext ? `市場背景：${marketContext}` : ''}

請以 JSON 格式回傳：
{
  "stockId": "${stockId}",
  "theme": "${theme}",
  "advice": {
    "type": "buy"或"hold"或"sell",
    "confidence": 0-100的信心度,
    "reasoning": "投資建議的詳細理由",
    "timeframe": "short"或"medium"或"long"
  },
  "analysis": {
    "fundamentals": "基本面分析",
    "technical": "技術面分析", 
    "sentiment": "市場情緒分析"
  },
  "risks": ["風險因素1", "風險因素2", "風險因素3"],
  "opportunities": ["機會1", "機會2", "機會3"],
  "targetPrice": {
    "conservative": 保守目標價,
    "moderate": 適中目標價,
    "aggressive": 積極目標價
  }
}

注意：
- 基於當前市場環境和產業趨勢
- 提供具體的投資理由和風險評估
- 目標價要合理且可實現
- 考慮短期、中期和長期投資策略`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        cache.set(cacheKey, analysis, 30 * 60 * 1000); // 30分鐘快取
        return analysis;
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini 智能投資建議 API 錯誤:', error);
      const fallback = {
        stockId,
        theme,
        advice: {
          type: 'hold' as const,
          confidence: 60,
          reasoning: '建議觀望，等待更明確的市場信號',
          timeframe: 'medium' as const
        },
        analysis: {
          fundamentals: '基本面需要進一步觀察',
          technical: '技術面呈現震盪整理',
          sentiment: '市場情緒中性'
        },
        risks: ['市場不確定性', '產業風險', '政策變化'],
        opportunities: ['潛在的產業機會', '技術突破', '市場擴張'],
        targetPrice: {
          conservative: 450,
          moderate: 500,
          aggressive: 600
        }
      };
      cache.set(cacheKey, fallback, 30 * 60 * 1000);
      return fallback;
    }
  },

  // 🚀 AI 功能增強：風險評估分析
  async analyzeRiskAssessment(stockId: string, theme: string): Promise<{
    stockId: string;
    theme: string;
    riskScore: number; // 0-100，越高風險越大
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    riskCategories: {
      market: { score: number; description: string };
      industry: { score: number; description: string };
      company: { score: number; description: string };
      regulatory: { score: number; description: string };
    };
    riskFactors: Array<{
      category: string;
      factor: string;
      impact: 'low' | 'medium' | 'high';
      probability: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    stressTest: {
      scenario: string;
      impact: string;
      probability: number;
    }[];
  }> {
    const cache = APICache.getInstance();
    const cacheKey = `risk_assessment_${stockId}_${theme}`;
    
    // 檢查快取
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Using cached risk assessment');
      return cached;
    }

    if (!genAI) {
      console.log('使用模擬風險評估分析');
      const result = {
        stockId,
        theme,
        riskScore: 35,
        riskLevel: 'medium' as const,
        riskCategories: {
          market: { score: 40, description: '市場波動風險中等' },
          industry: { score: 30, description: '產業競爭風險較低' },
          company: { score: 25, description: '公司基本面風險較低' },
          regulatory: { score: 45, description: '政策監管風險中等' }
        },
        riskFactors: [
          {
            category: '市場風險',
            factor: '全球經濟放緩',
            impact: 'medium' as const,
            probability: 'medium' as const,
            mitigation: '分散投資組合，關注防禦性資產'
          },
          {
            category: '產業風險',
            factor: '技術變革加速',
            impact: 'high' as const,
            probability: 'medium' as const,
            mitigation: '持續關注技術發展，適時調整策略'
          }
        ],
        stressTest: [
          {
            scenario: '極端市場波動',
            impact: '股價可能下跌15-20%',
            probability: 0.15
          },
          {
            scenario: '產業政策變化',
            impact: '營收可能受到短期影響',
            probability: 0.25
          }
        ]
      };
      cache.set(cacheKey, result, 60 * 60 * 1000); // 1小時快取
      return result;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const prompt = `請對股票「${stockId}」在「${theme}」主題下進行全面的風險評估分析。

請以 JSON 格式回傳：
{
  "stockId": "${stockId}",
  "theme": "${theme}",
  "riskScore": 0-100的綜合風險分數,
  "riskLevel": "low"或"medium"或"high"或"extreme",
  "riskCategories": {
    "market": {"score": 0-100, "description": "市場風險分析"},
    "industry": {"score": 0-100, "description": "產業風險分析"},
    "company": {"score": 0-100, "description": "公司風險分析"},
    "regulatory": {"score": 0-100, "description": "監管風險分析"}
  },
  "riskFactors": [
    {
      "category": "風險類別",
      "factor": "具體風險因素",
      "impact": "low"或"medium"或"high",
      "probability": "low"或"medium"或"high",
      "mitigation": "風險緩解策略"
    }
  ],
  "stressTest": [
    {
      "scenario": "壓力測試情境",
      "impact": "對股價的影響",
      "probability": 0-1的發生機率
    }
  ]
}

注意：
- 全面評估各類風險因素
- 提供具體的風險緩解建議
- 包含壓力測試情境分析
- 風險評分要客觀且可量化`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        cache.set(cacheKey, analysis, 60 * 60 * 1000); // 1小時快取
        return analysis;
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini 風險評估 API 錯誤:', error);
      const fallback = {
        stockId,
        theme,
        riskScore: 50,
        riskLevel: 'medium' as const,
        riskCategories: {
          market: { score: 50, description: '市場風險需要關注' },
          industry: { score: 45, description: '產業風險中等' },
          company: { score: 40, description: '公司風險可控' },
          regulatory: { score: 55, description: '監管風險較高' }
        },
        riskFactors: [
          {
            category: '綜合風險',
            factor: '市場不確定性',
            impact: 'medium' as const,
            probability: 'medium' as const,
            mitigation: '建議分散投資，定期檢視風險'
          }
        ],
        stressTest: [
          {
            scenario: '市場調整',
            impact: '股價可能波動10-15%',
            probability: 0.3
          }
        ]
      };
      cache.set(cacheKey, fallback, 60 * 60 * 1000);
      return fallback;
    }
  },

  // 🚀 AI 功能增強：市場趨勢預測
  async predictMarketTrend(theme: string, timeframe: 'short' | 'medium' | 'long' = 'medium'): Promise<{
    theme: string;
    timeframe: string;
    prediction: {
      direction: 'bullish' | 'bearish' | 'sideways';
      confidence: number;
      reasoning: string;
    };
    factors: {
      positive: string[];
      negative: string[];
      neutral: string[];
    };
    timeline: Array<{
      period: string;
      expected: string;
      probability: number;
    }>;
    recommendations: string[];
  }> {
    const cache = APICache.getInstance();
    const cacheKey = `market_trend_${theme}_${timeframe}`;
    
    // 檢查快取
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Using cached market trend prediction');
      return cached;
    }

    if (!genAI) {
      console.log('使用模擬市場趨勢預測');
      const result = {
        theme,
        timeframe,
        prediction: {
          direction: 'bullish' as const,
          confidence: 70,
          reasoning: '基於產業發展趨勢和技術創新推動'
        },
        factors: {
          positive: ['技術創新加速', '政策支持', '需求增長'],
          negative: ['競爭加劇', '成本上升'],
          neutral: ['市場整合', '監管變化']
        },
        timeline: [
          {
            period: '短期 (1-3個月)',
            expected: '震盪上行',
            probability: 0.6
          },
          {
            period: '中期 (3-12個月)',
            expected: '穩健成長',
            probability: 0.7
          },
          {
            period: '長期 (1年以上)',
            expected: '結構性成長',
            probability: 0.8
          }
        ],
        recommendations: [
          '關注龍頭企業投資機會',
          '分散投資降低風險',
          '定期檢視投資組合'
        ]
      };
      cache.set(cacheKey, result, 2 * 60 * 60 * 1000); // 2小時快取
      return result;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const prompt = `請預測「${theme}」主題在${timeframe === 'short' ? '短期(1-3個月)' : timeframe === 'medium' ? '中期(3-12個月)' : '長期(1年以上)'}的市場趨勢。

請以 JSON 格式回傳：
{
  "theme": "${theme}",
  "timeframe": "${timeframe}",
  "prediction": {
    "direction": "bullish"或"bearish"或"sideways",
    "confidence": 0-100的信心度,
    "reasoning": "預測的詳細理由"
  },
  "factors": {
    "positive": ["正面因素1", "正面因素2"],
    "negative": ["負面因素1", "負面因素2"],
    "neutral": ["中性因素1", "中性因素2"]
  },
  "timeline": [
    {
      "period": "時間段",
      "expected": "預期表現",
      "probability": 0-1的機率
    }
  ],
  "recommendations": ["投資建議1", "投資建議2", "投資建議3"]
}

注意：
- 基於產業發展趨勢和市場環境
- 提供具體的時間線預測
- 包含正面和負面因素分析
- 給出實用的投資建議`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        cache.set(cacheKey, analysis, 2 * 60 * 60 * 1000); // 2小時快取
        return analysis;
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini 市場趨勢預測 API 錯誤:', error);
      const fallback = {
        theme,
        timeframe,
        prediction: {
          direction: 'sideways' as const,
          confidence: 50,
          reasoning: '市場趨勢不明確，需要進一步觀察'
        },
        factors: {
          positive: ['潛在機會'],
          negative: ['風險因素'],
          neutral: ['觀望因素']
        },
        timeline: [
          {
            period: '預測期間',
            expected: '震盪整理',
            probability: 0.5
          }
        ],
        recommendations: [
          '建議觀望',
          '等待更明確信號',
          '控制風險'
        ]
      };
      cache.set(cacheKey, fallback, 2 * 60 * 60 * 1000);
      return fallback;
    }
  },

  // 🚀 AI 功能增強：投資組合優化建議
  async optimizePortfolio(portfolio: Array<{ ticker: string; weight: number }>, riskTolerance: 'low' | 'medium' | 'high'): Promise<{
    currentPortfolio: Array<{ ticker: string; weight: number; risk: number }>;
    optimizedPortfolio: Array<{ ticker: string; weight: number; reason: string }>;
    analysis: {
      currentRisk: number;
      optimizedRisk: number;
      expectedReturn: number;
      diversification: number;
    };
    recommendations: Array<{
      action: 'buy' | 'sell' | 'hold' | 'add' | 'reduce';
      ticker: string;
      amount: number;
      reason: string;
    }>;
    themes: Array<{
      theme: string;
      currentWeight: number;
      suggestedWeight: number;
      reasoning: string;
    }>;
  }> {
    const cache = APICache.getInstance();
    const cacheKey = `portfolio_optimization_${JSON.stringify(portfolio)}_${riskTolerance}`;
    
    // 檢查快取
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('Using cached portfolio optimization');
      return cached;
    }

    if (!genAI) {
      console.log('使用模擬投資組合優化建議');
      const result = {
        currentPortfolio: portfolio.map(p => ({ ...p, risk: 50 })),
        optimizedPortfolio: [
          { ticker: '2330', weight: 0.3, reason: '核心持股，技術領先' },
          { ticker: '2317', weight: 0.25, reason: '產業龍頭，穩定成長' },
          { ticker: '2454', weight: 0.2, reason: '成長型股票，潛力較大' },
          { ticker: '1301', weight: 0.15, reason: '防禦性持股，分散風險' },
          { ticker: '2881', weight: 0.1, reason: '金融股，穩定收益' }
        ],
        analysis: {
          currentRisk: 60,
          optimizedRisk: 45,
          expectedReturn: 12.5,
          diversification: 75
        },
        recommendations: [
          {
            action: 'add' as const,
            ticker: '2330',
            amount: 0.05,
            reason: '增加核心持股比重'
          },
          {
            action: 'reduce' as const,
            ticker: '2317',
            amount: 0.03,
            reason: '適度降低集中度'
          }
        ],
        themes: [
          {
            theme: '半導體',
            currentWeight: 0.4,
            suggestedWeight: 0.35,
            reasoning: '適度降低集中度，提高分散性'
          },
          {
            theme: '電子製造',
            currentWeight: 0.3,
            suggestedWeight: 0.25,
            reasoning: '維持合理比重'
          }
        ]
      };
      cache.set(cacheKey, result, 4 * 60 * 60 * 1000); // 4小時快取
      return result;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
      
      const portfolioStr = JSON.stringify(portfolio);
      const prompt = `請為以下投資組合提供優化建議，風險承受度為${riskTolerance}：

當前投資組合：${portfolioStr}

請以 JSON 格式回傳：
{
  "currentPortfolio": [
    {"ticker": "股票代號", "weight": 權重, "risk": 風險評分}
  ],
  "optimizedPortfolio": [
    {"ticker": "股票代號", "weight": 建議權重, "reason": "調整理由"}
  ],
  "analysis": {
    "currentRisk": 當前風險評分,
    "optimizedRisk": 優化後風險評分,
    "expectedReturn": 預期報酬率,
    "diversification": 分散度評分
  },
  "recommendations": [
    {
      "action": "buy"或"sell"或"hold"或"add"或"reduce",
      "ticker": "股票代號",
      "amount": 調整金額或比例,
      "reason": "調整理由"
    }
  ],
  "themes": [
    {
      "theme": "投資主題",
      "currentWeight": 當前主題權重,
      "suggestedWeight": "建議主題權重",
      "reasoning": "調整理由"
    }
  ]
}

注意：
- 根據風險承受度調整配置
- 提供具體的調整建議
- 考慮產業分散性
- 平衡風險和報酬`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        cache.set(cacheKey, analysis, 4 * 60 * 60 * 1000); // 4小時快取
        return analysis;
      }
      
      throw new Error('無法解析 AI 回應');
    } catch (error) {
      console.error('Gemini 投資組合優化 API 錯誤:', error);
      const fallback = {
        currentPortfolio: portfolio.map(p => ({ ...p, risk: 50 })),
        optimizedPortfolio: portfolio.map(p => ({ ...p, reason: '維持現有配置' })),
        analysis: {
          currentRisk: 50,
          optimizedRisk: 50,
          expectedReturn: 8.0,
          diversification: 60
        },
        recommendations: [
          {
            action: 'hold' as const,
            ticker: portfolio[0]?.ticker || '2330',
            amount: 0,
            reason: '建議維持現有配置'
          }
        ],
        themes: [
          {
            theme: '綜合',
            currentWeight: 1.0,
            suggestedWeight: 1.0,
            reasoning: '維持現有配置'
          }
        ]
      };
      cache.set(cacheKey, fallback, 4 * 60 * 60 * 1000);
      return fallback;
    }
  }
};
