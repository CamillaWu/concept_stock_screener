// 驗證工具函數 - 概念股篩選系統專用

/**
 * 驗證股票代號格式 (台灣股市)
 */
export function isValidStockCode(code: string): boolean {
  const stockCodeRegex = /^\d{4,5}$/;
  return stockCodeRegex.test(code);
}

/**
 * 驗證股票名稱格式
 */
export function isValidStockName(name: string): boolean {
  return name.length >= 1 && name.length <= 20;
}

/**
 * 驗證搜尋關鍵字
 */
export function isValidSearchKeyword(keyword: string): boolean {
  return keyword.trim().length >= 1 && keyword.trim().length <= 100;
}

/**
 * 驗證 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 驗證是否為數字
 */
export function isNumeric(value: string | number): boolean {
  return !isNaN(Number(value)) && !isNaN(parseFloat(String(value)));
}

/**
 * 驗證是否為整數
 */
export function isInteger(value: string | number): boolean {
  return Number.isInteger(Number(value));
}

/**
 * 驗證範圍值
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
