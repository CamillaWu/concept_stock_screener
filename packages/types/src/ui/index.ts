// UI 相關類型定義
export interface ComponentProps {
  className?: string;
  children?: unknown; // 簡化類型定義，避免 React 依賴
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export interface TableProps<T> extends ComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: boolean;
  searchable?: boolean;
  sortable?: boolean;
}

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => unknown;
}
