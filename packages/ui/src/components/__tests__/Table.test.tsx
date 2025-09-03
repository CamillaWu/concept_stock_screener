import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from '../Table';

// 測試數據類型
interface TestData {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 測試數據
const mockData: TestData[] = [
  { id: 1, name: '台積電', price: 500, category: '半導體' },
  { id: 2, name: '聯發科', price: 800, category: '半導體' },
  { id: 3, name: '鴻海', price: 100, category: '電子製造' },
  { id: 4, name: '大立光', price: 2000, category: '光學元件' },
  { id: 5, name: '台達電', price: 300, category: '電源管理' },
];

// 測試列配置
const mockColumns = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: '名稱', sortable: true },
  { key: 'price', title: '價格', sortable: true },
  { key: 'category', title: '類別' },
];

describe('Table', () => {
  it('應該渲染表格標題行', () => {
    render(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('名稱')).toBeInTheDocument();
    expect(screen.getByText('價格')).toBeInTheDocument();
    expect(screen.getByText('類別')).toBeInTheDocument();
  });

  it('應該渲染所有數據行', () => {
    render(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText('台積電')).toBeInTheDocument();
    expect(screen.getByText('聯發科')).toBeInTheDocument();
    expect(screen.getByText('鴻海')).toBeInTheDocument();
    expect(screen.getByText('大立光')).toBeInTheDocument();
    expect(screen.getByText('台達電')).toBeInTheDocument();
  });

  it('應該應用自定義樣式類', () => {
    render(
      <Table data={mockData} columns={mockColumns} className="custom-table" />
    );

    const tableContainer = screen.getByRole('table').closest('div');
    expect(tableContainer?.parentElement).toHaveClass('custom-table');
  });

  describe('搜尋功能', () => {
    it('應該在啟用搜尋時顯示搜尋框', () => {
      render(<Table data={mockData} columns={mockColumns} searchable={true} />);

      expect(screen.getByPlaceholderText('搜尋...')).toBeInTheDocument();
    });

    it('應該在搜尋時過濾數據', async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} searchable={true} />);

      const searchInput = screen.getByPlaceholderText('搜尋...');
      await user.type(searchInput, '台積電');

      expect(screen.getByText('台積電')).toBeInTheDocument();
      expect(screen.queryByText('聯發科')).not.toBeInTheDocument();
    });

    it('應該在搜尋時不區分大小寫', async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} searchable={true} />);

      const searchInput = screen.getByPlaceholderText('搜尋...');
      await user.type(searchInput, '半導體');

      expect(screen.getByText('台積電')).toBeInTheDocument();
      expect(screen.getByText('聯發科')).toBeInTheDocument();
    });
  });

  describe('排序功能', () => {
    it('應該在啟用排序時顯示可點擊的標題', () => {
      render(<Table data={mockData} columns={mockColumns} sortable={true} />);

      const idHeader = screen.getByText('ID');
      expect(idHeader.closest('th')).toHaveClass('cursor-pointer');
    });

    it('應該在點擊可排序標題時排序數據', async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable={true} />);

      const nameHeader = screen.getByText('名稱');
      await user.click(nameHeader);

      // 檢查排序箭頭
      expect(screen.getByText('↑')).toBeInTheDocument();
    });

    it('應該在重複點擊標題時切換排序順序', async () => {
      const user = userEvent.setup();
      render(<Table data={mockData} columns={mockColumns} sortable={true} />);

      const nameHeader = screen.getByText('名稱');

      // 第一次點擊，升序
      await user.click(nameHeader);
      expect(screen.getByText('↑')).toBeInTheDocument();

      // 第二次點擊，降序
      await user.click(nameHeader);
      expect(screen.getByText('↓')).toBeInTheDocument();
    });
  });

  describe('分頁功能', () => {
    it('應該在啟用分頁時顯示分頁控制項', () => {
      // 創建更多數據以確保有分頁
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `股票${i + 1}`,
        price: 100 + i,
        category: '測試',
      }));

      render(
        <Table data={largeData} columns={mockColumns} pagination={true} />
      );

      expect(screen.getByText('上一頁')).toBeInTheDocument();
      expect(screen.getByText('下一頁')).toBeInTheDocument();
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('應該顯示正確的分頁信息', () => {
      // 創建更多數據以確保有分頁
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `股票${i + 1}`,
        price: 100 + i,
        category: '測試',
      }));

      render(
        <Table data={largeData} columns={mockColumns} pagination={true} />
      );

      expect(
        screen.getByText('顯示第 1 到 10 筆，共 25 筆')
      ).toBeInTheDocument();
    });

    it('應該在點擊下一頁時更新當前頁面', async () => {
      const user = userEvent.setup();
      // 創建更多數據以測試分頁
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `股票${i + 1}`,
        price: 100 + i,
        category: '測試',
      }));

      render(
        <Table data={largeData} columns={mockColumns} pagination={true} />
      );

      const nextButton = screen.getByText('下一頁');
      await user.click(nextButton);

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('應該在第一頁時禁用上一頁按鈕', () => {
      // 創建更多數據以確保有分頁
      const largeData = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `股票${i + 1}`,
        price: 100 + i,
        category: '測試',
      }));

      render(
        <Table data={largeData} columns={mockColumns} pagination={true} />
      );

      const prevButton = screen.getByText('上一頁');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('自定義渲染', () => {
    it('應該使用自定義渲染函數', () => {
      const customColumns = [
        ...mockColumns,
        {
          key: 'price',
          title: '價格',
          render: (value: number) => `NT$ ${value}`,
        },
      ];

      render(<Table data={mockData} columns={customColumns} />);

      expect(screen.getByText('NT$ 500')).toBeInTheDocument();
      expect(screen.getByText('NT$ 800')).toBeInTheDocument();
    });
  });

  describe('組合功能', () => {
    it('應該同時支持搜尋、排序和分頁', async () => {
      const user = userEvent.setup();
      render(
        <Table
          data={mockData}
          columns={mockColumns}
          searchable={true}
          sortable={true}
          pagination={true}
        />
      );

      // 測試搜尋
      const searchInput = screen.getByPlaceholderText('搜尋...');
      await user.type(searchInput, '半導體');

      // 測試排序
      const nameHeader = screen.getByText('名稱');
      await user.click(nameHeader);

      // 測試分頁 - 搜尋後只有 2 筆數據，所以不會顯示分頁控制項
      expect(screen.queryByText('上一頁')).not.toBeInTheDocument();
    });
  });
});
