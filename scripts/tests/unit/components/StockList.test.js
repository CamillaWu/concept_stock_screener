/**
 * StockList 組件邏輯單元測試
 * 測試股票列表的數據處理、過濾、分頁、排序等核心邏輯
 */

// 模擬股票數據
const mockStocks = [
  {
    id: 'stock_1',
    ticker: 'TSLA',
    name: 'Tesla Inc',
    price: 245.50,
    change: 12.30,
    changePercent: 5.28,
    volume: 45000000,
    marketCap: 780000000000,
    sector: 'Automotive',
    industry: 'Electric Vehicles',
    isFavorite: true,
    hasAnomaly: false,
    sentiment: 'positive'
  },
  {
    id: 'stock_2',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 890.25,
    change: -15.75,
    changePercent: -1.74,
    volume: 32000000,
    marketCap: 2200000000000,
    sector: 'Technology',
    industry: 'Semiconductors',
    isFavorite: false,
    hasAnomaly: true,
    sentiment: 'neutral'
  },
  {
    id: 'stock_3',
    ticker: 'AAPL',
    name: 'Apple Inc',
    price: 185.90,
    change: 3.20,
    changePercent: 1.75,
    volume: 55000000,
    marketCap: 2900000000000,
    sector: 'Technology',
    industry: 'Consumer Electronics',
    isFavorite: true,
    hasAnomaly: false,
    sentiment: 'positive'
  }
];

// 模擬 StockList 邏輯對象
const StockListLogic = {
  // 過濾股票
  filterStocks: (stocks, filters) => {
    let filtered = [...stocks];
    
    if (filters.sector) {
      filtered = filtered.filter(stock => stock.sector === filters.sector);
    }
    
    if (filters.priceRange) {
      filtered = filtered.filter(stock => 
        stock.price >= filters.priceRange.min && 
        stock.price <= filters.priceRange.max
      );
    }
    
    if (filters.favoritesOnly) {
      filtered = filtered.filter(stock => stock.isFavorite);
    }
    
    if (filters.anomalyOnly) {
      filtered = filtered.filter(stock => stock.hasAnomaly);
    }
    
    if (filters.sentiment) {
      filtered = filtered.filter(stock => stock.sentiment === filters.sentiment);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(stock => 
        stock.ticker.toLowerCase().includes(term) ||
        stock.name.toLowerCase().includes(term) ||
        stock.sector.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  },
  
  // 分頁股票
  paginateStocks: (stocks, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return stocks.slice(startIndex, endIndex);
  },
  
  // 計算總頁數
  calculateTotalPages: (totalStocks, pageSize) => {
    return Math.ceil(totalStocks / pageSize);
  },
  
  // 驗證股票數據
  validateStock: (stock) => {
    const errors = [];
    
    if (!stock.ticker || typeof stock.ticker !== 'string') {
      errors.push('股票代碼無效');
    }
    
    if (!stock.name || typeof stock.name !== 'string') {
      errors.push('股票名稱無效');
    }
    
    if (typeof stock.price !== 'number' || stock.price < 0) {
      errors.push('股票價格無效');
    }
    
    if (typeof stock.change !== 'number') {
      errors.push('股票漲跌無效');
    }
    
    if (typeof stock.changePercent !== 'number') {
      errors.push('股票漲跌幅無效');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 排序股票
  sortStocks: (stocks, sortBy, sortOrder = 'asc') => {
    const sorted = [...stocks];
    
    sorted.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // 處理特殊排序邏輯
      if (sortBy === 'changePercent') {
        aValue = Math.abs(aValue);
        bValue = Math.abs(bValue);
      }
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sorted;
  },
  
  // 計算統計信息
  calculateStats: (stocks) => {
    if (stocks.length === 0) {
      return {
        totalStocks: 0,
        averagePrice: 0,
        totalMarketCap: 0,
        gainers: 0,
        losers: 0,
        unchanged: 0
      };
    }
    
    const totalStocks = stocks.length;
    const totalPrice = stocks.reduce((sum, stock) => sum + stock.price, 0);
    const averagePrice = totalPrice / totalStocks;
    const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
    
    const gainers = stocks.filter(stock => stock.change > 0).length;
    const losers = stocks.filter(stock => stock.change < 0).length;
    const unchanged = stocks.filter(stock => stock.change === 0).length;
    
    return {
      totalStocks,
      averagePrice: Math.round(averagePrice * 100) / 100,
      totalMarketCap,
      gainers,
      losers,
      unchanged
    };
  }
};

describe('StockList 邏輯', () => {
  describe('股票過濾', () => {
    test('應該按行業過濾股票', () => {
      const filters = { sector: 'Technology' };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(stock => stock.sector === 'Technology')).toBe(true);
    });

    test('應該按價格範圍過濾股票', () => {
      const filters = { priceRange: { min: 200, max: 300 } };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].ticker).toBe('TSLA');
    });

    test('應該只顯示收藏的股票', () => {
      const filters = { favoritesOnly: true };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(stock => stock.isFavorite)).toBe(true);
    });

    test('應該只顯示異常股票', () => {
      const filters = { anomalyOnly: true };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].ticker).toBe('NVDA');
    });

    test('應該按情感過濾股票', () => {
      const filters = { sentiment: 'positive' };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(stock => stock.sentiment === 'positive')).toBe(true);
    });

    test('應該按搜尋詞過濾股票', () => {
      const filters = { searchTerm: 'Tesla' };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].ticker).toBe('TSLA');
    });

    test('應該組合多個過濾條件', () => {
      const filters = { 
        sector: 'Technology', 
        priceRange: { min: 100, max: 200 },
        favoritesOnly: true
      };
      const filtered = StockListLogic.filterStocks(mockStocks, filters);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].ticker).toBe('AAPL');
    });
  });

  describe('股票分頁', () => {
    test('應該正確分頁股票', () => {
      const page1 = StockListLogic.paginateStocks(mockStocks, 1, 2);
      const page2 = StockListLogic.paginateStocks(mockStocks, 2, 2);
      
      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(1);
      expect(page1[0].ticker).toBe('TSLA');
      expect(page2[0].ticker).toBe('AAPL');
    });

    test('應該計算正確的總頁數', () => {
      const totalPages = StockListLogic.calculateTotalPages(mockStocks.length, 2);
      expect(totalPages).toBe(2);
    });

    test('應該處理空數據集', () => {
      const emptyPage = StockListLogic.paginateStocks([], 1, 10);
      const totalPages = StockListLogic.calculateTotalPages(0, 10);
      
      expect(emptyPage).toHaveLength(0);
      expect(totalPages).toBe(0);
    });

    test('應該處理超出範圍的頁數', () => {
      const outOfRangePage = StockListLogic.paginateStocks(mockStocks, 5, 10);
      expect(outOfRangePage).toHaveLength(0);
    });
  });

  describe('股票驗證', () => {
    test('應該驗證有效的股票數據', () => {
      const validStock = mockStocks[0];
      const validation = StockListLogic.validateStock(validStock);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('應該檢測無效的股票代碼', () => {
      const invalidStock = { ...mockStocks[0], ticker: null };
      const validation = StockListLogic.validateStock(invalidStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('股票代碼無效');
    });

    test('應該檢測無效的股票名稱', () => {
      const invalidStock = { ...mockStocks[0], name: 123 };
      const validation = StockListLogic.validateStock(invalidStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('股票名稱無效');
    });

    test('應該檢測無效的股票價格', () => {
      const invalidStock = { ...mockStocks[0], price: -100 };
      const validation = StockListLogic.validateStock(invalidStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('股票價格無效');
    });

    test('應該檢測無效的漲跌數據', () => {
      const invalidStock = { ...mockStocks[0], change: 'invalid' };
      const validation = StockListLogic.validateStock(invalidStock);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('股票漲跌無效');
    });
  });

  describe('股票排序', () => {
    test('應該按價格升序排序', () => {
      const sorted = StockListLogic.sortStocks(mockStocks, 'price', 'asc');
      
      expect(sorted[0].price).toBeLessThan(sorted[1].price);
      expect(sorted[1].price).toBeLessThan(sorted[2].price);
    });

    test('應該按價格降序排序', () => {
      const sorted = StockListLogic.sortStocks(mockStocks, 'price', 'desc');
      
      expect(sorted[0].price).toBeGreaterThan(sorted[1].price);
      expect(sorted[1].price).toBeGreaterThan(sorted[2].price);
    });

    test('應該按漲跌幅排序（絕對值）', () => {
      const sorted = StockListLogic.sortStocks(mockStocks, 'changePercent', 'desc');
      
      const absChanges = sorted.map(stock => Math.abs(stock.changePercent));
      expect(absChanges[0]).toBeGreaterThanOrEqual(absChanges[1]);
      expect(absChanges[1]).toBeGreaterThanOrEqual(absChanges[2]);
    });

    test('應該按股票代碼排序', () => {
      const sorted = StockListLogic.sortStocks(mockStocks, 'ticker', 'asc');
      
      expect(sorted[0].ticker).toBe('AAPL');
      expect(sorted[1].ticker).toBe('NVDA');
      expect(sorted[2].ticker).toBe('TSLA');
    });
  });

  describe('統計計算', () => {
    test('應該計算正確的統計信息', () => {
      const stats = StockListLogic.calculateStats(mockStocks);
      
      expect(stats.totalStocks).toBe(3);
      expect(stats.averagePrice).toBe(440.55);
      expect(stats.totalMarketCap).toBe(5880000000000);
      expect(stats.gainers).toBe(2);
      expect(stats.losers).toBe(1);
      expect(stats.unchanged).toBe(0);
    });

    test('應該處理空數據集', () => {
      const stats = StockListLogic.calculateStats([]);
      
      expect(stats.totalStocks).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.totalMarketCap).toBe(0);
      expect(stats.gainers).toBe(0);
      expect(stats.losers).toBe(0);
      expect(stats.unchanged).toBe(0);
    });

    test('應該正確計算平均價格', () => {
      const stats = StockListLogic.calculateStats(mockStocks);
      const expectedAverage = (245.50 + 890.25 + 185.90) / 3;
      
      expect(stats.averagePrice).toBe(Math.round(expectedAverage * 100) / 100);
    });

    test('應該正確計算漲跌統計', () => {
      const stats = StockListLogic.calculateStats(mockStocks);
      
      // TSLA: +12.30, NVDA: -15.75, AAPL: +3.20
      expect(stats.gainers).toBe(2); // TSLA, AAPL
      expect(stats.losers).toBe(1);  // NVDA
      expect(stats.unchanged).toBe(0);
    });
  });

  describe('邊界情況', () => {
    test('應該處理單一股票的情況', () => {
      const singleStock = [mockStocks[0]];
      
      const filtered = StockListLogic.filterStocks(singleStock, { sector: 'Automotive' });
      const paginated = StockListLogic.paginateStocks(singleStock, 1, 10);
      const stats = StockListLogic.calculateStats(singleStock);
      
      expect(filtered).toHaveLength(1);
      expect(paginated).toHaveLength(1);
      expect(stats.totalStocks).toBe(1);
    });

    test('應該處理極端價格值', () => {
      const extremeStock = {
        ...mockStocks[0],
        price: 0.01,
        change: -999999,
        changePercent: -99.99
      };
      
      const validation = StockListLogic.validateStock(extremeStock);
      expect(validation.isValid).toBe(true); // 極端值仍然是有效的
    });

    test('應該處理特殊字符的股票名稱', () => {
      const specialCharStock = {
        ...mockStocks[0],
        name: 'Tesla, Inc. (TSLA) - 電動車'
      };
      
      const validation = StockListLogic.validateStock(specialCharStock);
      expect(validation.isValid).toBe(true);
    });
  });
});
