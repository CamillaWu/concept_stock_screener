// 內聯類型定義
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  industry: string;
}

// 模擬股票數據
const mockStocks: StockData[] = [
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
];

export const stockHandler = {
  // 獲取所有股票
  async getStocks(request: Request): Promise<Response> {
    try {
      const response: ApiResponse<StockData[]> = {
        success: true,
        data: mockStocks,
        message: '成功獲取股票列表',
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
        error: '獲取股票列表失敗',
      };

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  },

  // 獲取單一股票
  async getStock(request: Request, env: any, ctx: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      const symbol = ctx.params?.symbol;

      if (!symbol) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '股票代碼不能為空',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const stock = mockStocks.find(s => s.symbol === symbol);

      if (!stock) {
        const errorResponse: ApiResponse = {
          success: false,
          error: '找不到該股票',
        };

        return new Response(JSON.stringify(errorResponse), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const response: ApiResponse<StockData> = {
        success: true,
        data: stock,
        message: '成功獲取股票資訊',
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
        error: '獲取股票資訊失敗',
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
