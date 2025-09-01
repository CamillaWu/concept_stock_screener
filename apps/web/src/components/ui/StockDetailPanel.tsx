import React from 'react';
import type { StockAnalysisResult } from '@concepts-radar/types';
import { StockDetailPanel as UIStockDetailPanel } from '@concepts-radar/ui';

interface StockDetailPanelProps {
  stock: StockAnalysisResult;
  useRealData?: boolean;
  className?: string;
}

export const StockDetailPanel: React.FC<StockDetailPanelProps> = ({
  stock,
  useRealData = false,
  className = ''
}) => {
  return (
    <UIStockDetailPanel
      analysis={stock}
      useRealData={useRealData}
      showStockAttribution={true}
      className={className}
    />
  );
};
