// 驗證工具函數

/**
 * 驗證電子郵件格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 驗證手機號碼格式 (台灣)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^09\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * 驗證身份證字號 (台灣)
 */
export function isValidTaiwanId(id: string): boolean {
  const idRegex = /^[A-Z][12]\d{8}$/;
  if (!idRegex.test(id)) return false;

  const letters = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const letterValues = letters.split('').reduce((acc, letter, index) => {
    acc[letter] = index + 10;
    return acc;
  }, {} as Record<string, number>);

  const firstLetter = id.charAt(0);
  const firstValue = Math.floor(letterValues[firstLetter] / 10) + (letterValues[firstLetter] % 10) * 9;
  
  let sum = firstValue;
  for (let i = 1; i < 9; i++) {
    sum += parseInt(id.charAt(i)) * (9 - i);
  }
  sum += parseInt(id.charAt(9));

  return sum % 10 === 0;
}

/**
 * 驗證密碼強度
 */
export function validatePassword(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length < 8) {
    feedback.push('密碼長度至少需要 8 個字元');
  } else {
    score += 1;
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('需要包含小寫字母');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('需要包含大寫字母');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('需要包含數字');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('建議包含特殊字元');
  }

  const isValid = score >= 3;

  return {
    isValid,
    score,
    feedback,
  };
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
