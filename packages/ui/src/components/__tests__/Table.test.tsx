import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from '../Table';

interface BasicRow {
  id: number;
  name: string;
  price: number;
  category: string;
}

const basicData: BasicRow[] = [
  { id: 1, name: 'Alpha', price: 500, category: 'Semiconductor' },
  { id: 2, name: 'Bravo', price: 800, category: 'Electronics' },
  { id: 3, name: 'Charlie', price: 100, category: 'Manufacturing' },
];

const basicColumns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'price', title: 'Price' },
  { key: 'category', title: 'Category' },
];

describe('Table', () => {
  it('renders headers and rows', () => {
    render(<Table data={basicData} columns={basicColumns} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('filters rows when searchable input is used', async () => {
    const user = userEvent.setup();
    render(<Table data={basicData} columns={basicColumns} searchable />);

    const searchInput = screen.getByRole('textbox');
    await user.type(searchInput, 'Bravo');

    expect(screen.getByText('Bravo')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('sorts rows and toggles sort order on repeated clicks', async () => {
    const sortableColumns = [
      { key: 'name', title: 'Name', sortable: true },
      { key: 'price', title: 'Price', sortable: true },
    ];

    const sortableData = [
      { name: 'Charlie', price: 75 },
      { name: 'Bravo', price: 90 },
      { name: 'Alpha', price: 60 },
    ];

    const user = userEvent.setup();
    render(<Table data={sortableData} columns={sortableColumns} sortable />);

    const header = screen.getByText('Name');

    // Ascending
    await user.click(header);
    let firstRowCells = within(screen.getAllByRole('row')[1]).getAllByRole(
      'cell'
    );
    expect(firstRowCells[0]).toHaveTextContent('Alpha');

    // Descending
    await user.click(header);
    firstRowCells = within(screen.getAllByRole('row')[1]).getAllByRole('cell');
    expect(firstRowCells[0]).toHaveTextContent('Charlie');
  });

  it('honours custom render functions', () => {
    const columnsWithRender = [
      { key: 'name', title: 'Name' },
      {
        key: 'price',
        title: 'Price',
        render: (value: BasicRow['price']) => `$${value.toFixed(2)}`,
      },
    ];

    render(<Table data={basicData.slice(0, 1)} columns={columnsWithRender} />);

    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('paginates data and navigates between pages', async () => {
    const user = userEvent.setup();
    const paginatedData = Array.from({ length: 12 }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
      price: index * 10,
      category: 'Category',
    }));

    render(
      <Table data={paginatedData} columns={basicColumns} pagination sortable />
    );

    // First page shows Item 1 but not Item 11
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 11')).not.toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];
    const nextButton = buttons[1];

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();

    await user.click(nextButton);

    expect(prevButton).not.toBeDisabled();
    expect(screen.getByText('Item 11')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

    expect(nextButton).toBeDisabled();
  });
});
