import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

// 模擬定時器
jest.useFakeTimers();

describe('useDebounce', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('應該立即返回初始值', () => {
    const { result } = renderHook(() => useDebounce('initial', 1000));

    expect(result.current).toBe('initial');
  });

  it('應該在延遲後更新值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    // 更新值
    rerender({ value: 'updated', delay: 1000 });

    // 值應該還是舊的
    expect(result.current).toBe('initial');

    // 快進時間
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 等待 useEffect 執行
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // 值應該更新了
    expect(result.current).toBe('updated');
  });

  it('應該在延遲期間保持舊值', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    // 更新值
    rerender({ value: 'updated', delay: 1000 });

    // 快進一半時間
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 值應該還是舊的
    expect(result.current).toBe('initial');
  });

  it('應該在多次更新時重置定時器', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    // 第一次更新
    rerender({ value: 'first', delay: 1000 });

    // 快進 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 第二次更新
    rerender({ value: 'second', delay: 1000 });

    // 快進 500ms（總共 1000ms，但第二次更新重置了定時器）
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 值應該還是舊的
    expect(result.current).toBe('initial');

    // 快進到 1000ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 值應該更新為第二次的值
    expect(result.current).toBe('second');
  });

  it('應該支持不同的延遲時間', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // 快進 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // 等待 useEffect 執行
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBe('updated');
  });

  it('應該支持數字類型', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 1000 } }
    );

    rerender({ value: 100, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 等待 useEffect 執行
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBe(100);
  });

  it('應該支持布爾類型', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: false, delay: 1000 } }
    );

    rerender({ value: true, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 等待 useEffect 執行
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toBe(true);
  });

  it('應該支持對象類型', () => {
    const initialObj = { name: 'initial' };
    const updatedObj = { name: 'updated' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 1000 } }
    );

    rerender({ value: updatedObj, delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 等待 useEffect 執行
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current).toEqual(updatedObj);
  });

  it('應該在組件卸載時清理定時器', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'updated', delay: 1000 });

    // 卸載組件
    unmount();

    // 快進時間
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 組件已卸載，不應該有錯誤
    expect(result.current).toBe('initial');
  });

  it('應該在延遲為 0 時立即更新', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'updated', delay: 0 });

    // 值應該立即更新
    expect(result.current).toBe('updated');
  });
});
