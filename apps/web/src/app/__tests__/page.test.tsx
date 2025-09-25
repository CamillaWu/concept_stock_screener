import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from '../page';

const mockUseApi = jest.fn();

jest.mock('@ui/components', () => ({
  __esModule: true,
  SearchBox: ({ onSearch }: { onSearch: () => void }) => (
    <button data-testid="search-box" type="button" onClick={onSearch}>
      Trigger Search
    </button>
  ),
}));

jest.mock('@ui/hooks', () => ({
  __esModule: true,
  useApi: (...args: unknown[]) => mockUseApi(...(args as never)),
}));

type ApiState = {
  data: any;
  loading: boolean;
  error: string | null;
  execute: jest.Mock<Promise<void>, []>;
  reset: jest.Mock;
};

const createApiState = (override: Partial<ApiState> = {}): ApiState => ({
  data: null,
  loading: false,
  error: null,
  execute: jest.fn().mockResolvedValue(undefined),
  reset: jest.fn(),
  ...override,
});

beforeEach(() => {
  mockUseApi.mockReset();
});

describe('HomePage', () => {
  it('triggers execute when SearchBox is used', () => {
    const state = createApiState();
    mockUseApi.mockReturnValue(state);

    render(<HomePage />);

    fireEvent.click(screen.getByTestId('search-box'));

    expect(state.execute).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when request is in-flight', () => {
    mockUseApi.mockReturnValue(createApiState({ loading: true }));

    const { container } = render(<HomePage />);

    expect(container.querySelector('.animate-spin')).not.toBeNull();
  });

  it('renders error state when request fails', () => {
    const errorMessage = 'Network error';
    mockUseApi.mockReturnValue(createApiState({ error: errorMessage }));

    render(<HomePage />);

    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('renders data when present', () => {
    const state = createApiState({
      data: {
        message: '搜尋完成',
        stocks: [
          {
            name: 'Taiwan Semiconductor',
            symbol: '2330',
            price: 580,
            change: 10,
            changePercent: 0.02,
          },
        ],
        concepts: [
          {
            name: 'AI Chips',
            description: 'Concept description',
            keywords: ['AI'],
          },
        ],
        total: 2,
        suggestions: ['AI'],
      },
    });
    mockUseApi.mockReturnValue(state);

    render(<HomePage />);

    expect(screen.getByText('搜尋完成')).toBeInTheDocument();
    expect(screen.getByText('Taiwan Semiconductor')).toBeInTheDocument();
    expect(screen.getByText('AI Chips')).toBeInTheDocument();
  });
});
