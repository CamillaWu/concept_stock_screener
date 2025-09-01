import React, { useState, useEffect } from 'react';

export type LayoutMode = 'desktop' | 'tablet' | 'mobile';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface LayoutContextType {
  mode: LayoutMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showSidebar: boolean;
  showDetailPanel: boolean;
  showStockPanel: boolean;
  setShowSidebar: (show: boolean) => void;
  setShowDetailPanel: (show: boolean) => void;
  setShowStockPanel: (show: boolean) => void;
}

const LayoutContext = React.createContext<LayoutContextType | null>(null);

export function useLayout() {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within ResponsiveLayout');
  }
  return context;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = ''
}) => {
  const [mode, setMode] = useState<LayoutMode>('desktop');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const [showStockPanel, setShowStockPanel] = useState(false);

  // 檢測螢幕尺寸
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      
      if (width >= 1280) {
        setMode('desktop');
        setShowSidebar(true);
        setShowDetailPanel(true);
      } else if (width >= 768) {
        setMode('tablet');
        setShowSidebar(true);
        setShowDetailPanel(true);
        setShowStockPanel(false);
      } else {
        setMode('mobile');
        setShowSidebar(false);
        setShowDetailPanel(false);
        setShowStockPanel(false);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const contextValue: LayoutContextType = {
    mode,
    isMobile: mode === 'mobile',
    isTablet: mode === 'tablet',
    isDesktop: mode === 'desktop',
    showSidebar,
    showDetailPanel,
    showStockPanel,
    setShowSidebar,
    setShowDetailPanel,
    setShowStockPanel
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className={`min-h-screen ${className}`}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
};

// 側邊欄抽屜元件
interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 抽屜內容 */}
      <div
        className={`fixed top-0 h-full z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          position === 'left' ? 'left-0' : 'right-0'
        } ${
          isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
        } ${className}`}
        style={{
          width: position === 'left' ? '320px' : '384px'
        }}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="關閉"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 內容區域 */}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

// 全螢幕抽屜元件
interface FullScreenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const FullScreenDrawer: React.FC<FullScreenDrawerProps> = ({
  isOpen,
  onClose,
  children,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 全螢幕內容 */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } ${className}`}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="關閉"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 內容區域 */}
        <div className="h-full overflow-y-auto pt-16">
          {children}
        </div>
      </div>
    </>
  );
};

// 響應式容器元件
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = ''
}) => {
  const { mode } = useLayout();

  const containerClasses = {
    desktop: 'max-w-7xl mx-auto px-6',
    tablet: 'max-w-6xl mx-auto px-4',
    mobile: 'px-4'
  };

  return (
    <div className={`${containerClasses[mode]} ${className}`}>
      {children}
    </div>
  );
};
