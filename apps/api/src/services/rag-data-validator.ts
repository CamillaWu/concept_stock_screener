import { RAGDocument, RAGManifest } from './rag-cache';

/**
 * RAG 資料驗證服務
 * 負責驗證 RAG manifest 和 documents 的完整性和正確性
 */
export class RAGDataValidator {
  /**
   * 驗證 RAG 資料完整性
   */
  static async validateRAGData(
    manifest: RAGManifest,
    documents: RAGDocument[]
  ): Promise<{
    isValid: boolean;
    stats: {
      total: number;
      theme_overview: number;
      theme_to_stock: number;
      errors: string[];
    };
  }> {
    const stats = {
      total: documents.length,
      theme_overview: documents.filter(d => d.type === 'theme_overview').length,
      theme_to_stock: documents.filter(d => d.type === 'theme_to_stock').length,
      errors: [] as string[],
    };

    // 驗證數量
    if (stats.total !== manifest.total) {
      stats.errors.push(`Document count mismatch: expected ${manifest.total}, got ${stats.total}`);
    }

    if (stats.theme_overview !== manifest.theme_overview) {
      stats.errors.push(`Theme overview count mismatch: expected ${manifest.theme_overview}, got ${stats.theme_overview}`);
    }

    if (stats.theme_to_stock !== manifest.theme_to_stock) {
      stats.errors.push(`Theme to stock count mismatch: expected ${manifest.theme_to_stock}, got ${stats.theme_to_stock}`);
    }

    // 驗證必要欄位
    for (const doc of documents) {
      if (!doc.doc_id || !doc.type || !doc.title || !doc.text) {
        stats.errors.push(`Missing required fields in document: ${doc.doc_id}`);
      }
    }

    // 驗證文件類型
    const validTypes = ['theme_overview', 'theme_to_stock'];
    for (const doc of documents) {
      if (!validTypes.includes(doc.type)) {
        stats.errors.push(`Invalid document type: ${doc.type} in document: ${doc.doc_id}`);
      }
    }

    // 驗證主題關聯
    const themeOverviewDocs = documents.filter(d => d.type === 'theme_overview');
    const themeToStockDocs = documents.filter(d => d.type === 'theme_to_stock');
    
    const overviewThemeIds = new Set(themeOverviewDocs.map(d => d.theme_id));
    const stockThemeIds = new Set(themeToStockDocs.map(d => d.theme_id));
    
    // 檢查是否有股票關聯到不存在的主題
    for (const doc of themeToStockDocs) {
      if (!overviewThemeIds.has(doc.theme_id)) {
        stats.errors.push(`Stock document references non-existent theme: ${doc.theme_id}`);
      }
    }

    const isValid = stats.errors.length === 0;

    return { isValid, stats };
  }

  /**
   * 驗證單一文件
   */
  static validateDocument(doc: RAGDocument): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // 檢查必要欄位
    if (!doc.doc_id) errors.push('Missing doc_id');
    if (!doc.type) errors.push('Missing type');
    if (!doc.title) errors.push('Missing title');
    if (!doc.text) errors.push('Missing text');

    // 檢查文件類型
    const validTypes = ['theme_overview', 'theme_to_stock'];
    if (!validTypes.includes(doc.type)) {
      errors.push(`Invalid type: ${doc.type}`);
    }

    // 檢查主題相關欄位
    if (doc.type === 'theme_overview') {
      if (!doc.theme_id) errors.push('Missing theme_id for theme_overview');
      if (!doc.theme_name) errors.push('Missing theme_name for theme_overview');
    }

    if (doc.type === 'theme_to_stock') {
      if (!doc.theme_id) errors.push('Missing theme_id for theme_to_stock');
      if (!doc.theme_name) errors.push('Missing theme_name for theme_to_stock');
      if (!doc.stock_name) errors.push('Missing stock_name for theme_to_stock');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成驗證報告
   */
  static generateValidationReport(
    manifest: RAGManifest,
    documents: RAGDocument[]
  ): {
    summary: {
      totalDocuments: number;
      validDocuments: number;
      invalidDocuments: number;
      totalErrors: number;
    };
    details: {
      manifestValidation: { isValid: boolean; errors: string[] };
      documentValidation: Array<{ docId: string; isValid: boolean; errors: string[] }>;
      dataIntegrity: { isValid: boolean; errors: string[] };
    };
  } {
    // 驗證 manifest
    const manifestValidation = this.validateManifest(manifest);
    
    // 驗證每個文件
    const documentValidation = documents.map(doc => ({
      docId: doc.doc_id,
      ...this.validateDocument(doc)
    }));
    
    // 驗證資料完整性
    const dataIntegrity = this.validateDataIntegrity(manifest, documents);
    
    const validDocuments = documentValidation.filter(d => d.isValid).length;
    const invalidDocuments = documentValidation.filter(d => !d.isValid).length;
    const totalErrors = documentValidation.reduce((sum, d) => sum + d.errors.length, 0) +
                       manifestValidation.errors.length +
                       dataIntegrity.errors.length;

    return {
      summary: {
        totalDocuments: documents.length,
        validDocuments,
        invalidDocuments,
        totalErrors
      },
      details: {
        manifestValidation,
        documentValidation,
        dataIntegrity
      }
    };
  }

  /**
   * 驗證 manifest
   */
  private static validateManifest(manifest: RAGManifest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (manifest.total <= 0) errors.push('Total must be positive');
    if (manifest.theme_overview <= 0) errors.push('Theme overview count must be positive');
    if (manifest.theme_to_stock <= 0) errors.push('Theme to stock count must be positive');
    
    if (manifest.theme_overview + manifest.theme_to_stock !== manifest.total) {
      errors.push('Total does not match sum of theme_overview and theme_to_stock');
    }

    if (!Array.isArray(manifest.fields) || manifest.fields.length === 0) {
      errors.push('Fields must be a non-empty array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 驗證資料完整性
   */
  private static validateDataIntegrity(
    manifest: RAGManifest,
    documents: RAGDocument[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 檢查文件數量
    if (documents.length !== manifest.total) {
      errors.push(`Document count mismatch: expected ${manifest.total}, got ${documents.length}`);
    }

    // 檢查文件類型分布
    const themeOverviewCount = documents.filter(d => d.type === 'theme_overview').length;
    const themeToStockCount = documents.filter(d => d.type === 'theme_to_stock').length;

    if (themeOverviewCount !== manifest.theme_overview) {
      errors.push(`Theme overview count mismatch: expected ${manifest.theme_overview}, got ${themeOverviewCount}`);
    }

    if (themeToStockCount !== manifest.theme_to_stock) {
      errors.push(`Theme to stock count mismatch: expected ${manifest.theme_to_stock}, got ${themeToStockCount}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
