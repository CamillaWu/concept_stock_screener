import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button 組件', () => {
  const defaultProps = {
    children: '測試按鈕',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('應該正確渲染按鈕文字', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByText('測試按鈕')).toBeInTheDocument();
    });

    it('應該設置正確的 type 屬性', () => {
      render(<Button {...defaultProps} type="submit" />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('應該設置正確的 className', () => {
      const customClass = 'custom-button-class';
      render(<Button {...defaultProps} className={customClass} />);
      expect(screen.getByRole('button')).toHaveClass(customClass);
    });
  });

  describe('變體樣式', () => {
    it('應該應用 primary 變體樣式', () => {
      render(<Button {...defaultProps} variant="primary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
      expect(button).toHaveClass('text-white');
    });

    it('應該應用 secondary 變體樣式', () => {
      render(<Button {...defaultProps} variant="secondary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600');
      expect(button).toHaveClass('text-white');
    });

    it('應該應用 outline 變體樣式', () => {
      render(<Button {...defaultProps} variant="outline" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('bg-transparent');
    });

    it('應該應用 ghost 變體樣式', () => {
      render(<Button {...defaultProps} variant="ghost" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-gray-100');
    });
  });

  describe('尺寸樣式', () => {
    it('應該應用 sm 尺寸樣式', () => {
      render(<Button {...defaultProps} size="sm" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-8');
      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('text-sm');
    });

    it('應該應用 md 尺寸樣式', () => {
      render(<Button {...defaultProps} size="md" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('應該應用 lg 尺寸樣式', () => {
      render(<Button {...defaultProps} size="lg" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('text-lg');
    });
  });

  describe('狀態處理', () => {
    it('應該在點擊時調用 onClick 回調', () => {
      const onClick = jest.fn();
      render(<Button {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('應該在禁用狀態下不調用 onClick', () => {
      const onClick = jest.fn();
      render(<Button {...defaultProps} onClick={onClick} disabled />);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('應該在禁用狀態下設置 disabled 屬性', () => {
      render(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('應該在禁用狀態下應用禁用樣式', () => {
      render(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:opacity-50');
      expect(button).toHaveClass('disabled:pointer-events-none');
    });
  });

  describe('默認值', () => {
    it('應該使用默認的 variant', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600'); // primary 默認值
    });

    it('應該使用默認的 size', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10'); // md 默認值
      expect(button).toHaveClass('px-4'); // md 默認值
    });

    it('應該使用默認的 type', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('應該使用默認的 disabled 狀態', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('無障礙性', () => {
    it('應該有正確的 role 屬性', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('應該支援鍵盤導航', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');

      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('樣式組合', () => {
    it('應該正確組合多個樣式類', () => {
      render(
        <Button
          {...defaultProps}
          variant="secondary"
          size="lg"
          className="custom-class"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-600'); // secondary
      expect(button).toHaveClass('h-12'); // lg
      expect(button).toHaveClass('custom-class'); // custom
      expect(button).toHaveClass('inline-flex'); // base
    });

    it('應該正確處理空的 className', () => {
      render(<Button {...defaultProps} className="" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('inline-flex'); // 只有基礎樣式
    });
  });
});
