import { fireEvent, render, screen } from '@testing-library/react';
import Input from '../Input';

describe('Input 組件', () => {
  const defaultProps = {
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('應該正確渲染輸入框', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('應該設置正確的 type 屬性', () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('應該設置正確的 placeholder', () => {
      const placeholder = '請輸入內容';
      render(<Input {...defaultProps} placeholder={placeholder} />);
      expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
    });

    it('應該設置正確的 value', () => {
      const value = '測試值';
      render(<Input {...defaultProps} value={value} />);
      expect(screen.getByRole('textbox')).toHaveValue(value);
    });

    it('應該設置正確的 className', () => {
      const customClass = 'custom-input-class';
      render(<Input {...defaultProps} className={customClass} />);
      expect(screen.getByRole('textbox')).toHaveClass(customClass);
    });
  });

  describe('類型支援', () => {
    it('應該支援 text 類型', () => {
      render(<Input {...defaultProps} type="text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('應該支援 email 類型', () => {
      render(<Input {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('應該支援 password 類型', () => {
      render(<Input {...defaultProps} type="password" />);
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('應該支援 number 類型', () => {
      render(<Input {...defaultProps} type="number" />);
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
    });

    it('應該支援 search 類型', () => {
      render(<Input {...defaultProps} type="search" />);
      expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
    });
  });

  describe('狀態處理', () => {
    it('應該在輸入時調用 onChange 回調', () => {
      const onChange = jest.fn();
      render(<Input {...defaultProps} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '新值' } });

      expect(onChange).toHaveBeenCalledWith('新值');
    });

    it('應該在禁用狀態下不調用 onChange', () => {
      const onChange = jest.fn();
      render(<Input {...defaultProps} onChange={onChange} disabled />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '新值' } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('應該在禁用狀態下設置 disabled 屬性', () => {
      render(<Input {...defaultProps} disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('應該在禁用狀態下應用禁用樣式', () => {
      render(<Input {...defaultProps} disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
      expect(input).toHaveClass('disabled:opacity-50');
    });

    it('應該設置 required 屬性', () => {
      render(<Input {...defaultProps} required />);
      expect(screen.getByRole('textbox')).toBeRequired();
    });
  });

  describe('鍵盤事件', () => {
    it('應該在按下 Enter 鍵時調用 onKeyPress', () => {
      const onKeyPress = jest.fn();
      render(<Input {...defaultProps} onKeyPress={onKeyPress} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(onKeyPress).toHaveBeenCalledTimes(1);
    });

    it('應該在按下其他鍵時調用 onKeyPress', () => {
      const onKeyPress = jest.fn();
      render(<Input {...defaultProps} onKeyPress={onKeyPress} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });

      expect(onKeyPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('默認值', () => {
    it('應該使用默認的 type', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('應該使用默認的 disabled 狀態', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });

    it('應該使用默認的 required 狀態', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).not.toBeRequired();
    });
  });

  describe('樣式應用', () => {
    it('應該應用基礎樣式類', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex');
      expect(input).toHaveClass('h-10');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('rounded-md');
      expect(input).toHaveClass('border');
      expect(input).toHaveClass('border-gray-300');
    });

    it('應該應用焦點樣式', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:outline-none');
      expect(input).toHaveClass('focus-visible:ring-2');
      expect(input).toHaveClass('focus-visible:ring-blue-500');
    });

    it('應該正確組合自定義樣式', () => {
      const customClass = 'custom-class';
      render(<Input {...defaultProps} className={customClass} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex'); // 基礎樣式
      expect(input).toHaveClass(customClass); // 自定義樣式
    });
  });

  describe('無障礙性', () => {
    it('應該有正確的 role 屬性', () => {
      render(<Input {...defaultProps} />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('應該支援鍵盤導航', () => {
      render(<Input {...defaultProps} />);
      const input = screen.getByRole('textbox');

      input.focus();
      expect(input).toHaveFocus();
    });

    it('應該支援標籤關聯', () => {
      const label = '用戶名';
      render(
        <div>
          <label htmlFor="username">{label}</label>
          <Input {...defaultProps} id="username" />
        </div>
      );

      const input = screen.getByLabelText(label);
      expect(input).toBeInTheDocument();
    });
  });

  describe('邊界情況', () => {
    it('應該處理空的 value', () => {
      render(<Input {...defaultProps} value="" />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('應該處理 undefined value', () => {
      render(<Input {...defaultProps} value={undefined} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('應該處理數字 value', () => {
      const numericValue = 123;
      render(<Input {...defaultProps} value={numericValue} />);
      expect(screen.getByRole('textbox')).toHaveValue(numericValue.toString());
    });

    it('應該處理空的 className', () => {
      render(<Input {...defaultProps} className="" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex'); // 只有基礎樣式
    });
  });
});
