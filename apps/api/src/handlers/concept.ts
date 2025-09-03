import { ApiResponse, ConceptData } from '@concept-stock-screener/types';

// 模擬概念股數據
const mockConcepts: ConceptData[] = [
  {
    id: 'ai-chips',
    name: 'AI 晶片概念',
    description: '人工智慧晶片相關的股票，包括設計、製造、封裝等產業鏈',
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
        changePercent: 0.03,
        volume: 30000000,
        marketCap: 1350000000000,
        sector: '半導體',
        industry: 'IC 設計',
      },
    ],
    keywords: ['AI', '晶片', '人工智慧', '半導體'],
    category: '科技',
  },
  {
    id: 'electric-vehicle',
    name: '電動車概念',
    description: '電動車產業相關股票，包括電池、馬達、充電樁等',
    stocks: [
      {
        symbol: '2317',
        name: '鴻海',
        price: 105,
        change: -2,
        changePercent: -0.019,
        volume: 80000000,
        marketCap: 1450000000000,
        sector: '電子零組件',
        industry: '電子製造服務',
      },
    ],
    keywords: ['電動車', '電池', '充電', '新能源'],
    category: '汽車',
  },
];

export const conceptHandler = {
  // 獲取所有概念股
  async getConcepts(): Promise<Response> {
    try {
      const response: ApiResponse<ConceptData[]> = {
        success: true,
        data: mockConcepts,
        message: '成功獲取概念股列表',
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
        error: '獲取概念股列表失敗',
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },

  // 獲取單一概念股
  async getConcept(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const conceptId = url.searchParams.get('id');

      if (!conceptId) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '概念股 ID 不能為空',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const concept = mockConcepts.find(c => c.id === conceptId);

      if (!concept) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '找不到該概念股',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const response: ApiResponse<ConceptData> = {
        success: true,
        data: concept,
        message: '成功獲取概念股資訊',
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
        error: '獲取概念股資訊失敗',
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
