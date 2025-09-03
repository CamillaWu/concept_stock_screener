import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('應該渲染預設尺寸的 spinner', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6'); // 預設 md 尺寸
  });

  it('應該渲染小尺寸的 spinner', () => {
    render(<LoadingSpinner size="sm" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('應該渲染大尺寸的 spinner', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('應該應用自定義樣式類', () => {
    render(<LoadingSpinner className="custom-class" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('custom-class');
  });

  it('應該包含正確的基礎樣式類', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-2',
      'border-gray-300',
      'border-t-blue-600'
    );
  });

  it('應該組合尺寸和自定義樣式類', () => {
    render(<LoadingSpinner size="sm" className="my-custom-class" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-4', 'h-4', 'my-custom-class');
  });
});
