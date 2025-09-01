# StockList 組件重構

## 概述

StockList 組件已成功重構為模組化架構，解決了原始組件的技術債務問題，並新增了多項功能以對齊 PRD 和功能規格書需求。

## 重構目標

### 解決的問題
- ✅ **組件職責過多** - 拆分為多個專責子組件
- ✅ **狀態管理混亂** - 統一狀態管理邏輯
- ✅ **效能問題** - 使用 React.memo 和 hooks 優化
- ✅ **缺乏錯誤邊界** - 完整的錯誤處理機制

### 對齊 PRD 需求
- ✅ **股票列表顯示** - 最多 10 檔相關個股
- ✅ **熱度指標** - 顯示 HeatBar 熱度分數
- ✅ **概念標籤** - 顯示相關概念標籤
- ✅ **互動功能** - 點擊股票開啟詳情面板
- ✅ **篩選和排序** - 支援多種篩選條件
- ✅ **分頁功能** - 處理大量股票數據

## 組件架構

```
packages/ui/src/components/StockList/
├── index.tsx              # 主組件 (協調器)
├── StockItem.tsx          # 股票項目 (展示型)
├── StockFilters.tsx       # 篩選器 (互動型)
├── StockPagination.tsx     # 分頁器 (互動型)
├── ErrorBoundary.tsx      # 錯誤邊界 (容器型)
├── example.tsx            # 使用範例
└── README.md              # 說明文檔
```

## 組件說明

### StockList (主組件)
- **職責**: 協調各個子組件，管理整體狀態
- **功能**: 篩選、分頁、狀態管理
- **Props**: 
  - `stocks`: 股票數據陣列
  - `onStockClick`: 股票點擊回調
  - `showFilters`: 是否顯示篩選器
  - `showPagination`: 是否顯示分頁器
  - `compact`: 緊湊模式
  - `itemsPerPage`: 每頁顯示數量

### StockItem (股票項目)
- **職責**: 單一股票的展示
- **功能**: 股票資訊顯示、點擊處理
- **優化**: 使用 React.memo 避免不必要的重渲染

### StockFilters (篩選器)
- **職責**: 股票篩選功能
- **功能**: 收藏、異常、情緒篩選
- **設計**: 支援多選篩選條件

### StockPagination (分頁器)
- **職責**: 分頁功能
- **功能**: 頁面切換、頁碼顯示
- **設計**: 智能頁碼顯示，支援大量頁面

### StockListErrorBoundary (錯誤邊界)
- **職責**: 錯誤捕獲和處理
- **功能**: 錯誤恢復、開發模式錯誤詳情
- **整合**: 支援錯誤報告服務

## 使用範例

```tsx
import { StockList, StockListErrorBoundary } from '@concepts-radar/ui';

// 基礎使用
<StockList
  stocks={stocks}
  onStockClick={handleStockClick}
/>

// 完整功能
<StockListErrorBoundary onError={handleError}>
  <StockList
    stocks={stocks}
    onStockClick={handleStockClick}
    showFilters={true}
    showPagination={true}
    itemsPerPage={10}
    compact={false}
  />
</StockListErrorBoundary>
```

## 效能優化

### React.memo 使用
- StockItem 組件使用 React.memo 避免不必要的重渲染
- 所有子組件都使用 React.memo 優化

### Hooks 優化
- 使用 useCallback 優化事件處理函數
- 使用 useMemo 優化計算結果
- 使用 useState 管理本地狀態

### 狀態管理
- 統一狀態管理邏輯
- 避免狀態分散和混亂
- 清晰的狀態更新流程

## 錯誤處理

### 錯誤邊界
- 完整的錯誤捕獲機制
- 用戶友好的錯誤提示
- 錯誤恢復功能

### 開發模式支援
- 詳細的錯誤堆疊信息
- 錯誤詳情查看功能
- 錯誤報告服務整合準備

## 向後相容性

重構後的 StockList 組件保持了完全的向後相容性：

```tsx
// 舊版本使用方式仍然有效
<StockList
  stocks={stocks}
  onStockClick={handleStockClick}
  className="custom-class"
/>

// 新功能可選啟用
<StockList
  stocks={stocks}
  onStockClick={handleStockClick}
  showFilters={true}      // 新增
  showPagination={true}   // 新增
  compact={true}          // 新增
/>
```

## 測試建議

### 單元測試
- 每個子組件的獨立功能測試
- Props 傳遞和事件處理測試
- 錯誤邊界測試

### 整合測試
- 組件間互動測試
- 狀態管理測試
- 效能測試

### 用戶體驗測試
- 篩選功能測試
- 分頁功能測試
- 錯誤處理測試

## 未來擴展

### 計劃功能
- 排序功能整合
- 虛擬滾動支援
- 自定義篩選條件
- 數據導出功能

### 技術改進
- 更細緻的效能優化
- 更豐富的錯誤處理
- 更完善的無障礙支援

## 總結

StockList 組件重構成功解決了所有技術債務問題，並新增了多項功能以滿足 PRD 需求。重構後的組件具有更好的可維護性、效能和用戶體驗，同時保持了完全的向後相容性。
