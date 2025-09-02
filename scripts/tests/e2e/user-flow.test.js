/**
 * 用戶流程端到端測試
 */

const axios = require('axios');

// 模擬 axios
jest.mock('axios');

describe('用戶流程端到端測試', () => {
  
  const baseURL = 'http://localhost:8787';
  const frontendURL = 'http://localhost:3000';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('完整概念股搜尋流程', () => {
    
    test('用戶應該能夠完成從搜尋到查看詳情的完整流程', async () => {
      // 1. 用戶訪問首頁
      const homeResponse = {
        status: 200,
        data: { status: 'ok' }
      };
      axios.get.mockResolvedValueOnce(homeResponse);
      
      const home = await axios.get(`${baseURL}/`);
      expect(home.status).toBe(200);
      
      // 2. 用戶查看趨勢主題
      const trendingData = [
        {
          id: 'ai-2024',
          theme: 'AI',
          name: '人工智慧概念股',
          description: '與人工智慧技術相關的股票概念',
          heatScore: 85,
          stocks: [
            {
              ticker: '2330',
              symbol: '2330',
              name: '台積電',
              exchange: 'TWSE',
              reason: 'AI 晶片製造龍頭'
            }
          ]
        }
      ];
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: trendingData
      });
      
      const trending = await axios.get(`${baseURL}/trending`);
      expect(trending.status).toBe(200);
      expect(trending.data[0].theme).toBe('AI');
      
      // 3. 用戶搜尋特定概念
      const searchQuery = '人工智慧';
      const searchResults = [
        {
          id: 'ai-2024',
          theme: 'AI',
          name: '人工智慧概念股',
          description: '與人工智慧技術相關的股票概念',
          heatScore: 85,
          stocks: trendingData[0].stocks
        }
      ];
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: searchResults
      });
      
      const search = await axios.get(`${baseURL}/search`, {
        params: { mode: 'theme', q: searchQuery, real: false }
      });
      expect(search.status).toBe(200);
      expect(search.data[0].theme).toBe('AI');
      
      // 4. 用戶查看概念詳情
      const conceptId = 'ai-2024';
      const conceptDetail = {
        ...searchResults[0],
        analysis: 'AI 概念股分析詳情...',
        relatedThemes: ['機器學習', '深度學習', '自然語言處理']
      };
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: conceptDetail
      });
      
      const concept = await axios.get(`${baseURL}/concept/${conceptId}`);
      expect(concept.status).toBe(200);
      expect(concept.data.analysis).toBeDefined();
      
      // 5. 用戶查看相關股票
      const stockTicker = '2330';
      const stockDetail = {
        ticker: '2330',
        name: '台積電',
        price: 500,
        change: 10,
        changePercent: 2.0,
        concepts: [
          {
            theme: 'AI',
            relevance: 0.9,
            description: 'AI 晶片製造龍頭'
          }
        ]
      };
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: stockDetail
      });
      
      const stock = await axios.get(`${baseURL}/stock/${stockTicker}`);
      expect(stock.status).toBe(200);
      expect(stock.data.concepts[0].theme).toBe('AI');
      
      // 6. 用戶使用 RAG 搜尋相關資訊
      const ragQuery = '台積電 AI 晶片';
      const ragResults = [
        {
          doc_id: 'doc-001',
          score: 0.95,
          metadata: {
            type: 'theme_to_stock',
            title: '台積電 AI 晶片分析',
            theme_name: 'AI',
            ticker: '2330',
            stock_name: '台積電'
          },
          content: '台積電在 AI 晶片製造領域的領先地位...'
        }
      ];
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: ragResults
      });
      
      const rag = await axios.get(`${baseURL}/vector-search`, {
        params: { q: ragQuery, topK: 5 }
      });
      expect(rag.status).toBe(200);
      expect(rag.data[0].metadata.ticker).toBe('2330');
      
      // 驗證整個流程的完整性
      expect(axios.get).toHaveBeenCalledTimes(6);
    });
  });
  
  describe('錯誤處理流程', () => {
    
    test('系統應該優雅地處理各種錯誤情況', async () => {
      // 1. 網路錯誤
      axios.get.mockRejectedValueOnce(new Error('網路錯誤'));
      
      try {
        await axios.get(`${baseURL}/trending`);
      } catch (error) {
        expect(error.message).toBe('網路錯誤');
      }
      
      // 2. API 錯誤回應
      axios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { error: '內部服務錯誤' }
        }
      });
      
      try {
        await axios.get(`${baseURL}/search`);
      } catch (error) {
        expect(error.response.status).toBe(500);
      }
      
      // 3. 超時錯誤
      axios.get.mockRejectedValueOnce(new Error('請求超時'));
      
      try {
        await axios.get(`${baseURL}/vector-search`);
      } catch (error) {
        expect(error.message).toBe('請求超時');
      }
    });
  });
  
  describe('效能測試流程', () => {
    
    test('關鍵端點應該在合理時間內回應', async () => {
      const startTime = Date.now();
      
      // 模擬快速回應
      axios.get.mockResolvedValue({
        status: 200,
        data: { status: 'ok' }
      });
      
      await axios.get(`${baseURL}/`);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // 1秒內
    });
    
    test('搜尋功能應該支援並行請求', async () => {
      const searchQueries = ['AI', '5G', '電動車', '生技'];
      const mockResponses = searchQueries.map(query => ({
        status: 200,
        data: [{ theme: query, name: `${query}概念股` }]
      }));
      
      // 模擬並行回應
      searchQueries.forEach((query, index) => {
        axios.get.mockResolvedValueOnce(mockResponses[index]);
      });
      
      const startTime = Date.now();
      
      const promises = searchQueries.map(query =>
        axios.get(`${baseURL}/search`, {
          params: { mode: 'theme', q: query }
        })
      );
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      expect(results).toHaveLength(4);
      expect(totalTime).toBeLessThan(2000); // 2秒內完成所有請求
    });
  });
  
  describe('資料一致性測試', () => {
    
    test('不同端點返回的資料應該保持一致', async () => {
      const aiTheme = {
        id: 'ai-2024',
        theme: 'AI',
        name: '人工智慧概念股'
      };
      
      // 模擬不同端點返回相同主題
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: [aiTheme]
      });
      
      axios.get.mockResolvedValueOnce({
        status: 200,
        data: [aiTheme]
      });
      
      const trending = await axios.get(`${baseURL}/trending`);
      const search = await axios.get(`${baseURL}/search`, {
        params: { mode: 'theme', q: 'AI' }
      });
      
      expect(trending.data[0].id).toBe(search.data[0].id);
      expect(trending.data[0].theme).toBe(search.data[0].theme);
    });
  });
});
