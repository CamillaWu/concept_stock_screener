import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBox from '../SearchBox';

describe('SearchBox', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('應該渲染搜尋框和按鈕', () => {
    render(<SearchBox onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText('搜尋股票或概念...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '搜尋' })).toBeInTheDocument();
  });

  it('應該使用自定義佔位符文字', () => {
    render(<SearchBox onSearch={mockOnSearch} placeholder="自定義搜尋..." />);

    expect(screen.getByPlaceholderText('自定義搜尋...')).toBeInTheDocument();
  });

  it('應該應用自定義樣式類', () => {
    render(<SearchBox onSearch={mockOnSearch} className="custom-search-box" />);

    const container = screen.getByTestId('search-box');
    expect(container).toHaveClass('custom-search-box');
  });

  it('應該在輸入文字時更新搜尋查詢', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    await user.type(input, '台積電');

    expect(input).toHaveValue('台積電');
  });

  it('應該在點擊搜尋按鈕時觸發搜尋', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    const searchButton = screen.getByRole('button', { name: '搜尋' });

    await user.type(input, '台積電');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('台積電');
  });

  it('應該在按下 Enter 鍵時觸發搜尋', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    await user.type(input, '台積電');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('台積電');
  });

  it('應該在搜尋查詢為空時禁用搜尋按鈕', () => {
    render(<SearchBox onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole('button', { name: '搜尋' });
    expect(searchButton).toBeDisabled();
  });

  it('應該在輸入文字後啟用搜尋按鈕', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    const searchButton = screen.getByRole('button', { name: '搜尋' });

    expect(searchButton).toBeDisabled();

    await user.type(input, '台積電');
    expect(searchButton).not.toBeDisabled();
  });

  it('應該在搜尋查詢只有空格時禁用搜尋按鈕', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    const searchButton = screen.getByRole('button', { name: '搜尋' });

    await user.type(input, '   ');
    expect(searchButton).toBeDisabled();
  });

  it('應該在觸發搜尋後清空輸入框', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    const searchButton = screen.getByRole('button', { name: '搜尋' });

    await user.type(input, '台積電');
    await user.click(searchButton);

    expect(input).toHaveValue('');
  });

  it('應該在按下 Enter 鍵後清空輸入框', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('搜尋股票或概念...');
    await user.type(input, '台積電');
    await user.keyboard('{Enter}');

    expect(input).toHaveValue('');
  });

  it('不應該在搜尋查詢為空時觸發搜尋', async () => {
    const user = userEvent.setup();
    render(<SearchBox onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole('button', { name: '搜尋' });
    await user.click(searchButton);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
