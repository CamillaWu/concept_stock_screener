import { RAGDocument } from './vector';

/**
 * RAG 查詢服務
 * 負責提供各種 RAG 資料查詢功能
 */
export class RAGQueryService {
  /**
   * 取得主題概覽文件
   */
  static getThemeOverviews(documents: RAGDocument[]): RAGDocument[] {
    return documents.filter(doc => doc.type === 'theme_overview');
  }

  /**
   * 取得特定主題的股票關聯
   */
  static getStocksByTheme(documents: RAGDocument[], themeName: string): RAGDocument[] {
    return documents.filter(doc => 
      doc.type === 'theme_to_stock' && 
      doc.theme_name === themeName
    );
  }

  /**
   * 取得特定股票的主題關聯
   */
  static getThemesByStock(documents: RAGDocument[], stockName: string): RAGDocument[] {
    return documents.filter(doc => 
      doc.type === 'theme_to_stock' && 
      doc.stock_name === stockName
    );
  }

  /**
   * 取得所有主題名稱
   */
  static getAllThemeNames(documents: RAGDocument[]): string[] {
    const themeNames = new Set<string>();
    
    for (const doc of documents) {
      if (doc.theme_name) {
        themeNames.add(doc.theme_name);
      }
    }
    
    return Array.from(themeNames);
  }

  /**
   * 取得所有股票名稱
   */
  static getAllStockNames(documents: RAGDocument[]): string[] {
    const stockNames = new Set<string>();
    
    for (const doc of documents) {
      if (doc.stock_name) {
        stockNames.add(doc.stock_name);
      }
    }
    
    return Array.from(stockNames);
  }

  /**
   * 根據關鍵字搜尋文件
   */
  static searchDocuments(documents: RAGDocument[], query: string): RAGDocument[] {
    const lowerQuery = query.toLowerCase();
    
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.text.toLowerCase().includes(lowerQuery) ||
      doc.theme_name?.toLowerCase().includes(lowerQuery) ||
      doc.stock_name?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 根據文件類型篩選
   */
  static filterByType(documents: RAGDocument[], type: 'theme_overview' | 'theme_to_stock'): RAGDocument[] {
    return documents.filter(doc => doc.type === type);
  }

  /**
   * 根據主題 ID 篩選
   */
  static filterByThemeId(documents: RAGDocument[], themeId: string): RAGDocument[] {
    return documents.filter(doc => doc.theme_id === themeId);
  }

  /**
   * 取得文件統計資訊
   */
  static getDocumentStats(documents: RAGDocument[]): {
    total: number;
    theme_overview: number;
    theme_to_stock: number;
    unique_themes: number;
    unique_stocks: number;
  } {
    const themeNames = new Set<string>();
    const stockNames = new Set<string>();
    
    for (const doc of documents) {
      if (doc.theme_name) themeNames.add(doc.theme_name);
      if (doc.stock_name) stockNames.add(doc.stock_name);
    }
    
    return {
      total: documents.length,
      theme_overview: documents.filter(d => d.type === 'theme_overview').length,
      theme_to_stock: documents.filter(d => d.type === 'theme_to_stock').length,
      unique_themes: themeNames.size,
      unique_stocks: stockNames.size
    };
  }

  /**
   * 生成 RAG 上下文（用於 AI 分析）
   */
  static generateRAGContext(documents: RAGDocument[], query: string, maxLength: number = 4000): string {
    if (documents.length === 0) {
      return '沒有找到相關的 RAG 資料。';
    }

    // 根據查詢類型分類文件
    const themeOverviews = documents.filter(d => d.type === 'theme_overview');
    const stockRelations = documents.filter(d => d.type === 'theme_to_stock');
    
    // 智能選擇最相關的內容
    const relevantDocs = this.selectRelevantDocuments(documents, query);
    
    // 按重要性排序
    const sortedDocs = relevantDocs.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, query);
      const bScore = this.calculateRelevanceScore(b, query);
      return bScore - aScore;
    });

    // 生成結構化上下文
    let context = `基於 RAG 資料庫的查詢：「${query}」\n\n`;
    
    // 添加主題概覽
    if (themeOverviews.length > 0) {
      context += `📊 主題概覽 (${themeOverviews.length} 個主題)：\n`;
      themeOverviews.slice(0, 3).forEach((doc, index) => {
        context += `${index + 1}. ${doc.theme_name}：${doc.text.substring(0, 200)}...\n`;
      });
      context += '\n';
    }

    // 添加股票關聯
    if (stockRelations.length > 0) {
      context += `📈 相關股票 (${stockRelations.length} 個關聯)：\n`;
      const uniqueStocks = new Map<string, RAGDocument>();
      stockRelations.forEach(doc => {
        if (doc.stock_name && !uniqueStocks.has(doc.stock_name)) {
          uniqueStocks.set(doc.stock_name, doc);
        }
      });
      
      Array.from(uniqueStocks.values()).slice(0, 5).forEach((doc, index) => {
        context += `${index + 1}. ${doc.stock_name} (${doc.ticker}) - ${doc.theme_name}：${doc.text.substring(0, 150)}...\n`;
      });
      context += '\n';
    }

    // 添加詳細內容（限制長度）
    let detailedContent = '';
    for (const doc of sortedDocs) {
      const docContent = `【${doc.type === 'theme_overview' ? '主題' : '股票'}】${doc.title}\n${doc.text}\n\n`;
      if (detailedContent.length + docContent.length > maxLength - context.length) {
        break;
      }
      detailedContent += docContent;
    }

    context += `📋 詳細資料：\n${detailedContent}`;
    
    return context;
  }

  /**
   * 選擇最相關的文件
   */
  private static selectRelevantDocuments(documents: RAGDocument[], query: string): RAGDocument[] {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(k => k.length > 1);
    
    return documents.filter(doc => {
      const content = `${doc.title} ${doc.text} ${doc.theme_name} ${doc.stock_name}`.toLowerCase();
      
      // 計算關鍵字匹配度
      const matchScore = keywords.reduce((score, keyword) => {
        if (content.includes(keyword)) {
          return score + 1;
        }
        return score;
      }, 0);
      
      return matchScore > 0;
    });
  }

  /**
   * 計算文件相關性分數
   */
  private static calculateRelevanceScore(doc: RAGDocument, query: string): number {
    const queryLower = query.toLowerCase();
    const content = `${doc.title} ${doc.text}`.toLowerCase();
    
    let score = 0;
    
    // 標題匹配加分
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // 主題名稱匹配加分
    if (doc.theme_name?.toLowerCase().includes(queryLower)) {
      score += 8;
    }
    
    // 股票名稱匹配加分
    if (doc.stock_name?.toLowerCase().includes(queryLower)) {
      score += 8;
    }
    
    // 內容匹配加分
    const contentMatches = (content.match(new RegExp(queryLower, 'g')) || []).length;
    score += contentMatches * 2;
    
    // 主題概覽文件加分
    if (doc.type === 'theme_overview') {
      score += 3;
    }
    
    return score;
  }

  /**
   * 生成結構化的 RAG 摘要
   */
  static generateRAGSummary(documents: RAGDocument[], query: string): {
    totalDocuments: number;
    themeCount: number;
    stockCount: number;
    topThemes: string[];
    topStocks: string[];
    relevanceScore: number;
  } {
    const themeOverviews = documents.filter(d => d.type === 'theme_overview');
    const stockRelations = documents.filter(d => d.type === 'theme_to_stock');
    
    const uniqueThemes = new Set(themeOverviews.map(d => d.theme_name));
    const uniqueStocks = new Set(stockRelations.map(d => d.stock_name).filter(Boolean));
    
    // 計算整體相關性分數
    const totalScore = documents.reduce((sum, doc) => {
      return sum + this.calculateRelevanceScore(doc, query);
    }, 0);
    
    return {
      totalDocuments: documents.length,
      themeCount: themeOverviews.length,
      stockCount: stockRelations.length,
      topThemes: Array.from(uniqueThemes).slice(0, 5),
      topStocks: Array.from(uniqueStocks).filter((stock): stock is string => stock !== undefined).slice(0, 5),
      relevanceScore: totalScore / documents.length
    };
  }
}
