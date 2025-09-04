import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  formatRelativeTime,
} from '../format';

describe('format 工具函數', () => {
  describe('formatCurrency', () => {
    it('應該格式化台幣金額', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });

    it('應該支持小數點', () => {
      expect(formatCurrency(1000.5)).toBe('$1,000.5');
      expect(formatCurrency(1000.99)).toBe('$1,000.99');
    });

    it('應該支持其他貨幣', () => {
      expect(formatCurrency(1000, 'USD')).toBe('US$1,000');
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000');
    });

    it('應該處理零值', () => {
      expect(formatCurrency(0)).toBe('$0');
    });

    it('應該處理負數', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000');
    });
  });

  describe('formatPercentage', () => {
    it('應該格式化小數為百分比', () => {
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(0.123)).toBe('12.30%');
    });

    it('應該支持自定義小數位數', () => {
      expect(formatPercentage(0.5, 1)).toBe('50.0%');
      expect(formatPercentage(0.123, 3)).toBe('12.300%');
    });

    it('應該處理零值', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });

    it('應該處理大於 1 的值', () => {
      expect(formatPercentage(1.5)).toBe('150.00%');
      expect(formatPercentage(2.0)).toBe('200.00%');
    });
  });

  describe('formatNumber', () => {
    it('應該添加千分位分隔符', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('應該支持小數位數', () => {
      expect(formatNumber(1000.5, 1)).toBe('1,000.5');
      expect(formatNumber(1000.99, 2)).toBe('1,000.99');
    });

    it('應該處理零值', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('應該處理負數', () => {
      expect(formatNumber(-1000)).toBe('-1,000');
    });

    it('應該處理小數', () => {
      expect(formatNumber(0.5, 2)).toBe('0.50');
    });
  });

  describe('formatDate', () => {
    it('應該格式化日期為預設格式', () => {
      const date = new Date('2023-12-25');
      expect(formatDate(date)).toBe('2023-12-25');
    });

    it('應該支持自定義格式', () => {
      const date = new Date('2023-12-25T10:30:45');
      expect(formatDate(date, 'YYYY/MM/DD')).toBe('2023/12/25');
      expect(formatDate(date, 'YYYY年MM月DD日')).toBe('2023年12月25日');
    });

    it('應該支持時間格式', () => {
      const date = new Date('2023-12-25T10:30:45');
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe(
        '2023-12-25 10:30:45'
      );
    });

    it('應該支持字符串日期', () => {
      expect(formatDate('2023-12-25')).toBe('2023-12-25');
      expect(formatDate('2023-12-25T10:30:45')).toBe('2023-12-25');
    });

    it('應該處理無效日期', () => {
      expect(formatDate('invalid-date')).toBe('無效日期');
      expect(formatDate('')).toBe('無效日期');
    });

    it('應該處理部分格式', () => {
      const date = new Date('2023-12-25T10:30:45');
      expect(formatDate(date, 'YYYY-MM')).toBe('2023-12');
      expect(formatDate(date, 'MM-DD')).toBe('12-25');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // 模擬當前時間為 2023-12-25 12:00:00
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-12-25T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('應該顯示剛剛（少於 1 分鐘）', () => {
      const date = new Date('2023-12-25T11:59:30Z');
      expect(formatRelativeTime(date)).toBe('剛剛');
    });

    it('應該顯示分鐘前（少於 1 小時）', () => {
      const date = new Date('2023-12-25T11:30:00Z');
      expect(formatRelativeTime(date)).toBe('30 分鐘前');
    });

    it('應該顯示小時前（少於 1 天）', () => {
      const date = new Date('2023-12-25T08:00:00Z');
      expect(formatRelativeTime(date)).toBe('4 小時前');
    });

    it('應該顯示天前（少於 1 個月）', () => {
      const date = new Date('2023-12-20T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('5 天前');
    });

    it('應該顯示完整日期（超過 1 個月）', () => {
      const date = new Date('2023-10-25T12:00:00Z');
      expect(formatRelativeTime(date)).toBe('2023-10-25');
    });

    it('應該支持字符串日期', () => {
      expect(formatRelativeTime('2023-12-25T11:30:00Z')).toBe('30 分鐘前');
    });

    it('應該處理邊界情況', () => {
      // 59 秒
      const date1 = new Date('2023-12-25T11:59:01Z');
      expect(formatRelativeTime(date1)).toBe('剛剛');

      // 59 分 59 秒
      const date2 = new Date('2023-12-25T11:00:01Z');
      expect(formatRelativeTime(date2)).toBe('59 分鐘前');

      // 23 小時 59 分
      const date3 = new Date('2023-12-24T12:01:00Z');
      expect(formatRelativeTime(date3)).toBe('23 小時前');

      // 29 天 23 小時
      const date4 = new Date('2023-11-25T13:00:00Z');
      expect(formatRelativeTime(date4)).toBe('29 天前');
    });

    it('應該處理未來時間', () => {
      const futureDate = new Date('2023-12-26T12:00:00Z');
      expect(formatRelativeTime(futureDate)).toBe('剛剛');
    });
  });

  describe('邊界情況和錯誤處理', () => {
    it('應該處理極端數值', () => {
      expect(formatCurrency(Number.MAX_SAFE_INTEGER)).toBe(
        '$9,007,199,254,740,991'
      );
      expect(formatPercentage(Number.MAX_VALUE)).toBe('Infinity%');
      expect(formatNumber(Number.MIN_SAFE_INTEGER)).toBe(
        '-9,007,199,254,740,991'
      );
    });

    it('應該處理 NaN 和 Infinity', () => {
      expect(formatCurrency(NaN)).toBe('$非數值');
      expect(formatPercentage(Infinity)).toBe('Infinity%');
      // Intl.NumberFormat 在不同環境下可能返回不同的 Infinity 表示
      const negativeInfinity = formatNumber(-Infinity);
      expect(['-Infinity', '-∞', '負無窮大']).toContain(negativeInfinity);
    });

    it('應該處理空字符串日期', () => {
      expect(formatDate('')).toBe('無效日期');
    });

    it('應該處理 null 和 undefined 日期', () => {
      // @ts-ignore - 測試錯誤輸入
      expect(formatDate(null)).toBe('1970-01-01');
      // @ts-ignore - 測試錯誤輸入
      expect(formatDate(undefined)).toBe('1970-01-01');
    });
  });
});
