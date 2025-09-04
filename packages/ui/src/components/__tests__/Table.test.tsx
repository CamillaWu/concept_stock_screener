import React from 'react';
import { render, screen } from '@testing-library/react';
import { Table } from '../Table';

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
];

// 測試列配置
const mockColumns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '名稱' },
  { key: 'price', title: '價格' },
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
  });

  it('應該應用自定義樣式類', () => {
    render(
      <Table data={mockData} columns={mockColumns} className="custom-table" />
    );

    const tableContainer = screen.getByRole('table').closest('div');
    expect(tableContainer?.parentElement).toHaveClass('custom-table');
  });

  it('應該處理空數據', () => {
    render(<Table data={[]} columns={mockColumns} />);

    // 應該只顯示標題行
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.queryByText('台積電')).not.toBeInTheDocument();
  });

  it('應該處理單一數據行', () => {
    const singleData = [mockData[0]];
    render(<Table data={singleData} columns={mockColumns} />);

    expect(screen.getByText('台積電')).toBeInTheDocument();
    expect(screen.queryByText('聯發科')).not.toBeInTheDocument();
  });
});
