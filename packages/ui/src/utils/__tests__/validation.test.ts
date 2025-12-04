import {
  isInRange,
  isInteger,
  isNumeric,
  isValidSearchKeyword,
  isValidStockCode,
  isValidStockName,
  isValidUrl,
} from '../validation';

describe('validation 工具函數', () => {
  describe('isValidStockCode', () => {
    it('應該驗證有效的股票代號', () => {
      expect(isValidStockCode('2330')).toBe(true);
      expect(isValidStockCode('1234')).toBe(true);
      expect(isValidStockCode('12345')).toBe(true);
    });

    it('應該拒絕無效的股票代號', () => {
      expect(isValidStockCode('123')).toBe(false);
      expect(isValidStockCode('123456')).toBe(false);
      expect(isValidStockCode('ABC')).toBe(false);
      expect(isValidStockCode('')).toBe(false);
    });
  });

  describe('isValidStockName', () => {
    it('應該驗證有效的股票名稱', () => {
      expect(isValidStockName('台積電')).toBe(true);
      expect(isValidStockName('聯發科')).toBe(true);
      expect(isValidStockName('A')).toBe(true);
    });

    it('應該拒絕無效的股票名稱', () => {
      expect(isValidStockName('')).toBe(false);
      expect(
        isValidStockName(
          '很長很長很長很長很長很長很長很長很長很長很長的股票名稱'
        )
      ).toBe(false);
    });
  });

  describe('isValidSearchKeyword', () => {
    it('應該驗證有效的搜尋關鍵字', () => {
      expect(isValidSearchKeyword('AI')).toBe(true);
      expect(isValidSearchKeyword('半導體')).toBe(true);
      expect(isValidSearchKeyword('電動車概念股')).toBe(true);
    });

    it('應該拒絕無效的搜尋關鍵字', () => {
      expect(isValidSearchKeyword('')).toBe(false);
      expect(isValidSearchKeyword('   ')).toBe(false);
      expect(
        isValidSearchKeyword(
          '很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長的超長搜尋關鍵字'
        )
      ).toBe(true);
    });
  });

  describe('isValidUrl', () => {
    it('應該驗證有效的 URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('應該拒絕無效的 URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('應該驗證數字', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric(123)).toBe(true);
    });

    it('應該拒絕非數字', () => {
      expect(isNumeric('abc')).toBe(false);
    });
  });

  describe('isInteger', () => {
    it('應該驗證整數', () => {
      expect(isInteger('123')).toBe(true);
      expect(isInteger(123)).toBe(true);
    });

    it('應該拒絕小數', () => {
      expect(isInteger(123.45)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('應該驗證範圍內的值', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
    });

    it('應該拒絕範圍外的值', () => {
      expect(isInRange(15, 1, 10)).toBe(false);
    });
  });
});
