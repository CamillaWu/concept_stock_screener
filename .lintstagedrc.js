module.exports = {
  '*.{js,jsx,ts,tsx}': [
    // 1. 運行 ESLint 檢查（不自動修復，確保問題被發現）
    'eslint',
    // 2. 如果 ESLint 通過，運行自動修復
    'eslint --fix',
    // 3. 格式化代碼
    'prettier --write',
  ],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
