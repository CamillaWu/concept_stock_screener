import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class StockListErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('StockList Error Boundary caught an error:', error, errorInfo);
    
    // 調用錯誤處理回調
    this.props.onError?.(error, errorInfo);
    
    // 這裡可以整合錯誤報告服務
    // 例如：Sentry, LogRocket 等
  }

  render() {
    if (this.state.hasError) {
      // 自定義錯誤 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 預設錯誤 UI
      return (
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <div className="text-4xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">股票列表載入失敗</h3>
          <p className="text-sm text-gray-600 mb-4">
            抱歉，載入股票資料時發生錯誤
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            重新載入
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                查看錯誤詳情 (開發模式)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
