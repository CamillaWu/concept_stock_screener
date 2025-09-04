import {
  deepClone,
  debounce,
  throttle,
  generateId,
  randomChoice,
  shuffleArray,
  delay,
  isEmpty,
  safeJsonParse,
  formatFileSize,
  truncateText,
  toCamelCase,
  toKebabCase,
} from '../helpers';

describe('helpers 工具函數', () => {
  describe('deepClone', () => {
    it('應該深拷貝基本類型', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });

    it('應該深拷貝數組', () => {
      const original = [1, 2, [3, 4], { a: 5 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
      expect(cloned[3]).not.toBe(original[3]);
    });

    it('應該深拷貝對象', () => {
      const original = { a: 1, b: { c: 2 }, d: [3, 4] };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.d).not.toBe(original.d);
    });

    it('應該深拷貝 Date 對象', () => {
      const original = new Date('2023-12-25');
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned instanceof Date).toBe(true);
    });

    it('應該處理嵌套結構', () => {
      const original = {
        a: [1, { b: [2, 3] }],
        c: { d: [4, { e: 5 }] },
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned.a[1]).not.toBe(original.a[1]);
      expect(cloned.c.d[1]).not.toBe(original.c.d[1]);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('應該延遲執行函數', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc('test');
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(func).toHaveBeenCalledWith('test');
    });

    it('應該在多次調用時重置定時器', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 1000);

      debouncedFunc('first');
      jest.advanceTimersByTime(500);

      debouncedFunc('second');
      jest.advanceTimersByTime(500);

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);
      expect(func).toHaveBeenCalledWith('second');
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('應該限制函數執行頻率', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 1000);

      throttledFunc('first');
      throttledFunc('second');
      throttledFunc('third');

      expect(func).toHaveBeenCalledWith('first');
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);

      throttledFunc('fourth');
      expect(func).toHaveBeenCalledWith('fourth');
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateId', () => {
    it('應該生成唯一 ID', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
    });

    it('應該生成不同格式的 ID', () => {
      const ids = Array.from({ length: 10 }, () => generateId());
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(10);
    });
  });

  describe('randomChoice', () => {
    it('應該從數組中隨機選擇元素', () => {
      const array = [1, 2, 3, 4, 5];
      const choice = randomChoice(array);

      expect(array).toContain(choice);
    });

    it('應該處理單元素數組', () => {
      const array = ['single'];
      const choice = randomChoice(array);

      expect(choice).toBe('single');
    });

    it('應該處理空數組', () => {
      const array: number[] = [];
      const choice = randomChoice(array);

      expect(choice).toBeUndefined();
    });
  });

  describe('shuffleArray', () => {
    it('應該打亂數組順序', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);

      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual(original.sort());
      // 隨機函數可能返回相同順序，這是正常的
      // 我們主要測試函數是否正常工作，而不是強制要求不同順序
    });

    it('應該不修改原數組', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);

      expect(original).toEqual(originalCopy);
    });

    it('應該處理空數組', () => {
      const array: number[] = [];
      const shuffled = shuffleArray(array);

      expect(shuffled).toEqual([]);
    });
  });

  describe('delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('應該延遲指定時間', async () => {
      const promise = delay(1000);

      expect(promise).toBeInstanceOf(Promise);

      jest.advanceTimersByTime(1000);

      await promise;
    });
  });

  describe('isEmpty', () => {
    it('應該檢查 null 和 undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('應該檢查空字符串', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('test')).toBe(false);
    });

    it('應該檢查空數組', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('應該檢查空對象', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('應該處理其他類型', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty(true)).toBe(false);
    });
  });

  describe('safeJsonParse', () => {
    it('應該解析有效的 JSON', () => {
      const json = '{"name": "test", "value": 42}';
      const result = safeJsonParse(json, {});

      expect(result).toEqual({ name: 'test', value: 42 });
    });

    it('應該在解析失敗時返回預設值', () => {
      const invalidJson = 'invalid json';
      const fallback = { error: true };
      const result = safeJsonParse(invalidJson, fallback);

      expect(result).toBe(fallback);
    });

    it('應該處理空字符串', () => {
      const fallback = { empty: true };
      const result = safeJsonParse('', fallback);

      expect(result).toBe(fallback);
    });
  });

  describe('formatFileSize', () => {
    it('應該格式化字節', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('應該格式化 KB', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('應該格式化 MB', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });

    it('應該格式化 GB', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('應該處理大數值', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });
  });

  describe('truncateText', () => {
    it('應該截斷長文本', () => {
      const text = '這是一個很長的文本，需要被截斷';
      const result = truncateText(text, 10);

      expect(result).toBe('這是一個很長的...');
      expect(result.length).toBeLessThanOrEqual(10 + 3);
    });

    it('應該不截斷短文本', () => {
      const text = '短文本';
      const result = truncateText(text, 10);

      expect(result).toBe(text);
    });

    it('應該支持自定義後綴', () => {
      const text = '長文本';
      const result = truncateText(text, 5, '***');

      expect(result).toBe('長***');
    });

    it('應該正確截斷文本', () => {
      const text = '長文本';
      const result = truncateText(text, 4, '***');

      expect(result).toBe('長***');
    });

    it('應該處理後綴長度超過最大長度的情況', () => {
      const text = '長文本';
      const result = truncateText(text, 2, '***');

      expect(result).toBe('***');
    });
  });

  describe('toCamelCase', () => {
    it('應該轉換短橫線命名為駝峰命名', () => {
      expect(toCamelCase('user-name')).toBe('userName');
      expect(toCamelCase('first-name')).toBe('firstName');
      expect(toCamelCase('api-endpoint')).toBe('apiEndpoint');
    });

    it('應該處理單個短橫線', () => {
      expect(toCamelCase('name')).toBe('name');
    });

    it('應該處理多個短橫線', () => {
      expect(toCamelCase('user-profile-settings')).toBe('userProfileSettings');
    });
  });

  describe('toKebabCase', () => {
    it('應該轉換駝峰命名為短橫線命名', () => {
      expect(toKebabCase('userName')).toBe('user-name');
      expect(toKebabCase('firstName')).toBe('first-name');
      expect(toKebabCase('apiEndpoint')).toBe('api-endpoint');
    });

    it('應該處理單個單詞', () => {
      expect(toKebabCase('name')).toBe('name');
    });

    it('應該處理多個大寫字母', () => {
      expect(toKebabCase('userID')).toBe('user-id');
      expect(toKebabCase('APIEndpoint')).toBe('api-endpoint');
    });
  });
});
