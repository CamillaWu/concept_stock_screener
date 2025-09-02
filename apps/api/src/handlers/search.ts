import { ApiResponse, SearchParams, SearchResponse } from '@concept-stock-screener/types';

// 模擬搜尋結果
const mockSearchResults = {
  stocks: [
    {
      symbol: '2330',
      name: '台積電',
      price: 580,
      change: 15,
      changePercent: 0.026,
      volume: 50000000,
      marketCap: 15000000000000,
      sector: '半導體',
      industry: '晶圓代工',
    },
    {
      symbol: '2454',
      name: '聯發科',
      price: 850,
      change: 25,
      changePercent: 0.030,
      volume: 30000000,
      marketCap: 1350000000000,
      sector: '半導體',
      industry: 'IC 設計',
    },
  ],
  concepts: [
    {
      id: 'ai-chips',
      name: 'AI 晶片概念',
      description: '人工智慧晶片相關的股票',
      stocks: [],
      keywords: ['AI', '晶片', '人工智慧'],
      category: '科技',
    },
  ],
  total: 3,
  suggestions: ['AI', '晶片', '半導體', '台積電', '聯發科'],
};

export const searchHandler = {
  // 搜尋功能
  async search(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      
      if (!query.trim()) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '搜尋關鍵字不能為空',
        };
        
        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // 模擬搜尋邏輯
      const filteredStocks = mockSearchResults.stocks.filter(stock =>
        stock.name.toLowerCase().includes(query.toLowerCase()) ||
        stock.symbol.includes(query) ||
        stock.sector.toLowerCase().includes(query.toLowerCase())
      );
      
      const filteredConcepts = mockSearchResults.concepts.filter(concept =>
        concept.name.toLowerCase().includes(query.toLowerCase()) ||
        concept.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      const total = filteredStocks.length + filteredConcepts.length;
      
      // 分頁處理
      const startIndex = (page - 1) * limit;
      const paginatedStocks = filteredStocks.slice(startIndex, startIndex + limit);
      const paginatedConcepts = filteredConcepts.slice(startIndex, startIndex + limit);
      
      const response: ApiResponse<SearchResponse> = {
        success: true,
        data: {
          stocks: paginatedStocks,
          concepts: paginatedConcepts,
          total,
          suggestions: mockSearchResults.suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query.toLowerCase())
          ),
        },
        message: `找到 ${total} 個相關結果`,
      };
      
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      const errorResponse: ApiResponse = {
        success: false,
        error: '搜尋失敗',
      };
      
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },
};
