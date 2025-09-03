import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

// 模擬 localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 模擬 console.error
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('應該返回初始值當 localStorage 為空時', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('initial-value');
  });

  it('應該從 localStorage 讀取已存在的值', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('stored-value');
  });

  it('應該支持數字類型', () => {
    const { result } = renderHook(() => useLocalStorage('number-key', 42));

    expect(result.current[0]).toBe(42);
  });

  it('應該支持布爾類型', () => {
    const { result } = renderHook(() => useLocalStorage('bool-key', true));

    expect(result.current[0]).toBe(true);
  });

  it('應該支持對象類型', () => {
    const testObj = { name: 'test', value: 123 };
    const { result } = renderHook(() => useLocalStorage('obj-key', testObj));

    expect(result.current[0]).toEqual(testObj);
  });

  it('應該支持數組類型', () => {
    const testArray = [1, 2, 3, 'test'];
    const { result } = renderHook(() =>
      useLocalStorage('array-key', testArray)
    );

    expect(result.current[0]).toEqual(testArray);
  });

  it('應該在設置新值時更新 state 和 localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
  });

  it('應該支持函數形式的 setter', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'counter',
      JSON.stringify(1)
    );
  });

  it('應該在 localStorage 讀取錯誤時返回初始值', () => {
    // 模擬 localStorage.getItem 拋出錯誤
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() =>
      useLocalStorage('error-key', 'fallback-value')
    );

    expect(result.current[0]).toBe('fallback-value');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error reading localStorage key "error-key":',
      expect.any(Error)
    );
  });

  it('應該在 localStorage 寫入錯誤時不拋出錯誤', () => {
    // 模擬 localStorage.setItem 拋出錯誤
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() =>
      useLocalStorage('error-key', 'initial')
    );

    act(() => {
      result.current[1]('new-value');
    });

    // 應該記錄錯誤但不拋出
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error setting localStorage key "error-key":',
      expect.any(Error)
    );
    // state 應該仍然更新
    expect(result.current[0]).toBe('new-value');
  });

  it('應該在 JSON 解析錯誤時返回初始值', () => {
    // 設置無效的 JSON
    localStorageMock.setItem('invalid-json', 'invalid-json-string');

    const { result } = renderHook(() =>
      useLocalStorage('invalid-json', 'fallback-value')
    );

    expect(result.current[0]).toBe('fallback-value');
  });

  it('應該在多次調用時保持獨立性', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('key1', 'value1')
    );
    const { result: result2 } = renderHook(() =>
      useLocalStorage('key2', 'value2')
    );

    act(() => {
      result1.current[1]('new-value1');
    });

    act(() => {
      result2.current[1]('new-value2');
    });

    expect(result1.current[0]).toBe('new-value1');
    expect(result2.current[0]).toBe('new-value2');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'key1',
      JSON.stringify('new-value1')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'key2',
      JSON.stringify('new-value2')
    );
  });

  it('應該在組件重新渲染時保持值', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage('persistent-key', 'initial')
    );

    act(() => {
      result.current[1]('persistent-value');
    });

    rerender();

    expect(result.current[0]).toBe('persistent-value');
  });

  it('應該處理 null 值', () => {
    const { result } = renderHook(() => useLocalStorage('null-key', null));

    expect(result.current[0]).toBe(null);

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBe(null);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'null-key',
      JSON.stringify(null)
    );
  });

  it('應該處理 undefined 值', () => {
    const { result } = renderHook(() =>
      useLocalStorage('undefined-key', undefined)
    );

    expect(result.current[0]).toBe(undefined);

    act(() => {
      result.current[1](undefined);
    });

    expect(result.current[0]).toBe(undefined);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'undefined-key',
      JSON.stringify(undefined)
    );
  });
});
