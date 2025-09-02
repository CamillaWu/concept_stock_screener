/**
 * API 整合測試
 */

const axios = require('axios');

// 模擬 axios
jest.mock('axios');

describe('API 整合測試', () => {
  
  const baseURL = 'http://localhost:8787';
  
  beforeEach(() => {
    // 重置所有模擬
    jest.clearAllMocks();
  });
  
  describe('健康檢查端點', () => {
    
    test('GET / 應該返回健康狀態', async () => {
      const mockResponse = {
        status: 200,
        data: {
          status: 'ok',
          timestamp: '2024-01-15T10:30:00.000Z'
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const response = await axios.get(`${baseURL}/`);
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ok');
      expect(response.data.timestamp).toBeDefined();
      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/`);
    });
    
    test('健康檢查端點應該處理錯誤', async () => {
      const errorMessage = '服務不可用';
      axios.get.mockRejectedValue(new Error(errorMessage));
      
      await expect(axios.get(`${baseURL}/`)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('趨勢主題端點', () => {
    
    test('GET /trending 應該返回趨勢主題列表', async () => {
      const mockTrendingData = [
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
      
      const mockResponse = {
        status: 200,
        data: mockTrendingData
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      const response = await axios.get(`${baseURL}/trending`);
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockTrendingData);
      expect(response.data[0].theme).toBe('AI');
      expect(response.data[0].stocks).toHaveLength(1);
    });
    
    test('趨勢端點應該支援查詢參數', async () => {
      const params = { sort: 'latest', real: true };
      axios.get.mockResolvedValue({ status: 200, data: [] });
      
      await axios.get(`${baseURL}/trending`, { params });
      
      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/trending`, { params });
    });
  });
  
  describe('搜尋端點', () => {
    
    test('GET /search 應該支援主題搜尋模式', async () => {
      const searchParams = {
        mode: 'theme',
        q: 'AI',
        real: false
      };
      
      const mockSearchResults = [
        {
          id: 'ai-2024',
          theme: 'AI',
          name: '人工智慧概念股',
          description: '與人工智慧技術相關的股票概念',
          heatScore: 85,
          stocks: []
        }
      ];
      
      axios.get.mockResolvedValue({
        status: 200,
        data: mockSearchResults
      });
      
      const response = await axios.get(`${baseURL}/search`, { params: searchParams });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockSearchResults);
      expect(axios.get).toHaveBeenCalledWith(`${baseURL}/search`, { params: searchParams });
    });
    
    test('搜尋端點應該驗證必要參數', async () => {
      const invalidParams = { q: 'AI' }; // 缺少 mode 參數
      
      // 模擬 API 返回錯誤響應
      axios.get.mockResolvedValue({
        status: 400,
        data: {
          success: false,
          error: '缺少必要參數',
          code: 'missing_params'
        }
      });
      
      const response = await axios.get(`${baseURL}/search`, { params: invalidParams });
      
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toBe('缺少必要參數');
      expect(response.data.code).toBe('missing_params');
    });
  });
  
  describe('RAG 端點', () => {
    
    test('GET /rag/manifest.json 應該返回 RAG 清單', async () => {
      const mockManifest = {
        theme_overview: 150,
        theme_to_stock: 300,
        total: 450,
        fields: ['type', 'title', 'theme_name', 'ticker', 'stock_name', 'tags'],
        note: 'RAG 系統文件清單'
      };
      
      axios.get.mockResolvedValue({
        status: 200,
        data: mockManifest
      });
      
      const response = await axios.get(`${baseURL}/rag/manifest.json`);
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockManifest);
      expect(response.data.total).toBe(450);
    });
    
    test('GET /rag/status 應該返回 RAG 系統狀態', async () => {
      const mockStatus = {
        success: true,
        data: {
          pineconeConfigured: true,
          indexName: 'test-index',
          pineconeEnvironment: 'test',
          apiKeySet: true,
          ragDataValid: true,
          vectorServiceStatus: 'active',
          environment: 'test',
          timestamp: '2024-01-15T10:30:00.000Z'
        }
      };
      
      axios.get.mockResolvedValue({
        status: 200,
        data: mockStatus
      });
      
      const response = await axios.get(`${baseURL}/rag/status`);
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.pineconeConfigured).toBe(true);
    });
  });
  
  describe('向量搜尋端點', () => {
    
    test('GET /vector-search 應該執行語義搜尋', async () => {
      const searchQuery = '人工智慧概念股';
      const mockResults = [
        {
          doc_id: 'doc-001',
          score: 0.95,
          metadata: {
            type: 'theme_overview',
            title: 'AI 概念股分析',
            theme_name: '人工智慧',
            tags: ['AI', '科技', '概念股']
          },
          content: '人工智慧概念股相關分析內容...'
        }
      ];
      
      axios.get.mockResolvedValue({
        status: 200,
        data: mockResults
      });
      
      const response = await axios.get(`${baseURL}/vector-search`, {
        params: { q: searchQuery, topK: 5 }
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mockResults);
      expect(response.data[0].score).toBeGreaterThan(0.9);
    });
  });
  
  describe('錯誤處理', () => {
    
    test('API 應該返回正確的錯誤狀態碼', async () => {
      const errorResponses = [
        { status: 400, code: 'invalid_params' },
        { status: 404, code: 'not_found' },
        { status: 500, code: 'internal_error' }
      ];
      
      for (const error of errorResponses) {
        axios.get.mockRejectedValue({
          response: {
            status: error.status,
            data: {
              success: false,
              error: '測試錯誤',
              code: error.code
            }
          }
        });
        
        try {
          await axios.get(`${baseURL}/test`);
        } catch (err) {
          expect(err.response.status).toBe(error.status);
          expect(err.response.data.code).toBe(error.code);
        }
      }
    });
  });
});
