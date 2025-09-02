/**
 * SearchBar 組件邏輯單元測試
 * 測試搜尋欄的建議、歷史記錄、查詢驗證、搜尋處理等核心邏輯
 */

// 模擬搜尋建議數據
const mockSuggestions = [
  { id: 'suggestion_1', text: 'AI 晶片', category: 'technology', score: 0.95 },
  { id: 'suggestion_2', text: '5G 技術', category: 'infrastructure', score: 0.87 },
  { id: 'suggestion_3', text: '電動車', category: 'automotive', score: 0.82 },
  { id: 'suggestion_4', text: '機器學習', category: 'technology', score: 0.78 },
  { id: 'suggestion_5', text: '區塊鏈', category: 'finance', score: 0.75 }
];

// 模擬搜尋歷史記錄
const mockSearchHistory = [
  { id: 'history_1', query: 'AI 晶片', timestamp: '2025-01-15T10:30:00Z', resultCount: 15 },
  { id: 'history_2', query: '5G 技術', timestamp: '2025-01-15T09:15:00Z', resultCount: 23 },
  { id: 'history_3', query: '電動車', timestamp: '2025-01-14T16:45:00Z', resultCount: 31 },
  { id: 'history_4', query: '機器學習', timestamp: '2025-01-14T14:20:00Z', resultCount: 19 },
  { id: 'history_5', query: '區塊鏈', timestamp: '2025-01-13T11:10:00Z', resultCount: 27 }
];

// 模擬 SearchBar 邏輯對象
const SearchBarLogic = {
  // 獲取搜尋建議
  getSuggestions: (query, suggestions = mockSuggestions, limit = 5) => {
    if (!query || query.trim().length === 0) {
      return suggestions.slice(0, limit);
    }
    
    const queryLower = query.toLowerCase();
    const filtered = suggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(queryLower) ||
      suggestion.category.toLowerCase().includes(queryLower)
    );
    
    return filtered
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
  
  // 獲取搜尋歷史
  getSearchHistory: (history = mockSearchHistory, limit = 10) => {
    return history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },
  
  // 驗證搜尋查詢
  validateQuery: (query) => {
    if (!query || typeof query !== 'string') {
      return { isValid: false, error: '查詢不能為空' };
    }
    
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return { isValid: false, error: '查詢不能為空' };
    }
    
    if (trimmed.length < 2) {
      return { isValid: false, error: '查詢至少需要2個字符' };
    }
    
    if (trimmed.length > 100) {
      return { isValid: false, error: '查詢不能超過100個字符' };
    }
    
    // 檢查是否包含危險字符
    const dangerousChars = /[<>{}]/;
    if (dangerousChars.test(trimmed)) {
      return { isValid: false, error: '查詢包含無效字符' };
    }
    
    return { isValid: true, query: trimmed };
  },
  
  // 處理搜尋
  processSearch: (query, options = {}) => {
    const validation = SearchBarLogic.validateQuery(query);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
        query: null
      };
    }
    
    const processedQuery = validation.query;
    const searchParams = {
      query: processedQuery,
      timestamp: new Date().toISOString(),
      filters: options.filters || {},
      sortBy: options.sortBy || 'relevance',
      limit: options.limit || 20
    };
    
    return {
      success: true,
      query: processedQuery,
      searchParams,
      message: '搜尋已處理'
    };
  },
  
  // 格式化查詢
  formatQuery: (query) => {
    if (!query) return '';
    
    return query
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // 多個空格替換為單個空格
      .replace(/[^\w\s\u4e00-\u9fff]/g, '') // 只保留字母、數字、空格和中文字符
      .replace(/_/g, '') // 特別移除下劃線字符
      .trim();
  },
  
  // 檢查是否為空查詢
  isEmptyQuery: (query) => {
    return !query || query.trim().length === 0;
  },
  
  // 獲取查詢長度
  getQueryLength: (query) => {
    if (!query) return 0;
    return query.trim().length;
  },
  
  // 檢查是否包含特殊字符
  hasSpecialCharacters: (query) => {
    if (!query) return false;
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialChars.test(query);
  },
  
  // 檢查是否為重複查詢
  isDuplicateQuery: (query, history = mockSearchHistory, timeWindow = 300000) => { // 5分鐘
    if (!query || history.length === 0) return false;
    
    const now = new Date().getTime();
    const recentQueries = history.filter(item => {
      const itemTime = new Date(item.timestamp).getTime();
      return (now - itemTime) < timeWindow && 
             item.query.toLowerCase() === query.toLowerCase();
    });
    
    return recentQueries.length > 0;
  },
  
  // 建議相關查詢
  suggestRelatedQueries: (query, suggestions = mockSuggestions, limit = 3) => {
    if (!query) return [];
    
    const queryLower = query.toLowerCase();
    const related = suggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(queryLower) ||
      suggestion.category.toLowerCase().includes(queryLower)
    );
    
    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.text);
  }
};

describe('SearchBar 邏輯', () => {
  describe('搜尋建議', () => {
    test('應該返回所有建議當查詢為空', () => {
      const suggestions = SearchBarLogic.getSuggestions('');
      
      expect(suggestions).toHaveLength(5);
      expect(suggestions[0].text).toBe('AI 晶片'); // 最高分數
      expect(suggestions[4].text).toBe('區塊鏈'); // 最低分數
    });

    test('應該按分數排序建議', () => {
      const suggestions = SearchBarLogic.getSuggestions('');
      
      const scores = suggestions.map(s => s.score);
      expect(scores[0]).toBeGreaterThan(scores[1]);
      expect(scores[1]).toBeGreaterThan(scores[2]);
      expect(scores[2]).toBeGreaterThan(scores[3]);
      expect(scores[3]).toBeGreaterThan(scores[4]);
    });

    test('應該過濾相關建議', () => {
      const suggestions = SearchBarLogic.getSuggestions('AI');
      
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0].text).toBe('AI 晶片');
    });

    test('應該限制建議數量', () => {
      const suggestions = SearchBarLogic.getSuggestions('', mockSuggestions, 3);
      
      expect(suggestions).toHaveLength(3);
      expect(suggestions[0].text).toBe('AI 晶片');
      expect(suggestions[2].text).toBe('電動車');
    });

    test('應該處理無匹配的查詢', () => {
      const suggestions = SearchBarLogic.getSuggestions('不存在的概念');
      
      expect(suggestions).toHaveLength(0);
    });
  });

  describe('搜尋歷史', () => {
    test('應該按時間排序歷史記錄', () => {
      const history = SearchBarLogic.getSearchHistory();
      
      expect(history[0].timestamp).toBe('2025-01-15T10:30:00Z'); // 最新
      expect(history[4].timestamp).toBe('2025-01-13T11:10:00Z'); // 最舊
    });

    test('應該限制歷史記錄數量', () => {
      const history = SearchBarLogic.getSearchHistory(mockSearchHistory, 3);
      
      expect(history).toHaveLength(3);
      expect(history[0].query).toBe('AI 晶片');
      expect(history[2].query).toBe('電動車');
    });

    test('應該處理空歷史記錄', () => {
      const history = SearchBarLogic.getSearchHistory([]);
      
      expect(history).toHaveLength(0);
    });

    test('應該包含完整的歷史信息', () => {
      const history = SearchBarLogic.getSearchHistory(mockSearchHistory, 1);
      const record = history[0];
      
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('query');
      expect(record).toHaveProperty('timestamp');
      expect(record).toHaveProperty('resultCount');
    });
  });

  describe('查詢驗證', () => {
    test('應該驗證有效查詢', () => {
      const validation = SearchBarLogic.validateQuery('AI 晶片');
      
      expect(validation.isValid).toBe(true);
      expect(validation.query).toBe('AI 晶片');
    });

    test('應該檢測空查詢', () => {
      const validation = SearchBarLogic.validateQuery('');
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('查詢不能為空');
    });

    test('應該檢測 null 查詢', () => {
      const validation = SearchBarLogic.validateQuery(null);
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('查詢不能為空');
    });

    test('應該檢測過短查詢', () => {
      const validation = SearchBarLogic.validateQuery('A');
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('查詢至少需要2個字符');
    });

    test('應該檢測過長查詢', () => {
      const longQuery = 'A'.repeat(101);
      const validation = SearchBarLogic.validateQuery(longQuery);
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('查詢不能超過100個字符');
    });

    test('應該檢測危險字符', () => {
      const validation = SearchBarLogic.validateQuery('AI <script>');
      
      expect(validation.isValid).toBe(false);
      expect(validation.error).toBe('查詢包含無效字符');
    });

    test('應該處理邊界情況', () => {
      const validation1 = SearchBarLogic.validateQuery('AB'); // 剛好2個字符
      const validation2 = SearchBarLogic.validateQuery('A'.repeat(100)); // 剛好100個字符
      
      expect(validation1.isValid).toBe(true);
      expect(validation2.isValid).toBe(true);
    });
  });

  describe('搜尋處理', () => {
    test('應該成功處理有效查詢', () => {
      const result = SearchBarLogic.processSearch('AI 晶片', { limit: 50 });
      
      expect(result.success).toBe(true);
      expect(result.query).toBe('AI 晶片');
      expect(result.searchParams.limit).toBe(50);
      expect(result.message).toBe('搜尋已處理');
    });

    test('應該處理無效查詢', () => {
      const result = SearchBarLogic.processSearch('A');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('查詢至少需要2個字符');
      expect(result.query).toBeNull();
    });

    test('應該包含默認選項', () => {
      const result = SearchBarLogic.processSearch('AI 晶片');
      
      expect(result.searchParams.filters).toEqual({});
      expect(result.searchParams.sortBy).toBe('relevance');
      expect(result.searchParams.limit).toBe(20);
    });

    test('應該記錄時間戳', () => {
      const before = new Date().getTime();
      const result = SearchBarLogic.processSearch('AI 晶片');
      const after = new Date().getTime();
      
      const timestamp = new Date(result.searchParams.timestamp).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('查詢格式化', () => {
    test('應該正確格式化查詢', () => {
      const formatted = SearchBarLogic.formatQuery('  AI  晶片  ');
      
      expect(formatted).toBe('ai 晶片');
    });

    test('應該移除特殊字符', () => {
      const formatted = SearchBarLogic.formatQuery('AI@晶片#123!');
      
      expect(formatted).toBe('ai晶片123');
    });

    test('應該處理多個空格', () => {
      const formatted = SearchBarLogic.formatQuery('AI    晶片');
      
      expect(formatted).toBe('ai 晶片');
    });

    test('應該處理空查詢', () => {
      const formatted = SearchBarLogic.formatQuery('');
      
      expect(formatted).toBe('');
    });

    test('應該處理 null 查詢', () => {
      const formatted = SearchBarLogic.formatQuery(null);
      
      expect(formatted).toBe('');
    });
  });

  describe('查詢檢查', () => {
    test('應該檢測空查詢', () => {
      expect(SearchBarLogic.isEmptyQuery('')).toBe(true);
      expect(SearchBarLogic.isEmptyQuery('   ')).toBe(true);
      expect(SearchBarLogic.isEmptyQuery(null)).toBe(true);
      expect(SearchBarLogic.isEmptyQuery('AI 晶片')).toBe(false);
    });

    test('應該計算查詢長度', () => {
      expect(SearchBarLogic.getQueryLength('')).toBe(0);
      expect(SearchBarLogic.getQueryLength('  AI  ')).toBe(2);
      expect(SearchBarLogic.getQueryLength('AI 晶片')).toBe(5);
    });

    test('應該檢測特殊字符', () => {
      expect(SearchBarLogic.hasSpecialCharacters('AI 晶片')).toBe(false);
      expect(SearchBarLogic.hasSpecialCharacters('AI@晶片')).toBe(true);
      expect(SearchBarLogic.hasSpecialCharacters('AI#晶片')).toBe(true);
    });

    test('應該檢測重複查詢', () => {
      const now = new Date().toISOString();
      const recentHistory = [
        { query: 'AI 晶片', timestamp: now, resultCount: 15 }
      ];
      
      expect(SearchBarLogic.isDuplicateQuery('AI 晶片', recentHistory)).toBe(true);
      expect(SearchBarLogic.isDuplicateQuery('新概念', recentHistory)).toBe(false);
    });

    test('應該處理空歷史記錄', () => {
      expect(SearchBarLogic.isDuplicateQuery('AI 晶片', [])).toBe(false);
    });
  });

  describe('相關查詢建議', () => {
    test('應該建議相關查詢', () => {
      const related = SearchBarLogic.suggestRelatedQueries('AI');
      
      expect(related).toHaveLength(1);
      expect(related).toContain('AI 晶片');
    });

    test('應該按分數排序建議', () => {
      const related = SearchBarLogic.suggestRelatedQueries('技術');
      
      expect(related[0]).toBe('5G 技術'); // 分數 0.87
      expect(related).toHaveLength(1); // 只有 "5G 技術" 包含 "技術"
    });

    test('應該限制建議數量', () => {
      const related = SearchBarLogic.suggestRelatedQueries('技術', mockSuggestions, 2);
      
      expect(related).toHaveLength(1); // 只有一個匹配
    });

    test('應該處理無匹配查詢', () => {
      const related = SearchBarLogic.suggestRelatedQueries('不存在的概念');
      
      expect(related).toHaveLength(0);
    });

    test('應該處理空查詢', () => {
      const related = SearchBarLogic.suggestRelatedQueries('');
      
      expect(related).toHaveLength(0);
    });
  });

  describe('邊界情況', () => {
    test('應該處理極端長度的查詢', () => {
      const shortQuery = 'A';
      const longQuery = 'A'.repeat(101);
      
      expect(SearchBarLogic.validateQuery(shortQuery).isValid).toBe(false);
      expect(SearchBarLogic.validateQuery(longQuery).isValid).toBe(false);
    });

    test('應該處理包含各種字符的查詢', () => {
      const complexQuery = 'AI 晶片 123 @#$%^&*()_+-=[]{}|;:,.<>?';
      const formatted = SearchBarLogic.formatQuery(complexQuery);
      
      expect(formatted).toBe('ai 晶片 123'); // 下劃線和其他特殊字符都被過濾
    });

    test('應該處理中英文混合查詢', () => {
      const mixedQuery = 'AI 晶片 Technology';
      const formatted = SearchBarLogic.formatQuery(mixedQuery);
      
      expect(formatted).toBe('ai 晶片 technology');
    });

    test('應該處理數字查詢', () => {
      const numericQuery = '123 456';
      const formatted = SearchBarLogic.formatQuery(numericQuery);
      
      expect(formatted).toBe('123 456');
    });
  });
});
